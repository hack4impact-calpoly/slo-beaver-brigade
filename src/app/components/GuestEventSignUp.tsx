import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    Textarea,
    Select,
    Switch,
    Stack,
    FormControl,
    FormLabel,
    Button
  } from "@chakra-ui/react";
  import React, { useState } from "react";

  interface GuestSignUpProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const GuestSignUp: React.FC<GuestSignUpProps> = ({isOpen, onClose}) => {
    return (
        <>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            
            <ModalOverlay />
            <ModalContent>
            <ModalHeader bg="#a3caf0" fontWeight="bold" position="relative">Sign Up as Guest </ModalHeader>             
           <ModalCloseButton />
              <ModalBody>
                <Stack spacing={3}>
                    <FormControl>
                        <Input
                            variant="flushed"
                            placeholder="Name"
                            fontWeight="bold"
                        />
                        </FormControl>
                    <FormControl>
                    <Input
                        variant="flushed"
                        placeholder="Email"
                        fontWeight="bold"
                    />
                    </FormControl>
                    <FormControl>
                    <Input
                        variant="flushed"
                        placeholder="Phone"
                        fontWeight="bold"
                    />
                    </FormControl>
                </Stack>
            </ModalBody>
    
              <ModalFooter>
                <Button 
                    onClick={onClose}
                    bg="lightblue"
                    fontSize={{ base: 'xl', md: 'md' }}
                    ml={{ base: 0, md: 2 }}
                    p={{ base: '2', md: '2' }}
                    flexBasis={{ base: '100%', md: 'auto' }}
               >
                  Cancel
                </Button>

                <Button 
                    onClick={onClose}
                    bg="lightblue"
                    fontSize={{ base: 'xl', md: 'md' }}
                    ml={{ base: 0, md: 2 }}
                    p={{ base: '2', md: '2' }}
                    flexBasis={{ base: '100%', md: 'auto' }}
               >
                  Continue
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
  };
  
  export default GuestSignUp;