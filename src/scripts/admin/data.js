/* DATA: ADMIN – seed pro appku vedení/administrativy (čtyři školky).
   Data se s ostatními appkami NESDÍLEJÍ; kde to dává smysl, čísla sedí s mobilními appkami
   (např. Eliška Dvořáková má neuhrazenou fakturu za březen – viz rodic/data.js). */

const TODAYD=3;                    // St 3. 6. 2026 – shodný simulovaný čas jako ostatní appky

/* Sesterské školky: obsazenost/kapacita a třídy/skupiny. Vhaaji sedí s průvodcovskou
   appkou (25 dětí). Názvy převzaty z reálného intrawebu – viz decision-log, revize dle
   reality. Kouzlo lesa je samostatná školka (ne třída Jaaty). Školka s jednou skupinou
   má jednu třídu pojmenovanou po sobě (obsazenost se všude odvozuje z pole tříd). */
const SKOLKY=[
  {id:'vhaaji',nazev:'Vhaaji',kapacita:28,tridy:[
    {n:'Vhaaji',obs:13,kap:14},
    {n:'Vhaaji žlutá',obs:12,kap:14},
  ]},
  {id:'jaata',nazev:'Jaata',kapacita:12,tridy:[
    {n:'Jaata',obs:12,kap:12},
  ]},
  {id:'kouzlo',nazev:'Kouzlo lesa',kapacita:14,tridy:[
    {n:'Kouzlo lesa',obs:12,kap:14},
  ]},
  {id:'maata',nazev:'Maata',kapacita:20,tridy:[
    {n:'Modrá třída',obs:9,kap:10},
    {n:'Zelená třída',obs:7,kap:10},
  ]},
];
const obsazeno=s=>s.tridy.reduce((n,t)=>n+t.obs,0);

/* Stavy platby (BRIEF kap. 4). Fakturační modul se nedělá – dashboard jen přehled
   „řeší se mimo appku". Částky dle reálných příruček 2024/25: Vhaaji odpolední docházka
   10 584 Kč (Eliška = shoda s rodic/data.js), Maata 3× týdně do 15:00 = 11 813 Kč. */
const PLATBASTAVY={
  'uhrazeno':{lab:'Uhrazeno',cls:'ok'},
  'neuhrazeno':{lab:'Neuhrazeno',cls:'ne'},
  'po-splatnosti':{lab:'Po splatnosti',cls:'al'},
  'castecne':{lab:'Částečně uhrazeno',cls:'part'},
  'ceka':{lab:'Čeká na spárování',cls:'wait'},
  'preplatek':{lab:'Přeplatek',cls:'wait'},
  'storno':{lab:'Storno',cls:'mute'},
};
/* Faktury (BRIEF kap. 4, draft-admin 4.2). Školné se vystavuje dopředu na další měsíc, stravné
   zpětně za uplynulý měsíc podle snědených jídel – proto je „pokaždé jiné". Děti jsou tytéž
   jako v Náhradách (NAHRADY_DETI). Ceny: Vhaaji 10 584 Kč (příručka, odpolední = celodenní),
   Maata 11 813 Kč (příručka); dopolední Vhaaji, Jaata a Kouzlo lesa jsou odhad pro prototyp.
   Stravné: oběd 75 Kč + svačina 25 Kč (dopolední 1 svačina, ostatní 2). */
const SKOLNE={vhaaji:{D:8400,O:10584,C:10584},jaata:{D:7200,O:8200,C:8200},kouzlo:{D:8100,O:9500,C:9500},maata:{D:9900,O:11813,C:11813}};
const STRAVNE_DEN={D:100,O:125,C:125};
const FAKT_MESICE_A=[
  {key:'2026-03',lab:'Březen 2026',vyst:'9. 3. 2026',spl:'23. 3. 2026',poDnu:72},
  {key:'2026-04',lab:'Duben 2026',vyst:'9. 4. 2026',spl:'23. 4. 2026',poDnu:41},
  {key:'2026-05',lab:'Květen 2026',vyst:'9. 5. 2026',spl:'23. 5. 2026',poDnu:11},
  {key:'2026-06',lab:'Červen 2026',vyst:'27. 5. 2026',spl:'10. 6. 2026',poDnu:0},
];
/* Provozní a systémová upozornění. Chybějící data se počítají z matriky (MATRIKA_POLE). */
const UPOZORNENI=[
  {typ:'provoz',text:'Jaata je plně obsazená – 3 rodiny v pořadníku',skolka:'Jaata'},
  {typ:'system',text:'Záloha dat proběhla v pořádku (3. 6. 04:00)',skolka:''},
];

