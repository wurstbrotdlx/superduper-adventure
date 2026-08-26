// Gegenprobe zu anlage2Assert() und den T6-Deckeln in knAssertCaps()
// (Bauabschnitt T6, phase-t6-ausbruch.md).
//
//   python3 serve.py &
//   node tools/anlage2-fehlversuch.mjs [URL]
//
// Nach dem Vorbild von tools/ebene-fehlversuch.mjs, monster-fehlversuch.mjs
// und steinbruch-fehlversuch.mjs: ein Guard, der immer schweigt, beweist
// nichts. Hausbrauch seit T1 ist, jeden neuen Zweig einmal ausgeloest zu haben;
// bis T5 stand das Protokoll nur im Phasendokument, also als Behauptung ueber
// einen einmaligen Nachmittag. Hier laeuft es wieder.
//
// Verstellt wird ausschliesslich durch Veraenderung bestehender Tabellen, nie
// durch Neubindung der Konstanten selbst: `const` im Skript-Scope laesst sich
// nicht neu binden, eine Objekteigenschaft und ein Array-Element schon.
//
// Geprueft wird jedes Mal BEIDES, und das zweite ist das wichtigere: dass der
// Guard meldet, und dass er nach dem Zuruecksetzen wieder still ist. Ein Guard,
// der nach einer Probe weiter meldet, haelt einen Zustand fest, den es nicht
// mehr gibt, und faerbt jede spaetere Probe ein.
//
// Der zwoelfte Fall liegt nicht in anlage2Assert(), sondern im Zeichendeckel
// von knAssertCaps(). Er steht trotzdem hier, denn der eigene Deckel des
// Ausbruchs (30 statt 44) ist eine T6-Zusage wie die uebrigen.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const meldungen = [];
page.on('console', m => {
  if (m.type() !== 'error') return;
  const t = m.text();
  if (t.includes('404') || t.includes('Assertion fehlgeschlagen')) return;
  meldungen.push(t);
});
page.on('pageerror', e => meldungen.push('pageerror: ' + String(e).slice(0, 200)));

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
await page.waitForTimeout(300);

const zeilen = [];
let fehl = 0;

// Ein Durchgang: verstellen, Guard rufen, Meldung einsammeln, zuruecksetzen,
// Guard nochmal rufen und auf Stille pruefen.
async function probe(name, erwartet, stellen, richten, guard = 'anlage2Assert') {
  meldungen.length = 0;
  await page.evaluate(stellen);
  await page.evaluate(g => { window[g] ? window[g]() : eval(g + '()'); }, guard);
  await page.waitForTimeout(60);
  const gemeldet = meldungen.slice();

  meldungen.length = 0;
  await page.evaluate(richten);
  await page.evaluate(g => { window[g] ? window[g]() : eval(g + '()'); }, guard);
  await page.waitForTimeout(60);
  const danach = meldungen.slice();

  const traf = gemeldet.some(t => t.includes(erwartet));
  const still = danach.length === 0;
  if (!traf || !still) fehl++;
  const erste = (gemeldet[0] || '(nichts)').replace(/^(T3 Anlage 2|Knöterich):\s*/, '').slice(0, 96);
  zeilen.push(`${traf && still ? 'ok  ' : 'FEHL'}  ${name.padEnd(44)} ${traf ? '' : 'MELDET NICHT '}${still ? '' : 'BLEIBT LAUT '}${erste}`);
}

// (1) Ein Ausbruch an einem Anlass, den der Kommentarkanal nicht kennt. Er
// wuerde nie gerufen: anlage2Notiz() liest beide Tabellen ueber denselben
// Schluessel.
await probe('Ausbruch an einem Anlass ohne Pool', 'wartet auf einen Anlass, den es nicht gibt',
  () => { ANLAGE2_AUSBRUCH.regenschauer = [{auf:'Es tropft schon wieder.', zurueck:'Verzeihung. Nicht mein Thema.'}]; },
  () => { delete ANLAGE2_AUSBRUCH.regenschauer; });

// (2) Die Entscheidung aus T4: in ein Scheitern redet sie nicht hinein. Fuer
// den lauten Kanal gilt sie erst recht.
await probe('Ausbruch auf der Niederlage', 'steht auf der Niederlage',
  () => { ANLAGE2_AUSBRUCH.niederlage = [{auf:'Aufstehen!', zurueck:'Verzeihung. Nicht mein Platz.'}]; },
  () => { delete ANLAGE2_AUSBRUCH.niederlage; });

// (3) Ein Anlass, dessen Paarliste leer geraeumt wurde. anlage2AusbruchZug()
// faellt still auf den Pool zurueck, und ohne diese Zeile faellt es niemandem auf.
await probe('Anlass mit leerer Paarliste', 'hat keine Paare',
  () => { window.__merkEbene = ANLAGE2_AUSBRUCH.ebene; ANLAGE2_AUSBRUCH.ebene = []; },
  () => { ANLAGE2_AUSBRUCH.ebene = window.__merkEbene; });

