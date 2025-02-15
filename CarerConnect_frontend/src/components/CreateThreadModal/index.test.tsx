import { fireEvent, render, screen } from "@testing-library/react";
import { CreateThreadModal } from ".";
import userEvent from "@testing-library/user-event";

describe("<CreateThreadModal />", () => {
  const user = userEvent.setup();

  // mock the handleClose event
  let mockedHandleClose = jest.fn();
  // reset the mock before each test
  beforeEach(() => {
    mockedHandleClose = jest.fn();
  });

  test("Modal does not render when open is false", () => {
    // Given
    render(<CreateThreadModal open={false} handleClose={mockedHandleClose} />);
    // Then expect modal text not to be seen
    expect(screen.queryByText("Create Thread")).not.toBeInTheDocument();
  });

  test("Calls handleClose when Cancel button is clicked", () => {
    // Given
    render(<CreateThreadModal open={true} handleClose={mockedHandleClose} />);

    // When - Click the cancel button
    fireEvent.click(screen.getByText("Cancel"));

    // Then - handleClose is called with `false` as cancel button is selected
    expect(mockedHandleClose).toHaveBeenCalledWith(false);
  });

  test("Calls handleClose with true and correct params when form is submitted", async () => {
    // Given
    render(<CreateThreadModal open={true} handleClose={mockedHandleClose} />);

    // When - Fill in the form fields
    await user.type(
      screen.getByRole("textbox", { name: /Title/i }),
      "My Title"
    );

    // Submit the form
    await user.click(screen.getByText("Submit"));

    // Then - Ensure handleClose was called with correct inputs
    expect(mockedHandleClose).toHaveBeenCalledWith(true, {
      title: "My Title",
    });
  });
});