/* Dnes ve školkách – Terčin „dohled" (draft-admin 4.1). Vhaaji sedí s průvodcovskou appkou
   (25 dětí, dnes 21 ve školce, 4 průvodci), ostatní s přehledem kuchyně (KUCH_SKOLKY). */
const DNES_SKOLKY={
  vhaaji:{pritomno:21,omluveno:3,nevyreseno:1,pruvodci:4},
  jaata:{pritomno:10,omluveno:2,nevyreseno:0,pruvodci:2},
  kouzlo:{pritomno:10,omluveno:1,nevyreseno:1,pruvodci:2},
  maata:{pritomno:15,omluveno:1,nevyreseno:0,pruvodci:3},
};

/* Aktuality (Flow 4). Stavy: koncept / naplanovana / odeslana / archivovana.
   `naplanovana` jen v seed datech – plánování odeslání se nedělá (viz decision-log).
   `recip` = mapa skolkaId → {all:bool, tridy:[názvy tříd]}; příjemci jsou POVINNÍ pro odeslání.
   „Bez určených příjemců" (BRIEF kap. 4) je chyba, ne stav – v datech se neukládá.
   Odeslané aktuality sedí s NEWS v rodičovské appce (roupy, dřívější vyzvednutí) – simulace shodou seedu, žádné sdílení. */
const AKSTAV={
  koncept:{lab:'Koncept',cls:'wait'},
  naplanovana:{lab:'Naplánovaná',cls:'part'},
  odeslana:{lab:'Odeslaná',cls:'sent'},
  archivovana:{lab:'Archivovaná',cls:'arch'},
};
let akUid=10;
let AKTUALITY=[
  {id:'ak1',text:'Ve třídě se vyskytly roupy. Prosíme, zkontrolujte dítě.',urgent:true,stav:'odeslana',datum:'2. 6. 2026',recip:{vhaaji:{all:true,tridy:[]}}},
  {id:'ak2',text:'V pátek 5. 6. končíme už ve 14:00 (pedagogická porada). Prosíme o dřívější vyzvednutí.',urgent:true,stav:'odeslana',datum:'1. 6. 2026',recip:{vhaaji:{all:true,tridy:[]}}},
  {id:'ak3',text:'Sbíráme víčka od PET lahví na výtvarku – sběrný koš je u vchodu do maringotky.',urgent:false,stav:'archivovana',datum:'28. 5. 2026',recip:{vhaaji:{all:false,tridy:['Vhaaji žlutá']}}},
  {id:'ak4',text:'Letní provoz: přihlašování na červencové týdny je otevřené do 20. 6.',urgent:false,stav:'naplanovana',datum:'odešle se 10. 6. 2026',recip:{vhaaji:{all:true,tridy:[]},jaata:{all:true,tridy:[]},kouzlo:{all:true,tridy:[]},maata:{all:true,tridy:[]}}},
  {id:'ak5',text:'Brigáda na zahradě 13. 6. – připravit přihlašovací tabulku a rozeslat rodinám.',urgent:false,stav:'koncept',datum:'',recip:{}},
];
// souhrn příjemců aktuality → pole vět „Školka – všichni/třídy (N rodin)"; počet rodin ~ obsazenost
function recipText(recip){
  const parts=[];
  SKOLKY.forEach(s=>{
    const r=recip[s.id]; if(!r)return;
    if(r.all){parts.push(`${s.nazev} – všichni (${obsazeno(s)} rodin)`);}
    else if(r.tridy&&r.tridy.length){
      const fam=r.tridy.reduce((n,tn)=>{const t=s.tridy.find(x=>x.n===tn);return n+(t?t.obs:0);},0);
      parts.push(`${s.nazev} – ${r.tridy.join(', ')} (${fam} rodin)`);
    }
  });
  return parts;
}
const hasRecip=recip=>SKOLKY.some(s=>{const r=recip[s.id];return !!(r&&(r.all||(r.tridy&&r.tridy.length)));});

