// Schneidet die in U2 gebrauchten Einzelzellen aus den Cute_Fantasy_UI-Blaettern.
//
//   node tools/ui-zellen.mjs          schreibt nach assets/cf/ui/
//   node tools/ui-zellen.mjs --pruef  schneidet nichts, vergleicht nur
//
// Braucht Playwright (wie die Messlaeufe) und die lizenzierte Rohbibliothek unter
// Graphics/ — beides liegt nicht im Repo, siehe README und CREDITS.md.
//
// WARUM ES DIESES WERKZEUG GIBT
//
// G5 hat vier Zellen von Hand geschnitten und die Koordinaten in
// assets/cf/README.md notiert. Das ging bei vier Zellen. Der Grund fuer das
// Schneiden ueberhaupt steht dort ebenfalls: addSheet()s 'grid'-Modus kennt nur
// rowStart, keinen Spaltenversatz — eine Zelle aus der Mitte eines Blattes
// braucht deshalb eine eigene Datei. Und CSS kann ohnehin keinen Ausschnitt
// adressieren: border-image und background-image nehmen immer die ganze Datei.
//
// Von Hand geschnitten heisst aber: nicht nachpruefbar. Wer wissen will, ob
// ui/btn_pill.png wirklich aus UI_Buttons.png bei (1,17) stammt, muss es glauben.
// Hier steht die Tabelle im Quelltext, und `--pruef` rechnet nach. Das ist
// dieselbe Haltung wie bei tools/sheet-audit.mjs: gemessen, nicht geraten.
//
// WIE DIE KOORDINATEN ENTSTANDEN SIND
//
// Nicht aus dem Rastermass geteilt — die Blaetter sind gemischt gerastert
// (UI_Frames 48er, UI_Buttons 16er, UI_Premade gar nicht) und die Zellen sitzen
// nicht buendig in ihren Kaesten. Gemessen wurde je Zelle per Alpha-Bounding-Box
// ueber ein Fenster, das mit einer Leerspalten-Suche gefunden wurde: eine Spalte,
// in der jedes Pixel alpha=0 hat, trennt zwei Zellen. Wo eine Zelle in einer
// Flaeche sitzt statt frei zu stehen, kam eine Pixelsonde entlang einer Zeile und
// einer Spalte dazu, die die Farben unterscheidet.
//
// Die Sonde ist auch der Grund, warum der Beutel-Slot aus UI_Premade wieder
// rausflog: sie hat den Panel-Grund (228,166,114) in den vier Ecken gefunden,
// aber erst der Einbau hat gezeigt, was das heisst. Siehe die Notiz bei
// slot_dark.png unten — eine gemessene Koordinate ist noch keine passende Zelle.
//
// Der Browser ist hier nur Bilddecoder. Node bringt keinen mit, und ein eigener
// PNG-Leser waere mehr Code als dieses ganze Werkzeug.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = resolve(WURZEL, 'Graphics/Cute_Fantasy_UI/UI');
const ZIEL   = resolve(WURZEL, 'assets/cf/ui');
const PRUEF  = process.argv.includes('--pruef');

// [Zieldatei, Quellblatt, x, y, w, h, wofuer]
// Die Reihenfolge ist die des Phasendokuments phase-u2-menuegrafik.md.
const ZELLEN = [
  ['slot_dark.png', 'UI_Buttons.png', 129, 17, 14, 14,
   'Beutel-, Ausruestungs-, Zutaten- und Symbolfelder. Abgerundetes Rechteck, '
   + 'dunkle Tonstufe: dunkler Kern, heller Rand. Ohne fill, also bleibt nur '
   + 'der helle Rand und der dunkle Grund des Panels steht weiter unter dem '
   + 'Text.\n'
   + '   Der naheliegende Kandidat war UI_Premade (113,33) 18x18 — das Feld aus '
   + 'der fertigen Beuteltafel des Packs. Er ist verworfen, und zwar nach dem '
   + 'ersten Einbau: dieses Feld ist fuer eine HELLE Tafel gezeichnet. Seine vier '
   + 'abgerundeten Ecken zeigen deren Grund (228,166,114), und auf dem dunklen '
   + 'Panel des Ministeriums leuchten daraus vier lachsfarbene Eckpunkte. '
   + 'Dieselbe Falle steckt in allen UI_Frames-Zellen: helle Kacheln fuer helle '
   + 'Oberflaechen. Was auf dunklem Grund traegt, sind die dunklen Tonstufen der '
   + 'Knopffamilie — die hier.'],

  ['btn_close.png', 'UI_Buttons.png', 737, 33, 14, 14,
   'Schliessknopf der Panels. Runde Form mit eingepraegtem X, dieselbe '
   + 'Zellenfamilie wie round_brown.png aus G5 (x=96) — nur die Spaltengruppe '
   + 'mit dem X-Symbol und die Zeile mit der runden Form.\n'
   + '   Von den drei Tonstufen der Gruppe (721 hell, 737 mittel, 753 dunkel) '
   + 'ist es die mittlere, und das ist eine Kontrastentscheidung, keine '
   + 'Geschmacksfrage: das X ist in allen dreien dasselbe blockige Kreuz, aber '
   + 'nur bei 737 steht es braun auf einer breiten cremefarbenen Flaeche. Bei '
   + '721 liegt es fast tongleich auf der Scheibe, bei 753 dunkel auf dunkel. '
   + 'Auf 28px heruntergerechnet las sich 721 als Scheibe ohne Zeichen.'],

  ['btn_pill.png', 'UI_Buttons.png', 1, 17, 30, 14,
   'Breite Knoepfe: Kessel-Kochknopf, Overlay-Knoepfe, Steigern-Knoepfe. '
   + 'Abgerundetes Rechteck, Tonstufe hell. Waagerecht dehnbar, weil die Mitte '
   + 'flach ist (border-image 5 7 6 7 fill).'],

  ['sel_white.png', 'UI_Selectors.png', 11, 10, 26, 28,
   'Auswahlrahmen (gestrichelt) fuer das ausgeruestete Teil und den aktiven '
   + 'Zauber. Ersetzt den blauen CSS-Rand, der aus keiner Grafik stammte.'],
];

