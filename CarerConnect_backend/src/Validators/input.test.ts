import { stringInputValidator } from "./input";

describe("Input validation", () => {
  it("String inputs should be no more than 255 characters", () => {
    // Given
    const userInputString = "X".repeat(256);

    // When - Validate that the string is equal to or below 255 characters
    const validatedString = stringInputValidator(userInputString);

    // Then
    expect(validatedString.length).toEqual(255);
  });

  it("should remove profanities", () => {
    // Given
    const string = "ass";

    // When
    const validatedString = stringInputValidator(string);

    // Then
    expect(validatedString).toEqual("@#$%&!");
  });

  it("should remove profanities from inside sentances", () => {
    // Given
    const string = "what an ass!";

    // When
    const validatedString = stringInputValidator(string);

    // Then
    expect(validatedString).toEqual("what an @#$%&!!");
  });
});
