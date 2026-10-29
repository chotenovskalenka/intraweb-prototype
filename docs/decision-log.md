# Decision log – Fáze 0

Průběžný zápis rozhodnutí a nálezů během restrukturalizace prototypu (viz [plan-faze-0.md](plan-faze-0.md)).

## Rozhodnutí

### 2026-07-16 – Fáze 0.1 (Průvodcovská appka + build skript)

- Přesunut `BRIEF.md` → `docs/BRIEF.md` (git mv), založen tento decision-log.
- `prototyp_pruvodce.html` rozdělen do `src/` beze změny chování a vzhledu.
- **Pořadí `<script src>`:** shared → data → screens/* → modals → core. `core.js` je poslední, protože obsahuje úvodní `renderModalRoot(); render();`. `let`/`const` v pozdějších souborech (např. stavové proměnné v `core.js`) jsou funkčně dostupné i z dřívějších souborů – všechny klasické skripty sdílejí jeden globální lexikální scope; žádný kód na top-level dřívějšího souboru je nečte, takže nevzniká TDZ chyba.
- **Pořadí CSS (kaskáda):** tokens → base → layout → components → screens-pruvodce. Ověřeno, že přesun tříd mezi soubory nemění vypočtenou kaskádu (viz Nálezy – `.odbtn`/`.ghostred`).
- **Hranice components vs. screens-pruvodce.** Do `screens-pruvodce.css` šly třídy vázané na jednu obrazovku a pojmenované podle ní: `.specbar`/`.spectit`/`.specnums`, `.temanav`, `.works`/`.work`, `.frow`, `.odbtn`, `.rozh`/`.rozhd`, `.gchips`/`.gchip`. Zbytek (vč. sporných jako `.tabs`/`.tab`, `.switch`, `.modes`, `.selin`, `.rnote`, `.clink`, `.ghostred`) šel do `components.css`.
- **Rozdělení JS helperů.** `shared.js` = `avHash`, `avatar`, `esc`, `escTa`, `norm`, `fmt`, `showToast`, `renderKeepFocus`. `data.js` = seed data + čisté datové helpery používané více obrazovkami (`planCode`, `weekFor`, `here`, `staysPM`, `full`, `byAlpha`, `getCode`/`baseCode`/`todayCode`, `presentCount`, `dayLbl`, `serving`, `recordsFor`, `parentsFor`, `rozhovoryFor`, konstanty `DAYS`/`DOW`/`TODAY`/`TODAYD`/`wd`/`isWE`, mutovatelné mapy `worksMap`/`dopoMap`/`rozhovoryMap`, stavové konstanty scén `temaMonth`/`uspavaToday`). Funkce a stav používané jen jednou obrazovkou jsou v jejím `screens/*.js`.
- **`build.sh`** je bash bez závislostí; inlinuje lokální `<link rel=stylesheet>` a `<script src>` do `dist/prototyp_<name>.html`, externí URL (Google Fonts) nechává. Idempotentní, spustitelný z rootu.
- **Původní `prototyp_pruvodce.html` v rootu ponechán** – smaže se až ve fázi 0.5.

### 2026-07-16 – Fáze 0.2 (Rodičovská appka)

- `prototyp_rodic.html` rozdělen do `src/scripts/rodic/` (data.js, core.js, modals.js, screens/{prehled,aktuality,dochazka,profil,platby,kalendar,plan,fotky,kontakty}.js) + `src/styles/screens-rodic.css`, shell `src/rodic.html`. Load order stejný vzor jako průvodce: shared → data → screens/* → modals → core.
- **`avatar`/`avHash` jsou byte-identické s `shared.js`** → z rodiče odstraněny, použit `shared.js`.
- **Rodičovský `showToast` je jiný** než v `shared.js` (vkládá `<div class="toast">` do `#toastbox` a po 1,8 s ho odstraní; sdílená verze používá pevný `#toast` + třídu `.on`). Ponechán v `rodic/core.js` jako `window.showToast` – přebije globální funkci ze `shared.js` (přiřazení běží později). Kandidát na sjednocení ve fázi 0.3.
- **Overlaye rodiče** (průvodce/fond/jídelníček/akce) se nevykreslují přes `#modalRoot`, ale inline do `#content` řízené stavem `overlay` → soubor `rodic/modals.js` (`renderGuide/renderFond/renderMenuDetail/renderAkceDetail` + `openGuide/openAkce/openFond/openMenu/closeOverlay`).
- **Nový sdílený token `--green:#3C7A4E`** přidán do `tokens.css` (používá jen rodič v `.ubadge.ano`; průvodce ho ignoruje).
- **Docházkové kódy:** rodič používá navíc kód `NE` (Neomluveno) oproti `C/D/O/OM` z CLAUDE.md. Zachováno; kandidát na sjednocení stavů ve fázi 1 (viz plán 0.3 bod 4).
- **CSS deduplikace (fáze 0.2 jen zaznamenává, sjednocení je 0.3).** Z rodiče se do `screens-rodic.css` nekopírují třídy byte-shodné s `components/layout` (19 tříd, mj. `.tile`, `.back`, `.contact`, `.av`, `.cal`, `.switch button.on`). Rodičovské **odlišné varianty sdílených tříd** jdou do `screens-rodic.css` (loaduje se poslední, takže vyhrávají): `.scroll` (spodní padding 22 vs 30), `.burger` (20 vs 21 px), `.ttl` (18 vs 19), `.ditem` (14,5 vs 15), `.tlab`, `.tval`, `.np`, `.vhead`, `.switch button`, `.pav`, `.pfull`, `.cbtn`, `.addbtn`, `.hint`, `.note2`, `.note`. Kandidáti na sjednocení v 0.3.
- **`body{…padding:0}`** rodiče je oproti sdílenému `base.css` navíc jen o `padding:0`, což už vynucuje `*{padding:0}` → vizuálně shodné, rodičovské `body` se do `screens-rodic.css` nekopíruje. Ověřeno: všech 258 ostatních rodičovských CSS pravidel je v poskládaném CSS přítomno.
- **`.role`** v rodiči se liší (chybí `white-space:nowrap`), ale v rodičovském markupu žádný `.role` prvek není → rozdíl je bez vizuálního dopadu.

### 2026-07-16 – Fáze 0.3 (Deduplikace sdíleného kódu)

Sjednoceno jen to, co je **vizuálně/funkčně nerozlišitelné** (Neměnné pravidlo č. 1 – vzhled se nesmí změnit). Viditelné rozdíly zůstávají v obou variantách a čekají na rozhodnutí uživatelky (viz „Otevřená rozhodnutí").

**Sjednoceno (bez dopadu na vzhled/chování):**

- **JS `DOW`, `wd`, `isWE`** byly byte-identické v obou `data.js` → přesunuty do `shared.js` (načítá se první, před oběma `data.js`) a z obou `data.js` odstraněny. `TODAY` (rodič 3 / průvodce 2) a `DAYS` (jen průvodce) zůstávají per-app. Ověřeno v prohlížeči: `DOW`/`wd(3)`/`isWE(6)` fungují v obou appkách, žádná chyba „already been declared".
- **CSS `.works` / `.work`** byly byte-identické v `screens-pruvodce.css` i `screens-rodic.css` → přesunuty do `components.css` (dětské „práce" / portfolio, používá je průvodce v Dětech i rodič v Profilu). Z obou screens souborů odstraněny. Ověřeno: `.works` = 3 sloupce, `.work` aspect-ratio 1/1 v obou appkách.
- **Mrtvý CSS `.role` v `screens-rodic.css`** odstraněn – rodičovský markup žádný `.role` prvek nemá (topbar používá `.kidsel`), pravidlo bylo bez efektu. Sdílená verze zůstává v `layout.css`.

**Ponecháno vědomě (různý mechanismus / chování – sjednocení by změnilo chování):**

- **Toast.** Průvodce: pevný `#toast` + třída `.on` s CSS transition (`shared.js` `showToast`). Rodič: `#toastbox`, do kterého se vloží `<div class="toast">` a po 1,8 s odstraní (`rodic/core.js` `window.showToast`, přebíjí sdílenou verzi). CSS `.toast` se proto taky liší (layout.css s `.on`/opacity/transform vs. screens-rodic.css statický). Sjednocení = viditelná změna animace u jedné z appek → neprovedeno.
- **Docházkové kódy.** Obě appky používají shodná písmena `C/D/O/OM`. Rodič má navíc `NE` (Neomluveno; průvodce pro tentýž stav používá prázdný řetězec) a vlastní centrální mapu `CODES`/`ORDER`/`chip`/`mark`; průvodce centrální mapu nemá (popisky inline v obrazovkách). Vytvoření sdílené `CODES` mapy a přepojení průvodcových inline popisků je refaktor s rizikem změny chování → odloženo na fázi 1 (sjednocení stavů), viz plán 0.3 bod 4.

**✅ VYŘEŠENO ve fázi 4.3 (2026-07-18):** všechny níže uvedené třídy sjednoceny na **průvodcovskou (větší/čitelnější) variantu**, rodičovské přepisy smazány ze `screens-rodic.css`. Rodič i průvodce mají teď shodnou typografickou hierarchii. `.tlab` navíc tokenizován (`#605B4F` → `--color-text-muted`). Tabulka níže je historický záznam.

**Otevřená rozhodnutí – viditelně odlišné varianty sdílených tříd (ponechány obě, rozhodne uživatelka):**

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

Navíc **kolize jmen tříd** (stejný název, jiný účel v každé appce, nikdy se nenačítají spolu – ponecháno per-app v příslušném `screens-*.css`): `.frow` (průvodce = řádek historie fondu / rodič = řádek platby), `.gchips`/`.gchip` (průvodce = tag v tématickém plánu / rodič = průvodce-chip na dashboardu). Nejsou to sdílené komponenty, jen shodná jména.

### 2026-07-16 – Fáze 0.4 (Sémantické tokeny)

Design tokeny v `tokens.css` přejmenovány na sémantickou vrstvu. **Vypočtené hodnoty se nezměnily** – jen názvy. Staré aliasy odstraněny (žádná kompatibilní vrstva, jeden zdroj pravdy). Náhrada proběhla přes přesné `var(--old)` → `var(--new)` ve všech `src/styles/*.css` i `src/scripts/**/*.js` (inline styly v template stringách). Ověřeno: `grep` na staré názvy v `src/` i `dist/` vrací 0; všechny tokeny se v prohlížeči rozřešují na původní hex/rgba; obě appky (src i dist) projdou všemi sekcemi bez chyb v konzoli, `.ttl` = rgb(33,64,47) = `--color-primary-strong`, zaplacená badge = rgb(60,122,78) = `--color-success`.

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
- **Spacing škála** `--space-xs/sm/md/lg` (4/8/12/16px) přidána do `tokens.css` **zatím bez použití** – jen definice pro budoucí fáze (dle plánu bod 1).

### 2026-07-16 – Fáze 0.5 (Úklid, dokumentace, publikace)

- **Smazány původní monolity** `prototyp_pruvodce.html` a `prototyp_rodic.html` z rootu (git rm). Jejich roli přebírá `src/` (editace) + `dist/` (build k odeslání).
- **`CLAUDE.md` přepsán** na novou strukturu: popis `src/`/`dist/`/`docs/`, build přes `./build.sh`, pravidlo „needituj `dist/`, edituj `src/` a spusť build", pravidlo pořadí `<script>`/`<link>` tagů, odkazy na `docs/plan-faze-0.md` a `docs/decision-log.md`. Zachovány sekce o doménovém modelu (docházkové kódy vč. rodičovského `NE`, hardcoded den, kulturní fond), stylingu (teď sémantické tokeny) a atomických commitech.
- **Rozcestník `index.html` v rootu** – jednoduchý on-brand landing (Fraunces/Hanken, forest paleta) se dvěma kartami: Rodič → `dist/prototyp_rodic.html`, Průvodce → `dist/prototyp_pruvodce.html`. Vstupní bod pro hosting servírující root.
- **`build.sh` navíc generuje `dist/index.html`** – kopie root rozcestníku s přepsanými odkazy na relativní (`dist/prototyp_x.html` → `prototyp_x.html`), aby šla sdílet i samotná složka `dist/` (Netlify Drop). Ověřeno: relativní odkazy se řeší na sousední soubory.
- **Commity rozděleny** dle plánu: úklid + dokumentace (git rm + CLAUDE.md) zvlášť od rozcestníku (index.html + build.sh + tento zápis).

**Publikace odkazem.** Repo **nemá git remote** → GitHub Pages teď nelze nastavit. Až remote přibude: v nastavení repozitáře zapnout **Pages** a servírovat z rootu (`index.html` odkáže na `dist/`). Bez remotu je nejrychlejší cesta **Netlify Drop**:

1. Spusť `./build.sh` (aktualizuje `dist/` vč. `dist/index.html`).
2. Otevři <https://app.netlify.com/drop>.
3. Přetáhni tam **složku `dist/`** (obsahuje `index.html` + oba `prototyp_*.html`). Netlify vrátí veřejnou URL.

Alternativně přetáhnout celý root (pak funguje kořenový `index.html` → `dist/`). Nic nebylo publikováno – čeká na potvrzení uživatelky.

### 2026-07-16 – Fáze 1 (Rodič: omluvenka a náhrady)

Implementovány Flow 2 (omluvenka) a Flow 3 (náhrady) v rodičovské appce dle `docs/plan-faze-1.md`. Zafixovaná rozhodnutí z plánu dodržena; níže jen odchylky, doplňky a nálezy. Objekty **Omluvenka** a **Náhrada** popsány v `docs/objekty-systemu.md`.

**Datový model (`data.js`).** `nahrady: 3` (číslo) nahrazeno polem `nahrady: [...]` a přidáno pole `omluvenky: [...]`. Zůstatek se všude odvozuje přes `dostupne(child)` (počítá jen `stav==='dostupna'`), nikde není natvrdo. Simulovaný čas `NOW={d:3,h:10}`, deadline `beforeDeadline(d)` (do 8:00 dne absence). Náhrady se generují helperem `nahFrom(origin,stav,extra)` (expirace = origin + 60 dní). Seed: Eliška pokrývá všech 5 stavů náhrad (3× dostupná, naplánovaná, využitá, expirovaná, nevznikla) + 2 omluvenky (budoucí `vcas` 11. 6. a minulá `po-deadlinu` 2. 6.); Matěj 1 dostupná. Seed omluvenky jsou provázané s náhradami přes `omId`/`nahradaIds` a se seed docházkou přes `att` (Eliška má 2. 6. a 11. 6. `OM`), aby šlo testovat i zrušení budoucí omluvenky včetně návratu kalendáře a odečtu náhrady.

**Umístění náhrad.** Sekce `dochazka` přejmenována v `SECTIONS` na **„Docházka a náhrady"** (titulek v draweru i topbaru se odvozuje z `SECTIONS`, `TITLES` = `Object.fromEntries`, takže se změnil automaticky). Náhrady + omluvenky jsou bloky nad existujícím kalendářem docházky; nová top-level sekce se nezakládala. Hlavní akce (Omluvit) je první prvek sekce = 1 klik ze vstupu.

**Omluvenka jako overlay.** Přidán nový typ overlaye `omluvenka` do rodičovského `overlay` patternu (`modals.js`), vč. větvení v `core.js` `render()` (titulek + obsah). Stav formuláře drží `let omDraft` v `modals.js`. Jeden formulář (výběr od–do přes dva měsíční gridy, chip důvodu, poznámka, box „Než odešleš" s vysvětlením deadlinu a dopadem na náhradu) → po odeslání `step:'done'` potvrzovací obrazovka (co se stalo, kolik náhrad vzniklo, co dál). Deadline se vysvětluje **před** odesláním i **po** něm.

**Odchylky / dorozhodnutí:**

- **Stav omluvenky u smíšeného rozsahu.** Rozsah může mísit dny po deadlinu a včasné (jediný takový případ při `NOW=3.6` je rozsah začínající dnes). `omluvenka.stav` se určuje podle **prvního dne** (`od`): `beforeDeadline(od) ? 'vcas' : 'po-deadlinu'`. Náhrady se ale počítají **per den** – za včasné dny vznikne `dostupna`, za pozdní `nevznikla`. Potvrzovací obrazovka i box před odesláním případ smíšeného rozsahu explicitně popisují (kolik náhrad vznikne + které dny jsou po deadlinu).
- **`nevznikla` jako záznam náhrady.** Aby byl v seznamu vidět důvod, proč za pozdní omluvu nepřibyla náhrada, zakládá se náhrada se stavem `nevznikla` (`exp:'–'`, do zůstatku se nepočítá). Odpovídá stavu z briefu „Nevznikla kvůli pozdní omluvě".
- **Vybratelnost dní v omluvence.** Vybratelné jsou dnešek a budoucí všední dny v červnu; minulé dny a víkendy nevybratelné (dnešek jde omluvit – jen po deadlinu). Default = zítřek (`NOW.d+1`, přeskočí víkend).
- **Zrušení.** Tlačítko „Zrušit" jen u omluvenek s `od > NOW.d` a stavem ≠ `zrusena`. Zrušení smaže `OM` z `att` daných dní (návrat na `base`) a odebere z `nahrady` položky uvedené v `nahradaIds`.

**Otevřená otázka (mimo rozsah fáze 1):**

- **Potvrzování omluvenky průvodcem/vedením.** Stav „čeká na potvrzení" z briefu se nezavedl – rodičovský prototyp potvrzuje okamžitě. Až bude flow průvodce/vedení, je třeba rozhodnout, zda omluvenka (a tím vznik náhrady) prochází schválením, a doplnit odpovídající stav.
- **Plánování/čerpání náhrady** (výběr náhradního dne) není implementováno – stav `naplanovana` je jen v seed datech (dle plánu, „Co NEdělat").

**Nedotčeno.** Průvodcovská appka a sdílené soubory (`components.css` – využita jen existující třída `.bdg`, žádná změna; `shared.js`) beze změny; nové CSS třídy jen v `screens-rodic.css`. `git diff` na `dist/prototyp_pruvodce.html` je prázdný.

### 2026-07-17 – Fáze 2 (Průvodce: dashboard a doladění Flow 1)

Přidán průvodcovský dashboard (`prehled`) a dotažen Flow 1 dle `docs/plan-faze-2.md`. Zafixovaná rozhodnutí z plánu dodržena; níže odchylky, doplňky a nálezy. Flow 1 zdokumentován v `docs/flows.md`. **Rodičovská appka nedotčena** (`git diff` na `dist/prototyp_rodic.html` prázdný; žádný soubor v `src/scripts/rodic/**` ani `screens-rodic.css` neupraven).

**Nová sekce `prehled` („Přehled“).** První položka v `SECTIONS` (ikona `⌂`), appka v ní startuje (`section='prehled'`), statický titulek v `pruvodce.html` změněn na „Přehled“. Titulek v draweru/topbaru se odvozuje ze `SECTIONS`/`TITLES`. `RENDER.prehled=renderPrehled`; script tag `screens/prehled.js` zařazen jako první mezi obrazovkami (na runtime nezáleží – funkce jsou hoistované a volané až v `render()`).

**Obsah dashboardu dle priorit z výzkumu (`renderPrehled`):** (1) počty dnes jako `.tabs` strip (přítomno/obědy/spí/po obědě/nepřítomní), (2) výrazné tlačítko `.addbig` → dnešní docházka, (3) „kdo dnes nepřijde“ jmenovitě s důvodem, (4) básnička + písnička týdne, (5) zdravotní/provozní poznámky, (6) dnešní akce. Hlavička = dnešní datum + kdo slouží/otevírá (odvozeno z `GUIDESHIFT` jako sekce Průvodci, přes `serving`/`startMin`).

**Počty i propojení bez duplikace stavu.** Počty se berou z `counts()` (sdílené s docházkou), takže změna docházky → návrat na Přehled ukáže aktuální stav (ověřeno: odškrtnutí dítěte změnilo počty i seznam „kdo nepřijde“). Propojení: `go('dochazka')` (tlačítko), nový handler `goDochTab(k)` (proklik počtu nastaví `tab`+den a přejde do docházky), `go('plan')` (básnička/písnička), `openAkceDetail(id)` (akce).

**Seed data.** `TEMA.tydny`: obsah přesunut z 2. do 1. týdne, aby aktuální týden (odvozený `Math.floor((TODAYD-1)/7)` = index 0) nebyl při demu prázdný; prázdný týden → decentní empty state s proklikem do Plánu. Dnes nepřítomné děti: `data[5]`/`data[1]` `status='omluveno'` + `parentExcuse={time,reason}` (simulace propsané rodičovské omluvenky), `data[20]` `neomluveno`. Helper `parentExcuseLine(c)` vrací text „omluveno rodičem dnes HH:MM · důvod“. Zobrazení na dashboardu i v detailu dítěte v rosteru (`editPanel` – nový řádek „Omluvenka od rodiče“). **Jen zobrazení, žádná logika ani sdílení dat mezi appkami** (appky mají oddělený stav).

**Zafixovaně odloženo (zapsáno dle plánu bodů 1–2):**

- **Offline režim a stavy synchronizace se NEDĚLAJÍ.** Žádný přepínač „bez signálu“, žádná fronta změn; potvrzení uložení zůstává toast. Vědomě odložená část Flow 1 – až bude řešena, promítne se do dashboardu i rosteru.
- **Třídnice / zápis dne – budoucí objekt.** Průvodce má v budoucnu na dashboardu číst/doplňovat zápisy z předchozího dne. Zatím se nedělá **ani placeholder**; na dashboard nepřidán.

**CSS.** Nové třídy jen v `screens-pruvodce.css` (`.prehl-abs`/`.pa-nm`/`.pa-r`, `.prehl-tema`/`.pa-arr`/`.pa-cap`) – zbytek poskládán z existujících komponent (`.tile`, `.tabs`/`.tab`, `.addbig`, `.acard`, `.rnote`, `.empty`). Vizuální styl, fonty ani barvy nezměněny.

**Smoke-test (src i dist).** Appka startuje do Přehledu; počty 22/22/13/2/3 odpovídají docházce; datum St 3. června; slouží Táňa (otevírá)/Helča/Honza/Míša. „Kdo nepřijde“ = Tonička (7:15 · rodinné důvody), Róza (6:40 · nemoc), Linda (neomluveno). Básnička i písnička 1. týdne vyplněné, tile → Plán. Tlačítko → dnešní roster; po označení dítěte přítomným počet Nepřítomní 3→2 a jméno zmizelo ze seznamu. Zdravotní poznámky (Eliška po nemoci, Šimon vši) i dnešní akce (Škola v přírodě 1.–5. 6., proklik na detail) zobrazeny. Všech 8 sekcí projde bez chyb v konzoli.

## Nálezy

_(Zjištěné bugy / nekonzistence – v této fázi se NEOPRAVUJÍ, jen zaznamenávají.)_

- **Mrtvý kód v rodičovské appce** (definice bez jediné reference): data `WEATHER`, `WDEF`, `ALERTS`, `ORDER`; handlery `openMenu` (a tím i nedosažitelný overlay „Jídelníček" `renderMenuDetail`), `setCode`, `setNote`, `goEditDay`. Ponecháno; kandidáti na úklid v pozdější fázi.
- **`.odbtn` přebíjí `.ghostred`.** Tlačítko „Vrátit" v historii čerpání fondu má třídu `odbtn ghostred`; `.ghostred` (transparentní pozadí + červený rám) je v CSS definováno dříve než `.odbtn` (plné zelené pozadí), takže při stejné specificitě vyhrává `.odbtn` a tlačítko je zelené, ne červené/ghost. Zachováno beze změny (split kaskádu nemění). Kandidát na opravu mimo fázi 0.
- **Pravděpodobně mrtvý kód** v průvodcovské appce: `weekFor`, `PREDEF`, `dopoMap`/`setDopo`, `renderDenRoster`, `monthDay`/`closeMonthDay`, `.modes`/`.gchips` CSS – bez dohledatelného použití v šablonách. Ponecháno; kandidáti na úklid v pozdější fázi.

### 2026-07-17 – Fáze 3.1 (Admin appka: shell a dashboard vedení)

Založena **třetí appka** pro roli vedení/administrativa (`src/admin.html`) se stejným technologickým vzorem jako mobilní appky (žádný framework, globální scope, `render()` do `#content.innerHTML`, `window.*` handlery). Řízeno `docs/plan-faze-3.md`, provedena **jen fáze 3.1**. **Rodičovská a průvodcovská appka nedotčeny** (`git diff` na `dist/prototyp_rodic.html` a `dist/prototyp_pruvodce.html` prázdný; žádný soubor v `src/scripts/{rodic,pruvodce}/**` ani jejich `screens-*.css` neupraven).

**Desktopový shell místo mobilního draweru.** Nový `src/styles/layout-admin.css` (`.admin`/`.sidebar`/`.sb-item`/`.main`/`.topbar-a`) – stálý levý sidebar s navigací, obsah s max šířkou 980 px, topbar s názvem sekce a badge role „Vedení". `admin.html` **nenačítá `layout.css`** (mobilní `.phone`/`.drawer` shell); pořadí CSS je `tokens → base → layout-admin → components → screens-admin`. Skripty: `shared.js → data.js → screens/prehled.js → core.js` (**bez `modals.js`** – admin nemá v 3.1 žádné overlaye). Mobil je jen „nerozbité" (`@media(max-width:720px)`: sidebar jako vodorovná lišta nahoře), ne optimalizované – dle plánu.

**Zafixovaná rozhodnutí z plánu (potvrzena):**

- **Role hospodářka spadá pod admin appku** (správa fondu a plateb) – nezavádí se čtvrtá role.
- **Fakturační modul se NEDĚLÁ.** Dashboard zobrazuje chybějící platby (kdo, částka, po splatnosti) jen jako přehled; poznámka „Fakturaci školka řeší mimo appku – zde jen přehled." Stavy platby z BRIEF kap. 4 použity jako badge: `po-splatnosti` (`.bdg.al`, existující), + nové varianty `.bdg.ne`/`.part`/`.wait` v `screens-admin.css` (základ `.bdg` z `components.css` beze změny).
- **Data se nesdílejí** – admin má vlastní seed v `src/scripts/admin/data.js` (tři školky s kapacitami a třídami, chybějící platby, souhrn náhrad, systémová upozornění, provozní úkoly, titulky posledních porad). Kde to dává smysl, čísla sedí s mobilními appkami: **Eliška Dvořáková – Školné Březen 2026, 5987 Kč** (= `7983 − 1996` sleva z `rodic/data.js`), Vhaaji obsazeno **25** (= 25 dětí v `pruvodce/data.js`).
- **Simulovaný čas** shodný: `TODAYD=3` (St 3. 6. 2026). Vlastní `TODAYD` v `admin/data.js` (appky nesdílejí stav).
- **Vizuální styl nezměněn** – jen existující tokeny; nové třídy pouze v `layout-admin.css` a `screens-admin.css`.

**Dashboard (`screens/prehled.js`)** dle BRIEF kap. 1, shora: (a) kapacity tří školek s pruhem obsazenosti (plná školka Jaata zvýrazněná akcentem), (b) chybějící platby s badge stavů, (c) systémová upozornění vč. chybějících dat („u 2 dětí chybí kontakt"), (d) souhrn náhrad (dostupné / expiruje do 30 dní / naplánované) s proklikem, (e) provozní úkoly – checklist, **odškrtávání funguje v paměti** (`toggleUkol` → `render()`, mizí po reloadu), (f) poslední porady/evaluace (titulky, proklik do sekce Porady). Počty obsazenosti se **odvozují** z `obsazeno(s)` nad polem tříd, ne hardcoded.

**Navigace:** 5 sekcí (`prehled`, `aktuality`, `porady`, `platby`, `nahrady`). Mimo 3.1 renderují decentní placeholder `renderPlaceholder()` (definován v `core.js`, mapován v `RENDER` pro `aktuality`/`porady`/`platby`/`nahrady`) – v 3.2/3.3 se nahradí `screens/aktuality.js` a `screens/porady.js`.

**Rozcestník.** Do root `index.html` přidána třetí karta „Vedení" → `dist/prototyp_admin.html`; `build.sh` beze změny zpracoval nový `src/admin.html` i regeneroval `dist/index.html` s relativním odkazem.

**Smoke-test 3.1 (dist přes http server, offline-capable single file).** Appka startuje do Přehledu; sidebar přepíná všech 5 sekcí bez chyb v konzoli (ověřeno `read_console_messages` – žádná chyba); kapacity ukazují tři školky (Vhaaji 25/28, Jaata 24/24 · plno, Maata 16/20); odškrtnutí úkolu funguje (1/5 → 2/5, checkbox se zaškrtne); `dist/prototyp_admin.html` je jednosouborový (jediná externí závislost Google Fonts, shodně s ostatními appkami); mobilní appky nezměněny (`git diff`).

**Odloženo do 3.2 / 3.3 (dle plánu):** `screens/aktuality.js` (Flow 4), `screens/porady.js` (Flow 5) + plná seed data zápisů, objekty Aktualita/Porada/Štítek do `objekty-systemu.md`, Flow 4/5 do `flows.md`. Proklik dlaždice „poslední porady" zatím míří na placeholder.

### 2026-07-17 – Fáze 3.2 (Aktuality s povinnými příjemci, Flow 4)

Přidána sekce **Aktuality** do appky vedení (`src/scripts/admin/screens/aktuality.js`) dle `docs/plan-faze-3.md`. **Rodičovská a průvodcovská appka nedotčeny**; v admin appce upraveny jen `data.js` (seed), `core.js` (RENDER + reset `akView` v `go`), `admin.html` (script tag) a `screens-admin.css` (nové třídy).

**Flow 4 – jádro: příjemci jsou povinní.** Formulář nové aktuality: text, volitelně „důležité" (urgentní), **povinný výběr příjemců** – školka → volitelně konkrétní třídy (chipy). `hasRecip(recip)` je podmínka odeslání; bez příjemců je tlačítko Odeslat `disabled` + červené vysvětlení „Bez určených příjemců nelze aktualitu odeslat". „Bez určených příjemců" je tedy **chyba, ne stav** (v datech se neukládá). **Koncept jde uložit i bez příjemců.** Náhled příjemců (`recipText`) sestaví věty „Vhaaji – všichni (25 rodin)" / „Jaata – Sluníčka (12 rodin)"; **počet rodin se odvozuje** z obsazenosti (`obsazeno(s)` / `t.obs`), není natvrdo.

**Model příjemců.** `recip` = mapa `skolkaId → {all:bool, tridy:[názvy]}`. „Celá školka" (`all:true`) a výběr tříd se vzájemně vylučují (zapnutí jednoho vyčistí druhé); prázdný záznam školky se z mapy maže, aby `hasRecip` a náhled zůstaly konzistentní.

**Stavy aktuality:** `koncept`, `odeslana`, `archivovana` (přechody v UI: Odeslat, Archivovat); **`naplanovana` jen v seed datech** – plánované odesílání se nedělá (dle „Co NEdělat"). Badge stavů: `koncept`→`.bdg.wait`, `naplanovana`→`.bdg.part` (z 3.1), nové `.bdg.sent`/`.bdg.arch` v `screens-admin.css`. Odeslat lze i přímo z konceptu v seznamu (`akSendId`), pokud už má příjemce – jinak je i tam tlačítko disabled.

**Zachování rozepsaného textu.** Bez frameworku každý toggle příjemce/urgentní volá `render()`, což zničí `<textarea>`. Před každou takovou akcí `akSyncText()` přečte aktuální hodnotu z `#akText` do `formA.text` a šablona ji zpět dosadí – text se při přepínání příjemců neztrácí (ověřeno ve smoke-testu). Vědomě se nepoužívá `renderKeepFocus` (fokus po kliknutí na chip stejně odchází z textarey).

**Konzistence s rodičovskou appkou.** Seed `AKTUALITY` obsahuje aktuality „roupy" a „dřívější vyzvednutí v pátek", které odpovídají `NEWS` v `rodic/data.js`. Propsání do rodičovské appky je **simulované jen shodou seed dat** – appky spolu nesdílejí data (žádné sdílení stavu).

**Dokumentace.** Objekt **Aktualita** doplněn do `docs/objekty-systemu.md`, **Flow 4** do `docs/flows.md` (mermaid), intro flows.md aktualizováno.

**Smoke-test 3.2 (dist přes http server).** Nová aktualita bez příjemců → Odeslat blokované s vysvětlením ✓; po výběru školky/třídy se ukáže náhled příjemců a Odeslat se aktivuje ✓; odeslání → aktualita v seznamu se stavem „Odeslaná" a výčtem příjemců (`Jaata – Sluníčka (12 rodin)`, datum 3. 6. 2026) ✓; uložení konceptu (i bez příjemců) funguje ✓; archivace odeslané funguje ✓; text přežije přepnutí příjemců ✓; žádné chyby v konzoli; mobilní appky nezměněny (`git diff`).

**Odloženo do 3.3:** `screens/porady.js` (Flow 5), seed zápisů porad/evaluací se štítky, objekty Porada/Evaluace a Štítek, Flow 5, propojení dashboardové dlaždice „poslední porady" na skutečnou sekci.

### 2026-07-17 – Fáze 3.3 (Porady a evaluace se štítky, Flow 5)

Přidána sekce **Porady a evaluace** do appky vedení (`src/scripts/admin/screens/porady.js`) dle `docs/plan-faze-3.md` – poslední dílčí fáze fáze 3. **Rodičovská a průvodcovská appka nedotčeny**; v admin appce upraveny `data.js` (seed), `core.js` (RENDER + reset stavu v `go`), `admin.html` (script tag), `screens/prehled.js` (dashboard čerpá ze `ZAPISY`) a `screens-admin.css`.

**Datový model.** `ZAPISY` (9 zápisů, 9/2025–6/2026): každý má `dt` (číselné `RRRRMMDD` pro řazení a filtr období), `datum` (text), `typ` (`porada`/`evaluace`), `skolka`, `nazev`, `ucastnici`, a `odstavce: [{text, stitky:[]}]`. Štítek je **prostý řetězec** (bez id), odstavec jich může mít víc. `STITKY` = `hygiena`, `bezpečnost`, `personál`, `provoz`, `pedagogika`, `inspekce`. Období pro filtr jsou předdefinovaná (`OBDOBI`: celé / podzim 2025 / zima 2026 / jaro 2026) s `from`/`to` mezemi nad `dt`.

**Jádro Flow 5 – filtrovaný výpis.** Záložka „Výpis podle štítku": výběr štítku + období posbírá **jen odstavce** s daným štítkem napříč všemi zápisy (řazeno od nejnovějšího), každý s datem, školkou, názvem zápisu a prolinkem „→ celý zápis". Ve výsledku je shodný štítek zvýrazněný (`.stitek.hi`). Výpis se **odvozuje** při renderu, nikde není uložený. Ověřeno: „hygiena" / celé období → 4 odstavce ze 4 různých zápisů; zúžení na „jaro 2026" → 1.

**Detail a přidávání štítků.** Detail zápisu ukazuje odstavce; pod každým jsou všechny štítky jako `pchips` toggle – klepnutím se štítek přidá/odebere (`poToggleStitek`), čímž se odstavec ihned zpřístupní/odebere z výpisu. Vytváření nového zápisu je minimální (název + typ + školka + text + štítky = jeden odstavec), datováno na `TODAYD` (3. 6. 2026).

**Export (`window.print()`).** Tlačítko „Exportovat výpis" volá `window.print()`; `@media print` v `screens-admin.css` skryje sidebar, topbar, switch a všechny ovládací prvky (třída `.no-print`), zúží obsah na plnou šířku a přepne štítky na tištěnou variantu (`.print-only`). Hlavička výpisu („Výpis zápisů – štítek …, období …, N odstavců") je záměrně součástí obsahu, aby dávala smysl i na papíře/v PDF.

**Jeden zdroj pravdy pro dashboard.** Dashboardová dlaždice „poslední porady" (`prehled.js`) nově **odvozuje** poslední tři zápisy ze `ZAPISY` (řazeno dle `dt`) místo dřívějšího samostatného seed pole `PORADY` (odstraněno) – dlaždice tak vede do skutečné sekce a zůstává konzistentní i po vytvoření nového zápisu.

**Smoke-test 3.3 (dist přes http server).** Filtr štítek „hygiena" + období → výpis ukazuje jen odstavce s tím štítkem, s daty a odkazy (4, resp. 1 po zúžení na jaro) ✓; export volá tiskové zobrazení (`.no-print` skryje shell) ✓; detail zobrazuje odstavce se štítky a štítek jde přidat (`z9` odstavec 0: `provoz` → `provoz, inspekce`) ✓; nový zápis jde vytvořit a objeví se v seznamu, výpisu i na dashboardu (`z20` „Testovací zápis inspekce", evaluace, 3. 6. 2026) ✓; všech 5 sekcí projde bez chyb v konzoli; mobilní appky nezměněny (`git diff`).

**Fáze 3 hotová.** `dist/prototyp_admin.html` funguje offline, rozcestník má tři odkazy. Flow 4 i Flow 5 jsou průchozí dle ověřovacích otázek briefu (nelze odeslat bez příjemců; admin ví, komu odešlo; štítky najdou konkrétní podklad; export dává použitelný výstup). `objekty-systemu.md` obsahuje Aktualitu, Poradu/Evaluaci i Štítek; `flows.md` má Flow 4 a 5. Sekce **Platby** a **Náhrady** zůstávají jako přehledové placeholdery – plný rozsah nebyl v zadání fáze 3 (fakturační modul se vědomě nedělá).

### 2026-07-17 – Revize dle reality (benchmark proti produkčnímu intrawebu)

Porovnání prototypu s 27 screenshoty produkčního systému „Dětský klub Maata" (intraweb.maata.cz, dodavatel Matosoft). Reálný systém má dvě rozhraní: přední appku (Nástěnka · Docházka · Kroužky · Kalendář · Vyúčtování · Nastavení) a technický backend „Administrace" (konfigurace, oprávnění). Rozhodnutí níže učinila designérka; provedeno v této revizi.

**Screenshoty obsahují osobní údaje** (jména dětí, e-maily rodičů, částky) – složka `screenshots/` se **necommituje** (viz `.gitignore`).

**Provedené změny (sjednocení s realitou):**

- **Deadline omluvy → 20:00 předchozího dne** (dřív prototyp: 8:00 dne absence; realita: limit 20:00 v konfiguraci docházky). `beforeDeadline(d)` v `rodic/data.js` přepsán na `d>NOW.d+1||(d===NOW.d+1&&NOW.h<20)`; texty v omluvence a docs aktualizovány. Chování seed scénářů se nemění (dnešek = po deadlinu, zítřek = včas) – mění se pravidlo a jeho vysvětlení.
- **Expirace náhrad → koncem školního roku (30. 6.), nepřenáší se.** Dřív prototyp +60 dní; realita má v konfiguraci 300 dní, ale skutečné provozní pravidlo (dle designérky) je propadnutí s koncem školního roku. `nahFrom` počítá `exp` jako 30. 6. daného školního roku; seed `expirovana` náhrada přesunuta do minulého šk. roku (propadla 30. 6. 2025); `naplanovana` změněna z „Příměstský tábor · 21. 7." na „Náhradní den · 18. 6." (plán po expiraci by byl matoucí). Admin dlaždice náhrad: „expiruje do 30 dní" → „propadne 30. 6. (konec šk. roku)" – v červnu propadají všechny dostupné, což je pro vedení silný signál.
- **Třídy převzaty z reality.** Admin `SKOLKY`: Vhaaji = **Vhaaji + Vhaaji žlutá**, Jaata = **Jaata + Kouzlo lesa**, Maata = **Modrá třída + Zelená třída** (dřív smyšlené Lišky/Veverky, Sluníčka/Kapky, Sovy/Ježci). Obsazenosti zachovány (25/24/16). Seed aktuality ak3: příjemce „Lišky" → „Vhaaji žlutá".

**Vědomě ponecháno jinak než realita:**

- **Kódy docházky C/D/O zůstávají** (realita: 13/15/17 + lesní 13L/15L/17L podle hodin). Písmenné kódy jsou pro respondenty čitelnější; dimenze „lesní docházka" v prototypu zatím není.
- **Struktura 3 sesterských školek zůstává** (realita: jeden klub Maata s třídami pojmenovanými po značkách + dva právní subjekty pro MŠMT export). Záměrné zjednodušení pro testování multi-school pohledu vedení; třídy uvnitř školek nyní nesou reálné názvy.
- **Příjemci aktualit jen školky/třídy** (realita nabízí i „Lektorům" a „Vybraným dětem"). Nepřidáno – viz výzkumná otázka níže.

**Výzkumná otázka – aktuality vs. WhatsApp.** Funkce „událost s odesláním e-mailem" v reálném intrawebu se nepoužívá; komunikace běží ve WhatsApp skupinách (jednoduché, ale notifikačně zatěžující). Hypotéza pro testování: aktualita s povinnými příjemci + push notifikace v appce může WhatsApp nahradit (struktura + dohledatelnost + „vím, komu odešlo"). Ověřit s respondenty, zda by jim to stačilo; podle výsledku případně doplnit příjemce „Lektorům/průvodcům" a „Vybraným dětem".

**Směr pro další fázi (nerealizováno):** rozsah admin appky „nakombinovat" – management nadstavba (Přehled/Aktuality/Porady) + postupné přebírání agend z reálného intrawebu (docházka pro vedení, kalendář, vyúčtování). Rozhodne se po testování.

**Dodatek – Kouzlo lesa je samostatná školka.** Na upřesnění designérky povýšeno z třídy Jaaty na čtvrtou sesterskou školku (`SKOLKY`: Vhaaji 25/28, Jaata 12/12 · plno, Kouzlo lesa 12/14, Maata 16/20). Školka s jedinou skupinou má jednu třídu pojmenovanou po sobě (obsazenost se odvozuje z pole tříd); UI ji neduplikuje – dashboard u ní nevypisuje rozpis tříd a formulář aktuality nabízí jen „Celá školka" bez chipu třídy. Mřížka kapacit přepnuta na `auto-fit`, aby unesla čtyři školky. Seed aktuality „letní provoz" nově míří i na Kouzlo lesa.

### 2026-07-17 – Revize dle podkladů (příručky PDF + tabulka Pro rodiče 25/26)

Podklady: `podklady/Vhaaji pro rodiče DIGI.pdf`, `podklady/Vhaaji průvodce rituály.pdf`, `podklady/Příručka M 2024_2025.pdf` (Maata), `podklady/Pro rodiče 25_26 vhaaji.xlsx`.

**Provedené změny:**

- **Školné dle příručky Vhaaji 2024/25.** Odpolední docházka 10 584 Kč – Eliščiny faktury v `rodic/data.js` (10 584, bez slevy) i admin `PLATBY` (Eliška, Kuba). Matěj (celodenní) má tutéž sazbu – samostatná cena celodenní docházky v podkladech není. Ela Marešová (Maata) → 11 813 Kč (3× týdně do 15:00 dle příručky Maata).
- **Stravné dle příručky:** dopolední svačina 20 Kč, oběd 80 Kč, odpolední svačina 15 Kč – nová dlaždice v overlay Jídelníček (`rodic/modals.js`) + věta o nepočítání stravného při omluvě do 20:00.
- **Jídelníček dle skutečnosti** – `MENUS` přepsán reálným týdnem z tabulky (8.–12. 6.): obědy veganské z Mamafood, živočišná složka jen ve svačinkách (dřív seed obsahoval rybí filé jako oběd).
- **Zaměření dnů zvalidováno s tabulkou (list ROZVRH):** Po rytmika, Út putování, St pohyb, Čt tvorba, Pá hrátky s pohádkou – **prototyp seděl**, beze změny. (Rituály PDF má St/Čt prohozeně – tabulka je novější, platí tabulka.) Doplněn pondělní kroužek „Tanečky s Niki" (`RYTMUS`), kroužky v rodičovském kalendáři přepsány na reálné (Tanečky s Niki po · Živly se Shaunem čt; smyšlená keramika odstraněna).
- **Konzultace s rodiči 2× ročně – listopad a duben:** seed rozhovorů v `pruvodce/data.js` přesunut na 13. 11. 2025 a 16. 4. 2026.
- **Výlet předškoláků = 1. čtvrtek v měsíci:** sloučen se seed akcí Horolezení na čt 4. 6. („Výlet předškoláků – horolezení", reálné místo Jungle Sport park Letňany dle tabulky); samostatný smyšlený výlet 8. 6. odstraněn. Pozn.: tabulka uvádí „každá první středa" – dle designérky čtvrtek; případně ověřit.
- **Celodenní docházka je jen v úterý** (Vhaaji: do 13 / do 15 / úterý do 17): `baseCode`/`getCode` (průvodce) a `code()` (rodič) vrací pro celodenní plán `C` jen v úterý, jinak `O`. Štítek plánu dítěte zůstává „celodenní".

**Odloženo – náhrady.** Příručky popisují jiná pravidla než prototyp (Vhaaji: 20 % omluvených hodin; Maata: fixní roční kvóta hodin dle rozsahu docházky, čerpání rovnoměrně, 50 % v 1. pololetí) – a každá školka jiná. Prototypové „1 včas omluvený den = 1 náhrada" zatím zůstává; designérka ověří s vedením, co reálně platí. Pro admin z toho plyne otázka per-školkové konfigurace pravidel.

### 2026-07-17 – Desktopová prezentace mobilních appek – ⚠️ NAHRAZENO (viz „Responzivní re-layout" 2026-07-18)

Mobilní appky (rodič, průvodce) se na desktopu roztahovaly přes celou šířku okna. Řešení bez zásahu do JS, jen v `layout.css` + `components.css` (media queries; na mobilu beze změny):

- **≥ 700 px:** appka se prezentuje jako vycentrovaný „telefonní rám" (max 414 px, zaoblení, stín, tmavší pozadí za rámem). Drawer se váže na hranu rámu a zavřený je skutečně skrytý (opacity/visibility – samotné `translateX(-101%)` ho při posunutém `left` nechávalo viditelné vedle rámu). Modaly (průvodce) se místo bottom-sheetu zobrazují vycentrované v šířce rámu.
- **≥ 1100 px:** navigace jako **trvalý panel vlevo vedle rámu** (vzor admin sidebaru) – burger i scrim se skryjí, drawer je vždy viditelný. Vzniklo původně jako vedlejší efekt posunutého draweru, ponecháno záměrně: desktopový uživatel má stálou navigaci a vidí ji vedle mobilního obsahu.
- Obsah zůstává mobile-first (rodič i průvodce jsou dle briefu mobilní role); skutečný responzivní re-layout obrazovek se nedělá. Admin appka nedotčena (má vlastní `layout-admin.css`).

Ověřeno v prohlížeči: rodič i průvodce na 1440/900/375 px – trvalý sidebar + navigace, overlay drawer na střední šířce, mobil beze změny, modal vycentrovaný, admin beze změny.

### 2026-07-17 – Fáze 4.1: extrakce identity z webu, návrh palety a typografie

Zdroj (vstup V1): **[vhaaji.cz](https://vhaaji.cz/)**. Analyticko-návrhová fáze – do `tokens.css` se zatím **nezasahuje**, čeká se na schválení designérkou (V2). Pracovní extrakt v `podklady/web-extract/` (logo, hero, vzorky; gitignore), shrnutí v [docs/design-system.md](design-system.md), náhled ke schválení [docs/paleta-nahled.html](paleta-nahled.html) (mimo build).

**Co web reálně používá (ne invence modelu):**
- **Logo:** ruční inkoustový linoryt (strom-kruh, dítě ve větvích, dospělý, psané „vhaaji"), černá na průhledné – `logo-vhaaji.png` 500×480.
- **Barvy:** krémový podklad `#EFEEE9`, akvarelové skvrny ve třech hue – zelená `#309078`–`#489078`, okrová `#C8BC85`, tlumená růžová/mauve `#D8A890`; inkoustová tmavá `#1F2A2E` (text/patička). Vzorkováno z hero akvarelu (canvas) + CSS.
- **Typografie (vše Google Fonts):** Shadows Into Light Two (display/nadpisy), IBM Plex Serif (odkazy/serif), Itim (běžný text) – všechny rukodělné/serifové, sedí k neformálnímu tónu.

**Návrh mapování na tokeny** (plná tabulka v design-system.md), doladěno na WCAG AA:
- Barvy: `bg #EFEEE9`, `surface #F9F7F1`, `surface-2 #E7E4DA`, `text #1F2A2E`, `muted #5C6560`, `hint #767B74`, `primary #2B7059`, `primary-strong #1F5344`, `accent #C8BC85` (výplň) + `accent-ink #6F5F1C` (text), `accent-soft #C99C93` (jen dekor), `info #4E7488`; `danger`/`success` ponechány.
- **Odchylky od webu kvůli AA** (web původní odstín neplnil): text-muted web `#888` → `#5C6560`; zelená ztmavena na `#2B7059`; okrová jako text → `#6F5F1C`. Růžová a okrová v původním jasu zůstávají jen jako výplň/dekor, ne text. Kontrasty spočteny skriptem (text ≥4.5:1, velký/UI ≥3:1) – všechny navržené kombinace prošly.
- Typografie: `--font-display` Shadows Into Light Two, `--font-serif` IBM Plex Serif, `--font-sans` Itim; jednotná pro všechny 4 školky.

**Otevřená otázka pro designérku (V2):** tělový/UI font. Itim je rukodělné písmo – půvabné, ale v hustém UI (admin tabulky, malé labely, dlouhé seznamy) hůř čitelné. Náhled ukazuje dvě cesty vedle sebe: **A** Itim všude (max věrnost webu) vs. **B** hybrid (Itim/Shadows na nadpisy a akcenty, čitelnější companion na hustý text). Rozhodne designérka.

**Stav:** čeká na V2 (schválení palety + volba tělového fontu). Poté fáze 4.2 přenese hodnoty do `tokens.css`.

#### Revize typografie po porovnání se sesterskými weby (2026-07-17)

Designérka **schválila barvy**. K typografii: Shadows Into Light Two se nehodí a font musí být **univerzální napříč všemi čtyřmi školkami**. Porovnal jsem weby: Vhaaji (Shadows + Itim), **Jaata** (Poppins + Source Sans Pro), **Maata** (Sacramento + Open Sans), **Kouzlo lesa** (Playfair Display + Metropolis).

Zjištění: **žádný font není napříč školkami společný** – každá má vlastní. Společný je jen **vzorec**: charakterní nadpisy + neutrální čitelný sans na text (3 ze 4 školek). Vhaaji s rukodělným Itim je výjimka (špatná čitelnost v UI). Proto se Shadows ani Itim **nepřebírají** jako systémové fonty.

**Přepracovaný univerzální návrh** (nahrazuje předchozí typografické tokeny):
- **Tělo/UI: Nunito Sans** – zaoblený humanistický sans, vřelý ale čitelný i v hustém UI.
- **Nadpisy: 3 kandidáti k výběru** (žádný nepatří jedné školce) – **A Fraunces** (měkký serif, výchozí), **B Nunito Sans** tučně (jedna rodina), **C Baloo 2** (zaoblený display). Náhled je ukazuje vedle sebe nad schválenou paletou.

Náhled i `design-system.md` aktualizovány; ověřeno v prohlížeči (všechny fonty načtené, kandidáti se správnými řezy). **Otevřená otázka pro V2:** výběr nadpisového kandidáta A/B/C.

#### Druhá trojice nadpisů (2026-07-17)

Designérka zamítla všechny tři z první trojice: **Fraunces** moc generický, **Nunito Sans bold** i **Baloo 2** moc dětské, nevhodné pro informační systém. Nová trojice cílí na dospělý, profesionální výraz do IS (charakter bez dětskosti, bez trendového soft-serifu):

- **D · Spectral** – editoriální knižní serif pro obrazovky, klidný a sofistikovaný (výchozí v náhledu).
- **E · Zilla Slab** – slab serif, pevný a strukturovaný, „dokumentární" tón do dat/tabulek/plateb.
- **F · Bricolage Grotesque** – současný grotesk s jemnou nepravidelností = identita bez genericnosti; bezpatkový.

Tělo zůstává **Nunito Sans** (designérce nevadilo). Náhled aktualizován, ověřeno v prohlížeči (D/E/F načtené a aplikované). Čeká na výběr D/E/F pro V2.

#### Vybraná typografie (2026-07-17)

Designérka vybrala z druhé trojice **F · Bricolage Grotesque** pro nadpisy a požádala zkusit **Inter** místo Nunito Sans na tělo/UI. Vybraná univerzální typografie (společná pro všechny 4 školky):

- **Nadpisy: Bricolage Grotesque** – grotesk s jemnou nepravidelností, identita bez genericnosti, profesionální do IS.
- **Tělo/UI: Inter** – neutrální UI sans, čitelný v malých velikostech i tabulkách; věcnější než zaoblený Nunito Sans, ladí s Bricolage.

Náhled přepnut na vybranou kombinaci + doplněno srovnání **Inter vs Nunito Sans** na tělo (ať je volba na konkrétních textech IS). Ověřeno v prohlížeči: tělo Inter, nadpisy Bricolage aplikované i v komponentách; oba srovnávané fonty reálně renderují. Tokeny (návrh 4.2): `--font-sans: "Inter"`, `--font-serif: "Bricolage Grotesque"` (název tokenu je historický, hodnota bezpatková – ve 4.2 zvážit přejmenování na `--font-head`).

**Zbývá pro V2:** finální potvrzení těla (Inter vs Nunito Sans). Pak fáze 4.2.

#### Směr UI komponent – reference (2026-07-17)

Designérka označila dosavadní UI náhledu za „hodně generické" a dodala **6 referenčních
dashboardů** (Donezo, Codename.com, kwikword, parenting app, KIDS.toon, EduFinance). Na dotaz
zvolila směr **„Donezo + víc barvy a hravosti"** – bohatý dashboard jazyk + barevné dlaždice,
ale **bez dětských ilustrací** (drží dřívější „ne dětské, do IS").

Rozhodnutí: UI vychází z referencí, ale **barevnost výhradně ze schválené palety** (rule 1) –
barevné kategorie jsou měkké tinty primary/accent/accent-soft/info, ne nové barvy. Do náhledu
přidána **sekce 4 „Směr UI"** na obsahu Vhaaji: gradientní hero se soft bloby, stat dlaždice
(velké číslo Bricolage + trend), barevné kategorie, šrafovaný sloupcový graf, progress prstenec,
seznam s icon-chipy a jednotné stavové pilulky. Vzory zapsány do `design-system.md`.

Ověřeno v prohlížeči (1280px): gradient/prstenec/šraf/tinty renderují, žádný horizontální přetok,
sloupce grafu mají správné výšky. Detailní tokenizace (radiusy, stíny, tint tokeny, ikonografie)
je na 4.2/4.3/4.6 – tady jde o schválený **směr**, ne finální komponentní CSS.

**Zbývá pro V2:** potvrdit směr UI + tělo (Inter vs Nunito). Pak 4.2.

#### Směr UI – varianta B: velké barevné bloky (2026-07-17)

Designérka požádala porovnat s odvážnějšími referencemi (kwikword, parenting app). Do náhledu
přidána **sekce 5 „Směr B"** na stejném obsahu Vhaaji: plné barevné bloky místo jemných tintů,
dvoubarevný velký nadpis, barevný rozvrh, velký radius (26px). Barvy zůstávají **plné odstíny
palety** – mapování kwikword→Vhaaji: růžová→rose, navy→primary-strong, žlutá→accent, mint→primary
(žádná nová barva). Kontrasty ověřeny (bloky ≥4.4:1).

**Poctivý poznatek k rozhodnutí:** Vhaaji paleta je **zemitá/tlumená**, takže i jako plné bloky
je výraz měkčí než „cukrové" barvy kwikwordu/parenting appky. Formy (velké bloky, dvoubarevný
nadpis, barevný rozvrh) jdou přenést 1:1; **jasnost/sytost barev ne** – na to by byla potřeba
palety rozšířit o jasnější akcenty (změna palety = rozhodnutí designérky, dnes mimo schválené V2).

**Volba pro designérku:** sekce 4 (jemné tinty, decentnější) × sekce 5 (plné bloky, odvážnější) –
a zda zemitá paleta dává dost „šťávy", nebo chce zvážit jasnější akcenty.

#### Směr UI – varianta C: whitespace / klid (2026-07-17)

Designérka směřuje k aktuálnímu trendu – „hodně o whitespace". Přidána **sekce 6 „Směr C"**:
míň prvků, velký prostor, minimum rámečků/stínů; barva jen jako **akcent** (zelené fokální číslo,
tenká lišta), skupiny odděluje prostor a vlasové linky, ne boxy. Velký radius, hodně paddingu.

Poznatek: whitespace **nejlíp sedí tlumené zemité paletě** – barvy nemusí bojovat o pozornost,
působí klidně/prémiově; zároveň řeší spor „moc barevné × moc dětské". Zatím **doporučená báze**
(potvrdí designérka). Tři varianty v náhledu k volbě: **4** tinty · **5** plné bloky · **6** whitespace.
Lze i kombinovat (whitespace layout + akcentní tinty z 4).

#### VYBRÁNO: sweet spot – whitespace + barva (2026-07-17)

Designérka: „3 (whitespace) je super, akorát bych použila víc barvy (sweet spot)." → finální
**sekce 7** v náhledu: vzdušná kostra ze sekce 6 + barva jako akcent – barevná fokální čísla
(nesou význam; AA ≥4.5 ověřeno), kategorie-chipy v tintech, barevné tečky/tagy u programu, jeden
tónovaný highlight, tenká progress lišta. **Toto je schválený směr UI pro V2.** Principy zapsány
do `design-system.md` („Směr UI komponent – vybráno"). Sekce 4–6 ponechány jako doklad cesty.

#### V2 kompletní – fáze 4.1 uzavřena (2026-07-17)

Designérka potvrdila **tělo/UI = Inter**. Tím je vstup **V2 schválen v plném rozsahu**:

- **Barvy** – paleta odvozená z vhaaji.cz (viz mapování tokenů výše).
- **Typografie** – nadpisy **Bricolage Grotesque**, tělo/UI **Inter** (univerzální pro všechny 4 školky).
- **Směr UI** – whitespace + barva jako akcent (sweet spot, náhled sekce 7).

Náhled i `design-system.md` označeny jako V2-schváleno. **Fáze 4.1 (analyticko-návrhová) je hotová**;
tokeny se zatím do prototypu nepřepínaly (dle zadání). Následuje **fáze 4.2** – přenos palety, fontů
(Google Fonts `<link>`) a UI směru do `tokens.css` + nasazení na reálné obrazovky – spustí se samostatně.

### 2026-07-18 – Fáze 4.2: aplikace redesignu (barvy, typografie, logo)

Přeneseno schválené V2 do prototypu. Vzhled se poprvé reálně změnil.

- **Tokeny** (`tokens.css`): paleta přepsána na hodnoty z vhaaji.cz; přidány `--color-accent-ink`
  (okrová jako text), `--color-on-primary` (text na primární ploše), `--tint-green/rose/ochre/blue`.
  `--font-serif` = Bricolage Grotesque (nadpisy), `--font-sans` = Inter (tělo/UI).
- **Google Fonts** `<link>` ve všech třech `src/*.html` přepnut na Bricolage Grotesque + Inter.
- **Sweep natvrdo psaných barev** → nové odstíny/tokeny napříč `styles/*.css` a inline v `scripts/`:
  staré primární/akcentní/info/muted/text/surface rgba i hexy přemapovány (skript). `#F4EEDF`
  → `var(--color-on-primary)`. Docházkové kódy (`CODES`, `codeLabel`, `dlegend`) a avatarová
  pozadí (`shared.js` `BG`) přeladěny na paletu. **Danger/success a Google-kalendář `.gcal*`
  ponechány** (dle zadání). Skin/hair avatarů = lidské tóny, ponechány.
- **Logo**: emblém (optimalizované PNG data URI, konstanta `VHAAJI_LOGO` v `shared.js`) v hlavičce
  draweru (rodič, průvodce) i sidebaru (admin) vedle „Vhaaji". Favicon (48px PNG data URI) ve
  všech třech `src/*.html`. Rozcestník `index.html` přepsán na novou paletu/fonty + logo + favicon.

**QA (prohlížeč, http server):** rodič/průvodce/admin na 1440 i 375 px – nová paleta všude, žádná
stará barva, logo v hlavičkách, drawer OK, stavové badge čitelné, žádné chyby v konzoli. Dist
ověřen jako **offline-schopný** (žádné externí obrázky mimo Google Fonts; logo+favicon jako data URI).
Typografická velikostní škála jako tokeny a aktivace `--space-*` v komponentách zůstává na 4.3.

### 2026-07-18 – Fáze 4.3: sjednocení komponent a stavový vizuál

- **Sjednocení dvojích variant** (tab. „Otevřená rozhodnutí" výše): 16 sdílených tříd sjednoceno na
  průvodcovskou (větší) hodnotu smazáním rodičovských přepisů; `.tlab` tokenizován. Rodič i průvodce
  mají shodnou typografickou škálu.
- **`--space-*` aktivace:** bezpečně na 13 přesných shodách (jen spacing, ne font-size/radius) v
  components.css. Rytmus designu je jinak záměrně mimo škálu (5/6/9/11/13/15) – plošná migrace by
  změnila vzhled, neděláme.
- **Toast sjednocen:** rodič přešel z vlastního `#toastbox` + re-render na sdílený `showToast` (shared.js)
  přes `#toast` element (mimo `#content`) + `.on`. Jeden mechanismus napříč appkami (povolená výjimka).
  Rodičovský `.toast` CSS přepis smazán.
- **Stavová paleta `--state-*`** (ok/info/warn/danger/neutral/muted/brand, každý -ink/-bg) v tokens.css.
  Badge třídy (`.bdg.*`) v rodiči/adminu/components přepojeny na ni → **tentýž stav vypadá stejně ve
  všech appkách**. Opraven kontrast: `warn` používá `--color-accent-ink` (světlá accent jako text
  neplnila AA).
- **Sdílená `CODES`** přesunuta do `shared.js` (barvy z `--state-*`); rodič i průvodce ji sdílí,
  průvodcovy inline popisky (`codeLabel`, `dlegend`) na ni přepojeny (odložený bod z 0.3).
- **Empty states:** doplněny do rodičovských náhrad a omluvenek; průvodce je má napříč. Seznamy vždy
  plněné seed daty je nepotřebují. Mutující akce dávají potvrzení přes `showToast`.
- **design-system.md:** doplněna sekce „Komponenty a stavy" (tokeny, stavová paleta, badge/chip, toast,
  typografická hierarchie, empty states) – sada rozhodnutí a pravidel dle briefu.

**QA (prohlížeč):** rodič/průvodce/admin 1440 i 375 px – badge stavy jednotné napříč appkami (ověřeny
shodné barvy CODES v rodiči i průvodcovském legendu), toast funguje přes sdílený `#toast`, empty stavy
se zobrazí (ověřeno vynulováním seznamů), žádné chyby v konzoli. Dist rebuilt, offline-schopný.

### 2026-07-18 – Fáze 4.4: čitelnost, přístupnost, mikrocopy

- **Kontrast AA (skript nad reálnými tokeny):** text/muted/primary/primary-strong/accent-ink/danger na
  povrchech prochází ≥4.5. Marginální `info`/`success` jako text na bg (4.33/4.42) → ztmaveny přes token:
  `--color-info` #4E7488→**#496D7E**, `--color-success` #3C7A4E→**#387349** (oba teď ≥4.5 na bg/surface
  i pro krémový text na výplni). Stavové tinty sladěny. Badge (ink na .12–.15 rgba nad surface) ≥4.5.
- **Dotykové cíle ≥44 px** (klikací plocha, ne nutně vizuál) v obou mobilních appkách: bump min-height/
  hit-area u `.burger`, `.ditem`, `.chk` (::before inset −7, vizuál zůstává 30px), `.stepper/.daybar button`,
  `.switch/.mini/.filters/.temanav/.kids/.choices button`, `.clink`, `.cbtn`, `.odbtn`, `.kbtn`, `.hkid`,
  `.ed`, `.gchip`, `.akce`, `.omx`, `.newsmore`, `.tlabbtn`, `.daypick`, `.addbtn`, `.prehl-abs`.
  **Google-kalendář `.gstep`/`.gcell` ponechány kompaktní** (záměrná nápodoba Googlu, 42/22 px).
- **`:focus-visible`** v base.css: viditelný focus ring (2px primary) jen při klávesové navigaci
  (`:focus{outline:none}` + `:focus-visible` na button/a/input/textarea/select/[tabindex]). Ověřeno
  Tabem v adminu (matches(':focus-visible')=true, outline primary).
- **Mikrocopy tykání/vykání (V4):** appky konvenci **už dodržovaly** – průvodce tyká („Klepni, nastav"),
  rodič vyká („Vyberte, Klepněte"). Opravena 1 odchylka: rodič `modals.js` „Vyber"→„Vyberte". Formát dat
  konzistentní („D. M. RRRR" s mezerami). Terminologie dle objekty-systemu.md beze změn.

**QA:** rodič/průvodce/admin 1440 i 375 px – bez nečitelných textů, cíle ≥44 (mimo záměrný gcal),
focus ring funguje, žádné chyby v konzoli. Dist rebuilt.

### 2026-07-18 – Responzivní re-layout mobilních appek (nahrazuje telefonní rám)

Designérka: telefonní rám s menu vedle nebyl responzivní, jen „mobil s menu". Zvolila **plně
responzivní re-layout** (obsah se na desktopu přeskládá do více sloupců). Řešeno **CSS-only**
v `layout.css` (JS beze změny), admin nedotčen (má vlastní `layout-admin.css`).

- **<900 px:** beze změny – drawer overlay + jeden sloupec (mobile-first).
- **≥900 px:** `.screen` = flex; `.drawer` = **trvalý levý sidebar** (sticky, 250px, border-right;
  ne fixed overlay), burger a scrim skryté. `.scroll` = obsah, `flex:1`, max-width 1200px, vycentrovaný.
- **Obsah do sloupců (masonry):** `#content{column-width:340px}` → 2 sloupce od ~900, 3 od ~1300.
  `break-inside:avoid` na dětech; full-width přes sloupce (`column-span:all`): hero, day-nav,
  `.omluvbtn`, `.vhead`, `.switch`, `.wkrow`, legend, stepper, filtry, `.back`, `.temanav`.
- **Overlaye** (rodič do `#content`) se masonry skládají do pěkného vícesloupcového formuláře
  (OD/DO kalendáře vedle sebe). **Modaly** (průvodce `#modalRoot`) se ≥700 px centrují jako dialog.

**QA:** rodič i průvodce na 1680/1280/1024/375 px – sidebar + 2–3 sloupce, full-width hlavičky/akce,
overlay omluvenky 2-sloupcový, modal centrovaný, mobil beze změny, žádné chyby. Nahrazuje zápis
„Desktopová prezentace mobilních appek".

### 2026-07-18 – Revize ui-ux-pro-max: reduced-motion + hover stavy

Použit skill **ui-ux-pro-max** jako revizní vrstva (ne k přepsání identity). Jeho doporučení stylu/
palety/fontů (vibrant block-based, Baloo 2/Comic Neue, teal/amber) **záměrně nepřevzato** – kolidovalo
by se schválenou identitou z vhaaji.cz a s designérčiným zamítnutím dětského směru (neměnné pravidlo).

Z jeho checklistu/UX domény vzaty **dvě nekonfliktní mezery** (obě reálně chyběly):
- **`prefers-reduced-motion: reduce`** (High) – přidán globální reset animací/transitions v `base.css`.
- **Hover stavy** (Web, teď relevantní kvůli desktop layoutu) – `@media (hover:hover)` v `components.css`:
  nav (drawer i admin sidebar), plné akce (projasnění), ghost/segment tlačítka (tint + border),
  klikací karty/řádky (povrch), textové odkazy (podtržení). Dotyk nezasažen. Ověřeno: hover na nav
  položce dává tint, reduced-motion i hover pravidla přítomná v distu, žádné chyby.

Ostatní checklist body už splněny v 4.4 (kontrast AA, focus-visible, dotykové cíle, responzivita 375–1440).

### 2026-07-18 – Revize desktopu: viditelnost, barevná hierarchie, uspořádání (ui-ux-pro-max)

Designérka: po přechodu na desktop bylo rozložení „rozházené" a některé prvky špatně vidět
(faktura po splatnosti moc slabá, „Nahlásit absenci" a další buttony/texty málo viditelné).
Revize přes **ui-ux-pro-max** (principy: hierarchie, kontrast, stav barvou + ikonou/textem).

**Viditelnost / barevná hierarchie:**
- **Faktura po splatnosti** (rodič dashboard `.neuhr`): z tlumené okrové na **výraznou červenou** –
  danger border + text + ⚠ ikona + text „Po splatnosti" (barva **i** ikona, ne jen barva). AA doladěno.
- **„Nahlásit absenci"** (`.hero .ed`): z průhledného ghostu na **plné krémové tlačítko** s tmavě
  zeleným textem (7.6:1).
- **Primární akce `.addbig`** (Otevřít docházku, Nová aktualita, Nový zápis): z ghostu na **plné
  zelené** tlačítko – jasná primární akce napříč průvodcem i adminem.
- **Světlá okrová jako text** (18 míst: `.p-dop`, `.ind.awake`, `.spectit`, `.selinfo`, `.deadline`,
  `.np.pay`, admin kapacity/náhrady …) → **`--color-accent-ink`** (z ~2:1 na ≥5:1). Zbylé hardcoded
  staré info `#4E7488` → token. `.modes button.on` (krém na okrové = světlé na světlém) → tmavý text.
- **Stavové tinty zesvětleny** (tokeny + docházkové pilly): danger .12→.08, info .15→.10, ok .13→.11
  – všechny badge/pill inkousty teď **AA ≥4.5** (dřív 4.2–4.4).

**Uspořádání desktopu (méně „rozházené"):**
- Sloupce omezeny na **2 vyvážené** (`column-count:2`), obsah max-width **1060px** vycentrovaný.
- **Karty na desktopu dostaly jemný stín** (na krémovém pozadí jinak splývaly → dojem rozsypání).
- **Široké seznamy/tabulky** (docházka: `.search`, `.weekbox`, `.rosterbox`, `.ctxhead`, `.tabs`)
  jdou přes celou šířku – konec osamoceného vyhledávacího pole vedle tabulky.

Pozn.: doporučení stylu/palety/fontů z ui-ux-pro-max (vibrant, Baloo 2, teal/amber) **nepřevzato** –
koliduje se schválenou identitou (neměnné pravidlo). Vzaty jen principy hierarchie/kontrastu/stavů.

**QA:** rodič/průvodce/admin 1440 i 375 px – faktura výrazně červená, tlačítka plná a čitelná,
docházka jeden sloupec, badge AA, mobil beze změny, žádné chyby v konzoli. Dist rebuilt.

### 2026-07-18 – Restrukturalizace rodičovského dashboardu („soupis dne")

Designérka: dashboard byl na desktopu roztažený a bez priorit; duplicitní akce (Nahlásit absenci
× Omluvit), náhrady na dashboard nepatří, malé nadpisy, puntíky u aktualit pryč, „Zítra" duplicitní.
Přestavěno na **„soupis dne" dle priorit rodiče** (schválené pořadí):

1. **Faktura po splatnosti** – plná šířka nahoře (červená, ⚠).
2. **Docházka + rychlé omluvení** – sloupec 1: velký stav dne + jedna akce.
3. **Dnešek** – sloupec 2: Dnešní program (dřív „Kde X začíná den"), Průvodci (dřív „Kdo X provází"),
   Co bude X jíst.
4. **Výhled** – sloupec 3: Co X čeká + Aktuality (řádek = datum · titulek · ›, bez priorit. puntíků).

- **Hlavička:** velký H1 „Eliška · středa 3. 6. ▾" (datum = titulek dne; jméno v 1. pádu – genitiv
  „Elišky den" zamítnut, nešel by skloňovat pro všechna jména). Datum otevírá výběr dne, kompaktní
  ‹ › vpravo, mimo dnešek chip „dnes" pro návrat. Listování na jiné dny zachováno.
- **Jedna omluvná akce (řeší dřívější duplicitu):** tlačítko se přizpůsobuje zobrazenému dni –
  dnes „Nahlásit absenci dnes" (openOmluvenka s prefill dneška → flow transparentně ukáže „po
  deadlinu, náhrada nevznikne"), budoucí den „Omluvit na Čt 4. 6." (včasná), minulý den zamčeno.
  V omluvence lze rozsah rozšířit (od–do). Inline editor kódu z dashboardu odstraněn (změna typu
  docházky patří do sekce Docházka; odkaz „Docházka a náhrady ›" v kartě). Náhrady z dashboardu pryč.
- **Nadpisy karet:** nová třída `.ch` (Bricolage 16/600, primary-strong) místo malého `.tlab`.
- **Zítra** zrušeno (obsaženo v „Co X čeká"). Hero blok „X ve školce" zrušen (identita je v topbaru).
- **Layout:** `.dash3` grid – ≥900 px 2 sloupce, ≥1200 px 3 sloupce; mobil = stoh v pořadí priorit.
  Mrtvé CSS odstraněno (hero, daybar, zitra, nahdash, newsdot, tlabrow, dashedit, daypick, glab…).

**QA:** 1440 (3 sloupce dle priorit) i 375 px (stoh) – listování dnů mění tlačítko i H1, chip „dnes"
funguje, prefill omluvenky z dneška ukazuje deadline varování, žádné chyby v konzoli. Dist rebuilt.

### 2026-07-18 – Dashboard rodiče, 2. iterace (dnešní absence jako modal, model „po deadlinu = NE")

Dle zpětné vazby designérky:

- **Listování dnů:** ‹ ▾ › hned vedle data (jeden vizuální pattern, ▾ = výběr dne z kalendáříku);
  dřív šipky na protějším okraji bez vazby na datum.
- **„Faktura po splatnosti"** – doplněno slovo faktura.
- **ROZHODNUTÍ (model A): cokoliv po deadlinu = Neomluveno (NE), ne „omluveno po deadlinu".**
  Sjednocuje prototyp s realitou („po 20:00 jen neomluveno"). Dopady: omluvenkový flow značí pozdní
  dny NE (včasné OM), dnešek už v omluvence nelze vybrat, seed 2. 6. změněn OM→NE, done-text upraven.
- **Nový modal „Nahlásit dnešní absenci"** (první modal v rodičovské appce – přidán `#modalRoot`,
  sdílené `.modal` styly; mobil = bottom-sheet, desktop = dialog): varování (po deadlinu, den
  neomluvený, náhrada nevznikne) → důvod (nepovinný, propíše se do poznámky dne) → **dnešní oběd**
  (polévka + hlavní jídlo z jídelníčku) + volba vyzvednutí („Nevyzvednutý oběd propadá.") →
  danger tlačítko „Nahlásit neomluvenou absenci". Zapisuje att=NE, poznámku, oběd, omluvenkový
  záznam (po-deadlinu) i náhradu (nevznikla) – Docházka a náhrady zůstávají konzistentní.
- **Karta Docházka:** stav se propisuje okamžitě (po nahlášení červené „Neomluveno"); nově
  **spinkání** („☾ Spinká · uspává Helča" / „Nespinká" – plán, per-child pole `spi` v seedu;
  živý stav by porušil pravidlo o nesdílení dat mezi appkami), **poznámka dne** viditelná hned
  (okrový box) a po absenci info o obědu (vyzvednete si / propadá).
- **Průvodci** přesunuti pod Docházku (sloupec 1) a vypsáni **plnými jmény** (zkratky He/G nic neříkaly).
- **Přejmenování:** „Co Elišku dnes čeká" (dřív Dnešní program), **„Měsíční program"** – vypisuje
  celý červen z EVMAP (akce, organizační, kroužky; **bez narozenin** dle rozhodnutí), „Aktuality školky".
- **Básnička a písnička týdne** na dashboardu (texty shodné s průvodcovskou appkou, seed `TYDEN`)
  s prokliky na YouTube (reálné vyhledávací odkazy, žádná smyšlená videa).

**QA:** 1440 i 375 px – šipky u data, modal flow end-to-end (důvod + oběd → Neomluveno červeně,
poznámka i oběd na kartě, záznam v omluvenkách + náhrada „nevznikla", toast), dnešek v omluvence
zablokovaný (prefill zítřek), mobil bottom-sheet, žádné chyby v konzoli. Dist rebuilt.

### 2026-07-18 – Dashboard rodiče, 3. iterace (denní program z reálné tabulky, hodiny průvodců)

- **Hlavička výš:** velký datumový nadpis „Eliška · středa 3. 6. ‹ ▾ ›" je teď titulek stránky –
  duplicitní „Přehled" v topbaru se na dashboardu skrývá (`core.js`, ttl='' pro `prehled`). Šipky
  nowrap.
- **Program dne z reality:** doplněn `DENNI` (činnost dle dne v týdnu) – zdroj `podklady/Pro rodiče
  25_26 vhaaji.xlsx`, tab ČERVEN: Po Rytmika · Út Putování · St Pohyb · Čt Tvorba · Pá Hrátky s
  pohádkou. Karta „Program dne" ukazuje činnost výrazně (`.prog-day`) + speciální akci (sraz) navíc.
- **Průvodci dnes s hodinami:** z pillů na seznam řádků (avatar · jméno · od–do · ☾ uspává). Hodiny
  (`h`) doplněny do seedu průvodců, grounded v tabu ROZVRH a kontakty (prototyp drží 4 průvodce;
  reálný per-day roster je bohatší, zjednodušeno). Legenda „☾ = dnes uspává".
- **Modal dnešní absence** ověřen skutečným kliknutím (funguje; předchozí „nevidím změnu" byla cache
  starého distu – nutný hard refresh).

**QA:** 1440 i 375 px – datum titulek (topbar bez „Přehled"), program dne se mění dle dne (Čt Tvorba,
Pá Hrátky…), průvodci s hodinami, modal otevřen klikem, konzole čistá. Dist rebuilt.

### 2026-07-18 – Průvodcovský dashboard: „soupis dne" (stejný přístup jako rodič)

Přenesen přístup z rodičovského dashboardu i na průvodcovský (`pruvodce/screens/prehled.js`):
velký datumový nadpis, prioritní sloupce, nadpisy karet `.ch`. Použit skill **ui-ux-pro-max**
jen jako principy (hierarchie nadpisů h1→`.ch`, stav barvou **i** textem, konzistentní škála,
dotykové cíle) – jeho paleta/fonty (vibrant, Baloo 2) **nepřevzaty** (schválená identita = neměnné pravidlo).

- **Hlavička = titulek stránky:** velký H1 „Středa 3. června 2026" (`.dash-head`/`.dh-t`) +
  podtitul „Dnes ve školce · Táňa (otevírá) · …" (`.dh-sub`, odvozeno z `GUIDESHIFT`/`serving`).
  Duplicitní „Přehled" v topbaru se na dashboardu skrývá (`core.js`, `ttl=''` pro `prehled` – stejně
  jako rodič). Datum bez listování dnů (průvodcovský dashboard je „dnešek", ne procházení).
- **Prioritní sloupce `.dash3`** (≥900 px 2 sloupce, ≥1200 px 3; mobil = stoh dle priorit):
  - **Sl. 1 Docházka:** počty dne (odvozené z `counts()`) + velké tlačítko „Otevřít dnešní docházku"
    + „Kdo dnes nepřijde" (jmenovitě, důvod barvou i textem).
  - **Sl. 2 Dnešek:** „Program dne" (`.prog-day` z `RYTMUS[wd]` + kroužek), „Básnička a písnička
    týdne" (z `TEMA`), „Dnešní akce".
  - **Sl. 3 Tým a provoz:** „Průvodci dnes" (řádky `.np` s hodinami + otevírá + ☾ uspává),
    „Zdravotní a provozní poznámky".
  Nahrazuje dřívější jednosloupcový strip + `.prehl-tema`.

- **Sdílené dashboard třídy přesunuty do `components.css`** (jeden zdroj pravdy – teď je používají
  oba dashboardy): `.dash-head`, `.dh-t`, `.ch`, `.dash3`/`.dcol`, `.cardlink`, `.prog-day`
  (+ nový `.dh-sub`). Ze `screens-rodic.css` odstraněny; parent-specifické (`.dh-nav`/`.dh-step`/
  `.dh-today`/`.dh-date`, day-picker, `.doch-*`) tam zůstávají. Kaskáda beze změny (components se
  načítá dřív, žádné konfliktní přepisy) – ověřeno, rodičovský dashboard bez regrese.
- **Nový opt-in `.tabs.wrap`** (v `components.css`): na desktopu se počty ve sloupci zalomí (jinak
  je `.tabs` horizontální scroll se skrytým scrollbarem → „Nepřítomní" schované). Docházková sekce
  používá `.tabs` beze změny.

**QA (src přes http server):** průvodce 1280 (3 sloupce dle priorit) i 375 px (stoh: Docházka →
Kdo nepřijde → Program → Básnička → Akce → Průvodci → Poznámky); 7 karet `.ch`, všech 5 počtů
viditelných (zalomeno 3+2), topbar bez „Přehled", program „Pohyb" + kroužek dle dne. Rodič
1280 bez regrese (velký datum s listováním, `.prog-day`, 3 sloupce). Konzole čistá u obou. Dist rebuilt.

### 2026-07-18 – Dashboard rodiče, doladění hlavičky a výhledu (dle designérky)

Pět úprav na rodičovském dashboardu (`rodic/screens/prehled.js`, `core.js`, `rodic.html`, `screens-rodic.css`):

- **Hlavička dashboardu (avatar + „Eliška · středa 3. 6." + listování ‹ ▾ ›) je v topbaru na úrovni
  přepínače dětí.** Vykresluje se do nového `<div class="dashhead" id="dashhead">` (v topbaru za burgerem,
  před `.ttl`) funkcí `renderDashHead()` volanou z `renderHead()` jen na dashboardu; `renderDashboard()`
  začíná rovnou fakturou, `#ttl` na dashboardu prázdný. `.dashhead:empty{display:none}` (mimo dashboard
  bez mezery). `.dh-nav` je `position:relative` (kotva pro kalendář-dropdown). **Mobil (<900 px):**
  `.topbar{flex-wrap:wrap}` + `.dashhead{order:3;flex-basis:100%}` → topbar řádek = burger + přepínač dětí,
  hlavička se zalomí celá pod něj (avatar+titulek, šipky). Dolaďovací iterace dle designérky: vedle H1 →
  do topbaru vpravo → v topbaru vlevo nad nadpis → zpět k nadpisu v obsahu → **finálně celá hlavička do
  topbaru na úroveň přepínače dětí**.
- **Kalendář-dropdown má hlavičku „červen 2026"** (`.dp-title`) – dřív chyběl měsíc/rok. Pevný popisek
  bez přepínání měsíců: prototyp běží jen v červnu 2026, jiné měsíce nemají data (funkční navigace mezi
  měsíci/roky by byla mimo rozsah a vedla na prázdno).
- **Karta aktualit přesunuta ze sloupce 3 do sloupce 1 pod „Průvodci dnes"** a **přejmenována
  „Aktuality školky" → „Novinky ze školky"** (patička „Všechny novinky ›"; designérka vybrala z variant
  Nástěnka / Novinky ze školky / Co je nového). Sloupec 3 tak nese jen Měsíční program. Pozn.: sekce v menu
  zůstává „Aktuality" (přejmenování karty se sekce nedotklo). Mobilní stoh = jedno DOM pořadí → novinky
  jsou nově hned za Průvodci (ne na konci).
- **▾ otevírá kompaktní kalendář-dropdown** místo obřího gridu přes celou šířku. `.daypicker` je teď
  `position:absolute` pod ▾ (šířka 236 px, stín, `z-index`), buňky zmenšeny **jen zde**
  (`.daypicker .dpcell`) – `.dpcal`/`.dpcell` v overlay omluvenky zůstávají velké (sdílené, nedotčené).
  Zavírání klikem mimo: `dashPickerOpen` přidán do globálního `document click` handleru, `toggleDashPicker(e)`
  a `.daypicker` mají `stopPropagation`, aby je otevírací/vnitřní klik hned nezavřel (stejný vzor jako `.kmenu`).
- **„Program dne" → „Co bude Eliška dělat"** (jméno dítěte, konzistentní s „Co bude Eliška jíst").
- **Měsíční program: datum (a čas) před název** – řádky přepnuty z `.akce` (název vlevo, datum vpravo)
  na `.newsrow` pattern (datum vlevo · čas tučně · název, ›). Čas se odděluje z názvu regexem
  `„ · HH:MM" na konci` (kroužky), takže „8. 6. · **15:15** · Kroužek Tanečky s Niki".
- **Avatar dítěte před H1** (`avatar(c,38)` na začátku `.dash-head`) – kolečko s vygenerovaným avatarem.

**Nedotčeno:** průvodcovská a admin appka (žádný soubor v `pruvodce/**`, `admin/**`, `components.css`
ani `screens-pruvodce.css` neupraven).

**QA (dist přes http server, cache-bust):** rodič 1280 i 375 px – ‹ ▾ › v topbaru u přepínače dětí,
avatar před H1, „Co bude Eliška dělat", měsíční program s datem+časem vlevo; ▾ otevře malý dropdown
(dnešek zvýrazněn), výběr dne přepne H1/program/omluvné tlačítko a ukáže chip „dnes", topbar se vejde
i na 375 px. Konzole čistá. Dist rebuilt.

### 2026-07-18 – Průvodcovský dashboard: zdravotní poznámky pod docházku

Symetricky s rodičem: karta **„Zdravotní a provozní poznámky"** přesunuta ze sloupce 3 (tým)
do **sloupce 1 pod docházku** (`pruvodce/screens/prehled.js`) – pořadí sloupce 1: Docházka dnes →
Kdo dnes nepřijde → Zdravotní a provozní poznámky. Sloupec 3 tak nese jen „Průvodci dnes". Mobilní
stoh = jedno DOM pořadí → poznámky jsou nově hned za „Kdo nepřijde", ne až za Průvodci.

**QA (dist):** průvodce 1280 px – sloupec 1 = Docházka/Kdo nepřijde/Zdravotní poznámky, sloupec 3 =
jen Průvodci dnes (ověřeno DOM + vizuálně). Konzole čistá. Rodič/admin nedotčeni. Dist rebuilt.

### 2026-07-18 – Průvodcovská Docházka: desktop layout ve stylu Přehledu

Designérka: Docházka vypadala na desktopu jako roztáhlý mobil (jeden full-width sloupec – široký
přepínač, stepper, roztažené řádky rosteru). Překopáno do stejného stylu jako Přehled
(`pruvodce/screens/dochazka.js`, `core.js`, `screens-pruvodce.css`).

- **Hlavička:** velký nadpis `<h1 class="dh-t">Docházka</h1>` + kompaktní přepínač Den/Týden/Měsíc
  vpravo (`.doch-head`, na desktopu flex space-between). Duplicitní „Docházka" v topbaru skryta
  (`core.js`, `ttl=''` i pro `dochazka`, stejně jako `prehled`).
- **Den – dva panely (`.doch-den` grid 288px + 1fr, desktop ≥900):** levý sticky panel = listování dne
  (`.stepper`) + počty jako **filtry v mřížce 2×2** (`.doch-counts`); pravý panel = kontext + hledání +
  roster + souhrn jídel (`.doch-mealsfoot`). Pro **jiný den** levý panel nese stepper + zvláštní den
  (`.specbar`) + souhrn (přítomno/zámek), pravý roster dne. Celá obrazovka je zabalená v `.doch`
  (`column-span:all`) → vystupuje z masonry `column-count:2` a řídí si layout sama.
- **Týden/Měsíc nechány na plnou šířku** (tabulka týdne / kalendář měsíce jsou záměrně široké – to není
  „roztáhlý mobil"), jen pod novou hlavičkou.
- **Mobil beze změny chování:** `.doch-den` bez gridu → panely se stohují (nadpis → přepínač → stepper →
  počty 2×2 → kontext → hledání → roster → jídla). Počty jsou nově 2×2 mřížka místo horizontálního
  scrollu (čitelnější, nic se neschovává).

**QA (dist):** průvodce 1280 px – Den = dva panely (počty 2×2, roster vpravo), rozbalení řádku/edit
funguje, jiný den má souhrn vlevo, Týden tabulka + Měsíc kalendář na plnou šířku; 375 px stoh v pořadí.
Konzole čistá. Rodič/admin nedotčeni. Dist rebuilt.

### 2026-07-18 – Průvodcovská Docházka: potvrzovací toast u dnešních změn

Chybějící potvrzení (proti design-systému „každá mutující akce dává potvrzení přes showToast"):
dnešní edit panel a checkbox přítomnosti měnily stav v paměti bez zpětné vazby. Doplněno
`showToast` do `presence`/`setStatus`/`setPlan` („Docházka uložena ✓") a `setSpi` („Uloženo ✓")
v `pruvodce/screens/dochazka.js`. Změna zůstává okamžitá (bez zvláštního tlačítka Uložit – shodně se
zbytkem appky, kde toggle = uložení); buňka jiného dne (`setCell`) toast měla už dřív.

**QA (dist):** rozbalení dítěte → přepnutí typu docházky/stavu → vyskočí „Docházka uložena ✓",
počty se přepočítají, panel zůstane otevřený. Konzole čistá. Dist rebuilt.

### 2026-07-18 – Průvodcovská Docházka: sloučené pole datum+Den/Týden, vyhozen Měsíc

Dle designérky: (1) měsíční pohled u průvodce nedává smysl – průvodce řeší **den a týden**; měsíc
patří rodiči (přehled, hromadné omluvy) a vedení (statistiky), proto zůstává jen tam. (2) Výběr data
a přepínač Den/Týden sloučeny do **jednoho pole** v hlavičce.

- **Měsíc odstraněn** z přepínače i větvení (`renderMesicD`, `stepMonth` smazány). Zůstávají Den + Týden.
  (Rodičovská/admin Docházka nedotčena – měsíc tam zůstává.)
- **Sloučené pole `renderDochNav()` (`.dfield`)**: malý přepínač `Den | Týden` (`.switch.dsw`) +
  listování data (`.dnav` – ‹ popisek ›). V režimu Den popisek = „St 3. 6. · dnes" a ‹ › krokují dny;
  v režimu Týden = „1.–5. 6." a ‹ › krokují týdny. Nahrazuje dřívější samostatný přepínač Den/Týden/Měsíc
  **i** samostatné steppery uvnitř pohledů (ty z `todayRoster`/`dayRoster`/`renderTydenD` odstraněny).
- Levý panel Dne tak nese jen počty (filtry); listování je nahoře v poli. Týden = pole + legenda +
  hledání + tabulka (plná šířka).

**QA (dist):** průvodce 1280 px – hlavička: „Docházka" + `[Den|Týden]` + `‹ datum ›`; přepnutí na Týden
změní popisek na rozsah a ‹ › krokují týdny (ověřeno „1.–5. 6." → „8.–12. 6."); Měsíc není. 375 px:
pole se zalomí (přepínač + datum pod sebou), zbytek stoh. Konzole čistá. Dist rebuilt.

### 2026-07-18 – Rodičovská Docházka a náhrady: desktop layout ve stylu Přehledu

Stejný přístup jako u průvodce (desktop ať není roztáhlý mobil), přizpůsobený rodičovskému obsahu.
`rodic/screens/dochazka.js`, `core.js`, `screens-rodic.css`.

- **Velký nadpis „Docházka a náhrady"** (`.doch-head` .dh-t; duplicitní titulek v topbaru skryt –
  `core.js`, `ttl=''` i pro `dochazka`) + akce **„Omluvit …"** vpravo v hlavičce (na desktopu normální
  šířka, ne roztažený full-width pruh; na mobilu full-width pod nadpisem).
- **Dva sloupce (`.doch-den`, desktop ≥900):** vlevo (`.doch-side`, ~380px) **Dostupné náhrady** +
  **Omluvenky** (karty, nadpis Omluvenky povýšen na `.ch`); vpravo (`.doch-main`) **Kalendář docházky**
  (`.ch`) + přepínač Den/Týden/Měsíc (omezená šířka) + editor dne/týdne/měsíce + hint. Celé zabaleno v
  `.doch` (`column-span:all`) → vystupuje z masonry `column-count:2` (dřív byly náhrady a omluvenky
  nevyváženě vedle sebe a „Omluvit" přes celou šířku).
- **Měsíc ponechán** (na rozdíl od průvodce) – pro rodiče dává smysl (přehled, hromadné omluvy);
  měsíční mřížka se vejde do pravého sloupce.
- Parent-specifické `.doch*` třídy jsou v `screens-rodic.css` (jiné šířky/obsah než průvodcovské; oba
  `screens-*.css` se nikdy nenačítají spolu, takže názvy nekolidují). Save-toasty tu už byly
  (`saveDay`/`applyBulk`).
- **Mobil beze změny pořadí:** nadpis → Omluvit → náhrady → omluvenky → kalendář (přepínač + pohled).

**QA (dist):** rodič 1280 px – velký nadpis + Omluvit vpravo; vlevo náhrady+omluvenky, vpravo kalendář;
Den (editor dne), Týden (řádky), Měsíc (mřížka) se vykreslí v pravém sloupci. 375 px stoh v pořadí.
Konzole čistá. Průvodce/admin nedotčeni. Dist rebuilt.

### 2026-07-18 – Rodičovská Docházka: prohození sloupců, zjednodušení náhrad, hromadné uložení

Sada úprav dle designérky (`rodic/screens/dochazka.js`, `screens-rodic.css`):

- **Prohozené sloupce:** vlevo **Kalendář docházky** (1fr), vpravo **Dostupné náhrady + Omluvenky**
  (~360px). Mobil: kalendář → náhrady → omluvenky.
- **Náhrady bez stavů a bez expirace:** zrušeny badge stavů i „expirace/nejbližší expirace". Karta =
  velké číslo dostupných + text + prostý seznam **jen dostupných** náhrad (původ + „vznik …"). Stavové
  položky (využitá/expirovaná/naplánovaná/nevznikla) se nevypisují. Omluvenky si stavy (Včas/Po deadlinu)
  ponechávají – týkalo se jen náhrad.
- **Smazané texty:** hint „Vyberte docházku na dnešek. Změny na další dny…" (den) a `.deadline`
  „Po 20:00 lze u dnešního dne zadat už jen neomluveno." (lock-hláška u zamčeného dne zůstává).
- **Tlačítko „Omluvit …" zrušeno** – omlouvání probíhá výběrem dne/týdne/měsíce v kalendáři. (Overlay
  omluvenky dál žije přes dashboard; z Docházky jen zmizel duplicitní vstup.)
- **Hromadné nastavení = tlačítko Uložit + toast:** výběr dní → výběr kódu (zvýrazní se, `bulkCode`) →
  **Uložit N dní** → aplikuje na všechny + toast „Docházka uložena · N dní ✓". Dřív se kód aplikoval
  hned klepnutím (bez uložení).
- **Editor omluvení zúžen** (`.doch-main .choices/.note/.savebtn/.daycard{max-width}`) – dřív roztažený
  přes celý sloupec.

**Detail omluvení → modal** (rozhodnutí designérky; konzistentní s průvodcovým cell-modalem). Klepnutí
na den v kalendáři (Den karta / Týden řádek / Měsíc buňka) otevře modal „Docházka a omluva" s editorem
(volba docházky/omluvy + důvod + Uložit). Nový stav `dayModal`, `renderDayModal()` do `#modalRoot`
(vzor jako `absModal`; `.modal-scrim`/`.modal` – mobil bottom-sheet, desktop dialog). `pick(d)` otevírá
modal jen pro editovatelné dny a dnešek (minulé zamčené neotvírají nic), `saveDay` modal zavře + toast
„Docházka uložena ✓". Inline editbox v týdnu/měsíci a dolní daycard zrušeny; Den = klikací karta
`.daycard-btn` („Upravit docházku / omluvit ›").

**QA (dist):** rodič 1280 px – sloupce prohozené, náhrady bez stavů/expirace, den-hint pryč, bez tlačítka
Omluvit; hromadné: výběr → Omluvit → Uložit → toast „…· 2 dny ✓", Čt/Pá → Omluveno; modal: klik na den →
dialog, Omluvit → důvod → Uložit → toast + zavření, Čt → Omluveno; Den karta → modal. 375 px: modal jako
bottom-sheet, zbytek stoh. Konzole čistá. Dist rebuilt.

### 2026-07-18 – Rodičovská Docházka: listování týdnů/měsíců, nadpisy, úklid

Dle designérky:

- **Listování období (šipky jako na Přehledu):** nadpis pohledu + `‹ … ›` steppery (`.dh-step`,
  `.vhrow`/`.dh-lbl`). **Týden** = reálná navigace po červnových týdnech (`weekStart`, `stepWeek`;
  1.–5. → 8.–12. → … → 29.–30.). **Měsíc** = `‹ Červen 2026 ›`; posun měsíce je placeholder
  (`stepMonth` → toast „Prototyp pracuje jen s červnem 2026") – prototyp má data jen červen.
- **Nadpisy pohledů** přejmenovány na **Denní / Týdenní / Měsíční přehled** (dřív „Eliška dnes“ /
  „Týden Elišce“ / „Červen Elišce“).
- **Smazán hint** „Klepněte na den a vyberte docházku. Pro více dní naráz „Nastavit více dní“." (celý
  objekt `HINTS` odstraněn – všechny pohledy ho měly prázdný/mazaný).
- **„Nastavit více dní najednou"** už není přes celou šířku – `.bulktoggle` `width:auto` (kompaktní tlačítko).

**QA (dist):** rodič 1280 i 375 px – Týden: „Týdenní přehled" + `‹ 1.–5. 6. ›`, krok mění týden
(ověřeno 1.–5. → 8.–12.), ‹ disabled na prvním týdnu; Měsíc: „Měsíční přehled" + `‹ Červen 2026 ›`,
šipka → toast; nadpisy sedí, hint pryč, tlačítko kompaktní. Konzole čistá. Dist rebuilt.

### 2026-07-18 – Průvodce: změna docházky přímo v týdenním přehledu (vč. dneška)

Dřív šla v týdenní tabulce upravit jen budoucí buňka; dnešek byl zamčený (dal se měnit jen v Dni).
Nově je **klikatelný i dnešní sloupec** (`ed=d>=TODAYD`, `openCell` blokuje jen `d<TODAYD`).
Protože dnešek se řídí **stavem** (ne plánovaným kódem), cell-modal je pro dnešek stavový
(Přítomen/Omluven/Neomluven → `data[ci].status`), pro budoucí dny zůstává plánovací (C/D/O/OM/N →
`att[d]`). `setCell` podle dne větví. Změna dneška je tak konzistentní s Dnem i dashboardem (mění tentýž
`status`). Hint přepsán: „Klepni na buňku dneška nebo budoucího dne a změň docházku. Minulé dny jsou uzavřené."

**QA (dist):** týden – klik na dnešní buňku (St) otevře stavový modal (· DNES), „Omluven" → buňka „om",
součet Přítomno St 22→21, toast; budoucí buňka dál plánovací modal; minulé (Po/Út) zamčené. Konzole čistá.
Dist rebuilt.

### 2026-07-18 – Průvodcovská Docházka: změna dneška i v týdenním přehledu

Dle designérky: v týdenním přehledu šly měnit jen budoucí dny, dnešek byl zamčený. Nyní jde klepnout
i na **dnešní buňku** (`openCell` povoluje `d>=TODAYD`); modal je pro dnešek **stavový**
(Přítomen / Omluven / Neomluven – dnešek se řídí stavem dítěte, ne plánovaným kódem) a `setCell` pro
dnešek zapisuje `status` (propíše se do Dne, počtů i dashboardu), pro budoucí dny dál `att[d]`.
Minulé dny zůstávají uzavřené; hint přeformulován („Klepni na buňku dneška nebo budoucího dne…").

**QA (dist):** klik na dnešní buňku (Meda, St) → stavový modal „St 3. 6. · dnes" → Omluven → buňka
„om", toast, součet přítomných St 22→21. Budoucí den dál plánovací modal. Konzole čistá.

### 2026-07-19 – Novinky (dřív aktuality): detail s fotkami, desktop, sekce u průvodce, WhatsApp

Velká revize aktualit dle designérky. **ROZHODNUTÍ: terminologie „novinky" úplně všude** – rodič
i průvodce mají sekci **Novinky**, admin appka přejmenována (sidebar, formulář, toasty), objekt
v dokumentaci je **Novinka** (`objekty-systemu.md`, `flows.md` Flow 4, `CLAUDE.md`). Kódové
identifikátory (`AKTUALITY`, `renderAktuality`, klíč sekce `aktuality`) zůstávají – mechanické
přejmenování bez viditelného dopadu se nedělá.

**Rodič (`rodic/screens/aktuality.js`, seed `NEWS` v `data.js`):**
- Seed rozšířen: `full` (delší text na odstavce), `time`, `img` (úvodní foto), `imgs` (fotky detailu).
  Fotky = placeholder tinty jako sekce Fotky (offline single-file, žádné assety).
- Seznam = **karty s úvodní fotkou** (`.newscard`, desktop mřížka 2/3 sloupce) a **proklikem na celou
  novinku** („Celá novinka ›" → overlay detail: hero přes celou šířku, celý text, mřížka fotek).
- **Bez jména průvodce** (rodiče nezajímá; vidí ho průvodce ve své appce). Velký nadpis „Novinky ze
  školky" (topbar titulek skryt), overlay titulek „Novinka".

**Průvodce – NOVÁ sekce Novinky (`pruvodce/screens/novinky.js`, seed `NEWS` v `data.js`):**
- Dřív průvodce žádné aktuality neměl (jen admin) – přitom je píše. Sekce zařazena za Docházku (✉).
- Seznam jako u rodiče, ale **s autorem a časem** (`Táňa · 2. 6. · 7:40 · platí do 5. 6.`).
- **Tlačítko „Sdílet do WhatsAppu"** na kartě i v detailu – reálný `wa.me/?text=…` odkaz
  (titulek + text), otevře WhatsApp share.
- **Formulář „+ Nová novinka"** (modal): titulek, text, platí do, Důležité, úvodní fotka (demo file
  input → tint). Odeslání: unshift do NEWS + toast „Novinka odeslána rodičům ✓". Detail = modal.
- Seed shodný s rodičem (simulovaná konzistence, appky nesdílejí data).

**Sdílené CSS:** karty novinek (`.news-grid/.newscard/.nc-*/.nd-*`, `.newsurg`, `.newsmeta`) a foto
mřížka (`.gal`/`.ph`) přesunuty/založeny v `components.css` (jednou pro obě appky; `.newsurg`
překlopen na `--state-danger-*` tokeny). V `screens-rodic.css` zbývá jen `#content > .nd-hero
{column-span:all}` (full-width hero v overlay).

**Nález – CSS komentář s `*/` uvnitř:** komentář „(.nc-*/.nd-*)" předčasně ukončil CSS komentář a
zahodil následující pravidlo (hero nespanoval). Pozor na hvězdičkové zástupce v CSS komentářích.

**QA (dist):** rodič 1280 – mřížka karet s fotkami, detail s hero přes šířku + fotkami, bez autora;
375 – stoh karet. Průvodce 1280 – sekce Novinky, karty s autorem+časem, WA odkaz správně enkódovaný,
detail modal s WA tlačítkem, formulář → nová novinka první v seznamu s toastem. Admin – sidebar
„Novinky", „+ Nová novinka", toasty. Konzole čistá ve všech třech. Dist rebuilt.

### 2026-07-18 – Průvodcovská Docházka: změna dneška i v týdenním přehledu

Dle designérky: v týdenním přehledu šly měnit jen budoucí dny, dnešek byl zamčený. Nyní jde klepnout
i na **dnešní buňku** (`openCell` povoluje `d>=TODAYD`); modal je pro dnešek **stavový**
(Přítomen / Omluven / Neomluven – dnešek se řídí stavem dítěte, ne plánovaným kódem) a `setCell` pro
dnešek zapisuje `status` (propíše se do Dne, počtů i dashboardu), pro budoucí dny dál `att[d]`.
Minulé dny zůstávají uzavřené; hint přeformulován („Klepni na buňku dneška nebo budoucího dne…").

**QA (dist):** klik na dnešní buňku (Meda, St) → stavový modal „St 3. 6. · dnes" → Omluven → buňka
„om", toast, součet přítomných St 22→21. Budoucí den dál plánovací modal. Konzole čistá.

### 2026-07-19 – Novinky (dřív aktuality): detail s fotkami, sekce u průvodce, přejmenování všude

Velká revize aktualit dle designérky. **Rozhodnutí: pojmenování „Novinky" úplně všude** (rodič,
průvodce, admin i dokumentace – objekt v `objekty-systemu.md` přejmenován na **Novinka**, Flow 4
v `flows.md` aktualizován; interní identifikátory kódu – `AKTUALITY`, `renderAktuality`, klíč sekce
`aktuality` – zůstávají, mění se jen viditelné texty).

**Rodič (`rodic/screens/aktuality.js`, seed `NEWS` v `data.js`):**
- Seed rozšířen: `id`, `full` (delší tělo – víc odstavců), `time`, `img` (úvodní foto), `imgs` (fotky
  detailu). Fotky = placeholder tinty jako sekce Fotky (offline single-file, žádné assety).
- Seznam = **karty s úvodní fotkou** v mřížce (`.news-grid`, 2 sloupce ≥900, 3 ≥1200; mobil stoh),
  velký nadpis „Novinky ze školky" (topbar titulek skryt). Karta: badge Důležité → titulek → **datum
  pod nadpisem** → perex (line-clamp) → patička **„Celá novinka ›" dole za tenkou linkou** (vzor
  `.cardlink` z Docházky), zarovnaná k spodní hraně karty. Karty bez fotky začínají odshora
  (`.newscard` je flex sloupec – `<button>` jinak obsah vertikálně centruje).
- **Detail = proklik na celou novinku** (overlay `novinka` do `#content`): hero foto, celý text po
  odstavcích, mřížka fotek. **Rodič nevidí autora** (jméno průvodce vyhozeno i ze seznamu).

