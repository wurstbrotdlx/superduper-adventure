// Pruefprotokoll zu Bauabschnitt IN1 (phase-in1-innenraeume.md).
//
//   python3 serve.py &
//   node tools/innen-pruef.mjs [URL]
//
// innenAssert() im Spiel prueft die Tabellen: rechteckige Grundrisse, geschlossene
// Waende, genau ein Ausgang, bekannte Zeichen, Bewohner auf begehbarem Boden.
// Was sich erst am laufenden Spiel zeigt, steht hier — und es sind genau die
// Fragen, die eine Tabellenpruefung nicht beantworten kann:
//
//   die Schwelle    steht der Spieler nach dem Hinausgehen auf begehbarem
//                   Boden, und zwar VOR dem Haus und nicht in seiner Wand
//   der Rundweg     Oberwelt hinein, Oberwelt heraus: Karte, Baeume, Deko,
//                   Figuren und Monster sind hinterher bitgleich dieselben.
//                   Das ist die teuerste Zusage des Bauabschnitts, weil ein
//                   Innenraum die ganze Karte ueberschreibt
//   die Moebel      jedes Moebelfeld sperrt, jedes Bodenfeld traegt
//   der Tagesablauf zum Feierabend steht der Hausherr drinnen und NICHT
//                   draussen, davor umgekehrt. Niemand steht zweimal da
//   die Angebote    an der Fassade "Betreten", drinnen am Pult "Amtsstube",
//                   an der Schwelle "Hinausgehen", an der Figur "Ansprechen"
//   die Schublade   die Szene aus Akt III haengt seit IN1 am Schreibtisch von
//                   Dr. Sturz und nicht mehr nur an einer Zeile im Panel
//   das Gespraech   eine Tafel, die drinnen aufgeht, bleibt drinnen offen.
//                   gespraechAktualisieren() hat bis IN1 auf currentLevel === 1
//                   bestanden und haette jedes Wort im Haus sofort abgebrochen
//
// Der Lauf misst nichts, er stellt fest: jede Zeile ist ein Soll-Ist-Vergleich,
// der Exit-Code ist 1, sobald eine Zeile nicht stimmt.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;
const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

const zeilen = [];
let fehl = 0;
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
  if(m.type() !== 'error' && m.type() !== 'warning') return;
  if(m.text().includes('404')) return;
  laut.push(m.type() + ': ' + m.text().slice(0, 200));
});

// Auf frameNo warten, nicht auf assetsReady (README, "Eine frische Sitzung").
await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
// Der Empfang ist eine Szene und haelt die Welt an. Der Einstellungshaken ist ein
// Merker, kein Zustand — gesetzt beginnt startShift() sofort.
await page.evaluate(() => {
  kn.seen.einstellung = true; saveKn(); startGame();
  empfangSchliessen(); document.getElementById('overlay').style.display = 'none'; state = 'play';
});

const haeuser = await page.evaluate(() => INN_HAEUSER.map(h => h.b.innen));
pruef('drei Tueren im Dorf', haeuser, ['amt', 'registratur', 'wirtshaus']);

// --- Die Schwelle ------------------------------------------------------------
for(const key of haeuser){
  pruef(`${key}: an der Fassade steht "Betreten"`, await page.evaluate(k => {
    if(innen) verlasseHaus();
    const h = INN_HAEUSER.find(h => h.b.innen === k);
    player.x = h.tuer.x; player.y = h.tuer.y + 20; aktSperre = 0;
    scanAktion(0.02);
    return {txt: aktTxt, art: aktArt};
  }, key), {txt: 'Betreten', art: 15});

  pruef(`${key}: der Weg hinaus fuehrt auf begehbaren Boden vor das Haus`,
        await page.evaluate(k => {
          const h = INN_HAEUSER.find(h => h.b.innen === k);
          if(innen) verlasseHaus();
          betreteHaus(h);
          verlasseHaus();
          const tx = Math.floor(player.x / TS), ty = Math.floor(player.y / TS);
          return {begehbar: walkPx(player.x, player.y), level: currentLevel,
                  unterHaus: tx >= h.b.x0 && tx < h.b.x0 + h.b.w, unterhalb: ty >= h.b.y0 + h.b.h};
        }, key),
        {begehbar: true, level: 1, unterHaus: true, unterhalb: true});
}

// --- Der Rundweg: die Oberwelt kommt bitgleich zurueck -----------------------
const weltHash = () => page.evaluate(() => {
  let h = 2166136261;
  for(let i = 0; i < map.length; i++){ h ^= map[i]; h = Math.imul(h, 16777619); }
  return { karte: (h >>> 0).toString(16), baeume: trees.length, deko: decos.length,
           viecher: critters.length, figuren: npcs.length, monster: monsters.length };
});
const vorher = await weltHash();
await page.evaluate(() => {
  for(const h of INN_HAEUSER){ betreteHaus(h); for(let i = 0; i < 30; i++) update(1/60); verlasseHaus(); }
});
pruef('nach drei Besuchen ist die Oberwelt dieselbe', await weltHash(), vorher);

