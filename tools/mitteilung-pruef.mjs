// Pruefprotokoll zu Bauabschnitt U9 (phase-u9-hausmitteilung.md).
//
//   python3 serve.py &
//   node tools/mitteilung-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium, wie die uebrigen Laeufe. Geprueft wird,
// was die Hausmitteilung zugesagt hat — und zwar dort, wo sie es zusagt: ueber
// ZWEI Ladevorgaenge. Ein Blatt, das beim ersten Mal erscheint und beim zweiten
// nicht mehr, sieht in einem einzigen Lauf in beiden Zustaenden richtig aus.
//
//   das frische Geraet    ohne Vorher keine Mitteilung, aber ein stiller
//                         Stempel — sonst kaeme sie beim naechsten Laden
//   die Vorgeschichte     mit einem der vier SPEICHER_SCHLUESSEL im Speicher
//                         steht sie VOR dem Startbild, mit genau einem Knopf
//   der Stempel           er faellt beim Klick, nicht beim Anzeigen, und ein
//                         alter Stand laesst sie wiederkommen
//   das Nachlesen         der Knopf im Startbild zeigt dieselbe Mitteilung und
//                         fuehrt zurueck
//   der Weg ins Spiel     startGame() kommt an ihr vorbei (Fund 2 im
//                         Phasendokument: alle 13 Startlaeufe gehen so hinein)
//   auf dem Telefon       390x844 und 360x640: der Knopf ist erreichbar und
//                         nichts laeuft seitlich hinaus. Das ist derselbe
//                         Fund, den menue-pruef am WEITER-Knopf des
//                         Einstellungsvordrucks gemacht hat
//   die Wegbeschreibung   was eine wo-Zeile nennt, gibt es auch. Nachtrag nach
//                         dem Fund am Auslieferungstag: U8 hat den Zulagen ihr
//                         eigenes Fenster genommen, und "Guertel 🗂️ Zulagen"
//                         zeigte auf einen Knopf, den es nicht mehr gab. Ein
//                         Fliesstext ist fuer jeden Guard nur ein Fliesstext —
//                         also wird hier nicht der Satz geprueft, sondern die
//                         Stelle, auf die er zeigt: die genannten Tasten und
//                         Knoepfe werden gedrueckt und muessen oeffnen, was
//                         dort steht
//
// Der Lauf misst nichts, er stellt fest: jede Zeile ist ein Soll-Ist-Vergleich,
// der Exit-Code ist 1, sobald eine Zeile nicht stimmt.
//
// ACHTUNG beim Aendern von NEUERUNGEN.stand: die drei Zeilen mit dem Datum
// unten lesen ihn nicht aus dem Spiel, sondern nennen ihn. Das ist Absicht —
// ein Lauf, der seinen Sollwert aus dem Pruefling holt, prueft nichts.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;
const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

const zeilen = []; let fehl = 0;

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
  console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
  if(!fertig) console.log(
      'ABBRUCH: der Lauf ist vor seinem Ende gestorben. Die Zeile darueber zaehlt nur,\n'
    + 'was bis dahin lief -- alles danach ist UNGEPRUEFT und nicht etwa in Ordnung.\n'
    + 'Die Ursache steht als Ausnahme darunter.');
}
process.on('exit', bericht);

function pruef(name, ist, soll){
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(60)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}

const laut = [];
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', m => { if(m.type() === 'error' && !m.text().includes('404')) laut.push('console: ' + m.text().slice(0,200)); });

const laden = async () => {
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
};
const neuLaden = async () => {
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
};
const kopf = () => page.evaluate(() => document.querySelector('#ovPanel h1').textContent.trim());
const stempel = () => page.evaluate(() => localStorage.getItem('sda_neuerungen'));
// T3: Stand und Punktzahl werden gegen NEUERUNGEN gelesen statt abgeschrieben.
// Der Vorschlag dazu steht seit T1 in phase-t1-tonlage.md, Abschnitt 9: die
// Tabelle hatte zu U9-Zeiten drei Punkte, U10 bis U12 haben zwei angehaengt,
// und der Lauf zaehlte weiter gegen die Drei. Drei Zeilen standen deshalb seit
// Monaten rot, ohne dass etwas kaputt war. Wer den naechsten Punkt anhaengt,
// aendert ab jetzt nichts an diesem Lauf.
const sollStand  = () => page.evaluate(() => NEUERUNGEN.stand);
const sollPunkte = () => page.evaluate(() => NEUERUNGEN.punkte.length);

