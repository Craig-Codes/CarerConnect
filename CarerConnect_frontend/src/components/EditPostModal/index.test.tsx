import { fireEvent, render, screen } from "@testing-library/react";
import { EditPostModal } from ".";
import userEvent from "@testing-library/user-event";
import { Post } from "../../pages/forumThread";

describe("<EditPostModal />", () => {
  const user = userEvent.setup();

  // mock the handleClose event
  let mockedHandleClose = jest.fn();
  // reset the mock before each test
  beforeEach(() => {
    mockedHandleClose = jest.fn();
  });

  const mockPostData: Post = {
    id: 1,
    thread_id: 1,
    user_id: 2,
    username: "mock username",
    content: "mock post content",
    created_at: "2025-02-12 19:05:41.247",
  };

  test("Modal does not render when open is false", () => {
    // Given
    render(
      <EditPostModal
        open={false}
        handleClose={mockedHandleClose}
        post={mockPostData}
      />
    );
    // Then expect modal text not to be seen
    expect(screen.queryByText("Edit Post")).not.toBeInTheDocument();
  });

  test("Calls handleClose when Cancel button is clicked", () => {
    // Given
    render(
      <EditPostModal
        open={true}
        handleClose={mockedHandleClose}
        post={mockPostData}
      />
    );

    // When - Click the cancel button
    fireEvent.click(screen.getByText("Cancel"));

    // Then - handleClose is called with `false` as cancel button is selected
    expect(mockedHandleClose).toHaveBeenCalledWith(false);
  });

  test("Calls handleClose with true and correct params when form is submitted", async () => {
    // Given
    render(
      <EditPostModal
        open={true}
        handleClose={mockedHandleClose}
        post={mockPostData}
      />
    );

    // When - Fill in the form fields, adding content to already there content
    await user.type(
      screen.getByRole("textbox", { name: /content/i }),
      " - updated"
    );

    // Submit the form
    await user.click(screen.getByText("Submit"));

    // Then - Ensure handleClose was called with correct inputs
    expect(mockedHandleClose).toHaveBeenCalledWith(true, {
      content: "mock post content - updated",
      postId: mockPostData.id,
    });
  });
});
