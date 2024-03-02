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
import {CSVLink } from "react-csv"

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
  //states
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("firstName");
  const [loading, setLoading] = useState(true);

  // table format
  const tableSize = useBreakpointValue({ base: "sm", md: "md" });

  // fetch users from route
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users || []);
      setLoading(false); // Set loading to false after fetching data
    } catch (error) {
      console.error(error);
      setLoading(false); // Ensure loading is set to false even if an error occurs
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // filter users based on filter settings
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

  //return a loading message while waiting to fetch users
  if (loading) {
    return (
      <Text fontSize="lg" textAlign="center">
        Loading users...
      </Text>
    );
  }

  return (
    <div className={style.mainContainer}>
      <div className={style.tableContainer}>
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
            <CSVLink data={filteredUsers} className={style.yellowButton}>Export To CSV</CSVLink>
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
        <Box overflowX="auto">
          <Table variant="striped" size={tableSize}>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={user._id}>
                  <Td>
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
