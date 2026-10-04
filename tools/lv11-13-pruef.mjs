// Pruefprotokoll zu den Langvorgaengen 11, 12 und 13 (phase-lv11-13-langvorgaenge.md):
// der Eimer, der richtige Wortlaut, einundvierzig Blaetter.
//
//   python3 serve.py &
//   node tools/lv11-13-pruef.mjs [URL]
//
// langAssert() prueft die Tabellenform, die Abschliessbarkeit, die Deckel und
// die Blockadefreiheit aller Straenge. Was er nicht sieht, weil es Spielzuege
// sind, steht hier:
//
//   der Eimer       Nieselbeck sagt, wo; eine Truhe im Frostkamm gibt die
//                   Veranlassung her, eine im Grasland nicht; vorher sagt er
//                   nichts weiter, danach drei Saetze; Belohnung ist kein Bonus,
//                   sondern der Abspann: der Regen zwei Bilder frueher, der Hut
//                   auf, die Hymne an derselben Stelle
//   der Wortlaut    sieben Beats, abwechselnd Bramsche und Pommer, wer nicht
//                   dran ist, rueckt nichts vor; Anlage 3 geht bei Bramsche vor;
//                   das vierte Finale-Teil nennt die Archivausfertigung erst
//                   danach, und der Kanon aus Kapitel 9 steht in jeder Fassung
//   die Blaetter    die Schublade zaehlt vierzig, der Stempel den
//                   einundvierzigsten, und nicht umgekehrt; die fuenfte Antwort
//                   in Szene 7 steht nur mit den vierzig in der Liste, die Tafel
//                   bleibt bei vier Zeilen; Vorblatts drei Saetze stehen woertlich
//   die Heilung     ein Altbestand mit gespielter Schublade bekommt die vierzig
//                   beim Laden nachgezogen
//   Zusatzzeilen    je zwei bei Nieselbeck, Bramsche, Pommer und Vorblatt, erst
//                   nach dem Strang
//   keine Sperre    Zustellen, Blattserien und Auftragstypen bleiben ohne die
//                   drei erreichbar; bei schichtModus=false schreibt keiner
//
// Der Lauf stellt fest statt zu messen; Exit-Code 1 bei der ersten Abweichung.
// Der echte Spielstand wird gesichert und zurueckgestellt, weil langEreignis()
// saveKladde() ruft.
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;

const URL = process.argv[2] || 'http://127.0.0.1:8378/index.html';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();

const laut = [];
page.on('pageerror', e => laut.push('pageerror: ' + String(e).slice(0, 200)));
page.on('console', m => {
  if(m.type() !== 'error' && m.type() !== 'warning') return;
  if(m.text().includes('404') || m.text().includes('Sprite fehlt')) return;
  laut.push(m.type() + ': ' + m.text().slice(0, 200));
});

await page.goto(URL, { waitUntil: 'load' });
await page.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });

