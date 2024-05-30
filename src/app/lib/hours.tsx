//LIST OF HELPFUL FUNCTIONS FOR HOURS
import { IEvent } from '../../database/eventSchema';
import {IUser} from '../../database/userSchema'
import { getDuration } from './dates';

// This function takes a list of events and calculates the total duruation of the events
export function calcHours(events: IEvent[]) {
  let totalTime = 0;
  events.forEach((event) => {
    totalTime += getDuration(event.startTime, event.endTime);
  });
  return totalTime;
}

// This function takes a list of events and calculates the total volunteer hours accumulated by all attendees
export function calcHoursForAll(events: IEvent[]) {
  let totalTime = 0;
  events.forEach((event) => {
    totalTime +=
      getDuration(event.startTime, event.endTime) * event.attendeeIds.length;
  });
  return totalTime;
}

// This function takes a list of events and calculates the total volunteer hours accumulated by all attendees
export function eventHours(event: IEvent) {
  let totalTime = getDuration(event.startTime, event.endTime) * event.attendeeIds.length;
  return Math.floor(totalTime / 60) + 'h ' + totalTime % 60 + 'min';
}

//This function takes a list of users and calculates the total volunteer hours (without minutes) by all attendees
//for a specific event taking into account that individual hours can be modified
export function eventHoursSpecific(users: IUser[], event : IEvent) {
  let totalTime= 0;
  users.forEach(user => {
    if(user.eventsAttended){
      user.eventsAttended.forEach(eventAttended => {
        if(eventAttended.eventId.toString() === event._id){
          totalTime += getDuration(eventAttended.startTime, eventAttended.endTime)
        }
      })
    } 
  })
  return Math.floor(totalTime / 60) + ' Hours';
}


//This function takes a user and calculates the volunteer hours with minutes 
//for a specific event taking into account that individual hours can be modified
export function eventTimeSpecific(user: IUser, event : IEvent) {
  let totalTime= 0;
  if(user.eventsAttended){
    user.eventsAttended.forEach(eventAttended => {
      if(eventAttended.eventId.toString() === event._id){
        totalTime += getDuration(eventAttended.startTime, eventAttended.endTime)
      }
    })
  }
  return Math.floor(totalTime / 60) + ' hours ' + totalTime % 60 + ' min';
}

export function eventHoursNum(user: IUser, event : IEvent) {
  let totalTime= 0;
  if(user.eventsAttended){
    user.eventsAttended.forEach(eventAttended => {
      if(eventAttended.eventId.toString() === event._id){
        totalTime += getDuration(eventAttended.startTime, eventAttended.endTime)
      }
    })
  }
  return Math.floor(totalTime / 60);
}

export function eventMinsNum(user: IUser, event : IEvent) {
  let totalTime= 0;
  if(user.eventsAttended){
    user.eventsAttended.forEach(eventAttended => {
      if(eventAttended.eventId.toString() === event._id){
        totalTime += getDuration(eventAttended.startTime, eventAttended.endTime)
      }
    })
  }
  return Math.floor(totalTime % 60);
}


// This function takes a list of events and filters out events where the current user isnt an attendee
export function filterUserSignedUpEvents(
  events: IEvent[],
  userId: string,
  startDateTime: string,
  endDateTime: string
) {
  const filteredEvents = events.filter(
    (event: any) =>
      event.attendeeIds.includes(userId) &&
      event.eventType == 'Volunteer' &&
      new Date(event.startTime) >= new Date(startDateTime) &&
      new Date(event.endTime) <= new Date(endDateTime)
  );
  console.log(events, filteredEvents);
  return filteredEvents;
}

// This function takes a list of events and a time range and filters out events that arent in the time range given
export function filterPastEvents(
  events: IEvent[],
  startDateTime: string,
  endDateTime: string
) {
  const filteredEvents = events.filter((event: any) => 
    (event.eventType == 'Volunteer') &&
      (new Date(event.endTime) <= new Date(endDateTime)) &&
      (new Date(event.startTime) >= new Date(startDateTime))
  );
  console.log(filteredEvents);
  return filteredEvents;
}
