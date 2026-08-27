// Pruefprotokoll zu Bauabschnitt U3 (phase-u3-gespraech.md).
//
//   python3 serve.py &
//   node tools/gespraech-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium, wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// Geprueft wird, was U3 zugesagt hat, im echten Browser statt in einer
// Behauptung:
//
//   Namensschild    blendet mit der Entfernung ein und aus statt dauerhaft zu
//                   stehen, und zwei Schilder nebeneinander verdecken sich
//                   nicht (Lott, Pahl und Pommer sitzen auf einer Bank)
//   Gespraech       F oeffnet die Tafel, sie nennt den vollen Namen und bietet
//                   vier Antworten; Ziffer, Pfeil und Klick waehlen; "Auf
//                   Wiedersehen", Esc, ein Klick daneben und Weggehen schliessen
//   Zweiteilung     die Tafel zerfaellt in zwei Haelften (U4), Satz und Portraet
//                   oben, Amtsbezeichnung, Antworten und Spielerbild unten, mit
//                   einer Kante ohne Spalt dazwischen; auf Mobil faellt das
//                   zweite Bildfeld weg, die Teilung bleibt
//   keine Doppelung ein Griff, der die Tafel wegwischt, ist kein Angriff, und
//                   die '1' im Gespraech ist keine Trankgabe (U1-Regel)
//   Tippen          der Satz laeuft ein und steht danach vollstaendig da
//   Schrift         der Regler setzt --fs, eine gemessene Schriftgroesse waechst
//                   mit, und die Stellung ueberlebt einen Neustart
//
// Dazu seit U6 (phase-u6-knoeterich-tafel.md):
//
//   Knoeterich     die Kontextaktion an der Weltfigur heisst "Ansprechen" und
//                  oeffnet seine Tafel mit gemaltem Portraet, vollem Namen und
//                  vier Antworten; sein Grundzeilen-Kreislauf laeuft durch alle
//                  sechs Zeilen und die Aktzeile; liegt ein Dienstzettel vor,
//                  kommt "Was stand da eben?" als fuenfte dazu und spielt ihn
//                  wieder ab; Weggehen schliesst die Tafel wie im Dorf
//   Dienstzettel   das obere Band traegt dasselbe gemalte Portraet statt des
//                  Sinnbilds aus der Zeichentabelle
//   Noergel        traegt Blatt und Massstab der Gruenhaut aus MONDEF und
//                  steht damit deutlich kleiner als die Menschen im Dorf
//   Rangfolge      auf Mobil steht die Antwortliste vollstaendig in der Tafel,
//                  und wenn der Platz nicht reicht, rollt der Satz des
//                  Gegenuebers. Vor U6 war es umgekehrt: die Tafel rollte als
//                  Ganzes und die Antworten standen ausserhalb
//
// Wie menue-pruef.mjs stellt dieser Lauf fest statt zu messen: jede Zeile ist
// ein Soll-Ist-Vergleich, der Exit-Code ist 1 bei der ersten Abweichung.
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
  zeilen.push(`${ok ? 'ok  ' : 'FEHL'}  ${name.padEnd(56)} ist=${JSON.stringify(ist)} soll=${JSON.stringify(soll)}`);
}

