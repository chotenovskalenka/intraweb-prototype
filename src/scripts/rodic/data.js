/* DATA: RODIC – seed data + čisté datové helpery sdílené více obrazovkami */
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
/* Kulturní fond – čerpání per dítě (dřív společné FONDLOG). Zůstatek se odvozuje součtem. */
const fondCerpano=c=>c.fondlog.reduce((s,x)=>s+x[2],0);

const children=[
  {n:'Eliška',sur:'Dvořáková',ak:'Elišku',dat:'Elišce',base:'O',spi:true,att:{2:'NE',11:'OM'},notes:{11:'rodinná oslava'},
    wa:'https://chat.whatsapp.com/D8pQz1cVsX0Bm4Kr7NyT2A',
    fond:{rocni:2000},
    fondlog:[['Divadelní představení','říjen 2025',250],['Výlet do ZOO','listopad 2025',350],['Výtvarný materiál','leden 2026',200]],
    faktury:genFaktury('01',10584,['Duben 2026','Květen 2026']),
    nahrady:[
      nahFrom(new Date(2026,4,12),'dostupna'),
      nahFrom(new Date(2026,4,20),'dostupna'),
      nahFrom(juneDate(11),'dostupna',{id:'nE-fut',den:11,omId:'omE-fut'}),
      nahFrom(new Date(2026,4,26),'naplanovana',{plan:'Náhradní den · 18. 6.'}),
      nahFrom(new Date(2026,3,8),'vyuzita',{pouzita:'15. 5. 2026'}),
      nahFrom(new Date(2025,4,20),'expirovana'),   // z minulého šk. roku – propadla 30. 6. 2025
      nahFrom(juneDate(2),'nevznikla',{id:'nE-nev',den:2,omId:'omE-2',exp:'–',expT:Infinity}),
    ],
    omluvenky:[
      {id:'omE-fut',od:11,do:11,duvod:'rodinné důvody',pozn:'rodinná oslava',stav:'vcas',nahradaIds:['nE-fut']},
      {id:'omE-2',od:2,do:2,duvod:'nemoc',pozn:'',stav:'po-deadlinu',nahradaIds:['nE-nev']},
    ]},
  {n:'Matěj',sur:'Dvořák',ak:'Matěje',dat:'Matějovi',base:'C',spi:false,att:{},notes:{},
    wa:'https://chat.whatsapp.com/S3fLk9uWpH6Qc1Tz8VbM4E',
    /* celodenní = odpolední docházka + úterý do 17:00; samostatná cena v podkladech není, použita odpolední sazba */
    fond:{rocni:2000},
    fondlog:[['Divadelní představení','říjen 2025',250],['Výlet do ZOO','listopad 2025',350],['Výtvarný materiál','leden 2026',200],['Muzeum a dílna','březen 2026',350],['Jarní výprava','duben 2026',350]],
    faktury:genFaktury('02',10584,[]),   // happy stav – vše uhrazeno
    nahrady:[ nahFrom(new Date(2026,4,15),'dostupna') ],
    omluvenky:[]},
];

/* Profil dítěte – údaje z onboarding dotazníku a souhlasů (převzato ze staršího prototypu
   podklady/prototyp_dochazka_rodic.html). Rodič si část údajů spravuje sám (editace v profilu),
   aby zůstávaly aktuální. Jméno/příjmení se nedrží tady – jsou v child.n/child.sur (data.js).
   Režim se nedrží tady – odvozuje se z child.base přes CODES. */
/* Číselníky (výběr z pevného seznamu, ne volný text). */
const CISELNIK={
  pojistovna:['VZP (111)','VoZP (201)','ČPZP (205)','OZP (207)','ZPŠ (209)','ZPMV (211)','RBP (213)'],
  jazyk:['čeština','čeština + angličtina','čeština + slovenština','čeština + ukrajinština','čeština + jiný'],
  alergie:['pyl','prach / roztoči','srst zvířat','laktóza','lepek','ořechy','vejce','včelí a vosí bodnutí','jiné'],
  strava:['Zajištěná školkou','Vlastní (nosí z domu)'],
};
/* Odvozené zobrazení hodnot z profilu. */
const profAlergie=p=>p.alergie.length?p.alergie.join(', '):'žádné';
const profAno=(flag,text)=>flag?('ano'+(text?' – '+text:'')):'ne';

