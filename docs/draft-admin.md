# Draft – admin appka (vedení a administrativa)

**Stav:** návrh k diskusi, nic z toho není postavené. Vychází ze tří zdrojů:

1. **27 screenů produkčního intrawebu** (`screenshots/`, gitignored – jsou na nich reálná jména).
2. **Výzkum** (`podklady/1. tým – Intranet školky.csv`, shrnutí v `vyzkum-brief.md`).
3. **Co už stojí:** `src/scripts/admin/` má hotový Přehled, Novinky a Porady; Platby a Náhrady
   jsou placeholder. `plan-faze-5.md` § 5.3 je zatím vymezuje jako read-only přehledy.

Postup čtení: nejdřív **kdo to používá a na co**, pak **co dnes intraweb umí**, pak **co z toho
výzkum potvrzuje jako bolest**, a teprve z toho **návrh sekcí** s prioritou. Na konci otevřené
otázky pro Terku a Pata.

---

## 1. Kdo appku používá

Z výzkumu nejde o jednu roli „vedení", ale o **čtyři různé práce**, které dnes dělají různí lidé
na různých školkách a často je kombinují s průvodcovstvím:

| Práce | Kdo | Čím to dnes dělá | Hlavní bolest |
|---|---|---|---|
| **Majitelka / dohled** | Terka | intraweb na desktopu, papírový diář, Google tabulky; pracuje v noci | „dětí mám 75, potřebuju to rychle a jasně dohledat"; výkazy pro MŠMT 4× ročně; vše pod značkou Maata, i když jsou to různé školky |
| **Fakturace** | Radka (Maata + Jaata), Eva (Vhaaji) | intraweb 1–2 dny na začátku měsíce; Google tabulka splatností; upomínky e-mailem | stravné je pokaždé jiná částka → nejvíc faktur po splatnosti; ruční párování plateb; rodiče píšou „nemám zaplaceno", i když mají |
| **Náhrady** | Radka (jediná, kdo počítá), Eva (všímá si výkyvů) | ruční tabulka za celou síť (`Náhrady.xlsx`, ~100 dětí, sloupce Připsáno / Čerpáno / Zbývá) | „intraweb tam něco píše, ale jsou to bludy"; nejtěžší je spočítat nárok dítěte s kombinovanou docházkou; záporné zůstatky až −84 h |
| **Matrika a zápis** | Eva, Terka | papírová přihláška → ruční přepis do intrawebu; údaje na třech místech | rodné číslo v intrawebu, adresa u rodiče, místo narození na papíře; export pro MŠMT ZIP |

Vedle toho existují **hospodářky** (Ksenia – obědy, Lena) a správkyně **kulturního fondu** (R3 –
vede ho na osobním účtu a v tabulce, chce automatické párování). Fond je v prototypu v
průvodcovské appce (role hospodářky), takže ho sem netahám.

**Důsledek pro návrh:** appka má sekce podle *práce*, ne podle *osoby*. Kdo má kterou práci,
je věc oprávnění, ne struktury.

---

## 2. Co dnes intraweb umí (ze screenů)

Stručně, aby bylo vidět, co se **přebírá**, co **zjednodušuje** a co **vynechává**:

**Veřejná část (stejná pro lektora, vedení, rodiče – liší se jen oprávněním)**
- **Nástěnka** – karty s barevným kódováním (Informace / Akce), modal s WYSIWYG editorem, zaškrtávání
  „odeslat e-mailem" po třídách, „zobrazit rodičům" ano/ne. Terka: *„barevné kódování nikdo nepojme",
  „nástěnka není využívaná, je smíchaná".*
- **Docházka** – měsíc na dítě (manažerský pohled) / týden na třídu (lektorský) s přeškrtnutými
  změnami a součty za den. Terka sem chodí *„v období nemocí – kvůli průvodcům, spíš dohled"*.
- **Vyúčtování** – měsíční mřížka dítě × den s kódy (13L/15L/17L/O/N), dvě akce: *Vystavit vyúčtování
  stravného za tento měsíc* a *Vystavit předpis školného na další měsíc*; pod tím součty (obědy 280×,
  stravné 32 560 Kč, školné 187 056 Kč) a fajfky, za kterou školku už je vystaveno. Vedle seznam
  faktur (3 039 položek, filtr školky/druhu/období, sloupec *Odesláno*, stáhnout/upravit/smazat).
