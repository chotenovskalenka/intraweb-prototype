# Testování prototypu s průvodci — zjištění

**Kdy:** srpen 2026 · **Vzorek:** 3 respondenti z lesní školky — jeden řadový průvodce,
dva ve vedoucí roli (jeden z nich drží i agendu blízkou hospodářce).
**Jak:** moderované procházení průvodcovského prototypu na mobilu, 30–50 min, se záznamem.
**Metodika:** [skill `vyzkum-analyza`](../.claude/skills/vyzkum-analyza/SKILL.md), sekce C
(testování použitelnosti) + sekce A (generativní část). Analýza po respondentech → verifikace →
syntéza, v oddělených průchodech.

Přepisy a analýza s citacemi a jmény leží mimo git (`podklady/testování/`), stejný režim jako
`discovery/přepisy/`. Tenhle dokument je verze, ze které se má citovat.

## Jak číst míru opory

Vzorek jsou tři lidé, proto nikde nejsou procenta. „Doloženo chováním" znamená, že se
respondent u té věci skutečně zasekl nebo ji hledal — to je tvrdší doklad než souhlas s otázkou.
Chvála se do dokladů nepočítá vůbec: respondenti mluvili k autorce prototypu, kterou znají.

---

## Nálezy k opravě

| # | Nález | Opora |
|---|---|---|
| P1 | Interní záznamy o dítěti musí být oddělené od toho, co vidí rodič | **3 ze 3, nezávisle** |
| P2 | Pojmenování stavů docházky je nejednotné a matoucí | 2 ze 3, **doloženo chováním** |
| P3 | Kuchyně potřebuje na přehledu vlastní souhrn (svačiny, obědy) | 2 ze 3 |
| P4 | Chybí vlastní seznamy dětí (předškoláci, kroužky) | 2 ze 3, jeden doložen chováním |
| P5 | Alergie se špatně hledají a jsou na nevhodném místě | 2 ze 3 |
| P6 | Drobnosti: chybí zpět, odhlášení, profil průvodce; rozpis služeb špatně vyznačuje neslužbu; nelze poslat zprávu k jednomu dítěti | 1 hlas každá |

**P1** je nejsilnější zjištění celého testování — všichni tři na něj přišli sami, bez nápovědy,
a každý z jiné strany: obava z toho, jak rodič přečte poznámku z konzultace; interní
diagnostický formulář, který rodičům nepatří; a potřeba psát si upřímné poznámky o spolupráci
s rodinou. Přidává se k tomu legislativní důvod: ve veřejné části třídnice nesmí být jména dětí.

**P2** je jediné místo, kde se respondentka opravdu zasekla — odškrtla políčko „spí“ u dítěte,
nevěděla, co tím způsobila, ani jak to vrátit. Význam si odvodila až po několika pokusech.
Navržená jednotná sada: **přítomni · dopolední · odpolední · absence**. Varianta s časy byla
respondentkou odmítnuta jako méně srozumitelná.

### Co se naopak opravovat nemá
- **Vyhledávání dětí** — při dvaceti dětech ho respondentka nepotřebuje a nehledala ho.
- **Poznámky na dvou místech** — téma otevřela moderátorka, žádný respondent to nezmínil.

---

## Rozhodnutí, která nejsou v UI, ale v zadání

- **Zápis docházky patří vedoucí roli.** Prototyp ho pouštěl i řadovému průvodci. Ten potvrdil,
  že mu to v minulosti šlo, ale nedělal to — o právo nestojí. → omezit na vedoucího.
- **Ráno otevírají čtyři průvodci, ne dva** (dva dřív, dva o něco později). Pro tým je
  podstatné pořadí kvůli výměnám služeb.
- **Povinný důvod absence: tým se neshodne.** Dva respondenti pro, jeden proti; rodiče
  z dřívějšího testu také proti. Věcný důvod pro povinnost je zákonná povinnost hlásit
  infekční onemocnění, která se podle dvou respondentů dlouhodobě nedodržuje.
  **Navržený kompromis** (není to shoda, je to návrh k odsouhlasení): povinná kategorie
  nemoc / rodinné důvody / dovolená, upřesnění povinné jen u nemoci.

---

## Generativní zjištění (slabě podložená, k ověření)

Tři lidé jsou na tvrzení o tom, jak organizace funguje, málo. Bereme jako hypotézy.

1. **Zátěž z WhatsAppu nese ten, kdo odpovídá, ne celý tým.** Jeden respondent popisuje skupiny
   jako peklo, jiný říká, že mu nevadí a že se od nich umí odpojit — a skupiny u jednotlivých
   dětí aktivně brání, protože mu ukazují, co kolegové rodičům řekli. → Zrušení skupin narazí
   zevnitř. Realistický cíl je ubrat kategorie, ne kanál. *(2 hlasy proti 1)*
2. **Sdílené tabulky jsou pro část týmu bariéra, ne nepohodlí.** Kolegyně prý do tabulky
   nechodí ze strachu, že v ní něco smaže — a tím pádem není informovaná. *(1 hlas,
   zprostředkovaně)*
3. **Příprava zůstane na papíře.** Respondent má týdenní přípravu v sešitě a tematický plán
   v appce označil za hezký, ale pro sebe zbytečný — s odůvodněním, že před dětmi v kruhu
   do mobilu koukat nebude. Potvrzuje tabu telefonu z dřívějšího výzkumu. *(1 hlas)*
4. **Odborné zprávy se ručně změkčují** předtím, než je dostane rodič. Vysvětluje to, proč je
   P1 podmínkou upřímného zápisu, ne administrativním detailem. *(1 hlas)*
5. **Akce se zadávají dvakrát až třikrát** — do intrawebu a do dvou sdílených kalendářů.
   Navrhované řešení: jeden veřejný kalendář, interní věci v intrawebu. *(2 ze 3)*
6. **Rodiče dlouhodobě nehlásí infekční nemoci.** Věcný důvod za sporem o povinný důvod
   absence. *(2 ze 3)*

---

## Co tahle data neříkají

- **Nic o úspěšnosti úkolů.** Ani jeden úkol neproběhl bez vstupu moderátorky; u dvou ze tří
  šlo spíš o společné procházení než o test. Procenta se z toho počítat nedají.
- **Nic o řadových průvodcích obecně** — v té roli byl jen jeden respondent a prototypem
  prošel rychle, bez zaseknutí.
- **Nic o rodičích.** Vše, co tu o nich zaznělo, je z pohledu průvodců nebo zprostředkovaně.
- **Nic o dlouhodobém používání.** Nadšení z prvního setkání s prototypem není doklad, že to
  vydrží v provozu.

## Poznámky k metodě (pro příští kolo)

- Moderátorka na řadě míst vysvětlila funkci dřív, než na ni respondent narazil. Takové pasáže
  nemůžou dokládat srozumitelnost a v analýze jsou označené zvlášť.
- Zadat úkol a mlčet. Nejcennější data vznikla tam, kde respondentka klikala sama a nahlas
  popisovala, co čeká.
- U jedné nahrávky je nespolehlivé přiřazení mluvčích — před citováním v case study ověřit
  proti zvuku.
