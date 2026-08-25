// Pruefprotokoll zu Bauabschnitt K1 (phase-k1-zulagen.md).
//
//   python3 serve.py &
//   node tools/zulagen-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium, wie die uebrigen Laeufe
// (PLAYWRIGHT_PFAD und CHROMIUM werden gelesen, falls gesetzt).
//
// Geprueft wird, was K1 zugesagt hat, im echten Browser statt in einer
// Behauptung:
//
//   Ziehung      der Aufstieg legt drei verschiedene Karten aus, zieht den
//                Zaehler ab und wuerfelt ein ausliegendes Angebot nicht neu
//   Wahl         die bewilligte Karte landet in der Kartei und legt sich ein
//   Faecher      eines bis Stufe 5, zwei bis Stufe 15, drei darueber
//   Stapel       gleiche Familie zweimal nur, wenn sie stapelt, nie dreimal
//   Gefecht      im Gefecht wird die Mappe nicht umgesteckt
//   Wirkung      die eingelegte Karte steht in derived, die Gattungskarte NUR
//                mit der passenden Waffe, der Zweigzuschlag nur im eigenen Zweig
//   Kartei       was nicht eingelegt ist, wirkt nicht
//   Panel        Taste, Guertelknopf, Esc-Reihenfolge, Schleier, Sternchen
//   Form         kein Kartentext mit einer Zahl darin (Weltbibel Kapitel 13)
//   Schicht      Kartei und Vorlagen fallen mit der Schicht, der Ausbau
//                'Hoehere Anfangsstufe' zahlt dieselbe Pauschale wie die
//                Befaehigungspunkte
//
// Anders als die Messlaeufe misst dieser Lauf nichts, er stellt fest: jede
// Zeile ist ein Soll-Ist-Vergleich, der Exit-Code ist 1, sobald eine nicht
// stimmt.
//
// WICHTIG, und der Grund fuer die Bauform: dieser Lauf startet KEINE Schicht
// und wartet auf keinen Frame. Ohne das lizenzierte Grafikpaket (assets/cf,
// gitignoriert) reisst bakeUiSkin() nach loadAssets() ab, und alles, was auf
// ein Bild wartet, wartet vergebens (README, "Eine frische Sitzung
// einrichten"). Die Zulagen-Maschine ist davon unberuehrt: Katalog, Ziehung,
// recalc() und das Panel-Markup stehen lange vorher. Der Lauf faehrt sie
// deshalb unmittelbar an und laeuft mit wie ohne Grafikpaket durch.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

const zeilen = [];
let fehl = 0;
function pruef(name, ist, soll){
  const ok = JSON.stringify(ist) === JSON.stringify(soll);
  if(!ok) fehl++;
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(58)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}

const ctx = await browser.newContext();
const page = await ctx.newPage();
const laut = [];
page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', m => {
  if(m.type() !== 'error') return;
  // Ein fehlendes Sprite-Blatt ist ein Fehlstand des Grafikpakets, kein Fund
  // dieses Laufs (gleiche Lesart wie menue-pruef.mjs). Der Abriss in
  // bakeUiSkin() haengt daran und wird aus demselben Grund durchgelassen.
  const t = m.text();
  if(t.includes('404') || t.includes("reading 'img'")) return;
  laut.push('console: ' + t.slice(0, 200));
});
await page.goto(URL, { waitUntil: 'load' });
// Kein waitForFunction auf assetsReady: s. Kopf. Der Katalog steht, sobald das
// Skript durch ist, und die Guards haben dann laengst gemeldet.
await page.waitForFunction(() => typeof ZULAGE === 'object' && typeof zulageSlots === 'function',
                           null, { timeout: 30000 });

// Setzt den Spieler auf einen bekannten Stand. Immer VOR einer Probe rufen,
// nie zwischen zwei Zeilen derselben Probe.
const frisch = () => page.evaluate(() => {
  player.zulagenKartei = []; player.zulagenZiehungen = 0; player.zulagenAngebot = null;
  player.kampfT = 0; player.level = 1; player.xp = 0; player.hp = 999;
  player.skills = {str:0, vit:0, agi:0, int:0};
  player.equip = {weapon:{base:BASES[1], rar:1, affixes:[], name:'Probeklinge'}, armor:null, shield:null, boots:null};
  recalc();
});

// ------------------------------------------------------------- Der Guard
{
  const g = await page.evaluate(() => zulagenAssert());
  pruef('zulagenAssert() meldet nichts', g, true);
}

