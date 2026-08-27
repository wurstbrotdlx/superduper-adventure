#!/usr/bin/env node
// IN1: Sitzt die Schwelle unter der gemalten Tuer?
//
//   node tools/innen-tuer-messlauf.mjs
//   node tools/innen-tuer-messlauf.mjs assets/cf/deco/Buildings/Inn_Blue.png
//
// Der Eingang eines betretbaren Hauses darf nicht in der Mitte des Fussabdrucks
// geraten werden. Die drei Blaetter setzen ihre Tuer an drei verschiedene
// Stellen: das Inn-Blatt zwei Kacheln links der Mitte, House_2 weit links,
// House_3 rechts. Wer die Mitte nimmt, laesst den Spieler durch die Hauswand
// gehen, waehrend die gemalte Tuer daneben zu bleibt.
//
// Der Lauf ist ausdruecklich eine PRUEFUNG und kein Sucher. Die Zahl in
// CF_BLD.tuerDx ist am gerasterten Blatt abgelesen, so wie die deck-Werte aus G6
// an der Alpha-Bounding-Box abgelesen sind; ein Automat, der eine Tuer in einem
// Fachwerkhaus zuverlaessig findet, waere ein groesseres Werkzeug als der
// Bauabschnitt. Ein erster Anlauf, der die dunkelste Spaltengruppe suchte, fand
// bei allen sechs Blaettern den Schattenrand am rechten Bildrand.
//
// Geprueft wird deshalb, was eine Tuer ohne Ausnahme erfuellt und eine Wand
// nicht:
//
//   (1) sie steht auf dem Boden      an der genannten Spalte reicht das Blatt
//                                    bis zur untersten undurchsichtigen Zeile
//   (2) sie ist aus Holz             im unteren Drittel sind dort mehr braune
//                                    Pixel als im Blattdurchschnitt
//   (3) sie liegt im Haus            die Spalte liegt innerhalb des Blattes und
//                                    nicht auf seinen aeussersten vier Spalten,
//                                    wo die Umrisslinie sitzt
//
// Ausgegeben wird dazu das Braunprofil des unteren Viertels, damit man beim
// Nachtragen eines vierten Hauses sieht, wo man hinschauen muss. Exit-Code 1,
// sobald eine Zeile nicht stimmt.
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

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
      const rawB = raw[p+x];
      const a = x >= ch ? out[y*stride + x - ch] : 0;
      const b = y > 0 ? out[(y-1)*stride + x] : 0;
      const c = (x >= ch && y > 0) ? out[(y-1)*stride + x - ch] : 0;
      let v;
      switch(ft){
        case 0: v = rawB; break;
        case 1: v = rawB + a; break;
        case 2: v = rawB + b; break;
        case 3: v = rawB + ((a+b) >> 1); break;
        case 4: {
          const pp = a + b - c, pa = Math.abs(pp-a), pb = Math.abs(pp-b), pc = Math.abs(pp-c);
          v = rawB + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); break;
        }
        default: throw new Error('Filtertyp ' + ft);
      }
      out[y*stride + x] = v & 255;
    }
    p += stride;
  }
  return out;
}
// Liefert {w, h, rgba}. Deckt die Farbtypen der Cute-Fantasy-Blaetter ab
// (6 = RGBA, 4 = Grau+Alpha, 3 = Palette, 2 = RGB); mehr braucht dieser Lauf nicht.
function decodePNG(file){
  const chunks = readChunks(readFileSync(file));
  const ihdr = chunks.find(c => c.type === 'IHDR');
  const w = ihdr.data.readUInt32BE(0), h = ihdr.data.readUInt32BE(4);
  const bitDepth = ihdr.data.readUInt8(8), colorType = ihdr.data.readUInt8(9);
  if(ihdr.data.readUInt8(12) !== 0) throw new Error('Adam7 nicht unterstuetzt: ' + file);
  if(bitDepth !== 8) throw new Error('Bittiefe ' + bitDepth + ' nicht unterstuetzt: ' + file);
  const ch = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 3 ? 1 : colorType === 4 ? 2 : 0;
  if(!ch) throw new Error('Farbtyp ' + colorType + ' nicht unterstuetzt: ' + file);
  const px = unfilter(inflateSync(Buffer.concat(chunks.filter(c => c.type === 'IDAT').map(c => c.data))), w, h, ch);
  const rgba = new Uint8Array(w*h*4);
  const plte = chunks.find(c => c.type === 'PLTE'), trns = chunks.find(c => c.type === 'tRNS');
  for(let i = 0; i < w*h; i++){
    let r, g, b, a = 255;
    if(ch === 4){ r = px[i*4]; g = px[i*4+1]; b = px[i*4+2]; a = px[i*4+3]; }
    else if(ch === 3){ r = px[i*3]; g = px[i*3+1]; b = px[i*3+2]; }
    else if(ch === 2){ r = g = b = px[i*2]; a = px[i*2+1]; }
    else { const idx = px[i]; r = plte.data[idx*3]; g = plte.data[idx*3+1]; b = plte.data[idx*3+2];
           a = (trns && idx < trns.data.length) ? trns.data[idx] : 255; }
    rgba[i*4] = r; rgba[i*4+1] = g; rgba[i*4+2] = b; rgba[i*4+3] = a;
  }
  return {w, h, rgba};
}

// Tuerholz: mittleres Braun, klar waermer als der Stein und dunkler als der
// Putz. Die Schranken sind an den drei Blaettern abgelesen und absichtlich weit
// — geprueft wird ein Verhaeltnis, kein Farbwert.
const holzig = (r, g, b) => r > 95 && r < 205 && r - b > 45 && r - g > 22 && g > b;

