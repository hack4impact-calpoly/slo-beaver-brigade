import mongoose, { Schema } from "mongoose";

export type IWaiver = {
    dependents: string[];
};

const digitalWaiverSchema = new Schema({
    dependents: {
        type: [String],
        default: [],
        required: false,
    },
});

const Waiver =
    mongoose.models.Waiver || mongoose.model("waiver", digitalWaiverSchema);

export default Waiver;
