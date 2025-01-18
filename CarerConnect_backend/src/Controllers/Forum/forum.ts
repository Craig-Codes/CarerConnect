import { database } from "../../Database/db";
import { Request, Response } from "express";
import {
  deletePostById,
  deletePostByIdAndUser,
  deleteThreadById,
  editPostByIdAndUser,
  editPostContent,
  editThreadByIdAndUser,
  editThreadTitle,
  findCategoriesWithThreadAndPostCount,
  findPostByThread,
  findThreadByCategory,
  findThreadsByCategory,
  insertPost,
  insertThread,
} from "../../Database/queries";
import { getUserId, getUserIsAdmin, tokenIsValid } from "../User/user";

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
  }

  try {
    const threads = (await database.query(findThreadsByCategory, [categoryId]))
      .rows;
    res.status(200).json({ threads: threads, category: categoryId });
  } catch (error) {
    // If we have a valid id but can't find a resources, return a 404 error
    res.status(404).json({ message: "Category id does not exist" });
  }
};

export const addThread = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.CarerConnect_user_token;
    const userId = await getUserId(token); // Decode token to get the users id

    if (userId === 0) {
      res.status(400).json({ message: "invalid user id" });
    }

    // Get categoryId from request paramaters
    const categoryId = Number(req.body.categoryId);

    // If the conversion produces NaN, the input was not a valid integer value
    if (isNaN(categoryId)) {
      // 400 - Bad request status code
      res.status(400).json({ message: "Category id expects a number" });
    }

    // Get the threadTitle from request parameters
    const threadTitle = req.body.threadTitle;

    // Add the new thread
    try {
      await database.query(insertThread, [categoryId, userId, threadTitle]);
      res.status(200).json({ message: "Thread successfully added" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add thread" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add thread" });
  }
};

export const deleteThread = async (req: Request, res: Response) => {
  // Get the input :id and convert the string into a number
  const threadId = Number(req.params.id);

  // If the conversion produces NaN, the input was not a valid integer value
  if (isNaN(threadId)) {
    // 400 - Bad request status code
    res.status(400).json({ message: "Thread id expects a number" });
  }

  try {
    const thread = await database.query(deleteThreadById, [threadId]);
    res.status(200).json({
      message: "Thread deleted",
    });
  } catch (error) {
    // If we have a valid id but can't find a resources, return a 404 error
    res.status(404).json({ message: "Thread id does not exist" });
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
  }

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
};

