'use client';

import { Box, Spinner, Checkbox } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import styles from '../styles/admin/editEvent.module.css';
import { IEvent } from '@database/eventSchema';
import { IUser } from '@database/userSchema';
import { ISignedWaiver } from 'database/signedWaiverSchema';
import { removeAttendee } from 'app/actions/serveractions';
import { addAttendee } from 'app/actions/useractions';
import SingleVisitorComponent from './SingleVisitorComponent';
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
    [key: string]: { parent: IUser; dependents: IUser[] };
  }>({});
  const { eventData, isLoading, isError } = useEventId(eventId);
  const [showAdminActions, setShowAdminActions] = useState(false);

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
    const mailtoLink = emailLink();

    window.location.href = mailtoLink;
    setShowAdminActions(false);
  };

  const handleMarkAllVisitors = () => {
    //no functionality yet
    setShowAdminActions(false);
  };

  const handleMarkSelectVisitors = () => {
    //no functionality yet
    setShowAdminActions(false);
  };
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
          [key: string]: { parent: IUser; dependents: IUser[] };
        } = {};

        // Fetch waivers for the event
        try {
          const waiverResponse = await fetch(`/api/waiver/${eventId}`);
          if (waiverResponse.ok) {
            const waivers = await waiverResponse.json();

            debugger;
            waivers.forEach((waiver: ISignedWaiver) => {
              if (!visitors[waiver.signeeId]) {
                visitors[waiver.signeeId] = {
                  parent: placeholderUser,
                  dependents: [],
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
            });
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
                    visitors[user._id] = { parent: user, dependents: [] };
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

  async function handleCheck(checked: boolean, userid: string) {
    if (checked) {
      await addAttendee(userid.toString(), eventId.toString());
    } else {
      await removeAttendee(userid.toString(), eventId.toString());
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
              className={styles.manageVisitorText}>
              {(showAdminActions) ? "Hide Visitor Actions" : "Show Visitor Actions"}
            </button>
          </div>
          {showAdminActions && 
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
            </div>
          }
          {Object.keys(visitorData).length === 0 ? (
            <div className={styles.noVisitorsMessage}>
              No visitors registered for this event.
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.visitorTable}>
                <tbody>
                  {sortedVisitorEntries.map(
                    ([parentId, group], parentIndex) => (
                      <React.Fragment key={parentIndex}>
                        {group.parent._id != 'placeholder' && (
                          <tr className={styles.visitorRow}>
                            <td className={styles.checkBox}>
                              {eventData.attendeeIds
                                .map((oid) => oid.toString())
                                .includes(group.parent._id) ? (
                                <Checkbox
                                  colorScheme="green"
                                  defaultChecked
                                  onChange={async (e) =>
                                    await handleCheck(
                                      e.target.checked,
                                      group.parent._id.toString()
                                    )
                                  }
                                />
                              ) : (
                                <Checkbox
                                  colorScheme="green"
                                  onChange={async (e) =>
                                    await handleCheck(
                                      e.target.checked,
                                      group.parent._id.toString()
                                    )
                                  }
                                />
                              )}
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
                              <SingleVisitorComponent
                                visitorData={group.parent}
                              />
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
                      </React.Fragment>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Box>
  );
};

export default EditEventVisitorInfo;
