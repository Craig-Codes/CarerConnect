import { Box, Button, Link, Paper, Typography } from "@mui/material";
import { Meetup } from "../../utils/Types/types";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "../../theme/theme";
import { User } from "../Context";
import { useState } from "react";
import { WarningModal } from "../WarningModal";
import { EditEventModal, EditSubscriptionFormInputs } from "../EditEventModal";

interface EventCardProps {
  event: Meetup;
  user: User; // users details required for conditional render of edit / delete buttons
  unsubscribeEvent: (eventId: number) => void;
  subscribeEvent: (eventId: number) => void;
  deleteEvent: (eventId: number) => void;
  editEvent: (
    eventId: number,
    formContent?: EditSubscriptionFormInputs
  ) => void;
  currentlySubscribedEvents?: number[];
}

export const EventCard = ({
  event,
  user,
  unsubscribeEvent,
  deleteEvent,
  editEvent,
  subscribeEvent,
  currentlySubscribedEvents,
}: EventCardProps) => {
  // Handle the confirmation modal open / close
  const [unsubscribeModalOpen, setUnsubscribeModalOpen] = useState(false);
  const handleUnsubscribeModalOpen = () => setUnsubscribeModalOpen(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleEditModalOpen = () => setEditModalOpen(true);

  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const handleSubscribeModalOpen = () => setSubscribeModalOpen(true);

  // Function to close the modal
  const handleUnsubscribeModalClose = async (unsubscribe: boolean) => {
    setUnsubscribeModalOpen(false);
    if (unsubscribe) {
      unsubscribeEvent(event.id);
    }
  };

  const handleDeleteModalClose = async (shouldDelete: boolean) => {
    setDeleteModalOpen(false);
    if (shouldDelete) {
      deleteEvent(event.id);
    }
  };

  const handleEditModalClose = async (
    shouldEdit: boolean,
    content?: EditSubscriptionFormInputs
  ) => {
    setEditModalOpen(false);
    if (shouldEdit) {
      editEvent(event.id, content);
    }
  };

  const handleSubscribeModalClose = async (subscribe: boolean) => {
    setSubscribeModalOpen(false);
    if (subscribe) {
      subscribeEvent(event.id);
    }
  };

  // Function uses logic to decide which button is shown to the user
  const conditionallyRenderButton = () => {
    // If the user is the evnt owner, they cannot unsubscribe so no button is shown
    if (event.user_id === user.id) {
      return <></>;
    }
    // if the user is current subscribed, show the unsubscribe button
    // OR
    // if the current subscribed array is undefined, we are using component on the
    // home page, and all events displayed have already been subscibed to
    else if (
      currentlySubscribedEvents?.includes(event.id) ||
      currentlySubscribedEvents === undefined
    ) {
      return (
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
      );
    }

    // The user is not subscibed, show the subscribe button
    else {
      return (
        <Button
          variant="outlined"
          sx={{
            color: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main,
            marginTop: "20px",
            alignContent: "center",
          }}
          onClick={handleSubscribeModalOpen}
        >
          Subscribe
        </Button>
      );
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        padding: "2vw",
        marginTop: "20px",
        textAlign: "left",
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
          {/* User can only edit the event if they created it or are an administrator */}
          {(event.user_id === user.id || user.isAdmin) && (
            <ModeEditIcon
              color="success"
              onClick={handleEditModalOpen}
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
      <Typography
        variant="body1"
        sx={{ paddingTop: "5px", paddingBottom: "5px" }}
      >
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
      <Typography
        variant="body1"
        sx={{ paddingTop: "5px", paddingBottom: "5px" }}
      >
        {event.description}
      </Typography>
      <Typography
        variant="body1"
        sx={{ paddingTop: "5px", paddingBottom: "5px" }}
      >
        Participants: {event.subscriber_count} of {event.max_attendees}
      </Typography>
      {conditionallyRenderButton()}
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
      <WarningModal
        open={subscribeModalOpen}
        handleClose={handleSubscribeModalClose}
        title="Subscribe"
        content="Are you sure you want to subscribe to meetup event?"
      />
      <EditEventModal
        open={editModalOpen}
        handleClose={handleEditModalClose}
        currentEventData={event}
      />
    </Paper>
  );
};
