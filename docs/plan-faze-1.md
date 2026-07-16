# Fáze 1 — Rodič: omluvenka a náhrady (Flow 2 + Flow 3)

Tento dokument je **samostatné zadání** pro model s čistým kontextem. Před začátkem si přečti `CLAUDE.md` (architektura, build, pravidla commitů), `docs/BRIEF.md` (hlavně kap. 1 Rodič, Flow 2, Flow 3 a kap. 4 Stavy) a tento soubor celý.

---

## Kontext

Prototyp je po fázi 0 modulární (viz `CLAUDE.md`). Tato fáze se týká **výhradně rodičovské appky** (`src/rodic.html`, `src/scripts/rodic/**`, `src/styles/screens-rodic.css`, případně `components.css`). Průvodcovské appky se nedotýkej.

Výchozí stav rodičovské appky:

- Sekce: prehled, aktuality, dochazka, profil, platby, kalendar, plan, fotky, kontakty (`core.js` → `SECTIONS`).
- Děti mají v `data.js` jen číslo `nahrady: 3` — žádný seznam náhrad, žádné stavy, žádná expirace.
- Omluvenka jako flow **neexistuje** — docházku lze měnit jen po dnech v sekci Docházka, bez důvodu, deadlinu a bez informace o náhradě.
- „Dnes" v prototypu je **středa 3. 6. 2026** (`TODAY=3`), prototyp žije v červnu 2026.

## Cíl fáze

Zprovoznit dva flows z briefu tak, aby byly testovatelné s respondenty:

- **Flow 2:** rodič omlouvá dítě — z dashboardu, s výběrem data, důvodem, viditelným deadlinem, potvrzením a informací, zda vznikla náhrada.
- **Flow 3:** rodič kontroluje náhrady — zůstatek, seznam, vznik, expirace, stav.

A přestavět dashboard rodiče podle priorit briefu (omluvenka jako hlavní akce).

## Zafixovaná rozhodnutí (neměnit)

1. **Simulovaný čas:** „teď" je **St 3. 6. 2026, 10:00**. Pevná konstanta v `data.js` (např. `NOW={d:3,h:10}`), žádné `Date.now()`.
2. **Pravidlo deadlinu:** omluvit lze do **8:00 dne absence**. Omluvenka odeslaná po deadlinu **projde** (dítě je omluvené), ale **náhrada nevznikne**. Důsledek pro test: omluva na dnešek (3. 6.) = po deadlinu → náhrada nevznikne; omluva na zítřek a dál = včas → náhrada vznikne. Obě větve tak jsou klikatelné.
3. **Pravidlo vzniku náhrady:** 1 včasná omluvenka na 1 den = 1 náhrada. Vícedenní omluvenka vytvoří náhradu za každý včas omluvený den.
4. **Expirace náhrady:** 60 dní od vzniku (jen zobrazovaná informace, prototyp nemusí expiraci aktivně vyhodnocovat nad rámec seed dat).
5. **Stavy omluvenky:** `vcas` (včas odeslána), `po-deadlinu`, `zrusena`. Stav „čeká na potvrzení" se v této fázi NEZAVÁDÍ — prototyp potvrzuje okamžitě (poznamenej do decision-logu jako otevřenou otázku pro flow průvodce/vedení).
6. **Stavy náhrady:** `dostupna`, `naplanovana`, `vyuzita`, `expirovana`, `nevznikla` (kvůli pozdní omluvě). Plánování využití náhrady (výběr dne) je **mimo rozsah** této fáze — stav `naplanovana` se objeví jen v seed datech.
7. **Umístění náhrad:** sekce `dochazka` se přejmenuje na **„Docházka a náhrady"** a náhrady budou její součástí (nová podčást/tab). Nezakládej novou top-level sekci. Na dashboardu bude dlaždice se zůstatkem, proklikem sem.
8. **Datový model:** číslo `nahrady: 3` v `data.js` nahraď polem objektů `nahrady: [...]` (vznik, expirace, stav, odkaz na původ) a polem `omluvenky: [...]`. Počet dostupných náhrad se všude **odvozuje** z pole, nikde není natvrdo. Seed data: u Elišky pokryj všechny stavy náhrad (dostupná, naplánovaná, využitá, expirovaná, nevznikla), u Matěje 1 dostupnou — ať jde testovat i rozdíl mezi dětmi.
9. **Kódy docházky:** omluvený den se v kalendáři docházky zobrazuje existujícím kódem `OM`. Nové kódy nezaváděj.
10. **Vizuální styl se nemění** — používej existující tokeny a komponenty (`.tile`, `.row`, `.pchips`, `.btn-primary`, `.bdg`, modal pattern rodičovské appky). Nové CSS třídy jen když není z čeho skládat, a pak do `screens-rodic.css`.

## Zadání

### 1. Dashboard (`screens/prehled.js`)

