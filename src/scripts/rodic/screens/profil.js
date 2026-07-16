/* SCREEN: RODIC_PROFIL */
function renderProfil(){
  const c=cur();
  let h=`<div class="pav">${avatar(c,72)}</div><div class="pname">${c.n} ${c.sur}</div><div class="pfull">vše o ${c.dat}</div>`;
  h+=`<div class="tile"><div class="tlab">Dokumenty z depistáže</div>
    <div class="doc"><span>Vstupní depistáž <span class="dt2">9/2025</span></span><span class="pdf">PDF</span></div>
    <div class="doc"><span>Logopedický screening <span class="dt2">11/2025</span></span><span class="pdf">PDF</span></div>
    <div class="doc"><span>Pololetní hodnocení <span class="dt2">1/2026</span></span><span class="pdf">PDF</span></div></div>`;
  h+=`<div class="tile"><div class="tlab">Z rozhovorů s rodiči</div>
    <div class="rozhov"><div class="rd">Úvodní schůzka · 2. 9. 2025</div>Adaptace v pořádku, dítě se těší. Doma řeší usínání.</div>
    <div class="rozhov"><div class="rd">Konzultace · 20. 1. 2026</div>Velký pokrok v jemné motorice, baví ho práce se dřevem.</div></div>`;
  h+=`<div class="tile"><div class="tlab">Fotky prací dítěte</div><div class="works">
    <div class="work" style="background:#E3D9C6">práce</div><div class="work" style="background:#DCE3D6">práce</div><div class="work" style="background:#D8E0E4">práce</div></div>
    <button class="addbtn" onclick="return false">+ Přidat fotku práce</button></div>`;
  h+=`<div class="tile"><div class="tlab">Poznámky</div><textarea class="note" placeholder="vlastní poznámky rodiče…"></textarea></div>`;
  h+=`<div class="note2">Návrh struktury — část obsahu (depistáž, rozhovory) je dnes v tabulce školky. K doladění, kdo co vidí a vkládá.</div>`;
  return h;
}
