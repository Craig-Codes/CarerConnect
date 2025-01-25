import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import BrowserRouter
import { LayoutWrapper } from ".";

describe("<LayoutWrapper />", () => {
  // navbar contains navigation functionality which must be mocked
  const mockNavigate = jest.fn();

  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate, // Mock the navigation functionality
  }));

  test("Renders the navbar and children", () => {
    render(
      // MemoryRouter would allow navigate functions to work correctly
      // As navigate requires a router context
      <MemoryRouter>
        <LayoutWrapper>
          <h1>Test wrapper child</h1>
        </LayoutWrapper>
      </MemoryRouter>
    );

    // Assert that the child and NavBar render correctly
    expect(screen.getByText("Test wrapper child")).toBeInTheDocument();
    expect(screen.getByText("CarerConnect")).toBeInTheDocument(); // From NavBar
  });
});
