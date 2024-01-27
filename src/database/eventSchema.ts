
import mongoose, { Schema } from "mongoose";

export type IEvent = {
    eventName: string;
    description: string;
    wheelchairAccessible: boolean;
    spanishSpeakingAccommodation: boolean;
    date: Date;
    attendeeIds: string[];
};

// Mongoose schema 
const eventSchema = new Schema<IEvent>({
    eventName: { type: String, required: true },
    description: { type: String, required: true },
    wheelchairAccessible: { type: Boolean, required: true },
    spanishSpeakingAccommodation: { type: Boolean, required: true },
    date: { type: Date, required: true },
    attendeeIds: { type: [String], required: true, default: [] },
});

const Event = mongoose.models['events'] || mongoose.model('events', eventSchema);

export default Event;
