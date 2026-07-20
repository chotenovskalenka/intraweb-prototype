# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A prototype for **Vhaaji** (Lesní školka Vhaaji), a Czech forest kindergarten. There are three apps, one per role:

- **guide/teacher** ("průvodce", mobile): dashboard (přehled), attendance, news ("novinky" — create + WhatsApp share), program planning, staff shifts, children roster, cultural fund, contacts.
- **parent** ("rodič", mobile): overview, news ("novinky"), attendance, child profile, payments, calendar, photos, contacts.
- **management** ("vedení / administrativa", **desktop-first**): dashboard (přehled), news ("novinky", dřív aktuality), meetings & evaluations (porady), payments (platby), make-up days (náhrady). The **hospodářka** (bursar) role folds into this app — no fourth role. Unlike the mobile apps it is used on a laptop (sidebar shell, not a drawer) and **sees all four sister schools** — Vhaaji, Jaata, Kouzlo lesa, Maata (the mobile apps stay single-school). Phase 3 execution plan: [docs/plan-faze-3.md](docs/plan-faze-3.md).

Each app is built from **modular source files in `src/`** and compiled by [build.sh](build.sh) into a **single self-contained file in `dist/`** for sharing with respondents. All UI text and domain vocabulary is **Czech**. No framework, no package manager, no test suite. The only external network dependency is the Google Fonts `<link>` (Bricolage Grotesque + Inter). The logo is an inline PNG `data:` URI (offline).

The restructuring from the original monoliths into this layout is documented in [docs/plan-faze-0.md](docs/plan-faze-0.md); decisions and known bugs are logged in [docs/decision-log.md](docs/decision-log.md). Product brief: [docs/BRIEF.md](docs/BRIEF.md).

## Project structure

```text
index.html              root rozcestník (links to the three dist builds) — hosting entry point
build.sh                inlines src/ modules → single-file dist/*.html
/src
  pruvodce.html         shell: head + static markup + <link>/<script> tags
  rodic.html
  admin.html            management app shell (desktop sidebar, not a drawer)
  /styles               loaded in cascade order (see below)
    tokens.css          design tokens (semantic CSS variables)
    base.css            reset, body
    layout.css          .phone/.screen/.scroll/.topbar/drawer/scrim (mobile apps)
    layout-admin.css    desktop shell: .admin/.sidebar/.sb-item/.main/.topbar-a
    components.css      shared components (.tile, .row, .btn-*, .modal, .bdg, …)
    screens-pruvodce.css  guide-only screen styles
    screens-rodic.css     parent-only screen styles
    screens-admin.css     management-only screen styles
  /scripts
    shared.js           helpers used by all apps (avHash, avatar, esc, DOW, wd, …)
    /pruvodce           data.js, core.js, modals.js, screens/*.js
    /rodic              data.js, core.js, modals.js, screens/*.js
    /admin              data.js, core.js, screens/*.js (no modals yet)
/dist                   BUILD OUTPUT — do not edit by hand
  prototyp_pruvodce.html
  prototyp_rodic.html
  prototyp_admin.html
  index.html            generated rozcestník (relative links)
/docs                   BRIEF.md, plan-faze-*.md, decision-log.md, flows.md, objekty-systemu.md
```

The admin app loads its CSS in the order `tokens.css → base.css → layout-admin.css → components.css → screens-admin.css` (no `layout.css`; `layout-admin.css` replaces the mobile shell). Its `<script src>` order is `shared.js → data.js → screens/*.js → core.js` (no `modals.js` — admin has no overlays in phase 3.1).

## Running / previewing

- **Edit + preview live:** open `src/pruvodce.html` or `src/rodic.html` directly (`open src/rodic.html`, works over `file://`), or serve the repo (`python3 -m http.server`) and load `http://localhost:8000/src/rodic.html`. The `src/` files pull CSS/JS via relative `<link>`/`<script src>` — no build needed to see changes.
- **Share with respondents:** run `./build.sh`, then send `dist/prototyp_*.html` (each is one offline-capable file). `index.html` (root) is the entry point for hosting.

