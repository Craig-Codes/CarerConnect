import { fireEvent, render, screen } from "@testing-library/react";
import { EditEventModal } from ".";
import userEvent from "@testing-library/user-event";
import { Meetup } from "../../utils/Types/types";

describe("<EditEventModal />", () => {
  const user = userEvent.setup();

  // mock the handleClose event
  let mockedHandleClose = jest.fn();
  // reset the mock before each test
  beforeEach(() => {
    mockedHandleClose = jest.fn();
  });

  const mockEventData: Meetup = {
    id: 1,
    user_id: 1,
    title: "Mock event",
    description: "This is a mock event",
    event_date: "2025-02-12 19:05:41.247",
    is_online: false,
    location: "local coffee shop",
    max_attendees: 5,
    subscriber_count: 2,
  };

  test("Modal does not render when open is false", () => {
    // Given
    render(
      <EditEventModal
        open={false}
        handleClose={mockedHandleClose}
        currentEventData={mockEventData}
      />
    );
    // Then expect modal text not to be seen
    expect(screen.queryByText("Edit Event")).not.toBeInTheDocument();
  });

  test("Calls handleClose when Cancel button is clicked", () => {
    // Given
    render(
      <EditEventModal
        open={true}
        handleClose={mockedHandleClose}
        currentEventData={mockEventData}
      />
    );

    // When - Click the cancel button
    fireEvent.click(screen.getByText("Cancel"));

    // Then - handleClose is called with `false` as cancel button is selected
    expect(mockedHandleClose).toHaveBeenCalledWith(false);
  });

  test("Calls handleClose with true and correct params when form is submitted", async () => {
    // Given
    render(
      <EditEventModal
        open={true}
        handleClose={mockedHandleClose}
        currentEventData={mockEventData}
      />
    );

    // When - Fill in the form fields, adding content to already there content
    await user.type(
      screen.getByRole("textbox", { name: /Title/i }),
      " - updated"
    );
    await user.type(
      screen.getByRole("textbox", { name: /Description/i }),
      " - updated"
    );

    // Submit the form
    await user.click(screen.getByText("Submit"));

    // Then - Ensure handleClose was called with correct inputs
    expect(mockedHandleClose).toHaveBeenCalledWith(true, {
      title: "Mock event - updated",
      description: "This is a mock event - updated",
    });
  });
});
