/* DATA: RODIC — seed data + čisté datové helpery sdílené více obrazovkami */
const CODES={D:['Dopolední','#B07D3A','rgba(176,125,58,.16)'],O:['Odpolední','#3f5d72','rgba(91,124,153,.18)'],
  C:['Celodenní','#2E5E43','rgba(46,94,67,.14)'],OM:['Omluveno','#736E61','rgba(115,110,97,.14)'],NE:['Neomluveno','#B0492F','rgba(176,73,47,.14)']};
const ORDER=['D','O','C','OM','NE'];
const children=[
  {n:'Eliška',sur:'Dvořáková',ak:'Elišku',dat:'Elišce',base:'O',nahrady:3,att:{},notes:{},fond:{rocni:2000,cerpano:800},
    faktury:[{obdobi:'Březen 2026',cena:7983,sleva:1996,vystaveno:'9. 3. 2026',paid:false},
             {obdobi:'Únor 2026',cena:7983,sleva:1996,vystaveno:'1. 2. 2026',paid:true},
             {obdobi:'Leden 2026',cena:7983,sleva:1996,vystaveno:'7. 1. 2026',paid:true}]},
  {n:'Matěj',sur:'Dvořák',ak:'Matěje',dat:'Matějovi',base:'C',nahrady:1,att:{},notes:{},fond:{rocni:2000,cerpano:1500},
    faktury:[{obdobi:'Březen 2026',cena:9100,sleva:0,vystaveno:'9. 3. 2026',paid:true},
             {obdobi:'Únor 2026',cena:9100,sleva:0,vystaveno:'1. 2. 2026',paid:true},
             {obdobi:'Leden 2026',cena:9100,sleva:0,vystaveno:'7. 1. 2026',paid:true}]},
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
  4:{title:'Horolezení',place:'Lezecká stěna Smíchov',time:'8:00–8:30',note:'Na oběd zpět do školky. Děti odpoledne nespí.',sbalit:'sportovní boty a pití',map:'',gps:''},
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
const MENUS=[
  [['Svačinka 1','Jogurt s ovesnými vločkami a ovocem',''],['Polévka','Bramboračka',''],['Hlavní jídlo','Rýže s dušenou zeleninou a tofu','6'],['Svačinka 2','Chléb, pomazánkové máslo, ředkvičky','']],
  [['Svačinka 1','Pečivo, žervé, paprika',''],['Polévka','Mrkvový krém se zázvorem',''],['Hlavní jídlo','Těstoviny s rajčatovou omáčkou a sýrem','1, 7'],['Svačinka 2','Ovoce a oříšky','8']],
  [['Svačinka 1','Chléb, Lučina, zelenina',''],['Polévka','Žampiónový krém se sušenými švestkami',''],['Hlavní jídlo','Špagety s omáčkou z pečené zeleniny a fazolí, salátek, oříšková posypka','1, 8'],['Svačinka 2','Pečivo (1× bez sóji), pomazánkové máslo, šunka, zelenina','']],
  [['Svačinka 1','Ovesná kaše s ovocem',''],['Polévka','Čočková',''],['Hlavní jídlo','Bramborové placky se zelím','1'],['Svačinka 2','Chléb, tvarohová pomazánka, okurka','7']],
  [['Svačinka 1','Pečivo, máslo, med',''],['Polévka','Zeleninový vývar s nudlemi','1'],['Hlavní jídlo','Rybí filé, brambor, salát','4'],['Svačinka 2','Jablko, rýžové chlebíčky','']],
];
const akce=[
  {title:'Horolezení',date:'čt 4. 6.',time:'8:00–8:30',place:'Lezecká stěna Smíchov',note:'Sraz na místě, na oběd zpět do školky. Děti odpoledne nespí.'},
  {title:'Výlet předškoláků',date:'po 8. 6.',time:'8:00',place:'Sraz u školky',note:'Celodenní výlet, návrat kolem 15:00. S sebou batůžek a pláštěnku.'},
  {title:'Brigáda na zahradě',date:'so 13. 6.',time:'9:00–12:00',place:'Zahrada školky',note:'Společné hrabání a sázení pro rodiče i děti. Občerstvení zajištěno.'},
];
const EVMAP={
  2:[{t:'Kroužek keramiky · 15:00',type:'rozvrh'}],
  4:[{t:'Horolezení (předškoláci)',type:'akce'}],
  5:[{t:'Pedagogická porada — školka zavřená',type:'org'}],
  8:[{t:'Výlet předškoláků',type:'akce'}],
  10:[{t:'Narozeniny — Eliška',type:'naro'}],
  11:[{t:'Předškolácký den',type:'rozvrh'}],
  13:[{t:'Brigáda na zahradě',type:'akce'}],
  17:[{t:'Narozeniny — Tonička',type:'naro'}],
  18:[{t:'Kroužek keramiky · 15:00',type:'rozvrh'}],
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

const code=(c,d)=>c.att[d]||c.base;
const chip=cd=>`<span class="chip" style="background:${CODES[cd][2]};color:${CODES[cd][1]}">${CODES[cd][0]}</span>`;
const mark=cd=>cd==='OM'?'Om':cd==='NE'?'Ne':cd;
const cur=()=>children[ci];
const plural=n=>n===1?'den':(n>=2&&n<=4?'dny':'dní');
const telnum=p=>p.replace(/ /g,'');
const kc=n=>n.toLocaleString('cs-CZ');
