// Events page provides user with access to all available events which can be subscribed to
// Features basic fitering using tabs to show all events, online, or in person

import Button from "@mui/material/Button";
import {
  useContext,
  useState,
  MouseEvent,
  SyntheticEvent,
  useEffect,
} from "react";
import { UserContext } from "../components/Context";
import theme from "../theme/theme";
import { EventCard } from "../components/EventCard";
import { fetchWrapper } from "../utils/fetchWrapper";
import { toast, ToastContainer } from "react-toastify";
import { EditSubscriptionFormInputs } from "../components/EditEventModal";
import { Box, Tab, Tabs, tabsClasses } from "@mui/material";
import { Meetup } from "../utils/Types/types";
import { useFetchMeetups } from "../hooks/useFetchMeetups";
import {
  CreateEventModal,
  CreateSubscriptionFormInputs,
} from "../components/CreateEventModal";

export const EventsPage = () => {
  const { user } = useContext(UserContext); // get the current user

  // controls which tab is being used to filter event results
  const [tab, setTab] = useState("all");
  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
  // State stores the current event cards which are conditionally rendered based on the tab selected
  const [eventCards, setEventCards] = useState<JSX.Element[]>([]);

  // Imported hook fetches event data from the API
  const { meetups: allMeetups, fetchMeetups: fetchAllMeetups } =
    useFetchMeetups({ all: true }); // Fetch all meetups
  const { meetups: subscribedMeetups, fetchMeetups: fetchSubscribedMeetups } =
    useFetchMeetups(); // Fetch meetups user has subscribed to

  // Generate an array of all the users subscribed event ids
  // Used to find if a user has already subscribed to an event
  const subscribedMeetupIds = subscribedMeetups.map((meetup) => meetup.id);

  // state to handle open and closing the create event modal
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  // function to handle the opening of the createEventModal
  const handleCreateEventModalOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setCreateEventModalOpen(true);
    event.currentTarget.blur(); // This removes the focus from the button whilst toast is showing
  };

  // function to handle the logic when the create modal is closed
  const handleCreateEventModalClose = async (
    create: boolean,
    eventContent?: CreateSubscriptionFormInputs
  ) => {
    setCreateEventModalOpen(false); // close the modal
    if (create) {
      // Pass the new event content to the
      handleCreateEvent(eventContent!);
    }
  };

  // Page makes a call to the API to create the new event and update the events on the page
  const handleCreateEvent = async (
    eventContent: CreateSubscriptionFormInputs
  ) => {
    try {
      await fetchWrapper("POST", `event`, eventContent); // post new event to API
      await fetchAllMeetups(); // Get a new list of updated events
      await fetchSubscribedMeetups(); // Get a new list of the users subscribed events
      toast.success("Successfully created event"); // inform user the API request worked
    } catch {
      // catch any error, and alert user
      // error message kept generic to avoid exposing any potential vulnerabilities
      toast.error("Failed to create event, please try again");
    }
  };

  const handleUnsubscribe = async (eventId: number) => {
    try {
      await fetchWrapper("DELETE", `event/subscription/${eventId}`); // post event id to have the subscription deleted to the API delete endpoint
      await fetchAllMeetups();
      await fetchSubscribedMeetups();
      toast.success("Successfully unsubscribed from event");
    } catch {
      toast.error("Failed to unsubscribe from event, please try again");
    }
  };

  const handleSubscribe = async (eventId: number) => {
    try {
      await fetchWrapper("POST", `event/subscription/${eventId}`); // post event it to the API submscribe endpoint
      await fetchAllMeetups();
      await fetchSubscribedMeetups();
      toast.success("Successfully subscribed to meetup event");
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

  // When tab changed, re-render the events cards based on the tab value or when the allMeetups array is updated
  useEffect(() => {
    const renderEventCards = () => {
      let events: Meetup[] = allMeetups;
      switch (tab) {
        case "all":
          events = allMeetups;
          break;
        case "online":
          // use the filter method to only return online events
          events = allMeetups.filter((event) => event.is_online);
          break;
        case "offline":
          // use the filter method to only return offline events
          events = allMeetups.filter((event) => !event.is_online);
          break;
        case "available":
          // use the filer to only return events which can be subscribed to
          events = allMeetups.filter(
            (event) => event.subscriber_count < event.max_attendees
          );
          break;
      }
      //  Render an event card showing the event details for each found event from the switch statement
      return events.map((meetup: Meetup) => (
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
      ));
    };
    setEventCards(renderEventCards());
  }, [allMeetups, fetchSubscribedMeetups, tab]);

  return (
    <>
      <Box sx={{ width: "80vw" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.secondary.main }}
          onClick={(event) => handleCreateEventModalOpen(event)}
        >
          {/* button opens the create new event modal */}
          Create New Event
        </Button>
        <Box sx={{ paddingTop: "25px" }}>
          {/* Tab change calls the handleTabChange method which conditionally renders content based on the tab */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs filters"
            allowScrollButtonsMobile
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                color: theme.palette.secondary.main,
              },
            }}
          >
            <Tab value="all" label="All Events" />
            <Tab value="available" label="Available Events" />
            <Tab value="online" label="Online Events" />
            <Tab value="offline" label="In Person Events" />
          </Tabs>
        </Box>
        {/* Event cards is the conditonally rendered cards based on the current tab selected */}
        {eventCards}
        <ToastContainer />
      </Box>
      {/*  Modal used to allow users to create events */}
      <CreateEventModal
        open={createEventModalOpen}
        handleClose={handleCreateEventModalClose}
      />
    </>
  );
};
