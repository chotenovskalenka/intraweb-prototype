/* SCREEN: PRUVODCE_PRUVODCI */
function startMin(d){return serving(d)?(+d.s.split(':')[0])*60+(+d.s.split(':')[1]):9999;}
function shiftCell(d){
  if(!d)return '<span class="wc e">·</span>';
  if(d.off)return `<span class="bdg al" style="font-size:9px">${d.off}</span>`;
  return `<div style="line-height:1.25"><div style="color:var(--color-primary);font-weight:600;font-size:10.5px">${fmt(d.s)}</div><div style="color:var(--color-text-muted);font-size:10px">${fmt(d.e)}</div></div>`;
}
function renderPruvodci(){
  const todays=GUIDESHIFT.map((g,i)=>({g,i})).filter(x=>serving(x.g.days[TODAY]));
  const opener=todays.slice().sort((a,b)=>startMin(a.g.days[TODAY])-startMin(b.g.days[TODAY]))[0];
  if(todays.length&&!todays.some(x=>x.i===uspavaToday))uspavaToday=todays[0].i;
  let h='';
  h+=`<div class="tile"><div class="ch">Dnes ve školce · středa</div>`;
  h+= todays.length? todays.map(x=>{const d=x.g.days[TODAY];return `<div class="np"><span>${x.g.n}${opener&&x.i===opener.i?' · <b style="color:var(--color-primary)">otevírá</b>':''}</span><b>${fmt(d.s)}–${fmt(d.e)}</b></div>`;}).join('') : '<div class="empty">Dnes nikdo nemá službu.</div>';
  if(todays.length)h+=`<div class="np" style="border-top:1px solid var(--color-border);margin-top:6px;padding-top:9px"><span>Dnes uspává</span><select class="selin" onchange="setUspava(this.value)">`+todays.map(x=>`<option value="${x.i}" ${x.i===uspavaToday?'selected':''}>${x.g.n}</option>`).join('')+`</select></div>`;
  h+=`</div>`;
  h+=`<div class="vhead">Týden · služby</div>`;
  // wt-sm = tabulka s krátkými jmény → na mobilu užší první sloupec, aby buňky měly 44 px
  h+=`<div class="weekbox"><table class="wt wt-sm"><thead><tr><th class="who">Průvodce</th>`+DAYS.map((d,j)=>`<th class="${j===TODAY?'today':''}">${d}</th>`).join('')+`</tr></thead><tbody>`;
  GUIDESHIFT.forEach((g,gi)=>{h+=`<tr><td class="who">${g.n}</td>`+g.days.map((d,di)=>`<td class="ced${di===TODAY?' today':''}" onclick="openShift(${gi},${di})">${shiftCell(d)}</td>`).join('')+`</tr>`;});
  h+=`</tbody></table></div><div class="hint">Klepni na buňku a uprav službu (příchod, odchod, nebo nepřítomnost).</div>`;
  return h;
}
window.setUspava=v=>{uspavaToday=Number(v);};
