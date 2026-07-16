# User flows

Diagramy hlavních scénářů prototypu (viz `docs/BRIEF.md`, kap. 2). Zatím pokryty flows fáze 1 v rodičovské appce; ostatní se doplní v dalších fázích. Diagramy odpovídají chování v kódu (`src/scripts/rodic/data.js`, `src/scripts/rodic/modals.js`); objekty a stavy jsou popsané v `docs/objekty-systemu.md`.

Simulovaný čas je **středa 3. 6. 2026, 10:00**; omluvit lze do **8:00 dne absence**.

> GitHub vykresluje mermaid bloky automaticky. Lokálně použij náhled s podporou mermaid (VS Code rozšíření apod.).

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
