// Pruefprotokoll zu Bauabschnitt T3 (phase-t3-anlage2.md).
//
//   python3 serve.py &
//   node tools/anlage2-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// Geprueft wird, was Anlage 2 im laufenden Spiel tut. Was sie IST, prueft
// anlage2Assert() beim Start (Brandmauer, Pools, Gates, Blattform), und der
// Anfang mit ihrer Einfuehrung steht in tools/empfang-pruef.mjs. Hier geht es
// um das, was danach kommt und was kein anderer Lauf anfasst:
//
//   Kachel        sie liegt im Rucksack, sie belegt kein Fach, und der Zaehler
//                 "X von 24 Faechern belegt" bleibt davon unberuehrt
//   fest          Rechtsklick nimmt sie nicht weg. Sie ist danach noch da
//   Sprueche      der Bewegungsversuch antwortet, DER REIHE NACH und nicht
//                 zufaellig, jeder Versuch mit einem anderen Spruch, und die
//                 Reihe ueberlebt einen Neustart
//   Ringschluss   wer die Reihe durchhat, bekommt die letzten drei im Kreis und
//                 nie wieder den amtlichen Anfang
//   Gespraech     ein Klick oeffnet ihren Baum, der Rucksack geht dabei zu, das
//                 Portraet steht in der Tafel, der Ausgang schliesst sauber
//   Kanal         ihre Notiz erscheint im Band, mit ihrer Marke und nicht mit
//                 Knoeterichs, und sie schweigt, solange sie nicht da ist
//   Regler        auf "Dienstlich" schweigt sie, auf "Gespraechig" redet sie
//   Bank          letzterAnlass wird weiter gesetzt, sonst verstummt der Chor
//                 auf der Bank (W3) und Langvorgang Hintermuehl haengt
//
// Wie die uebrigen Laeufe stellt dieser fest statt zu messen: jede Zeile ist
// ein Soll-Ist-Vergleich, Exit-Code 1 bei der ersten Abweichung.
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

// Dieselben Hilfen wie in empfang-pruef.mjs und gespraech-pruef.mjs: gewartet
// wird auf den Tippzustand und nicht auf eine geratene Zeitspanne, und die
// laufende Nummer vor einer Antwortzeile gehoert zur Darstellung und nicht zum
// Text.
const fertigGetippt = page => page.waitForFunction(
  () => !gespraechOffen || gespraech.tipp >= gespraech.z1.length + gespraech.z2.length,
  null, { timeout: 15000 });

const antworten = page => page.$$eval('.gwOpt', ns =>
  ns.map(n => n.querySelector('span:last-child').textContent.trim()));

async function waehle(page, teil){
  await fertigGetippt(page);
  const l = await antworten(page);
  const i = l.findIndex(t => t.includes(teil));
  if(i < 0) throw new Error(`Antwort "${teil}" steht nicht auf der Tafel: ${JSON.stringify(l)}`);
  await page.keyboard.press(String(i + 1));
  await page.waitForTimeout(150);
  await fertigGetippt(page);
}

// Direkt in den Dienst, mit Anlage 2 in der Tasche. Der Weg durch den Anfang
// steht in empfang-pruef.mjs und wird hier nicht ein zweites Mal geklickt:
// dieser Lauf prueft, was NACH dem Anfang gilt.
async function imDienst(page){
  await page.evaluate(() => {
    startGame();
    empfangUeberspringen();
    dienstAntritt();
    kn.flags.anlage2Da = true; saveKn();
  });
  await page.waitForTimeout(600);
}

