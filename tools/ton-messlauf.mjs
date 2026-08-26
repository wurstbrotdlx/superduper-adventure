// Messlauf zum Bauabschnitt T5: wie amtlich redet dieses Spiel?
//
//   python3 serve.py &
//   node tools/ton-messlauf.mjs [URL] [--treffer] [--quelle NAME]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt.
//
// Der Grund fuer dieses Werkzeug: Grundgesetz 3 verlangt seit dem 26.08.2026
// eine Mischung, rund drei von zehn Zeilen amtlich und sieben normal. Das ist
// eine Zahl, und Zahlen schaetzt man in diesem Projekt nicht. Bis hierher gab
// es keinen Prueflauf, der Ton misst: die Guards zaehlen Zeichen, pruefen
// Erreichbarkeit und Tabellenvollstaendigkeit, und keiner von ihnen kann lesen.
//
// GRAFIK IST NICHT NOETIG. Der Lauf liest Tabellen auf Skriptebene und wartet
// deshalb weder auf frameNo noch auf assetsReady. Im frischen Klon ohne
// assets/cf/ laeuft er unveraendert durch.
//
// WAS ER NICHT IST: eine Wahrheit. Amtsdeutsch zu erkennen ist eine Heuristik
// aus Wortliste, Nominalstil und Satzbaumustern, und sie irrt in beide
// Richtungen. Sie ist trotzdem besser als das Gefuehl beim Lesen, weil sie
// jedes Mal gleich irrt und damit Veraenderung sichtbar macht. Wer eine
// Einstufung nicht glaubt, ruft --treffer und sieht die Zeilen selbst.
//
// AUSGENOMMENE FIGUREN. Grundgesetz 3 nimmt Figuren aus, deren Sprachmarke der
// Amtston selbst ist (Kapitel 8). Sie stehen unten in SPRACHMARKE_AMTLICH und
// werden getrennt ausgewiesen statt in den Schnitt gerechnet. Wer diese Liste
// aendert, aendert eine Kanon-Aussage und nicht eine Einstellung.
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const URL = args.find(a => a.startsWith('http')) || 'http://127.0.0.1:8378/index.html';
const ZEIG_TREFFER = args.includes('--treffer');
const NUR_QUELLE = args.includes('--quelle') ? args[args.indexOf('--quelle') + 1] : null;

const ZIEL = 0.30;          // Grundgesetz 3: rund drei von zehn
const TOLERANZ = 0.08;      // "rund" ist keine Nachkommastelle

// Figuren, deren Sprachmarke der Amtston ist. Kapitel 8, nicht Geschmack.
const SPRACHMARKE_AMTLICH = ['bramsche', 'milb', 'vorblatt', 'umlauf'];

