import { useContext } from "react";
import { UserContext } from "../components/Context";
import { WelcomeBlock } from "../components/WelcomeBlock";
import { Alert, Box, Paper, Typography } from "@mui/material";
import { EventCard } from "../components/EventCard";
import { toast, ToastContainer } from "react-toastify";
import { EditSubscriptionFormInputs } from "../components/EditEventModal";
import { fetchWrapper } from "../utils/fetchWrapper";
import useFetchMeetups from "../hooks/useFetchMeetups";

export const HomePage = () => {
  const { user } = useContext(UserContext);
  const { meetups, fetchMeetups } = useFetchMeetups();

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
    <>
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
            {meetups.map((meetup) => (
              <EventCard
                key={meetup.id}
                event={meetup}
                user={user}
                unsubscribeEvent={handleUnsubscribe}
                deleteEvent={handleDeleteEvent}
                editEvent={handleEditEvent}
              />
            ))}
          </Box>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ marginTop: "20px" }}>
          You have not subscribed to any events yet - Your subscribed events
          will be shown here.
        </Alert>
      )}
      <ToastContainer />
    </>
  );
};
