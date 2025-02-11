import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import theme from "../../theme/theme";
import {
  DateTimePicker,
  LocalizationProvider,
  renderMultiSectionDigitalClockTimeView,
} from "@mui/x-date-pickers";
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

interface CreateEventModalProps {
  open: boolean;
  handleClose: (
    remove: boolean,
    content?: CreateSubscriptionFormInputs
  ) => void;
}

export type CreateSubscriptionFormInputs = {
  title: string;
  description: string;
  online: boolean;
  dateTime: Date;
  location: string;
  participants: number;
};

export const CreateEventModal = ({
  open,
  handleClose,
}: CreateEventModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    // control,
  } = useForm<CreateSubscriptionFormInputs>();

  const onSubmit: SubmitHandler<CreateSubscriptionFormInputs> = (data) => {
    handleClose(true, {
      title: data.title,
      description: data.description,
      dateTime: data.dateTime,
      location: data.description,
      participants: data.participants,
      online: data.online,
    });
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
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              sx={{ paddingBottom: "10px" }}
            >
              Create Event
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
                sx={{ paddingBottom: "30px" }}
              />
              {/* Date picker with Date type for value */}
              <Controller
                name="dateTime"
                control={control}
                rules={{ required: "A date and time is required" }}
                render={({ field }) => (
                  <DateTimePicker
                    label="Event Date & Time"
                    format="dd/MM/yy HH:mm"
                    {...field}
                    sx={{ paddingBottom: "20px" }}
                    value={field.value ?? new Date()} // ensure value is always a date
                    onChange={(value) => {
                      // Coerce the value to Date
                      const coercedDate = value ? new Date(value) : new Date();
                      field.onChange(coercedDate); // Pass the Date object to set the value
                    }}
                    viewRenderers={{
                      hours: renderMultiSectionDigitalClockTimeView,
                      minutes: renderMultiSectionDigitalClockTimeView,
                      seconds: renderMultiSectionDigitalClockTimeView,
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
              {/* Online? */}
              <Box sx={{ paddingBottom: "10px" }}>
                <Controller
                  name="online"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControl error={!!errors.online}>
                      <FormLabel id="online-radio-button-group">
                        Is the event online?
                      </FormLabel>
                      <RadioGroup
                        {...field}
                        aria-labelledby="online-radio-buttons-group-label"
                      >
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Yes"
                        />
                      </RadioGroup>
                      {errors.online && (
                        <FormHelperText>{errors.online.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
              {/* Location */}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="location"
                label="Location or Link"
                {...register("location", {
                  required: "Location is required",
                  minLength: {
                    value: 3,
                    message: "Location must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 125,
                    message: "Location cannot exceed 125 characters",
                  },
                })}
                type="text"
                name="location"
                autoFocus
                aria-invalid={errors.location ? "true" : "false"}
                helperText={errors.location?.message}
                error={!!errors.location}
                sx={{ paddingBottom: "15px" }}
              />
              {/* Description input */}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline // Make input box multiline
                minRows={2}
                maxRows={4}
                sx={{ paddingBottom: "15px" }}
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
              {/* Participants */}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                defaultValue={2}
                type="number"
                id="participants"
                label="Number of participants"
                {...register("participants", {
                  required: "Number of particpants is required",
                  min: {
                    value: 2,
                    message: "There must be at least 2 participants",
                  },
                })}
                name="participants"
                autoFocus
                aria-invalid={errors.participants ? "true" : "false"}
                helperText={errors.participants?.message}
                error={!!errors.participants}
              />
              <br />
              <Box sx={{ paddingTop: "10px" }}>
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
