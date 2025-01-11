import { render } from "@testing-library/react";
import { fireEvent, screen } from "@testing-library/dom";
import NavBar from ".";
import { UserContext } from "../Context";

// We need to mock the navigation as jest can't use react-router-dom navigate() function
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate, // Mock the navigation functionality
}));

describe("<NavBar />", () => {
  test("Check navbar is rendered containing multiple links", () => {
    // GIVEN
    render(
      <UserContext.Provider
        value={{
          user: { email: "test@test.com", isAdmin: true, username: "Craig" },
          setUser: () => {},
        }}
      >
        <NavBar />
      </UserContext.Provider>
    );

    // WHEN
    const homeLink = screen.getAllByText("Home")[0];
    const meetupLink = screen.getAllByText("Meetups")[0];
    const forumLink = screen.getAllByText("Forum")[0];

    // THEN
    expect(homeLink).toBeInTheDocument();
    expect(meetupLink).toBeInTheDocument();
    expect(forumLink).toBeInTheDocument();
  });

  test("Navbar renders Users Initials", () => {
    // GIVEN
    render(
      <UserContext.Provider
        value={{
          user: {
            email: "test@test.com",
            isAdmin: true,
            username: "Craig Adam",
          },
          setUser: () => {},
        }}
      >
        <NavBar />
      </UserContext.Provider>
    );

    // WHEN
    const initials = screen.getByText("CA");
    const icon = screen.getByTestId("MenuIcon");

    // THEN
    expect(icon).toBeInTheDocument();
    expect(initials).toBeInTheDocument();
  });

  test("Navbar does not render links or user initials when user is not logged in", () => {
    // GIVEN
    render(
      <UserContext.Provider
        value={{
          user: {
            email: "",
            isAdmin: false,
            username: "",
          },
          setUser: () => {},
        }}
      >
        <NavBar />
      </UserContext.Provider>
    );

    // THEN
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Meetups")).not.toBeInTheDocument();
    expect(screen.queryByText("Forum")).not.toBeInTheDocument();
    expect(screen.queryByTestId("MenuIcon")).not.toBeInTheDocument();
  });

  test("Navbar Links trigger navigation on click", () => {
    // GIVEN
    render(
      <UserContext.Provider
        value={{
          user: {
            email: "user1@test.com",
            isAdmin: true,
            username: "User1",
          },
          setUser: () => {},
        }}
      >
        <NavBar />
      </UserContext.Provider>
    );

    // WHEN
    const homeLink = screen.getAllByText("Home")[0];
    fireEvent.click(homeLink);

    // THEN
    expect(mockNavigate).not.toHaveBeenCalledWith("/home");
  });
});
