/* SCREEN: RODIC_PROFIL — údaje o dítěti, zdraví, dokumenty a záznamy z rozhovorů.
   Desktop: dva sloupce (sloupcový tok, karty jsou různě vysoké).
   Data v PROFIL / CISELNIK / SOUHLASY (data.js). Rodič si Základní údaje, Kontakty
   a Zdraví a strava spravuje sám — tlačítko Upravit → overlay renderProfEdit.
   Doporučení od průvodců, depistáž a rozhovory jsou jen ke čtení (vkládá školka).
   Fotky prací a vlastní poznámky rodiče vypuštěny (dřív nefunkční prvky). */
function renderProfil(){
  const c=cur(), p=PROFIL[c.n], rezim=CODES[c.base][0];
  const row=(k,v)=>`<div class="mrow"><span class="mk2">${k}</span><span class="mv">${v}</span></div>`;
  let h=`<div class="doch"><div class="page-cols">`;

  h+=`<div class="tile"><div class="ch">Základní údaje</div>
    ${row('Jméno',c.n)}${row('Příjmení',c.sur)}${row('Narození',p.narozeni)}${row('Rodné číslo',p.rc)}${row('Bydliště',p.adresa)}
    ${row('Jazyky doma',p.jazyky)}${row('Pojišťovna',p.pojistovna)}${row('Spádová MŠ',p.spadova)}
    ${row('Režim',rezim)}${row('Sourozenci',p.sourozenci)}</div>`;

  h+=`<div class="tile"><div class="ch">Rodiče</div>
    ${row('Matka',ACCOUNT.telMatka+' · '+p.matka.email)}${row('Otec',ACCOUNT.telOtec+' · '+p.otec.email)}
    <div class="note2" style="margin:8px 0 0">Telefon spravujete v Nastavení účtu.</div></div>`;

  h+=`<div class="tile"><div class="ch">Zdraví a strava</div>
    ${row('Alergie',profAlergie(p))}${row('Léky',profAno(p.leky,p.lekyText))}${row('Brýle',profAno(p.bryle,p.bryleText))}
    ${row('Strava',p.strava)}${row('Dieta',p.dieta)}${row('Usínání',p.usinani)}</div>`;

  h+=`<div class="tile"><div class="ch">Co ${c.ak} baví a jak reaguje</div>
    <div class="rozhov"><div class="rd">Co ${c.ak} baví</div>${p.bavi}</div>
    <div class="rozhov"><div class="rd">Když nesouhlasí</div>${p.nesouhlas}</div></div>`;

  h+=`<div class="tile"><div class="ch">Doporučení od průvodců — na doma</div>
    ${p.doporuceni.map(d=>`<div class="rec"><span class="recdot"></span>${d}</div>`).join('')}</div>`;

  h+=`<div class="tile"><div class="ch">Dokumenty a souhlasy</div>
    ${SOUHLASY.map((d,i)=>`<button class="doc doc-dl" onclick="downloadDoc(${i})"><span>${d.t}</span><span class="pdf">${d.f} ↓</span></button>`).join('')}</div>`;

  h+=`<div class="tile"><div class="ch">Dokumenty z depistáže</div>
    <button class="doc doc-dl" onclick="downloadDepistaz('Vstupní depistáž')"><span>Vstupní depistáž <span class="dt2">9/2025</span></span><span class="pdf">PDF ↓</span></button>
    <button class="doc doc-dl" onclick="downloadDepistaz('Logopedický screening')"><span>Logopedický screening <span class="dt2">11/2025</span></span><span class="pdf">PDF ↓</span></button>
    <button class="doc doc-dl" onclick="downloadDepistaz('Pololetní hodnocení')"><span>Pololetní hodnocení <span class="dt2">1/2026</span></span><span class="pdf">PDF ↓</span></button></div>`;

  h+=`<div class="tile"><div class="ch">Z rozhovorů s rodiči</div>
    <div class="rozhov"><div class="rd">Úvodní schůzka · 2. 9. 2025</div>Adaptace v pořádku, dítě se těší. Doma řeší usínání.</div>
    <div class="rozhov"><div class="rd">Konzultace · 20. 1. 2026</div>Velký pokrok v jemné motorice, baví ho práce se dřevem.</div></div>`;

  h+=`</div><div class="note2">Základní údaje, kontakty a zdraví si spravujete sami — držte je prosím aktuální. Doporučení, depistáž a rozhovory vkládají průvodci. Demo hodnoty.</div>`;
  return h+`</div>`;
}

