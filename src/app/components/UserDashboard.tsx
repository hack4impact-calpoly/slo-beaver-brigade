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
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { css } from '@emotion/react';
import '@emotion/react';
import EventListRegister from '@components/EventList';
import Link from 'next/link';
import style from '@styles/userdashboard/dashboard.module.css';
import { IUser } from '@database/userSchema';
import { fallbackBackgroundImage } from '@app/lib/random';
import { IEvent } from '@database/eventSchema';
import ExpandedViewComponent from './StandaloneExpandedViewComponent';
import '../fonts/fonts.css';

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

export const UserDashboard = ({
  eventsRes,
  userDataRes,
}: {
  eventsRes: string;
  userDataRes: string | null;
}) => {
  const sliderStyles = css`
    .slick-dots li button:before {
    }

    .slick-prev:before,
    .slick-next:before {
      color: black; // Your desired color for arrows
    }
  `;

  const [events, setEvents] = useState<IEvent[]>([]);
  const [userData, setUserData] = useState<IUser | null>(null);

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
    setEvents(JSON.parse(eventsRes));
    if (userDataRes) {
      setUserData(JSON.parse(userDataRes));
    }
    setParsed(true);
  }, [eventsRes, userDataRes]);

  useEffect(() => {
    if (parsed && userData) {
      const currentDate = new Date();
      // Filter events based on user registration and selected event type

      const userSignedUpEvents = events.filter((event) =>
        event.registeredIds.includes(userData?._id)
      );

      const eventsUserHasntRegistered = events.filter(
        (event) => !event.registeredIds.includes(userData?._id)
      );

      const filteredEvents = eventsUserHasntRegistered.filter(
        (event) =>
          new Date(event.endTime) >= currentDate &&
          (!selectedEventType || event.eventType === selectedEventType) // Filter by event type if selected
      );

      setUserEvents(userSignedUpEvents);
      setUnregisteredEvents(filteredEvents);
    } else {
      const currentDate = new Date();
      const upcomingEvents = events.filter(
        (event) =>
          new Date(event.endTime) > currentDate &&
          (!selectedEventType || event.eventType === selectedEventType) // Filter by event type if selected
      );
      setUserEvents([]);
      setUnregisteredEvents(upcomingEvents);
    }
    setEventsLoading(false);
  }, [events, userData, selectedEventType, parsed]); // Include selectedEventType in the dependency array

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch('/api/events/bytype/eventType');
        const data: string[] = await response.json();
        setEventTypes(data);
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    };

    fetchEventTypes();
  }, []);

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

  const allDataLoaded = !eventsLoading;

  const toggleExpandedViewComponentOpen = () => {
    setExpandedViewComponentOpen(!isExpandedViewComponentOpen);
  };

  function setupViewEventModal(event: IEvent) {
    setEventForExpandedViewComponent(event);
    setExpandedViewComponentOpen(!isExpandedViewComponentOpen);
  }

  const handleButtonClickToStopPropogation = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
  };

  return (
    <div>
      <EventListRegister
        setShowModal={setShowEventList}
        showModal={showEventList}
      ></EventListRegister>

      {/*{userData &&
    <div className="px-[3rem] pt-3">
             <EmailRSSComponent calendarURL={"/api/user/calendar/" + userData?._id}/>
    </div>
             /*<a href=>Add to calendar!</a>*/}

      <div css={sliderStyles}>
        <Box p="4">
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
            ) : !userData ? (
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
                    const backgroundImage = fallbackBackgroundImage(
                      event.eventImage,
                      '/beaver-eventcard.jpeg'
                    );
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
                          style={{
                            //backgroundImage: `url(${event.imageUrl || '/default-event-image.jpg'})`,
                            background: backgroundImage,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                          }}
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
                          <Box
                            position="absolute"
                            bottom="0"
                            left="0"
                            right="0"
                            p={2}
                            mx="2"
                            my="2"
                            backdropBlur={2}
                            backdropFilter={'blur(2px)'}
                            zIndex={2}
                          >
                            <Text
                              fontSize={eventDetailSize}
                              fontFamily="Lato"
                              fontWeight="500"
                              color="white"
                              className="bold-text"
                              mx={2}
                              zIndex={2}
                              alignContent="left-bottom"
                            >
                              {formatDate(event.startTime)}
                            </Text>
                            <Text
                              fontSize={eventTimeSize}
                              fontFamily="Lato"
                              fontWeight="500"
                              color="white"
                              className="bold-text"
                              mx={2}
                              alignContent="left-bottom"
                              zIndex={2}
                            >
                              {formatDateTimeRange(
                                event.startTime,
                                event.endTime
                              )}
                            </Text>
                            <Text
                              fontSize={eventTimeSize}
                              fontFamily="Lato"
                              fontWeight="500"
                              color="white"
                              className="bold-text"
                              mx={2}
                              zIndex={2}
                              alignContent="left-bottom"
                            >
                              {event.location}
                            </Text>
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
                    const backgroundImage = fallbackBackgroundImage(
                      event.eventImage,
                      '/beaver-eventcard.jpeg'
                    );
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
                          style={{
                            //backgroundImage: `url(${event.imageUrl || '/default-event-image.jpg'})`,
                            background: backgroundImage,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'left 40%',
                          }}
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
                          <Heading
                            as="h1"
                            size="3xl"
                            mb="1"
                            position={'relative'}
                            zIndex={2}
                          >
                            <Text
                              fontSize={eventNameSize}
                              fontWeight="custom"
                              color="white"
                              className="bold-text"
                              zIndex={2}
                            >
                              {event.eventName}
                            </Text>
                          </Heading>
                          <Box
                            position={'relative'}
                            zIndex={2}
                            fontSize={eventDetailSize}
                          >
                            <Text
                              fontFamily="Lato"
                              fontWeight="500"
                              color="white"
                              className="bold-text"
                              zIndex={2}
                            >
                              {formatDate(event.startTime)}
                            </Text>
                            <Text
                              fontFamily="Lato"
                              fontWeight="500"
                              color="white"
                              className="bold-text"
                              zIndex={2}
                            >
                              {formatDateTimeRange(
                                event.startTime,
                                event.endTime
                              )}
                            </Text>
                            <Text
                              fontFamily="Lato"
                              fontWeight="500"
                              color="white"
                              className="bold-text"
                              zIndex={2}
                            >
                              {event.location}
                            </Text>
                          </Box>
                          <Box
                            position="absolute"
                            bottom="0"
                            left="0"
                            right="0"
                            p={2}
                            mx="2"
                            my="2"
                            zIndex={2}
                          >
                            <Heading as="h2" fontSize="xl">
                              <Link
                                href={'/events/' + event._id + '/digitalWaiver'}
                              >
                                <Button
                                  bg="#e0af48"
                                  color="black"
                                  _hover={{ bg: '#C19137' }}
                                  fontSize={eventDetailSize}
                                  mt={14}
                                  onClick={handleButtonClickToStopPropogation}
                                >
                                  Register
                                </Button>
                              </Link>
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
      />
    </div>
  );
};
