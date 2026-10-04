// Pruefprotokoll zu Bauabschnitt KA1 (phase-ka1-druck-aus-hochablage.md):
// Konrad zu Haendens Aufschub haengt als Druck in der Amtsstube.
//
//   python3 serve.py &
//   node tools/aufschub-pruef.mjs [URL]
//
// szeneAssert() prueft die Form jedes Zuges (Sperre, Gedankenstrich, Emoji).
// Was sich erst im Spielen zeigt, steht hier:
//
//   das Wandstueck   haengt im Grundriss der Amtsstube an der Nordwand, zwei
//                    Kacheln breit, rechts der Karte, und zeigt auf das Blatt
//   der Kreislauf    sechs Zuege, je Ansehen einer, nach dem sechsten wieder
//                    der erste; die Zeilen sind die sechs Grundzeilen aus der
//                    Weltgeschichte, Kapitel 6, woertlich
//   die Tafel        Ansehen oeffnet den Stapel mit genau einem Blatt,
//                    "Blatt I von I", Knopf WEGSEHEN, Sprecher Aufschub, die
//                    Welt steht; WEGSEHEN gibt sie zurueck
//   der Kaiser       kommt in allen Zuegen nur im Praesens vor und nur als Tuer
//   die Schlange     kein Eintrag in DORF_FIGUREN, keine Figur im Dorf
//   Konsole still
//
// Der Lauf stellt fest statt zu messen; Exit-Code 1 bei der ersten Abweichung.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const laut = [];
page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', m => {
  if(m.type() !== 'error' && m.type() !== 'warning') return;
  if(m.text().includes('404') || m.text().includes('Sprite fehlt')) return;
  laut.push(m.type() + ': ' + m.text().slice(0, 200));
});

const zeilen = [];
let fehl = 0;
function pruef(name, ist, soll){
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(62)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });

// --- Tabelle und Grundriss, ohne Spielzug -------------------------------------
const tab = await page.evaluate(() => {
  const r = REQUISITEN.kaisertuer;
  const plan = INN_RAEUME.amt.plan;
  const zeile = plan.findIndex(z => z.includes('Jj'));
  const KANON = [
    ['Ich bin Vierter. Das ist sehr weit vorn.', 'Es waren einmal neun.'],
    ['Man klopft nicht. Er ist im Termin.', 'So etwas tut man nicht.'],
    ['Die Bank ist bequem. Man richtet sich ein.', 'Mein Vater saß hier auch.'],
    ['Was ich vortragen will? Etwas Wichtiges.', 'Es fällt mir wieder ein.'],
    ['Der Wasserspender ist neu. Seit achtzig Jahren.', 'Wir waren sehr froh.'],
    ['Nach mir kommt niemand mehr.', 'Ich bin der Letzte. Auch schön.'],
  ];
  const alles = r.zuege.map(z => [z.blatt, ...z.stimme.map(s => s.z), z.regie || ''].join(' ')).join(' ');
  return {
    da: !!r, name: r.name, knopf: r.knopf, zuege: r.zuege.length,
    zeilen: r.zuege.map(z => z.stimme.map(s => s.z)), kanon: KANON,
    sprecher: [...new Set(r.zuege.flatMap(z => z.stimme.map(s => s.wer)))],
    moebel: INN_MOEBEL.J, planZeile: zeile, planBreit: (plan[zeile] || '').indexOf('Jj') >= 0,
    rechtsDerKarte: zeile >= 0 && plan[zeile].indexOf('Jj') > plan[zeile].indexOf('Cc'),
    nordwand: zeile === 1,
    kaiserVergangenheit: /\bwar im Termin|Kaiser.*(starb|tot|gestorben)/i.test(alles),
    schild: alles.includes('IM TERMIN'),
    imDorf: DORF_FIGUREN.some(f => /aufschub/i.test(f.key + f.name)),
    // nur die Dinge im Plan der Amtsstube; REQUISITEN traegt seit HO1 auch die drei aus Turm I
    anzahl: new Set(INN_RAEUME.amt.plan.join('').split('').map(c => INN_MOEBEL[c]).filter(m => m && m.akt === 'requisit').map(m => m.requisit)).size,
  };
});
pruef('das Requisit gibt es', tab.da, true);
pruef('drei Requisiten in der Amtsstube', tab.anzahl, 3);
pruef('Name und Knopf', [tab.name, tab.knopf], ['Der Druck aus Hochablage', 'WEGSEHEN']);
pruef('sechs Zuege', tab.zuege, 6);
pruef('die sechs Grundzeilen stehen woertlich', tab.zeilen, tab.kanon);
pruef('nur Aufschub spricht', tab.sprecher, ['Aufschub']);
pruef('das Wandstueck J zeigt auf das Blatt', [tab.moebel.akt, tab.moebel.requisit, tab.moebel.wand, tab.moebel.frei], ['requisit', 'kaisertuer', true, true]);
pruef('es haengt zwei Kacheln breit an der Nordwand', [tab.planBreit, tab.nordwand], [true, true]);
pruef('rechts der Karte', tab.rechtsDerKarte, true);
pruef('der Kaiser kommt nur im Praesens vor', tab.kaiserVergangenheit, false);
pruef('das Schild IM TERMIN steht im Text', tab.schild, true);
pruef('Aufschub steht nicht im Dorf', tab.imDorf, false);

