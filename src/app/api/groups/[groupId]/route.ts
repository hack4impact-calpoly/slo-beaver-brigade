import connectDB from "@database/db";
import Group from "@database/groupSchema";
import Event from "@database/eventSchema";
import Log from "@database/logSchema";
import { getUserDbData } from "app/lib/authentication";

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

        return Response.json(group);
    } catch (error) {
        return Response.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}


export async function DELETE(request: Request, {params}: {params: { groupId: String}}){

    try {
        await connectDB();

        // Destructure params to get group id

        const id = params.groupId;

        // Delete group from groups table
        const group = await Group.findByIdAndDelete(id);

        // Check if this deletion worked (returned a group)
        if (!group) {
            return Response.json({ error: "Group not found" }, { status: 404 });
        }

        // Remove all references in Events groupsAllowed array
        await Event.updateMany(
            {groupsAllowed: id}, 
            {$pull: {groupsAllowed: id}},
        );


        // Log this deletion

        const user = await getUserDbData();
        if (user == null) {
            return Response.json("Could not fetch user data. ", {
                    status: 500,
                });
        }

        const userData = JSON.parse(user);

        await Log.create({
            user: `${userData.firstName} ${userData.lastName}`,
            action: `deleted group ${group.group_name}`,
            date: new Date(),
            link: null
          });



        // TODO: Will probably need to write a method for deleting group from EventTemplate
        

        return Response.json(group);


    } catch (err: any) {
        return Response.json(
            { error: (err as Error).message},
            { status: 500}
        )
    }




};