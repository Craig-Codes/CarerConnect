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
import DeleteIcon from "@mui/icons-material/Delete";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { Thread } from "../../pages/forumCategory";
import { WarningModal } from "../WarningModal";
import { useState } from "react";

// Properties passed into the component
interface ForumThreadTableProps {
  isAdmin: boolean;
  threads: Thread[];
  deleteEvent: (eventId: number) => void;
}

export const ForumThreadTable = ({
  isAdmin,
  threads: threadData,
  deleteEvent,
}: ForumThreadTableProps) => {
  // Use react-router-dom to navigate to correct page when user clicks a table row
  const navigate = useNavigate();

  //  States control opening and closing modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);

  const [deleteThreadId, setDeleteThreadId] = useState(0);

  const handleDeleteModalClose = async (shouldDelete: boolean) => {
    setDeleteModalOpen(false);
    if (shouldDelete) {
      // pass the thread id upto the page to handle how to delete the thread
      deleteEvent(deleteThreadId);
    }
    // reset deleted thread id back to zero
    setDeleteThreadId(0);
  };

  // Check if threadData is defined and has elements
  if (!threadData || threadData.length === 0) {
    return <Typography>No threads found</Typography>;
  }

  return (
    <>
      <TableContainer
        component={Paper}
        // dynamic table sizing based on screen size
        sx={{ width: { xs: "90vw", lg: "80vw", marginTop: "20px" } }}
      >
        <Table aria-label="forum thread table">
          {/* Header row of table */}
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
                Posts
              </TableCell>
              {/* Only render the delete column if a user is administrator */}
              {isAdmin && (
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
                  Delete
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Table rows made from each found thread using a loop */}
            {threadData.map((thread) => (
              <TableRow
                key={thread.id}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: grey[200] },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  // On clicking the table row, navigate to the thread page
                  onClick={() => navigate(`/thread/${thread.id}`)}
                >
                  <Typography>{thread.thread_title}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "Helvetica, sans-serif",
                      fontStyle: "italic",
                    }}
                  >
                    Created: {thread.created_at}
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
                  onClick={() => console.log(thread.id)}
                  // navigate(`/category/${thread.id}`)}
                >
                  {thread.post_count}
                </TableCell>
                {/* Only render the delete column if a user is administrator */}
                {isAdmin && (
                  <TableCell
                    align="center"
                    sx={{
                      color: theme.palette.secondary.main,
                      fontWeight: "900",
                      fontSize: { xs: "14px", sm: "16px" },
                      borderLeft: `1px solid ${grey[600]}`,
                      // Stop delete button from being highlighted like the rest of the row on hover
                      backgroundColor: "white !important",
                      cursor: "default",
                    }}
                  >
                    <DeleteIcon
                      color="error"
                      onClick={() => {
                        // set the threadId, and open the modal
                        setDeleteThreadId(thread.id);
                        handleDeleteModalOpen();
                      }}
                      sx={{
                        cursor: "pointer", // Change the cursor to a hand on hover
                        "&:hover": {
                          opacity: 0.5, // Add slight opacity change on hover
                        },
                      }}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Warning modal used to ensure an admin user has to confirm a delete action on a thread */}
      <WarningModal
        open={deleteModalOpen}
        handleClose={handleDeleteModalClose}
        title="Delete"
        content="Are you sure you want to delete thread?"
      />
    </>
  );
};
