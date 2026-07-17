# User flows

Diagramy hlavních scénářů prototypu (viz `docs/BRIEF.md`, kap. 2). Pokryty Flow 1 v průvodcovské appce (fáze 2) a Flow 2/3 v rodičovské (fáze 1); ostatní se doplní v dalších fázích. Diagramy odpovídají chování v kódu; objekty a stavy jsou popsané v `docs/objekty-systemu.md`.

Simulovaný čas je **středa 3. 6. 2026, 10:00**; omluvit lze do **8:00 dne absence**.

> GitHub vykresluje mermaid bloky automaticky. Lokálně použij náhled s podporou mermaid (VS Code rozšíření apod.).

---

## Flow 1 — Průvodce zapisuje docházku

Průvodce otevře appku a rovnou vidí dnešek; do denního rosteru je jedním klepnutím. Zdroj chování: `src/scripts/pruvodce/screens/prehled.js` (dashboard), `src/scripts/pruvodce/screens/dochazka.js` (roster). Počty se odvozují ze stejných funkcí jako docházka (`counts()`), nejsou natvrdo.

```mermaid
flowchart TD
  A([Otevření appky → Přehled]):::term --> B["Počty dnes<br/>přítomno · obědy · spí · po obědě · nepřítomní"]:::hi
  B --> C["Kdo dnes nepřijde<br/>(jmenovitě · u rodičovské omluvenky čas + důvod)"]
  C --> D["Básnička a písnička týdne · zdravotní poznámky · dnešní akce"]
  D --> E["Tlačítko „Otevřít dnešní docházku“<br/>(nebo proklik počtu na konkrétní tab)"]
  E --> F([Denní roster · dnes · výchozí tab]):::term
  F --> G["Klepnutí na dítě → stav / plán / spí<br/>(u dítěte s rodičovskou omluvenkou vidí čas + důvod)"]
  G --> H[/"Zápis do dat · toast „Docházka uložena“"/]
  H --> I{"Zpět na Přehled?"}:::dec
  I -->|ano| B
  I -->|ne| J["Pokračuje v rosteru"]
  classDef term fill:#DCE7DC,stroke:#2E5E43,color:#21402F,stroke-width:1.5px;
  classDef hi fill:#E2ECE2,stroke:#3C7A4E,color:#21402F;
  classDef dec fill:#F0E4CE,stroke:#B07D3A,color:#6f4e1e;
```

**Odloženo z Flow 1 (vědomě):** offline režim a stavy synchronizace (žádná fronta změn, žádný indikátor „bez signálu“) — potvrzení uložení je jen toast. Třídnice / zápis dne (čtení a doplňování zápisů z předchozího dne na dashboardu) je budoucí objekt, zatím není ani placeholder. Viz decision-log, fáze 2.

Ověřovací otázky briefu: průvodce po otevření vidí počty bez jediného kliku · do docházky je jedním klepnutím · je jasné, kdo nepřijde a proč.

---

## Flow 2 — Rodič omlouvá dítě

Z dashboardu jedním klikem. Deadline i vznik náhrady jsou vysvětlené před odesláním a znovu na potvrzení.

```mermaid
flowchart TD
  A([Dashboard / Docházka a náhrady]):::term --> B["Tlačítko „Omluvit dítě“"]
  B --> C["Výběr dní: od – do<br/>(default zítřek · minulé dny a víkendy nelze)"]
  C --> D["Důvod: nemoc / rodinné důvody / jiné<br/>(+ nepovinná poznámka)"]
  D --> E{"Deadline<br/>do 8:00 dne absence"}:::dec
  E -->|"den včas (zítra a dál)"| F["Vznikne náhrada"]:::ok
  E -->|"den po deadlinu (dnes)"| G["Náhrada nevznikne<br/>(dítě je stále omluvené)"]:::bad
  F --> H["Odeslat omluvenku"]
  G --> H
  H --> I[/"Zápis do dat: den = OM · omluvenka · náhrady"/]
  I --> J([Potvrzení: co se stalo, kolik náhrad vzniklo, co dál]):::term
  J --> K["Zobrazit náhrady →"]
  J --> L["Hotovo"]
  classDef term fill:#DCE7DC,stroke:#2E5E43,color:#21402F,stroke-width:1.5px;
  classDef dec fill:#F0E4CE,stroke:#B07D3A,color:#6f4e1e;
  classDef ok fill:#E2ECE2,stroke:#3C7A4E,color:#21402F;
  classDef bad fill:#F4E1D9,stroke:#B0492F,color:#7c3320;
```

