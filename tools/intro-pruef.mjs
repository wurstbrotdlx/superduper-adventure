// Messlauf zum Bauabschnitt A0: wie viel liest man, bevor man spielen darf?
//
//   python3 serve.py &
//   node tools/intro-pruef.mjs [URL] [--roh] [--route NAME]
//
// Braucht Playwright und einen Chromium wie die uebrigen Laeufe; PLAYWRIGHT_PFAD
// und CHROMIUM werden gelesen, wenn das Paket nicht im Projekt liegt. Im
// Cloud-Container heisst der Pfad
// PLAYWRIGHT_PFAD=/opt/node22/lib/node_modules/playwright/index.js — ein
// Verzeichnis allein reicht dem ESM-Lader nicht.
//
// DER GRUND. Die Tester melden zu T7: Inhalt gut, Humor kommt an, aber Intro,
// Kachelstapel, Anlage-2-Erstkontakt und Dienstanweisung sind zusammen zu viel
// Text. Der Masterplan Fassung 2 leitet daraus einen Umbau ab und setzt A0
// davor, ohne Ausnahme: "Ohne Ausgangszahl ist jeder Schnitt eine Behauptung."
// Die Ist-Spalte war bis hierher eine Vermutung (1200 bis 2000 Woerter), der
// Zielwert lautet unter 400 Woerter bis zum ersten freien Schritt.
//
// ER MISST AM TATSAECHLICHEN ABLAUF. Nicht an INTRO_BLAETTER.length, nicht an
// einer geschaetzten Tabelle: der Lauf klickt sich durch wie ein Spieler und
// erntet nach jedem Schritt, was gerade auf dem Schirm steht. Was er zaehlt,
// hat jemand wirklich gelesen.
//
// WAS ER NICHT IST: ein Prueflauf. Er stellt kein Soll gegen ein Ist und wird
// nicht rot, wenn eine Zahl das Ziel verfehlt — das ist die Aufgabe der
// Bauabschnitte danach. Exit-Code 1 gibt es nur fuer einen Weg, den er nicht
// gehen konnte, denn eine halbe Messung ist schlimmer als keine.
//
// DER WEITERKNOPF WIRD NICHT AM WORTLAUT GESUCHT, und das ist Absicht. Genau
// daran haengt durchDenStapel() in empfang-pruef.mjs und menue-pruef.mjs: eine
// feste Wortliste, und bei Nichttreffer bricht der Helfer still ab, ohne dass
// ein einziges pruef() rot wird. Dieser Lauf nimmt stattdessen den Knopf an
// seinem onclick (szeneTafel, showDienstblatt, dienstAntritt) — also an dem,
// was er TUT — prueft nach jedem Klick, dass sich der Zustand wirklich bewegt
// hat, und bricht LAUT ab, wenn nicht.
//
// GRAFIK IST NICHT NOETIG. 404 auf fehlende Sprite-Blaetter sind ein
// Lizenzstand und kein Fund, sie werden gefiltert. Im frischen Klon ohne
// assets/cf/ laeuft er unveraendert durch.
//
// DIE ZAEHLREGEL FUER "ECHTE WAHL", woertlich aus dem Masterplan: eine Eingabe
// zaehlt nur, wenn sie eine Wahl ist. Ein Tipp auf WEITER ist eine
// Umblaetterhilfe. Praktisch heisst das: zwei oder mehr angebotene Antworten
// sind eine Wahl, genau eine Antwort ist keine. Das erklaert, warum sich sieben
// blaetterbare Kacheln wie eine Wand anfuehlen, obwohl der Spieler siebenmal
// getippt hat.
//
// Zwei Wahlen sind dabei folgenlos und werden deshalb ZUSAETZLICH getrennt
// ausgewiesen, statt dass der Lauf still eine Wertung trifft, die ihm nicht
// zusteht: die T6-Scheinwahl bei Anlage 2 und die Anrede auf Blatt 1 (P1,
// "Auf die Laufbahn wirkt es nicht"). Beide bieten mehrere Knoepfe an und
// zaehlen nach der Regel oben als Wahl. Wer sie anders lesen will, sieht sie
// unten einzeln stehen.
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const URL = args.find(a => a.startsWith('http')) || 'http://127.0.0.1:8378/index.html';
const ZEIG_ROH = args.includes('--roh');
const NUR_ROUTE = args.includes('--route') ? args[args.indexOf('--route') + 1] : null;

const ZIEL_WOERTER = 400;   // Masterplan Fassung 2, Bauabschnitte, A0

