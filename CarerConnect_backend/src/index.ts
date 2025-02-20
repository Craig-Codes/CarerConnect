import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./Database/db";
import { getUser, loginUser, registerUser } from "./Controllers/User/user";
import { adminAuthorisationMiddleware } from "./Middleware/adminAuthorisation";
import {
  addPost,
  addThread,
  deletePost,
  deleteThread,
  editPost,
  editThread,
  getCategories,
  getThreadPosts,
  getThreads,
} from "./Controllers/Forum/forum";
import { userAuthorisationMiddleware } from "./Middleware/loggedInUserAuthorisation";
import {
  addEvent,
  deleteEvent,
  getEvents,
  getUserSubscribedEvents,
  subscribeEvent,
  unsubscribeEvent,
  updateEvent,
} from "./Controllers/Events/events";

// The node.js application uses the express framework - a lightweight web application framework
export const app = express();

// Define the allowed origin - in this case only the frontends domain, preventing cross-site forgery attacks
const corsOptions = {
  origin: "http://localhost:8080", // Frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions)); // cors enabled, protecting the server from unorthorised traffic which will be dropped
app.use(express.json()); // allows express to parse http method request json body
app.use(cookieParser()); // use cookie parser on all routes
const port = 3000; // port the server is served on

connectDatabase(); // when the app is loaded, connect to the database

// This route is currently used for quick testing purposes. Allowing a simple get request to '/' to prove the app is running
app.get("/", (req, res) => {
  res.send("Welcome to the home route!");
});

// For a stateless architecture, the server does not store sessions
// Instead, it relies on cookies being sent with each request, which are decoded to find user information
// This is carried out in the middleware, which protects all API endpoints.

// adminAuthorisationMiddleware used to protect certain routes which
// require that a user is an administrator
// userAuthorisationMiddlewear used to protect certain routes which
// require a user to be logged in

// User routes
app.get("/api/user", userAuthorisationMiddleware, getUser);
app.post("/api/user", loginUser);
app.post("/api/user/register", registerUser);

// Forum routes
app.get("/api/forum", userAuthorisationMiddleware, getCategories);
app.get("/api/forum/threads/:id", userAuthorisationMiddleware, getThreads);
app.delete("/api/forum/thread/:id", adminAuthorisationMiddleware, deleteThread);
app.post("/api/forum/thread/:id", userAuthorisationMiddleware, addThread);
app.patch("/api/forum/thread/:id", userAuthorisationMiddleware, editThread);
app.get("/api/forum/thread/:id", userAuthorisationMiddleware, getThreadPosts);
app.delete("/api/forum/post/:id", userAuthorisationMiddleware, deletePost);
app.post("/api/forum/post/:id", userAuthorisationMiddleware, addPost);
app.patch("/api/forum/post/:id", userAuthorisationMiddleware, editPost);

// Events routes
app.get("/api/event", userAuthorisationMiddleware, getEvents);
app.get(
  "/api/event/user",
  userAuthorisationMiddleware,
  getUserSubscribedEvents
);
app.patch("/api/event/:id", userAuthorisationMiddleware, updateEvent);
app.delete("/api/event/:id", adminAuthorisationMiddleware, deleteEvent);
app.delete(
  "/api/event/subscription/:eventId",
  userAuthorisationMiddleware,
  unsubscribeEvent
);
app.post("/api/event", userAuthorisationMiddleware, addEvent);
app.post(
  "/api/event/subscription/:id",
  userAuthorisationMiddleware,
  subscribeEvent
);

// When the app starts, it listens for requests entering on only the chosen port (3000)
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
