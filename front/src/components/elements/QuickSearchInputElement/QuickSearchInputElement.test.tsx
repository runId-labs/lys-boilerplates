import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {screen, fireEvent} from "@testing-library/react";
import renderWithIntl from "@/test/utils";
import QuickSearchInputElement from "./index";

describe("QuickSearchInputElement", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("Rendering", () => {
        it("renders with placeholder", () => {
            renderWithIntl(
                <QuickSearchInputElement
                    value=""
                    onChange={() => {}}
                    placeholder="Search..."
                />
            );
            expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
        });

        it("renders search icon", () => {
            renderWithIntl(
                <QuickSearchInputElement
                    value=""
                    onChange={() => {}}
                    placeholder="Search"
                />
            );
            expect(document.querySelector(".bi-search")).toBeInTheDocument();
        });

        it("renders with initial value", () => {
            renderWithIntl(
                <QuickSearchInputElement
                    value="test query"
                    onChange={() => {}}
                    placeholder="Search"
                />
            );
            expect(screen.getByDisplayValue("test query")).toBeInTheDocument();
        });

        it("applies custom className", () => {
            renderWithIntl(
                <QuickSearchInputElement
                    value=""
                    onChange={() => {}}
                    placeholder="Search"
                    className="custom-class"
                />
            );
            expect(document.querySelector(".custom-class")).toBeInTheDocument();
        });
    });

    describe("Clear button", () => {
        it("does not show clear button when empty", () => {
            renderWithIntl(
                <QuickSearchInputElement
                    value=""
                    onChange={() => {}}
                    placeholder="Search"
                />
            );
            expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
        });

        it("shows clear button when has value", () => {
            renderWithIntl(
                <QuickSearchInputElement
                    value="test"
                    onChange={() => {}}
                    placeholder="Search"
                />
            );
            expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
        });

        it("clears input on clear button click", () => {
            const handleChange = vi.fn();
            renderWithIntl(
                <QuickSearchInputElement
                    value="test"
                    onChange={handleChange}
                    placeholder="Search"
                />
            );
            fireEvent.click(screen.getByLabelText("Clear search"));
            expect(handleChange).toHaveBeenCalledWith("");
        });
    });

    describe("Debounce", () => {
        it("debounces onChange calls", async () => {
            const handleChange = vi.fn();
            renderWithIntl(
                <QuickSearchInputElement
                    value=""
                    onChange={handleChange}
                    placeholder="Search"
                    debounce={400}
                />
            );

            const input = screen.getByPlaceholderText("Search");
            fireEvent.change(input, {target: {value: "test"}});

            // Should not be called immediately
            expect(handleChange).not.toHaveBeenCalled();

            // Fast forward past debounce time
            vi.advanceTimersByTime(400);

            expect(handleChange).toHaveBeenCalledWith("test");
        });

        it("uses custom debounce time", async () => {
            const handleChange = vi.fn();
            renderWithIntl(
                <QuickSearchInputElement
                    value=""
                    onChange={handleChange}
                    placeholder="Search"
                    debounce={200}
                />
            );

            const input = screen.getByPlaceholderText("Search");
            fireEvent.change(input, {target: {value: "test"}});

            vi.advanceTimersByTime(199);
            expect(handleChange).not.toHaveBeenCalled();

            vi.advanceTimersByTime(1);
            expect(handleChange).toHaveBeenCalledWith("test");
        });

        it("cancels previous debounce on new input", () => {
            const handleChange = vi.fn();
            renderWithIntl(
                <QuickSearchInputElement
                    value=""
                    onChange={handleChange}
                    placeholder="Search"
                    debounce={400}
                />
            );

            const input = screen.getByPlaceholderText("Search");

            fireEvent.change(input, {target: {value: "tes"}});
            vi.advanceTimersByTime(200);

            fireEvent.change(input, {target: {value: "test"}});
            vi.advanceTimersByTime(400);

            // Should only be called once with final value
            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange).toHaveBeenCalledWith("test");
        });

        it("trims whitespace from value", () => {
            const handleChange = vi.fn();
            renderWithIntl(
                <QuickSearchInputElement
                    value=""
                    onChange={handleChange}
                    placeholder="Search"
                    debounce={400}
                />
            );

            const input = screen.getByPlaceholderText("Search");
            fireEvent.change(input, {target: {value: "  test  "}});
            vi.advanceTimersByTime(400);

            expect(handleChange).toHaveBeenCalledWith("test");
        });
    });

    describe("Value sync", () => {
        it("syncs local value with prop value", () => {
            const {rerender} = renderWithIntl(
                <QuickSearchInputElement
                    value="initial"
                    onChange={() => {}}
                    placeholder="Search"
                />
            );

            expect(screen.getByDisplayValue("initial")).toBeInTheDocument();

            rerender(
                <QuickSearchInputElement
                    value="updated"
                    onChange={() => {}}
                    placeholder="Search"
                />
            );

            expect(screen.getByDisplayValue("updated")).toBeInTheDocument();
        });
    });
});
