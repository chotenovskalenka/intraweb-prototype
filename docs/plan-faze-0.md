# Fáze 0 — Restrukturalizace prototypu (prováděcí plán)

Tento dokument je **samostatné zadání** pro provedení fáze 0. Je psaný tak, aby každou dílčí fázi mohl provést jiný model s čistým kontextem. Před začátkem každé fáze si přečti tento soubor celý (hlavně Kontext a Neměnná pravidla) a pak proveď jen svou fázi.

---

## Kontext

Projekt je **low-fi HTML prototyp informačního systému lesní školky Vhaaji** (viz `BRIEF.md`, po fázi 0.1 `docs/BRIEF.md`). Výchozí stav:

- `prototyp_rodic.html` — appka pro rodiče (jeden soubor, ~57 KB)
- `prototyp_pruvodce.html` — appka pro průvodce (jeden soubor, ~70 KB)

Oba soubory jsou monolitické: velký `<style>` blok + statický shell (`.phone > .screen`, drawer, `#content`) + jeden `<script>`, který je celou aplikací. **Žádný framework** — stav v top-level proměnných, každá mutace končí voláním `render()`, které přepíše `#content.innerHTML` řetězcem z render funkce aktivní sekce. Handlery jsou globální (`window.*`), volané z inline `onclick`/`oninput`. Detailní popis architektury je v `CLAUDE.md`.

### Cíl fáze 0

Rozdělit oba monolity do modulární struktury **beze změny chování a vzhledu**, a přidat build skript, který z modulárních zdrojáků slepí zpět jednosouborové HTML k odeslání respondentům.

Klíčová rozhodnutí (už dohodnutá, neměnit):

1. **Obrazovky zůstávají jako JS render funkce** — žádné statické HTML fragmenty, žádný `fetch()` HTML sekcí. Šablony obrazovek se dělí do JS souborů po obrazovkách.
2. **Žádné ES moduly** — soubory se načítají obyčejnými `<script src>` tagy v pevném pořadí a sdílejí globální scope (zachovává současné chování `window.*` handlerů a top-level proměnných).
3. **`src/*.html` musí fungovat přímo** — dvojklikem (`file://`) i přes lokální server. Proto jen `<link>` a `<script src>`, nic co vyžaduje server.
4. **`dist/*.html` jsou samostatné jednosouborové buildy** — CSS i JS inlinované, fungují offline (jediná externí závislost zůstává Google Fonts `<link>`). Commitují se do gitu (kvůli snadnému sdílení / GitHub Pages).
5. **Vizuál se nemění.** Současná paleta zůstává; přejmenování tokenů na sémantické (`--color-primary` apod.) je až fáze 0.4 a nesmí změnit vypočtené hodnoty. Tři skiny se v fázi 0 NEDĚLAJÍ (odloženo za UI fázi).

### Cílová struktura

```text
/docs
  BRIEF.md            (přesunutý z rootu)
  plan-faze-0.md      (tento soubor)
  decision-log.md     (zápis rozhodnutí, průběžně doplňovaný)
/src
  rodic.html          (shell: head + statický markup + <link>/<script> tagy)
  pruvodce.html
  /styles
    tokens.css        (CSS proměnné)
    base.css          (reset, body, typografie)
    layout.css        (.phone, .screen, .scroll, .topbar, drawer, scrim)
    components.css    (sdílené komponenty: .tile, .row, .btn-*, .modal, .search, …)
    screens-rodic.css (styly specifické pro obrazovky rodiče)
    screens-pruvodce.css
  /scripts
    shared.js         (helpery sdílené oběma appkami: avHash, avatar, esc, …)
    /rodic
      data.js         (seed data: children, NEWS, EVENTS, MENUS, guides, …)
      core.js         (stav, SECTIONS/RENDER/TITLES, drawer, render(), go(), toast)
      screens/*.js    (jedna obrazovka = jeden soubor s render funkcí + jejími window.* handlery)
    /pruvodce
      data.js
      core.js
      modals.js       (renderModalRoot + modal HTML + jejich handlery)
      screens/*.js
/dist
  prototyp_rodic.html     (výstup buildu — negenerovat ručně)
  prototyp_pruvodce.html
build.sh
CLAUDE.md
```

