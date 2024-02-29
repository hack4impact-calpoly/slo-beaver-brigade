"use client"
import { useState } from 'react'
import Link from 'next/link'
import "@styles/navbar/navbar.css"
import { HamburgerIcon, Search2Icon, StarIcon } from '@chakra-ui/icons'


const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <StarIcon></StarIcon>
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          <HamburgerIcon/>
        </div>
        <div className={`nav-elements  ${showNavbar && 'active'}`}>
          <ul>
            <li>
              <Link href="/">Visit</Link>
            </li>
            <li>
              <Link href="/">Volunteer</Link>
            </li>
            <li>
              <Link href="/">Learn</Link>
            </li>
            <li>
              <Link href="/">About Us</Link>
            </li>
            <li>
              <Link href="/">Donate</Link>
            </li>
            <li>
              <Link href="/"> <Search2Icon className='search-icon'/> </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar