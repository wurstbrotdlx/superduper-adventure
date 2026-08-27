// Legt die in IN1 gebrauchten Innenraum-Blaetter nach assets/cf/innen/ ab.
//
//   node tools/innen-zellen.mjs          schreibt
//   node tools/innen-zellen.mjs --pruef  schreibt nichts, vergleicht nur
//
// Braucht die lizenzierte Rohbibliothek unter Graphics/ — die liegt nicht im
// Repo, siehe README und CREDITS.md. Zero-dep (node:fs, node:zlib): anders als
// tools/ui-zellen.mjs braucht dieser Lauf keinen Browser, weil er nur schneidet
// und nicht misst.
//
// WARUM ES DIESES WERKZEUG GIBT
//
// IN1 hat die drei Innenraeume zuerst ohne Innenraumblaetter gebaut: das Pack
// hat sie, das Repo hatte sie nicht (`assets/cf/` traegt seit G5 nur, was das
// Spiel wirklich laedt, und die Rohbibliothek liegt aus Lizenzgruenden nirgends).
// Boden und Wand waren deshalb warm ueberfaerbte Kammerblaetter, die Moebel
// gezeichnet wie der Kessel. Seit der Nachlese liegen die Blaetter vor, und
// dieses Werkzeug ist der Weg von dort nach hier.
//
// ZWEI ARTEN VON EINTRAEGEN, UND WARUM
//
// `voll` kopiert ein ganzes Blatt. Das lohnt, wo mehrere Zellen gebraucht werden
// UND das Blatt klein ist: die sechs vollen Blaetter wiegen zusammen 9 KB.
//
// `zelle` schneidet einen Ausschnitt in eine eigene Datei. Der Grund steht seit
// G5 in assets/cf/README.md und gilt unveraendert: addSheet()s 'grid'-Modus kennt
// nur rowStart, keinen Spaltenversatz — eine Zelle aus der Mitte eines Blattes
// braucht eine eigene Datei. Dazu kommt das Gewicht: aus Tables.png (14 KB)
// braucht IN1 einen einzigen Tisch, aus House_Plants.png (15 KB) eine einzige
// Pflanze. Ganz eingebacken waeren das 29 KB fuer zwei Moebel.
//
// WIE DIE KOORDINATEN ENTSTANDEN SIND
//
// Nicht aus dem Rastermass geteilt — die Decor-Blaetter sitzen nicht buendig im
// 16er-Raster (ein Tisch misst 34x33 und faengt bei x72,y88 an). Gemessen wurde
// je Blatt per Inselsuche: zusammenhaengende undurchsichtige Flaechen werden
// gesucht und ihre Rechtecke ausgegeben, danach ist die Auswahl eine Frage des
// Hinsehens und keine des Zaehlens. `--pruef` rechnet beides nach: dass die
// Zelle im Blatt liegt, und dass sie tatsaechlich Farbe traegt (eine Koordinate,
// die ins Leere zeigt, faellt sonst erst im Spiel auf).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = process.env.GRAPHICS || resolve(WURZEL, 'Graphics');
const ZIEL   = resolve(WURZEL, 'assets/cf/innen');
const PRUEF  = process.argv.includes('--pruef');

const DECOR = 'Cute_Fantasy/Buildings/House_Decor';
const INNEN = 'Cute_Fantasy/Buildings/Houses_Interiors';
const AUSSEN = 'Cute_Fantasy/Outdoor decoration';

