import { Box, Paper, Typography } from "@mui/material";
import { Meetup } from "../../utils/Types/types";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

interface EventCardProps {
  event: Meetup;
}

export const EventCard = ({ event }: EventCardProps) => {
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
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">{event.title}</Typography>
        <ModeEditIcon
          color="success"
          onClick={handleEdit}
          sx={{
            marginLeft: "30px",
            cursor: "pointer", // Change the cursor to a hand on hover
            "&:hover": {
              opacity: 0.5, // Add slight opacity change on hover
            },
          }}
        />
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
      </Box>
    </Paper>
  );
};
