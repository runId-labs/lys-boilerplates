# Translations (front)

All user-visible strings go through react-intl with keys resolved from the `lys`
descriptor. Read this before writing any label.

## The three string locations

| What | Where | Example |
|------|-------|---------|
| Component-specific strings | `<component>/translations.ts` | `elements/InputElement/translations.ts` |
| Cross-component / enum codes | `src/services/i18n/common.ts` | `HIGH`, `save`, `chatbotName` |
| Backend error codes | `src/services/i18n/errors.ts` (`projectErrorTranslations`) | `MAX_IMPORT_HISTORY_REACHED` |

## Component translations — `createComponentTranslations`

Copy the pattern from any `translations.ts` (reference: `elements/TableElement/translations.ts`):

```ts
import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    noData: {en: "No data available", fr: "Aucune donnée disponible"}
} as const;

const {config, useTranslations} = createComponentTranslations("TableElement", translations);

export const tableElementConfig = config;
export const useTableElementTranslations = useTranslations;
export default config;
```

HARD RULES:

- **R1 — The component name ends with its layer suffix** (`Element`, `Feature`,
  `Restricted`, `Page`) — the registry path is inferred from it
  (`lys.components.elements.tableElement.*`). A wrong suffix = key never resolves.
- **R2 — en AND fr are both required**, TypeScript enforces it via `as const`.
- **R3 — Register the config** in the layer registry (`elements/index.ts`, …) or
  the strings never reach the message table. A component using only `common()`
  keys still ships a `translations.ts` with an empty table — the hook and the
  registry entry are part of the pattern.
- **R4 — Every key used.** A key declared but never rendered is dead weight;
  delete it.
- **R5 — Interpolation values are strings**: `t("showingRange", {values: {total: String(n)}})`.

## Using translations in a component

```tsx
const {t, common} = useTableElementTranslations();
// t("noData")                       → component key
// common("save")                    → shared key (typed)
// t("unknownKey", {fallbackToKey: true})  → optional graceful fallback
```

## Tests and stories

- Tests: wrap renders in `renderWithIntl` (`@/test/utils`) — it loads the real
  message table, so assertions use the English strings.
- Stories: the Storybook preview mounts a global `IntlProvider` with a locale
  toolbar — nothing to do per story.

## ✅ / ❌

| ✅ | ❌ |
|----|----|
| `t("confirm")` with the key defined en+fr | French literal in JSX (`{loading ? "Envoi…" : t("confirm")}`) |
| New enum label added to `common.ts` + used via `common()` | Duplicating the same label in five component translations |
| Backend error code added to `errors.ts`, alert carries the raw code | Translating an error inside the component that raised it |
| `displayName`/aria labels translated with `t()` | Hardcoded `aria-label="Close"` in a translated component |