if(!existsSync(QUELLE)){
  console.error(`Rohbibliothek fehlt: ${QUELLE}`);
  console.error('Cute_Fantasy_UI aus der eigenen Lizenz nach Graphics/ legen (s. README).');
  process.exit(1);
}

const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();

let abweichungen = 0;
for(const [ziel, blatt, x, y, w, h, wofuer] of ZELLEN){
  const quellPfad = resolve(QUELLE, blatt);
  if(!existsSync(quellPfad)){ console.error(`fehlt: ${blatt}`); abweichungen++; continue; }

  const dataUrl = 'data:image/png;base64,' + readFileSync(quellPfad).toString('base64');
  const roh = await page.evaluate(async ({dataUrl, x, y, w, h}) => {
    const img = new Image();
    await new Promise((ok, weg) => { img.onload = ok; img.onerror = weg; img.src = dataUrl; });
    if(x + w > img.width || y + h > img.height)
      return {fehler: `Ausschnitt ${x},${y},${w},${h} liegt ausserhalb von ${img.width}x${img.height}`};
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.drawImage(img, x, y, w, h, 0, 0, w, h);
    // Deckungsgrad mitmelden: eine versehentlich leere oder randlose Zelle faellt
    // sonst erst im Spiel auf, und dort als "die Grafik ist irgendwie weg".
    const d = c.getImageData(0, 0, w, h).data;
    let deckung = 0;
    for(let i = 3; i < d.length; i += 4) if(d[i] > 0) deckung++;
    return {png: cv.toDataURL('image/png'), deckung: deckung / (w * h)};
  }, {dataUrl, x, y, w, h});

  if(roh.fehler){ console.error(`${ziel}: ${roh.fehler}`); abweichungen++; continue; }
  if(roh.deckung < 0.10){
    console.error(`${ziel}: nur ${(roh.deckung*100).toFixed(0)}% der Zelle ist deckend — Koordinate pruefen`);
    abweichungen++; continue;
  }

  const bytes = Buffer.from(roh.png.split(',')[1], 'base64');
  const zielPfad = resolve(ZIEL, ziel);
  const alt = existsSync(zielPfad) ? readFileSync(zielPfad) : null;
  const gleich = alt && alt.equals(bytes);

  if(PRUEF){
    if(!alt){ console.error(`${ziel}: fehlt in assets/cf/ui/`); abweichungen++; }
    else if(!gleich){ console.error(`${ziel}: weicht vom Schnitt ab`); abweichungen++; }
    else console.log(`ok    ${ziel.padEnd(16)} ${blatt} (${x},${y}) ${w}x${h}, ${(roh.deckung*100).toFixed(0)}% deckend`);
    continue;
  }

  mkdirSync(ZIEL, {recursive: true});
  writeFileSync(zielPfad, bytes);
  console.log(`${gleich ? 'gleich' : 'neu   '} ${ziel.padEnd(16)} ${blatt} (${x},${y}) ${w}x${h}, `
            + `${(roh.deckung*100).toFixed(0)}% deckend, ${bytes.length} B`);
  console.log(`       ${wofuer.replace(/\s+/g, ' ')}`);
}

await browser.close();

if(abweichungen){
  console.error(`\n${abweichungen} Abweichung(en).`);
  process.exit(1);
}
console.log(`\n${ZELLEN.length} Zellen ${PRUEF ? 'geprueft' : 'geschnitten'}.`);
