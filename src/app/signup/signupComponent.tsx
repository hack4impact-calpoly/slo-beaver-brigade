'use client';
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Textarea,
  Text,
  Link as ChakraLink,
  FormErrorMessage,
  Checkbox,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSignUp } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { doesUserExist, getUserFromEmail, transitionGuestById } from 'app/actions/userapi';
import { addToNewsletter } from 'app/actions/mailingactions';
import { IUser } from 'database/userSchema';
import { revalidatePathServer } from 'app/actions/serveractions';

import styles from ".//page.module.css"
import { Montserrat } from 'next/font/google';
import "../fonts/fonts.css";


export default function SignUp() {
  //clerk consts
  const { isLoaded, signUp, setActive } = useSignUp();
  //ui consts
  const [showPassword, setShowPassword] = useState(false);
  //form consts
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [enableNewsletter, setEnableNewsletter] = useState<boolean>(true);
  //verification consts
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  //router consts
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect_url = searchParams.get('redirect_url');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('Password is required');
  const [emailErrorMessage, setEmailErrorMessage] = useState('Email is required');
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // If the form submission is successful, setSubmitted(true);
    // This should also handle the backend submission later.
    //for the frontend, it'll just have the successful submission screen popup

    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);
    setEmailErrorMessage('Email is required');
    setPasswordErrorMessage('Password is required');

    if (!isLoaded) {
      return;
    }

    //checks for empty fields
    if (!firstName || !lastName || !email || !password || !phone || !zipcode) {
      return;
    }

    try {


      // If the user is created, update the user metadata in Clerk
      // check if user already exists in mongo
     

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
            },
          });
 

          // send the email.
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

          // change the UI to our pending section.
          setPendingVerification(true);
        } catch (err: any) {
          console.error(JSON.stringify(err, null, 2));
          let error = err.errors[0];
          if (error.code.includes('password')) {
            setPasswordErrorMessage(error.message);
            setPasswordError(true);
          } else {
            setEmailErrorMessage(error.message);
            setEmailError(true);
          }
        }
      } 
      
    catch (error) {
      // Handle the error
      console.log('Error:', error);
        setSubmitAttempted(true);
    }
  };

  // Verify User Email Code
  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== 'complete') {
        // create mongoose account
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        // create mongoose user
        //creates data object from form data
        const data = {
            email: email,
            phoneNumber: phone,
            receiveNewsletter: enableNewsletter,
            role: 'user',
            firstName: firstName,
            lastName: lastName,
            zipcode: zipcode
        };
        // check if user has made a guest account and transition if so
        const userRes = await getUserFromEmail(email)
        let res = null
        if (userRes){
            const user: IUser = JSON.parse(userRes)
            // no point in checking is user is guest, as they wouldn't be able to create
            // account with clerk if they had an existing email
            await transitionGuestById(user._id)

        }
        else{
            console.log('creating user in mongo')
            res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        }

        if ((res && res.ok) || userRes){

            console.log('waiting redirect')
            if (enableNewsletter){
                console.log('adding to newsletter')
                const newsRes = await addToNewsletter(email)
                console.log('res news, ', newsRes)
                if (!newsRes){
                    console.log('failed to add to newsletter.')
                }
            }

            await revalidatePathServer("/dashboard")
            // Redirect the user to a post sign-up route
            if (redirect_url) {
            router.push(redirect_url);
            } else {
            // Redirect the user to a post sign-in route
            router.push('/');
            }
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
      <Box p={4} maxWidth="400px" mx="auto" className={styles.componentContainer}>
        {!pendingVerification && (
          <>
            <Box mt={4} mb={4}>
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="bold">
                  Create Account
                </Text>
              </Box>
            </Box>
            <FormControl mb={4} isRequired isInvalid={firstName === '' && submitAttempted}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="First Name"
                variant="filled"
                onChange={(e) => setFirstName(e.target.value)}
                required={true}
              />
              <FormErrorMessage>First name is required</FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isRequired isInvalid={lastName === '' && submitAttempted}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Last Name"
                variant="filled"
                onChange={(e) => setLastName(e.target.value)}
                required={true}
              />
              <FormErrorMessage>Last name is required</FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isRequired isInvalid={emailError || (email === '' && submitAttempted)}>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                placeholder="Email"
                variant="filled"
                onChange={(e) => setEmail(e.target.value)}
                required={true}
              />
              <FormErrorMessage>{emailErrorMessage}</FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isRequired isInvalid={phone === '' && submitAttempted}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                placeholder="Phone"
                variant="filled"
                onChange={(e) => setPhone(e.target.value)}
                required={true}
              />
              <FormErrorMessage>Phone number is required</FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isRequired isInvalid={zipcode === '' && submitAttempted}>
              <FormLabel>Zipcode</FormLabel>
              <Input
                type="text"
                placeholder="Zipcode"
                variant="filled"
                onChange={(e) => setZipcode(e.target.value)}
              />
              <FormErrorMessage>Zipcode is required</FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isRequired isInvalid={passwordError || (password === '' && submitAttempted)}>
              <FormLabel>Password</FormLabel>
              <Input
                type={showPassword ? 'text' : 'password'}
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
              <FormErrorMessage>{passwordErrorMessage}</FormErrorMessage>
            </FormControl>
            <FormControl style={{display: "flex", flexDirection:"row"}} mb={4}>
              <FormLabel fontWeight="bold">Sign up for the Beaver Brigade Newsletter?
              <Checkbox style={{verticalAlign: "middle", marginLeft: "10px"}} checked={enableNewsletter} onClick={() => {
                setEnableNewsletter(!enableNewsletter)
              }}></Checkbox>
              </FormLabel>
            </FormControl>
            <FormControl mb={4}>
              <Button loadingText="Submitting" bg="#006d75" color="white"  width="full" onClick={handleSubmit}>
                Create Account
              </Button>
            </FormControl>
          </>
        )}
        {pendingVerification && (
          <>
            <Box mt={8} mb={8}>
              <Heading textAlign="center">
                <Text fontSize="xl" fontWeight="bold" >
                  Verify Email
                </Text>
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
            <FormControl mt={4} mb={4} isInvalid={submitAttempted}>
              <Button loadingText="Submitting" bg="#006d75" color="white" width="full" onClick={onPressVerify}>
                Verify
              </Button>
              <FormErrorMessage>Error has occured in server. Please contact email: hack4impact@calpoly.edu</FormErrorMessage>
            </FormControl>
     
          </>
        )}
      </Box>
    </>
  );
}