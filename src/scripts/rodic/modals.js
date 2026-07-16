/* MODALS: RODIC — překryvné obrazovky (overlay) a jejich handlery */
function renderFond(){
  const c=cur(), f=c.fond, zb=f.rocni-f.cerpano;
  let h=`<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pname">Kulturní fond</div><div class="pfull">${c.n}</div>`;
  h+=`<div class="tile"><div class="np"><span>Roční příspěvek</span><b>${kc(f.rocni)} Kč</b></div><div class="np"><span>Vyčerpáno</span><b>${kc(f.cerpano)} Kč</b></div><div class="np" style="border-top:1px solid var(--color-border);margin-top:4px;padding-top:8px"><span>Zbývá</span><b style="color:var(--color-primary)">${kc(zb)} Kč</b></div></div>`;
  h+=`<div class="tile"><div class="tlab">Z čeho se čerpalo</div>`+FONDLOG.map(x=>`<div class="frow"><div class="fL"><div class="fo">${x[0]}</div><div class="fv">${x[1]}</div></div><div class="fa">${kc(x[2])} Kč</div></div>`).join('')+`</div>`;
  h+=`<div class="note2">Kulturní fond pokrývá divadla, výlety, výtvarný materiál apod. Položky jsou demo.</div>`;
  return h;
}
function renderMenuDetail(){
  let h=`<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pname">Jídelníček</div><div class="pfull">tento týden</div>`;
  for(let d=1;d<=5;d++){
    h+=`<div class="tile"><div class="tlab">${DOW[wd(d)]} ${d}. 6.${d===TODAY?' · dnes':''}</div>`+MENUS[wd(d)].map(it=>`<div class="mrow"><span class="mk2">${it[0]}</span><span class="mv">${it[1]}</span>${it[2]?`<span class="alerg">${it[2]}</span>`:''}</div>`).join('')+`</div>`;
  }
  h+=`<div class="note2">Alergeny jsou uvedené čísly dle přílohy vyhlášky. Jídelníček dodává Mamafood.</div>`;
  return h;
}
function renderGuide(i){const g=guides[i];
  return `<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pav">${avatar(g,76)}</div><div class="pname">${g.n}${g.uspava?' ☾':''}</div><div class="pfull">průvodce${g.uspava?' · dnes uspává':''}</div>
   <div class="tile"><div class="tlab">Kdy je ve školce</div><div class="tval">${g.schedule}</div></div>
   <div class="tile"><div class="tlab">Kontakt</div><div class="contact"><a class="cbtn" href="tel:${telnum(g.phone)}">Zavolat</a><a class="cbtn" href="sms:${telnum(g.phone)}">Napsat</a><a class="cbtn" href="mailto:${g.email}">E-mail</a></div><div class="cinfo">${g.phone} · ${g.email}</div></div>`;
}
function renderAkceDetail(i){const a=akce[i];
  return `<button class="back" onclick="closeOverlay()">← Zpět</button><div class="pname">${a.title}</div><div class="pfull">${a.date}</div>
   <div class="tile"><div class="np"><span>Kdy</span><b>${a.time}</b></div><div class="np"><span>Kde</span><b>${a.place}</b></div></div>
   <div class="tile"><div class="tlab">Info</div><div class="tval">${a.note}</div></div>`;
}
window.openGuide=i=>{overlay={type:'guide',idx:i};render();};
window.openAkce=i=>{overlay={type:'akce',idx:i};render();};
window.openFond=()=>{overlay={type:'fond'};render();};
window.openMenu=()=>{overlay={type:'menu'};render();};
window.closeOverlay=()=>{overlay=null;render();};