// Die Tabelle aus CF_BLD in index.html. Sie steht hier ein zweites Mal, und das
// ist genau der Zweck des Laufs: zwei Zahlen, die auseinanderlaufen koennen,
// gegeneinander messen. Wer in index.html ein tuerDx aendert, aendert es hier
// mit, sonst schlaegt der Lauf an.
const HAEUSER = [
  {datei: 'Inn_Blue.png',               ax: 120, tuerDx: -16, raum: 'amt'},
  {datei: 'House_2_Wood_Base_Blue.png', ax: 72,  tuerDx: -33, raum: 'registratur'},
  {datei: 'House_3_Stone_Base_Blue.png',ax: 72,  tuerDx: 17,  raum: 'wirtshaus'},
];

const zeilen = [];
let fehl = 0;

// RIEGEL (27.08.2026, INTRO-MESSUNG Pruefung 4): Das Protokoll gehoert dem Lauf
// und nicht seinem guten Ende. Bis hierher stand der Druck ganz unten, und eine
// ungefangene Ausnahme mittendrin nahm ihn mit -- Exit-Code 1, ein Stapelabzug,
// und keine Zeile darueber, was geprueft wurde und was nicht. Nachgestellt:
// null von 96 Zeilen, wenn der Lauf vor seinem Ende stirbt.
//
// Der ABBRUCH-Hinweis ist dabei nicht die Zierde, sondern der Kern. Ohne ihn
// meldet ein abgebrochener Lauf "40 von 40 Pruefungen bestanden", und das liest
// sich wie ein sauberer Durchlauf, obwohl der ganze Rest nie gelaufen ist.
let berichtet = false, fertig = false;
function bericht(){
  if(berichtet) return;
  berichtet = true;
  console.log('\n' + zeilen.join('\n'));
  console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
  if(!fertig) console.log(
      'ABBRUCH: der Lauf ist vor seinem Ende gestorben. Die Zeile darueber zaehlt nur,\n'
    + 'was bis dahin lief -- alles danach ist UNGEPRUEFT und nicht etwa in Ordnung.\n'
    + 'Die Ursache steht als Ausnahme darunter.');
}
process.on('exit', bericht);

function pruef(name, ist, soll){
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(56)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}

const nurProfil = process.argv.length > 2;
const liste = nurProfil
  ? process.argv.slice(2).map(f => ({datei: f.split('/').pop(), pfad: f, ax: null, tuerDx: null}))
  : HAEUSER.map(h => ({...h, pfad: 'assets/cf/deco/Buildings/' + h.datei}));

for(const h of liste){
  const {w, hoehe, rgba, y0, y1} = (() => {
    const d = decodePNG(h.pfad);
    let y0 = d.h, y1 = -1;
    for(let y = 0; y < d.h; y++) for(let x = 0; x < d.w; x++)
      if(rgbaA(d, x, y) > 16){ if(y < y0) y0 = y; if(y > y1) y1 = y; break; }
    return {w: d.w, hoehe: d.h, rgba: d.rgba, y0, y1};
  })();
  function rgbaA(d, x, y){ return d.rgba[(y*d.w + x)*4 + 3]; }
  const von = y1 - Math.round((y1 - y0) / 4);
  const braun = [];
  for(let x = 0; x < w; x++){
    let n = 0;
    for(let y = von; y <= y1; y++){
      const i = (y*w + x)*4;
      if(rgba[i+3] > 16 && holzig(rgba[i], rgba[i+1], rgba[i+2])) n++;
    }
    braun.push(n);
  }
  const max = Math.max(...braun) || 1;
  const schnitt = braun.reduce((a, b) => a + b, 0) / w;
  console.log(`\n${h.datei}  ${w}x${hoehe}  Blatt y ${y0}..${y1}, gemessen ab y=${von}`);
  console.log('  ' + braun.map(v => v === 0 ? ' ' : v > max*0.75 ? '#' : v > max*0.45 ? '+' : '.').join(''));
  console.log('  ' + [...Array(w).keys()].map(i => i % 16 === 0 ? '|' : (i % 8 === 0 ? '+' : ' ')).join(''));
  if(nurProfil) continue;

  const spalte = Math.round(h.ax + h.tuerDx);
  console.log('  ' + ' '.repeat(Math.max(0, spalte)) + `^ tuerDx ${h.tuerDx > 0 ? '+' : ''}${h.tuerDx} (Spalte ${spalte}, Raum ${h.raum})`);
  // (1) Die Tuer steht auf dem Boden.
  let untersteZeile = -1;
  for(let y = y1; y >= y0; y--) if(rgba[(y*w + spalte)*4 + 3] > 16){ untersteZeile = y; break; }
  pruef(`${h.raum}: die Tuer reicht bis zur Fusslinie des Blattes`, untersteZeile >= y1 - 2, true);
  // (2) Sie ist aus Holz, und zwar mehr als der Durchschnitt des Blattes.
  pruef(`${h.raum}: an der Spalte steht Holz, nicht Wand`, braun[spalte] > schnitt, true);
  // (3) Sie liegt im Blatt und nicht auf der Umrisslinie.
  pruef(`${h.raum}: die Spalte liegt im Blatt, nicht am Rand`, spalte >= 4 && spalte < w - 4, true);
}

// --profil druckt absichtlich nur das Braunprofil. Ohne das berichtet=true
// haenge der Abbruchbericht sich an diesen Ausgang und meldete einen
// Abbruch, den es nicht gibt.
if(nurProfil){ berichtet = true; process.exit(0); }
fertig = true;
bericht();
process.exit(fehl ? 1 : 0);