// --- Die Moebel sperren, der Boden traegt ------------------------------------
pruef('jedes Moebelfeld sperrt, jedes Bodenfeld traegt', await page.evaluate(() => {
  const schlecht = [];
  for(const h of INN_HAEUSER){
    betreteHaus(h);
    const r = innen.raum;
    for(let ry = 0; ry < r.h; ry++) for(let rx = 0; rx < r.w; rx++){
      const z = r.zeichen(rx, ry), m = INN_MOEBEL[z.toUpperCase()] || {};
      const frei = walkT(INN_X0 + rx, INN_Y0 + ry);
      const soll = z === '#' ? false : (m.frei || z === '.');
      if(frei !== !!soll) schlecht.push(`${r.key} ${rx},${ry} '${z}'`);
    }
    verlasseHaus();
  }
  return schlecht;
}), []);

// --- Der Tagesablauf ---------------------------------------------------------
pruef('zum Feierabend steht der Hausherr drinnen und nicht draussen', await page.evaluate(() => {
  shiftT = CONFIG.schichtDauer * 0.1;                       // letztes Viertel
  const aus = {};
  for(const h of INN_HAEUSER){
    const draussen = npcs.filter(n => figHier(n.figur)).map(n => n.key);
    betreteHaus(h);
    aus[h.b.innen] = {drinnen: npcs.map(n => n.key), nochDraussen: draussen.filter(k => k === 'fass' || k === 'bramsche' || k === 'noergel')};
    verlasseHaus();
  }
  return aus;
}), {amt: {drinnen: ['noergel'], nochDraussen: []},
     registratur: {drinnen: ['bramsche'], nochDraussen: []},
     wirtshaus: {drinnen: ['fass'], nochDraussen: []}});

pruef('vor dem Feierabend steht er draussen und das Haus ist leer', await page.evaluate(() => {
  shiftT = CONFIG.schichtDauer * 0.9;                       // Antritt
  const draussen = npcs.filter(n => figHier(n.figur)).map(n => n.key)
                       .filter(k => ['fass', 'bramsche', 'noergel'].includes(k)).sort();
  const drinnen = [];
  for(const h of INN_HAEUSER){ betreteHaus(h); drinnen.push(...npcs.map(n => n.key)); verlasseHaus(); }
  return {draussen, drinnen};
}), {draussen: ['bramsche', 'fass', 'noergel'], drinnen: []});

// --- Die Angebote drinnen ----------------------------------------------------
pruef('drinnen: Pult, Schwelle und Figur bieten an, was sie sollen', await page.evaluate(() => {
  shiftT = CONFIG.schichtDauer * 0.1;
  betreteHaus(INN_HAEUSER.find(h => h.b.innen === 'amt'));
  const bei = (x, y) => { player.x = x; player.y = y; aktSperre = 0; scanAktion(0.02); return aktArt ? aktTxt : null; };
  const pult = innen.moebel.find(o => o.akt === 'pult');
  const aus = {pult: bei(pult.x, pult.y + 34),
               schwelle: bei(innen.tuer.x, innen.tuer.y - 30),
               figur: bei(npcs[0].x, npcs[0].y + 20)};
  verlasseHaus();
  return aus;
}), {pult: 'Amtsstube', schwelle: 'Hinausgehen', figur: 'Ansprechen'});

// --- Die zweite Schublade haengt am Schreibtisch ------------------------------
pruef('die zweite Schublade bietet sich erst ab Akt III an', await page.evaluate(() => {
  const messe = () => {
    betreteHaus(INN_HAEUSER.find(h => h.b.innen === 'amt'));
    const s = innen.moebel.find(o => o.akt === 'schublade');
    player.x = s.x; player.y = s.y + 30; aktSperre = 0; scanAktion(0.02);
    const t = aktArt === 17 ? aktTxt : null;
    verlasseHaus();
    return t;
  };
  amt.schichten = 0; kn.flags.szeneSchublade = false;
  const aktI = messe();
  amt.schichten = 25;                                        // Akt III
  const aktIII = messe();
  return {aktI, aktIII};
}), {aktI: null, aktIII: 'Die zweite Schublade'});

// --- Ein Gespraech im Haus bleibt offen ---------------------------------------
pruef('eine Tafel, die drinnen aufgeht, bricht nicht ab', await page.evaluate(() => {
  shiftT = CONFIG.schichtDauer * 0.1;
  betreteHaus(INN_HAEUSER.find(h => h.b.innen === 'wirtshaus'));
  // Neben die Figur stellen: GESPRAECH_WEG_Q sind 96 Pixel, und die Schwelle
  // liegt acht Kacheln von der Theke entfernt. Wer das vergisst, misst die
  // Reichweitenpruefung und nicht den Innenraum.
  player.x = npcs[0].x; player.y = npcs[0].y + 24;
  gespraechOeffnen(npcs[0]);
  const auf = !!gespraech.npc;
  for(let i = 0; i < 60; i++) update(1/60);                  // eine Sekunde reden lassen
  const nochAuf = !!gespraech.npc, wer = gespraech.npc && gespraech.npc.key;
  gespraechSchliessen(); verlasseHaus();
  return {auf, nochAuf, wer};
}), {auf: true, nochAuf: true, wer: 'fass'});

