// import request from "supertest";
// import { app } from "../.."; // Path to your app
// import { database } from "../../Database/db";
// import * as Jwt from "jsonwebtoken"; // Use * as to mock all exports

// jest.mock("../../Database/db", () => ({
//   connectDatabase: jest.fn(), // Mock connectDatabase
//   database: {
//     query: jest.fn(), // Mock any database queries in the test suite with an empty function
//   },
// }));

// // middlewear checking for a valid token needs to be ignored to test route
// jest.mock("../../Middlewear/loggedInUserAuthorisation", () => ({
//   userAuthorisationMiddlewear: (_req: any, _res: any, next: () => any) =>
//     next(), // Bypass middleware
// }));

// jest.mock("jsonwebtoken", () => ({
//   ...jest.requireActual("jsonwebtoken"), // returns a mock function when the module is used
//   verify: jest.fn(), // Mock verify function
// }));

// describe("GET /api/user", () => {
//   it("should return user details if authorised", async () => {
//     // Mock the database response
//     (database.query as jest.Mock).mockResolvedValueOnce({
//       rows: [
//         { email: "test@example.com", username: "testuser", is_admin: false },
//       ],
//     });

//     // Mock the verify function to return a valid email payload
//     (Jwt.verify as jest.Mock).mockImplementationOnce(() => ({
//       email: "test@example.com",
//     }));

//     // call the end point using the setup mock values
//     const response = await request(app)
//       .get("/api/user")
//       .set("Cookie", ["CarerConnect_user_token=validToken"]);

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({
//       user: {
//         email: "test@example.com",
//         username: "testuser",
//         isAdmin: false,
//       },
//     });
//   });

//   it("should return 401 if no token is provided", async () => {
//     const response = await request(app).get("/api/user");

//     expect(response.status).toBe(401);
//     expect(response.body).toEqual({
//       message: "Access denied. No token provided.",
//     });
//   });

//   it("should return 401 if the token is invalid", async () => {
//     // Mock the verify function to throw an error for invalid token
//     (Jwt.verify as jest.Mock).mockImplementationOnce(() => {
//       throw { message: "Invalid token" };
//     });

//     const response = await request(app)
//       .get("/api/user")
//       .set("Cookie", ["CarerConnect_user_token=invalidToken"]);

//     expect(response.status).toBe(401);
//     expect(response.body).toEqual({
//       message: "Access denied. No token provided.",
//     });
//   });
// });
