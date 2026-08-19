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
  h+=`<div class="tema-sec"><div class="vhead-row"><div class="vhead">Tématický plán</div><div class="vhead-act">${temaLoniBtn()}${temaNav()}</div></div>`+temaBlock()+`</div>`;
  return h;
}
/* Období tématického plánu, od nejnovějšího: připravované měsíce příštího školního roku,
   běžící červen 2026 a archiv zpět. Budoucí měsíce jsou prázdné a editovatelné stejně jako
   běžící; minulé jen ke čtení. */
function temaPeriods(){
  const cap=x=>x.charAt(0).toUpperCase()+x.slice(1);
  const budouci=TEMA_ROK.map(([m,y])=>({key:temaKey(m,y),label:cap(MONTHS[m-1])+' '+y,stav:'priprava'})).reverse();
  return [...budouci,{key:'cerven',label:'Červen 2026',stav:'bezi'},
    ...TEMA_ARCHIV.map(a=>({key:a.key,label:a.label,stav:'archiv'}))];
}
function temaObdobi(){const ps=temaPeriods();return ps[Math.max(0,ps.findIndex(p=>p.key===temaMonth))];}
/* Měsíc a rok období. Běžící červen 2026 má historický klíč 'cerven', ostatní 'RRRR-MM'. */
function temaMY(o){return o.key==='cerven'?{m:6,y:2026}:{m:Number(o.key.slice(5)),y:Number(o.key.slice(0,4))};}
/* Tentýž měsíc o rok dřív / později. Plány se přebírají po měsících – „loňské září bude
   plus minus podobné" – ne do jednoho pevného cíle. Vrací období, nebo null. */
function temaSousedniRok(o,posun){
  const {m,y}=temaMY(o),cil=temaKey(m,y+posun);
  return temaPeriods().find(p=>p.key===cil||(cil==='2026-06'&&p.key==='cerven'))||null;
}
// plán vybraného období; připravovaný měsíc vznikne prázdný až tady, při prvním otevření
function temaPlan(o){
  o=o||temaObdobi();
  if(o.stav==='bezi')return TEMA;
  if(o.stav==='archiv')return TEMA_ARCHIV.find(a=>a.key===o.key)||prazdnyPlan();
  return TEMA_PRIPRAVA[o.key]||(TEMA_PRIPRAVA[o.key]=prazdnyPlan());
}
/* „Převzít loňský plán" u připravovaného měsíce – v řádku s nadpisem, vlevo od stepperu,
   aby stepper zůstal ukotvený vpravo a neposkakoval podle toho, jestli je tlačítko vidět.
   Mizí, jakmile má měsíc vlastní obsah. */
function temaLoniBtn(){
  const o=temaObdobi();
  if(o.stav!=='priprava')return '';
  const t=temaPlan(o),loni=temaSousedniRok(o,-1);
  if(!loni||t.hodnota||t.intro||t.tydny.some(w=>w.b||w.p))return '';
  return `<button class="btn-ghost" onclick="temaAdopt('${loni.key}','${o.key}')" title="Převezme plán z období ${loni.label}">Převzít loňský plán</button>`;
}
function temaNav(){
  const ps=temaPeriods(),i=Math.max(0,ps.findIndex(p=>p.key===temaMonth)),cur=ps[i];
  // stepper ‹ starší · novější › – prochází připravované měsíce dopředu i archiv zpět
  return `<div class="dnav"><button onclick="temaStep(1)" ${i>=ps.length-1?'disabled':''} aria-label="Starší plán">‹</button><span>${cur.label}${cur.stav==='bezi'?'<i class="dn-cur"> · aktuální</i>':''}</span><button onclick="temaStep(-1)" ${i<=0?'disabled':''} aria-label="Novější plán">›</button></div>`;
}
/* Jedna struktura pro všechny tři stavy: vlevo text (téma + týdny), vpravo plakát.
   Pravý sloupec zůstává i bez plakátu – rozložení se nesmí měnit podle toho, jestli je
   nahraný rastr. Minulé měsíce jsou jen ke čtení, běžící i připravované se editují. */
