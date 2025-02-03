import { useNavigate, useParams } from "react-router-dom";
import { Typography, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../utils/utils";
import { fetchWrapper } from "../utils/fetchWrapper";

export const ForumCategoryPage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>(); // Get the category ID from the URL
  const [allThreads, setAllThreads] = useState([]);

  // When the id changes
  useEffect(() => {
    // Check that the category is valid, if not redirect to forum category page
    const isValidId = validateCategoryId(id);

    if (!isValidId) {
      navigate("/forum", { replace: true });
    }

    const fetchThreads = async () => {
      // ensure user is logged in
      if (isLoggedIn()) {
        try {
          const threads = await fetchWrapper("GET", `forum/threads/${id}`);
          // We set the result into the user varaible, which is passed into the apps
          // context, essentially allowing any page to access this information
          setAllThreads(threads);
        } catch (error) {
          console.error("Failed to fetch threads data:", error);
        }
      }
    };

    fetchThreads();
  }, [id]);
  console.log(allThreads);
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Category ID: {id}
      </Typography>
      <Typography>
        Here, you can fetch and display details for category {id}.
      </Typography>
    </Container>
  );
};

// Function checks that input router id matches an expected forum category
const validateCategoryId = (id: string | undefined) => {
  if (id === undefined) {
    return false;
  }
  const validIds = ["1", "2", "3", "4", "5", "6"];
  return validIds.includes(id);
};
