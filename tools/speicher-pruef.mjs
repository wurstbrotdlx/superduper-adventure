// Pruefprotokoll zu Bauabschnitt SP (phase-sp-spielstand.md).
//
//   python3 serve.py &
//   node tools/speicher-pruef.mjs [URL]
//
// speicherAssert() im Spiel prueft, was ohne Spielzug wahr sein muss (das Tor,
// die Klemmen, die Frischepruefung, die Form des Exports). Was sich erst ueber
// ZWEI Ladevorgaenge zeigt, steht hier — und genau das ist der Punkt dieses
// Werkzeugs: der Fund SP1 war jahrelang unsichtbar, weil jede Pruefschleife des
// Hauses die Seite genau einmal laedt. Ein Feld, das geschrieben und nie geladen
// wird, sieht in einem einzigen Lauf vollkommen gesund aus.
//
//   SP1 der Rundweg  amt.stopfenSchicht und amt.adressSchicht ueberleben einen
//                    Neuladevorgang UND den naechsten saveAmt(). Vorher wurden
//                    sie beim Laden verworfen und beim naechsten Speichern mit 0
//                    ueberschrieben — der Wert war zerstoert, nicht ignoriert
//   SP1 die Folge    vorblattFaellig() sagt in Akt IV ja, nachdem der Stempel
//                    einen Neustart ueberstanden hat. Vorher war der Weg tot,
//                    und weil beide Setzer Einmalpfade sind, kam der
//                    Gegenspieler des Hauptvorgangs nie an
//   SP1 die Klemme   ein von Hand gesetzter Stempel klemmt beidseitig
//   SP2 der Uebertrag Guertelgold und Kontingent stehen nach dem Dienstschluss
//                    in der Akte, ueberleben das Schliessen des Browsers und
//                    werden beim Antritt genau einmal eingeloest
//   SP3 der Spielstand eine unterbrochene Schicht kommt nach einem Neuladen
//                    vollstaendig zurueck: Stufe, Beutel, Ausruestung, Position,
//                    Uhr und Auftragsstand
//   SP3 die Welt     die Karte ist ueber Sitzungen hinweg identisch. Ohne diese
//                    Zusage waere eine gespeicherte Position wertlos, deshalb
//                    wird sie hier gemessen und nicht geglaubt
//   SP3 die Frische  nach dem Dienstschluss ist der Spielstand weg, damit
//                    Fortsetzen keine zweite Abrechnung derselben Schicht wird
//   Export/Import    ein Export ueberlebt ein geloeschtes Geraet: alles zurueck,
//                    inklusive der unterbrochenen Schicht
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

const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
const page = await ctx.newPage();
const laut = [];
page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', m => {
  if(m.type() !== 'error') return;
  if(m.text().includes('404')) return;
  laut.push('console: ' + m.text().slice(0, 200));
});

// Auf frameNo warten, nicht auf assetsReady: die Flagge steht auch dann auf
// true, wenn kein einziges Bild geladen wurde (README, "Eine frische Sitzung").
const laden = async () => {
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
};
const neuLaden = async () => {
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
};

await laden();

// --- SP3: die Welt ist dieselbe ---------------------------------------------
// Zuerst, weil alles Weitere darauf steht. Gemessen wird ueber zwei Ladevorgaenge.
const weltHash = () => page.evaluate(() => {
  let h = 2166136261;
  for(let i = 0; i < map.length; i++){ h ^= map[i]; h = Math.imul(h, 16777619); }
  return { karte: (h >>> 0).toString(16), baeume: trees.length, deko: decos.length,
           koppel: KOPPEL ? `${KOPPEL.x0},${KOPPEL.y0},${KOPPEL.x1},${KOPPEL.y1}` : null };
});
const welt1 = await weltHash();
await neuLaden();
const welt2 = await weltHash();
pruef('die Karte ist ueber Sitzungen hinweg identisch', welt2, welt1);

// --- SP1: der Rundweg der beiden Schichtstempel ------------------------------
await page.evaluate(() => {
  localStorage.clear();
  kn.seen.einstellung = true; saveKn();
  amt.schichten = 30; amt.stopfenSchicht = 7; amt.adressSchicht = 9; amt.bankGold = 123;
  saveAmt();
});
await neuLaden();
const sp1 = await page.evaluate(() => {
  const imSpiel = { stopfen: amt.stopfenSchicht, adress: amt.adressSchicht };
  const faellig = vorblattFaellig();
  saveAmt();                                   // genau der Schreibvorgang, der sie frueher frass
  const nach = JSON.parse(localStorage.getItem('sda_amt_v1'));
  return { imSpiel, faellig, nach: { stopfen: nach.stopfenSchicht, adress: nach.adressSchicht } };
});
pruef('SP1 Stempel ueberleben den Neustart', sp1.imSpiel, { stopfen: 7, adress: 9 });
pruef('SP1 Vorblatt wird in Akt IV wieder faellig', sp1.faellig, true);
pruef('SP1 der naechste saveAmt() frisst sie nicht', sp1.nach, { stopfen: 7, adress: 9 });

await page.evaluate(() => {
  const o = JSON.parse(localStorage.getItem('sda_amt_v1'));
  o.stopfenSchicht = 999999; o.adressSchicht = -5;
  localStorage.setItem('sda_amt_v1', JSON.stringify(o));
});
await neuLaden();
pruef('SP1 Stempel klemmen beidseitig',
      await page.evaluate(() => ({ stopfen: amt.stopfenSchicht, adress: amt.adressSchicht })),
      { stopfen: 9999, adress: 0 });

// --- SP2: der Uebertrag ueberlebt die Nacht ----------------------------------
await page.evaluate(() => {
  amt.uebertrag = null; saveAmt();
  startShift();
  player.gold = 400; player.pouch = [{ noun: 'Wurzel', adj: 'zaeh', count: 3 }];
  endShift('zeit');
});
pruef('SP2 der Uebertrag steht nach dem Dienstschluss in der Akte',
      await page.evaluate(() => JSON.parse(localStorage.getItem('sda_amt_v1')).uebertrag),
      { gold: 200, zutaten: [{ noun: 'Wurzel', adj: 'zaeh', count: 3 }] });

await neuLaden();
const sp2 = await page.evaluate(() => {
  const geladen = JSON.parse(JSON.stringify(amt.uebertrag));
  startShift();
  return { geladen, gold: player.gold, zutaten: player.pouch,
           danach: amt.uebertrag,
           inDerAblage: JSON.parse(localStorage.getItem('sda_amt_v1')).uebertrag };
});
pruef('SP2 er ueberlebt das Schliessen des Browsers', sp2.geladen,
      { gold: 200, zutaten: [{ noun: 'Wurzel', adj: 'zaeh', count: 3 }] });
pruef('SP2 der Antritt loest ihn ein', { gold: sp2.gold, stueck: sp2.zutaten.length }, { gold: 200, stueck: 1 });
pruef('SP2 und leert ihn im selben Zug', { imSpiel: sp2.danach, inDerAblage: sp2.inDerAblage }, { imSpiel: null, inDerAblage: null });

// --- SP3: die unterbrochene Schicht ------------------------------------------
const gesetzt = await page.evaluate(() => {
  startShift();
  player.level = 9; player.xp = 55; player.gold = 777; player.potions = 4;
  player.skills.str = 3; player.skillPoints = 2;
  player.spellsKnown = { funke: true, gibtsnicht: true };
  player.pouch = [{ noun: 'Wurzel', adj: 'zaeh', count: 2 }];
  player.bag[0] = { base: { t: 'armor', name: 'Aktenweste', armor: 7, tier: 1 }, rar: 1,
                    affixes: [{ k: 'hp', v: 30, def: AFFIXES[2] }], name: 'Aktenweste' };
  player.x = SPAWN.x + 640; player.y = SPAWN.y - 320;
  recalc(); player.hp = 42; player.mana = 11;
  shiftT = 813; shiftKillsTotal = 6; auftragStand = 3;
  return { geschrieben: spielstandSchreiben(), x: Math.round(player.x), y: Math.round(player.y) };
});
pruef('SP3 eine laufende Schicht laesst sich sichern', gesetzt.geschrieben, true);

await neuLaden();
const sp3 = await page.evaluate(() => {
  const vorhanden = !!spielstandLesen();
  const ok = spielstandEinloesen();
  return { vorhanden, ok, level: player.level, xp: player.xp, gold: player.gold, potions: player.potions,
           str: player.skills.str, punkte: player.skillPoints,
           zauber: Object.keys(player.spellsKnown).sort(),
           beutel: player.pouch.length, tasche: player.bag[0] && player.bag[0].name,
           affixDef: !!(player.bag[0] && player.bag[0].affixes[0] && player.bag[0].affixes[0].def),
           x: Math.round(player.x), y: Math.round(player.y),
           hp: player.hp, mana: player.mana, uhr: Math.round(shiftT),
           kills: shiftKillsTotal, auftrag: auftragStand, zustand: state,
           verbraucht: localStorage.getItem('sda_spielstand_v1') === null };
});
pruef('SP3 der Spielstand ueberlebt den Neustart', sp3.vorhanden, true);
pruef('SP3 Fortsetzen bringt den Menschen zurueck',
      { level: sp3.level, xp: sp3.xp, gold: sp3.gold, potions: sp3.potions, str: sp3.str, punkte: sp3.punkte },
      { level: 9, xp: 55, gold: 777, potions: 4, str: 3, punkte: 2 });
