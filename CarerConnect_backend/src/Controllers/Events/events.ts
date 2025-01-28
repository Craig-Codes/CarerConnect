import { database } from "../../Database/db";
import {
  deleteEventById,
  findAllEvents,
  findAllEventsOffline,
  findAllEventsOnline,
  findUserEventSubscriptions,
  getEventMaxAttendeesById,
  getEventSubscribersById,
  getEventUserId,
  getNumberOfEventSubscribersById,
  insertEvent,
  removeEventSubscription,
  subscribeToEventById,
  updateEventById,
} from "../../Database/queries";
import { Request, Response } from "express";
import { getUserId } from "../User/user";
import { stringInputValidator } from "../../Validators/input";
import { getUserIsAdmin } from "../../Validators/token";

export const getEvents = async (req: Request, res: Response) => {
  try {
    // Get the query parameter
    const onlineStatus = req.query.online;
    let events;

    // Conditional logic to allow for filtering by online / offline events or all events
    if (onlineStatus === undefined) {
      events = (await database.query(findAllEvents)).rows;
    } else if (onlineStatus === "true") {
      events = (await database.query(findAllEventsOnline)).rows;
    } else {
      events = (await database.query(findAllEventsOffline)).rows;
    }
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve events" });
  }
};

export const getUserSubscribedEvents = async (req: Request, res: Response) => {
  const token = req.cookies.CarerConnect_user_token;
  const userId = await getUserId(token); // Decode token to get the users id

  if (userId === 0) {
    return res.status(400).json({ message: "invalid user id" });
  }

  try {
    // Query DB for all events the user has subscribed to
    const events = (await database.query(findUserEventSubscriptions, [userId]))
      .rows;
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve events" });
  }
};

export const unsubscribeEvent = async (req: Request, res: Response) => {
  try {
    // Get the current token to find the current user id
    const token = req.cookies.CarerConnect_user_token;
    const userId = await getUserId(token); // Decode token to get the users id

    if (userId === 0) {
      return res.status(400).json({ message: "invalid user id" });
    }

    // Get eventId from request paramaters
    const eventId = Number(req.params.eventId);

    // If the conversion produces NaN, the input was not a valid integer value
    if (isNaN(eventId)) {
      // 400 - Bad request status code
      return res.status(400).json({ message: "Event id expects a number" });
    }

    // Delete the subscription from the user using a composite key of eventId and userId
    try {
      console.log("eventId: ", eventId);
      console.log("userId: ", userId);
      await database.query(removeEventSubscription, [eventId, userId]);
      return res
        .status(200)
        .json({ message: "Subscription successfully removed" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to remove sbuscription" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to to remove sbuscription" });
  }
};

// Only adminsitrators can delete events - route protected with
// adminAuthorisationMiddlewear
export const deleteEvent = async (req: Request, res: Response) => {
  // Get the input :id and convert the string into a number
  const eventId = Number(req.params.id);

  // If the conversion produces NaN, the input was not a valid integer value
  if (isNaN(eventId)) {
    // 400 - Bad request status code
    return res.status(400).json({ message: "Event id expects a number" });
  }

  try {
    const event = await database.query(deleteEventById, [eventId]);
    console.log(event);
    return res.status(200).json({
      message: "Event deleted",
    });
  } catch (error) {
    // If we have a valid id but can't find a resources, return a 404 error
    return res.status(404).json({ message: "Event id does not exist" });
  }
};

export const addEvent = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.CarerConnect_user_token;
    const userId = await getUserId(token); // Decode token to get the users id

    const title = stringInputValidator(req.body.title);
    const description = stringInputValidator(req.body.description);
    const date = new Date(req.body.date);
    const isOnline = req.body.isOnline === "true"; // convert string into true or false value
    const location = stringInputValidator(req.body.location);
    const maxAttendees = Number(req.body.attendees); // convert value to number

    // validate inputs not already checked
    if (
      isNaN(maxAttendees) ||
      maxAttendees === undefined ||
      date === undefined
    ) {
      return res
        .status(500)
        .json({ message: "Failed to create event, inputs not as expected" });
    }

    // Add the new event
    try {
      const event = await database.query(insertEvent, [
        userId,
        title,
        description,
        date,
        isOnline,
        location,
        maxAttendees,
      ]);

      const eventId = event.rows[0].id;

      // subscribe owner to new event: TODO
      await database.query(subscribeToEventById, [eventId, userId]);

      return res.status(200).json({ message: "Event successfully added" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to create event" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to create event" });
  }
};

export const subscribeEvent = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.CarerConnect_user_token;
    const eventId = Number(req.params.id); // convert value to number
    const userId = await getUserId(token); // Decode token to get the users id

    // validate number input
    if (isNaN(eventId) || eventId === undefined) {
      return res.status(500).json({
        message: "Failed to subscribe to event, inputs not as expected",
      });
    }
    // Check max attendees! Can't subscribe if already full.
    const currentSubscribers = (
      await database.query(getNumberOfEventSubscribersById, [eventId])
    ).rows[0].count;
    const maxAttendees = (
      await database.query(getEventMaxAttendeesById, [eventId])
    ).rows[0].max_attendees;

    // If there are less people currently subscribed than allowed to the event, subscribe the user
    if (currentSubscribers >= maxAttendees) {
      // 422 Unprocessable Entity - request understood and params correct
      return res.status(422).json({
        message: "Failed to subscribe to event",
      });
    }

    // Check a user isn't already subscribbed to an event
    const subscriberQuery = await database.query(getEventSubscribersById, [
      eventId,
    ]);
    const subscribers = subscriberQuery.rows.map((row) => row.user_id);

    const isSubscribed = subscribers.includes(userId);

    if (isSubscribed) {
      return res.status(422).json({
        message: "Failed to subscribe to event - already subscribed",
      });
    }
    // Subscibe to the event
    await database.query(subscribeToEventById, [eventId, userId]);
    return res.status(200).json({
      message: "Successfully subscribbed to event",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to subscribe to event" });
  }
};

// Update event
// Only title an description, if want to change things such as date or location, need to delete event and recreate
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.CarerConnect_user_token;
    const userId = await getUserId(token); // Decode token to get the users id

    const title = stringInputValidator(req.body.title);
    const description = stringInputValidator(req.body.description);
    const eventId = Number(req.params.id); // convert value to number

    // validate number input
    if (isNaN(eventId) || eventId === undefined) {
      return res.status(500).json({
        message: "Failed to update event, inputs not as expected",
      });
    }

    // if user is admin, they can update the event details OR if user is the event creator
    const isAdmin = await getUserIsAdmin(token);
    const eventCreator = (await database.query(getEventUserId, [eventId]))
      .rows[0].id;
    const isCreator = eventCreator === userId ? true : false;

    if (isAdmin || isCreator) {
      try {
        // try to patch event
        await database.query(updateEventById, [eventId, title, description]);
        return res.status(200).json({ message: "Event successfully updated" });
      } catch {
        return res.status(500).json({ message: "Failed to update event" });
      }
    }
  } catch {
    return res.status(500).json({ message: "Failed to update event" });
  }
};
