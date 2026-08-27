import {describe, it, expect, vi} from "vitest";
import {screen, fireEvent} from "@testing-library/react";
import renderWithIntl from "@/test/utils";
import PaginationElement from "./index";

const mockPageInfo = {
    hasNextPage: true,
    hasPreviousPage: false,
    startCursor: "cursor_start",
    endCursor: "cursor_end",
    totalCount: 100
};

describe("PaginationElement", () => {
    describe("Rendering", () => {
        it("renders pagination controls when has data", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={mockPageInfo}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={() => {}}
                />
            );
            expect(screen.getByText("Previous")).toBeInTheDocument();
            expect(screen.getByText("Next")).toBeInTheDocument();
        });

        it("does not render when totalCount is 0", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={{...mockPageInfo, totalCount: 0}}
                    itemsPerPage={10}
                    currentItemCount={0}
                    onPaginationChange={() => {}}
                />
            );
            expect(screen.queryByText("Previous")).not.toBeInTheDocument();
        });

        it("shows items per page selector", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={mockPageInfo}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={() => {}}
                />
            );
            expect(screen.getByRole("combobox")).toBeInTheDocument();
        });

        it("shows showing X-Y of Total label", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={mockPageInfo}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={() => {}}
                />
            );
            expect(screen.getByText(/of 100/)).toBeInTheDocument();
        });
    });

    describe("Navigation", () => {
        it("disables previous button when no previous page", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={{...mockPageInfo, hasPreviousPage: false}}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={() => {}}
                />
            );
            expect(screen.getByText("Previous").closest("button")).toBeDisabled();
        });

        it("enables previous button when has previous page", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={{...mockPageInfo, hasPreviousPage: true}}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={() => {}}
                />
            );
            expect(screen.getByText("Previous").closest("button")).not.toBeDisabled();
        });

        it("disables next button when no next page", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={{...mockPageInfo, hasNextPage: false}}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={() => {}}
                />
            );
            expect(screen.getByText("Next").closest("button")).toBeDisabled();
        });

        it("enables next button when has next page", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={{...mockPageInfo, hasNextPage: true}}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={() => {}}
                />
            );
            expect(screen.getByText("Next").closest("button")).not.toBeDisabled();
        });

        it("calls onPaginationChange when next is clicked", () => {
            const handleChange = vi.fn();
            renderWithIntl(
                <PaginationElement
                    pageInfo={mockPageInfo}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={handleChange}
                />
            );
            fireEvent.click(screen.getByText("Next"));
            expect(handleChange).toHaveBeenCalledWith({
                first: 10,
                last: null,
                after: "cursor_end",
                before: null
            });
        });

        it("calls onPaginationChange when previous is clicked", () => {
            const handleChange = vi.fn();
            renderWithIntl(
                <PaginationElement
                    pageInfo={{...mockPageInfo, hasPreviousPage: true}}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={handleChange}
                />
            );
            fireEvent.click(screen.getByText("Previous"));
            expect(handleChange).toHaveBeenCalledWith({
                first: null,
                last: 10,
                before: "cursor_start",
                after: null
            });
        });
    });

    describe("Items per page", () => {
        it("shows default options", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={mockPageInfo}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={() => {}}
                />
            );
            const select = screen.getByRole("combobox");
            expect(select).toContainElement(screen.getByRole("option", {name: "10"}));
            expect(select).toContainElement(screen.getByRole("option", {name: "25"}));
            expect(select).toContainElement(screen.getByRole("option", {name: "50"}));
            expect(select).toContainElement(screen.getByRole("option", {name: "100"}));
        });

        it("shows custom options", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={mockPageInfo}
                    itemsPerPage={5}
                    itemsPerPageOptions={[5, 15, 30]}
                    currentItemCount={5}
                    onPaginationChange={() => {}}
                />
            );
            const select = screen.getByRole("combobox");
            expect(select).toContainElement(screen.getByRole("option", {name: "5"}));
            expect(select).toContainElement(screen.getByRole("option", {name: "15"}));
            expect(select).toContainElement(screen.getByRole("option", {name: "30"}));
        });

        it("calls onPaginationChange when items per page changes", () => {
            const handleChange = vi.fn();
            renderWithIntl(
                <PaginationElement
                    pageInfo={mockPageInfo}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={handleChange}
                />
            );
            fireEvent.change(screen.getByRole("combobox"), {target: {value: "25"}});
            expect(handleChange).toHaveBeenCalledWith({
                first: 25,
                last: null,
                after: null,
                before: null
            });
        });
    });

    describe("Visibility options", () => {
        it("hides items per page selector when showItemsPerPage is false", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={mockPageInfo}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={() => {}}
                    showItemsPerPage={false}
                />
            );
            expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
        });

        it("hides item count when showItemCount is false", () => {
            renderWithIntl(
                <PaginationElement
                    pageInfo={mockPageInfo}
                    itemsPerPage={10}
                    currentItemCount={10}
                    onPaginationChange={() => {}}
                    showItemCount={false}
                />
            );
            expect(screen.queryByText(/of 100/)).not.toBeInTheDocument();
        });
    });
});
