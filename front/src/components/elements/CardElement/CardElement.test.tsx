import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import CardElement from "./index";

describe("CardElement", () => {
    describe("Rendering", () => {
        it("renders children correctly", () => {
            render(
                <CardElement>
                    <p>Card content</p>
                </CardElement>
            );
            expect(screen.getByText("Card content")).toBeInTheDocument();
        });

        it("renders with title", () => {
            render(
                <CardElement title="Card Title">
                    Content
                </CardElement>
            );
            expect(screen.getByText("Card Title")).toBeInTheDocument();
        });

        it("renders with custom className", () => {
            render(
                <CardElement className="custom-card">
                    Content
                </CardElement>
            );
            expect(document.querySelector(".custom-card")).toBeInTheDocument();
        });
    });

    describe("Variants", () => {
        it("renders default variant", () => {
            render(<CardElement>Content</CardElement>);
            expect(document.querySelector(".card-element")).toBeInTheDocument();
        });

        it("renders with flat variant", () => {
            render(<CardElement variant="flat">Content</CardElement>);
            expect(document.querySelector(".card-element")).toBeInTheDocument();
        });

        it("renders with bordered variant", () => {
            render(<CardElement variant="bordered">Content</CardElement>);
            expect(document.querySelector(".card-element")).toBeInTheDocument();
        });
    });

    describe("Footer", () => {
        it("renders footer content when provided", () => {
            render(
                <CardElement footer={<span>Footer text</span>}>
                    Content
                </CardElement>
            );
            expect(screen.getByText("Footer text")).toBeInTheDocument();
            expect(document.querySelector(".card-element__footer")).toBeInTheDocument();
        });

        it("does not render footer section when not provided", () => {
            render(<CardElement>Content</CardElement>);
            expect(document.querySelector(".card-element__footer")).not.toBeInTheDocument();
        });

        it("applies custom footerClassName", () => {
            render(
                <CardElement footer={<span>Footer</span>} footerClassName="custom-footer">
                    Content
                </CardElement>
            );
            expect(document.querySelector(".card-element__footer.custom-footer")).toBeInTheDocument();
        });
    });

    describe("Padding", () => {
        it("renders with default padding", () => {
            render(<CardElement>Content</CardElement>);
            expect(document.querySelector(".card-element")).toBeInTheDocument();
        });

        it("renders with small padding", () => {
            render(<CardElement padding="sm">Content</CardElement>);
            expect(document.querySelector(".card-element")).toBeInTheDocument();
        });

        it("renders with large padding", () => {
            render(<CardElement padding="lg">Content</CardElement>);
            expect(document.querySelector(".card-element")).toBeInTheDocument();
        });
    });
});
