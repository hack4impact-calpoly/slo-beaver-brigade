import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Stack,
  FormLabel,
  Flex,
  Button,
  Spacer,
  Text,
  Box,
  useMediaQuery
} from "@chakra-ui/react";
import React, { useRef, useState,useEffect } from 'react';
import { IEvent } from "@database/eventSchema";
import { CalendarIcon,TimeIcon} from '@chakra-ui/icons';
import { fallbackBackgroundImage } from "app/lib/random";
import { PiMapPinFill } from "react-icons/pi";
import { MdCloseFullscreen } from "react-icons/md";
import Link from "next/link";
import { removeRegistered } from "app/actions/serveractions";
import { IUser } from "@database/userSchema";
import { getUserDbData } from "app/lib/authentication";
import MarkdownPreview from '@uiw/react-markdown-preview';
import style from "@styles/calendar/calendar.module.css";

interface Props {
  eventDetails: IEvent | null;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function ExpandedViewComponent ({ eventDetails, showModal, setShowModal }: Props)  {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [isLargerThan768] = useMediaQuery("(min-width: 550px)");
  const [visitorData, setVisitorData] = useState<IUser>(
    {
      _id: "",
      groupId: null,
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      age: -1,
      gender: "",
      role: "user",
      eventsAttended: [],
      eventsRegistered:[],
      recieveNewsletter: false
    },
  );

  function closeExpandedView() {
    setShowModal(false);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (signedIn) {
        return;
      }
      const user = await getUserDbData();
      if(!user){
        return;
      }

      setSignedIn(true);
      setVisitorData(JSON.parse(user));
    };
    fetchUserData();

  },[signedIn,visitorData]);

  if (eventDetails == null){
    return (
        <></>
    )
  }

  async function handleCancel(eventid : string, userid : string) {
    await removeRegistered(userid, eventid);
    onClose(); 
    closeExpandedView();
    setSignedIn(false);
  }

  const formattedDate = new Date(eventDetails.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formattedStartTime = new Date(eventDetails.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const formattedEndTime = new Date(eventDetails.endTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const backgroundImage = fallbackBackgroundImage(eventDetails.eventImage)
  const url = `/events/${eventDetails._id}/digitalWaiver/1`
  return (
  <>
    <Modal isOpen={showModal} onClose={closeExpandedView} size="3xl" isCentered>
      <ModalOverlay/>
      <ModalContent mt={"5rem"} mb={"1rem"}>
        <ModalHeader bg={backgroundImage} fontWeight="bold" position="relative" color={"white"} backgroundSize={"cover"} backgroundPosition={"60% 45%"} borderRadius={"5px 5px 0px 0px"}>
          <Flex justify={"right"} ml={"5%"}>
            <Text fontSize={"5xl"} opacity={"85%"}>{eventDetails.eventName}</Text>
            <Spacer/>
            <Button onClick={closeExpandedView} variant="link"  color={"white"} size={"xl"} leftIcon={<MdCloseFullscreen />}></Button>
          </Flex>
          <Flex flexDirection={"column"} fontSize={"sm"} opacity={"85%"} mb={"7%"} ml={"5%"}>
            <Flex>
              <Box mt={"5px"}>
                <PiMapPinFill/>
              </Box>
              <Text ml={"5px"}>{eventDetails.location}</Text>
            </Flex>
            <Flex>
              <CalendarIcon mt={"5px"}/>
              <Text ml={"5px"}>{formattedDate}</Text>
            </Flex>
            <Flex>
              <TimeIcon mt={"5px"}/>
              <Text ml={"5px"}>{formattedStartTime} - {formattedEndTime}</Text>
            </Flex>
          </Flex>
        </ModalHeader>

        <ModalBody pb={"5%"}>
          <Stack spacing={5} width={"100%"}>
            {isLargerThan768 ?
              <>
              <Flex direction={"column"} mt={"3%"} >
                <Flex>
                  <FormLabel color="black" fontWeight="bold" fontSize={"2xl"} ml={"5%"} mt={"2%"}>
                    Description:
                  </FormLabel>
                  <Flex
                    justifyContent='right'
                    flexWrap="wrap"
                    mr={"15%"}
                    ml={"auto"}
                  >

                    {signedIn ? 
                      <>
                      {eventDetails.registeredIds.map((oid) => oid.toString()).includes(visitorData._id) ?
                        <Button
                          onClick={onOpen}
                          bg="#e0af48"
                          color="black"
                          fontWeight={"light"}
                          fontSize={{ base: 'xl', md: 'md' }}
                          pl={"5%"}
                          pr={"5%"}
                          flexBasis={{ base: '100%', md: 'auto' }}
                        >
                          <strong>Cancel Reservation</strong>
                        </Button>
                      :
                        <Link href={url}>
                          <Button
                            bg="#006d75"
                            color="white"
                            fontWeight={"light"}
                            fontSize={{ base: 'xl', md: 'md' }}
                          
                            pl={"100%"}
                            pr={"100%"}
                            flexBasis={{ base: '100%', md: 'auto' }}
                          >
                            <strong>Sign Up</strong>
                          </Button>
                        </Link>
                      }
                      </>
                    : 
                      <Link href="/login">
                        <Button
                          bg="#006d75"
                          color="white"
                          fontWeight={"light"}
                          fontSize={{ base: 'xl', md: 'md' }}
                          pl={"100%"}
                          pr={"100%"}
                          flexBasis={{ base: '100%', md: 'auto' }}
                        >
                          <strong>Login</strong>
                        </Button>
                      </Link>
                    }
                  </Flex>
                </Flex>
                <Text ml={"3.5%"} fontWeight={"light"}>
                  <MarkdownPreview className= {style.preview} source={eventDetails.description} style={{ padding: 16 }} wrapperElement={{"data-color-mode": "light"}} />
                </Text>
              </Flex>
            <Flex>
              <Flex direction={"column"} width={"50%"}>
                  <FormLabel color="black" fontWeight="bold" fontSize={"2xl"} ml={"10%"}>
                  Checklist:
                  </FormLabel>
                  <Text ml={"6.5%"} fontWeight={"light"}>
                    <MarkdownPreview className= {style.preview} source={eventDetails.checklist} style={{ padding: 16 }} wrapperElement={{"data-color-mode": "light"}} />
                  </Text>
              </Flex>
              <Stack spacing={5}>
                <FormLabel color="black" fontWeight="bold" fontSize={"2xl"}>
                  Accomodations:
                </FormLabel>
                {eventDetails.wheelchairAccessible ? 
                  <Text  fontWeight={"light"}>
                    <MarkdownPreview className= {style.preview} source={"- Wheelchair Accessible"}  wrapperElement={{"data-color-mode": "light"}} />
                  </Text> :
                  <></>
                }
                {eventDetails.spanishSpeakingAccommodation ? 
                  <Text fontWeight={"light"}>
                    <MarkdownPreview className= {style.preview} source={"- Spanish-Speaking"}  wrapperElement={{"data-color-mode": "light"}} />
                  </Text> :
                  <></>
                }
                {!eventDetails.spanishSpeakingAccommodation && !eventDetails.wheelchairAccessible? 
                  <Text ml={"6.5%"} fontWeight={"light"}>
                    <MarkdownPreview className= {style.preview} source={"N/A"}  wrapperElement={{"data-color-mode": "light"}} />
                  </Text> :
                  <></>
                }
              </Stack>
            </Flex> 
            </>
            : 
              <Flex ml={"5%"} direction={"column"}>
                <Flex direction={"column"} width={"50%"}>
                  <Flex mt={"3%"}>
                    <FormLabel color="black" fontWeight="bold" fontSize={"2xl"} mt={"2%"}>
                      Description:
                    </FormLabel>
                    <Flex
                    justifyContent='right'
                    flexWrap="wrap"
                    mr={"15%"}
                    ml={"auto"}
                  >

                    {signedIn ? 
                      <>
                      {eventDetails.registeredIds.map((oid) => oid.toString()).includes(visitorData._id) ?
                        <Button
                          onClick={onOpen}
                          bg="#e0af48"
                          color="black"
                          fontWeight={"light"}
                          fontSize={{ base: 'xl', md: 'md' }}
                          pl={"5%"}
                          pr={"5%"}
                          flexBasis={{ base: '100%', md: 'auto' }}
                        >
                          <strong>Cancel Reservation</strong>
                        </Button>
                      :
                        <Link href={url}>
                          <Button
                            bg="#006d75"
                            color="white"
                            fontWeight={"light"}
                            fontSize={{ base: 'xl', md: 'md' }}
                          
                            pl={"100%"}
                            pr={"100%"}
                            flexBasis={{ base: '100%', md: 'auto' }}
                          >
                            <strong>Sign Up</strong>
                          </Button>
                        </Link>
                      }
                      </>
                    : 
                      <Link href="/login">
                        <Button
                          bg="#006d75"
                          color="white"
                          fontWeight={"light"}
                          fontSize={{ base: 'xl', md: 'md' }}
                          pl={"100%"}
                          pr={"100%"}
                          flexBasis={{ base: '100%', md: 'auto' }}
                        >
                          <strong>Login</strong>
                        </Button>
                      </Link>
                    }
                  </Flex>
                  </Flex>

                  <Text ml={"3.5%"}>
                    <MarkdownPreview className= {style.preview} source={eventDetails.description} style={{ padding: 16 }} wrapperElement={{"data-color-mode": "light"}} />
                  </Text>
                </Flex>
                <Flex direction={"column"} width={"50%"}>
                  <FormLabel color="black" fontWeight="bold" fontSize={"2xl"}>
                    Checklist:
                  </FormLabel>
                  <Text ml={"3.5%"}>
                    <MarkdownPreview className= {style.preview} source={eventDetails.checklist} style={{ padding: 16 }} wrapperElement={{"data-color-mode": "light"}} />
                  </Text>
                </Flex>
                <Stack spacing={5}>
                  <FormLabel color="black" fontWeight="bold" fontSize={"2xl"}>
                    Accomodations:
                  </FormLabel>
                  {eventDetails.wheelchairAccessible ? 
                    <Text ml={"5%"}>
                      <MarkdownPreview className= {style.preview} source={"- Wheelchair Accesible"} wrapperElement={{"data-color-mode": "light"}} />
                    </Text>:
                    <></>
                  }
                  {eventDetails.spanishSpeakingAccommodation ? 
                    <Text ml={"5%"}>
                      <MarkdownPreview className= {style.preview} source={"- Spanish-Speaking"} wrapperElement={{"data-color-mode": "light"}} />
                    </Text>:
                    <></>
                  }
                  {!eventDetails.spanishSpeakingAccommodation && !eventDetails.wheelchairAccessible? 
                    <Text ml={"5%"}>
                      <MarkdownPreview className= {style.preview} source={"N/A"} wrapperElement={{"data-color-mode": "light"}} />
                    </Text>:
                    <></>
                  }
                </Stack> 
              </Flex>
            }
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>

    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={triggerButtonRef}
      isCentered
      size="lg"
      >
      <ModalOverlay />
      <ModalContent mt={"15rem"}>
        <ModalHeader bg={"#e0af48"} borderRadius={"5px 5px 0px 0px"}></ModalHeader>
        <ModalBody  textAlign={"center"} mt={"5%"}>
          <Text fontWeight={"bold"} fontSize={"xl"}>Cancel This Reservation</Text>
          <Text fontWeight={"light"} fontSize={"large"}>Are you sure?</Text>
        </ModalBody>
        <ModalFooter justifyContent={"center"} mt={"5%"}>
          <Flex flexDir={"row"}>
            <Button  onClick={onClose} mr={"5%"} variant={"outline"} color={"#3b3b3b"}>
              No, take me back
            </Button>
            <Button color={"black"} bg="#e0af48" onClick={async() => await handleCancel(eventDetails._id,visitorData._id)} ml={"5%"}>
              Yes, cancel
            </Button>
          </Flex>

        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  );
};

export default ExpandedViewComponent;
