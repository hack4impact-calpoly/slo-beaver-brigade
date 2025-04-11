import mongoose, { Schema } from "mongoose";

export type IEvent = {
    _id: string;
    eventName: string;
    eventImage: string | null;
    eventType: string | null;
    groupsOnly?: boolean;
    location: string;
    description: string;
    checklist: string[];
    wheelchairAccessible: boolean;
    spanishSpeakingAccommodation: boolean;
    startTime: Date;
    endTime: Date;
    volunteerEvent: boolean;
    groupsAllowed: string[];
    attendeeIds: string[];
    registeredIds: string[];
};

// Mongoose schema
// automatically converts object ids to strings
mongoose.Schema.ObjectId.get((v) => v.toString());
mongoose.Schema.Types.Date.get((v) => v.toString());
const eventSchema = new Schema({
    eventName: { type: String, required: true },
    eventImage: { type: String, required: false },
    eventType: { type: String, required: false },
    location: { type: String, required: true },
    description: { type: String, required: true },
    checklist: { type: [String], required: false, default: [] },
    groupsOnly: { type: Boolean, required: false, default: false },
    wheelchairAccessible: { type: Boolean, required: false, default: false },
    spanishSpeakingAccommodation: {
        type: Boolean,
        required: false,
        default: false,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    volunteerEvent: { type: Boolean, required: true },
    groupsAllowed: {
        type: [Schema.Types.ObjectId],
        required: false,
        default: [],
    },
    attendeeIds: {
        type: [Schema.Types.ObjectId],
        required: false,
        default: [],
    },
    registeredIds: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: [],
    },
});

const Event =
    mongoose.models["devEvents"] ?? mongoose.model("devEvents", eventSchema);

export default Event;
