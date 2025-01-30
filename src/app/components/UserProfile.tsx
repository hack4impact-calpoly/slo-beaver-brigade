import React, { useState, useEffect } from "react";
import styles from "../styles/profile/profile.module.css";
import { PencilIcon } from "@heroicons/react/16/solid";
import { useUser } from "@clerk/clerk-react";
import Link from "next/link"
import EditProfile from "@components/EditProfile"
import { getUserDbData } from "app/lib/authentication";
import { IUser } from "database/userSchema";
import "../fonts/fonts.css";
import DeleteConfirmation from "./DeleteConfirmation";
import { StatUpArrow } from "@chakra-ui/react";

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
          
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  const closeFromChild = () => {
    return null;
  }

 return(
   <div className={styles.profileContainer}>
     <div className={styles.formContainer}>
      <div className={styles.formDelete}>
       <div className={`${styles.formGroup} ${styles.accountDetails}`}>
         <div className={`${styles.highlight} ${styles.accountHeader}`}>
           <h2 className={styles.containerTitle}>
             Account
           </h2>
         </div>
         <div className={styles.formFields}>
           <div>
              <div className={styles.fieldTitle}>Email Address</div>
                {userData ? userData?.email : <div>Loading...</div>}
              </div>
            </div>
          
         </div>  
         <div>
            <DeleteConfirmation closeFromChild={closeFromChild}></DeleteConfirmation>
         </div>

        </div>

       
       <div className={`${styles.formGroup} ${styles.personalDetails}`}>
         <div className={`${styles.highlight} ${styles.personalHeader}`}>
           <h2 className={styles.containerTitle}>
             Personal
           </h2>
            <h2 className={styles.editButton}> <EditProfile userData={userData}/>           
            </h2> 
         </div>
         <div className={styles.formFields}>
           <div>
              <div className={styles.fieldTitle}>First Name</div>
                {userData ? userData.firstName : <div>Loading...</div>}

            <div className={styles.fieldTitle}>Last Name</div>
              {userData ? userData.lastName : <div>Loading...</div>}            
           </div>
           <div>
             <div className={styles.fieldTitle}>Phone Number</div>
                {userData ? userData.phoneNumber : <div>Loading...</div>}
              <div className={styles.fieldTitle}>Zipcode</div>
                {userData ? userData.zipcode : <div>Loading...</div>}                   
           </div>
           <div>
            <div className={styles.fieldTitle}>Receive Newsletter</div>
              <span className={userData?.receiveNewsletter ? 'yes' : 'no'}>
                { userData ?(userData?.receiveNewsletter ? 'Yes' : 'No') : <div>Loading...</div>}
              </span>
          </div>
         </div>
       </div>     
      </div>
    </div> 
  )
};


