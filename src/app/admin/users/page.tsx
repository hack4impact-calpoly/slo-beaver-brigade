"use client";
import React, { useEffect, useState } from "react";
import style from "@styles/admin/events.module.css";

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
    digitalWaiver: string| null;
    groupId: string | null;
}


const EventPreview = () => {
  // states
  const [events, setEvents] = useState<IUser[]>([]);

  // get all users from route
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);


  return (
    <div className={style.mainContainer}>
      
    </div>
  );
};

export default EventPreview;
