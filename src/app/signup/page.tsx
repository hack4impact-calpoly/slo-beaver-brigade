"use client";
import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Textarea,
  Link as ChakraLink,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from './page.module.css'
import checkmarkImage from '/docs/images/checkmark.png'
import Image from 'next/image'
import { auth, useSignUp, useUser } from '@clerk/nextjs';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { useRouter, useSearchParams } from 'next/navigation';
import { get } from "http";


export default function SignUp() {
  const { isSignedIn, user } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(-1);
  const [gender, setGender] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [interestQuestions, setInterestQuestions] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams()
  const redirect_url = searchParams.get('redirect_url')

  // Create a new user post request to mongoDB
  const createUser = async (data: any) => {
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // If the user is created, update the user metadata in Clerk
      if (res.ok) {
        // Get the user's ID from the response
        const responseData = await res.json();
        const dbId = responseData._id;
        try {
          // Get the user's ID from the clerk session
          const { userId } : { userId: string | null } = auth();
          const params = { externalId: dbId };
          if (userId) {
            // Update the user's id in Clerk
            await clerkClient.users.updateUser(userId, params);
          }
        } catch (error) {
          console.log('Failed to update user id in Clerk: ', error);
        }
      } else {
        console.log('Failed to create user');
      }
    } catch (error) {
      console.log('Failed to create user: ', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
      // If the form submission is successful, setSubmitted(true);
      // This should also handle the backend submission later.
      //for the frontend, it'll just have the successful submission screen popup

    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    //checks for empty fields
    if (!firstName || !lastName || !email || !password || !phone || !zipcode) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      //create a clerk user
      await signUp.create({
        emailAddress: email, 
        password, 
        firstName, 
        lastName, 
        unsafeMetadata: {
          phone, 
          zipcode, 
          interestQuestions
        }
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to our pending section.
      setPendingVerification(true);

    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }

  };

  // Verify User Email Code
  const onPressVerify = async (e : React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== 'complete') {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === 'complete') {

        try {
          
          //creates data object from form data
          const data = {
            'email': email,
            'phoneNumber': phone,
            'role': "user",
            'gender': gender,
            'age': age,
            'firstName': firstName,
            'lastName': lastName,
          };

          // passes data to createUser function
          createUser(data);

        } catch (error) {
          // Handle the error
          console.log('Error:', error);
        }

        await setActive({ session: completeSignUp.createdSessionId });
        // Redirect the user to a post sign-up route
        if (redirect_url){
          router.push(redirect_url);
        } else {
            // Redirect the user to a post sign-in route
            router.push('/');
        }
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Box p={4} maxWidth="400px" mx="auto">
        {!pendingVerification && (
          <>
            <Box mb={6}>
              <Heading as="h1" fontSize="xl" textAlign="center">
                Create Account
              </Heading>
            </Box>
            <FormControl mb={4} isRequired>
              <FormLabel>First Name</FormLabel>
              <Input 
                type="text" 
                placeholder="First Name" 
                variant="filled"
                onChange={(e) => setFirstName(e.target.value)} 
                required={true}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input 
                type="text" 
                placeholder="Last Name" 
                variant="filled"
                onChange={(e) => setLastName(e.target.value)} 
                required={true}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input 
                type="text" 
                placeholder="Email" 
                variant="filled" 
                onChange={(e) => setEmail(e.target.value)}
                required={true}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                variant="filled"
                pr="4.5rem"
                onChange={(e) => setPassword(e.target.value)}
                required={true}
              />
            <Button
                position="absolute"
                bg="transparent"
                right="0"
                top="65%"
                transform="translateY(-38%)"
                onClick={handleTogglePassword}
              >
                {/* {showPassword ? "Hide" : "Show"} */}
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </Button>
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Phone</FormLabel>
              <Input 
                type="text" 
                placeholder="Phone" 
                variant="filled" 
                onChange={(e) => setPhone(e.target.value)}
                required={true}/>
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Age</FormLabel>
                <Input 
                    type="number" 
                    placeholder="Age" 
                    variant="filled" 
                    onChange={(e) => setAge(parseInt(e.target.value))}
                />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Gender</FormLabel>
              <Input 
                type="text" 
                placeholder="Gender" 
                variant="filled" 
                onChange={(e) => setGender(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Zipcode</FormLabel>
              <Input 
                type="text" 
                placeholder="Zipcode" 
                variant="filled" 
                onChange={(e) => setZipcode(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Interest Questions</FormLabel>
              <Textarea
                placeholder="Enter your text here"
                size="lg"
                variant="filled"
                onChange={(e) => setInterestQuestions(e.target.value)}
                />
            </FormControl>
            <FormControl mb={4}>
              <Button bg="#a3caf0" width="full" onClick={handleSubmit}>
                Create Account
              </Button>
            </FormControl>
          </>  
        )}
        {pendingVerification && (
          <>
            <Box mb={6}>
              <Heading as="h1" fontSize="xl" textAlign="center">
                Verify Email
              </Heading>
            </Box>
            <FormControl mb={4} isRequired>
              <FormLabel>Verification Code</FormLabel>
              <Input
                type="text" 
                placeholder="Verification Code" 
                variant="filled"
                onChange={(e) => setCode(e.target.value)}
                />
            </FormControl>
            <FormControl mb={4}>
              <Button bg="#a3caf0" width="full" onClick={onPressVerify}>
                Verify
              </Button>
            </FormControl>
          </>
        )}
      </Box>
      <div>
        {isSubmitted && <AccountCreated/>}
      </div>
    </>
  );
}

 //When return to calendar is clicked it should reroute to the calendar
const AccountCreated = () => {
    return(
        <div className = {styles.successWindow}>
            <div className={styles.totalAccountCreated}>
                <Image className={styles.checkmark} src={checkmarkImage} alt="checkmark"/>
                <div className={styles.successText}>SUCCESS</div>
                <div className={styles.successExplanation}>Your account has been created</div>
                <div className={styles.buttonContainer}>
                    <NextLink href = "/">
                    <button className={styles.returnToCalendar}>Return to calendar</button>
                    </NextLink>
                </div>
            </div>
        </div>
    )
}