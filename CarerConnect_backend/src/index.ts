import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./Database/db";
import { getUser, loginUser, registerUser } from "./Controllers/User/user";
import { adminAuthorisationMiddlewear } from "./Middlewear/adminAuthorisation";
import {
  addThread,
  deletePost,
  deleteThread,
  getCategories,
  getThreadPosts,
  getThreads,
} from "./Controllers/Forum/forum";
import { userAuthorisationMiddlewear } from "./Middlewear/loggedInUserAuthorisation";

export const app = express();

// Define the allowed origin - in this case only the frontends domain, preventing cross-site forgery attacks
const corsOptions = {
  origin: "http://localhost:8080", // Frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // use cookie parser on all routes
const port = 3000;

connectDatabase();

app.get("/", (req, res) => {
  res.send("Welcome to the home route!");
});

// adminAuthorisationMiddlewear used to protect certain routes which
// require that a user is an administrator
// userAuthorisationMiddlewear used to protect certain routes which
// require a user to be logged in
app.get("/api/user", userAuthorisationMiddlewear, getUser);
app.post("/api/user", loginUser);
app.post("/api/user/register", registerUser);

// Forum routes
app.get("/api/forum", userAuthorisationMiddlewear, getCategories);

app.get("/api/forum/threads/:id", userAuthorisationMiddlewear, getThreads);
app.delete("/api/forum/thread/:id", adminAuthorisationMiddlewear, deleteThread);
app.post("/api/forum/thread", userAuthorisationMiddlewear, addThread);

app.get("/api/forum/thread/:id", userAuthorisationMiddlewear, getThreadPosts);
app.delete("/api/forum/post/:id", userAuthorisationMiddlewear, deletePost);

// Events routes

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
