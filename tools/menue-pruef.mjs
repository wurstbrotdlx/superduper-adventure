// Pruefprotokoll zu Bauabschnitt U1 (phase-u1-menue.md).
//
//   python3 serve.py &
//   node tools/menue-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium, wie die uebrigen Messlaeufe. Geprueft
// wird das, was U1 versprochen hat, im echten Browser statt in einer Behauptung:
//
//   Klick daneben   jedes der sieben Panels geht zu, wenn neben es geklickt
//                   oder getippt wird
//   kein Angriff    derselbe Griff fuehrt keinen Schlag aus und startet keinen
//                   Joystick. Das ist die eigentliche Falle: die Angriffe
//                   haengen an canvas.mousedown/touchstart, ein Panel liegt nur
//                   darueber
//   Inseln          HUD, Guertel und Daumenfaecher behalten ihre Wirkung, auch
//                   mit offenem Panel — der mobile Breakpoint laesst unten
//                   bewusst Platz dafuer, ein modaler Vorhang haette ihn
//                   kassiert
//   Esc             schliesst weiterhin eine Ebene je Druck, nicht alles
//   Kopfband        der Schliessknopf bleibt beim Scrollen im Bild
//
// Das achte Panel, das Gespraechsfenster aus U3, prueft tools/gespraech-pruef.mjs.
// Es haengt seit U3 im selben PANEL_REGISTER und folgt denselben Regeln; die
// Zeilen dafuer stehen dort, weil dort auch Namensschild, Tippen und Schriftstufe
// geprueft werden und ein Lauf je Bauabschnitt leichter zu lesen ist.
//
// Anders als monster-messlauf.mjs misst dieser Lauf nichts, er stellt fest:
// jede Zeile ist ein Soll-Ist-Vergleich, der Exit-Code ist 1, sobald eine
// Zeile nicht stimmt. Damit taugt er fuer CI, sollte das Repo je eines haben.
//
// Angriffe werden nicht geraten, sondern gezaehlt: tryAttack() ist der einzige
// Weg zu einem Schlag, der Lauf legt sich davor.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

const zeilen = [];
let fehl = 0;
function pruef(name, ist, soll){
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(56)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}

// Startet das Spiel und klickt den W8-Einstellungsvordruck durch, bis das
// Overlay weg ist — mit stehendem Overlay (z-index 50) laege ueber allem ein
// Klickfaenger, und der Lauf pruefte nur ihn.
async function spiel(ctxOpt){
  const ctx = await browser.newContext(ctxOpt);
  const page = await ctx.newPage();
  const laut = [];
  page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
  page.on('console', m => {
    if(m.type() !== 'error') return;
    // Ein fehlendes Sprite-Blatt ist ein Fehlstand des Grafikpakets, kein Fund
    // dieses Laufs: wer das Repo ohne vollstaendige Lizenz klont, soll daran
    // keine Menue-Pruefung scheitern sehen. Das Spiel meldet solche Luecken
    // ohnehin selbst und einmal (s. loadAssets/bakeAllNpcSheets).
    if(m.text().includes('404')) return;
    laut.push('console: ' + m.text().slice(0, 200));
  });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => assetsReady === true, null, { timeout: 30000 });
  await page.evaluate(() => startGame());
  await page.waitForTimeout(300);
  // E2: startGame() oeffnet nicht mehr das Overlay, sondern den Empfang in der
  // Gespraechstafel auf schwarzem Grund. Die Schleife darunter wartet auf ein
  // sichtbares Overlay und waere sofort ausgestiegen, mitten im Anfang. Ein
  // Sprung auf den Vordruck bringt den Lauf auf den Weg, den er kennt.
  await page.evaluate(() => { if(typeof empfangAktiv !== 'undefined' && empfangAktiv) empfangUeberspringen(); });
  await page.waitForTimeout(200);
  // E2: Der Vordruck blaettert seit E2 nach gemessener Hoehe und hat je nach
  // Fenster und Schriftstufe bis zu fuenfzehn Seiten statt drei. Zwoelf Runden
  // reichten nicht mehr bis zur Unterschrift, der Lauf blieb im Vordruck
  // stehen und alles danach fiel aus.
  for(let i = 0; i < 60; i++){
    const offen = await page.evaluate(() => document.getElementById('overlay').style.display === 'flex');
    if(!offen) break;
    const btn = page.locator('#overlay button').last();
    if(await btn.count() === 0) break;
    await btn.click({ force: true });
    await page.waitForTimeout(200);
  }
  await page.evaluate(() => {
    window.__schlaege = 0;
    const alt = tryAttack;
    window.tryAttack = tryAttack = function(...a){ window.__schlaege++; return alt.apply(this, a); };
  });
  return { page, ctx, laut };
}

const stand = p => p.evaluate(() => ({
  inv: invOpen, zauber: spellTreeOpen, kessel: kesselOpen, ausweis: ausweisOpen,
  karte: fullmapOpen, schloss: schlossOpen, amt: amtFensterOpen,
  schleier: document.body.classList.contains('panelOffen'),
  schlaege: window.__schlaege,
}));

