import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import BreadCrumbsElement from "./index";

const renderWithRouter = (ui: React.ReactElement) => {
    return render(
        <MemoryRouter>
            {ui}
        </MemoryRouter>
    );
};

describe("BreadCrumbsElement", () => {
    describe("Rendering", () => {
        it("renders breadcrumb navigation", () => {
            renderWithRouter(
                <BreadCrumbsElement
                    items={[{label: "Home", path: "/"}]}
                    currentPageLabel="Current Page"
                />
            );
            expect(screen.getByRole("navigation")).toBeInTheDocument();
        });

        it("renders breadcrumb items", () => {
            renderWithRouter(
                <BreadCrumbsElement
                    items={[
                        {label: "Home", path: "/"},
                        {label: "Users", path: "/users"}
                    ]}
                    currentPageLabel="User Details"
                />
            );
            expect(screen.getByText("Home")).toBeInTheDocument();
            expect(screen.getByText("Users")).toBeInTheDocument();
        });

        it("renders current page label", () => {
            renderWithRouter(
                <BreadCrumbsElement
                    items={[{label: "Home", path: "/"}]}
                    currentPageLabel="Current Page"
                />
            );
            expect(screen.getByText("Current Page")).toBeInTheDocument();
        });
    });

    describe("Links", () => {
        it("breadcrumb items are links", () => {
            renderWithRouter(
                <BreadCrumbsElement
                    items={[
                        {label: "Home", path: "/"},
                        {label: "Users", path: "/users"}
                    ]}
                    currentPageLabel="Details"
                />
            );
            const homeLink = screen.getByText("Home").closest("a");
            const usersLink = screen.getByText("Users").closest("a");
            expect(homeLink).toHaveAttribute("href", "/");
            expect(usersLink).toHaveAttribute("href", "/users");
        });

        it("current page is not a link", () => {
            renderWithRouter(
                <BreadCrumbsElement
                    items={[{label: "Home", path: "/"}]}
                    currentPageLabel="Current Page"
                />
            );
            const currentPage = screen.getByText("Current Page");
            expect(currentPage.closest("a")).toBeNull();
        });
    });

    describe("Active state", () => {
        it("current page has active class", () => {
            const {container} = renderWithRouter(
                <BreadCrumbsElement
                    items={[{label: "Home", path: "/"}]}
                    currentPageLabel="Current Page"
                />
            );
            expect(container.querySelector(".active")).toBeInTheDocument();
        });
    });

    describe("Empty items", () => {
        it("renders only current page when no items", () => {
            renderWithRouter(
                <BreadCrumbsElement
                    items={[]}
                    currentPageLabel="Single Page"
                />
            );
            expect(screen.getByText("Single Page")).toBeInTheDocument();
        });
    });

    describe("Multiple breadcrumbs", () => {
        it("renders deep nested path", () => {
            renderWithRouter(
                <BreadCrumbsElement
                    items={[
                        {label: "Home", path: "/"},
                        {label: "Admin", path: "/admin"},
                        {label: "Users", path: "/admin/users"},
                        {label: "John Doe", path: "/admin/users/123"}
                    ]}
                    currentPageLabel="Edit Profile"
                />
            );
            expect(screen.getByText("Home")).toBeInTheDocument();
            expect(screen.getByText("Admin")).toBeInTheDocument();
            expect(screen.getByText("Users")).toBeInTheDocument();
            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.getByText("Edit Profile")).toBeInTheDocument();
        });
    });

    describe("CSS class", () => {
        it("has breadcrumbs-element class", () => {
            const {container} = renderWithRouter(
                <BreadCrumbsElement
                    items={[]}
                    currentPageLabel="Page"
                />
            );
            expect(container.querySelector(".breadcrumbs-element")).toBeInTheDocument();
        });
    });
});
