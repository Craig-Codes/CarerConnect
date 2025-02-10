import { fireEvent, render, screen } from "@testing-library/react";
import { User, UserContext } from "../Context";
import { useContext, useState } from "react";

// Consumer Component - used to test the context change
const ConsumerComponent = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <p>{user.username}</p>
      <button
        onClick={() =>
          setUser({
            id: 1,
            email: "test@test.com",
            username: "Updated Username",
            isAdmin: false,
          })
        }
      >
        Update User
      </button>
    </div>
  );
};

// Test Component wrapped with the context provider
const TestComponent = () => {
  const [user, setUser] = useState<User>({
    id: 1,
    email: "",
    username: "Initial Username",
    isAdmin: false,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ConsumerComponent />
    </UserContext.Provider>
  );
};

// Test for context behavior
describe("<ConsumerComponent />", () => {
  test("renders initial user context username value", () => {
    // Given
    render(<TestComponent />);

    // Then
    expect(screen.getByText("Initial Username")).toBeInTheDocument();
  });

  test("updates user context value on button click", () => {
    // Given
    render(<TestComponent />);

    // When
    fireEvent.click(screen.getByText("Update User"));

    // Then- Check if the username is updated
    expect(screen.getByText("Updated Username")).toBeInTheDocument();
  });
});
