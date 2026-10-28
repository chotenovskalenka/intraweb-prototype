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
const porceBezLbl=(n,k)=>`${k} ${porcePl(k)} bez ${ALERGEN_BEZ[n]||n}`;

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

/* Hlavička: listování týdnem a úpravy v řádku nadpisu, jako u Docházky a Třídnice
   (ladění C, 28. 10. 2026) – dřív pod H1 samostatný řádek „Týden" se stepperem na druhém konci. */
function jidHlavicka(){
  const t=tydenSkolky(jidTyden);
  // jídelníček zadává kuchyň a hospodářka; ostatní ho jen čtou
  const akce=!smiJidelnicek()?''
    :jidEdit
      ? `<button class="btn-ghost" onclick="jidCancel()">Zrušit</button><button class="btn-primary" onclick="jidSave()">Uložit</button>`
      : `<button class="btn-ghost" onclick="jidEditOn()">Upravit</button>`;
  return `<div class="dfield">${akce}<div class="dnav"><button onclick="stepJidTyden(-1)" ${jidTyden<=0?'disabled':''} aria-label="Předchozí týden">‹</button>`
    +`<span>${jidTydenLabel(t)}</span>`
    +`<button onclick="stepJidTyden(1)" ${jidTyden>=JIDELNICEK.length-1?'disabled':''} aria-label="Další týden">›</button></div></div>`;
}
/* Varianta „karty" (výchozí): dny jako karty – na mobilu pod sebou, na desktopu v mřížce vedle sebe
   (dřív pět karet přes celou šířku, jídlo v dlouhém řádku a popisky chodů různě široké). */
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
   ukousl šířku a název se lámal). bezPopisku = chod nese řádek/sloupec (tabulka, po chodech). */
function jidChodHTML(it,jinaSkolka,bezPopisku){
  const bez=jinaSkolka?[]:porceBez(it[2]);
  return `<div class="jid-chod">${bezPopisku?'':`<div class="jid-k">${it[0]}</div>`}<div class="jid-v">${it[1]||'–'}</div>`
    +(bez.length?`<div class="jid-algs">${bez.map(([n,k])=>`<span class="jid-alerg">${porceBezLbl(n,k)}</span>`).join('')}</div>`:'')+`</div>`;
}
const jidJeDnes=(t,i)=>t.od+i===TODAYD&&t.m===6;
const jidDenLbl=(t,i)=>`${DOW[i]} ${t.od+i}. ${t.m}.${jidJeDnes(t,i)?' <span class="bdg st-ok">dnes</span>':''}`;
const jidPocetBez=(den,jinaSkolka)=>jinaSkolka?0:den.reduce((n,it)=>n+porceBez(it[2]).length,0);

/* PRŮZKUM VZORU (28. 10. 2026) – varianty jídelníčku k porovnání, přepínají se v URL:
   ?jdv=tabulka | dnes | chody (srovnávací stránka docs/jidelnicek-varianty.html). Rozhodne designérka. */
const JID_VAR=(new URLSearchParams(location.search).get('jdv')||'karty');
let jidVybranyDen=null, jidOtevreno=null;   // tabulka na mobilu: vybraný den; dnes: rozbalený den
const jidVychoziDen=t=>{const i=t.dny.findIndex((_,i)=>jidJeDnes(t,i));return i<0?0:i;};

/* Varianta „tabulka": týden jako mřížka chod × den (jako jídelníček na nástěnce). Na desktopu celá
   tabulka, dnešek zvýrazněný sloupec; na mobilu se nevejde – přepínač dnů Po–Pá a jeden den. */
function jidTabulka(t,jinaSkolka){
  const chody=t.dny[0].map(it=>it[0]), vyb=jidVybranyDen??jidVychoziDen(t);
  let h=`<div class="tile jid-mx-w"><table class="jid-mx"><thead><tr><th></th>`
    +t.dny.map((_,i)=>`<th class="${jidJeDnes(t,i)?'dnes':''}" scope="col">${jidDenLbl(t,i)}</th>`).join('')+`</tr></thead><tbody>`;
  chody.forEach((ch,k)=>{
    h+=`<tr><th scope="row">${ch}</th>`+t.dny.map((den,i)=>`<td class="${jidJeDnes(t,i)?'dnes':''}">${jidChodHTML(den[k],jinaSkolka,true)}</td>`).join('')+`</tr>`;
  });
  h+=`</tbody></table></div>`;
  // mobil
  h+=`<div class="jid-mx-m"><div class="switch jid-dny">`+t.dny.map((_,i)=>`<button class="${i===vyb?'on':''}" onclick="jidDen(${i})" aria-pressed="${i===vyb}">${DOW[i]}${jidJeDnes(t,i)?'<i class="jid-dot" aria-label=" (dnes)"></i>':''}</button>`).join('')+`</div>`
    +`<div class="tile"><div class="ch">${jidDenLbl(t,vyb)}</div>${t.dny[vyb].map(it=>jidChodHTML(it,jinaSkolka)).join('')}</div></div>`;
  return h;
}
window.jidDen=i=>{jidVybranyDen=i;render();};

