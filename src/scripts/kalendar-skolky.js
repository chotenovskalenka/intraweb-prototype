/* Sdílený kalendář školky – tentýž Google Kalendář vidí rodiče i průvodci, proto data žijí
   mimo obě data.js (načítá se před nimi, viz <script src> v rodic.html i pruvodce.html).
   Průvodcovská appka do něj navíc promítá vlastní AKCE a služby – „spárování" kalendáře. */
const EVMAP={
  4:[{t:'Výlet předškoláků – horolezení',type:'akce'}],
  5:[{t:'Pedagogická porada – školka zavřená',type:'org'}],
  8:[{t:'Kroužek Tanečky s Niki · 15:15',type:'rozvrh'}],
  10:[{t:'Narozeniny – Eliška',type:'naro',vek:5}],
  11:[{t:'Předškolácký den',type:'rozvrh'}],
  13:[{t:'Brigáda na zahradě',type:'akce'}],
  17:[{t:'Narozeniny – Tonička',type:'naro',vek:4}],
  18:[{t:'Kroužek Živly se Shaunem · 14:00',type:'rozvrh'}],
  20:[{t:'Tatínkovský den',type:'akce'}],
  24:[{t:'Výprava do lesa',type:'akce'},{t:'Narozeniny – Kuba',type:'naro',vek:6}],
  27:[{t:'Společné focení tříd',type:'akce'}],
  30:[{t:'Konec školního roku',type:'org'},{t:'Závěrečné posezení s rodiči',type:'akce'}],
};
const TYPELAB={akce:'akce',naro:'narozeniny',rozvrh:'rozvrh',org:'organizace'};

// datum → pozice v mřížce měsíce
const daysInMonth=(y,m)=>new Date(y,m+1,0).getDate();
const firstOffset=(y,m)=>(new Date(y,m,1).getDay()+6)%7;
const wdLocal=(y,m,d)=>(new Date(y,m,d).getDay()+6)%7;
