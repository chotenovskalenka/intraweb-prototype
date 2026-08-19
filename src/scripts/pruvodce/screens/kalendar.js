/* SCREEN: PRUVODCE_KALENDAR – tentýž sdílený Google Kalendář školky jako u rodičů
   (komponenta .gcal* v components.css, data v kalendar-skolky.js). Průvodce navíc vidí,
   kdo ten den slouží, a akce z Plánu jsou do kalendáře promítnuté. */
function akceOnDay(d){return AKCE.filter(a=>d>=a.day&&d<=(a.dayEnd||a.day));}
/* Události dne = kalendář školky + akce z Plánu. Stejnou akci ze dvou zdrojů (např. výlet
   předškoláků) spojíme podle názvu, ať se v kalendáři nekreslí dvakrát. */
function kalUdalosti(d,jeCerven){
  const zKal=jeCerven?(EVMAP[d]||[]):[];
  const zAkci=jeCerven?akceOnDay(d).filter(a=>!zKal.some(e=>e.t===a.name)).map(a=>({t:a.name,type:'akce',id:a.id})):[];
  return [...zKal,...zAkci];
}
function renderKalendar(){
  const dim=daysInMonth(kalY,kalM), off=firstOffset(kalY,kalM), jeCerven=(kalY===2026&&kalM===5);
  if(kalSel>dim)kalSel=1;
  let h=`<div class="doch"><div class="gcal-note">Sdílený Google Kalendář školky – vidí ho i rodiče. Akce z Plánu a služby průvodců se do něj propisují. (Simulace; v ostré verzi napojený kalendář školky.)</div>`;
  h+=`<div class="gcalwrap kal-wrap"><div class="kal-main">`;
  h+=`<div class="gcalnav"><div class="gstep"><button onclick="kalStep(-1,0)" aria-label="Předchozí měsíc">‹</button><span class="gmo">${MONTHS[kalM]}</span><button onclick="kalStep(1,0)" aria-label="Další měsíc">›</button></div><div class="gstep"><button onclick="kalStep(0,-1)" aria-label="Předchozí rok">‹</button><span class="gyr">${kalY}</span><button onclick="kalStep(0,1)" aria-label="Další rok">›</button></div></div>`;
  h+=`<div class="gcal">`;
  ['P','Ú','S','Č','P','S','N'].forEach(x=>h+=`<div class="gh">${x}</div>`);
  for(let i=0;i<off;i++)h+=`<div class="gcell gempty"></div>`;
  for(let d=1;d<=dim;d++){
    const bars=kalUdalosti(d,jeCerven).slice(0,3).map(e=>`<span class="gbar g-${e.type}"></span>`).join('');
    const we=wdLocal(kalY,kalM,d)>=5, today=jeCerven&&d===TODAYD;
    h+=`<div class="gcell${today?' gtoday':''}${d===kalSel?' gsel':''}${we?' gwe':''}" onclick="kalPick(${d})"><span class="gn">${d}</span><span class="gbars">${bars}</span></div>`;}
  h+=`</div></div><div class="kal-side">`;
  const evs=kalUdalosti(kalSel,jeCerven), we=wdLocal(kalY,kalM,kalSel)>=5;
  h+=`<div class="gday">${DOW[wdLocal(kalY,kalM,kalSel)]} ${kalSel}. ${MONTHS_G[kalM]}</div>`;
  h+= evs.length? evs.map(e=>`<div class="gev"${e.id?` style="cursor:pointer" onclick="openAkceDetail('${e.id}')"`:''}><span class="gvbar g-${e.type}"></span><span>${e.t}${e.id?' ›':''}</span><span class="gevt">${TYPELAB[e.type]}</span></div>`).join('') : `<div class="gnone">Žádná událost.</div>`;
  // rozpis služeb – to rodiče nevidí, průvodce ano
  if(jeCerven&&!we){
    const gws=shiftProDen(kalSel).filter(g=>serving(g.days[wd(kalSel)]));
    h+=`<div class="gev"><span class="gvbar g-rozvrh"></span><span>${gws.map(g=>g.n).join(', ')||'–'}</span><span class="gevt">slouží</span></div>`;
  }
  h+=`</div></div>`;
  return h+`</div>`;
}
window.kalPick=d=>{kalSel=d;render();};
window.kalStep=(dm,dy)=>{kalM+=dm;if(kalM>11){kalM=0;kalY++;}if(kalM<0){kalM=11;kalY--;}kalY+=dy;render();};
