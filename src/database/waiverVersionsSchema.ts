import mongoose, { Schema } from "mongoose";

export type IWaiverVersion = {
    _id: string;
    version: number;
    body: string;
    acknowledgement: string;
    dateCreated: Date;
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
});

const WaiverVersion =
    mongoose.models["devWaiverVersions"] || mongoose.model("devWaiverVersions", waiverVersionsSchema);

export default WaiverVersion;