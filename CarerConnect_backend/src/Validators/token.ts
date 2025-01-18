import Jwt, { JwtPayload } from "jsonwebtoken";
import { database } from "../Database/db";
import { findUserQuery } from "../Database/queries";
const jwt = Jwt;

// Decode the JWT to get users unique email address
// then query the database to return users admin status
export const getUserIsAdmin = async (token: string) => {
  try {
    if (!token) {
      // if there is no value in token, return false
      return false;
    } else {
      const decoded = jwt.verify(
        token,
        process.env.JWT_PRIVATE_KEY!
      ) as JwtPayload;
      const isAdmin = (await database.query(findUserQuery, [decoded.email]))
        .rows[0].is_admin;
      return isAdmin;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Function checks that the input token exists and can be decoded
export const tokenIsValid = async (token: string) => {
  try {
    if (!token) {
      // if there is no value in token, return false
      return false;
    } else {
      // if there is a value in token, try to decode
      const decoded = jwt.verify(
        token,
        process.env.JWT_PRIVATE_KEY!
      ) as JwtPayload;

      if (decoded) {
        return true;
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
