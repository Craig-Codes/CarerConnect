import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./Database/db";
import {
  getUser,
  getUsers,
  loginUser,
  registerUser,
} from "./Controllers/User/user";
import { adminAuthorisation } from "./Middlewear/adminAuthorisation";
import { getCategories } from "./Controllers/Forum/forum";

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

// AdminAuthroisation middlewear used to protect certain routes which
// require that a user is an administrator
app.get("/api/user", adminAuthorisation, getUser);
app.post("/api/user", loginUser);
app.post("/api/user/register", registerUser);

app.get("/api/forum", getCategories);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
