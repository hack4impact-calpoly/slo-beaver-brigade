"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import style from "@styles/adminStyle/sidebar.module.css";

const Sidebar = () => {
  // returns the current route that user is on, null if user is on the root (admin page.tsx)
  const segement = useSelectedLayoutSegment();

  // can add more options here for admin
  const sideBarOptions = [
    { name: "Dashboard", href: "/admin", current: !segement ? true : false },
    {
      name: "Events",
      href: "/admin/events",
      current: `/${segement}` === "/events" ? true : false,
    },
  ];

  return (
    <div className={style.sidebar}>
      <h1>Admin</h1>
      <div className={style.adminOptions}>
        <ul>
          {sideBarOptions.map((option) => (
            <li key={option.name}>
              <Link href={option.href}>
                <p>{option.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
