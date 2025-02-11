import mongoose, { Schema } from "mongoose";

export type ILog = {
    _id: string;
    user: string;
    action: string;
    date: Date;
    link: Schema.Types.ObjectId;
};

const logSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    link: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

const Log =
    mongoose.models["logTest"] || mongoose.model("logTest", logSchema);

export default Log;
