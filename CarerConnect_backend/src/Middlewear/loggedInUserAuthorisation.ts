import Jwt, { JwtPayload } from "jsonwebtoken";
import { tokenIsValid } from "../Controllers/User/user";
const jwt = Jwt;

// Function checks that a user has a valid JWT and is therefore logged in
export const userAuthorisationMiddlewear = async (
  req: any,
  res: any,
  next: any
) => {
  const token = req.cookies.CarerConnect_user_token; // Get the cookie
  // Check that the token is a valid token which can be decoded
  const validatedToken = await tokenIsValid(token);
  // If we don't find a token, return a 401 - Unorthorised status

  if (!validatedToken) {
    return res.status(401).json({ message: "Access Denied: Invalid Token" });
  } else {
    next();
  }
};
