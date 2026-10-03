// Pruefprotokoll zu Bauabschnitt RL1 (phase-rl1-schluss.md).
//
//   python3 serve.py &
//   node tools/schluss-pruef.mjs [URL]
//
// vorgangAssert() prueft im Spiel, was ohne Spielzug wahr sein muss: dass ein
// gesetzter Stempel die Zustellung und die Vertagung abschaltet, dass die
// geschlossenen Fassungen der Bloecke die Formregeln einhalten, und dass das
// Hymnenblatt dort steht, wo die Musik einsetzt. Was sich erst im Spielen
// zeigt, steht hier:
//
//   der Stempel   faellt mit dem Abspann, nicht erst am Schlusspanel, und er
//                 steht sofort im localStorage, denn der pagehide-Weg speichert
//                 in diesem Zustand nicht
//   die Stille    der Abspann ist vom ersten bis zum elften Bild stumm, und
//                 mit dem zwoelften setzt der Amtsmarsch ein, ungedaempft;
//                 der Sprung ZUM LETZTEN BILD landet hinter der Schwelle
//   danach        kein zweites Zustellen, keine Vertagung, der Fuerst stirbt
//                 wie jeder andere, und der Kampf-Tod sagt nicht mehr
//                 "Vorgang 1 bleibt offen"
//   die Anzeige   Startbild, Bestand und Jahresgespraech nennen den Schluss
//   der Rundweg   der Stempel ueberlebt ein Neuladen und wird dabei geklemmt
//   ohne Modus    im freien Spiel gilt der Stempel nichts, wie alles aus W5
//
// Der Lauf misst nichts, er stellt fest: jede Zeile ist ein Soll-Ist-Vergleich,
// der Exit-Code ist 1, sobald eine Zeile nicht stimmt.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

const zeilen = [];
let fehl = 0;

