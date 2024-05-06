import React, { useState, useEffect } from "react";
import styles from "../styles/profile/profile.module.css";
import { PencilIcon } from "@heroicons/react/16/solid";
import { useUser } from "@clerk/clerk-react";
import Link from "next/link"
import EditProfile from "@components/EditProfile"
import { getUserDbData } from "app/lib/authentication";
import { IUser } from "database/userSchema";


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

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

 return(
   <div className={styles.profileContainer}>
     <div className={styles.formContainer}>
       <div className={`${styles.formGroup} ${styles.accountDetails}`}>
         <div className={`${styles.highlight} ${styles.accountHeader}`}>
           <h2 className={`${styles.title} ${styles.biggerTitle}`}>
             Account
           </h2>
         </div>
         <div className={styles.formFields}>
           <div>
            <p>
              <strong>Email Address</strong>
              <br /> {userData?.email}
            </p>
            <p>
              <button className={styles.editFieldButton}>
                <Link href ="/reset-password">Reset Password</Link>
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
            <h2 className={styles.editButton}> <EditProfile userData={userData}/>             
            <PencilIcon className={styles.pencilIcon} />
            </h2> 
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
           </div>
           <div>
             <p>
               <strong>Phone Number</strong>
               <br /> {userData?.phoneNumber}
             </p>
             <p>
               <strong>Zipcode</strong>
               <br /> {userData?.zipcode}              
             </p>     
           </div>
           <div>
            <p>
              <strong>Receive Newsletter</strong> <br />
              <span className={userData?.recieveNewsletter ? 'yes' : 'no'}>
                {userData?.recieveNewsletter ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
         </div>
       </div>      
      </div>
    </div> 
 )
};


