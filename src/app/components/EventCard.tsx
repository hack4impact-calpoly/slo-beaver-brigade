import React from "react";
import style from "@styles/admin/eventCard.module.css";
import { IEvent } from "@database/eventSchema";
import { Image } from "@chakra-ui/react";

interface EventPreviewProps {
  event: IEvent;
  groupName: String;
  onClick: () => void;
}

const EventCard: React.FC<EventPreviewProps> = ({
  event,
  groupName,
  onClick,
}) => {
  // formats date saturday, february, 17th
  const formatDate = (date: Date | string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  // format time range
  const formatTimeRange = (
    startTime: Date | string,
    endTime: Date | string
  ): string => {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const formattedStartTime = new Intl.DateTimeFormat(
      "en-US",
      timeOptions
    ).format(new Date(startTime));
    const formattedEndTime = new Intl.DateTimeFormat(
      "en-US",
      timeOptions
    ).format(new Date(endTime));

    return `${formattedStartTime} - ${formattedEndTime}`;
  };

  return (
    <div
      className={style.eventCard}
      onClick={onClick}
    >
      <Image
        src={event.eventImage || "/beaver-eventcard.jpeg"}
        alt="Event Image"
        objectFit={"cover"}
        position={"absolute"}
        zIndex={"-1"}
        top="0"
        left="0"
        width="100%"
        height="100%"
        borderRadius={"8px"}
      />

      <div className={style.eventTitle}>
        <h2>{event.eventName}</h2>
      </div>
      <div className={style.bottomRow}>
        <div className={style.eventInfo}>
          <h2>{formatDate(event.startTime)}</h2>
          <h3>{groupName}</h3>
          <h3>{event.location}</h3>
          <h3>{formatTimeRange(event.startTime, event.endTime)}</h3>
        </div>
        <div className={style.visitorCount}>
          <h2>{event.registeredIds.length}</h2>
          <h3>{event.registeredIds.length == 1 ? " Visitor" : "Visitors"}</h3>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
