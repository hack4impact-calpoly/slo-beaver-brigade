import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Group, { IGroup } from "@database/groupSchema";

type IParams = {
    params: {
        groupId: string;
    };
};

export async function GET(req: NextRequest, { params }: IParams) {
    await connectDB(); // connect to db
    const { groupId } = params; // another destructure
    console.log(groupId);

    try {
        const group = await Group.findById(groupId).orFail();
        return NextResponse.json(group);
    } catch (err) {
        return NextResponse.json(
            "Group not found (GroupId = " + groupId + ") " + err,
            { status: 404 }
        );
    }
}
export async function DELETE(req: NextRequest, { params }: IParams) {
    await connectDB(); // connect to db
    const { groupId } = params; // another destructure
    console.log(groupId);

    try {
        const group = await Group.findByIdAndDelete(groupId).orFail();
        return NextResponse.json("Group deleted successfully");
    } catch (err) {
        return NextResponse.json(
            "Group not found (GroupId = " + groupId + ") " + err,
            { status: 404 }
        );
    }
}
