"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  Textarea,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
  useDisclosure,
  Collapse,
  Icon,
} from "@chakra-ui/react";
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
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
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [waiverToDelete, setWaiverToDelete] = useState<IWaiverVersion | null>(
    null
  );
  const { isOpen: isSidebarOpen, onToggle: toggleSidebar } = useDisclosure({
    defaultIsOpen: true,
  });
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

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

  return (
    <Box className={styles.container}>
      <Flex gap={6} w="100%">
        {/* Floating Toggle Button */}
        <IconButton
          aria-label="Toggle sidebar"
          icon={isSidebarOpen ? <CloseIcon /> : <ChevronRightIcon />}
          onClick={toggleSidebar}
          position="fixed"
          left={isSidebarOpen ? "250px" : "0"}
          top="80px"
          zIndex={2}
          transition="left 0.2s"
          bg="white"
          _hover={{ bg: "gray.100" }}
          boxShadow="sm"
          borderRadius="0 4px 4px 0"
        />

        {/* Sidebar */}
        <Collapse in={isSidebarOpen} animateOpacity>
          <Box
            w="250px"
            borderRight="1px"
            borderColor="gray.200"
            pr={4}
            position="relative"
            mt="80px"
          >
            <Text fontSize="xl" fontWeight="bold" mb={4} pt={2}>
              Waiver Versions
            </Text>
            <Flex direction="column" gap={2}>
              <Button
                variant={!selectedVersion ? "solid" : "ghost"}
                colorScheme={!selectedVersion ? "teal" : "gray"}
                justifyContent="flex-start"
                onClick={handleNewWaiver}
                mb={2}
              >
                + New Waiver
              </Button>
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
                    Waiver v{version.version}
                  </Button>
                  <IconButton
                    size="xs"
                    icon={<CloseIcon />}
                    colorScheme="red"
                    variant="ghost"
                    aria-label="Delete waiver"
                    onClick={(e) => handleDeleteClick(e, version)}
                    opacity={0}
                    className="delete-icon"
                    transition="opacity 0.2s"
                  />
                </Flex>
              ))}
            </Flex>
          </Box>
        </Collapse>

        {/* Main Content */}
        <Flex
          direction="column"
          flex={1}
          gap={6}
          ml={isSidebarOpen ? "0" : "0"}
          w={isSidebarOpen ? "calc(100% - 250px)" : "100%"}
          transition="all 0.2s"
          mt="80px"
        >
          <Flex direction={{ base: "column", xl: "row" }} gap={6} w="100%">
            <Box flex={1}>
              <Text fontSize="xl" fontWeight="bold" mb={3}>
                Waiver Content
              </Text>
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
              <Text fontSize="xl" fontWeight="bold" mb={3}>
                Acknowledgement
              </Text>
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

          <Flex justifyContent="flex-end" gap={3}>
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
        </Flex>
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
              Are you sure you want to delete Waiver v{waiverToDelete?.version}?
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
