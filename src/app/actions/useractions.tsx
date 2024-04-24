"use server"

import connectDB from "@database/db";
import Event from "@database/eventSchema";
import User from "@database/userSchema";
import { NextResponse } from "next/server";

export async function addAttendee(userid : string, eventid : string) {
    try{
    
        console.log("here ", userid, typeof userid, eventid, typeof eventid )
        await connectDB(); // connect to db

        const event = Event.findOne({_id: eventid}).orFail();

        // validate inputs
        if (!userid || !eventid) {
            return NextResponse.json("Invalid Comment.", { status: 400 });
        }

        await Event.updateOne({_id: eventid},{$push: {attendeeIds : userid} }).orFail();
        await User.updateOne({_id:userid},{$push: {eventsAttended : eventid}}).orFail();

        return NextResponse.json("ID Added", { status: 200 });
    }
    catch(err){
        console.log("Error bro", err)
       return NextResponse.json(err, { status: 400});
    }
}
export async function addToRegistered(userid : string, eventid : string, waiverId: string) {
    try{
    
        console.log("here ", userid, typeof userid, eventid, typeof eventid )
        await connectDB(); // connect to db

        const event = Event.findOne({_id: eventid}).orFail();

        // validate inputs
        if (!userid || !eventid) {
            return NextResponse.json("Invalid Comment.", { status: 400 });
        }

        await Event.updateOne({_id: eventid},{$push: {registeredIds : userid} }).orFail();
        await User.updateOne({_id:userid},{$push: {eventsRegistered : {eventId: eventid, digitalWaiver: waiverId }}}).orFail();

        return true
    }
    catch(err){
        console.log("Error bro", err)
        return false
    }
}


