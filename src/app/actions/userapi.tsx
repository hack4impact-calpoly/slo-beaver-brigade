'use server'
import connectDB from "@database/db";
import User, { IUser } from "@database/userSchema";
export async function doesUserExist(email: string){
    try {
            await connectDB();


            // search for user in db
            const user: IUser | null= await User.findOne({email: email});

            // check if user exists
            if (!user) {
                return false
            }
            return true

        } catch (error) {
            return false
        }

}
export async function getUserFromEmail(email: string){
    email = email.toLowerCase()
    try {
            await connectDB();


            // search for user in db
            const user: IUser | null= await User.findOne({email: email});

            // check if user exists
            if (!user) {
                return null
            }
            return JSON.stringify(user)

        } catch (error) {
            return null
        }

}

export async function createGuestFromEmail(email: string, zipcode: string, firstName: string, lastName: string){
 try {
            await connectDB();

            // search for user in db
            const user: IUser = await User.create({role: "guest", email, firstName, lastName, zipcode})

            console.log("Created guest user.", user)
            return JSON.stringify(user)

        } catch (error) {
            console.log(error)
            return null
        }
}

export async function transitionGuestById(id: string, gender: string, age: number){
 try {
            await connectDB();

            // search for user in db
            const user: IUser = await User.findByIdAndUpdate(id, {role: 'user', gender, age}).orFail()

            console.log("Made user to guest.", user)
            return JSON.stringify(user)

        } catch (error) {
            console.log(error)
            return null
        }
}