// Startet das Spiel und klickt den W8-Einstellungsvordruck durch, bis das
// Overlay weg ist — genau wie in menue-pruef.mjs und aus demselben Grund.
async function spiel(ctxOpt){
  const ctx = await browser.newContext(ctxOpt);
  const page = await ctx.newPage();
  const laut = [];
  page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
  page.on('console', m => {
    if(m.type() !== 'error') return;
    if(m.text().includes('404')) return;   // fehlendes Sprite-Blatt ist ein Lizenzstand, kein Fund
    laut.push('console: ' + m.text().slice(0, 200));
  });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
  await page.evaluate(() => startGame());
  await page.waitForTimeout(300);
  // E2: startGame() oeffnet nicht mehr das Overlay, sondern den Empfang in der
  // Gespraechstafel auf schwarzem Grund. Die Schleife darunter wartet auf ein
  // sichtbares Overlay und waere sofort ausgestiegen, mitten im Anfang. Ein
  // Sprung auf den Vordruck bringt den Lauf auf den Weg, den er kennt.
  await page.evaluate(() => { if(typeof empfangAktiv !== 'undefined' && empfangAktiv) empfangUeberspringen(); });
  await page.waitForTimeout(200);
  // E2: Der Vordruck blaettert seit E2 nach gemessener Hoehe und hat je nach
  // Fenster und Schriftstufe bis zu fuenfzehn Seiten statt drei. Zwoelf Runden
  // reichten nicht mehr bis zur Unterschrift, der Lauf blieb im Vordruck
  // stehen und alles danach fiel aus.
  for(let i = 0; i < 60; i++){
    const weiter = await page.evaluate(() => {
      if(document.getElementById('overlay').style.display !== 'flex') return false;
      const b = [...document.querySelectorAll('#overlay button')].pop();
      if(!b) return false;
      b.click(); return true;
    });
    if(!weiter) break;
    await page.waitForTimeout(200);
  }
  // AN2: hinaus aus der Amtsstube. Der Anfang endet seit AN2 drinnen, und der
  // erste freie Schritt ist der Schritt hinaus. Dieser Lauf prueft das DORF --
  // drinnen traegt map den Grundriss und npcs die Leute des Raumes, und jede
  // Weltmessung traefe den falschen Ort.
  await page.evaluate(() => { if(innen) verlasseHaus(); });
  await page.waitForTimeout(250);
  await page.evaluate(() => {
    window.__schlaege = 0;
    const alt = tryAttack;
    window.tryAttack = tryAttack = function(...a){ window.__schlaege++; return alt.apply(this, a); };
  });
  return { page, ctx, laut };
}

// Stellt den Spieler neben eine Dorffigur und laesst scanAktion() einen Frame
// nachziehen — ohne die Wartezeit steht aktObj noch auf dem letzten Angebot.
async function hin(page, key, abstand = 24){
  await page.evaluate(([k, d]) => {
    const n = npcs.find(x => x.key === k);
    player.x = n.x + d; player.y = n.y + 6; camSnap();
  }, [key, abstand]);
  await page.waitForTimeout(400);
}

const tafel = page => page.evaluate(() => ({
  offen: gespraechOffen,
  name: el('gespraechNameTxt').textContent,
  sichtbar: getComputedStyle(el('gespraech')).display !== 'none',
  antworten: [...document.querySelectorAll('.gwOpt')].map(o => o.innerText.replace(/\s+/g, ' ').trim()),
  text: el('gespraechText').innerText.replace(/\s+/g, ' ').trim(),
  schlaege: window.__schlaege,
  schleier: document.body.classList.contains('panelOffen'),
}));

