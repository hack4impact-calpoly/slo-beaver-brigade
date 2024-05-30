"use client";
import { useState } from "react";
import Link from "next/link";
import { HamburgerIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { SignOutButton } from "@clerk/clerk-react";

export default function MoblileNavbar() {
    const [showMobileNavbar, setMobileShowNavbar] = useState(false);
  
    const handleMoileShowNavbar = () => {
      setMobileShowNavbar(!showMobileNavbar);
    };
    
    return(
        <div className="bg black">
            <p className="text-color white">HELLO</p>
        </div>
    );
};