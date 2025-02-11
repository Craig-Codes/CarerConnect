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
import useFetchMeetups from "../hooks/useFetchMeetups";
import {
  CreateEventModal,
  CreateSubscriptionFormInputs,
} from "../components/CreateEventModal";

export const EventsPage = () => {
  const { user } = useContext(UserContext);

  const [tab, setTab] = useState("all");
  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };
  // State stores the current event cards which are conditionally rendered based on the tab selected
  const [eventCards, setEventCards] = useState<JSX.Element[]>([]);

  const { meetups: allMeetups, fetchMeetups: fetchAllMeetups } =
    useFetchMeetups({ all: true }); // Fetch all meetups
  const { meetups: subscribedMeetups, fetchMeetups: fetchSubscribedMeetups } =
    useFetchMeetups(); // Fetch meetups user has subscribed to

  // Generate an array of all the subscribed event ids
  const subscribedMeetupIds = subscribedMeetups.map((meetup) => meetup.id);

  // state to handle open and closing the create event modal
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  // function to handle the opening of the createEventModal
  const handleCreateEventModalOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setCreateEventModalOpen(true);
    event.currentTarget.blur(); // This removes the focus from the button whilst toast is showing
  };

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
    try {
      await fetchWrapper("POST", `event`, eventContent);
      await fetchAllMeetups();
      await fetchSubscribedMeetups();
      toast.success("Successfully created event");
    } catch {
      toast.error("Failed to create event, please try again");
    }
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

  // When tab changed, re-render the events cards based on the tab value or when the allMeetups array is updated
  useEffect(() => {
    const renderEventCards = () => {
      let events: Meetup[] = allMeetups;
      switch (tab) {
        case "all":
          events = allMeetups;
          break;
        case "online":
          events = allMeetups.filter((event) => event.is_online);
          break;
        case "offline":
          events = allMeetups.filter((event) => !event.is_online);
          break;
        case "available":
          events = allMeetups.filter(
            (event) => event.subscriber_count < event.max_attendees
          );
          break;
      }
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
          Create New Event
        </Button>
        <Box sx={{ paddingTop: "25px" }}>
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
        {eventCards}
        <ToastContainer />
      </Box>
      <CreateEventModal
        open={createEventModalOpen}
        handleClose={handleCreateEventModalClose}
      />
    </>
  );
};
