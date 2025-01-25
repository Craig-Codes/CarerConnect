import { ReactNode } from "react";
import NavBar from "../NavBar";

interface LayoutProps {
  children: ReactNode;
}

// Wrapper controls components we want in all routes, such as a navbar
export const LayoutWrapper = ({ children }: LayoutProps) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};
