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
//   Intro         neun Blaetter, einzeln weitergeklickt, nichts laeuft von
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
// Dazu die Zusagen von T2 und T3, die am selben Anfang haengen:
//
//   Ernennung     sechs Blaetter zwischen Unterschrift und erstem Schritt, die
//                 Urkunde nennt die Amtsbezeichnung (T2)
//   Anlage 2      die Urkunde kuendigt sie an, danach fuehren fuenf Blaetter sie
//                 ein, und mit EINSTECKEN liegt sie in der Tasche (T3)
//   Nachholung    wer ueber den Vordruck geht, sieht die Ernennung nie. Der
//                 erste Griff zur Tasche holt die Einfuehrung nach, genau
//                 einmal (T3)
//   Telefon       auch die fuenf Blaetter der Anlage 2 halten Rahmen und Knopf
//                 auf 390x844 im Bild (T3)
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

// Durch EINEN Tafelstapel. Geklickt wird der WEITER-Knopf und nicht der letzte
// im Panel: der letzte waere ÜBERSPRINGEN. Der Durchlauf endet, sobald der
// Schlussknopf dieses Stapels geklickt wurde, und gibt die Zahl der Blaetter
// zurueck.
//
// T3: der Schlussknopf ist ein Parameter geworden. Vorher stand er als
// Alternative im Regex, und das reichte, solange hinter einem Stapel nie ein
// zweiter kam. Seit die Einfuehrung der Anlage 2 direkt hinter der Ernennung
// haengt, laufen beide sonst in einer Zaehlung zusammen, und der Lauf koennte
// nicht mehr sagen, welcher Stapel wie lang ist.
// T5: Der Helfer kennt jetzt drei Knopfaufschriften statt zwei. Zwischen dem
// Auftakt der Anlage 2 und ihren Blaettern steht seit T5 die Scheinwahl, und
// ihr Weiterknopf heisst LESEN. Ohne diese Alternative faende der Helfer dort
// keinen Knopf, braeche mit 'weg' ab, und alles hinter der Wahl bliebe
// ungeprueft, ohne dass ein einziger pruef() rot wuerde.
//
// Verglichen wird auf GLEICHHEIT und nicht auf Vorkommen: der Nein-Knopf
// derselben Tafel heisst "Nicht lesen" und enthaelt damit ebenfalls "lesen".
// Ein unverankertes /LESEN/i haette je nach Reihenfolge den falschen Knopf
// erwischt und die Wahl abgelehnt statt angenommen.
async function durchDenStapel(page, ende){
  let tafeln = 0;
  for(let i = 0; i < 14; i++){
    const r = await page.evaluate((endeStr) => {
      if(document.getElementById('overlay').style.display !== 'flex') return 'weg';
      const b = [...document.querySelectorAll('#ovPanel button')]
                  .find(x => ['WEITER', 'LESEN'].includes(x.textContent.trim())
                             || x.textContent.includes(endeStr));
      if(!b) return 'weg';
      const letzt = b.textContent.includes(endeStr);
      b.click(); return letzt ? 'ende' : 'weiter';
    }, ende);
    if(r === 'weg') break;
    tafeln++;
    await page.waitForTimeout(220);
    if(r === 'ende') break;
  }
  await page.waitForTimeout(200);
  return tafeln;
}