/* Účet (domácnost) – přihlášený rodič spravuje telefon/e-mail/heslo v Nastavení účtu (core.js overlay 'ucet').
   Telefon i e-mail jsou jediný zdroj pravdy pro oba rodiče napříč dětmi – PROFIL.*.matka/otec je nedrží,
   profil dítěte je jen zobrazuje (viz renderProfil). */
const ACCOUNT={jmeno:'Kateřina Dvořáková',
  telMatka:'+420 774 512 908', telOtec:'+420 603 847 221',
  emailMatka:'k.dvorakova@email.cz', emailOtec:'j.dvorak@email.cz'};

const PROFIL={
  'Eliška':{
    narozeni:'14. 3. 2021', rc:'215314/1001', adresa:'Nad Rokoskou 1230/8, 182 00 Praha 8 – Libeň',
    jazyky:'čeština', pojistovna:'VZP (111)', spadova:'MŠ Ďáblice', sourozenci:'Adam (2018), Matěj (2019)',
    alergie:[], leky:false, lekyText:'', bryle:false, bryleText:'',
    strava:'Zajištěná školkou', dieta:'bez omezení', usinani:'pohlazení po zádech',
    bavi:'Kreslení, malování a modelování, stavění z LEGA, zvířata (hlavně kočky), zpívání písniček.',
    nesouhlas:'Hlasitě si vynucuje, co chce. Doma se snažíme neustoupit.',
    doporuceni:['Trénovat samostatné oblékání (bunda, boty).',
                'Krátké, jasné loučení u brány – pomáhá hladšímu příchodu.']},
  'Matěj':{
    narozeni:'2. 9. 2019', rc:'190902/1004', adresa:'Nad Rokoskou 1230/8, 182 00 Praha 8 – Libeň',
    jazyky:'čeština', pojistovna:'VZP (111)', spadova:'MŠ Ďáblice', sourozenci:'Eliška (2021), Adam (2018)',
    alergie:['pyl'], leky:false, lekyText:'', bryle:true, bryleText:'na blízko',
    strava:'Zajištěná školkou', dieta:'bez omezení', usinani:'nespí',
    bavi:'Stavby z klacků a kamenů, pozorování brouků, běhání a šplhání.',
    nesouhlas:'Stáhne se a mlčí. Pomáhá dát mu chvíli a pak se vrátit.',
    doporuceni:['Podpořit samostatné stolování.',
                'Připomínat pití během dne – sám se nehlásí.']},
};

/* Dokumenty a souhlasy – společné pro celou školku (stejná sada pro každé dítě). */
const SOUHLASY=[
  {t:'Žádost o přijetí',f:'PDF'},
  {t:'Smlouva s rodiči 2025/26',f:'PDF'},
  {t:'Plná moc',f:'DOCX'},
  {t:'Souhlas s pořizováním fotografií',f:'DOCX'},
  {t:'Potvrzení od lékaře',f:'DOCX'},
];

/* Fotky – alba na Google Drive (mimo IS), nepravidelná perioda (týden až měsíc).
   IS jen odkazuje ven; přístup řídí sdílení na Drive (viditelné pro všechny rodiče). Nejnovější první.
   od/do jako [den,měsíc,rok] – zobrazení řeší fmtAlbum() ve fotky.js (zkracuje shodný měsíc/rok). */
