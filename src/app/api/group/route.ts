import { NextRequest, NextResponse  } from "next/server";
import connectDB from "@database/db";
import Group from "@database/groupSchema";

export async function GET(){
    await connectDB(); //connecting to the database

    try{
        const groups = await Group.find({});
        return NextResponse.json(groups);
    } catch (err){
        return NextResponse.json({error: "Failed to fetch groups: " }, {
            status: 400,
        });
    }
}