/* Varianta „dnes": co se vaří dnes nahoře celé, ostatní dny jako řádky s hlavním jídlem
   a počtem porcí bez alergenu; klepnutím se den rozbalí. Telefon je pro „co je dnes". */
function jidDnes(t,jinaSkolka){
  const di=t.dny.findIndex((_,i)=>jidJeDnes(t,i));
  let h='';
  if(di>=0)h+=`<div class="tile jid-dnes"><div class="ch">Dnes se jí <span class="jid-dnes-d">${DOW[di]} ${t.od+di}. ${t.m}.</span></div>${t.dny[di].map(it=>jidChodHTML(it,jinaSkolka)).join('')}</div>`;
  h+=`<div class="tile jid-dalsi">${di>=0?'<div class="ch">Ostatní dny týdne</div>':''}`;
  t.dny.forEach((den,i)=>{
    if(i===di)return;
    const on=jidOtevreno===i, hl=den.find(it=>/hlavní/i.test(it[0]))||den[0], n=jidPocetBez(den,jinaSkolka);
    h+=`<div class="jid-r${on?' on':''}${i<di?' bylo':''}"><button class="jid-rh" onclick="jidOtevri(${i})" aria-expanded="${on}">`
      +`<span class="jid-rd">${DOW[i]} ${t.od+i}. ${t.m}.</span>`
      +`<span class="jid-rn">${on?'':esc(hl[1])}</span>`
      +(n&&!on?`<span class="jid-rc" title="${n} jídla s porcemi bez alergenu">alergeny (${n})</span>`:'')
      +`<span class="jid-ra" aria-hidden="true">${on?'⌃':'›'}</span></button>`
      +(on?`<div class="jid-rb">${den.map(it=>jidChodHTML(it,jinaSkolka)).join('')}</div>`:'')+`</div>`;
  });
  return h+`</div>`;
}
window.jidOtevri=i=>{jidOtevreno=jidOtevreno===i?null:i;render();};

/* Varianta „po chodech": karta na chod (dopolední svačina, polévka, …) a v ní pět dnů pod sebou.
   Svačinářka plánuje svačiny přes týden („když je jejich vaření sladké, druhá svačina slaná") –
   tady vidí celý týden svačin najednou. */
function jidChody(t,jinaSkolka){
  const chody=t.dny[0].map(it=>it[0]);
  let h=`<div class="jid-chody">`;
  chody.forEach((ch,k)=>{
    h+=`<div class="tile"><div class="ch">${ch}</div>`
      +t.dny.map((den,i)=>`<div class="jid-cr${jidJeDnes(t,i)?' dnes':''}"><span class="jid-cd">${DOW[i]} ${t.od+i}. ${t.m}.</span>${jidChodHTML(den[k],jinaSkolka,true)}</div>`).join('')+`</div>`;
  });
  return h+`</div>`;
}

function renderJidelnicek(){
  const t=tydenSkolky(jidTyden), jinaSkolka=jidSkolka!=='vhaaji';
  let h=`<div class="doch jid">`;
  if(role==='kuchyn')h+=`<div class="filters jid-sk">`+JID_SKOLKY.map(([k,l])=>`<button class="${jidSkolka===k?'on':''}" onclick="setJidSkolka('${k}')" aria-pressed="${jidSkolka===k}">${l}</button>`).join('')+`</div>`;
  // kuchyň Děti nevidí – alergie na výdej má na svém přehledu
  h+=role==='kuchyn'?`<button class="cardlink jid-kdo" onclick="go('prehled')">Alergie na výdej jsou na přehledu ›</button>`
    :`<button class="cardlink jid-kdo" onclick="goAlergici()">Kdo má jakou alergii ›</button>`;
  // úpravy jsou vždy v kartách – varianty jsou jen pro čtení
  if(jidEdit||JID_VAR==='karty')h+=jidKarty(t,jinaSkolka);
  else h+=(JID_VAR==='tabulka'?jidTabulka:JID_VAR==='dnes'?jidDnes:jidChody)(t,jinaSkolka);
  return h+`</div>`;
}
window.jidEditOn=()=>{jidDraft=tydenSkolky(jidTyden).dny.map(den=>den.map(it=>[...it]));jidEdit=true;render();};
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
window.stepJidTyden=d=>{jidVybranyDen=null;jidOtevreno=null;jidTyden=Math.max(0,Math.min(JIDELNICEK.length-1,jidTyden+d));render();};
