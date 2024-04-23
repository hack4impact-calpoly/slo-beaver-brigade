import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@database/db";
import User, { IUser } from "@database/userSchema";

export async function getUserDbData(){
const clerk_user = await currentUser();
if (!clerk_user){
    return null
}
const dbId = clerk_user?.unsafeMetadata["dbId"]
if (!dbId){
    return null
}
  await connectDB()
  try{
    const user: IUser | null = await User.findById(dbId).orFail();
    return user;
  }
  catch(err){
    return null
  }
}