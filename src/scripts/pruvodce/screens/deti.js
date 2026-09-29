/* SCREEN: PRUVODCE_DETI */
/* Řazení soupisu. Klik na hlavičku přepíná vzestupně/sestupně; výchozí je abecedně podle
   jména (stejné pořadí jako dřív). Řadí se i karty na mobilu, i když tam hlavička není –
   ať se seznam po přepnutí šířky nepřeskládá. */
let detiSort='nm', detiDir=1;
// rozpracovaný záznam z konzultace: null = nový, jinak index do rozhovoryFor(dítě)
let rozhEdit=null;
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
    `<button class="btn-ghost deti-exp" onclick="exportDeti()">Stáhnout jako CSV</button>`+
    /* Seznam na výdej (P5): jména alergiků se řeší u výdeje, kdy se do mobilu nekouká –
       v kuchyni je mají vyvěšená na papíře. Tohle je ten papír. */
    (detiFilter==='al'?`<button class="btn-ghost deti-exp" onclick="alergiePDF()">Seznam na výdej (PDF)</button>`:'')+`</div>`;
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
  const c=data[i];
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
  const ps=parentsFor(c);
  h+=`<div class="tile"><div class="ch">Rodiče</div>`+ps.map((p,k)=>`<div style="padding:8px 0${k?';border-top:1px solid var(--color-border)':''}"><div style="font-size:14px"><b>${p.role}</b> · ${p.name}</div><div class="contact" style="margin-top:6px"><a class="cbtn" href="tel:${p.phone.replace(/ /g,'')}">${p.phone}</a><a class="cbtn" href="mailto:${p.email}" style="font-size:11.5px">${p.email}</a></div></div>`).join('')+`</div>`;

  /* P1: dvě zóny místo jednoho bloku. Průvodce musí na první pohled vědět, co z toho
     čte rodič – nejistota, „jak to rodič přečte", byla jádro nálezu (3 ze 3). */
  const zz=zaznamyFor(i), rz=rozhovoryFor(i), tp=tymPoznFor(i);
  const docRow=(r,k)=>`<div class="zrow"><button class="doc doc-dl" onclick="stahniZaznam(${i},${k})"><span>${r.nazev}<span class="dt2"> · ${r.datum}</span></span><span class="pdf">PDF ↓</span></button>`
    +`<button class="zsdil" onclick="sdilejZaznam(${i},${k},${!r.sdileno})">${r.sdileno?'Přestat sdílet':'Sdílet s rodiči'}</button></div>`;

  h+=`<div class="zona"><div class="zona-h"><span class="zona-t">Vidí rodiče</span><span class="zona-s">Tohle je v rodičovské aplikaci u dítěte.</span></div>`;
  const sd=zz.map((r,k)=>[r,k]).filter(([r])=>r.sdileno);
  h+=`<div class="tile"><div class="ch">Hodnocení a dokumenty</div>`+(sd.length?sd.map(([r,k])=>docRow(r,k)).join(''):`<div class="empty-l">Rodičům zatím nic nesdílíte.</div>`)+`</div>`;
  /* Každý záznam z konzultace jde upravit – průvodce se k němu průběžně vrací (domluvu
     často dopisuje až po poradě s kolegy), proto ani jedna část není povinná. */
  const upr=k=>`<button class="zsdil" onclick="upravRozhovor(${k})">Upravit</button>`;
  const rzDom=rz.map((r,k)=>[r,k]).filter(([r])=>r.domluva);
  h+=`<div class="tile"><div class="ch">Domluveno s rodiči</div>`+(rzDom.length?rzDom.map(([r,k])=>`<div class="rozh"><div class="rozh-top"><span class="rozhd">${r.typ} · ${r.date}</span>${upr(k)}</div>${esc(r.domluva)}</div>`).join(''):`<div class="empty-l">S rodiči zatím nic nesdílíte.</div>`)+`</div></div>`;

  h+=`<div class="zona zona-int"><div class="zona-h"><span class="zona-t">Jen pro tým</span><span class="zona-s">Rodič tohle nikdy neuvidí.</span></div>`;
  const int=zz.map((r,k)=>[r,k]).filter(([r])=>!r.sdileno);
  h+=`<div class="tile"><div class="ch">Pracovní dokumenty</div>`+(int.length?int.map(([r,k])=>docRow(r,k)).join(''):`<div class="empty-l">Všechny dokumenty jsou sdílené.</div>`)+`</div>`;
  // interní části konzultací; záznam bez domluvy tu nese upozornění, že rodič z něj zatím nic nevidí
  const zRozh=rz.map((r,k)=>[r,k]).filter(([r])=>r.interni||!r.domluva).map(([r,k])=>`<div class="rozh"><div class="rozh-top"><span class="rozhd">${r.typ} · ${r.date}</span>${upr(k)}</div>${esc(r.interni||'')}${r.domluva?'':`<div class="rozh-chybi">Domluva s rodiči zatím chybí – rodič z konzultace nic nevidí.</div>`}</div>`);
  const zPozn=tp.map(p=>`<div class="rozh"><div class="rozhd">${p.date} · ${esc(p.kdo)}</div>${esc(p.text)}</div>`);
  h+=`<div class="tile"><div class="ch">Poznámky týmu</div>`+([...zPozn,...zRozh].join('')||`<div class="empty-l">Zatím žádné poznámky.</div>`)
    +`<label class="pl" style="margin-top:10px">Nová poznámka</label><textarea class="pta" id="tym-new" placeholder="upřímně – jen pro kolegy"></textarea>`
    +`<button class="btn-ghost btn-block" style="margin-top:var(--space-sm)" onclick="addTymPozn(${i})">Uložit poznámku</button></div>`;
  h+=`</div>`;

  // Záznam z konzultace: obě části naráz, každá s jasnou viditelností
  const re=rozhEdit!=null?rz[rozhEdit]:null;
  h+=`<div class="tile" id="rozh-form"><div class="ch">${re?`Upravit záznam · ${re.typ} ${re.date}`:'Nový záznam z konzultace'}</div>`
    +`<label class="pl">Co jste s rodiči domluvili <span class="vis vis-r">uvidí rodiče</span></label><textarea class="pta" id="rozh-dom" placeholder="shrnutí a doporučení na doma – můžeš doplnit později">${re?esc(re.domluva):''}</textarea>`
    +`<label class="pl" style="margin-top:10px">Interní poznámka <span class="vis vis-t">jen tým</span></label><textarea class="pta" id="rozh-int" placeholder="co rodiče číst nemají">${re?esc(re.interni):''}</textarea>`
    +`<button class="btn-primary btn-block" style="margin-top:var(--space-sm)" onclick="addRozhovor(${i})">${re?'Uložit změny':'Uložit záznam'}</button>`
    +(re?`<button class="btn-ghost btn-block" style="margin-top:var(--space-xs)" onclick="zrusUpravuRozh()">Zrušit úpravy</button>`:'')+`</div>`;
  return h;
}
window.addRozhovor=i=>{const g=id=>{const t=document.getElementById(id);return t?t.value.trim():'';};
  const dom=g('rozh-dom'),int=g('rozh-int');
  if(!dom&&!int){showToast('Napiš aspoň jednu část záznamu');return;}
  if(rozhEdit!=null){const r=rozhovoryFor(i)[rozhEdit];r.domluva=dom;r.interni=int;rozhEdit=null;}
  else rozhovoryFor(i).unshift({date:'3. 6. 2026',typ:'Konzultace',domluva:dom,interni:int});
  render();
  showToast(dom&&int?'Uloženo · domluvu uvidí rodiče, poznámku jen tým':dom?'Uloženo · uvidí rodiče':'Uloženo · zatím jen pro tým');};
