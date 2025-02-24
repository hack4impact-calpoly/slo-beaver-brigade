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