// ---------------------------------------------------------------------------
// Die Quellen. Zwei Klassen, und die Trennung ist die Formregel "Das Register
// haengt am Ort, nicht am Haus": spricht hier jemand, oder spricht das Spiel?
// ---------------------------------------------------------------------------
const QUELLEN = [
  // --- Es spricht jemand: Grundgesetz 3 gilt, Zielwert 30 Prozent ---
  { name: 'Dorffiguren',      art: 'figur', ausdruck: 'DORF_FIGUREN', jeFigur: true },
  { name: 'Knoeterich',       art: 'figur', ausdruck: 'KN_FIGUR' },
  { name: 'Anlage 2, Band',   art: 'figur', ausdruck: 'ANLAGE2_NOTIZ' },
  { name: 'Anlage 2, Umschlag', art: 'figur', ausdruck: 'ANLAGE2_UMSCHLAG' },
  { name: 'Anlage 2, Bewegung', art: 'figur', ausdruck: 'ANLAGE2_BEWEGUNG' },
  { name: 'Anlage 2, Blaetter', art: 'figur', ausdruck: 'ANLAGE2_BLAETTER' },
  { name: 'Szenen',           art: 'figur', ausdruck: 'SZENEN' },
  { name: 'Langvorgaenge',    art: 'figur', ausdruck: 'LANGVORGAENGE' },
  { name: 'Empfang',          art: 'figur', ausdruck: 'EMPFANG_KNOTEN' },
  { name: 'Traenke-Gags',     art: 'figur', ausdruck: 'KN_TRAENKE_GAGS' },
  { name: 'Dienstzettel',     art: 'figur', ausdruck: 'DIENSTBLATT' },
  { name: 'Dienstbemerkungen', art: 'figur', ausdruck: 'DIENST_BEMERKUNGEN' },
  { name: 'Auftragsbemerkungen', art: 'figur', ausdruck: 'AUFTRAG_BEMERKUNGEN' },
  { name: 'Dorffest-Absagen', art: 'figur', ausdruck: 'DORFFEST_ABSAGEN' },
  { name: 'Probezeit',        art: 'figur', ausdruck: 'PROBEZEIT_BEATS' },
  { name: 'Giesskanne',       art: 'figur', ausdruck: 'GIESSKANNE_BEATS' },
  { name: 'Kaffee',           art: 'figur', ausdruck: 'KAFFEE_BEATS' },
  { name: 'Gutachter',        art: 'figur', ausdruck: 'GUTACHTER_BEATS' },
  { name: 'Praktikumsbericht', art: 'figur', ausdruck: 'BERICHT_BEATS' },
  { name: 'Hintermuehl',      art: 'figur', ausdruck: 'HINTERMUEHL_BEATS' },
  { name: 'Anlage 3',         art: 'figur', ausdruck: 'ANLAGE3_BEATS' },

  // --- Es spricht das Spiel: normales Deutsch, Zielwert 0 ---
  { name: 'Hausmitteilung',   art: 'spiel', ausdruck: 'NEUERUNGEN' },
  { name: 'Hinweise',         art: 'spiel', ausdruck: 'HINWEISE' },
  { name: 'Speicherkasten',   art: 'spiel', ausdruck: 'SPEICHER_HINWEIS' },
  { name: 'Menuefenster',     art: 'spiel', ausdruck: 'GROSSFENSTER' },
  { name: 'Ausweis',          art: 'spiel', ausdruck: 'AUSWEIS_TEXTE' },
  { name: 'Probezeit-Hinweise', art: 'spiel', ausdruck: 'PROBEZEIT_HINWEISE' },
  { name: 'Vorgangspuzzle',   art: 'spiel', ausdruck: 'VORGANG_PUZZLE' },

  // --- Gezeigtes Dokument: ausgenommen, der Amtston ist hier der Gegenstand ---
  { name: 'Intro-Blaetter',   art: 'dokument', ausdruck: 'INTRO_BLAETTER' },
  { name: 'Ernennungsurkunde', art: 'dokument', ausdruck: 'ERNENNUNG_BLAETTER' },
  { name: 'Zulagenkarten',    art: 'dokument', ausdruck: 'ZULAGE' },
];

// ---------------------------------------------------------------------------
// Die Heuristik
// ---------------------------------------------------------------------------
// STARK: ein Treffer genuegt. Woerter und Wendungen, die ausserhalb einer
// Behoerde praktisch nicht vorkommen.
const STARK = [
  /\b(vorgang|vorgaeng|vorgäng)/i, /\bvermerk/i, /\bbescheid/i, /\bverfueg|\bverfüg/i,
  /\bzustaendig|\bzuständig/i, /\bunzustaendig|\bunzuständig/i, /\bausfertigung/i,
  /\bbeglaubig/i, /\bvordruck/i, /\baktenzeichen/i, /\bdienstweg/i, /\bsachverhalt/i,
  /\bnebenbestimmung/i, /\bbewilligung/i, /\bwiderspruch/i, /\bnachforderung/i,
  /\bregistratur/i, /\bweisungsbefugt/i, /\bniederschrift/i, /\brechtsbehelf/i,
  /\bantragstell/i, /\bfristgerecht/i, /\bbestandskraft/i, /\bsperrvermerk/i,
  /\bzwischenbescheid/i, /\bschriftstueck|\bschriftstück/i, /\bumlauf(en|end)?\b/i,
  /\bgemäß\b|\bgemaess\b/i, /\bvorbehaltlich\b/i, /\bunbeschadet\b/i, /\bhiermit\b/i,
  /\bnach\s+maßgabe\b/i, /\bim\s+sinne\s+(des|der)\b/i, /\bzur\s+kenntnis\b/i,
  /\bin\s+kenntnis\s+(zu\s+)?setzen\b/i, /\bzu\s+den\s+akten\b/i, /\bab\s?zeichnen\b/i,
  /\bdienstauf(sicht|trag)/i, /\bamtlich/i, /\bbeizufuegen|\bbeizufügen/i,
  /\bordnungsgemäß|\bordnungsgemaess/i, /\bveranlassung/i, /\berledigungsvermerk/i,
];

