"use client";
import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import style from "@styles/admin/users.module.css";
import Link from "next/link";
import Image from "next/image";
import beaverLogo from "/docs/images/beaver-logo.svg";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { CSVLink } from "react-csv";
import { calcHours } from "../../lib/hours";

interface IUser {
  _id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  role: "user" | "supervisor" | "admin";
  eventsAttended: string[];
  digitalWaiver: string | null;
  groupId: string | null;
}

// Extending IUser to include totalHours for component state
interface IUserWithHours extends IUser {
  totalHours?: number;  // Marking as optional since it's computed dynamically
}

const UserList = () => {
  const [users, setUsers] = useState<IUserWithHours[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("firstName");
  const [loading, setLoading] = useState(true);

  const tableSize = useBreakpointValue({ base: "sm", md: "md" });

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const usersWithHours = await Promise.all(data.users.map(async (user: IUser) => {
        const events = await Promise.all(user.eventsAttended.map(async eventId => {
          try {
            const eventResponse = await fetch(`/api/events/${eventId}`);
            if (!eventResponse.ok) {
              console.error(`Failed to fetch event with ID ${eventId}`);
              return null;
            }
            return await eventResponse.json();
          } catch (error) {
            console.error(`Error fetching event with ID ${eventId}:`, error);
            return null;
          }
        }));
        const validEvents = events.filter(event => event);  
        console.log(`Events for ${user.firstName}:`, user.eventsAttended);
        const totalHours = calcHours(validEvents);
        console.log(`hours calculated${user.firstName}:`, totalHours);
        return { ...user, totalHours };
      }));
      setUsers(usersWithHours || []);
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
    { label: "Total Hours", key: "totalHours" }  
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
          <CSVLink data={filteredUsers} headers={headers} className={style.yellowButton}>
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
                  <Td>{user.totalHours}</Td>
                  <Td>
                    <Link
                      href={`/user/${user._id}`}
                      className={style.viewDetails}
                    >
                      View Details
                    </Link>
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
