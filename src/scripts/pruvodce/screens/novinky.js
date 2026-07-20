/* SCREEN: PRUVODCE_NOVINKY — novinky pro rodiče: seznam s autorem a časem,
   detail s fotkami (modal), sdílení do WhatsApp skupiny, formulář nové novinky.
   Rodičovská appka ukazuje tytéž novinky bez autora (appky nesdílejí data — jen shodný seed). */
let novM=null;    // id novinky otevřené v detailu (modal)
let novForm=null; // rozepsaná nová novinka (modal formuláře)
function waLink(n){return 'https://wa.me/?text='+encodeURIComponent(n.t+'\n\n'+(n.full||''));}
function novExcerpt(n){const p=(n.full||n.t).split('\n')[0];return p.length>140?p.slice(0,140)+'…':p;}
function renderNovinky(){
  let h=`<div class="doch"><div class="doch-head"><h1 class="dh-t">Novinky</h1><button class="btn-primary" onclick="openNovForm()">+ Nová novinka</button></div>`;
  h+=`<div class="news-grid">`;
  NEWS.forEach(n=>{
    h+=`<div class="newscard${n.urgent?' urgent':''}" onclick="openNov('${n.id}')">`;
    if(n.img)h+=`<div class="nc-hero" style="background:${n.img}">foto</div>`;
    h+=`<div class="nc-body">${n.urgent?'<span class="newsurg">Důležité</span>':''}<div class="nc-t">${n.t}</div>`;
    h+=`<div class="newsmeta" style="margin-top:3px">${n.from} · ${n.date} · ${n.time} · platí do ${n.until}. 6.</div>`;
    h+=`<div class="nc-x">${novExcerpt(n)}</div>`;
    h+=`<div class="nc-foot nc-actions"><span>Celá novinka ›</span><a class="wabtn" href="${waLink(n)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Sdílet do WhatsAppu</a></div>`;
    h+=`</div></div>`;
  });
  h+=`</div>`;
  h+=`<div class="note2">Novinky vidí rodiče ve své appce (bez tvého jména v ostré verzi s ním). Důležité novinky nasdílej i do WhatsApp skupiny. Po datu platnosti novinka rodičům zmizí.</div>`;
  return h+`</div>`;
}
// Detail novinky (modal)
function novModalHTML(){
  const n=NEWS.find(x=>x.id===novM);if(!n)return '';
  let h=`<div class="modal-scrim" onclick="if(event.target===this)closeNov()"><div class="modal">`;
  if(n.img)h+=`<div class="nd-hero" style="background:${n.img}">foto</div>`;
  h+=`${n.urgent?'<span class="newsurg">Důležité</span>':''}<h3>${n.t}</h3>`;
  h+=`<div class="newsmeta" style="margin:2px 0 10px">${n.from} · ${n.date} · ${n.time} · platí do ${n.until}. 6.</div>`;
  h+=(n.full||'').split('\n\n').map(p=>`<p class="nd-p">${p}</p>`).join('');
  if(n.imgs&&n.imgs.length)h+=`<div class="gal" style="margin-top:10px">`+n.imgs.map(c=>`<div class="ph" style="background:${c}">foto</div>`).join('')+`</div>`;
  h+=`<div class="mbtns"><button class="btn-ghost" onclick="closeNov()">Zavřít</button><a class="btn-primary" style="text-decoration:none;text-align:center" href="${waLink(n)}" target="_blank" rel="noopener">Sdílet do WhatsAppu</a></div>`;
  return h+`</div></div>`;
}
// Nová novinka (modal formuláře)
function novFormHTML(){
  const f=novForm;
  return `<div class="modal-scrim" onclick="if(event.target===this)closeNovForm()"><div class="modal">
    <h3>Nová novinka</h3>
    <label class="pl">Titulek</label><input class="pin" value="${esc(f.t)}" oninput="setNovF('t',this.value)" placeholder="krátký titulek pro rodiče…">
    <label class="pl">Text</label><textarea class="note" style="min-height:96px" oninput="setNovF('full',this.value)" placeholder="napiš, co mají rodiče vědět…">${escTa(f.full)}</textarea>
    <label class="pl">Platí do</label><input class="pin" type="date" min="2026-06-03" max="2026-06-30" value="${d2date(f.until)}" oninput="setNovUntil(this.value)">
    <div class="pchips" style="margin-top:9px"><button class="${f.urgent?'on':''}" onclick="toggleNovUrg()">Důležité</button></div>
    <label class="pl">Úvodní fotka</label><input type="file" accept="image/*" onchange="setNovImg(this)">${f.img?' <span style="font-size:12px;color:var(--color-primary);font-weight:600">přidána ✓</span>':''}
    <div class="mbtns"><button class="btn-ghost" onclick="closeNovForm()">Zrušit</button><button class="btn-primary" onclick="saveNov()">Odeslat rodičům</button></div>
  </div></div>`;
}
window.openNov=id=>{novM=id;renderModalRoot();};
window.closeNov=()=>{novM=null;renderModalRoot();};
window.openNovForm=()=>{novForm={t:'',full:'',until:30,urgent:false,img:null};renderModalRoot();};
window.closeNovForm=()=>{novForm=null;renderModalRoot();};
window.setNovF=(k,v)=>{novForm[k]=v;};
window.setNovUntil=v=>{novForm.until=v?+v.split('-')[2]:30;};
window.toggleNovUrg=()=>{novForm.urgent=!novForm.urgent;renderModalRoot();};
window.setNovImg=inp=>{if(inp.files&&inp.files[0]){novForm.img='#E7E0CE';renderModalRoot();showToast('Fotka přidána ✓');}};
window.saveNov=()=>{const f=novForm;
  if(!f.t.trim()&&!f.full.trim()){showToast('Napiš text novinky');return;}
  NEWS.unshift({id:'nw'+Date.now(),t:f.t.trim()||f.full.trim().split('\n')[0].slice(0,80),full:f.full.trim()||f.t.trim(),
    from:'Táňa',time:'10:00',date:'3. 6.',until:f.until||30,urgent:f.urgent,img:f.img||null,imgs:f.img?[f.img]:null});
  novForm=null;renderModalRoot();render();showToast('Novinka odeslána rodičům ✓');};