**Průvodce – NOVÁ sekce Novinky (`pruvodce/screens/novinky.js`, seed `NEWS` v `data.js`):**
- Zařazena za Docházku (`✉`). Stejné karty, ale meta **se jménem autora a časem** (`Táňa · 2. 6. ·
  7:40 · platí do 5. 6.`) a v patičce **tlačítko „Sdílet do WhatsAppu"** (`wa.me` odkaz s textem
  novinky) – i v detailu (modal s fotkami).
- **Formulář „+ Nová novinka"** (modal): titulek, text, platí do, Důležité, úvodní fotka (demo file
  input → tint). Odeslání → novinka první v seznamu, toast „Novinka odeslána rodičům ✓".
- Seed zrcadlí rodičovský (simulovaná konzistence – appky data nesdílejí).

**Sdílené CSS (`components.css`):** karty novinek (`.news-grid`/`.newscard`/`.nc-*`/`.nd-*`,
`.newsurg`/`.newsmeta` – teď přes `--state-danger-*`) + `.gal`/`.ph` přesunuty ze `screens-rodic.css`
(používá je rodič i průvodce). **Nález:** CSS komentář obsahující `*/` uvnitř textu (`.nc-*/`)
předčasně ukončil komentář a zahodil následující pravidlo – opraveno, pozor na `*/` v komentářích.

