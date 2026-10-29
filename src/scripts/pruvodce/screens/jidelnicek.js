/* SCREEN: PRUVODCE_JIDELNICEK – jídelníček pro průvodce a svačinářku.
   Data jsou sdílená v shared.js (týž dodavatel jako u rodičů, jeden zdroj).

   Dva rozdíly proti rodičovské appce, oba vycházejí z toho, kdo obrazovku používá:

   1) ALERGENY JAKO PORCE, NE JMÉNA (P5 z testování). Dřív tu svítila jména dětí – testování
      to vyvrátilo: kuchařka u přípravy potřebuje vědět, KOLIK porcí udělat bez čeho
      („jednu porci bez sóji"), jména řeší až u výdeje, kdy se do mobilu nekouká (mají je
      vyvěšená na papíře). Jméno u jídla navíc četlo, jako by to jídlo dostalo jen to dítě.
      Náhradu kuchyň píše přímo do názvu jídla („Pečivo (1× bez sóji)"). Když se jídlo
      nikoho netýká, nezobrazí se nic.

   2) LISTOVÁNÍ DO HISTORIE. Svačinářka plánuje z toho, co bylo, proto jde listovat zpět.
      Počítadlo opakování (↻ N×) tu bylo taky, ale výzkum ho vyvrátil: R6 neplánuje podle
      četnosti, ale podle programu („když je jejich vaření sladké, snažím se, aby druhá
      svačina byla slaná"). Měřilo špatnou věc, tak je pryč. */

/* Kolik porcí jednoho jídla musí být bez kterého alergenu. Vrací [[alergen, počet]]. */
const ALERGEN_BEZ={lepek:'lepku',ryby:'ryb','arašídy':'arašídů','sója':'sóji','mléko':'mléka','skořápkové plody':'skořápkových plodů',celer:'celeru'};
function porceBez(kody,deti){
  if(!kody)return [];
  const koho=deti||data;   // jídelníček: všechny děti; kuchyň: jen ty, které dnes jedí
  return kody.split(',').map(c=>ALERGENY_NAZVY[Number(c.trim())]).filter(Boolean)
    .map(n=>[n,koho.filter(c=>c.alergie&&c.alergie.toLowerCase().includes(n)).length])
    .filter(([,k])=>k>0);
}
const porcePl=k=>k===1?'porce':(k>=2&&k<=4?'porce':'porcí');
// „5 porcí bez mléka" – věta místo „bez mléka · 5 porcí" (žádné tečky jako oddělovač)
// kuchyň chystá porce, průvodce u výdeje hlídá děti (designérka 28. 10. 2026): „bez mléka: 5 dětí"
const detiPl=k=>k===1?'dítě':(k>=2&&k<=4?'děti':'dětí');
const porceBezLbl=(n,k)=>role==='kuchyn'?`${k} ${porcePl(k)} bez ${ALERGEN_BEZ[n]||n}`:`bez ${ALERGEN_BEZ[n]||n}: ${k} ${detiPl(k)}`;

/* Kolikrát se totéž jídlo objeví napříč všemi týdny v datech. Počítá se jen u svačin –
   ty svačinářka plánuje; u obědů skladbu určuje dodavatel. */

/* Zadávání celého týdne najednou – tentýž vzor jako u týdenního rytmu. Rozepsané hodnoty
   drží jidDraft, do JIDELNICEK se zapíšou až Uložit, proto oninput jen plní draft
   a nevolá render() (jinak by z pole utekl kurzor). */
let jidEdit=false, jidDraft=null;

/* Svačiny má každá školka vlastní (rozhodnutí 10. 10. 2026): chystá si je sama, kdežto obědy
   dodává Mamafood všem stejně. Vhaaji drží svačiny přímo v JIDELNICEK (čte je i rodičovská
   appka); Jaata a Maata mají svačiny zvlášť v SVACINY a obědy berou společné.
   Demo svačiny ostatních školek se poprvé poskládají z receptů Vhaaji, jen jinak rozložené. */
const JID_SKOLKY=[['vhaaji','Vhaaji'],['jaata','Jaata'],['maata','Maata']];
let jidSkolka='vhaaji';
const SVACINY={jaata:{},maata:{}};
const jeSvacina=it=>/svačina/i.test(it[0]);
function svacinyFor(sk,ti){
  if(!SVACINY[sk][ti]){
    const pool=k=>JIDELNICEK.flatMap(t=>t.dny.map(d=>d.find(it=>it[0]===k))).filter(it=>it&&it[1]);
    const dop=pool('Dopolední svačina'), odp=pool('Odpolední svačina'), off=sk==='jaata'?3:7;
    SVACINY[sk][ti]=JIDELNICEK[ti].dny.map((_,i)=>[[...dop[(off+ti*5+i)%dop.length]],[...odp[(off+2+ti*5+i)%odp.length]]]);
  }
  return SVACINY[sk][ti];
}
// týden jídelníčku tak, jak ho vidí vybraná školka: obědy společné, svačiny její
function tydenSkolky(ti){
  const t=JIDELNICEK[ti]; if(jidSkolka==='vhaaji')return t;
  const sv=svacinyFor(jidSkolka,ti);
  return {...t,dny:t.dny.map((den,i)=>den.map(it=>it[0]==='Dopolední svačina'?sv[i][0]:it[0]==='Odpolední svačina'?sv[i][1]:it))};
}

