// Pruefprotokoll zu Bauabschnitt M4 (phase-m4-zweite-ebene.md).
//
//   python3 serve.py &
//   node tools/ebene-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium, wie die uebrigen Pruefwerkzeuge.
// stollenAssert() im Spiel prueft, was ohne Spielzug wahr sein muss (Roster,
// Signatur, Ebenenzahl, Ziehung aus der Truhe). Was sich erst im Betreten
// zeigt, steht hier:
//
//   kein Abstieg oben   Bescheid 1 bis 4 hat keine zweite Ebene, kein Loch im
//                       Boden, kein Angebot. Das ist die Zeile, die verhindert,
//                       dass aus einer Kammervariante ein Stockwerk fuer alle wird
//   Reihenfolge         im Stollen ist das Loch von Anfang an sichtbar und
//                       nimmt niemanden auf, solange die Truhe zu ist. Erst der
//                       Vorgang, dann die Neugier
//   Kontextaktion       vor der Truhe steht der Spieler auf dem Loch und
//                       bekommt trotzdem kein "Hinabsteigen" angeboten. Geprueft
//                       wird das Angebot, nicht nur die Bedingung dahinter —
//                       eine Aktion, die etwas anderes prueft als ihre
//                       Ausfuehrung, ist ein Fehler, der sich erst im Spiel zeigt
//   der Abstieg         baut die Ebene neu: eigene Raeume, eigene Tore, eigene
//                       Truhe (zu), eigene Ausgangsrune, Spieler am Einstieg,
//                       kein zweites Loch im Boden
//   Waechter            unten stehen nur die drei der Sperrablage, und mehr je
//                       Raum als oben
//   einmal je Kammer    die zweite Truhe zaehlt den Auftrag NICHT ein zweites
//                       Mal und laesst die Tuer nicht doppelt nachwachsen. Das
//                       ist der Fund, den kein Bild zeigt und jede
//                       Auftragszaehlung merkt
//   der Lohn            unten faellt kein Gold und fallen mehr Zutaten, und die
//                       Substantive stammen aus dem Roster der Sperrablage
//   der Rueckweg        die Ausgangsrune traegt auch von unten in die Oberwelt
//                       zurueck, und die Oberwelt kommt vollstaendig wieder
//   kein Zwang          wer nicht hinabsteigt, hat die Kammer trotzdem
//                       abgeschlossen
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
  if(m.type() !== 'error') return;
  if(m.text().includes('404')) return;   // fehlendes Blatt ist ein Fehlstand des Pakets, kein Fund dieses Laufs
  laut.push('console: ' + m.text().slice(0, 200));
});

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => assetsReady === true, null, { timeout: 30000 });
await page.evaluate(() => startGame());
await page.waitForTimeout(300);
await page.evaluate(() => { if(typeof szeneAktiv !== 'undefined' && szeneAktiv === 'empfang') empfangUeberspringen(); });
await page.waitForTimeout(200);
// Der Einstellungsvordruck aus W8 blaettert seit E2 nach gemessener Hoehe und
// hat je nach Fenster bis zu fuenfzehn Seiten. Durchklicken wie in szene-pruef.
for(let i = 0; i < 60; i++){
  const offen = await page.evaluate(() => document.getElementById('overlay').style.display === 'flex');
  if(!offen) break;
  const b = page.locator('#overlay button').last();
  if(await b.count() === 0) break;
  await b.click({ force: true });
  await page.waitForTimeout(150);
}
await page.waitForTimeout(400);
pruef('der Dienst laeuft', await page.evaluate(() => state), 'play');

// Der Zaehler haengt sich vor auftragEreignis(). Das ist der einzige ehrliche
// Weg: welches Feld ein Kammerabschluss am Ende hochzaehlt, haengt am laufenden
// Auftrag, und ohne Auftrag zaehlt er gar nichts — der Aufruf selbst ist die
// Tatsache, die hier zaehlt.
await page.evaluate(() => {
  window.__kammerEreignis = 0;
  const orig = window.auftragEreignis;
  window.auftragEreignis = function(art, ...rest){
    if(art === 'kammer') window.__kammerEreignis++;
    return orig.call(this, art, ...rest);
  };
});

