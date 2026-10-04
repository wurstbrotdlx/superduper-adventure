// Pruefprotokoll zu Bauabschnitt HO1 (phase-ho1-hochablage.md): Hochablage als
// Ort, nach dem Schluss.
//
//   python3 serve.py &
//   ABZUG=ordner node tools/hochablage-pruef.mjs [URL]
//
// innenAssert() prueft den Grundriss von Turm I wie jeden Raum. Was sich erst
// im Spielen zeigt, steht hier:
//
//   die Strasse      vor dem Schluss steht keine Kutsche, niemand bietet
//                    "Nach Hochablage" an, und der Erzhalter steht nirgends
//   die Kutsche      nach dem Schluss steht sie nordoestlich des Amtes, oberhalb
//                    des Marktes, auf einem freien Dreierfeld, bietet die Fahrt
//                    an, und die Fahrt ist ein Blatt (MITFAHREN) und dann der Raum
//   der Raum         Turm I: die Tuer mit dem Schild, das Fenster, der
//                    Wasserspender, zwei Baenke; der Erzhalter steht am Fenster
//                    und ist ansprechbar; die drei Dinge lassen sich ansehen
//   der Rueckweg     Hinausgehen stellt den Spieler vor die Kutsche, die
//                    Oberwelt ist wieder da, der Erzhalter nicht
//   der Kanon        der Kaiser nur im Praesens, nur als Schild; kein Wort aus
//                    der Akte (die Sperre prueft szeneAssert, hier die
//                    Gegenprobe am gerenderten Text)
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
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(64)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}
const abzug = process.env.ABZUG;
async function bild(name){ if(abzug){ await page.screenshot({ path: `${abzug}/${name}.png` }); zeilen.push('Abzug: ' + name); } }

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });

// --- Tabellen ----------------------------------------------------------------
const tab = await page.evaluate(() => {
  const r = INN_RAEUME.hochablage, fig = DORF_FIGUREN.find(f => f.key === 'randbemerkung');
  const texte = ['kabinett','wasserspender','turmfenster'].map(k => REQUISITEN[k]).concat([KUTSCHE_BLATT])
    .map(b => [b.blatt, ...b.stimme, b.regie || ''].join(' ')).join(' ');
  return {
    raum: !!r, breite: r.w, hoehe: r.h, rechteckig: r.plan.every(z => z.length === r.w),
    zeichen: ['I','1','M','B','N','F'].map(z => r.plan.join('').includes(z)),
    leute: r.leute.map(p => p.key), fern: INN_FERN.map(h => h.b.innen),
    requisiten: ['kabinett','wasserspender','turmfenster'].map(k => !!REQUISITEN[k]),
    fig: !!fig, nurInnen: !!(fig && fig.nurInnen), abAkt: fig && fig.abAkt, grund: fig && fig.grund.length,
    innenHaus: fig && fig.innenHaus, anrede: !!ANREDE.randbemerkung,
    kaiserVergangenheit: /\bwar im Termin|Kaiser.*(starb|tot|gestorben)/i.test(texte),
    schild: texte.includes('IM TERMIN'),
    sperre: AKTE_SPERRE_NAMEN.filter(w => texte.includes(w)),
    kutscheDa: KUTSCHE.da,
  };
});
pruef('den Raum gibt es, rechteckig', [tab.raum, tab.rechteckig], [true, true]);
pruef('Tuer, Fenster, Wasserspender, Bank, Fenster, Fackel im Grundriss', tab.zeichen, [true, true, true, true, true, true]);
pruef('der Erzhalter wohnt in Turm I', [tab.leute, tab.innenHaus], [['randbemerkung'], 'hochablage']);
pruef('die Kutsche ist der ferne Eingang', tab.fern, ['hochablage']);
pruef('drei Requisiten in Turm I', tab.requisiten, [true, true, true]);
pruef('der Erzhalter: Figur ab Akt V, nur drinnen, sechs Grundzeilen, mit Anrede', [tab.fig, tab.abAkt, tab.nurInnen, tab.grund, tab.anrede], [true, 5, true, 6, true]);
pruef('der Kaiser kommt nur im Praesens vor, als Schild', [tab.kaiserVergangenheit, tab.schild], [false, true]);
pruef('kein gesperrter Name in den Texten', tab.sperre, []);
pruef('die Kutsche hat auf dieser Karte einen Platz', tab.kutscheDa, true);

// --- Ins Spiel ----------------------------------------------------------------
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
pruef('der Dienst laeuft, draussen', await page.evaluate(() => [state, !!innen, currentLevel]), ['play', false, 1]);

// --- Vor dem Schluss ----------------------------------------------------------
const vorher = await page.evaluate(() => {
  CONFIG.schichtModus = true; amt.vorgangGeschlossen = 0; amt.schichten = 45;
  player.x = KUTSCHE.x; player.y = KUTSCHE.y + TS; camSnap(); scanAktion();
  const fig = DORF_FIGUREN.find(f => f.key === 'randbemerkung');
  return {da: kutscheDa(), angebot: aktArt === AKT_KUTSCHE, erzhalter: figHier(fig), gezeichnet: npcs.some(n => n.key === 'randbemerkung' && figHier(n.figur))};
});
pruef('vor dem Schluss: keine Kutsche, kein Angebot', [vorher.da, vorher.angebot], [false, false]);
pruef('vor dem Schluss: der Erzhalter steht nirgends', [vorher.erzhalter, vorher.gezeichnet], [false, false]);

