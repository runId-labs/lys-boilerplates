/**
 * Local decision state of a row: validated, rejected, or undecided (null).
 */
export type RowDecision = "VALIDATED" | "REJECTED" | null;

/**
 * Props for the DecisionButtonsElement component
 */
export interface DecisionButtonsElementProps {
    /**
     * Current decision — drives which button is filled (active) vs outline.
     */
    decision?: RowDecision;

    /**
     * Called when the validate (green check) button is clicked.
     */
    onValidate: () => void;

    /**
     * Called when the reject (red cross) button is clicked.
     */
    onReject: () => void;

    /**
     * Disable both buttons (e.g. while a decision is in flight).
     */
    disabled?: boolean;

    /**
     * Accessible label / tooltip for the validate button.
     */
    validateLabel?: string;

    /**
     * Accessible label / tooltip for the reject button.
     */
    rejectLabel?: string;
}
