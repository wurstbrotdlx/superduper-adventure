// Ladelauf: die Seite im echten Browser starten und zusehen, ob sie hochkommt.
//
//   python3 serve.py &
//   node tools/ladelauf-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt. Im
// Cloud-Container heisst der Pfad
// PLAYWRIGHT_PFAD=/opt/node22/lib/node_modules/playwright/index.js — ein
// Verzeichnis allein reicht dem ESM-Lader nicht.
//
// Warum es diesen Lauf gibt
// -------------------------
// Der Syntaxcheck (node --check je Datei) findet Syntaxfehler und sonst nichts.
// Der haeufigste echte Fehler dieses Projekts ist ein anderer: ein
// ReferenceError beim Laden, weil etwas, das schon auf Skriptebene laeuft, eine
// erst spaeter deklarierte Konstante liest. Den sieht nur ein Browser. Seit der
// Teilung (DT1) kommt eine zweite Klasse derselben Art dazu: die sieben
// skript/-Dateien laufen in der Reihenfolge ihrer Tags, und eine falsche
// Reihenfolge faellt genauso aus — leise, mit demselben ReferenceError.
//
// Dieser Lauf ist der Prueferm fuer beides und stand bis DT2 als abgeschriebenes
// Schnipsel im README. Als Werkzeug laeuft er in der CI bei jedem Push mit.
//
// Das Abnahmekriterium ist das des Hauses: eine stille Konsole. Die Guards
// werfen nie, sie melden; wer hier etwas sieht, hat einen Fund.

const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';

const funde = [];
let warnungen = 0, guards = 0, fertig = false;

// RIEGEL, Bauform wie in speicher-pruef.mjs: stirbt der Lauf vor seinem Ende,
// soll niemand die letzte Zeile fuer ein Ergebnis halten. Ohne ihn sieht ein
// abgestuerzter Lauf aus wie ein stiller.
process.on('exit', () => {
  if (fertig) return;
  console.error('ABBRUCH: der Lauf ist vor seinem Ende gestorben. Nichts hiervon ist');
  console.error('"in Ordnung", die Ursache steht als Ausnahme darunter oder als Zeitablauf.');
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();

page.on('pageerror', e => funde.push('pageerror: ' + String(e).slice(0, 300)));
page.on('console', m => {
  const t = m.text();
  if (t.includes('in Ordnung')) guards++;
  if (m.type() === 'warning') { warnungen++; return; }
  if (m.type() !== 'error') return;
  // Ein fehlendes Blatt ist ein Lizenzstand und kein Fund: assets/cf steht in
  // der .gitignore, und assets/cf/innen ist zusaetzlich als optional
  // eingetragen. Wer ohne Grafik prueft, prueft das Skript, nicht die Bilder.
  if (t.includes('404')) return;
  funde.push('console: ' + t.slice(0, 300));
});

await page.goto(URL, { waitUntil: 'load' });

// Auf frameNo warten, nicht auf assetsReady: die Flagge steht auch dann auf
// true, wenn kein einziges Bild geladen wurde (README, "Eine frische Sitzung").
// frameNo > 0 heisst, dass die Ladekette durch ist und die Schleife laeuft.
//
// Laeuft die Wartezeit ab, ist der Zeitablauf nur das Symptom: die Ursache
// steht laengst als pageerror in funde. Sie wird hier ausgegeben, statt den
// Lauf an der Ausnahme sterben zu lassen — sonst meldet das Werkzeug einen
// Zeitablauf und verschweigt den ReferenceError, der ihn ausgeloest hat.
try {
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
} catch {
  console.error(`FEHL: ${URL} kommt nicht hoch, frameNo bleibt aus (60 s).`);
  console.error('Die Ladekette ist abgerissen. Was sie abgerissen hat:');
  if (funde.length) for (const f of funde) console.error('  ' + f);
  else console.error('  (nichts in der Konsole; dann haengt es vor dem ersten Skript)');
  await browser.close();
  fertig = true;   // gemeldet ist gemeldet, der Riegel muss nicht mehr anspringen
  process.exit(1);
}

// Nachlauf: die Guards hinter loadAssets() melden spaeter als die auf
// Skriptebene, und ein Fehler im ersten Bild soll noch mitgenommen werden.
await page.waitForTimeout(2500);

const frames = await page.evaluate(() => frameNo);
await browser.close();

if (funde.length) {
  console.error(`FEHL: ${funde.length} Fund(e) in der Konsole von ${URL}`);
  for (const f of funde) console.error('  ' + f);
  process.exit(1);
}

fertig = true;
// Gezaehlt wird die Wortmarke "in Ordnung", nicht jede Guard-Zeile: viele melden
// stattdessen ihre Zahlen ("6 Gebaeude decken ihren Fussabdruck"). Die Zahl steht
// als Anhaltspunkt da und wird nicht eingeklagt, sonst waere jeder neue Guard
// eine Aenderung an zwei Dateien. Nachgezaehlt wird im README.
console.log(`in Ordnung: ${URL} laeuft (frameNo ${frames}), Konsole still.`);
console.log(`            ${guards}x "in Ordnung", ${warnungen} Warnungen (ohne Grafik erwartet).`);
