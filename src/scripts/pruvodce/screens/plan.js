/* SCREEN: PRUVODCE_PLAN */
function renderPlan(){
  let h=`<div class="vhead">Akce a výjimky · červen</div>`;
  h+=`<button class="addbig" onclick="openAkce(null)">+ Vytvořit novou akci</button>`;
  const sorted=[...AKCE].sort((a,b)=>a.day-b.day);
  h+= sorted.length? sorted.map(akceCard).join('') : `<div class="empty">Zatím žádné akce.</div>`;
  h+=`<div class="vhead" style="margin-top:18px">Týdenní rytmus</div>`;
  RYTMUS.forEach((r,i)=>{const opened=rytOpen===i;
    h+=`<div class="prow${opened?' open':''}"><div class="pmain" onclick="rytTog(${i})"><span class="pd">${DOW[r.d]}</span><span class="pp">${r.prog}</span></div>`;
    if(!opened&&r.krouzek)h+=`<div class="psub">Kroužek: ${r.krouzek}</div>`;
    if(opened){h+=`<div class="pedit"><label class="pl">Program</label><div class="pchips">`+PROGOPTS.map(o=>`<button class="${r.prog===o?'on':''}" onclick="setRyt(${i},'${o}')">${o}</button>`).join('')+`</div><input class="pin" style="margin-top:7px" value="${esc(r.prog)}" oninput="setRytRaw(${i},this.value)"><label class="pl">Kroužek</label><input class="pin" value="${esc(r.krouzek)}" oninput="setRytKr(${i},this.value)" placeholder="nepovinné"><button class="btn-primary" style="width:100%;margin-top:11px" onclick="rytSave(${i})">Uložit</button></div>`;}
    h+=`</div>`;
  });
  h+=`<div class="vhead" style="margin-top:18px">Tématický plán</div>`+temaBlock();
  return h;
}
function akceCard(a){
  const m=[a.time,a.place,a.paid?`${a.paid} Kč/dítě`:'',a.note].filter(Boolean).join(' · ');
  return `<button class="acard" onclick="openAkce('${a.id}')"><span class="adate">${dayLbl(a)}</span><span style="flex:1"><span class="aname">${a.name}</span>${m?`<div class="ameta">${m}</div>`:''}</span></button>`;
}
function temaBlock(){
  if(temaMonth==='kveten'){
    let h=`<div class="temanav"><button class="on" onclick="temaShow('kveten')">Květen</button><button onclick="temaShow('cerven')">Červen</button></div>`;
    h+=`<div class="tile"><div class="tlab">Hodnota měsíce</div><div class="tval">${TEMA_KVETEN.hodnota}</div></div>`;
    TEMA_KVETEN.tydny.forEach((w,i)=>{h+=`<div class="tile"><div class="tlab">${i+1}. týden</div>`+(w.b?`<div class="np"><span style="color:var(--color-text-muted)">Básnička</span></div><div class="tval">${w.b}</div>`:'')+(w.p?`<div class="np" style="margin-top:6px"><span style="color:var(--color-text-muted)">Písnička</span></div><div class="tval">${w.p}</div>`:'')+((!w.b&&!w.p)?`<div class="note2" style="margin:0">—</div>`:'')+`</div>`;});
    h+=`<button class="btn-primary" style="width:100%" onclick="temaCopy()">Zkopírovat květen do června</button>`;
    return h;
  }
  let h=`<div class="temanav"><button onclick="temaShow('kveten')">Květen</button><button class="on" onclick="temaShow('cerven')">Červen</button></div>`;
  h+=`<div class="tile"><div class="tlab">Tématický plán v designu</div><div class="note2" style="margin:0 0 9px">Aktuální plán vyvěšený ve školce (tiskne se na nástěnku):</div>`+
    TEMA_POSTERS.map(p=>`<img class="tema-poster" src="${p}" alt="Tématický plán červen" loading="lazy">`).join('')+
    `<label class="addbtn" style="display:block;text-align:center;margin-top:9px">+ Nahrát nový plán (PDF/JPG/PNG)<input type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="setTemaFile(this)"></label></div>`;
  h+=`<div class="tile"><label class="pl">Hodnota měsíce</label><input class="pin" value="${esc(TEMA.hodnota)}" oninput="setTemaH(this.value)" placeholder="např. nadšení"></div>`;
  TEMA.tydny.forEach((w,i)=>{h+=`<div class="tile"><div class="tlab">${i+1}. týden</div><label class="pl">Básnička</label><textarea class="pta" oninput="setTemaB(${i},this.value)" placeholder="text básničky…">${escTa(w.b)}</textarea><label class="pl">Odkaz (básnička)</label><input class="pin" value="${esc(w.byt||'')}" oninput="setTemaByt(${i},this.value)" placeholder="https://…"><label class="pl">Písnička</label><textarea class="pta" oninput="setTemaP(${i},this.value)" placeholder="text písničky…">${escTa(w.p)}</textarea><label class="pl">Odkaz (písnička)</label><input class="pin" value="${esc(w.yt)}" oninput="setTemaYt(${i},this.value)" placeholder="https://youtu.be/…"></div>`;});
  h+=`<button class="btn-primary" style="width:100%" onclick="showToast('Tématický plán uložen ✓')">Uložit tématický plán</button>`;
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
window.temaShow=m=>{temaMonth=m;render();};
window.temaCopy=()=>{TEMA.hodnota=TEMA_KVETEN.hodnota;TEMA.tydny=TEMA_KVETEN.tydny.map(w=>({...w}));temaMonth='cerven';render();showToast('Květen zkopírován do června ✓');};
window.setTemaFile=inp=>{const f=inp.files&&inp.files[0];if(f){TEMA.file=f.name;render();showToast('Nahráno ✓');}};
window.rytSave=i=>{rytOpen=-1;render();showToast('Uloženo ✓');};
