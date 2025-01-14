import { database } from "../../Database/db";
import { Request, Response } from "express";
import { findCategoriesWithThreadAndPostCount } from "../../Database/queries";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = (
      await database.query(findCategoriesWithThreadAndPostCount)
    ).rows;
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve categories" });
  }
};