// Eine Tuer aus der laufenden Welt nehmen und ihre Schwierigkeit setzen. Der
// Rest der Tuer bleibt echt (Ort, Biom, Band), damit die Kammer eine ist, die
// in dieser Welt wirklich vorkommt.
const betrete = diff => page.evaluate(d => {
  if(kammer) verlasseKammer();
  const t = kammerTueren[0];
  t.diff = d; t.tier = Math.min(4, d - 1); t.cd = 0;
  betreteKammer(t);
  return {diff: kammer.diff, set: kammer.set, ebene: kammer.ebene, ebenen: kammer.ebenen};
}, diff);

// --- 1) Bescheid 4: die Untere Registratur hat kein Untergeschoss -----------
let k = await betrete(4);
pruef('Bescheid 4 nimmt den zweiten Satz', [k.set, k.ebenen], [1, 1]);
pruef('Bescheid 4 hat kein Loch im Boden', await page.evaluate(() => kammer.abstieg), null);
pruef('und keinen Abstieg', await page.evaluate(() => kannAbsteigen()), false);

// --- 2) Bescheid 5: der Stollen, und die Reihenfolge ------------------------
k = await betrete(5);
pruef('Bescheid 5 nimmt den Stollen', [k.set, k.ebenen, k.ebene], [2, 2, 0]);

const loch = await page.evaluate(() => {
  const sk = kammer.raeume[kammer.raeume.length - 1];
  const a = kammer.abstieg;
  return {da: !!a, inSchatzkammer: !!a && a.x > sk.x0*TS && a.x < sk.x1*TS,
          nebenDerTruhe: !!a && Math.abs(a.x - kammer.truhe.x) > TS,
          begehbar: !!a && walkT(Math.floor(a.x/TS), Math.floor(a.y/TS)),
          inProps: kammer.props.indexOf(a) >= 0};
});
pruef('das Loch im Boden steht von Anfang an da', loch.da, true);
pruef('es liegt in der Schatzkammer', loch.inSchatzkammer, true);
pruef('und nicht unter der Truhe', loch.nebenDerTruhe, true);
pruef('man kann darauf stehen', loch.begehbar, true);
pruef('es wird gezeichnet', loch.inProps, true);
pruef('es nimmt niemanden auf, solange die Truhe zu ist',
      await page.evaluate(() => kannAbsteigen()), false);

// Der Spieler stellt sich aufs Loch und fragt die Kontextaktion. Vor der Truhe
// darf sie ihn nicht hinunterlassen.
const angebotVorher = await page.evaluate(() => {
  player.x = kammer.abstieg.x; player.y = kammer.abstieg.y;
  aktSperre = 0; scanAktion(0.016);
  return {art: aktArt, txt: aktTxt};
});
pruef('kein Angebot "Hinabsteigen" vor der Truhe', angebotVorher.txt === 'Hinabsteigen', false);

// --- 3) Truhe auf, und erst jetzt der Abstieg -------------------------------
const nachTruhe = await page.evaluate(() => {
  const vorher = {gold: player.gold, cd: kammer.tuer.cd, ereignis: window.__kammerEreignis,
                  zutaten: Object.keys(kladde.zutaten || {}).length};
  player.x = kammer.truhe.x; player.y = kammer.truhe.y;
  truheOeffnen();
  player.x = kammer.abstieg.x; player.y = kammer.abstieg.y;
  aktSperre = 0; scanAktion(0.016);
  return {vorher, gold: player.gold, cd: kammer.tuer.cd, ereignis: window.__kammerEreignis,
          geleert: kammer.geleert, kann: kannAbsteigen(), txt: aktTxt, art: aktArt, abstiegArt: AKT_ABSTIEG};
});
pruef('die obere Truhe zahlt Gold', nachTruhe.gold > nachTruhe.vorher.gold, true);
pruef('die obere Truhe zaehlt den Kammerabschluss', nachTruhe.ereignis, 1);
pruef('die obere Truhe laesst die Tuer nachwachsen', nachTruhe.cd > 0, true);
pruef('die Kammer gilt als abgeschlossen', nachTruhe.geleert, true);
pruef('jetzt nimmt das Loch auf', nachTruhe.kann, true);
pruef('und bietet "Hinabsteigen" an', [nachTruhe.txt, nachTruhe.art], ['Hinabsteigen', nachTruhe.abstiegArt]);

