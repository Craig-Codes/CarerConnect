// File contains any types used across multiple files, sharing them from one fixed source of truth

// Define how each meetup object should be shaped
export type Meetup = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  event_date: string;
  is_online: boolean;
  location: string;
  max_attendees: number;
  subscriber_count: number;
};

// User type encapsulates necessary user information required across the application
export type User = {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
};

// Define the necessary properties of a post
export type Post = {
  id: number;
  thread_id: number;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
};

// Define the necessary properities of a thread
export type Thread = {
  id: number;
  thread_title: string;
  post_count: number;
  created_at: string;
  category_id: number;
  category_title: string;
};
