import { database } from "../../Database/db";
import { findAllEvents } from "../../Database/queries";
import { Request, Response } from "express";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = (await database.query(findAllEvents)).rows;
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve events" });
  }
};

//   export const getEventsOnline = async (req: Request, res: Response) => {
//     try {
//       const categories = (
//         await database.query(findCategoriesWithThreadAndPostCount)
//       ).rows;
//       return res.status(200).json(categories);
//     } catch (error) {
//       return res.status(500).json({ message: "Unable to retrieve categories" });
//     }
//   };

//   export const getEventsOffline = async (req: Request, res: Response) => {
//     try {
//       const categories = (
//         await database.query(findCategoriesWithThreadAndPostCount)
//       ).rows;
//       return res.status(200).json(categories);
//     } catch (error) {
//       return res.status(500).json({ message: "Unable to retrieve categories" });
//     }
//   };
