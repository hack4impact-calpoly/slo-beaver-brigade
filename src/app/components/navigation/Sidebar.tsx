"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import style from "@styles/admin/sidebar.module.css";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/16/solid";

const Sidebar = () => {
  // returns the current route that user is on, null if user is on the root (admin page.tsx)
  const segement = useSelectedLayoutSegment();

  // useState for determining if slider is collapased
  const [isCollapsed, setCollapsed] = useState(false);

  const toggleSlider = () => {
    setCollapsed(!isCollapsed);
  };

  // can add more options here for admin
  const sideBarOptions = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <HomeIcon style={{ width: "35px", height: "35px" }} />,
      current: !segement ? true : false,
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: <CalendarDaysIcon style={{ width: "35px", height: "35px" }} />,
      current: `/${segement}` === "/events" ? true : false,
    },
    {
      name: "Calendar",
      href: "/admin/calendar",
      icon: <CalendarDaysIcon style={{ width: "35px", height: "35px" }} />,
      current: `/${segement}` === "/events" ? true : false,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <CalendarDaysIcon style={{ width: "35px", height: "35px" }} />,
      current: `/${segement}` === "/events" ? true : false,
    }
  ];

  return (
    <div
      className={`${style.sidebar} ${isCollapsed ? style.collapsedSidebar : ""}`}
      style={{ backgroundColor: "#5DADE2" }}
    >
      <div className={style.toggleButton} onClick={toggleSlider}>
        {isCollapsed ? (
          <Bars3Icon style={{ width: "35px", height: "35px" }} />
        ) : (
          <XMarkIcon style={{ width: "35px", height: "35px" }} />
        )}
      </div>
      <h1>{isCollapsed ? "" : "Admin"}</h1>
      <div className={style.adminOptions}>
        <ul>
          {sideBarOptions.map((option) => (
            <li
              key={option.name}
              className={`${option.current ? style.currentOption : ""}`}
            >
              <Link href={option.href}>
                <div className={style.option}>
                  {option.icon}
                  <p>{isCollapsed ? "" : option.name}</p>
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
