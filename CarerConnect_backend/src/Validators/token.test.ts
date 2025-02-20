import Jwt from "jsonwebtoken";
import { database } from "../Database/db";
import { getUserIsAdmin } from "./token";
import { findUserQuery } from "../Database/queries";

jest.mock("jsonwebtoken");
jest.mock("../Database/db");

describe("getUserIsAdmin", () => {
  // mock return values
  const mockToken = "mockToken";
  const mockDecoded = { email: "test@example.com" };
  const mockQueryResult = { rows: [{ is_admin: true }] };
  const mockQueryResultFalse = { rows: [{ is_admin: false }] };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return false if token is not provided", async () => {
    const result = await getUserIsAdmin("");
    expect(result).toBe(false);
  });

  it("should return true if user is admin", async () => {
    (Jwt.verify as jest.Mock).mockReturnValue(mockDecoded); // mock the jwt verify call
    (database.query as jest.Mock).mockResolvedValue(mockQueryResult); // mock the database query

    const result = await getUserIsAdmin(mockToken); // jwt verify call
    expect(Jwt.verify).toHaveBeenCalledWith(
      mockToken,
      process.env.JWT_PRIVATE_KEY!
    );
    // database called with correct query to get a user, based on the retieved toekn data
    expect(database.query).toHaveBeenCalledWith(findUserQuery, [
      mockDecoded.email,
    ]);
    expect(result).toBe(true);
  });

  it("should return false if user is not an admin", async () => {
    (Jwt.verify as jest.Mock).mockReturnValue(mockDecoded);
    (database.query as jest.Mock).mockResolvedValue(mockQueryResultFalse);

    const result = await getUserIsAdmin(mockToken);
    expect(Jwt.verify).toHaveBeenCalledWith(
      mockToken,
      process.env.JWT_PRIVATE_KEY!
    );
    expect(database.query).toHaveBeenCalledWith(findUserQuery, [
      mockDecoded.email,
    ]);
    expect(result).toBe(false);
  });
});
