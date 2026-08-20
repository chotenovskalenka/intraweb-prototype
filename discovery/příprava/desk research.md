# **Komplexní analýza a strategický rámec redesignu informačního systému pro sítě mateřských škol se zaměřením na specifika lesní a komunitní pedagogiky**

Transformace digitálního prostředí v oblasti předškolního vzdělávání v České republice dosáhla kritického bodu, kdy se střetávají narůstající legislativní požadavky státní správy s autentickými potřebami komunitně orientovaných vzdělávacích institucí. Tento report poskytuje hloubkovou analýzu segmentu školních informačních systémů (ŠIS) se zvláštním zřetelem na specifický kontext sítě mateřských škol Maata, Jaata a Vhaaji. Cílem je definovat parametry pro redesign stávajícího intrawebu tak, aby se stal efektivním nástrojem pro průvodce v terénu, administrativní pracovníky i rodiče, a zároveň si zachoval schopnost podporovat rituály a mezilidské vztahy, které tvoří jádro identity těchto škol.

## **Klíčové pojmy a definice v ekosystému předškolní administrativy**

Pro úspěšnou navigaci v procesu redesignu a zajištění souladu s externími systémy je nezbytné precizní vymezení terminologie. Tato oblast vykazuje vysokou míru jistoty, neboť je ukotvena v platném právním řádu a technických standardech digitální správy.1

Základním stavebním kamenem je Školní informační systém (ŠIS), který je v odborné literatuře definován jako integrovaný soubor softwarových modulů určených k řízení, automatizaci a optimalizaci administrativních, pedagogických a komunikačních procesů v rámci vzdělávací instituce.4 V kontextu mateřských škol se ŠIS vyvinul z prosté databáze dětí v komplexní ekosystém, který musí obsloužit tři hlavní domény: legislativní agendu (matrika), provozní agendu (docházka, fakturace) a pedagogicko-komunikační agendu (vztah s rodiči, diagnostika).2

Klíčovým legislativním termínem je Školní matrika, jejíž vedení upravuje vyhláška č. 364/2005 Sb..3 Matrika není pouhým seznamem jmen, ale zákonem definovaným souborem individuálních údajů o dětech, jejich průběhu vzdělávání, zdravotní způsobilosti a zákonných zástupcích. V souvislosti s novelizací předpisů dochází od školního roku 2025/2026 k přechodu na povinné elektronické předávání individuálních dat přímo Ministerstvu školství, mládeže a tělovýchovy (MŠMT).1 Pro vývojáře legacy systémů to znamená nutnost implementace exportního modulu ve formátu XML, který odpovídá přesně definovaným číselníkům MŠMT.9

V oblasti uživatelské zkušenosti (UX) je pro lesní mateřské školy (LMŠ) kritický pojem Outdoor UX. Ten označuje specifickou disciplínu návrhu rozhraní pro mobilní zařízení používaná v extrémních venkovních podmínkách, kde faktory jako intenzita slunečního záření, vlhkost, nízké teploty a nutnost ovládání v rukavicích zásadně mění pravidla interakce s aplikací.11 S tím souvisí architektura Offline-first, která zajišťuje, že aplikace zůstává plně funkční i v místech s nulovou nebo nestabilní konektivitou, což je v lesním terénu standardní provozní stav.11

Dalším podstatným pojmem je Single Source of Truth (SSoT), neboli princip jediného zdroje pravdy. V prostředí mateřské školy to znamená, že údaj zadaný jednou (např. omluvenka od rodiče) se automaticky a bezchybně propaguje do všech souvisejících modulů: do docházkového listu pro průvodce, do výkazu pro kuchyni (stravné) a do fakturačního modulu pro administrativu.14 Absence tohoto principu vede k fragmentaci dat a frustraci uživatelů, jak je patrné v současném stavu analyzované sítě škol.

| Pojem | Technický / Legislativní kontext | Význam pro redesign intrawebu | Jistota |
| :---- | :---- | :---- | :---- |
| **Školní matrika** | Vyhláška 364/2005 Sb. | Nutnost exportu XML pro MŠMT od roku 2025\. | Vysoká |
| **Outdoor UX** | ISO 9241-210 (adaptováno) | Priorita čitelnosti a velkých ovládacích prvků na mobilu. | Vysoká |
| **Offline-first** | PWA / Native mobile sync | Funkčnost v lese bez signálu s následnou synchronizací. | Vysoká |
| **SSoT** | Datová integrita | Eliminace duplicitního zadávání dat (Eva, Radka). | Vysoká |
| **GDPR Compliance** | Nařízení EU 2016/679 | Zabezpečené úložiště fotografií a osobních dat dětí. | Vysoká |

## **Existující výzkumy a data o digitalizaci mateřských škol v ČR**

Oblast digitalizace předškolního vzdělávání v České republice je předmětem intenzivního zájmu státních orgánů i akademické sféry, zejména v souvislosti s Národním plánem obnovy a revizemi Rámcového vzdělávacího programu (RVP). Úroveň jistoty u těchto dat je vysoká, neboť vycházejí z plošných šetření České školní inspekce (ČŠI) a statistických ročenek školství.17

Data ČŠI naznačují, že zatímco v roce 2009 využívala školní informační systém jen přibližně čtvrtina základních škol, u mateřských škol byl nástup pomalejší, ale v posledních pěti letech se dramaticky zrychlil vlivem tlaku na efektivitu administrativy.17 Aktuálně disponuje webovou stránkou 97 % škol, ale pouze 69 % využívá pokročilý redakční nebo informační systém, což ukazuje na značný prostor pro inovace v oblasti vnitřních agend.19

