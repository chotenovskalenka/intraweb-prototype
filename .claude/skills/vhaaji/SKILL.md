---
name: vhaaji
description: >-
  Working guide for the Vhaaji forest-kindergarten prototype (the three single-file
  apps in this repo: guide/průvodce, parent/rodič, admin/vedení). Invoke this
  WHENEVER you touch anything in this repo — editing a screen, dashboard, docházka,
  omluvenka, náhrady, aktuality, platby; changing colors/tokens/typography/logo;
  running or previewing an app; doing UX/accessibility/redesign work; or continuing
  the phase-4 redesign. It carries the conventions, build workflow, design system,
  and gotchas that keep the three apps consistent. Read it before your first edit so
  you don't reinvent decisions or break the approved identity.
---

# Vhaaji prototype — working guide

A prototype for **Lesní školka Vhaaji**, a Czech forest kindergarten. Three role-based
apps, each built from modular `src/` files and compiled by `./build.sh` into one
self-contained offline file in `dist/`. No framework, no package manager, no tests.
All UI text is **Czech**.

- **guide / průvodce** (`src/scripts/pruvodce/`, mobile): dashboard, attendance, program, shifts, children, fund, contacts.
- **parent / rodič** (`src/scripts/rodic/`, mobile): dashboard, news, attendance+náhrady, child, payments, calendar, photos.
- **admin / vedení** (`src/scripts/admin/`, desktop-first, own `layout-admin.css`): sees all four sister schools.

## Read these first (the project remembers itself here)

The running record is more current than any summary. Before starting, read:

1. **`docs/decision-log.md`** — every decision, newest at the bottom. Read the last several entries; that's where you left off.
2. **`docs/design-system.md`** — approved palette, typography, state palette, component rules.
3. **`CLAUDE.md`** — the always-on project rules (structure, build, load order, domain conventions).
4. `docs/BRIEF.md`, `docs/flows.md`, `docs/objekty-systemu.md`, `docs/plan-faze-4.md` — brief, flows, domain objects, the phase-4 redesign plan.

## Golden rules (why they matter)

- **Never invent visuals.** The palette, typography, and logo are the **approved Vhaaji
  identity derived from vhaaji.cz** (phase 4). Visual decisions are the designer's domain.
  Derive from the design system or the real site; where a foundation is missing, ask and
  offer clear options — don't guess. (A skill like `ui-ux-pro-max` is fine for *principles*
  — hierarchy, contrast, state semantics — but do **not** adopt its palette/font/style
  recommendations; they conflict with the identity.)
- **Colors only through tokens.** All colors live in `src/styles/tokens.css`. Never hardcode
  a hex/rgba in components or templates. State colors (badges, chips, attendance codes) go
  through the `--state-*` palette (ok/info/warn/danger/neutral/muted/brand, each `-ink`/`-bg`).
  The shared attendance-code map `CODES` lives in `src/scripts/shared.js` and both apps use it.
- **Edit `src/`, then `./build.sh`. Never edit `dist/` by hand** — it is generated. The build
  inlines every local CSS/JS into one offline file (Google Fonts stay as a `<link>`; logo is an
  inline PNG data URI).
- **Microcopy: guide tyká, parent vyká, admin is impersonal.** Keep new text consistent with the
  app's form („Klepni/nastav" vs „Klepněte/Vyberte/váš"). Dates are „D. M. RRRR" with spaces.
- **Accessibility is not optional.** Text ≥ 4.5:1 (large/UI ≥ 3:1) — verify with a contrast
  script, don't eyeball. Touch targets ≥ 44×44 px (clickable area, not necessarily visual —
  e.g. expand a 30px `.chk` hit area with a `::before`). `:focus-visible` rings for keyboard nav.
  Respect `prefers-reduced-motion`. The Google-calendar imitation (`.gcal*`/`.gstep`/`.gcell`) is
  a deliberate copy — leave its colors and compact sizing alone.

## Design system (quick reference — details in `docs/design-system.md`)

- **Palette (from vhaaji.cz):** bg `#EFEEE9`, surface `#F9F7F1`, surface-2 `#E7E4DA`, text `#1F2A2E`,
  muted `#5C6560`, hint `#767B74`; primary `#2B7059` / primary-strong `#1F5344`; accent `#C8BC85`
  (fill) + accent-ink `#6F5F1C` (accent as **text** — the light accent fails AA as text); accent-soft
  `#C99C93` (rose, decorative only); info `#496D7E`; danger `#B0492F`; success `#387349`;
  on-primary `#F4EEDF` (text on colored fills). Soft tints `--tint-green/rose/ochre/blue`.
