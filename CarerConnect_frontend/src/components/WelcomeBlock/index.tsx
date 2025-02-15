import { Box, Button, Paper, Typography } from "@mui/material";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";

// Properties passed into the component
interface WelcomeBlockProps {
  username: string;
}

export const WelcomeBlock = ({ username }: WelcomeBlockProps) => {
  const navigate = useNavigate(); // use react router dom to change pages

  return (
    <Paper elevation={2} sx={{ padding: "1vw" }}>
      <Typography
        variant="h4"
        sx={{
          paddingTop: "20px",
          paddingBottom: "10px",
          paddingLeft: "12px",
          paddingRight: "12px",
        }}
      >
        {/* dynamically insert users username */}
        Hello {username}
      </Typography>
      {/* navigation buttons for forum or events */}
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
          onClick={() => {
            navigate(`/forum`, {
              replace: true,
            });
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
          onClick={() => {
            navigate(`/events`, {
              replace: true,
            });
          }}
        >
          EVENTS
        </Button>
      </Box>
    </Paper>
  );
};
