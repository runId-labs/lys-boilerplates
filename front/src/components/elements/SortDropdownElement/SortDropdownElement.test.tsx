import {describe, it, expect, vi} from "vitest";
import {screen, fireEvent} from "@testing-library/react";
import renderWithIntl from "@/test/utils";
import SortDropdownElement, {SortOption} from "./index";

const mockSortOptions: SortOption[] = [
    {key: "name", label: "Name"},
    {key: "createdAt", label: "Created Date"},
    {key: "updatedAt", label: "Updated Date"}
];

describe("SortDropdownElement", () => {
    describe("Rendering", () => {
        it("renders sort label", () => {
            renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="name"
                    sortDirection="ASC"
                    onSortFieldChange={() => {}}
                    onSortDirectionChange={() => {}}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                />
            );
            expect(screen.getByText("Sort by")).toBeInTheDocument();
        });

        it("renders all sort options", () => {
            renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="name"
                    sortDirection="ASC"
                    onSortFieldChange={() => {}}
                    onSortDirectionChange={() => {}}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                />
            );
            expect(screen.getByRole("option", {name: "Name"})).toBeInTheDocument();
            expect(screen.getByRole("option", {name: "Created Date"})).toBeInTheDocument();
            expect(screen.getByRole("option", {name: "Updated Date"})).toBeInTheDocument();
        });

        it("selects current sort field", () => {
            renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="createdAt"
                    sortDirection="ASC"
                    onSortFieldChange={() => {}}
                    onSortDirectionChange={() => {}}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                />
            );
            expect(screen.getByRole("combobox")).toHaveValue("createdAt");
        });

        it("applies custom className", () => {
            const {container} = renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="name"
                    sortDirection="ASC"
                    onSortFieldChange={() => {}}
                    onSortDirectionChange={() => {}}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                    className="custom-sort"
                />
            );
            expect(container.querySelector(".custom-sort")).toBeInTheDocument();
        });
    });

    describe("Sort field change", () => {
        it("calls onSortFieldChange when field changes", () => {
            const handleFieldChange = vi.fn();
            renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="name"
                    sortDirection="ASC"
                    onSortFieldChange={handleFieldChange}
                    onSortDirectionChange={() => {}}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                />
            );
            fireEvent.change(screen.getByRole("combobox"), {target: {value: "createdAt"}});
            expect(handleFieldChange).toHaveBeenCalledWith("createdAt");
        });
    });

    describe("Sort direction", () => {
        it("shows ascending icon when ASC", () => {
            const {container} = renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="name"
                    sortDirection="ASC"
                    onSortFieldChange={() => {}}
                    onSortDirectionChange={() => {}}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                />
            );
            expect(container.querySelector(".bi-sort-up")).toBeInTheDocument();
        });

        it("shows descending icon when DESC", () => {
            const {container} = renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="name"
                    sortDirection="DESC"
                    onSortFieldChange={() => {}}
                    onSortDirectionChange={() => {}}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                />
            );
            expect(container.querySelector(".bi-sort-down")).toBeInTheDocument();
        });

        it("calls onSortDirectionChange when direction toggled", () => {
            const handleDirectionChange = vi.fn();
            renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="name"
                    sortDirection="ASC"
                    onSortFieldChange={() => {}}
                    onSortDirectionChange={handleDirectionChange}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                />
            );
            const directionButton = screen.getByRole("button", {name: /sort direction/i});
            fireEvent.click(directionButton);
            expect(handleDirectionChange).toHaveBeenCalledWith("DESC");
        });

        it("toggles from DESC to ASC", () => {
            const handleDirectionChange = vi.fn();
            renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="name"
                    sortDirection="DESC"
                    onSortFieldChange={() => {}}
                    onSortDirectionChange={handleDirectionChange}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                />
            );
            const directionButton = screen.getByRole("button", {name: /sort direction/i});
            fireEvent.click(directionButton);
            expect(handleDirectionChange).toHaveBeenCalledWith("ASC");
        });

        it("shows correct aria-label for ASC", () => {
            renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="name"
                    sortDirection="ASC"
                    onSortFieldChange={() => {}}
                    onSortDirectionChange={() => {}}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                />
            );
            expect(screen.getByRole("button", {name: "Sort direction: Ascending"})).toBeInTheDocument();
        });

        it("shows correct aria-label for DESC", () => {
            renderWithIntl(
                <SortDropdownElement
                    sortOptions={mockSortOptions}
                    sortField="name"
                    sortDirection="DESC"
                    onSortFieldChange={() => {}}
                    onSortDirectionChange={() => {}}
                    label="Sort by"
                    ascendingLabel="Ascending"
                    descendingLabel="Descending"
                />
            );
            expect(screen.getByRole("button", {name: "Sort direction: Descending"})).toBeInTheDocument();
        });
    });
});
