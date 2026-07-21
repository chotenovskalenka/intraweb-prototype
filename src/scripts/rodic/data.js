/* DATA: RODIC — seed data + čisté datové helpery sdílené více obrazovkami */
const ORDER=['D','O','C','OM','NE'];

/* --- Simulovaný čas + omluvenka/náhrada model (fáze 1) --- */
const NOW={d:3,h:10};                 // „teď" = St 3. 6. 2026, 10:00 (žádné Date.now())
const beforeDeadline=d=>d>NOW.d+1||(d===NOW.d+1&&NOW.h<20);  // omluvit lze do 20:00 předchozího dne (dle reálného intrawebu)
let _uid=1000; const uid=()=>'x'+(++_uid);
const fmtD=dt=>dt.getDate()+'. '+(dt.getMonth()+1)+'. '+dt.getFullYear();
const juneDate=day=>new Date(2026,5,day);
// Náhrada z data vzniku (origin); expiruje koncem školního roku (30. 6.), nepřenáší se dál.
// extra může přepsat id/den/exp/expT ap.
function nahFrom(origin,stav,extra){
  const exp=new Date(origin.getFullYear()+(origin.getMonth()>=8?1:0),5,30);
  return Object.assign({id:uid(),stav,den:null,vznik:fmtD(origin),vznikT:+origin,
    exp:fmtD(exp),expT:+exp,puvod:'omluva '+origin.getDate()+'. '+(origin.getMonth()+1)+'.'},extra||{});
}
const NAHLAB={dostupna:'Dostupná',naplanovana:'Naplánovaná',vyuzita:'Využitá',expirovana:'Expirovaná',nevznikla:'Nevznikla'};
const OMLAB={vcas:'Včas',['po-deadlinu']:'Po deadlinu',zrusena:'Zrušena'};
const DUVODLAB={nemoc:'Nemoc',['rodinné důvody']:'Rodinné důvody',['jiné']:'Jiné'};
const dostupne=c=>c.nahrady.filter(n=>n.stav==='dostupna').length;     // počet se všude odvozuje z pole
function nextExp(c){const a=c.nahrady.filter(n=>n.stav==='dostupna'&&isFinite(n.expT)).sort((x,y)=>x.expT-y.expT);return a[0]?a[0].exp:null;}
const nplural=n=>n===1?'náhrada':(n>=2&&n<=4?'náhrady':'náhrad');
const fmtRange=(a,b)=>a===b?`${DOW[wd(a)]} ${a}. 6.`:`${a}. 6. – ${b}. 6.`;

/* --- Faktury: generujeme ~3 školní roky (demo pro filtr rok+stav) --- newest-first.
   Školné každý měsíc Září–Červen. Aktuální rok 2025/26 jen do května 2026 (dnes je 3. 6.).
   unpaid = pole 'obdobi', která zůstávají neuhrazená; zbytek uhrazeno.
   VS = variabilní symbol (číslo dítěte + měsíc); t = řadicí timestamp. */
function skolRok(y0,rok,maxM2){
  const a=[['Září',9],['Říjen',10],['Listopad',11],['Prosinec',12]].map(([mn,m])=>({mn,m,y:y0,rok}));
  [['Leden',1],['Únor',2],['Březen',3],['Duben',4],['Květen',5],['Červen',6]].forEach(([mn,m])=>{if(!maxM2||m<=maxM2)a.push({mn,m,y:y0+1,rok});});
  return a;
}
const FAKT_MESICE=[].concat(skolRok(2023,'2023/24'),skolRok(2024,'2024/25'),skolRok(2025,'2025/26',5));
function genFaktury(cvar,cena,unpaid){
  return FAKT_MESICE.map(({mn,m,y,rok})=>({
    id:`f${cvar}-${y}-${m}`,obdobi:`${mn} ${y}`,rok,cena,sleva:0,
    vystaveno:`9. ${m}. ${y}`,splatnost:`23. ${m}. ${y}`,
    paid:!unpaid.includes(`${mn} ${y}`),vs:`4920${cvar}${String(m).padStart(2,'0')}`,
    t:+new Date(y,m-1,9)})).sort((a,b)=>b.t-a.t);
}
/* Kulturní fond — čerpání per dítě (dřív společné FONDLOG). Zůstatek se odvozuje součtem. */
const fondCerpano=c=>c.fondlog.reduce((s,x)=>s+x[2],0);