window.upravRozhovor=k=>{rozhEdit=k;render();const f=document.getElementById('rozh-form');if(f)f.scrollIntoView({behavior:'smooth',block:'center'});};
window.zrusUpravuRozh=()=>{rozhEdit=null;render();};
window.addTymPozn=i=>{const t=document.getElementById('tym-new');const v=t?t.value.trim():'';if(!v){showToast('Napiš poznámku');return;}
  tymPoznFor(i).unshift({date:'3. 6. 2026',kdo:role==='hospodarka'?'Míša':role==='vedouci'?'Táňa':'Darča',text:v});render();showToast('Poznámka uložena · jen pro tým');};
window.sdilejZaznam=(i,k,ano)=>{const r=zaznamyFor(i)[k];if(!r)return;r.sdileno=ano;render();
  showToast(ano?`${r.nazev} teď uvidí rodiče v aplikaci`:`${r.nazev} už rodiče nevidí`);};
window.exportDeti=()=>{
  const list=detiList();
  stahniCSV('deti-vhaaji-2026-06.csv',['Jméno','Režim docházky','Věk','Narozeniny','Předškolák','Alergie'],
    list.map(x=>{const c=x.c;return [full(c),c.plan,c.vek,c.nar,c.predskolak?'ano':'',c.alergie||''];}));
  showToast('Staženo '+pocetDeti(list.length)+' ✓');
};
window.alergiePDF=()=>{const al=data.filter(c=>c.alergie).sort((a,b)=>a.n.localeCompare(b.n,'cs'));
  downloadBlob('alergie-na-vydej.pdf',makePDF('Alergie – seznam na výdej',al.map(c=>`${kratke(c)} – ${c.alergie}`)),'application/pdf');
  showToast('Stahuji seznam alergiků ✓');};
window.setDetiSort=k=>{if(detiSort===k)detiDir=-detiDir;else{detiSort=k;detiDir=1;}render();};
window.stahniZaznam=(i,k)=>{const c=data[i],r=zaznamyFor(i)[k];if(!r)return;
  const nazev=`${r.nazev} – ${full(c)} (${r.datum})`;
  downloadBlob(dlName(nazev)+'.pdf',makePDF(nazev),'application/pdf');
  showToast('Stahuji '+r.nazev+' ✓');};
window.setDitePlan=(i,v)=>{data[i].plan=v;render();};
window.setDiteF=(i,f,v)=>{data[i][f]=v;};   // bez render() – kurzor v poli musí zůstat
window.togDitePre=i=>{data[i].predskolak=!data[i].predskolak;render();};
window.setDetiF=f=>{detiFilter=f;render();};
window.onDetiSearch=v=>{detiQuery=v;renderKeepFocus();};
window.openDite=i=>{detiOpen=i;rozhEdit=null;render();};
window.closeDite=()=>{detiOpen=-1;rozhEdit=null;render();};
window.setDopo=(i,v)=>{dopoMap[i]=v;};
