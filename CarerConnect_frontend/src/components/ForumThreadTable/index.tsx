import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import theme from "../../theme/theme";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { ThreadTableRow } from "../../pages/forumCategory";

interface ForumThreadTableProps {
  isAdmin: boolean;
  threads: ThreadTableRow[];
}

export const ForumThreadTable = ({
  isAdmin,
  threads: threadData,
}: ForumThreadTableProps) => {
  // Use react-router-dom to navigate to correct page when user clicks a table row
  const navigate = useNavigate();

  // Check if threadData is defined and has elements
  if (!threadData || threadData.length === 0) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <TableContainer
      component={Paper}
      // dynamic table sizing based on screen size
      sx={{ width: { xs: "90vw", lg: "80vw" } }}
    >
      <Table aria-label="forum thread table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                color: theme.palette.secondary.main,
                fontWeight: "900",
                fontSize: { xs: "14px", sm: "16px" },
                padding: "20px",
              }}
            >
              {threadData[0].category_title}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                color: theme.palette.secondary.main,
                fontWeight: "900",
                fontSize: { xs: "14px", sm: "16px" },
                borderLeft: `1px solid ${grey[600]}`,
                padding: { xs: "5px", md: "0px" },
              }}
            >
              Threads
            </TableCell>
            <TableCell
              align="center"
              sx={{
                color: theme.palette.secondary.main,
                fontWeight: "900",
                fontSize: { xs: "14px", sm: "16px" },
                borderLeft: `1px solid ${grey[600]}`,
                padding: { xs: "5px", md: "0px" },
              }}
            >
              Posts
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {threadData.map((thread) => (
            <TableRow
              key={thread.id}
              onClick={() => navigate(`/category/${thread.id}`)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: grey[200] },
              }}
            >
              <TableCell component="th" scope="row">
                <Typography>{thread.thread_title}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "Helvetica, sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  {thread.created_at}
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: theme.palette.secondary.main,
                  fontWeight: "900",
                  fontSize: { xs: "14px", sm: "16px" },
                  borderLeft: `1px solid ${grey[600]}`,
                }}
              >
                {thread.post_count}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: theme.palette.secondary.main,
                  fontWeight: "900",
                  fontSize: { xs: "14px", sm: "16px" },
                  borderLeft: `1px solid ${grey[600]}`,
                }}
              >
                Delete
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
