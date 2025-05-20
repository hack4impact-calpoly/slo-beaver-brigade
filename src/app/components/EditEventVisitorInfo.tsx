'use client';

import {
  Box,
  Spinner,
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import styles from '../styles/admin/editEvent.module.css';
import { IEvent } from '@database/eventSchema';
import { IUser } from '@database/userSchema';
import { ISignedWaiver } from 'database/signedWaiverSchema';
import { IWaiverVersion } from '@database/waiverVersionsSchema';
import { removeAttendee, removeRegistered } from 'app/actions/serveractions';
import { addAttendee } from 'app/actions/useractions';
import SingleVisitorComponent from './SingleVisitorComponent';
import SingleVistorWaiver from './SingleVisitorWaiver';
import { useEventId } from 'app/lib/swrfunctions';

const placeholderUser: IUser = {
  _id: 'placeholder',
  groupId: null,
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  zipcode: '',
  age: -1,
  gender: '',
  role: 'guest',
  eventsAttended: [],
  eventsRegistered: [],
  receiveNewsletter: false,
};

const EditEventVisitorInfo = ({ eventId }: { eventId: string }) => {
  const [loading, setLoading] = useState(true);
  const [visitorData, setVisitorData] = useState<{
    [key: string]: { parent: IUser; dependents: IUser[]; guests: IUser[]};
  }>({});
  const { eventData, isLoading, isError } = useEventId(eventId);
  const [showAdminActions, setShowAdminActions] = useState(false);
  const [selectedVisitors, setSelectedVisitors] = useState<IUser[]>([]);
  const [waivers, setWaivers] = useState<ISignedWaiver[]>([]);
  const [waiverVersions, setWaiverVersions] = useState<IWaiverVersion[]>([]);
  const [selectedWaiver, setSelectedWaiver] = useState<ISignedWaiver | null>(
    null
  );
  const {
    isOpen: isWaiverModalOpen,
    onOpen: openWaiverModal,
    onClose: closeWaiverModal,
  } = useDisclosure();

  const openWaiver = async (userId: string) => {
    const waiver = waivers.find((w) => w.signeeId === userId);
    setSelectedWaiver(waiver ?? null);
    if (waiver) {
      try {
        console.log(waiver.waiverVersion);
        const res = await fetch(`/api/waiver-versions`);
        if (res.ok) {
          const versionData = await res.json();
          setWaiverVersions(versionData.waiverVersions);
        }
      } catch (err) {
        console.error('Error fetching waiver version:', err);
      }
    }
    openWaiverModal();
  };

  const emailLink = () => {
    const emails = Object.values(visitorData)
      .flatMap((group) =>
        [group.parent, ...group.dependents].map((visitor) => visitor.email)
      )
      .filter((email) => !!email);
    const subject = encodeURIComponent(eventData?.eventName + ' Update');
    return `mailto:${emails.join(',')}?subject=${subject}`;
  };

  const handleEmailAllVisitors = () => {
    const mailtoLink = emailLink();

    window.location.href = mailtoLink;
    setShowAdminActions(false);
  };

  const handleEmailSelectVisitors = () => {
    //currently does same thing as email all
    const emails = selectedVisitors
      .map((visitor) => visitor.email)
      .filter((email) => !!email);
    const subject = encodeURIComponent(eventData?.eventName + ' Update');
    const mailtoLink = `mailto:${emails.join(',')}?subject=${subject}`;

    window.location.href = mailtoLink;
    setShowAdminActions(false);
  };

  const handleMarkAllVisitors = () => {
    //no functionality yet
    for (const visitor of Object.values(visitorData)) {
      if (visitor.parent._id !== 'placeholder') {
        addAttendee(visitor.parent._id.toString(), eventId.toString());
      }
    }
    setShowAdminActions(false);
  };

  async function handleMarkSelectVisitors() {
    //no functionality yet
    for (const visitor of selectedVisitors) {
      await addAttendee(visitor._id.toString(), eventId.toString());
    }
    setShowAdminActions(false);
  }

  async function handleRemoveSelectedAttendees() {
    for (const visitor of selectedVisitors) {
      if (visitor._id !== 'placeholder') {
        const success = await removeRegistered(
          visitor._id.toString(),
          eventId.toString()
        );
        if (success) {
          setVisitorData((prev) => {
            const updatedVisitors = { ...prev };
            delete updatedVisitors[visitor._id];
            return updatedVisitors;
          });
        } else {
          console.error('Error removing attendee');
        }
        setSelectedVisitors((prev) =>
          prev.filter((user) => user._id.toString() !== visitor._id.toString())
        );
        setShowAdminActions(false);
      }
    }
  }

  async function handleAbsentVistor() {
    for (const visitor of selectedVisitors) {
      if (visitor._id !== 'placeholder') {
        const success = await removeAttendee(
          visitor._id.toString(),
          eventId.toString()
        );
        setShowAdminActions(false);
      }
    }
  }

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!eventData) {
      return;
    }
    const fetchVisitorData = async () => {
      if (eventData.eventName !== '') {
        const visitors: {
          [key: string]: { parent: IUser; dependents: IUser[]; guests: IUser[]};
        } = {};

        // Fetch waivers for the event
        try {
          const waiverResponse = await fetch(`/api/waiver/${eventId}`);
          if (waiverResponse.ok) {
            const fetchedWaivers = await waiverResponse.json();
            setWaivers(fetchedWaivers);

            debugger;
            fetchedWaivers.forEach((waiver: ISignedWaiver) => {
              if (!visitors[waiver.signeeId]) {
                visitors[waiver.signeeId] = {
                  parent: placeholderUser,
                  dependents: [],
                  guests: [],
                };
              }
              waiver.dependents.forEach((dependent) => {
                visitors[waiver.signeeId].dependents.push({
                  _id: `${dependent} Dependent`,
                  groupId: null,
                  email: '',
                  firstName: dependent,
                  lastName: '',
                  phoneNumber: '',
                  age: -1,
                  gender: '',
                  role: 'guest',
                  eventsAttended: [],
                  eventsRegistered: [],
                  receiveNewsletter: false,
                  zipcode: '',
                });
              });
              waiver.guests.forEach((guest) => {
                visitors[waiver.signeeId].guests.push({
                  _id: `${guest} Party Member`,
                  groupId: null,
                  email: '',
                  firstName: guest,
                  lastName: '',
                  phoneNumber: '',
                  age: -1,
                  gender: '',
                  role: 'guest',
                  eventsAttended: [],
                  eventsRegistered: [],
                  receiveNewsletter: false,
                  zipcode: '',
                });
              });
            }
          );
          } else {
            console.error('Error fetching waivers:');
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching waivers:', error);

          setLoading(false);
          return;
        }

        // Fetch user data for registered IDs
        try {
          await Promise.all(
            eventData.registeredIds
              .filter((userId) => userId !== null)
              .map(async (userId) => {
                const response = await fetch(`/api/user/${userId}`);
                if (response.ok) {
                  const user = await response.json();

                  if (!visitors[user._id]) {
                    visitors[user._id] = { parent: user, dependents: [], guests: []};
                  } else {
                    visitors[user._id].parent = user;
                  }
                } else {
                  console.error('Error fetching user:', await response.json());
                }
              })
          );
        } catch (error) {
          console.error('Error fetching users:', error);
        }

        const sortedVisitors = Object.fromEntries(
          Object.entries(visitors).sort((a, b) =>
            a[1].parent.firstName.localeCompare(b[1].parent.firstName)
          )
        );
        setVisitorData(sortedVisitors);
        setLoading(false);
      }
    };
    fetchVisitorData();
  }, [isLoading]);

  async function handleCheck(checked: boolean, visitor: IUser) {
    if (checked) {
      setSelectedVisitors((prev) => [...prev, visitor]);
    } else {
      setSelectedVisitors((prev) =>
        prev.filter((user) => user._id.toString() !== visitor._id.toString())
      );
    }
  }

  const sortedVisitorEntries = Object.entries(visitorData).sort((a, b) => {
    const parentA = a[1].parent;
    const parentB = b[1].parent;
    return parentA.firstName.localeCompare(parentB.firstName);
  });

  return (
    <Box className={styles.eventInformation}>
      {isLoading || !eventData || loading ? (
        <div className={styles.visitorHeadingLoading}>
          Visitors
          <Spinner className={styles.spinner} speed="0.8s" thickness="3px" />
        </div>
      ) : (
        <>
          <div className={styles.visitorHeading}>
            Visitors
            <div className={styles.visitorCount}>
              (
              {sortedVisitorEntries.reduce((prev, cur) => {
                if (cur[1].parent._id !== 'placeholder') {
                  return prev + 1;
                }
                return prev;
              }, 0)}
              )
            </div>
            <button
              onClick={() => setShowAdminActions(!showAdminActions)}
              className={styles.manageVisitorText}
            >
              {showAdminActions ? 'Hide Admin Actions' : 'Show Admin Actions'}
            </button>
          </div>
          {showAdminActions && (
            <div className={styles.manageVisitorContainer}>
              <div className={styles.manageVisitorRow}>
                <button
                  onClick={handleEmailAllVisitors}
                  className={styles.manageVisitorButton}
                >
                  Email All
                </button>
                <button
                  onClick={handleMarkAllVisitors}
                  className={styles.manageVisitorButton}
                >
                  Mark All as Attended
                </button>
              </div>
              <div className={styles.manageVisitorRow}>
                <button
                  onClick={handleEmailSelectVisitors}
                  className={styles.manageVisitorButton}
                >
                  Email Selected
                </button>

                <button
                  onClick={handleMarkSelectVisitors}
                  className={styles.manageVisitorButton}
                >
                  Mark Selected as Attended
                </button>
              </div>
              <div className={styles.manageVisitorRow}>
                <button
                  onClick={handleRemoveSelectedAttendees}
                  className={styles.manageVisitorButton}
                >
                  Remove Selected
                </button>
                <button
                  onClick={handleAbsentVistor}
                  className={styles.manageVisitorButton}
                >
                  Mark as Absent
                </button>
              </div>
            </div>
          )}
          {Object.keys(visitorData).length === 0 ? (
            <div className={styles.noVisitorsMessage}>
              No visitors registered for this event.
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.visitorTable}>
                <thead>
                  <tr className={styles.visitorRow}>
                    <th className={styles.checkBox}></th>
                    <th className={styles.nameColumn}>Name</th>
                    <th className={styles.emailColumn}>Email</th>
                    <th className={styles.detailsColumn}>Waiver Status</th>
                    <th className={styles.detailsColumn}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVisitorEntries.map(
                    ([parentId, group], parentIndex) => (
                      <React.Fragment key={parentIndex}>
                        {group.parent._id != 'placeholder' && (
                          <tr className={styles.visitorRow}>
                            <td className={styles.checkBox}>
                              <Checkbox
                                colorScheme="green"
                                onChange={async (e) =>
                                  await handleCheck(
                                    e.target.checked,
                                    group.parent
                                  )
                                }
                                isChecked={selectedVisitors.some(
                                  (visitor) =>
                                    visitor._id.toString() ===
                                    group.parent._id.toString()
                                )}
                                defaultChecked={false}
                              />
                            </td>
                            <td className={styles.nameColumn}>
                              {group.parent.firstName
                                ? group.parent.firstName +
                                  ' ' +
                                  group.parent.lastName
                                : 'N/A'}
                            </td>
                            <td className={styles.emailColumn}>
                              {group.parent.email ? group.parent.email : 'N/A'}
                            </td>
                            <td className={styles.detailsColumn}>
                                {waivers.some(
                                  (w) => w.signeeId === group.parent._id
                                ) ? (
                                  <span
                                    className={styles.link}
                                    style={{
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => openWaiver(group.parent._id)}
                                  >
                                    Signed
                                  </span>
                                ) : (
                                  <p>Unsigned</p>
                                )}
                            </td>
                            <td className={styles.detailsColumn}>
                              <div className={styles.linkGroup}>
                                <SingleVisitorComponent
                                  visitorData={group.parent}
                                />
                              </div>
                            </td>
                          </tr>
                        )}
                        {group.dependents
                          .sort((a, b) =>
                            a.firstName.localeCompare(b.firstName)
                          )
                          .map((dependent, index) => (
                            <tr
                              className={`${styles.visitorRow} ${styles.dependentRow}`}
                              key={`${parentIndex}-${index}`}
                            >
                              <td className={styles.checkBox}></td>
                              <td
                                className={styles.nameColumn}
                                style={{ paddingLeft: '25px' }}
                              >
                                {dependent.firstName} {dependent.lastName}
                              </td>
                              <td className={styles.emailColumn}>
                                {dependent.email}
                              </td>
                              <td className={styles.detailsColumn}></td>
                            </tr>
                          ))}
                          {group.guests
                          .sort((a, b) =>
                            a.firstName.localeCompare(b.firstName)
                          )
                          .map((guest, index) => (
                            <tr
                              className={`${styles.visitorRow} ${styles.dependentRow}`}
                              key={`${parentIndex}-${index}`}
                            >
                              <td className={styles.checkBox}></td>
                              <td
                                className={styles.nameColumn}
                                style={{ paddingLeft: '25px' }}
                              >
                                {guest.firstName} {guest.lastName}
                              </td>
                              <td className={styles.emailColumn}>
                                Guest - Has not signed
                              </td>
                              <td className={styles.detailsColumn}>
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      <SingleVistorWaiver
        isOpen={isWaiverModalOpen}
        onClose={closeWaiverModal}
        waiver={selectedWaiver}
        waiverVersion={
          waiverVersions?.find(
            (v) => v.version === selectedWaiver?.waiverVersion
          ) || null
        }
      />
    </Box>
  );
};

export default EditEventVisitorInfo;
