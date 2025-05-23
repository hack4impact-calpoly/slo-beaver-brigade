'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  Icon,
  Center,
} from '@chakra-ui/react';
import styles from '../styles/admin/editEvent.module.css';
import { IUser } from '@database/userSchema';
import { IEvent } from 'database/eventSchema';
import { eventIndividualHours } from '.././lib/hours';
import { makeUserAdmin } from '../actions/makeUserAdmin';
import makeAdminUser from '../actions/makeAdminUser';
import DeleteConfirmation from './DeleteConfirmation';
import { PiKeyReturnLight } from 'react-icons/pi';

interface SingleVisitorComponentProps {
  visitorData: IUser;
  adminData?: IUser;
  removeFunction?: (userId: string) => void;
  open?: boolean;
}

function SingleVisitorComponent({
  visitorData,
  removeFunction,
  adminData,
  open = false,
}: SingleVisitorComponentProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClosed, setIsClosed] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(visitorData.role);

  useEffect(() => {
    if (open) {
      onOpen();
    }
  }, [open, onOpen]);

  useEffect(() => {
    if (isOpen) {
      const fetchEvents = async () => {
        setLoading(true);
        try {
          const eventIds = visitorData.eventsAttended.map((e) => e.eventId);
          const fetchedEvents = await Promise.all(
            eventIds.map((id, idx) =>
              fetch(`/api/events/${id}`)
                .then((res) => res.json())
                .then((data) => {
                  return {
                    ...data,
                    attendeeIds: data.attendeeIds || [],
                    startTime: visitorData.eventsAttended[idx].startTime,
                    endTime: visitorData.eventsAttended[idx].endTime,
                  };
                })
            )
          );
          setEvents(fetchedEvents);
        } catch (error) {
          console.error('Failed to fetch events:', error);
        }
        setLoading(false);
      };

      if (
        visitorData &&
        visitorData.eventsAttended &&
        visitorData.eventsAttended.length > 0
      ) {
        fetchEvents();
      }
    }
  }, [visitorData]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleRoleChange = async () => {
    try {
      const result =
        userRole === 'admin'
          ? await makeAdminUser(visitorData.email)
          : await makeUserAdmin(visitorData.email, 'admin');
      setUserRole(result.role);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleSuperAdminButton = async () => {
    try {
      const result = await makeUserAdmin(visitorData.email, 'super-admin');
      setUserRole(result.role);
    } catch (error) {
      console.error('Error making super admin: ', error);
    }
  };

  const closeFromChild = () => {
    onClose();
  };

  return (
    <>
      <div className={styles.link}>
        <Text onClick={onOpen} cursor="pointer">
          Details
        </Text>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          style={{ width: "60vw", height: "50vh", overflow: "auto" }}
          maxW="100rem"
        >
          <ModalHeader
            style={{
              padding: '1% 5%',
              textAlign: 'left',
              fontSize: '35px',
              fontWeight: 'bold',
              fontFamily: 'Lato',
              width: '100%',
            }}
          >
            <Flex direction="column" align="left" p={4}>
              <Text>
                {visitorData.firstName} {visitorData.lastName}
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <hr />
          <ModalBody
            style={{ display: 'flex', flexDirection: 'column', padding: '0%' }}
            className={styles.parentContainer}
          >
            <Box className={styles.infoBox}>
              <Text className={styles.visitorInfoSmallHeader}>
                Account Info
              </Text>
              <div style={{ display: 'flex' }} className={styles.accountInfo}>
                <div style={{ width: '45%' }}>
                  <Text className={styles.fieldInfo}>
                    <Text as="span" className={styles.boldText}>
                      Email
                    </Text>{' '}
                    <br></br> {visitorData.email ? visitorData.email : 'N/A'}
                  </Text>
                  <Text className={styles.fieldInfo}>
                    <Text as="span" className={styles.boldText}>
                      Zipcode
                    </Text>
                    <br></br>{' '}
                    {visitorData.zipcode ? visitorData.zipcode : 'N/A'}
                  </Text>
                </div>
                <div style={{ width: '45%' }}>
                  <Text className={styles.fieldInfo}>
                    <Text as="span" className={styles.boldText}>
                      Phone
                    </Text>{' '}
                    <br></br>{' '}
                    {visitorData.phoneNumber ? visitorData.phoneNumber : 'N/A'}
                  </Text>
                  <Text className={styles.fieldInfo}>
                    <Text as="span" className={styles.boldText}>
                      Receive Newsletter
                    </Text>{' '}
                    <br></br> {visitorData.receiveNewsletter ? 'Yes' : 'No'}
                  </Text>
                </div>
              </div>
            </Box>
            <Box className={styles.infoBox}>
              <Text className={styles.visitorInfoSmallHeader}>
                Events Attendeded
              </Text>
              {events.length > 0 ? (
                <div className={styles.tableContainer}>
                  <Table variant="striped">
                    <Thead>
                      <Tr>
                        <Th>Event Name</Th>
                        <Th>Duration</Th>
                        <Th>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {events.map((event) => {
                        return (
                          <Tr key={event._id}>
                            <Td>{event.eventName}</Td>
                            <Td>{eventIndividualHours(event)}</Td>
                            <Td>{formatDate(event.startTime)}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </div>
              ) : (
                <Text
                  className={styles.fieldInfo}
                  style={{ textAlign: 'center' }}
                >
                  <Text as="span" className={styles.boldText}>
                    No Events Attended
                  </Text>
                </Text>
              )}
            </Box>
            <Flex direction="row" align="center" justify="center" gap={8} p={4}>
              {userRole !== 'guest' && (
                <>
                  {adminData?.role === 'super-admin' &&
                    userRole !== 'super-admin' && (
                      <Button
                        mt={2}
                        color="#337774"
                        bg="white"
                        border="2px"
                        _hover={{ bg: '#337774', color: 'white' }}
                        onClick={handleSuperAdminButton}
                      >
                        Make Super Admin
                      </Button>
                    )}
                  {userRole !== 'admin' && (
                    <Button
                      mt={2}
                      color="#337774"
                      bg="white"
                      border="2px"
                      _hover={{ bg: '#337774', color: 'white' }}
                      onClick={handleRoleChange}
                    >
                      Make Admin
                    </Button>
                  )}
                  {userRole !== 'user' && (
                    <Button
                      mt={2}
                      bg="#E0AF48"
                      color="black"
                      _hover={{ bg: '#C19137', color: 'black' }}
                      onClick={handleRoleChange}
                    >
                      Revert to User
                    </Button>
                  )}
                </>
              )}
              <DeleteConfirmation
                closeFromChild={closeFromChild}
                userData={visitorData}
                isSelf={false}
                removeFunction={removeFunction}
              >
                {' '}
              </DeleteConfirmation>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SingleVisitorComponent;
