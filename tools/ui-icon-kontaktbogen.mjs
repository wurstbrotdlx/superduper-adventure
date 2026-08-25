// Kontaktbogen fuer Sinnbild-Kandidaten (Bauabschnitt U11).
//
//   node tools/ui-icon-kontaktbogen.mjs [--out datei.png] [--knopf 56] [--icon 32]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe, dazu die
// lizenzierte Rohbibliothek unter Graphics/ — beides liegt nicht im Repo, siehe
// README und CREDITS.md.
//
// WARUM ES DIESES WERKZEUG GIBT
//
// Ein Icon-Blatt anzusehen sagt nichts darueber, wie eine Zelle auf DIESEM Knopf
// steht. UI_Icons.png und UI_Crosshairs.png werden auf dunklem Grund
// ausgeliefert, und auf dunklem Grund sehen die weissen Zielkreuze aus den
// ersten Zeilen vollkommen brauchbar aus. Auf dem hellen Achteck von
// round_brown.png zerfallen dieselben Zellen zu Streuseln — sie bestehen aus
// einzelnen weissen Punkten, und denen fehlt dort der Kontrast.
//
// Genau diesen Fehler haette U11 gemacht. Der Bogen stellt deshalb jeden
// Kandidaten dorthin, wo er wirklich stehen wird:
//
//   - auf das echte Achteck (assets/cf/ui/round_brown.png),
//   - in der echten Anzeigegroesse (Knopf 56, Sinnbild 32 — die Masse am
//     Finger; --knopf und --icon stellen sie um),
//   - auf den Ton des Dorfwegs als Grund, nicht auf Schwarz,
//   - bei deviceScaleFactor 3, wie ein Telefon es zeichnet.
//
// UND ZWEIMAL, auf beiden Gruenden des Spiels. Sinnbilder stehen hier an zwei
// ganz verschiedenen Orten: im Knopf auf hellem Achteck und im Panelkopf auf
// dunklem Grund (rgba(20,14,24,.96)). Was auf dem einen traegt, kann auf dem
// anderen verschwinden — genau die Falle, an der in U2 der Beutel-Slot aus
// UI_Premade gescheitert ist (helle Kachel auf dunklem Panel, vier lachsfarbene
// Eckpunkte). Der Bogen zeigt deshalb jede Zelle links im Knopf und rechts auf
// dem Panelgrund in Kopfzeilen-Groesse.
//
// KANDIDATEN stehen als Tabelle im Quelltext, wie in tools/ui-zellen.mjs und aus
// demselben Grund: eine Auswahl, die man nicht nachschlagen kann, ist keine.
// Wer neue Zellen sucht, traegt sie hier ein, laesst den Bogen laufen und
// uebernimmt die Gewinner nach ui-zellen.mjs.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = resolve(WURZEL, 'Graphics');
const UI     = 'Cute_Fantasy_UI/UI';

const args = process.argv.slice(2);
const wert = (name, ersatz) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : ersatz;
};
const OUT   = wert('--out', 'ui-icon-kontaktbogen.png');
const KNOPF = +wert('--knopf', 56);
const ICON  = +wert('--icon', 32);

