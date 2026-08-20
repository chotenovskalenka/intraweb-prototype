/* SCREEN: RODIC_FOTKY – fotky žijí na Google Drive (mimo IS), sem se jen odkazuje.
   Jedno album = jeden časový úsek (nepravidelně týden až měsíc), FOTO_ALBA v data.js. Nejnovější první. */
function renderFotky(){
  let h=`<div class="doch"><div class="tile">`;
  h+=FOTO_ALBA.map(a=>`<a class="doc doc-dl" href="${a.url}" target="_blank" rel="noopener"><span>${a.nazev}<span class="dt2"> · ${fmtAlbum(a)}</span></span><span class="drivelink">Otevřít na Drive ↗</span></a>`).join('');
  return h+`</div></div>`;
}
