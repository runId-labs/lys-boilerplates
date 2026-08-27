# Tests and stories (front)

## Tests (vitest, jsdom — `*.test.tsx` beside the component)

- **R1 — What to test**: rendering from props (defaults + meaningful
  variations), interaction callbacks, conditional states. Not implementation
  details, not styling.
- **R2 — Translated components** render through `renderWithIntl`
  (`@/test/utils`) — it loads the real message table, so you assert on the
  English strings. Plain `render` for components with no i18n hook in their
  tree.
- **R3 — Interactions** through `fireEvent`/`userEvent` on roles
  (`getByRole("button")`), queries by visible text.
- **R4 — Timers**: debounced behaviors use `vi.useFakeTimers()` (reference:
  `QuickSearchInputElement` test).
- **R5 — Run**: `npm run test` (all), one file:
  `npx vitest run --project unit src/components/…/X.test.tsx`.
  Storybook-integrated tests are a separate project — unit tests must not
  mount Storybook.

Canonical layout (reference: `elements/ButtonElement/ButtonElement.test.tsx`):

```
ComponentName/
  index.tsx
  types.d.ts
  translations.ts        (when user-visible strings exist)
  styles.scss            (when needed)
  ComponentName.test.tsx
  ComponentName.stories.tsx
```

## Stories (Storybook — `*.stories.tsx` beside the component)

- **S1 — Every visual element gets stories** (`title: "Elements/<Name>"`,
  `tags: ["autodocs"]`, controls for the main props via `argTypes`), one story
  per meaningful state (reference: `ButtonElement.stories.tsx`,
  `EnumBadgeElement.stories.tsx`).
- **S2 — Features**: story them when they render standalone without app
  context; skip when they need providers/permissions (restrictedFeatures are
  never storied by design).
- **S3 — No fixtures of business data** — generic props (labels like "John",
  "Item A"), the boilerplate stays domain-free.
- **S4 — A11y**: the a11y addon runs on every story (violations surface as
  todos, not failures); keep stories a11y-clean.
- **S5 — The preview mounts a global `IntlProvider`** with a locale toolbar
  (en/fr) — translated components render their labels; switch locales to
  verify both languages.
- **S6 — Run/build**: `npm run storybook` (dev) / `npm run build-storybook`.
  Stories are excluded from unit tests and from `tsc` boundary checks but must
  compile.

## ✅ / ❌

| ✅ | ❌ |
|----|----|
| `renderWithIntl(<ButtonElement isLoading>…)` | `render(<TableElement>)` when Table uses `t()` |
| `expect(handleClick).toHaveBeenCalledTimes(1)` | Asserting the internal state variable |
| Story with one variant per prop state | A single "default" story for a 10-prop component |
| Fake labels ("Item A") | Real project names in stories |
