export const isLoggedIn = (): boolean => {
  // Search cookies for a vald user token
  const userToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("CarerConnect_user_token="))
    ?.split("=")[1]; // Extract the token value

  // Return true or false depending if user token is found
  return userToken ? true : false;
};

// Function uses regular expression to ensure an email address is a valid email
export const isValidEmail = (email: string): boolean => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

// Function to format date from ISO string to human readable formate e.g. Tuesday 25th Feb 2025 at 1400
export const formatDate = (inputDate: string): string => {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    console.error("Invalid date:", inputDate);
    return "Invalid date";
  }

  // Helper function to get the suffix for the day (1st, 2nd, 3rd, etc.)
  const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  // Days and months array to get the day of the week and month name
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Formatting date
  const dayOfWeek = daysOfWeek[date.getDay()]; // Get day of the week
  const dayOfMonth = date.getDate(); // Get day of the month
  const daySuffix = getDaySuffix(dayOfMonth); // Get correct suffix for the day
  const month = monthsOfYear[date.getMonth()]; // Get month name
  const year = date.getFullYear(); // Get year
  const time =
    date.getHours().toString().padStart(2, "0") +
    date.getMinutes().toString().padStart(2, "0"); // Get time (HHmm)

  return `${dayOfWeek} ${daySuffix} ${month} ${year} at ${time}`;
};
