import { UserDashboard } from "@components/UserDashboard";
import { getUserDbData } from "app/lib/authentication";
import { getBaseUrl } from "app/lib/random";
import { Suspense } from "react";

const getAllEvents = async () => {

    const res = await fetch(getBaseUrl() + "/api/events", {
        cache: "force-cache",
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

