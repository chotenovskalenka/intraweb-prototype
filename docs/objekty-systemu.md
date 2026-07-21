# Objekty systému

Průběžná definice hlavních objektů systému (viz `docs/BRIEF.md`, kap. 3 a 4). Zatím jen objekty zavedené v prototypu; ostatní z briefu se doplní v dalších fázích.

Zdroj pravdy pro data: `src/scripts/rodic/data.js` (rodičovská appka). Počty a stavy se **odvozují z polí**, nikde nejsou natvrdo.

---

## Simulovaný čas

Prototyp nepoužívá `Date.now()`. „Teď" je pevná konstanta `NOW={d:3,h:10}` v `data.js` = **středa 3. 6. 2026, 10:00**. Prototyp žije v červnu 2026 (červen 2026 začíná pondělím, proto kalendáře nemají posun prvního dne).

---

## Omluvenka

Rodičem odeslaná omluva nepřítomnosti dítěte na jeden nebo více dní.

**Umístění v kódu:** `child.omluvenky: [...]` v `data.js`; flow v `src/scripts/rodic/modals.js` (overlay `omluvenka`), zobrazení seznamu v `src/scripts/rodic/screens/dochazka.js` (`renderOmluvenky`).

### Atributy

| Atribut | Význam |
|---|---|
| `id` | identifikátor |
| `od`, `do` | rozsah dní v červnu (číslo dne 1–30); jednodenní = `od===do` |
| `duvod` | `nemoc` / `rodinné důvody` / `jiné` |
| `pozn` | nepovinná poznámka pro průvodce |
| `stav` | viz níže |
| `nahradaIds` | id náhrad, které z omluvenky vznikly (i těch `nevznikla`) |

### Stavy

- **`vcas`** – omluvenka odeslána včas (před deadlinem prvního dne). Vznikly náhrady.
- **`po-deadlinu`** – odeslána po deadlinu. Dítě je omluvené, ale náhrada nevznikla.
- **`zrusena`** – rodič zrušil budoucí omluvenku. Docházka i vzniklé náhrady se vrátily.

> Stav **„čeká na potvrzení"** z briefu (kap. 4) se v této fázi NEZAVÁDÍ – prototyp potvrzuje omluvenku okamžitě. Otevřená otázka pro flow průvodce/vedení (viz decision-log).

### Pravidlo deadlinu

