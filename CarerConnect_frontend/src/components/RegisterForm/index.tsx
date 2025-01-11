import { Alert, Button, Container, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context";
import { isValidEmail } from "../../utils/utils";
import { fetchWrapper } from "../../utils/fetchWrapper";

export default function RegisterForm() {
  const { user, setUser } = useContext(UserContext); // User Context setter allows Context to be upadted across appliction

  const navigate = useNavigate(); // useNavigate allows the component to re-route to different pages on login

  // State varaibles control user input password and error messages
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.value;
    setUsername(inputName);
    if (inputName.length > 50) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Function takes the input event and checks that the password is long enough, adding security
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputPassword = event.target.value;
    setPassword(inputPassword);
    if (inputPassword.length <= 5) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  // Function takes the input event and checks that the password is long enough, adding security
  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const inputPassword = event.target.value;
    setConfirmPassword(inputPassword);
    if (inputPassword.length !== password.length) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  // State varaibles control user input email and error messages
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  // Function takes the input event and checks that the email is a valid address
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
    if (isValidEmail(inputEmail)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const [logAlert, setLogAlert] = useState(false); // State variable controls errors returning from the API

  // Function sends a http fetch request to the API /user/register endpoint using the POST method
  const submitRegisterForm = async (event: FormEvent) => {
    event.preventDefault(); // Prevents the form from submitting and reloading the page
    const result = await fetchWrapper("POST", "user/register", {
      username: username,
      password: password,
      email: email,
    });

    if (!result.message) {
      // Update the User Context across the application to the users details
      setUser(() => ({
        email: result.email,
        isAdmin: result.isAdmin,
        username: result.username,
      }));
    } else {
      setLogAlert(true);
    }
  };

  // When the user variable is updated, navigate if it has a value
  useEffect(() => {
    if (user.username !== "") {
      navigate("/"); // Navigate to the home route
    }
  }, [user, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      {logAlert && (
        <Alert severity="error">Unable to register, check credentials</Alert>
      )}
      <form onSubmit={submitRegisterForm}>
        <TextField
          error={usernameError} // Highlight field as red showing an error if email address is not valid
          helperText={
            usernameError
              ? "Please enter a name less than 50 characters long"
              : ""
          } // Error appears if username is longer than 50 characters
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          inputProps={{ maxLength: 50 }}
          value={username}
          onChange={handleUsernameChange} // Function checks for email address errors, setting the emailError state variable
          type="string"
          name="username"
        />
        <TextField
          error={emailError} // Highlight field as red showing an error if email address is not valid
          helperText={emailError ? "Your email is not valid" : ""} // Error appears if email address is not valid
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          value={email}
          onChange={handleEmailChange} // Function checks for email address errors, setting the emailError state variable
          type="email"
          name="email"
          autoComplete="email"
        />
        <TextField
          error={passwordError} // Highlight field as red showing an error if password is not long enough
          helperText={
            passwordError ? "You must have a password over 5 characters" : ""
          } // Error appears if password is not long enough
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          inputProps={{ minLength: 5 }}
          label="Password"
          value={password}
          onChange={handlePasswordChange} // Function checks that the password is at least 5 characters long
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <TextField
          error={confirmPasswordError} // Highlight field as red showing an error if password is not long enough
          helperText={confirmPasswordError ? "Passwords must match" : ""} // Error appears if passwords do not match
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirm-password"
          inputProps={{ minLength: 5 }}
          label="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange} // Function checks that the password is at least 5 characters long
          type="password"
          id="confirm-password"
        />
        <br></br>
        <br></br>
        <Button type="submit" fullWidth variant="contained" color="secondary">
          Sign Up
        </Button>
      </form>
    </Container>
  );
}
