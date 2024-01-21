"use client"
import { useSelectedLayoutSegment } from "next/navigation"
import Link from "next/link"

const Sidebar = () => {

    const sideBarOptions = [
        {name: "Dashboard", href: "/admin"},
        {name: "Events", href: "/events"}
    ]

    return (
        <div>
            <div>
                <h2>Admin</h2>
            </div>
            <div>
                <ul>
                    {sideBarOptions.map((option) => (
                        <li key={option.name}>
                            <Link href={option.href}></Link>
                            {option.name}
                        </li>
                    ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default Sidebar