## Build

`./build.sh` (bash, no dependencies, idempotent, run from repo root) reads each `src/*.html`, inlines every local `<link rel="stylesheet">` into `<style>…</style>` and every local `<script src>` into `<script>…</script>`, and writes `dist/prototyp_<name>.html`. External URLs (Google Fonts) are left as-is. It also regenerates `dist/index.html`.

**Rule: never edit `dist/` by hand — it is generated. Edit `src/` and run `./build.sh`.**

## Load order matters (do not reorder casually)

- **`<script src>` order** (in each `src/*.html`): `shared.js` → `data.js` → `screens/*.js` → `modals.js` → `core.js`. Scripts are classic (not ES modules) and share one global scope; `core.js` is last because it runs the initial `render()` and reads constants/functions defined earlier.
- **CSS `<link>` order** (cascade): `tokens.css` → `base.css` → `layout.css` → `components.css` → `screens-*.css`. Screen styles load last so app-specific overrides win at equal specificity.

## Architecture (both apps share the same pattern)

- **No framework.** State lives in top-level `let`/`const` variables (in `core.js` / `data.js`). There is no reactivity — every state mutation ends by calling `render()`, which rewrites `#content.innerHTML` from a string built by the current section's render function.
- **Section routing:** `SECTIONS` is an array of `[key, label, icon]`. `RENDER` maps each section key to a `renderX()` function (defined in `screens/<key>.js`). `section` holds the active key; the drawer navigation calls `go(key)`.
- **Handlers are global.** Inline `onclick=`/`oninput=` in the generated HTML call functions assigned to `window.*`. When adding interactivity, define the handler as `window.foo = ...` in the relevant screen file and reference it inline in the template string.
- **Overlays / modals differ per app.** Guide: nullable state vars (`modal`, `shiftM`, `cellM`, `detailA`) drive `renderModalRoot()` filling `#modalRoot` (`pruvodce/modals.js`). Parent: an `overlay` state var renders inline into `#content` (`rodic/modals.js`).
- **Data is seeded demo data** in-memory (`raw`/`data`/`AKCE`/`GUIDESHIFT` in the guide; `children`/`NEWS`/`EVENTS`/`MENUS` in the parent), in each app's `data.js`. Mutations are lost on reload — this is a prototype, not persisted.
- **Avatars** are generated deterministically as inline SVG from a name hash (`avHash` → `avatar()` in `shared.js`); no image assets.
- **Focus preservation:** because `render()` destroys inputs, search fields use `renderKeepFocus()` to avoid losing cursor position on each keystroke.

### Domain model / conventions to preserve

