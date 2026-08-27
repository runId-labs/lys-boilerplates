import {describe, it, expect, vi} from "vitest";
import {screen} from "@testing-library/react";
import renderWithIntl from "@/test/utils";
import TableElement from "./index";

const mockColumns = [
    {dataName: "name", label: "Name", xs: 6},
    {dataName: "email", label: "Email", xs: 6}
];

const mockData = [
    {name: "John Doe", email: "john@example.com"},
    {name: "Jane Smith", email: "jane@example.com"}
];

describe("TableElement", () => {
    describe("Rendering", () => {
        it("renders table headers", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} />);
            expect(screen.getByText("Name")).toBeInTheDocument();
            expect(screen.getByText("Email")).toBeInTheDocument();
        });

        it("renders table data", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} />);
            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.getByText("john@example.com")).toBeInTheDocument();
            expect(screen.getByText("Jane Smith")).toBeInTheDocument();
            expect(screen.getByText("jane@example.com")).toBeInTheDocument();
        });

        it("renders correct number of rows", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} />);
            const rows = screen.getAllByRole("row");
            // 1 header row + 2 data rows
            expect(rows.length).toBe(3);
        });

        it("renders table element", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} />);
            expect(screen.getByRole("table")).toBeInTheDocument();
        });
    });

    describe("Empty state", () => {
        it("shows empty message when no data", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={[]} />);
            expect(screen.getByText("No data available")).toBeInTheDocument();
        });

        it("shows custom empty message", () => {
            renderWithIntl(
                <TableElement
                    columns={mockColumns}
                    data={[]}
                    emptyMessage="No users found"
                />
            );
            expect(screen.getByText("No users found")).toBeInTheDocument();
        });
    });

    describe("Action column", () => {
        it("renders action column header", () => {
            renderWithIntl(
                <TableElement
                    columns={mockColumns}
                    data={mockData}
                    actionGenerator={() => <button>Edit</button>}
                />
            );
            expect(screen.getByText("Actions")).toBeInTheDocument();
        });

        it("renders custom action column label", () => {
            renderWithIntl(
                <TableElement
                    columns={mockColumns}
                    data={mockData}
                    actionGenerator={() => <button>Edit</button>}
                    actionColumnLabel="Operations"
                />
            );
            expect(screen.getByText("Operations")).toBeInTheDocument();
        });

        it("renders action buttons for each row", () => {
            renderWithIntl(
                <TableElement
                    columns={mockColumns}
                    data={mockData}
                    actionGenerator={(row) => (
                        <button data-testid={`edit-${row.name}`}>Edit</button>
                    )}
                />
            );
            expect(screen.getByTestId("edit-John Doe")).toBeInTheDocument();
            expect(screen.getByTestId("edit-Jane Smith")).toBeInTheDocument();
        });

        it("passes row data to action generator", () => {
            const actionGenerator = vi.fn(() => <button>Action</button>);
            renderWithIntl(
                <TableElement
                    columns={mockColumns}
                    data={mockData}
                    actionGenerator={actionGenerator}
                />
            );
            expect(actionGenerator).toHaveBeenCalledWith(mockData[0]);
            expect(actionGenerator).toHaveBeenCalledWith(mockData[1]);
        });
    });

    describe("Custom cell generator", () => {
        it("uses column generator for custom rendering", () => {
            const columnsWithGenerator = [
                {
                    dataName: "name",
                    label: "Name",
                    xs: 6,
                    generator: (row: any) => <strong data-testid="custom">{row.name}</strong>
                },
                {dataName: "email", label: "Email", xs: 6}
            ];

            renderWithIntl(<TableElement columns={columnsWithGenerator} data={mockData} />);
            expect(screen.getAllByTestId("custom")).toHaveLength(2);
        });
    });

    describe("Table options", () => {
        it("applies striped by default", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} />);
            expect(document.querySelector(".table-striped")).toBeInTheDocument();
        });

        it("applies hover by default", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} />);
            expect(document.querySelector(".table-hover")).toBeInTheDocument();
        });

        it("disables striped when false", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} striped={false} />);
            expect(document.querySelector(".table-striped")).not.toBeInTheDocument();
        });

        it("disables hover when false", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} hover={false} />);
            expect(document.querySelector(".table-hover")).not.toBeInTheDocument();
        });

        it("applies bordered when true", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} bordered />);
            expect(document.querySelector(".table-bordered")).toBeInTheDocument();
        });

        it("applies borderless when true", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} borderless />);
            expect(document.querySelector(".table-borderless")).toBeInTheDocument();
        });
    });

    describe("Responsive wrapper", () => {
        it("wraps in responsive div by default", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} />);
            expect(document.querySelector(".table-responsive")).toBeInTheDocument();
        });

        it("does not wrap when responsive is false", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} responsive={false} />);
            expect(document.querySelector(".table-responsive")).not.toBeInTheDocument();
        });
    });

    describe("Custom className", () => {
        it("applies custom className to table", () => {
            renderWithIntl(<TableElement columns={mockColumns} data={mockData} className="custom-table" />);
            expect(document.querySelector(".custom-table")).toBeInTheDocument();
        });
    });
});