// ---------------------------------------------------------------- Desktop
{
  const { page, ctx, laut } = await spiel({ viewport: { width: 1280, height: 800 } });

  await page.evaluate(() => toggleInventory());
  pruef('Inventar offen -> Schleier an', (await stand(page)).schleier, true);
  await page.mouse.click(300, 400);
  let z = await stand(page);
  pruef('Klick auf die Welt schliesst das Inventar', z.inv, false);
  pruef('und fuehrt dabei keinen Angriff', z.schlaege, 0);
  pruef('Schleier wieder aus', z.schleier, false);

  await page.mouse.click(300, 400);
  pruef('Klick ohne offenes Panel schlaegt weiter zu', (await stand(page)).schlaege, 1);

  await page.evaluate(() => { window.__schlaege = 0; toggleInventory(); });
  await page.locator('#statBox').click({ force: true });
  z = await stand(page);
  pruef('Klick INS Panel laesst es offen', z.inv, true);
  pruef('Klick ins Panel schlaegt nicht zu', z.schlaege, 0);

  await page.locator('#spellsBtn').click();
  z = await stand(page);
  pruef('Guertelknopf oeffnet den Zauberbaum', z.zauber, true);
  pruef('Guertelknopf laesst das Inventar offen', z.inv, true);

  await page.mouse.click(660, 400);
  z = await stand(page);
  pruef('Klick zwischen zwei Panels raeumt beide', [z.inv, z.zauber], [false, false]);
  pruef('und schlaegt dabei nicht zu', z.schlaege, 0);

  for(const [name, feld, auf] of [
    ['Kessel',       'kessel',  'toggleKessel()'],
    ['Ausweis',      'ausweis', 'toggleAusweis()'],
    ['Karte',        'karte',   'toggleFullmap()'],
    ['Amtsstube',    'amt',     'amtFensterOeffnen()'],
    ['Symbolschloss','schloss', "schlossAuf({code:['a','b','c'], fertig:false})"],
  ]){
    await page.evaluate(q => { window.__schlaege = 0; eval(q); }, auf);
    pruef(`${name} offen`, (await stand(page))[feld], true);
    await page.mouse.click(160, 300);
    z = await stand(page);
    pruef(`Klick neben ${name} schliesst`, z[feld], false);
    pruef(`Klick neben ${name} ohne Angriff`, z.schlaege, 0);
  }

  await page.evaluate(() => { toggleInventory(); toggleSpellTree(); });
  await page.keyboard.press('Escape');
  z = await stand(page);
  pruef('Esc schliesst weiterhin nur eine Ebene', [z.inv, z.zauber], [false, true]);
  await page.keyboard.press('Escape');
  pruef('Esc schliesst dann die zweite', (await stand(page)).zauber, false);

  await page.evaluate(() => toggleInventory());
  await page.waitForTimeout(150);
  const kopf = await page.evaluate(() => {
    const p = document.getElementById('inv');
    p.scrollTop = p.scrollHeight;
    const b = document.getElementById('closeInvBtn').getBoundingClientRect();
    const r = p.getBoundingClientRect();
    return { scrollbar: p.scrollHeight > p.clientHeight + 4,
             drin: b.top >= r.top - 1 && b.bottom <= r.bottom + 1 };
  });
  pruef('Inventar ist ueberhaupt scrollbar', kopf.scrollbar, true);
  pruef('Schliessknopf bleibt beim Scrollen im Bild', kopf.drin, true);
  await page.evaluate(() => toggleInventory());

  pruef('Konsole still (Desktop)', laut, []);
  await ctx.close();
}

// ------------------------------------------------------------------ Touch
{
  const { page, ctx, laut } = await spiel({ viewport: { width: 390, height: 844 },
                                            deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await page.evaluate(() => document.body.classList.add('touch'));

  await page.evaluate(() => toggleInventory());
  await page.touchscreen.tap(195, 700);
  let z = await stand(page);
  pruef('Tipp auf die Welt schliesst das Inventar', z.inv, false);
  pruef('und fuehrt dabei keinen Angriff', z.schlaege, 0);
  pruef('und startet keinen Joystick', await page.evaluate(() => joy.id), null);

  await page.evaluate(() => { window.__schlaege = 0; toggleInventory(); });
  await page.locator('#attackBtn').tap();
  z = await stand(page);
  pruef('Angriffsknopf wirkt trotz offenem Panel', z.schlaege >= 1, true);
  pruef('Angriffsknopf schliesst das Panel nicht', z.inv, true);

  await page.locator('#spellsBtn').tap();
  pruef('Guertelknopf oeffnet den Zauberbaum', (await stand(page)).zauber, true);

  await page.touchscreen.tap(195, 780);
  z = await stand(page);
  pruef('Tipp daneben raeumt beide', [z.inv, z.zauber], [false, false]);

  pruef('Konsole still (Touch)', laut, []);
  await ctx.close();
}

await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
