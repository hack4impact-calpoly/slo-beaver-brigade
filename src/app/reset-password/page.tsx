"use client"

import React, { useState } from 'react';
import {
  Box,
  Heading,
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

const ResetPasswordPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [secondFactor, setSecondFactor] = useState(false);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
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
      <Box mb={6}>
        <Heading as="h1" fontSize="xl" textAlign="center">
          Reset Password?
        </Heading>
      </Box>
      <form onSubmit={!successfulCreation ? create : reset}>
        {!successfulCreation && (
          <>
            <FormControl mb={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="e.g. john@doe.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </FormControl>
            <Button type="submit" width="full">
              Send password reset code
            </Button>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </>
        )}
        {successfulCreation && (
          <>
            <FormControl mb={4} isRequired>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Password Reset Code</FormLabel>
              <Input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </FormControl>
            <Button type="submit" width="full">
              Reset Password
            </Button>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </>
        )}
      </form>
      <Box textAlign="center" mt={4}>
        <ChakraLink href="/login">Back to Login</ChakraLink>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
