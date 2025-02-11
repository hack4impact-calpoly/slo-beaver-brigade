import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Use service account authentication
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: body,
    });

    console.log('Event created successfully:', event.data);
    return NextResponse.json(event.data);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}