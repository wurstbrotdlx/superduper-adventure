// Pruefprotokoll zu Bauabschnitt W11 (phase-w11-reich-im-dorf.md).
//
//   python3 serve.py &
//   node tools/reich-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// Geprueft wird, was W11 zugesagt hat:
//
//   Torschaltung    Nieselbeck steht von Anfang an im Dorf, Kordula Umlauf ab
//                   Akt II, Vorblatt ab Akt III. Davor ist die Figur weder zu
//                   sehen noch anzusprechen. Ausserhalb des Schichtmodus gibt es
//                   keine Akte, dort steht jeder da.
//   Zusatzzeilen    Die zehn Zuwachs-Bloecke der bestehenden Figuren schalten
//                   genau in ihrem Akt frei und keinen Akt frueher. Noergel hat
//                   zwei Bloecke, einen am Merker und einen am Akt, und sie
//                   stoeren sich nicht.
//   Zyklus          Der Grundzeilen-Kreislauf laeuft mit den Zusatzzeilen rund,
//                   ohne eine einzige leere Sprechblase. Eine leere Blase waere
//                   eine stumme Figur, und genau das war der Fund aus G6.
//   Bramsche        Keine Frage steht doppelt in der Tabelle, jede Antwort ist
//                   vollstaendig.
//   Kopfzeile       Kein Name aus W11 ist breiter als der breiteste, den es
//                   vorher schon gab. Die Kopfzeile bricht um statt
//                   abzuschneiden; der breiteste Name ist Fass und war es vorher.
//
// Wie menue-pruef.mjs und gespraech-pruef.mjs stellt dieser Lauf fest statt zu
// messen: jede Zeile ist ein Soll-Ist-Vergleich, Exit-Code 1 bei der ersten
// Abweichung.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();

const laut = [];
page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', m => {
  if(m.type() !== 'error' && m.type() !== 'warning') return;
  if(m.text().includes('404')) return;   // fehlendes Sprite-Blatt ist ein Lizenzstand, kein Fund
  laut.push(m.type() + ': ' + m.text().slice(0, 200));
});

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });

const zeilen = await page.evaluate(() => {
  const raus = [];
  const pruef = (name, ist, soll) => raus.push({name, ist, soll, ok: JSON.stringify(ist) === JSON.stringify(soll)});
  const fig = k => DORF_FIGUREN.find(f => f.key === k);
  const sicherung = {schichtModus: CONFIG.schichtModus, schichten: amt.schichten, lager: kn.flags.hatLagerGesehen};
  CONFIG.schichtModus = true;

  // --- Torschaltung ---------------------------------------------------------
  const AB = {nieselbeck: 1, umlauf: 2, vorblatt: 3};
  for(const sch of [0, 10, 20, 30, 40]){
    amt.schichten = sch;
    const akt = aktStand();
    for(const k in AB) pruef(`${k} steht in Akt ${akt} im Dorf`, figDa(fig(k)), akt >= AB[k]);
  }
  CONFIG.schichtModus = false; amt.schichten = 0;
  for(const k in AB) pruef(`${k} steht im freien Spiel im Dorf`, figDa(fig(k)), true);
  CONFIG.schichtModus = true;

  // --- Zusatzzeilen ---------------------------------------------------------
  const ZUS = {zwirn: 2, milb: 2, pommer: 2, bramsche: 3, lisbeth: 3, trepp: 3,
               lott: 3, pahl: 3, zapf: 4, fass: 4};
  for(const k in ZUS){
    amt.schichten = (ZUS[k] - 2) * 10;
    const vorher = figZusatz(fig(k)).length;
    amt.schichten = (ZUS[k] - 1) * 10;
    const nachher = figZusatz(fig(k)).length;
    pruef(`${k} Zusatzzeilen erst ab Akt ${ZUS[k]}`, [vorher, nachher], [0, 2]);
  }
  amt.schichten = 30; kn.flags.hatLagerGesehen = false;
  pruef('noergel ohne Lagerbesuch nur der Akt-Block', figZusatz(fig('noergel')).length, 2);
  kn.flags.hatLagerGesehen = true;
  pruef('noergel mit Lagerbesuch beide Bloecke', figZusatz(fig('noergel')).length, 6);
  kn.flags.hatLagerGesehen = false;

  // --- Zyklus ---------------------------------------------------------------
  amt.schichten = 40;
  const stumm = [];
  for(const f of DORF_FIGUREN){
    if(!figDa(f)) continue;
    const n = {bubbleIdx: -1, bubbleText1: '', bubbleText2: '', figur: f};
    const laenge = f.grund.length + figZusatz(f).length + langZusatz(f.key).length + 2;
    for(let i = 0; i < laenge * 2; i++){ npcCycle(n, f); if(!n.bubbleText1) stumm.push(f.key); }
  }
  pruef('kein Zyklus laeuft in eine leere Sprechblase', [...new Set(stumm)], []);

  // --- Bramsche -------------------------------------------------------------
  const fragen = fig('bramsche').antworten.map(a => a.frage);
  pruef('keine Frage steht doppelt in Bramsches Tabelle', new Set(fragen).size, fragen.length);
  pruef('jede Antwort Bramsches ist vollstaendig',
        fig('bramsche').antworten.filter(a => !a.z1 || !a.z2).length, 0);

  // --- Kopfzeile ------------------------------------------------------------
  const gp = document.getElementById('gespraech'), txt = document.getElementById('gespraechNameTxt');
  const vorher = gp.style.display;
  gp.style.display = 'block';
  const breite = name => { txt.textContent = name; return txt.getBoundingClientRect().width; };
  const NEU = ['nieselbeck', 'umlauf', 'vorblatt'];
  let altBreit = 0;
  for(const f of DORF_FIGUREN) if(!NEU.includes(f.key)) altBreit = Math.max(altBreit, breite(f.name));
  const zuBreit = NEU.filter(k => breite(fig(k).name) > altBreit);
  txt.textContent = ''; gp.style.display = vorher;
  pruef('kein Name aus W11 ist der neue breiteste', zuBreit, []);
  pruef('die Kopfzeile bricht um statt abzuschneiden',
        getComputedStyle(document.getElementById('gespraechName')).overflowWrap, 'break-word');

  CONFIG.schichtModus = sicherung.schichtModus;
  amt.schichten = sicherung.schichten;
  kn.flags.hatLagerGesehen = sicherung.lager;
  return raus;
});

await browser.close();
let fehl = 0;
for(const z of zeilen){
  if(!z.ok) fehl++;
  console.log(`${z.ok ? 'ok  ' : 'FEHL'}  ${z.name.padEnd(56)} ist=${JSON.stringify(z.ist)} soll=${JSON.stringify(z.soll)}`);
}
if(laut.length){ console.log('\nKonsole:'); for(const l of laut) console.log('  ' + l); }
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl || laut.length ? 1 : 0);
