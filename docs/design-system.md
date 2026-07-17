# Design system — Vhaaji

Živý dokument. Vzniká ve fázi 4 (redesign dle skutečné identity). Zdroj pravdy pro
vizuál je **web školky [vhaaji.cz](https://vhaaji.cz/)**, ne prototyp ani invence modelu.
Tato první verze pokrývá **Foundations** vytěžené z webu (fáze 4.1) — návrh k odsouhlasení
designérkou (vstup V2). Tokeny prototypu se zatím **nepřepínají**.

Pracovní extrakt (logo, hero, vzorky) je v `podklady/web-extract/` (gitignore).

---

## Foundations — zdroj: web (vhaaji.cz)

### Značka / logo

Ruční **inkoustový linoryt**: holý strom tvořící kruh, dítě sedící ve větvích, dospělý
(dlouhé vlasy, zády) sahající vzhůru, pod tím rukou psané „vhaaji". Černá na průhledném
pozadí. Původní soubor `logo-vhaaji.png` (500×480, RGBA) — v distu půjde inline jako
data URI (fáze 4.2). Charakter: rukodělný, přírodní, neformální — ne korporátní.

### Barevnost (vytěženo z CSS + vzorkováno z hero akvarelu)

Web stojí na **krémovém podkladu** s **akvarelovými skvrnami** ve třech tlumených
hue — zelená, okrová, tlumená růžová/mauve — a **inkoustově tmavém** textu/patičce.

| Role na webu | Zdroj | Hodnota |
|---|---|---|
| Podkladová krémová (sekce) | CSS `background` | `#EFEEE9` |
| Světlá krémová (akvarel ground) | hero vzorek 24 % | `#D8D8C0` |
| Zelená (nejsytější blob) | hero vzorek | `#309078`–`#489078` |
| Okrová / zlatá | CSS blok + hero | `#C8BC85`, `#D8C090` |
| Tlumená růžová / mauve | hero vzorek | `#D8A890`, `#D8C0C0` |
| Tmavá inkoustová (text, patička) | CSS `background`/text | `#1F2A2E` |
| Text muted | CSS | `#888888` (na světlé neplní AA — viz níže) |
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

Pozn. k čitelnosti: **Itim** je rukodělné písmo — půvabné pro osobní tón, ale pro
hustý UI text (admin tabulky, malé labely, dlouhé seznamy) rizikové.

### Typografie napříč školkami (proč se Vhaaji fonty nepřebírají 1:1)

Typografie je **společná pro všechny čtyři školky** (skiny mění jen barvu — BRIEF kap. 10),
takže nesmí být podpisem jedné školky. Porovnání webů to potvrzuje:

| Školka | Nadpisy / display | Text / UI |
|---|---|---|
| Vhaaji | Shadows Into Light Two, IBM Plex Serif | Itim (psané) |
| Jaata | Poppins (geometrický sans) | Source Sans Pro |
| Maata | Sacramento (kaligrafie) | Open Sans |
| Kouzlo lesa | Playfair Display (serif) | Metropolis (sans) |

**Žádný font není společný** — každá školka má vlastní. Společný je jen **vzorec**:
charakterní nadpisy + **neutrální, čitelný sans na text** (3 ze 4 školek). Vhaaji s
rukodělným Itim je výjimka — právě ta špatná čitelnost v UI. Proto se Shadows Into Light
Two ani Itim **nepřebírají** jako systémové fonty; slouží jen jako reference tónu.

### Přepracovaný univerzální návrh (4.1 — čeká na V2)

- **Tělo / UI — Nunito Sans** (Google): zaoblený humanistický sans. Vřelý a „školkový",
  ale plně čitelný v malých velikostech, hustých tabulkách i dlouhých seznamech. Řeší
  Itim a odpovídá vzorci sesterských webů.
- **Nadpisy — kandidáti k výběru** (žádný nepatří jedné školce; náhled je ukazuje vedle sebe).
  První trojice **zamítnuta** (Fraunces moc generický, Nunito Sans bold a Baloo 2 moc dětské pro IS).
  Druhá trojice míří na dospělý, profesionální výraz do informačního systému:
  - **D · Spectral** (editoriální knižní serif) — klidný, sofistikovaný, dospělý; vřelost bez dětskosti, ne trendový soft-serif.
  - **E · Zilla Slab** (slab serif) — pevný, strukturovaný, „dokumentární"; sedí do systému s daty, tabulkami, platbami.
  - **F · Bricolage Grotesque** (grotesk) — jemná nepravidelnost = identita bez genericnosti; moderní, profesionální, bezpatkový.

Rozhoduje designérka (V2). Šablona náhledu má jako výchozí kandidáta D (Spectral).

### Tone of voice titulků

Neformální, lidský, přírodní. Rukodělná estetika (linoryt, akvarel, psané písmo)
napříč. Žádné ostré geometrické tvary ani korporátní čistota.

---

## Návrh mapování na tokeny prototypu (4.1 — čeká na V2)

Odvozeno z hodnot výše, doladěno na splnění **WCAG AA** (text 4.5:1, velký text/UI 3:1).
Kde web AA neplnil, uvedena nejbližší vyhovující varianta a odchylka.

| Token | Návrh | Odvození / poznámka |
|---|---|---|
| `--color-bg` | `#EFEEE9` | přímo krémový podklad webu |
| `--color-surface` | `#F9F7F1` | světlejší krém (karty) — dopočteno |
| `--color-surface-2` | `#E7E4DA` | tmavší krém (akvarel ground) — dopočteno |
| `--color-text` | `#1F2A2E` | inkoustová tmavá z webu (12.6:1 na bg) |
| `--color-text-muted` | `#5C6560` | web `#888` neplní AA → ztmaveno (5.2:1) |
| `--color-text-hint` | `#767B74` | jen nepodstatné hinty (3.7:1, ≥3:1) |
| `--color-primary` | `#2B7059` | web zelená ztmavená na AA (5.1:1 na bg) |
| `--color-primary-strong` | `#1F5344` | tmavší zelená (7.6:1) — nadpisy, důraz |
| `--color-accent` | `#C8BC85` | okrová z webu — **výplň** (tmavý text 7.7:1) |
| `--color-accent-ink` | `#6F5F1C` | okrová jako **text** (web odstín neplní AA) |
| `--color-accent-soft` | `#C99C93` | tlumená růžová — **jen dekor** (tinty, avatary), ne text |
| `--color-danger` | `#B0492F` | ponecháno (bílý text 5.5:1) |
| `--color-success` | `#3C7A4E` | ponecháno (5.1:1) |
| `--color-info` | `#4E7488` | tlumené teal-modré do palety |
| `--color-border` | `rgba(31,42,46,.10)` | odvozeno z text tmavé |
| `--color-border-strong` | `rgba(31,42,46,.16)` | tamtéž |

### Návrh typografických tokenů (univerzální, po porovnání školek)

| Token | Návrh | Pozn. |
|---|---|---|
| `--font-sans` | `"Nunito Sans", system-ui, sans-serif` | tělo + UI, univerzální, čitelný |
| `--font-serif` (nadpisy) | **kandidát D:** `"Spectral", Georgia, serif` | výchozí; nebo E / F níže |
| | **kandidát E:** `"Zilla Slab", Georgia, serif` | slab serif, robustní |
| | **kandidát F:** `"Bricolage Grotesque", sans-serif` | charakterní grotesk |

Zamítnutá 1. trojice nadpisů: Fraunces (generický), Nunito Sans bold + Baloo 2 (dětské pro IS).
Odmítnuto jako systémový font: `Shadows Into Light Two` a `Itim` (podpis Vhaaji /
špatná čitelnost v UI) — zůstávají jen jako reference tónu.

Škála (návrh, jednotná pro všechny 4 školky): h1 26/30, h2 20/26, h3 18/24,
body 15/23, label 13/18, hint 12/16 (px/px). Ladí se na náhledu.

> **Stav:** návrh čeká na schválení designérkou (V2). Po schválení se hodnoty přenesou
> do `tokens.css` ve fázi 4.2. Skiny sesterských školek mění **jen barevnost**;
> typografie je společná (BRIEF kap. 10).
