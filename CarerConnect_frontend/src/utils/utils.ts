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
