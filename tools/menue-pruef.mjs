// Pruefprotokoll zu Bauabschnitt U1 (phase-u1-menue.md).
//
//   python3 serve.py &
//   node tools/menue-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium, wie die uebrigen Messlaeufe. Geprueft
// wird das, was U1 versprochen hat, im echten Browser statt in einer Behauptung:
//
//   Klick daneben   jedes der hier geprueften sieben Panels geht zu, wenn
//                   neben es geklickt oder getippt wird
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
// U8 — WAS SICH FUER DIESEN LAUF GEAENDERT HAT
//
// Die vier Menuefenster (Charakter, Rucksack, Kochen, Zauber) sind seit U8
// Grossfenster: sie stehen nicht mehr neben dem Spiel, sondern fuellen den
// Schirm bis auf die Streifen, in denen die Bedienschicht liegt. Drei Dinge
// folgen daraus fuer diesen Lauf, und alle drei sind hier nachgezogen:
//
//   1. "daneben" liegt woanders. Auf 1280x800 laeuft das Fenster von x=144
//      bis x=1136 und von y=136 bis y=722. Die alten Klickpunkte (300/400,
//      660/400, 160/300) liegen seither MITTEN im Fenster. Geklickt wird
//      jetzt links davon.
//   2. Zwei Grossfenster koennen nicht mehr gleichzeitig offen stehen. Sie
//      liegen an derselben Stelle; ein Stapel waere kein Stapel, sondern ein
//      Fenster, das aussieht wie ein anderes. Der Guertelknopf WECHSELT
//      seither, statt ein zweites danebenzustellen — und genau das wird hier
//      geprueft, mit derselben Strenge wie vorher das Nebeneinander.
//   3. Gerollt wird das Rollfeld (.gfBody), nicht das Fenster. Der
//      Schliessknopf sitzt im Kopf darueber und kann gar nicht mehr
//      wegscrollen; geprueft wird trotzdem beides, weil "kann nicht" eine
//      Behauptung ueber CSS ist und dieser Lauf Behauptungen misst.
//
// Neu dazu kommt das Reiterband: vier Reiter in jedem Fenster, ein Griff
// darauf wechselt das Fenster.
//
// PANEL_REGISTER haelt inzwischen neun Eintraege. Sieben davon stehen hier, die
// beiden anderen werden in ihrem eigenen Lauf geprueft, weil dort auch der Rest
// ihres Bauabschnitts steht und ein Lauf je Bauabschnitt leichter zu lesen ist:
// das Gespraechsfenster aus U3 in tools/gespraech-pruef.mjs, die Kartenmappe
// aus K1 in tools/zulagen-pruef.mjs (seit U8 das zweite Blatt des
// Charakterfensters). Beide haengen im selben Register und folgen denselben
// Regeln; wer hier eine Zeile ergaenzt, ergaenzt sie dort mit.
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
  charakter: charakterOpen,
  schleier: document.body.classList.contains('panelOffen'),
  schlaege: window.__schlaege,
}));

// U8: Ein Punkt, der garantiert NEBEN jedem Grossfenster liegt. Er wird nicht
// geraten, sondern aus der linken Fensterkante gelesen — sonst wandert er beim
// naechsten Mass mit und niemand merkt es.
const danebenPunkt = async p => p.evaluate(() => {
  const r = document.getElementById('inv').getBoundingClientRect();
  return { x: Math.max(6, Math.round(r.left / 2)), y: Math.round(innerHeight / 2) };
});

