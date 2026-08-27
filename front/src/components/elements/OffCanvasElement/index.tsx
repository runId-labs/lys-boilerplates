import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { Offcanvas } from "react-bootstrap"
import { OffCanvasElementProps, OffCanvasElementRefInterface } from "./types"
import { offCanvasElementVariants } from "./utils"
import { cn } from "lys-front/tools"

/**
 * OffCanvasElement
 *
 * Pure UI wrapper around react-bootstrap Offcanvas
 * No business logic, just presentation
 */
const OffCanvasElement = React.forwardRef<
    OffCanvasElementRefInterface,
    OffCanvasElementProps
>((
    {
        id,
        title,
        placement = "end",
        size,
        body,
        ...offcanvasProps
    },
    ref
) => {

    /*******************************************************************************************************************
     *                                                  STATES
     ******************************************************************************************************************/

    const [shown, setShown] = useState<boolean | null>(null)

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    const show = useCallback(() => {
        setShown(true)
    }, [])

    const hide = useCallback(() => {
        setShown(false)
    }, [])

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    useEffect(() => {
        const data = {
            shown,
            show,
            hide
        }

        if (typeof ref === 'function') {
            ref(data)
        } else if (ref) {
            ref.current = data
        }
    }, [shown, show, hide, ref])

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <Offcanvas
            className={cn(offCanvasElementVariants({ size }))}
            placement={placement}
            show={!!shown}
            onHide={hide}
            enforceFocus={false}
            {...offcanvasProps}
        >
            <Offcanvas.Header
                closeButton
            >
                <Offcanvas.Title>
                    {title}
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body
                id={id}
            >
                {body}
            </Offcanvas.Body>
        </Offcanvas>
    )
})

OffCanvasElement.displayName = "OffCanvasElement"

export default OffCanvasElement