// RIEGEL, Bauform wie versuchung-pruef.mjs: das Protokoll gehoert dem Lauf und
// nicht seinem guten Ende.
let berichtet = false, fertig = false;
function bericht(){
  if(berichtet) return;
  berichtet = true;
  console.log(zeilen.join('\n'));
  console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Prüfungen bestanden.`);
  if(!fertig) console.log(
      'ABBRUCH: der Lauf ist vor seinem Ende gestorben. Die Zeile darueber zaehlt nur,\n'
    + 'was bis dahin lief -- alles danach ist UNGEPRUEFT und nicht etwa in Ordnung.\n'
    + 'Die Ursache steht als Ausnahme darunter.');
}
process.on('exit', bericht);

function pruef(name, ist, soll){
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(58)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}

const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const laut = [];
page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', m => {
  if(m.type() !== 'error') return;
  if(m.text().includes('404')) return;
  laut.push('console: ' + m.text().slice(0, 200));
});

async function inDenDienst(){
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => assetsReady === true, null, { timeout: 30000 });
  await page.evaluate(() => startGame());
  await page.waitForTimeout(300);
  await page.evaluate(() => { if(typeof szeneAktiv !== 'undefined' && szeneAktiv === 'empfang') empfangUeberspringen(); });
  await page.waitForTimeout(200);
  for(let i = 0; i < 60; i++){
    const offen = await page.evaluate(() => document.getElementById('overlay').style.display === 'flex');
    if(!offen) break;
    const b = page.locator('#overlay button').last();
    if(await b.count() === 0) break;
    await b.click({ force: true });
    await page.waitForTimeout(150);
  }
}
await inDenDienst();
pruef('der Dienst laeuft', await page.evaluate(() => state), 'play');

// Alles auf Anfang: Akt V, Ausfertigung im Beutel, Dienstsiegel da, kein
// Stempel. Der Lauf stellt den Zustand her, den er prueft.
const zuruecksetzen = () => page.evaluate(() => {
  kladde.vorgang = {1:true, 2:true, 3:true, 4:true}; kladde.crafts = 1;
  kn.flags.szeneVersuchung = false;
  amt.vorgangGeschlossen = 0; amt.bonusNachwachsen = 20;
  amt.schichten = 45; CONFIG.schichtModus = true;
  szeneTafelLauf = null;
});
await zuruecksetzen();

// --- 1) Vor dem Schluss: alles wie seit W5 -------------------------------------
const vorher = await page.evaluate(() => ({
  zustellbar: vorgangZustellbar(), vertagt: vorgangVertagt(), geschlossen: vorgangGeschlossen(),
  still: musicStill,
  start: (showStartScreen(), document.getElementById('ovPanel').textContent),
}));
pruef('vor dem Schluss ist zustellbar, was zustellbar war', vorher.zustellbar, true);
pruef('nichts ist vertagt', vorher.vertagt, false);
pruef('und nichts ist geschlossen', vorher.geschlossen, false);
pruef('die Musik ist nicht still', vorher.still, false);
pruef('das Startbild nennt keinen Schluss', vorher.start.includes('Vorgang 1 geschlossen'), false);

// --- 2) Der Abspann setzt den Stempel und schweigt ------------------------------
const abspann = await page.evaluate(() => {
  abspannStarten();
  const o = JSON.parse(localStorage.getItem(AMT_KEY) || '{}');
  return {stempel: amt.vorgangGeschlossen, gespeichert: o.vorgangGeschlossen,
          still: musicStill, blatt: document.querySelector('#ovPanel .amtFuss').textContent,
          lauf: !!szeneTafelLauf};
});
pruef('der Stempel faellt mit dem Abspann, 1-basiert', abspann.stempel, 46);
pruef('und steht sofort im localStorage', abspann.gespeichert, 46);
pruef('der Stapel laeuft', abspann.lauf, true);
pruef('auf Blatt 1 von 13', abspann.blatt, 'Blatt 1 von 13');
pruef('und die Musik ist still', abspann.still, true);

// Bild fuer Bild. Bis zum elften still, ab dem zwoelften der Amtsmarsch.
const stilleBis = [], laut12 = [];
for(let i = 0; i < 13; i++){
  const m = await page.evaluate(k => { szeneTafel(k); return {still: musicStill, zone: requestedZone, muffle: ovMuffle}; }, i);
  if(i < 11){ if(!m.still) stilleBis.push(i + 1); }
  else laut12.push({bild: i + 1, still: m.still, zone: m.zone, muffle: m.muffle});
}
pruef('die Bilder 1 bis 11 sind still', stilleBis, []);
pruef('Bild 12 und 13 spielen den Amtsmarsch, ungedaempft', laut12,
      [{bild: 12, still: false, zone: 'office', muffle: false}, {bild: 13, still: false, zone: 'office', muffle: false}]);

await page.locator('#ovPanel button', { hasText: 'ZUM SCHLUSS' }).click({ force: true });
await page.waitForTimeout(120);
const schluss = await page.evaluate(() => ({
  kopf: document.querySelector('#ovPanel h1').textContent, still: musicStill, lauf: szeneTafelLauf,
}));
pruef('danach steht das Schlusspanel', schluss.kopf, 'VORGANG 1: GESCHLOSSEN');
pruef('die Musik bleibt an', schluss.still, false);
pruef('und der Stapel ist abgeraeumt', schluss.lauf, null);

// --- 3) Der Sprung landet hinter der Schwelle -----------------------------------
const sprung = await page.evaluate(() => {
  szeneTafelLauf = null; abspannStarten();
  const vorher = musicStill;
  szeneTafelZweiter();
  return {vorher, still: musicStill, zone: requestedZone,
          blatt: document.querySelector('#ovPanel .amtFuss').textContent};
});
pruef('vor dem Sprung ist es still', sprung.vorher, true);
pruef('ZUM LETZTEN BILD landet auf Blatt 13', sprung.blatt, 'Blatt 13 von 13');
pruef('und dort spielt der Amtsmarsch', [sprung.still, sprung.zone], [false, 'office']);
await page.evaluate(() => { szeneTafelLauf = null; vorgangPanel(6); });

// --- 4) Nach dem Schluss -------------------------------------------------------
const nachher = await page.evaluate(() => {
  const strip = h => h.replace(/<[^>]+>/g, ' ');
  const r = {
    zustellbar: vorgangZustellbar(), vertagt: vorgangVertagt(), geschlossen: vorgangGeschlossen(),
    bestand: strip(vorgangBestandBlock()), jahres: strip(vorgangJahresBlock()),
  };
  showStartScreen(); r.start = document.getElementById('ovPanel').textContent;
  winGame(); r.win = document.getElementById('ovPanel').textContent;
  state = 'menu';
  return r;
});
pruef('nach dem Schluss wird nicht mehr zugestellt', nachher.zustellbar, false);
pruef('und nicht mehr vertagt', nachher.vertagt, false);
pruef('der Vorgang ist geschlossen', nachher.geschlossen, true);
pruef('der Bestand nennt den Schluss und die Schicht', nachher.bestand.includes('Zugestellt in Schicht 46'), true);
pruef('und behauptet keine Vollstaendigkeit mehr', nachher.bestand.includes('Die Ausfertigung ist vollständig'), false);
pruef('das Jahresgespraech nennt Vorgang 2', nachher.jahres.includes('Vorgang 2'), true);
pruef('das Startbild nennt den Schluss', nachher.start.includes('Vorgang 1 geschlossen'), true);
pruef('der Kampf-Tod sagt nicht mehr "bleibt offen"', nachher.win.includes('bleibt offen'), false);
pruef('sondern heftet den Nachtrag ab', nachher.win.includes('Nachtrag zum Nachtrag'), true);

// Der Zwischenbescheid klebt nach dem Schluss nicht mehr am Bestand, auch wenn
// die Versuchung gespielt war.
const bescheid = await page.evaluate(() => {
  kn.flags.szeneVersuchung = true;
  const r = vorgangBestandBlock().includes('Zwischenbescheid');
  kn.flags.szeneVersuchung = false;
  return r;
});
pruef('der Zwischenbescheid ist vom Bestand verschwunden', bescheid, false);

// --- 5) Der Rundweg: Neuladen, Klemme ------------------------------------------
await page.evaluate(() => saveAmt());
await page.reload({ waitUntil: 'load' });
await page.waitForFunction(() => assetsReady === true, null, { timeout: 30000 });
const rund = await page.evaluate(() => ({stempel: amt.vorgangGeschlossen, geschlossen: vorgangGeschlossen()}));
pruef('der Stempel ueberlebt das Neuladen', rund.stempel, 46);
pruef('und gilt dort weiter', rund.geschlossen, true);

const klemme = await page.evaluate(async () => {
  const o = JSON.parse(localStorage.getItem(AMT_KEY));
  o.vorgangGeschlossen = 999999; localStorage.setItem(AMT_KEY, JSON.stringify(o));
  return STEMPEL_DECKEL;
});
await page.reload({ waitUntil: 'load' });
await page.waitForFunction(() => assetsReady === true, null, { timeout: 30000 });
pruef('ein zu grosser Stempel wird auf den Deckel geklemmt', await page.evaluate(() => amt.vorgangGeschlossen), klemme);
await page.evaluate(() => {
  const o = JSON.parse(localStorage.getItem(AMT_KEY));
  o.vorgangGeschlossen = -5; localStorage.setItem(AMT_KEY, JSON.stringify(o));
});
await page.reload({ waitUntil: 'load' });
await page.waitForFunction(() => assetsReady === true, null, { timeout: 30000 });
pruef('ein negativer Stempel wird zu "nie"', await page.evaluate(() => amt.vorgangGeschlossen), 0);

// --- 6) Ohne Schichtmodus gilt der Stempel nichts ------------------------------
const frei = await page.evaluate(() => {
  amt.vorgangGeschlossen = 46; kladde.vorgang = {1:true, 2:true, 3:true, 4:true};
  CONFIG.schichtModus = false;
  const r = {geschlossen: vorgangGeschlossen(), zustellbar: vorgangZustellbar(), vertagt: vorgangVertagt()};
  CONFIG.schichtModus = true;
  return r;
});
pruef('im freien Spiel ist nichts geschlossen', frei.geschlossen, false);
pruef('nichts zustellbar und nichts vertagt', [frei.zustellbar, frei.vertagt], [false, false]);

// --- 7) Konsole ----------------------------------------------------------------
pruef('Konsole still', laut, []);

fertig = true;
await browser.close();
bericht();
process.exit(fehl ? 1 : 0);