// SCHWACH: zwei Treffer machen eine Zeile amtlich. Einzeln stehen sie auch in
// normalem Deutsch.
const SCHWACH = [
  /\bantrag/i, /\bakte/i, /\bablage/i, /\bfrist/i, /\bziffer\b/i, /\babsatz\b/i,
  /\banlage/i, /\bauflage/i, /\bbearbeit/i, /\berledig/i, /\bpruef|\bprüf/i,
  /\bdienst/i, /\bstelle\b/i, /\bformular/i, /\bunterschrift/i, /\bstempel/i,
  /\bverfahren/i, /\bhaus\b/i, /\bmitteil/i, /\bschreiben\b/i, /\beingang/i,
  /\bvorlage/i, /\bziffern\b/i, /\bbetreff/i, /\bkraft\s+(des|der)\b/i,
  // Nominalstil: drei oder mehr Substantive auf -ung/-heit/-keit in einer Zeile
  // faengt der Zaehler weiter unten ab, nicht dieses Muster.
  /\bist\s+zu\s+[a-zäöüß]+en\b/i,            // "ist zu bearbeiten"
  /\bwird\s+[a-zäöüß]+t\s+werden\b/i,        // Futur Passiv
  /\bwurde[nst]?\s+[a-zäöüß]+(t|en)\b/i,     // Passiv Praeteritum
  /\bseitens\b/i, /\bbetreffend\b/i, /\bderzeit\b/i, /\bsodann\b/i, /\bmithin\b/i,
];

