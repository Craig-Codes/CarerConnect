import { Box, Button, Paper, Typography } from "@mui/material";
import theme from "../../theme/theme";

interface WelcomeBlockProps {
  username: string;
}

export const WelcomeBlock = ({ username }: WelcomeBlockProps) => {
  return (
    <Paper elevation={2} sx={{ padding: "1vw" }}>
      <Typography
        variant="h4"
        sx={{ paddingTop: "20px", paddingBottom: "10px" }}
      >
        Hello {username}
      </Typography>
      <Box
        sx={{
          padding: "15px",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            color: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main,
            marginRight: "1vw",
          }}
        >
          FORUM
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main,
            marginLeft: "1vw",
          }}
        >
          EVENTS
        </Button>
      </Box>
    </Paper>
  );
};
