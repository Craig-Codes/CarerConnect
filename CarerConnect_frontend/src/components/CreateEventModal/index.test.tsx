import { fireEvent, render, screen } from "@testing-library/react";
import { CreateEventModal } from ".";
import userEvent from "@testing-library/user-event";

describe("<CreateEventModal />", () => {
  const user = userEvent.setup();

  // mock the handleClose event
  let mockedHandleClose = jest.fn();
  // reset the mock before each test
  beforeEach(() => {
    mockedHandleClose = jest.fn();
  });

  test("Modal does not render when open is false", () => {
    // Given
    render(<CreateEventModal open={false} handleClose={mockedHandleClose} />);
    // Then expect modal text not to be seen
    expect(screen.queryByText("Create Event")).not.toBeInTheDocument();
  });

  test("Calls handleClose when Cancel button is clicked", () => {
    // Given
    render(<CreateEventModal open={true} handleClose={mockedHandleClose} />);

    // When - Click the cancel button
    fireEvent.click(screen.getByText("Cancel"));

    // Then - handleClose is called with `false` as cancel button is selected
    expect(mockedHandleClose).toHaveBeenCalledWith(false);
  });

  test("Calls handleClose with true and correct params when form is submitted", async () => {
    // Given
    render(<CreateEventModal open={true} handleClose={mockedHandleClose} />);

    // When - Fill in the form fields
    await user.type(
      screen.getByRole("textbox", { name: /title/i }),
      "My Event"
    );
    await user.type(
      screen.getByRole("textbox", { name: /description/i }),
      "An event description"
    );
    await user.type(
      screen.getByRole("textbox", { name: /location or link/i }),
      "New York"
    );

    const participantsInput = screen.getByRole("spinbutton", {
      name: /number of participants/i,
    });
    await user.clear(participantsInput);
    await user.type(participantsInput, "10");

    const dateInput = screen.getByLabelText(/event date & time/i);
    await user.clear(dateInput);
    await user.type(dateInput, "12/12/2025 15:30");

    const onlineRadio = screen.getByLabelText("Yes");
    await user.click(onlineRadio);

    // Submit the form
    await user.click(screen.getByText("Submit"));

    // Then - Ensure handleClose was called with correct inputs
    expect(mockedHandleClose).toHaveBeenCalledWith(true, {
      title: "My Event",
      description: "An event description",
      dateTime: expect.any(Date),
      location: "New York",
      participants: "10",
      online: "true",
    });
  });
});
