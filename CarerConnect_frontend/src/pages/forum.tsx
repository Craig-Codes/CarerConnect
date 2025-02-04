import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/Context";
import { isLoggedIn } from "../utils/utils";
import { fetchWrapper } from "../utils/fetchWrapper";
import { ForumCategoryTable } from "../components/ForumCategoryTable";

export const ForumPage = () => {
  const { user } = useContext(UserContext);

  const [forumCategoryData, setForumCategoryData] = useState([]);

  // When the component loads, the useEffect hook triggers to get forum category data
  useEffect(() => {
    const fetchForumCategories = async () => {
      // If a CarerConnect cookie is found we send a HTTP request to the API
      // to retrieve the logged in users details
      if (isLoggedIn()) {
        try {
          const categoryData = await fetchWrapper("GET", "forum");
          setForumCategoryData(categoryData);
        } catch (error) {
          console.error("Failed to fetch category data:", error);
        }
      }
    };

    fetchForumCategories();
  }, []);

  console.log(forumCategoryData);

  return (
    <ForumCategoryTable
      username={user.username}
      categories={forumCategoryData}
    />
  );
};
