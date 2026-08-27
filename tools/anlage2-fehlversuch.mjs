// Gegenprobe zu anlage2Assert() und den Ausbruch-Deckeln in knAssertCaps()
// (Bauabschnitt T7, phase-t7-ausbruch.md).
//
//   python3 serve.py &
//   node tools/anlage2-fehlversuch.mjs [URL]
//
// Nach dem Vorbild von tools/ebene-fehlversuch.mjs, monster-fehlversuch.mjs
// und steinbruch-fehlversuch.mjs: ein Guard, der immer schweigt, beweist
// nichts. Hausbrauch seit T1 ist, jeden neuen Zweig einmal ausgeloest zu haben;
// bisher stand das Protokoll nur im Phasendokument, also als Behauptung ueber
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
// Ausbruchs (30 statt 44) ist eine Zusage dieses Abschnitts wie die uebrigen.
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

// RIEGEL (27.08.2026, INTRO-MESSUNG Pruefung 4): Das Protokoll gehoert dem Lauf
// und nicht seinem guten Ende. Bis hierher stand der Druck ganz unten, und eine
// ungefangene Ausnahme mittendrin nahm ihn mit -- Exit-Code 1, ein Stapelabzug,
// und keine Zeile darueber, was geprueft wurde und was nicht. Nachgestellt:
// null von 96 Zeilen, wenn der Lauf vor seinem Ende stirbt.
//
// Der ABBRUCH-Hinweis ist dabei nicht die Zierde, sondern der Kern. Ohne ihn
// meldet ein abgebrochener Lauf "40 von 40 Pruefungen bestanden", und das liest
// sich wie ein sauberer Durchlauf, obwohl der ganze Rest nie gelaufen ist.
let berichtet = false, fertig = false;
function bericht(){
  if(berichtet) return;
  berichtet = true;
  console.log(zeilen.join('\n'));
  console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Zweigen melden und schweigen danach wieder.`);
  if(!fertig) console.log(
      'ABBRUCH: der Lauf ist vor seinem Ende gestorben. Die Zeile darueber zaehlt nur,\n'
    + 'was bis dahin lief -- alles danach ist UNGEPRUEFT und nicht etwa in Ordnung.\n'
    + 'Die Ursache steht als Ausnahme darunter.');
}
process.on('exit', bericht);


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

// (5) Ein Ausbruch ohne Ruecknahme. Traf die Brandmauer-Schleife, und
// die ist daran ABGESTUERZT statt zu melden (siehe phase-t7-ausbruch.md,
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

// (9) Die Ton-Grenze des Ausbruchs: laut ja, gegen den Zuhoerer nein. Genau diese
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

// ---- T8: der Szenenkanal ---------------------------------------------------
// Dreizehn Zweige mehr, und sie wiegen schwerer als die zwoelf davor: eine
// Szenenzeile faellt GENAU EINMAL pro Spielstand. Was hier durchrutscht,
// bemerkt niemand beim zweiten Hoeren, denn ein zweites Mal gibt es nicht.

// (13) Eine Szenenzeile an einem Anlass, den keine Szene setzt. Sie laege
// vollstaendig und richtig geschrieben da und wuerde nie gerufen.
await probe('Szenenzeile an einem fremden Anlass', 'wartet auf einen Anlass, den keine Szene setzt',
  () => { ANLAGE2_SZENE.regenschauer = {z1:'Es tropft schon wieder.', z2:'Papier mag das nicht.'}; },
  () => { delete ANLAGE2_SZENE.regenschauer; });

// (14) Die Entscheidung dieses Abschnitts, und die einzige, die man mit der
// besten Absicht kaputtmacht: bei der Entklammerung schweigt sie. Die Zeile
// unten ist die, die einem dazu einfaellt, und sie ist gut. Sie darf trotzdem
// nicht da stehen.
await probe('Eine Zeile bei der Entklammerung', 'Bei der Entklammerung schweigt sie',
  () => { ANLAGE2_SZENE.vorblatt = {z1:'Er hatte eine Klammer.', z2:'Ganz wie ich.'}; },
  () => { delete ANLAGE2_SZENE.vorblatt; });

// (15) Dasselbe im lauten Kanal. Zwei Tabellen, eine Entscheidung.
await probe('Ein Ausbruch auf einem Szenen-Anlass', 'steht auf einem Szenen-Anlass',
  () => { ANLAGE2_AUSBRUCH.umlauf = [{auf:'Vierzehn Türme!', zurueck:'Verzeihung. Nicht mein Weg.'}]; },
  () => { delete ANLAGE2_AUSBRUCH.umlauf; });

// (16) Und die Gegenrichtung zum Schweigen. Ohne sie waere die Stille bei
// Vorblatt nicht von der Stille zu unterscheiden, die entsteht, wenn jemand
// eine Szene dazubaut und die Zeile vergisst, und dann bewiese (14) nichts.
await probe('Eine Szene ohne ihre Zeile', 'Eine Szene endet, und sie sagt nichts dazu',
  () => { window.__merkU = ANLAGE2_SZENE.umlauf; delete ANLAGE2_SZENE.umlauf; },
  () => { ANLAGE2_SZENE.umlauf = window.__merkU; });

// (17) Ein Anlass, der auf eine Liste zeigt statt auf ein Paar. Die Bauart des
// Kanals ist "genau ein Paar", und sie steht in der Form der Tabelle; wer sie
// nach dem Vorbild des Ausbruchs zur Liste macht, bricht sie geraeuschlos.
await probe('Ein Szenen-Anlass mit einer Liste', 'trägt kein Paar',
  () => { window.__merkL = ANLAGE2_SZENE.hintermuehl;
          ANLAGE2_SZENE.hintermuehl = [{z1:'Er hat etwas gesagt.', z2:'Mehr weiß ich nicht.'}]; },
  () => { ANLAGE2_SZENE.hintermuehl = window.__merkL; });

// (18) Eine Szenenzeile ohne Text.
await probe('Szenenzeile ohne Text', 'Eine Szenenzeile hat keinen Text',
  () => { const p = ANLAGE2_SZENE.umlauf; window.__merkZ1 = p.z1; p.z1 = ''; },
  () => { ANLAGE2_SZENE.umlauf.z1 = window.__merkZ1; });

// (19) Eine Szenenzeile ohne zweite Haelfte. Trifft zugleich die Schleife der
// Brandmauer, und die ist genau der Fall, an dem sie in T7 ABGESTUERZT ist
// statt zu melden. Der Zweig laeuft hier auf einer Quelle, die es damals noch
// nicht gab: der Typcheck von damals traegt also weiter.
await probe('Szenenzeile ohne zweite Hälfte', 'keine zweite Hälfte',
  () => { const p = ANLAGE2_SZENE.hintermuehl; window.__merkZ2 = p.z2; delete p.z2; },
  () => { ANLAGE2_SZENE.hintermuehl.z2 = window.__merkZ2; });

// (20) Ein Gate an einer Szenenzeile. Der Kanal hat genau eine Bedingung, und
// die heisst: die Szene ist zu Ende. Ein Schalter daneben waere eine zweite.
await probe('Szenenzeile mit einem Feld, das es nicht gibt', 'trägt ein Feld, das es nicht gibt',
  () => { ANLAGE2_SZENE.umlauf.raten = true; },
  () => { delete ANLAGE2_SZENE.umlauf.raten; });

// (21) Die Brandmauer ueber der zweiten Haelfte. Die Szenenzeilen fallen in dem
// Moment, in dem die Akte selbst spricht, und wer eine dazuschreibt, hat die
// Szene frisch im Kopf und ihre Unwissenheit nicht.
await probe('Szenenzeile mit einem Wort aus der Akte', 'Brandmauer verletzt',
  () => { const p = ANLAGE2_SZENE.hintermuehl; window.__merkB = p.z2; p.z2 = 'Der Sturz steht in der Liste.'; },
  () => { ANLAGE2_SZENE.hintermuehl.z2 = window.__merkB; });

// (22) Der Deckel. 44 auf beiden Haelften, wie im Kommentarkanal und nicht wie
// im Ausbruch, und er liegt in knAssertCaps().
await probe('Szenenzeile über dem Deckel', 'Zeichendeckel verletzt',
  () => { const p = ANLAGE2_SZENE.umlauf; window.__merkDS = p.z1;
          p.z1 = 'Umlauf. So heißt auch mein ganzer Weg bis hierher.'; },
  () => { ANLAGE2_SZENE.umlauf.z1 = window.__merkDS; },
  'knAssertCaps');

// (23) und (24) sind der T8-Fund: ANLASS_QUELLEN behauptet seit SZ3 im
// Kommentar, die Anlaesse der Szenen zu fuehren und "dort gegengeprueft" zu
// werden. Geprueft wurde bis T8 nichts. Beide Richtungen laufen jetzt.
await probe('ANLASS_QUELLEN führt einen Anlass zu viel', 'ANLASS_QUELLEN führt einen Anlass, den keine Szene setzt',
  () => { ANLASS_QUELLEN.push('regenschauer'); },
  () => { ANLASS_QUELLEN.pop(); });

await probe('Eine Szene setzt einen unbekannten Anlass', 'den ANLASS_QUELLEN nicht führt',
  () => { window.__merkS = SZENE_ANLASS.umlauf; SZENE_ANLASS.umlauf = 'muehlenbach'; },
  () => { SZENE_ANLASS.umlauf = window.__merkS; });

// (25) Und der Weg, auf dem vorblatt seinen Anlass setzt. Er laeuft nicht ueber
// SZENE_ANLASS, sondern direkt in vorblattAngekommen(), und gelesen wird er aus
// dem Quelltext. Faellt die Zeile dort heraus, verstummt der Chor auf der Bank
// an der groessten Stelle des vierten Aktes, ohne dass etwas kaputt aussieht.
await probe('Die Entklammerung setzt keinen Anlass mehr', 'der Chor auf der Bank verstummt',
  () => { window.__merkV = vorblattAngekommen;
          vorblattAngekommen = function(){ kn.flags.szeneVorblatt = true; saveKn(); szeneAus(); }; },
  () => { vorblattAngekommen = window.__merkV; });

await browser.close();
fertig = true;
bericht();
process.exit(fehl ? 1 : 0);
