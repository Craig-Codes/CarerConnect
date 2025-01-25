import { ReactNode } from "react";
import NavBar from "../NavBar";
import { Box } from "@mui/material";

interface LayoutProps {
  children: ReactNode;
}

// Wrapper controls components we want in all routes, such as a navbar
export const LayoutWrapper = ({ children }: LayoutProps) => {
  return (
    <>
      <NavBar />
      <Box
        sx={{
          marginTop: { xs: "75px", md: "56px" },
        }}
      >
        {children}
      </Box>
    </>
  );
};
