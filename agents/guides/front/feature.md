# How to build a feature (Layer 2)

Reference implementations to read first: `features/FormFeature/` (composition +
validation + AI textarea integration) and `features/NotificationListFeature/`
(feature owning its GraphQL through providers).

## RULES

- **R1 — Business logic, no permissions.** A feature composes elements and other
  features, holds state and callbacks. It NEVER decides "is the user allowed to
  see this" — the restrictedFeature that mounts it does (via the providers, which
  render nothing without access).
- **R2 — Callbacks over data-fetching.** When the same UI can be driven by
  props, prefer props: mutations/queries are injected by the restrictedFeature
  (reference: `features/ChatbotProposalFeature` receives everything through
  props). A feature MAY own its providers when the data is inherently its own
  (reference: `features/NotificationListFeature`).
- **R3 — Alert through the provider, never `alert()`.** User feedback goes
  through `useAlertMessages()` with an error KEY translated by
  `AlertMessageFeature` (see `translations.md` → errors).
- **R4 — Naming + registry.** `PascalCase + Feature`; `translations.ts` config
  registered in `features/index.ts`.
- **R5 — Project-generic vocabulary only in `translations.ts`.** Same
  discipline as elements: en + fr for every user-visible string.

## PROCEDURE

1. **Skeleton**:
   ```
   features/MyDomainFeature/
     index.tsx        the composition + logic
     types.ts|.d.ts   props + internal types
     translations.ts  component strings (en/fr) — always create it for the registry key
     hooks/           only if a non-trivial hook emerges (see NavBarFeature/hooks/)
     styles.scss      if needed
   ```
2. **Compose**: import elements via `@/components/elements/X`; restrictedFeatures
   via `@/components/restrictedFeatures/Y` when the feature genuinely embeds a
   permission-bearing unit (precedent: `FormFeature` → `TextareaWithAiRestricted`).
3. **State and callbacks**: `useState`/`useCallback` for local interaction;
   `onCompleted`/`onError` style callbacks for the caller to react to outcomes.
4. **Translations** (see `translations.md`): keys in en+fr; error codes the
   backend can return go to `services/i18n/errors.ts` instead.
5. **Registry**: `features/index.ts` entry.
6. **Self-check**: verification.md F1–F4 (F1 if the feature added `graphql\`` tags).

## ✅ / ❌

| ✅ | ❌ |
|----|----|
| `<UserFormFeature onCompleted={…} isLoading={mutation.isInFlight}>` | The feature calling `usePermissionCheck` to hide a section |
| `alertMessage.merge([{text: "MY_ERROR_KEY", level: "ERROR"}])` | `window.alert("ça a échoué")` |
| Data table built from `TableElement` + row generators | Copying table markup into the feature |
| `const {t} = useMyDomainFeatureTranslations()` for labels | Labels in French inline in JSX |
