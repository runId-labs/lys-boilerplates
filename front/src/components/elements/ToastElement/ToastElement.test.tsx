import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import ToastElement from "./index";

describe("ToastElement", () => {
    describe("Rendering", () => {
        it("renders body content", () => {
            render(<ToastElement body="Toast message" />);
            expect(screen.getByText("Toast message")).toBeInTheDocument();
        });

        it("renders with title", () => {
            render(<ToastElement body="Message" title="Toast Title" />);
            expect(screen.getByText("Toast Title")).toBeInTheDocument();
        });

        it("does not render title when not provided", () => {
            render(<ToastElement body="Message" />);
            expect(screen.queryByRole("heading")).not.toBeInTheDocument();
        });

        it("renders with footer", () => {
            render(<ToastElement body="Message" footer="Footer content" />);
            expect(screen.getByText("Footer content")).toBeInTheDocument();
        });

        it("renders with custom className", () => {
            render(<ToastElement body="Message" className="custom-toast" />);
            expect(document.querySelector(".custom-toast")).toBeInTheDocument();
        });
    });

    describe("Visibility", () => {
        it("is visible when show is true", () => {
            render(<ToastElement body="Message" show={true} />);
            expect(screen.getByText("Message")).toBeVisible();
        });

        it("is hidden when show is false", () => {
            render(<ToastElement body="Message" show={false} />);
            expect(screen.queryByText("Message")).not.toBeInTheDocument();
        });

        it("is visible by default", () => {
            render(<ToastElement body="Message" />);
            expect(screen.getByText("Message")).toBeVisible();
        });
    });

    describe("Variants", () => {
        it("renders default variant", () => {
            render(<ToastElement body="Message" variant="default" />);
            expect(document.querySelector(".bg-light")).toBeInTheDocument();
        });

        it("renders success variant", () => {
            render(<ToastElement body="Message" variant="success" />);
            expect(document.querySelector(".bg-success")).toBeInTheDocument();
        });

        it("renders warning variant", () => {
            render(<ToastElement body="Message" variant="warning" />);
            expect(document.querySelector(".bg-warning")).toBeInTheDocument();
        });

        it("renders danger variant", () => {
            render(<ToastElement body="Message" variant="danger" />);
            expect(document.querySelector(".bg-danger")).toBeInTheDocument();
        });

        it("renders info variant", () => {
            render(<ToastElement body="Message" variant="info" />);
            expect(document.querySelector(".bg-info")).toBeInTheDocument();
        });
    });

    describe("Close functionality", () => {
        it("renders close button when title provided", () => {
            render(<ToastElement body="Message" title="Title" onClose={() => {}} />);
            expect(screen.getByRole("button", {name: /close/i})).toBeInTheDocument();
        });

        it("calls onClose when close button clicked", () => {
            const handleClose = vi.fn();
            render(<ToastElement body="Message" title="Title" onClose={handleClose} />);
            fireEvent.click(screen.getByRole("button", {name: /close/i}));
            expect(handleClose).toHaveBeenCalled();
        });
    });

    describe("Custom class names", () => {
        it("applies headerClassName", () => {
            render(
                <ToastElement
                    body="Message"
                    title="Title"
                    headerClassName="custom-header"
                />
            );
            expect(document.querySelector(".custom-header")).toBeInTheDocument();
        });

        it("applies bodyClassName", () => {
            render(<ToastElement body="Message" bodyClassName="custom-body" />);
            expect(document.querySelector(".custom-body")).toBeInTheDocument();
        });

        it("applies footerClassName", () => {
            render(
                <ToastElement
                    body="Message"
                    footer="Footer"
                    footerClassName="custom-footer"
                />
            );
            expect(document.querySelector(".custom-footer")).toBeInTheDocument();
        });
    });

    describe("Complex content", () => {
        it("renders JSX in body", () => {
            render(
                <ToastElement
                    body={
                        <div>
                            <strong data-testid="bold">Important:</strong> Message
                        </div>
                    }
                />
            );
            expect(screen.getByTestId("bold")).toBeInTheDocument();
        });

        it("renders JSX in footer", () => {
            render(
                <ToastElement
                    body="Message"
                    footer={<button data-testid="action-btn">Undo</button>}
                />
            );
            expect(screen.getByTestId("action-btn")).toBeInTheDocument();
        });
    });
});