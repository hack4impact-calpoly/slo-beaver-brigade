"use client";

import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { set } from "mongoose";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    if (!email || !password) {
      alert('Please fill out all fields.');
      return;
    }
    
    console.log(email, password)

    try {
      const completeSignIn = await signIn.create({identifier: email, strategy: "password", password });
      if (completeSignIn.status !== 'complete') {
        // The status can also be `needs_factor_on', 'needs_factor_two', or 'needs_identifier'
        // Please see https://clerk.com/docs/references/react/use-sign-in#result-status for  more information
        console.log(JSON.stringify(completeSignIn, null, 2));
      }
 
      if (completeSignIn.status === 'complete') {
        // If complete, user exists and provided password match -- set session active
        await setActive({ session: completeSignIn.createdSessionId });
        // Redirect the user to a post sign-in route
        router.push('/');
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }

      //setSubmitted(true);
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Box p={4} maxWidth="400px" mx="auto">
        <Box mb={6}>
          <Heading 
            as="h1" 
            fontSize="xl" 
            textAlign="center">
            Log In
          </Heading>
        </Box>
        <FormControl mb={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input 
            type="text" 
            placeholder="Email" 
            variant="filled" 
            onChange={(e) => setEmail(e.target.value)}
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
          />
          <Button
            position="absolute"
            bg="transparent"
            right="0"
            top="53.5%"
            transform="translateY(-50%)"
            onClick={handleTogglePassword}
          >
            {/* {showPassword ? "Hide" : "Show"} */}
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </Button>
          <ChakraLink href="#" fontSize="sm" mt={1} display="block">
            Forgot password?
          </ChakraLink>
        </FormControl>
        <FormControl mb={4}>
          <Button bg="#a3caf0" width="full" onClick={handleSubmit}>
            Log In
          </Button>
        </FormControl>
        <Box textAlign="center">
          <NextLink href="/signup" passHref>
            <ChakraLink fontSize="sm">Create new account</ChakraLink>
          </NextLink>
        </Box>
      </Box>
    </>
  );
}
