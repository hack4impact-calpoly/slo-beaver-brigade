import { UserDashboard } from "@components/UserDashboard";

export const getAllEvents = async () => {

    const res = await fetch("http://localhost:3000/api/events", {
        next: {
            tags: ['events']
        }
    })
    if (res.ok){
        const events = await res.json()
        return events
    }
    return []
}

export default async function Page(){
    const events = await getAllEvents()

    return (
        <UserDashboard events={events}/>
    )
}

