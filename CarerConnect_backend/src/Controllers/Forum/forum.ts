import { database } from "../../Database/db";
import { Request, Response } from "express";
import {
  findCategoriesWithThreadAndPostCount,
  findPostByThread,
  findThreadByCategory,
  findThreadsByCategory,
} from "../../Database/queries";

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

export const getThreads = async (req: Request, res: Response) => {
  // Get the input :id and convert the string into a number
  const categoryId = Number(req.params.id);

  // If the conversion produces NaN, the input was not a valid integer value
  if (isNaN(categoryId)) {
    // 400 - Bad request status code
    res.status(400).json({ message: "Category id expects a number" });
  } else {
    try {
      const threads = (
        await database.query(findThreadsByCategory, [categoryId])
      ).rows;
      res.status(200).json(threads);
    } catch (error) {
      // If we have a valid id but can't find a resources, return a 404 error
      res.status(404).json({ message: "Category id does not exist" });
    }
  }
};

// Returns a thread with all of its posts
export const getThread = async (req: Request, res: Response) => {
  // Get the input :id and convert the string into a number
  const categoryId = Number(req.params.id);

  // If the conversion produces NaN, the input was not a valid integer value
  if (isNaN(categoryId)) {
    // 400 - Bad request status code
    res.status(400).json({ message: "Thread id expects a number" });
  } else {
    try {
      const thread = (await database.query(findThreadByCategory, [categoryId]))
        .rows;
      const threadId = Number(thread[0].id);
      console.log(threadId);
      const posts = (await database.query(findPostByThread, [threadId])).rows;

      res.status(200).json({
        thread: thread,
        posts: posts,
      });
    } catch (error) {
      // If we have a valid id but can't find a resources, return a 404 error
      res.status(404).json({ message: "Thread id does not exist" });
    }
  }
};
