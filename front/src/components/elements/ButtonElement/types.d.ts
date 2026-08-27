import * as React from "react";
import {ReactNode} from "react";

/**
 * Button variant types
 */
export type ButtonVariant =
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "link"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger"
    | "outline-warning"
    | "outline-info"
    | "outline-light"
    | "outline-dark";

/**
 * Button size types
 */
export type ButtonSize = "sm" | "lg";

/**
 * Props for the ButtonElement component
 */
export interface ButtonElementProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual variant of the button
     */
    variant?: ButtonVariant;

    /**
     * Size of the button
     */
    size?: ButtonSize;

    /**
     * Whether the button is in loading state
     */
    isLoading?: boolean;

    /**
     * Icon to display on the left side
     */
    leftIcon?: ReactNode;

    /**
     * Icon to display on the right side
     */
    rightIcon?: ReactNode;

    /**
     * Button content
     */
    children?: ReactNode;

    /**
     * Make button full width
     */
    fullWidth?: boolean;
}