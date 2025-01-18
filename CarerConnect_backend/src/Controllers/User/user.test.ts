import { createWebToken } from "./user";
import jwt from "jsonwebtoken";

// Mock the JWT_PRIVATE_KEY
process.env.JWT_PRIVATE_KEY = "your-secret-key";

describe("createWebToken", () => {
  it("should generate a valid JWT token", () => {
    // Given
    const email = "test@example.com";
    const token = createWebToken(email, true);

    // When - Verify the token is correctly signed and valid
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!);

    // Then
    expect(decoded).toHaveProperty("email", email);
  });

  it("should expire after 1 hour", () => {
    // Given
    const email = "test@example.com";
    const token = createWebToken(email, true);

    // When
    const decoded = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY!
    ) as jwt.JwtPayload;

    // Get the current time and check if the expiration time is within 1 hour (3,600,000 ms)
    const currentTimeInMs = Date.now();
    const expirationTimeInMs = decoded.exp! * 1000; // exp is in seconds, so multiply by 1000 to get milliseconds

    // Check that the expiration time is within 1 hour (3,600,000 ms) from the current time
    expect(expirationTimeInMs - currentTimeInMs).toBeLessThanOrEqual(3600000); // 1 hour in ms
  });
});