// ziel, quelle, art, [x, y, w, h], wofuer
const TABELLE = [
  // --- ganze Blaetter -------------------------------------------------------
  {ziel:'boden.png',    quelle:`${INNEN}/Wood_Floor_Tiles.png`,   art:'voll',
   wofuer:'Boden aller drei Raeume, 8x8 Zellen zu 16 Pixeln'},
  {ziel:'wand_holz.png',  quelle:`${INNEN}/Wood_Wall_Fillers.png`,  art:'voll',
   wofuer:'Wand im Wirtshaus, warmes Ziegelbraun'},
  {ziel:'wand_stein.png', quelle:`${INNEN}/Stone_Wall_Fillers.png`, art:'voll',
   wofuer:'Wand im Amt, grauer Bruchstein wie der Sockel des Inn-Blattes'},
  {ziel:'wand_ziegel.png',quelle:`${INNEN}/Brick_Wall_Fillers.png`, art:'voll',
   wofuer:'Wand in der Registratur, roter Ziegel'},
  {ziel:'regale.png',   quelle:`${DECOR}/BookShelves.png`,        art:'voll',
   wofuer:'Aktenregale: schmal (14x30) und breit (30x30), mit und ohne Ruecken'},
  {ziel:'kamin.png',    quelle:`${DECOR}/Fireplaces.png`,         art:'voll',
   wofuer:'Herdfeuer im Wirtshaus, drei Kamine zu 32x48'},

  // --- geschnittene Zellen --------------------------------------------------
  // Tables.png hat vierzehn Farbbaender zu 64 Pixeln Hoehe, je sechs Tische.
  // Band 1 (y+64) ist das dunkle Braun, das zu einer Schankstube passt; der
  // kleine Tisch (34x33) deckt zwei Kacheln, der breite (50x33) drei.
  {ziel:'tisch.png',    quelle:`${DECOR}/Tables.png`,      art:'zelle', r:[72, 88, 34, 33],
   wofuer:'Wirtshaustisch, zwei Kacheln breit'},
  // Chairs.png, Band 1 (y40), zweiter Stuhl der Gruppe: hohe Lehne, von hinten
  // gesehen — der Stuhl, den man an einen Tisch schiebt.
  {ziel:'stuhl.png',    quelle:`${DECOR}/Chairs.png`,      art:'zelle', r:[18, 40, 12, 23],
   wofuer:'Der freigehaltene Platz'},
  // Furniture_Other.png, die Kommodenreihe bei y283: sechs Farben zu 32x21, mit
  // sichtbaren Schubladenfronten und Griffen. Genau das, was ein Schreibtisch
  // mit einer zweiten Schublade braucht.
  {ziel:'pult.png',         quelle:`${DECOR}/Furniture_Other.png`, art:'zelle', r:[0, 283, 32, 21],
   wofuer:'Dienstpult im Amt, hier nimmt man Feierabend'},
  {ziel:'schreibtisch.png', quelle:`${DECOR}/Furniture_Other.png`, art:'zelle', r:[128, 283, 32, 21],
   wofuer:'Der Schreibtisch der Amtsleitung, dunkles altes Holz'},
  {ziel:'kommode.png',      quelle:`${DECOR}/Furniture_Other.png`, art:'zelle', r:[32, 283, 32, 21],
   wofuer:'Noergels Schreibtisch und Bramsches Pult, helleres Holz'},
  // House_Plants.png, Band 0, dritte Spalte: eine buschige Blattpflanze im
  // Tontopf. Sie steht auf dem Schreibtisch der Amtsleitung, und sie lebt.
  // Die erste Spalte war ein Kaktus, und ein Kaktus ist die Pflanze, die man
  // gerade NICHT giesst — das ist ein anderer Witz als der, um den es hier geht.
  {ziel:'pflanze.png',  quelle:`${DECOR}/House_Plants.png`, art:'zelle', r:[32, 2, 16, 30],
   wofuer:'Die Pflanze auf dem Schreibtisch, und sie lebt'},

  // --- Nachschlag fuer die Schankstube --------------------------------------
  // barrels.png liegt unter "Outdoor decoration" und ist trotzdem das Blatt,
  // das dieses Wirtshaus am dringendsten gebraucht hat. Genommen ist das
  // geschlossene Fass ohne Inhalt (die Reihe darueber traegt Beeren, Wasser und
  // Kraeuter, die Reihe darunter Blumen) — ein Fass, in dem etwas anderes ist
  // als das, was ein Wirt ausschenkt, waere die falsche Auskunft.
  {ziel:'fass.png',     quelle:`${AUSSEN}/barrels.png`,    art:'zelle', r:[49, 13, 15, 19],
   wofuer:'Fass in der Schankstube. Der Wirt heisst Fass'},
  // Benches.png hat zwei Baenke: eine steinerne und eine hoelzerne. IN1 hat die
  // Bank gezeichnet, weil Chairs.png nur Sofas hat — dieses Blatt lag im
  // Aussenordner und war deshalb nicht gesucht worden.
  {ziel:'bank.png',     quelle:`${AUSSEN}/Benches.png`,    art:'zelle', r:[33, 6, 31, 21],
   wofuer:'Wirtshausbank, zwei Kacheln breit'},
  // Indoor_Decor.png, rechte Spalte: drei Hocker mit gepolstertem Sitz. Der rote
  // steht an der Theke.
  {ziel:'hocker.png',   quelle:`${DECOR}/Indoor_Decor.png`, art:'zelle', r:[83, 50, 9, 13],
   wofuer:'Barhocker an der Theke'},
  // Placeable_Decoration.png ist ein Blatt voller Kleinzeug: Flaschen, Schalen,
  // Kerzen, ein Buch, ein Kessel. Zwei davon stehen auf Moebeln statt auf dem
  // Boden und bekommen deshalb kein eigenes Feld im Grundriss.
  {ziel:'kerze.png',    quelle:`${DECOR}/Placeable_Decoration.png`, art:'zelle', r:[5, 132, 6, 11],
   wofuer:'Kerze auf dem Tisch, mit Halter'},
  {ziel:'flasche.png',  quelle:`${DECOR}/Placeable_Decoration.png`, art:'zelle', r:[4, 3, 7, 11],
   wofuer:'Flasche auf der Theke'},
  // windows.png hat vier Reihen desselben Fensters: Abend, Nacht, Tag, blank.
  // Genommen ist die oberste — Violett oben, Rosa und Orange darunter. Man
  // betritt diese Haeuser zum Feierabend, und das ist die Stunde, die dort
  // hinter der Scheibe steht. Von den drei Sprossenfassungen die erste, das
  // Kreuz: es ist die einzige, die auf 14 Pixeln noch als Fenster lesbar ist.
  {ziel:'fenster.png',  quelle:`${DECOR}/windows.png`,      art:'zelle', r:[1, 7, 14, 21],
   wofuer:'Fenster in der Wand der Schankstube, Abendhimmel'},
  // Clocks.png: zwei Standuhren (14x30) und ein Dutzend runder Wanduhren. Die
  // zweite Standuhr hat den geschlossenen Kasten; die erste hat unten ein
  // offenes Fach, und ein offenes Fach in einer Uhr sieht aus wie ein Schaden.
  {ziel:'standuhr.png', quelle:`${DECOR}/Clocks.png`,       art:'zelle', r:[17, 1, 14, 30],
   wofuer:'Standuhr im Wirtshaus. Es heisst Zum Letzten Stempel'},
];

