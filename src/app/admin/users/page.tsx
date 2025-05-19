'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  Text,
  Spacer,
  Button,
  Wrap,
  WrapItem,
  Input,
  Checkbox,
} from '@chakra-ui/react';
import style from '@styles/admin/users.module.css';
import Select from 'react-select';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { CSVLink } from 'react-csv';
import SingleVisitorComponent from '@components/SingleVisitorComponent';
import { Schema } from 'mongoose';
import ViewGroups from 'app/components/ViewGroups';
import { useUsers } from 'app/lib/swrfunctions';
import '../../fonts/fonts.css';
import { getUserDbData } from 'app/lib/authentication';

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
  role: 'user' | 'supervisor' | 'admin' | 'guest' | 'super-admin';
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

const editRoleName = (str: string): string => {
  return str === 'super-admin'
    ? 'Super Admin'
    : str.charAt(0).toUpperCase() + str.slice(1);
};

const UserList = () => {
  // states
  const [allUsers, setUsers] = useState<IUserWithHours[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUserWithHours[]>([]);
  const { users, isLoading, isError } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState<{
    value: string;
    label: string;
  }>({
    value: 'name',
    label: 'Name',
  });
  const [adminData, setAdminData] = useState<IUser>();
  const [sortOrder, setSortOrder] = useState<{ value: string; label: string }>({
    value: 'firstName',
    label: 'First Name',
  });
  const [isReverseSort, setIsReverseSort] = useState(false);
  const [loading, setLoading] = useState(true);
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const [page, setPage] = useState(0);
  const userLimit = 15;

  // calculate hours for each event in user schema
  const calculateTotalHours = (events: AttendedEventInfo[]): number => {
    return events.reduce((total, event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
  };

  // fetch event name for each user based on event id
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
      console.error('Failed to fetch event name:', error);
      return 'Unknown Event';
    }
  };

  // fetch allUsers from db
  const fetchUsers = async () => {
    if (!users) {
      return;
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
      console.error('Error fetching allUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdminData();
  }, []);

  const getAdminData = async () => {
    try {
      const userRes = await getUserDbData();
      if (userRes) {
        const userData = JSON.parse(userRes);
        setAdminData(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }
    fetchUsers();
  }, [isError, isLoading]);

  useEffect(() => {
    setFilteredUsers(
      allUsers
        .filter((user) =>
          searchOption.value === 'name'
            ? `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(
                searchTerm.toLowerCase()
              )
            : searchOption.value === 'email'
              ? `${user.email.toLowerCase()}`.includes(searchTerm.toLowerCase())
              : searchOption.value === 'role'
                ? `${user.role.toLowerCase()}`.includes(
                    searchTerm.toLowerCase()
                  )
                : `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(
                    searchTerm.toLowerCase()
                  )
        )
        .sort((a, b) =>
          sortOrder.value === 'firstName'
            ? isReverseSort
              ? b.firstName.localeCompare(a.firstName)
              : a.firstName.localeCompare(b.firstName)
            : sortOrder.value === 'lastName'
              ? isReverseSort
                ? b.lastName.localeCompare(a.lastName)
                : a.lastName.localeCompare(b.lastName)
              : sortOrder.value === 'email'
                ? isReverseSort
                  ? b.email.localeCompare(a.email)
                  : a.email.localeCompare(b.email)
                : sortOrder.value === 'totalHours'
                  ? isReverseSort
                    ? a.totalHoursFormatted.localeCompare(b.totalHoursFormatted)
                    : b.totalHoursFormatted.localeCompare(a.totalHoursFormatted)
                  : sortOrder.value === 'role'
                    ? isReverseSort
                      ? b.role.localeCompare(a.role)
                      : a.role.localeCompare(b.role)
                    : a.firstName.localeCompare(b.firstName)
        )
    );
  }, [allUsers, searchTerm, sortOrder, isReverseSort, searchOption]);

  const sortOptions = [
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'totalHours', label: 'Total Hours' },
    { value: 'role', label: 'Role' },
  ];

  const searchOptions = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' },
  ];

  const removeUser = (userId: string) => {
    const newUsers = allUsers.filter((user) => user._id != userId);
    setUsers(newUsers);
  };

  const csvData = allUsers.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    zipcode: user.zipcode,
    receivesNewsletter: user.receiveNewsletter ? 'Yes' : 'No',
    age: user.age !== undefined ? user.age : 'Unknown',
    gender: user.gender || 'Unknown',
    role: editRoleName(user.role),
    eventsAttended:
      user.eventsAttendedNames.length > 0
        ? user.eventsAttendedNames.join(', ')
        : 'None',
    eventsAttendedCount: user.eventsAttendedNames.length,
    totalHoursFormatted: user.totalHoursFormatted,
  }));

  const headers = [
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Email', key: 'email' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Zipcode', key: 'zipcode' },
    { label: 'Receives Newsletter', key: 'receivesNewsletter' },
    { label: 'Age', key: 'age' },
    { label: 'Gender', key: 'gender' },
    { label: 'Role', key: 'role' },
    { label: 'Events Attended', key: 'eventsAttended' },
    { label: 'Number of Events Attended', key: 'eventsAttendedCount' },
    { label: 'Total Hours', key: 'totalHoursFormatted' },
  ];

  if (isError) {
    return (
      <Text fontFamily="Lato" fontSize="2xl" mt="5%" textAlign="center">
        Error Loading Data
      </Text>
    );
  }

  if ((isLoading || loading) && !isError) {
    return (
      <Text fontFamily="Lato" fontSize="2xl" mt="5%" textAlign="center">
        Loading Users...
      </Text>
    );
  }

  return (
    <div className={style.mainContainer}>
      <div className={style.buttonContainer}>
        <div className={style.inputContainer}>
          <div className={style.orderByContainer}>
            <Text>Order By:</Text>
            <Select
              id="sort-select"
              placeholder="Sort Order"
              options={sortOptions}
              className={style.selectContainer}
              onChange={(selectedOption) =>
                setSortOrder(
                  selectedOption || { value: 'firstName', label: 'First Name' }
                )
              }
              isClearable={false}
              isSearchable={false}
              value={sortOrder}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderRadius: '12px',
                  width: '150px',
                  height: '40px',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'black',
                }),
                option: (provided, state) => ({
                  ...provided,
                  color: state.isSelected ? 'white' : 'black',
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: 'black',
                }),
              }}
            />
            <Checkbox onChange={() => setIsReverseSort(!isReverseSort)}>
              Reversed?
            </Checkbox>
          </div>
          <div className={style.searchContainer}>
            <Text>Search By:</Text>
            <Select
              id="search-select"
              placeholder="Search Term"
              options={searchOptions}
              className={style.selectContainer}
              onChange={(selectedOption) =>
                setSearchOption(
                  selectedOption || { value: 'name', label: 'Name' }
                )
              }
              isClearable={false}
              isSearchable={false}
              value={searchOption}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderRadius: '12px',
                  height: '40px',
                  width: '150px',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'black',
                }),
                option: (provided, state) => ({
                  ...provided,
                  color: state.isSelected ? 'white' : 'black',
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: 'black',
                }),
              }}
            />
            <div className={style.searchWrapper}>
              <Input
                type="text"
                placeholder={`Search ${searchOption.label}`}
                border="1.5px solid #337774"
                _hover={{ borderColor: '#337774' }}
                focusBorderColor="#337774"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={style.searchBar}
              />
              <MagnifyingGlassIcon
                style={{
                  width: '20px',
                  height: '20px',
                  position: 'absolute',
                  margin: 'auto',
                  top: 0,
                  bottom: 0,
                  right: '10px',
                  color: '#337774',
                }}
              />
            </div>
          </div>
        </div>
        <div className={style.innerButtons}>
          <div className={style.viewGroupsContainer}>
            <ViewGroups />
          </div>
          <CSVLink
            data={csvData}
            headers={headers}
            filename="user-data.csv"
            className={style.yellowButton}
            target="_blank"
          >
            Export to CSV
          </CSVLink>
        </div>
      </div>
      <div className={style.tableContainer}>
        {/* {isLoading && !users  && !isError && <div>Loading...</div>}
        {isError && <div>Error occurred.</div>}
                 */}
        <Box>
          <Table
            variant="striped"
            size={tableSize}
            className={style.customTable}
          >
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Total Hours</Th>
                <Th>Role</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.length === 0 ? (
                <Tr>
                  <Td colSpan={5} textAlign="center">
                    No Users Found
                  </Td>
                </Tr>
              ) : (
                filteredUsers
                  .slice(page * userLimit, (page + 1) * userLimit)
                  .map((user) => (
                    <Tr key={user._id}>
                      <Td>{`${user.firstName} ${user.lastName}`}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.totalHoursFormatted}</Td>

                      <Td>{editRoleName(user.role)}</Td>
                      <Td>
                        <SingleVisitorComponent
                          visitorData={user}
                          removeFunction={removeUser}
                          adminData={adminData}
                        />
                      </Td>
                    </Tr>
                  ))
              )}
            </Tbody>
          </Table>
        </Box>
      </div>
      <div className={style.pageCountContainer}>
        <Button
          className={style.pageButton}
          isDisabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Text fontSize={['xl', 'xl', '2xl']} fontWeight="light" color="black">
          Page {page + 1}
        </Text>
        <Button
          className={style.pageButton}
          isDisabled={(page + 1) * userLimit >= filteredUsers.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UserList;
