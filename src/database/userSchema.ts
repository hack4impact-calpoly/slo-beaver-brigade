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

enum Role {
    "user",
    "supervisor",
    "admin",
}

export type IUser = {
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    role: "user" | "supervisor" | "admin";
    eventsAttended: [Schema.Types.ObjectId];
    digitalWaiver: Schema.Types.ObjectId | null;
    groupId: Schema.Types.ObjectId | null;
};

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    role: {
        type: String,
        enum: Role,
        default: "user",
        required: true,
    },
    eventsAttended: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: [],
    },
    groupId: { type: Schema.Types.ObjectId, required: false },
    digitalWaiver: { type: Schema.Types.ObjectId, required: false },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
