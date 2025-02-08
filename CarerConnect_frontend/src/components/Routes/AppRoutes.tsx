import { Route, Routes, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../Context";
import { HomePage } from "../../pages/home";
import { LoginPage } from "../../pages/login";
import { ForumPage } from "../../pages/forum";
import { EventsPage } from "../../pages/events";
import { ForumCategoryPage } from "../../pages/forumCategory";
import { ForumThreadPage } from "../../pages/forumThread";

// Component handles the app routing, connecting each navigation path to the corresponding page
export const AppRoutes = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // If the user is not logged in, redirect any request to the login page
  // This useEffect hook catches when a user logs out by manually clearning cookies,
  // as the user variable changes, triggering the check and redirect
  useEffect(() => {
    if (!user.username) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <Routes>
      {/* Guard clause on the routes, ensuring a user is logged in before accessing them. If not, redirected to the login page */}
      <Route path="/" element={user.username ? <HomePage /> : <LoginPage />} />
      <Route
        path="/forum"
        element={user.username ? <ForumPage /> : <LoginPage />}
      />
      <Route
        path="/events"
        element={user.username ? <EventsPage /> : <LoginPage />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/category/:id"
        element={user.username ? <ForumCategoryPage /> : <LoginPage />}
      />
      <Route
        path="/thread/:id"
        element={user.username ? <ForumThreadPage /> : <LoginPage />}
      />
    </Routes>
  );
};
