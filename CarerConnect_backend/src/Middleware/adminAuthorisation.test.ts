import request from "supertest";
import express from "express";
import { getUserIsAdmin } from "../Validators/token";
import { adminAuthorisationMiddleware } from "./adminAuthorisation";

// mock the token validation logic
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
app.use(adminAuthorisationMiddleware);
app.get("/admin", (req, res) => {
  res.status(200).json({ message: "Welcome Admin" });
});

describe("adminAuthorisationMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow access if user is admin", async () => {
    // mock the getUserIsAdmin function to return true, which would let the request through
    (getUserIsAdmin as jest.Mock).mockResolvedValue(true);

    const response = await request(app).get("/admin"); // route hits middleware
    expect(response.status).toBe(200); // 200 code for success
    expect(response.body.message).toBe("Welcome Admin");
  });

  it("should deny access if user is not admin", async () => {
    (getUserIsAdmin as jest.Mock).mockResolvedValue(false);

    const response = await request(app).get("/admin");
    expect(response.status).toBe(403); // 403 code for access denied
    expect(response.body.message).toBe(
      "Access Denied: You do not have permission"
    );
  });
});
