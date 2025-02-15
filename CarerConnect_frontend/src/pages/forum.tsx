import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/Context";
import { isLoggedIn } from "../utils/utils";
import { fetchWrapper } from "../utils/fetchWrapper";
import { ForumCategoryTable } from "../components/ForumCategoryTable";

export const ForumPage = () => {
  const { user } = useContext(UserContext); // get the current logged in user

  // State stores the found forum categories from the API call in the useEffect hook
  const [forumCategoryData, setForumCategoryData] = useState([]);

  // When the component loads, the useEffect hook triggers to get forum category data
  useEffect(() => {
    const fetchForumCategories = async () => {
      // If a CarerConnect cookie is found we send a HTTP request to the API
      // to retrieve the logged in users details
      if (isLoggedIn()) {
        try {
          // fetch the forum category data from the API
          const categoryData = await fetchWrapper("GET", "forum");
          setForumCategoryData(categoryData);
        } catch (error) {
          console.error("Failed to fetch category data:", error);
        }
      }
    };

    fetchForumCategories();
  }, []); // useEffect hook is called on component initial render

  // Pass the found forum categorys into the category table which is rendered to the user
  return (
    <ForumCategoryTable
      username={user.username}
      categories={forumCategoryData}
    />
  );
};
