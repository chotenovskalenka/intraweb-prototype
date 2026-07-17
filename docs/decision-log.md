# Decision log — Fáze 0

Průběžný zápis rozhodnutí a nálezů během restrukturalizace prototypu (viz [plan-faze-0.md](plan-faze-0.md)).

## Rozhodnutí

### 2026-07-16 — Fáze 0.1 (Průvodcovská appka + build skript)

- Přesunut `BRIEF.md` → `docs/BRIEF.md` (git mv), založen tento decision-log.
- `prototyp_pruvodce.html` rozdělen do `src/` beze změny chování a vzhledu.
- **Pořadí `<script src>`:** shared → data → screens/* → modals → core. `core.js` je poslední, protože obsahuje úvodní `renderModalRoot(); render();`. `let`/`const` v pozdějších souborech (např. stavové proměnné v `core.js`) jsou funkčně dostupné i z dřívějších souborů — všechny klasické skripty sdílejí jeden globální lexikální scope; žádný kód na top-level dřívějšího souboru je nečte, takže nevzniká TDZ chyba.
- **Pořadí CSS (kaskáda):** tokens → base → layout → components → screens-pruvodce. Ověřeno, že přesun tříd mezi soubory nemění vypočtenou kaskádu (viz Nálezy — `.odbtn`/`.ghostred`).
- **Hranice components vs. screens-pruvodce.** Do `screens-pruvodce.css` šly třídy vázané na jednu obrazovku a pojmenované podle ní: `.specbar`/`.spectit`/`.specnums`, `.temanav`, `.works`/`.work`, `.frow`, `.odbtn`, `.rozh`/`.rozhd`, `.gchips`/`.gchip`. Zbytek (vč. sporných jako `.tabs`/`.tab`, `.switch`, `.modes`, `.selin`, `.rnote`, `.clink`, `.ghostred`) šel do `components.css`.
- **Rozdělení JS helperů.** `shared.js` = `avHash`, `avatar`, `esc`, `escTa`, `norm`, `fmt`, `showToast`, `renderKeepFocus`. `data.js` = seed data + čisté datové helpery používané více obrazovkami (`planCode`, `weekFor`, `here`, `staysPM`, `full`, `byAlpha`, `getCode`/`baseCode`/`todayCode`, `presentCount`, `dayLbl`, `serving`, `recordsFor`, `parentsFor`, `rozhovoryFor`, konstanty `DAYS`/`DOW`/`TODAY`/`TODAYD`/`wd`/`isWE`, mutovatelné mapy `worksMap`/`dopoMap`/`rozhovoryMap`, stavové konstanty scén `temaMonth`/`uspavaToday`). Funkce a stav používané jen jednou obrazovkou jsou v jejím `screens/*.js`.
- **`build.sh`** je bash bez závislostí; inlinuje lokální `<link rel=stylesheet>` a `<script src>` do `dist/prototyp_<name>.html`, externí URL (Google Fonts) nechává. Idempotentní, spustitelný z rootu.
- **Původní `prototyp_pruvodce.html` v rootu ponechán** — smaže se až ve fázi 0.5.

### 2026-07-16 — Fáze 0.2 (Rodičovská appka)

- `prototyp_rodic.html` rozdělen do `src/scripts/rodic/` (data.js, core.js, modals.js, screens/{prehled,aktuality,dochazka,profil,platby,kalendar,plan,fotky,kontakty}.js) + `src/styles/screens-rodic.css`, shell `src/rodic.html`. Load order stejný vzor jako průvodce: shared → data → screens/* → modals → core.
- **`avatar`/`avHash` jsou byte-identické s `shared.js`** → z rodiče odstraněny, použit `shared.js`.
- **Rodičovský `showToast` je jiný** než v `shared.js` (vkládá `<div class="toast">` do `#toastbox` a po 1,8 s ho odstraní; sdílená verze používá pevný `#toast` + třídu `.on`). Ponechán v `rodic/core.js` jako `window.showToast` — přebije globální funkci ze `shared.js` (přiřazení běží později). Kandidát na sjednocení ve fázi 0.3.
- **Overlaye rodiče** (průvodce/fond/jídelníček/akce) se nevykreslují přes `#modalRoot`, ale inline do `#content` řízené stavem `overlay` → soubor `rodic/modals.js` (`renderGuide/renderFond/renderMenuDetail/renderAkceDetail` + `openGuide/openAkce/openFond/openMenu/closeOverlay`).
- **Nový sdílený token `--green:#3C7A4E`** přidán do `tokens.css` (používá jen rodič v `.ubadge.ano`; průvodce ho ignoruje).
- **Docházkové kódy:** rodič používá navíc kód `NE` (Neomluveno) oproti `C/D/O/OM` z CLAUDE.md. Zachováno; kandidát na sjednocení stavů ve fázi 1 (viz plán 0.3 bod 4).
- **CSS deduplikace (fáze 0.2 jen zaznamenává, sjednocení je 0.3).** Z rodiče se do `screens-rodic.css` nekopírují třídy byte-shodné s `components/layout` (19 tříd, mj. `.tile`, `.back`, `.contact`, `.av`, `.cal`, `.switch button.on`). Rodičovské **odlišné varianty sdílených tříd** jdou do `screens-rodic.css` (loaduje se poslední, takže vyhrávají): `.scroll` (spodní padding 22 vs 30), `.burger` (20 vs 21 px), `.ttl` (18 vs 19), `.ditem` (14,5 vs 15), `.tlab`, `.tval`, `.np`, `.vhead`, `.switch button`, `.pav`, `.pfull`, `.cbtn`, `.addbtn`, `.hint`, `.note2`, `.note`. Kandidáti na sjednocení v 0.3.
- **`body{…padding:0}`** rodiče je oproti sdílenému `base.css` navíc jen o `padding:0`, což už vynucuje `*{padding:0}` → vizuálně shodné, rodičovské `body` se do `screens-rodic.css` nekopíruje. Ověřeno: všech 258 ostatních rodičovských CSS pravidel je v poskládaném CSS přítomno.
- **`.role`** v rodiči se liší (chybí `white-space:nowrap`), ale v rodičovském markupu žádný `.role` prvek není → rozdíl je bez vizuálního dopadu.

### 2026-07-16 — Fáze 0.3 (Deduplikace sdíleného kódu)

Sjednoceno jen to, co je **vizuálně/funkčně nerozlišitelné** (Neměnné pravidlo č. 1 — vzhled se nesmí změnit). Viditelné rozdíly zůstávají v obou variantách a čekají na rozhodnutí uživatelky (viz „Otevřená rozhodnutí").

**Sjednoceno (bez dopadu na vzhled/chování):**

- **JS `DOW`, `wd`, `isWE`** byly byte-identické v obou `data.js` → přesunuty do `shared.js` (načítá se první, před oběma `data.js`) a z obou `data.js` odstraněny. `TODAY` (rodič 3 / průvodce 2) a `DAYS` (jen průvodce) zůstávají per-app. Ověřeno v prohlížeči: `DOW`/`wd(3)`/`isWE(6)` fungují v obou appkách, žádná chyba „already been declared".
- **CSS `.works` / `.work`** byly byte-identické v `screens-pruvodce.css` i `screens-rodic.css` → přesunuty do `components.css` (dětské „práce" / portfolio, používá je průvodce v Dětech i rodič v Profilu). Z obou screens souborů odstraněny. Ověřeno: `.works` = 3 sloupce, `.work` aspect-ratio 1/1 v obou appkách.
- **Mrtvý CSS `.role` v `screens-rodic.css`** odstraněn — rodičovský markup žádný `.role` prvek nemá (topbar používá `.kidsel`), pravidlo bylo bez efektu. Sdílená verze zůstává v `layout.css`.

**Ponecháno vědomě (různý mechanismus / chování — sjednocení by změnilo chování):**

- **Toast.** Průvodce: pevný `#toast` + třída `.on` s CSS transition (`shared.js` `showToast`). Rodič: `#toastbox`, do kterého se vloží `<div class="toast">` a po 1,8 s odstraní (`rodic/core.js` `window.showToast`, přebíjí sdílenou verzi). CSS `.toast` se proto taky liší (layout.css s `.on`/opacity/transform vs. screens-rodic.css statický). Sjednocení = viditelná změna animace u jedné z appek → neprovedeno.
- **Docházkové kódy.** Obě appky používají shodná písmena `C/D/O/OM`. Rodič má navíc `NE` (Neomluveno; průvodce pro tentýž stav používá prázdný řetězec) a vlastní centrální mapu `CODES`/`ORDER`/`chip`/`mark`; průvodce centrální mapu nemá (popisky inline v obrazovkách). Vytvoření sdílené `CODES` mapy a přepojení průvodcových inline popisků je refaktor s rizikem změny chování → odloženo na fázi 1 (sjednocení stavů), viz plán 0.3 bod 4.

**Otevřená rozhodnutí — viditelně odlišné varianty sdílených tříd (ponechány obě, rozhodne uživatelka):**

Tyto třídy mají v průvodci (`components.css`/`layout.css`) a rodiči (`screens-rodic.css`) odlišnou vizuální hodnotu. Sjednocení na jednu variantu by změnilo vzhled jedné appky, proto zatím ponechány obě. Pokud uživatelka bude chtít jednotnou typografickou škálu, půjde o vědomou vizuální úpravu (fáze 1 / UI), ne o mechanickou dedup.

| Třída | Průvodce | Rodič | Rozdíl |
|---|---|---|---|
| `.scroll` | spodní padding 30 | 22 | 8 px spodní mezera |
| `.burger` | 21 px | 20 px | 1 px |
| `.ttl` | 19 px | 18 px | 1 px |
| `.ditem` | 15 px | 14,5 px | 0,5 px |
| `.tlab` | 12 px, barva `#605B4F` | 11 px, `--muted` (#736E61) | velikost + barva |
| `.tval` | 14,5 px, line-height 1.5 | 13,5 px, bez line-height | velikost + řádkování |
| `.np` | 14 px, padding 5px | 13,5 px, padding 4px | drobný |
| `.switch button` | 13,5 px | 13 px | 0,5 px |
| `.vhead` | margin 4/2/9 | 2/2/8 | drobný |
| `.pav` | margin 6/0/10 | 4/0/10 | drobný |
| `.pfull` | 13 px | 12,5 px | 0,5 px |
| `.cbtn` | 13 px | 12,5 px | 0,5 px |
| `.addbtn` | 13 px, padding 10 | 12,5 px, padding 9 | drobný |
| `.hint` | 12,5 px | 11,5 px | 1 px |
| `.note2` | 12 px, line-height 1.5 | 11,5 px, line-height 1.45 | drobný |
| `.note` | 13,5 px, min-height 54 | 13 px, min-height 48, margin-top 9 | drobný |

Navíc **kolize jmen tříd** (stejný název, jiný účel v každé appce, nikdy se nenačítají spolu — ponecháno per-app v příslušném `screens-*.css`): `.frow` (průvodce = řádek historie fondu / rodič = řádek platby), `.gchips`/`.gchip` (průvodce = tag v tématickém plánu / rodič = průvodce-chip na dashboardu). Nejsou to sdílené komponenty, jen shodná jména.

### 2026-07-16 — Fáze 0.4 (Sémantické tokeny)

Design tokeny v `tokens.css` přejmenovány na sémantickou vrstvu. **Vypočtené hodnoty se nezměnily** — jen názvy. Staré aliasy odstraněny (žádná kompatibilní vrstva, jeden zdroj pravdy). Náhrada proběhla přes přesné `var(--old)` → `var(--new)` ve všech `src/styles/*.css` i `src/scripts/**/*.js` (inline styly v template stringách). Ověřeno: `grep` na staré názvy v `src/` i `dist/` vrací 0; všechny tokeny se v prohlížeči rozřešují na původní hex/rgba; obě appky (src i dist) projdou všemi sekcemi bez chyb v konzoli, `.ttl` = rgb(33,64,47) = `--color-primary-strong`, zaplacená badge = rgb(60,122,78) = `--color-success`.

**Mapování starý → nový:**

| Starý | Nový | Hodnota |
|---|---|---|
| `--paper` | `--color-bg` | #EFE9DB |
| `--card` | `--color-surface` | #FBF8F0 |
| `--card2` | `--color-surface-2` | #F4EEDF |
| `--ink` | `--color-text` | #2B2A26 |
| `--muted` | `--color-text-muted` | #736E61 |
| `--hint` | `--color-text-hint` | #9A9384 |
| `--forest` | `--color-primary` | #2E5E43 |
| `--forest-dk` | `--color-primary-strong` | #21402F |
| `--sage` | `--color-accent-soft` | #8FA48C |
| `--ochre` | `--color-accent` | #B07D3A |
| `--sleep` | `--color-info` | #5B7C99 |
| `--line` | `--color-border` | rgba(43,42,38,.10) |
| `--line2` | `--color-border-strong` | rgba(43,42,38,.16) |
| `--danger` | `--color-danger` | #B0492F |
| `--green` | `--color-success` | #3C7A4E |
| `--r` | `--radius-md` | 14px |
| `--serif` | `--font-serif` | Fraunces… |
| `--sans` | `--font-sans` | Hanken Grotesk… |

- **Nad rámec explicitního seznamu v plánu** dostaly sémantický název i dva tokeny, které plán bod 1 nejmenoval (musely, protože staré aliasy se mažou): `--sage` → `--color-accent-soft` (tlumená zelená pro sekundární stavové tečky `.newsdot.q` a rámeček `.zitra`), `--green` → `--color-success` (zaplaceno, `.ubadge.ano`).
- **Spacing škála** `--space-xs/sm/md/lg` (4/8/12/16px) přidána do `tokens.css` **zatím bez použití** — jen definice pro budoucí fáze (dle plánu bod 1).

### 2026-07-16 — Fáze 0.5 (Úklid, dokumentace, publikace)

- **Smazány původní monolity** `prototyp_pruvodce.html` a `prototyp_rodic.html` z rootu (git rm). Jejich roli přebírá `src/` (editace) + `dist/` (build k odeslání).
- **`CLAUDE.md` přepsán** na novou strukturu: popis `src/`/`dist/`/`docs/`, build přes `./build.sh`, pravidlo „needituj `dist/`, edituj `src/` a spusť build", pravidlo pořadí `<script>`/`<link>` tagů, odkazy na `docs/plan-faze-0.md` a `docs/decision-log.md`. Zachovány sekce o doménovém modelu (docházkové kódy vč. rodičovského `NE`, hardcoded den, kulturní fond), stylingu (teď sémantické tokeny) a atomických commitech.
- **Rozcestník `index.html` v rootu** — jednoduchý on-brand landing (Fraunces/Hanken, forest paleta) se dvěma kartami: Rodič → `dist/prototyp_rodic.html`, Průvodce → `dist/prototyp_pruvodce.html`. Vstupní bod pro hosting servírující root.
- **`build.sh` navíc generuje `dist/index.html`** — kopie root rozcestníku s přepsanými odkazy na relativní (`dist/prototyp_x.html` → `prototyp_x.html`), aby šla sdílet i samotná složka `dist/` (Netlify Drop). Ověřeno: relativní odkazy se řeší na sousední soubory.
- **Commity rozděleny** dle plánu: úklid + dokumentace (git rm + CLAUDE.md) zvlášť od rozcestníku (index.html + build.sh + tento zápis).

**Publikace odkazem.** Repo **nemá git remote** → GitHub Pages teď nelze nastavit. Až remote přibude: v nastavení repozitáře zapnout **Pages** a servírovat z rootu (`index.html` odkáže na `dist/`). Bez remotu je nejrychlejší cesta **Netlify Drop**:

1. Spusť `./build.sh` (aktualizuje `dist/` vč. `dist/index.html`).
2. Otevři <https://app.netlify.com/drop>.
3. Přetáhni tam **složku `dist/`** (obsahuje `index.html` + oba `prototyp_*.html`). Netlify vrátí veřejnou URL.

Alternativně přetáhnout celý root (pak funguje kořenový `index.html` → `dist/`). Nic nebylo publikováno — čeká na potvrzení uživatelky.

### 2026-07-16 — Fáze 1 (Rodič: omluvenka a náhrady)

Implementovány Flow 2 (omluvenka) a Flow 3 (náhrady) v rodičovské appce dle `docs/plan-faze-1.md`. Zafixovaná rozhodnutí z plánu dodržena; níže jen odchylky, doplňky a nálezy. Objekty **Omluvenka** a **Náhrada** popsány v `docs/objekty-systemu.md`.

**Datový model (`data.js`).** `nahrady: 3` (číslo) nahrazeno polem `nahrady: [...]` a přidáno pole `omluvenky: [...]`. Zůstatek se všude odvozuje přes `dostupne(child)` (počítá jen `stav==='dostupna'`), nikde není natvrdo. Simulovaný čas `NOW={d:3,h:10}`, deadline `beforeDeadline(d)` (do 8:00 dne absence). Náhrady se generují helperem `nahFrom(origin,stav,extra)` (expirace = origin + 60 dní). Seed: Eliška pokrývá všech 5 stavů náhrad (3× dostupná, naplánovaná, využitá, expirovaná, nevznikla) + 2 omluvenky (budoucí `vcas` 11. 6. a minulá `po-deadlinu` 2. 6.); Matěj 1 dostupná. Seed omluvenky jsou provázané s náhradami přes `omId`/`nahradaIds` a se seed docházkou přes `att` (Eliška má 2. 6. a 11. 6. `OM`), aby šlo testovat i zrušení budoucí omluvenky včetně návratu kalendáře a odečtu náhrady.

**Umístění náhrad.** Sekce `dochazka` přejmenována v `SECTIONS` na **„Docházka a náhrady"** (titulek v draweru i topbaru se odvozuje z `SECTIONS`, `TITLES` = `Object.fromEntries`, takže se změnil automaticky). Náhrady + omluvenky jsou bloky nad existujícím kalendářem docházky; nová top-level sekce se nezakládala. Hlavní akce (Omluvit) je první prvek sekce = 1 klik ze vstupu.

**Omluvenka jako overlay.** Přidán nový typ overlaye `omluvenka` do rodičovského `overlay` patternu (`modals.js`), vč. větvení v `core.js` `render()` (titulek + obsah). Stav formuláře drží `let omDraft` v `modals.js`. Jeden formulář (výběr od–do přes dva měsíční gridy, chip důvodu, poznámka, box „Než odešleš" s vysvětlením deadlinu a dopadem na náhradu) → po odeslání `step:'done'` potvrzovací obrazovka (co se stalo, kolik náhrad vzniklo, co dál). Deadline se vysvětluje **před** odesláním i **po** něm.

**Odchylky / dorozhodnutí:**

- **Stav omluvenky u smíšeného rozsahu.** Rozsah může mísit dny po deadlinu a včasné (jediný takový případ při `NOW=3.6` je rozsah začínající dnes). `omluvenka.stav` se určuje podle **prvního dne** (`od`): `beforeDeadline(od) ? 'vcas' : 'po-deadlinu'`. Náhrady se ale počítají **per den** — za včasné dny vznikne `dostupna`, za pozdní `nevznikla`. Potvrzovací obrazovka i box před odesláním případ smíšeného rozsahu explicitně popisují (kolik náhrad vznikne + které dny jsou po deadlinu).
- **`nevznikla` jako záznam náhrady.** Aby byl v seznamu vidět důvod, proč za pozdní omluvu nepřibyla náhrada, zakládá se náhrada se stavem `nevznikla` (`exp:'—'`, do zůstatku se nepočítá). Odpovídá stavu z briefu „Nevznikla kvůli pozdní omluvě".
- **Vybratelnost dní v omluvence.** Vybratelné jsou dnešek a budoucí všední dny v červnu; minulé dny a víkendy nevybratelné (dnešek jde omluvit — jen po deadlinu). Default = zítřek (`NOW.d+1`, přeskočí víkend).
- **Zrušení.** Tlačítko „Zrušit" jen u omluvenek s `od > NOW.d` a stavem ≠ `zrusena`. Zrušení smaže `OM` z `att` daných dní (návrat na `base`) a odebere z `nahrady` položky uvedené v `nahradaIds`.

**Otevřená otázka (mimo rozsah fáze 1):**

- **Potvrzování omluvenky průvodcem/vedením.** Stav „čeká na potvrzení" z briefu se nezavedl — rodičovský prototyp potvrzuje okamžitě. Až bude flow průvodce/vedení, je třeba rozhodnout, zda omluvenka (a tím vznik náhrady) prochází schválením, a doplnit odpovídající stav.
- **Plánování/čerpání náhrady** (výběr náhradního dne) není implementováno — stav `naplanovana` je jen v seed datech (dle plánu, „Co NEdělat").

**Nedotčeno.** Průvodcovská appka a sdílené soubory (`components.css` — využita jen existující třída `.bdg`, žádná změna; `shared.js`) beze změny; nové CSS třídy jen v `screens-rodic.css`. `git diff` na `dist/prototyp_pruvodce.html` je prázdný.

### 2026-07-17 — Fáze 2 (Průvodce: dashboard a doladění Flow 1)

Přidán průvodcovský dashboard (`prehled`) a dotažen Flow 1 dle `docs/plan-faze-2.md`. Zafixovaná rozhodnutí z plánu dodržena; níže odchylky, doplňky a nálezy. Flow 1 zdokumentován v `docs/flows.md`. **Rodičovská appka nedotčena** (`git diff` na `dist/prototyp_rodic.html` prázdný; žádný soubor v `src/scripts/rodic/**` ani `screens-rodic.css` neupraven).

**Nová sekce `prehled` („Přehled“).** První položka v `SECTIONS` (ikona `⌂`), appka v ní startuje (`section='prehled'`), statický titulek v `pruvodce.html` změněn na „Přehled“. Titulek v draweru/topbaru se odvozuje ze `SECTIONS`/`TITLES`. `RENDER.prehled=renderPrehled`; script tag `screens/prehled.js` zařazen jako první mezi obrazovkami (na runtime nezáleží — funkce jsou hoistované a volané až v `render()`).

**Obsah dashboardu dle priorit z výzkumu (`renderPrehled`):** (1) počty dnes jako `.tabs` strip (přítomno/obědy/spí/po obědě/nepřítomní), (2) výrazné tlačítko `.addbig` → dnešní docházka, (3) „kdo dnes nepřijde“ jmenovitě s důvodem, (4) básnička + písnička týdne, (5) zdravotní/provozní poznámky, (6) dnešní akce. Hlavička = dnešní datum + kdo slouží/otevírá (odvozeno z `GUIDESHIFT` jako sekce Průvodci, přes `serving`/`startMin`).

**Počty i propojení bez duplikace stavu.** Počty se berou z `counts()` (sdílené s docházkou), takže změna docházky → návrat na Přehled ukáže aktuální stav (ověřeno: odškrtnutí dítěte změnilo počty i seznam „kdo nepřijde“). Propojení: `go('dochazka')` (tlačítko), nový handler `goDochTab(k)` (proklik počtu nastaví `tab`+den a přejde do docházky), `go('plan')` (básnička/písnička), `openAkceDetail(id)` (akce).

**Seed data.** `TEMA.tydny`: obsah přesunut z 2. do 1. týdne, aby aktuální týden (odvozený `Math.floor((TODAYD-1)/7)` = index 0) nebyl při demu prázdný; prázdný týden → decentní empty state s proklikem do Plánu. Dnes nepřítomné děti: `data[5]`/`data[1]` `status='omluveno'` + `parentExcuse={time,reason}` (simulace propsané rodičovské omluvenky), `data[20]` `neomluveno`. Helper `parentExcuseLine(c)` vrací text „omluveno rodičem dnes HH:MM · důvod“. Zobrazení na dashboardu i v detailu dítěte v rosteru (`editPanel` — nový řádek „Omluvenka od rodiče“). **Jen zobrazení, žádná logika ani sdílení dat mezi appkami** (appky mají oddělený stav).

**Zafixovaně odloženo (zapsáno dle plánu bodů 1–2):**

- **Offline režim a stavy synchronizace se NEDĚLAJÍ.** Žádný přepínač „bez signálu“, žádná fronta změn; potvrzení uložení zůstává toast. Vědomě odložená část Flow 1 — až bude řešena, promítne se do dashboardu i rosteru.
- **Třídnice / zápis dne — budoucí objekt.** Průvodce má v budoucnu na dashboardu číst/doplňovat zápisy z předchozího dne. Zatím se nedělá **ani placeholder**; na dashboard nepřidán.

**CSS.** Nové třídy jen v `screens-pruvodce.css` (`.prehl-abs`/`.pa-nm`/`.pa-r`, `.prehl-tema`/`.pa-arr`/`.pa-cap`) — zbytek poskládán z existujících komponent (`.tile`, `.tabs`/`.tab`, `.addbig`, `.acard`, `.rnote`, `.empty`). Vizuální styl, fonty ani barvy nezměněny.

**Smoke-test (src i dist).** Appka startuje do Přehledu; počty 22/22/13/2/3 odpovídají docházce; datum St 3. června; slouží Táňa (otevírá)/Helča/Honza/Míša. „Kdo nepřijde“ = Tonička (7:15 · rodinné důvody), Róza (6:40 · nemoc), Linda (neomluveno). Básnička i písnička 1. týdne vyplněné, tile → Plán. Tlačítko → dnešní roster; po označení dítěte přítomným počet Nepřítomní 3→2 a jméno zmizelo ze seznamu. Zdravotní poznámky (Eliška po nemoci, Šimon vši) i dnešní akce (Škola v přírodě 1.–5. 6., proklik na detail) zobrazeny. Všech 8 sekcí projde bez chyb v konzoli.

## Nálezy

_(Zjištěné bugy / nekonzistence — v této fázi se NEOPRAVUJÍ, jen zaznamenávají.)_

- **Mrtvý kód v rodičovské appce** (definice bez jediné reference): data `WEATHER`, `WDEF`, `ALERTS`, `ORDER`; handlery `openMenu` (a tím i nedosažitelný overlay „Jídelníček" `renderMenuDetail`), `setCode`, `setNote`, `goEditDay`. Ponecháno; kandidáti na úklid v pozdější fázi.
- **`.odbtn` přebíjí `.ghostred`.** Tlačítko „Vrátit" v historii čerpání fondu má třídu `odbtn ghostred`; `.ghostred` (transparentní pozadí + červený rám) je v CSS definováno dříve než `.odbtn` (plné zelené pozadí), takže při stejné specificitě vyhrává `.odbtn` a tlačítko je zelené, ne červené/ghost. Zachováno beze změny (split kaskádu nemění). Kandidát na opravu mimo fázi 0.
- **Pravděpodobně mrtvý kód** v průvodcovské appce: `weekFor`, `PREDEF`, `dopoMap`/`setDopo`, `renderDenRoster`, `monthDay`/`closeMonthDay`, `.modes`/`.gchips` CSS — bez dohledatelného použití v šablonách. Ponecháno; kandidáti na úklid v pozdější fázi.

### 2026-07-17 — Fáze 3.1 (Admin appka: shell a dashboard vedení)

Založena **třetí appka** pro roli vedení/administrativa (`src/admin.html`) se stejným technologickým vzorem jako mobilní appky (žádný framework, globální scope, `render()` do `#content.innerHTML`, `window.*` handlery). Řízeno `docs/plan-faze-3.md`, provedena **jen fáze 3.1**. **Rodičovská a průvodcovská appka nedotčeny** (`git diff` na `dist/prototyp_rodic.html` a `dist/prototyp_pruvodce.html` prázdný; žádný soubor v `src/scripts/{rodic,pruvodce}/**` ani jejich `screens-*.css` neupraven).

**Desktopový shell místo mobilního draweru.** Nový `src/styles/layout-admin.css` (`.admin`/`.sidebar`/`.sb-item`/`.main`/`.topbar-a`) — stálý levý sidebar s navigací, obsah s max šířkou 980 px, topbar s názvem sekce a badge role „Vedení". `admin.html` **nenačítá `layout.css`** (mobilní `.phone`/`.drawer` shell); pořadí CSS je `tokens → base → layout-admin → components → screens-admin`. Skripty: `shared.js → data.js → screens/prehled.js → core.js` (**bez `modals.js`** — admin nemá v 3.1 žádné overlaye). Mobil je jen „nerozbité" (`@media(max-width:720px)`: sidebar jako vodorovná lišta nahoře), ne optimalizované — dle plánu.

**Zafixovaná rozhodnutí z plánu (potvrzena):**

- **Role hospodářka spadá pod admin appku** (správa fondu a plateb) — nezavádí se čtvrtá role.
- **Fakturační modul se NEDĚLÁ.** Dashboard zobrazuje chybějící platby (kdo, částka, po splatnosti) jen jako přehled; poznámka „Fakturaci školka řeší mimo appku — zde jen přehled." Stavy platby z BRIEF kap. 4 použity jako badge: `po-splatnosti` (`.bdg.al`, existující), + nové varianty `.bdg.ne`/`.part`/`.wait` v `screens-admin.css` (základ `.bdg` z `components.css` beze změny).
- **Data se nesdílejí** — admin má vlastní seed v `src/scripts/admin/data.js` (tři školky s kapacitami a třídami, chybějící platby, souhrn náhrad, systémová upozornění, provozní úkoly, titulky posledních porad). Kde to dává smysl, čísla sedí s mobilními appkami: **Eliška Dvořáková — Školné Březen 2026, 5987 Kč** (= `7983 − 1996` sleva z `rodic/data.js`), Vhaaji obsazeno **25** (= 25 dětí v `pruvodce/data.js`).
- **Simulovaný čas** shodný: `TODAYD=3` (St 3. 6. 2026). Vlastní `TODAYD` v `admin/data.js` (appky nesdílejí stav).
- **Vizuální styl nezměněn** — jen existující tokeny; nové třídy pouze v `layout-admin.css` a `screens-admin.css`.

**Dashboard (`screens/prehled.js`)** dle BRIEF kap. 1, shora: (a) kapacity tří školek s pruhem obsazenosti (plná školka Jaata zvýrazněná akcentem), (b) chybějící platby s badge stavů, (c) systémová upozornění vč. chybějících dat („u 2 dětí chybí kontakt"), (d) souhrn náhrad (dostupné / expiruje do 30 dní / naplánované) s proklikem, (e) provozní úkoly — checklist, **odškrtávání funguje v paměti** (`toggleUkol` → `render()`, mizí po reloadu), (f) poslední porady/evaluace (titulky, proklik do sekce Porady). Počty obsazenosti se **odvozují** z `obsazeno(s)` nad polem tříd, ne hardcoded.

**Navigace:** 5 sekcí (`prehled`, `aktuality`, `porady`, `platby`, `nahrady`). Mimo 3.1 renderují decentní placeholder `renderPlaceholder()` (definován v `core.js`, mapován v `RENDER` pro `aktuality`/`porady`/`platby`/`nahrady`) — v 3.2/3.3 se nahradí `screens/aktuality.js` a `screens/porady.js`.

**Rozcestník.** Do root `index.html` přidána třetí karta „Vedení" → `dist/prototyp_admin.html`; `build.sh` beze změny zpracoval nový `src/admin.html` i regeneroval `dist/index.html` s relativním odkazem.

**Smoke-test 3.1 (dist přes http server, offline-capable single file).** Appka startuje do Přehledu; sidebar přepíná všech 5 sekcí bez chyb v konzoli (ověřeno `read_console_messages` — žádná chyba); kapacity ukazují tři školky (Vhaaji 25/28, Jaata 24/24 · plno, Maata 16/20); odškrtnutí úkolu funguje (1/5 → 2/5, checkbox se zaškrtne); `dist/prototyp_admin.html` je jednosouborový (jediná externí závislost Google Fonts, shodně s ostatními appkami); mobilní appky nezměněny (`git diff`).

**Odloženo do 3.2 / 3.3 (dle plánu):** `screens/aktuality.js` (Flow 4), `screens/porady.js` (Flow 5) + plná seed data zápisů, objekty Aktualita/Porada/Štítek do `objekty-systemu.md`, Flow 4/5 do `flows.md`. Proklik dlaždice „poslední porady" zatím míří na placeholder.

### 2026-07-17 — Fáze 3.2 (Aktuality s povinnými příjemci, Flow 4)

Přidána sekce **Aktuality** do appky vedení (`src/scripts/admin/screens/aktuality.js`) dle `docs/plan-faze-3.md`. **Rodičovská a průvodcovská appka nedotčeny**; v admin appce upraveny jen `data.js` (seed), `core.js` (RENDER + reset `akView` v `go`), `admin.html` (script tag) a `screens-admin.css` (nové třídy).

**Flow 4 — jádro: příjemci jsou povinní.** Formulář nové aktuality: text, volitelně „důležité" (urgentní), **povinný výběr příjemců** — školka → volitelně konkrétní třídy (chipy). `hasRecip(recip)` je podmínka odeslání; bez příjemců je tlačítko Odeslat `disabled` + červené vysvětlení „Bez určených příjemců nelze aktualitu odeslat". „Bez určených příjemců" je tedy **chyba, ne stav** (v datech se neukládá). **Koncept jde uložit i bez příjemců.** Náhled příjemců (`recipText`) sestaví věty „Vhaaji — všichni (25 rodin)" / „Jaata — Sluníčka (12 rodin)"; **počet rodin se odvozuje** z obsazenosti (`obsazeno(s)` / `t.obs`), není natvrdo.

**Model příjemců.** `recip` = mapa `skolkaId → {all:bool, tridy:[názvy]}`. „Celá školka" (`all:true`) a výběr tříd se vzájemně vylučují (zapnutí jednoho vyčistí druhé); prázdný záznam školky se z mapy maže, aby `hasRecip` a náhled zůstaly konzistentní.

**Stavy aktuality:** `koncept`, `odeslana`, `archivovana` (přechody v UI: Odeslat, Archivovat); **`naplanovana` jen v seed datech** — plánované odesílání se nedělá (dle „Co NEdělat"). Badge stavů: `koncept`→`.bdg.wait`, `naplanovana`→`.bdg.part` (z 3.1), nové `.bdg.sent`/`.bdg.arch` v `screens-admin.css`. Odeslat lze i přímo z konceptu v seznamu (`akSendId`), pokud už má příjemce — jinak je i tam tlačítko disabled.

**Zachování rozepsaného textu.** Bez frameworku každý toggle příjemce/urgentní volá `render()`, což zničí `<textarea>`. Před každou takovou akcí `akSyncText()` přečte aktuální hodnotu z `#akText` do `formA.text` a šablona ji zpět dosadí — text se při přepínání příjemců neztrácí (ověřeno ve smoke-testu). Vědomě se nepoužívá `renderKeepFocus` (fokus po kliknutí na chip stejně odchází z textarey).

**Konzistence s rodičovskou appkou.** Seed `AKTUALITY` obsahuje aktuality „roupy" a „dřívější vyzvednutí v pátek", které odpovídají `NEWS` v `rodic/data.js`. Propsání do rodičovské appky je **simulované jen shodou seed dat** — appky spolu nesdílejí data (žádné sdílení stavu).

**Dokumentace.** Objekt **Aktualita** doplněn do `docs/objekty-systemu.md`, **Flow 4** do `docs/flows.md` (mermaid), intro flows.md aktualizováno.

**Smoke-test 3.2 (dist přes http server).** Nová aktualita bez příjemců → Odeslat blokované s vysvětlením ✓; po výběru školky/třídy se ukáže náhled příjemců a Odeslat se aktivuje ✓; odeslání → aktualita v seznamu se stavem „Odeslaná" a výčtem příjemců (`Jaata — Sluníčka (12 rodin)`, datum 3. 6. 2026) ✓; uložení konceptu (i bez příjemců) funguje ✓; archivace odeslané funguje ✓; text přežije přepnutí příjemců ✓; žádné chyby v konzoli; mobilní appky nezměněny (`git diff`).

**Odloženo do 3.3:** `screens/porady.js` (Flow 5), seed zápisů porad/evaluací se štítky, objekty Porada/Evaluace a Štítek, Flow 5, propojení dashboardové dlaždice „poslední porady" na skutečnou sekci.
