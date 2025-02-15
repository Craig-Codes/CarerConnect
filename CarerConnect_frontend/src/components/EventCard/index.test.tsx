import { render, screen, fireEvent, act } from "@testing-library/react";
import { EventCard } from ".";
import { Meetup } from "../../utils/Types/types";
import { User } from "../Context";

// Mocked event and user data
const mockEvent: Meetup = {
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

const mockUser: User = {
  id: 1,
  username: "Test User",
  email: "user1@test.com",
  isAdmin: true,
};

const mockSubscribeEvent = jest.fn();
const mockUnsubscribeEvent = jest.fn();
const mockDeleteEvent = jest.fn();
const mockEditEvent = jest.fn();

describe("<EventCard />", () => {
  test("renders EventCard correctly", () => {
    render(
      <EventCard
        event={mockEvent}
        user={mockUser}
        subscribeEvent={mockSubscribeEvent}
        unsubscribeEvent={mockUnsubscribeEvent}
        deleteEvent={mockDeleteEvent}
        editEvent={mockEditEvent}
      />
    );

    // Check if the event title is rendered
    expect(screen.getByText(`${mockEvent.title}`)).toBeInTheDocument();
    // Check if the event description
    expect(screen.getByText(`${mockEvent.description}`)).toBeInTheDocument();
    // Check if the location is rendered
    expect(screen.getByText(`${mockEvent.location}`)).toBeInTheDocument();
  });

  test("renders Unsubscribe button when user is subscribed, and user can unsubscribe", () => {
    render(
      <EventCard
        event={mockEvent}
        user={mockUser}
        subscribeEvent={mockSubscribeEvent}
        unsubscribeEvent={mockUnsubscribeEvent}
        deleteEvent={mockDeleteEvent}
        editEvent={mockEditEvent}
        currentlySubscribedEvents={[1]} // Simulating the user is subscribed
      />
    );

    // Check if the Unsubscribe button is displayed
    const unsubscribeButton = screen.getAllByText("Unsubscribe")[0];
    expect(unsubscribeButton).toBeInTheDocument();

    // Simulate clicking the Unsubscribe button
    fireEvent.click(unsubscribeButton);
    // Check if the unsubscribe modal opens
    expect(screen.getAllByText("Unsubscribe")[0]).toBeInTheDocument();
    // Simulate confirming unsubscribe action
    fireEvent.click(screen.getByText("Yes"));
    expect(mockUnsubscribeEvent).toHaveBeenCalledWith(1);
  });

  test("renders Subscribe button when user is not subscribed, and user can subscribe", () => {
    render(
      <EventCard
        event={mockEvent}
        user={mockUser}
        subscribeEvent={mockSubscribeEvent}
        unsubscribeEvent={mockUnsubscribeEvent}
        deleteEvent={mockDeleteEvent}
        editEvent={mockEditEvent}
        currentlySubscribedEvents={[]} // Simulating the user is not subscribed
      />
    );

    // Check if the Subscribe button is displayed
    const subscribeButton = screen.getAllByText("Subscribe")[0];
    expect(subscribeButton).toBeInTheDocument();

    // Simulate clicking the Subscribe button
    fireEvent.click(subscribeButton);
    // Check if the subscribe modal opens
    expect(screen.getAllByText("Subscribe")[0]).toBeInTheDocument();
    // Simulate confirming subscribe action
    fireEvent.click(screen.getByText("Yes"));
    expect(mockSubscribeEvent).toHaveBeenCalledWith(1);
  });

  test("opens Edit Event Modal when Edit button is clicked and passes the correct event details on edit submit", async () => {
    render(
      <EventCard
        event={mockEvent}
        user={mockUser}
        subscribeEvent={mockSubscribeEvent}
        unsubscribeEvent={mockUnsubscribeEvent}
        deleteEvent={mockDeleteEvent}
        editEvent={mockEditEvent}
      />
    );

    const editButton = screen.getByTestId("edit-icon");
    // need async to give time for modal to appear
    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(screen.getByText("Edit Event")).toBeInTheDocument();
    // Simulate saving changes in the edit modal
    const submitButton = screen.getByText("Submit");

    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(mockEditEvent).toHaveBeenCalledWith(1, {
      description: "This is a mock event",
      title: "Mock event",
    }); // Ensure edit event was triggered with correct parameters
  });

  test("opens Delete Event Modal when Delete button is clicked and passess correct event details on delete submit", async () => {
    render(
      <EventCard
        event={mockEvent}
        user={mockUser}
        subscribeEvent={mockSubscribeEvent}
        unsubscribeEvent={mockUnsubscribeEvent}
        deleteEvent={mockDeleteEvent}
        editEvent={mockEditEvent}
      />
    );

    const deleteButton = screen.getByTestId("delete-icon");
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(screen.getByText("Delete")).toBeInTheDocument();
    // Simulate confirming delete action
    const submitButton = screen.getByText("Yes");

    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(mockDeleteEvent).toHaveBeenCalledWith(mockEvent.id);
  });
});
