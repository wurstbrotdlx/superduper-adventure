// Pruefprotokoll zu Bauabschnitt U8 (phase-u8-hausmitteilung.md).
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

// --- 1. Das frische Geraet -------------------------------------------------
await laden();
await page.evaluate(() => localStorage.clear());
await neuLaden();
pruef('frisches Geraet sieht das Startbild', await kopf(), 'DAS MONSTRAL MINISTERIUM');
pruef('und bekommt den Stand still gestempelt', await stempel(), '2026-08-25');
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
pruef('drei Punkte', inhalt.punkte, 3);
pruef('jeder Punkt sagt, wo es steht', inhalt.wo, 3);
pruef('genau ein Knopf, und der fuehrt weiter', inhalt.knoepfe, ['Zur Kenntnis genommen']);
pruef('der Zustand ist Menue, nicht Spiel', inhalt.stand, 'menu');
pruef('vor dem Klick steht kein Stempel', await stempel(), null);

await page.locator('#ovPanel button').click();
pruef('der Knopf fuehrt ins Startbild', await kopf(), 'DAS MONSTRAL MINISTERIUM');
pruef('und stempelt den Stand', await stempel(), '2026-08-25');
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
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
