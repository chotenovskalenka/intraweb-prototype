/* SCREEN: PRUVODCE_PRIPRAVA – pedagogická příprava: týdenní rytmus (rámec dne v týdnu)
   + tématický plán (obsah měsíce: hodnota, básničky, písničky, plakát).
   Obojí odpovídá na tutéž otázku „co s dětmi děláme", proto jedna obrazovka. Rytmus je
   jen 5 řádků a mění se jednou za rok – vlastní položka v navigaci by byla neúměrná.
   Slovo „příprava" používá sám tým („přípravy pedagogický"). */
/* Editace celého týdne najednou: rozvrh se přepne do polí a průvodce přepisuje dny za sebou,
   aniž by musel otevírat pět dialogů. Rozepsané hodnoty drží rytDraft, do RYTMUS se zapíšou
   až Uložit – proto oninput jen plní draft a nevolá render() (jinak by utekl kurzor). */
let rytEdit=false, rytDraft=null;

function renderPriprava(){
  // Rytmus je jeden týden – na desktopu se vysazuje z masonry (.ryt-sec) a kreslí jako
  // rozvrh: 5 dnů vedle sebe. Na mobilu zůstává stoh řádků pod sebou (viz screens-pruvodce.css).
  // akce sekce sedí vpravo vedle nadpisu a nestěhují se mezi režimy (viz .vhead-row)
  const akce=rytEdit
    ? `<button class="btn-ghost" onclick="rytCancel()">Zrušit</button><button class="btn-primary" onclick="rytSaveAll()">Uložit</button>`
    : `<button class="btn-ghost" onclick="rytEditOn()">Upravit rozvrh</button>`;
  let h=`<div class="ryt-sec"><div class="vhead-row"><div class="vhead">Týdenní rytmus</div><div class="vhead-act">${akce}</div></div>`;
  h+=`<div class="ryt${rytEdit?' ryt-edit':''}">`;
  RYTMUS.forEach((r,i)=>{
    if(rytEdit){
      const d=rytDraft[i];
      h+=`<div class="prow"><div class="pmain"><span class="pd">${DOW[r.d]}</span></div><div class="pfields">`+
        `<input class="pin" list="progopts" value="${esc(d.prog)}" oninput="setRytD(${i},'prog',this.value)" placeholder="program" aria-label="Program – ${DOW[r.d]}">`+
        `<input class="pin" value="${esc(d.krouzek)}" oninput="setRytD(${i},'krouzek',this.value)" placeholder="kroužek" aria-label="Kroužek – ${DOW[r.d]}">`+
        `</div></div>`;
    } else {
      h+=`<div class="prow"><div class="pmain"><span class="pd">${DOW[r.d]}</span><span class="pp">${r.prog}</span></div>`;
      if(r.krouzek)h+=`<div class="psub">Kroužek: ${r.krouzek}</div>`;
      h+=`</div>`;
    }
  });
  h+=`</div>`;
  // nabídka programů pro pole – datalist necháva napsat i vlastní text
  if(rytEdit)h+=`<datalist id="progopts">${PROGOPTS.map(o=>`<option value="${esc(o)}">`).join('')}</datalist>`;
  h+=`</div>`;
  h+=`<div class="vhead">Tématický plán</div>`+temaBlock();
  return h;
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
    h+=`<div class="tile"><div class="ch">Hodnota měsíce</div><div class="tval">${a.hodnota}</div></div>`;
    a.tydny.forEach((w,i)=>{h+=`<div class="tile"><div class="ch">${i+1}. týden</div>`+(w.b?`<div class="np"><span style="color:var(--color-text-muted)">Básnička</span></div><div class="tval">${w.b}</div>`:'')+(w.p?`<div class="np" style="margin-top:6px"><span style="color:var(--color-text-muted)">Písnička</span></div><div class="tval">${w.p}</div>`:'')+((!w.b&&!w.p)?`<div class="note2">–</div>`:'')+`</div>`;});
    h+=`<button class="btn-primary btn-block" onclick="temaAdopt('${a.key}')">Převzít tento plán do června 2026</button>`;
    return h;
  }
  let h=temaNav();
  h+=`<div class="tile"><div class="ch">Tématický plán v designu</div><div class="note2">Aktuální plán vyvěšený ve školce (tiskne se na nástěnku):</div>`+
    TEMA_POSTERS.map((p,i)=>`<button class="poster-btn" onclick="openPoster(${i})" aria-label="Zvětšit plakát"><img class="tema-poster" src="${p}" alt="Tématický plán červen" loading="lazy"><span class="poster-zoom">⤢</span></button>`).join('')+
    `<label class="addbtn" style="display:block;text-align:center;margin-top:9px">+ Nahrát nový plán (PDF/JPG/PNG)<input type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="setTemaFile(this)"></label></div>`;
  h+=`<div class="tile"><label class="pl">Hodnota měsíce</label><input class="pin" value="${esc(TEMA.hodnota)}" oninput="setTemaH(this.value)" placeholder="např. nadšení"></div>`;
  TEMA.tydny.forEach((w,i)=>{h+=`<div class="tile"><div class="ch">${i+1}. týden</div><label class="pl">Básnička</label><textarea class="pta" oninput="setTemaB(${i},this.value)" placeholder="text básničky…">${escTa(w.b)}</textarea><label class="pl">Odkaz (básnička)</label><input class="pin" value="${esc(w.byt||'')}" oninput="setTemaByt(${i},this.value)" placeholder="https://…"><label class="pl">Písnička</label><textarea class="pta" oninput="setTemaP(${i},this.value)" placeholder="text písničky…">${escTa(w.p)}</textarea><label class="pl">Odkaz (písnička)</label><input class="pin" value="${esc(w.yt)}" oninput="setTemaYt(${i},this.value)" placeholder="https://youtu.be/…"></div>`;});
  h+=`<button class="btn-primary btn-block" onclick="showToast('Tématický plán uložen ✓')">Uložit tématický plán</button>`;
  return h;
}
window.rytEditOn=()=>{rytDraft=RYTMUS.map(r=>({prog:r.prog,krouzek:r.krouzek}));rytEdit=true;render();};
window.rytCancel=()=>{rytEdit=false;rytDraft=null;render();};
window.setRytD=(i,f,v)=>{rytDraft[i][f]=v;};   // bez render() – kurzor v poli musí zůstat
window.rytSaveAll=()=>{RYTMUS.forEach((r,i)=>{r.prog=rytDraft[i].prog.trim();r.krouzek=rytDraft[i].krouzek.trim();});rytEdit=false;rytDraft=null;render();showToast('Rozvrh uložen ✓');};
window.setTemaH=v=>{TEMA.hodnota=v;};
window.setTemaB=(i,v)=>{TEMA.tydny[i].b=v;};
window.setTemaP=(i,v)=>{TEMA.tydny[i].p=v;};
window.setTemaYt=(i,v)=>{TEMA.tydny[i].yt=v;};
window.setTemaByt=(i,v)=>{TEMA.tydny[i].byt=v;};
window.setTemaFile=inp=>{const f=inp.files&&inp.files[0];if(f){TEMA.file=f.name;render();showToast('Nahráno ✓');}};
window.temaStep=dir=>{const ps=temaPeriods();let i=ps.findIndex(p=>p.key===temaMonth);i=Math.min(ps.length-1,Math.max(0,i+dir));temaMonth=ps[i].key;render();};
window.temaAdopt=key=>{const a=TEMA_ARCHIV.find(x=>x.key===key);if(!a)return;TEMA.hodnota=a.hodnota;TEMA.tydny=a.tydny.map(w=>({b:w.b||'',byt:w.byt||'',p:w.p||'',yt:w.yt||''}));temaMonth='cerven';render();showToast('Plán převzat do června 2026 ✓');};
