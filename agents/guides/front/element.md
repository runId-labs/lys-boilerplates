# How to build an element (Layer 1)

Reference implementations to read first: `elements/CardElement/` (full package:
component + types + scss + test + story) and `elements/EnumBadgeElement/`
(config-driven, minimal).

## RULES

- **R1 — Pure UI.** No GraphQL, no providers, no permission logic, no project
  services. Everything the element needs arrives through props.
- **R2 — Naming.** Directory `PascalCase + Element` suffix; the component name
  and `displayName` match the directory.
- **R3 — One responsibility.** If the component needs data fetching, business
  validation or vocabulary of the domain, it is a feature, not an element.
- **R4 — Tokens only.** Colors, radii, shadows, spacing via `var(--lys-*)` /
  `var(--bs-*)`. Never a raw hex or a locale in code (see `style.md`).
- **R5 — Generic labels via props/translations.** A default label the user sees
  goes in the element's `translations.ts` (en+fr), overridable by prop.
- **R6 — Registry.** If the element has a `translations.ts`, register its config
  in `elements/index.ts`.

## PROCEDURE

1. **Copy the skeleton.** Create the directory and files:
   ```
   elements/MyThingElement/
     index.tsx        the component
     types.d.ts       props interface (documented)
     translations.ts  only if a user-visible default string exists
     styles.scss      only if the component needs custom styles
     MyThingElement.test.tsx    at least rendering + main prop variations
     MyThingElement.stories.tsx for visual components (storybook)
   ```
2. **Props interface** (`types.d.ts`): every prop documented with a JSDoc
   comment; optional props have defaults in the destructuring; callbacks are
   `onSomething` verbs.
3. **Component** (`index.tsx`):
   ```tsx
   import React from "react";
   import {MyThingElementProps} from "./types";
   import {cn} from "lys-front/tools";
   import "./styles.scss";   // only if present

   /**
    * MyThingElement component
    *
    * Element component (Layer 1) — <one sentence of purpose>.
    */
   const MyThingElement: React.FC<MyThingElementProps> = ({/* props */}) => {
       return (<div className={cn("my-thing-element", /* … */)}>…</div>);
   };

   MyThingElement.displayName = "MyThingElement";
   export default MyThingElement;
   ```
4. **Translations** (see `translations.md`): `createComponentTranslations("MyThingElement", {...})`
   — the name MUST end with `Element`.
5. **Test**: render through `renderWithIntl` (`@/test/utils`) when the component
   (or a child) uses translations; plain `render` otherwise. Assert on roles and
   visible text, not on implementation details.
6. **Story**: `title: "Elements/MyThingElement"`, controls for the main props,
   one story per meaningful state (see `elements/ButtonElement/ButtonElement.stories.tsx`).
7. **Registry**: add the config to `elements/index.ts`.
8. **Self-check**: `agents/guides/verification.md` (F2, F3, F4, F6).

## ✅ / ❌

| ✅ | ❌ |
|----|----|
| `<BadgeElement variant="danger">` reused everywhere | A `StatusBadgeElement` hardcoding the project's status list |
| `aria-label={t("clearInputAriaLabel")}` | `aria-label="Effacer le champ"` |
| `Intl`-aware formatter received as prop | `new Intl.NumberFormat("fr-FR")` inside the element |
| Config map passed as prop (`values={…}`) | Import from `@/services/…` to build the options |
