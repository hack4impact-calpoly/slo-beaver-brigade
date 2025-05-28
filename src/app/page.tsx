'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Heading,
  Stack,
  Text,
  Flex,
  Button,
  useBreakpointValue,
  Image,
  useToast,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { CalendarIcon, TimeIcon } from '@chakra-ui/icons';
import { PiMapPinFill } from 'react-icons/pi';
import Slider from 'react-slick';
import { useUser } from '@clerk/nextjs';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { css } from '@emotion/react';
import '@emotion/react';
import Link from 'next/link';
import style from '@styles/userdashboard/dashboard.module.css';
import { getUserDataFromEmail } from '@app/lib/authentication';
import { IUser } from '@database/userSchema';
import { IEvent } from '@database/eventSchema';
import ExpandedViewComponent from './components/StandaloneExpandedViewComponent';
import './fonts/fonts.css';
import { useEventsAscending, useEventTypes } from 'app/lib/swrfunctions';
import { LockIcon } from '@chakra-ui/icons';
import ChakraNextImage from './components/ChakraNextImage';
import { useRouter, useSearchParams } from 'next/navigation';

// logic for letting ts know about css prop
declare module 'react' {
  interface Attributes {
    css?: any;
  }
}

// placeholder to ensure format consistency when there is only 1-2 events
const EventPlaceholder = () => {
  return (
    <Box
      borderWidth="1px"
      p="4"
      mb="4"
      h="60"
      textAlign="left"
      opacity="0" // Invisible but maintains layout; adjust as needed
    >
      {/* Placeholder content if desired */}
    </Box>
  );
};

const UnregisteredEventPlaceholder = () => {
  return (
    <Box
      borderWidth="1px"
      p="4"
      mb="4"
      h="64"
      mx="4"
      textAlign="left"
      opacity="0" // Invisible but maintains layout; adjust as needed
    >
      {/* Placeholder content if desired */}
    </Box>
  );
};

