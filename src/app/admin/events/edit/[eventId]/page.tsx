'use client';
import { Box, Card, Badge, Text, Button } from '@chakra-ui/react';
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

function SingleVisitorComponent({visitorData, onClose} : {visitorData: Visitor, onClose: () => void}){
    return(  
        <div className={styles.screenOverlay}>
            <div className={styles.visitorInfoBox}>
                <div className={styles.visitorInfoHeader}>
                    {visitorData.firstName} {visitorData.lastName}
                </div>
                <Image src={closeButton} alt="closeButton" className={styles.closeVisitor} onClick={onClose}/>
                <hr className={styles.topDividingLine}/>
                <div className={styles.visitorInfoLandR}>
                    <div className={styles.visitorInfoLeft}>
                        <div className={styles.visitorInfoSmallHeader}>
                            Personal Info
                        </div>
                        <div className={styles.fieldInfo}>Email: {visitorData.email ? visitorData.email : 'N/A'}</div>
                        <div className={styles.fieldInfo}>Phone: {visitorData.phoneNumber ? visitorData.phoneNumber : 'N/A'}</div>
                        <div className={styles.fieldInfo}>Age: {visitorData.age !== -1 ? visitorData.age : 'N/A'}</div>
                        <div className={styles.fieldInfo}>Gender: {visitorData.gender ? visitorData.gender : 'N/A'}</div>
                        <div className={styles.fieldInfo}>Address: N/A</div>
                        <div className={styles.fieldInfo}>City: N/A</div>
                        <div className={styles.fieldInfo}>Zipcode: N/A</div>
                        <div className={styles.fieldInfo}>Primary Language: N/A</div>
                        <div className={styles.visitorInfoSmallHeader}>
                            Availability
                        </div>
                        <div className={styles.fieldInfo}>Available Locations: N/A</div>
                    </div>
                    <div className={styles.visitorInfoRight}>
                        <div className={styles.visitorInfoSmallHeader}>
                        Interest Questions
                    </div>
                    <div className={styles.fieldInfo}>What led you to SLO Beavers: N/A</div>
                    <div className={styles.fieldInfo}>Specialized skills: N/A</div>
                    <div className={styles.fieldInfo}>Why are you interested: N/A</div>                        </div>
                </div>
            </div>
        </div>
    )
}