// DUKTUS: der zweite und wichtigere Weg, und er ist bei der ersten Fassung
// dieses Laufs uebersehen worden. Der Befund dahinter steht in
// `phase-t5-ton.md`, Abschnitt 3: dieses Spiel macht sein Amtsdeutsch fast
// nie ueber Fachvokabular, sondern ueber den Satzbau. Der Zeichendeckel von 44
// laesst gar keine Behoerdenwoerter zu, also ist der Ton in die Form gewandert.
// Eine reine Wortliste misst hier 6 Prozent und liegt damit sichtbar falsch.
// STARKER Duktus: einer genuegt. Muster, die ausserhalb einer Behoerde kaum
// vorkommen. Die Ellipse ganz oben ist das haeufigste Amtsmuster dieses Spiels
// ueberhaupt und war in der ersten Fassung dieses Laufs nicht drin.
const DUKTUS_STARK = [
  // "Antrag fuer heute erledigt." "Bei der Uebergabe." "Berechtigt, wie meistens."
  // Ein Satz ohne Subjekt und ohne finites Vollverb. Genaehert: kurz, kein
  // Nominativpronomen, kein haeufiges finites Verb.
  { n: 'ellipse', pruef: z => {
      // Nur der letzte Teilsatz zaehlt: "Sechs Zeilen. Genuegt seit je." ist im
      // Ganzen normal, und der Lauf soll nicht an seiner zweiten Haelfte haengen.
      const teile = z.split(/(?<=[.!?…])\s+/).filter(Boolean);
      return teile.some(t => {
        const s = t.replace(/[.!?…]+\s*$/, '').trim();
        const w = s.split(/\s+/);
        if (w.length < 2 || w.length > 7) return false;
        if (/[?!]/.test(t)) return false;
        // Ein Subjekt am Anfang macht daraus einen gewoehnlichen Satz.
        if (/^(ich|du|er|sie|es|wir|ihr|man|das|der|die|den|dem|ein|eine|und|aber|denn|so|nur|auch|noch|wie|da|dann|jetzt)$/i.test(w[0])) return false;
        // Ein reiner Bewertungssatz ist keine Amtsellipse, sondern eine Meinung:
        // "Sehr nett." "Eine Stufe zu viel." "Beeindruckend."
        if (!/\b(in|auf|bei|für|mit|ohne|nach|zu|zur|zum|von|vom|über|unter|gegen|laut|ab)\b/i.test(s)
            && !/[A-ZÄÖÜ][a-zäöüß]{4,}(ung|trag|schrift|stand|gang|weg|sache|frist|akte|blatt|bericht|dienst|amt)\b/.test(s))
          return false;
        return !/\b(ist|sind|war|waren|bin|hat|habe|haben|kann|könnte|wird|werden|geht|kommt|bleibt|macht|sagt|will|muss|darf|gibt|liegt|sieht|hält)\b/i.test(s);
      });
    } },
  // "Ordnung ist, was man wiederfindet." "Stehen ist keine Verzoegerung."
  { n: 'definition', r: /\bist,\s+was\b|^Was\s+[^,]{3,44},\s+(ist|gilt|bleibt|existiert)\b|^[A-ZÄÖÜ][a-zäöüß]+en\s+ist\s+(kein|keine|k?ein)\b/i },
  // "Notiert." "Vermerkt." "Berechtigt, wie meistens." Partizip traegt den Satz.
  { n: 'partizip', r: /(^|[.!?]\s)(Ge[a-zäöüß]{3,}t|[A-ZÄÖÜ][a-zäöüß]{3,}iert|Notiert|Vermerkt|Bestellt|Erledigt|Abgelegt|Berechtigt|Genehmigt|Bewilligt|Beantragt)\b[^.!?]{0,22}[.!?]/ },
  // "Zum Rueckblick:" "In welcher Sache" "Ohne Antrag" Vorangestelltes Amtsvorfeld.
  { n: 'vorfeld', r: /^(Zum|Zur|Ohne|Laut|Betreffend|Gemäß|In welcher|Im Falle|Vorbehaltlich|Ausweislich|Hinsichtlich|Bezüglich)\b/ },
];

// SCHWACHER Duktus: zwei zusammen, oder einer plus ein schwaches Wort.
const DUKTUS_SCHWACH = [
  { n: 'konditional', r: /\b(wäre|hätte|würde|dürfte|müsste|bedürfte|obläge)\b/ },
  { n: 'passiv',      r: /\b(ist|sind|war|waren|wird|werden)\s+(längst\s+|bereits\s+|noch\s+nicht\s+|nicht\s+|ordentlich\s+)?(ab|an|auf|aus|be|ent|er|ver|zu|vor|ein|ge)[a-zäöüß]{2,}(t|en)\b/ },
  { n: 'absage',      r: /\b(nichts|niemand|keinesfalls|keine[rnms]?)\b[^.!?]{0,24}[.!?]\s*$/ },
  { n: 'wiederholung', r: /\b([A-ZÄÖÜ][a-zäöüß]{4,})\b[^.!?]{0,12}\b\1\b/ },   // "Zustellung bleibt Zustellung."
];

function nominalStil(zeile) {
  const treffer = zeile.match(/[A-ZÄÖÜ][a-zäöüß]+(ung|heit|keit|nis|schaft)\b/g);
  return treffer ? treffer.length : 0;
}

