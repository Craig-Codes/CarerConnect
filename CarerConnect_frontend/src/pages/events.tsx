import Button from "@mui/material/Button";
// import { useEffect, useState } from "react";
import { useContext, useState } from "react";
import { UserContext } from "../components/Context";
import theme from "../theme/theme";
import { EventCard } from "../components/EventCard";
import { fetchWrapper } from "../utils/fetchWrapper";
import { toast, ToastContainer } from "react-toastify";
import { EditSubscriptionFormInputs } from "../components/EditEventModal";
import { Box } from "@mui/material";
import { Meetup } from "../utils/Types/types";
import useFetchMeetups from "../hooks/useFetchMeetups";
import {
  CreateEventModal,
  CreateSubscriptionFormInputs,
} from "../components/Context/CreateEventModal";

export const EventsPage = () => {
  const { user } = useContext(UserContext);
  const { meetups: allMeetups, fetchMeetups: fetchAllMeetups } =
    useFetchMeetups({ all: true }); // Fetch all meetups
  const { meetups: subscribedMeetups, fetchMeetups: fetchSubscribedMeetups } =
    useFetchMeetups(); // Fetch meetups user has subscribed to

  // Generate an array of all the subscribed event ids
  const subscribedMeetupIds = subscribedMeetups.map((meetup) => meetup.id);

  // state to handle open and closing the create event modal
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  // function to handle the opening of the createEventModal
  const handleCreateEventModalOpen = () => setCreateEventModalOpen(true);

  // function to handle the logic when the modal is closed
  const handleCreateEventModalClose = async (
    create: boolean,
    eventContent?: CreateSubscriptionFormInputs
  ) => {
    setCreateEventModalOpen(false); // close the modal
    if (create) {
      handleCreateEvent(eventContent!);
    }
  };

  const handleCreateEvent = async (
    eventContent: CreateSubscriptionFormInputs
  ) => {
    console.log(eventContent);
  };

  const handleUnsubscribe = async (eventId: number) => {
    try {
      await fetchWrapper("DELETE", `event/subscription/${eventId}`);
      await fetchAllMeetups();
      await fetchSubscribedMeetups();
      toast.success("Successfully unsubscribed from event");
    } catch {
      toast.error("Failed to unsubscribe from event, please try again");
    }
  };

  const handleSubscribe = async (eventId: number) => {
    try {
      await fetchWrapper("POST", `event/subscription/${eventId}`);
      await fetchAllMeetups();
      await fetchSubscribedMeetups();
      toast.success("Successfully subscibed to meetup event");
    } catch {
      toast.error("Failed to subscribe to meetup event, please try again");
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await fetchWrapper("DELETE", `event/${eventId}`);
      await fetchAllMeetups();
      await fetchSubscribedMeetups();
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
      await fetchAllMeetups();
      await fetchSubscribedMeetups();
      toast.success("Successfully updated meetup event");
    } catch {
      toast.error("Failed to update event, please try again");
    }
  };

  return (
    <>
      <Box sx={{ width: "80vw" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.secondary.main }}
          onClick={handleCreateEventModalOpen}
        >
          Create New Event
        </Button>
        {allMeetups.map((meetup: Meetup) => (
          <EventCard
            key={meetup.id}
            event={meetup}
            user={user}
            unsubscribeEvent={handleUnsubscribe}
            subscribeEvent={handleSubscribe}
            deleteEvent={handleDeleteEvent}
            editEvent={handleEditEvent}
            currentlySubscribedEvents={subscribedMeetupIds}
          />
        ))}
        <ToastContainer />
      </Box>
      <CreateEventModal
        open={createEventModalOpen}
        handleClose={handleCreateEventModalClose}
      />
    </>
  );
};
