import Button from "@mui/material/Button";
// import { useEffect, useState } from "react";
import { useContext, useState } from "react";
import { UserContext } from "../components/Context";
import theme from "../theme/theme";
import useFetchMeetups from "../hooks/useFetchMeetups";
import { EventCard } from "../components/EventCard";
import { fetchWrapper } from "../utils/fetchWrapper";
import { toast, ToastContainer } from "react-toastify";
import { EditSubscriptionFormInputs } from "../components/EditEventModal";
import { Box } from "@mui/material";
import { Meetup } from "../utils/Types/types";

// TODO - create create event modal with form - pass props to it

export const EventsPage = () => {
  const { user } = useContext(UserContext);
  const { meetups, fetchMeetups } = useFetchMeetups({ all: true }); // fetch all events, not user specifc
  // state to handle open and closing the create event modal
  const [createEventModal, setCreateEventModalOpen] = useState(false);
  // function to handle the opening of the createEventModal
  const handleCreateEventModalOpen = () => setCreateEventModalOpen(true);
  // function to handle the logic when the modal is closed
  const handleCreateEventModalClose = async (create: boolean) => {
    setCreateEventModalOpen(false); // close the modal
    if (create) {
      // create the event (using event. to get props? or just use event?)
    }
  };

  const handleUnsubscribe = async (eventId: number) => {
    try {
      await fetchWrapper("DELETE", `event/subscription/${eventId}`);
      await fetchMeetups();
      toast.success("Successfully unsubscribed from event");
    } catch {
      toast.error("Failed to unsubscribe from event, please try again");
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await fetchWrapper("DELETE", `event/${eventId}`);
      await fetchMeetups();
      toast.success("Successfully deleted meetup event");
    } catch {
      toast.error("Failed to delete event, please try again");
    }
  };

  const handleEditEvent = async (
    eventId: number,
    updatedContent?: EditSubscriptionFormInputs
  ) => {
    try {
      await fetchWrapper("PATCH", `event/${eventId}`, updatedContent);
      await fetchMeetups();
      toast.success("Successfully updated meetup event");
    } catch {
      toast.error("Failed to update event, please try again");
    }
  };

  return (
    <Box sx={{ width: "80vw" }}>
      <Button
        variant="contained"
        sx={{ backgroundColor: theme.palette.secondary.main }}
      >
        Create New Event
      </Button>
      {meetups.map((meetup: Meetup) => (
        <EventCard
          key={meetup.id}
          event={meetup}
          user={user}
          unsubscribeEvent={handleUnsubscribe}
          deleteEvent={handleDeleteEvent}
          editEvent={handleEditEvent}
        />
      ))}
      <ToastContainer />
    </Box>
  );
};
