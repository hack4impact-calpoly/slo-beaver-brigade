import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import EventTemplate, { IEventTemplate } from "@database/eventTemplateSchema";
import { revalidateTag } from "next/cache";

type IParams = {
    params: {
        eventTemplateId: string;
    };
};

export async function GET(req: NextRequest, {params} : IParams) {
    await connectDB();
    const { eventTemplateId } = params;

    try {
        const eventTemplate = await EventTemplate.findById(eventTemplateId).orFail();
        return NextResponse.json(eventTemplate);
    } catch (err: any) {
        return NextResponse.json(
            "Event Template not found with EventTemplateId = " + eventTemplateId + " " + err, 
            {status: 404}
        )
    }

}

export async function DELETE(req: NextRequest, {params}: IParams) {
    await connectDB();
    const { eventTemplateId } = params;

    try {
        const eventTemplate = await EventTemplate.findByIdAndDelete(eventTemplateId).orFail();
        revalidateTag("eventTemplates");

        // For now, I didn't make it so other tables would be affected by this. 
        // Not sure if this will be the case later, but the Event Template schema hasn't been merged with main at time of 
        // working on this.

        return NextResponse.json("Event template deleted: " + eventTemplateId, {
            status: 200,
        });

    } catch (err: any) {
        return NextResponse.json(
            "Event not deleted (EventTemplateId = " + eventTemplateId + ") " + err,
            { status: 400 }
        );

    }
}

export async function PUT(req: NextRequest, {params}: IParams) {
    await connectDB();
    const {eventTemplateId} = params;

    try {
        const eventTemplate = await EventTemplate.findById(eventTemplateId).orFail();

        // TODO: COMPARE VALUES OF BODY WITH EVENT TEMPLATE OBJECT (WILL NEED SCHEMA COMPLETED)

        await eventTemplate.save();
        revalidateTag("eventTemplates");
        return NextResponse.json("Event template updated: " + eventTemplate, { status: 200 });

    } catch (err: any) {
        return NextResponse.json(
            "Event template not updated (EventId = " + eventTemplateId + ") " + err,
            { status: 400 }
        );

    }
}
