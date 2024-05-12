"use client";
"use client";

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
  useDisclosure,
  Checkbox,
} from "@chakra-ui/react";
import React, { useState, useEffect} from "react";
import styles from "../styles/admin/editEvent.module.css";
import { IEvent } from "@database/eventSchema";
import { IUser } from "@database/userSchema";
import { removeAttendee } from "app/actions/serveractions";
import { addAttendee } from "app/actions/useractions";
import SingleVisitorComponent from "./SingleVisitorComponent";

const EditEventVisitorInfo = ({ eventId }: { eventId: string }) => {
  var mongoose = require('mongoose');
  const [loading, setLoading] = useState(true);
  const [attendees,setAttendees] = useState([]);
  const [visitorData, setVisitorData] = useState<IUser[]>([
    {
      _id: "",
      groupId: null,
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      age: -1,
      gender: "",
      role: "user",
      eventsAttended: [],
      eventsRegistered:[],
      recieveNewsletter: false
    },
  ]);
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
        const fetchVisitorData = async() => {
            if(eventData.eventName !== ""){
                const visitorDataArray = await Promise.all(eventData.registeredIds.filter(userId => userId !== null).map(async (userId) => {
                    const response = await fetch(`/api/user/${userId}`);
                    return response.json();
                }))
                setVisitorData(visitorDataArray)
                setLoading(false);
            }
        }
        fetchVisitorData()
    }, [eventData]);
    
    async function handleCheck(checked:boolean,userid: string){
      
      if(checked){
        await addAttendee(userid.toString(),eventId.toString())
      }
      else{
        await removeAttendee(userid.toString(),eventId.toString())
      }
    }
   
    return(
        <Box className={styles.eventInformation}>
            {loading ? (
                <div className = {styles.visitorHeadingLoading}>
                 Visitors
                 <Spinner className = {styles.spinner} speed="0.8s" thickness="3px"/>
                </div>
            ) : 
            (
            <>
            <div className = {styles.visitorHeading}>
                Visitors
                <div className = {styles.visitorCount}>
                    ({visitorData.length})
                </div>
                <button onClick={handleEmailAllVisitors} className={styles.emailAllVisitors}>Email All Visitors</button>
            </div>
            <table className = {styles.visitorTable}>
                <tbody>
                {visitorData.map((visitor, index) => (
                <tr className={styles.visitorRow} key={index}>
                  <td className={styles.checkBox}>
                      {eventData.attendeeIds.map(oid => oid.toString()).includes(visitor._id) 
                      ?
                      <Checkbox colorScheme="green" defaultChecked onChange={async(e) => await handleCheck(e.target.checked,visitor._id.toString())} />
                      :
                      <Checkbox colorScheme="green" onChange={async(e) => await handleCheck(e.target.checked,visitor._id.toString())} />
                    }
                      
                  </td>
                  <td className={styles.nameColumn}>
                    {visitor.firstName} {visitor.lastName}
                  </td>
                  <td className={styles.emailColumn}>{visitor.email}</td>
                  <td className={styles.detailsColumn}>
                    <SingleVisitorComponent visitorData={visitor} />
                  </td>
                </tr>
              ))}

                </tbody>
            </table>
            </>
            )}
        </Box>
    );
        
}


export default EditEventVisitorInfo;