- **Kalendář** – měsíc s narozeninami, svátky, akcemi. Terka: *„úplně nevyužitý, po ničemu"*.
- **Nastavení → Uživatelé** (525 účtů: dítě, rodič, lektor, vedení, admin), **Školní matrika** (sběr
  k 30. 9., export pro MŠMT ZIP po školkách), **Svátky a zavřeno**, **Změna údajů**.

**Administrace (jen admin)**
- **Typy docházky:** Dopolední / Odpolední / Celodenní + lesní varianty (13, 15, 17 / 13L, 15L, 17L),
  limit změny 20:00, *„počet dnů pro výpočet náhrad: 300"*.
- **Třídy:** 6 tříd (Jaata 12, Kouzlo lesa 15, Modrá 12, Vhaaji 14, Vhaaji žlutá 15, Zelená 5),
  u každé max. počet dětí a povolené typy docházky. *„Po dosažení maximálního počtu dětí ve třídě
  již nelze přidávat náhrady do příslušného dne."* – limit pro náhrady tedy existuje, ale R6 říká,
  že se přihlásí víc dětí, než je limit.
- **Školné:** cena za hodinu podle počtu dnů v týdnu, per třída; slevy sourozenec 20 %,
  zaměstnanec 40 % / 20 %.
- **Strava / Stravné:** oběd, svačina dopolední, svačina odpolední; jednotky × cena per třída × typ
  docházky (Vhaaji: oběd 90, svačina 20; Kouzlo lesa 70/20/15).
- **Faktury:** dodavatel a účet per třída (dvě právnické osoby: Dětský klub Maata o.s., Kouzlo lesa
  s.r.o.), text faktury, **párování plateb přes e-mail z banky** (IMAP). Terka: *„na neofiko intrawebu
  nemám zprovozněný token pro platby, takže všechny faktury tu jsou jako neuhrazené."*
- **E-maily:** šablony (událost, nástěnka, vyúčtování, upomínka po splatnosti, změna poznámky).
- **Oprávnění:** role × zdroj × operace, 94 řádků. Role: registrovaný, administrátor, dítě,
  externista, lektor, rodič, vedení, vedoucí třídy.

**Co z toho Terka chválí:** *„když chci změnit cenu, dvěma kliknutími jdu tam a změním ji –
uživatelsky hrozně příjemně udělané."* Samoobslužné nastavení cen a typů je **hodnota, kterou
nesmíme ztratit**, i když ji v prototypu nebudeme stavět celou.

---

## 3. Co výzkum říká o bolestech vedení

Seřazeno podle síly důkazu (kolik hlasů, jak konkrétní):

1. **Náhrady nikdo nepočítá – kromě Radky ručně.** Pět nezávislých hlasů (Terka, R2, R3, R5, R6,
   R7). Pravidlo *„20 % z absencí"* existuje v manuálu, ale tým o něm nevěděl; průvodci posílají
   rodiče dál; rodič: *„Víš, kolik máš náhrad? Ne."*; systém dovolil náhradu dítěti, které ji nemělo.
   Terčin návrh: **paušál hodin za rok podle typu docházky** (např. 30 h dopolední / 80 h odpolední)
   místo počítání z 5 a 5. R6: *„nejnáročnější je spočítat, na kolik hodin má každé dítě nárok."*
   → Tohle je **nejsilněji doložená bolest v celém výzkumu** a je to přesně práce pro software.

2. **Platby: ruční evidence, ruční párování, ruční upomínky.** Radka vede splatnosti v tabulce,
   neplatičům píše e-mail a další upomínka *„jde zase za měsíc"*; stahuje ZIP faktur a tiskne pro
   účetní; stravné je problém, protože je pokaždé jiné. Rodiče píšou, že nemají zaplaceno, i když
   mají – protože párování přes banku neběží. HMW z boardu: *„navrhnout platby tak, aby je R3 vůbec
   nemusela evidovat ručně."*
   → Silná bolest, ale řešení závisí na technice (párování s bankou) → **otázka pro Pata**.

