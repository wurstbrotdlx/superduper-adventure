// Abzuege zu RL7 (phase-rl7-abnahme-mit-grafik.md): das Spiel auf drei
// Formaten vom Startbild bis zum Abspann, 24 Bilder je Format.
//
//   python3 serve.py &
//   PLAYWRIGHT_PFAD=... CHROMIUM=... node tools/abzug-messlauf.mjs [URL] [ZIEL]
//
// Schreibt ZIEL/<breite>x<hoehe>/<nn>-<name>.png (Standard: ./abzuege) und je
// Format eine konsole.txt mit allem, was die Konsole waehrend des Laufs gesagt
// hat. Er misst nichts und prueft nichts: er stellt die dreizehn Stellen her,
// die eine Abnahme sehen will, und zieht sie ab. Ansehen muss sie jemand.
//
// Die Stellen: Startbild, Empfang, Ernennung (Blatt I und die Urkunde), die
// Amtsstube nach der Uebernahme, das Dorf, die Fenster (Charakter, Mappe,
// Rucksack, Kochen, Zauber, Optionen, Ausweis, Karte, Gespraech, Amtsfenster),
// Kammer, Schattenland, Dienstschluss, Jahresgespraech, Abspann (Bild 1, 4,
// 10 und 13).
//
// Was der Lauf anders macht als ein Spieler, und warum:
//   - er ruft die Oeffner direkt (toggleCharakter() usw.) statt zu tippen, wie
//     jeder Lauf unter tools/ seit U9 (Fund 2 dort);
//   - vor endShift() setzt er state auf 'feierabend', wie es die drei Aufrufer
//     im Spiel tun. Ein erster Lauf hat das nicht getan, und die Welt lief
//     hinter dem Dienstbericht weiter: die Lebensleiste fiel waehrend des
//     Abspanns von 63 auf 17. Das war der Lauf, nicht das Spiel;
//   - fuer das Gespraech stellt er den Spieler neben die Figur. Die Tafel geht
//     sonst in gespraechTick() wegen der Entfernung sofort wieder zu, und der
//     Abzug zeigt ein Dorf ohne Tafel (so geschehen, deshalb steht es hier);
//   - deviceScaleFactor 1 auf allen Formaten. Die Pixel sind damit CSS-Pixel,
//     und ein Mass aus dem Bild ist ein Mass aus dem Fenster.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;
import fs from 'node:fs';
const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const OUT = process.argv[3] || './abzuege';
const FORMATE = [[390, 844], [844, 390], [1280, 720]];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

for(const [w, h] of FORMATE){
  const dir = `${OUT}/${w}x${h}`; fs.mkdirSync(dir, {recursive: true});
  const ctx = await browser.newContext({ viewport: {width: w, height: h}, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const laut = [];
  page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 300)));
  page.on('console', m => {
    if(m.type() === 'error' || m.type() === 'warning'){ if(!m.text().includes('404')) laut.push(m.type() + ': ' + m.text().slice(0, 300)); }
    else if(m.type() === 'log') laut.push('log: ' + m.text().slice(0, 200));
  });
  let n = 0;
  const schuss = async (name, ms = 400) => { await page.waitForTimeout(ms); n++; await page.screenshot({path: `${dir}/${String(n).padStart(2, '0')}-${name}.png`}); };
  const ev = fn => page.evaluate(fn);

  await page.goto(URL, {waitUntil: 'load'});
  await page.evaluate(() => localStorage.clear());
  await page.goto(URL, {waitUntil: 'load'});
  // Auf frameNo warten, nie auf assetsReady (README, "Eine frische Sitzung einrichten").
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, {timeout: 60000});
  await page.waitForTimeout(1500);
  await schuss('startbild');                                   // frisches Geraet: keine Hausmitteilung
  await ev(() => startGame());
  await schuss('empfang', 800);
  await ev(() => empfangErnennung());
  await schuss('ernennung-1');
  await ev(() => szeneTafel(1));
  await schuss('ernennung-2-urkunde');
  await ev(() => { szeneTafelLauf = null; ernennungEnde(); });
  await schuss('amtsstube-frei', 600);
  await ev(() => verlasseHaus());
  await schuss('dorf', 800);
  // anlage2Da, sonst oeffnet der erste Griff in die Tasche den Erstkontakt (T3) statt des Rucksacks.
  await ev(() => { kn.flags.anlage2Da = true; });
  const fenster = [
    ['charakter',  () => toggleCharakter('werte'), () => toggleCharakter()],
    ['mappe',      () => toggleCharakter('mappe'), () => toggleCharakter()],
    ['rucksack',   () => toggleInventory(),        () => toggleInventory()],
    ['kochen',     () => toggleKessel(),           () => toggleKessel()],
    ['zauber',     () => toggleSpellTree(),        () => toggleSpellTree()],
    ['optionen',   () => toggleOptionen(),         () => toggleOptionen()],
    ['ausweis',    () => toggleAusweis(),          () => toggleAusweis()],
    ['karte',      () => toggleFullmap(),          () => toggleFullmap()],
    ['gespraech',  () => { const f = npcs.find(x => x.figur && x.key !== 'knoeterich'); player.x = f.x + 20; player.y = f.y; camSnap(); gespraechOeffnen(f); },
                   () => gespraechSchliessen()],
    ['amtfenster', () => amtFensterOeffnen(),      () => amtFensterSchliessen()],
  ];
  for(const [name, auf, zu] of fenster){
    await page.evaluate(`(${auf.toString()})()`);
    await schuss('fenster-' + name);
    await page.evaluate(`(${zu.toString()})()`);
    await page.waitForTimeout(100);
  }
  await ev(() => betreteKammer(kammerTueren[0]));
  await schuss('kammer', 800);
  await ev(() => { verlasseKammer(); loadLevel2(); });
  await schuss('schattenland', 1200);
  await ev(() => { amt.schichten = 9; state = 'feierabend'; endShift('zeit'); });
  await schuss('dienstschluss', 600);
  await ev(() => nachSchicht());                               // Schicht 10: erst Zwirns Auftritt (Blatt I), dann Jahresgespraech
  await schuss('jahresgespraech-auftritt', 400);
  await ev(() => { if(szeneTafelLauf) szeneTafel(1); });
  await schuss('jahresgespraech', 600);
  await ev(() => { kladde.vorgang = {1: true, 2: true, 3: true, 4: true}; state = 'zustellung'; abspannStarten(); });
  await schuss('abspann-01', 600);
  await ev(() => szeneTafel(3));
  await schuss('abspann-04-konfetti', 1200);
  await ev(() => szeneTafel(9));
  await schuss('abspann-10-regen', 1200);
  await ev(() => szeneTafel(12));
  await schuss('abspann-13', 600);
  // SZ4-Nebenbefund: gibt es im Abspann Regen oder Konfetti? Gezaehlt, nicht vermutet.
  laut.push('effekte im Abspann: ' + JSON.stringify(await ev(() => ({
    partikel: particles.length, bodenkonfetti: decalN,
    wolken: weatherClouds.length, schnee: weatherSnow.length, wind: weatherWind.length, state}))));
  fs.writeFileSync(`${dir}/konsole.txt`, laut.join('\n') + '\n');
  console.log(`${w}x${h}: ${n} Abzuege nach ${dir}, ${laut.length} Konsolenzeilen`);
  await ctx.close();
}
await browser.close();
