"use client";


import React, { useState, useEffect } from "react";
import styles from "../styles/profile/profile.module.css";
import { PencilIcon } from "@heroicons/react/16/solid";
import { useUser } from "@clerk/clerk-react";
import Link from "next/link"
import EditProfile from "@components/EditProfile"


interface UserData {
 firstName: string;
 lastName: string;
 username: string;
 email: string;
 zipcode: string;
 preferredLanguage: string;
 phoneNumber: string;
 password: string;
 city: string;
 state: string;
 receiveEmails: string;
}


const UserProfile: React.FC = () => {
 const [userData, setUserData] = useState<UserData>({
   firstName: "",
   lastName: "",
   username: "",
   email: "",
   zipcode: "",
   preferredLanguage: "",
   phoneNumber: "",
   password: "",
   city: "",
   state: "",
   receiveEmails: "",
 });


 const { isSignedIn, user, isLoaded } = useUser();


 useEffect(() => {
   if (isSignedIn && isLoaded) {
     setUserData({
       firstName: user.firstName || "",
       lastName: user.lastName || "",
       username: user.username || "",
       email: user.primaryEmailAddress?.emailAddress  || "",
       zipcode: String(user.unsafeMetadata["zipcode"])  || "",
       preferredLanguage: "",
       phoneNumber: String(user.unsafeMetadata["phone"])  || "",
       password: "",
       city: "",
       state: "",
       receiveEmails: "",
     });
   }
 }, [isSignedIn, isLoaded]);




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
               {userData.username}
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
            <h2 className={styles.editButton}><EditProfile> </EditProfile></h2> 
         </div>
         <div className={styles.formFields}>
           <div>
             <p>
               <strong>First Name</strong>
               <br /> {userData.firstName}
             </p>
             <p>
               <strong>Last Name</strong>
               <br /> {userData.lastName}
             </p>
             <p>
               <strong>Preferred Language</strong>
               <br /> {userData.preferredLanguage}
             </p>
           </div>
           <div>
             <p>
               <strong>Telephone Number</strong>
               <br /> {userData.phoneNumber}
             </p>
             <p>
               <strong>Email</strong>
               <br /> {userData.email}
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


export default UserProfile;