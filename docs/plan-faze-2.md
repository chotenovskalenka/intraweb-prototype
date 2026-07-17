# Fáze 2 — Průvodce: dashboard a doladění Flow 1

Tento dokument je **samostatné zadání** pro model s čistým kontextem. Před začátkem si přečti `CLAUDE.md` (architektura, build, pravidla), `docs/BRIEF.md` (kap. 1 Průvodce a Flow 1), `docs/objekty-systemu.md` (omluvenka a náhrada z fáze 1) a tento soubor celý.

---

## Kontext

Tato fáze se týká **výhradně průvodcovské appky** (`src/pruvodce.html`, `src/scripts/pruvodce/**`, `src/styles/screens-pruvodce.css`, případně `components.css`). Rodičovské appky se nedotýkej.

Výchozí stav průvodcovské appky:

- Appka startuje rovnou do sekce `dochazka` — **žádný dashboard neexistuje**.
- Docházka (denní roster s taby Ráno/Spí/Po obědě/Nepřítomní) funguje a je jádrem Flow 1; ukládání potvrzuje toast.
- Tématický plán (hodnota měsíce, básničky/písničky po týdnech — `TEMA` v `data.js`) žije v sekci `plan`.
- „Dnes" je St 3. 6. 2026 (`TODAYD=3`, `TODAY=2`); v `AKCE` přes dnešek běží vícedenní akce.
- Rodičovská omluvenka z fáze 1 se průvodci nijak nepropisuje (appky mají oddělená data).

## Cíl fáze

Přidat průvodci dashboard podle priorit briefu a uživatelského výzkumu a dotáhnout Flow 1 tak, aby byl testovatelný od otevření appky: průvodce otevře appku → vidí dnešek (počty, kdo nepřijde, básnička týdne) → jedním klepnutím je v docházce.

## Zafixovaná rozhodnutí (neměnit)

1. **Offline režim a stavy synchronizace se NEDĚLAJÍ.** Žádný přepínač „bez signálu", žádná fronta změn. Potvrzení uložení zůstává existující toast. Zapiš do decision-logu jako vědomě odloženou část Flow 1.
2. **Třídnice se NEDĚLÁ.** V budoucnu má průvodce na dashboardu číst/doplňovat zápisy z předchozího dne — teď jen zapiš do decision-logu jako budoucí objekt (Třídnice / zápis dne) a na dashboard NEdávej ani placeholder.
3. **Priority dashboardu** (z výzkumu s průvodci, shora dolů):
   1. **počty dětí dnes** — nejdůležitější informace: přítomno / obědy / spí / po obědě jdou domů / nepřítomno,
   2. **rychlý vstup do docházky** — výrazné tlačítko, vede na dnešní roster,
   3. **kdo dnes nepřijde** — jmenovitě, s důvodem,
   4. **básnička a písnička aktuálního týdne** z tématického plánu,
   5. **zdravotní/provozní poznámky** (děti s poznámkou od rodičů),
   6. **dnešní akce** (pokud na dnešek nějaká je) — malá položka, proklik na detail.
4. **Nová sekce `prehled` („Přehled")** — první položka v `SECTIONS`, appka v ní startuje (`section='prehled'`). Stejné pojmenování jako v rodičovské appce.
5. **Aktuální týden tématického plánu se odvozuje** z `TODAYD` (3. 6. = 1. týden). Uprav seed `TEMA` tak, aby 1. týden měl vyplněnou básničku i písničku (přesuň obsah z 2. týdne), ať dashboard není při demu prázdný. Prázdný týden → decentní empty state s proklikem do Plánu.
6. **Simulovaná propsaná omluvenka od rodiče:** do seed dat přidej k 1–2 dnes omluveným dětem informaci, že omluvenku poslal rodič (čas + důvod ve stylu fáze 1, např. „omluveno rodičem dnes 6:40 · nemoc"). Zobraz ji na dashboardu v „kdo dnes nepřijde" a v detailu dítěte v rosteru docházky. Jen zobrazení — žádná logika, žádné sdílení dat mezi appkami.
7. **Počty na dashboardu se odvozují** ze stejných funkcí jako docházka (`counts()`, `here()`, …) — žádná čísla natvrdo. Změna v docházce → návrat na dashboard ukáže aktuální stav.
8. **Vizuální styl se nemění** — skládej z existujících komponent (`.tile`, `.np`, `.tab`, `.addbig`, `.bdg`, `.rnote`, …). Nové třídy jen při skutečné potřebě, do `screens-pruvodce.css`.

## Zadání

1. **`screens/prehled.js`** — nová obrazovka dashboardu podle priorit výše. Hlavička s dnešním datem (St 3. 6.) a kdo dnes slouží/otevírá (odvoď z `GUIDESHIFT` jako sekce Průvodci). Registrace v `SECTIONS`/`TITLES`/`RENDER` (core.js), start appky do `prehled`, script tag do `src/pruvodce.html`.
2. **Propojení:** tlačítko docházky → `go('dochazka')` (dnešní den, výchozí tab); básnička/písnička → proklik do Plánu; akce → existující detail akce; jméno dítěte v „kdo nepřijde" → docházka.
3. **Seed data** (`data.js`): úprava `TEMA` (bod 5), omluvenky od rodičů (bod 6).
4. **Dokumentace:** doplň Flow 1 (vstup přes dashboard) do `docs/flows.md`; decision-log (odložený offline/sync, odložená třídnice, rozhodnutí z průběhu); aktualizuj `CLAUDE.md` (nová sekce, startovní obrazovka).

## Co NEdělat

- Nesahat na rodičovskou appku.
- Žádný offline/sync, žádná třídnice (ani placeholder).
- Neměnit chování existující docházky nad rámec propojení z dashboardu.
- Neměnit vizuální styl, fonty, barvy.

## Hotovo, když

1. `./build.sh` proběhne, `dist/prototyp_pruvodce.html` funguje offline; smoke-test projde v `src/` i distu.
2. Ověřovací otázky Flow 1: průvodce po otevření appky vidí počty bez jediného kliku; do docházky se dostane jedním klepnutím; je jasné, kdo nepřijde a proč.
3. Decision-log a `flows.md` doplněny, `CLAUDE.md` aktuální.
4. Atomické commity (dashboard / seed data / dokumentace — dle logických celků).

## Smoke-test

1. Appka startuje do Přehledu: počty (přítomno, obědy, spí, po obědě, nepřítomno) odpovídají docházce; datum St 3. 6.; kdo dnes slouží.
2. „Kdo dnes nepřijde" ukazuje omluvené děti jmenovitě; u dětí s rodičovskou omluvenkou je vidět čas a důvod.
3. Básnička a písnička 1. týdne jsou vyplněné; proklik vede do Plánu na tématický plán.
4. Tlačítko docházky vede na dnešní roster; odškrtnu dítě, vrátím se na Přehled → počty se změnily.
5. Zdravotní poznámky (vši, po nemoci) jsou na dashboardu vidět; dnešní akce (Škola v přírodě) se zobrazuje s proklikem na detail.
6. Všech 8 sekcí (vč. nové) projde bez chyb v konzoli; rodičovská appka nezměněna (git diff).
