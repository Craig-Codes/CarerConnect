import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserContext } from "../Context";
import { fetchWrapper } from "../../utils/fetchWrapper";
import RegisterForm from ".";

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

describe("<RegisterForm />", () => {
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
        <RegisterForm />
      </UserContext.Provider>
    );

    // THEN - Verify that input fields and button are rendered
    expect(
      screen.getByRole("textbox", { name: "Username" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Email Address" })
    ).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  test("shows error messages for invalid email and password(s)", async () => {
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
        <RegisterForm />
      </UserContext.Provider>
    );

    const emailInput = screen.getByRole("textbox", { name: "Email Address" });
    const passwordInput = screen.getByText("Password");
    passwordInput.style.pointerEvents = "auto"; // Make password input interactive for react-testing-library
    const confirmPasswordInput = screen.getByText("Confirm Password");
    confirmPasswordInput.style.pointerEvents = "auto";

    // WHEN - Enter invalid email and password
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "12345test");
    await userEvent.type(confirmPasswordInput, "12345testFalse");

    // THEN - Verify error messages
    expect(screen.getByText("Your email is not valid")).toBeInTheDocument();
    expect(screen.getByText("Passwords must match")).toBeInTheDocument();
  });

  test("submits the form and calls fetchWrapper", async () => {
    // Mock the fetchWrapper to resolve successfully
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
        <RegisterForm />
      </UserContext.Provider>
    );

    const usernameInput = screen.getByRole("textbox", { name: "Username" });
    const emailInput = screen.getByRole("textbox", { name: "Email Address" });
    const passwordInput = screen.getByText("Password");
    passwordInput.style.pointerEvents = "auto"; // Make password input interactive for react-testing-library
    const confirmPasswordInput = screen.getByText("Confirm Password");
    confirmPasswordInput.style.pointerEvents = "auto";
    const signUpButton = screen.getByRole("button", { name: "Sign Up" });

    // WHEN - Enter invalid email and password
    await userEvent.type(usernameInput, "User1");
    await userEvent.type(emailInput, "user1@example.com");
    await userEvent.type(passwordInput, "12345test");
    await userEvent.type(confirmPasswordInput, "12345test");
    await userEvent.click(signUpButton);

    // Then
    expect(fetchWrapper).toHaveBeenCalledWith("POST", "user/register", {
      username: "User1",
      email: "user1@example.com",
      password: "12345test",
    });
  });

  test("submits the form and shows an alert for failure to create new user", async () => {
    // Mock the fetchWrapper to resolve successfully
    (fetchWrapper as jest.Mock).mockResolvedValue({
      message: "Failed to create user",
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
        <RegisterForm />
      </UserContext.Provider>
    );

    const usernameInput = screen.getByRole("textbox", { name: "Username" });
    const emailInput = screen.getByRole("textbox", { name: "Email Address" });
    const passwordInput = screen.getByText("Password");
    passwordInput.style.pointerEvents = "auto"; // Make password input interactive for react-testing-library
    const confirmPasswordInput = screen.getByText("Confirm Password");
    confirmPasswordInput.style.pointerEvents = "auto";
    const signUpButton = screen.getByRole("button", { name: "Sign Up" });

    // WHEN - Enter invalid email and password
    await userEvent.type(usernameInput, "User1");
    await userEvent.type(emailInput, "user1@example.com");
    await userEvent.type(passwordInput, "12345test");
    await userEvent.type(confirmPasswordInput, "12345test");
    await userEvent.click(signUpButton);

    // Then - Wait for the error alert to appear
    expect(
      await screen.findByText("Unable to register, check credentials")
    ).toBeInTheDocument();

    // Verify that setUser was not called
    expect(mockSetUser).not.toHaveBeenCalled();
  });
});
