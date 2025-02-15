// This is the apps entry point, called first on app load

import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserContext } from "./components/Context";
import { AppRoutes } from "./components/Routes/AppRoutes";
import { isLoggedIn } from "./utils/utils";
import { fetchWrapper } from "./utils/fetchWrapper";
import { LayoutWrapper } from "./components/LayoutWrapper";
import { User } from "./utils/Types/types";

const App = () => {
  // Default user is set initially
  const [user, setUser] = useState<User>({
    id: 0,
    email: "",
    username: "",
    isAdmin: false,
  });

  // When the app loads, the useEffect hook triggers
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
      {/* Router allows react-router-dom to navigate to any page across the app */}
      <BrowserRouter>
        {/* layout wrapper allows all pages to contain standardised layout and styling, along with the Navbar */}
        <LayoutWrapper>
          {/* Routes are how react router navigates to the correct page */}
          <AppRoutes />
        </LayoutWrapper>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
