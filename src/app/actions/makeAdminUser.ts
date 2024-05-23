"use server"
import User from "@database/userSchema";
import connectDB from "database/db";

const makeAdminUser = async (email: string) => {
    await connectDB();
  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: "user" },
      { new: true }
    );

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    return user.toObject();
  } catch (error) {
    throw new Error(`Error updating user role: ${error.message}`);
  }
};

export default makeAdminUser;
