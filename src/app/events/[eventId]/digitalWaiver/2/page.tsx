"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import styles from './page.module.css'
import beaverLogo from '/docs/images/beaver-logo.svg'
import Image from 'next/image'
import NextLink from "next/link";
import { IUser } from '@database/userSchema';
import { useNavigate } from 'react-router-dom';
import { addToRegistered } from "@app/actions/useractions";

type IParams = {
  params: {
      eventId: string
  }
}

export default function Waiver({ params: { eventId } }: IParams) {
  const [dependents, setDependents] = useState(['']);
  const [formFilled, setFormFilled] = useState(false);
  const [email, setEmail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [signature, setSignature] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);


  useEffect(() => {
    // Check if all required fields are filled
    const isFilled = email.trim() !== '' && zipcode.trim() !== '' && signature.trim() !== '';
    setFormFilled(isFilled);
  }, [email, zipcode, signature]);

  const addDependent = () => {
    const emptyFieldCount = dependents.filter(dependent => dependent === '').length;
    if(emptyFieldCount <= 1){
      setDependents([...dependents, '']);
    }               
  };

  const handleDependentChange = (index: number, value: string) => {
    const newDependents = [...dependents];
    newDependents[index] = value; 
    setDependents(newDependents);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailChecked(true);
    const dependentArray = dependents.filter((dependent) => dependent !== '');

    const data = {
      eventId: eventId,
      dependents: dependentArray,
    };

    //finds the userId associated with the given email
    const fetchUser = async (): Promise<string | null> => {
      try {
        const res = await fetch(`/api/user`);
        if (res.ok) {
          const data = await res.json();
          const specificUser = data.users.filter((user:IUser) => user.email === email)
          if(specificUser.length > 0){
            return specificUser[0]._id;
          } else{
            return null;
          }
        } else {
          console.error("Error fetching user:", res.statusText);
          return null;
        }
      } catch (error) {
        console.error("Error fetching user", error);
        return null;
      }
    };
    const uId = await fetchUser();
    
    //if a user exists for the given email, create a new waiver
    //returns the waiverId, 
    if(uId){
      setValidEmail(true);
      try {
        const res = await fetch(`/api/waiver`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        //if the waiver returns successfully
        if (res.ok) {
            const responseData = await res.json();
            const waiverId = responseData._id; 
            
            //add digitalWaiverId to user, and add an object that consists of
            //the eventId and digitalWaiverId to eventsAttended
            const updatedInfo ={
              eventsRegistered: {
                  eventId: eventId,
                  digitalWaiver: waiverId
              }
            }

            try {
              //call to update the user object
              const res = await addToRegistered(uId, eventId, waiverId)
              if (res) {
                console.log('added')
                //on success, return to the home page
                window.location.href = '/';
                
              } else {
                  console.error("Error adding info to user");
              }} 
            catch (error) {
              console.error("Error adding info to user", error);
            }
        } else {
            console.error("Error creating waiver", res.statusText);
        }} 
      catch (error) {
        console.error("Error creating waiver:", error);
      }

    }
    else{
      onOpen();
    }
  };

  return (
    <div>
      <Flex flexDirection="column" justifyContent="flex-start" alignItems="center" 
        height="100vh" marginTop="5vh">
        <Image src={beaverLogo} alt="beaver"/>
        <form onSubmit={handleSubmit}>
        <Box w="100%" h="60%" mt={20} mb='2.7%' padding='1vw' overflow="auto">
          <h1 style={{ fontSize: "30px", fontWeight: "bold" } }>Add Members</h1>
          <h2 className={styles.formHeading}>Contact Information</h2>
          <input className={styles.inputForm} type="email" id="email" name="email" 
          placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
          <input className={styles.inputZipcode} type="zipcode" id="zipcode" name="zipcode" 
          placeholder="Zipcode" onChange={(e) => setZipcode(e.target.value)} required/>
          <table width="100%">
            <tbody>
            {dependents.map((name, index) => (
              <tr key={index}>
                <td>
                  <input
                    className={styles.dependentTable}
                    type="text"
                    value={name}
                    onChange={(event) => handleDependentChange(index, event.target.value)}
                    style={{ display: index === 0 ? 'none' : 'block'}}
                    placeholder="Dependent Full Name"
                  />
                </td>
              </tr>
            ))}
            </tbody>
          </table>
            <button type="button" onClick={addDependent} 
            className={styles.addDependent} style={{color: '#ECB94A'}}>
              Add Dependent +
            </button>
            <h2 className={styles.formHeading}>Sign Here</h2>
            <input className={styles.inputSignature} type="string" id="signature" name="signature" 
            placeholder="Signature"onChange={(e) => setSignature(e.target.value)} required/>
          
        </Box>
        <Flex flexDirection="row">
          <NextLink href = "/waiver">
            <Button sx={{ width: '225px', height: '40px', marginLeft: '75px', marginRight: '75px',
            backgroundColor: 'white', border: '2px solid #B5B5B5', color: '#B5B5B5',
            borderRadius: '10px', '&:hover': { backgroundColor: 'gray.200', border: '2px solid gray.200' }
            }}>Return</Button>
           </NextLink>
          { !formFilled &&
            <Button sx={{ width: '225px', height: '40px', marginLeft: '75px', marginRight: '75px',
            backgroundColor: 'white', border: '2px solid #B5B5B5', color: '#B5B5B5',
            borderRadius: '10px', 
            '&:hover':{ backgroundColor: 'white', border: '2px solid gray.200' } 
            }}>Continue</Button>
          }
          {
            formFilled && 
              <Button type="submit" sx={{ width: '225px', height: '40px', marginLeft: '75px', marginRight: '75px',
              backgroundColor: '#337774', border: '2px solid #337774', color: 'white',
              borderRadius: '10px', 
              '&:hover':{ backgroundColor: '#296361', border: '2px solid #296361' } 
              }}>
                Continue
              </Button>
          }
          
        </Flex>
        </form>
      </Flex>

      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Email not registered</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Please try again or create an account.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Close
            </Button>
            <Button sx={{marginLeft: "5%"}}>
              <a href="/signup">
                Create Account
              </a>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
  