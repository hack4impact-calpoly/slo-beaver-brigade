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
    Button
} from '@chakra-ui/react';
import { IUser } from "database/userSchema";

import { PencilIcon } from "@heroicons/react/16/solid";


function ChangeEmail({userData}: {userData: IUser | null}) {

    const { isOpen, onOpen, onClose } = useDisclosure();
          
      const [user_firstName, setFirstName] = useState('');
      const [user_lastName, setLastName] = useState('');
      const [user_email, setEmail] = useState('');
      const [user_phoneNumber, setPhoneNumber] = useState('');
      const [user_zipcode, setZipcode] = useState('');
      const [user_receiveNewsletter, setReceiveNewsletter] = useState(false);
    
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
    
      const handleFirstNameChange = (e: any) => setFirstName(e.target.value);
      const handleLastNameChange = (e: any) => setLastName(e.target.value);
      const handlePhoneNumberChange = (e: any) => setPhoneNumber(e.target.value);
      const handleZipcodeChange = (e: any) => setZipcode(e.target.value)
    
      
      const handleReceiveNewsletter = (e: any) => {
        const selectedOption = e.target.value;
        const receiveNewsletter = selectedOption === 'yes';
        setReceiveNewsletter(receiveNewsletter);
      };      
    
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
          const updatedUserData = {
            firstName: user_firstName,
            lastName: user_lastName,
            email: user_email,
            phoneNumber: user_phoneNumber,
            receiveNewsletter: user_receiveNewsletter,
            zipcode: user_zipcode
          };
      
          
          try {
            if (updatedUserData.receiveNewsletter) {
                const res = await addToNewsletter(updatedUserData.email, updatedUserData.firstName, updatedUserData.lastName, updatedUserData.zipcode);
                console.log(res)
            } else {
                const res = await removeFromNewsletter(updatedUserData.email);
                console.log(res)
            }
            const response = await fetch(`/api/profile/${userData?._id}/`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedUserData),
            });
            if (response.ok) {
              setIsSubmitted(true);
              handleClose();
            //   window.location.reload();
            } else {
              console.error("Failed to update user data");
            }
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
                <Input placeholder='' fontWeight='bold' value={user_email} onChange={handleFirstNameChange}/>
                </FormControl>

                <FormControl isInvalid={user_lastName === '' && isSubmitted}> 
                <FormLabel color='grey' fontWeight='bold'>New Email</FormLabel>             
                <Input placeholder='' fontWeight='bold' onChange={handleLastNameChange}/>
                </FormControl>

                <Stack spacing={0}>
                <FormControl isInvalid={user_phoneNumber === '' && isSubmitted}>
                    <FormLabel color='grey' fontWeight='bold'>Confirm New Email</FormLabel>
                    <Input placeholder='' fontWeight='bold' onChange={handlePhoneNumberChange}/>
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