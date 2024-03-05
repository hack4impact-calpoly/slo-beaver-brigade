'use client';
import { Box, Card, Badge, Text, Button } from '@chakra-ui/react';
import React, {useState, useEffect} from 'react'
import styles from "./page.module.css";
import defaultBeaver from '/docs/images/DefaultBeaver.jpeg'
import '../../../../fonts/fonts.css';
import Image from 'next/image'

type IParams = {
    params: {
        eventId: string
    }
}

export default function EditEventsPage({ params: { eventId } }: IParams) {
    //data of event, may need to be altered if more fields are added in
    const [eventData, setEventData] = useState({
        eventName: '',
        location: '',
        description: '',
        wheelchairAccessible: false,
        spanishSpeakingAccommondation: false,
        startTime: null,
        endTime: null,
        volunteerEvent: false,
        groupsAllowed: [],
        attendeeIds: [],
    });
    const [eventDate, setEventDate] = useState('');

    const [groupData, setGroupData] = useState([{
        group_name: '',
        groupees: [],
    }])

    const [visitorData, setVisitorData] = useState([{
        email: '',
        firstName: '',
        lastName: '',
        age: null,
        gender: '',
        role: '',
        eventsAttended: [],
    }])

    useEffect(() => {
        const fetchEventData = async () => {
            const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
            const data = await response.json();
            setEventData(data);

            const time = new Date(data.startTime);
            const month = time.getMonth() + 1;
            const day = time.getDate();
            const year = time.getFullYear();
            const startMinutes = time.getMinutes();
            let startHour = time.getHours();
            let ampm = 'AM'
            if(startHour >= 12){
                startHour = startHour % 12;
                ampm = 'PM'
            }
            if(startHour === 0){
                startHour = 12
            }
            const endTime = new Date(data.endTime);
            const endMinutes = endTime.getMinutes();
            let endHour = endTime.getHours();
            let endAmpm = 'AM'
            if(endHour >= 12){
                endHour = endHour % 12;
                endAmpm = 'PM'
            }
            if(endHour === 0){
                endHour = 12
            }
            setEventDate(`${month}/${day}/${year}`)

            setEventData({
                ...data,
                startTime: `${startHour}:${startMinutes < 10 ? `0${startMinutes}` : startMinutes} ${ampm}`,
                endTime: `${endHour}:${endMinutes < 10 ? `0${endMinutes}` : endMinutes} ${endAmpm}`
            })
            
        };
        fetchEventData();
    }, [eventId]); 

    
    useEffect(() => {
        const fetchGroupData = async () => {
            if(eventData.groupsAllowed.length !== 0){
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

    useEffect(() => {
        const fetchVisitorData = async() => {
            const visitorDataArray = await Promise.all(eventData.attendeeIds.map(async (userId) => {
                const response = await fetch(`http://localhost:3000/api/user/${userId}`);
                return response.json();
            }))
            setVisitorData(visitorDataArray)
        }
        fetchVisitorData()
    }, [eventData]);

    useEffect(() => {
        console.log(eventData)
        console.log("fetched", visitorData)
        console.log("visitor length: ", visitorData.length)
        groupData[0] ? console.log(groupData[0]) : console.log('None');
        visitorData[0] ? console.log(visitorData[0].email) : console.log('None')
    }, [visitorData])

    return(
        <div className = {styles.eventPage}>
            <div className = {styles.header}>
                <h1 className = {styles.eventTitle}>Event Details</h1>
                <button className = {styles.deleteButton}>Delete Event</button>
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
                        <table>
                            <tbody>
                                {visitorData.map((visitor, index) => (
                                    <tr key={index}>
                                        <td className = {styles.column}>{visitor.firstName} {visitor.lastName}</td>
                                        <td>{visitor.email}</td>
                                        <td>Details</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </Box>
                </div>
                <div className={styles.rightColumn}>
                    <Box className={styles.eventInformation}>
                        <h2 className = {styles.visitorHeading}>Primary Information</h2>
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
                                <div className={styles.eventEntry}>{eventDate}</div>
                                <div className = {styles.eventField}>Event Start Time</div>
                                <div className={styles.eventEntry}>{eventData.startTime}</div>
                                <div className = {styles.eventField}>Event End Time</div>
                                <div className={styles.eventEntry}>{eventData.endTime}</div>
                            </div>
                        </div>
                        <div className = {styles.bottomBlock}>
                            <div className = {styles.eventField}>Host Organization</div>
                            <div className={styles.eventEntry}>{groupData[0].group_name !== '' ? groupData.map((group, index) =>
                            (
                                <div key={index}>{group.group_name}{index !== groupData.length - 1 && ', '}</div>
                            )) : 'None'}</div>
                            <div className = {styles.eventField}>Languages</div>
                            <div className={styles.eventEntry}>{eventData.spanishSpeakingAccommondation? 'English, Spanish' : 'English'}</div>
                            <div className = {styles.eventField}>Disability Accommodations</div>
                            <div className={styles.eventEntry}>{eventData.wheelchairAccessible ? 'Wheelchair Accessible' : 'None'}</div>
                            <div className = {styles.eventField}>Description</div>
                            <div className={styles.eventEntry}>{eventData.description}</div>
                        </div>
                    </Box>
                </div>
            </div>
        </div>
    )
}