/* DATA: PRUVODCE — seed data + čisté datové helpery sdílené více obrazovkami */
const raw=[
  ['Meda','Nováková','odpolední',true],['Tonička','Procházková','celodenní',true],['Kuba','Svoboda','celodenní',false],
  ['Eliška','Dvořáková','odpolední',true],['Matěj','Černý','celodenní',true],['Róza','Veselá','dopolední',false],
  ['Áda','Horáková','celodenní',true],['Vojta','Němec','celodenní',false],['Mína','Marková','celodenní',true],
  ['Bára','Pospíšilová','celodenní',true],['Šimon','Král','celodenní',false],['Lukáš','Jelínek','celodenní',true],
  ['Anežka','Kučerová','celodenní',true],['Tobiáš','Veselý','celodenní',false],['Klárka','Fialová','odpolední',true],
  ['Vilém','Růžička','dopolední',false],['Stela','Doležalová','celodenní',true],['Jonáš','Sedláček','celodenní',false],
  ['Mia','Pokorná','celodenní',true],['Kryštof','Zeman','celodenní',false],['Linda','Kolářová','dopolední',false],
  ['Oskar','Urban','celodenní',true],['Zuzka','Malá','celodenní',true],['Edita','Bláhová','celodenní',false],
  ['Damián','Tichý','dopolední',false],
];
const meta=[[false,''],[true,''],[false,'lepek'],[false,''],[true,''],[false,''],[true,''],[false,'mléko, vejce'],
  [false,''],[true,''],[false,''],[false,''],[false,''],[false,''],[true,'arašídy'],[false,''],[true,''],[false,''],
  [false,''],[false,''],[false,'celer'],[true,''],[false,''],[false,''],[false,'']];
function planCode(p){return p==='celodenní'?'C':p==='dopolední'?'D':'O';}
function weekFor(i,plan){const b=planCode(plan),a=[b,b,b,b,b];
  if(i%3===0)a[1]='C';if(i%5===0)a[0]='D';if(i%4===0)a[3]='';if(i%7===0)a[4]='';return a;}
const LEZ=[0,2,3,6,8,11,14,18,21,24];
const data=raw.map(([n,sur,plan,spi],i)=>({n,sur,plan,spi,status:'pritomen',note:'',att:{},predskolak:meta[i][0],lez:LEZ.includes(i),alergie:meta[i][1]}));
// demo odchylky docházky na konkrétní dny
data[5].att[4]='OM'; data[12].att[4]=''; data[3].att[5]='OM'; data[8].att[19]='OM'; data[1].att[18]='OM'; data[20].att[12]='';
data[10].note='Od pondělí má vši, prosím o kontrolu hlavičky. Doma jsme to řešili, ale pro jistotu hlídejte.';
data[3].note='Eliška je po nemoci, prosíme dnes klidnější režim a hlídat pití.';
// dnes nepřítomné děti — 2 s rodičovskou omluvenkou (čas + důvod), 1 neomluvená
data[5].status='omluveno'; data[5].parentExcuse={time:'6:40',reason:'nemoc'};
data[1].status='omluveno'; data[1].parentExcuse={time:'7:15',reason:'rodinné důvody'};
data[20].status='neomluveno';
// zobrazení propsané omluvenky (jen text; žádná logika ani sdílení dat mezi appkami)
function parentExcuseLine(c){return c.parentExcuse?`omluveno rodičem dnes ${c.parentExcuse.time} · ${c.parentExcuse.reason}`:'';}
data.forEach((c,i)=>{const dd=((i*7)%27)+1,mm=((i*5)%12)+1,yy=c.predskolak?2020:2021;c.nar=`${dd}. ${mm}. ${yy}`;c.vek=2026-yy;});
function recordsFor(c){const r=[['Vstupní depistáž','9/2025'],['Čtvrtletní hodnocení','1/2026'],['Pozorování v lese','3/2026']];if(c.predskolak)r.push(['Posouzení školní zralosti','4/2026']);return r;}
function parentsFor(c){const base=c.n.normalize('NFD').replace(/[^a-zA-Z]/g,'').toLowerCase();return [
  {role:'Matka',name:'Jana '+c.sur,phone:'+420 605 '+(100+avHash(c.n)%900),email:base+'.matka@email.cz'},
  {role:'Otec',name:'Petr '+c.sur,phone:'+420 606 '+(100+avHash(c.sur)%900),email:base+'.otec@email.cz'},
];}
let rozhovoryMap={};
function rozhovoryFor(i){if(!rozhovoryMap[i])rozhovoryMap[i]=[
  {date:'2. 9. 2025',note:'Úvodní schůzka — adaptace v pořádku, dítě se těší. Doma řeší usínání.'},
  {date:'20. 1. 2026',note:'Konzultace — velký pokrok v jemné motorice, baví ho práce se dřevem. Doporučení: trénovat samostatné oblékání.'},
];return rozhovoryMap[i];}
let worksMap={3:2,9:3}, dopoMap={};