// --- PNG lesen und schreiben, dieselbe Bauart wie innen-tuer-messlauf.mjs ----
function readChunks(buf){
  const out = []; let p = 8;
  while(p < buf.length){
    const len = buf.readUInt32BE(p);
    out.push({type: buf.toString('ascii', p+4, p+8), data: buf.subarray(p+8, p+8+len)});
    p += 12 + len;
  }
  return out;
}
function unfilter(raw, w, h, ch){
  const stride = w*ch, out = Buffer.alloc(h*stride);
  let p = 0;
  for(let y = 0; y < h; y++){
    const ft = raw[p++];
    for(let x = 0; x < stride; x++){
      const rb = raw[p+x];
      const a = x >= ch ? out[y*stride + x - ch] : 0;
      const b = y > 0 ? out[(y-1)*stride + x] : 0;
      const c = (x >= ch && y > 0) ? out[(y-1)*stride + x - ch] : 0;
      let v;
      switch(ft){
        case 0: v = rb; break;
        case 1: v = rb + a; break;
        case 2: v = rb + b; break;
        case 3: v = rb + ((a+b) >> 1); break;
        case 4: {
          const pp = a + b - c, pa = Math.abs(pp-a), pb = Math.abs(pp-b), pc = Math.abs(pp-c);
          v = rb + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); break;
        }
        default: throw new Error('Filtertyp ' + ft);
      }
      out[y*stride + x] = v & 255;
    }
    p += stride;
  }
  return out;
}
function decodePNG(file){
  const chunks = readChunks(readFileSync(file));
  const ih = chunks.find(c => c.type === 'IHDR');
  const w = ih.data.readUInt32BE(0), h = ih.data.readUInt32BE(4);
  const bd = ih.data.readUInt8(8), ct = ih.data.readUInt8(9);
  if(ih.data.readUInt8(12) !== 0) throw new Error('Adam7 nicht unterstuetzt: ' + file);
  if(bd !== 8) throw new Error('Bittiefe ' + bd + ' nicht unterstuetzt: ' + file);
  const ch = ct === 6 ? 4 : ct === 2 ? 3 : ct === 3 ? 1 : ct === 4 ? 2 : 0;
  if(!ch) throw new Error('Farbtyp ' + ct + ' nicht unterstuetzt: ' + file);
  const px = unfilter(inflateSync(Buffer.concat(chunks.filter(c => c.type === 'IDAT').map(c => c.data))), w, h, ch);
  const rgba = new Uint8Array(w*h*4);
  const plte = chunks.find(c => c.type === 'PLTE'), trns = chunks.find(c => c.type === 'tRNS');
  for(let i = 0; i < w*h; i++){
    let r, g, b, a = 255;
    if(ch === 4){ r = px[i*4]; g = px[i*4+1]; b = px[i*4+2]; a = px[i*4+3]; }
    else if(ch === 3){ r = px[i*3]; g = px[i*3+1]; b = px[i*3+2]; }
    else if(ch === 2){ r = g = b = px[i*2]; a = px[i*2+1]; }
    else { const q = px[i]; r = plte.data[q*3]; g = plte.data[q*3+1]; b = plte.data[q*3+2];
           a = (trns && q < trns.data.length) ? trns.data[q] : 255; }
    rgba[i*4] = r; rgba[i*4+1] = g; rgba[i*4+2] = b; rgba[i*4+3] = a;
  }
  return {w, h, rgba};
}
const crc32 = (() => {
  const t = [];
  for(let n = 0; n < 256; n++){ let c = n; for(let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c>>>1) : c>>>1; t[n] = c>>>0; }
  return b => { let c = 0xFFFFFFFF; for(const x of b) c = t[(c^x)&255] ^ (c>>>8); return (c ^ 0xFFFFFFFF)>>>0; };
})();
function chunk(type, data){
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePNG(w, h, rgba){
  const raw = Buffer.alloc(h*(w*4+1));
  for(let y = 0; y < h; y++){
    raw[y*(w*4+1)] = 0;
    for(let x = 0; x < w*4; x++) raw[y*(w*4+1)+1+x] = rgba[y*w*4+x];
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', ihdr),
                        chunk('IDAT', deflateSync(raw, {level: 9})), chunk('IEND', Buffer.alloc(0))]);
}

