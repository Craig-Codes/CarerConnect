// This page is the users home page, the first page they see upon successful login

import { useContext } from "react";
import { UserContext } from "../components/Context";
import { WelcomeBlock } from "../components/WelcomeBlock";
import { Alert, Box, Paper, Typography } from "@mui/material";
import { EventCard } from "../components/EventCard";
import { toast, ToastContainer } from "react-toastify";
import { EditSubscriptionFormInputs } from "../components/EditEventModal";
import { fetchWrapper } from "../utils/fetchWrapper";
import { useFetchMeetups } from "../hooks/useFetchMeetups";

export const HomePage = () => {
  const { user } = useContext(UserContext); // get the current users details
  // state stores the current users subscribed events
  const { meetups, fetchMeetups } = useFetchMeetups();

  // function allows a user to unsubscribe from an event
  const handleUnsubscribe = async (eventId: number) => {
    try {
      await fetchWrapper("DELETE", `event/subscription/${eventId}`); // pass the event id to the API endpoint to unsubscribe
      await fetchMeetups(); // get an updated list of events
      toast.success("Successfully unsubscribed from event"); // keep user informed that the event was unsubscribed from
    } catch {
      toast.error("Failed to unsubscribe from event, please try again"); // gracefully keep user informed that post failed to create
      // error message is generic to prevent exposing to much information which may caus vulnerabilities in the API
    }
  };

  // function handles the deleting of an event by passing the event id to the API
  const handleDeleteEvent = async (eventId: number) => {
    try {
      await fetchWrapper("DELETE", `event/${eventId}`); // delete request with event id passes to the API
      await fetchMeetups(); // fetch a new lsit of events without the deleted event
      toast.success("Successfully deleted meetup event");
    } catch {
      toast.error("Failed to delete event, please try again");
    }
  };

  // function handles the editting of an event by passing the event id and the updated content to the API
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
    <>
      {/* Show the user their name and navigation options */}
      <WelcomeBlock username={user.username} />
      {meetups.length > 0 ? (
        <Paper
          elevation={2}
          sx={{
            padding: "2vw",
            marginTop: "20px",
            textAlign: "left",
          }}
        >
          {/* Show the user there subscribed to events */}
          <Typography variant="h4">My Events</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: "2vw",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Each found event is passed into the EventCard child component so that it is displayed correctly */}
            {meetups.map((meetup) => (
              <EventCard
                width="450px"
                key={meetup.id}
                event={meetup}
                user={user}
                unsubscribeEvent={handleUnsubscribe}
                // null event passed in here, as users cannot subscribe from this page
                subscribeEvent={() => null}
                deleteEvent={handleDeleteEvent}
                editEvent={handleEditEvent}
              />
            ))}
          </Box>
        </Paper>
      ) : (
        // Alert box shown if the user is not subscribbed to any events
        <Alert severity="info" sx={{ marginTop: "20px" }}>
          You have not subscribed to any events yet - Your subscribed events
          will be shown here.
        </Alert>
      )}
      <ToastContainer />
    </>
  );
};
