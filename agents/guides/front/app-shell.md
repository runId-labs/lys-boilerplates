# App shell — providers, navigation and multi-client (front)

The shell lives in `src/components/appTemplates/` and `src/services/navigation/`.
Agents touch it rarely but must understand it: it explains where providers,
menus, tabs and the client selector come from.

## The provider stack (read top-down, in `MainAppTemplate` → `RouterAppTemplate`)

| Provider (lys-front) | Brings |
|----------------------|--------|
| `ThemeProvider` (project, outermost in App.tsx) | light/dark + `data-theme` |
| `LocaleProvider` | react-intl messages (from the `lys` descriptor) |
| `AlertMessageProvider` | toast/error queue → rendered by `AlertMessageFeature` |
| `ErrorBoundaryProvider` | render errors → CRITICAL alerts |
| `ConnectedUserProvider` | JWT auth state, login/logout/refresh |
| `WebserviceAccessProvider` | webservice access map (permissions) |
| `SignalProvider` | SSE `/sse/signals` subscription |
| `PageContextProvider` | current page name/params (chatbot context) |
| `ChatbotProvider` | chatbot state, reset per user |
| `BrowserRouter` → `UrlQueriesProvider` → `ClientProvider` → `FilterLabelsProvider` → `LysDialogProvider` → `DialogScopedUrlProvider` | routing, URL params, client focus, filters, dialogs |

**Adding a provider**: global cross-cutting concern only — mount it in
`MainAppTemplate` (state that must survive navigation) or `RouterAppTemplate`
(routing-dependent), document it here, and keep the ordering rationale in a
comment. Providers from lys-front are consumed, not re-implemented.

## Multi-client (multi-tenant) focus

`useClientId()` (lys-front `ClientProvider`) returns `{clientId, setClientId,
isLocked}`:

- The **client selector** (`SelectClientRestricted` in the navbar) switches the
  focused organization; the id is synced to the `clientId` URL param and
  sessionStorage.
- `isLocked` for client-scoped users (their own org, no switching) — the navbar
  hides the selector.
- Data fetching that must respect the focus takes `clientId` as a query
  variable (reference: `ListClientUserRestricted`).

## Navigation config (`src/services/navigation/`)

| File | Role |
|------|------|
| `menuSections.ts` | Left-menu sections (business sections; admin/supervision intentionally NOT here — they live in the user dropdown) |
| `administrationTabs.ts` / `supervisionTabs.ts` | Tab bars of the matching page templates |
| `translation.ts` | All menu/tab label keys (en+fr) |
| `index.ts` | Exports + `NAVIGATION_TRANS_PREFIX` |

Entries reference **route names** (resolved at runtime via the route map),
never paths — renaming a page's route name updates navigation for free.

## App private template

`appTemplates/AppPrivateAppTemplate` injects the navbar (`NavBarFeature`), the
chatbot sidebar (`SidebarMenuFeature`) and the chatbot-mode layout into
`PrivateAppTemplate`. Projects customize branding here (navbar brand text) —
not inside the navbar feature.

## RULES

- **R1 — Do not mount providers inside pages/features.** The stack is
  app-level; a feature consumes providers (`useChatbot`, `useClientId`…), it
  never wraps itself in one.
- **R2 — Shell changes are cross-project decisions** — touch the stack only for
  a mechanism every page needs; otherwise solve it in the layer that needs it.
- **R3 — A new menu/tab label** gets a key in `navigation/translation.ts` (en+fr)
  — never a raw string in the config files.
