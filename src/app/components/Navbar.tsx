"use client"
import { useState } from 'react'
import Link from 'next/link'
import styles from "@styles/navbar/navbar.module.css"
import { HamburgerIcon, Search2Icon, StarIcon } from '@chakra-ui/icons'
import { currentUser } from '@clerk/nextjs';


const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <StarIcon></StarIcon>
          </Link>
          <div className={styles.greeting}>
            <p>Sign In</p>
          </div>
        </div>
        <div className={styles.menu_icon} onClick={handleShowNavbar}>
          <HamburgerIcon/>
        </div>
        <div className={`${styles.nav_elements}  ${showNavbar && styles.active}`}>
          <ul>
            <li>
              <Link href="https://www.slobeaverbrigade.com/come-to-a-beaver-pond/">Visit</Link>
            </li>
            <li>
              <Link href="https://www.slobeaverbrigade.com/news-events/">Volunteer</Link>
            </li>
            <li>
              <Link href="https://www.slobeaverbrigade.com/block-content-examples/">Learn</Link>
            </li>
            <li>
              <Link href="https://www.slobeaverbrigade.com/about-us/">About Us</Link>
            </li>
            <li>
              <Link href="https://www.slobeaverbrigade.com/donate/">Donate</Link>
            </li>
            <li>
              <Link href="/"> <Search2Icon className={styles.search_icon}/> </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar