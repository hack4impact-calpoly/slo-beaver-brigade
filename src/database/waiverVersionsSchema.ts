import mongoose, { Schema } from "mongoose";

export type IWaiverVersion = {
  _id: string;
  version: number;
  body: string;
  acknowledgement: string;
  dateCreated: Date;
  isActiveWaiver: boolean;
};

const waiverVersionsSchema = new Schema({
  version: {
    type: Number,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  acknowledgement: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  isActiveWaiver: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const WaiverVersion =
  mongoose.models["devWaiverVersions"] ||
  mongoose.model("devWaiverVersions", waiverVersionsSchema);

export default WaiverVersion;