// ---------------------------------------------------------------------------
if(!existsSync(QUELLE)){
  console.error(`Rohbibliothek fehlt: ${QUELLE}`);
  console.error('Sie liegt aus Lizenzgruenden nicht im Repo (siehe CREDITS.md).');
  console.error('Pfad ueber die Umgebungsvariable GRAPHICS setzen, wenn sie woanders steht.');
  process.exit(2);
}
if(!PRUEF && !existsSync(ZIEL)) mkdirSync(ZIEL, {recursive: true});

let fehl = 0;
for(const e of TABELLE){
  const quellPfad = resolve(QUELLE, e.quelle);
  if(!existsSync(quellPfad)){ console.error(`FEHL  ${e.ziel}: Quelle fehlt (${e.quelle})`); fehl++; continue; }
  const src = decodePNG(quellPfad);

  let w, h, rgba, deckung;
  if(e.art === 'voll'){
    ({w, h, rgba} = src);
    deckung = 1;
  } else {
    const [rx, ry, rw, rh] = e.r;
    if(rx < 0 || ry < 0 || rx + rw > src.w || ry + rh > src.h){
      console.error(`FEHL  ${e.ziel}: Zelle ${rx},${ry} ${rw}x${rh} liegt nicht in ${src.w}x${src.h}`); fehl++; continue;
    }
    w = rw; h = rh; rgba = new Uint8Array(rw*rh*4);
    let deckend = 0;
    for(let y = 0; y < rh; y++) for(let x = 0; x < rw; x++){
      const s = ((ry+y)*src.w + rx+x)*4, d = (y*rw + x)*4;
      for(let c = 0; c < 4; c++) rgba[d+c] = src.rgba[s+c];
      if(src.rgba[s+3] > 16) deckend++;
    }
    deckung = deckend / (rw*rh);
    // Eine Koordinate, die ins Leere zeigt, faellt sonst erst im Spiel auf, und
    // dort als fehlendes Moebel statt als falsche Zahl.
    if(deckung < 0.2){
      console.error(`FEHL  ${e.ziel}: nur ${(deckung*100).toFixed(0)}% der Zelle traegt Farbe — Koordinate pruefen`); fehl++; continue;
    }
  }

  const daten = encodePNG(w, h, rgba);
  const zielPfad = resolve(ZIEL, e.ziel);
  const alt = existsSync(zielPfad) ? readFileSync(zielPfad) : null;
  const gleich = alt && alt.length === daten.length && alt.equals(daten);

  if(PRUEF){
    if(!alt){ console.error(`FEHL  ${e.ziel}: fehlt in ${ZIEL}`); fehl++; }
    else if(!gleich){ console.error(`FEHL  ${e.ziel}: weicht vom Schnitt ab`); fehl++; }
    else console.log(`ok    ${e.ziel.padEnd(18)} ${String(w+'x'+h).padEnd(9)} ${e.wofuer}`);
  } else {
    if(!gleich) writeFileSync(zielPfad, daten);
    console.log(`${gleich ? 'gleich' : 'neu   '} ${e.ziel.padEnd(18)} ${String(w+'x'+h).padEnd(9)} ${(daten.length/1024).toFixed(1)} KB  ${e.wofuer}`);
  }
}
console.log(`\n${TABELLE.length - fehl} von ${TABELLE.length} Blaettern in Ordnung.`);
process.exit(fehl ? 1 : 0);
