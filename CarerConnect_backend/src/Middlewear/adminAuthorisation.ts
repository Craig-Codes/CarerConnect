import Jwt, { JwtPayload } from "jsonwebtoken";
const jwt = Jwt;

// Function checks that a user has admin permissions to access the route
export const adminAuthorisation = (req: any, res: any, next: any) => {
  console.log("Hitting authorisation middlewear");
  const token = req.cookies.CarerConnect_user_token; // Get the cookie

  // If we don't find a token, return a 401 - Unorthorised status
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  // Try to decode the JWT to pull out the permission status (isAdmin)
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY!
    ) as JwtPayload;

    // If isAdmin is true, let the user through
    if (decoded.isAdmin) {
      next();
    } else {
      // If user does not have admin permissions send a 403 forbidden error to indicate user is not allowed access
      return res
        .status(403)
        .json({ message: "Access Denied: You do not have permission" });
    }
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Access Denied: You do not have permission" });
  }
};
