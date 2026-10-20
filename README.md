# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## #4471, split (added 2026-10-20)

#4471 was merged on subject lines and marked *known*. Read by tenant, form and body, it holds three issues:

| ticket | issue |
|---|---|
| [#1](https://github.com/ArchieHQR/support-kb/issues/1) | shared parser reads day-first dates month first |
| [#2](https://github.com/ArchieHQR/support-kb/issues/2) | booking-v3 form hint shows MM/DD/YYYY, the form reads day first |
| [#3](https://github.com/ArchieHQR/support-kb/issues/3) | dates move back one day across time zones |

- The page: [`src/routes/kb/incidents/4471-split/+page.svx`](src/routes/kb/incidents/4471-split/+page.svx), numbers from [`src/lib/kb/IssueSplit.svelte`](src/lib/kb/IssueSplit.svelte) and [`src/lib/kb/split.ts`](src/lib/kb/split.ts).
- The page as the desk sees it: [`docs/kb/incidents/4471-split/index.html`](docs/kb/incidents/4471-split/index.html), live at https://archiehqr.github.io/support-kb/kb/incidents/4471-split/

Build: `npm install && npm run build` (output in `build/`). For Pages: `OUT=docs BASE_PATH=/support-kb npm run build`.