// Das Weltgesetz. Zwei Gestalten, und sie werden getrennt gezaehlt, weil die
// drei erwarteten Stellen nicht gleich aussehen: T5d und T5b sagen den Satz,
// W8 umschreibt ihn. Wer nur woertlich sucht, findet zwei und meldet einen
// Fehlstand, den es nicht gibt.
const WELTGESETZ_WOERTLICH = /vorgang,?\s+den\s+niemand\s+abschlie(?:ß|ss)t/i;
const WELTGESETZ_SINN = [
  /was\s+liegen\s+bleibt,?\s+steht\s+irgendwann\s+auf/i,
  /was\s+keiner\s+bearbeitet,?[\s\S]{0,40}lebendig/i,
];

const pw = (await import(process.env.PLAYWRIGHT_PFAD || 'playwright')).default;
const { chromium } = pw;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

// ---------------------------------------------------------------------------
// Ein frisches Spiel bis zum Startbild.
// ---------------------------------------------------------------------------
// localStorage wird geleert UND nachgesehen: steht kn.seen.einstellung schon,
// laeuft der Empfang nie, und der Lauf wuerde eine leere Strecke messen und
// dabei aussehen wie ein Ergebnis.
async function frisch(){
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 760 } });
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
  const schonEingestellt = await page.evaluate(() => !!(kn && kn.seen && kn.seen.einstellung));
  if(schonEingestellt) throw new Error('kn.seen.einstellung steht schon: der Empfang liefe nicht, die Messung waere leer.');
  return { page, ctx, laut };
}

