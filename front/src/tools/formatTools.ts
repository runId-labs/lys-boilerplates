/**
 * Shared formatting utilities for financial data display.
 */

const LOCALE = "fr-FR";

/**
 * Format a number or string value as percentage (e.g., "12.3%")
 */
export const formatPercent = (value: number | string | null | undefined, fallback: string = "-"): string => {
    if (value === null || value === undefined) return fallback;
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return fallback;
    return `${num.toFixed(1)}%`;
};

/**
 * Format an ISO date string as a long French date (e.g. "20 juin 2026").
 */
export const formatDateFr = (value: string | null | undefined, fallback: string = "-"): string => {
    if (!value) return fallback;
    const date = new Date(value);
    if (isNaN(date.getTime())) return fallback;
    return new Intl.DateTimeFormat(LOCALE, {day: "numeric", month: "long", year: "numeric"}).format(date);
};

/**
 * Format a number or string value as currency (EUR, no decimals)
 */
export const formatCurrency = (value: number | string | null | undefined, fallback: string = "-"): string => {
    if (value === null || value === undefined) return fallback;
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return fallback;
    return new Intl.NumberFormat(LOCALE, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
    }).format(num);
};

/**
 * Format a licensing price given in the minor unit of its currency
 *
 * The API returns an integer amount and the currency it is expressed in, so
 * the grouping, the decimals and the symbol placement are a display concern,
 * settled here by the locale. Whole amounts keep no decimals: an offer priced
 * at 7 900 € reads better than 7 900,00 €.
 */
export const formatPrice = (
    amount: number | null | undefined,
    currencyCode: string,
    minorUnit: number,
    fallback: string = "-"
): string => {
    if (amount === null || amount === undefined) return fallback;

    const value = amount / Math.pow(10, minorUnit);

    return new Intl.NumberFormat(LOCALE, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: Number.isInteger(value) ? 0 : minorUnit,
        maximumFractionDigits: minorUnit
    }).format(value);
};

/**
 * Format a number with French locale
 */
export const formatNumber = (value: number, decimals: number = 1): string => {
    return new Intl.NumberFormat(LOCALE, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
    }).format(value);
};

/**
 * Parse a "YYYY-MM-DD" date string without timezone conversion.
 * Using new Date("YYYY-MM-DD") creates a UTC date that can shift
 * day/month when read with local getters in negative UTC offsets.
 */
export const parseDateParts = (dateStr: string): { year: number; month: number; day: number } => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return { year: y, month: m, day: d };
};

/**
 * Neutral trend result used when comparison is not meaningful (partial year).
 */
export const NEUTRAL_TREND: TrendResult = {direction: "neutral", value: "-"};

/**
 * Trend direction indicator
 */
export interface TrendResult {
    direction: "up" | "down" | "neutral";
    value: string;
}

/**
 * Calculate trend indicator between current and previous year values
 */
export const calculateTrend = (
    current: string | null,
    previous: string | null,
    decimals: number = 0
): TrendResult => {
    if (!current || !previous) {
        return {direction: "neutral", value: "-"};
    }
    const curr = parseFloat(current);
    const prev = parseFloat(previous);

    if (prev === 0) {
        return {direction: "neutral", value: "-"};
    }

    const change = ((curr - prev) / Math.abs(prev)) * 100;
    const sign = change >= 0 ? "+" : "";
    const direction = change > 0 ? "up" : change < 0 ? "down" : "neutral";

    return {
        direction,
        value: `${sign}${change.toFixed(decimals)}%`
    };
};
