import { useNavigate, useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useContext, useEffect, useState, MouseEvent } from "react";
import { isLoggedIn } from "../utils/utils";
import { fetchWrapper } from "../utils/fetchWrapper";
import { ForumThreadTable } from "../components/ForumThreadTable";
import { UserContext } from "../components/Context";
import theme from "../theme/theme";
import { toast, ToastContainer } from "react-toastify";
import {
  CreateThreadFormInputs,
  CreateThreadModal,
} from "../components/CreateThreadModal";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

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

  // state to handle open and closing the create event modal
  const [createThreadModalOpen, setCreateThreadModalOpen] = useState(false);
  // function to handle the opening of the createEventModal
  const handleCreateThreadModalOpen = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    setCreateThreadModalOpen(true);
    event.currentTarget.blur(); // This removes the focus from the button whilst toast is showing
  };

  // function to handle the logic when the modal is closed
  const handleCreateThreadModalClose = async (
    create: boolean,
    threadContent?: CreateThreadFormInputs
  ) => {
    setCreateThreadModalOpen(false); // close the modal
    if (create) {
      handleCreateThread(threadContent!);
    }
  };

  const handleCreateThread = async (eventContent: CreateThreadFormInputs) => {
    console.log(eventContent);
    try {
      await fetchWrapper("POST", `forum/thread/${id}`, eventContent);
      await fetchThreads();
      toast.success("Successfully created thread");
    } catch {
      toast.error("Failed to create thread, please try again");
    }
  };

  // function attempts to delete the thread, making a delete request to the API with the threadsId
  const handleThreadDelete = async (threadId: number) => {
    try {
      await fetchWrapper("DELETE", `forum/thread/${threadId}`);
      await fetchThreads();
      toast.success("Successfully deleted thread");
    } catch {
      toast.error("Failed to delete thread, please try again");
    }
  };

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

  // When the id changes, this code triggers
  useEffect(() => {
    // Check that the category is valid, if not redirect to forum category page
    const isValidId = validateCategoryId(id);

    if (!isValidId) {
      navigate("/forum", { replace: true });
    }

    fetchThreads();
  }, [id, navigate]); // fetch new data on id change or navigation

  return (
    <>
      <Box
        sx={{
          padding: "15px",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIosNewIcon />}
          sx={{
            marginBottom: "25px",
            marginRight: "1vw",
            backgroundColor: "white",
          }}
          // on click navigate back to the forum page
          onClick={() => navigate("/forum", { replace: true })}
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            marginBottom: "25px",
            marginLeft: "1vw",
          }}
          onClick={(event) => handleCreateThreadModalOpen(event)}
        >
          Create New Thread
        </Button>
      </Box>
      {/* Dislay the forum thread table, passing in the retrieved threads associated
      with the selected category */}
      <ForumThreadTable
        isAdmin={user.isAdmin}
        threads={allThreads || []}
        deleteEvent={handleThreadDelete}
      />
      {/* Toast container used to show success or fail messages to the user */}
      <ToastContainer />
      {/* Modal used to input new thread information */}
      <CreateThreadModal
        open={createThreadModalOpen}
        handleClose={handleCreateThreadModalClose}
      />
    </>
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
