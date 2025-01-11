export const fetchWrapper = async (
  httpMethod: string,
  endpoint: string,
  body?: object
) => {
  try {
    const fetchOptions: RequestInit = {
      method: httpMethod,
      credentials: "include",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    // Include body only for methods that allow it (POST, PUT, PATCH)
    if (body && ["POST", "PUT", "PATCH"].includes(httpMethod.toUpperCase())) {
      fetchOptions.body = JSON.stringify(body);
    }

    const result = await fetch(
      `${process.env.VITE_API_URL}${endpoint}`,
      fetchOptions
    );
    const jsonResult = await result.json();
    return jsonResult;
  } catch (error) {
    console.error(error); // Log the error
    throw new Error("Failed to fetch data");
  }
};
