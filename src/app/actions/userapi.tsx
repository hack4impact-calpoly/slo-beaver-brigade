'use server'
import connectDB from "@database/db";
import User from "@database/userSchema";
export async function doesUserExist(email: string){
    try {
            await connectDB();


            // search for user in db
            const user = await User.findOne({email: email});

            // check if user exists
            if (!user) {
                return false
            }
            return true

        } catch (error) {
            return false
        }

}