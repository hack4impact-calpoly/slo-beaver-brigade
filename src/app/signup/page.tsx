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


export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
      // If the form submission is successful, setSubmitted(true);
      // This should also handle the backend submission later.
      //for the frontend, it'll just have the successful submission screen popup
      setSubmitted(true);
  };
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
          <Button bg="#a3caf0" width="full" onClick={handleSubmit}>
            Create Account
          </Button>
        </FormControl>
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