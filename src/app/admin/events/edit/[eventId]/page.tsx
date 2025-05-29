"use client";
import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import styles from "./page.module.css";
import "../../../../fonts/fonts.css";
import EditEventPrimaryInfo from "@components/EditEventPrimaryInfo";
import EditEventVisitorInfo from "@components/EditEventVisitorInfo";
import EditEventHeader from "@components/EditEventHeader";
import { useEventId } from "app/lib/swrfunctions";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PassThrough } from "stream";

type IParams = {
  params: {
    eventId: string;
  };
};

export default function EditEventsPage({ params: { eventId } }: IParams) {
  const {eventData, isLoading, isError, mutate} = useEventId(eventId)
  
  const [imageSrc, setImageSrc] = useState<string>(eventData?.eventImage || '/beaver-eventcard.jpeg');

  const handleImageError = () => {
    setImageSrc('/beaver-eventcard.jpeg');
  };

  useEffect(() => {
    PassThrough  
  }, [imageSrc]);

  return (
    <Box className={styles.eventPage}>
      <EditEventHeader eventId={eventId} />
      <Flex
        className={styles.temp}
        direction={{ base: "column", xl: "row" }}
        justify="space-between"
      >
        <Box className={styles.leftColumn} w={{ base: "100%", xl: "45%" }}>
          <EditEventVisitorInfo eventId={eventId} />
          <Box className={styles.imageContainer}>
            <Image
              src={imageSrc}
              alt="Event cover"
              width={500}
              height={500}
              className={styles.eventImage}
              onError={handleImageError}
            />
          </Box>
        </Box>
        <Box className={styles.rightColumn} w={{ base: "100%", xl: "50%" }}>
          <EditEventPrimaryInfo eventId={eventId} />
        </Box>
      </Flex>
    </Box>
  );
}