// --- Nach dem Schluss ---------------------------------------------------------
const nachher = await page.evaluate(() => {
  amt.vorgangGeschlossen = 44;
  const fig = DORF_FIGUREN.find(f => f.key === 'randbemerkung');
  scanAktion();
  return {da: kutscheDa(), angebot: aktArt === AKT_KUTSCHE, text: aktTxt, draussen: figHier(fig),
          noerdlich: KUTSCHE.ty <= DORF_DY + 28 && KUTSCHE.tx >= DORF_DX + 21, frei: [[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]].every(([dx,dy]) => reachbar(KUTSCHE.tx+dx, KUTSCHE.ty+dy))};
});
pruef('nach dem Schluss: die Kutsche steht und bietet die Fahrt an', [nachher.da, nachher.angebot, nachher.text], [true, true, 'Nach Hochablage']);
pruef('sie steht nordoestlich des Amtes, frei vom Giebel, auf einem freien Dreierfeld', [nachher.noerdlich, nachher.frei], [true, true]);
pruef('der Erzhalter steht trotzdem nicht im Dorf', nachher.draussen, false);
await bild('kutsche');

await page.evaluate(() => kutscheFahren());
await page.waitForTimeout(350);
const blatt = await page.evaluate(() => ({
  state, fuss: (document.querySelector('#ovPanel .amtFuss') || {}).textContent,
  knoepfe: [...document.querySelectorAll('#ovPanel button')].map(b => b.textContent.trim()),
  text: document.getElementById('ovPanel').textContent,
}));
pruef('die Fahrt ist ein Blatt, die Welt steht', [blatt.state, blatt.fuss, blatt.knoepfe], ['szene', 'Blatt I von I', ['MITFAHREN']]);
pruef('das Blatt sagt, warum die Strasse frei ist', blatt.text.includes('zur Klärung zurückgestellt') && blatt.text.includes('Der Kutscher sagt nichts.'), true);
await page.locator('#ovPanel button').click();
await page.waitForTimeout(400);
const raum = await page.evaluate(() => ({
  innen: innen && innen.key, state, level: currentLevel, name: innen && innen.raum.name,
  moebel: innen ? [...new Set(innen.moebel.map(m => m.z))].sort() : [],
  leute: npcs.map(n => n.key), erzhalterHier: npcs.some(n => n.key === 'randbemerkung' && figHier(n.figur)),
  ausgang: !!(innen && innen.tuer),
}));
pruef('MITFAHREN fuehrt nach Turm I', [raum.innen, raum.state, raum.level, raum.name], ['hochablage', 'play', 4, 'Hochablage, Turm I']);
pruef('die Dinge stehen im Raum', raum.moebel, ['1', 'B', 'F', 'I', 'M', 'N']);
pruef('der Erzhalter steht drinnen und ist da', [raum.leute, raum.erzhalterHier], [['randbemerkung'], true]);
await page.evaluate(() => { for(let i = 0; i < 20; i++) update(1/60); });
await bild('turm');

// Ansprechen und Ansehen.
const ansprechen = await page.evaluate(() => {
  const n = npcs.find(n => n.key === 'randbemerkung');
  player.x = n.x; player.y = n.y + 28; scanAktion();
  return {art: aktArt === AKT_NPC, txt: aktTxt};
});
pruef('vor dem Erzhalter steht Ansprechen an', [ansprechen.art, ansprechen.txt], [true, 'Ansprechen']);
const ansehen = await page.evaluate(() => {
  const o = innen.moebel.find(m => m.z === 'M');
  player.x = o.x; player.y = o.y + TS * 0.9; scanAktion();
  const angebot = aktArt === AKT_REQUISIT && aktObj && aktObj.requisit === 'wasserspender';
  requisitAnsehen('wasserspender');
  return angebot;
});
await page.waitForTimeout(350);
pruef('am Wasserspender steht Ansehen an', ansehen, true);
pruef('und das Blatt sagt, dass niemand mehr wartet', await page.evaluate(() => document.getElementById('ovPanel').textContent.includes('Es wartet niemand mehr.')), true);
await page.locator('#ovPanel button').click();
await page.waitForTimeout(250);
pruef('WEGSEHEN gibt den Raum zurueck', await page.evaluate(() => [state, innen && innen.key]), ['play', 'hochablage']);

// --- Zurueck ------------------------------------------------------------------
const zurueck = await page.evaluate(() => {
  const vorher = {trees: trees.length, npcs: innenSave.npcs.length};
  verlasseHaus();
  const fig = DORF_FIGUREN.find(f => f.key === 'randbemerkung');
  return {innen: !!innen, level: currentLevel, vorKutsche: Math.abs(player.x - KUTSCHE.x) < 2 && player.y > KUTSCHE.y,
          npcs: npcs.length === vorher.npcs, erzhalter: figHier(fig), wegDa: kutscheDa()};
});
pruef('Hinausgehen stellt den Spieler vor die Kutsche', [zurueck.innen, zurueck.level, zurueck.vorKutsche], [false, 1, true]);
pruef('die Oberwelt ist wieder da, der Erzhalter nicht', [zurueck.npcs, zurueck.erzhalter], [true, false]);
pruef('die Kutsche steht weiter da', zurueck.wegDa, true);

// --- Inertheit ----------------------------------------------------------------
pruef('schichtModus=false: keine Kutsche', await page.evaluate(() => { CONFIG.schichtModus = false; const d = kutscheDa(); CONFIG.schichtModus = true; return d; }), false);

pruef('Konsole still', laut, []);
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
await browser.close();
process.exit(fehl ? 1 : 0);
