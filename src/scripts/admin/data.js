/* DATA: ADMIN — seed pro appku vedení/administrativy (tři školky).
   Data se s ostatními appkami NESDÍLEJÍ; kde to dává smysl, čísla sedí s mobilními appkami
   (např. Eliška Dvořáková má neuhrazenou fakturu za březen — viz rodic/data.js). */

const TODAYD=3;                    // St 3. 6. 2026 — shodný simulovaný čas jako ostatní appky

/* Tři sesterské školky: obsazenost/kapacita a třídy/skupiny.
   Vhaaji sedí s průvodcovskou appkou (25 dětí). */
const SKOLKY=[
  {id:'vhaaji',nazev:'Vhaaji',kapacita:28,tridy:[
    {n:'Lišky',obs:13,kap:14},
    {n:'Veverky',obs:12,kap:14},
  ]},
  {id:'jaata',nazev:'Jaata',kapacita:24,tridy:[
    {n:'Sluníčka',obs:12,kap:12},
    {n:'Kapky',obs:12,kap:12},
  ]},
  {id:'maata',nazev:'Maata',kapacita:20,tridy:[
    {n:'Sovy',obs:9,kap:10},
    {n:'Ježci',obs:7,kap:10},
  ]},
];
const obsazeno=s=>s.tridy.reduce((n,t)=>n+t.obs,0);

/* Stavy platby (BRIEF kap. 4). Fakturační modul se nedělá — dashboard jen přehled
   „řeší se mimo appku". Eliška Dvořáková: Březen 2026, 5987 Kč (7983 − 1996 sleva) = shoda s rodic/data.js. */
const PLATBASTAVY={
  'po-splatnosti':{lab:'Po splatnosti',cls:'al'},
  'neuhrazeno':{lab:'Neuhrazeno',cls:'ne'},
  'castecne':{lab:'Částečně uhrazeno',cls:'part'},
  'ceka':{lab:'Čeká na spárování',cls:'wait'},
};
const PLATBY=[
  {dite:'Eliška Dvořáková',skolka:'Vhaaji',obdobi:'Školné · Březen 2026',castka:5987,stav:'po-splatnosti',poDnu:80},
  {dite:'Kuba Svoboda',skolka:'Vhaaji',obdobi:'Školné · Květen 2026',castka:5987,stav:'neuhrazeno',poDnu:19},
  {dite:'Tomáš Beran',skolka:'Jaata',obdobi:'Školné · Květen 2026',castka:8200,stav:'castecne',uhrazeno:4000,poDnu:19},
  {dite:'Ela Marešová',skolka:'Maata',obdobi:'Školné · Duben 2026',castka:7500,stav:'ceka',poDnu:0},
];

/* Systémová upozornění vč. chybějících / nevyplněných dat. */
const UPOZORNENI=[
  {typ:'data',text:'U 2 dětí chybí kontakt na zákonného zástupce',skolka:'Vhaaji'},
  {typ:'data',text:'U 1 dítěte chybí podepsaný GDPR souhlas',skolka:'Maata'},
  {typ:'provoz',text:'Jaata je plně obsazená — 3 rodiny v pořadníku',skolka:'Jaata'},
  {typ:'system',text:'Záloha dat proběhla v pořádku (3. 6. 04:00)',skolka:''},
];

/* Souhrn náhrad napříč školkami (detail přijde v sekci Náhrady). */
const NAHRADY_SUM={dostupne:14,expiruje30:3,naplanovane:5};

/* Provozní úkoly — jednoduchý checklist, odškrtávání funguje v paměti (mizí po reloadu). */
let UKOLY=[
  {t:'Objednat sezónní ovoce na červen (všechny tři školky)',done:false},
  {t:'Revize lékárniček — Vhaaji a Maata',done:false},
  {t:'Odeslat účetní podklady za květen',done:true},
  {t:'Připravit rozpis letního provozu',done:false},
  {t:'Potvrdit termín inspekce ČŠI',done:false},
];

/* Poslední porady a evaluace — pro dashboard stačí titulky, plná data přijdou v 3.3. */
const PORADY=[
  {datum:'2. 6. 2026',typ:'porada',titul:'Provozní porada — červen',skolka:'Vhaaji'},
  {datum:'19. 5. 2026',typ:'evaluace',titul:'Čtvrtletní evaluace pedagogů',skolka:'Jaata'},
  {datum:'5. 5. 2026',typ:'porada',titul:'Bezpečnost a revize prostředí',skolka:'Maata'},
];
