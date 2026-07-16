# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Two standalone HTML prototypes of a mobile app for **Vhaaji** (Lesní školka Vhaaji), a Czech forest kindergarten. Each file is a self-contained single-page app for one role:

- [prototyp_pruvodce.html](prototyp_pruvodce.html) — the **guide/teacher** ("průvodce") app: attendance, program planning, staff shifts, children roster, cultural fund, contacts.
- [prototyp_rodic.html](prototyp_rodic.html) — the **parent** ("rodič") app: overview, news, attendance, child profile, payments, calendar, photos, contacts.

All UI text and domain vocabulary is **Czech**. There is no build step, no server, no dependencies to install, and no test suite.

## Running / previewing

Open the `.html` file directly in a browser (`open prototyp_pruvodce.html`), or serve the folder (`python3 -m http.server`) and load the file. Each is designed as a phone-width PWA-style screen. The only external network dependency is the Google Fonts `<link>` (Fraunces + Hanken Grotesk).

## Architecture (both files share the same pattern)

Each file is one HTML document with three parts: a large `<style>` block, static shell markup (`.phone > .screen` containing a `.drawer`, `.scrim`, `.topbar`, and an empty `#content`), and a single `<script>` that is the entire app.

- **No framework.** State lives in top-level `let`/`const` variables in the script. There is no reactivity — every state mutation ends by calling `render()`, which rewrites `#content.innerHTML` from a string built by the current section's render function.
- **Section routing:** `SECTIONS` is an array of `[key, label, icon]`. `RENDER` maps each section key to a `renderX()` function. `section` holds the active key; the drawer navigation calls `go(key)`.
- **Handlers are global.** Inline `onclick=`/`oninput=` in the generated HTML call functions assigned to `window.*` near the bottom of the script. When adding interactivity, define the handler as `window.foo = ...` and reference it inline in the template string.
- **Modals** (guide app): a set of nullable state vars (`modal`, `shiftM`, `cellM`, `detailA`) drive `renderModalRoot()`, which fills `#modalRoot`. Set the var + call `renderModalRoot()` to open; null it to close.
- **Data is seeded demo data** in-memory (e.g. `raw`/`data`/`AKCE`/`GUIDESHIFT` in the guide app, `children`/`NEWS`/`EVENTS`/`MENUS` in the parent app). Mutations are lost on reload — this is a prototype, not persisted.
- **Avatars** are generated deterministically as inline SVG from a name hash (`avHash` → `avatar()`); no image assets.
- **Focus preservation:** because `render()` destroys inputs, search fields use `renderKeepFocus()` (or targeted `innerHTML` updates like `#roster`) to avoid losing cursor position on each keystroke.

### Domain model / conventions to preserve

- **Attendance codes:** `C` celodenní (all-day), `D` dopolední (morning), `O` odpolední (afternoon), `OM` omluven (excused absent), empty/`N` = absent. Keep these consistent across both apps.
- **The "current day" is hardcoded** to June 3, 2026 (`TODAYD`/`TODAY`); the prototype operates within June 2026 only. Past days are read-only ("locked"); future days are editable.
- **Cultural fund** (`fond`) is tracked **per child**, not per class; paid events deduct only from children who attended and joined the event (see `renderOdecet`/`presentIdx` in the guide app).

## Commity

Pokud v tomto repozitáři vytváříš git commity, drž je **atomické** — jeden commit = jedna logická změna. Neslučuj nesouvisející úpravy (např. změnu v `prototyp_pruvodce.html` a v `prototyp_rodic.html`) do jednoho commitu, pokud spolu věcně nesouvisí.

## Styling

A shared design-token palette is defined in `:root` CSS variables (`--paper`, `--forest`, `--ochre`, `--ink`, etc.) using a warm/forest theme; fonts are Fraunces (serif, `--serif`) for headings and Hanken Grotesk (sans, `--sans`) for body. Reuse existing utility classes (`.tile`, `.row`, `.pchips`, `.btn-primary`, `.modal`, …) rather than adding new ones. The two files each carry their own copy of the styles — a change to shared look-and-feel must be made in both.