const guides=[
  {n:'Helča',sur:'K.',phone:'+420 720 111 222',email:'helca@haj.cz'},
  {n:'Gabča',sur:'N.',phone:'+420 720 333 444',email:'gabca@haj.cz'},
  {n:'Honza',sur:'P.',phone:'+420 720 555 666',email:'honza@haj.cz'},
  {n:'Táňa',sur:'V.',phone:'+420 720 777 888',email:'tana@haj.cz'},
];
const SCHOOL={name:'Lesní školka Vhaaji',email:'vhaaji@haj.cz',phone:'+420 720 000 111'};

let RYTMUS=[
  {d:0,prog:'Rytmika',krouzek:''},
  {d:1,prog:'Putování',krouzek:''},
  {d:2,prog:'Pohyb',krouzek:'Haaj band s Gabčou'},
  {d:3,prog:'Tvorba',krouzek:'Živly se Shaunem'},
  {d:4,prog:'Hrátky s pohádkou',krouzek:''},
];
const PROGOPTS=['Rytmika','Putování','Pohyb','Tvorba','Hrátky s pohádkou'];
let uid=100;
let AKCE=[
  {id:'a1',name:'Škola v přírodě',day:1,dayEnd:5,time:'',place:'Ktová pod Troskami',note:''},
  {id:'a2',name:'Výjezd předškoláků',day:14,dayEnd:16,time:'',place:'Bukovina',note:'Vícedenní výjezd',paid:350},
  {id:'a3',name:'Dědečkovský den',day:19,dayEnd:null,time:'dopoledne',place:'',note:''},
  {id:'a8',name:'Divadlo v lese',day:11,dayEnd:null,time:'10:00',place:'',note:'',paid:120},
  {id:'a9',name:'Horolezení',day:4,dayEnd:null,time:'8:00–8:30',place:'Lezecká stěna Smíchov',note:'Lezci se schází na místě, na oběd zpět',paid:0},
  {id:'a4',name:'Zahradní slavnost v Jaatě',day:23,dayEnd:null,time:'',place:'Jaata',note:''},
  {id:'a5',name:'Svatojánský jarmark — rozloučení s předškoláky',day:23,dayEnd:null,time:'15:30',place:'s Jaatou a Maatou',note:''},
  {id:'a6',name:'Narozeninová párty',day:26,dayEnd:null,time:'',place:'',note:'Emil, Miky Š., Vincent, Maty, Karin, David'},
  {id:'a7',name:'Konec řádného provozu',day:30,dayEnd:null,time:'',place:'',note:'docházka do 15h'},
];
const PREDEF=['Výlet','Výjezd předškoláků','Slavnost','Brigáda','Horolezení','Beseda','Divadlo','Narozeniny','Škola v přírodě'];
const _basen='Uvijeme věneček ze všech našich kytiček. Kvítek, lístek i větvičku, uvijeme do věnečku. Jaké jméno máš? Tak pojď mezi nás.';
const _pisen='Šel zahradník do zahrady s motykou, s motykou. Vykopal tam rozmarýnu velikou, velikou. Nebyla to rozmarýna, byl to křen, byl to křen. Vyhodil ho zahradníček z okna ven, z okna ven.';
// 1. týden (aktuální dle TODAYD) má vyplněnou básničku i písničku, ať dashboard není při demu prázdný
let TEMA={hodnota:'nadšení',file:'',tydny:[{b:_basen,byt:'',p:_pisen,yt:'https://www.youtube.com/results?search_query=Šel+zahradník+do+zahrady'},{b:'',byt:'',p:'',yt:''},{b:'',byt:'',p:'',yt:''},{b:'',byt:'',p:'',yt:''}]};
const TEMA_KVETEN={hodnota:'péče',tydny:[
  {b:'Vyšlo slunce nad lesem, hřeje nás i pod nosem.',byt:'',p:'Travička zelená, to je moje potěšení…',yt:'https://www.youtube.com/results?search_query=Travička+zelená'},
  {b:'Prší, prší, jen se leje…',byt:'',p:'Prší, prší, jen se leje',yt:''},
  {b:'',byt:'',p:'Já do lesa nepojedu',yt:''},
  {b:'Květen končí, léto volá.',byt:'',p:'',yt:''}]};