// --- 4) Hinabsteigen --------------------------------------------------------
const unten = await page.evaluate(() => {
  const obenRaeume = kammer.raeume.length, obenWaechter = monsters.filter(m => !m.dead).length;
  const cdVorher = kammer.tuer.cd, ereignisVorher = window.__kammerEreignis, goldVorher = player.gold;
  steigeAb();
  const waechter = monsters.filter(m => !m.dead).map(m => m.type);
  return {
    ebene: kammer.ebene, raeumeOben: obenRaeume, raeumeUnten: kammer.raeume.length,
    mods: kammer.mods.length, idx: kammer.idx,
    truheZu: kammer.truhe && !kammer.truhe.auf, geleert: kammer.geleert,
    ausgang: !!kammer.ausgang, zweitesLoch: kammer.abstieg,
    kannWeiter: kannAbsteigen(),
    aufDemEinstieg: Math.abs(player.x - kammer.start.x) < 1 && Math.abs(player.y - kammer.start.y) < 1,
    leiterAmEinstieg: kammer.props.some(p => p.kt === 'treppe' && p.leiter === true),
    waechter, obenWaechter, waechterUnten: waechter.length,
    cdUnveraendert: kammer.tuer.cd === cdVorher,
    ereignisUnveraendert: window.__kammerEreignis === ereignisVorher,
    goldUnveraendert: player.gold === goldVorher,
    stollenRoster: KAM_STOLLEN.slice(),
    startBegehbar: walkT(Math.floor(kammer.start.x/TS), Math.floor(kammer.start.y/TS)),
    truheBegehbar: walkT(Math.floor(kammer.truhe.x/TS), Math.floor(kammer.truhe.y/TS)),
    leiterGeladen: !!(SHEETS['dun3_ladder'] && SHEETS['dun3_ladder'].img),
  };
});
pruef('der Abstieg fuehrt auf Ebene 2', unten.ebene, 1);
pruef('unten steht ein eigener Korridor', unten.raeumeUnten >= 3, true);
pruef('er ist kuerzer als der obere', unten.raeumeUnten < unten.raeumeOben, true);
pruef('mit genau einem Raetselraum', unten.mods, 1);
pruef('und faengt bei Raum 1 an', unten.idx, 0);
pruef('unten steht eine eigene, geschlossene Truhe', unten.truheZu, true);
pruef('die Ebene gilt wieder als ungeleert', unten.geleert, false);
pruef('die Ausgangsrune steht auch unten', unten.ausgang, true);
pruef('es gibt kein drittes Stockwerk', unten.zweitesLoch, null);
pruef('und keinen weiteren Abstieg', unten.kannWeiter, false);
pruef('der Spieler steht am Einstieg', unten.aufDemEinstieg, true);
pruef('der Einstieg zeigt die Leiter, nicht die Treppe', unten.leiterAmEinstieg, true);
pruef('die Leiter ist geladen', unten.leiterGeladen, true);
pruef('der Startpunkt ist begehbar', unten.startBegehbar, true);
pruef('die Truhe ist begehbar', unten.truheBegehbar, true);
// Der Alte Schrecken steht auch unten, und das ist keine Nachlaessigkeit: die
// Regel "ab Schwierigkeit 5 bewacht er die Schatzkammer" gilt fuer die
// Schatzkammer, in der er steht, und unten steht eine. Geprueft wird deshalb
// nicht seine Abwesenheit, sondern dass ausser ihm nichts Fremdes dazukommt.
pruef('unten stehen nur Waechter der Sperrablage und der Schatzkammer',
      unten.waechter.filter(t => unten.stollenRoster.indexOf(t) < 0 && t !== 'bossgeneric'), []);
pruef('der Alte Schrecken bewacht auch die untere Truhe',
      unten.waechter.indexOf('bossgeneric') >= 0, true);
pruef('und mehr je Raum als oben',
      unten.waechterUnten / Math.max(1, unten.mods) > unten.obenWaechter / Math.max(1, unten.raeumeOben - 2), true);
