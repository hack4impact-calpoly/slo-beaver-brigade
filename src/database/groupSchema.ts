import mongoose, { Mongoose, Schema } from "mongoose";

export type IGroup = {
    _id: string;
    group_name: string;
    groupees: string[];
    temporary?: boolean;
};

const Group = new Schema({
    group_name: { type: String, required: true },
    groupees: { type: [Schema.Types.ObjectId], required: true, default: [] },
    temporary: { type: Boolean, required: false, default: false },
});

export default mongoose.models["groups"] || mongoose.model("groups", Group);
