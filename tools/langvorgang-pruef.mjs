// Pruefprotokoll zu Langvorgang 4 (phase-lv4-praktikumsbericht.md), dem sechsten
// Praktikumsbericht. Deckt zugleich die Bauform aus W7 ab, in der er steckt.
//
//   python3 serve.py &
//   node tools/langvorgang-pruef.mjs [URL]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// Geprueft wird, was LV4 zugesagt hat:
//
//   Kette         Acht Beats an fuenf Figuren, in der Reihenfolge aus
//                 BERICHT_DRAN. Wer nicht dran ist, rueckt den Strang nicht vor,
//                 und der richtige Wortlaut kommt beim richtigen Schritt.
//   Torschaltung  Vor Akt II liegt der Strang still. Vorblatt steht erst ab Akt
//                 III im Dorf, die Kette haelt bis dahin an Stufe 3 und laeuft
//                 danach weiter.
//   Endzustand    Nach dem achten Beat ist der Strang fertig, weitere
//                 Tastendruecke bewegen ihn nicht mehr, und die Figuren fallen
//                 in ihren Grundzeilen-Kreislauf zurueck.
//   Belohnung     Zwei Zusatzzeilen bei Lisbeth, zwei bei Noergel (ueber
//                 ZUSATZ_SCHALTER.lang), eine Zeile im Reiter LAUFENDE
//                 VORGAENGE. Kein Gold, keine Erfahrung, kein amt-Feld.
//   Praezedenz    Das vierte Puzzleteil des Finales nennt den Fall, sobald es
//                 ihn gibt, und nennt ihn vorher nicht. Der Wortlaut aus
//                 Kapitel 9 steht in beiden Faellen da.
//   Keine Sperre  Der Strang ist an keiner Stelle Bedingung: Zustellen,
//                 Blattserien und Auftragstypen bleiben ohne ihn erreichbar.
//   Inertheit     Bei CONFIG.schichtModus = false schreibt er nichts, meldet
//                 nichts und zeigt nichts.
//   Spielstand    Der Lauf schreibt keinen Fortschritt in den echten Stand.
//                 langEreignis() ruft saveKladde(), deshalb wird localStorage
//                 vorher gesichert und danach wiederhergestellt. Genau dieser
//                 Testfehler steht offen in phase-w7-langvorgaenge.md.
//
// Wie menue-pruef.mjs und reich-pruef.mjs stellt dieser Lauf fest statt zu
// messen: jede Zeile ist ein Soll-Ist-Vergleich, Exit-Code 1 bei der ersten
// Abweichung.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();

const laut = [];
page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', m => {
  if(m.type() !== 'error' && m.type() !== 'warning') return;
  if(m.text().includes('404')) return;                 // fehlendes Sprite-Blatt ist ein Lizenzstand, kein Fund
  if(m.text().includes('Sprite fehlt')) return;        // dieselben vier Blaetter, seit F1 als Bestand vermerkt
  laut.push(m.type() + ': ' + m.text().slice(0, 200));
});

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });

const zeilen = await page.evaluate(() => {
  const raus = [];
  const pruef = (name, ist, soll) => raus.push({name, ist, soll, ok: JSON.stringify(ist) === JSON.stringify(soll)});
  const fig = k => DORF_FIGUREN.find(f => f.key === k);

  // Spiegel. localStorage kommt mit, weil langEreignis() saveKladde() ruft.
  const sicherung = {
    schichtModus: CONFIG.schichtModus, schichten: amt.schichten,
    lang: JSON.stringify(kladde.lang), vorgang: JSON.stringify(kladde.vorgang),
    crafts: kladde.crafts, roh: localStorage.getItem(KLADDE_KEY),
    // SZ3: Vorblatts Anwesenheit haengt seit der Entklammerung nicht mehr am
    // Akt allein, sondern an seiner Ankunft. Die Kette laeuft ueber ihn, also
    // muss dieser Lauf sie herstellen koennen — und hinterher zuruecknehmen.
    vorblatt: kn.flags.szeneVorblatt,
  };
  const zurueck = () => {
    CONFIG.schichtModus = sicherung.schichtModus; amt.schichten = sicherung.schichten;
    kladde.lang = JSON.parse(sicherung.lang); kladde.vorgang = JSON.parse(sicherung.vorgang);
    kladde.crafts = sicherung.crafts;
    kn.flags.szeneVorblatt = sicherung.vorblatt;
    if(sicherung.roh === null) localStorage.removeItem(KLADDE_KEY);
    else localStorage.setItem(KLADDE_KEY, sicherung.roh);
  };

  try {
  const d = LANGVORGAENGE.bericht;

  // --- Tabellenform ---------------------------------------------------------
  pruef('der Strang heisst bericht und gehoert Lisbeth', d.figur, 'lisbeth');
  pruef('acht Stufen, acht Beats, acht Zustaendige',
        [d.stufen, BERICHT_BEATS.length, BERICHT_DRAN.length], [8, 8, 8]);
  pruef('er steht ganz vorn in der Tabelle', Object.keys(LANGVORGAENGE)[0], 'bericht');
  pruef('er hoert nur auf ansprechen', d.hoert, ['ansprechen']);
  pruef('jede Zustaendige ist eine Dorffigur',
        BERICHT_DRAN.filter(k => !fig(k)), []);

  // --- Torschaltung ---------------------------------------------------------
  CONFIG.schichtModus = true;
  for(const [sch, soll] of [[5, false], [15, true], [25, true]]){
    amt.schichten = sch;
    pruef('Auslöser bei Schicht ' + sch, d.wenn(), soll);
  }

  // --- Die Kette, Schritt fuer Schritt --------------------------------------
  // Akt IV und angekommen, damit Vorblatt im Dorf steht. SZ3 hat ihn von Akt III
  // auf Akt IV geschoben und zusaetzlich an die Entklammerung gehaengt; beides
  // muss hier stehen, sonst haelt die Kette bei Stufe 3, und genau das hat
  // dieser Lauf beim ersten Mal nach SZ3 gemeldet. Gelaufen wird ueber
  // langAnsprechen(), also genau den Pfad, den npcCycle() nimmt.
  amt.schichten = 35; kn.flags.szeneVorblatt = true; kladde.lang = {}; langSchicht = {};
  const FALSCH = {lisbeth: 'trepp', zwirn: 'trepp', bramsche: 'trepp', vorblatt: 'trepp', noergel: 'trepp'};
  for(let i = 0; i < BERICHT_DRAN.length; i++){
    const dran = BERICHT_DRAN[i];
    // Wer nicht dran ist, bewegt nichts. Trepp steht in jeder Runde daneben.
    const falsch = langAnsprechen(FALSCH[dran]);
    pruef('Stufe ' + i + ': ' + FALSCH[dran] + ' rueckt nicht vor', [falsch, langStufe('bericht')], [null, i]);
    const zeile = langAnsprechen(dran);
    pruef('Stufe ' + (i + 1) + ': ' + dran + ' spricht Beat ' + (i + 1),
          [zeile && zeile.z1, langStufe('bericht')], [BERICHT_BEATS[i].z1, i + 1]);
  }
  pruef('nach dem achten Beat ist der Strang fertig', langFertig('bericht'), true);
  const rohEnde = langRoh('bericht');
  for(const k of BERICHT_DRAN) langAnsprechen(k);
  pruef('der Endzustand bewegt sich nicht mehr', langRoh('bericht'), rohEnde);
  pruef('eine fertige Kette meldet keine Zeile mehr', langAnsprechen('lisbeth'), null);

  // --- Die Kette haelt an Vorblatt, solange Oben nicht da ist ---------------
  // Seit SZ3 ist "Oben ist da" keine Schichtzahl mehr, sondern ein Ereignis.
  // Der Lauf prueft deshalb beide Haelften einzeln: der Akt allein reicht nicht,
  // und die Ankunft allein auch nicht.
  amt.schichten = 15; kn.flags.szeneVorblatt = false; kladde.lang = {}; langSchicht = {};   // Akt II
  for(let runde = 0; runde < 4; runde++) for(const k of BERICHT_DRAN) langAnsprechen(k);
  pruef('in Akt II haelt die Kette an Stufe 3', langStufe('bericht'), 3);
  amt.schichten = 35;                                            // Akt IV, aber nicht angekommen
  for(let runde = 0; runde < 6; runde++) for(const k of BERICHT_DRAN) langAnsprechen(k);
  pruef('Akt IV allein loest sie nicht', langStufe('bericht'), 3);
  kn.flags.szeneVorblatt = true;                                 // die Entklammerung ist gelaufen
  for(let runde = 0; runde < 6; runde++) for(const k of BERICHT_DRAN) langAnsprechen(k);
  pruef('erst mit der Entklammerung laeuft sie durch', langStufe('bericht'), 8);

  // --- Belohnung ------------------------------------------------------------
  kladde.lang = {bericht: rohEnde};
  pruef('Lisbeth bekommt zwei Zusatzzeilen', langZusatz('lisbeth').map(z => z.z1), BERICHT_NACH.map(z => z.z1));
  const noeBlock = fig('noergel').zusatz.find(z => z.lang === 'bericht');
  pruef('Noergel hat einen Block am Schalter lang', !!noeBlock, true);
  pruef('und der Block ist offen', figZusatz(fig('noergel')).map(z => z.z1).includes(noeBlock.zeilen[0].z1), true);
  pruef('der Reiter nennt den Strang als erledigt',
        langBestandBlock().includes('gezeichnet. Der Fall ist aktenkundig'), true);
  kladde.lang = {};
  pruef('vorher nennt der Reiter ihn nicht', langBestandBlock().includes('Praktikumsbericht'), false);
  pruef('und Noergels Block ist zu', figZusatz(fig('noergel')).map(z => z.z1).includes(noeBlock.zeilen[0].z1), false);
  pruef('Lisbeth hat vorher keine Zusatzzeile aus dem Strang', langZusatz('lisbeth'), []);
  // Auf halber Strecke gibt es die Belohnung nicht, aber eine Bestandszeile.
  kladde.lang = {bericht: 4};
  pruef('auf Stufe 4 zaehlt der Reiter mit', langBestandBlock().includes('4 von 8'), true);
  pruef('auf Stufe 4 gibt es noch keine Zusatzzeilen', langZusatz('lisbeth'), []);

  // --- Praezedenzfall im Finale --------------------------------------------
  const teil = VORGANG_PUZZLE[3];
  kladde.lang = {};
  pruef('ohne Fall steht der Wortlaut aus Kapitel 9 da',
        teil.frei() === false && vorgangPanelHtml(5).includes('Meine Entpflichtung wurde nie bearbeitet'), true);
  pruef('ohne Fall nennt das Finale keinen Praezedenzfall',
        vorgangPanelHtml(5).includes('aktenkundig'), false);
  kladde.lang = {bericht: rohEnde};
  pruef('mit Fall nennt es ihn', teil.frei() === true && vorgangPanelHtml(5).includes('Der Fall ist aktenkundig'), true);
  pruef('und der Wortlaut aus Kapitel 9 steht weiter da',
        vorgangPanelHtml(5).includes('Meine Entpflichtung wurde nie bearbeitet'), true);
  pruef('der Zusatz nennt den Zeichnenden bei seiner Amtsbezeichnung',
        vorgangPanelHtml(5).includes('Sachbearbeiter auf Probe'), true);

  // --- Keine Sperre ---------------------------------------------------------
  // Dieselbe Aussage wie langAssert() Punkt (4), nur live und gezielt auf den
  // einen Strang, den Kapitel 10 als Ausnahme fuehrt: erzaehlerisch notwendig,
  // mechanisch nirgends Bedingung.
  kladde.lang = {}; amt.schichten = 40; kladde.vorgang = {1:true, 2:true, 3:true, 4:true};
  pruef('Zustellen geht ohne den Strang', vorgangZustellbar(), true);
  const sperrt = [];
  for(const s in SERIE_AKT){ amt.schichten = SERIE_AKT[s] * 10; if(!serieFrei(s)) sperrt.push(s); }
  amt.schichten = 200;
  for(const k in AUFTRAG_TYPEN) if(AUFTRAG_TYPEN[k].wenn && !AUFTRAG_TYPEN[k].wenn()) sperrt.push(k);
  pruef('keine Blattserie und kein Auftragstyp haengt an ihm', sperrt, []);
  pruef('der Strang steht in keinem Prädikat',
        [vorgangAdressAkt(), rangZeichnungsbefugt()], [true, true]);

  // --- Inertheit ------------------------------------------------------------
  CONFIG.schichtModus = false; kladde.lang = {};
  for(const k of BERICHT_DRAN) langAnsprechen(k);
  pruef('ohne Schichtmodus schreibt er nichts', kladde.lang, {});
  kladde.lang = {bericht: rohEnde};
  pruef('ohne Schichtmodus ist er nie fertig', langFertig('bericht'), false);
  pruef('ohne Schichtmodus zeigt der Reiter nichts', langBestandBlock(), '');
  pruef('ohne Schichtmodus gibt es keine Zusatzzeilen', langZusatz('lisbeth'), []);
  pruef('ohne Schichtmodus nennt das Finale keinen Fall',
        vorgangPanelHtml(5).includes('aktenkundig'), false);

  } finally { zurueck(); }
  pruef('der echte Spielstand ist unberuehrt',
        localStorage.getItem(KLADDE_KEY), sicherung.roh);
  return raus;
});

