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
import ViewGroups from "app/components/ViewGroups";
import { useUsers } from "app/lib/swrfunctions";

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
  receiveNewsletter: boolean;
  zipcode: string;
}

export interface IUserWithHours extends IUser {
  totalHoursFormatted: string;
  eventsAttendedNames: string[];
}

// format hours
const formatHours = (hours: number): string => {
  const totalMinutes = Math.floor(hours * 60);
  const displayHours = Math.floor(totalMinutes / 60);
  const displayMinutes = totalMinutes % 60;
  return `${displayHours}h ${displayMinutes}min`;
};

const UserList = () => {
  // states
  const [customUser, setUsers] = useState<IUserWithHours[]>([]);
  const {users, isLoading, isError} = useUsers()
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("firstName");
  const [loading, setLoading] = useState(true);
  const tableSize = useBreakpointValue({ base: "sm", md: "md" });

  // calculate hours for each event in user schema
  const calculateTotalHours = (events: AttendedEventInfo[]): number => {
    return events.reduce((total, event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      console.log(event.startTime, event.endTime, total)
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
  };

  //fetch event name for each user based on event id
  const fetchEventName = async (
    eventId: Schema.Types.ObjectId
  ): Promise<string> => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch event details: ${response.statusText}`
        );
      }
      const event = await response.json();
      return event.eventName;
    } catch (error) {
      console.error("Failed to fetch event name:", error);
      return "Unknown Event";
    }
  };

  // fetch customUser from db
  const fetchUsers = async () => {
   
    if (!users){
        return
    }
    try {

      const usersWithEventNames = await Promise.all(
        users.map(async (user: IUser) => {
          const eventsAttendedNames = await Promise.all(
            user.eventsAttended.map((event) => fetchEventName(event.eventId))
          );

          return {
            ...user,
            totalHoursFormatted: formatHours(
              calculateTotalHours(user.eventsAttended)
            ),
            eventsAttendedNames,
          };
        })
      );

      setUsers(usersWithEventNames as IUserWithHours[]);
    } catch (error) {
      console.error("Error fetching customUser:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading || isError){
            return;
        }
    fetchUsers();
  }, [isError, isLoading]);

  const filteredUsers = customUser
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


  const csvData = customUser.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    zipcode: user.zipcode,
    eventsAttended:
      user.eventsAttendedNames.length > 0
        ? user.eventsAttendedNames.join(", ")
        : "None",
    eventsAttendedCount: user.eventsAttendedNames.length,
    totalHoursFormatted: user.totalHoursFormatted,
  }));

  const headers = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Zipcode", key: "zipcode" },
    { label: "Events Attended", key: "eventsAttended" },
    { label: "Number of Events Attended", key: "eventsAttendedCount" },
    { label: "Total Hours", key: "totalHoursFormatted" },
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
            data={csvData}
            headers={headers}
            filename="user-data.csv"
            className={style.yellowButton}
            target="_blank"
          >
            Export To CSV
          </CSVLink>
          <ViewGroups/>
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
        {/* {isLoading && !users  && !isError && <div>Loading...</div>}
        {isError && <div>Error occurred.</div>} */}
        <Box>
          <Table variant="striped" size={tableSize}>
            <Tbody>
               {filteredUsers.length === 0 ? (
                <Tr>
                  <Td colSpan={5} textAlign="center">
                    {isLoading && 'Loading...'}
                    {isError && 'Error occurred.'}
                    {!isLoading && !isError  && !loading && 'No users found.'}
                  </Td>
                </Tr>
              ) : (
                filteredUsers.map((user) => (
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
                      <SingleVisitorComponent visitorData={user} />
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      
      </div>
    </div>
  );
};

export default UserList;
