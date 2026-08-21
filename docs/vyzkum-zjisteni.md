# Zjištění z hloubkových rozhovorů

**Co to je:** výstup nezávislého průchodu přepisy devíti hloubkových rozhovorů (postup:
kontext → granulární analýza po respondentech → verifikace a rozpory → syntéza → srovnání
s původní analýzou). Tento dokument je **odosobněná verze** — neobsahuje jména ani doslovné
citace.

**Kde jsou podklady:** `discovery/přepisy/` (přepisy) a `discovery/validace/` (analýzy po
respondentech, verifikace, plná syntéza s citacemi, srovnání s Miro boardem). Obě složky jsou
v `.gitignore` — obsahují osobní údaje a do repa nepatří. Původní analýza výzkumnice je
shrnutá v [vyzkum-brief.md](vyzkum-brief.md).

---

## Vzorek a jeho omezení

**Devět respondentů:** majitelka sítě, dva lidé z vedení/administrativy, vývojář systému,
tři průvodkyně, dva rodiče. Hloubkové rozhovory, u dvou respondentů opakované.

Omezení, která platí pro každé zjištění níže:

1. **Rodiče jsou zastoupeni dvěma hlasy a oba jsou atypičtí** — oba pracují profesionálně
   s digitálními nástroji, jeden z nich má navíc vlastní zkušenost průvodce v jiné školce.
   Původní plán počítal s pěti rodiči. Zjištění o rodičích jsou proto **slabá**.
2. **Z kamenné školky (Maata) není zastoupen žádný běžný průvodce ani rodič** — jen vedení.
   Zjištění jsou fakticky o lesních školkách a jejich přenositelnost na Maatu není ověřená.
3. **Kouzlo lesa není zastoupeno vůbec**, přestože systém používá.
4. **Kvalita přepisů je nerovnoměrná.** U dvou přepisů (shodou okolností právě u obou rodičů)
   je vadné rozdělení mluvčích — repliky tazatelky a respondenta jsou místy slepené nebo
   prohozené. Před dalším použitím je vhodné je pořídit znovu z nahrávek.

**Míra opory** je u každého tématu uvedena jako počet respondentů, kteří ho doložili vlastní
zkušeností. Témata označená ⚠️ mají slabou oporu a nesmí se prezentovat jako obecný závěr.

---

## Téma 1 — Náhrady jsou černá díra systému
**Opora: 8 z 9, napříč všemi rolemi. Nejsilnější zjištění výzkumu.**

Pravidlům náhrad nerozumí ani lidé, kteří o nich rozhodují. Majitelka se počítání vzdala
a náhradu raději daruje. Koordinátorka týmu je označuje za oblast, do které nevidí, a rodiče
odkazuje jinam. Průvodkyně odpovídají rodičům vyhýbavě, protože pravidlo neznají. Rodiče
nevědí, kolik náhrad mají ani kde to zjistit.

Jediný člověk, který jim rozumí, je hospodářka — a to proto, že je **počítá ručně mimo systém,
každý měsíc, u každého dítěte zvlášť**, podle typu docházky. Výstup systému označuje za
nespolehlivý.

**Rozpor v datech:** není jasné, jestli se pravidlo v poslední době změnilo, nebo se jen nikdy
nekomunikovalo. Majitelka tvrdí, že platí roky beze změny; dvě průvodkyně nezávisle uvádějí,
že se o něm dozvěděly až letos, jedna z nich náhodou.

**Jádro problému** není chybějící výpočet, ale to, že **neexistuje jedno místo, kde je vidět
stav** — ani pro rodiče, ani pro průvodce, ani pro vedení. Údaj na faktuře je podle vedení
nepřehledný.

## Téma 2 — Funkce existují, ale nikdo o nich neví
**Opora: 5–6 z 9, včetně vývojáře a dvou lidí z vedení.**

