import React, { useState, useEffect } from "react";
import styles from "../styles/profile/profile.module.css";
import { PencilIcon } from "@heroicons/react/16/solid";
import { useUser } from "@clerk/clerk-react";
import Link from "next/link"
import EditProfile from "@components/EditProfile"
import { getUserDbData } from "app/lib/authentication";
import { IUser } from "database/userSchema";



/*
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
*/

export default function UserProfile() {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getUserDbData();
        if (userRes) {
          const userData = JSON.parse(userRes);
          setUserData(userData);
          console.log(userData)
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []); // Empty dependency array ensures this effect runs only once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

 return(
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
               
               <button className={styles.editFieldButton}>
                 Edit Username
               </button>
             </p>
             <p>
               <strong>Current Password</strong> <br />
               
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
            <h2 className={styles.editButton}> <EditProfile userData={userData}/> </h2> 
         </div>
         <div className={styles.formFields}>
           <div>
             <p>
               <strong>First Name</strong>
               <br /> {userData?.firstName}
             </p>
             <p>
               <strong>Last Name</strong>
               <br /> {userData?.lastName}
             </p>
             <p>
               <strong>Preferred Language</strong>
               
             </p>
           </div>
           <div>
             <p>
               <strong>Telephone Number</strong>
               <br /> {userData?.phoneNumber}
             </p>
             <p>
               <strong>Email</strong>
               <br /> {userData?.email}
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
           
             </p>
             <p>
               <strong>Zipcode</strong>
               <br /> {userData.zipcode}
             </p>
           </div>
           <div>
             <p>
               <strong>State</strong>

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
               {userData?.recieveNewsletter}
             </p>
           </div>
         </div>
       </div>
     </div>
   </div>
 )

 
};


