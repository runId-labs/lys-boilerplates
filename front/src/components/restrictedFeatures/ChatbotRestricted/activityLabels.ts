/**
 * Maps assistant tool names to the translation key describing them in business wording.
 *
 * The tool names themselves must never be shown: they mean nothing to a user.
 * Unknown tools fall back to a generic label rather than leaking their technical name.
 *
 * The mapping is project-supplied (the tools depend on the backend's AI webservice
 * configuration); see the activityLabelKeys prop of ChatbotRestricted.
 */
export const GENERIC_ACTIVITY_LABEL_KEY = "activityGeneric";

/**
 * Rough token count from a character count, for the live "thinking" indicator.
 *
 * The stream carries text, not token counts — the real figure only lands in the final usage
 * payload. French averages close to four characters per token, which is accurate enough for
 * a progress indicator whose only job is to prove the stream is alive.
 */
export function estimateTokens(characters: number): number {
    return Math.round(characters / 4);
}
