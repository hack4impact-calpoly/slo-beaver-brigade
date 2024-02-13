"use client";
import React, { useState } from "react";
import style from "@styles/admin/userList.module.css";
import { XMarkIcon } from "@heroicons/react/16/solid";
import {IEvent} from '@database/eventSchema'
import {IUser} from '@database/userSchema'

type UserListProps = {
  event: IEvent
}

export default function UserAttendingList({event}: UserListProps) {
  const [list, setList] = useState(false);

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
        <span>{testList.length} Attendees</span>
        <br />
        <span className={style.viewText}>view</span>
      </button>

      {list && (
        <div className={style.list}>
          <div onClick={toggleList} className={style.overlay}></div>
          <div className={style.listContent}>
            <h2>Event Name Attendees</h2>
            {testList.map((user, index) => (
              <li key={user.id}>
                <div className={style.listItem}>
                  <span className={style.userName}>
                    {index + 1}. {user.name}
                  </span>
                  <span className={style.userEmail}>{user.email}</span>
                  <br></br>
                  <span>{user.phone}</span>
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
