/* SCREEN: ADMIN_TRIDNICE – vedení čte třídnice všech školek (píšou je průvodci ve své appce).
   Tři pohledy:
     Vyplnění – týden × školky: který den je zapsaný, rozepsaný, nebo chybí
     Detail   – týden jedné školky jako v tabulce (dny vedle sebe), tisk pro inspekci
     Evaluace – evaluace dnů a uzavření týdnů za období na jednom místě. Výzkum: „evaluace
                se kvůli inspekci přepisují do dalšího dokumentu" – tady je to jeden výpis.
   Poznámky k dětem vedení čte (rozhodnutí 11. 10. 2026), ale jen v interním bloku detailu
   týdne – do tisku pro inspekci ani do výpisu evaluací nejdou (ve veřejné části třídnice
   nesmí být jména dětí). Děti jsou z matriky adminu (NAHRADY_DETI).
   Data jsou v tomhle souboru (ne v data.js), appky spolu nic nesdílejí; Vhaaji tento týden
   sedí textově se seedem průvodcovské appky (simulovaná konzistence). */

const TRA_POLE=[
  ['prichod','Příchod'],['kruh','Ranní kruh'],['aktivita','Aktivita dne'],['jakslo','Jak to šlo'],
  ['kde','Kam jsme šli'],['odpocinek','Odpočinek'],['predskolaci','Předškoláci'],['pocasi','Počasí'],['evaluace','Evaluace dne'],
];
const TRA_POVINNE=8;   // předškoláci jsou nepovinní
// pořadí, v jakém se pole v praxi plní – evaluace jako poslední (rozepsaný den ji obvykle nemá)
const TRA_PORADI=['prichod','kruh','aktivita','kde','pocasi','jakslo','odpocinek','evaluace'];
const TRA_POUCENI={skolka:'školka a zahrada',les:'les',mesto:'město a MHD'};
/* ===== Celý školní rok (rozhodnutí 11. 10. 2026) =====
   Týdny od 1. 9. 2025 do tohoto týdne (bez vánočního zavření), dny s klíčem RRRRMMDD.
   Kolik má který den vyplněno, se generuje deterministicky podle „pečlivosti" školky;
   aktuální týden je pevný (Vhaaji sedí s průvodcovskou appkou). Minulé týdny Vhaaji se
   s průvodcovskou appkou textově nekryjí – appky nesdílejí data ani generátor. */
const TRA_DNES=20260600+TODAYD;
const TRA_ZAVRENO={20251028:'státní svátek',20251117:'státní svátek',20260403:'Velký pátek',
  20260406:'Velikonoční pondělí',20260501:'svátek práce',20260508:'Den vítězství'};
[20251222,20251223,20251224,20251225,20251226,20251229,20251230,20251231,20260101,20260102]
  .forEach(k=>{TRA_ZAVRENO[k]='vánoční zavření';});
