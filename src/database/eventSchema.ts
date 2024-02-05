import mongoose, { Schema } from "mongoose";

export type IEvent = {
    eventName: string;
    location: string;
    wheelchairAccessible: boolean;
    spanishSpeakingAccommodation: boolean;
    startTime: Date;
    endTime: Date;
    volunteerEvent: boolean;
    groupsAllowed: number[];
    attendeeIds: Schema.Types.ObjectId[];
};

// Mongoose schema
const eventSchema = new Schema<IEvent>({
    eventName: { type: String, required: true },
    location: { type: String, required: true },
    wheelchairAccessible: { type: Boolean, required: true },
    spanishSpeakingAccommodation: { type: Boolean, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    volunteerEvent: { type: Boolean, required: true },
    groupsAllowed: { type: [Number], required: false },
    attendeeIds: { type: [Schema.Types.ObjectId], required: true, default: [] },
});

const Event =
    mongoose.models["events"] || mongoose.model("events", eventSchema);

export default Event;
