// Pruefprotokoll zu den Bauabschnitten E1 und E2
// (phase-e1-empfang.md, phase-e2-staatsakt.md).
//
//   python3 serve.py &
//   node tools/empfang-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium, wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// Geprueft wird, was E1 zugesagt hat, im echten Browser statt in einer
// Behauptung:
//
//   Vorstellung   Knoeterich nennt zuerst seinen Namen, auf schwarzem Grund
//                 und vor den Tafeln (E2)
//   Buehne        das Dorf ist waehrend des ganzen Anfangs verdeckt und steht
//                 erst wieder da, wenn der Empfang beginnt (E2)
//   Anriss        fuenf Tafeln, einzeln weitergeklickt, nichts laeuft von
//                 selbst ab; ÜBERSPRINGEN fuehrt auf den Vordruck und nicht
//                 am Kanon vorbei
//   Vordruck      blaettert statt zu rollen, keine Seite laeuft ueber (E2)
//   Szene         oeffnet in der U3-Tafel, nennt Knoeterich, zeichnet sein
//                 Portraet und bietet vier Antworten
//   ein Ausgang   Esc, das Kreuz und ein Klick daneben schliessen den Empfang
//                 NICHT. Er endet nur ueber die Unterschrift.
//   Treppe        eine Nachfrage steht erst auf der Tafel, wenn ihre Frage
//                 gestellt wurde, und die Pflanze erst nach der dritten
//   Anrede        die Wahl aus der Szene steht danach im Feld auf Blatt 1
//   beide Enden   Unterschrift direkt und Unterschrift ueber den Vordruck
//                 landen beide in state 'play' mit kn.seen.einstellung
//   HUD           ist waehrend der Szene weg und danach wieder da
//   einmalig      der zweite Dienstantritt zeigt keinen Empfang mehr
//   Telefon       Tafel und Antwortliste stehen auf 390x844 im Bild
//
// Wie menue-pruef.mjs und gespraech-pruef.mjs stellt dieser Lauf fest statt zu
// messen: jede Zeile ist ein Soll-Ist-Vergleich, Exit-Code 1 bei der ersten
// Abweichung.
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

// Ein frisches Spiel bis zum Startbild. localStorage wird geleert, sonst haette
// der zweite Kontext eines Laufs kn.seen.einstellung schon stehen und saehe den
// Empfang nie.
async function frisch(ctxOpt){
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
  await page.evaluate(() => { try{ localStorage.clear(); }catch(e){} });
  await page.waitForTimeout(300);
  return { page, ctx, laut };
}

const antworten = page => page.$$eval('.gwOpt', ns => ns.map(n => n.textContent.trim().replace(/^\d+\./, '')));
const gesagt    = page => page.$eval('#gespraechText', n => n.textContent.trim());

// Warten, bis der Satz fertig getippt ist, statt eine Zeit zu raten.
//
// Das ist kein Schoenheitsfehler, sondern war ein echter Wackler in diesem
// Lauf: die laengste Zeile des Empfangs hat 87 Zeichen, GESPRAECH_TEMPO ist 55
// Anschlaege je Sekunde, macht 1,6 Sekunden. Eine feste Wartezeit von 1,5
// Sekunden lag knapp darunter, und ein Tastendruck ins laufende Tippwerk
// waehlt nach der U3-Regel nichts aus, sondern holt den Satz nur zu Ende. Der
// Lauf griff danach auf eine Tafel, die noch die alte war, und fiel je nach
// Zufall mit einer Ausnahme oder mit fuenf Abweichungen aus. Gemessen statt
// gewartet gibt es den Zustand nicht mehr.
const fertigGetippt = page => page.waitForFunction(
  () => !gespraechOffen || gespraech.tipp >= gespraech.z1.length + gespraech.z2.length,
  null, { timeout: 15000 });

