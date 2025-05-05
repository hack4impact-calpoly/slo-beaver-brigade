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
  Spinner,
} from "@chakra-ui/react";
import styles from "./page.module.css";
import beaverLogo from "/docs/images/beaver-logo.png";
import Image from "next/image";
import { IUser } from "@database/userSchema";
import { addToRegistered } from "@app/actions/useractions";
import { getUserDbData } from "app/lib/authentication";
import { createGuestFromEmail, getUserFromEmail } from "app/actions/userapi";
import { useRouter, useSearchParams } from "next/navigation";
import { IEvent } from "database/eventSchema";
import { useEventsAscending } from "app/lib/swrfunctions";
import { ISignedWaiver } from "database/signedWaiverSchema";
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
  const [dependents, setDependents] = useState([""]);
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
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [eventData, setEventData] = useState<IEvent | null>(null);
  const [emailChecked, setEmailChecked] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [signedWaiver, setSignedWaiver] = useState<ISignedWaiver | null>(null);
  const [loadingWaiver, setLoadingWaiver] = useState(true);

  // Waiver text
  const waiverText = `1. I am voluntarily joining an activity sponsored by the SLO Beaver Brigade, which may include tours to and from and in and around beaver ponds, as well as litter and brush removal or planting in riverbeds and creekbeds, and related activities.

   2. I understand that the SLO Beaver Brigade has no duty or responsibility for me or my dependents' safety or property. I am participating in this activity entirely at my own risk and assume full responsibility for any and all bodily injury, disability, death, or property damage as a result of my participation in a SLO Beaver Brigade event. I recognize that these risks may include hiking, crossing streams or wading through water, falling trees and limbs, poison oak, stinging nettles, thistles and other barbed plants, poisonous insects, snakes including rattlesnakes, ticks, wild animals, inclement weather, wildfires or floods, homeless encampments, sharp objects in and around the riverbed such as barbed wire, unsupervised dogs or horses, ATV riders, dirt bikers or other vehicles, hunters, target shooters, poachers, and any other risks on or around the premises of the activity, known or unknown to me or event organizers and leaders.

   3. I hereby RELEASE, WAIVE, and DISCHARGE the SLO Beaver Brigade, Dr. Emily Fairfax, Audrey Taub, Cooper Lienhart, Kate Montgomery, Fred Frank, Hannah Strauss, landowners, and Beaver Brigade interns/fellows, volunteers, members, sponsors, affiliates and other agents from any and all liability, claims, demands and actions whatsoever, regardless of whether such loss is caused by the acts or failures to act of any party organizing or leading a specific event or activity on behalf of the SLO Beaver Brigade, and I surrender any and all rights to seek compensation for any injury whatsoever sustained during my participation in a SLO Beaver Brigade activity. I agree to INDEMNIFY and HOLD HARMLESS releases against any and all claims, suits, or actions brought by me, my spouse, family, heirs, or anyone else on behalf of me or my dependents, and agree to reimburse all attorney's fees and related costs that may be incurred by releases due to my participation in SLO Beaver Brigade events or activities.

   4. I hereby grant the SLO Beaver Brigade permission to use my likeness in a photograph, video, or other digital media ("photo") in any and all of its publications, including web-based publications, without payment or other consideration. I hereby irrevocably authorize the SLO Beaver Brigade to edit, alter, copy, exhibit, publish, or distribute these photos for any lawful purpose. In addition, I waive any right to inspect or approve the finished product wherein my likeness appears. Additionally, I waive any right to royalties or other compensation arising from or related to the use of the photo.`;

  const signatureText = `BY SIGNING THIS AGREEMENT, I ACKNOWLEDGE AND REPRESENT THAT I HAVE READ THIS WAIVER OF LIABILITY AND HOLD HARMLESS AGREEMENT, that I fully understand and consent to the terms of this agreement, and that I am signing it of my own free will. I agree that no oral representations, statements, or inducements apart from this written agreement have been made or implied. I am at least 18 years of age, fully competent, responsible, and legally able to sign this agreement for myself or my dependents.`;

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

  // Fetch user data, event data, and waiver data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if we're in view mode
        const mode = searchParams.get("mode");
        setIsViewMode(mode === "view");

        // Fetch user data
        const userRes = await getUserDbData();
        if (userRes) {
          const user = JSON.parse(userRes);
          setUserData(user);

          // If in view mode, fetch the waiver data
          if (mode === "view") {
            const waiverResponse = await fetch(`/api/waiver/${eventId}`);
            if (waiverResponse.ok) {
              const waivers = await waiverResponse.json();
              // Find the latest waiver for the current user
              const userWaiver = waivers
                .filter((w: ISignedWaiver) => w.signeeId === user._id)
                .sort(
                  (a: ISignedWaiver, b: ISignedWaiver) =>
                    new Date(b.dateSigned).getTime() -
                    new Date(a.dateSigned).getTime()
                )[0];

              if (userWaiver) {
                setSignedWaiver(userWaiver);
                setDependents(userWaiver.dependents);
              } else {
                toast({
                  title: "No waiver found",
                  description:
                    "You haven't signed a waiver for this event yet.",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
                router.push("/");
              }
            }
          }
        }
        setLoadingUser(false);

        // Fetch event data
        const eventResponse = await fetch(`/api/events/${eventId}`);
        if (eventResponse.ok) {
          const data = await eventResponse.json();
          setEventData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoadingWaiver(false);
      }
    };

    fetchData();
  }, [eventId, router, searchParams, toast]);

  // Submission handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      waiverVersion: 1,
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
        if (res.ok) {
          const responseData = await res.json();
          const waiverId = responseData._id;

          try {
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
      // Handle guest user case
      const fetchUser = async () => {
        let user: IUser | null = null;
        const res = await getUserFromEmail(email);
        if (res) {
          user = JSON.parse(res) as IUser;
        }
        return user;
      };
      let user = await fetchUser();

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
          if (res.ok) {
            const responseData = await res.json();
            const waiverId = responseData._id;

            try {
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

  if (loadingUser || loadingWaiver) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

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
            {isViewMode
              ? "Signed Waiver Details"
              : "Waiver of Liability and Hold Harmless Agreement"}
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

        {isViewMode ? (
          <Box w={["90%", "80%"]} mt={8}>
            <Flex direction="column" gap={6}>
              <Box>
                <Text fontWeight="bold">Signee Name:</Text>
                <Text>{signedWaiver?.signeeName}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold">Date Signed:</Text>
                <Text>
                  {signedWaiver?.dateSigned
                    ? new Date(signedWaiver.dateSigned).toLocaleDateString()
                    : ""}
                </Text>
              </Box>

              {signedWaiver?.dependents &&
                signedWaiver.dependents.length > 0 && (
                  <Box>
                    <Text fontWeight="bold">Dependents:</Text>
                    {signedWaiver.dependents.map((dependent, index) => (
                      <Text key={index}>{dependent}</Text>
                    ))}
                  </Box>
                )}

              <Button
                onClick={() => router.push("/")}
                bg="#337774"
                color="white"
                _hover={{ bg: "#4a9b99" }}
                width="200px"
              >
                Back to Home
              </Button>
            </Flex>
          </Box>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box w={["90%", "80%"]}>
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
        )}
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
