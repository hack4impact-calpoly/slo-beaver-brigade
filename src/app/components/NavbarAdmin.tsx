"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "@styles/navbar/navbar.module.css";
import { HamburgerIcon, Search2Icon, StarIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { SignOutButton } from "@clerk/clerk-react";

export default function NavbarAdmin(props: { name: string }) {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
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
                {props.name}
              </Link>
            </div>
          :
            <div className={styles.greeting}>
              <p>{props.name}</p>
            </div>
          }

        </div>
        <div className={`${styles.menu_icon} ${showNavbar && styles.active}`} onClick={handleShowNavbar}>
          <HamburgerIcon />
        </div>
        <div
          className={`${styles.nav_elements}  ${showNavbar && styles.active}`}
        >
          <ul>
            <li>
              <Link href="/">
                Home
              </Link>
            </li>
            <li>
              <Link href="/calendar">
                Calendar
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                Users
              </Link>
            </li>
            <li>
              <Link href="/admin/events/hours">
                Event Logs
              </Link>
            </li>
            
            {(props.name != "Sign In / Log In") &&
          <>
            <li>
              <Link href="/">My Account</Link>
            </li>
            <li>
                <SignOutButton />
            </li>
            </>
          }
            <li>
              <Link href="/">
                {" "}
                <Search2Icon className={styles.search_icon} />{" "}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
