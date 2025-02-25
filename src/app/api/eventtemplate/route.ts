import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import EventTemplate, { IEventTemplate } from "@database/eventTemplateSchema";
import { revalidateTag } from "next/cache";




// FOR CREATING AN EVENT TEMPLATE

export async function POST(req: NextRequest) {
    await connectDB();
    const eventTemplate: IEventTemplate = await req.json();

    try {
        const newEventTemplate = new EventTemplate(eventTemplate);


        const createdEventTemplate = await newEventTemplate.save();
        revalidateTag("eventTemplates");



    } catch (err: any) {
        if (err.name === "ValidationError") {
            // Handle validation errors
            const errors = Object.values(err.errors).map(
                (error: any) => error.message
            );
            return NextResponse.json("Validation error: " + errors.join(", "), {
                status: 400,
            });
        } else {
            return NextResponse.json("Event Template not added: " + err, {
                status: 400,
            });
        }

    }

}