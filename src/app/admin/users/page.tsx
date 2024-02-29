"use client";
import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import style from "@styles/admin/users.module.css";
import Link from "next/link";
import Image from "next/image";
import beaverLogo from "/docs/images/beaver-logo.svg";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

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

  const tablePadding = useBreakpointValue({ base: "0", md: "0" });

  // fetch users from route
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // filter user list based on settings
  const filteredUsers = users
    .filter((user) =>
      (
        user.firstName.toLowerCase() +
        " " +
        user.lastName.toLowerCase()
      ).includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "firstName") {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return a.lastName.localeCompare(b.lastName);
      }
    });

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
            <button className={style.yellowButton}>Export To CSV</button> {}
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
          <Table variant="striped" size="sm">
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
                  <Td
                    padding={tablePadding}
                  >{`${user.firstName} ${user.lastName}`}</Td>
                  <Td padding={tablePadding}>{user.email}</Td>
                  <Td>
                    <Link href={""} className={style.viewDetails}>
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
