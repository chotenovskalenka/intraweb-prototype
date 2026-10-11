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
const TRA_TYDNY=[
  {po:11,m:5,label:'11.–15. 5. 2026',obdobi:'kveten'},
  {po:18,m:5,label:'18.–22. 5. 2026',obdobi:'kveten'},
  {po:25,m:5,label:'25.–29. 5. 2026',obdobi:'kveten'},
  {po:1,m:6,label:'1.–5. 6. 2026',obdobi:'cerven',aktualni:true},
];
const TRA_OBDOBI=[['vse','Celé období'],['kveten','Květen 2026'],['cerven','Červen 2026']];

/* Kolik povinných polí má který den vyplněno (8 = zapsáno, 0 = chybí, null = neproběhl).
   Rozložení podle reality Jaaty: většina dnů plná, mezery hlavně v evaluaci a odpočinku. */
const TRA_VZOR={
  vhaaji:[[8,8,8,8,8],[8,8,8,8,6],[8,8,8,8,8],[8,6,2,null,null]],
  jaata: [[8,8,8,8,8],[8,8,8,8,8],[8,8,8,7,8],[8,8,3,null,null]],
  kouzlo:[[8,8,0,8,8],[8,5,8,8,0],[8,8,8,6,8],[8,0,1,null,null]],
  maata: [[8,8,8,8,8],[8,8,7,8,8],[8,8,8,8,8],[8,8,3,null,null]],
};
const TRA_BEZ_UZAVRENI={kouzlo:[1]};   // týdny (index), kde chybí uzavření týdne

const TRA_TEXT={
  prichod:['Klidné předání, všichni se rozloučili bez slz.','Jedno delší loučení, pomohlo krmení zvířat.','Vše v pořádku.','Dvě děti přišly později, hlášeno předem.','Ranní pláč u nově příchozího dítěte, po svačině v pohodě.'],
  kruh:['Přivítání, kalendář, básnička týdne.','Rytmická říkadla a pohybová hra.','Písnička týdne s bubínky, zapálení svíčky.','Kruh venku pod stromem, hádanky k tématu.'],
  aktivita:['Modelování z vosku.','Akvarel – práce s mokrým papírem.','Pečení chleba.','Kreslení předobědové pohádky.','Pohybovka – rovnováha na kládě, přeskoky.','Tkaní na stávkách.'],
  jakslo:['Menší děti potřebovaly pomoc, starší pracovaly samostatně.','Povedlo se, příště víc času na úklid.','Bavilo všechny, zopakovat.','Těžší téma, příště rozdělit do dvou dnů.'],
  kde:['Zahrada – bahenní kuchyně, pískoviště.','Les nad školkou, stavba domečků.','Pole a remízek, pozorování brouků.','Výlet k rybníku, svačina na louce.','Zahrada, štípání a nošení dřeva.'],
  odpocinek:['Čtení na pokračování, klid.','Usnula většina, nespavci kreslili.','Krátká pohádka a odpočinek na karimatkách.'],
  predskolaci:['Grafomotorické listy.','','Stříhání a lepení.','','Počítání do deseti s kamínky.'],
  pocasi:['slunečno, 22 °C','zataženo, 15 °C','přeháňky','jasno, 26 °C','mlha, pak slunce'],
  evaluace:['Klidný, pěkně plynoucí den.','Náročnější den, děti unavené po výletu.','Dobrá nálada, den plynul.','Hodně venku a v bahně – potřeba víc času na převlékání.'],
};
const TRA_UZAVRENI=['Týden se povedl, téma děti chytlo. Příště připravit materiál dřív.',
  'Deštivé dny zatěžují převlékání – víc spolupráce při svlékání, boty čistit před jurtou.',
  'Klidný týden. Ranní kruh venku pod stromem se osvědčil, pokračovat.',
  'Hodně dětí chybělo (rýma), program jsme zkrátili. Téma protáhnout do příštího týdne.'];
const TRA_TEMATA=['Zvířátka mají mláďátka','Májový deštíček','Studánko, hlubánko','Kytičky a věneček'];
const TRA_POHADKY=['O Budulínkovi','Kuřátko a obilí','O veliké řepě','Paní Zima'];
const TRA_PISE=['Táňa','Gabča','Honza','Darča','Míša'];
/* Poznámky k dětem – formulované bez rodu, ať sednou ke kterémukoli dítěti ze seedu. */
const TRA_POZN=['Ráno delší loučení, po svačině pohoda.','Dopoledne ve dvojici u stavění – hezká spolupráce.',
  'Odpoledne únava, spánek hned při čtení.','Poprvé zapalování svíčky v kruhu – velká radost.',
  'Spor o lopatku na pískovišti, vyřešeno rozhovorem.','Odřené koleno v lese – ošetřeno, rodičům řečeno při vyzvednutí.',
  'Stříhání zatím s pomocí, úchop nůžek trénovat.','Hodně času se staršími dětmi, nápodoba ve všem.',
  'Celý den tišeji než obvykle – sledovat, zmínit rodičům.','U tkaní vydrží dlouho, velký posun v soustředění.'];