Systém nebrzdí chybějícími funkcemi, ale funkcemi, které nikdo nenajde. Modelovým případem je
**poznámka u docházky**: je skrytá pro rodiče, neviditelná pro průvodce, a na mobilu na ni
nejde kliknout. Existuje, a fakticky se nepoužívá.

Stejný vzorec platí pro **kalendář** (majitelka zvažuje jeho úplné odstranění, protože neví,
k čemu je), **modul kroužků** (mrtvý — nikdo za obsah neodpovídá) a **nástěnku**, kterou
z celé sítě používá jediná školka.

**Protipříklad:** jeden rodič poznámky používá a tvrdí, že fungují — průvodci na ně reagují.
Zjištění to nevyvrací, spíš zpřesňuje: **funkce technicky funguje, jen jí nikdo nevěří.** Oba
dotázaní rodiče informaci pro jistotu ještě zopakují ústně. Riziko je konkrétní: člověk, který
poznámky nečte vůbec, se s člověkem, který do nich píše, v provozu potkává.

**Důsledek pro návrh:** viditelnost a důvěryhodnost jsou důležitější než nové funkce. Nová
funkce, kterou nikdo neuvidí, jen prodlouží seznam mrtvých modulů.

## Téma 3 — Práce se přesouvá do hlavy a na papír
**Opora: 7 z 9, mezi průvodci 4 ze 4.**

Průvodci potřebují jedno číslo — kolik dětí, kolik z nich spí — a systém jim ho nedá. Musí si
ho složit sami: přečíst počet odpoledních, projít jednotlivé děti a odečíst ty, které
neodpočívají. Přeškrtnuté změny v docházce navíc znesnadňují poznat, jestli dítě přijde.

Skutečným zdrojem pravdy je **fyzické přepočítání dětí** na ranním kruhu a při odchodu do lesa.
Systém slouží spíš jako orientační odhad, který se ověřuje realitou — ne naopak.

Stejný vzorec u vedení: paralelní papírová evidence, lísteček se slevami u pracovního stolu,
opakované přepisování dat narození kvůli plánování skladby tříd.

**Důsledek pro návrh:** cílem není víc dat na obrazovce, ale méně — jedna obrazovka, ze které
se odpověď přečte bez skládání.

## Téma 4 — WhatsApp není konkurent systému, je to jeho nervový systém
**Opora: 7 z 9 mluví o WhatsAppu pozitivně i negativně současně. Nikdo ho nenavrhuje nahradit.**

WhatsApp řeší dvě věci, které interní systém neumí: **potvrzení, že informaci někdo přijal**,
a **doručení celému týmu naráz, včetně těch, kdo zrovna nejsou v práci**. Rodiče i průvodci to
formulují nezávisle. Jeden rodič výslovně uvádí, že potvrzení o přečtení mu nestačí — potřebuje
reakci člověka, protože ta znamená, že k věci někdo zaujal stanovisko.

Zároveň je WhatsApp nejcitovanějším zdrojem zahlcení. Počty skupin, které respondenti uvádějí,
se pohybují od deseti (rodič) po zhruba třicet (vedení). Ztlumení skupin problém neřeší —
několik respondentů nezávisle popisuje, že se do zprávy stejně podívají.

**Nejdůležitější doložený důsledek:** u jednoho rodiče zahlcení **mění chování** — drobnou
provozní informaci raději nenapíše, protože by musela jít deseti lidem místo dvěma průvodcům,
a psaní mimo skupinu považuje za obcházení systému. To je jediný doložený případ, kdy zahlcení
způsobilo, že se informace nedostala tam, kam měla.

**Důsledek pro návrh:** ambice nahradit WhatsApp nemá v datech oporu — potvrzuje to i vývojář.
Oporu má ambice **odčerpat z něj to, co tam nepatří**: drobné provozní zprávy typu „přijdeme
později".

## Téma 5 — Mobil pro čtení, počítač pro psaní
**Opora: 7 z 9.**

