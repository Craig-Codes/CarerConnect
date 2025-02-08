import { Paper, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

type ForumThreadTitleBlockProps = {
  title: string;
  createdAt: string;
};

export const ForumThreadTitleBlock = ({
  title,
  createdAt,
}: ForumThreadTitleBlockProps) => {
  console.log("Hitting title block");
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
      <Typography variant="subtitle1">{title}</Typography>
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
