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

// Properties passed into the component
interface CreateThreadModalProps {
  open: boolean;
  handleClose: (remove: boolean, content?: CreateThreadFormInputs) => void;
}

// expected form input types
export type CreateThreadFormInputs = {
  title: string;
};

export const CreateThreadModal = ({
  open,
  handleClose,
}: CreateThreadModalProps) => {
  // Properties from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateThreadFormInputs>();
  // using React-hook-form to control form inputs and error handling

  // when form submits successfully pass the inputs up to the parent component to make ncessary API calls
  const onSubmit: SubmitHandler<CreateThreadFormInputs> = (data) => {
    handleClose(true, {
      title: data.title,
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
        <Fade in={open}>
          <Box
            sx={{
              ...modalStyles,
              borderColor: theme.palette.secondary.main,
              width: { xs: "70vw", md: "50vw" },
            }}
          >
            {/* stylign for opening modal, and the modal itself */}
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              sx={{ paddingBottom: "10px" }}
            >
              Create Thread
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
                    value: 255,
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
