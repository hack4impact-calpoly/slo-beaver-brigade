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
  const formatDate = (date: Date | string): string => {
    if (!date) return "Invalid date";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? "Invalid date" : new Intl.DateTimeFormat("en-US", options).format(parsedDate);
  };

  const formatTimeRange = (
    startTime: Date | string,
    endTime: Date | string
  ): string => {
    if (!startTime || !endTime) return "Invalid time range";
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
      return "Invalid time range";
    }

    const formattedStartTime = new Intl.DateTimeFormat(
      "en-US",
      timeOptions
    ).format(parsedStartTime);
    const formattedEndTime = new Intl.DateTimeFormat(
      "en-US",
      timeOptions
    ).format(parsedEndTime);

    return `${formattedStartTime} - ${formattedEndTime}`;
  };

  const backgroundImage = fallbackBackgroundImage(event.eventImage, "/beaver-eventcard.jpeg");
  return (
    <div
      className={style.eventCard}
      style={{
        background: backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "brightness(50%)"
      }}
      onClick={onClick}
    >
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
          <h3>{event.registeredIds.length === 1 ? " Visitor" : " Visitors"}</h3>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