// [Beschriftung, Blatt (relativ zu Graphics/), x, y]  — alle Zellen 16x16.
const KANDIDATEN = [
  // U11/U12 — die Sinnbilder der Bedienoberflaeche, samt der Kandidaten, die
  // durchgefallen sind: ein Bogen, der nur die Gewinner zeigt, belegt nichts.
  ['Schlag: Klingen',     `${UI}/UI_Icons.png`,      112,  16],
  ['Trank: Rundkolben',   'Cute_Fantasy/Icons/No Outline/Food_Icons_NO_Outline.png', 112, 128],
  ['Zauber: Stern blau',  `${UI}/UI_Icons.png`,      144,  48],
  ['Zauber: Stern gold',  `${UI}/UI_Icons.png`,       48,   0],
  ['Rucksack (genommen)', `${UI}/UI_Icons.png`,      144,  32],
  ['Rucksack: flach',     `${UI}/UI_Icons.png`,      160,  32],
  ['Charakter: Buch rot', `${UI}/UI_Icons.png`,      192,  16],
  ['Ziel: geschlossen',   `${UI}/UI_Crosshairs.png`,   0, 128],
  ['Ziel: Punkte (weg)',  `${UI}/UI_Crosshairs.png`,   0,   0],
  ['Sperre: Verbot',      `${UI}/UI_Icons.png`,      208,  80],
  ['Abbruch: rotes X',    `${UI}/UI_Icons.png`,      176,  80],
  ['Hand (Kontext)',      `${UI}/UI_Icons.png`,       48, 224],
  ['Gold/Beute',          `${UI}/UI_Icons.png`,       96,   0],
  ['Optionen: Zahnrad',   `${UI}/UI_Icons.png`,       32,  16],
  ['Ton: Lautsprecher',   `${UI}/UI_Icons.png`,      160,  64],
  ['Ton: Umriss (weg)',   `${UI}/UI_Icons.png`,      144,  64],
  ['Schrift: grosses A',  `${UI}/UI_Button_Icons.png`, 160, 32],
  ['Spielstand: Disk',    `${UI}/UI_Icons.png`,      144,  16],
  ['Kladde: Buch gruen',  `${UI}/UI_Icons.png`,      176,  16],
  ['Akten: Buch orange',  `${UI}/UI_Icons.png`,      208,  16],
  ['Amtskunde: Buch bl.', `${UI}/UI_Icons.png`,      160,  16],
  ['Ausruestung: Schild', `${UI}/UI_Icons.png`,      192,   0],
  ['Schloss: Schluessel', `${UI}/UI_Icons.png`,      208,  48],
  ['Aktenfund: Brief',    `${UI}/UI_Icons.png`,      224,  16],
  ['Kraft: Schwert',      `${UI}/UI_Icons.png`,       16,  16],
  ['Zaehigkeit: Herz',    `${UI}/UI_Icons.png`,        0,   0],
  ['Behaendigk.: Blitz',  `${UI}/UI_Icons.png`,      144,   0],
  ['Im Dienst: Krone',    `${UI}/UI_Icons.png`,       64,  16],
  ['Zettel: Sprechblase', `${UI}/UI_Icons.png`,        0,  16],
  ['Kessel: Einmachglas', 'Cute_Fantasy/Icons/No Outline/Food_Icons_NO_Outline.png', 16, 64],

  // Der Nachtrag zu U12. Der Schraubenschluessel war die schwaechste Zuordnung
  // des Satzes, und der Fehler dahinter war, nur UI_Icons.png abzusuchen:
  // UI_Bars.png traegt den Balkenstapel, mit dem dieses Spiel Leben, Mana und
  // Erfahrung anzeigt. Gegen ein Blatt, das gar nicht aufgeschlagen wird, hilft
  // auch der beste Bogen nicht — deshalb stehen die Balken jetzt hier.
  ['WERTE: Balken (jetzt)',   `${UI}/UI_Bars.png`,   0,  0],
  ['WERTE: Schraubenschl.',   `${UI}/UI_Icons.png`, 48, 16],
  ['WERTE: Balken weiss',     `${UI}/UI_Bars.png`,   0, 96],
  ['WERTE: Pokal (weg)',      `${UI}/UI_Icons.png`, 80, 16],
];

if(!existsSync(QUELLE)){
  console.error(`Rohbibliothek fehlt: ${QUELLE}`);
  console.error('Cute_Fantasy und Cute_Fantasy_UI aus der eigenen Lizenz nach Graphics/ legen (s. README).');
  process.exit(1);
}
const RUND = resolve(WURZEL, 'assets/cf/ui/round_brown.png');
if(!existsSync(RUND)){
  console.error(`Das Achteck fehlt: ${RUND} — ohne den Knopf hat der Bogen keinen Sinn.`);
  process.exit(1);
}

const b64 = f => 'data:image/png;base64,' + readFileSync(f).toString('base64');

// Jedes Blatt genau einmal laden, auch wenn zehn Zellen daraus kommen.
const blaetter = {};
let fehlend = 0;
for(const [name, blatt] of KANDIDATEN){
  if(blaetter[blatt]) continue;
  const pfad = resolve(QUELLE, blatt);
  if(!existsSync(pfad)){ console.error(`fehlt: ${blatt} (fuer "${name}")`); fehlend++; continue; }
  blaetter[blatt] = b64(pfad);
}
if(fehlend) process.exit(1);

