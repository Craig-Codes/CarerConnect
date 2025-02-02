import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/Context";
import { isLoggedIn } from "../utils/utils";
import { fetchWrapper } from "../utils/fetchWrapper";
import { ForumCategoryTable } from "../components/ForumCategoryTable";

export const ForumPage = () => {
  const { user } = useContext(UserContext);

  const [forumCategoryData, setForumCategoryData] = useState([]);

  // When the appl loads, the useEffect hook triggers
  useEffect(() => {
    const fetchUser = async () => {
      // If a CarerConnect cookie is found we send a HTTP request to the API
      // to retrieve the logged in users details
      if (isLoggedIn()) {
        try {
          const categoryData = await fetchWrapper("GET", "forum");
          // We set the result into the user varaible, which is passed into the apps
          // context, essentially allowing any page to access this information
          setForumCategoryData(categoryData);
        } catch (error) {
          console.error("Failed to fetch category data:", error);
        }
      }
    };

    fetchUser();
  }, []);

  console.log(forumCategoryData);

  return (
    <ForumCategoryTable
      username={user.username}
      categories={forumCategoryData}
    />
  );
};
