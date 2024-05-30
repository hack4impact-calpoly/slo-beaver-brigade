'use client'

import { Box, Popover, PopoverTrigger, Button, PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverFooter, ButtonGroup, Input } from "@chakra-ui/react"
import { CalendarIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react"

// this component opens a modal with a simple guide on how to set up rss / instant feed.
export function EmailRSSComponent({calendarURL}: {calendarURL: string}){

    
    const initialFocusRef = React.useRef<HTMLInputElement>(null);
    const [calendarLink, setCalendarLink] = useState(calendarURL);

    useEffect(() => {
        setCalendarLink(window.location.host + calendarURL);
    }, [calendarURL]);

    return (
        <Popover
        initialFocusRef={initialFocusRef}
        placement='bottom-end'
        >
        <PopoverTrigger>
            <Button display="flex" justifyContent="space-between" width="120px">
                <CalendarIcon/>Calendar
            </Button>
        </PopoverTrigger>
        <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
            <PopoverHeader pt={4} fontWeight='bold' border='0'>
            Copy your calendar! 
            </PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody display="flex" flexDirection="column" justifyContent="space-around" height="200px">
            Copy the link below and paste it into any calendar app that takes iCal feeds (Google Calendar, iCal, Outlook, etc.) 
             <input ref={initialFocusRef} className="text-black mb-10" autoFocus={true} value={"https://" + calendarLink}></input>
            </PopoverBody>
        </PopoverContent>
        </Popover>
    )   
    
}