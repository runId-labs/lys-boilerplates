import type { Meta, StoryObj } from "@storybook/react-vite";
import FileDropZoneElement from "./index";

const meta: Meta<typeof FileDropZoneElement> = {
    title: "Elements/FileDropZoneElement",
    component: FileDropZoneElement,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        onFilesDropped: {
            action: "filesDropped",
            description: "Called with the files from a single drop or file-picker selection",
        },
        disabled: {
            control: "boolean",
            description: "Whether the component is disabled",
        },
        dropZoneLabel: {
            control: "text",
            description: "Label for the drop zone area",
        },
        helperText: {
            control: "text",
            description: "Helper text shown below the drop zone",
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        dropZoneLabel: "Drag and drop files here or click to select",
        helperText: "Any file type — recognised server-side",
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        dropZoneLabel: "File upload is disabled",
    },
};
