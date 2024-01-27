import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
// import { Event } from "@models/event";


export async function GET() {
  await connectDB() // function from db.ts before

	try {
			// query for all blogs and sort by date
	    const blogs = await Event.find().sort({ date: -1 }).orFail()
			// send a response as the blogs as the message
	    return blogs
	} catch (err) {
    console.log(`error: ${err}`)
	  return null
	}
}


