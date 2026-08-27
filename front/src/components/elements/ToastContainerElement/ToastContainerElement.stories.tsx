import type {Meta, StoryObj} from "@storybook/react";
import {useState} from "react";
import ToastContainerElement from "./index";
import ToastElement from "../ToastElement";
import ButtonElement from "../ButtonElement";

const meta = {
    title: "Elements/ToastContainerElement",
    component: ToastContainerElement,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    argTypes: {
        position: {
            control: "select",
            options: [
                "top-start",
                "top-center",
                "top-end",
                "middle-start",
                "middle-center",
                "middle-end",
                "bottom-start",
                "bottom-center",
                "bottom-end",
            ],
            description: "Position of the toast container",
        },
    },
} satisfies Meta<typeof ToastContainerElement>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoWrapper = ({position = "bottom-end"}: {position?: any}) => (
    <div style={{width: "100vw", height: "100vh", position: "relative", background: "#f6e1bd"}}>
        <div className="p-4">
            <h5>Toast Container Position: {position}</h5>
            <p className="text-muted">Toasts will appear in the {position.replace("-", " ")} corner</p>
        </div>
        <ToastContainerElement position={position}>
            <ToastElement
                variant="success"
                title="Success"
                body="This is a success notification"
                show={true}
                autohide={false}
            />
            <ToastElement
                variant="warning"
                title="Warning"
                body="This is a warning notification"
                show={true}
                autohide={false}
            />
            <ToastElement
                variant="info"
                title="Info"
                body="This is an info notification"
                show={true}
                autohide={false}
            />
        </ToastContainerElement>
    </div>
);

export const BottomEnd: Story = {
    args: {children: null},
    render: () => <DemoWrapper position="bottom-end" />,
};

export const BottomStart: Story = {
    args: {children: null},
    render: () => <DemoWrapper position="bottom-start" />,
};

export const BottomCenter: Story = {
    args: {children: null},
    render: () => <DemoWrapper position="bottom-center" />,
};

export const TopEnd: Story = {
    args: {children: null},
    render: () => <DemoWrapper position="top-end" />,
};

export const TopStart: Story = {
    args: {children: null},
    render: () => <DemoWrapper position="top-start" />,
};

export const TopCenter: Story = {
    args: {children: null},
    render: () => <DemoWrapper position="top-center" />,
};

export const MiddleEnd: Story = {
    args: {children: null},
    render: () => <DemoWrapper position="middle-end" />,
};

export const MiddleStart: Story = {
    args: {children: null},
    render: () => <DemoWrapper position="middle-start" />,
};

export const MiddleCenter: Story = {
    args: {children: null},
    render: () => <DemoWrapper position="middle-center" />,
};

export const MultipleToasts: Story = {
    args: {children: null},
    render: () => (
        <div style={{width: "100vw", height: "100vh", position: "relative", background: "#f6e1bd"}}>
            <div className="p-4">
                <h5>Multiple Toasts Stacking</h5>
                <p className="text-muted">Multiple toasts stack vertically with proper spacing</p>
            </div>
            <ToastContainerElement position="bottom-end">
                <ToastElement
                    variant="success"
                    title="Success"
                    body="Your profile has been updated"
                    footer="2 seconds ago"
                    show={true}
                    autohide={false}
                />
                <ToastElement
                    variant="info"
                    title="New Message"
                    body="You have a new message from Admin"
                    footer="5 seconds ago"
                    show={true}
                    autohide={false}
                />
                <ToastElement
                    variant="warning"
                    title="Storage Warning"
                    body="You are running low on storage space"
                    footer="1 minute ago"
                    show={true}
                    autohide={false}
                />
                <ToastElement
                    variant="danger"
                    title="Error"
                    body="Failed to upload file. Please try again"
                    footer="2 minutes ago"
                    show={true}
                    autohide={false}
                />
                <ToastElement
                    variant="default"
                    title="System Update"
                    body="A system update is available"
                    footer="5 minutes ago"
                    show={true}
                    autohide={false}
                />
            </ToastContainerElement>
        </div>
    ),
};

