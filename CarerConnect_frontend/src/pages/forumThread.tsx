import { Box, Button, Paper, Typography } from "@mui/material";
import { useContext, useEffect, useState, MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../components/Context";
import { isLoggedIn } from "../utils/utils";
import { fetchWrapper } from "../utils/fetchWrapper";
import dayjs from "dayjs";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { toast, ToastContainer } from "react-toastify";
import {
  CreatePostFormInputs,
  CreatePostModal,
} from "../components/CreatePostModal";
import theme from "../theme/theme";
import { ForumThreadTitleBlock } from "../components/ForumThreadTitleBlock";

export type Post = {
  id: number;
  thread_id: number;
  content: string;
  created_at: string;
};

type Thread = {
  title: string;
  createdAt: string;
};

export const ForumThreadPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const { id } = useParams<{ id: string }>(); // Get the category ID from the URL
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [thread, setThread] = useState<Thread>();

  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  // function to handle the opening of the createPostModal
  const handleCreatePostModalOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setCreatePostModalOpen(true);
    event.currentTarget.blur(); // This removes the focus from the button whilst toast is showing
  };

  // function to handle the logic when the modal is closed
  const handleCreatePostModalClose = async (
    create: boolean,
    postContent?: CreatePostFormInputs
  ) => {
    setCreatePostModalOpen(false); // close the modal
    if (create) {
      handleCreatePost(postContent!);
    }
  };

  const handleCreatePost = async (eventContent: CreatePostFormInputs) => {
    try {
      // Create the post body obejct to provide the API the correct inputs necessary to create a new post
      const postBody = {
        content: eventContent.content,
        threadId: id,
      };
      await fetchWrapper("POST", `forum/post/${id}`, postBody);
      await fetchPosts();
      toast.success("Successfully created post");
    } catch {
      toast.error("Failed to create post, please try again");
    }
  };

  const fetchPosts = async () => {
    // If a CarerConnect cookie is found we send a HTTP request to the API
    // to retrieve the logged in users details
    if (isLoggedIn()) {
      try {
        // API request to get the threads by chosen category id
        const request = await fetchWrapper("GET", `forum/thread/${id}`);
        // extract the thread data and format correctly
        const thread = {
          title: request["thread"].title,
          // fornate the date ISO string using day.js library
          createdAt: dayjs().format("D MMMM YY - HH:mm"),
        };
        setThread(thread);
        // loop through the posts and map correctly - change date and time into human readable format
        const posts = request["posts"].map((post: Post) => ({
          ...post, // bring all properties into new object
          // fornate the date ISO string using day.js library
          created_at: dayjs().format("D MMMM YY - HH:mm"),
        }));
        // set the allPost state to the found and formatted results array
        setAllPosts(posts);
      } catch (error) {
        console.error("Failed to fetch posts data:", error);
      }
    }
  };

  console.log(thread);
  console.log(allPosts);

  // When the id changes, this code triggers
  useEffect(() => {
    try {
      fetchPosts();
    } catch {
      console.log("Failed to fetch posts");
      navigate(-1); // navigate back a page
    }
  }, [id, navigate]); // fetch new data on id change or navigation

  console.log(allPosts);

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
          onClick={() => navigate(-1)}
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
          onClick={(event) => handleCreatePostModalOpen(event)}
        >
          Create New Post
        </Button>
      </Box>
      {/* Show the thread details the posts relate to */}
      <ForumThreadTitleBlock
        title={thread?.title || ""}
        createdAt={thread?.createdAt || ""}
      />
      {/* /* If we have any posts, display them */}
      {allPosts.length > 0 && (
        <>
          <Paper
            elevation={2}
            sx={{
              padding: "2vw",
              marginTop: "20px",
              textAlign: "left",
            }}
          ></Paper>
          {/* Add a second create button to save the user having to scroll back up to the top of the page */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.secondary.main,
              marginBottom: "25px",
              marginLeft: "1vw",
              marginTop: "25px",
            }}
            onClick={(event) => handleCreatePostModalOpen(event)}
          >
            Create New Post
          </Button>
        </>
      )}
      {/* If we have don't have any posts, prompt the user to add one */}
      {allPosts.length == 0 && (
        <Typography sx={{ marginTop: "25px" }}>
          No posts, please create one to start the conversation
        </Typography>
      )}

      <ToastContainer />
      {/* Modal used to input new thread information */}
      <CreatePostModal
        open={createPostModalOpen}
        handleClose={handleCreatePostModalClose}
      />
    </>
  );
};
