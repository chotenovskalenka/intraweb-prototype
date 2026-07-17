# Fáze 3 — Admin appka: vedení a administrativa (Flow 4 + Flow 5)

Tento dokument je **samostatné zadání**. Fáze je rozdělená na tři dílčí fáze (3.1–3.3), každou může provést jiný model s čistým kontextem. Před začátkem si přečti `CLAUDE.md`, `docs/BRIEF.md` (kap. 1 Vedení/administrativa, Flow 4, Flow 5, kap. 4 stavy Aktuality a Platby), `docs/objekty-systemu.md` a tento soubor celý. Proveď **jen svou dílčí fázi**.

---

## Kontext

Existují dvě mobilní appky (rodič, průvodce) postavené stejným vzorem: shell HTML + `<link>`/`<script src>` moduly, globální stav, `render()` do `#content.innerHTML`, `window.*` handlery (detailně v `CLAUDE.md`). `./build.sh` slepí každý `src/*.html` do samostatného `dist/prototyp_<name>.html` — nový `src/admin.html` tedy build zpracuje automaticky, beze změn skriptu.

Admin appka je **třetí, nová aplikace** pro roli vedení/administrativa. Od mobilních appek se liší:

- **desktop-first** — používá se na notebooku (viz BRIEF kap. 13); mobilní zobrazení stačí „nerozbité", ne optimalizované,
- **vidí všechny tři školky** — Vhaaji, Jaata, Maata (sesterské školky už figurují v seed datech průvodce; rodič a průvodce zůstávají single-school).

## Zafixovaná rozhodnutí (platí pro celou fázi 3)

1. **Stejný technologický vzor** jako mobilní appky: žádný framework, žádné ES moduly, globální scope, `render()` + `window.*` handlery. Struktura: `src/admin.html`, `src/scripts/admin/{data,core}.js` + `screens/*.js`, styly do `src/styles/screens-admin.css` + nový `src/styles/layout-admin.css` (desktopový shell). Sdílené soubory (`tokens.css`, `base.css`, `components.css`, `shared.js`) se používají, rozšiřují se jen při skutečné potřebě.
2. **Desktopový shell:** stálý levý sidebar s navigací (místo mobilního draweru), obsah s max šířkou ~980 px. Topbar s názvem sekce a badge role „Vedení". Vzhled skládej ze stejných tokenů — appka musí působit jako sourozenec mobilních.
3. **Role hospodářka spadá pod tuto appku** (správa fondu a plateb) — nezavádí se čtvrtá role. Zapiš do decision-logu.
4. **Simulovaný čas** shodný s ostatními: St 3. 6. 2026 (`TODAYD=3`), červen 2026.
5. **Data se nesdílejí** mezi appkami (jako dosud). Admin má vlastní seed v `src/scripts/admin/data.js`: tři školky, u každé kapacita a třídy/skupiny, souhrnná data dětí (počty, ne kompletní roster), neuhrazené faktury, náhrady, zápisy porad. Kde to dává smysl, čísla ať sedí s mobilními appkami (např. Eliška Dvořáková má neuhrazenou fakturu za březen — viz `rodic/data.js`).
6. **Fakturační modul se NEDĚLÁ** — brief pro něj nemá flow. Dashboard zobrazuje chybějící platby (kdo, kolik, po splatnosti) jen jako přehled s odkazem „řeší se mimo appku". Stavy platby z briefu (kap. 4) se použijí jako badge u seed dat. Decision-log.
7. **Vizuální styl se nemění** — existující tokeny a komponenty, žádné nové barvy a fonty.
8. Po každé dílčí fázi: `./build.sh`, smoke-test, decision-log, atomické commity, aktualizace `CLAUDE.md` (u 3.1 založení popisu admin appky, dál dle změn).

---

## Fáze 3.1 — Shell a dashboard vedení

**Cíl:** Založit admin appku s desktopovým shellem a dashboardem podle BRIEF kap. 1 (Vedení / administrativa).

Kroky:

1. `src/admin.html` (title „Administrativa (prototyp)", fonts, shell se sidebarem), `layout-admin.css`, `scripts/admin/core.js` (SECTIONS, RENDER, render, go), `scripts/admin/data.js` (seed: školky s kapacitami a obsazeností, chybějící platby, souhrn náhrad, provozní úkoly, systémová upozornění, poslední zápisy porad — zápisy stačí titulky, plná data přijdou v 3.3).
2. Sekce v navigaci: `prehled` (Přehled), `aktuality` (Aktuality), `porady` (Porady a evaluace), `platby` (Platby), `nahrady` (Náhrady) — sekce mimo 3.1 zatím renderují decentní „připravuje se" placeholder, ať navigace nevede do prázdna.
3. Dashboard (`screens/prehled.js`), shora: (a) kapacity tří školek (obsazeno/kapacita, vizuálně srozumitelné), (b) chybějící platby (kdo, částka, po splatnosti — badge stavů platby), (c) systémová upozornění vč. chybějících dat („u 2 dětí chybí kontakt"), (d) souhrn náhrad (dostupné celkem, kolik brzy expiruje), (e) provozní úkoly (jednoduchý checklist, odškrtávání funguje v paměti), (f) poslední porady/evaluace (titulky, proklik do sekce porad — zatím na placeholder).
4. Přidej odkaz na admin appku do rozcestníku (`index.html` v rootu) a ověř, že build vytváří `dist/prototyp_admin.html`.

**Smoke-test 3.1:** appka startuje do Přehledu; sidebar přepíná všech 5 sekcí bez chyb v konzoli; kapacity ukazují tři školky; odškrtnutí úkolu funguje; dist funguje offline; mobilní appky nezměněny (git diff).

---

## Fáze 3.2 — Aktuality s povinnými příjemci (Flow 4)

**Cíl:** Admin vytváří aktualitu, kterou nelze odeslat bez určení příjemců; vidí, komu odešla.

Kroky:

1. `screens/aktuality.js`: seznam existujících aktualit (seed: mix stavů — koncept, naplánovaná, odeslaná, archivovaná; u odeslaných viditelné komu). Použij aktuality konzistentní s NEWS v rodičovské appce (roupy, dřívější vyzvednutí…), ať simulace sedí.
2. Formulář nové aktuality: text, volitelně „důležité" (urgentní), **povinný výběr příjemců** — školka → volitelně třída/skupina (checkboxy, min. 1), náhled příjemců („odešle se rodičům: Vhaaji — všichni (25 rodin)"), tlačítka Uložit koncept / Odeslat.
3. Validace: bez příjemců nejde odeslat (tlačítko disabled + vysvětlení) — „bez určených příjemců" je chyba, ne stav. Koncept jde uložit i bez příjemců.
4. Stavy aktuality: `koncept`, `odeslana`, `archivovana` (přechody v UI: odeslat koncept, archivovat odeslanou); `naplanovana` jen v seed datech (plánování odeslání se nedělá — decision-log). Doplň objekt Aktualita do `docs/objekty-systemu.md` a Flow 4 do `docs/flows.md`.
5. Poznámka do decision-logu: propsání do rodičovské appky je simulované jen shodou seed dat (žádné sdílení).

**Smoke-test 3.2:** vytvoření aktuality bez příjemců → odeslání blokované s vysvětlením; po výběru školky/třídy se ukáže náhled příjemců; odeslání → aktualita v seznamu se stavem „odeslaná" a výčtem příjemců; uložení konceptu funguje; archivace funguje.

---

## Fáze 3.3 — Porady a evaluace se štítky (Flow 5)

**Cíl:** Vedení najde podklady pro inspekci: filtrování zápisů podle štítku a období, export.

Kroky:

1. Seed (`data.js`): ~8–10 zápisů porad a evaluací od září 2025 do června 2026, každý s datem, typem (porada/evaluace), školkou, účastníky a **odstavci označenými štítky**. Štítky: `hygiena`, `bezpečnost`, `personál`, `provoz`, `pedagogika`, `inspekce` (+ dle potřeby). Odstavce pište realisticky (kontrola lékárniček, revize smluv, adaptace nových dětí…).
2. `screens/porady.js`: seznam zápisů (filtr školka/typ), detail zápisu s odstavci a jejich štítky.
3. Filtrovaný výpis (jádro Flow 5): výběr štítku + období → zobrazí se **jen relevantní odstavce** napříč zápisy (s datem a odkazem na celý zápis) — ne celé dlouhé zápisy.
4. Export: tlačítko „Exportovat výpis" otevře tiskové zobrazení filtrovaného výpisu (`window.print()`; stačí jednoduchý print stylesheet, ať výpis vypadá k světu na papíře/PDF).
5. Přidání štítku k odstavci v detailu zápisu (jednoduché — chipy jako jinde). Vytváření nových zápisů stačí minimální (titulek + text + štítky), bez struktury odstavců navíc.
6. Objekty Porada/Evaluace a Štítek do `docs/objekty-systemu.md`, Flow 5 do `docs/flows.md`, dashboard dlaždici „poslední porady" propojit na skutečnou sekci.

**Smoke-test 3.3:** filtr štítek „hygiena" + období → výpis ukazuje jen odstavce s tím štítkem, s daty a odkazy; export otevře tiskové zobrazení výpisu; detail zápisu zobrazuje odstavce se štítky a jde přidat štítek; nový zápis jde vytvořit a objeví se v seznamu i filtru.

---

## Co NEdělat (celá fáze 3)

- Nesahat na rodičovskou a průvodcovskou appku (kromě odkazu v rozcestníku).
- Žádný fakturační modul, žádné přihlašování/oprávnění, žádná perzistence, žádné sdílení dat mezi appkami.
- Žádné plánované odesílání aktualit (naplánovaná = jen seed).
- Neměnit vizuální styl; mobilní optimalizaci admin appky neřešit nad rámec „nerozbité".

## Hotovo, když (celá fáze 3)

1. `dist/prototyp_admin.html` funguje offline, rozcestník má tři odkazy.
2. Flow 4 a Flow 5 jsou průchozí podle ověřovacích otázek briefu (nelze odeslat bez příjemců; admin ví, komu odešlo; štítky najdou konkrétní podklad; export dává použitelný výstup).
3. `objekty-systemu.md` obsahuje Aktualitu, Poradu/Evaluaci a Štítek; `flows.md` má Flow 4 a 5; decision-log doplněn; `CLAUDE.md` popisuje admin appku.
