import connectDB from "@database/db";
import User from "@database/userSchema";

// Dynamic GET request to get user by ID
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    // grab id from param
    const id = params.userId;

    // search for user in db
    const user = await User.findById(id);

    // check if user exists
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}