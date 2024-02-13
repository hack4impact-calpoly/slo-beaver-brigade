"use client";
import React, { useState, useEffect } from "react";
import style from "@styles/admin/userList.module.css";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { IEvent } from "@database/eventSchema";
import { IUser } from "@database/userSchema";

type UserListProps = {
  event: IEvent;
};

export default function UserAttendingList({ event }: UserListProps) {
  const [list, setList] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {

    // fetch an array of users from array of ids in event prop
    const fetchUsers = async () => {
      if (event.attendeeIds && event.attendeeIds.length > 0) {
        try {
          const fetchedUsers = await Promise.all(
            event.attendeeIds.map((id) =>
              fetch(`/user/${id}`)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return res.json();
                })
                .then((data) => data.user as IUser) 
            )
          );
          setUsers(fetchedUsers);
        } catch (error) {
          console.error("Failed to fetch users", error);
        }
      }
    };

    fetchUsers();
  }, [event.attendeeIds]); 

  const toggleList = () => {
    setList(!list);
  };

  if (list) {
    document.body.classList.add("activeList");
  } else {
    document.body.classList.remove("activeList");
  }

  return (
    <>
      <button onClick={toggleList} className={style.toggleButton}>
        <span>{users.length} Attendees</span>
        <br />
        <span className={style.viewText}>view</span>
      </button>

      {list && (
        <div className={style.list}>
          <div onClick={toggleList} className={style.overlay}></div>
          <div className={style.listContent}>
            <h2>Event Name Attendees</h2>
            {users.map((user, index) => (
              <li key={user.phoneNumber}>
                <div className={style.listItem}>
                  <span className={style.userName}>
                    {index + 1}. {user.firstName} {user.lastName}
                  </span>
                  <span className={style.userEmail}>{user.email}</span>
                  <br></br>
                  <span>{user.phoneNumber}</span>
                </div>
              </li>
            ))}
            <button className={style.closeList} onClick={toggleList}>
              <XMarkIcon style={{ width: "20px", height: "20px" }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
