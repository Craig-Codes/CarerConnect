// Page shows all forum threads for the chosen category

import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState, MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../components/Context";
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
import { ForumPostGroup } from "../components/ForumPostGroup";
import { EditPostFormInputs } from "../components/EditPostModal";
import { Post } from "../utils/Types/types";

// Define the necesary properties of a thread
type Thread = {
  title: string;
  createdAt: string;
};

export const ForumThreadPage = () => {
  const navigate = useNavigate(); // use react-router-dom to navigate between pages
  const { user } = useContext(UserContext); // get the current logged in users details from global app context

  const { id } = useParams<{ id: string }>(); // Get the category ID from the URL
  // states store the thread information, and all the posts from the selected thread
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
      // trigger the create post logic to pass new post content to the API
      handleCreatePost(postContent!);
    }
  };

  // Passes the new post content to the API to create the post
  const handleCreatePost = async (eventContent: CreatePostFormInputs) => {
    try {
      // Create the post body object to provide the API the correct inputs necessary to create a new post
      const postBody = {
        content: eventContent.content,
        threadId: id,
      };
      await fetchWrapper("POST", `forum/post/${id}`, postBody); // pass post content to API to create
      await fetchPosts(); // fetch a new list of posts, including the new one just created
      toast.success("Successfully created post"); // keep user informed that post successfully created
    } catch {
      toast.error("Failed to create post, please try again"); // gracefully keep user informed that post failed to create
      // error message is generic to prevent exposing to much information which may caus vulnerabilities in the API
    }
  };

  // function handles passing an editted posts content to the API
  const handleEditPost = async (
    postId: number,
    formContent: EditPostFormInputs
  ) => {
    try {
      // Create the post body object to provide the API the updated inputs necessary to update post
      const postBody = {
        content: formContent.content,
        postId: postId,
      };
      await fetchWrapper("PATCH", `forum/post/${postId}`, postBody); // update the post sending a patch request to the API
      await fetchPosts();
      toast.success("Successfully edited post");
    } catch {
      toast.error("Failed to edit post, please try again");
    }
  };

  // function handles the deleting of a post by passing the post id to the API
  const handleDeletePost = async (postId: number) => {
    try {
      await fetchWrapper("DELETE", `forum/post/${postId}`); // delete request with post id passed to the API
      await fetchPosts();
      toast.success("Successfully deleted post");
    } catch {
      toast.error("Failed to delete post, please try again");
    }
  };

  const fetchPosts = async () => {
    try {
      // API request to get the threads by chosen category id
      const request = await fetchWrapper("GET", `forum/thread/${id}`);
      // extract the thread data and format correctly
      const thread = {
        title: request["thread"].title,
        // fornate the date ISO string using day.js library
        createdAt: dayjs(request["thread"].createdAt).format(
          "D MMMM YY - HH:mm"
        ),
      };
      setThread(thread);
      // loop through the posts and map correctly - change date and time into human readable format
      const posts = request["posts"].map((post: Post) => ({
        ...post, // bring all properties into new object
        // fornate the date ISO string using day.js library
        created_at: dayjs(post.created_at).format("D MMMM YY - HH:mm"),
      }));
      // set the allPost state to the found and formatted results array
      setAllPosts(posts);
    } catch (error) {
      console.error("Failed to fetch posts data:", error);
    }
  };

  // When the id changes, this code triggers
  useEffect(() => {
    try {
      fetchPosts();
    } catch {
      console.log("Failed to fetch posts");
      navigate(-1); // navigate back a page
    }
  }, [id, navigate]); // fetch new data on id change or navigation

  return (
    <>
      <Box
        sx={{
          padding: "15px",
          maxWidth: "80vw",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIosNewIcon />}
          sx={{
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
          <ForumPostGroup
            posts={allPosts}
            user={user}
            editPost={handleEditPost}
            deletePost={handleDeletePost}
          />
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
