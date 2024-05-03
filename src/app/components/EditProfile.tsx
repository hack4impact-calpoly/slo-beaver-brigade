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
    FormLabel
  } from '@chakra-ui/react'
import { IUser } from '@database/userSchema';
import { Button } from '@styles/Button'
import React, {useState, useEffect} from 'react';
import { useUser } from "@clerk/clerk-react";  
import User from "@database/userSchema";
import { PhoneNumber } from '@clerk/nextjs/server';

  //export default function Navbar(props: { name: string }) {

const EditProfile = ({userData}: {userData: IUser}) => {
    const { isSignedIn, user, isLoaded } = useUser(); // get data from Clerk
    /*   
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        zipcode: "",
        preferredLanguage: "", // Assuming this is a string
        phoneNumber: "",
        city: "",
        state: "",
        receiveEmails: false, // Set to default value
    });
    
    useEffect(() => {
        if (isSignedIn && isLoaded && user) {
            const metadata = user.unsafeMetadata || {};
            setUserData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.primaryEmailAddress?.emailAddress || "",
                zipcode: metadata.zipcode ? String(metadata.zipcode) : "",
                preferredLanguage: metadata.preferredLanguage || "", // Set to appropriate default
                phoneNumber: metadata.phone ? String(metadata.phone) : "",
                city: metadata.city || "",
                state: metadata.state || "",
                receiveEmails: metadata.receiveEmails || false, // Set to appropriate default
            });
            
        };

    }, [isSignedIn, isLoaded, user]);
    */
    
        // Rest of your component code...
    
    const { isOpen, onOpen, onClose } = useDisclosure(); // button open/close
        
    const [user_firstName, setFirstName] = useState(userData.firstName);
    const [user_lastName, setLastName] = useState(userData.lastName);
    const [user_email, setEmail] = useState(userData.email);
    const [user_phoneNumber, setPhoneNumber] = useState(userData.phoneNumber);
    //const [user_zipcode, setZipcode] = useState(userData.zipcode);
    //const [user_preferredLanguage, setPreferredLanguage] = useState(userData.preferredLanguage);
    //const [user_city, setCity] = useState(userData.city);
    //const [user_state, setState] = useState(userData.state);
    const [user_receiveNewsletter, setReceiveNewsletter] = useState(userData.recieveNewsletter); // Corrected variable name
        
    const handleFirstNameChange = (e: any) => setFirstName(e.target.value);
    const handleLastNameChange = (e: any) => setLastName(e.target.value);
    const handleEmailChange = (e: any) => setEmail(e.target.value);
    const handlePhoneNumberChange = (e: any) => setPhoneNumber(e.target.value);
    //const handleZipcodeChange = (e: any) => setZipcode(e.target.value);
    //const handlePreferredLanguageChange = (e: any) => setPreferredLanguage(e.target.value);
    //const handleCityChange = (e: any) => setCity(e.target.value);
    //const handleStateChange = (e: any) => setState(e.target.value);
    const handleReceiveNewsletter = (e: any) => setReceiveNewsletter(e.target.checked); // Updated to handle boolean value
    
    const [isSubmitted, setIsSubmitted] = useState(false);
    
        // Function for when form is closed 
    function handleClose() {
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setPhoneNumber(userData.phoneNumber);
        //setZipcode(userData.zipcode);
        //setPreferredLanguage(userData.preferredLanguage);
        //setCity(userData.city);
        //setState(userData.state);
        setReceiveNewsletter(userData.recieveNewsletter);
        setIsSubmitted(false);
        onClose();
    };

    function HandleSubmit() {
        const updatedUserData = {
          firstName: user_firstName,
          lastName: user_lastName,
          email: user_email,
          phoneNumber: user_phoneNumber,
          receiveNewsletter: user_receiveNewsletter
        };
    
        console.log("New Event Data:", updatedUserData);
        try {
          const response = fetch(`/api/profile/${userData._id}/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUserData),
          });
          setIsSubmitted(true);
          handleClose();
        } catch (error) {
          console.log("Error editing event:", error);
        }
      }
    /*
    const userId = user?.id.toString()
    console.log(userId)
   
    function updateUser(){
    if (userId) {
        user?.update({ primaryPhoneNumberId: user_phoneNumber })
        .then((res) => console.log(res))
        .catch((error) => console.log("An error occurred:", error.errors));
    };
    };
    */
    /*const updateUser = async () => {
        
        const updatedUserData = {
            firstName: user_firstName,
            lastName: user_lastName,
            email: user_email,
            phoneNumber: user_phoneNumber,
            zipcode: user_zipcode,
            //preferredLanguage: user_preferredLanguage,
            //city: user_city,
            //state: user_state,
            //receiveEmails: user_receiveEmails,
        };
        
        console.log(user_email)

        await user?.update({
            firstName: user_firstName,
            lastName: user_lastName,
            primaryEmailAddressId: user_email
            //receiveEmails: user_receiveEmails
            //primaryPhoneNumberId: user_phoneNumber
            //phoneNumber: user_phoneNumber,
            //zipcode: user_zipcode,
        
            
        });
        
    };
    */
        console.log("UPDATED")
        //const updateMetadata = await fetch("/api/updateMetadata");
    
    // Check if the update was successful
        /*
        if (!updateMetadata.message === "success") {
        throw new Error("Error updating");
        }

        // If the update was successful, reload the user data
        await user.reload();
        */


    return(
        <>
          <Button onClick={onOpen} style = {{border: 'none', color: 'white', fontWeight: 'normal', padding: '0%', margin: '5px',
                                             overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            Edit Details
          </Button>
    
          <Modal isOpen={isOpen} onClose={handleClose} size='xl'>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader bg='#006d75' color='white' fontWeight='bold' position='relative'>
                Edit Profile
              </ModalHeader>
              <ModalCloseButton color='white' size='l' marginTop='15px' marginRight='5px'/>    
    
              <ModalBody>
                <Stack spacing={4}>
    
                  <FormControl isInvalid={user_firstName === '' && isSubmitted}>
                    <FormLabel color='grey' fontWeight='bold'>First Name</FormLabel>
                    <Input placeholder='' fontWeight='bold' value={user_firstName} onChange={handleFirstNameChange}/>
                  </FormControl>
    
                  <FormControl isInvalid={user_lastName === '' && isSubmitted}> 
                    <FormLabel color='grey' fontWeight='bold'>Last Name</FormLabel>             
                    <Input placeholder='' fontWeight='bold' value={user_lastName} onChange={handleLastNameChange}/>
                  </FormControl>

                  <Stack spacing={0}>
                    <FormControl isInvalid={user_phoneNumber === '' && isSubmitted}>
                      <FormLabel color='grey' fontWeight='bold'>Phone Number</FormLabel>
                      <Input placeholder='' fontWeight='bold' value={user_phoneNumber} onChange={handlePhoneNumberChange}/>
                    </FormControl>
                  </Stack>

                  <Stack spacing={0}>
                    <FormControl isInvalid={user_email === '' && isSubmitted}>
                        <FormLabel color='grey' fontWeight='bold'>Email Address</FormLabel>
                      <Input fontWeight='bold' value={user_email} onChange={handleEmailChange}/>
                    </FormControl>
                  </Stack>
                
                  <Stack spacing={0}>
                        <FormLabel color='grey' fontWeight='bold'>Recieve Newsletter Emails
                        <Spacer />
                        <Switch isChecked={user_receiveNewsletter} onChange={handleReceiveNewsletter} color="grey" />
                        </FormLabel>
                  </Stack>

                  
                  {/*  
                  <Stack spacing={0}>
                    <FormControl isInvalid={user_city === '' && isSubmitted}>
                      <FormLabel color='grey' fontWeight='bold'>City</FormLabel>
                      <Input placeholder='' fontWeight='bold' value={user_city} onChange={handleCityChange}/>
                    </FormControl>
                  </Stack>
    
                  <Stack spacing={0}>
                    <FormControl isInvalid={user_state === '' && isSubmitted}>
                      <FormLabel color='grey' fontWeight='bold'>State</FormLabel>
                      <Input fontWeight='bold' value={user_state} onChange={handleStateChange}/>
                    </FormControl>
                  </Stack>

                  <Stack spacing={0}>
                    <FormControl isInvalid={user_zipcode === '' && isSubmitted}>
                      <FormLabel color='grey' fontWeight='bold'>Zipcode</FormLabel>
                      <Input fontWeight='bold' value={user_zipcode} onChange={handleZipcodeChange}/>
                    </FormControl>
                  </Stack>}
                    */}
    
    
                </Stack>
              </ModalBody>
    
              <ModalFooter>
                <Button onClick={handleClose}>
                  Close
                </Button>
                <Button onClick={HandleSubmit}>
                    Confirm
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>      
      )
    
};

export default EditProfile;