/* Porady a evaluace (Flow 5). Jeden zdroj pravdy pro sekci Porady i dashboardovou
   dlaždici „poslední porady". Každý zápis = datum + typ + školka + účastníci +
   odstavce označené štítky. Filtr štítek+období vypíše jen relevantní odstavce napříč zápisy.
   `dt` = číselné datum (RRRRMMDD) pro řazení a filtr období; `datum` = zobrazovaný text. */
const STITKY=['hygiena','bezpečnost','personál','provoz','pedagogika','inspekce'];
const OBDOBI=[
  {k:'vse',   label:'Celé období',            from:0,        to:99999999},
  {k:'podzim',label:'Podzim 2025 (9–12/2025)',from:20250901, to:20251231},
  {k:'zima',  label:'Zima 2026 (1–3/2026)',   from:20260101, to:20260331},
  {k:'jaro',  label:'Jaro 2026 (4–6/2026)',   from:20260401, to:20260630},
];
let zapisUid=20;
let ZAPISY=[
  {id:'z1',dt:20250910,datum:'10. 9. 2025',typ:'porada',skolka:'Vhaaji',nazev:'Zahájení školního roku',ucastnici:['Táňa','Darča','vedení'],odstavce:[
    {text:'Adaptace nových dětí proběhla klidně, dvě děti potřebují ještě delší doprovod rodičů při ranním předávání.',stitky:['pedagogika']},
    {text:'Zkontrolovány lékárničky ve všech maringotkách, doplněny náplasti a dezinfekce; evidence úrazů založena na nový rok.',stitky:['hygiena','bezpečnost']},
  ]},
  {id:'z2',dt:20251002,datum:'2. 10. 2025',typ:'porada',skolka:'Jaata',nazev:'Provozní porada – říjen',ucastnici:['Gabča','vedení'],odstavce:[
    {text:'Revize elektrických spotřebičů proběhla, jeden vařič vyřazen z provozu, objednán nový.',stitky:['bezpečnost','provoz']},
    {text:'Nová posila do týmu nastupuje od listopadu – zajistit zaškolení a rozšíření o BOZP.',stitky:['personál']},
  ]},
  {id:'z3',dt:20251114,datum:'14. 11. 2025',typ:'evaluace',skolka:'Vhaaji',nazev:'Čtvrtletní evaluace pedagogů',ucastnici:['Táňa','Darča','Honza'],odstavce:[
    {text:'Reflexe adaptačního období – děti dobře zvládají rytmus dne, ranní kruh se osvědčil.',stitky:['pedagogika']},
    {text:'Doporučení: v chladném počasí zařadit více pohybových aktivit a zkrátit statické bloky.',stitky:['pedagogika','provoz']},
  ]},
  {id:'z4',dt:20251205,datum:'5. 12. 2025',typ:'porada',skolka:'Maata',nazev:'Zimní provoz a bezpečnost',ucastnici:['Míša','vedení'],odstavce:[
    {text:'Kontrola zimního vybavení dětí; upozornit rodiče na chybějící rukavice a náhradní oblečení.',stitky:['provoz']},
    {text:'Nácvik evakuace při požáru proběhl s dětmi hravou formou, únikové cesty volné.',stitky:['bezpečnost']},
  ]},
  {id:'z5',dt:20260120,datum:'20. 1. 2026',typ:'porada',skolka:'Vhaaji',nazev:'Provozní porada – leden',ucastnici:['Táňa','vedení'],odstavce:[
    {text:'Chřipková sezóna – zpřísněná hygiena rukou, častější větrání a dezinfekce ploch.',stitky:['hygiena']},
    {text:'Revize smlouvy s dodavatelem obědů, cena od února mírně roste; informovat rodiče.',stitky:['provoz']},
  ]},
  {id:'z6',dt:20260211,datum:'11. 2. 2026',typ:'evaluace',skolka:'Jaata',nazev:'Pololetní evaluace',ucastnici:['Gabča','vedení'],odstavce:[
    {text:'Hodnocení individuálních plánů předškoláků – tři děti připravené na zápis do školy.',stitky:['pedagogika']},
    {text:'Personální stabilita – bez fluktuace, tým sehraný, rozvrh služeb funguje.',stitky:['personál']},
  ]},
  {id:'z7',dt:20260318,datum:'18. 3. 2026',typ:'porada',skolka:'Vhaaji',nazev:'Příprava na inspekci ČŠI',ucastnici:['Táňa','Darča','vedení'],odstavce:[
    {text:'Kompletace dokumentace k inspekci – třídnice, evidence úrazů, podepsané souhlasy GDPR.',stitky:['inspekce','provoz']},
    {text:'Kontrola pitného režimu a skladování potravin, teploty lednic zaznamenávány denně.',stitky:['hygiena','inspekce']},
  ]},
  {id:'z8',dt:20260505,datum:'5. 5. 2026',typ:'porada',skolka:'Maata',nazev:'Bezpečnost a revize prostředí',ucastnici:['Míša','vedení'],odstavce:[
    {text:'Revize dřevěných herních prvků na zahradě – dva prvky určeny k opravě, dočasně ohrazeny.',stitky:['bezpečnost','provoz']},
    {text:'Kontrola lékárniček a expirací léčiv, prošlé položky vyřazeny a doplněny.',stitky:['hygiena','bezpečnost']},
  ]},
  {id:'z9',dt:20260602,datum:'2. 6. 2026',typ:'porada',skolka:'Vhaaji',nazev:'Provozní porada – červen',ucastnici:['Táňa','vedení'],odstavce:[
    {text:'Uzávěrka docházky a náhrad před koncem školního roku, kontrola nevyčerpaných náhrad.',stitky:['provoz']},
    {text:'Plán letního provozu a personální pokrytí prázdninových týdnů.',stitky:['personál','provoz']},
  ]},
];

