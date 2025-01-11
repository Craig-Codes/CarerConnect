import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserContext } from "../Context";
import LoginForm from ".";
import { fetchWrapper } from "../../utils/fetchWrapper";

// Mock the fetchWrapper function used in the LoginForm
jest.mock("../../utils/fetchWrapper", () => ({
  fetchWrapper: jest.fn(),
}));

// We need to mock the navigation as jest can't use react-router-dom navigate() function
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate, // Mock the navigation functionality
}));

describe("<LoginForm />", () => {
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  test("renders input fields and sign up button", () => {
    // GIVEN
    render(
      <UserContext.Provider
        value={{
          user: {
            email: "",
            username: "",
            isAdmin: false,
          },
          setUser: mockSetUser,
        }}
      >
        <LoginForm />
      </UserContext.Provider>
    );

    // THEN - Verify that input fields and button are rendered
    expect(
      screen.getByRole("textbox", { name: "Email Address" })
    ).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  test("shows error messages for invalid email and password", async () => {
    // GIVEN
    render(
      <UserContext.Provider
        value={{
          user: {
            email: "",
            username: "",
            isAdmin: false,
          },
          setUser: mockSetUser,
        }}
      >
        <LoginForm />
      </UserContext.Provider>
    );

    const emailInput = screen.getByRole("textbox", { name: "Email Address" });
    const passwordInput = screen.getByText("Password");
    passwordInput.style.pointerEvents = "auto"; // Make password input interactive for react-testing-library

    // WHEN - Enter invalid email and password
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "123");

    // THEN - Verify error messages
    expect(screen.getByText("Your email is not valid")).toBeInTheDocument();
    expect(
      screen.getByText("You must have a password over 5 characters")
    ).toBeInTheDocument();
  });

  test("submits the form and calls fetchWrapper", async () => {
    // Mock the fetchWrapper to resolve successfully from API
    (fetchWrapper as jest.Mock).mockResolvedValue({
      email: "user1@example.com",
      isAdmin: true,
      username: "User1",
    });

    // Given
    render(
      <UserContext.Provider
        value={{
          user: {
            email: "",
            username: "",
            isAdmin: false,
          },
          setUser: mockSetUser,
        }}
      >
        <LoginForm />
      </UserContext.Provider>
    );

    const emailInput = screen.getByRole("textbox", { name: "Email Address" });
    const passwordInput = screen.getByText("Password");
    passwordInput.style.pointerEvents = "auto"; // Make password input interactive for react-testing-library
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    // When - Enter valid email and password and submit
    await userEvent.type(emailInput, "user1@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    // Then
    expect(fetchWrapper).toHaveBeenCalledWith("POST", "user", {
      email: "user1@example.com",
      password: "password123",
    });
  });

  test("shows alert on login failure for incorrect credentials", async () => {
    // Mock the fetchWrapper to return an error from the API
    (fetchWrapper as jest.Mock).mockResolvedValue({
      message: "Credentials invalid",
    });

    // Given
    render(
      <UserContext.Provider
        value={{
          user: {
            email: "",
            username: "",
            isAdmin: false,
          },
          setUser: mockSetUser,
        }}
      >
        <LoginForm />
      </UserContext.Provider>
    );

    const emailInput = screen.getByRole("textbox", { name: "Email Address" });
    const passwordInput = screen.getByText("Password");
    passwordInput.style.pointerEvents = "auto"; // Make password input interactive for react-testing-library
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    // When - Enter valid email and password and submit
    await userEvent.type(emailInput, "user1@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    // Then - Wait for the error alert to appear
    expect(
      await screen.findByText("Your login credentials are incorrect")
    ).toBeInTheDocument();

    // Verify that setUser was not called
    expect(mockSetUser).not.toHaveBeenCalled();
  });
});