3. **Matrika a výkazy.** Terka: výkazy pro MŠMT 4× ročně *„mě štvou"*; údaje o dítěti na třech
   místech; přihláška je papírová a přepisuje se; nápad *„rodiče vyplní dotazník a rovnou se to
   přepíše"*. Terka: *„potřebuju rychle extrahovat předškoláky nebo alergiky."*
   → Konkrétní, ale jeden až dva hlasy. Střední priorita.

4. **Dohled nad docházkou napříč školkami.** Terka se dívá na docházku v období nemocí, kvůli
   průvodcům. R6: denní limit dětí 12, intraweb ho nehlídá. Radka potřebuje, aby poznámka rodiče
   *„odchod před obědem"* ovlivnila podklady platby.
   → Spíš *pohled* než *práce*; patří na dashboard nebo do Platby, ne jako samostatná sekce.

5. **Značka.** Terka: *„všude logo dětský klub Máta – pro rodiče matoucí; není v pořádku, že je to
   všechno na jedné hromadě."*
   → Admin vidí všechny školky, ale **každý výstup (faktura, novinka, e-mail) odchází pod značkou
   své školky**. Toto už prototyp částečně dělá (výběr školky u novinky).

6. **Co výzkum NEpotvrzuje jako prioritu:** kalendář v intrawebu („po ničemu"), kroužky („nechytly
   se, každý má WA skupinu"), oprávnění (technická věc pro Pata), chat v intrawebu (Terka chce
   WhatsApp zachovat).

---

## 4. Návrh struktury appky

### Navigace (sidebar)

```
Přehled                  hotovo – upravit obsah (viz 4.1)
Platby                   NOVÉ – priorita 2
Náhrady                  NOVÉ – priorita 1
Děti a matrika           NOVÉ – priorita 3
Novinky                  hotovo
Porady a evaluace        hotovo
Nastavení                NOVÉ – priorita 4 (jen to, co Terka chválí: ceny, typy, kapacity)
```

Pořadí v menu je podle *frekvence použití* (platby a náhrady jsou měsíční rutina), ne podle
priority stavby. Současné pořadí (Novinky hned za Přehledem) odpovídá tomu, co bylo hotové první.

### 4.1 Přehled – co upravit

BRIEF chce kapacity, chybějící platby, systémová upozornění, náhrady, úkoly, porady, chybějící
data. To je hodně. Z výzkumu plyne jiné kritérium: **dashboard ukazuje to, co vyžaduje akci tento
týden**, ne všechno, co existuje.

Navrhuji ponechat a zostřit:
- **Platby k řešení** – jen po splatnosti a čekající na spárování, s počtem a celkovou částkou,
  proklik do Platby. (Ne seznam všech neuhrazených – ten je v sekci.)
