// Pruefprotokoll zu Bauabschnitt SZ3 (phase-sz3-stopfen.md).
//
//   python3 serve.py &
//   node tools/stopfen-pruef.mjs [URL]
//
// stopfenAssert() im Spiel prueft, was ohne Spielzug wahr sein muss (der Ort,
// Serie I, Vorblatts Ankunftsbedingung, die Form des Strangs). Was sich erst im
// Spielen zeigt, steht hier:
//
//   das Brummen      der Boden meldet sich, wenn jemand danebensteht, und nur
//                    solange niemand nachgesehen hat. Es gibt keinen Marker,
//                    keinen Pfeil und keinen Eintrag im Brett
//   die Reihenfolge  nachsehen, freilegen, Zapf holen, oeffnen. Bei Stufe 2
//                    bietet die Stelle NICHTS an, weil Zapf im Dorf steht — eine
//                    Aktion, die anbietet, was sie nicht kann, ist schlimmer
//                    als keine
//   vor Akt IV       kein Angebot. Das BRUMMEN gibt es trotzdem, seit immer —
//                    es ist die Saat und nicht die Aufgabe
//   Szene 5          laeuft an der Roehre, Zapf spricht, und am Ende ist der
//                    Strang fertig und die Schicht gestempelt
//   der Lohn         Serie I faellt erst nach dem Stopfen und dann ueberall,
//                    der Postregen laeuft drei Schichten und nur im Dorf
//   der Preis        Vorblatt steht vorher NICHT im Dorf und kommt zwei
//                    Schichten nach dem Stopfen. Ohne Stopfen kommt er auch,
//                    nur zwei Schichten nach der vierten Adresszeile
//   Szene 6          die Entklammerung faellt auf dem Dorfplatz, genau einmal,
//                    und danach steht er da und ist ansprechbar
//   kein Zwang       wer nie ins Steinfeld geht, spielt das Spiel unveraendert
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

// Alles auf Anfang: kein Strang, keine Merker, keine Stempel. Der Lauf soll den
// Zustand herstellen, den er prueft, und nicht den vorfinden, den ein
// localStorage aus einer frueheren Sitzung mitbringt.
const zuruecksetzen = () => page.evaluate(() => {
  kladde.lang = {}; kladde.blaetter = {}; kladde.vorgang = {};
  kn.flags.szeneStopfen = false; kn.flags.szeneVorblatt = false;
  amt.stopfenSchicht = 0; amt.adressSchicht = 0;
  amt.schichten = 0; szeneAus();
});

// --- 1) Der Ort ------------------------------------------------------------
const ort = await page.evaluate(() => ({
  da: STOPFEN.da, ty: STOPFEN.ty, ruinBis: RUIN_Y1,
  begehbar: reachbar(STOPFEN.tx, STOPFEN.ty),
  aufWeg: T(STOPFEN.tx, STOPFEN.ty) === G_PATH,
}));
pruef('die Stelle liegt auf dieser Karte', ort.da, true);
pruef('und zwar im Steinfeld', ort.ty <= ort.ruinBis, true);
pruef('sie ist begehbar', ort.begehbar, true);
pruef('und liegt nicht auf dem Weg', ort.aufWeg, false);

// --- 2) Vor Akt IV gibt es sie nicht ---------------------------------------
await zuruecksetzen();
const frueh = await page.evaluate(() => {
  amt.schichten = 5;                      // Akt I
  player.x = STOPFEN.x; player.y = STOPFEN.y;
  floaters.length = 0; stopfenBrummT = 0;
  stopfenBrummen(0.016);
  aktSperre = 0; scanAktion(0.016);
  return {akt: aktStand(), angebot: stopfenAktionText(), txt: aktTxt,
          brummt: floaters.some(f => f.txt.indexOf('brummt') >= 0)};
});
pruef('Akt I: die Stelle bietet nichts an', [frueh.akt, frueh.angebot], [1, '']);
// Der Boden brummt trotzdem. Das ist die Saat aus der Weltgeschichte ("das sei
// schon immer so gewesen") und ausdruecklich kein Versehen: wer in Akt I
// hinaufsteigt, hoert sie und kann nichts damit anfangen.
pruef('der Boden brummt trotzdem, er tut es seit 741', frueh.brummt, true);

// --- 3) Akt IV: das Brummen ------------------------------------------------
const brummen = await page.evaluate(() => {
  amt.schichten = 30;                     // Akt IV
  player.x = STOPFEN.x; player.y = STOPFEN.y;
  floaters.length = 0; stopfenBrummT = 0;
  stopfenBrummen(0.016);
  const nah = floaters.some(f => f.txt.indexOf('brummt') >= 0);
  // Und aus der Ferne schweigt er.
  floaters.length = 0; stopfenBrummT = 0;
  player.x = STOPFEN.x + 900; player.y = STOPFEN.y;
  stopfenBrummen(0.016);
  const fern = floaters.some(f => f.txt.indexOf('brummt') >= 0);
  return {akt: aktStand(), nah, fern};
});
pruef('Akt IV: der Boden brummt, wenn man danebensteht', [brummen.akt, brummen.nah], [4, true]);
pruef('aus der Ferne schweigt er', brummen.fern, false);

