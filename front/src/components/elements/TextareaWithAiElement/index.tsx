import React, { useState, useRef, useEffect, useCallback } from "react";
import InputElement from "@/components/elements/InputElement";
import ButtonElement from "@/components/elements/ButtonElement";
import { TextareaWithAiElementProps } from "./types";
import { useTextareaWithAiElementTranslations } from "./translations";
import { Form } from "react-bootstrap";
import "./styles.scss";

const ENLARGED_MIN_HEIGHT = 350;

/**
 * TextareaWithAiElement component
 *
 * Element component (Layer 1) that renders a textarea with AI improvement buttons.
 * Includes an "Enlarge/Reduce" toggle to expand the textarea for better editing.
 */
const TextareaWithAiElement = React.forwardRef<HTMLInputElement, TextareaWithAiElementProps>(
    (
        {
            id,
            label,
            onImprove,
            onUndo,
            onRedo,
            isImproving = false,
            canUndo = false,
            canRedo = false,
            hideAiButton = false,
            disabled,
            value,
            onChange,
            required,
            error,
            helperText,
            ...props
        },
        ref
    ) => {
        const { t } = useTextareaWithAiElementTranslations();
        const [isEnlarged, setIsEnlarged] = useState(false);
        const [textareaHeight, setTextareaHeight] = useState(0);
        const containerRef = useRef<HTMLDivElement>(null);

        // Measure textarea height
        const updateTextareaHeight = useCallback(() => {
            if (containerRef.current) {
                const textarea = containerRef.current.querySelector("textarea");
                if (textarea) {
                    setTextareaHeight(textarea.offsetHeight);
                }
            }
        }, []);

        // Update height on value change and after render
        useEffect(() => {
            updateTextareaHeight();
        }, [value, updateTextareaHeight]);

        // Also update on window resize
        useEffect(() => {
            window.addEventListener("resize", updateTextareaHeight);
            return () => window.removeEventListener("resize", updateTextareaHeight);
        }, [updateTextareaHeight]);

        const hasValue = value !== undefined && value !== null && value !== "";
        const showEnlargeButton = !isEnlarged && textareaHeight < ENLARGED_MIN_HEIGHT;
        const showImproveButton = !hideAiButton && !canUndo && !canRedo;
        const showUndoButton = !hideAiButton && canUndo;
        const showRedoButton = !hideAiButton && canRedo;
        const showButtons = !disabled && !hideAiButton;

        return (
            <div ref={containerRef} className={`textarea-with-ai ${isEnlarged ? "textarea-with-ai--enlarged" : ""}`}>
                {!isEnlarged ? (
                    <InputElement
                        ref={ref}
                        id={id}
                        label={label}
                        as="textarea"
                        value={value}
                        onChange={onChange}
                        disabled={disabled || isImproving}
                        required={required}
                        error={error}
                        helperText={helperText}
                        {...props}
                    />
                ) : (
                    <div className="textarea-enlarged-wrapper">
                        <label className="form-label" htmlFor={id}>
                            {label}{required && " *"}
                        </label>
                        <Form.Control
                            ref={ref as any}
                            id={id}
                            as="textarea"
                            value={value ?? ""}
                            onChange={onChange as any}
                            disabled={disabled || isImproving}
                            required={required}
                            isInvalid={!!error}
                            className="textarea-enlarged-input"
                            rows={15}
                        />
                        {error && <div className="invalid-feedback d-block">{error}</div>}
                        {helperText && !error && <div className="form-text">{helperText}</div>}
                    </div>
                )}
                {showButtons && (
                    <div className="textarea-ai-actions">
                        {showImproveButton && (
                            <ButtonElement
                                variant="outline-primary"
                                size="sm"
                                onClick={onImprove}
                                disabled={isImproving || !hasValue}
                                isLoading={isImproving}
                                className="ai-improve-btn"
                                aria-label={t("improve")}
                            >
                                <i className="bi bi-magic me-1"></i>
                                {t("improve")}
                            </ButtonElement>
                        )}
                        {showUndoButton && (
                            <ButtonElement
                                variant="outline-secondary"
                                size="sm"
                                onClick={onUndo}
                                disabled={isImproving}
                                className="ai-undo-btn"
                                aria-label={t("undo")}
                            >
                                <i className="bi bi-arrow-counterclockwise me-1"></i>
                                {t("undo")}
                            </ButtonElement>
                        )}
                        {showRedoButton && (
                            <ButtonElement
                                variant="outline-secondary"
                                size="sm"
                                onClick={onRedo}
                                disabled={isImproving}
                                className="ai-redo-btn"
                                aria-label={t("redo")}
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                {t("redo")}
                            </ButtonElement>
                        )}
                        {(showEnlargeButton || isEnlarged) && (
                            <ButtonElement
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setIsEnlarged(!isEnlarged)}
                                disabled={isImproving}
                                className="ai-enlarge-btn"
                                aria-label={isEnlarged ? t("reduce") : t("enlarge")}
                            >
                                <i className={`bi ${isEnlarged ? "bi-arrows-angle-contract" : "bi-arrows-fullscreen"} me-1`}></i>
                                {isEnlarged ? t("reduce") : t("enlarge")}
                            </ButtonElement>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

TextareaWithAiElement.displayName = "TextareaWithAiElement";

export default TextareaWithAiElement;