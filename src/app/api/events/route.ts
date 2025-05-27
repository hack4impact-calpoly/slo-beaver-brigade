import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@database/db';
import Event, { IEvent } from '@database/eventSchema';
import Group from '@database/groupSchema';
import { revalidateTag } from 'next/cache';
import { SortOrder } from 'mongoose';
import { cookies } from 'next/headers';
import { BareBoneIUser } from 'app/components/navbar/NavbarParents';
import User from 'database/userSchema';
import { IUser } from 'app/admin/users/page';
import Log from '@database/logSchema';
import { getUserDbData } from 'app/lib/authentication';

interface BuggyIUser extends BareBoneIUser {
  id: string;
}
export async function GET(request: Request) {
  await connectDB(); // connect to db
  console.log('GET /api/events');
  const { searchParams } = new URL(request.url);
  const sort_order = searchParams.get('sort');
  let sort: SortOrder = -1;

  if (sort_order && sort_order == 'asc') {
    sort = 1;
  }
  let user = null;

  // get current user if applicable
  try {
    const userCookie = cookies().get('user')?.value;
    if (userCookie) {
      user = JSON.parse(userCookie) as BuggyIUser;

      // query db for user with _id of user from cookie
      const userDoc = (await User.findById(user._id || user.id)
        .lean()
        .orFail()) as IUser;

      if (userDoc.role === 'admin' || userDoc.role === 'super-admin') {
        const events = await Event.find().sort({ startTime: sort }).lean();
        return NextResponse.json(events, { status: 200 });
      }
      // Query for all groups that the user is in
      const userGroups = await Group.find({ groupees: user._id }).lean();
      const userGroupIds = userGroups.map((group) => group._id);

      // Query for all events that are either not group-only or are in user's groups
      const events = await Event.find({
        $or: [
          { groupsOnly: false },
          { groupsOnly: { $exists: false } },
          { groupsAllowed: { $in: userGroupIds } },
          { registeredIds: { $in: [user._id] } },
          { attendeeIds: { $in: [user._id] } },
        ],
      })
        .sort({ startTime: sort })
        .lean();

      return NextResponse.json(events, { status: 200 });
    } else {
      // If not user, simply return all events that don't have groupsOnly set to true
      const events = await Event.find({
        $or: [{ groupsOnly: false }, { groupsOnly: { $exists: false } }],
      })
        .sort({ startTime: sort })
        .lean();

      return NextResponse.json(events, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json('Failed to fetch events: ' + err, {
      status: 400,
    });
  }
}

// export async function POST(req: NextRequest) {
//   await connectDB() // connect to db

//   //strip Event data from req json
//   const { eventName, description, wheelchairAccessible, spanishSpeakingAccommodation, startTime, endTime, volunteerEvent, groupsAllowed, registeredIds }: IEvent = await req.json()

//   //create new event or return error
//   try {
//     const newEvent = new Event({ eventName, description, wheelchairAccessible, spanishSpeakingAccommodation, startTime, endTime, volunteerEvent, groupsAllowed, registeredIds })
//     await newEvent.save()
//     return NextResponse.json("Event added successfull: " + newEvent, { status: 200 });
//   } catch (err) {
//     return NextResponse.json("Event not added: " + err, { status: 400 });
//   }
// }

export async function POST(req: NextRequest) {
  await connectDB();
  const event: IEvent = await req.json();
  let userData: IUser;

  // create new event or return error
  try {
    const newEvent = new Event(event);

    const createdEvent = await newEvent.save();
    revalidateTag('events');

    const userRes = await getUserDbData();
    if (userRes) {
      userData = JSON.parse(userRes);
    } else {
      return NextResponse.json('Could not fetch user data. ', {
        status: 500,
      });
    }

    await Log.create({
      user: `${userData.firstName} ${userData.lastName}`,
      action: `created event ${createdEvent.eventName}`,
      date: new Date(),
      link: createdEvent._id,
    });

    return NextResponse.json(createdEvent, {
      status: 200,
    });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      // Handle validation errors
      const errors = Object.values(err.errors).map(
        (error: any) => error.message
      );
      return NextResponse.json('Validation error: ' + errors.join(', '), {
        status: 400,
      });
    } else {
      return NextResponse.json('Event not added: ' + err, {
        status: 400,
      });
    }
  }
}