let temaMonth='cerven';

let GUIDESHIFT=[
  {n:'Táňa',days:[{s:'07:30',e:'16:00'},{s:'07:30',e:'16:00'},{s:'07:30',e:'16:00'},{s:'07:30',e:'16:00'},{s:'07:30',e:'16:00'}]},
  {n:'Helča',days:[{s:'07:30',e:'16:00'},null,{s:'07:30',e:'16:00'},null,{s:'07:30',e:'16:00'}]},
  {n:'Gabča',days:[null,{s:'07:30',e:'16:00'},null,{s:'07:30',e:'16:00'},null]},
  {n:'Honza',days:[null,null,{s:'08:00',e:'16:30'},null,{s:'08:00',e:'16:30'}]},
  {n:'Míša',days:[{s:'08:20',e:'15:00'},null,{s:'08:20',e:'15:00'},null,null]},
];
let uspavaToday=1;
const OFFREASONS=['nemoc','málo dětí','volno','dovolená'];

const SEEDFOND=[['Divadelní představení','říjen 2025',250],['Výlet do ZOO','listopad 2025',350],['Výtvarný materiál','leden 2026',200]];
const FONDROK=2000;
data.forEach(c=>{c.fondLog=SEEDFOND.map(x=>({name:x[0],date:x[1],amt:x[2]}));c.fond=FONDROK-SEEDFOND.reduce((s,x)=>s+x[2],0);});

const DAYS=['Po','Út','St','Čt','Pá'], TODAY=2;

const here=c=>c.status==='pritomen';
const staysPM=c=>here(c)&&c.plan!=='dopolední';
const full=c=>c.n+' '+c.sur;
const byAlpha=(a,b)=>a.c.n.localeCompare(b.c.n,'cs');

const TODAYD=3;
const baseCode=c=>planCode(c.plan);
function todayCode(c){if(c.status==='omluveno')return 'OM';if(c.status==='neomluveno')return '';return baseCode(c);}
function getCode(c,d){if(d===TODAYD)return todayCode(c);if(Object.prototype.hasOwnProperty.call(c.att,d))return c.att[d];return isWE(d)?'':baseCode(c);}
function presentCount(d){return data.filter(c=>{const k=getCode(c,d);return k&&k!=='OM';}).length;}

function dayLbl(a){return (a.dayEnd&&a.dayEnd!==a.day)?`${a.day}.–${a.dayEnd}. 6.`:`${a.day}. 6.`;}
const serving=d=>d&&!d.off;
