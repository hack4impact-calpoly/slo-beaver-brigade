'use client'

import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { IEvent } from "database/eventSchema";
import { IUser } from "database/userSchema";
import React, { useEffect, useState } from "react";

export default function ViewEventDetailsHours({event}: {event: IEvent}){
    const [atendees, setAttendees] = useState<IUser[]>([])
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
            console.log(atendees)
        }
        fetchUsers()
    }, [atendees, event.attendeeIds])

    const { isOpen, onOpen, onClose } = useDisclosure()


    return (
        <Modal onClose={onClose} size={"xl"} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            </ModalBody>
            <h1>Text</h1>
            <ModalFooter>
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    ) 
}