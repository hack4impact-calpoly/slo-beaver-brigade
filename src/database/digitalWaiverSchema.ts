import mongoose, { Schema } from "mongoose";

export type IWaiver = {
    _id: string;
    parentUserId: string;
    eventId: Schema.Types.ObjectId;
    dependents: string[];
};

const digitalWaiverSchema = new Schema({
    parentUserId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    eventId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    dependents: {
        type: [String],
        default: [],
        required: false,
    },
});

const Waiver =
    mongoose.models["devWaiver"] || mongoose.model("devWaiver", digitalWaiverSchema);

export default Waiver;
