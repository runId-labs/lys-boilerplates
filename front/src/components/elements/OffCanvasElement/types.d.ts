import { ReactElement, ReactNode } from "react"
import { OffcanvasProps } from "react-bootstrap"
import { type VariantProps } from "class-variance-authority"
import { offCanvasElementVariants } from "./utils"

/**
 * Ref interface for OffCanvasElement
 */
export interface OffCanvasElementRefInterface {
    shown: boolean | null
    show(): void
    hide(): void
}

/**
 * Props for OffCanvasElement
 */
export interface OffCanvasElementProps extends OffcanvasProps, VariantProps<typeof offCanvasElementVariants> {
    id: string
    title?: ReactElement | string | undefined
    body: ReactNode
}