const children=[
  {n:'Eliška',sur:'Dvořáková',ak:'Elišku',dat:'Elišce',base:'O',spi:true,att:{2:'NE',11:'OM'},notes:{11:'rodinná oslava'},
    fond:{rocni:2000},
    fondlog:[['Divadelní představení','říjen 2025',250],['Výlet do ZOO','listopad 2025',350],['Výtvarný materiál','leden 2026',200]],
    faktury:genFaktury('01',10584,['Duben 2026','Květen 2026']),
    nahrady:[
      nahFrom(new Date(2026,4,12),'dostupna'),
      nahFrom(new Date(2026,4,20),'dostupna'),
      nahFrom(juneDate(11),'dostupna',{id:'nE-fut',den:11,omId:'omE-fut'}),
      nahFrom(new Date(2026,4,26),'naplanovana',{plan:'Náhradní den · 18. 6.'}),
      nahFrom(new Date(2026,3,8),'vyuzita',{pouzita:'15. 5. 2026'}),
      nahFrom(new Date(2025,4,20),'expirovana'),   // z minulého šk. roku — propadla 30. 6. 2025
      nahFrom(juneDate(2),'nevznikla',{id:'nE-nev',den:2,omId:'omE-2',exp:'—',expT:Infinity}),
    ],
    omluvenky:[
      {id:'omE-fut',od:11,do:11,duvod:'rodinné důvody',pozn:'rodinná oslava',stav:'vcas',nahradaIds:['nE-fut']},
      {id:'omE-2',od:2,do:2,duvod:'nemoc',pozn:'',stav:'po-deadlinu',nahradaIds:['nE-nev']},
    ]},
  {n:'Matěj',sur:'Dvořák',ak:'Matěje',dat:'Matějovi',base:'C',spi:false,att:{},notes:{},
    /* celodenní = odpolední docházka + úterý do 17:00; samostatná cena v podkladech není, použita odpolední sazba */
    fond:{rocni:2000},
    fondlog:[['Divadelní představení','říjen 2025',250],['Výlet do ZOO','listopad 2025',350],['Výtvarný materiál','leden 2026',200],['Muzeum a dílna','březen 2026',350],['Jarní výprava','duben 2026',350]],
    faktury:genFaktury('02',10584,[]),   // happy stav — vše uhrazeno
    nahrady:[ nahFrom(new Date(2026,4,15),'dostupna') ],
    omluvenky:[]},
];

/* Profil dítěte — údaje z onboarding dotazníku a souhlasů (převzato ze staršího prototypu
   podklady/prototyp_dochazka_rodic.html). Rodič si část údajů spravuje sám (editace v profilu),
   aby zůstávaly aktuální. Rodné číslo v prototypu neuvádíme.
   Režim se nedrží tady — odvozuje se z child.base přes CODES. */
/* Číselníky (výběr z pevného seznamu, ne volný text). */
const CISELNIK={
  pojistovna:['VZP (111)','VoZP (201)','ČPZP (205)','OZP (207)','ZPŠ (209)','ZPMV (211)','RBP (213)'],
  jazyk:['čeština','čeština + angličtina','čeština + slovenština','čeština + ukrajinština','čeština + jiný'],
  alergie:['pyl','prach / roztoči','srst zvířat','laktóza','lepek','ořechy','vejce','včelí a vosí bodnutí','jiné'],
  strava:['Zajištěná školkou','Vlastní (nosí z domu)'],
};
/* Odvozené zobrazení hodnot z profilu. */
const profAlergie=p=>p.alergie.length?p.alergie.join(', '):'žádné';
const profAno=(flag,text)=>flag?('ano'+(text?' — '+text:'')):'ne';

const PROFIL={
  'Eliška':{
    narozeni:'14. 3. 2021 · Praha', adresa:'Nad Rokoskou 1230/8, 182 00 Praha 8 – Libeň',
    jazyky:'čeština', pojistovna:'VZP (111)', spadova:'MŠ Ďáblice', sourozenci:'Adam (2018), Matěj (2019)',
    matka:{tel:'+420 774 512 908', email:'k.dvorakova@email.cz'},
    otec:{tel:'+420 603 847 221', email:'j.dvorak@email.cz'},
    alergie:[], leky:false, lekyText:'', bryle:false, bryleText:'',
    strava:'Zajištěná školkou', dieta:'bez omezení', usinani:'pohlazení po zádech',
    bavi:'Kreslení, malování a modelování, stavění z LEGA, zvířata (hlavně kočky), zpívání písniček.',
    nesouhlas:'Hlasitě si vynucuje, co chce. Doma se snažíme neustoupit.',
    doporuceni:['Trénovat samostatné oblékání (bunda, boty).',
                'Krátké, jasné loučení u brány — pomáhá hladšímu příchodu.']},
  'Matěj':{
    narozeni:'2. 9. 2019 · Praha', adresa:'Nad Rokoskou 1230/8, 182 00 Praha 8 – Libeň',
    jazyky:'čeština', pojistovna:'VZP (111)', spadova:'MŠ Ďáblice', sourozenci:'Eliška (2021), Adam (2018)',
    matka:{tel:'+420 774 512 908', email:'k.dvorakova@email.cz'},
    otec:{tel:'+420 603 847 221', email:'j.dvorak@email.cz'},
    alergie:['pyl'], leky:false, lekyText:'', bryle:true, bryleText:'na blízko',
    strava:'Zajištěná školkou', dieta:'bez omezení', usinani:'nespí',
    bavi:'Stavby z klacků a kamenů, pozorování brouků, běhání a šplhání.',
    nesouhlas:'Stáhne se a mlčí. Pomáhá dát mu chvíli a pak se vrátit.',
    doporuceni:['Podpořit samostatné stolování.',
                'Připomínat pití během dne — sám se nehlásí.']},
};