- **Náhrady – výkyvy** – děti se záporným zůstatkem nebo s čerpáním výrazně nad průměrem (to je
  přesně to, čeho si *„všímá Evička ve druhém nebo třetím měsíci"* – appka to má vidět hned).
- **Kapacity** – ponechat, funguje.
- **Chybějící data** – děti bez kompletní matriky (před sběrem 30. 9.), faktury neodeslané.
- **Dnes ve školkách** – počty dětí a průvodců per školka (Terčin *„dohled"*), jeden řádek na školku.

Vyhodit nebo zmenšit: provozní úkoly (nikdo je ve výzkumu nezmínil), poslední porady (má vlastní
sekci).

### 4.2 Platby (priorita 2)

**Co to je:** měsíční cyklus fakturace napříč školkami – *podklady → vystavit → odesláno →
uhrazeno / po splatnosti → upomínka*. Objekt „Platba" se stavy z BRIEF kap. 4 (uhrazeno,
neuhrazeno, částečně, po splatnosti, přeplatek, storno, čeká na spárování).

**Obrazovka:** tabulka faktur (vzor `.dtab` z průvodcovské appky – řazení, filtry jako podtržený
řádek s počty, CSV export). Sloupce: dítě, školka, druh (školné / stravné), období, částka,
splatnost, stav, odesláno. Filtry: školka × druh × stav. Nahoře měsíc (stepper `.dnav`) a souhrn
za měsíc (vystaveno / uhrazeno / po splatnosti, částky).

**Akce (v prototypu simulované):**
- *Vystavit stravné za [měsíc]* a *Vystavit školné na [měsíc+1]* – dvě tlačítka jako dnes, ale
  s náhledem *„vystaví se 48 faktur, 3 děti mají poznámku ‚odchod před obědem' – zohlednit?"*
  To je přesně Radčina poznámka.
- *Poslat upomínku vybraným* – hromadně, s náhledem šablony; dnes ručně e-mailem.
- *Stáhnout pro účetní* – ZIP za měsíc a školku; dnes to Radka dělá ručně.
- *Označit jako uhrazeno* – ruční párování, když banka neběží; s poznámkou „spárováno ručně".

**Co vynechat:** editor faktury, nastavení dodavatelů a účtů, IMAP párování – to je Patova
infrastruktura, v prototypu jen stav „čeká na spárování" a tlačítko.

**Riziko:** bez odpovědi od Pata, jestli párování s bankou půjde zprovoznit, může celá sekce
zůstat u „evidence, kterou Radka stejně vede v tabulce". Proto priorita 2, ne 1.

### 4.3 Náhrady (priorita 1)

**Co to je:** Radčina tabulka, ale počítaná appkou. Per dítě: *připsáno* (z omluvených absencí
podle pravidla), *čerpáno* (z docházky navíc), *zbývá* – v hodinách, jak to vede Radka. Napříč
školkami, s filtrem školky/třídy.

**Obrazovka:** tabulka dětí (`.dtab`): dítě, školka/třída, typ docházky, připsáno, čerpáno, zbývá,
poslední náhrada. Řazení podle *zbývá* (záporné nahoru) a podle *čerpáno*. Filtry: školka,
„jen záporné", „jen bez čerpání". CSV export = to, co dnes Radka má ručně.

**Detail dítěte:** historie – kdy náhrada vznikla (z jaké omluvenky), kdy se čerpala (jaký den
navíc), kdo to zadal. To je ta *„validace"*, kterou chce R2, a *„rozumím, za co náhrady vznikly"*
z Flow 3 pro rodiče – stejná data, dvě appky.

**Pravidlo:** v nastavení sekce (ne v globálním Nastavení) přepínač mezi dnešním *„20 % z absencí"*
a Terčiným *„paušál hodin za rok podle typu docházky"*, s náhledem, jak by to změnilo zůstatky.
To je rozhodnutí, které Terka chce udělat, a prototyp jí ho může ukázat na datech.

**Návaznost na kapacitu:** den, kdy je třída na maximu, nedovolí další náhradu – to intraweb
deklaruje, ale R6 říká, že to nefunguje. V prototypu: u čerpání ukázat obsazenost dne.

**Proč priorita 1:** nejvíc hlasů, jasný objekt, existuje reálná tabulka pro validaci
(`Náhrady.xlsx` – 100 řádků, struktura Připsáno/Čerpáno/Zbývá/Třída), a výsledek se dá ukázat
Radce s otázkou *„sedí to s tím, co máš?"*. Zároveň odblokuje Flow 3 (rodič vidí náhrady) –
dnes je rodičovský zůstatek jen seed.

**Pozor:** `Náhrady.xlsx` obsahuje reálná jména – do seed dat jdou jen struktura a rozložení čísel
(kolik dětí je v záporu, typická výše), ne jména.

### 4.4 Děti a matrika (priorita 3)

**Co to je:** jeden seznam dětí napříč školkami s údaji, které dnes leží na třech místech –
a **export pro MŠMT** (sběr k 30. 9., ZIP per školka), který Terka dělá 4× ročně a nenávidí.

**Obrazovka:** tabulka (`.dtab`, stejná jako Děti v průvodcovské appce, ale napříč školkami):
dítě, školka/třída, narozen, typ docházky, předškolák, alergie, **kompletnost matriky** (zelená /
chybí X). Filtry: školka, předškoláci, alergici (Terčino *„rychle extrahovat"*), nekompletní.
Detail: kmenová data + rodiče + dokumenty.

**Akce:** *Export pro MŠMT* (v prototypu stáhne CSV se sloupci výkazu), *Pozvat rodiče k vyplnění*
(Terčin nápad s dotazníkem – v prototypu jen odkaz, v rodičovské appce by se objevil formulář).

**Co vynechat:** správu uživatelských účtů (525 řádků, hesla, blokace) – to je Patova
administrace.

### 4.5 Nastavení (priorita 4)

Jen to, co Terka výslovně chválí jako samoobsluhu: **ceny školného a stravného, typy docházky,
kapacity tříd, svátky a zavřeno**. Jedna obrazovka se záložkami, tabulky s inline editací.
Bez oprávnění, e-mailových šablon, dodavatelů – to zůstává v Patově administraci.

V prototypu stačí *ukázat, že to tam je* (jedna záložka funkční, ostatní statické), aby při
testování s Terkou bylo jasné, že o tuhle hodnotu nepřijde.

---

## 5. Co záměrně NEdělat

- **Docházku jako samostatnou sekci.** Zadávání je v průvodcovské appce; vedení potřebuje jen
  pohled (dashboard) a dopad na platby.
- **Kalendář.** V prototypu je sdílený Google kalendář u rodičů i průvodců; vedení nic dalšího
  nepotřebuje – Terka má diář.
- **Kroužky, chat, oprávnění, uživatelské účty, e-mailové šablony.** Buď se nechytly, nebo jsou
  infrastruktura.
- **Fakturační modul** (editor faktury, číselné řady, účty). Prototyp simuluje vystavení,
  nevystavuje.

---

## 6. Otevřené otázky

**Pro Terku**
1. Pravidlo náhrad: zůstat u 20 %, nebo přejít na paušál hodin podle typu docházky? Chce to
   vidět na datech?
2. Kdo všechno má mít práva na Platby a Náhrady – jen Radka a Eva, nebo i vedoucí průvodci?
3. Má vedení vidět kulturní fond všech školek, nebo zůstává u hospodářky školky?

**Pro Pata**
4. Párování plateb s bankou – dá se zprovoznit (Fio API / e-mailové avízo)? Bez toho je stav
   „uhrazeno" vždycky ruční.
5. Jak dnes intraweb počítá náhrady a proč se to rozchází s Radčinou tabulkou? (R6: *„bludy"*.)
   Je to chyba výpočtu, nebo chybějící vstupy?
6. Export pro MŠMT – jaký je formát a co všechno z něj chybí v datech (místo narození…)?
7. Jeden intraweb pro všechny školky, nebo oddělené instance (Terka: *„školky by měly být
   rozdělené"*)? Ovlivňuje, jestli je „napříč školkami" v adminu samozřejmost nebo funkce.

**Pro nás**
8. Ověřit s Radkou strukturu Náhrad nad jejími daty dřív, než se postaví detail.
9. Rozhodnout, zda Platby stavět před odpovědí od Pata (jako „evidenci") nebo počkat.

---

## 7. Navržené pořadí stavby

| Krok | Co | Proč první |
|---|---|---|
| 1 | **Náhrady** – tabulka + detail + přepínač pravidla | nejsilnější důkaz, validovatelné nad reálnou tabulkou, odblokuje Flow 3 |
| 2 | **Přehled** – zostřit na „co vyžaduje akci" | levné, využije data z kroku 1 |
| 3 | **Platby** – tabulka + měsíční souhrn + simulované akce | druhá největší bolest; akce bez Pata jen simulované |
| 4 | **Děti a matrika** – tabulka + export | jeden až dva hlasy, ale konkrétní a jednoduché |
| 5 | **Nastavení** – jedna funkční záložka (ceny) | aby Terka viděla, že o samoobsluhu nepřijde |

Každý krok je samostatně testovatelný s jedním člověkem: 1 s Radkou, 3 s Radkou/Evou, 4–5 s Terkou.

Technicky: všechny sekce jsou tabulky s filtry, řazením a exportem – vzor `.dtab` / `.filters` /
`.vhead-row` / `stahniCSV()` z průvodcovské appky je v `components.css` a `shared.js`, admin ho
načítá. Stavba je tedy hlavně o datech a pravidlech, ne o komponentách.
