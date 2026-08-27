import { cva } from "class-variance-authority"

/**
 * Offcanvas width variants based on screen size
 */
export const offCanvasElementVariants = cva(
    undefined,
    {
        variants: {
            size: {
                "sm": "w-lg-25 w-md-33 w-sm-100",
                "md": "w-lg-33 w-md-50 w-sm-100",
                "lg": "w-lg-50 w-md-66 w-sm-100",
                "xl": "w-lg-75 w-md-75 w-sm-100",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
)