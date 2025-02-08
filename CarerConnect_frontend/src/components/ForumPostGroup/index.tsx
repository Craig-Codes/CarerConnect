import { Box, Divider, Paper, Typography } from "@mui/material";
import { Post } from "../../pages/forumThread";
import { User } from "../Context";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fragment, useState } from "react";
import { EditPostFormInputs, EditPostModal } from "../EditPostModal";
import { WarningModal } from "../WarningModal";

type ForumPostGroupProps = {
  posts: Post[];
  user: User;
  //   Functions pass selected post id back to parent component where logic happens
  editPost: (postId: number, formContent: EditPostFormInputs) => void;
  deletePost: (postId: number) => void;
};

export const ForumPostGroup = ({
  user,
  posts,
  deletePost,
  editPost,
}: ForumPostGroupProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleEditModalOpen = () => setEditModalOpen(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);

  const [currentPost, setCurrentPost] = useState<Post>(posts[0]);

  const handleEditModalClose = async (
    shouldEdit: boolean,
    content?: EditPostFormInputs
  ) => {
    setEditModalOpen(false);
    if (shouldEdit) {
      editPost(currentPost.id, content!);
    }
  };

  const handleDeleteModalClose = async (shouldEdit: boolean) => {
    setDeleteModalOpen(false);
    if (shouldEdit) {
      deletePost(currentPost.id);
    }
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          padding: "1vw 2vw",
          marginTop: "20px",
          textAlign: "left",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          wordBreak: "break-all",
        }}
      >
        {posts.map((post) => {
          return (
            <Fragment key={post.id}>
              {/* Initial box wraps all content in a flex container */}
              <Box
                sx={{
                  display: "flex",
                  marginTop: "10px",
                }}
              >
                {/*  Box wraps the header row, dividing the contents on a single line */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <Typography variant="subtitle1">{post.username}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "Helvetica, sans-serif",
                      fontStyle: "italic",
                      alignSelf: "center",
                    }}
                  >
                    {post.created_at}
                  </Typography>
                </Box>
                {/* Margin left pushes the icons over to the far right */}
                <Box sx={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
                  {/* User can only edit post if they created it */}
                  {post.user_id === user.id && (
                    <ModeEditIcon
                      color="success"
                      onClick={() => {
                        setCurrentPost(post);
                        handleEditModalOpen();
                      }}
                      sx={{
                        paddingLeft: "20px",
                        cursor: "pointer", // Change the cursor to a hand on hover
                        "&:hover": {
                          opacity: 0.5, // Add slight opacity change on hover
                        },
                      }}
                    />
                  )}
                  {/* User can only delete post if they created it OR are an admin */}
                  {(post.user_id === user.id || user.isAdmin) && (
                    <DeleteIcon
                      color="error"
                      onClick={() => {
                        setCurrentPost(post);
                        handleDeleteModalOpen();
                      }}
                      sx={{
                        cursor: "pointer", // Change the cursor to a hand on hover
                        "&:hover": {
                          opacity: 0.5, // Add slight opacity change on hover
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Typography sx={{ paddingBottom: "20px" }}>
                {post.content}
              </Typography>
              <Divider />
            </Fragment>
          );
        })}
      </Paper>
      <EditPostModal
        open={editModalOpen}
        handleClose={handleEditModalClose}
        post={currentPost}
      />
      <WarningModal
        open={deleteModalOpen}
        handleClose={handleDeleteModalClose}
        title="Delete"
        content="Are you sure you want to delete post?"
      />
    </>
  );
};