const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();

const png = await page.evaluate(async ({blaetter, KANDIDATEN, rund, KNOPF, ICON}) => {
  const lade = async u => {
    const i = new Image();
    await new Promise((ok, weg) => { i.onload = ok; i.onerror = weg; i.src = u; });
    return i;
  };
  const bl = {};
  for(const [k, v] of Object.entries(blaetter)) bl[k] = await lade(v);
  const achteck = await lade(rund);

  const DPR = 3, SPALTEN = 4, ZELLE_W = 178, ZELLE_H = 118, RAND = 20, KOPF = 34;
  const KOPFICON = 18;   // so gross steht ein Sinnbild in einer h4-Zeile
  const zeilen = Math.ceil(KANDIDATEN.length / SPALTEN);
  const cv = document.createElement('canvas');
  cv.width  = (RAND*2 + SPALTEN*ZELLE_W) * DPR;
  cv.height = (RAND*2 + KOPF + zeilen*ZELLE_H) * DPR;
  const c = cv.getContext('2d');
  c.scale(DPR, DPR);
  c.imageSmoothingEnabled = false;
  // Der Ton des Dorfwegs, nicht Schwarz: auf schwarzem Grund sieht jedes helle
  // Sinnbild gut aus, und genau das war die Falle.
  c.fillStyle = '#e0a878';
  c.fillRect(0, 0, cv.width, cv.height);
  c.fillStyle = '#2e1d0a';
  c.font = 'bold 15px monospace';
  c.fillText(`Kandidaten — links im Knopf (${KNOPF}/${ICON}), rechts auf dem Panelgrund (${KOPFICON}), DPR ${DPR}`, RAND, RAND + 14);

  KANDIDATEN.forEach(([name, blatt, sx, sy], i) => {
    const zx = RAND + (i % SPALTEN) * ZELLE_W;
    const zy = RAND + KOPF + Math.floor(i / SPALTEN) * ZELLE_H;
    // links: im Knopf auf dem Achteck
    const kx = zx + 6;
    c.drawImage(achteck, 0, 0, achteck.width, achteck.height, kx, zy, KNOPF, KNOPF);
    c.drawImage(bl[blatt], sx, sy, 16, 16,
                kx + (KNOPF - ICON) / 2, zy + (KNOPF - ICON) / 2, ICON, ICON);
    // rechts: auf dem Panelgrund, in der Groesse einer Kopfzeile
    const px = kx + KNOPF + 10, pw = ZELLE_W - (px - zx) - 6;
    c.fillStyle = '#140e18';
    c.fillRect(px, zy, pw, KNOPF);
    c.strokeStyle = '#8a6d3b'; c.lineWidth = 1;
    c.strokeRect(px + .5, zy + .5, pw - 1, KNOPF - 1);
    c.drawImage(bl[blatt], sx, sy, 16, 16, px + 8, zy + (KNOPF - KOPFICON) / 2, KOPFICON, KOPFICON);
    c.fillStyle = '#e8d9a8'; c.font = 'bold 12px monospace';
    c.fillText('KOPFZEILE', px + 8 + KOPFICON + 5, zy + KNOPF / 2 + 4);
    c.fillStyle = '#2e1d0a'; c.font = '11px monospace';
    c.fillText(name, zx + 4, zy + KNOPF + 16);
    c.fillStyle = '#6b4a28';
    c.fillText(`${blatt.split('/').pop().replace('.png','')} ${sx},${sy}`, zx + 4, zy + KNOPF + 29);
  });
  return cv.toDataURL('image/png');
}, {blaetter, KANDIDATEN, rund: b64(RUND), KNOPF, ICON});

writeFileSync(OUT, Buffer.from(png.split(',')[1], 'base64'));
console.log(`Bogen geschrieben: ${OUT} (${KANDIDATEN.length} Kandidaten, Knopf ${KNOPF}, Sinnbild ${ICON})`);
await browser.close();
