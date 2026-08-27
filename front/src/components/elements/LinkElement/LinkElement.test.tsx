import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import LinkElement from "./index";

// Wrapper component for router context
const renderWithRouter = (ui: React.ReactElement, {route = "/"} = {}) => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            {ui}
        </MemoryRouter>
    );
};

describe("LinkElement", () => {
    describe("Rendering", () => {
        it("renders children correctly", () => {
            renderWithRouter(<LinkElement to="/test">Click me</LinkElement>);
            expect(screen.getByText("Click me")).toBeInTheDocument();
        });

        it("renders as a link", () => {
            renderWithRouter(<LinkElement to="/test">Link</LinkElement>);
            expect(screen.getByRole("link")).toBeInTheDocument();
        });

        it("has correct href", () => {
            renderWithRouter(<LinkElement to="/dashboard">Dashboard</LinkElement>);
            expect(screen.getByRole("link")).toHaveAttribute("href", "/dashboard");
        });

        it("renders with custom className", () => {
            renderWithRouter(
                <LinkElement to="/test" className="custom-link">
                    Link
                </LinkElement>
            );
            expect(screen.getByRole("link")).toHaveClass("custom-link");
        });
    });

    describe("Navigation paths", () => {
        it("renders link to root path", () => {
            renderWithRouter(<LinkElement to="/">Home</LinkElement>);
            expect(screen.getByRole("link")).toHaveAttribute("href", "/");
        });

        it("renders link with nested path", () => {
            renderWithRouter(<LinkElement to="/admin/users/123">User</LinkElement>);
            expect(screen.getByRole("link")).toHaveAttribute("href", "/admin/users/123");
        });

        it("renders link with query params", () => {
            renderWithRouter(<LinkElement to="/search?q=test">Search</LinkElement>);
            expect(screen.getByRole("link")).toHaveAttribute("href", "/search?q=test");
        });
    });

    describe("Events", () => {
        it("calls onClick handler when clicked", () => {
            const handleClick = vi.fn();
            renderWithRouter(
                <LinkElement to="/test" onClick={handleClick}>
                    Link
                </LinkElement>
            );
            fireEvent.click(screen.getByRole("link"));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("onClick receives event object", () => {
            const handleClick = vi.fn();
            renderWithRouter(
                <LinkElement to="/test" onClick={handleClick}>
                    Link
                </LinkElement>
            );
            fireEvent.click(screen.getByRole("link"));
            expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    describe("Complex children", () => {
        it("renders with icon and text", () => {
            renderWithRouter(
                <LinkElement to="/settings">
                    <i className="bi bi-gear" data-testid="icon" />
                    <span>Settings</span>
                </LinkElement>
            );
            expect(screen.getByTestId("icon")).toBeInTheDocument();
            expect(screen.getByText("Settings")).toBeInTheDocument();
        });

        it("renders with nested elements", () => {
            renderWithRouter(
                <LinkElement to="/profile">
                    <div className="link-content">
                        <img src="/avatar.png" alt="Avatar" />
                        <span>Profile</span>
                    </div>
                </LinkElement>
            );
            expect(screen.getByText("Profile")).toBeInTheDocument();
            expect(screen.getByAltText("Avatar")).toBeInTheDocument();
        });
    });
});