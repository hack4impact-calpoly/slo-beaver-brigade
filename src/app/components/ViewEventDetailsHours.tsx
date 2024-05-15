'use client'

import { 
    Button, 
    Modal,
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay, 
    useDisclosure,
    Box,
    Flex,
    Text,
    Table,
    Thead,
    Tbody,
    Th,
    Tr,
    Td,
    Input,
 } from "@chakra-ui/react";
import { IEvent } from "database/eventSchema";
import { IUser } from "database/userSchema";
import React, { useEffect, useState } from "react";
import style from '@styles/admin/users.module.css';
import { eventTimeSpecific, eventHoursSpecific, eventHoursNum, eventMinsNum } from "app/lib/hours";
import { formatDateWeekday, formatDateTime } from "app/lib/dates"
import{
    TimeIcon, EditIcon,
} from "@chakra-ui/icons"


export default function ViewEventDetailsHours({event}: {event: IEvent}){
    const [attendees, setAttendees] = useState<IUser[]>([])
    const [editMode, setEditMode] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleEditClick = () => {
      setEditMode(!editMode);
    };
  
    const handleSaveClick = () => {
      setEditMode(false);
      
    };

    const handleTimeChange = (event : React.ChangeEvent<HTMLInputElement>, attendee : IUser) => {

    }

    useEffect(() => {
        const fetchUsers = async () => {
            await Promise.all(event.attendeeIds.map((id) => fetch("/api/user/" + id))).then((res) => {
                const data: IUser[] = []
                res.map(async (user) => {
                    data.push(await user.json())
                })
                setAttendees(data)
                return
            })
            console.log(attendees)
        }
        fetchUsers()
    }, [event.attendeeIds])
    
    useEffect(() => {
        setEditMode(false)
    }, [isOpen])
    


    return (
        <>
            <Button onClick={onOpen} className={style.viewDetails} bg="none" _hover={{ bg: "none" }}>View Details</Button>
            <Modal onClose={onClose}isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent maxW="75%" mt={"9vh"} overflow={"hidden"}>
                <Box w="100%" pl="3%" pr="3%" pb="3%" backgroundColor="#2B2B34" color="white">
                    <Text fontWeight={"bold"} marginY="15px">Event Details</Text>
                    <hr/>
                    <ModalHeader color="#ECB94A" p="0%" marginY="20px" fontSize="25px">{event.eventName} - {event.attendeeIds.length} {event.attendeeIds.length > 1? "Volunteers" : "Volunteer"}, {eventHoursSpecific(attendees, event)}</ModalHeader>
                    <Flex>
                        <TimeIcon width="25px" mt={"4px"}></TimeIcon>
                        <Text ml={"5px"}>{formatDateWeekday(event.endTime)}</Text>
                        <Text ml={"20px"}>{formatDateTime(event.startTime)} to {formatDateTime(event.endTime)}</Text>
                    </Flex>
                    <Flex mt="10px">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <Text ml="5px">{event.location}</Text>
                    </Flex>
                    <ModalCloseButton />
                </Box>
                <ModalBody>
                    <Table variant="striped">
                        <Thead>
                            <Tr>
                                <Th width="20%">Volunteer</Th>
                                <Th width="20%">Hours</Th>
                                <Th display="flex" justifyContent={"space-between"} alignItems="center">
                                    <Text>Email</Text>
                                    <Button bg="none" _hover={{ bg: "none" }}
                                    fontSize="sm"   // Font size is small
                                    fontWeight="bold"  // Font weight is bold
                                    color="gray.600"
                                    onClick={handleEditClick}>
                                    {editMode ? <>Save</> : (<>Edit Table
                                    <EditIcon ml="5px"/></>)}
                                    </Button>
                                    
                                </Th>
                            </Tr>                        
                        </Thead>
                        <Tbody>
                            {attendees.map((attendee) => (
                                <Tr key={attendee._id}>
                                <Td width="20%">{attendee.firstName} {attendee.lastName}</Td>
                                <Td>{editMode ? (
                                    <>
                                    <Flex align="center">
                                    <Input
                                    type="text"
                                    defaultValue={eventHoursNum(attendee, event)}
                                    width="30px"
                                    height="20px"
                                    p="0px"
                                    m="0px"
                                    backgroundColor="white"
                                    textAlign="center"
                                    />
                                    hours
                                    <Input
                                    type="text"
                                    defaultValue={eventMinsNum(attendee, event)}
                                    onChange={(e) => handleTimeChange(e, attendee)}
                                    width="30px"
                                    height="20px"
                                    p="0px"
                                    m="0px"
                                    backgroundColor="white"
                                    textAlign="center"
                                    min="0"
                                    max="0"
                                    />
                                    min
                                    </Flex>  
                                    </>
                                ) : (
                                    eventTimeSpecific(attendee, event)
                                )}</Td>
                                <Td>{attendee.email}</Td>
                                </Tr>
                            ))}
                        
                        <Tr>
                            <Td width="20%">
                                <Input
                                    type="text"
                                    defaultValue="Enter name"
                                />
                            </Td>
                            <Td>
                                <Input
                                    type="text"
                                    defaultValue="Enter hours"
                                />
                            </Td>
                            <Td>
                                <Input
                                    type="text"
                                    defaultValue="Enter email"
                                />
                            </Td>
                        </Tr>
                        
                        </Tbody>
                    </Table>
                </ModalBody>
                <ModalFooter/>
                </ModalContent>
            </Modal>
        </>
    ) 
}