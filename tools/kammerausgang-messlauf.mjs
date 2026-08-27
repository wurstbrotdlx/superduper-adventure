#!/usr/bin/env node
// Wie teuer ist der Weg aus einer Kammer heraus?
//
//   python3 serve.py &
//   node tools/kammerausgang-messlauf.mjs [URL]
//
// Braucht Playwright und einen Chromium, wie die uebrigen Messlaeufe
// (PLAYWRIGHT_PFAD und CHROMIUM wie in tools/steuerung-pruef.mjs).
//
// WARUM ES DIESES WERKZEUG GIBT
//
// verlasseKammer() setzt den Spieler vom Kammervorraum zurueck vor seine Tuer.
// Der Vorraum liegt IMMER bei KAM_X0, die Tuer irgendwo in ihrem Band — das
// sind regelmaessig mehrere tausend Pixel. Bis heute stand an dieser Stelle
// kein camSnap(), die Kamera hat den Weg also mit lerp(..., 0.1) je Frame
// abgefahren.
//
// Das sieht man, und man sieht es als Schwenk quer ueber eine Karte, die man
// gerade nicht ansehen will. Der teure Teil ist aber der unsichtbare: der
// Boden-Chunk-Cache backt jeden 8x8-Block, der dabei durchs Bild zieht, als
// eigenes 256x256-Canvas (getChunk()). Auf einem Schirm ist das verschenkte
// Arbeit. Auf Android-Chrome ist es der Fehler, den dieser Lauf misst — dort
// ist der Canvas-Speicher der Seite gedeckelt, eine misslungene Allokation
// liefert ein LEERES Canvas statt eines Fehlers, und getChunk() legt genau
// dieses leere Canvas in den Cache. Der Spieler steht danach in einer
// schwarzen Welt, und zwar so lange, bis irgendetwas refreshFloor() ruft.
//
// Gezaehlt wird deshalb nicht "sieht gut aus", sondern:
//
//   Schnitt      steht die Kamera unmittelbar nach verlasseKammer() schon auf
//                ihrem Ziel? Ein Nachlauf von mehr als einem Pixel ist ein
//                Schwenk, und ein Schwenk ist die Ursache.
//   Chunk-Bake   wie viele 256er-Canvas entstehen in den zwei Sekunden nach
//                dem Ausgang? Erlaubt ist, was das Bild wirklich braucht: das
//                sichtbare Chunk-Gitter aus render() plus einen Block Rand.
//                Alles darueber ist Speicher, der fuer nichts ausgegeben wird.
//
// Gemessen wird an mehreren Tueren, nicht an einer: der Preis haengt an der
// Entfernung Tuer-Vorraum, und die ist je Band eine andere. Ausgegeben wird
// beides zusammen, damit sichtbar bleibt, worauf die Zahl reagiert.
//
// Exit-Code 1, sobald eine Zeile nicht stimmt — wie menue-pruef.mjs, und aus
// demselben Grund: das taugt fuer CI, sollte das Repo je eines haben.

const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';

// Telefon stehend. Das Format entscheidet ueber die erlaubte Zahl (das sichtbare
// Chunk-Gitter waechst mit dem Fenster), und das Telefon ist das Geraet, an dem
// der Fehler weh tut.
const FORMAT = { w: 390, h: 844 };
const TUEREN = 5;          // so viele Tueren werden abgeklappert
const NACHLAUF_MS = 2000;  // ein lerp mit 0.1 je Frame ist nach 2 s durch

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const ctx = await browser.newContext({
  viewport: { width: FORMAT.w, height: FORMAT.h },
  deviceScaleFactor: 2.625, isMobile: true, hasTouch: true,
});
const page = await ctx.newPage();
const fehler = [];
page.on('pageerror', e => fehler.push('Seitenfehler: ' + e.message));

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction('typeof assetsReady !== "undefined" && assetsReady', null, { timeout: 90000 });
await page.waitForTimeout(400);

// Startbild weg und eine Schicht antreten: erst danach stehen die Kammertueren.
await page.evaluate(() => {
  const ov = document.getElementById('overlay');
  if(ov) ov.style.display = 'none';
  startShift();
});
await page.waitForTimeout(500);

