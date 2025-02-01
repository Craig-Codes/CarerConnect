import { Dispatch, SetStateAction, createContext } from "react";

// User type encapsulates necessary user information required across the application
export type User = {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;
};

export interface UserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

// Default User values, only changed once we have a logged-in user
export const UserContext = createContext<UserContextType>({
  user: { id: 0, email: "", isAdmin: false, username: "" },
  setUser: () => {},
});