pruef('SP3 unbekannte Zauber fallen dabei raus', sp3.zauber, ['funke']);
pruef('SP3 Beutel und Tasche kommen mit', { beutel: sp3.beutel, tasche: sp3.tasche }, { beutel: 1, tasche: 'Aktenweste' });
pruef('SP3 der Affix haengt wieder an seiner Tabelle', sp3.affixDef, true);
pruef('SP3 die Position stimmt auf den Pixel', { x: sp3.x, y: sp3.y }, { x: gesetzt.x, y: gesetzt.y });
pruef('SP3 Leben, Mana und Uhr stehen', { hp: sp3.hp, mana: sp3.mana, uhr: sp3.uhr }, { hp: 42, mana: 11, uhr: 813 });
pruef('SP3 Auftrag und Kills stehen', { kills: sp3.kills, auftrag: sp3.auftrag }, { kills: 6, auftrag: 3 });
pruef('SP3 danach wird gespielt, nicht im Menue gestanden', sp3.zustand, 'play');
pruef('SP3 der eingeloeste Stand ist verbraucht', sp3.verbraucht, true);

const frische = await page.evaluate(() => {
  spielstandSchreiben();
  const vorher = !!spielstandLesen();
  endShift('zeit');
  return { vorher, nachher: !!spielstandLesen() };
});
pruef('SP3 der Dienstschluss verbraucht den Spielstand', frische, { vorher: true, nachher: false });

const tor = await page.evaluate(() => {
  startShift();
  const drin = (() => { const e = kammer; kammer = {}; const r = spielstandErlaubt(); kammer = e; return r; })();
  const tot  = (() => { const e = player.dead; player.dead = true; const r = spielstandErlaubt(); player.dead = e; return r; })();
  return { normal: spielstandErlaubt(), inDerKammer: drin, imTod: tot };
});
pruef('SP3 das Tor steht offen, wo es darf', tor.normal, true);
pruef('SP3 und zu, wo es nicht darf', { kammer: tor.inDerKammer, tod: tor.imTod }, { kammer: false, tod: false });

// --- Export und Import -------------------------------------------------------
await page.evaluate(() => {
  amt.bankGold = 4242; amt.schichten = 5; saveAmt();
  kladde.crafts = 11; kladde.blaetter['a1'] = true; saveKladde();
  startShift(); player.level = 6; shiftT = 900; spielstandSchreiben();
});
const [dl] = await Promise.all([
  page.waitForEvent('download'),
  page.evaluate(() => document.getElementById('spExport').click()),
]);
const datei = '/tmp/speicher-pruef-export.json';
await dl.saveAs(datei);
const roh = JSON.parse(await (await import('node:fs/promises')).readFile(datei, 'utf8'));
pruef('Export traegt die Kennung des Spiels', roh.typ, 'monstralministerium-spielstand');
pruef('Export enthaelt alle vier Schluessel', Object.keys(roh.daten).sort(),
      ['sda_amt_v1', 'sda_kladde_v1', 'sda_knoeterich_v1', 'sda_spielstand_v1']);

await page.evaluate(() => localStorage.clear());
await neuLaden();
pruef('nach dem Loeschen ist das Geraet leer',
      await page.evaluate(() => ({ bank: amt.bankGold, schichten: amt.schichten, crafts: kladde.crafts })),
      { bank: 0, schichten: 0, crafts: 0 });

await page.setInputFiles('#spDatei', datei);
await page.waitForTimeout(1600);
await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
pruef('der Import holt alles zurueck',
      await page.evaluate(() => ({ bank: amt.bankGold, schichten: amt.schichten, crafts: kladde.crafts,
                                   blatt: !!kladde.blaetter['a1'], fortsetzbar: !!spielstandLesen() })),
      { bank: 4242, schichten: 5, crafts: 11, blatt: true, fortsetzbar: true });
pruef('und das Startbild bietet die Schicht an',
      await page.evaluate(() => { showStartScreen();
        const t = document.getElementById('ovPanel').textContent;
        return { fortsetzen: t.includes('Schicht fortsetzen'), neu: t.includes('Neue Schicht beginnen') }; }),
      { fortsetzen: true, neu: true });

for(const murks of ['kein json', '{}', '{"typ":"etwas-anderes","daten":{}}']){
  pruef(`der Import lehnt Fremdes ab (${murks.slice(0, 18)})`,
        typeof await page.evaluate(m => importText(m), murks), 'string');
}

pruef('Konsole still', laut, []);

await ctx.close();
await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
