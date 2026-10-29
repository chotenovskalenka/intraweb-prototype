/* SCREEN: VZKAZY – evidence adresných vzkazů mezi školkou a jednou rodinou (designérka 29. 10. 2026).
   Novinka jde všem rodičům, vzkaz jedné rodině – proto vlastní sekce, ne záložka v Novinkách.
   Obě strany na jednom místě: od rodičů (c.zpravy, zakládá rodič ve své appce) i rodičům
   (VZKAZY, píše průvodce). Řazeno po dnech, na které vzkaz platí – od nejvzdálenějšího
   nadcházejícího po nejstarší, aby šlo dohledat, co se komu kdy psalo. */
let vzSmer='vse';
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
  const vse=vzVse(), n=k=>vse.filter(x=>k==='vse'||x.smer===k).length;
  let h=`<div class="doch vz">`;
  h+=`<div class="filters">`+[['vse','Všechny'],['od','Od rodičů'],['pro','Rodičům']].map(([k,l])=>
    `<button class="${vzSmer===k?'on':''}" aria-pressed="${vzSmer===k}" onclick="setVzSmer('${k}')">${l}<span class="cnt">${n(k)}</span></button>`).join('')+`</div>`;
  const vyber=vse.filter(x=>vzSmer==='vse'||x.smer===vzSmer);
  if(!vyber.length)h+=`<div class="empty">${vzSmer==='pro'?'Rodičům zatím žádný vzkaz neodešel.':'Zatím žádné vzkazy.'}</div>`;
  const dny=[...new Set(vyber.map(x=>x.den))].sort((a,b)=>b-a);
  dny.forEach(d=>{
    const den=vyber.filter(x=>x.den===d).sort((a,b)=>(a.smer==='od'?0:1)-(b.smer==='od'?0:1));
    const nad=d===TODAYD||d===TODAYD+1?`${denLbl(d).replace(/^./,m=>m.toUpperCase())} (${DOW[wd(d)]} ${d}. 6.)`:`${DOW[wd(d)]} ${d}. 6.`;
    h+=`<div class="tile vz-den"><div class="ch">${nad}</div>${den.map(vzRadek).join('')}</div>`;
  });
  h+=`<div class="hint">Vzkaz rodičům uvidí jen rodiče daného dítěte, na přehledu ve své appce. Vzkazy od rodičů píšou rodiče ve své appce.</div>`;
  return h+`</div>`;
}
window.setVzSmer=k=>{vzSmer=k;render();};
