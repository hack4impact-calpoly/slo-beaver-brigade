"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import style from "@styles/admin/users.module.css";
import Image from "next/image";
import beaverLogo from "/docs/images/beaver-logo.svg";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { CSVLink } from "react-csv";
import SingleVisitorComponent from "@components/SingleVisitorComponent";
import { Schema } from "mongoose";

export interface EventInfo {
  eventId: Schema.Types.ObjectId;
  digitalWaiver: Schema.Types.ObjectId | null;
}

export interface AttendedEventInfo {
  eventId: Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
}

export interface IUser {
  _id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  role: "user" | "supervisor" | "admin" | "guest";
  eventsRegistered: EventInfo[];
  eventsAttended: AttendedEventInfo[];
  groupId: Schema.Types.ObjectId | null;
  recieveNewsletter: boolean;
}

export interface IUserWithHours extends IUser {
  totalHoursFormatted: string;
}

const formatHours = (hours: number): string => {
  const totalMinutes = Math.floor(hours * 60); // Convert hours to total minutes
  const displayHours = Math.floor(totalMinutes / 60);
  const displayMinutes = totalMinutes % 60;
  return `${displayHours}h ${displayMinutes}min`; // Format string as "Xh Ymin"
};

const UserList = () => {
  const [users, setUsers] = useState<IUserWithHours[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("firstName");
  const [loading, setLoading] = useState(true);
  const tableSize = useBreakpointValue({ base: "sm", md: "md" });

  const calculateTotalHours = (events: AttendedEventInfo[]): number => {
    return events.reduce((total, event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
    }, 0);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const usersWithHours = data.users.map((user: IUser) => {
        const totalHours = calculateTotalHours(user.eventsAttended);
        return { ...user, totalHoursFormatted: formatHours(totalHours) };
      });
      setUsers(usersWithHours);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) =>
      `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(
        searchTerm.toLowerCase()
      )
    )
    .sort((a, b) =>
      sortOrder === "firstName"
        ? a.firstName.localeCompare(b.firstName)
        : a.lastName.localeCompare(b.lastName)
    );

  if (loading) {
    return (
      <Text fontSize="lg" textAlign="center">
        Loading users...
      </Text>
    );
  }

  const headers = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Total Hours", key: "totalHoursFormatted" }, // Adjust the key here
  ];

  return (
    <div className={style.mainContainer}>
      <div className={style.buttonContainer}>
        <div className={style.innerButtons}>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={style.filter}
          >
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
          </select>
          <CSVLink
            data={filteredUsers}
            headers={headers}
            className={style.yellowButton}
          >
            Export To CSV
          </CSVLink>
        </div>
        <div className={style.searchWrapper}>
          <input
            type="text"
            placeholder="Search for user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={style.searchBar}
          />
          <MagnifyingGlassIcon
            style={{
              width: "20px",
              height: "20px",
              position: "absolute",
              margin: "auto",
              top: 0,
              bottom: 0,
              right: "10px",
            }}
          />
        </div>
      </div>
      <div className={style.tableContainer}>
        <Box>
          <Table variant="striped" size={tableSize}>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={user._id}>
                  <Td className={style.mobileHide}>
                    <Image
                      src={beaverLogo}
                      alt="profile picture"
                      width="50"
                      height="30"
                      style={{ minWidth: "50px" }}
                    />
                  </Td>
                  <Td>{`${user.firstName} ${user.lastName}`}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.totalHoursFormatted}</Td>
                  <Td>
              <SingleVisitorComponent
              visitorData={user}/>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </div>
    </div>
  );
};

export default UserList;
