import React, { useState } from "react";
import {
  format,
  addDays,
  subDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  getDay,
  getDaysInMonth,
  isToday,
  isSameMonth,
  eachDayOfInterval,
} from "date-fns";
import "../styles/userdashboard/DashboardCalendar.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const DashboardCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const getDateArr = (selectedDate) => {
    let arr = [];

    // Calculate how many days from the previous month to display
    const firstDayOfWeek = getDay(startOfMonth(selectedDate));
    const daysFromPrevMonth = Array.from(
      { length: firstDayOfWeek },
      (_, index) => subDays(endOfMonth(subMonths(selectedDate, 1)), firstDayOfWeek - index)
    );
    
    // Calculate the days of the current month
    const daysInMonth = Array.from(
      { length: getDaysInMonth(selectedDate) },
      (_, index) => index + 1
    );

    

    return [...daysFromPrevMonth, ...daysInMonth];
  };

  const renderDays = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });
    const firstDayOfWeek = getDay(start);
  
    // Calculate the number of days from the previous month to display
    const daysFromPrevMonth = Array.from(
      { length: firstDayOfWeek },
      (_, index) => subDays(start, firstDayOfWeek - index)
    );

    // Calculate the days of the current month
    const daysInMonth = Array.from(
      { length: getDaysInMonth(selectedDate) },
      (_, index) => index + 1
    );
    
    // Calculate the number of days from the next month to display
    const remainingDays = 7 - (firstDayOfWeek + daysInMonth.length) % 7;
    const daysFromNextMonth = Array.from(
      { length: remainingDays },
      (_, index) => addDays(startOfMonth(addMonths(selectedDate, 1)), index)
    );
  
    return [...daysFromPrevMonth, ...days, ...daysFromNextMonth].map((day) => (
      <button
        key={day.toString()}
        className={`date${isToday(day) ? " current-day" : ""}${
          !isSameMonth(day, selectedDate) ? " faded" : ""
        }`}
      >
        {format(day, "d")}
      </button>
    ));
  };
  

  return (
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
    </div>
  );
};

export default DashboardCalendar;