V segmentu mateřských škol je trh vysoce koncentrovaný. Přibližně 88 % českých škol využívá systémy Bakaláři nebo Škola OnLine, což pro soukromé a alternativní subjekty vytváří specifickou výzvu: buď se přizpůsobit rigidnímu standardu těchto molochů, nebo investovat do vlastního řešení, které však musí být schopno komunikovat s centrálními systémy státu.20 Pro sítě jako Maata, Jaata a Vhaaji je klíčovým zjištěním, že MŠMT již testovalo předávání dat ze školních matrik u více než 12 různých evidenčních systémů, což potvrzuje, že cesta vlastního, správně navrženého řešení je legislativně průchodná, pokud splňuje technické specifikace.9

Specifický výzkum zaměřený na lesní mateřské školy zdůrazňuje roli pedagoga jako "tváře a srdce" školky. Studie resilience pedagogů v LMŠ ukazuje, že jakákoliv administrativní zátěž, která není intuitivní, přímo ohrožuje jejich psychickou pohodu a schopnost věnovat se dětem v náročném terénu.21 Z hlediska digitální vybavenosti jsou LMŠ často v paradoxní situaci: mají největší potřebu mobility, ale zároveň tvoří podstatnou část z 2 % škol, které mají problém se stabilním internetovým připojením v místě působení.18

Analýza uživatelského chování rodičů v digitálním prostředí škol ukazuje na rostoucí preferenci pro "instantní" informace. Rodiče očekávají, že informace o docházce, platbách i aktivitách dítěte budou dostupné v reálném čase, podobně jako jsou zvyklí u komerčních služeb.16 Pokud oficiální systém selhává, rodiče i učitelé spontánně migrují na WhatsApp, což sice řeší rychlost komunikace, ale vytváří obrovská rizika v oblasti ochrany osobních údajů a vede k informační fragmentaci.16

| Ukazatel digitalizace MŠ v ČR | Hodnota / Zjištění | Zdroj | Jistota |
| :---- | :---- | :---- | :---- |
| **Vybavenost ŠIS** | Dynamický nárůst od roku 2018 (vliv legislativy). | ČŠI 17 | Vysoká |
| **Tržní podíl dominantních ŠIS** | 88 % (Bakaláři, Škola OnLine). | Digiškolka 20 | Vysoká |
| **Povinná elektronická matrika** | Od září 2025 (ostré odesílání individuálních dat). | MŠMT 8 | Vysoká |
| **Závislost na konektivitě** | 2 % škol bez stabilního připojení (často LMŠ). | MŠMT 18 | Střední |
| **Zabezpečení webů** | Mnoho školních webů stále postrádá HTTPS certifikát. | Edu.gov.cz 25 | Vysoká |

## **Hlavní problémy a frustrace uživatelů v terénu i v kanceláři**

Analýza současného stavu intrawebu sítě Maata odhaluje hlubokou diskrepanci mezi zamýšlenou funkčností a reálným používáním. Tato oblast analýzy vychází přímo z kontextu zadání a je validována obecnými UX studiemi pro vzdělávací aplikace. Jistota informací je vysoká, neboť popsané jevy jsou typickými symptomy organicky rostoucích legacy systémů.13

### **Skupina: Průvodci v lesním terénu**

Průvodci v lesních školkách Jaata a Vhaaji představují nejvíce znevýhodněnou skupinu uživatelů současného systému. Jejich práce je vysoce mobilní, odehrává se v rukavicích, v dešti nebo na prudkém slunci.

* **Nepoužitelnost v terénu**: Stávající intraweb není optimalizován pro mobilní prohlížeče. Průvodci musí "zoomovat" na drobné ovládací prvky, což je v pohybu v lese nereálné. Výsledkem je rezignace na systém a zápis docházky na papír nebo do WhatsAppu.11  
* **Kognitivní přetížení a roztříštěnost**: Průvodce musí sledovat WhatsApp pro rychlé zprávy od rodičů ("Budeme mít 10 minut zpoždění"), Google tabulky pro specifické diety a intraweb pro oficiální matriku. Neustálé přepínání mezi kanály zvyšuje riziko přehlédnutí kritické informace, např. o alergii.11  
* **Ztráta dat při výpadku signálu**: Pokud systém vyžaduje aktivní připojení pro každý úkon, průvodce v místech se slabým signálem ztrácí data nebo musí čekat na "loading" kolečko, což v kontextu péče o skupinu dětí v lese vyvolává stres.13

### **Skupina: Administrátoři (Eva, Radka)**

Pro administrativní pracovnice je systém primárně nástrojem pro fakturaci a plnění státních výkazů.

* **Peklo duplicity**: Vzhledem k tomu, že architektura systému neodpovídá struktuře sítě čtyř školek, musí administrátorky pravděpodobně ručně přenášet data mezi docházkou a fakturačním modulem. Pokud rodič omluví dítě na WhatsAppu, průvodce to zapíše do svého deníku, ale k Evě a Radce se tato informace pro potřeby vyúčtování stravného dostává se zpožděním nebo vůbec.14  
* **Architektonický dluh**: Původní kód pro jednu školku nezvládá logiku odloučených pracovišť s různými ceníky a rituály. Systém se stává "černou skříňkou", které uživatelé nevěří a raději si vedou paralelní evidenci v Excelu.2

### **Skupina: Rodiče**