// ---------------------------------------------------------------------------
// Die Lage, aus dem Spiel gelesen statt aus dem Text geraten.
// ---------------------------------------------------------------------------
// Sie sagt, WELCHER Leseapparat gerade laeuft, was auf ihm steht und wie man
// ihn weiterbewegt. Drei Apparate gibt es: der Tafelstapel (szeneTafeln), die
// Gespraechstafel (szeneOeffnen) und der Vordruck (showDienstblatt).
const lage = page => page.evaluate(() => {
  // Fliesstext eines Panels. Kopfzeile des Hauses und Blattzaehlung sind
  // Rahmen und keine Lektuere, Knoepfe sind Bedienung. Beides faellt raus,
  // damit "Woerter" heisst, was jemand gelesen hat.
  const panelText = () => {
    const p = document.getElementById('ovPanel');
    if(!p) return [];
    const k = p.cloneNode(true);
    for(const w of k.querySelectorAll('button, .amtKopf, .amtFuss, svg')) w.remove();
    return [...k.querySelectorAll('p, h1, li, div > b, span')]
      .map(n => (n.textContent || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean);
  };
  // Die Knoepfe eines Panels, mit dem, was sie tun. Der Wortlaut steht dabei,
  // aber er entscheidet nichts.
  const knoepfe = () => [...document.querySelectorAll('#ovPanel button')].map((b, i) => ({
    i, txt: (b.textContent || '').trim(),
    tut: b.getAttribute('onclick') || '',
    aus: b.disabled === true,
  }));

  const ovEl = document.getElementById('overlay');
  const overlayAuf = !!ovEl && ovEl.style.display === 'flex';
  const vordruckAuf = document.body.classList.contains('vordruckOffen');
  const l = szeneTafelLauf;

  const out = { state, overlayAuf, vordruckAuf, gespraechOffen: !!gespraechOffen,
                szeneAktiv: szeneAktiv || null, apparat: null, marke: null,
                erzaehlt: [], antworten: [], knoepfe: [], blatt: null, gesamtBlatt: null };

  if(vordruckAuf && overlayAuf){
    out.apparat = 'vordruck';
    out.marke = 'Vordruck A 1';
    out.erzaehlt = panelText();
    out.knoepfe = knoepfe();
    const f = document.querySelector('#ovPanel .amtFuss');
    out.blatt = f ? (f.textContent || '').trim() : null;
  } else if(l && overlayAuf){
    out.apparat = 'tafel';
    const li = l.liste;
    out.marke = li === INTRO_BLAETTER ? 'Intro'
              : li === ERNENNUNG_BLAETTER ? 'Ernennung'
              : li[0] === ANLAGE2_AUFTAKT_ERNENNUNG ? 'Anlage 2, Erstkontakt'
              : li[0] === ANLAGE2_AUFTAKT_NACHHOLUNG ? 'Anlage 2, nachgeholt'
              : 'unbenannter Stapel';
    out.erzaehlt = panelText();
    out.knoepfe = knoepfe();
    out.gesamtBlatt = li.length;
    // Der Blattindex steckt im onclick des Vorwaertsknopfes: szeneTafel(i+1).
    const v = out.knoepfe.find(b => /^szeneTafel\(\d+\)/.test(b.tut));
    out.blatt = v ? (+v.tut.match(/^szeneTafel\((\d+)\)/)[1]) - 1 : null;
    out.stufe = l.stufe | 0;
    out.hatWahl = !!(l.wahl && l.wahl.bei === out.blatt);
  } else if(gespraechOffen){
    out.apparat = 'gespraech';
    out.marke = szeneAktiv ? 'Szene ' + szeneAktiv : 'Gespraech';
    // Aus der Quelle und nicht aus dem Tippwerk: #gespraechText ist waehrend
    // des Tippens unvollstaendig, gespraech.z1/z2 sind es nie.
    out.erzaehlt = [gespraech.z1, gespraech.z2].map(z => (z || '').trim()).filter(Boolean);
    out.antworten = (gespraech.opts || []).map(o => (o.t || '').trim());
    out.knoten = szene.knoten || null;
    // Ein hub-Knoten zeigt die offenen Fragen und HINTEN den Ausgang der Szene
    // (szeneOptionen()). Wer den kuerzesten Weg messen will, muss ihn nehmen —
    // sonst misst er einen Spieler, der jede angebotene Frage stellt.
    const dd = SZENEN[szeneAktiv];
    const kk = dd && dd.knoten ? dd.knoten[szene.knoten] : null;
    out.istHub = !!(kk && kk.hub);
    out.fertigGetippt = gespraech.tipp >= (gespraech.z1 || '').length + (gespraech.z2 || '').length;
  } else if(state === 'play' && !overlayAuf){
    out.apparat = 'frei';
    out.marke = 'erster freier Schritt';
  } else if(state === 'menu' && overlayAuf){
    out.apparat = 'startbild';
    out.marke = 'Startbildschirm';
  }
  return out;
});

// Warten, bis der Satz fertig getippt ist, statt eine Zeit zu raten. Dieselbe
// Falle wie in empfang-pruef.mjs: ein Griff ins laufende Tippwerk waehlt nichts
// aus, er holt den Satz nur zu Ende.
const fertigGetippt = page => page.waitForFunction(
  () => !gespraechOffen || gespraech.tipp >= gespraech.z1.length + gespraech.z2.length,
  null, { timeout: 15000 });

// ---------------------------------------------------------------------------
// Der Lauf
// ---------------------------------------------------------------------------
// ROUTEN. Drei, weil eine Zahl allein nichts sagt:
//   pflicht    kuerzester Weg: am hub sofort der Ausgang, keine optionale
//              Frage, und bei der Unterschrift der direkte Weg. DIE HAUPTZAHL.
//   vordruck   derselbe Weg, aber ueber "Erst den Vordruck" — die
//              Dienstanweisung ist auf dem direkten Weg naemlich OPTIONAL
//   vielleser  alles mitnehmen, was angeboten wird — die Obergrenze
//   springer   UEBERSPRINGEN auf Intro-Blatt 1, fuer die Verlustrechnung
const ROUTEN = ['pflicht', 'vordruck', 'vielleser', 'springer'];

async function laufe(route){
  const { page, ctx, laut } = await frisch();
  const stufen = [];      // jede Lesestufe, in der Reihenfolge des Ablaufs
  let abbruch = null;
  const gesehen = new Set();   // schon gestellte Fragen, fuer die Vielleser-Route

  await page.evaluate(() => startGame());
  await page.waitForTimeout(350);
  await fertigGetippt(page);

  for(let schritt = 0; schritt < 400; schritt++){
    const L = await lage(page);
    if(L.apparat === 'frei') break;
    if(!L.apparat){
      abbruch = `Schritt ${schritt}: kein Leseapparat und kein freier Schritt `
              + `(state=${L.state}, overlay=${L.overlayAuf}, gespraech=${L.gespraechOffen}).`;
      break;
    }
    if(L.apparat === 'startbild'){
      abbruch = `Schritt ${schritt}: der Lauf steht wieder im Startbild. Der Anfang hat sich beendet, statt zu beginnen.`;
      break;
    }

    // ---- ernten -----------------------------------------------------------
    const erz = L.erzaehlt.join(' ');
    const ant = (L.antworten || []).join(' ');
    const angebote = L.apparat === 'gespraech' ? (L.antworten || []).length
                   : L.apparat === 'tafel' ? (L.hatWahl ? 2 : 1)
                   : L.knoepfe.filter(b => /^gestaltWaehlen\(/.test(b.tut)).length || 1;
    const stufe = {
      schritt, apparat: L.apparat, marke: L.marke,
      knoten: L.knoten || null, blatt: L.blatt, gesamtBlatt: L.gesamtBlatt,
      zeilen: L.erzaehlt.length + (L.antworten || []).length,
      woerterErzaehlt: zaehleWoerter(erz),
      woerterAntworten: zaehleWoerter(ant),
      angebote,
      istWahl: angebote >= 2,
      folgenlos: null,
      text: L.erzaehlt.slice(), antwortText: (L.antworten || []).slice(),
    };
    // Die zwei folgenlosen Wahlen benennen sich selbst, damit der Bericht sie
    // getrennt ausweisen kann, ohne dass hier jemand wertet.
    if(L.apparat === 'tafel' && L.hatWahl) stufe.folgenlos = 'Scheinwahl (T6)';
    if(L.apparat === 'vordruck' && L.knoepfe.some(b => /^gestaltWaehlen\(/.test(b.tut))) {
      stufe.folgenlos = 'Anrede (P1)';
      stufe.istWahl = true;
    }
    stufen.push(stufe);

    // ---- weiter -----------------------------------------------------------
    const vorher = kennung(L);
    let getan = null;
    try {
      getan = await vor(page, L, route, schritt, gesehen);
    } catch(e){
      abbruch = `Schritt ${schritt} (${L.marke}): ${e.message}`;
      break;
    }
    stufe.getan = getan;
    await page.waitForTimeout(200);
    await fertigGetippt(page);

    // Hat sich wirklich etwas bewegt? Genau diese Frage stellt durchDenStapel()
    // nicht, und deshalb bricht er still.
    const nachher = kennung(await lage(page));
    if(nachher === vorher){
      abbruch = `Schritt ${schritt} (${L.marke}): "${getan}" geklickt, und die Lage ist unveraendert (${vorher}). `
              + `Der Lauf haette hier still weitergezaehlt.`;
      break;
    }
  }

  const L = await lage(page);
  const angekommen = L.apparat === 'frei';
  await ctx.close();
  return { route, stufen, abbruch, angekommen, laut };
}

// Eine Lage als kurze Zeichenkette, um Bewegung festzustellen.
const kennung = L => [L.apparat, L.marke, L.blatt, L.knoten, L.stufe].join('|');

// Ein Schritt vorwaerts. Gibt zurueck, was getan wurde.
async function vor(page, L, route, schritt, gesehen){
  if(L.apparat === 'gespraech'){
    const opts = L.antworten || [];
    if(!opts.length) throw new Error('Gespraechsknoten ohne Antwort: hier kommt niemand weiter.');
    let i = 0;
    if(route === 'vielleser'){
      // Alles mitnehmen, was noch nicht gestellt wurde. Ist nichts mehr uebrig,
      // bleibt der Ausgang, und der steht hinten.
      const offen = opts.map((t, k) => [t, k]).filter(([t]) => !gesehen.has(L.marke + '::' + t));
      i = offen.length ? offen[0][1] : opts.length - 1;
      gesehen.add(L.marke + '::' + opts[i]);
    } else if(L.istHub){
      // Der kuerzeste Weg nimmt am hub den Ausgang. Er steht immer zuletzt,
      // szeneOptionen() haengt ihn hinten an.
      i = opts.length - 1;
    } else if(route === 'vordruck' && L.knoten === 'schluss'){
      // Die eine Abzweigung, die diese Route ausmacht: "Erst den Vordruck".
      // Gesucht wird der Knoten am SCHLUESSEL und nicht am Wortlaut; welche
      // Zeile dort steht, darf sich aendern.
      i = Math.min(1, opts.length - 1);
    }
    await page.evaluate(k => gespraechWaehlen(k), i);
    return `Antwort ${i + 1}: ${opts[i]}`;
  }

  if(L.apparat === 'tafel'){
    if(route === 'springer' && L.marke === 'Intro' && L.blatt === 0){
      const zweit = L.knoepfe.find(b => /^szeneTafelZweiter\(\)/.test(b.tut));
      if(!zweit) throw new Error('Auf Intro-Blatt 1 steht kein zweiter Knopf. UEBERSPRINGEN gibt es nicht mehr.');
      await page.evaluate(i => document.querySelectorAll('#ovPanel button')[i].click(), zweit.i);
      return `zweiter Knopf: ${zweit.txt}`;
    }
    const v = L.knoepfe.find(b => /^szeneTafel\(\d+\)/.test(b.tut) && !b.aus);
    if(!v) throw new Error('Kein Knopf mit szeneTafel(n) auf dieser Tafel. Der Stapel hat keinen Weg vorwaerts.');
    await page.evaluate(i => document.querySelectorAll('#ovPanel button')[i].click(), v.i);
    return `Tafelknopf: ${v.txt}`;
  }

  if(L.apparat === 'vordruck'){
    // Die Anrede zuerst, sie ist eine angebotene Wahl auf diesem Blatt.
    const g = L.knoepfe.filter(b => /^gestaltWaehlen\(/.test(b.tut));
    if(g.length && route === 'vielleser'){
      await page.evaluate(i => document.querySelectorAll('#ovPanel button')[i].click(), g[g.length - 1].i);
      await page.waitForTimeout(150);
    }
    const frisch = await lage(page);
    const nav = frisch.knoepfe.filter(b => /^showDienstblatt\(/.test(b.tut) && !b.aus)
      .map(b => { const m = b.tut.match(/^showDienstblatt\((\d+),'([^']*)',(\d+)\)/); return { b, nr: +m[1], seite: +m[3] }; });
    const ende = frisch.knoepfe.find(b => /^dienstAntritt\(\)/.test(b.tut) && !b.aus);
    if(!nav.length && !ende) throw new Error('Der Vordruck bietet weder eine naechste Seite noch die Unterschrift an.');
    // Die Unterschrift zuerst, und das ist kein Geschmack, sondern ein Fund aus
    // dem ersten Lauf: auf der LETZTEN Seite steht neben UNTERSCHREIBEN noch
    // ZURUECK, und beide sind showDienstblatt-Knoepfe. Wer nur "den groesseren
    // Zeiger" nimmt, greift dort ZURUECK, blaettert zurueck, vorwaerts, zurueck
    // — der Lauf lief 393 Vordruckseiten, ohne je stehenzubleiben, und keine
    // Unstimmigkeitspruefung schlug an, weil sich ja dauernd etwas bewegte.
    // UNTERSCHREIBEN und WEITER schliessen sich im Spiel aus (showDienstblatt:
    // nachSeite ? WEITER : UNTERSCHREIBEN), also ist die Unterschrift immer
    // vorwaerts, wenn es sie gibt.
    const ziel = nav.length ? nav.reduce((a, x) => (x.nr * 100 + x.seite) > (a.nr * 100 + a.seite) ? x : a) : null;
    const knopf = ende ? ende : ziel.b;
    await page.evaluate(i => document.querySelectorAll('#ovPanel button')[i].click(), knopf.i);
    return `Vordruck: ${knopf.txt}`;
  }
  throw new Error(`Unbekannter Apparat "${L.apparat}".`);
}

// Woerter zaehlen. Zahlen, Kuerzel und Interpunktion zaehlen mit, sie werden
// mitgelesen; leere Zeichenketten nicht.
function zaehleWoerter(s){
  return (s || '').split(/\s+/).filter(w => /[A-Za-zÀ-ÿ0-9]/.test(w)).length;
}

// ---------------------------------------------------------------------------
// Auswertung
// ---------------------------------------------------------------------------
function werte(lauf){
  const s = lauf.stufen;
  const w = t => t.woerterErzaehlt + t.woerterAntworten;

  // (1) Erzaehltext vor der ersten Spielereingabe: alles bis einschliesslich
  // der Stufe, auf der zum ersten Mal ueberhaupt etwas gedrueckt werden muss.
  // Das ist heute die erste, also genau ein Gespraechsknoten.
  const vorErsterEingabe = s.length ? s[0].woerterErzaehlt : 0;

  // (2) Bis zum ersten freien Schritt.
  const gesamt = s.reduce((a, t) => a + w(t), 0);
  const gesamtErzaehlt = s.reduce((a, t) => a + t.woerterErzaehlt, 0);
  const gesamtAntworten = s.reduce((a, t) => a + t.woerterAntworten, 0);

  // (3) Erklaerstuecke. Zwei Lesarten, und beide stehen da: wie viele
  // VERSCHIEDENE Apparate durchlaufen werden, und wie oft der Apparat WECHSELT.
  // Der Empfang laeuft zweimal (Vorstellung, dann Hub), dazwischen das Intro —
  // das sind zwei Wechsel und ein Apparat.
  const marken = s.map(t => t.marke);
  const verschieden = [...new Set(marken)];
  let wechsel = 0;
  for(let i = 1; i < marken.length; i++) if(marken[i] !== marken[i-1]) wechsel++;

  // (4)+(5) Bloecke zwischen zwei echten Wahlen.
  //
  // Ein Block sind die Lesestufen OHNE Wahl, und die Wahl, die ihn beendet,
  // gehoert nicht mehr dazu. Das ist keine Kleinigkeit: die erste Fassung
  // zaehlte sie mit und meldete vierzehn Tafeln, wo dreizehn am Stueck zu lesen
  // sind und die vierzehnte die Erloesung ist. Gefragt war "Lesetafeln
  // hintereinander ohne eine echte Wahl DAZWISCHEN".
  const bloecke = [];
  let lauf1 = { tafeln: 0, zeilen: 0, woerter: 0, von: null, bis: null };
  const schliesse = () => {
    if(lauf1.tafeln) bloecke.push(lauf1);
    lauf1 = { tafeln: 0, zeilen: 0, woerter: 0, von: null, bis: null };
  };
  for(const t of s){
    if(t.istWahl){ schliesse(); continue; }
    lauf1.tafeln++; lauf1.zeilen += t.zeilen; lauf1.woerter += w(t);
    if(lauf1.von === null) lauf1.von = t.marke;
    lauf1.bis = t.marke;
  }
  schliesse();
  const laengster = bloecke.reduce((a, b) => b.woerter > a.woerter ? b : a, { tafeln:0, zeilen:0, woerter:0 });
  const meisteTafeln = bloecke.reduce((a, b) => b.tafeln > a.tafeln ? b : a, { tafeln:0, zeilen:0, woerter:0 });

  const wahlen = s.filter(t => t.istWahl);
  const folgenlos = s.filter(t => t.folgenlos);

  // (6) Das Weltgesetz auf DIESEM Weg.
  const treffer = [];
  for(const t of s){
    const txt = t.text.concat(t.antwortText).join(' ');
    if(WELTGESETZ_WOERTLICH.test(txt)) treffer.push({ art: 'woertlich', marke: t.marke, blatt: t.blatt });
    else if(WELTGESETZ_SINN.some(r => r.test(txt))) treffer.push({ art: 'sinngemaess', marke: t.marke, blatt: t.blatt });
  }

  return { vorErsterEingabe, gesamt, gesamtErzaehlt, gesamtAntworten, stufen: s.length,
           verschieden, wechsel, bloecke, laengster, meisteTafeln,
           wahlen: wahlen.length, folgenlos, weltgesetz: treffer };
}


// ---------------------------------------------------------------------------
// Das Weltgesetz in den Tabellen, nicht nur auf dem gelaufenen Weg
// ---------------------------------------------------------------------------
// Bauform wie die Ernte in ton-messlauf.mjs: ein frischer Kontext, ein Blick
// auf die Tabellen, kein Klick. Baeume, die erst ab Schicht 5 ansprechbar sind
// (SZENEN[..].wenn), fallen raus — sie sind vor Schicht 5 nicht erreichbar und
// wuerden die Zahl aufblasen.
async function alleWeltgesetzStellen(){
  const { page, ctx } = await frisch();
  const stellen = await page.evaluate(({ w, sinn }) => {
    const rw = new RegExp(w[0], w[1]);
    const rs = sinn.map(x => new RegExp(x[0], x[1]));
    const raus = [];
    const gesehen = new Set();
    const sammle = (wert, wo, tiefe) => {
      if(tiefe > 8 || wert == null) return;
      if(typeof wert === 'string'){
        const art = rw.test(wert) ? 'woertlich' : rs.some(r => r.test(wert)) ? 'sinngemaess' : null;
        if(art && !gesehen.has(wo + '::' + wert)){ gesehen.add(wo + '::' + wert); raus.push({ art, wo, z: wert }); }
        return;
      }
      if(typeof wert === 'function'){ try { sammle(wert(), wo, tiefe + 1); } catch(e){} return; }
      if(typeof wert !== 'object') return;
      for(const v of (Array.isArray(wert) ? wert : Object.values(wert))) sammle(v, wo, tiefe + 1);
    };
    sammle(INTRO_BLAETTER, 'Intro-Blaetter (T5d)', 0);
    sammle(DIENSTBLATT, 'Vordruck A 1 (W8)', 0);
    sammle(ERNENNUNG_BLAETTER, 'Ernennungsurkunde (T2)', 0);
    sammle([ANLAGE2_AUFTAKT_ERNENNUNG, ANLAGE2_AUFTAKT_NACHHOLUNG, ANLAGE2_FRAGE, ANLAGE2_BLAETTER],
           'Anlage 2, Erstkontakt (T3)', 0);
    for(const k of Object.keys(SZENEN)){
      const d = SZENEN[k];
      let offen = true;
      try { offen = !d.wenn || !!d.wenn(); } catch(e){}
      if(!offen) continue;                       // erst ab Schicht 5 ansprechbar
      sammle(d.knoten, 'Szene ' + k, 0);
      sammle(d.fragen, 'Szene ' + k + ', Fragen', 0);
    }
    return raus;
  }, { w: [WELTGESETZ_WOERTLICH.source, 'i'], sinn: WELTGESETZ_SINN.map(r => [r.source, 'i']) });
  await ctx.close();
  return stellen;
}

// ---------------------------------------------------------------------------
// Lauf
// ---------------------------------------------------------------------------
const laeufe = {};
for(const r of ROUTEN){
  if(NUR_ROUTE && r !== NUR_ROUTE) continue;
  laeufe[r] = await laufe(r);
}

// Die Tabellenlese fuer das Weltgesetz braucht noch einen frischen Kontext,
// deshalb faellt der Browser erst weiter unten.
const weltgesetzStellen = await alleWeltgesetzStellen();
await browser.close();

const z = (n, b = 6) => String(n).padStart(b);
let fehl = 0;

console.log('Intro-Messlauf, Bauabschnitt A0. Gemessen am Ablauf, nicht an Tabellen.');
console.log(`Zielwert Masterplan Fassung 2: unter ${ZIEL_WOERTER} Woerter bis zum ersten freien Schritt.\n`);
console.log('Gezaehlt wird der Fliesstext der Leseapparate plus die Antwortzeilen, die');
console.log('zur Auswahl stehen. Kopfzeile des Hauses, Blattzaehlung und Knopfbeschriftung');
console.log('sind Rahmen und Bedienung und zaehlen nicht mit.\n');

for(const r of Object.keys(laeufe)){
  const l = laeufe[r];
  if(l.abbruch){
    fehl++;
    console.log(`ROUTE ${r.toUpperCase()}: ABGEBROCHEN`);
    console.log(`  ${l.abbruch}`);
    console.log(`  ${l.stufen.length} Lesestufen bis dahin. Die Zahlen unten fehlen fuer diese Route.\n`);
    continue;
  }
  if(!l.angekommen){ fehl++; console.log(`ROUTE ${r.toUpperCase()}: kam nicht im freien Spiel an.\n`); continue; }
  const a = werte(l);
  const marke = a.gesamt > ZIEL_WOERTER ? '  <== ueber dem Zielwert' : '';
  console.log(`ROUTE ${r.toUpperCase()}`);
  console.log(`  Woerter Erzaehltext vor der ERSTEN Spielereingabe   ${z(a.vorErsterEingabe)}`);
  console.log(`  Woerter bis zum ersten freien Schritt im Dorf       ${z(a.gesamt)}${marke}`);
  console.log(`      davon Erzaehltext                              ${z(a.gesamtErzaehlt)}`);
  console.log(`      davon Antwortzeilen zur Auswahl                ${z(a.gesamtAntworten)}`);
  console.log(`  Lesestufen (Tafeln, Knoten, Vordruckseiten)         ${z(a.stufen)}`);
  console.log(`  Erklaerstuecke, verschiedene Apparate               ${z(a.verschieden.length)}   ${a.verschieden.join(' / ')}`);
  console.log(`  Abschnitte am Stueck (Apparat wechselt ${z(a.wechsel, 2)} mal)     ${z(a.wechsel + 1)}`);
  console.log(`  Echte Wahlen auf dem ganzen Weg                     ${z(a.wahlen)}`);
  if(a.folgenlos.length)
    console.log(`      davon folgenlos                               ${z(a.folgenlos.length)}   ${a.folgenlos.map(f => f.folgenlos).join(', ')}`);
  console.log(`  Laengster Leseblock ohne echte Wahl, Woerter        ${z(a.laengster.woerter)}   (${a.laengster.zeilen} Zeilen, ${a.laengster.tafeln} Lesestufen, ${a.laengster.von} bis ${a.laengster.bis})`);
  console.log(`  Meiste Lesetafeln hintereinander ohne echte Wahl    ${z(a.meisteTafeln.tafeln)}   (${a.meisteTafeln.woerter} Woerter)`);
  console.log(`  Das Weltgesetz faellt auf diesem Weg                ${z(a.weltgesetz.length)}   ${a.weltgesetz.map(t => `${t.marke} (${t.art})`).join(', ') || '-'}`);
  console.log(`  Bloecke zwischen den Wahlen, in Stufen              ${a.bloecke.map(b => b.tafeln).join(' ')}`);
  console.log('');
}

// --- Verlustrechnung beim Ueberspringen ------------------------------------
if(laeufe.pflicht && laeufe.springer && !laeufe.pflicht.abbruch && !laeufe.springer.abbruch){
  const zaehle = l => {
    const m = {};
    for(const t of l.stufen) m[t.marke] = (m[t.marke] || 0) + 1;
    return m;
  };
  const p = zaehle(laeufe.pflicht), s = zaehle(laeufe.springer);
  console.log('BLAETTER, DIE BEIM UEBERSPRINGEN VERLOREN GEHEN');
  console.log('  Gezaehlt als Lesestufen je Apparat, Pflichtweg gegen Springer.');
  let verlorenW = 0;
  for(const k of new Set([...Object.keys(p), ...Object.keys(s)])){
    const dp = p[k] || 0, ds = s[k] || 0;
    if(dp === ds) continue;
    console.log(`  ${(k + ' ').padEnd(28, '.')} Pflicht ${z(dp, 3)}   Springer ${z(ds, 3)}   ${ds < dp ? 'verloren ' + (dp - ds) : 'zusaetzlich ' + (ds - dp)}`);
  }
  const wp = werte(laeufe.pflicht), ws = werte(laeufe.springer);
  verlorenW = wp.gesamt - ws.gesamt;
  console.log(`  Woerter: Pflicht ${wp.gesamt}, Springer ${ws.gesamt}, Ersparnis ${verlorenW}.`);
  console.log(`  Das Weltgesetz: Pflicht ${wp.weltgesetz.length} mal, Springer ${ws.weltgesetz.length} mal.\n`);
}

// --- Das Weltgesetz vor Schicht 5, auch abseits des Pflichtwegs ------------
// Der Pflichtweg ist nicht alles: T5b haengt hinter einer optionalen Frage im
// Gespraechsbaum der Anlage 2 und faellt dort trotzdem, sobald sie in der
// Tasche liegt. Erwartet werden drei Stellen (T5d, W8, T5b), und "erreichbar"
// ist die Lesart, in der die Drei stimmt.
{
  const nachOrt = {};
  for(const t of weltgesetzStellen) (nachOrt[t.wo] = nachOrt[t.wo] || []).push(t);
  console.log('DAS WELTGESETZ VOR SCHICHT 5, alle erreichbaren Stellen');
  console.log('  Erwartet nach Masterplan: 3 (T5d Kacheln, W8 Vordruck, T5b Anlage 2).');
  for(const wo of Object.keys(nachOrt)){
    const arten = [...new Set(nachOrt[wo].map(t => t.art))].join('+');
    console.log(`  ${(wo + ' ').padEnd(38, '.')} ${z(nachOrt[wo].length, 2)} Zeile(n), ${arten}`);
    for(const t of nachOrt[wo]) console.log(`      "${t.z.slice(0, 76)}"`);
  }
  console.log(`  Orte insgesamt: ${Object.keys(nachOrt).length}.\n`);
}

if(ZEIG_ROH){
  for(const r of Object.keys(laeufe)){
    console.log(`\n--- ROH: ${r} ---`);
    for(const t of laeufe[r].stufen){
      console.log(`[${String(t.schritt).padStart(3)}] ${t.marke}${t.blatt !== null && t.blatt !== undefined ? ' Blatt ' + (t.blatt + 1) : ''}`
                + `${t.knoten ? ' <' + t.knoten + '>' : ''}  ${t.woerterErzaehlt}+${t.woerterAntworten} W`
                + `${t.istWahl ? '  WAHL(' + t.angebote + ')' : ''}${t.folgenlos ? ' ' + t.folgenlos : ''}`);
      for(const s of t.text) console.log(`        ${s}`);
      for(const s of t.antwortText) console.log(`      > ${s}`);
      if(t.getan) console.log(`      -> ${t.getan}`);
    }
  }
}

for(const r of Object.keys(laeufe)){
  const l = laeufe[r];
  if(l.laut.length) console.log(`\nLaut auf Route ${r}:\n  ` + l.laut.join('\n  '));
}

console.log(ZEIG_ROH ? '' : '\nMit --roh jede geerntete Zeile sehen, mit --route NAME nur eine Route.');
if(fehl){
  console.log(`\n${fehl} Route(n) unvollstaendig. Der Lauf misst nicht, was er nicht gegangen ist.`);
  process.exit(1);
}
