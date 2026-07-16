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

### 2026-07-16 — Fáze 0.2 (Rodičovská appka)

- `prototyp_rodic.html` rozdělen do `src/scripts/rodic/` (data.js, core.js, modals.js, screens/{prehled,aktuality,dochazka,profil,platby,kalendar,plan,fotky,kontakty}.js) + `src/styles/screens-rodic.css`, shell `src/rodic.html`. Load order stejný vzor jako průvodce: shared → data → screens/* → modals → core.
- **`avatar`/`avHash` jsou byte-identické s `shared.js`** → z rodiče odstraněny, použit `shared.js`.
- **Rodičovský `showToast` je jiný** než v `shared.js` (vkládá `<div class="toast">` do `#toastbox` a po 1,8 s ho odstraní; sdílená verze používá pevný `#toast` + třídu `.on`). Ponechán v `rodic/core.js` jako `window.showToast` — přebije globální funkci ze `shared.js` (přiřazení běží později). Kandidát na sjednocení ve fázi 0.3.
- **Overlaye rodiče** (průvodce/fond/jídelníček/akce) se nevykreslují přes `#modalRoot`, ale inline do `#content` řízené stavem `overlay` → soubor `rodic/modals.js` (`renderGuide/renderFond/renderMenuDetail/renderAkceDetail` + `openGuide/openAkce/openFond/openMenu/closeOverlay`).
- **Nový sdílený token `--green:#3C7A4E`** přidán do `tokens.css` (používá jen rodič v `.ubadge.ano`; průvodce ho ignoruje).
- **Docházkové kódy:** rodič používá navíc kód `NE` (Neomluveno) oproti `C/D/O/OM` z CLAUDE.md. Zachováno; kandidát na sjednocení stavů ve fázi 1 (viz plán 0.3 bod 4).
- **CSS deduplikace (fáze 0.2 jen zaznamenává, sjednocení je 0.3).** Z rodiče se do `screens-rodic.css` nekopírují třídy byte-shodné s `components/layout` (19 tříd, mj. `.tile`, `.back`, `.contact`, `.av`, `.cal`, `.switch button.on`). Rodičovské **odlišné varianty sdílených tříd** jdou do `screens-rodic.css` (loaduje se poslední, takže vyhrávají): `.scroll` (spodní padding 22 vs 30), `.burger` (20 vs 21 px), `.ttl` (18 vs 19), `.ditem` (14,5 vs 15), `.tlab`, `.tval`, `.np`, `.vhead`, `.switch button`, `.pav`, `.pfull`, `.cbtn`, `.addbtn`, `.hint`, `.note2`, `.note`. Kandidáti na sjednocení v 0.3.
- **`body{…padding:0}`** rodiče je oproti sdílenému `base.css` navíc jen o `padding:0`, což už vynucuje `*{padding:0}` → vizuálně shodné, rodičovské `body` se do `screens-rodic.css` nekopíruje. Ověřeno: všech 258 ostatních rodičovských CSS pravidel je v poskládaném CSS přítomno.
- **`.role`** v rodiči se liší (chybí `white-space:nowrap`), ale v rodičovském markupu žádný `.role` prvek není → rozdíl je bez vizuálního dopadu.

## Nálezy

_(Zjištěné bugy / nekonzistence — v této fázi se NEOPRAVUJÍ, jen zaznamenávají.)_

- **Mrtvý kód v rodičovské appce** (definice bez jediné reference): data `WEATHER`, `WDEF`, `ALERTS`, `ORDER`; handlery `openMenu` (a tím i nedosažitelný overlay „Jídelníček" `renderMenuDetail`), `setCode`, `setNote`, `goEditDay`. Ponecháno; kandidáti na úklid v pozdější fázi.
- **`.odbtn` přebíjí `.ghostred`.** Tlačítko „Vrátit" v historii čerpání fondu má třídu `odbtn ghostred`; `.ghostred` (transparentní pozadí + červený rám) je v CSS definováno dříve než `.odbtn` (plné zelené pozadí), takže při stejné specificitě vyhrává `.odbtn` a tlačítko je zelené, ne červené/ghost. Zachováno beze změny (split kaskádu nemění). Kandidát na opravu mimo fázi 0.
- **Pravděpodobně mrtvý kód** v průvodcovské appce: `weekFor`, `PREDEF`, `dopoMap`/`setDopo`, `renderDenRoster`, `monthDay`/`closeMonthDay`, `.modes`/`.gchips` CSS — bez dohledatelného použití v šablonách. Ponecháno; kandidáti na úklid v pozdější fázi.
