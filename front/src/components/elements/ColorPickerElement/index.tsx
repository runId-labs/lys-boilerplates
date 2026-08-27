import React, {useCallback} from "react";
import {Form, InputGroup} from "react-bootstrap";
import {ColorPickerElementProps} from "./types";
import {useColorPickerElementTranslations} from "./translations";
import "./styles.scss";

const DEFAULT_COLOR = "#3B82F6";

/**
 * Validate and normalize a hex color string
 */
const normalizeHex = (hex: string): string => {
    const cleaned = hex.replace(/[^0-9a-fA-F]/g, "").substring(0, 6);
    return cleaned;
};

/**
 * ColorPickerElement component
 *
 * Reusable color input combining a native OS color picker (color wheel)
 * with a hex text input. Both inputs are synchronized.
 *
 * Compatible with FormFeature's type: "custom" pattern.
 */
const ColorPickerElement: React.FC<ColorPickerElementProps> = ({
    id,
    value,
    onChange,
    disabled = false,
    error
}) => {
    const currentColor = value || DEFAULT_COLOR;
    const hexWithoutHash = currentColor.replace("#", "");
    const {t} = useColorPickerElementTranslations();

    /**
     * Handle native color picker change
     */
    const handleSwatchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    /**
     * Handle hex text input change
     */
    const handleHexChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = normalizeHex(e.target.value);
        if (raw.length === 6) {
            onChange(`#${raw}`);
        } else if (raw.length < 6) {
            // Allow partial input — only emit padded value for the swatch preview
            onChange(`#${raw.padEnd(6, "0")}`);
        }
    }, [onChange]);

    return (
        <div>
            <div className="color-picker">
                <input
                    type="color"
                    id={id ? `${id}-swatch` : undefined}
                    className="color-picker__swatch"
                    value={currentColor}
                    onChange={handleSwatchChange}
                    disabled={disabled}
                    aria-label={t("colorPickerAriaLabel")}
                />
                <InputGroup className="color-picker__hex-input">
                    <InputGroup.Text>#</InputGroup.Text>
                    <Form.Control
                        id={id}
                        type="text"
                        value={hexWithoutHash}
                        onChange={handleHexChange}
                        disabled={disabled}
                        maxLength={6}
                        placeholder="3B82F6"
                        isInvalid={!!error}
                        aria-label={t("hexColorCodeAriaLabel")}
                    />
                </InputGroup>
            </div>
            {error && (
                <Form.Text className="text-danger">{error}</Form.Text>
            )}
        </div>
    );
};

ColorPickerElement.displayName = "ColorPickerElement";

export default ColorPickerElement;
