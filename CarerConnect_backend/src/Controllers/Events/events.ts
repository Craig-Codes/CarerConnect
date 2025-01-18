import { database } from "../../Database/db";
import {
  findAllEvents,
  findAllEventsOffline,
  findAllEventsOnline,
  findUserEventSubscriptions,
} from "../../Database/queries";
import { Request, Response } from "express";

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
    const events = (await database.query(findUserEventSubscriptions, [userId]))
      .rows;
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve events" });
  }
};

export const addEvent = async (req: Request, res: Response) => {};

export const subscribeEvent = async (req: Request, res: Response) => {};

export const unsubscribeEvent = async (req: Request, res: Response) => {};

export const deleteEvent = async (req: Request, res: Response) => {};