/* Dokumenty a souhlasy — společné pro celou školku (stejná sada pro každé dítě). */
const SOUHLASY=[
  {t:'Žádost o přijetí',f:'PDF'},
  {t:'Smlouva s rodiči 2025/26',f:'PDF'},
  {t:'Plná moc',f:'DOCX'},
  {t:'Souhlas s pořizováním fotografií',f:'DOCX'},
  {t:'Potvrzení od lékaře',f:'DOCX'},
];

/* Básnička a písnička aktuálního týdne (texty shodné s průvodcovskou appkou).
   url = proklik (YouTube / jiný odkaz) — reálné vyhledávací odkazy, žádná smyšlená videa. */
const TYDEN={
  basnicka:{t:'Uvijeme věneček ze všech našich kytiček. Kvítek, lístek i větvičku, uvijeme do věnečku. Jaké jméno máš? Tak pojď mezi nás.',
    url:'https://www.youtube.com/results?search_query=Uvijeme+v%C4%9Bne%C4%8Dek+%C5%99%C3%ADkanka'},
  pisnicka:{t:'Šel zahradník do zahrady s motykou, s motykou. Vykopal tam rozmarýnu velikou, velikou.',
    url:'https://www.youtube.com/results?search_query=%C5%A0el+zahradn%C3%ADk+do+zahrady+p%C3%ADsni%C4%8Dka'}
};
/* Novinky (dřív aktuality): t = titulek do seznamů, full = celý text (detail),
   img = úvodní foto (placeholder tint jako sekce Fotky), imgs = fotky v detailu.
   from/time se rodiči nezobrazují (vidí je průvodce ve své appce). */
