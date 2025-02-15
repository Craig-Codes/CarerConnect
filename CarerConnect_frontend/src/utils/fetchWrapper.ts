// This function is used for all API calls
// This ensures the app uses a standardised approach, complete with error handling
export const fetchWrapper = async (
  httpMethod: string,
  endpoint: string,
  body?: object
) => {
  // these options are required for a http request
  const fetchOptions: RequestInit = {
    method: httpMethod,
    credentials: "include", // ensures cookie is sent with all requests. This is vital as cookie stores user information
    // cookie data is minimal and stored in an encrypted JSON web token for security. This is recieved and decoded by the API
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  // Only attach a  request body for certain methods - other methods do not use them, or make use of path / query parameters
  if (body && ["POST", "PUT", "PATCH"].includes(httpMethod.toUpperCase())) {
    fetchOptions.body = JSON.stringify(body); // send body as JSON object
  }

  try {
    const response = await fetch(
      `${process.env.VITE_API_URL}${endpoint}`, // the base end point is sent in the envionmental variables .env file
      // Getting the end point form one place means it is easy to change if the environment or url changes
      fetchOptions
    );

    const data = await response.json(); // Parse response JSON

    // Check if the reponse is an error (anything except 200-299 status)
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }

    return data; // Return successful data
  } catch (error) {
    // Catch all error if the wrapper fails for another reason
    throw new Error("Unexpected error, please try again");
  }
};
