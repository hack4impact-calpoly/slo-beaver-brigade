"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  Flex,
  Text,
  Link as ChakraLink,
  FormErrorMessage,
  Checkbox,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import {
  doesUserExist,
  getUserFromEmail,
  transitionGuestById,
} from "app/actions/userapi";
import { addToNewsletter } from "app/actions/mailingactions";
import { IUser } from "database/userSchema";
import { revalidatePathServer } from "app/actions/serveractions";
import styles from ".//page.module.css";
import "../fonts/fonts.css";
import beaverLogo from "/docs/images/beaver-logo.svg";
import Image from "next/image";

export default function SignUp() {
  //clerk consts
  const { isLoaded, signUp, setActive } = useSignUp();
  //ui consts
  const [showPassword, setShowPassword] = useState(false);
  //form consts
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [enableNewsletter, setEnableNewsletter] = useState<boolean>(false);
  //verification consts
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  //router consts
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect_url = searchParams.get("redirect_url");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(
    "Password is required"
  );
  const [emailErrorMessage, setEmailErrorMessage] =
    useState("Email is required");
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let userData = sessionStorage.getItem("userData");
    if (userData !== null) {
      const parsedData = JSON.parse(userData);

      setFirstName(parsedData.firstName);
      setLastName(parsedData.lastName);
      setEmail(parsedData.email);
      setZipcode(parsedData.zipcode);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    // If the form submission is successful, setSubmitted(true);
    // This should also handle the backend submission later.
    //for the frontend, it'll just have the successful submission screen popup

    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);
    setEmailErrorMessage("Email is required");
    setPasswordErrorMessage("Password is required");

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
        sessionStorage.removeItem("userData");
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
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        // change the UI to our pending section.
        setPendingVerification(true);
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
        let error = err.errors[0];
        if (error.code.includes("password")) {
          setPasswordErrorMessage(error.message);
          setPasswordError(true);
        } else {
          setEmailErrorMessage(error.message);
          setEmailError(true);
        }
      }
    } catch (error) {
      // Handle the error

      setSubmitAttempted(true);
    }
  };

  // Verify User Email Code
  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        // create mongoose account
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        setIsVerifying(false);
      }
      if (completeSignUp.status === "complete") {
        // create mongoose user
        //creates data object from form data
        const data = {
          email: email,
          phoneNumber: phone,
          receiveNewsletter: enableNewsletter,
          role: "user",
          firstName: firstName,
          lastName: lastName,
          zipcode: zipcode,
        };
        // check if user has made a guest account and transition if so
        const userRes = await getUserFromEmail(email);
        let res = null;
        if (userRes) {
          const user: IUser = JSON.parse(userRes);
          // no point in checking is user is guest, as they wouldn't be able to create
          // account with clerk if they had an existing email
          await transitionGuestById(user._id);
        } else {
          res = await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        }

        if ((res && res.ok) || userRes) {
          if (enableNewsletter) {
            const newsRes = await addToNewsletter(
              email,
              data.firstName,
              data.lastName,
              data.zipcode
            );

            if (!newsRes) {
              console.error("Failed to add user to newsletter");
            }
          }

          setIsVerifying(false);
          await revalidatePathServer("/");
          // Redirect the user to a post sign-up route
          await setActive({ session: completeSignUp.createdSessionId });
          if (redirect_url) {
            router.push(redirect_url);
          } else {
            // Redirect the user to a post sign-in route
            router.push("/");
          }
        }
      }
    } catch (err) {
      setIsVerifying(false);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Box
        p={4}
        maxWidth="400px"
        mx="auto"
        className={styles.componentContainer}
      >
        {!pendingVerification && (
          <>
            <Box mt={6} mb={6}>
              <Box textAlign="center">
                <Text fontWeight="400" fontSize="24px">
                  Create Account
                </Text>
              </Box>
            </Box>
            <Box fontFamily="Lato">
              <FormControl
                mb={4}
                isRequired
                isInvalid={firstName === "" && submitAttempted}
              >
                <FormLabel fontWeight="600">First Name</FormLabel>
                <Input
                  type="text"
                  placeholder="First Name"
                  variant="filled"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={true}
                />
                <FormErrorMessage>First name is required</FormErrorMessage>
              </FormControl>
              <FormControl
                mb={4}
                isRequired
                isInvalid={lastName === "" && submitAttempted}
              >
                <FormLabel fontWeight="600">Last Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Last Name"
                  variant="filled"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={true}
                />
                <FormErrorMessage>Last name is required</FormErrorMessage>
              </FormControl>
              <FormControl
                mb={4}
                isRequired
                isInvalid={emailError || (email === "" && submitAttempted)}
              >
                <FormLabel fontWeight="600">Email</FormLabel>
                <Input
                  type="text"
                  placeholder="Email"
                  variant="filled"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={true}
                />
                <FormErrorMessage>{emailErrorMessage}</FormErrorMessage>
              </FormControl>
              <FormControl
                mb={4}
                isRequired
                isInvalid={phone === "" && submitAttempted}
              >
                <FormLabel fontWeight="600">Phone Number</FormLabel>
                <Input
                  type="text"
                  placeholder="Phone"
                  variant="filled"
                  onChange={(e) => setPhone(e.target.value)}
                  required={true}
                />
                <FormErrorMessage>Phone number is required</FormErrorMessage>
              </FormControl>
              <FormControl
                mb={4}
                isRequired
                isInvalid={zipcode === "" && submitAttempted}
              >
                <FormLabel fontWeight="600">Zipcode</FormLabel>
                <Input
                  type="text"
                  placeholder="Zipcode"
                  variant="filled"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                />
                <FormErrorMessage>Zipcode is required</FormErrorMessage>
              </FormControl>
              <FormControl
                mb={4}
                isRequired
                isInvalid={
                  passwordError || (password === "" && submitAttempted)
                }
              >
                <FormLabel fontWeight="600">Password</FormLabel>
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
                  variant="Link"
                  onClick={handleTogglePassword}
                >
                  {/* {showPassword ? "Hide" : "Show"} */}
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </Button>
                <FormErrorMessage>{passwordErrorMessage}</FormErrorMessage>
              </FormControl>
              <FormControl
                style={{ display: "flex", flexDirection: "row" }}
                mb={4}
              >
                <FormLabel fontWeight="600">
                  Join the Beaver Brigade Newsletter?
                  <Checkbox
                    style={{ verticalAlign: "middle", marginLeft: "10px" }}
                    checked={enableNewsletter}
                    onChange={() => {
                      setEnableNewsletter(!enableNewsletter);
                    }}
                  ></Checkbox>
                </FormLabel>
              </FormControl>
              <FormControl mb={4}>
                <Button
                  loadingText="Submitting"
                  bg="#337774"
                  _hover={{ bg: "#4a9b99" }}
                  color="white"
                  width="full"
                  onClick={handleSubmit}
                >
                  Create Account
                </Button>
              </FormControl>
            </Box>
          </>
        )}
        {pendingVerification && (
          <>
            <Box mt={8} mb={8}>
              <Flex
                textAlign="center"
                justifyContent="flex-start"
                flexDirection="column"
                alignItems="center"
              >
                <Image src={beaverLogo} alt="beaver" />
                <Text
                  mt={12}
                  fontFamily="Lato"
                  fontWeight="600"
                  fontSize={"24px"}
                >
                  Verification code sent to
                  <br />
                  {email}
                </Text>
              </Flex>
            </Box>
            <Box mt={12} fontFamily="Lato">
              <FormControl mb={4} isRequired>
                <FormLabel fontWeight="600">Email Verification Code</FormLabel>
                <Input
                  type="text"
                  placeholder="123456"
                  variant="filled"
                  onChange={(e) => setCode(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4} mb={4} isInvalid={submitAttempted}>
                <Button
                  loadingText="Verifying"
                  isLoading={isVerifying}
                  bg="#e0af48"
                  _hover={{ bg: "#C19137" }}
                  color="black"
                  width="full"
                  onClick={onPressVerify}
                >
                  Verify Email
                </Button>
                <FormErrorMessage>
                  Error has occured in server. Please contact email:
                  hack4impact@calpoly.edu
                </FormErrorMessage>
              </FormControl>
              <Button
                mt={4}
                bg="#e0af48"
                _hover={{ bg: "#C19137" }}
                color="black"
                width="full"
                onClick={() => setPendingVerification(false)}
              >
                Back
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
