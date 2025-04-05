import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Event, { IEventTemplate } from "@database/eventTemplateSchema";
import { revalidateTag } from "next/cache";




// FOR CREATING AN EVENT TEMPLATE

export async function POST(req: NextRequest) {
    await connectDB();
    const eventTemplate: IEventTemplate = await req.json();

    try {
        const newEventTemplate = new Event(eventTemplate);


        const createdEventTemplate = await newEventTemplate.save();
        revalidateTag("eventTemplates");

        return NextResponse.json(newEventTemplate, {
            status: 200,
        });



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

// GET ALL EVENT TEMPLATES
export async function GET(req: NextRequest) {
    await connectDB();

    try {
        const eventTemplates = await Event.find({}).orFail();
        return NextResponse.json(eventTemplates);
    } catch (err: any) {
        return NextResponse.json(
            "No event templates found " + err, 
            {status: 404}
        )
    }

}