const TRA_MES=['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
const TRA_TYDNY=(()=>{
  const out=[], t=new Date(Date.UTC(2025,8,1));
  const key=x=>x.getUTCFullYear()*10000+(x.getUTCMonth()+1)*100+x.getUTCDate();
  while(key(t)<=20260601){
    const dny=[0,1,2,3,4].map(di=>{const x=new Date(t.getTime());x.setUTCDate(x.getUTCDate()+di);
      return {k:key(x),y:x.getUTCFullYear(),m:x.getUTCMonth()+1,d:x.getUTCDate(),di,zav:TRA_ZAVRENO[key(x)]||''};});
    if(dny.some(d=>!d.zav)){const a=dny[0],b=dny[4];
      out.push({po:a.k,dny,obdobi:a.y*100+a.m,aktualni:a.k===20260601,
        label:a.m===b.m?`${a.d}.–${b.d}. ${b.m}. ${b.y}`:`${a.d}. ${a.m}.–${b.d}. ${b.m}. ${b.y}`});}
    t.setUTCDate(t.getUTCDate()+7);
  }
  return out;
})();
const TRA_OBDOBI=[['vse','Celé období'],...[...new Set(TRA_TYDNY.map(w=>w.obdobi))]
  .map(ym=>[ym,TRA_MES[ym%100-1].replace(/^./,c=>c.toUpperCase())+' '+Math.floor(ym/100)])];
// deterministická náhoda; seed se zamíchá (Wangův hash), jinak sousední dny dají totéž
function traRnd(seed){
  let h=seed|0;h=(h^61)^(h>>>16);h=h+(h<<3);h=h^(h>>>4);h=Math.imul(h,0x27d4eb2d);h=h^(h>>>15);
  let s=((h>>>0)%2147483646)+1;const r=()=>(s=s*16807%2147483647)/2147483647;r();r();return r;}
/* Pečlivost školek: podíl celých dnů. Jaata píše nejpečlivěji (předloha), Kouzlo lesa
   nejméně – vedení tak má v přehledu co hlídat. */
const TRA_PECLIVOST={vhaaji:.8,jaata:.88,kouzlo:.66,maata:.82};
const TRA_BEZ_UZAVRENI_P={vhaaji:.1,jaata:.05,kouzlo:.25,maata:.1};
// tento týden pevně (8 = zapsáno, 0 = chybí, null = neproběhl); Vhaaji sedí s průvodcem
const TRA_TED={vhaaji:[8,6,2,null,null],jaata:[8,8,3,null,null],kouzlo:[8,0,1,null,null],maata:[8,8,3,null,null]};
function traVzor(skId,wi){
  const w=TRA_TYDNY[wi], si=SKOLKY.findIndex(s=>s.id===skId), p=TRA_PECLIVOST[skId];
  if(w.aktualni)return TRA_TED[skId];
  return w.dny.map(d=>{if(d.zav)return undefined;const q=traRnd(d.k*7+si*131)();
    return q<p?8:q<p+(1-p)*.5?7:q<p+(1-p)*.85?3+Math.floor(traRnd(d.k+si)()*3):0;});
}
const TRA_TEXT={
  prichod:['Klidné předání, všichni se rozloučili bez slz.','Jedno delší loučení, pomohlo krmení zvířat.','Vše v pořádku.','Dvě děti přišly později, hlášeno předem.',
    'Ranní pláč u nově příchozího dítěte, po svačině v pohodě.','Rodiče déle na zahradě, rozloučení se táhlo.','Klidné ráno, děti hned u zvířátek.','Jedno dítě bez holinek – půjčeno z rezervy.'],
  kruh:['Přivítání, kalendář, básnička týdne.','Rytmická říkadla a pohybová hra.','Písnička týdne s bubínky, zapálení svíčky.','Kruh venku pod stromem, hádanky k tématu.',
    'Kruh v jurtě u kamen, prstová říkadla.','Přivítání, kdo dnes chybí, hra „Na medvěda".'],
  aktivita:['Modelování z vosku.','Akvarel – práce s mokrým papírem.','Pečení chleba.','Kreslení předobědové pohádky.','Pohybovka – rovnováha na kládě, přeskoky.',
    'Tkaní na stávkách.','Výlet do okolí, pozorování přírody.','Divadýlko s loutkami.','Rytmika s bubínky a dřívky.'],
  jakslo:['Menší děti potřebovaly pomoc, starší pracovaly samostatně.','Povedlo se, příště víc času na úklid.','Bavilo všechny, zopakovat.','Těžší téma, příště rozdělit do dvou dnů.',
    'Děti vydržely soustředěné skoro celou dobu.','Málo materiálu pro všechny, připravit dopředu.','Hodně hluku, příště menší skupinky.','Velký posun oproti minulému týdnu.'],
  kde:['Zahrada – bahenní kuchyně, pískoviště.','Les nad školkou, stavba domečků.','Pole a remízek, pozorování brouků.','Výlet k rybníku, svačina na louce.',
    'Zahrada, štípání a nošení dřeva.','Les u potoka, stavba hráze.','Zahrada, zalévání záhonku a krmení zvířat.'],
  odpocinek:['Čtení na pokračování, klid.','Usnula většina, nespavci kreslili.','Krátká pohádka a odpočinek na karimatkách.','Neklidnější, dvě děti nemohly usnout.','Klid, nespavci poslouchali audiopohádku.'],
  predskolaci:['Grafomotorické listy.','Stříhání a lepení.','Počítání do deseti s kamínky.','Psaní vlastního jména.','Rýmy a slabikování.','Skládání obrázků podle velikosti.'],
  evaluace:['Klidný, pěkně plynoucí den.','Náročnější den, děti unavené po výletu.','Dobrá nálada, den plynul.','Hodně venku a v bahně – potřeba víc času na převlékání.',
    'Pohodový den, děti hodně spolupracovaly.','Neklidné dopoledne, po obědě se uklidnilo.','Málo dětí (rýma), program zkrácen.','Den bez zádrhelů, rytmus dne funguje.',
    'Hodně konfliktů na pískovišti – téma na poradu.','Krásný den, ze kterého jsme měli radost.'],
};
// tvoření podle měsíce – ať se v roce střídají sezónní činnosti
const TRA_TVORBA={9:['Malování jablíček akvarelem.','Navlékání korálků.'],10:['Draci z papíru.','Ježci ze šišek.'],11:['Lampiony na Martinskou slavnost.','Plstění z rouna.'],
  12:['Svíčky ze včelího vosku.','Adventní věneček.'],1:['Vločky z hedvábného papíru.','Krmítka pro ptáčky.'],2:['Masky na masopust.','Modelování sněženek z vosku.'],
  3:['Setí řeřichy.','Morana ze slámy.'],4:['Zdobení vajíček voskem.','Malování broučků na kamínky.'],5:['Věnečky z lučních kytiček.','Studánka z kamínků a mechu.'],6:['Malování motýlů.']};
const TRA_POCASI={9:[['slunečno','polojasno','přeháňky'],12,24],10:[['zataženo','mlha, pak slunce','déšť'],6,16],11:[['mlha','zataženo','déšť'],1,9],
  12:[['zataženo','sníh','mráz, jasno'],-3,4],1:[['mráz, jasno','sněží','zataženo'],-7,2],2:[['zataženo','obleva, bláto','sníh'],-3,7],
  3:[['slunečno','vítr','přeháňky'],2,13],4:[['slunečno','přeháňky','polojasno'],6,18],5:[['slunečno','bouřky odpoledne','polojasno'],11,24],6:[['slunečno','vedro'],18,28]};
const TRA_UZAVRENI=['Týden se povedl, téma děti chytlo. Příště připravit materiál dřív.',
  'Deštivé dny zatěžují převlékání – víc spolupráce při svlékání, boty čistit před jurtou.',
  'Klidný týden. Ranní kruh venku pod stromem se osvědčil, pokračovat.',
  'Hodně dětí chybělo (rýma), program jsme zkrátili. Téma protáhnout do příštího týdne.',
  'Výlet byl nejsilnější zážitek týdne – děti o něm mluví celý týden.','Konflikty u houpaček – zavést pravidlo střídání.',
  'Předškoláci potřebují víc vlastního programu, rozmyslet na poradě.','Téma týdne bylo spíš teoretické, počasí nepřálo.',
  'Pěkný týden, nové dítě se dobře adaptuje.','Slavnost se povedla, rodiče nadšení. Příště víc pomocníků na úklid.'];
const TRA_TEMATA=['Vítání','Sklizeň – jablíčko','Úroda – dýně','Svatý Václav','Svatý Michael – odvaha a síla','Kaštánky a lístečky','Draku, draku, vyleť výše',
  'Zvířátka na podzim','Svatý Martin – příprava','Svatý Martin – slavnost','Skřítci a obři','Pozdní podzim','1. adventní týden','2. adventní týden','3. adventní týden',
  'Tři králové','Sněhová vločka','Mráz a sníh','Ptáčci v zimě','Na Hromnice o hodinu více','Předmasopustní veselí','Masopust','Předjaří – sněženka',
  'Předjaří – sluníčko','Semínko, dobrý den','Vynášíme Moranu','Jaro – píšťalka','Velikonoce','Jaro – zajíček','Jaro – brouček','Svátek ohňů',
  'Věneček kytiček','Májový deštíček','Studánko, hlubánko','Studánková slavnost','Žába a rybníček','Zvířátka mají mláďátka','Kytičky a věneček'];
const TRA_POHADKY=['O Budulínkovi','Kuřátko a obilí','O veliké řepě','O Smolíčkovi','Hrnečku, vař!','O kohoutkovi a slepičce','Perníková chaloupka','O Palečkovi',
  'O dvanácti měsíčkách','Paní Zima','O zlaté rybce','Tři prasátka','O Popelce','Dlouhý, Široký a Bystrozraký','O neposlušných kůzlátkách','Sůl nad zlato'];
const TRA_PISE=['Táňa','Gabča','Honza','Darča','Míša'];
/* Poznámky k dětem – formulované bez rodu, ať sednou ke kterémukoli dítěti ze seedu. */
const TRA_POZN=['Ráno delší loučení, po svačině pohoda.','Dopoledne ve dvojici u stavění – hezká spolupráce.',
  'Odpoledne únava, spánek hned při čtení.','Poprvé zapalování svíčky v kruhu – velká radost.',
  'Spor o lopatku na pískovišti, vyřešeno rozhovorem.','Odřené koleno v lese – ošetřeno, rodičům řečeno při vyzvednutí.',
  'Stříhání zatím s pomocí, úchop nůžek trénovat.','Hodně času se staršími dětmi, nápodoba ve všem.',
  'Celý den tišeji než obvykle – sledovat, zmínit rodičům.','U tkaní vydrží dlouho, velký posun v soustředění.',
  'Oběd celý, i polévka, která dřív neprošla.','Oběd skoro netknutý, jen chleba – zmínit rodičům.','Na kládě celá délka bez pomoci.',
  'Básnička týdne už celá zpaměti.','Rýma a kašel, odpoledne zvýšená teplota – rodiče vyzvedli dřív.','Mokré ponožky, v batohu chyběly náhradní – napsat rodičům.',
  'Pomoc nejmenším s holinkami, hezká péče.','Strkání ve frontě na oběd, promluvili jsme si.','Kresba pohádky plná detailů, poprvé postava s rukama.',
  'Při výletu celá cesta bez stížností.'];
// Eliška (jediné dítě společné s průvodcovskou appkou) – stejná poznámka jako tam
const TRA_POZN_VHAAJI_TED=[{n:'Eliška',sur:'Dvořáková',d:2,t:'Odpoledne vyzvedla babička, loučení v pohodě. Celý den hodně povídala o hvězdárně.',kdo:'Gabča'}];
/* Poznámky k dětem jedné školky za týden – zhruba u tří čtvrtin dětí (Jaata: 19 z 23)
   jedna až dvě poznámky ke dnům se zápisem. Deterministicky – každý render ukazuje totéž. */
function traPoznamky(r,si,wi){
  const deti=NAHRADY_DETI.filter(c=>c.skolka===r.sk.id), dny=r.dny.filter(d=>d.n);
  if(!dny.length)return [];
  /* Vhaaji tento týden: průvodcovská appka má poznámky u 7 dětí – tady stejný počet;
     jména se s adminem kryjí jen u Elišky, ta má i stejný text. */
  if(r.sk.id==='vhaaji'&&r.w.aktualni){
    const pevne=TRA_POZN_VHAAJI_TED.map(p=>({c:deti.find(c=>c.n===p.n&&c.sur===p.sur)||{n:p.n,sur:p.sur,trida:''},
      pozn:[{den:r.dny.find(d=>d.d===p.d),t:p.t,kdo:p.kdo}]}));
    const ostatni=traPoznamkyGen(deti.filter(c=>!pevne.some(p=>p.c===c)),dny,si,wi).slice(0,7-pevne.length);
    return [...pevne,...ostatni].sort((a,b)=>(a.c.sur||'').localeCompare(b.c.sur||'','cs'));
  }
  return traPoznamkyGen(deti,dny,si,wi);
}
function traPoznamkyGen(deti,dny,si,wi){
  const out=[];
  deti.forEach((c,k)=>{
    const r=traRnd(TRA_TYDNY[wi].po*17+si*977+k*31), pick=a=>a[Math.floor(r()*a.length)];
    if(r()>.75)return;
    const pocet=r()<.3?2:1, pozn=[];
    for(let j=0;j<pocet;j++){const den=pick(dny);if(!pozn.some(x=>x.den===den))pozn.push({den,t:pick(TRA_POZN),kdo:den.pise});}
    pozn.sort((a,b)=>a.den.di-b.den.di);out.push({c,pozn});
  });
  return out;
}
// Vhaaji tento týden – stejné texty jako v průvodcovské appce
const TRA_VHAAJI_TED={
  1:{prichod:'Klidné ráno, předání u branky bez slz. Dvě děti přišly až po deváté (hlášeno).',kruh:'Přivítání, kalendář, nová básnička „Uvijeme věneček". Na rytmiku bubínky a dřívka.',aktivita:'Rytmika s Niki – tanečky v kruhu, střídání rychle/pomalu.',jakslo:'Tanečky bavily i nejmenší. Střídání tempa zvládne asi polovina, zítra zopakovat.',kde:'Zahrada a pak les nad maringotkou – stavba domečků z klacků, lano mezi stromy.',odpocinek:'S Táňou „Kubula a Kuba Kubikula", dočteno do str. 34. Klid, usnuli skoro všichni.',pocasi:'slunečno, 24 °C',evaluace:'Pohodový začátek týdne, děti dobře naladěné. V lese potřeba víc hlídat hranici u potoka.',pouceni:['skolka','les']},
  2:{prichod:'Vše v pořádku, jedno delší loučení s maminkou – pomohlo krmení slepic.',kruh:'Básnička týdne, pohybová hra „Na medvěda".',aktivita:'Putování k Ďáblické hvězdárně, cestou sbírání šišek na výrobu ježků.',jakslo:'Cesta tam v pohodě, zpátky únava – příště kratší okruh nebo delší svačinová pauza.',kde:'Les, hvězdárna a zpět. Svačina na louce.',predskolaci:'Počítali šišky do desíti a třídili podle velikosti.',pocasi:'polojasno, odpoledne přeháňka',pouceni:['les']},
  3:{prichod:'Klidné, jen jedno dítě přišlo s rodičem až v 9:30 (hlášeno ráno).',kruh:'Narozeninový kruh – svíčka, přání, písnička „Šel zahradník".',pouceni:['skolka']},
};

/* Sestaví týden jedné školky: dny s poli, téma, pohádku, uzavření. Deterministicky,
   ať se při každém renderu ukazuje totéž. Den: n = počet vyplněných povinných polí
   (null = ještě neproběhl, undefined = zavřeno). */
function traTyden(skId,wi){
  const si=SKOLKY.findIndex(s=>s.id===skId), w=TRA_TYDNY[wi], vzor=traVzor(skId,wi);
  const dny=w.dny.map((x,di)=>{
    const n=vzor[di], den={...x,n,pole:{},pouceni:[],pise:TRA_PISE[(si+di)%TRA_PISE.length]};
    if(x.zav||n===null||n===undefined)return den;
    if(skId==='vhaaji'&&w.aktualni){const t=TRA_VHAAJI_TED[den.d]||{};
      TRA_POLE.forEach(([k])=>{if(t[k])den.pole[k]=t[k];});den.pouceni=t.pouceni||[];return den;}
    const r=traRnd(x.k*31+si*7), pick=a=>a[Math.floor(r()*a.length)];
    const [popisy,tOd,tDo]=TRA_POCASI[x.m];
    const texty={prichod:pick(TRA_TEXT.prichod),kruh:pick(TRA_TEXT.kruh),
      aktivita:r()<.5?pick(TRA_TVORBA[x.m]||TRA_TEXT.aktivita):pick(TRA_TEXT.aktivita),
      kde:pick(TRA_TEXT.kde),pocasi:`${pick(popisy)}, ${tOd+Math.floor(r()*(tDo-tOd+1))} °C`,
      jakslo:pick(TRA_TEXT.jakslo),odpocinek:pick(TRA_TEXT.odpocinek),evaluace:pick(TRA_TEXT.evaluace)};
    TRA_PORADI.slice(0,n).forEach(k=>{den.pole[k]=texty[k];});
    if(n&&r()<.55)den.pole.predskolaci=pick(TRA_TEXT.predskolaci);
    if(n)den.pouceni=/les|remíz|rybník|pole|potok/i.test(den.pole.kde||'')?['les']:['skolka'];
    return den;
  });
  const ru=traRnd(w.po*3+si*59);
  const hotovy=!w.aktualni&&ru()>TRA_BEZ_UZAVRENI_P[skId];
  return {sk:SKOLKY[si],w,dny,
    tema:skId==='vhaaji'&&w.aktualni?'Kytičky a věneček':TRA_TEMATA[Math.min(wi,TRA_TEMATA.length-1)],
    pohadka:skId==='vhaaji'&&w.aktualni?'O Budulínkovi (divadýlko s loutkami)':TRA_POHADKY[(wi+si*3)%TRA_POHADKY.length],
    uzavreni:hotovy?TRA_UZAVRENI[Math.floor(ru()*TRA_UZAVRENI.length)]:'',uzavreniChybi:!w.aktualni&&!hotovy};
}
function traStav(den){
  if(den.zav)return {lab:'zavřeno',cls:'muted'};
  if(den.n===null)return {lab:'neproběhl',cls:'muted'};
  if(den.n>=TRA_POVINNE)return {lab:'zapsáno',cls:'ok'};
  if(!den.n)return den.k===TRA_DNES?{lab:'zatím nic',cls:'muted'}:{lab:'chybí',cls:'danger'};
  return {lab:`${den.n} z ${TRA_POVINNE}`,cls:'warn'};
}
const traDenLbl=den=>`${DOW[den.di]} ${den.d}. ${den.m}.`;
// den, který se počítá do „chybí / rozepsáno": proběhl, nebyl zavřený a není to dnešek
const traProbehl=d=>!d.zav&&d.n!==null&&d.n!==undefined&&d.k!==TRA_DNES;

// výpis evaluací startuje posledním celým měsícem – celý rok za všechny školky je dlouhý
let traView='vyplneni', traWeek=TRA_TYDNY.length-1, traDetail=null, traSk='vse', traOb=202605;

function renderTridniceA(){
  if(traDetail)return traRenderDetail();
  let h=`<div class="switch no-print">`
    +`<button class="${traView==='vyplneni'?'on':''}" onclick="traGo('vyplneni')">Vyplnění</button>`
    +`<button class="${traView==='evaluace'?'on':''}" onclick="traGo('evaluace')">Evaluace za období</button></div>`;
  return h+(traView==='evaluace'?traRenderEvaluace():traRenderVyplneni());
}

/* ---- Vyplnění: týden × školky ---- */
function traRenderVyplneni(){
  const wi=traWeek, w=TRA_TYDNY[wi];
  const rows=SKOLKY.map(s=>traTyden(s.id,wi));
  const chybi=rows.reduce((n,r)=>n+r.dny.filter(d=>traProbehl(d)&&d.n===0).length,0);
  const rozp=rows.reduce((n,r)=>n+r.dny.filter(d=>traProbehl(d)&&d.n>0&&d.n<TRA_POVINNE).length,0);
  let h=`<div class="tra-head"><div class="dnav"><button onclick="traStep(-1)" ${wi<=0?'disabled':''} aria-label="Předchozí týden">‹</button>`
    +`<span>${w.label}${w.aktualni?'<i class="dn-cur"> · tento týden</i>':''}</span>`
    +`<button onclick="traStep(1)" ${wi>=TRA_TYDNY.length-1?'disabled':''} aria-label="Další týden">›</button></div>`
    // skok na měsíc – rok má přes 40 týdnů
    +`<select class="pin tra-mesic" aria-label="Přejít na měsíc" onchange="traMesic(+this.value)">`
    +TRA_OBDOBI.slice(1).map(([ym,l])=>`<option value="${ym}"${ym===w.obdobi?' selected':''}>${l}</option>`).join('')+`</select>`
    +`<div class="tra-sum">${chybi||rozp?`Proběhlé dny: <b>${chybi}</b> ${chybi===1?'chybí':'chybí'} · <b>${rozp}</b> ${rozp===1?'rozepsaný':'rozepsané'}`:'Všechny proběhlé dny jsou zapsané.'}</div></div>`;
  h+=`<div class="tile tra-wrap"><table class="tra-tab"><thead><tr><th scope="col">Školka</th>`
    +rows[0].dny.map(d=>`<th scope="col">${traDenLbl(d)}</th>`).join('')+`<th scope="col">Uzavření týdne</th><th scope="col">K dětem</th><th aria-hidden="true"></th></tr></thead><tbody>`;
  rows.forEach((r,si)=>{
    const sPoz=traPoznamky(r,si,wi).length;
    h+=`<tr class="tra-row" onclick="traOpen('${r.sk.id}')"><th scope="row"><button class="tra-sk" onclick="event.stopPropagation();traOpen('${r.sk.id}')">${r.sk.nazev}</button></th>`
      +r.dny.map(d=>{const s=traStav(d);return `<td><span class="bdg st-${s.cls}">${s.lab}</span></td>`;}).join('')
      +`<td>${r.uzavreni?'<span class="bdg st-ok">napsáno</span>':r.uzavreniChybi?'<span class="bdg st-danger">chybí</span>':'<span class="bdg st-muted">po pátku</span>'}</td>`
      // kolik dětí má tento týden poznámku – obsah je v detailu, tady jen pokrytí
      +`<td class="tra-pokr">${sPoz} z ${obsazeno(r.sk)}</td>`
      +`<td class="tra-arr" aria-hidden="true">›</td></tr>`;
  });
  h+=`</tbody></table></div>`;
  h+=`<div class="note2">Třídnice píšou průvodci ve své aplikaci – často až večer nebo druhý den, proto je dnešek „zatím nic", ne chyba. Rozepsaný den = vyplněná jen část z ${TRA_POVINNE} povinných polí (předškoláci jsou nepovinní).</div>`;
  return h;
}

/* ---- Detail: týden jedné školky (dny vedle sebe, jako v tabulce) ---- */
function traRenderDetail(){
  const r=traTyden(traDetail,traWeek), dny=r.dny;
  let h=`<button class="back no-print" onclick="traZpet()">‹ Zpět na přehled</button>`;
  h+=`<div class="vypis-head"><div class="vh-t">Třídnice ${r.sk.nazev} · ${r.w.label}</div>`
    +`<div class="vh-s">Téma týdne: <b>${esc(r.tema)}</b> · pohádka týdne: ${esc(r.pohadka)}</div></div>`;
  h+=`<button class="btn-s primary no-print" style="margin-bottom:12px" onclick="window.print()">Tisk týdne (pro inspekci / PDF)</button>`;
  h+=`<div class="tile tra-wrap"><table class="tra-tab tra-det"><thead><tr><th scope="col"></th>`
    +dny.map(d=>{const s=traStav(d);return `<th scope="col">${traDenLbl(d)}<span class="bdg st-${s.cls} no-print">${s.lab}</span></th>`;}).join('')+`</tr></thead><tbody>`;
  h+=`<tr><th scope="row">Píše</th>${dny.map(d=>`<td>${d.zav?`<span class="tra-gap">${d.zav}</span>`:d.n===null?'':d.pise}</td>`).join('')}</tr>`;
  TRA_POLE.forEach(([k,lab])=>{
    h+=`<tr><th scope="row">${lab}</th>`+dny.map(d=>`<td>${d.pole[k]?esc(d.pole[k]):d.zav||d.n===null?'':`<span class="tra-gap">${k==='predskolaci'?'–':'nevyplněno'}</span>`}</td>`).join('')+`</tr>`;
    if(k==='kde')h+=`<tr><th scope="row">Poučení o pravidlech</th>${dny.map(d=>`<td>${d.pouceni.map(p=>TRA_POUCENI[p]).join(', ')}</td>`).join('')}</tr>`;
  });
  h+=`</tbody></table></div>`;
  h+=`<div class="tile"><div class="ch">Uzavření týdne</div>`
    +(r.uzavreni?`<div class="tval">${esc(r.uzavreni)}</div>`
      :`<div class="empty" style="text-align:left;padding:4px 0">${r.uzavreniChybi?'Uzavření týdne chybí.':'Píše se po posledním dni týdne.'}</div>`)+`</div>`;
  // poznámky k dětem – interní blok, v tisku pro inspekci chybí celý (no-print)
  const si=SKOLKY.findIndex(s=>s.id===traDetail), poz=traPoznamky(r,si,traWeek);
  h+=`<div class="tile tra-int no-print"><div class="tra-int-h"><span class="ch">Poznámky k dětem</span>`
    +`<span class="tra-int-s">Jen interně – do tisku pro inspekci nejdou. Píšou je průvodci v zápisu dne.</span></div>`;
  h+=poz.length?`<div class="tra-sum" style="margin-bottom:6px">Poznámka u <b>${poz.length} z ${obsazeno(r.sk)}</b> dětí</div>`
    +poz.map(({c,pozn})=>`<div class="tra-kd"><div class="tra-kd-n">${esc(c.n+' '+c.sur)}${r.sk.tridy.length>1&&c.trida?` <span class="tra-kd-t">· ${esc(c.trida)}</span>`:''}</div>`
      +pozn.map(p=>`<div class="tra-ev-r"><span class="tra-ev-d">${traDenLbl(p.den)}</span><span class="odst-tx">${esc(p.t)} <span class="tra-kd-t">· ${esc(p.kdo)}</span></span></div>`).join('')+`</div>`).join('')
    :`<div class="empty" style="text-align:left;padding:4px 0">K dětem tento týden nic.</div>`;
  h+=`</div>`;
  return h;
}

/* ---- Evaluace za období ---- */
function traRenderEvaluace(){
  const sks=SKOLKY.filter(s=>traSk==='vse'||s.id===traSk);
  const tydny=TRA_TYDNY.map((w,i)=>({w,i})).filter(x=>traOb==='vse'||x.w.obdobi===traOb).reverse();
  let h=`<div class="filters no-print">`+[['vse','Všechny školky'],...SKOLKY.map(s=>[s.id,s.nazev])]
    .map(([k,l])=>`<button class="${traSk===k?'on':''}" onclick="traFiltr('sk','${k}')">${l}</button>`).join('')+`</div>`;
  h+=`<div class="filters no-print">`+TRA_OBDOBI.map(([k,l])=>`<button class="${traOb===k?'on':''}" onclick="traFiltr('ob','${k}')">${l}</button>`).join('')+`</div>`;
  const obLab=TRA_OBDOBI.find(o=>o[0]===traOb)[1];
  h+=`<div class="vypis-head"><div class="vh-t">Evaluace ${traSk==='vse'?'všech školek':SKOLKY.find(s=>s.id===traSk).nazev}</div><div class="vh-s">${obLab} · převzato z třídnic</div></div>`;
  h+=`<button class="btn-s primary no-print" style="margin-bottom:12px" onclick="window.print()">Exportovat výpis (tisk / PDF)</button>`;
  tydny.forEach(({w,i})=>sks.forEach(s=>{
    const r=traTyden(s.id,i), ev=r.dny.filter(d=>d.pole.evaluace);
    if(!ev.length&&!r.uzavreni&&!r.uzavreniChybi)return;
    h+=`<div class="tile vy-item"><div class="ak-top"><span class="za-sk">${s.nazev}</span><span class="ak-date">${w.label}</span></div>`
      +`<div class="vy-nz">Uzavření týdne</div>`
      +(r.uzavreni?`<div class="odst-tx">${esc(r.uzavreni)}</div>`:`<div class="odst-tx tra-gap">${r.uzavreniChybi?'Chybí.':'Týden ještě běží.'}</div>`);
    if(ev.length)h+=`<div class="tra-ev">`+ev.map(d=>`<div class="tra-ev-r"><span class="tra-ev-d">${traDenLbl(d)}</span><span class="odst-tx">${esc(d.pole.evaluace)}</span></div>`).join('')+`</div>`;
    h+=`<button class="vy-link no-print" onclick="traOpen('${s.id}',${i})">→ celý týden</button></div>`;
  }));
  return h;
}

window.traGo=v=>{traView=v;traDetail=null;render();};
window.traMesic=ym=>{const i=TRA_TYDNY.findIndex(w=>w.obdobi===ym);if(i>=0){traWeek=i;render();}};
window.traStep=dir=>{traWeek=Math.max(0,Math.min(TRA_TYDNY.length-1,traWeek+dir));render();};
window.traOpen=(sk,wi)=>{traDetail=sk;if(wi!==undefined)traWeek=wi;render();window.scrollTo(0,0);};
window.traZpet=()=>{traDetail=null;render();};
window.traFiltr=(k,v)=>{if(k==='sk')traSk=v;else traOb=v==='vse'?'vse':+v;render();};
