import { sign } from "crypto";
import mongoose, { Schema } from "mongoose";

export type ISignedWaiver = {
    _id: string;
    signeeId: string;
    signeeName: string;
    dependents: string[];
    partyMembers: { name: string; hasSigned: Boolean }[];
    eventId: string;
    dateSigned: Date;
    waiverVersion: number;
};

const signedWaiverSchema = new Schema({
    signeeId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    signeeName: {
        type: String,
        required: true,
    },
    dependents: {
        type: [String],
        default: [],
        required: false,
    },
    partyMembers: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                },
                hasSigned: {
                    type: Boolean,
                    default: false,
                    required: true,
                },
            },
        ],
        default: [],
        required: false,
    },
    eventId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    dateSigned: {
        type: Date,
        default: Date.now,
    },
    waiverVersion: {
        type: Number,
        required: true,
    },
});

const SignedWaiver =
    mongoose.models["devSignedWaivers"] || mongoose.model("devSignedWaivers", signedWaiverSchema);

export default SignedWaiver;
