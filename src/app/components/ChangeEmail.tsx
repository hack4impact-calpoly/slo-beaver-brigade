"use client";

import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    Textarea,
    Select,
    Switch,
    Stack,
    Spacer,
    Flex,
    FormControl,
    FormLabel,
    Button,
    FormErrorMessage
} from '@chakra-ui/react';
import { IUser } from "database/userSchema";

import { PencilIcon } from "@heroicons/react/16/solid";
import { EmailAddress } from "@clerk/nextjs/server";


function ChangeEmail({userData}: {userData: IUser | null}) {

    const { isOpen, onOpen, onClose } = useDisclosure();
          
      const [user_firstName, setFirstName] = useState('');
      const [user_lastName, setLastName] = useState('');
      const [user_email, setEmail] = useState('');
      const [updated_email, setUpdatedEmail] = useState('');
      const [confirmed_updated_email, setConfirmedUpdatedEmail] = useState('');
      const [user_phoneNumber, setPhoneNumber] = useState('');
      const [user_zipcode, setZipcode] = useState('');
      const [user_receiveNewsletter, setReceiveNewsletter] = useState(false);
        const [emailError, setEmailError] = useState(false);
        const [emailErrorMessage, setEmailErrorMessage] = useState('');
      
      // Update state when userData changes
      useEffect(() => {
          if (userData) {
              setFirstName(userData.firstName || '');
              setLastName(userData.lastName || '');
              setEmail(userData.email || '');
              setPhoneNumber(userData.phoneNumber || '');
              setZipcode(userData.zipcode || '');
              setReceiveNewsletter(userData.receiveNewsletter || false);
          }
      }, [userData]);
    
      const handleUpdatedEmailChange = (e: any) => setUpdatedEmail(e.target.value);
      const handleConfirmedUpdatedEmailChange = (e: any) => setConfirmedUpdatedEmail(e.target.value);

    
      
     
    
      const [isSubmitted, setIsSubmitted] = useState(false);
      
      function handleClose() {
          setFirstName(userData?.firstName || '');
          setLastName(userData?.lastName || '');
          setEmail(userData?.email || '');
          setPhoneNumber(userData?.phoneNumber || '');
          setZipcode(userData?.phoneNumber || '');
          setReceiveNewsletter(userData?.receiveNewsletter || false);
          setIsSubmitted(false);
          onClose();
      };
    
      async function HandleSubmit() {

        // CHECK IF NEW EMAIL AND CONFIRMATION MATCH
        if (updated_email != confirmed_updated_email) {
            setEmailError(true);
            setEmailErrorMessage("Emails must match");
            return;
        } 

        // Check if Email is not the one currently in use

        if (updated_email === user_email) {
            setEmailError(true);
            setEmailErrorMessage("New email must be entered");
            return;
        }

        // Check if email is valid



        setEmailError(false);

        console.log("TEST");

        // VERYIFY NEW EMAIL

        // send the email.

          
          try {
            const response = await fetch(`/api/profile/email/${userData?._id}/`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updated_email),
              });

           
          } catch (error) {
            
          }
        }

    return ( <>
        <Button 
        onClick={onOpen} 
        fontFamily={"Lato"} 
        variant={"link"} 
        rightIcon={ <PencilIcon  style = {{ height: '15px', width: '15px'}}/>}
        style = {{ color: 'white', fontWeight: 'bold', padding: '0%', margin: '5px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '17px'}}
        >
        Change Email
        </Button>

        <Modal isOpen={isOpen} onClose={handleClose} size='xl'>
        <ModalOverlay />
        <ModalContent fontFamily="Lato" borderRadius="10px">
            <ModalHeader bg='#337774' color='white' fontWeight='bold' position='relative' borderRadius="10px 10px 0px 0px">
            Change Email
            </ModalHeader>
            <ModalCloseButton color='white' size='l' marginTop='15px' marginRight='5px'/>    

            <ModalBody>
            <Stack spacing={4}>

                <FormControl isInvalid={user_firstName === '' && isSubmitted} mt={2}>
                <FormLabel color='grey' fontWeight='bold'>Old Email</FormLabel>
                <Input placeholder='' fontWeight='bold' value={user_email} readOnly />
                </FormControl>

                <FormControl isInvalid={emailError}> 
                <FormLabel color='grey' fontWeight='bold'>New Email</FormLabel>             
                <Input required={true} placeholder='' type="email" fontWeight='bold' onChange={handleUpdatedEmailChange}/>
                <FormErrorMessage>{emailErrorMessage}</FormErrorMessage>
                </FormControl>

                <Stack spacing={0}>
                <FormControl isInvalid={emailError}>
                    <FormLabel color='grey' fontWeight='bold'>Confirm New Email</FormLabel>
                    <Input required={true} placeholder='' type="email" fontWeight='bold' onChange={handleConfirmedUpdatedEmailChange}/>
                </FormControl>
                </Stack>

            </Stack>
            </ModalBody>

            <ModalFooter display={"flex"} justifyContent={"space-between"}>
            <Button onClick={handleClose}
                >
                Close
            </Button>
            <Button 
                onClick={HandleSubmit}
                colorScheme="yellow"
                fontFamily="Lato"
                >
                Confirm
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
  </>);




}

export default ChangeEmail;