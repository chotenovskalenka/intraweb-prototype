/* SCREEN: PRUVODCE_FOTKY – fotky žijí na Google Drive (mimo IS), sem se jen odkazuje.
   Průvodci je nahrávají, rodiče je ve své appce čtou – proto stejná alba (FOTO_ALBA
   v photos.js). Nahrání je odkaz do složky, ne upload do prototypu. */
function renderFotky(){
  let h=`<div class="doch"><div class="vhead-row"><div class="vhead-act"><button class="btn-primary" onclick="openGal()">+ Nová galerie</button></div></div>`+
    `<div class="note2">Fotky se nahrávají na Google Drive školky. Rodiče vidí tatáž alba ve své appce.</div><div class="tile">`;
  h+=FOTO_ALBA.map(a=>`<a class="doc doc-dl" href="${a.url}" target="_blank" rel="noopener"><span>${a.nazev}<span class="dt2"> · ${fmtAlbum(a)}</span></span><span class="drivelink">Otevřít na Drive ↗</span></a>`).join('');
  return h+`</div></div>`;
}