Rodiče v komunitních školkách jsou specifickou skupinou, pro kterou je důvěra a informovanost klíčová.

* **Informační chaos**: Rodič neví, kde hledat pravdu. Je fotka z dnešní oslavy na intrawebu, nebo ji paní učitelka dala do WhatsApp skupiny? Je zpráva o zítřejším výletu v e-mailu, nebo na nástěnce? Tato nejistota oslabuje prestiž instituce.16  
* **Bariéra vstupu**: Pokud je mobilní verze intrawebu nepoužitelná, rodič jej přestává navštěvovat. Oficiální kanál se tak stává mrtvým místem, zatímco neoficiální (WhatsApp) bují, ale neumožňuje strukturované vyhledávání informací zpětně.6

## **Klíčoví hráči a produkty na trhu: Benchmark pro redesign**

Ačkoliv majitelka sítě škol odmítá přechod na komerční řešení, jejich analýza je nezbytná pro stanovení standardu, který redesignovaný intraweb musí splnit, aby byl pro uživatele akceptovatelný. Úroveň jistoty je vysoká, neboť jde o veřejně dostupné systémy s jasně definovanými funkcemi.1

Dominantním trendem na trhu je přechod k mobilním aplikacím a sjednocení všech agend do jednoho rozhraní. Systém **Twigsee** nastavil v České republice vysokou laťku v oblasti UX pro rodiče a učitele. Nabízí digitální matriku, automatické generování dokumentů a zejména "feed" aktivit podobný sociálním sítím, což rodiče vnímají velmi pozitivně.15 Strategicky významné je také spojení Twigsee s dalšími systémy jako Lyfle nebo ŠkolkIS, což ukazuje na směřování trhu k robustním, integrovaným platformám.30

Systémy jako **Edookit** nebo **Digiškolka** (od tvůrců Bakalářů) sází na extrémní legislativní jistotu. Jejich silnou stránkou je přímé napojení na systémy MŠMT a automatizace statistických výkazů, což šetří dny práce administrativě.20 Pro redesign intrawebu Maata je toto kritická oblast – systém musí umět generovat XML soubory pro matriku 2025 stejně efektivně jako tito lídři trhu.6

V oblasti fakturace a ekonomiky jsou zajímavé systémy jako **MáŠkolka** nebo **Webooker**, které se specializují na automatizaci plateb, párování s bankou a generování QR kódů. Tyto funkce jsou přesně tím, co administrátorky Eva a Radka potřebují k odstranění duplicitní práce.1

| Systém | Klíčová přednost | Slabina pro komunitní školku | Inspirace pro redesign |
| :---- | :---- | :---- | :---- |
| **Twigsee** | Vynikající mobilní UX a komunikace. | Vyšší cena, unifikovaný vzhled. | Mobilní feed, omluvenky na 2 kliknutí. |
| **Digiškolka** | Garance souladu s MŠMT. | Rigidní rozhraní, administrativní fokus. | Struktura databáze pro matriku. |
| **Edookit** | Komplexnost "vše v jednom". | Složitost nastavení pro malé týmy. | Provázanost docházky s fakturací. |
| **MáŠkolka** | Ekonomické moduly a CRM. | Slabší mobilní podpora pro učitele. | Automatizace párování plateb. |

## **Mezery v poznání a neprobádané oblasti**

I přes relativně dobrou zmapovanost trhu existují v kontextu redesignu intrawebu pro specifické potřeby sítě Maata/Jaata oblasti s nízkou hladinou jistoty, které vyžadují další zkoumání.9

Zásadní mezerou je **digitalizace komunitních rituálů**. Většina ŠIS je navržena jako nástroje pro management a dohled. Chybí výzkum a metodika, jak skrze digitální systém posilovat sounáležitost a specifické rituály (např. ranní kruhy, sezónní slavnosti), aniž by technologie působila jako cizorodý prvek. Jak v digitálním prostředí reflektovat "vztahovou" povahu školky?.28

Další mezerou je **specifické Outdoor UX pro české lesní školky**. Ačkoliv existují obecné studie pro zemědělství nebo stavebnictví, neexistuje studie, která by mapovala, jak pedagogové v českých lesních školkách interagují s technologiemi v mrazu či dešti při současné vysoké odpovědnosti za bezpečnost dětí. Je 44 pixelů skutečně dostatečná velikost tlačítka pro promrzlé prsty průvodce v Jaata?.12

Třetí oblastí je **psychologie "vždy on-line" pedagoga v komunitě**. Zavedení efektivního systému komunikace může vést k tlaku na pedagogy, aby odpovídali rodičům okamžitě, což narušuje jejich wellbeing a čas s dětmi. Nejsou dostupné studie o tom, jak nastavit "zdravé hranice" v rámci školních informačních systémů, které by chránily pedagogy před vyhořením.21

## **Návrh struktury a funkcí pro redesign: Strategický rámec**

Redesign stávajícího systému musí být veden principem "méně je více" s důrazem na funkčnost v terénu a automatizaci administrativy. Následující rámec integruje zjištěné poznatky do konkrétních doporučení.

### **Modul pro průvodce: Mobilní terminál pro terén**

Průvodci potřebují rozhraní, které nevyžaduje pozornost delší než 10 sekund.