// ------------------------------------------------------ Kachel und Bewegung
{
  const { page, ctx, laut } = await frisch({ viewport: { width: 1100, height: 760 } });
  await imDienst(page);
  await page.evaluate(() => toggleInventory());
  await page.waitForTimeout(300);

  pruef('sie liegt als Kachel im Rucksack', await page.evaluate(() =>
        !!document.querySelector('#bagGrid .anlage2Slot')), true);
  pruef('sie steht vor den Faechern', await page.evaluate(() =>
        document.querySelector('#bagGrid').firstElementChild.classList.contains('anlage2Slot')), true);
  // Sie haengt an der Urkunde und nicht in einem Fach: der Zaehler zaehlt
  // weiter vierundzwanzig, und player.bag ist unberuehrt.
  pruef('sie belegt kein Fach', await page.evaluate(() =>
        el('tascheZahl').innerText), '0 von 24 Fächern belegt');
  pruef('sie steht in keinem bag-Eintrag', await page.evaluate(() =>
        player.bag.some(x => x && x.anlage2)), false);
  pruef('das Raster hat ein Feld mehr als Faecher', await page.evaluate(() =>
        document.querySelectorAll('#bagGrid > div').length), 25);

  // Der Bewegungsversuch. Rechtsklick ist im Spiel das Wegwerfen.
  const spruch = async () => {
    await page.evaluate(() => {
      const k = document.querySelector('#bagGrid .anlage2Slot');
      k.dispatchEvent(new MouseEvent('contextmenu', {bubbles:true, cancelable:true}));
    });
    await page.waitForTimeout(120);
    return await page.evaluate(() => document.querySelector('#bagGrid .anlage2Slot .a2Spruch').innerText);
  };
  const s1 = await spruch(), s2 = await spruch(), s3 = await spruch();
  pruef('der erste Versuch bekommt einen Spruch', s1.length > 0, true);
  pruef('der zweite einen anderen', s2 !== s1, true);
  pruef('der dritte wieder einen anderen', s3 !== s2 && s3 !== s1, true);
  pruef('und zwar der Reihe nach', await page.evaluate(() =>
        [ANLAGE2_BEWEGUNG[0], ANLAGE2_BEWEGUNG[1], ANLAGE2_BEWEGUNG[2]]), [s1, s2, s3]);
  pruef('der Spruch steht sichtbar in der Kachel', await page.evaluate(() =>
        document.querySelector('#bagGrid .anlage2Slot').classList.contains('zeigt')), true);
  pruef('sie ist danach immer noch da', await page.evaluate(() =>
        kn.flags.anlage2Da && !!document.querySelector('#bagGrid .anlage2Slot')), true);
  pruef('und nichts liegt auf dem Boden', await page.evaluate(() =>
        drops.some(d => d.item && d.item.anlage2)), false);
  pruef('der Zaehler steht auf drei', await page.evaluate(() => kn.counters.anlage2Zug), 3);

  // Ziehen ist derselbe Versuch. Ohne die Sperre schleifte der Browser ein
  // Geisterbild mit, und ein Blatt, das man wegziehen kann, obwohl es haengt,
  // waere die falsche Auskunft.
  const gezogen = await page.evaluate(() => {
    const k = document.querySelector('#bagGrid .anlage2Slot');
    const e = new Event('dragstart', {bubbles:true, cancelable:true});
    k.dispatchEvent(e);
    return e.defaultPrevented;
  });
  pruef('Ziehen wird abgefangen', gezogen, true);

  // Der Ringschluss. Wer die Reihe durchhat, faengt nicht wieder amtlich an.
  const ring = await page.evaluate(() => {
    const n = ANLAGE2_BEWEGUNG.length;
    kn.counters.anlage2Zug = 0;
    const alle = [];
    for(let i = 0; i < n + 6; i++) alle.push(anlage2Bewegung());
    return { erste: alle.slice(0, n), danach: alle.slice(n),
             letzteDrei: ANLAGE2_BEWEGUNG.slice(-3) };
  });
  pruef('die Reihe laeuft einmal ganz durch', ring.erste, await page.evaluate(() => ANLAGE2_BEWEGUNG));
  pruef('danach kommen nur noch die letzten drei',
        ring.danach.every(z => ring.letzteDrei.includes(z)), true);
  pruef('der amtliche Anfang kommt nie wieder',
        ring.danach.includes(ring.erste[0]), false);

  pruef('Konsole still (Rucksack)', laut, []);
  await ctx.close();
}

// ------------------------------------------------ die Reihe ueberlebt den Tag
// Der Zaehler steht in kn.counters und damit im Spielstand. Waere er eine
// Sitzungsvariable, finge die Vertrautheit jeden Morgen von vorne an.
{
  const { page, ctx } = await frisch({ viewport: { width: 1100, height: 760 } });
  await imDienst(page);
  await page.evaluate(() => { kn.counters.anlage2Zug = 4; saveKn(); });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
  await page.waitForTimeout(400);
  pruef('der Zaehler ueberlebt einen Neustart', await page.evaluate(() => kn.counters.anlage2Zug), 4);
  pruef('und sie ist immer noch beigefuegt', await page.evaluate(() => kn.flags.anlage2Da), true);
  pruef('der naechste Spruch ist der fuenfte', await page.evaluate(() =>
        anlage2Bewegung()), await page.evaluate(() => ANLAGE2_BEWEGUNG[4]));
  await ctx.close();
}

