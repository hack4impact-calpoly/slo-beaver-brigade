import mongoose, { Schema } from "mongoose";

export type ITemplateEvent = {
    _id: string;
    eventName: string;
    eventImage: string | null;
    eventType: string | null;
    groupsOnly?: boolean;
    location: string;
    description: string;
    checklist: string;
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
const eventTemplateSchema = new Schema({
    eventName: { type: String, required: false },
    eventImage: { type: String, required: false },
    eventType: { type: String, required: false },
    location: { type: String, required: false },
    description: { type: String, required: false },
    checklist: { type: String, required: false },
    groupsOnly: { type: Boolean, required: false },
    wheelchairAccessible: { type: Boolean, required: false },
    spanishSpeakingAccommodation: {
        type: Boolean,
        required: false,
    },
    startTime: { type: Date, required: false },
    endTime: { type: Date, required: false },
    volunteerEvent: { type: Boolean, required: false },
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
    mongoose.models["devEventsTemplates"] ?? mongoose.model("devEventsTemplates", eventTemplateSchema);

export default Event;