// ---------------------------------------------------------------- Desktop
{
  const { page, ctx, laut } = await spiel({ viewport: { width: 1280, height: 800 } });

  // --- Namensschild: Deckkraft ueber die Entfernung -----------------------
  const schild = await page.evaluate(() => {
    const n = npcs[0];
    const bei = d => { player.x = n.x + d; player.y = n.y; return npcNameAlpha(n.x, n.y); };
    return { nah: bei(NPC_NAME_NAH - 20), mitte: bei((NPC_NAME_NAH + NPC_NAME_FERN) / 2),
             fern: bei(NPC_NAME_FERN + 20), deckel: DORF_FIGUREN.every(f => f.kurz && f.kurz.length <= 24) };
  });
  pruef('Schild in Rufnaehe voll sichtbar', schild.nah, 1);
  pruef('Schild dazwischen halb durchsichtig', schild.mitte > 0.2 && schild.mitte < 0.8, true);
  pruef('Schild ausser Reichweite gar nicht', schild.fern, 0);
  pruef('alle elf Kurznamen unter dem Deckel', schild.deckel, true);

  // --- Namensschild: keine Ueberlappung auf der Bank ----------------------
  // Lott, Pahl und Pommer sitzen nebeneinander. Gemessen wird am echten
  // Zeichenaufruf: fillText wird fuer einen Frame mitgeschrieben.
  await hin(page, 'pahl', 10);
  const bank = await page.evaluate(() => new Promise(fertig => {
    const c = document.getElementById('game').getContext('2d');
    const alt = c.fillText.bind(c), treffer = [];
    c.fillText = function(t, x, y){
      if(['Herr Lott','Herr Pahl','Herr Pommer'].indexOf(t) >= 0) treffer.push({t, x: Math.round(x), y: Math.round(y), b: this.measureText(t).width});
      return alt(t, x, y);
    };
    requestAnimationFrame(() => requestAnimationFrame(() => { c.fillText = alt; fertig(treffer); }));
  }));
  // Jeder Name wird zweimal gezeichnet (Schatten und Schrift) — auf die
  // helle Lage eindampfen, das ist die mit der groesseren y-Zahl NICHT.
  const namen = new Map();
  for(const s of bank) if(!namen.has(s.t) || s.y < namen.get(s.t).y) namen.set(s.t, s);
  const gesetzt = [...namen.values()];
  pruef('alle drei Bankschilder gezeichnet', gesetzt.length, 3);
  let ueberdeckt = 0;
  for(let i = 0; i < gesetzt.length; i++) for(let j = i+1; j < gesetzt.length; j++){
    const a = gesetzt[i], b = gesetzt[j];
    const quer = Math.abs(a.x - b.x) < (a.b + b.b) / 2;
    if(quer && Math.abs(a.y - b.y) < 6) ueberdeckt++;
  }
  pruef('kein Bankschild verdeckt ein anderes', ueberdeckt, 0);

  // --- Gespraech oeffnen ---------------------------------------------------
  await hin(page, 'zwirn');
  pruef('Kontextaktion bietet Ansprechen an', await page.evaluate(() => aktTxt), 'Ansprechen');
  await page.keyboard.press('f');
  await page.waitForTimeout(120);
  let t = await tafel(page);
  pruef('F oeffnet die Tafel', [t.offen, t.sichtbar], [true, true]);
  pruef('Tafel nennt den vollen Namen', t.name, 'Bürgermeister Alfons Zwirn');
  pruef('Tafel bietet vier Antworten', t.antworten.length, 4);
  pruef('letzte Antwort ist der Abschied', t.antworten[3], '4. Auf Wiedersehen.');
  pruef('offene Tafel setzt den Schleier', t.schleier, true);

  // --- U4: die Zweiteilung -------------------------------------------------
  // Geprueft wird nicht, wie es aussieht, sondern was die Teilung ausmacht:
  // dass es zwei Haelften gibt, dass jedes Stueck in seiner steht, dass die
  // Kante dazwischen wirklich eine Kante ist (kein Spalt, keine Ueberlappung)
  // und dass das zweite Bildfeld etwas zeigt statt schwarz zu bleiben.
  const zwei = await page.evaluate(() => {
    const o = el('gespraechOben').getBoundingClientRect();
    const u = el('gespraechUnten').getBoundingClientRect();
    const c = el('gespraechIchPortrait'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let deck = 0;
    for(let i = 3; i < d.length; i += 4) if(d[i] > 8) deck++;
    return {
      satzOben:     el('gespraechOben').contains(el('gespraechText')),
      wahlUnten:    el('gespraechUnten').contains(el('gespraechWahl')),
      untenDrunter: u.top >= o.bottom - 1 && u.top <= o.bottom + 1,
      beideHoch:    o.height > 0 && u.height > 0,
      kante:        parseFloat(getComputedStyle(el('gespraechUnten')).borderTopWidth) >= 2,
      titel:        el('gespraechIchName').textContent,
      sollTitel:    rangName(),
      ichGemalt:    deck > 200,
    };
  });
  pruef('die Tafel hat zwei Haelften mit Hoehe', zwei.beideHoch, true);
  pruef('der Satz steht in der oberen Haelfte', zwei.satzOben, true);
  pruef('die Antworten stehen in der unteren', zwei.wahlUnten, true);
  pruef('die untere Haelfte schliesst an die obere an', zwei.untenDrunter, true);
  pruef('zwischen beiden steht eine Kante', zwei.kante, true);
  pruef('unten steht die Amtsbezeichnung', zwei.titel, zwei.sollTitel);
  pruef('das zweite Portraet ist gezeichnet', zwei.ichGemalt, true);

  // --- U5: das gemalte Portraet --------------------------------------------
  // Woran man die beiden Wege auseinanderhaelt, ohne Farben zu vergleichen:
  // das gemalte Bild fuellt die Leinwand bis in die Ecken, der Sprite-
  // Ausschnitt steht mittig mit 20 Pixel Luft an drei Seiten. Die linke obere
  // Ecke ist deshalb der Unterschied: dort deckt das eine und das andere nicht.
  const gemalt = page => page.evaluate(() => {
    const c = el('gespraechPortrait'), cc = c.getContext('2d');
    const ecke = cc.getImageData(2, 2, 1, 1).data[3];
    const d = cc.getImageData(0, 0, c.width, c.height).data;
    let deck = 0;
    for(let i = 3; i < d.length; i += 4) if(d[i] > 8) deck++;
    const f = el('gespraechBild').getBoundingClientRect();
    return { ecke, deck, quadratLeinwand: c.width === c.height, leinwand: c.width,
             quadratFeld: Math.abs(f.width - f.height) < 1 };
  });
  const gz = await gemalt(page);
  pruef('das Bildfeld ist quadratisch', gz.quadratFeld, true);
  pruef('die Leinwand ist 128x128', [gz.quadratLeinwand, gz.leinwand], [true, 128]);
  pruef('Zwirn zeigt sein gemaltes Portraet', gz.ecke > 8, true);
  pruef('das gemalte Portraet fuellt das Feld', gz.deck > 128*128*0.9, true);

  // --- Tippen --------------------------------------------------------------
  const kurzNach = (await tafel(page)).text.length;
  await page.waitForTimeout(2600);
  const ganz = await page.evaluate(() => ({
    text: el('gespraechText').innerText.replace(/\s+/g,' ').trim(),
    soll: (gespraech.z1 + ' ' + gespraech.z2).trim(),
  }));
  pruef('Satz laeuft ein (erst kuerzer)', kurzNach < ganz.soll.length, true);
  pruef('Satz steht danach vollstaendig', ganz.text, ganz.soll);

  // --- Antwort per Ziffer, ohne Trank --------------------------------------
  const trankVor = await page.evaluate(() => player.potions);
  await page.keyboard.press('2');
  await page.waitForTimeout(2600);
  t = await tafel(page);
  pruef('Ziffer waehlt eine Antwort', t.text, await page.evaluate(() => gespraech.z1.trim()));
  pruef("die '1'-Reihe gibt dabei keinen Trank aus", await page.evaluate(() => player.potions), trankVor);
  pruef('Tafel bleibt dabei offen', t.offen, true);

  // --- Pfeil und Eingabe ---------------------------------------------------
  // Von einem gesetzten Anfang aus: der Griff zur '2' oben hat die Markierung
  // schon auf die zweite Zeile gelegt, sonst pruefte dieser Block eine Summe.
  await page.evaluate(() => gespraechWahlSetzen(0));
  await page.keyboard.press('ArrowDown');
  pruef('Pfeil bewegt die Auswahl', await page.evaluate(() => gespraech.wahl), 1);
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  pruef('Pfeil laeuft am Anfang um', await page.evaluate(() => gespraech.wahl), 3);
  await page.keyboard.press('ArrowDown');
  pruef('und am Ende wieder zurueck', await page.evaluate(() => gespraech.wahl), 0);

  // --- Klick daneben schliesst, ohne zu schlagen ---------------------------
  await page.evaluate(() => { window.__schlaege = 0; });
  await page.mouse.click(160, 120);
  t = await tafel(page);
  pruef('Klick neben die Tafel schliesst sie', t.offen, false);
  pruef('und fuehrt dabei keinen Angriff', t.schlaege, 0);
  pruef('Schleier wieder aus', t.schleier, false);

  // --- Esc -----------------------------------------------------------------
  await page.keyboard.press('f');
  await page.waitForTimeout(120);
  pruef('F oeffnet erneut', (await tafel(page)).offen, true);
  await page.keyboard.press('Escape');
  pruef('Esc schliesst die Tafel', (await tafel(page)).offen, false);

  // --- Abschied per Klick --------------------------------------------------
  await page.keyboard.press('f');
  await page.waitForTimeout(2600);
  await page.locator('.gwOpt').last().click();
  pruef('"Auf Wiedersehen" schliesst', (await tafel(page)).offen, false);

  // --- Weggehen ------------------------------------------------------------
  await page.keyboard.press('f');
  await page.waitForTimeout(120);
  await page.evaluate(() => { player.x += 400; camSnap(); });
  await page.waitForTimeout(200);
  pruef('wer weggeht, beendet das Gespraech', (await tafel(page)).offen, false);

  // --- U5/G10: das geteilte Doppelportraet ---------------------------------
  // Diese beiden Zeilen prueften bis U6 das Gegenteil dessen, was im Spiel
  // steht, und liefen dabei rot mit, ohne dass es jemand gelesen hat. U5 hatte
  // Lott und Pahl als Beleg fuer den Rueckfallweg genommen: ihr Motiv ist ein
  // Doppelportraet und liess sich nicht in zwei Gesichter schneiden, also
  // bekamen sie den Sprite-Ausschnitt aus U4. G10 hat das entschieden und
  // umgedreht (eine Datei, zwei Schluessel, PORTRAET_DATEI) und die Pruefung
  // nicht nachgezogen. Sie prueft jetzt, was G10 zugesagt hat: beide sehen
  // dasselbe Bild, und es ist ein gemaltes.
  //
  // Damit hat keine Figur mehr den Sprite-Ausschnitt, und die Pruefung dafuer
  // faellt hier weg statt an einer Figur zu haengen, die ihn nicht nimmt.
  // Der Weg selbst steht unveraendert in gespraechPortrait(); dass ihn niemand
  // geht, meldet gespraechAssert() beim Start ("Sprite-Ausschnitt fuer
  // niemanden").
  const bild = key => page.evaluate(async k => {
    const n = npcs.find(x => x.key === k);
    player.x = n.x + 24; player.y = n.y + 6; camSnap();
    gespraechOeffnen(n);
    return el('gespraechPortrait').toDataURL();
  }, key);
  const bLott = await bild('lott'), bPahl = await bild('pahl');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  pruef('Lott und Pahl sehen dasselbe Bild', bLott === bPahl, true);
  pruef('und es ist ein gemaltes, kein Ausschnitt', bLott.length > 2000, true);

  // --- U6: Knoeterich hat eine Tafel ---------------------------------------
  // Er ist die Figur, mit der das Spiel anfaengt, und war bis U6 die einzige,
  // die man nicht ansprechen konnte. Die Kontextaktion an seiner Kachel hiess
  // "Nachfragen", gab es erst ab dem ersten Dienstzettel und zeigte einen alten
  // Zettel noch einmal im oberen Band.
  await page.evaluate(() => { kn.history = []; player.x = KN_POS.x + 24; player.y = KN_POS.y + 6; camSnap(); });
  await page.waitForTimeout(400);
  pruef('Kontextaktion an Knoeterich heisst Ansprechen',
        await page.evaluate(() => aktTxt), 'Ansprechen');
  pruef('und sie steht auch ohne Dienstzettel da',
        await page.evaluate(() => aktObj === knNpc && kn.history.length === 0), true);
  await page.evaluate(() => fuehreAktion());
  await page.waitForTimeout(200);
  const kt = await page.evaluate(() => ({
    offen: gespraechOffen,
    name: el('gespraechNameTxt').textContent,
    antworten: [...document.querySelectorAll('.gwOpt')].map(o => o.innerText.replace(/\s+/g,' ').trim()),
    blase: knBubble.visible && gespraech.npc === knNpc,
  }));
  pruef('F oeffnet seine Tafel', kt.offen, true);
  pruef('sie nennt seinen vollen Namen', kt.name, 'Amtsrat a. D. Knöterich');
  pruef('und bietet vier Antworten', kt.antworten.length, 4);
  pruef('die zweite fragt nach dem Haus, nicht nach dem Dorf',
        kt.antworten[1].indexOf('Haus') > 0, true);
  const kg = await gemalt(page);
  pruef('sein gemaltes Portraet steht in der Tafel', kg.ecke > 8, true);
  pruef('und fuellt das Feld', kg.deck > 128*128*0.9, true);

  // Der Kreislauf: sechs Grundzeilen und die Aktzeile, keine leer, keine zweimal
  // hintereinander. Der erste Griff landet auf der Anrede (bubbleIdx startet
  // bei -1), deshalb acht Griffe fuer sieben verschiedene Zeilen.
  const kreis = [];
  for(let i = 0; i < 8; i++){
    await page.evaluate(() => { gespraechWaehlen(0); gespraechFertigTippen(); });
    kreis.push(await page.evaluate(() => el('gespraechText').innerText.replace(/\s+/g,' ').trim()));
  }
  pruef('keine Zeile im Kreislauf ist leer', kreis.every(z => z.length > 3), true);
  pruef('der Kreislauf hat sieben verschiedene Zeilen', new Set(kreis).size, 7);

  // Der Nachschlag. Er ersetzt die alte Kontextaktion und steht nur da, wenn es
  // etwas nachzuschlagen gibt.
  await page.evaluate(() => {
    kn.history = [{z1:'Notiert. Ich notiere alles.', z2:'Zweiter Reiter im Kessel.'}];
    gespraechZeichnen();
  });
  const kn5 = await page.evaluate(() =>
    [...document.querySelectorAll('.gwOpt')].map(o => o.innerText.replace(/\s+/g,' ').trim()));
  pruef('mit Dienstzettel kommt eine fuenfte Antwort dazu', kn5.length, 5);
  await page.evaluate(() => { gespraechWaehlen(3); gespraechFertigTippen(); });
  pruef('und sie spielt den Zettel in der Tafel ab',
        await page.evaluate(() => el('gespraechText').innerText.replace(/\s+/g,' ').trim()),
        'Notiert. Ich notiere alles. Zweiter Reiter im Kessel.');

  await page.evaluate(() => { player.x = KN_POS.x + 400; camSnap(); });
  await page.waitForTimeout(300);
  pruef('wer von Knoeterich weggeht, beendet auch sein Gespraech',
        await page.evaluate(() => gespraechOffen), false);

  // --- U6: das Portraet im Dienstzettel ------------------------------------
  const kopf = await page.evaluate(() => {
    const c = el('knZettelBild'), cc = c.getContext('2d');
    const d = cc.getImageData(0, 0, c.width, c.height).data;
    let deck = 0;
    for(let i = 3; i < d.length; i += 4) if(d[i] > 8) deck++;
    return { klasse: el('knZettel').classList.contains('mitBild'),
             bild: getComputedStyle(c).display,
             sinnbild: getComputedStyle(el('knZettelSinnbild')).display,
             deck };
  });
  pruef('der Dienstzettel traegt das Portraet', [kopf.klasse, kopf.bild], [true, 'block']);
  pruef('und das Sinnbild ist weg', kopf.sinnbild, 'none');
  pruef('das Bild im Zettel ist wirklich gezeichnet', kopf.deck > 128*128*0.9, true);

  // --- U6: Noergel traegt das Blatt der Gruenhaut --------------------------
  // "Exakt das Sprite der Gruenhaut" heisst zweierlei: dasselbe Blatt und
  // derselbe Massstab. Den Massstab rechnet drawMon() aus sc mal psc, DRAW_NPC
  // kennt nur einen Faktor, deshalb wird gegen das Produkt geprueft und mit
  // einer Toleranz, die die Fliesskommarechnung erlaubt (1.5*1.2 ist in
  // IEEE-754 nicht genau 1.8).
  const ng = await page.evaluate(() => {
    const n = npcs.find(x => x.key === 'noergel');
    const d = MONDEF.goblin, sg = SHEETS[d.rig + '_idle'];
    const mensch = npcs.find(x => x.key === 'zwirn');
    const sm = SHEETS[mensch.sheetIdle];
    return { blatt: n.sheetIdle, gruenhautBlatt: d.rig + '_idle',
             skala: n.figur.rigSc, gruenhautSkala: d.sc * d.psc,
             hoch: sg ? sg.fh * n.figur.rigSc : 0,
             menschHoch: sm ? sm.fh * NPC_SC : 0 };
  });
  pruef('Noergel steht auf dem Blatt der Gruenhaut', ng.blatt, ng.gruenhautBlatt);
  pruef('und in ihrem Massstab', Math.abs(ng.skala - ng.gruenhautSkala) < 0.001, true);
  pruef('und ist damit kleiner als die Menschen im Dorf', ng.hoch < ng.menschHoch, true);

  // --- Schriftregler -------------------------------------------------------
  const schrift = await page.evaluate(() => {
    const lies = () => ({
      fs: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fs')),
      px: parseFloat(getComputedStyle(document.getElementById('zone')).fontSize),
      font: NAME_FONT_NPC,
    });
    schriftSetzen(0); const a = lies();
    schriftSetzen(2); const b = lies();
    const gemerkt = localStorage.getItem('sda_schrift');
    schriftSetzen(1);
    return { a, b, gemerkt, an: [...document.querySelectorAll('.schriftBtn')].filter(x => x.classList.contains('on')).length };
  });
  pruef('Stufe "Normal" setzt --fs auf 1', schrift.a.fs, 1);
  pruef('Stufe "Groesser" setzt --fs hoeher', schrift.b.fs > schrift.a.fs, true);
  pruef('eine gemessene Schriftgroesse waechst mit', schrift.b.px > schrift.a.px, true);
  pruef('die Weltschrift waechst mit', schrift.b.font !== schrift.a.font, true);
  pruef('die Stellung wird gemerkt', schrift.gemerkt, '2');
  pruef('genau ein Knopf steht auf an', schrift.an, 1);

  pruef('Konsole still (Desktop)', laut, []);
  await ctx.close();
}

// ------------------------------------------------------------------ Touch
{
  const { page, ctx, laut } = await spiel({ viewport: { width: 390, height: 844 },
                                            deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await page.evaluate(() => document.body.classList.add('touch'));
  await hin(page, 'fass');
  await page.evaluate(() => gespraechOeffnen(npcs.find(n => n.key === 'fass')));
  await page.waitForTimeout(2600);

  const lage = await page.evaluate(() => {
    const r = el('gespraech').getBoundingClientRect();
    const f = el('attackBtn').getBoundingClientRect();
    const t = el('gespraechText');
    return { oben: r.top < 200, ueberFaecher: r.bottom < f.top,
             imBild: r.left >= -1 && r.right <= innerWidth + 1,
             kastenBreit: t.scrollWidth <= t.clientWidth + 1 };
  });
  pruef('Tafel haengt auf Mobil oben', lage.oben, true);
  pruef('Tafel laesst den Daumenfaecher frei', lage.ueberFaecher, true);
  pruef('Tafel steht waagerecht im Bild', lage.imBild, true);
  pruef('kein Wort laeuft ueber den Rand', lage.kastenBreit, true);
  // U4: auf 390px Breite kostet das zweite Portraet ein Viertel der Zeile und
  // sagt nichts, was die Zeile darueber nicht auch sagt. Die obere Haelfte
  // behaelt ihres.
  const zweiM = await page.evaluate(() => ({
    ich:  getComputedStyle(el('gespraechIchBild')).display,
    npc:  getComputedStyle(el('gespraechBild')).display,
    wahl: el('gespraechUnten').contains(el('gespraechWahl')),
  }));
  pruef('kein zweites Portraet auf Mobil', zweiM.ich, 'none');
  pruef('das erste Portraet bleibt', zweiM.npc !== 'none', true);
  pruef('die Antworten stehen auch dort unten', zweiM.wahl, true);

  await page.locator('.gwOpt').last().tap();
  pruef('Tipp auf den Abschied schliesst', await page.evaluate(() => gespraechOffen), false);

  pruef('Konsole still (Touch)', laut, []);
  await ctx.close();
}

// ------------------------------------------- U6: der enge Schirm, grosse Schrift
// Der Fall, an dem die Tafel vor U6 kippte, und er ist kein Randfall: 360x640
// ist ein verbreitetes Telefonformat, die groesste Schriftstufe ist genau fuer
// die da, die sie brauchen, und Knoeterich hat als einzige Figur fuenf
// Antworten. Zusammen brauchte die Tafel mehr Hoehe als sie bekam, und was
// wegfiel, war das Ende: die Antwortliste stand vollstaendig ausserhalb.
//
// Geprueft wird die Rangfolge, nicht die Zahl: die Antworten stehen ganz in der
// Tafel, das Satzfeld ist das Rollfeld, und die Tafel selbst rollt nicht mehr.
{
  const { page, ctx, laut } = await spiel({ viewport: { width: 360, height: 640 },
                                            deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await page.evaluate(() => { document.body.classList.add('touch'); schriftSetzen(2); });
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    player.x = KN_POS.x + 24; player.y = KN_POS.y + 6; camSnap();
    kn.history = [{z1:'Notiert. Ich notiere alles.', z2:'Zweiter Reiter im Kessel.'}];
    gespraechOeffnen(knNpc);
    gespraechFertigTippen();
  });
  await page.waitForTimeout(300);
  const eng = await page.evaluate(() => {
    const g = el('gespraech'), u = el('gespraechUnten'), t = el('gespraechText'),
          b = el('gespraechBild');
    const gr = g.getBoundingClientRect(), ur = u.getBoundingClientRect(),
          br = b.getBoundingClientRect();
    return {
      antworten: document.querySelectorAll('.gwOpt').length,
      untenGanzInDerTafel: ur.top >= gr.top - 1 && ur.bottom <= gr.bottom + 1,
      untenGanzImFenster:  ur.top >= -1 && ur.bottom <= innerHeight + 1,
      tafelRollt: g.scrollHeight > g.clientHeight + 1,
      satzIstDasRollfeld: getComputedStyle(t).overflowY,
      bildBleibtGanz: br.height >= 71,
      tafelImFenster: gr.bottom <= innerHeight + 1,
      nachgerollt: t.scrollTop > 0,
      verlaufSteht: el('gespraechRechts').classList.contains('rollt'),
    };
  });
  pruef('Knoeterich hat auf dem engen Schirm fuenf Antworten', eng.antworten, 5);
  pruef('alle Antworten stehen in der Tafel', eng.untenGanzInDerTafel, true);
  pruef('und damit im Bild', eng.untenGanzImFenster, true);
  pruef('die Tafel selbst rollt nicht', eng.tafelRollt, false);
  pruef('gerollt wird im Satzfeld', eng.satzIstDasRollfeld, 'auto');
  pruef('das Bildfeld behaelt seine Hoehe', eng.bildBleibtGanz, true);
  pruef('die Tafel bleibt im Fenster', eng.tafelImFenster, true);
  // U6: Ein Rollfeld, dem der Satz davonlaeuft, ist so gut wie keins. Das Feld
  // rollt dem Tippwerk hinterher, und dass es rollen kann, steht als Verlauf
  // ueber seiner Unterkante.
  pruef('das Satzfeld ist dem Tippwerk gefolgt', eng.nachgerollt, true);
  pruef('und zeigt an, dass da noch etwas ist', eng.verlaufSteht, true);

  pruef('Konsole still (enger Schirm)', laut, []);
  await ctx.close();
}

// ------------------------------------------------- Vordruck auf dem Telefon
// Nebenbefund aus U3, und der Grund, warum er hier steht: die groessere Schrift
// hat einen Fehlstand freigelegt, den es vorher schon gab. Der
// Einstellungsvordruck ist auf 390x844 hoeher als das Bild, und #overlay
// zentrierte ihn, ohne zu rollen — der WEITER-Knopf stand unter dem Rand, und
// das Spiel liess sich auf einem Telefon nicht starten. Geprueft mit einem
// echten Wisch, nicht mit einem gesetzten scrollTop, und auf der hoechsten
// Schriftstufe, weil dort am meisten ueberhaengt.
//
// E1 hat den Weg dorthin geaendert: startGame() zeigt seither erst den
// Empfang, der Vordruck liegt dahinter, und der Lauf klickt sich ueber
// ÜBERSPRINGEN auf Blatt 1.
//
// E2 hat die geprüfte Sache geaendert, und das ist der Grund, warum hier jetzt
// etwas anderes steht als in U3. Der Vordruck rollt nicht mehr, er blaettert:
// die Seiten werden nach gemessener Hoehe geschnitten, und keine von ihnen
// darf ueber den unteren Rand hinauslaufen. Die alte Zusage ("er ist hoeher
// als das Bild, aber ein Wisch holt den Knopf herunter") ist damit nicht
// gebrochen, sondern ueberholt: sie war die beste Antwort, solange gerollt
// wurde. Geprueft wird jetzt die staerkere Zusage, und zwar auf jeder Seite
// jedes Blattes statt nur auf der ersten.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                         deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
  await page.evaluate(() => { document.body.classList.add('touch'); schriftSetzen(2); startGame(); });
  await page.waitForTimeout(400);
  await page.evaluate(() => empfangUeberspringen());   // E1: vom Empfang auf den Vordruck
  await page.waitForTimeout(400);

  const lage = () => page.evaluate(() => {
    const o = document.getElementById('overlay');
    const b = [...document.querySelectorAll('#overlay button')].pop();
    const r = b.getBoundingClientRect();
    return { rollt: o.scrollHeight > o.clientHeight + 4,
             knopfDrin: r.top >= 0 && r.bottom <= innerHeight + 0.5 };
  });
  const erste = await lage();
  pruef('Blatt 1 Seite 1 rollt nicht', erste.rollt, false);
  pruef('ihr Knopf steht im Bild', erste.knopfDrin, true);

  // Jede Seite jedes Blattes, nicht nur die erste. Der Fehlstand, den E2
  // behoben hat, sass auf Blatt 2 und 3 und waere an Blatt 1 vorbeigelaufen.
  const seiten = await page.evaluate(() => DIENSTBLATT.map(b => dienstblattSeiten(b, 'einstellung').length));
  const ueber = [];
  for(let bl = 1; bl <= seiten.length; bl++){
    for(let se = 0; se < seiten[bl-1]; se++){
      await page.evaluate(([bl, se]) => showDienstblatt(bl, 'einstellung', se), [bl, se]);
      await page.waitForTimeout(60);
      const l = await lage();
      if(l.rollt || !l.knopfDrin) ueber.push(`Blatt ${bl} Seite ${se+1}`);
    }
  }
  pruef('keine Seite des Vordrucks laeuft ueber', ueber, []);
  pruef('der Vordruck zerfaellt in mehrere Seiten', seiten.every(n => n >= 2), true);
  await ctx.close();
}

await browser.close();
fertig = true;
bericht();
process.exit(fehl ? 1 : 0);
