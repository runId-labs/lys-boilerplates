# How to build a page (Layer 4)

Reference implementations: `pages/ListClientPage/` (private list page on a tabs
template), `pages/LoginPage/` (public page), `pages/ActivatePage/` (public page
mounting one restrictedFeature).

## RULES

- **R1 — A page is thin.** `index.tsx` composes restrictedFeatures/features and
  nothing else. Logic that is not routing/composition belongs in a lower layer.
- **R2 — `config.ts` is the contract.** The router, the chatbot manifest and the
  permission gating all read it. Required fields: `name` (unique, PascalCase +
  `Page`), `component`, `path`, `type` (`public` | `private`), `translation`,
  `description` (English, one sentence — the chatbot uses it to navigate).
- **R3 — mainWebserviceName.** Private pages declare the webservice that gates
  them (string or any-of array). `LinkRestricted`/menu entries hide pages the
  user cannot access.
- **R4 — Chatbot opt-in.** `chatbotBehaviour` (`prompt`, `contextTools`,
  `autoOpenOnEnter`, `showWelcomeMessage`) is optional; add it when the page is a
  chatbot-relevant destination. After changing it, regenerate the routes
  manifest (`npm run generate:routes`) — verification F-manifest.
- **R5 — Registry.** Register the page config in `pages/index.ts`; the route
  table (`generateRouteTable(lys)`) and the manifest pick it up automatically.
- **R6 — Navigation entries.** A new private page reachable from the menu needs
  an entry in `services/navigation/menuSections.ts` (route NAME, not path) and a
  translation key in `services/navigation/translation.ts`. Tab-grouped pages
  (administration/supervision) get their tab entry in
  `services/navigation/administrationTabs.ts` / `supervisionTabs.ts`.

## PROCEDURE

1. Create `pages/MyPagePage/` with `config.ts`, `index.tsx`, `translation.ts`.
2. `config.ts` skeleton (copy the shape from `ListClientPage/config.ts`):
   ```ts
   import MyPagePage from "./index";
   import myPageTranslation from "./translation";

   export const myPagePage = {
       name: "MyPagePage",
       component: MyPagePage,
       path: "/my-page",              // public routes: "/my-page" too
       type: "private",               // "public" for login/activate/…
       mainWebserviceName: "all_my_things",   // gates access (private pages)
       translation: myPageTranslation,
       description: "One English sentence describing the page for the chatbot.",
       // breadcrumbs: [{routeName: "MySectionPage"}],
       // chatbotBehaviour: {prompt: "…", contextTools: []},
   };
   ```
3. `translation.ts`: at minimum `pageName` (used by tab labels), en + fr.
4. Register in `pages/index.ts`; add menu/tab entry (R6) if applicable.
5. Self-check: verification.md F2–F4 + regenerate the manifest (R4) if
   `chatbotBehaviour` was added.

## ✅ / ❌

| ✅ | ❌ |
|----|----|
| `mainWebserviceName: "all_clients"` matching the backend webservice id | A path string as `name`, or two pages with the same `name` |
| `description: "List and manage client subscriptions."` | Empty description on a private page (chatbot loses the route) |
| `{routeName: "ListClientPage"}` in menuSections | Hardcoded `/clients` path in the menu |
