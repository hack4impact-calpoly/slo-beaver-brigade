"use server"

import connectDB from "@database/db";
import Event from "@database/eventSchema";
import User from "@database/userSchema";
import { NextResponse } from "next/server";

export async function removeAttendee(userid: string, eventid: string ) {
    try{

        await connectDB(); // connect to db

        const event = Event.findOne({_id: eventid}).orFail();

        // validate inputs
        if (!userid || !eventid) {
            return false
        }

        await Event.updateOne({_id: eventid},{$pull: {attendeeIds : userid} }).orFail();
        await User.updateOne({_id:userid},{$pull: {eventsAttended : eventid}}).orFail();

        return true
    }
    catch(err){
        return false
    }
}
