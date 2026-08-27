// Pruefprotokoll zu Bauabschnitt SZ1 (phase-sz1-szenensystem.md).
//
//   python3 serve.py &
//   node tools/szene-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// Geprueft wird, was SZ1 zugesagt hat. tools/empfang-pruef.mjs prueft den
// Anfang als Erzaehlung; dieser Lauf prueft die Maschine darunter:
//
//   Tabelle       jede eingetragene Szene hat Sprecher und Knoten, und wenn sie
//                 kein Gespraechsbaum aus F1 ist, zusaetzlich Ende und Sperre;
//                 szeneAssert() meldet sie beim Laden als in Ordnung
//   Erreichbarkeit jeder Knoten jeder Szene ist von ihrem Start aus zu
//                 erreichen, und keiner ist eine Sackgasse
//   Sprecher      ein Knoten mit wer: tauscht Portraet und Kopfzeile
//   Schluss       szeneAktiv steht auf null, sobald die Szene vorbei ist, und
//                 traegt waehrenddessen den Schluessel, nicht nur ein Ja
//   Tafeln        jedes Introblatt steht auf 390x844 vollstaendig im Bild,
//                 nichts rollt, beide Knoepfe sind erreichbar
//   Sperre        die Wortsperre gilt je Szene: der Empfang darf die spaeteren
//                 Akte nicht nennen, das Intro darf die Papiere zeigen und
//                 trotzdem keinen Namen nennen
//
// Wie die uebrigen Laeufe stellt dieser fest statt zu messen: jede Zeile ist
// ein Soll-Ist-Vergleich, Exit-Code 1 bei der ersten Abweichung.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

const zeilen = [];
let fehl = 0;
// Vor bericht() angelegt und nicht erst bei frisch(): der Abbruchbericht liest
// laut, und ein Absturz beim Browserstart faende die Kiste sonst in der
// zeitlichen Totzone -- der Bericht wuerfe dann selbst und verdeckte die
// Ursache, die er zeigen soll.
const laut = [];

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
  if(laut.length){ console.log('\nKonsole:'); for(const l of laut) console.log('  ' + l); }
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

async function frisch(opt){
  const ctx = await browser.newContext(opt);
  const page = await ctx.newPage();
  page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
  page.on('console', m => {
    if(m.type() !== 'error' && m.type() !== 'warning') return;
    if(m.text().includes('404')) return;   // fehlendes Sprite-Blatt ist ein Lizenzstand
    laut.push(m.type() + ': ' + m.text().slice(0, 200));
  });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
  return { page, ctx };
}

