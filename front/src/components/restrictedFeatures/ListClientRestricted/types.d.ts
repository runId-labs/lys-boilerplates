/**
 * Props for ListClientRestricted component
 */
export interface ListClientRestrictedProps {
    // No props needed - component is self-contained
}

/**
 * One request of a client still waiting for an action, as shown on hover.
 *
 * Codes rather than labels: the API owns the vocabulary, the front translates it and
 * falls back to the raw code so a new type shows up instead of disappearing.
 */
export interface OpenRequestRow {
    id: string;
    typeId: string;
    statusId: string;
    createdAt: string;
}
