import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ForumThreadTable } from ".";
import { useNavigate } from "react-router-dom";
import { WarningModal } from "../WarningModal";
import { Thread } from "../../utils/Types/types";

// Mock the WarningModal component
jest.mock("../WarningModal", () => ({
  WarningModal: jest.fn(() => null),
}));

// Mock the useNavigate hook from react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("ForumThreadTable", () => {
  const threads: Thread[] = [
    {
      id: 1,
      category_id: 1,
      category_title: "Category 1",
      thread_title: "Thread 1",
      created_at: "2023-01-01",
      post_count: 10,
    },
    {
      id: 2,
      category_id: 1,
      category_title: "Category 1",
      thread_title: "Thread 2",
      created_at: "2023-01-02",
      post_count: 20,
    },
  ];

  it("should render threads correctly", () => {
    render(
      <ForumThreadTable
        isAdmin={false}
        threads={threads}
        deleteEvent={jest.fn()}
      />
    );

    expect(screen.getByText("Thread 1")).toBeInTheDocument();
    expect(screen.getByText("Thread 2")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("should display 'No threads found' when there are no threads", () => {
    render(
      <ForumThreadTable isAdmin={false} threads={[]} deleteEvent={jest.fn()} />
    );

    expect(screen.getByText("No threads found")).toBeInTheDocument();
  });

  it("should navigate to the correct thread when a row is clicked", async () => {
    // mock the navigation, returning an empty function
    const mockNavigate = useNavigate as jest.Mock;
    const navigateFn = jest.fn();
    mockNavigate.mockReturnValue(navigateFn);

    render(
      <ForumThreadTable
        isAdmin={false}
        threads={threads}
        deleteEvent={jest.fn()}
      />
    );

    const threadRow = screen.getByText("Thread 1");
    fireEvent.click(threadRow!);

    await waitFor(() => {
      expect(navigateFn).toHaveBeenCalledWith("/thread/1");
    });
  });

  it("should open delete modal when delete icon is clicked", () => {
    render(
      <ForumThreadTable
        isAdmin={true}
        threads={threads}
        deleteEvent={jest.fn()}
      />
    );

    const deleteIcon = screen.getAllByTestId("DeleteIcon")[0];
    fireEvent.click(deleteIcon);

    expect(WarningModal).toHaveBeenCalledWith(
      expect.objectContaining({ open: true }),
      {}
    );
  });
});