const NEWS=[
  {id:'nw1',t:'Ve třídě se vyskytly roupy. Prosíme, zkontrolujte dítě.',from:'Táňa',time:'7:40',date:'2. 6.',until:5,urgent:true,
   full:'Ve třídě se vyskytly roupy. Prosíme, zkontrolujte dnes večer dítě — svědění, neklidný spánek. Pokud roupy najdete, nechte prosím dítě doma do přeléčení (přípravek poradí každá lékárna, léčba je rychlá).\n\nVe školce jsme vyměnili ručníky i povlečení a vše vyprali na 90 °C. Prosíme také o krátké ostříhání nehtíků. Kdybyste si nebyli jistí, ozvěte se Táně — děkujeme za spolupráci.'},
  {id:'nw2',t:'V pátek 5. 6. končíme už ve 14:00 (pedagogická porada).',from:'Táňa',time:'16:12',date:'1. 6.',until:5,urgent:true,
   full:'V pátek 5. 6. končí provoz školky už ve 14:00 — máme celotýmovou pedagogickou poradu.\n\nProsíme, vyzvedněte si děti nejpozději do 14:00. Odpolední svačinu dostanou děti s sebou v krabičce. Pokud by vyzvednutí do 14:00 bylo neřešitelné, napište nám prosím co nejdřív, domluvíme se individuálně. Děkujeme za pochopení.'},
  {id:'nw3',t:'Sbíráme víčka od PET lahví na výtvarku.',from:'Darča',time:'9:05',date:'28. 5.',until:30,img:'var(--photo-5)',
   full:'Od června sbíráme víčka od PET lahví — budeme z nich s dětmi tvořit velkou letní mozaiku na plot zahrady.\n\nSběrný koš najdete u vchodu do maringotky. Hodí se všechny barvy, čím pestřejší, tím lepší. Sbíráme do konce června; hotovou mozaiku pak slavnostně odhalíme na zahradní slavnosti.',imgs:['var(--photo-5)','var(--photo-2)']},
  {id:'nw4',t:'Fotky z výpravy na Okoř najdete ve složce Fotky.',from:'Honza',time:'18:30',date:'26. 5.',until:12,img:'var(--photo-3)',
   full:'Výprava na Okoř se vydařila — počasí nám přálo, děti zvládly celou trasu a zřícenina sklidila obrovský úspěch (stejně jako svačiny od vás, děkujeme!).\n\nFotky z celého dne najdete ve složce Fotky. Pokud byste některou chtěli v plném rozlišení, napište Honzovi.',imgs:['var(--photo-3)','var(--photo-1)','var(--photo-2)','var(--photo-4)']},
  {id:'nw5',t:'Brigáda na zahradě 13. 6. — hlaste se prosím v tabulce.',from:'Míša',time:'20:15',date:'25. 5.',until:13,img:'var(--photo-2)',
   full:'V sobotu 13. 6. od 9:00 chystáme brigádu na zahradě — čeká nás stavba nového záhonu, oprava vrbového tunelu a nátěr herních prvků.\n\nHlaste se prosím v tabulce (odkaz jsme posílali e-mailem), ať víme počty na občerstvení. Nářadí máme, hodí se ale vlastní rukavice. Děti jsou vítané — pro malé pomocníky bude připravený dětský koutek.',imgs:['var(--photo-2)']},
];
const ALERTS=[
  {text:'Ve třídě se vyskytly roupy. Prosíme, zkontrolujte dítě.',until:5},
];
const EVENTS={
  3:{title:'Společné putování Ďábličákem',place:'Vozovna Kobylisy',time:'8:00–8:30',note:'Na oběd jsme zpět ve školce.',sbalit:'pláštěnku a náhradní ponožky',map:'https://mapy.com/s/papobonuzu',gps:'50.1339225N, 14.4545787E'},
  4:{title:'Výlet předškoláků — horolezení',place:'Jungle Sport park, Letňany',time:'8:00–8:30',note:'Na oběd zpět do školky. Děti odpoledne nespí.',sbalit:'sportovní boty a pití',map:'',gps:''},
};
/* Denní program (činnost) dle dne v týdnu — zdroj: Pro rodiče 25_26 vhaaji.xlsx, tab ČERVEN.
   Každý pracovní den má téma; speciální akce (výlety, sraz) navíc v EVENTS. */
const DENNI=['Rytmika','Putování','Pohyb','Tvorba','Hrátky s pohádkou'];
const guides=[
  {n:'Darča',sur:'K',abbr:'Da',h:'7:30–16:00',schedule:'Po, St, Pá · 7:30–16:00',phone:'+420 720 111 222',email:'darca@haj.cz',uspava:true},
  {n:'Gabča',sur:'N',abbr:'G',h:'8:20–15:00',schedule:'Út, Čt · 7:30–16:00',phone:'+420 720 333 444',email:'gabca@haj.cz'},
  {n:'Honza',sur:'P',abbr:'Ho',h:'8:00–13:00',schedule:'St, Pá · 8:00–16:30',phone:'+420 720 555 666',email:'honza@haj.cz'},
  {n:'Táňa',sur:'V',abbr:'T',h:'8:20–17:00',schedule:'Po–Pá · 7:30–16:00',phone:'+420 720 777 888',email:'tana@haj.cz'},
];
const GUIDES_TODAY=[0,1,2,3];
const SCHOOL={name:'Lesní školka Vhaaji',email:'vhaaji@haj.cz',phone:'+420 720 000 111',adresa:'Ďáblický háj, Praha 8'};
const WEATHER={
  3:{icon:'🌦',t9:14,t17:19,desc:'přeháňky během dne',nightRain:true},
  4:{icon:'☀️',t9:15,t17:23,desc:'slunečno',nightRain:false},
  5:{icon:'⛅',t9:13,t17:20,desc:'polojasno',nightRain:false},
  8:{icon:'🌧',t9:12,t17:16,desc:'déšť',nightRain:true},
};
const WDEF={icon:'⛅',t9:14,t17:21,desc:'polojasno',nightRain:false};
/* Jídelníček převzatý z reálného týdenníku Vhaaji (Pro rodiče 25_26): obědy veganské
   z bistra Mamafood, živočišná složka jen ve svačinkách. */
