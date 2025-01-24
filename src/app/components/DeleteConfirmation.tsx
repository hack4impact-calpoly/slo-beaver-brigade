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

interface DeleteProps {
    closeFromChild: React.MouseEventHandler<HTMLButtonElement>;
    children?: React.ReactNode;
}


function DeleteConfirmation({closeFromChild, children}: DeleteProps) {

    const { isOpen, onOpen, onClose } = useDisclosure();


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
                        onClick={closeFromChild}
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

