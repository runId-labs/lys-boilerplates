import type {Meta, StoryObj} from "@storybook/react";
import CardElement from "./index";
import ButtonElement from "../ButtonElement";

const meta = {
    title: "Elements/CardElement",
    component: CardElement,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "elevated", "bordered", "flat", "widget"],
            description: "Visual variant of the card",
        },
        padding: {
            control: "select",
            options: ["none", "sm", "md", "lg"],
            description: "Padding size",
        },
        hoverable: {
            control: "boolean",
            description: "Enable hover effect",
        },
        header: {
            control: "text",
            description: "Header content",
        },
        footer: {
            control: "text",
            description: "Footer content",
        },
    },
} satisfies Meta<typeof CardElement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <>
                <h5 className="mb-3">Card Title</h5>
                <p className="mb-0">
                    This is a default card with subtle shadow and border. Perfect for
                    displaying widget-style content.
                </p>
            </>
        ),
    },
};

export const WithHeader: Story = {
    args: {
        header: <h5 className="mb-0">Card Header</h5>,
        children: (
            <p className="mb-0">
                Card with a header section. Great for labeled widgets or sections.
            </p>
        ),
    },
};

export const WithFooter: Story = {
    args: {
        children: (
            <p className="mb-0">
                Card with a footer section. Useful for actions or metadata.
            </p>
        ),
        footer: (
            <div className="d-flex justify-content-end gap-2">
                <ButtonElement variant="outline-secondary" size="sm">
                    Cancel
                </ButtonElement>
                <ButtonElement variant="primary" size="sm">
                    Save
                </ButtonElement>
            </div>
        ),
    },
};

export const Complete: Story = {
    args: {
        header: <h5 className="mb-0">User Profile</h5>,
        children: (
            <div>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" defaultValue="John Doe" />
                </div>
                <div className="mb-0">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        defaultValue="john@example.com"
                    />
                </div>
            </div>
        ),
        footer: (
            <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">Last updated: 2 hours ago</small>
                <ButtonElement variant="primary" size="sm">
                    Update Profile
                </ButtonElement>
            </div>
        ),
    },
};

export const Elevated: Story = {
    args: {
        variant: "elevated",
        children: (
            <>
                <h5 className="mb-3">Elevated Card</h5>
                <p className="mb-0">
                    This card has a stronger shadow for emphasis. Use for important
                    widgets or interactive elements.
                </p>
            </>
        ),
    },
};

export const Bordered: Story = {
    args: {
        variant: "bordered",
        children: (
            <>
                <h5 className="mb-3">Bordered Card</h5>
                <p className="mb-0">
                    This card uses a border instead of shadow. Clean and minimal.
                </p>
            </>
        ),
    },
};

export const Flat: Story = {
    args: {
        variant: "flat",
        children: (
            <>
                <h5 className="mb-3">Flat Card</h5>
                <p className="mb-0">
                    This card has no shadow or border. Pure and simple.
                </p>
            </>
        ),
    },
};

export const Widget: Story = {
    args: {
        variant: "widget",
        header: (
            <div className="d-flex align-items-center gap-2">
                <i className="bi bi-box-fill text-primary"></i>
                <h5 className="mb-0">Feature Widget</h5>
            </div>
        ),
        children: (
            <>
                <p className="mb-0">
                    This is the widget variant, optimized for feature components. It automatically
                    uses large padding and elevated shadow for a polished look.
                </p>
            </>
        ),
    },
};

export const Hoverable: Story = {
    args: {
        hoverable: true,
        children: (
            <>
                <h5 className="mb-3">Clickable Widget</h5>
                <p className="mb-0">
                    Hover over this card to see the interactive effect. Perfect for
                    clickable widgets or navigation cards.
                </p>
            </>
        ),
    },
};

export const NoPadding: Story = {
    args: {
        padding: "none",
        children: (
            <img
                src="https://via.placeholder.com/400x200"
                alt="Placeholder"
                style={{width: "100%", display: "block"}}
            />
        ),
    },
};

export const SmallPadding: Story = {
    args: {
        padding: "sm",
        header: <h6 className="mb-0">Compact Widget</h6>,
        children: <p className="mb-0 small">Small padding for compact layouts.</p>,
    },
};

export const LargePadding: Story = {
    args: {
        padding: "lg",
        header: <h4 className="mb-0">Spacious Widget</h4>,
        children: (
            <p className="mb-0">Large padding for comfortable reading and emphasis.</p>
        ),
    },
};

export const LoginWidget: Story = {
    args: {
        header: (
            <div className="d-flex align-items-center gap-2">
                <i className="bi bi-lock-fill text-primary"></i>
                <h5 className="mb-0">Login</h5>
            </div>
        ),
        children: (
            <div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="your@email.com" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" placeholder="••••••••" />
                </div>
                <ButtonElement variant="primary" fullWidth>
                    Sign In
                </ButtonElement>
            </div>
        ),
        footer: (
            <div className="text-center">
                <a href="#" className="text-decoration-none small">
                    Forgot password?
                </a>
            </div>
        ),
    },
};

export const Grid: Story = {
    render: () => (
        <div className="row g-3">
            <div className="col-md-4">
                <CardElement variant="default" hoverable>
                    <i className="bi bi-speedometer2 text-primary fs-1 mb-3"></i>
                    <h5>Dashboard</h5>
                    <p className="mb-0 text-muted">View your analytics</p>
                </CardElement>
            </div>
            <div className="col-md-4">
                <CardElement variant="default" hoverable>
                    <i className="bi bi-people-fill text-success fs-1 mb-3"></i>
                    <h5>Users</h5>
                    <p className="mb-0 text-muted">Manage user accounts</p>
                </CardElement>
            </div>
            <div className="col-md-4">
                <CardElement variant="default" hoverable>
                    <i className="bi bi-gear-fill text-warning fs-1 mb-3"></i>
                    <h5>Settings</h5>
                    <p className="mb-0 text-muted">Configure your app</p>
                </CardElement>
            </div>
        </div>
    ),
};