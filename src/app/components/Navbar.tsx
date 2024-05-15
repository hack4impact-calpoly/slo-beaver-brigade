"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "@styles/navbar/navbar.module.css";
import { HamburgerIcon, Search2Icon, StarIcon, ExternalLinkIcon, CloseIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { SignOutButton } from "@clerk/clerk-react";

export default function Navbar(props: { name: string }) {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const handleHideNavbar = () => {
    setShowNavbar(false);
  };    

  return (
    <nav className={`${styles.navbar} ${showNavbar && styles.active}`}>
      <div className={styles.container}>
        <div className={`${styles.nav_left} ${showNavbar && styles.active}`}>
          <Link href="/">
            <Image
              className={styles.logo}
              src={"/beaver-logo.svg"}
              alt="Beaver Logo"
              width={35}
              height={35}
            ></Image>
          </Link>
          {(props.name === "Sign In / Log In")? 
            <div className={styles.greeting}>
              <Link href={"/login"}>
                Sign In
              </Link>
            </div>
          :
            <div className={styles.greeting}>
              <p>{props.name}</p>
            </div>
          }
        </div>   
        <div
          className={`${styles.nav_elements}  ${showNavbar && styles.active}`}
        >
          <ul>
            <li>
              <Link href="/" onClick={handleHideNavbar}>
                Discover Events
              </Link>
            </li>
           <li>
              <Link href="/calendar" onClick={handleHideNavbar}>
                Calendar
              </Link>
            </li>
            {(props.name != "Sign In / Log In") &&
              <>
                <li>
                  <Link href="/profile" onClick={handleHideNavbar}>
                    My Account
                  </Link>
                </li>  
                <li>
                  <Link href="/hours" onClick={handleHideNavbar}>
                    Volunteer Log
                  </Link>
                </li>
              </>
            }
          </ul>
        </div>
          
        <div className={`${styles.nav_right} ${showNavbar && styles.active}`}>
          <ul>
            <li>
              <Link href="https://www.slobeaverbrigade.com">
                Homepage
              </Link>
            </li>
            {(props.name != "Sign In / Log In") &&
              <>
                <li>
                  |
                </li>
                <li>
                  <SignOutButton/>
                </li>
              </>
            }
            </ul>
          </div>
          <div className={`${styles.menu_icon} ${showNavbar && styles.active}`} onClick={handleShowNavbar}>
            <HamburgerIcon/>
          </div> 
          <div className={`${styles.close_icon} ${showNavbar && styles.active}`} onClick={handleHideNavbar}>
            <CloseIcon/> 
          </div>
      </div>
    </nav>
  );
}
