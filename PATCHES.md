# Active Scaffold Patches

> **Hub-master index.** Lists every active org-wide patch held at this hub root.
> Use `./scaffold-sync.sh` to propagate these into each `dclaw-*` repo.
>
> When patches mature, they roll up into `PLAN-v1.3.md` (then `v1.4`, etc.) and
> the patch files retire from this list.

## Conventions

- File naming: `PATCH-YYYY-MM-DD-<short-slug>.md`
- One patch = one concrete, dated change to org-wide guidance
- Patches are **additive** and self-contained — they don't modify earlier patches or PLAN files
- An in-repo copy of a patch may live next to the manifest/code it documents (e.g. `dclaw-platform/PATCH-...md` next to the YAML it explains); the hub-root file is the master

## Active patches

_(None — all current patches have been incorporated into `plan_v1.3.md`)_

## Retired patches

| Patch | Topic | Retired | Folded Into |
|---|---|---|---|
| `PATCH-2026-05-15-shared-hub-postgres.md` | Shared hub postgres made durable; auto-creates `dclaw_<app>` DB per app | 2026-05-16 | `plan_v1.3.md` Section 4.1 |

---

## See Also

- `plan_v1.3.md` — Single source of truth for roadmap, architecture decisions, and incorporated patches
- `knowledge/index.md` — Obsidian-compatible knowledge graph
- `AGENTS.md` — Architecture locks and anti-patterns