// ------------------------------------------------------------ Die Ziehung
await frisch();
{
  const z = await page.evaluate(() => {
    gainXP(Math.ceil(xpFuerStufe(player.level)) + 1);
    const ang = player.zulagenAngebot;
    const ersteFamilien = ang.map(a => a.familie);
    // Zweite Runde: der Zaehler steht, das Angebot bleibt liegen
    player.zulagenZiehungen = 1;
    zulagenAngebotSicherstellen();
    return { stufe: player.level, zahl: ang.length,
             verschieden: new Set(ersteFamilien).size,
             stufenImBand: ang.every(a => a.stufe >= 1 && a.stufe <= 3),
             keinKracherFrueh: ang.every(a => a.stufe < 3),
             bleibtLiegen: player.zulagenAngebot === ang,
             zaehlerHaelt: player.zulagenZiehungen };
  });
  pruef('Aufstieg legt genau drei aus', z.zahl, 3);
  pruef('drei verschiedene Familien', z.verschieden, 3);
  pruef('gewuerfelte Stufen liegen im Band', z.stufenImBand, true);
  pruef('kein Unikat auf der zweiten Stufe', z.keinKracherFrueh, true);
  pruef('ausliegendes Angebot wird nicht neu gewuerfelt', z.bleibtLiegen, true);
  pruef('und der Zaehler sinkt dabei nicht', z.zaehlerHaelt, 1);
}

// --------------------------------------------------------------- Die Wahl
await frisch();
{
  const z = await page.evaluate(() => {
    player.zulagenZiehungen = 1; zulagenAngebotSicherstellen();
    const gewaehlt = player.zulagenAngebot[0].familie;
    zulageWaehlen(0);
    return { kartei: player.zulagenKartei.length, eingelegt: zulageMappe().length,
             richtige: player.zulagenKartei[0].familie === gewaehlt,
             angebotWeg: player.zulagenAngebot === null };
  });
  pruef('die bewilligte Karte liegt in der Kartei', z.kartei, 1);
  pruef('und legt sich selbst ein', z.eingelegt, 1);
  pruef('es ist die angeklickte', z.richtige, true);
  pruef('das Angebot ist danach weg', z.angebotWeg, true);
}

// ------------------------------------------------- Faecher, Stapel, Gefecht
{
  const z = await page.evaluate(() => {
    const faecher = [1, 4, 5, 14, 15, 40].map(zulageSlots);
    player.zulagenKartei = []; player.kampfT = 0; player.level = 1;
    // nicht stapelbar: nie zweimal, auch mit freiem Fach
    player.zulagenKartei = [{familie:'eilverfahren', stufe:1, angelegt:false},
                            {familie:'eilverfahren', stufe:2, angelegt:false}];
    zulageAnlegen(0); zulageAnlegen(1);
    const einFach = zulageMappe().length;
    player.level = 5; zulageAnlegen(1);
    const nichtStapelbar = zulageMappe().length;
    // stapelbar: zweimal ja, dreimal nein
    player.zulagenKartei = [{familie:'klingenzulage', stufe:1, angelegt:false},
                            {familie:'klingenzulage', stufe:1, angelegt:false},
                            {familie:'klingenzulage', stufe:1, angelegt:false}];
    zulageAnlegen(0); zulageAnlegen(1);
    const gestapelt = zulageMappe().length;
    player.level = 15; zulageAnlegen(2);
    const deckel = zulageMappe().length;
    // Gefecht
    player.zulagenKartei = [{familie:'dienstweg', stufe:1, angelegt:false}];
    player.kampfT = 3; zulageAnlegen(0);
    const imGefecht = zulageMappe().length;
    player.kampfT = 0; zulageAnlegen(0);
    const danach = zulageMappe().length;
    // und zurueck in die Kartei, ebenfalls nur ausserhalb des Gefechts
    player.kampfT = 3; zulageAblegen(0);
    const ablegenImGefecht = zulageMappe().length;
    player.kampfT = 0; zulageAblegen(0);
    return { faecher, einFach, nichtStapelbar, gestapelt, deckel, imGefecht, danach,
             ablegenImGefecht, abgelegt: zulageMappe().length };
  });
  pruef('Faecherleiter 1/4/5/14/15/40', z.faecher, [1, 1, 2, 2, 3, 3]);
  pruef('ein Fach traegt eine Karte', z.einFach, 1);
  pruef('nicht stapelbare Familie bleibt einmal', z.nichtStapelbar, 1);
  pruef('stapelbare Familie darf zweimal', z.gestapelt, 2);
  pruef('aber nie dreimal', z.deckel, 2);
  pruef('im Gefecht wird nicht eingelegt', z.imGefecht, 0);
  pruef('danach schon', z.danach, 1);
  pruef('im Gefecht wird auch nicht abgelegt', z.ablegenImGefecht, 1);
  pruef('danach schon', z.abgelegt, 0);
}

