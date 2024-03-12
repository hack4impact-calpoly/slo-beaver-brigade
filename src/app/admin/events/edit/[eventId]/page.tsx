'use client';
import { Box, Card, Badge, Text, Button, Flex,  
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, useDisclosure} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react'
import styles from "./page.module.css";
import defaultBeaver from '/docs/images/DefaultBeaver.jpeg'
import closeButton from '/docs/images/x.svg'
import editButton from '/docs/images/edit_details.svg'
import '../../../../fonts/fonts.css';
import Image from 'next/image'
import EditEvent from '@components/EditEvent';
import { IEvent } from '@database/eventSchema';
import { useRouter} from 'next/navigation';
import { FaDivide } from 'react-icons/fa';


type IParams = {
    params: {
        eventId: string
    }
}

type Visitor = {
    email: string,
    firstName: string,
    lastName: string,
    age: number,
    gender: string,
    role: string,
    phoneNumber: string,
    eventsAttended: string[],
}

function SingleVisitorComponent({visitorData} : {visitorData: Visitor}){
    const { isOpen, onOpen, onClose } = useDisclosure() 
    return (
      <>
        <Text onClick={onOpen}>Details</Text>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent style={{width: "60vw", height: "65vh", padding: "0% 5% 5% 5%"}} maxW= "100rem">
            <ModalHeader style = {{padding: "2% 0% 2% 0%", textAlign: "left",
            fontSize: "35px", fontWeight: "bold",fontFamily: "Lato",width: "100%"}}>
                {visitorData.firstName} {visitorData.lastName}</ModalHeader>
            <ModalCloseButton />
            <hr/>
            <ModalBody style={{display: "flex", padding: "0%"}}>
                <Box style={{paddingRight: "4%", width: "50%"}}>
                    <Text className={styles.visitorInfoSmallHeader}>
                        Personal Info
                    </Text>
                    <Text className={styles.fieldInfo}>Email: {visitorData.email ? visitorData.email : 'N/A'}</Text>
                    <Text className={styles.fieldInfo}>Phone: {visitorData.phoneNumber ? visitorData.phoneNumber : 'N/A'}</Text>
                    <Text className={styles.fieldInfo}>Age: {visitorData.age !== -1 ? visitorData.age : 'N/A'}</Text>
                    <Text className={styles.fieldInfo}>Gender: {visitorData.gender ? visitorData.gender : 'N/A'}</Text>
                    <Text className={styles.fieldInfo}>Address: N/A</Text>
                    <Text className={styles.fieldInfo}>City: N/A</Text>
                    <Text className={styles.fieldInfo}>Zipcode: N/A</Text>
                    <Text className={styles.fieldInfo}>Primary Language: N/A</Text>
                    <Text className={styles.visitorInfoSmallHeader}>
                        Availability
                    </Text>
                    <Text className={styles.fieldInfo}>Available Locations: N/A</Text>
                </Box>
                <Box style={{paddingLeft: "4%", width: "50%"}}>
                    <Text className={styles.visitorInfoSmallHeader}>
                        Interest Questions
                    </Text>
                    <Text className={styles.fieldInfo}>What led you to SLO Beavers: N/A</Text>
                    <Text className={styles.fieldInfo}>Specialized skills: N/A</Text>
                    <Text className={styles.fieldInfo}>Why are you interested: N/A</Text>                        
                </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
    
}

function DeleteEvent({eventName, onDelete}: {eventName: string, onDelete: () => void}){
    const { isOpen, onOpen, onClose } = useDisclosure() 
    return(
        <>
        <button className={styles.deleteButton} onClick={onOpen}>Delete Event</button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>
          <ModalContent className={styles.confirmDeletion} maxW="40rem">
            <ModalHeader style={{width:"100%"}}>Please confirm deletion of {eventName} Event.</ModalHeader>
            <ModalCloseButton />
            <ModalBody className={styles.cancelOrDelete}>
                <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
                <button className={styles.deleteButton} onClick={onDelete}>Delete</button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
}

export default function EditEventsPage({ params: { eventId } }: IParams) {
    const router = useRouter()
    //data of event, may need to be altered if more fields are added in
    const [eventData, setEventData] = useState<IEvent>({
        _id: '',
        eventName: '',
        location: '',
        description: '',
        wheelchairAccessible: false,
        spanishSpeakingAccommodation: false,
        startTime: new Date(0),
        endTime: new Date(0),
        volunteerEvent: false,
        groupsAllowed: [],
        attendeeIds: [],
    });

    const [groupData, setGroupData] = useState([{
        group_name: '',
        groupees: [],
    }])

    const [visitorData, setVisitorData] = useState([{
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        age: -1,
        gender: '',
        role: '',
        eventsAttended: [],
    }])
    const handleDelete = async () => {
        try{
            const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
            method: 'DELETE'
            });
            if (response.ok) {
                console.log('Event deleted successfully');
                // Redirect or update UI as needed
            } else {
                console.error('Failed to delete event:', response.statusText);
            }
            router.push('/');
        }
        catch(error){
            console.error('Error deleting event:', error);
        }
        
    }
    /*retrieves the specific events data based on the eventId */
    useEffect(() => {
        const fetchEventData = async () => {
            const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
            if (!response.ok) {
                throw new Error(`HTTP error, status: ${response.status}`);
            }
            else{
                const data = await response.json();
                data.startTime = new Date(data.startTime)
                data.endTime = new Date(data.endTime)
                setEventData(data);
            }
        };
        fetchEventData();
    }, [eventId]); 

    //finds the host organization
    useEffect(() => {
        const fetchGroupData = async () => {
            if(eventData.groupsAllowed && eventData.groupsAllowed.length !== 0){
                const groupDataArray = await Promise.all(eventData.groupsAllowed.map(async (groupId) =>
                {
                    const response = await fetch(`http://localhost:3000/api/group/${groupId}`);
                    return response.json();
                }))
                
                setGroupData(groupDataArray)
            }
        }
        fetchGroupData()
    }, [eventData]);
    
    //get visitor/volunteer data
    useEffect(() => {
        const fetchVisitorData = async() => {
            const visitorDataArray = await Promise.all(eventData.attendeeIds.filter(userId => userId !== null).map(async (userId) => {
                const response = await fetch(`http://localhost:3000/api/user/${userId}`);
                return response.json();
            }))
            setVisitorData(visitorDataArray)
        }
        fetchVisitorData()
    }, [eventData]);


    return(
        <Box className = {styles.eventPage}>
            <Box className = {styles.header}>
                <h1 className = {styles.eventTitle}>{eventData.eventName} Details</h1>
                <DeleteEvent eventName={eventData.eventName} onDelete={handleDelete}/>
            </Box>
            <Flex className={styles.temp} direction={{ base: 'column', md: 'row' }} justify="space-between">
                <Box className={styles.leftColumn} w={{ base: '100%', md: '38%' }}>
                    <Box className={styles.imageContainer}>
                        <Image src={defaultBeaver} alt="eventImage"/>
                    </Box>
                    <button className={styles.emailAllVisitors}>Email All Visitors</button>
                    <Box className={styles.eventInformation}>
                        <div className = {styles.visitorHeading}>
                            Visitors
                            <div className = {styles.visitorCount}>
                                ({visitorData.length})
                            </div>
                        </div>
                        <table className = {styles.visitorTable}>
                            <tbody>
                                {visitorData.map((visitor, index) => (
                                    <tr className = {styles.visitorRow} key={index}>
                                        <td className = {styles.nameColumn}>{visitor.firstName} {visitor.lastName}</td>
                                        <td className = {styles.emailColumn}>{visitor.email}</td>
                                        <td className = {styles.detailsColumn}>
                                            <SingleVisitorComponent visitorData={visitor}/>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </Box>
                </Box>
                <Box className={styles.rightColumn} w={{ base: '100%', md: '58%' }}>
                    <Box className={styles.eventInformation}>
                        <Box className = {styles.visitorHeading}>
                            <Text style={{width: '50%'}}>Primary Information</Text>
                            <Box className = {styles.editEvent}>
                                {eventData.description === '' ? 
                                <Text className = {styles.originalEditText}>Edit Event Details</Text> : <EditEvent {...eventData}/>}
                            </Box>
                            <Image src={editButton} alt="editButton" className={styles.editButton}/>
                        </Box>
                        <Box className = {styles.topBlock}>
                            <Box className = {styles.leftBlock}>
                                <Text className = {styles.eventField}>Event Name</Text>
                                <Text className={styles.eventEntry}>{eventData.eventName}</Text>
                                <Text className = {styles.eventField}>Event Location</Text>
                                <Text className={styles.eventEntry}>{eventData.location}</Text>
                                <Text className = {styles.eventField}>Event Type</Text>
                                <Text className={styles.eventEntry}>{eventData.eventName ? 'Volunteer Event' : 'Not Volunteer Event'}</Text>
                            </Box>
                            <Box className = {styles.rightBlock}>
                                <Text className = {styles.eventField}>Event Date</Text>
                                <Text className={styles.eventEntry}>{eventData.startTime.toLocaleDateString('en-US')}</Text>
                                <Text className = {styles.eventField}>Event Start Time</Text>
                                <Text className={styles.eventEntry}>{(eventData.startTime.getHours() % 12 || 12).toString()}:
                                {eventData.startTime.getMinutes().toString().padStart(2, '0')} {eventData.startTime.getHours() >= 12 ? 'PM' : 'AM'}</Text>
                                <Text className = {styles.eventField}>Event End Time</Text>
                                <Text className={styles.eventEntry}>{(eventData.endTime.getHours() % 12 || 12).toString()}:
                                {eventData.endTime.getMinutes().toString().padStart(2, '0')} {eventData.endTime.getHours() >= 12 ? 'PM' : 'AM'}</Text>
                            </Box>
                        </Box>
                        <Box className = {styles.bottomBlock}>
                            <Text className = {styles.eventField}>Host Organization</Text>
                            <Text className={styles.eventEntry}>{groupData[0].group_name !== '' ? groupData.map((group, index) =>
                            (
                                <div key={index}>{group.group_name}{index !== groupData.length - 1 && ', '}</div>
                            )) : 'None'}</Text>
                            <Text className = {styles.eventField}>Languages</Text>
                            <Text className={styles.eventEntry}>{eventData.spanishSpeakingAccommodation? 'English, Spanish' : 'English'}</Text>
                            <Text className = {styles.eventField}>Disability Accommodations</Text>
                            <Text className={styles.eventEntry}>{eventData.wheelchairAccessible ? 'Wheelchair Accessible' : 'None'}</Text>
                            <Text className = {styles.eventField}>Description</Text>
                            <Text className={styles.eventEntry}>{eventData.description}</Text>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Box>
    )
}