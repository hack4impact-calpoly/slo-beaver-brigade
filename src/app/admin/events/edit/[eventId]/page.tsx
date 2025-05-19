"use client";
import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import styles from "./page.module.css";
import "../../../../fonts/fonts.css";
import EditEventPrimaryInfo from "@components/EditEventPrimaryInfo";
import EditEventVisitorInfo from "@components/EditEventVisitorInfo";
import EditEventHeader from "@components/EditEventHeader";
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
        direction={{ base: "column", xl: "row" }}
        justify="space-between"
      >
        <Box className={styles.leftColumn} w={{ base: "100%", xl: "38%" }}>
          <EditEventVisitorInfo eventId={eventId} />
          <Box className={styles.imageContainer}>
            <img
              src={eventData?.eventImage || "/beaver-eventcard.jpeg"}
              alt="cover"
            ></img>
          </Box>
        </Box>
        <Box className={styles.rightColumn} w={{ base: "100%", xl: "58%" }}>
          <EditEventPrimaryInfo eventId={eventId} />
        </Box>
      </Flex>
    </Box>
  );
}
