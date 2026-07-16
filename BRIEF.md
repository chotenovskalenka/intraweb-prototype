# Postup práce na low-fi prototypu a design systemu

## Kontext

Prototyp školkového informačního systému je aktuálně ve fázi **low fidelity**.
Cílem zatím není řešit finální vizuální design, barvy, typografii ani komponentovou knihovnu.

Aktuální cíl:

* doladit strukturu systému,
* zpřesnit hlavní user flows,
* ověřit logiku obrazovek,
* rozdělit HTML prototyp do lepší struktury,
* připravit základ pro pozdější nasazení UI,
* následně vytvořit Figma knihovnu a design system.

---

## Doporučené pořadí práce

```text
Low-fi struktura
→ doladění flows a obsahu
→ ověření logiky
→ nasazení UI
→ vytvoření knihovny / design systemu
```

Design system se v této fázi nemá stavět jako finální knihovna komponent.
Má se zatím vytvářet jako sada rozhodnutí, pravidel a opakujících se patternů.

---

## Co má být stabilní před nasazením UI

Před přechodem do vizuálního designu by měly být dostatečně jasné tyto oblasti.

---

## 1. Role-specific dashboardy

Dashboard nemá být univerzální.
Musí se měnit podle role uživatele.

### Rodič

Dashboard rodiče má prioritně obsahovat:

* rychlou omluvenku dítěte,
* aktuální náhrady,
* důležité info na dnešek nebo zítřek,
* relevantní aktuality jen pro danou školku/třídu,
* stav plateb nebo kulturního fondu.

### Průvodce

Dashboard průvodce má prioritně obsahovat:

* dnešní seznam dětí,
* kdo nepřijde,
* kdo spí,
* kdo jde po obědě,
* rychlý vstup do docházky,
* rychlý vstup do třídnice,
* důležité zdravotní nebo provozní poznámky.

### Vedení / administrativa

Dashboard vedení nebo administrativy má prioritně obsahovat:

* přehled kapacit,
* chybějící platby,
* systémová upozornění,
* přehled náhrad,
* provozní úkoly,
* porady a evaluace,
* upozornění na chybějící nebo nevyplněná data.

---

## 2. Hlavní user flows

Před nasazením UI je potřeba mít průchozí alespoň nejdůležitější scénáře.

### Flow 1: Průvodce zapisuje docházku v mobilu

Kontext:

* mobil,
* terén,
* les,
* špatný signál,
* jedna ruka,
* minimum času.

Flow:

```text
Otevření aplikace
→ dnešní seznam dětí
→ označení nepřítomných
→ označení dětí, které spí
→ označení dětí, které jdou po obědě
→ uložení
→ potvrzení uložení / stav synchronizace
```

Ověřit:

* dá se úkol splnit jednou rukou?
* jsou hlavní akce dostatečně rychlé?
* je jasné, co je uloženo?
* je jasné, co čeká na synchronizaci?
* nezdržuje systém v provozu?

---

### Flow 2: Rodič omlouvá dítě

Kontext:

* mobil,
* ranní shon,
* MHD,
* rychlá potřeba omluvit dítě před deadlinem.

Flow:

```text
Otevření aplikace
→ dashboard rodiče
→ tlačítko Omluvit dítě
→ výběr data
→ důvod omluvy
→ kontrola deadlinu
→ odeslání
→ potvrzení
→ informace, zda vznikla náhrada
```

Ověřit:

* rodič nemusí funkci hledat v menu,
* rozumí deadlinu,
* ví, jestli vznikla náhrada,
* ví, co se stane dál.

---

### Flow 3: Rodič kontroluje náhrady

Kontext:

* rodič nechce hledat náhrady na faktuře nebo ve zprávách,
* potřebuje jasný zůstatek.

Flow:

```text
Otevření aplikace
→ dashboard nebo sekce Docházka a náhrady
→ aktuální počet náhrad
→ seznam náhrad
→ datum vzniku
→ expirace
→ stav využití
```

