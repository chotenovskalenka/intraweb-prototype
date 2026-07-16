# Decision log — Fáze 0

Průběžný zápis rozhodnutí a nálezů během restrukturalizace prototypu (viz [plan-faze-0.md](plan-faze-0.md)).

## Rozhodnutí

### 2026-07-16 — Fáze 0.1 (Průvodcovská appka + build skript)

- Přesunut `BRIEF.md` → `docs/BRIEF.md` (git mv), založen tento decision-log.
- `prototyp_pruvodce.html` rozdělen do `src/` beze změny chování a vzhledu.
- **Pořadí `<script src>`:** shared → data → screens/* → modals → core. `core.js` je poslední, protože obsahuje úvodní `renderModalRoot(); render();`. `let`/`const` v pozdějších souborech (např. stavové proměnné v `core.js`) jsou funkčně dostupné i z dřívějších souborů — všechny klasické skripty sdílejí jeden globální lexikální scope; žádný kód na top-level dřívějšího souboru je nečte, takže nevzniká TDZ chyba.
- **Pořadí CSS (kaskáda):** tokens → base → layout → components → screens-pruvodce. Ověřeno, že přesun tříd mezi soubory nemění vypočtenou kaskádu (viz Nálezy — `.odbtn`/`.ghostred`).
- **Hranice components vs. screens-pruvodce.** Do `screens-pruvodce.css` šly třídy vázané na jednu obrazovku a pojmenované podle ní: `.specbar`/`.spectit`/`.specnums`, `.temanav`, `.works`/`.work`, `.frow`, `.odbtn`, `.rozh`/`.rozhd`, `.gchips`/`.gchip`. Zbytek (vč. sporných jako `.tabs`/`.tab`, `.switch`, `.modes`, `.selin`, `.rnote`, `.clink`, `.ghostred`) šel do `components.css`.
- **Rozdělení JS helperů.** `shared.js` = `avHash`, `avatar`, `esc`, `escTa`, `norm`, `fmt`, `showToast`, `renderKeepFocus`. `data.js` = seed data + čisté datové helpery používané více obrazovkami (`planCode`, `weekFor`, `here`, `staysPM`, `full`, `byAlpha`, `getCode`/`baseCode`/`todayCode`, `presentCount`, `dayLbl`, `serving`, `recordsFor`, `parentsFor`, `rozhovoryFor`, konstanty `DAYS`/`DOW`/`TODAY`/`TODAYD`/`wd`/`isWE`, mutovatelné mapy `worksMap`/`dopoMap`/`rozhovoryMap`, stavové konstanty scén `temaMonth`/`uspavaToday`). Funkce a stav používané jen jednou obrazovkou jsou v jejím `screens/*.js`.
- **`build.sh`** je bash bez závislostí; inlinuje lokální `<link rel=stylesheet>` a `<script src>` do `dist/prototyp_<name>.html`, externí URL (Google Fonts) nechává. Idempotentní, spustitelný z rootu.
- **Původní `prototyp_pruvodce.html` v rootu ponechán** — smaže se až ve fázi 0.5.

## Nálezy

_(Zjištěné bugy / nekonzistence — v této fázi se NEOPRAVUJÍ, jen zaznamenávají.)_

- **`.odbtn` přebíjí `.ghostred`.** Tlačítko „Vrátit" v historii čerpání fondu má třídu `odbtn ghostred`; `.ghostred` (transparentní pozadí + červený rám) je v CSS definováno dříve než `.odbtn` (plné zelené pozadí), takže při stejné specificitě vyhrává `.odbtn` a tlačítko je zelené, ne červené/ghost. Zachováno beze změny (split kaskádu nemění). Kandidát na opravu mimo fázi 0.
- **Pravděpodobně mrtvý kód** v průvodcovské appce: `weekFor`, `PREDEF`, `dopoMap`/`setDopo`, `renderDenRoster`, `monthDay`/`closeMonthDay`, `.modes`/`.gchips` CSS — bez dohledatelného použití v šablonách. Ponecháno; kandidáti na úklid v pozdější fázi.
