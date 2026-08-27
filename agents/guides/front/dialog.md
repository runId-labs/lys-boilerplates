# Dialogs and panels (front)

The lys dialog system mounts a component into a **panel** (OffCanvas by default)
OUTSIDE its natural React tree. The component does not render the panel — it is
rendered BY the panel. Read this before building anything that opens in a
drawer, or any component meant to live inside one.

Reference implementations: `features/NavBarFeature/hooks/useUserAccountDialog.tsx`
(dialog hook), `restrictedFeatures/ManageUserSSORestricted` (component opened in
a dialog), `appTemplates/RouterAppTemplate` (wiring: dialogComponent, renderExtra),
`providers/DialogScopedUrlProvider`.

## The mechanics

- One global provider: `LysDialogProvider` (mounted in `RouterAppTemplate` with
  `dialogComponent={OffCanvasElement}` — the panel renderer is injectable).
- Opening = `openDialog(config)`; dialogs **stack** (`stack`, `current`); the
  `dStack` URL param carries the stack when `syncWithUrl` is on (default) — a
  refresh or a shared URL restores the open panels.
- The body component is rendered by the panel with `bodyProps` — it receives
  NO knowledge of the dialog itself. Close/update belong to the opener (or to
  `useDialogWithUpdates`).

```tsx
const {open: openDialog, close: closeDialog} = useLysDialog();

openDialog({
    uniqueKey: "create-client-user",        // stable identity (URL, stacking, updates)
    title: t("createUser"),
    body: CreateClientUserRestricted,       // the COMPONENT, not JSX
    bodyProps: {clientId, onCompleted: closeDialog},
    placement: "end",                        // start | end | top | bottom
    size: "lg",                              // sm | md | lg | xl
    // syncWithUrl: false,                   // opt out of URL restoration
    // backdrop: "static",
});
```

## RULES

- **R1 — `uniqueKey` is the identity.** Same key = same dialog (re-open updates
  instead of stacking a twin). Keys are quoted constants
  (`const DIALOG_KEY = "connected-user-management";`) or counter-based when the
  same dialog can legitimately repeat (`chatbot-create-action-${n++}` pattern).
- **R2 — Body = component + bodyProps, never JSX.** The provider stores the
  config; passing JSX freezes the render tree.
- **R3 — The body contract**: a dialog body receives its data via `bodyProps`
  and closes itself through a prop the opener passes
  (`onCompleted: () => closeDialog()`) — the body never calls `useLysDialog`
  itself.
- **R4 — Live bodyProps → `useDialogWithUpdates`.** When the opener's data
  changes while the dialog is open (user object refreshes, query data arrives),
  build the dialog with `useDialogWithUpdates({uniqueKey, title, body,
  bodyProps, deps})` and expose `dialog.open` — the panel re-renders the body
  with fresh props on `deps` change (reference: `useUserAccountDialog`).
- **R5 — Panel-specific UI** (elements that must sit next to the open panel)
  goes through `LysDialogProvider`'s `renderExtra={(current) => …}` prop —
  mounted once in `RouterAppTemplate`, it receives the current dialog config
  (size included) so the rendered element can position itself. Optional: the
  prop is simply omitted when nothing needs it.
- **R6 — Dialog-scoped URL state**: params namespaced `{uniqueKey}_myParam` are
  owned by that dialog and cleaned up when it leaves the stack
  (`DialogScopedUrlProvider`, mounted under `LysDialogProvider`). Never clean
  them by hand; never store another dialog's state under a foreign prefix.
- **R7 — Two dialogs mounted from different places must not share a key** —
  the second `open` would hijack the first.

## PROCEDURE — "open this component in a panel"

1. Design the body component as a normal layer-2/3 component whose data comes
   from props (it should be usable outside a dialog too).
2. In the opener, define `const DIALOG_KEY = "…"` and either a one-shot
   `openDialog({…})` (static data) or a `useDialogWithUpdates` hook (live data).
3. Pass `onCompleted`/`onClose` callbacks in `bodyProps` so the body can close
   itself after its mutation succeeds.
4. Self-check: verification.md F2, F3 — and manually that a refresh with the
   dialog open restores it (syncWithUrl).

## ✅ / ❌

| ✅ | ❌ |
|----|----|
| `body: CreateClientUserRestricted, bodyProps: {…}` | `body: <CreateClientUserRestricted …/>` |
| `const DIALOG_KEY = "user-account"` reused for open/update | Random key per open (`key-${Date.now()}`) |
| `onCompleted: () => closeDialog()` passed to the body | Body importing `useLysDialog` to close itself |
| `useDialogWithUpdates({…, deps: [user]})` | Calling `openDialog` again in an effect to "refresh" the body |
