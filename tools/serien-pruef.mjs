// Pruefprotokoll zu Bauabschnitt W11-GH (phase-w11-serien-g-h.md).
//
//   python3 serve.py &
//   node tools/serien-pruef.mjs [URL]
//
// blaetterAssert() im Spiel prueft die Tabelle: Sollzahlen, Biome, Formregeln,
// Sperrvermerk. Was es nicht pruefen kann, weil es Spielzuege sind oder weil
// MONDEF beim Guard noch in der TDZ liegt, steht hier:
//
//   die Truhe        eine Kammertruhe im Steinfeld gibt G her und nichts
//                    anderes, eine im Moorbruch H, eine im Grasland weiterhin
//                    B; ist eine Serie durch, faellt dort kein Blatt mehr
//   das Lager        eine Lagerwache gibt H her, ein anderes Monster nicht,
//                    und vor Akt II gibt auch die Wache nichts
//   das Mass         der Lagerwurf liegt bei 0,25 je Wache; gemessen ueber
//                    4000 Kills, nicht aus dem Code abgelesen
//   das Gatter       G ab Schicht 20, H ab Schicht 10, exakt an der Schwelle
//   die siebte Zeile steht erst, wenn alle sechs Schreiben da sind, genau
//                    einmal, direkt unter dem letzten, und zaehlt nicht mit
//   die Zaehlzeile   "N von 68"
//
// Der Lauf misst eine Zahl (den Lagerwurf) und stellt sonst fest: jede Zeile
// ist ein Soll-Ist-Vergleich, der Exit-Code ist 1, sobald eine nicht stimmt.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

