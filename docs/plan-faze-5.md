# Fáze 5 – Testování s uživateli a case study

Tento dokument je **samostatné zadání**. Fáze je rozdělená na dílčí fáze 5.1–5.4, každou může
provést jiný model s čistým kontextem. Před začátkem si přečti `CLAUDE.md`, `docs/flows.md`
(Flow 1–5 vč. stavových modelů), `docs/decision-log.md` a tento soubor celý. Proveď **jen svou
dílčí fázi**.

## Kontext – proč testování před dalším stavěním

Rodičovská i průvodcovská appka jsou funkčně kompletní a konzistentní (fáze 0–4.7). Admin má
hotový Přehled, Novinky a Porady (pokrývá Flow 4 i 5); **Platby a Náhrady jsou vědomě
placeholdery** a jejich rozsah se rozhodne až podle nálezů z testování — ne dřív.

Cílový řetěz: **prototypy → testování s respondenty → case study** (web + pohovory). Case study
je skutečný deliverable; testovací nálezy a iterace jsou její nejcennější obsah. Proto se
nestaví nic, co testování nepotřebuje.

## Zafixovaná rozhodnutí (platí pro celou fázi 5)

1. **Designérka má respondenty a testuje brzy** — testovací protokol je priorita č. 1.
2. **Admin Platby/Náhrady až po testování** — rozsah podle toho, co vedení v testu skutečně
   hledalo. Fakturační modul se nedělá (viz plán fáze 3, bod 6 — brief nemá flow).
3. **Case study = HTML stránka v repu**, nasazená na GitHub Pages vedle prototypů. Staví se
   **průběžně** z decision-logu a metrik, ne zpětně na konci.
4. Testuje se z **GitHub Pages** (`chotenovskalenka.github.io/intraweb-prototype/`), ne z lokálu —
   respondent může testovat na vlastním telefonu.
5. Mutace se v prototypu neukládají (reload = reset) — pro testování je to výhoda (každý
   respondent začíná stejně), do protokolu ale patří upozornění pro moderátora.

## Fáze 5.1 – Testovací protokol a záznamový arch

**Cíl:** designérka může okamžitě testovat; každý test má stejnou strukturu a srovnatelný záznam.

1. `docs/testovani/protokol.md`: úvodní skript (co je prototyp, co se neukládá, myšlení nahlas),
   souhlas s poznámkami, struktura sezení (~30 min).
2. Scénáře s úkoly **odvozené z flows.md** — úkol je formulovaný jako situace, ne návod:
   - **Rodič** (Flow 2, 3): „Dítě v pondělí nemůže do školky — zařiď to." (testuje omluvenku
     vč. pochopení deadlinu 20:00 a vzniku náhrady) · „Zjisti, kolik a jak máš zaplatit." (QR)
     · „Co bude dítě zítra jíst?" · „Najdi fotky z poslední výpravy."
   - **Průvodce** (Flow 1): „Je ráno, děti se schází — zapiš docházku." (vč. poznámky od
     rodiče) · „Napiš rodičům novinku a pošli ji do WhatsAppu." · „Založ akci podle loňska."
   - **Vedení** (Flow 4, 5): „Pošli novinku jen rodičům z Jaaty." (povinní příjemci) · „Najdi
     zápis z poslední porady o hygieně." (štítky) · „Které platby chybí?" (dashboard) —
     poslední úkol záměrně vede k placeholder sekcím: sleduj, kam respondent jde.
   U každého úkolu: očekávaná cesta, co pozorovat, kritérium úspěchu.
3. `docs/testovani/zaznam-sablona.md`: respondent (role, zařízení), per-úkol úspěch/zaváhání/
   selhání + citace, celkové dojmy, SUS-lite (3 otázky stačí).
4. Nálezy se po každém kole zapisují do `docs/testovani/nalezy-kolo-N.md` se závažností
   (blokuje úkol / zdržuje / kosmetické).

**Hotovo, když:** protokol + šablona jsou v repu a designérka podle nich zvládne vést test bez
další přípravy.

## Fáze 5.2 – Iterace podle nálezů

**Cíl:** nálezy z kola 1 roztříděné a opravené; podklad pro case study kapitolu „testování".

1. Nálezy roztřídit: (a) oprava v prototypu, (b) rozhodnutí do decision-logu (vědomě neřešíme),
   (c) vstup pro rozsah admin Platby/Náhrady.
2. Opravy dělat **dávkově** (viz retrospektiva níže): nejdřív celý seznam, pak jeden průchod
   oprav, pak jeden vizuální průchod všech tří appek (desktop 1440 + mobil 375). Ne jednu
   opravu po druhé v konverzaci.
