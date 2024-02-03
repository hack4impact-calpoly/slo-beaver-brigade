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

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Box p={4} maxWidth="400px" mx="auto">
        <Box mb={6}>
          <Heading as="h1" fontSize="xl" textAlign="center">
            Create Account
          </Heading>
        </Box>
        <FormControl mb={4}>
          <FormLabel>Name</FormLabel>
          <Input type="text" placeholder="Name" variant="filled" />
        </FormControl>
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
            top="65%"
            transform="translateY(-38%)"
            onClick={handleTogglePassword}
          >
            {/* {showPassword ? "Hide" : "Show"} */}
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </Button>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Phone</FormLabel>
          <Input type="text" placeholder="Phone" variant="filled" />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Zipcode</FormLabel>
          <Input type="text" placeholder="Zipcode" variant="filled" />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Interest Questions</FormLabel>
          <Textarea
            placeholder="Enter your text here"
            size="lg"
            variant="filled"
            />
        </FormControl>
        <FormControl mb={4}>
          <Button bg="#a3caf0" width="full">
            Create Account
          </Button>
        </FormControl>
      </Box>
    </>
  );
}
