import React from "react";
import style from "@styles/admin/eventCard.module.css";
import { IEvent } from "@database/eventSchema";
import { fallbackBackgroundImage } from "app/lib/random";

interface EventPreviewProps {
  event: IEvent;
  groupName: string;
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

  const backgroundImage = fallbackBackgroundImage(event.eventImage, "/beaver-eventcard.jpeg")
  return (
    <div
      className={style.eventCard}
      onClick={onClick}
      style={{
<<<<<<< HEAD
        background: 'linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url("/beaver-eventcard.jpeg")',
=======
        background: backgroundImage,
>>>>>>> origin/main
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "brightness(50%)"
      }}
    >
      <div className={style.eventContent}>
        <div className={style.eventName}>
          <h2>{event.eventName}</h2>
        </div>
        <div className={style.eventTime}>
          <h3>{formatTimeRange(event.startTime, event.endTime)}</h3>
        </div>
      </div>
      <div className={style.bottomRow}>
        <div className={style.eventInfo}>
          <div>
            <h2>{groupName}</h2>
          </div>
        </div>
        <div className={style.visitorCount}>
          <h2>{event.registeredIds.length}</h2>
          <h3>{event.registeredIds.length === 1 ? " Visitor" : "Visitors"}</h3>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
