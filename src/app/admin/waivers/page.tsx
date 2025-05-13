"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  Textarea,
  useToast,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  Heading,
  Stack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useMediaQuery,
} from "@chakra-ui/react";
import { CloseIcon, ChevronRightIcon } from "@chakra-ui/icons";
import styles from "./page.module.css";
import { IWaiverVersion } from "@database/waiverVersionsSchema";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WaiverVersions() {
  const [waiverContent, setWaiverContent] = useState("");
  const [acknowledgement, setAcknowledgement] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<IWaiverVersion | null>(
    null
  );
  const [waiverToDelete, setWaiverToDelete] = useState<IWaiverVersion | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const [isLargerThan830] = useMediaQuery("(min-width: 830px)");

  // Fetch waiver versions
  const { data, error, mutate } = useSWR("/api/waiver-versions", fetcher);
  const waiverVersions = data?.waiverVersions || [];

  const handleSave = async () => {
    try {
      const nextVersion = waiverVersions.length + 1;
      const response = await fetch("/api/waiver-versions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: nextVersion,
          body: waiverContent,
          acknowledgement: acknowledgement,
        }),
      });

      if (response.ok) {
        toast({
          title: "Waiver saved successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setSelectedVersion(null);
        setWaiverContent("");
        setAcknowledgement("");
        mutate();
      } else {
        throw new Error("Failed to save waiver");
      }
    } catch (error) {
      toast({
        title: "Error saving waiver",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateWaiver = async () => {
    if (!selectedVersion) return;
    console.log(selectedVersion.dateCreated);
    try {
      console.log("Updating waiver with data:", {
        body: waiverContent,
        acknowledgement: acknowledgement,
      });

      const response = await fetch(
        `/api/waiver-versions/${selectedVersion._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: waiverContent,
            acknowledgement: acknowledgement,
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Waiver updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        mutate();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update waiver");
      }
    } catch (error) {
      console.error("Error updating waiver:", error);
      toast({
        title: "Error updating waiver",
        description:
          error instanceof Error ? error.message : "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVersionSelect = (version: IWaiverVersion) => {
    setSelectedVersion(version);
    setWaiverContent(version.body);
    setAcknowledgement(version.acknowledgement);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (selectedVersion) {
      setWaiverContent(selectedVersion.body);
      setAcknowledgement(selectedVersion.acknowledgement);
      setIsEditing(false);
    }
  };

  const handleNewWaiver = () => {
    setSelectedVersion(null);
    setWaiverContent("");
    setAcknowledgement("");
    setIsEditing(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, version: IWaiverVersion) => {
    e.stopPropagation(); // Prevent waiver selection when clicking delete
    setWaiverToDelete(version);
    setIsDeleteDialogOpen(true);
  };

  const getWaiverName = (version: IWaiverVersion) => {
    const waiverDate = new Date(version.dateCreated);
    return `Waiver ${waiverDate.getMonth()+1}/${waiverDate.getDate()}/${waiverDate.getFullYear()%100} - ${waiverDate.getHours()}:${waiverDate.getMinutes()}:${waiverDate.getSeconds()}`;
  };  

  const handleDelete = async () => {
    if (!waiverToDelete) return;

    try {
      const response = await fetch(
        `/api/waiver-versions/${waiverToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Waiver deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        if (selectedVersion?._id === waiverToDelete._id) {
          handleNewWaiver();
        }
        mutate();
      } else {
        throw new Error("Failed to delete waiver");
      }
    } catch (error) {
      toast({
        title: "Error deleting waiver",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setWaiverToDelete(null);
    }
  };

  const handleSetActive = async (version: IWaiverVersion) => {
    try {
      const response = await fetch(`/api/waiver-versions/${version._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: version.body,
          acknowledgement: version.acknowledgement,
          isActiveWaiver: true,
        }),
      });

      if (response.ok) {
        const updatedWaiver = await response.json();
        // Update the selected version with the new active state
        setSelectedVersion(updatedWaiver);
        toast({
          title: "Waiver set as active successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        mutate();
      } else {
        throw new Error("Failed to set waiver as active");
      }
    } catch (error) {
      toast({
        title: "Error setting waiver as active",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className={styles.container}>
      <Flex direction="column" w="100%">
        {isLargerThan830 ? (
          // Hardcoded Sidebar for Larger Screens
          <Flex width="full" justify="space-between" alignItems="flex-start">
            <Box
              width="40%"
              maxWidth="375px"
              p={[5, 5, 5, 5]}
              bg="#F5F5F5"
              borderTopLeftRadius="md"
              borderBottomLeftRadius="md"
              height="775px"
              className="filterContainer"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box>
                <Heading
                  as="h1"
                  textTransform="none"
                  textAlign="left"
                  padding="10px"
                  fontSize="20"
                  mb="3"
                >
                  Waiver Versions
                </Heading>
                <Stack spacing={2}>
                  {waiverVersions.map((version: IWaiverVersion) => (
                    <Flex
                    key={version._id}
                    align="center"
                    gap={2}
                    _hover={{ "& .delete-icon": { opacity: 1 } }}
                  >
                    <Button
                      flex={1}
                      variant={
                        selectedVersion?._id === version._id ? "solid" : "ghost"
                      }
                      colorScheme={
                        selectedVersion?._id === version._id ? "teal" : "gray"
                      }
                      justifyContent="flex-start"
                      onClick={() => handleVersionSelect(version)}
                    >
                      {getWaiverName(version)} {version.isActiveWaiver ? "(Active)" : ""}
                    </Button>
                    <IconButton
                      size="xs"
                      icon={<CloseIcon />}
                      colorScheme="red"
                      variant="ghost"
                      aria-label="Delete waiver"
                      onClick={(e) => handleDeleteClick(e, version)}
                      isDisabled={version.isActiveWaiver}
                      opacity={0}
                      className="delete-icon"
                      transition="opacity 0.2s"
                    />
                  </Flex>
                  ))}
                  <Button
                    variant={!selectedVersion ? "solid" : "ghost"}
                    colorScheme={!selectedVersion ? "teal" : "gray"}
                    justifyContent="flex-start"
                    onClick={handleNewWaiver}
                    mt={4}
                    mb={2}
                  >
                    + New Waiver
                  </Button>
                </Stack>
              </Box>
            </Box>

            {/* Main Content */}
            <Flex
              direction={"column"}
              gap={6}
              w="100%"
              bg="#F5F5F5"
              borderTopRightRadius="md"
              borderBottomRightRadius="md"
              p="5"
              h="775px"
            >
              <Box flex={1}>
                <Heading fontSize="xl" fontWeight="bold" mb={3}>
                  Waiver Content
                </Heading>
                <Textarea
                  value={waiverContent}
                  onChange={(e) => {
                    setWaiverContent(e.target.value);
                    if (selectedVersion) setIsEditing(true);
                  }}
                  placeholder="Enter waiver content here..."
                  size="lg"
                  minH="300px"
                  resize="vertical"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px teal.500",
                  }}
                />
              </Box>

              <Box flex={1}>
                <Heading fontSize="xl" fontWeight="bold" mb={3}>
                  Acknowledgement
                </Heading>
                <Textarea
                  value={acknowledgement}
                  onChange={(e) => {
                    setAcknowledgement(e.target.value);
                    if (selectedVersion) setIsEditing(true);
                  }}
                  placeholder="Enter acknowledgement text here..."
                  size="lg"
                  minH="300px"
                  resize="vertical"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px teal.500",
                  }}
                />
              </Box>
            </Flex>
          </Flex>
        ) : (
          // Drawer for Smaller Screens
          <>
            <Button
              onClick={onOpen}
              colorScheme="teal"
              variant="outline"
              mb="4"
            >
              View Waiver Versions
            </Button>
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader mt={20}>Waiver Versions</DrawerHeader>
                <DrawerBody>
                  <Stack spacing={2}>
                    {waiverVersions.map((version: IWaiverVersion) => (
                      <Flex
                      key={version._id}
                      align="center"
                      gap={2}
                      _hover={{ "& .delete-icon": { opacity: 1 } }}
                    >
                      <Button
                        flex={1}
                        variant={
                          selectedVersion?._id === version._id ? "solid" : "ghost"
                        }
                        colorScheme={
                          selectedVersion?._id === version._id ? "teal" : "gray"
                        }
                        justifyContent="flex-start"
                        onClick={() => handleVersionSelect(version)}
                      >
                        {getWaiverName(version)} {version.isActiveWaiver ? "(Active)" : ""}
                      </Button>
                      <IconButton
                        size="xs"
                        icon={<CloseIcon />}
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Delete waiver"
                        onClick={(e) => handleDeleteClick(e, version)}
                        isDisabled={version.isActiveWaiver}
                        opacity={0}
                        className="delete-icon"
                        transition="opacity 0.2s"
                      />
                    </Flex>
                    ))}
                    <Button
                      variant={!selectedVersion ? "solid" : "ghost"}
                      colorScheme={!selectedVersion ? "teal" : "gray"}
                      justifyContent="flex-start"
                      onClick={handleNewWaiver}
                      mt={4}
                      mb={2}
                    >
                      + New Waiver
                    </Button>
                  </Stack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            {/* Main Content */}
            <Flex
              direction={{ base: "column", "2xl": "row" }}
              gap={6}
              w="100%"
              padding="0"
              mt="2%"
              mr="1%"
              ml="1%"
              bg="#F5F5F5"
              borderRadius="md"
              p="5"
              boxShadow="sm"
              h="775px"
            >
              <Box flex={1}>
                <Heading fontSize="xl" fontWeight="bold" mb={3}>
                  Waiver Content
                </Heading>
                <Textarea
                  value={waiverContent}
                  onChange={(e) => {
                    setWaiverContent(e.target.value);
                    if (selectedVersion) setIsEditing(true);
                  }}
                  placeholder="Enter waiver content here..."
                  size="lg"
                  minH="300px"
                  resize="vertical"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px teal.500",
                  }}
                />
              </Box>

              <Box flex={1}>
                <Heading fontSize="xl" fontWeight="bold" mb={3}>
                  Acknowledgement
                </Heading>
                <Textarea
                  value={acknowledgement}
                  onChange={(e) => {
                    setAcknowledgement(e.target.value);
                    if (selectedVersion) setIsEditing(true);
                  }}
                  placeholder="Enter acknowledgement text here..."
                  size="lg"
                  minH="300px"
                  resize="vertical"
                  bg="white"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px teal.500",
                  }}
                />
              </Box>
            </Flex>
          </>
        )}
      </Flex>
      <Flex justifyContent="flex-end" gap={3} mt={4}>
        {selectedVersion ? (
          <>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleCancel}
              isDisabled={!isEditing}
            >
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={handleUpdateWaiver}
              isDisabled={!isEditing || !waiverContent || !acknowledgement}
            >
              Save Changes
            </Button>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => handleSetActive(selectedVersion)}
              isDisabled={selectedVersion.isActiveWaiver}
            >
              Set as Active
            </Button>
          </>
        ) : (
          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleSave}
            isDisabled={!waiverContent || !acknowledgement}
          >
            Save Waiver
          </Button>
        )}
      </Flex>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Waiver
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {waiverToDelete?.version && getWaiverName(waiverToDelete)}?
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