const zeilen = await page.evaluate(() => {
  const raus = [];
  const pruef = (name, ist, soll) => raus.push({name, ist, soll, ok: JSON.stringify(ist) === JSON.stringify(soll)});
  const fig = k => DORF_FIGUREN.find(f => f.key === k);
  const strip = html => String(html).replace(/<[^>]+>/g, ' ');

  const sicherung = {
    schichtModus: CONFIG.schichtModus, schichten: amt.schichten,
    lang: JSON.stringify(kladde.lang), vorgang: JSON.stringify(kladde.vorgang),
    roh: localStorage.getItem(KLADDE_KEY),
    vorblatt: kn.flags.szeneVorblatt, schublade: kn.flags.szeneSchublade, versuchung: kn.flags.szeneVersuchung,
    knRoh: localStorage.getItem(KN_KEY),
  };
  const zurueck = () => {
    CONFIG.schichtModus = sicherung.schichtModus; amt.schichten = sicherung.schichten;
    kladde.lang = JSON.parse(sicherung.lang); kladde.vorgang = JSON.parse(sicherung.vorgang);
    kn.flags.szeneVorblatt = sicherung.vorblatt; kn.flags.szeneSchublade = sicherung.schublade; kn.flags.szeneVersuchung = sicherung.versuchung;
    if(sicherung.roh === null) localStorage.removeItem(KLADDE_KEY); else localStorage.setItem(KLADDE_KEY, sicherung.roh);
    if(sicherung.knRoh === null) localStorage.removeItem(KN_KEY); else localStorage.setItem(KN_KEY, sicherung.knRoh);
  };

  try {
  CONFIG.schichtModus = true;

  // --- Tabelle ---------------------------------------------------------------
  pruef('drei neue Straenge in der Tabelle', ['eimer','wortlaut','bescheide'].map(k => k in LANGVORGAENGE), [true, true, true]);
  pruef('zwoelf Straenge insgesamt', Object.keys(LANGVORGAENGE).length, 12);
  pruef('der Wortlaut steht hinter Anlage 3', Object.keys(LANGVORGAENGE).indexOf('wortlaut') > Object.keys(LANGVORGAENGE).indexOf('anlage3'), true);
  pruef('die Figuren der drei Straenge', [LANGVORGAENGE.eimer.figur, LANGVORGAENGE.wortlaut.figur, LANGVORGAENGE.bescheide.figur], ['nieselbeck','bramsche','vorblatt']);

  // --- Der Eimer -------------------------------------------------------------
  amt.schichten = 25; kladde.lang = {}; langSchicht = {};
  pruef('Eimer: vor Akt II still', (amt.schichten = 5, LANGVORGAENGE.eimer.wenn()), false);
  amt.schichten = 25;
  pruef('Eimer: ab Akt II offen', LANGVORGAENGE.eimer.wenn(), true);
  let z = langAnsprechen('nieselbeck');
  pruef('Eimer 1: Nieselbeck sagt, wo', [z && z.z1, langStufe('eimer')], [EIMER_BEATS[0].z1, 1]);
  pruef('Eimer: ohne Veranlassung sagt er nichts weiter', [langAnsprechen('nieselbeck'), langStufe('eimer')], [null, 1]);
  langEreignis('kammer', {biome:'grass', diff:1});
  pruef('Eimer: eine Grasland-Truhe gibt nichts her', langRoh('eimer') & EIMER_VLG, 0);
  langEreignis('kammer', {biome:'snow', diff:1});
  pruef('Eimer: eine Frostkamm-Truhe gibt die Veranlassung her', langRoh('eimer') & EIMER_VLG, EIMER_VLG);
  pruef('Eimer: der Reiter sagt es', langBestandBlock().includes('aus dem Frostkamm geholt'), true);
  const rest = [2, 3, 4].map(st => { const f = langAnsprechen('nieselbeck'); return [f && f.z1, langStufe('eimer')]; });
  pruef('Eimer 2 bis 4: drei Saetze, dann fertig', rest, [2, 3, 4].map(st => [EIMER_BEATS[st - 1].z1, st]));
  pruef('Eimer: fertig', langFertig('eimer'), true);
  pruef('Eimer: nichts bewegt sich mehr', [langAnsprechen('nieselbeck'), langRoh('eimer')], [null, 4 | EIMER_VLG]);
  const eimerBlock = fig('nieselbeck').zusatz.find(zz => zz.lang === 'eimer');
  pruef('Nieselbeck hat zwei Zusatzzeilen am Schalter lang', eimerBlock ? eimerBlock.zeilen.length : 0, 2);
  pruef('und sie sind offen', figZusatz(fig('nieselbeck')).map(zz => zz.z1).includes(eimerBlock.zeilen[0].z1), true);
  pruef('Eimer: der Reiter nennt ihn erledigt und ohne Bonus', langBestandBlock().includes('Kein Bonus'), true);
  // Der Abspann, beide Zustaende.
  const mit = abspannBlaetter(); kladde.lang = {}; const ohne = abspannBlaetter();
  const regenBei = l => l.findIndex(b => b.blatt && b.blatt.startsWith('Und dann regnet es'));
  pruef('Abspann: dreizehn Bilder in beiden Fassungen', [ohne.length, mit.length], [13, 13]);
  pruef('Abspann ohne Eimer: der Regen ist das zehnte Bild', regenBei(ohne), 9);
  pruef('Abspann mit Eimer: der Regen ist das achte Bild', regenBei(mit), 7);
  pruef('Abspann mit Eimer: Nieselbeck hat den Hut auf', mit[7].regie.includes('hat den Hut auf'), true);
  pruef('Abspann ohne Eimer: kein Hut', ohne[9].regie.includes('Hut'), false);
  pruef('Abspann: die Meldung ist in beiden Fassungen dieselbe', [ohne[9].stimme[0].z, mit[7].stimme[0].z], ['Gemeldet wird: Niederschlag.', 'Gemeldet wird: Niederschlag.']);
  pruef('Abspann: die Hymne bleibt an Index 11', [ohne[11].z1.includes('Amtshymne'), mit[11].z1.includes('Amtshymne')], [true, true]);
  pruef('Abspann: die uebrigen Bilder stehen in derselben Reihenfolge',
        ohne.filter((b, i) => i !== 9).map(b => b.z1 || b.blatt), mit.filter((b, i) => i !== 7).map(b => b.z1 || b.blatt));

  // --- Der richtige Wortlaut ------------------------------------------------
  amt.schichten = 25; kladde.lang = {anlage3: 99}; langSchicht = {};   // Anlage 3 fertig, damit Bramsche frei ist
  const anlageEnde = (() => { let r = 0; for(let i = 0; i < 20; i++) r = LANGVORGAENGE.anlage3.schritt('ansprechen', {key:'bramsche'}, r); return r; })();
  kladde.lang = {anlage3: anlageEnde};
  pruef('Wortlaut: vor Akt III still', (amt.schichten = 15, LANGVORGAENGE.wortlaut.wenn()), false);
  amt.schichten = 25;
  const kette = [];
  for(let i = 0; i < WORTLAUT_DRAN.length; i++){
    const dran = WORTLAUT_DRAN[i], falsch = dran === 'bramsche' ? 'pommer' : 'bramsche';
    const f = langAnsprechen(falsch);
    const r = langAnsprechen(dran);
    kette.push([f === null || !WORTLAUT_BEATS.some(b => b.z1 === f.z1), r && r.z1, langStufe('wortlaut')]);
  }
  pruef('Wortlaut: sieben Beats, abwechselnd, wer nicht dran ist, rueckt nichts vor',
        kette, WORTLAUT_DRAN.map((_, i) => [true, WORTLAUT_BEATS[i].z1, i + 1]));
  pruef('Wortlaut: fertig', langFertig('wortlaut'), true);
  for(const b of fig('bramsche').zusatz.concat(fig('pommer').zusatz).filter(zz => zz.lang === 'wortlaut'))
    pruef('Zusatzzeilen offen nach dem Wortlaut (' + b.zeilen[0].z1.slice(0, 20) + ')', b.zeilen.length, 2);
  pruef('Bramsche und Pommer haben je einen Block am Schalter wortlaut',
        [fig('bramsche').zusatz.filter(zz => zz.lang === 'wortlaut').length, fig('pommer').zusatz.filter(zz => zz.lang === 'wortlaut').length], [1, 1]);
  // Anlage 3 geht vor: mit offener Anlage 3 bekommt Bramsches erster Tastendruck deren Beat.
  kladde.lang = {}; langSchicht = {};
  const erst = langAnsprechen('bramsche');
  pruef('mit offener Anlage 3 kommt bei Bramsche erst Anlage 3', [langStufe('anlage3'), langStufe('wortlaut')], [1, 0]);
  // Das Finale, vier Fassungen.
  const finale = () => strip(vorgangPanelHtml(5));
  const KANON = 'Meine Entpflichtung wurde nie bearbeitet';
  kladde.lang = {};
  pruef('Finale ohne beides: Kanon, kein Zusatz', [finale().includes(KANON), finale().includes('Archivausfertigung'), finale().includes('aktenkundig')], [true, false, false]);
  kladde.lang = {wortlaut: WORTLAUT_BEATS.length};
  pruef('Finale mit Wortlaut: Kanon und Archivausfertigung', [finale().includes(KANON), finale().includes('Archivausfertigung aus Zimmer 4'), finale().includes('aktenkundig')], [true, true, false]);
  kladde.lang = {wortlaut: WORTLAUT_BEATS.length, bericht: BERICHT_BEATS.length};
  pruef('Finale mit beidem: Kanon, Praezedenzfall, Archivausfertigung', [finale().includes(KANON), finale().includes('aktenkundig'), finale().includes('Archivausfertigung')], [true, true, true]);
  pruef('Finale: der Kanon steht vorn', finale().indexOf(KANON) < finale().indexOf('aktenkundig'), true);
  pruef('Finale: vier Teile, nicht fuenf', VORGANG_PUZZLE.length, 4);

  // --- Einundvierzig Blaetter ------------------------------------------------
  amt.schichten = 35; kn.flags.szeneVorblatt = true; kladde.lang = {}; langSchicht = {};
  pruef('Blaetter: vor Akt III still', (amt.schichten = 15, LANGVORGAENGE.bescheide.wenn()), false);
  amt.schichten = 35;
  langEreignis('stempel', null);
  pruef('Blaetter: der Stempel allein zaehlt nicht', langRoh('bescheide'), 0);
  langEreignis('schublade', null);
  pruef('Blaetter: die Schublade zaehlt vierzig', [langRoh('bescheide'), langStufe('bescheide')], [40, 1]);
  pruef('Blaetter: der Reiter zaehlt 40 von 41', langBestandBlock().includes('40 von 41'), true);
  pruef('Blaetter: die fuenfte Antwort ist jetzt offen', bescheideVierzig(), true);
  langEreignis('schublade', null);
  pruef('Blaetter: die Schublade zaehlt nicht zweimal', langRoh('bescheide'), 40);
  langEreignis('stempel', null);
  pruef('Blaetter: der Stempel macht einundvierzig', [langRoh('bescheide'), langStufe('bescheide'), langFertig('bescheide')], [41, 2, true]);
  pruef('Blaetter: der Reiter nennt den Umschlag', langBestandBlock().includes('klebt auf dem Umschlag'), true);
  const vbBlock = fig('vorblatt').zusatz.find(zz => zz.lang === 'bescheide');
  pruef('Vorblatt hat zwei Zusatzzeilen am Schalter lang', vbBlock ? vbBlock.zeilen.length : 0, 2);
  pruef('und sie sind offen', figZusatz(fig('vorblatt')).map(zz => zz.z1).includes(vbBlock.zeilen[0].z1), true);
  // Szene 7: die Tafel am hub, mit und ohne die vierzig.
  const hubListe = () => {
    const merk = [szeneAktiv, szene.knoten, szene.gefragt];
    szeneAktiv = 'versuchung'; szene.knoten = 'hub'; szene.gefragt = new Set();
    const o = szeneOptionen().map(x => x.t);
    szeneAktiv = merk[0]; szene.knoten = merk[1]; szene.gefragt = merk[2];
    return o;
  };
  kladde.lang = {};
  pruef('Szene 7 ohne die vierzig: drei Fragen und der Ausgang', hubListe(), ['Was muss ich lassen?', 'Warum ist Ihnen das wert?', 'Und wenn ich zustelle?', 'Nichts sagen.']);
  kladde.lang = {bescheide: 40};
  const mitVierzig = (() => {
    const merk = [szeneAktiv, szene.knoten, szene.gefragt];
    szeneAktiv = 'versuchung'; szene.knoten = 'hub'; szene.gefragt = new Set(['lassen']);
    const o = szeneOptionen().map(x => x.t);
    szeneAktiv = merk[0]; szene.knoten = merk[1]; szene.gefragt = merk[2];
    return o;
  })();
  pruef('Szene 7 mit den vierzig: die fuenfte Antwort rueckt nach, die Tafel bleibt bei vier', mitVierzig, ['Warum ist Ihnen das wert?', 'Und wenn ich zustelle?', 'Einundvierzig Jahre Arbeit.', 'Nichts sagen.']);
  pruef('Szene 7 mit den vierzig, nichts gefragt: weiter vier Zeilen', hubListe().length, 4);
  const jahre = SZENEN.versuchung.fragen.find(f => f.key === 'jahre');
  pruef('Vorblatts drei Saetze stehen woertlich',
        [jahre.z1, jahre.z2, SZENEN.versuchung.knoten[jahre.weiter].z1],
        ['Ja.', 'Und es ist nichts davon geschehen. Das war die Leistung.', 'Ich habe das lange für dasselbe gehalten.']);
  pruef('die Spielerzeile haelt den Antwortdeckel', [jahre.t.length <= ANTWORT_DECKEL, jahre.wt.length <= ANTWORT_DECKEL], [true, true]);
  // Die Heilung beim Laden: Merker da, Rohwert 0.
  kladde.lang = {}; kn.flags.szeneSchublade = true; kn.flags.szeneVersuchung = false;
  // bescheideMigration() laeuft beim Laden; hier wird ihr Rumpf nachgestellt.
  (function(){ let roh = langRoh('bescheide'); if(kn.flags.szeneSchublade && roh < 40) roh = 40; if(kn.flags.szeneVersuchung && roh >= 40 && roh < 41) roh = 41; if(roh !== langRoh('bescheide')) kladde.lang.bescheide = roh; })();
  pruef('Heilung: gespielte Schublade zieht die vierzig nach', langRoh('bescheide'), 40);

  // --- Keine Sperre, Inertheit ---------------------------------------------------
  kladde.lang = {}; amt.schichten = 40; kladde.vorgang = {1:true, 2:true, 3:true, 4:true};
  const geschlossenEcht = amt.vorgangGeschlossen; amt.vorgangGeschlossen = 0;
  pruef('Zustellen geht ohne die drei Straenge', vorgangZustellbar(), true);
  amt.vorgangGeschlossen = geschlossenEcht;
  CONFIG.schichtModus = false; kladde.lang = {};
  for(const was of ['ansprechen','kammer','schublade','stempel']) langEreignis(was, {key:'nieselbeck', biome:'snow'});
  pruef('schichtModus=false: keiner der drei schreibt', kladde.lang, {});
  pruef('schichtModus=false: die fuenfte Antwort ist zu', bescheideVierzig(), false);
  } finally { zurueck(); }
  return raus;
});