Ověřit:

* rodič jasně chápe počet dostupných náhrad,
* rozumí, za co náhrady vznikly,
* ví, dokdy je může využít,
* nemusí informace dohledávat jinde.

---

### Flow 4: Admin vytváří aktualitu

Kontext:

* cílem je zabránit chaosu z WhatsApp skupin,
* aktualita nesmí být globální mišmaš,
* rodič má vidět jen relevantní zprávy.

Flow:

```text
Vytvoření aktuality
→ zadání obsahu
→ povinný výběr školky/třídy/skupiny
→ náhled příjemců
→ odeslání
→ zpráva se zobrazí jen relevantním rodičům
```

Ověřit:

* nelze odeslat zprávu bez určení příjemců,
* rodič nevidí nerelevantní obsah,
* admin ví, komu zpráva odešla,
* systém snižuje komunikační chaos.

---

### Flow 5: Vedení hledá podklady pro inspekci

Kontext:

* vedení potřebuje dohledatelnost,
* zápisy z porad a evaluace musí jít filtrovat,
* důležité informace nesmí být ztracené v dlouhých textech.

Flow:

```text
Otevření modulu Porady a evaluace
→ výběr štítku
→ výběr období
→ filtrovaný výpis relevantních zápisů nebo odstavců
→ export
```

Ověřit:

* štítky jsou srozumitelné,
* systém umí najít konkrétní typ podkladu,
* export odpovídá potřebám vedení,
* obsah není uvězněný v nestrukturovaném zápisu.

---

## 3. Objektový model

Je potřeba rozlišit, co je samostatný objekt systému a co je jen informace v detailu.

### Hlavní objekty

```text
Dítě
Rodič / zákonný zástupce
Školka
Třída / skupina
Docházka
Omluvenka
Náhrada
Aktualita / zpráva
Platba / faktura
Kulturní fond
Porada
Evaluace
Štítek / tag
Uživatel
Role / oprávnění
```

---

## 4. Důležité stavy

Stavy je potřeba definovat ještě před vizuálním designem.
Později z nich vzniknou badge, alerty, chybové hlášky, empty states a potvrzení.

### Omluvenka

```text
Včas odeslána
Po deadlinu
Čeká na potvrzení
Náhrada vznikla
Náhrada nevznikla
Zrušena
```

### Náhrada

```text
Dostupná
Naplánovaná
Využitá
Expirovaná
Nevznikla kvůli pozdní omluvě
```

### Docházka

```text
Přítomen
Nepřítomen
Nemoc
Spí
Jde po obědě
Vyzvednuto
Neuloženo
Čeká na synchronizaci
Synchronizováno
Chyba synchronizace
```

### Aktualita

```text
Koncept
Naplánovaná
Odeslaná
Odeslaná konkrétní školce/třídě
Bez určených příjemců
Archivovaná
```

### Platba

```text
Uhrazeno
Neuhrazeno
Částečně uhrazeno
Po splatnosti
Přeplatek
Storno
Čeká na spárování
```

---

## 5. Jak teď ladit low-fi prototyp

Low-fi prototyp se má hodnotit hlavně podle struktury, ne podle vzhledu.

### Kontrolní otázky

```text
Najde uživatel hlavní akci bez přemýšlení?
Je jasné, co se stane po kliknutí?
Je jasné, co je uloženo a co ne?
Vidí uživatel jen informace, které se ho týkají?
Nejsou důležité informace schované moc hluboko?
Dává navigace smysl podle role?
Jsou pojmenování srozumitelná pro reálné uživatele?
Je jasné, jaké jsou hlavní objekty systému?
Jsou ošetřené důležité stavy a výjimky?
```

V této fázi není důležité, jestli je karta vizuálně hezká.
Důležité je, jestli tam daná informace nebo akce vůbec má být.

---

## 6. Kdy přejít na UI

Na vizuální UI má smysl přejít ve chvíli, kdy platí:

```text
Víme, jaké role systém používají.
Víme, jaké jsou hlavní objekty.
Víme, jak vypadá hlavní navigace.
Máme průchozí nejdůležitější flows.
Víme, které obrazovky jsou mobile-first a které desktop-first.
Víme, jaké stavy musí systém zobrazovat.
Základní logika se už nemění každý den.
```

Nemusí být hotové všechno.
Ale neměla by se už zásadně měnit základní architektura systému.

---

## 7. Jak rozdělit HTML prototyp

Cílem rozdělení není technická dokonalost.
Cílem je, aby se s prototypem lépe pracovalo a aby AI dostávala vždy jen tu část, kterou má upravit.

### Doporučená struktura projektu

```text
/prototyp
  index.html

  /docs
    brief.md
    role-a-kontext.md
    objekty-systemu.md
    flows.md
    decision-log.md

  /sections
    dashboard-rodic.html
    dashboard-pruvodce.html
    dashboard-admin.html
    dochazka-mobil.html
    rodic-omluvenka.html
    rodic-nahrady.html
    rodic-finance.html
    komunikace-aktuality.html
    admin-porady-stitky.html
    admin-fakturace.html

  /styles
    tokens.css
    base.css
    layout.css
    components.css
    screens.css
    skins.css

  /scripts
    prototype.js
```

---

## 8. Jak značit obrazovky v HTML

Do současného prototypu je vhodné přidat jasné komentáře.

```html
<!-- SCREEN: RODIC_DASHBOARD START -->
<section data-screen="rodic-dashboard">
  ...
</section>
<!-- SCREEN: RODIC_DASHBOARD END -->

<!-- SCREEN: DOCHAZKA_MOBIL START -->
<section data-screen="dochazka-mobil">
  ...
</section>
<!-- SCREEN: DOCHAZKA_MOBIL END -->

<!-- SCREEN: ADMIN_PORADY_STITKY START -->
<section data-screen="admin-porady-stitky">
  ...
</section>
<!-- SCREEN: ADMIN_PORADY_STITKY END -->
```

Díky tomu lze AI zadat:

```text
Uprav pouze SCREEN: DOCHAZKA_MOBIL.
Neměň shell, navigaci ani ostatní obrazovky.
Vrať jen kód mezi START a END.
```

---

## 9. Jak rozdělit CSS

Nejdřív stačí rozdělení komentáři.
Fyzické soubory lze vytvořit později.

```css
/* TOKENS */
/* BASE */
/* LAYOUT */
/* COMPONENTS */
/* SCREENS */
/* SKINS */
```

### tokens.css

Proměnné a základní hodnoty:

```css
:root {
  --color-primary: #000;
  --color-surface: #fff;
  --color-border: #ddd;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;

  --radius-sm: 6px;
  --radius-md: 12px;
}
```

### base.css

Základní HTML prvky:

```css
body {}
h1, h2, h3 {}
p {}
a {}
button {}
input {}
select {}
textarea {}
```

### layout.css

Celková konstrukce aplikace:

```css
.app-shell {}
.app-header {}
.app-nav {}
.app-main {}
.page {}
.page-header {}
.page-content {}
```

### components.css

Opakovatelné prvky:

```css
.button {}
.card {}
.badge {}
.alert {}
.form-field {}
.table {}
.child-row {}
.dashboard-card {}
```

### screens.css

Specifické styly konkrétních obrazovek:

```css
.screen-attendance {}
.screen-parent-dashboard {}
.screen-admin-tags {}
```

### skins.css

Tři vizuální skiny pro tři školky:

```css
[data-skin="skolka-a"] {
  --color-primary: ...;
  --color-accent: ...;
}

[data-skin="skolka-b"] {
  --color-primary: ...;
  --color-accent: ...;
}

[data-skin="skolka-c"] {
  --color-primary: ...;
  --color-accent: ...;
}
```

Skiny mají měnit výraz značky, ne logiku systému.

---

## 10. Práce se třemi skiny