/* Hlavička: úpravy v řádku nadpisu, jako u Docházky a Třídnice. Čtení nemá listování – ukazuje
   pět dnů od dneška, minulost průvodce nezajímá (designérka 28. 10. 2026). Listování týdny je jen
   v úpravách: kuchyň a hospodářka zadávají dopředu a svačinářka plánuje z toho, co bylo. */
function jidHlavicka(){
  /* odkaz na alergie nahoře vpravo vedle Upravit (designérka 29. 10. 2026; dřív pod jídlem);
     kuchyň Děti nevidí – alergie na výdej má na svém přehledu */
  const alg=role==='kuchyn'?`<button class="cardlink jid-kdo" onclick="go('prehled')">Alergie na výdej jsou na přehledu ›</button>`
    :`<button class="cardlink jid-kdo" onclick="goAlergici()">Kdo má jakou alergii ›</button>`;
  // jídelníček zadává kuchyň a hospodářka; ostatní ho jen čtou
  if(!smiJidelnicek())return `<div class="dfield">${alg}</div>`;
  if(!jidEdit)return `<div class="dfield">${alg}<button class="btn-ghost" onclick="jidEditOn()">Upravit</button></div>`;
  const t=tydenSkolky(jidTyden);
  return `<div class="dfield"><button class="btn-ghost" onclick="jidCancel()">Zrušit</button><button class="btn-primary" onclick="jidSave()">Uložit</button>`
    +`<div class="dnav"><button onclick="stepJidTyden(-1)" ${jidTyden<=0?'disabled':''} aria-label="Předchozí týden">‹</button>`
    +`<span>${jidTydenLabel(t)}</span>`
    +`<button onclick="stepJidTyden(1)" ${jidTyden>=JIDELNICEK.length-1?'disabled':''} aria-label="Další týden">›</button></div></div>`;
}
/* Úprava jídelníčku: dny jako karty – na mobilu pod sebou, na desktopu v mřížce vedle sebe. */
function jidKarty(t,jinaSkolka){
  let h=`<div class="jid-tyden">`;
  t.dny.forEach((den,i)=>{
    const d=t.od+i, dnes=jidJeDnes(t,i);
    h+=`<div class="tile jid-den${dnes?' dnes':''}"><div class="ch">${jidDenLbl(t,i)}</div>`;
    den.forEach((it,k)=>{
      if(jidEdit&&smiJidelnicek()){
        const dr=jidDraft[i][k];
        h+=`<div class="jid-edit"><label class="pl">${it[0]}${!jeSvacina(it)&&role==='kuchyn'?' <span class="vis vis-t">všechny školky</span>':''}</label>`+
          `<input class="pin" value="${esc(dr[1])}" oninput="setJid(${i},${k},1,this.value)" placeholder="název jídla" aria-label="${it[0]} – ${DOW[i]}">`+
          `<input class="pin jid-alg" value="${esc(dr[2])}" oninput="setJid(${i},${k},2,this.value)" placeholder="alergeny, např. 1, 7" aria-label="Alergeny – ${it[0]}, ${DOW[i]}"></div>`;
      }else h+=jidChodHTML(it,jinaSkolka);
    });
    h+=`</div>`;
  });
  return h+`</div>`;
}
/* Jeden chod: popisek nad jídlem, porce bez alergenu jako štítky pod ním (vedle textu si štítek
   ukousl šířku a název se lámal). */
function jidChodHTML(it,jinaSkolka){
  const bez=jinaSkolka?[]:porceBez(it[2]);
  return `<div class="jid-chod"><div class="jid-k">${it[0]}</div><div class="jid-v">${it[1]||'–'}</div>`
    +(bez.length?`<div class="jid-algs">${bez.map(([n,k])=>`<span class="jid-alerg">${porceBezLbl(n,k)}</span>`).join('')}</div>`:'')+`</div>`;
}
const jidJeDnes=(t,i)=>t.od+i===TODAYD&&t.m===6;
const jidDenLbl=(t,i)=>`${DOW[i]} ${t.od+i}. ${t.m}.${jidJeDnes(t,i)?' <span class="bdg st-ok">dnes</span>':''}`;

/* Čtení jídelníčku: od dneška nahoře dolů až do konce měsíce (co je dodané), po týdnech –
   minulost průvodce nezajímá a dnešek je i na přehledu (designérka 28. 10. 2026). */
function jidDnyOdDneska(){
  const out=[];
  for(let d=TODAYD;d<=30;d++){
    const t=jidelnicekTyden(d,6); if(!t)continue;      // víkend nebo mimo dodané týdny
    out.push({d,m:t.m,dow:wd(d),den:tydenSkolky(JIDELNICEK.indexOf(t)).dny[d-t.od]});
  }
  return out;
}
const jidKdyLbl=d=>d===TODAYD?'dnes':d===TODAYD+1?'zítra':'';
/* Po týdnech jako tabulka: řádky jsou dny, sloupce chody – popisek chodu je jednou v záhlaví,
   ne u každého jídla (v kartách se 18 dní × 4 popisky četlo špatně, designérka 28. 10. 2026).
   Dnešek je zvýrazněný řádek. Na mobilu se tabulka nevejde: den jako blok, jídla pod sebou. */
