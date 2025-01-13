import { encryptPassword, compareHash } from "./hashing";
import bcrypt from "bcryptjs";

describe("Password Utilities", () => {
  const password = "mySecurePassword";

  it("should generate a hashed password", async () => {
    // Given
    const hashedPassword = await encryptPassword(password);

    // Then - Check that the hashed password is not null or undefined
    expect(hashedPassword).toBeDefined();
    expect(typeof hashedPassword).toBe("string");

    // Ensure the hashed password is not the same as the plain text password
    expect(hashedPassword).not.toEqual(password);
  });

  it("should create a valid hash that can be compared with the original password", async () => {
    // Given
    const hashedPassword = await encryptPassword(password);

    // When - Use bcrypt.compare to validate the password against the hash
    const isValid = await bcrypt.compare(password, hashedPassword);

    // Then
    expect(isValid).toBe(true);
  });

  it("should return true for a valid password and hash", async () => {
    // Given
    const hashedPassword = await encryptPassword(password);

    // When
    const isValid = await compareHash(password, hashedPassword);

    // Then
    expect(isValid).toBe(true);
  });

  it("should return false for an invalid password and hash", async () => {
    // Given
    const hashedPassword = await encryptPassword(password);

    // When
    const isValid = await compareHash("wrongPassword", hashedPassword);

    // Then
    expect(isValid).toBe(false);
  });
});
