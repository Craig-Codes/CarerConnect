import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, UserContext } from "./components/Context";
import { AppRoutes } from "./components/Routes/AppRoutes";
import { isLoggedIn } from "./utils/utils";
import { fetchWrapper } from "./utils/fetchWrapper";
import { LayoutWrapper } from "./components/LayoutWrapper";

const App = () => {
  // Default user is set initially
  const [user, setUser] = useState<User>({
    id: 0,
    email: "",
    username: "",
    isAdmin: false,
  });

  // When the appl loads, the useEffect hook triggers
  useEffect(() => {
    const fetchUser = async () => {
      // If a CarerConnect cookie is found we send a HTTP request to the API
      // to retrieve the logged in users details
      if (isLoggedIn()) {
        try {
          const userData = await fetchWrapper("GET", "user");
          // We set the result into the user varaible, which is passed into the apps
          // context, essentially allowing any page to access this information
          setUser({
            id: userData.user.id,
            email: userData.user.email,
            isAdmin: userData.user.isAdmin,
            username: userData.user.username,
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    // UserConext wraps all of our routes (and therefore pages)
    // This allows any page to access the user information
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <LayoutWrapper>
          <AppRoutes />
        </LayoutWrapper>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
