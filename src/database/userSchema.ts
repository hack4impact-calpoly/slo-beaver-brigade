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
    role: "user" | "admin";
    digitalWaiver: Schema.Types.ObjectId | null;
    eventsAttended: [Schema.Types.ObjectId];
};

const UserSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], required: true },
    digitalWaiver: { type: Schema.Types.ObjectId, required: false },
    eventsAttended: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: [],
    },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
