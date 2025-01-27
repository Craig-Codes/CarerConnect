import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import theme from "../../theme/theme";
import { TextField } from "@mui/material";
import { Meetup } from "../../utils/Types/types";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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
  open: boolean;
  handleClose: (remove: boolean, content?: string) => void;
  currentEventData: Meetup;
}

type FormInputs = {
  title: string;
  dateTime: Date; // Use Date type instead of string
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
    control,
  } = useForm<FormInputs>({
    defaultValues: {
      title: currentEventData.title,
      dateTime: new Date(currentEventData.event_date), // Convert the event date to a Date object
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    handleClose(true, data.dateTime);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            <Typography id="transition-modal-title" variant="h6" component="h2">
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
              />
              {/* Date picker with Date type for value */}
              <Controller
                name="dateTime"
                control={control}
                rules={{ required: "A date and time is required" }}
                render={({ field }) => (
                  <DateTimePicker
                    label="Event Date & Time"
                    {...field}
                    onChange={(value) => {
                      // Coerce the value to Date
                      const coercedDate = value ? new Date(value) : null;
                      if (
                        coercedDate instanceof Date &&
                        !isNaN(coercedDate.getTime())
                      ) {
                        field.onChange(coercedDate); // Pass the Date object
                      } else {
                        field.onChange(value); // If invalid, pass value as is
                      }
                    }}
                    slotProps={{
                      textField: {
                        error: !!errors.dateTime,
                        helperText: errors.dateTime?.message,
                      },
                    }}
                  />
                )}
              />
              <br />
              <br />
              <Box sx={{ paddingTop: "25px" }}>
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