* **Dashboard vysokého kontrastu**: Černé písmo na bílém pozadí s kontrastním poměrem minimálně 7:1 pro čitelnost na slunci.11  
* **Gesta místo vyťukávání**: Evidence příchodu dítěte pomocí "swipe" gesta nebo jednoho velkého tlačítka (tap target min 60px). Systém musí umožnit hromadné omluvenky jedním klikem.15  
* **Offline-First synchronizační engine**: Každý úkon se uloží do lokální databáze telefonu a jakmile průvodce zachytí signál (např. u jurty), data se odešlou na server bez nutnosti mít aplikaci otevřenou.11  
* **Krizová karta**: Tlačítko pro okamžité volání zákonnému zástupci přímo z profilu dítěte, kde jsou vidět i klíčové zdravotní údaje a alergie.32

### **Modul pro administraci: Automatizační jádro**

Pro Evu a Radku musí být systém partnerem, který hlídá chyby.

* **Integrovaná matrika 2025**: Datová struktura plně odpovídající požadavkům MŠMT s validátorem, který nepustí chybně zadané rodné číslo nebo chybějící údaj o spádovosti.3  
* **Automatické párování plateb**: Propojení s bankovním API, které automaticky označí faktury jako uhrazené na základě variabilního symbolu, čímž odpadá ruční kontrola výpisů.5  
* **Generátor dokumentů**: Šablony pro smlouvy o vzdělávání, evidenční listy a potvrzení o školkovném, které se automaticky předvyplní daty z matriky.15

### **Modul pro rodiče: Komunitní uzel**

Rodič musí cítit, že systém mu šetří čas a přibližuje ho k dění ve školce.

* **Jednotný komunikační feed**: Místo WhatsAppu uzavřený, bezpečný proud informací (fotky dne, jídelníček, důležitá upozornění) s možností filtrace.16  
* **Samoobslužné omluvy**: Možnost omluvit dítě do určité hodiny (např. 8:00) s automatickým potvrzením a okamžitým promítnutím do výkazu stravného.15  
* **Kalendář rituálů**: Přehledná vizualizace rytmu roku, slavností a brigád s možností exportu do osobního kalendáře v mobilu.28

### **Technická architektura a zabezpečení**

Redesign v rámci stávajícího systému vyžaduje refaktorizaci kritických částí kódu.

* **API-First přístup**: Rozdělení backendu a frontendu, což umožní vývoj moderního, responzivního rozhraní pro mobily nezávisle na starším kódu administrace.4  
* **Role-Based Access Control (RBAC)**: Striktní definice oprávnění. Průvodce vidí jen "své" děti a jejich zdravotní údaje, rodič vidí jen své dítě, administrátor vidí finanční toky.39  
* **GDPR a šifrování**: Nasazení HTTPS certifikátu a šifrování databáze s fotografiemi. Fotky nesmí být nikdy ukládány přímo v telefonu učitele, ale streamovány do aplikace.2

## **Matematický model efektivity systému (ROI administrativy)**

Účinnost redesignu lze kvantifikovat snížením času stráveného administrativou ![][image1]. Pokud definujeme současný čas ![][image2] jako součet času stráveného v paralelních systémech (Intraweb, WhatsApp, Excel):

![][image3]  
Po redesignu, implementací principu SSoT a automatizace, by mělo dojít k redukci na:

![][image4]  
kde ![][image5] je automatizovaný proces. Cílem redesignu by mělo být dosažení ![][image6], což odpovídá zkušenostem z implementací systémů jako Twigsee, které deklarují úsporu až 80 hodin administrativy měsíčně na jednu školku.27

## **Závěrečná doporučení pro implementaci**

Projekt redesignu intrawebu pro sítě Maata, Jaata a Vhaaji není pouze technickým úkolem, ale zásahem do živého organismu komunity. Úspěch závisí na tom, zda technologie dokáže "zmizet" a stát se neviditelným, ale spolehlivým služebníkem.

1. **Iterativní nasazování**: Nejdříve zprovoznit mobilní docházku pro průvodce (vyřešení největší frustrace), následně matriční modul pro 2025 (legislativní nutnost) a nakonec komunikační feed pro rodiče (budování komunity).14  
2. **Uživatelské testování v lese**: Každý prototyp mobilního rozhraní musí být testován přímo v terénu Jaata za denního světla. Design, který funguje v pražské kanceláři, může být v lese nepoužitelný.11  
3. **Důraz na "Lidský rozměr"**: Digitální systém by měl obsahovat prvky, které podporují rituály – např. připomínky narozenin dětí s jejich oblíbenými písničkami pro ranní kruh, čímž se z administrativního nástroje stane nástroj pedagogický.35  
4. **Bezpečnost jako priorita důvěry**: Pro komunitní školky je soukromí dětí svaté. Implementace nejvyšších bezpečnostních standardů není jen byrokratický požadavek, ale základní kámen důvěry mezi školkou a rodičem.2

Tato analýza potvrzuje, že redesign stávajícího systému je ambiciózní, ale realizovatelný projekt, který při správném uchopení Outdoor UX a legislativních standardů může síť škol Maata posunout na špičku moderního předškolního vzdělávání v České republice.

#### **Citovaná díla**

