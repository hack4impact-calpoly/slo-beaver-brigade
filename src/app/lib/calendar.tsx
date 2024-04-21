import { IEvent } from "@database/eventSchema";
//converts an event into a FullCalendar event
export function Calendarify(event: IEvent) {
  //convert events into plain object before passing into client component
  const calEvent = JSON.parse(JSON.stringify(event));
  calEvent.title = event.eventName;
  delete calEvent.eventName;
  calEvent.start = event.startTime;
  calEvent.end = event.endTime;
  calEvent.id = event._id;

  if (event.eventName == "Beaver Walk") {
    calEvent.backgroundColor = "#8A6240";
    calEvent.borderColor = "#4D2D18";
    calEvent.textColor = "#fff";
  } else {
    calEvent.backgroundColor = "#0077b6";
    calEvent.borderColor = "#03045e";
    calEvent.textColor = "#fff";
  }

  return calEvent;
}
