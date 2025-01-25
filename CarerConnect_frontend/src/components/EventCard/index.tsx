import { Box, Button, Link, Paper, Typography } from "@mui/material";
import { Meetup } from "../../utils/Types/types";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "../../theme/theme";
import { User } from "../Context";
import { useState } from "react";
import { WarningModal } from "../WarningModal";

interface EventCardProps {
  event: Meetup;
  user: User; // users details required for conditional render of edit / delete buttons
  unsubscibeEvent: (eventId: number) => void;
}

export const EventCard = ({ event, user, unsubscibeEvent }: EventCardProps) => {
  // Handle the confirmation modal open / close
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);

  // Function to close the modal
  const handleModalClose = async (unsubscribe: boolean) => {
    setModalOpen(false);
    if (unsubscribe) {
      unsubscibeEvent(event.id);
    }
  };

  const handleEdit = () => {
    console.log("handle Edit");
  };

  const handleDelete = () => {
    console.log("handle Delete");
  };

  return (
    <Paper
      elevation={2}
      sx={{
        padding: "2vw",
        marginTop: "20px",
        textAlign: "left",
        maxWidth: { xs: "300px", md: "400px", lg: "450px", xl: "500px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // Aligns title to the left and icons to the right
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">{event.title}</Typography>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          {/* User can only edit the event if they created it */}
          {user.id === event.user_id && (
            <ModeEditIcon
              color="success"
              onClick={handleEdit}
              sx={{
                cursor: "pointer", // Change the cursor to a hand on hover
                "&:hover": {
                  opacity: 0.5, // Add slight opacity change on hover
                },
              }}
            />
          )}
          {/* User can only delete the event if they are an admin */}
          {user.isAdmin && (
            <DeleteIcon
              color="error"
              onClick={handleDelete}
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
      <Typography
        variant="caption"
        sx={{
          fontFamily: "Helvetica, sans-serif",
          fontStyle: "italic",
        }}
      >
        {event.event_date}
      </Typography>
      <Typography variant="body1" sx={{ paddingTop: "5px" }}>
        Event Location:&nbsp;
        {event.is_online ? (
          <Link
            href={event.location}
            sx={{ color: "blue" }}
            target="_blank"
            rel="noreferrer"
            // noreffere stops the target page from redirecting this app to a malicious URL
            // also, stops the referer header from being sent to the new page
          >
            Link
          </Link>
        ) : (
          <span style={{ display: "inline", color: theme.palette.info.main }}>
            {event.location}
          </span>
        )}
      </Typography>
      <Typography variant="body1">{event.description}</Typography>
      <Typography variant="body1">
        Participants: {event.subscriber_count} of {event.max_attendees}
      </Typography>
      {/* If user is the event onwer, cannot unsubscribe */}
      {event.user_id !== user.id && (
        <Button
          variant="outlined"
          sx={{
            color: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main,
            marginTop: "20px",
            alignContent: "center",
          }}
          onClick={handleModalOpen}
        >
          Unsubscribe
        </Button>
      )}
      <WarningModal
        open={modalOpen}
        handleClose={handleModalClose}
        title="Unsubscribe"
        content="Are you sure you want to unsubscribe?"
      />
    </Paper>
  );
};
