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
// alergie dětí, které dnes jedí: [[alergen, počet]] – sčítá se z karet dětí („mléko, vejce")
function alergieSouhrn(deti){
  const m=new Map();
  deti.forEach(c=>(c.alergie||'').split(',').map(x=>x.trim()).filter(Boolean).forEach(a=>m.set(a,(m.get(a)||0)+1)));
  return [...m.entries()].sort((a,b)=>b[1]-a[1]);
}
// Vhaaji živě z docházky; tvar stejný jako u KUCH_SKOLKY, aby šly všechny školky do jedné tabulky
function kuchynVhaaji(){
  const p=porceDne(TODAYD);
  // včerejší objednávka = plán na dnešek po deadlinu (bez dnešních ranních omluv)
  const objednano=data.filter(c=>{const k=Object.prototype.hasOwnProperty.call(c.att,TODAYD)?c.att[TODAYD]:baseCode(c,TODAYD);return k&&k!=='OM';}).length;
  let z=TODAYD+1; while(isWE(z)&&z<30)z++;
  const pz=porceDne(z);
  return {nazev:'Vhaaji',zive:true,zapsano:data.length,objednano,dop:p.dop,obed:p.obed,odp:p.odpN,vyzv:p.vyzv.length,
    alergie:alergieSouhrn(p.jedi),zitra:{dop:pz.dop,obed:pz.obed,odp:pz.odpN}};
}
function kuchynSkolky(){
  return [kuchynVhaaji(),...KUCH_SKOLKY.map(s=>({...s,dop:s.jedi,obed:s.jedi+s.vyzv,odp:s.jedi-s.dopol}))];
}
const navic=s=>Math.max(0,s.objednano-s.obed);
const algTxt=a=>a.length?a.map(([n,c])=>`${n} ${c}`).join(' · '):'<span class="dt-no">–</span>';

