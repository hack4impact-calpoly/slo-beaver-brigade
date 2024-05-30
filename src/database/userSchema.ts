/*
Things to include in the schema

    user role : user or admin : String

    events user went to : id attached to the event : List

    volunteer events users went to : id's of the volunteer event : List

    age : Integer

    gender: String

    Acceptance Criteria
    Exactly as above
*/

import mongoose, { Schema } from "mongoose";
import Event from "./eventSchema";
import { calcHours } from "app/lib/hours";

enum Role {
    "user",
    "supervisor",
    "admin",
    "guest",
}

export type EventInfo = {
    eventId: Schema.Types.ObjectId;
    digitalWaiver: Schema.Types.ObjectId | null;
};

export type AttendedEventInfo = {
    eventId: string;
    startTime: Date;
    endTime: Date;
};

export type IUser = {
    _id: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    role: "user" | "supervisor" | "admin" | "guest";
    eventsRegistered: EventInfo[];
    eventsAttended: AttendedEventInfo[];
    groupId: Schema.Types.ObjectId | null;
    recieveNewsletter: boolean;
};

//groupId and digitalWaiver seem to require a schema
//currently there is no schema for them so I am leaving them as null for now
//can groupId just be a string and digitalWaiver be a boolean?
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false },
    zipcode: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: false },
    gender: { type: String, required: false },
    role: {
        type: String,
        enum: Role,
        default: "user",
        required: true,
    },
    eventsRegistered: {
        type: [
            {
                _id: false,
                eventId: { type: Schema.Types.ObjectId, required: true },
                digitalWaiver: { type: Schema.Types.ObjectId, required: false },
            },
        ],
        default: [],
        required: false,
    },
    eventsAttended: {
        type: [
            {
                _id: false,
                eventId: { type: Schema.Types.ObjectId, required: true },
                startTime: { type: Date, required: false, default: Date.now },
                endTime: { type: Date, required: false, default: Date.now },
            },
        ],
        default: [],
        required: false,
    },
    groupId: { type: Schema.Types.ObjectId, required: false },
    recieveNewsletter: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const User =
    mongoose.models["userTest"] || mongoose.model("userTest", UserSchema);

export default User;
