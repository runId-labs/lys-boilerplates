import React from "react";
import ButtonElement from "@/components/elements/ButtonElement";
import {DecisionButtonsElementProps} from "./types";

/**
 * DecisionButtonsElement
 *
 * Element component (Layer 1): a validate (green check) and a reject (red cross)
 * button for a single row. The active decision's button is filled, the other is
 * outline, so the current state is visible and a mis-click is correctable by
 * pressing the other button. Pure UI — the parent owns the decision logic.
 */
const DecisionButtonsElement: React.FC<DecisionButtonsElementProps> = ({
    decision = null,
    onValidate,
    onReject,
    disabled = false,
    validateLabel,
    rejectLabel,
}) => (
    <div className="d-flex gap-1">
        <ButtonElement
            variant={decision === "VALIDATED" ? "success" : "outline-success"}
            size="sm"
            onClick={onValidate}
            disabled={disabled}
            title={validateLabel}
            aria-label={validateLabel}
        >
            <i className="bi bi-check-lg" aria-hidden="true" />
        </ButtonElement>
        <ButtonElement
            variant={decision === "REJECTED" ? "danger" : "outline-danger"}
            size="sm"
            onClick={onReject}
            disabled={disabled}
            title={rejectLabel}
            aria-label={rejectLabel}
        >
            <i className="bi bi-x-lg" aria-hidden="true" />
        </ButtonElement>
    </div>
);

DecisionButtonsElement.displayName = "DecisionButtonsElement";

export default DecisionButtonsElement;
