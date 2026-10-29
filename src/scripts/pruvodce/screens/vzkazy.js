/* SCREEN: VZKAZY – evidence adresných vzkazů mezi školkou a jednou rodinou (designérka 29. 10. 2026).
   Novinka jde všem rodičům, vzkaz jedné rodině – proto vlastní sekce, ne záložka v Novinkách.
   Obě strany na jednom místě: od rodičů (c.zpravy, zakládá rodič ve své appce) i rodičům
   (VZKAZY, píše průvodce). Řazeno po dnech, na které vzkaz platí – od nejvzdálenějšího
   nadcházejícího po nejstarší, aby šlo dohledat, co se komu kdy psalo.
   Za celý rok by toho byly stovky: ukazuje se nadcházející + posledních 14 dní, starší po
   týdnech tlačítkem; hledání podle dítěte prochází všechno (designérka 29. 10. 2026). */
let vzSmer='vse', vzOd=TODAYD-13, vzQuery='';
function vzVse(){
  const a=[];
  data.forEach((c,i)=>{
    (c.zpravy||[]).forEach(z=>a.push({c,i,smer:'od',den:z.den,z}));
    vzkazyFor(i).forEach(v=>a.push({c,i,smer:'pro',den:v.den,v}));
  });
  return a;
}
function vzRadek(x){
  const {c}=x;
  if(x.smer==='od'){
    const z=x.z, dlouhy=(z.text||'').length>ZP_DELKA, open=zpRozbalene.has(z.id);
    return `<div class="zprow">${avatar(c,28)}<span class="zp-txt"><span class="zp-head"><b>${kratke(c)}</b><span class="vz-smer">od rodičů</span><span class="zp-cas">${z.odeslano}</span></span>`
      +`<span class="zp-who${dlouhy&&!open?' zp-clamp':''}">${zpravaShrnuti(z)}</span>`
      +(dlouhy?`<button class="zp-vic" onclick="zpToggle('${z.id}')">${open?'zkrátit ›':'celý vzkaz ›'}</button>`:'')+`</span></div>`;
  }
  const v=x.v;
  return `<div class="zprow">${avatar(c,28)}<span class="zp-txt"><span class="zp-head"><b>${kratke(c)}</b><span class="vz-smer vz-pro">rodičům – ${esc(v.kdo)}</span><span class="zp-cas">${v.cas}</span></span>`
    +`<span class="zp-who">${esc(v.text)}</span></span></div>`;
}
function renderVzkazy(){
  const hledam=!!vzQuery.trim();
  const vse=vzVse().filter(x=>hledam?norm(full(x.c)).includes(norm(vzQuery.trim())):x.den>=vzOd);
  const starsi=!hledam&&vzVse().some(x=>x.den<vzOd&&(vzSmer==='vse'||x.smer===vzSmer));
  const n=k=>vse.filter(x=>k==='vse'||x.smer===k).length;
  let h=`<div class="doch vz">`;
  h+=`<div class="deti-bar"><input class="search" placeholder="Najít dítě…" value="${esc(vzQuery)}" oninput="onVzSearch(this.value)" aria-label="Najít vzkazy podle dítěte"></div>`;
  h+=`<div class="filters">`+[['vse','Všechny'],['od','Od rodičů'],['pro','Rodičům']].map(([k,l])=>
    `<button class="${vzSmer===k?'on':''}" aria-pressed="${vzSmer===k}" onclick="setVzSmer('${k}')">${l}<span class="cnt">${n(k)}</span></button>`).join('')+`</div>`;
  const vyber=vse.filter(x=>vzSmer==='vse'||x.smer===vzSmer);
  if(!vyber.length)h+=`<div class="empty">${hledam?'Nic nenalezeno.':vzSmer==='pro'?'Za poslední dva týdny rodičům žádný vzkaz neodešel.':'Za poslední dva týdny žádné vzkazy.'}</div>`;
  const dny=[...new Set(vyber.map(x=>x.den))].sort((a,b)=>b-a);
  dny.forEach(d=>{
    const den=vyber.filter(x=>x.den===d).sort((a,b)=>(a.smer==='od'?0:1)-(b.smer==='od'?0:1));
    const nad=d===TODAYD||d===TODAYD+1?`${denLbl(d).replace(/^./,m=>m.toUpperCase())} (${denDatum(d)})`:denDatum(d);
    h+=`<div class="tile vz-den"><div class="ch">${nad}</div>${den.map(vzRadek).join('')}</div>`;
  });
  if(starsi)h+=`<button class="btn-ghost btn-block vz-starsi" onclick="vzStarsi()">Starší vzkazy (do ${denDatum(vzOd-7).replace(/^\S+ /,'')})</button>`;
  return h+`</div>`;
}
window.setVzSmer=k=>{vzSmer=k;render();};
window.vzStarsi=()=>{vzOd-=7;render();};
window.onVzSearch=v=>{vzQuery=v;renderKeepFocus();};
