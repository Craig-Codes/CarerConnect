// Define how each meetup object should be shaped
export type Meetup = {
  id: number;
  title: string;
  description: string;
  event_date: string;
  is_online: boolean;
  location: string;
  max_attendees: number;
  subscriber_count: number;
};
