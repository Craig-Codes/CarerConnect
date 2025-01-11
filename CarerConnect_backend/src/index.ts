import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./Database/db";
import { getUser, loginUser, registerUser } from "./User/user";

const app = express();

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

app.get("/api/user", getUser);
app.post("/api/user", loginUser);
app.post("/api/user/register", registerUser);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