**Admin:** viditelné texty přejmenovány (sekce **Novinky**, „+ Nová novinka", „Bez určených příjemců
nelze novinku odeslat", toasty). Logika Flow 4 beze změny.

**QA (dist, 1280 i 375):** rodič – mřížka karet (obsah odshora, datum pod nadpisem, patička s linkou
dole), detail s hero + fotkami bez autora, topbar „Novinka"; průvodce – sekce v draweru, karty s
autorem+časem, WA tlačítko, detail modal, formulář vytvoří novinku (Táňa · 3. 6. · 10:00, Důležité,
první v seznamu, toast); admin – sidebar/nadpis/tlačítko „Novinky/Nová novinka". Konzole čistá všude.
Dist rebuilt (všechny tři appky – sdílené components.css).

### 2026-07-19 – Detail novinky (rodič): článkový layout na desktopu

Dle designérky detail „aby na desktopu vypadal lépe" – dřív full-width hero pás + dva boxy vedle sebe
(masonry). Nyní **článek** (`.novdet`, `rodic/screens/aktuality.js` + `screens-rodic.css`): na desktopu
vycentrovaný sloupec s čtecí šířkou (max 720 px, `column-span:all` – mimo masonry), pořadí Zpět →
badge Důležité → hero (260 px, mobil 200 px) → velký titulek (23 px) → datum → **vlasová linka** →
text (14,5 px / 1.65) → linka → Fotky (mřížka). **Bez boxů** – dle design systému „prostor a vlasové
linky, ne rámečky". `.back` v článku na vlastním řádku (jinak se badge lepila vedle).

**QA (dist):** 1280 px – článek vycentrovaný, s fotkou (nw4) i bez fotky (nw1, badge nad titulkem);
375 px – stoh v pořadí. Konzole čistá. Dist rebuilt.

### 2026-07-19 – Dashboard rodiče: chip „dnes" jen u dnešního dne, šipky měsíců v mini kalendáři

Dva nálezy designérky:

- **Chip „dnes" byl obráceně** – fungoval jako tlačítko „návrat na dnešek" a ukazoval se právě tehdy,
  když zobrazený den NEBYL dnešek (matoucí). Nyní je to **pasivní indikátor**: `<span class="dh-today">`
  se zobrazí jen když `dashDay===TODAY`. Návrat na dnešek jde přes mini kalendář (▾ → 3).
- **Mini kalendář (▾) má šipky měsíců** `‹ červen 2026 ›` (`.dp-head`/`.dp-nav`). Posun měsíce je
  placeholder → toast „Prototyp pracuje jen s červnem 2026" (shodně s Docházkou – data jen červen).

**QA (dist, 1280 i 375):** dnešek → chip svítí; krok na Čt 4. 6. → chip zmizí; ▾ → `‹ červen 2026 ›`,
šipka → toast (picker zůstane otevřený), klik na 3 → zpět na dnešek + chip. Konzole čistá. Dist rebuilt.

### 2026-07-20 – Rodičovská appka dokončena: zbývajících 6 obrazovek na desktop

Přehled, Novinky a Docházka už desktopový layout měly; **Profil, Platby, Kalendář, Tématický plán,
Fotky a Kontakty zůstávaly netknuté mobilní stohy** – masonry (`#content{column-count:2}`) je na
desktopu svévolně sekal do sloupců. Sjednoceno stejným vzorem, žádný nový layoutový systém:
wrapper `.doch` (vystupuje z masonry) + `<h1 class="dh-t">` + vlastní mřížka; nadpisy karet `.tlab`→`.ch`.

- **Profil** – hlavička s avatarem + jméno (`.dh-id`, aby se avatar a titulek nerozutekly kvůli
  `space-between`), dvousloupcová mřížka. **Smazány karty „Fotky prací dítěte" a „Poznámky"** –
  byly to nefunkční prvky (tlačítko `onclick="return false"`, textarea bez uložení); práce dětí
  vkládají průvodci a poznámky rodiče nejsou v rozsahu prototypu.
- **Platby** – vlevo „K úhradě" (QR) + Kulturní fond (`.pcol`), vpravo Faktury.
- **Kalendář** – `.kal-wrap`: mřížka vlevo, vybraný den vpravo, obojí uvnitř bílého `.gcalwrap`
  (Google vzhled zachován; mobil beze změny = stoh).
- **Tématický plán / Kontakty / Fotky** – dvousloupcová `.page-2col`; Fotky mají širší galerii
  `.gal-wide` (3 sl. ≥900, 4 ≥1200), zatímco základní `.gal` zůstává 2sloupcová pro fotky v detailu novinky.
- **Topbar titulek** vyprázdněn pro **všechny** sekce (každá má teď vlastní `h1`); titulky overlayů beze změny.

**Opravené vady:**
1. **Fotky měly všechny dlaždice stejnou barvu** – `forEach(()=>…)` ignoroval prvek pole.
2. **„splatnost undefined"** na kartě K úhradě – faktury v seedu neměly pole splatnosti; doplněno
   `splatnost` (14 dní po vystavení) do obou dětí.
3. **Kolize názvů tříd v kalendáři** – typ události se dával do třídy přímo (`.gbar akce`), takže
   `.gbar.akce` chytala i řádkovou třídu `.akce` (`min-height:44px;display:flex`) a z tenkých pruhů
   dělala bloky. Typové modifikátory přejmenovány na `g-akce/g-naro/g-rozvrh/g-org`.
4. **Barvy placeholderů mimo tokeny** – nová sada `--photo-1..5` v `tokens.css`; použita ve `fotky.js`
   i v NEWS obou mobilních appek (`var(--photo-N)` funguje i v inline `style`). Černá/bílá ve `fakeQR()`
   a Google paleta `.gcal*` zůstávají záměrně natvrdo.

**QA (dist):** všech 9 sekcí na 1280 px – každá má vlastní velký nadpis, prázdný topbar, obsah ve
sloupcích; kalendář pruhy tenké, boční panel reaguje na výběr dne (24. 6. → Výprava do lesa + narozeniny).
375 px – žádná sekce nepřetéká (`scrollWidth === clientWidth` u všech 9). Konzole čistá.
Průvodcovské novinky mají po tokenizaci pořád barevné úvodní fotky. Dist rebuilt.

### 2026-07-20 – Profil dítěte: reálná data z podkladů, editace rodičem, číselníky, stahování dokumentů

Profil dostal skutečný obsah z `podklady/prototyp_dochazka_rodic.html` (dřív jen dvě karty)
a stal se **rodičem spravovatelný**, aby údaje zůstávaly aktuální.

- **Data z podkladů → `PROFIL` v `data.js`** (ne natvrdo v šabloně, aby každé dítě mělo vlastní
  hodnoty – starý prototyp ukazoval u obou dětí identické údaje Elišky). Karty: Základní údaje,
  Rodiče, Zdraví a strava, Co dítě baví / jak reaguje, Doporučení od průvodců. **Režim se neukládá** –
  odvozuje se z `child.base` přes `CODES` (Eliška Odpolední, Matěj Celodenní).
- **Celá telefonní čísla a plná adresa** (dřív maskováno `774 ••• •••` a jen „Praha 8"). Vymyšleno:
  matka `+420 774 512 908`, otec `+420 603 847 221`, adresa „Nad Rokoskou 1230/8, 182 00 Praha 8 – Libeň".
  Sourozenci sdílejí rodiče i adresu. Rodné číslo v prototypu záměrně neuvádíme.
- **Číselníky (`CISELNIK`)** – pojišťovna, jazyky, alergie, strava (Zajištěná školkou / Vlastní)
  se v editaci vybírají ze seznamu (`<select>`, resp. chips u alergií), ne volným textem.
  Alergie/léky/brýle jsou v datech strukturované (`alergie:[]`, `leky:false`, `bryle:true`),
  zobrazení přes `profAlergie`/`profAno`.
- **Editace rodičem** – tlačítko „Upravit údaje" v hlavičce → overlay `profedit` (stav `pfEdit`,
  handler v `profil.js`, dispatch v `core.js`). Spravovatelné jen Základní údaje, Kontakty a Zdraví
  a strava + textová pole „co baví / když nesouhlasí"; Doporučení, depistáž a rozhovory zůstávají
  read-only (vkládá školka). **Ano/ne otázky (léky, brýle) jsou checkboxy**; po zaškrtnutí se
  odkryje detailové pole (Jaké / Poznámka). Uložení mutuje `PROFIL[jméno]` + toast (demo, ztratí se
  reloadem). Textová pole `oninput` bez re-renderu (drží focus), checkbox/select/chips re-render.
- **Dokumenty ke stažení** – klik na řádek dokumentu (souhlasy i depistáž) vygeneruje soubor
  přímo v prohlížeči přes Blob: PDF = validní minimální jednostránkové PDF (`makePDF` – vlastní
  xref/trailer, text přepsán do ASCII, Helvetica nezná diakritiku), DOCX = textový stub s příponou
  `.docx`. Ověřeno: `%PDF-1.4` … `%%EOF`, xref přítomen.

**QA (dist):** desktop – profil ukazuje plná čísla, adresu, dokumenty se šipkou ↓; formulář se
skládá do 2 sloupců, uložení (alergie pyl, léky Zyrtec, pojišťovna OZP) se propíše do zobrazení.
Mobil 375 px – formulář 1 sloupec, chips/selecty/inputy bez přetečení (`scrollWidth === clientWidth`).
Konzole čistá. Matěj má odlišná data (brýle, alergie pyl, nespí). Dist rebuilt.

### 2026-07-20 – Platby: filtr faktur, stažení PDF, více neuhrazených, fond bez overlaye

Přestavba sekce Platby po dohodě s designérkou (nejdřív probráno, pak realizace). Struktura:
**vlevo** QR nejbližší neuhrazené + seznam faktur s filtrem; **vpravo** kulturní fond s rovnou
vypsaným čerpáním. Faktury i fond jsou **per dítě**.

- **Faktury ~3 roky (generované).** `genFaktury(cvar,cena,unpaid)` + `FAKT_MESICE`
  (`skolRok()` skládá Září–Červen po školních rocích 2023/24, 2024/25, 2025/26 do května 2026 –
  „dnes" je 3. 6.). 29 faktur/dítě, newest-first dle `t` (timestamp). Každá má `id`, `rok`,
  `vs` (variabilní symbol = dítě+měsíc), `splatnost`. Nahradily 3 ručně psané faktury.
- **Filtr rok + stav** (rozhodnutí: ne číslované stránkování). `<select>` školního roku
  (default aktuální) + chipy Vše/Neuhrazené/Uhrazené (stav `faktRok`/`faktStav` v core.js).
  Prázdný průnik → `.fempty`.
- **Více neuhrazených** (Eliška má 2: Duben + Květen 2026, Matěj 1). **Bez samostatné karty
  „K úhradě"** (designérka ji po zvážení zrušila jako duplicitu) – místo toho má **každá
  neuhrazená faktura v seznamu rovnou rozevřený `.pay-box`** (QR + částka + VS + splatnost);
  žádný toggle, žádný stav `payOpen`. Nad seznamem červený souhrn `.fakt-due`
  „K úhradě: N neuhrazené faktury · celkem X Kč"; neuhrazené řádky mají červený název (`.frow-due`).
  Chip **Neuhrazené je červený** (`.filters button.danger`, aktivní = červená výplň) – má nutit zaplatit.
- **Stažení faktury PDF** u každé faktury (`downloadFaktura` → `makePDF` s částkou/VS/splatností).
- **Fond ven z overlaye.** `renderFond`/`openFond` a globální `FONDLOG` **smazány**; čerpání je teď
  `child.fondlog`, zůstatek se **odvozuje** `fondCerpano()` (fond drží jen `rocni`, ne `cerpano` –
  jeden zdroj pravdy jako u náhrad). Overlay `fond` odstraněn z `core.js` (dispatch i topbar ttl).
  Fond má **vlastní QR „Přispět do fondu"** (VS `4920<dítě>00`) – rodič může dobrovolně přispět víc,
  zadá si vlastní částku v bance.
- **Sdílené PDF helpery.** `makePDF`/`downloadBlob`/`dlName`/`pdfAscii` přesunuty z `profil.js`
  do `shared.js` (používá profil i platby). `makePDF(title,lines)` teď bere víc řádků. `pdfAscii`
  navíc převádí úzké/nezlomitelné mezery (nbsp, narrow-nbsp…) na obyčejnou – jinak `kc()`
  (`toLocaleString`) dělalo v PDF „10-584" místo „10 584".

**QA (dist):** Eliška – souhrn „K úhradě: 2 neuhrazené faktury · celkem 21 168 Kč"; Květen a Duben
mají rovnou rozevřené QR (VS 4920 01 05 / 04). Fond QR VS 4920 01 00. Chip Neuhrazené aktivní =
červená výplň `rgb(176,73,47)`. Filtr 2023/24 + Neuhrazené → prázdný stav (vše zaplaceno). Matěj –
1 neuhrazená (souhrn v jednotném čísle), fond 1500. Faktura PDF ověřena přes pypdf (1 strana),
`kc()` v PDF ukazuje „10 584" (úzká mezera → obyčejná). Mobil 375 px bez přetečení. Profil dokumenty
po přesunu helperů dál fungují (8 tlačítek). Konzole čistá.

### 2026-07-20 – Rodič: nadpis sekce (H1) do topbaru, v řádku s přepínačem dítěte

Designérka: H1 sekce má být **v řádku s dropdownem pro výběr dítěte**, ne pod topbarem. Dřív každá
obrazovka renderovala `<div class="doch-head"><h1 class="dh-t">…</h1></div>` na začátek `#content`,
takže nadpis seděl pod (na desktopu skoro prázdným) topbarem.

- Nadpis se teď skládá v `renderHead()` (core.js) do topbaru (`#dashhead`, vedle `#kidsel`) – stejný
  slot, jaký už používal dashboard. Mapa `PAGEH` drží titulky sekcí; Přehled → `renderDashHead()`
  (datum + navigace), Profil → „Profil dítěte" + tlačítko „Upravit údaje", overlaye → prázdno
  (mají vlastní hlavičku v obsahu s „← Zpět").
- `.doch-head` odstraněn ze **všech** obrazovek (fotky, kalendar, platby, kontakty, plan, aktuality,
  dochazka, profil) – obsah začíná rovnou mřížkou. Profil tím ztratil velké jméno+avatar v obsahu;
  identita dítěte zůstává v přepínači (`Eliška ▾`), takže žádná duplicita.
- Desktop: H1 vlevo, přepínač vpravo (mezera přes prázdný `.ttl` flex:1). Mobil: dlouhý titul se
  zalomí pod řádek burger+přepínač (stejné chování jako dashboardová hlavička) – bez přetečení.

**Dotaženo napříč všemi appkami** (designérka: „H1 má být všude takto vysoko"):
- **Průvodce** dostal stejný vzor. Do topbaru přidán `#dashhead`, `render()` do něj skládá nadpis
  sekce (`dh-t`): Přehled → nový `renderPrehledHead()` (datum + kdo slouží), Novinky → „Novinky" +
  tlačítko „+ Nová novinka", ostatní → `TITLES[section]`. `.doch-head`/`.dash-head` odstraněny
  z prehled/dochazka/novinky; u Docházky zůstává v obsahu jen sloučené pole datum+Den/Týden
  (`renderDochNav`). Malý `.ttl` titulek se už nepoužívá (prázdný spacer).
- **Admin** už H1 v topbaru měl (`.ttl-a`, 22px, žádný nadpis v obsahu) – beze změny.
- **CSS:** bázové `.dashhead` (+ `:empty` + mobilní zalomení) přesunuto ze `screens-rodic.css`
  do `components.css` (sdílené oběma mobilními appkami); parent-specifické zůstalo (`.dh-edit`, `.kidsel`).

QA: průvodce – všech 9 sekcí má nadpis v topbaru (Přehled datum+podtitulek, Docházka + nav v obsahu,
Novinky + tlačítko otevírá formulář), obsah bez `#content h1`, mobil 375 bez přetečení. Rodič po
přesunu CSS beze změny. Admin „Přehled" v topbaru. Konzole čistá ve všech třech. Dist rebuilt.

### 2026-07-21 – Matěj happy stav, tématický plán z reálných plakátů, rozbalené kontakty

- **Platby Matěj:** `genFaktury('02',10584,[])` – vše uhrazeno (happy stav). Eliška má dál 2 neuhrazené
  (Duben, Květen) jako druhý, reálný scénář. Demo tak ukazuje oba stavy podle dítěte.
- **Tématický plán z reálných podkladů.** Designérka nahrála do `podklady/` plakáty, které průvodci
  vyrábějí a tisknou na nástěnku (`tematicky_plan_cerven_{1,2}.png`). Zmenšeny (720px, JPEG q80,
  ~66/56 KB) a zakódovány do **`src/scripts/tema-posters.js`** (`TEMA_POSTERS`) – nový sdílený soubor
  načtený jen mobilními appkami (`<script>` v `pruvodce.html` i `rodic.html`, ne admin). Tamtéž
  `PISNE_CERVEN` – všechny písničky/básničky z plakátu (text + odkaz na YouTube vyhledávání).
  - **Rodič Plán** přepsán: vlevo téma + písničky s „▶ Poslech" (proklik na YouTube), vpravo plakáty
    (`.tema-poster`). Nahradil dřívější placeholder „Teče voda / PDF".
  - **Průvodce Plán**: tile „Tématický plán v designu" ukazuje rovnou oba plakáty (aktuální vyvěšený
    plán) + tlačítko nahrát nový. `.tema-poster` je v `components.css` (sdílené).
- **Rodič Kontakty:** průvodci **rovnou rozbalení** (bez prokliku na overlay) – mřížka karet
  `.gcard` (avatar, rozvrh, Zavolat/Napsat/E-mail, telefon+e-mail). Overlay `openGuide` zůstává
  (používá ho dashboard „Průvodci dnes"). Školka jako druhá karta.

QA: rodič Plán 2 plakáty + 4 písničky s YT odkazy; Matěj 0 neuhrazených; kontakty 4 karty × 3 tlačítka;
plakát 720px validní JPEG (`data:image/jpeg`), mobil bez přetečení (plakát 311px). Konzole čistá. Dist rebuilt.

### 2026-07-21 – Profilové fotky místo avatarů, Helča → Darča

- **Helča → Darča** ve všech třech appkách (guides, GUIDESHIFT, novinka „from", admin porady/účastníci),
  vč. e-mailu (`darca@haj.cz`), zkratky (`abbr:'Da'`) a odvozených textů („uspává Darča"). Helča ve
  školce skončila; Darča má i fotku v podkladech.
- **Profilové fotky.** Designérka potvrdila: děti na fotkách jsou generované (ne reálné), fotky
  průvodců OK. 8 fotek z `podklady/fotky/` (gitignored) zmenšeno na čtvercové náhledy 220px (JPEG q80,
  ~9–13 KB, portréty cropnuté blíž k obličeji) a zakódováno do **`src/scripts/photos.js`**
  (`const PHOTOS`, klíč = křestní jméno). Načítá se jen v mobilních appkách (`<script>` v obou HTML,
  ne admin). Celkem ~88 KB.
- **`avatar()` (shared.js)** nově: když `PHOTOS[c.n]` existuje → `<img>` (kulatý přes `.av`
  `border-radius:50%`+`overflow:hidden`, `object-fit:cover`), jinak spadne zpět na generovaný SVG.
  Guard `typeof PHOTOS!=='undefined'` kvůli adminovi (fotky nenačítá). Mapuje se podle jména –
  ověřeno, že žádné dítě v rosteru se nejmenuje jako průvodce (kolize vyloučena); Eliška a Matěj
  v rosteru fotku dostanou (záměr).

QA: rodič kontakty 4 průvodci s fotkami (Darča/Gabča/Honza/Táňa), dashboard „Průvodci dnes" i přepínač
a hlavička s fotkou Elišky; průvodce roster = 2 fotky (Eliška, Matěj) + 20 generovaných (fallback).
Žádná „Helča" nikde (grep čistý). Mobil bez přetečení, konzole čistá ve všech appkách. Dist rebuilt.

### 2026-07-21 – Patička + SOS modal (hlášení chyb IS), akvarel přesunut k patičce

- **Patička** (jeden řádek, všechny tři appky): „IS Vhaaji · prototyp" + odkaz „Nahlásit chybu na IS".
  Statické markup v `*.html` (rodič/průvodce uvnitř `.scroll` za `#content`, admin v `.main` za
  `.content-wrap`). Styl `.appfoot` v `components.css`.
- **SOS modal** (nahlášení chyby na IS): statický `#sosScrim` v každém HTML, přepínaný `.on` přes
  `openSos()`/`closeSos()` v `shared.js` (+ Esc). Obsah: výzva k popisu, e-mail podpory
  `podpora-is@haj.cz` (mailto s předmětem), telefon, tlačítka Zavřít / Napsat e-mail. Nezávislé na
  per-app modal systému (admin žádný neměl). Mikrocopy dle appky: rodič vyká, průvodce tyká, admin
  impersonální. Styl `.sos-*` v `components.css`, vizuál sdílí `.modal`.
- **Akvarel přesunut nahoru → k patičce.** Jemný pruh, který byl dřív za horní hlavičkou (a byl
  odstraněn), je teď jako `.scroll::after` / `.main::after` **u patičky, stmívaný odspoda nahoru**
  (opacity .36, maska). Plný měkký hero (`--wc-band`, 42 KB) přidán do `watercolor.css` vedle
  brand cropu. Data (obsah) zůstávají nad washem (`z-index`), text patičky čitelný.

QA: patička + SOS ve všech třech appkách (rodič/průvodce/admin), modal se otvírá a zavírá,
mailto funguje, wash jemně stoupá od patičky. Mobil bez přetečení, konzole čistá. Dist rebuilt.

### 2026-07-21 – Menu: světlejší pozadí + čárové ikony místo emoji

- **Pozadí menu** (drawer/sidebar) změněno z `--color-bg` na `--color-surface` (stejné jako karty,
  o něco světlejší) – v `layout.css` (`.drawer`) i `layout-admin.css` (`.sidebar`).
- **Ikony menu**: emoji (◆▲✓…) nahrazeny **čárovými SVG ikonami** (Lucide styl, `stroke=currentColor`
  → obarví se dle barvy položky: neaktivní tmavá, aktivní zelená; „barevnost přizpůsob"). 8 ikon
  převzato z `podklady/icon/` (prehled, novinky, dochazka, profil, platby, tematicky-plan, fotky,
  kontakty), 6 dokresleno ve stejném stylu (kalendar, clock=pruvodci, smile=deti, coins=fond,
  clipboard=porady, refresh=nahrady). Nový sdílený `src/scripts/icons.js` (`ICON_SVG`, mapa
  `ICON_KEY` klíč sekce→ikona, `icon(key)`), načtený ve všech třech appkách po `shared.js`.
  `renderDrawer`/`renderSidebar` volají `icon(s[0])||s[2]` (fallback na emoji). Velikost 20px,
  neaktivní opacity .72, aktivní 1 (`components.css`).

QA: 9 SVG ikon v menu rodiče i průvodce, 5 u admina; aktivní položka zeleně, ostatní tmavě; drawer/
sidebar bg = surface (#F9F7F1). Mobil i desktop, konzole čistá ve všech třech. Dist rebuilt.

### 2026-07-21 – Oprava: rozbalený kalendář/přepínač v hlavičce mizel pod obsahem

Regrese z footer-washe: `.scroll>.topbar` i `.scroll>#content` dostaly `z-index:1`, čímž se topbar
stal stacking kontextem a jeho absolutně poziciovaný `.daypicker` (z-index:9) se „uvěznil" pod
`#content`. Oprava: topbar má `z-index:5` (nad obsahem), obsah/patička `z-index:1` (nad washem).
Totéž pro admin `.main>.topbar-a`. Kalendář i přepínač dětí se opět vykreslují nad kartami.

### 2026-07-21 – Tématický plán: navigace po měsících + zvětšení/stažení plakátu

- **Navigace po měsících** (rodič): stepper ‹ Měsíc Rok › omezený na **aktuální školní rok**
  (Září 2025 → Červen 2026; `TEMA_MESICE` v `tema-posters.js`, stav `planIdx`, `stepPlan`).
  Plný obsah (plakát + písničky) má v prototypu jen **červen** (`full:true`); ostatní měsíce ukážou
  hodnotu měsíce (demo) + prázdný stav „plakát není v prototypu k dispozici". Hranice: na začátku/konci
  roku je šipka disabled.
- **Plakát ke zvětšení i stažení**: `.poster-btn` (klik → `openPoster(i)` → `openLightbox`) s odznakem
  ⤢. Lightbox (`#lbScrim` v HTML, `openLightbox/closeLightbox` v `shared.js`, styl v `components.css`)
  ukáže plakát přes celou obrazovku + tlačítko „Stáhnout ↓" (download data-URI). Zavření klikem/Esc.
  Zapojeno i v průvodcovském plánu (plakáty tamtéž).

QA: rodič plán default Červen 2026; krok zpět Květen → prázdný stav; hranice Září (prev)/Červen (next)
disabled; lightbox otevře plakát + stažení `tematicky-plan-cerven-1.jpg`. Mobil bez přetečení, konzole
čistá. Dist rebuilt.

### 2026-07-21 – Kontakty: reálná jména, bez boxu v boxu, Dubánek, @vhaaji.cz; zrušen detail průvodce

- **Bez vnějšího boxu.** Sekce „Průvodci" už není `.tile` obalující karty (bylo „boxy v boxu") –
  nadpis `.k-sec` + přímo mřížka `.gcards` s kartami `.gcard`.
- **Skuteční průvodci** (9): plná jména + telefony dle reality (Tereza Vavrečková, Gabriela
  Vašíčková, Darina Mikolášová, Helena Peterková, Honza Kolář, Ksenia Andramanova, Eva Sionová,
  Michaela Hrubínová, Táňa Kynclová). `GUIDES_TODAY` přemapován (Táňa/Darina/Honza/Gabriela),
  „uspává" se derivuje (Darina). Ze schedule/abbr sešrotováno – karta ukazuje jen jméno + kontakt.
- **Fotky per jméno přes `photo`.** `avatar()` bere `PHOTOS[c.photo||c.n]` (jméno se v kontaktech
  změnilo na plné, foto se drží klíčem). Kdo nemá fotku (Tereza, Helena, Eva) → generovaný avatar.
- **Školkový kontakt s Dubánkem** (maskot): avatar z `podklady/fotky/dubanek.png` (crop hlavy,
  `DUBANEK` v `photos.js`). Mail **jsme@vhaaji.cz**, telefon **+420 603 200 512**.
- **Všechny e-maily → doména `@vhaaji.cz`** (parent guides, průvodce guides/SCHOOL, SOS podpora).
- **Detail průvodce zrušen.** `renderGuide`/`openGuide`/overlay `guide` odstraněny; dashboard
  „Průvodci dnes" nově prokliká na sekci Kontakty (`go('kontakty')`), ne na neexistující detail.

QA: 9 karet reálných jmen, 6 fotek + 3 generované avatary, Dubánek u školky, jsme@vhaaji.cz /
603 200 512; „Průvodci" bez vnějšího boxu; dashboard uspává Darina, proklik → Kontakty. Grep na
@haj.cz čistý. Mobil bez přetečení, konzole čistá. Dist rebuilt.

### 2026-07-21 – Kontakty doladění: bez Heleny, Dubánek jako obrázek, menší buttony u školky

- **Helena Peterková** odebrána z průvodců (8 karet); `GUIDES_TODAY` přemapován na [7,2,3,1].
- **Dubánek** už není v kolečku – vložen jako **obrázek po hrudník** (`.dubanek-img`, portrét, nový
  crop hlava→hrudník v `photos.js`); podtitulek „Dubánek · školkový skřítek" **smazán**.
- **Buttony u školky** (Zavolat/E-mail) zmenšeny (`flex:0 0 auto`) na velikost jako u průvodců;
  školková karta je flex řádek [obrázek | jméno + kontakt].

---

## 12. 8. 2026 – Jídelníček v průvodcovské appce (HYPOTÉZY, ne rozhodnutí)

Sekce Jídelníček přidána do průvodcovské appky; data přesunuta z `rodic/data.js` do `shared.js`
(týž dodavatel pro obě appky = jeden zdroj). Doplněny dva květnové týdny, aby listování zpět
vedlo někam – aktuální týden byl v datech první.

**Dvě funkce na obrazovce jsou vědomé hypotézy, ne schválená rozhodnutí:**

1. **Počítadlo opakování svačiny** (`↻ 6×`) – počítá výskyty přesného názvu napříč všemi týdny
   v datech. Vzniklo z domněnky, že svačinářku zajímá četnost. Známé slabiny: chybí jmenovatel
   (6× z kolika?), počítá i budoucí týdny, porovnává přesný text (pečivo s Lučinou ≠ pečivo se
   sýrem, i když obojí je pečivo).
2. **Jména dětí místo čísel alergenů** – vzniklo z domněnky, že dohledávání alergií zdržuje.

Obojí stojí na tom, že **s žádnou svačinářkou zatím nikdo nemluvil**. Ponecháno v prototypu
záměrně – reakce při testování řekne víc než abstraktní dotaz –, ale **nesmí se to vykládat jako
schválená funkce**. Otázky k ověření: `docs/vyzkum-svacinarka.md` (5 otázek, stačí dvě svačinářky).

Rozhodnout až podle nálezů, v rámci fáze 5.2.

## Pozdní omluvenka = omluveno, ne neomluveno (nález z testování, kolo 1)

**Nález:** respondentka omluvila dítě na dnešek (tedy po deadlinu) a appka den označila
**„Neomluveno"**. Formulace čte jako obvinění: *„Já to omluvila, ale pozdě."*

**Šlo o rozpor s vlastním modelem**, ne o překlep v textu. `objekty-systemu.md` říká:
*„Omluvenka odeslaná po deadlinu **projde** (dítě je omluvené), jen bez náhrady."* Kód ale
zakládal omluvenku se stavem `po-deadlinu` a zároveň zapisoval do docházky kód `NE`.

**Rozhodnutí:** pozdní omluvenka zapisuje `OM` jako každá jiná. Rozdíl mezi včasnou a pozdní
nese **důsledek**, ne přejmenování stavu:

- včas → **Včas** – s náhradou
- po termínu → **Po termínu** – bez náhrady

Formulace vznikla při ladění: slovo „Omluveno" nese kód nad tím, druhý řádek proto neopakuje
stav, ale říká jen to, čím se den liší (tučně) a jaký to má důsledek (normálně).

`NE` zůstává v číselníku pro případ, kdy rodič neřekl nic — rodičovská appka ho ale sama
nikdy nenastaví (to může jen škola).

**Vedlejší efekt:** dashboard teď po odeslání explicitně říká, jestli náhrada vznikla. Testovací
scénář se přesně na tohle ptá („ví po odeslání, jestli vznikla náhrada?"), takže další kolo
ukáže, jestli to stačí.

## Omluvenka se otevírá z dashboardu, ne přes Docházku (nález z testování, kolo 1)

**Nález:** tlačítko „Omluvit na …" na dashboardu volalo `goEditDay()`, které přepnulo sekci na
**Docházku** a otevřelo den v kalendáři. Respondenti nevěděli, kde skončili.

**Rozhodnutí:** omluvenka je **modal**, ne překryvná stránka. Flow je
`dashboard → Omluvit → modal → uložit → nový stav rovnou na dashboardu`; sekce se nemění,
takže z Docházky se vrátíš do Docházky. Potvrzovací mezikrok („Omluvenka odeslána" na celou
obrazovku) tím odpadl – co se stalo, shrne toast a hlavně **nový stav pod modalem**.

**Vedlejší nález:** `goEditDay()` zapisoval jen kód docházky, ale **nezakládal omluvenku** –
den se tvářil jako omluvený, ale nevznikl záznam ani náhrada a na dashboardu chyběl řádek
o důsledku. Teď vzniká vždy.

## Docházka: jeden slovník stavů a zápis jen pro vedoucí roli (nálezy z testování s průvodci)

Zdroj: [vyzkum-testovani-pruvodci.md](vyzkum-testovani-pruvodci.md), nálezy **P2** a **Z1**.

**Z1 – zápis docházky patří vedoucí roli.** Prototyp pouštěl zápis dnešního dne komukoli;
řadový průvodce to při testu potvrdil („šlo mi to měnit… ale nedělal jsem to, protože nemám
proč") a o právo nestojí. Ve školce docházku zapisuje vedoucí průvodce a hospodářka, ostatní ji
kontrolují. Přibylo právo `smiZapisovat()` (= role není `pruvodce`) a `denEditovatelny()` se o něj
nově opírá. Řadový průvodce nemá v seznamu zaškrtávátko (na jeho místě je text **ve školce** /
**absence**), řádek se mu nerozklikává a všechny zápisové handlery mají tvrdou pojistku —
právo se nekontroluje jen v šabloně. `smiJinyDen()` zůstává navíc jen vedoucímu (proběhlé
a budoucí dny).

**P2 – jeden slovník napříč appkou: přítomni · dopolední · odpolední · absence.**
Vzniklo z jediného skutečného zaseknutí v celém testování: respondentka odškrtla políčko
u spícího dítěte, nevěděla, co způsobila, ani jak to vrátit („Když to odškrtnu a je tam spí,
tak to přesně evokuje to, že nespí"). Změny:

- záložky `Ráno → Přítomni` (číslo platí celý den, ne jen ráno), `Po obědě → Dopolední`
  (popisovalo důsledek místo režimu docházky), `Nepřítomní → Absence`;
- **„Spí" zůstává** — spáči v maringotce jsou provozní fakt, ne režim docházky. Respondentka je
  ve svém modelu ztotožnila s odpolední docházkou, ale data je vedou zvlášť a přejmenování by
  lhalo o tom, co číslo počítá;
- zaškrtávátko dostalo `role="checkbox"`, `aria-label` a title, který říká **oba směry**
  („odškrtnutím zapíšeš absenci" / „zaškrtnutím vrátíš do školky"), a záložka Spí k tomu má
  vysvětlující větu. Toast nově pojmenuje výsledek slovy: **„Meda Nováková → absence"**;
- `neomluveno → absence bez omluvy`, `omluveno → omluveno průvodcem` (druhý respondent se ptal,
  proč u rodičovské omluvy stojí „omluveno rodičem", když u té školkové není původce vidět);
- stejný slovník i na dashboardu a v legendě týdenního přehledu.

**Vědomě neuděláno:** zaškrtávátko zůstává zaškrtávátkem. Nahradit ho pojmenovaným přepínačem
(„tu / není") je vizuální rozhodnutí a patří designérce, ne do opravy nálezu.

## 2. 9. 2026 – Kanály: tři živé WA skupiny místo šesti typů (rozhodnutí)

Zdroj: [vyzkum-whatsapp.md](vyzkum-whatsapp.md) — obsahová analýza skupiny „Rodiče vhaaji"
(1 080 zakódovaných zpráv, 27. 7. 2024 – 27. 8. 2026) a časová analýza z exportu (1 180 zpráv).

Skupiny se nově dělí podle toho, **kdo v nich je**, ne podle tématu — protože v okamžiku psaní
si člověk vybaví adresáta, ne kategorii. Že samotné „na tohle máme jinou skupinu" nefunguje, je
v datech doloženo: skupina *Vhaaji – rady, tipy* existuje minimálně od srpna 2025 a ztráty
a nálezy stejně zůstaly ve velké skupině.

1. **Vhaaji (všichni)** — připomínky akcí a rychlé změny. Píše jen školka, neodpovídá se.
2. **Rodiče vhaaji (bez průvodců)** — hlídání při zpoždění, ztráty a nálezy, akce po školce,
   rady a tipy.
3. **Rodičovské skupiny** (rodina + průvodci + Terka) — důvěrná komunikace, schůzky.
4. **Rady a tipy** — dožívá; nahrazuje ji dvojka. Zůstane nanejvýš pro rodiny, které už
   v haaji nejsou. Nic se do ní nestěhuje.

**Jednička musí zůstat záměrně chudá.** Časově kritické je jen to, kde pozdní přečtení stojí
rodiče cestu navíc — *„Horo dnes bylo kvůli soukromé akci v džungli zrušeno."*, *„Nabrali jsme
na výletě zpoždění, vyzvedávání prosím o deset minut později."* Když do stejné skupiny půjde
i jídelníček a výzvy k podepisování věcí, lidé si ji ztlumí a kritická zpráva zapadne s nimi.
Cíl je jedna až dvě zprávy týdně, všechno ostatní jen ukazatel do intrawebu.

**Tvrdé pravidlo u předávání dítěte.** Domluva o hlídání při zpoždění probíhá ve dvojce, kde
průvodci nejsou — ale výsledek *„dnes ho vyzvedne X"* musí skončit ve trojce (nebo později jako
poznámka u docházky). Jinak si dítě odvádí někdo, koho průvodce nečeká. Je to jediné místo
struktury, kde chyba není nepohodlí, ale bezpečnost. Školka o to dnes prosí ručně: *„Pokud Vaše
dítko vyzvedává jiný rodič, napište nám o tom prosím předem."*

Právní stránku tím nikdo neřeší a řešit nemůže — zpráva není podpis. Patří k tomu **stálé
pověření podepsané u zápisu** (seznam osob, které dítě vyzvedávat smí); denní zpráva pak jen
vybírá z už schválených lidí. Dnes to běží ad hoc: *„Fedorek bude s chůvou (Julia)"* a jméno té
osoby se doupřesňovalo až v chatu.

**Pořadí zavádění.** Nejdřív nástěnka ztrát a nálezů v intrawebu, teprve pak přesun zbytku do
dvojky. Obráceně to neuspěje: dokud rodič nemá jak zjistit, jestli je věc u školky, půjde tam,
kde je větší šance na odpověď. Nástěnka zároveň dělá rozcestník — když věc není v systému, rodič
tím ví, že u školky není, a je to případ pro dvojku.

**Vědomě neuděláno:**

- **Nezakládá se čtvrtá paralelní skupina** „Rodiče vhaaji bez průvodců" *vedle* stávající velké.
  Zadáním je roztříštěnost (šest typů skupin, deset tabulek); přidání dalšího kanálu jde proti
  ní. Dvě skupiny s téměř shodným členstvem lidé nerozliší a údržba se zdvojí — každý srpen se
  odebírá 8–14 lidí a školka u části skupin ani nemá správcovská práva.
- **Kroužkové a dočasné skupiny se neruší.** Tanečky, Shaun a plavání mají v sobě lidi mimo
  Vhaaji; skupiny k akcím (ŠVP, tábor) zanikají samy. Komunikovat se to má jako **tři stálé
  skupiny, kroužky zvlášť, akce dočasně** — ne jako „máme tři skupiny", aby jich za rok nebylo
  zase šest.
- **Zátěž průvodců se tímto neměří.** Analýza vidí jen velkou skupinu. Rodinné skupiny, kde
  školka inzeruje dostupnost 7–20 hodin, jsou mimo záběr a skutečná zátěž je pravděpodobně tam.

## Informace pro průvodce v rodičovské appce (návrh z analýzy WA skupiny)

**Problém:** rodič nemá v systému kam napsat „dnes vyzvedne babička" / „přijdeme v 9:30" /
„má v batohu kapky". Píše to do WhatsAppu, kde se to ztratí dřív, než na to při předávání
dojde řeč. Průvodci měli dodat seznam toho, co rodiče do skupin nejčastěji píšou; místo toho
se vycházelo z obsahové analýzy rodičovské skupiny (1080 zakódovaných zpráv, dva školní roky).

**Co z dat plyne.** Rodičovské zprávy mají dvě denní špičky, **8:00 a 14:00**, a obě padají na
předání dítěte. Podle podílu na rodičovských zprávách: ztráty a nálezy 24,6 %, komunitní
výpomoc 20,9 %, akce 18,8 %, vyzvedávání 7,7 %.

**Rozhodnutí — co do vzkazu patří a co ne.** Nabídnuté typy jsou jen ty **jednosměrné,
vázané na jeden den a jedno dítě**: vyzvedne někdo jiný (jako jediný vyžaduje jméno),
přijdeme později, vyzvedneme dřív, zdravotní informace, vybavení, jiné.

**Ztráty a nálezy — největší téma rodičů — tu vědomě nejsou.** Jsou obousměrné (66 % zpráv
od rodičů, 34 % od školky) a hodnota je právě v tom, že se ozve *jiný rodič*. Vzkaz průvodcům
to nenahradí; na to patří nástěnka s fotkou a „to je naše" — samostatná věc, ne tohle.
Totéž platí pro komunitní výpomoc a parkování/sousedy.

**Není to omluvenka.** Docházku vzkaz nemění a nemá deadline — vzkaz na dnešek dává smysl
i v 7:50 ráno. Vzorec je jinak shodný: modal nad tím, kde rodič právě je, po odeslání se
zavře a nový stav je vidět pod ním.

**Na straně průvodce jedna dlaždice, ne dvě.** Vzkazy se slily do stávající karty poznámek,
která se přejmenovala na „Informace od rodičů": dnešní vzkazy nahoře (s časem odeslání),
trvalejší zdravotní/provozní poznámky pod nimi. Dva samostatné boxy poznámek od rodičů na
jednom přehledu by byly přesně ta roztříštěnost, kterou odbouráváme.

**Model je ve `shared.js`** (`ZPRAVA_TYPY`, `zpravaShrnuti`), protože se na tutéž věc dívají
obě appky. Data ale nadále nesdílejí — u průvodce jde o zobrazení ze seedu, stejně jako
u `parentExcuse`.

**Otevřené:** notifikace (rodič nevidí, že si to průvodce přečetl), vzkaz na víc dní najednou,
a jestli má mít průvodce možnost odpovědět — zatím ne, jinak z toho vznikne druhý chat.

## Přehled průvodce: ranní řada nahoře (10. 9. 2026)

Vzkazy od rodičů byly ve třetím sloupci vedle rozpisu služeb – průvodce je při ranním
pohledu na telefon míjel. Přesun pod docházku problém vyřešil, ale rozhodil sloupce
(811 / 641 / 246 px).

**Rozhodnutí:** na desktopu je nahoře **ranní řada přes celou šířku** – počty docházky ·
informace od rodičů · kdo nepřijde. Je to jeden okamžik dne a průvodce ho má přečíst
najednou. Pod ní teprve kontext dne ve sloupcích (program + akce · básnička · průvodci).
Sloupce jsou po změně 307 / 355 / 246 px. Na mobilu se řada stohuje, pořadí se nemění.

**Zrušeny červené poznámky na dashboardu** (`.rnote` se `c.note`). Trvalejší poznámka
o dítěti není zpráva o dnešku; zůstává u dítěte v Docházce a v profilu.

**Opravena chyba:** v `renderPrehled` chyběla proměnná `opener`, takže výraz sahal na
`window.opener` (standardní globál, normálně `null`) a značka „otevírá" se v seznamu
průvodců na dashboardu nikdy neukázala. V hlavičce dashboardu byla počítaná správně,
proto si toho nikdo nevšiml.

**Ranní řada je jeden rámec, ne tři karty.** Tři karty vedle sebe nutí oko zastavit třikrát,
i když jde o jeden okamžik. Na desktopu je tedy jedna plocha rozdělená tenkými svislými
linkami; vlastní nadpisy zůstávají, protože pojmenovávají tři různé věci. Pod 900 px se
rámec neuplatní a zůstávají samostatné karty – na mobilu se stohují pod sebe a hranice
karty je tam to jediné, co je odděluje.

## Obědy z přehledu pryč, kuchyně dostane vlastní roli (10. 9. 2026)

Dlaždice „Obědy" na průvodcovském přehledu ukazovala `c.pres`, tedy **počet přítomných dětí,
ne počet obědů** – proto tam byla dvakrát stejná dvaadvacítka a proklik vedl na záložku
„Přítomni". V běžném režimu docházky se obědy vůbec nepočítají (záložka `obed` existuje jen
v režimech předškoláci/lezci). Věcně to sedět nemůže: dítě na dopolední docházce oběd sní
a odejde, omluvené dítě si oběd může vyzvednout (rodičovská appka se na to ptá).

**Rozhodnutí:** dlaždice pryč. Falešné číslo v prototypu, který jde na testování, je horší
než chybějící. **Souhrn pro kuchyni (obědy, svačiny) – nález P3 z testování, 2 ze 3 –
dostane vlastní roli s vlastním pohledem** (Ksenia, obědy a svačiny), ne dlaždici
v průvodcovském přehledu. Zbylá čtyři čísla jsou v mřížce 2×2; ve flexu se lámala 3+1
a absence zůstávala sama na řádku, jako by byla jiná kategorie.

## Přehled průvodce: čísla podle slovníku z testování (10. 9. 2026)

Nález **P2** skončil dohodnutou sadou **přítomni · dopolední · odpolední · absence** (varianta
s časy respondentkou odmítnuta). V kódu je ten slovník i zapsaný v komentáři u `inTab`, ale
**„odpolední" na přehledu i mezi záložkami Docházky chybělo** – a naopak tam jako rovnocenné
číslo bylo „spí", které v dohodnuté sadě není a je to ta věc, u které se respondentka zasekla.

**Rozhodnutí:** přehled ukazuje čtyři čísla ze slovníku (22 · 2 · 3 · 3); **spinkání je řádek
pod nimi**, ne pátá dlaždice – je to jiná osa (kolik lehátek v maringotce), ne stav docházky.
Do Docházky přibyla odpovídající záložka **Odpolední** (`inTab` + `CTX`), aby proklik z čísla
někam vedl a slovník byl úplný na obou obrazovkách.

**Poctivá výhrada:** dohodnutá sada padla nad pojmenováním stavů u dítěte, ne nad tím, která
čísla patří na dashboard. Chybějící „odpolední" je doložený nesoulad slovníku, ne doklad,
že respondenti tu dlaždici vyžadovali.

**Dlouhé vzkazy od rodičů se krátí na tři řádky** s odkazem „celý vzkaz ›". Jeden odstavec
od jednoho rodiče zvedl ranní řadu z 287 na 550 px a protože rámec sjednocuje výšku sloupců,
zbylo pod počty i pod nepřítomnými skoro 300 px prázdna. Se zkrácením 411 px. Práh je na délce
textu (140 znaků), ne na změřeném přetečení – `render()` staví HTML jako řetězec, takže
v tu chvíli není co měřit.

## Ranní řada: výšku drží docházka, zbytek roluje (10. 9. 2026)

Rámec sjednocuje výšku sloupců, takže nejdelší obsah natáhl celý vršek obrazovky – jeden
ukecaný rodič nebo nemocná třída a průvodce musí rolovat, aby viděl počty.

**Rozhodnutí:** výšku řady určuje **dlaždice docházky** (má pevný obsah: čtyři počty, řádek
spinkání, tlačítko). Vzkazy od rodičů a seznam nepřítomných se do téže výšky **rolují uvnitř**
(`.dash-scroll`, `--dash-h:274px` = 329 px dlaždice − 24 px padding − 31 px nadpis). Ověřeno
zátěží: 12 vzkazů a 12 nepřítomných – řada zůstává 341 px. Pod 900 px se strop neuplatní,
na mobilu se stohuje a roluje celá stránka.

**Pořadí a barvy počtů.** Nahoře **Přítomni · Absence** (na to se průvodce ptá ráno jako první),
pod nimi rozpad dne **Dopolední · Odpolední**. Barva nese význam přes stavovou paletu:
absence `--state-danger-ink`, dopolední/odpolední `--state-neutral-ink`, přítomni zůstávají
značkově zelení. Kontrast ověřen skriptem: 5,10 / 5,62 / 8,24 : 1 – všechno projde AA
i pro běžný text, nejen pro velká čísla.

**Podnadpis** má dvojtečku a čárky: „Dnes ve školce: Táňa (otevírá), Darča, Honza, Míša."

**Sloupce pod ranní řadou** (10. 9. 2026): zleva **průvodci ve službě · básnička · program dne
+ dnešní akce**. Tým sedí pod docházkou, se kterou souvisí; kontext dne je vpravo.
Prohození dělá CSS `order` na `.dash-swap`, **ne pořadí v DOM** – na mobilu dál platí
priorita „soupisu dne" (program dne dřív než rozpis služeb).

## Docházka: u dítěte je vidět všechno, co dnes přišlo od rodiče (10. 9. 2026)

Vzkazy z rodičovské appky a volný text z omluvenky končily jen na přehledu, respektive
nikde – průvodce u konkrétního dítěte je neviděl. Teď jsou v soupisu docházky **na řádku
dítěte** i v rozbaleném detailu:

1. **vzkazy na dnešek** (kdo vyzvedne, pozdější příchod, lék) – tlumeným tónem
   (`.rnote-info`, `--wash-primary`), je to provozní informace, ne varování;
2. **poznámka z omluvenky** („K omluvence: …") – to, co rodič napsal do pole
   „Poznámka pro průvodce" při omlouvání; v seedu ji nese `parentExcuse.pozn`;
3. **trvalá poznámka o dítěti** – beze změny, v danger tónu.

Červená tak zůstává rezervovaná pro nemoc a absenci.

**Řazení soupisu** bere nahoru všechny děti, u kterých je dnes co číst (dřív jen ty
s trvalou poznámkou). **Dlouhé vzkazy se krátí na tři řádky** stejně jako na přehledu,
jinak jeden odstavec odtlačí zbytek soupisu pod okraj obrazovky (měřeno na mobilu:
188 px zkrácený řádek vs. 296 px rozbalený).

Data se dál nesdílejí – u průvodce jde o zobrazení ze seedu, stejně jako u `parentExcuse`.

**Poznámka z omluvenky je i na dashboardu** (10. 9. 2026), v „Kdo dnes nepřijde", vlastním
řádkem pod jménem. Samotné „nemoc" neřekne, jestli má průvodce čekat zvracení, teplotu nebo
vyrážku – a právě tohle rodič do omluvenky píše. Důvod zůstává vpravo u stavu, v textu se
neopakuje; řádek je tlumený, červená drží stav (omluveno / bez omluvy), ne upřesnění.

## Po 8:30 omlouvá vedoucí průvodce, vždy bez náhrady (10. 9. 2026, NÁVRH k odsouhlasení)

**Pravidlo (od Lenky):** po **8:30**, kdy začíná program, už rodič absenci na dnešek
nenahlásí. Od té chvíle ji zapisuje ručně **vedoucí průvodce** a je to vždy
**„omluveno bez náhrady"**.

Tím vznikají tři různé absence, které se dosud slévaly do dvou:

| Stav | Kdo zapsal | Náhrada |
|---|---|---|
| omluveno rodičem | rodič ve své appce | podle deadlinu 20:00 předchozího dne |
| omluveno vedoucí | vedoucí průvodce po 8:30 | **nikdy** |
| absence bez omluvy | nikdo – dítě nepřišlo a zatím to nikdo nezapsal | – |

V průvodcovské appce jsou všechny tři vidět na přehledu i v soupisu docházky
(`guideExcuse={by,time,reason,pozn}` vedle `parentExcuse`). „bez náhrady" je u ní odznáček,
protože je to důsledek, ne stav.

**Dořešeno 10. 10. 2026:** simulovaný čas rodičovské appky je 7:40 (rodič smí nahlásit dnešní
absenci). Po 8:30 (`poZacatkuProgramu`) se tlačítko nahrazuje větou „Program už začal – dnešní
absenci zapíše vedoucí průvodce. Zavolejte prosím do školky, nebo pošlete průvodcům informaci
níže." – míří na kartu Informace pro průvodce, ne do WhatsAppu. Před 8:30 je pod tlačítkem
připomínka „lze nahlásit do 8:30".

**(Původní poznámka)** v rodičovské appce je simulovaný čas
`NOW={d:3,h:10}`, tedy **10:00 – po 8:30**. Podle nového pravidla by tlačítko „Nahlásit dnešní
absenci" nemělo jít použít a celý ten tok by z prototypu zmizel. Buď posunout `NOW` před 8:30,
nebo rodiči ukázat zavřený stav („Po 8:30 už absenci nenahlásíte, ozvěte se průvodcům").

## Důvod absence je povinný a vybírá se z číselníku (10. 9. 2026, rodičovská appka)

Číselník `DUVODY`: **nemoc · rodinné důvody · dovolená · jiné**. Platí ve všech třech místech,
kde rodič absenci zadává – omluvenka, nahlášení dnešní absence i editor dne v Docházce.
Select **nemá předvolbu** („Vyberte…"), jinak by většina omluvenek odešla jako „Nemoc"
jen setrvačností. Bez důvodu se neuloží nic, hláška je „Vyberte důvod absence".

**„Dovolená" je nová** – výzkum s průvodci ji jmenoval jako reálnou kategorii
(navržený kompromis u sporu o povinný důvod). **„Jiné" zůstává schválně:** vynucený výběr
bez únikové kategorie nevyrábí lepší data, jen nepravdivá.

Důvod se ukládá i **ke konkrétnímu dni** (`child.duvody[den]`), ne jen do omluvenky – editor
docházky ho pak umí ukázat a doplnit u dne, který omluvenka nezaložila.

**Pozor na rozpor s výzkumem:** povinný důvod je **sporné téma**, ne shoda. Z testování
s průvodci: dva pro, jeden proti; rodiče z dřívějšího testu také proti. Věcný důvod pro
povinnost je zákonná povinnost hlásit infekční onemocnění, kterou tým podle dvou respondentů
dlouhodobě nedodržuje. Tohle je **rozhodnutí zadavatelky**, ne závěr z dat – a v dalším kole
testování stojí za to sledovat, jestli rodiče nezačnou volit „Jiné" paušálně.
Nezavedena zatím druhá část navrženého kompromisu: *upřesnění povinné jen u nemoci*.

## P1: co vidí rodič a co jen tým (29. 9. 2026)

**Nález (3 ze 3, nezávisle):** interní záznamy o dítěti musí být oddělené od toho, co vidí rodič.
**Stav před změnou:** u průvodce jeden nerozlišený blok záznamů; **rodič přitom viděl i vstupní
depistáž** a logopedický screening – tedy právě „interní diagnostický formulář, který rodičům
nepatří".

**Rozhodnutí:** profil dítěte u průvodce má dvě zóny – **„Vidí rodiče"** a **„Jen pro tým"**
(okrově podbarvená, čárkovaný okraj, věta „Rodič tohle nikdy neuvidí").

- Každý dokument nese `sdileno`; **výchozí je vždy interní**, sdílí se vědomým krokem
  („Sdílet s rodiči" / „Přestat sdílet"). Důvod: odborné zprávy se před předáním upravují.
- **Záznam z konzultace má dvě pole** – co se s rodiči domluvilo (uvidí rodiče, povinné)
  a interní poznámka (jen tým). Obava „jak to rodič přečte" se řeší v okamžiku psaní.
- **Poznámky týmu** – samostatné, vždy interní; místo pro upřímné poznámky o spolupráci s rodinou.
- **Rodič** vidí jen sdílené: „Hodnocení od průvodců" (čtvrtletní hodnocení) a domluvy
  z konzultací. Depistáž ani pozorování už ne.

**Dořešeno 29. 9. 2026:**
- **Sdílet s rodiči smí kdokoli z týmu** – zatím, dokud se neukáže důvod to omezit.
- **Ani jedna část záznamu z konzultace není povinná** (stačí jedna z nich) a **záznam jde
  upravit** – průvodce se k němu průběžně vrací, domluvu často dopisuje až po poradě. Záznam
  bez domluvy nese v interní zóně upozornění „rodič z konzultace nic nevidí".

**Otevřené:** legislativní bod o jménech dětí ve veřejné části třídnice se týká třídnice,
která je zatím odložená.

## P5: alergie – porce v jídelníčku, jména na papír (29. 9. 2026)

**Nález (2 ze 3):** alergie se špatně hledají a jsou na nevhodném místě. Dvě různé příčiny:
- **Nenašel je** – hledal je v jídelníčku, byly v Dětech; došel tam až po nápovědě.
- **Jména u jídel nesedí do kontextu.** Kuchyň u přípravy potřebuje vědět, *kolik porcí bez
  čeho*; jména řeší až u výdeje, kdy se do mobilu nekouká – mají je vyvěšená na papíře.
  Jméno u jídla navíc čte, jako by to jídlo dostalo jen to dítě.

**Rozhodnutí – ruší dřívější „jména dětí místo čísel alergenů" v jídelníčku průvodce:**
- u jídla štítek **„bez mléka · 5 porcí"**, žádná jména; náhradu kuchyň píše dál do názvu
  jídla („Pečivo (1× bez sóji)"), jak to dělá dnes;
- **„Kdo má jakou alergii ›"** přímo v jídelníčku – vede do Dětí s filtrem Alergici, tedy tam,
  kde to průvodce hledal;
- v Dětech → Alergici tlačítko **„Seznam na výdej (PDF)"** – ten papír na zeď.

Souhrn pro kuchyň (kolik porcí dnes, pro přítomné děti) patří do role Kuchyň.

## P4: vlastní seznamy dětí (29. 9. 2026)

**Nález (2 ze 3, jeden doložen chováním):** průvodce v docházce hledal, kdo z nepřítomných je
předškolák, a nepoznal to („teď nepoznám z hlavy, který z nich je předškolák"); druhá
respondentka to zobecnila – vlastní seznamy (horolezci, kroužky).

**Rozhodnutí:** `SEZNAMY` – Předškoláci a Horolezci se odvozují z karet dětí, další si tým
zakládá sám („+ Nový seznam": název + zaškrtnutí dětí).
- **Děti:** seznamy jsou další filtry vedle Všechny / Alergici, s počty.
- **Docházka (dnes):** výběr „Seznam" nad soupisem funguje jako druhý filtr k záložce –
  Absence × Předškoláci odpoví přesně na otázku z testování. Počty na záložkách i „přítomno
  X / Y" se pak počítají ze seznamu. Přehled (dashboard) zůstává za celou školku.

**Neřešeno:** mazání a úprava seznamu, seznamy platné jen na jeden den (výjezd) –
výjezdní dny dál řeší zvláštní režim docházky (`SPECIAL`).

## P6: drobnosti z testování (29. 9. 2026)

- **Zpět:** systémové zpět na telefonu appku zavíralo – přepínání obrazovek nezapisovalo
  historii. Teď každý přechod (i do detailu dítěte a fondu) zapíše stav, zpět vrací o krok;
  tlačítka „Zpět" v appce jdou stejnou cestou. Přesné místo, kde respondentka zpět hledala,
  z přepisu nevyplývá (docházka, při hledání dítěte) – proto obecné řešení, ne jedna šipka.
- **Rozpis služeb:** den bez služby je „neslouží", nepřítomnost s důvodem slovem v tlumené
  stavové barvě (dřív tečka a styl alergie). Neplánovaný den se v editoru otevíral jako
  „Slouží 7:30–16:00" – na to respondentka narazila; teď se otevře jako Neslouží.
- **Odhlášení a profil průvodce:** pata menu jako u rodiče (jméno → Můj profil, Odhlásit se).
  Profil má kontakt a **výkaz hodin za červen** z rozpisu služeb (odpracováno / naplánováno).
- **Vzkaz jednomu rodiči:** z profilu dítěte (zóna „Vidí rodiče") i z Novinek; na konkrétní den.
  Rodič ho vidí na přehledu jako „Vzkaz od průvodců" – dnes i ty na další dny, ať se
  o spacáku na zítra dozví včas. Zrcadlo „Informací pro průvodce"; data se dál nesdílejí.

## Role Kuchyň (29. 9. 2026)

**Podklad:** P3 z testování (2 ze 3) – *„jen se koukne, nic nepočítá, nic nedohledává a ví,
kolik čeho udělat"*; jídelníček nerozlišoval dopolední a odpolední svačinu (*„a to je rozdíl"*);
kuchyň potřebuje u přípravy alergen a počet porcí, jména až u výdeje (vyvěšený papír);
omluvené dítě si může nechat oběd vyzvednout.

**Rozhodnutí:** čtvrtá role průvodcovské appky `?role=kuchyn` (Ksenia). Vidí jen Přehled
kuchyně, Jídelníček (smí ho upravovat, stejně jako hospodářka) a Kontakty.
- **Přehled:** tři jídla dne – **dopolední svačina · oběd · odpolední svačina** – velkým číslem
  porcí, co se vaří a „bez mléka · 4 porce" jen pro děti, které dnes jedí. Pod tím **oběd
  k vyzvednutí** (jménem), **alergie na výdej** (jménem, s tiskem do PDF) a **počty na zítra**
  k objednávce obědů.
- **Počty se odvozují z docházky** (`porceDne(d)`): dopolední svačina a oběd = přítomní,
  odpolední svačina = přítomní bez dopolední docházky (ta je do 13:00), oběd + vyzvednuté.
- Chody v jídelníčku se jmenují **Dopolední / Odpolední svačina** místo Svačinka 1/2 (obě appky).
- Patička docházky „Obědy 21 · svačiny 21" počítala přítomné děti – nahrazeno týmž výpočtem.
- `smiZapisovat` je teď výčtem rolí (vedoucí, hospodářka) – nová role nesmí zápis docházky
  zdědit omylem, jak by to dovolilo původní „kdokoli kromě průvodce".

**Opraveno:** vysvětlivka záložky Odpolední tvrdila „přicházejí až po obědě" – ve Vhaaji je
odpolední docházka do 15:00, děti přicházejí ráno všechny.

**Neřešeno:** objednávka obědů přímo z appky (dodavatel Mamafood), svačiny podle programu
(výzkum: plánuje se podle měsíčního plánu, ne podle četnosti).

## Kuchyň napříč školkami (10. 10. 2026)

**Upřesnění zadání (Lenka):** jídelníček zapisuje a počty jídel podle dětí zjišťuje kuchyň –
**může to dělat jeden člověk pro všechny školky** podle stavu docházky. Svačiny si každá
školka chystá sama; svačiny i obědy se odvíjejí od docházky, a kdo ráno nedorazí, jeho
oběd je navíc. Kuchyň dál zajímají alergie.

**Rozhodnutí:** přehled kuchyně je napříč školkami sítě (Vhaaji, Jaata, Maata):
- nahoře **součty** dopolední svačina · oběd · odpolední svačina;
- **podle školek** (desktop tabulka, mobil karty) včetně alergií dětí, které dnes jedí;
- u oběda **objednáno · jí · navíc** – oběd se objednává den předem podle přihlášek po
  deadlinu 20:00, ranní omluvy už ne; u svačin „navíc" nevzniká, chystají se podle
  aktuálního čísla;
- **na objednávku zítra** po školkách + celkem;
- pod tím **detail Vhaaji** (co se vaří, porce bez alergenu, oběd k vyzvednutí, alergie
  na výdej s tiskem).

V prototypu se živě z docházky počítá jen Vhaaji (jen ta má v průvodcovské appce děti);
ostatní školky jsou souhrnná čísla v `KUCH_SKOLKY`, obsazenost sedí s adminem.

**Dořešeno 10. 10. 2026:**
- **Kouzlo lesa v kuchyni není** – cizí provozovatel; kuchyň počítá Vhaaji, Jaata a Maata.
- **Svačiny má každá školka vlastní jídelníček**, obědy (Mamafood) jsou společné. Kuchyň
  v Jídelníčku přepíná školky; v editaci jsou pole obědů označená „všechny školky".
  Svačiny Vhaaji zůstávají v `JIDELNICEK` (čte je i rodičovská appka), Jaata a Maata
  je mají v `SVACINY`. Porce bez alergenu se u nich nezobrazují – v prototypu nemají děti.

## Admin · Náhrady v hodinách, pravidlo podle školky (10. 10. 2026)

**Rozhodnutí (Lenka):** náhrady se v adminu počítají v **hodinách** a **každá školka má své
pravidlo** – jako to vede Radka a popisují příručky. Pravidlo Vhaaji potvrzené textem příručky:
*20 % omluvené absence (ze 100 h omluvených → 20 h k čerpání)*; omluvená = zadaná do 20:00
předchozího dne; čerpá se odpoledne navíc nebo úterní docházkou do 17:00; děti s plnou
docházkou mohou čerpat i 2 týdny příměstských táborů. Maata: pevný roční balík podle
docházky (30 / 80 / 100 h). **Jaata a Kouzlo lesa: pravidlo v podkladech není** – převzato
20 %, v tabulce s odznakem „ověřit".

**Obrazovka:** souhrn (k čerpání · v záporu · čerpáno letos · bez čerpání), filtr školek,
„jen v záporu", „jen bez čerpání", hledání, řazení (výchozí: zápory nahoře), CSV.
**Detail dítěte** napíše výpočet slovy (omluveno → připsáno → čerpáno → zbývá) a rozepíše
vznik po měsících a každé čerpání s datem, typem, kdo ho zadal a obsazeností třídy – to je
„validace", kterou vedení chtělo, a podklad pro rodiče (Flow 3).
**Náhled pravidla** přepočítá zůstatky na „20 % všude" / „paušál všude" se sloupcem změny;
nic se neukládá. Terka tak vidí dopad volby na datech.

**Seed:** 65 smyšlených dětí; rozložení čísel podle Radčiny tabulky (jen čísla, žádná jména):
v záporu 29 % (tabulka 23 %), medián zůstatku 24 h (16 h), čerpáno medián 20 h (16,5 h).
Velké zápory dělají tábory – dva týdny spotřebují víc, než dítě za rok získá.

**Nesoulad k dořešení:** rodičovská appka počítá náhrady ve **dnech** (1 včas omluvený den =
1 náhrada). Po tomhle rozhodnutí by měla přejít na hodiny se stejným pravidlem – zapsáno
jako navazující krok. **Otevřené:** jak tábor (v červenci) čerpá z hodin, které propadají
30. 6. – v prototypu se čerpá přihláškou; pravidla Jaaty a Kouzla lesa; Maata „50 %
v 1. pololetí" zatím nehlídáno.

## Admin · Přehled zostřený na „co vyžaduje akci" (10. 10. 2026)

Podle draft-admin 4.1: **dnes ve školkách** (přítomno z zapsaných, omluveno, nevyřešeno,
průvodci – Terčin dohled) · **platby k řešení** (jen po splatnosti, částečně uhrazené
a čekající na spárování, s počtem a sumou) · **náhrady – výkyvy** (děti v záporu, čerpání
nad dvojnásobek průměru, co propadne 30. 6.; proklik otevře Náhrady s filtrem „jen v záporu")
· **chybějící data a upozornění** · **kapacity**.

**Vypadly** provozní úkoly (ve výzkumu je nikdo nezmínil) a poslední porady (mají vlastní
sekci). Starý souhrn náhrad ve dnech (`NAHRADY_SUM`) nahradil výpočet z `NAHRADY_DETI`.
Odchylka od BRIEF kap. 1, který úkoly i porady na dashboard dává – výzkum má přednost.

## Admin · Platby (10. 10. 2026)

Podle draft-admin 4.2, rozsah podle zafixovaného rozhodnutí fáze 5 (žádný fakturační modul):
- **Faktury napříč školkami** pro tytéž děti jako Náhrady (65); školné se vystavuje dopředu,
  stravné zpětně podle snědených jídel. Ceny: Vhaaji 10 584 Kč a Maata 11 813 Kč z příruček,
  ostatní odhad prototypu (zapsáno v kódu). Stravné 75 Kč oběd + 25 Kč svačina.
- **Měsíc** (březen–červen), **souhrn** (vystaveno · uhrazeno · k úhradě · po splatnosti),
  filtr školky, druhu a stavu, hledání, CSV „pro účetní".
- **Akce simulované:** *Vystavit stravné za květen* s náhledem (kolik faktur, děti
  s poznámkou „odchod před obědem" – přesně Radčina poznámka) · *Poslat upomínku* vybraným ·
  *Označit jako uhrazeno* (s poznámkou „spárováno ručně"). Školné na červenec jen náhled.
- Stavy z BRIEF kap. 4 přes stavovou paletu (uhrazeno, neuhrazeno, po splatnosti, částečně,
  čeká na spárování, přeplatek, storno).
- **Jména ze sítě sedí s ostatními appkami:** Eliška Dvořáková má po splatnosti duben a květen
  (jako v rodičovské appce, 2 × 10 584 Kč), Kuba Svoboda, Tomáš Beran (částečně) a Ela Marešová
  (čeká na spárování) převzali čtyři smyšlené děti z Náhrad.

**Nedělá se:** editor faktury, číselné řady, účty dodavatelů, párování s bankou (otázka pro Pata).
Přehled adminu čte „platby k řešení" z týchž faktur (`platbyKResi`).

## Admin · Děti a matrika, pořadí menu (10. 10. 2026)

Podle draft-admin 4.4. **Jeden seznam dětí napříč školkami** – tytéž děti jako v Náhradách
a Platbách – s kmenovými daty, zákonnými zástupci a dokumenty. **Kompletnost matriky** se
odvozuje z vyplněných polí (`MATRIKA_POLE`, `matrikaChybi`); **Přehled z ní počítá
„chybějící data"** po školkách a polích místo dřívějších napevno napsaných vět.
- Filtry školka · předškoláci · alergici (Terčino „rychle extrahovat") · neúplná matrika.
- **Export pro MŠMT** (CSV se sloupci výkazu; v ostrém provozu ZIP po školkách k 30. 9.).
- **Pozvat rodiče k doplnění** – Terčin nápad s dotazníkem: v rodičovské appce by se rodině
  objevil formulář jen s chybějícími poli; v prototypu se eviduje „pozváno".
- Detail má **„Jinde v systému"** – zůstatek náhrad a dluh na platbách s proklikem
  (jedno dítě, jeden záznam; dnes tři místa).
- Eliška Dvořáková má údaje jako v rodičovské appce (narozena 14. 3. 2021, rodné číslo, adresa).

**Pořadí v menu** podle frekvence použití (draft-admin 4): Přehled · Platby · Náhrady · Děti
a matrika · Novinky · Porady. **Nastavení (ceny, typy, kapacity) vypuštěno** – jeden hlas,
nic na něm nestojí (viz roadmapa).
**Nedělá se:** správa uživatelských účtů (Patova administrace).

## Rodičovská appka: náhrady v hodinách (10. 10. 2026)

Navazuje na rozhodnutí o adminu – rodič a vedení teď vidí tatáž čísla. Každý včas omluvený
den připíše **20 % své délky** (Vhaaji: odpolední 7 h → 1,4 h). Zůstatek „Dostupné náhrady"
je v hodinách, pod ním naplánované hodiny a pravidlo z příručky jednou větou. Omluvenka před
odesláním říká „Připíše se 1,4 h náhrad – 20 % z 1 včas omluveného dne", toast totéž.
**Eliška je v obou appkách stejná:** 5 včas omluvených dní × 7 h = 35 h → 7 h připsáno,
1,4 h vyčerpáno → admin „zbývá 5,6 h" = rodič „4,2 h dostupné + 1,4 h naplánováno".
**Opraveno:** omluvenka v rodičovské appce psala „Než odešleš" – appka vyká, „Než odešlete".
**Zůstává:** záznam je dál jeden na omluvený den; čerpání po hodinách (odpoledne 2 h, tábor)
rodič zatím nevidí rozepsané – jen zůstatek a naplánované.


## Třídnice v IS – průvodce píše, vedení čte (10. 10. 2026)

**Mění rozhodnutí z fáze 2** („třídnice se nedělá, ani placeholder") i řádek roadmapy
„vědomě mimo rozsah". Podnět: Lenka dodala reálnou třídní knihu Jaaty 2024/25 (Google
tabulka, 43 vyplněných týdnů; leží v `podklady/`, obsahuje jména dětí). Výzkum mluví
dvojím hlasem: nikdo přesun nežádal a čtyři ji brání jako nejlepší nástroj (sdílenost,
historie) – zároveň je to „největší rozpor mezi výzkumem a prototypem" a tření je
doložené: zápis se nestíhá ve stejný den, evaluace se kvůli inspekci přepisují jinam.
Prototyp proto **nesahá na podstatu nástroje** (sdílený zápis, který píše víc lidí
a všichni čtou) – jen ho přenáší do IS a řeší doložená tření.

**Co je v Excelu Jaaty (analýza):** úvodní list (úřední hlavička), rozvrh týdne s řádkem
„kdo zapisuje třídnici", návod k psaní, seznam dětí, listy dětí (vzorce sbírají poznámky
ke každému dítěti za rok), poučení o pravidlech (32 pravidel ve třech sadách: jurta
a zahrada / les / město) a 47 týdenních listů (dny ve sloupcích, ~16 řádků + poznámky,
úkoly a poznámky k dětem). Vyplňování v roce **neslábne** – hlavní řádky drží ~90 %
dnů. Zmizely jen podřádky „povedlo/nepovedlo" (23 % → 4 %) a „cíle/posuny" (52 % → 36 %).
Poznámky k dětem: v průměru u 19 z 23 dětí každý týden.

**Rozhodnutí (Lenka zvolila „průvodce píše, admin čte" a „zkrácenou kostru"):**
- **Kostra dne** = řádky, které Jaata opravdu psala: příchod, ranní kruh, aktivita, jak
  to šlo (sloučené povedlo/cíle), kam jsme šli + poučení (sada podle místa), odpočinek,
  předškoláci (nepovinné), počasí, evaluace dne. **Týden:** téma, pohádka týdne,
  uzavření týdne, „je třeba zařídit + kdo".
- **Vypadlo „kdo zapaloval"** (92 % v Jaatě) – je to jméno dítěte ve veřejné části.
  Pokud ho tým postrádá, patří do poznámek k dětem. **Otevřené.**
- **Žádné Odeslat / Uzavřít.** Každé pole se ukládá při psaní a nese „kdo · kdy doplnil".
  Psát smí kdokoli z týmu, i zpětně (koordinátorka: formulář, který se odešle a zavře,
  dopisování po dnech neunese). Kuchyň třídnici nevidí.
- **Stav dne** odvozený z polí: zapsáno (8 z 8) / rozepsáno n z 8 / chybí; dnešek bez
  zápisu je „zatím nic", ne chyba. U proběhlých dnů je vidět, *co* chybí.
- **Poznámky k dětem jsou oddělené a jen pro tým** (P1 + legislativa: ve veřejné části
  třídnice nesmí být jména dětí). Do tisku ani do adminu nejdou. Pohled ukazuje, u kolika
  dětí je tento týden poznámka, a děti bez ní – v Jaatě se píše téměř u všech.
- **Průvodce:** sekce Třídnice (Den · Týden · Děti) + dlaždice na přehledu: včerejšek
  a co v něm chybí, kdo píše dnes (BRIEF: „rychlý vstup do třídnice"). Kdo který den
  píše, je pevné po dnech (`TR_ZAPISUJE`, sedí se službami); v Jaatě je to řádek rozvrhu.
- **Admin:** sekce Třídnice – (1) vyplnění týden × školky, (2) týden jedné školky jako
  tabulka (dny vedle sebe) s tiskem pro inspekci, (3) evaluace dnů a uzavření týdnů za
  období na jednom místě – míří na doložené přepisování evaluací kvůli inspekci.

**Neřešeno:** úpravy struktury po školkách (každá má vlastní řádky a názvy), editace
„kdo píše" v rozvrhu, upozornění na nezapsaný den, vyhledávání v historii, kniha úrazů
(Jaata píše zranění do volného textu třídnice), přenos historie z Google tabulek.
Admin má vlastní seed (květen–červen, 4 školky); Vhaaji tento týden sedí textově
s průvodcovskou appkou.

## Třídnice: informace k dětem – kde se píšou a kdo je čte (11. 10. 2026)

**Zadání (Lenka):** u třídnice mají být i informace k dětem – přímo v zápisu dne, za celý
rok u dítěte a mají je vidět i vedení. Psát je průvodce má ze zápisu dne.

**Rozhodnutí:**
- **Píše se jen v zápisu dne** – blok „K dětem" pod poli dne (interní zóna). Vyber dítě →
  text → „Uložit a další" (formulář zůstane otevřený; v Jaatě vzniká u dne poznámek víc
  naráz). Důvod: zápis se píše po odchodu dětí, „telefon před dětmi je tabu" – poznámky
  tedy vznikají v tomtéž sezení jako zápis, ne rychlým zápisem v terénu. V nabídce dětí
  je vidět, kdo už k tomu dni poznámku má.
- **Záložka Děti je jen ke čtení**: týdenní pokrytí a kdo je bez poznámky; u dítěte
  „Napsat k dnešku" (otevře zápis dne s předvybraným dítětem) a „Celý rok v profilu".
- **Celý rok u dítěte** – v profilu dítěte, zóna „Jen pro tým", karta „Z třídnice ·
  školní rok" (jako „Listy dětí" v sešitu Jaaty; podklad k pohovorům). Odlišeno od
  Poznámek týmu: ty jsou o spolupráci s rodinou, tyhle jsou denní pozorování dítěte.
- **Vedení je čte** – mění rozhodnutí z 10. 10. („do adminu nejdou"). V detailu týdne
  je interní blok (podbarvený jako zóna „Jen pro tým"), který se **netiskne**; do výpisu
  evaluací nejde. V přehledu vyplnění sloupec „K dětem" = u kolika dětí je poznámka.
  Legislativní pravidlo (žádná jména ve veřejné části) drží tisk, ne skrývání před vedením.

**Doplněno 11. 10. 2026:** poznámku jde v zápisu dne upravit (v místě; podpis „upraveno (kdo)") a smazat (potvrzení přímo v řádku, nejde vrátit). Smí kdokoli z týmu, stejně jako psát.

**Neřešeno:** kdo smí poznámky
v adminu číst (zatím každý, kdo má admin). Děti v adminu jsou z jeho matriky – jména se
s průvodcovskou appkou kryjí jen u Elišky (má i stejnou poznámku), počet dětí s poznámkou
u Vhaaji tento týden sedí (7 z 25).

## Třídnice vyplněná za celý školní rok (11. 10. 2026)

**Zadání (Lenka):** třídnice má být „už hodně vyplněná" – celý školní rok, v obou appkách,
s realistickými mezerami jako v Jaatě.

**Rozhodnutí:**
- **Třídnice jako jediná část prototypu sahá přes červen** – od 1. 9. 2025 do dneška
  (182 otevřených dnů, 38 týdnů). Den má klíč podle data (RRRRMMDD), ne „den v červnu";
  kalendář zná víkendy, státní svátky a vánoční zavření (22. 12. – 2. 1.), zavřené dny
  jsou v týdnu vidět jako „zavřeno", ale nedá se do nich psát. Data průvodce jsou
  v novém souboru `pruvodce/tridnice-data.js`.
- **Minulost je vygenerovaná deterministicky** (každé načtení ukáže totéž): témata týdnů
  podle roku (Václav, Martin, advent, masopust, Morana…), program podle týdenního rytmu
  Vhaaji (rytmika / putování / pohyb / tvorba / pohádka), sezónní tvoření, knížka na
  odpočinek podle měsíce, počasí podle měsíce, básnička z tématického plánu.
  **Slavnosti mají svůj den** (Martin 11. 11., adventní spirála 10. 12., masopust 17. 2.…);
  zápis toho dne o nich mluví a poznámky k dětem o slavnosti padnou jen na něj.
- **Mezery jako v Jaatě:** průvodce Vhaaji má zapsaných asi 80 % dnů, zbytek rozepsaný
  nebo (výjimečně) bez zápisu; uzavření týdne chybí asi v desetině týdnů; asi pětina
  zápisů vznikla až druhý den ráno (podpis ukazuje datum). Poznámky k dětem u 16–24
  z 25 dětí týdně (Jaata 19 z 23), ručně psané poznámky z dřívějška zůstaly.
- **Admin:** celý rok pro 4 školky s různou pečlivostí (Jaata nejpečlivější, Kouzlo lesa
  nejméně) – vedení má v přehledu vyplnění co hlídat. Výpis evaluací po měsících
  (výchozí květen – celý rok za všechny školky je dlouhý).
- **Orientace v roce:** průvodce i admin mají vedle listování skok na měsíc; profil
  dítěte ukazuje posledních 6 poznámek a celý rok (kolem 40–50) rozbalí po měsících.

**Vědomě nesedí:** minulé týdny Vhaaji v adminu a v průvodcovské appce se textově ani
stavem nekryjí – appky nesdílejí data ani generátor; shoduje se jen tento týden.
Zbytek prototypu (docházka, akce, služby) dál žije jen v červnu 2026.

## Směr vizuálu: „Deník z háje" (27. 10. 2026)

**Kontext:** designérka vnímala schválenou V2 (karty, Bricolage + Inter) jako generickou.
Průzkum vlastního jazyka proběhl v krocích: nástěnka stop školky (web, příručky, třídní kniha,
fotky – mimo git v `podklady/nastenka/`), šest metafor, živé varianty „kolíčková tabule +
linorytový zpravodaj" (`docs/tabule-zpravodaj.html`) a test nedokonalosti. Poučení: měnit jen
povrch (linky, štětec, textury) nad stejnou kostrou nefunguje – působí to jako filtr; ruka
patří do obsahu, ne do každé hrany. Další práce proto jde přes Figmu: designérka ladí
obrazovku ručně, kód ji pak přesně převezme.

**Rozhodnutí (designérka):** z konceptu tří variant (A tabule, B lesní zpravodaj, C deník)
se jde cestou **C · Deník z háje** – akvarel jako podklad hlavičky a programu dne, ručně
psaný titulek dne („Dnes je pohyb"), měkké zaoblené karty, počty docházky v barevných
skvrnách, kresby místo ikon. Koncept slouží jen jako vizuální vodítko; **obsah zůstává
odsouhlasený** (slovník docházky z testování P2, všechny sekce přehledu včetně „Kdo dnes
nepřijde"; řada „rytmus dne" z konceptu se nepřebírá).

**Písma (zatím jen v draftu, ne v tokenech):** nadpisy Alegreya, text Lexend, ručně psaný
akcent Itim (načítá ho i web vhaaji.cz). Mění typografii schválenou v 4.2 – před přenosem
do kódu je potřeba rozhodnout, zda platí pro všechny čtyři školky, nebo jen pro skin Vhaaji.

**Kde to je:** Figma „Vhaaji – design systém", stránka „Draft · přehled průvodce" (rámec
„C · Deník z háje"), vedle V2, A a B a draftu s tahy. Kresby jsou zatím zástupné výřezy
z konceptu; akvarel je skutečný z webu školy.

**Otevřené:** skutečné kresby místo zástupných (ptáček, ikony sekcí); riziko „vkusného AI
vzhledu" (akvarel + ptáček je dnes častý vzor) – hlídat, aby nesl stopy Vhaaji, ne obecný
styl; licence sady tahů (vypadá jako Freepik) před použitím mimo prototyp.

**Doplněno při ladění C ve Figmě (27. 10. 2026)** – změny obsahu přehledu průvodce, které se mají
promítnout do kódu při převodu:
- **Program dne patří do hlavičky** („Dnes je Pohyb" + kroužek pod datem), samostatná karta
  „Program dne" zmizela – nesla málo informace s velkou vizuální vahou.
- **Vzkazy od rodičů: čas hned za jménem** (ne vpravo, pletl se s časy v textu) a **řazení od
  nejnovějšího** (dnes se řadí podle pořadí dětí).
- **Třídnice ukazuje všechny nedoplněné dny za poslední 3 týdny** (dnes jen předchozí den –
  starší díra jako Pá 15. 5. nebyla nikde vidět), nejvýš 3 řádky + „a další N ›", jinak
  „Všechny zápisy jsou hotové"; řádek „Dnes píše…" zůstává. Starší díry hlídá vedení v adminu.
- **Přihlášený uživatel v liště jako avatar + jméno + role** (text „Táňa – vedoucí průvodce"
  se nečetl jako role).
- **Pořadí karet na mobilu:** Docházka → Informace od rodičů → Kdo dnes nepřijde → **Třídnice** →
  Dnešní akce → Básnička a písnička → Průvodci dnes (ranní provoz pohromadě, „dnešek" pod ním).
- **Stavy absencí podle stavové palety:** „omluveno rodičem / vedoucí" je neutrální
  (`--state-neutral-ink`), červená (`--state-danger-ink`) jen pro „neomluveno / nevyřešeno" –
  červená má znamenat „tady jednej". Počet vzkazů od rodičů je neutrální odznak (tinta zelená),
  ne červený poplach. Písnička na přehledu jen prvním veršem (celá v tématickém plánu).
- **„Spí dnes" zpátky pod dlaždice docházky** (samostatný řádek s linkou), ne v hlavičce karty
  vedle čísel – u „spí" se respondentka v testování zasekla (P2), nesmí se číst jako pátý stav.
- **Otevírání ve dvou vlnách:** hlavička říká „Otevírají Táňa a Darča, dál Honza a Míša" –
  **bez časů** (ty jsou v kartě Průvodci dnes), v kartě Průvodci mají „(otevírá)" oba z první vlny.
  Za jednopísmenné předložky a spojky pevná mezera, ať „a" nevisí na konci řádku. Z testování: ráno otevírají
  čtyři průvodci (dva dřív, dva později) a pořadí je důležité kvůli výměnám služeb; dnešní
  kód (`opener`) označí jen jednoho nejdřívějšího.
- **Odkazy na konci karet jsou sekundární tlačítka** (komponenta `Tlačítko/Sekundární (C)`:
  světle zelená výplň `tint/green`, linka `edge-primary`, plné zaoblení, Lexend SemiBold + šipka →),
  ne zelený text s linkou nad ním – víc lákají ke klepnutí. Primární (tmavé) zůstává jen
  „Otevřít dnešní docházku".
- **Řádek spaní zní „☾ Odpoledne spí 13 dětí ›"** (dřív „Spí dnes…"). Stojí pod dlaždicí
  „Odpolední 3" a respondentka v testování „spí" ztotožnila s odpolední docházkou – „odpoledne
  spí" říká, že jde o provozní fakt (lehátka), který se týká i celodenních dětí, ne o pátý stav.
- **Spaní je úkol se jmény, ne jen počet** (doplnění designérky z praxe, 27. 10. 2026 – v testování
  nezaznělo): průvodci potřebují vědět, *které* děti spí, aby je po obědě nahnali do spací maringotky.
  Na přehledu zůstává sbalený řádek „☾ Odpoledne spí 13 dětí", **jména se ukážou až po rozkliku**
  (rozbalí se v kartě, dva sloupce, abecedně podle seznamu; data `c.spi` u přítomných dětí,
  které zůstávají odpoledne). Figma: stav „Docházka, spaní rozkliknuté".
- **Chyba v počtu „Odpolední" (nalezeno 27. 10. 2026):** `inTab('odpoledni')` počítá jen plán
  „odpolední", ale celodenní plán je mimo úterý odpolední docházka (kód `O`, viz „Celodenní
  docházka je jen v úterý"). Ve středu tak přehled ukazuje 3 místo 20 (21 = 1 dopolední + 20
  odpoledních). Oprava při převodu: počítat podle `getCode(c, den)`, ne podle `c.plan`.
- **Dlaždice docházky podle dne:** Po/St/Čt/Pá čtyři (Přítomni, Absence, Dopolední, Odpolední),
  **v úterý pět** – přibude Celodenní. Šestá dlaždice „Spí" ne (P2). Nula absencí je neutrální,
  ne červená (červená = jednej).
- **Spí a Celodenní jako dlaždice (rozhodnutí designérky, 27. 10. 2026)** – mění předchozí řádek
  „Odpoledne spí" pod dlaždicemi. Kvůli P2 je dlaždice Spí **vizuálně odlišená od stavů docházky**
  (bez výplně, čárkovaná linka, ☾ u čísla, popisek „Odpoledne spí") a po klepnutí ukáže jména.
  **Celodenní jen v úterý** (jinak je 0 – celodenní děti se mimo úterý počítají do odpoledních).
  Středa: Přítomni, Absence / Dopolední, Odpolední / Spí přes celou šířku. Úterý: tři řady po dvou.
  Stojí za ověření v příštím testování – právě „spí" bylo jediné doložené zaseknutí.
- **UX revize nástěnky, body 1–4 (27. 10. 2026):**
  1. Nad Dopolední/Odpolední/Spí popisek **„Z přítomných"** – pět dlaždic nejsou souběžné
     kategorie (Přítomni + Absence = všechny děti; zbytek je rozpad přítomných).
  2. **Nejmenší písmo 11,5 px** (štítky, popisky skupin), popisky dlaždic a časy **12,5 px**
     (styly Draft/Popisek a Draft/Mikro) – kvůli čtení venku na slunci; kontrast AA prošel
     všude už předtím (nejnižší 4,8 : 1). Dlaždice nemají pevnou výšku (min. 74 px) – v kódu
     `min-height`, ne `height`, a test při 200% písmu.
  3. **Třídnice bez štítků „rozepsáno N z 8"** – nejasné „8 čeho" a duplicitní s „Chybí: …".
  4. **„Kdo dnes nepřijde" řadí nevyřešené (neomluveno) nahoru**, omluvené pod ně.

## Skin Vhaaji v průvodcovské appce (27. 10. 2026)

**Rozhodnutí designérky:** nový vzhled C jde **nejdřív do průvodcovské appky** (rodič a admin
v dalším kroku), písma a kresby jsou **jen skin Vhaaji** (ostatní školky drží Bricolage + Inter),
zdrojem pravdy zůstává kód a Figma knihovna se přepíše na C.

**Jak:** samostatný soubor `skin-vhaaji.css` načtený poslední (přebíjí tokeny a vzhled sdílených
komponent), kresby jako inline SVG v `kresby.js`. Díky tomu se nový vzhled propsal do všech
obrazovek průvodce naráz (karty, tlačítka, písma) – obsahově přepsaný je jen přehled. Ostatní
obrazovky si zatím drží svůj obsah včetně teček „·" (mění se při přepracování obrazovky).

**Vědomě nesedí:** tabulky a seznamy (docházka, týden, služby) mají dál tenké linky a menší
zaoblení – jsou to pracovní plochy, ne karty; v Figmě pro ně předloha není.

## Docházka ve vzhledu C (28. 10. 2026)

Docházka je první obrazovka po přehledu (přehled na ni vede „Otevřít dnešní docházku"),
proto se převádí jako první.

- **Počty jako na přehledu:** stejné skvrny ve stejných barvách stavu (absence růžová,
  dopolední modrá, odpolední okrová, celodenní světle okrová, spí čárkovaně) a **stejné pořadí**:
  přítomni, absence, „Z přítomných" dopolední, odpolední, (celodenní), spí. Dřív stálo Spí
  hned za Přítomnými – jinak než na přehledu, ze kterého průvodce přichází.
- Dlaždice jsou tady **filtry soupisu**: vybraná dostane tmavý prstenec, barvu stavu si drží.
- Soupis: každé dítě jako karta bez linky, rámeček kolem celého soupisu zmizel. Štítek režimu
  (dopolední / odpolední / celodenní) má barvu své dlaždice.
- **Tečky „·" pryč** podle pravidla: „St 3. 6. (dnes)", „Spáči v maringotce", „Nemoc: …",
  kuchyň výčtem s čárkami. Ve sdíleném `zpravaShrnuti` (vzkazy od rodičů, i v rodičovské appce):
  samotný typ uvozuje text dvojtečkou („Jiné: Dobrý den…"), za údajem začíná text větou
  („Přijdeme později – 9:30. Jdeme na kontrolu…").
- Týdenní tabulka zůstává pracovní plochou s linkami (viz výše).

## Horní lišta bez role, datum nahoře (28. 10. 2026)

**Rozhodnutí designérky:** blok „Táňa / vedoucí průvodce" v horní liště zrušit – kdo je přihlášený,
je v patě menu. Role je teď v menu pod jménem (místo „Můj profil · výkaz hodin"). Na mobilu je
datum přehledu v prvním řádku vedle Menu, řádky dne pod ním. Přepínač role pro moderaci testů
(bez `?role=`) se přesunul do menu jako „Přepnout roli (prototyp)".

## Docházka na desktopu: úzký soupis a panel „Dnes k řešení" (28. 10. 2026)

**Proč:** UX revize desktopové docházky (skill ui-ux-pro-max). Soupis přes celou šířku měl
zaškrtávátko ~900 px od jména a vzkazy s řádky o ~180 znacích (doporučeno 65–75); 21 stejně
vážených řádků nepomáhalo najít, co je dnes potřeba řešit; filtry ve třech řádcích.

**Rozhodnutí designérky (varianta A):**
- soupis vlevo, úzký; **zaškrtávátko hned u jména** (na desktopu vlevo před avatarem, na mobilu
  zůstává vpravo pod palcem);
- vpravo **panel „Dnes k řešení"** se vším, co dnes přišlo od rodičů (vzkazy, omluvenky, omluvy
  vedoucí) a pod ním **porce pro kuchyň**. Klepnutí na dítě v panelu přepne záložku, rozbalí
  řádek a doroluje k němu. V soupisu poznámky nahrazuje štítek „vzkaz" (v rozbaleném řádku jsou);
- seznam a hledání v jednom řádku;
- „spí / nespí" šedě, ne okrově (nebylo to varování); na desktopu jako štítek s obrysem,
  spí čárkovaně jako dlaždice Spí;
- z patičky pryč „nainstalovatelné, funguje offline (PWA)" – vývojářský žargon.

**Mobil** zůstává: poznámky pod řádky, porce v patičce, panel skrytý.
Menu vlevo „končící v půlce" byl jen snímek celé stránky – sidebar je přilepený a drží výšku okna.

## Listování dny v docházce bez poskakování (28. 10. 2026)

Designérka: „docházka na další dny divně přeskakuje". Dvě příčiny: pole s datem měnilo šířku
podle textu („St 3. 6. (dnes)" je o 43 px širší než „Čt 4. 6.") a šipky uskakovaly zpod kurzoru;
jiný den měl zrcadlové rozložení (souhrn vlevo, soupis vpravo) proti dnešku (soupis vlevo,
panel vpravo). Teď má datum pevnou šířku a jiný den stejnou kostru – soupis vlevo stejně široký,
zvláštní den a počet přítomných v panelu vpravo (na mobilu nad soupisem).

## Docházka: jedna kostra pro každý den (28. 10. 2026)

**Proč:** druhá UX revize (ui-ux-pro-max) – každý den byl jiná obrazovka. Dnešek měl dlaždice,
filtry, zaškrtávátka a štítek plánu u jména; jiný den nic z toho a kód dne vpravo. Stejné dítě
tak bylo dnes „celodenní" a zítra „odpolední" (plán × kód dne – zmatek z testování P2) a barvy
štítků se lišily. Řádek dneška navíc nesl až čtyři podobné pilulky.

**Rozhodnutí designérky:**
- **každý den** má dlaždice s počty (filtry), seznam + hledání, soupis vlevo a panel vpravo;
  počty jiného dne se berou z kódu dne (`inTabD`), Spí podle zvyku spát u odpoledních/celodenních;
- **stejný řádek**: dítě, tečka vzkazu, **jeden štítek režimu podle kódu dne** (barva jeho
  dlaždice; omluveno / absence růžově), šedý doplněk „spí" nebo „na výpravě", zaškrtávátko.
  Den, který role nesmí měnit, má zaškrtávátko neaktivní – stav je vidět, klepnout nejde.
  Vedoucí v jiný den zaškrtávátkem přepíná přítomen ↔ absence, klepnutím na řádek volí kód;
- „po obědě domů" a „nespí" zmizely (říká to „dopolední", resp. je to výchozí stav);
- **vzkaz jako tečka** u jména (desktop; text je v panelu „Dnes k řešení", na mobilu pod řádkem);
- panel: dnes „Dnes k řešení", jiný den zvláštní den; vždy „Porce pro kuchyň" toho dne.

**Doplněk (28. 10. 2026):** porce pro kuchyň z Docházky pryč (panel i patička na mobilu).
Vedoucího průvodce nezajímají – řeší je kuchyň (Ksenia) na svém přehledu v roli `kuchyn`.
Panel vpravo má tak dnes „Dnes k řešení", v den výpravy či horolezení kartu zvláštního dne,
jinak je prázdný (soupis drží stejnou šířku).

## Docházka: ovládání klávesnicí (28. 10. 2026)

Revize podle zásad skillu ui-styling (shadcn/Tailwind se na prototyp bez frameworku nehodí,
použité jsou jen obecné zásady: přístupnost, tokeny, stavy fokusu). Na desktopu – kde vedoucí
pracuje s notebookem – nešly dlaždice, zaškrtávátka ani řádky ovládat klávesnicí (byly to
`div`/`span` s `onclick`). Teď jsou dlaždice a zaškrtávátka `<button>` (neaktivní den = `disabled`),
řádek má `tabindex` + Enter/mezerník. Po překreslení se fokus vrací na prvek, který akci spustil;
když odškrtnuté dítě ze záložky zmizí, dostane fokus zaškrtávátko na jeho místě. Vzhled beze změny,
jen obrys fokusu z `base.css` při ovládání klávesnicí. Hledání se na užším desktopu zalomí pod seznam.

**Otevřené (rozhodne designérka):** v obrazovce je 9 velikostí písma (11,5–34 px, z toho pět mezi
11,5 a 14) a 9 zaoblení (6–34 px). Šlo by je stáhnout na škálu 12 / 14 / 16 / 19 / 26 / 34
a zaoblení 12 (vnitřní) / 22 (plochy) / plná pilulka.

## UX revize celé průvodcovské appky – rychlé opravy (28. 10. 2026)

Průchod všech 13 obrazovek (mobil + desktop) podle priorit skillu ui-ux-pro-max. Opraveno hned:
1. **Klávesnice:** dny v kalendáři, karty novinek a buňky rozpisu služeb (`KLAV` ve `shared.js`).
2. **Kontrast:** `--color-text-hint` #767B74 → #676C65 (3,7 → 4,6 : 1 na pozadí; platí pro všechny appky).
3. **Písmo:** časy v rozpisu služeb 10–10,5 px → 11,5 px (minimum z UX revize).
4. **Dotykové cíle:** šipky kalendáře a „Nahlásit chybu" 44 px (sdílené styly – i rodič a admin).

Zbývá na převod obrazovek do C: různé vzory filtrů a přepínačů (Docházka dlaždice, Děti záložky,
Třídnice tři řádky ovládání), nesjednocené akce v hlavičce, 69 teček „·" na 9 obrazovkách,
drobné verzálky s prostrkáním. Kalendář drží barvy Googlu záměrně.

## Třídnice ve vzhledu C (28. 10. 2026)

- **Ovládání v řádku nadpisu** jako u Docházky (`trHlavicka()` v core.js): přepínač Den/Týden/Děti,
  listování a skok na měsíc. Na mobilu dva řádky (přepínač; listování + měsíc) místo tří nad obsahem.
- **Skok na měsíc bez roku** („Listopad", ne „Listopad 2025") – školní rok září–červen má každý
  měsíc jednou; rok jen zabíral místo a na mobilu vytlačil pole na další řádek.
- **Karta dne bez zdvojeného data** (datum nese listování): stav, kdo slouží a kdo píše.
- **Popisky polí jako nadpisy karet** (Alegreya) místo drobných verzálek s prostrkáním.
- Pole a interní zóna „K dětem" se zaoblením karet; čárkovaný okraj dál znamená „jen pro tým".
- **Tečky pryč:** „Honza (dnes 9:40)", „Ve službě: … Píše Honza.", „(už má poznámku)",
  „(upraveno: Míša)", „Út 2. 6. – Gabča".
- Popisky formulářových polí `.pl` („TÉMA TÝDNE", „SEZNAM") zůstávají verzálkami – sdílený prvek
  napříč appkou, rozhodne se při sjednocení škály písma.

## Třídnice: dopisuje víc průvodců – každý svůj příspěvek (28. 10. 2026)

**Proč:** designérka – „u třídnice se stává, že tam často další průvodci dopisují". Pole mělo jednoho
autora; když druhý připsal větu, podpis se přepsal a nebylo vidět, kdo co napsal.

**Rozhodnutí:** dopsat = **přidat vlastní příspěvek**, cizí text se nepřepisuje. Pole je první zápis
a volitelně doplňky `dop` (tridnice-data.js); stav dne a čtení `.t`/`.kdo` dál berou první zápis,
takže přehled ani vedení se nemění. Každý vidí cizí příspěvky jako text s podpisem a píše/upravuje
jen svůj (`trSet`); smazáním textu svůj příspěvek odebere. Platí pro všechny tři varianty zápisu:
formulář (cizí nad psacím polem), seznam (počet zápisů u řádku, v rozbalení příspěvky), osa
(příspěvky pod sebou jako v sešitě, „+ doplnit"). Seed: doplňky Táni (2. 6.) a Darči (3. 6.).

**Návod k psaní pod „?"** u karty dne (designérka) – ukáže se klepnutím, ne najetím (na mobilu není hover).

**Doplněk – psaní jako v ose (28. 10. 2026):** designérce se líbí osa; ve formuláři a seznamu chybělo
potvrzení dopsaného a úprava. Teď mají všechny tři varianty stejný obsah pole (`trPrispevky`):
cizí příspěvky ke čtení, vlastní jako hotový zápis s „Upravit", při psaní podpis, „✓ Uloženo"
a „Hotovo"; prázdné pole „+ napsat", jinak „+ doplnit". Varianty se liší jen obalem
(karty / rozbalovací řádky / osa).

## Třídnice: hlavička jako u Docházky (28. 10. 2026)

Designérka: tři ovládací prvky v hlavičce („Den/Týden/Děti", listování, výběr měsíce) jsou složité.
Teď stejně jako Docházka: **přepínač Den | Týden a listování**.
- **Výběr měsíce zrušen** – klepnutí na datum v listování otevře kalendář telefonu (`<input type=date>`
  přes popisek, `showPicker` na desktopu). Zvolený víkend nebo prázdniny vedou na nejbližší předchozí
  otevřený den, budoucnost na dnešek.
- **Záložka „Děti" zrušena** – týdenní přehled poznámek k dětem je sbalená část pohledu Týden
  („Tento týden poznámka u 8 z 25 dětí" + Zobrazit děti). Poznámky ke dni zůstávají v „K dětem" pod zápisem.

## Třídnice: zápis dne jako časová osa – rozhodnuto (28. 10. 2026)

Ze tří variant zápisu dne (formulář s kartami, seznam k odškrtání, časová osa) designérka vybrala
**časovou osu** („třetí varianta, potvrzeno"). Den se čte jako deník podél svislé čáry: vyplněné
pole má plný bod a čte se jako text s podpisem, prázdné má prázdný bod a „+ napsat" / „+ doplnit".
Formulář a seznam jsou z kódu pryč i se srovnávací stránkou `docs/tridnice-varianty.html`
a parametrem `?trv=`; datový model (`dop`, každý svůj příspěvek) zůstává beze změny.

## Třídnice: nehotové úkoly se přenášejí do dalšího týdne (28. 10. 2026)

Designérka: nehotový úkol „Je třeba zařídit" se **přenáší do dalších týdnů, dokud ho někdo
neodškrtne**. V novém týdnu je pod vlastními úkoly s poznámkou „Z týdne 25.–29. 5.", úkol se
nepřepisuje znovu. Úkol dál patří týdnu, kde vznikl; odškrtnutím se zapíše `hotovo` = pondělí týdne,
ve kterém se udělal (`trUkolyTydne`, `trUkolHotovy`). Seed: úkoly starší tří týdnů jsou vždy hotové
(jinak by se do června navršil celý rok), „Opravit povolené lano" se přenáší z 25. 5. do 1. 6.

## Jídelníček ve vzhledu C (28. 10. 2026)

Designérka: „opět hodně roztahané". Na desktopu bylo pět karet přes celou šířku, jídlo v dlouhém
řádku a různě široké verzálkové popisky chodů posouvaly začátek jídla.
- **Listování týdnem a „Upravit" v řádku nadpisu** (`jidHlavicka()`), jako u Docházky a Třídnice;
  samostatný řádek „Týden" pod nadpisem zrušen.
- **Dny v mřížce** na desktopu (tři vedle sebe), všechny karty stejně vysoké; na mobilu pod sebou.
- **Chod jako popisek nad jídlem** (bez verzálek), porce bez alergenu jako štítky pod jídlem.
- **Tečky pryč:** „5 porcí bez mléka" místo „bez mléka · 5 porcí" (i na přehledu kuchyně),
  dnešek štítkem „dnes", toast „Uloženo: svačiny Jaata, obědy pro všechny".
- Tlačítko v řádku nadpisu (`.dfield .btn-ghost`) má plochu jako listování – šedý obrys na
  akvarelu vypadal jako vypnutý.

## Jídelníček: varianty k porovnání (28. 10. 2026)

Designérka chce porovnat jiné vzory. V URL `?jdv=` (srovnání: `docs/jidelnicek-varianty.html`):
A karty dnů (výchozí), B **tabulka** chod × den (na mobilu přepínač Po–Pá a jeden den),
C **dnes nahoře** (ostatní dny jako rozbalovací řádky s hlavním jídlem a počtem jídel s alergeny),
D **po chodech** (karta na chod a v ní pět dnů – svačinářka vidí svačiny týdne pod sebou).
Úpravy jídelníčku jsou ve všech variantách v kartách (A). Po rozhodnutí zůstane jedna.

Poznámka pod jídelníčkem („Obědy dodává Mamafood… počítá se z karet dětí") smazána – designérka 28. 10. 2026.

**Rozhodnuto (28. 10. 2026): „Dnes nahoře".** Designérka: „nejvíce je bude zajímat aktuální den".
Dnešní jídla celá nahoře, ostatní dny jako rozbalovací řádky (hlavní jídlo, „alergeny (N)"),
proběhlé dny šedě; v týdnu bez dneška jsou všechny dny řádky. Úpravy týdne zůstávají v kartách
dnů. Tabulka, po chodech, parametr `?jdv=` a `docs/jidelnicek-varianty.html` jsou pryč.

## Jídelníček: další varianty s dneškem v popředí (28. 10. 2026)

Designérka chce další varianty „dnes nahoře". V URL `?jdv=` (srovnání: `docs/jidelnicek-varianty.html`):
A dnes nahoře (výchozí), B **den po dni** (pás pěti dnů, pod ním jeden den, výchozí dnešek),
C **dnes a zítra** (dvě celé karty, na desktopu vedle sebe, zbytek týdne v řádcích),
D **dlaždice** (dnešní chody jako barevné skvrny jako na přehledu). Časová osa dne podle hodin
není – skutečné časy svačin a oběda v datech nejsou a vymýšlet je nechceme.

**Rozhodnuto (28. 10. 2026): „Den po dni" (varianta B).** Pás pěti dnů nahoře, pod ním jeden den –
výchozí dnešek, nadpis karty podle dne („Dnes se jí", „Zítra", „Bylo", „V plánu"); proběhlé dny
v pásu tlumeně. V jiném týdnu se otevře pondělí. Úpravy týdne zůstávají v kartách dnů.
Dnes nahoře, dnes a zítra, dlaždice, parametr `?jdv=` i srovnávací stránka jsou pryč.

Odkaz „Kdo má jakou alergii" je až pod jídlem dne, ne nad pásem dnů – není to to hlavní (designérka 28. 10. 2026).
29. 10. 2026 se odkaz přesunul do hlavičky vpravo nahoře vedle „Upravit" (stejná výška pilulky) – pod dlouhým seznamem týdnů ho nikdo nenašel.

## Jídelníček: dnešek na přehledu, v jídelníčku dny od dneška (28. 10. 2026)

Designérka: „dnešek dát na dashboard a tady zobrazit celý týden od dneška dál. Minulost je asi nezajímá."
- **Přehled:** karta „Dnes se jí" (chody a porce bez alergenu), odkaz „Jídelníček na další dny".
  Mobil: po akci, před básničkou; desktop: sloupec úplně vpravo přes obě řady (mřížka má čtyři sloupce; dřív řádek přes celou šířku dole).
- **Jídelníček:** pět školních dnů od dneška, i přes víkend do dalšího týdne (St–Pá, Po–Út),
  karty se štítkem „dnes" / „zítra"; pás dnů a listování pryč.
- **Listování týdny jen v úpravách** (kuchyň, hospodářka): zadávají dopředu a svačinářka plánuje
  z toho, co bylo. Rozepsaný týden se při listování nezahodí – „Nejdřív ulož, nebo zruš úpravy".

## Přehled: zůstává soupis dne (28. 10. 2026)

Porovnány čtyři vzory přehledu: soupis dne, den shora dolů, co řešit teď, dlaždice (commit 7e7564e,
vrácený). Designérka: „původní varianta mi přijde dobrá vzhledem k výzkumu" – ranní trojice
(docházka, vzkazy, kdo nepřijde) odpovídá tomu, co průvodce ráno řeší, a nic se neschovává
pod rozbalení. Varianty i srovnávací stránka jsou pryč.

**Doplněk (28. 10. 2026):** místo pěti dnů od dneška seznam od dneška do konce měsíce (co je dodané – teď do 26. 6.), nejbližší nahoře; nad každým dalším týdnem nadpis „Týden 8.–12. 6.", každý týden vlastní mřížka.

**Průvodci dnes (28. 10. 2026):** role pod jménem drobně („otevírá", „uspává" slovem místo ☾), čas vpravo vždy na jednom řádku – v úzkém sloupci se „(otevírá)" lámalo do času.

**Tabulka po týdnech (28. 10. 2026):** karty dnů se špatně četly (18 dní × 4 popisky chodů, mřížka zleva doprava). Teď tabulka na týden – řádky dny, sloupce chody, popisek chodu jednou v záhlaví, dnešek zvýrazněný řádek. Mobil: týden jako jedna karta, dny jako bloky pod sebou. Úpravy zůstávají v kartách dnů.

## Básnička na přehledu bez ručního písma (28. 10. 2026)

Designérka: básnička a písnička byly „fontem na nadpisy a větší" (ruční Itim 17 px) – sjednotit s textem
přehledu. Teď Lexend v základní velikosti jako názvy jídel. Itim se jinde nepoužíval, proto je pryč
i z načítání písem a token `--font-hand` zrušen.

## Přehled: texty z pohledu průvodce (28. 10. 2026)

Designérka: „přetextovat více pro průvodce". Děti dnes (dřív Docházka dnes), „Z nich", Zapsat docházku,
Vzkazy od rodičů, Dnes nepřijdou, „zatím bez omluvy" / „omluva od rodiče" / „omluva zapsaná vedoucí"
(bez „bez náhrady" – náhrady řeší vedení a rodiče), Probíhá (vícedenní akce) / Dnes je akce,
Celý plán týdne, Chybí doplnit, Celý rozpis. Nadpis „Básnička a písnička týdne" zůstává („Do kruhu" ne);
karta kolegů se jmenuje **Dnes jsme tu** – tým se má rád a o sobě nemluví jako o „průvodcích" („ve službě" zní divně). U jídla průvodce vidí děti („bez mléka: 5 dětí"), kuchyň dál porce. Popisky skupin bez verzálek.
Neověřeno: jestli průvodci u jídla chtějí počet, nebo jména.

Třídnice na přehledu: nadpis „Třídnici píše Honza" místo „Třídnice" + samostatného řádku „Dnes píše Honza" (designérka 28. 10. 2026).

Karta jídla na přehledu: „Co je dnes k jídlu" místo „Dnes se jí" (designérka 28. 10. 2026 – zkusit jinak).

**Bez „dnes" v nadpisech (28. 10. 2026):** přehled je celý o dnešku a datum je nahoře – „dnes" se opakovalo. Nadpisy: Děti, Vzkazy od rodičů, Nepřijdou, Akce / Probíhá, K jídlu, Sestava (kolegové; dřív Kdo je tu), Třídnici píše: Honza. „Dnes je Pohyb" v hlavičce zůstává.

Karta básničky a písničky na přehledu: **Verše týdne** (designérka 28. 10. 2026 – jedno slovo pro obojí, „týdne" zůstává). Uvnitř dál popisky Básnička a Písnička.

Kresby designérky „jídlo" a „sestava" (podklady/icon/) doplněny do kresby.js a na karty K jídlu a Sestava na přehledu (28. 10. 2026).

Kresby v rohu karet mají stejnou plochu (80 × 80 px), ne stejný čtverec – šířka a výška podle poměru stran, svisle vystředěné (designérka 28. 10. 2026: srovnat velikost a poměry; široké jídlo a sestava jinak vycházely menší).
Třídnice (sešit) optický ořez na 90 % – je hutná a vyplní celé plátno, na oko působila větší.
Desktop přehled: mezera pod ranní trojicí 32 px (dřív 12 px – menší než mezi kartami a kresby přečnívaly nad kartu).

Přehled: odkaz na konci karty jako patička – pod dělicí čarou přes celou spodní plochu karty, text vlevo, šipka vpravo, výška 52 px (designérka 28. 10. 2026; dřív pilulka). Zatím jen na přehledu, jinde zůstávají pilulky.

Doladění přehledu na desktopu (28. 10. 2026): karty natažené na výšku mřížky a patičky v jedné řadě dole; jméno v „Třídnici píše:" záměrně na druhém řádku (stejné zalomení pro každé jméno, na mobilu jeden řádek); rolovací vzkazy a nepřítomní končí měkkým přechodem místo useknutého řádku.
