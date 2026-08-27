import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import TabElement from "./index";

const mockItems = {
    tab1: {
        label: "First Tab",
        render: () => <div data-testid="tab1-content">Tab 1 Content</div>
    },
    tab2: {
        label: "Second Tab",
        render: () => <div data-testid="tab2-content">Tab 2 Content</div>
    },
    tab3: {
        label: "Third Tab",
        render: () => <div data-testid="tab3-content">Tab 3 Content</div>
    }
};

describe("TabElement", () => {
    describe("Rendering", () => {
        it("renders tab navigation", () => {
            render(<TabElement items={mockItems} />);
            expect(screen.getByText("First Tab")).toBeInTheDocument();
            expect(screen.getByText("Second Tab")).toBeInTheDocument();
            expect(screen.getByText("Third Tab")).toBeInTheDocument();
        });

        it("renders first tab content by default", () => {
            render(<TabElement items={mockItems} />);
            expect(screen.getByTestId("tab1-content")).toBeInTheDocument();
        });

        it("renders specified default tab content", () => {
            render(<TabElement items={mockItems} defaultActiveKey="tab2" />);
            expect(screen.getByTestId("tab2-content")).toBeInTheDocument();
        });

        it("does not render inactive tab content (lazy rendering)", () => {
            render(<TabElement items={mockItems} />);
            expect(screen.queryByTestId("tab2-content")).not.toBeInTheDocument();
            expect(screen.queryByTestId("tab3-content")).not.toBeInTheDocument();
        });
    });

    describe("Tab switching", () => {
        it("switches to clicked tab", () => {
            render(<TabElement items={mockItems} />);
            fireEvent.click(screen.getByText("Second Tab"));
            expect(screen.getByTestId("tab2-content")).toBeInTheDocument();
        });

        it("removes previous tab content when switching", () => {
            render(<TabElement items={mockItems} />);
            expect(screen.getByTestId("tab1-content")).toBeInTheDocument();
            fireEvent.click(screen.getByText("Second Tab"));
            expect(screen.queryByTestId("tab1-content")).not.toBeInTheDocument();
        });

        it("calls onTabChange when tab changes", () => {
            const handleChange = vi.fn();
            render(<TabElement items={mockItems} onTabChange={handleChange} />);
            fireEvent.click(screen.getByText("Second Tab"));
            expect(handleChange).toHaveBeenCalledWith("tab2");
        });
    });

    describe("Icons", () => {
        it("renders tab icons", () => {
            const itemsWithIcons = {
                home: {
                    label: "Home",
                    icon: "bi-house",
                    render: () => <div>Home content</div>
                }
            };
            const {container} = render(<TabElement items={itemsWithIcons} />);
            expect(container.querySelector(".bi-house")).toBeInTheDocument();
        });
    });

    describe("Visibility", () => {
        it("hides tabs with visible: false", () => {
            const itemsWithHidden = {
                ...mockItems,
                hidden: {
                    label: "Hidden Tab",
                    visible: false,
                    render: () => <div>Hidden content</div>
                }
            };
            render(<TabElement items={itemsWithHidden} />);
            expect(screen.queryByText("Hidden Tab")).not.toBeInTheDocument();
        });

        it("shows tabs with visible: true", () => {
            const itemsWithVisible = {
                tab1: {
                    label: "Visible Tab",
                    visible: true,
                    render: () => <div>Content</div>
                }
            };
            render(<TabElement items={itemsWithVisible} />);
            expect(screen.getByText("Visible Tab")).toBeInTheDocument();
        });

        it("shows tabs with visible: undefined (default)", () => {
            render(<TabElement items={mockItems} />);
            expect(screen.getByText("First Tab")).toBeInTheDocument();
        });

        it("returns null when all tabs are hidden", () => {
            const allHidden = {
                tab1: {
                    label: "Tab 1",
                    visible: false,
                    render: () => <div>Content</div>
                }
            };
            const {container} = render(<TabElement items={allHidden} />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("Default active key", () => {
        it("falls back to first visible tab if default is hidden", () => {
            const items = {
                hidden: {
                    label: "Hidden",
                    visible: false,
                    render: () => <div data-testid="hidden">Hidden</div>
                },
                visible: {
                    label: "Visible",
                    render: () => <div data-testid="visible">Visible</div>
                }
            };
            render(<TabElement items={items} defaultActiveKey="hidden" />);
            expect(screen.getByTestId("visible")).toBeInTheDocument();
        });

        it("uses first visible tab if no default specified", () => {
            render(<TabElement items={mockItems} />);
            expect(screen.getByTestId("tab1-content")).toBeInTheDocument();
        });
    });

    describe("Custom className", () => {
        it("applies custom className", () => {
            const {container} = render(
                <TabElement items={mockItems} className="custom-tabs" />
            );
            expect(container.querySelector(".custom-tabs")).toBeInTheDocument();
        });

        it("includes base className", () => {
            const {container} = render(<TabElement items={mockItems} />);
            expect(container.querySelector(".tab-element")).toBeInTheDocument();
        });
    });
});