- **Oslovení uživatele (mikrocopy, fáze 4.4):** the **guide/pruvodce app tyká** (informal 2nd person: „Klepni", „nastav"), the **parent/rodic app vyká** (formal: „Klepněte", „Vyberte", „váš"). The admin app is impersonal. Keep any new UI text consistent with the app's form. Dates are formatted „D. M. RRRR" (spaces).
- **State colours go through `--state-*` tokens** (ok/info/warn/danger/neutral/muted/brand, each `-ink`/`-bg`); the shared attendance-code map `CODES` lives in `shared.js`. Never hardcode a state colour — see [docs/design-system.md](docs/design-system.md) „Komponenty a stavy".
- **Attendance codes:** `C` celodenní (all-day), `D` dopolední (morning), `O` odpolední (afternoon), `OM` omluven (excused absent), empty/`N` = absent. The parent app additionally uses `NE` (neomluveno) where the guide uses empty. Keep letter codes consistent across both apps (unifying the extra states is deferred — see decision-log).
- **The "current day" is hardcoded** to Wednesday June 3, 2026. Guide: `TODAYD=3` (day of month) + `TODAY=2` (weekday index, Wed). Parent: `TODAY=3` (day of month), plus `NOW={d:3,h:10}` (simulated "now", St 3. 6. 10:00 — no `Date.now()`; used by the omluvenka deadline). The prototype operates within June 2026 only; past days are read-only ("locked"), future days editable.
- **Omluvenka (excuse) — parent app** (`child.omluvenky` in `data.js`; flow in `rodic/modals.js` overlay `omluvenka`). Rodič omlouvá dítě z dashboardu / sekce Docházka a náhrady: rozsah od–do, důvod, deadline vysvětlený před i po odeslání. **Deadline rule:** excuse allowed until **20:00 of the previous day** (`beforeDeadline(d)`; matches the real intraweb — see decision-log "revize dle reality"); a late excuse still marks the child excused (`OM`) but creates **no náhrada**. States: `vcas` / `po-deadlinu` / `zrusena`. Full spec (attributes, transitions) in [docs/objekty-systemu.md](docs/objekty-systemu.md).
- **Náhrada (make-up day) — parent app** (`child.nahrady` array in `data.js`). **1 timely-excused day = 1 náhrada** (per day for multi-day excuses); expires **at the end of the school year (30. 6.)** — make-up days don't carry over (matches reality). States: `dostupna` / `naplanovana` / `vyuzita` / `expirovana` / `nevznikla` (late excuse). The available balance is **always derived** from the array via `dostupne(child)` — never stored as a number. Planning/consuming a náhrada (picking a make-up day) is out of scope; `naplanovana` only appears in seed data. The parent's `dochazka` section is labelled **"Docházka a náhrady"** and holds the náhrady + omluvenky lists above the attendance calendar.
- **Cultural fund** (`fond`) is tracked **per child**, not per class; paid events deduct only from children who attended and joined the event (see `renderOdecet`/`presentIdx` in the guide app).
- **Guide dashboard (`prehled`) — the app's start screen** (`section='prehled'`, first entry in `SECTIONS`; `screens/prehled.js`). Shows today at a glance and is the entry point of Flow 1 (attendance): counts (derived from `counts()`, never hardcoded), who's absent today and why, the week's poem/song (current week = `Math.floor((TODAYD-1)/7)` of `TEMA.tydny`), health notes, today's event — one tap into the daily roster (`goDochTab`/`go('dochazka')`). A **parental excuse** propagated from a parent is simulated in seed only (`child.parentExcuse={time,reason}`, rendered via `parentExcuseLine`); it is **display-only** — the two apps still share no data. **Offline/sync states and the třídnice (day-log) object are deliberately deferred** — see decision-log fáze 2 and `docs/flows.md` Flow 1.

## Styling

Design tokens are defined as semantic `:root` CSS variables in [src/styles/tokens.css](src/styles/tokens.css): colors (`--color-primary`, `--color-accent`, `--color-accent-ink`, `--color-accent-soft`, `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-on-primary`, `--color-danger`, …), soft UI tints (`--tint-green/rose/ochre/blue`), `--radius-md`, and fonts `--font-serif` (**Bricolage Grotesque**, headings — note the token name is historical, the value is sans-serif) / `--font-sans` (**Inter**, body/UI). A `--space-*` scale exists but is not yet used. **The palette and typography are the approved Vhaaji identity derived from vhaaji.cz** (fáze 4.2 redesign — see [docs/design-system.md](docs/design-system.md)); the earlier forest palette + Fraunces/Hanken were unapproved scaffolding. Never hardcode colors — always go through tokens. Reuse existing utility classes (`.tile`, `.row`, `.pchips`, `.btn-primary`, `.modal`, …) rather than adding new ones.

Shared styles live once in `tokens/base/layout/components.css` (used by both apps). App-specific styles are in `screens-pruvodce.css` / `screens-rodic.css`. Some shared-looking classes still have per-app variants that differ visibly (font sizes, paddings) — these are catalogued in the decision-log under "Otevřená rozhodnutí" and left for a deliberate design decision; don't silently unify them.

## Commity

Pokud v tomto repozitáři vytváříš git commity, drž je **atomické** — jeden commit = jedna logická změna. Neslučuj nesouvisející úpravy (např. změnu v průvodcovské a rodičovské appce) do jednoho commitu, pokud spolu věcně nesouvisí. Commit messages anglicky, věcně.
