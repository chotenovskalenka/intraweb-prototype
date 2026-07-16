/* SCREEN: PRUVODCE_DETI */
function renderDeti(){
  if(detiOpen>=0)return renderDite(detiOpen);
  let h=`<div class="filters">`+[['all','Všechny'],['pre','Předškoláci'],['al','Alergici']].map(f=>`<button class="${detiFilter===f[0]?'on':''}" onclick="setDetiF('${f[0]}')">${f[1]}</button>`).join('')+`</div>`;
  const list=data.map((c,i)=>({c,i})).filter(x=>detiFilter==='all'||(detiFilter==='pre'&&x.c.predskolak)||(detiFilter==='al'&&x.c.alergie)).filter(x=>!detiQuery||norm(full(x.c)).includes(norm(detiQuery))).sort(byAlpha);
  h+=`<input class="search" placeholder="Najít dítě…" value="${esc(detiQuery)}" oninput="onDetiSearch(this.value)">`;
  h+=`<div class="tlab" style="margin:0 2px 9px">${list.length} ${list.length===1?'dítě':(list.length>=2&&list.length<=4?'děti':'dětí')}</div>`;
  h+= list.length? list.map(x=>{const c=x.c;
    const b=(c.predskolak?'<span class="bdg pre">předškolák</span>':'')+(c.alergie?` <span class="bdg al">${c.alergie}</span>`:'');
    return `<button class="acard" onclick="openDite(${x.i})">${avatar(c,32)}<span style="flex:1"><span class="aname">${full(c)}</span><div class="ameta">${c.plan}${b?' · ':''}${b}</div></span></button>`;
  }).join('') : `<div class="empty">Nikdo neodpovídá filtru.</div>`;
  return h;
}
function renderDite(i){
  const c=data[i],w=worksMap[i]||0,recs=recordsFor(c);
  let h=`<button class="back" onclick="closeDite()">← Zpět na seznam</button>`;
  h+=`<div class="pav">${avatar(c,72)}</div><div class="pname">${full(c)}</div><div class="pfull">${c.plan}${c.predskolak?' · předškolák':''}</div>`;
  h+=`<div class="tile"><div class="tlab">Přehled</div>`+
     `<div class="np"><span>Narozeniny</span><b>${c.nar}</b></div>`+
     `<div class="np"><span>Věk</span><b>${c.vek} let</b></div>`+
     `<div class="np"><span>Režim docházky</span><b>${c.plan}</b></div>`+
     `<div class="np"><span>Předškolák</span><b>${c.predskolak?'ano · nástup do ZŠ 2026':'ne'}</b></div>`+
     `<div class="np"><span>Alergie</span><b>${c.alergie||'žádné'}</b></div></div>`;
  h+=`<div class="tile"><div class="tlab">Kulturní fond</div><div class="np"><span>Zůstatek</span><b style="color:${c.fond<300?'var(--danger)':'var(--forest)'}">${c.fond.toLocaleString('cs-CZ')} Kč</b></div>`+c.fondLog.slice(0,4).map(l=>`<div class="np" style="font-size:13px"><span style="color:var(--muted)">${l.name} · ${l.date}</span><b style="font-weight:500;color:var(--muted)">−${l.amt} Kč</b></div>`).join('')+`</div>`;
  if(c.note)h+=`<div class="tile"><div class="tlab">Aktuální poznámka</div><div class="tval">${c.note}</div></div>`;
  h+=`<div class="tile"><div class="tlab">Záznamy a hodnocení (${recs.length})</div>`+recs.map(r=>`<div class="np"><span>${r[0]}</span><b style="font-weight:500;color:var(--muted)">${r[1]}</b></div>`).join('')+`</div>`;
  const ps=parentsFor(c);
  h+=`<div class="tile"><div class="tlab">Rodiče</div>`+ps.map((p,k)=>`<div style="padding:8px 0${k?';border-top:1px solid var(--line)':''}"><div style="font-size:14px"><b>${p.role}</b> · ${p.name}</div><div class="contact" style="margin-top:6px"><a class="cbtn" href="tel:${p.phone.replace(/ /g,'')}">${p.phone}</a><a class="cbtn" href="mailto:${p.email}" style="font-size:11.5px">${p.email}</a></div></div>`).join('')+`</div>`;
  const rz=rozhovoryFor(i);
  h+=`<div class="tile"><div class="tlab">Rozhovory s rodiči (${rz.length})</div>`+rz.map(r=>`<div class="rozh"><div class="rozhd">${r.date}</div>${r.note}</div>`).join('')+`<label class="pl" style="margin-top:10px">Nový záznam</label><textarea class="pta" id="rozh-new" placeholder="zápis z rozhovoru, doporučení na doma…"></textarea><button class="btn-primary" style="width:100%;margin-top:9px" onclick="addRozhovor(${i})">Přidat záznam</button></div>`;
  h+=`<div class="tile"><div class="tlab">Fotky prací dítěte</div>`+(w?`<div class="works">`+Array.from({length:w}).map(()=>`<div class="work" style="background:#E3D9C6">práce</div>`).join('')+`</div>`:`<div class="note2" style="margin:0">Zatím žádné práce.</div>`)+`<button class="addbtn" onclick="addWork(${i})">+ Nahrát práci dítěte</button></div>`;
  return h;
}
window.addRozhovor=i=>{const t=document.getElementById('rozh-new');const v=t?t.value.trim():'';if(!v){showToast('Napiš záznam');return;}rozhovoryFor(i).unshift({date:'27. 6. 2026',note:v});render();showToast('Záznam uložen ✓');};
window.setDetiF=f=>{detiFilter=f;render();};
window.onDetiSearch=v=>{detiQuery=v;renderKeepFocus();};
window.openDite=i=>{detiOpen=i;render();};
window.closeDite=()=>{detiOpen=-1;render();};
window.setDopo=(i,v)=>{dopoMap[i]=v;};
window.addWork=i=>{worksMap[i]=(worksMap[i]||0)+1;render();showToast('Práce nahrána ✓');};
