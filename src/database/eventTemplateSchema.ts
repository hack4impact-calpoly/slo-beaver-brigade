import mongoose, { Schema } from "mongoose";

export interface IEventTemplate {
  _id: string;
  eventName: string;
  location: string;
  description: string;
  wheelchairAccessible: boolean;
  spanishSpeakingAccommodation: boolean;
  volunteerEvent: boolean;
  groupsAllowed: string[] | null;
  registeredIds: string[];
  startTime: Date;
  endTime: Date;
}


const eventTemplateSchema = new Schema({
  eventName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  wheelchairAccessible: {
    type: Boolean,
    default: false,
  },
  spanishSpeakingAccommodation: {
    type: Boolean,
    default: false,
  },
  volunteerEvent: {
    type: Boolean,
    default: false,
  },
  groupsAllowed: {
    type: [String],
    default: null,
  },
  registeredIds: {
    type: [String],
    default: [],
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

const EventTemplate =
  mongoose.models.eventTemplatesTest ||
  mongoose.model("eventTemplatesTest", eventTemplateSchema);

export default EventTemplate;
