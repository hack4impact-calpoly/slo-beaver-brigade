import mongoose, { Schema } from "mongoose";

export type IWaiver = {
    _id: string;
    eventId: Schema.Types.ObjectId;
    dependents: string[];
};

const digitalWaiverSchema = new Schema({
    eventId: {
        type: String,
        required: true,
    },
    dependents: {
        type: [String],
        default: [],
        required: false,
    },
});

const Waiver =
    mongoose.models["waiver"] || mongoose.model("waiver", digitalWaiverSchema);

export default Waiver;
