# Výzkum – svačinářka a plánování svačin

> **⚠ Z velké části už zodpovězeno.** Tenhle dokument vznikl dřív, než se našel existující výzkum
> v `podklady/1. tým – Intranet školky.csv`. Ten odpovídá na otázky 3 i 4:
>
> - **Otázka 3 (podle čeho se rozhodne dát něco znovu):** neplánuje podle četnosti, ale podle
>   programu – *„zohledňuju podle měsíčního plánu Modré Máty – kdy jdou na výlet, co pečou. Když
>   je jejich vaření sladké, snažím se, aby druhá svačina byla slaná."* (R6).
>   → **Počítadlo `↻` měří špatnou věc.**
> - **Otázka 4 (alergie):** Terka – *„potřebuji rychle extrahovat předškoláky nebo alergiky."*
>   → **Jména alergiků u jídla mají oporu.**
>
> Zbývají otázky **1, 2 a 5** (nástroj a rytmus plánování, jak daleko zpět se dívá, změny na
> poslední chvíli). Ty stojí za doptání, ale nejsou blokující.
> Souvislosti viz [vyzkum-brief.md](vyzkum-brief.md).

**Typ:** krátký rozhovor o současné praxi (ne test prototypu).
**Rozsah:** 5 otázek, ~15 minut. Stačí **dvě svačinářky** ze čtyř školek – když řeknou totéž,
máš vzorec; když se rozejdou, zjistíš, že praxe není jednotná, a to je taky odpověď.

Tenhle výzkum je jiný než fáze 5 (`plan-faze-5.md`). Tam se testují hotové obrazovky
s respondenty. Tady se ptáme, **jak práce probíhá dnes**, protože nad jídelníčkem stojí dvě
funkce postavené na domněnce.

---

## Proč to vzniklo

Při stavbě sekce Jídelníček v průvodcovské appce (12. 8. 2026) vznikly dvě funkce, které
**nemají oporu ve výzkumu**:

| Funkce | Na čem stojí | Co nevíme |
|---|---|---|
| Listování do minulých týdnů | Plánování vychází z toho, co bylo – to platí u jakéhokoli postupu | jak daleko zpět se dívá |
| **Počítadlo opakování** (`↻ 6×`) | Domněnka, že ji zajímá četnost | jestli takhle vůbec přemýšlí |
| **Jména alergiků u jídla** | Domněnka, že dohledávání alergií zdržuje | jestli to není vyřešené jinak (seznam na lednici) |

Listování je bezpečné – je to prostá schopnost. Počítadlo a jména jsou **interpretace toho, jak
s informací pracuje**, a právě tam se hádá.

---

## Otázky

1. **Jak plánuješ svačiny na příští týden – co máš přitom před sebou?**
   Zjišťuje skutečný nástroj a rytmus (papír, tabulka, hlava, objednávkový systém dodavatele).
   Když plánování vůbec neprobíhá takhle dopředu, padá premisa celé obrazovky.

2. **Koukáš na to, co bylo? Jak daleko zpátky?**
   Ověřuje listování do historie a jeho hloubku. Odpověď „minulý týden" a „celý měsíc" znamenají
   jiný návrh – v prvním případě stačí jeden krok zpět, ve druhém je potřeba přehled měsíce.

3. **Podle čeho se rozhodneš, že něco dáš znovu?**
   Klíčová otázka pro počítadlo `↻`. Pokud odpoví „aby to nebylo dva dny po sobě", je relevantní
   *odstup*, ne *četnost*, a počítadlo měří špatnou věc. Neptat se na četnost návodně.

4. **Kde teď zjišťuješ, kdo má jakou alergii?**
   Podle mě důležitější než otázka 3 – na jménech u jídla stojí celá funkce. Když má seznam
   nalepený na lednici a je spokojená, řešíme neexistující problém.

5. **Stává se, že musíš svačinu měnit na poslední chvíli? Kvůli čemu?**
   Otevřená otázka na bolest, kterou jsme nevymysleli. Sem se vejde všechno, co nás nenapadlo
   (výpadek dodávky, nemoc, počet dětí, sklad).

---

## Jak se ptát

- **Neptat se na funkce, ptát se na včerejšek.** „Jak jsi plánovala tenhle týden?" je lepší než
  „Ocenila bys, kdyby…". Na druhou otázku odpoví ano každý.
- **Nepředstavovat prototyp před rozhovorem.** Až po něm – jinak odpovídá na to, co viděla.
- U otázky 3 **nepoužít slovo „opakování"**, dokud ho neřekne sama.

---

## Co s odpověďmi

- **Otázka 2** → hloubka historie v jídelníčku (kolik týdnů zpět má smysl držet).
- **Otázka 3** → osud počítadla `↻`: nechat / překlopit na odstup („naposled před 3 dny") / zrušit.
- **Otázka 4** → osud jmen u alergenů: nechat / zjednodušit / zrušit.
- **Otázka 5** → nové zadání, se kterým jsme nepočítali.

Nálezy zapsat do `decision-log.md` a případné úpravy provést v rámci fáze 5.2 (iterace podle
nálezů), ať se nestaví dvakrát.

---

## Stav

- [ ] rozhovor 1
- [ ] rozhovor 2
- [ ] nálezy zapsané do decision-logu
- [ ] rozhodnuto o počítadle `↻` a jménech u alergenů
