import React, { forwardRef, useCallback, useRef, useState } from "react";
import { graphql } from "react-relay";
import {LysMutationProvider} from "lys-front/providers";
import { LysMutationRefInterface } from "lys-front/providers";
import TextareaWithAiElement from "@/components/elements/TextareaWithAiElement";
import { TextareaWithAiRestrictedProps } from "./types";

/**
 * TextareaWithAiRestricted component
 *
 * Restricted feature component (Layer 3) that wraps TextareaWithAiElement
 * with AI improvement mutation and undo/redo state management.
 */
const TextareaWithAiRestricted = forwardRef<HTMLInputElement, TextareaWithAiRestrictedProps>(
    (
        {
            value,
            onChange,
            aiContext,
            aiLanguage = "fr",
            maxLength,
            disabled,
            ...props
        },
        ref
    ) => {
        // Mutation ref
        const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);

        // Undo/Redo state
        const originalTextRef = useRef<string | null>(null);
        const improvedTextRef = useRef<string | null>(null);
        const [textState, setTextState] = useState<"original" | "improved" | "typing">("typing");

        /**
         * Handle improve button click
         */
        const handleImprove = useCallback(() => {
            if (!mutationRef?.commit || !value) return;

            // Store original text
            originalTextRef.current = String(value);

            mutationRef.commit({
                variables: {
                    inputs: {
                        text: String(value),
                        context: aiContext || null,
                        language: aiLanguage,
                        maxLength: maxLength || null,
                    }
                },
                onCompleted: (response: any) => {
                    if (response?.improveText?.improvedText) {
                        const improved = response.improveText.improvedText;
                        improvedTextRef.current = improved;
                        setTextState("improved");

                        // Trigger onChange with improved text
                        if (onChange) {
                            const syntheticEvent = {
                                target: { value: improved }
                            } as React.ChangeEvent<HTMLInputElement>;
                            onChange(syntheticEvent);
                        }
                    }
                },
            });
        }, [mutationRef, value, aiContext, aiLanguage, maxLength, onChange]);

        /**
         * Handle undo button click
         */
        const handleUndo = useCallback(() => {
            if (originalTextRef.current === null) return;

            // Restore original text
            if (onChange) {
                const syntheticEvent = {
                    target: { value: originalTextRef.current }
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
            }

            setTextState("original");
        }, [onChange]);

        /**
         * Handle redo button click
         */
        const handleRedo = useCallback(() => {
            if (improvedTextRef.current === null) return;

            // Restore improved text
            if (onChange) {
                const syntheticEvent = {
                    target: { value: improvedTextRef.current }
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
            }

            setTextState("improved");
        }, [onChange]);

        /**
         * Handle user typing - reset undo/redo state
         */
        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            // Reset undo/redo on user edit
            if (textState !== "typing") {
                originalTextRef.current = null;
                improvedTextRef.current = null;
                setTextState("typing");
            }

            if (onChange) {
                onChange(e);
            }
        }, [onChange, textState]);

        const canUndo = textState === "improved";
        const canRedo = textState === "original" && improvedTextRef.current !== null;

        return (
            <LysMutationProvider
                mutation={graphql`
                    mutation TextareaWithAiRestrictedMutation($inputs: ImproveTextInput!) {
                        improveText(inputs: $inputs) {
                            improvedText
                            message
                        }
                    }
                `}
                ref={setMutationRef}
                notPermissionDisplayType="show"
            >
                <TextareaWithAiElement
                    ref={ref}
                    value={value}
                    onChange={handleChange}
                    onImprove={handleImprove}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    isImproving={mutationRef?.isInFlight || false}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    hideAiButton={!mutationRef?.commit}
                    maxLength={maxLength}
                    disabled={disabled}
                    {...props}
                />
            </LysMutationProvider>
        );
    }
);

TextareaWithAiRestricted.displayName = "TextareaWithAiRestricted";

export default TextareaWithAiRestricted;