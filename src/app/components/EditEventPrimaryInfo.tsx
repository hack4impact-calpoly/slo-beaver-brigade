'use client'
import { Box, Text, Image, Spinner} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react'
import styles from "../styles/admin/editEvent.module.css";
import { IEvent } from '@database/eventSchema';
import EditEvent from '@components/EditEvent';
import editButton from '/docs/images/edit_details.svg'
import { useEventId } from 'app/lib/swrfunctions';

const EditEventPrimaryInfo = ({ eventId }: { eventId: string }) => {
    const [loading, setLoading] = useState(true);
    const {eventData, isLoading, isError, mutate} = useEventId(eventId)


    const [groupData, setGroupData] = useState([{
        group_name: '',
        groupees: [],
    }])


    //finds the host organization
    //this defines whether or not it is loading, because it is the last thing to be fetched
    useEffect(() => {
        if (isLoading){
            return
        }
        if (!eventData){
            return
        }
        console.log('event', eventData)
        const fetchGroupData = async () => {
            if(eventData.eventName !== ""){
                if(eventData.groupsAllowed && eventData.groupsAllowed.length !== 0){
                    const groupDataArray = await Promise.all(eventData.groupsAllowed.map(async (groupId) =>
                    {
                        const response = await fetch(`/api/group/${groupId}`);
                        return response.json();
                    }))
                    
                    setGroupData(groupDataArray)
                }
                setLoading(false);
            }
        }
        fetchGroupData()
    }, [eventData, isLoading]);
    

    return (

        <Box className={styles.eventInformation}>
            {isLoading || !eventData ? (
                <div className = {styles.visitorHeadingLoading}>
                 <Text style={{width: '50%'}}>Primary Information</Text>
                 <Spinner className = {styles.spinner} speed="0.8s" thickness="3px"/>
                </div>
            ) : 
            (
            <>
                <Box className = {styles.visitorHeading}>
                    <Text style={{width: '50%'}}>Primary Information</Text>
                    <Box className = {styles.editEvent}>
                        {eventData?.description === '' ? 
                        <Text className = {styles.originalEditText}>Edit Event Details</Text> : <EditEvent event={eventData} mutate={mutate}/>}
                    </Box>
                    <Image src={editButton.src} alt="editButton" className={styles.editButton}/>
                </Box>
                <Box className = {styles.topBlock}>
                    <Box className = {styles.leftBlock}>
                        <Text className = {styles.eventField}>Event Name</Text>
                        <Text className={styles.eventEntry}>{eventData.eventName}</Text>
                        <Text className = {styles.eventField}>Event Location</Text>
                        <Text className={styles.eventEntry}>{eventData.location}</Text>
                        <Text className = {styles.eventField}>Event Type</Text>
                        <Text className={styles.eventEntry}>{eventData.eventType}</Text>
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
                    <Text className={styles.eventEntry}>{groupData[0].group_name !== '' ? groupData[0].group_name : 'None'}</Text>
                    <Text className = {styles.eventField}>Languages</Text>
                    <Text className={styles.eventEntry}>{eventData.spanishSpeakingAccommodation? 'English, Spanish' : 'English'}</Text>
                    <Text className = {styles.eventField}>Disability Accommodations</Text>
                    <Text className={styles.eventEntry}>{eventData.wheelchairAccessible ? 'Wheelchair Accessible' : 'None'}</Text>
                    <Text className = {styles.eventField}>Description</Text>
                    <Text className={styles.eventEntry}>{eventData.description}</Text>
                </Box>
            </>
        )}
    </Box>
    )
        
}

  
  export default EditEventPrimaryInfo;