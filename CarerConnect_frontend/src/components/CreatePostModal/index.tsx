import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import theme from "../../theme/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { modalStyles } from "../../utils/Consts/consts";

// properties passed into the modal, allowing parent componet to control opening and closing
interface CreatePostModalProps {
  open: boolean;
  handleClose: (create: boolean, postContent?: CreatePostFormInputs) => void;
}

export type CreatePostFormInputs = {
  content: string;
};

export const CreatePostModal = ({
  open,
  handleClose,
}: CreatePostModalProps) => {
  // Properties from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    // control,
  } = useForm<CreatePostFormInputs>();
  // using React-hook-form to control form inputs and error handling

  // when form submits successfully pass the inputs up to the parent component to make ncessary API calls
  const onSubmit: SubmitHandler<CreatePostFormInputs> = (data) => {
    handleClose(true, {
      content: data.content,
    });
  };

  return (
    // Wrapped in localisation provider to ensure data / time is correct for users across the world
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          // If modal is closed, pass false up to parent component
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
        {/* stylign for opening modal, and the modal itself */}
        <Fade in={open}>
          <Box
            sx={{
              ...modalStyles,
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
              Create Post
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Title field */}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="content"
                label="Content"
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
                    message: "Content cannot exceed 125 characters",
                  },
                })}
                type="text"
                name="content"
                autoFocus
                aria-invalid={errors.content ? "true" : "false"}
                helperText={errors.content?.message}
                error={!!errors.content}
                sx={{ paddingBottom: "10px" }}
              />
              <Box sx={{ paddingTop: "10px" }}>
                {/* Submit button to submit the form and pass all input fields */}
                <Button type="submit">Submit</Button>
                <Button onClick={() => handleClose(false)}>Cancel</Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </LocalizationProvider>
  );
};