// --- 4) Die Reihenfolge ----------------------------------------------------
const kette = await page.evaluate(() => {
  const raus = {};
  player.x = STOPFEN.x; player.y = STOPFEN.y;
  raus.s0 = stopfenAktionText();
  aktSperre = 0; scanAktion(0.016); raus.a0 = aktTxt;
  stopfenGriff();                                  // nachsehen
  raus.s1 = [stopfenStand(), stopfenAktionText()];
  stopfenGriff();                                  // freilegen
  raus.s2 = [stopfenStand(), stopfenAktionText()];
  // Jetzt fehlt Zapf. Ein weiterer Griff darf nichts tun.
  stopfenGriff();
  raus.nachDrittemGriff = stopfenStand();
  // Der Boden brummt nicht mehr, sobald nachgesehen ist.
  floaters.length = 0; stopfenBrummT = 0; stopfenBrummen(0.016);
  raus.brummtNoch = floaters.some(f => f.txt.indexOf('brummt') >= 0);
  // Zapf im Dorf ansprechen.
  raus.zapfZeile = langAnsprechen('zapf');
  raus.s3 = [stopfenStand(), stopfenAktionText()];
  return raus;
});
pruef('vor dem ersten Griff heisst es "Nachsehen"', [kette.s0, kette.a0], ['Nachsehen', 'Nachsehen']);
pruef('danach "Freilegen"', kette.s1, [1, 'Freilegen']);
pruef('danach liegt die Röhre da und die Stelle schweigt', kette.s2, [2, '']);
pruef('ein weiterer Griff bewegt nichts', kette.nachDrittemGriff, 2);
pruef('der Boden brummt nicht mehr', kette.brummtNoch, false);
pruef('Zapf holt das Werkzeug', kette.zapfZeile && kette.zapfZeile.z2, 'Ich hole das Werkzeug.');
pruef('und jetzt lässt sich die Röhre öffnen', kette.s3, [3, 'Die Röhre öffnen']);

// --- 5) Szene 5 ------------------------------------------------------------
const szene = await page.evaluate(() => {
  const vorher = {serieI: blattFaelltAusRohr(), stempel: amt.stopfenSchicht};
  player.x = STOPFEN.x; player.y = STOPFEN.y;
  aktSperre = 0; scanAktion(0.016);
  const angebot = aktTxt;
  fuehreAktion();
  const offen = szeneAktiv;
  // Der Sprecher landet in gespraech.fig, nicht am Szenenobjekt: szeneOeffnen()
  // setzt npc und fig, und die Tafel liest von dort.
  const sprecher = gespraech.fig ? gespraech.fig.key : null;
  // Durchspielen: immer die erste Antwort, bis die Szene zu ist.
  let runden = 0;
  while(szeneAktiv && runden++ < 20){
    gespraechFertigTippen();
    const o = szeneOptionen();
    if(!o.length) break;
    o[0].tun();
  }
  return {vorher, angebot, offen, sprecher, runden,
          nachher: szeneAktiv, stufe: stopfenStand(), fertig: stopfenGezogen(),
          merker: kn.flags.szeneStopfen, stempel: amt.stopfenSchicht};
});
pruef('die Kontextaktion öffnet Szene 5', [szene.angebot, szene.offen], ['Die Röhre öffnen', 'stopfen']);
pruef('Zapf spricht sie', szene.sprecher, 'zapf');
pruef('sie läuft bis zum Ende durch', szene.nachher, null);
pruef('der Strang ist danach fertig', [szene.stufe, szene.fertig], [4, true]);
pruef('der Merker steht', szene.merker, true);
pruef('und die Schicht ist gestempelt', szene.stempel > 0, true);

// --- 6) Der Lohn -----------------------------------------------------------
const lohn = await page.evaluate(() => {
  // Serie I: 400 Wuerfe, danach muss mindestens eines gefallen sein, und alle
  // gefundenen muessen aus Serie I stammen.
  let treffer = 0;
  for(let i = 0; i < 400; i++) if(blattFaelltAusRohr()) treffer++;
  const regenImDorf = (() => {
    const alt = {x: player.x, y: player.y};
    player.x = (VILLAGE.x0 + VILLAGE.x1) * TS / 2;
    player.y = (VILLAGE.y0 + VILLAGE.y1) * TS / 2;
    const imDorf = inVillagePx(player.x, player.y);
    const n0 = decalN; postregenT = 0; postregen(0.016);
    const gefallen = decalN > n0 || decalHead !== 0;
    player.x = alt.x; player.y = alt.y;
    return {imDorf, gefallen};
  })();
  const spaeter = (() => { const s = amt.schichten; amt.schichten = (amt.stopfenSchicht - 1) + 3;
                           const l = postregenLaeuft(); amt.schichten = s; return l; })();
  return {treffer, regenImDorf, spaeter, laeuft: postregenLaeuft()};
});
pruef('Serie I fällt nach dem Stopfen', lohn.treffer > 0, true);
pruef('der Postregen läuft', lohn.laeuft, true);
pruef('und zwar im Dorf', [lohn.regenImDorf.imDorf, lohn.regenImDorf.gefallen], [true, true]);
pruef('nach drei Schichten ist er vorbei', lohn.spaeter, false);

