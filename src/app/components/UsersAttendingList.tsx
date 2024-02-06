"use client"
import React, { useState } from "react";
import style from '@styles/admin/userList.module.css'

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
        Attendies
      </button>

      {list && (
        <div className={style.list}>
          <div onClick={toggleList} className={style.overlay}></div>
          <div className={style.listContent}>
            <h2>Attendies</h2>
            <p>
              Ex
            </p>
            <button className={style.closeList} onClick={toggleList}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}