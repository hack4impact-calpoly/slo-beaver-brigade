'use client'

import { Box, Text, Popover, PopoverTrigger, Button, PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverFooter, ButtonGroup, Input } from "@chakra-ui/react"
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
            <Button display="flex" justifyContent="space-between" width="200px" height="50px" bg="#2c3e50" color="white" _hover={{bg: "#1e2b37"}} _active={{bg: "#1e2b37"}}>
                <CalendarIcon/>
                <Text>Export Calendar</Text>
            </Button>
        </PopoverTrigger>
        <PopoverContent color='white' bg='#2c3e50' borderColor='#2c3e50'>
            <PopoverHeader pt={4} fontWeight='bold' border='0'>
            Copy to your calendar! 
            </PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody display="flex" flexDirection="column" justifyContent="space-around" height="200px">
            Copy the link below and paste into an iCal feed in Google Calendar, Outlook, etc.
             <input ref={initialFocusRef} className="text-black mb-10" autoFocus={true} value={"https://" + calendarLink}></input>
            </PopoverBody>
        </PopoverContent>
        </Popover>
    )   
    
}