// Eine Antwort ueber ihre Beschriftung waehlen, so wie ein Mensch es tut.
async function waehle(page, teil){
  await fertigGetippt(page);
  const l = await antworten(page);
  const i = l.findIndex(t => t.includes(teil));
  if(i < 0) throw new Error(`Antwort "${teil}" steht nicht auf der Tafel: ${JSON.stringify(l)}`);
  await page.keyboard.press(String(i + 1));
  await page.waitForTimeout(120);
  await fertigGetippt(page);
}

// Den Anfang starten. Danach steht die Vorstellung, nicht das Overlay.
async function starteAnfang(page){
  await page.evaluate(() => startGame());
  await page.waitForTimeout(350);
  await fertigGetippt(page);
}

// Durch die Vorstellung. Jeder Knoten hat genau eine Antwort, gedrueckt wird
// die 1, gewartet wird auf das Tippwerk. Setzt voraus, dass der Anfang laeuft.
async function durchDieVorstellung(page){
  let beats = 0;
  for(let i = 0; i < 12; i++){
    const drin = await page.evaluate(() => empfangAktiv && gespraechOffen);
    if(!drin) break;
    await page.keyboard.press('1');
    await page.waitForTimeout(120);
    await fertigGetippt(page);
    beats++;
    if(await page.evaluate(() => el('overlay').style.display === 'flex')) break;
  }
  return beats;
}

