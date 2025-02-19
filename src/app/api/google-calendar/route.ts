import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    // Log environment variables (remove sensitive info in production)
    console.log('Environment check:', {
      hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
    });

    // Make sure we have all required environment variables
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CALENDAR_ID) {
      throw new Error('Missing required environment variables');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Log the event data we're about to send
    console.log('Creating event with data:', {
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      summary: body.summary,
      start: body.start,
      end: body.end,
    });

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: body.summary,
        location: body.location,
        description: body.description,
        start: body.start,
        end: body.end,
        recurrence: body.recurrence,
      },
    });

    console.log('Event created successfully:', event.data);
    return NextResponse.json(event.data);
  } catch (error: any) {
    console.error('Detailed API error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      env: {
        hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
      }
    });

    return NextResponse.json(
      { 
        error: 'Failed to create calendar event', 
        details: error.message,
        env: {
          hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
          hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
          hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
        }
      },
      { status: 500 }
    );
  }
}