/* ===== NÁHRADY (admin) – v hodinách, pravidlo podle školky =====
   Rozhodnutí 10. 10. 2026: náhrady se v adminu počítají v HODINÁCH, jako je vede Radka
   a jak to popisují příručky. Vhaaji (příručka, potvrzeno): „Děti mají nárok na 20 %
   náhrady omluvené absence – ze 100 hodin omluvené absence nabízíme 20 hodin k čerpání
   v odpoledních hodinách / úterní docházkou do 17 hodin." Omluvená = zadaná do 20:00
   předchozího dne. Děti s plnou (odpolední) docházkou mohou čerpat i 2 týdny příměstských
   táborů. Maata (příručka): pevný roční balík hodin podle rozsahu docházky. Jaata a Kouzlo
   lesa: pravidlo v podkladech není – převzato 20 % s příznakem k ověření.
   Seed: jména smyšlená; rozložení čísel podle Radčiny tabulky (100 dětí: připsáno medián
   43 h, čerpáno medián 16,5 h, zbývá −89 až 94 h, 23 % dětí v záporu). */
const NAHR_PRAVIDLA={
  vhaaji:{typ:'procento',p:.2,overeno:true},
  jaata:{typ:'procento',p:.2,overeno:false},
  kouzlo:{typ:'procento',p:.2,overeno:false},
  maata:{typ:'pausal',h:{D:30,O:80,C:100},overeno:true},
};
const NAHR_PAUSAL={D:30,O:80,C:100};          // Terčin návrh / pravidlo Maaty – pro náhled
const REZIM_LAB={D:'dopolední',O:'odpolední',C:'celodenní'};
const REZIM_H={D:5,O:7,C:9};                  // délka dne v hodinách (do 13 / 15 / 17)
const NAHR_EXP='30. 6. 2026', NAHR_DNU_DO_EXP=27;
const NAHRADY_DETI=(()=>{
  const JM=['Adam','Bára','Cyril','Dora','Ema','Filip','Gréta','Hugo','Ida','Jonáš','Kája','Lukáš','Mia','Nela','Ondra','Pavla','Quido','Rozálie','Sam','Táňa','Vojta','Zoe','Matyáš','Anička','Šimon','Julie','Kryštof','Ela','Tadeáš','Viki'];
  const PR=['Novák','Svoboda','Dvořák','Černý','Procházka','Kučera','Veselý','Horák','Němec','Marek','Pospíšil','Hájek','Jelínek','Král','Růžička','Beneš','Fiala','Sedláček','Doležal','Zeman'];
  const tridy=[['vhaaji','Vhaaji','Vhaaji',13],['vhaaji','Vhaaji','Vhaaji žlutá',12],['jaata','Jaata','Jaata',12],
    ['kouzlo','Kouzlo lesa','Kouzlo lesa',12],['maata','Maata','Modrá třída',9],['maata','Maata','Zelená třída',7]];
  const OML=[40,70,120,150,180,215,240,260,300,340,400,480,510];       // omluvené hodiny za rok
  const FAKT=[0,0,.15,.3,.45,.6,.8,.95,1.1,1.4,1.9,2.6];                // čerpáno / připsáno
  let seed=7; const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
  const pick=a=>a[Math.floor(rnd()*a.length)];
  const MES=['září','říjen','listopad','prosinec','leden','únor','březen','duben','květen'];
  const MESD=['30. 9. 2025','31. 10. 2025','30. 11. 2025','31. 12. 2025','31. 1. 2026','28. 2. 2026','31. 3. 2026','30. 4. 2026','31. 5. 2026'];
  const out=[]; let id=0;
  tridy.forEach(([sk,skN,tr,n])=>{for(let k=0;k<n;k++){
    const r=rnd(), rezim=r<.25?'D':r<.85?'O':'C';
    const omluvenoH=pick(OML);
    const pr=NAHR_PRAVIDLA[sk], pripsanoPlatne=pr.typ==='procento'?omluvenoH*pr.p:pr.h[rezim];
    // historie vzniku: omluvené hodiny rozložené do měsíců
    const vznik=[];let zb=omluvenoH;
    MES.forEach((m,mi)=>{if(zb<=0)return;const x=mi===MES.length-1?zb:Math.min(zb,Math.round(rnd()*omluvenoH/3/(REZIM_H[rezim]))*REZIM_H[rezim]);
      if(x>0){vznik.push({datum:MESD[mi],mes:m,omluvenoH:x});zb-=x;}});
    // čerpání: odpoledne navíc / úterý do 17:00; u plné docházky občas příměstský tábor
    let cil=Math.round(pripsanoPlatne*pick(FAKT));
    const cerp=[];
    // tábor = 2 týdny × 5 dní × 7 h; spotřebuje víc, než dítě za rok získá – odtud velké zápory
    if(rezim!=='D'&&rnd()<.32){cerp.push({datum:'15. 5. 2026',typ:'tabor',h:70,popis:'příměstské tábory 6.–17. 7. (přihláška)',kdo:'Radka'});cil-=70;}
    const dny=['12. 9.','3. 10.','14. 11.','9. 12.','20. 1.','17. 2.','10. 3.','14. 4.','12. 5.','26. 5.'];
    let di=0;while(cil>0&&di<dny.length){const h=Math.min(cil,rezim==='D'?2:2);const ut=rnd()<.4;
      cerp.push({datum:dny[di]+(di<4?' 2025':' 2026'),typ:ut?'utery':'odpo',h:ut?Math.min(cil,2):h,popis:ut?'úterní docházka do 17:00':'odpoledne navíc (do 15:00)',kdo:rnd()<.5?'Radka':'vedoucí průvodce',obs:`${10+Math.floor(rnd()*4)}/14`});
      cil-=cerp[cerp.length-1].h;di++;}
    const cerpanoH=cerp.reduce((s,c)=>s+c.h,0);
    out.push({id:'n'+(++id),n:pick(JM),sur:pick(PR)+(rnd()<.5?'ová':''),skolka:sk,skN,trida:tr,rezim,omluvenoH,cerpanoH,vznik,cerp:cerp.reverse()});
  }});
  // příjmení: ženská jména → -ová, jinak mužské tvary (jen kosmetika smyšlených jmen)
  const zen=['Bára','Dora','Ema','Gréta','Ida','Kája','Mia','Nela','Pavla','Rozálie','Táňa','Zoe','Anička','Julie','Ela','Viki'];
  const zenske=b=>b.endsWith('ý')?b.slice(0,-1)+'á':b.endsWith('ek')?b.slice(0,-2)+'ková':b.endsWith('ec')?b.slice(0,-2)+'cová':b.endsWith('a')?b.slice(0,-1)+'ová':b+'ová';
  out.forEach(c=>{const base=c.sur.replace(/ová$/,'');c.sur=zen.includes(c.n)?zenske(base):base;});
  // jména, která znají ostatní appky (rodič: Eliška; faktury dřív v PLATBY) – ať sedí napříč appkami
  const ren=(sk,i,n,sur,rezim)=>{const c=out.filter(x=>x.skolka===sk)[i];c.n=n;c.sur=sur;if(rezim)c.rezim=rezim;};
  ren('vhaaji',0,'Eliška','Dvořáková','O');ren('vhaaji',1,'Kuba','Svoboda');ren('jaata',0,'Tomáš','Beran');ren('maata',0,'Ela','Marešová');
  return out;
})();

