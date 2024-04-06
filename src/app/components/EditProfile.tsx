"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../styles/profile/profile.module.css";
import { PencilIcon } from "@heroicons/react/16/solid";
import { useUser } from "@clerk/clerk-react"; // Import useUser from Clerk
import { currentUser } from "@clerk/nextjs";

interface UserData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  zipCode: string;
  preferredLanguage: string;
  phoneNumber: string;
  password: string;
  city: string;
  zipcode: string;
  state: string;
  receiveEmails: string;
}

const ProfileEdit: React.FC = () => {
  //const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState("");

  const { isSignedIn, user, isLoaded } = useUser();

  if (isSignedIn) {
    const userId = user.unsafeMetadata["dbId"]; // Assuming this is the correct ID to match against event attendees

    console.log("wow: " + userId)
    // Fetch all events
    const eventsResponse = fetch("/api/events");
    

  

    
  }

  // useEffect(() => {
  //   // Fetch additional user data using Clerk's user ID (dbId)
  //   axios
  //     .get(`/api/user/${userId}`)
  //     .then((response) => {
  //       setUserData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching user data:", error);
  //     });
  // }, [userData]);

  

  // console.log("Bro" + userData);
  return (
    <div className={styles.profileContainer}>
      <div className={styles.formContainer}>
        <div className={`${styles.formGroup} ${styles.accountDetails}`}>
          <div className={`${styles.highlight} ${styles.accountHeader}`}>
            <h2 className={`${styles.title} ${styles.biggerTitle}`}>
              Account Details
            </h2>
          </div>
          <div className={styles.formFields}>
            <div>
              <p>
                <strong>Username</strong> <br />
                {user?.username}
                <button className={styles.editFieldButton}>
                  Edit Username
                </button>
              </p>
              <p>
                <strong>Current Password</strong> <br />
                {userData.password}
                <button className={styles.editFieldButton}>
                  Edit Password
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className={`${styles.formGroup} ${styles.personalDetails}`}>
          <div className={`${styles.highlight} ${styles.personalHeader}`}>
            <h2 className={`${styles.title} ${styles.biggerTitle}`}>
              Personal Details
            </h2>
            <PencilIcon className={styles.pencilIcon} />
            <h2 className={styles.editButton}>Edit Details</h2>
          </div>
          <div className={styles.formFields}>
            <div>
              <p>
                <strong>First Name</strong>
                <br /> {user?.firstName}
              </p>
              <p>
                <strong>Last Name</strong>
                <br /> {user?.lastName}
              </p>
              <p>
                <strong>Preferred Language</strong>
                <br /> {userData.preferredLanguage}
              </p>
            </div>
            <div>
              <p>
                <strong>Telephone Number</strong>
                <br /> {user?.primaryPhoneNumber?.phoneNumber}
              </p>
              <p>
                <strong>Email</strong>
                <br /> {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
        <div className={`${styles.formGroup} ${styles.savedAddress}`}>
          <div className={`${styles.highlight} ${styles.savedAddressHeader}`}>
            <h2 className={`${styles.title} ${styles.biggerTitle}`}>
              Saved Address
            </h2>
            <PencilIcon className={styles.pencilIcon} />
            <h2 className={styles.editButton}>Edit Details</h2>
          </div>
          <div className={styles.formFields}>
            <div>
              <p>
                <strong>City</strong>
                <br /> {userData.city}
              </p>
              <p>
                <strong>Zipcode</strong>
                <br /> {userData.zipcode}
              </p>
            </div>
            <div>
              <p>
                <strong>State</strong>
                <br /> {userData.state}
              </p>
            </div>
          </div>
        </div>
        <div className={`${styles.formGroup} ${styles.savedAddress}`}>
          <div className={`${styles.highlight} ${styles.personalHeader}`}>
            <h2 className={`${styles.title} ${styles.biggerTitle}`}></h2>
            <PencilIcon className={styles.pencilIcon} />
            <h2 className={styles.editButton}>Edit Details</h2>
          </div>
          <div className={styles.formFields}>
            <div>
              <p>
                <strong>Receive Emails from SLO Beaver Brigrade</strong> <br />
                {userData.receiveEmails}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
