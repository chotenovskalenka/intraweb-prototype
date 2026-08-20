# **Komplexní analýza digitálních ekosystémů pro správu vícečetných mateřských škol: Integrace lesních a tradičních modelů v české vzdělávací krajině**

V současné éře prochází české předškolní vzdělávání hlubokou transformací, která je definována přechodem od analogových metod správy k sofistikovaným digitálním infrastrukturám. Tento report se zaměřuje na problematiku intrawebů a informačních systémů určených pro správu více mateřských škol najednou, přičemž reflektuje specifické potřeby jak klasických kamenných institucí, tak i environmentálně zaměřených lesních mateřských škol (LMŠ). Analýza vychází z aktuálních legislativních požadavků, tržních dat, pedagogických výzkumů a praktických zkušeností uživatelů.

## **1\. Funkční architektura intrawebů pro mateřské školy**

*(Míra jistoty informacemi: Vysoká)*

Moderní informační systémy pro mateřské školy (ŠIS) se vyvinuly z izolovaných databází v komplexní cloudové platformy, které integrují administrativní, pedagogické a komunikační moduly.1 Tato integrace je klíčová zejména pro subjekty spravující více odloučených pracovišť, kde je nezbytná centralizace dat při zachování provozní autonomie jednotlivých poboček.2

### **Jádrové administrativní funkce a legislativní shoda**

Základním pilířem každého systému je digitální matrika, jejíž vedení se stává od školního roku 2025/2026 pro všechny mateřské školy povinností.4 Systém musí umožňovat evidenci individuálních údajů o dětech v souladu s popisy struktur a číselníky zveřejněnými MŠMT.10 Pro správu více školek je zásadní "multi-tenant" architektura, která umožňuje řediteli nebo zřizovateli přepínat mezi jednotlivými pobočkami v rámci jednoho rozhraní, aniž by docházelo k duplicitě dat nebo nutnosti opakovaného přihlašování.2

| Modul | Popis funkčnosti pro více poboček | Legislativní rámec |
| :---- | :---- | :---- |
| **Digitální matrika** | Centralizovaná evidence dětí s možností filtrování dle jednotlivých škol/tříd. | Vyhláška o dokumentaci škol.11 |
| **Elektronická třídnice** | Záznam vzdělávacích aktivit a témat ŠVP specifických pro každou pobočku. | RVP PV a školský zákon.3 |
| **Správa personálu** | Evidence kvalifikace, suplování a pracovních výkazů napříč pobočkami. | Zákon č. 563/2004 Sb..14 |
| **Spisová služba** | Jednotný podací deník pro celý subjekt s přidělováním čísel jednacích. | Zákon o archivnictví a spisové službě.13 |
| **Generování výkazů** | Automatický export XML souborů pro sběr dat do matriky MŠMT. | Metodika sběru dat MŠMT.10 |

### **Specifické potřeby lesních mateřských škol v digitálním prostředí**

Lesní mateřské školy (LMŠ) představují specifickou výzvu pro digitální nástroje z důvodu jejich provozu v terénu a časté absence stabilní infrastruktury.16 Pro LMŠ je kritický zejména offline režim mobilních aplikací, který umožňuje pedagogům (průvodcům) zaznamenávat docházku a pedagogické poznámky přímo v lese, přičemž k synchronizaci dat s centrálním intrawebem dojde až po návratu do zázemí s připojením k internetu.19

V prostředí LMŠ, jako je například Vhaaji, Jaata nebo Maata, kde se zázemí často nachází v maringotkách či jurtách bez elektřiny, je nutné, aby systém minimalizoval energetickou náročnost na straně mobilních zařízení.18 Systém musí rovněž reflektovat standardy kvality LMŠ, které zahrnují specifické povinnosti, jako je evidence vybavení lékárniček pro terénní výpravy, záznamy o revizích topidel v jurtách a detailní krizové plány pro pohyb v přírodě.17

### **Komunikační moduly a interakce s rodinou**

Informační systémy fungují jako most mezi institucí a rodiči, což je vnímáno jako jeden z hlavních přínosů digitalizace.1 Pro subjekty s více školkami je klíčové, aby rodič, který má děti v různých pobočkách (např. jedno v lesní a druhé v kamenné), viděl v jedné aplikaci oba profily a dostával relevantní oznámení pro obě zařízení.2

