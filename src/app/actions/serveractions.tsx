"use server"

import connectDB from "@database/db";
import Event from "@database/eventSchema";

export async function addAttendee(userid : String, eventid : String) {
    try{
        await connectDB(); // connect to db

        const event = Event.findOne({eventid}).orFail();

        // validate inputs
        if (!userid || !eventid) {
            return Response.json("Invalid Comment.", { status: 400 });
        }

        await Event.deleteOne({eventid},{$push: {attendeeIds : userid} }).orFail();
        //await event.save();

        return Response.json("ID Deleted", { status: 200 });
    }
    catch(err){
        Response.json(err, { status: 400});
    }
}
