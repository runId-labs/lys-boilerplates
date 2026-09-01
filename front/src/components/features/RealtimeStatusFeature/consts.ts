/**
 * Delay before an interrupted connection is shown.
 *
 * EventSource absorbs short drops on its own, and so does the provider's first
 * reconnection attempt. Showing the indicator immediately would make it blink on
 * outages the user never had to know about.
 */
export const OFFLINE_DISPLAY_DELAY_MS = 10000;
