"use client";
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import style from "@styles/admin/events.module.css";

interface IUser {
  _id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  role: "user" | "supervisor" | "admin";
  eventsAttended: [string];
  digitalWaiver: string | null;
  groupId: string | null;
}

const UserList = () => {
  // states
  const [users, setEvents] = useState<IUser[]>([]);

  // get all users from route
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      console.log("Fetched data:", data);

      const usersArray = data.users || [];
      setEvents(usersArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box className={style.mainContainer}>
      <Table variant="simple">
        <Tbody>
          {users.map((user) => (
            <Tr key={user._id}>
              <Td>{`${user.firstName} ${user.lastName}`}</Td>
              <Td>{user.email}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserList;