/* Faktury – až za NAHRADY_DETI, protože z nich berou děti. */
let FAKTURY=(()=>{
  let seed=11; const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
  const out=[]; let id=0;
  FAKT_MESICE_A.forEach((m,mi)=>NAHRADY_DETI.forEach(c=>{
    const dite=c.n+' '+c.sur, sk=SKOLKY.find(s=>s.id===c.skolka).nazev;
    const zaklad={dite,ditId:c.id,skolka:sk,skolkaId:c.skolka,mesic:m.key,vyst:m.vyst,spl:m.spl,odeslano:true};
    // školné: červen už vystavený dopředu (27. 5.), splatnost ještě neuplynula
    let st='uhrazeno'; const r=rnd();
    if(mi===3)st=r<.72?'uhrazeno':r<.95?'neuhrazeno':'ceka';
    else if(mi===2)st=r<.9?'uhrazeno':r<.96?'po-splatnosti':'castecne';
    else st=r<.97?'uhrazeno':'po-splatnosti';
    const castka=SKOLNE[c.skolka][c.rezim];
    out.push({...zaklad,id:'f'+(++id),druh:'skolne',obdobi:'Školné · '+m.lab,castka,stav:st,uhrazeno:st==='castecne'?Math.round(castka/2/100)*100:0,poDnu:st==='po-splatnosti'?m.poDnu:0});
    // stravné za uplynulý měsíc (březen–duben; za květen se teprve vystavuje)
    if(mi<2){const dny=12+Math.floor(rnd()*9), s2=dny*STRAVNE_DEN[c.rezim], r2=rnd();
      out.push({...zaklad,id:'f'+(++id),druh:'stravne',obdobi:`Stravné · ${m.lab} (${dny} dní)`,castka:s2,stav:r2<.96?'uhrazeno':r2<.99?'preplatek':'po-splatnosti',uhrazeno:0,poDnu:r2>=.99?m.poDnu:0});}
  }));
  // stavy, které znají ostatní appky a dřívější přehled
  const set=(dite,mesic,druh,ch)=>{const f=out.find(x=>x.dite===dite&&x.mesic===mesic&&x.druh===druh);if(f)Object.assign(f,ch);};
  // Eliška: v rodičovské appce má neuhrazený duben a květen (2 × 10 584 Kč)
  set('Eliška Dvořáková','2026-03','skolne',{stav:'uhrazeno',poDnu:0});
  set('Eliška Dvořáková','2026-04','skolne',{stav:'po-splatnosti',poDnu:41});
  set('Eliška Dvořáková','2026-05','skolne',{stav:'po-splatnosti',poDnu:11});
  set('Kuba Svoboda','2026-05','skolne',{stav:'po-splatnosti',poDnu:11});
  set('Tomáš Beran','2026-05','skolne',{stav:'castecne',uhrazeno:4000,poDnu:11});
  set('Ela Marešová','2026-06','skolne',{stav:'ceka'});
  return out;
})();
// stravné za květen se vystavuje teprve teď – tlačítko v Platbách (počítá se z docházky)
let STRAVNE_KVETEN_VYST=false;
// k řešení = co vyžaduje akci (přehled): po splatnosti, částečně, čeká na spárování
const platbyKResi=()=>FAKTURY.filter(f=>['po-splatnosti','castecne','ceka'].includes(f.stav));


