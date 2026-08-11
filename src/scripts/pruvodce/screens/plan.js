/* SCREEN: PRUVODCE_PLAN */
let rytLoni=false;  // náhled loňského rytmu (k převzetí)
let akceLoni=false; // náhled loňských akcí (inspirace při plánování)
function renderPlan(){
  // „+ Nová akce" je v topbaru (viz core.js) – konzistentně s Novinkami
  let h=`<div class="vhead">Akce a výjimky · červen</div>`;
  const sorted=[...AKCE].sort((a,b)=>a.day-b.day);
  h+= sorted.length? sorted.map(akceCard).join('') : `<div class="empty">Zatím žádné akce.</div>`;
  // Loňské akce – inspirace: klik předvyplní novou akci, datum se doladí v modalu
  h+=`<button class="addbtn" onclick="togAkceLoni()">${akceLoni?'Skrýt loňské akce':'Zobrazit loňské akce (červen 2025)'}</button>`;
  if(akceLoni){h+=`<div class="tile"><div class="tlab">Loňské akce · červen 2025</div><div class="note2" style="margin:0 0 9px">Klepni na akci a založíš letošní s předvyplněnými údaji – zbyde doladit datum.</div>`;
    h+=AKCE_LONI.map((a,i)=>{const m=[a.time,a.place,a.paid?`${a.paid} Kč/dítě`:'',a.note].filter(Boolean).join(' · ');
      return `<button class="acard" onclick="akceFromLoni(${i})"><span class="adate">${a.dayEnd?`${a.day}.–${a.dayEnd}. 6.`:`${a.day}. 6.`}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span><span class="aplus">+</span></button>`;}).join('');
    h+=`</div>`;}
  h+=`<div class="vhead">Týdenní rytmus</div>`;
  RYTMUS.forEach((r,i)=>{const opened=rytOpen===i;
    h+=`<div class="prow${opened?' open':''}"><div class="pmain" onclick="rytTog(${i})"><span class="pd">${DOW[r.d]}</span><span class="pp">${r.prog}</span></div>`;
    if(!opened&&r.krouzek)h+=`<div class="psub">Kroužek: ${r.krouzek}</div>`;
    if(opened){h+=`<div class="pedit"><label class="pl">Program</label><div class="pchips">`+PROGOPTS.map(o=>`<button class="${r.prog===o?'on':''}" onclick="setRyt(${i},'${o}')">${o}</button>`).join('')+`</div><input class="pin" style="margin-top:7px" value="${esc(r.prog)}" oninput="setRytRaw(${i},this.value)"><label class="pl">Kroužek</label><input class="pin" value="${esc(r.krouzek)}" oninput="setRytKr(${i},this.value)" placeholder="nepovinné"><button class="btn-primary btn-block" style="margin-top:var(--space-md)" onclick="rytSave(${i})">Uložit</button></div>`;}
    h+=`</div>`;
  });
  // Loňský rytmus – průvodci ho často přebírají do nového roku
  h+=`<button class="addbtn" onclick="togRytLoni()">${rytLoni?'Skrýt loňský rytmus':'Zobrazit loňský rytmus (2024/25)'}</button>`;
  if(rytLoni){h+=`<div class="tile"><div class="tlab">Loňský týdenní rytmus (2024/25)</div>`;
    RYTMUS_LONI.forEach(r=>{h+=`<div class="np"><span><b>${DOW[r.d]}</b> · ${r.prog}</span>${r.krouzek?`<span style="color:var(--color-accent-ink)">${r.krouzek}</span>`:'<span style="color:var(--color-text-hint)">–</span>'}</div>`;});
    h+=`<button class="btn-primary btn-block" style="margin-top:var(--space-md)" onclick="rytAdopt()">Převzít loňský rytmus</button></div>`;}
  h+=`<div class="vhead">Tématický plán</div>`+temaBlock();
  return h;
}
function akceCard(a){
  const m=[a.time,a.place,a.paid?`${a.paid} Kč/dítě`:'',a.note].filter(Boolean).join(' · ');
  return `<button class="acard" onclick="openAkce('${a.id}')"><span class="adate">${dayLbl(a)}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span></button>`;
}
// Ordered periods, newest first: aktuální červen 2026 (editovatelný) + archiv zpět do loňska.
function temaPeriods(){return [{key:'cerven',label:'Červen 2026'},...TEMA_ARCHIV.map(a=>({key:a.key,label:a.label}))];}
function temaNav(){
  const ps=temaPeriods(),i=Math.max(0,ps.findIndex(p=>p.key===temaMonth)),cur=ps[i];
  // stepper ‹ starší · novější › – prochází archiv tématických plánů zpět v čase
  return `<div class="dfield" style="margin-bottom:12px"><div class="dnav"><button onclick="temaStep(1)" ${i>=ps.length-1?'disabled':''} aria-label="Starší plán">‹</button><span>${cur.label}${i===0?' · aktuální':''}</span><button onclick="temaStep(-1)" ${i<=0?'disabled':''} aria-label="Novější plán">›</button></div></div>`;
}
function temaBlock(){
  if(temaMonth!=='cerven'){
    // archiv = jen ke čtení + převzetí do června
    const a=TEMA_ARCHIV.find(x=>x.key===temaMonth);if(!a)return temaNav();
    let h=temaNav();
    h+=`<div class="tile"><div class="tlab">Hodnota měsíce</div><div class="tval">${a.hodnota}</div></div>`;
    a.tydny.forEach((w,i)=>{h+=`<div class="tile"><div class="tlab">${i+1}. týden</div>`+(w.b?`<div class="np"><span style="color:var(--color-text-muted)">Básnička</span></div><div class="tval">${w.b}</div>`:'')+(w.p?`<div class="np" style="margin-top:6px"><span style="color:var(--color-text-muted)">Písnička</span></div><div class="tval">${w.p}</div>`:'')+((!w.b&&!w.p)?`<div class="note2" style="margin:0">–</div>`:'')+`</div>`;});
    h+=`<button class="btn-primary btn-block" onclick="temaAdopt('${a.key}')">Převzít tento plán do června 2026</button>`;
    return h;
  }
  let h=temaNav();
  h+=`<div class="tile"><div class="tlab">Tématický plán v designu</div><div class="note2" style="margin:0 0 9px">Aktuální plán vyvěšený ve školce (tiskne se na nástěnku):</div>`+
    TEMA_POSTERS.map((p,i)=>`<button class="poster-btn" onclick="openPoster(${i})" aria-label="Zvětšit plakát"><img class="tema-poster" src="${p}" alt="Tématický plán červen" loading="lazy"><span class="poster-zoom">⤢</span></button>`).join('')+
    `<label class="addbtn" style="display:block;text-align:center;margin-top:9px">+ Nahrát nový plán (PDF/JPG/PNG)<input type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="setTemaFile(this)"></label></div>`;
  h+=`<div class="tile"><label class="pl">Hodnota měsíce</label><input class="pin" value="${esc(TEMA.hodnota)}" oninput="setTemaH(this.value)" placeholder="např. nadšení"></div>`;
  TEMA.tydny.forEach((w,i)=>{h+=`<div class="tile"><div class="tlab">${i+1}. týden</div><label class="pl">Básnička</label><textarea class="pta" oninput="setTemaB(${i},this.value)" placeholder="text básničky…">${escTa(w.b)}</textarea><label class="pl">Odkaz (básnička)</label><input class="pin" value="${esc(w.byt||'')}" oninput="setTemaByt(${i},this.value)" placeholder="https://…"><label class="pl">Písnička</label><textarea class="pta" oninput="setTemaP(${i},this.value)" placeholder="text písničky…">${escTa(w.p)}</textarea><label class="pl">Odkaz (písnička)</label><input class="pin" value="${esc(w.yt)}" oninput="setTemaYt(${i},this.value)" placeholder="https://youtu.be/…"></div>`;});
  h+=`<button class="btn-primary btn-block" onclick="showToast('Tématický plán uložen ✓')">Uložit tématický plán</button>`;
  return h;
}
window.rytTog=i=>{rytOpen=rytOpen===i?-1:i;render();};
window.setRyt=(i,v)=>{RYTMUS[i].prog=v;showToast('Uloženo ✓');render();};
window.setRytRaw=(i,v)=>{RYTMUS[i].prog=v;};
window.setRytKr=(i,v)=>{RYTMUS[i].krouzek=v;};
window.setTemaH=v=>{TEMA.hodnota=v;};
window.setTemaB=(i,v)=>{TEMA.tydny[i].b=v;};
window.setTemaP=(i,v)=>{TEMA.tydny[i].p=v;};
window.setTemaYt=(i,v)=>{TEMA.tydny[i].yt=v;};
window.setTemaByt=(i,v)=>{TEMA.tydny[i].byt=v;};
window.temaStep=dir=>{const ps=temaPeriods();let i=ps.findIndex(p=>p.key===temaMonth);i=Math.min(ps.length-1,Math.max(0,i+dir));temaMonth=ps[i].key;render();};
window.temaAdopt=key=>{const a=TEMA_ARCHIV.find(x=>x.key===key);if(!a)return;TEMA.hodnota=a.hodnota;TEMA.tydny=a.tydny.map(w=>({b:w.b||'',byt:w.byt||'',p:w.p||'',yt:w.yt||''}));temaMonth='cerven';render();showToast('Plán převzat do června 2026 ✓');};
window.togAkceLoni=()=>{akceLoni=!akceLoni;render();};
// Loňská akce → nová letošní: převezme vše kromě data (id:null ⇒ uložením vznikne nová akce).
window.akceFromLoni=i=>{const a=AKCE_LONI[i];if(!a)return;
  modal={id:null,name:a.name,day:a.day,dayEnd:a.dayEnd||'',time:a.time||'',place:a.place||'',note:a.note||'',paid:a.paid||''};
  renderModalRoot();};
window.togRytLoni=()=>{rytLoni=!rytLoni;render();};
window.rytAdopt=()=>{RYTMUS=RYTMUS_LONI.map(r=>({d:r.d,prog:r.prog,krouzek:r.krouzek}));rytLoni=false;render();showToast('Loňský rytmus převzat ✓');};
window.setTemaFile=inp=>{const f=inp.files&&inp.files[0];if(f){TEMA.file=f.name;render();showToast('Nahráno ✓');}};
window.rytSave=i=>{rytOpen=-1;render();showToast('Uloženo ✓');};
