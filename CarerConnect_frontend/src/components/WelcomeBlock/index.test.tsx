import { render, screen, fireEvent } from "@testing-library/react";
import { WelcomeBlock } from ".";
import { useNavigate } from "react-router-dom";

// Mock the useNavigate hook from react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("WelcomeBlock", () => {
  const username = "TestUser";
  // Mock naviagation to return an empty function
  const mockNavigate = useNavigate as jest.Mock;
  const navigateFn = jest.fn();

  beforeEach(() => {
    mockNavigate.mockReturnValue(navigateFn);
  });

  it("should render the username correctly", () => {
    render(<WelcomeBlock username={username} />);

    expect(screen.getByText(`Hello ${username}`)).toBeInTheDocument();
  });

  it("should navigate to the forum page when the FORUM button is clicked", () => {
    render(<WelcomeBlock username={username} />);

    fireEvent.click(screen.getByText("FORUM"));

    expect(navigateFn).toHaveBeenCalledWith("/forum", { replace: true });
  });

  it("should navigate to the events page when the EVENTS button is clicked", () => {
    render(<WelcomeBlock username={username} />);

    fireEvent.click(screen.getByText("EVENTS"));

    expect(navigateFn).toHaveBeenCalledWith("/events", { replace: true });
  });
});
