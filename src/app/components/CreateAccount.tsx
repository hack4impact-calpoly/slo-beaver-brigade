import styles from './CreateAccount.module.css'
export default function CreateAccount() {
    return (
        <div className={styles.main}>
            <div className={styles.colorBar}/>
            <div>
                Create Account
            </div>
            <form className={styles.form}>
                <input type="text" id="name" placeholder="Name"/>
                <input type="text" id="email" placeholder="Email"/>
                <input type="password" id="password" placeholder="Password"/>
                <input type="tel" id="phone" placeholder="Phone"/>
                <input type="text" id="zipcode" placeholder="Zipcode"/>
                <input type="text" id="questions" placeholder="Interest Questions"/>
                <button type="button" id = "submit">Create Account</button>
            </form>     
        </div>
    )
  }
  