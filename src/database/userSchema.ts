import mongoose, { Schema } from "mongoose";

export interface IUser {
  email: string;
  password: string;
}

//! Example user schema. Not guaranteed to work
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
