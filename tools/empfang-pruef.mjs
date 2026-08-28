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
//   Intro         vier Blaetter, einzeln weitergeklickt, nichts laeuft von
//                 selbst ab; ÜBERSPRINGEN fuehrt auf den Vordruck und nicht
//                 am Kanon vorbei. Seit AN3 sind es vier statt sieben: die
//                 drei Blaetter, die Gegenstaende beschrieben, haengen jetzt
//                 als Requisiten in der Amtsstube
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
//   Ernennung     sechs Blaetter zwischen Unterschrift und Dienstantritt, die
//                 Urkunde nennt die Amtsbezeichnung (T2). Seit AN4 endet der
//                 Anfang hier: der erste freie Schritt liegt direkt dahinter
//   Anlage 2      die Urkunde kuendigt sie an, und seit AN4 meldet sie sich
//                 erst VOR dem Haus, nach dem Schritt hinaus. Danach fuehren
//                 fuenf Blaetter sie ein, mit EINSTECKEN liegt sie in der
//                 Tasche (T3). Der Merker anlage2Wartet traegt sie ueber die
//                 Luecke und wird beim ersten Hinausgehen verbraucht (AN4)
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

let letzterSchluss = null;   // Riegel 3: die Aufschrift des zuletzt geklickten Schlussknopfes