pruef('der Abstieg zaehlt keinen Kammerabschluss', unten.ereignisUnveraendert, true);
pruef('er laesst die Tuer nicht doppelt nachwachsen', unten.cdUnveraendert, true);
pruef('und zahlt beim Abstieg selbst nichts aus', unten.goldUnveraendert, true);

// --- 5) Der Lohn unten ------------------------------------------------------
const lohn = await page.evaluate(() => {
  const goldVorher = player.gold, ereignisVorher = window.__kammerEreignis, cdVorher = kammer.tuer.cd;
  // Zutaten liegen im Beutel als {noun, adj, count}, nicht in der Kladde — die
  // Kladde ist das Notizbuch ueber Beobachtetes, nicht der Bestand.
  const zaehl = () => player.pouch.reduce((s, z) => s + z.count, 0);
  const vorher = zaehl();
  const stollen = KAM_STOLLEN.slice();
  player.x = kammer.truhe.x; player.y = kammer.truhe.y;
  truheOeffnen();
  return {kein_gold: player.gold === goldVorher, zuwachs: zaehl() - vorher,
          ereignisUnveraendert: window.__kammerEreignis === ereignisVorher,
          cdUnveraendert: kammer.tuer.cd === cdVorher,
          ausStollen: player.pouch.some(z => stollen.indexOf(z.noun) >= 0),
          diff: kammer.diff, geleert: kammer.geleert};
});
pruef('die untere Truhe zahlt kein Gold', lohn.kein_gold, true);
pruef('sie zahlt zwei Zutaten mehr als die obere', lohn.zuwachs, 2 + lohn.diff + 2);
pruef('und aus dem Roster der Sperrablage', lohn.ausStollen, true);
pruef('sie zaehlt den Auftrag nicht ein zweites Mal', lohn.ereignisUnveraendert, true);
pruef('und laesst die Tuer in Ruhe', lohn.cdUnveraendert, true);

// --- 6) Der Rueckweg --------------------------------------------------------
const zurueck = await page.evaluate(() => {
  const tuer = kammer.tuer;
  player.x = kammer.ausgang.x; player.y = kammer.ausgang.y;
  aktSperre = 0; scanAktion(0.016);
  const angebot = aktTxt;
  verlasseKammer();
  return {angebot, level: currentLevel, kammer, vorDerTuer: Math.abs(player.x - tuer.x) < TS*2,
          dorfDa: npcs.length > 0, tuerenDa: kammerTueren.length > 0};
});
pruef('die Ausgangsrune bietet auch unten "Verlassen"', zurueck.angebot, 'Verlassen');
pruef('sie traegt in die Oberwelt zurueck', zurueck.level, 1);
pruef('die Kammer ist weg', zurueck.kammer, null);
pruef('der Spieler steht vor seiner Tuer', zurueck.vorDerTuer, true);
pruef('die Oberwelt ist vollstaendig zurueck', [zurueck.dorfDa, zurueck.tuerenDa], [true, true]);

// --- 7) Kein Zwang ----------------------------------------------------------
// Wer die obere Truhe nimmt und geht, hat die Kammer abgeschlossen. Das ist die
// Zeile, die dafuer buergt, dass die zweite Ebene ein Angebot bleibt.
const ohne = await page.evaluate(() => {
  const t = kammerTueren[1] || kammerTueren[0];
  t.diff = 5; t.tier = 4; t.cd = 0;
  const ereignisVorher = window.__kammerEreignis;
  betreteKammer(t);
  player.x = kammer.truhe.x; player.y = kammer.truhe.y;
  truheOeffnen();
  const abgeschlossen = kammer.geleert, ereignis = window.__kammerEreignis - ereignisVorher;
  verlasseKammer();
  return {abgeschlossen, ereignis, level: currentLevel};
});
pruef('ohne Abstieg ist die Kammer abgeschlossen', ohne.abgeschlossen, true);
pruef('und genau einmal gezaehlt', ohne.ereignis, 1);
pruef('der Ausgang funktioniert wie immer', ohne.level, 1);

pruef('Konsole still', laut, []);

await ctx.close();
await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
