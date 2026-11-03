<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the existing dashboard routes and store reducers; serialize reads and writes through one queue to prevent stale refreshes replacing saved records.
- Persist ledger changes through the authenticated transactional RPC, applying retained-row updates before parent deletions to preserve detached references.
- Keep account avatars and worker photos in their existing private Supabase buckets; use signed URLs and unique photo paths to avoid stale replacements.
- Import validated backups only after explicit confirmation and merge missing IDs without overwriting current records.
- Use the supplied brand asset pointer for app branding and a locally downscaled derivative for the favicon.
