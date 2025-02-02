import { useParams } from "react-router-dom";
import { Typography, Container } from "@mui/material";

export const ForumCategoryPage = () => {
  const { id } = useParams<{ id: string }>(); // Get the category ID from the URL

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Category ID: {id}
      </Typography>
      <Typography>
        Here, you can fetch and display details for category {id}.
      </Typography>
    </Container>
  );
};
