# How to build a restrictedFeature (Layer 3)

Reference implementations to read first:
- `restrictedFeatures/GetClientRestricted/` — simple query + feature composition
- `restrictedFeatures/ListClientRestricted/` — Relay connection + pagination + table
- `restrictedFeatures/ActivateUserRestricted/` — minimal mutation wrapper

## RULES

- **R1 — This layer owns protected GraphQL.** Queries/mutations/fragments on
  protected webservices live here (or in pages, never above in features).
  Components' `graphql\`` tags are compiled by relay-compiler against
  `front/schema.graphql` — an operation referencing a webservice that does not
  exist FAILS the compile (that is by design; regenerate the schema if the
  backend changed: `./bin/generate-schema.sh`).
- **R2 — Permissions are the providers' job.** `LysQueryProvider` /
  `LysMutationProvider` render nothing when the connected user has no access to
  the webservice. Do not rebuild that with `usePermissionCheck` — use it only for
  fine-grained UI (link enabling, menu visibility).
- **R3 — Ref contract.** Expose `hasPermission` via `useImperativeHandle` on a
  `<Name>RefInterface` (copy the pattern from `GetClientRestricted/types.ts`) so
  parents can compose permission-gated UI.
- **R4 — Errors by key.** `onError` merges the backend error code into
  `useAlertMessages()`; codes are translated through `services/i18n/errors.ts`.
- **R5 — UI in a feature.** If the restrictedFeature grows rendering logic,
  extract a Layer-2 feature and keep the GraphQL + wiring here (reference:
  `ChatbotProposalRestricted` wrapping `ChatbotProposalFeature`).
- **R6 — Naming + registry**: `PascalCase + Restricted`; `translations.ts`
  registered in `restrictedFeatures/index.ts`.

## PROCEDURE

1. **Skeleton**:
   ```
   restrictedFeatures/DoThingRestricted/
     index.tsx        providers + graphql + wiring
     types.ts|.d.ts   props + RefInterface
     translations.ts  component strings
     styles.scss      if needed
   ```
2. **Query pattern** (state-ref + parse on data — copy from `NotificationListFeature`):
   ```tsx
   const [queryRef, setQueryRef] = useState<LysQueryRefInterface<DoThingQuery> | null>(null);
   useEffect(() => { if (queryRef?.hasPermission && !queryRef?.isLoading && !queryRef.data) queryRef.load(); }, [queryRef?.hasPermission]);
   useEffect(() => { /* parse queryRef.data into local state */ }, [queryRef?.data]);
   return (
     <LysQueryProvider query={DO_THING_QUERY} parameters={params} ref={setQueryRef}>
       {queryRef?.data && <DoThingFeature data={parsed} … />}
     </LysQueryProvider>
   );
   ```
3. **Mutation pattern** (copy from `ActivateUserRestricted`):
   ```tsx
   const [mutationRef, setMutationRef] = useState<LysMutationRefInterface | null>(null);
   <LysMutationProvider mutation={DO_THING_MUTATION} ref={setMutationRef}>
     {mutationRef?.commit && <DoThingFeature onConfirm={(inputs) => mutationRef.commit({
         variables: {inputs},
         onCompleted: () => …,
         onError: () => alertMessage.merge([{text: "ERROR_KEY", level: "ERROR"}]),
     })} />}
   </LysMutationProvider>
   ```
4. **Paginated list**: `pageInfo` cursor shape → `PaginationElement` props;
   sort/filter state → URL via `useUrlQueries` (reference: `ListClientRestricted`).
5. **Live updates**: subscribe to SSE signals with `useSignalSubscription`
   (reference: `NotificationBellRestricted`); debounce list reloads with
   `useDebouncedCallback`.
6. **Self-check**: verification.md F1–F4 (F1 mandatory — you added graphql).

## ✅ / ❌

| ✅ | ❌ |
|----|----|
| Provider renders nothing when access is missing | `if (!hasPermission) return null` hand-rolled around a query |
| `queryRef.load()` in an effect keyed on `hasPermission` | Calling `.load()` during render |
| Relay cursor pagination via `PaginationElement` | Offset arithmetic in local state |
| Backend error code passed as alert text key | Translating the error inside the restrictedFeature |

## Dialog panels

A restrictedFeature mounted through `openDialog({body, bodyProps})` follows the
dialog contract (`dialog.md` R3): data in via `bodyProps`, closing via the
`onCompleted` callback the opener passes.