export const addPost = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.CarerConnect_user_token;
    const userId = await getUserId(token); // Decode token to get the users id

    if (userId === 0) {
      res.status(400).json({ message: "invalid user id" });
    }

    // Get threadId from request paramaters
    const threadId = Number(req.body.threadId);

    // If the conversion produces NaN, the input was not a valid integer value
    if (isNaN(threadId)) {
      // 400 - Bad request status code
      res.status(400).json({ message: "thread id expects a number" });
    }

    // Get the post content from request parameters
    const content = req.body.content;

    // Add the new post
    try {
      await database.query(insertPost, [threadId, userId, content]);
      res.status(200).json({ message: "Post successfully added" });
    } catch (error) {
      res.status(500).json({ message: "Failed to create post" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to create post" });
  }
};

// Only adminsitrators can delete threads - route protected with
// adminAuthorisationMiddlewear
export const deletePost = async (req: Request, res: Response) => {
  // Get the input :id and convert the string into a number
  const postId = Number(req.params.id);
  // Get the cookie sent in the response header
  const token = req.cookies.CarerConnect_user_token;

  // Validate id
  if (isNaN(postId)) {
    // 400 - Bad request status code
    res.status(400).json({ message: "Thread id expects a number" });
  }

  try {
    // Determine if the deleting user is an admin (admin can delete any post)
    const isAdmin = await getUserIsAdmin(token);

    if (isAdmin) {
      // If user is admin, delete the post
      try {
        const thread = await database.query(deletePostById, [postId]);
        res.status(200).json({
          message: "Post deleted",
        });
      } catch {
        // If we have a valid id but can't find a resources, return a 404 error
        res.status(404).json({ message: "Unable to delete post" });
      }
    } else {
      try {
        // try to delete the post where post has matching user
        const userId = await getUserId(token);
        const result = await database.query(deletePostByIdAndUser, [
          postId,
          userId,
        ]);
        if (result.rowCount! > 0) {
          res.status(200).json({
            message: "Post deleted",
          });
        } else {
          res.status(404).json({ message: "Unable to delete post" });
        }
      } catch {
        // If we have a valid id but can't find a resources, return a 404 error
        res.status(404).json({ message: "Unable to delete post" });
      }
    }
  } catch (error) {
    // If we have a valid id but can't find a resources, return a 404 error
    res.status(404).json({ message: "Unable to delete post" });
  }
};

export const editThread = async (req: Request, res: Response) => {
  // Get the input :id and convert the string into a number
  const threadId = Number(req.params.id);

  // VALIDATE THE INPUT HERE -> REMOVE PROFANITIES AND LIMIT TO 250 characters!!!
  const title = req.body.title;

  // Get the cookie sent in the response header
  const token = req.cookies.CarerConnect_user_token;

  // Validate id
  if (isNaN(threadId)) {
    // 400 - Bad request status code
    res.status(400).json({ message: "Thread id expects a number" });
  }

  try {
    // Determine if the deleting user is an admin (admin can delete any post)
    const isAdmin = await getUserIsAdmin(token);

    if (isAdmin) {
      // If user is admin, delete the post
      try {
        const thread = await database.query(editThreadTitle, [threadId, title]);
        res.status(200).json({
          message: "Thread updated",
        });
      } catch {
        // If we have a valid id but can't find a resources, return a 404 error
        res.status(404).json({ message: "Unable to update thread" });
      }
    } else {
      try {
        // try to delete the thread where post has matching user
        const userId = await getUserId(token);
        const result = await database.query(editThreadByIdAndUser, [
          threadId,
          userId,
          title,
        ]);
        if (result.rowCount! > 0) {
          res.status(200).json({
            message: "Thread updated",
          });
        } else {
          res.status(404).json({ message: "Unable to update thread" });
        }
      } catch {
        // If we have a valid id but can't find a resources, return a 404 error
        res.status(404).json({ message: "Unable to update thread" });
      }
    }
  } catch (error) {
    // If we have a valid id but can't find a resources, return a 404 error
    res.status(404).json({ message: "Unable to update thread" });
  }
};

export const editPost = async (req: Request, res: Response) => {
  // Get the input :id and convert the string into a number
  const postId = Number(req.params.id);

  // VALIDATE THE INPUT HERE -> REMOVE PROFANITIES AND LIMIT TO 250 characters!!!
  const content = req.body.content;

  // Get the cookie sent in the response header
  const token = req.cookies.CarerConnect_user_token;

  // Validate id
  if (isNaN(postId)) {
    // 400 - Bad request status code
    res.status(400).json({ message: "Post id expects a number" });
  }

  try {
    // Determine if the deleting user is an admin (admin can delete any post)
    const isAdmin = await getUserIsAdmin(token);

    if (isAdmin) {
      // If user is admin, delete the post
      try {
        const thread = await database.query(editPostContent, [postId, content]);
        res.status(200).json({
          message: "Post updated",
        });
      } catch {
        // If we have a valid id but can't find a resources, return a 404 error
        res.status(404).json({ message: "Unable to update post" });
      }
    } else {
      try {
        // try to delete the thread where post has matching user
        const userId = await getUserId(token);
        const result = await database.query(editPostByIdAndUser, [
          postId,
          userId,
          content,
        ]);
        if (result.rowCount! > 0) {
          res.status(200).json({
            message: "Post updated",
          });
        } else {
          res.status(404).json({ message: "Unable to update post" });
        }
      } catch {
        // If we have a valid id but can't find a resources, return a 404 error
        res.status(404).json({ message: "Unable to update post" });
      }
    }
  } catch (error) {
    // If we have a valid id but can't find a resources, return a 404 error
    res.status(404).json({ message: "Unable to update post" });
  }
};