const zeilen = [];
let fehl = 0;
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
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(62)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}
function pruefBereich(name, ist, von, bis){
  const ok = ist >= von && ist <= bis;
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(62)} ist=${ist} soll=${von}..${bis}`);
}

const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const laut = [];
page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', m => {
  if(m.type() !== 'error') return;
  if(m.text().includes('404')) return;
  laut.push('console: ' + m.text().slice(0, 200));
});

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 30000 });
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
await page.evaluate(() => { if(innen) verlasseHaus(); });
await page.waitForTimeout(250);
pruef('der Dienst laeuft', await page.evaluate(() => state), 'play');

// --- 1. Die Tabelle ---------------------------------------------------------
const tab = await page.evaluate(() => ({
  gesamt: BLAETTER_KEYS.length,
  g: BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'G').length,
  h: BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'H').length,
  gBiome: [...new Set(BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'G').map(id => BLAETTER[id].biome))],
  hBiome: [...new Set(BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'H').map(id => BLAETTER[id].biome))],
  aktG: SERIE_AKT.G, aktH: SERIE_AKT.H,
  guard: blaetterAssert(),
  hKopfGleich: BLAETTER_KEYS.filter(id => BLAETTER[id].serie === 'H')
    .every(id => BLAETTER[id].lines[1] === 'Wer räumt das Papier aus dem Fluss?' && BLAETTER[id].lines[2] === 'Um Nachricht wird gebeten.'),
  h6Zusatz: BLAETTER.h6.lines[3],
  lagerwachen: Object.keys(MONDEF).filter(k => MONDEF[k].lagerwache),
}));
pruef('Bestand: 68 Blaetter', tab.gesamt, 68);
pruef('Serie G: acht Blaetter', tab.g, 8);
pruef('Serie H: sechs Blaetter', tab.h, 6);
pruef('Serie G liegt im Steinfeld (ruine)', tab.gBiome, ['ruine']);
pruef('Serie H liegt im Moorbruch (sumpf)', tab.hBiome, ['sumpf']);
pruef('Aktgatter G = Akt III', tab.aktG, 3);
pruef('Aktgatter H = Akt II', tab.aktH, 2);
pruef('blaetterAssert() ist still und wahr', tab.guard, true);
pruef('H: sechsmal derselbe Wortlaut in Zeile 2 und 3', tab.hKopfGleich, true);
pruef('H6 traegt die vierte Zeile', tab.h6Zusatz, 'Darunter, andere Feder, sehr fest aufgedrückt: Es ist eine kurze Frage.');
pruef('drei Lagerwachen im Katalog', tab.lagerwachen.length, 3);

// --- 2. Das Gatter ----------------------------------------------------------
const gatter = await page.evaluate(() => {
  const alt = {modus: CONFIG.schichtModus, s: amt.schichten};
  CONFIG.schichtModus = true;
  const r = {};
  for(const s of [9, 10, 19, 20]){ amt.schichten = s; r['G' + s] = serieFrei('G'); r['H' + s] = serieFrei('H'); }
  CONFIG.schichtModus = false; amt.schichten = 0;
  r.freiG = serieFrei('G'); r.freiH = serieFrei('H');
  CONFIG.schichtModus = alt.modus; amt.schichten = alt.s;
  return r;
});
pruef('H gesperrt bei Schicht 9', gatter.H9, false);
pruef('H frei ab Schicht 10', gatter.H10, true);
pruef('G gesperrt bei Schicht 19', gatter.G19, false);
pruef('G frei ab Schicht 20', gatter.G20, true);
pruef('schichtModus=false haelt G und H offen', [gatter.freiG, gatter.freiH], [true, true]);

// --- 3. Die Truhe -----------------------------------------------------------
// Eine Kammer wird nachgestellt, nicht betreten: truheOeffnen() liest kammer
// und sonst nichts vom Ort. Math.random auf 0 festgenagelt heisst: der
// Aktenfund-Wurf trifft, und der erste Kandidat faellt. Was faellt, sagt der
// Filter -- und genau der ist hier die Frage.
const truhe = await page.evaluate(() => {
  const alt = {modus: CONFIG.schichtModus, s: amt.schichten, k: kammer, rnd: Math.random, bl: kladde.blaetter};
  CONFIG.schichtModus = true; amt.schichten = 25;   // Akt III: A, B, C, D, G, H frei
  Math.random = () => 0;
  const lauf = biome => {
    kladde.blaetter = {};
    const ids = [];
    for(let i = 0; i < 10; i++){
      kammer = {truhe:{auf:false, x:player.x, y:player.y}, ebene:0, diff:1, tier:0, biome, geleert:false, tuer:{cd:0}};
      const vorher = Object.keys(kladde.blaetter).length;
      truheOeffnen();
      const jetzt = Object.keys(kladde.blaetter);
      ids.push(jetzt.length > vorher ? jetzt[jetzt.length - 1] : null);
    }
    return ids;
  };
  const r = {ruine: lauf('ruine'), sumpf: lauf('sumpf'), grass: lauf('grass')};
  Math.random = alt.rnd; kammer = alt.k; kladde.blaetter = alt.bl;
  CONFIG.schichtModus = alt.modus; amt.schichten = alt.s;
  saveKladde();
  return r;
});
const serien = ids => ids.map(id => id ? BLAETTER_SERIE(id) : null);
const BLAETTER_SERIE = id => id[0].toUpperCase();
pruef('Steinfeld-Truhe (diff 1): acht Funde, alle G, dann nichts', serien(truhe.ruine), ['G','G','G','G','G','G','G','G',null,null]);
pruef('Moorbruch-Truhe: sechs Funde, alle H, dann nichts', serien(truhe.sumpf), ['H','H','H','H','H','H',null,null,null,null]);
pruef('Grasland-Truhe gibt weiterhin B', serien(truhe.grass).slice(0, 6), ['B','B','B','B','B','B']);
pruef('Steinfeld-Funde sind g1 bis g8', truhe.ruine.slice(0, 8), ['g1','g2','g3','g4','g5','g6','g7','g8']);

// --- 4. Das Lager -----------------------------------------------------------
const lager = await page.evaluate(() => {
  const alt = {modus: CONFIG.schichtModus, s: amt.schichten, rnd: Math.random, bl: kladde.blaetter, lvl: currentLevel};
  CONFIG.schichtModus = true; currentLevel = 1;
  const toeten = typ => { const m = makeMon(typ, player.x + 80, player.y); killMon(m); };
  const fund = () => Object.keys(kladde.blaetter).filter(id => BLAETTER[id].serie === 'H').length;
  const r = {};
  Math.random = () => 0;
  // Akt I: die Wache gibt nichts, auch bei sicherem Wurf.
  amt.schichten = 5; kladde.blaetter = {}; toeten('vorbehalt'); r.aktI = fund();
  // Akt II: sie gibt genau eines je Kill, bis die Serie durch ist.
  amt.schichten = 11; kladde.blaetter = {};
  const je = [];
  for(let i = 0; i < 8; i++){ toeten('zwischennachricht'); je.push(fund()); }
  r.aktII = je;
  r.nurH = Object.keys(kladde.blaetter).every(id => BLAETTER[id].serie === 'H');
  // Kein Lagerwache-Monster: nichts, auch bei sicherem Wurf.
  kladde.blaetter = {}; toeten('goblin'); r.goblin = fund();
  // Das Mass: echter Zufall, 4000 Kills, jedes Mal frischer Bestand.
  Math.random = alt.rnd;
  let treffer = 0; const N = 4000;
  for(let i = 0; i < N; i++){ kladde.blaetter = {}; toeten('vorbehalt'); treffer += fund(); }
  r.rate = treffer / N;
  // Aufraeumen: der Kill-Lauf hat Leichen, Beute und Konfetti hinterlassen.
  corpses.length = 0; drops.length = 0;
  kladde.blaetter = alt.bl; CONFIG.schichtModus = alt.modus; amt.schichten = alt.s; currentLevel = alt.lvl;
  saveKladde();
  return r;
});
pruef('Lagerwache vor Akt II gibt nichts', lager.aktI, 0);
pruef('Lagerwache ab Akt II: je Kill ein Blatt, bis sechs', lager.aktII, [1,2,3,4,5,6,6,6]);
pruef('aus dem Lager faellt nur H', lager.nurH, true);
pruef('ein Goblin gibt kein H', lager.goblin, 0);
pruefBereich('Lagerwurf gemessen (4000 Kills, Soll 0,25)', +lager.rate.toFixed(4), 0.22, 0.28);

// --- 5. Die siebte Zeile ----------------------------------------------------
const reiter = await page.evaluate(() => {
  const alt = {bl: kladde.blaetter};
  const lesen = () => {
    renderBlaetter();
    const box = document.getElementById('blaetterBox');
    const w = box.querySelectorAll('.akWertung');
    const zahl = (box.textContent.match(/(\d+) von (\d+) Blättern gefunden/) || []).slice(1).map(Number);
    return {wertungen: w.length, text: w.length ? w[0].textContent : null,
            vorher: w.length ? w[0].previousElementSibling.textContent : null, zahl, ak: box.querySelectorAll('.ak').length};
  };
  const r = {};
  kladde.blaetter = {}; r.leer = lesen();
  kladde.blaetter = {h6: true}; r.nurH6 = lesen();
  kladde.blaetter = {h1:true, h2:true, h3:true, h4:true, h5:true}; r.fuenf = lesen();
  kladde.blaetter = {h1:true, h2:true, h3:true, h4:true, h5:true, h6:true}; r.sechs = lesen();
  kladde.blaetter = {a1:true, h1:true, h2:true, h3:true, h4:true, h5:true, h6:true, i1:true}; r.gemischt = lesen();
  kladde.blaetter = alt.bl; renderBlaetter();
  return r;
});
pruef('leerer Reiter: keine Wertung', reiter.leer.wertungen, 0);
pruef('nur h6: keine Wertung', reiter.nurH6.wertungen, 0);
pruef('fuenf Schreiben: keine Wertung', reiter.fuenf.wertungen, 0);
pruef('sechs Schreiben: genau eine Wertung', reiter.sechs.wertungen, 1);
pruef('Wortlaut der siebten Zeile', reiter.sechs.text, 'Kein Eingangsstempel fehlt. Kein Ausgang ist vermerkt.');
pruef('sie steht direkt unter Blatt 6', reiter.sechs.vorher, 'Serie H, Blatt 6');
pruef('sie zaehlt nicht mit: Zaehlzeile 6 von 68', reiter.sechs.zahl, [6, 68]);
pruef('gemischt: Wertung unter dem letzten H, nicht am Ende', reiter.gemischt.vorher, 'Serie H, Blatt 6');
pruef('gemischt: acht Blaetter, eine Wertung', [reiter.gemischt.ak, reiter.gemischt.wertungen], [8, 1]);

pruef('Konsole still', laut, []);

fertig = true;
await browser.close();
process.exit(fehl ? 1 : 0);