// ------------------------------------------------------------- das Gespraech
{
  const { page, ctx, laut } = await frisch({ viewport: { width: 1100, height: 760 } });
  await imDienst(page);
  await page.evaluate(() => toggleInventory());
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelector('#bagGrid .anlage2Slot').click());
  await page.waitForTimeout(500);

  pruef('der Klick oeffnet ihren Baum', await page.evaluate(() => szeneAktiv), 'baumAnlage2');
  pruef('der Rucksack geht dabei zu', await page.evaluate(() => invOpen), false);
  pruef('die Tafel steht', await page.evaluate(() => gespraechOffen), true);
  pruef('ihr Name steht im Schild', await page.$eval('#gespraechNameTxt', n => n.textContent), 'Anlage 2');
  // Das gemalte Portraet, an gezaehlten Pixeln und nicht an einer Behauptung.
  // Sie ist die einzige Figur ohne Sprite: faellt das Bild aus, bleibt das
  // Feld dunkel, und niemand saehe, mit wem er redet.
  pruef('ihr Portraet ist gezeichnet', await page.evaluate(() => {
    const c = el('gespraechPortrait'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let voll = 0;
    for(let i = 3; i < d.length; i += 4) if(d[i] > 8) voll++;
    return voll > 500;
  }), true);
  await fertigGetippt(page);
  const opts = await antworten(page);
  pruef('die Antwortliste ist vierzeilig', opts.length, 4);
  pruef('die letzte Zeile ist der Ausgang', opts[opts.length - 1], 'Auf Wiedersehen.');

  // Eine Kaskade, und dass sie zurueck in den Hub faellt. Genau eine Option
  // ist Vorschrift: eine Kaskade ist ein Monolog mit Einverstaendnis und keine
  // Verzweigung (T1).
  await waehle(page, 'Erzählen Sie vom Haus');
  pruef('eine Kaskade bietet genau einen Weiterweg', (await antworten(page)).length, 1);
  await waehle(page, 'Fünf für ein Ministerium');
  pruef('und danach wieder genau einen', (await antworten(page)).length, 1);
  await waehle(page, 'Und das geht');
  // Am Ende einer Kaskade steht ein Knoten ohne opts. Er behaelt seinen Namen,
  // und szeneOptionen() baut die Hub-Liste: die offenen Fragen plus Ausgang.
  // Das ist die Bauform aus SZ1, und geprueft gehoert die Liste und nicht der
  // Name, denn die Liste ist es, die der Spieler sieht.
  const zurueck = await antworten(page);
  pruef('danach steht die Hub-Liste wieder', zurueck[zurueck.length - 1], 'Auf Wiedersehen.');
  pruef('und die gestellte Frage ist verbraucht',
        zurueck.some(t => t.includes('Erzählen Sie vom Haus')), false);

  await waehle(page, 'Auf Wiedersehen');
  await page.waitForTimeout(400);
  pruef('der Ausgang schliesst den Baum', await page.evaluate(() => szeneAktiv), null);
  pruef('und das Spiel laeuft weiter', await page.evaluate(() => state), 'play');
  // Ein Baum setzt keinen Merker und ist wiederbetretbar (F1d).
  await page.evaluate(() => toggleInventory());
  await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('#bagGrid .anlage2Slot').click());
  await page.waitForTimeout(400);
  pruef('sie ist ein zweites Mal ansprechbar', await page.evaluate(() => szeneAktiv), 'baumAnlage2');
  pruef('Konsole still (Gespraech)', laut, []);
  await ctx.close();
}