**Pravidlo:** Vícedenní omluvenka počítá náhradu **za každý den zvlášť** — včasné dny → `dostupna`, dny po deadlinu → `nevznikla`. Stav celé omluvenky se řídí prvním dnem (`vcas` / `po-deadlinu`).

Ověřovací otázky briefu: rodič funkci nehledá v menu (je na dashboardu) · rozumí deadlinu (box před odesláním) · ví, jestli vznikla náhrada (potvrzení) · ví, co bude dál.

---

## Flow 3 — Rodič kontroluje náhrady

Zůstatek a seznam na jednom místě — bez dohledávání na faktuře nebo ve zprávách.

```mermaid
flowchart TD
  A([Dashboard — dlaždice Náhrady]):::term --> C
  B([Drawer → „Docházka a náhrady“]):::term --> C
  C["Zůstatek dostupných náhrad<br/>(odvozený z pole · + nejbližší expirace)"]:::hi
  C --> D["Seznam náhrad<br/>(původ · vznik · expirace +60 dní · stav)"]
  C --> E["Seznam omluvenek<br/>(rozsah · důvod · stav)"]
  E --> F{"Budoucí omluvenka?"}:::dec
  F -->|ano| G["„Zrušit“ → vrátí kalendář<br/>+ odečte vzniklé náhrady"]:::bad
  F -->|ne| H["Jen zobrazení"]
  classDef term fill:#DCE7DC,stroke:#2E5E43,color:#21402F,stroke-width:1.5px;
  classDef hi fill:#E2ECE2,stroke:#3C7A4E,color:#21402F;
  classDef dec fill:#F0E4CE,stroke:#B07D3A,color:#6f4e1e;
  classDef bad fill:#F4E1D9,stroke:#B0492F,color:#7c3320;
```

Ověřovací otázky briefu: rodič chápe počet dostupných náhrad · rozumí, za co vznikly (původ) · ví, dokdy je může využít (expirace) · nemusí dohledávat jinde.

---

## Stavové modely objektů

Stavy, ze kterých později vzniknou badge, potvrzení a empty states. Plánování/čerpání náhrady (výběr náhradního dne) je zatím mimo rozsah — stav `naplanovana` je jen v seed datech.

### Omluvenka

```mermaid
stateDiagram-v2
  [*] --> vcas: před deadlinem
  [*] --> po_deadlinu: po deadlinu
  vcas --> zrusena: zrušení (jen budoucí)
  po_deadlinu --> zrusena: zrušení (jen budoucí)
  zrusena --> [*]
  note right of po_deadlinu
    dítě omluvené, ale bez náhrady
  end note
```

### Náhrada

```mermaid
stateDiagram-v2
  [*] --> dostupna: včas omluvený den
  [*] --> nevznikla: den po deadlinu
  dostupna --> naplanovana: přiřazena k využití
  naplanovana --> vyuzita: vyčerpána
  dostupna --> expirovana: po 60 dnech
  dostupna --> [*]: omluvenka zrušena
  nevznikla --> [*]
  vyuzita --> [*]
  expirovana --> [*]
```

Do zůstatku se počítá jen stav `dostupna` — počet se všude odvozuje z pole (`dostupne()`), nikde není uložený jako číslo.

Seed data: Eliška pokrývá všech 5 stavů náhrad + 2 omluvenky (budoucí `vcas`, minulá `po-deadlinu`); Matěj 1 dostupnou.
