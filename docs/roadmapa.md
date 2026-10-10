# Roadmapa – dokončení návrhu

Stav k 10. 10. 2026. **Pořadí potvrzené Lenkou:** 1 kuchyň · 2 admin · 3 Figma (narovnání
patternů) · 4 skiny · 5 předávka. Hotovo z bodu 0: cizí soubory odstraněny z repa i historie.

 Cíl: **co nejdřív uzavřít návrh** tak, aby šel předat vývoji (Pat)
a uzavřít case study. Testování s respondenty už neproběhne – rozsah se proto opírá
o hotový výzkum a první kolo testování, ne o další ověřování.

**Jednotka odhadu:** „den" = jeden soustředěný pracovní den designérky s AI (tempem, jakým
vznikly nálezy P1–P6 + role Kuchyň, tedy cca 6–8 commitů denně). Odhady jsou střední;
rozptyl ±30 % u stavby, ±50 % tam, kde chybí vstup od někoho dalšího.

## Stav k 10. 10. 2026 večer – hotovo až po Figmu

**Hotovo:** 0 (cizí soubory pryč z repa i historie) · kuchyň (napříč školkami Vhaaji / Jaata /
Maata, svačinové jídelníčky po školkách) · **admin kompletně** – Náhrady (hodiny, pravidlo
podle školky, náhled pravidla), Přehled (co vyžaduje akci), Platby (faktury, vystavení
s náhledem, upomínky, ruční „uhrazeno"), Děti a matrika (kompletnost, export MŠMT, pozvánka
k doplnění) · **rodičovské náhrady v hodinách** (stejná čísla jako admin) · stabilizace
(široké tabulky, slovník editoru buňky, mrtvý kód poznámek, pravidlo 8:30 u rodiče).
Ověřeno: všechny sekce, 4 role průvodce + rodič + admin, 375 / 1024 / 1440 px, konzole čistá.

