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
      (_, index) => 0
    );

    // Calculate the days of the current month
    const daysInMonth = Array.from(
      { length: getDaysInMonth(selectedDate) },
      (_, index) => index + 1
    );

    return [...daysFromPrevMonth, ...daysInMonth];
  };

  const renderDays = () => {
    const days = getDateArr(selectedDate);

    return days.map((day, index) => (
      <button
        key={index}
        className={`date${isToday(day) ? " current-day" : ""}${
          day === 0 ? " faded" : ""
        }`}
      >
        {day === 0 ? "" : day}
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
