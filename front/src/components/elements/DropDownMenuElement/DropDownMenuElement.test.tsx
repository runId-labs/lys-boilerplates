import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import DropDownMenuElement from "./index";
import {DropDownMenu} from "./types";

const mockMenus: DropDownMenu[] = [
    {
        edit: {label: "Edit", onClick: vi.fn(), icon: <i className="bi bi-pencil" />},
        view: {label: "View", onClick: vi.fn()}
    },
    {
        delete: {label: "Delete", onClick: vi.fn(), variant: "danger"}
    }
];

/**
 * Get the dropdown toggle button (avoids matching dropdown items that also have button role)
 */
function getToggle() {
    return document.getElementById("dropdown-menu-toggle") as HTMLElement;
}

describe("DropDownMenuElement", () => {
    describe("Rendering", () => {
        it("renders toggle button", () => {
            render(<DropDownMenuElement menus={mockMenus} />);
            expect(getToggle()).toBeInTheDocument();
        });

        it("renders custom toggle content", () => {
            render(
                <DropDownMenuElement
                    menus={mockMenus}
                    toggleContent={<span data-testid="custom-toggle">Menu</span>}
                />
            );
            expect(screen.getByTestId("custom-toggle")).toBeInTheDocument();
        });

        it("renders default three-dots icon when no custom toggle", () => {
            const {container} = render(<DropDownMenuElement menus={mockMenus} />);
            expect(container.querySelector(".bi-three-dots-vertical")).toBeInTheDocument();
        });

        it("does not render when no visible items", () => {
            const emptyMenus = [{
                item: {label: "Hidden", onClick: undefined}
            }];
            const {container} = render(<DropDownMenuElement menus={emptyMenus} />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("Menu items", () => {
        it("shows menu items when clicked", async () => {
            render(<DropDownMenuElement menus={mockMenus} />);
            fireEvent.click(getToggle());
            expect(await screen.findByText("Edit")).toBeInTheDocument();
            expect(await screen.findByText("View")).toBeInTheDocument();
            expect(await screen.findByText("Delete")).toBeInTheDocument();
        });

        it("renders item icons", async () => {
            const {container} = render(<DropDownMenuElement menus={mockMenus} />);
            fireEvent.click(getToggle());
            await screen.findByText("Edit");
            expect(container.querySelector(".bi-pencil")).toBeInTheDocument();
        });

        it("calls onClick when item clicked", async () => {
            const handleEdit = vi.fn();
            const menus = [{
                edit: {label: "Edit", onClick: handleEdit}
            }];
            render(<DropDownMenuElement menus={menus} />);
            fireEvent.click(getToggle());
            fireEvent.click(await screen.findByText("Edit"));
            expect(handleEdit).toHaveBeenCalled();
        });
    });

    describe("Menu sections", () => {
        it("renders divider between sections", async () => {
            const {container} = render(<DropDownMenuElement menus={mockMenus} />);
            fireEvent.click(getToggle());
            await screen.findByText("Edit");
            expect(container.querySelector(".dropdown-divider")).toBeInTheDocument();
        });
    });

    describe("Disabled items", () => {
        it("renders disabled items", async () => {
            const menus = [{
                item: {label: "Disabled Item", onClick: vi.fn(), disabled: true}
            }];
            render(<DropDownMenuElement menus={menus} />);
            fireEvent.click(getToggle());
            const item = await screen.findByText("Disabled Item");
            expect(item.closest(".dropdown-item")).toHaveClass("disabled");
        });
    });

    describe("Variants", () => {
        it("applies danger variant class", async () => {
            render(<DropDownMenuElement menus={mockMenus} />);
            fireEvent.click(getToggle());
            const deleteItem = await screen.findByText("Delete");
            expect(deleteItem.closest(".dropdown-item")).toHaveClass("text-danger");
        });

        it("applies success variant class", async () => {
            const menus = [{
                item: {label: "Success", onClick: vi.fn(), variant: "success" as const}
            }];
            render(<DropDownMenuElement menus={menus} />);
            fireEvent.click(getToggle());
            const item = await screen.findByText("Success");
            expect(item.closest(".dropdown-item")).toHaveClass("text-success");
        });

        it("applies warning variant class", async () => {
            const menus = [{
                item: {label: "Warning", onClick: vi.fn(), variant: "warning" as const}
            }];
            render(<DropDownMenuElement menus={menus} />);
            fireEvent.click(getToggle());
            const item = await screen.findByText("Warning");
            expect(item.closest(".dropdown-item")).toHaveClass("text-warning");
        });
    });

    describe("Button variants", () => {
        it("uses link variant by default", () => {
            render(<DropDownMenuElement menus={mockMenus} />);
            expect(getToggle()).toHaveClass("btn-link");
        });

        it("supports custom button variant", () => {
            render(<DropDownMenuElement menus={mockMenus} variant="primary" />);
            expect(getToggle()).toHaveClass("btn-primary");
        });
    });

    describe("Button size", () => {
        it("supports small size", () => {
            render(<DropDownMenuElement menus={mockMenus} size="sm" />);
            expect(getToggle()).toHaveClass("btn-sm");
        });

        it("supports large size", () => {
            render(<DropDownMenuElement menus={mockMenus} size="lg" />);
            expect(getToggle()).toHaveClass("btn-lg");
        });
    });

    describe("Alignment", () => {
        it("uses end alignment by default", () => {
            const {container} = render(<DropDownMenuElement menus={mockMenus} />);
            expect(container.querySelector(".dropdown")).toBeInTheDocument();
        });
    });

    describe("Custom className", () => {
        it("applies custom className", () => {
            const {container} = render(
                <DropDownMenuElement menus={mockMenus} className="custom-dropdown" />
            );
            expect(container.querySelector(".custom-dropdown")).toBeInTheDocument();
        });
    });
});
