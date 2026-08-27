import {describe, it, expect, vi} from "vitest";
import {render, screen, fireEvent} from "@testing-library/react";
import SelectElement from "./index";

const basicOptions = [
    {value: "option1", label: "Option 1"},
    {value: "option2", label: "Option 2"},
    {value: "option3", label: "Option 3"}
];

const groupedOptions = [
    {
        label: "Group 1",
        options: [
            {value: "g1-opt1", label: "Group 1 Option 1"},
            {value: "g1-opt2", label: "Group 1 Option 2"}
        ]
    },
    {
        label: "Group 2",
        options: [
            {value: "g2-opt1", label: "Group 2 Option 1"},
            {value: "g2-opt2", label: "Group 2 Option 2"}
        ]
    }
];

describe("SelectElement", () => {
    describe("Rendering", () => {
        it("renders with label", () => {
            render(<SelectElement id="test" label="Test Label" options={basicOptions} />);
            expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
        });

        it("renders with correct id", () => {
            render(<SelectElement id="test-select" label="Label" options={basicOptions} />);
            expect(screen.getByRole("combobox")).toHaveAttribute("id", "test-select");
        });

        it("renders all options", () => {
            render(<SelectElement id="test" label="Label" options={basicOptions} />);
            expect(screen.getByRole("option", {name: "Option 1"})).toBeInTheDocument();
            expect(screen.getByRole("option", {name: "Option 2"})).toBeInTheDocument();
            expect(screen.getByRole("option", {name: "Option 3"})).toBeInTheDocument();
        });

        it("renders with selected value", () => {
            render(
                <SelectElement
                    id="test"
                    label="Label"
                    options={basicOptions}
                    value="option2"
                    onChange={() => {}}
                />
            );
            expect(screen.getByRole("combobox")).toHaveValue("option2");
        });
    });

    describe("Nullable option", () => {
        it("does not show nullable option by default", () => {
            render(<SelectElement id="test" label="Label" options={basicOptions} />);
            const options = screen.getAllByRole("option");
            expect(options.length).toBe(3);
        });

        it("shows nullable option when enabled", () => {
            render(<SelectElement id="test" label="Label" options={basicOptions} nullable />);
            const options = screen.getAllByRole("option");
            expect(options.length).toBe(4);
            expect(options[0]).toHaveValue("");
        });

        it("uses custom nullable label", () => {
            render(
                <SelectElement
                    id="test"
                    label="Label"
                    options={basicOptions}
                    nullable
                    nullableLabel="Select..."
                />
            );
            expect(screen.getByRole("option", {name: "Select..."})).toBeInTheDocument();
        });
    });

    describe("Grouped options", () => {
        it("renders option groups", () => {
            render(<SelectElement id="test" label="Label" options={groupedOptions} />);
            expect(screen.getByRole("group", {name: "Group 1"})).toBeInTheDocument();
            expect(screen.getByRole("group", {name: "Group 2"})).toBeInTheDocument();
        });

        it("renders options within groups", () => {
            render(<SelectElement id="test" label="Label" options={groupedOptions} />);
            expect(screen.getByRole("option", {name: "Group 1 Option 1"})).toBeInTheDocument();
            expect(screen.getByRole("option", {name: "Group 2 Option 2"})).toBeInTheDocument();
        });
    });

    describe("States", () => {
        it("renders disabled select", () => {
            render(<SelectElement id="test" label="Label" options={basicOptions} disabled />);
            expect(screen.getByRole("combobox")).toBeDisabled();
        });

        it("renders required select", () => {
            render(<SelectElement id="test" label="Label" options={basicOptions} required />);
            expect(screen.getByRole("combobox")).toBeRequired();
        });

        it("shows error message", () => {
            render(
                <SelectElement
                    id="test"
                    label="Label"
                    options={basicOptions}
                    error="Please select an option"
                />
            );
            expect(screen.getByText("Please select an option")).toBeInTheDocument();
        });

        it("shows helper text", () => {
            render(
                <SelectElement
                    id="test"
                    label="Label"
                    options={basicOptions}
                    helperText="Choose one option"
                />
            );
            expect(screen.getByText("Choose one option")).toBeInTheDocument();
        });
    });

    describe("Events", () => {
        it("calls onChange when selection changes", () => {
            const handleChange = vi.fn();
            render(
                <SelectElement
                    id="test"
                    label="Label"
                    options={basicOptions}
                    onChange={handleChange}
                />
            );
            fireEvent.change(screen.getByRole("combobox"), {target: {value: "option2"}});
            expect(handleChange).toHaveBeenCalled();
        });
    });

    describe("Floating label", () => {
        it("renders with floating label", () => {
            render(
                <SelectElement
                    id="test"
                    label="Float Label"
                    options={basicOptions}
                    isFloatingLabel
                />
            );
            expect(screen.getByLabelText("Float Label")).toBeInTheDocument();
        });
    });

    describe("Ref forwarding", () => {
        it("forwards ref to select element", () => {
            const ref = vi.fn();
            render(<SelectElement id="test" label="Label" options={basicOptions} ref={ref} />);
            expect(ref).toHaveBeenCalled();
            expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLSelectElement);
        });
    });
});