// --- 1. Das frische Geraet -------------------------------------------------
await laden();
await page.evaluate(() => localStorage.clear());
await neuLaden();
pruef('frisches Geraet sieht das Startbild', await kopf(), 'DAS MONSTRAL MINISTERIUM');
pruef('und bekommt den Stand still gestempelt', await stempel(), await sollStand());
pruef('ohne Vorher kein Knopf im Startbild',
      await page.evaluate(() => document.querySelector('#ovPanel').textContent.includes('Was ist neu')), false);

// --- 2. Das Geraet mit Vorgeschichte ---------------------------------------
await page.evaluate(() => {
  localStorage.clear();
  kn.seen.einstellung = true; saveKn();
  amt.schichten = 4; amt.bankGold = 99; saveAmt();
});
await neuLaden();
pruef('mit Vorgeschichte kommt die Mitteilung zuerst', await kopf(), 'HAUSMITTEILUNG');
const inhalt = await page.evaluate(() => ({
  punkte: document.querySelectorAll('#ovPanel .neuPunkt').length,
  wo: document.querySelectorAll('#ovPanel .neuWo').length,
  knoepfe: [...document.querySelectorAll('#ovPanel button')].map(b => b.textContent.trim()),
  stand: state,
}));
const soll = await sollPunkte();
pruef('so viele Punkte wie Neuerungen', inhalt.punkte, soll);
pruef('jeder Punkt sagt, wo es steht', inhalt.wo, soll);
pruef('genau ein Knopf, und der fuehrt weiter', inhalt.knoepfe, ['Zur Kenntnis genommen']);
pruef('der Zustand ist Menue, nicht Spiel', inhalt.stand, 'menu');
pruef('vor dem Klick steht kein Stempel', await stempel(), null);

await page.locator('#ovPanel button').click();
pruef('der Knopf fuehrt ins Startbild', await kopf(), 'DAS MONSTRAL MINISTERIUM');
pruef('und stempelt den Stand', await stempel(), await sollStand());
pruef('das Startbild bietet das Nachlesen an',
      await page.evaluate(() => [...document.querySelectorAll('#ovPanel button')].map(b => b.textContent.trim())),
      ['Dienst fortsetzen', 'Was ist neu', 'Dienstanweisung']);

await page.locator('#ovPanel button', { hasText: 'Was ist neu' }).click();
pruef('Nachlesen zeigt dieselbe Mitteilung', await kopf(), 'HAUSMITTEILUNG');
await page.locator('#ovPanel button', { hasText: 'Zur Kenntnis' }).click();
pruef('und geht wieder zurueck', await kopf(), 'DAS MONSTRAL MINISTERIUM');

await neuLaden();
pruef('nach dem Stempel bleibt sie beim Neuladen weg', await kopf(), 'DAS MONSTRAL MINISTERIUM');

await page.evaluate(() => localStorage.setItem('sda_neuerungen', '2026-08-01'));
await neuLaden();
pruef('ein alter Stempel laesst sie wiederkommen', await kopf(), 'HAUSMITTEILUNG');

// --- 3. Der Weg ins Spiel bleibt frei --------------------------------------
await page.evaluate(() => startGame());
await page.waitForTimeout(300);
await page.evaluate(() => { if(typeof empfangAktiv !== 'undefined' && empfangAktiv) empfangUeberspringen(); });
await page.waitForTimeout(200);
for(let i = 0; i < 60; i++){
  const offen = await page.evaluate(() => document.getElementById('overlay').style.display === 'flex');
  if(!offen) break;
  const b = page.locator('#overlay button').last();
  if(await b.count() === 0) break;
  await b.click({ force: true });
  await page.waitForTimeout(150);
}
await page.waitForTimeout(400);
pruef('startGame() kommt an der Mitteilung vorbei', await page.evaluate(() => state), 'play');

