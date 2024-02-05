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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Box p={4} maxWidth="400px" mx="auto">
        <Box mb={6}>
          <Heading as="h1" fontSize="xl" textAlign="center">
            Log In
          </Heading>
        </Box>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="text" placeholder="Email" variant="filled" />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            variant="filled"
            pr="4.5rem"
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
          <Button bg="#a3caf0" width="full">
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
