"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import style from "@styles/adminStyle/sidebar.module.css";
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, HomeIcon, CalendarDaysIcon } from "@heroicons/react/16/solid";

const Sidebar = () => {
  // returns the current route that user is on, null if user is on the root (admin page.tsx)
  const segement = useSelectedLayoutSegment();

  // state for determining if slider is collapased
  const [isCollapsed, setCollapsed] = useState(false);

  // can add more options here for admin
  const sideBarOptions = [
    { name: "Dashboard", href: "/admin", icon: <HomeIcon style={{ width: '35px', height: '35px' }}/> ,current: !segement ? true : false },
    {
      name: "Events",
      href: "/admin/events",
      icon: <CalendarDaysIcon style={{ width: '35px', height: '35px' }}/>,
      current: `/${segement}` === "/events" ? true : false,
    },
  ];

  const toggleSlider = () => {
    setCollapsed(!isCollapsed)
  }

  return (
    <div className={`${style.sidebar} ${isCollapsed ? style.collapsedSidebar : ''}`}>
      <div className={style.toggleButton} onClick={toggleSlider}>
        {isCollapsed ?  <ArrowsPointingOutIcon style={{ width: '35px', height: '35px' }}/> : <ArrowsPointingInIcon style={{ width: '35px', height: '35px' }}/> }
      </div>
      <h1>{isCollapsed ? '' : 'Admin'}</h1>
      <div className={style.adminOptions}>
        <ul>
          {sideBarOptions.map((option) => (
            <li key={option.name}>
              <Link href={option.href}>
                <div className={style.option}>
                {option.icon}
                <p>{isCollapsed ? '' : option.name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