// --- 7) Der Preis: Vorblatt ------------------------------------------------
const preis = await page.evaluate(() => {
  const fig = DORF_FIGUREN.find(f => f.key === 'vorblatt');
  const vorher = figDa(fig);
  // Zwei Schichten nach dem Stopfen.
  amt.schichten = (amt.stopfenSchicht - 1) + 2;
  const faellig = vorblattFaellig();
  player.x = (VILLAGE.x0 + VILLAGE.x1) * TS / 2;
  player.y = (VILLAGE.y0 + VILLAGE.y1) * TS / 2;
  szene6Faellig();
  const offen = szeneAktiv;
  // Der Sprecher landet in gespraech.fig, nicht am Szenenobjekt: szeneOeffnen()
  // setzt npc und fig, und die Tafel liest von dort.
  const sprecher = gespraech.fig ? gespraech.fig.key : null;
  let runden = 0;
  while(szeneAktiv && runden++ < 20){
    gespraechFertigTippen();
    const o = szeneOptionen();
    if(!o.length) break;
    o[0].tun();
  }
  return {vorher, faellig, offen, sprecher, nachher: szeneAktiv,
          merker: kn.flags.szeneVorblatt, jetztDa: figDa(fig), anlass: letzterAnlass};
});
pruef('vor der Entklammerung steht Vorblatt nicht im Dorf', preis.vorher, false);
pruef('zwei Schichten nach dem Stopfen ist er fällig', preis.faellig, true);
pruef('Szene 6 fällt auf dem Dorfplatz', preis.offen, 'vorblatt');
pruef('er spricht sie selbst', preis.sprecher, 'vorblatt');
pruef('sie läuft bis zum Ende durch', preis.nachher, null);
pruef('danach steht er im Dorf', [preis.merker, preis.jetztDa], [true, true]);
pruef('Lott und Pahl haben etwas gesehen', preis.anlass, 'vorblatt');

// Sie faellt genau einmal.
const nochmal = await page.evaluate(() => { szene6Faellig(); return szeneAktiv; });
pruef('und sie fällt kein zweites Mal', nochmal, null);

// --- 8) Der zweite Weg, ohne Stopfen ---------------------------------------
await zuruecksetzen();
const ohne = await page.evaluate(() => {
  amt.schichten = 30;
  const ohneAlles = vorblattFaellig();
  amt.adressSchicht = amt.schichten + 1;         // die vierte Adresszeile faellt
  const sofort = vorblattFaellig();
  amt.schichten += 2;
  const spaeter = vorblattFaellig();
  return {ohneAlles, sofort, spaeter, stopfen: stopfenStand()};
});
pruef('ohne Stopfen und ohne Adresszeile kommt niemand', ohne.ohneAlles, false);
pruef('die vierte Adresszeile allein reicht noch nicht', ohne.sofort, false);
pruef('zwei Schichten später schon', ohne.spaeter, true);
pruef('und der Stopfen ist dabei unberührt', ohne.stopfen, 0);

// --- 9) Kein Zwang ---------------------------------------------------------
await zuruecksetzen();
const zwang = await page.evaluate(() => {
  amt.schichten = 30;
  return {
    // Der Strang ist nirgends Bedingung: die Ausfertigung haengt an den
    // Adresszeilen und an nichts sonst.
    zustellbarOhne: (() => { kladde.vorgang = {1:true,2:true,3:true,4:true};
                             const z = vorgangAusfertigung(); kladde.vorgang = {}; return z; })(),
    serieIStumm: blattFaelltAusRohr(),
    regenAus: postregenLaeuft(),
    angebotNurDort: (() => { player.x = 0; player.y = 0; return stopfenAktionText(); })(),
  };
});
pruef('die Ausfertigung braucht den Stopfen nicht', zwang.zustellbarOhne, true);
pruef('ohne Stopfen fällt Serie I nicht', zwang.serieIStumm, false);
pruef('und es regnet keine Post', zwang.regenAus, false);
pruef('die Stelle wirkt nur an der Stelle', zwang.angebotNurDort, 'Nachsehen');

pruef('Konsole still', laut, []);

await ctx.close();
await browser.close();
fertig = true;
bericht();
process.exit(fehl ? 1 : 0);
