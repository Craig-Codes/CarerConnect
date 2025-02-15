import { render, screen } from "@testing-library/react";
import { ForumThreadTitleBlock } from ".";

describe("ForumThreadTitleBlock", () => {
  it("should render the title and createdAt correctly", () => {
    const title = "Sample Thread Title";
    const createdAt = "2025-02-15";

    render(<ForumThreadTitleBlock title={title} createdAt={createdAt} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(`Created: ${createdAt}`)).toBeInTheDocument();
  });
});
