"use client";
import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import styles from "./page.module.css";
import defaultBeaver from "/docs/images/DefaultBeaver.jpeg";
import "../../../../fonts/fonts.css";
import Image from "next/image";
import EditEventPrimaryInfo from "@components/EditEventPrimaryInfo";
import EditEventVisitorInfo from "@components/EditEventVisitorInfo";
import EditEventHeader from "@components/EditEventHeader";
import { useEffect, useState } from "react";
import { IUser } from "@database/userSchema";
import { IEvent } from "@database/eventSchema";
import { fallbackBackgroundImage } from "app/lib/random";

type IParams = {
  params: {
    eventId: string;
  };
};

export default function EditEventsPage({ params: { eventId } }: IParams) {
  const [eventData, setEventData] = useState<IEvent>({
    _id: "",
    eventName: "",
    eventImage: null,
    checklist: "N/A",
    eventType: "",
    location: "",
    description: "",
    wheelchairAccessible: false,
    spanishSpeakingAccommodation: false,
    startTime: new Date(0),
    endTime: new Date(0),
    volunteerEvent: false,
    groupsAllowed: [],
    registeredIds: [],
    attendeeIds: [],
  });

  const [visitorData, setVisitorData] = useState<IUser[]>([
    {
      _id: "",
      email: "",
      phoneNumber: "",
      firstName: "",
      lastName: "",
      age: -1,
      gender: "",
      role: "user",
      eventsRegistered: [],
      eventsAttended: [],
      groupId: null,
      recieveNewsletter: false
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }
        const data = await response.json();
        data.startTime = new Date(data.startTime);
        data.endTime = new Date(data.endTime);
        setEventData(data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    const fetchVisitorData = async () => {
      if (eventData.eventName !== "") {
        const visitors: IUser[] = []
        const visitorDataArray = await Promise.all(
          eventData.registeredIds
            .filter((userId) => userId !== null)
            .map(async (userId) => {
              const response = await fetch(`/api/user/${userId}`);
              if (response.ok){
                console.log('ok')
                visitors.push(await response.json())
              }
              return null
            })
        );
        setVisitorData(visitors);
        setLoading(false);
      }
    };
    fetchVisitorData();
  }, [eventData]);

  const emailLink = () => {
    const emails = visitorData
      .map((visitor) => visitor.email)
      .filter((email) => !!email);
    const subject = encodeURIComponent(eventData.eventName + " Update");
    return `mailto:${emails.join(",")}?subject=${subject}`;
  };

  const handleEmailAllVisitors = () => {
    const mailtoLink = emailLink();
    console.log(mailtoLink);
    window.location.href = mailtoLink;
  };

  return (
    <Box className={styles.eventPage}>
      <EditEventHeader eventId={eventId} />
      <Flex
        className={styles.temp}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
      >
        <Box className={styles.leftColumn} w={{ base: "100%", md: "38%" }}>
          <Box style={{background: fallbackBackgroundImage(eventData.eventImage, "/beaver-eventcard.jpeg"), backgroundSize: "cover"}} className={styles.imageContainer}>
          </Box>
          <button
            onClick={handleEmailAllVisitors}
            className={styles.emailAllVisitors}
          >
            Email All Visitors
          </button>
          <EditEventVisitorInfo eventId={eventId}/>
        </Box>
        <Box className={styles.rightColumn} w={{ base: "100%", md: "58%" }}>
          <EditEventPrimaryInfo eventId={eventId} />
        </Box>
      </Flex>
    </Box>
  );
}