* **Virtuální nástěnka:** Nahrazuje fyzické nástěnky v šatnách, umožňuje cílené zasílání informací (celá škola, konkrétní třída, jednotliví rodiče).2  
* **Multimediální galerie:** Sdílení fotografií a videí, které u lesních školek hraje zásadní roli při demonstraci činnosti školy, neboť rodiče nemají přímý vhled do dění v lese.13  
* **Systém omluv a docházky:** Okamžitá informace pro učitele o počtu přítomných dětí, což je v LMŠ kritické pro plánování trasy výpravy a bezpečnosti.3  
* **Ankety a sběr souhlasů:** Automatizace procesů při organizaci výletů nebo sběru souhlasů s GDPR, což šetří čas pedagogů.2

## **2\. Existující výzkumy, data a statistické přehledy**

*(Míra jistoty informacemi: Vysoká)*

Oblast digitalizace mateřských škol je v posledních letech podrobována intenzivnímu zkoumání ze strany státních orgánů i akademické sféry, zejména v souvislosti s Národním plánem obnovy a implementací nových technologií do předškolního vzdělávání.29

### **Tržní podíly a penetrace systémů**

Podle dostupných dat z roku 2024 ovládá majoritní část trhu (přibližně 88 % školních zařízení) společnost Bakaláři software a Škola OnLine, což vytváří silný základ pro interoperabilitu při přechodu dětí z MŠ na ZŠ.32 Nicméně v segmentu mateřských škol je trh více fragmentovaný, což dokládá skutečnost, že při pilotních sběrech dat do matriky v roce 2024 bylo identifikováno 12 různých evidenčních systémů.10

| Parametr | Statistický údaj | Zdroj |
| :---- | :---- | :---- |
| **Podíl IS Bakaláři/Škola OnLine** | 88 % trhu škol v ČR | 32 |
| **Počet zapojených MŠ do IS** | Přes 4 780 škol využívá systémy Bakaláři/Škola OnLine | 32 |
| **Finanční podpora digitalizace** | 4,8 mld. Kč celková alokace (komponenta 3.1 NPO) | 29 |
| **Počet dětí mimo výuku (jaro 2020\)** | Až 10 000 dětí v důsledku digitální propasti | 30 |
| **Absence žáků po pandemii** | Nárůst z 87,5 hod. na 103 hod. na žáka | 33 |

### **Pedagogický výzkum a dopady na rozvoj dítěte**

Výzkumy zaměřené na vliv ICT v mateřských školách naznačují, že technologie mohou být prospěšným nástrojem pro individualizaci vzdělávání, pokud jsou používány citlivě a pedagogicky správně.34 Studie ukazují, že personalizované vzdělávání podpořené digitálními nástroji může vést ke zlepšení výsledků až o 23 %.37 Zároveň však varují před riziky spojenými s rozvojem jemné motoriky a pozornosti. Děti, které tráví nadměrný čas u obrazovek, vykazují horší schopnost záměrné pozornosti ve srovnání s dětmi věnujícími se tradičním činnostem, jako je kresba nebo práce s přírodními materiály, což je klíčový argument pro zachování rovnováhy v LMŠ.16

Důležitým zjištěním je také vliv socioekonomického statusu rodiny na studijní výsledky, kde digitální propast může prohlubovat nerovnosti již v předškolním věku.30 Systémy pro správu školky proto musí být navrženy tak, aby nezatěžovaly rodiče finančně (např. aplikace zdarma pro rodiče) a byly přístupné i na starších zařízeních.23

### **Data o digitalizaci matriky a administrativy**

Přechod na digitální matriku je podložen novelou vyhlášky o dokumentaci škol a školských zařízení, která stanovuje povinnost digitálního předávání individuálních údajů od školního roku 2025/2026.7 V letech 2023–2025 probíhá pilotní testování, do kterého se školy mohou zapojit dobrovolně, aby si ověřily funkčnost svých systémů při generování XML výstupů.1

## **3\. Hlavní problémy a frustrace v praxi**

*(Míra jistoty informacemi: Vysoká)*

Implementace intrawebů a komunikačních aplikací v prostředí mateřských škol s sebou nese řadu výzev, které často vedou k frustraci jak na straně vedení škol, tak na straně pedagogů a rodičů.34