// --- Kein Spielstand im Haus --------------------------------------------------
pruef('im Haus wird nicht gespeichert, und der Grund wird genannt', await page.evaluate(() => {
  betreteHaus(INN_HAEUSER[0]);
  const aus = {erlaubt: spielstandErlaubt(), grund: speicherGrund()};
  verlasseHaus();
  return aus;
}), {erlaubt: false, grund: 'In einem Haus wird nicht gespeichert. Erst hinaus.'});

// --- Eine neue Schicht faengt draussen an -------------------------------------
pruef('startShift() holt den Spieler aus dem Haus', await page.evaluate(() => {
  betreteHaus(INN_HAEUSER[0]);
  startShift();
  return {innen: !!innen, level: currentLevel};
}), {innen: false, level: 1});

// --- Der Ersatzweg: ohne die geschnittenen Blaetter laeuft es weiter ---------
// Die neunzehn Innenraumblaetter sind als optional registriert, weil die
// lizenzierte Grafik im Pages-Build aus einem zweiten Repo kommt und dort erst
// ankommen muss. Ein Ersatzweg, den niemand ausloest, ist eine Behauptung —
// hier wird er ausgeloest.
pruef('ohne die Innenraumblaetter baeckt jede Kachel trotzdem', await page.evaluate(() => {
  const weg = {};
  for(const k of Object.keys(SHEETS)) if(k.startsWith('innen_')){ weg[k] = SHEETS[k]; delete SHEETS[k]; }
  for(const k of Object.keys(INN_CACHE)) delete INN_CACHE[k];
  const leer = [];
  for(const h of INN_HAEUSER){
    betreteHaus(h);
    const r = innen.raum;
    for(let ry = 0; ry < r.h; ry++) for(let rx = 0; rx < r.w; rx++)
      if(!innenTile(INN_X0 + rx, INN_Y0 + ry)) leer.push(`${r.key} ${rx},${ry}`);
    for(const o of innen.moebel) drawInnenMoebel(o);      // wirft, wenn ein Ersatzweg fehlt
    verlasseHaus();
  }
  Object.assign(SHEETS, weg);
  for(const k of Object.keys(INN_CACHE)) delete INN_CACHE[k];
  return {blaetter: Object.keys(weg).length, leer};
}), {blaetter: 19, leer: []});

// --- Und mit den Blaettern kommt das Pack durch ------------------------------
// Zwoelf Moebelzeichen greifen ins Pack; die drei Auflagen (Pflanze, Kerze,
// Flasche) haengen an keinem Zeichen, weil sie auf einem Moebel stehen und
// nicht auf einem Feld. Sie werden hier einzeln nachgesehen.
pruef('mit den Blaettern zeichnen zwoelf Moebel aus dem Pack', await page.evaluate(() => {
  const da = Object.keys(INN_SPRITE).filter(z => innenBlattDa(INN_SPRITE[z]));
  return {sprite: da.sort(), boden: innenBlattDa('innen_boden'),
          auflagen: ['innen_pflanze', 'innen_kerze', 'innen_flasche'].every(innenBlattDa)};
}), {sprite: ['B', 'D', 'E', 'H', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'Z'], boden: true, auflagen: true});

// --- Die Schankstube ist eingerichtet ---------------------------------------
// Der Nachlese-Grundriss steht in index.html; hier steht, was er tragen MUSS.
// Nicht die Zahl der Faesser (die darf sich aendern), sondern die drei Saetze,
// die der Raum ueber sich selbst macht: es gibt eine Theke, an ihr sitzt man,
// und der freigehaltene Platz sitzt mit.
pruef('die Schankstube hat Theke, Hocker, Faesser und Uhr', await page.evaluate(() => {
  const h = INN_HAEUSER.find(h => h.b.innen === 'wirtshaus');
  betreteHaus(h);
  const n = z => innen.moebel.filter(o => o.z === z).length;
  // Sitzt der freigehaltene Platz in der Hockerreihe? Gemessen als Abstand in
  // Kacheln zum naechsten Hocker: ein Denkmal steht allein, ein Stuhl in einer
  // Reihe hat einen Nachbarn.
  const z = innen.moebel.find(o => o.z === 'Z');
  const nah = Math.min(...innen.moebel.filter(o => o.z === 'U')
    .map(o => Math.abs(o.x - z.x)/TS + Math.abs(o.y - z.y)/TS));
  const ergebnis = {theke: n('X'), hocker: n('U'), fass: n('V'), uhr: n('P'),
                    fenster: n('N'), bank: n('B'), tisch: n('T'), nachbar: nah};
  verlasseHaus();
  return ergebnis;
}), {theke: 1, hocker: 3, fass: 3, uhr: 1, fenster: 2, bank: 2, tisch: 2, nachbar: 1});

pruef('Konsole still', laut, []);

await ctx.close();
await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
