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
function porceBez(kody){
  if(!kody)return [];
  return kody.split(',').map(c=>ALERGENY_NAZVY[Number(c.trim())]).filter(Boolean)
    .map(n=>[n,data.filter(c=>c.alergie&&c.alergie.toLowerCase().includes(n)).length])
    .filter(([,k])=>k>0);
}
const porcePl=k=>k===1?'porce':(k>=2&&k<=4?'porce':'porcí');

/* Kolikrát se totéž jídlo objeví napříč všemi týdny v datech. Počítá se jen u svačin –
   ty svačinářka plánuje; u obědů skladbu určuje dodavatel. */

/* Zadávání celého týdne najednou – tentýž vzor jako u týdenního rytmu. Rozepsané hodnoty
   drží jidDraft, do JIDELNICEK se zapíšou až Uložit, proto oninput jen plní draft
   a nevolá render() (jinak by z pole utekl kurzor). */
let jidEdit=false, jidDraft=null;

function renderJidelnicek(){
  const t=JIDELNICEK[jidTyden];
  // Týden i jeho listování patří k sobě: stepper sedí v řádku s nadpisem vedle akcí,
  // ne nahoře u H1 – jinak byl týden napsaný dvakrát a ovládání na dvou místech.
  let h=`<div class="doch"><div class="vhead-row"><div class="vhead">Týden</div><div class="vhead-act">`+
    // jídelníček zadává hospodářka (chystá jídlo); ostatní ho jen čtou
    (!jeHospodar()?''
      :jidEdit
        ? `<button class="btn-ghost" onclick="jidCancel()">Zrušit</button><button class="btn-primary" onclick="jidSave()">Uložit</button>`
        : `<button class="btn-ghost" onclick="jidEditOn()">Upravit jídelníček</button>`)+
    `<div class="dnav"><button onclick="stepJidTyden(-1)" ${jidTyden<=0?'disabled':''} aria-label="Předchozí týden">‹</button>`+
    `<span>${jidTydenLabel(t)}</span>`+
    `<button onclick="stepJidTyden(1)" ${jidTyden>=JIDELNICEK.length-1?'disabled':''} aria-label="Další týden">›</button></div>`+
    `</div></div>`;
  h+=`<button class="cardlink jid-kdo" onclick="goAlergici()">Kdo má jakou alergii ›</button>`;
  t.dny.forEach((den,i)=>{
    const d=t.od+i, dnes=(d===TODAYD&&t.m===6);
    h+=`<div class="tile"><div class="ch">${DOW[i]} ${d}. ${t.m}.${dnes?' · dnes':''}</div>`;
    den.forEach((it,k)=>{
      if(jidEdit&&jeHospodar()){
        const dr=jidDraft[i][k];
        h+=`<div class="jid-edit"><label class="pl">${it[0]}</label>`+
          `<input class="pin" value="${esc(dr[1])}" oninput="setJid(${i},${k},1,this.value)" placeholder="název jídla" aria-label="${it[0]} – ${DOW[i]}">`+
          `<input class="pin jid-alg" value="${esc(dr[2])}" oninput="setJid(${i},${k},2,this.value)" placeholder="alergeny, např. 1, 7" aria-label="Alergeny – ${it[0]}, ${DOW[i]}"></div>`;
      }else{
        const bez=porceBez(it[2]);
        // pod názvem jídla, ne vedle něj – vedle textu si štítek ukousl šířku a název se lámal
        h+=`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}`;
        if(bez.length)h+=`<span class="jid-alerg">${bez.map(([n,k])=>`bez ${ALERGEN_BEZ[n]||n} · ${k} ${porcePl(k)}`).join(' · ')}</span>`;
        h+=`</span></div>`;
      }
    });
    h+=`</div>`;
  });
  h+=`<div class="note2">Obědy dodává Mamafood, svačiny chystá školka. U jídla je vidět, kolik porcí musí být bez kterého alergenu – počítá se z karet dětí v sekci Děti. Jména pro výdej jsou v Dětech → Alergici, i jako seznam k vytištění.</div>`;
  return h+`</div>`;
}
window.jidEditOn=()=>{jidDraft=JIDELNICEK[jidTyden].dny.map(den=>den.map(it=>[...it]));jidEdit=true;render();};
window.jidCancel=()=>{jidEdit=false;jidDraft=null;render();};
window.setJid=(i,k,pole,v)=>{jidDraft[i][k][pole]=v;};   // bez render() – kurzor v poli musí zůstat
window.jidSave=()=>{JIDELNICEK[jidTyden].dny=jidDraft.map(den=>den.map(it=>[it[0],it[1].trim(),it[2].trim()]));
  jidEdit=false;jidDraft=null;render();showToast('Jídelníček uložen ✓');};
window.goAlergici=()=>{detiFilter='al';detiOpen=-1;go('deti');};
window.stepJidTyden=d=>{jidTyden=Math.max(0,Math.min(JIDELNICEK.length-1,jidTyden+d));render();};