// (4) Ein Ausbruch ohne Text.
await probe('Ausbruch ohne Text', 'hat keinen Text',
  () => { const p = ANLAGE2_AUSBRUCH.bosssieg[0]; window.__merkAuf = p.auf; p.auf = ''; },
  () => { ANLAGE2_AUSBRUCH.bosssieg[0].auf = window.__merkAuf; });

// (5) Ein Ausbruch ohne Ruecknahme. Traf bis T6 die Brandmauer-Schleife, und
// die ist daran ABGESTUERZT statt zu melden (siehe phase-t6-ausbruch.md,
// Abschnitt 5). Die Meldung hier ist der Beleg, dass sie es nicht mehr tut.
await probe('Ausbruch ohne Rücknahme', 'hat gar keinen Text',
  () => { const p = ANLAGE2_AUSBRUCH.ultimate[0]; window.__merkZur = p.zurueck; delete p.zurueck; },
  () => { ANLAGE2_AUSBRUCH.ultimate[0].zurueck = window.__merkZur; });

// (6) Zwei Ausbrueche desselben Anlasses mit demselben Anfang. Ein Copy-Fehler,
// keine Absicht, und im Spiel unsichtbar, weil zufaellig gezogen wird.
await probe('Zwei Ausbrüche mit demselben Anfang', 'beginnen gleich',
  () => { const l = ANLAGE2_AUSBRUCH.crit; window.__merkC = l[1].auf; l[1].auf = l[0].auf; },
  () => { ANLAGE2_AUSBRUCH.crit[1].auf = window.__merkC; });

// (7) Ein Gate an einem Ausbruch. Er ist per Bauart ungegatet: der Ruhezaehler
// entscheidet, wann er faellt, und ein Schalter daneben waere eine zweite
// Wahrheit ueber dieselbe Zeile.
await probe('Ausbruch mit einem Feld, das es nicht gibt', 'trägt ein Feld, das es nicht gibt',
  () => { ANLAGE2_AUSBRUCH.levelup[0].abAkt = 3; },
  () => { delete ANLAGE2_AUSBRUCH.levelup[0].abAkt; });

// (8) raten kennt nur true. Ein anderer Wert saehe aus wie eine Bedingung.
await probe('raten mit einem anderen Wert als true', 'raten kennt nur true',
  () => { const p = ANLAGE2_AUSBRUCH.goldfund[1]; p.raten = 'ja'; },
  () => { ANLAGE2_AUSBRUCH.goldfund[1].raten = true; });

// (9) Die Ton-Grenze aus T6: laut ja, gegen den Zuhoerer nein. Genau diese
// Zeile stand im Entwurf und ist an dieser Pruefung haengengeblieben.
await probe('Ausbruch, der den Spieler anfährt', 'fährt den Spieler an',
  () => { const p = ANLAGE2_AUSBRUCH.goldfund[0]; window.__merkG = p.auf; p.auf = 'Nehmen Sie das mit!'; },
  () => { ANLAGE2_AUSBRUCH.goldfund[0].auf = window.__merkG; });

// (10) Unter drei Rate-Paaren ist die Bauart ein Einzelfall statt einer
// Eigenschaft, und die Figur kippt beim naechsten Abschnitt still zurueck.
await probe('Ein Rate-Paar zu wenig', 'in denen sie danebenliegt',
  () => { const p = ANLAGE2_AUSBRUCH.kammerAbbruch[0]; delete p.raten; },
  () => { ANLAGE2_AUSBRUCH.kammerAbbruch[0].raten = true; });

// (11) Der Ruhezaehler in der Vorgabe. Fehlt er dort, ist er nach dem ersten
// Laden weg, und dann faellt nie wieder ein Ausbruch, ohne dass etwas kaputt
// aussieht.
await probe('Der Ruhezähler fehlt in der Vorgabe', 'anlage2Ruhig fehlt',
  () => { window.__merkR = kn.counters.anlage2Ruhig; delete kn.counters.anlage2Ruhig; },
  () => { kn.counters.anlage2Ruhig = window.__merkR | 0; });

// (12) Der eigene Deckel des Ausbruchs, 30 statt 44. Er ist der Grund, aus dem
// dieser Kanal ueberhaupt anders klingt, und er liegt in knAssertCaps().
await probe('Ausbruch über dem eigenen Deckel', 'Zeichendeckel verletzt',
  () => { const p = ANLAGE2_AUSBRUCH.crit[0]; window.__merkD = p.auf; p.auf = 'Ja! Und zwar genau da hin, ganz sicher!'; },
  () => { ANLAGE2_AUSBRUCH.crit[0].auf = window.__merkD; },
  'knAssertCaps');

await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Zweigen melden und schweigen danach wieder.`);
process.exit(fehl ? 1 : 0);
