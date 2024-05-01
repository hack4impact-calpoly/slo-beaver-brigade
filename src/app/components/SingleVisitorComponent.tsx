"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import styles from "../styles/admin/editEvent.module.css";
import { IUser } from "@database/userSchema";
import { eventHours } from ".././lib/hours";
import { Schema } from "mongoose";

interface Event {
  _id: string;
  eventName: string;
  eventImage: string | null;
  eventType: string;
  location: string;
  description: string;
  checklist: string;
  wheelchairAccessible: boolean;
  spanishSpeakingAccommodation: boolean;
  startTime: Date;
  endTime: Date;
  volunteerEvent: boolean;
  groupsAllowed: Schema.Types.ObjectId[] | null;
  attendeeIds: Schema.Types.ObjectId[];
  registeredIds: Schema.Types.ObjectId[];
}

function SingleVisitorComponent({ visitorData }: { visitorData: IUser }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventIds = visitorData.eventsAttended.map((e) => e.eventId);
        const fetchedEvents = await Promise.all(
          eventIds.map((id) =>
            fetch(`/api/events/${id}`)
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                return { ...data, attendeeIds: data.attendeeIds || [] };
              })
          )
        );
        console.log(fetchedEvents);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
      setLoading(false);
    };

    if (visitorData.eventsAttended.length > 0) {
      fetchEvents();
    }
  }, [visitorData]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <div className={styles.link}>
        <Text onClick={onOpen}>Details</Text>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          style={{ width: "60vw", height: "65vh", padding: "0% 5% 5% 5%" }}
          maxW="100rem"
        >
          <ModalHeader
            style={{
              padding: "2% 0% 2% 0%",
              textAlign: "left",
              fontSize: "35px",
              fontWeight: "bold",
              fontFamily: "Lato",
              width: "100%",
            }}
          >
            {visitorData.firstName} {visitorData.lastName}
          </ModalHeader>
          <ModalCloseButton />
          <hr />
          <ModalBody style={{ display: "flex", padding: "0%" }}>
            <Box style={{ paddingRight: "4%", width: "50%" }}>
              <Text className={styles.visitorInfoSmallHeader}>
                Personal Info
              </Text>
              <Text className={styles.fieldInfo}>
                Email: {visitorData.email ? visitorData.email : "N/A"}
              </Text>
              <Text className={styles.fieldInfo}>
                Phone:{" "}
                {visitorData.phoneNumber ? visitorData.phoneNumber : "N/A"}
              </Text>
              <Text className={styles.fieldInfo}>
                Age: {visitorData.age !== -1 ? visitorData.age : "N/A"}
              </Text>
              <Text className={styles.fieldInfo}>
                Gender: {visitorData.gender ? visitorData.gender : "N/A"}
              </Text>
              <Text className={styles.fieldInfo}>Address: N/A</Text>
              <Text className={styles.fieldInfo}>City: N/A</Text>
              <Text className={styles.fieldInfo}>Zipcode: N/A</Text>
              <Text className={styles.fieldInfo}>Primary Language: N/A</Text>
              <Text className={styles.visitorInfoSmallHeader}>
                Availability
              </Text>
              <Text className={styles.fieldInfo}>Available Locations: N/A</Text>
            </Box>
            <Box style={{ paddingLeft: "4%", width: "50%" }}>
              <Text className={styles.visitorInfoSmallHeader}>
                Interest Questions
              </Text>
              <Text className={styles.fieldInfo}>
                What led you to SLO Beavers: N/A
              </Text>
              <Text className={styles.fieldInfo}>Specialized skills: N/A</Text>
              <Text className={styles.fieldInfo}>
                Why are you interested: N/A
              </Text>
              <Text className={styles.visitorInfoSmallHeader}>
                Events Attendeded
              </Text>
              <div className={styles.tableContainer}>
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th>Event Name</Th>
                      <Th>Duration</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {events.map((event) => {
                      console.log(event);
                      return (
                        <Tr key={event._id}>
                          <Td>{event.eventName}</Td>
                          <Td>{eventHours(event)}</Td>
                          <Td>{formatDate(event.startTime)}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </div>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SingleVisitorComponent;