// ------------------------------------------------------------- Die Wirkung
await frisch();
{
  const z = await page.evaluate(() => {
    const je = (kartei) => { player.zulagenKartei = kartei; recalc();
                             return {min: derived.dmgMin, max: derived.dmgMax, hp: derived.maxHp, crit: derived.crit}; };
    const ohne = je([]);
    const klinge = je([{familie:'klingenzulage', stufe:3, angelegt:true}]);
    // dieselbe Karte, aber eine Axt in der Hand
    player.skills = {str:12, vit:0, agi:0, int:0};
    player.equip.weapon = {base:Object.assign({t:'weapon',tier:4}, CRAFT_BASE.weapon[3]), rar:4, affixes:[], name:'Probeaxt'};
    const axtOhne = je([]);
    const axtMitKlinge = je([{familie:'klingenzulage', stufe:3, angelegt:true}]);
    const axtMitAxt = je([{familie:'pauschalabfertigung', stufe:1, angelegt:true}]);
    // Kartei ohne Mappe wirkt nicht
    player.equip.weapon = {base:BASES[1], rar:1, affixes:[], name:'Probeklinge'};
    player.skills = {str:0, vit:0, agi:0, int:0};
    const liegend = je([{familie:'erschwerniszulage', stufe:3, angelegt:false}]);
    const leer = je([]);
    // Zweigzuschlag, gerechnet wie in castSpell
    const sd = (id) => { const sp = SPELLS.find(s => s.id === id);
      return Math.round(sp.dmg * (1 + FX.zauber*0.12 + ([FX.feuer,FX.frost,FX.arkan][sp.branch]||0)*0.15)); };
    je([]);
    const frostRoh = sd('frostnova'), feuerRoh = sd('feuerball');
    je([{familie:'kaltverfuegung', stufe:3, angelegt:true}]);
    const frostMit = sd('frostnova'), feuerMit = sd('feuerball');
    const ultRoh = SPELLS.find(s => s.ultimate).dmg;
    je([]);
    return { klingeMin: klinge.min - ohne.min, klingeMax: klinge.max - ohne.max,
             klingeAnAxt: axtMitKlinge.min - axtOhne.min,
             axtAnAxt: axtMitAxt.min - axtOhne.min,
             karteiWirktNicht: liegend.hp === leer.hp,
             frostRoh, frostMit, feuerRoh, feuerMit, ultRoh };
  });
  pruef('Klingenzulage III am Schwert', [z.klingeMin, z.klingeMax], [20, 28]);
  pruef('dieselbe Karte an der Axt traegt nichts', z.klingeAnAxt, 0);
  pruef('die Axtkarte an der Axt schon', z.axtAnAxt, 5);
  pruef('was in der Kartei liegt, wirkt nicht', z.karteiWirktNicht, true);
  pruef('Kaltverfuegung III hebt den Frostzauber', [z.frostRoh, z.frostMit], [43, 69]);
  pruef('und laesst den Feuerzauber in Ruhe', z.feuerMit, z.feuerRoh);
}