// ---------------------------------------------------------------- Desktop
{
  const { page, ctx, laut } = await spiel({ viewport: { width: 1280, height: 800 } });

  await page.evaluate(() => toggleInventory());
  pruef('Inventar offen -> Schleier an', (await stand(page)).schleier, true);
  const dn = await danebenPunkt(page);
  await page.mouse.click(dn.x, dn.y);
  let z = await stand(page);
  pruef('Klick auf die Welt schliesst das Inventar', z.inv, false);
  pruef('und fuehrt dabei keinen Angriff', z.schlaege, 0);
  pruef('Schleier wieder aus', z.schleier, false);

  await page.mouse.click(dn.x, dn.y);
  pruef('Klick ohne offenes Panel schlaegt weiter zu', (await stand(page)).schlaege, 1);

  await page.evaluate(() => { window.__schlaege = 0; toggleInventory(); });
  await page.locator('#bagGrid').click({ force: true });
  z = await stand(page);
  pruef('Klick INS Panel laesst es offen', z.inv, true);
  pruef('Klick ins Panel schlaegt nicht zu', z.schlaege, 0);

  // U8: Der Guertelknopf wechselt das Fenster, statt ein zweites danebenzu-
  // stellen. Beides zugleich waere seit U8 ein Stapel an derselben Stelle.
  await page.locator('#spellsBtn').click();
  z = await stand(page);
  pruef('Guertelknopf oeffnet den Zauberbaum', z.zauber, true);
  pruef('und raeumt dabei den Rucksack weg', z.inv, false);

  // U8: Das Reiterband. Vier Reiter in jedem Fenster, ein Griff wechselt.
  pruef('vier Reiter im Band', await page.locator('#spellTree .gfReiter').count(), 4);
  await page.locator('#spellTree .gfReiter[data-ziel="charakter"]').click();
  z = await stand(page);
  pruef('Reiter fuehrt ins Charakterfenster', [z.charakter, z.zauber], [true, false]);
  await page.locator('#charakter .gfReiter[data-ziel="kessel"]').click();
  z = await stand(page);
  pruef('und von dort in den Kessel', [z.kessel, z.charakter], [true, false]);
  pruef('immer nur ein Grossfenster', [z.inv, z.zauber, z.charakter].filter(Boolean).length, 0);
  pruef('das Band wechselt ohne Schlag', z.schlaege, 0);

  await page.mouse.click(dn.x, dn.y);
  z = await stand(page);
  pruef('Klick daneben raeumt das gewechselte Fenster', [z.kessel, z.charakter], [false, false]);
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
    await page.mouse.click(dn.x, dn.y);
    z = await stand(page);
    pruef(`Klick neben ${name} schliesst`, z[feld], false);
    pruef(`Klick neben ${name} ohne Angriff`, z.schlaege, 0);
  }

  // U8: Zwei Grossfenster gehen nicht mehr uebereinander, ein Grossfenster und
  // ein kleines Panel schon — und dafuer gilt die Esc-Regel unveraendert: eine
  // Ebene je Druck, in der Reihenfolge des Registers (Rucksack vor Schloss).
  await page.evaluate(() => { toggleInventory(); schlossAuf({code:['a','b','c'], fertig:false}); });
  await page.keyboard.press('Escape');
  z = await stand(page);
  pruef('Esc schliesst weiterhin nur eine Ebene', [z.inv, z.schloss], [false, true]);
  await page.keyboard.press('Escape');
  pruef('Esc schliesst dann die zweite', (await stand(page)).schloss, false);

  // U8: Gerollt wird das Rollfeld. Geprueft wird, dass es das ueberhaupt kann
  // (sonst ist der Inhalt abgeschnitten statt erreichbar) und dass Kopf und
  // Reiterband dabei stehenbleiben.
  await page.evaluate(() => {
    toggleInventory();
    // Genug Inhalt, damit ueberhaupt etwas zu rollen da ist. Die Paare kommen
    // aus den echten Tabellen, damit der Lauf nicht an einem erfundenen
    // Zutatennamen scheitert statt an dem, was er misst.
    player.pouch = [];
    Object.keys(ZUTAT_NOUNS).forEach((n, i) => addZutat(n, ZUTAT_ADJ[i % ZUTAT_ADJ.length].a, 1));
    renderInventory();
  });
  await page.waitForTimeout(150);
  const kopf = await page.evaluate(() => {
    const f = document.getElementById('inv');
    const b = f.querySelector('.gfBody');
    b.scrollTop = b.scrollHeight;
    const x = document.getElementById('closeInvBtn').getBoundingClientRect();
    const r = f.getBoundingClientRect();
    return { rollt: b.scrollHeight > b.clientHeight + 4,
             fensterRolltNicht: f.scrollTop === 0 && f.scrollHeight <= f.clientHeight + 1,
             drin: x.top >= r.top - 1 && x.bottom <= r.bottom + 1,
             band: f.querySelectorAll('.gfReiter').length };
  });
  pruef('das Rollfeld des Rucksacks rollt', kopf.rollt, true);
  pruef('das Fenster selbst rollt nicht', kopf.fensterRolltNicht, true);
  pruef('Schliessknopf bleibt beim Scrollen im Bild', kopf.drin, true);
  pruef('das Reiterband bleibt beim Scrollen stehen', kopf.band, 4);
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
  z = await stand(page);
  pruef('Guertelknopf oeffnet den Zauberbaum', z.zauber, true);
  pruef('und raeumt dabei den Rucksack weg', z.inv, false);

  // U8: Die Knopfspalte liegt links neben dem Fenster und bleibt erreichbar —
  // das ist dieselbe Zusage wie in U7, nur mit einem Fenster, das jetzt so
  // gross ist, dass sie leicht haette fallen koennen.
  pruef('die Knopfspalte liegt neben dem Fenster', await page.evaluate(() => {
    const s = document.getElementById('spellsBtn').getBoundingClientRect();
    const f = document.getElementById('spellTree').getBoundingClientRect();
    return s.right <= f.left + 1;
  }), true);

  await page.touchscreen.tap(195, 780);
  z = await stand(page);
  pruef('Tipp daneben raeumt das Fenster', [z.inv, z.zauber], [false, false]);

  pruef('Konsole still (Touch)', laut, []);
  await ctx.close();
}