const FOTO_ALBA=[
  {nazev:'Červnový týden',od:[2,6,2026],do:[13,6,2026],url:'https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9iJkLmNoPqRsTuVw'},
  {nazev:'Výlet k rybníku',od:[18,5,2026],do:[22,5,2026],url:'https://drive.google.com/drive/folders/2b3C4d5E6f7G8h9I0jKlMnOpQrStUvXy'},
  {nazev:'Duben v lese',od:[1,4,2026],do:[30,4,2026],url:'https://drive.google.com/drive/folders/3c4D5e6F7g8H9i0JkLmNoPqRsTuVwXyZ'},
  {nazev:'Zimní dny',od:[12,1,2026],do:[6,2,2026],url:'https://drive.google.com/drive/folders/4d5E6f7G8h9I0j1KlMnOpQrStUvWxYz1'},
  {nazev:'Vánoční čas',od:[1,12,2025],do:[19,12,2025],url:'https://drive.google.com/drive/folders/5e6F7g8H9i0J1k2LmNoPqRsTuVwXyZ12'},
  {nazev:'Podzimní putování',od:[6,10,2025],do:[24,10,2025],url:'https://drive.google.com/drive/folders/6f7G8h9I0j1K2l3MnOpQrStUvWxYz123'},
];

/* Básnička a písnička aktuálního týdne (texty shodné s průvodcovskou appkou).
   url = proklik (YouTube / jiný odkaz) – reálné vyhledávací odkazy, žádná smyšlená videa. */
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
   full:'Ve třídě se vyskytly roupy. Prosíme, zkontrolujte dnes večer dítě – svědění, neklidný spánek. Pokud roupy najdete, nechte prosím dítě doma do přeléčení (přípravek poradí každá lékárna, léčba je rychlá).\n\nVe školce jsme vyměnili ručníky i povlečení a vše vyprali na 90 °C. Prosíme také o krátké ostříhání nehtíků. Kdybyste si nebyli jistí, ozvěte se Táně – děkujeme za spolupráci.'},
  {id:'nw2',t:'V pátek 5. 6. končíme už ve 14:00 (pedagogická porada).',from:'Táňa',time:'16:12',date:'1. 6.',until:5,urgent:true,
   full:'V pátek 5. 6. končí provoz školky už ve 14:00 – máme celotýmovou pedagogickou poradu.\n\nProsíme, vyzvedněte si děti nejpozději do 14:00. Odpolední svačinu dostanou děti s sebou v krabičce. Pokud by vyzvednutí do 14:00 bylo neřešitelné, napište nám prosím co nejdřív, domluvíme se individuálně. Děkujeme za pochopení.'},
  {id:'nw3',t:'Sbíráme víčka od PET lahví na výtvarku.',from:'Darča',time:'9:05',date:'28. 5.',until:30,img:NEWSFOTO.VICKA,
   full:'Od června sbíráme víčka od PET lahví – budeme z nich s dětmi tvořit velkou letní mozaiku na plot zahrady.\n\nSběrný koš najdete u vchodu do maringotky. Hodí se všechny barvy, čím pestřejší, tím lepší. Sbíráme do konce června; hotovou mozaiku pak slavnostně odhalíme na zahradní slavnosti.'},
  {id:'nw4',t:'Fotky z výpravy na Okoř najdete ve složce Fotky.',from:'Honza',time:'18:30',date:'26. 5.',until:12,img:NEWSFOTO.OKOR,
   full:'Výprava na Okoř se vydařila – počasí nám přálo, děti zvládly celou trasu a zřícenina sklidila obrovský úspěch (stejně jako svačiny od vás, děkujeme!).\n\nFotky z celého dne najdete ve složce Fotky. Pokud byste některou chtěli v plném rozlišení, napište Honzovi.'},
  {id:'nw5',t:'Brigáda na zahradě 13. 6. – hlaste se prosím v tabulce.',from:'Míša',time:'20:15',date:'25. 5.',until:13,img:NEWSFOTO.BRIGADA,
   full:'V sobotu 13. 6. od 9:00 chystáme brigádu na zahradě – čeká nás stavba nového záhonu, oprava vrbového tunelu a nátěr herních prvků.\n\nHlaste se prosím v tabulce (odkaz jsme posílali e-mailem), ať víme počty na občerstvení. Nářadí máme, hodí se ale vlastní rukavice. Děti jsou vítané – pro malé pomocníky bude připravený dětský koutek.'},
  {id:'nw6',t:'Nový jídelníček na červen je ke stažení v appce.',from:'Míša',time:'8:10',date:'23. 5.',until:30,
   full:'Jídelníček na červen najdete v appce v sekci Přehled → Co bude dítě jíst, případně přímo v Jídelníčku (proklik z dnešního dne).\n\nDodává ho stále Mamafood, alergeny jsou uvedené čísly dle přílohy vyhlášky.'},
  {id:'nw7',t:'Preventivní prohlídka zoubků s dentální hygienistkou 6. 6.',from:'Táňa',time:'15:40',date:'22. 5.',until:6,
   full:'V pátek 6. 6. dopoledne k nám přijede dentální hygienistka na krátkou preventivní prohlídku a povídání o čištění zoubků.\n\nNejde o lékařský zákrok, jen o motivační program – kdo nechce, nemusí se účastnit. Dejte prosím vědět Táně, pokud dítě účast nechcete.'},
  {id:'nw8',t:'Kurz plavání pro předškoláky startuje 9. 6.',from:'Honza',time:'19:20',date:'21. 5.',until:9,
   full:'Od pondělí 9. 6. začíná čtyřtýdenní kurz plavání pro předškoláky v bazénu na Šutce. Odjezd vždy v 9:00, návrat do oběda.\n\nPřihlášené děti už máme v seznamu, plavky a ručník stačí přibalit v pondělí ráno.'},
  {id:'nw9',t:'Upozornění: dočasná uzavírka příjezdové cesty 27.–28. 5.',from:'Darča',time:'17:05',date:'20. 5.',until:28,
   full:'Kvůli opravě vodovodu bude 27. a 28. 5. uzavřená příjezdová cesta k maringotce od hlavní silnice. Objízdná trasa vede přes cestu od hřiště.\n\nPočítejte prosím s pár minutami navíc při ranním předávání.'},
  {id:'nw10',t:'Sbírka pro útulek pokračuje, děkujeme za darované konzervy.',from:'Míša',time:'16:00',date:'19. 5.',until:20,
   full:'Sbírka krmiva a konzerv pro místní útulek stále běží, sběrná krabice je u vstupu. Za dosavadní příspěvky moc děkujeme, útulek už si jednu dávku vyzvedl.\n\nSbíráme až do konce června, poslední odvoz plánujeme na začátku prázdnin.'},
  {id:'nw11',t:'Výsledky sběru starého papíru – děkujeme za 340 kg!',from:'Honza',time:'14:30',date:'16. 5.',until:25,
   full:'Za dubnovo-květnové kolo sběru papíru jsme dohromady odevzdali 340 kg. Výtěžek půjde na doplnění výtvarných potřeb a nářadí na zahradu.\n\nDěkujeme všem, kdo nosili – zvlášť rodinám, které to táhly ve velkém.'},
  {id:'nw12',t:'Focení na zahradní slavnost bude 20. 6. odpoledne.',from:'Táňa',time:'13:15',date:'15. 5.',until:20,
   full:'Fotografka k nám dorazí 20. 6. odpoledne, kdy proběhne i společné focení tříd. Pokud nechcete, aby bylo vaše dítě na společné fotce, dejte prosím vědět předem.\n\nJednotlivé portréty dětí budou k objednání zvlášť, informace pošleme s předstihem.'},
  {id:'nw13',t:'Noví průvodci: od září posílíme tým o jednoho kolegu.',from:'Darča',time:'11:50',date:'14. 5.',until:30,
   full:'Od září k nám nastoupí nový průvodce, momentálně dokončuje kurz lesní pedagogiky. Během června se s dětmi postupně seznámí na pár návštěvách.\n\nVíc informací pošleme, jakmile bude jasný rozvrh na příští školní rok.'},
  {id:'nw14',t:'Dětský den se povedl, foto galerie brzy ve Fotkách.',from:'Míša',time:'18:45',date:'2. 5.',until:15,
   full:'Děkujeme všem, kdo pomohli s přípravou i průběhem dětského dne – soutěžní stanoviště, opékání i hledání pokladu se moc povedly.\n\nFotky z akce zpracováváme, album přidáme do sekce Fotky v nejbližších dnech.'},
];
const ALERTS=[
  {text:'Ve třídě se vyskytly roupy. Prosíme, zkontrolujte dítě.',until:5},
];
const EVENTS={
  3:{title:'Společné putování Ďábličákem',place:'Vozovna Kobylisy',time:'8:00–8:30',note:'Na oběd jsme zpět ve školce.',sbalit:'pláštěnku a náhradní ponožky',map:'https://mapy.com/s/papobonuzu',gps:'50.1339225N, 14.4545787E'},
  4:{title:'Výlet předškoláků – horolezení',place:'Jungle Sport park, Letňany',time:'8:00–8:30',note:'Na oběd zpět do školky. Děti odpoledne nespí.',sbalit:'sportovní boty a pití',map:'',gps:''},
};
/* Denní program (činnost) dle dne v týdnu – zdroj: Pro rodiče 25_26 vhaaji.xlsx, tab ČERVEN.
   Každý pracovní den má téma; speciální akce (výlety, sraz) navíc v EVENTS. */
