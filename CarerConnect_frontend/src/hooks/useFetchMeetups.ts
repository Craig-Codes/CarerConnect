// This hook is used to allow different components to get meetups
import { useState, useEffect } from "react";
import { fetchWrapper } from "../utils/fetchWrapper";
import { formatDate } from "../utils/utils";
import { Meetup } from "../utils/Types/types";

type useFetchMeetupsProps = {
  all?: boolean; // conditional allows componets to get all events, or just a specific users events
};

export const useFetchMeetups = ({ all = false }: useFetchMeetupsProps = {}) => {
  // State is used to keep track of the current meetups value
  const [meetups, setMeetups] = useState<Meetup[]>([]);

  const fetchMeetups = async () => {
    // Conditionally either get all the events, or just user specific events
    try {
      let eventData;

      if (all) {
        // different API endpoints depending on condition
        eventData = await fetchWrapper("GET", "event");
      } else {
        eventData = await fetchWrapper("GET", "event/user");
      }

      // map the returned events into the correct format
      const formattedMeetups = eventData.map((meetup: Meetup) => ({
        id: meetup.id,
        user_id: meetup.user_id,
        title: meetup.title,
        description: meetup.description,
        event_date: formatDate(meetup.event_date),
        is_online: meetup.is_online,
        location: meetup.location,
        max_attendees: Number(meetup.max_attendees),
        subscriber_count: Number(meetup.subscriber_count),
      }));

      setMeetups(formattedMeetups); // set the meetups across any componet using this hook
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // trigger fetchMeetups on component mount
  useEffect(() => {
    fetchMeetups();
  }, []);

  return { meetups, fetchMeetups };
  // Any component can use the value or set the value using the following syntax:
  //   const { meetups, fetchMeetups } = useFetchMeetups();
};
