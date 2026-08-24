// Stellt die vier gebrauchten Kapybara-Blaetter frei (Bauabschnitt G12).
//
//   node tools/kapybara-freistellen.mjs          schreibt nach assets/cf/deco/Animals/
//   node tools/kapybara-freistellen.mjs --pruef  schneidet nichts, vergleicht nur
//
// Braucht Playwright (wie die Messlaeufe) und die lizenzierte Rohbibliothek unter
// Graphics/ — beides liegt nicht im Repo, siehe README und CREDITS.md.
//
// WARUM ES DIESES WERKZEUG GIBT
//
// Die Kapybara-Blaetter sind die einzigen im ganzen Pack, die ihren eigenen Teich
// mitbringen: jede Zelle ist zu drei Vierteln ein DECKENDES Rechteck Wasser, das
// Tier sitzt darin. Das faellt an keiner Rasterzahl auf, sondern erst im
// Kontaktbogen — die Zellen leuchten blau, wo jedes andere Blatt durchsichtig ist.
//
// Gemessen: dieses Blau ist rgb(0,149,233), und das ist Pixel fuer Pixel derselbe
// Ton wie Tiles/Water/Water_Middle.png, aus dem das Spiel seine See baut. Der
// Zeichner hat das Tier auf seine eigene Wasserkachel gesetzt.
//
// Das klingt nach Glueck und ist trotzdem keins: computeTile() backt den Ozean
// nicht roh, sondern getoent (TILE_TINT.tiefsee, '#2f6ea8' zu 45 Prozent, seit
// W-Gross). Ein ungetoentes Blatt darauf waere ein zwei Kacheln breites, deutlich
// helleres Rechteck — und im Schattenland (shadowDeep, '#1a0630' zu 72 Prozent)
// waere es ein Leuchtkasten.
//
// Zwei Wege gab es. Das Blatt beim Zeichnen mitzutoenen haette denselben Ton
// gebraucht wie die Kachel darunter, also die Toenung an zwei Stellen gepflegt,
// und im Schattenland eine dritte. Oder den Grund wegnehmen und das Tier ueber
// die wirkliche See zeichnen — dann stimmt es in jedem Band und auf jeder
// Toenung, ohne dass es irgendwo nachgezogen werden muss. Das ist dieser Weg.
//
// Weggenommen wird ausschliesslich der exakte Ton (0,149,233) bei voller Deckung.
// Die Wellenringe um das Tier sind ein anderer Ton (0,109,168) und bleiben stehen:
// sie sind Zeichnung, nicht Hintergrund. Auf der getoenten See (rund 21,131,204)
// lesen sie sich weiter als das, was sie sind.
//
// Die geschnittenen Dateien heissen klein geschrieben (kapybara_idle.png), die
// Originale gross (Kapybara_Idle.png) — dieselbe Unterscheidung wie bei
// fence_h.png, sign_post.png und palisade_run.png: klein heisst veraendert.
//
// Der Browser ist hier nur Bilddecoder, wie in tools/ui-zellen.mjs.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = resolve(WURZEL, 'Graphics/Cute_Fantasy/Animals/Kapybara/Static');
const ZIEL   = resolve(WURZEL, 'assets/cf/deco/Animals');
const PRUEF  = process.argv.includes('--pruef');

// Der Grundton, gemessen gegen Tiles/Water/Water_Middle.png. Steht hier als Zahl
// und nicht als Schaetzung: wer ihn nachpruefen will, liest beide Dateien aus.
const GRUND = [0, 149, 233];

// [Zieldatei, Quellblatt, erwartete Frames, wofuer]
const BLAETTER = [
  ['kapybara_idle.png',    'Kapybara_Idle.png',     9, 'oben treiben, der Ruhezustand'],
  ['kapybara_dive.png',    'Kapybara_Dive.png',     9, 'abtauchen'],
  ['kapybara_bubbles.png', 'Kapybara_Bubbles.png', 25, 'unten bleiben und blubbern'],
  ['kapybara_emerge.png',  'Kapybara_Emerge.png',  10, 'wieder auftauchen'],
];

const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();

let abweichungen = 0;
for (const [ziel, blatt, frames, wofuer] of BLAETTER) {
  const quellPfad = resolve(QUELLE, blatt);
  if (!existsSync(quellPfad)) { console.error(`${ziel}: ${blatt} fehlt unter Graphics/`); abweichungen++; continue; }
  const dataUrl = 'data:image/png;base64,' + readFileSync(quellPfad).toString('base64');

  const roh = await page.evaluate(async ({ dataUrl, grund }) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    x.drawImage(img, 0, 0);
    const bild = x.getImageData(0, 0, c.width, c.height);
    const d = bild.data;
    let weg = 0, blieb = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;
      if (d[i] === grund[0] && d[i + 1] === grund[1] && d[i + 2] === grund[2] && d[i + 3] === 255) {
        d[i + 3] = 0; weg++;
      } else blieb++;
    }
    x.putImageData(bild, 0, 0);
    return { png: c.toDataURL('image/png'), w: c.width, h: c.height, weg, blieb };
  }, { dataUrl, grund: GRUND });

  const zellen = roh.w / 32;
  if (roh.h !== 32 || zellen !== frames) {
    console.error(`${ziel}: ${roh.w}x${roh.h} ergibt ${zellen} Zellen, erwartet ${frames} bei Hoehe 32`);
    abweichungen++; continue;
  }
  // Ein Blatt, bei dem nichts weggefallen ist, hat den Grundton nicht — dann
  // stimmt die Annahme nicht mehr, und stillschweigend weiterzumachen waere
  // schlimmer als abzubrechen.
  if (roh.weg === 0) { console.error(`${ziel}: kein einziges Pixel im Grundton ${GRUND} — Annahme pruefen`); abweichungen++; continue; }
  const anteil = roh.weg / (roh.weg + roh.blieb);
  if (anteil < 0.4 || anteil > 0.95) { console.error(`${ziel}: ${(anteil*100).toFixed(0)}% weggefallen, das ist ausserhalb des Erwarteten`); abweichungen++; continue; }

  const bytes = Buffer.from(roh.png.split(',')[1], 'base64');
  const zielPfad = resolve(ZIEL, ziel);
  const alt = existsSync(zielPfad) ? readFileSync(zielPfad) : null;
  const gleich = alt && alt.equals(bytes);

  if (PRUEF) {
    if (!alt) { console.error(`${ziel}: fehlt in assets/cf/deco/Animals/`); abweichungen++; }
    else if (!gleich) { console.error(`${ziel}: weicht vom Schnitt ab`); abweichungen++; }
    else console.log(`ok    ${ziel.padEnd(22)} ${zellen} Zellen, ${(anteil*100).toFixed(0)}% Grund weggenommen`);
    continue;
  }

  mkdirSync(ZIEL, { recursive: true });
  writeFileSync(zielPfad, bytes);
  console.log(`${gleich ? 'gleich' : 'neu   '} ${ziel.padEnd(22)} aus ${blatt}, ${zellen} Zellen, `
            + `${(anteil*100).toFixed(0)}% Grund weggenommen, ${bytes.length} B`);
  console.log(`       ${wofuer}`);
}

await browser.close();
if (abweichungen) { console.error(`\n${abweichungen} Abweichung(en).`); process.exit(1); }
