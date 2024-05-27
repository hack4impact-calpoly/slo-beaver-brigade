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
    useToast,
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
    TimeIcon, EditIcon, AddIcon,
} from "@chakra-ui/icons"


export default function ViewEventDetailsHours({event}: {event: IEvent}){
    const [attendees, setAttendees] = useState<IUser[]>([]);
    const [editMode, setEditMode] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState("");
    const [hour, setHour] = useState("");
    const [min, setMin] = useState("");
    const [email, setEmail] = useState("")
    const toast = useToast();

    const handleEditClick = () => {
      setEditMode(!editMode);
    };
  
    const handleSaveClick = () => {
      setEditMode(false);
      
    };

    const handleTimeChange = (event : React.ChangeEvent<HTMLInputElement>, attendee : IUser) => {

    }

    const handleAddUserClick = () => {
        //convert hours and minutes to readable time
        const findEndTime = (hours : number, minutes : number) => {
            const endTime = new Date(event.startTime)
            endTime.setTime(endTime.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000))
            return endTime.toISOString();
        }

        //check to see if there is a user with the inputted email
        const getUser = async () => {
            const response = await fetch(`/api/user`);
            return response.json();
        }

        const getUserAndCheck = async () => {
            const result = await getUser();
            if (!result) {
                console.log("No users found");
                return;
            }
            const filteredUsers = result.users.filter((user : IUser)=> user.email === email);
            if (filteredUsers.length === 0) {
                toast({
                    title: "Error",
                    description: "User account does not exist",
                    status: "error",
                    duration: 2500,
                    isClosable: true,
                  });
                return;
            } else {
                return filteredUsers[0]; // Return the first filtered user
            }
        }

        //if the user exists, then add user to event
        //then add the event to the users events attended
         getUserAndCheck().then(user => {
            console.log(user)
            if (user) {
                //add user to event
                 const updatedEvent = {
                     ...event,
                     attendeeIds : [...event.attendeeIds, user._id]
                 }
                 setAttendees([...attendees, user])
                 fetch(`/api/events/${event._id}/`, {
                     method: "PATCH",
                     headers: {
                       "Content-Type": "application/json",
                     },
                     body: JSON.stringify(updatedEvent),
                })

                //add event to user's eventsAttended
                const updatedUser = {
                    ...user,
                    eventsAttended : [...user.eventsAttended, 
                        {eventId : event._id,
                         startTime : event.startTime,
                         endTime : findEndTime( parseInt(hour), parseInt(min))
                    }]
                }
                fetch(`/api/user/${user._id}`, 
                {
                    method: "PATCH",
                    headers: {
                       "Content-Type": "application/json",
                     },
                    body: JSON.stringify(updatedUser),
                })
                console.log(updatedUser)

            }
        });
        
        //reset to default values
        setName("")
        setEmail("")
        setHour("")
        setMin("")       
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
                <ModalContent maxW="75%" mt={"9vh"}>
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
                <ModalBody overflowX="auto">
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
                        {editMode ? 
                            <Tbody>
                                {attendees.map((attendee) => (
                                    <Tr key={attendee._id}>
                                    <Td width="20%">{attendee.firstName} {attendee.lastName}</Td>
                                    <Td>
                                        <Flex align="center">
                                            <Input
                                            type="text"
                                            defaultValue={eventHoursNum(attendee, event)}
                                            width="30px"
                                            height="30px"
                                            p="7px"
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
                                            height="30px"
                                            p="7px"
                                            m="0px"
                                            backgroundColor="white"
                                            textAlign="center"
                                            min="0"
                                            max="0"
                                            />
                                            min
                                        </Flex>    
                                    </Td>
                                    <Td>{attendee.email}</Td>
                                </Tr>
                                ))}
                                <Tr p="2px">
                                    <Td>
                                        <Input
                                            type="text"
                                            placeholder="Enter name"
                                            width="200px"
                                            height="30px"
                                            p="7px"
                                            m="0px"
                                            backgroundColor="white"
                                            color="gray"
                                            textAlign="left"
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Td>
                                    <Td>
                                        <Flex align="center">
                                            <Input
                                            type="number"
                                            placeholder="0"
                                            width="30px"
                                            height="20px"
                                            p="0px"
                                            m="0px"
                                            backgroundColor="white"
                                            color="gray"
                                            textAlign="center"
                                            onChange={(e) => setHour(e.target.value)}
                                            />
                                            hours
                                            <Input
                                            type="number"
                                            placeholder="0"
                                            width="30px"
                                            height="20px"
                                            p="0px"
                                            m="0px"
                                            backgroundColor="white"
                                            color="gray"
                                            textAlign="center"
                                            min="0"
                                            max="0"
                                            onChange={(e) => setMin(e.target.value)}
                                            />
                                            min
                                        </Flex>    
                                    </Td>
                                    <Td display="flex" justifyContent={"space-between"} alignItems="center">
                                        <Input
                                            type="text"
                                            placeholder="Enter email"
                                            width="200px"
                                            height="30px"
                                            p="7px"
                                            m="0px"
                                            backgroundColor="white"
                                            color="gray"
                                            textAlign="left"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Button onClick={handleAddUserClick}>
                                            <Text color = "gray" mr="10px" fontWeight="normal">Add user</Text>
                                            <AddIcon color="gray" w="15px"/>
                                        </Button>
                                        
                                    </Td>

                                </Tr>
                            </Tbody>: 
                            (<Tbody>
                                {attendees.map((attendee) => (
                                    <Tr key={attendee._id}>
                                        <Td width="20%">{attendee.firstName} {attendee.lastName}</Td>
                                        <Td>{eventTimeSpecific(attendee, event)}</Td>
                                        <Td>{attendee.email}</Td>
                                    </Tr>
                                ))}
                            </Tbody>)}
                    </Table>
                </ModalBody>
                <ModalFooter/>
                </ModalContent>
            </Modal>
        </>
    ) 
}
