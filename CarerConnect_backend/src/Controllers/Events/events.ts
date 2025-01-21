import { database } from "../../Database/db";
import {
  deleteEventById,
  findAllEvents,
  findAllEventsOffline,
  findAllEventsOnline,
  findUserEventSubscriptions,
  insertEvent,
  removeEventSubscription,
} from "../../Database/queries";
import { Request, Response } from "express";
import { getUserId } from "../User/user";
import { stringInputValidator } from "../../Validators/input";

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
  // Get the path parameter for users id
  const userId = Number(req.params.id);

  if (isNaN(userId)) {
    // 400 - Bad request status code
    return res.status(400).json({ message: "Expected a user ID" });
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
      await database.query(insertEvent, [
        userId,
        title,
        description,
        date,
        isOnline,
        location,
        maxAttendees,
      ]);
      return res.status(200).json({ message: "Event successfully added" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to create event" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to create event" });
  }
};

export const subscribeEvent = async (req: Request, res: Response) => {};
