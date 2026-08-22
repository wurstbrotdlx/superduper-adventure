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
  for(let i = 0; i < 12; i++){
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
// E1 hat den Weg dorthin geaendert, nicht die Sache: startGame() zeigt seither
// erst den Empfang, und der Vordruck liegt dahinter. Der Lauf klickt sich
// deshalb ueber ÜBERSPRINGEN auf Blatt 1, statt ihn wie vorher sofort
// vorzufinden. Ohne diese Zeile mass er die Anrisstafel, die auf ein Telefon
// passt, und meldete den behobenen Fehlstand als behoben, weil er ihn gar
// nicht mehr aufsuchte.
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
    return { hoeher: o.scrollHeight > o.clientHeight + 4, top: Math.round(o.scrollTop),
             knopfDrin: r.top >= 0 && r.bottom <= innerHeight };
  });
  const vor = await lage();
  pruef('Vordruck ist hoeher als das Bild', vor.hoeher, true);
  pruef('der Knopf steht anfangs unter dem Rand', vor.knopfDrin, false);

  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 720 }] });
  for(const y of [640, 540, 430, 320, 220]){
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] });
    await page.waitForTimeout(40);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(400);
  const nach = await lage();
  pruef('ein Wisch rollt den Vordruck', nach.top > vor.top, true);
  pruef('der WEITER-Knopf ist danach erreichbar', nach.knopfDrin, true);
  await ctx.close();
}

await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
