//LIST OF HELPFUL FUNCTIONS FOR HOURS
import { IEvent } from '../../database/eventSchema';
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

// This function takes an event and calculates the total volunteer hours accumulated by all attendees
export function eventHours(event: IEvent) {
  let totalTime = getDuration(event.startTime, event.endTime) * event.attendeeIds.length;
  return totalTime / 60 + 'h ' + totalTime % 60 + 'min';
}

export function eventIndividualHours(event: IEvent) {
  let totalTime = getDuration(event.startTime, event.endTime);
  let hours = Math.floor(totalTime / 60);
  let minutes = totalTime % 60;
  return hours + 'h ' + minutes + 'min';
}

// This function takes a list of events and filters out events where the current user isnt an attendee
export function filterUserSignedUpEvents(
  events: IEvent[],
  userId: string,
  startDateTime: string,
  endDateTime: string,
  searchTerm: string
) {
  const filteredEvents = events.filter(
    (event: any) =>
      event.attendeeIds.includes(userId) &&
      event.volunteerEvent &&
      new Date(event.startTime) >= new Date(startDateTime) &&
      new Date(event.endTime.substring(0, 10)) <= new Date(endDateTime) &&
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  return filteredEvents;
}

// This function takes a list of events and a time range and filters out events that arent in the time range given
export function filterPastEvents(
  events: IEvent[],
  startDateTime: string,
  endDateTime: string,
  searchTerm: string
) {
  const filteredEvents = events.filter((event: any) => 
    event.volunteerEvent &&
    (new Date(event.startTime) >= new Date(startDateTime)) &&
    (new Date(event.endTime.substring(0, 10)) <= new Date(endDateTime)) &&
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  return filteredEvents;
}