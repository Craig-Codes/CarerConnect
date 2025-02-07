import { profanity } from "@2toad/profanity";

export const stringInputValidator = (
  input: string,
  maxlength: number = 255
): string => {
  let inputString = input;

  // SQL free text input has a max length of 255 on all fields
  // If over 255, cut down to ensure compliance
  if (inputString.length > maxlength) {
    // Reduce the characters down to 252, then add on ellipses
    inputString = inputString.substring(0, 252) + "...";
  }

  // Star out any identified inapproproate words in the string
  return profanity.censor(inputString);
};