Omluvit lze do **20:00 předchozího dne** (`beforeDeadline(d)` v `data.js`; pravidlo převzato z reálného intrawebu – viz decision-log „revize dle reality"). Vzhledem k `NOW` (St 3. 6. 10:00):

- omluva na **dnešek (3. 6.)** = po deadlinu (deadline byl včera 20:00) → náhrada nevznikne;
- omluva na **zítřek (4. 6.)** = včas (deadline dnes 20:00) → náhrada vznikne;
- omluva na **pozdější dny** = včas.

Omluvenka odeslaná po deadlinu **projde** (dítě je omluvené), jen bez náhrady.

### Přechody

```
(nová) --odeslání před deadlinem--> vcas
(nová) --odeslání po deadlinu------> po-deadlinu
vcas | po-deadlinu --zrušení (jen budoucí)--> zrusena
```

Při zrušení: dny omluvenky se v kalendáři docházky vrátí (smaže se kód `OM`, platí `base`), a náhrady vzniklé z omluvenky se z pole `nahrady` odeberou.

### Propis do docházky

Každý omluvený den (mimo víkend) dostane v kalendáři docházky existující kód **`OM`** (Omluveno). Nové docházkové kódy se nezavádějí.

---

## Náhrada

Náhradní den vzniklý včasnou omluvou; lze jej vyčerpat i na příměstský tábor. V prototypu se náhrady jen zobrazují – **plánování/čerpání (výběr náhradního dne) je mimo rozsah** fáze 1.

**Umístění v kódu:** `child.nahrady: [...]` v `data.js`; zobrazení v `src/scripts/rodic/screens/dochazka.js` (`renderNahrady`/`nahRow`), zůstatek na dashboardu (`src/scripts/rodic/screens/prehled.js`).

### Atributy

| Atribut | Význam |
|---|---|
| `id` | identifikátor |
| `stav` | viz níže |
| `vznik` | datum vzniku (např. `12. 5. 2026`) |
| `exp` | datum expirace = konec školního roku (30. 6.); u `nevznikla` `–` |
| `puvod` | za co vznikla (např. `omluva 4. 6.`) |
| `plan` | (jen `naplanovana`) na co je naplánovaná |
| `pouzita` | (jen `vyuzita`) datum využití |
| `omId` | odkaz na omluvenku, ze které vznikla |

### Pravidlo vzniku

**1 včasná omluvenka na 1 den = 1 náhrada.** Vícedenní omluvenka vytvoří náhradu za každý včas omluvený den. Za den omluvený po deadlinu vznikne záznam se stavem `nevznikla` (aby byl v seznamu vidět, proč náhrada nepřibyla).

### Expirace

**Koncem školního roku (30. 6.)** – náhrady se do dalšího roku nepřenášejí (pravidlo převzato z reality, viz decision-log „revize dle reality"). Zobrazovaná informace; prototyp expiraci aktivně nevyhodnocuje nad rámec seed dat (stav `expirovana` je v seed datech nastaven ručně – náhrada z minulého školního roku).

### Stavy

- **`dostupna`** – k dispozici k vyčerpání. Jen tyto se počítají do zůstatku (`dostupne(child)`).
- **`naplanovana`** – přiřazená k budoucímu využití (v prototypu jen v seed datech).
- **`vyuzita`** – vyčerpaná.
- **`expirovana`** – propadlá (skončil školní rok, ve kterém vznikla).
- **`nevznikla`** – náhrada nevznikla kvůli pozdní omluvě (drží stopu po omluvě po deadlinu).

Zůstatek náhrad se **všude odvozuje** z pole (`dostupne()`), nikde není uložený jako číslo.

---

## Novinka (dřív „aktualita“)

Oznámení, které vedení/administrativa posílá rodičům konkrétních školek a tříd (Flow 4).

**Umístění v kódu:** `AKTUALITY: [...]` v `src/scripts/admin/data.js`; flow (seznam + formulář) v `src/scripts/admin/screens/aktuality.js`. Appka vedení je **desktopová a vidí všechny tři školky** (Vhaaji, Jaata, Maata) – na rozdíl od mobilních appek.

### Atributy

| Atribut | Význam |
|---|---|
| `id` | identifikátor |
| `text` | text novinky |
| `urgent` | příznak „důležité / urgentní" |
| `stav` | viz níže |
| `datum` | datum odeslání (u `naplanovana` popisný text „odešle se …") |
| `recip` | příjemci – mapa `skolkaId → {all:bool, tridy:[názvy tříd]}` |

### Příjemci (povinní)

Novinku **nelze odeslat bez určených příjemců** – „bez určených příjemců" (BRIEF kap. 4) je **chyba, ne stav**, v datech se neukládá. Příjemce lze zvolit na úrovni celé školky (`all:true`) nebo výběrem konkrétních tříd (`tridy`). Náhled příjemců (`recipText`) sestaví věty typu „Vhaaji – všichni (25 rodin)" / „Jaata – Sluníčka (12 rodin)"; počet rodin se odvozuje z obsazenosti školky/třídy (`obsazeno(s)` / `t.obs`), nikde není natvrdo. `hasRecip(recip)` je podmínka odeslání. Koncept jde uložit i bez příjemců.

### Stavy

- **`koncept`** – rozpracovaná, ještě neodeslaná. Lze upravit i odeslat (odeslání jen s příjemci).
- **`odeslana`** – odeslaná; u ní je vidět, komu odešla (`recip`). Lze archivovat.
- **`archivovana`** – uklizená z aktivního seznamu.
- **`naplanovana`** – naplánovaná k automatickému odeslání. **Jen v seed datech** – plánování odeslání se v prototypu nedělá (viz decision-log).

Přechody v UI: `koncept → odeslana` (Odeslat), `odeslana → archivovana` (Archivovat). Propsání do rodičovské appky je **simulované jen shodou seed dat** (aktuality „roupy" a „dřívější vyzvednutí" odpovídají `NEWS` v `rodic/data.js`) – appky spolu nesdílejí data.

---

## Porada / Evaluace (zápis)

Zápis z porady nebo evaluace v appce vedení (Flow 5). Slouží jako podklad pro inspekci – filtrovatelný podle štítků a období.

**Umístění v kódu:** `ZAPISY: [...]` v `src/scripts/admin/data.js`; sekce (seznam / detail / výpis / nový zápis) v `src/scripts/admin/screens/porady.js`. Stejná data napájejí i dashboardovou dlaždici „poslední porady" (`prehled.js`) – jeden zdroj pravdy.

### Atributy

| Atribut | Význam |
|---|---|
| `id` | identifikátor |
| `dt` | číselné datum `RRRRMMDD` – řazení a filtr období |
| `datum` | zobrazovaný text data (např. „18. 3. 2026") |
| `typ` | `porada` / `evaluace` |
| `skolka` | Vhaaji / Jaata / Maata |
| `nazev` | název zápisu (titulek v seznamu i na dashboardu) |
| `ucastnici` | pole jmen |
| `odstavce` | pole `{text, stitky:[]}` – jednotlivé body zápisu, každý s vlastními štítky |

### Chování

- **Seznam** filtruje podle školky a typu, řadí od nejnovějšího.
- **Detail** zobrazuje odstavce a jejich štítky; štítek u odstavce lze přidat/odebrat klepnutím (chip toggle).
- **Filtrovaný výpis** (jádro Flow 5): výběr štítku + období vypíše **jen odstavce** s daným štítkem napříč zápisy (s datem, školkou a odkazem na celý zápis) – ne celé dlouhé zápisy.
- **Export** (`window.print()`) otevře tiskové zobrazení výpisu; `@media print` skryje shell a ovládací prvky (třídy `.no-print`), ponechá jen obsah (třída `.print-only` zpřístupní tištěnou variantu štítků).
- **Nový zápis** je minimální (název + typ + školka + text + štítky = jeden odstavec).

## Štítek

Kategorizační značka odstavce zápisu; propojuje konkrétní podklad s tématem inspekce.

**Umístění v kódu:** `STITKY` v `src/scripts/admin/data.js` (pole názvů); použití na `odstavec.stitky`.

Hodnoty: `hygiena`, `bezpečnost`, `personál`, `provoz`, `pedagogika`, `inspekce`. Štítek je prostý řetězec (žádné id) – odstavec jich může mít víc. Filtr výpisu pracuje nad jedním vybraným štítkem; ve výsledku je shodný štítek zvýrazněný (`.stitek.hi`).