export const Interactive: Story = {
    args: {children: null},
    render: () => {
        const [toasts, setToasts] = useState<Array<{
            id: number;
            variant: "default" | "success" | "warning" | "danger" | "info";
            title: string;
            body: string;
        }>>([]);

        const addToast = (variant: "default" | "success" | "warning" | "danger" | "info") => {
            const titles = {
                default: "Notification",
                success: "Success",
                warning: "Warning",
                danger: "Error",
                info: "Information",
            };

            const bodies = {
                default: "This is a default notification",
                success: "Operation completed successfully",
                warning: "Please review this warning",
                danger: "An error has occurred",
                info: "Here is some information",
            };

            const newId = Date.now();
            setToasts([
                ...toasts,
                {
                    id: newId,
                    variant,
                    title: titles[variant],
                    body: bodies[variant],
                },
            ]);
        };

        const removeToast = (id: number) => {
            setToasts(toasts.filter(toast => toast.id !== id));
        };

        const clearAll = () => {
            setToasts([]);
        };

        return (
            <div style={{width: "100vw", height: "100vh", position: "relative", background: "#f6e1bd"}}>
                <div className="p-4">
                    <h5 className="mb-3">Interactive Toast Manager</h5>
                    <p className="text-muted mb-4">
                        Click the buttons below to add different types of toasts. They will stack in the bottom-right corner.
                    </p>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <ButtonElement variant="light" onClick={() => addToast("default")}>
                            Add Default
                        </ButtonElement>
                        <ButtonElement variant="success" onClick={() => addToast("success")}>
                            Add Success
                        </ButtonElement>
                        <ButtonElement variant="warning" onClick={() => addToast("warning")}>
                            Add Warning
                        </ButtonElement>
                        <ButtonElement variant="danger" onClick={() => addToast("danger")}>
                            Add Danger
                        </ButtonElement>
                        <ButtonElement variant="info" onClick={() => addToast("info")}>
                            Add Info
                        </ButtonElement>
                    </div>
                    {toasts.length > 0 && (
                        <ButtonElement variant="outline-secondary" size="sm" onClick={clearAll}>
                            Clear All ({toasts.length})
                        </ButtonElement>
                    )}
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
};

export const WithAutoHide: Story = {
    args: {children: null},
    render: () => {
        const [toasts, setToasts] = useState<Array<{
            id: number;
            variant: "success" | "info";
            title: string;
            body: string;
        }>>([]);

        const addToast = () => {
            const newId = Date.now();
            const variant = Math.random() > 0.5 ? "success" : "info";
            setToasts([
                ...toasts,
                {
                    id: newId,
                    variant,
                    title: variant === "success" ? "Success" : "Info",
                    body: `This toast will auto-hide in 5 seconds (ID: ${newId})`,
                },
            ]);

            setTimeout(() => {
                setToasts(prev => prev.filter(toast => toast.id !== newId));
            }, 5000);
        };

        return (
            <div style={{width: "100vw", height: "100vh", position: "relative", background: "#f6e1bd"}}>
                <div className="p-4">
                    <h5 className="mb-3">Auto-Hide Toasts</h5>
                    <p className="text-muted mb-4">
                        These toasts automatically disappear after 5 seconds
                    </p>
                    <ButtonElement variant="primary" onClick={addToast}>
                        Add Auto-Hide Toast
                    </ButtonElement>
                    {toasts.length > 0 && (
                        <p className="mt-3 mb-0 text-muted small">
                            Active toasts: {toasts.length}
                        </p>
                    )}
                </div>

                <ToastContainerElement position="bottom-end">
                    {toasts.map(toast => (
                        <ToastElement
                            key={toast.id}
                            variant={toast.variant}
                            title={toast.title}
                            body={toast.body}
                            show={true}
                            onClose={() => setToasts(toasts.filter(t => t.id !== toast.id))}
                            autohide={true}
                            delay={5000}
                        />
                    ))}
                </ToastContainerElement>
            </div>
        );
    },
};

export const AllPositions: Story = {
    args: {children: null},
    render: () => {
        const positions: Array<"top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end"> = [
            "top-start",
            "top-center",
            "top-end",
            "bottom-start",
            "bottom-center",
            "bottom-end",
        ];

        return (
            <div style={{width: "100vw", height: "100vh", position: "relative", background: "#f6e1bd"}}>
                <div className="p-4">
                    <h5 className="mb-3">All Container Positions</h5>
                    <p className="text-muted">Toasts can be positioned in 6 different locations</p>
                </div>

                {positions.map(position => (
                    <ToastContainerElement key={position} position={position}>
                        <ToastElement
                            variant="info"
                            body={position}
                            show={true}
                            autohide={false}
                        />
                    </ToastContainerElement>
                ))}
            </div>
        );
    },
};