### **Administrativní a časová zátěž vedení škol**

Nejvýraznějším problémem je extrémní vytížení ředitelky v malých a středních mateřských školách. Ředitelky mají často vysoký úvazek přímé pedagogické práce u dětí (např. 16 hodin týdně), přičemž nemají k dispozici zástupkyni, hospodářku ani administrativní sílu.42 Digitalizace je jimi často vnímána jako "další úkol navíc" spíše než jako úleva, pokud systém vyžaduje složité nastavování nebo duplicitní zadávání dat.42

* **Problematika více pracovišť:** Správa odloučených pracovišť vzdálených několik kilometrů zvyšuje nároky na organizaci a komunikaci, což stávající systémy ne vždy efektivně řeší.42  
* **Nedostatečná IT podpora:** Mateřské školy nedisponují IT specialisty, takže veškeré technické problémy (nastavení Wi-Fi, správa tabletů, cloudové úložiště) řeší pedagogický personál na úkor času s dětmi.34

### **Frustrace na straně rodičů a etické otázky**

Rodiče vyjadřují obavy zejména v oblasti ochrany osobních údajů (GDPR). Častým zdrojem napětí je požadavek na vyplňování citlivých dat, jako jsou rodná čísla, adresy a čísla občanských průkazů osob pověřených k vyzvedávání dětí, přímo do mobilních aplikací.41

* **Digitální bariéra:** Někteří rodiče odmítají používat aplikace z principu (ochrana soukromí, odpor k technologiím) nebo jejich zařízení nejsou kompatibilní, což vede k nutnosti udržovat hybridní systém (papír \+ digitál), který je pro školku nejnáročnější.41  
* **Nejasnost v procesech:** Typickým příkladem je odhlašování obědů. Pokud systém omluv v aplikaci není přímo propojen s jídelním systémem, dochází k chybám, kdy dítě je omluveno z docházky, ale oběd mu není odhlášen, což generuje finanční ztráty rodičům a administrativní chaos školce.27  
* **Ztráta osobního kontaktu:** Existuje obava, že digitální "hlášení" o tom, co dítě dělalo, nahradí důležitý ranní a odpolední rituál sdílení informací mezi učitelkou a rodičem.23

### **Technické limity v lesních školkách**

V lesních mateřských školách jsou technické problémy umocněny prostředím. Absence elektřiny v zázemí (např. v haji u LMŠ Vhaaji) znamená, že digitální zařízení musí být nabíjena externě a jejich používání v zimních měsících je limitováno výdrží baterií.18 Problémem je také mobilní signál v hlubokých lesích, což činí online aplikace bez offline režimu nepoužitelnými.19

## **4\. Klíčoví hráči a produkty na trhu**

*(Míra jistoty informacemi: Vysoká)*

Český trh nabízí široké spektrum řešení, která se liší svou robustností, cenou a cílovou skupinou.1 Pro projekty spravující více školek najednou jsou relevantní zejména systémy s rozvinutou architekturou pro pobočky.2

### **Přehled hlavních informačních systémů**

| Produkt | Výrobce | Hlavní výhody | Cílová skupina |
| :---- | :---- | :---- | :---- |
| **Digiškolka** | Bakaláři software | Plná legislativní shoda, integrace s matrikou MŠMT, silná tradice. | Všechny typy MŠ, zejména státní. 32 |
| **Twigsee** | Twigsee s.r.o. | Moderní design, špičková mobilní aplikace, automatizace plateb a omluv. | Soukromé, lesní i progresivní státní MŠ. 2 |
| **MáŠkolka** | Dignus Services | Vyvinuto lidmi z praxe, správa více poboček, cenová dostupnost. | MŠ, DS a LMŠ s více pobočkami. 5 |
| **Edookit** | Unicorn | Komplexnost (vhodné pro ZŠ+MŠ), vysoké zabezpečení, robustní matrika. | Větší školské subjekty, soukromé sítě škol. 4 |
| **Školka v mobilu** | Školka v mobilu s.r.o. | Nízká cena, zaměření na komunikaci a elektronickou nástěnku. | Menší školky s důrazem na vztah s rodiči. 13 |

