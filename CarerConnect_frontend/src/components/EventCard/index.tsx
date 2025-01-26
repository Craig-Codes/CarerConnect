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
  deleteEvent: (eventId: number) => void;
  editEvent: (eventId: number, title: string, description: string) => void;
}

export const EventCard = ({
  event,
  user,
  unsubscibeEvent,
  deleteEvent,
  editEvent,
}: EventCardProps) => {
  // Handle the confirmation modal open / close
  const [unsubscribeModalOpen, setUnsubscribeModalOpen] = useState(false);
  const handleUnsubscribeModalOpen = () => setUnsubscribeModalOpen(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);

  // Function to close the modal
  const handleUnsubscribeModalClose = async (unsubscribe: boolean) => {
    setUnsubscribeModalOpen(false);
    if (unsubscribe) {
      unsubscibeEvent(event.id);
    }
  };

  const handleDeleteModalClose = async (shouldDelete: boolean) => {
    setDeleteModalOpen(false);
    if (shouldDelete) {
      deleteEvent(event.id);
    }
  };

  const handleEdit = () => {
    console.log("handle Edit");
    // Open edit modal
    editEvent(event.id, "test", "test");
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
              onClick={handleDeleteModalOpen}
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
          onClick={handleUnsubscribeModalOpen}
        >
          Unsubscribe
        </Button>
      )}
      <WarningModal
        open={unsubscribeModalOpen}
        handleClose={handleUnsubscribeModalClose}
        title="Unsubscribe"
        content="Are you sure you want to unsubscribe from event?"
      />
      <WarningModal
        open={deleteModalOpen}
        handleClose={handleDeleteModalClose}
        title="Delete"
        content="Are you sure you want to delete meetup event?"
      />
    </Paper>
  );
};