**Pozastaveno na pokyn Lenky** („po Figmu, dál to nedělej, budeme appku ještě hodně ladit"):
3 Figma · 4 skiny · 5 předávka. Navazují, až bude ladění hotové.

**Otevřené otázky z této etapy** (všechny v decision-logu): pravidla náhrad Jaaty a Kouzla
lesa · jak se tábor v červenci počítá z hodin, které propadají 30. 6. · Maata „50 %
v 1. pololetí" · zda se má čerpání po hodinách ukazovat i rodiči · ceny dopolední docházky
a Jaaty / Kouzla lesa (odhad prototypu).

---

## Kde to stojí

| Oblast | Stav |
|---|---|
| **Průvodcovská appka** | Hotová. 4 role (průvodce, vedoucí, hospodářka, kuchyň), všechny nálezy z testování (P1–P6, P3 jako role Kuchyň) zapracované. |
| **Rodičovská appka** | Hotová. Nálezy z testování zapracované (pozdní omluvenka, modal, vzkazy průvodcům, povinný důvod). |
| **Admin appka** | **Rozpracovaná.** Přehled, Novinky, Porady stojí; **Platby a Náhrady jsou jen placeholdery.** Draft rozsahu je v `draft-admin.md`. |
| **Design systém v kódu** | Hotový (fáze 4.1–4.4 + 4.7), pravidla v `design-system.md`. |
| **Skiny sesterských školek** (4.5) | Nezačato – čeká na palety Jaata / Kouzlo lesa / Maata. |
| **Figma** (4.6) | Jen obálka + foundations (proměnné, textové styly). Žádné komponenty. |
| **Case study** (5.4) | Rozepsaná, 8 kapitol; v pracovní kopii necommitnuté úpravy. Nepokrývá testování ani iterace po něm. |
| **Předávka vývoji** | Dokumentace objektů a flows existuje (`objekty-systemu.md`, `flows.md`), souhrnná předávka ne. |

---

## 0 · Hned (blokuje zveřejňování)

| | Úkol | Odhad |
|---|---|---|
| 0.1 | **Cizí soubory ve veřejném repu** – `docs/spec/analyza/` (33 souborů, mj. `NDA_Metadata_AIP.xlsx`). Rozhodnout a případně odstranit i z historie. | 0,5 h |

---

## 1 · Stabilizace mobilních appek — **1,5 dne**

Malé chyby a nekonzistence, které zbyly po iteracích. Bez nich nemá smysl dělat finální
vizuální průchod ani screenshoty do case study.

| | Úkol | Odhad |
|---|---|---|
| 1.1 | Široké tabulky (Děti, fond, akce, týden docházky) roztahují stránku do strany na ~1024 px – obalit do rolovacího kontejneru | 1 h |
| 1.2 | Editor buňky docházky pořád nabízí „Omluven / Neomluven" – srovnat se slovníkem „nepřišlo · omluveno vedoucí" | 0,5 h |
| 1.3 | Mrtvý kód trvalých poznámek o dítěti (`c.note`) – vyhodit, nebo vrátit do profilu | 0,5 h |
| 1.4 | Rodičovská strana pravidla 8:30 – zavřený stav „po 8:30 už absenci nenahlásíte" (dnes neviditelné, protože hodiny ukazují 7:40) | 1 h |
| 1.5 | Hlavička Novinek na mobilu se dvěma tlačítky – sesypat | 0,5 h |
| 1.6 | **Celkový průchod všech obrazovek** obou appek na 375 a 1440 px, 4 role – seznam vad, jedna dávka oprav | 1 den |

---

## 2 · Admin appka — **4–5 dní**

Největší díra. Postup podle `draft-admin.md` kap. 7, rozsah podle výzkumu (testovat s vedením
se už nebude). Vzor tabulek s filtry, řazením a CSV je hotový z průvodcovské appky –
stavba je hlavně o datech a pravidlech.

| | Úkol | Odhad | Potřebuje |
|---|---|---|---|
| 2.1 | **Náhrady** – souhrn napříč školkami, detail dítěte, expirace 30. 6. (nejsilnější bolest z výzkumu, 5 hlasů) | 1,5 dne | pravidlo náhrad (otázka A) |
| 2.2 | **Přehled** – zostřit na „co vyžaduje akci" (platby k řešení, výkyvy náhrad, chybějící data, dnes ve školkách) | 0,5 dne | 2.1 |
| 2.3 | **Platby** – chybějící platby napříč školkami, stavy z briefu, simulované akce; fakturační modul ne | 1,5 dne | |
| 2.4 | **Děti a matrika** – tabulka + export | 0,5 dne | |
| 2.5 | Ověření 1440 / 375, zápis do decision-logu | 0,5 dne | |

Nastavení (ceny) z draftu **vypouštím** – jeden hlas, nic dalšího na něm nestojí.

---

## 3 · Předávka vývoji — **1 den**

| | Úkol | Odhad |
|---|---|---|
| 3.1 | Předávací dokument pro Pata: role a práva, objekty a stavy, co je simulované (data mezi appkami se nesdílejí, hodiny), co je vědomě mimo rozsah | 0,5 dne |
| 3.2 | Technické otázky, které čekají na něj: Google kalendář ↔ akce, import depistáží, párování plateb s bankou, sdílení dat rodič ↔ průvodce, offline | 0,5 dne |

---

## 4 · Case study — **1,5–2 dny**

| | Úkol | Odhad |
|---|---|---|
| 4.1 | Dopsat testování a iterace po něm (P1–P6, slovník, role Kuchyň) – podklady jsou v decision-logu | 1 den |
| 4.2 | Screenshoty před / po z gitu, metriky, finální korektura, nasazení | 0,5–1 den |

Navazuje na tvoje necommitnuté úpravy v `docs/case-study.html`.

---

## 5 · Volitelné – podle rozhodnutí

| | Úkol | Odhad | Podmínka |
|---|---|---|---|
| 5.1 | **Skiny** 3 sesterských školek (jen barvy přes tokeny + kontrast) | 1 den | palety od tebe |
| 5.2 | **Figma knihovna** – core + doménové komponenty, patterny | 3–5 dní | rozhodnutí, že je součást „hotovo" |

---

## Souhrn

| Varianta | Obsah | Odhad |
|---|---|---|
| **Minimum** | 0 + 1 + 2 + 3 + 4 | **8–10 dní** (2 týdny) |
| + skiny | + 5.1 | 9–11 dní |
| + Figma | + 5.2 | 12–15 dní (3 týdny) |

**Kritická cesta:** 0 → 1 → 2 (admin je nejdelší a jediná část, kterou blokují cizí vstupy)
→ 3 → 4. Case study (4) jde psát souběžně s 2, pokud stačí screenshoty mobilních appek.

### Navržený kalendář (varianta minimum)

| Týden | Co |
|---|---|
| **1** | 0 · 1 (stabilizace + průchod) · 2.1 Náhrady · 2.2 Přehled |
| **2** | 2.3 Platby · 2.4 Matrika · 2.5 · 3 předávka · 4 case study |

---

## Rozhodnutí, která potřebuju od tebe (blokují odhad)

| | Otázka | Proč | Navrhovaná odpověď |
|---|---|---|---|
| **0** | Co s `docs/spec/analyza/` ve veřejném repu? | možné NDA | odstranit i z historie |
| **A** | Pravidlo náhrad v adminu – zůstat u 20 %, nebo paušál podle docházky? | 2.1 bez něj nejde postavit správně | zůstat u současného, rozdíl zapsat jako otevřený |
| **B** | Je Figma knihovna součást „hotovo"? Brief ji chce, plán fáze 5 ji vylučuje. | +3–5 dní | jen foundations (stav dnes) + odkaz, že zdroj pravdy je kód |
| **C** | Skiny – máš palety, nebo je vypustit? | +1 den | vypustit, v case study zmínit jako připravené přes tokeny |
| **D** | Admin Platby a Náhrady stavět, nebo jen vědomě vyřadit s odůvodněním? | 3–4 dny z odhadu | stavět – je to nejsilnější bolest z výzkumu |

## Vědomě mimo rozsah (nezačínat)

Offline a synchronizace · fakturační modul · objednávka obědů z appky · nástěnka
ztrát a nálezů · notifikace „přečteno" · kalendář v adminu · oprávnění a uživatelské účty.
Všechno je zdůvodněné v decision-logu.