function temaBlock(){
  const o=temaObdobi(),t=temaPlan(),ro=o.stav==='archiv',plakaty=o.stav==='bezi'?TEMA_POSTERS:[];
  let h=`<div class="tema-cols"><div class="tema-plakat"><div class="tile"><div class="ch">Tématický plán v designu</div>`;
  if(plakaty.length){
    h+=`<div class="note2">Aktuální plán vyvěšený ve školce (tiskne se na nástěnku):</div>`+
      plakaty.map((p,i)=>`<button class="poster-btn" onclick="openPoster(${i})" aria-label="Zvětšit plakát"><img class="tema-poster" src="${p}" alt="Tématický plán ${o.label}" loading="lazy"><span class="poster-zoom">⤢</span></button>`).join('');
  } else {
    h+=`<div class="empty" style="margin:0">Pro ${o.label.toLowerCase()} zatím není nahraný plakát na nástěnku.</div>`;
  }
  if(!ro)h+=`<label class="addbtn" style="display:block;text-align:center;margin-top:9px">+ Nahrát ${plakaty.length?'nový ':''}plán (PDF/JPG/PNG)<input type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="setTemaFile(this)"></label>`;
  h+=`</div></div><div class="tema-text">`;
  // téma měsíce
  h+=`<div class="tile"><div class="ch">Téma měsíce</div>`;
  if(ro){
    h+=`<div class="tlab">Hodnota měsíce</div><div class="tval">${t.hodnota||'–'}</div>`+(t.intro?`<div class="tval" style="margin-top:8px">${t.intro}</div>`:'');
  }else{
    h+=`<label class="pl">Hodnota měsíce</label><input class="pin" value="${esc(t.hodnota)}" oninput="setTemaH(this.value)" placeholder="např. nadšení">`+
      `<label class="pl">Text pro rodiče</label><textarea class="pta" oninput="setTemaIntro(this.value)" placeholder="čím měsíc žijeme – pár vět…">${escTa(t.intro||'')}</textarea>`+
      `<div class="note2">Tenhle text vidí rodiče ve své appce u tématu měsíce.</div>`;
  }
  h+=`</div>`;
  // týdny
  t.tydny.forEach((w,i)=>{
    h+=`<div class="tile"><div class="ch">${i+1}. týden</div>`;
    if(ro){
      h+=(w.b?`<div class="tlab">Básnička</div><div class="tval">${w.b}</div>`:'')+
         (w.p?`<div class="tlab" style="margin-top:8px">Písnička</div><div class="tval">${w.p}</div>`:'')+
         ((!w.b&&!w.p)?`<div class="note2">–</div>`:'');
    }else{
      h+=`<label class="pl">Básnička</label><textarea class="pta" oninput="setTemaB(${i},this.value)" placeholder="text básničky…">${escTa(w.b)}</textarea>`+
        `<label class="pl">Odkaz (básnička)</label><input class="pin" value="${esc(w.byt||'')}" oninput="setTemaByt(${i},this.value)" placeholder="https://…">`+
        `<label class="pl">Písnička</label><textarea class="pta" oninput="setTemaP(${i},this.value)" placeholder="text písničky…">${escTa(w.p)}</textarea>`+
        `<label class="pl">Odkaz (písnička)</label><input class="pin" value="${esc(w.yt||'')}" oninput="setTemaYt(${i},this.value)" placeholder="https://youtu.be/…">`;
    }
    h+=`</div>`;
  });
  h+=`</div></div>`;
  // uložení zůstává dole pod formulářem – potvrzuje se až po vyplnění
  if(ro){
    // z archivu: použít ho jako základ pro tentýž měsíc příští rok
    const cil=temaSousedniRok(o,1);
    h+= cil?`<button class="btn-primary btn-block tema-save" onclick="temaAdopt('${o.key}','${cil.key}')">Použít pro ${cil.label.toLowerCase()}</button>`:'';
  }else{
    h+=`<button class="btn-primary btn-block tema-save" onclick="showToast('Tématický plán uložen ✓')">Uložit ${o.stav==='bezi'?'tématický plán':'plán na '+o.label.toLowerCase()}</button>`;
  }
  return h;
}
window.rytEditOn=()=>{rytDraft=RYTMUS.map(r=>({prog:r.prog,krouzek:r.krouzek}));rytEdit=true;render();};
window.rytCancel=()=>{rytEdit=false;rytDraft=null;render();};
window.setRytD=(i,f,v)=>{rytDraft[i][f]=v;};   // bez render() – kurzor v poli musí zůstat
window.rytSaveAll=()=>{RYTMUS.forEach((r,i)=>{r.prog=rytDraft[i].prog.trim();r.krouzek=rytDraft[i].krouzek.trim();});rytEdit=false;rytDraft=null;render();showToast('Rozvrh uložen ✓');};
window.setTemaH=v=>{temaPlan().hodnota=v;};
window.setTemaIntro=v=>{temaPlan().intro=v;};
window.setTemaB=(i,v)=>{temaPlan().tydny[i].b=v;};
window.setTemaP=(i,v)=>{temaPlan().tydny[i].p=v;};
window.setTemaYt=(i,v)=>{temaPlan().tydny[i].yt=v;};
window.setTemaByt=(i,v)=>{temaPlan().tydny[i].byt=v;};
window.setTemaFile=inp=>{const f=inp.files&&inp.files[0];if(f){temaPlan().file=f.name;render();showToast('Nahráno ✓');}};
window.temaStep=dir=>{const ps=temaPeriods();let i=ps.findIndex(p=>p.key===temaMonth);i=Math.min(ps.length-1,Math.max(0,i+dir));temaMonth=ps[i].key;render();};
window.temaAdopt=(fromKey,toKey)=>{
  const ps=temaPeriods(),src=ps.find(p=>p.key===fromKey),cil=ps.find(p=>p.key===toKey);
  if(!src||!cil)return;
  const z=temaPlan(src),c=temaPlan(cil);
  c.hodnota=z.hodnota||'';c.intro=z.intro||'';
  c.tydny=z.tydny.map(w=>({b:w.b||'',byt:w.byt||'',p:w.p||'',yt:w.yt||''}));
  temaMonth=cil.key;render();showToast('Plán převzat do '+cil.label.toLowerCase()+' ✓');
};
