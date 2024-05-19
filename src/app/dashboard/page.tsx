import { position } from "@chakra-ui/react";
import { currentUser } from "@clerk/nextjs/server";
import { UserDashboard } from "@components/UserDashboard";
import { getUserDbData } from "app/lib/authentication";
import { getBaseUrl } from "app/lib/random";
import connectDB from "database/db";
import User, { IUser } from "database/userSchema";
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
const getUserDbDataRevamp = async() => {

    const clerk_user = await currentUser();
    if (!clerk_user){
        console.log('clerk user not found')
        return null
    }
    // search db for user with matching email address
    await connectDB()
    console.log(clerk_user.emailAddresses[0].emailAddress)
    try{
        const user: IUser | null = await User.findOne({email: clerk_user.emailAddresses[0].emailAddress}).orFail();
        console.log("user found")
        return user
    }
    catch(err){
        console.log('user not found: ' + err)
        return null
    }
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

    const userData = await getUserDbDataRevamp()
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

