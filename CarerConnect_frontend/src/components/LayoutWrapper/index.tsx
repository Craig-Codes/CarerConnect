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
      {/* Place the navbar onto all pages */}
      <NavBar />
      {/* Wrap each page in a box component which can be used for styling all pages at once */}
      <Box
        sx={{
          marginTop: { xs: "75px", md: "56px" },
        }}
      >
        {/* children allows any other components to be placed into the wrapper */}
        {children}
      </Box>
    </>
  );
};
