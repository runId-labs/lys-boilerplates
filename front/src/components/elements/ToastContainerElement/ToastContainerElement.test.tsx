import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import ToastContainerElement from "./index";

describe("ToastContainerElement", () => {
    describe("Rendering", () => {
        it("renders children", () => {
            render(
                <ToastContainerElement>
                    <div data-testid="toast-child">Toast content</div>
                </ToastContainerElement>
            );
            expect(screen.getByTestId("toast-child")).toBeInTheDocument();
        });

        it("renders multiple children", () => {
            render(
                <ToastContainerElement>
                    <div data-testid="toast-1">Toast 1</div>
                    <div data-testid="toast-2">Toast 2</div>
                </ToastContainerElement>
            );
            expect(screen.getByTestId("toast-1")).toBeInTheDocument();
            expect(screen.getByTestId("toast-2")).toBeInTheDocument();
        });
    });

    describe("Position", () => {
        it("uses bottom-end position by default", () => {
            const {container} = render(
                <ToastContainerElement>
                    <div>Toast</div>
                </ToastContainerElement>
            );
            expect(container.querySelector(".bottom-0.end-0")).toBeInTheDocument();
        });

        it("supports top-start position", () => {
            const {container} = render(
                <ToastContainerElement position="top-start">
                    <div>Toast</div>
                </ToastContainerElement>
            );
            expect(container.querySelector(".top-0.start-0")).toBeInTheDocument();
        });

        it("supports top-center position", () => {
            const {container} = render(
                <ToastContainerElement position="top-center">
                    <div>Toast</div>
                </ToastContainerElement>
            );
            expect(container.querySelector(".top-0.start-50")).toBeInTheDocument();
        });

        it("supports top-end position", () => {
            const {container} = render(
                <ToastContainerElement position="top-end">
                    <div>Toast</div>
                </ToastContainerElement>
            );
            expect(container.querySelector(".top-0.end-0")).toBeInTheDocument();
        });

        it("supports bottom-start position", () => {
            const {container} = render(
                <ToastContainerElement position="bottom-start">
                    <div>Toast</div>
                </ToastContainerElement>
            );
            expect(container.querySelector(".bottom-0.start-0")).toBeInTheDocument();
        });

        it("supports middle-center position", () => {
            const {container} = render(
                <ToastContainerElement position="middle-center">
                    <div>Toast</div>
                </ToastContainerElement>
            );
            expect(container.querySelector(".top-50.start-50")).toBeInTheDocument();
        });
    });

    describe("Custom className", () => {
        it("applies custom className", () => {
            const {container} = render(
                <ToastContainerElement className="custom-container">
                    <div>Toast</div>
                </ToastContainerElement>
            );
            expect(container.querySelector(".custom-container")).toBeInTheDocument();
        });

        it("includes base className", () => {
            const {container} = render(
                <ToastContainerElement>
                    <div>Toast</div>
                </ToastContainerElement>
            );
            expect(container.querySelector(".toast-container-element")).toBeInTheDocument();
        });
    });
});