// --------------------------------------------------------------- Das Blatt
//
// U8: Die Mappe ist kein eigenes Fenster mehr, sondern das zweite Blatt des
// Charakterfensters ("dort findet man auch die Spielkarten-Mappe"). Was sie
// zeigt, ist unveraendert — dieselben drei Kaesten, dieselben Renderfunktionen,
// dieselben IDs. Was sich aendert, ist nur, WORAN man 'offen' erkennt: nicht
// mehr an einem eigenen Zustand, sondern an charakterOpen und dem Blatt.
// Die Taste Z fuehrt weiter direkt hierher, der Guertelknopf heisst jetzt
// charBtn und oeffnet das Fenster auf dem ersten Blatt.
await frisch();
{
  await page.evaluate(() => {
    player.level = 15; player.zulagenZiehungen = 1; zulagenAngebotSicherstellen();
    player.zulagenKartei = [{familie:'eilverfahren', stufe:2, angelegt:true},
                            {familie:'brandschutzausnahme', stufe:1, angelegt:false}];
    recalc(); updateHUD();
  });
  const zu = () => page.evaluate(() => zulagenOffen());
  await page.keyboard.press('z');
  pruef('Taste Z oeffnet die Kartenmappe', await zu(), true);
  pruef('und zwar im Charakterfenster', await page.evaluate(() =>
    charakterOpen && document.getElementById('charMappe').style.display !== 'none'), true);
  const z = await page.evaluate(() => ({
    ziehkarten: document.querySelectorAll('#zulZiehung .zulKarte').length,
    faecher: document.querySelectorAll('#zulMappe .zulKarte').length,
    eingelegt: document.querySelectorAll('#zulMappe .zulKarte.angelegt').length,
    kartei: document.querySelectorAll('#zulKartei .zulKarte').length,
    mappenname: document.querySelector('#zulMappe h4 span').textContent,
    schleier: document.body.classList.contains('panelOffen'),
    sternchen: document.getElementById('zulBadge').style.display,
    zahlenImSatz: [...document.querySelectorAll('.zulKarte .zSatz')].map(e => e.textContent)
                    .filter(t => /[0-9]/.test(t) && !/^Fach frei ab Stufe/.test(t)),
  }));
  pruef('drei Karten liegen aus', z.ziehkarten, 3);
  pruef('die Mappe zeigt drei Faecher', z.faecher, 3);
  pruef('davon eines belegt', z.eingelegt, 1);
  pruef('eine Karte liegt in der Kartei', z.kartei, 1);
  pruef('die Mappe heisst auf Stufe 15 Ordner', z.mappenname, 'Ordner');
  pruef('der Schleier liegt', z.schleier, true);
  pruef('das Sternchen brennt bei offener Vorlage', z.sternchen, 'inline');
  pruef('kein Kartentext traegt eine Zahl', z.zahlenImSatz, []);
  await page.keyboard.press('Escape');
  pruef('Esc schliesst die Kartenmappe', await zu(), false);
  // U8: Der Guertelknopf oeffnet das Charakterfenster auf dem Blatt, das zuletzt
  // aufgeschlagen war — hier also wieder auf der Mappe. Das ist Absicht: wer
  // seine Sammlung durchsieht, macht das nicht in einem Zug, und ein Fenster,
  // das bei jedem Oeffnen auf Seite eins zurueckspringt, laesst ihn jedes Mal
  // neu blaettern. Die Taste Z fuehrt ohnehin direkt hierher.
  await page.evaluate(() => document.getElementById('charBtn').click());
  pruef('der Guertelknopf oeffnet das Charakterfenster', await page.evaluate(() => charakterOpen), true);
  pruef('und schlaegt das zuletzt benutzte Blatt auf', await zu(), true);
  await page.evaluate(() => document.querySelector('#charakter .gfBlatt[data-blatt="werte"]').click());
  pruef('das erste Blatt zeigt die Mappe nicht', await zu(), false);
  pruef('dafuer die Ausruestung', await page.evaluate(() =>
    document.getElementById('charWerte').style.display !== 'none'
    && document.querySelectorAll('#equipGrid .eqSlot').length === 4), true);
  await page.evaluate(() => document.querySelector('#charakter .gfBlatt[data-blatt="mappe"]').click());
  pruef('das zweite Blatt fuehrt zurueck auf die Mappe', await zu(), true);
  // Esc-Reihenfolge: der Rucksack liegt im Register vor dem Charakterfenster.
  // Er raeumt es beim Oeffnen weg (beide sind Grossfenster, s. U8), also wird
  // hier ein KLEINES Panel darueber gelegt — dafuer gilt die Regel weiter.
  await page.evaluate(() => schlossAuf({code:['a','b','c'], fertig:false}));
  await page.keyboard.press('Escape');
  pruef('Esc nimmt genau eine Ebene', await page.evaluate(() => [charakterOpen, schlossOpen]), [false, true]);
  await page.keyboard.press('Escape');
  pruef('der zweite Druck die naechste', await page.evaluate(() => schlossOpen), false);
}

// ------------------------------------------------------------- Die Schicht
{
  const z = await page.evaluate(() => {
    const merk = amt.ausbauten.startLevel;
    player.zulagenKartei = [{familie:'dienstweg', stufe:1, angelegt:true}];
    player.zulagenZiehungen = 4;
    amt.ausbauten.startLevel = 0; startShift();
    const ohneAusbau = { kartei: player.zulagenKartei.length,
                         vorlagen: player.zulagenZiehungen + (player.zulagenAngebot ? 1 : 0) };
    amt.ausbauten.startLevel = 3; startShift();
    const mitAusbau = { stufe: player.level, punkte: player.skillPoints,
                        vorlagen: player.zulagenZiehungen + (player.zulagenAngebot ? 1 : 0) };
    amt.ausbauten.startLevel = merk; startShift();
    return { ohneAusbau, mitAusbau };
  });
  pruef('die Schicht leert die Kartei', z.ohneAusbau.kartei, 0);
  pruef('und legt ohne Ausbau nichts vor', z.ohneAusbau.vorlagen, 0);
  pruef('Ausbau drei startet auf Stufe 4', z.mitAusbau.stufe, 4);
  pruef('zahlt sechs Befaehigungspunkte', z.mitAusbau.punkte, 6);
  pruef('und dieselbe Pauschale an Vorlagen', z.mitAusbau.vorlagen, 3);
}

pruef('Konsole still', laut, []);

await ctx.close();
await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
