# Page templates (front)

A page template = the layout wrapping a page's content (tabs bar, paddings,
sidebar-aware layout). Selected per page in its `config.ts` via `template:`.

## Existing templates (`src/components/pageTemplates/`)

| Template | Purpose |
|-----------|---------|
| `EmptyPageTemplate` | Bare passthrough — default when a page sets no template |
| `PrivatePageTemplate` | Standard private page layout (content column, breadcrumbs container) |
| `AdministrationTabsPageTemplate` | `PrivatePageTemplate` + Administration tabs bar |
| `SupervisionTabsPageTemplate` | `PrivatePageTemplate` + Supervision tabs bar |

The template contract: a component receiving `route: RouteInterface` and
rendering `route.component`. Adding a tab group = new template referencing a
tabs config from `services/navigation/` (reference:
`SupervisionTabsPageTemplate` → `SUPERVISION_TABS`).

## RULES

- **R1 — Choose the simplest template that fits.** Content-only page →
  `PrivatePageTemplate`. Page belonging to a tab group (administration /
  supervision) → the matching tabs template. Custom layout → new template, not
  layout hacks inside the page component.
- **R2 — Templates never fetch.** They lay out; data belongs to the page's
  restrictedFeatures. A template may read the route (breadcrumb labels, tab
  filtering via `useRouteInfo`/`useRouteAccess`).
- **R3 — Tab membership lives in two places**, keep them consistent:
  the page's `template` (tabs template) AND its entry in the tabs config
  (`services/navigation/administrationTabs.ts` / `supervisionTabs.ts`) — a page
  with the tabs template but absent from the config shows an incomplete bar,
  and vice versa.
- **R4 — New tab group** = new tabs config array + new template + entries; copy
  the Supervision pair and mirror it.

## PROCEDURE — new template

1. Create `pageTemplates/MyTabsPageTemplate/index.tsx` (+ `styles.scss` if
   needed) — copy `SupervisionTabsPageTemplate` verbatim and swap the config:
   ```tsx
   import {PageTemplate} from "lys-front/types";
   import TabsNavigationFeature from "@/components/features/TabsNavigationFeature";
   import {MY_TABS} from "@/services/navigation/myTabs";
   import "./styles.scss";

   const MyTabsPageTemplate: PageTemplate = ({route}) => {
       return (
           <div className="my-tabs-page-template">
               <TabsNavigationFeature tabs={MY_TABS} />
               <route.component route={route} />
           </div>
       );
   };

   export default MyTabsPageTemplate;
   ```
   Note: `TabsNavigationFeature` takes ONLY `tabs` — the active tab derives from
   the current route, and inaccessible tabs hide themselves via `LinkRestricted`.
2. Reference it from pages: `template: MyTabsPageTemplate` in `config.ts`.
3. Self-check: verification.md F2, F3.