// RIEGEL 3 (27.08.2026, AN3): Der Knopf wird am onclick gesucht und nicht mehr
// am Wortlaut. Das ist die dritte und eigentliche Antwort auf Pruefung 4 der
// INTRO-MESSUNG; Riegel 1 (Protokoll ueberlebt den Absturz) und Riegel 2 (der
// Helfer wirft mit Klartext) stehen seit A0 und bleiben, wo sie sind.
//
// Warum jetzt: AN3 fasst genau diese Knoepfe an. Der Schlussknopf des Intros
// hiess ANKLOPFEN, solange der Anfang auf schwarzem Grund lief und das Dorf
// danach aufging. Seit AN2 steht der Spieler waehrend des Anfangs IN der
// Amtsstube, angeklopft hat er also nie; AN3 benennt ihn um. Mit der alten
// Wortliste haette dieser eine Umbenennung 98 Pruefungen mitgenommen.
//
// Woran der Knopf erkennbar ist: an dem, was er TUT. Weiterknopf, LESEN und
// Schlussknopf tragen alle dasselbe onclick="szeneTafel(n)" und unterscheiden
// sich nur in der Aufschrift. Der zweite Knopf ruft szeneTafelZweiter()
// (UEBERSPRINGEN) oder szeneTafelWahlNein() (der Nein-Knopf der Scheinwahl)
// und faellt damit von selbst heraus, ohne dass eine Liste ihn ausschliessen
// muss. Genau daran ist die alte Fassung zweimal fast gescheitert: erst am
// unverankerten /LESEN/i, das "Nicht lesen" mittraf, dann an der Frage, ob
// UEBERSPRINGEN der letzte Knopf im Panel ist.
//
// Wo ein Stapel aufhoert, sagt die Maschine selbst: szeneTafel(i) wird auf
// Blatt i-1 gezeichnet, das letzte Blatt traegt also n === liste.length. Der
// Parameter `ende` ist damit fuer die Navigation NICHT mehr tragend -- er
// steht noch als Erwartung in der Fehlermeldung und wird an der Aufrufstelle
// mit einem eigenen pruef() belegt. Der Unterschied ist der Zweck des Riegels:
// eine Umbenennung macht ab jetzt EINE Pruefung rot, statt den Lauf zu toeten.
//
// Dazu die zweite Haelfte, die A0 als Punkt 3 verlangt hat: nach jedem Klick
// wird nachgesehen, dass sich die Lage wirklich bewegt hat. Ein Knopf, der da
// ist und nichts tut, sah bisher aus wie ein Knopf, der weiterblaettert.
async function durchDenStapel(page, ende){
  let tafeln = 0;
  for(let i = 0; i < 14; i++){
    const r = await page.evaluate(() => {
      if(document.getElementById('overlay').style.display !== 'flex') return {lage:'zu'};
      const knoepfe = [...document.querySelectorAll('#ovPanel button')];
      let b = null, n = -1;
      for(const x of knoepfe){
        const m = /^\s*szeneTafel\((\d+)\)\s*$/.exec(x.getAttribute('onclick') || '');
        if(m){ b = x; n = +m[1]; break; }
      }
      if(!b) return {lage:'kein-knopf',
                     da: knoepfe.map(x => `${x.textContent.trim()} [${x.getAttribute('onclick') || 'ohne onclick'}]`)};
      const gesamt = (typeof szeneTafelLauf !== 'undefined' && szeneTafelLauf)
                     ? szeneTafelLauf.liste.length : -1;
      if(gesamt < 0) return {lage:'kein-lauf'};
      const txt = b.textContent.trim();
      b.click();
      return {lage: n >= gesamt ? 'ende' : 'weiter', n, gesamt, txt};
    });
    if(r.lage === 'zu') break;
    if(r.lage === 'kein-knopf')
      throw new Error(`durchDenStapel: die Tafel steht, aber kein Knopf ruft szeneTafel(n). `
        + `Auf der Tafel steht ${JSON.stringify(r.da)}. Nach ${tafeln} Blatt/Blaettern, `
        + `erwartet war zuletzt "${ende}". Wer die Zeichenstelle umgebaut hat, `
        + `aendert dieses Muster mit -- die Aufschrift allein traegt hier nichts mehr.`);
    if(r.lage === 'kein-lauf')
      throw new Error(`durchDenStapel: die Tafel steht, aber szeneTafelLauf ist leer. `
        + `Nach ${tafeln} Blatt/Blaettern, erwartet war zuletzt "${ende}". `
        + `Ein Blatt ohne Aufsteller kann seine Blattzahl nicht kennen.`);
    tafeln++;
    await page.waitForTimeout(220);
    letzterSchluss = r.txt;
    if(r.lage === 'ende') break;
    // Hat der Klick die Lage bewegt? Ein Knopf, der steht und nichts tut, ist
    // von einem, der weiterblaettert, sonst nicht zu unterscheiden.
    const jetzt = await page.evaluate(() => {
      if(document.getElementById('overlay').style.display !== 'flex') return {zu:true};
      for(const x of document.querySelectorAll('#ovPanel button')){
        const m = /^\s*szeneTafel\((\d+)\)\s*$/.exec(x.getAttribute('onclick') || '');
        if(m) return {zu:false, n:+m[1]};
      }
      return {zu:false, n:-1};
    });
    if(!jetzt.zu && jetzt.n === r.n)
      throw new Error(`durchDenStapel: der Klick auf Blatt ${r.n} von ${r.gesamt} `
        + `("${r.txt}") hat die Tafel nicht bewegt, sie steht danach auf derselben Blattzahl. `
        + `Nach ${tafeln} Blatt/Blaettern.`);
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
  // AN2: Die Buehne ist der Raum. Hier stand bis dahin, dass introBuehne steht
  // und das Dorf verdeckt -- beides war die schwarze Flaeche aus E2. Der
  // Empfang spielt jetzt in der Amtsstube, und E2s Bedingung ("die Tafel ist
  // das Einzige im Bild") wird nicht aufgegeben, sondern anders eingeloest:
  // der Raum STEHT STILL. Geprueft wird deshalb dasselbe Versprechen an der
  // neuen Stelle, und zwar strenger als vorher -- eine schwarze Flaeche konnte
  // nur da sein, ein stillstehender Raum muss vier Dinge zugleich einhalten.
  pruef('die Amtsstube ist die Buehne', await page.evaluate(() => innen && innen.key), 'amt');
  pruef('das Dorf ist nicht im Bild', await page.evaluate(() => currentLevel), 4);
  pruef('und Knoeterich steht darin', await page.evaluate(() => npcs.map(n => n.key)), ['knoeterich']);
  pruef('der Raum steht still', await page.evaluate(() => state), 'szene');
  pruef('Knoeterich nennt zuerst seinen Namen',
        (await gesagt(page)).includes('Knöterich'), true);
  const beats = await durchDieVorstellung(page);
  pruef('die Vorstellung hat sechs Zuege', beats, 6);

  // Waehrend der Tafeln, nicht danach: mit der letzten faellt die Buehne, und
  // eine Messung hinterher haette genau das nicht gesehen.
  pruef('die Amtsstube traegt auch die Tafeln',
        await page.evaluate(() => (innen && innen.key) + '/' + state), 'amt/szene');
  // SZ1: Die fuenf Anrisstafeln aus E1 sind durch die neun Introblaetter aus
  // weltgeschichte.md ersetzt. Das sind die beiden einzigen Zusagen dieses
  // Laufs, die sich dadurch geaendert haben, und beide beschreiben Inhalt, der
  // absichtlich ausgetauscht wurde. Die uebrigen 57 stehen unveraendert und
  // sind damit der Beweis, dass der Anfang den Umbau der Maschine ueberlebt hat.
  pruef('das erste Introblatt steht', await page.evaluate(() =>
        el('ovPanel').textContent.includes('aus dem Fluss')), true);

  // AN3 (27.08.2026): vier statt sieben. T5d hatte auf sieben erhoeht, weil
  // der Anfang seither Kapitel 0 bis 5 der Weltbibel traegt; drei dieser
  // Blaetter beschrieben aber Gegenstaende, die es im Raum gibt -- die Karte
  // (Kapitel 3), die Tafel ueber der Tuer (Kapitel 1) und das Formular
  // (Kapitel 5). Solange der Anfang auf schwarzem Grund lief, MUSSTE der Text
  // sie aussprechen; seit AN2 haengen sie da. Sie sind nicht gestrichen,
  // sondern umgezogen, und was hier steht, ist die Chronik und nur sie.
  const tafeln = await durchDenAnriss(page);
  pruef('das Intro hat vier Blaetter', tafeln, 4);
  // Riegel 3: die Aufschrift des Schlussknopfes wird geprueft und nicht mehr
  // zum Finden benutzt. Wer sie aendert, macht ab jetzt genau DIESE Zeile rot,
  // statt den Lauf vor seiner ersten Pruefung sterben zu lassen. AN3 ist genau
  // dieser Fall: ANKLOPFEN hiess er, solange man vor dem Haus stand.
  pruef('und sein Schlussknopf heisst ZUR SACHE', letzterSchluss, 'ZUR SACHE');
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
  const ernennung = await durchDenStapel(page, 'ÜBERNEHMEN');
  pruef('die Ernennung hat sechs Blaetter', ernennung, 6);
  pruef('die Urkunde nennt die Amtsbezeichnung', await page.evaluate(() =>
        ERNENNUNG_URKUNDE().some(z => z.includes(rangNameVon(0)))), true);
  // T3: die Urkunde kuendigt ihre Anlage an, eine Tafel bevor die Anlage
  // spricht. Zwirn liest die Zeile laut vor wie jede andere.
  pruef('die Urkunde nennt ihre Anlage', await page.evaluate(() =>
        ERNENNUNG_URKUNDE().some(z => /Anlagen: eine/.test(z))), true);

  // AN4: Hier stand die Erwartung, dass vor dem Dienst noch ein Stapel steht.
  // Seit AN4 steht dort keiner mehr: die Ernennung endet, wo der Rechtsakt
  // endet, und der Dienst faengt an. Aus einer Zusage werden fuenf, und jede
  // einzelne davon war vorher in dem einen 'flex' mitversteckt.
  pruef('nach der Ernennung laeuft der Dienst', await page.evaluate(() => state), 'play');
  pruef('und kein Stapel steht mehr davor', await page.evaluate(() =>
        document.getElementById('overlay').style.display), 'none');
  pruef('der Spieler steht dabei in der Amtsstube', await page.evaluate(() => innen && innen.key), 'amt');
  pruef('Anlage 2 ist noch nicht in der Tasche', await page.evaluate(() => kn.flags.anlage2Da), false);
  pruef('sie wartet aber an der Urkunde', await page.evaluate(() => kn.flags.anlage2Wartet), true);

  // AN4: Der erste freie Schritt ist der Schritt hinaus (AN2), und erst
  // dahinter meldet sich die Anlage 2. Damit stimmt ihr erster Satz wieder
  // woertlich: "Sie stehen zum ersten Mal vor dem Haus statt darin."
  const schritt1 = await hinaus(page);
  pruef('der erste freie Schritt heisst "Hinausgehen"', schritt1.txt, 'Hinausgehen');
  pruef('und er ist der Weg aus dem Haus', schritt1.hausaus, true);
  pruef('danach steht der Spieler draussen', await page.evaluate(() => innen), null);
  pruef('und dort meldet sich die Anlage 2', await page.evaluate(() =>
        document.getElementById('overlay').style.display), 'flex');
  pruef('der Merker ist damit verbraucht', await page.evaluate(() => kn.flags.anlage2Wartet), false);
  // T6: sechs statt fuenf, weil die Scheinwahl hinter dem Auftakt dazugekommen
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

  // AN4: Genau einmal. Ein Merker, der erst im Abschluss des Stapels
  // verbraucht wuerde, liesse den Erstkontakt bei jedem weiteren Hinausgehen
  // wiederkommen, sobald ein Spieler den Stapel einmal nicht zu Ende blaettert.
  // Geprueft wird am zweiten Weg durch dieselbe Tuer.
  pruef('ein zweiter Gang durch die Tuer wiederholt nichts', await page.evaluate(() => {
    const h = INN_HAEUSER.find(x => x.raum.key === 'amt');
    betreteHaus(h);
    for(let i = 0; i < 30; i++) update(1/60);
    aktSperre = 0;
    for(let i = 0; i < 10; i++) update(1/60);
    fuehreAktion();
    return document.getElementById('overlay').style.display;
  }), 'none');

  // AN4: Und der Auslöser haengt an fuehreAktion() und nicht an
  // verlasseHaus(). Sonst zoege ein Schichtende aus der Amtsstube heraus den
  // Stapel aus einem Reset-Pfad, und ein Tod im Haus ebenso. Geprueft mit
  // gesetztem Merker, damit die Zusage etwas wert ist.
  pruef('ein Schichtende aus dem Haus loest sie nicht aus', await page.evaluate(() => {
    kn.flags.anlage2Wartet = true;
    const h = INN_HAEUSER.find(x => x.raum.key === 'amt');
    betreteHaus(h);
    startShift();                       // ruft verlasseHaus() von innen
    const auf = document.getElementById('overlay').style.display === 'flex';
    kn.flags.anlage2Wartet = false; saveKn();
    return auf;
  }), false);

  pruef('Konsole still (Desktop)', laut, []);
  await ctx.close();
}

// AN4: Der Schritt vor die Tuer, so wie ein Spieler ihn geht.
//
// Erst muss die Uhr laufen: scanAktion() steigt aus, solange aktSperre steht,
// und dienstAntritt() setzt sie auf eine halbe Sekunde. Sechzig Rahmen sind
// eine ganze und damit sicher darueber. Ausgeloest wird ueber fuehreAktion(),
// also ueber die Taste -- nicht ueber verlasseHaus(). Die uebrigen Laeufe
// rufen verlasseHaus() direkt, weil sie nur schnell ins Dorf wollen; dieser
// hier prueft den Weg selbst und darf ihn deshalb nicht abkuerzen.
//
// Gibt zurueck, WAS angeboten wurde, damit die Zusage aus AN2 ("der erste freie
// Schritt ist der Schritt hinaus") am Angebot geprueft wird und nicht daran,
// dass hinterher zufaellig etwas passiert ist.
async function hinaus(page){
  const angebot = await page.evaluate(() => {
    for(let i = 0; i < 60; i++) update(1/60);
    return { art: aktArt, txt: aktTxt, hausaus: aktArt === AKT_HAUSAUS };
  });
  if(angebot.hausaus) await page.evaluate(() => fuehreAktion());
  await page.waitForTimeout(300);
  return angebot;
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
  // AN4: und sie wartet auch nicht an der Tuer. Der Merker wird am Ende der
  // Ernennung gesetzt, und die hat dieser Weg nie gesehen -- der Schritt aus
  // dem Haus bleibt hier also stumm, und der Rucksack unten holt nach wie vor
  // alles nach.
  pruef('sie wartet auch nicht an der Tuer', await page.evaluate(() => kn.flags.anlage2Wartet), false);
  pruef('der Schritt hinaus bleibt auf diesem Weg stumm', await page.evaluate(() => {
    const h = INN_HAEUSER.find(x => x.raum.key === 'amt');
    if(!innen) betreteHaus(h);
    for(let i = 0; i < 30; i++) update(1/60);
    aktSperre = 0;
    for(let i = 0; i < 10; i++) update(1/60);
    fuehreAktion();
    return document.getElementById('overlay').style.display;
  }), 'none');
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

// ------------------------------------------- T6: die Entscheidung, die keine ist
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
  // RIEGEL: der Rueckgabewert wurde hier weggeworfen, und damit fehlte genau die
  // Pruefung, die an den vier anderen Aufrufstellen einen stehengebliebenen
  // Stapel rot macht. Ein Helfer, der null Blaetter blaettert, kam hier
  // ungestraft durch.
  pruef('die Ernennung blaettert auch auf diesem Weg sechs Blaetter',
        await durchDenStapel(page, 'ÜBERNEHMEN'), 6);
  // AN4: und auch dieser Block muss jetzt erst vor die Tuer. Vorher stand die
  // Wahl unmittelbar hinter der Ernennung; ohne diesen Schritt greift der
  // Klick unten in ein leeres Panel und der ganze Lauf stirbt mit einem
  // TypeError, samt der zwanzig Pruefungen der Bloecke danach.
  pruef('auch hier fuehrt der erste freie Schritt hinaus', (await hinaus(page)).hausaus, true);

  // Blatt I ist ihr Auftakt. Er hat noch keine Wahl, sondern nur WEITER.
  const auftakt = await tafel();
  pruef('der Auftakt traegt noch keine Wahl', auftakt.knoepfe, ['WEITER']);
  await page.evaluate(() => [...document.querySelectorAll('#ovPanel button')]
    .find(x => /^\s*szeneTafel\(\d+\)\s*$/.test(x.getAttribute('onclick') || '')).click());
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
  // RIEGEL: auch hier fiel der Rueckgabewert weg. Der Lauf steht auf Blatt III
  // von VI, es bleiben also vier Blaetter bis EINSTECKEN.
  pruef('von Blatt III bis EINSTECKEN sind es vier Blaetter',
        await durchDenStapel(page, 'EINSTECKEN'), 4);
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
  // Riegel 3: der zweite Knopf ruft szeneTafelZweiter(). Seine Aufschrift
  // wird gleich darunter geprueft statt zum Finden benutzt.
  const zweiter = await page.evaluate(() => {
    const b = [...document.querySelectorAll('#ovPanel button')]
      .find(x => /^\s*szeneTafelZweiter\(\)\s*$/.test(x.getAttribute('onclick') || ''));
    if(!b) return null;
    const t = b.textContent.trim(); b.click(); return t;
  });
  pruef('der zweite Knopf der Anrisstafel heisst UEBERSPRINGEN', zweiter, 'ÜBERSPRINGEN');
  await page.waitForTimeout(500);
  pruef('ÜBERSPRINGEN fuehrt auf den Vordruck',
        (await page.textContent('#ovPanel')).includes('EINSTELLUNGSVERFÜGUNG'), true);
  pruef('und beendet die Szene', await page.evaluate(() => empfangAktiv), false);
  // E2: Hier ist der Empfang noch nicht gelaufen, der Vordruck gehoert also
  // noch zum Anfang. Seit AN2 heisst das nicht mehr "schwarz bleibt schwarz",
  // sondern "der Raum bleibt stehen": die Amtsstube traegt auch diesen
  // Vordruck, das HUD bleibt weg, und beides endet erst mit der Unterschrift.
  pruef('die Amtsstube traegt auch den uebersprungenen Vordruck',
        await page.evaluate(() => (innen && innen.key) + '/' + state), 'amt/szene');
  pruef('das HUD bleibt dabei weg',
        await page.evaluate(() => getComputedStyle(el('hud')).display), 'none');

  // AN5: DAS AUFFANGBECKEN. Genau dieser Weg ist der Grund, aus dem es gebaut
  // wurde: wer hier UEBERSPRINGEN drueckt, hat neun von zehn Blaettern des
  // Anfangs nie gesehen. Vor AN5 waren sie damit weg.
  pruef('vor dem Dienst steht der Bestand nicht in der Kladde',
        await page.evaluate(() => anfangBestandBlock()), '');
  pruef('genau das erste Introblatt ist aufgeschlagen worden',
        await page.evaluate(() => Object.keys(kladde.anfang)), ['intro:0']);

  await page.evaluate(() => { kn.seen.einstellung = true; saveKn(); showStartScreen(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => startGame());
  await page.waitForTimeout(1500);
  pruef('der zweite Dienstantritt zeigt keinen Empfang',
        await page.evaluate(() => state === 'play' && !empfangAktiv), true);

  // AN5: und jetzt liegt es in der Kladde, im Akten-Reiter, mit Zaehler.
  pruef('der Anfang steht mit neun Ungelesenen in der Kladde',
        await page.evaluate(() => ({ gelesen: anfangGelesenZahl(), ungelesen: anfangUngelesen() })),
        { gelesen: 1, ungelesen: 9 });
  await page.evaluate(() => { if(!kesselOpen) toggleKessel(); switchKesselTab('blaetter'); });
  await page.waitForTimeout(250);
  pruef('der Akten-Reiter fuehrt DER ANFANG',
        await page.evaluate(() => el('blaetterBox').textContent.includes('DER ANFANG')), true);
  pruef('und zaehlt die gelesenen Blaetter',
        await page.evaluate(() => (el('blaetterBox').textContent.match(/\d+ von \d+ Blättern gelesen/) || [''])[0]),
        '1 von 10 Blättern gelesen');
  // Der Zaehler steht AM REITER, damit man ihn sieht, ohne dort zu sein.
  pruef('der Ungelesen-Zaehler steht am Reiter',
        await page.evaluate(() => el('aktenUngelesen').textContent.trim()), '9');
  pruef('jedes Blatt des Anfangs ist von hier aus aufschlagbar',
        await page.evaluate(() => document.querySelectorAll('#blaetterBox [onclick^="anfangAufschlagen"]').length), 10);
  pruef('die Dienstanweisung bekommt einen Verweis statt eines Lesers',
        await page.evaluate(() => el('blaetterBox').textContent.includes('Dienstanweisung liegt am Pult')), true);

  // Ein ungelesenes Blatt aufschlagen. Dasselbe Muster wie ein Requisit aus
  // AN3: derselbe Tafelstapel, ein Blatt lang, "Blatt I von I".
  await page.evaluate(() => anfangAufschlagen('ernennung', 2));
  await page.waitForTimeout(350);
  pruef('das Kesselfenster macht dem Stapel Platz',
        await page.evaluate(() => ({ kessel: kesselOpen, stapel: szeneTafelLauf && szeneTafelLauf.liste.length })),
        { kessel: false, stapel: 1 });
  pruef('und es steht als Blatt I von I da',
        await page.evaluate(() => (document.querySelector('#ovPanel .amtFuss') || {}).textContent), 'Blatt I von I');
  pruef('der Knopf fuehrt zurueck', await page.evaluate(() =>
        [...document.querySelectorAll('#ovPanel button')].map(b => b.textContent.trim())), ['ZURÜCK']);
  pruef('aufgeschlagen heisst gelesen', await page.evaluate(() => anfangGelesenZahl()), 2);
  await page.evaluate(() => [...document.querySelectorAll('#ovPanel button')]
    .find(x => /^\s*szeneTafel\(\d+\)\s*$/.test(x.getAttribute('onclick') || '')).click());
  await page.waitForTimeout(350);
  pruef('ZURUECK fuehrt in den Akten-Reiter zurueck',
        await page.evaluate(() => ({ kessel: kesselOpen, tab: kesselTab, state,
                                     overlay: el('overlay').style.display })),
        { kessel: true, tab: 'blaetter', state: 'play', overlay: 'none' });
  pruef('und der Zaehler steht eins tiefer',
        await page.evaluate(() => el('aktenUngelesen').textContent.trim()), '8');

  // Alles gelesen heisst kein Zaehler. Ein Zaehler, der auf null stehen bleibt,
  // ist eine Mahnung ohne Anlass.
  await page.evaluate(() => {
    for(const e of ANFANG_BESTAND) for(let i = 0; i < e.liste().length; i++) anfangGelesen(e.key + ':' + i);
    switchKesselTab('blaetter');
  });
  await page.waitForTimeout(200);
  pruef('ist alles gelesen, steht am Reiter nichts',
        await page.evaluate(() => el('aktenUngelesen').textContent.trim()), '');
  pruef('und die Zaehlzeile ist voll',
        await page.evaluate(() => (el('blaetterBox').textContent.match(/\d+ von \d+ Blättern gelesen/) || [''])[0]),
        '10 von 10 Blättern gelesen');
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
    const b = [...document.querySelectorAll('#ovPanel button')]
      .find(x => /^\s*szeneTafel\(\d+\)\s*$/.test(x.getAttribute('onclick') || ''));
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
  // T6: gemessen wird der echte Stapel samt Wahl, und die fuenf Stufen werden
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
fertig = true;
bericht();
process.exit(fehl ? 1 : 0);
