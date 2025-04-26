"use server"
import User, {IUser} from "@database/userSchema";
import connectDB from "database/db";
import Log from "@database/logSchema";
import { currentUser } from "@clerk/nextjs/server";

export const makeUserAdmin = async (email: string, adminType: string) => {
  await connectDB();
  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: adminType },
      { new: true }
    );

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    // Get the currently logged-in user (the admin making the change)
    const curUser = await currentUser();
    if (!curUser) {
      throw new Error("No admin user found");
    }

    // Find the admin user in the database
    const adminUser: IUser= await User.findOne({ email: curUser.emailAddresses[0].emailAddress }).lean().orFail() as IUser;;
    if (!adminUser) {
      throw new Error(`Admin user with email ${curUser.emailAddresses[0].emailAddress } not found`);
    }

    // add an audit log entry
    await Log.create({
      user: `${curUser.firstName} ${curUser.lastName}`,
      action: `changed ${user.firstName} ${user.lastName} to ${adminType}`,
      date: new Date(),
    });

    return user.toObject();
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Error updating user role: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while updating user role');
      }
  }
};