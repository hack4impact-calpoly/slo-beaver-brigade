// import { position } from "@chakra-ui/react";
// import { currentUser } from "@clerk/nextjs/server";
// import { UserDashboard } from "app/components/UserDashboardClientFetch";
// import { getUserDbData } from "app/lib/authentication";
// import { getBaseUrl } from "app/lib/random";
// import connectDB from "database/db";
// import User, { IUser } from "database/userSchema";
// import { Suspense } from "react";

// const getAllEvents = async () => {

//     const res = await fetch(getBaseUrl() + "/api/events", {
//         cache: "force-cache",
//         next: {
//             tags: ['events']
//         }
//     })
//     if (res.ok){
//         const events = await res.json()
//         return events
//     }
//     return []
// }

// const LoadingEvents = () => {
//     return (
//         <h1>Loading...</h1>
//     )
// }

// export const getUserRoleFromEmail = async(email: string) => {
//     console.log('revamp: fetching data')
//     await connectDB()
//     try {
//         const user: IUser= await User.findOne({ email: email}, 'role').lean().orFail() as IUser;
//         return user.role
//     }
//     catch (err) {
//         console.log('user not found: ' + err)
//         return 'guest'
//     }
// }
// export const getUserDbDataRevamp = async() => {

//     const clerk_user = await currentUser();
//     if (!clerk_user){
//         console.log('clerk user not found')
//         return null
//     }
//     // search db for user with matching email address
//     console.log('revamp: fetching data')
//     await connectDB()
//     console.log(clerk_user.emailAddresses[0].emailAddress)
//     try {
//         const user: IUser= await User.findOne({ email: clerk_user.emailAddresses[0].emailAddress }).lean().orFail() as IUser;
//         console.log("user found")
    
//         return user
//     }
//     catch (err) {
//         console.log('user not found: ' + err)
//         return null
//     }
// }

// export default async function Page(){
//     console.log('page loading...')
//     let events = []
//     const url = getBaseUrl() + "/api/events/ascending"
//     const res = await fetch(url, {
//         cache: "no-store",
//         next: {
//             tags: ['events']
//         }
//     })
//     if (res.ok){
//         events = await res.json()
//     }
//     console.log('events loaded.')

//     console.log('returning page')

//     return (
//         <UserDashboard eventsRes={JSON.stringify(events)} />
//     )
// }

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

export const getUserRoleFromEmail = async(email: string) => {
    console.log('revamp: fetching data')
    await connectDB()
    try {
        const user: IUser= await User.findOne({ email: email}, 'role').lean().orFail() as IUser;
        return user.role
    }
    catch (err) {
        console.log('user not found: ' + err)
        return 'guest'
    }
}
export const getUserDbDataRevamp = async() => {

    const clerk_user = await currentUser();
    if (!clerk_user){
        console.log('clerk user not found')
        return null
    }
    // search db for user with matching email address
    console.log('revamp: fetching data')
    await connectDB()
    console.log(clerk_user.emailAddresses[0].emailAddress)
    try {
        const user: IUser= await User.findOne({ email: clerk_user.emailAddresses[0].emailAddress }).lean().orFail() as IUser;
        console.log("user found")
    
        return user
    }
    catch (err) {
        console.log('user not found: ' + err)
        return null
    }
}

export default async function Page(){
    console.log('page loading...')
    let events = []
    const url = getBaseUrl() + "/api/events/ascending"
    const res = await fetch(url, {
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
    console.log(typeof userData?._id)
    console.log('parsed user data')

    console.log('returning page')

    return (
        <UserDashboard eventsRes={JSON.stringify(events)} userDataRes={JSON.stringify(userData)}/>
    )
}

