# Styles Directory

This directory contains the theming system for the Lys boilerplate.

## Quick Start

Import the main stylesheet in your application entry point:

```javascript
// main.jsx
import './styles/main.scss'
```

## Structure

```
styles/
├── tokens/              # Design tokens (Sass variables)
│   ├── _colors.scss     # Color palette
│   ├── _spacing.scss    # Spacing, radius, shadows
│   ├── _typography.scss # Font tokens
│   └── _design-tokens.scss # Combined export
├── _css-variables.scss  # CSS custom properties
├── _bootstrap-override.scss # Bootstrap configuration
├── _utilities.scss      # Custom utility classes
└── main.scss           # Entry point (import this)
```

## Customization

### Override design tokens

```scss
// custom-theme.scss
$lys-color-primary: #your-color;
$lys-spacing-base: 1.2rem;

@import "lys-front/src/styles/main.scss";
```

### Runtime theme switching

```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

### Available themes

- `light` (default)
- `dark` - Dark mode theme
- `high-contrast` - High contrast for accessibility

## Documentation

See [theming-system.md](../../docs/theming-system.md) for complete documentation.

## Design Token Reference

### Colors
- Primary, secondary, success, danger, warning, info, light, dark
- Brand, accent (custom colors)
- Gray scale (100-900)

### Spacing
- Numeric: `$lys-spacing-{0-8}`
- Named: `$lys-spacing-{xs,sm,md,lg,xl,2xl,3xl,4xl}`

### Typography
- Font families: `$lys-font-family-{base,monospace,heading}`
- Font sizes: `$lys-font-size-{xs,sm,md,lg,xl,2xl,3xl,4xl,5xl}`
- Font weights: `$lys-font-weight-{thin,light,regular,medium,semibold,bold,extrabold,black}`
- Line heights: `$lys-line-height-{none,tight,snug,normal,relaxed,loose}`

### Other
- Border radius: `$lys-radius-{sm,default,md,lg,xl,2xl,full}`
- Shadows: `$lys-shadow-{sm,default,md,lg,xl}`
- Transitions: `$lys-transition-duration-{fast,base,slow,slower}`
- Breakpoints: `$lys-breakpoint-{xs,sm,md,lg,xl,xxl}`

## CSS Custom Properties

All design tokens are available as CSS variables:

```css
.my-component {
  color: var(--lys-color-primary);
  padding: var(--lys-spacing-md);
  border-radius: var(--lys-radius-default);
  box-shadow: var(--lys-shadow-default);
}
```

## Utility Classes

Custom utilities beyond Bootstrap:

```html
<!-- Responsive widths -->
<div class="w-lg-50 w-md-75 w-sm-100"></div>

<!-- Custom colors -->
<span class="text-brand bg-accent"></span>

<!-- Flexbox helpers -->
<div class="flex-center gap-md"></div>

<!-- Typography -->
<h1 class="font-heading leading-tight"></h1>

<!-- Transitions -->
<button class="transition-fast"></button>

<!-- Accessibility -->
<button class="focus-visible-ring"></button>
```

## Notes

- All Sass variables use `!default` for easy overriding
- CSS variables enable runtime theming
- Bootstrap is imported with custom variable overrides
- Supports dark mode and system color scheme preferences
- Includes accessibility utilities and best practices