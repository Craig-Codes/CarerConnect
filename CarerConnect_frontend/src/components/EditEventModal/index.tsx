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

interface EditEventModalProps {
  open: boolean; // Accept the modal open state as a prop
  handleClose: (remove: boolean, content?: string) => void; // Handle close passed from the parent
  currentEventData: Meetup;
}

type Inputs = {
  title: string;
};

export const EditEventModal = ({
  open,
  handleClose,
  currentEventData,
}: EditEventModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    handleClose(true, data.title);
    console.log(data);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open} // Control modal visibility with this prop
      onClose={() => {
        // default to false on close
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
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Edit Event
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              defaultValue={currentEventData.title}
              type="text"
              name="title"
              autoFocus
              aria-invalid={errors.title ? "true" : "false"}
              helperText={errors.title?.message}
              error={!!errors.title}
            />
            <br></br>
            <br></br>
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
