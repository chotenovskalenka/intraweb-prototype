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
hustý UI text (admin tabulky, malé labely, dlouhé seznamy) rizikové. Návrh proto
ukazuje víc kandidátů na tělový/UI font vedle sebe (viz náhled a decision-log) —
rozhoduje designérka (V2).

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

### Návrh typografických tokenů

| Token | Návrh | Pozn. |
|---|---|---|
| `--font-display` | `"Shadows Into Light Two", cursive` | logo-blízké, řídké užití (hero) |
| `--font-serif` | `"IBM Plex Serif", Georgia, serif` | nadpisy sekcí |
| `--font-sans` | *kandidát A:* `"Itim", sans-serif` — max věrnost webu | tělo/UI |
| | *kandidát B:* Itim jen nadpisy + čitelný companion na UI | rozhoduje designérka |

Škála (návrh, jednotná pro všechny 4 školky): display 28/34, h1 22/28, h2 19/25,
h3 16/22, body 15/23, label 13/18, hint 12/16 (px/px). Ladí se na náhledu.

> **Stav:** návrh čeká na schválení designérkou (V2). Po schválení se hodnoty přenesou
> do `tokens.css` ve fázi 4.2. Skiny sesterských školek mění **jen barevnost**;
> typografie je společná (BRIEF kap. 10).