// --- Der Kreislauf ueber requisitBlatt(), ohne Tafel ----------------------------
const kreis = await page.evaluate(() => {
  const vorher = requisitZug.kaisertuer;
  const folge = [];
  for(let i = 0; i < 8; i++) folge.push(requisitBlatt('kaisertuer').stimme[0].z);
  requisitZug.kaisertuer = vorher;
  return folge;
});
pruef('je Ansehen ein Zug, nach dem sechsten wieder der erste',
      kreis.map(z => z.slice(0, 12)), ['Ich bin Vier', 'Man klopft n', 'Die Bank ist', 'Was ich vort', 'Der Wasserspe'.slice(0, 12), 'Nach mir kom', 'Ich bin Vier', 'Man klopft n']);
pruef('ein Requisit ohne Zuege liefert sich selbst', await page.evaluate(() => requisitBlatt('karte') === REQUISITEN.karte), true);

// --- Die Tafel, im Spiel -----------------------------------------------------
await page.evaluate(() => startGame());
await page.waitForTimeout(300);
await page.evaluate(() => { if(typeof szeneAktiv !== 'undefined' && szeneAktiv === 'empfang') empfangUeberspringen(); });
await page.waitForTimeout(200);
for(let i = 0; i < 60; i++){
  const offen = await page.evaluate(() => document.getElementById('overlay').style.display === 'flex');
  if(!offen) break;
  const b = page.locator('#overlay button').last();
  if(await b.count() === 0) break;
  await b.click({ force: true });
  await page.waitForTimeout(150);
}
pruef('der Dienst laeuft, drinnen', await page.evaluate(() => [state, !!innen]), ['play', true]);
await page.evaluate(() => { requisitZug.kaisertuer = 0; requisitAnsehen('kaisertuer'); });
await page.waitForTimeout(350);
const tafel = await page.evaluate(() => ({
  state, overlay: el('overlay').style.display,
  fuss: (document.querySelector('#ovPanel .amtFuss') || {}).textContent,
  knoepfe: [...document.querySelectorAll('#ovPanel button')].map(b => b.textContent.trim()),
  text: document.getElementById('ovPanel').textContent,
}));
pruef('Ansehen oeffnet den Stapel und haelt die Welt', [tafel.state, tafel.overlay], ['szene', 'flex']);
pruef('ein Blatt, Blatt I von I', tafel.fuss, 'Blatt I von I');
pruef('der Knopf heisst WEGSEHEN', tafel.knoepfe, ['WEGSEHEN']);
pruef('der erste Zug steht da, mit Sprecher', [tafel.text.includes('Ich bin Vierter. Das ist sehr weit vorn.'), tafel.text.includes('Aufschub'), tafel.text.includes('IM TERMIN')], [true, true, true]);
await page.locator('#ovPanel button').click();
await page.waitForTimeout(250);
pruef('WEGSEHEN gibt die Welt zurueck', await page.evaluate(() => [state, el('overlay').style.display]), ['play', 'none']);
await page.evaluate(() => requisitAnsehen('kaisertuer'));
await page.waitForTimeout(350);
pruef('das zweite Ansehen zeigt den zweiten Zug', await page.evaluate(() => document.getElementById('ovPanel').textContent.includes('Man klopft nicht. Er ist im Termin.')), true);
await page.locator('#ovPanel button').click();
await page.waitForTimeout(250);

// --- Das Wandstueck steht im Raum und bietet Ansehen an ------------------------
const raum = await page.evaluate(() => {
  const o = innen.moebel.find(m => m.z === 'J');
  if(!o) return {da: false};
  // Davorstellen: eine Kachel unter dem Wandstueck, dann die Kontaktaktion abfragen.
  player.x = o.x; player.y = o.y + TS * 0.9; camSnap();
  scanAktion();
  return {da: true, breit: o.breit, requisit: o.requisit, akt: aktArt === AKT_REQUISIT, text: typeof aktText === 'string' ? aktText : null};
});
pruef('das Wandstueck steht im Raum, zwei Kacheln breit', [raum.da, raum.breit, raum.requisit], [true, 2, 'kaisertuer']);
pruef('davor steht Ansehen an', raum.akt, true);

const abzug = process.env.ABZUG;
if(abzug){ await page.screenshot({ path: abzug }); zeilen.push('Abzug: ' + abzug); }

pruef('Konsole still', laut, []);
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
await browser.close();
process.exit(fehl ? 1 : 0);
