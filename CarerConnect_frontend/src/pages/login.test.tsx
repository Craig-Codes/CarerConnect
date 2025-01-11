import { fireEvent, render, screen } from "@testing-library/react";
import { LoginPage } from "./login";
import { BrowserRouter } from "react-router-dom";

describe("<LoginPage />", () => {
  test("renders the LoginPage with tabs", () => {
    // Given
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Then - Check if both tabs (Login, Register) are in the document
    expect(screen.getByRole("tab", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Register" })).toBeInTheDocument();
  });

  test("displays LoginForm when the Login tab is selected", () => {
    // Given
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Then - Check that the LoginForm is rendered by default (since value starts at 0)
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();

    // Verify RegisterForm is not rendered initially
    expect(
      screen.queryByRole("button", { name: "Sign Up" })
    ).not.toBeInTheDocument();
  });

  test("displays RegisterForm when the Register tab is selected", async () => {
    // Given
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // When - Click the Register tab to switch to the Register form
    fireEvent.click(screen.getByRole("tab", { name: "Register" }));

    // Then - Verify that the RegisterForm is displayed
    expect(
      screen.queryByRole("button", { name: "Sign Up" })
    ).toBeInTheDocument();

    // Verify that the LoginForm is no longer rendered
    expect(
      screen.queryByRole("button", { name: "Sign In" })
    ).not.toBeInTheDocument();
  });
});
