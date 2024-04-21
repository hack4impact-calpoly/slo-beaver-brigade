import { Box, Flex,  } from '@chakra-ui/react';
import React from 'react'
import styles from "./page.module.css";
import defaultBeaver from '/docs/images/DefaultBeaver.jpeg'
import '../../../../fonts/fonts.css';
import Image from 'next/image'
import EditEventPrimaryInfo from '@components/EditEventPrimaryInfo';
import EditEventVisitorInfo from '@components/EditEventVisitorInfo';
import EditEventHeader from '@components/EditEventHeader';



type IParams = {
    params: {
        eventId: string
    }
}

export default function EditEventsPage({ params: { eventId } }: IParams) {

    return(
        <Box className = {styles.eventPage}>
            <EditEventHeader eventId={eventId}/>
            <Flex className={styles.temp} direction={{ base: 'column', md: 'row' }} justify="space-between">
                <Box className={styles.leftColumn} w={{ base: '100%', md: '38%' }}>
                    <Box className={styles.imageContainer}>
                        <Image src={defaultBeaver} alt="eventImage"/>
                    </Box>
                    
                    <EditEventVisitorInfo eventId={eventId}/>
                </Box>
                <Box className={styles.rightColumn} w={{ base: '100%', md: '58%' }}>
                    <EditEventPrimaryInfo eventId={eventId}/>
                </Box>
            </Flex>
        </Box>
    )
}

