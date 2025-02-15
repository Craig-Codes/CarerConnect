import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import theme from "../../theme/theme";
import { TextField } from "@mui/material";
import { Meetup } from "../../utils/Types/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { modalStyles } from "../../utils/Consts/consts";

// Properties passed into the component
interface EditEventModalProps {
  open: boolean;
  handleClose: (remove: boolean, content?: EditSubscriptionFormInputs) => void;
  currentEventData: Meetup;
}

// expected form input types
export type EditSubscriptionFormInputs = {
  title: string;
  description: string;
};

export const EditEventModal = ({
  open,
  handleClose,
  currentEventData,
}: EditEventModalProps) => {
  // Properties from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditSubscriptionFormInputs>({
    // Default values incase no current subscription is passed in
    defaultValues: {
      title: currentEventData.title,
      description: currentEventData.description,
    },
  });
  // using React-hook-form to control form inputs and error handling

  // when form submits successfully pass the inputs up to the parent component to make ncessary API calls
  const onSubmit: SubmitHandler<EditSubscriptionFormInputs> = (data) => {
    handleClose(true, { title: data.title, description: data.description });
  };

  return (
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
            Edit Event
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title field */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters long",
                },
                maxLength: {
                  value: 125,
                  message: "Title cannot exceed 125 characters",
                },
              })}
              type="text"
              name="title"
              autoFocus
              aria-invalid={errors.title ? "true" : "false"}
              helperText={errors.title?.message}
              error={!!errors.title}
              sx={{ paddingBottom: "10px" }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              multiline // Make input box multiline
              minRows={2}
              maxRows={4}
              id="description"
              label="Description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 3,
                  message: "Description must be at least 3 characters long",
                },
                maxLength: {
                  value: 255,
                  message: "Description cannot exceed 255 characters",
                },
              })}
              type="text"
              name="description"
              autoFocus
              aria-invalid={errors.description ? "true" : "false"}
              helperText={errors.description?.message}
              error={!!errors.description}
            />
            <br />
            <Box sx={{ paddingTop: "25px" }}>
              {/* Submit button to submit the form and pass all input fields */}
              <Button type="submit">Submit</Button>
              <Button onClick={() => handleClose(false)}>Cancel</Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};