Pro tři školky nedává smysl vytvářet tři samostatné systémy.

Doporučený přístup:

```text
Jeden core systém
+ tři skiny přes tokeny
```

### Core systém zůstává stejný

Stejné má zůstat:

```text
Struktura obrazovek
Navigace
Názvosloví
Chování formulářů
Stavy
Validace
User flows
Komponenty
Pravidla pro oprávnění
```

### Skin může měnit

```text
Primary barvu
Secondary barvu
Accent barvu
Jemný background tint
Logo
Ilustrační styl
Případně míru hravosti
```

### Skin nemá měnit

```text
Umístění hlavních akcí
Logiku omluvenky
Logiku náhrad
Logiku plateb
Stavy
Validaci
Navigační strukturu
Přístupnost
```

---

## 11. Jak později vytáhnout knihovnu

Jakmile se nasadí UI, knihovna se nemá tvořit abstraktně.
Má se vytáhnout z prvních stabilních obrazovek.

Doporučené pořadí:

```text
1. Foundations
   barvy, typografie, spacing, radius, stíny, ikony

2. Core components
   button, input, select, checkbox, textarea, card, badge, alert, modal

3. Domain components
   karta dítěte, řádek docházky, stav náhrady, zpráva/aktualita, platební stav

4. Patterns
   omluvenka, docházka, náhrady, aktualita s příslušností, štítkování porady

5. Templates
   rodičovský dashboard, průvodcovská docházka, admin seznam/detail
```

Knihovna by měla vznikat z reálných obrazovek, ne před nimi.

---

## 12. Doporučený workflow s AI

Při práci s Claude/Fable neposílat celý prototyp, pokud to není nutné.

### Špatně

```text
Tady je celý index.html, uprav mi docházku.
```

### Lépe

```text
Tady je brief projektu.
Tady je pouze sekce DOCHAZKA_MOBIL.
Tady je relevantní CSS: TOKENS, COMPONENTS, SCREEN ATTENDANCE.

Cíl:
Zjednoduš flow pro průvodce, který jednou rukou zapisuje docházku v lese.

Neměň vizuální styl ani globální CSS.
Vrať pouze upravenou HTML sekci a případné doplňkové CSS.
```

---

## 13. Prompt pro Claude/Fable

```text
Pracuji na low-fi HTML prototypu školkového informačního systému.

Neřeš zatím vizuální design, barvy, ilustrace ani finální komponenty.
Cílem je doladit strukturu, user flows, obsah, stavy a logiku systému.

Důležité:
- systém je pro tři školky,
- všechny školky používají stejný core systém,
- později budou mít tři různé vizuální skiny,
- rodič a průvodce používají systém hlavně na mobilu,
- administrativa a vedení používají systém hlavně na notebooku,
- dashboard musí být specifický podle role,
- aktuality musí být filtrované podle školky/třídy,
- náhrady musí být viditelné samostatně,
- kulturní fond je oddělený od běžných faktur.

Uprav pouze část prototypu, kterou posílám.
Neměň ostatní obrazovky.
Nevracej celý systém.
Vrať pouze upravenou sekci a případné doplňkové poznámky.
```

---

## 14. Hlavní pravidlo

Cílem aktuální fáze není krásná architektura ani hotový design system.

Cílem je:

```text
AI dostane vždy jen tu část, kterou má změnit.
Hotový prototyp se nerozpadá.
Struktura zůstává pod kontrolou.
Flows jsou ověřitelné.
UI půjde později nasadit rychleji.
```

---

## 15. UX princip

Low-fi prototyp má vyřešit logiku a obsah.
UI knihovna má později chránit konzistenci a kvalitu provedení.

Pokud by knihovna vznikla moc brzy, hrozí, že se zabetonuje špatná struktura.
Teď je nejdůležitější ladit flows, stavy, názvosloví a objektový model.

Vizuální design a komponentová knihovna mají přijít až ve chvíli, kdy je jasné, co systém skutečně potřebuje dělat.
