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

- **`vcas`** — omluvenka odeslána včas (před deadlinem prvního dne). Vznikly náhrady.
- **`po-deadlinu`** — odeslána po deadlinu. Dítě je omluvené, ale náhrada nevznikla.
- **`zrusena`** — rodič zrušil budoucí omluvenku. Docházka i vzniklé náhrady se vrátily.

> Stav **„čeká na potvrzení"** z briefu (kap. 4) se v této fázi NEZAVÁDÍ — prototyp potvrzuje omluvenku okamžitě. Otevřená otázka pro flow průvodce/vedení (viz decision-log).

### Pravidlo deadlinu

Omluvit lze do **8:00 dne absence** (`beforeDeadline(d)` v `data.js`). Vzhledem k `NOW` (St 3. 6. 10:00):

- omluva na **dnešek (3. 6.)** = po deadlinu → náhrada nevznikne;
- omluva na **zítřek (4. 6.) a dál** = včas → náhrada vznikne.

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

Náhradní den vzniklý včasnou omluvou; lze jej vyčerpat i na příměstský tábor. V prototypu se náhrady jen zobrazují — **plánování/čerpání (výběr náhradního dne) je mimo rozsah** fáze 1.

**Umístění v kódu:** `child.nahrady: [...]` v `data.js`; zobrazení v `src/scripts/rodic/screens/dochazka.js` (`renderNahrady`/`nahRow`), zůstatek na dashboardu (`src/scripts/rodic/screens/prehled.js`).

### Atributy

| Atribut | Význam |
|---|---|
| `id` | identifikátor |
| `stav` | viz níže |
| `vznik` | datum vzniku (např. `12. 5. 2026`) |
| `exp` | datum expirace = vznik + 60 dní; u `nevznikla` `—` |
| `puvod` | za co vznikla (např. `omluva 4. 6.`) |
| `plan` | (jen `naplanovana`) na co je naplánovaná |
| `pouzita` | (jen `vyuzita`) datum využití |
| `omId` | odkaz na omluvenku, ze které vznikla |

### Pravidlo vzniku

**1 včasná omluvenka na 1 den = 1 náhrada.** Vícedenní omluvenka vytvoří náhradu za každý včas omluvený den. Za den omluvený po deadlinu vznikne záznam se stavem `nevznikla` (aby byl v seznamu vidět, proč náhrada nepřibyla).

### Expirace

**60 dní od vzniku** — zobrazovaná informace. Prototyp expiraci aktivně nevyhodnocuje nad rámec seed dat (stav `expirovana` je v seed datech nastaven ručně).

### Stavy

- **`dostupna`** — k dispozici k vyčerpání. Jen tyto se počítají do zůstatku (`dostupne(child)`).
- **`naplanovana`** — přiřazená k budoucímu využití (v prototypu jen v seed datech).
- **`vyuzita`** — vyčerpaná.
- **`expirovana`** — propadlá (uplynulo 60 dní).
- **`nevznikla`** — náhrada nevznikla kvůli pozdní omluvě (drží stopu po omluvě po deadlinu).

Zůstatek náhrad se **všude odvozuje** z pole (`dostupne()`), nikde není uložený jako číslo.
