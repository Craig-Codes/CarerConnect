import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import theme from "../../theme/theme";
import { TextField } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { Post } from "../../pages/forumThread";
import { useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface EditPostModalProps {
  open: boolean;
  handleClose: (remove: boolean, content?: EditPostFormInputs) => void;
  post: Post;
}

export type EditPostFormInputs = {
  content: string;
  postId: number;
};

export const EditPostModal = ({
  open,
  handleClose,
  post,
}: EditPostModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPostFormInputs>({
    defaultValues: {
      content: post.content,
    },
  });

  // When the form field resets or the post state changes, get the latest post content to auto populate the form content field
  useEffect(() => {
    reset({ content: post.content });
  }, [post, reset]);

  const onSubmit: SubmitHandler<EditPostFormInputs> = (data) => {
    handleClose(true, { content: data.content, postId: post.id });
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => {
        handleClose(false);
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            ...style,
            borderColor: theme.palette.secondary.main,
            width: { xs: "70vw", md: "50vw" },
          }}
        >
          <Typography
            id="transition-modal-title"
            variant="h6"
            component="h2"
            sx={{ paddingBottom: "10px" }}
          >
            Edit Post
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title field */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="content"
              label="content"
              multiline // Make input box multiline
              minRows={2}
              maxRows={4}
              {...register("content", {
                required: "Content is required",
                minLength: {
                  value: 3,
                  message: "Content must be at least 3 characters long",
                },
                maxLength: {
                  value: 255,
                  message: "Content cannot exceed 255 characters",
                },
              })}
              type="text"
              name="content"
              autoFocus
              aria-invalid={errors.content ? "true" : "false"}
              helperText={errors.content?.message}
              error={!!errors.content}
            />
            <Box sx={{ paddingTop: "25px" }}>
              <Button type="submit">Submit</Button>
              <Button onClick={() => handleClose(false)}>Cancel</Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};
