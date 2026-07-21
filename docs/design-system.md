# Design system – Vhaaji

Živý dokument. Vzniká ve fázi 4 (redesign dle skutečné identity). Zdroj pravdy pro
vizuál je **web školky [vhaaji.cz](https://vhaaji.cz/)**, ne prototyp ani invence modelu.
Foundations (4.1) níže jsou **schválené (V2)** a **nasazené v prototypu**: paleta a typografie
přeneseny do `tokens.css` ve fázi 4.2, tvarosloví a stavový vizuál sjednoceny ve fázi 4.3
(viz „Komponenty a stavy" na konci). Sekce „Návrh mapování" a proces výběru jsou ponechány
jako doklad cesty.

Pracovní extrakt (logo, hero, vzorky) je v `podklady/web-extract/` (gitignore).

---

## Foundations – zdroj: web (vhaaji.cz)

### Značka / logo

Ruční **inkoustový linoryt**: holý strom tvořící kruh, dítě sedící ve větvích, dospělý
(dlouhé vlasy, zády) sahající vzhůru, pod tím rukou psané „vhaaji". Černá na průhledném
pozadí. Původní soubor `logo-vhaaji.png` (500×480, RGBA) – v distu půjde inline jako
data URI (fáze 4.2). Charakter: rukodělný, přírodní, neformální – ne korporátní.

### Barevnost (vytěženo z CSS + vzorkováno z hero akvarelu)

Web stojí na **krémovém podkladu** s **akvarelovými skvrnami** ve třech tlumených
hue – zelená, okrová, tlumená růžová/mauve – a **inkoustově tmavém** textu/patičce.

| Role na webu | Zdroj | Hodnota |
|---|---|---|
| Podkladová krémová (sekce) | CSS `background` | `#EFEEE9` |
| Světlá krémová (akvarel ground) | hero vzorek 24 % | `#D8D8C0` |
| Zelená (nejsytější blob) | hero vzorek | `#309078`–`#489078` |
| Okrová / zlatá | CSS blok + hero | `#C8BC85`, `#D8C090` |
| Tlumená růžová / mauve | hero vzorek | `#D8A890`, `#D8C0C0` |
| Tmavá inkoustová (text, patička) | CSS `background`/text | `#1F2A2E` |
| Text muted | CSS | `#888888` (na světlé neplní AA – viz níže) |
| Logo / ink | logo PNG | černá `#000` |

### Typografie (z `@font-face` a computed stylů webu)

Všechny tři fonty webu jsou **Google Fonts** (dostupné, žádná náhrada nutná):

| Užití na webu | Font | Charakter |
|---|---|---|
| Velké nadpisy (H2, display) | **Shadows Into Light Two** | ruční tenké písmo, výrazné |
| Odkazy / serif prvky | **IBM Plex Serif** | čitelný humanistický serif |
| Běžný text / odstavce | **Itim** | ručně psané, kulaté, hravé |

(Deklarované, ale pro viditelný text nevyužité: `Neue Einstellung`. Ikonové fonty
Font Awesome / eicons jsou technické, ne značkové.)

Pozn. k čitelnosti: **Itim** je rukodělné písmo – půvabné pro osobní tón, ale pro
hustý UI text (admin tabulky, malé labely, dlouhé seznamy) rizikové.

### Typografie napříč školkami (proč se Vhaaji fonty nepřebírají 1:1)

Typografie je **společná pro všechny čtyři školky** (skiny mění jen barvu – BRIEF kap. 10),
takže nesmí být podpisem jedné školky. Porovnání webů to potvrzuje:

| Školka | Nadpisy / display | Text / UI |
|---|---|---|
| Vhaaji | Shadows Into Light Two, IBM Plex Serif | Itim (psané) |
| Jaata | Poppins (geometrický sans) | Source Sans Pro |
| Maata | Sacramento (kaligrafie) | Open Sans |
| Kouzlo lesa | Playfair Display (serif) | Metropolis (sans) |

**Žádný font není společný** – každá školka má vlastní. Společný je jen **vzorec**:
charakterní nadpisy + **neutrální, čitelný sans na text** (3 ze 4 školek). Vhaaji s
rukodělným Itim je výjimka – právě ta špatná čitelnost v UI. Proto se Shadows Into Light
Two ani Itim **nepřebírají** jako systémové fonty; slouží jen jako reference tónu.

### Univerzální typografie – vybráno (4.1)

- **Nadpisy – Bricolage Grotesque** (Google): současný grotesk s jemnou nepravidelností =
  vlastní identita bez genericnosti; moderní, profesionální, bezpatkový, vhodný do IS.
- **Tělo / UI – Inter** (Google): neutrální UI sans, extrémně čitelný v malých velikostech
  i hustých tabulkách; věcný, profesionální, ladí s Bricolage.

Cesta k výběru (viz decision-log): první trojice nadpisů zamítnuta (Fraunces generický,
Nunito Sans bold + Baloo 2 dětské pro IS); druhá trojice (Spectral, Zilla Slab, Bricolage) →
designérka vybrala **Bricolage Grotesque**. Tělo přepnuto z návrhu Nunito Sans na **Inter**.
Odmítnuto jako systémový font: Shadows Into Light Two, Itim (podpis Vhaaji / špatná čitelnost).

### Tone of voice titulků

Neformální, lidský, přírodní. Rukodělná estetika (linoryt, akvarel, psané písmo)
napříč. Žádné ostré geometrické tvary ani korporátní čistota.

### Směr UI komponent – vybráno: whitespace + barva (sweet spot)

Cesta k rozhodnutí (viz decision-log): designérka dodala 6 referenčních dashboardů; postupně jsme
vyzkoušeli tři varianty v náhledu – **4** jemné tinty (Donezo), **5** plné barevné bloky (kwikword),
**6** whitespace/klid. Zvolila **whitespace** jako kostru + **víc barvy** → finální **sekce 7 „sweet spot"**.

**Principy finálního směru** (vše barvou ze schválené palety, bez dětských ilustrací):

- **Whitespace first** – velký prostor, hodně paddingu (karta ~48–52px), velký radius (24px);
  skupiny odděluje **prostor a vlasové linky** (`--color-border`), ne rámečky/boxy. Minimum stínů.
- **Barva jako akcent, ne plocha:**
  - **Barevná fokální čísla** – KPI čísla nesou i význam: děti=primary, omluveno=rose-ink `#7A4B41`,
    náhrady=accent-ink `#6F5F1C`, po splatnosti=danger. (AA ≥4.5 na surface ověřeno.)
  - **Kategorie-chipy** – světlé tinty (green `#E3EDE7`, rose `#F1E1DC`, ochre `#F1EAD2`, blue `#DEE7EA`)
    s malým icon-chipem; vzdušné, ne plné dlaždice.
  - **Barevné tečky + tagy** u řádků programu (primary / accent / info).
  - **Jeden tónovaný highlight** (např. připomínka) jako jediný větší barevný moment.
- **Typografie** – velké klidné nadpisy Bricolage, data Inter.
- **Progress** – tenká lišta (ne těžký prstenec) s velkým % vedle.

Zamítnuté varianty ponechány v náhledu (sekce 4–6) jako doklad cesty. Ikony jsou zatím unicode
glyfy (placeholder) – o ikonografii rozhodne designérka (4.6), případné ikony inline SVG. Detailní
tokenizace (radiusy, stíny, tint tokeny) proběhne ve 4.2/4.3; tady je schválený vizuální **směr**.

---

## Návrh mapování na tokeny prototypu (4.1 – čeká na V2)

Odvozeno z hodnot výše, doladěno na splnění **WCAG AA** (text 4.5:1, velký text/UI 3:1).
Kde web AA neplnil, uvedena nejbližší vyhovující varianta a odchylka.

| Token | Návrh | Odvození / poznámka |
|---|---|---|
| `--color-bg` | `#EFEEE9` | přímo krémový podklad webu |
| `--color-surface` | `#F9F7F1` | světlejší krém (karty) – dopočteno |
| `--color-surface-2` | `#E7E4DA` | tmavší krém (akvarel ground) – dopočteno |
| `--color-text` | `#1F2A2E` | inkoustová tmavá z webu (12.6:1 na bg) |
| `--color-text-muted` | `#5C6560` | web `#888` neplní AA → ztmaveno (5.2:1) |
| `--color-text-hint` | `#767B74` | jen nepodstatné hinty (3.7:1, ≥3:1) |
| `--color-primary` | `#2B7059` | web zelená ztmavená na AA (5.1:1 na bg) |
| `--color-primary-strong` | `#1F5344` | tmavší zelená (7.6:1) – nadpisy, důraz |
| `--color-accent` | `#C8BC85` | okrová z webu – **výplň** (tmavý text 7.7:1) |
| `--color-accent-ink` | `#6F5F1C` | okrová jako **text** (web odstín neplní AA) |
| `--color-accent-soft` | `#C99C93` | tlumená růžová – **jen dekor** (tinty, avatary), ne text |
| `--color-danger` | `#B0492F` | ponecháno (bílý text 5.5:1) |
| `--color-success` | `#3C7A4E` | ponecháno (5.1:1) |
| `--color-info` | `#4E7488` | tlumené teal-modré do palety |
| `--color-border` | `rgba(31,42,46,.10)` | odvozeno z text tmavé |
| `--color-border-strong` | `rgba(31,42,46,.16)` | tamtéž |

### Typografické tokeny (vybráno, univerzální pro všechny 4 školky)

| Token | Hodnota | Pozn. |
|---|---|---|
| `--font-sans` | `"Inter", system-ui, sans-serif` | tělo + UI, čitelný do IS |
| `--font-serif` (nadpisy) | `"Bricolage Grotesque", system-ui, sans-serif` | charakterní grotesk (i přes název „serif" token) |

Pozn.: token `--font-serif` je historický název pro „nadpisový font" – hodnota je bezpatková.
Ve fázi 4.2 zvážit přejmenování na `--font-head`. Zamítnuto: Fraunces, Nunito Sans, Baloo 2,
Spectral, Zilla Slab (nadpisy); `Shadows Into Light Two`, `Itim` (podpis Vhaaji / čitelnost).

Škála (jednotná pro všechny 4 školky): h1 26/30, h2 20/26, h3 18/24,
body 15/23, label 13/18, hint 12/16 (px/px). Ladí se ve 4.2.

> **Stav: V2 schváleno.** Barvy ✅, nadpisy Bricolage Grotesque ✅, tělo/UI Inter ✅, směr UI
> whitespace + barva (sweet spot) ✅. Fáze 4.1 uzavřena. Hodnoty se přenesou do `tokens.css`
> ve fázi 4.2. Skiny sesterských školek mění **jen barevnost**; typografie je společná (BRIEF kap. 10).

---

## Komponenty a stavy (fáze 4.3 – sada rozhodnutí a pravidel)

Po aplikaci palety (4.2) sjednoceno tvarosloví a stavový vizuál. Toto je **sada rozhodnutí a
pravidel**, ne knihovna – pravidla, jak stavět, ať appky mluví jedním jazykem.

### Tokeny (tokens.css)

- **Povrchy/text:** `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-text`,
  `--color-text-muted`, `--color-text-hint`.
- **Značka:** `--color-primary`, `--color-primary-strong`, `--color-accent` (výplň),
  `--color-accent-ink` (okrová jako text), `--color-accent-soft` (rose, dekor), `--color-info`,
  `--color-on-primary` (text na primární ploše).
- **Tinty:** `--tint-green/rose/ochre/blue` (světlé kategorie/chipy).
- **Spacing:** `--space-xs/sm/md/lg` (4/8/12/16). Aktivováno tam, kde hodnota přesně sedí;
  zbytek rytmu designu je záměrně mimo škálu (5/6/9/11/13/15) – plošná migrace = vizuální změna, neděláme.
- **Typografie:** `--font-serif` = Bricolage Grotesque (nadpisy), `--font-sans` = Inter (tělo/UI).

### Stavová paleta (`--state-*`) – jeden jazyk stavů

Každý stav má `-ink` (text) a `-bg` (světlá výplň). **Nikdy nebarvit stav natvrdo – vždy přes `--state-*`.**

| Stav | Token | Význam | Použití |
|---|---|---|---|
| ok | `--state-ok-*` | pozitivní/hotovo | náhrada dostupná, omluvenka včas, uhrazeno |
| info | `--state-info-*` | naplánováno/čeká | náhrada naplánovaná, platba čeká na spárování, odpolední docházka |
| warn | `--state-warn-*` | pozor/částečně | omluvenka po deadlinu, částečně uhrazeno, dopolední docházka |
| danger | `--state-danger-*` | problém | neomluveno, po splatnosti, náhrada nevznikla |
| neutral | `--state-neutral-*` | využito/omluveno | náhrada využitá, omluveno |
| muted | `--state-muted-*` | neaktivní | expirováno, zrušeno, archivováno |
| brand | `--state-brand-*` | zvýraznění značkou | celodenní docházka, odeslaná aktualita |

Pozn.: `warn` používá `--color-accent-ink` (ne světlou `--color-accent`) – okrová jako text jinak neplní AA.

### Badge / chip

- **`.bdg`** = malý štítek stavu; modifikátor pojmenovaný doménově (`.n-dostupna`, `.om-vcas`,
  `.ne`, `.part`, `.wait`, `.sent`, `.arch`, …), ale **barva vždy z `--state-*`** (definice v CSS
  seskupené po stavech). Tentýž stav = tatáž barva ve všech třech appkách.
- **`.chip`** = docházkový kód (rodič) / inline popisek (průvodce). Barvy z **sdílené mapy `CODES`
  v `shared.js`** (`[label, ink, bg]` přes `--state-*`). Kódy: C=brand, D=warn, O=info, OM=neutral,
  NE=danger. Průvodcovy inline popisky (`codeLabel`, `dlegend`) čerpají ze stejné `CODES`.

### Toast

Jeden mechanismus napříč appkami: globální `showToast(m)` v `shared.js` → element `#toast`
(mimo `#content`, přežije re-render) + třída `.on`. (Povolená výjimka z pravidla „appky nesdílí data".)

### Typografická hierarchie (mobilní appky sjednocené)

Dvojí varianty sdílených tříd (`.tlab`, `.tval`, `.ttl`, `.ditem`, `.hint`, `.note`, …) sjednoceny
na **jednu – průvodcovskou (větší/čitelnější), ať funguje venku na mobilu**; rodičovské přepisy
smazány. Rodič i průvodce mají teď shodnou typografickou škálu.

### Empty states a potvrzení

- Každý **variabilní** seznam má smysluplný prázdný stav (`.empty`, sdílené v components.css):
  průvodce napříč obrazovkami; rodič náhrady/omluvenky. Seznamy vždy plněné seed daty empty stav nepotřebují.
- Každá **mutující akce** dává potvrzení přes `showToast` (omluvenka, docházka, plán, fond, aktuality…).

### Kolize jmen (ponecháno per-app)

`.frow`, `.gchips`/`.gchip` mají v každé appce jiný účel a nikdy se nenačítají spolu – nejsou to
sdílené komponenty, zůstávají v příslušném `screens-*.css`.

---

## Přístupnost a mikrocopy (fáze 4.4)

- **Kontrast:** všechny hlavní textové kombinace splňují **WCAG AA** (≥4.5, velký text/UI ≥3). `info`
  a `success` ztmaveny na `#496D7E` / `#387349`, ať procházejí i jako text na pozadí a krémový text na výplni.
  Hint (`--color-text-hint`) je jen pro nepodstatné hinty (≥3:1).
- **Dotykové cíle:** interaktivní prvky v mobilních appkách mají **klikací plochu ≥ 44×44 px**
  (min-height / hit-area přes `::before`; vizuál se nemusí měnit – např. `.chk` zůstává 30 px). Výjimka:
  Google-kalendář (`.gstep`/`.gcell`) drží kompaktní Google rozměry (záměrná nápodoba).
- **Focus:** `:focus-visible` (2px `--color-primary` ring) jen při klávesové navigaci; `:focus{outline:none}`
  potlačuje ring po kliknutí myší. Hlavně pro desktop/admin.
- **Oslovení:** **průvodce tyká, rodič vyká**, admin neosobní. Formát dat „D. M. RRRR".