Poznámka: rozdělení na `shared.js` vs. duplikované kusy se řeší až ve fázi 0.3 — fáze 0.1 a 0.2 smí nechat duplicitu.

---

## Neměnná pravidla pro všechny fáze

1. **Chování a vzhled se nesmí změnit.** Fáze 0 je čistě mechanická restrukturalizace. Žádné opravy „mimochodem", žádné vylepšování UX, žádné přejmenovávání funkcí nad rámec zadání fáze. Když najdeš bug, zapiš ho do `docs/decision-log.md` do sekce „Nálezy", ale neopravuj.
2. **Atomické commity** (viz `CLAUDE.md`): jedna fáze = typicky jeden commit; když fáze dělá dvě oddělitelné věci, commituj zvlášť. Commit messages anglicky, věcně.
3. **Každá fáze končí ověřením** podle smoke-test checklistu (příloha A) a zápisem do `docs/decision-log.md` (datum, fáze, co se udělalo, odchylky od plánu).
4. **Pořadí `<script src>` tagů je významné** — kód sdílí globální scope a `core.js` čte konstanty z `data.js` a render funkce z `screens/*.js`. Poslední script spouští úvodní `render()`.
5. **Pořadí CSS souborů je významné** (kaskáda): tokens → base → layout → components → screens-*.
6. **Kód i UI texty zůstávají česky**, identifikátory se nemění (např. `renderDochazka`, `AKCE`, `fond`).
7. Do každého souboru v `src/scripts/**` přidej na první řádek komentář s označením obrazovky, např. `/* SCREEN: PRUVODCE_DOCHAZKA */` nebo `/* CORE: PRUVODCE */` — to je náhrada za `SCREEN START/END` značky z BRIEF.md (kap. 8), přizpůsobená JS architektuře.

---

## Fáze 0.1 — Průvodcovská appka + build skript

**Cíl:** Rozdělit `prototyp_pruvodce.html` do `src/`, vytvořit `build.sh`, ověřit že `dist/prototyp_pruvodce.html` funguje shodně s originálem.

Kroky:

