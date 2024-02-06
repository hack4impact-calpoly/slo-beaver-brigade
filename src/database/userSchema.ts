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

type User = {
    email: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    role: "user" | "supervisor" | "admin";
    eventsAttended: [Schema.Types.ObjectId];
    digitalWaiver: Schema.Types.ObjectId | null;
    groupId: number | null;
};

enum Role {
    "user",
    "supervisor",
    "admin",
}

const UserSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
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
    groupId: { type: Number, required: false },
    digitalWaiver: { type: Schema.Types.ObjectId, required: false },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
