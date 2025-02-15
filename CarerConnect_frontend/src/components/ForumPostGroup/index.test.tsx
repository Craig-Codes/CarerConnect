import { fireEvent, render, screen } from "@testing-library/react";
import { ForumPostGroup } from ".";
import { EditPostModal } from "../EditPostModal";
import { WarningModal } from "../WarningModal";
import { Post, User } from "../../utils/Types/types";

// Mock the EditPostModal and WarningModal components
// This allows them to be called, without triggering any further actions
jest.mock("../EditPostModal", () => ({
  EditPostModal: jest.fn(() => null),
}));
jest.mock("../WarningModal", () => ({
  WarningModal: jest.fn(() => null),
}));

describe("ForumPostGroup", () => {
  const user: User = {
    id: 1,
    username: "TestUser",
    email: "test@test.com",
    isAdmin: false,
  };
  const posts: Post[] = [
    {
      id: 1,
      thread_id: 1,
      user_id: 1,
      username: "mock username",
      content: "mock post content",
      created_at: "2025-02-12 19:05:41.247",
    },
    {
      id: 2,
      thread_id: 1,
      user_id: 2,
      username: "mock username 2",
      content: "mock post content 2",
      created_at: "2025-02-12 19:05:41.247",
    },
  ];

  it("should render posts correctly", () => {
    render(
      <ForumPostGroup
        user={user}
        posts={posts}
        editPost={jest.fn()}
        deletePost={jest.fn()}
      />
    );

    expect(screen.getByText("mock username")).toBeInTheDocument();
    expect(screen.getByText("mock post content")).toBeInTheDocument();
    expect(screen.getByText("mock username 2")).toBeInTheDocument();
    expect(screen.getByText("mock post content 2")).toBeInTheDocument();
  });

  it("should open edit modal when edit icon is clicked", () => {
    // Edit button only shown if user created the post, in this case user1 creates one post
    render(
      <ForumPostGroup
        user={user}
        posts={posts}
        editPost={jest.fn()}
        deletePost={jest.fn()}
      />
    );

    const editIcon = screen.getByTestId("ModeEditIcon");
    fireEvent.click(editIcon);

    expect(EditPostModal).toHaveBeenCalledWith(
      expect.objectContaining({ open: true }),
      {}
    );
  });

  it("should open delete modal when delete icon is clicked", () => {
    render(
      <ForumPostGroup
        user={user}
        posts={posts}
        editPost={jest.fn()}
        deletePost={jest.fn()}
      />
    );

    const deleteIcon = screen.getByTestId("DeleteIcon");
    fireEvent.click(deleteIcon);

    expect(WarningModal).toHaveBeenCalledWith(
      expect.objectContaining({ open: true }),
      {}
    );
  });
});
