"use client"

import React, { useState } from 'react';
import {
  Box,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
  Link as ChakraLink,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useAuth, useSignIn } from '@clerk/nextjs';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import "../fonts/fonts.css";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [secondFactor, setSecondFactor] = useState(false);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    router.push('/');
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then(_ => {
        setSuccessfulCreation(true);
        setError('');
      })
      .catch(err => {
        console.error('error', err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then(result => {
        // Check if 2FA is required
        if (result.status === 'needs_second_factor') {
          setSecondFactor(true);
          setError('');
        } else if (result.status === 'complete') {
          // Set the active session to 
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError('');
          router.push('/dashboard');

        } else {
          console.log(result);
        }
      })
      .catch(err => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <Box p={4} maxWidth="400px" mx="auto">
      <Box mt={6} mb={6} textAlign="center">
        <Text fontSize="20" fontWeight="400" textAlign="center">
          Forgot Password?
        </Text>
      </Box>
      <form onSubmit={!successfulCreation ? create : reset}>
        {!successfulCreation && (
          <>
            <Box fontFamily="Lato">
              <FormControl mb={4} isRequired>
                <FormLabel fontWeight={600}>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  variant="filled"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </FormControl>
              <Button loadingText="Sending Code" bg="#e0af48" color="black" type="submit" width="full">
                Send Reset Code
              </Button>
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </Box>
          </>
        )}
        {successfulCreation && (
          <>
            <Box fontFamily="Lato">
              <FormControl mb={4} isRequired>
                <FormLabel fontWeight="600">Password Reset Code</FormLabel>
                <Input
                  type="text"
                  variant="filled"
                  placeholder="123456"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
              </FormControl>
              <FormControl mb={4} isRequired>
                <FormLabel fontWeight="600">New Password</FormLabel>
                <Input
                  type="password"
                  variant="filled"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </FormControl>
            
              <Button loadingText="Submitting" bg="#e0af48" color="black" type="submit" width="full">
                Reset Password
              </Button>
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </Box>
          </>
        )}
      </form>
      <Box fontFamily= "Lato" textAlign="center" mt={4}>
        <ChakraLink href="/login">Back to Login</ChakraLink>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
