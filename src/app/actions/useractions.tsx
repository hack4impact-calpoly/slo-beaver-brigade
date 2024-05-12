"use server"

import connectDB from "@database/db";
import Event, { IEvent } from "@database/eventSchema";
import User from "@database/userSchema";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import https from "https";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";
import { URL } from "url";

const s3Client = new S3Client({
    region: process.env.S3_REGION as string,
    credentials: {
        accessKeyId: process.env.IAM_ACCESS_KEY as string,
        secretAccessKey: process.env.IAM_SECRET_KEY as string
    },
})
export async function addAttendee(userid : string, eventid : string) {
    try{
    
        console.log("here ", userid, typeof userid, eventid, typeof eventid )
        await connectDB(); // connect to db

        const event: IEvent = await Event.findOneAndUpdate(
            { _id: eventid },
            { $addToSet: { attendeeIds: userid } },
            { new: true }
          ).orFail();

        // validate inputs
        if (!userid || !eventid) {
            return false
        }

        // get date of event
        const startTime = event.startTime
        const endTime = event.endTime
        await User.updateOne({_id:userid},{$addToSet: {eventsAttended : {eventId: eventid, startTime, endTime}}}).orFail();

        revalidateTag("events")
        return true 
    }
    catch(err){
        console.log("Error bro", err)
       return false
    }
}
export async function addToRegistered(userid : string, eventid : string, waiverId: string) {
    try{
    
        console.log("here ", userid, typeof userid, eventid, typeof eventid )
        await connectDB(); // connect to db


        // validate inputs
        if (!userid || !eventid || !waiverId) {
            return false
        }

        await Event.updateOne({_id: eventid},{$addToSet: {registeredIds : userid} }).orFail();
        await User.updateOne({_id:userid},{$addToSet: {eventsRegistered : {eventId: eventid, digitalWaiver: waiverId }}}).orFail();

        revalidateTag("events")
        return true
    }
    catch(err){
        console.log("Error bro", err)
        return false
    }
}



export  const createPresignedUrlWithClient = async ( key: string, type: string) => {
    console.log(key)
  const command = new PutObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key, ContentType: type });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

function put(url: string | URL, data: BlobPart) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      { method: "PUT", headers: { "Content-Length": new Blob([data]).size } },
      (res) => {
        let responseBody = "";
        res.on("data", (chunk) => {
          responseBody += chunk;
        });
        res.on("end", () => {
          resolve(responseBody);
        });
      },
    );
    req.on("error", (err) => {
      reject(err);
    });
    req.write(data);
    req.end();
  });
}


export async function getImageUploadFileURL(fileName: string){
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`

}
