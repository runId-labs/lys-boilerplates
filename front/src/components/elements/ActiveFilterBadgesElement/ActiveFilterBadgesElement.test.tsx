import {describe, it, expect, vi} from "vitest";
import {screen, fireEvent} from "@testing-library/react";
import renderWithIntl from "@/test/utils";
import ActiveFilterBadgesElement, {ActiveFilter} from "./index";

const mockFilters: ActiveFilter[] = [
    {key: "status", label: "Status", value: "active"},
    {key: "role", label: "Role", value: "admin"}
];

describe("ActiveFilterBadgesElement", () => {
    describe("Rendering", () => {
        it("renders filter badges", () => {
            renderWithIntl(
                <ActiveFilterBadgesElement
                    filters={mockFilters}
                    clearAllText="Clear all"
                    onRemove={() => {}}
                    onClearAll={() => {}}
                />
            );
            expect(screen.getByText("Status:")).toBeInTheDocument();
            expect(screen.getByText(/active/)).toBeInTheDocument();
            expect(screen.getByText("Role:")).toBeInTheDocument();
            expect(screen.getByText(/admin/)).toBeInTheDocument();
        });

        it("renders nothing when no filters", () => {
            const {container} = renderWithIntl(
                <ActiveFilterBadgesElement
                    filters={[]}
                    clearAllText="Clear all"
                    onRemove={() => {}}
                    onClearAll={() => {}}
                />
            );
            expect(container.firstChild).toBeNull();
        });

        it("renders label when provided", () => {
            renderWithIntl(
                <ActiveFilterBadgesElement
                    filters={mockFilters}
                    label="Active filters:"
                    clearAllText="Clear all"
                    onRemove={() => {}}
                    onClearAll={() => {}}
                />
            );
            expect(screen.getByText("Active filters:")).toBeInTheDocument();
        });

        it("applies custom className", () => {
            const {container} = renderWithIntl(
                <ActiveFilterBadgesElement
                    filters={mockFilters}
                    clearAllText="Clear all"
                    className="custom-class"
                    onRemove={() => {}}
                    onClearAll={() => {}}
                />
            );
            expect(container.querySelector(".custom-class")).toBeInTheDocument();
        });
    });

    describe("Clear all button", () => {
        it("shows clear all button when multiple filters", () => {
            renderWithIntl(
                <ActiveFilterBadgesElement
                    filters={mockFilters}
                    clearAllText="Clear all filters"
                    onRemove={() => {}}
                    onClearAll={() => {}}
                />
            );
            expect(screen.getByText("Clear all filters")).toBeInTheDocument();
        });

        it("hides clear all button when single filter", () => {
            renderWithIntl(
                <ActiveFilterBadgesElement
                    filters={[mockFilters[0]]}
                    clearAllText="Clear all"
                    onRemove={() => {}}
                    onClearAll={() => {}}
                />
            );
            expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
        });

        it("calls onClearAll when clear all clicked", () => {
            const handleClearAll = vi.fn();
            renderWithIntl(
                <ActiveFilterBadgesElement
                    filters={mockFilters}
                    clearAllText="Clear all"
                    onRemove={() => {}}
                    onClearAll={handleClearAll}
                />
            );
            fireEvent.click(screen.getByText("Clear all"));
            expect(handleClearAll).toHaveBeenCalled();
        });
    });

    describe("Remove filter", () => {
        it("calls onRemove with filter key when x clicked", () => {
            const handleRemove = vi.fn();
            renderWithIntl(
                <ActiveFilterBadgesElement
                    filters={mockFilters}
                    clearAllText="Clear all"
                    onRemove={handleRemove}
                    onClearAll={() => {}}
                />
            );
            const removeButtons = screen.getAllByRole("button", {name: /remove filter/i});
            fireEvent.click(removeButtons[0]);
            expect(handleRemove).toHaveBeenCalledWith("status");
        });
    });

    describe("Sort filter styling", () => {
        it("applies secondary variant for sort filters", () => {
            const filtersWithSort: ActiveFilter[] = [
                {key: "sort", label: "Sort", value: "name", isSort: true}
            ];
            const {container} = renderWithIntl(
                <ActiveFilterBadgesElement
                    filters={filtersWithSort}
                    clearAllText="Clear all"
                    onRemove={() => {}}
                    onClearAll={() => {}}
                />
            );
            expect(container.querySelector(".bg-secondary")).toBeInTheDocument();
        });

        it("applies primary variant for regular filters", () => {
            const {container} = renderWithIntl(
                <ActiveFilterBadgesElement
                    filters={[mockFilters[0]]}
                    clearAllText="Clear all"
                    onRemove={() => {}}
                    onClearAll={() => {}}
                />
            );
            expect(container.querySelector(".bg-primary")).toBeInTheDocument();
        });
    });
});
