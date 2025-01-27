import { Alert, Button, Container, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context";
import { isValidEmail } from "../../utils/utils";
import { fetchWrapper } from "../../utils/fetchWrapper";

export default function LoginForm() {
  const { user, setUser } = useContext(UserContext); // User Context setter allows Context to be updated across appliction

  const navigate = useNavigate(); // useNavigate allows the component to re-route to different pages on login

  // State varaibles control user input password and error messages
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

  // Function sends a http fetch request to the API /user endpoint using the POST method
  const submitLoginForm = async (event: FormEvent) => {
    event.preventDefault(); // Prevents the form from submitting and reloading the page
    const result = await fetchWrapper("POST", "user", {
      password: password,
      email: email,
    });

    if (!result.message) {
      // Update the User Context across the application to the users details
      setUser(() => ({
        id: result.id,
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
        <Alert severity="error">Your login credentials are incorrect</Alert>
      )}
      <form onSubmit={submitLoginForm}>
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
          autoFocus
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
        <br></br>
        <br></br>
        <Button type="submit" fullWidth variant="contained" color="secondary">
          Sign In
        </Button>
      </form>
    </Container>
  );
}
