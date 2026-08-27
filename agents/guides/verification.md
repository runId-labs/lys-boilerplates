# Self-check checklist — run before reporting any change done

Run the checks that apply to your change, in this order. Report every result
honestly, failures included. A red check is information, not a problem to hide.

## Front (`cd front`)

| # | Check | Command | Must be |
|---|-------|---------|---------|
| F1 | Relay compiles (after any `graphql\`` change) | `npm run relay` | exit 0 |
| F2 | Typecheck | `npx tsc --noEmit` | 0 error |
| F3 | Unit tests | `npm run test` | all pass |
| F4 | Layer boundaries | `npm run lint:boundaries` | 0 error |
| F5 | Production build (before handing over a big change) | `npm run build` | exit 0 |
| F6 | Storybook build (after adding/changing stories) | `npm run build-storybook` | exit 0 |

If you added a page or changed a page `config.ts`: also regenerate the routes
manifest (`npm run generate:routes`) — the API chatbot consumes it.

## Back (`docker compose exec api …`, same for `worker`)

| # | Check | Command | Must be |
|---|-------|---------|---------|
| B1 | App imports cleanly (settings/apps valid) | `python main.py db-status` | runs without ImportError |
| B2 | Import boundaries | `lint-imports` | 0 violation |
| B3 | Migration generated (after entity change) | `python main.py makemigrations -m "…"` then **review the generated file** | migration matches the intent |
| B4 | Migration applies | `python main.py migrate` | exit 0 |
| B5 | Schema still exports (after webservice change) | `python main.py export-schema -o /app/schema.graphql` | exit 0 |

## Definition of done (all changes)

- [ ] The checklists above are green for the touched side(s).
- [ ] New/changed behavior follows the layer guide(s) read for the task.
- [ ] No hardcoded environment value, color, locale or secret (see
  `front/style.md` and `back/rules.md`).
- [ ] Sibling files were used as the structural template (R8 of AGENTS.md).
- [ ] The final report to the user states what was changed, what was verified,
  and anything left unverified.
