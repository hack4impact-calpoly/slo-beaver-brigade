"use client"
import { useSelectedLayoutSegment } from "next/navigation"
import Link from "next/link"

const Sidebar = () => {

    // returns the current route that user is on, null if user is on the root (admin page.tsx)
    const segement = useSelectedLayoutSegment()
    
    const sideBarOptions = [
        {name: "Dashboard", href: "/admin", current: !segement ? true : false},
        {name: "Events", href: "/events", current: `/${segement}` === "/events" ? true: false}
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