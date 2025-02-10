"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  Icon,
  Center,
} from "@chakra-ui/react";
import styles from "../styles/admin/editEvent.module.css";
import { IUser } from "@database/userSchema";
import { eventIndividualHours } from ".././lib/hours";
import { Schema } from "mongoose";
import { FaRegTrashAlt } from "react-icons/fa";
import {useUser, useClerk} from "@clerk/nextjs";
import { removeUserCookie } from "app/actions/cookieactions";
import { mutate } from "swr";


interface DeleteProps {
    closeFromChild: React.MouseEventHandler<HTMLButtonElement>;
    userData: IUser | null;
    children?: React.ReactNode;
    isSelf: boolean;
    removeFunction?: (userId: string) => void;

}


function DeleteConfirmation({closeFromChild, userData, isSelf, removeFunction}: DeleteProps) {

    const { isOpen, onOpen, onClose } = useDisclosure();


    const {signOut} = useClerk();
    // const {user} = useUser();


    async function handleDelete(){


        // Remove cookies when the user signs out
        if (isSelf) {
            await removeUserCookie(); 
            signOut({ redirectUrl: '/' });
        }


        if (userData!=null) {
            //const clerk_id = user.id;
            const email = userData.email;

            const res = await fetch(`/api/user/${userData._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(email),
            });

            if (removeFunction) {
                removeFunction(userData._id);
            }    
        }

        
        onClose();


    }


    return (<>
            <Button
                  mt={2}
                  color="#d93636"
                  bg="white"
                  border="2px"
                  _hover={{ bg: "#d93636", color: "white" }}
                  onClick={onOpen}
                  variant="ghost"
                  >
                  <Icon color="36d936" fontSize="1.4rem" p={0.5}>
                    <FaRegTrashAlt />
                  </Icon>
                    Delete User
             </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent
                      style={{ width: "40vw", height: "30vh", overflow: "auto" }}
                      maxW="100rem"
            >

            <ModalHeader
                style={{
                    padding: "1% 5%",
                    textAlign: "left",
                    fontSize: "35px",
                    fontWeight: "bold",
                    fontFamily: "Lato",
                    width: "100%",
                }}
                >
                <Flex direction="column" align="left" p={4}>
                    <Text>
                        Delete User
                    </Text>
                          
                </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <hr />
            <ModalBody
            style={{ display: "flex", flexDirection: "column", padding: "0%" }}
            className={styles.parentContainer}
            >
                <Flex direction="column" align="center">
                    <Text className={styles.boldText} p={2}>
                        Are you sure you want to delete this account?
                    </Text>

                </Flex>
                <Flex direction="column" align="center" p={4}>
                    <Button
                        mt={2}
                        bg="#d93636"
                        color="white"
                        _hover={{ bg: "#d93636", color: "white" }}
                        onClick={async() => {await handleDelete(); closeFromChild}}
                    >
                        Yes
                    </Button>

                </Flex>

            </ModalBody>

            </ModalContent>
        </Modal>


    </>
    );



}

export default DeleteConfirmation;

