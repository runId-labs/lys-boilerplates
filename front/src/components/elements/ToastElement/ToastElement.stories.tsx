import type {Meta, StoryObj} from "@storybook/react";
import {useState} from "react";
import ToastElement from "./index";
import ToastContainerElement from "../ToastContainerElement";
import ButtonElement from "../ButtonElement";

const meta = {
    title: "Elements/ToastElement",
    component: ToastElement,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "success", "warning", "danger", "info"],
            description: "Visual variant of the toast",
        },
        title: {
            control: "text",
            description: "Toast title (optional)",
        },
        body: {
            control: "text",
            description: "Toast body content (required)",
        },
        footer: {
            control: "text",
            description: "Toast footer (optional)",
        },
        show: {
            control: "boolean",
            description: "Whether the toast is visible",
        },
        autohide: {
            control: "boolean",
            description: "Enable auto-hide",
        },
        delay: {
            control: "number",
            description: "Auto-hide delay in milliseconds",
        },
    },
} satisfies Meta<typeof ToastElement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        variant: "default",
        title: "Notification",
        body: "This is a default toast notification with light background.",
        show: true,
        autohide: false,
    },
};

export const Success: Story = {
    args: {
        variant: "success",
        title: "Success",
        body: "Your changes have been saved successfully!",
        show: true,
        autohide: false,
    },
};

export const Warning: Story = {
    args: {
        variant: "warning",
        title: "Warning",
        body: "This action cannot be undone. Please proceed with caution.",
        show: true,
        autohide: false,
    },
};

export const Danger: Story = {
    args: {
        variant: "danger",
        title: "Error",
        body: "An error occurred while processing your request. Please try again.",
        show: true,
        autohide: false,
    },
};

export const Info: Story = {
    args: {
        variant: "info",
        title: "Information",
        body: "New updates are available. Click here to learn more.",
        show: true,
        autohide: false,
    },
};

export const WithoutTitle: Story = {
    args: {
        variant: "success",
        body: "This toast has no title, just body content.",
        show: true,
        autohide: false,
    },
};

export const WithFooter: Story = {
    args: {
        variant: "info",
        title: "Update Available",
        body: "A new version of the application is available.",
        footer: "Version 2.0.1 - Released 2 hours ago",
        show: true,
        autohide: false,
    },
};

export const LongContent: Story = {
    args: {
        variant: "default",
        title: "Long Message",
        body: "This is a longer message that demonstrates how the toast handles multiple lines of text. The toast will automatically adjust its height to accommodate the content while maintaining a maximum width for readability.",
        footer: "Additional context can be provided in the footer section.",
        show: true,
        autohide: false,
    },
};

export const WithAutoHide: Story = {
    args: {
        variant: "success",
        title: "Auto-Hide",
        body: "This toast will automatically disappear after 5 seconds.",
        show: true,
        autohide: true,
        delay: 5000,
    },
};

export const Interactive: Story = {
    args: { body: null },
    render: () => {
        const [show, setShow] = useState(false);

        return (
            <div>
                <ButtonElement
                    variant="primary"
                    onClick={() => setShow(true)}
                >
                    Show Toast
                </ButtonElement>

                {show && (
                    <div style={{position: "fixed", top: 20, right: 20}}>
                        <ToastElement
                            variant="success"
                            title="Success"
                            body="Operation completed successfully!"
                            show={show}
                            onClose={() => setShow(false)}
                            autohide
                            delay={5000}
                        />
                    </div>
                )}
            </div>
        );
    },
};

export const AllVariants: Story = {
    args: { body: null },
    render: () => (
        <div className="d-flex flex-column gap-3" style={{minWidth: 350}}>
            <ToastElement
                variant="default"
                title="Default"
                body="Default variant with light background"
                show={true}
                autohide={false}
            />
            <ToastElement
                variant="success"
                title="Success"
                body="Success variant with green background"
                show={true}
                autohide={false}
            />
            <ToastElement
                variant="warning"
                title="Warning"
                body="Warning variant with orange background"
                show={true}
                autohide={false}
            />
            <ToastElement
                variant="danger"
                title="Danger"
                body="Danger variant with red background"
                show={true}
                autohide={false}
            />
            <ToastElement
                variant="info"
                title="Info"
                body="Info variant with blue background"
                show={true}
                autohide={false}
            />
        </div>
    ),
};

export const RealWorldExamples: Story = {
    args: { body: null },
    render: () => (
        <div className="d-flex flex-column gap-3" style={{minWidth: 350}}>
            <ToastElement
                variant="success"
                title="Login Successful"
                body="Welcome back! You have been successfully logged in."
                footer="Session expires in 24 hours"
                show={true}
                autohide={false}
            />
            <ToastElement
                variant="danger"
                title="Authentication Failed"
                body="Invalid email or password. Please try again."
                show={true}
                autohide={false}
            />
            <ToastElement
                variant="warning"
                title="Session Expiring Soon"
                body="Your session will expire in 5 minutes. Save your work."
                show={true}
                autohide={false}
            />
            <ToastElement
                variant="info"
                title="New Message"
                body="You have 3 unread messages in your inbox."
                footer={<a href="#" className="text-decoration-none">View Messages</a>}
                show={true}
                autohide={false}
            />
        </div>
    ),
};

export const InContainer: Story = {
    args: { body: null },
    render: () => {
        const [toasts, setToasts] = useState([
            {id: 1, variant: "success" as const, title: "Success", body: "First notification"},
            {id: 2, variant: "warning" as const, title: "Warning", body: "Second notification"},
            {id: 3, variant: "info" as const, title: "Info", body: "Third notification"},
        ]);

        const removeToast = (id: number) => {
            setToasts(toasts.filter(toast => toast.id !== id));
        };

        return (
            <div style={{width: "100vw", height: "100vh", position: "relative"}}>
                <div className="p-4">
                    <h5>Toast Container Demo</h5>
                    <p>Toasts are positioned at bottom-right corner</p>
                    <ButtonElement
                        variant="primary"
                        onClick={() => {
                            const newId = Math.max(...toasts.map(t => t.id), 0) + 1;
                            setToasts([
                                ...toasts,
                                {
                                    id: newId,
                                    variant: "success",
                                    title: "New Toast",
                                    body: `Toast #${newId}`,
                                },
                            ]);
                        }}
                    >
                        Add Toast
                    </ButtonElement>
                </div>

                <ToastContainerElement position="bottom-end">
                    {toasts.map(toast => (
                        <ToastElement
                            key={toast.id}
                            variant={toast.variant}
                            title={toast.title}
                            body={toast.body}
                            show={true}
                            onClose={() => removeToast(toast.id)}
                            autohide={false}
                        />
                    ))}
                </ToastContainerElement>
            </div>
        );
    },
    parameters: {
        layout: "fullscreen",
    },
};