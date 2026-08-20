/* SCREEN: PRUVODCE_DETI */
/* Řazení soupisu. Klik na hlavičku přepíná vzestupně/sestupně; výchozí je abecedně podle
   jména (stejné pořadí jako dřív). Řadí se i karty na mobilu, i když tam hlavička není –
   ať se seznam po přepnutí šířky nepřeskládá. */
let detiSort='nm', detiDir=1;
const DETI_SLOUPCE=[['nm','Dítě'],['plan','Režim docházky'],['vek','Věk'],['nar','Narozeniny'],['predskolak','Předškolák'],['alergie','Alergie']];
// „16. 7. 2020" → 20200716, aby se narozeniny řadily podle data, ne podle textu
function narKey(v){const p=(v||'').split('.').map(x=>Number(x.trim()));return (p[2]||0)*10000+(p[1]||0)*100+(p[0]||0);}
// právě zobrazený výřez (filtr + hledání + řazení) – čte ho výpis i export
function detiList(){
  return data.map((c,i)=>({c,i}))
    .filter(x=>detiFilter==='all'||(detiFilter==='pre'&&x.c.predskolak)||(detiFilter==='al'&&x.c.alergie))
    .filter(x=>!detiQuery||norm(full(x.c)).includes(norm(detiQuery)))
    .sort(detiCmp);
}
function detiCmp(a,b){
  const A=a.c,B=b.c;let r=0;
  if(detiSort==='nm')r=A.n.localeCompare(B.n,'cs');
  else if(detiSort==='vek')r=A.vek-B.vek;
  else if(detiSort==='nar')r=narKey(A.nar)-narKey(B.nar);
  else if(detiSort==='predskolak')r=(A.predskolak?1:0)-(B.predskolak?1:0);
  else r=String(A[detiSort]||'').localeCompare(String(B[detiSort]||''),'cs');
  return r*detiDir || A.n.localeCompare(B.n,'cs');   // shodné hodnoty dorovná jméno
}
function renderDeti(){
  if(detiOpen>=0)return renderDite(detiOpen);
  // počty u filtrů – ať je poznat, že filtrují, ne že něco spouštějí
  const pocty={all:data.length,pre:data.filter(c=>c.predskolak).length,al:data.filter(c=>c.alergie).length};
  let h=`<div class="deti"><div class="filters">`+[['all','Všechny'],['pre','Předškoláci'],['al','Alergici']]
    .map(f=>`<button class="${detiFilter===f[0]?'on':''}" onclick="setDetiF('${f[0]}')" aria-pressed="${detiFilter===f[0]}">${f[1]} <span class="cnt">${pocty[f[0]]}</span></button>`).join('')+`</div>`;
  const list=detiList();
  h+=`<div class="deti-bar"><input class="search" placeholder="Najít dítě…" value="${esc(detiQuery)}" oninput="onDetiSearch(this.value)">`+
    `<button class="btn-ghost deti-exp" onclick="exportDeti()">Stáhnout jako CSV</button></div>`;
  if(!list.length)return h+`<div class="empty">Nikdo neodpovídá filtru.</div></div>`;
  // Dvojí výpis: na mobilu karty (dobře se na ně klepe), na desktopu tabulka (25 dětí se
  // dá přehlédnout na jednu obrazovku). Přepíná se v CSS – appka nemá listener na resize.
  h+=`<div class="deti-cards">`+list.map(x=>{const c=x.c;
    const b=(c.predskolak?'<span class="bdg pre">předškolák</span>':'')+(c.alergie?` <span class="bdg al">${c.alergie}</span>`:'');
    return `<button class="acard" onclick="openDite(${x.i})">${avatar(c,32)}<span style="flex:1"><span class="aname">${full(c)}</span><div class="ameta">${c.plan}${b?' · ':''}${b}</div></span></button>`;
  }).join('')+`</div>`;
  h+=`<table class="dtab"><thead><tr>`+DETI_SLOUPCE.map(([k,lab])=>{
    const on=detiSort===k;
    return `<th class="${on?'srt':''}" aria-sort="${on?(detiDir>0?'ascending':'descending'):'none'}"><button onclick="setDetiSort('${k}')">${lab}<span class="arw">${on?(detiDir>0?'▲':'▼'):'⇅'}</span></button></th>`;
  }).join('')+`</tr></thead><tbody>`+
    list.map(x=>{const c=x.c;
      return `<tr onclick="openDite(${x.i})"><td class="nm">${avatar(c,28)}${full(c)}</td><td>${c.plan}</td><td>${c.vek} let</td><td>${c.nar}</td>`+
        `<td>${c.predskolak?'<span class="bdg pre">ano</span>':'<span class="dt-no">–</span>'}</td>`+
        `<td>${c.alergie?`<span class="bdg al">${c.alergie}</span>`:'<span class="dt-no">–</span>'}</td></tr>`;
    }).join('')+`</tbody></table>`;
  return h+`</div>`;
}
function renderDite(i){
  const c=data[i],recs=recordsFor(c);
  // hlavička detailu je jeden blok → na desktopu přeskočí masonry sloupce (column-span:all)
  let h=`<div class="dite-head"><button class="back" onclick="closeDite()">← Zpět na seznam</button>`;
  h+=`<div class="pav">${avatar(c,72)}</div><div class="pname">${full(c)}</div><div class="pfull">${c.plan}${c.predskolak?' · předškolák':''}</div></div>`;
  // Kmenová data dítěte mění jen průvodce s právy hospodářky; ostatní je vidí ke čtení.
  h+=`<div class="tile"><div class="ch">Přehled</div>`;
  if(jeHospodar()){
    h+=`<label class="pl">Režim docházky</label><div class="pchips">`+
       PLANY.map(o=>`<button class="${c.plan===o?'on':''}" onclick="setDitePlan(${i},'${o}')">${o}</button>`).join('')+`</div>`+
       `<label class="pl">Alergie</label><input class="pin" value="${esc(c.alergie||'')}" oninput="setDiteF(${i},'alergie',this.value)" placeholder="žádné">`+
       `<label class="pl">Narozeniny</label><input class="pin" value="${esc(c.nar)}" oninput="setDiteF(${i},'nar',this.value)" placeholder="D. M. RRRR">`+
       `<div class="np" style="margin-top:9px"><span>Předškolák</span><button class="tgl ${c.predskolak?'on':''}" role="switch" aria-checked="${c.predskolak}" onclick="togDitePre(${i})">${c.predskolak?'ano · nástup do ZŠ 2026':'ne'}</button></div>`+
       `<button class="btn-primary btn-block" style="margin-top:var(--space-md)" onclick="showToast('Uloženo ✓')">Uložit údaje</button>`;
  }else{
    h+=`<div class="np"><span>Narozeniny</span><b>${c.nar}</b></div>`+
       `<div class="np"><span>Věk</span><b>${c.vek} let</b></div>`+
       `<div class="np"><span>Režim docházky</span><b>${c.plan}</b></div>`+
       `<div class="np"><span>Předškolák</span><b>${c.predskolak?'ano · nástup do ZŠ 2026':'ne'}</b></div>`+
       `<div class="np"><span>Alergie</span><b>${c.alergie||'žádné'}</b></div>`;
  }
  h+=`</div>`;
  if(c.note)h+=`<div class="tile"><div class="ch">Aktuální poznámka</div><div class="tval">${c.note}</div></div>`;
  // zůstatek fondu je věc hospodářky – řadový průvodce ho v profilu nevidí
  if(jeHospodar())h+=`<div class="tile"><div class="ch">Kulturní fond</div><div class="np"><span>Zůstatek</span><b style="color:${c.fond<300?'var(--color-danger)':'var(--color-primary)'}">${c.fond.toLocaleString('cs-CZ')} Kč</b></div>`+c.fondLog.slice(0,4).map(l=>`<div class="np" style="font-size:13px"><span style="color:var(--color-text-muted)">${l.name} · ${l.date}</span><b style="font-weight:500;color:var(--color-text-muted)">−${l.amt} Kč</b></div>`).join('')+`</div>`;
  /* Záznamy jsou hotové dokumenty (depistáž, hodnocení) – ke stažení jako PDF, stejně jako
     dokumenty v Kontaktech. Jak se do IS dostanou, je otevřená otázka (viz decision-log). */
  h+=`<div class="tile"><div class="ch">Záznamy a hodnocení (${recs.length})</div>`+
    recs.map((r,k)=>`<button class="doc doc-dl" onclick="stahniZaznam(${i},${k})"><span>${r[0]}<span class="dt2"> · ${r[1]}</span></span><span class="pdf">PDF ↓</span></button>`).join('')+`</div>`;
  const ps=parentsFor(c);
  h+=`<div class="tile"><div class="ch">Rodiče</div>`+ps.map((p,k)=>`<div style="padding:8px 0${k?';border-top:1px solid var(--color-border)':''}"><div style="font-size:14px"><b>${p.role}</b> · ${p.name}</div><div class="contact" style="margin-top:6px"><a class="cbtn" href="tel:${p.phone.replace(/ /g,'')}">${p.phone}</a><a class="cbtn" href="mailto:${p.email}" style="font-size:11.5px">${p.email}</a></div></div>`).join('')+`</div>`;
  const rz=rozhovoryFor(i);
  h+=`<div class="tile"><div class="ch">Rozhovory s rodiči (${rz.length})</div>`+rz.map(r=>`<div class="rozh"><div class="rozhd">${r.date}</div>${r.note}</div>`).join('')+`<label class="pl" style="margin-top:10px">Nový záznam</label><textarea class="pta" id="rozh-new" placeholder="zápis z rozhovoru, doporučení na doma…"></textarea><button class="btn-primary btn-block" style="margin-top:var(--space-sm)" onclick="addRozhovor(${i})">Přidat záznam</button></div>`;
  return h;
}
window.addRozhovor=i=>{const t=document.getElementById('rozh-new');const v=t?t.value.trim():'';if(!v){showToast('Napiš záznam');return;}rozhovoryFor(i).unshift({date:'27. 6. 2026',note:v});render();showToast('Záznam uložen ✓');};
window.exportDeti=()=>{
  const list=detiList();
  stahniCSV('deti-vhaaji-2026-06.csv',['Jméno','Režim docházky','Věk','Narozeniny','Předškolák','Alergie'],
    list.map(x=>{const c=x.c;return [full(c),c.plan,c.vek,c.nar,c.predskolak?'ano':'',c.alergie||''];}));
  showToast('Staženo '+pocetDeti(list.length)+' ✓');
};
window.setDetiSort=k=>{if(detiSort===k)detiDir=-detiDir;else{detiSort=k;detiDir=1;}render();};
window.stahniZaznam=(i,k)=>{const c=data[i],r=recordsFor(c)[k];if(!r)return;
  const nazev=`${r[0]} – ${full(c)} (${r[1]})`;
  downloadBlob(dlName(nazev)+'.pdf',makePDF(nazev),'application/pdf');
  showToast('Stahuji '+r[0]+' ✓');};
window.setDitePlan=(i,v)=>{data[i].plan=v;render();};
window.setDiteF=(i,f,v)=>{data[i][f]=v;};   // bez render() – kurzor v poli musí zůstat
window.togDitePre=i=>{data[i].predskolak=!data[i].predskolak;render();};
window.setDetiF=f=>{detiFilter=f;render();};
window.onDetiSearch=v=>{detiQuery=v;renderKeepFocus();};
window.openDite=i=>{detiOpen=i;render();};
window.closeDite=()=>{detiOpen=-1;render();};
window.setDopo=(i,v)=>{dopoMap[i]=v;};
