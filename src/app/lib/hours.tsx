//LIST OF HELPFUL FUNCTIONS FOR HOURS
import { IEvent } from '../../database/eventSchema';
import { getDuration } from './dates';

export function calcHours(events: IEvent[]) {
  let totalTime = 0;
  events.forEach((event) => {
    totalTime += getDuration(event.startTime, event.endTime);
  });
  return totalTime;
}

export function calcHoursForAll(events: IEvent[]) {
  let totalTime = 0;
  events.forEach((event) => {
    totalTime += getDuration(event.startTime, event.endTime) * event.attendeeIds.length;
  });
  return totalTime;
}

export function filterUserSignedUpEvents(events: IEvent[], userId: unknown, startDateTime: string, endDateTime: string) {
  const filteredEvents = events.filter(
    (event: any) =>
      event.attendeeIds.includes(userId) &&
      event.volunteerEvent &&
      new Date(event.startTime) >= new Date(startDateTime) &&
      new Date(event.endTime) <= new Date(endDateTime)
  );
  return filteredEvents;
} 

export function filterPastEvents(events: IEvent[], startDateTime: string, endDateTime: string) {
  const filteredEvents = events.filter(
    (event: any) =>
      event.volunteerEvent &&
      new Date(event.endTime) <= new Date(endDateTime) &&
      new Date(event.startTime) >= new Date(startDateTime)
  );
  return filteredEvents;
}