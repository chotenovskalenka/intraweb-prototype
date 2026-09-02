---
name: vyzkum-analyza
description: Postup pro spolehlivou AI analýzu kvalitativního výzkumu — hloubkových rozhovorů (přepisy) a průzkumů s otevřenými otázkami. Použij VŽDY, když se pracuje s přepisy rozhovorů, kódováním odpovědí, extrakcí insightů, citáty respondentů, validací discovery nebo syntézou výzkumu — i když uživatel neřekne výslovně „analýza". Zabraňuje cherry-pickingu, vymyšleným závěrům a špatné matematice.
---

# Analýza kvalitativního výzkumu

Smysl postupu: AI má tendenci předčasně syntetizovat, vyzobávat citáty, které sedí do příběhu,
a zveličovat. Proto se analýza dělí na oddělené kroky — **kontext → granulární data →
verifikace → syntéza** — a nikdy se nespojují do jednoho.

## A. Hloubkové rozhovory (přepisy)

### Krok 0 — Načtení kontextu
Přečti projektové briefy (cíle, produkty, role uživatelů). **Pouze internalizuj, žádné závěry.**
Pokud existuje dřívější analýza stejných dat (např. Miro board, starší insighty) a cílem je
nezávislá validace, **nedívej se do ní** — srovnává se až úplně nakonec.

### Krok 1 — Granulární analýza (po respondentech)
Projdi **každý přepis zvlášť** a extrahuj data, ne témata. Jeden výstupní soubor na respondenta.
Pro každého respondenta:

- **Profil** — role, školka/segment, kontext používání (zařízení, kdy, kde)
- **Value anchors** — co jim dnes funguje a proč u toho zůstávají (i mimo zkoumaný produkt)
- **Fragile points** — frustrace a workaroundy, každý s **intenzitou 1–5**
- **Doslovné citáty** — u každého tvrzení; nezkracovat, nechat „hmm", pauzy, nespisovnost;
  minimálně celá věta, ne fragment vytržený z kontextu
