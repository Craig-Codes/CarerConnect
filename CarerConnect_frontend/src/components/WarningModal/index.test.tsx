import { render, screen, fireEvent } from "@testing-library/react";
import { WarningModal } from ".";

describe("WarningModal", () => {
  const handleClose = jest.fn();

  beforeEach(() => {
    handleClose.mockClear();
  });

  it("should render the modal with title and content when open is true", () => {
    render(
      <WarningModal
        open={true}
        handleClose={handleClose}
        title="Warning"
        content="Are you sure you want to proceed?"
      />
    );

    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
  });

  it("should not render the modal when open is false", () => {
    render(
      <WarningModal
        open={false}
        handleClose={handleClose}
        title="Warning"
        content="Are you sure you want to proceed?"
      />
    );

    expect(screen.queryByText("Warning")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Are you sure you want to proceed?")
    ).not.toBeInTheDocument();
  });

  it("should call handleClose with false when the modal is closed", () => {
    render(
      <WarningModal
        open={true}
        handleClose={handleClose}
        title="Warning"
        content="Are you sure you want to proceed?"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(handleClose).toHaveBeenCalledWith(false);
  });

  it("should call handleClose with true when the Yes button is clicked", () => {
    render(
      <WarningModal
        open={true}
        handleClose={handleClose}
        title="Warning"
        content="Are you sure you want to proceed?"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /yes/i }));

    expect(handleClose).toHaveBeenCalledWith(true);
  });
});
