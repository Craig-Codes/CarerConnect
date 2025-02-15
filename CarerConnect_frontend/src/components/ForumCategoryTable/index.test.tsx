import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ForumCategoryTable } from ".";
import { useNavigate } from "react-router-dom";

// Mock the `useNavigate` hook from `react-router-dom`
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("ForumCategoryTable", () => {
  it("should display a loading message if categories are empty", () => {
    render(<ForumCategoryTable username="TestUser" categories={[]} />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("should display category table when categories are provided", () => {
    const categories = [
      {
        id: 1,
        category_title: "Category 1",
        category_description: "Description of category 1",
        post_count: 10,
        thread_count: 5,
      },
      {
        id: 2,
        category_title: "Category 2",
        category_description: "Description of category 2",
        post_count: 20,
        thread_count: 15,
      },
    ];

    render(<ForumCategoryTable username="TestUser" categories={categories} />);

    expect(
      screen.getByText(/TestUser, Welcome to the CarerConnect forums!/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();
  });

  it("should display correct number of posts and threads for each category", () => {
    const categories = [
      {
        id: 1,
        category_title: "Category 1",
        category_description: "Description of category 1",
        post_count: 10,
        thread_count: 5,
      },
    ];

    render(<ForumCategoryTable username="TestUser" categories={categories} />);

    expect(screen.getByText("10")).toBeInTheDocument(); // Post count
    expect(screen.getByText("5")).toBeInTheDocument(); // Thread count
  });

  it("should navigate to the correct category when a row is clicked", async () => {
    const mockNavigate = useNavigate as jest.Mock; // mock implentation of useNavigate from 'react-router-dom'

    // Setup mock to return the mock function
    const navigateFn = jest.fn();
    mockNavigate.mockReturnValue(navigateFn);

    const categories = [
      {
        id: 1,
        category_title: "Category 1",
        category_description: "Description of category 1",
        post_count: 10,
        thread_count: 5,
      },
    ];

    render(<ForumCategoryTable username="TestUser" categories={categories} />);

    const categoryRow = screen.getByText("Category 1").closest("tr");

    fireEvent.click(categoryRow!); // Click on the row

    await waitFor(() => {
      expect(navigateFn).toHaveBeenCalledWith("/category/1");
    });
  });
});