### **Case Study: Skupina škol Maata, Jaata a Vhaaji**

Tento cluster lesních školek a dětských skupin demonstruje potřebu sdílené správy. LMŠ Vhaaji vznikla jako "třetí sourozenec" Maaty a Jaaty, přičemž tyto subjekty sdílejí nejen pedagogickou vizi, ale i část provozní infrastruktury.21 Využívají intrawebovou docházku a elektronický systém omluv k koordinaci mezi jednotlivými lokalitami v Praze (Ďáblice, Dolní Chabry).18 Systém jim umožňuje efektivně spravovat přihlášky, dary od rodičů a povinnou dokumentaci, což je při kapacitě 15–20 dětí na jednu školku nezbytné pro udržení ekonomické stability.15

## **5\. Mezery v poznání a neprobádané oblasti**

*(Míra jistoty informacemi: Střední)*

Přes rychlý rozvoj digitalizace existuje několik oblastí, které dosud nejsou dostatečně zmapovány a mohou představovat rizika pro budoucí rozvoj.34

### **Dlouhodobý vliv na pracovní spokojenost a vyhoření**

Chybí longitudinální studie, které by zkoumaly, zda digitalizace skutečně vede k redukci stresu u ředitelek a pedagogů, nebo zda pouze transformuje jeden typ zátěže (papírování) v jiný (neustálá digitální dostupnost pro rodiče prostřednictvím chatů).23 Existují indicie, že očekávání rodičů na okamžitou odpověď v aplikaci může zvyšovat tlak na pedagogy i mimo pracovní dobu.23

### **Inkluze a digitální exkluze specifických skupin**

Dosud není dobře prozkoumáno, jak digitální komunikační nástroje ovlivňují zapojení rodin s odlišným mateřským jazykem nebo rodin z marginalizovaných skupin, které mohou mít omezený přístup k technologiím.30 Ačkoliv některé aplikace (např. Talking Points nebo Remind v zahraničí) nabízejí automatické překlady, v českém prostředí je tato funkce u lokálních systémů zatím v plenkách.48

### **Energetická a environmentální stopa digitalizace v LMŠ**

V kontextu lesních mateřských škol, které se hlásí k principům udržitelného rozvoje, chybí kritická reflexe environmentálního dopadu digitalizace (výroba zařízení, spotřeba energie, cloudová úložiště dat) v porovnání s tradičními metodami.18 Toto téma je relevantní pro filozofické směřování LMŠ, které se snaží o minimalismus a sepětí s přírodou.16

### **Integrace se zdravotnickými systémy**

Velkou mezerou je absence propojení školních informačních systémů s registry zdravotních údajů (např. očkovací průkaz), což nutí rodiče i školy k manuálnímu a opakovanému zadávání stejných informací, což zvyšuje riziko chyby a administrativní zátěž.41

## **Strategické závěry a doporučení**

Na základě provedené analýzy lze formulovat klíčová doporučení pro vývoj a implementaci intrawebu pro vícečetné mateřské školy:

1. **Priorita offline funkčnosti:** Pro segment lesních mateřských škol je nezbytné, aby intraweb nebyl závislý na permanentním internetovém připojení a umožňoval plnohodnotnou práci v terénu.18  
2. **Centralizace správy více subjektů:** Systém musí nabízet "dashboard zřizovatele", který umožňuje sledovat obsazenost, finanční toky a personální kapacity napříč všemi pobočkami (kamennými i lesními) v reálném čase.2  
3. **Propojení s jídelními systémy:** Aby se předešlo nejčastějším frustracím rodičů, musí být systém omluv přímo a bezchybně integrován s procesem odhlašování stravy.27  
4. **Respekt k ochraně soukromí:** Implementace musí zahrnovat edukaci rodičů o bezpečnosti dat a nabízet alternativní cesty pro ty, kteří odmítají ukládat citlivé údaje do cloudu.41  
5. **Minimalizace administrativy pro vedení:** Každá funkce musí být posuzována z hlediska úspory času pro ředitelku, která tráví většinu času přímou prací u dětí. Automatické generování legislativních výkazů (XML) je absolutní nutností.9

Digitalizace mateřských škol není cílem, ale prostředkem k tomu, aby se pedagogové mohli věnovat své primární roli – rozvoji a výchově dětí v bezpečném a podnětném prostředí, ať už v moderní budově nebo pod korunami stromů.4

