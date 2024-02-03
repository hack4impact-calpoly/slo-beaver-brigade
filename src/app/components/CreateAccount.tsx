"use client";
import styles from './CreateAccount.module.css'
import React, { useState } from 'react';
import checkmarkImage from '/docs/images/checkmark.png'
import Image from 'next/image'

export default function CreateAccount() {
    const [isSubmitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        // If the form submission is successful, setSubmitted(true);
        // This should also handle the backend submission later.
        //for the frontend, it'll just have the successful submission screen popup
        setSubmitted(true);
    };



    return (
        <div className={styles.background}>
            <div className={styles.main}>
                <div className = {styles.topColor}/>
                <div className={styles.formBody}>
                    <h1>
                        Create Account
                    </h1>
                    <form className={styles.form}>
                        <input className={styles.input} type="text" id="name" placeholder="Name"/>
                        <input className={styles.input} type="text" id="email" placeholder="Email"/>
                        <input className={styles.input} type="password" id="password" placeholder="Password"/>
                        <input className={styles.halfInput} type="tel" id="phone" placeholder="Phone"/>
                        <input className={styles.halfInput} type="text" id="zipcode" placeholder="Zipcode"/>
                        <textarea className={styles.input} id="questions" placeholder="Interest Questions"/>
                        <button className={styles.button} type="button" id = "submit" onClick={handleSubmit}>
                            Create Account</button>
                    </form>   
                </div>  
            </div>
            <div>
                {isSubmitted && <AccountCreated/>}
            </div>
        </div>
    )
  }

 //When return to calendar is clicked it should reroute to the calendar
const AccountCreated = () => {
    return(
        <div className = {styles.successWindow}>
            <div className={styles.totalAccountCreated}>
                <Image className={styles.checkmark} src={checkmarkImage} alt="checkmark"/>
                <div className={styles.successText}>SUCCESS</div>
                <div className={styles.successExplanation}>Your account has been created</div>
                <div className={styles.buttonContainer}>
                    <button className={styles.returnToCalendar}>Return to calendar</button>
                </div>
            </div>
        </div>
    )
}
