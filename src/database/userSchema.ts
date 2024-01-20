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

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], required: true },
  eventsAttended: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  volunteerEventsAttended: [{ type: Schema.Types.ObjectId, ref: 'VolunteerEvent' }],
  age: { type: Number, required: true },
  gender: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
