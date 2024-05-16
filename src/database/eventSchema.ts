import mongoose, { Schema } from "mongoose";

export type IEvent = {
    _id: string;
    eventName: string;
    eventImage: string | null;
    eventType: string | null;
    location: string;
    description: string;
    checklist: string;
    wheelchairAccessible: boolean;
    spanishSpeakingAccommodation: boolean;
    startTime: Date;
    endTime: Date;
    volunteerEvent: boolean;
    groupsAllowed: Schema.Types.ObjectId[] | null;
    attendeeIds: Schema.Types.ObjectId[];
    registeredIds: Schema.Types.ObjectId[];
};

// Mongoose schema
const eventSchema = new Schema({
    eventName: { type: String, required: true },
    eventImage: { type: String, required: false },
    eventType: { type: String, required: false },
    location: { type: String, required: true },
    description: { type: String, required: true },
    checklist: { type: String, required: false, default: "N/A" },
    wheelchairAccessible: { type: Boolean, required: false, default: false},
    spanishSpeakingAccommodation: { type: Boolean, required: false, default: false},
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    volunteerEvent: { type: Boolean, required: true },
    groupsAllowed: { type: [Schema.Types.ObjectId], required: false },
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
    mongoose.models["eventsTest"] ?? mongoose.model("eventsTest", eventSchema);

export default Event;
