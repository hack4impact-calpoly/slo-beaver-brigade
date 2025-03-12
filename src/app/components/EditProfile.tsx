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
} from '@chakra-ui/react'
import { IUser } from '@database/userSchema';
import { PencilIcon } from "@heroicons/react/16/solid";
import { addToNewsletter, removeFromNewsletter } from 'app/actions/mailingactions';

//import { Button } from '@styles/Button'
import React, {useState, useEffect} from 'react';

const EditProfile = ({userData}: {userData: IUser | null}) => {   
  
  const { isOpen, onOpen, onClose } = useDisclosure();
      
  const [user_firstName, setFirstName] = useState('');
  const [user_lastName, setLastName] = useState('');
  const [user_email, setEmail] = useState('');
  const [user_phoneNumber, setPhoneNumber] = useState('');
  const [user_zipcode, setZipcode] = useState('');
  const [user_receiveNewsletter, setReceiveNewsletter] = useState(false);
  const zipcodeRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

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

      if (!user_firstName || !user_lastName || !user_email || !user_phoneNumber || !user_zipcode) {
        setIsSubmitted(true);
        return;
      }

      if(!zipcodeRegex.test(user_zipcode)){
        setIsSubmitted(true);
        return;
      }

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

  return(
      <>
        <Button 
          onClick={onOpen} 
          fontFamily={"Lato"} 
          variant={"link"} 
          rightIcon={ <PencilIcon  style = {{ height: '15px', width: '15px'}}/>}
          style = {{ color: 'white', fontWeight: 'bold', padding: '0%', margin: '5px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '17px'}}
        >
          Edit Details
        </Button>
  
        <Modal isOpen={isOpen} onClose={handleClose} size='xl'>
          <ModalOverlay />
          <ModalContent fontFamily="Lato" borderRadius="10px">
            <ModalHeader bg='#337774' color='white' fontWeight='bold' position='relative' borderRadius="10px 10px 0px 0px">
              Edit Profile
            </ModalHeader>
            <ModalCloseButton color='white' size='l' marginTop='15px' marginRight='5px'/>    
  
            <ModalBody>
              <Stack spacing={4}>
  
                <FormControl isInvalid={user_firstName === '' && isSubmitted} mt={2}>
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
                  <FormControl isInvalid={isSubmitted && (user_zipcode === "" || !zipcodeRegex.test(user_zipcode))}>
                    <FormLabel color='grey' fontWeight='bold'>Zipcode</FormLabel>
                    <Input placeholder='' fontWeight='bold' value={user_zipcode} 
                    onChange={(e) => {
                    handleZipcodeChange;
                    setIsSubmitted(false);
                    }}/>
                    <FormErrorMessage>
                      {user_zipcode === "" 
                        ? "Zipcode is required" 
                        : "Invalid US ZIP code format (ex. 12345 or 12345-6789)"}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              
                <Stack spacing={0}>
                  <FormControl isInvalid={user_receiveNewsletter && isSubmitted}>
                    <FormLabel color='grey' fontWeight='bold'>Receive Newsletter Email</FormLabel>
                    <Select
                      placeholder='Select option'
                      color='grey'
                      value={user_receiveNewsletter ? 'yes' : 'no'}
                      onChange={handleReceiveNewsletter}
                    >
                      <option value='yes'>Yes</option>
                      <option value='no'>No</option>
                    </Select>
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
      </>      
    )
};

export default EditProfile;
