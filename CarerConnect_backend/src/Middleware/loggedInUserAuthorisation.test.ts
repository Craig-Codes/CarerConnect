import request from "supertest";
import express from "express";
import { tokenIsValid } from "../Validators/token";
import { userAuthorisationMiddleware } from "./loggedInUserAuthorisation";

// Mock the token validation function (tokenIsValid)
jest.mock("../Validators/token");

// create an isolated instance of the app
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  // set the token used in all requests
  req.cookies = { CarerConnect_user_token: "mockToken" };
  next();
});
// Middleware is triggered before any route
app.use(userAuthorisationMiddleware);
app.get("/user", (req, res) => {
  res.status(200).json({ message: "Welcome User" });
});

describe("userAuthorisationMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow access if token is valid", async () => {
    // mock the getUserIsAdmin function to return true, which would let the request through
    (tokenIsValid as jest.Mock).mockResolvedValue(true);

    const response = await request(app).get("/user"); // route hits the middleware
    expect(response.status).toBe(200); // 200 code for success
    expect(response.body.message).toBe("Welcome User");
  });

  it("should deny access if token is invalid", async () => {
    (tokenIsValid as jest.Mock).mockResolvedValue(false);

    const response = await request(app).get("/user");
    expect(response.status).toBe(401); // 401 code for access denied
    expect(response.body.message).toBe("Access Denied: Invalid Token");
  });
});
