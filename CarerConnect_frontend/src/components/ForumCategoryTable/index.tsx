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

export type CategoryTableRow = {
  id: number;
  category_title: string;
  category_description: string;
  post_count: number;
  thread_count: number;
};

interface ForumCategoryTableProps {
  username: string;
  categories: CategoryTableRow[];
}

export const ForumCategoryTable = ({
  username,
  categories,
}: ForumCategoryTableProps) => {
  // Use react-router-dom to navigate to correct page when user clicks a table row
  const navigate = useNavigate();

  return (
    <TableContainer
      component={Paper}
      // dynamic table sizing based on screen size
      sx={{ width: { xs: "90vw", lg: "80vw" } }}
    >
      <Table aria-label="forum category table">
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
              {username}, Welcome to the CarerConnect forums!
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
          {categories.map((category) => (
            <TableRow
              key={category.id}
              onClick={() => navigate(`/category/${category.id}`)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: grey[200] },
              }}
            >
              <TableCell component="th" scope="row">
                <Typography>{category.category_title}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "Helvetica, sans-serif",
                    fontStyle: "italic",
                  }}
                >
                  {category.category_description}
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
                {category.thread_count}
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
                {category.post_count}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