// ------------------------------------------------------------ der Kommentarkanal
{
  const { page, ctx, laut } = await frisch({ viewport: { width: 1100, height: 760 } });
  await imDienst(page);

  // Ohne sie schweigt der Kanal. Das ist die Bedingung, unter der ein Spieler,
  // der den Anfang noch vor sich hat, keine Stimme aus dem Nichts hoert.
  pruef('ohne sie schweigt der Kanal', await page.evaluate(() => {
    kn.flags.anlage2Da = false;
    knLastRandnotizT = -999;
    return anlage2Notiz('crit');
  }), false);

  const notiz = await page.evaluate(() => {
    kn.flags.anlage2Da = true; kn.regler = 'gespraechig';
    knLastRandnotizT = -999; letzterAnlass = null;
    const ok = anlage2Notiz('crit');
    return { ok, text: el('knRandTxt').innerText,
             sichtbar: el('knRandnotiz').classList.contains('show'),
             ihreMarke: el('knRandnotiz').classList.contains('a2'),
             anlass: letzterAnlass };
  });
  pruef('ihre Notiz erscheint', notiz.ok && notiz.sichtbar, true);
  pruef('sie stammt aus ihrem Pool', await page.evaluate(t =>
        ANLAGE2_NOTIZ.crit.some(e => (typeof e === 'string' ? e : e.z) === t), notiz.text), true);
  pruef('das Band traegt ihre Marke', notiz.ihreMarke, true);
  // W3: ohne diese Zeile verstummt der Chor auf der Bank, und Langvorgang
  // Hintermuehl haengt fest, weil langAnsprechen() nur ueber npcCycle() laeuft.
  pruef('die Bank bekommt ihren Anlass', notiz.anlass, 'crit');

  // Knoeterichs eigene Kanaele stehen unveraendert und tragen SEINE Marke.
  const seine = await page.evaluate(() => {
    knLastRandnotizT = -999;
    const ok = knShowLineGated('begruessung', 'Guten Morgen. Notiert.');
    return { ok, ihreMarke: el('knRandnotiz').classList.contains('a2') };
  });
  pruef('Knoeterich spricht weiter im selben Band', seine.ok, true);
  pruef('aber mit seiner eigenen Marke', seine.ihreMarke, false);

  // Der Regler. "Dienstlich" heisst: nur das Dienstliche, also Bedienung.
  pruef('auf Dienstlich schweigt sie', await page.evaluate(() => {
    kn.regler = 'dienstlich'; knLastRandnotizT = -999;
    return anlage2Notiz('goldfund');
  }), false);
  pruef('auf Schweigt erst recht', await page.evaluate(() => {
    kn.regler = 'schweigt'; knLastRandnotizT = -999;
    return anlage2Notiz('goldfund');
  }), false);
  pruef('auf Gespraechig wieder', await page.evaluate(() => {
    kn.regler = 'gespraechig'; knLastRandnotizT = -999;
    return anlage2Notiz('goldfund');
  }), true);

  // Die Gates. Eine gegatete Zeile taucht erst auf, wenn ihre Bedingung gilt,
  // und die ungegateten stehen von der ersten Minute an bereit.
  //
  // T4: der crit-Pool traegt seit diesem Abschnitt zwei Gates statt einem, die
  // Stufe und den Kipppunkt. Wer hier nur die Stufe setzt, misst nicht mehr
  // "alle Zeilen sind offen", sondern "alle bis auf die neue", und bekommt
  // einen Fehlschlag, der wie ein Fehler aussieht und keiner ist.
  const gate = await page.evaluate(() => {
    const vorher = anlage2Zeilen('crit').length;
    const alle = ANLAGE2_NOTIZ.crit.length;
    player.level = 20;
    kn.flags.anlage2Dank = true;
    const nachher = anlage2Zeilen('crit').length;
    kn.flags.anlage2Dank = false;
    return { vorher, nachher, alle };
  });
  pruef('gegatete Zeilen fehlen anfangs', gate.vorher < gate.alle, true);
  pruef('und kommen dazu, wenn die Bedingung gilt', gate.nachher, gate.alle);

  // ---- T4: der Kipppunkt -------------------------------------------------
  // Die angenommene Bitte ist die einzige Stelle, an der eine Spieleraktion
  // die Figur dauerhaft veraendert. Geprueft wird beides: dass der Merker
  // faellt, und dass er wirklich Zeilen oeffnet. Ein Merker, den niemand
  // liest, waere ein Haken ohne Bild.
  const kipp = await page.evaluate(() => {
    kn.flags.anlage2Dank = false;
    const vorher = anlage2Zeilen('untaetigkeit').length;
    const opt = SZENEN.baumAnlage2.knoten.dank.opts()[0];
    opt.tun();
    return { gesetzt: kn.flags.anlage2Dank, vorher, nachher: anlage2Zeilen('untaetigkeit').length,
             text: opt.t };
  });
  pruef('die angenommene Bitte setzt den Merker', kipp.gesetzt, true);
  pruef('und ihr Ausgang heisst wie jeder andere', kipp.text, 'Auf Wiedersehen.');
  pruef('danach steht ihr eine Zeile mehr offen', kipp.nachher > kipp.vorher, true);

  // ---- T4-Nachlese: ganz gelesen -----------------------------------------
  // Ihre Besessenheit ist, EINMAL GANZ gelesen zu werden. Wer alle sieben
  // Fragen gestellt hat, hat das getan, und seit der Nachlese sagt sie es.
  // Geprueft wird die Kante und nicht nur das Ergebnis: nach sechs Fragen darf
  // nichts scharf sein, nach der siebten muss es das.
  //
  // Der Block raeumt hinter sich auf. Er muss zum Messen zwei Felder leeren,
  // und die Zusagen unter ihm lesen dieselben: wer hier den Stand liegen
  // laesst, bekommt weiter unten Fehlschlaege, die wie Funde aussehen und
  // keine sind.
  const ganz = await page.evaluate(() => {
    const merk = {u: kn.umschlag, g: kn.a2Gefragt};
    kn.umschlag = {}; kn.a2Gefragt = {};
    const keys = SZENEN.baumAnlage2.fragen.map(f => f.key);
    const haken = SZENEN.baumAnlage2.gestellt;
    keys.slice(0, -1).forEach(k => haken(k));
    const nachSechs = kn.umschlag.ganzGelesen || 0;
    haken(keys[keys.length - 1]);
    const nachSieben = kn.umschlag.ganzGelesen || 0;
    // Was wirklich einen Neustart ueberlebt, ist das, was in der Ablage steht.
    // Deshalb wird dort nachgesehen und nicht im Kopf.
    const roh = JSON.parse(localStorage.getItem('sda_knoeterich_v1') || '{}');
    const abgelegt = { fragen: Object.keys(roh.a2Gefragt || {}).length,
                       scharf: (roh.umschlag || {}).ganzGelesen || 0 };
    // aufraeumen: derselbe Stand wie vor dem Block
    kn.umschlag = merk.u; kn.a2Gefragt = merk.g; saveKn();
    return { keys: keys.length, nachSechs, nachSieben, abgelegt,
             inTabelle: ANLAGE2_UMSCHLAG.some(u => u.id === 'ganzGelesen'),
             zweimal: (() => { const v = kn.umschlag.ganzGelesen; haken(keys[0]); return kn.umschlag.ganzGelesen === v; })() };
  });
  pruef('sie hat sieben Fragen', ganz.keys, 7);
  pruef('nach sechs Fragen ist nichts scharf', ganz.nachSechs, 0);
  pruef('die siebte schaltet den Umschlag scharf', ganz.nachSieben, 1);
  pruef('und die Zeile steht in der Tabelle', ganz.inTabelle, true);
  pruef('die sieben Fragen liegen in der Ablage', ganz.abgelegt.fragen, 7);
  pruef('die scharfe Zeile liegt dort ebenfalls', ganz.abgelegt.scharf, 1);
  pruef('eine achte Frage schaltet nichts nach', ganz.zweimal, true);

  // ---- T4: die zweite Buehne ---------------------------------------------
  // Unter vier Augen ist sie eine andere. Gemessen wird an der Entfernung zu
  // Knoeterich, der als einziger nicht in npcs steht: genau ihn zu vergessen
  // waere der Fehler, den man im Dorf nie bemerkt.
  const allein = await page.evaluate(() => {
    const merk = {x: player.x, y: player.y};
    player.x = KN_POS.x; player.y = KN_POS.y;
    const beiIhm = anlage2Allein();
    player.x = merk.x; player.y = merk.y;
    return { beiIhm, schalter: 'allein' in ZUSATZ_SCHALTER };
  });
  pruef('der Schalter steht in der Tabelle', allein.schalter, true);
  pruef('in Knoeterichs Naehe ist sie nicht allein', allein.beiIhm, false);

  // ---- T4: der Umschlag --------------------------------------------------
  // Er wird verbraucht statt gezogen. Drei Zusagen: er faellt, er faellt genau
  // einmal, und er sieht anders aus als alles andere, was sie sagt.
  const um = await page.evaluate(async () => {
    kn.flags.anlage2Da = true; kn.umschlag = {}; kn.regler = 'gespraechig';
    kammer = null;
    knLastRandnotizT = -999;
    const id = ANLAGE2_UMSCHLAG[0].id;
    const gearmt = anlage2Umschlag(id);
    const zweimal = anlage2Umschlag(id);          // schon faellig, kein zweites Mal
    // Weit weg von allem, damit anlage2Allein() wahr wird.
    const merk = {x: player.x, y: player.y};
    player.x = 60 * 32; player.y = 300 * 32;
    const gefallen = anlage2UmschlagTick();
    const band = document.getElementById('knRandnotiz');
    const optik = { umschlag: band.classList.contains('umschlag'), a2: band.classList.contains('a2'),
                    marke: getComputedStyle(band, '::before').content };
    const stand = kn.umschlag[id];
    knLastRandnotizT = -999;
    const nochmal = anlage2UmschlagTick();        // verbraucht, faellt nie wieder
    player.x = merk.x; player.y = merk.y;
    return { gearmt, zweimal, gefallen, stand, optik, nochmal,
             text: document.getElementById('knRandTxt').textContent, soll: ANLAGE2_UMSCHLAG[0].z };
  });
  pruef('der Umschlag laesst sich scharf schalten', um.gearmt, true);
  pruef('aber nicht zweimal', um.zweimal, false);
  pruef('und faellt unter vier Augen', um.gefallen, true);
  pruef('mit dem Text der Tabelle', um.text, um.soll);
  pruef('danach ist er verbraucht', um.stand, 2);
  pruef('und faellt kein zweites Mal', um.nochmal, false);
  pruef('das Band traegt seine stille Kleidung', um.optik.umschlag, true);
  pruef('und nicht ihre Fussnotenmarke', um.optik.a2, false);
  pruef('die Marke faellt ganz weg', um.optik.marke, 'none');

  // Und er ueberlebt den Neustart, in beiden Staenden. Das ist der Grund fuer
  // die Zweiwertigkeit: ein faelliger Umschlag, der beim Schliessen des
  // Browsers verfaellt, ist eine Zeile, die niemand je hoert.
  const nachLaden = await page.evaluate(() => {
    kn.umschlag = {ersterTod: 1, dank: 2}; saveKn();
    const roh = JSON.parse(localStorage.getItem(KN_KEY));
    return roh.umschlag;
  });
  pruef('beide Staende stehen im Spielstand', nachLaden, {ersterTod: 1, dank: 2});

  // ---- T4: die drei neuen Anlaesse ---------------------------------------
  const neu = await page.evaluate(() => {
    const r = {};
    for(const a of ['niederlage','bosssieg','ebene']){
      knLastRandnotizT = -999;
      r[a] = anlage2Notiz(a) && document.getElementById('knRandnotiz').classList.contains('a2');
    }
    return r;
  });
  pruef('die Niederlage hat ihre Zeilen', neu.niederlage, true);
  pruef('der Bosssieg auch', neu.bosssieg, true);
  pruef('und die zweite Ebene', neu.ebene, true);

  // Der Wiederantritt: die Zeile zur Niederlage haengt an kn.pending und faellt
  // erst, wenn der Spieler wieder steht. Sie im Moment des Scheiterns zu sagen
  // waere die Figur, die dieses Haus nicht will.
  const spaet = await page.evaluate(() => {
    kn.pending.niederlage = true; knLastRandnotizT = -999;
    knPlayStartT = gameT;                 // gerade erst angetreten
    knTick(0.016);
    const sofort = kn.pending.niederlage;
    knPlayStartT = gameT - 10;            // zehn Sekunden spaeter
    knLastRandnotizT = -999;
    knTick(0.016);
    return { sofort, danach: kn.pending.niederlage };
  });
  pruef('beim Wiederantritt schweigt sie noch', spaet.sofort, true);
  pruef('und sagt es wenige Sekunden spaeter', spaet.danach, false);

  pruef('Konsole still (Kanal)', laut, []);
  await ctx.close();
}

await browser.close();
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
process.exit(fehl ? 1 : 0);
