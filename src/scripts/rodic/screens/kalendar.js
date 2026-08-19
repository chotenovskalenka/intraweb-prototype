/* SCREEN: RODIC_KALENDAR */
function renderKalendar(){
  const dim=daysInMonth(kalY,kalM), off=firstOffset(kalY,kalM), isJune=(kalY===2026&&kalM===5);
  if(kalSel>dim)kalSel=1;
  // Desktop: mřížka vlevo, vybraný den vpravo (uvnitř bílého .gcalwrap – Google vzhled zůstává).
  let h=`<div class="doch"><div class="gcal-note">Sdílený Google Kalendář školky – akce, rozvrh, narozeniny a organizace školního roku. (Simulace; v ostré verzi napojený kalendář školky.)</div>`;
  h+=`<div class="gcalwrap kal-wrap"><div class="kal-main">`;
  h+=`<div class="gcalnav"><div class="gstep"><button onclick="kalStep(-1,0)">‹</button><span class="gmo">${MONTHS[kalM]}</span><button onclick="kalStep(1,0)">›</button></div><div class="gstep"><button onclick="kalStep(0,-1)">‹</button><span class="gyr">${kalY}</span><button onclick="kalStep(0,1)">›</button></div></div>`;
  h+=`<div class="gcal">`;
  ['P','Ú','S','Č','P','S','N'].forEach(x=>h+=`<div class="gh">${x}</div>`);
  for(let i=0;i<off;i++)h+=`<div class="gcell gempty"></div>`;
  for(let d=1;d<=dim;d++){const evs=isJune?(EVMAP[d]||[]):[];
    const bars=evs.slice(0,3).map(e=>`<span class="gbar g-${e.type}"></span>`).join('');
    const we=wdLocal(kalY,kalM,d)>=5, today=isJune&&d===3;
    h+=`<div class="gcell${today?' gtoday':''}${d===kalSel?' gsel':''}${we?' gwe':''}" onclick="kalPick(${d})"><span class="gn">${d}</span><span class="gbars">${bars}</span></div>`;}
  h+=`</div></div><div class="kal-side">`;
  const sevs=isJune?(EVMAP[kalSel]||[]):[];
  h+=`<div class="gday">${DOW[wdLocal(kalY,kalM,kalSel)]} ${kalSel}. ${MONTHS_G[kalM]}</div>`;
  h+= sevs.length? sevs.map(e=>`<div class="gev"><span class="gvbar g-${e.type}"></span><span>${e.t}</span><span class="gevt">${TYPELAB[e.type]}</span></div>`).join('') : `<div class="gnone">Žádná událost.</div>`;
  h+=`</div></div>`;
  return h+`</div>`;
}
window.kalPick=d=>{kalSel=d;render();};
window.kalStep=(dm,dy)=>{kalM+=dm;if(kalM>11){kalM=0;kalY++;}if(kalM<0){kalM=11;kalY--;}kalY+=dy;render();};
