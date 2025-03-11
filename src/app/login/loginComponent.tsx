"use client";

import React, { useState } from "react";
import {
  Box,
  Input,
  FormControl,
  Flex,
  FormLabel,
  Button,
  Link as ChakraLink,
  FormErrorMessage,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSignIn } from '@clerk/nextjs';
import { useRouter, useSearchParams} from 'next/navigation';
import { revalidatePathServer } from "app/actions/serveractions";
import { getBareBoneUser } from "app/actions/cookieactions";
import { getUserDataFromEmail } from "app/lib/authentication";
import "../fonts/fonts.css";
import beaverLogo from "/docs/images/beaver-logo.png";
import Image from "next/image";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect_url = searchParams.get('redirect_url');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('Password is required');
  const [emailErrorMessage, setEmailErrorMessage] = useState('Email is required');
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [signInProgress, setSignInProgress] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setEmailError(false);
    setPasswordError(false);
    setEmailErrorMessage('Email is required');
    setPasswordErrorMessage('Password is required');
    setSignInProgress(true)

    if (!isLoaded) {
      return;
    }

    if (!email || !password) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({identifier: email, strategy: "password", password });
      if (completeSignIn.status !== 'complete') {
        // The status can also be `needs_factor_on', 'needs_factor_two', or 'needs_identifier'
        // Please see https://clerk.com/docs/references/react/use-sign-in#result-status for  more information
        
      }

      if (completeSignIn.status === 'complete') {
        // can be hacked....?
        const user = await getUserDataFromEmail(email)
        
        await fetch('/api/user/cookies', {method: "POST", body:user})

        // If complete, user exists and provided password match -- set session active
        await setActive({ session: completeSignIn.createdSessionId });

        await revalidatePathServer("/")
        setSignInProgress(false)
        // Redirect the user to a post sign-in route
        if (redirect_url){
            router.push(redirect_url);
        }
        else{
            // Redirect the user to a post sign-in route
            router.push('/');
        }
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      let error = err.errors[0];
      if (error.code.includes('password')){
        setPasswordErrorMessage(error.message);
        setPasswordError(true);
      } else {
        setEmailErrorMessage(error.message);
        setEmailError(true);
      }
    }
    setSignInProgress(false)

      //setSubmitted(true);
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Box p={4} maxWidth="400px" mx="auto" fontFamily={"Lato"}>
        <Flex 
          mt={6}
          mb={4} 
          justifyContent="flex-start"
          flexDirection="column" 
          alignItems="center">
          <Image src={beaverLogo} alt="beaver" />
        </Flex>
        <FormControl mb={4} isRequired isInvalid={emailError || (email === '' && submitAttempted)}>
          <FormLabel fontWeight="600">Email</FormLabel>
          <Input 
            type="text" 
            placeholder="Email" 
            variant="filled" 
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormErrorMessage>{emailErrorMessage}</FormErrorMessage>
        </FormControl>
        <FormControl mb={4} isRequired isInvalid={passwordError || (password === '' && submitAttempted)}>
          <FormLabel fontWeight="600">Password</FormLabel>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            variant="filled"
            pr="4.5rem"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            position="absolute"
            bg="transparent"
            right="0"
            top="52.5"
            transform="translateY(-50%)"
            variant="link"
            onClick={handleTogglePassword}
          >
            {/* {showPassword ? "Hide" : "Show"} */}
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </Button>

          <FormErrorMessage>{passwordErrorMessage}</FormErrorMessage>
          
          <ChakraLink href="/forgot-password" fontSize="16px" mt={1} display="block">
            Forgot Password?
          </ChakraLink>
        </FormControl>
        <FormControl mb={4}>

        <Flex justifyContent="center" alignItems="center">
          <Button bg="#e0af48" _hover={{ bg: "#C19137" }} color="black" width="full" onClick={handleSubmit} isLoading={signInProgress} loadingText="Signing In">
            Sign In           
          </Button>
        </Flex>

        </FormControl>
        <Box textAlign="center">
        <ChakraLink href="/signup" fontSize="16px">Create New Account</ChakraLink>
        </Box>
      </Box>
    </>
  );
}