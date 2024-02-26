"use client";
import { Table, Thead, Tbody, Tr, Th, Td, Box, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import style from "@styles/admin/users.module.css";
import Link from "next/link";
import Image from "next/image";
import beaverLogo from '/docs/images/beaver-logo.svg';

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
  const [users, setUsers] = useState<IUser[]>([]);
  const [sortOrder, setSortOrder] = useState("earliest");
  const [searchTerm, setSearchTerm] = useState("");

  const tablePadding = useBreakpointValue({ base: "0", md: "4" });

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

  return (
    <div className={style.mainContainer}>
      <div className={style.tableContainer}>
        <div className={style.buttonContainer}>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={style.sortSelect}
          >
            <option value="earliest">Earliest First</option>
            <option value="latest">Latest First</option>
          </select>
          <input
            type="text"
            placeholder="Search for user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={style.searchBar}
          />
        </div>
        <Box overflowX="auto">
          <Table variant="striped" size="sm">
            <Tbody>
              {users.map((user) => (
                <Tr key={user._id}>
                  <Td><Image src={beaverLogo} alt="profile picture" width="50" height="30" style={{ minWidth: '50px' }}/></Td>
                  <Td padding={tablePadding}>{`${user.firstName} ${user.lastName}`}</Td>
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
