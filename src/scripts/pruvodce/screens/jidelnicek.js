/* SCREEN: PRUVODCE_JIDELNICEK – jídelníček pro průvodce a svačinářku.
   Data jsou sdílená v shared.js (týž dodavatel jako u rodičů, jeden zdroj).

   Dva rozdíly proti rodičovské appce, oba vycházejí z toho, kdo obrazovku používá:

   1) ALERGENY JAKO JMÉNA DĚTÍ. Rodiče zajímá číslo alergenu u vlastního dítěte;
      svačinářku zajímá, KOHO se to týká. Čísla se proto překládají přes ALERGENY_NAZVY
      na děti, které tu alergii mají. Když se jídlo nikoho netýká, nezobrazí se nic –
      obrazovka je tím tišší než rodičovská, ne hlučnější.

   2) LISTOVÁNÍ DO HISTORIE. Svačinářka plánuje z toho, co bylo, proto jde listovat zpět.
      Počítadlo opakování (↻ N×) tu bylo taky, ale výzkum ho vyvrátil: R6 neplánuje podle
      četnosti, ale podle programu („když je jejich vaření sladké, snažím se, aby druhá
      svačina byla slaná"). Měřilo špatnou věc, tak je pryč. */

/* Děti dotčené alergeny jednoho jídla. Vrací křestní jména – na mobilu se příjmení nevejdou
   a v rámci třídy jsou křestní jména jednoznačná. */
function detiSAlergii(kody){
  if(!kody)return [];
  const nazvy=kody.split(',').map(c=>ALERGENY_NAZVY[Number(c.trim())]).filter(Boolean);
  if(!nazvy.length)return [];
  return data.filter(c=>c.alergie&&nazvy.some(n=>c.alergie.toLowerCase().includes(n)))
             .map(c=>c.n);
}

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
        const deti=detiSAlergii(it[2]);
        // Jména jdou dovnitř .mv, aby seděla POD názvem jídla. Vedle textu je nelze dát:
        // u pěti dětí (mléko) si chip ukousl 40 % šířky a název jídla se rozpadl na pět řádků.
        h+=`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}`;
        if(deti.length)h+=`<span class="jid-alerg">${deti.join(', ')}</span>`;
        h+=`</span></div>`;
      }
    });
    h+=`</div>`;
  });
  h+=`<div class="note2">Obědy dodává Mamafood, svačiny chystá školka. U jídla svítí jména dětí, které na některou jeho surovinu mají alergii – vychází z jejich karet v sekci Děti.</div>`;
  return h+`</div>`;
}
window.jidEditOn=()=>{jidDraft=JIDELNICEK[jidTyden].dny.map(den=>den.map(it=>[...it]));jidEdit=true;render();};
window.jidCancel=()=>{jidEdit=false;jidDraft=null;render();};
window.setJid=(i,k,pole,v)=>{jidDraft[i][k][pole]=v;};   // bez render() – kurzor v poli musí zůstat
window.jidSave=()=>{JIDELNICEK[jidTyden].dny=jidDraft.map(den=>den.map(it=>[it[0],it[1].trim(),it[2].trim()]));
  jidEdit=false;jidDraft=null;render();showToast('Jídelníček uložen ✓');};
window.stepJidTyden=d=>{jidTyden=Math.max(0,Math.min(JIDELNICEK.length-1,jidTyden+d));render();};