// --- Und derselbe Weg noch einmal in der Welt, mit der Taste ----------------
// Alles oben laeuft ueber langAnsprechen(). Diese Runde geht ueber die
// Kontextaktion an der Kachel, damit auch die Sprechblase belegt ist und nicht
// nur der Rueckgabewert.
const welt = await page.evaluate(async () => {
  const raus = [];
  const pruef = (name, ist, soll) => raus.push({name, ist, soll, ok: JSON.stringify(ist) === JSON.stringify(soll)});
  const roh = localStorage.getItem(KLADDE_KEY);
  const sich = {schichtModus: CONFIG.schichtModus, schichten: amt.schichten, lang: JSON.stringify(kladde.lang)};
  try {
    CONFIG.schichtModus = true; amt.schichten = 25; kladde.lang = {}; langSchicht = {};
    const n = npcs.find(x => x.key === 'lisbeth');
    pruef('Lisbeth steht als Kachel im Dorf', !!n, true);
    if(n){
      const vorIdx = n.bubbleIdx;
      npcSprechen(n);
      pruef('ihre Sprechblase traegt den ersten Beat', [n.bubbleText1, n.bubbleText2],
            [BERICHT_BEATS[0].z1, BERICHT_BEATS[0].z2]);
      pruef('der Zeiger auf die Grundzeilen bleibt dabei stehen', n.bubbleIdx, vorIdx);
      npcSprechen(n);
      pruef('der zweite Druck faellt in den Kreislauf', n.bubbleIdx, vorIdx + 1);
      pruef('und der Strang steht weiter auf Stufe 1', langStufe('bericht'), 1);
    }
  } finally {
    CONFIG.schichtModus = sich.schichtModus; amt.schichten = sich.schichten;
    kladde.lang = JSON.parse(sich.lang);
    if(roh === null) localStorage.removeItem(KLADDE_KEY); else localStorage.setItem(KLADDE_KEY, roh);
  }
  return raus;
});

await browser.close();
const alle = zeilen.concat(welt);
let fehl = 0;
for(const z of alle){
  if(!z.ok) fehl++;
  console.log(`${z.ok ? 'ok  ' : 'FEHL'}  ${z.name.padEnd(58)} ist=${JSON.stringify(z.ist)} soll=${JSON.stringify(z.soll)}`);
}
if(laut.length){ console.log('\nKonsole:'); for(const l of laut) console.log('  ' + l); }
console.log(`\n${alle.length - fehl} von ${alle.length} Pruefungen bestanden.`);
process.exit(fehl || laut.length ? 1 : 0);
