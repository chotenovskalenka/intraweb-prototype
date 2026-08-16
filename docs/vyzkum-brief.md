# Brief pro průchod výzkumem

**K čemu je:** startovní bod pro samostatnou session, ve které se projde kvalitativní výzkum
k Vhaaji krok za krokem. Shrnuje, co už je z podkladů přečtené, ať se to nemusí objevovat znovu.

**Dva cíle, které je dobré nemíchat:**

1. **Kvalita metody** – jak byl výzkum vedený, co drží, co by šlo dnes udělat jinak.
   Byl to první větší výzkum designérky (kurz kvalitativního výzkumu, celoživotní vzdělávání MUNI).
2. **Materiál pro case study** – které citace nesou příběh, jak to napojit na prototyp.

Doporučené pořadí: **nejdřív kvalita, pak case study.** Reflexe metody („tohle bych dnes udělala
jinak, protože…") je sama o sobě silný obsah pro case study – čtivější než hladká prezentace
hotových zjištění.

---

## Materiály

| Co | Kde | Stav |
|---|---|---|
| Export Miro boardu (618 řádků) | `podklady/1. tým – Intranet školky.csv` | **přečteno**, shrnuto níž |
| Přepisy rozhovorů | zatím nedodané | doplnit před session |
| Research brief, stakeholder interview | odkazy na Google Docs uvnitř boardu | nepřečteno |
| Printscreeny produkčního intrawebu | odkaz na Drive uvnitř boardu | nepřečteno |

`podklady/` je v `.gitignore` – obsahuje osobní údaje a do veřejného repa nesmí.
**Do dokumentace patří zjištění, ne surová data.**

---

## Co už je z boardu přečtené

### Zadání výzkumu

Síť školek Terezy Vavřečkové: **Maata Modrá, Maata Zelená** (kamenné), **Jaata, Vhaaji** (lesní),
plus **Kouzlo lesa**. Intraweb vznikl původně jen pro Maatu a postupně se rozšiřoval.

Výzkumný problém: intraweb je málo využívaný, informace jsou roztříštěné mezi intraweb, Google
tabulky a WhatsApp. **Průvodci pracují ze 70 % na mobilu**, kde intraweb není použitelný. Jeden
průvodce drží odhadem 30 WA skupin, Terka 350.

Respondenti: **7 očíslovaných** (průvodci, rodiče, hospodářka) + **Terka** (majitelka, zadavatelka)
+ **Pat** (vývoj intrawebu, zároveň rodič). Hloubkové rozhovory 60 minut.

### Klíčová hodnota, ze které plyne skoro všechno

**Telefon před dětmi je tabu.** Není to nepohodlí, je to hodnota lesní pedagogiky.

> „Když odepisujeme rodičům, jdeme zalézt, aby nás děti neviděly na mobilu." — R1
> „Na kontrolu docházky má tak 30 sekund, nechci koukat před dětmi do telefonu." — R7
> „Mě je hrozně nepříjemný vyndat ten telefon a dávat tam neomluveno, když už jsem tady s dětma." — R3

Insight z boardu: **„Informace o docházce nesmí být hledaná, musí být hned viděna."**

### Hlavní insighty (formát I saw / I know / Insight)

- **Docházka:** informace nesmí být hledaná, musí být hned viděna.
- **Náhrady:** pravidlo existuje, ale reálné počty jsou vidět jen na fakturách. Nerozumí jim skoro
  nikdo – průvodci posílají rodiče dál, Radka je jediná počítá ručně.
- **Fotky:** dostává je jen ten, kdo přijme Facebook. Tři z pěti mají výhradu k Metě, ale nahlas
  si nikdo nestěžuje.
- **Třídnice:** žije ze čtení všech, ale padá na zápisu – ten musí vzniknout ve chvíli, kdy je
  průvodce u dětí a klid není. Proto se píše zpětně.
- **Kulturní fond:** zátěž není v odečtu peněz, ale v ručním dohledávání, kdo kde byl.
- **Poznámky u docházky:** selhávají kvůli tichu. Bez notifikace je nikdo nečte, takže i ohleduplný
  rodič nakonec píše do WhatsAppu.
- **WhatsApp:** když vypadá vše stejně důležitě, musíš sledovat vše. Nechybí klid, chybí rozlišení.
  Ztlumení je iluze – nepřečtená zpráva drží pozornost.
- **Kalendář:** řešení není přidat kalendář, ale udělat ho tak dobrý, aby nahradil ten Google.
  (Kalendář v intrawebu už existuje a je „po ničemu".)
- **Cesta k dokumentům:** lidé nehledají dokument tam, kde leží, ale tam, kde žijí – přes odkaz
  v záhlaví WA skupiny, ne přes Disk.
- **Intraweb celkově:** „funguje" jen proto, že od něj nikdo nic nečeká. Je vnímaný jako úložiště
  dat, ne jako nástroj.

---

## Jak to sedí na prototyp

### Potvrzeno výzkumem (prototyp to trefil, aniž by o výzkumu věděl)

| Co v prototypu | Opora ve výzkumu |
|---|---|
| Počty na první obrazovce dashboardu | „informace nesmí být hledaná, musí být hned viděna" |
| Rozlišení spáč / nespáč + počet do maringotky | tři respondenti nezávisle, R1 R2 R3 |
| Zůstatek náhrad jako velké číslo u rodiče | „Víš, kolik máš náhrad? Ne." (R5); HMW z boardu |
| Odečet z fondu předvyplněný podle docházky | „zátěž je v ručním dohledávání, kdo kde byl" |
| Fotky přes Drive, ne Facebook | tři z pěti mají výhradu k Metě |
| Básnička a písnička na dashboardu | „dostat se přes ta tři místa k básničce" (R2) |
| Poznámky od rodičů viditelné u dítěte | „poznámky selhávají kvůli tichu" |

### Vyvráceno

**Počítadlo opakování svačin (`↻ 6×`)** – měří špatnou věc. Svačinářka neplánuje podle četnosti,
ale podle programu:

> „Jídelníček zohledňuju podle měsíčního plánu Modré Máty – kdy jdou na výlet, co pečou.
> **Když je jejich vaření sladké, snažím se, aby druhá svačina byla slaná.**" — R6

Užitečnější by bylo u dne ukázat **výlet nebo pečení**, ne frekvenci.
Jména alergiků u jídla naopak sedí: *„potřebuji rychle extrahovat předškoláky nebo alergiky"* (Terka).

### Nepokryto prototypem

- **Třídnice** – ve výzkumu nejoceňovanější nástroj vůbec („to většina školek nemá"), průvodci ji
  aktivně čtou. Prototyp ji má vědomě odloženou. **Největší rozpor mezi výzkumem a prototypem.**
- **Onboarding nových rodičů** – nikdo neví, kdo ho dělá; rodiče nevědí, kde je brožurka.
- **Rozlišení důležitosti zpráv** – jádro whatsappové bolesti, prototyp neřeší.

---

## Otevřené otázky pro průchod

1. **Drží insighty?** Board obsahuje hotové „I saw / I know / Insight". Sedí ten skok od pozorování
   k závěru, nebo je někde přeskočený krok?
2. **Nasycení.** Sedm respondentů – kde se odpovědi opakovaly a kde stojí zjištění na jednom hlasu?
   (Např. plánování jídelníčku má **jediný zdroj – R6**.)
3. **Vzorek.** Kolik rodičů, kolik průvodců, kolik z vedení? Byly zastoupené všechny školky?
4. **Návodnost otázek.** Board obsahuje i otázky – dá se z nich poznat, kde odpověď napovídaly?
5. **Co se do syntézy nevešlo.** Tohle odpoví až přepisy.

---

## Jak session vést

- **Nechat si nejdřív přečíst všechno a říct nezaujatý dojem**, teprve pak procházet po fázích.
  Jinak se rovnou obhajuje, co už na boardu je.
- **Nedělat to na jeden zátah.** Rozhovory jsou dlouhé; lepší jedna session na přečtení a hrubý
  obraz, druhá na detailní průchod.
- **Držet oddělené, co je zjištění a co interpretace.** Pro case study je to rozdíl mezi
  „respondenti říkali" a „z toho jsme usoudili".

## Čím tenhle dokument není

Není to náhrada za přečtení podkladů. Board je **syntéza** – někdo z něj už vytáhl citace a
insighty. Přepisy přidají nuance a možná něco, co se do syntézy nevešlo, ale směr popsaný výš
nejspíš nezmění.
