import {describe, it, expect} from "vitest";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {useRef, useEffect} from "react";
import OffCanvasElement from "./index";
import {OffCanvasElementRefInterface} from "./types";

// Test wrapper to access ref
const TestWrapper = ({
    onRefReady,
    ...props
}: {onRefReady: (ref: OffCanvasElementRefInterface) => void} & React.ComponentProps<typeof OffCanvasElement>) => {
    const ref = useRef<OffCanvasElementRefInterface>(null);

    useEffect(() => {
        if (ref.current) {
            onRefReady(ref.current);
        }
    }, [onRefReady]);

    return <OffCanvasElement ref={ref} {...props} />;
};

describe("OffCanvasElement", () => {
    describe("Rendering", () => {
        it("renders title when shown", async () => {
            let refInstance: OffCanvasElementRefInterface;
            render(
                <TestWrapper
                    id="test-offcanvas"
                    title="Test Title"
                    body={<div>Body content</div>}
                    onRefReady={(ref) => {
                        refInstance = ref;
                    }}
                />
            );

            await waitFor(() => {
                refInstance.show();
            });

            expect(await screen.findByText("Test Title")).toBeInTheDocument();
        });

        it("renders body content when shown", async () => {
            let refInstance: OffCanvasElementRefInterface;
            render(
                <TestWrapper
                    id="test-offcanvas"
                    title="Title"
                    body={<div data-testid="body-content">Body content</div>}
                    onRefReady={(ref) => {
                        refInstance = ref;
                    }}
                />
            );

            await waitFor(() => {
                refInstance.show();
            });

            expect(await screen.findByTestId("body-content")).toBeInTheDocument();
        });

        it("renders close button", async () => {
            let refInstance: OffCanvasElementRefInterface;
            render(
                <TestWrapper
                    id="test-offcanvas"
                    title="Title"
                    body={<div>Body</div>}
                    onRefReady={(ref) => {
                        refInstance = ref;
                    }}
                />
            );

            await waitFor(() => {
                refInstance.show();
            });

            expect(await screen.findByRole("button", {name: /close/i})).toBeInTheDocument();
        });
    });

    describe("Show/Hide functionality", () => {
        it("is hidden initially", () => {
            render(
                <OffCanvasElement
                    id="test-offcanvas"
                    title="Title"
                    body={<div>Body</div>}
                />
            );

            expect(screen.queryByText("Title")).not.toBeInTheDocument();
        });

        it("shows when show() is called", async () => {
            let refInstance: OffCanvasElementRefInterface;
            render(
                <TestWrapper
                    id="test-offcanvas"
                    title="Title"
                    body={<div>Body</div>}
                    onRefReady={(ref) => {
                        refInstance = ref;
                    }}
                />
            );

            await waitFor(() => {
                refInstance.show();
            });

            expect(await screen.findByText("Title")).toBeInTheDocument();
        });

        it("hides when hide() is called", async () => {
            let refInstance: OffCanvasElementRefInterface;
            render(
                <TestWrapper
                    id="test-offcanvas"
                    title="Title"
                    body={<div>Body</div>}
                    onRefReady={(ref) => {
                        refInstance = ref;
                    }}
                />
            );

            await waitFor(() => {
                refInstance.show();
            });

            expect(await screen.findByText("Title")).toBeInTheDocument();

            await waitFor(() => {
                refInstance.hide();
            });

            await waitFor(() => {
                expect(screen.queryByText("Title")).not.toBeInTheDocument();
            });
        });

        it("hides when close button clicked", async () => {
            let refInstance: OffCanvasElementRefInterface;
            render(
                <TestWrapper
                    id="test-offcanvas"
                    title="Title"
                    body={<div>Body</div>}
                    onRefReady={(ref) => {
                        refInstance = ref;
                    }}
                />
            );

            await waitFor(() => {
                refInstance.show();
            });

            const closeButton = await screen.findByRole("button", {name: /close/i});
            fireEvent.click(closeButton);

            await waitFor(() => {
                expect(screen.queryByText("Title")).not.toBeInTheDocument();
            });
        });
    });

    describe("Ref interface", () => {
        it("exposes shown state via ref", async () => {
            let refInstance: OffCanvasElementRefInterface;
            render(
                <TestWrapper
                    id="test-offcanvas"
                    title="Title"
                    body={<div>Body</div>}
                    onRefReady={(ref) => {
                        refInstance = ref;
                    }}
                />
            );

            // Wait for ref to be ready
            await waitFor(() => {
                expect(refInstance).toBeDefined();
            });

            // Initial state can be null or false
            expect(refInstance!.shown === null || refInstance!.shown === false).toBe(true);

            // Show the offcanvas
            refInstance!.show();

            // After showing, the component should be visible
            expect(await screen.findByText("Title")).toBeInTheDocument();
        });

        it("exposes show function via ref", async () => {
            let refInstance: OffCanvasElementRefInterface;
            render(
                <TestWrapper
                    id="test-offcanvas"
                    title="Title"
                    body={<div>Body</div>}
                    onRefReady={(ref) => {
                        refInstance = ref;
                    }}
                />
            );

            await waitFor(() => {
                expect(typeof refInstance.show).toBe("function");
            });
        });

        it("exposes hide function via ref", async () => {
            let refInstance: OffCanvasElementRefInterface;
            render(
                <TestWrapper
                    id="test-offcanvas"
                    title="Title"
                    body={<div>Body</div>}
                    onRefReady={(ref) => {
                        refInstance = ref;
                    }}
                />
            );

            await waitFor(() => {
                expect(typeof refInstance.hide).toBe("function");
            });
        });
    });
});