const DENNI=['Rytmika','Putování','Pohyb','Tvorba','Hrátky s pohádkou'];
/* Průvodci – skutečná jména a telefony. photo = klíč do PHOTOS (kdo nemá, dostane generovaný avatar).
   h = dnešní hodiny (jen u těch v GUIDES_TODAY, pro dashboard „Průvodci dnes"). */
const guides=[
  {n:'Tereza',sur:'Vavrečková',phone:'+420 603 200 512',email:'tereza@vhaaji.cz'},
  {n:'Gabriela',sur:'Vašíčková',photo:'Gabča',h:'7:30–16:00',phone:'+420 604 553 246',email:'gabca@vhaaji.cz'},
  {n:'Darina',sur:'Mikolášová',photo:'Darča',h:'7:30–16:00',phone:'+420 603 290 593',email:'darina@vhaaji.cz',uspava:true},
  {n:'Honza',sur:'Kolář',photo:'Honza',h:'8:00–16:30',phone:'+420 605 426 333',email:'honza@vhaaji.cz'},
  {n:'Ksenia',sur:'Andramanova',photo:'Ksenia',phone:'+420 721 472 219',email:'ksenia@vhaaji.cz'},
  {n:'Eva',sur:'Sionová',phone:'+420 777 752 533',email:'eva@vhaaji.cz'},
  {n:'Michaela',sur:'Hrubínová',photo:'Míša',phone:'+420 733 142 437',email:'michaela@vhaaji.cz'},
  {n:'Táňa',sur:'Kynclová',photo:'Táňa',h:'7:30–16:00',phone:'+420 775 241 758',email:'tana@vhaaji.cz'},
];
const GUIDES_TODAY=[7,2,3,1];   // dnes ve školce (Táňa, Darina, Honza, Gabriela) – dashboard „Průvodci dnes"
const SCHOOL={name:'Lesní školka Vhaaji',email:'jsme@vhaaji.cz',phone:'+420 603 200 512',adresa:'Ďáblický háj, Praha 8',
  wa:'https://chat.whatsapp.com/K7mQx2vLpR4Nt9wYh3Jd6F'};
