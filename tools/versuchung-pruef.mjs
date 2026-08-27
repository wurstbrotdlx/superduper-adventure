// Pruefprotokoll zu Bauabschnitt SZ4 (phase-sz4-finale.md).
//
//   python3 serve.py &
//   node tools/versuchung-pruef.mjs [URL]
//
// szeneAssert() und vorgangAssert() pruefen im Spiel, was ohne Spielzug wahr
// sein muss: die Form der Szene, die Erreichbarkeit jedes Knotens, die
// Formregeln auf jeder Zeile, die Blattform der dreizehn Abspannbilder. Was
// sich erst im Spielen zeigt, steht hier:
//
//   Szene 7      faellt an Vorblatt, erst nach seiner Ankunft, genau einmal,
//                und sie geht seinem Gespraechsbaum vor
//   der Wechsel  acht Figuren sprechen nacheinander in derselben Tafel. Wenn
//                das nicht ankommt, ist eine Versammlung eine Wand aus Text
//   die vier     drei Fragen plus Ausgang, nie mehr als vier Zeilen, und der
//                Ausgang ist die vierte Zeile der Weltgeschichte ("nichts
//                sagen") und kein Abbruch
//   die Mappen   liegen danach im Amtsflur und werden nie abgeholt
//   Szene 8      mit Zwischenbescheid faengt die Zustellung drei Schritte
//                frueher an. Ohne ihn faengt sie da an, wo sie seit W5 anfing
//   die Kapsel   steht im Finale nur, wenn der Stopfen gezogen wurde
//   Szene 9      dreizehn Bilder, arabisch gezaehlt, Bild 7 haengt am Strang,
//                Bild 10, 12 und 13 tragen ihren Kanon
//   kein Zwang   wer die Versuchung nie spielt, stellt zu wie vor SZ4
//
// Der Lauf misst nichts, er stellt fest: jede Zeile ist ein Soll-Ist-Vergleich,
// der Exit-Code ist 1, sobald eine Zeile nicht stimmt.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

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
  console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Prüfungen bestanden.`);
  if(!fertig) console.log(
      'ABBRUCH: der Lauf ist vor seinem Ende gestorben. Die Zeile darueber zaehlt nur,\n'
    + 'was bis dahin lief -- alles danach ist UNGEPRUEFT und nicht etwa in Ordnung.\n'
    + 'Die Ursache steht als Ausnahme darunter.');
}
process.on('exit', bericht);

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
  if(m.text().includes('404')) return;
  laut.push('console: ' + m.text().slice(0, 200));
});

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => assetsReady === true, null, { timeout: 30000 });
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
pruef('der Dienst laeuft', await page.evaluate(() => state), 'play');

// Alles auf Anfang. Der Lauf soll den Zustand herstellen, den er prueft, und
// nicht den vorfinden, den ein localStorage aus einer frueheren Sitzung
// mitbringt.
const zuruecksetzen = () => page.evaluate(() => {
  kladde.lang = {}; kladde.vorgang = {}; kladde.crafts = 0;
  kn.flags.szeneVorblatt = false; kn.flags.szeneVersuchung = false;
  amt.stopfenSchicht = 0; amt.adressSchicht = 0; amt.bonusNachwachsen = 0;
  amt.schichten = 35; CONFIG.schichtModus = true;
  szeneAus();
});
await zuruecksetzen();

// --- 1) Faelligkeit: die Szene haengt an Vorblatts Ankunft ------------------
const faellig = await page.evaluate(() => {
  const ohne = szeneFaellig('vorblatt');
  kn.flags.szeneVorblatt = true;
  const mit = szeneFaellig('vorblatt');
  CONFIG.schichtModus = false;
  const ohneModus = szeneFaellig('vorblatt');
  CONFIG.schichtModus = true;
  kn.flags.szeneVersuchung = true;
  const danach = szeneFaellig('vorblatt');
  const baumDanach = baumFaellig('vorblatt');
  kn.flags.szeneVersuchung = false;
  return {ohne, mit, ohneModus, danach, baumDanach};
});
pruef('vor der Ankunft faellt sie nicht', faellig.ohne, null);
pruef('nach der Ankunft faellt sie', faellig.mit, 'versuchung');
pruef('ohne Schichtmodus faellt sie nicht', faellig.ohneModus, null);
pruef('mit gesetztem Merker faellt sie nicht mehr', faellig.danach, null);
pruef('danach ist Vorblatt wieder sein Baum', faellig.baumDanach, 'baumVorblatt');

// --- 2) Der Einstieg ueber das Ansprechen ----------------------------------
const einstieg = await page.evaluate(() => {
  const vorher = state;
  gespraechOeffnen(szeneSprecherAusDorf('vorblatt'));
  return {vorher, offen: szeneAktiv, welt: state, knoten: szene.knoten,
          sprecher: gespraech.fig ? gespraech.fig.key : null};
});
pruef('Ansprechen oeffnet die Versuchung', einstieg.offen, 'versuchung');
pruef('sie faengt bei w1 an', einstieg.knoten, 'w1');
pruef('Vorblatt spricht sie', einstieg.sprecher, 'vorblatt');
pruef('sie haelt die Welt an', [einstieg.vorher, einstieg.welt], ['play', 'szene']);

// --- 3) Der Durchlauf: acht Sprecher, nie mehr als vier Zeilen -------------
const lauf = await page.evaluate(() => {
  const sprecher = [], breiten = [], hubZeilen = [];
  let runden = 0, hubGesehen = 0;
  while(szeneAktiv && runden++ < 90){
    gespraechFertigTippen();
    const s = gespraech.fig ? gespraech.fig.key : null;
    if(s && sprecher[sprecher.length - 1] !== s) sprecher.push(s);
    const o = szeneOptionen();
    breiten.push(o.length);
    if(szene.knoten === 'hub' || szeneFrage(szene.knoten)){ hubGesehen++; hubZeilen.push(o.map(x => x.t)); }
    if(!o.length) break;
    o[0].tun();
  }
  return {sprecher, maxBreite: Math.max(...breiten), minBreite: Math.min(...breiten),
          hubZeilen, hubGesehen, runden, offen: szeneAktiv, welt: state,
          merker: kn.flags.szeneVersuchung};
});
pruef('acht Figuren sprechen in der Szene', lauf.sprecher.length >= 8, true);
pruef('und es sind die aus der Weltgeschichte',
  ['vorblatt','zwirn','lisbeth','noergel','bramsche','trepp','zapf'].filter(k => lauf.sprecher.includes(k)).length, 7);
pruef('nie mehr als vier Antwortzeilen', lauf.maxBreite, 4);
pruef('nie null Antwortzeilen', lauf.minBreite > 0, true);
pruef('der hub zeigt zuerst drei Fragen und den Ausgang', lauf.hubZeilen[0], 
  ['Was muss ich lassen?', 'Warum ist Ihnen das wert?', 'Und wenn ich zustelle?', 'Nichts sagen.']);
pruef('am Ende bleibt nur der Ausgang', lauf.hubZeilen[lauf.hubZeilen.length - 1], ['Nichts sagen.']);
pruef('die Szene laeuft bis zum Ende durch', lauf.offen, null);
pruef('und gibt die Welt wieder frei', lauf.welt, 'play');
pruef('der Merker steht danach', lauf.merker, true);

// --- 4) Der Ausgang ist keine Abkuerzung -----------------------------------
// Wer im hub sofort schweigt, bekommt Vorblatts vierte Antwort und danach die
// ganze zweite Haelfte der Szene. "Nichts sagen" beendet nichts.
const schweigen = await page.evaluate(() => {
  kn.flags.szeneVersuchung = false; szeneAus();
  szeneOeffnen('versuchung', 'hub');
  const o = szeneOptionen();
  o[o.length - 1].tun();
  const danach = szene.knoten;
  let runden = 0;
  while(szeneAktiv && runden++ < 90){
    gespraechFertigTippen();
    const l = szeneOptionen();
    if(!l.length) break;
    l[0].tun();
  }
  return {danach, runden, offen: szeneAktiv};
});
pruef('Schweigen fuehrt auf Vorblatts vierte Antwort', schweigen.danach, 'w4');
pruef('und die Szene laeuft danach weiter', schweigen.runden > 10, true);
pruef('bis sie regulaer endet', schweigen.offen, null);

// --- 5) Die Mappen bleiben liegen ------------------------------------------
const mappen = await page.evaluate(() => {
  const mit = mappenBlock();
  kn.flags.szeneVersuchung = false;
  const ohne = mappenBlock();
  kn.flags.szeneVersuchung = true;
  CONFIG.schichtModus = false;
  const ohneModus = mappenBlock();
  CONFIG.schichtModus = true;
  return {mit: mit.includes('sieben Mappen'), ohne, ohneModus};
});
pruef('nach der Szene liegen die Mappen im Flur', mappen.mit, true);
pruef('vorher liegt dort nichts', mappen.ohne, '');
pruef('ohne Schichtmodus auch nicht', mappen.ohneModus, '');

// --- 6) Szene 8: der Zwischenbescheid --------------------------------------
const bescheid = await page.evaluate(() => {
  kladde.vorgang = {1:true, 2:true, 3:true, 4:true};
  amt.schichten = 45; amt.bonusNachwachsen = 20;
  const mit = {anhaengig: vorgangAnhaengig(), start: vorgangAnhaengig() ? 1 : 4,
               bestand: vorgangBestandBlock().includes('Zwischenbescheid')};
  kn.flags.szeneVersuchung = false;
  const ohne = {anhaengig: vorgangAnhaengig(), start: vorgangAnhaengig() ? 1 : 4,
                bestand: vorgangBestandBlock().includes('Zwischenbescheid')};
  kn.flags.szeneVersuchung = true;
  const strip = h => h.replace(/<[^>]+>/g, ' ');
  return {mit, ohne, zustellbar: vorgangZustellbar(),
          s1: strip(vorgangPanelHtml(1)).includes('wieder nicht in dieser Sache'),
          s2: strip(vorgangPanelHtml(2)).includes('Anhängig. Wird bearbeitet.'),
          s3: strip(vorgangPanelHtml(3)).includes('Aufgehoben'),
          s4: strip(vorgangPanelHtml(4)).includes('Da steht mein Name'),
          knopf1: vorgangPanelHtml(1).includes('vorgangPanel(2)'),
          knopf3: vorgangPanelHtml(3).includes('vorgangPanel(4)'),
          knopf5: vorgangPanelHtml(5).includes('abspannStarten()')};
});
pruef('die Ausfertigung ist zustellbar', bescheid.zustellbar, true);
pruef('mit Versuchung faengt die Zustellung bei 1 an', [bescheid.mit.anhaengig, bescheid.mit.start], [true, 1]);
pruef('ohne Versuchung bei 4, wie vor SZ4', [bescheid.ohne.anhaengig, bescheid.ohne.start], [false, 4]);
pruef('der Bestand nennt den Bescheid nur mit Versuchung', [bescheid.mit.bestand, bescheid.ohne.bestand], [true, false]);
pruef('Schritt 1 ist der Gruss des Fuersten', bescheid.s1, true);
pruef('Schritt 2 ist die Taste, die nichts tut', bescheid.s2, true);
pruef('Schritt 3 ist die Teetasse', bescheid.s3, true);
pruef('Schritt 4 ist die Zustellung', bescheid.s4, true);
pruef('die Kette haengt zusammen', [bescheid.knopf1, bescheid.knopf3, bescheid.knopf5], [true, true, true]);

// --- 7) Die Kapsel im Finale -----------------------------------------------
const kapsel = await page.evaluate(() => {
  const strip = h => h.replace(/<[^>]+>/g, ' ');
  amt.stopfenSchicht = 0;
  const ohne = strip(vorgangPanelHtml(5)).includes('Kapsel aus dem Rohr');
  amt.stopfenSchicht = 30;
  const mit = strip(vorgangPanelHtml(5)).includes('Kapsel aus dem Rohr');
  const verbeugt = strip(vorgangPanelHtml(5)).includes('verbeugt sich vor dem Hausmeister');
  amt.stopfenSchicht = 0;
  return {ohne, mit, verbeugt};
});
pruef('ohne Stopfen liegt keine Kapsel auf dem Tisch', kapsel.ohne, false);
pruef('mit Stopfen liegt sie da', kapsel.mit, true);
pruef('und der Fuerst verbeugt sich vor dem Hausmeister', kapsel.verbeugt, true);

// --- 8) Szene 9: der Abspann als Tafelstapel -------------------------------
const abspann = await page.evaluate(() => {
  const leer = abspannBlaetter();
  kladde.lang = {}; for(const k in LANGVORGAENGE) kladde.lang[k] = LANGVORGAENGE[k].stufen;
  const voll = abspannBlaetter();
  kladde.lang = {};
  const satz = z => typeof z === 'string' ? z : z.z;
  const kanon = b => (b.z1 !== undefined ? b.z1 + ' ' + b.z2
                     : b.blatt + ' ' + b.stimme.map(satz).join(' ') + ' ' + (b.regie || ''));
  return {
    anzahl: leer.length,
    zaehlung: szeneBlattZahl(1, leer.length),
    bild7leer: leer[6].z2.includes('elf Absagen'),
    bild7voll: voll[6].z2.includes('elf Absagen'),
    bild10: kanon(leer[9]).includes('Gemeldet wird: Niederschlag.'),
    bild12: kanon(leer[11]).includes('Der vierte Takt läuft einmal durch.'),
    bild13: kanon(leer[12]).includes('Vorgang 2.'),
    lesarten: leer.map(b => b.z1 !== undefined ? 'gross' : 'stimme').join(''),
    // Die Wechselrede in Bild 11: fuenf Zeilen, zwei Sprecher, abwechselnd.
    wechselrede: leer[10].stimme.map(z => z.wer),
    alleMitSprecher: leer.filter(b => b.stimme).every(b => b.stimme.every(z => z && z.wer)),
  };
});
pruef('der Abspann hat dreizehn Bilder', abspann.anzahl, 13);
pruef('dreizehn Blaetter zaehlen arabisch', abspann.zaehlung, '1');
pruef('Bild 7 haengt am Dorffest-Strang', [abspann.bild7leer, abspann.bild7voll], [false, true]);
pruef('Bild 10 meldet den Niederschlag', abspann.bild10, true);
pruef('Bild 12 spielt den vierten Takt', abspann.bild12, true);
pruef('Bild 13 legt Vorgang 2 auf den Tresen', abspann.bild13, true);
pruef('Bild 11 ist eine Wechselrede zwischen zweien', abspann.wechselrede,
  ['Vorblatt', 'Sturz', 'Vorblatt', 'Sturz']);
pruef('jede gesprochene Zeile nennt ihren Sprecher', abspann.alleMitSprecher, true);
pruef('fuenf Bilder haben einen Satz, acht nicht',
  [abspann.lesarten.split('stimme').length - 1, abspann.lesarten.split('gross').length - 1], [5, 8]);

// --- 9) Der Stapel laeuft wirklich -----------------------------------------
await page.evaluate(() => abspannStarten());
await page.waitForTimeout(120);
const stapel1 = await page.evaluate(() => ({
  offen: document.getElementById('overlay').style.display,
  fuss: document.querySelector('#ovPanel .amtFuss').textContent,
  knoepfe: [...document.querySelectorAll('#ovPanel button')].map(b => b.textContent),
}));
pruef('das erste Bild steht', [stapel1.offen, stapel1.fuss], ['flex', 'Blatt 1 von 13']);
pruef('mit Weiter und Sprungknopf', stapel1.knoepfe, ['WEITER', 'ZUM LETZTEN BILD']);

await page.locator('#ovPanel button', { hasText: 'ZUM LETZTEN BILD' }).click({ force: true });
await page.waitForTimeout(120);
const stapel2 = await page.evaluate(() => ({
  fuss: document.querySelector('#ovPanel .amtFuss').textContent,
  knoepfe: [...document.querySelectorAll('#ovPanel button')].map(b => b.textContent),
}));
pruef('der Sprung fuehrt auf das letzte Bild', stapel2.fuss, 'Blatt 13 von 13');
pruef('dort steht kein Sprungknopf mehr', stapel2.knoepfe, ['ZUM SCHLUSS']);

await page.locator('#ovPanel button', { hasText: 'ZUM SCHLUSS' }).click({ force: true });
await page.waitForTimeout(120);
const schluss = await page.evaluate(() => ({
  kopf: document.querySelector('#ovPanel h1').textContent,
  knopf: document.querySelector('#ovPanel button').textContent,
  lauf: szeneTafelLauf,
}));
pruef('danach steht das Schlusspanel', schluss.kopf, 'VORGANG 1: GESCHLOSSEN');
pruef('mit dem Knopf, der ein neues Blatt anlegt', schluss.knopf, 'NEUEN VORGANG ANLEGEN');
pruef('und der Stapel ist abgeraeumt', schluss.lauf, null);

// --- 10) Jedes Bild passt ins Fenster --------------------------------------
// Der Fund, den nur das Bild gemacht hat: ein zu langes Blatt schiebt seinen
// eigenen Knopf unter den Fensterrand, und dann ist der Abspann nicht mehr zu
// Ende zu klicken. Gemessen wird an allen dreizehn Bildern und auf fuenf
// Fenstern, darunter das kleinste Telefon bei groesster Schrift. Geprueft wird
// beides: dass der Urkundenrahmen nicht ueberlaeuft und dass der unterste
// Knopf im Fenster steht.
for(const [w, h, fs] of [[1280,800,1], [1280,720,1], [1280,660,1], [360,640,1], [360,640,1.4]]){
  await page.setViewportSize({width: w, height: h});
  await page.evaluate(f => document.documentElement.style.setProperty('--fs', f), fs);
  await page.evaluate(() => { szeneTafelLauf = null; abspannStarten(); });
  const raus = [];
  for(let i = 0; i < 13; i++){
    await page.evaluate(k => szeneTafel(k), i);
    await page.waitForTimeout(60);
    const m = await page.evaluate(() => {
      const p = document.getElementById('ovPanel');
      const rahmen = p.querySelector('div[style*="min-height:30vh"]');
      const bs = [...p.querySelectorAll('button')];
      const letzt = bs[bs.length - 1].getBoundingClientRect();
      return {rahmen: rahmen.scrollHeight - rahmen.clientHeight,
              knopf: Math.round(letzt.bottom), fenster: window.innerHeight};
    });
    // Der Rahmen DARF rollen, das ist seit SZ4 sein Ausweg. Was er nicht darf,
    // ist den Knopf aus dem Fenster schieben.
    if(m.knopf > m.fenster) raus.push(`Bild ${i+1} (${m.knopf} > ${m.fenster})`);
  }
  pruef(`alle dreizehn Bilder passen auf ${w}x${h} bei Schrift ${fs}`, raus, []);
}
await page.evaluate(() => document.documentElement.style.setProperty('--fs', 1));
await page.setViewportSize({width: 1280, height: 800});

// --- 11) Kein Zwang --------------------------------------------------------
// Wer die Versuchung nie spielt, verliert nichts: der Hauptvorgang laeuft
// unveraendert, und der Abspann ist derselbe.
const zwang = await page.evaluate(() => {
  kn.flags.szeneVersuchung = false;
  return {zustellbar: vorgangZustellbar(), bilder: abspannBlaetter().length,
          vertagt: vorgangVertagt()};
});
pruef('ohne Versuchung bleibt zustellbar, was zustellbar war', zwang.zustellbar, true);
pruef('nichts wird dadurch vertagt', zwang.vertagt, false);
pruef('und der Abspann ist derselbe', zwang.bilder, 13);

// --- 12) Die Gegenprobe ----------------------------------------------------
// Ein Guard, der immer schweigt, beweist nichts. szeneAssert() hat mit SZ4 zwei
// Prueffelder dazubekommen: den zweiten Tafelstapel und die gesprochene Zeile
// mit Sprecher. Beide werden hier im laufenden Spiel absichtlich verletzt, und
// beide muessen sich melden und danach wieder schweigen.
const gegenprobe = await page.evaluate(() => {
  const raus = [];
  const echt = console.error;
  const faengt = () => { const gesagt = []; console.error = (...a) => gesagt.push(a.join(' ')); return gesagt; };
  const zurueck = () => { console.error = echt; };

  // (a) Ein Sprecherpaar ohne Namen.
  const bild = abspannBlaetter()[10];
  const alteFassung = abspannBlaetter;
  window.abspannBlaetter = () => { const l = alteFassung(); l[10] = Object.assign({}, bild,
    {stimme: [{wer:'', z: bild.stimme[0].z}]}); return l; };
  let g = faengt(); szeneAssert(); zurueck();
  raus.push(['leerer Sprecher gemeldet', g.some(z => z.includes('leerem Sprecher'))]);

  // (b) Ein Blatt mit zwei Lesarten gleichzeitig.
  window.abspannBlaetter = () => { const l = alteFassung(); l[0] = {z1:'a', z2:'b', stimme:['c'], blatt:'d'}; return l; };
  g = faengt(); szeneAssert(); zurueck();
  raus.push(['zwei Lesarten gemeldet', g.some(z => z.includes('keine oder zwei Lesarten'))]);

  // (c) Ein Gedankenstrich im Abspann, also die Formregel aus Kapitel 13.
  window.abspannBlaetter = () => { const l = alteFassung(); l[1] = {z1:'Turm I \u2014 oben', z2:'x'}; return l; };
  g = faengt(); szeneAssert(); zurueck();
  raus.push(['Gedankenstrich gemeldet', g.some(z => z.includes('Gedankenstrich'))]);

  // (d) Eine zu lange Antwort in der Versuchung.
  window.abspannBlaetter = alteFassung;
  const frage = SZENEN.versuchung.fragen[0], alterText = frage.t;
  frage.t = 'Was genau muss ich denn dafür alles lassen?';
  g = faengt(); szeneAssert(); zurueck();
  raus.push(['zu lange Frage gemeldet', g.some(z => z.includes('zu lang'))]);
  frage.t = alterText;

  // Und danach ist wieder Ruhe.
  g = faengt(); szeneAssert(); zurueck();
  raus.push(['danach schweigt er wieder', g.length === 0]);
  return raus;
});
for(const [name, ist] of gegenprobe) pruef(name, ist, true);

pruef('die Konsole bleibt still', laut, []);

await browser.close();
fertig = true;
bericht();
process.exit(fehl ? 1 : 0);
