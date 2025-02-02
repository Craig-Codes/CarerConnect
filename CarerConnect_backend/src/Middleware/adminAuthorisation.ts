import Jwt, { JwtPayload } from "jsonwebtoken";
import { getUserIsAdmin } from "../Validators/token";

const jwt = Jwt;

// Function checks that a user has admin permissions to access the route
export const adminAuthorisationMiddleware = async (
  req: any,
  res: any,
  next: any
) => {
  const token = req.cookies.CarerConnect_user_token; // Get the cookie
  //there is a value in token, try to decode
  const isAdmin = await getUserIsAdmin(token);

  // If isAdmin is true, let the user through
  if (isAdmin) {
    next();
  } else {
    // If user does not have admin permissions send a 403 forbidden error to indicate user is not allowed access
    return res
      .status(403)
      .json({ message: "Access Denied: You do not have permission" });
  }
};