const WEATHER={
  3:{icon:'🌦',t9:14,t17:19,desc:'přeháňky během dne',nightRain:true},
  4:{icon:'☀️',t9:15,t17:23,desc:'slunečno',nightRain:false},
  5:{icon:'⛅',t9:13,t17:20,desc:'polojasno',nightRain:false},
  8:{icon:'🌧',t9:12,t17:16,desc:'déšť',nightRain:true},
};
const WDEF={icon:'⛅',t9:14,t17:21,desc:'polojasno',nightRain:false};
/* Jídelníček převzatý z reálného týdenníku Vhaaji (list „Jídelníček cerven", Pro rodiče 25_26.xlsx):
   obědy veganské z bistra Mamafood, živočišná složka jen ve svačinkách. Alergeny číslované dle
   přílohy vyhlášky – viz ALERGENY_NAZVY níže. Zdroj má svačinky u 1. týdne (1.–5. 6.) prázdné,
   doplněny stejnou skladbou jako u 2. týdne (reálné recepty, jen z jiného týdne).
   JIDELNICEK = 4 celé týdny (červen 2026 má jen 26 pracovních dní do konce 4. týdne;
   5. týden 29.–30. 6. je ve zdroji nedodaný – viz jidelnicekDen(), vrací null → zobrazí se prázdný stav). */
