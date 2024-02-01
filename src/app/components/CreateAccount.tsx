import styles from './CreateAccount.module.css'
import React, { useState } from 'react';
export default function CreateAccount() {
    //const [isOverlayVisible, setIsOverlayVisible] = useState(true);

    return (
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
                    <button className={styles.button} type="button" id = "submit">Create Account</button>
                </form>   
            </div>  
        </div>
    )
  }
  