// Rueckgabe: [] wenn normal, sonst die Gruende. Der erste Grund traegt die
// Klasse ('wort' oder 'duktus'), damit die Auswertung beide getrennt zaehlen
// kann. Beide Wege gelten, denn beide klingen fuer den Spieler nach Amt.
function istAmtlich(zeile) {
  for (const r of STARK)
    if (r.test(zeile)) return ['wort', 'stark:' + r.source.slice(0, 22)];

  const schwachGefunden = [];
  for (const r of SCHWACH)
    if (r.test(zeile)) schwachGefunden.push('schwach:' + r.source.slice(0, 18));
  const nom = nominalStil(zeile);
  if (nom >= 3) schwachGefunden.push('nominalstil:' + nom);
  if (schwachGefunden.length >= 2) return ['wort', ...schwachGefunden];

  const stark = DUKTUS_STARK.filter(d => d.pruef ? d.pruef(zeile) : d.r.test(zeile)).map(d => d.n);
  if (stark.length) return ['duktus', ...stark, ...schwachGefunden];

  const schwach = DUKTUS_SCHWACH.filter(d => d.r.test(zeile)).map(d => d.n);
  if (schwach.length >= 2 || (schwach.length === 1 && schwachGefunden.length >= 1))
    return ['duktus', ...schwach, ...schwachGefunden];

  return [];
}

// ---------------------------------------------------------------------------
// Die Eichprobe. 43 Zeilen aus dem Bestand, von Hand eingestuft am 26.08.2026,
// gezogen als jede 23. Zeile aus DORF_FIGUREN, ANLAGE2_NOTIZ und KN_FIGUR,
// damit die Auswahl nicht am Anfang der Tabellen klebt.
//
// Sie ist der Grund, warum diesem Lauf ueberhaupt zu glauben ist. Die erste
// Fassung der Heuristik meldete 6 Prozent, die Hand sagt 42, und ohne diese
// Liste haette niemand gemerkt, dass der Lauf danebenliegt. Wer die Muster
// oben aendert, laesst `--eichung` mitlaufen: eine Verbesserung, die hier
// schlechter wird, ist keine.
//
// 'A' heisst: klingt nach Amt. 'N' heisst: klingt normal. Die Zweifelsfaelle
// sind als solche vermerkt und wurden nach dem Erstlesen entschieden, nicht
// nachtraeglich passend gemacht.
const EICHPROBE = [
  ['Sie ist da. Die Bewilligung.', 'A'],
  ['Wie jeder. Es ist ja schön.', 'N'],
  ['In welcher Sache sprechen Sie mich an?', 'A'],
  ['Sie tragen mehr als beim ersten Mal.', 'N'],
  ['Wo ist die Amtsleitung?', 'N'],                       // Zweifel: Amtswort, normale Frage
  ['Wie wird der Rang gerechnet?', 'N'],                  // Zweifel: Passiv, normale Frage
  ['Der Bestand wurde geschlossen.', 'A'],
  ['Antrag für heute erledigt.', 'A'],
  ['Kaffee ist ein Betriebsrisiko.', 'A'],                // genau die Mischung, die Regel 3 will
  ['Gut. Ich habe zwei Hände.', 'N'],
  ['Es kostet Zeit.', 'N'],
  ['Steht in meinem Bericht.', 'A'],
  ['Auf jedem Deckblatt steht: vorläufig.', 'A'],
  ['Zustellung bleibt Zustellung.', 'A'],
  ['Bei der Übergabe. Nur die.', 'A'],
  ['Berechtigt, wie meistens.', 'A'],
  ['Auf Probe ist im Dienst.', 'A'],
  ['Krawatte sitzt. Habe ich geprüft.', 'N'],
  ['Sechs Zeilen. Genügt seit je.', 'N'],                 // Zweifel: knapp, aber nicht amtlich
  ['Ich habe das angesetzt.', 'N'],                       // Zweifel: mild amtliches Verb
  ['Beeindruckend. Eine Stufe zu viel.', 'N'],
  ['Zustellen steht nicht in meinem Bestand.', 'A'],
  ['So war das nicht gemeint.', 'N'],
  ['Und der Käse ist gut.', 'N'],
  ['Merke ich mir. Berufssache.', 'N'],
  ['Der Erste heute geht aufs Haus.', 'N'],
  ['Der Neue zählt Konfetti. Süß.', 'N'],
  ['Ein Titel. Sehr fein.', 'N'],
  ['Pahl duckt sich schon mal.', 'N'],
  ['Der Neue steht. Wie ich.', 'N'],
  ['Die Bank hält warm, wenn man ihr Zeit gibt.', 'N'],
  ['Wachsen ist ein guter Beruf, sagt man.', 'N'],
  ['Notieren Sie das, Lott.', 'A'],
  ['Reich geworden, wenn auch vorübergehend.', 'A'],      // Zweifel: Partizip plus Einschraenkung
  ['Lott sieht nur den Mantel.', 'N'],
  ['Das ist bemerkenswert.', 'N'],
  ['Stehen ist keine Verzögerung.', 'A'],
  ['Wirklich. Sehr nett.', 'N'],
  ['Da hält mich niemand auf.', 'N'],
  ['Ich bin für Anhängiges zuständig.', 'A'],
  ['Ihr Titel ist ordentlich erworben.', 'A'],
  ['Das nennt man Bearbeitung mit Nachdruck.', 'A'],
  ['Steht alles drin. Wie immer. Wie bei mir.', 'N'],
];

