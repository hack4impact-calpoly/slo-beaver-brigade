import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  subDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  getDay,
  isToday,
  isSameMonth,
  eachDayOfInterval,
} from "date-fns";
import "../styles/userdashboard/DashboardCalendar.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const DashboardCalendar: React.FC = ({ onTimeChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleDayClick = (day: Date) => {
    console.log(day);
    setSelectedDay(day);
  };

  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    console.log("New Start Time:", startTime, "New End Time:", endTime);
    if (type === "start") {
      setStartTime(event.target.value);
    } else {
      setEndTime(event.target.value);
    }
  };

  useEffect(() => {
    console.log("Start Time:", startTime, "End Time:", endTime);
    // Call the prop function to notify parent component of the time changes
    if (onTimeChange) {
      onTimeChange(startTime, endTime);
    }
  }, [startTime, endTime, onTimeChange]);

  const renderDays = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });

    const daysBeforeStart = getDay(start);
    const daysFromPrevMonth = Array.from(
      { length: daysBeforeStart },
      (_, index) => subDays(start, daysBeforeStart - index)
    );

    // Calculate the number of days from the next month to display for a complete grid
    const remainingDays = 42 - (daysBeforeStart + days.length);
    const daysFromNextMonth =
      remainingDays > 0
        ? Array.from({ length: remainingDays }, (_, index) =>
            addDays(end, index + 1)
          )
        : [];

    return [...daysFromPrevMonth, ...days, ...daysFromNextMonth].map(
      (day, index) => (
        <button
          key={index}
          className={`date${isToday(day) ? " current-day" : ""}${!isSameMonth(day, selectedDate) ? " faded" : ""}`}
          onClick={() => handleDayClick(day)}
        >
          {format(day, "d")}
        </button>
      )
    );
  };

  return (
    <div className="calendar-wrapper">
      <div className="datepicker">
        <div className="datepicker-top">
          <div className="month-selector">
            <button className="arrow" onClick={handlePrevMonth}>
              <ChevronLeftIcon />
            </button>
            <span className="month-name">
              {format(selectedDate, "MMMM yyyy")}
            </span>
            <button className="arrow" onClick={handleNextMonth}>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
        <div className="datepicker-calendar">
          <span className="day">Su</span>
          <span className="day">Mo</span>
          <span className="day">Tu</span>
          <span className="day">We</span>
          <span className="day">Th</span>
          <span className="day">Fr</span>
          <span className="day">Sa</span>
          {renderDays()}
        </div>
        {selectedDay && (
          <div className="time-selector">
            <div>
              <span className="label">Start Time</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => handleTimeChange(e, "start")}
                placeholder="Start Time"
              />
            </div>
            <div>
              <span className="label">End Time</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => handleTimeChange(e, "end")}
                placeholder="End Time"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCalendar;