function renderKuchyn(){
  const sk=kuchynSkolky(), sum=k=>sk.reduce((n,s)=>n+s[k],0);
  const sumNavic=sk.reduce((n,s)=>n+navic(s),0), sumObj=sum('objednano');
  let z=TODAYD+1; while(isWE(z)&&z<30)z++;

  // ── nahoře: součty za všechny školky – „jen se koukne a ví" ──
  let h=`<div class="kuch"><div class="kuch-sekce">Dnes · všechny školky</div>`;
  h+=`<div class="dash-row kuch-row">`
    +`<div class="tile kuch-meal"><div class="ch">Dopolední svačina</div><div class="kuch-num">${sum('dop')}<span>porcí</span></div><div class="kuch-sub">chystá každá školka sama</div></div>`
    +`<div class="tile kuch-meal"><div class="ch">Oběd</div><div class="kuch-num">${sum('obed')}<span>porcí</span></div>`
      +`<div class="kuch-sub">objednáno ${sumObj}${sumNavic?` · <b class="kuch-navic">${sumNavic} navíc</b>`:''}${sum('vyzv')?` · ${sum('vyzv')} k vyzvednutí`:''}</div></div>`
    +`<div class="tile kuch-meal"><div class="ch">Odpolední svačina</div><div class="kuch-num">${sum('odp')}<span>porcí</span></div><div class="kuch-sub">bez dětí na dopolední docházce</div></div>`
    +`</div>`;

  // ── podle školek: na desktopu tabulka, na mobilu karty (obojí v DOM, přepíná CSS) ──
  h+=`<div class="tile"><div class="ch">Dnes podle školek</div>`;
  h+=`<div class="kuch-karty">`+sk.map(s=>`<div class="kuch-karta"><div class="kk-h"><b>${s.nazev}</b>${s.zive?'':'<span class="dt-no">souhrn</span>'}</div>`
      +`<div class="np"><span>Dopolední svačina</span><b>${s.dop}</b></div>`
      +`<div class="np"><span>Oběd</span><b>${s.obed}${navic(s)?` <span class="kuch-navic">· ${navic(s)} navíc</span>`:''}</b></div>`
      +`<div class="np"><span>Odpolední svačina</span><b>${s.odp}</b></div>`
      +(s.alergie.length?`<div class="np"><span>Alergie</span><b class="kuch-al">${algTxt(s.alergie)}</b></div>`:'')+`</div>`).join('')+`</div>`;
  h+=`<div class="kuch-tabwrap"><table class="dtab kuch-tab"><thead><tr><th><span>Školka</span></th><th><span>Dop. svačina</span></th><th><span>Oběd</span></th><th><span>Objednáno</span></th><th><span>Navíc</span></th><th><span>Odp. svačina</span></th><th><span>Alergie dnes</span></th></tr></thead><tbody>`
    +sk.map(s=>`<tr><td><b>${s.nazev}</b></td><td>${s.dop}</td><td><b>${s.obed}</b>${s.vyzv?` <span class="dt-no">(${s.vyzv} k vyzv.)</span>`:''}</td><td>${s.objednano}</td><td>${navic(s)?`<b class="kuch-navic">${navic(s)}</b>`:'<span class="dt-no">–</span>'}</td><td>${s.odp}</td><td class="kuch-al">${algTxt(s.alergie)}</td></tr>`).join('')
    +`<tr class="kuch-celkem"><td>Celkem</td><td>${sum('dop')}</td><td><b>${sum('obed')}</b></td><td>${sumObj}</td><td>${sumNavic?`<b class="kuch-navic">${sumNavic}</b>`:'–'}</td><td>${sum('odp')}</td><td></td></tr>`
    +`</tbody></table></div>`;
  h+=`<div class="note2" style="margin-top:8px">„Navíc" = obědy objednané včera, které dnes nikdo nesní – dítě ráno nedorazilo. Svačiny chystá každá školka sama podle aktuálního čísla, proto u nich nic navíc nevzniká.</div></div>`;

  // ── zítřek na objednávku ──
  h+=`<div class="tile"><div class="ch">Na objednávku · ${DOW[wd(z)]} ${z}. 6.</div>`
    +sk.map(s=>`<div class="np"><span>${s.nazev}</span><b>${s.zitra.obed} obědů <span class="dt-no">· sv. ${s.zitra.dop} / ${s.zitra.odp}</span></b></div>`).join('')
    +`<div class="np vyk-suma"><span>Celkem obědů</span><b>${sk.reduce((n,s)=>n+s.zitra.obed,0)}</b></div>`
    +`<div class="note2" style="margin-top:8px">Podle přihlášek k ${TEDCAS}. Omluvy do 20:00 dnes se ještě odečtou; zítřejší ranní omluvy už ne – z nich je pak „navíc".</div></div>`;

  // ── detail Vhaaji: co se vaří, porce bez alergenu, oběd k vyzvednutí, alergie na výdej ──
  const p=porceDne(TODAYD), menu=jidelnicekDen(TODAYD);
  const deti={dop:p.jedi,obed:p.jedi,odp:p.odp};
  h+=`<div class="kuch-sekce">Detail · Vhaaji</div>`;
  h+=`<div class="dash3 kuch-dole">`+JIDLA_KUCHYNE.map(([nazev,k])=>{
    const jidla=jidlaChodu(menu,k);
    const alg=[...new Map(jidla.flatMap(it=>porceBez(it[2],deti[k]))).entries()];
    return `<div class="dcol"><div class="tile"><div class="ch">${nazev}</div>`
      +(jidla.length?jidla.map(it=>`<div class="kuch-jidlo">${it[1]}</div>`).join(''):`<div class="kuch-jidlo kuch-nic">V jídelníčku zatím chybí.</div>`)
      +(alg.length?`<div class="kuch-alg">${alg.map(([n,c])=>`<span class="jid-alerg">${porceBezLbl(n,c)}</span>`).join('')}</div>`:'')
      +`</div></div>`;
  }).join('')+`</div>`;
  h+=`<div class="dash3 kuch-dole">`;
  h+=`<div class="dcol"><div class="tile"><div class="ch">Oběd k vyzvednutí</div>`
    +(p.vyzv.length?p.vyzv.map(c=>`<div class="np"><span>${kratke(c)}</span><b>1 porce</b></div>`).join('')
      :`<div class="empty-l">Dnes si nikdo oběd nevyzvedává.</div>`)
    +`<div class="note2" style="margin-top:8px">Rodič omluveného dítěte si může oběd vyzvednout – odpoledne propadá.</div></div></div>`;
  const al=p.jedi.filter(c=>c.alergie).sort((a,b)=>a.n.localeCompare(b.n,'cs'));
  h+=`<div class="dcol"><div class="tile"><div class="ch">Alergie na výdej · dnes ve školce</div>`
    +(al.length?al.map(c=>`<div class="np"><span>${kratke(c)}</span><b class="kuch-al">${c.alergie}</b></div>`).join('')
      :`<div class="empty-l">Dnes žádné dítě s alergií.</div>`)
    +`<button class="btn-ghost btn-block" style="margin-top:var(--space-sm)" onclick="alergiePDF()">Vytisknout na výdej (PDF)</button></div></div>`;
  h+=`</div>`;
  h+=`<div class="note2">Čísla se počítají z docházky každé školky. V prototypu má jména a jídelníček jen Vhaaji; ostatní školky jsou souhrnem.</div></div>`;
  return h;
}
