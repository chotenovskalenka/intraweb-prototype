/* SCREEN: ADMIN_AKTUALITY – Flow 4: vedení vytváří aktualitu, kterou NELZE odeslat
   bez určení příjemců; u odeslaných vidí, komu odešla. */

let akView='list';   // 'list' | 'new'
let formA=null;      // rozpracovaná aktualita {text,urgent,recip}
let akEditId=null;   // id upravovaného konceptu (null = nová)

function renderAktuality(){
  return akView==='new'?renderAkForm():renderAkList();
}

function renderAkList(){
  let h="";  // akce „+ Nová novinka" je v topbaru (core.js TOPACT)
  // pořadí: koncepty a naplánované nahoře, pak odeslané, pak archivované
  const order={koncept:0,naplanovana:1,odeslana:2,archivovana:3};
  const items=AKTUALITY.slice().sort((a,b)=>order[a.stav]-order[b.stav]);
  items.forEach(a=>{
    const st=AKSTAV[a.stav];
    h+=`<div class="tile ak-item">`;
    h+=`<div class="ak-top"><span class="bdg ${st.cls}">${st.lab}</span>`
      +(a.urgent?`<span class="bdg al">Důležité</span>`:``)
      +(a.datum?`<span class="ak-date">${a.datum}</span>`:``)+`</div>`;
    h+=`<div class="ak-txt">${escTa(a.text)||'<span class="ak-empty">(bez textu)</span>'}</div>`;
    // příjemci
    const rec=recipText(a.recip);
    if(rec.length){
      h+=`<div class="ak-rec"><span class="ak-rlab">Příjemci:</span> ${rec.map(escTa).join(' · ')}</div>`;
    }else if(a.stav==='koncept'){
      h+=`<div class="ak-rec ak-norec">Bez určených příjemců – před odesláním je nutné je vybrat.</div>`;
    }
    // akce dle stavu
    h+=`<div class="ak-acts">`;
    if(a.stav==='koncept'){
      h+=`<button class="btn-s" onclick="akEdit('${a.id}')">Upravit</button>`;
      h+=hasRecip(a.recip)
        ? `<button class="btn-s primary" onclick="akSendId('${a.id}')">Odeslat</button>`
        : `<button class="btn-s primary" disabled title="Nejdřív vyberte příjemce">Odeslat</button>`;
    }else if(a.stav==='odeslana'){
      h+=`<button class="btn-s" onclick="akArchive('${a.id}')">Archivovat</button>`;
    }else if(a.stav==='naplanovana'){
      h+=`<span class="ak-hint">Odešle se automaticky v naplánovaný čas.</span>`;
    }
    h+=`</div></div>`;
  });
  return h;
}

function renderAkForm(){
  const f=formA, recip=f.recip;
  const rec=recipText(recip), ok=hasRecip(recip), textOk=f.text.trim().length>0;
  let h=`<button class="back" onclick="akCancel()">‹ Zpět na seznam</button>`;
  h+=`<div class="tile">`;
  h+=`<div class="field"><div class="l">Text novinky</div>`
    +`<textarea class="pta" id="akText" placeholder="Co chcete rodičům oznámit?">${escTa(f.text)}</textarea></div>`;
  // důležité
  h+=`<div class="field"><div class="l">Označení</div><div class="pchips">`
    +`<button class="${f.urgent?'on':''}" onclick="akToggleUrgent()">Důležité (urgentní)</button></div></div>`;
  // příjemci – povinné
  h+=`<div class="field"><div class="l">Příjemci · povinné</div>`;
  SKOLKY.forEach(s=>{
    const r=recip[s.id]||{all:false,tridy:[]};
    h+=`<div class="rec-sk"><div class="rec-nm">${s.nazev} <span class="rec-fam">${obsazeno(s)} rodin</span></div><div class="pchips">`;
    h+=`<button class="${r.all?'on':''}" onclick="akToggleAll('${s.id}')">Celá školka</button>`;
    // u školky s jedinou skupinou by chip třídy jen dubloval „Celá školka"
    if(s.tridy.length>1)s.tridy.forEach(t=>{
      const on=!r.all&&r.tridy.indexOf(t.n)>=0;
      h+=`<button class="${on?'on':''}" onclick="akToggleTrida('${s.id}','${t.n}')">${t.n} <span class="rec-fam">${t.obs}</span></button>`;
    });
    h+=`</div></div>`;
  });
  h+=`</div>`;
  // náhled příjemců
  if(ok){
    h+=`<div class="tile note-info ak-preview"><b>Odešle se rodičům:</b><br>${rec.map(escTa).join('<br>')}</div>`;
  }else{
    h+=`<div class="ak-warn">⚠ Bez určených příjemců nelze novinku odeslat – vyberte alespoň jednu školku nebo třídu.</div>`;
  }
  // tlačítka
  h+=`<div class="mbtns">`;
  h+=`<button class="btn-ghost" onclick="akSaveDraft()">Uložit koncept</button>`;
  const canSend=ok&&textOk;
  h+=canSend
    ? `<button class="btn-primary" onclick="akSend()">Odeslat</button>`
    : `<button class="btn-primary" disabled>Odeslat</button>`;
  h+=`</div>`;
  if(ok&&!textOk)h+=`<div class="ak-warn" style="margin-top:8px">Doplňte text novinky.</div>`;
  h+=`</div>`;
  return h;
}

