import { Paper, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

// Properties passed into the component
type ForumThreadTitleBlockProps = {
  title: string;
  createdAt: string;
};

export const ForumThreadTitleBlock = ({
  title,
  createdAt,
}: ForumThreadTitleBlockProps) => {
  return (
    <Paper
      elevation={2}
      sx={{
        padding: "2vw",
        marginTop: "20px",
        textAlign: "left",
        backgroundColor: grey[200],
      }}
    >
      {/* Show the thread title */}
      <Typography variant="subtitle1">{title}</Typography>
      {/* Show the thread created date */}
      <Typography
        variant="caption"
        sx={{
          fontFamily: "Helvetica, sans-serif",
          fontStyle: "italic",
        }}
      >
        Created: {createdAt}
      </Typography>
    </Paper>
  );
};
