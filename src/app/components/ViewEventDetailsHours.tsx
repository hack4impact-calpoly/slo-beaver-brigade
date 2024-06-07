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


export default function ViewEventDetailsHours({event, onRefresh}: {event: IEvent, onRefresh: () => void}){ 
    const [attendees, setAttendees] = useState<IUser[]>([]);
    const [addedAttendees, setAddedAttendees] = useState<IUser[]>([]);
    const [origAttendees, setOrigAttendees] = useState<IUser[]>([]);
    const [updatedEvent, setUpdatedEvent] = useState<IEvent>(event);
    const [editMode, setEditMode] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState("");
    const [hour, setHour] = useState("");
    const [min, setMin] = useState("");
    const [email, setEmail] = useState("")
    const toast = useToast();

    //convert hours and minutes to readable time
    const findEndTime = (hours : number, minutes : number) => {
        console.log("hours: ", hours , "minutes: " , minutes);
        const endTime = new Date(event.startTime);
        if(minutes && hours){
            const totalMinutes = (hours * 60) + minutes;
            endTime.setMinutes(endTime.getMinutes() + totalMinutes);
            console.log("endTime", endTime);
            return endTime.toISOString();
        }
        else{
            return event.endTime;
        }
    }

    const handleEditClick = () => {
      if(editMode){
        handleSaveClick()
      }
      setEditMode(!editMode);
    };
  
    const handleSaveClick = async () => {
      console.log("added attendees", addedAttendees);
      //update the event to include the new users
      try{

            const eventPromise = fetch(`/api/events/${event._id}/`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedEvent),
            })
            //update users so that this event is included in their
            //events attended
            await eventPromise;

            const promise = addedAttendees.map(user => {
                console.log("user!", user)
                fetch(`/api/user/${user._id}`, 
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                })
            })
            await Promise.all(promise)
            onRefresh();

        }
        catch(error){
            console.log(error);
            toast({
                title: "Error",
                description: "Error saving new users, please try again",
                status: "error",
                duration: 2500,
                isClosable: true,
            });
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, attendee : IUser, type: 'hours' | 'minutes') => {
        const {value} = e.target;
        if(value){  
            const eventsAttended = attendee.eventsAttended.map(eventAttended => 
                eventAttended.eventId.toString() === event._id
                ? {...eventAttended, endTime : type === 'hours'
                        ? new Date(findEndTime(parseInt(value), eventMinsNum(attendee, event)))
                        : new Date(findEndTime(eventHoursNum(attendee, event), parseInt(value)))}
                : eventAttended)
            console.log(eventsAttended)
            const user = {
                ...attendee,
                eventsAttended : eventsAttended
            }
            //if the user has already been edited, then it is in the addedAttendees list,
            //if this is the case, it modifies the list, but if the user is added, then it 
            //adds them to the list
            const idx = addedAttendees.findIndex(user => user._id === attendee._id)
            if(idx !== -1){
                const updatedAttendees = [...addedAttendees]
                updatedAttendees[idx] = user
                setAddedAttendees(updatedAttendees)
            }
            else{
                setAddedAttendees([...addedAttendees, user])
            }
            const totalIdx = attendees.findIndex(user => user._id === attendee._id)
            const totalAttendees = [...attendees]
            totalAttendees[totalIdx] = user;
            setAttendees(totalAttendees);
        }
    }

    const handleAddUserClick = () => {
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
            const filteredUsers = result.filter((user : IUser)=> user.email === email);
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

        //if the user exists, then add user to the table,
        //it will not interact with the backend/add it to the database until
        //the user presses save
        getUserAndCheck().then(user => {
            console.log(user)
            if (user) {
                //add user to event
                const eventNewAttendees = {
                     ...updatedEvent,
                     attendeeIds : [...updatedEvent.attendeeIds, user._id]
                 }
                 setUpdatedEvent(eventNewAttendees);
                 const updatedUser = {
                    ...user,
                    eventsAttended : [...user.eventsAttended, 
                        {eventId : event._id,
                         startTime : event.startTime,
                         endTime : findEndTime(parseInt(hour), parseInt(min))
                        }]
                }
                setAttendees([...attendees, updatedUser]);
                setAddedAttendees([...addedAttendees, updatedUser]);    
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
                setAttendees(data);
                setOrigAttendees(data);
                return;
            })
            console.log(attendees)

        }
        fetchUsers()
    }, [event.attendeeIds])

    useEffect(() => {
        console.log("attendees", attendees);
    }, [attendees]);
    
    useEffect(() => {
        setEditMode(false);
        setAddedAttendees([]);
        setUpdatedEvent(event);
        setAttendees(origAttendees)
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
                    <ModalHeader color="#ECB94A" p="0%" marginY="20px" fontSize="25px" fontWeight="bold">{updatedEvent.eventName} - {updatedEvent.attendeeIds.length} {updatedEvent.attendeeIds.length > 1? "Volunteers" : "Volunteer"}, {eventHoursSpecific(attendees, updatedEvent)}</ModalHeader>
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
                                            onChange={(e) => handleTimeChange(e, attendee, 'hours')}
                                            width="40px"
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
                                            onChange={(e) => handleTimeChange(e, attendee, 'minutes')}
                                            width="40px"
                                            height="30px"
                                            p="7px"
                                            m="0px"
                                            backgroundColor="white"
                                            textAlign="center"
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
                                            value={name}
                                        />
                                    </Td>
                                    <Td>
                                        <Flex align="center">
                                            <Input
                                            type="number"
                                            placeholder="0"
                                            width="40px"
                                            height="30px"
                                            p="0px"
                                            m="0px"
                                            backgroundColor="white"
                                            color="gray"
                                            textAlign="center"
                                            onChange={(e) => setHour(e.target.value)}
                                            value={hour}
                                            />
                                            hours
                                            <Input
                                            type="number"
                                            placeholder="0"
                                            width="40px"
                                            height="30px"
                                            p="0px"
                                            m="0px"
                                            backgroundColor="white"
                                            color="gray"
                                            textAlign="center"
                                            min="0"
                                            max="0"
                                            onChange={(e) => setMin(e.target.value)}
                                            value={min}
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
                                            value={email}
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