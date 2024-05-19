"use client";

import {
  Box,
  Spinner,
  Checkbox,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import styles from "../styles/admin/editEvent.module.css";
import { IEvent } from "@database/eventSchema";
import { IUser } from "@database/userSchema";
import { IWaiver } from "database/digitalWaiverSchema";
import { removeAttendee } from "app/actions/serveractions";
import { addAttendee } from "app/actions/useractions";
import SingleVisitorComponent from "./SingleVisitorComponent";

const EditEventVisitorInfo = ({ eventId }: { eventId: string }) => {
  const [loading, setLoading] = useState(true);
  const [visitorData, setVisitorData] = useState<IUser[]>([]);
  const [eventData, setEventData] = useState<IEvent>({
    _id: '',
    eventName: '',
    eventImage: null,
    checklist: "N/A",
    eventType: '',
    location: '',
    description: '',
    wheelchairAccessible: false,
    spanishSpeakingAccommodation: false,
    startTime: new Date(0),
    endTime: new Date(0),
    volunteerEvent: false,
    groupsAllowed: [],
    registeredIds: [],
    attendeeIds: []
  });

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
        console.error('Error fetching event data:', error);
      }
    };
    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    const fetchVisitorData = async () => {
      if (eventData.eventName !== "") {
        const visitors: IUser[] = [];
        const dependents: IUser[] = [];

        // Fetch waivers for the event
        try {
          const waiverResponse = await fetch(`/api/waiver/${eventId}`);
          if (waiverResponse.ok) {
            const waivers = await waiverResponse.json();
            waivers.forEach((waiver: IWaiver) => {
              waiver.dependents.forEach((dependent) => {
                dependents.push({
                  _id: `${dependent} (Dependent)`,
                  groupId: null,
                  email: "(Dependent)",
                  firstName: dependent,
                  lastName: "",
                  phoneNumber: "",
                  age: -1,
                  gender: "",
                  role: "guest",
                  eventsAttended: [],
                  eventsRegistered: [],
                  recieveNewsletter: false,
                });
              });
            });
          } else {
            console.error("Error fetching waivers:", await waiverResponse.json());
          }
        } catch (error) {
          console.error('Error fetching waivers:', error);
        }

        // Fetch user data for registered IDs
        try {
          await Promise.all(
            eventData.registeredIds
              .filter((userId) => userId !== null)
              .map(async (userId) => {
                const response = await fetch(`/api/user/${userId}`);
                if (response.ok) {
                  visitors.push(await response.json());
                } else {
                  console.error("Error fetching user:", await response.json());
                }
              })
          );
          console.log("Visitors collected:", visitors);
        } catch (error) {
          console.error('Error fetching users:', error);
        }

        // Sort visitors by firstName and ensure dependents appear last
        const sortedVisitors = [
          ...visitors.sort((a, b) => a.firstName.localeCompare(b.firstName)),
          ...dependents,
        ];

        console.log("Final visitor data with dependents:", sortedVisitors);

        setVisitorData(sortedVisitors);
        setLoading(false);
      }
    };
    fetchVisitorData();
  }, [eventData, eventId]);

  async function handleCheck(checked: boolean, userid: string) {
    if (checked) {
      await addAttendee(userid.toString(), eventId.toString());
    } else {
      await removeAttendee(userid.toString(), eventId.toString());
    }
  }

  return (
    <Box className={styles.eventInformation}>
      {loading ? (
        <div className={styles.visitorHeadingLoading}>
          Visitors
          <Spinner className={styles.spinner} speed="0.8s" thickness="3px" />
        </div>
      ) : (
        <>
          <div className={styles.visitorHeading}>
            Visitors
            <div className={styles.visitorCount}>
              ({visitorData.length})
            </div>
            <button onClick={handleEmailAllVisitors} className={styles.emailAllVisitors}>Email All Visitors</button>
          </div>
          {visitorData.length === 0 ? (
            <div className={styles.noVisitorsMessage}>No visitors registered for this event.</div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.visitorTable}>
                <tbody>
                  {visitorData.map((visitor, index) => (
                    <tr className={styles.visitorRow} key={index}>
                      <td className={styles.checkBox}>
                        {eventData.attendeeIds.map(oid => oid.toString()).includes(visitor._id) ?
                          <Checkbox colorScheme="green" defaultChecked onChange={async (e) => await handleCheck(e.target.checked, visitor._id.toString())} />
                          :
                          <Checkbox colorScheme="green" onChange={async (e) => await handleCheck(e.target.checked, visitor._id.toString())} />
                        }
                      </td>
                      <td className={styles.nameColumn}>
                        {visitor.firstName} {visitor.lastName}
                      </td>
                      <td className={styles.emailColumn}>
                        {visitor.email.includes("(Dependent)") ? <span className={styles.dependent}>{visitor.email}</span> : visitor.email}
                      </td>
                      <td className={styles.detailsColumn}>
                        <SingleVisitorComponent visitorData={visitor} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Box>
  );
}

export default EditEventVisitorInfo;
