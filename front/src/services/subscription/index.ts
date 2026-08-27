/**
 * Subscription commercial flow, outside the payment provider.
 *
 * Until a payment provider is configured, a client cannot check out on their own: they
 * ask for a quote and an administrator subscribes them manually.
 *
 * The quote request itself is a GraphQL mutation, not a call from here: it is recorded
 * server-side before anything is notified, so a request survives the automation that
 * handles it.
 */

/**
 * Whether the platform can collect a payment by itself
 *
 * Build-time switch, mirroring the payment plugin configuration of the API:
 * the provider is only configured when its API key is set. The safe default is
 * off, since announcing a checkout that cannot complete costs more than
 * offering a quote to a client who could have paid straight away.
 */
export const isPaymentProviderEnabled = import.meta.env.VITE_PAYMENT_PROVIDER_ENABLED === "true";