const JIDELNICEK=[
  {od:1,do:5,dny:[
    [['Svačinka 1','Pečivo (1× bez sóji), Lučina, zelenina',''],['Polévka','Žampiónový krém se sušenými švestkami',''],['Hlavní jídlo','Luštěninové karbanátky s bramborovou kaší a mrkvovým salátkem',''],['Svačinka 2','Pečivo (1× bez sóji), pomazánkové máslo, šunka, zelenina','']],
    [['Svačinka 1','Pečivo (1× bez sóji), vajíčková pomazánka, zelenina',''],['Polévka','Fazolačka s kořenovou zeleninou','9'],['Hlavní jídlo','Zeleninová smetanová omáčka s hrachovými koulemi, bramborami a karamelizovanou mrkví',''],['Svačinka 2','Tortilla plněná kečupem, šunkou a sýrem, zelenina','7']],
    [['Svačinka 1','Ochucená mléčná kaše, ovoce','7'],['Polévka','Krém z červené čočky s mrkví a kokosovým mlékem',''],['Hlavní jídlo','Těstoviny se smetanovou omáčkou s hráškem, mrkví a květákem, fazolkami a oříškovou posypkou','1, 8'],['Svačinka 2','Pečivo (1× bez sóji), pomazánkové máslo, zelenina','']],
    [['Svačinka 1','Domácí chléb, tuňáková pomazánka, zelenina','4'],['Polévka','Hrstková s kořenovou zeleninou',''],['Hlavní jídlo','Koprová omáčka s pečenými sójovými plátky a bramborami (hrachovými kuličkami nebo lupinovým tempehem)','6'],['Svačinka 2','Pečivo (1× bez sóji), máslo, sýr, zelenina','7']],
    [['Svačinka 1','Ochucená mléčná kaše, ovoce','7'],['Polévka','Květákový krém',''],['Hlavní jídlo','Zeleninové rizoto s fazolkami a kedlubnovým salátkem s granátovým jablíčkem',''],['Svačinka 2','Domácí bublanina','1']],
  ]},
  {od:8,do:12,dny:[
    [['Svačinka 1','Pečivo (1× bez sóji), Lučina, zelenina',''],['Polévka','Mrkvová s pomerančem',''],['Hlavní jídlo','Čočka na kyselo s cibulkou a tofu „vajíčky", rajčatovo-okurkový salátek','6'],['Svačinka 2','Pečivo (1× bez sóji), pomazánkové máslo, šunka, zelenina','']],
    [['Svačinka 1','Pečivo (1× bez sóji), vajíčková pomazánka, zelenina',''],['Polévka','Ochucená mléčná kaše, ovoce','7'],['Hlavní jídlo','Pečená zelenina s bramborami, křupavým tofu a domácí tatarkou','6'],['Svačinka 2','Tortilla plněná kečupem, šunkou a sýrem, zelenina','7']],
    [['Svačinka 1','Ochucená mléčná kaše, ovoce','7'],['Polévka','Batátový krém s karamelizovanými hruškami',''],['Hlavní jídlo','Květákové placičky s cizrnou, bramborovo-hráškové pyré a salátek',''],['Svačinka 2','Pečivo (1× bez sóji), pomazánkové máslo, zelenina','']],
    [['Svačinka 1','Domácí chléb, tuňáková pomazánka, zelenina','4'],['Polévka','Zeleninová s květákem, mrkví a bramborami',''],['Hlavní jídlo','Těstoviny se smetanovou omáčkou s hráškem, mrkví a květákem, fazolkami a oříškovou posypkou','1, 8'],['Svačinka 2','Pečivo (1× bez sóji), máslo, sýr, zelenina','7']],
    [['Svačinka 1','Ochucená mléčná kaše, ovoce','7'],['Polévka','Zeleninová minestrone s bylinkovým pestem',''],['Hlavní jídlo','Chana masala s jasmínovou rýží a cizrnou',''],['Svačinka 2','Domácí bublanina','1']],
  ]},
  {od:15,do:19,dny:[
    [['Svačinka 1','Pečivo (1× bez sóji), Lučina, zelenina',''],['Polévka','Petrželový krém s bylinkovým pestem',''],['Hlavní jídlo','Zeleninové kung pao s tempehem, arašídy a jasmínovou rýží','5, 6'],['Svačinka 2','Pečivo (1× bez sóji), máslo, sýr, zelenina','']],
    [['Svačinka 1','Pečivo (1× bez sóji), salámová pomazánka, zelenina',''],['Polévka','Zeleninová s květákem, hráškem a kapustou',''],['Hlavní jídlo','Cuketové bramboráčky se zeleninovou omáčkou a pečenými hrachovými nudličkami','1'],['Svačinka 2','Tortilla plněná kečupem, šunkou a sýrem, zelenina','']],
    [['Svačinka 1','Ochucená mléčná kaše, ovoce','7'],['Polévka','Bramboračka s kořenovou zeleninou','9'],['Hlavní jídlo','Mac and cheese (krémová sýrová omáčka ze zeleniny a kešu oříšků s kolínky)','1, 8'],['Svačinka 2','Pečivo (1× bez sóji), pomazánkové máslo, šunka, zelenina','']],
    [['Svačinka 1','Domácí chléb, tuňáková pomazánka, zelenina','4'],['Polévka','Zeleninový vývar s nudličkami','1, 9'],['Hlavní jídlo','Buchtičky se šodó, vanilkovým krémem a ovocem','1'],['Svačinka 2','Smetanový jogurt s vločkami, rozinkami, mákem a ořechy, ovoce','']],
    [['Svačinka 1','Ochucená mléčná kaše, ovoce','7'],['Polévka','Pórkový krém s pečenou cizrnou',''],['Hlavní jídlo','Tomatová omáčka s těstovinami, hrachovými kuličkami a oříškovou posypkou','1, 8'],['Svačinka 2','Domácí maková buchta, ovoce','']],
  ]},
  {od:22,do:26,dny:[
    [['Svačinka 1','Pečivo (1× bez sóji), Lučina, zelenina',''],['Polévka','Cuketový krém',''],['Hlavní jídlo','Znojemská omáčka s pečenými sójovými/hrachovými nudličkami s jasmínovou rýží','6'],['Svačinka 2','Pečivo (1× bez sóji), pomazánkové máslo, šunka, zelenina','']],
    [['Svačinka 1','Pečivo (1× bez sóji), pomazánka s pažitkou, zelenina',''],['Polévka','Kukuřičná s cherry rajčaty a kokosovým mlékem',''],['Hlavní jídlo','Boloňské špagety s mrkví, červenou čočkou a oříšky','1, 8'],['Svačinka 2','Tortilla plněná kečupem, šunkou a sýrem, zelenina','']],
    [['Svačinka 1','Ochucená mléčná kaše, ovoce','7'],['Polévka','Čočková s kořenovou zeleninou','9'],['Hlavní jídlo','Cizrnovo-řepné karbanátky s bramborovo-mrkvovým pyré, čerstvá zelenina',''],['Svačinka 2','Pečivo (1× bez sóji), domácí guacamole, zelenina','']],
    [['Svačinka 1','Domácí chléb, tuňáková pomazánka, zelenina','4'],['Polévka','Zeleninová s ječnými kroupami','1, 9'],['Hlavní jídlo','Plněné bramborové knedlíky se zelím a cibulkou, plněné hrachovým granulátem','1'],['Svačinka 2','Pečivo (1× bez sóji), máslo, sýr, zelenina','']],
    [['Svačinka 1','Ochucená mléčná kaše, ovoce','7'],['Polévka','Tomatová s rýžovými hvězdičkami',''],['Hlavní jídlo','Zeleninové kari s květákem, batáty, dýní a cizrnou, jasmínová rýže',''],['Svačinka 2','Croissant, sýr, salátek, zelenina','']],
  ]},
];
/* Vrátí jídelníček dne (5 položek: svačinky/polévka/hlavní) podle dne v měsíci, nebo null,
   pokud pro daný den (víkend, nebo mimo dodané 4 týdny – 27.–30. 6.) žádný není. */