#### **Citovaná díla**

> 1. Školní informační systémy (ŠIS) pro mateřské školy \- Edu.cz, použito března 23, 2026, [https://edu.gov.cz/skolni-informacni-systemy-sis-pro-materske-skoly/](https://edu.gov.cz/skolni-informacni-systemy-sis-pro-materske-skoly/)  
> 2. Twigsee \- Edu.cz, použito března 23, 2026, [https://www.edu.cz/wp-content/uploads/2022/12/TWIGSEE.pdf](https://www.edu.cz/wp-content/uploads/2022/12/TWIGSEE.pdf)  
> 3. Twigsee: Školka v kapse, použito března 23, 2026, [https://www.twigsee.com/](https://www.twigsee.com/)  
> 4. Mateřské školy a digitalizace: Jak školní informační systém zjednoduší Vaši práci \- Edookit, použito března 23, 2026, [https://edookit.com/cs/article-wk-information-system-for-kindergartens](https://edookit.com/cs/article-wk-information-system-for-kindergartens)  
> 5. CRM, použito března 23, 2026, [https://crm.topskolky.cz/](https://crm.topskolky.cz/)  
> 6. Školka v mobilu a online \- MáŠkolka, použito března 23, 2026, [https://www.maskolka.cz/skolka-v-mobilu-online](https://www.maskolka.cz/skolka-v-mobilu-online)  
> 7. Mateřské školy a digitalizace: Jak školní informační systém zjednoduší vaši práci, použito března 23, 2026, [https://www.rizeniskoly.cz/casopisy/special-pro-materske-skoly/materske-skoly-a-digitalizace-jak-skolni-informacni-system-zjednodusi-vasi-praci.m-13831.html](https://www.rizeniskoly.cz/casopisy/special-pro-materske-skoly/materske-skoly-a-digitalizace-jak-skolni-informacni-system-zjednodusi-vasi-praci.m-13831.html)  
> 8. Matrika digitálně: Co čeká školky od roku 2025 a jak se na to připravit \- Edookit, použito března 23, 2026, [https://edookit.com/cs/article-wk-registry-in-kindergarten](https://edookit.com/cs/article-wk-registry-in-kindergarten)  
> 9. Matrika v MŠ digitálně \- Řízení školy, použito března 23, 2026, [https://www.rizeniskoly.cz/casopisy/special-pro-materske-skoly/matrika-v-ms-digitalne.m-13189.html](https://www.rizeniskoly.cz/casopisy/special-pro-materske-skoly/matrika-v-ms-digitalne.m-13189.html)  
> 10. DIGITALIZACE V MŠ: KROK ZA KROKEM, použito března 23, 2026, [https://edu.gov.cz/wp-content/uploads/2025/05/Prezentace\_souhrn\_digitalizace\_ms.pdf](https://edu.gov.cz/wp-content/uploads/2025/05/Prezentace_souhrn_digitalizace_ms.pdf)  
> 11. Novela vyhlášky o dokumentaci škol a školských zařízení \- MŠMT, použito března 23, 2026, [https://msmt.gov.cz/vzdelavani/skolstvi-v-cr/statistika-skolstvi/novela-vyhlasky-o-dokumentaci-skol-a-skolskych-zarizeni](https://msmt.gov.cz/vzdelavani/skolstvi-v-cr/statistika-skolstvi/novela-vyhlasky-o-dokumentaci-skol-a-skolskych-zarizeni)  
> 12. Sborník konference ISSS 2024, použito března 23, 2026, [https://isss.cz/wp-content/uploads/2024/05/ISSS2024\_sbornik\_opt.pdf](https://isss.cz/wp-content/uploads/2024/05/ISSS2024_sbornik_opt.pdf)  
> 13. Školka v mobilu \- Informační systém pro mateřské školy, použito března 23, 2026, [https://skolkavmobilu.cz/](https://skolkavmobilu.cz/)  
> 14. Správa mateřské školy a dětské skupiny aplikací MáŠkolka, použito března 23, 2026, [https://www.maskolka.cz/sprava-materske-skoly-a-detske-skupiny](https://www.maskolka.cz/sprava-materske-skoly-a-detske-skupiny)  
> 15. ŠVP Vhaaji 2023.docx, použito března 23, 2026, [https://vhaaji.cz/wp-content/uploads/2023/06/SVP-Vhaaji-2023.docx-3.pdf](https://vhaaji.cz/wp-content/uploads/2023/06/SVP-Vhaaji-2023.docx-3.pdf)  
> 16. ŠKOLNÍ VZDĚLÁVACÍ PROGRAM Lesní mateřské školy Prostor plus z. s. “Svět je dobrý” \- Školka v zahradě, použito března 23, 2026, [https://www.skolkavzahrade.cz/wp-content/uploads/2020/06/skolni\_vzdelavaci\_program\_skolka\_v\_zahrade\_2020.pdf](https://www.skolkavzahrade.cz/wp-content/uploads/2020/06/skolni_vzdelavaci_program_skolka_v_zahrade_2020.pdf)  
> 17. Standardy kvality | ALMŠ \- Asociace lesních mateřských škol, použito března 23, 2026, [https://www.lesnims.cz/sekce/standardy-kvality](https://www.lesnims.cz/sekce/standardy-kvality)  
> 18. ŠKOLNÍ a PROVOZNÍ ŘÁD LESNÍ MATEŘSKÉ ŠKOLY vhaaji, sro, použito března 23, 2026, [https://vhaaji.cz/wp-content/uploads/2023/06/SR-VHAAJI.pdf](https://vhaaji.cz/wp-content/uploads/2023/06/SR-VHAAJI.pdf)  
> 19. Bakaláři OnLine \- App Store \- Apple, použito března 23, 2026, [https://apps.apple.com/ci/app/bakal%C3%A1%C5%99i-online/id1459368580](https://apps.apple.com/ci/app/bakal%C3%A1%C5%99i-online/id1459368580)  
> 20. L'app Bakaláři OnLine \- App Store \- Apple, použito března 23, 2026, [https://apps.apple.com/es/app/bakal%C3%A1%C5%99i-online/id1459368580?l=ca](https://apps.apple.com/es/app/bakal%C3%A1%C5%99i-online/id1459368580?l=ca)  
> 21. Vhaaji\! – lesní mateřská škola, použito března 23, 2026, [https://vhaaji.cz/](https://vhaaji.cz/)  
> 22. vhaaji \- Dětský klub Maata, z. s., použito března 23, 2026, [http://www.maata.cz/rozdeleni-maaty/vhaaji/](http://www.maata.cz/rozdeleni-maaty/vhaaji/)  
> 23. Systém pro mateřské školy | Twigsee, použito března 23, 2026, [https://www.twigsee.com/o-aplikaci/](https://www.twigsee.com/o-aplikaci/)  
> 24. Technology Enabled Teaching \- Learning \- ResearchGate, použito března 23, 2026, [https://www.researchgate.net/profile/Jeena-Joseph-12/publication/356892922\_Technology\_Enabled\_Teaching\_-Learning/links/61b1aed68429577d97aef9ee/Technology-Enabled-Teaching-Learning.pdf](https://www.researchgate.net/profile/Jeena-Joseph-12/publication/356892922_Technology_Enabled_Teaching_-Learning/links/61b1aed68429577d97aef9ee/Technology-Enabled-Teaching-Learning.pdf)  
> 25. Twigsee | Soukromá mateřská škola, použito března 23, 2026, [https://www.soukromamaterskaskola.cz/cs/pro-rodice/twigsee/a-72/](https://www.soukromamaterskaskola.cz/cs/pro-rodice/twigsee/a-72/)  
> 26. Napsali o nás | Twigsee, použito března 23, 2026, [https://www.twigsee.com/napsali-o-nas/](https://www.twigsee.com/napsali-o-nas/)  
> 27. Aplikace Twigsee, pořadí někdo? \- Diskuze \- eMimino.cz, použito března 23, 2026, [https://www.emimino.cz/diskuse/aplikace-twigsee-poradi-nekdo-506267/](https://www.emimino.cz/diskuse/aplikace-twigsee-poradi-nekdo-506267/)  
> 28. Twigsee docházka \- Diskuze \- eMimino.cz, použito března 23, 2026, [https://www.emimino.cz/diskuse/twigsee-dochazka-535079/](https://www.emimino.cz/diskuse/twigsee-dochazka-535079/)  
> 29. Digitalizace ve školách s podporou z NPO je v plném proudu \- MŠMT ČR, použito března 23, 2026, [https://msmt.gov.cz/digitalizace-na-skolach-s-podporou-z-narodniho-planu-obnovy](https://msmt.gov.cz/digitalizace-na-skolach-s-podporou-z-narodniho-planu-obnovy)  
> 30. Národní plán obnovy pomůže i digitální transformaci českých škol \- Edu.cz, použito března 23, 2026, [https://edu.gov.cz/narodni-plan-obnovy-pomuze-i-digitalni-transformaci-ceskych-skol/](https://edu.gov.cz/narodni-plan-obnovy-pomuze-i-digitalni-transformaci-ceskych-skol/)  
> 31. Digitalizace vzdělávání z Národního plánu obnovy pokračuje \- MŠMT ČR, použito března 23, 2026, [https://msmt.gov.cz/digitalizace-vzdelavani-z-narodniho-planu-obnovy-pokracuje](https://msmt.gov.cz/digitalizace-vzdelavani-z-narodniho-planu-obnovy-pokracuje)  
> 32. Digiškolka – Informační systém pro mateřské školy, použito března 23, 2026, [https://digiskolka.cz/](https://digiskolka.cz/)  
> 33. Absence jsou varovný signál vzdělávacího neúspěchu. Naučme se je sledovat a řešit jako v zahraničí \- PAQ Research, použito března 23, 2026, [https://www.paqresearch.cz/post/absence-jsou-varovny-signal-vzdelavaciho-neuspechu-naucme-se-je-sledovat-a-resit-jako-v-zahranici/](https://www.paqresearch.cz/post/absence-jsou-varovny-signal-vzdelavaciho-neuspechu-naucme-se-je-sledovat-a-resit-jako-v-zahranici/)  
> 34. Výhody a nevýhody moderních technologií v mateřských školách \- Theses, použito března 23, 2026, [https://theses.cz/id/ppw2my/38644422](https://theses.cz/id/ppw2my/38644422)  
> 35. Univerzita Karlova Pedagogická fakulta BAKALÁŘSKÁ PRÁCE Vliv digitalizace školství na efektivitu výuky z pohled, použito března 23, 2026, [https://dspace.cuni.cz/bitstream/handle/20.500.11956/189334/130382222.pdf?sequence=1\&isAllowed=y](https://dspace.cuni.cz/bitstream/handle/20.500.11956/189334/130382222.pdf?sequence=1&isAllowed=y)  
> 36. Exploring Parents' Perceptions of the Importance of Technology in Early Childhood Education Among the Sidama People \- Preprints.org, použito března 23, 2026, [https://www.preprints.org/manuscript/202405.0309](https://www.preprints.org/manuscript/202405.0309)  
> 37. The Impact of Social Innovation in Education \- Waterford.org, použito března 23, 2026, [https://www.waterford.org/blog/the-impact-of-social-innovation-in-education/](https://www.waterford.org/blog/the-impact-of-social-innovation-in-education/)  
> 38. Využití digitálních technologií v mateřských školách \- Vysokoškolské kvalifikační práce, použito března 23, 2026, [https://theses.cz/id/a6gc0s/Vyuit\_digitlnch\_technologi\_v\_mateskch\_kolch\_Appeltauerov.pdf](https://theses.cz/id/a6gc0s/Vyuit_digitlnch_technologi_v_mateskch_kolch_Appeltauerov.pdf)  
> 39. Předškolní děti a digitální technologie \- Šance Dětem, použito března 23, 2026, [https://sancedetem.cz/predskolni-deti-digitalni-technologie](https://sancedetem.cz/predskolni-deti-digitalni-technologie)  
> 40. INFORMAČNÍ SYSTÉMY VE VZDĚLÁVÁNÍ \- IS MUNI, použito března 23, 2026, [https://is.muni.cz/el/1421/jaro2016/VIKMB39/um/kniha\_Informacni\_systemy\_ve\_vzdelavani\_kor\_MG.pdf](https://is.muni.cz/el/1421/jaro2016/VIKMB39/um/kniha_Informacni_systemy_ve_vzdelavani_kor_MG.pdf)  
> 41. Aplikace Twigsee \- údaje o dítěti \- Diskuze \- eMimino.cz, použito března 23, 2026, [https://www.emimino.cz/diskuse/aplikace-twigsee-udaje-o-diteti-443025/](https://www.emimino.cz/diskuse/aplikace-twigsee-udaje-o-diteti-443025/)  
> 42. Diskuzní fórum \- Vzdělávací služby, použito března 23, 2026, [https://www.vzdelavacisluzby.cz/forum/kategorie-6/podkategorie-1/prispevek-70](https://www.vzdelavacisluzby.cz/forum/kategorie-6/podkategorie-1/prispevek-70)  
> 43. Otázky ohledně studentských informačních systémů. : r/Montessori \- Reddit, použito března 23, 2026, [https://www.reddit.com/r/Montessori/comments/185xzhv/questions\_about\_student\_information\_systems/?tl=cs](https://www.reddit.com/r/Montessori/comments/185xzhv/questions_about_student_information_systems/?tl=cs)  
> 44. MáŠkolka – Aplikace na Google Play, použito března 23, 2026, [https://play.google.com/store/apps/details?id=com.dignus.maskolka\&hl=cs](https://play.google.com/store/apps/details?id=com.dignus.maskolka&hl=cs)  
> 45. Lesní mateřská škola Vhaaji s.r.o. \- 2026 Company Profile \- Tracxn, použito března 23, 2026, [https://tracxn.com/d/legal-entities/czech-republic/lesni-materska-skola-vhaaji-s.r.o./\_\_q8EcZQ\_xWeZS67GjCnZ0A560Mg8Skq6I1XtjMWjCnKc](https://tracxn.com/d/legal-entities/czech-republic/lesni-materska-skola-vhaaji-s.r.o./__q8EcZQ_xWeZS67GjCnZ0A560Mg8Skq6I1XtjMWjCnKc)  
> 46. Sada přednášek pro předmět:„Digitální technologie v preprimárním vzdělávání“ \- Informatické myšlení, použito března 23, 2026, [https://archiv-imysleni.npi.cz/images/vyukove\_materialy/UJEP\_Digitalni\_technologie\_v\_preprimarnim\_vzdelavani.pdf](https://archiv-imysleni.npi.cz/images/vyukove_materialy/UJEP_Digitalni_technologie_v_preprimarnim_vzdelavani.pdf)  
> 47. Strategie digitálního vzdělávání do roku 2020 \- MŠMT ČR, použito března 23, 2026, [https://msmt.gov.cz/vzdelavani/skolstvi-v-cr/strategie-digitalniho-vzdelavani-do-roku-2020](https://msmt.gov.cz/vzdelavani/skolstvi-v-cr/strategie-digitalniho-vzdelavani-do-roku-2020)  
> 48. apps \- TCEA TechNotes Blog, použito března 23, 2026, [https://blog.tcea.org/tag/apps/page/3/](https://blog.tcea.org/tag/apps/page/3/)  
> 49. Projekty \- Lesní klub, použito března 23, 2026, [https://www.lesniklub.cz/o-lesnim-klubu-jurta/projekty/](https://www.lesniklub.cz/o-lesnim-klubu-jurta/projekty/)  
> 50. EKOŠKOLKY A LESNÍ MATEŘSKÉ ŠKOLY \- Ministerstvo životního prostředí, použito března 23, 2026, [https://apps.mzp.cz/web/edice.nsf/50D89B7B0E8BAC4FC12577AB004462B8/$file/OVV-ekoskolky-20100927.pdf](https://apps.mzp.cz/web/edice.nsf/50D89B7B0E8BAC4FC12577AB004462B8/$file/OVV-ekoskolky-20100927.pdf)  
> 51. Strašák jménem matrika: Jak snadno vybrat informační systém pro školku \- Řízení školy, použito března 23, 2026, [https://www.rizeniskoly.cz/casopisy/special-pro-materske-skoly/strasak-jmenem-matrika-jak-snadno-vybrat-informacni-system-pro-skolku.m-14161.html](https://www.rizeniskoly.cz/casopisy/special-pro-materske-skoly/strasak-jmenem-matrika-jak-snadno-vybrat-informacni-system-pro-skolku.m-14161.html)