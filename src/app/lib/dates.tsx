//LIST OF ALL HELPFUL DATE FUNCTIONS

//convert date into format Dayofweek, Month
export function formatDate(date: Date){
  if (!(date instanceof Date)) {
    date = new Date(date); // Convert to Date object if not already
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

export function formatDateWeekday(date: Date){
  if (!(date instanceof Date)) {
    date = new Date(date); // Convert to Date object if not already
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

export function formatDateTime(date: Date){
  if (!(date instanceof Date)) {
    date = new Date(date); // Convert to Date object if not already
  }

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleTimeString('en-US', options);
};

// given two dates convert time range into xxh xx min
export function formatDuration(start: Date, end: Date){
  if (!(start instanceof Date)) {
    start = new Date(start); // Convert to Date object if not already
  }

  if (!(end instanceof Date)) {
    end = new Date(end); // Convert to Date object if not already
  }

  // Calculate the time difference in milliseconds
  const timeDiff = end.getTime() - start.getTime();

  // Convert milliseconds to minutes
  const minutes = Math.floor(timeDiff / (1000 * 60));

  // Calculate remaining hours and minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes} min`;
};

// given a time range calculate the duration in minutes
export function getDuration(start: Date, end: Date){
  if (!(start instanceof Date)) {
    start = new Date(start); // Convert to Date object if not already
  }

  if (!(end instanceof Date)) {
    end = new Date(end); // Convert to Date object if not already
  }

  // Calculate the time difference in milliseconds
  const timeDiff = end.getTime() - start.getTime();

  // Convert milliseconds to minutes
  const minutes = Math.floor(timeDiff / (1000 * 60));

  return minutes;
};