Průvodci i rodiče přistupují k systému výhradně z telefonu, přes prohlížeč. Mobilní
použitelnost je nejčastěji jmenovanou bariérou: nízká responzivita, nutnost otáčet obrazovku,
nečitelné stavy docházky, poznámky, na které nejde kliknout.

Zároveň platí opak pro **zápis**: tři respondenti nezávisle uvádějí, že delší texty píší
zásadně na počítači, protože na telefonu dělají chyby. Psaní do malého vstupního pole
v tabulce je opakovaně popisované jako nejhorší část práce.

Dva respondenti, kteří mobil jako téma neuvádějí, jsou právě ti dva, kteří **nepracují
v terénu** — což zjištění potvrzuje.

⚠️ **Poznámka k tezi „telefon před dětmi je tabu"** (uvedená v [BRIEF.md](BRIEF.md) i
[CLAUDE.md](../CLAUDE.md) jako klíčová hodnota): v přepisech má **slabší oporu, než jak je
formulovaná**. Přímo ji doloží jeden respondent, nepřímo dva další. Jeden respondent ji naopak
vlastním chováním popírá — pracuje na telefonu v terénu i cestou do práce a situace u dětí si
fotí, aby je zapsal později. Tři citace, na kterých teze stojí v původní analýze, se
v dodaných přepisech nevyskytují (viz `discovery/validace/krok4_srovnani.md`); je možné, že
přepisy jsou neúplné.

**Formulace, kterou data unesou:** *pozornost lidí v přímé péči je vzácná a měří se ve
vteřinách.* To pro návrh znamená totéž, ale je to doložitelné.

## Téma 6 — Nikdo neodpovídá za to, aby se lidé dozvěděli, jak systém funguje
**Opora: 5 z 9, napříč všemi rolemi.**

Každý předpokládá, že zaučení dělá někdo jiný. Průvodkyně neví, kdo rodiče zaučuje, a sama to
nedělá. Koordinátorka popisuje díru už při náboru — informace o novém dítěti se k ní nedostane
a nikdo nedohledá, co komu kdo řekl. Rodič musel manuál osobně vyžádat a má jen starou verzi.
Druhý rodič uvádí, že praktické věci nejsou nikde napsané.

**Důsledky jsou měřitelné:** rodiče zadávají docházku špatně (typicky celodenní místo
odpolední), což se propíše do jídla i do nároku na náhrady. Jedna průvodkyně o pravidlech
náhrad zjistila správnou verzi náhodou.

Zvláštní podproblém: **informace nejsou zastupitelné mezi rodiči.** Jeden respondent to
formuluje jako obecný požadavek — druhý rodič, i když není tak zapojený, by měl být schopen
dítě omluvit, aniž by se doptával, kterým kanálem to udělat.

## Téma 7 — Dělicí čára: statické informace ano, živý zápis ne
**Opora: 2 z 9 — ale vyslovili to nezávisle majitelka a koordinátorka týmu, tedy dva lidé
s reálným právem veta.**

Nejcitlivější téma projektu. Obě respondentky nezávisle nakreslily stejnou čáru:

- **Přesunout lze** to, co je stabilní a fixní — tabulka informací pro rodiče, záznamy
  z rozhovorů, akce, kontakty, jídelníček, přihlašování.
- **Přesunout nelze** to, co je živé a organické — průběžná komunikace a zápis, který se
  doplňuje zpětně. Argument koordinátorky je konkrétní: do tabulky se dopisuje po dnech,
  někdo hned, někdo později; formulář, který se odešle a uzavře, to neumožní.

Proti tomu stojí čtyři respondenti, kteří chtějí přesunout co nejvíc — nejsilněji vývojář
a jedna průvodkyně, jejíž závěrečné shrnutí celého rozhovoru znělo, že se tráví hodně času
přepisováním informací, které už někde jsou.

