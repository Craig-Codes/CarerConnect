import { useState, useEffect } from "react";
import { fetchWrapper } from "../utils/fetchWrapper";
import { formatDate } from "../utils/utils";
import { Meetup } from "../utils/Types/types";

type useFetchMeetupsProps = {
  all?: boolean;
};

const useFetchMeetups = ({ all = false }: useFetchMeetupsProps = {}) => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);

  const fetchMeetups = async () => {
    // Conditionally either get all the events, or just user specific events
    try {
      let eventData;

      if (all) {
        eventData = await fetchWrapper("GET", "event");
      } else {
        eventData = await fetchWrapper("GET", "event/user");
      }

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

      setMeetups(formattedMeetups);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // trigger fetchMeetups on component mount
  useEffect(() => {
    fetchMeetups();
  }, []);

  return { meetups, fetchMeetups };
};

export default useFetchMeetups;
