/* SHARED: ikony menu — čárové (Lucide styl, stroke=currentColor, takže se obarví podle
   barvy položky: neaktivní tmavá, aktivní zelená). 8 převzato z podklady/icon/,
   6 dokresleno ve stejném stylu (kalendar, clock=pruvodci, smile=deti, coins=fond,
   clipboard=porady, refresh=nahrady). */
const ICON_SVG={
  prehled:'<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.5"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.5"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.5"/><rect x="14" y="14" width="6.5" height="6.5" rx="1.5"/>',
  news:'<path d="M6 9.5a6 6 0 0 1 12 0c0 5 2 5.5 2 6.5H4c0-1 2-1.5 2-6.5Z"/><path d="M9.5 19a2.75 2.75 0 0 0 5 0"/>',
  dochazka:'<rect x="3.5" y="5.5" width="17" height="15" rx="2.5"/><path d="M7.5 3.5v4"/><path d="M16.5 3.5v4"/><path d="M3.5 9.5h17"/><path d="m8.5 15 2.2 2.2 4.8-5"/>',
  profil:'<circle cx="12" cy="8" r="3.5"/><path d="M5.5 20c.6-4.1 3-6.5 6.5-6.5s5.9 2.4 6.5 6.5"/>',
  platby:'<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h10A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-10A2.5 2.5 0 0 1 4 16.5v-9Z"/><path d="M4 9h15"/><path d="M14.5 13.5h2"/>',
  plan:'<rect x="5" y="4.5" width="14" height="16" rx="2.5"/><path d="M9 4.5V3.75h6v.75"/><path d="M8.5 9h7"/><path d="M8.5 12.5h7"/><path d="M8.5 16h4.5"/>',
  fotky:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="15.5" cy="9" r="1.5"/><path d="m5.5 17 4.5-4.5 3 3 2-2 3.5 3.5"/>',
  kontakty:'<circle cx="9" cy="8" r="3"/><circle cx="16.5" cy="9.5" r="2.5"/><path d="M3.5 19c.5-3.8 2.6-6 5.5-6s5 2.2 5.5 6"/><path d="M13.5 14.5c.8-.7 1.8-1 3-1 2.4 0 4 1.8 4.5 4.5"/>',
  kalendar:'<rect x="3.5" y="5.5" width="17" height="15" rx="2.5"/><path d="M7.5 3.5v4"/><path d="M16.5 3.5v4"/><path d="M3.5 9.5h17"/><path d="M7.5 13h.01"/><path d="M12 13h.01"/><path d="M16.5 13h.01"/><path d="M7.5 16.5h.01"/><path d="M12 16.5h.01"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>',
  smile:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a3.8 3.8 0 0 0 7 0"/><path d="M9 9.5h.01"/><path d="M15 9.5h.01"/>',
  coins:'<ellipse cx="12" cy="7" rx="6.5" ry="2.5"/><path d="M5.5 7v5c0 1.38 2.9 2.5 6.5 2.5s6.5-1.12 6.5-2.5V7"/><path d="M5.5 12c0 1.38 2.9 2.5 6.5 2.5s6.5-1.12 6.5-2.5"/>',
  clipboard:'<rect x="5.5" y="5" width="13" height="16" rx="2.5"/><path d="M9 5V3.5h6V5"/><path d="M8.5 10.5h.01"/><path d="M11 10.5h4"/><path d="M8.5 14h.01"/><path d="M11 14h4"/><path d="M8.5 17.5h.01"/><path d="M11 17.5h3"/>',
  refresh:'<path d="M20 11.5A8 8 0 0 0 6.3 6L4 8"/><path d="M4 4.5V8h3.5"/><path d="M4 12.5A8 8 0 0 0 17.7 18L20 16"/><path d="M20 19.5V16h-3.5"/>'
};
/* klíč sekce (napříč appkami) → ikona */
const ICON_KEY={prehled:'prehled',aktuality:'news',novinky:'news',dochazka:'dochazka',profil:'profil',
  platby:'platby',kalendar:'kalendar',plan:'plan',fotky:'fotky',kontakty:'kontakty',
  pruvodci:'clock',deti:'smile',fond:'coins',porady:'clipboard',nahrady:'refresh'};
function icon(key){const k=ICON_KEY[key];return k?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_SVG[k]}</svg>`:'';}