- **Fakta o používání** — kanály, frekvence, zařízení (pozorovatelné, ne interpretace)
- **Přání respondenta** — co si sám přeje (např. odpověď na „kouzelnou hůlku")

**Škála intenzity** (definuj vždy explicitně, tohle je default):
1 = zmínka bez emoce · 2 = drobná nepohoda · 3 = opakovaná frustrace nebo aktivní workaround ·
4 = silná emoce, stojí to čas/nervy pravidelně · 5 = rezignace (systém obchází úplně)

### Krok 2 — Verifikace a rozpory (stress test)
Teprve po Kroku 1, jako samostatný průchod:
- najdi **vnitřní rozpory** u každého respondenta (říká X, později připouští Y),
- najdi **rozpory mezi respondenty** (kdo tvrdí opak koho),
- ke každému klíčovému zjištění spočítej, **kolik respondentů ho skutečně podporuje** —
  a jmenovitě kteří; zjištění podložené jedním hlasem označ jako slabé,
- aktivně hledej **protipříklady** k nejsilnějším tvrzením, ne jen potvrzení.

### Krok 3 — Syntéza
Až po verifikaci: klíčová témata a doporučení. Každé téma musí odkazovat na konkrétní
respondenty a citáty z Kroku 1 a přiznat protichůdná data z Kroku 2. Bez nových tvrzení,
která nejsou v podkladech.

## B. Průzkumy a otevřené otázky

### Krok 1 — Induktivní kódování
Nech kategorie vzejít z dat (žádné předem dané „největší problémy"). Vytvoř **code book** —
seznam kódů s definicí a příkladem. Každá odpověď dostane **jeden primární kód**, kódy se
nesmí překrývat. Projdi řádek po řádku.

### Krok 2 — Intenzita
Ohodnoť intenzitu každé odpovědi na definované škále (defaultně 1–5 výše). Definici stupňů
uveď s příklady i zdůvodněním (few-shot) — jinak AI označí všechno za „negativní".

### Krok 3 — Audit a počty
- Náhodně vyber vzorek odpovědí a zkontroluj konzistenci kódů i intenzit.
- **Četnosti a procenta počítej vždy Pythonem** (napiš a spusť skript), nikdy v textu.

## C. Testování použitelnosti (moderované, se záznamem)

Jiný druh dat než A: jednotkou není téma, ale **nález** — konkrétní místo v UI, kde se
respondent zasekl, zaváhal nebo udělal něco jiného, než návrh čekal. Kroky jsou stejné
(kontext → granulární → verifikace → syntéza), mění se to, co se extrahuje.

### Pravidlo č. 1 — chování má přednost před výrokem
Co respondent **udělal** (kam klikl, kde hledal, co přeskočil) je tvrdá data. Co **řekl** o tom,
jak to bude používat, je hypotéza. Chvála je nejměkčí data ze všech — respondent mluví
k autorovi prototypu a je vstřícný. „To je super" bez chování, které to potvrzuje, není nález.
Do syntézy piš vždy chování a teprve k němu výrok.

### Krok 1 — Granulární: nálezy po respondentech
Jeden soubor na respondenta. Pro každý nález:

- **Kde** — obrazovka / úkol
- **Co se stalo** — pozorovatelně, bez interpretace („hledal omluvení v kartě dítěte,
  našel až v docházce"), a doslovný citát, pokud u toho mluvil
- **Závažnost** (viz škála níž)
- **Typ** — `bariéra` (nedokončil / špatná cesta) · `porozumění` (nechápe pojem, štítek, pravidlo)
  · `očekávání` (čekal jinou reakci) · `chybějící funkce` (chce něco, co tam není)
  · `kosmetika`
- **Moderace** — označ `NAPOVĚZENO`, pokud moderátor těsně předtím vysvětlil funkci, poradil
  nebo nabídl řešení. Takový nález má sníženou váhu a **nesmí** sloužit jako doklad, že věc
  je srozumitelná.

**Škála závažnosti** (u testování se nepoužívá intenzita 1–5 ze sekce A):
- **blokující** — úkol nedokončil, nebo dokončil jen po nápovědě
- **zaváhání** — došel sám, ale hledal, vracel se, zkusil špatnou cestu
- **kosmetika** — všiml si, nezdrželo ho to
- **přání** — funguje, ale chce navíc (není to chyba, ale patří do backlogu)

### Krok 2 — Verifikace
- Ke každému nálezu spočítej, **kolik respondentů ho doložilo chováním** (ne výrokem) — jmenovitě.
- Odděl nálezy, které vznikly po nápovědě moderátora.
- Hledej **protipříklad**: udělal to někdo bez zaváhání? Pak nejde o vlastnost návrhu,
  ale o rozdíl mezi lidmi (role, zkušenost) — a to je jiné doporučení.
- Rozliš **nález** (návrh selhal) od **rozporu s realitou** (návrh předpokládá jiný provoz,
  než jaký ve skutečnosti je) — druhé se neopravuje v UI, ale v zadání.

### Krok 3 — Syntéza
Dva oddělené výstupy, každý s jinou laťkou důkazu:

1. **Nálezy k opravě** — seřazené podle závažnosti a počtu respondentů; u každého citace
   a doporučení. Tři respondenti na hledání problémů v UI **stačí**.
2. **Generativní zjištění** — co se u testu dozvíš o jejich praxi mimo prototyp (workflow,
   kanály, pravidla provozu). Zpracuj postupem ze sekce A, ale **laťka je vyšší**: tři lidé
   jsou na tvrzení o tom, jak organizace funguje, málo — označ jako slabě podložené
   a k ověření.

**Nepočítej úspěšnost úkolů v procentech** při hrstce respondentů. Piš „2 ze 3", nikdy „67 %".

## Pravidla napříč

- **Step-by-step:** nikdy nespojuj kroky do jednoho průchodu; výstup kroku ulož do souboru,
  než začneš další.
- **Explicitní definice:** před analýzou vypiš, co znamená „citát", „frustrace" a stupně škály.
- **Osobní data:** výstupy s citáty a jmény respondentů patří do složky, která je v `.gitignore`
  (v tomto repu `discovery/validace/`; přepisy jsou v `discovery/přepisy/`, také ignorované).
  Do verzované dokumentace patří jen zjištění bez osobních údajů.
- **Markdown:** podklady i výstupy drž v .md se strukturou (nadpisy, metadata).
- **Srovnání s dřívější analýzou** (validace): dělej až jako úplně poslední krok, párově
  insight ↔ insight, a vypiš zvlášť (a) shody, (b) co nový průchod nenašel, (c) co našel navíc.
