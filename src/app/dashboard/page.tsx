import { position } from "@chakra-ui/react";
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
    console.log('page loading...')
    let events = []
    const url = new URL(getBaseUrl() + "/api/events")
    url.searchParams.set("sort_order", "asc")
    const res = await fetch( url, {
        cache: "force-cache",
        next: {
            tags: ['events']
        }
    })
    if (res.ok){
        events = await res.json()
    }
    console.log('events loaded.')

    console.log('getting user data')

    const userRes = await getUserDbData()
    let userData = null
    if (userRes){
        userData = JSON.parse(userRes)
    }
    console.log('parsed user data')

    console.log('returning page')

    return (
        <Suspense 
        //fallback={<LoadingEvents />}
        // Removed because loading is already shown for event cards
        >
            <UserDashboard events={events} userData={userData}/>
        </Suspense>
    )
}

