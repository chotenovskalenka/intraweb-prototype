/* DATA: RODIC — seed data + čisté datové helpery sdílené více obrazovkami */
const CODES={D:['Dopolední','#B07D3A','rgba(176,125,58,.16)'],O:['Odpolední','#3f5d72','rgba(91,124,153,.18)'],
  C:['Celodenní','#2E5E43','rgba(46,94,67,.14)'],OM:['Omluveno','#736E61','rgba(115,110,97,.14)'],NE:['Neomluveno','#B0492F','rgba(176,73,47,.14)']};
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

const children=[
  {n:'Eliška',sur:'Dvořáková',ak:'Elišku',dat:'Elišce',base:'O',att:{2:'OM',11:'OM'},notes:{11:'rodinná oslava'},fond:{rocni:2000,cerpano:800},
    faktury:[{obdobi:'Březen 2026',cena:10584,sleva:0,vystaveno:'9. 3. 2026',paid:false},
             {obdobi:'Únor 2026',cena:10584,sleva:0,vystaveno:'1. 2. 2026',paid:true},
             {obdobi:'Leden 2026',cena:10584,sleva:0,vystaveno:'7. 1. 2026',paid:true}],
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
  {n:'Matěj',sur:'Dvořák',ak:'Matěje',dat:'Matějovi',base:'C',att:{},notes:{},fond:{rocni:2000,cerpano:1500},
    /* celodenní = odpolední docházka + úterý do 17:00; samostatná cena v podkladech není, použita odpolední sazba */
    faktury:[{obdobi:'Březen 2026',cena:10584,sleva:0,vystaveno:'9. 3. 2026',paid:true},
             {obdobi:'Únor 2026',cena:10584,sleva:0,vystaveno:'1. 2. 2026',paid:true},
             {obdobi:'Leden 2026',cena:10584,sleva:0,vystaveno:'7. 1. 2026',paid:true}],
    nahrady:[ nahFrom(new Date(2026,4,15),'dostupna') ],
    omluvenky:[]},
];
const NEWS=[
  {t:'Ve třídě se vyskytly roupy. Prosíme, zkontrolujte dítě.',from:'Táňa',date:'2. 6.',until:5,urgent:true},
  {t:'V pátek 5. 6. končíme už ve 14:00 (pedagogická porada). Prosíme o dřívější vyzvednutí.',from:'Táňa',date:'1. 6.',until:5,urgent:true},
  {t:'Sbíráme víčka od PET lahví na výtvarku — sběrný koš je u vchodu do maringotky.',from:'Helča',date:'28. 5.',until:30},
  {t:'Fotky z výpravy na Okoř najdete ve složce Fotky.',from:'Honza',date:'26. 5.',until:12},
  {t:'Brigáda na zahradě 13. 6. — hlaste se prosím v tabulce, ať víme počty.',from:'Míša',date:'25. 5.',until:13},
];
const ALERTS=[
  {text:'Ve třídě se vyskytly roupy. Prosíme, zkontrolujte dítě.',until:5},
];
const EVENTS={
  3:{title:'Společné putování Ďábličákem',place:'Vozovna Kobylisy',time:'8:00–8:30',note:'Na oběd jsme zpět ve školce.',sbalit:'pláštěnku a náhradní ponožky',map:'https://mapy.com/s/papobonuzu',gps:'50.1339225N, 14.4545787E'},
  4:{title:'Výlet předškoláků — horolezení',place:'Jungle Sport park, Letňany',time:'8:00–8:30',note:'Na oběd zpět do školky. Děti odpoledne nespí.',sbalit:'sportovní boty a pití',map:'',gps:''},
};
const guides=[
  {n:'Helča',sur:'K',abbr:'He',schedule:'Po, St, Pá · 7:30–16:00',phone:'+420 720 111 222',email:'helca@haj.cz',uspava:true},
  {n:'Gabča',sur:'N',abbr:'G',schedule:'Út, Čt · 7:30–16:00',phone:'+420 720 333 444',email:'gabca@haj.cz'},
  {n:'Honza',sur:'P',abbr:'Ho',schedule:'St, Pá · 8:00–16:30',phone:'+420 720 555 666',email:'honza@haj.cz'},
  {n:'Táňa',sur:'V',abbr:'T',schedule:'Po–Pá · 7:30–16:00',phone:'+420 720 777 888',email:'tana@haj.cz'},
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
const FONDLOG=[['Divadelní představení','říjen 2025',250],['Výlet do ZOO','listopad 2025',350],['Výtvarný materiál','leden 2026',200]];

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
