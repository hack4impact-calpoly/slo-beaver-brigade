import React from 'react';
import Image from 'next/image';
import style from '@styles/admin/eventCard.module.css';
import { IEvent } from '@database/eventSchema';
import ChakraNextImage from './ChakraNextImage';
import { CalendarIcon, TimeIcon } from '@chakra-ui/icons';
import { PiMapPinFill } from 'react-icons/pi';
import { Box, Flex, Text } from '@chakra-ui/react';

interface EventPreviewProps {
  event: IEvent;
  groupName: string;
  onClick: () => void;
}

 // convert date into xx:xx XM - xx:xx XM
 const formatDateTimeRange = (start: Date, end: Date) => {
  if (!(start instanceof Date)) {
    start = new Date(start); // Convert to Date object if not already
  }

  if (!(end instanceof Date)) {
    end = new Date(end); // Convert to Date object if not already
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric", // "numeric" or "2-digit"
    minute: "numeric", // "numeric" or "2-digit"
  };

  const formattedStart = start.toLocaleTimeString("en-US", options);
  const formattedEnd = end.toLocaleTimeString("en-US", options);


  return `${formattedStart} - ${formattedEnd}`;
 };

const EventCard: React.FC<EventPreviewProps> = ({
  event,
  groupName,
  onClick,
}) => {
  const formatDate = (date: Date | string): string => {
    if (!date) return 'Invalid date';
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? 'Invalid date'
      : new Intl.DateTimeFormat('en-US', options).format(parsedDate);
  };

  const formatTimeRange = (
    startTime: Date | string,
    endTime: Date | string
  ): string => {
    if (!startTime || !endTime) return 'Invalid time range';
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
      return 'Invalid time range';
    }

    const formattedStartTime = new Intl.DateTimeFormat(
      'en-US',
      timeOptions
    ).format(parsedStartTime);
    const formattedEndTime = new Intl.DateTimeFormat(
      'en-US',
      timeOptions
    ).format(parsedEndTime);

    return `${formattedStartTime} - ${formattedEndTime}`;
  };

  const backgroundImage = event.eventImage || '/beaver-eventcard.jpeg';

  return (
    <div className={style.eventCard} onClick={onClick}>
      <div className={style.imageWrapper}>
        <Image
          src={backgroundImage}
          alt="Event cover"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className={style.eventImage}
        />
      </div>
      <div className={style.eventTitle}>
        <h2>{event.eventName}</h2>
      </div>
      <div className={style.bottomRow}>
        <div className={style.eventInfo}>
          <Flex className={style.eventDetails}>
            <CalendarIcon mt={'5px'} />
            <Text ml={'5px'}>{formatDate(event.startTime)}</Text>
          </Flex>
          <Flex className={style.eventDetails}>
            <TimeIcon mt={'5px'} />
            <Text ml={'5px'}>
              {formatDateTimeRange(event.startTime, event.endTime)}
            </Text>
          </Flex>
          <Flex className={style.eventDetails}>
            <Box mt={'5px'}>
              <PiMapPinFill />
            </Box>
            <Text ml={'5px'}>{event.location}</Text>
          </Flex>
        </div>
       <div className={style.visitorCount}>
         <h2>{`${event.registeredIds.length} / ${event.maxHeadcount}`}</h2>
         <h3>Visitors</h3>
       </div>
      </div>
    </div>
  );
};

export default EventCard;