// Durch die Anrisstafeln bis in die Szene. Geklickt wird der WEITER-Knopf und
// nicht der letzte im Panel: der letzte waere ÜBERSPRINGEN.
async function durchDenAnriss(page){
  let tafeln = 0;
  for(let i = 0; i < 12; i++){
    const weiter = await page.evaluate(() => {
      if(document.getElementById('overlay').style.display !== 'flex') return false;
      const b = [...document.querySelectorAll('#ovPanel button')]
                  .find(x => /WEITER|ANKLOPFEN/.test(x.textContent));
      if(!b) return false;
      b.click(); return true;
    });
    if(!weiter) break;
    tafeln++;
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(200);
  await fertigGetippt(page);          // der Gruss laeuft noch ein
  return tafeln;
}

// Der ganze Anfang am Stueck, bis die Gespraechstafel des Empfangs steht.
async function bisZumEmpfang(page){
  await starteAnfang(page);
  await durchDieVorstellung(page);
  return await durchDenAnriss(page);
}

// ------------------------------------------------------------- Anriss und Szene
{
  const { page, ctx, laut } = await frisch({ viewport: { width: 1100, height: 760 } });

  // E2: zuerst der Mann, dann seine Geschichte.
  await starteAnfang(page);
  pruef('der Anfang beginnt in der Tafel, nicht im Overlay',
        await page.evaluate(() => gespraechOffen && el('overlay').style.display !== 'flex'), true);
  pruef('die Buehne steht', await page.evaluate(() => el('introBuehne').style.display), 'block');
  pruef('das Dorf ist verdeckt', await page.evaluate(() =>
        getComputedStyle(el('introBuehne')).backgroundColor !== 'rgba(0, 0, 0, 0)'), true);
  pruef('Knoeterich nennt zuerst seinen Namen',
        (await gesagt(page)).includes('Knöterich'), true);
  const beats = await durchDieVorstellung(page);
  pruef('die Vorstellung hat fuenf Zuege', beats, 5);

  // Waehrend der Tafeln, nicht danach: mit der letzten faellt die Buehne, und
  // eine Messung hinterher haette genau das nicht gesehen.
  pruef('die Buehne traegt auch die Tafeln',
        await page.evaluate(() => el('introBuehne').style.display), 'block');
  pruef('die erste Tafel steht', await page.evaluate(() =>
        el('ovPanel').textContent.includes('VIERHUNDERT')), true);

  const tafeln = await durchDenAnriss(page);
  pruef('der Anriss hat fuenf Tafeln', tafeln, 5);
  pruef('danach ist das Overlay weg', await page.evaluate(() => el('overlay').style.display), 'none');
  pruef('und die Buehne faellt fuer den Empfang',
        await page.evaluate(() => el('introBuehne').style.display), 'none');
  pruef('die Tafel steht', await page.evaluate(() => el('gespraech').style.display), 'block');
  pruef('sie nennt Knoeterich', await page.$eval('#gespraechNameTxt', n => n.textContent), 'Amtsrat a. D. Knöterich');
  pruef('das Portraet ist gezeichnet', await page.evaluate(() => {
    const c = el('gespraechPortrait'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    for(let i = 3; i < d.length; i += 4) if(d[i] > 0) return true;
    return false;
  }), true);
  pruef('vier Antworten', (await antworten(page)).length, 4);
  pruef('die Unterschrift steht als letzte', (await antworten(page)).pop(), 'Wo unterschreibe ich?');
  pruef('das Kreuz ist weggenommen', await page.evaluate(() => el('gespraechZu').style.display), 'none');
  pruef('das HUD ist weg', await page.evaluate(() => getComputedStyle(el('hud')).display), 'none');

  // Der Empfang hat genau einen Ausgang.
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  pruef('Esc schliesst den Empfang nicht', await page.evaluate(() => gespraechOffen && empfangAktiv), true);
  await page.evaluate(() => gespraechSchliessen());
  pruef('gespraechSchliessen() prallt ab', await page.evaluate(() => gespraechOffen && empfangAktiv), true);
  await page.mouse.click(60, 60); await page.waitForTimeout(250);
  pruef('ein Klick daneben schliesst nicht', await page.evaluate(() => gespraechOffen && empfangAktiv), true);

  // Die Treppe: erst die Frage, dann ihre Nachfrage.
  pruef('die Nachfrage steht noch nicht da',
        (await antworten(page)).some(t => t.includes('Ich bin nur einen Tag')), false);
  await waehle(page, 'Warum nicht hinsetzen');
  pruef('jetzt steht sie da',
        (await antworten(page)).some(t => t.includes('Ich bin nur einen Tag')), true);
  pruef('die gestellte Frage ist von der Tafel',
        (await antworten(page)).some(t => t.includes('Warum nicht hinsetzen')), false);

  // Die Pflanze kommt erst nach der dritten Frage.
  pruef('die Pflanze steht nach einer Frage nicht da',
        (await antworten(page)).some(t => t.includes('Pflanze')), false);
  await waehle(page, 'Ich bin nur einen Tag');
  await waehle(page, 'Dann fragen wir die Leitung');
  pruef('nach drei Fragen steht sie da',
        (await antworten(page)).some(t => t.includes('Pflanze')), true);
  await waehle(page, 'Die Pflanze dort');
  pruef('und ihre Nachfrage folgt',
        (await antworten(page)).some(t => t.includes('Wer sitzt an dem Tisch')), true);

  // Anrede und Unterschrift.
  await waehle(page, 'Wo unterschreibe ich');
  pruef('der Empfang fragt die Anrede', (await gesagt(page)).includes('Wie soll das Haus Sie anschreiben'), true);
  pruef('drei Lesarten stehen zur Wahl', (await antworten(page)).length, 3);
  await waehle(page, 'Weiblich');
  pruef('die Angabe ist uebernommen', await page.evaluate(() => amt.gestalt), 'w');
  await waehle(page, 'Unterschreiben');
  await waehle(page, 'Dienst antreten');
  await page.waitForTimeout(1500);
  pruef('das Spiel laeuft', await page.evaluate(() => state), 'play');
  pruef('die Einstellung ist vermerkt', await page.evaluate(() => kn.seen.einstellung), true);
  pruef('die Szene ist beendet', await page.evaluate(() => empfangAktiv || gespraechOffen), false);
  pruef('das HUD ist wieder da', await page.evaluate(() => getComputedStyle(el('hud')).display !== 'none'), true);
  pruef('das Kreuz ist wieder da', await page.evaluate(() => el('gespraechZu').style.display), '');
  pruef('Konsole still (Desktop)', laut, []);
  await ctx.close();
}

// ------------------------------------------------- der Weg ueber den Vordruck
{
  const { page, ctx, laut } = await frisch({ viewport: { width: 1100, height: 760 } });
  await bisZumEmpfang(page);
  await waehle(page, 'Wo unterschreibe ich');
  await waehle(page, 'Männlich');
  await waehle(page, 'Erst den Vordruck');
  await page.waitForTimeout(500);
  const blatt = await page.textContent('#ovPanel');
  pruef('der Vordruck steht', blatt.includes('EINSTELLUNGSVERFÜGUNG'), true);
  // E2: Die Anrede steht als zehntes Feld und liegt seit dem Blaettern nicht
  // mehr auf derselben Seite wie die Ueberschrift. Gesucht wird deshalb ueber
  // alle Seiten von Blatt 1 statt nur auf der ersten.
  pruef('die Anrede aus der Szene steht im Feld', await page.evaluate(() => {
    const n = dienstblattSeiten(DIENSTBLATT[0], 'einstellung').length;
    for(let i = 0; i < n; i++){
      showDienstblatt(1, 'einstellung', i);
      if(el('ovPanel').textContent.includes('männlich gelesen')) return true;
    }
    return false;
  }), true);
  pruef('die Szene ist dabei beendet', await page.evaluate(() => empfangAktiv || gespraechOffen), false);
  // Dieser Weg fuehrt aus dem Empfang heraus, und dort steht das Dorf schon:
  // die Buehne ist mit dem Empfang gefallen und kommt nicht zurueck. Schwarz
  // bleibt es nur auf dem anderen Weg, ÜBERSPRINGEN vor dem Empfang.
  pruef('die Buehne bleibt gefallen',
        await page.evaluate(() => el('introBuehne').style.display), 'none');
  pruef('das HUD bleibt bis zur Unterschrift weg',
        await page.evaluate(() => getComputedStyle(el('hud')).display), 'none');
  pruef('der Vordruck blaettert statt zu rollen', await page.evaluate(() => {
    const b = [...document.querySelectorAll('#overlay button')].pop().getBoundingClientRect();
    return !(el('overlay').scrollHeight > el('overlay').clientHeight + 4) && b.bottom <= innerHeight + 0.5;
  }), true);
  pruef('Blatt 1 hat mehrere Seiten',
        await page.evaluate(() => dienstblattSeiten(DIENSTBLATT[0], 'einstellung').length >= 2), true);
  // E2: UNTERSCHREIBEN steht auf der LETZTEN Seite des letzten Blattes, nicht
  // mehr auf dem Blatt als Ganzem.
  await page.evaluate(() => {
    const n = dienstblattSeiten(DIENSTBLATT[DIENSTBLATT_ANZ-1], 'einstellung').length;
    showDienstblatt(DIENSTBLATT_ANZ, 'einstellung', n - 1);
  });
  await page.waitForTimeout(300);
  pruef('die letzte Seite bietet UNTERSCHREIBEN',
        (await page.$$eval('#ovPanel button', ns => ns.map(n => n.textContent.trim()))).includes('UNTERSCHREIBEN'), true);
  pruef('eine Seite davor steht WEITER', await page.evaluate(() => {
    const n = dienstblattSeiten(DIENSTBLATT[DIENSTBLATT_ANZ-1], 'einstellung').length;
    showDienstblatt(DIENSTBLATT_ANZ, 'einstellung', n - 2);
    return [...document.querySelectorAll('#ovPanel button')].some(b => b.textContent.trim() === 'WEITER');
  }), true);
  await page.evaluate(() => {
    const n = dienstblattSeiten(DIENSTBLATT[DIENSTBLATT_ANZ-1], 'einstellung').length;
    showDienstblatt(DIENSTBLATT_ANZ, 'einstellung', n - 1);
  });
  await page.evaluate(() => dienstAntritt());
  await page.waitForTimeout(1200);
  pruef('auch dieser Weg startet den Dienst', await page.evaluate(() => state), 'play');
  pruef('mit der Unterschrift faellt die Buehne',
        await page.evaluate(() => el('introBuehne').style.display), 'none');
  pruef('und das HUD ist wieder da',
        await page.evaluate(() => getComputedStyle(el('hud')).display !== 'none'), true);
  pruef('Konsole still (Vordruckweg)', laut, []);
  await ctx.close();
}

// --------------------------------------------------- ueberspringen und einmalig
{
  const { page, ctx } = await frisch({ viewport: { width: 1100, height: 760 } });
  await starteAnfang(page);
  await durchDieVorstellung(page);          // E2: ÜBERSPRINGEN steht erst auf den Tafeln
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    [...document.querySelectorAll('#ovPanel button')].find(b => /ÜBERSPRINGEN/.test(b.textContent)).click();
  });
  await page.waitForTimeout(500);
  pruef('ÜBERSPRINGEN fuehrt auf den Vordruck',
        (await page.textContent('#ovPanel')).includes('EINSTELLUNGSVERFÜGUNG'), true);
  pruef('und beendet die Szene', await page.evaluate(() => empfangAktiv), false);
  // E2: Hier ist der Empfang noch nicht gelaufen, der Vordruck gehoert also
  // noch zum Anfang: schwarz bleibt schwarz, das HUD bleibt weg, und beides
  // endet erst mit der Unterschrift.
  pruef('die Buehne traegt auch den uebersprungenen Vordruck',
        await page.evaluate(() => el('introBuehne').style.display), 'block');
  pruef('das HUD bleibt dabei weg',
        await page.evaluate(() => getComputedStyle(el('hud')).display), 'none');

  await page.evaluate(() => { kn.seen.einstellung = true; saveKn(); showStartScreen(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => startGame());
  await page.waitForTimeout(1500);
  pruef('der zweite Dienstantritt zeigt keinen Empfang',
        await page.evaluate(() => state === 'play' && !empfangAktiv), true);
  await ctx.close();
}

// ------------------------------------------------------------------- Telefon
// Der Anriss ist neu und damit auch die Frage, ob er auf ein Telefon passt.
// Auf der hoechsten Schriftstufe geprueft, weil dort am meisten ueberhaengt,
// und mit derselben Messung wie beim Vordruck in gespraech-pruef.mjs.
{
  const { page, ctx, laut } = await frisch({ viewport: { width: 390, height: 844 },
                                             deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await page.evaluate(() => { document.body.classList.add('touch'); schriftSetzen(2); });
  await starteAnfang(page);
  pruef('die Vorstellung steht auf dem Telefon im Bild', await page.evaluate(() => {
    const t = el('gespraech').getBoundingClientRect();
    return t.left >= -1 && t.right <= innerWidth + 1 && t.bottom <= innerHeight + 1;
  }), true);
  await durchDieVorstellung(page);
  await page.waitForTimeout(200);
  pruef('die Anrisstafel passt ins Bild', await page.evaluate(() => {
    const b = [...document.querySelectorAll('#ovPanel button')].find(x => /WEITER/.test(x.textContent));
    const r = b.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= innerHeight;
  }), true);
  await durchDenAnriss(page);
  const lage = await page.evaluate(() => {
    const t = el('gespraech').getBoundingClientRect();
    const zeilen = [...document.querySelectorAll('.gwOpt')].map(n => n.getBoundingClientRect());
    return { drin: t.left >= 0 && t.right <= innerWidth && t.top >= 0 && t.bottom <= innerHeight,
             zeilenDrin: zeilen.every(r => r.right <= innerWidth + 1),
             anzahl: zeilen.length };
  });
  pruef('die Tafel steht auf dem Telefon im Bild', lage.drin, true);
  pruef('keine Antwort laeuft ueber den Rand', lage.zeilenDrin, true);
  pruef('vier Antworten auch dort', lage.anzahl, 4);
  pruef('Konsole still (Telefon)', laut, []);
  await ctx.close();
}

await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
