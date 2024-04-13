import mongoose, { Mongoose, Schema } from "mongoose";

export type IGroup = {
    _id: Schema.Types.ObjectId;
    group_name: string;
    groupees: Schema.Types.ObjectId[];
};

const Group = new Schema<IGroup>({
    group_name: { type: String, required: true },
    groupees: { type: [Schema.Types.ObjectId], required: true, default: [] },
});

export default mongoose.models["groups"] || mongoose.model("groups", Group);
