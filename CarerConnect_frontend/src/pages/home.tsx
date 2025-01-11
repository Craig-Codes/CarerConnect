import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
// import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useContext } from "react";
import { UserContext } from "../components/Context";

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   password: string;
//   is_admin: boolean;
// }

export const HomePage = () => {
  const { user } = useContext(UserContext);
  console.log("home page: ", user);

  // const [users, setUsers] = useState<User[] | null>(null);
  // const [fetchError, setFetchError] = useState("");

  // useEffect(() => {
  //   const fetchEquipment = async () => {
  //     console.log("Process env ==== ", import.meta.env.VITE_API_URL);
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_API_URL}user`);
  //       if (!response.ok) {
  //         setFetchError("Failed to fetch users!");
  //       }
  //       const retrievedUsers: User[] = await response.json();
  //       setUsers(retrievedUsers);
  //       console.log(retrievedUsers);
  //     } catch (error) {
  //       setFetchError("Failed to retrieve users!");
  //     }
  //   };
  //   fetchEquipment();
  // }, []);

  return (
    <>
      <NavBar />
      <h2>Hi, {user.username}</h2>
      <Stack spacing={2} direction="row">
        <Button variant="text">Text</Button>
        <Button variant="contained" color="secondary">
          Contained
        </Button>
        <Button variant="outlined">Outlined</Button>
      </Stack>
      {/* {fetchError && <p>{fetchError}</p>}
      <ul>
        {users ? (
          users.map((user) => (
            <li key={user.username}>
              {user.username} - {user.email}
            </li>
          ))
        ) : (
          <p>Loading users...</p>
        )}
      </ul> */}
    </>
  );
};
