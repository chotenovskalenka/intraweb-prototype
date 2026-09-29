/* SCREEN: PRUVODCE_KUCHYN – přehled pro kuchyň (role kuchyn, Ksenia – obědy a svačiny).
   P3 z testování (2 ze 3): „jen se koukne, nic nepočítá, nic nedohledává a ví, kolik čeho
   udělat." Proto nahoře tři čísla – dopolední svačina, oběd, odpolední svačina – a u každého
   jídla porce bez alergenu. Jména jen tam, kde je kuchyň opravdu potřebuje: oběd
   k vyzvednutí a alergie na výdej (ten se tiskne na papír, u výdeje se do mobilu nekouká).

   Počty se odvozují z docházky, nikde nejsou natvrdo: dopolední docházka je do 13:00
   (oběd ano, odpolední svačina ne), odpolední do 15:00, celodenní v úterý do 17:00. */
function porceDne(d){
  const k=c=>getCode(c,d);
  const jedi=data.filter(c=>{const x=k(c);return x&&x!=='OM';});
  const odp=jedi.filter(c=>k(c)!=='D');
  // omluvené dítě, jehož rodič si oběd vyzvedne – porce navíc (jen dnes, zítřek se neví)
  const vyzv=d===TODAYD?data.filter(c=>c.status==='omluveno'&&((c.parentExcuse&&c.parentExcuse.obed)||(c.guideExcuse&&c.guideExcuse.obed))):[];
  return {jedi,odp,vyzv,dop:jedi.length,obed:jedi.length+vyzv.length,odpN:odp.length};
}
const JIDLA_KUCHYNE=[['Dopolední svačina','dop'],['Oběd','obed'],['Odpolední svačina','odp']];
// jídla dne podle chodu – oběd = polévka + hlavní jídlo
function jidlaChodu(menu,chod){
  if(!menu)return [];
  if(chod==='obed')return menu.filter(it=>/polévka|hlavní/i.test(it[0]));
  return menu.filter(it=>it[0]===(chod==='dop'?'Dopolední svačina':'Odpolední svačina'));
}
function renderKuchyn(){
  const p=porceDne(TODAYD), menu=jidelnicekDen(TODAYD);
  const pocet={dop:p.dop,obed:p.obed,odp:p.odpN}, deti={dop:p.jedi,obed:p.jedi,odp:p.odp};
  // ── nahoře tři jídla dne: číslo, co se vaří, kolik porcí bez čeho ──
  let h=`<div class="dash-row kuch-row">`+JIDLA_KUCHYNE.map(([nazev,k])=>{
    const jidla=jidlaChodu(menu,k);
    const bez=jidla.flatMap(it=>porceBez(it[2],deti[k]));
    const alg=[...new Map(bez.map(([n,c])=>[n,c])).entries()];
    return `<div class="tile kuch-meal"><div class="ch">${nazev}</div>`
      +`<div class="kuch-num">${pocet[k]}<span>porcí</span></div>`
      +(k==='obed'&&p.vyzv.length?`<div class="kuch-sub">${p.dop} ve školce + ${p.vyzv.length} k vyzvednutí</div>`:'')
      +(jidla.length?jidla.map(it=>`<div class="kuch-jidlo">${it[1]}</div>`).join(''):`<div class="kuch-jidlo kuch-nic">V jídelníčku zatím chybí.</div>`)
      +(alg.length?`<div class="kuch-alg">${alg.map(([n,c])=>`<span class="jid-alerg">bez ${ALERGEN_BEZ[n]||n} · ${c} ${porcePl(c)}</span>`).join('')}</div>`:'')
      +`</div>`;
  }).join('')+`</div>`;

  h+=`<div class="dash3 kuch-dole">`;
  // ── oběd k vyzvednutí: tady jméno potřeba je – rodič si pro něj přijde ──
  h+=`<div class="dcol"><div class="tile"><div class="ch">Oběd k vyzvednutí</div>`
    +(p.vyzv.length?p.vyzv.map(c=>`<div class="np"><span>${kratke(c)}</span><b>1 porce</b></div>`).join('')
      :`<div class="empty-l">Dnes si nikdo oběd nevyzvedává.</div>`)
    +`<div class="note2" style="margin-top:8px">Rodič omluveného dítěte si může oběd vyzvednout – odpoledne propadá.</div></div></div>`;
  // ── alergie na výdej: jména, tisknou se na papír ──
  const al=p.jedi.filter(c=>c.alergie).sort((a,b)=>a.n.localeCompare(b.n,'cs'));
  h+=`<div class="dcol"><div class="tile"><div class="ch">Alergie na výdej · dnes ve školce</div>`
    +(al.length?al.map(c=>`<div class="np"><span>${kratke(c)}</span><b class="kuch-al">${c.alergie}</b></div>`).join('')
      :`<div class="empty-l">Dnes žádné dítě s alergií.</div>`)
    +`<button class="btn-ghost btn-block" style="margin-top:var(--space-sm)" onclick="alergiePDF()">Vytisknout na výdej (PDF)</button></div></div>`;
  // ── zítřek: na objednávku obědů (dodává Mamafood) ──
  let z=TODAYD+1; while(isWE(z)&&z<30)z++;
  const pz=porceDne(z);
  h+=`<div class="dcol"><div class="tile"><div class="ch">Na objednávku · ${DOW[wd(z)]} ${z}. 6.</div>`
    +`<div class="np"><span>Dopolední svačina</span><b>${pz.dop}</b></div>`
    +`<div class="np"><span>Oběd</span><b>${pz.obed}</b></div>`
    +`<div class="np"><span>Odpolední svačina</span><b>${pz.odpN}</b></div>`
    +`<div class="note2" style="margin-top:8px">Podle přihlášek k ${TEDCAS}. Omluvy do 20:00 dnes se ještě odečtou; po 8:30 zítra už ne.</div></div></div>`;
  h+=`</div>`;
  h+=`<div class="note2">Čísla se počítají z docházky. Když rodič ráno omluví dítě, porce se odečtou samy – nic se nepočítá ručně.</div>`;
  return h;
}