function jidelnicekTyden(den){return JIDELNICEK.find(t=>den>=t.od&&den<=t.do);}
function jidelnicekDen(den){const t=jidelnicekTyden(den);return t?t.dny[wd(den)]:null;}
/* Alergeny dle přílohy vyhlášky (jen ty, které se v jídelníčku Vhaaji reálně objevují). */
const ALERGENY_NAZVY={1:'lepek',4:'ryby',5:'arašídy',6:'sója',7:'mléko',8:'skořápkové plody',9:'celer'};
function alergenyZDne(dny){
  const s=new Set();
  dny.forEach(it=>{if(it[2])it[2].split(',').forEach(c=>{c=c.trim();if(c)s.add(Number(c));});});
  return [...s].sort((a,b)=>a-b);
}
function alergenyLegenda(dny){
  const cisla=alergenyZDne(dny);
  if(!cisla.length)return '';
  return `<div class="alerg-legend">Alergeny: `+cisla.map(c=>`<b>${c}</b> ${ALERGENY_NAZVY[c]||''}`).join(', ')+`</div>`;
}
/* Výlet předškoláků je každý měsíc 1. čtvrtek (v červnu horolezení v Letňanech). */
const akce=[
  {title:'Výlet předškoláků – horolezení',date:'čt 4. 6.',time:'8:00–8:30',place:'Jungle Sport park, Letňany',note:'Sraz na místě, na oběd zpět do školky. Děti odpoledne nespí.'},
  {title:'Brigáda na zahradě',date:'so 13. 6.',time:'9:00–12:00',place:'Zahrada školky',note:'Společné hrabání a sázení pro rodiče i děti. Občerstvení zajištěno.'},
];
const EVMAP={
  4:[{t:'Výlet předškoláků – horolezení',type:'akce'}],
  5:[{t:'Pedagogická porada – školka zavřená',type:'org'}],
  8:[{t:'Kroužek Tanečky s Niki · 15:15',type:'rozvrh'}],
  10:[{t:'Narozeniny – Eliška',type:'naro',vek:5}],
  11:[{t:'Předškolácký den',type:'rozvrh'}],
  13:[{t:'Brigáda na zahradě',type:'akce'}],
  17:[{t:'Narozeniny – Tonička',type:'naro',vek:4}],
  18:[{t:'Kroužek Živly se Shaunem · 14:00',type:'rozvrh'}],
  20:[{t:'Tatínkovský den',type:'akce'}],
  24:[{t:'Výprava do lesa',type:'akce'},{t:'Narozeniny – Kuba',type:'naro',vek:6}],
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

// celodenní docházka je jen v úterý – v ostatní dny platí odpolední
const code=(c,d)=>c.att[d]||(c.base==='C'&&wd(d)!==1?'O':c.base);
const chip=cd=>`<span class="chip" style="background:${CODES[cd][2]};color:${CODES[cd][1]}">${CODES[cd][0]}</span>`;
const cur=()=>children[ci];
const plural=n=>n===1?'den':(n>=2&&n<=4?'dny':'dní');
const telnum=p=>p.replace(/ /g,'');
const kc=n=>n.toLocaleString('cs-CZ');
