"use client";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Box,
  IconButton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Select,
  Checkbox,
  Input,
  useToast,
  Divider,
} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import style from "@styles/admin/users.module.css";
import { useGroups, useUsers } from "app/lib/swrfunctions";
import { IGroup } from "database/groupSchema";
import { IUser } from "database/userSchema";
import { addToGroup, removeFromGroup } from "app/actions/useractions";
import { KeyedMutator } from "swr";
import { Tooltip} from "@chakra-ui/react";

type Props = {
  setImageURL: Dispatch<SetStateAction<string | null>>;
  setPreselected: Dispatch<SetStateAction<boolean>>;
};

const CreateGroupUserList = ({
  selectedUsers,
  setSelectedUsers,
  name,
}: {
  selectedUsers: string[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  name: string;
}) => {
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const { users, isLoading, isError } = useUsers();
  useEffect(() => {
    if (!isLoading) {
      const parsedUsers = users || [];
      setFilteredUsers(parsedUsers);
    }
  }, [isLoading, users]);

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }
    const filteredUsers = users
      ?.filter((user) =>
        `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(
          name.toLowerCase()
        )
      )
      .sort((a, b) => a.firstName.localeCompare(b.firstName));
    setFilteredUsers(filteredUsers || []);
  }, [isError, isLoading, name, users]);

  const onSelectUser = async (selected: boolean, userId: string) => {
    let updatedSelectedUsers;
    if (selected) {
      updatedSelectedUsers = [...selectedUsers, userId];
      setSelectedUsers(updatedSelectedUsers);
    } else {
      updatedSelectedUsers = selectedUsers.filter((id) => id !== userId);
      setSelectedUsers(updatedSelectedUsers);
    }
  };

  const isUserInGroup = (id: string) => {
    return selectedUsers.includes(id);
  };

  return (
    <TableContainer overflow="auto">
      <Table variant="simple" overflow="auto">
        <Thead>
          <Tr>
            <Th>In group</Th>
            <Th>Name</Th>
            <Th>Email</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading && !users && !isError && (
            <Tr>
              <Td>Loading...</Td>
            </Tr>
          )}
          {isError && (
            <Tr>
              <Td>Error occurred.</Td>
            </Tr>
          )}
          {filteredUsers &&
            filteredUsers.map((user) => (
              <Tr key={user._id}>
                <Td>
                  <Checkbox
                    onChange={(e) => onSelectUser(e.target.checked, user._id)}
                    isChecked={isUserInGroup(user._id)}
                  />
                </Td>
                <Td>{user.firstName + " " + user.lastName}</Td>
                <Td>{user.email}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
export const CreateTemporaryGroup = ({
  groups,
  setGroups,
  mutate,
}: {
  groups: IGroup[];
  setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
  mutate: KeyedMutator<IGroup[]>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [filterName, setFilterName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    setSelectedUsers(groups.flatMap((group) => group.groupees));
  }, [groups]);

  const createGroup = async () => {
    const group = {
      group_name: "PrivateEvent" + new Date().toISOString() + "_group",
      groupees: selectedUsers,
      temporary: true,
    };
    const res = await fetch("/api/group", {
      method: "POST",
      body: JSON.stringify(group),
    });
    if (res.ok) {
      setSelectedUsers([]);
      const data = await res.json();
      mutate(
        (groups) => {
          if (groups) {
            return [...groups, data];
          }
        },
        { revalidate: false }
      );
      setGroups((groups) => [...groups, data]);

      onClose();
    } else {
      toast({
        title: "Failed to Create Temporary Group",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button bg="#e0af48" variant="outline" color="white" onClick={onOpen}  _hover={{ bg: "#c68c2b", color: "white" }}>
        Invite Users
      </Button>

      <Modal
        scrollBehavior="inside"
        isOpen={isOpen}
        onClose={onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent maxW="80vw">
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <div className="flex flex-col">
                <Input
                  width={["200px", "200px", "300px"]}
                  marginLeft="5"
                  marginTop="6"
                  className="ml-5 mt-6 w-[50%]"
                  value={filterName}
                  onChange={(e) => setFilterName(e.currentTarget.value)}
                  placeholder="Search by name:"
                ></Input>
              </div>
              <CreateGroupUserList
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                name={filterName}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Tooltip label="Please select at least one user">
                <Button onClick={createGroup} colorScheme="blue" isDisabled={selectedUsers.length === 0}>
                Create
                </Button>
            </Tooltip>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const CreateGroup = ({ mutate }: { mutate: KeyedMutator<IGroup[]> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [groupName, setGroupName] = useState<string>("");
  const [filterName, setFilterName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const createGroup = async () => {
    const group = {
      group_name: groupName,
      groupees: selectedUsers,
    };
    const res = await fetch("/api/group", {
      method: "POST",
      body: JSON.stringify(group),
    });
    if (res.ok) {
      toast({
        title: "Group Created",
        description: "The new group has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      mutate();
      setGroupName("");
      setSelectedUsers([]);
      onClose();
    } else {
      toast({
        title: "Failed to Create Group",
        description: "Failed to Create Group",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button variant="ghost" onClick={onOpen}>
        Create Group
      </Button>

      <Modal
        scrollBehavior="inside"
        isOpen={isOpen}
        onClose={onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent maxW="80vw">
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <div className="flex flex-col">
                <Input
                  width={["200px", "200px", "300px"]}
                  marginLeft="5"
                  marginTop="6"
                  className="ml-5 mt-6 w-[50%]"
                  value={groupName}
                  onChange={(e) => setGroupName(e.currentTarget.value)}
                  placeholder="Enter group name:"
                ></Input>
                <Input
                  width={["200px", "200px", "300px"]}
                  marginLeft="5"
                  marginTop="6"
                  className="ml-5 mt-6 w-[50%]"
                  value={filterName}
                  onChange={(e) => setFilterName(e.currentTarget.value)}
                  placeholder="Search by name:"
                ></Input>
              </div>
              <CreateGroupUserList
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                name={filterName}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>

            <Button onClick={createGroup} variant="ghost">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const EditUserList = ({
  group,
  mutate,
  name,
}: {
  group: IGroup;
  mutate: KeyedMutator<IGroup[]>;
  name: string;
}) => {
  const [filteredUsers, setFilteredUsers] = useState<IUser[] | null>(null);
  const { users, isLoading, isError } = useUsers();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (group.groupees) {
      setSelectedUsers(group.groupees);
    }
  }, [group.groupees]);

  useEffect(() => {
    if (!isLoading) {
      const parsedUsers = users || [];
      setFilteredUsers(parsedUsers);
    }
  }, [isLoading, users]);

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }
    const filteredUsers = users
      ?.filter((user) =>
        `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(
          name.toLowerCase()
        )
      )
      .sort((a, b) => a.firstName.localeCompare(b.firstName));
    setFilteredUsers(filteredUsers || []);
  }, [isError, isLoading, name, users]);

  const onSelectUser = async (selected: boolean, userId: string) => {
    let updatedSelectedUsers;
    if (selected) {
      updatedSelectedUsers = [...selectedUsers, userId];
      setSelectedUsers(updatedSelectedUsers);
      await addToGroup(group._id, userId);
      mutate();
    } else {
      updatedSelectedUsers = selectedUsers.filter((id) => id !== userId);
      setSelectedUsers(updatedSelectedUsers);
      await removeFromGroup(group._id, userId);
      mutate();
    }
  };

  const isUserInGroup = (id: string) => {
    return selectedUsers.includes(id);
  };

  if (!group.groupees) {
    return <h1>This group does not allow groupees.</h1>;
  }

  return (
    <TableContainer overflow="auto">
      <Table variant="simple" overflow="auto">
        <Thead>
          <Tr>
            <Th>In group</Th>
            <Th>Name</Th>
            <Th>Email</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading && !users && !isError && (
            <Tr>
              <Td>Loading...</Td>
            </Tr>
          )}
          {isError && (
            <Tr>
              <Td>Error occurred.</Td>
            </Tr>
          )}
          {filteredUsers &&
            filteredUsers.map((user) => (
              <Tr key={user._id}>
                <Td>
                  <Checkbox
                    onChange={(e) => onSelectUser(e.target.checked, user._id)}
                    isChecked={isUserInGroup(user._id)}
                  />
                </Td>
                <Td>{user.firstName + " " + user.lastName}</Td>
                <Td>{user.email}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const EditGroup = ({
  group,
  isOpen,
  setOpen,
  mutate,
}: {
  group: IGroup | null;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: KeyedMutator<IGroup[]>;
}) => {
  const [filterName, setFilterName] = useState<string>("");
  const toast = useToast();
  const { onOpen, onClose } = useDisclosure();
  if (!group) {
    return;
  }

  const deleteGroup = async () => {
    const res = await fetch("/api/group/" + group._id, { method: "DELETE" });
    if (res.ok) {
      toast({
        title: "Group Removed",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      mutate();
      setOpen(false);
    } else {
      toast({
        title: "Failed to Remove Group",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setOpen(false)} size={"xl"}>
        <ModalOverlay />
        <ModalContent maxW="80vw" overflowY="auto">
          <ModalHeader>Editing {group.group_name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              width={["200px", "200px", "300px"]}
              marginLeft="5"
              marginTop="6"
              className="ml-5 mt-6 w-[50%]"
              value={filterName}
              onChange={(e) => setFilterName(e.currentTarget.value)}
              placeholder="Search by name:"
            ></Input>
            <EditUserList group={group} mutate={mutate} name={filterName} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="ghost" onClick={deleteGroup}>
              Delete Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// TODO: add parent that loads images and passes to selector

export default function ViewGroups() {
  const { groups, isLoading, isError, mutateGroups } = useGroups();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openEditGroup, setOpenEditGroup] = useState(false);
  const [editGroup, setEditGroup] = useState<IGroup | null>(null);

  const onGroupClick = (group: IGroup) => {
    setEditGroup(group);
    setOpenEditGroup(true);
  };
  return (
    <>
      <EditGroup
        group={editGroup}
        setOpen={setOpenEditGroup}
        isOpen={openEditGroup}
        mutate={mutateGroups}
      />
      <Box onClick={onOpen}>
        <Button
          bg="#337774"
          color="white"
          _hover={{ bg: "#4a9b99" }}
          //padding={"0px 20px"}
          borderRadius={"12px"}
          fontWeight={"bold"}
        >
          <Text>View Groups</Text>
        </Button>
      </Box>

      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Groups</ModalHeader>

          <Divider className="mb-5" />
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col justify-start">
              {isLoading && !groups && <div>Loading...</div>}
              {isError && <div>Error occurred getting groups.</div>}
              {!isError &&
                groups &&
                groups.map((group) => {
                  return (
                    <h2
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        onGroupClick(group);
                      }}
                      key={group._id}
                    >
                      {group.group_name}
                    </h2>
                  );
                })}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <CreateGroup mutate={mutateGroups} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
