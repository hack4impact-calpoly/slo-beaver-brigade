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
  Text,
  Box,
  Checkbox,
  useMediaQuery,
  UnorderedList,
  ListItem,
  Toast,
} from '@chakra-ui/react';
import React, { useRef, useState, useEffect } from 'react';
import { IEvent } from '@database/eventSchema';
import { CalendarIcon, CopyIcon, TimeIcon } from '@chakra-ui/icons';
import { PiMapPinFill } from 'react-icons/pi';
import { MdCloseFullscreen } from 'react-icons/md';
import Link from 'next/link';
import { removeRegistered } from 'app/actions/serveractions';
import { IUser } from '@database/userSchema';
import { getUserDbData } from 'app/lib/authentication';
import MarkdownPreview from '@uiw/react-markdown-preview';
import style from '@styles/calendar/calendar.module.css';
import { KeyedMutator } from 'swr';
import ChakraNextImage from './ChakraNextImage';
import { useToast } from '@chakra-ui/react';

interface Props {
  eventDetails: IEvent | null;
  showModal: boolean;
  editUrl?: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  mutate?: KeyedMutator<IEvent[]> | undefined;
}

function ExpandedViewComponent({
  eventDetails,
  showModal,
  setShowModal,
  mutate,
  editUrl,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [isLargerThan550] = useMediaQuery('(min-width: 550px)');
  const [visitorData, setVisitorData] = useState<IUser>({
    _id: '',
    groupId: null,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    zipcode: '',
    age: -1,
    gender: '',
    role: 'user',
    eventsAttended: [],
    eventsRegistered: [],
    receiveNewsletter: false,
  });

  function closeExpandedView() {
    setShowModal(false);
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (signedIn) {
        return;
      }
      const user = await getUserDbData();
      if (!user) {
        return;
      }

      setSignedIn(true);
      setVisitorData(JSON.parse(user));
    };
    fetchUserData();
  }, [signedIn, visitorData]);

  if (eventDetails == null) {
    return <></>;
  }

  async function handleCancel(eventid: string, userid: string) {
    await removeRegistered(userid, eventid);
    // really innefficient, move to useSubscription
    if (mutate) {
      mutate(
        (data) => {
          return data?.map((val) => {
            if (val._id === eventid) {
              val.registeredIds = val.registeredIds.filter(
                (id) => id !== userid
              );
            }
            return val;
          });
        },
        { revalidate: true }
      );
    }
    onClose();
    closeExpandedView();
    setSignedIn(false);
  }

  const formattedDate = new Date(eventDetails.startTime).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }
  );

  const formattedStartTime = new Date(
    eventDetails.startTime
  ).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const formattedEndTime = new Date(eventDetails.endTime).toLocaleTimeString(
    'en-US',
    {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }
  );

  const url = `/events/${eventDetails._id}/digitalWaiver`;

  function handleCopyToClipboard(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    if (eventDetails) {
      event.preventDefault();
      const eventUrl = `${window.location.origin}/?id=${eventDetails._id}`;
      navigator.clipboard.writeText(eventUrl).then(
        () => {
          toast({
            title: 'Event URL copied to clipboard!',
            status: 'success',
            duration: 2000,
            position: 'top',
          });
        },
        (err) => {
          console.error('Failed to copy text: ', err);
        }
      );
    } else {
      toast({
        title: 'Error copying URL',
        description: 'Event details not available.',
        status: 'error',
        duration: 2000,
        position: 'top',
      });
    }
  }

  return (
    <>
      <Modal isOpen={showModal} onClose={closeExpandedView} size="3xl">
        <ModalOverlay />
        <ModalContent mt={'5rem'} mb={'1rem'} borderRadius={'20px'}>
          <ModalHeader
            fontWeight="bold"
            fontFamily={'Lato'}
            position="relative"
            color={'white'}
            textShadow="3px 3px 6px rgba(0, 0, 0, 0.9)"
          >
            <ChakraNextImage
              src={eventDetails.eventImage || '/beaver-eventcard.jpeg'}
              alt="Event Image"
              objectFit="cover"
              position="absolute"
              zIndex="-1"
              top="0"
              left="0"
              layout="fill"
              borderRadius={'20px 20px 0px 0px'}
              filter="blur(2px) brightness(0.8)"
            />
            <Flex justify={'left'} ml={'5%'}>
              <Text fontSize={['2xl', '2xl', '5xl']} opacity={'85%'}>
                {eventDetails.eventName}
              </Text>
            </Flex>
            <Button
              onClick={closeExpandedView}
              variant="link"
              position="absolute"
              top={'20px'}
              right={'20px'}
              //right={"4%"}
              //mt={["-50px","0px","0px"]} // Breakpoints for widths 0-480px, 480-768px, and greater than 768px
              //mr={["-15px", "0px", "0px"]} // Breakpoints for widths 0-480px, 480-768px, and greater than 768px
              color={'white'}
              size={'xl'}
              leftIcon={<MdCloseFullscreen />}
            ></Button>
            <Flex
              flexDirection={'column'}
              fontSize={'sm'}
              opacity={'85%'}
              mb={'7%'}
              ml={'5%'}
            >
              <Flex>
                <CalendarIcon mt={'2px'} />
                <Text ml={'6px'}>{formattedDate}</Text>
              </Flex>
              <Flex>
                <TimeIcon mt={'2px'} />
                <Text ml={'6px'}>
                  {formattedStartTime} - {formattedEndTime}
                </Text>
              </Flex>
              <Flex>
                <Box mt={'2px'}>
                  <PiMapPinFill />
                </Box>
                <Text ml={'6px'}>{eventDetails.location}</Text>
              </Flex>
            </Flex>
            <Button
              position="absolute"
              bottom="10px"
              right="20px"
              variant="link"
              color={'white'}
              size={'xl'}
              rightIcon={<CopyIcon />}
              onClick={handleCopyToClipboard}
            >
              Share Event
            </Button>
          </ModalHeader>
          <ModalBody fontFamily={'Lato'}>
            <Stack overflowY="auto" height="300px" spacing={4} width={'100%'}>
              <Flex direction={'column'}>
                <Flex justifyContent={'space-between'}>
                  <FormLabel
                    color="black"
                    fontWeight="bold"
                    fontSize={'2xl'}
                    ml={'5%'}
                    mt={['10%', '10%', '2%']}
                  >
                    Description
                  </FormLabel>
                </Flex>
                <MarkdownPreview
                  className={style.preview}
                  source={eventDetails.description}
                  style={{ padding: 16, marginLeft: '3.5%' }}
                  wrapperElement={{ 'data-color-mode': 'light' }}
                />
              </Flex>
              {isLargerThan550 ? (
                <Flex mb={'5%'} justifyContent={'space-around'}>
                  <Flex direction={'column'}>
                    <FormLabel color="black" fontWeight="bold" fontSize={'xl'}>
                      Items to Bring
                    </FormLabel>
                    <Stack spacing={2} ml={'0'}>
                      {Array.isArray(eventDetails.checklist) &&
                      eventDetails.checklist.length > 0 ? (
                        eventDetails.checklist.map((item, i) => (
                          <MarkdownPreview
                            key={i}
                            className={style.preview}
                            source={`- ${item}`}
                            style={{ padding: 3 }}
                            wrapperElement={{ 'data-color-mode': 'light' }}
                          />
                        ))
                      ) : (
                        <MarkdownPreview
                          className={style.preview}
                          source={'- Just bring yourself and a smile c:'}
                          wrapperElement={{ 'data-color-mode': 'light' }}
                        />
                      )}
                    </Stack>
                  </Flex>
                  {eventDetails.wheelchairAccessible ? ( // If neither spanish speaking nor wheelchair accessible, return null
                    <Flex direction={'column'}>
                      <FormLabel
                        color="black"
                        fontWeight="bold"
                        fontSize={'xl'}
                      >
                        Accommodations
                      </FormLabel>
                      <MarkdownPreview
                        className={style.preview}
                        style={{ fontWeight: 'light' }}
                        source={'- Wheelchair Accessible'}
                        wrapperElement={{ 'data-color-mode': 'light' }}
                      />
                    </Flex>
                  ) : (
                    <></>
                  )}
                  <Flex direction={'column'}>
                    <FormLabel color="black" fontWeight="bold" fontSize={'xl'}>
                      Event Language
                    </FormLabel>
                    <Stack spacing={2}>
                      {eventDetails.spanishSpeakingAccommodation ? (
                        <MarkdownPreview
                          className={style.preview}
                          style={{ fontWeight: 'light' }}
                          source={'- Spanish'}
                          wrapperElement={{ 'data-color-mode': 'light' }}
                        />
                      ) : (
                        <MarkdownPreview
                          className={style.preview}
                          style={{ fontWeight: 'light' }}
                          source={'- English'}
                          wrapperElement={{ 'data-color-mode': 'light' }}
                        />
                      )}
                    </Stack>
                  </Flex>
                </Flex>
              ) : (
                <Flex direction={'column'} ml={'5%'} mb={'10%'} gap={4}>
                  <Flex direction={'column'}>
                    <Stack spacing={2} ml={'0'}>
                      <FormLabel
                        color="black"
                        fontWeight="bold"
                        fontSize={'xl'}
                      >
                        Items to Bring
                      </FormLabel>
                      {Array.isArray(eventDetails.checklist) &&
                      eventDetails.checklist.length > 0 ? (
                        eventDetails.checklist.map((item, i) => (
                          <MarkdownPreview
                            key={i}
                            className={style.preview}
                            source={`- ${item}`}
                            style={{ padding: 3 }}
                            wrapperElement={{ 'data-color-mode': 'light' }}
                          />
                        ))
                      ) : (
                        <MarkdownPreview
                          className={style.preview}
                          source={'- Just bring yourself and a smile c:'}
                          wrapperElement={{ 'data-color-mode': 'light' }}
                        />
                      )}
                    </Stack>
                  </Flex>
                  {eventDetails.wheelchairAccessible ? (
                    <Stack>
                      <FormLabel
                        color="black"
                        fontWeight="bold"
                        fontSize={'xl'}
                      >
                        Accommodations
                      </FormLabel>
                      <MarkdownPreview
                        className={style.preview}
                        style={{ fontWeight: 'light' }}
                        source={'- Wheelchair Accessible'}
                        wrapperElement={{ 'data-color-mode': 'light' }}
                      />
                    </Stack>
                  ) : (
                    <></>
                  )}
                  <Flex direction={'column'}>
                    <FormLabel color="black" fontWeight="bold" fontSize={'xl'}>
                      Event Language
                    </FormLabel>
                    <Stack spacing={2}>
                      {eventDetails.spanishSpeakingAccommodation ? (
                        <MarkdownPreview
                          className={style.preview}
                          style={{ fontWeight: 'light' }}
                          source={'- Spanish'}
                          wrapperElement={{ 'data-color-mode': 'light' }}
                        />
                      ) : (
                        <MarkdownPreview
                          className={style.preview}
                          style={{ fontWeight: 'light' }}
                          source={'- English'}
                          wrapperElement={{ 'data-color-mode': 'light' }}
                        />
                      )}
                    </Stack>
                  </Flex>
                </Flex>
              )}
            </Stack>
            <Flex
              mt={['5%', '5%', '2%']}
              display={'flex'}
              flexDirection={['column', 'column', 'row']}
              justifyContent={'space-around'}
              alignItems={['center', 'center', 'flex-start']}
            >
              {signedIn ? (
                <>
                  {(visitorData.role === 'admin' ||
                    visitorData.role === 'super-admin') && (
                    <Link href={`/admin/events/edit/${editUrl}`}>
                      <Button
                        bg="#337774"
                        color="white"
                        _hover={{ bg: '#4a9b99' }}
                        fontWeight={'600'}
                        width={'200px'}
                        marginBottom={2}
                      >
                        Manage Event
                      </Button>
                    </Link>
                  )}

                  {eventDetails.registeredIds
                    .map((oid) => oid.toString())
                    .includes(visitorData._id) ? (
                    <>
                      <Button
                        onClick={onOpen}
                        bg="#337774"
                        color="white"
                        _hover={{ bg: '#4a9b99' }}
                        fontWeight={'600'}
                        width={'200px'}
                        marginBottom={2}
                      >
                        Cancel Reservation
                      </Button>
                      <Link href={`/events/${eventDetails._id}/digitalWaiver`}>
                        <Button
                          bg="#e0af48"
                          color="black"
                          _hover={{ bg: '#C19137' }}
                          fontWeight={'600'}
                          width={'200px'}
                          marginBottom={2}
                        >
                          View Your Waiver
                        </Button>
                      </Link>
                    </>
                  ) : (
                    eventDetails.isOpen && (
                      <Link href={url}>
                        <Button
                          bg="#e0af48"
                          color="black"
                          _hover={{ bg: '#C19137' }}
                          fontWeight={'600'}
                          width={'200px'}
                          marginBottom={2}
                        >
                          Register
                        </Button>
                      </Link>
                    )
                  )}
                </>
              ) : (
                eventDetails.isOpen && (
                  <Link href={url}>
                    <Button
                      bg="#e0af48"
                      color="black"
                      _hover={{ bg: '#C19137' }}
                      fontWeight={'600'}
                      width={'200px'}
                      marginBottom={2}
                    >
                      Register
                    </Button>
                  </Link>
                )
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={triggerButtonRef}
        isCentered
        size="md"
      >
        <ModalOverlay />
        <ModalContent mt={'12.5rem'} borderRadius={'10px'}>
          <ModalHeader
            bg={'#337774'}
            padding={'25px 0px 25px 0px'}
            borderRadius={'10px 10px 0px 0px'}
          ></ModalHeader>
          <ModalBody textAlign={'center'} mt={'10%'}>
            <Text fontWeight={'bold'} fontSize={'xl'} fontFamily={'Lato'}>
              Cancel your reservation for <br />
              {eventDetails.eventName}?
            </Text>
          </ModalBody>
          <ModalFooter
            justifyContent={'center'}
            mt={'5%'}
            mb={'5%'}
            fontFamily={'Lato'}
          >
            <Flex flexDir={'row'}>
              <Button onClick={onClose} mr={'2.5%'}>
                No, take me back
              </Button>
              <Button
                bg="#337774"
                color="white"
                _hover={{ bg: '#4a9b99' }}
                onClick={async () =>
                  await handleCancel(eventDetails._id, visitorData._id)
                }
                ml={'5%'}
              >
                Yes, cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ExpandedViewComponent;
