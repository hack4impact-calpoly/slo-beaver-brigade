import connectDB from "@database/db";
import Group from "@database/groupSchema";

// Dynamic GET request to get group by ID
export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    await connectDB();

    // grab id from param
    const id = params.groupId;

    // search for group in db
    const group = await Group.findById(id);

    // check if user exists
    if (!group) {
      return Response.json({ error: "Group not found" }, { status: 404 });
    }

    return Response.json({ group });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