- **Typography (universal for all four schools):** headings **Bricolage Grotesque** (token
  `--font-serif` — historical name, value is sans), body/UI **Inter** (`--font-sans`). Google Fonts.
- **State palette:** `--state-<state>-ink` / `-bg`. Rewire any status color to these, never to a raw color.

## Build & preview workflow

1. Edit files under `src/`.
2. `./build.sh` (idempotent, no deps) → regenerates `dist/*.html` and `dist/index.html`.
3. Preview and **verify in the browser at both 375 px (mobile) and 1440 px (desktop)** — never ask
   the user to check manually. Check the console for errors.
4. **Cache gotcha:** when serving `src/` with a static server, the browser caches the separate
   `<script src>` files, so your JS edits may not show. **Test against the freshly built `dist/`
   file** (all JS inlined) and cache-bust the URL (`?v=N`). If a change "doesn't appear", it's
   almost always this — hard refresh.
5. Serve locally with `python3 -m http.server` (or the `.claude/launch.json` config). Don't use Bash
   for long-running dev servers if a preview tool is available.

## Architecture cheat-sheet

- **No framework.** State is top-level `let`/`const` in `core.js`/`data.js`. No reactivity — every
  mutation ends by calling `render()`, which rewrites `#content.innerHTML` from a template string.
- `SECTIONS` = `[key,label,icon]`; `RENDER` maps key → `renderX()` in `screens/<key>.js`. Nav calls `go(key)`.
- **Handlers are global**: inline `onclick=`/`oninput=` call functions assigned to `window.*` in the
  relevant screen file.
- **Overlays differ per app**: parent renders overlays inline into `#content` (they masonry into a
  tidy multi-column form on desktop); guide uses a separate `#modalRoot`. The parent dashboard now
  also has a real modal via `#modalRoot` (same-day absence).
- **Responsive shell** (`src/styles/layout.css`, mobile apps only): <900 px = drawer overlay + single
  column; ≥900 px = permanent left sidebar + content in a masonry (`column-count:2`, max-width ~1060,
  centered), with wide/primary elements spanning full width via a `column-span:all` list. Admin has its
  own shell.
- **The "current day" is hardcoded** to Wednesday 3. 6. 2026 (guide `TODAYD=3`/`TODAY=2`; parent
  `TODAY=3`, `NOW={d:3,h:10}`). June 2026 only; past days read-only, future editable. The prototype's
  June is fictional and does not line up weekday-for-weekday with the real workbook.

## Dashboard UX pattern ("soupis dne")

**Both dashboards** (parent and guide) were rebuilt as a **prioritized day summary** (see decision-log
iterations). Shape: big date header as the page title (`Eliška · středa 3. 6. ‹ ▾ ›`, topbar "Přehled"
hidden) then priority columns. Parent order: **1)** overdue invoice (full-width red alert) · **2)**
attendance status + one adaptive excuse action (today = same-day absence modal; future day = timely
omluvenka) · **3)** today (day program, guides with hours, menu) · **4)** what's ahead + news. Guide
order: attendance (counts + action + who's absent) · today (day program from `RYTMUS`, poem/song from
`TEMA`, events) · team & ops (guides on shift with hours, health notes). The **shared dashboard classes**
(`.dash-head`/`.dh-t`/`.ch`/`.dash3`/`.dcol`/`.cardlink`/`.prog-day`) live in `components.css` — reuse
them, don't fork; parent-specific day navigation stays in `screens-rodic.css`. `.dash3` = 2 cols ≥900 px,
3 cols ≥1200 px; mobile stacks in priority order.

## Real source data

`podklady/` (gitignored — real docs with personal data, never commit) holds the authoritative
material: `Pro rodiče 25_26 vhaaji.xlsx` (daily program per weekday in the **ČERVEN** tab, guide
hours in **ROZVRH a kontakty**, jídelníček), the guide/parent PDFs, and the extracted web identity in
`podklady/web-extract/`. Ground demo data in these where it matters; read the xlsx with `openpyxl`.

## Commits

Atomic (one logical change per commit), messages in English, and end each commit message with:
`Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Commit or push only when asked; branch first
if on the default branch. Rebuild `dist/` and include it in the commit for any change that affects it.

## Where things stand / next

Phases 0–4.4 done. **Both** dashboards (parent, guide) have been restructured into the "soupis dne"
pattern. Remaining in phase 4: **4.5** sister-school skins (color-only via `src/styles/skins.css`,
waiting on palettes = input V3) and **4.6** a Figma library; respondent testing is possible now. The
decision-log always has the freshest status — trust it over this line.