/* ===== Děti a matrika (draft-admin 4.4) =====
   Tytéž děti jako Náhrady a Platby. Terka: údaje o dítěti leží na třech místech, výkaz pro
   MŠMT 4× ročně „mě štvou", „potřebuju rychle extrahovat předškoláky nebo alergiky".
   Kompletnost matriky se odvozuje z vyplněných polí – Přehled z ní počítá „chybějící data".
   Rodná čísla, adresy a kontakty jsou smyšlené. */
const MATRIKA_POLE=[['rc','rodné číslo'],['adresa','bydliště'],['pojistovna','pojišťovna'],['zz','kontakt na zákonného zástupce'],['gdpr','GDPR souhlas'],['lekar','potvrzení od lékaře']];
(()=>{
  let seed=23; const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
  const ALG=['mléko','lepek','arašídy','mléko, vejce','celer'], POJ=['VZP','ZPMV','OZP','ČPZP','VoZP'];
  const ULICE=['Ďáblická','Kostelecká','Bohnická','Čimická','Na Pecích','Pod Hájem','Lesní','K Vršíčku'];
  NAHRADY_DETI.forEach((c,i)=>{
    const pre=rnd()<.3, rok=pre?2020:2021+(rnd()<.5?1:0), mes=1+Math.floor(rnd()*12), den=1+Math.floor(rnd()*28);
    c.narozen=`${den}. ${mes}. ${rok}`; c.predskolak=pre||(rok===2020);
    c.alergie=rnd()<.13?ALG[Math.floor(rnd()*ALG.length)]:'';
    c.rc=`${String(rok%100).padStart(2,'0')}${String(mes+(c.n.match(/a$|e$|ie$/)?50:0)).padStart(2,'0')}${String(den).padStart(2,'0')}/${1000+Math.floor(rnd()*8999)}`;
    c.adresa=`${ULICE[Math.floor(rnd()*ULICE.length)]} ${10+Math.floor(rnd()*200)}, Praha 8`;
    c.pojistovna=POJ[Math.floor(rnd()*POJ.length)];
    const base=(c.n+'.'+c.sur).normalize('NFD').replace(/[^a-zA-Z.]/g,'').toLowerCase();
    const zen=b=>b.endsWith('á')?b:b.endsWith('ý')?b.slice(0,-1)+'á':b.endsWith('ek')?b.slice(0,-2)+'ková':b.endsWith('ec')?b.slice(0,-2)+'cová':b.endsWith('a')?b.slice(0,-1)+'ová':b+'ová';
    c.zz=[{role:'Matka',jm:'Jana '+zen(c.sur),tel:`+420 6${String(10+i).padStart(2,'0')} ${100+(i*37)%900} ${100+(i*53)%900}`,mail:base+'.matka@email.cz'}];
    c.gdpr=true; c.lekar=true;
  });
  // chybějící údaje – rozložení jako v dřívějších upozorněních (Vhaaji 2× kontakt, Maata 1× GDPR) + dvě další
  const v=k=>NAHRADY_DETI.filter(x=>x.skolka===k);
  v('vhaaji')[5].zz=[]; v('vhaaji')[17].zz=[];
  v('maata')[3].gdpr=false;
  v('jaata')[4].pojistovna='';
  v('kouzlo')[2].lekar=false;
  // Eliška sedí s rodičovskou appkou (narozena 14. 3. 2021, rodné číslo, bydliště, bez alergie)
  const el=NAHRADY_DETI.find(c=>c.n==='Eliška'&&c.sur==='Dvořáková');
  Object.assign(el,{narozen:'14. 3. 2021',predskolak:false,alergie:'',rc:'215314/1001',adresa:'Nad Rokoskou 1230/8, Praha 8 – Libeň'});
})();
const matrikaChybi=c=>MATRIKA_POLE.filter(([k])=>Array.isArray(c[k])?!c[k].length:!c[k]).map(([,l])=>l);
