// Layer boundaries for the four front layers (see agents/guides/front/architecture.md).
// The doc teaches; this config enforces. Run: npm run lint:boundaries
// Scope is intentionally limited to import boundaries — types are checked by
// tsc, tests by vitest.

const ELEMENT_FORBIDDEN = [
    "error",
    {
        patterns: [
            {group: ["@/components/features", "@/components/features/*"], message: "Elements (Layer 1) may not import features — move the logic up a layer."},
            {group: ["@/components/restrictedFeatures", "@/components/restrictedFeatures/*"], message: "Elements (Layer 1) may not import restrictedFeatures."},
            {group: ["@/components/pages", "@/components/pages/*"], message: "Elements (Layer 1) may not import pages."},
            {group: ["@/components/appTemplates", "@/components/appTemplates/*"], message: "Elements (Layer 1) may not import app templates."},
            {group: ["@/services/*"], message: "Elements (Layer 1) may not import project services."},
            {group: ["react-relay"], message: "Elements (Layer 1) are pure UI — no GraphQL. Use props."},
            {group: ["lys-front/providers", "lys-front/providers/*"], message: "Elements (Layer 1) may not use providers (translations hooks go through @/tools/translationTools)."},
        ],
    },
];

const NO_UPWARD = [
    "error",
    {
        patterns: [
            {group: ["@/components/pages", "@/components/pages/*"], message: "Pages are Layer 4 — never imported by lower layers."},
            {group: ["@/components/appTemplates", "@/components/appTemplates/*"], message: "App templates mount pages, never the other way around."},
        ],
    },
];

import tsParser from "@typescript-eslint/parser";


export default [
    {ignores: ["dist/**", "storybook-static/**", "node_modules/**", "coverage/**", "src/**/__generated__/**"]},
    {
        files: ["src/components/**/*.{ts,tsx}"],
        languageOptions: {parser: tsParser},
    },
    {
        files: ["src/components/elements/**/*.{ts,tsx}"],
        rules: {"no-restricted-imports": ELEMENT_FORBIDDEN},
    },
    {
        files: ["src/components/features/**/*.{ts,tsx}"],
        rules: {"no-restricted-imports": NO_UPWARD},
    },
    {
        files: ["src/components/restrictedFeatures/**/*.{ts,tsx}"],
        rules: {"no-restricted-imports": NO_UPWARD},
    },
];
