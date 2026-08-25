// Kontaktbogen der Bedienschicht am Finger.
//
//   python3 serve.py &
//   node tools/steuerung-kontaktbogen.mjs [URL] [--out datei.png]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// WARUM ES DIESES WERKZEUG GIBT
//
// tools/steuerung-pruef.mjs misst die Bedienschicht vollstaendig und hat trotzdem
// nie gemeldet, was an ihr falsch war. Es kann das auch nicht: es rechnet mit
// getBoundingClientRect, und jeder Fund von U10 sass INNERHALB eines Kastens,
// dessen Masse stimmten. Ein Achteck, das ein border-radius zum Kreis
// beschneidet, ist geometrisch dieselbe Flaeche wie ein Achteck, das man in Ruhe
// laesst. Der Unterschied ist nur zu sehen.
//
// Dieser Lauf macht das Sehen billig, wie tools/figuren-kontaktbogen.mjs es fuer
// die Dorffiguren tut: ein PNG je Format, und darunter je ein Ausschnitt des
// Faechers und der Knopfspalte in GERAETEPIXELN 1:1. Nichts wird nachgerechnet
// und nichts geglaettet — was auf dem Bogen krumm aussieht, ist auf dem Geraet
// krumm.
//
// deviceScaleFactor 3, nicht 1: ein Telefon rechnet die Bedienschicht auf das
// Dreifache hoch, und genau dort faellt hochskalierte Pixelkunst auseinander.
// Auf einem 1:1-Schirm sieht derselbe Knopf ordentlich aus — das war der Grund,
// warum die Sache am Entwicklungsschirm nie auffiel.

import { writeFileSync } from 'node:fs';

const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const OUT = outIdx >= 0 ? args[outIdx + 1] : 'steuerung-kontaktbogen.png';
const URL = args.find(a => a.startsWith('http')) || 'http://127.0.0.1:8378/index.html';

// Dieselben drei Telefone wie in steuerung-pruef.mjs, damit beide Laeufe ueber
// dieselben Bruchstellen reden (max-width 480, max-width 380, max-height 460).
const FORMATE = [
  { name: 'Telefon stehend', w: 390, h: 844 },
  { name: 'Telefon klein',   w: 360, h: 640 },
  { name: 'Telefon liegend', w: 844, h: 390 },
];