Přeuspořádej podle priorit briefu (shora): (a) tlačítko **„Omluvit Elišku/Matěje"** jako výrazná primární akce nahoře, (b) dlaždice **Náhrady** se zůstatkem a nejbližší expirací, proklik do Docházky a náhrad, (c) důležité info na dnešek/zítřek (už existuje — zachovej), (d) aktuality (zachovej), (e) stav plateb/fondu (zachovej či zhusti). Nic z existujícího obsahu nemaž bez náhrady — co se nevejde nahoru, posuň níž.

### 2. Flow omluvenky

Z dashboardu (a ze sekce Docházka a náhrady) se otevře omluvenka — použij overlay/modal pattern, jaký rodičovská appka už má:

1. výběr data: od–do (výchozí zítřek), jen dny v červnu, víkendy a minulé dny nevybratelné;
2. důvod: chipy `nemoc` / `rodinné důvody` / `jiné` + nepovinná poznámka;
3. **před odesláním** viditelná informace o deadlinu a co znamená: u data po deadlinu jasně řekni „omluva po deadlinu — náhrada nevznikne", u včasného „náhrada vznikne";
4. odeslání → potvrzovací obrazovka/toast: co se stalo, **zda a kolik náhrad vzniklo**, co bude dál;
5. omluvenka se propíše: den v kalendáři docházky dostane `OM`, vznikne záznam v `omluvenky`, případné náhrady v `nahrady`;
6. budoucí omluvenku lze **zrušit** (ze seznamu omluvenek v Docházce a náhradách) — zruší se i náhrady z ní vzniklé, kalendář se vrátí.

### 3. Sekce Docházka a náhrady (`screens/dochazka.js`, `core.js`)

Přejmenuj sekci v `SECTIONS`/`TITLES`. Doplň do ní: (a) zůstatek náhrad + seznam náhrad — každá se vznikem („za omluvu 4. 6."), expirací a stavem jako badge; (b) seznam omluvenek se stavem a možností zrušení budoucích; (c) existující kalendář docházky zachovej. Rozvržení (taby vs. bloky pod sebou) nech na svém úsudku — hlavní akce nesmí být hlouběji než 1 klik ze vstupu do sekce.

### 4. Dokumentace rozhodnutí

Založ `docs/objekty-systemu.md` a zapiš objekty **Omluvenka** a **Náhrada**: atributy, stavy, přechody, pravidlo deadlinu a vzniku náhrady (převzato z tohoto plánu + cokoli jsi musel/a dorozhodnout). Odchylky a nálezy do `docs/decision-log.md`. Aktualizuj `CLAUDE.md` (doménová sekce: omluvenka, náhrada, deadline, simulovaný čas `NOW`).

## Co NEdělat

- Nesahat na průvodcovskou appku ani sdílené soubory nad nutné minimum (`components.css` jen při skutečné potřebě).
- Nezavádět plánování/čerpání náhrady (výběr náhradního dne) — jen zobrazení stavů.
- Neřešit notifikace, push, e-maily, potvrzování průvodcem.
- Neměnit vizuální styl, fonty, barvy.
- Žádná perzistence — data žijí v paměti jako dosud.

## Hotovo, když

1. `./build.sh` proběhne a `dist/prototyp_rodic.html` funguje offline.
2. Smoke-test níže projde v `src/rodic.html` i v distu.
3. Ověřovací otázky briefu k Flow 2 a 3 mají v prototypu odpověď: rodič nehledá omluvenku v menu (je na dashboardu), deadline je vysvětlený před odesláním, po odeslání je řečeno zda vznikla náhrada, náhrady mají viditelný původ, expiraci a stav.
4. `docs/objekty-systemu.md` existuje, decision-log doplněn, `CLAUDE.md` aktuální.
5. Atomické commity (dashboard / flow omluvenky / sekce náhrad / dokumentace — dle logických celků).

## Smoke-test

1. Dashboard: nahoře tlačítko „Omluvit Elišku", dlaždice Náhrady se správným odvozeným počtem; přepnutí na Matěje změní jméno v tlačítku i počty.
2. Omluvenka na zítřek (Čt 4. 6.), důvod nemoc → potvrzení říká, že vznikla 1 náhrada; počet náhrad na dashboardu +1; v kalendáři docházky je 4. 6. `OM`; v seznamu omluvenek přibyla položka „včas".
3. Omluvenka na dnešek (St 3. 6.) → formulář předem upozorní na deadline; po odeslání potvrzení říká, že náhrada nevznikla; v seznamu náhrad je položka `nevznikla`.
4. Vícedenní omluvenka (např. 8.–9. 6.) → vzniknou 2 náhrady.
5. Zrušení budoucí omluvenky → zmizí `OM` z kalendáře, odečtou se náhrady z ní, stav omluvenky `zrusena`.
6. Seznam náhrad u Elišky ukazuje všech 5 stavů s expiracemi; u Matěje 1 dostupnou.
7. Ostatní sekce rodičovské appky fungují beze změny; průvodcovská appka nezměněna (git diff to potvrdí).
8. Žádné chyby v konzoli při průchodu všemi sekcemi a celým flow.
