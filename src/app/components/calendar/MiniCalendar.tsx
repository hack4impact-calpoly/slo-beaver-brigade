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
import styles from '@styles/userdashboard/MiniCalendar.module.css';
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { start } from "repl";

// Define type for the onTimeChange function
type OnTimeChangeFunction = (startTime: string, endTime: string) => void;

// Define props interface for DashboardCalendar component
type DashboardCalendarProps = {
  onTimeChange: OnTimeChangeFunction;
  onDateChange: (date: string) => void;
  passedStartTime: string;
  passedEndTime: string;
};

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  onTimeChange, onDateChange, passedStartTime, passedEndTime
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [activeDate, setActiveDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Function to handle going to the previous month
  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  // Function to handle going to the next month
  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  // Function to handle clicking on a day
  const handleDayClick = (day: Date) => {
    const formattedDate = format(day, "yyyy-MM-dd");
    setSelectedDay(day);
    setActiveDate(formattedDate);
    onDateChange(formattedDate)
  };

  // Function to handle changing start/end time
  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const value = event.target.value;
    if (type === "start") {
      setStartTime(value);
    } else {
      setEndTime(value);
  }
  };

  // Function to handle date selection from the input field
  // In DashboardCalendar, when the date changes
const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  let newDate = new Date(value + 'T12:00:00Z'); // Adding T12:00:00Z to keep it noon

  // Update local state
  setSelectedDay(newDate);
  setActiveDate(format(newDate, "yyyy-MM-dd"));
  setSelectedDate(newDate);

  if (onDateChange) {
    onDateChange(format(newDate, "yyyy-MM-dd"));
  }
};

useEffect(() => {
  setStartTime(passedStartTime);
  setEndTime(passedEndTime);
}, [passedEndTime, passedStartTime]);


  // Effect hook to call onTimeChange function when start/end time changes
  useEffect(() => {
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
      <div className={styles.dateTimeSection}>
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
        </div>
        {selectedDay && (
          <div className={styles.dateTimeInputs}>
            <div className={styles.inputGroup}>
              <label>Date : </label>
              <input
                type="date"
                value={activeDate}
                onChange={handleDateChange}
                className={styles.timeInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Start Time : </label>
              <input
                type="time"
                value={startTime? startTime : passedStartTime}
                onChange={(e) => handleTimeChange(e, "start")}
                className={styles.timeInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>End Time : </label>
              <input
                type="time"
                value={endTime? endTime : passedEndTime}
                onChange={(e) => handleTimeChange(e, "end")}
                className={styles.timeInput}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCalendar;