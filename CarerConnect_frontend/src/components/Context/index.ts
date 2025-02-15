// Component stores the global user state across entire application
// Componet wraps the entire app (App.tsx) in a ContextProvider, allowing the current
// user state to be accessed or updated anywhere in the app
import { Dispatch, SetStateAction, createContext } from "react";
import { User } from "../../utils/Types/types";

export interface UserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

// Default User values, only changed once we have a logged-in user
export const UserContext = createContext<UserContextType>({
  user: { id: 0, email: "", isAdmin: false, username: "" },
  setUser: () => {},
});
