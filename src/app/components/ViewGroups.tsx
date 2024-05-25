'use client'
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Text,  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Box, IconButton, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Select, Checkbox, Input, useToast, Divider } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import style from "@styles/admin/users.module.css"
import { useGroups, useUsers } from "app/lib/swrfunctions";
import { IGroup } from "database/groupSchema";
import { IUser } from "database/userSchema";
import { addToGroup, removeFromGroup } from "app/actions/useractions";
import { KeyedMutator } from "swr";


type Props = {
    setImageURL: Dispatch<SetStateAction<string | null>>, 
    setPreselected: Dispatch<SetStateAction<boolean>>, 

}




const CreateGroupUserList = ({ selectedUsers, setSelectedUsers }: {selectedUsers: string[], setSelectedUsers:React.Dispatch<React.SetStateAction<string[]>> }) => {
    const { users, isLoading, isError } = useUsers();

    const onSelectUser = async (selected: boolean, userId: string) => {
        let updatedSelectedUsers;
        if (selected) {
            updatedSelectedUsers = [...selectedUsers, userId];
            setSelectedUsers(updatedSelectedUsers);
        } else {
            updatedSelectedUsers = selectedUsers.filter(id => id !== userId);
            setSelectedUsers(updatedSelectedUsers);
        }
    };

    const isUserInGroup = (id: string) => {
        return selectedUsers.includes(id);
    };

     return (
        <TableContainer overflow="auto">
            <Table variant='simple' overflow="auto">
                <Thead>
                    <div className="ml-5 mt-6">
                        Add users to group:
                    </div>
                    <Tr>
                        <Th>In group</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {isLoading && !users && !isError && <Tr><Td>Loading...</Td></Tr>}
                    {isError && <Tr><Td>Error occurred.</Td></Tr>}
                    {users && users.map((user) => (
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

const CreateGroup = ({ mutate }: { mutate: KeyedMutator<IGroup[]>}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();

    const [groupName, setGroupName]  = useState<string>("")
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
 
    const createGroup = async () => {
        const group = {
            group_name: groupName,
            groupees: selectedUsers
        }
        const res = await fetch("/api/group", {method: "POST", body: JSON.stringify(group)})
        if (res.ok){
            toast({
                    title: "Group Created",
                    description: "The new group has been successfully created.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                mutate()
                setGroupName("")
                setSelectedUsers([])
                onClose()
            }
        else{
            toast({
                    title: "Failed to Create Group",
                    description: "Failed to Create Group",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
        }

    }
    return (
      <>
        <Button
            variant="ghost"
          onClick={onOpen}
        >
              Create Group
        </Button>

  
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Create Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody >
                <Input value={groupName} onChange={(e) => setGroupName(e.currentTarget.value)} placeholder="Enter group name:"></Input>
                <CreateGroupUserList selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/>
            </ModalBody>
            <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
            </Button>
            <Button onClick={createGroup} variant='ghost'>Create</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>


      </>
    )
}

const EditUserList = ({ group, mutate }: {group: IGroup, mutate: KeyedMutator<IGroup[]>}) => {
    const { users, isLoading, isError } = useUsers();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => {
        if (group.groupees) {
            setSelectedUsers(group.groupees);
        }
    }, [group.groupees]);

    const onSelectUser = async (selected: boolean, userId: string) => {
        let updatedSelectedUsers;
        if (selected) {
            updatedSelectedUsers = [...selectedUsers, userId];
            setSelectedUsers(updatedSelectedUsers);
            await addToGroup(group._id, userId);
            mutate()
        } else {
            updatedSelectedUsers = selectedUsers.filter(id => id !== userId);
            setSelectedUsers(updatedSelectedUsers);
            await removeFromGroup(group._id, userId);
            mutate()
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
            <Table variant='simple' overflow="auto">
                <Thead>
                    <Tr>
                        <Th>In group</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {isLoading && !users && !isError && <Tr><Td>Loading...</Td></Tr>}
                    {isError && <Tr><Td>Error occurred.</Td></Tr>}
                    {users && users.map((user) => (
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


const EditGroup = ({group, isOpen, setOpen, mutate} : {group: IGroup | null, isOpen: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, mutate: KeyedMutator<IGroup[]>}) => {

    const {onOpen, onClose } = useDisclosure()
    if (!group){
        return
    }
 
    return (
      <>

        <Modal isOpen={isOpen} onClose={() => setOpen(false)} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Editing {group.group_name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody >
                <EditUserList group={group} mutate={mutate}/>
            </ModalBody>
            <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => setOpen(false)}>
                Close
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>


      </>
    )
}

// TODO: add parent that loads images and passes to selector

export default function ViewGroups() {

    const {groups, isLoading, isError, mutate} = useGroups()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [openEditGroup, setOpenEditGroup] = useState(false)
    const [editGroup, setEditGroup] = useState<IGroup | null>(null)
 
    const onGroupClick = (group: IGroup) => {
        setEditGroup(group)
        setOpenEditGroup(true)
    }
    return (
      <>
      <EditGroup group={editGroup} setOpen={setOpenEditGroup} isOpen={openEditGroup} mutate={mutate}/>
    <Box
          className={style.yellowButton}
          onClick={onOpen}
        >
              <Text>View Groups</Text>
        </Box>

  
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Groups</ModalHeader>

            <Divider className="mb-5" />
            <ModalCloseButton />
            <ModalBody >

                <div className="flex flex-col justify-start">

                {isLoading && !groups && <div>Loading...</div> }
                {isError && <div>Error occurred getting groups.</div>}
                {!isError && groups && groups.map((group) => {
                    return <h2 className="cursor-pointer hover:underline" onClick={() => {onGroupClick(group)}} key={group._id}>{group.group_name}</h2>
                })}
                </div>
            </ModalBody>
            <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
            </Button>
            <CreateGroup mutate={mutate}/>
            </ModalFooter>
        </ModalContent>
        </Modal>


      </>
    )
}

