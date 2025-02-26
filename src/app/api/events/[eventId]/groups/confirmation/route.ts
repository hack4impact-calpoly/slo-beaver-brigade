import connectDB from "database/db";
import { NextRequest, NextResponse } from "next/server";
import Group from "@database/groupSchema";

import { formatDate, formatDateTimeRange } from "app/lib/dates";
import Event, { IEvent } from "database/eventSchema";
import nodemailer from "nodemailer";
import User from "database/userSchema";

const transporter = nodemailer.createTransport({
    service: "gmail",
    tls: {
        ciphers: "SSLv3",
    },
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
    },
});

function formatDateToGoogleCalendar(date: Date) {
    date = new Date(date);
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
}

async function sendInvite(emails: string[], event: IEvent) {
    const urlEncodedName = encodeURIComponent(event.eventName);
    const startTime = formatDateToGoogleCalendar(event.startTime);
    const endTime = formatDateToGoogleCalendar(event.endTime);
    const encodedDescription = encodeURIComponent(event.description);
    const encodedLocation = encodeURIComponent(event.location);

    const result = await new Promise((resolve, reject) => {
        transporter.sendMail(
            {
                from: process.env.GMAIL_USER,
                to: emails,
                subject: `${event.eventName} Invite`,
                html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${event.eventType} Invite</title>
<style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { width: 80%; margin: 0 auto; padding: 20px; }
    .button { padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px; }
    .footer { margin-top: 20px; font-size: 0.8em; color: #777; }
</style>
</head>
<body>
<div class="container">
    <h1>${event.eventName} (${event.eventType}) Invite</h1>
    <p>You have been invited to sign up for ${event.eventName}.</p>
    <p>Date: <strong>${formatDate(event.startTime)}</strong></p>
    <p>Time: <strong>${formatDateTimeRange(event.startTime, event.endTime)}</strong></p>
    <p>If you would like to join please register for the event, it will be the first event to show in unregistered events.</p>
    <a href="${process.env.BASE_URL}" class="button">Sign Up</a>
    
    <div class="footer">
        <p>If you have any questions, please do not hesitate to contact us at <a href="mailto:info@example.com">info@example.com</a>.</p>
    </div>
</div>
</body>
</html>

    `,
            },
            (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(info);
                }
            }
        );
    });
}

export async function POST(
    req: NextRequest,
    { params }: { params: { eventId: string } }
) {
    // get event
    // get email to send to
    const { groupIds } = await req.json();
    if (!groupIds) {
        return NextResponse.json("No groups provided.", { status: 200 });
    }
    try {
        // flat map all user ids into one set
        const userIds = new Set<string>();
        const emails: string[] = [];

        const event = await Event.findById(params.eventId).orFail();
        const groups = await Group.find({ _id: { $in: groupIds } }).lean();
        // make a query to User to get all emailsj
        for (let group of groups) {
            for (let userId of group.groupees) {
                userIds.add(userId);
            }
        }
        const users = await User.find({
            _id: { $in: Array.from(userIds) },
        }).lean();
        users.forEach((user) => emails.push(user.email));
        sendInvite(emails, event);

        return NextResponse.json("Sent email.");
    } catch (err) {
        return NextResponse.json("Failed to get event.", { status: 500 });
    }
}
function reject(err: Error) {
    throw new Error("Function not implemented.");
}