// --- 3b. Die Wegbeschreibung zeigt auf etwas, das es gibt -------------------
// Der Fund vom Auslieferungstag, s. Kopf. Geprueft wird nicht der Satz, sondern
// die Stelle: jede Taste und jeder Knopf, den eine wo-Zeile nennt, wird hier
// wirklich gedrueckt. Wer einen Punkt umschreibt, zieht diese Liste mit.
const genannt = await page.evaluate(() => NEUERUNGEN.punkte.map(p => p.wo).join(' '));
pruef('die Zeilen nennen Taste C, Taste Z und den Fächer',
      [genannt.includes('Taste C'), genannt.includes('Taste Z'), genannt.includes('Angriffsfächer')],
      [true, true, true]);
pruef('den Knopf 🧍 am Guertel gibt es',
      await page.evaluate(() => !!document.getElementById('charBtn')
                              && document.getElementById('charBtn').textContent.includes('🧍')), true);
await page.keyboard.press('c');
pruef('Taste C oeffnet das Charakterfenster',
      await page.evaluate(() => charakterOpen), true);
await page.keyboard.press('z');
pruef('Taste Z fuehrt direkt auf die Kartenmappe',
      await page.evaluate(() => [charakterOpen, charBlatt]), [true, 'mappe']);
// T3: auch diese Zahl wird gelesen statt abgeschrieben. Sie stand auf vier,
// seit U8 vier Grossfenster gebaut hat; die Optionen sind spaeter als fuenftes
// dazugekommen, und der Lauf zaehlte weiter gegen die Vier. Dritter und
// letzter der drei vorbestehenden Rotstaende aus phase-t1-tonlage.md.
pruef('das Reiterband steht im Kopf des Fensters',
      await page.evaluate(() => document.querySelectorAll('#charakter .gfReiter').length),
      await page.evaluate(() => GROSSFENSTER.length));
await page.keyboard.press('Escape');
pruef('die vier Ecken der Bedienschicht stehen',
      await page.evaluate(() => ['statusKarte', 'minimap', 'uhrTxt', 'prioBtn']
        .filter(id => !!document.getElementById(id)).length), 4);
await ctx.close();

// --- 4. Auf dem Telefon: der Knopf steht im Bild ----------------------------
for(const [name, w, h] of [['390x844', 390, 844], ['360x640', 360, 640]]){
  const c = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true });
  const p = await c.newPage();
  p.on('pageerror', e => laut.push(`pageerror(${name}): ` + String(e).slice(0, 200)));
  await p.goto(URL, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
  await p.evaluate(() => { localStorage.clear(); kn.seen.einstellung = true; saveKn(); amt.schichten = 4; saveAmt(); });
  await p.reload({ waitUntil: 'load' });
  await p.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
  pruef(`${name}: die Mitteilung steht`, await p.evaluate(() => document.querySelector('#ovPanel h1').textContent.trim()), 'HAUSMITTEILUNG');
  const b = await p.evaluate(() => {
    const el = document.querySelector('#ovPanel button');
    const r = el.getBoundingClientRect();
    const ov = document.getElementById('overlay');
    return { unten: Math.round(r.bottom), sicht: window.innerHeight, rollbar: ov.scrollHeight > ov.clientHeight,
             breit: document.getElementById('ovPanel').scrollWidth <= window.innerWidth };
  });
  pruef(`${name}: der Knopf ist erreichbar`, b.unten <= b.sicht || b.rollbar, true);
  pruef(`${name}: nichts laeuft seitlich hinaus`, b.breit, true);
  await p.locator('#ovPanel button').click();
  pruef(`${name}: und fuehrt ins Startbild`, await p.evaluate(() => document.querySelector('#ovPanel h1').textContent.trim()), 'DAS MONSTRAL MINISTERIUM');
  await c.close();
}

pruef('Konsole still', laut, []);
await browser.close();
fertig = true;
bericht();
process.exit(fehl ? 1 : 0);
