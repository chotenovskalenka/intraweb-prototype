/* SCREEN: PRUVODCE_KALENDAR */
function renderKalendar(){
  let h=`<div class="tile note-info">Přehled celého měsíce — propíšou se sem <b>akce</b> z Plánu i <b>služby průvodců</b>.</div>`;
  h+=`<div class="vhead">Červen 2026</div><div class="cal">`;
  DOW.forEach(x=>h+=`<div class="calh">${x}</div>`);
  for(let d=1;d<=30;d++){const we=isWE(d),ev=akceOnDay(d).length,today=d===3,sel=d===kalSel;
    h+=`<div class="calcell${we?' we':''}${today?' today':''}${sel?' sel':''}" onclick="kalPick(${d})"><span class="cnum">${d}</span>${ev?'<span class="cdot"></span>':''}</div>`;}
  h+=`</div>`;
  const evs=akceOnDay(kalSel), gws=isWE(kalSel)?[]:GUIDESHIFT.filter(g=>serving(g.days[wd(kalSel)]));
  h+=`<div class="tile" style="margin-top:12px"><div class="tlab">${DOW[wd(kalSel)]} ${kalSel}. června</div>`;
  if(evs.length)h+=evs.map(a=>`<div class="np" style="cursor:pointer" onclick="openAkceDetail('${a.id}')"><span>${a.name} <span style="color:var(--color-text-hint)">›</span></span><b style="font-weight:500;color:var(--color-accent)">${a.time||(a.place||'akce')}</b></div>`).join('');
  else if(!isWE(kalSel))h+=`<div class="np"><span>Program</span><b>${RYTMUS[wd(kalSel)].prog}</b></div>`;
  else h+=`<div class="empty" style="padding:8px 0">Víkend — školka nemá.</div>`;
  if(!isWE(kalSel))h+=`<div class="np" style="border-top:1px solid var(--color-border);margin-top:4px;padding-top:8px"><span>Slouží</span><b style="font-weight:500">${gws.map(g=>g.n).join(', ')||'—'}</b></div>`;
  h+=`</div>`;
  return h;
}
function akceOnDay(d){return AKCE.filter(a=>d>=a.day&&d<=(a.dayEnd||a.day));}
window.kalPick=d=>{kalSel=d;render();};