// Der Zaehler haengt an makeCanvas(). bakeChunk() ist die einzige Stelle im
// Spiel, die 256x256 anfordert (CH * TS = 8 * 32), damit ist die Groesse selbst
// die Kennung — kein Umbau am Spielcode noetig, um es zu zaehlen.
await page.evaluate(() => {
  window.__bakes = 0;
  const orig = window.makeCanvas;
  window.makeCanvas = (w, h) => { if(w === 256 && h === 256) window.__bakes++; return orig(w, h); };
});

// Erlaubt ist das Gitter, das render() bei stehender Kamera zieht: je Achse
// floor((o+kante)/256) - floor(o/256) + 3 Bloecke, im schlimmsten Fall also
// ceil(kante/256) + 3. Das ist keine gegriffene Zahl, sondern dieselbe Rechnung
// wie im Zeichenpfad.
const budget = await page.evaluate(() =>
  (Math.ceil(canvas.width / 256) + 3) * (Math.ceil(canvas.height / 256) + 3));

const zeilen = [];
for(let i = 0; i < TUEREN; i++){
  const rein = await page.evaluate((i) => {
    const frei = kammerTueren.filter(t => t.cd === 0);
    if(!frei.length) return null;
    const t = frei[Math.floor(i * frei.length / 5) % frei.length];
    player.x = t.x; player.y = t.y + 32; camSnap();
    betreteKammer(t);
    return { biome: t.biome, diff: t.diff, tx: t.tx, ty: t.ty };
  }, i);
  if(!rein){ fehler.push('Keine freie Kammertuer zum Messen.'); break; }
  await page.waitForTimeout(400);

  // Der Ausgang selbst: Zaehler nullen, verlassen, und im SELBEN Schritt die
  // Kamera ablesen. Ein Frame spaeter waere der Nachlauf schon angelaufen und
  // die Messung sagte nichts mehr ueber den Schnitt.
  const schnitt = await page.evaluate(() => {
    window.__bakes = 0;
    const vorX = cam.x, vorY = cam.y;
    verlasseKammer();
    return {
      weg: Math.round(Math.hypot(player.x - canvas.width/2 - vorX, player.y - canvas.height/2 - vorY)),
      nachlauf: Math.round(Math.hypot(cam.x - (player.x - canvas.width/2), cam.y - (player.y - canvas.height/2))),
    };
  });
  await page.waitForTimeout(NACHLAUF_MS);
  const bakes = await page.evaluate(() => window.__bakes);
  zeilen.push({ ...rein, ...schnitt, bakes });
}

console.log(`\nKammerausgang, ${FORMAT.w}x${FORMAT.h}, erlaubtes Gitter ${budget} Chunks\n`);
console.log('  Band      Stufe  Tuer         Weg    Nachlauf  Chunk-Bake');
for(const z of zeilen){
  const ok = z.nachlauf <= 1 && z.bakes <= budget;
  console.log(`  ${z.biome.padEnd(9)} ${String(z.diff).padStart(2)}    `
    + `${(z.tx + ',' + z.ty).padEnd(11)} ${String(z.weg).padStart(6)}px `
    + `${String(z.nachlauf).padStart(6)}px ${String(z.bakes).padStart(8)}   ${ok ? 'ok' : 'FEHLER'}`);
  if(z.nachlauf > 1)
    fehler.push(`Tuer ${z.tx},${z.ty}: die Kamera steht nach dem Ausgang ${z.nachlauf}px neben ihrem Ziel. `
      + 'verlasseKammer() schneidet nicht, sondern schwenkt (camSnap() fehlt).');
  if(z.bakes > budget)
    fehler.push(`Tuer ${z.tx},${z.ty}: ${z.bakes} Chunk-Canvas fuer einen Ausgang, erlaubt sind ${budget}. `
      + 'Der Schwenk backt die Karte, ueber die er laeuft.');
}

await browser.close();

if(fehler.length){
  console.log('\nNicht in Ordnung:');
  for(const f of fehler) console.log('  - ' + f);
  process.exit(1);
}
console.log('\nAlles in Ordnung: der Ausgang schneidet, und er backt nur sein eigenes Bild.');