function eichen() {
  let richtig = 0, falschPositiv = 0, falschNegativ = 0;
  const daneben = [];
  for (const [z, soll] of EICHPROBE) {
    const ist = istAmtlich(z).length ? 'A' : 'N';
    if (ist === soll) richtig++;
    else {
      if (ist === 'A') falschPositiv++; else falschNegativ++;
      daneben.push([z, soll, ist]);
    }
  }
  const handAnteil = EICHPROBE.filter(e => e[1] === 'A').length / EICHPROBE.length;
  return { richtig, gesamt: EICHPROBE.length, falschPositiv, falschNegativ, daneben, handAnteil };
}

// ---------------------------------------------------------------------------
const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
const seitenFehler = [];
page.on('pageerror', e => seitenFehler.push(String(e).split('\n')[0]));
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(1500);

// Die Tabellen stehen im Skript-Scope und nicht auf window; sie sind deshalb
// nicht aufzaehlbar und werden einzeln per Ausdruck geholt. Funktionen in den
// Tabellen (die opts-Rueckgaben der Szenen) traegt kein JSON, ihre Zeilen
// stehen aber im Quelltext der Funktion und werden von dort gelesen.
const ernte = await page.evaluate((quellen) => {
  const sammle = (wert, raus, tiefe, figur) => {
    if (tiefe > 12 || wert == null) return;
    if (typeof wert === 'string') {
      const s = wert.trim();
      if (s.length >= 8 && /\s/.test(s) && /[a-zäöüß]/.test(s)) raus.push({ z: s, figur });
      return;
    }
    if (typeof wert === 'function') {
      const q = String(wert);
      // Nur Literale, die wie Spieltext aussehen. Bezeichner und CSS bleiben aussen vor.
      const lit = q.match(/(['"`])((?:(?!\1)[^\\\n])[^\\\n]{7,180}?)\1/g) || [];
      for (const l of lit) {
        const s = l.slice(1, -1).trim();
        if (s.length >= 8 && /\s/.test(s) && /[a-zäöüß]/.test(s)
            && !/[<>{}]|px|rgba?\(|function|=>|\.\w+\(/.test(s)) raus.push({ z: s, figur });
      }
      return;
    }
    if (typeof wert !== 'object') return;
    const kind = Array.isArray(wert) ? wert.map((v, i) => [i, v]) : Object.entries(wert);
    for (const [k, v] of kind) {
      // Namen und Schluessel sind keine Rede. Ohne diesen Filter zaehlt
      // "Buergermeister Alfons Zwirn" als Zeile und verduennt jede Quote.
      if (typeof k === 'string' && /^(key|name|kurz|sheet|komposit|titel|anrede)$/.test(k)) continue;
      // Bei DORF_FIGUREN traegt jeder Eintrag seinen Schluessel als Figur weiter.
      const f = (v && typeof v === 'object' && typeof v.key === 'string') ? v.key : figur;
      sammle(v, raus, tiefe + 1, f);
    }
  };

  const out = {};
  const fehlt = [];
  for (const q of quellen) {
    let wert;
    try { wert = eval(q.ausdruck); } catch (e) { fehlt.push(q.ausdruck); continue; }
    if (typeof wert === 'undefined') { fehlt.push(q.ausdruck); continue; }
    const raus = [];
    sammle(wert, raus, 0, null);
    // Doppelte innerhalb einer Quelle zaehlen einmal.
    const gesehen = new Set();
    out[q.name] = raus.filter(r => !gesehen.has(r.z) && gesehen.add(r.z));
  }
  return { out, fehlt };
}, QUELLEN.map(q => ({ name: q.name, ausdruck: q.ausdruck })));

await browser.close();

// ---------------------------------------------------------------------------
// Auswertung
// ---------------------------------------------------------------------------
const pro = n => (n * 100).toFixed(0).padStart(3) + '%';
const balken = (anteil, ziel) => {
  const n = Math.round(anteil * 20);
  return '[' + '#'.repeat(Math.min(n, 20)) + '.'.repeat(Math.max(0, 20 - n)) + ']';
};

const eich = eichen();
const quote = eich.richtig / eich.gesamt;

console.log('Ton-Messlauf, Bauabschnitt T5. Zielwert Figurenrede: ' + pro(ZIEL).trim()
          + ' amtlich, Toleranz ' + Math.round(TOLERANZ * 100) + ' Punkte.');
console.log(`Eichprobe: ${eich.richtig} von ${eich.gesamt} von Hand eingestuften Zeilen richtig `
          + `(${pro(quote).trim()}), ${eich.falschNegativ} amtliche uebersehen, `
          + `${eich.falschPositiv} normale falsch gemeldet.`);
console.log(`Dieselbe Probe von Hand: ${pro(eich.handAnteil).trim()} amtlich.`);

// Die Richtung des Fehlers entscheidet, wie die Zahlen zu lesen sind. Ein Lauf,
// der fast nur uebersieht, ist eine Untergrenze und damit brauchbar. Ein Lauf,
// der normale Zeilen als amtlich meldet, ist es nicht.
if (eich.falschPositiv <= 3 && eich.falschNegativ > eich.falschPositiv) {
  console.log('\n  LESART: der Lauf ist konservativ. Was er meldet, ist fast immer amtlich');
  console.log(`  (${eich.falschPositiv} Fehlalarm${eich.falschPositiv === 1 ? '' : 'e'}), er findet aber laengst nicht alles `
            + `(${eich.falschNegativ} uebersehen).`);
  console.log('  Jede Zahl unten ist deshalb eine UNTERGRENZE. Der wahre Anteil liegt hoeher,');
  console.log(`  nach der Handprobe etwa um den Faktor ${(eich.handAnteil / Math.max(0.01, EICHPROBE.filter(e => istAmtlich(e[0]).length).length / EICHPROBE.length)).toFixed(1)}.`);
} else if (quote < 0.80) {
  console.log('\n  ACHTUNG: unter 80 Prozent Trefferquote, und die Fehler gehen in beide');
  console.log('  Richtungen. Die Zahlen unten sind eine Richtung und keine Messung.');
  console.log('  Als Zielwert taugt dann nur die Handprobe, siehe `phase-t5-ton.md`.');
}
console.log('\nMit --eichung die Fehleinstufungen sehen, mit --treffer die Zeilen je Quelle.\n');

if (args.includes('--eichung')) {
  for (const [z, soll, ist] of eich.daneben)
    console.log(`  Hand ${soll}, Lauf ${ist}: ${z}`);
  if (!eich.daneben.length) console.log('  Keine Fehleinstufung.');
  console.log('');
}

let gesamtZeilen = 0, gesamtAmtlich = 0;
const abweichungen = [];

for (const q of QUELLEN) {
  if (NUR_QUELLE && q.name !== NUR_QUELLE) continue;
  const zeilen = ernte.out[q.name];
  if (!zeilen) { console.log(`  ${q.name.padEnd(22)} Tabelle nicht gefunden`); continue; }
  if (!zeilen.length) { console.log(`  ${q.name.padEnd(22)} keine Zeilen`); continue; }

  const bewertet = zeilen.map(r => ({ ...r, gruende: istAmtlich(r.z) }));
  const amtlich = bewertet.filter(r => r.gruende.length);
  const anteil = amtlich.length / bewertet.length;
  const ueberWort = bewertet.filter(r => r.gruende[0] === 'wort').length / bewertet.length;
  const ueberDuktus = bewertet.filter(r => r.gruende[0] === 'duktus').length / bewertet.length;

  const zielHier = q.art === 'figur' ? ZIEL : (q.art === 'spiel' ? 0 : null);
  let marke = '     ';
  if (zielHier !== null) {
    const ab = anteil - zielHier;
    if (q.art === 'spiel') marke = anteil <= 0.05 ? '  ok ' : ' HOCH';
    else marke = Math.abs(ab) <= TOLERANZ ? '  ok ' : (ab > 0 ? ' HOCH' : ' TIEF');
    if (marke !== '  ok ') abweichungen.push({ q, anteil, ziel: zielHier });
  }

  console.log(`  ${q.name.padEnd(22)} ${String(bewertet.length).padStart(4)} Zeilen  `
            + `${pro(anteil)} amtlich ${balken(anteil)}${marke}`
            + `  (Wort ${pro(ueberWort).trim()}, Duktus ${pro(ueberDuktus).trim()})`
            + (q.art === 'dokument' ? '  ausgenommen: gezeigtes Dokument' : ''));

  if (q.art === 'figur') { gesamtZeilen += bewertet.length; gesamtAmtlich += amtlich.length; }

  // Je Figur aufschluesseln, wo die Tabelle Figuren kennt.
  if (q.jeFigur) {
    const nachFigur = new Map();
    for (const r of bewertet) {
      const k = r.figur || '(ohne)';
      if (!nachFigur.has(k)) nachFigur.set(k, []);
      nachFigur.get(k).push(r);
    }
    const sortiert = [...nachFigur.entries()]
      .map(([k, v]) => [k, v.filter(r => r.gruende.length).length / v.length, v.length])
      .sort((a, b) => b[1] - a[1]);
    for (const [k, a, n] of sortiert) {
      const aus = SPRACHMARKE_AMTLICH.includes(k);
      const m = aus ? ' Sprachmarke' : (Math.abs(a - ZIEL) <= TOLERANZ ? ' ok' : (a > ZIEL ? ' HOCH' : ' TIEF'));
      console.log(`      ${k.padEnd(18)} ${String(n).padStart(4)}  ${pro(a)}${m}`);
    }
  }

  if (ZEIG_TREFFER) {
    for (const r of amtlich.slice(0, 12))
      console.log(`      + ${r.z.slice(0, 74)}\n        ${r.gruende.join(' ')}`);
    if (amtlich.length > 12) console.log(`      ... und ${amtlich.length - 12} weitere`);
  }
}

const schnitt = gesamtZeilen ? gesamtAmtlich / gesamtZeilen : 0;
console.log(`\n  Figurenrede insgesamt: ${gesamtZeilen} Zeilen, ${gesamtAmtlich} amtlich, ${pro(schnitt).trim()}.`);
console.log(`  Zielwert ${pro(ZIEL).trim()}. Abstand ${((schnitt - ZIEL) * 100).toFixed(0)} Punkte.`);

if (ernte.fehlt.length)
  console.log(`\n  Nicht gefunden und deshalb ungemessen: ${ernte.fehlt.join(', ')}.`
            + `\n  Das ist ein Fund, keine Fussnote: eine umbenannte Tabelle faellt hier lautlos raus.`);
if (seitenFehler.length)
  console.log(`\n  Seitenfehler beim Laden (ohne assets/cf/ normal): ${seitenFehler[0]}`);

console.log(`\n  ${abweichungen.length} von ${QUELLEN.filter(q => q.art !== 'dokument').length} `
          + `gemessenen Quellen liegen ausserhalb der Toleranz.`);
