import { useNavigate, useParams } from "react-router-dom";
import { Typography, Container } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { isLoggedIn } from "../utils/utils";
import { fetchWrapper } from "../utils/fetchWrapper";
import { ForumThreadTable } from "../components/ForumThreadTable";
import { UserContext } from "../components/Context";

export type ThreadTableRow = {
  id: number;
  thread_title: string;
  post_count: number;
  created_at: string;
  category_id: number;
  category_title: string;
};

export const ForumCategoryPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const { id } = useParams<{ id: string }>(); // Get the category ID from the URL
  const [allThreads, setAllThreads] = useState<ThreadTableRow[]>();

  // When the id changes, this code triggers
  useEffect(() => {
    // Check that the category is valid, if not redirect to forum category page
    const isValidId = validateCategoryId(id);

    if (!isValidId) {
      navigate("/forum", { replace: true });
    }

    const fetchThreads = async () => {
      // If a CarerConnect cookie is found we send a HTTP request to the API
      // to retrieve the logged in users details
      if (isLoggedIn()) {
        try {
          // API request to get the threads by chosen category id
          const request = await fetchWrapper("GET", `forum/threads/${id}`);
          // set the allThreads state to the found results array
          setAllThreads(request);
        } catch (error) {
          console.error("Failed to fetch threads data:", error);
        }
      }
    };

    fetchThreads();
  }, [id, navigate]);

  console.log(allThreads);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Category ID: {id}
      </Typography>
      <Typography>
        Here, you can fetch and display details for category {id}.
      </Typography>
      <ForumThreadTable username={user.username} threads={allThreads || []} />
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