3. Každá oprava = atomický commit s odkazem na nález („nález 1.3: …").

**Hotovo, když:** všechny nálezy (a) opravené a ověřené, (b)+(c) zapsané; decision-log má
shrnutí kola.

## Fáze 5.3 – Admin Platby a Náhrady (rozsah dle testování)

**Cíl:** admin nepůsobí nedodělaně; rozsah odpovídá tomu, co vedení skutečně potřebuje.

1. Vstup: nálezy 5.2(c). Bez nich se tato fáze nespouští — když test ukáže, že vedení
   Platby/Náhrady nehledá, fáze se zredukuje na rozhodnutí v decision-logu.
2. Očekávaný tvar (pokud se staví): **read-only přehledy** v duchu dashboardu — Platby: seznam
   chybějících plateb napříč školkami s filtrem školky a stavu (badge stavů z briefu kap. 4),
   „fakturace se řeší mimo appku". Náhrady: souhrn napříč školkami, expirace 30. 6., filtr.
   Žádné formuláře, žádný fakturační modul.
3. Komponenty výhradně z design systému (`.tile`, `.ch`, stavová paleta, `TOPACT` vzor).

**Hotovo, když:** obě sekce buď mají obsah ověřený na 1440/375, nebo decision-log říká proč ne.

## Fáze 5.4 – Case study (průběžně, finalizace na konci)

**Cíl:** `case-study.html` v repu, nasazená na GitHub Pages, použitelná jako odkaz z webu
designérky i podklad k pohovoru.

1. Kostru založit **hned** (může běžet souběžně s 5.1) a plnit po každé fázi — ne
   rekonstruovat zpětně.
2. Struktura: **Kontext** (reálná školka, 4 sesterské, tři role) → **Vstupy a revize dle
   reality** (produkční intraweb, příručky, tabulky — viz decision-log) → **Proces** (fáze
   0–4.7, ukázky rozhodnutí z decision-logu) → **Design systém** (tokeny, pravidla, metriky:
   27→12 velikostí písma, 8→5 rádiusů, 5→1 odsazení karty, stavová paleta; Figma zrcadlo) →
   **Testování** (protokol, nálezy, iterace — z 5.1/5.2) → **Výsledek** (odkazy na živé
   prototypy, čísla) → **Jak se pracovalo** (designérka + AI: zdroj pravdy v kódu, decision-log,
   pravidlo místo instance — s důkazy v git historii).
3. Vizuální jazyk case study = design systém Vhaaji (tokeny, typografie) — stránka sama je
   ukázkou systému. Před/po screenshoty brát z git historie (`git show <commit>:soubor`).
4. Česky; anglická verze až jako vědomé rozhodnutí podle cílových pohovorů.

**Hotovo, když:** stránka stojí na Pages, pokrývá všechny kapitoly a designérka ji schválila.

## Pořadí a závislosti

5.1 (protokol) → **testování provádí designérka** → 5.2 (iterace) → 5.3 (admin, podmíněně).
5.4 běží průběžně od začátku; finalizuje se po 5.2 (potřebuje nálezy), ideálně po 5.3.
Fáze 4.5 (skiny) zůstává nezávisle otevřená — čeká na palety V3; pro case study by byla pěkná
ukázka („4 značky z jednoho systému"), ale nic neblokuje.

## Retrospektiva způsobu práce (závazná pro fázi 5)

Z fází 0–4.7 plyne pro efektivitu:

1. **Jedna session = jedno téma** s jasným „hotovo když" (vzor: tyto plánovací dokumenty).
2. **Dávka, ne kapání:** nejdřív celý audit/seznam (grep, průchod obrazovek), společné
   rozhodnutí, pak jeden průchod oprav. Reaktivní opravování po jedné je nejdražší režim práce.
3. **Potřetí stejný typ opravy = pravidlo, ne oprava.** Oprava patří do komponenty/tokenu
   a `design-system.md`, ne na místo použití.
4. **Každý plošný (mechanický) zásah = povinný vizuální průchod hned po něm** — sjednocení
   písma rozbilo mobilní kalendář a našlo se to až o session později.
5. **Metriky zapisovat v okamžiku vzniku** (počty před/po, commit hash) — jsou to hotová čísla
   pro case study, zpětně se dohledávají draze.

## Co NEdělat (celá fáze 5)

- Nestavět Figma obrazovky ani rozšiřovat Figma knihovnu (v1 stačí; rozhodnuto dřív).
- Nestavět fakturační modul, plánování využití náhrady, offline/sync, třídnici (trvá z fáze 2–3).
- Neměnit schválenou identitu (paleta, typografie) — case study ji používá, ne předělává.
- Nedělat anglickou verzi case study, dokud není hotová a schválená česká.