const MENUS=[
  [['Svačinka 1','Pečivo (1× bez sóji), Lučina, zelenina',''],['Polévka','Mrkvová s pomerančem',''],['Hlavní jídlo','Čočka na kyselo s cibulkou a tofu „vajíčky", rajčatovo-okurkový salátek','6'],['Svačinka 2','Pečivo (1× bez sóji), pomazánkové máslo, šunka, zelenina','']],
  [['Svačinka 1','Pečivo (1× bez sóji), vajíčková pomazánka, zelenina',''],['Polévka','Ochucená mléčná kaše, ovoce','7'],['Hlavní jídlo','Pečená zelenina s bramborami, křupavým tofu a domácí tatarkou','6'],['Svačinka 2','Tortilla plněná kečupem, šunkou a sýrem, zelenina','7']],
  [['Svačinka 1','Ochucená mléčná kaše, ovoce','7'],['Polévka','Batátový krém s karamelizovanými hruškami',''],['Hlavní jídlo','Květákové placičky s cizrnou, bramborovo-hráškové pyré a salátek',''],['Svačinka 2','Pečivo (1× bez sóji), pomazánkové máslo, zelenina','']],
  [['Svačinka 1','Domácí chléb, tuňáková pomazánka, zelenina','4'],['Polévka','Zeleninová s květákem, mrkví a bramborami',''],['Hlavní jídlo','Těstoviny se smetanovou omáčkou s hráškem, mrkví a květákem, fazolkami a oříškovou posypkou','1, 8'],['Svačinka 2','Pečivo (1× bez sóji), máslo, sýr, zelenina','7']],
  [['Svačinka 1','Ochucená mléčná kaše, ovoce','7'],['Polévka','Zeleninová minestrone s bylinkovým pestem',''],['Hlavní jídlo','Chana masala s jasmínovou rýží a cizrnou',''],['Svačinka 2','Domácí bublanina','1']],
];
/* Výlet předškoláků je každý měsíc 1. čtvrtek (v červnu horolezení v Letňanech). */
const akce=[
  {title:'Výlet předškoláků — horolezení',date:'čt 4. 6.',time:'8:00–8:30',place:'Jungle Sport park, Letňany',note:'Sraz na místě, na oběd zpět do školky. Děti odpoledne nespí.'},
  {title:'Brigáda na zahradě',date:'so 13. 6.',time:'9:00–12:00',place:'Zahrada školky',note:'Společné hrabání a sázení pro rodiče i děti. Občerstvení zajištěno.'},
];
const EVMAP={
  4:[{t:'Výlet předškoláků — horolezení',type:'akce'}],
  5:[{t:'Pedagogická porada — školka zavřená',type:'org'}],
  8:[{t:'Kroužek Tanečky s Niki · 15:15',type:'rozvrh'}],
  10:[{t:'Narozeniny — Eliška',type:'naro'}],
  11:[{t:'Předškolácký den',type:'rozvrh'}],
  13:[{t:'Brigáda na zahradě',type:'akce'}],
  17:[{t:'Narozeniny — Tonička',type:'naro'}],
  18:[{t:'Kroužek Živly se Shaunem · 14:00',type:'rozvrh'}],
  20:[{t:'Tatínkovský den',type:'akce'}],
  24:[{t:'Výprava do lesa',type:'akce'},{t:'Narozeniny — Kuba',type:'naro'}],
  27:[{t:'Společné focení tříd',type:'akce'}],
  30:[{t:'Konec školního roku',type:'org'},{t:'Závěrečné posezení s rodiči',type:'akce'}],
};
const TYPELAB={akce:'akce',naro:'narozeniny',rozvrh:'rozvrh',org:'organizace'};

const TODAY=3;
const MONTHS=['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
const daysInMonth=(y,m)=>new Date(y,m+1,0).getDate();
const firstOffset=(y,m)=>(new Date(y,m,1).getDay()+6)%7;
const wdLocal=(y,m,d)=>(new Date(y,m,d).getDay()+6)%7;
const editable=d=>d>TODAY;
const dayLabel=d=>d===TODAY?'Dnes · St 3. 6.':DOW[wd(d)]+' '+d+'. 6.';

// celodenní docházka je jen v úterý — v ostatní dny platí odpolední
const code=(c,d)=>c.att[d]||(c.base==='C'&&wd(d)!==1?'O':c.base);
const chip=cd=>`<span class="chip" style="background:${CODES[cd][2]};color:${CODES[cd][1]}">${CODES[cd][0]}</span>`;
const mark=cd=>cd==='OM'?'Om':cd==='NE'?'Ne':cd;
const cur=()=>children[ci];
const plural=n=>n===1?'den':(n>=2&&n<=4?'dny':'dní');
const telnum=p=>p.replace(/ /g,'');
const kc=n=>n.toLocaleString('cs-CZ');