// ------------------------------------------------------- U8: kein Querlauf
//
// Ein Grossfenster ist so breit wie sein Platz und keinen Pixel breiter. Das
// ist keine Selbstverstaendlichkeit, sondern eine Zusage, die CSS zweimal
// gebrochen hat:
//
//   1. Ein Rasterfeld steht von Haus aus auf min-width:auto. Eine Kachel mit
//      einem Raster darin (Zauberbaum, Beutel) wird damit so breit, wie ihr
//      Inhalt MINDESTENS braucht — auf 390 Pixeln stand der Zauberbaum 376
//      Pixel breit in einem 294 Pixel breiten Rollfeld.
//   2. Eine Medienregel weiss nichts ueber die Breite eines FENSTERS. Auf
//      einem liegenden Telefon ist der Schirm 844 Pixel breit und das Fenster
//      318; jede Regel, die auf max-width hoert, geht dort daneben.
//
// Beides sah auf dem Entwicklungsschirm richtig aus. Deshalb wird es hier
// gemessen und nicht begutachtet: in vier Formaten, mit gefuellten Fenstern
// (leere Raster laufen nirgends ueber), fuer jedes der vier Grossfenster und
// fuer beide Blaetter des Charakterfensters.
for(const vp of [
  { name: 'Telefon stehend', w: 390, h: 844, touch: true },
  { name: 'Telefon klein',   w: 360, h: 640, touch: true },
  { name: 'Telefon liegend', w: 844, h: 390, touch: true },
  { name: 'Schirm',          w: 1440, h: 900, touch: false },
]){
  const { page, ctx } = await spiel({ viewport: { width: vp.w, height: vp.h },
                                      ...(vp.touch ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true } : {}) });
  if(vp.touch) await page.evaluate(() => document.body.classList.add('touch'));
  // Volle Fenster: ein leeres Raster laeuft nirgends ueber, ein volles schon.
  await page.evaluate(() => {
    player.level = 15; player.skillPoints = 3; player.spellPoints = 2;
    player.zulagenZiehungen = 1; zulagenAngebotSicherstellen();
    player.zulagenKartei = Object.keys(ZULAGE).slice(0, 8)
      .map((f, i) => ({ familie: f, stufe: (i % 3) + 1, angelegt: i < 2 }));
    player.pouch = [];
    Object.keys(ZUTAT_NOUNS).forEach((n, i) => addZutat(n, ZUTAT_ADJ[i % ZUTAT_ADJ.length].a, 1));
    recalc(); updateHUD();
  });
  for(const [was, auf] of [
    ['Charakter, Werte',  'toggleCharakter("werte")'],
    ['Charakter, Mappe',  'toggleCharakter("mappe")'],
    ['Rucksack',          'toggleInventory()'],
    ['Kessel',            'toggleKessel()'],
    ['Zauberbaum',        'toggleSpellTree()'],
  ]){
    await page.evaluate(q => eval(q), auf);
    await page.waitForTimeout(120);
    const m = await page.evaluate(() => {
      const f = [...document.querySelectorAll('.grossFenster')].find(e => getComputedStyle(e).display !== 'none');
      if(!f) return { offen: false };
      const b = f.querySelector('.gfBody'), r = f.getBoundingClientRect();
      return {
        offen: true,
        quer: b.scrollWidth > b.clientWidth + 1,
        ueberRand: [...b.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > r.right + 1).length,
        imBild: r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1,
        seite: document.documentElement.scrollWidth <= innerWidth + 1,
      };
    });
    pruef(`${vp.name}: ${was} laeuft nicht quer`, [m.offen, m.quer, m.ueberRand, m.imBild, m.seite],
                                                  [true,    false,  0,           true,     true]);
  }
  await ctx.close();
}

await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
