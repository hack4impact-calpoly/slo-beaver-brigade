"use client"
import React, { useState } from "react";
import style from '@styles/admin/userList.module.css'
import {
  XMarkIcon
} from "@heroicons/react/16/solid";

export default function UserAttendingList() {
  const [list, setList] = useState(false);

  const toggleList = () => {
    setList(!list);
  };

  if(list) {
    document.body.classList.add('activeList')
  } else {
    document.body.classList.remove('activeList')
  }
  
  return (
    <>
      <button onClick={toggleList} className={style.toggleButton}>
        Attendees
      </button>

      {list && (
        <div className={style.list}>
          <div onClick={toggleList} className={style.overlay}></div>
          <div className={style.listContent}>
            <h2>Attendees</h2>
            <p>
              User list here
            </p>
            <button className={style.closeList} onClick={toggleList}>
              <XMarkIcon style={{ width: "20px", height: "20px" }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}