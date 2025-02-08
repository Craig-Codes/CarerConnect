import { database } from "../../Database/db";
import { Request, Response } from "express";
import { compareHash, encryptPassword } from "../../Utils/hashing";
import { insertUser, findUserQuery } from "../../Database/queries";
import Jwt, { JwtPayload } from "jsonwebtoken";
const jwt = Jwt;

// Function checks to see if a users password is valid
// The input password is comapred to the hashed pasword found in the db.
const isValidPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await compareHash(password, hash);
};

// Create a JWT and send to the user. This can then be passed back in subsequent requests, allowing API to be stateless.
// Signing the token using an environmet variable ensures the token is trusted
// as only the originator knows the private key
// Token encapsualtes users unique email, and permission level
export const createWebToken = (inputEmail: string, isAdmin: boolean) => {
  return jwt.sign(
    { email: inputEmail, isAdmin: isAdmin },
    process.env.JWT_PRIVATE_KEY!,
    {
      expiresIn: "1h",
    }
  );
};

// Function returns a full list of users with details... remove this!!!!
export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = (await database.query("SELECT * FROM person;")).rows;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve users" });
  }
};

// Function returns an individual user statelessly using browser cookie storing JWT
export const getUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.CarerConnect_user_token;
    const userEmail = getUserEmail(token); // decode token to get userEmail

    if (userEmail === null) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const result = await database.query(findUserQuery, [userEmail]);
    res.status(200).json({
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        username: result.rows[0].username,
        isAdmin: result.rows[0].is_admin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user" });
  }
};

// Function logs in a user, issuing a JSON Web Token stored in a cookie on successful authentication
export const loginUser = async (req: Request, res: Response) => {
  try {
    // Retrieve the user inputs from POST method body
    const inputEmail = req.body.email;
    const inputPassword = req.body.password;
    // Get the user from the database
    const user = await database.query(findUserQuery, [inputEmail]);

    if (await isValidPassword(inputPassword, user.rows[0].password)) {
      // Create a JWT using the users email and permissions level
      const isAdmin = user.rows[0].is_admin;
      const token = createWebToken(inputEmail, isAdmin);

      // Set the cookie to store the JWT
      res.cookie("CarerConnect_user_token", token, {
        maxAge: 3600000, // Cookie expiration in milliseconds
      });

      res.status(200).json({
        id: user.rows[0].id,
        email: user.rows[0].email,
        username: user.rows[0].username,
        isAdmin: user.rows[0].is_admin,
      });
    } else {
      res.status(401).json({ message: "Failed to authenticate user" });
    }
  } catch (error) {
    res.status(401).json({ message: "Failed to find user" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    // Retrieve the user inputs from POST method body
    const { username, email, password } = req.body;
    // Input validation
    // Validate username (must be 50 characters or less)
    if (username.length > 50) {
      return res
        .status(400)
        .json({ message: "Username must be 50 characters or less" });
    }

    // Validate email (must be a valid email address)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regex to validate an email address:
    // Local part before "@" can contain any characters except spaces and "@".
    // "@" separates the local part from the domain.
    // Domain part must contain characters (excluding spaces and "@") followed by a dot ".".
    // TLD (top-level domain) follows the dot and must not contain spaces or "@".

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Validate password (must be longer than 5 characters)
    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password must be longer than 5 characters" });
    }

    // Hash and Salt the password before it is stored in the database
    const encryptedPassword = await encryptPassword(password);

    // Create a new user in the database (defaulting to no admin permissions)
    // If either username or email unique fields are not unique, the database
    // will return an error and the catch block will be hit
    const newUser = await database.query(insertUser, [
      username,
      email,
      encryptedPassword,
      false,
    ]);

    // Login the new user
    const token = createWebToken(email, false);

    // Set the cookie to store the JWT
    res.cookie("CarerConnect_user_token", token, {
      maxAge: 3600000, // Cookie expiration in milliseconds
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie (XSS attacks)
      secure: true, // Ensures the cookie is sent over HTTPS only
      sameSite: "strict", // Limits cross-site requests to prevent CSRF
    });

    res.status(200).json({
      id: newUser.rows[0].id,
      email: newUser.rows[0].email,
      username: newUser.rows[0].username,
      isAdmin: newUser.rows[0].is_admin,
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to register" });
  }
};

// Decode the JWT  to get users unique email address
// then query the database to return users id
export const getUserId = async (token: string): Promise<Number> => {
  try {
    if (!token) {
      // if there is no value in token, return 0
      return 0;
    } else {
      const decoded = jwt.verify(
        token,
        process.env.JWT_PRIVATE_KEY!
      ) as JwtPayload;
      return Number(
        (await database.query(findUserQuery, [decoded.email])).rows[0].id
      );
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
};

// Decode the JWT  to get users unique email address
export const getUserEmail = (token: string) => {
  try {
    if (!token) {
      // if there is no value in token, return null
      return null;
    } else {
      const decoded = jwt.verify(
        token,
        process.env.JWT_PRIVATE_KEY!
      ) as JwtPayload;
      return decoded.email;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
