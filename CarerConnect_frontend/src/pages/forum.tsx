import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
// import { useEffect, useState } from "react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/Context";
import { isLoggedIn } from "../utils/utils";
import { fetchWrapper } from "../utils/fetchWrapper";

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   password: string;
//   is_admin: boolean;
// }

export const ForumPage = () => {
  const { user } = useContext(UserContext);
  console.log("forum: ", user);

  const [forumCategoryData, setForumCategoryData] = useState({});

  // When the appl loads, the useEffect hook triggers
  useEffect(() => {
    const fetchUser = async () => {
      // If a CarerConnect cookie is found we send a HTTP request to the API
      // to retrieve the logged in users details
      if (isLoggedIn()) {
        try {
          const categoryData = await fetchWrapper("GET", "forum");
          // We set the result into the user varaible, which is passed into the apps
          // context, essentially allowing any page to access this information
          setForumCategoryData(categoryData);
        } catch (error) {
          console.error("Failed to fetch category data:", error);
        }
      }
    };

    fetchUser();
  }, []);

  console.log(forumCategoryData);

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
      <h2>Hi, {user.username} - FORUM PAGE</h2>
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
