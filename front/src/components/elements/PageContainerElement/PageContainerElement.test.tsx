import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import PageContainerElement from "./index";

describe("PageContainerElement", () => {
    describe("Rendering", () => {
        it("renders children", () => {
            render(
                <PageContainerElement>
                    <div data-testid="content">Page content</div>
                </PageContainerElement>
            );
            expect(screen.getByTestId("content")).toBeInTheDocument();
        });

        it("renders text children", () => {
            render(
                <PageContainerElement>
                    Hello World
                </PageContainerElement>
            );
            expect(screen.getByText("Hello World")).toBeInTheDocument();
        });

        it("renders multiple children", () => {
            render(
                <PageContainerElement>
                    <header data-testid="header">Header</header>
                    <main data-testid="main">Main content</main>
                    <footer data-testid="footer">Footer</footer>
                </PageContainerElement>
            );
            expect(screen.getByTestId("header")).toBeInTheDocument();
            expect(screen.getByTestId("main")).toBeInTheDocument();
            expect(screen.getByTestId("footer")).toBeInTheDocument();
        });
    });

    describe("CSS classes", () => {
        it("has page-container-element class", () => {
            const {container} = render(
                <PageContainerElement>
                    Content
                </PageContainerElement>
            );
            expect(container.querySelector(".page-container-element")).toBeInTheDocument();
        });

        it("applies custom className", () => {
            const {container} = render(
                <PageContainerElement className="custom-page">
                    Content
                </PageContainerElement>
            );
            expect(container.querySelector(".custom-page")).toBeInTheDocument();
        });

        it("combines base and custom classNames", () => {
            const {container} = render(
                <PageContainerElement className="custom-class">
                    Content
                </PageContainerElement>
            );
            const element = container.firstChild as HTMLElement;
            expect(element).toHaveClass("page-container-element");
            expect(element).toHaveClass("custom-class");
        });
    });

    describe("DOM structure", () => {
        it("renders as a div", () => {
            const {container} = render(
                <PageContainerElement>
                    Content
                </PageContainerElement>
            );
            expect(container.firstChild?.nodeName).toBe("DIV");
        });
    });
});