// před každou akcí, která překreslí, uložíme rozepsaný text (render zničí textarea)
function akSyncText(){const el=document.getElementById('akText');if(el&&formA)formA.text=el.value;}

window.akNew=()=>{formA={text:'',urgent:false,recip:{}};akEditId=null;akView='new';render();};
window.akEdit=id=>{const a=AKTUALITY.find(x=>x.id===id);formA={text:a.text,urgent:a.urgent,recip:JSON.parse(JSON.stringify(a.recip||{}))};akEditId=id;akView='new';render();};
window.akCancel=()=>{akView='list';formA=null;akEditId=null;render();};

window.akToggleUrgent=()=>{akSyncText();formA.urgent=!formA.urgent;render();};
window.akToggleAll=sid=>{akSyncText();const r=formA.recip[sid]||(formA.recip[sid]={all:false,tridy:[]});r.all=!r.all;r.tridy=[];if(!r.all)delete formA.recip[sid];render();};
window.akToggleTrida=(sid,tn)=>{akSyncText();const r=formA.recip[sid]||(formA.recip[sid]={all:false,tridy:[]});r.all=false;const i=r.tridy.indexOf(tn);if(i>=0)r.tridy.splice(i,1);else r.tridy.push(tn);if(!r.tridy.length)delete formA.recip[sid];render();};

function akCommit(stav){
  const dt=`${TODAYD}. 6. 2026`;
  if(akEditId){
    const a=AKTUALITY.find(x=>x.id===akEditId);
    a.text=formA.text;a.urgent=formA.urgent;a.recip=formA.recip;a.stav=stav;
    if(stav==='odeslana')a.datum=dt;
  }else{
    AKTUALITY.unshift({id:'ak'+(akUid++),text:formA.text,urgent:formA.urgent,stav,datum:stav==='odeslana'?dt:'',recip:formA.recip});
  }
}
window.akSaveDraft=()=>{akSyncText();akCommit('koncept');akView='list';formA=null;akEditId=null;showToast('Koncept uložen');render();};
window.akSend=()=>{akSyncText();if(!hasRecip(formA.recip)||!formA.text.trim())return;akCommit('odeslana');akView='list';formA=null;akEditId=null;showToast('Novinka odeslána');render();};

// odeslání přímo ze seznamu (koncept s vybranými příjemci)
window.akSendId=id=>{const a=AKTUALITY.find(x=>x.id===id);if(!hasRecip(a.recip)||!a.text.trim())return;a.stav='odeslana';a.datum=`${TODAYD}. 6. 2026`;showToast('Novinka odeslána');render();};
window.akArchive=id=>{const a=AKTUALITY.find(x=>x.id===id);a.stav='archivovana';showToast('Novinka archivována');render();};
