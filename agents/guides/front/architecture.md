# Front architecture — the four layers

Read this before building any front component. It defines what each layer may
and may not do; the linter (`npm run lint:boundaries`) enforces the import rules.

## Layers and flow

```
elements (BadgeElement, InputElement, TableElement…)
    ↓ consumed by
features (FormFeature, ListFeature, NavBarFeature…)
    ↓ consumed by
restrictedFeatures (GetClientRestricted, ChatbotRestricted…)
    ↓ consumed by
pages (ListClientPage, LoginPage…)
```

A layer may only import **downwards** (an element imports elements; a feature
imports elements/features/restrictedFeatures; a page imports anything). Never
upwards.

## Layer 1 — `src/components/elements/`

**Pure UI. No business logic.**

- ✅ props-driven rendering, bootstrap/react-bootstrap wrappers, design tokens
  (`var(--lys-*)`, `var(--bs-*)`), cross-element imports, `cn` from `lys-front/tools`
- ❌ GraphQL (`graphql\`` tag, `react-relay`), providers from `lys-front/providers`
  (the ONLY exception: a `translations.ts` hook — see `translations.md`),
  permission checks, project services (`@/services/**`), fetch/axios, business
  vocabulary in code or labels
- Reference implementations: `elements/CardElement` (variants, scss, test, story),
  `elements/EnumBadgeElement` (config-driven component + test + story).

## Layer 2 — `src/components/features/`

**Business logic and composition, permissions-free.**

- ✅ assembles elements and other features, local state, callbacks as props,
  co-located `translations.ts`, may host `graphql\`` operations mounted through
  `LysQueryProvider`/`LysMutationProvider` (reference: `features/NotificationListFeature`)
- ❌ importing pages, deciding visibility from permissions (that is Layer 3's job —
  a feature receives callbacks and renders, the caller decides)
- Reference implementations: `features/FormFeature` (composition + validation),
  `features/AlertMessageFeature` (provider-driven rendering).

## Layer 3 — `src/components/restrictedFeatures/`

**Permissions + data.** Owns the GraphQL operations that touch protected data and
the permission-conditional rendering (`LysQueryProvider`/`LysMutationProvider`
render nothing when the connected user lacks the webservice access — that IS the
permission check).

- ✅ Relay fragments/queries/mutations, `lys-front/providers` hooks
  (`useConnectedUserInfo`, `useAlertMessages`, `useClientId`…), wraps a Layer-2
  feature for the actual UI, ref API exposing `hasPermission`
- ❌ importing pages, duplicating UI that belongs in a feature/element
- Reference implementations: `restrictedFeatures/GetClientRestricted` (query +
  feature composition), `restrictedFeatures/ListClientRestricted` (connection,
  pagination, table).

## Layer 4 — `src/components/pages/`

**Routes.** A page = `config.ts` (route description consumed by the router and
the chatbot manifest) + `index.tsx` (thin composition of restrictedFeatures) +
`translation.ts`. See `page.md`.

## Naming (strict, the type inference in translations depends on it)

| Layer | Directory | Component name |
|-------|-----------|----------------|
| 1 | `elements/ButtonElement/` | `ButtonElement` |
| 2 | `features/LoginFeature/` | `LoginFeature` |
| 3 | `restrictedFeatures/GetClientRestricted/` | `GetClientRestricted` |
| 4 | `pages/ListClientPage/` | `ListClientPage` |

The suffix IS the layer. `createComponentTranslations` infers the registry key
from it (`ButtonElement` → `lys.components.elements.buttonElement.*`) — a wrong
suffix breaks i18n silently.

## Panels and the shell (follow-up reading)

Components are often mounted in **dialog panels** outside their tree — read
`dialog.md` before building anything that opens in a drawer. The provider
stack, navigation configs and multi-client focus are covered in
`app-shell.md`; tests and stories in `testing.md`; page layouts in
`page-template.md`.

## Registries

`src/index.ts` builds the `lys` descriptor from the registries
(`elements/index.ts`, `features/index.ts`, `restrictedFeatures/index.ts`,
`pages/index.ts`). **A component with a `translations.ts` must be registered in
its layer registry**, otherwise its translations never reach the message table.
The registries hold translation configs only — components are imported directly
(`@/components/<layer>/<Name>`), never through the registry object.
