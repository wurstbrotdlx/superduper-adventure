// Kontaktbogen zu den Bauabschnitten G8 und G9.
//
//   python3 serve.py &
//   node tools/figuren-kontaktbogen.mjs [URL] [--out datei.png]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// Der Grund fuer dieses Werkzeug: G8 und G9 rechnen Farben aus den Portraets in
// die Sprites, und beide Bauabschnitte konnten alles nachmessen ausser dem
// einen, worauf es ankommt — wie es aussieht. Das ist keine Zahl, das ist ein
// Blick. Dieser Lauf macht den Blick billig: er stellt jede Figur neben ihr
// eigenes Portraet und schreibt einen einzigen PNG.
//
//   ┌──────────┬──────────┐
//   │ Portraet │  Sprite  │   je Figur eine Zelle,
//   │  128²    │ 64er ×4  │   darunter der Schluessel
//   └──────────┴──────────┘
//
// Beides ungetoent und ohne Weltlicht, also strenger als das Spiel: was hier
// nebeneinander nicht zusammenpasst, passt im Dorf erst recht nicht.
//
// OHNE Grafikpaket zeigt der Bogen die Portraets und leere Sprite-Felder. Das
// ist kein Fehler, sondern die halbe Wahrheit — die Komposite entstehen erst
// aus assets/cf/. Der Lauf sagt es in der letzten Zeile.
import { writeFileSync } from 'node:fs';
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const args = process.argv.slice(2);
const URL = args.find(a => a.startsWith('http')) || 'http://127.0.0.1:8378/index.html';
const outIdx = args.indexOf('--out');
const OUT = outIdx >= 0 ? args[outIdx + 1] : 'figuren-kontaktbogen.png';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof assetsReady !== 'undefined' && assetsReady, null, { timeout: 30000 });

const ergebnis = await page.evaluate(() => {
  const SP = 4;              // Vergroesserung des 64er-Sprites
  const PO = 2;              // Vergroesserung des 128er-Portraets
  const ZELLE_B = 64*SP + 128*PO + 24;
  const ZELLE_H = 128*PO + 26;
  const SPALTEN = 3;

  const alle = [{key:'knoeterich', blatt:EMPFANG_BLATT, gestalt:KN_GESTALT},
                ...DORF_FIGUREN.map(f => ({key:f.key, blatt:`npc_baked_${f.key}`, gestalt:f.gestalt}))];
  const zeilen = Math.ceil(alle.length / SPALTEN);

  const c = document.createElement('canvas');
  c.width = SPALTEN * ZELLE_B + 16;
  c.height = zeilen * ZELLE_H + 16;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.fillStyle = '#20262a';
  g.fillRect(0, 0, c.width, c.height);

  let mitSprite = 0, mitPortraet = 0;
  alle.forEach((f, i) => {
    const sx = 8 + (i % SPALTEN) * ZELLE_B;
    const sy = 8 + Math.floor(i / SPALTEN) * ZELLE_H;

    // Portraet links
    const po = SHEETS[portraetBlatt(f.key)];
    if(po && po.img){
      g.drawImage(po.img, sx, sy, 128*PO, 128*PO);
      mitPortraet++;
    } else {
      g.fillStyle = '#2b3238';
      g.fillRect(sx, sy, 128*PO, 128*PO);
      g.fillStyle = '#5d6b74';
      g.font = '13px monospace';
      g.fillText('kein Portraet', sx + 12, sy + 128*PO/2);
    }

    // Sprite rechts, auf derselben Fusslinie wie das Portraet unten
    const bx = sx + 128*PO + 16;
    g.fillStyle = '#2b3238';
    g.fillRect(bx, sy, 64*SP, 128*PO);
    const s = SHEETS[f.blatt];
    if(s && s.img && s.img.width){
      // Frame 0 der Idle-Reihe, zentriert, Fuesse auf 80 Prozent Zellenhoehe
      const zy = sy + 128*PO - 64*SP - 8;
      g.drawImage(s.img, 0, 0, s.fw, s.fh, bx, Math.max(sy, zy), 64*SP, 64*SP);
      mitSprite++;
    } else {
      g.fillStyle = '#5d6b74';
      g.font = '13px monospace';
      g.fillText('kein Blatt', bx + 12, sy + 128*PO/2);
    }

    // Beschriftung: Schluessel und die Garderobe, damit man beim Hinsehen weiss,
    // welche Zeile in DORF_FIGUREN man anfassen muss.
    const gg = f.gestalt || {};
    const teile = [gg.hair, gg.hemd, gg.hose, gg.hut && ('hut:' + gg.hut), gg.hautFarbe && 'haut'].filter(Boolean);
    g.fillStyle = '#c8d2d8';
    g.font = 'bold 15px monospace';
    g.fillText(f.key, sx, sy + 128*PO + 18);
    g.fillStyle = '#7f8f99';
    g.font = '13px monospace';
    g.fillText(teile.join(' · '), sx + 130, sy + 128*PO + 18);
  });

  return {png: c.toDataURL('image/png'), figuren: alle.length, mitSprite, mitPortraet,
          grafik: !!(SHEETS['cfbody_idle'] && SHEETS['cfbody_idle'].img)};
});

await browser.close();

const roh = Buffer.from(ergebnis.png.split(',')[1], 'base64');
writeFileSync(OUT, roh);
console.log(`${OUT} geschrieben, ${Math.round(roh.length/1024)} KB`);
console.log(`${ergebnis.figuren} Figuren, ${ergebnis.mitPortraet} mit Portraet, ${ergebnis.mitSprite} mit gebackenem Blatt.`);
if(!ergebnis.grafik)
  console.log('assets/cf/ liegt nicht daneben — die Sprite-Felder sind leer. Mit Grafikpaket wiederholen.');