function DeleteEvent({eventName, onDelete, onClose}: {eventName: string, onDelete: () => void, onClose: () => void}){
    return(
        <div className = {styles.screenOverlay}>
            <div className = {styles.confirmDeletion}>
                <div style={{width: '100%'}}>Please confirm deletion of {eventName} Event.</div>
                <div className={styles.cancelOrDelete}>
                    <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
                    <button className={styles.deleteButton} onClick={onDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default function EditEventsPage({ params: { eventId } }: IParams) {
    //data of event, may need to be altered if more fields are added in
    const router = useRouter();
    const [eventData, setEventData] = useState<IEvent>({
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

    const [visitorVisible, setVisitorVisible] = useState(false);
    const [deletionVisible, setDeletionVisible] = useState(false);

    const [singleVisitor, setSingleVisitor] = useState<Visitor>({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        age: -1,
        gender: '',
        role: '',
        eventsAttended: [],
    })

    /*Called when admin clicks on a specific visitor, this is then passed into
    the SingleVisitorComponent, aka populates the component with that specific visitors
    info. Currently, there are things in the design/signup that are not stored in 
    the database, such as address, city, zipcode, primary language, available locations
    and the interest questions.*/
    const handleVisitorClick = (visitor: Visitor) => {
        setVisitorVisible(true);
        setSingleVisitor({...singleVisitor, 
            email: visitor.email,
            firstName: visitor.firstName,
            lastName: visitor.lastName,
            phoneNumber: visitor.phoneNumber,
            age: visitor.age,
            gender: visitor.gender,
            role: visitor.role,
            eventsAttended: visitor.eventsAttended,

        })
    }   

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
            //router.push('/');
        }
        catch(error){
            console.error('Error deleting event:', error);
        }
        
    }

    /*retrieves the specific events data based on the eventId */
    useEffect(() => {
        const fetchEventData = async () => {
            const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
            const data = await response.json();
            data.startTime = new Date(data.startTime)
            data.endTime = new Date(data.endTime)
            setEventData(data);
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
        <div>
            {deletionVisible && <DeleteEvent eventName={eventData.eventName} onDelete={handleDelete} onClose={() => setDeletionVisible(false)}/>}
            {visitorVisible && <SingleVisitorComponent visitorData={singleVisitor} onClose={() => setVisitorVisible(false)}></SingleVisitorComponent>}
           <div className = {styles.eventPage}>
            <div className = {styles.header}>
                <h1 className = {styles.eventTitle}>{eventData.eventName} Details</h1>
                <button className = {styles.deleteButton} onClick ={() => setDeletionVisible(true)}>Delete Event</button>
            </div>
            <div className={styles.temp}>
                <div className={styles.leftColumn}>
                    <div className={styles.imageContainer}>
                        <Image src={defaultBeaver} alt="eventImage"/>
                    </div>
                    <button className={styles.emailAllVisitors}>Email All Visitors</button>
                    <Box className={styles.eventInformation}>
                        <h2 className = {styles.visitorHeading}>
                            Visitors
                            <div className = {styles.visitorCount}>
                                ({visitorData.length})
                            </div>
                        </h2>
                        <table className = {styles.visitorTable}>
                            <tbody>
                                {visitorData.map((visitor, index) => (
                                    <tr className = {styles.visitorRow} key={index}>
                                        <td className = {styles.nameColumn}>{visitor.firstName} {visitor.lastName}</td>
                                        <td className = {styles.emailColumn}>{visitor.email}</td>
                                        <td className = {styles.detailsColumn}>
                                            <div onClick={() => handleVisitorClick(visitor)}>Details</div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </Box>
                </div>
                <div className={styles.rightColumn}>
                    <Box className={styles.eventInformation}>
                        <h2 className = {styles.visitorHeading}>
                            <div style={{width: '50%'}}>Primary Information</div>
                            <div className = {styles.editEvent}>
                                {eventData.description === '' ? 
                                <div className = {styles.originalEditText}>Edit Event Details</div> : <EditEvent {...eventData}/>}
                            </div>
                            <Image src={editButton} alt="editButton" className={styles.editButton}/>
                        </h2>
                        <div className = {styles.topBlock}>
                            <div className = {styles.leftBlock}>
                                <div className = {styles.eventField}>Event Name</div>
                                <div className={styles.eventEntry}>{eventData.eventName}</div>
                                <div className = {styles.eventField}>Event Location</div>
                                <div className={styles.eventEntry}>{eventData.location}</div>
                                <div className = {styles.eventField}>Event Type</div>
                                <div className={styles.eventEntry}>{eventData.eventName ? 'Volunteer Event' : 'Not Volunteer Event'}</div>
                            </div>
                            <div className = {styles.rightBlock}>
                                <div className = {styles.eventField}>Event Date</div>
                                <div className={styles.eventEntry}>{eventData.startTime.toLocaleDateString('en-US')}</div>
                                <div className = {styles.eventField}>Event Start Time</div>
                                <div className={styles.eventEntry}>{(eventData.startTime.getHours() % 12 || 12).toString()}:
                                {eventData.startTime.getMinutes().toString().padStart(2, '0')} {eventData.startTime.getHours() >= 12 ? 'PM' : 'AM'}</div>
                                <div className = {styles.eventField}>Event End Time</div>
                                <div className={styles.eventEntry}>{(eventData.endTime.getHours() % 12 || 12).toString()}:
                                {eventData.endTime.getMinutes().toString().padStart(2, '0')} {eventData.endTime.getHours() >= 12 ? 'PM' : 'AM'}</div>
                            </div>
                        </div>
                        <div className = {styles.bottomBlock}>
                            <div className = {styles.eventField}>Host Organization</div>
                            <div className={styles.eventEntry}>{groupData[0].group_name !== '' ? groupData.map((group, index) =>
                            (
                                <div key={index}>{group.group_name}{index !== groupData.length - 1 && ', '}</div>
                            )) : 'None'}</div>
                            <div className = {styles.eventField}>Languages</div>
                            <div className={styles.eventEntry}>{eventData.spanishSpeakingAccommodation? 'English, Spanish' : 'English'}</div>
                            <div className = {styles.eventField}>Disability Accommodations</div>
                            <div className={styles.eventEntry}>{eventData.wheelchairAccessible ? 'Wheelchair Accessible' : 'None'}</div>
                            <div className = {styles.eventField}>Description</div>
                            <div className={styles.eventEntry}>{eventData.description}</div>
                        </div>
                    </Box>
                </div>
            </div>
        </div>
    </div>
    )
}