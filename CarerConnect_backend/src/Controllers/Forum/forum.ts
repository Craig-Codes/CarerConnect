import { database } from "../../Database/db";
import { Request, Response } from "express";
import {
  deletePostById,
  deleteThreadById,
  findCategoriesWithThreadAndPostCount,
  findPostByThread,
  findThreadByCategory,
  findThreadsByCategory,
  insertThread,
} from "../../Database/queries";
import { getUserId, getUserIsAdmin } from "../User/user";

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

// Returns the threads belonging to a category
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
      res.status(200).json({ threads: threads, category: categoryId });
    } catch (error) {
      // If we have a valid id but can't find a resources, return a 404 error
      res.status(404).json({ message: "Category id does not exist" });
    }
  }
};

// Returns a thread with all of its posts
export const getThreadPosts = async (req: Request, res: Response) => {
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

export const addThread = async (req: Request, res: Response) => {
  let userId;
  let categoryId;
  let threadTitle;

  try {
    // Get user email:
    // Check for the token in the request
    const token = req.cookies.CarerConnect_user_token;

    if (!token) {
      // If token is not found, return an error
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    } else {
      // If token is found, decode it to get the users email
      userId = await getUserId(token);
    }

    // Get categoryId from request paramaters
    categoryId = Number(req.body.categoryId);

    // If the conversion produces NaN, the input was not a valid integer value
    if (isNaN(categoryId)) {
      // 400 - Bad request status code
      res.status(400).json({ message: "Category id expects a number" });
    } else {
      // Get the threadTitle from request parameters
      threadTitle = req.body.threadTitle;

      // Add the new thread
      try {
        await database.query(insertThread, [categoryId, userId, threadTitle]);
        res.status(200).json({ message: "Thread successfully added" });
      } catch (error) {
        res.status(500).json({ message: "Failed to add thread" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add thread" });
  }
};

export const addPost = async (req: Request, res: Response) => {};

export const updateThread = async (req: Request, res: Response) => {};

export const updatePost = async (req: Request, res: Response) => {};

export const deleteThread = async (req: Request, res: Response) => {
  // Get the input :id and convert the string into a number
  const threadId = Number(req.params.id);

  // If the conversion produces NaN, the input was not a valid integer value
  if (isNaN(threadId)) {
    // 400 - Bad request status code
    res.status(400).json({ message: "Thread id expects a number" });
  } else {
    try {
      const thread = await database.query(deleteThreadById, [threadId]);
      res.status(200).json({
        message: "Thread deleted",
      });
    } catch (error) {
      // If we have a valid id but can't find a resources, return a 404 error
      res.status(404).json({ message: "Thread id does not exist" });
    }
  }
};

export const deletePost = async (req: Request, res: Response) => {
  // Get the input :id and convert the string into a number
  const postId = Number(req.params.id);

  // If the conversion produces NaN, the input was not a valid integer value
  if (isNaN(postId)) {
    // 400 - Bad request status code
    res.status(400).json({ message: "Thread id expects a number" });
  } else {
    try {
      // Determine if the deleting user is an admin, or the post creator
      // const isAdmin = getUserIsAdmin()
      const thread = await database.query(deletePostById, [postId]);
      res.status(200).json({
        message: "Post deleted",
      });
    } catch (error) {
      // If we have a valid id but can't find a resources, return a 404 error
      res.status(404).json({ message: "Post id does not exist" });
    }
  }
};
