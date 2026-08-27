# Styling — design tokens and themes

The style system lives in `front/src/styles/`: tokens (`tokens/`) → CSS variables
(`_css-variables.scss`, light/dark/high-contrast via `[data-theme]`) → Bootstrap
overrides (`_bootstrap-override.scss`) → utilities (`_utilities.scss`).

## RULES

- **R1 — Consume variables, never raw values.** In ANY component scss/inline
  style: colors, radii, shadows, spacing via `var(--lys-*)` or `var(--bs-*)`.
  A raw hex only exists in `src/styles/` (that is the point of the layers).
  Exception: pure white/black for icon-on-color contrast is tolerated
  (`color: #FFFFFF` on a `--lys-color-primary` background).
- **R2 — No hardcoded locale.** Dates/numbers/currency formats come from
  `Intl` with the runtime locale (`useIntl().locale`), never `"fr-FR"`.
  Reference: `DonutChartElement`'s locale-aware formatter.
- **R3 — Component styles are co-located and BEM-ish.** One `styles.scss` next
  to the component, class root = component name
  (`my-thing-element`, sub-blocks `__item`, modifiers `--active`). Use the `cn`
  helper for conditional classes.
- **R4 — Dark mode is not optional.** A style that only reads well on light
  breaks `data-theme="dark"` — tokens switch automatically IF you use them;
  test the chatbot/sidebar in both themes when touching shared layout.
- **R5 — Prefer Bootstrap spacing/layout utilities** (`d-flex`, `gap-2`,
  `mt-3`…) over hand-written margins; the tokens' scale drives them.
- **R6 — New token?** Add it to the right token file (color → `tokens/_colors.scss`
  + expose in `_css-variables.scss` per theme), not a local variable. Name it by
  role (`--lys-color-primary-tint`), not by value (`--lys-color-light-blue`).

## Reference components

- `elements/CardElement/styles.scss` — variants through class names, tokens inside
- `features/SidebarMenuFeature/styles.scss` — layout + states + theme-aware colors

## ✅ / ❌

| ✅ | ❌ |
|----|----|
| `background-color: var(--lys-color-primary)` | `background-color: #1E3A5F` |
| `box-shadow: var(--lys-shadow-md)` | Copied rgba shadow from another project |
| `new Intl.NumberFormat(locale, …)` | `new Intl.NumberFormat("fr-FR")` |
| `.table-element__cell--numeric { text-align: right; }` | Inline `style={{textAlign: "right"}}` scattered in JSX |