**Třídnice (denní záznam) je zvláštní případ.** Nikdo z devíti respondentů její přesun sám
nenavrhl a čtyři ji označili za nejlepší nástroj, který mají — kvůli sdílenosti, historii
a vyhledávání. Majitelka ji považuje za produkt s vlastní tržní hodnotou. Zároveň s ní existuje
reálné tření: zápis se nestíhá ve stejný den, evaluace se kvůli inspekci přepisují do dalšího
dokumentu a každá školka má vlastní strukturu a pojmenování. **Tření tam je, ale nikdo ho
nepřipisuje nástroji.**

## Téma 8 — Fakturační agenda je z velké části ruční
**Opora: 3 z 9 — ale to je 100 % lidí, kteří fakturují.**

Opakující se ruční kroky, které oba fakturující popsali nezávisle:

- **sourozenecká sleva se počítá i po odchodu sourozence** — oprava každý měsíc ručně;
  jediné dostupné „řešení" (smazání dítěte) by zničilo historii;
- **odchod dítěte před obědem** se naúčtuje, i když oběd nebyl objednán;
- **evidence přijatých plateb** běží v soukromé tabulce mimo systém, včetně ručních poznámek
  a upomínek;
- **nárok na tábory** se ověřuje ručně napříč školkami;
- **zadání nové rodiny** se u části školek dělá dvakrát, do dvou systémů.

**Doložený potenciál automatizace:** měsíční přenos docházky mezi systémy dříve zabíral
2–3 hodiny ručního překlikávání; po napsání skriptu trvá 5–10 minut. Je to jediné tvrdé číslo
v celém výzkumu.

## Téma 9 — Absence stížností neznamená spokojenost
**Opora: tři nezávislé případy. Metodicky nejdůležitější zjištění.**

Silné vztahy v komunitě tlumí zpětnou vazbu:

1. **Fotky.** Tým se shoduje, že sdílení přes Facebook nikomu nevadí a nikdo se na to neptal.
   Oba dotázaní rodiče přitom mají výhrady — jeden k platformě a nakládání s daty dětí, druhý
   k tomu, že se fotky vůbec nedostanou k druhému rodiči, který na Facebooku není. Jedna
   průvodkyně sama předjímá, že to jednou začne vadit nahlas.
2. **Chyba ve slevě.** Osoba, které systém špatně počítal slevu, ji ručně opravovala řadu
   měsíců, než to vývojáři vůbec zmínila.
3. **Peníze.** Majitelka popisuje totéž jako obecný vzorec: lidé si výhrady nechávají pro sebe
   místo toho, aby přišli a řekli je.

**Důsledek pro fázi 5 (testování prototypu): v této komunitě nelze číst mlčení jako souhlas.**
Testování musí být postavené na pozorování chování, ne na dotazu „vyhovuje vám to?".

## Téma 10 — Dvojí systém je zdrojem duplicit ⚠️
**Opora: 3 z 9 — jen ti, kdo o existenci druhého systému vědí. Rodičů ani průvodců se přímo
netýká.**

Systém je fakticky rozdělený na dvě instance: jednu, kam zadávají docházku rodiče, a druhou,
oficiální pro úřady. Důvod je legislativní — část dětí je z právních důvodů evidovaná jinde,
než kam fyzicky chodí.

Důsledky: měsíční přenos dat mezi instancemi, nemožnost spárovat stav „uhrazeno" s bankou,
dvojí zadávání nových rodin a rodiče přihlašující se do systému školky, kam jejich dítě
nechodí.

**Nejviditelnější dopad na rodiče:** faktury trvale svítí jako nezaplacené. Vedení na to má
naučenou formulku o „systému v rekonstrukci" a řeší to jako opakovanou administrativu navíc.
Zvažovanou variantou je stav „uhrazeno" raději úplně skrýt, než ho opravovat.

**Varování:** vývojář sám před sloučením databází varuje s odkazem na kontroly úřadů.