// Die zwei Ecken, auf die es ankommt, in CSS-Pixeln an ihrer Kante verankert
// statt als Anteil: der Faecher ist in jedem Format gleich gross, ein Anteil der
// Bildkante waere es nicht. 250x330 deckt #touchCluster (230x250) samt Zielwahl
// ab, die bis 315 ueber die Unterkante hinaufreicht.
const ECKEN = [
  { name: 'Fächer (rechts unten)',   anker: 'ru', w: 250, h: 330, y: 0 },
  { name: 'Knopfspalte (links oben)', anker: 'lo', w:  92, h: 280, y: 100 },
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const bilder = [];

for(const f of FORMATE){
  const ctx = await browser.newContext({
    viewport: { width: f.w, height: f.h },
    hasTouch: true, isMobile: true, deviceScaleFactor: 3,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  // frameNo, nicht assetsReady: die Flagge steht auch dann auf true, wenn kein
  // einziges Bild geladen wurde (README, Abschnitt "Eine frische Sitzung").
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0,
    null, { timeout: 60000 });

  // Derselbe Aufbau wie in steuerung-pruef.mjs: in den laufenden Dienst, ohne
  // Empfang und ohne Szene, und mit allem gelernt, was einen Knopf fuellt.
  await page.evaluate(() => {
    try { localStorage.clear(); } catch(_){}
    try { kn.seen.einstellung = true; } catch(_){}
    startGame();
    if(typeof szeneAus === 'function') szeneAus();
    if(typeof gespraechSchliessen === 'function') gespraechSchliessen();
    document.body.classList.remove('szeneLaeuft', 'introBuehne', 'vordruckOffen');
    const ib = document.getElementById('introBuehne'); if(ib) ib.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    state = 'play';
  });
  await page.evaluate(() => {
    player.level = 9; player.gold = 12345; player.potions = 3; player.skillPoints = 2;
    for(const sp of SPELLS) player.spellsKnown[sp.id] = true;
    player.spellsKnown[ULT_SPELL.id] = true;
    activeSpellId = SPELLS[0].id;
    shiftT = 1327;
    recalc(); updateHUD();
    document.getElementById('aktionBtn').style.display = 'flex';
  });
  await page.evaluate(() => enterTouchMode());
  await page.waitForTimeout(400);

  const voll = await page.screenshot();
  const ausschnitte = [];
  for(const e of ECKEN){
    // Klemmen, damit ein liegendes Telefon den Ausschnitt nicht ueber die
    // Unterkante schiebt — clip ausserhalb des Fensters ist ein Fehler, keine
    // leere Flaeche.
    const w = Math.min(e.w, f.w), h = Math.min(e.h, f.h);
    const x = e.anker === 'ru' ? f.w - w : 0;
    const y = e.anker === 'ru' ? f.h - h : Math.min(e.y, f.h - h);
    ausschnitte.push({
      name: e.name,
      png: await page.screenshot({ clip: { x, y, width: w, height: h } }),
    });
  }
  bilder.push({ format: f, voll, ausschnitte });
  await ctx.close();
}

// Zusammensetzen im Browser, aus demselben Grund wie in ui-zellen.mjs: Node
// bringt keinen Bilddecoder mit, und ein eigener waere mehr Code als der Bogen.
const page = await browser.newPage();
const daten = bilder.map(b => ({
  name: b.format.name,
  masse: `${b.format.w}x${b.format.h}, DPR 3`,
  voll: 'data:image/png;base64,' + b.voll.toString('base64'),
  ausschnitte: b.ausschnitte.map(a => ({
    name: a.name, png: 'data:image/png;base64,' + a.png.toString('base64'),
  })),
}));

const bogen = await page.evaluate(async ({ daten }) => {
  const lade = async (u) => {
    const img = new Image();
    await new Promise((ok, weg) => { img.onload = ok; img.onerror = weg; img.src = u; });
    return img;
  };
  const RAND = 26, KOPF = 38, ZEILE = 20, LUFT = 14, VOLLH = 560;
  const bloecke = [];
  for(const d of daten){
    const voll = await lade(d.voll);
    const aus = [];
    for(const a of d.ausschnitte) aus.push({ name: a.name, img: await lade(a.png) });
    // Das Vollbild auf eine gemeinsame Hoehe, damit die drei Formate
    // vergleichbar nebeneinander stehen. Die Ausschnitte in ihrer NATUERLICHEN
    // Groesse: der Screenshot ist mit deviceScaleFactor 3 entstanden, also ist
    // ein Bildpunkt hier genau ein Geraetepixel des Telefons. Nichts wird
    // nachgerechnet, und was hier krumm aussieht, ist auf dem Geraet krumm.
    const vollW = Math.round(voll.width / voll.height * VOLLH);
    const spalten = [vollW, ...aus.map(a => a.img.width)];
    bloecke.push({ d, voll, vollW, aus,
      w: Math.max(...spalten),
      h: KOPF + VOLLH + LUFT + aus.reduce((s, a) => s + ZEILE + a.img.height + LUFT, 0) });
  }
  const W = RAND * 2 + bloecke.reduce((s, b) => s + b.w + RAND, -RAND);
  const H = RAND * 2 + Math.max(...bloecke.map(b => b.h));
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;
  c.fillStyle = '#15111c'; c.fillRect(0, 0, W, H);

  let x = RAND;
  for(const b of bloecke){
    c.fillStyle = '#f4d97a'; c.font = 'bold 18px monospace';
    c.fillText(b.d.name, x, RAND + 17);
    c.fillStyle = '#9a8a5f'; c.font = '13px monospace';
    c.fillText(b.d.masse, x, RAND + 34);

    let y = RAND + KOPF;
    c.drawImage(b.voll, x, y, b.vollW, VOLLH);
    c.strokeStyle = '#3d2e19'; c.lineWidth = 1;
    c.strokeRect(x + .5, y + .5, b.vollW - 1, VOLLH - 1);
    y += VOLLH + LUFT;

    for(const a of b.aus){
      c.fillStyle = '#9a8a5f'; c.font = '13px monospace';
      c.fillText(`${a.name} — Gerätepixel 1:1`, x, y + 13);
      y += ZEILE;
      c.drawImage(a.img, x, y);
      c.strokeStyle = '#3d2e19';
      c.strokeRect(x + .5, y + .5, a.img.width - 1, a.img.height - 1);
      y += a.img.height + LUFT;
    }
    x += b.w + RAND;
  }
  return cv.toDataURL('image/png');
}, { daten });

writeFileSync(OUT, Buffer.from(bogen.split(',')[1], 'base64'));
console.log(`Bogen geschrieben: ${OUT} (${FORMATE.length} Formate, je Vollbild und ${ECKEN.length} Ausschnitte in Gerätepixeln)`);
await browser.close();