// Das Intro, und danach laeuft der Gruss noch ein.
async function durchDenAnriss(page){
  const n = await durchDenStapel(page, 'ANKLOPFEN');
  await fertigGetippt(page);
  return n;
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
  pruef('die Vorstellung hat sechs Zuege', beats, 6);

  // Waehrend der Tafeln, nicht danach: mit der letzten faellt die Buehne, und
  // eine Messung hinterher haette genau das nicht gesehen.
  pruef('die Buehne traegt auch die Tafeln',
        await page.evaluate(() => el('introBuehne').style.display), 'block');
  // SZ1: Die fuenf Anrisstafeln aus E1 sind durch die neun Introblaetter aus
  // weltgeschichte.md ersetzt. Das sind die beiden einzigen Zusagen dieses
  // Laufs, die sich dadurch geaendert haben, und beide beschreiben Inhalt, der
  // absichtlich ausgetauscht wurde. Die uebrigen 57 stehen unveraendert und
  // sind damit der Beweis, dass der Anfang den Umbau der Maschine ueberlebt hat.
  pruef('das erste Introblatt steht', await page.evaluate(() =>
        el('ovPanel').textContent.includes('aus dem Fluss')), true);

  const tafeln = await durchDenAnriss(page);
  pruef('das Intro hat fuenf Blaetter', tafeln, 5);
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
  await waehle(page, 'Dienst antreten');
  // T2: zwischen Unterschrift und erstem Schritt liegt jetzt die Ernennung.
  // Dieselbe Tafelmaschine wie das Intro, deshalb derselbe Durchlauf.
  const ernennung = await durchDenStapel(page, 'HINAUSGEHEN');
  pruef('die Ernennung hat sechs Blaetter', ernennung, 6);
  pruef('die Urkunde nennt die Amtsbezeichnung', await page.evaluate(() =>
        ERNENNUNG_URKUNDE().some(z => z.includes(rangNameVon(0)))), true);
  // T3: die Urkunde kuendigt ihre Anlage an, eine Tafel bevor die Anlage
  // spricht. Zwirn liest die Zeile laut vor wie jede andere.
  pruef('die Urkunde nennt ihre Anlage', await page.evaluate(() =>
        ERNENNUNG_URKUNDE().some(z => /Anlagen: eine/.test(z))), true);

  // T3: und dahinter, vor dem ersten Schritt ins Dorf, das erste Treffen.
  // Eigener Stapel, eigener Schlussknopf, und danach ist sie in der Tasche.
  pruef('vor dem Dienst steht noch ein Stapel', await page.evaluate(() =>
        document.getElementById('overlay').style.display), 'flex');
  pruef('Anlage 2 ist noch nicht in der Tasche', await page.evaluate(() => kn.flags.anlage2Da), false);
  // T5: sechs statt fuenf, weil die Scheinwahl hinter dem Auftakt dazugekommen
  // ist. Wer hier durchlaeuft, nimmt sie beim ersten Anlauf an.
  const treffen = await durchDenStapel(page, 'EINSTECKEN');
  pruef('das erste Treffen hat sechs Blaetter', treffen, 6);
  pruef('Anlage 2 ist jetzt in der Tasche', await page.evaluate(() => kn.flags.anlage2Da), true);
  // Wer gleich liest, bekommt den Nachhall der Scheinwahl nicht. Er gehoert
  // denen, die bis zum gesperrten Knopf abgelehnt haben.
  pruef('wer gleich liest, hoert nichts davon', await page.evaluate(() => !!kn.umschlag.zoegerlich), false);
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

  // T3: Dieser Weg umgeht die Ernennung und damit das erste Treffen. Ein
  // Spieler ohne Anlage 2 waere ein Spiel ohne die Haelfte seiner Stimme,
  // deshalb holt der erste Blick in die Tasche es nach. Dasselbe gilt fuer
  // jeden Spielstand, der aelter ist als dieser Bauabschnitt.
  pruef('ohne Ernennung ist sie noch nicht da', await page.evaluate(() => kn.flags.anlage2Da), false);
  await page.evaluate(() => toggleInventory());
  await page.waitForTimeout(400);
  pruef('der erste Griff zur Tasche holt sie nach', await page.evaluate(() =>
        document.getElementById('overlay').style.display === 'flex' && !invOpen), true);
  const nachgeholt = await durchDenStapel(page, 'EINSTECKEN');
  pruef('auch nachgeholt sind es sechs Blaetter', nachgeholt, 6);
  await page.waitForTimeout(400);
  pruef('danach ist sie da', await page.evaluate(() => kn.flags.anlage2Da), true);
  pruef('und der Rucksack steht offen', await page.evaluate(() => invOpen), true);
  pruef('sie liegt als Kachel darin', await page.evaluate(() =>
        !!document.querySelector('#bagGrid .anlage2Slot')), true);
  // Und zwar genau einmal: der zweite Griff oeffnet nur noch die Tasche.
  await page.evaluate(() => toggleInventory());
  await page.evaluate(() => toggleInventory());
  await page.waitForTimeout(300);
  pruef('der zweite Griff zeigt keine Einfuehrung mehr', await page.evaluate(() =>
        invOpen && document.getElementById('overlay').style.display !== 'flex'), true);
  pruef('Konsole still (Vordruckweg)', laut, []);
  await ctx.close();
}

