import bcrypt from "bcryptjs";

const saltRounds = 10;
// The number of iterations the hashing function is applied to the salt and password combination.
// This makes the password harder to crack, however impacts performance.

// Function encrypts a password using the bycrypt package to salt and hash the given value
export const encryptPassword = async (password: string): Promise<string> => {
  const salt = bcrypt.genSaltSync(saltRounds); // generates a random salt value
  const hash = bcrypt.hashSync(password, salt); // hashes the password using the generated salt
  return hash;
};

// Function compares users plaintext password to a hashed password.
export const compareHash = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    // Compares the plaintext password with the hashed version.
    // The bcrypt library extracts the salt value embedded into the hashed password,
    // and uses the value to hash the plaintext value, comparing the two hashes
    const result = await bcrypt.compare(password, hash);
    return result;
  } catch (error) {
    return false;
  }
};