export default function Page() {
  const sliderStyles = css`
    .slick-dots li button:before {
    }

    .slick-prev:before,
    .slick-next:before {
      color: black; // Your desired color for arrows
    }
  `;

  // fetching events
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const toast = useToast();
  const { events, isLoading, isError, mutate } = useEventsAscending();
  const [userData, setUserData] = useState<IUser | null>(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const [parsed, setParsed] = useState<boolean>(false);
  const [userEvents, setUserEvents] = useState<IEvent[]>([]);
  const [unregisteredEvents, setUnregisteredEvents] = useState<IEvent[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [showEventList, setShowEventList] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [isExpandedViewComponentOpen, setExpandedViewComponentOpen] =
    useState(false);
  const [eventForExpandedViewComponent, setEventForExpandedViewComponent] =
    useState<IEvent | null>(null);

  // breakpoint for different viewport size
  const eventNameSize = useBreakpointValue({
    base: 'lg',
    md: '2xl',
    lg: '3xl',
  });
  const eventDetailSize = useBreakpointValue({
    base: 'md',
    md: 'lg',
    lg: 'xl',
  });
  const eventTimeSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });

  const sortFuncGroups = (a: IEvent, b: IEvent) => {
    if (a.groupsOnly) {
      if (b.groupsOnly) {
        return 0;
      } else {
        return -1;
      }
    } else if (b.groupsOnly) {
      return 1;
    }
    return 0;
  };
  //convert date into format Dayofweek, Month
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convert to Date object if not already
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  // convert date into xx:xx XM - xx:xx XM
  const formatDateTimeRange = (start: Date, end: Date) => {
    if (!(start instanceof Date)) {
      start = new Date(start); // Convert to Date object if not already
    }

    if (!(end instanceof Date)) {
      end = new Date(end); // Convert to Date object if not already
    }

    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric', // "numeric" or "2-digit"
      minute: 'numeric', // "numeric" or "2-digit"
    };

    const formattedStart = start.toLocaleTimeString('en-US', options);
    const formattedEnd = end.toLocaleTimeString('en-US', options);

    return `${formattedStart} - ${formattedEnd}`;
  };

  // parse data on component mount
  useEffect(() => {
    const getUser = async () => {
      if (user && isSignedIn) {
        const res = await getUserDataFromEmail(
          user.emailAddresses[0].emailAddress
        );
        if (res) {
          const user = JSON.parse(res);

          setUserData(user);
        }
      }

      setParsed(true);
    };
    if (!isLoaded) {
      return;
    }
    // get user
    getUser();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!parsed || !events) {
      return;
    }

    if (events && isSignedIn && parsed && userData) {
      const currentDate = new Date();
      // Filter events based on user registration and selected event type

      const userSignedUpEvents = events.filter(
        (event) =>
          event.registeredIds.includes(userData?._id) &&
          new Date(event.endTime) >= currentDate
      );

      const eventsUserHasntRegistered = events.filter(
        (event) => !event.registeredIds.includes(userData?._id)
      );

      const filteredEvents = eventsUserHasntRegistered
        .filter(
          (event) =>
            new Date(event.endTime) >= currentDate &&
            (!selectedEventType || event.eventType === selectedEventType) // Filter by event type if selected
        )
        .sort((a, b) => sortFuncGroups(a, b));

      setUserEvents(userSignedUpEvents);
      setUnregisteredEvents(filteredEvents);
    } else {
      const currentDate = new Date();
      const upcomingEvents = events?.filter(
        (event) =>
          new Date(event.endTime) > currentDate &&
          (!selectedEventType || event.eventType === selectedEventType) // Filter by event type if selected
      );
      setUserEvents([]);
      setUnregisteredEvents(upcomingEvents);
    }
    setEventsLoading(false);
  }, [events, user, selectedEventType, parsed, isLoaded, isSignedIn, userData]); // Include selectedEventType in the dependency array
  const { eventTypes: fetchedEventTypes, isLoading: eventTypesLoading } =
    useEventTypes();

  useEffect(() => {
    if (fetchedEventTypes) {
      setEventTypes(fetchedEventTypes);
    }
  }, [fetchedEventTypes]);

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width to state
      setWindowWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  // settings for slider
  const settings = {
    dots: userEvents.length > 3,
    infinite: userEvents.length > 3,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3, // Show 3 slides for widths of 1280px or less
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show 2 slides for widths of 1024px or less
          slidesToScroll: 2,
          infinite: userEvents.length > 2,
          dots: userEvents.length > 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Only show 1 slide for widths of 600px or less
          slidesToScroll: 1,
          infinite: userEvents.length > 1,
          dots: userEvents.length > 1,
        },
      },
    ],
  };

  const adjustedSettings = {
    ...settings,
    slidesToShow: Math.min(userEvents.length, 3), // Show up to 3 slides, or less if there aren't enough events
    infinite: userEvents.length > 3, // Only enable infinite looping if there are more than 3 events
  };

  const unregisteredEventSettings = {
    dots: unregisteredEvents.length > 2,
    infinite: unregisteredEvents.length > 2,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2, // Show 3 slides for widths of 1280px or less
          slidesToScroll: 2,
          dots: unregisteredEvents.length > 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show 2 slides for widths of 1024px or less
          slidesToScroll: 2,
          infinite: unregisteredEvents.length > 2,
          dots: unregisteredEvents.length > 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Only show 1 slide for widths of 600px or less
          slidesToScroll: 1,
          infinite: unregisteredEvents.length > 1,
          dots: unregisteredEvents.length > 1,
        },
      },
    ],
  };

  const allDataLoaded = !eventsLoading && parsed;

  const toggleExpandedViewComponentOpen = () => {
    setExpandedViewComponentOpen(!isExpandedViewComponentOpen);
  };

  function setupViewEventModal(event: IEvent) {
    setEventForExpandedViewComponent(event);
    setExpandedViewComponentOpen(!isExpandedViewComponentOpen);
  }

  const handleButtonClickToStopPropagation = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (id && events) {
      const eventToOpen = events.find((event) => event._id === id);
      if (eventToOpen) {
        setupViewEventModal(eventToOpen);
      } else {
        toast({
          title: 'Event not found',
          description: 'The event you are looking for does not exist.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        router.push('/');
      }
    }
  }, []);

  return (
    <div>
      {/*{userData &&
    <div className="px-[3rem] pt-3">
             <EmailRSSComponent calendarURL={"/api/user/calendar/" + userData?._id}/>
    </div>
             /*<a href=>Add to calendar!</a>*/}

      <div css={sliderStyles}>
        <Box p="4" pt="7" bg="white">
          <Stack spacing={2} px="10" mb={6}>
            <Flex alignItems="center" justifyContent="space-between">
              <Text
                fontSize={['xl', 'xl', '2xl']}
                fontWeight="light"
                color="black"
                mb={3}
              >
                Your Events
              </Text>
              <Heading as="h2" fontSize="xl"></Heading>
            </Flex>
            <Divider
              size="sm"
              borderWidth="1px"
              borderColor="grey"
              alignSelf="center"
              w="100%"
            />
            {!allDataLoaded ? (
              <Text
                fontSize={['xl', 'xl', '2xl']}
                fontWeight="400"
                color="black"
                textAlign="center"
                mt={5}
              >
                Loading...
              </Text>
            ) : !isSignedIn ? (
              <Flex
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Text
                  fontSize={['l', 'l', 'xl']}
                  fontWeight="600"
                  color="black"
                  textAlign="center"
                  mt="8"
                >
                  Create an account or sign in to see your upcoming events!
                </Text>
                <Box
                  flexDirection={['column', 'column', 'row']} // for breakpoints of 0px, 480px, and 768px
                  alignItems="center"
                  justifyContent="center"
                  display="flex"
                  w="100%"
                >
                  <Link href="/login">
                    <Button
                      w={[40, 40, 160]} // button width for breakpoints of 0px, 480px, and 768px
                      bg="#e0af48"
                      color="black"
                      _hover={{ bg: '#C19137' }}
                      fontFamily="Lato"
                      mt="4"
                      mr="4"
                      ml="4"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      w={[40, 40, 160]} // button width for breakpoints of 0px, 480px, ad 768px
                      bg="#337774"
                      color="white"
                      _hover={{ bg: '#4a9b99' }}
                      fontFamily="Lato"
                      mt="4"
                      mr="4"
                      ml="4"
                    >
                      Create Account
                    </Button>
                  </Link>
                </Box>
              </Flex>
            ) : userEvents.length === 0 ? (
              <Text
                fontSize={['xl', 'xl', '2xl']}
                fontWeight="bold"
                color="black"
                textAlign="center"
                mt={5}
              >
                Check out the events below!
              </Text>
            ) : null}
          </Stack>
          <Box px={6}>
            {userEvents.length > 0 ? (
              <Slider {...settings}>
                {userEvents.length > 0 ? (
                  userEvents.map((event) => {
                    return (
                      <Box
                        key={event._id}
                        textAlign="center"
                        px="4"
                        pt="20px"
                        pb="20px"
                        onClick={() => setupViewEventModal(event)}
                      >
                        <Box
                          position="relative"
                          borderWidth="1px"
                          p="4"
                          h="60"
                          textAlign="left"
                          borderRadius="20px"
                          className={style.registeredEventBox}
                        >
                          <ChakraNextImage
                            src={event.eventImage || '/beaver-eventcard.jpeg'}
                            alt="Event Image"
                            objectFit="cover"
                            position="absolute"
                            zIndex="-1"
                            top="0"
                            left="0"
                            layout="fill"
                            borderRadius={'20px'}
                          />
                          <Box
                            className={style.eventDetailsContainer}
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                          >
                            <Heading
                              as="h1"
                              size="2xl"
                              zIndex={2}
                              position={'relative'}
                            >
                              <Text
                                fontSize={eventNameSize}
                                fontWeight="800"
                                color="white"
                                className="bold-text"
                                mx={2}
                                zIndex={2}
                              >
                                {event.eventName}
                              </Text>
                            </Heading>
                            <Box>
                              <Flex className={style.eventDetails}>
                                <CalendarIcon mt={'5px'} />
                                <Text ml={'5px'}>
                                  {formatDate(event.startTime)}
                                </Text>
                              </Flex>
                              <Flex className={style.eventDetails}>
                                <TimeIcon mt={'5px'} />
                                <Text ml={'5px'}>
                                  {formatDateTimeRange(
                                    event.startTime,
                                    event.endTime
                                  )}
                                </Text>
                              </Flex>
                              <Flex className={style.eventDetails}>
                                <Box mt={'5px'}>
                                  <PiMapPinFill />
                                </Box>
                                <Text ml={'5px'}>{event.location}</Text>
                              </Flex>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <EventPlaceholder />
                )}
                {userEvents.length < 3 &&
                  (window.innerWidth <= 600
                    ? Array.from({ length: 0 }, (_, i) => (
                        <EventPlaceholder key={`placeholder-${i}`} />
                      ))
                    : window.innerWidth <= 1024
                      ? Array.from(
                          { length: 3 - (userEvents.length === 2 ? 3 : 2) },
                          (_, i) => (
                            <EventPlaceholder key={`placeholder-${i}`} />
                          )
                        )
                      : Array.from(
                          { length: 3 - userEvents.length },
                          (_, i) => (
                            <EventPlaceholder key={`placeholder-${i}`} />
                          )
                        ))}
              </Slider>
            ) : null}
          </Box>
          {/* Re-include the omitted bottom section here */}
          <Box px="10" mb={6}>
            <Flex alignItems="center" justifyContent="space-between" mt={6}>
              <Text
                fontSize={['xl', 'xl', '2xl']}
                fontWeight="light"
                color="black"
                mb={3}
              >
                Upcoming Events
              </Text>

              <Select
                id="event-type"
                placeholder="Event Type"
                size={['sm', 'sm', 'md']}
                options={eventTypes.map((type) => ({
                  value: type,
                  label: type,
                }))}
                className={style.selectContainer}
                onChange={(selectedOption) =>
                  setSelectedEventType(
                    selectedOption ? selectedOption.value : ``
                  )
                }
                isClearable
              />
            </Flex>
            <Divider
              size="sm"
              borderWidth="1px"
              borderColor="grey"
              alignSelf="center"
              w="100%"
              my={2}
            />
            {!allDataLoaded ? (
              <Text
                fontSize={['xl', 'xl', '2xl']}
                fontWeight="400"
                color="black"
                textAlign="center"
                mt={5}
              >
                Loading...
              </Text>
            ) : userData && unregisteredEvents.length === 0 ? (
              <Text
                fontSize={['xl', 'xl', '2xl']}
                fontWeight="bold"
                color="black"
                textAlign="center"
                mt={5}
              >
                No events at the moment!
              </Text>
            ) : null}
          </Box>
          <Box mt={7} px={6}>
            {unregisteredEvents.length > 0 ? (
              <Slider {...unregisteredEventSettings}>
                {unregisteredEvents.length > 0 ? (
                  unregisteredEvents.map((event) => {
                    return (
                      <Box
                        key={event._id}
                        textAlign="center"
                        px="0"
                        mb="4"
                        onClick={() => setupViewEventModal(event)}
                      >
                        <Box
                          key={event._id}
                          position="relative"
                          borderWidth="1px"
                          p="4"
                          mt="4"
                          textAlign="left"
                          h="64"
                          mx="4"
                          borderRadius="20px"
                          className={style.eventBox}
                          flex="1 0 40%" // Adjust the width as needed
                        >
                          <ChakraNextImage
                            src={event.eventImage || '/beaver-eventcard.jpeg'}
                            alt="Event Image"
                            objectFit="cover"
                            position="absolute"
                            zIndex="-1"
                            top="0"
                            left="0"
                            layout="fill"
                            borderRadius={'20px'}
                          />
                          <Box className={style.eventDetailsContainer}>
                            <Heading
                              as="h1"
                              size="2xl"
                              zIndex={2}
                              position={'relative'}
                              mb={1}
                            >
                              <Text
                                fontSize={eventNameSize}
                                fontWeight="800"
                                color="white"
                                className="bold-text"
                                mx={2}
                                zIndex={2}
                              >
                                {event.eventName}
                              </Text>
                            </Heading>
                            <Box>
                              <Flex className={style.eventDetails}>
                                <CalendarIcon mt={'5px'} />
                                <Text ml={'5px'}>
                                  {formatDate(event.startTime)}
                                </Text>
                              </Flex>
                              <Flex className={style.eventDetails}>
                                <TimeIcon mt={'5px'} />
                                <Text ml={'5px'}>
                                  {formatDateTimeRange(
                                    event.startTime,
                                    event.endTime
                                  )}
                                </Text>
                              </Flex>
                              <Flex className={style.eventDetails}>
                                <Box mt={'5px'}>
                                  <PiMapPinFill />
                                </Box>
                                <Text ml={'5px'}>{event.location}</Text>
                              </Flex>
                            </Box>
                          </Box>
                          <Box
                            position="absolute"
                            bottom="0"
                            left="0"
                            right="0"
                            p={2}
                            mx="16px"
                            my="2"
                            zIndex={2}
                          >
                            <Heading
                              className="flex flex-row justify-start"
                              as="h2"
                              fontSize="xl"
                            >
                              <Link
                                href={'/events/' + event._id + '/digitalWaiver'}
                              >
                                <Button
                                  bg="#e0af48"
                                  color="black"
                                  _hover={{ bg: '#C19137' }}
                                  fontSize={eventDetailSize}
                                  onClick={handleButtonClickToStopPropagation}
                                >
                                  Register
                                </Button>
                              </Link>
                              {event.groupsOnly && (
                                <div className="w-full flex flex-row justify-end items-center">
                                  <Text
                                    fontFamily="Lato"
                                    fontWeight="500"
                                    fontSize="18px"
                                    color="white"
                                    marginRight="5%"
                                    className="bold-text"
                                  >
                                    Invite Only
                                  </Text>
                                  <LockIcon color="wheat" />
                                </div>
                              )}
                            </Heading>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <UnregisteredEventPlaceholder />
                )}
                {unregisteredEvents.length < 2 &&
                  (window.innerWidth <= 600
                    ? Array.from({ length: 0 }, (_, i) => (
                        <UnregisteredEventPlaceholder
                          key={`placeholder-${i}`}
                        />
                      ))
                    : window.innerWidth <= 1024
                      ? Array.from(
                          {
                            length:
                              2 - (unregisteredEvents.length === 1 ? 1 : 0),
                          },
                          (_, i) => (
                            <UnregisteredEventPlaceholder
                              key={`placeholder-${i}`}
                            />
                          )
                        )
                      : Array.from(
                          { length: 2 - unregisteredEvents.length },
                          (_, i) => (
                            <UnregisteredEventPlaceholder
                              key={`placeholder-${i}`}
                            />
                          )
                        ))}
              </Slider>
            ) : null}
          </Box>
        </Box>
      </div>
      <ExpandedViewComponent
        eventDetails={eventForExpandedViewComponent}
        editUrl={eventForExpandedViewComponent?._id}
        showModal={isExpandedViewComponentOpen}
        setShowModal={toggleExpandedViewComponentOpen}
        mutate={mutate}
      />
    </div>
  );
}
