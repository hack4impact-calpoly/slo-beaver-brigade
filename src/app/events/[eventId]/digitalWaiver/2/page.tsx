"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import styles from "./page.module.css";
import beaverLogo from "/docs/images/beaver-logo.svg";
import Image from "next/image";
import NextLink from "next/link";
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
  const {mutate} = useEventsAscending()
  const [dependents, setDependents] = useState([""]);
  const [formFilled, setFormFilled] = useState(false);
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signature, setSignature] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [emailChecked, setEmailChecked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false);
  const [eventData, setEventData] = useState<IEvent | null>(null);

  // checks if user is signed in
  useEffect(() => {
    const fetchUserData = async () => {
      let res = await getUserDbData();
      if (res) {
        setUserData(JSON.parse(res));
        setValidEmail(true);
        console.log("valid email");
      }
      setLoadingUser(false);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    // Check if all required fields are filled
    if (userData) {
      console.log("form filled");
      setFormFilled(true);
      return;
    }
    const isFilled =
      email.trim() !== "" && zipcode.trim() !== "" && signature.trim() !== "";
    setFormFilled(isFilled);
  }, [email, zipcode, signature, userData]);

  //get event from eventId
  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setEventData(data);
      }
    };
    fetchEvent();
  }, []);

  const addDependent = () => {
    const emptyFieldCount = dependents.filter(
      (dependent) => dependent === ""
    ).length;
    if (emptyFieldCount <= 1) {
      setDependents([...dependents, ""]);
    }
  };

  const handleDependentChange = (index: number, value: string) => {
    const newDependents = [...dependents];
    newDependents[index] = value;
    setDependents(newDependents);
  };

  function handleSkip(){
    setModalOpen(false)
    router.push("/")
  }

  function handleCreateAccount(){
    setModalOpen(false)
    const userData = {
      email: email,
      zipcode: zipcode,
      firstName: firstName,
      lastName: lastName,
    }
    sessionStorage.setItem("userData", JSON.stringify(userData))
    router.push("/signup")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailChecked(true);
    const dependentArray = dependents.filter((dependent) => dependent !== "");

    const data = {
      eventId: eventId,
      dependents: dependentArray,
    };

    if (userData) {
      setValidEmail(true);
      try {
        const res = await fetch(`/api/waiver`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({parentUserId: userData._id, ...data}),
        });
        //if the waiver returns successfully
        if (res.ok) {
          const responseData = await res.json();
          const waiverId = responseData._id;

          //add digitalWaiverId to user, and add an object that consists of
          //the eventId and digitalWaiverId to eventsAttended
          const updatedInfo = {
            eventsRegistered: {
              eventId: eventId,
              digitalWaiver: waiverId,
            },
          };

            try {
              //call to update the user object
              const res = await addToRegistered(userData._id, eventId, waiverId)
              if (res) {
                console.log('added')

                mutate(data => {
                    if (data){
                        data.map((event) => {
                            if (event._id == eventId){
                                return {...event, registeredIds: [...event.registeredIds, userData._id]}
                            }
                            return event
                        }
                        )
                    }
                    return data
                })
                const emailBody = {"email": userData.email}
                const confirmRes = await fetch(`/api/events/confirmation/${eventId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailBody)
                })
                console.log(confirmRes.status)
                //on success, return to the home page
                router.push("/")
                
              } else {
                  console.error("Error adding info to user");
              }} 
            catch (error) {
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
          console.log("server error while creating guest user");
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
            body: JSON.stringify({parentUserId: user._id, ...data}),
          });
          //if the waiver returns successfully
          if (res.ok) {
            const responseData = await res.json();
            const waiverId = responseData._id;

            //add digitalWaiverId to user, and add an object that consists of
            //the eventId and digitalWaiverId to eventsAttended
            const updatedInfo = {
              eventsRegistered: {
                eventId: eventId,
                digitalWaiver: waiverId,
              },
            };

                try {
                //call to update the user object
                const res = await addToRegistered(user._id, eventId, waiverId)
                if (res) {
                    mutate(data => {
                    if (data){
                        data.map((event) => {
                            if (event._id == eventId){
                                return {...event, registeredIds: [...event.registeredIds, user._id]}
                            }
                            return event
                        }
                        )
                    }
                    return data
                })
                    console.log('added')
                    const emailBody = {"email": user.email}
                    await fetch("/api/confirmation/" + eventId, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(emailBody)
                    })
                    //on success, open modal prompting user to create an account
                    setModalOpen(true)
                    
                } else {
                    console.error("Error adding info to user");
                }} 
                catch (error) {
                console.error("Error adding info to user", error);
                }
            } else {
                console.error("Error creating waiver", res.statusText);
            }} 
        catch (error) {
            console.error("Error creating waiver:", error);
        }
      } else {
        onOpen();
      }
    }
  };

  return (
    <div>
      <Flex
        style={{
          flexWrap: "wrap",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image src={beaverLogo} alt="beaver" style={{ marginTop: "40px" }} />
        <Flex
          style={{
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box w="100%" mt={5} mb="2.7%" padding="1vw">
              {!userData && !loadingUser && (
                <div className="flex flex-col">
                  <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>
                    Add Members
                  </h1>
                  <h2 className={styles.formHeading}>Contact Information</h2>
                  <div className="flex flex-row">
                    <input
                      className={styles.inputForm}
                      type="text"
                      id="firstname"
                      name="firstname"
                      placeholder="First Name"
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <input
                      className={styles.inputForm}
                      type="text"
                      id="lastname"
                      name="lastname"
                      placeholder="Last Name"
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-row">
                    <input
                      className={styles.inputForm}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      className={styles.inputForm}
                      type="zipcode"
                      id="zipcode"
                      name="zipcode"
                      placeholder="Zipcode"
                      onChange={(e) => setZipcode(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              <table width="100%">
                <tbody>
                  {dependents.map((name, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          className={styles.dependentTable}
                          type="text"
                          value={name}
                          onChange={(event) =>
                            handleDependentChange(index, event.target.value)
                          }
                          style={{ display: index === 0 ? "none" : "block" }}
                          placeholder="Dependent Full Name"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addDependent}
                className={styles.addDependent}
                style={{ color: "#ECB94A" }}
              >
                Add Dependent +
              </button>
              <h2 className={styles.formHeading}>Sign Here</h2>
              <input
                className={styles.inputSignature}
                type="string"
                id="signature"
                name="signature"
                placeholder="Signature"
                onChange={(e) => setSignature(e.target.value)}
                required
              />
            </Box>
            <Flex
              style={{
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NextLink href={"/events/" + eventId + "/digitalWaiver/1"}>
                <Button
                  sx={{
                    width: "225px",
                    height: "40px",
                    marginLeft: "75px",
                    marginRight: "75px",
                    marginBottom: "20px",
                    backgroundColor: "white",
                    border: "2px solid #B5B5B5",
                    color: "#B5B5B5",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "gray.200",
                      border: "2px solid gray.200",
                    },
                  }}
                >
                  Return
                </Button>
              </NextLink>
              {!formFilled && (
                <Button
                  sx={{
                    width: "225px",
                    height: "40px",
                    marginLeft: "75px",
                    marginRight: "75px",
                    marginBottom: "20px",
                    backgroundColor: "white",
                    border: "2px solid #B5B5B5",
                    color: "#B5B5B5",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "white",
                      border: "2px solid gray.200",
                    },
                  }}
                >
                  Continue
                </Button>
              )}
              {formFilled && (
                <Button
                  type="submit"
                  sx={{
                    width: "225px",
                    height: "40px",
                    marginLeft: "75px",
                    marginRight: "75px",
                    marginBottom: "20px",
                    backgroundColor: "#337774",
                    border: "2px solid #337774",
                    color: "white",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "#296361",
                      border: "2px solid #296361",
                    },
                  }}
                >
                  Continue
                </Button>
              )}
            </Flex>
          </form>
        </Flex>
      </Flex>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Email already exists</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Sign in or try again</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Close
            </Button>
            <Button sx={{marginLeft: "5%"}}>
              <a href="/signin">
                Sign in
              </a>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Modal isOpen={modalOpen} onClose={()=>{setModalOpen(false)}} size={"lg"}>
        <ModalOverlay />
        <ModalContent mt={"70px"}>
          <ModalHeader>
            <Flex justifyContent={"center"} w={"100%"} mt={"10%"} mb={"5%"}>
              <Image src={beaverLogo} alt="beaver" style={{ marginTop: "10px", width:"70px" }} />
            </Flex>
          </ModalHeader>
          <ModalBody textAlign={"center"} mb={"50px"}>
            <Text fontSize={{base:"lg", md:"xl"}}>Thank you for signing up for</Text>
            <Text fontSize={{base:"2xl", md:"3xl"}} fontWeight={"bold"} mt={"25px"} mb={"50px"}>{eventData?.eventName}</Text>
            <Text fontSize={{base:"md", md:"lg"}} pl={10} pr={10}>You can create an account to view your upcoming event!</Text>
          </ModalBody>
          <ModalFooter justifyContent={"space-around"} mb={"65px"}>
            <Button fontSize={{base:"sm", md:"md"}} color= "#B5B5B5" borderColor="gray" w={"35%"} variant={"outline"} onClick={handleSkip}>
              Skip
            </Button>
            <Button fontWeight={"bold"} fontSize={{base:"xs", sm:"sm", md:"md"}}  backgroundColor="#e0af48" w={"35%"} pl={"10px"} pr={"10px"} onClick={handleCreateAccount}>Create Account</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
