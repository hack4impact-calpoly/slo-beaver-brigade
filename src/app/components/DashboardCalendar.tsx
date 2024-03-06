// Import React and necessary functions from date-fns
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

// Import your CSS Module here
import styles from "../styles/userdashboard/DashboardCalendar.module.css";

// Import Chakra UI icons
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

type OnTimeChangeFunction = (startTime: string, endTime: string) => void;

type DashboardCalendarProps = {
  onTimeChange: OnTimeChangeFunction;
};

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ onTimeChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [activeDate, setActiveDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleDayClick = (day: Date) => {
    const formattedDate = format(day, "yyyy-MM-dd");
    setSelectedDay(day);
    setActiveDate(formattedDate);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const value = event.target.value
    if (type === "start") {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
  };

  useEffect(() => {
    if (onTimeChange && startTime && endTime) {
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
          className={`${styles.dateButton} ${isToday(day) ? styles.currentDate : ""} ${!isSameMonth(day, selectedDate) ? styles.faded : ""} ${format(day, "yyyy-MM-dd") === activeDate ? styles.selectedDate : ""}`}
          onClick={() => handleDayClick(day)}
        >
          {format(day, "d")}
        </button>
      )
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.datepicker}>
        <div className={styles.topMargin}>
          <div className={styles.monthSelector}>
            <button className={styles.arrowButton} onClick={handlePrevMonth}>
              <ChevronLeftIcon />
            </button>
            <span className={styles.monthName}>
              {format(selectedDate, "MMMM yyyy")}
            </span>
            <button className={styles.arrowButton} onClick={handleNextMonth}>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
        <div className={styles.calendarGrid}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName, index) => (
            <div key={index} className={styles.dayText}>
              {dayName}
            </div>
          ))}
          {renderDays()}
        </div>
        {selectedDay && (
          <div className={styles.timeSelector}>
            <div>
              Start Time :{" "}
              <input
                type="time"
                className={styles.timeInput}
                value={startTime}
                onChange={(e) => handleTimeChange(e, "start")}
              />
            </div>
            <div>
              &nbsp;&nbsp;End Time :{" "}
              <input
                type="time"
                className={styles.timeInput}
                value={endTime}
                onChange={(e) => handleTimeChange(e, "end")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCalendar;
