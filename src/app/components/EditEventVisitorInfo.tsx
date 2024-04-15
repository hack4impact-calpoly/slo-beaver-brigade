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

function SingleVisitorComponent({ visitorData }: { visitorData: IUser }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Text onClick={onOpen}>Details</Text>
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
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

const EditEventVisitorInfo = ({ eventId }: { eventId: string }) => {
  const [loading, setLoading] = useState(true);
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
    },
  ]);

    const [eventData, setEventData] = useState<IEvent>({
        _id: '',
        eventName: '',
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
        attendeeIds:[]
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
    
    function handleCheck(checked:Boolean,userid: String){
      
      if(checked){
        addAttendee(userid,eventId)
      }
      else{
        removeAttendee(userid,eventId)
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
            </div>
            <table className = {styles.visitorTable}>
                <tbody>
                {visitorData.map((visitor, index) => (
                <tr className={styles.visitorRow} key={index}>
                  <td className={styles.checkBox}>
                      <Checkbox colorScheme="green" onChange={(e) => handleCheck(e.target.checked,visitor._id)} />
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
