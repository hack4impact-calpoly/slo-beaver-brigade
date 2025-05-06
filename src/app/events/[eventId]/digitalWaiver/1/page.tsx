"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useToast,
  Text,
} from "@chakra-ui/react";
import styles from "./page.module.css";
import beaverLogo from "/docs/images/beaver-logo.png";
import Image from "next/image";
import { IUser } from "@database/userSchema";
import { addToRegistered } from "@app/actions/useractions";
import { getUserDbData } from "app/lib/authentication";
import { createGuestFromEmail, getUserFromEmail } from "app/actions/userapi";
import { useRouter } from "next/navigation";
import { IEvent } from "database/eventSchema";
import { useEventsAscending } from "app/lib/swrfunctions";
import "../../../../fonts/fonts.css";

type IParams = {
  params: {
    eventId: string;
  };
};

export default function Waiver({ params: { eventId } }: IParams) {
  const toast = useToast();
  const { mutate } = useEventsAscending();
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [dependents, setDependents] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signature, setSignature] = useState("");
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [eventData, setEventData] = useState<IEvent | null>(null);
  const [emailChecked, setEmailChecked] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [activeWaiver, setActiveWaiver] = useState<any>(null);

  // Fetch active waiver
  useEffect(() => {
    const fetchActiveWaiver = async () => {
      try {
        const response = await fetch("/api/waiver-versions");
        const data = await response.json();
        const active = data.waiverVersions.find((w: any) => w.isActiveWaiver);
        if (active) {
          setActiveWaiver(active);
        } else {
          toast({
            title: "No active waiver found",
            description: "Please contact an administrator",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error fetching active waiver:", error);
        toast({
          title: "Error loading waiver",
          description: "Please try again later",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchActiveWaiver();
  }, []);

  // Update the waiver text to use active waiver content
  const waiverText = activeWaiver?.body || "Loading waiver...";
  const signatureText =
    activeWaiver?.acknowledgement || "Loading acknowledgement...";

  // Scroll check for waiver
  const handleTextareaScroll = (event: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setIsScrolledToBottom(scrollTop + clientHeight + 50 >= scrollHeight);
  };

  // User data and dependent functions
  const addDependent = () => {
    const emptyFieldCount = dependents.filter(
      (dependent) => dependent === ""
    ).length;
    if (emptyFieldCount <= 1) {
      setDependents([...dependents, ""]);
    }
  };

  const handleDeleteDependent = (indexToDelete: number) => {
    setDependents(dependents.filter((_, index) => index !== indexToDelete));
  };

  const handleDependentChange = (index: number, value: string) => {
    const newDependents = [...dependents];
    newDependents[index] = value;
    setDependents(newDependents);
  };

  function handleSkip() {
    setModalOpen(false);
    router.push("/");
  }

  function handleCreateAccount() {
    setModalOpen(false);
    const userData = {
      email: email,
      zipcode: zipcode,
      firstName: firstName,
      lastName: lastName,
    };
    sessionStorage.setItem("userData", JSON.stringify(userData));
    router.push("/signup");
  }

  // Submission handler (similar to previous implementation)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeWaiver) {
      toast({
        title: "No active waiver found",
        description: "Please contact an administrator",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!isScrolledToBottom) {
      toast({
        title: "Please scroll to the bottom of the waiver before submitting.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setEmailChecked(true);
    const dependentArray = dependents.filter((dependent) => dependent !== "");

    const signedWaiver = {
      dependents: dependentArray,
      eventId: eventId,
      dateSigned: new Date(),
      waiverVersion: activeWaiver.version,
    };

    if (userData) {
      setValidEmail(true);
      try {
        const res = await fetch(`/api/waiver`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signeeId: userData._id,
            signeeName: userData.firstName + " " + userData.lastName,
            ...signedWaiver,
          }),
        });
        //if the waiver returns successfully
        if (res.ok) {
          const responseData = await res.json();
          const waiverId = responseData._id;

          try {
            //call to update the user object
            const res = await addToRegistered(userData._id, eventId, waiverId);
            if (res) {
              mutate((events) => {
                if (events) {
                  events.map((event) => {
                    if (event._id == eventId) {
                      return {
                        ...event,
                        registeredIds: [...event.registeredIds, userData._id],
                      };
                    }
                    return event;
                  });
                }
                return events;
              });

              //const emailBody = { email: userData.email };
              // const confirmRes = await fetch(
              //   `/api/events/confirmation/${eventId}`,
              //   {
              //     method: "POST",
              //     headers: { "Content-Type": "application/json" },
              //     body: JSON.stringify(emailBody),
              //   }
              // );

              //on success, return to the home page
              router.push("/");
            } else {
              console.error("Error adding info to user");
            }
          } catch (error) {
            console.error("Error adding info to user", error);
          }
        } else {
          console.error("Error creating waiver", res.statusText);
        }
      } catch (error) {
        console.error("Error creating waiver:", error);
      }
    } else {
      //finds the userId associated with the given email
      const fetchUser = async () => {
        let user: IUser | null = null;
        const res = await getUserFromEmail(email);
        if (res) {
          user = JSON.parse(res) as IUser;
        }
        return user;
      };
      let user = await fetchUser();

      //if a user exists for the given email, create a new waiver
      //returns the waiverId,
      if (!user) {
        let userRes = await createGuestFromEmail(
          email,
          zipcode,
          firstName,
          lastName
        );
        if (!userRes) {
          return;
        }
        user = JSON.parse(userRes);
      }

      if (user && user.role == "guest") {
        setValidEmail(true);
        try {
          const res = await fetch(`/api/waiver`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              signeeId: user._id,
              signeeName: user.firstName + " " + user.lastName,
              ...signedWaiver,
            }),
          });
          //if the waiver returns successfully
          if (res.ok) {
            const responseData = await res.json();
            const waiverId = responseData._id;

            try {
              //call to update the user object
              const res = await addToRegistered(user._id, eventId, waiverId);
              if (res) {
                mutate((events) => {
                  if (events) {
                    events.map((event) => {
                      if (event._id == eventId) {
                        return {
                          ...event,
                          registeredIds: [...event.registeredIds, user._id],
                        };
                      }
                      return event;
                    });
                  }
                  return events;
                });

                //const emailBody = { email: user.email };
                // const confirmRes = await fetch(
                //   `/api/events/confirmation/${eventId}`,
                //   {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     body: JSON.stringify(emailBody),
                //   }
                // );
                //on success, open modal prompting user to create an account
                setModalOpen(true);
              } else {
                console.error("Error adding info to user");
              }
            } catch (error) {
              console.error("Error adding info to user", error);
            }
          } else {
            console.error("Error creating waiver", res.statusText);
          }
        } catch (error) {
          console.error("Error creating waiver:", error);
        }
      } else {
        onOpen();
      }
    }
  };

  // Fetch user data and event data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      let res = await getUserDbData();
      if (res) {
        setUserData(JSON.parse(res));
      }
      setLoadingUser(false);
    };
    fetchUserData();

    const fetchEvent = async () => {
      const res = await fetch(`/api/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setEventData(data);
      }
    };
    fetchEvent();
  }, []);

  return (
    <div>
      <Flex
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        marginTop={{ base: "2vh", md: "5vh" }}
      >
        <Image src={beaverLogo} alt="beaver" />

        <Box w={["90%", "80%"]} h="70%" mt={{ base: 10, md: 15 }} mb={0}>
          <h1
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "2rem",
            }}
          >
            Waiver of Liability and Hold Harmless Agreement
          </h1>
          <Textarea
            className={styles.scroller}
            resize="none"
            readOnly
            height="400px"
            whiteSpace="pre-line"
            mt={5}
            value={waiverText}
            onScroll={handleTextareaScroll}
          />
        </Box>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box w={["90%", "80%"]}>
            {/* User Information Section */}
            {!userData && !loadingUser && (
              <div className="flex flex-col">
                <h2 className={styles.formHeading}>Contact Information</h2>
                <div className="flex flex-col md:flex-row">
                  <input
                    className={styles.inputForm}
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <input
                    className={styles.inputForm}
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row">
                  <input
                    className={styles.inputForm}
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    className={styles.inputForm}
                    type="text"
                    placeholder="Zipcode"
                    onChange={(e) => setZipcode(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <Box p={4} mt={5}>
              {signatureText}
            </Box>

            <button
              type="button"
              onClick={addDependent}
              className={styles.addDependent}
              style={{ color: "#ECB94A" }}
            >
              Add Dependent +
            </button>

            {/* Dependents Section */}
            <table width="100%">
              <tbody>
                {dependents.map((name, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        className={styles.dependentTable}
                        type="text"
                        value={name}
                        onChange={(event) =>
                          handleDependentChange(index, event.target.value)
                        }
                        style={{
                          display: index === 0 ? "none" : "block",
                          flex: 1,
                        }}
                        placeholder="Dependent Full Name"
                      />
                      {index !== 0 && (
                        <Button
                          onClick={() => handleDeleteDependent(index)}
                          size={{ base: "xs", md: "sm" }}
                          colorScheme="red"
                          variant="outline"
                          style={{
                            marginTop: "15px",
                          }}
                        >
                          ×
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature Section */}
            <h2 className={styles.formHeading}>Sign Here</h2>
            <input
              className={styles.inputSignature}
              type="text"
              placeholder="Signature"
              onChange={(e) => setSignature(e.target.value)}
              required
            />
          </Box>
          <Button
            type="submit"
            mt={8}
            mb={"3%"}
            sx={{
              width: { base: "100%", md: "225px" },
              height: "40px",
              backgroundColor: "#337774",
              color: "white",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#296361",
              },
            }}
          >
            Submit
          </Button>
        </form>
      </Flex>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        size={{ base: "sm", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent mt={{ base: "40px", md: "70px" }}>
          <ModalHeader>
            <Flex
              justifyContent={"center"}
              w={"100%"}
              mt={{ base: "5%", md: "10%" }}
              mb={"5%"}
            >
              <Image
                src={beaverLogo}
                alt="beaver"
                style={{
                  marginTop: "10px",
                }}
              />
            </Flex>
          </ModalHeader>
          <ModalBody textAlign={"center"} mb={{ base: "30px", md: "50px" }}>
            <Text fontSize={{ base: "md", md: "xl" }}>
              Thank you for signing up for
            </Text>
            <Text
              fontSize={{ base: "xl", md: "3xl" }}
              fontWeight={"bold"}
              mt={{ base: "15px", md: "25px" }}
              mb={{ base: "30px", md: "50px" }}
            >
              {eventData?.eventName}
            </Text>
            <Text fontSize={{ base: "sm", md: "lg" }} px={{ base: 5, md: 10 }}>
              You can create an account to view your upcoming event!
            </Text>
          </ModalBody>
          <ModalFooter
            justifyContent={"space-around"}
            mb={{ base: "40px", md: "65px" }}
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: 3, md: 0 }}
          >
            <Button
              fontSize={{ base: "sm", md: "md" }}
              color="#B5B5B5"
              borderColor="gray"
              w={{ base: "100%", md: "35%" }}
              variant={"outline"}
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button
              fontWeight={"bold"}
              fontSize={{ base: "sm", md: "md" }}
              bg="#337774"
              color="white"
              _hover={{ bg: "#4a9b99" }}
              w={{ base: "100%", md: "35%" }}
              onClick={handleCreateAccount}
            >
              Create Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