/* --- Stahování dokumentů (demo) --- helpery downloadBlob/makePDF/dlName jsou ve shared.js.
   PDF = validní minimální PDF, DOCX = textový stub s příponou .docx. */
window.downloadDoc=i=>{
  const d=SOUHLASY[i], c=cur(), title=`${d.t} — ${c.n} ${c.sur}`;
  if(d.f==='PDF')downloadBlob(dlName(d.t)+'.pdf',makePDF(title),'application/pdf');
  else downloadBlob(dlName(d.t)+'.docx',`${title}\n\nDemo dokument – Lesní školka Vhaaji.`,'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  showToast('Stahuji '+d.t+' ✓');
};
window.downloadDepistaz=t=>{const c=cur();downloadBlob(dlName(t)+'.pdf',makePDF(`${t} — ${c.n} ${c.sur}`),'application/pdf');showToast('Stahuji '+t+' ✓');};

/* --- Editace profilu (rodič spravuje své údaje) --- overlay řízený stavem pfEdit --- */
function renderProfEdit(){
  const c=cur(), d=pfEdit;
  const inp=(f,ph)=>`<input class="pf-in" value="${esc(d[f])}" placeholder="${ph||''}" oninput="pfSet('${f}',this.value)">`;
  const sel=(f,opts)=>`<select class="pf-in" onchange="pfSet('${f}',this.value);render()">${opts.map(o=>`<option${o===d[f]?' selected':''}>${o}</option>`).join('')}</select>`;
  let h=`<div class="pf-head"><button class="back" onclick="profCancel()">← Zpět</button><div class="dh-id">${avatar(c,38)}<h1 class="dh-t">Upravit údaje</h1></div><div class="dh-sub">${c.n} · držte prosím informace aktuální</div></div>`;

  h+=`<div class="tile"><div class="ch">Základní údaje</div>
    <label class="pf-row"><span class="pf-lbl">Bydliště</span>${inp('adresa','ulice, PSČ, obec')}</label>
    <label class="pf-row"><span class="pf-lbl">Jazyky doma</span>${sel('jazyky',CISELNIK.jazyk)}</label>
    <label class="pf-row"><span class="pf-lbl">Pojišťovna</span>${sel('pojistovna',CISELNIK.pojistovna)}</label>
    <label class="pf-row"><span class="pf-lbl">Sourozenci</span>${inp('sourozenci','jméno (rok)')}</label></div>`;

  h+=`<div class="tile"><div class="ch">Rodiče</div>
    <label class="pf-row"><span class="pf-lbl">Matka · e-mail</span>${inp('matkaEmail','e-mail')}</label>
    <label class="pf-row"><span class="pf-lbl">Otec · e-mail</span>${inp('otecEmail','e-mail')}</label>
    <div class="note2" style="margin:8px 0 0">Telefon se edituje v Nastavení účtu (dole v menu).</div></div>`;

  const alergieVolne=CISELNIK.alergie.filter(a=>!d.alergie.includes(a));
  h+=`<div class="tile"><div class="ch">Zdraví a strava</div>
    <label class="pf-row"><span class="pf-lbl">Alergie</span>
      <select class="pf-in" onchange="pfAddAlergie(this.value)"${alergieVolne.length?'':' disabled'}>
        <option value="">${alergieVolne.length?'+ Přidat alergii…':'vše přidáno'}</option>
        ${alergieVolne.map(a=>`<option value="${esc(a)}">${a}</option>`).join('')}
      </select></label>
    ${d.alergie.length?`<div class="pf-tags">${d.alergie.map(a=>`<button class="pf-tag" onclick="pfDelAlergie('${a}')">${a} ✕</button>`).join('')}</div>`:`<div class="pf-none">Žádné alergie</div>`}
    <label class="pf-check"><input type="checkbox" ${d.leky?'checked':''} onchange="pfCheck('leky',this.checked)"> Užívá léky</label>
    ${d.leky?`<label class="pf-row pf-sub"><span class="pf-lbl">Jaké</span>${inp('lekyText','název, dávkování')}</label>`:''}
    <label class="pf-check"><input type="checkbox" ${d.bryle?'checked':''} onchange="pfCheck('bryle',this.checked)"> Nosí brýle</label>
    ${d.bryle?`<label class="pf-row pf-sub"><span class="pf-lbl">Poznámka</span>${inp('bryleText','např. na blízko')}</label>`:''}
    <label class="pf-row"><span class="pf-lbl">Strava</span>${sel('strava',CISELNIK.strava)}</label>
    <label class="pf-row"><span class="pf-lbl">Dieta</span>${inp('dieta','bez omezení / …')}</label>
    <label class="pf-row"><span class="pf-lbl">Usínání</span>${inp('usinani','jak dítě usíná')}</label></div>`;

  h+=`<div class="tile"><div class="ch">Co ${c.ak} baví a jak reaguje</div>
    <div class="pf-lbl" style="margin-bottom:4px">Co ${c.ak} baví</div>
    <textarea class="note" oninput="pfSet('bavi',this.value)">${escTa(d.bavi)}</textarea>
    <div class="pf-lbl" style="margin:10px 0 4px">Když nesouhlasí</div>
    <textarea class="note" oninput="pfSet('nesouhlas',this.value)">${escTa(d.nesouhlas)}</textarea></div>`;

  h+=`<div class="mbtns"><button class="btn-ghost" onclick="profCancel()">Zrušit</button><button class="btn-primary" onclick="profSave()">Uložit</button></div>`;
  return h;
}
window.openProfEdit=()=>{
  const p=PROFIL[cur().n];
  pfEdit={adresa:p.adresa,jazyky:p.jazyky,pojistovna:p.pojistovna,sourozenci:p.sourozenci,
    matkaEmail:p.matka.email,otecEmail:p.otec.email,
    alergie:p.alergie.slice(),leky:p.leky,lekyText:p.lekyText,bryle:p.bryle,bryleText:p.bryleText,
    strava:p.strava,dieta:p.dieta,usinani:p.usinani,bavi:p.bavi,nesouhlas:p.nesouhlas};
  overlay={type:'profedit'};render();
};
window.pfSet=(f,v)=>{pfEdit[f]=v;};                 // text/textarea/select — bez re-renderu (drží focus)
window.pfCheck=(f,v)=>{pfEdit[f]=v;render();};      // checkbox — re-render kvůli detailu
window.pfAddAlergie=a=>{if(a&&!pfEdit.alergie.includes(a))pfEdit.alergie.push(a);render();};
window.pfDelAlergie=a=>{const i=pfEdit.alergie.indexOf(a);if(i>=0)pfEdit.alergie.splice(i,1);render();};
window.profCancel=()=>{pfEdit=null;overlay=null;render();};
window.profSave=()=>{
  const p=PROFIL[cur().n], d=pfEdit;
  p.adresa=d.adresa;p.jazyky=d.jazyky;p.pojistovna=d.pojistovna;p.sourozenci=d.sourozenci;
  p.matka={email:d.matkaEmail};p.otec={email:d.otecEmail};
  p.alergie=d.alergie.slice();p.leky=d.leky;p.lekyText=d.leky?d.lekyText:'';p.bryle=d.bryle;p.bryleText=d.bryle?d.bryleText:'';
  p.strava=d.strava;p.dieta=d.dieta;p.usinani=d.usinani;p.bavi=d.bavi;p.nesouhlas=d.nesouhlas;
  pfEdit=null;overlay=null;showToast('Údaje uloženy ✓');render();
};
