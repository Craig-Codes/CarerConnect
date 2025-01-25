// import { useEffect, useState } from "react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/Context";
import { WelcomeBlock } from "../components/WelcomeBlock";
import { fetchWrapper } from "../utils/fetchWrapper";
import { formatDate } from "../utils/utils";
import { Alert, Box, Paper, Typography } from "@mui/material";
import { Meetup } from "../utils/Types/types";
import { EventCard } from "../components/EventCard";

export const HomePage = () => {
  const { user } = useContext(UserContext); // stores the global user object
  const [meetups, setMeetups] = useState<Meetup[]>([]); // stores the users meetups

  // useEffect React hook fires when component is first renders
  // used to fetch the users event data from the api
  useEffect(() => {
    // Check if meetups are already loaded to prevent redundant API calls
    if (meetups.length === 0) {
      const fetchMeetups = async () => {
        try {
          const eventData = await fetchWrapper("GET", "event/user");

          // Map the eventData to the expected format and update state only once
          const formattedMeetups = eventData.map((meetup: Meetup) => ({
            id: meetup.id,
            title: meetup.title,
            description: meetup.description,
            event_date: formatDate(meetup.event_date),
            is_online: meetup.is_online,
            location: meetup.location,
            max_attendees: Number(meetup.max_attendees),
            subscriber_count: Number(meetup.subscriber_count),
          }));

          // Update meetups state with the formatted data
          setMeetups(formattedMeetups);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchMeetups();
    }
  }, [meetups.length]); // Dependency array ensures the effect only runs once when the component mounts or meetups is empty

  console.log(meetups);

  return (
    <>
      <WelcomeBlock username={user.username} />
      {/* Conditionally render the meetups cards if a user has subscribed meetups */}
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
            }}
          >
            {meetups.map((meetup) => (
              <EventCard key={meetup.id} event={meetup} />
            ))}
          </Box>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ marginTop: "20px" }}>
          You have not subscribed to any events yet - Your subscribed events
          will be shown here.
        </Alert>
      )}
    </>
  );
};