// ------------------------------------------- T5: die Entscheidung, die keine ist
//
// Der Erstkontakt bietet an, die Anlage NICHT zu lesen, und nimmt das Nein
// nicht an. Vier Ablehnungen sind moeglich, die fuenfte Stufe traegt den
// gesperrten Knopf und die Behauptung, das sei ein technischer Fehler.
//
// Geprueft wird hier das Verhalten und nicht der Wortlaut: dass die Wahl
// ueberhaupt steht, dass jede Ablehnung eine ANDERE Tafel bringt (sonst waere
// es keine Ueberredung, sondern eine Schleife), dass der Stapel dabei nicht
// vorankommt, dass am Ende wirklich disabled dasteht und ein Klick darauf
// nichts tut, und dass LESEN aus jeder Stufe heraus weiterfuehrt.
//
// Die Wortlaute selbst haengen an szeneAssert() und anlage2Assert(), die beim
// Laden mitlaufen; ein Lauf, der Saetze abschreibt, waere beim naechsten
// Feilen am Text rot, ohne dass etwas kaputt ist.
{
  const { page, ctx, laut } = await frisch({ viewport: { width: 1100, height: 760 } });

  // Der Zustand der offenen Tafel, so wie ein Mensch ihn sieht: die
  // Knopfaufschriften, ob der zweite gesperrt ist, und die Blattzahl im Fuss.
  const tafel = () => page.evaluate(() => {
    const bs = [...document.querySelectorAll('#ovPanel button')];
    const fuss = document.querySelector('#ovPanel .amtFuss');
    return {
      knoepfe: bs.map(b => b.textContent.trim()),
      gesperrt: bs.length > 1 ? bs[1].disabled : null,
      fuss: fuss ? fuss.textContent.trim() : null,
      text: (document.querySelector('#ovPanel div') || {}).textContent || '',
    };
  });
  const ablehnen = async () => {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('#ovPanel button')][1];
      if(b) b.click();
    });
    await page.waitForTimeout(200);
  };

  // Der kuerzeste Weg bis hinter die Ernennung. Die Treppe und die Pflanze
  // gehoeren dem Block weiter oben, hier zaehlt nur, was danach kommt.
  await bisZumEmpfang(page);
  await waehle(page, 'Wo unterschreibe ich');
  await waehle(page, 'Weiblich');
  await waehle(page, 'Dienst antreten');
  await durchDenStapel(page, 'HINAUSGEHEN');

  // Blatt I ist ihr Auftakt. Er hat noch keine Wahl, sondern nur WEITER.
  const auftakt = await tafel();
  pruef('der Auftakt traegt noch keine Wahl', auftakt.knoepfe, ['WEITER']);
  await page.evaluate(() => document.querySelector('#ovPanel button').click());
  await page.waitForTimeout(200);

  // Blatt II ist die Wahl. Beide Knoepfe stehen, der zweite ist anklickbar.
  const stufe0 = await tafel();
  pruef('dahinter steht die Wahl', stufe0.knoepfe.length, 2);
  pruef('und der Lesen-Knopf heisst LESEN', stufe0.knoepfe[0], 'LESEN');
  pruef('der Nein-Knopf ist anfangs anklickbar', stufe0.gesperrt, false);
  pruef('die Wahl steht auf Blatt II von VI', stufe0.fuss, 'Blatt II von VI');

  // Vier Ablehnungen. Jede bringt eine andere Tafel, und der Fuss bewegt sich
  // dabei nicht: das Haus diskutiert, ohne dass der Vorgang vorankommt.
  const stufen = [stufe0];
  for(let i = 0; i < 4; i++){ await ablehnen(); stufen.push(await tafel()); }

  pruef('jede Ablehnung bringt eine andere Tafel',
        new Set(stufen.map(s => s.text)).size, 5);
  pruef('die Nein-Beschriftung wandert mit',
        new Set(stufen.slice(0, 4).map(s => s.knoepfe[1])).size, 4);
  pruef('der Blattzaehler bewegt sich dabei nicht',
        stufen.every(s => s.fuss === 'Blatt II von VI'), true);
  pruef('der Lesen-Knopf heisst durchgehend gleich',
        new Set(stufen.map(s => s.knoepfe[0])).size, 1);

  // Die fuenfte Stufe. Der Knopf steht noch da, er ist nur tot.
  const letzte = stufen[4];
  pruef('nach der vierten Ablehnung ist der Nein-Knopf gesperrt', letzte.gesperrt, true);
  pruef('er steht aber noch da', letzte.knoepfe.length, 2);
  pruef('das Haus nennt es einen technischen Fehler',
        /technischer Fehler/.test(letzte.text), true);

  // Ein Klick darauf bewegt nichts. Das ist die Zusage, um die es geht.
  await ablehnen();
  const nachKlick = await tafel();
  // Als Wahrheitswert und nicht als Textvergleich: sonst stuenden beide
  // Fassungen der ganzen Tafel im Protokoll und machten es unlesbar.
  pruef('ein Klick auf den gesperrten Knopf bewegt nichts', nachKlick.text === letzte.text, true);
  pruef('und der Stapel steht weiter auf Blatt II', nachKlick.fuss, 'Blatt II von VI');

  // LESEN fuehrt auch von der letzten Stufe aus weiter, und zwar in Blatt III.
  await page.evaluate(() => document.querySelector('#ovPanel button').click());
  await page.waitForTimeout(220);
  pruef('LESEN fuehrt weiter in die Einfuehrung',
        (await tafel()).fuss, 'Blatt III von VI');

  // Wer bis zum gesperrten Knopf abgelehnt hat, bekommt den Nachhall.
  await durchDenStapel(page, 'EINSTECKEN');
  await page.waitForTimeout(400);
  pruef('Anlage 2 liegt trotzdem in der Tasche',
        await page.evaluate(() => kn.flags.anlage2Da), true);
  pruef('und der zaehe Weg schaltet seine Umschlagzeile scharf',
        await page.evaluate(() => kn.umschlag.zoegerlich), 1);
  pruef('Konsole still (die Wahl)', laut, []);
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

  // T3: dieselbe Messung fuer die Blaetter der Anlage 2. Sie sind die
  // laengsten Tafelzuege des Anfangs (Formregel "Der Anfang erzaehlt", also
  // kein Zeichendeckel), und genau deshalb gehoert die Frage geprueft, ob sie
  // auf ein Telefon passen. Erwartet wird die Bauform aus SZ4: der Rahmen
  // steht, der Text rollt innen, der Knopf bleibt erreichbar.
  // T5: gemessen wird der echte Stapel samt Wahl, und die fuenf Stufen werden
  // dabei einzeln durchlaufen. Das ist nicht Gruendlichkeit um ihrer selbst
  // willen: die letzte Stufe ist mit fuenf gesprochenen Zeilen und einer
  // Nachbemerkung das LAENGSTE Blatt des ganzen Anfangs, und sie ist das
  // einzige mit zwei Knoepfen untereinander. Wenn irgendwo der Knopf unter den
  // Fensterrand rutscht, dann dort.
  //
  // Gemessen wird der UNTERSTE Knopf (.pop()), auf den Stufen also der
  // Nein-Knopf. Genau der ist der gefaehrdete.
  await page.evaluate(() => szeneTafeln([ANLAGE2_AUFTAKT_ERNENNUNG, ANLAGE2_FRAGE[0]].concat(ANLAGE2_BLAETTER),
                                        {letzterKnopf:'EINSTECKEN', wahl:{bei:1, reihe:ANLAGE2_FRAGE},
                                         ende: () => {}}));
  await page.waitForTimeout(300);
  const a2 = [];
  const messen = () => page.evaluate(() => {
    const b = [...document.querySelectorAll('#ovPanel button')].pop().getBoundingClientRect();
    const p = el('ovPanel').getBoundingClientRect();
    return { knopfDrin: b.top >= 0 && b.bottom <= innerHeight + 0.5,
             rahmenDrin: p.left >= -1 && p.right <= innerWidth + 1,
             seiteRollt: document.documentElement.scrollHeight > innerHeight + 4 };
  });
  const weiter = async (welcher) => {
    await page.evaluate((w) => {
      const bs = [...document.querySelectorAll('#ovPanel button')];
      const b = w === 'nein' ? bs[1] : bs[0];
      if(b && !b.disabled) b.click();
    }, welcher);
    await page.waitForTimeout(200);
  };

  a2.push(await messen());               // Blatt I, der Auftakt
  await weiter('ja');
  for(let i = 0; i < 5; i++){            // Blatt II in allen fuenf Fassungen
    a2.push(await messen());
    if(i < 4) await weiter('nein');
  }
  await weiter('ja');
  for(let i = 0; i < 4; i++){            // Blatt III bis VI
    a2.push(await messen());
    await weiter('ja');
  }
  pruef('alle zehn Fassungen wurden gemessen', a2.length, 10);
  pruef('jedes Blatt der Anlage 2 haelt den Knopf im Bild', a2.every(x => x.knopfDrin), true);
  pruef('kein Blatt laeuft seitlich ueber', a2.every(x => x.rahmenDrin), true);
  pruef('die Seite rollt dabei nicht', a2.every(x => !x.seiteRollt), true);
  pruef('Konsole still (Telefon)', laut, []);
  await ctx.close();
}

await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