## Téma 11 — Přihlašování na tábory a školku v přírodě
**Opora: 3 z 9, ale s dopadem na vztahy v komunitě.**

Jediná oblast, kde nedostatek systému poškozuje atmosféru, ne jen efektivitu. Rodiče popisují
každoroční zmatek v tom, kdo jede a kdo ne, a smutek těch, kdo s místem počítali a nedostali
se. Projevený zájem nejde zrušit jinak než e-mailem administrátorce.

**Podstatné pro návrh:** přesun agendy z interního systému do Google formuláře problém
**nevyřešil** — kapacitu je pořád nutné hlídat ručně v reálném čase a přihlášení nad limit
vytváří falešné očekávání. Chybí kapacitní logika, ne formulář.

## Téma 12 — Mandát projektu je užší, než se předpokládá
**Opora: přímé výroky zadavatelky ve dvou ze tří rozhovorů. Nejdůležitější zjištění pro řízení
projektu.**

Zadavatelka **redesign explicitně nepožaduje** a úspěch definuje jako „nezhoršit" — za úspěch
označuje i stav, kdy tým nezareaguje vůbec. Vlastní roli v rozhodování o podobě systému
opakovaně bagatelizuje a odkazuje na to, že rozhodovat mají průvodci, protože s nástrojem
pracují.

Zároveň má **konkrétní požadavek na výstup výzkumu**: potřebuje argumenty, kterými týmu
vysvětlí, proč u nové verze vydržet, až přijde odpor.

**Kdo redesign chce:** jednoznačně jen vývojář, a to včetně architektury. Vedení chce
funkčnost, ne vzhled. Koordinátorka týmu je se současným stavem spokojená. Rodiče mají
konkrétní představy, ale systém používají zhruba jednou měsíčně.

**Důsledek:** projekt má mandát na **opravu a doplnění, ne na přestavbu.** A výstupy by měly
existovat i ve verzi pro tým, ne jen pro zadavatelku.

---

## Co data neříkají

Následující nemá v přepisech oporu a nesmí se dopočítat:

- **Kolik času jednotlivé činnosti reálně zaberou.** Kromě jednoho čísla (2–3 h → 5–10 min
  u přenosu docházky) jsou všechny popisy kvalitativní. Pro obhájení investice chybí měření.
- **Jak systém vnímá běžný rodič** bez digitální profese.
- **Jak funguje kamenná školka** z pohledu průvodce a rodiče.
- **Jaký je rozpočet.** Vývojář opakovaně naráží na finanční strop, konkrétní číslo v datech
  není.
- **Postoj otců.** Oba rodičovští respondenti jsou matky — přičemž jedna z nich sama
  identifikuje druhého rodiče jako klíčovou mezeru v předávání informací.

---

## Priority odvozené z opory v datech

Řazeno podle síly doložení, ne podle atraktivity:

1. **Náhrady** — jedno místo, kde je vidět stav (8/9)
2. **Mobilní čitelnost docházky** včetně rozlišení spáčů (7/9; 4/4 mezi průvodci)
3. **Viditelnost existujících funkcí**, především poznámky u docházky (5–6/9)
4. **Zaučení a manuál** — a určení, kdo je vlastní (5/9)
5. **Fakturační automatizace** — sourozenecká sleva, odchod před obědem, evidence plateb
   (100 % těch, kdo fakturují)
6. **Přihlašování na akce s kapacitní logikou** (3/9, ale s dopadem na atmosféru)

**Čeho se v této fázi nedotýkat:** WhatsApp (nikdo ho nechce nahradit, včetně vývojáře),
třídnice (nikdo o přesun nežádal a čtyři respondenti ji aktivně brání), sloučení databází
(varuje před tím sám vývojář).

**Než se z toho začne stavět:** doplnit vzorek o 2–3 rodiče bez digitální profese, o průvodce
a rodiče z kamenné školky a ideálně o jednoho otce.