// ------------------------------------------------------------- Tabelle und Graph
{
  const { page, ctx } = await frisch({ viewport: { width: 1100, height: 800 } });

  // Pflicht sind sprecher und knoten, und zwar fuer jede Szene. ende und sperre
  // sind es nicht: szeneAssert() nennt in (Pflichtfeld fehlt) genau diese zwei
  // und liest die anderen beiden als (d.sperre || []) und ueber den Ausgang.
  //
  // Bis F1 fiel das nicht auf, weil alle vier Szenen alle vier Felder trugen.
  // F1s dreizehn Gespraechsbaeume tragen zwei davon nicht, und aus gutem Grund:
  // ein Baum endet an jedem seiner Blaetter ausdruecklich ueber szeneEnde(),
  // faellt also nie durch, und ein ende: waere unerreichbarer Code. Die Sperre
  // fehlt, weil ein Baum mitten im Spiel laeuft und die spaeteren Akte nennen
  // darf, so wie es der Kopf des SZ2-Blocks fuer dessen Szenen aufschreibt.
  //
  // Dieser Lauf hat das bis zum 24.08.2026 als dreizehn Fehlschlaege gemeldet.
  // Das war die Zusage aus SZ1, als es genau eine Szene gab, und nicht die
  // Regel des Hauses. Geprueft wird jetzt die Regel: die zwei Pflichtfelder
  // immer, die zwei anderen als Paar, das ein Baum weglaesst und jede andere
  // Szene traegt.
  //
  // EINE AUSNAHME, seit T5b (26.08.2026): baumAnlage2 traegt sehr wohl eine
  // Sperre. Der Satz oben ("ein Baum darf die spaeteren Akte nennen") gilt fuer
  // Dorffiguren, denn der Fall ist ihr Inhalt. Anlage 2 hat als einzige Figur
  // eine Brandmauer: sie kennt das Haus und nicht den Vorgang (Kapitel 8). Ihr
  // Baum lief bis T5b ohne Sperre, obwohl anlage2Assert() im Kopf das Gegenteil
  // behauptet, und dieser Lauf hat die Luecke als Soll festgeschrieben statt
  // sie zu melden. Beides ist korrigiert.
  const BAUM_MIT_SPERRE = ['baumAnlage2'];
  const form = await page.evaluate(() => {
    const raus = {};
    for(const k in SZENEN){
      const d = SZENEN[k];
      raus[k] = {
        sprecher: typeof d.sprecher === 'function',
        knoten:   d.knoten && typeof d.knoten === 'object' && Object.keys(d.knoten).length > 0,
        ende:     typeof d.ende === 'function',
        sperre:   Array.isArray(d.sperre),
      };
      raus[k].baum = !!d.baum;
    }
    return raus;
  });
  for(const k in form){
    const baum = form[k].baum, ist = {...form[k]};
    delete ist.baum;   // steht im Namen der Zeile, nicht im Vergleich: ein Feld,
                       // das nie fehlschlagen kann, gehoert nicht ins Soll.
    pruef(`${k}${baum ? ' (Baum)' : ''}: Tabellenform vollstaendig`, ist,
          {sprecher:true, knoten:true, ende: !baum,
           sperre: !baum || BAUM_MIT_SPERRE.includes(k)});
  }

  // Erreichbarkeit als Graph. Gerechnet wird auf der Tabelle, nicht gespielt:
  // gespielt wird der Empfang schon von empfang-pruef.mjs, und ein Graph findet
  // auch die Knoten, an die kein Spielweg fuehrt.
  //
  // Gelaufen wird bis zum Fixpunkt und nicht in zwei Momentaufnahmen. Der Grund
  // ist der Treppeneffekt: ein hub zeigt immer nur die ersten drei OFFENEN
  // Fragen, und eine Frage wird erst offen, wenn ihre Voraussetzung gestellt
  // ist. Wer einmal mit leerer und einmal mit voller Fragenmenge hinsieht,
  // sieht genau die Fragen dazwischen nie.
  const graph = await page.evaluate(() => {
    const raus = {};
    const merkKey = szeneAktiv, merkKnoten = szene.knoten, merkGefragt = szene.gefragt;
    try {
      for(const k in SZENEN){
        const d = SZENEN[k];
        const alle = new Set(Object.keys(d.knoten));
        for(const f of (d.fragen || [])) alle.add(f.key);
        const istFrage = n => (d.fragen || []).some(f => f.key === n);
        szeneAktiv = k;

        // Eingaenge: der Startknoten und jeder hub. Ein hub ist ein erklaerter
        // Wiedereinstieg, die Szene kehrt dorthin zurueck. Der Weg dorthin
        // fuehrt durch Code und nicht durch die Tabelle: beim Empfang liegt
        // zwischen der Vorstellung und dem Gruss der ganze Tafelstapel. Ein
        // Graph auf den Daten kann das nicht sehen, und ein hub, den niemand
        // aufruft, waere ohnehin ein Fund fuer den Spielverlauf und nicht fuer
        // die Tabelle: dafuer gibt es empfang-pruef.mjs.
        const erreicht = new Set([d.start]);
        for(const n in d.knoten) if(d.knoten[n].hub) erreicht.add(n);
        const gefragt = new Set();
        // Eine Antwort nennt ihr Ziel auf zwei Arten: als zu: in der Tabelle
        // oder als tun: () => szeneKnoten('x'). Die zweite ist von aussen nur
        // am Quelltext der Funktion zu erkennen. Das ist keine Spielerei: die
        // Tabelle IST Daten, und ein Knoten, den nur eine Funktion nennt, waere
        // sonst als unerreichbar gemeldet, obwohl er es nicht ist.
        const nimm = o => {
          const zt = [];
          if(o.zu) zt.push(o.zu);
          if(o.tun) for(const m of String(o.tun).matchAll(/szeneKnoten\(\s*['"]([A-Za-z0-9_]+)['"]/g)) zt.push(m[1]);
          let neu = false;
          for(const z of zt){
            if(!erreicht.has(z)){ erreicht.add(z); neu = true; }
            if(istFrage(z) && !gefragt.has(z)){ gefragt.add(z); neu = true; }
          }
          return neu;
        };

        for(let runde = 0; runde < 200; runde++){
          let neu = false;
          for(const n of [...erreicht]){
            szene.knoten = n; szene.gefragt = new Set(gefragt);
            for(const o of szeneOptionen()) if(nimm(o)) neu = true;
            const roh = d.knoten[n];
            if(roh && roh.opts) for(const o of roh.opts()) if(nimm(o)) neu = true;
          }
          if(!neu) break;
        }
        raus[k] = [...alle].filter(n => !erreicht.has(n));
      }
    } finally { szeneAktiv = merkKey; szene.knoten = merkKnoten; szene.gefragt = merkGefragt; }
    return raus;
  });
  // Erwartet wird je Szene eine leere Liste. Die Schluessel kommen aus der
  // Tabelle und nicht aus einem Literal: eine neue Szene soll diesen Lauf
  // erweitern, ohne dass jemand hier eine Zeile nachtraegt.
  const sollLeer = await page.evaluate(() => Object.fromEntries(Object.keys(SZENEN).map(k => [k, []])));
  pruef('jeder Knoten ist vom Start aus erreichbar', graph, sollLeer);

  // Die Wortsperre haengt an der Szene und nicht mehr am Modul.
  const sperren = await page.evaluate(() => ({
    empfangHatVolleListe: SZENEN.empfang.sperre === AKTE_SPERRE,
    namenSindTeilmenge:   AKTE_SPERRE_NAMEN.every(n => AKTE_SPERRE.includes(n)),
    namenKuerzer:         AKTE_SPERRE_NAMEN.length < AKTE_SPERRE.length,
    // Das Intro zeigt Papiere und nennt keinen Namen. Beides gegengeprueft.
    // T2: eine gesprochene Zeile ist seit SZ4 ein String ODER ein Paar aus
    // Sprecher und Satz. Das Intro trug bis T2 nur Strings, deshalb ist es hier
    // nie aufgefallen; seit der Anfang erzaehlt, spricht Knoeterich in den
    // Blaettern mit. Beide Formen werden vor der Pruefung auf Text gebracht.
    introZeigtPapiere:    INTRO_BLAETTER.some(b => (b.stimme || []).some(z => (typeof z === 'string' ? z : z.wer + ' ' + z.z).includes('Ausfertigung'))),
    introNenntKeinenNamen: INTRO_BLAETTER.every(b =>
      [b.blatt, b.regie, ...(b.stimme || [])].filter(Boolean)
        .map(z => typeof z === 'string' ? z : z.wer + ' ' + z.z)
        .every(z => AKTE_SPERRE_NAMEN.every(n => !z.includes(n)))),
  }));
  pruef('die Wortsperre haengt an der Szene', sperren,
        {empfangHatVolleListe:true, namenSindTeilmenge:true, namenKuerzer:true,
         introZeigtPapiere:true, introNenntKeinenNamen:true});

  // Der Schluessel steht waehrend der Szene da und ist danach weg.
  await page.evaluate(() => startGame());
  await page.waitForTimeout(400);
  pruef('szeneAktiv traegt den Schluessel', await page.evaluate(() => szeneAktiv), 'empfang');
  pruef('empfangAktiv ist die abgeleitete Frage', await page.evaluate(() => empfangAktiv), true);

  // Ein Sprecherwechsel tauscht Portraet und Kopfzeile. Der Empfang braucht ihn
  // nicht, die Maschine muss ihn trotzdem koennen: Szene 7 steht und faellt damit.
  const wechsel = await page.evaluate(() => {
    const vorher = document.getElementById('gespraechNameTxt').textContent;
    // toDataURL statt getImageData: derselbe Vergleich, aber ohne die
    // Canvas2D-Warnung ueber wiederholte Rueckleseoperationen. Der Lauf zaehlt
    // jede Warnung als Fund, also darf er selbst keine erzeugen.
    const c = document.getElementById('gespraechPortrait');
    const vorherBild = c.toDataURL();
    szeneSprecherSetzen('noergel');
    const nachher = document.getElementById('gespraechNameTxt').textContent;
    const nachherBild = c.toDataURL();
    return {vorher, nachher, bildAnders: vorherBild !== nachherBild};
  });
  pruef('der Sprecherwechsel setzt den Namen', wechsel.nachher, 'Nörgel, Sachbearbeiter auf Probe');
  pruef('und zeichnet ein anderes Portraet', wechsel.bildAnders, true);
  pruef('vorher stand dort Knoeterich', wechsel.vorher, 'Amtsrat a. D. Knöterich');

  await ctx.close();
}

// ------------------------------------------------------------- Die Tafeln, Telefon
{
  const { page, ctx } = await frisch({ viewport: { width: 390, height: 844 }, isMobile: true,
                                       hasTouch: true, deviceScaleFactor: 2 });
  await page.evaluate(() => startGame());
  await page.waitForTimeout(300);
  for(let i = 0; i < 6; i++){
    await page.evaluate(() => { gespraechFertigTippen(); const o = szeneOptionen(); if(o.length) o[0].tun(); });
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(300);
  const anzahl = await page.evaluate(() => INTRO_BLAETTER.length);
  const ueber = [];
  for(let i = 1; i <= anzahl; i++){
    const m = await page.evaluate(() => {
      const pan = document.getElementById('ovPanel');
      const knoepfe = [...pan.querySelectorAll('button')];
      return {rollt: pan.scrollHeight > pan.clientHeight + 2,
              knoepfe: knoepfe.length,
              drin: knoepfe.every(b => b.getBoundingClientRect().bottom <= innerHeight + 1)};
    });
    // Zwei Knoepfe auf jedem Blatt ausser dem letzten: dort gibt es nichts mehr
    // zu ueberspringen, und ein Knopf, der nichts tut, ist schlechter als keiner.
    const sollKnoepfe = i === anzahl ? 1 : 2;
    if(m.rollt || !m.drin || m.knoepfe !== sollKnoepfe) ueber.push(`Blatt ${i}: ${JSON.stringify(m)}`);
    await page.evaluate(n => szeneTafel(n), i);
    await page.waitForTimeout(150);
  }
  pruef('kein Introblatt laeuft auf dem Telefon ueber', ueber, []);
  pruef('nach dem letzten Blatt steht der Empfang',
        await page.evaluate(() => document.getElementById('overlay').style.display), 'none');
  pruef('und die Szene laeuft weiter', await page.evaluate(() => szeneAktiv), 'empfang');
  await ctx.close();
}


// ------------------------------------------------------------- SZ2: die drei Szenen
{
  const { page, ctx } = await frisch({ viewport: { width: 1100, height: 800 } });

  // Faelligkeit: welche Szene will wann uebernehmen. Gerechnet auf der Tabelle,
  // ohne eine zu starten.
  const faellig = await page.evaluate(() => {
    const raus = {};
    const alt = {modus: CONFIG.schichtModus, sch: amt.schichten, flags: {...kn.flags}, vg: {...kladde.vorgang}};
    CONFIG.schichtModus = true;
    try {
      for(const f in kn.flags) if(f.startsWith('szene')) kn.flags[f] = false;
      kladde.vorgang = {1:true, 2:true, 3:true, 4:true};
      for(const sch of [0, 10, 20, 30, 40]){
        amt.schichten = sch;
        raus['Akt ' + aktStand()] = {umlauf: szeneFaellig('umlauf'), knoeterich: szeneFaellig('knoeterich')};
      }
      // Ohne vollstaendige Anschrift bleibt Knoeterichs Szene aus, auch in Akt IV.
      amt.schichten = 30; kladde.vorgang = {1:true, 2:true, 3:true};
      raus['Akt 4 ohne Anschrift'] = {umlauf: szeneFaellig('umlauf'), knoeterich: szeneFaellig('knoeterich')};
      // Und mit gesetztem Merker nie wieder.
      kladde.vorgang = {1:true, 2:true, 3:true, 4:true};
      kn.flags.szeneUmlauf = true; kn.flags.szeneKnoeterich = true;
      raus['gespielt'] = {umlauf: szeneFaellig('umlauf'), knoeterich: szeneFaellig('knoeterich')};
    } finally {
      CONFIG.schichtModus = alt.modus; amt.schichten = alt.sch;
      Object.assign(kn.flags, alt.flags); kladde.vorgang = alt.vg;
    }
    return raus;
  });
  pruef('Umlauf ab Akt II, Knoeterich ab Akt IV mit Anschrift', faellig, {
    'Akt 1': {umlauf: null,     knoeterich: null},
    'Akt 2': {umlauf: 'umlauf', knoeterich: null},
    'Akt 3': {umlauf: 'umlauf', knoeterich: null},
    'Akt 4': {umlauf: 'umlauf', knoeterich: 'knoeterich'},
    'Akt 5': {umlauf: 'umlauf', knoeterich: 'knoeterich'},
    'Akt 4 ohne Anschrift': {umlauf: 'umlauf', knoeterich: null},
    'gespielt':             {umlauf: null,     knoeterich: null},
  });

  // Die Zeile im Amtspanel steht nur in Akt III und nur, solange ungespielt.
  const schub = await page.evaluate(() => {
    const raus = {};
    const alt = {modus: CONFIG.schichtModus, sch: amt.schichten, f: kn.flags.szeneSchublade};
    CONFIG.schichtModus = true; kn.flags.szeneSchublade = false;
    try {
      for(const sch of [10, 20, 30]){ amt.schichten = sch; raus['Akt ' + aktStand()] = schubladeBlock().length > 0; }
      amt.schichten = 20; kn.flags.szeneSchublade = true; raus['gespielt'] = schubladeBlock().length > 0;
    } finally { CONFIG.schichtModus = alt.modus; amt.schichten = alt.sch; kn.flags.szeneSchublade = alt.f; }
    return raus;
  });
  pruef('die Schubladenzeile steht ab Akt III und nur einmal', schub,
        {'Akt 2': false, 'Akt 3': true, 'Akt 4': true, 'gespielt': false});

  // Die vierzig Blaetter: Zahl, Jahreslauf, und der zweite Knopf springt ans Ende.
  const blaetter = await page.evaluate(() => {
    const l = schubladeBlaetter();
    return {n: l.length,
            erstes: l[0].stimme[2],
            letztes: l[l.length-1].stimme[2],
            zeichnet: l[l.length-1].regie.indexOf('Vorblatt') >= 0,
            zahlLesbar: !!szeneBlattZahl(l.length, l.length),
            // Ein Stapel zaehlt durchgehend in einem System, nie gemischt.
            fussEinheitlich: /^\d+$/.test(szeneBlattZahl(1, l.length)) === /^\d+$/.test(szeneBlattZahl(l.length, l.length)),
            introBleibtRoemisch: szeneBlattZahl(1, INTRO_BLAETTER.length) === 'I'};
  });
  pruef('vierzig Zwischenbescheide, 972 bis 1011', blaetter,
        {n: 40, erstes: 'Hochablage, im Jahr 972.', letztes: 'Hochablage, im Jahr 1011.',
         zeichnet: true, zahlLesbar: true, fussEinheitlich: true, introBleibtRoemisch: true});

  await ctx.close();
}

// ------------------------------------------------------- SZ2: gespielt, im Dienst
{
  const { page, ctx } = await frisch({ viewport: { width: 1100, height: 800 } });
  // In den Dienst: Anfang ueberspringen, Vordruck durchklicken.
  await page.evaluate(() => startGame());
  await page.waitForTimeout(300);
  await page.evaluate(() => { if(szeneAktiv === 'empfang') empfangUeberspringen(); });
  await page.waitForTimeout(200);
  for(let i = 0; i < 60; i++){
    const offen = await page.evaluate(() => document.getElementById('overlay').style.display === 'flex');
    if(!offen) break;
    const b = page.locator('#overlay button').last();
    if(await b.count() === 0) break;
    await b.click({ force: true });
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(400);
  pruef('der Dienst laeuft', await page.evaluate(() => state), 'play');

  // Szene 2 spielen: Akt II erzwingen, Umlauf ansprechen.
  const lauf = await page.evaluate(async () => {
    amt.schichten = 15; kn.flags.szeneUmlauf = false;
    const n = npcs.find(x => x.key === 'umlauf');
    // Zwei Weltblasen aufziehen, bevor die Szene beginnt: eine von Knoeterich,
    // eine von einer Dorffigur. Beide muessen waehrend der Szene schweigen.
    knBubble.visible = true; knBubble.text1 = 'Probe'; knBubble.text2 = '';
    const z = npcs.find(x => x.key === 'zwirn');
    z.bubbleText1 = 'Probe'; z.bubbleHideAt = gameT + 99;
    gespraechOeffnen(n);
    const drin = {key: szeneAktiv, welt: state, knoten: szene.knoten,
                  name: document.getElementById('gespraechNameTxt').textContent,
                  // Dieselben Bedingungen wie im Zeichenpfad, an derselben Stelle gelesen.
                  blasen: {kn: !!(knBubble.visible && !szeneAktiv),
                           npc: !!(z.bubbleText1 && gameT < z.bubbleHideAt && gespraech.npc !== z && !szeneAktiv)}};
    // Durchspielen: immer die erste Antwort, bis die Szene endet.
    const namen = [];
    for(let i = 0; i < 40 && szeneAktiv; i++){
      gespraechFertigTippen();
      namen.push(document.getElementById('gespraechNameTxt').textContent);
      const o = szeneOptionen(); if(!o.length) break;
      o[0].tun();
    }
    return {drin, namen: [...new Set(namen)], nachher: {key: szeneAktiv, welt: state,
            merker: kn.flags.szeneUmlauf, anlass: letzterAnlass, tafel: gespraechOffen}};
  });
  pruef('Szene 2 uebernimmt beim Ansprechen', lauf.drin.key, 'umlauf');
  // Waehrend der Szene redet niemand dazwischen. Geprueft wird die Bedingung im
  // Zeichenpfad und nicht das Bild: eine stehende Blase ueber einem
  // Namensschild ergibt zwei Texte an derselben Stelle, und keiner ist lesbar.
  // Der Weltstopp friert gameT ein, eine Blase ginge also von selbst nie aus.
  pruef('keine Weltblase waehrend der Szene', lauf.drin.blasen, {kn:false, npc:false});
  pruef('und haelt dabei die Welt an', lauf.drin.welt, 'szene');
  pruef('sie beginnt an ihrem Startknoten', lauf.drin.knoten, 'u1');
  pruef('Fass kommt als zweiter Sprecher vor',
        lauf.namen.includes('Wirt Bruno Fass, Gasthaus "Zum Letzten Stempel"'), true);
  pruef('danach ist die Szene aus', lauf.nachher.key, null);
  pruef('die Welt laeuft wieder', lauf.nachher.welt, 'play');
  pruef('die Tafel ist zu', lauf.nachher.tafel, false);
  pruef('der Merker steht', lauf.nachher.merker, true);
  pruef('der Chor auf der Bank ist vorgemerkt', lauf.nachher.anlass, 'umlauf');

  // Der Nachklang faellt genau einmal, bei Lott oder Pahl.
  const chor = await page.evaluate(() => {
    const n = npcs.find(x => x.key === 'lott');
    n.bubbleIdx = -1;
    npcSprechen(n);
    const erst = n.bubbleText1;
    npcSprechen(n);
    return {erst, verbraucht: letzterAnlass, zweit: n.bubbleText1};
  });
  pruef('Lott sagt den Nachklang', ['Die kommt alle achtzig Jahre.', 'Eine Botin. Die hat es eilig.'].includes(chor.erst), true);
  pruef('und danach ist der Anlass verbraucht', chor.verbraucht, null);
  pruef('die zweite Zeile ist eine andere', chor.zweit !== chor.erst, true);

  // Ein zweites Ansprechen startet die Szene nicht noch einmal.
  const nochmal = await page.evaluate(() => {
    gespraechSchliessen();
    const n = npcs.find(x => x.key === 'umlauf');
    gespraechOeffnen(n);
    return {key: szeneAktiv, welt: state, tafel: gespraechOffen};
  });
  pruef('ein zweites Ansprechen ist ein normales Gespraech',
        nochmal, {key: null, welt: 'play', tafel: true});

  await ctx.close();
}

await browser.close();
fertig = true;
bericht();
process.exit(fehl || laut.length ? 1 : 0);
