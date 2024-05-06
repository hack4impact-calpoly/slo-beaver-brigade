"use server"

import connectDB from "@database/db";
import Event from "@database/eventSchema";
import User from "@database/userSchema";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function removeAttendee(userid: string, eventid: string ) {
    try{

        await connectDB(); // connect to db

        Event.findOne({_id: eventid}).orFail();

        // validate inputs
        if (!userid || !eventid) {
            return false
        }

        await Event.updateOne({_id: eventid},{$pull: {attendeeIds : userid} }).orFail();
        await User.updateOne({_id:userid},{$pull: {eventsAttended : {eventId: eventid}}}).orFail();
        revalidateTag("events")

        return true
    }
    catch(err){
        return false
    }
}

export async function removeRegistered(userid: string, eventid: string ) {
    try{

        await connectDB(); // connect to db

        Event.findOne({_id: eventid}).orFail();

        // validate inputs
        if (!userid || !eventid) {
            return NextResponse.json("Invalid Comment.", { status: 400 });
        }

        // remove user from event
        await Event.updateOne({_id: eventid},{$pull: {registeredIds : userid} }).orFail();
        // remove event from user
        await User.updateOne({_id:userid},{$pull: {eventsRegistered : eventid}}).orFail();

        return NextResponse.json("ID Deleted")
    }
    catch(err){
        return NextResponse.json(err, { status: 400});
    }
}
