import { UserDashboard } from "@components/UserDashboard";
import { getUserDbData } from "app/lib/authentication";
import { Suspense } from "react";

const getAllEvents = async () => {

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
const LoadingEvents = () => {
    return (
        <h1>Loading...</h1>
    )
}

export default async function Page(){
    const events = await getAllEvents()

    const userRes = await getUserDbData()
    let userData = null
    if (userRes){
        userData = JSON.parse(userRes)
    }

    return (
        <Suspense fallback={<LoadingEvents />}>
            <UserDashboard events={events} userData={userData}/>
        </Suspense>
    )
}

