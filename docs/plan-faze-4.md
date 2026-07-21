# Fáze 4 – UI: redesign podle skutečné identity Vhaaji

Tento dokument je **samostatné zadání**. Fáze je rozdělená na dílčí fáze 4.1–4.6, každou může provést jiný model s čistým kontextem. Před začátkem si přečti `CLAUDE.md`, `docs/BRIEF.md` (kap. 9–11, 15), `docs/decision-log.md` (fáze 0.3 „Otevřená rozhodnutí", zápis o desktopové prezentaci) a tento soubor celý. Proveď **jen svou dílčí fázi**.

---

## Kontext – proč redesign, ne systematizace

Současný vizuál prototypu (lesní paleta, odstíny, tvarosloví) **není schválený design** – vygeneroval ho Claude v dřívější fázi bez zadání od designérky. Slouží jen jako lešení. Fáze 4 je proto **redesign**: vizuální identita se přebírá ze **skutečného webu školky** (logo, barvy, případné další prvky – dodá designérka), ne ze současného prototypu ani z hlavy modelu.

Co z prototypu **zůstává**:

- Struktura, flows, navigace, komponenty jako stavební bloky, chování – UI fáze nemění logiku.
- Technický základ: tokeny v `tokens.css`, build do offline distu.

Co se **mění**: barvy, **typografie**, logo a značka v UI, odvozené odstíny (povrchy, bordery, tinty), případné grafické prvky z webu (ilustrace, tvarosloví, patičky…) dle rozhodnutí designérky. Současné fonty (Fraunces/Hanken) jsou stejné lešení jako paleta – o nové typografii rozhodne designérka na základě návrhu ze 4.1.

**Zásadní pravidlo pro skiny:** typografie (i tvarosloví, komponenty, stavy) se definuje **jednou a platí pro všechny čtyři školky** – skiny se liší výhradně barevností.

## Vstupy od designérky (bez nich se příslušná fáze nespouští)

- **V1 – zdrojový web:** URL (a případně exporty: logo v SVG/PNG, grafické prvky) → uložit do `podklady/` (je v .gitignore). Potřebné pro 4.1.
- **V2 – schválená paleta a typografie:** finální výběr barev a fontů/škály z návrhu, který vzejde ze 4.1 (designérka schvaluje, model navrhuje extrakcí z webu). Typografie se definuje jednou pro všechny školky.
- **V3 – palety skinů** pro Jaata, Kouzlo lesa, Maata (jen barevnost; typografie i vše ostatní shodné). Potřebné pro 4.5.
- **V4 – mikrocopy konvence:** tykání/vykání per role (návrh: průvodce tykání, rodič vykání). Potřebné pro 4.4.

## Neměnná pravidla (celá fáze 4)

1. **Žádná vizuální rozhodnutí z hlavy modelu.** Vše se odvozuje ze zdrojového webu, nebo jde o návrh k odsouhlasení designérkou. Model nikdy „nevylepšuje" vizuál vlastní invencí; kde chybí podklad, ptá se.
2. UI fáze nemění chování: flows, logika, navigace, názvosloví, data zůstávají (výslovné výjimky uvádí zadání dílčí fáze).
3. Každá dílčí fáze končí: `./build.sh`, vizuální QA všech tří appek (mobil 375 px, desktop 1440 px), zápis do decision-logu, atomické commity, aktualizace `CLAUDE.md` při změně pravidel stylování.
4. Nové hodnoty jen přes tokeny (`tokens.css`); komponenty z tokenů čerpají, nikdy natvrdo.
5. Dist musí zůstat offline-schopný: logo a grafika jako inline SVG / data URI, žádná CDN, žádné externí obrázky (výjimka zůstává Google Fonts).

---

## Fáze 4.1 – Extrakce identity z webu, návrh palety

**Cíl:** Z webu školky (vstup V1) vytěžit vizuální základ a předložit designérce návrh nové palety. Fáze je **analyticko-návrhová** – do kódu prototypu zasahuje jen přípravou tokenů, viditelný vzhled se ještě nemění.

1. Commitni případné visící změny v pracovním stromě (desktopová prezentace mobilních appek) – samostatný commit, ať redesign startuje z čistého stavu.
2. Projdi zdrojový web (browser tools / dodané exporty): vytáhni logo (SVG přednostně), barvy (primární, akcentní, pozadí, textové), **typografii webu** (fonty, řezy, hierarchie titulků), opakující se grafické prvky (tvary, ilustrace, patterny, styl fotografií), tone of voice titulků. Ulož pracovní extrakt do `podklady/` a shrnutí do `docs/design-system.md` (nový soubor, sekce „Foundations – zdroj: web").
3. Navrhni mapování na sémantické tokeny prototypu (`--color-primary`, `--color-accent`, `--color-bg`, `--color-surface*`, `--color-text*`, `--color-border*`, stavové barvy) – vč. kontrolního výpočtu kontrastů (AA: 4.5:1 text, 3:1 velký text/UI). Kde web AA nesplňuje, navrhni nejbližší vyhovující odstín a označ odchylku.
4. Navrhni **typografii**: fonty dle webu (příp. Google Fonts náhrada, pokud web používá nedostupný font – navrhni 2–3 kandidáty), typografická škála (velikosti/řezy/řádkování pro titulky, text, labely, hinty) jako tokeny. Jedna typografie pro všechny školky.
5. Připrav **náhled**: jednoduchá HTML stránka (mimo build, např. `docs/paleta-nahled.html`) se vzorníkem barev, typografickou hierarchií a klíčovými komponentami (tile, badge stavů, tlačítka, topbar) v novém vs. současném provedení, ať designérka schvaluje na konkrétním. U fontových kandidátů ukaž varianty vedle sebe.
6. Výstup: návrh v decision-logu + náhled → **čeká na V2** (schválení designérkou). Tokeny zatím nepřepínat.

---

## Fáze 4.2 – Aplikace redesignu (barvy, logo, shell)

**Cíl:** Prototyp přepnout na schválenou paletu a typografii (V2) a značku.

1. Přepiš hodnoty v `tokens.css` na schválenou paletu **a typografii** (fonty vč. Google Fonts `<link>` ve všech třech `src/*.html`, škála velikostí/řádkování). Odvozené odstíny (tinty, bordery, rgba překryvy) dopočítej z nových základních barev; rozptýlené natvrdo psané rgba/hex v `components.css`/`layout*.css`/`screens-*.css` a v inline stylech template stringů přepoj na tokeny.
2. Nasaď logo: drawer/sidebar hlavičky všech tří appek + rozcestník `index.html` (inline SVG). Favicon z loga (data URI).
3. Projdi všechny tři appky obrazovku po obrazovce a dolaď místa, kde nová paleta nesedí (např. avatarová pozadí, kalendářové buňky, grafy kapacit) – vždy odvozením z palety, ne novou barvou.
4. Google kalendář-styl v rodičovském kalendáři (`.gcal*` – záměrná nápodoba Googlu) ponech beze změny, nepřebarvovat.

**QA:** žádná obrazovka nemíchá starou a novou paletu; logo všude; kontrasty AA na hlavních kombinacích; dist offline.

---

## Fáze 4.3 – Sjednocení komponent a stavový vizuál

**Cíl:** Po přebarvení sjednotit dvojí varianty a dát stavům jeden vizuální jazyk.

1. Dořeš tabulku „Otevřená rozhodnutí" z decision-logu 0.3 (`.tlab`, `.tval`, `.hint`, …): sjednoť každou třídu na jednu variantu (výchozí pravidlo: větší/čitelnější průvodcovská hodnota, ať funguje venku na mobilu), duplicitní přepisy ze `screens-rodic.css` smaž, rozhodnutí zapiš. Aktivuj `--space-*` škálu v komponentách.
2. Sjednoť toast (jeden mechanismus – průvodcovský `#toast`; povolená výjimka z pravidla 2).
3. Jednotný badge/chip systém pro stavy: omluvenka, náhrada, platba, aktualita, docházkové kódy – stavová paleta v tokenech (`--state-*`), sdílená mapa `CODES` v `shared.js`, průvodcovy inline popisky přepojit (odložený bod z 0.3).
4. Empty states a potvrzení: každý seznam má smysluplný prázdný stav, každá akce potvrzení.
5. Doplň `docs/design-system.md`: tokeny, stavová paleta, komponenty s pravidly použití – „sada rozhodnutí a pravidel" dle briefu, ne knihovna.

**QA:** tentýž stav vypadá stejně ve všech appkách; obě mobilní appky mají shodnou typografickou hierarchii; design-system.md odpovídá kódu.

---

## Fáze 4.4 – Čitelnost, přístupnost, mikrocopy

1. Kontrast AA po redesignu (skript, výsledky do decision-logu), opravy přes tokeny.
2. Dotykové cíle ≥ 44×44 px v mobilních appkách (klikací plocha, ne nutně vizuál).
3. Mikrocopy: tykání/vykání dle V4, terminologie dle `objekty-systemu.md`, jednotný formát dat.
4. `:focus-visible` stavy (hlavně admin/desktop).

**QA:** kontrolní otázky BRIEF kap. 5; průchod všech appek bez nečitelných textů a malých cílů.

---

## Fáze 4.5 – Skiny sesterských školek

**Cíl:** Čtyři skiny přes tokeny – **jen barevnost** (V3); typografie (definovaná ve 4.2, společná), tvarosloví, layout i stavy shodné pro všechny školky (BRIEF kap. 10).

1. `src/styles/skins.css`: `[data-skin="vhaaji"]` (výchozí = paleta ze 4.2), `jaata`, `kouzlo-lesa`, `maata` – přepisují jen barevné tokeny; stavová paleta (`--state-*`) zůstává společná.
2. Demo přepínač: mobilní appky v patě draweru, admin v topbaru; drží se v JS proměnné, bez perzistence.
3. Kontrastní kontrola všech skinů; loga sesterských školek jen pokud je dodá designérka (jinak textový název).
4. `design-system.md` sekce Skiny: co skin smí/nesmí (BRIEF kap. 10).

---

## Fáze 4.6 – Figma knihovna

Z hotových, schválených obrazovek (BRIEF kap. 11): Foundations (tokeny, typografie, skiny) → Core components → Domain components (karta dítěte, řádek docházky, stav náhrady, aktualita, platba) → Patterns (omluvenka, docházka, tvorba aktuality) → Templates (dashboardy tří rolí). V sezení je k dispozici Figma MCP – generovat po malých celcích a každý ověřit proti prototypu. Ikonografie (dnes unicode glyfy): rozhodne designérka, případné ikony inline SVG.

---

## Pořadí a závislosti

4.1 (analýza) → **schválení palety designérkou (V2)** → 4.2 (aplikace) → 4.3 → 4.4 → 4.5 (potřebuje V3) → 4.6. Testování s respondenty je možné po 4.4; skiny a Figma na něj nečekají.

## Co NEdělat (celá fáze 4)

- Žádná vizuální invence mimo zdrojový web a schválené vstupy; při pochybnosti se zeptat designérky.
- Typografii měnit jen podle schváleného návrhu (V2); skiny ji nikdy nemění – je společná pro všechny školky.
- Neměnit flows, logiku, navigaci, seed data (mimo výslovné výjimky).
- Žádné externí závislosti navíc (CDN, ikonové fonty, obrázky z webu linkované po síti) – vše inline, dist offline.
