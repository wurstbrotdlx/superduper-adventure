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
// Wie menue-pruef.mjs stellt dieser Lauf fest statt zu messen: jede Zeile ist
// ein Soll-Ist-Vergleich, der Exit-Code ist 1 bei der ersten Abweichung.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

const zeilen = [];
let fehl = 0;
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

  // --- U5: der Rueckfallweg ------------------------------------------------
  // Lott und Pahl teilen sich ein Doppelportraet und haben deshalb keins. Sie
  // sind der Beleg, dass der Weg aus U4 nicht abgebaut, sondern nur ueber-
  // holt wurde: kein Bild, kein Fehler, sondern der Sprite-Ausschnitt wie
  // bisher — mittig im Quadrat und mit freien Ecken.
  await hin(page, 'lott');
  await page.keyboard.press('f');
  await page.waitForTimeout(300);
  const gl = await gemalt(page);
  pruef('Lott bekommt den Sprite-Ausschnitt', gl.ecke <= 8, true);
  pruef('und der zeigt trotzdem etwas', gl.deck > 200, true);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);

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
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