1. Vytvoř `docs/` a přesuň `BRIEF.md` → `docs/BRIEF.md` (git mv). Založ `docs/decision-log.md` (nadpis + prázdné sekce „Rozhodnutí" a „Nálezy").
2. Rozděl `prototyp_pruvodce.html`:
   - `<style>` blok → `src/styles/tokens.css` (obsah `:root{…}`), `base.css` (`*`, `body`), `layout.css` (`.phone`, `.screen`, `.scroll`, `.topbar`, `.burger`, `.ttl`, `.role`, `.scrim`, `.drawer`, `.dh`, `.ditem`, `.toast`), `components.css` (obecné třídy používané víc obrazovkami: `.tile`, `.row`, `.chk`, `.pill`, `.search`, `.rosterbox`, `.btn-*`, `.modal*`, `.filters`, `.bdg`, `.av`, `.empty`, `.hint`, `.note2`, `.back`, `.stepper`, `.cal*`, `.legend`, tabulka `.wt`, …), `screens-pruvodce.css` (zbytek — třídy vázané na konkrétní obrazovku: `.specbar`, `.temanav`, `.works`, `.gchip*`, `.frow`, `.odbtn`, `.rozh*`, …). Hranice components vs. screens urči podle toho, jestli třídu používá víc než jedna render funkce; sporné případy dej do components a poznamenej do decision-logu.
   - `<script>` → `src/scripts/shared.js` (`avHash`, `avatar`, `esc`, `escTa`, `norm`, `showToast`, `renderKeepFocus`, `fmt`), `src/scripts/pruvodce/data.js` (`raw`, `meta`, `data` a jeho seed mutace, `LEZ`, `guides`, `SCHOOL`, `RYTMUS`, `PROGOPTS`, `AKCE`, `PREDEF`, `TEMA*`, `GUIDESHIFT`, `SEEDFOND`, `SPECIAL`, konstanty `DAYS`/`DOW`/`TODAY`/`TODAYD`, pomocné čisté funkce nad daty: `planCode`, `weekFor`, `recordsFor`, `parentsFor`, `rozhovoryFor`, `getCode`, `presentCount`, `here`, `staysPM`, `full`, `wd`, `isWE`, …), `src/scripts/pruvodce/core.js` (stavové proměnné, `SECTIONS`, `TITLES`, `RENDER`, `renderDrawer`, `render`, `go`, drawer handlery, úvodní spuštění), `src/scripts/pruvodce/modals.js` (`renderModalRoot`, `akceModalHTML`, `shiftModalHTML`, `cellModalHTML`, `akceDetailHTML` + jejich open/close/set/save handlery), `src/scripts/pruvodce/screens/` — po jednom souboru: `dochazka.js`, `plan.js`, `pruvodci.js`, `kalendar.js`, `deti.js`, `fond.js`, `kontakty.js`. Každý screen soubor obsahuje svou render funkci (vč. pomocných, které používá jen ona) a svoje `window.*` handlery.
   - `src/pruvodce.html` — DOCTYPE, head (meta, title, fonts), statický shell, `<link>` tagy na CSS v kaskádovém pořadí, `<script src>` tagy v pořadí: shared → data → screens/* → modals → core (core spouští úvodní render, proto poslední).
3. Napiš `build.sh` (bash, bez závislostí): pro každý `src/*.html` vytvoří `dist/prototyp_<name>.html`, kde každý `<link rel="stylesheet" href="…">` na lokální soubor nahradí `<style>…obsah…</style>` a každý `<script src="…"></script>` nahradí `<script>…obsah…</script>`. Externí URL (Google Fonts) nechává beze změny. Skript musí být idempotentní a spustitelný z rootu repa (`./build.sh`).
4. Spusť build, otevři `dist/prototyp_pruvodce.html` v prohlížeči a projdi smoke-test (příloha A, část Průvodce). Ověř i přímé otevření `src/pruvodce.html`.
5. Původní `prototyp_pruvodce.html` v rootu **zatím nemaž** — smaže se ve fázi 0.5.
6. Zapiš do decision-logu, commituj (přesun briefu + založení docs zvlášť; split + build zvlášť).

**Hotovo, když:** `src/pruvodce.html` i `dist/prototyp_pruvodce.html` projdou smoke-testem a chovají se shodně s `prototyp_pruvodce.html`.

---

## Fáze 0.2 — Rodičovská appka

**Cíl:** Stejný postup pro `prototyp_rodic.html`.

Kroky:

1. Rozděl `prototyp_rodic.html` analogicky: styly do `screens-rodic.css` + doplnění `components.css`/`layout.css` **pouze pokud** třída v nich ještě není (pozor: obě appky mají mírně odlišné kopie stejných tříd — v této fázi dej rodičovské varianty odlišných tříd do `screens-rodic.css` a rozdíl zapiš do decision-logu; sjednocení je fáze 0.3).
2. Skript rozděl do `src/scripts/rodic/` (data.js, core.js, screens/*.js — po jedné na sekci: `prehled.js`, `aktuality.js`, `dochazka.js`, `profil.js`, `platby.js`, `kalendar.js`, `plan.js`, `fotky.js`, `kontakty.js`; případné modaly do `modals.js`). Funkce duplikované se shared.js (avatar, esc, …) z rodiče smaž a použij shared.js — ale jen pokud jsou **doslovně shodné**; když se liší, nech rodičovskou variantu v `rodic/core.js` a zapiš do decision-logu.
3. `src/rodic.html` shell + build + smoke-test (příloha A, část Rodič) pro `src/rodic.html` i `dist/prototyp_rodic.html`.
4. Decision-log, atomický commit.

**Hotovo, když:** obě verze rodičovské appky projdou smoke-testem shodně s originálem.

---

## Fáze 0.3 — Deduplikace sdíleného kódu

**Cíl:** Sjednotit duplicitní/rozjeté kusy mezi appkami, aby existoval jeden zdroj pravdy pro sdílené věci.

Kroky:

1. Projdi decision-log z fází 0.1–0.2 (seznam rozdílných variant) + udělej vlastní diff sdílených tříd a funkcí.
2. CSS: třídy, které existují v obou appkách v odlišné variantě, sjednoť do `components.css`/`layout.css` na **jednu** variantu. Volbu varianty dělej konzervativně (vizuálně nerozlišitelné rozdíly sjednoť bez ptaní; viditelné rozdíly vypiš do decision-logu a ponech zatím obě varianty — rozhodne uživatel).
3. JS: helpery shodné funkčností, ale ne doslovně (např. toast s/bez `#toastbox`), sjednoť do `shared.js`, pokud to nezmění chování ani jedné appky; jinak ponech a zapiš.
4. Sjednoť kódy docházky: obě appky musí používat stejné kódy `C/D/O/OM` a stejné popisky (rodič má navíc `NE` — zachovat, jen zapsat do decision-logu jako kandidáta na sjednocení stavů ve fázi 1).
5. Build, smoke-test obou appek, decision-log, commit.

**Hotovo, když:** žádná CSS třída ani helper funkce neexistuje ve dvou tichých variantách — buď je sjednocená, nebo vědomě vedená v decision-logu.

---

## Fáze 0.4 — Sémantické tokeny

**Cíl:** Přejmenovat design tokeny na sémantické názvy jako přípravu na budoucí skiny. **Vypočtený vzhled se nesmí změnit ani o pixel.**

Kroky:

1. V `tokens.css` zaveď sémantickou vrstvu, např.: `--color-primary` (dnes `--forest`), `--color-primary-strong` (`--forest-dk`), `--color-accent` (`--ochre`), `--color-bg` (`--paper`), `--color-surface` (`--card`), `--color-surface-2` (`--card2`), `--color-text` (`--ink`), `--color-text-muted` (`--muted`), `--color-text-hint` (`--hint`), `--color-danger` (`--danger`), `--color-info` (`--sleep`), `--color-border` (`--line`), `--color-border-strong` (`--line2`), `--radius-md` (`--r`), `--font-serif`, `--font-sans`. Doplň spacing škálu (`--space-xs/sm/md/lg`) zatím **bez použití** — jen definice.
2. Nahraď použití starých názvů v celém CSS novými. Staré aliasy smaž (žádná kompatibilní vrstva — repo je malé, ať je jeden zdroj pravdy). Pozor: v JS template stringách jsou inline styly s `var(--forest)` apod. — nahraď i tam (grep celé `src/`).
3. Zdokumentuj mapování starý→nový v decision-logu.
4. Build, vizuální kontrola obou appek (mělo by být pixel-perfect shodné), smoke-test, commit.

**Hotovo, když:** grep na staré názvy tokenů v `src/` nevrací nic a obě appky vypadají stejně jako před fází.

---

## Fáze 0.5 — Úklid, dokumentace, publikace

**Cíl:** Odstranit staré monolity, zaktualizovat dokumentaci, zprovoznit sdílení odkazem.

Kroky:

1. Smaž `prototyp_rodic.html` a `prototyp_pruvodce.html` z rootu (git rm) — jejich roli přebírá `dist/`.
2. Přepiš `CLAUDE.md`: nová struktura projektu, build (`./build.sh`), pravidlo „needituj `dist/`, edituj `src/` a spusť build", pravidlo pořadí script/link tagů, odkaz na `docs/plan-faze-0.md` a `docs/decision-log.md`, zachovej sekce o doménovém modelu, stylingu a atomických commitech (aktualizuj, kde odkazují na staré soubory).
3. Vytvoř `index.html` v rootu (nebo `dist/index.html`) — jednoduchý rozcestník se dvěma odkazy: Rodič / Průvodce. Slouží jako vstupní bod pro hosting.
4. Připrav publikaci odkazem: pokud je k dispozici GitHub remote, nastav GitHub Pages (servírovat root nebo `dist/`); pokud ne, napiš do `docs/decision-log.md` krátký návod na Netlify Drop (přetáhnout `dist/` na app.netlify.com/drop). Nic nepublikuj bez potvrzení uživatele.
5. Build, finální smoke-test obou dist souborů, commit (úklid a dokumentace odděleně od rozcestníku).

**Hotovo, když:** v rootu nejsou monolity, `CLAUDE.md` odpovídá realitě, existuje vstupní `index.html` a je jasná cesta k odkazu pro respondenty.

---

## Příloha A — Smoke-test checklist

Testuj v prohlížeči, ideálně v mobilním viewportu (~390 px). Po každé fázi projdi checklist příslušné appky (po 0.1 jen Průvodce, od 0.2 obě).

### Průvodce (`pruvodce.html`)

1. Appka se načte do sekce Docházka, den = St 3. 6., taby Ráno/Spí/Po obědě/Nepřítomní s počty.
2. Burger otevře drawer; přepni na každou ze 7 sekcí a zpět (žádná JS chyba v konzoli).
3. Docházka: odškrtnutí dítěte (checkbox) přesune dítě mezi taby a změní počty obědů v patičce; rozklik řádku otevře edit panel; přepnutí Dopol./Odpol./Celodenní a Spí/Nespí funguje; vyhledávání filtruje a neztrácí focus.
4. Docházka Den: šipkami na 4. 6. — zobrazí se specbar „Horolezení"; minulý den (2. 6.) je jen ke čtení; budoucí den — klik na dítě otevře modal a změna kódu se uloží (toast).
5. Docházka Týden/Měsíc: týdenní tabulka se sticky hlavičkou a součty; budoucí buňka klikatelná (modal); měsíc — klik na den otevře denní seznam.
6. Plán: vytvoření nové akce (modal, uložení, objeví se v seznamu), úprava a smazání akce; rozklik dne v Týdenním rytmu a uložení; přepnutí Květen/Červen v tématickém plánu + „Zkopírovat květen do června".
7. Průvodci: dnešní služby + volba „Dnes uspává"; klik do buňky týdenní tabulky NEotevírá nic (jen ke čtení).
8. Kalendář: klik na den zobrazí akce/program dole; klik na akci otevře detail; Upravit z detailu otevře edit modal.
9. Děti: filtry Všechny/Předškoláci/Alergici, vyhledávání, otevření detailu dítěte, přidání záznamu rozhovoru (toast), nahrání práce (přibude dlaždice), zpět na seznam.
10. Fond: „Odečíst" u placené akce → výběr dětí (Celá třída/Jen předškoláci/Vlastní výběr), potvrzení strhne částky a akce dostane „odečteno ✓"; ruční čerpání celé třídě; „Vrátit" v historii částky vrátí.
11. Kontakty: telefony/e-maily jsou odkazy (`tel:`/`mailto:`).

### Rodič (`rodic.html`)

1. Appka se načte do Přehledu; přepínač dětí (Eliška/Matěj) v topbaru mění obsah.
2. Drawer: projdi všech 9 sekcí bez JS chyb.
3. Přehled: zobrazuje dnešek (počasí, jídelníček/akce), urgentní alerty.
4. Aktuality: seznam zpráv, filtrování relevance.
5. Docházka: kalendář s kódy dne, omluvení/změna dne (kde to prototyp umožňuje), respektuje zamčené dny.
6. Profil dítěte, Platby (faktury vč. stavu uhrazeno/neuhrazeno a fondu), Kalendář (měsíc, dny s událostmi, detail dne), Plán, Fotky, Kontakty — každá sekce se vykreslí a interakce v ní nefailují.

(Checklist rodiče u bodů 3–6 ověř proti chování původního `prototyp_rodic.html` — originál je referenční.)

---

## Příloha B — Zadání pro model provádějící fázi

Uživatel spustí každou fázi zadáním ve stylu:

```text
Přečti si docs/plan-faze-0.md a proveď fázi 0.X.
Dodržuj Neměnná pravidla. Na konci projdi smoke-test,
zapiš decision-log a commituj.
```

Model nesmí přeskakovat do dalších fází ani dělat vylepšení mimo zadání své fáze.
