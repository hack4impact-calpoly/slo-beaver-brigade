"use server"

import connectDB from "@database/db";
import Event from "@database/eventSchema";
import User from "@database/userSchema";
import { NextResponse } from "next/server";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3"

const s3Client = new S3Client({
    region: process.env.S3_REGION as string,
    credentials: {
        accessKeyId: process.env.IAM_ACCESS_KEY as string,
        secretAccessKey: process.env.IAM_SECRET_KEY as string
    }
})
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


export async function uploadFileS3Bucket(formData: FormData){
    const file: File | null = formData.get("file") as File
    if (!file){
        return null
    }
    
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const urlEncodedFilename = encodeURI(file.name)
    console.log(file)
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key:  file.name,
        Body: fileBuffer,
        ContentType: file.type
    }
    const cmd = new PutObjectCommand(params)
    try{
        await s3Client.send(cmd)
        console.log('File was sent uploaded!')
        return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${urlEncodedFilename}`
    }
    catch(err){
        return null
    }
    
}