function jidOdDneska(jinaSkolka){
  const dny=jidDnyOdDneska();
  if(!dny.length)return `<div class="empty">Na další dny zatím jídelníček není.</div>`;
  const tydny=[];dny.forEach(x=>{const t=jidelnicekTyden(x.d,6);if(!tydny.length||tydny[tydny.length-1].t!==t)tydny.push({t,dny:[]});tydny[tydny.length-1].dny.push(x);});
  const datum=x=>{const k=jidKdyLbl(x.d);return `<span class="jid-td">${DOW[x.dow]} ${x.d}. ${x.m}.</span>${k?`<span class="bdg ${x.d===TODAYD?'st-ok':'st-muted'}">${k}</span>`:''}`;};
  const bunka=it=>jidChodHTML(it,jinaSkolka).replace(/<div class="jid-k">.*?<\/div>/,'');
  return tydny.map((w,wi)=>{
    const chody=w.dny[0].den.map(it=>it[0]);
    let h=`<div class="tile jid-tw"><div class="ch">${wi?`Týden ${jidTydenLabel(w.t)}`:'Tento týden'}</div>`;
    h+=`<table class="jid-mx"><thead><tr><th scope="col"><span class="vh">Den</span></th>${chody.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>`
      +w.dny.map(x=>`<tr class="${x.d===TODAYD?'dnes':''}"><th scope="row">${datum(x)}</th>${x.den.map(it=>`<td>${bunka(it)}</td>`).join('')}</tr>`).join('')
      +`</tbody></table>`;
    h+=`<div class="jid-ml">`+w.dny.map(x=>`<div class="jid-md${x.d===TODAYD?' dnes':''}"><div class="jid-mdh">${datum(x)}</div>${x.den.map(it=>jidChodHTML(it,jinaSkolka)).join('')}</div>`).join('')+`</div>`;
    return h+`</div>`;
  }).join('');
}

function renderJidelnicek(){
  const t=tydenSkolky(jidTyden), jinaSkolka=jidSkolka!=='vhaaji';
  let h=`<div class="doch jid">`;
  if(role==='kuchyn')h+=`<div class="filters jid-sk">`+JID_SKOLKY.map(([k,l])=>`<button class="${jidSkolka===k?'on':''}" onclick="setJidSkolka('${k}')" aria-pressed="${jidSkolka===k}">${l}</button>`).join('')+`</div>`;
  // úpravy po týdnech v kartách, čtení od dneška
  h+=jidEdit?jidKarty(t,jinaSkolka):jidOdDneska(jinaSkolka);
  return h+`</div>`;
}
window.jidEditOn=()=>{jidTyden=jidIndex(TODAYD,6);jidDraft=tydenSkolky(jidTyden).dny.map(den=>den.map(it=>[...it]));jidEdit=true;render();};
window.jidCancel=()=>{jidEdit=false;jidDraft=null;render();};
window.setJid=(i,k,pole,v)=>{jidDraft[i][k][pole]=v;};   // bez render() – kurzor v poli musí zůstat
window.jidSave=()=>{const ciste=jidDraft.map(den=>den.map(it=>[it[0],it[1].trim(),it[2].trim()]));
  if(jidSkolka==='vhaaji')JIDELNICEK[jidTyden].dny=ciste;
  else{// obědy do společného jídelníčku, svačiny do jídelníčku školky
    JIDELNICEK[jidTyden].dny.forEach((den,i)=>den.forEach((it,k)=>{if(!jeSvacina(it))den[k]=ciste[i][k];}));
    SVACINY[jidSkolka][jidTyden]=ciste.map(den=>[den.find(it=>it[0]==='Dopolední svačina'),den.find(it=>it[0]==='Odpolední svačina')]);}
  jidEdit=false;jidDraft=null;render();showToast(jidSkolka==='vhaaji'?'Jídelníček uložen ✓':`Uloženo: svačiny ${JID_SKOLKY.find(x=>x[0]===jidSkolka)[1]}, obědy pro všechny ✓`);};
window.setJidSkolka=k=>{if(jidEdit){showToast('Nejdřív ulož, nebo zruš úpravy');return;}jidSkolka=k;render();};
window.goAlergici=()=>{detiFilter='al';detiOpen=-1;go('deti');};
// listování jen v úpravách: rozepsaný týden se nezahodí potichu
window.stepJidTyden=d=>{
  if(JSON.stringify(jidDraft)!==JSON.stringify(tydenSkolky(jidTyden).dny)){showToast('Nejdřív ulož, nebo zruš úpravy');return;}
  jidTyden=Math.max(0,Math.min(JIDELNICEK.length-1,jidTyden+d));jidDraft=tydenSkolky(jidTyden).dny.map(den=>den.map(it=>[...it]));render();};