// Der Fund dieses Abschnitts, als Quelltextpruefung: ein Objektliteral mit zwei
// gleichen Schluesseln ist gueltiges JavaScript, und der letzte gewinnt. Bramsche
// trug zweimal zusatz, ihre SZ3-Zeilen waren seit dem Einbau nie im Spiel, und
// kein Guard sieht das, weil jeder die Tabelle nach dem Parsen liest. Also hier,
// vor dem Parsen: je Figur in DORF_FIGUREN hoechstens ein Schluessel je Name.
import { readFileSync } from 'node:fs';
{
  const quelle = readFileSync(new globalThis.URL('../skript/02-dorf-und-welt.js', import.meta.url), 'utf8')   // URL ist oben die Seitenadresse;
  const a = quelle.indexOf('const DORF_FIGUREN'), b = quelle.indexOf('\n];', a);
  const blk = quelle.slice(a, b);
  const koepfe = [...blk.matchAll(/\n  \{key:'([a-z0-9]+)'/g)].map(m => ({key: m[1], at: m.index}));
  const doppelt = [];
  koepfe.forEach((k, i) => {
    const seg = blk.slice(k.at, i + 1 < koepfe.length ? koepfe[i + 1].at : blk.length);
    const props = [...seg.matchAll(/\n   ([a-zA-Z]+):/g)].map(m => m[1]);
    for(const pr of new Set(props)) if(props.filter(x => x === pr).length > 1) doppelt.push(k.key + '.' + pr);
  });
  zeilen.push({name: 'keine Figur traegt einen Schluessel zweimal (Quelltext)', ist: doppelt, soll: [], ok: doppelt.length === 0});
  zeilen.push({name: 'die Quelltextpruefung sieht alle vierzehn Figuren', ist: koepfe.length, soll: 14, ok: koepfe.length === 14});
}

let fehl = 0;
for(const z of zeilen){ if(!z.ok) fehl++; console.log(`${z.ok ? 'ok  ' : 'FEHL'}  ${z.name.padEnd(74)} ist=${JSON.stringify(z.ist)} soll=${JSON.stringify(z.soll)}`); }
if(laut.length){ console.log('\nKonsole:'); for(const l of laut) console.log('  ' + l); }
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
await browser.close();
process.exit(fehl || laut.length ? 1 : 0);