> 1. Školní informační systémy (ŠIS) pro mateřské školy \- Edu.cz, použito května 4, 2026, [https://edu.gov.cz/skolni-informacni-systemy-sis-pro-materske-skoly/](https://edu.gov.cz/skolni-informacni-systemy-sis-pro-materske-skoly/)  
> 2. Strašák jménem matrika: Jak snadno vybrat informační systém pro školku \- Řízení školy, použito května 4, 2026, [https://www.rizeniskoly.cz/casopisy/special-pro-materske-skoly/strasak-jmenem-matrika-jak-snadno-vybrat-informacni-system-pro-skolku.m-14161.html](https://www.rizeniskoly.cz/casopisy/special-pro-materske-skoly/strasak-jmenem-matrika-jak-snadno-vybrat-informacni-system-pro-skolku.m-14161.html)  
> 3. 4\. VEDENÍ ŠKOLNÍ MATRIKY \- IS MUNI, použito května 4, 2026, [https://is.muni.cz/el/ped/jaro2021/XPPp10/110934317/Vedeni\_skolni\_matriky.pdf](https://is.muni.cz/el/ped/jaro2021/XPPp10/110934317/Vedeni_skolni_matriky.pdf)  
> 4. Informační systém školy \- IS MUNI, použito května 4, 2026, [https://is.muni.cz/th/255550/pedf\_b/hrncir\_bc\_final.pdf](https://is.muni.cz/th/255550/pedf_b/hrncir_bc_final.pdf)  
> 5. Informační systém pro mateřské školy \- MáŠkolka, použito května 4, 2026, [https://www.maskolka.cz/informacni-system-pro-materske-skoly](https://www.maskolka.cz/informacni-system-pro-materske-skoly)  
> 6. Mateřské školy a digitalizace: Jak školní informační systém zjednoduší Vaši práci \- Edookit, použito května 4, 2026, [https://edookit.com/cs/article-wk-information-system-for-kindergartens](https://edookit.com/cs/article-wk-information-system-for-kindergartens)  
> 7. Návrhy legislativních opatření pro oblast předškolního vzdělávání souvisejících se zavedením povinného posledníh \- Edu.cz, použito května 4, 2026, [https://www.edu.cz/wp-content/uploads/2023/03/Vysledek\_TITSMSMT801\_03\_\_Navrh\_legislativnich\_opatreni\_final.pdf](https://www.edu.cz/wp-content/uploads/2023/03/Vysledek_TITSMSMT801_03__Navrh_legislativnich_opatreni_final.pdf)  
> 8. Novela vyhlášky o dokumentaci škol a školských zařízení \- MŠMT ČR, použito května 4, 2026, [https://msmt.gov.cz/vzdelavani/skolstvi-v-cr/statistika-skolstvi/novela-vyhlasky-o-dokumentaci-skol-a-skolskych-zarizeni](https://msmt.gov.cz/vzdelavani/skolstvi-v-cr/statistika-skolstvi/novela-vyhlasky-o-dokumentaci-skol-a-skolskych-zarizeni)  
> 9. DIGITALIZACE V MŠ: KROK ZA KROKEM \- Edu.cz, použito května 4, 2026, [https://edu.gov.cz/wp-content/uploads/2025/05/Prezentace\_souhrn\_digitalizace\_ms.pdf](https://edu.gov.cz/wp-content/uploads/2025/05/Prezentace_souhrn_digitalizace_ms.pdf)  
> 10. Metodické pokyny k výkazům M 1a, M 4c\_a, M 3a, M 8a, M 9a, M 10a podle stavu k 31\. 3\. 2026, použito května 4, 2026, [https://matrika.msmt.cz/matrikas/HELPY/VYSVETLIVKY.PDF](https://matrika.msmt.cz/matrikas/HELPY/VYSVETLIVKY.PDF)  
> 11. A UI/UX Guide to Agriculture App Design \- Gapsy Studio, použito května 4, 2026, [https://gapsystudio.com/blog/agriculture-app-design/](https://gapsystudio.com/blog/agriculture-app-design/)  
> 12. Designing for The Great Outdoors: Solving The UX Challenges of Outdoor App Use \- the Adobe Blog, použito května 4, 2026, [https://blog.adobe.com/en/publish/2017/06/09/designing-for-the-great-outdoors-solving-the-ux-challenges-of-outdoor-app-use](https://blog.adobe.com/en/publish/2017/06/09/designing-for-the-great-outdoors-solving-the-ux-challenges-of-outdoor-app-use)  
> 13. Designing Mobile Apps for Field Teams: Offline-First UX and On-Device Intelligence, použito května 4, 2026, [https://medium.com/@mrsikandar08/designing-mobile-apps-for-field-teams-offline-first-ux-and-on-device-intelligence-4194ab9f2279](https://medium.com/@mrsikandar08/designing-mobile-apps-for-field-teams-offline-first-ux-and-on-device-intelligence-4194ab9f2279)  
> 14. Matrika v MŠ digitálně \- Řízení školy, použito května 4, 2026, [https://www.rizeniskoly.cz/casopisy/special-pro-materske-skoly/matrika-v-ms-digitalne.m-13189.html](https://www.rizeniskoly.cz/casopisy/special-pro-materske-skoly/matrika-v-ms-digitalne.m-13189.html)  
> 15. Systém pro mateřské školy | Twigsee, použito května 4, 2026, [https://www.twigsee.com/o-aplikaci/](https://www.twigsee.com/o-aplikaci/)  
> 16. School Management App — UX Case Study | by Teddu Akanksha | Feb, 2026 \- Medium, použito května 4, 2026, [https://medium.com/@tedduakanksha/school-management-app-ux-case-study-957326d636aa](https://medium.com/@tedduakanksha/school-management-app-ux-case-study-957326d636aa)  
> 17. využívání digitálních technologií v mateřských, základních, středních a vyšších odborných školách \- Česká školní inspekce, použito května 4, 2026, [https://www.csicr.cz/getattachment/4e7af154-d761-47d5-8ef6-10645fab4a61/Shrnuti-Vyuzivani-digitalnich-technologii-v-MS,-ZS,-SS-a-VOS.pdf](https://www.csicr.cz/getattachment/4e7af154-d761-47d5-8ef6-10645fab4a61/Shrnuti-Vyuzivani-digitalnich-technologii-v-MS,-ZS,-SS-a-VOS.pdf)  
> 18. Shrnutí 5\. odborného panelu IPs DATA: "Digitální vzdělávání v datech" \- Edu.cz, použito května 4, 2026, [https://edu.gov.cz/digitalni-vzdelavani-v-datech-shrnuti-odborneho-panelu-ips-data/](https://edu.gov.cz/digitalni-vzdelavani-v-datech-shrnuti-odborneho-panelu-ips-data/)  
> 19. I digitalizace českého školství má některé výborné výsledky \- Ondřej Neumajer \- domovská stránka, použito května 4, 2026, [https://ondrej.neumajer.cz/i-digitalizace-ceskeho-skolstvi-ma-nektere-vyborne-vysledky/](https://ondrej.neumajer.cz/i-digitalizace-ceskeho-skolstvi-ma-nektere-vyborne-vysledky/)  
> 20. Digiškolka – Informační systém pro mateřské školy, použito května 4, 2026, [https://digiskolka.cz/](https://digiskolka.cz/)  
> 21. Resilience pedagogů lesních mateřských škol a lesních klubů \- Digitální repozitář UK, použito května 4, 2026, [https://dspace.cuni.cz/handle/20.500.11956/192879](https://dspace.cuni.cz/handle/20.500.11956/192879)  
> 22. Lesní mateřské školy v České republice jako alternativa k předškolnímu vzdělávání: proces jejich zakládání \- IS MUNI, použito května 4, 2026, [https://is.muni.cz/th/v7s23/Bakalarka\_prace\_L.\_Sedova.pdf](https://is.muni.cz/th/v7s23/Bakalarka_prace_L._Sedova.pdf)  
> 23. Turning User Frustrations into UX Triumphs \- Mustafa Alawad \- UX/Product Designer, použito května 4, 2026, [https://alawad.ch/projects/turning-user-frustrations-into-ux-triumphs-a-case-study-on-a-local-school-app-klapp/](https://alawad.ch/projects/turning-user-frustrations-into-ux-triumphs-a-case-study-on-a-local-school-app-klapp/)  
> 24. Bezpečnost školních informačních systémů: Hesla na papírcích a nezabezpečené servery ve školním kabinetu pod stolem \- minulost nebo stále ještě dnešní realita? \- Edookit, použito května 4, 2026, [https://edookit.com/cs/article-wk-security-of-school-information-systems](https://edookit.com/cs/article-wk-security-of-school-information-systems)  
> 25. Jak si zkontrolovat bezpečnost školních webů a systémů vystavených do internetu \- Edu.cz, použito května 4, 2026, [https://edu.gov.cz/jak-si-zkontrolovat-bezpecnost-skolnich-webu-a-systemu-vystavenych-do-internetu/](https://edu.gov.cz/jak-si-zkontrolovat-bezpecnost-skolnich-webu-a-systemu-vystavenych-do-internetu/)  
> 26. How Should I Design Apps for Construction Workers?, použito května 4, 2026, [https://weareaffective.com/learning-centre/how-should-i-design-apps-for-construction-workers](https://weareaffective.com/learning-centre/how-should-i-design-apps-for-construction-workers)  
> 27. Digitální revoluce ve školkách nabírá na tempu. Hlavenka a Sláma investují miliony korun do Twigsee \- CzechCrunch, použito května 4, 2026, [https://cc.cz/digitalni-revoluce-ve-skolkach-nabira-na-tempu-hlavenka-a-slama-investuji-13-milionu-korun-do-twigsee/](https://cc.cz/digitalni-revoluce-ve-skolkach-nabira-na-tempu-hlavenka-a-slama-investuji-13-milionu-korun-do-twigsee/)  
> 28. SLOUČENÉ ŠKOLY JAKO PŘÍLEŽITOST A CESTA KE KVALITNÍMU VZDĚLÁVÁNÍ \- Edu.cz, použito května 4, 2026, [https://edu.gov.cz/wp-content/uploads/2026/01/Sloucene-skoly-jako-prilezitost-a-cesta-ke-kvalitnimu-vzdelavani.pdf](https://edu.gov.cz/wp-content/uploads/2026/01/Sloucene-skoly-jako-prilezitost-a-cesta-ke-kvalitnimu-vzdelavani.pdf)  
> 29. Twigsee: Školka v kapse, použito května 4, 2026, [https://www.twigsee.com/](https://www.twigsee.com/)  
> 30. Napsali o nás | Twigsee, použito května 4, 2026, [https://www.twigsee.com/napsali-o-nas/](https://www.twigsee.com/napsali-o-nas/)  
> 31. Aplikace Twigsee a systém ŠkolkIS spojily své síly, použito května 4, 2026, [https://www.twigsee.com/blog/aplikace-twigsee-a-system-skolkis-spojily-sve-sily/](https://www.twigsee.com/blog/aplikace-twigsee-a-system-skolkis-spojily-sve-sily/)  
> 32. Informační systém pro mateřské školky \- Edookit, použito května 4, 2026, [https://edookit.com/cs/information-system-for-kindergartens](https://edookit.com/cs/information-system-for-kindergartens)  
> 33. Funkce a přednosti | Škola Online, použito května 4, 2026, [https://www.skolaonline.cz/funkce-a-prednosti/](https://www.skolaonline.cz/funkce-a-prednosti/)  
> 34. Digitální technologie v kurikulu předškolního vzdělávání? Stát tím posvětí civilizační neduhy, říká ředitelka waldorfské mateřské školy \- EDUin, použito května 4, 2026, [https://www.eduin.cz/clanky/digitalni-technologie-v-kurikulu-predskolniho-vzdelavani-stat-tim-posveti-civilizacni-neduhy-rika-reditelka-waldorfske-materske-skoly/](https://www.eduin.cz/clanky/digitalni-technologie-v-kurikulu-predskolniho-vzdelavani-stat-tim-posveti-civilizacni-neduhy-rika-reditelka-waldorfske-materske-skoly/)  
> 35. Zpívané rituály v mateřské škole \- Theses, použito května 4, 2026, [https://theses.cz/id/px0l4a/BP\_Markov\_Martina.pdf](https://theses.cz/id/px0l4a/BP_Markov_Martina.pdf)  
> 36. Digitální wellbeing ve škole: proč je důležitý a co přináší nová koncepce \- Edu.cz, použito května 4, 2026, [https://edu.gov.cz/digitalni-wellbeing-ve-skole-proc-je-dulezity-a-co-prinasi-nova-koncepce/](https://edu.gov.cz/digitalni-wellbeing-ve-skole-proc-je-dulezity-a-co-prinasi-nova-koncepce/)  
> 37. Koncepce podpory digitálního wellbeingu ve vzdělávání, použito května 4, 2026, [https://digitalizace.rvp.cz/files/dw-koncepce.pdf](https://digitalizace.rvp.cz/files/dw-koncepce.pdf)  
> 38. Best Forest School Management Software: A Guide for Outdoor Schools, použito května 4, 2026, [https://activitymessenger.com/blog/best-forest-school-management-software-a-guide-for-outdoor-schools/](https://activitymessenger.com/blog/best-forest-school-management-software-a-guide-for-outdoor-schools/)  
> 39. Twigsee | Edu.cz, použito května 4, 2026, [https://edu.gov.cz/wp-content/uploads/2022/12/TWIGSEE.pdf](https://edu.gov.cz/wp-content/uploads/2022/12/TWIGSEE.pdf)  
> 40. Case Study: School Parent App | La Crèche Verte \- GraffersID, použito května 4, 2026, [https://graffersid.com/case-studies/school-parent-app/](https://graffersid.com/case-studies/school-parent-app/)  
> 41. Digital School Diary Software Solution \- Case Study \- Evinent, použito května 4, 2026, [https://evinent.com/portfolio/digital-school-diary-software-solution](https://evinent.com/portfolio/digital-school-diary-software-solution)  
> 42. LESNÍ MATEŘSKÁ ŠKOLKA JAKO CESTA K PŘIROZENOSTI \- Theses, použito května 4, 2026, [https://theses.cz/id/vumllh/LMS\_JAKO\_CESTA\_K\_PRIROZENOSTI.pdf](https://theses.cz/id/vumllh/LMS_JAKO_CESTA_K_PRIROZENOSTI.pdf)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAYCAYAAACWTY9zAAABjElEQVR4Xu2VPyhFcRTHjz9JlIQyMRlMdkabDMqARQkbxWZRBrtJEWZlRpEMSgYZ2CXZEAb5T3zPPeflOK50b/fet9xPfXq/c859953f/f3u7xHl5GTDOvyMYGbwj/WF5HwTrSG51KgjeWKWUpIGjl2eufCJtNiEJS43SdJYj8tXwDmXS40JnwB3FL5ktbDRJ7MkbH8VnTKSpo58odhMkTTW7QsRmSe5T7kvxOWeklvGpO4TkNT+4jPvySfjwsfBf/uLjxZ+a9dIjpMBU+O39ork/NuFM5o/ga8k5+OlxiOwC67CZ73uT5ZJGhtyeYt9mu+wQ8fcsK3xuFLHbfAabnyXg3q1jrfp5wQDeuEjyVO4UXmf8Qz9kk7DUxPbOv8jrJjYf9fGnfDcxFzj1YoN32DQxXbcpOMW+r089to9OGxiP4nI7MBmHS/CA9iv8YN+ModwFi5oPEqyXAVsI2NwC7aT7MFY8OH7QbLsVfANLmmtAb6QbO56eEuywZl9kqdYwE6iBp7BcZPLyUmdL+NuZwgLCBU4AAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAYCAYAAADtaU2/AAABTElEQVR4Xu2TzStEURjGH6NsbGZs/AXK0noWSrNRkqKUsrBQsxyr8U9IiZ0t1oQokiWlWNiqScpCWIikfDyn91zzep3uda+Z1cyvfnXe53y8d+6ZC7RpFbbpZwobhjtsMpDZJv2BLDM9kF+syUEaXJjccW2DrOzSDpPNQRqPmbyLLposMxUbkEeEX2me9tqwkYTut+l0Qpqe2YlmMw9pPGInEpil73TKTnh2kPAWn5CwIIa4fWV6aEPNf+43bt8tHbRhhPtc/nK/53SDfkD2OIbp1fcKoQp5xQ+IfyisQhbMmFyjD+ijr358QqfV3ALd9ONuBBqP0xfIt3vvdff8ht+Ll+ilqgdQX2PX6tr98Y5VnRp32Kiq9+m6mosomPqGDqk6Ne7uJ1QdHV6kNVqqT/1oHI23VJaaO3pAj0z+TPdUvUxP6Qpd8+M2LcQXeftahMf9F/cAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,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>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAYCAYAAABHqosDAAAClUlEQVR4Xu2XW4iNURTHl8uTJJeSxCi8KFJuSR6USYPkwQNThlEeXJpySymPHiiZyYMHDxN5kJLwgHKZRLnl8uR+rSklRBO58/+31nbWrHNOjnHwcPav/n17rbW/vfdZ397rO59IJpPJZP4776Gr0ZkR+Q6ti85aZ6JoYnrHQK0yE5oHnRZNzAKza54N0CbRpLwym8oYTExLdNY6E0QT0ysGeshK6CvUGPxvgp3YJjr/9BgoQ99gsxwcC76qcFh0YdUkjsekLwo+T+xfjp1QW/BNhoYHX1Xgol5H5x9S6Q9NVNr/GzQkOv8WXBQLcOKiXUdBR6B2sy9AO6xN5kPXoE5ot/M3QI+cfUK0sPsjwB303GL7oQ4XGwc9g25Dq0XvWyO6zqRV1vcl9MXaiZGi8x2HLptvCXQTmgLdgA5CtyxWFk401tofnf8SNAz6ZPYk6Ki1p4kmJOGfOBez1NpDoTHQdWjhzx7d+3P8WdYeLFqfEr7fQNEdk2i1q+/DeslkJbjGOdAh0WSm30J+uUt5btnpgxQXNian2dmz7cr+fDJktOjnRKLUhN53AHrobB/rkkJSiY/tkuL6MkiKE8mHmeDOWWttJmmGi5VaZ8X4mze7tvfvg7Y6O044F7rnbMabgl2q3QydcTYTEOvLFen+9otzlxt7o+hR6zF+sFOuHSfsB70QfSJPpbCzCHcid9c5s/kvu87ae0Rr12Kz/bhvRY/BnRBbblfvS2P7+/ndx7ETPsYjyd3ma+FvsQV6IFoIPctEdwF/JM8ua8gAi72DTlqbrBf9ah9hdh/Rp89EMqGfob0WYx1jjbgPTRWdm69jchY6D403m9yFnjibtY9jP4ZWOH+9FGoS2S764ujvfJlMJvNP+AHzAp83vYrEjwAAAABJRU5ErkJggg==>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAAYCAYAAADH9X5VAAAD50lEQVR4Xu2aWahOURTHl3nIrAwlhcgLkVcPnkQyy5sSkaSQByUPyosnmV4kXGUq8oISZciUzFEkKXPmZJ6tf+vsa9119/7O8Lmdz7V/9e+evfY+5+y919rD2d8likQikUgkEmk+HGT9yqHmxhzWU9Z31hqTl4cy+qY03+FhMz02+5KhHtu/zj7WE5XeyXqt0lm5S+X0TSm+60ESrZqWJC+4ZuzggTXUKGOsIQDa2dpjG2dslRjNuk9/0SkZKc13h1ktjG0JyYsnG3tb1lpjqzWOkMwUPW2Gh3XkdzRsmDmygmVtEfmf5aMviXMrMd4aPJTmu8XWwLwhfwd0Y/W2xhqgDes26x6rncmrxFfyt9M3vYe4xWpP+YIG+GY4B+rV0Ro91JTv8nRamXRnvWSdp8YjLguhdobslpEksxXIGzQA5RHwmm+sTsaWh6x1/6u0InnpJZtRQwxgfWYdsBk5CXVwyG75qa6LBA3QgYOA6azy8lKa75aTvHiCzagBRpE4apPNKEgoOEJ2DWY37eCiQQNwHwKmi83ISVHfrSa5D3stC5a0y6z3NkPzjoo3vqkZS1K3FTajINjA+tqaFjSDWHXGVk3QYCBAefZjPqrxXaX79rBWWqMmrcNqATfjbLQZOTlG/rbCppceC85FThs9J7nPpbOC97g9DK7xlVOUor7DjFnpPuQFAxoVRoHQmjiM5JN2Pms3axvrcYMSRH1YH1nbWXsT20DWIdYOV4jkCwFgdExR9jz0Z31g7bcZGUFdfZ0F2zJjS5vd0B++Z1VCB4y22c1xFtJ857hKUlcdoDgF31pfQthMctB5g1LatYWkwGxjdzykxieL+no4ydrs+JL8xYjuxfqUpKeRrJNgIWtucl0UjBSc6p6xGRlA57ngBtgP2E5yn7Goawg3a6Wdvzh+UPizGnUKfY6HSPMd0O0aTPIxAeCzfirvIsl5D8CWwJWrBw7EzICOeZUIoz90hoHo06POBhAi8wLJuYme0k6x5iXX11mTkmt0XNfkulrw9XCFdYfyTfNoK+7BsoI22NGPGRZnQD6msl6wHpEMKgQvZr9KYE+UVr9Z1uAhj+/Ws26q9Aj6U0aXxdGFTsPfq1S6EHigazD2Fqiozgthg8tR7b4khP095n8HfT5RpbHN2EUyQLQ/sFWwvsLhZVXoB+L3DRxX1yVpTKsY7Y6j6tpWxLFBXUeaDux1pqu08wFWjTqSz26ACcHNqjqgliZ/c4OIc3sRMINkORqSpDuQBA4qeDKxObBvwZ7mGUmg4V8RzjUoEWlqsIxi73Vc2bAcvaWGn9QnWGdZC0j8q30eiUQikUgk0iz4DZJLLVao6asrAAAAAElFTkSuQmCC>