// Eliška (jediné dítě společné s průvodcovskou appkou) – stejná poznámka jako tam
const TRA_POZN_VHAAJI_TED=[{n:'Eliška',sur:'Dvořáková',d:2,t:'Odpoledne vyzvedla babička, loučení v pohodě. Celý den hodně povídala o hvězdárně.',kdo:'Gabča'}];
/* Poznámky k dětem jedné školky za týden: vybere se zhruba polovina dětí a k dnům se
   zápisem jedna až dvě poznámky. Deterministicky – každý render ukazuje totéž. */
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
    if((k+si+wi)%2)return;
    const pocet=1+((k+wi)%3===0?1:0), pozn=[];
    for(let j=0;j<pocet;j++){const den=dny[(k+j*2+wi)%dny.length];
      if(!pozn.some(x=>x.den===den))pozn.push({den,t:TRA_POZN[(k*3+si+wi+j)%TRA_POZN.length],kdo:den.pise});}
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
   ať se při každém renderu ukazuje totéž. */
function traTyden(skId,wi){
  const si=SKOLKY.findIndex(s=>s.id===skId), w=TRA_TYDNY[wi], vzor=TRA_VZOR[skId][wi];
  const dny=vzor.map((n,di)=>{
    const den={d:w.po+di,m:w.m,di,n,pole:{},pouceni:[],pise:TRA_PISE[(si+di)%TRA_PISE.length]};
    if(n===null)return den;
    if(skId==='vhaaji'&&w.aktualni){const t=TRA_VHAAJI_TED[den.d]||{};
      TRA_POLE.forEach(([k])=>{if(t[k])den.pole[k]=t[k];});den.pouceni=t.pouceni||[];return den;}
    TRA_PORADI.slice(0,n).forEach((k,fi)=>{const p=TRA_TEXT[k];den.pole[k]=p[(si*7+wi*5+di*3+fi)%p.length];});
    const pr=TRA_TEXT.predskolaci[(si+wi+di)%TRA_TEXT.predskolaci.length];
    if(n&&pr)den.pole.predskolaci=pr;
    if(n)den.pouceni=/les|remíz|rybník|pole/i.test(den.pole.kde||'')?['les']:['skolka'];
    return den;
  });
  const hotovy=!w.aktualni&&!(TRA_BEZ_UZAVRENI[skId]||[]).includes(wi);
  return {sk:SKOLKY[si],w,dny,
    tema:skId==='vhaaji'&&w.aktualni?'Kytičky a věneček':TRA_TEMATA[(si+wi)%TRA_TEMATA.length],
    pohadka:skId==='vhaaji'&&w.aktualni?'O Budulínkovi (divadýlko s loutkami)':TRA_POHADKY[(si*2+wi)%TRA_POHADKY.length],
    uzavreni:hotovy?TRA_UZAVRENI[(si+wi)%TRA_UZAVRENI.length]:'',uzavreniChybi:!w.aktualni&&!hotovy};
}
function traStav(den){
  if(den.n===null)return {lab:'neproběhl',cls:'muted'};
  if(den.n>=TRA_POVINNE)return {lab:'zapsáno',cls:'ok'};
  if(!den.n)return den.m===6&&den.d===TODAYD?{lab:'zatím nic',cls:'muted'}:{lab:'chybí',cls:'danger'};
  return {lab:`${den.n} z ${TRA_POVINNE}`,cls:'warn'};
}
// den v týdnu podle pořadí (wd() ze shared.js platí jen pro červen)
const traDenLbl=den=>`${DOW[den.di]} ${den.d}. ${den.m}.`;

let traView='vyplneni', traWeek=TRA_TYDNY.length-1, traDetail=null, traSk='vse', traOb='vse';

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
  const chybi=rows.reduce((n,r)=>n+r.dny.filter(d=>d.n===0&&!(d.m===6&&d.d===TODAYD)).length,0);
  const rozp=rows.reduce((n,r)=>n+r.dny.filter(d=>d.n>0&&d.n<TRA_POVINNE&&!(d.m===6&&d.d===TODAYD)).length,0);
  let h=`<div class="tra-head"><div class="dnav"><button onclick="traStep(-1)" ${wi<=0?'disabled':''} aria-label="Předchozí týden">‹</button>`
    +`<span>${w.label}${w.aktualni?'<i class="dn-cur"> · tento týden</i>':''}</span>`
    +`<button onclick="traStep(1)" ${wi>=TRA_TYDNY.length-1?'disabled':''} aria-label="Další týden">›</button></div>`
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
  h+=`<tr><th scope="row">Píše</th>${dny.map(d=>`<td>${d.n===null?'':d.pise}</td>`).join('')}</tr>`;
  TRA_POLE.forEach(([k,lab])=>{
    h+=`<tr><th scope="row">${lab}</th>`+dny.map(d=>`<td>${d.pole[k]?esc(d.pole[k]):d.n===null?'':`<span class="tra-gap">${k==='predskolaci'?'–':'nevyplněno'}</span>`}</td>`).join('')+`</tr>`;
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
window.traStep=dir=>{traWeek=Math.max(0,Math.min(TRA_TYDNY.length-1,traWeek+dir));render();};
window.traOpen=(sk,wi)=>{traDetail=sk;if(wi!==undefined)traWeek=wi;render();window.scrollTo(0,0);};
window.traZpet=()=>{traDetail=null;render();};
window.traFiltr=(k,v)=>{if(k==='sk')traSk=v;else traOb=v;render();};
