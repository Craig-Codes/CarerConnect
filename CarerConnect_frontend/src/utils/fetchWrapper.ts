export const fetchWrapper = async (
  httpMethod: string,
  endpoint: string,
  body?: object
) => {
  const fetchOptions: RequestInit = {
    method: httpMethod,
    credentials: "include",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  if (body && ["POST", "PUT", "PATCH"].includes(httpMethod.toUpperCase())) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(
      `${process.env.VITE_API_URL}${endpoint}`,
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
