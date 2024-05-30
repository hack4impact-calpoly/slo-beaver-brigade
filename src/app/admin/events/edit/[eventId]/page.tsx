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
import { useEventId } from "app/lib/swrfunctions";

type IParams = {
  params: {
    eventId: string;
  };
};

export default function EditEventsPage({ params: { eventId } }: IParams) {
  const {eventData, isLoading, isError, mutate} = useEventId(eventId)


  return (
    <Box className={styles.eventPage}>
      <EditEventHeader eventId={eventId} />
      <Flex
        className={styles.temp}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
      >
        <Box className={styles.leftColumn} w={{ base: "100%", md: "38%" }}>
          <EditEventVisitorInfo eventId={eventId} />
          <Box className={styles.imageContainer}>
            <img
              src={eventData?.eventImage || "/beaver-eventcard.jpeg"}
              alt="cover"
            ></img>
          </Box>
        </Box>
        <Box className={styles.rightColumn} w={{ base: "100%", md: "58%" }}>
          <EditEventPrimaryInfo eventId={eventId} />
        </Box>
      </Flex>
    </Box>
  );
}
