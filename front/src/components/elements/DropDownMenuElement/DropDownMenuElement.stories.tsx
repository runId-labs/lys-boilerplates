import type {Meta, StoryObj} from "@storybook/react";
import DropDownMenuElement from "./index";
import {DropDownMenu} from "./types";

const meta = {
    title: "Elements/DropDownMenuElement",
    component: DropDownMenuElement,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof DropDownMenuElement>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample menu data
const singleMenu: DropDownMenu[] = [
    {
        edit: {
            icon: <i className="bi bi-pencil"></i>,
            label: "Edit",
            onClick: () => alert("Edit clicked"),
        },
        delete: {
            icon: <i className="bi bi-trash"></i>,
            label: "Delete",
            onClick: () => alert("Delete clicked"),
            variant: "danger",
        },
    },
];

const multiSectionMenu: DropDownMenu[] = [
    {
        view: {
            icon: <i className="bi bi-eye"></i>,
            label: "View Details",
            onClick: () => alert("View clicked"),
        },
        edit: {
            icon: <i className="bi bi-pencil"></i>,
            label: "Edit",
            onClick: () => alert("Edit clicked"),
        },
    },
    {
        duplicate: {
            icon: <i className="bi bi-files"></i>,
            label: "Duplicate",
            onClick: () => alert("Duplicate clicked"),
        },
        archive: {
            icon: <i className="bi bi-archive"></i>,
            label: "Archive",
            onClick: () => alert("Archive clicked"),
        },
    },
    {
        delete: {
            icon: <i className="bi bi-trash"></i>,
            label: "Delete",
            onClick: () => alert("Delete clicked"),
            variant: "danger",
        },
    },
];

const menuWithDisabled: DropDownMenu[] = [
    {
        edit: {
            icon: <i className="bi bi-pencil"></i>,
            label: "Edit",
            onClick: () => alert("Edit clicked"),
        },
        share: {
            icon: <i className="bi bi-share"></i>,
            label: "Share (disabled)",
            onClick: () => alert("Share clicked"),
            disabled: true,
        },
        delete: {
            icon: <i className="bi bi-trash"></i>,
            label: "Delete",
            onClick: () => alert("Delete clicked"),
            variant: "danger",
        },
    },
];

const menuWithHidden: DropDownMenu[] = [
    {
        visible: {
            icon: <i className="bi bi-eye"></i>,
            label: "Visible Item",
            onClick: () => alert("Visible clicked"),
        },
        hidden: {
            icon: <i className="bi bi-eye-slash"></i>,
            label: "Hidden Item",
            // No onClick - will not be rendered
        },
        alsoVisible: {
            icon: <i className="bi bi-check"></i>,
            label: "Also Visible",
            onClick: () => alert("Also visible clicked"),
        },
    },
];

export const Default: Story = {
    args: {
        menus: singleMenu,
    },
};

export const MultiSection: Story = {
    args: {
        menus: multiSectionMenu,
    },
};

export const WithDisabledItems: Story = {
    args: {
        menus: menuWithDisabled,
    },
};

export const WithHiddenItems: Story = {
    args: {
        menus: menuWithHidden,
    },
};

export const CustomToggle: Story = {
    args: {
        menus: singleMenu,
        toggleContent: (
            <>
                <i className="bi bi-gear me-1"></i>
                Actions
            </>
        ),
    },
};

export const PrimaryVariant: Story = {
    args: {
        menus: singleMenu,
        variant: "primary",
        toggleContent: (
            <>
                <i className="bi bi-three-dots-vertical me-1"></i>
                Menu
            </>
        ),
    },
};

export const SmallSize: Story = {
    args: {
        menus: singleMenu,
        size: "sm",
    },
};

export const LargeSize: Story = {
    args: {
        menus: singleMenu,
        size: "lg",
        toggleContent: (
            <>
                <i className="bi bi-three-dots-vertical me-1"></i>
                Actions
            </>
        ),
    },
};

export const AlignStart: Story = {
    args: {
        menus: multiSectionMenu,
        align: "start",
    },
};

export const EmptyMenu: Story = {
    args: {
        menus: [
            {
                item1: {
                    label: "Hidden Item 1",
                    // No onClick
                },
                item2: {
                    label: "Hidden Item 2",
                    // No onClick
                },
            },
        ],
    },
};

export const NoIcons: Story = {
    args: {
        menus: [
            {
                edit: {
                    label: "Edit",
                    onClick: () => alert("Edit clicked"),
                },
                delete: {
                    label: "Delete",
                    onClick: () => alert("Delete clicked"),
                    variant: "danger",
                },
            },
        ],
    },
};

export const ColorVariants: Story = {
    args: {
        menus: [
            {
                default: {
                    icon: <i className="bi bi-circle"></i>,
                    label: "Default",
                    onClick: () => alert("Default clicked"),
                },
                success: {
                    icon: <i className="bi bi-check-circle"></i>,
                    label: "Success",
                    onClick: () => alert("Success clicked"),
                    variant: "success",
                },
                warning: {
                    icon: <i className="bi bi-exclamation-circle"></i>,
                    label: "Warning",
                    onClick: () => alert("Warning clicked"),
                    variant: "warning",
                },
                danger: {
                    icon: <i className="bi bi-x-circle"></i>,
                    label: "Danger",
                    onClick: () => alert("Danger clicked"),
                    variant: "danger",
                },
            },
        ],
    },
};