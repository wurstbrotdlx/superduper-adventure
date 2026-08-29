// skript/06-gespraech-dienst-und-szenen.js - Teil 6 von 7 des einen Spielskripts.
// Inhalt: Gespraechsfenster, update() und frameNo, Dienst und Spielstand, Rang, Anrede, Vorgang, Brett, Langvorgaenge, Anfang, Empfang, Szenen und Gespraechsbaeume.
//
// Mechanisch an gemessenen Kanten geschnitten: nichts umgezogen, nichts
// umbenannt, nichts umgeschrieben. Klassische Skriptdateien teilen sich EINE
// globale lexikalische Umgebung, deshalb ist die Reihenfolge der Tags in
// index.html Programmtext und keine Sortierung. Wer eine Datei dazwischen
// haengt oder die Reihenfolge dreht, aendert das Programm.
//
// Kein Wort dieser Datei darf ein schliessendes script-Tag enthalten, auch
// nicht im Kommentar: build-single.mjs backt alle sieben in EINEN Block, und
// dort beendet diese Zeichenfolge das Skript mitten im Satz. Der Build prueft
// das und bricht ab, damit es nicht erst im Browser auffaellt.
//
// 'use strict' gilt pro Datei, nicht pro Seite, darum steht es in jeder erneut.
// Beim Ruecklauf in EINEN Block (tools/build-single.mjs) sind die Wiederholungen
// wirkungslose String-Literale.
//
// Diese Datei ist mit Abstand die groesste, und das ist kein Versaeumnis,
// sondern gemessen: gespraechAssert() ruft sich auf Skriptebene selbst auf und
// liest dabei baumFaellig(), das rund zehntausend Zeilen weiter unten steht.
// In EINEM Skript trug die Funktionshochziehung das; ueber Dateigrenzen hinweg
// traegt sie nicht mehr. Jeder Schnitt zwischen den beiden Stellen macht das
// Spiel kaputt, also gibt es hier keinen. Wer die Datei teilen will, muss
// zuerst diese eine Abhaengigkeit aufloesen, nicht die Kante suchen.
'use strict';
// --- Ab hier unveraendert aus index.html geschnitten (Teilung vom 29.08.2026). ---
// ===========================================================================
//  U3: Das Gespraechsfenster
//
//  Was vorher da war: npcSprechen() schrieb eine Zeile in n.bubbleText1/2, die
//  Blase ueber dem Kopf zeigte sie vier Sekunden lang, und wer noch einmal F
//  drueckte, bekam die naechste. Der Text war vollstaendig, der Weg zu ihm
//  war ein Geheimnis. Man konnte nicht sehen, dass es weitergeht, man konnte
//  nichts waehlen, und nach vier Sekunden war der Satz weg, ob gelesen oder
//  nicht.
//
//  Was jetzt da ist: dieselbe Maschinerie, mit einem Ort und einer Wahl. Die
//  Form ist die aus dem Genre (Stardew Valley: Tafel unten, Bild links, Name
//  oben, Antworten als Liste, waehlbar per Maus, Ziffer oder Pfeil+Eingabe);
//  die Sprechweise bleibt die dieses Hauses.
//
//  Ausdruecklich NICHT geaendert: der Inhalt. Kein Satz ist neu, keiner ist
//  weggefallen, keine Verzweigung ist dazugekommen. Was die vier Antworten
//  tun, tat vorher der wiederholte Tastendruck — nur dass zwei davon
//  (Anrede, Aktzeile) im Grundzeilen-Zyklus vergraben lagen und man sie
//  durch Zufall traf statt durch Absicht. Neue Dorftexte sind eine
//  Inhaltslieferung (figuren-dorf.md) und keine UI-Frage.
//
//  Die einzige Antwort MIT Nebenwirkung ist die erste: sie ruft npcSprechen()
//  unveraendert auf, samt langAnsprechen() (das einen Langvorgang vorruecken
//  laesst), Bramsches Frage-Zaehler und dem verbrauchten letzterAnlass. Genau
//  ein Aufruf je Klick, wie vorher genau einer je Tastendruck. Die drei
//  anderen lesen nur.
// ===========================================================================
const gespraech = {npc:null, fig:null, z1:'', z2:'', tipp:0, tippGezeigt:-1, wahl:0, opts:[], rollt:false};
let gespraechOffen = false;
// E1: Laeuft der Empfang, gehoert die Tafel der Szene und nicht dem Dorf. Die
// Steht hier oben und nicht beim Szenenblock weiter unten, weil
// gespraechAssert() noch auf Skriptebene laeuft und gespraechOptionen()
// aufruft: eine erst spaeter deklarierte Konstante waere dort ein
// ReferenceError durch Temporal Dead Zone, also genau der Fehler, den
// node --check nicht findet (README, "Entwickeln").
// SZ1: Aus der Flagge wird ein Schluessel. Vorher gab es genau eine Szene, den
// Empfang, und ein Ja/Nein genuegte. Jetzt steht hier, WELCHE Szene laeuft, und
// null heisst: keine.
let szeneAktiv = null;
// Die Szenentabelle. Sie wird weiter unten mit dem Empfang befuellt und waechst
// mit jeder weiteren Szene um einen Eintrag, nicht um einen Sonderfall.
//
// F1d: Die Deklaration steht seit dieser Runde hier oben und nicht mehr beim
// Szenenblock, und zwar aus demselben Grund, aus dem szeneAktiv hier steht:
// gespraechAssert() laeuft auf Skriptebene, ruft gespraechOptionen(), und die
// fragt seit F1d ueber baumFaellig() die Tabelle. Stand die Deklaration unten,
// war das ein ReferenceError durch Temporal Dead Zone beim Laden, den
// node --check nicht findet und den nur der Browser zeigt (README, Entwickeln).
// Gemessen: frameNo blieb 0, die Seite hing im Ladebildschirm.
const SZENEN = {};
// Der Empfang ist damit eine Szene unter mehreren, und diese Zeile ist die
// Frage "laeuft gerade er?". Sie ist bewusst KEIN zweites Feld, sondern ein
// abgeleiteter Lesevorgang auf szeneAktiv, wie es die W5/W6-Doktrin fuer jede
// Belohnung verlangt: zwei Felder fuer denselben Zustand waeren zwei
// Wahrheiten, und die zweite driftet. Als Eigenschaft und nicht als Funktion,
// damit der bestehende Prueflauf tools/empfang-pruef.mjs sie unveraendert
// liest und damit weiter beweist, dass der Anfang den Umbau ueberlebt hat.
Object.defineProperty(globalThis, 'empfangAktiv', {get: () => szeneAktiv === 'empfang'});
// Anschlaege je Sekunde. 55 liest sich als Schreibmaschine und nicht als
// Diaschau: die laengste Zeile im Bestand hat 48 Zeichen (Zeichendeckel,
// knAssertCaps), zwei davon sind also nach knapp zwei Sekunden fertig.
const GESPRAECH_TEMPO = 55;
// F1d: die Tür zum Gesprächsbaum, als eine Zeile an einer Stelle. Sie steht hier
// oben und nicht in gespraechOptionen(), weil gespraechAssert() sie ebenfalls
// liest und noch auf Skriptebene läuft: eine erst später deklarierte Konstante
// wäre dort ein ReferenceError durch Temporal Dead Zone. 24 Zeichen, Deckel 28.
const BAUM_EINSTIEG = 'Erzählen Sie von früher.';
// Wer sich weiter als das entfernt, hat das Gespraech beendet. 58px ist die
// Reichweite der Kontextaktion (scanAktion), 96 laesst der Figur ihre
// Wanderleine und dem Spieler einen Schritt, ohne dass das Fenster zufaellt.
const GESPRAECH_WEG_Q = 96*96;

const gEsc = s => String(s == null ? '' : s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// Die Beschriftung der ersten Antwort sagt, was hinter ihr steckt. Sie ist
// die einzige, die verzweigt — und zwar nach genau denselben Bedingungen, die
// npcSprechen() gleich darauf auswertet. Steht Bramsches Frage offen, steht
// es auch auf dem Knopf; hat der Chor auf der Bank etwas gesehen, ebenso.
function gespraechWeiterText(fig){
  if(fig.key === 'bramsche' && bramscheFragen > 0) return 'Ich hätte eine Frage.';
  if(fig.anlass && letzterAnlass && fig.anlass[letzterAnlass] && fig.anlass[letzterAnlass].length)
    return 'Wegen vorhin …';
  return 'Und sonst?';
}

// fig als Parameter und nicht aus gespraech gelesen, damit gespraechAssert()
// die Liste fuer jede Figur der Tabelle bauen kann, ohne ein Fenster zu oeffnen.
function gespraechOptionen(fig){
  if(szeneAktiv) return szeneOptionen();   // E1: die Szene schreibt ihre Liste selbst
  fig = fig || gespraech.fig;
  if(!fig) return [];
  const kno = fig.key === 'knoeterich';
  const liste = [
    {t: gespraechWeiterText(fig), tun: () => { npcSprechen(gespraech.npc); gespraechUebernehmen(); }},
    // U6: Knoeterich steht im Haus und nicht im Dorf. Dieselbe Antwort, dieselbe
    // Quelle (fig.akt), nur nach dem gefragt, wo er wirklich sitzt.
    {t: kno ? 'Wie steht es im Haus?' : 'Wie steht es im Dorf?',
                                  tun: () => gespraechSagen(fig.akt[aktStand() - 1], '')},
    {t: 'Wie war noch mein Titel?', tun: () => { const a = anredeZeile(fig.key); gespraechSagen(a.z1, a.z2); }},
  ];
  // F1d: die Tür zum Gesprächsbaum. Sie steht nur da, wenn die Figur einen hat
  // und er fällig ist, sie steht vor dem Abschied, und der Abschied bleibt die
  // letzte Zeile. Ohne diesen Kanal fände der Spieler die Hintergrundzeilen nur
  // durch Zufall im Kreislauf, und Grundgesetz 11 verlangt, dass er fragen kann.
  //
  // Ein Baum wird NICHT von der Kontextaktion geöffnet, anders als die drei
  // Szenen aus SZ2: die F-Taste soll weiter das tun, was sie seit W3 tut. Der
  // Unterschied hängt am Feld baum, siehe baumFaellig() und szeneFaellig().
  const bk = baumFaellig(fig.key);
  if(bk) liste.push({t: BAUM_EINSTIEG, tun: () => szeneOeffnen(bk, SZENEN[bk].start)});
  // U6: Die andere fünfte Antwort, und die einzige, die es nur bei einer Figur
  // gibt. Sie ersetzt die alte Kontextaktion "Nachfragen": derselbe Zyklus durch
  // die letzten drei Dienstzettel, nur steht der Satz jetzt in der Tafel statt
  // im oberen Band. Sie erscheint erst, wenn es etwas nachzuschlagen gibt.
  //
  // F1d: die beiden fünften Zeilen stören sich nicht. Knöterich hat keinen Baum
  // (er erklärt Tasten, nie Zusammenhänge), und keine Dorffigur führt Buch. Es
  // steht also nie mehr als eine von beiden da, und der Guard rechnet das nach.
  if(kno && kn.history.length)
    liste.push({t:'Was stand da eben?', tun: () => { const z = knNachfragenZeile();
                                                     if(z) gespraechSagen(z.z1, z.z2); }});
  liste.push({t: 'Auf Wiedersehen.',    tun: () => gespraechSchliessen()});
  return liste;
}

// Setzt einen Satz ins Fenster und laesst ihn neu tippen.
function gespraechSagen(z1, z2){
  gespraech.z1 = z1 || ''; gespraech.z2 = z2 || '';
  gespraech.tipp = 0; gespraech.tippGezeigt = -1;
  gespraechZeichnen();
}
// Uebernimmt, was npcSprechen() gerade in die Blasenfelder geschrieben hat.
// Die Felder bleiben die Ablage — der Spielstand kennt sie, und Knoeterich
// benutzt dieselbe Blase weiter.
function gespraechUebernehmen(){
  const n = gespraech.npc;
  if(n) gespraechSagen(n.bubbleText1, n.bubbleText2);
}

function gespraechOeffnen(n){
  if(!n || !n.figur) return;
  // SZ2: Will eine Szene diese Figur uebernehmen, tut sie es hier, vor dem
  // Normalweg. Ein Einstiegspunkt, keine Sonderbehandlung an der Figur, und die
  // Frage kostet eine Schleife ueber eine Handvoll Tabelleneintraege.
  if(!szeneAktiv){
    const k = szeneFaellig(n.figur.key);
    if(k){ szeneOeffnen(k, SZENEN[k].start); return; }
  }
  // Zweiter Druck auf F bei derselben Figur heisst weiterreden — genau das,
  // was die Taste vor U3 getan hat. Wer die Tafel nicht braucht, merkt vom
  // Umbau nichts ausser dass der Satz jetzt stehen bleibt.
  if(gespraechOffen && gespraech.npc === n){
    if(gespraech.tipp < gespraech.z1.length + gespraech.z2.length) gespraechFertigTippen();
    else { npcSprechen(n); gespraechUebernehmen(); }
    return;
  }
  gespraech.npc = n; gespraech.fig = n.figur; gespraech.wahl = 0;
  gespraechOffen = true;
  el('gespraech').style.display = 'block';
  gespraechPortrait(n);
  gespraechIchPortrait();      // U4: die untere Haelfte
  // Begruesst wird mit der Anredezeile, und zwar OHNE npcSprechen(). Der Grund
  // ist keine Geschmacksfrage: npcSprechen() hat Nebenwirkungen, und beim
  // Oeffnen waeren sie am falschen Ort. Bramsches Frage-Zaehler wuerde noch
  // beim Aufschlagen der Tafel aufgebraucht, die Antwortliste danach mit
  // bramscheFragen === 0 gebaut, und "Ich haette eine Frage." waere eine
  // Beschriftung, die nie erscheint. Dasselbe fuer letzterAnlass auf der Bank.
  // Fuer alle uebrigen Figuren ist es ohnehin derselbe Satz, den auch der erste
  // Druck auf F vorher gab: bubbleIdx startet bei -1, Schritt 0 ist die Anrede.
  // Wer die alte Reihenfolge will, drueckt F zweimal — der zweite Druck redet
  // in der offenen Tafel weiter.
  const a = anredeZeile(n.figur.key);
  gespraechSagen(a.z1, a.z2);
  MUS.muffle();              // offenes Panel daempft die Musik, wie ueberall
  panelSicht();              // U1
}

function gespraechSchliessen(){
  // E1: Der Empfang hat genau einen Ausgang, und der ist die Unterschrift.
  // SZ1: dieselbe Regel fuer jede Szene. Wer eine Szene wegklicken kann, steht
  // danach in einer Welt, die auf ihr Ende gewartet hat.
  // Diese eine Zeile deckt alle vier Schliesswege ab, die es sonst gaebe:
  // Esc (PANELS), das Kreuz in der Namenszeile, der Klick daneben (U1) und
  // der Weltcheck in gespraechTick(). Ein Guard an der Engstelle statt vier
  // Sonderfaellen an den Aufrufern.
  if(szeneAktiv) return;
  if(!gespraechOffen) return;
  gespraechOffen = false; gespraech.npc = null; gespraech.fig = null;
  el('gespraech').style.display = 'none';
  MUS.muffle(); panelSicht();
}

function gespraechFertigTippen(){
  gespraech.tipp = gespraech.z1.length + gespraech.z2.length;
  gespraechTextZeichnen();
}

// Das Bild links. Kein eigenes Portraetblatt im Pack — gezeigt wird der erste
// Ruheframe desselben Blattes, das die Figur in der Welt traegt, dreifach und
// ungeglaettet (Regressionsregel 14).
//
// Der Ausschnitt ist gemessen, nicht geschaetzt. Die Figur steht im 64x64-Feld
// nicht formatfuellend, sondern klein in seiner Mitte: im Ruheframe reicht ihre
// Deckflaeche bei Farmer_Bob von x=24 bis 39 und von y=19 bis zur Fusslinie 40,
// beim Held-Komposit (Bramsche) von x=25 bis 37 und y=21 bis 40. Ein erster
// Versuch mit dem halben Feld (x 16..48, y 6..42) zeigte deshalb vor allem
// leeren Rand — die Figur war vierfach vergroessert und trotzdem verloren.
//
// Genommen wird jetzt x 21..43 und y 15..42: waagerecht um ax=32 zentriert,
// senkrecht vier Pixel ueber dem hoechsten gemessenen Scheitel bis zwei unter
// die Fusslinie ay=40 — Luft fuer eine Kopfbedeckung, die hoeher sitzt als die
// drei vermessenen. Fuenffach sind das 110x135. Ganze Zahl, damit kein Pixel
// zwischen zwei Pixel faellt. Passt fuer beide Bauweisen, Pack-Blatt wie
// Held-Komposit, weil beide dasselbe 64er-Raster und denselben Anker benutzen.
//
// U5: Der Ausschnitt gilt weiter, aber nur noch fuer die Figuren ohne gemaltes
// Bild. Zwei Zahlen haben sich dabei geaendert, und beide folgen aus dem
// quadratischen Feld: vierfach statt fuenffach (fuenffach waeren 135 Pixel
// Hoehe und passten nicht in 128), und mittig statt randfuellend. 88x108 in
// 128x128 laesst links und rechts je 20 Pixel und oben 20 — ganze Zahlen,
// damit kein Pixel zwischen zwei Pixel faellt, dieselbe Regel wie oben.
const PORTRAET_X = 21, PORTRAET_Y = 15, PORTRAET_B = 22, PORTRAET_H = 27, PORTRAET_SC = 4;
function gespraechPortrait(n){
  const c = el('gespraechPortrait'), cc = c.getContext('2d');
  cc.clearRect(0, 0, c.width, c.height);
  cc.imageSmoothingEnabled = false;
  // U5: erst das gemalte Portraet. Es ist eine 128x128-Datei und damit genau
  // die Leinwand — kein Ausschnitt, kein Raster, keine Zeilenrechnung.
  //
  // Und keine Toenung. Noergels gruener Anstrich (tint) faerbt in der Welt ein
  // Pack-Blatt ein, das ihm nicht gehoert; sein Portraet ist von vornherein er
  // selbst. Dieselbe Farbe ein zweites Mal darueberzulegen waere kein Kanon,
  // sondern ein doppelter Auftrag. Wer die Figuren nebeneinander sieht: in der
  // Welt bleibt er gruen, das ist unveraendert.
  const p = n.figur && SHEETS[portraetBlatt(n.figur.key)];
  if(p && p.img){ cc.drawImage(p.img, 0, 0, c.width, c.height); return; }
  const s = SHEETS[n.sheetIdle];
  if(!s || !s.img) return;                       // ohne Blatt bleibt das Feld dunkel
  // Getoente Figuren (Noergel) genauso wie in drawSpriteAt: die Kopie enthaelt
  // nur die Zeilen ab rowStart, dort wird ohne Zeilenversatz gelesen.
  const src = n.tint ? (tintedSheet(n.sheetIdle, n.tint, n.tintA == null ? 0.55 : n.tintA) || s.img) : s.img;
  const row = n.tint ? 0 : (s.rowStart || 0);
  const bb = PORTRAET_B*PORTRAET_SC, hh = PORTRAET_H*PORTRAET_SC;
  cc.drawImage(src, PORTRAET_X, row*s.fh + PORTRAET_Y, PORTRAET_B, PORTRAET_H,
                    (c.width - bb) >> 1, c.height - hh, bb, hh);
}

// U4: Das Bild rechts unten. Derselbe Ausschnitt, dasselbe Raster, eine Stufe
// kleiner (vierfach statt fuenffach) — die untere Haelfte gehoert der Wahl und
// nicht dem Spiegel.
//
// Gelesen wird SHEETS['hero_baked'], also genau das Blatt, das der Spieler in
// der Welt traegt: die Frisur der Schicht, die Haarfarbe der Schicht und die
// angelegte Ruestung stehen damit von selbst auf dem Bild, ohne dass hier eine
// Zeile davon weiss (derselbe Weg wie renderAusweisFoto(), P1-Notiz dort).
// Der Ausschnitt ist NICHT der des Lichtbilds: das Passbild zeigt Kopf und
// Schultern, hier steht die ganze Figur, sonst waere das Gegenueber oben eine
// Person und der Spieler unten ein Passfoto.
//
// Das Blatt liegt in EINER Reihe (bakeHeroSheet baut alle Anims nebeneinander,
// rowStart:0), der Ruheframe steht deshalb bei BAKED_HERO_ANIM.idle.offset und
// nicht in Zeile 0 wie bei den Pack-Blaettern. Frame 0 und nicht der laufende
// Takt: ein Portraet zappelt nicht.
const ICH_PORTRAET_SC = 4;
function gespraechIchPortrait(){
  const c = el('gespraechIchPortrait'), cc = c.getContext('2d');
  cc.clearRect(0, 0, c.width, c.height);
  const s = SHEETS['hero_baked'];
  if(!s || !s.img || !BAKED_HERO_ANIM) return;   // vor loadAssets(): leeres Feld, kein Fehler
  cc.imageSmoothingEnabled = false;
  cc.drawImage(s.img, BAKED_HERO_ANIM.idle.offset * s.fw + PORTRAET_X, PORTRAET_Y, PORTRAET_B, PORTRAET_H,
                      0, 0, PORTRAET_B*ICH_PORTRAET_SC, PORTRAET_H*ICH_PORTRAET_SC);
}

// Nur der Textteil, damit der Tipp-Takt nicht die ganze Tafel neu baut.
function gespraechTextZeichnen(){
  // Auf ganze Zeichen gerundet vergleichen: gespraech.tipp waechst mit dt und
  // ist fast immer gebrochen. Ohne das Abrunden waere jeder Frame ein anderer
  // Wert und die Tafel wuerde neu gebaut, auch wenn kein Buchstabe dazukam.
  const t = Math.floor(gespraech.tipp);
  if(gespraech.tippGezeigt === t) return;
  gespraech.tippGezeigt = t;
  const n1 = Math.min(t, gespraech.z1.length);
  const n2 = Math.max(0, t - gespraech.z1.length);
  const fertig = t >= gespraech.z1.length + gespraech.z2.length;
  // Der Blinker sitzt am Ende des gerade wachsenden Textes und verschwindet,
  // sobald alles steht — dieselbe Aussage wie das Dreieck im Vorbild.
  const cur = fertig ? '' : '<span class="cur">▌</span>';
  const z2 = gespraech.z2 ? `<div class="z2">${gEsc(gespraech.z2.slice(0, n2))}${n1 >= gespraech.z1.length ? cur : ''}</div>` : '';
  const feld = el('gespraechText');
  feld.innerHTML =
    `<div>${gEsc(gespraech.z1.slice(0, n1))}${(!gespraech.z2 || n1 < gespraech.z1.length) ? cur : ''}</div>${z2}`;
  // U6: Seit das Satzfeld rollen kann (enger Schirm, grosse Schrift), muss es
  // dem Tippwerk hinterherrollen. Sonst laeuft der Satz ausserhalb des Bildes
  // weiter, der Blinker steht unter der Kante, und wer nicht von selbst wischt,
  // liest die halbe Zeile. Nach unten und nicht an den Anfang: der Blinker ist
  // die Stelle, an der gerade geschrieben wird, und die will man sehen.
  //
  // Ein Lesevorgang auf scrollHeight je Buchstabe (nicht je Frame): das ist
  // dieselbe Groessenordnung wie das innerHTML darueber, das seit U3 an
  // derselben Stelle steht und aus demselben Grund erlaubt ist.
  const zuviel = feld.scrollHeight > feld.clientHeight + 1;
  if(zuviel) feld.scrollTop = feld.scrollHeight;
  if(zuviel !== gespraech.rollt){
    gespraech.rollt = zuviel;
    el('gespraechRechts').classList.toggle('rollt', zuviel);
  }
}

function gespraechZeichnen(){
  if(!gespraechOffen) return;
  el('gespraechNameTxt').textContent = gespraech.fig.name;
  // U4: Wer antwortet, steht ueber der Antwortliste. Bei jedem Zeichnen neu
  // gelesen und nicht beim Oeffnen einmal: rangName() kann sich waehrend eines
  // offenen Fensters aendern (eine Hebung faellt beim Schichtende, aber der
  // Empfang laeuft ueber dieselbe Tafel, und dort wechselt der Titel mit der
  // Unterschrift). Eine Zuweisung je Antwort ist billiger als ein Sonderfall.
  el('gespraechIchName').textContent = rangName();
  gespraech.opts = gespraechOptionen();
  if(gespraech.wahl >= gespraech.opts.length) gespraech.wahl = 0;
  el('gespraechWahl').innerHTML = gespraech.opts.map((o, i) =>
    `<div class="gwOpt${i === gespraech.wahl ? ' hot' : ''}" data-i="${i}"><span class="gwNr">${i+1}.</span><span>${gEsc(o.t)}</span></div>`
  ).join('');
  gespraech.tippGezeigt = -1;
  gespraechTextZeichnen();
}

// Nur die Markierung umhaengen, ohne die Liste neu zu bauen (Pfeiltasten,
// Mauszeiger). Ein innerHTML pro Mausbewegung waere ein Neubau je Frame.
function gespraechWahlSetzen(i){
  if(!gespraechOffen || !gespraech.opts.length) return;
  gespraech.wahl = ((i % gespraech.opts.length) + gespraech.opts.length) % gespraech.opts.length;
  const kinder = el('gespraechWahl').children;
  for(let k = 0; k < kinder.length; k++) kinder[k].classList.toggle('hot', k === gespraech.wahl);
}

// Eine Antwort ausloesen. Laeuft der Text noch, holt der erste Griff ihn erst
// zu Ende — sonst waere jeder ungeduldige Klick ein uebersprungener Satz.
function gespraechWaehlen(i){
  if(!gespraechOffen) return;
  if(gespraech.tipp < gespraech.z1.length + gespraech.z2.length){ gespraechFertigTippen(); return; }
  const o = gespraech.opts[i];
  if(!o) return;
  gespraechWahlSetzen(i);
  o.tun();
  if(gespraechOffen) gespraechZeichnen();   // die Beschriftungen haengen am Zustand
}

el('gespraechWahl').addEventListener('mousedown', e => {
  const z = e.target.closest('.gwOpt'); if(!z) return;
  e.preventDefault();
  gespraechWaehlen(+z.dataset.i);
});
el('gespraechWahl').addEventListener('mousemove', e => {
  const z = e.target.closest('.gwOpt'); if(!z) return;
  gespraechWahlSetzen(+z.dataset.i);
});

// Tastatur, solange das Fenster offen ist. Liefert true, wenn der Druck
// verbraucht ist — der grosse keydown-Lauscher steigt dann aus, sonst waere
// die '1' gleichzeitig eine Antwort und ein Heiltrank.
// WASD bleibt bewusst frei: wer weggeht, geht weg, und das Fenster merkt es
// selbst (gespraechTick).
function gespraechTaste(e){
  if(!gespraechOffen) return false;
  const k = e.key;
  if(k >= '1' && k <= '9'){ e.preventDefault(); gespraechWaehlen(+k - 1); return true; }
  if(k === 'ArrowUp'){   e.preventDefault(); gespraechWahlSetzen(gespraech.wahl - 1); return true; }
  if(k === 'ArrowDown'){ e.preventDefault(); gespraechWahlSetzen(gespraech.wahl + 1); return true; }
  if(k === 'Enter'){     e.preventDefault(); gespraechWaehlen(gespraech.wahl); return true; }
  return false;
}

// Laeuft im Takt der Schleife: tippt den Satz weiter und raeumt das Fenster
// weg, wenn sein Gegenueber nicht mehr da ist. Der zweite Teil ist kein
// Luxus — npcs wird bei jedem Weltwechsel geleert, ein festgehaltener Eintrag
// waere eine Leiche mit Sprechblase.
function gespraechTick(dt){
  if(!gespraechOffen) return;
  const n = gespraech.npc;
  // E1: Eine Szene steht auf keiner Kachel. Ihr Gegenueber ist kein Eintrag in
  // npcs, und eine Entfernung zu ihm gibt es nicht. Die Weltpruefung wird
  // deshalb uebersprungen, das Tippwerk darunter gilt unveraendert fuer beide.
  // SZ1: gilt jetzt fuer jede Szene und nicht nur fuer den Empfang.
  if(!szeneAktiv){
    // U6: Knoeterich steht nicht in npcs, sondern fest im Haus. Die Frage "gibt
    // es dich noch?" hat bei ihm keinen Sinn, die Frage "stehst du noch neben
    // mir?" schon: sein Eintrag traegt KN_POS in x/y, die Entfernung wird also
    // gegen dieselben Zahlen gemessen wie bei jeder Dorffigur.
    // IN1: drinnen ist currentLevel 4 und das Gespraech trotzdem gueltig. Die
    // Frage, die diese Zeile stellt, ist nicht "welche Ebene", sondern "steht
    // die Figur noch neben mir" — npcs.indexOf() beantwortet sie in beiden
    // Welten, und beim Hineingehen wie beim Hinausgehen wird npcs getauscht.
    if(!n || state !== 'play' || (currentLevel !== 1 && !innen) || kammer ||
       (n !== knNpc && npcs.indexOf(n) < 0) || sqDist(player.x, player.y, n.x, n.y) > GESPRAECH_WEG_Q){
      gespraechSchliessen(); return;
    }
  }
  const ganz = gespraech.z1.length + gespraech.z2.length;
  if(gespraech.tipp < ganz){
    gespraech.tipp = Math.min(ganz, gespraech.tipp + dt * GESPRAECH_TEMPO);
    gespraechTextZeichnen();
  }
}

// U3-Guard. Er wirft nicht, er meldet — wie die uebrigen. Geprueft wird das,
// was U3 zugesagt hat und was beim naechsten Eingriff leise kaputtgehen kann:
//
//   1. Jede Dorffigur hat ein Schild, und es passt ueber einen Kopf.
//   2. Das Schild gehoert zu seiner Figur (letztes Wort steht im vollen Namen)
//      — die Falle beim Nachtragen einer zwoelften Zeile per Kopie.
//   3. Jede Figur bekommt genau vier Antworten, keine leer, keine zu breit
//      fuer ihre Zeile.
//   4. Der Portraetausschnitt liegt im 64er-Raster.
//   5. Die Tafel hat zwei Haelften, und jedes Stueck steht in der richtigen
//      (U4). Ein verrutschtes </div> beim naechsten Eingriff schoebe die
//      Antwortliste zurueck in die obere Haelfte, und das Fenster saehe wieder
//      aus wie vor U4, ohne dass ein einziger Fehler in der Konsole stuende.
//
// Die Schriftstufen prueft schriftAssert() und nicht dieser Guard: sie stehen
// erst weiter unten im Skript und waeren von hier aus ein ReferenceError durch
// Temporal Dead Zone — genau der Fehler, den node --check nicht findet (README).
//
// Steht hier und nicht bei den uebrigen Guards: er liest DORF_FIGUREN und
// gespraechOptionen(), beide weiter oben, und die Namensschild-Konstanten aus
// drawNpcName() sind an dieser Stelle noch in der TDZ. Der Deckel steht
// deshalb hier als eigene Zahl und nicht als Verweis dorthin.
const SCHILD_DECKEL = 24, ANTWORT_DECKEL = 28;
function gespraechAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('U3 Gespräch:', m, ...r); };
  for(const f of DORF_FIGUREN){
    if(!f.kurz) { fehler('Figur ohne Namensschild', f.key); continue; }
    if(f.kurz.length > SCHILD_DECKEL) fehler('Namensschild zu lang', f.key, f.kurz.length);
    const letztes = f.kurz.replace(/[,.]/g, '').split(/\s+/).pop();
    if(f.name.indexOf(letztes) < 0) fehler('Namensschild passt nicht zum Namen', f.key, f.kurz);
    const opts = gespraechOptionen(f);
    // U3 verlangte genau vier Zeilen. F1d macht daraus vier oder fünf: die
    // fünfte ist die Tür zum Gesprächsbaum und steht nur da, wenn einer fällig
    // ist. Was sich nicht ändert, ist die letzte Zeile: der Abschied bleibt
    // unten, sonst sucht ihn der Spieler in der Mitte.
    if(opts.length !== 4 && opts.length !== 5) fehler('Antwortliste hat nicht vier oder fünf Zeilen', f.key, opts.length);
    if(opts.length && opts[opts.length-1].t !== 'Auf Wiedersehen.') fehler('letzte Antwort ist nicht der Abschied', f.key, opts[opts.length-1].t);
    if(opts.length === 5 && opts[3].t !== BAUM_EINSTIEG) fehler('fünfte Zeile ist nicht die Tür zum Baum', f.key, opts[3].t);
    for(const o of opts){
      if(!o.t) fehler('leere Antwort', f.key);
      else if(o.t.length > ANTWORT_DECKEL) fehler('Antwort zu lang', f.key, o.t);
      if(typeof o.tun !== 'function') fehler('Antwort ohne Wirkung', f.key, o.t);
    }
  }
  if(KN_NAME_KURZ.length > SCHILD_DECKEL) fehler('Knöterichs Schild zu lang', KN_NAME_KURZ.length);
  // U6: Knöterichs eigene Antwortliste. Sie ist die einzige im Spiel, die ihre
  // Länge ändert: die Nachschlag-Antwort steht nur da, wenn überhaupt schon ein
  // Dienstzettel gelaufen ist. Geprüft werden deshalb beide Stände. kn.history
  // wird dafür gespiegelt und exakt zurückgesetzt, Idiom aus anredeAssert().
  {
    const echt = kn.history;
    try {
      for(const [hist, soll] of [[[], 4], [[{z1:'Vermerkt.', z2:'Notiert.'}], 5]]){
        kn.history = hist;
        const opts = gespraechOptionen(KN_FIGUR);
        if(opts.length !== soll) fehler('Knöterichs Antwortliste hat', opts.length, 'Zeilen statt', soll);
        for(const o of opts){
          if(!o.t) fehler('leere Antwort', 'knoeterich');
          else if(o.t.length > ANTWORT_DECKEL) fehler('Antwort zu lang', 'knoeterich', o.t);
          if(typeof o.tun !== 'function') fehler('Antwort ohne Wirkung', 'knoeterich', o.t);
        }
      }
    } finally { kn.history = echt; }
  }
  if(PORTRAET_X + PORTRAET_B > 64 || PORTRAET_Y + PORTRAET_H > 64)
    fehler('Porträtausschnitt liegt außerhalb des 64er-Rasters');
  // U4: die Zweiteilung. Geprüft wird nicht, wie es aussieht, sondern wo die
  // vier Stücke hängen — das ist das, was ein Eingriff versehentlich umhängt.
  const drin = (kind, eltern) => {
    const k = el(kind), e = el(eltern);
    if(!k) { fehler('Tafelteil fehlt', kind); return; }
    if(!e) { fehler('Tafelhälfte fehlt', eltern); return; }
    if(!e.contains(k)) fehler('Tafelteil steht in der falschen Hälfte', kind, 'gehört in', eltern);
  };
  drin('gespraechBild', 'gespraechOben');
  drin('gespraechText', 'gespraechOben');
  drin('gespraechIchName', 'gespraechUnten');
  drin('gespraechWahl', 'gespraechUnten');
  // U5: Steht jeder Porträtschlüssel für eine Figur, die auch spricht? Das
  // Bild wird über figur.key gesucht, ein Tippfehler in PORTRAET_FIGUREN
  // bliebe deshalb stumm — die Figur bekäme wortlos den Sprite-Ausschnitt,
  // und die Datei läge ungenutzt im Build. Ob die Datei da ist, prüft
  // portraetAssert() nach dem Laden; hier geht es nur um die Namen.
  // T3: 'anlage2' steht neben 'knoeterich' in der Ausnahme, und zwar aus
  // demselben Grund: beide sprechen, ohne in DORF_FIGUREN zu stehen. Knöterich
  // steht im Haus statt im Dorf, Anlage 2 liegt in der Tasche.
  for(const k of PORTRAET_FIGUREN)
    if(k !== 'knoeterich' && k !== 'anlage2' && !DORF_FIGUREN.some(f => f.key === k))
      fehler('Porträtschlüssel gehört zu keiner Figur', k);
  const ohne = DORF_FIGUREN.filter(f => !PORTRAET_FIGUREN.includes(f.key)).map(f => f.key);
  if(ok) console.log(`U3 Gespräch: ${DORF_FIGUREN.length} Namensschilder, vier oder fünf Antworten und zwei Tafelhälften in Ordnung.`);
  if(ok) console.log(`U5 Porträts: ${PORTRAET_FIGUREN.length} gemalte Bilder zugeordnet, Sprite-Ausschnitt für ${ohne.join(' und ') || 'niemanden'}.`);
}
gespraechAssert();

// G8-Guard, auf Skriptebene wie gespraechAssert() und aus demselben Grund: was
// er prüft, steht in einer Tabelle und nicht in einer Bilddatei.
//
// Der Fehler, gegen den er steht, ist stumm. Ein Tippfehler in einem Hexwert,
// eine Frisur, die es nicht gibt, eine Stufe über dem Rand von CF_ARMOR_FILES —
// nichts davon wirft. farbBlatt() bekäme dann keinen Ton oder kein Blatt und
// fiele auf den Naturton zurück, bakeNpcSheet() ließe die Ebene einfach weg.
// Die Figur stünde im Dorf, hätte einen Namen, ein Schild und ein Gespräch, und
// nur ihre Farbe wäre wieder die aus dem Grafikpaket. Genau das war der
// Ausgangspunkt von G8, und es soll nicht durch die Hintertür zurückkommen.
//
// Sechs Prüfungen, alle an dem, was ein Eingriff versehentlich verstellt:
//
//   1. Die Frisur gibt es. Ein Blatt cfhair_h7_idle existiert nicht, und
//      blitFarbFrame() kehrt bei einem fehlenden Key still um — die Figur wäre
//      kahl statt falsch frisiert, und niemand bekäme eine Meldung.
//   2. Jedes Kleidungsstück gibt es. Dieselbe Stille: ein hemd:'frack' zöge die
//      Figur einfach aus, ohne dass irgendwo etwas meldet.
//   3. Jeder Farbwert ist ein Hexwert. hexHsl() liest mit parseInt() und macht
//      aus '#hallo' klaglos NaN; die Rechnung liefert dann eine schwarze Fläche.
//   4. Keine Farbe ohne Ebene. hemdFarbe ohne hemd ist ein Wert, den nie
//      jemand liest — meist die Hälfte einer abgebrochenen Änderung.
//   5. Keine Rüstungsstufe mehr. G9 hat chest/legs/feet durch die Garderobe
//      ersetzt; wer die alten Felder wieder einträgt, bekommt keine Kleidung,
//      sondern gar nichts. Der Guard sagt es, statt die Figur auszuziehen.
//   6. komposit steht nur bei Wandernden. Bei opt:'fest' ist das Komposit
//      ohnehin der einzige Weg, das Flag wäre dort eine Behauptung ohne Wirkung.
//   7. Keine zwei Figuren sehen gleich aus. Frisur, Haarfarbe, Hemdform,
//      Hemdfarbe und Hut sind zusammen das, was man auf 24 Pixeln unterscheidet.
//      Zwei gleiche Fünflinge im selben Dorf sind kein Stil, sondern ein
//      Kopierfehler — und der wäre im Bild schwerer zu finden als hier.
//   8. G10: Ein Monsterrig gibt es, und es kann laufen. Ein rig:'ork' ohne
//      Eintrag in CF_RIGS liefe still ins Leere und die Figur stünde als
//      Komposit da — sichtbar nur dem, der genau diese Figur ansieht. Und ein
//      Rig ohne walk-Reihe schlitterte im Standbild über den Anger.
const HEXWERT = /^#[0-9a-f]{6}$/i;
const FARBFELD = {haarFarbe:'hair', hemdFarbe:'hemd', hoseFarbe:'hose', schuhFarbe:'schuh', hutFarbe:'hut'};
function figurenFarbenAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('G9 Figurenfarben:', m, ...r); };
  const gesehen = new Map();
  // Knöterich steht nicht in der Tabelle, trägt aber dasselbe Komposit.
  // U6: und seit U6 gibt es seinen Eintrag wirklich (KN_FIGUR) statt eines
  // Abzugs davon, der hier nur für diesen Guard gebaut wurde.
  const alle = [KN_FIGUR, ...DORF_FIGUREN];
  for(const f of alle){
    const g = f.gestalt;
    if(!g){ fehler('Figur ohne Gestalt', f.key); continue; }
    if(!HAIRS.includes(g.hair)) fehler('Frisur gibt es nicht', f.key, g.hair);
    for(const slot of ['hemd', 'hose', 'schuh', 'hut'])
      if(g[slot] != null && !CF_GARDEROBE[slot][g[slot]])
        fehler(`${slot} gibt es nicht in der Garderobe`, f.key, g[slot]);
    for(const feld in FARBFELD){
      if(g[feld] == null) continue;
      if(!HEXWERT.test(g[feld])) fehler('kein Hexwert', f.key, feld, g[feld]);
      // haarFarbe hängt an hair (immer da), die übrigen an ihrem Slot.
      const slot = FARBFELD[feld];
      if(slot !== 'hair' && g[slot] == null) fehler(`${feld} ohne ${slot}`, f.key);
    }
    if(g.hautFarbe != null && !HEXWERT.test(g.hautFarbe)) fehler('kein Hexwert', f.key, 'hautFarbe', g.hautFarbe);
    for(const alt of ['chest', 'legs', 'feet'])
      if(g[alt] != null) fehler(`${alt} ist seit G9 die Garderobe (hemd/hose/schuh)`, f.key);
    if(f.komposit && f.opt === 'fest') fehler('komposit bei einer festen Figur ist wirkungslos', f.key);
    if(f.rig){
      const r = CF_RIGS[f.rig];
      if(!r) fehler('Rig gibt es nicht', f.key, f.rig);
      else for(const anim of ['idle', 'walk'])
        if(!r.anims[anim]) fehler(`Rig ohne ${anim}-Reihe`, f.key, f.rig);
    }
    if(f.rigSc != null && !f.rig) fehler('rigSc ohne rig ist wirkungslos', f.key);
    const bild = `${g.hair}|${g.haarFarbe || '-'}|${g.hemd || '-'}|${g.hemdFarbe || '-'}|${g.hut || '-'}`;
    if(gesehen.has(bild)) fehler('sieht aus wie', f.key, gesehen.get(bild));
    else gesehen.set(bild, f.key);
  }
  const behuetet = alle.filter(f => f.gestalt && f.gestalt.hut).length;
  const haut = alle.filter(f => f.gestalt && f.gestalt.hautFarbe).length;
  const rigs = alle.filter(f => f.rig).length;
  if(ok) console.log(`G10 Figurenfarben: ${alle.length} Figuren eingekleidet, ${behuetet} mit Kopfbedeckung, `
    + `${haut} mit eigenem Hautton, ${rigs} auf einem Monsterrig.`);
}
figurenFarbenAssert();

// G9-Nachtrag-Guard. Laeuft nicht auf Skriptebene, sondern hinter loadAssets()
// wie dorfSichtAssert() und portraetAssert(), weil er das Einzige misst, was
// figurenFarbenAssert() nicht sehen kann: nicht ob die FORM in der Garderobe
// steht, sondern ob es das BLATT dazu gibt.
//
// Genau diese Luecke hat drei Bauabschnitte lang gehalten. figurenFarbenAssert()
// meldete "15 Figuren eingekleidet, 2 mit Kopfbedeckung" und hatte recht — die
// Tabelle war vollstaendig. Im Bild stand derweil Wirt Fass ohne Hemd, weil
// hinter hemd:'karo' keine Datei lag. Eine Zusage ueber eine Tabelle ist keine
// Zusage ueber das Bild.
function garderobeAssert(){
  // Ohne Grafikpaket gibt es nichts zu messen: dann fehlt jedes Blatt, und die
  // Meldung waere eine Liste statt eines Befundes.
  if(!SHEETS['cfbody_idle']) return;
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('G9 Garderobe:', m, ...r); };
  const ersetzt = [], fehlt = [];
  for(const slot in CF_GARDEROBE)
    for(const form in CF_GARDEROBE[slot]){
      if(SHEETS[`cf${slot}_${form}_idle`]) continue;
      const e = (CF_GARDEROBE_ERSATZ[slot] || {})[form];
      if(e && SHEETS[`cf${slot}_${e}_idle`]) ersetzt.push(`${slot}:${form}\u2192${e}`);
      else fehlt.push(`${slot}:${form}`);
    }
  // Der eigentliche Befund: wen trifft es, und woran ist es zu sehen. Hemd, Hose
  // und Schuh sind Fehler — dort bleibt Haut uebrig. Die Kopfbedeckung ist
  // keiner: ohne sie steht die Figur mit Haar da, also so wie vor G9.
  const ohneHut = [];
  for(const f of [KN_FIGUR, ...DORF_FIGUREN]){
    const g = f.gestalt;
    if(!g || f.rig) continue;                       // ein Rigblatt traegt keine Garderobe
    for(const slot of ['hemd', 'hose', 'schuh'])
      if(g[slot] != null && !garderobeBlatt(slot, g[slot], 'idle'))
        fehler(`${f.key} traegt ${slot}:'${g[slot]}', dafuer liegt weder Blatt noch Ersatz —`
             + ' die Figur steht ohne', slot);
    if(g.hut != null && !garderobeBlatt('hut', g.hut, 'idle')) ohneHut.push(f.key);
  }
  if(!ok) return;
  const teile = [`${Object.values(CF_GARDEROBE).reduce((n, o) => n + Object.keys(o).length, 0)} Formen`];
  teile.push(ersetzt.length ? `${ersetzt.length} durch Ersatz gedeckt (${ersetzt.join(', ')})` : 'keine ersetzt');
  if(fehlt.length) teile.push(`${fehlt.length} ohne Blatt und ohne Ersatz (${fehlt.join(', ')})`);
  if(ohneHut.length) teile.push(`deshalb ohne Kopfbedeckung im Dorf: ${ohneHut.join(', ')}`);
  console.log(`G9 Garderobe: ${teile.join(', ')}.`);
}

// --- G5: Amtsstube-Panel (Kontext-Taste F am Amt-Gebäude) -------------------
// Reine Anzeige, kein Kauf (der bleibt showDorf()/dem Schichtende vorbehalten,
// s. Plan-Entscheidung) — nur Bankguthaben/Ausbauten-Überblick plus die Option,
// die laufende Schicht freiwillig zu beenden. state bleibt 'play', solange das
// Fenster offen ist (wie #schloss/#kessel auch), erst "Feierabend nehmen" wechselt
// nach 'feierabend' über den bestehenden endShift()-Weg.
let amtFensterOpen = false;
function amtFensterOeffnen(){
  amtFensterOpen = true;
  el('amtFenster').style.display = 'block';
  renderAmtFenster();
  MUS.muffle();   // offenes Panel dämpft die Musik
  panelSicht();   // U1
}
function amtFensterSchliessen(){ amtFensterOpen = false; el('amtFenster').style.display = 'none'; MUS.muffle(); panelSicht(); }
function renderAmtFenster(){
  const rows = AUSBAU_DEFS.map(d => `<div style="display:flex;justify-content:space-between;font-size:calc(11px * var(--fs));padding:3px 0;">
    <span>${d.name}</span><span style="color:#c9b98a;">${d.unit(amt.ausbauten[d.key])}</span></div>`).join('');
  // amt.schichten zählt abgeschlossene Schichten (Inkrement erst in endShift()). Dieses
  // Panel ist nur im laufenden Dienst offen (fuehreAktion() sperrt alles außer state 'play'),
  // also +1 wie in knBegruessungLine(). showDorf()/showJahresgespraech() bleiben beim Rohwert.
  el('amtFenster').innerHTML = `
    <h2>🏛 Amtsstube <span class="panelZu" style="cursor:pointer;" onclick="amtFensterSchliessen()">✖</span></h2>
    <p style="font-size:calc(12px * var(--fs));color:#9a8a5f;margin:0 0 4px;">Schicht ${amt.schichten + 1} · Bankguthaben: <i class="ico ico-gold">💰</i> ${amt.bankGold}</p>
    <p style="font-size:calc(11px * var(--fs));color:#c9b98a;margin:0 0 8px;">${rangName()}<br>${rangGruppeName()} · ${rangVerhaeltnis()}</p>
    <div style="text-align:left;">${rows}</div>
    ${auftragFensterBlock()}
    ${langGiesskanneBlock()}
    ${schubladeBlock()}
    ${mappenBlock()}
    <button onclick="amtFeierabendNehmen()" style="width:100%;margin-top:12px;">FEIERABEND NEHMEN</button>
  `;
}
// W4: laufender Aushang, als eigene Funktion statt Inline-IIFE, weil renderAmtFenster()
// sonst schon zwei Bildschirmbreiten lang wäre. CONFIG.schichtModus-Wächter nicht
// überflüssig: ein Spielstand aus dem Schichtmodus kann einen veralteten amt.auftrag tragen.
function auftragFensterBlock(){
  const a = CONFIG.schichtModus ? amt.auftrag : null;
  if(!a) return '';
  const def = AUFTRAG_TYPEN[a.typ];
  const farbe = auftragFertig ? '#8fdc8f' : auftragVerletzt ? '#ff8f8f' : '#c9b98a';
  const zeile = auftragFertig  ? `Erfüllt. ${a.lohn} Gold verbucht.`
              : auftragVerletzt ? 'Hinfällig. Ohne Folgen.'
              : `Stand: ${auftragStandWert(a)} von ${a.ziel}`;
  return `<div style="margin-top:10px;padding-top:8px;border-top:1px solid #5a4a2d;text-align:left;">
    <div style="font-size:calc(12px * var(--fs));color:#f4d97a;"><b>${def.titel(a)}</b></div>
    <div style="font-size:calc(11px * var(--fs));color:#9a8a5f;">${def.satz(a)}</div>
    <div style="font-size:calc(12px * var(--fs));color:${farbe};margin-top:3px;">${zeile}</div>
    ${auftragFertig || auftragVerletzt ? '' : `<div style="font-size:calc(10px * var(--fs));color:#9a8a5f;margin-top:5px;">
      <span style="cursor:pointer;text-decoration:underline;" onclick="auftragZurueckgeben()">Aushang zurückgeben</span></div>`}
  </div>`;
}
function amtFeierabendNehmen(){
  amtFensterSchliessen();
  state = 'feierabend'; endShift('amt');
}

// --- Symbolschloss-Panel ----------------------------------------------------
let schlossMod = null;
const schlossEin = [];
function schlossAuf(mod){
  schlossMod = mod; schlossOpen = true; schlossEin.length = 0;
  el('schloss').style.display = 'block';
  renderSchloss();
  MUS.muffle();   // offenes Panel dämpft die Musik
  panelSicht();   // U1
}
function schlossZu(){ schlossOpen = false; schlossMod = null; el('schloss').style.display = 'none'; MUS.muffle(); panelSicht(); }
function schlossTippe(s){
  if(!schlossMod) return;
  schlossEin.push(s);
  if(schlossEin.length >= 3){
    const ok = schlossEin.every((v, i) => v === schlossMod.code[i]);
    if(ok){ schlossMod.fertig = true; sfx.level(); schlossZu(); return; }
    schlossEin.length = 0; sfx.hurt();
    el('schlossMsg').textContent = 'Abgelehnt.';
  }
  renderSchloss();
}
function renderSchloss(){
  el('schlossAnz').textContent = [0,1,2].map(i => schlossEin[i] || '_').join('  ');
  const g = el('schlossTasten');
  if(g.childElementCount === 0){
    for(const s of KAM_SYM){
      const b = document.createElement('div');
      b.className = 'symBtn'; b.textContent = s;
      b.onclick = () => schlossTippe(s);
      g.appendChild(b);
    }
  }
}

// --- Zeichnen ---------------------------------------------------------------
// Bodenmarkierungen liegen flach unter allem und laufen nicht über den y-Pool.
function drawKammerBoden(){
  const k = kammer, mod = k.mods[k.idx];
  ctx.save();
  if(mod && !mod.fertig){
    if(mod.kind === 'brechen'){
      for(const g of mod.kaputt){
        ctx.fillStyle = '#0a0812';
        ctx.fillRect(g.x - TS/2, g.y - TS/2, TS, TS);
      }
      if(mod.zeigT > 0){
        ctx.globalAlpha = Math.min(1, mod.zeigT) * 0.6;
        ctx.fillStyle = '#6aff8f';
        for(let i = 0; i < mod.pfad.length; i++)
          ctx.fillRect((mod.fx0+i)*TS + 3, (mod.fy0 + mod.pfad[i])*TS + 3, TS-6, TS-6);
        ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = 'rgba(150,140,190,.35)'; ctx.lineWidth = 1;
      for(let x = mod.fx0; x <= mod.fx1; x++)
        for(let y = mod.fy0; y <= mod.fy1; y++) ctx.strokeRect(x*TS+2, y*TS+2, TS-4, TS-4);
    }
    if(mod.kind === 'bloecke'){
      ctx.strokeStyle = '#f4d97a'; ctx.lineWidth = 2; ctx.setLineDash(DASH_5_4);
      for(const z of mod.ziele) ctx.strokeRect(z.x - 13, z.y - 13, 26, 26);
      ctx.setLineDash(DASH_AUS);
    }
    if(mod.kind === 'spiegel' && mod.pfad.length >= 4){
      ctx.strokeStyle = '#ffe14d'; ctx.lineWidth = 3;
      ctx.shadowColor = '#ffe14d'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.moveTo(mod.pfad[0], mod.pfad[1]);
      for(let i = 2; i < mod.pfad.length; i += 2) ctx.lineTo(mod.pfad[i], mod.pfad[i+1]);
      ctx.stroke(); ctx.shadowBlur = 0;
    }
  }
  ctx.restore();
}

function drawKammerObj(o){
  const nah = sqDist(player.x, player.y, o.x, o.y) < 9000;
  ctx.save();
  ctx.textAlign = 'center';
  switch(o.kt){
    case 'tor': {
      if(o.offen){
        const t = gameT - o.openT;
        if(t < 26/18) drawSprite(kammer.dkGateAnim, Math.floor(t*18), o.x, o.y, 2);
        break;
      }
      drawSprite(kammer.dkGate, 0, o.x, o.y, 2);
      break;
    }
    case 'platte':
      drawSprite(kammer.dkPlate, o.symIdx + (o.an ? 3 : 0), o.x, o.y, 2);
      ctx.fillStyle = o.an ? '#6aff8f' : '#f4d97a'; ctx.font = 'bold 15px serif';
      ctx.fillText(o.sym, o.x, o.y + 6);
      break;
    case 'block':
      drawShadowEllipse(o.x, o.y + 12, 13);
      drawSprite('dun_crate', 0, o.x, o.y + 4, WELT_SC);
      break;
    case 'ziel': break;                                   // liegt flach im Bodenlayer
    case 'fackel':
      if(o.an) drawSprite('fire1', animFrame('fire1', gameT + o.x*0.01, 10), o.x, o.y - 14, 1.2);
      ctx.fillStyle = '#3a2f22'; ctx.fillRect(o.x - 3, o.y - 14, 6, 18);
      ctx.strokeStyle = o.an ? '#ffb04a' : '#5c5470'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(o.x, o.y - 18, 6, 0, Math.PI*2); ctx.stroke();
      break;
    case 'spiegel':
      drawShadowEllipse(o.x, o.y + 8, 11);
      ctx.strokeStyle = '#dff2ff'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath();
      if(o.st === 1){ ctx.moveTo(o.x - 11, o.y - 11); ctx.lineTo(o.x + 11, o.y + 11); }
      else          { ctx.moveTo(o.x - 11, o.y + 11); ctx.lineTo(o.x + 11, o.y - 11); }
      ctx.stroke(); ctx.lineCap = 'butt';
      break;
    case 'quelle':
      ctx.fillStyle = '#ffe14d'; ctx.shadowColor = '#ffe14d'; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(o.x, o.y, 8, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0;
      break;
    case 'lziel':
      ctx.strokeStyle = '#ffe14d'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(o.x, o.y, 11, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(o.x, o.y, 5, 0, Math.PI*2); ctx.stroke();
      break;
    case 'hebel':
      drawShadowEllipse(o.x, o.y + 8, 9);
      ctx.strokeStyle = '#8a7bb8'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(o.x, o.y + 8); ctx.lineTo(o.x + (o.an ? 10 : -10), o.y - 14); ctx.stroke();
      ctx.fillStyle = o.an ? '#6aff8f' : '#ff9f4a';
      ctx.beginPath(); ctx.arc(o.x + (o.an ? 10 : -10), o.y - 16, 5, 0, Math.PI*2); ctx.fill();
      if(o.mod && o.mod.t > 0){
        ctx.fillStyle = '#241d33'; ctx.fillRect(o.x - 18, o.y - 34, 36, 5);
        ctx.fillStyle = '#ffe14d'; ctx.fillRect(o.x - 18, o.y - 34, 36 * (o.mod.t / o.mod.fenster), 5);
      }
      break;
    case 'schloss':
      ctx.fillStyle = '#241d33'; ctx.fillRect(o.x - 15, o.y - 18, 30, 30);
      ctx.strokeStyle = '#c9a227'; ctx.lineWidth = 2; ctx.strokeRect(o.x - 15, o.y - 18, 30, 30);
      ctx.fillStyle = '#f4d97a'; ctx.font = '15px serif';
      zeichneIco('schluessel', '🔐', o.x, o.y - 3, 16);
      break;
    case 'reset':
      ctx.strokeStyle = '#7ad6ff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(o.x, o.y, 12 + Math.sin(gameT*3)*1.5, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = '#7ad6ff'; ctx.font = '13px serif'; ctx.fillText('↺', o.x, o.y + 5);
      break;
    case 'rune':
      ctx.strokeStyle = '#6aff8f'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(o.x, o.y, 14 + Math.sin(gameT*2.4)*2, 0, Math.PI*2); ctx.stroke();
      drawSprite(kammer.dkStairs, 0, o.x, o.y, 2);
      break;
    case 'treppe':                                        // Einstieg: reine Bodendecke, kein Kontaktpunkt
      drawSprite(o.leiter ? 'dun3_ladder' : kammer.dkStairs, 0, o.x, o.y, 2);
      break;
    // M4: der Abstieg. Dieselbe Kachel wie der Einstieg unten, nur mit einem
    // Ring darum, solange er begehbar ist — ohne den ist ein Loch im Boden auf
    // einem Hoehlenboden aus zwei Kacheln Entfernung nicht als Ziel zu erkennen.
    // Ist die Truhe noch zu, bleibt der Ring aus: das Loch ist da, es nimmt nur
    // niemanden auf.
    case 'abstieg':
      drawSprite('dun3_ladder', 0, o.x, o.y, 2);
      if(kannAbsteigen()){
        ctx.strokeStyle = '#c77dff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(o.x, o.y, 15 + Math.sin(gameT*2.4)*2, 0, Math.PI*2); ctx.stroke();
      }
      break;
    case 'tafel':
      ctx.fillStyle = '#2b2338'; ctx.fillRect(o.x - 26, o.y - 20, 52, 34);
      ctx.strokeStyle = '#8a7bb8'; ctx.lineWidth = 2; ctx.strokeRect(o.x - 26, o.y - 20, 52, 34);
      ctx.fillStyle = '#c9b98a'; ctx.font = 'bold 13px serif';
      zeichneIco('brief', '📜', o.x, o.y - 1, 16);
      if(nah){
        ctx.font = 'bold 10px Courier New';
        ctx.fillStyle = '#000';    ctx.fillText(o.titel, o.x+1, o.y - 27);
        ctx.fillStyle = '#9a8a5f'; ctx.fillText(o.titel, o.x, o.y - 28);
        ctx.font = 'bold 17px serif';
        ctx.fillStyle = '#000';    ctx.fillText(o.txt, o.x+1, o.y - 41);
        ctx.fillStyle = '#f4d97a'; ctx.fillText(o.txt, o.x, o.y - 42);
      }
      break;
    case 'truhe':
      drawShadowEllipse(o.x, o.y + 10, 16);
      drawSprite('dun_chest', o.auf ? 7 : 0, o.x, o.y, WELT_SC);
      if(!o.auf) drawSprite('glint', animFrame('glint', gameT, 9), o.x, o.y - 26, 2);
      break;
  }
  ctx.restore();
}

// Das Preisschild: Schwierigkeit und Beute-Tier stehen vor dem Betreten fest.
function drawKammerTuer(t){
  drawShadowEllipse(t.x, t.y, 16);
  ctx.save();
  // Set-Wahl wie beim Betreten (diff 1-2 -> Set 0), damit Tür und Innenraum
  // zusammenpassen; die Keys stehen seit R6/F31 an der Tür (s. wuerfleTuer).
  // Geleerte Türen sind über eine gebackene Tint-Kopie abgedunkelt — kein
  // ctx.filter im Frame-Pfad.
  const g = t.gateT || 0;
  if(g > 0.02) drawSprite(t.dkGateAnim, Math.min(25, Math.floor(g*25)), t.x, t.y, 2,
                          false, t.cd > 0 ? '#120e1c' : null, 0.55);
  else         drawSprite(t.dkGate, 0, t.x, t.y, 2, false, t.cd > 0 ? '#120e1c' : null, 0.55);
  // Schild: der Gebührenbescheid, auf den Knöterich verweist (W1/F24). Das Wort
  // ist bei 9px Courier New (0,6em Vorschub) 86px breit und passt nicht in die
  // 66px Innenbreite, deshalb zweizeilig getrennt; der Kasten wächst dafür von
  // 34 auf 45px nach oben. Cull-Rand ist cam.y-120 auf den Ankerpunkt, bei
  // Oberkante t.y-89 bleiben 31px Reserve, das Schild wird nicht abgeschnitten.
  ctx.textAlign = 'center';
  ctx.fillStyle = '#3b2f1c'; ctx.fillRect(t.x - 34, t.y - 89, 68, 45);
  ctx.strokeStyle = '#8a6d3b'; ctx.lineWidth = 2; ctx.strokeRect(t.x - 34, t.y - 89, 68, 45);
  ctx.font = 'bold 9px Courier New';
  // W5: Sonderschild für Adresskammern (Akt IV). Nur die zwei Textzeilen
  // verzweigen, Kasten und Cull-Reserve bleiben pixelgleich. Nach dem Fund
  // beantwortet !vorgangHat(t.adr) die "wiederbetreten"-Frage von selbst:
  // Schild zeigt wieder GEBÜHREN-/BESCHEID, kein zweiter Fund möglich.
  const adrK = t.adr && !vorgangHat(t.adr);
  ctx.fillStyle = adrK ? '#f4d97a' : '#c9b98a';
  if(adrK){ ctx.fillText('AKTEN-', t.x, t.y - 79); ctx.fillText('ZEICHEN', t.x, t.y - 70); }
  else    { ctx.fillText('GEBÜHREN-', t.x, t.y - 79); ctx.fillText('BESCHEID', t.x, t.y - 70); }
  if(t.cd > 0){
    ctx.fillStyle = '#9a8a5f'; ctx.font = 'bold 10px Courier New';
    ctx.fillText('geleert', t.x, t.y - 57);
    ctx.fillText(Math.ceil(t.cd) + 's', t.x, t.y - 47);
  } else {
    // W7 Nr. 7: Das Schild ist der Gebührenbescheid, also Milbs Gutachten. Bis
    // man ihm den Fehler nachweist, stuft er systematisch eine Stufe zu niedrig
    // ein. Nur die Anzeige verzweigt, t.diff/t.tier bleiben unberührt.
    const zeig = langKammerWert(t), zeigTier = Math.max(0, Math.min(4, zeig - 1));
    let bar = '';
    for(let i = 1; i <= 5; i++) bar += i <= zeig ? '▮' : '▯';
    ctx.fillStyle = '#f4d97a'; ctx.font = 'bold 11px Courier New';
    ctx.fillText(bar, t.x, t.y - 57);
    ctx.fillStyle = RARITY[zeigTier].col; ctx.font = 'bold 9px Courier New';
    ctx.fillText(RARITY[zeigTier].name, t.x, t.y - 47);
  }
  ctx.restore();
}

setzeKammerTueren();
setzeStopfen();   // SZ3: einmal je Welt, nicht je Schicht — eine Roehre wandert nicht

// --- QoL INVENTORY SYSTEM ---
function buildTooltip(item, isEquipped){
  if(!item) return "";
  let html = `<div class="tname rar${item.rar}">${item.name}</div>`;
  if(item.effect){
    // Kessel-Ausrüstung trägt Verben, keine Zahlen. Gerechnet wird intern.
    const wk = WIRKUNG[item.effect.k];
    html += `<div style="color:#9a8a5f;font-size:calc(10px * var(--fs));margin:-2px 0 5px;">${SLOT_DE[item.base.t]} · ${RARITY[item.rar].name}${item.effect.stufe >= 3 ? ' · Unikat' : ''}</div>`;
    html += `<div class="aff">${wk.satz[Math.min(2, item.effect.stufe - 1)]}</div>`;
    if(item.fluch){
      const fd = FLUCH[item.fluch];
      if(fd){
        html += `<div class="fluch">${fd.satz}</div>`;
        if(item.fluchRuht) html += `<div class="hint">Dieser Fluch ruht. Zwei sind genug.</div>`;
      }
    }
  } else {
    // Altbestand: keine Zahlen mehr im Tooltip, dafür ein fester Satz je Slot/Affix.
    html += `<div style="color:#9a8a5f;font-size:calc(10px * var(--fs));margin:-2px 0 5px;">${SLOT_DE[item.base.t]} · ${RARITY[item.rar].name} · Altbestand</div>`;
    html += `<div class="aff">Solide Dienstausrüstung ohne Vermerk.</div>`;
    item.affixes.forEach(a => html += `<div class="aff">${a.def.satz}</div>`);
  }
  // S1: Der Kraftbedarf steht am Stueck, nicht im Menue. Wer ihn nicht hat,
  // sieht rot, was ihm fehlt — und was er dagegen tun kann.
  const kb = kraftBedarf(item);
  if(kb > 0){
    const reicht = kb <= player.skills.str;
    html += reicht
      ? `<div class="aff" style="color:#9a8a5f;">Kraftbedarf ${kb} · erfüllt</div>`
      : `<div class="fluch">Kraftbedarf ${kb} · Sie haben ${player.skills.str}. Zu schwer zum Führen.</div>`;
  }
  html += `<div class="hint">Links-Klick: ${isEquipped?'Ablegen':'Ausrüsten'}<br>Rechts-Klick: Wegwerfen</div>`;
  return html;
}

// Zutaten-Tooltip: Name, Slot-Hinweis gibt es absichtlich keinen. Die Kladde ist
// der einzige Ort, an dem Zusammenhänge auftauchen, und nur beobachtete.
function buildZutatTooltip(z){
  const zr = zutatRar(z);
  return `<div class="tname rar${zr}">${zutatName(z)}</div>`
       + `<div style="color:#9a8a5f;font-size:calc(10px * var(--fs));margin:-2px 0 5px;">Zutat · ${RARITY[zr].name} · ${z.count} im Beutel</div>`
       + `<div class="hint">Gehört in den Kessel (K).</div>`;
}

// htmlFn erlaubt anderen Inhalt (Zutaten) ohne die Touch-Logik zu duplizieren.
function bindTooltip(el, item, isEquipped, dropAction, clickAction, htmlFn){
  const ttHTML = () => htmlFn ? htmlFn() : buildTooltip(item, isEquipped);
  el.onmouseenter = (e) => {
    if(!item) return;
    const tt = document.getElementById('tooltip');
    tt.style.display = 'block'; tt.innerHTML = ttHTML();
  };
  el.onmousemove = (e) => {
    const tt = document.getElementById('tooltip');
    tt.style.left = (e.clientX + 15) + 'px'; tt.style.top = (e.clientY + 15) + 'px';
  };
  el.onmouseleave = () => document.getElementById('tooltip').style.display = 'none';
  el.oncontextmenu = (e) => { e.preventDefault(); if(item) dropAction(); };
  el.onclick = () => { if(item) clickAction(); };
  // Touch: transienter Tooltip beim Antippen, Aktion bleibt auf demselben Tap
  el.addEventListener('touchstart', (e) => {
    if(!item || !touchMode) return;
    const tt = document.getElementById('tooltip');
    tt.style.display = 'block'; tt.innerHTML = ttHTML();
    const t = e.touches[0];
    tt.style.left = Math.min(t.clientX + 12, window.innerWidth - 200) + 'px';
    tt.style.top  = Math.max(8, t.clientY - 120) + 'px';
    clearTimeout(el._ttT); el._ttT = setTimeout(() => tt.style.display = 'none', 2200);
  }, {passive:true});
}

// U8: 'flex' statt 'block' — .grossFenster ist eine Spalte aus Kopf, Blaettern
// und Rollfeld, und die drei muessen sich die Hoehe teilen. Und: zwei
// Grossfenster stehen an derselben Stelle, also raeumt eines das andere weg.
// Das ist kein Verlust — vor U8 standen Inventar und Zauberbaum an
// verschiedenen Kanten und konnten beide offen sein; seit U8 fuehrt das
// Reiterband von einem zum anderen, und zwar genau so: das eine zu, das
// andere auf.
function toggleInventory(){
  // T3: Wer den Anfang ueber den Vordruck genommen hat, hat die Ernennung nie
  // gesehen und damit auch nicht das erste Treffen. Dasselbe gilt fuer jeden
  // Spielstand, der aelter ist als dieser Bauabschnitt. Beide holen es hier
  // nach, beim ersten Blick in die Tasche, und das ist keine Notloesung: eine
  // Anlage, die man beim Aufraeumen findet, ist genau die Art, wie man eine
  // Anlage findet. Die Bedingung ist der Dienstantritt und nicht der Empfang,
  // denn nur wer im Dienst ist, hat eine Urkunde, an der sie haengen kann.
  if(!invOpen && kn.seen.einstellung && !kn.flags.anlage2Da && state === 'play' && !szeneAktiv){
    anlage2Nachholen();
    return;
  }
  invOpen = !invOpen;
  document.getElementById('inv').style.display = invOpen ? 'flex' : 'none';
  if(invOpen){ grossfensterRaeumen('inv'); renderInventory(); knIdleT = 0; }
  MUS.muffle(); panelSicht();
}

// Derselbe Stapel wie nach der Ernennung, anderer Auftakt, und danach steht der
// Rucksack offen, in dem sie jetzt liegt. buehneAn() bleibt hier aus: das Dorf
// laeuft bereits, und ein Rechtsakt ist das hier nicht mehr, sondern ein Fund.
//
// Das Overlay wird hier von Hand geschlossen, und das ist der Unterschied zum
// Weg ueber die Ernennung: dort raeumt dienstAntritt() hinterher, hier raeumt
// niemand, weil der Dienst laengst laeuft. Ohne die Zeile bliebe das schwarze
// Feld ueber dem Dorf stehen, und der Rucksack ginge dahinter auf. Gefunden
// hat das nicht der Guard, sondern tools/empfang-pruef.mjs beim zweiten Griff
// zur Tasche: genau dafuer klickt sich der Lauf durch das echte Spiel.
function anlage2Nachholen(){
  szeneTafeln([ANLAGE2_AUFTAKT_NACHHOLUNG, ANLAGE2_FRAGE[0]].concat(ANLAGE2_BLAETTER),
              {letzterKnopf:'EINSTECKEN', wahl:{bei:1, reihe:ANLAGE2_FRAGE},
               ende: anlage2Angenommen(() => {
                el('overlay').style.display = 'none';
                MUS.muffle(false);
                toggleInventory();
              })});
}

function addSkill(type){
  if(player.skillPoints > 0){
    player.skillPoints--; player.skills[type]++;
    if(!kn.flags.hatGesteigert){ kn.flags.hatGesteigert = true; saveKn(); }   // S1: Wissenslücke geschlossen
    recalc(); updateHUD(); renderCharakter();
  }
}

function dropItemToFloor(item){
  drops.push({kind:'item', item:item, x:player.x + rr(-20,20), y:player.y + rr(-20,20)});
  document.getElementById('tooltip').style.display = 'none';
}

// S1: Kraftbedarf einer Waffe. 0 heisst: jeder kann sie fuehren.
const kraftBedarf = item => (item && item.base && item.base.kraft) || 0;
const kraftReicht = item => kraftBedarf(item) <= player.skills.str;

function equipItemFromBag(idx){
  const item = player.bag[idx]; if(!item) return;
  const slotType = item.base.t;
  // S1: Wer die Kraft nicht hat, legt die Klinge nicht an. Kein Malus, kein
  // Kompromiss — sie bleibt in der Tasche und wartet. Das ist die einzige
  // Stelle im Spiel, an der eine Befaehigung etwas AUFSCHLIESST statt es nur
  // zu verbessern, und sie ist mit Absicht die haerteste: ein Siegelbrecher,
  // den man nicht heben kann, erklaert die Kraftleiste besser als jeder Text.
  if(!kraftReicht(item)){
    floaters.push({x:player.x, y:player.y-30, txt:'Zu schwer · braucht Kraft ' + kraftBedarf(item), col:'#ff8f8f', t:1.8});
    sfx.hurt();
    return;
  }
  const currentEquipped = player.equip[slotType];
  if(currentEquipped) currentEquipped.fluchRuht = false;   // Budget-Flag gilt nur im Equip-Slot, nicht in der Tasche
  player.equip[slotType] = item; player.bag[idx] = currentEquipped;
  document.getElementById('tooltip').style.display = 'none';
  // U8: Das Stueck wechselt zwischen zwei Fenstern — Tasche im Rucksack,
  // Platz im Charakterfenster. Beide Renderer steigen selbst aus, wenn ihr
  // Fenster zu ist, also kostet der zweite Ruf nichts.
  recalc(); knCheckFluchEquipped(); updateHUD(); renderInventory(); renderCharakter();
}

function unequipItem(slotType){
  const item = player.equip[slotType]; if(!item) return;
  const emptyIdx = player.bag.findIndex(slot => slot === null);
  if(emptyIdx !== -1){
    item.fluchRuht = false;   // Budget-Flag gilt nur im Equip-Slot, nicht in der Tasche
    player.bag[emptyIdx] = item; player.equip[slotType] = null;
    document.getElementById('tooltip').style.display = 'none';
    recalc(); knCheckFluchEquipped(); updateHUD(); renderInventory(); renderCharakter();
  } else {
    floaters.push({x:player.x, y:player.y-30, txt:'Tasche voll!', col:'#ff0000', t:1.0});
  }
}

// S1: Was ein Punkt bringt, steht neben dem Punkt — aus den Konstanten
// gerechnet, nicht abgeschrieben, damit die Anzeige nicht von der Formel
// wegdriften kann. Das war der erste Teil des Befunds: dass es die vier
// Befaehigungen gibt, war zu sehen, was sie tun, nicht.
const BEFAEHIGUNG_WERT = {
  Str: () => `+${KRAFT_DMG[0]}–${KRAFT_DMG[1]} Schaden`,
  Vit: () => `+${ZAEH_HP} Leben`,
  Agi: () => `+${BEHAEND_TEMPO} Tempo`,
  Int: () => `+${KUNDE_MANA} Mana`,
};
// Ein Satz, der sagt, warum der Punkt jetzt liegen bleibt oder nicht mehr
// liegen bleiben sollte. Amtsdeutsch, kein Tutorial.
function befaehigungHinweis(){
  if(player.skillPoints <= 0) return '';
  const w = player.equip.weapon, kb = kraftBedarf(w);
  if(w && kb > player.skills.str)
    return `Ihre Waffe verlangt Kraft ${kb}. Sie führen sie unter Bedarf.`;
  const zuSchwer = player.bag.filter(it => it && it.base.t === 'weapon' && kraftBedarf(it) > player.skills.str);
  if(zuSchwer.length)
    return `In der Tasche liegt Gerät, für das die Kraft nicht reicht: ${zuSchwer[0].name} (Kraft ${kraftBedarf(zuSchwer[0])}).`;
  return player.skillPoints >= PUNKTE_JE_STUFE * 2
    ? `${player.skillPoints} Punkte unvergeben. Das Amt zahlt darauf keine Zinsen.`
    : 'Ein Punkt wartet auf eine Entscheidung.';
}

// ===========================================================================
//  U8: Die vier Grossfenster und das Band, das sie verbindet
//
//  Bis U7 war jedes Menuefenster eine Insel: eigener Knopf im Guertel, eigene
//  Taste, eigene Ecke des Bildschirms, und der Weg von einem zum anderen ging
//  ueber "zumachen, aufmachen". Vier Fenster mit demselben Kasten und einem
//  Band im Kopf sind derselbe Bestand, nur begehbar.
//
//  Die Tabelle ist die einzige Stelle, an der die vier Fenster als Reihe
//  stehen. Das Band schreibt gfBandZeichnen() daraus, das Wegraeumen macht
//  grossfensterRaeumen() daraus, und wer ein fuenftes Fenster baut, traegt es
//  hier ein und nirgends sonst. (Dasselbe Verfahren wie PANEL_REGISTER in U1,
//  und aus demselben Grund: dieselbe Liste dreimal von Hand ist zweimal
//  falsch.)
//
//  'stern' liefert die Farbe eines Sternchens oder null. Es ist dasselbe
//  Zeichen wie am Guertelknopf und sagt dasselbe: hier wartet etwas.
const GROSSFENSTER = [
  {id:'charakter', sinn:'🧍', ico:'charakter', wort:'Charakter', taste:'C',
   offen:() => charakterOpen, auf:() => toggleCharakter(),
   stern:() => player.skillPoints > 0 ? '#f4d97a'
             : (player.zulagenAngebot || player.zulagenZiehungen > 0) ? '#5ac8ff' : null},
  {id:'inv',       sinn:'🎒', ico:'rucksack',  wort:'Rucksack',  taste:'I',
   offen:() => invOpen,       auf:() => toggleInventory(), stern:() => null},
  {id:'kessel',    sinn:'🍲', ico:'kessel',    wort:'Kochen',    taste:'K',
   offen:() => kesselOpen,    auf:() => toggleKessel(),    stern:() => null},
  {id:'spellTree', sinn:'✨', ico:'zauber',    wort:'Zauber',    taste:'T',
   offen:() => spellTreeOpen, auf:() => toggleSpellTree(),
   stern:() => (player.spellPoints > 0 && player.level >= ZAUBER_AB_STUFE) ? '#c77dff' : null},
  // U8-Nachtrag 3: Die Einstellungen. Sie haben als einziges Fenster keinen
  // Guertelknopf, und das ist Absicht: der Guertel ist die Spalte, aus der man
  // im Gefecht etwas holt, und eine Lautstaerke holt dort niemand. Der Weg
  // fuehrt ueber das Band — also ueber jedes andere Fenster — und ueber die
  // Taste O.
  {id:'optionen',  sinn:'⚙️', ico:'zahnrad',   wort:'Optionen',  taste:'O',
   offen:() => optionenOpen,  auf:() => toggleOptionen(),  stern:() => null},
];

// Schliesst jedes Grossfenster ausser dem genannten. Zwei von ihnen stehen an
// derselben Stelle im Bild; uebereinander waeren sie kein Stapel, sondern ein
// Fenster, das aussieht wie ein anderes.
function grossfensterRaeumen(ausser){
  for(const f of GROSSFENSTER) if(f.id !== ausser && f.offen()) f.auf();
}

// Das Band in den Kopf jedes offenen Grossfensters schreiben. Gerufen wird es
// von den Oeffnern, nicht je Bild: ein Band, das sich nicht aendert, muss
// nicht sechzigmal in der Sekunde neu geschrieben werden.
function gfBandZeichnen(){
  for(const band of document.querySelectorAll('.gfBand')){
    const hier = band.dataset.band;
    band.innerHTML = GROSSFENSTER.map(f => {
      const st = f.stern();
      return `<div class="gfReiter${f.id === hier ? ' on' : ''}" data-ziel="${f.id}"`
           + ` title="${f.wort} (${f.taste})">`
           + `<span class="gfSinn"><i class="ico ico-${f.ico}">${f.sinn}</i></span>`
           + `<span class="gfWort">${f.wort}</span>`
           + (st ? `<span class="gfStern" style="color:${st}">★</span>` : '')
           + `</div>`;
    }).join('');
  }
}

// Ein Griff auf einen Reiter. Der Weg fuehrt ueber die Oeffner der Fenster und
// nicht an ihnen vorbei: jeder von ihnen raeumt, rendert, daempft die Musik und
// setzt den Schleier, und all das gilt hier genauso.
document.addEventListener('click', e => {
  const r = e.target.closest && e.target.closest('.gfReiter');
  if(!r) return;
  const f = GROSSFENSTER.find(g => g.id === r.dataset.ziel);
  if(f && !f.offen()) f.auf();
});

// ===========================================================================
//  U8: Das Charakterfenster
//
//  Alles, was am Traeger haengt: die Befaehigung, die abgeleiteten Werte, die
//  vier Ausruestungsplaetze, der Dienstausweis — und auf dem zweiten Blatt die
//  Kartenmappe, die bis U8 ein eigenes Fenster war. Sie hat keine Zeile
//  Renderlogik verloren; renderZulagen() schreibt weiter in #zulZiehung,
//  #zulMappe und #zulKartei, die jetzt hier liegen.
let charakterOpen = false;
let charBlatt = 'werte';                 // 'werte' | 'mappe'

// Ein Blatt umschlagen. Kein Fenster geht dabei auf oder zu.
function charBlattWaehlen(b){
  charBlatt = b;
  for(const t of document.querySelectorAll('#charakter .gfBlatt'))
    t.classList.toggle('on', t.dataset.blatt === b);
  el('charWerte').style.display = b === 'werte' ? 'block' : 'none';
  el('charMappe').style.display = b === 'mappe' ? 'block' : 'none';
  if(charakterOpen) renderCharakter();
}

// Der Oeffner. Mit Argument schlaegt er zugleich das Blatt auf — so kommt die
// Taste Z weiterhin direkt auf die Mappe, ohne dass es dafuer ein zweites
// Fenster braucht.
function toggleCharakter(blatt){
  const wechsel = charakterOpen && blatt && blatt !== charBlatt;
  if(wechsel){ charBlattWaehlen(blatt); return; }
  charakterOpen = !charakterOpen;
  el('charakter').style.display = charakterOpen ? 'flex' : 'none';
  if(charakterOpen){
    grossfensterRaeumen('charakter');
    charBlattWaehlen(blatt || charBlatt);   // zeichnet gleich mit
    knIdleT = 0;
  }
  MUS.muffle();   // offenes Panel daempft die Musik
  panelSicht();   // U1
}

// Die Mappe ist ein Blatt und kein Fenster mehr. Wer sie fuer offen haelt,
// meint diese beiden Bedingungen — und renderZulagen() fragt genau danach,
// statt einen zweiten Zustand zu fuehren, der mit dem ersten auseinanderlaufen
// kann.
function zulagenOffen(){ return charakterOpen && charBlatt === 'mappe'; }

// U8-Nachtrag 3: Die Einstellungen. Bauform wortgleich mit den uebrigen
// Grossfenstern; zu rendern gibt es nichts, weil die drei Kaesten ihren Stand
// selbst tragen (die Klassen setzen refreshKnTone(), refreshSchrift() und die
// Spielstand-Knoepfe beim Umschalten).
let optionenOpen = false;
function toggleOptionen(){
  optionenOpen = !optionenOpen;
  el('optionen').style.display = optionenOpen ? 'flex' : 'none';
  if(optionenOpen){ grossfensterRaeumen('optionen'); gfBandZeichnen(); knIdleT = 0; }
  MUS.muffle();   // offenes Panel daempft die Musik
  panelSicht();   // U1
}

function renderCharakter(){
  if(!charakterOpen) return;
  gfBandZeichnen();
  if(charBlatt === 'mappe'){ renderZulagen(); return; }

  // --- Wer man im Dienst ist. Dasselbe Lichtbild wie auf dem Ausweis, aus
  //     demselben Bake — es traegt Haarton und Garderobe der Schicht von
  //     selbst (P1). ---
  renderAusweisFoto('charFoto');
  el('charAmtText').innerHTML =
      `<div><b>${rangName()}</b></div>`
    + `<div>${rangGruppeName()}</div>`
    + `<div class="kl">${rangVerhaeltnis()}</div>`
    + `<div class="kl">Stufe ${player.level} · Schicht ${amt.schichten + 1}</div>`;

  el('spCount').innerText = player.skillPoints;
  ['Str','Vit','Agi','Int'].forEach(s => {
    el('sk'+s).innerText = player.skills[s.toLowerCase()];
    el('btn'+s).disabled = player.skillPoints <= 0;
    el('skWert'+s).innerText = BEFAEHIGUNG_WERT[s]();
  });
  el('skHint').innerText = befaehigungHinweis();
  el('skillBox').classList.toggle('offen', player.skillPoints > 0);
  // S1: 'zu schwer gefuehrt' ist eine Aussage ueber die Waffe, keine Zahl —
  // deshalb steht sie an der Zahl, die sie kaputtmacht.
  el('stDmg').innerText = `${derived.dmgMin}-${derived.dmgMax}`
    + (derived.zuSchwer ? ' (zu schwer)' : '');
  el('stArm').innerText = derived.armor;
  el('stHp').innerText = derived.maxHp;
  el('stMana').innerText = derived.maxMana;

  const eqTypes = {weapon:'eqWeapon', armor:'eqArmor', shield:'eqShield', boots:'eqBoots'};
  for(const key in eqTypes){
    const e = el(eqTypes[key]);
    const item = player.equip[key];
    e.innerHTML = item ? `<span class="lbl">${SLOT_DE[key]}</span><span style="font-size:calc(30px * var(--fs));line-height:1;">${item.base.icon || '❔'}</span>` : `<span class="lbl">${SLOT_DE[key]}</span>`;
    e.className = 'eqSlot ' + (item ? `rar${item.rar}` : '');
    // R10/F52: Budget-Flag gilt nur im Equip-Slot. Ohne Reset behauptet der Tooltip
    // am aufgehobenen Stück weiter "Dieser Fluch ruht".
    bindTooltip(e, item, true, () => { item.fluchRuht = false; player.equip[key] = null; dropItemToFloor(item); recalc(); knCheckFluchEquipped(); renderCharakter(); }, () => unequipItem(key));
  }
}

// U8: Der Rucksack traegt nur noch, was in ihm liegt — die Tasche, den Beutel
// und die Kaesten fuer Ton, Schrift und Spielstand, die schon vorher hier
// standen. Befaehigung, Werte und Ausruestung sind ins Charakterfenster
// gezogen, wo sie hingehoeren.
function renderInventory(){
  if(!invOpen) return;
  gfBandZeichnen();
  const belegt = player.bag.filter(Boolean).length;
  el('tascheZahl').innerText = `${belegt} von 24 Fächern belegt`;

  const bagGrid = el('bagGrid'); bagGrid.innerHTML = '';
  // T3: Anlage 2 steht vor den vierundzwanzig Faechern und gehoert zu keinem.
  // Das ist keine Bequemlichkeit, sondern die Weltlogik: sie liegt nicht in der
  // Tasche, sie haengt an der Urkunde, die darin liegt. Deshalb bleibt der
  // Zaehler "X von 24 Faechern belegt" wahr, deshalb steht sie in keinem
  // player.bag-Eintrag, und deshalb ueberlebt sie jeden Spielstand ohne
  // Migration: kn.flags.anlage2Da ist die einzige Wahrheit darueber, ob sie da
  // ist. Ein echtes Item waere durch itemGeklemmt() gelaufen, haette ein Fach
  // gekostet und waere beim Tod auf den Boden gefallen.
  if(kn.flags.anlage2Da) bagGrid.appendChild(anlage2Kachel());
  for(let i=0; i<24; i++){
    const slot = document.createElement('div'); slot.className = 'bagSlot';
    const item = player.bag[i];
    if(item){
      slot.classList.add(`rar${item.rar}`); slot.innerHTML = `<span style="font-size:calc(24px * var(--fs));line-height:1;">${item.base.icon || '❔'}</span>`;
      bindTooltip(slot, item, false, () => { player.bag[i] = null; dropItemToFloor(item); renderInventory(); }, () => equipItemFromBag(i));
    }
    bagGrid.appendChild(slot);
  }

  // Zutaten liegen im eigenen Beutel, nicht in den 24 Taschenplätzen: sonst wäre
  // die Tasche nach zwei Biomen voll und Ausrüstung hätte keinen Platz mehr.
  el('zutBox').style.display = player.pouch.length ? 'block' : 'none';
  if(player.pouch.length){
    el('zutTotal').innerText = `${pouchTotal()} Stück`;
    fillZutatGrid(el('invZutGrid'), z => { addToPot(z); });
  }
}

// ---------------------------------------------------------------------------
//  T3: die Kachel der Anlage 2
//
//  Sie sieht aus wie ein Taschenfach und ist keines. Drei Gesten, drei
//  Antworten, und keine davon nimmt sie weg:
//
//    Linksklick      Ansprechen. Der Rucksack geht zu, ihr Gespraechsbaum auf.
//    Rechtsklick     Wegwerfen, also der Bewegungsversuch. Ein Spruch.
//    Ziehen          Dasselbe. Der Browser wuerde sonst ein Geisterbild
//                    mitschleifen, und ein Schriftstueck, das man wegzieht,
//                    obwohl es haengt, waere die falsche Auskunft.
//
//  Warum der Spruch NICHT im Randband erscheint: das Band liegt hinter dem
//  Grossfenster. Wer im offenen Rucksack zieht, sieht es nicht. Er steht
//  deshalb in der Kachel selbst, dort, wo gezogen wurde.
// ---------------------------------------------------------------------------

// Das Objekt, das bindTooltip() als "es liegt etwas in diesem Fach" liest. Es
// ist absichtlich kein Eintrag aus BASES: Anlage 2 hat keine Seltenheit, keinen
// Schaden und keinen Kraftbedarf, und ein erfundener Basiseintrag haette ihr
// eine Statistik gegeben, die sie nicht hat.
const ANLAGE2_ITEM = {name:'Anlage 2', anlage2:true};
function anlage2Tooltip(){
  return `<div style="font-weight:bold;color:#ceb699;">Anlage 2</div>`
       + `<div style="color:#c9b98a;font-size:calc(11px * var(--fs));margin-top:2px;">Beilage, mit Heftklammer</div>`
       + `<div style="margin-top:6px;">Der Ernennungsurkunde beigefügt. Bleibt, wo sie ist.</div>`
       + `<div style="margin-top:6px;color:#9a8a5f;font-size:calc(11px * var(--fs));">Ansprechen: anklicken.</div>`;
}

function anlage2Kachel(){
  const slot = document.createElement('div');
  slot.className = 'bagSlot anlage2Slot';
  slot.innerHTML = `<span style="font-size:calc(24px * var(--fs));line-height:1;">📄</span>`
                 + `<span class="a2Spruch"></span>`;
  const spruchZeigen = () => {
    const feld = slot.querySelector('.a2Spruch');
    feld.innerText = anlage2Bewegung();
    slot.classList.add('zeigt');
    clearTimeout(slot._a2T);
    slot._a2T = setTimeout(() => slot.classList.remove('zeigt'), 3200);
    // Ein trockenes Klacken, wie Papier an einer Klammer. sfx.shoot ist der
    // kuerzeste Ton im Bestand und klingt an dieser Stelle nach nichts weiter
    // als einem kurzen Widerstand, was genau die Aussage ist.
    sfx.shoot();
  };
  bindTooltip(slot, ANLAGE2_ITEM, false, spruchZeigen, () => {
    toggleInventory();     // zwei Vollbildfenster gehen nicht uebereinander
    szeneOeffnen('baumAnlage2', SZENEN.baumAnlage2.start);
  }, () => anlage2Tooltip());
  slot.addEventListener('dragstart', e => { e.preventDefault(); spruchZeigen(); });
  return slot;
}

// Gemeinsames Zutaten-Raster für Inventar und Kessel. onPick bekommt den Stapel.
function fillZutatGrid(grid, onPick){
  // Beim Neubau verliert der alte Knoten sein mouseleave: Tooltip von Hand schließen.
  // Auf Touch nicht, dort räumt der transiente Timeout aus bindTooltip auf.
  if(!touchMode) document.getElementById('tooltip').style.display = 'none';
  grid.innerHTML = '';
  if(!player.pouch.length){
    grid.innerHTML = '<div class="zutEmpty">Beutel leer. Monster hinterlassen Zutaten.</div>';
    return;
  }
  const sorted = player.pouch.slice().sort((a,b)=> zutatRar(b) - zutatRar(a) || a.noun.localeCompare(b.noun));
  for(const z of sorted){
    const tile = document.createElement('div');
    tile.className = 'zutTile rar' + zutatRar(z);
    tile.innerHTML = `<span class="zc">${z.count}</span><span class="zi">${zutatIcon(z)}</span><span class="zn">${zutatName(z)}</span>`;
    bindTooltip(tile, z, false, ()=>{}, () => onPick(z), () => buildZutatTooltip(z));
    tile.oncontextmenu = e => e.preventDefault();     // Zutaten wirft man nicht weg
    grid.appendChild(tile);
  }
}

// ===========================================================================
//  KESSEL (Taste K)
//  Drei Zutaten hinein, ein Ausrüstungsteil heraus. Keine Vorschau, kein
//  Rezeptbuch, keine Regelerklärung. Was der Kessel tut, steht danach in der
//  Kladde, und zwar nur das, was tatsächlich passiert ist.
// ===========================================================================
let kesselOpen = false, kesselTab = 'kessel';
let ausweisOpen = false;   // W6: Dienstausweis, gleiche Bauform wie kesselOpen
let fullmapOpen = false;   // W-Groß: Vollbildkarte, gleiche Bauform wie kesselOpen
const potSlots = [null, null, null];               // je {noun, adj}

function addToPot(z){
  if(!z) return;                                   // Stapel kann zwischen Klick und Neubau leergelaufen sein
  const free = potSlots.indexOf(null);
  if(free === -1){ floaters.push({x:player.x, y:player.y-30, txt:'Kessel ist voll', col:'#f4d97a', t:0.9}); return; }
  if(!takeZutat(z.noun, z.adj)) return;
  potSlots[free] = {noun:z.noun, adj:z.adj};
  if(kesselOpen) renderKesselPane();
  if(invOpen) renderInventory();
}
function removeFromPot(i){
  const s = potSlots[i]; if(!s) return;
  addZutat(s.noun, s.adj, 1); potSlots[i] = null;
  if(kesselOpen) renderKesselPane();
  if(invOpen) renderInventory();
}
function clearPot(){                                // nichts im kalten Kessel vergessen
  let back = false;
  for(let i=0;i<3;i++) if(potSlots[i]){ addZutat(potSlots[i].noun, potSlots[i].adj, 1); potSlots[i] = null; back = true; }
  if(back && invOpen) renderInventory();
}

function brew(){
  if(potSlots.indexOf(null) !== -1) return;
  const zs = [potSlots[0], potSlots[1], potSlots[2]];

  // Seltenste Zutat entscheidet jeden Gleichstand
  let rarest = zs[0];
  const nCount = {}, aCount = {};
  for(const z of zs){
    nCount[z.noun] = (nCount[z.noun] | 0) + 1;
    aCount[z.adj]  = (aCount[z.adj]  | 0) + 1;
    if(zutatRar(z) > zutatRar(rarest)) rarest = z;
  }
  // Slot = häufigstes Substantiv
  let topNoun = null, topN = 0, nTie = false;
  for(const k in nCount){
    if(nCount[k] > topN){ topN = nCount[k]; topNoun = k; nTie = false; }
    else if(nCount[k] === topN) nTie = true;
  }
  if(nTie) topNoun = rarest.noun;
  const slot = ZUTAT_NOUNS[topNoun].slot;
  // Wirkung = häufigstes Adjektiv, seine Anzahl ist die Stufe
  let topAdj = null, topA = 0, aTie = false;
  for(const k in aCount){
    if(aCount[k] > topA){ topA = aCount[k]; topAdj = k; aTie = false; }
    else if(aCount[k] === topA) aTie = true;
  }
  if(aTie) topAdj = rarest.adj;
  const stufe = aTie ? 1 : topA;                    // 1 = einfach, 2 = verstärkt, 3 = Unikat
  const ad = ADJ_BY_KEY[topAdj];
  const wirkKey = ad.wirk, wk = WIRKUNG[wirkKey];
  // Fluch: Stufe 1 nutzt fl, ab Stufe 2 (verstärkt/Unikat) den schlimmeren fl2, falls vorhanden
  const fluchKey = (stufe >= 2 && ad.fl2) ? ad.fl2 : ad.fl;
  const fluchDef = FLUCH[fluchKey];
  // Qualität = Summe der Seltenheiten
  const qual = zutatRar(zs[0]) + zutatRar(zs[1]) + zutatRar(zs[2]);
  let rar = qual <= 1 ? 0 : qual <= 3 ? 1 : qual <= 5 ? 2 : qual <= 8 ? 3 : 4;
  if(stufe >= 3) rar = Math.max(rar, 3);

  const base = Object.assign({t:slot, tier:rar}, CRAFT_BASE[slot][rar]);
  const item = {base, rar, affixes:[], effect:{k:wirkKey, stufe}, fluch:fluchKey, fluchRuht:false,
                name: stufe >= 3 ? wk.unikat : base.name, crafted:true};

  const idx = player.bag.indexOf(null);
  if(idx !== -1) player.bag[idx] = item;
  else { dropItemToFloor(item); floaters.push({x:player.x, y:player.y-44, txt:'Tasche voll, liegt am Boden', col:'#f4d97a', t:1.6}); }

  // Kladde notiert nur die Zutatenteile, die wirklich entschieden haben (Wirkung und Fluch)
  noteKladde('adj', topAdj, wirkKey);
  noteKladde('noun', topNoun, slot);
  noteKladde('fl', topAdj, fluchKey);
  if(stufe >= 3) kladde.unikate[wirkKey] = wk.unikat;
  kladde.crafts++; saveKladde();
  auftragEreignis('kessel', {rar});   // W4
  if(!kn.pending.craft1 && !kn.seen.craft1){ kn.pending.craft1 = true; }
  kn.flags.hatGekocht = true; saveKn();

  potSlots[0] = potSlots[1] = potSlots[2] = null;
  sfx.brew(); addShake(6, 0.25);
  spawnImpactParticles(player.x, player.y - 10, 24, null);
  floaters.push({x:player.x, y:player.y-40, txt:'Fertig: ' + item.name, col:RARITY[rar].col, t:2.0, big:true});

  const res = el('kesselResult');
  res.style.display = 'block';
  res.innerHTML = `<div class="rname rar${rar}">${item.base.icon} ${item.name}</div>`
    + `<div style="color:#9a8a5f;font-size:calc(10px * var(--fs));">${SLOT_DE[slot]} · ${RARITY[rar].name}${stufe>=3?' · Unikat':''}</div>`
    + `<div class="aff" style="color:#8fb0ff;">${wk.satz[Math.min(2, stufe-1)]}</div>`
    + (fluchDef ? `<div class="aff" style="color:#ff8f8f;">${fluchDef.satz}</div>` : '');
  renderKesselPane();
  if(invOpen) renderInventory();
  updateHUD();
}

function renderKesselPane(){
  const row = el('potRow'); row.innerHTML = '';
  for(let i=0;i<3;i++){
    const s = potSlots[i];
    const d = document.createElement('div');
    d.className = 'potSlot' + (s ? ' full rar' + zutatRar(s) : '');
    d.innerHTML = s ? `<span class="pi">${zutatIcon(s)}</span><span class="pn">${zutatName(s)}</span>`
                    : `<span class="pi">＋</span><span class="pn">leer</span>`;
    d.onclick = () => removeFromPot(i);
    row.appendChild(d);
  }
  const missing = (potSlots[0]?0:1) + (potSlots[1]?0:1) + (potSlots[2]?0:1);
  const b = el('brewBtn');
  b.disabled = missing > 0;
  b.innerText = missing === 0 ? 'KOCHEN' : missing === 1 ? 'NOCH EINE ZUTAT' : `NOCH ${missing} ZUTATEN`;
  setTxt('kesselZutTotal', player.pouch.length ? `${pouchTotal()} Stück` : '');
  fillZutatGrid(el('zutGrid'), addToPot);
}

function renderKladde(){
  const parts = [];
  const adjKeys = Object.keys(kladde.adj).sort();
  if(adjKeys.length){
    parts.push('<div class="klHead">ADJEKTIVE</div>');
    for(const a of adjKeys){
      const obs = kladde.adj[a];
      const list = Object.keys(obs).map(k => ({k, n:obs[k]})).sort((x,y)=> y.n - x.n);
      const wn = k => WIRKUNG[k] ? WIRKUNG[k].name : k;
      if(list.length === 1)
        parts.push(`<div class="kl">«${a}» hat ${malWort(list[0].n)} ${wn(list[0].k)} erzeugt.</div>`);
      else
        parts.push(`<div class="kl">«${a}» erzeugte bisher ${list.map(i=>`${wn(i.k)} (${i.n}x)`).join(' und ')}.</div>`);
    }
  }
  // Phase 4 Dorf-Ausbau "Vermutungen": zeigt für noch nie gekochte Adjektive die
  // tatsächliche Wirkung/den Fluch aus der Datentabelle als gehedgte Vermutung an.
  // R10/F75: Sieben Adjektive tragen ein fl2, das ab Stufe 2 statt fl greift (Kessel,
  // fluchKey oben). Ohne den Zusatz wäre die bezahlte Vermutung für die schlicht falsch.
  if(amt.ausbauten.vermutungen){
    const kurzFluch = k => FLUCH[k] ? FLUCH[k].kurz : k;
    const unbeobachtet = ZUTAT_ADJ.filter(d => !kladde.adj[d.a]);
    if(unbeobachtet.length){
      parts.push('<div class="klHead">VERMUTUNGEN</div>');
      for(const d of unbeobachtet){
        const wn = WIRKUNG[d.wirk] ? WIRKUNG[d.wirk].name : d.wirk;
        const fn = d.fl2 ? `${kurzFluch(d.fl)}, verstärkt eher ${kurzFluch(d.fl2)}` : kurzFluch(d.fl);
        parts.push(`<div class="kl" style="color:#9a8a5f;">«${d.a}» wirkt vermutlich wie ${wn} (${fn}).</div>`);
      }
    }
  }
  const nounKeys = Object.keys(kladde.noun);
  if(nounKeys.length){
    parts.push('<div class="klHead">SUBSTANTIVE</div>');
    for(const n of nounKeys){
      const nd = ZUTAT_NOUNS[n]; if(!nd) continue;
      const obs = kladde.noun[n];
      const list = Object.keys(obs).map(k => ({k, n:obs[k]})).sort((x,y)=> y.n - x.n);
      if(list.length === 1){
        const total = list[0].n;
        parts.push(`<div class="kl">«${nd.n}» landete bisher ${total >= 2 ? 'immer' : 'einmal'} im ${SLOT_FUGE[list[0].k]}-Slot.</div>`);
      } else {
        parts.push(`<div class="kl">«${nd.n}» landete ${list.map(i=>`${i.n}x im ${SLOT_FUGE[i.k]}-Slot`).join(' und ')}.</div>`);
      }
    }
  }
  const flKeys = Object.keys(kladde.fl).sort();
  if(flKeys.length){
    parts.push('<div class="klHead">FLÜCHE</div>');
    for(const a of flKeys){
      const obs = kladde.fl[a];
      const list = Object.keys(obs).map(k => ({k, n:obs[k]})).sort((x,y)=> y.n - x.n);
      const fn = k => FLUCH[k] ? FLUCH[k].kurz : k;
      if(list.length === 1)
        parts.push(`<div class="kl">«${a}» brachte ${malWort(list[0].n)} ${fn(list[0].k)} mit.</div>`);
      else
        parts.push(`<div class="kl">«${a}» brachte bisher ${list.map(i=>`${fn(i.k)} (${i.n}x)`).join(' und ')} mit.</div>`);
    }
  }
  const uKeys = Object.keys(kladde.unikate);
  if(uKeys.length){
    parts.push('<div class="klHead">UNIKATE</div>');
    for(const u of uKeys) parts.push(`<div class="kl">${kladde.unikate[u]} ist schon aus dem Kessel gekommen.</div>`);
  }
  if(!parts.length) parts.push('<div class="klEmpty">Noch keine Beobachtungen. Der Kessel schweigt.</div>');
  else parts.unshift(`<div style="font-size:calc(10px * var(--fs));color:#9a8a5f;font-style:italic;margin-bottom:6px;">${malWort(kladde.crafts)} gekocht. Notiert wird nur, was wirklich passiert ist.</div>`);
  el('kladdeBox').innerHTML = parts.join('');
}

let blaetterOffen = null;   // welche Blatt-ID gerade aufgeklappt ist, kein neues Panel dafür
function renderBlaetter(){
  // W5: vorgangBestandBlock() (Definition bei vorgangAssert()) liefert '', solange
  // keine Adresszeile gefunden ist — vor Akt IV sieht der Reiter aus wie zuvor.
  // Getrennt von BLAETTER_KEYS/gefunden: die Zählzeile "N von 54" bleibt unberührt.
  const gefunden = BLAETTER_KEYS.filter(id => kladde.blaetter[id]);
  // AN5: der Anfang steht vorn. Er ist das Einzige in diesem Reiter, das ein
  // frischer Spieler ueberhaupt schon haben kann -- die 54 Aktenfunde liegen zu
  // dem Zeitpunkt noch alle in den Kammern.
  const bestand = anfangBestandBlock() + vorgangBestandBlock() + langBestandBlock();
  if(!gefunden.length){
    el('blaetterBox').innerHTML = bestand + '<div class="klEmpty">Noch keine Aktenfunde. Kammern durchsuchen.</div>';
    return;
  }
  const parts = [bestand, `<div style="font-size:calc(10px * var(--fs));color:#9a8a5f;font-style:italic;margin-bottom:6px;">${gefunden.length} von ${BLAETTER_KEYS.length} Blättern gefunden.</div>`];
  for(const id of gefunden){
    const b = BLAETTER[id];
    const titel = `Serie ${b.serie}, Blatt ${b.n}`;
    parts.push(`<div class="ak" onclick="toggleBlatt('${id}')">${titel}${blaetterOffen === id
      ? '<div class="akText">' + b.lines.map(l => `<p>${l}</p>`).join('') + '</div>' : ''}</div>`);
  }
  el('blaetterBox').innerHTML = parts.join('');
}
function toggleBlatt(id){ blaetterOffen = blaetterOffen === id ? null : id; renderBlaetter(); }

// AN5: Der Ungelesen-Zaehler steht AM REITER und nicht im Bestand darunter.
// Ein Zaehler, den man erst sieht, wenn man dort schon ist, zaehlt niemanden
// zurueck. Er steht als Zahl und nicht als Punkt, weil ein Punkt nur "etwas"
// sagt und die Zahl sagt, wie viel -- und weil "3" nach dem Ueberspringen eine
// andere Auskunft ist als "10".
function anfangZaehlerZeichnen(){
  const n = kn.seen.einstellung ? anfangUngelesen() : 0;
  const el2 = el('aktenUngelesen');
  if(el2) el2.textContent = n ? ' ' + n : '';
}

function switchKesselTab(t){
  kesselTab = t;
  anfangZaehlerZeichnen();
  el('tabKessel').classList.toggle('on', t === 'kessel');
  el('tabKladde').classList.toggle('on', t === 'kladde');
  el('tabBlaetter').classList.toggle('on', t === 'blaetter');
  // U8: 'grid' und nicht 'block' — der Kesselplatz steht seit U8 neben dem
  // Beutel, und das Raster dafuer haengt an #kesselPane (s. CSS).
  el('kesselPane').style.display = t === 'kessel' ? 'grid' : 'none';
  el('kladdePane').style.display = t === 'kladde' ? 'block' : 'none';
  el('blaetterPane').style.display = t === 'blaetter' ? 'block' : 'none';
  if(t === 'kladde') renderKladde();
  else if(t === 'blaetter') renderBlaetter();
  else renderKesselPane();
}

function toggleKessel(){
  kesselOpen = !kesselOpen;
  el('kessel').style.display = kesselOpen ? 'flex' : 'none';   // U8: .grossFenster ist eine Spalte
  if(kesselOpen){
    grossfensterRaeumen('kessel');           // der Knopf sitzt im Rucksack: nicht zwei Fenster stapeln
    el('kesselResult').style.display = 'none';
    gfBandZeichnen();
    switchKesselTab(kesselTab);
    knIdleT = 0;
  }
  else clearPot();
  MUS.muffle();   // offenes Panel dämpft die Musik
  panelSicht();   // U1
}

// W6: Dienstausweis, wortgleiche Form wie toggleKessel() oben.
function toggleAusweis(){
  ausweisOpen = !ausweisOpen;
  el('ausweis').style.display = ausweisOpen ? 'block' : 'none';
  if(ausweisOpen){
    // U8: Der Knopf sitzt im Charakterfenster. Der Ausweis ist ein kleines
    // Panel geblieben (ein Dokument ist kein Arbeitsfenster) und legt sich
    // deshalb nicht dazu, sondern raeumt es weg.
    grossfensterRaeumen(null);
    renderAusweis();
    knIdleT = 0;
  }
  MUS.muffle();   // offenes Panel dämpft die Musik
  panelSicht();   // U1
}

// W-Groß: Vollbildkarte — Ausgleich dafür, dass die Minimap seit dem Fenster
// (renderMinimap()) nicht mehr die ganze Welt zeigt. Nutzt denselben miniFull-
// Farb-Bake wie die Minimap, aber ungefenstert über die ganze Karte skaliert.
function renderFullmap(){
  const cv = el('fullmapCanvas'), fctx = cv.getContext('2d');
  fctx.imageSmoothingEnabled = false;
  fctx.clearRect(0, 0, cv.width, cv.height);
  fctx.drawImage(miniFull, 0, 0, MW, MH, 0, 0, cv.width, cv.height);
  const scale = cv.width / MW;   // Karte ist immer quadratisch (MW === MH)
  const mark = (wx, wy, size, fill) => {
    fctx.fillStyle = fill;
    fctx.fillRect((wx/TS)*scale - size/2, (wy/TS)*scale - size/2, size, size);
  };
  if(currentLevel === 1){
    mark((VILLAGE.x0+VILLAGE.x1)/2*TS, (VILLAGE.y0+VILLAGE.y1)/2*TS, 8, '#ffd76a');
    mark(KESSEL.x, KESSEL.y, 6, '#6aff8f');
    for(const m of monsters) if(!m.dead) mark(m.x, m.y, 3, 'rgba(255,80,80,.85)');
    // Wirkung 'Aktenlage': dieselbe Freischalt-Regel wie renderMinimap() — sonst
    // würde die Vollbildkarte den gekauften Effekt wertlos machen.
    if(FX.karte) for(const t of kammerTueren) if(t.cd <= 0) mark(t.x, t.y, 5, '#f4d97a');
  }
  if(portal) mark(portal.x, portal.y, 7, '#ff00ff');
  if(FX.karte && kammer && kammer.truhe && !kammer.truhe.auf) mark(kammer.truhe.x, kammer.truhe.y, 7, '#f4d97a');
  mark(player.x, player.y, 6, '#5c86ff');
}
function toggleFullmap(){
  fullmapOpen = !fullmapOpen;
  el('fullmap').style.display = fullmapOpen ? 'block' : 'none';
  if(fullmapOpen){
    grossfensterRaeumen(null);
    if(ausweisOpen) toggleAusweis();
    renderFullmap();
    knIdleT = 0;
  }
  MUS.muffle();
  panelSicht();   // U1
}

// Passbild-Ausschnitt aus dem bestehenden Held-Bake (SHEETS['hero_baked']), Idle-
// Frame 0, kein Zappeln auf einem Lichtbild. Kein neues Sheet, kein zweites Bake.
// player.hair würfelt startShift() pro Schicht neu (18.8: "jeden Tag ein anderes
// Gesicht"), das Aussehen ist also bereits nicht konstant, ohne dass es je jemand
// gezeigt hat. Ausschnitt an den Alpha-Bounding-Boxen des Idle-Frames gemessen,
// bei Bedarf sy/sh nachjustieren, falls eine Frisur oben anstößt.
// P1: Das Lichtbild braucht dafür keine Zeile. Es kommt aus demselben Bake wie der
// Held, die Haarfarbe der Schicht steht also von selbst darauf.
// U8: Das Lichtbild haengt seit U8 an zwei Stellen — auf dem Ausweis und im
// Charakterfenster. Ein Feldname als Argument statt einer zweiten Kopie
// dieser sechs Zeilen; der Ausschnitt bleibt derselbe.
function renderAusweisFoto(feld = 'ausweisFoto'){
  const cv = el(feld); if(!cv) return;
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;
  c.clearRect(0, 0, cv.width, cv.height);
  const s = SHEETS['hero_baked'];
  if(!s || !BAKED_HERO_ANIM) return;   // vor loadAssets(): leeres Feld, kein Fehler
  const sx = BAKED_HERO_ANIM.idle.offset * 64 + 24;
  c.drawImage(s.img, sx, 20, 16, 18, 0, 0, cv.width, cv.height);
}

function renderAusweis(){
  renderAusweisFoto();
  setTxt('ausweisTitel', AUSWEIS_TEXTE.titel);
  el('ausweisFelder').innerHTML = `
    <div><b>${AUSWEIS_TEXTE.labelAmt}:</b> ${rangName()}</div>
    <div><b>${AUSWEIS_TEXTE.labelVerh}:</b> ${rangVerhaeltnis()}</div>
    <div><b>${AUSWEIS_TEXTE.labelPosten}:</b> ${AUSWEIS_TEXTE.posten}</div>
    <div><b>${AUSWEIS_TEXTE.labelHaar}:</b> ${haarTonDef(player.haarTon).name}</div>
    <div><b>${AUSWEIS_TEXTE.labelGueltig}:</b> ${AUSWEIS_TEXTE.gueltig}</div>`;
  const zeilen = INSIGNIEN.filter(i => i.wenn()).map(i => `<div>${i.n}</div>`).join('');
  el('ausweisInsignien').innerHTML = `<b style="color:#f4d97a;">${AUSWEIS_TEXTE.insignienUeberschrift}</b>${zeilen}`;
  setTxt('ausweisFuss', AUSWEIS_TEXTE.rueckgabe);
}

el('tabKessel').onclick = () => switchKesselTab('kessel');
el('tabKladde').onclick = () => switchKesselTab('kladde');
el('tabBlaetter').onclick = () => switchKesselTab('blaetter');
el('brewBtn').onclick = brew;
el('closeKesselBtn').onclick = toggleKessel;
el('kesselBtn').onclick = toggleKessel;
el('closeAusweisBtn').onclick = toggleAusweis;
el('ausweisBtn').onclick = toggleAusweis;
el('closeFullmapBtn').onclick = toggleFullmap;
el('minimap').onclick = toggleFullmap;   // Handy: Tippen auf die Minimap öffnet die Vollbildkarte
el('closeSchlossBtn').onclick = schlossZu;
el('aktionBtn').onclick = fuehreAktion;
function knAbbruchKammer(){
  // Echter Abbruchpfad (nicht verlasseKammer() selbst, das läuft auch bei Truhe/Tod/Schichtstart):
  // nur zählen, wenn die Truhe noch nicht geplündert ist.
  // F53, bewusst akzeptierte Abweichung: der Rückweg über die Ausgangsrune (AKT_AUSGANG in
  // fuehreAktion()) zählt NICHT mit, obwohl er der Normalfall ist. gameplay:382 nennt genau
  // diese zwei Pfade, und ein Umhängen würde MUS.sting('spitz') bei fast jedem beutelosen
  // Ausstieg feuern und den Randnotiz-Kanal 40 Sekunden sperren. kammerAbbrueche misst
  // deshalb nur das ausdrückliche Aufgeben. Wer den Wert je für einen Schwellen-Gag liest,
  // muss diese Entscheidung zuerst neu treffen.
  if(kammer && !kammer.geleert){
    kn.counters.kammerAbbrueche = (kn.counters.kammerAbbrueche||0) + 1; saveKn(); anlage2Notiz('kammerAbbruch');
    if(kn.regler !== 'schweigt') MUS.sting('spitz');
  }
  verlasseKammer();
}
el('kamExitBtn').onclick = knAbbruchKammer;

document.getElementById('closeInvBtn').onclick = toggleInventory;
document.getElementById('closeSpellBtn').onclick = toggleSpellTree;
document.getElementById('btnStr').onclick = () => addSkill('str');
document.getElementById('btnVit').onclick = () => addSkill('vit');
document.getElementById('btnAgi').onclick = () => addSkill('agi');
document.getElementById('btnInt').onclick = () => addSkill('int');
document.getElementById('potionBtn').innerHTML = `<i class="ico ico-trank" style="font-size:calc(19px * var(--fs));line-height:1;">🧪</i> <span id="potCount">0</span>`;
document.getElementById('potionBtn').onclick = drinkPotion;
document.getElementById('spellBtn').onclick = castActiveSpell;
document.getElementById('ultBtn').onclick = castUltimate;
document.getElementById('spellsBtn').onclick = toggleSpellTree;
document.getElementById('invBtn').onclick = toggleInventory;
// U8: der Charakterknopf und die beiden Blaetter des Charakterfensters.
document.getElementById('charBtn').onclick = () => toggleCharakter();
document.getElementById('closeCharBtn').onclick = () => toggleCharakter();
document.getElementById('closeOptionenBtn').onclick = () => toggleOptionen();
for(const t of document.querySelectorAll('#charakter .gfBlatt'))
  t.onclick = () => charBlattWaehlen(t.dataset.blatt);
document.getElementById('musicBtn').onclick = toggleMusic;
document.getElementById('musicVol').oninput = (e)=>{
  musicVolTarget = e.target.value/100;
  if(musicMuted && musicVolTarget>0){ musicMuted=false; document.getElementById('musicBtn').innerHTML='<i class="ico ico-ton">🎵</i> Musik'; }
  applyMusicGain();
};

function update(dt){
  gespraechTick(dt);   // U3: vor dem state-Ausstieg, damit die Tafel auch dann zugeht, wenn der Zustand wechselt
  if(state !== 'play') return;
  if(hitStopT > 0){ hitStopT -= dt; return; } // Freeze-Frame Effekt
  gameT += dt; if(shakeT > 0) shakeT -= dt;

  // Phase 4: Schicht-Uhr. Läuft ab, wartet dann auf ein sicheres Moment (kein Kampf in der
  // Nähe, keine Kammer/Schloss offen) statt mitten im Getümmel abzubrechen — maximal 60s
  // Überstunden, danach ist so oder so Feierabend (Softlock-Schutz gegen Dauerhorden).
  if(CONFIG.schichtModus && state === 'play'){
    if(!shiftEndPending){
      shiftT -= dt;
      if(shiftT <= 0){ shiftT = 0; shiftEndPending = true; }
    } else {
      overtimeT += dt;
      const kampfNah = monsters.some(m => !m.dead && dist(player.x, player.y, m.x, m.y) < 220);
      if((!kampfNah && !kammer && !schlossOpen) || overtimeT >= 60){
        state = 'feierabend'; endShift('zeit'); return;
      }
    }
  }

  // Musik folgt dem Spielzustand statt eigener Events: Zone/Layer sind Zustände, kein Trigger,
  // MUS.goto/layer sind idempotent (siehe dort), pro Frame aufrufen ist also billig und selbstheilend.
  {
    const bossFight = !!(boss && !boss.dead && boss.aggro);
    MUS.layer('kampf', bossFight);
    // G5: Dorf-Zone übersteuert die Oberwelt-Musik, solange der Spieler im
    // Dorf-Rechteck steht — zoneForLevel() selbst bleibt unangetastet (kennt
    // Kammer/Schattenland-Vorrang weiterhin nicht, das ist hier nicht betroffen).
    // IN1: drinnen bleibt die Dorfmusik an. Ein Wirtshaus ist kein Waldrand,
    // und die Tuer ist zwei Schritte weit weg — ein Zonenwechsel beim
    // Hineingehen und derselbe beim Hinausgehen waere ein Blenden pro Tuer.
    const inVillage = (currentLevel === 1 && !kammer && inVillagePx(player.x, player.y)) || !!innen;
    MUS.goto(bossFight && currentLevel === 2 ? 'boss' : inVillage ? 'village' : zoneForLevel(currentLevel));
    MUS.layer('gefahr', !player.dead && player.hp < derived.maxHp*0.3);
    MUS.setOvertime(CONFIG.schichtModus
      ? (shiftEndPending ? Math.min(1, 0.5 + overtimeT/120) : Math.max(0, 1 - shiftT/30)*0.5)
      : 0);
  }

  // Z5: Mana kehrt erst zurueck, wenn der Vorgang ruht. Bis hierher lief die
  // Regeneration auch waehrend des Zauberns weiter, und der Pool ist gross genug,
  // dass sie in einem Kampf von unter zehn Sekunden gar nicht bremst: gemessen
  // 22 Funken in 6,3 s gegen eine Mumie, ohne je leer zu laufen. Genau das ist
  // der Spam. Mit der Ruhepause wird aus Dauerfeuer ein Rhythmus: Pool leeren,
  // abbrechen, nachladen. Wer durchspammt, steht am Ende ohne Mana da, und dann
  // steht auch das Monster vor ihm.
  if(player.zauberRuhT > 0) player.zauberRuhT -= dt;
  // Z2: passiv nur noch MANA_REGEN (2/s statt 8/s) — der Rest wird im Nahkampf
  // erarbeitet (s. tryAttack). Der Affix 'Manafluss' faellt im gleichen Zug von
  // +4 auf +2 je Rang: bei Basis 2 waeren +4 eine Verdreifachung, gemeint war
  // immer ein Anteil der Basis, nicht ein Vielfaches.
  if(!CFX.manatot && player.zauberRuhT <= 0)                                     // Fluch 'Manastopp'
    player.mana = Math.min(derived.maxMana, player.mana + (MANA_REGEN + FX.mana*2 + (amt.bonusManaRegen||0)) * dt); // Wirkung 'Manafluss'
  if(FX.regen && player.hp > 0)                                                  // Wirkung 'Selbstheilung'
    player.hp = Math.min(derived.maxHp, player.hp + FX.regen*1.6*dt);
  if(player.attackCd > 0) player.attackCd -= dt;
  if(player.swingT > 0) player.swingT -= dt;
  if(player.hurtT > 0) player.hurtT -= dt;
  if(player.castT > 0) player.castT -= dt;
  if(player.spellCd > 0) player.spellCd -= dt;
  if(player.hektikT > 0) player.hektikT -= dt;
  if(player.kampfT > 0) player.kampfT -= dt;
  if(player.platzCd > 0) player.platzCd -= dt;
  // Fluch 'Goldschwund': 1%/s, mindestens 1, nie negativ
  if(CFX.goldweg && player.gold > 0){
    goldRotT += dt;
    if(goldRotT >= 1){ goldRotT = 0; player.gold = Math.max(0, player.gold - Math.max(1, Math.round(player.gold*0.01))); }
  }

  // Held-Animation: Angriff/Zauber schlagen alles, dann Treffer, dann Laufen
  {
    const a = player.dead ? 'death'
            : player.swingT > 0 ? 'attack'
            : player.castT  > 0 ? 'cast'
            : player.hurtT  > 0 ? 'hurt'
            : player.moving ? 'run' : 'idle';
    if(a !== player.anim){ player.anim = a; player.animT = 0; } else player.animT += dt;
  }
  if(attackTouch && !player.dead) touchAttack(attackTouch.sx, attackTouch.sy); // Finger halten = Auto-Attack (Cooldown-gated)
  else if(atkBtnHeld && !player.dead) attackBtnFire();                         // Attack-Button halten = Dauerfeuer (Lock > Priority)
  validateLock();                                                              // Auto-Unlock: tot oder >350px (no-op auf Desktop)

  if(kammer){
    updateKammer(dt);
    // M4: der Ort steht vor der Zahl. Wer unten ist, liest "Sperrablage" und
    // nicht "Kammer, Ebene 2" — der Name ist die Auskunft, die Ebene der Zusatz.
    const ort = kammer.ebene > 0 ? `📍 Sperrablage · Ebene ${kammer.ebene + 1}` : `📍 Kammer · Schwierigkeit ${kammer.diff}`;
    setTxt('zone', `${ort} · Raum ${Math.min(kammer.idx+1, kammer.mods.length)}/${kammer.mods.length}`);
  } else {
    // 6 Türen, also billig genug für den Frame: Cooldown und die reine Optik
    // des Torgitters (fährt hoch, wenn der Spieler in Aktionsreichweite kommt).
    for(const t of kammerTueren){
      if(t.cd > 0){ t.cd -= dt; if(t.cd <= 0) wuerfleTuer(t); }
      const zu = t.cd > 0 || sqDist(player.x, player.y, t.x, t.y) > 58*58;
      t.gateT = clamp((t.gateT || 0) + (zu ? -dt*2.2 : dt*2.2), 0, 1);
    }
  }
  stopfenBrummen(dt);   // SZ3: der Boden meldet sich, wenn jemand danebensteht
  postregen(dt);        // SZ3: drei Schichten Papier im Dorf, nachdem der Stopfen weg ist
  szene6Faellig();      // SZ3: die Entklammerung kommt zum Spieler, nicht er zu ihr
  scanAktion(dt);
  knTick(dt);

  if(schattenlandActive){
    setTxt('zone', `📍 Schattenland · erledigt ${shadowKills} / 500`);
    // Horde Spawner
    if(monsters.length < 130 && (!boss || boss.dead)){
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * 150 + 400; // Spawnen außerhalb des Screens
      const sx = player.x + Math.cos(a) * d, sy = player.y + Math.sin(a) * d;
      if(reachbarPx(sx, sy)){   // W-Groß: die Horde darf nicht ins Meer oder auf eine Insel
        const r = Math.random();
        const type = r<0.55 ? 'shadow' : (r<0.85 ? 'demon' : (r<0.95 ? 'shadowghost' : 'shadowmage'));
        makeMon(type, sx, sy);
      }
    }
  } else if(!kammer){
    const zb = biomeAtPx(player.y);                  // Biom-Anzeige statt statischem "Grasland"
    // W-Groß: am Strand nennt das HUD die Küste, nicht das Band. Die Tilgung ist
    // laut Weltbibel ein eigener Ort mit eigener Aktenbedeutung, also bekommt sie
    // auch eine eigene Zeile — sonst stünde der Spieler am Meer und läse "Grasland".
    const amStrand = T(Math.floor(player.x/TS), Math.floor(player.y/TS)) === G_BEACH;
    // U7: ohne "(Stufe N)". Die Stufe steht seither im Ring des Lichtbilds, und
    // zweimal dieselbe Zahl in einem Bild ist keine doppelte Auskunft, sondern
    // eine halbe. Auf einem stehenden Telefon war sie ausserdem genau der
    // Zusatz, der die Zeile auf zwei Zeilen brach.
    // IN1: drinnen nennt das Band den Raum. "Vordermühl an der Ablage" waere
    // draussen richtig und drinnen die Auskunft, die man gerade nicht braucht.
    setTxt('zone', innen ? '📍 ' + innen.raum.name
                 : inVillagePx(player.x, player.y) ? '📍 Vordermühl an der Ablage'   // G5
                 : amStrand      ? '📍 Küste, Am Rand der Tilgung'
                 : zb === 'snow'  ? '📍 Frostkamm, Die Eisablage'
                 : zb === 'sand'  ? '📍 Aschewüste, Der Brandabschnitt'
                 : zb === 'sumpf' ? '📍 Moorbruch, Die Nassablage'
                 : zb === 'ruine' ? '📍 Steinfeld, Der Altbestand'
                           : '📍 Grasland, Ablage A');
  }
  if(schattenlandActive){
    if(shadowKills >= 500 && !boss){
      makeMon('boss', player.x, player.y - 150);
      floaters.push({x:player.x, y:player.y-80, txt:'FÜRST NACHTRAG ÜBERNIMMT', col:'#ff0000', t:5.0, big:true});
      addShake(30, 2.0); sfx.warp();
    }
  }

  // Items aufsammeln. Wirkung 'Anziehung' vergrößert den Einzugsradius.
  for(let i = drops.length - 1; i >= 0; i--){
    if(dist(player.x, player.y, drops[i].x, drops[i].y) < 26 + FX.magnet*14){
      knIdleT = 0;   // Loot-Aufnahme zählt als "echte Aktion" (Steckenbleib/Untätigkeit)
      if(drops[i].kind === 'gold'){
        // Wirkung 'Goldsegen' erhöht, Fluch 'Fundsteuer' behält einen Anteil ein
        player.gold += Math.round(drops[i].amt * (1 + FX.gold*0.25) * (CFX.steuer ? 0.6 : 1));
        if(drops[i].amt >= 60) anlage2Notiz('goldfund');
        sfx.gold();
      }
      else if(drops[i].kind === 'potion'){ player.potions++; sfx.potion(); }
      else if(drops[i].kind === 'zutat'){
        const z = drops[i];
        addZutat(z.noun, z.adj, 1); sfx.gold();
        floaters.push({x:player.x, y:player.y-20, txt:'+ ' + (z.name || zutatName(z)), col:RARITY[z.rar != null ? z.rar : zutatRar(z)].col, t:1.2});
        if(invOpen) renderInventory();
        if(kesselOpen) renderKesselPane();
      }
      else if(drops[i].kind === 'item'){
        const emptyIdx = player.bag.findIndex(slot => slot === null);
        if(emptyIdx !== -1){
          player.bag[emptyIdx] = drops[i].item; sfx.gold();
          floaters.push({x:player.x, y:player.y-20, txt:`+ ${drops[i].item.name}`, col:RARITY[drops[i].item.rar].col, t:1.0});
          renderInventory();
        } else continue;
      }
      drops.splice(i,1); updateHUD();
    }
  }

  // Portal Interaction
  if(portal && dist(player.x, player.y, portal.x, portal.y) < 30){
    portal = null; loadLevel2();
  }

  let dirX = 0, dirY = 0, moveMag = 1;
  if(keysDown.w) dirY -= 1; if(keysDown.s) dirY += 1;
  if(keysDown.a) dirX -= 1; if(keysDown.d) dirX += 1;
  if(dirX === 0 && dirY === 0 && touchMove.active){      // Touch füllt nur die Lücke – Tastatur gewinnt
    dirX = touchMove.x; dirY = touchMove.y;
    moveMag = Math.min(1, Math.sqrt(dirX*dirX + dirY*dirY));   // R6/F41: kein hypot im Frame-Pfad
  }
  player.moving = dirX !== 0 || dirY !== 0;
  // Fluch 'Zappeln': Stehenbleiben zehrt am Leben, mit Boden bei 25% maxHp (nie tödlich allein)
  if(CFX.zappel && !player.moving){
    player.stillT += dt;
    if(player.stillT > 1.5 && player.hp > derived.maxHp*0.25)
      player.hp = Math.max(derived.maxHp*0.25, player.hp - derived.maxHp*0.015*dt);
  } else player.stillT = 0;
  if(player.langsamT > 0) player.langsamT -= dt;
  if(player.haltT > 0) player.haltT -= dt;
  if(player.trankSperreT > 0) player.trankSperreT -= dt;
  if(player.sichtT > 0) player.sichtT -= dt;
  if(player.haltT > 0) player.moving = false;          // Klammergriff: Beine stehen, Waffe nicht
  if(player.moving){
    const len = Math.sqrt(dirX*dirX + dirY*dirY);     // R6/F41
    const hektikMul = player.hektikT > 0 ? 1.8 : 1;   // Fluch 'Hektik': Trank macht kurz eilig
    const bremsMul = player.langsamT > 0 ? 0.5 : 1;   // Monsterkatalog M1: Verschnueren, Schmatzen
    // Z4: Wer zaubert, steht fast. Der Spieler ist mit 135 schneller als jedes
    // Monster im Spiel, deshalb war Abstandhalten bis hierher gratis: gemessen
    // null Schaden in neun von neun Faellen, egal gegen wen. Reichweite und
    // Schaden zu senken half dagegen nichts, weil das Problem nicht die Zahl
    // war, sondern die Bewegungsfreiheit. Die Zauberanimation laeuft 0,42 s,
    // die Abklingzeit 0,28 s: wer ununterbrochen spammt, gibt damit Boden auf,
    // wer Boden halten will, muss Pausen lassen. Eine Amtshandlung unterschreibt
    // man nicht im Laufen.
    const zauberMul = player.castT > 0 ? 0.15 : 1;
    const tempo = derived.speed * hektikMul * bremsMul * zauberMul * moveMag;
    moveEnt(player, (dirX / len) * tempo * dt, (dirY / len) * tempo * dt);
    player.faceLeft = dirX < 0;
    player.mvx = dirX; player.mvy = dirY;      // Schieberichtung für Kammerblöcke
  }

  cam.x = lerp(cam.x, player.x - canvas.width / 2, 0.1);
  cam.y = lerp(cam.y, player.y - canvas.height / 2, 0.1);
  if(kammer) kammerKamera();      // Korridor mittig halten statt halbes Bild Leere zu zeigen

  // W-Groß: Nahliste. Alles, was pro Frame über ALLE Monster laufen müsste
  // (Trennung, Projektiltreffer), läuft stattdessen nur über die bildschirmnahen.
  // Bei 600 statt 49 Monstern wäre die O(n^2)-Trennung sonst 360000
  // Paarprüfungen pro Frame statt der früheren 2400. Steht direkt hinter der
  // Kamera, weil nahAmBild() cam liest, und vor allen Verbrauchern (Projektile,
  // Monsterschleife). Wird nie neu allokiert (Regressionsregel 4).
  nahListe.length = 0;
  for(const m of monsters) if(!m.dead && nahAmBild(m)) nahListe.push(m);

  // G5: Wetter-Update — reine Optik, eigene Sub-Caps (WEATHER_SNOW_CAP/WEATHER_WIND_CAP),
  // kein particles[]-Producer (Regressionsregel: MAX_PARTICLES gilt nur für spawnImpactParticles,
  // ein zweiter Producer müsste eigenständig deckeln, was hier über die Sub-Caps passiert).
  for(const cl of weatherClouds){
    cl.x += cl.vx * dt;
    if(cl.x < -80) cl.x = MW*TS + 80; else if(cl.x > MW*TS + 80) cl.x = -80;
  }
  if(currentLevel === 1 && !kammer){
    const pyB = biomeAtPx(player.y);
    if(pyB === 'snow' && weatherSnow.length < WEATHER_SNOW_CAP && Math.random() < 0.6){
      weatherSnow.push({x: cam.x + rr(-40, canvas.width+40), y: cam.y - 20, vx: rr(-8,8), vy: rr(28,48), life: rr(3,5)});
    }
    if(pyB === 'sand'){
      windGustT -= dt;
      if(windGustT <= 0 && weatherWind.length < WEATHER_WIND_CAP){
        windGustT = rr(4, 9);
        const fromLeft = Math.random() < 0.5;
        weatherWind.push({x: fromLeft ? cam.x - 40 : cam.x + canvas.width + 40,
                           y: rr(cam.y+40, cam.y+canvas.height-40),
                           vx: (fromLeft?1:-1) * rr(90,140), phase: 0});
      }
    }
  }
  for(let i=weatherSnow.length-1; i>=0; i--){
    const s = weatherSnow[i]; s.x += s.vx*dt; s.y += s.vy*dt; s.life -= dt;
    if(s.life <= 0) weatherSnow.splice(i,1);
  }
  for(let i=weatherWind.length-1; i>=0; i--){
    const w = weatherWind[i]; w.x += w.vx*dt; w.phase += dt;
    if(w.phase > 1.8) weatherWind.splice(i,1);
  }

  // Projektile / Partikel Update
  for(let i=particles.length-1; i>=0; i--){
    const p = particles[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
    if(p.confetti){ p.vy += 420 * dt; p.vx *= 0.96; p.rot += p.spin * dt; }
    if(p.life <= 0) particles.splice(i, 1);
  }

  for(let i = projectiles.length - 1; i >= 0; i--){
    const p = projectiles[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.t -= dt;
    if(p.t <= 0){ projectiles.splice(i, 1); continue; }
    // Kammer-Fackeln: Feuer zündet, Frost löscht. Das Geschoss ist danach verbraucht.
    if(kammer && kamFlamme(p.x, p.y, p.r || 8, p.zweig)){
      spawnImpactParticles(p.x, p.y, 12, p.color || '#ff6600');
      projectiles.splice(i, 1); continue;
    }
    // W-Groß: Trefferprüfung über die Nahliste statt über alle Monster. Ein
    // Geschoss fliegt immer im Bild — ein Monster 5000px entfernt konnte es nie
    // treffen, wurde vorher aber trotzdem jedes Frame mit Math.hypot geprüft.
    for(const m of nahListe){
      if(!m.dead && dist(p.x, p.y, m.x, m.y) < m.r + (p.r||15)){
        hurtMon(m, p.dmg, !!p.krit, Math.atan2(p.vy, p.vx), p.zweig);
        if(p.slow) m.slowT = p.slow;
        spawnImpactParticles(p.x, p.y, 20, p.color || '#ff6600');
        if(p.aoe){
          magicEffects.push({type:'ring', x:p.x, y:p.y, rad:p.aoe, color:p.color||'#ff9f4a', t:0.3, maxT:0.3});
          for(const m2 of nahListe){ if(m2!==m && !m2.dead && dist(p.x,p.y,m2.x,m2.y) < p.aoe) hurtMon(m2, Math.round(p.dmg*0.6), false, Math.atan2(m2.y-p.y,m2.x-p.x), p.zweig); }
        }
        projectiles.splice(i, 1); break;
      }
    }
  }

  // Gegner-Fernangriffe
  for(let i = enemyBolts.length - 1; i >= 0; i--){
    const p = enemyBolts[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.t -= dt;
    if(p.t <= 0){ enemyBolts.splice(i, 1); continue; }
    if(!player.dead && dist(p.x, p.y, player.x, player.y) < player.r + (p.r||7)){
      hurtPlayer(p.dmg);
      spawnImpactParticles(p.x, p.y, 12, p.color || '#c77dff');
      enemyBolts.splice(i, 1);
    }
  }

  for(let i=magicEffects.length-1; i>=0; i--){ magicEffects[i].t -= dt; if(magicEffects[i].t <= 0) magicEffects.splice(i,1); }

  // Leiste erst, wenn der Boss den Spieler bemerkt hat: der Kammerwächter soll
  // nicht schon aus Raum 1 heraus angekündigt werden. Name kommt aus MONDEF.
  if(boss && !boss.dead && boss.aggro){
    setStyle('bossbar', 'display', 'block');
    setTxt('bossname', boss.def.name + ' · ' + boss.def.art);
    setStyle('bossfill', 'width', Math.max(0, (boss.hp / boss.maxHp) * 100) + '%');
  } else setStyle('bossbar', 'display', 'none');

  // Monster Update & Löschen von Toten
  for(let i=monsters.length-1; i>=0; i--){
    const m = monsters[i];
    if(m.dead){ monsters.splice(i, 1); continue; }
    const mx0 = m.x, my0 = m.y, wasAggro = m.aggro;

    // Schlaf für ferne, nicht aggrierte Monster: nur die Uhren laufen weiter.
    // Ein eingefrorener slowT/flash/atkT wäre ein Fehler, der erst beim
    // Wiedersehen sichtbar würde. Aggrierte ticken immer voll durch, sie jagen
    // ja gerade — und lockedTarget ebenso, sonst zielte die Handy-Zielautomatik
    // (Fangreichweite bis 420px, mehr als eine halbe Telefonbreite) auf ein
    // Monster, das gar nicht reagiert.
    if(!m.aggro && m !== lockedTarget && !nahAmBild(m)){
      if(m.flash > 0) m.flash -= dt;
      m.atkT -= dt;
      if(m.slowT > 0) m.slowT -= dt;
      if(m.leashT > 0) m.leashT -= dt;
      m.wanderT -= dt;
      // Monsterkatalog M1: ein eingefrorenes Fenster wäre ein Fehler, der erst
      // beim Wiedersehen sichtbar wird, gleiche Begründung wie bei slowT oben.
      if(m.teleT > 0) m.teleT = 0;              // Ausholen bricht ab, wenn niemand hinsieht
      monsterFenster(m, dt);
      continue;
    }

    if(Math.abs(m.kx) > 0.1 || Math.abs(m.ky) > 0.1){
      moveEnt(m, m.kx * dt, m.ky * dt);
      m.kx = lerp(m.kx, 0, 0.15); m.ky = lerp(m.ky, 0, 0.15);
    }
    if(m.flash > 0) m.flash -= dt; m.atkT -= dt;
    if(m.slowT > 0) m.slowT -= dt;
    if(m.leashT > 0) m.leashT -= dt;
    monsterFenster(m, dt);
    if(m.teleT > 0){                          // Monsterkatalog M1: Vorwarnung läuft
      m.teleT -= dt;
      if(m.teleT <= 0) angriffAusloesen(m);
    }
    const spd = m.def.speed * (m.slowT > 0 ? 0.4 : 1) * (m.elite ? ELITE.tempo : 1);

    const pd = dist(m.x, m.y, player.x, player.y);
    // Aggro wurde bis W-Groß NIE wieder gelöscht: ein einmal aufgeschrecktes
    // Monster verfolgte den Spieler über die ganze Karte, bis ins Dorf hinein.
    // Auf 80x80 fiel das kaum auf, auf 320x320 mit Buchten und ganz ohne
    // Wegfindung (Monster steuern per atan2) ist es zweierlei Fehler: der
    // Verfolger strandet an der erstbesten Küstenkante, und die Aggro-Menge
    // wächst über eine Schicht monoton, bis alle gleichzeitig am Spieler hängen.
    // Nur Oberwelt: die Schattenhorde SOLL ewig jagen, die Kammer ist ein Raum.
    // M2: Hausrecht. Der monsterfreie Gürtel ist von 40 auf 12 Kacheln
    // geschrumpft (s. DORF_BANN), damit der erste Kampf nicht mehr zehn Minuten
    // Fußweg entfernt liegt. Damit reicht die Verfolgungsleine von 620 Pixeln
    // aber bis mitten ins Dorf hinein, und genau davor warnt der Kommentar
    // unten seit W-Groß. Also gilt die Dorffläche jetzt ausdrücklich: wer sie
    // betritt, verliert die Aggro auf der Stelle und geht auf seinen Platz
    // zurück, und niemand schreckt aus dem Dorf heraus auf. Das Dorf ist der
    // einzige Ort im Spiel, an dem man ohne Aufmerksamkeit stehen darf.
    const imDorf = inVillageT((m.x / TS) | 0, (m.y / TS) | 0);
    if(m.aggro && currentLevel === 1 && !kammer){
      if(imDorf || pd > LEASH_PX || sqDist(m.x, m.y, m.homeX, m.homeY) > LEASH_HOME*LEASH_HOME){
        m.aggro = false; m.leashT = 3; m.stuckT = 0;   // Sperre gegen sofortiges Wiederaufschrecken
        m.teleT = 0;                                  // eine Ansage ohne Ziel wird nicht nachgeholt
      } else if(pd > m.def.atkRange && Math.abs(m.x-mx0) + Math.abs(m.y-my0) < 0.3){
        // Steckenbleiber: jagt, kommt aber nicht vom Fleck (Küstenkante, Baumriegel).
        m.stuckT += dt;
        if(m.stuckT > 2.5){ m.aggro = false; m.leashT = 4; m.stuckT = 0; }
      } else m.stuckT = 0;
    }
    // W-Lager: die Lagerwachen fallen hier heraus. Sie werden nie von Naehe
    // aggressiv, sondern ausschliesslich davon, getroffen zu werden — hurtMon()
    // setzt m.aggro, dieser Pfad nicht. Wer am Tor vorbeigeht, geht vorbei; wer
    // zuschlaegt, hat angefangen. Das ist der Inhalt des Ortes, nicht seine Bequemlichkeit.
    if(!m.aggro && !m.def.lagerwache && m.leashT <= 0 && !imDorf && pd < m.def.aggro * (CFX.laut ? 2 : 1)) m.aggro = true;   // Fluch 'Geschwätzigkeit'

    // Kammerwache mit Rückenregel: dreht sich nur begrenzt schnell zum Spieler,
    // sonst wäre "von hinten" nie erreichbar.
    if(m.regel && m.regel.typ === 'ruecken'){
      const soll = Math.atan2(player.y - m.y, player.x - m.x);
      let d = soll - m.faceAng;
      while(d > Math.PI) d -= Math.PI*2;
      while(d < -Math.PI) d += Math.PI*2;
      const max = 2.1 * dt;
      m.faceAng += clamp(d, -max, max);
    }

    if(!m.aggro && imDorf){
      // M2: Hausrecht, zweiter Teil. Aggro löschen allein würde den Verfolger
      // mitten auf dem Marktplatz stehen lassen; er geht deshalb sichtbar auf
      // seinen Heimatpunkt zurück, statt dort weiterzuwandern.
      const a = Math.atan2(m.homeY - m.y, m.homeX - m.x);
      moveEnt(m, Math.cos(a)*spd*dt, Math.sin(a)*spd*dt);
      m.facingLeft = m.homeX < m.x;
    } else if(!m.aggro){
      // Herumwandern, wenn kein Ziel in Sicht
      m.wanderT -= dt;
      if(m.wanderT <= 0){
        m.wanderT = rr(1.2, 3);
        if(Math.random() < 0.4){ m.wanderDx = 0; m.wanderDy = 0; }
        else { const wa = rr(0, Math.PI*2); m.wanderDx = Math.cos(wa); m.wanderDy = Math.sin(wa); }
      }
      if(m.wanderDx || m.wanderDy){
        moveEnt(m, m.wanderDx*spd*0.35*dt, m.wanderDy*spd*0.35*dt);
        if(Math.abs(m.wanderDx) > 0.1) m.facingLeft = m.wanderDx < 0;
      }
    } else if(m.teleT > 0 || m.ruheT > 0 || m.zuT > 0 || m.offenT > 0){
      // Monsterkatalog M1: wer ausholt, sich erschöpft, verweht oder quittiert,
      // steht dabei. Ohne diesen Zweig wäre jede Vorwarnung unlesbar, das
      // Monster liefe während des Ausholens einfach nach.
      m.facingLeft = player.x < m.x;
    } else if(m.def.ranged){
      const minRange = m.def.atkRange * 0.5;
      if(pd < minRange){
        const a = Math.atan2(m.y - player.y, m.x - player.x); // weg vom Spieler
        moveEnt(m, Math.cos(a)*spd*dt, Math.sin(a)*spd*dt);
        m.facingLeft = (m.x - player.x) < 0 ? false : true;
      } else if(pd > m.def.atkRange){
        const a = Math.atan2(player.y - m.y, player.x - m.x);
        moveEnt(m, Math.cos(a)*spd*dt, Math.sin(a)*spd*dt);
        m.facingLeft = player.x < m.x;
      } else if(m.atkT <= 0){
        angriffStarten(m);
      }
      if(pd < 900) m.facingLeft = player.x < m.x;
    } else if(m.rueckT > 0){
      // Kiter: nach jedem Schlag sofort wieder auf Abstand. Er bleibt trotzdem im
      // Takt seines Angriffsintervalls, der Rückzug ist kürzer als der Takt.
      // Wer ihn ignoriert, wird also weiter regelmäßig getroffen, nur wer ihm
      // hinterherläuft, verliert Zeit.
      const a = Math.atan2(m.y - player.y, m.x - player.x);
      moveEnt(m, Math.cos(a)*spd*(m.def.kiter.tempo||1)*dt, Math.sin(a)*spd*(m.def.kiter.tempo||1)*dt);
      m.facingLeft = player.x < m.x;
    } else {
      if(pd <= reichweiteVon(m.def)){
        if(m.atkT <= 0) angriffStarten(m);
      }
      if(pd > m.def.atkRange){
        const a = Math.atan2(player.y - m.y, player.x - m.x);
        // Soft Avoidance für Horde-Verhalten. Läuft seit W-Groß über die Nahliste
        // statt über alle Monster: bei 600 Oberwelt-Mobs wären das 360k
        // Paarprüfungen pro Frame, bei typisch 25 bildschirmnahen sind es 625.
        // Sichtbar ist der Unterschied nicht — Ausweichen zählt nur dort, wo man
        // es sieht. Innerhalb der Liste weiter erst zwei Achsenvergleiche, Wurzel
        // gar nicht.
        let sepX = 0, sepY = 0;
        for(const other of nahListe){
            if(other === m || other.dead) continue;
            const dx = m.x - other.x; if(dx > 15 || dx < -15) continue;
            const dy = m.y - other.y; if(dy > 15 || dy < -15) continue;
            if(dx*dx + dy*dy < 225){ sepX += dx; sepY += dy; }
        }
        moveEnt(m, (Math.cos(a)*spd + sepX*2)*dt, (Math.sin(a)*spd + sepY*2)*dt);
        m.facingLeft = player.x < m.x;
      }
    }

    // --- Animationszustand ---
    if(!wasAggro && m.aggro) m.alertT = 0.9;              // "!" beim Entdecken
    if(m.alertT > 0) m.alertT -= dt;
    if(m.actT > 0) m.actT -= dt;
    m.moving = Math.abs(m.x - mx0) + Math.abs(m.y - my0) > 0.4;
    let na;
    if(m.actT > 0)        na = m.def.ranged ? 'cast' : 'attack';
    else if(m.flash > 0)  na = 'hurt';
    else if(m.moving)     na = m.aggro ? 'run' : 'walk';
    else                  na = 'idle';
    if(na !== m.anim){ m.anim = na; m.animT = 0; } else m.animT += dt;
  }

  // Leichen ausblenden
  for(let i = corpses.length-1; i>=0; i--){ corpses[i].t += dt; if(corpses[i].t >= corpses[i].dur) corpses.splice(i,1); }

  // Ambiente-Tiere: gemütlich wandern, keine Kollision mit Spielinhalten
  for(const c of critters){
    // G12: Das Kapybara ist das einzige Ambiente-Tier mit einem Zustand. Es
    // schwimmt nicht, es treibt und taucht: oben — ab — unten blubbern — auf.
    // Die beiden Übergänge dauern genau so lange wie ihre Blätter (animLen),
    // damit kein halber Tauchgang abgeschnitten wird, und laufen einmal statt in
    // Schleife; phase wird auf -gameT gesetzt, sonst finge der Tauchgang bei
    // einem beliebigen Frame an.
    if(c.kapy){
      const k = c.kapy;
      k.t -= dt;
      if(k.t <= 0){
        if(k.zustand === 'oben'){        k.zustand = 'ab';    c.sheetIdle = 'cfkapy_dive';    k.einmal = true;  k.t = animLen('cfkapy_dive', 6); }
        else if(k.zustand === 'ab'){     k.zustand = 'unten'; c.sheetIdle = 'cfkapy_bubbles'; k.einmal = false; k.t = rr(4, 9); }
        else if(k.zustand === 'unten'){  k.zustand = 'auf';   c.sheetIdle = 'cfkapy_emerge';  k.einmal = true;  k.t = animLen('cfkapy_emerge', 6); }
        else {                           k.zustand = 'oben';  c.sheetIdle = 'cfkapy_idle';    k.einmal = false; k.t = rr(6, 16); }
        c.sheetWalk = c.sheetIdle;
        c.phase = -gameT;
      }
      continue;
    }
    // Der Frosch sitzt am Ufer und quakt. Sein Blatt hat gar keine Laufzeile
    // (Blinzeln, Quaken, Zunge, Treffer) — ein wandernder Frosch wäre hier
    // dieselbe Behauptung wie ein Zaun ohne Leine in G11.
    if(c.lebensraum === 'ufer') continue;
    c.restT -= dt;
    if(c.restT <= 0){
      c.restT = rr(1.5, 5);
      if(Math.random() < 0.45){ c.vx = 0; c.vy = 0; }
      else {
        const a = rr(0, Math.PI*2);
        // Ein Falter ist schneller als ein Schaf und ein Schwan langsamer.
        const v = c.lebensraum === 'luft' ? 26 : c.lebensraum === 'wasser' ? 11 : 18;
        c.vx = Math.cos(a)*v; c.vy = Math.sin(a)*v; c.flip = c.vx < 0;
      }
    }
    if(c.vx || c.vy){
      const nx = c.x + c.vx*dt, ny = c.y + c.vy*dt;
      // G11: dieselbe Abpraller-Regel wie an einer Wand, nur an der Zaunlinie.
      // Ein Zaun, durch den das Schaf spaziert, wäre eine Behauptung.
      // G12: derselbe Rahmen trägt jetzt zwei Bedeutungen — die Koppel MUSS zum
      // sichtbaren Zaun passen, das Revier ist eine Leine, die niemand sieht.
      const k = c.koppel || c.revier;
      if(critterGrund(c, nx, c.y) && imRahmen(k, nx, c.y)) c.x = nx; else c.vx = -c.vx;
      if(critterGrund(c, c.x, ny) && imRahmen(k, c.x, ny)) c.y = ny; else c.vy = -c.vy;
    }
  }

  // G5: Dorf-NPCs — wie critters, aber an einen Heimatanker gebunden (Radius 40px
  // ≈ 1,25 Kacheln), sonst würden sie das Dorf sichtbar verlassen. Steuert bei
  // Ferne vom Anker gezielt zurück statt rein zufällig, sonst dauert die Rückkehr
  // (leichte Bias-Streuung ±0,6 rad, damit es nicht wie ein Schienenweg aussieht).
  // R6/F41: alle drei Ankerprüfungen vergleichen nur gegen den Radius, die Wurzel
  // wird nirgends gebraucht — deshalb sqDist gegen das Quadrat (Regressionsregel 3).
  for(const n of npcs){
    if(n.fest) continue;   // W3: Held-Komposit-Figuren stehen fest wie Knöterich, keine Wanderung
    if(!figDa(n.figur)) continue;   // W11: noch nicht im Dorf, also auch nicht unterwegs
    n.restT -= dt;
    if(n.restT <= 0){
      n.restT = rr(1.5, 4);
      if(Math.random() < 0.4){ n.vx = 0; n.vy = 0; }
      else {
        const weitDraussen = sqDist(n.x, n.y, n.homeX, n.homeY) > NPC_HOME_R2;
        const a = weitDraussen ? Math.atan2(n.homeY-n.y, n.homeX-n.x) + rr(-0.6,0.6) : rr(0, Math.PI*2);
        n.vx = Math.cos(a)*14; n.vy = Math.sin(a)*14; n.flip = n.vx < 0;
      }
    }
    if(n.vx || n.vy){
      const nx = n.x + n.vx*dt, ny = n.y + n.vy*dt;
      if(walkPx(nx, n.y) && sqDist(nx, n.y, n.homeX, n.homeY) <= NPC_HOME_R2) n.x = nx; else n.vx = -n.vx;
      if(walkPx(n.x, ny) && sqDist(n.x, ny, n.homeX, n.homeY) <= NPC_HOME_R2) n.y = ny; else n.vy = -n.vy;
    }
  }

  if(floaters.length > 70) floaters.splice(0, floaters.length - 70);   // Schadenszahlen der Horde deckeln
  for(let i = floaters.length - 1; i >= 0; i--){ const f = floaters[i]; f.y -= 24 * dt; f.t -= dt; if(f.t <= 0) floaters.splice(i, 1); }
}

let frameNo = 0;

// Zeichenliste: feste Einträge aus einem Pool, damit pro Frame weder Objekte noch
// Closures anfallen (das war bei voller Horde der größte GC-Verursacher).
const DRAW_TREE=0, DRAW_DECO=1, DRAW_CRITTER=2, DRAW_CORPSE=3, DRAW_MON=4, DRAW_PLAYER=5, DRAW_KESSEL=6,
      DRAW_KAMOBJ=7, DRAW_KAMTUER=8, DRAW_ALTER=9, DRAW_NPC=10, DRAW_INNEN=11;   // IN1: Möbel
const drawPool = [], drawList = [];
let drawCount = 0;
const byY = (a,b)=> a.y - b.y;
function pushDraw(y, kind, o){
  const e = drawPool[drawCount] || (drawPool[drawCount] = {y:0, kind:0, o:null});
  e.y = y; e.kind = kind; e.o = o;
  drawList[drawCount++] = e;
}
// Erster Index mit arr[i].y >= y (arr ist nach y sortiert).
function firstAtY(arr, y){
  let lo = 0, hi = arr.length;
  while(lo < hi){ const mid = (lo + hi) >> 1; if(arr[mid].y < y) lo = mid + 1; else hi = mid; }
  return lo;
}

// Sichtbarkeitsfenster der Zeichenliste. R6/F32: Grenzen und Prüfung lagen bis dahin
// in render(), die Closure entstand damit pro Frame neu (Regressionsregel 4).
let cullL = 0, cullR = 0, cullT = 0, cullB = 0;
// Zuschlag, um den die Sichtprüfung über den Bildrand hinausgreift. Ein Prop hängt
// an seinem Fußpunkt und ragt von dort nach oben und zur Seite — wer knapp
// unterhalb oder seitlich außerhalb steht, ist mit seiner Krone bzw. Fassade
// trotzdem im Bild. Bekommt nur, wer ihn braucht, jeweils in seiner Schleife (F37).
// Bis G6: BIG_PAD 190, der größte Fassaden-Überstand über den Fußpunkt
// (cfbld_amt: ay 190, ax 120), und für Bäume gar keiner, weil der 80er-Kamerarand
// bei 84 Pixeln Baumhöhe zufällig reichte.
// G7: beide Zahlen hingen an Blattmaßen, und die Blätter werden jetzt mit WELT_SC
// gezeichnet. Das Amt misst 384 Pixel in der Höhe und 480 in der Breite, also 240
// zur Seite — mit 190 wäre am Bildrand das halbe Amt verschwunden. Ein Baum misst
// 160 statt 84, der Kamerarand reicht ihm nicht mehr, also bekommt er einen
// eigenen Zuschlag. Beide sind ihr Blattmaß plus etwas Luft, nicht geraten.
const BIG_PAD = 400;
const BAUM_PAD = 170;
const vis = (x,y)=> x > cullL && x < cullR && y > cullT && y < cullB;

function render(){
  // Grund unter der Welt. In der Oberwelt tiefseeblau statt schwarz: die Kamera
  // ist dort nicht an die Weltgrenzen geklemmt, an der Küste sieht man also über
  // den Kartenrand hinaus — offenes Meer liest sich richtig, schwarze Leere nicht.
  ctx.fillStyle = (currentLevel === 1 && !kammer) ? '#122a52' : '#05030a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  let sx = 0, sy = 0;
  // Ganzzahlig runden: cam.x/y sind über Math.floor schon ganzzahlig, der Wackel-
  // offset war es nicht. Beim alten Vollkarten-Canvas fiel das nicht auf (ein
  // einziges Bild kann keine Naht in sich haben), seit dem Chunk-Cache erzeugt
  // eine gebrochene translate sichtbare Fugen zwischen den 54 Einzelbildern.
  if(shakeT > 0){ sx = Math.round(rr(-shakeInt, shakeInt)); sy = Math.round(rr(-shakeInt, shakeInt)); }
  ctx.translate(-Math.floor(cam.x) + sx, -Math.floor(cam.y) + sy);

  // Sichtfenster zuerst: Chunk-Auswahl, Dekale und (weiter unten) drops/particles/
  // trees/decos/Entitäten teilen sich dieselben Grenzen (R6/F32-Prinzip, jetzt auch
  // für den Boden). Vorher stand das erst nach den Partikeln — hierher gezogen,
  // weil der Boden jetzt selbst gekappt werden muss (kein Vollkarten-Canvas mehr).
  cullL = cam.x - 80; cullR = cam.x + canvas.width + 80;
  cullT = cam.y - 120; cullB = cam.y + canvas.height + 80;

  // Boden-Chunks zeichnen: nur die sichtbaren 256x256px-Blöcke, mit 1 Chunk Rand
  // (der Kamera-Wackler sx/sy bleibt weit darunter, siehe addShake-Aufrufe).
  // Die Oberwelt-Kamera ist nicht an die Weltgrenzen geklemmt (nur kammerKamera()
  // klemmt) — deshalb hier hart auf 0..CHUNKS_X/Y-1 klemmen, sonst läse getChunk()
  // über den Rand des map-Arrays hinaus.
  {
    const ox = Math.floor(cam.x) - sx, oy = Math.floor(cam.y) - sy;
    const cx0 = Math.max(0, Math.floor(ox / CHPX) - 1);
    const cx1 = Math.min(CHUNKS_X - 1, Math.floor((ox + canvas.width) / CHPX) + 1);
    const cy0 = Math.max(0, Math.floor(oy / CHPX) - 1);
    const cy1 = Math.min(CHUNKS_Y - 1, Math.floor((oy + canvas.height) / CHPX) + 1);
    for(let cy = cy0; cy <= cy1; cy++){
      for(let cx = cx0; cx <= cx1; cx++){
        const c = getChunk(cx, cy);
        if(c) ctx.drawImage(c, cx*CHPX, cy*CHPX);
      }
    }
  }

  // Konfetti-Dekale (vormals dauerhaft im floorCanvas): nach Farbe gebündelt, damit
  // fillStyle nicht pro Krümel wechselt, gegen das Sichtfenster gekappt.
  for(let ci = 0; ci < CONFETTI.length; ci++){
    let anyThisColor = false;
    for(let k = 0; k < decalN; k++){
      if(decalCol[k] !== ci) continue;
      const dx = decalX[k], dy = decalY[k];
      if(dx < cullL || dx > cullR || dy < cullT || dy > cullB) continue;
      if(!anyThisColor){ ctx.fillStyle = CONFETTI[ci]; anyThisColor = true; }
      ctx.fillRect(dx, dy, decalW[k], decalH[k]);
    }
  }

  if(kammer) drawKammerBoden();          // Zielfelder, Plattenspur, Lichtstrahl liegen flach

  if(portal){
    ctx.save(); ctx.translate(portal.x, portal.y); ctx.rotate(gameT * 2);
    ctx.fillStyle = '#1c0828'; ctx.beginPath(); ctx.arc(0,0, 24 + Math.sin(gameT*4)*4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#a855f7'; ctx.beginPath(); ctx.arc(0,0, 16 + Math.sin(gameT*6)*3, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  for(const d of drops){
    if(!vis(d.x, d.y)) continue;   // W-Groß: bislang ungekappt, bei 600 Mobs zu viele gleichzeitig
    const bob = Math.sin(gameT*3 + d.x*0.1) * 2;
    const gf = animFrame('glint', gameT + d.x*0.017, 9);
    ctx.save(); ctx.textAlign = 'center'; ctx.font = '17px serif';
    if(d.kind === 'gold'){
      zeichneIco('gold', '💰', d.x, d.y+bob, 16);
      drawSprite('glint', gf, d.x, d.y-6+bob, 1.6);
    } else if(d.kind === 'potion'){
      zeichneIco('trank', '🧪', d.x, d.y+bob, 16);
    } else if(d.kind === 'zutat'){
      ctx.shadowColor = RARITY[d.rar].col; ctx.shadowBlur = d.rar >= 2 ? 12 : 5;
      ctx.fillText(ZUTAT_NOUNS[d.noun].icon, d.x, d.y+4+bob);
      ctx.shadowBlur = 0;
      if(d.rar >= 1) drawSprite('glint', gf, d.x, d.y-10+bob, 1.3);
      ctx.fillStyle = RARITY[d.rar].col; ctx.font = 'bold 10px Courier New';
      ctx.fillText(d.name, d.x, d.y+18);
    } else if(d.kind === 'item'){
      ctx.shadowColor = RARITY[d.item.rar].col; ctx.shadowBlur = d.item.rar >= 2 ? 12 : 5;
      ctx.fillText(d.item.base.icon || '📦', d.x, d.y+4+bob);
      ctx.shadowBlur = 0;
      drawSprite('glint', gf, d.x, d.y-10+bob, 1.6);
      ctx.fillStyle = RARITY[d.item.rar].col; ctx.font = 'bold 11px Courier New';
      ctx.fillText(d.item.name, d.x, d.y+18);
    }
    ctx.restore();
  }

  for(const p of particles){
    if(!vis(p.x, p.y)) continue;   // W-Groß: bislang ungekappt, ein Flächenzauber sättigt sonst den Pool sichtbar
    ctx.fillStyle = p.color; ctx.globalAlpha = Math.min(1, p.life / p.maxLife);
    if(p.confetti){
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    } else {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1.0;

  for(const p of projectiles){
    ctx.fillStyle = p.color || '#ff6600'; ctx.shadowColor = p.color || '#ff6600'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r||6, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  }
  // G3: Sprite statt Farbkreis, getönt nach bolt.color (ein Sheet für alle 5 Magier).
  for(const p of enemyBolts)
    drawSprite('cf_bolt', animFrame('cf_bolt', 2.4 - p.t, 14), p.x, p.y, 1, false, p.color || '#c77dff', 0.7);
  for(const eff of magicEffects){
    if(eff.type === 'lightning'){
      ctx.strokeStyle = '#c77dff'; ctx.lineWidth = 4; ctx.beginPath();
      ctx.moveTo(eff.x1, eff.y1); ctx.lineTo(eff.x2, eff.y2); ctx.stroke();
    } else if(eff.type === 'ring'){
      const p = 1 - Math.max(0, eff.t / eff.maxT);
      ctx.globalAlpha = 1 - p; ctx.strokeStyle = eff.color || '#c77dff'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(eff.x, eff.y, eff.rad * p, 0, Math.PI*2); ctx.stroke();
      ctx.globalAlpha = 1.0;
    } else if(eff.type === 'flame'){
      ctx.globalAlpha = Math.min(1, eff.t / 0.3);
      drawSprite('fire2', animFrame('fire2', eff.maxT - eff.t, 12), eff.x, eff.y, eff.sc);
      ctx.globalAlpha = 1.0;
    }
  }

  // G5: Wetter, reine Optik, vor der y-sortierten Liste (wie particles oben).
  if(currentLevel === 1 && !kammer){
    ctx.globalAlpha = 0.22;                      // Wolkenschatten: weich, deckt nichts ab
    for(const cl of weatherClouds) drawSprite('cfcloud', cl.variant, cl.x, cl.y, 2.2);
    ctx.globalAlpha = 1;
    for(const s of weatherSnow){
      ctx.fillStyle = '#eaf6ff'; ctx.globalAlpha = Math.min(1, s.life);
      ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for(const w of weatherWind) drawSprite('cfwind', animFrame('cfwind', w.phase, 14, false), w.x, w.y, 2, w.vx < 0);
  }

  // cullL/R/T/B stehen schon (ganz oben in render() gesetzt, für Boden-Chunks
  // und Dekale) — hier nur noch die Zeichenliste damit befüllen.
  drawCount = 0;
  // trees/decos entstehen zeilenweise und sind damit nach y sortiert: statt aller
  // Props (seit W-Groß rund 8000 Bäume/Felsen und 2000 Deko) nur das sichtbare
  // Band anfassen. Die binäre Suche ist der Grund, warum die Zahl wachsen durfte.
  for(let i = firstAtY(trees, cullT); i < trees.length && trees[i].y < cullB + BAUM_PAD; i++){
    const t = trees[i];
    if(t.x > cullL && t.x < cullR) pushDraw(t.y, DRAW_TREE, t);
  }
  for(let i = firstAtY(decos, cullT); i < decos.length && decos[i].y < cullB + BIG_PAD; i++){
    const d = decos[i];
    const p = d.big ? BIG_PAD : 0;   // Pilze/Gras behalten bit-identisch die alten Ränder
    if(d.y < cullB + p && d.x > cullL - p && d.x < cullR + p) pushDraw(d.y, DRAW_DECO, d);
  }
  // SZ3: die aufgegrabene Stelle im Steinfeld. Sie liegt flach auf dem Boden und
  // geht deshalb NICHT in die y-Sortierung: ein Loch, ueber dem der Spieler
  // steht, ist richtig herum, und ein sortiertes Loch waere ein Sortierfehler,
  // der nur bei einer bestimmten Blickrichtung auffiele.
  drawStopfen();
  if(currentLevel === 1){                               // Hoftiere, Dorf-Staffage, Kessel, Knöterich und Kammertüren, alle nur hier
    for(const c of critters) if(vis(c.x, c.y)) pushDraw(c.y, DRAW_CRITTER, c);
    for(const n of npcs) if(figHier(n.figur) && vis(n.x, n.y)) pushDraw(n.y, DRAW_NPC, n);
    if(vis(KESSEL.x, KESSEL.y)) pushDraw(KESSEL.y, DRAW_KESSEL, null);
    if(vis(KN_POS.x, KN_POS.y)) pushDraw(KN_POS.y, DRAW_ALTER, null);
    for(const t of kammerTueren) if(vis(t.x, t.y)) pushDraw(t.y, DRAW_KAMTUER, t);
  } else if(innen){                                     // IN1: Schwelle flach, Möbel und Leute y-sortiert
    drawInnenSchwelle();
    for(const o of innen.moebel) if(vis(o.x, o.y)) pushDraw(o.y, DRAW_INNEN, o);
    for(const n of npcs) if(figDa(n.figur) && vis(n.x, n.y)) pushDraw(n.y, DRAW_NPC, n);
  } else if(kammer){
    for(const p of kammer.props) if(vis(p.x, p.y)) pushDraw(p.y, DRAW_KAMOBJ, p);
  }
  for(const c of corpses) if(vis(c.x, c.y)) pushDraw(c.y - 1, DRAW_CORPSE, c);
  for(const m of monsters) if(!m.dead && vis(m.x, m.y)) pushDraw(m.y, DRAW_MON, m);
  pushDraw(player.y, DRAW_PLAYER, null);

  drawList.length = drawCount;
  drawList.sort(byY);
  for(const e of drawList){
    const o = e.o;
    switch(e.kind){
      case DRAW_TREE:    drawProp(o); break;
      case DRAW_DECO:
        // Schattenland: Pilz-Deko wird durch die leuchtende Pilzland-Variante ersetzt,
        // big-Decos (Gebäude, Windmühle) bekommen die Baum-Silhouetten-Tönung aus
        // drawProp — sonst steht das Dorf in Tagfarben mitten in der Horde (F64).
        // Hohes Gras bleibt unverändert. Mushrooms_Purple ist ein Props-Sheet
        // (4 Wuchsvarianten), keine Animation — fixes Frame je Prop, damit nicht
        // 4 verschiedene Pilzformen pro Sekunde durchflackern.
        if(currentLevel === 2 && !o.big && o.sheet !== 'cftallgrass'){
          drawSprite('cfmush_shadow', Math.floor(o.phase*0.4) % 4, o.x, o.y, o.scale);
        } else {
          drawSprite(o.sheet, animFrame(o.sheet, gameT + o.phase, o.big?9:4), o.x, o.y, o.scale, false,
                     (currentLevel === 2 && o.big) ? '#4a1866' : null, 0.72);
        }
        break;
      case DRAW_CRITTER: {
                         // G12: Das Kapybara hat statt Laufen einen Tauchgang.
                         // Ab- und Auftauchen laufen EINMAL (loop=false) und
                         // bleiben auf dem letzten Frame stehen, bis der Zustand
                         // weiterschaltet — sonst sähe man das Tier im Kreis
                         // tauchen, ohne je unten anzukommen.
                         if(o.kapy){ drawSprite(o.sheetIdle, animFrame(o.sheetIdle, gameT + o.phase, 6, !o.kapy.einmal),
                                                o.x, o.y+4, WELT_SC, o.flip); break; }
                         // Schatten nur, wo es Boden gibt. Eine Ente wirft keinen
                         // Schatten aufs Wasser, und ein Falter schon gar keinen
                         // in seiner eigenen Flughöhe.
                         if(o.lebensraum !== 'wasser' && o.lebensraum !== 'luft')
                           drawShadowEllipse(o.x, o.y+2, 13);   // G7: Schatten wächst mit dem Tier (8 -> 13)
                         const moving = !!(o.vx||o.vy);
                         const ckey = moving ? o.sheetWalk : o.sheetIdle;
                         drawSprite(ckey, animFrame(ckey, gameT + o.phase, moving ? 7 : 3), o.x, o.y+4, WELT_SC, o.flip); break; }
      case DRAW_NPC: { drawShadowEllipse(o.x, o.y+4, 9);   // G5: Dorf-Staffage, gleiches Muster wie DRAW_CRITTER
                      const nmoving = !!(o.vx||o.vy);
                      const nkey = nmoving ? o.sheetWalk : o.sheetIdle;
                      // W3: alle Dorffiguren im Held-Maßstab, Komposit wie Blatt.
                      // G10: ausser wer ein Monsterrig traegt — die Rigs haben
                      // eigene Zellmasse (orc_chief 32x32 gegen 64x64 beim
                      // Komposit) und brauchen ihren eigenen Faktor, sonst
                      // stuende die Figur halb so gross daneben.
                      const nsc = (o.figur && o.figur.rigSc) || NPC_SC;
                      drawSprite(nkey, animFrame(nkey, gameT + o.phase, nmoving ? 6 : 3), o.x, o.y, nsc, o.flip, o.tint, o.tintA);
                      if(o.key === 'bramsche') drawAnlage3(o.x + 14, o.y + 6);
                      // U3: Namensschild, entfernungsabhaengig eingeblendet.
                      // Nur vormerken, gezeichnet wird nach der Schleife (s. npcSchildFlush).
                      npcSchildMerken(o.x, o.y, o.figur.kurz, gespraech.npc === o);
                      // U3: Die Blase bleibt, aber nicht neben dem Fenster. Steht
                      // der Satz schon im Gespraechsfenster, waere sie dieselbe
                      // Zeile ein zweites Mal.
                      // SZ2: dieselbe Regel fuer die Dorffiguren, siehe drawAlter().
                      if(o.bubbleText1 && gameT < o.bubbleHideAt && gespraech.npc !== o && !szeneAktiv)
                        drawBubble(o.x, o.y, o.bubbleText1, o.bubbleText2);
                      break; }
      case DRAW_INNEN:   drawInnenMoebel(o); break;
      case DRAW_CORPSE:  drawCorpse(o); break;
      case DRAW_MON:     drawMon(o); break;
      case DRAW_KESSEL:  drawKessel(); break;
      case DRAW_ALTER:   drawAlter(); break;
      case DRAW_KAMOBJ:  drawKammerObj(o); break;
      case DRAW_KAMTUER: drawKammerTuer(o); break;
      default:           drawPlayer();
    }
  }
  npcSchildFlush();   // U3: alle Namensschilder auf einmal, ueber allem und ohne Ueberlappung

  // --- Touch: Zauber-Preview + Lock-Marker (World-Space) ---
  if(spellAim.active && spellAim.sp){
    const sp = spellAim.sp, w = spellAimWorld();
    ctx.save();
    ctx.globalAlpha = spellAim.cancel ? 0.15 : 0.55;       // Cancel dimmt Preview
    ctx.strokeStyle = sp.color; ctx.lineWidth = 2;
    if(sp.type === 'bolt'){
      ctx.setLineDash(DASH_6_6);
      ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(w.x, w.y); ctx.stroke();
      ctx.setLineDash(DASH_AUS);
      ctx.beginPath(); ctx.arc(w.x, w.y, 14, 0, Math.PI*2); ctx.stroke();       // Reticle
      ctx.beginPath(); ctx.moveTo(w.x-20, w.y); ctx.lineTo(w.x+20, w.y);
      ctx.moveTo(w.x, w.y-20); ctx.lineTo(w.x, w.y+20); ctx.stroke();
    } else if(sp.type === 'aoe_target'){
      ctx.setLineDash(DASH_6_6);
      ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(w.x, w.y); ctx.stroke();
      ctx.setLineDash(DASH_AUS);
      ctx.beginPath(); ctx.arc(w.x, w.y, sp.radius, 0, Math.PI*2); ctx.stroke();
      ctx.globalAlpha *= 0.3; ctx.fillStyle = sp.color;
      ctx.beginPath(); ctx.arc(w.x, w.y, sp.radius, 0, Math.PI*2); ctx.fill();
    } else {                                                // nova / slow_field / chain: statischer Ring um Spieler
      ctx.beginPath(); ctx.arc(player.x, player.y, spellReach(sp), 0, Math.PI*2); ctx.stroke();
    }
    ctx.restore();
  }
  if(lockAim.active){                                       // Fadenkreuz beim Lock-Drag
    ctx.save(); ctx.strokeStyle = '#ff5a5a'; ctx.lineWidth = 2; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(lockAim.wx, lockAim.wy, 16, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lockAim.wx-24, lockAim.wy); ctx.lineTo(lockAim.wx+24, lockAim.wy);
    ctx.moveTo(lockAim.wx, lockAim.wy-24); ctx.lineTo(lockAim.wx, lockAim.wy+24); ctx.stroke();
    ctx.restore();
  }
  if(lockedTarget && !lockedTarget.dead){                   // Marker über gelocktem Ziel
    const lt = lockedTarget;
    ctx.save(); ctx.textAlign = 'center';
    ctx.fillStyle = '#000'; ctx.font = '900 16px Courier New';
    ctx.fillText('▼', lt.x+1, lt.y - lt.r - 21);
    ctx.fillStyle = '#ff5a5a'; ctx.fillText('▼', lt.x, lt.y - lt.r - 22);
    ctx.strokeStyle = 'rgba(255,90,90,.8)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(lt.x, lt.y, lt.r + 6, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }

  for(const f of floaters){
    ctx.fillStyle = '#000'; ctx.font = f.big ? '900 18px Courier New' : 'bold 12px Courier New';
    ctx.fillText(f.txt, f.x+1, f.y+1); ctx.fillStyle = f.col; ctx.fillText(f.txt, f.x, f.y);
  }

  ctx.restore();
  // Virtueller Joystick, Screen-Space.
  //
  // U7: Bis hierher war der Ring UNSICHTBAR, solange kein Finger auf dem Glas
  // lag. Wer das Spiel zum ersten Mal auf einem Telefon oeffnete, sah unten
  // links nichts und musste raten, dass die ganze linke Bildhaelfte der
  // Steuerknueppel ist. Das steht so in der Dienstanweisung ("links gehen"),
  // aber eine Anweisung ist kein Knopf.
  //
  // Jetzt liegt dort dauerhaft ein blasser Ring in der Ruhelage — dieselbe
  // Rolle wie der aufgemalte Kreis unten links in jedem Vorbild. Er ist KEIN
  // Zielbereich, sondern ein Hinweis: der Griff bleibt frei, die linke Haelfte
  // nimmt den Finger weiterhin dort an, wo er landet. Das ist die bessere
  // Bedienung (der Daumen muss nichts treffen) und der Ring sagt trotzdem, wo
  // gemeint ist.
  if(touchMode && state === 'play'){
    ctx.save();
    if(joy.id === null){
      const h = joyRuhe();
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = '#e8d9a8'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(h.x, h.y, joy.R, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = '#e8d9a8';
      ctx.beginPath(); ctx.arc(h.x, h.y, 22, 0, Math.PI*2); ctx.fill();
      // Vier Sporne: sie machen aus dem Kreis ein Steuerkreuz und damit aus
      // einem Zierring einen Knopf.
      ctx.globalAlpha = 0.13; ctx.lineWidth = 2;
      for(let i = 0; i < 4; i++){
        const a = i * Math.PI/2;
        ctx.beginPath();
        ctx.moveTo(h.x + Math.cos(a)*(joy.R-13), h.y + Math.sin(a)*(joy.R-13));
        ctx.lineTo(h.x + Math.cos(a)*(joy.R-4),  h.y + Math.sin(a)*(joy.R-4));
        ctx.stroke();
      }
    } else {
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#e8d9a8'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(joy.baseX, joy.baseY, joy.R, 0, Math.PI*2); ctx.stroke();
      const jdx = joy.curX - joy.baseX, jdy = joy.curY - joy.baseY;
      const jlen = Math.sqrt(jdx*jdx + jdy*jdy) || 1, jcl = Math.min(jlen, joy.R);   // R6/F41
      ctx.fillStyle = '#c9a227';
      ctx.beginPath(); ctx.arc(joy.baseX + jdx/jlen*jcl, joy.baseY + jdy/jlen*jcl, 24, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
  // Minimap braucht keine 60 Hz — alle 4 Frames reicht optisch und spart spürbar.
  if((frameNo++ & 3) === 0) renderMinimap();
  updateHUD();
}

// Kessel: Topf aus Canvas-Primitiven plus vorhandenes Feuer-Sheet, kein neues Asset.
function drawKessel(){
  const x = KESSEL.x, y = KESSEL.y;
  drawSprite('fire1', animFrame('fire1', gameT, 10), x, y + 3, 1.5);
  drawShadowEllipse(x, y + 2, 15);
  ctx.save();
  ctx.strokeStyle = '#0d0a10'; ctx.lineWidth = 2; ctx.fillStyle = '#241c22';
  ctx.beginPath(); ctx.moveTo(x-15, y-15); ctx.quadraticCurveTo(x, y+8, x+15, y-15); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y-15, 15, 6, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#6aff8f';
  ctx.beginPath(); ctx.ellipse(x, y-15, 12, 4.2, 0, 0, Math.PI*2); ctx.fill();
  for(let i=0;i<3;i++){                              // Blubbern
    const t = (gameT*0.8 + i*0.37) % 1;
    ctx.globalAlpha = 1 - t;
    ctx.beginPath(); ctx.arc(x + Math.sin(i*2.1 + gameT)*7, y - 17 - t*14, 2 + t*1.6, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  const dx = player.x - x, dy = player.y - y;        // Hinweis nur in der Nähe (kein hypot)
  if(dx*dx + dy*dy < 10000){
    ctx.textAlign = 'center'; ctx.font = 'bold 11px Courier New';
    ctx.fillStyle = '#000';    ctx.fillText('Kessel [K]', x+1, y-33);
    ctx.fillStyle = '#f4d97a'; ctx.fillText('Kessel [K]', x, y-34);
  }
  ctx.restore();
}

// Phase 5: Amtsrat a. D. Knöterich, aus Bestand: cfbody_idle + fest gewähltes Haar,
// grau getönt über tintedSheet() (Cache aus drawPlayer()). Ausdrücklich kein
// ctx.filter, siehe die Kommentare bei drawPlayer()/drawMon() weiter unten.
// Trägt bewusst keine Rüstungs-Layer (Knöterich war schon vor G2 unbewaffnet/-gerüstet).
function drawBubble(x, y, text1, text2){
  if(!text1) return;
  ctx.save();
  ctx.textAlign = 'center'; ctx.font = BLASE_FONT;   // U3: waechst mit der Schriftstufe
  const by = y - 48;
  const w = Math.max(ctx.measureText(text1).width, ctx.measureText(text2 || '').width) + 16;
  const h = text2 ? 34 : 20;
  ctx.fillStyle = 'rgba(20,14,10,.85)'; ctx.strokeStyle = '#8a6d3b'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  if(ctx.roundRect) ctx.roundRect(x - w/2, by - h + 8, w, h, 6); else ctx.rect(x - w/2, by - h + 8, w, h);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f4e6c8';
  ctx.fillText(text1, x, by - (text2 ? 12 : 4));
  if(text2) ctx.fillText(text2, x, by + 2);
  ctx.restore();
}

function drawAlter(){
  const x = KN_POS.x, y = KN_POS.y;
  drawShadowEllipse(x, y + 2, 10);
  // G8: ein Blatt statt zwei Ebenen. Vorher wurden Körper und Haar hier einzeln
  // geblittet, während der Empfang dieselbe Figur als Komposit buk — zwei Wege
  // zu einem Aussehen, und nur einer davon konnte einen Anzug tragen. Solange
  // die Assets noch laden, ist das Blatt nicht da und drawSpriteAt() kehrt
  // still um, wie überall sonst auch.
  const key = SHEETS[EMPFANG_BLATT] ? EMPFANG_BLATT : 'cfbody_idle';
  const f = animFrame(key, gameT, 7);
  ctx.save();
  ctx.translate(x, y + 9);
  ctx.scale(PLAYER_SC * 0.92, PLAYER_SC * 0.92);
  drawSpriteAt(key, f, '#8a8a8a', 0.82);
  ctx.restore();

  // U3: Knoeterich bekommt dasselbe Schild wie die uebrigen Dorffiguren. Er
  // nennt seinen Namen ohnehin im ersten Satz des Spiels (knUpdateBubble),
  // und er ist die Figur, zu der man am haeufigsten zurueckkommt.
  // U6: der vierte Parameter ist "wird gerade angesprochen" und stand hier fest
  // auf false, weil Knoeterich kein Gespraech hatte. Jetzt hat er eins, und sein
  // Schild hebt sich waehrenddessen hervor wie das jeder Dorffigur.
  npcSchildMerken(x, y, KN_NAME_KURZ, gespraech.npc === knNpc);
  // SZ2: Waehrend einer Szene redet niemand dazwischen. Der Weltstopp friert
  // gameT ein, und eine Blase, die beim Beginn der Szene gerade stand, stuende
  // damit die ganze Szene lang weiter: sie lag im Bild ueber Knoeterichs
  // Namensschild, zwei Texte an derselben Stelle, keiner davon lesbar. Gefunden
  // im Bild, nicht im Guard. Nach der Szene laeuft die Uhr weiter und die Blase
  // geht von selbst aus, ihre Restzeit ist unberuehrt.
  // U6: dieselbe Regel wie bei den Dorffiguren (DRAW_NPC): steht der Satz schon
  // in der Tafel, waere die Blase daneben dieselbe Zeile ein zweites Mal.
  if(knBubble.visible && !szeneAktiv && gespraech.npc !== knNpc)
    drawBubble(x, y, knBubble.text1, knBubble.text2);
}

// W3: der Kater Anlage 3, kein Sprite, keine Kontextaktion — laut Kapitel 8
// stumm, "sie weckt ihn nicht". Reine liegende Form neben Bramsches Kachel.
function drawAnlage3(x, y){
  ctx.save();
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath(); ctx.ellipse(x, y, 7, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x-6, y-3, 3, 3, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawShadowEllipse(x, y, rx){
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(x, y, rx, rx*0.4, 0, 0, Math.PI*2); ctx.fill();
}

// Waffenklasse -> Hieb-Farben/Stil, für Sprite-Icon und Schwung-Effekt
const WEAPON_STYLE = {
  dagger:     {icon:'dagger',     col1:'#e8e8ff', col2:'#7ad6ff', width:2},
  sword:      {icon:'sword',      col1:'#bfe3ff', col2:'#5c86ff', width:3},
  doubleaxe:  {icon:'doubleaxe',  col1:'#ffcf6a', col2:'#ff6a2a', width:5},
};

// R6/F73: Der Klingen-Verlauf des Schwerthiebs hing an Reichweite und Waffenfarben
// und wurde trotzdem pro Frame neu gebaut. Gradient-Koordinaten gelten im Nutzerraum
// zum Zeitpunkt des Zeichnens, der Cache übersteht die Kamera- und Drehtransformation
// des Hiebs also unverändert.
let khGrad = null, khRange = -1, khC1 = '', khC2 = '';
function klingenVerlauf(range, col1, col2){
  if(khGrad && khRange === range && khC1 === col1 && khC2 === col2) return khGrad;
  const g = ctx.createLinearGradient(0, -range, 0, range);
  g.addColorStop(0, col2); g.addColorStop(0.5, col1); g.addColorStop(1, col2);
  khGrad = g; khRange = range; khC1 = col1; khC2 = col2;
  return g;
}

function drawPlayer(){
  drawShadowEllipse(player.x, player.y + 12, 12);

  // Held: Komposit aus bakeHeroSheet() (Legs/Feet/Body/Chest/Haar/Hände liegen
  // dort schon übereinandergezeichnet). Rüstung/Stiefel stecken jetzt sichtbar
  // im Sprite selbst statt im alten Regenbogen-Aura-Glow — der Glow-Code ist
  // mit G2 ersatzlos raus (Aufgabenstellung Phase G2).
  const a = player.anim;
  const bi = BAKED_HERO_ANIM && BAKED_HERO_ANIM[a];
  const fps = a==='idle' ? 7 : (a==='attack' ? 22 : a==='cast' ? 20 : a==='run' ? 12 : 10);
  const loop = !(a==='attack' || a==='cast' || a==='hurt' || a==='death');
  if(bi){
    const raw = Math.floor(player.animT * fps);
    const localF = loop ? (raw % bi.n) : Math.min(raw, bi.n - 1);
    const f = bi.offset + localF;
    const hurt = player.hurtT > 0;

    ctx.save();
    ctx.translate(player.x, player.y + 11);
    ctx.scale(PLAYER_SC * (player.faceLeft ? -1 : 1), PLAYER_SC);
    drawSpriteAt('hero_baked', f, hurt ? '#ffb060' : null, 0.8);   // Treffer-Aufblitzen ohne ctx.filter
    ctx.restore();
  }

  // Schwebende Waffe neben dem Helden — echtes Klingen-Sprite (Iron_Sword) statt
  // Emoji-Text, per Tint nach Waffengattung eingefärbt. Ersatzregel: das Pack
  // hat kein eigenes Rig fürs Tools-Layer (inkompatibles Kleinraster, siehe
  // CF_HERO_ANIMS-Kommentar weiter oben), alle drei Waffengattungen teilen
  // sich deshalb dieselbe Klinge. Zwei Qualitätsstufen derselben Gattung sehen
  // bei reiner Mode-Farbe gleich aus (z.B. Amtsklinge/Dienstschwert beide
  // 'sword') — Größe und Glanz skalieren deshalb zusätzlich mit der Stufe.
  const w = player.equip.weapon;
  if(w){
    const style = WEAPON_STYLE[w.base.mode] || WEAPON_STYLE.sword;
    const wTier = clamp(w.base.tier||0, 0, 4);
    const side = player.faceLeft ? -1 : 1;
    const wx = player.x + side*20, wy = player.y - 6 + Math.sin(gameT*3.4)*3;
    ctx.save(); ctx.translate(wx, wy); ctx.rotate(Math.sin(gameT*2)*0.25 + side*0.3);
    ctx.shadowColor = style.col2; ctx.shadowBlur = 6 + wTier*2.5;
    drawSprite('cftool_sword', 0, 0, 0, 0.38 + wTier*0.045, side < 0, style.col2, 0.75);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // Schwebendes Schild-Icon — das Pack liefert kein Schild-Rig für den Helden
  // (Schilde kommen nur als Bodenrequisit in den Dungeon-Sets vor), das Icon
  // bleibt darum schwebend wie zuvor die Waffe: Größe/Glanz zeigen die Stufe.
  const sh = player.equip.shield;
  if(sh){
    const tier = clamp(sh.base.tier||0, 0, 4);
    const col = tier>=3 ? '#f4d97a' : tier===2 ? '#dfe6f0' : '#c98a4a';
    const side = player.faceLeft ? 1 : -1;
    const sx = player.x + side*20, sy = player.y - 4 + Math.sin(gameT*2.6 + 1.5)*2;
    ctx.save(); ctx.translate(sx, sy);
    ctx.shadowColor = col; ctx.shadowBlur = 5 + tier*2;
    ctx.textAlign = 'center'; ctx.font = SCHILD_FONT[tier];   // R6/F73: Fontstring nicht pro Frame bauen
    ctx.fillText(sh.base.icon || '🛡️', 0, 5);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // Hieb-Effekt passend zur Waffengattung
  if(player.swingT > 0){
    const style = WEAPON_STYLE[player.attackMode] || WEAPON_STYLE.sword;
    const p = player.swingT / 0.25; // 1 -> 0
    ctx.save(); ctx.translate(player.x, player.y); ctx.rotate(player.swingDir);
    ctx.globalAlpha = Math.min(1, p*1.6);

    if(player.attackMode === 'dagger'){
      // zwei schnelle, dünne Schlitze
      ctx.strokeStyle = style.col1; ctx.lineWidth = style.width; ctx.lineCap = 'round';
      for(const off of DOLCH_OFFS){
        ctx.beginPath(); ctx.arc(0, 0, derived.range*0.85, off-0.5, off+0.5); ctx.stroke();
      }
    } else if(player.attackMode === 'doubleaxe'){
      // wuchtiger, breiter Bogen + Schockring. R6/F73: Deckkraft über globalAlpha
      // statt über einen rgba()-String, der sonst pro Frame neu entstünde.
      const ga = ctx.globalAlpha;
      ctx.fillStyle = '#ff6a2a'; ctx.globalAlpha = ga * 0.28 * p;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0, 0, derived.range, -1.7, 1.7); ctx.fill();
      ctx.globalAlpha = ga;
      ctx.strokeStyle = style.col2; ctx.lineWidth = style.width;
      ctx.beginPath(); ctx.arc(0, 0, derived.range, -1.7, 1.7); ctx.stroke();
      ctx.strokeStyle = style.col1; ctx.lineWidth = 1.5; ctx.globalAlpha *= 0.7;
      ctx.beginPath(); ctx.arc(0, 0, derived.range*(1.05-p*0.2), -1.7, 1.7); ctx.stroke();
    } else {
      // Schwert: Klingen-Bogen mit hellem Kern + Nachzieh-Trail
      ctx.strokeStyle = klingenVerlauf(derived.range, style.col1, style.col2);
      ctx.lineWidth = style.width; ctx.lineCap='round';
      ctx.beginPath(); ctx.arc(0, 0, derived.range, -1.55, 1.55); ctx.stroke();
      const ga = ctx.globalAlpha;                                  // R6/F73: kein rgba()-String pro Frame
      ctx.strokeStyle = '#ffffff'; ctx.globalAlpha = ga * 0.5 * p; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, derived.range*0.92, -1.4, 1.4); ctx.stroke();
      ctx.globalAlpha = ga;
    }
    ctx.globalAlpha = 1.0;
    ctx.restore();
  }
}

// Bäume / Felsen — feste Hindernisse, y-sortiert über dem Boden
// Bäume: Big_Oak/Big_Birch/Big_Spruce sind 3-Spalten-Sheets (Spalte 0 = Stumpf,
// übersprungen), kein Sway-Frame im Sheet — deshalb fester Frame 1/2 statt
// animFrame-Sway (Nutzerentscheidung, weicht bewusst vom Prompt-Wunsch ab,
// s. Umsetzungsnotizen G4). Rock_1_Anim/Mushrooms_Purple sind Requisiten-
// Varianten, keine echten Animationen — ebenfalls fester statt zeitbasierter Frame.
// G7: alle Skalen hier laufen jetzt über WELT_SC. Bei den Kammer-Requisiten war
// das die letzte Uneinheitlichkeit aus G1 — Tore, Druckplatten und Treppen wurden
// dort schon mit 2 gezeichnet, Pfeiler (gar keine Angabe, also 1), Topf (1,6),
// Spinnwebe (1,4), Kiste (1,5) und Truhe (1,3) nicht. Ein Pfeiler ist im Blatt
// 16x48 und war damit eine halbe Kachel breit; jetzt ist er eine Kachel breit und
// drei hoch, also ein Pfeiler.
// Der Baum-Versatz ist mitgewachsen: die Blätter sind 80 Pixel hoch, die
// Stammunterkante liegt 8 Pixel über dem Blattrand. Bei 1,05 fing +4 das fast
// auf, bei WELT_SC sind es 16 Pixel Luft — der Baum schwebte sonst eine halbe
// Kachel über seiner eigenen Kachel. 14 setzt ihn wieder wie vorher knapp in die
// Kachel hinein (8*WELT_SC - 14 = 2 Pixel über der Kachelunterkante).
const BAUM_DY = 14;
function drawProp(t){
  if(t.kt === 'pillar'){ drawSprite(kammer.dkPillar, t.variant, t.x, t.y, WELT_SC); return; }
  if(t.kt === 'pot'){ drawShadowEllipse(t.x, t.y + 3, 10); drawSprite('dun_pot', 0, t.x, t.y, WELT_SC); return; }
  if(t.kt === 'cobweb'){ drawSprite('dun_cobweb', 0, t.x, t.y, WELT_SC); return; }
  if(currentLevel === 2){
    // Schattenland: einheitliche dunkle Baumsilhouette, Art spielt keine Rolle
    // (identisch zum Vorgehen vor G4, nur der Sheet-Key ist neu).
    drawSprite('cftree_oak', t.variant ? 2 : 1, t.x, t.y+BAUM_DY, WELT_SC, false, '#4a1866', 0.72);
    return;
  }
  if(t.type === G_ROCK){
    const ty = t.y / TS;
    drawShadowEllipse(t.x, t.y, 11);
    // Felsen nehmen die Farbe ihres Bandes an: Sandstein in der Wüste, Reif im
    // Schnee. Kammerwände bringen ihre Färbung als t.tint selbst mit.
    // ty ist der Fußpunkt (t.y/TS, mit dem +TS-2-Versatz gebrochen) und liegt an der
    // Bandgrenze knapp über dem ganzzahligen Kachelwert — deshalb hier bewusst gegen
    // SAND_Y0-1/SNOW_Y1+1 statt gegen biomeAtT(), sonst kippt die letzte Zeile jedes
    // Bands beim Runden auf die falsche Farbe (unverändertes Verhalten von vorher).
    // Monsterkatalog M1: fünf Bänder statt drei, deshalb eine kleine Tabelle
    // statt der zwei Schwellen. ty ist weiterhin der gebrochene Fußpunkt, der
    // Zugriff rundet ihn selbst, dieselbe Absicht wie vorher, nur mit Namen.
    const tint = t.tint || FELS_TINT[biomeAtT(ty)] || null;
    const rf = Math.floor(t.phase) % 8;
    drawSprite('cfrock', rf, t.x, t.y+2, WELT_SC, (t.phase|0) & 1, tint, t.tint ? 0.66 : 0.5);
    return;
  }
  if(t.type === G_ICE_TREE){ drawSprite('cftree_spruce', t.variant ? 2 : 1, t.x, t.y+BAUM_DY, WELT_SC, false, '#cfe9ff', 0.5); return; }
  if(t.type === G_CACTUS){ drawSprite('cfvolcplant', t.sp, t.x, t.y+2, WELT_SC); return; }
  drawSprite(t.sp ? 'cftree_birch' : 'cftree_oak', t.variant ? 2 : 1, t.x, t.y+BAUM_DY, WELT_SC);
}

function drawCorpse(c){
  const d = c.def, sc = d.sc || 1.5, psc = d.psc || 1;
  const fade = Math.min(1, Math.max(0, (c.dur - c.t) / 1.2));
  ctx.save();
  ctx.globalAlpha = (d.alpha || 1) * fade;
  ctx.translate(c.x, c.y + d.r*0.7);
  ctx.scale(sc * psc * (d.scx||1) * (c.flip ? -1 : 1), sc * psc);
  drawSpriteAt(c.key, animFrame(c.key, c.t, d.deathFps || 11, false), d.tint, d.tintA);
  ctx.restore();
}

const SIEGEL_STRICH = [4, 4];
// R6/F73: Fontstrings sind Konstanten, keine pro Frame gebauten Strings.
// U3: aus const wurde let, und die Zahl darin kommt aus SCHRIFT_GRUND mal der
// gewaehlten Stufe. Gebaut wird trotzdem nicht pro Frame, sondern einmal je
// Stufenwechsel in schriftAnwenden() — die Regel bleibt, nur ihr Wert nicht.
const SCHRIFT_GRUND = {name:12, elite:14, art:10, npc:13, blase:13};
let NAME_FONT = 'bold 12px Courier New', NAME_FONT_ELITE = '900 14px Courier New',
    NAME_FONT_ART = 'bold 10px Courier New', NAME_FONT_NPC = 'bold 13px Courier New',
    BLASE_FONT = 'bold 13px Courier New';
// Sichtweite der Namensschilder, quadriert (kein hypot im Zeichenpfad).
const NAME_SICHT_Q = 210*210;


// === U3: Namensschilder ueber den Dorffiguren ==============================
// Die Monster haben ihre seit M2 (drawMon unten), die Nachbarn nicht. Elf
// Figuren stehen im Dorf, jede mit Namen und Titel in DORF_FIGUREN, und ueber
// keinem Kopf stand er. Wer wissen wollte, wen er da anspricht, musste ihn
// ansprechen.
//
// Nicht dauerhaft, wie erbeten und wie im Genre ueblich: das Schild blendet
// sich mit der Entfernung ein und wieder aus. Bis NAH voll, zwischen NAH und
// FERN linear heruntergezogen, dahinter gar nicht. Ein harter Umschlag laesst
// Schilder aufpoppen, sobald man einen Schritt macht; das Dorf ist eng
// bebaut, und vierzehn davon gleichzeitig waeren ein Kataster, kein Dorf.
//
// Der Deckel: kurz statt name. 'Wirt Bruno Fass, Gasthaus "Zum Letzten
// Stempel"' ist der Eintrag im Personalverzeichnis, kein Schild. Der volle
// Name steht im Gespraechsfenster, dort ist Platz dafuer.
const NPC_NAME_NAH = 120, NPC_NAME_FERN = 200;
const NPC_NAME_FERN_Q = NPC_NAME_FERN * NPC_NAME_FERN;
// Kopfhoehe: das Blatt ist 64px hoch, die Fusslinie liegt auf CF_ANCHOR.ay
// (40), die Figur beginnt bei y=8 — also 32 Quellpixel ueber dem Anker, mal
// NPC_SC. Plus 8px Luft, damit die Schrift den Scheitel nicht beruehrt.
const NPC_NAME_HOCH = 32 * NPC_SC + 8;

// Liefert die Deckkraft des Schildes zu einer Weltposition, 0 wenn keins.
function npcNameAlpha(x, y){
  const q = sqDist(player.x, player.y, x, y);
  if(q >= NPC_NAME_FERN_Q) return 0;
  const d = Math.sqrt(q);
  return d <= NPC_NAME_NAH ? 1 : 1 - (d - NPC_NAME_NAH) / (NPC_NAME_FERN - NPC_NAME_NAH);
}

// Die Schilder werden gesammelt und erst nach der Zeichenschleife ausgegeben.
// Zwei Gruende, beide gemessen und nicht vermutet:
//
//   1. Ueberlappung. Lott, Pahl und Pommer sitzen nebeneinander auf der Bank am
//      Dorfplatz. Nebeneinander gezeichnet ergaben ihre drei Schilder
//      "Herr LotHerr PahHerr Pommer" — drei Namen, kein lesbarer. Der Flush
//      unten legt jedes Schild auf die erste freie Zeile ueber dem Kopf.
//   2. Reihenfolge. Die Schleife sortiert nach y, ein Schild aus einer frueheren
//      Zeile lag also unter dem naechsten Haus. Am Ende gezeichnet liegen alle
//      Schilder ueber allem.
//
// Kein Neubau pro Frame: das Feld wird geleert und wieder gefuellt, nicht
// ersetzt (Regressionsregel 10), und laenger als die Figurentabelle plus
// Knoeterich wird es nie.
const npcSchilder = [];
function npcSchildMerken(x, y, text, imGespraech){
  if(!text) return;
  const a = npcNameAlpha(x, y);
  if(a <= 0.02) return;
  npcSchilder.push({x, y, text, a, hell: imGespraech});
}

// Das Schild selbst. Gleiche Lesart wie bei den Monstern (schwarzer Versatz
// unter heller Schrift, kein Kasten), nur heller und groesser: ein Nachbar ist
// keine Vorgangsart. Wer gerade im Gespraech ist, bekommt Gold statt Creme —
// damit bei zwei Figuren nebeneinander zu sehen ist, welche gerade redet.
// Hoehe einer Ausweichzeile. Kein fester Wert: sie muss mit der Schrift
// wachsen, sonst ueberlappen die ausgewichenen Schilder auf Stufe 2 wieder.
// Gesetzt von schriftAnwenden() gleich unten, zusammen mit NAME_FONT_NPC.
let NPC_SCHILD_ZEILE = 15;
function npcSchildFlush(){
  if(!npcSchilder.length) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = NAME_FONT_NPC;
  // Der Naechste zuerst: seine Deckkraft ist die hoechste, und er bekommt
  // deshalb die unterste Zeile. Wer weiter weg steht, weicht nach oben aus.
  npcSchilder.sort((p, q) => q.a - p.a);
  const belegt = [];              // {l, r, zeile} der schon gesetzten Schilder
  for(const s of npcSchilder){
    const halb = ctx.measureText(s.text).width / 2 + 4;
    const l = s.x - halb, r = s.x + halb;
    let zeile = 0;
    while(belegt.some(b => b.zeile === zeile && b.l < r && l < b.r)) zeile++;
    belegt.push({l, r, zeile});
    const ty = s.y - NPC_NAME_HOCH - zeile * NPC_SCHILD_ZEILE;
    ctx.globalAlpha = s.a;
    ctx.fillStyle = '#000';                        ctx.fillText(s.text, s.x + 1, ty + 1);
    ctx.fillStyle = s.hell ? '#f4d97a' : '#f4e6c8'; ctx.fillText(s.text, s.x, ty);
  }
  ctx.restore();
  npcSchilder.length = 0;
}

// ===========================================================================
//  U3: Die Schriftstufe
//
//  Drei Stufen, ein Faktor. Der Faktor steht als --fs auf :root und multipliziert
//  jede der 176 font-size-Angaben dieser Datei (s. den Kommentar oben im
//  <style>); die Canvas-Schriften, bei denen es ums Lesen geht, baut
//  schriftAnwenden() aus SCHRIFT_GRUND einmal je Stufenwechsel neu — nicht pro
//  Frame, R6/F73 gilt weiter.
//
//  Voreingestellt ist Stufe 1, nicht 0. Die Bitte lautete, die Schrift duerfe
//  groesser sein; eine Voreinstellung, die man erst suchen muss, waere keine
//  Antwort darauf. Wer es enger mag, stellt im Inventar unter SCHRIFT auf
//  "Normal".
//
//  "Normal" heisst dabei genau: jede CSS-Angabe steht wieder auf der Zahl, die
//  vor U3 dort stand. Fuer die Canvas-Schriften stimmt das NICHT, und zwar
//  absichtlich: NAME_FONT stand auf 10px, NAME_FONT_ART auf 9px, die
//  Sprechblase auf 11px — das war die kleinste Schrift im ganzen Spiel, in der
//  Welt gezeichnet und nicht in einem Menue. Ihre Grundzahlen in SCHRIFT_GRUND
//  sind einmalig um zwei Pixel angehoben; der Regler multipliziert von dort.
//
//  Der Wert liegt in localStorage neben sda_targetPriority und nicht im
//  Spielstand: er beschreibt den Bildschirm, an dem gespielt wird, nicht die
//  Laufbahn der Person des Tages. Ein neuer Dienstantritt aendert nichts daran.
// ===========================================================================
const SCHRIFT_STUFEN = [1, 1.2, 1.45];
const SCHRIFT_KEY = 'sda_schrift';
let schriftStufe = 1;

function schriftAnwenden(){
  const f = SCHRIFT_STUFEN[schriftStufe] || 1;
  document.documentElement.style.setProperty('--fs', String(f));
  // Auf halbe Pixel gerundet: Courier New rastert bei krummen Groessen sichtbar
  // unruhig, und diese Schriften stehen in der Welt, nicht im Menue.
  const px = v => (Math.round(v * f * 2) / 2);
  NAME_FONT       = `bold ${px(SCHRIFT_GRUND.name)}px Courier New`;
  NAME_FONT_ELITE = `900 ${px(SCHRIFT_GRUND.elite)}px Courier New`;
  NAME_FONT_ART   = `bold ${px(SCHRIFT_GRUND.art)}px Courier New`;
  NAME_FONT_NPC   = `bold ${px(SCHRIFT_GRUND.npc)}px Courier New`;
  BLASE_FONT      = `bold ${px(SCHRIFT_GRUND.blase)}px Courier New`;
  NPC_SCHILD_ZEILE = px(SCHRIFT_GRUND.npc) + 2;
  document.querySelectorAll('.schriftBtn').forEach(b => b.classList.toggle('on', +b.dataset.v === schriftStufe));
}

try{
  const v = parseInt(localStorage.getItem(SCHRIFT_KEY), 10);
  if(v >= 0 && v < SCHRIFT_STUFEN.length) schriftStufe = v;
}catch(_){}

function schriftSetzen(i){
  if(!(i >= 0 && i < SCHRIFT_STUFEN.length)) return;
  schriftStufe = i;
  try{ localStorage.setItem(SCHRIFT_KEY, String(i)); }catch(_){}
  schriftAnwenden();
}
document.querySelectorAll('.schriftBtn').forEach(b => {
  b.onclick = () => schriftSetzen(+b.dataset.v);
});
schriftAnwenden();

// Zusage der Stufe 0: sie ist der Stand vor U3, Pixel fuer Pixel. Wer die
// Tabelle spaeter anfasst, soll das hier gemeldet bekommen und nicht im Bild
// suchen muessen. Zweite Zusage: die Stufen steigen, sonst waere "Groesser"
// eine Luege auf dem Knopf.
function schriftAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('U3 Schrift:', m, ...r); };
  if(SCHRIFT_STUFEN[0] !== 1) fehler('Stufe "Normal" ist nicht 1.0', SCHRIFT_STUFEN[0]);
  if(!SCHRIFT_STUFEN.every((v, i) => v > 0 && (i === 0 || v > SCHRIFT_STUFEN[i-1])))
    fehler('Stufen steigen nicht', SCHRIFT_STUFEN);
  if(!(schriftStufe >= 0 && schriftStufe < SCHRIFT_STUFEN.length)) fehler('gewaehlte Stufe liegt daneben', schriftStufe);
  const gesetzt = document.documentElement.style.getPropertyValue('--fs');
  if(parseFloat(gesetzt) !== SCHRIFT_STUFEN[schriftStufe]) fehler('--fs steht nicht auf der gewaehlten Stufe', gesetzt);
  if(ok) console.log(`U3 Schrift: ${SCHRIFT_STUFEN.length} Stufen, gewaehlt ${schriftStufe} (Faktor ${SCHRIFT_STUFEN[schriftStufe]}), in Ordnung.`);
}
schriftAssert();

function drawMon(m){
  const d = m.def, sc = (d.sc || 1.5) * (m.elite ? ELITE.sc : 1), psc = d.psc || 1;   // psc: G3-Pixelskala des CF-Rigs, s. MONDEF-Kommentar
  drawShadowEllipse(m.x, m.y + m.r*0.7, m.r*0.9);
  // M2: der Sonderprüfer trägt einen eigenen Bodenring in einer Farbe, die
  // sonst nirgends vorkommt. Zusammen mit der anderthalbfachen Größe ist er
  // damit auf Bildschirmbreite als "der da nicht" zu erkennen, bevor er
  // überhaupt aggriert.
  if(m.elite){
    ctx.save();
    ctx.globalAlpha = 0.45 + Math.sin(gameT*4)*0.18; ctx.strokeStyle = ELITE.glow; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(m.x, m.y + m.r*0.7, m.r+11, (m.r+11)*0.45, 0, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }
  // Kammer-Sonderregel wird gezeigt, nicht erklärt: farbiger Ring = nur dieser
  // Zweig wirkt, Schild vor dem Gesicht = von vorn prallt alles ab.
  if(m.regel){
    ctx.save();
    if(m.regel.typ === 'zweig'){
      ctx.strokeStyle = KAM_ZWEIG_COL[m.regel.zweig]; ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5 + Math.sin(gameT*3)*0.2;
      ctx.beginPath(); ctx.ellipse(m.x, m.y + m.r*0.7, m.r+7, (m.r+7)*0.45, 0, 0, Math.PI*2); ctx.stroke();
    } else {
      ctx.strokeStyle = '#ff9f4a'; ctx.lineWidth = 3; ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r + 9, m.faceAng - 0.85, m.faceAng + 0.85);
      ctx.stroke();
    }
    ctx.restore();
  }
  // === Monsterkatalog M1: Zustände zeigen, nicht erklären ==================
  // Vorwarnung: ein Ring über dem Kopf, der sich füllt. Bei Flächenmustern
  // zusätzlich die Fläche selbst, damit Abstandhalten eine Entscheidung mit
  // sichtbarer Grundlage ist statt Raterei.
  if(m.teleT > 0){
    const mus = d.muster && d.muster[m.teleMus];
    const warn = ((mus ? mus.warn : (d.warn || 400)) / 1000) || 0.4;
    const p = clamp(1 - m.teleT / warn, 0, 1);
    const art = mus ? mus.art : 'nah';
    const col = art === 'stuetz' ? '#6aff8f'
              : art === 'fern'   ? '#7ad6ff'
              : (art === 'zu' || art === 'mantel') ? '#c77dff' : '#ff9f4a';
    ctx.save();
    if(art === 'ring' || art === 'kegel'){
      const reich = (mus && mus.reich) || d.atkRange;
      ctx.globalAlpha = 0.14 + p * 0.20; ctx.fillStyle = col;
      ctx.beginPath();
      if(art === 'ring') ctx.ellipse(m.x, m.y + m.r*0.6, reich, reich*0.55, 0, 0, Math.PI*2);
      else {
        ctx.moveTo(m.x, m.y + m.r*0.6);
        ctx.ellipse(m.x, m.y + m.r*0.6, reich, reich*0.55, 0, m.teleAng - 0.8, m.teleAng + 0.8);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 0.9; ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(m.x, m.y - m.r - 18, 7, -Math.PI/2, -Math.PI/2 + p * Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  // Offenes Fenster: der Moment, auf den ein A4-Kampf hinausläuft. Gelber Ring
  // am Boden, so lange er offen steht.
  if(m.offenT > 0){
    ctx.save();
    ctx.globalAlpha = 0.55 + Math.sin(gameT*9)*0.2; ctx.strokeStyle = '#f4d97a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(m.x, m.y + m.r*0.7, m.r+9, (m.r+9)*0.45, 0, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }
  // M2: zauberfeste Gegner tragen ein Siegel als ruhigen weissen Ring. Es
  // steht dauerhaft da, nicht erst nach dem ersten wirkungslosen Zauber: der
  // Spieler soll die Entscheidung VOR dem Mana treffen koennen.
  if(d.zauberfest){
    ctx.save();
    ctx.globalAlpha = 0.30 + Math.sin(gameT*2)*0.08; ctx.strokeStyle = '#e9e0d0'; ctx.lineWidth = 2;
    ctx.setLineDash(SIEGEL_STRICH);        // vom restore() unten mit zurueckgesetzt
    ctx.beginPath(); ctx.ellipse(m.x, m.y + m.r*0.7, m.r+6, (m.r+6)*0.45, 0, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }
  // Aktenmantel und Buff: violettes bzw. oranges Flimmern am Boden.
  if(m.mantelT > 0 || m.buffT > 0){
    ctx.save();
    ctx.globalAlpha = 0.4; ctx.strokeStyle = m.mantelT > 0 ? '#c77dff' : '#ff9f4a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(m.x, m.y + m.r*0.7, m.r+5, (m.r+5)*0.45, 0, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }
  const bob = d.fly ? Math.sin(gameT*3.5 + m.bobPhase) * 4 - 4 : 0;
  const key = monAnim(d, m.anim);
  const fps = m.anim==='idle' ? 7 : (m.anim==='attack' ? 16 : m.anim==='cast' ? 20 : m.anim==='run' ? 12 : 10);
  const loop = !(m.anim==='attack' || m.anim==='cast' || m.anim==='hurt');

  ctx.save();
  ctx.translate(m.x, m.y + m.r*0.7 + bob);
  ctx.scale(sc * psc * (d.scx||1) * (m.facingLeft ? -1 : 1), sc * psc);
  // Verwehte (unverwundbar) und lauernde Gegner sind absichtlich schlecht zu
  // sehen. Beim Lauernden ist genau das der Hinterhalt, beim Verwehten die Ansage,
  // dass Schlagen jetzt nichts bringt.
  let sichtA = d.alpha || 1;
  if(m.zuT > 0) sichtA *= 0.35;
  else if(!m.aggro && d.hinterhalt) sichtA *= 0.5;
  if(sichtA !== 1) ctx.globalAlpha = sichtA;
  if(m.elite){ ctx.shadowColor = ELITE.glow; ctx.shadowBlur = 26; }
  else if(d.glow){ ctx.shadowColor = d.glow; ctx.shadowBlur = 20; }
  // Trefferblitz als gecachte weiße Tint-Kopie statt ctx.filter — der Filterpfad
  // kostet pro Draw ein eigenes Compositing und trifft bei Cleave dutzende Mobs.
  if(m.flash > 0) drawSpriteAt(key, animFrame(key, m.animT, fps, loop), '#ffffff', 0.72);
  else            drawSpriteAt(key, animFrame(key, m.animT, fps, loop), d.tint, d.tintA);
  ctx.restore();

  if(d.boss){   // Boss lodert
    for(let i=0;i<4;i++)
      drawSprite('fire2', animFrame('fire2', gameT*1.5 + i*0.27, 11),
                 m.x + (i-1.5)*30, m.y + m.r*0.8, 5, i&1, d.glow, 0.55);
  }
  if(m.alertT > 0)   // "!" beim Entdecken des Spielers
    drawSprite('alert', 0, m.x, m.y - m.r - 14 - (0.9-m.alertT)*6, 1.6);

  if(m.hp < m.maxHp && !m.def.boss && !CFX.blind){   // Fluch 'Aktenblindheit'
    ctx.fillStyle = '#1a0505'; ctx.fillRect(m.x - 12, m.y - m.r - 12, 24, 4);
    ctx.fillStyle = currentLevel===2 ? '#a855f7' : '#ff3333'; ctx.fillRect(m.x - 12, m.y - m.r - 12, (m.hp/m.maxHp)*24, 4);
  }

  // === M2: Namensschilder ==================================================
  // Bis hierher trug im ganzen Spiel nur der Boss einen sichtbaren Namen, und
  // der stand im HUD. Alle 21 anderen Vorgangsarten hatten zwar seit jeher ein
  // name-Feld in MONDEF, es wurde nur nie gezeichnet. Jetzt steht der Name über
  // dem Kopf — beim Sonderprüfer sein eigener, darunter die Vorgangsart, denn
  // erst beides zusammen sagt, was da steht und was es von einem will.
  // Angezeigt nur in Ruf- oder Kampfnähe: 600 Monster auf der Karte, aber nie
  // mehr als eine Handvoll Schilder gleichzeitig im Bild.
  if(!d.boss && !CFX.blind && (m.elite || m.aggro || m.teleT > 0 ||
     sqDist(player.x, player.y, m.x, m.y) < NAME_SICHT_Q)){
    const y = m.y - m.r - (m.hp < m.maxHp ? 18 : 12);
    ctx.save();
    ctx.textAlign = 'center';
    if(m.elite){
      ctx.font = NAME_FONT_ELITE;
      ctx.fillStyle = '#000';        ctx.fillText(m.elite, m.x+1, y-9);
      ctx.fillStyle = ELITE.glow;    ctx.fillText(m.elite, m.x, y-10);
      ctx.font = NAME_FONT_ART;
      ctx.fillStyle = '#000';        ctx.fillText(d.art, m.x+1, y+1);
      ctx.fillStyle = '#c9b98a';     ctx.fillText(d.art, m.x, y);
    } else {
      ctx.font = NAME_FONT;
      ctx.fillStyle = '#000';        ctx.fillText(d.name, m.x+1, y+1);
      ctx.fillStyle = '#c9b98a';     ctx.fillText(d.name, m.x, y);
    }
    ctx.restore();
  }
}

const ULT_SPELL = SPELLS.find(s => s.ultimate);
// Der Tooltip eines Spruchs ändert sich nie. Einmal gebaut, danach vergleicht der
// Dirty-Check aus setAttr denselben String — sonst entstünde er pro Frame neu (R6/F29).
const spellTitel = sp => sp._titel || (sp._titel = `${sp.name} (E) · ${sp.mana} Mana`);
const ULT_TITEL = `${ULT_SPELL.name} (R) · ${ULT_SPELL.mana} Mana`;
// Z2: Schloss-Texte einmal gebaut, updateHUD() vergleicht per Dirty-Check.
const ZAUBER_SCHLOSS = `<i class="ico ico-sperre">🔒</i> <span class="bl" style="font-size:calc(9px * var(--fs))">ab St. ${ZAUBER_AB_STUFE}</span>`;
const ZAUBER_SCHLOSS_TITEL = `Zauberbefugnis ab Stufe ${ZAUBER_AB_STUFE}`;

// Segmente der Leisten: eins zu Beginn, ab jeder vollen Stufenschwelle eins
// dazu, bei fünf ist Schluss. Leben zählt in Fünfer-, Mana in Siebenerschritten.
// Bis U7 gab es sie nur auf dem Handy (senkrechte Röhren), seither überall:
// eine Kerbe pro Segment sagt, wie viel ein Schlag von der Leiste nimmt, und
// das ist auf einem Schirm so nützlich wie auf einem Telefon.
const HP_SEG_STUFE = 5, MANA_SEG_STUFE = 7, SEG_MAX = 5;
const segmentZahl = (schritt)=> Math.min(SEG_MAX, 1 + Math.floor(player.level / schritt));

function updateHUD(){
  // U7: Leben und Mana laufen waagerecht (Statuskarte oben links) statt
  // senkrecht (Kugel im Guertel / Roehre am Rand). Deshalb width und nicht
  // height, und deshalb steht die Segmentbreite vorn im background-size.
  setStyle('hpFill', 'width', Math.max(0, (player.hp / derived.maxHp) * 100) + '%');
  setTxt('hpTxt', Math.ceil(player.hp) + ' / ' + derived.maxHp);
  setStyle('manaFill', 'width', Math.max(0, (player.mana / derived.maxMana) * 100) + '%');
  setTxt('manaTxt', Math.ceil(player.mana) + ' / ' + derived.maxMana);
  // Kachelbreite = eine Segmentbreite; der Verlauf zeichnet die Trennlinie selbst
  setStyle('hpTicks', 'backgroundSize', (100 / segmentZahl(HP_SEG_STUFE)) + '% 100%');
  setStyle('manaTicks', 'backgroundSize', (100 / segmentZahl(MANA_SEG_STUFE)) + '% 100%');
  setTxt('potCount', player.potions);
  setHTML('goldTxt', '<i class="ico ico-gold">💰</i> ' + player.gold);
  // U7: nur noch die Zahl. Das Wort "Stufe" stand daneben, solange die Zahl in
  // einer Textspalte lag; im Ring des Lichtbilds sagt die Stelle, was sie ist.
  setTxt('lvlTxt', player.level);
  // U7: Die Dienstuhr stand als Anhaengsel in der Ortszeile und wanderte mit
  // deren Laenge. Jetzt hat sie ihren Platz unter der Minikarte.
  const uhr = schichtUhrText();
  setStyle('uhrTxt', 'display', uhr ? 'inline' : 'none');
  if(uhr) setTxt('uhrTxt', uhr);
  // S1: freie Punkte stehen dauerhaft unter Stufe und Gold, nicht nur als
  // Sternchen am Rucksack. Am Bildschirmrand einer Touch-Sitzung ist statCol
  // ausgeblendet (s. CSS), dort traegt das Sternchen die Meldung allein.
  setStyle('freiTxt', 'display', player.skillPoints > 0 ? 'inline' : 'none');
  if(player.skillPoints > 0) setTxt('freiTxt', '✚ ' + player.skillPoints + (touchMode ? '' : ' [I]'));
  setStyle('skillBadge', 'display', player.skillPoints > 0 ? 'inline' : 'none');
  setStyle('spBadge', 'display', player.spellPoints > 0 && player.level >= ZAUBER_AB_STUFE ? 'inline' : 'none');
  // K1: Das Sternchen brennt, solange eine Vorlage offen ist — ausliegend oder
  // noch in der Schlange. Es ist die einzige dauerhafte Meldung der Ziehung,
  // der Floater beim Aufstieg verweht.
  setStyle('zulBadge', 'display', (player.zulagenAngebot || player.zulagenZiehungen > 0) ? 'inline' : 'none');

  // Aktiver Zauber. Z2: vor der Befugnisstufe zeigen beide Knoepfe das
  // Schloss samt Stufe — sichtbar bleiben sie mit Absicht, ein sichtbares
  // Schloss ist ein Versprechen, ein verstecktes Feature ist keines.
  const as = activeSpell;                              // R6/F32: kein SPELLS.find pro Frame
  if(player.level < ZAUBER_AB_STUFE){
    el('spellBtn').classList.add('disabled');
    setHTML('spellBtnTxt', ZAUBER_SCHLOSS);
    setAttr('spellBtn', 'title', ZAUBER_SCHLOSS_TITEL);
    el('ultBtn').classList.add('disabled');
    setHTML('ultBtnTxt', '<i class="ico ico-sperre">🔒</i> <span class="bl">Ult (R)</span>');
    setAttr('ultBtn', 'title', ZAUBER_SCHLOSS_TITEL);
  } else {
  if(as && player.spellsKnown[as.id]){
    el('spellBtn').classList.remove('disabled');
    setHTML('spellBtnTxt', `${as.icon} <span style="font-size:calc(9px * var(--fs))">${as.mana}⦿</span>`);
    setAttr('spellBtn', 'title', spellTitel(as));
  } else {
    el('spellBtn').classList.add('disabled');
    setHTML('spellBtnTxt', '· (E)');   // gleiche Ersatzform wie der Markup-Platzhalter, sonst springt der Text beim ersten updateHUD()
    setAttr('spellBtn', 'title', '');  // startShift() leert spellsKnown, ohne activeSpellId zu leeren — sonst bliebe der Tooltip der Vorschicht stehen
  }
  // Ultimate
  if(player.spellsKnown[ULT_SPELL.id]){
    el('ultBtn').classList.remove('disabled');
    setHTML('ultBtnTxt', `${ULT_SPELL.icon} <span class="bl">Ult (R)</span>`);
    setAttr('ultBtn', 'title', ULT_TITEL);
  } else {
    el('ultBtn').classList.add('disabled');
    setHTML('ultBtnTxt', '<i class="ico ico-sperre">🔒</i> <span class="bl">Ult (R)</span>');
    setAttr('ultBtn', 'title', '');
  }
  }
  // Kontext-Button und Kammer-Abbruch: gleiche Dirty-Check-Regel wie der Rest des HUD
  setStyle('aktionBtn', 'display', aktArt ? 'flex' : 'none');
  if(aktArt) setTxt('aktionTxt', aktTxt);
  setStyle('kamExitBtn', 'display', kammer ? 'flex' : 'none');
  // Der Balken las bis K1 die Leiter aus der Zeit vor S1 ab (35 * Stufe^1,35)
  // und war damit die letzte Abschrift im Haus: auf Stufe 10 stand er voll,
  // wenn erst zwei Fuenftel des Weges lagen. Jetzt liest er dieselbe Funktion
  // wie gainXP(), zulagenAssert() haelt das fest.
  setStyle('xpFill', 'width', Math.min(100, (player.xp / xpFuerStufe(player.level)) * 100) + '%');
  if(touchMode) el('attackBtn').classList.toggle('locked', !!lockedTarget);
}

// ===========================================================================
//  U9 — Die Hausmitteilung. Was seit dem letzten Mal neu ist, und wo es steht.
//
//  Das Haus baut schneller, als jemand hinsieht. Die acht Menuekaesten sind
//  seit heute vier Grossfenster, die Statuskarte aus U7 sitzt oben links, und
//  die fuenfundvierzig Kartenbilder liegen hinter einem Griff, den man tun
//  muesste, um zu merken, dass es sie gibt. Also ein Blatt davor — vor dem
//  Startbild und nicht darin, weil das Startbild bereits eine Aufgabe hat und
//  die heisst: Dienst antreten.
//
//  Jeder Punkt sagt zwei Dinge und hoert dann auf: WAS sich geaendert hat und
//  WO es zu sehen ist. Der Baubericht steht in den Phasendokumenten, hier
//  steht die Fundstelle. Wer mehr will, spielt.
//
//  Drei Regeln:
//   1. Wer zum ersten Mal hier ist, sieht sie nicht. "Neu" ist eine Aussage
//      ueber ein Vorher, und ein leeres Geraet hat keines. Es bekommt den
//      Stand still gestempelt und geht durch.
//   2. Einmal zur Kenntnis genommen, bleibt sie weg — bis NEUERUNGEN.stand
//      sich aendert. Der Stempel steht in localStorage und NICHT in
//      SPEICHER_SCHLUESSEL: er gehoert dem Geraet, nicht dem Spielstand (wie
//      sda_schrift und sda_targetPriority). Ein Import darf die Mitteilung
//      eines fremden Geraets nicht zurueckdrehen.
//   3. Sie bleibt nachlesbar. Das Startbild traegt den Knopf weiter, sonst
//      waere die einzige Fassung dieses Textes die, die man gerade
//      weggedrueckt hat — derselbe Grund, aus dem die Dienstanweisung dort
//      steht.
//
//  Wer hier eine Runde eintraegt: NEUERUNGEN.punkte neu fuellen, stand und
//  datum auf den Tag setzen. Alles andere bleibt.
//
//  Und wer einen Bauabschnitt aendert, der in einem Punkt genannt ist, aendert
//  den Punkt mit. Die wo-Zeile ist eine Wegbeschreibung ins laufende Spiel und
//  veraltet wie jede: U8 hat den Zulagen ihr eigenes Fenster genommen, und der
//  Satz "Guertel 🗂️ Zulagen" zeigte am Tag der Auslieferung auf einen Knopf,
//  den es nicht mehr gab. Kein Guard kann das sehen — ein Fliesstext ist fuer
//  ihn nur ein Fliesstext.
// ===========================================================================
const NEUERUNGEN_KEY = 'sda_neuerungen';
const NEUERUNGEN = {
  // T5: neuer Stempel am selben Tag. Der Vergleich ist ein String-Vergleich,
  // und ohne neuen Wert saehe die T5-Haelfte niemand, der die Mitteilung von
  // heute Morgen schon weggeklickt hat.
  // T6: derselbe Tag, dritter Stempel, aus demselben Grund.
  // IN1: vierter Stempel am selben Tag, gleiche Begruendung.
  // Kammerausgang: neuer Tag, also reicht das Datum als Stempel. Der Zusatz
  // bleibt trotzdem stehen — ein Stand, der nur das Datum ist, laedt dazu ein,
  // ihn beim naechsten Abschnitt desselben Tages nicht mehr anzufassen.
  stand: '2026-08-27-kam',
  datum: '27. August',
  punkte: [
    {
      titel: 'Anlage 2 ist Ihnen beigefügt worden',
      was: 'An Ihrer Ernennungsurkunde hängt ein Blatt, das seit Jahrzehnten jedem wichtigen Vorgang dieses Hauses beigefügt wird und das noch nie jemand gelesen hat. Es kennt das Haus, es kennt die Leute, es hat zu allem eine Auskunft, und es bleibt bei Ihnen. Ausheften lässt es sich nicht. Versuchen Sie es ruhig, es antwortet jedes Mal anders.',
      wo: 'Im Rucksack, erstes Feld. Anklicken heißt ansprechen. Taste I.',
    },
    {
      titel: 'Zwei Stimmen statt einer',
      was: 'Was bisher Knöterich am Rand bemerkt hat, sagt jetzt Anlage 2. Er bleibt bei Tasten und Gerät, sie erklärt die Welt. Am Zeichen vor der Zeile sehen Sie, wer spricht: das Paragrafenzeichen gehört ihm, die Fußnotenmarke ihr.',
      wo: 'Das Band oben unter der Statusleiste. Wie gesprächig es zugeht, stellen Sie in den Optionen ein.',
    },
    {
      titel: 'Vier große Fenster statt acht Kästen',
      was: 'Charakter, Rucksack, Kochen und Zauber füllen jetzt den Schirm, ein Reiterband im Kopf führt in einem Griff von einem zum nächsten. Befähigung, Ausrüstung und Ausweis stehen im Charakterfenster statt im Rucksack.',
      wo: 'Taste C oder der Knopf 🧍 am Gürtel, dann das Reiterband oben.',
    },
    {
      titel: 'Die Bedienschicht hat sich sortiert',
      was: 'Leben, Mana und Erfahrung liegen als eine Karte beieinander, mit Lichtbild und Dienststufe. Die Dienstuhr wandert nicht mehr mit dem Ortsnamen, und auf dem Telefon sind die Daumen frei.',
      wo: 'Statuskarte oben links, Karte oben rechts, Uhr darunter. Am Telefon: Ruhering unten links, Knopfspalte links, Zielwahl 🎯 am Angriffsfächer.',
    },
    {
      titel: 'Die Zulagen sind Sammelkarten geworden',
      was: 'Namensleiste mit der Stufe, Bildfenster, Typenzeile, Textfeld — und fünfundvierzig gemalte Motive, eines je Familie und Stufe.',
      wo: 'Charakterfenster, zweites Blatt „Kartenmappe" — oder Taste Z.',
    },
    {
      titel: 'Das Haus zeichnet seine Sinnbilder selbst',
      was: 'Schwert, Trank, Rucksack, Personalakte, Zielkreuz, Beute, Befähigung, Reiterband und die Münzen im Feld sind nicht mehr die Zeichen Ihres Telefons, sondern die des Spiels. Ein gesperrter Zauber trägt jetzt das Verbotsschild, das er verdient.',
      wo: 'Überall: Gürtel, Reiterband, Fensterköpfe und der Boden unter Ihren Füßen.',
    },
    {
      titel: 'Am Telefon sind die Knöpfe Knöpfe geworden',
      was: 'Angriffsfächer und Knopfspalte tragen jetzt die Achteckform, die in der Grafik gezeichnet steht, statt sie unter einem Kreisrand zu verstecken. Ein gesperrter Knopf zeigt nur noch sein Schloss, wo bis eben ein Text aus dem Knopf herauslief.',
      wo: 'Nur am Finger: Fächer unten rechts, Knopfspalte am linken Rand.',
    },
    // --- T5, 26.08.2026 -----------------------------------------------------
    // Normales Deutsch, wie es die Formregel "Das Register haengt am Ort" seit
    // heute fuer jeden Erklaertext verlangt. Die wo-Zeilen nennen nur Wege, die
    // es wirklich gibt; tools/mitteilung-pruef.mjs drueckt sie nach.
    {
      titel: 'Die Hinweise reden Deutsch',
      was: 'Die kurzen Hinweise im Band sagen jetzt, was los ist und was Sie tun können, ohne dass man sie zweimal liest. Aus „Sie verlieren Konfetti. Das ist selten gut." ist „Sie haben kaum noch Kraft übrig. Ein Trank hilft." geworden. Elf Zeilen sind so überarbeitet.',
      wo: 'Im Band unter der Statusleiste, sobald es etwas zu sagen gibt.',
    },
    {
      titel: 'Anlage 2 legt den Amtston ab',
      was: 'Sie fängt an wie ein Schriftstück: Aktenzeichen, vier Abkürzungen in zwei Zeilen, alles korrekt. Nach fünf Sätzen hört sie damit auf und sagt selbst, warum. Danach redet sie normal, und über die Sprache dieses Hauses lässt sie gelegentlich etwas fallen.',
      wo: 'Gleich zu Beginn, wenn sie sich vorstellt. Wer schon im Dienst ist, hört den Unterschied im Band.',
    },
    {
      titel: 'Anlage 2 erklärt Ihnen die Welt',
      was: 'Neu in ihrem Gespräch ist die Frage „Erklären Sie mir diese Welt." Dahinter liegen drei Themen: was hier eigentlich los ist, warum es dieses Amt gibt, und wo Sie sind und was Sie darin tun. Sie erzählt das in Ruhe und wiederholt sich gern.',
      wo: 'Im Rucksack Anlage 2 anklicken, dann die Frage auswählen.',
    },
    {
      titel: 'Der Anfang zeigt mehr von der Welt',
      was: 'Das Intro hat zwei Blätter dazubekommen: eine Landkarte, auf der die Gegend keine Ortsnamen trägt, sondern Buchstaben, und die Tafel über der Amtstür mit dem Satz, auf dem hier alles steht. Das Einstellungsformular sagt jetzt außerdem, was der Außendienst überhaupt ist.',
      wo: 'Beim ersten Dienstantritt. Wer den hinter sich hat, sieht es nicht noch einmal.',
    },
    // --- T6, 26.08.2026 -----------------------------------------------------
    // Der Punkt sagt, was der Spieler sieht, und nicht, wie es gebaut ist. Die
    // Pointe steht im dritten Satz und wird nicht erklaert: wer sie beim Lesen
    // nicht merkt, merkt sie beim Spielen.
    {
      titel: 'Sie dürfen entscheiden, ob Sie lesen',
      was: 'Beim ersten Treffen mit Anlage 2 stellt das Haus Ihnen frei, ob Sie sie lesen möchten. Die Freistellung ist echt. Das Ergebnis steht fest.',
      wo: 'Gleich nachdem sie sich vorgestellt hat, auf beiden Wegen in den Dienst.',
    },
    // --- IN1, 26.08.2026 ----------------------------------------------------
    // Zwei Punkte, weil es zwei Dinge sind: dass man hineinkommt, und dass
    // drinnen jemand steht. Die wo-Zeilen nennen nur Wege, die es gibt.
    {
      titel: 'Drei Häuser stehen jetzt offen',
      was: 'Das Amt, die Registratur und das Gasthaus Zum Letzten Stempel haben ein Inneres bekommen. Man geht hinein, man läuft darin herum, man geht wieder hinaus. Im Amt steht der Schreibtisch, an dem vor Ihnen jemand gearbeitet hat, und auf ihm die Pflanze, die noch lebt. Im Wirtshaus brennt das Feuer im Kamin, daneben liegt das Holz, hinter der Theke stehen die Fässer und darüber das Flaschenbord, an der Ostwand geht eine Standuhr, und durch die zwei Fenster in der Nordwand sieht man den Abend.',
      wo: 'An der gemalten Tür der drei Häuser steht Betreten. Der Feierabend liegt seither drinnen, am Dienstpult.',
    },
    {
      titel: 'Zum Feierabend geht das Dorf hinein',
      was: 'Im letzten Viertel Ihrer Schicht sind drei Leute nicht mehr auf dem Anger: Wirt Fass steht dann hinter seiner Theke, Registratorin Bramsche zwischen ihren Regalen und Nörgel an seinem Schreibtisch. Wer sie abends sprechen will, muss ihnen nachgehen.',
      wo: 'In den drei Häusern, sobald die Dienstuhr unter ein Viertel gefallen ist.',
    },
    // --- Kammerausgang, 27.08.2026 ------------------------------------------
    // Eine Berichtigung und kein Bauabschnitt. Sie steht hier trotzdem, weil
    // sie gemeldet wurde und weil sie sichtbar war: wer auf dem Telefon aus
    // einer Kammer kam, stand in einer schwarzen Welt und hat sich das nicht
    // eingebildet. Der Punkt sagt, was man jetzt sieht, und nicht, welche
    // Zeile gefehlt hat — das steht in KAMMERAUSGANG-2026-08-27.md.
    {
      titel: 'Der Weg aus der Kammer führt wieder ins Bild',
      was: 'Wer eine Kammer verließ, wurde bisher in einem langen Flug quer über die Karte zu seiner Tür zurückgetragen. Am Telefon konnte dabei der Boden wegbleiben: die Welt war schwarz, und sie kam erst mit der nächsten Kammer zurück. Jetzt steht man ohne Flug vor der Tür, und der Boden steht mit.',
      wo: 'An jeder Kammertür, sobald Sie über die Ausgangsrune im Vorraum oder über 🏳️ Abbruch hinausgehen.',
    },
  ],
};

// Die Zahl wird ausgeschrieben, wie jede Zahl in diesem Haus. Bis U10 stand
// hier eine Bedingung auf genau drei Punkte und sonst eine Ziffer — beim
// vierten Punkt haette dort "4 Stellen" gestanden.
const NEUERUNGEN_ZAHLWORT = ['Keine', 'Eine', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht'];
const neuerungenStellen = n =>
  n === 1 ? 'Eine Stelle' : `${NEUERUNGEN_ZAHLWORT[n] ?? n} Stellen`;

function neuerungenStandLesen(){ try{ return localStorage.getItem(NEUERUNGEN_KEY); }catch(_){ return null; } }
function neuerungenStempeln(){ try{ localStorage.setItem(NEUERUNGEN_KEY, NEUERUNGEN.stand); }catch(_){} }

// Regel 1 und 2 an einer Stelle. Wird genau einmal gefragt, beim Start.
function neuerungenFaellig(){
  if(!NEUERUNGEN.punkte.length) return false;
  if(neuerungenStandLesen() === NEUERUNGEN.stand) return false;
  const warSchonDa = SPEICHER_SCHLUESSEL.some(k => {
    try{ return !!localStorage.getItem(k); }catch(_){ return false; }
  });
  if(!warSchonDa){ neuerungenStempeln(); return false; }
  return true;
}

function showNeuerungen(){
  state = 'menu';
  camSnap();   // gleiche Kameraregel wie das Startbild: hinter dem Blatt steht das Dorf
  const punkte = NEUERUNGEN.punkte.map(p => `
    <div class="neuPunkt">
      <b>${p.titel}</b>
      <p>${p.was}</p>
      <p class="neuWo">📍 ${p.wo}</p>
    </div>`).join('');
  document.getElementById('ovPanel').innerHTML = `
    <h1>HAUSMITTEILUNG</h1>
    <h3>Umlauf vom ${NEUERUNGEN.datum} · zur Kenntnis</h3>
    <p style="font-size:calc(13px * var(--fs));color:#c9b98a;margin:0;">${neuerungenStellen(NEUERUNGEN.punkte.length)}, an denen seit Ihrer letzten Schicht umgeräumt wurde. Kurz, was und wo.</p>
    <div class="neuListe">${punkte}</div>
    <button onclick="neuerungenWeg()">Zur Kenntnis genommen</button>
    <p class="neuFuss">Steht ab jetzt auch im Startbild unter „Was ist neu".</p>
  `;
  document.getElementById('overlay').style.display = 'flex'; MUS.muffle(true);
}

function neuerungenWeg(){ neuerungenStempeln(); showStartScreen(); }

// W8: Das Startbild sagt jetzt, in welcher Welt man landet, bevor es fragt, ob
// man hinein will. Der Aufhänger ist der erste Satz der Weltbibel (Kapitel 0),
// er verrät nichts über die Akte und erklärt trotzdem alles über die Welt.
// Wer schon im Dienst war, sieht statt des Aufhängers seinen Stand und kommt
// hier auch wieder an die Dienstanweisung (Blatt 2), ohne eine Schicht zu
// starten.
function showStartScreen(){
  state = 'menu';
  camSnap();   // hinter dem Startbild soll das Dorf stehen, nicht die Kartenecke
  const erst = !kn.seen.einstellung;
  // SP3: Liegt eine unterbrochene Schicht in der Ablage, ist Fortsetzen der
  // erste Knopf und nicht ein Untermenü. Wer sie nicht will, drückt daneben.
  const sp = spielstandLesen();
  const stand = (CONFIG.schichtModus && amt.schichten > 0)
    ? `<p style="font-size:calc(12px * var(--fs));color:#c9b98a;">${rangName()} · ${amt.schichten} Schichten im Dienst · Amtskasse <i class="ico ico-gold">💰</i> ${amt.bankGold}</p>` : '';
  document.getElementById('ovPanel').innerHTML = `
    <h1>DAS MONSTRAL MINISTERIUM</h1>
    <h3>Erledigen. Beglaubigen. Feierabend.</h3>
    <p style="font-size:calc(16px * var(--fs));color:#f4e6b8;margin:0 0 10px;">Was nicht bearbeitet wird, wird lebendig.</p>
    <p>Vierhundert Jahre lang ist hier etwas liegen geblieben. Inzwischen läuft es draußen herum, und das Amt schickt jeden Tag jemanden hinterher. Heute sind Sie das.</p>
    ${stand}
    <p style="font-size:calc(12px * var(--fs));color:#9a8a5f;">W A S D gehen, Klick oder Leertaste schlagen. Auf dem Handy links gehen, rechts schlagen.</p>
    ${sp ? `
    <button onclick="spielstandFortsetzen()">Schicht fortsetzen</button>
    <p style="font-size:calc(11px * var(--fs));color:#7ad6ff;margin:6px 0 0;">Gespeicherter Spielstand: Stufe ${sp.stufe | 0}, noch ${Math.max(1, Math.round((sp.restT | 0) / 60))} Minuten Dienstzeit.</p>
    <div><button onclick="spielstandVerwerfen()" style="font-size:calc(13px * var(--fs));padding:9px 20px;margin-top:10px;">Neue Schicht beginnen</button></div>`
    : `<button onclick="startGame()">${erst ? 'Dienst antreten' : 'Dienst fortsetzen'}</button>`}
    ${erst ? '' : `<div>
      ${NEUERUNGEN.punkte.length ? `<button onclick="showNeuerungen()" style="font-size:calc(13px * var(--fs));padding:9px 20px;margin:10px 8px 0 0;">Was ist neu</button>` : ''}
      <button onclick="showDienstblatt(2,'menu')" style="font-size:calc(13px * var(--fs));padding:9px 20px;margin-top:10px;">Dienstanweisung</button></div>`}
  `;
  document.getElementById('overlay').style.display = 'flex'; MUS.muffle(true);
}

function showDead(){
  const wasShadowland = currentLevel === 2;
  const wasKammer = !!kammer;
  document.getElementById('ovPanel').innerHTML = `
    <h1 style="color:#ff5a5a">ÜBERRANNT</h1>
    <p>Monster erledigt: <b>${stats.kills}</b> · Stufe <b>${player.level}</b></p>
    <p style="font-size:calc(12px * var(--fs));color:#9a8a5f;">${wasKammer ? 'Die Kammer hat dich ausgespuckt. Sie bleibt versiegelt und wartet.'
      : wasShadowland ? 'Das Schattenland hat dich zurück in den Wald geschleudert.' : 'Du wachst am Waldrand wieder auf.'} Stufe, Ausrüstung und Beute bleiben erhalten.</p>
    <button onclick="respawnPlayer()">ZURÜCK IN DEN WALD</button>
  `;
  document.getElementById('overlay').style.display = 'flex'; MUS.muffle(true);
}

function respawnPlayer(){
  if(kammer) verlasseKammer();      // Tod in der Kammer: erst die Oberwelt zurückholen, dann respawnen
  if(innen) verlasseHaus();         // IN1: dasselbe fuer den Innenraum, sonst bliebe innenSave stehen
  currentLevel = 1; schattenlandActive = false; shadowKills = 0; boss = null; portal = null;
  monsters.length = 0; drops.length = 0; projectiles.length = 0; enemyBolts.length = 0; magicEffects.length = 0;
  particles.length = 0; corpses.length = 0; floaters.length = 0;
  player.x = SPAWN.x; player.y = SPAWN.y; camSnap(); player.dead = false; player.hurtT = 0;
  player.swingT = 0; player.castT = 0; player.attackCd = 0; player.spellCd = 0; player.zauberRuhT = 0;
  player.stillT = 0; player.hektikT = 0; player.kampfT = 0; player.platzCd = 0; player.schlagN = 0; goldRotT = 0;
  player.hp = Math.max(1, Math.round(derived.maxHp * 0.5)); player.mana = derived.maxMana;
  gespraechSchliessen();   // U3: npcs wird gleich neu gesetzt, ein festgehaltener Eintrag waere eine Leiche
  if(kesselOpen) toggleKessel();                                                   // gibt auch die Zutaten aus dem Topf zurück
  if(ausweisOpen) toggleAusweis();
  if(fullmapOpen) toggleFullmap();
  resetSpellDrag(); aDrag.id = null; atkBtnHeld = false; lockAim.active = false;   // Eingaben, die den Tod überlebt haben
  attackTouch = null; lockedTarget = null;
  el('bossbar').style.display = 'none';
  refreshFloor(); placeMonsters();
  el('overlay').style.display = 'none'; MUS.muffle(false);
  state = 'play'; updateHUD();
  knPlayStartT = gameT;
}

// Der Kampf-Tod-Ausgang. Er existiert seit vor W1 und bleibt der einfachere der
// beiden Enden: Boss tot, außerhalb einer Kammer, zwei Sekunden später hier.
// Mechanisch unverändert — killMon() und die Siegweiche sind nicht angefasst.
//
// Geändert ist nur der Ton (Fund F27, der Bildschirm stand als einziger noch im
// vor-W1-Register). Die Pointe des Unterschieds zu vorgangPanelHtml() bleibt
// ausdrücklich erhalten: wer zustellt, schließt einen Vorgang. Wer nur tötet,
// hat einen Sachverhalt ohne Aktenzeichen, und das Haus weiß nichts damit
// anzufangen. Kein Sperrvermerk in Reichweite, kein Hinweis auf die Zustellung
// als bessere Variante — das wäre ein Questmarker.
function winGame(){
  state = 'win';
  document.getElementById('ovPanel').innerHTML = `
    <h1 style="color:#a855f7">SACHVERHALT ERLEDIGT</h1>
    <p>Fürst Nachtrag ist zu den Akten genommen. Die Akten liegen noch dort, wo er stand.</p>
    <p style="font-size:calc(12px * var(--fs));color:#9a8a5f;">Ein Aktenzeichen wird nicht vergeben. Es fehlt die Anschrift, an die man die Erledigung hätte richten können. Das Haus vermerkt: Vorgang 1 bleibt offen, der Anlass ist entfallen.</p>
    <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">Trepp trägt den Brief zurück in den Sack. Er sagt nichts.</p>
    <button onclick="location.reload()">NEUEN VORGANG ANLEGEN</button>
  `;
  document.getElementById('overlay').style.display = 'flex'; MUS.muffle(true);
}

function startGame(){
  initAudio();
  if(CONFIG.schichtModus){
    // SP2: Hier stand die Nullung des Übertrags. Genau sie war der Verlust — sie
    // lief bei jedem Seitenaufruf, also auch bei dem, der die Nacht beendete.
    // W8: Beim allerersten Dienstantritt wird erst eingestellt, dann gearbeitet.
    // Danach nie wieder (kn.seen.einstellung), nachlesbar bleibt es überall.
    // E1: Der erste Dienstantritt laeuft ueber den Empfang. Er endet auf
    // demselben dienstAntritt(), das auch Blatt 3 ausloest, und ist damit
    // derselbe Uebergang wie vorher, nur mit einer Szene davor.
    // AN1 (27.08.2026): Die Reihenfolge ist umgedreht. Bis hierher lief der
    // Empfang VOR startShift(), und A0 hat gemessen, was das kostet:
    //   - state stand auf 'menu', also stieg scanAktion() in seiner ersten
    //     Zeile aus. Waehrend des ganzen Anfangs gab es keine Kontextaktion,
    //     in keine Richtung -- kein Betreten, kein Hinausgehen, kein
    //     Ansprechen. Fuer AN2 ist das der Blocker, nicht der Einfriertrick.
    //   - shiftT stand auf 0, also war rechnerisch Feierabend (innenZeit()),
    //     also stand Noergel in der Amtsstube, obwohl er nicht soll.
    //   - und startShift() setzte den Spieler HINTERHER auf SPAWN, 181 Pixel
    //     von der Amtstuer weg. Der erste freie Schritt aus dem Haus hinaus
    //     waere dem Schichtreset zum Opfer gefallen, bevor es ihn gab.
    // Jetzt laeuft der Dienstantritt zuerst und der Empfang darin. Die Welt
    // steht waehrenddessen still, siehe empfangStarten().
    startShift();
    if(!kn.seen.einstellung) empfangStarten();
  }
  else { document.getElementById('overlay').style.display = 'none'; MUS.muffle(false); state = 'play'; knPlayStartT = gameT; }
}

// ===========================================================================
//  PHASE 4: DIENST NACH VORSCHRIFT
//  Ersetzt bei CONFIG.schichtModus=true die alte Todesregel. Eine Schicht endet
//  durch Tod oder durch die Uhr, danach Dienstbericht → Amt → nächste Schicht.
//  Level/Skillpunkte/Zauberbaum/Ausrüstung setzen sich zurück, die Kessel-Kladde
//  (siehe KLADDE_KEY) und das Amt-Guthaben/die Ausbauten (AMT_KEY) nicht.
// ===========================================================================

// U7: Hiess bis dahin schichtHudSuffix() und wurde an die Ortszeile gehaengt.
// Die Uhr steht jetzt unter der Minikarte in ihrem eigenen Feld (#uhrTxt), also
// liefert die Funktion nur noch den Text und keinen Anhang mehr — kein fuehrendes
// Trennzeichen, kein Bezug auf die Zeile davor.
function schichtUhrText(){
  if(!CONFIG.schichtModus || state !== 'play') return '';
  if(shiftEndPending) return '⏱ Überstunden';
  const s = Math.max(0, Math.ceil(shiftT));
  const mm = Math.floor(s/60), ss = s%60;
  return `⏱ ${mm}:${ss<10?'0':''}${ss}`;
}

const DIENST_BEMERKUNGEN = [
  'Akte geschlossen. Nächste bitte.',
  'Der Vorgang wurde ordnungsgemäß beendet.',
  'Überstunden werden nicht vergütet, nur vermerkt.',
  'Ausrüstung verbleibt aktenkundig beim Amt.',
  'Wiedervorlage: nächste Schicht.',
  'Kein Kommentar. Nur Zahlen.',
];

// Milde Flüche für die Startausrüstungs-Wahl — bewusst keine "harten" (siehe FLUCH),
// sonst könnte eine Schicht schon am ersten Kessel-Item unspielbar starten.
const STARTFLUCH_WAHL = ['fehlschlag','kurzarm','langsame_zunge','duenn','steuer','geschwaetzig'];

const AUSBAU_DEFS = [
  {key:'startLevel', name:'Höhere Anfangsstufe', max:9, cost:l=>40*(l+1),   // Schlüssel bleibt startLevel, das ist Persistenz
   desc:'Startet jede Schicht eine Stufe höher.', unit:l=>`Stufe ${1+l}`},
  {key:'kontingent', name:'Größeres Zutaten-Kontingent', max:10, cost:l=>30*(l+1),
   desc:'Mehr Zutaten überstehen den Schichtwechsel.', unit:l=>`${CONFIG.zutatenMitnahmeBasis+l*2} Zutaten`},
  // Grundwert kommt aus KAMMERTUEREN_BASIS, damit hier und in startShift() nicht
  // zwei Zahlen nebeneinander stehen, die auseinanderlaufen können.
  {key:'tueren', name:'Mehr Kammertüren', max:2, cost:l=>80*(l+1),
   desc:'Eine zusätzliche Kammertür pro Biom.', unit:l=>`${KAMMERTUEREN_BASIS+l} Türen/Biom`},
];

const JAHRES_BONI = [
  {name:'Kaffeemaschine', text:'Mana regeneriert dauerhaft etwas schneller.', apply(){ amt.bonusManaRegen = (amt.bonusManaRegen||0)+2; }},
  {name:'Bequemere Stiefel', text:'Grundtempo steigt dauerhaft leicht.', apply(){ amt.bonusSpeed = (amt.bonusSpeed||0)+6; }},
  {name:'Notfallkeks', text:'Ein Trank mehr beim Schichtantritt.', apply(){ amt.bonusPotions = (amt.bonusPotions||0)+1; }},
  {name:'Dienstsiegel', text:'Kammern versiegeln sich nach dem Plündern schneller neu.', apply(){ amt.bonusNachwachsen = Math.min(80, (amt.bonusNachwachsen||0)+20); }},
  {name:'Startkapital', text:'Etwas Bargeld liegt schon in der Schublade.', apply(){ amt.bonusStartGold = (amt.bonusStartGold||0)+10; }},
];

// Setzt Welt und Spieler komplett neu auf und startet die Schichtuhr. Wird sowohl
// für die allererste Schicht (aus startGame()) als auch für jede folgende (aus
// dem Amt-Panel) benutzt — ein einziger, getesteter Reset-Pfad statt zweier.
function startShift(){
  if(kammer) verlasseKammer();
  if(innen) verlasseHaus();         // IN1: eine neue Schicht faengt draussen an
  currentLevel = 1; schattenlandActive = false; shadowKills = 0; boss = null; portal = null;
  monsters.length = 0; drops.length = 0; projectiles.length = 0; enemyBolts.length = 0; magicEffects.length = 0;
  particles.length = 0; corpses.length = 0; floaters.length = 0;
  gespraechSchliessen();   // U3, s. respawnPlayer
  if(kesselOpen) toggleKessel();
  if(ausweisOpen) toggleAusweis();
  if(fullmapOpen) toggleFullmap();
  if(invOpen) toggleInventory();
  if(spellTreeOpen) toggleSpellTree();
  if(charakterOpen) toggleCharakter();   // U8: samt Kartenmappe, die eines seiner Blaetter ist
  if(optionenOpen) toggleOptionen();
  if(amtFensterOpen) amtFensterSchliessen();
  resetSpellDrag(); aDrag.id = null; atkBtnHeld = false; lockAim.active = false;
  attackTouch = null; lockedTarget = null;
  el('bossbar').style.display = 'none';

  player.x = SPAWN.x; player.y = SPAWN.y; camSnap(); player.dead = false; player.hurtT = 0;
  player.swingT = 0; player.castT = 0; player.attackCd = 0; player.spellCd = 0; player.zauberRuhT = 0;
  player.stillT = 0; player.hektikT = 0; player.kampfT = 0; player.platzCd = 0; player.schlagN = 0; goldRotT = 0;
  // W10: ein bewilligter Antrag auf Wiedereinsetzung wird hier eingelöst und im
  // selben Zug verbraucht. Er gibt den Dienststand und das Gesicht zurück, sonst
  // nichts: skillPoints, spellPoints, spellsKnown, bag und equip unten bleiben
  // unberührt. Die Klemme nach unten ist Absicht, ein Antrag darf nie schlechter
  // stellen als der normale Schichtantritt.
  const wieder = amt.wiedereinsetzung; amt.wiedereinsetzung = null;
  if(wieder) saveAmt();
  player.level = Math.max(wiederAnfangsstufe(), wieder ? wiederStandGeklemmt(wieder.stand) : 0); player.xp = 0;
  player.skills = {str:0, vit:0, agi:0, int:0};
  // Z2: der Ausbau 'Hoehere Anfangsstufe' zahlt nur die Zauberpunkte aus, die
  // ein normaler Aufstieg auch gezahlt haette — also die der Stufen ab
  // ZAUBER_AB_STUFE. Startstufe ist 1 + startLevel; von den startLevel
  // Aufstiegen (auf die Stufen 2 bis 1+startLevel) zaehlen die ab Stufe 4:
  // startLevel 3 startet auf Stufe 4 mit genau einem Punkt.
  player.skillPoints = amt.ausbauten.startLevel * 2;
  player.spellPoints = Math.max(0, amt.ausbauten.startLevel - (ZAUBER_AB_STUFE - 2));
  player.spellsKnown = {};
  // K1: Kartei und Angebot fallen mit der Schicht, wie Stufe, Zauber und Gerät.
  // Der Ausbau 'Höhere Anfangsstufe' zahlt je übersprungenem Aufstieg eine
  // Vorlage — dieselbe Pauschale wie die Befähigungspunkte zwei Zeilen höher,
  // aus demselben Grund. Die Wiedereinsetzung zahlt hier wie dort nichts: sie
  // gibt den Dienststand zurück, keine Nachzahlung.
  player.zulagenKartei = []; player.zulagenAngebot = null;
  player.zulagenZiehungen = amt.ausbauten.startLevel;
  zulagenAngebotSicherstellen();
  // Dasselbe Gesicht nur nach bewilligtem Antrag. Lisbeth fragt trotzdem weiter
  // nach dem Namen (ANREDE_LISBETH zykelt über amt.schichten, nicht über die
  // Person) — das ist ausdrücklich so gewollt und der bessere Gag.
  //
  // P1: Ohne Antrag zieht die Schicht ihre Gestalt nur noch aus den Frisuren,
  // die zur Angabe auf Blatt 1 passen (haareNach), und ihre Haarfarbe aus
  // CF_HAARTON statt aus dem Naturton des Blattes. Das ist die eine Stelle, an
  // der beides gewürfelt wird: Schichtantritt und Wiederantritt nach einem
  // Dienstende laufen beide hier durch.
  //
  // Mit Antrag bleibt beides stehen, auch wenn die Angabe seither eine andere
  // ist. Eine Wiedereinsetzung setzt dieselbe Person wieder ein, das ist ihr
  // ganzer Zweck (Weltbibel 18.2); sie an eine später geänderte Vorliebe
  // anzupassen hieße, jemand anderen einzusetzen und es Berichtigung zu nennen.
  const haarWahl = haareNach(amt.gestalt);
  player.hair = (wieder && HAIRS.indexOf(wieder.haar) >= 0) ? wieder.haar
              : haarWahl[Math.floor(Math.random()*haarWahl.length)];
  player.haarTon = (wieder && HAARTOENE.indexOf(wieder.ton) >= 0) ? wieder.ton
                 : HAARTOENE[Math.floor(Math.random()*HAARTOENE.length)];
  player.bag = new Array(24).fill(null);
  player.potions = 2 + (amt.bonusPotions||0);
  // SP2: Übertrag einlösen und im selben Zug leeren, Bauform wie der Antrag
  // oben. saveAmt() genau dann, wenn wirklich einer vorlag — ein Schreibvorgang
  // bei jedem Antritt wäre der Fehler, den GW26b schon einmal notiert hat.
  const ueber = amt.uebertrag; amt.uebertrag = null;
  if(ueber) saveAmt();
  player.gold = (ueber ? ueber.gold : 0) + (amt.bonusStartGold||0);
  player.pouch = ueber ? ueber.zutaten : [];
  player.equip = {weapon:null, armor:null, shield:null, boots:null}; knCurseWasOn = false;
  player.equip.weapon = {base:BASES[1], rar:1, affixes:[{k:'dmg',v:2,def:AFFIXES[0]}], name:'Magisches Kurzschwert'};
  if(amt.ausbauten.startFluch) player.equip.weapon.fluch = amt.ausbauten.startFluch;

  CONFIG.kammerTueren = KAMMERTUEREN_BASIS + amt.ausbauten.tueren; setzeKammerTueren();

  // W4: Weltgarantie-Kontingente vor placeMonsters() setzen, nicht danach.
  // Sammlung braucht das Vierfache: dropZutat() fällt nur bei einem Teil der
  // Kills, plus Reserve. Menge/Ort bekommen Puffer für Kartenecken, die in
  // einer Schicht realistisch nicht abgelaufen werden. W-Groß hat die Puffer
  // angehoben (2->ziel, 3->ziel*2, x3->x4): auf der sechzehnfachen Fläche ist
  // "die Ecke, die man nicht abläuft" viel mehr Karte als vorher, die
  // Reservierungen sind zugleich ein viel kleinerer Anteil der 600 Plätze.
  const auftragS = amt.auftrag;
  auftragSoll    = !auftragS ? 0 : auftragS.typ === 'menge' ? auftragS.ziel * 2
                              : auftragS.typ === 'sammlung' ? auftragS.ziel * 4 : 0;
  auftragOrtSoll = (auftragS && auftragS.typ === 'ort') ? auftragS.ziel * 3 : 0;

  recalc(); player.hp = derived.maxHp; player.mana = derived.maxMana;
  knCheckFluchEquipped();   // Startfluch-Ausbau kann ohne equipItemFromBag() einen Fluch anlegen
  refreshFloor(); placeMonsters();

  // SP3: Ein frischer Antritt macht jeden Spielstand ungültig — er beschreibt
  // eine Schicht, die es ab dieser Zeile nicht mehr gibt. spielstandEinloesen()
  // ruft startShift() ausdrücklich VOR dem Anwenden und liest deshalb vorher.
  spielstandLoeschen();
  shiftT = CONFIG.schichtDauer; shiftEndPending = false; overtimeT = 0;
  shiftKillsByType = {}; shiftKillsTotal = 0;
  auftragStand = 0; auftragVerletzt = false;                          // W4
  auftragFertig = !!(amt.auftrag && amt.auftrag.bezahlt);             // GW1: bezahlt bleibt bezahlt
  letzterAnlass = null;                                               // GW4: kein Anlass über den Schichtwechsel
  langSchicht = {};                                                   // W7: Einmal-je-Schicht-Merker

  document.getElementById('overlay').style.display = 'none'; MUS.muffle(false);
  state = 'play'; updateHUD();
  knPlayStartT = gameT;
  // In der allerersten Schicht übernimmt Beat 1 die Einführung, keine Begrüßung.
  if(amt.schichten >= 1) knBegruessungPending = knBegruessungLine();
  // W3: eine Frage pro Schicht, neu scharf ab der nächsten. W7 Nr. 2: mit
  // abgeschlossener Anlage 3 sind es zwei. Abgeleitet gelesen, kein amt-Feld.
  bramscheFragen = 1 + (langFertig('anlage3') ? 1 : 0);
}

// Schicht beenden: Übertrag berechnen (Gold anteilig, Zutaten gekappt nach Seltenheit
// sortiert), Amt-Guthaben verbuchen, Dienstbericht zeigen. Die Kladde wird hier nicht
// angefasst — sie speichert sich schon beim Kochen selbst (saveKladde()) und bleibt
// dadurch unabhängig von diesem Reset garantiert erhalten.
function endShift(reason){
  gespraechSchliessen();   // U3, s. respawnPlayer
  if(kesselOpen) toggleKessel();
  if(ausweisOpen) toggleAusweis();
  if(fullmapOpen) toggleFullmap();
  if(amtFensterOpen) amtFensterSchliessen();
  // W4: vor allen weiteren Änderungen prüfen, solange player.gold noch der
  // ungeteilte Schichtstand ist (Bilanz-Aufträge lesen genau den).
  const auftragBericht = auftragSchichtende();

  const { guertel: carryGold, kasse: abgabe, verwaltung } = goldAufteilung(player.gold);
  const kontingent = CONFIG.zutatenMitnahmeBasis + amt.ausbauten.kontingent*2;
  const sorted = player.pouch.slice().sort((a,b) => zutatRar(b) - zutatRar(a));
  let rest = kontingent, carryPouch = [], eingezogen = 0, zutatenGesamt = 0;
  for(const z of sorted){
    zutatenGesamt += z.count;
    if(rest <= 0){ eingezogen += z.count; continue; }
    const take = Math.min(rest, z.count);
    carryPouch.push({noun:z.noun, adj:z.adj, count:take});
    rest -= take; eingezogen += (z.count - take);
  }
  // F19 gab der Amtskasse den einbehaltenen Rest statt einer zweiten Kopie des
  // Übertrags. Seit dem 20.08.2026 sind es drei Empfänger statt zweier: der
  // Verwaltungskostenanteil verlässt das Spiel. Die Summe der drei ist weiterhin
  // exakt player.gold, das rechnet goldAufteilung() vor und goldAssert() nach.
  // SP2: in die Akte statt in eine Laufzeitvariable. Geschrieben wird der schon
  // gekappte Übertrag, nicht die Bruttobeute — was hier steht, ist genau das,
  // was der Dienstbericht zwei Zeilen weiter unten als "mitgenommen" druckt.
  amt.uebertrag = {gold: carryGold, zutaten: carryPouch};
  amt.bankGold += abgabe; amt.schichten++;
  // SP3: Die Schicht ist abgerechnet, ihr Spielstand ist damit verbraucht. Die
  // Frischeprüfung in spielstandLesen() würde ihn wegen amt.schichten++ ohnehin
  // verwerfen; gelöscht wird er trotzdem, damit in der Ablage nichts steht, was
  // nicht mehr gilt.
  spielstandLoeschen();

  // Phase 5: Dienstzettel 'feierabend1' latcht hier (Auslöser = #overlay öffnet sich,
  // seine eigene Sperrzone), erscheint deshalb erst in der Folgeschicht. maxKillsSchicht
  // ist der einzige Rekordwert, den die Schichtbegrüßung nennen darf.
  kn.pending.feierabend1 = true;
  if(shiftKillsTotal > kn.counters.maxKillsSchicht) kn.counters.maxKillsSchicht = shiftKillsTotal;
  // T4: sechs Umschlaege haengen an dieser einen Stelle, und das ist kein
  // Sammelsurium, sondern die Folge davon, dass hier die Schicht hochgezaehlt
  // wird. Akt und Rang werden im Haus grundsaetzlich ABGELEITET gelesen und nie
  // als zweites Feld gefuehrt (aktStand, rangStufe); wer die Schwellen
  // woanders abfaengt, baut die zweite Wahrheit, die W5/W6 gekostet haben.
  //
  // Gezeigt wird davon jetzt nichts. Der Bildschirm gehoert gerade dem
  // Dienstbericht, und das Band liegt darunter. Faellig geschaltet halten die
  // Zeilen bis zur naechsten ruhigen Minute unter vier Augen, notfalls Tage.
  anlage2Umschlag('ersterFeierabend');
  if(rangStufe() >= 1) anlage2Umschlag('ersterRang');
  const akt = aktStand();
  for(let a = 2; a <= akt; a++) anlage2Umschlag('akt' + a);
  saveKn();

  const killLines = Object.keys(shiftKillsByType).sort((a,b) => shiftKillsByType[b]-shiftKillsByType[a])
    .map(t => `${MONDEF[t] ? MONDEF[t].name + ' (' + MONDEF[t].art + ')' : t}: ${shiftKillsByType[t]}`);
  // W7 Nr. 6: Die Bemerkungen sind laut Kapitel 8 von Nörgel. Genau sie sind der
  // Sammelgegenstand seines Langvorgangs, ein neuer wäre überflüssig. Der Index
  // ist deshalb eine eigene Zeile — er wandert in den Trichter, nicht der Text.
  const bmIdx = Math.floor(Math.random()*DIENST_BEMERKUNGEN.length);
  const bemerkung = DIENST_BEMERKUNGEN[bmIdx];
  langEreignis('schichtende', {bm: bmIdx});
  const ueberstunden = Math.max(0, Math.round(overtimeT));
  const mitgenommen = carryPouch.reduce((s,z) => s+z.count, 0);

  amt.auftrag = null;   // W4: Aushang gilt für eine Schicht, das nächste Brett hängt in showDorf()
  saveAmt();

  // W10: Der Bericht rollt seit diesem Bauabschnitt. Er stand vorher ohne jede
  // Überlaufbehandlung im Panel und war auf 390x664 im schlimmsten Fall (Schicht
  // im Fünferschritt, also mit Hebungsblock) schon bei 654 von 664 Pixeln, also
  // eine Zeile vom Rand entfernt. Der Wiedereinsetzungsblock hätte ihn dort auf
  // 758 gedrückt und den WEITER-Knopf aus dem Bild geschoben.
  //
  // Was rollt, ist genau der Rückblick: Dienstbericht und Hebung. Alles, was eine
  // Handlung verlangt oder den Ton setzt, steht außerhalb und ist immer sichtbar.
  // Der Antrag gehört ausdrücklich dazu: er kostet Geld und ist eine Entscheidung,
  // und eine Entscheidung hinter einem Rollbalken ist keine. Gleiche Aufteilung
  // wie beim Vordruck in W8, dort aus demselben Grund.
  const titel = reason === 'tod' ? 'FEIERABEND' : reason === 'amt' ? 'FEIERABEND' : 'DIENSTSCHLUSS';
  const anlass = reason === 'tod' ? 'Der Dienst endete unsanft. Der nächste Trupp übernimmt.'
               : reason === 'amt' ? 'Freiwillig Feierabend genommen. Die Akte wartet bis morgen.'
                                   : 'Die Uhr hat entschieden. Akten schließen sich von selbst.';

  document.getElementById('ovPanel').innerHTML = `
    <h1>${titel}</h1>
    <p style="font-size:calc(12px * var(--fs));color:#9a8a5f;">${anlass}</p>
    <div id="berichtRoll" style="max-height:30vh;overflow-y:auto;">
    <div style="text-align:left;background:rgba(0,0,0,.5);padding:12px;border-radius:8px;font-size:calc(13px * var(--fs));margin:14px 0;border:1px solid #5a4a2d;">
      <b><i class="ico ico-zettel">🧑‍💼</i> Dienstbericht</b><br>
      Monster erledigt: ${shiftKillsTotal}${killLines.length ? '<br><span style="font-size:calc(11px * var(--fs));color:#c9b98a;">'+killLines.join(' · ')+'</span>' : ''}<br>
      Zutatenaufkommen: ${zutatenGesamt} (${mitgenommen} mitgenommen, ${eingezogen} eingezogen)<br>
      Überstunden: ${ueberstunden}s<br>${auftragBericht ? '      ' + auftragBericht + '<br>' : ''}
      Beuteaufkommen: <i class="ico ico-gold">💰</i> ${player.gold} (${carryGold} mitgenommen, ${abgabe} an die Amtskasse, ${verwaltung} Verwaltungskostenanteil)
    </div>
    ${rangBerichtBlock()}
    </div>
    <p id="berichtMehr" style="font-size:calc(11px * var(--fs));color:#7a6a45;margin:2px 0 0;"></p>
    <div id="wiederBox">${wiederBlockHtml()}</div>
    <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">„${bemerkung}"</p>
    <button onclick="nachSchicht()">WEITER</button>
  `;
  document.getElementById('overlay').style.display = 'flex'; MUS.muffle(true);
  // Gleiche Messung wie bei showDienstblatt(): einmal nach dem Rendern, kein
  // Timer, kein Listener. Ein abgeschnittener Bericht soll wie eine Fortsetzung
  // aussehen und nicht wie ein Fehler.
  const roll = document.getElementById('berichtRoll'), mehr = document.getElementById('berichtMehr');
  if(roll && mehr && roll.scrollHeight > roll.clientHeight + 2) mehr.textContent = 'Der Bericht geht im Kasten weiter.';
}

function nachSchicht(){
  if(amt.schichten % 10 === 0) showJahresgespraech(); else showDorf();
}

// ===========================================================================
//  SP3: DER SPIELSTAND — gerätebezogenes Speichern, und Export/Import daneben
//
//  Bis hierher überlebten drei Akten die Nacht (amt, kladde, kn), die laufende
//  Schicht dagegen nie. Wer in Minute 20 von 25 den Browser schloss, hatte die
//  Schicht nicht gespielt: kein Feierabend, kein Bericht, kein Bankzufluss. Auf
//  dem Telefon entscheidet das nicht einmal der Spieler, sondern das
//  Betriebssystem, das den Hintergrund-Tab wegräumt.
//
//  Möglich wird der Spielstand durch eine Eigenschaft, die dieses Projekt schon
//  immer hatte und die bis zur Messung vom 24.08.2026 niemand aufgeschrieben
//  hatte: DIE WELT IST ÜBER SITZUNGEN HINWEG IDENTISCH. genMap() zieht aus
//  mulberry32(20260805), einem festen Seed, und läuft genau einmal beim
//  Skriptstart. Zwei Ladevorgänge ergeben denselben Kartenhash, dieselben 8019
//  Bäume, dieselbe Koppel — gemessen, siehe SPEICHERFRAGE-2026-08-24.md. Eine
//  gespeicherte Position zeigt deshalb beim nächsten Start auf dieselbe Kachel
//  und nicht in einen Felsen. Ohne diese Zusage wäre der ganze Block nicht
//  baubar, und mit ihr ist er klein.
//
//  Was NICHT im Spielstand steht: Monster, Beute am Boden, Geschosse, Leichen,
//  Partikel. Die kommen bei placeMonsters() ohnehin neu, und sie einzufrieren
//  hieße, den Kampfzustand zu konservieren — dann wäre Speichern vor einer
//  Truhe ein Werkzeug statt einer Unterbrechung. Der Spielstand hält den
//  Menschen, die Uhr und den Auftrag fest, nicht die Sekunde.
//
//  SPRACHE: Dieser Block redet Technik, nicht Amtsdeutsch. "Spielstand",
//  "Speichern", "Exportieren" heißen hier wörtlich so, im Code wie auf den
//  Knöpfen. Das ist eine bewusste und die einzige Ausnahme vom Ton des Hauses,
//  und sie ist eine Entscheidung, keine Nachlässigkeit: eine Datensicherung,
//  die sich "Antrag auf Beglaubigung einer Aktenabschrift" nennt, findet im
//  Zweifel niemand, und wer sie nicht findet, verliert seinen Fortschritt an
//  einen Witz. Der Gag steht überall sonst im Spiel; hier steht die Funktion.
// ===========================================================================
const SPIEL_KEY = 'sda_spielstand_v1';
const SPIEL_VERSION = 1;

// Die Deckel für geladene Ausrüstung werden aus den Tabellen GERECHNET, nicht
// gesetzt: was das Spiel selbst erzeugen kann, ist die Obergrenze. Wächst eine
// Tabelle, wächst der Deckel mit, ohne dass hier eine zweite Zahl gepflegt
// werden müsste — das ist die F1-Falle, und sie ist hier vermieden statt
// beschrieben. P1-Lehre: gegen die Tabelle prüfen, nicht bloß auf Typ.
const SPIEL_DECKEL = (() => {
  let dmg = 0, armor = 0, kraft = 0;
  const sieh = b => {
    if(Array.isArray(b.dmg)) dmg = Math.max(dmg, b.dmg[1] || 0);
    if(typeof b.armor === 'number') armor = Math.max(armor, b.armor);
    if(typeof b.kraft === 'number') kraft = Math.max(kraft, b.kraft);
  };
  BASES.forEach(sieh);
  for(const slot in CRAFT_BASE) CRAFT_BASE[slot].forEach(sieh);
  const affix = {};
  AFFIXES.forEach(a => { affix[a.k] = Math.max(affix[a.k] || 0, a.max); });
  return {dmg, armor, kraft, affix};
})();

const SPIEL_SLOTS = ['weapon', 'armor', 'shield', 'boots'];
const SPIEL_ZAUBER = new Set(SPELLS.map(s => s.id).concat([ULT_SPELL.id]));

// Ein Ausrüstungsstück aus der Ablage. Gibt ein neu gebautes Objekt zurück oder
// null — nie das gelesene Objekt selbst, damit kein Feld durchrutscht, das hier
// nicht steht. Die Wirkungen und Flüche werden gegen ihre Tabellen geprüft, die
// Zahlen gegen SPIEL_DECKEL geklemmt.
function itemGeklemmt(o){
  if(!o || typeof o !== 'object' || !o.base || typeof o.base !== 'object') return null;
  const b = o.base;
  if(SPIEL_SLOTS.indexOf(b.t) < 0) return null;
  if(typeof b.name !== 'string' || !b.name || b.name.length > 60) return null;
  const base = {t: b.t, name: b.name, tier: clamp(b.tier | 0, 0, 4)};
  if(typeof b.icon === 'string' && b.icon.length <= 8) base.icon = b.icon;
  if(typeof b.iconFrame === 'string' && b.iconFrame.length <= 24) base.iconFrame = b.iconFrame;
  if(typeof b.mode === 'string' && b.mode.length <= 24) base.mode = b.mode;
  if(Array.isArray(b.dmg) && b.dmg.length === 2){
    const lo = clamp(+b.dmg[0] || 0, 0, SPIEL_DECKEL.dmg), hi = clamp(+b.dmg[1] || 0, 0, SPIEL_DECKEL.dmg);
    base.dmg = [Math.min(lo, hi), Math.max(lo, hi)];
  }
  if(typeof b.aps === 'number') base.aps = clamp(b.aps, 0.1, 5);
  if(typeof b.armor === 'number') base.armor = clamp(b.armor | 0, 0, SPIEL_DECKEL.armor);
  if(typeof b.kraft === 'number') base.kraft = clamp(b.kraft | 0, 0, SPIEL_DECKEL.kraft);
  const it = {base, rar: clamp(o.rar | 0, 0, 4), affixes: [], fluchRuht: false,
              name: (typeof o.name === 'string' && o.name && o.name.length <= 60) ? o.name : base.name};
  if(Array.isArray(o.affixes)) for(const a of o.affixes.slice(0, 4)){
    if(!a || typeof a.k !== 'string') continue;
    const def = AFFIXES.find(d => d.k === a.k);
    if(!def) continue;
    it.affixes.push({k: def.k, v: clamp(a.v | 0, 0, def.max), def});
  }
  if(o.effect && typeof o.effect.k === 'string' && WIRKUNG[o.effect.k])
    it.effect = {k: o.effect.k, stufe: clamp(o.effect.stufe | 0, 1, 3)};
  if(typeof o.fluch === 'string' && FLUCH[o.fluch]) it.fluch = o.fluch;
  if(o.crafted) it.crafted = true;
  return it;
}

// Zutaten, gleiche Bauform wie beim Übertrag in loadAmt(). Ein kaputter Eintrag
// fällt raus, nicht die ganze Liste.
function zutatenGeklemmt(arr){
  if(!Array.isArray(arr)) return [];
  return arr.filter(z => z && typeof z.noun === 'string' && typeof z.adj === 'string' && (z.count | 0) > 0)
            .slice(0, UEBERTRAG_STUECK_DECKEL)
            .map(z => ({noun: z.noun, adj: z.adj, count: clamp(z.count | 0, 1, UEBERTRAG_STUECK_DECKEL)}));
}

// Wann darf geschrieben werden? Bewusst eng, und jede Bedingung hat einen Grund:
// nur im Dienst, nur im laufenden Spiel (das schließt Szenen aus, die setzen
// state='szene'), nicht in einer Kammer und nicht im Schattenland (beide werden
// eigens erzeugt und stehen nicht im Spielstand), nicht tot, und nicht in den
// Überstunden — dort läuft die Schicht schon aus, und ein Spielstand mit
// abgelaufener Uhr wäre ein Fortsetzen in den sofortigen Feierabend.
function spielstandErlaubt(){
  return CONFIG.schichtModus && state === 'play' && !kammer && !innen && currentLevel === 1
      && !player.dead && !szeneAktiv && !shiftEndPending;
}

function spielstandSchreiben(){
  if(!spielstandErlaubt()) return false;
  const s = {
    v: SPIEL_VERSION, schichten: amt.schichten, stufe: player.level,
    restT: Math.max(0, Math.round(shiftT)),
    spieler: {level: player.level, xp: player.xp, hp: player.hp, mana: player.mana,
              gold: player.gold, potions: player.potions,
              skills: Object.assign({}, player.skills), skillPoints: player.skillPoints,
              spellPoints: player.spellPoints, spellsKnown: Object.assign({}, player.spellsKnown),
              hair: player.hair, haarTon: player.haarTon, x: player.x, y: player.y,
              bag: player.bag, equip: player.equip, pouch: player.pouch,
              // K1: Die Zulagen sind Schichtzustand wie Stufe und Ausrüstung
              // ("nichts davon geht nach localStorage", sagt ihr Kommentar — bis
              // hierher stimmte das, und der Spielstand ist die Ausnahme, die
              // ihn nicht bricht: er speichert die Schicht, nicht die Akte).
              // Ein Fortsetzen ohne Dienstmappe wäre kein Fortsetzen.
              zulagenKartei: player.zulagenKartei, zulagenZiehungen: player.zulagenZiehungen,
              zulagenAngebot: player.zulagenAngebot},
    schicht: {shiftT, overtimeT, killsByType: shiftKillsByType, killsTotal: shiftKillsTotal,
              auftragStand, auftragVerletzt, auftragFertig, langSchicht},
  };
  try{ localStorage.setItem(SPIEL_KEY, JSON.stringify(s)); }catch(_){ return false; }
  return true;
}

function spielstandLoeschen(){ try{ localStorage.removeItem(SPIEL_KEY); }catch(_){} }

// Lesen heißt hier auch: prüfen, ob er überhaupt noch gilt. Die Frischeprüfung
// ist der Kern — ein Spielstand gehört zu der Schichtzahl, bei der er entstand.
// Stimmt sie nicht mehr, ist die Schicht inzwischen abgerechnet worden, und
// Fortsetzen wäre eine zweite Abrechnung derselben Schicht.
function spielstandLesen(){
  let o = null;
  try{
    const raw = localStorage.getItem(SPIEL_KEY);
    if(!raw) return null;
    o = JSON.parse(raw);
  }catch(_){ return null; }
  if(!o || o.v !== SPIEL_VERSION || !o.spieler || !o.schicht) return null;
  if((o.schichten | 0) !== amt.schichten) return null;
  return o;
}

// Einlösen läuft ausdrücklich ÜBER startShift() und nicht daran vorbei: das ist
// laut Gameplay-Prompt der einzige Reset-Pfad, "ein getesteter Pfad statt
// zweier". Erst die Schicht regulär aufbauen (Welt, Monster, Kontingente,
// Aushang), dann den Menschen und die Uhr darüberlegen.
function spielstandEinloesen(){
  const s = spielstandLesen();
  if(!s) return false;
  startShift();                     // löscht den Spielstand mit, deshalb oben gelesen
  const p = s.spieler, k = s.schicht;

  player.level = clamp(p.level | 0, 1, 99);
  player.xp = Math.max(0, p.xp | 0);
  for(const key in player.skills) player.skills[key] = clamp((p.skills && p.skills[key]) | 0, 0, 999);
  player.skillPoints = clamp(p.skillPoints | 0, 0, 999);
  player.spellPoints = clamp(p.spellPoints | 0, 0, 999);
  player.spellsKnown = {};
  if(p.spellsKnown) for(const id in p.spellsKnown) if(SPIEL_ZAUBER.has(id) && p.spellsKnown[id]) player.spellsKnown[id] = true;
  if(HAIRS.indexOf(p.hair) >= 0) player.hair = p.hair;
  if(HAARTOENE.indexOf(p.haarTon) >= 0) player.haarTon = p.haarTon;
  player.gold = clamp(p.gold | 0, 0, UEBERTRAG_GOLD_DECKEL);
  player.potions = clamp(p.potions | 0, 0, 99);
  player.pouch = zutatenGeklemmt(p.pouch);
  player.bag = new Array(24).fill(null);
  if(Array.isArray(p.bag)) for(let i = 0; i < Math.min(24, p.bag.length); i++) player.bag[i] = itemGeklemmt(p.bag[i]);
  player.equip = {weapon: null, armor: null, shield: null, boots: null};
  if(p.equip) for(const slot of SPIEL_SLOTS){
    const it = itemGeklemmt(p.equip[slot]);
    if(it && it.base.t === slot) player.equip[slot] = it;   // ein Schild im Stiefelfach wäre kein Spielstand
  }

  // Position: die Karte ist dieselbe, also gilt sie. Ein von Hand gesetzter Wert
  // könnte trotzdem in einem Felsen liegen — dann fällt sie auf den Dienstantritt
  // zurück, statt den Spieler festzusetzen.
  const px = clamp(+p.x || 0, TS, (MW - 1) * TS), py = clamp(+p.y || 0, TS, (MH - 1) * TS);
  const gueltig = walkT(Math.floor(px / TS), Math.floor(py / TS));
  player.x = gueltig ? px : SPAWN.x;
  player.y = gueltig ? py : SPAWN.y;
  camSnap();

  // K1: Die Zulagen zurück in die Kartei. Eingelegt wird ausdrücklich über
  // zulageAnlegen() und nicht über ein gesetztes angelegt:true — Fachzahl
  // (zulageSlots), Stapelgrenze und die Regel "eine je Sache" stehen dort, und
  // sie hier abzuschreiben wäre die F1-Falle. Ein manipulierter Stand mit zehn
  // eingelegten Karten bekommt damit genau so viele, wie die Mappe auf dieser
  // Stufe fasst, ohne dass hier eine zweite Zahl gepflegt werden muss.
  // Läuft nach player.level, weil zulageSlots() genau den liest.
  const rohKarten = Array.isArray(p.zulagenKartei) ? p.zulagenKartei.slice(0, 99) : [];
  const wollenAngelegt = [];
  player.zulagenKartei = [];
  for(const z of rohKarten){
    if(!z || !ZULAGE[z.familie]) continue;                 // unbekannte Familie faellt raus
    player.zulagenKartei.push({familie: z.familie, stufe: clamp(z.stufe | 0, 1, 3), angelegt: false});
    wollenAngelegt.push(!!z.angelegt);
  }
  player.zulagenZiehungen = clamp(p.zulagenZiehungen | 0, 0, 99);
  player.zulagenAngebot = Array.isArray(p.zulagenAngebot) && p.zulagenAngebot.length
    ? p.zulagenAngebot.slice(0, 3).filter(z => z && ZULAGE[z.familie])
        .map(z => ({familie: z.familie, stufe: clamp(z.stufe | 0, 1, 3)}))
    : null;
  if(player.zulagenAngebot && !player.zulagenAngebot.length) player.zulagenAngebot = null;
  wollenAngelegt.forEach((w, i) => { if(w) zulageAnlegen(i, true); });
  // Und die Vorlage nachziehen, falls der Stand offene Ziehungen ohne Angebot
  // trägt. Im regulären Spiel gibt es diesen Zustand nicht (jede Bewilligung
  // ruft die Funktion selbst wieder auf), ein von Hand gesetzter Stand könnte
  // ihn aber tragen — dann verschluckte er sonst die Aufstiege. Die Funktion
  // steigt von selbst aus, wenn nichts zu tun ist.
  zulagenAngebotSicherstellen();

  recalc();                          // erst Ausrüstung und Zulagen, dann die abgeleiteten Werte
  player.hp = clamp(p.hp | 0, 1, derived.maxHp);
  player.mana = clamp(p.mana | 0, 0, derived.maxMana);
  knCheckFluchEquipped();            // ein geladener Fluch muss wirken wie ein angelegter

  shiftT = clamp(+k.shiftT || 0, 1, CONFIG.schichtDauer);
  overtimeT = clamp(+k.overtimeT || 0, 0, 60);
  shiftKillsTotal = clamp(k.killsTotal | 0, 0, 99999);
  shiftKillsByType = {};
  if(k.killsByType) for(const t in k.killsByType) if(MONDEF[t]) shiftKillsByType[t] = clamp(k.killsByType[t] | 0, 0, 99999);
  auftragStand = clamp(k.auftragStand | 0, 0, 99999);
  auftragVerletzt = !!k.auftragVerletzt;
  auftragFertig = !!k.auftragFertig || !!(amt.auftrag && amt.auftrag.bezahlt);
  langSchicht = {};
  if(k.langSchicht && typeof k.langSchicht === 'object')
    for(const key in k.langSchicht) if(k.langSchicht[key]) langSchicht[key] = true;

  knBegruessungPending = null;       // die Begrüßung gehört dem Antritt, nicht der Fortsetzung
  updateHUD();
  return true;
}

// Die beiden Knöpfe des Startbilds.
function spielstandFortsetzen(){ if(!spielstandEinloesen()) showStartScreen(); }
function spielstandVerwerfen(){ spielstandLoeschen(); startGame(); }

// Geschrieben wird, wenn der Bildschirm weggeht — nicht bei beforeunload, der
// ist auf dem Telefon praktisch wertlos. visibilitychange und pagehide feuern
// dort zuverlässig, und genau sie sind der Moment, den ein Anruf auslöst.
document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'hidden') spielstandSchreiben(); });
window.addEventListener('pagehide', () => { spielstandSchreiben(); });

// --- Export und Import ------------------------------------------------------
// Die Ablage ist kündbar: Browserdaten löschen nimmt alles mit, ein Gerätewechsel
// nimmt nichts mit, und der Speicher hängt an der Origin — localhost und die
// ausgelieferte Seite sind zwei verschiedene Ablagen. Dagegen hilft nur, dass
// der Spieler seinen Stand in die Hand bekommt.
//
// Der Import prüft ausdrücklich NICHT die Inhalte. Er prüft die Hülle, schreibt
// die bekannten Schlüssel und lädt die Seite neu — danach laufen loadAmt(),
// loadKladde(), loadKn() und spielstandLesen() darüber, mit ihren Whitelists
// und ihren Klemmen. Eine zweite Prüfung hier wäre eine zweite Wahrheit.
const SPEICHER_SCHLUESSEL = [AMT_KEY, KLADDE_KEY, KN_KEY, SPIEL_KEY];
const EXPORT_TYP = 'monstralministerium-spielstand';

function exportDaten(){
  const d = {typ: EXPORT_TYP, v: SPIEL_VERSION, datum: new Date().toISOString(), daten: {}};
  for(const k of SPEICHER_SCHLUESSEL){
    try{ const raw = localStorage.getItem(k); if(raw) d.daten[k] = raw; }catch(_){}
  }
  return JSON.stringify(d);
}

function exportDateiname(){
  const d = new Date();
  const zz = n => String(n).padStart(2, '0');
  return `monstralministerium-${d.getFullYear()}-${zz(d.getMonth()+1)}-${zz(d.getDate())}-schicht${amt.schichten}.json`;
}

function exportDatei(){
  try{
    const blob = new Blob([exportDaten()], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = exportDateiname();
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return true;
  }catch(_){ return false; }
}

// Rückgabe ist eine Meldung für den Spieler, kein Wahrheitswert: der Import ist
// die eine Stelle, an der jemand wissen muss, WARUM es nicht ging.
function importText(txt){
  let d = null;
  try{ d = JSON.parse(txt); }catch(_){ return 'Das ist keine gültige Spielstand-Datei.'; }
  if(!d || d.typ !== EXPORT_TYP || !d.daten || typeof d.daten !== 'object')
    return 'Die Datei gehört nicht zu diesem Spiel.';
  const geschrieben = [];
  for(const k of SPEICHER_SCHLUESSEL){
    const raw = d.daten[k];
    if(typeof raw !== 'string') continue;
    try{ JSON.parse(raw); }catch(_){ continue; }      // Hülle geprüft, Inhalt macht der Loader
    try{ localStorage.setItem(k, raw); geschrieben.push(k); }catch(_){
      return 'Der Speicher nimmt nichts an. Privates Fenster?';
    }
  }
  if(!geschrieben.length) return 'In der Datei stand kein Spielstand.';
  for(const k of SPEICHER_SCHLUESSEL) if(geschrieben.indexOf(k) < 0){
    try{ localStorage.removeItem(k); }catch(_){}      // sonst mischt sich der alte Stand unter den neuen
  }
  return null;
}

// --- speicherAssert(): der einundzwanzigste Guard ---------------------------
// Bauform wie goldAssert(): spiegelt alles, was er anfasst, stellt es im finally
// zurück, wirft nie und meldet nur. Er prüft ausdrücklich den RUNDWEG durch die
// Ablage — schreiben, lesen, klemmen — und nicht bloß die Form der Funktionen.
// Genau diesen Rundweg hat im ganzen Haus bis SP1 kein Prüfer gemessen, und
// genau deshalb konnten zwei Felder jahrelang geschrieben und nie geladen
// werden. Ein Guard, der nur das laufende Skript ansieht, hätte SP1 nie
// gefunden; dieser hier hätte es.
function speicherAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('Spielstand:', m, ...r); };
  const rohEcht = (() => { try{ return localStorage.getItem(SPIEL_KEY); }catch(_){ return null; } })();
  const stateEcht = state, schichtenEcht = amt.schichten, deadEcht = player.dead;
  const kammerEcht = kammer, levelEcht = currentLevel, endeEcht = shiftEndPending, szeneEcht = szeneAktiv;
  try{
    // (1) Das Tor. Jede Bedingung aus spielstandErlaubt() einzeln gesetzt und
    // einzeln wieder gelöst — ein Tor, das immer offen ist, ist keins.
    state = 'play'; player.dead = false; kammer = null; currentLevel = 1;
    shiftEndPending = false; szeneAktiv = null;
    const basis = CONFIG.schichtModus;
    if(basis && !spielstandErlaubt()) fehler('Tor bleibt im Normalfall zu');
    for(const [name, setzen, zurueck] of [
      ['Kammer',        () => kammer = {},          () => kammer = null],
      ['Schattenland',  () => currentLevel = 2,     () => currentLevel = 1],
      ['Tod',           () => player.dead = true,   () => player.dead = false],
      ['Überstunden',   () => shiftEndPending = true,() => shiftEndPending = false],
      ['Szene',         () => szeneAktiv = {},      () => szeneAktiv = null],
      ['Panelzustand',  () => state = 'feierabend', () => state = 'play'],
    ]){
      setzen();
      if(spielstandErlaubt()) fehler('Tor öffnet, obwohl es nicht darf', name);
      zurueck();
    }
    if(basis && !spielstandErlaubt()) fehler('Tor bleibt nach dem Zurücksetzen zu');

    // (2) Der Rundweg. Ein von Hand gebauter Stand geht durch die Ablage und
    // muss unverändert wieder herauskommen. Geprüft wird über spielstandLesen(),
    // also inklusive Frischeprüfung.
    const probe = {v: SPIEL_VERSION, schichten: amt.schichten, stufe: 7, restT: 600,
                   spieler: {level: 7, gold: 123}, schicht: {shiftT: 600}};
    try{ localStorage.setItem(SPIEL_KEY, JSON.stringify(probe)); }catch(_){}
    const zurueckGelesen = spielstandLesen();
    if(!zurueckGelesen) fehler('frisch geschriebener Stand kommt nicht zurück');
    else if(zurueckGelesen.spieler.level !== 7 || zurueckGelesen.spieler.gold !== 123)
      fehler('Rundweg verändert Werte', zurueckGelesen.spieler);

    // (3) Die Frischeprüfung. Derselbe Stand, eine Schicht weiter, muss weg sein
    // — sonst wäre Fortsetzen eine zweite Abrechnung derselben Schicht.
    amt.schichten = schichtenEcht + 1;
    if(spielstandLesen()) fehler('Stand einer abgerechneten Schicht gilt weiter');
    amt.schichten = schichtenEcht;
    // Und eine falsche Version darf ebenso wenig durchkommen.
    try{ localStorage.setItem(SPIEL_KEY, JSON.stringify(Object.assign({}, probe, {v: SPIEL_VERSION + 1}))); }catch(_){}
    if(spielstandLesen()) fehler('Stand mit fremder Versionsnummer gilt');

    // (4) Die Klemmen auf der Ausrüstung, gegen die Tabellen statt gegen Zahlen
    // aus der Luft. Ein von Hand aufgeblasenes Stück muss auf das zurückfallen,
    // was das Spiel selbst erzeugen könnte.
    const wild = itemGeklemmt({base: {t: 'weapon', name: 'Fälschung', dmg: [99999, 99999], armor: 5000, kraft: 400, aps: 99, tier: 77},
                               rar: 99, affixes: [{k: 'dmg', v: 99999}, {k: 'gibtsnicht', v: 5}],
                               effect: {k: 'gibtsnicht', stufe: 99}, fluch: 'gibtsnicht'});
    if(!wild) fehler('gültige Hülle wurde ganz verworfen');
    else{
      if(wild.base.dmg[1] > SPIEL_DECKEL.dmg) fehler('Schaden nicht geklemmt', wild.base.dmg);
      if(wild.base.armor > SPIEL_DECKEL.armor) fehler('Rüstung nicht geklemmt', wild.base.armor);
      if(wild.base.kraft > SPIEL_DECKEL.kraft) fehler('Kraftbedarf nicht geklemmt', wild.base.kraft);
      if(wild.rar > 4 || wild.base.tier > 4) fehler('Seltenheit nicht geklemmt', wild.rar, wild.base.tier);
      if(wild.affixes.length !== 1) fehler('unbekannter Affix nicht verworfen', wild.affixes);
      else if(wild.affixes[0].v > SPIEL_DECKEL.affix.dmg) fehler('Affixwert nicht geklemmt', wild.affixes[0]);
      if(wild.effect) fehler('unbekannte Wirkung nicht verworfen', wild.effect);
      if(wild.fluch) fehler('unbekannter Fluch nicht verworfen', wild.fluch);
    }
    for(const murks of [null, {}, {base: {}}, {base: {t: 'hut', name: 'Hut'}}, {base: {t: 'weapon'}}])
      if(itemGeklemmt(murks)) fehler('Unsinn wurde zu einem Gegenstand', murks);

    // (5) Export und Import. Die Hülle muss halten, und Fremdes muss abprallen —
    // mit einem Grund, denn der Import ist die eine Stelle, an der jemand wissen
    // muss, warum es nicht ging.
    const roh = exportDaten();
    let d = null;
    try{ d = JSON.parse(roh); }catch(_){ fehler('Export ist kein gültiges JSON'); }
    if(d && d.typ !== EXPORT_TYP) fehler('Export trägt die falsche Kennung', d.typ);
    if(d && !d.daten) fehler('Export hat kein Datenfach');
    for(const murks of ['', 'kein json', '{}', '{"typ":"etwas-anderes","daten":{}}', JSON.stringify({typ: EXPORT_TYP, daten: {}})])
      if(!importText(murks)) fehler('Import nahm etwas an, das er ablehnen muss', murks);

    // (6) Die Schlüsselliste. Jeder Schlüssel, den das Spiel beschreibt, muss im
    // Export stehen — sonst wandert beim Gerätewechsel ein Teil nicht mit, und
    // das merkt niemand, bis es zu spät ist.
    for(const k of [AMT_KEY, KLADDE_KEY, KN_KEY, SPIEL_KEY])
      if(SPEICHER_SCHLUESSEL.indexOf(k) < 0) fehler('Schlüssel fehlt im Export', k);
  } finally {
    state = stateEcht; amt.schichten = schichtenEcht; player.dead = deadEcht;
    kammer = kammerEcht; currentLevel = levelEcht; shiftEndPending = endeEcht; szeneAktiv = szeneEcht;
    try{
      if(rohEcht === null) localStorage.removeItem(SPIEL_KEY);
      else localStorage.setItem(SPIEL_KEY, rohEcht);
    }catch(_){}
  }
  if(ok) console.log('Spielstand: Tor, Rundweg, Frische, Klemmen und Export in Ordnung.');
  else console.error('Spielstand: Guard fehlgeschlagen, siehe obige Zeilen.');
  return ok;
}
speicherAssert();

// --- Die drei Knöpfe im Inventar --------------------------------------------
const SPEICHER_HINWEIS = 'Das Spiel speichert auf diesem Gerät und automatisch, sobald der Tab in den Hintergrund geht.';
function speicherMeldung(txt, art){
  const e = el('speicherInfo');
  if(!e) return;
  e.textContent = txt;
  e.className = art || '';
  if(art) setTimeout(() => { if(e.textContent === txt){ e.textContent = SPEICHER_HINWEIS; e.className = ''; } }, 6000);
}

// Warum das Speichern gerade nicht geht, ist eine echte Auskunft und keine
// Ausrede: die Gründe stehen in spielstandErlaubt(), und der Spieler hört den,
// der auf ihn zutrifft. Eine Meldung "ging nicht" ohne Grund wäre die Tapete,
// vor der G6 warnt.
function speicherGrund(){
  if(!CONFIG.schichtModus) return 'Im freien Spiel gibt es keine Schicht zum Speichern.';
  if(state !== 'play') return 'Erst weiterspielen, dann speichern.';
  if(kammer) return 'In einer Kammer wird nicht gespeichert. Erst hinaus.';
  // IN1: derselbe Grund wie bei der Kammer. Der Spielstand kennt die Oberwelt;
  // ein Stand, der in einem Innenraum steht, muesste den Raum mitsichern, und
  // ein halb gesicherter Ort ist schlimmer als keiner.
  if(innen) return 'In einem Haus wird nicht gespeichert. Erst hinaus.';
  if(currentLevel !== 1) return 'Im Schattenland wird nicht gespeichert. Erst zurück.';
  if(player.dead) return 'Nach dem Dienstende gibt es nichts mehr zu sichern.';
  if(shiftEndPending) return 'Die Schicht läuft schon aus. Der Feierabend kommt von selbst.';
  return 'Speichern ging nicht. Der Browser nimmt nichts an, vielleicht ein privates Fenster.';
}

if(el('spSpeichern')) el('spSpeichern').onclick = () => {
  if(spielstandSchreiben()) speicherMeldung('Spielstand gesichert. Beim nächsten Start steht "Schicht fortsetzen" im Menü.', 'ok');
  else speicherMeldung(speicherGrund(), 'warn');
};
if(el('spExport')) el('spExport').onclick = () => {
  spielstandSchreiben();   // läuft gerade eine Schicht, kommt sie mit in die Datei; sonst tut die Zeile nichts
  if(exportDatei()) speicherMeldung('Datei erzeugt. Sie enthält Amt, Kladde, Knöterich und den Spielstand.', 'ok');
  else speicherMeldung('Der Export ging nicht. Blockiert der Browser den Download?', 'warn');
};
if(el('spImport')) el('spImport').onclick = () => { const d = el('spDatei'); if(d){ d.value = ''; d.click(); } };
if(el('spDatei')) el('spDatei').onchange = ev => {
  const f = ev.target.files && ev.target.files[0];
  if(!f) return;
  const leser = new FileReader();
  leser.onerror = () => speicherMeldung('Die Datei ließ sich nicht lesen.', 'warn');
  leser.onload = () => {
    const fehler = importText(String(leser.result));
    if(fehler) return speicherMeldung(fehler, 'warn');
    // Neu laden ist hier kein Notbehelf, sondern der Entwurf: erst dadurch
    // laufen die vorhandenen Loader über die frischen Daten, mit ihren
    // Whitelists und Klemmen, statt dass ein zweiter Weg sie umgeht.
    speicherMeldung('Übernommen. Die Seite lädt neu.', 'ok');
    setTimeout(() => location.reload(), 700);
  };
  leser.readAsText(f);
};

// aktStand() ist nach oben gewandert, siehe amt-Literal weiter oben (W5-Falle:
// setzeKammerTueren() lief sonst gegen die TDZ).

// ===========================================================================
//  W6: RANG UND LAUFBAHN — Weltbibel Kapitel 17 (18.1-18.12). Amtsbezeichnung,
//  Laufbahngruppe und Dienstverhältnis sind ABGELEITET aus amt.schichten,
//  genau wie aktStand() oben — kein neues amt-Feld, keine loadAmt()-Ladezeile,
//  keine zweite Wahrheitsquelle. Eine Beförderung ist kein Ereignis mit
//  Nebenwirkung, sondern eine Eigenschaft der Zahl amt.schichten: nichts wird
//  angewendet, nichts gespeichert, jedes Neurendern ist von selbst idempotent.
//
//  Alle Texte hier sind freier Panel-Text (#ovPanel, #ausweis) und tragen
//  deshalb KEINEN Zeichendeckel, s. Kommentar bei knAssertCaps(). Wandert je
//  ein Rang-Text in eine Sprechblase, gilt 48/32/44 und die Zeile gehört dort
//  hinein, nicht hierher.
// ===========================================================================

const RANG_GRUPPEN = ['einfacher Dienst', 'mittlerer Dienst', 'gehobener Dienst', 'höherer Dienst'];
const RANG_VERH    = ['auf Widerruf', 'auf Probe', 'auf Lebenszeit'];

// Wörtlich aus 18.3/18.4. Eintrag i gilt ab Schicht i*5, Eintrag 0 auch bei
// amt.schichten === 0 — niemand ist je ohne Titel (18.6.1).
const RAENGE = [
  {t:'Monsterangelegenheitenanwärter',         g:0, v:0},                //  0  ab Schicht  1
  {t:'Monstralamtsgehilfe',                    g:0, v:0},                //  1  ab Schicht  5
  {t:'Monstralamtsmeister',                    g:0, v:1, spitze:true},   //  2  ab Schicht 10
  {t:'Monstralsekretär',                       g:1, v:1},                //  3  ab Schicht 15
  {t:'Monstralobersekretär',                   g:1, v:1},                //  4  ab Schicht 20
  {t:'Monstralamtsinspektor',                  g:1, v:1, spitze:true},   //  5  ab Schicht 25
  {t:'Monstralinspektor',                      g:2, v:2},                //  6  ab Schicht 30
  {t:'Monstraloberinspektor',                  g:2, v:2},                //  7  ab Schicht 35
  {t:'Monstralamtmann / Monstralamtfrau',      g:2, v:2},                //  8  ab Schicht 40
  {t:'Monstralamtsrat',                        g:2, v:2},                //  9  ab Schicht 45
  {t:'Obermonstralamtsrat',                    g:2, v:2, spitze:true},   // 10  ab Schicht 50
  {t:'Monstralrat',                            g:3, v:2},                // 11  ab Schicht 55
  {t:'Obermonstralrat',                        g:3, v:2},                // 12  ab Schicht 60
  {t:'Monstraldirigent',                       g:3, v:2},                // 13  ab Schicht 65
  {t:'Erster Monstraldirigent',                g:3, v:2},                // 14  ab Schicht 70
  {t:'Monstraldirektor',                       g:3, v:2},                // 15  ab Schicht 75
  {t:'Leitender Monstraldirektor',             g:3, v:2},                // 16  ab Schicht 80
  {t:'Generalmonstraldirektor',                g:3, v:2},                // 17  ab Schicht 85
  {t:'Monstralminister ohne Geschäftsbereich', g:3, v:2, spitze:true},   // 18  ab Schicht 90
];

// 18.4: jenseits des letzten benannten Rangs läuft es mit römischen Ziffern im
// Kreis weiter, nur der letzte Titel wiederholt sich. Greedy-Konverter, deckt
// jede Schichtzahl ab und liefert nie den leeren String.
const ROEM = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],
              [50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
function roemisch(n){ let r = '', v = Math.max(1, n|0); for(const [w,z] of ROEM) while(v >= w){ r += z; v -= w; } return r; }

const rangStufe = () => Math.floor(amt.schichten / 5);
// GW3: beidseitig klemmen. rangNameVon() klemmt nach unten, rangDef() klemmte
// nur nach oben — ein negativer amt.schichten aus einem manipulierten Spielstand
// lieferte undefined, und weil rangAssert() auf Skriptebene läuft, riss der
// TypeError das gesamte Inline-Skript beim Laden mit.
const rangDef   = () => RAENGE[Math.max(0, Math.min(rangStufe(), RAENGE.length - 1))];
// rangNameVon() ist die Wahrheitsquelle, rangName() nur der Aufruf mit der
// eigenen Stufe. 18.5 braucht die Nachbarstufen: Zwirn schmeichelt einen Rang
// zu hoch, Milb stuft einen zu niedrig ein. Eine Rechnung, kein zweiter Ort.
function rangNameVon(i){
  const letzt = RAENGE.length - 1, s = Math.max(0, i | 0);
  return s <= letzt ? RAENGE[s].t : RAENGE[letzt].t + ' ' + roemisch(s - letzt + 1);
}
function rangName(){ return rangNameVon(rangStufe()); }
const rangGruppe      = () => rangDef().g;
const rangGruppeName  = () => RANG_GRUPPEN[rangDef().g] + (rangDef().spitze ? ', Spitze' : '');
const rangVerhaeltnis = () => RANG_VERH[rangDef().v];

// 18.7: nur zwei Insignien wirken echt, der Rest ist Deko. Eine Wahrheitsquelle
// je Insignie, gleiches Prinzip wie beim Rang selbst — sonst die Falle aus F1
// (zwei Stellen behaupten dasselbe, driften irgendwann auseinander). Das
// Dienstsiegel hängt bewusst am bestehenden Jahresbonus amt.bonusNachwachsen,
// nicht am Rang, genau wie 18.7 es beschreibt.
const INSIGNIEN = [
  {n:'Namensschild an der Tür, handbeschrieben',            wenn:()=> true},
  {n:'Namensschild, gedruckt',                              wenn:()=> rangStufe() >= 2},
  {n:'Ein eigener Stempel',                                 wenn:()=> rangGruppe() >= 1},
  {n:'Fensterplatz',                                        wenn:()=> rangStufe() >= 5},
  {n:'Ernennungsurkunde, gerahmt',                          wenn:()=> rangGruppe() >= 2},
  {n:'Zeichnungsbefugnis',        k:'zeichnung',  wirkung:true, wenn:()=> rangGruppe() >= 2},
  {n:'Das Dienstsiegel',                  k:'siegel',                wenn:()=> (amt.bonusNachwachsen||0) > 0},
  {n:'Zweiter Schlüssel zur Registratur', k:'schluessel', wirkung:true, wenn:()=> rangGruppe() >= 3},
  {n:'Ein Vorzimmer',                                       wenn:()=> rangStufe() >= 15},
];
const INSIGNIE = {}; for(const i of INSIGNIEN) if(i.k) INSIGNIE[i.k] = i;
const rangZeichnungsbefugt = () => INSIGNIE.zeichnung.wenn();
const rangSchluessel       = () => INSIGNIE.schluessel.wenn();
// W5: k:'siegel' bewusst ohne wirkung:true — rangAssert() zählt hart genau zwei
// wirkende Insignien (Zeichnungsbefugnis, Registraturschlüssel), das bleibt W6.
// Eine Wahrheitsquelle für Akt V, Puzzleteil 1 ("Der Stift"), statt eines
// eigenen W5-Prädikats auf amt.bonusNachwachsen (die F1-Falle aus 18.7).
const rangDienstsiegel = () => INSIGNIE.siegel.wenn();

// --- Beförderungszeremonie (18.12): läuft im bestehenden Jahresgespräch-Panel.
// Jedes Jahresgespräch ist zwingend eine Beförderung (10 | n ⟹ 5 | n), deshalb
// kein bedingter Zweig — ein if wäre eine tote Verzweigung.
const RANG_URKUNDE = () => [
  'URKUNDE ÜBER DIE HEBUNG EINES DIENSTPOSTENS',
  'Gemäß Geschäftsordnung des Monstral Ministeriums, Abteilung Personal, wird hiermit bezeugt:',
  'Der Dienstposten Außendienst, Sachgebiet 7, wird mit Wirkung von heute gehoben.',
  `Neue Amtsbezeichnung: ${rangName()}.`,
  `Laufbahngruppe: ${rangGruppeName()}.`,
  `Dienstverhältnis: ${rangVerhaeltnis()}.`,
  'Die Hebung betrifft den Dienstposten, nicht die Person, die ihn heute bekleidet.',
  'Ansprüche aus dieser Urkunde bestehen nur für die Dauer der Dienstzeit.',
  'Ein Widerspruch ist nicht vorgesehen. Ein Widerspruch war noch nie vorgesehen.',
  'Diese Urkunde wird in einfacher Ausfertigung erstellt und sogleich ausgehändigt.',
  'Die Ausfertigung verbleibt beim Amt. Sie sehen sie jetzt zum ersten und letzten Mal.',
  'Vordermühl, heute.',
  'Gezeichnet: Bürgermeister Alfons Zwirn.',
  'Amtssiegel angebracht. Es wackelt etwas.',
];

const RANG_ZEREMONIE_FIX = [
  'Zwirn händigt die Urkunde aus. Das ist der Rechtsakt, nicht die Rede.',
  '„Auf die Form!“ Alle im Raum sagen es gleichzeitig.',
  'Der Amtsmarsch setzt ein. Fagott, wie immer.',
  'Nach dem dritten Takt ruft jemand dazwischen. Der Marsch bricht ab.',
];

// 18.12 Punkt 5: von Beförderung zu Beförderung wärmer, beim ersten Mal
// "Notiert.", beim letzten Mal etwas anderes. Index 0 = Schicht 10 (gleiche
// Indexrechnung wie JAHRES_BONI in showJahresgespraech()), Index 8 = Schicht
// 90. RANG_KNOETERICH_WEITER trägt alles danach.
const RANG_KNOETERICH = [
  'Notiert.',
  'Wieder eine Stufe. Wird vermerkt.',
  'Auf Lebenszeit. Das bleibt jetzt so.',
  'Amtmann oder Amtfrau, wie es passt. Beides steht Ihnen.',
  'Obermonstralamtsrat. Spitze des gehobenen Dienstes. Respekt, ehrlich gesagt.',
  'Höherer Dienst. Das hätte ich nicht gedacht, nicht bei Ihnen.',
  'Erster Monstraldirigent. Der Titel braucht länger als der Handschlag.',
  'Leitender Monstraldirektor. Fast hätte ich applaudiert.',
  'Monstralminister ohne Geschäftsbereich. Ich hätte nie gedacht, dass ich das sagen darf.',
];
const RANG_KNOETERICH_WEITER = 'Weiter geht es trotzdem. Vermerkt, wie immer.';

function rangZeremonieBlock(){
  const idx = Math.floor(amt.schichten/10) - 1;   // 0 bei Schicht 10, gleiche Rechnung wie oben
  // GW13: idx >= 0 ist Pflicht. Bei Schicht 0 wurde idx zu -1, die obere Schranke
  // war erfuellt, und RANG_KNOETERICH[-1] rendete woertlich Knoeterich: "undefined".
  const knSatz = idx >= 0 && idx < RANG_KNOETERICH.length ? RANG_KNOETERICH[idx] : RANG_KNOETERICH_WEITER;
  const urkunde = RANG_URKUNDE().map(z => `<p style="margin:4px 0;">${z}</p>`).join('');
  return `
    <div style="border-top:1px solid #5a4a2d;margin-top:12px;padding-top:10px;">
      <b style="color:#f4d97a;">Beförderungszeremonie</b>
      <div style="max-height:38vh;overflow-y:auto;text-align:left;background:rgba(0,0,0,.4);
                  padding:10px;border-radius:8px;margin:8px 0;font-size:calc(12px * var(--fs));">${urkunde}</div>
      <p style="font-size:calc(12px * var(--fs));">${RANG_ZEREMONIE_FIX[0]}</p>
      <p style="font-size:calc(12px * var(--fs));">${RANG_ZEREMONIE_FIX[1]}</p>
      <p style="font-size:calc(12px * var(--fs));color:#9a8a5f;">${RANG_ZEREMONIE_FIX[2]}</p>
      <p style="font-size:calc(12px * var(--fs));color:#9a8a5f;">${RANG_ZEREMONIE_FIX[3]}</p>
      <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">Knöterich: „${knSatz}“</p>
    </div>`;
}

// --- Dienstbericht: Rechtsakt vs. abgeleiteter Wert (18.1). Bei einem Zehner-
// schritt liegt die Urkunde erst im Jahresgespräch bereit; bei den Fünfer-
// schritten dazwischen wird die Hebung direkt gemeldet. Die zwei Beats bei
// Schicht 25 und 45 laufen hier, weil dort keine Zeremonie stattfindet — kein
// neuer Merker nötig, amt.schichten passiert beide Werte genau einmal.
const RANG_BEAT25 = [
  'Sie sind jetzt Monstralamtsinspektor.',
  'Das klingt höher als Monstralinspektor. Ist es nicht.',
  'Amtsinspektor kommt vor Inspektor, mittlerer Dienst statt gehobener.',
  'Ich weiß, das ist verwirrend. Es ist trotzdem richtig.',
];
const RANG_BEAT45_WORT = 'Kollege.';
const RANG_BEAT45_ZEILEN = [
  'Knöterich steht auf. Amtsrat a. D., gleicher Rang wie Sie jetzt.',
  'Er setzt sich wieder. Mehr sagt er nicht.',
];

function rangBerichtBlock(){
  const s = amt.schichten;
  if(s === 0 || s % 5 !== 0) return '';
  if(s % 10 === 0) return `<p style="font-size:calc(12px * var(--fs));color:#f4d97a;">Eine Urkunde liegt zur Aushändigung bereit. Jahresgespräch folgt.</p>`;
  let zeile = `<p style="font-size:calc(12px * var(--fs));color:#f4d97a;">Die Stelle wurde gehoben. Neue Amtsbezeichnung: ${rangName()}, ${rangGruppeName()}, ${rangVerhaeltnis()}.</p>`;
  if(s === 25) zeile += RANG_BEAT25.map(z => `<p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">Knöterich: „${z}“</p>`).join('');
  if(s === 45) zeile += `<p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">Knöterich: „${RANG_BEAT45_WORT}“</p>` +
    RANG_BEAT45_ZEILEN.map(z => `<p style="font-size:calc(11px * var(--fs));color:#9a8a5f;">${z}</p>`).join('');
  return zeile;
}

// --- Dienstausweis (18.8): Bildschirm aus dem Inventar, Bauform wie #kessel. ---
const AUSWEIS_TEXTE = {
  titel: 'DIENSTAUSWEIS',
  labelAmt: 'Amtsbezeichnung',
  labelVerh: 'Verhältnis',
  labelPosten: 'Dienstposten',
  posten: 'Außendienst, Sachgebiet 7',
  labelGueltig: 'Gültig',
  gueltig: 'bis heute Abend',
  // P1: Das Haus trägt ein, was es sieht, und benennt es nach der Farbtabelle
  // des Materiallagers. Die einzige Stelle, an der ein Tonname im Spiel steht.
  labelHaar: 'Haarfarbe',
  rueckgabe: 'Der Ausweis ist bei Dienstschluss unaufgefordert zurückzugeben.',
  insignienUeberschrift: 'Insignien',
};

// --- Guard, Bauform wie knAssertCaps()/auftragAssertBrett() weiter oben. TDZ-
// sicher: liest nur amt (deklariert und geladen weit oberhalb) und die Tabellen
// aus diesem Block selbst, nichts aus AUFTRAG_TYPEN/BIOME_MOBS/DORF_FIGUREN.
function rangAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('W6 Rang:', m, ...r); };
  const EMOJI = PRUEF_EMOJI;
  const GEHEIM = PRUEF_GEHEIM;
  const text = (txt, feld) => {
    if(!txt) return fehler('Text leer', feld);
    if(txt.indexOf('undefined') >= 0) fehler('undefined im Text', feld, txt);   // GW13
    if(/[—–]/.test(txt)) fehler('Gedankenstrich statt Interpunkt', feld, txt);
    if(EMOJI.test(txt))  fehler('Emoji im Figurentext', feld, txt);
    for(const g of GEHEIM) if(txt.indexOf(g) >= 0) fehler('Sperrvermerk: Kesselgrammatik im Text', g, txt);
  };

  // (1) Tabellenform
  for(const r of RAENGE){
    if(!r.t) fehler('Rang ohne Bezeichnung', r);
    if(!(r.g >= 0 && r.g < RANG_GRUPPEN.length)) fehler('Rang mit ungültiger Gruppe', r.t, r.g);
    if(!(r.v >= 0 && r.v < RANG_VERH.length)) fehler('Rang mit ungültigem Verhältnis', r.t, r.v);
    if('spitze' in r && r.spitze !== true) fehler('spitze-Feld gesetzt, aber nicht true', r.t);
  }
  // (2) Monotonie: eine gehobene Stelle sinkt nicht (18.2), das ist Beamtenrecht.
  for(let i = 1; i < RAENGE.length; i++){
    if(RAENGE[i].g < RAENGE[i-1].g) fehler('Laufbahngruppe sinkt', RAENGE[i].t);
    if(RAENGE[i].v < RAENGE[i-1].v) fehler('Dienstverhältnis sinkt', RAENGE[i].t);
  }
  // (3) Ankerprüfung gegen 18.3/18.4 — fängt eine eingeschobene Zeile, die die
  // halbe Laufbahn um fünf Schichten verschiebt.
  // GW15: vollstaendige Sollkonstante statt vier Ankern. Die vier Anker fingen
  // eine eingeschobene Zeile, aber keine Verfaelschung: vertauschte Titel,
  // gesenkte Gruppe, geaendertes Verhaeltnis blieben unbemerkt. Das hier ist
  // bewusst eine ZWEITE, unabhaengige Abschrift aus 18.3/18.4 — nicht eine
  // Kopie, die das Lesen der Quelle ersetzt, sondern der Gegenpart, gegen den
  // die Quelle geprüft wird.
  if(RAENGE.length !== 19) fehler('RAENGE hat nicht 19 Einträge', RAENGE.length);
  const SOLL = [
    ['Monsterangelegenheitenanwärter',        0, 0, false],
    ['Monstralamtsgehilfe',                   0, 0, false],
    ['Monstralamtsmeister',                   0, 1, true ],
    ['Monstralsekretär',                      1, 1, false],
    ['Monstralobersekretär',                  1, 1, false],
    ['Monstralamtsinspektor',                 1, 1, true ],
    ['Monstralinspektor',                     2, 2, false],
    ['Monstraloberinspektor',                 2, 2, false],
    ['Monstralamtmann / Monstralamtfrau',     2, 2, false],
    ['Monstralamtsrat',                       2, 2, false],
    ['Obermonstralamtsrat',                   2, 2, true ],
    ['Monstralrat',                           3, 2, false],
    ['Obermonstralrat',                       3, 2, false],
    ['Monstraldirigent',                      3, 2, false],
    ['Erster Monstraldirigent',               3, 2, false],
    ['Monstraldirektor',                      3, 2, false],
    ['Leitender Monstraldirektor',            3, 2, false],
    ['Generalmonstraldirektor',               3, 2, false],
    ['Monstralminister ohne Geschäftsbereich',3, 2, true ],
  ];
  SOLL.forEach(([t, g, v, spitze], i) => {
    const r = RAENGE[i];
    if(!r) return fehler('Rang fehlt', i, t);
    if(r.t !== t) fehler('Rangbezeichnung weicht von 18.3/18.4 ab', i, t, r.t);
    if(r.g !== g) fehler('Laufbahngruppe weicht ab', t, g, r.g);
    if(r.v !== v) fehler('Dienstverhältnis weicht ab', t, v, r.v);
    if(!!r.spitze !== spitze) fehler('Spitzenamt-Kennzeichnung weicht ab', t, spitze, !!r.spitze);
  });

  // (4)+(5)+(6) Abbildung mit Spiegelung, Wechselpunkte, Zeremonie-Kopplung.
  // amt.schichten wird gespiegelt und exakt wiederhergestellt, kein saveAmt() —
  // wörtlich das Idiom aus auftragAssertBrett().
  const echt = amt.schichten;
  // GW26i: try/finally. Der Guard läuft auf Skriptebene, nach loadAmt() und vor
  // jedem Speichern. Wirft eine gerufene Funktion mitten im Sweep, blieb
  // amt.schichten auf dem Simulationswert stehen und riss den Skriptrest mit.
  try {
  let vorher = null;
  for(let s = 0; s <= 200; s++){
    amt.schichten = s;
    const name = rangName();
    if(!name || name.indexOf('undefined') >= 0) fehler('rangName() leer oder undefined', s, name);
    // rangNameVon(rangStufe()) !== rangName() stand hier bis GW15 als "Drift-
    // Beweis". rangName() IST per Definition rangNameVon(rangStufe()) — die
    // Zeile verglich eine Funktion mit ihrem eigenen Rumpf und ist ersatzlos
    // gestrichen, damit sie niemand mehr als Beleg zitiert.
    const sollWechsel = s % 5 === 0 && s > 0;
    if(sollWechsel && name === vorher) fehler('Kein Wechsel an Fünferschritt', s);
    if(!sollWechsel && vorher !== null && name !== vorher) fehler('Wechsel außerhalb Fünferschritt', s);
    // GW15: echte Kopplungspruefung. Vorher stand hier s%10===0 && s%5!==0 —
    // für ganze Zahlen die leere Menge, also nie ausloesbar. Geprüft wird
    // jetzt der tatsaechliche Uebergang: an jedem Zehnerschritt (Jahresgespraech
    // in nachSchicht()) muss auch eine Hebung stattgefunden haben. Ein Umbau von
    // nachSchicht() auf %12 oder von rangStufe() auf /4 fällt hier auf.
    if(s > 0){
      const hebung = rangStufe() > Math.floor((s - 1) / 5);
      if(hebung !== (s % 5 === 0)) fehler('Hebung nicht exakt am Fünferschritt', s);
      if(s % 10 === 0 && !hebung) fehler('Jahresgespräch ohne Beförderung', s);
    }
    vorher = name;
  }
  amt.schichten = echt;

  // (7) Römische Fortsetzung
  for(let n = 2; n <= 500; n++){
    const r = roemisch(n);
    if(!r) fehler('roemisch() liefert leer', n);
    if(/[0-9]/.test(r)) fehler('roemisch() enthält Ziffer', n, r);
  }
  amt.schichten = 95;   // Index 19, erste Fortsetzung jenseits von RAENGE
  if(!rangName().endsWith(' II')) fehler('Erste römische Fortsetzung ist nicht II', rangName());
  amt.schichten = echt;

  // (8) Insignien: genau zwei mit echter Wirkung, Prädikate driften nie von
  // ihrem Tabelleneintrag ab — dieselbe Regel wie beim Rang selbst.
  const wirkende = INSIGNIEN.filter(i => i.wirkung);
  if(wirkende.length !== 2) fehler('Nicht genau zwei wirkende Insignien', wirkende.length);
  for(const i of INSIGNIEN) if(typeof i.wenn !== 'function') fehler('Insignie ohne wenn()', i.n);
  // GW15: echte Schwellenpruefung. Vorher verglichen diese zwei Zeilen
  // rangZeichnungsbefugt() mit INSIGNIE.zeichnung.wenn() — und ersteres IST
  // per Definition ein Aufruf von letzterem. Eine Sabotage BEIDER Schwellen
  // (30 auf 15, Schluessel auf immer) liess den Guard gruen. Jetzt stehen die
  // Schwellen aus 18.7 als Zahl da, und der Sweep läuft in Einerschritten,
  // damit die Kante selbst getroffen wird und nicht nur ihre Umgebung.
  for(let s = 0; s <= 200; s++){
    amt.schichten = s;
    if(rangZeichnungsbefugt() !== (s >= 30)) fehler('Zeichnungsbefugnis nicht exakt ab Schicht 30', s, rangZeichnungsbefugt());
    if(rangSchluessel() !== (s >= 55)) fehler('Schlüssel nicht exakt ab Schicht 55', s, rangSchluessel());
  }
  amt.schichten = echt;

  // (9) Formregeln und Sperrvermerk über alle neuen Texte dieser Phase.
  RANG_GRUPPEN.forEach((t,i) => text(t, 'Gruppe '+i));
  RANG_VERH.forEach((t,i) => text(t, 'Verhältnis '+i));
  RAENGE.forEach(r => text(r.t, 'Rang'));
  INSIGNIEN.forEach(i => text(i.n, 'Insignie'));
  RANG_URKUNDE().forEach(z => text(z, 'Urkunde'));
  RANG_ZEREMONIE_FIX.forEach(z => text(z, 'Zeremonie-Fixzeile'));
  RANG_KNOETERICH.forEach(z => text(z, 'Knöterich-Zeremonie'));
  text(RANG_KNOETERICH_WEITER, 'Knöterich-Zeremonie-Weiter');
  RANG_BEAT25.forEach(z => text(z, 'Beat25'));
  text(RANG_BEAT45_WORT, 'Beat45-Wort');
  RANG_BEAT45_ZEILEN.forEach(z => text(z, 'Beat45-Zeile'));
  for(const k in AUSWEIS_TEXTE) text(AUSWEIS_TEXTE[k], 'Ausweis:'+k);

  // Zusätzlich die tatsächlich gerenderten Blöcke selbst, nicht nur die Tabellen
  // dahinter — Bauform wie auftragAssertBrett() prüft def.titel(a)/def.satz(a),
  // nicht nur die Rohtabelle. Fängt inline zusammengesetzte Sätze (Dienstbericht-
  // Vorlagen, Panel-Überschriften), die in keiner Tabelle stehen.
  const strip = html => html.replace(/<[^>]+>/g, ' ');
  for(let s = 0; s <= 100; s += 5){
    amt.schichten = s;
    const roh = rangBerichtBlock();
    if(roh) text(strip(roh), 'Dienstbericht-Block s='+s);   // '' ist erwartet außerhalb der Fünferschritte
  }
  // GW13: Sweep beginnt bei 0, nicht bei 10. Genau der ausgelassene Wert war der
  // einzige, an dem der Block kaputt war: idx wurde -1 und rendete woertlich
  // Knoeterich: "undefined". text() prueft jetzt zusätzlich darauf.
  for(let s = 0; s <= 100; s += 10){
    amt.schichten = s;
    text(strip(rangZeremonieBlock()), 'Zeremonie-Block s='+s);
  }
  } finally { amt.schichten = echt; }

  console.assert(ok, 'W6 Rang: Assertion fehlgeschlagen, siehe Konsole.');
  return ok;
}
rangAssert();

// ===========================================================================
//  DIE ANREDE — Weltbibel 18.5. Der Titel aus rangName() wird an die NPC-Zeilen
//  durchgereicht; wie jede Figur damit umgeht, ist ihre Charakterisierung.
//
//  Bauform: eine dynamisch gebaute Anredezeile als Schritt 0 des Sprechzyklus.
//  Die 66 Grundzeilen in DORF_FIGUREN bleiben unangetastet, figuren-dorf.md
//  bleibt gültig. Der Eingriff sitzt in npcCycle(), nicht in npcSprechen() —
//  damit bleiben der Bramsche-Pfad und der Lott/Pahl-Anlass-Pfad per
//  Konstruktion unberührt, sie erreichen npcCycle() gar nicht erst.
//
//  Diese Zeilen sind Sprechblasen, tragen also den Deckel z1<=48 / z2<=32.
//  Der Titel wird bis zu 38 Zeichen lang und wächst jenseits Rang 18 römisch
//  weiter — deshalb die Sprossenleiter unten statt eines festen Rahmens.
// ===========================================================================

const ANREDE_HERR = 'Herr oder Frau ';

// Die Sprossen, absteigend. Ein Titel, der das Paar ausschreibt
// ('Monstralamtmann / Monstralamtfrau'), braucht kein '(in)': die Klammer steht
// nur dort, wo der Dienstposten das Geschlecht nicht kennt, so begründet 18.5
// sie. Die letzte Sprosse ist der benannte Grundtitel ohne römische Ziffer —
// kein falscher Titel im Sinn von 18.6.2, sondern derselbe ohne Zählung, und
// als einziger nach oben beschränkt (38 Zeichen).
function anredeFormen(i){
  const s = Math.max(0, i | 0), letzt = RAENGE.length - 1;
  const t = rangNameVon(s);
  const basis = RAENGE[Math.min(s, letzt)].t;
  // Kein '(in)', wenn der Titel das Paar ohnehin ausschreibt, und keins jenseits
  // der benannten Ränge: dort hängt eine römische Ziffer hinten dran, und
  // 'Geschäftsbereich II(in)' wäre die Klammer am Zählwerk statt am Substantiv.
  const ohneKlammer = t.indexOf(' / ') >= 0 || s > letzt;
  // GW7: 'Herr oder Frau <Titel>' steht jetzt VOR der Klammerform ohne Anrede.
  // Vorher war die Reihenfolge rein nach Länge sortiert, und weil '(in)' nur
  // vier Zeichen kostet und 'Herr oder Frau ' fünfzehn, gewann die Klammerform
  // praktisch immer: auf genau einem von 81 durchgerechneten Rängen sagte
  // Knöterich die Vollform. 18.5 verlangt sie ausdrücklich "jedes Mal". Mit
  // dieser Reihenfolge sind es die Ränge 9, 11 und 12 — mehr trägt der 44er-
  // Deckel nicht, der Rest bleibt bewusst offen und ist dokumentiert.
  const mitKlammer = ohneKlammer ? [] : [ANREDE_HERR + t + '(in)', ANREDE_HERR + t, t + '(in)'];
  return ohneKlammer ? [ANREDE_HERR + t, t, basis] : mitKlammer.concat([t, basis]);
}
// Baut die längste Fassung, die unter den Deckel passt. null = keine passt,
// dann nimmt der Aufrufer seinen eigenen Rückfall. Gleiches Muster wie das
// Rekord-Suffix in knBegruessungLine(): bauen, Länge prüfen, sonst zurück.
function anredeVersuch(bau, i, cap){
  for(const f of anredeFormen(i)){ const z = bau(f); if(z.length <= cap) return z; }
  return null;
}
const anredePunkt = (i, cap) => anredeVersuch(t => t + '.', i, cap);

// Sie fragt als Einzige nach dem Namen, jede Schicht neu, weil es jede Schicht
// ein anderer ist (18.5). Der Spieler hat keinen Namen und bekommt keinen: kein
// Eingabefeld, kein amt-Feld, keine Antwortauswahl (Kapitel 16). Dass niemand
// antwortet, ist die Aussage.
const ANREDE_LISBETH = [
  {z1:'Guten Tag. Und wie heißen Sie?',          z2:'Nicht der Titel. Der Name.'},
  {z1:'Den Titel kenne ich. Den Namen nicht.',   z2:'Wie heißen Sie?'},
  {z1:'Jede Schicht ein anderer Titel.',         z2:'Aber wie heißen Sie?'},
  {z1:'Ich schreibe mir die Namen auf.',         z2:'Ihrer fehlt noch immer.'},
  {z1:'Verzeihung. Ihr Name, nicht Ihr Titel.',  z2:'Sonst fragt das ja keiner.'},
];

// Die elf Formen. Acht stehen wörtlich in 18.5; Trepp, Milb und Fass kommen
// dort nicht vor, bekommen aber eine, weil Stolzregel 18.6.1 keine Ausnahme
// kennt ("Niemand wird ohne Titel angesprochen"). Ihre z2 ist jeweils die
// bereits kanonische Sprachmarke aus Kapitel 8, also Ableitung statt neuer
// Charakterisierung. Keiner benutzt den Titel ironisch (18.6.7).
const ANREDE = {
  // Schmeichelei: immer einen Rang zu hoch. Er befördert verbal, bevor er
  // befördert. Jenseits von RAENGE zählt roemisch() weiter, die Schmeichelei
  // geht nie aus.
  zwirn:    () => ({z1: anredeVersuch(t => t + '!', rangStufe() + 1, 48) || rangDef().t + '!',
                    z2: 'Bald schon. Ganz sicher.'}),
  // Sie liest die Schriftform vor, Klammern eingeschlossen. Hat der Deckel die
  // Klammer weggenommen, sagt sie stattdessen, dass es so geschrieben steht.
  // Sie liest immer, was dasteht — auch das ist Charakter.
  bramsche: () => { const z1 = anredePunkt(rangStufe(), 48) || rangDef().t + '.';
                    return {z1, z2: z1.indexOf('(in)') >= 0 ? 'Klammer auf in Klammer zu.'
                                                            : 'Genau so steht es geschrieben.'}; },
  zapf:     () => ({z1:'Chef.', z2:'Sag Bescheid, wenn was klemmt.'}),
  lisbeth:  () => ANREDE_LISBETH[amt.schichten % ANREDE_LISBETH.length],
  trepp:    () => ({z1: anredePunkt(rangStufe(), 48) || rangDef().t + '.',
                    z2:'Wenn ich kurz stören darf.'}),
  // Vollständig und korrekt, mit hörbarem Neid. Er hat keinen Titel.
  noergel:  () => ({z1: anredePunkt(rangStufe(), 48) || rangDef().t + '.',
                    z2:'Ich habe keinen. Nur Krawatte.'}),
  milb:     () => ({z1: anredePunkt(rangStufe(), 48) || rangDef().t + '.',
                    z2:'Geschätzt, nicht geraten.'}),
  // Der Titel, der auf dem Antrag steht, nicht der, den man hat. Der Antrag ist
  // vom ersten Tag und wurde nie geändert: RAENGE[0]. Stimmt bis Schicht 4
  // zufällig, driftet ab Schicht 5 und wird mit jeder Beförderung komischer.
  // Keine Persistenz, kein Merker.
  pommer:   () => ({z1: anredePunkt(0, 48) || RAENGE[0].t + '.',
                    z2:'So steht es auf dem Antrag.'}),
  lott:     () => ({z1:'Der Neue.', z2:'Vierhundert Jahre der Neue.'}),
  pahl:     () => ({z1:'Der Neue.', z2:'Der Name bleibt. Sie wechseln.'}),
  fass:     () => ({z1: anredePunkt(rangStufe(), 48) || rangDef().t + '.',
                    z2:'Setz dich. Der Krug wartet.'}),
  // W11, drei neue Formen nach derselben Regel: niemand wird ohne Titel
  // angesprochen (18.6.1), und die zweite Zeile ist jeweils die schon kanonische
  // Sprachmarke der Figur, nicht eine neue Charakterisierung.
  // Er meldet, statt zu reden.
  nieselbeck: () => ({z1: anredePunkt(rangStufe(), 48) || rangDef().t + '.',
                      z2:'Gemeldet wird: Sie sind da.'}),
  // Sie nimmt auf und muss weiter, beides im selben Atemzug.
  umlauf:   () => ({z1: anredePunkt(rangStufe(), 48) || rangDef().t + '.',
                    z2:'Notiert. Ich muss gleich weiter.'}),
  // Er benutzt den vollständigen Titel seines Gegenübers, auch bei Leuten, die
  // keinen haben, und macht davor eine winzige Pause. Die Pause ist der Punkt
  // hinter dem Und, und sie ist die einzige Unhöflichkeit, die er sich leistet.
  vorblatt: () => ({z1: anredePunkt(rangStufe(), 48) || rangDef().t + '.',
                    z2:'Und. Sie sind heute im Dienst.'}),
  // U6: die zwoelfte Form, und die einzige fuer jemanden, der nicht im Dorf
  // steht. Sie fehlte, solange Knoeterich keine Tafel hatte: anredeZeile()
  // faellt bei einem unbekannten Schluessel auf den nackten Rangnamen zurueck,
  // und ausgerechnet der Mann, von dem 18.5 die Vollform "jedes Mal" verlangt,
  // haette den blossen Titel gesagt. Die zweite Zeile ist keine neue
  // Charakterisierung, sondern seine Regel aus Kapitel 18.5, wortkarg gesagt.
  knoeterich: () => ({z1: anredePunkt(rangStufe(), 48) || rangDef().t + '.',
                      z2:'Vollständig. Immer.'}),
};
function anredeZeile(key){ const f = ANREDE[key]; return f ? f() : {z1: rangName() + '.', z2:''}; }

// Zeichendeckel-Assertion für die Anrede. Sie steht bewusst NICHT in
// knAssertCaps(): der Guard ruft sich weit oben im Skript selbst auf, lange
// bevor rangStufe() deklariert ist, und ein Zugriff von dort wäre ein
// ReferenceError durch Temporal Dead Zone, den node --check nicht findet.
function anredeAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('Anrede 18.5:', m, ...r); };
  const EMOJI = PRUEF_EMOJI;
  const text = (txt, cap, feld) => {
    if(typeof txt !== 'string' || !txt) return fehler('leer', feld, JSON.stringify(txt));
    if(txt.length > cap)        fehler('Zeichendeckel verletzt', feld, JSON.stringify(txt), txt.length, '>', cap);
    if(txt.indexOf('undefined') >= 0) fehler('undefined im Text', feld, txt);
    if(/[—–]/.test(txt))        fehler('Gedankenstrich', feld, txt);
    if(EMOJI.test(txt))         fehler('Emoji', feld, txt);
    // GW20: als einziger Guard mit eigenem text()-Helfer liess dieser die
    // Sperrliste weg. Risiko gering (Rangtitel, Hoeflichkeitsformeln), aber er
    // ist die teuerste Textpruefung im Projekt und sparte die billigste Zeile.
    for(const g of PRUEF_GEHEIM) if(txt.indexOf(g) >= 0) fehler('Sperrvermerk', feld, g, txt);
  };

  // (1) Jede Figur aus DORF_FIGUREN hat eine Form, und keine Form ist verwaist.
  for(const fig of DORF_FIGUREN) if(!ANREDE[fig.key]) fehler('Figur ohne Anredeform', fig.key);
  // U6: Knöterich ist die eine Form ohne Zeile in DORF_FIGUREN. Er steht im Haus
  // statt im Dorf (KN_FIGUR), spricht aber seit U6 über dieselbe Tafel, und
  // gespraechOptionen() fragt ihn nach der Anrede wie jeden anderen. Dieselbe
  // Ausnahme führen gespraechAssert() und szeneAssert() bereits.
  if(!ANREDE.knoeterich) fehler('Figur ohne Anredeform', 'knoeterich');
  for(const k in ANREDE) if(k !== 'knoeterich' && !DORF_FIGUREN.some(f => f.key === k)) fehler('Anredeform ohne Figur', k);

  // GW26i: alle vier Spiegel stehen vor dem try, damit finally sie sieht, und
  // der Block umfasst BEIDE Sweeps — nicht nur den zweiten.
  const echt = amt.schichten, rekEcht = kn.counters.maxKillsSchicht,
        langEcht = kladde.lang, modusEcht = CONFIG.schichtModus;
  try {

  // (2) Deckelsweep über alle Figuren und den gesamten Laufbahnverlauf, weit
  // über RAENGE hinaus in die römische Fortsetzung. amt.schichten wird
  // gespiegelt und exakt wiederhergestellt, kein saveAmt() — Idiom aus
  // rangAssert()/auftragAssertBrett().
  // GW17: Einerschritte. Der Sweep lief in Fünferschritten, und ANREDE.lisbeth
  // indiziert mit amt.schichten % 5 — der Index war damit IMMER 0, und vier der
  // fünf Lisbeth-Zeilenpaare (acht Strings) sah weder dieser Guard noch
  // knAssertCaps(). Schrittweite und Modulo müssen teilerfremd sein.
  for(let s = 0; s <= 5000; s++){
    amt.schichten = s;
    for(const k in ANREDE){
      const a = anredeZeile(k);
      if(!a) { fehler('Anredeform liefert nichts', k, s); continue; }
      text(a.z1, 48, 'z1 ' + k + ' s=' + s);
      if(a.z2) text(a.z2, 32, 'z2 ' + k + ' s=' + s);
    }
    // (3) Zwirn schmeichelt wirklich, solange es über ihm einen benannten Rang
    // gibt: gleicher Bau, eine Stufe höher, muss einen anderen String ergeben.
    // Jenseits von RAENGE zählt roemisch() zwar weiter, dort kann die
    // Sprossenleiter aber auf den Grundtitel zurückfallen und beide Fassungen
    // zusammenlegen — das ist bekannt und ab Schicht 90+ hingenommen.
    if(rangStufe() < RAENGE.length - 1){
      const eigen = anredeVersuch(t => t + '!', rangStufe(), 48);
      if(eigen && anredeZeile('zwirn').z1 === eigen) fehler('Zwirn schmeichelt nicht', s);
    }
    // Pommer liest den Antrag vom ersten Tag, nie den aktuellen Titel.
    if(anredeZeile('pommer').z1.indexOf(RAENGE[0].t) < 0) fehler('Pommer liest nicht den Antrag', s);
  }
  amt.schichten = echt;

  // (4) Knöterichs Begrüßung, Einzeiler-Deckel 44, über dieselbe Schichtreihe
  // und beide Rekord-Zustände. Steht hier statt in knAssertCaps(), s. Kommentar
  // dort. kn.counters wird gespiegelt und exakt zurückgesetzt, kein saveKn().
  // GW6: schichtModus wird für den Sweep erzwungen. Seit langFertig() den Modus
  // mitliest, wäre die Gießkannen-Wärme bei schichtModus=false unsichtbar und
  // die warmGesehen-Prüfung unten liefe grundlos rot. Muster aus vorgangAssert().
  CONFIG.schichtModus = true;
  let warmGesehen = false, rekordGesehen = false;
  // GW19: rek 9 ist mitgeprüft, weil das Suffix seit GW7/GW8 nur noch für
  // EINSTELLIGE Rekorde unter den Deckel passt — die längere Anredezeile und
  // die häufiger sichtbare Gießkannen-Wärme fressen ihn sonst auf. Der Guard
  // fordert deshalb Sichtbarkeit für irgendeinen Rekordwert, nicht für den
  // längsten. Dass ' Rekord 99.' nirgends mehr erscheint, ist hingenommen und
  // in phase-anrede.md unter "Bewusst offen" vermerkt.
  for(const rek of [0, 9, 99]) for(const giess of [false, true]){
    kn.counters.maxKillsSchicht = rek;
    kladde.lang = giess ? {giesskanne: LANGVORGAENGE.giesskanne.stufen} : {};
    for(let s = 0; s <= 5000; s++){
      amt.schichten = s;
      const l = knBegruessungLine();
      text(l, 44, 'knBegruessung rek=' + rek + ' giess=' + giess + ' s=' + s);
      // 18.5 verlangt die Anrede jedes Mal: der letzte Boden darf nie greifen.
      if(l.indexOf('Die Akte wird dick') >= 0) fehler('Knöterich fällt aus der Anrede', s, l);
      if(giess && l.indexOf('Gut, Sie zu sehen') >= 0) warmGesehen = true;   // GW8
      if(rek > 0 && l.indexOf(' Rekord ') >= 0) rekordGesehen = true;
    }
  }
  // Die Gießkannen-Belohnung muss auf mindestens einem Rang sichtbar sein,
  // sonst ist sie gebaut und unerreichbar.
  if(!warmGesehen) fehler('Die Gießkannen-Wärme passt auf keinem Rang unter den Deckel');
  // GW19: dasselbe für das Rekord-Suffix. Es galt als "unverändert", weil sein
  // Code unverändert war — durch die längere Anredezeile ist seine Sichtbarkeit
  // aber von rund 190 auf rund 30 Schichten eingebrochen, und niemand hat es
  // bemerkt, weil kein Guard danach sah.
  if(!rekordGesehen) fehler('Das Rekord-Suffix passt auf keinem Rang unter den Deckel');
  } finally {
  kn.counters.maxKillsSchicht = rekEcht; kladde.lang = langEcht;
  CONFIG.schichtModus = modusEcht;
  amt.schichten = echt;
  }

  console.assert(ok, 'Anrede 18.5: Assertion fehlgeschlagen, siehe Konsole.');
  return ok;
}
// Der Selbstaufruf steht seit W7 unten hinter langAssert(), nicht hier:
// anredeAssert() ruft knBegruessungLine(), und die liest seit dem
// Gießkannen-Strang langFertig(). Von hier aus wäre das ein ReferenceError
// durch Temporal Dead Zone, den node --check nicht findet — genau die Falle,
// vor der der Kommentar an knAssertCaps() warnt, eine Ebene höher.

// ===========================================================================
//  W5: DER VORGANG — Weltbibel Kapitel 9. Jahresgespräch-Absatz, Zustellen,
//  Schlusspanel. Läuft komplett auf bestehenden Systemen (Jahresgespräch-Panel,
//  Kontextaktionen, rangZeichnungsbefugt()). Kein neues System.
// ===========================================================================

// Der Absatz im Jahresgespräch, Bauform wie rangZeremonieBlock(): reine
// Funktion von amt.schichten, kein apply(), kein saveAmt(), von selbst
// idempotent. idx-Rechnung bewusst NICHT zyklisch (kein % Länge) — die Boni
// kreisen, die Geschichte nicht.
const VORGANG_JAHRES = [
  {zwirn:'Solange der Vorgang läuft, brauchen wir Sie ja.'},
  {zwirn:'Ich wollte das Dorffest genehmigen. Ich kann nicht. Zuständig wäre die Amtsleitung.'},
  {zwirn:'Ich habe den Antrag unterschrieben. Ich war schneller fertig, als sie aus der Tür war.',
   hinweis:'Trepp öffnet den Sack. Die Anschrift ist unleserlich. Fragen Sie Nörgel, sagt Lisbeth.'},
  {zwirn:'Ich unterschreibe den Dienstreiseantrag. Diesmal zittert die Hand.'},
  {zwirn:'Ablage V. Die Zustellung. Mehr sage ich dazu nicht.'},
];
const VORGANG_JAHRES_WEITER = 'Der Vorgang läuft weiter. Vermerkt, wie immer.';
function vorgangJahresBlock(){
  const idx = Math.floor(amt.schichten/10) - 1;   // gleiche Rechnung wie JAHRES_BONI/rangZeremonieBlock
  const e = idx >= 0 && idx < VORGANG_JAHRES.length ? VORGANG_JAHRES[idx] : null;
  const zwirn = e ? e.zwirn : VORGANG_JAHRES_WEITER;
  const hinweis = e && e.hinweis ? `<p style="font-size:calc(12px * var(--fs));color:#9a8a5f;">${e.hinweis}</p>` : '';
  return `
    <div style="border-top:1px solid #5a4a2d;margin-top:12px;padding-top:10px;">
      <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">Zwirn: „${zwirn}“</p>
      ${hinweis}
    </div>`;
}

// Anzeige des Vorgangs-Bestands im Kessel-Reiter (renderBlaetter()). Liefert
// '', solange keine Adresszeile gefunden ist — vor Akt IV bleibt der Reiter
// unverändert. Getrennt von BLAETTER: die Zählzeile "N von 48" bleibt unberührt.
function vorgangBestandBlock(){
  if(!vorgangHat(1) && !vorgangHat(2) && !vorgangHat(3) && !vorgangHat(4)) return '';
  const zeilen = [1,2,3,4].map(id => vorgangHat(id)
    ? `<div class="kl">${ADRESS_ZEILEN[id].lines[ADRESS_ZEILEN[id].lines.length - 1]}</div>`
    : `<div class="kl klEmpty">Adresszeile ${id}: noch nicht gefunden.</div>`).join('');
  // GW10: die Zeile behauptete Vollständigkeit auch dort, wo das Zustellen noch
  // gesperrt ist (Akt IV, amt.schichten 30 bis 39). Am Fürsten wird in diesem
  // Fenster wortlos nichts angeboten, und der Spieler erschlägt ihn stattdessen.
  // Ein halber Satz statt eines Erklärsystems: er nennt den Akt, nicht die
  // Bedingung, und liest vorgangZustellbar() statt ein zweites Prädikat
  // aufzumachen (die F1-Falle aus 18.7).
  const voll = !vorgangAusfertigung() ? ''
    : `<div class="kl" style="color:#f4d97a;">Die Ausfertigung ist vollständig. ${VORGANG_ANSCHRIFT}`
      + `${vorgangZustellbar() ? '' : ' Zugestellt wird im fünften Akt.'}</div>`;
  // SZ4: der Zwischenbescheid. Dieselbe Bauform wie der halbe Satz darüber, aus
  // demselben Grund: der Bestand soll nicht vollständig aussehen, wenn oben
  // etwas klebt, das die Zustellung aufhält. Er nennt den Zustand und nicht die
  // Bedingung, und er ist keine Warnung: aufgehalten wird nichts, die drei
  // Schritte in Ablage V lösen ihn auf.
  const anhaengig = vorgangAusfertigung() && vorgangAnhaengig()
    ? '<div class="kl" style="color:#c77dff;">Oben rechts klebt ein Zwischenbescheid. Ihr Anliegen wird bearbeitet.</div>' : '';
  return `<div class="klHead">DIE ANSCHRIFT</div>${zeilen}${voll}${anhaengig}`;
}

// Akt V, die vier Finale-Puzzleteile (Kapitel 9). Teil 1 und 3 haben eine
// echte Bedingung, sind aber nie hart blockierend: der Text passt sich an,
// Zustellen wird nie verweigert. Ein Erklärsystem für ein fehlendes Teil ist
// verboten. Teil 1 ist seit GW10 im Regelfall gefüllt, weil vorgangZustellbar()
// jetzt aktStand() >= 5 verlangt und JAHRES_BONI Index 3 (Dienstsiegel) bei
// derselben Schwelle fällt, amt.schichten === 40. Die sonst-Fassung bleibt
// trotzdem stehen: showJahresgespraech() hängt am WEITER-Knopf des
// Dienstberichts, amt.schichten steht aber schon vorher gespeichert da. Wer auf
// dem Bericht neu lädt, bekommt das Siegel nie. "Nie leer" wäre wieder falsch.
const VORGANG_PUZZLE = [
  {frei: () => rangDienstsiegel(),
   text: 'Er braucht einen Stift. Das Dienstsiegel liegt bereit, seit einem Jahresgespräch. Er benutzt es zum ersten Mal.',
   sonst: 'Er braucht einen Stift. Trepp hat einen Bleistift dabei. Er hat immer einen.'},
  {frei: () => true,
   text: 'Er braucht einen Zeugen. Lisbeth ist mitgekommen. Sie hat gefragt, ob sie darf.'},
  {frei: () => kladde.crafts > 0,
   text: 'Er braucht es in dreifacher Ausfertigung. Der Kessel liefert sie, wortlos.',
   sonst: 'Er braucht es in dreifacher Ausfertigung. Bramsche hat Durchschläge mitgeschickt.'},
  // LV4: das vierte Teil hat seit dem sechsten Praktikumsbericht eine echte
  // Bedingung, und es bleibt nach der Bauregel oben trotzdem nie blockierend.
  // Wer den Präzedenzfall hat, hört, dass Sturz' Begründung in diesem Haus
  // schon einmal getragen hat. Wer ihn nicht hat, bekommt genau den Satz, der
  // hier seit W5 steht, Wort für Wort. Der Kanon von Kapitel 9 liegt also in
  // der sonst-Fassung und nicht im Zusatz, damit ein fehlender Strang nichts
  // wegnimmt, sondern der vorhandene etwas dazugibt.
  {frei: () => langFertig('bericht'),
   text: 'Er braucht eine weisungsbefugte Gegenzeichnung. Sturz kommt aus dem Nebenzimmer, mit einer Teetasse. „Ich bin noch im Dienst. Meine Entpflichtung wurde nie bearbeitet.“ Dieselbe Begründung hat in diesem Haus schon einmal getragen, unter dem sechsten Praktikumsbericht, gezeichnet von einem Sachbearbeiter auf Probe. Der Fall ist aktenkundig. Es fragt niemand nach.',
   sonst: 'Er braucht eine weisungsbefugte Gegenzeichnung. Sturz kommt aus dem Nebenzimmer, mit einer Teetasse. „Ich bin noch im Dienst. Meine Entpflichtung wurde nie bearbeitet.“'},
];
// GW10, dritte Bedingung. Das Dienstsiegel (JAHRES_BONI Index 3, siehe
// showJahresgespraech()) fällt bei amt.schichten === 40 — exakt der Sprung von
// aktStand() auf 5. Ohne diese Bindung war das Zustellen schon ab Schicht 30
// möglich und Puzzleteil 1 im ganzen Fenster 30 bis 39 leer, also genau in dem
// Akt, in dem die Ausfertigung eingesammelt wird. Deckt sich mit Weltbibel
// Kapitel 9 ("Akt V, Schicht 41 bis 50"). aktStand() steht weit oberhalb (bei
// den amt-Feldern), kein TDZ.
// Das Modus-Gate (Entscheidung vom 20.08.2026) steht bewusst vorn, im Muster
// von vorgangAdressAkt(). Die W5-Abnahme sagt seit jeher „CONFIG.schichtModus =
// false bricht nichts, vorgangZustellbar() bleibt falsch", die Funktion las
// CONFIG aber nirgends. Materiell stimmte die Zusage trotzdem: ohne
// vorgangAdressAkt() wird keine Adresskammer markiert und die vierte Zeile fällt
// nicht, ein reiner Nicht-Schichtmodus-Stand kommt also nie an eine Ausfertigung.
// Falsch war sie nur für einen aus dem Schichtmodus mitgebrachten Stand, wo
// kladde.vorgang und amt.schichten persistiert danebenliegen. Dieselbe Klasse
// hat GW5 für W4 und GW6 für W7 geschlossen; das hier war der letzte Rest.
const vorgangZustellbar = () => CONFIG.schichtModus && vorgangAusfertigung() && rangZeichnungsbefugt() && aktStand() >= 5;

// Die Vertagung. Wer die Ausfertigung im Bestand hat, aber noch nicht zustellen
// darf, kann den Fürsten nicht mehr über killMon() zum Spielende bringen: ein
// offener Vorgang lässt sich nicht erschlagen. Der Fürst ist ein Nachtrag, kein
// Wesen. Ab Akt V ist die Vertagung falsch und der Kampf-Tod wieder ein
// gültiges Ende — dort ist er eine Entscheidung des Spielers und keine Folge
// einer Schwelle, die ihm niemand genannt hat.
//
// Eigene Funktion statt eines Ausdrucks in der Siegweiche, damit vorgangAssert()
// genau den Term prüft, der im Spiel läuft, statt einer Abschrift davon (Bauform
// wie markiereAdressTueren(), GW16). Kein neues Feld, kein neues Prädikat: sie
// liest ausschließlich die beiden bestehenden.
// Dasselbe Gate, und es ist hier keine Formalie: ohne den ersten Term wäre die
// Vertagung im Nicht-Schichtmodus mit mitgebrachtem Vollbestand dauerhaft wahr
// (vorgangZustellbar() ist dort jetzt immer falsch). Ein solcher Stand hätte
// dann gar kein Ende mehr, weder Zustellung noch Kampf-Tod. Im Nicht-
// Schichtmodus läuft der Vorgang nicht, also wird dort auch nichts vertagt.
const vorgangVertagt = () => CONFIG.schichtModus && vorgangAusfertigung() && !vorgangZustellbar();

// Die drei Zeilen der Vertagung als Tabelle, nicht als Literale in killMon():
// so laufen sie durch die Formregeln in vorgangAssert() Block 9 wie jeder andere
// Text dieser Phase. Reihenfolge ist die Anzeigereihenfolge von oben nach unten.
const VERTAGT_ZEILEN = ['VERTAGT', 'Der Sachverhalt ist erledigt.', 'Der Vorgang nicht.'];

// SZ4, Szene 8: Vorblatts letzter Zug. Auf der Ausfertigung klebt ein
// Zwischenbescheid, und zwar genau dann, wenn Szene 7 gelaufen ist. Ein
// Merker, eine Wahrheit, kein zweites Feld daneben: den Bescheid hat Vorblatt
// selbst aufgedrückt, im Amtsflur, vor Zeugen. Wer die Versuchung nie gespielt
// hat, hat auch keinen Bescheid auf dem Umschlag und stellt zu wie vor SZ4.
//
// Das ist dieselbe Bauregel, mit der LV4 an das vierte Puzzleteil gegangen ist:
// ein fehlender Strang nimmt nichts weg, ein vorhandener gibt etwas dazu. Hier
// gibt er drei Panelschritte und die Figur, die vierzig Jahre zu spaet kommt.
const vorgangAnhaengig = () => CONFIG.schichtModus && kn.flags.szeneVersuchung;

// Der Abspann, dreizehn Bilder, aus weltgeschichte.md, Kapitel 8, Szene 9.
// Kein neues Bauteil: das ist der Tafelstapel aus SZ1, und der Kommentar dort
// hat diesen Stapel beim Namen genannt, lange bevor es ihn gab ("dieselbe
// Optik blaettert das Intro und spaeter den Abspann"). Vier Blaetter am Anfang,
// dreizehn am Ende, dazwischen liegt das ganze Spiel. (Die Vier ist seit AN3
// die Zahl; SZ1 hatte neun, T1 kuerzte auf fuenf, T5d brachte zwei zurueck,
// AN3 hat drei zu Requisiten gemacht.)
//
// Eine Funktion und keine Tabelle, weil Bild 7 den Strangzustand liest, genau
// wie der Abspanntext es seit W5 tat. Die Bildfolge selbst ist fest; was sich
// aendert, ist eine Zeile darin.
//
// Zwei Lesarten, gemischt, und die Mischung ist die Aussage: was zu sehen ist,
// steht als gross/klein da (Standbild, zwei Zeilen darunter, wie es die
// Weltgeschichte verlangt); wo jemand spricht, steht blatt/stimme, weil dann
// nicht das Bild die Hauptsache ist, sondern der Satz. Fuenf Bilder haben
// einen Satz, acht haben keinen. Das ist ungefaehr das Verhaeltnis, in dem
// dieses Haus redet, und die Zahlen stehen hier nachgezaehlt und nicht
// geschaetzt: der erste Anlauf schrieb sechs und sieben, und der Prueflauf hat
// es gemeldet, bevor es jemand gelesen hat.
//
// Bild 10, 12 und 13 sind nach der Weltgeschichte nicht verhandelbar und
// stehen deshalb woertlich: der Regen, der vierte Takt, Vorgang 2.
function abspannBlaetter(){
  return [
    {z1:'Hochablage, am selben Nachmittag.',
     z2:'In vierzehn Türmen klappen Aktendeckel zu, von allein, Stockwerk für Stockwerk, wie Applaus. Niemand fällt um. Es wird nur sehr viel leichter im Raum.'},

    {z1:'Turm I, oberstes Geschoss.',
     z2:'Die Lagen fallen ab, Jahrzehnt für Jahrzehnt. Der Erzhalter des Hauses Randbemerkung kann sich umdrehen, zum ersten Mal seit Generationen. Er sieht aus dem Fenster. Er hat da noch nie hinausgesehen.'},

    {blatt:'Die Tür mit dem Schild IM TERMIN geht auf. Von allein. Der Stapel Post davor rutscht hinein.',
     stimme:[{wer:'Aufschub', z:'Ich bin Erster.'},
             {wer:'Aufschub', z:'Ich weiß gar nicht mehr, was ich sagen wollte.'}],
     regie:'Konrad zu Händen Aufschub sieht sich um. Es steht niemand mehr hinter ihm. Er macht die Tür leise zu, damit er niemanden stört.'},

    {z1:'Vierhundert Jahre Post in einem Nachmittag.',
     z2:'Jeder bekommt alles, worauf er gewartet hat. Was ankommt, ist erledigt und wird zu Konfetti. Das Reich versinkt bis zu den Knien in einer Feier.'},

    {z1:'Vordermühl. Das Pappschild wird abgehängt.',
     z2:'Das Ministerium für Monsterangelegenheiten löst sich auf, weil sein Auftrag erfüllt ist. Darunter, an der Wand, ist die Farbe heller.'},

    {blatt:'Knöterichs Entpflichtung wird als vorletzte Amtshandlung bearbeitet. Er darf gehen. Er steht sehr lange auf. An der Tür dreht er sich um.',
     stimme:[{wer:'Knöterich', z:'Ich hätte gern gewusst, wie Sie alle heißen.'}],
     regie:'Es ist der einzige Satz, den er in diesem Haus gesagt hat, ohne ihn danach zu notieren.'},

    {z1:'Sturz genehmigt das Dorffest.',
     z2:'Ihre letzte Amtshandlung. Sie unterschreibt die alte Bewilligung von tausendundvier mit dem Zusatz zugegangen.'
        + (langFertig('dorffest') ? ' Zwirns elf Absagen liegen bei, mitgeheftet, nicht widerrufen.' : '')},

    {z1:'Nörgel wird entfristet.',
     z2:'Er beschwert sich sehr lange und sehr genau über die Feierlichkeit und lässt sich dabei die Krawatte richten.'},

    {z1:'Das Fest. Vordermühl, abends.',
     // T1-Nachlese: Zwirn fehlte im ganzen Abspann bis auf einen Nebensatz.
     // Szene 7 laesst ihn verstummen, und zwar zum ersten Mal ueberhaupt; ein
     // Bogen, der einen Redner verstummen laesst, muss ihn wieder sprechen
     // lassen. Hier ist die Auszahlung der neuen Formregel: seine Laenge wird
     // endlich angenommen (Grundgesetz 12, Reichsregel 7).
     z2:'Zwirn hält eine Rede. Sie ist sehr lang, und alle hören zu. Lott und Pahl finden die Musik zu laut. Fass räumt nicht ab, weil zum ersten Mal alle bis zum Ende bleiben. Das Gasthaus heißt Zum Letzten Stempel und hat vierhundert Jahre darauf gewartet.'},

    {blatt:'Und dann regnet es. Zum ersten Mal seit hundertfünfzehn Jahren, mitten auf ein Dorffest.',
     stimme:[{wer:'Nieselbeck', z:'Gemeldet wird: Niederschlag.'}],
     regie:'Die Veranlassung lag im Frostkamm und war ein zurückgestellter Vorgang. Alle bleiben stehen und werden nass und finden es großartig.'},

    {blatt:'Vorblatt steht am Rand, in Hemdsärmeln, ohne Rang, den Stempel in der Hand. Er weiß nicht, wohin damit.',
     // Die einzige Wechselrede des Abspanns, und der Grund, warum der
     // Tafelstapel seit SZ4 weiß, wer spricht. Fünf Zeilen, zwei Leute, und
     // ohne die Namen davor liest es sich als Selbstgespräch.
     stimme:[{wer:'Vorblatt', z:'Ich habe einundvierzig Jahre lang nichts entschieden. Ich würde gern einmal etwas entscheiden. Etwas Kleines.'},
             {wer:'Sturz',    z:'Setzen Sie sich. Nehmen Sie einen Teller.'},
             {wer:'Vorblatt', z:'Welchen?'},
             {wer:'Sturz',    z:'Das entscheiden Sie.'}],
     regie:'Er sieht die Teller sehr lange an. Dann nimmt er einen, ganz normal.'},

    {z1:'Die Amtshymne. Vier Takte, Fagott, F-Dur.',
     z2:'Sie wird nach dem dritten unterbrochen, weil immer jemand dazwischenruft. Diesmal ruft niemand dazwischen. Der vierte Takt läuft einmal durch.'},

    {blatt:'Das leere Amtsgebäude, morgens. Eine junge Frau in Zustelleruniform kommt herein, sieht sich um und findet niemanden. Sie legt einen Umschlag auf den Tresen.',
     stimme:[{wer:'Auf dem Umschlag', z:'Vorgang 2.'}],
     regie:'Sie bräuchte eine Empfangsbestätigung. Es ist niemand da. Sie unterschreibt das Empfangsbekenntnis selbst, mit ihrem eigenen Namen, und geht.'},
  ];
}

// Der Stapel laeuft im selben #overlay, in dem gerade das Finale stand, und
// uebergibt am Ende an den letzten Panelschritt. Die Liste wird EINMAL gebaut
// und in der Schliessung gehalten: abspannBlaetter() liest kladde.lang, und ein
// zweiter Aufruf fuer den Sprungknopf koennte eine andere Laenge liefern, wenn
// dazwischen etwas am Strangstand haengt. Dieselbe Vorsicht wie in
// schubladeOeffnen(), aus demselben Grund.
function abspannStarten(){
  MUS.goto('office'); MUS.muffle(false);
  const liste = abspannBlaetter();
  szeneTafelLauf = null;
  szeneTafeln(liste, {letzterKnopf:'ZUM SCHLUSS', ende: () => vorgangPanel(6),
                      zweiter:{t:'ZUM LETZTEN BILD', tun: () => szeneTafel(liste.length - 1)}});
}

// Eine Schreibstelle, sechs Schritte. Drei davon sind mit SZ4 dazugekommen und
// laufen nur, wenn der Zwischenbescheid klebt: der Gruss des Fuersten, die
// Taste, die nichts tut, und die Frau mit der Teetasse. #ovPanel-Schreibstellen
// bleiben acht, es ist dieselbe Stelle.
//
// Warum die drei vorne stehen und nicht als 7 bis 9 hinten angehaengt sind,
// obwohl das die Guards billiger umgestellt haette: die Schrittnummer IST die
// Reihenfolge, in der der Spieler das Panel sieht. Eine Kette, die bei 7
// anfaengt und bei 4 weitergeht, waere beim naechsten Weiterschreiben eine
// Falle. Die Guards sind mitgezogen, das ist die ehrlichere Seite der Rechnung.
function vorgangPanelHtml(schritt){
  // Schritt 1 bis 3: Vorblatts letzter Zug. Der Fuerst ist hoeflich, sogar
  // jetzt, und sagt den Satz, den er seit vierhundert Jahren sagt.
  if(schritt === 1) return `
    <h1>ABLAGE V</h1>
    <p>Der Fürst steht. Er ist höflich, sogar jetzt.</p>
    <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">„Ich nehme an, Sie sind wieder nicht in dieser Sache hier.“</p>
    <button onclick="vorgangPanel(2)">ZUSTELLEN</button>`;
  if(schritt === 2) return `
    <h1>ANHÄNGIG</h1>
    <p>Auf dem Umschlag klebt der Zwischenbescheid. Nichts geschieht.</p>
    <p style="color:#c77dff;">Anhängig. Wird bearbeitet.</p>
    <button onclick="vorgangPanel(3)">NOCH EINMAL</button>`;
  if(schritt === 3) return `
    <h1>DIE TEETASSE</h1>
    <div style="text-align:left;">
      <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">„Ah. Das kenne ich.“</p>
      <p>Eine Tür geht auf. Eine Frau kommt herein, mit einer Teetasse. Sie ist nicht überrascht. Sie ist seit vierzig Jahren nicht mehr überrascht.</p>
      <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">„Ich bin noch im Dienst. Meine Entpflichtung wurde nie bearbeitet. Und dieses Haus führt den ältesten offenen Vorgang des Reiches. Damit bin ich weisungsbefugt. Und zwar über jeden hier.“</p>
      <p>Sie nimmt den Umschlag. Sie zieht den Zwischenbescheid ab. Es macht ein kleines Geräusch.</p>
      <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">„Aufgehoben. Ich hätte das vor vierzig Jahren tun sollen. Ich hatte den Brief nicht dabei. Das ist mein Fehler und er hat gedauert.“</p>
      <p>Sie gibt den Umschlag zurück. Sie gibt ihn Ihnen, nicht dem Fürsten.</p>
      <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">„Sie stellen zu. Sie sind der Außendienst. Ich habe keine Zuständigkeit für Zustellungen.“</p>
    </div>
    <button onclick="vorgangPanel(4)">ZUSTELLEN</button>`;
  if(schritt === 4) return `
    <h1>ZUSTELLUNG</h1>
    <p>Er dreht den Umschlag um. Er liest die Anschrift, bevor er den Inhalt liest, weil man das so macht.</p>
    <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">„Da steht mein Name. Da steht er die ganze Zeit.“</p>
    <p>Er öffnet. Er liest. Er liest lange. Der Kampf ist längst vorbei und niemand hat es angesagt.</p>
    <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">„Vierhundert Jahre. Und Sie kommen einfach vorbei.“</p>
    <button onclick="vorgangPanel(5)">WEITER</button>`;
  if(schritt === 5){
    const teile = VORGANG_PUZZLE.map(p => `<p>${p.frei() ? p.text : (p.sonst || p.text)}</p>`).join('');
    // Die Kapsel. Sie liegt nur auf dem Tisch, wenn der Spieler den Stopfen
    // gezogen hat, und sie ist der einzige Lohn dieses Strangs, der im Finale
    // ankommt. Gelesen wird amt.stopfenSchicht, dieselbe Groesse, an der SZ3
    // alles aufgehaengt hat.
    const kapsel = amt.stopfenSchicht ? `
      <p style="border-top:1px solid #5a4a2d;margin-top:10px;padding-top:8px;">Ganz zum Schluss legt jemand noch ein Blatt auf den Tisch. Es ist die Kapsel aus dem Rohr, zwei Zeilen, sehr alt: „Wer räumt das Papier aus dem Fluss?“ Der Fürst hat diese Frage gestellt. Er war damals sehr jung. Darunter steht seit heute eine Antwort, vier Wörter, langsam geschrieben, gezeichnet Zapf, Hausmeister. Der Fürst verbeugt sich vor dem Hausmeister. Vollständig, wie vor einem Haus des Reiches.</p>` : '';
    return `
    <h1>DAS FINALE</h1>
    <div style="max-height:38vh;overflow-y:auto;text-align:left;">${teile}${kapsel}</div>
    <p style="color:#f4d97a;">Der Vorgang 1 wird geschlossen.</p>
    <button onclick="abspannStarten()">WEITER</button>`;
  }
  // Schritt 6: was nach dreizehn Bildern noch zu sagen ist, und das ist wenig.
  // Der Abspann hat es erzaehlt; hier steht nur noch, was oben auf dem Blatt
  // steht, und der Knopf, der ein neues anlegt.
  return `
    <h1>VORGANG 1: GESCHLOSSEN</h1>
    <p>Der älteste offene Vorgang des Reiches ist bearbeitet.</p>
    <p style="font-size:calc(12px * var(--fs));color:#9a8a5f;">Bearbeitungsdauer: vierhundert Jahre. Zugestellt am Nachmittag. Kein Widerspruch eingelegt.</p>
    <button onclick="location.reload()">NEUEN VORGANG ANLEGEN</button>`;
}
function vorgangPanel(schritt){
  if(schritt === 6){ MUS.goto('office'); MUS.muffle(false); }
  document.getElementById('ovPanel').innerHTML = vorgangPanelHtml(schritt);
  document.getElementById('overlay').style.display = 'flex';
  if(schritt !== 6) MUS.muffle(true);
}
// Ein einziger Zustandswechsel friert den kompletten Simulationspfad ein
// (update(dt) beginnt mit if(state !== 'play') return;). Horde-Spawner und
// Boss-KI stoppen dadurch von selbst, killMon()/die Siegweiche bleiben
// unberührt: der Boss stirbt nie, winGame() läuft nicht. Der Kampf bleibt
// Zeile für Zeile derselbe, Zustellen ist ein Ausweg, keine Umschreibung.
function zustellen(){
  if(state !== 'play' || currentLevel !== 2 || !boss || boss.dead || !vorgangZustellbar()) return;
  state = 'zustellung';
  aktArt = 0; aktSperre = 1; updateHUD();
  el('bossbar').style.display = 'none';
  MUS.swell();
  // SZ4: Wer die Versuchung gespielt hat, faengt bei Vorblatts Zwischenbescheid
  // an und nicht bei der Zustellung. Der Einstieg ist die einzige Stelle, an
  // der die drei neuen Schritte haengen; alles andere daran ist unveraendert.
  vorgangPanel(vorgangAnhaengig() ? 1 : 4);
}

// --- Guard, Bauform wie rangAssert()/auftragAssertBrett() oben. TDZ-sicher:
// liest nur amt/CONFIG/kladde (alle oberhalb geladen) und die Tabellen aus
// diesem Block. AUFTRAG_TYPEN wird bewusst nicht gelesen.
function vorgangAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('W5 Vorgang:', m, ...r); };
  const EMOJI = PRUEF_EMOJI;
  const GEHEIM = PRUEF_GEHEIM;
  const text = (txt, feld) => {
    if(!txt) return fehler('Text leer', feld);
    if(txt.indexOf('undefined') >= 0) fehler('undefined im Text', feld, txt);   // GW13
    if(/[—–]/.test(txt)) fehler('Gedankenstrich statt Interpunkt', feld, txt);
    if(EMOJI.test(txt))  fehler('Emoji im Text', feld, txt);
    for(const g of GEHEIM) if(txt.indexOf(g) >= 0) fehler('Sperrvermerk: Kesselgrammatik im Text', g, feld, txt);
  };
  const schichtenEcht = amt.schichten, modusEcht = CONFIG.schichtModus,
        vorgangEcht = kladde.vorgang, bonusEcht = amt.bonusNachwachsen, craftsEcht = kladde.crafts,
        // SZ4: der sechste. Die Kapsel im Finale hängt an amt.stopfenSchicht,
        // und ein Guard, der sie in beiden Zuständen rendert, muss den echten
        // Stand danach wiederhaben, auch wenn dazwischen etwas wirft.
        stopfenEcht = amt.stopfenSchicht;
  try {   // GW26i: sechs Spiegel, alle im finally

  // (1) Tabellenform: vier Zeilen, Zeilen 1-3 mit je einem der drei Biome,
  // Zeile 4 ohne Biom. Ankerprüfung auf den zusammengesetzten Wortlaut.
  const biomeGesehen = {};
  for(const id of [1,2,3,4]){
    const z = ADRESS_ZEILEN[id];
    if(!z){ fehler('Adresszeile fehlt', id); continue; }
    if(id <= 3){
      if(!z.biome) fehler('Kammer-Adresszeile ohne Biom', id);
      else biomeGesehen[z.biome] = (biomeGesehen[z.biome]||0) + 1;
    } else if(z.biome) fehler('Ablage-V-Adresszeile hat ein Biom', id);
  }
  // Monsterkatalog M1: bis zu den fünf Bändern stand hier "jedes Biom genau
  // einmal". Das war richtig, solange es genau drei Bänder und genau drei
  // Kammerzeilen gab, aber es meinte nie "alle Bänder": der Hauptvorgang
  // schickt den Spieler in DREI Ablagen, nicht in jede. Seit M1 gibt es fünf
  // Bänder, deshalb steht die Absicht jetzt ausgeschrieben da, statt sich aus
  // der Bandzahl zu ergeben. Geprüft wird dasselbe wie vorher und eine Spur
  // mehr: drei verschiedene Biome, jedes existiert, keines doppelt.
  const bandKeys = BIOME_BANDS.map(z => z.key);
  for(const b in biomeGesehen){
    if(bandKeys.indexOf(b) < 0) fehler('Adresszeile in einem Biom, das es nicht gibt', b);
    if(biomeGesehen[b] !== 1)   fehler('Biom mehr als einmal vergeben', b, biomeGesehen[b]);
  }
  if(Object.keys(biomeGesehen).length !== 3)
    fehler('Nicht drei verschiedene Kammer-Biome', Object.keys(biomeGesehen).join(',') || 'keins');
  if(VORGANG_ANSCHRIFT !== 'An Fürst Nachtrag, zu Händen, persönlich.') fehler('Anschrift-Wortlaut driftet', VORGANG_ANSCHRIFT);

  // (2) Vollständigkeit: SERIE_AKT deckt genau die in BLAETTER vorkommenden
  // Serien ab, kein Wert über 5 — sonst wäre eine Serie still unerreichbar
  // (die Sorge aus blaetterAssert()).
  const serienInBlaettern = {};
  for(const id of BLAETTER_KEYS) serienInBlaettern[BLAETTER[id].serie] = true;
  for(const s in serienInBlaettern) if(!(s in SERIE_AKT)) fehler('Serie ohne Akt-Zuordnung', s);
  for(const s in SERIE_AKT){
    if(!(s in serienInBlaettern)) fehler('SERIE_AKT nennt unbekannte Serie', s);
    if(!(SERIE_AKT[s] >= 1 && SERIE_AKT[s] <= 5)) fehler('Akt-Zuordnung außerhalb 1-5', s, SERIE_AKT[s]);
  }

  // (3) Gatter-Sweep: nie ein Rücksprung von frei nach gesperrt, Schwellen
  // exakt bei den Sollwerten.
  CONFIG.schichtModus = true;
  const vorherFrei = {};
  for(let s = 0; s <= 60; s++){
    amt.schichten = s;
    for(const serie in SERIE_AKT){
      const frei = serieFrei(serie);
      if(vorherFrei[serie] && !frei) fehler('Serie springt von frei zu gesperrt', serie, s);
      vorherFrei[serie] = frei;
    }
  }
  const SCHWELLE = {A:0, B:0, C:10, D:20, E:30, F:40};
  for(const serie in SCHWELLE){
    if(SCHWELLE[serie] > 0){ amt.schichten = SCHWELLE[serie] - 1; if(serieFrei(serie)) fehler('Serie zu früh frei', serie, amt.schichten); }
    amt.schichten = SCHWELLE[serie];
    if(!serieFrei(serie)) fehler('Serie nicht frei ab Sollschwelle', serie, amt.schichten);
  }

  // (4) Der Abnahmesatz: schichtModus=false hält alles offen, Adress-Akt bleibt aus.
  CONFIG.schichtModus = false; amt.schichten = 0;
  for(const serie in SERIE_AKT) if(!serieFrei(serie)) fehler('schichtModus=false sperrt eine Serie', serie);
  if(vorgangAdressAkt()) fehler('schichtModus=false, aber vorgangAdressAkt() ist wahr');
  // Die Zusage wörtlich, seit dem Modus-Gate vom 20.08.2026 auch belegbar: ein
  // aus dem Schichtmodus mitgebrachter Vollbestand stellt hier nicht zu und
  // vertagt auch nichts. Vorher las vorgangZustellbar() CONFIG nirgends, die
  // Zeile hätte diesen Punkt gar nicht prüfen können.
  kladde.vorgang = {1:true, 2:true, 3:true, 4:true};
  for(const s of [40, 60]){
    amt.schichten = s;
    if(vorgangZustellbar()) fehler('schichtModus=false, aber vorgangZustellbar() ist wahr', s);
    if(vorgangVertagt())    fehler('schichtModus=false, aber vorgangVertagt() ist wahr', s);
  }
  kladde.vorgang = vorgangEcht;
  CONFIG.schichtModus = modusEcht; amt.schichten = schichtenEcht;

  // (5) Bestandsprädikate, alle 16 Teilmengen. findeAdresszeile() darf hier nie
  // aufgerufen werden — die Funktion ruft saveKladde() und überschriebe den
  // echten Spielstand. Direkt auf dem Spiegel geschrieben.
  for(let mask = 0; mask < 16; mask++){
    const spiegel = {};
    for(let b = 0; b < 4; b++) if(mask & (1<<b)) spiegel[b+1] = true;
    kladde.vorgang = spiegel;
    const drei = !!(spiegel[1] && spiegel[2] && spiegel[3]);
    const voll = drei && !!spiegel[4];
    if(vorgangDreiZeilen() !== drei) fehler('vorgangDreiZeilen() driftet', mask);
    if(vorgangAusfertigung() !== voll) fehler('vorgangAusfertigung() driftet', mask);
  }
  kladde.vorgang = vorgangEcht;

  // (6) W6-Kopplung: INSIGNIE.siegel existiert, rangDienstsiegel() driftet
  // nicht, rangZeichnungsbefugt() genau ab Schicht 30 wahr.
  if(!INSIGNIE.siegel) fehler('INSIGNIE.siegel fehlt');
  else {
    amt.bonusNachwachsen = 0;
    if(rangDienstsiegel() !== false) fehler('rangDienstsiegel() bei bonusNachwachsen=0 nicht falsch');
    amt.bonusNachwachsen = 20;
    if(rangDienstsiegel() !== true) fehler('rangDienstsiegel() bei bonusNachwachsen=20 nicht wahr');
  }
  amt.bonusNachwachsen = bonusEcht;
  for(let s = 0; s <= 60; s += 5){
    amt.schichten = s;
    if(rangZeichnungsbefugt() !== (s >= 30)) fehler('rangZeichnungsbefugt() weicht von Schicht 30 ab', s);
  }
  amt.schichten = schichtenEcht;

  // (7) Zustell-Vorbedingung: Ausfertigung × Schichtschwelle, gegen einen
  // ausgeschriebenen Sollwert statt gegen eine Trefferzahl. GW10: seit
  // vorgangZustellbar() zusätzlich aktStand() >= 5 verlangt, reichen zwei
  // Schichtwerte nicht mehr. 39 ist der Randwert, bei dem die alte Fassung noch
  // wahr war, 40 der neue Kipppunkt (dieselbe Schwelle wie JAHRES_BONI Index 3).
  // Die frühere Kreuzproduktzählung konnte gar nicht anders als aufgehen: bei
  // zwei fixierten Faktoren ist genau eine von vier Kombinationen wahr, egal was
  // die Funktion tut.
  //
  // Derselbe Sweep trägt seit dem 20.08.2026 die Vertagung. Ihr Sollwert ist
  // bewusst in anderen Größen ausgeschrieben als ihre Definition: die Funktion
  // liest rangZeichnungsbefugt() und aktStand(), der Sollwert hier nur den
  // Schichtwert. Verschöbe jemand eine der beiden Schwellen, bliebe die
  // Definition mit sich selbst einig und dieser Punkt fiele trotzdem.
  // Der Modus wird für den Sweep erzwungen, Muster langAssert()/GW6: seit dem
  // Modus-Gate vom 20.08.2026 hinge der ganze Sollwertblock sonst am echten
  // CONFIG-Wert und liefe bei schichtModus=false ins Leere, statt zu fallen.
  CONFIG.schichtModus = true;
  let zustellbarCount = 0, vertagtCount = 0;
  for(const ausf of [false, true]){
    kladde.vorgang = ausf ? {1:true, 2:true, 3:true, 4:true} : {};
    for(const s of [0, 30, 39, 40]){
      amt.schichten = s;
      const soll = ausf && s >= 40;
      if(vorgangZustellbar() !== soll) fehler('vorgangZustellbar() weicht vom Sollwert ab', 'ausfertigung=', ausf, 'schichten=', s);
      if(vorgangZustellbar()) zustellbarCount++;
      const sollVertagt = ausf && s < 40;
      if(vorgangVertagt() !== sollVertagt) fehler('vorgangVertagt() weicht vom Sollwert ab', 'ausfertigung=', ausf, 'schichten=', s);
      if(vorgangVertagt()) vertagtCount++;
    }
  }
  if(zustellbarCount !== 1) fehler('vorgangZustellbar() nicht genau einmal wahr im Sweep', zustellbarCount);
  if(vertagtCount !== 3) fehler('vorgangVertagt() nicht genau dreimal wahr im Sweep', vertagtCount);
  kladde.vorgang = vorgangEcht; amt.schichten = schichtenEcht; CONFIG.schichtModus = modusEcht;

  // (8) Aktzeilen-Anker: die drei geänderten Zeilen stehen an den erwarteten
  // Indizes von lisbeth.akt/noergel.akt.
  const lisbeth = DORF_FIGUREN.find(f => f.key === 'lisbeth');
  const noergel = DORF_FIGUREN.find(f => f.key === 'noergel');
  if(!lisbeth || lisbeth.akt[3].indexOf('Nörgel') < 0) fehler('Lisbeth Akt-IV-Zeile fehlt oder falsch verankert');
  if(!lisbeth || lisbeth.akt[4].indexOf('gefragt') < 0) fehler('Lisbeth Akt-V-Zeile fehlt oder falsch verankert');
  if(!noergel || noergel.akt[3].indexOf('gezeichnet') < 0) fehler('Nörgel Akt-IV-Zeile fehlt oder falsch verankert');

  // (9) Formregeln und Sperrvermerk über jede neue Tabelle.
  for(const id in ADRESS_ZEILEN) ADRESS_ZEILEN[id].lines.forEach((l,i) => text(l, 'Adresszeile '+id+'/'+i));
  text(VORGANG_ANSCHRIFT, 'Anschrift');
  VORGANG_JAHRES.forEach((e,i) => { text(e.zwirn, 'Jahres-Zwirn '+i); if(e.hinweis) text(e.hinweis, 'Jahres-Hinweis '+i); });
  text(VORGANG_JAHRES_WEITER, 'Jahres-Weiter');
  VORGANG_PUZZLE.forEach((p,i) => { text(p.text, 'Puzzle '+i); if(p.sonst) text(p.sonst, 'Puzzle-Sonst '+i); });
  VERTAGT_ZEILEN.forEach((l,i) => text(l, 'Vertagung '+i));
  if(VERTAGT_ZEILEN.length !== 3) fehler('VERTAGT_ZEILEN hat nicht drei Zeilen', VERTAGT_ZEILEN.length);

  // (10) Gerenderte Blöcke, HTML-gestrippt — Muster rangAssert().
  const strip = html => html.replace(/<[^>]+>/g, ' ');
  for(let s = 10; s <= 100; s += 10){ amt.schichten = s; text(strip(vorgangJahresBlock()), 'Jahresblock s='+s); }
  amt.schichten = schichtenEcht;
  // SZ4: aus drei Schritten sind sechs geworden, und die drei neuen laufen
  // nur mit Zwischenbescheid. Geprueft wird jeder einzeln, weil jeder eigenen
  // Text traegt und keiner von einem anderen gerendert wird.
  for(const st of [1, 2, 3, 4, 6]) text(strip(vorgangPanelHtml(st)), 'Schlusspanel ' + st);
  amt.bonusNachwachsen = 0; kladde.crafts = 0; amt.stopfenSchicht = 0;
  text(strip(vorgangPanelHtml(5)), 'Schlusspanel 5, leer');
  amt.bonusNachwachsen = 20; kladde.crafts = 1; amt.stopfenSchicht = 30;
  text(strip(vorgangPanelHtml(5)), 'Schlusspanel 5, voll mit Kapsel');
  amt.stopfenSchicht = stopfenEcht;
  amt.bonusNachwachsen = bonusEcht; kladde.crafts = craftsEcht;
  kladde.vorgang = {};
  if(vorgangBestandBlock() !== '') fehler('vorgangBestandBlock() bei leerem Bestand nicht leer');
  kladde.vorgang = {1:true, 2:true, 3:true, 4:true};
  // GW10: beide Fassungen der Vollständigkeitszeile, nicht nur die, die der echte
  // Spielstand gerade trifft. Bei Schicht 30 muss der Akt-V-Halbsatz stehen (die
  // Ausfertigung ist vollständig, zugestellt wird trotzdem nicht), bei 40 nicht.
  amt.schichten = 30; text(strip(vorgangBestandBlock()), 'Bestandblock voll, Akt IV');
  if(vorgangBestandBlock().indexOf('fünften Akt') < 0) fehler('Bestandblock nennt bei Schicht 30 den Akt nicht');
  amt.schichten = 40; text(strip(vorgangBestandBlock()), 'Bestandblock voll, Akt V');
  if(vorgangBestandBlock().indexOf('fünften Akt') >= 0) fehler('Bestandblock nennt bei Schicht 40 immer noch den Akt');
  amt.schichten = schichtenEcht;

  // (11) GW16: die Adresskammer-Markierung, auf einer Attrappenliste. Bis hierher
  // war die gesamte W5-Verdrahtung von keinem Guard erfasst — die Abnahmezeilen
  // zu Markierung und selbstheilendem Schild stuetzten sich auf eine einmalige
  // Konsolensitzung, und W7 hat drawKammerTuer() seither wieder angefasst.
  // Geprüft werden die Invarianten, die unabhaengig davon gelten, welche Tür
  // der Zufall trifft.
  for(let maske = 0; maske < 16; maske++){
    kladde.vorgang = {};
    for(let z = 1; z <= 4; z++) if(maske & (1 << (z - 1))) kladde.vorgang[z] = true;
    // Türzahl je Biom bewusst als Literal und NICHT aus CONFIG.kammerTueren:
    // der Guard soll die Markierung prüfen, nicht den gerade eingestellten
    // Dorf-Ausbau mitspiegeln. 2 ist der Bodenwert, der immer da sein muss —
    // seit W-Groß liefert das Spiel mit KAMMERTUEREN_BASIS=5 mehr. Weniger zu
    // prüfen als vorhanden ist, ist die harmlose Richtung.
    const attrappe = [];
    for(const b of BIOME_BANDS.map(z=>z.key)) for(let i = 0; i < 2; i++) attrappe.push({biome:b, diff:3});
    markiereAdressTueren(attrappe);
    const proZeile = {};
    for(const t of attrappe){
      if(!t.adr) continue;
      proZeile[t.adr] = (proZeile[t.adr] || 0) + 1;
      const z = ADRESS_ZEILEN[t.adr];
      if(!z) { fehler('Markierung mit unbekannter Adresszeile', t.adr); continue; }
      if(z.biome !== t.biome) fehler('Adresszeile im falschen Biom markiert', t.adr, z.biome, t.biome);
      if(vorgangHat(t.adr)) fehler('bereits gefundene Adresszeile erneut markiert', t.adr, maske);
      // Das Sonderschild sondert genau dann, wenn die Zeile noch fehlt — die
      // Selbstheilung aus dem Phasendokument. Auf einer markierten Tür muss
      // sie in dieser Maske also greifen.
      if(!(t.adr && !vorgangHat(t.adr))) fehler('Sonderschild greift auf markierter Tuer nicht', t.adr, maske);
    }
    for(const id in ADRESS_ZEILEN){
      const z = ADRESS_ZEILEN[id], soll = (z.biome && !vorgangHat(id)) ? 1 : 0;
      if((proZeile[id] || 0) !== soll)
        fehler('Markierungen je Adresszeile', id, 'ist', proZeile[id] || 0, 'soll', soll, 'maske', maske);
    }
  }
  kladde.vorgang = vorgangEcht;
  } finally {
    amt.schichten = schichtenEcht; CONFIG.schichtModus = modusEcht;
    kladde.vorgang = vorgangEcht; amt.bonusNachwachsen = bonusEcht;
    kladde.crafts = craftsEcht; amt.stopfenSchicht = stopfenEcht;
  }

  console.assert(ok, 'W5 Vorgang: Assertion fehlgeschlagen, siehe Konsole.');
  return ok;
}
// Der Selbstaufruf steht seit W7 unten hinter langAssert(), nicht hier:
// vorgangAssert() rendert vorgangPanelHtml(5), und dessen Finale liest seither
// langFertig('dorffest'). Von hier aus wäre das ein ReferenceError durch
// Temporal Dead Zone, den node --check nicht findet. Die Funktion selbst bleibt
// stehen, nur der Aufruf ist gewandert — gleiche Bauform wie der Umzug von
// aktStand() in W5.


function showJahresgespraech(){
  MUS.goto('office'); MUS.muffle(false);   // ggf. noch vom Dienstbericht gedämpft — der Marsch soll klar klingen
  const idx = (Math.floor(amt.schichten/10) - 1) % JAHRES_BONI.length;
  const b = JAHRES_BONI[idx]; b.apply(); saveAmt();
  // W7 Nr. 5: nach dem apply(), damit amt.bonusManaRegen bereits steht, wenn
  // der Strang seinen Auslöser liest.
  langEreignis('jahresbonus', {name: b.name});
  document.getElementById('ovPanel').innerHTML = `
    <h1>JAHRESGESPRÄCH</h1>
    <p>Der Bürgermeister bedankt sich für ${amt.schichten} Schichten treuen Dienstes.</p>
    <p style="font-size:calc(12px * var(--fs));font-style:italic;color:#c9b98a;">„Ich habe alles mitgeschrieben."</p>
    <div style="background:rgba(0,0,0,.5);padding:12px;border-radius:8px;margin:14px 0;border:1px solid #5a4a2d;">
      <b>${b.name}</b><br><span style="font-size:calc(12px * var(--fs));color:#c9b98a;">${b.text}</span>
      ${b.name === 'Kaffeemaschine' && langLaeuft('kaffeemaschine')
        ? '<br><span style="font-size:calc(11px * var(--fs));color:#9a8a5f;">Zapf trägt sie herein und stellt sie sehr vorsichtig ab. Er sagt nichts dazu. Noch nicht.</span>' : ''}
    </div>
    ${vorgangJahresBlock()}
    ${rangZeremonieBlock()}
    <button onclick="showDorf()">WEITER</button>
  `;
  document.getElementById('overlay').style.display = 'flex';
}

function buyAusbau(key){
  const def = AUSBAU_DEFS.find(d => d.key === key); if(!def) return;
  const lvl = amt.ausbauten[key]; if(lvl >= def.max) return;
  const cost = def.cost(lvl); if(amt.bankGold < cost) return;
  amt.bankGold -= cost; amt.ausbauten[key] = lvl+1; saveAmt(); showDorf();
}
function buyVermutungen(){
  if(amt.ausbauten.vermutungen || amt.bankGold < 100) return;
  amt.bankGold -= 100; amt.ausbauten.vermutungen = true; saveAmt(); showDorf();
}
function unlockStartFluch(){
  if(amt.ausbauten.startFluchUnlocked || amt.bankGold < 60) return;
  amt.bankGold -= 60; amt.ausbauten.startFluchUnlocked = true; amt.ausbauten.startFluch = STARTFLUCH_WAHL[0];
  saveAmt(); showDorf();
}
function waehleStartFluch(k){ amt.ausbauten.startFluch = k; saveAmt(); showDorf(); }

// ===========================================================================
//  W4: SCHWARZES BRETT — Dienstaufträge, Weltbibel Kapitel 11 + 14
//  Drei Aushänge je Schicht, einer wählbar, Fortschritt über bestehende Zähler
//  (shiftKillsByType, player.pouch, player.gold, Kammer-/Kessel-Ereignisse).
//  Muss NACH aktStand() (oben) stehen: auftragAssertBrett() ruft sich selbst
//  sofort auf und würfelt dabei über alle Aktstände, das wäre vor aktStand()
//  ein TDZ-ReferenceError.
// ===========================================================================

// Drei Pools, ein Aushang je Pool. Bietet das Brett immer eine billige, eine
// mittlere und eine teure Möglichkeit, und drei verschiedene Typen sind per
// Konstruktion garantiert (auftragAssertBrett prüft das zusätzlich nach).
const AUFTRAG_POOLS = [
  ['menge','sammlung','verzicht'],
  ['ort','kammer','beglaubigung','verfahren'],
  ['bilanz','kammer','menge','reise'],
];

const AUFTRAG_BEMERKUNGEN = [
  'Frist: heute. Es ist immer heute.',
  'Nicht erfüllbar bei ungünstigem Wetter. Wetter ist nicht vorgesehen.',
  'Bei Rückfragen wenden Sie sich an die Amtsleitung.',
  'Abbruch ist zulässig und wird nicht vermerkt.',
  'Ein Aushang gilt für eine Schicht. Danach hängt ein neuer.',
  'Die Vergütung ist eine Aufwandsentschädigung.',
];

// Nur vier der neun Typen brauchen zaehle() — die übrigen fünf lesen einen
// Zustand, der ohnehin schon existiert (shiftKillsByType, player.pouch,
// player.gold, shiftKillsTotal). zaehle() liefert immer den NEUEN Wert von
// auftragStand, kein Delta — nur so funktioniert Math.max() ohne Sonderfall.
// st = Pool-Index (0/1/2) beim Würfeln, bestimmt Lohnstufe und Zielgröße.
const AUFTRAG_TYPEN = {

  menge: {
    // GW2: Der Deckel ist eine Weltgrenze, keine Balance-Setzung.
    // auftragTypBevorzugen() ersetzt nur den TYP eines ohnehin gesetzten
    // Monsters, nie deren ZAHL — ein Ziel über dem, was ein Biom trägt, wäre
    // schlicht unerfüllbar. W-Groß leitet den Deckel deshalb aus ZIEL_MOBS ab,
    // statt ihn als Handzahl zu führen: 600 Monster auf drei Bänder, ein Roster
    // von vier Einträgen je Band, mal 0.6 für Ablehnungen und für Kartenecken,
    // die in einer Schicht realistisch nicht ablaufen werden.
    wuerfle:(st,stufe)=>({par: AUFTRAG_MOBS[rri(0, AUFTRAG_MOBS.length-1)],
                          ziel: st===0 ? 4+stufe : Math.min(MENGE_DECKEL, 9+stufe*2)}),
    titel: a => `Vorgangslage ${BIOM_AMT[AUFTRAG_BIOM[a.par]].nom}`,
    satz:  a => `${MONDEF[a.par].name} (${MONDEF[a.par].art}), ${a.ziel} Stück.`,
    stand: a => shiftKillsByType[a.par] || 0,
    sofort:true, pruefePar: a => AUFTRAG_MOBS.indexOf(a.par) >= 0 && a.ziel > 0 && a.ziel <= MENGE_DECKEL},

  ort: {
    // W-Groß: Ziel von 8+stufe*2 auf 6+stufe gesenkt. Nicht wegen der Monsterzahl
    // — davon gibt es jetzt mehr —, sondern wegen der Uhr: ein Band ist 320 mal
    // rund 110 Kacheln, der Rundgang ist der Aushang, den die große Karte am
    // stärksten trifft.
    wuerfle:(st,stufe)=>({par: BIOME_BANDS[rri(0, BIOME_BANDS.length-1)].key, ziel: 6+stufe}),
    titel: a => `Rundgang ${BIOM_AMT[a.par].nom}`,
    satz:  a => `${a.ziel} Vorgänge, erledigt ${BIOM_AMT[a.par].dat}.`,
    zaehle:(a,was,info)=> was==='kill' && zutatBiome(info.y)===a.par ? auftragStand+1 : auftragStand,
    stand: () => auftragStand,
    sofort:true, pruefePar: a => !!BIOME_MOBS[a.par]},

  kammer: {
    wuerfle:(st,stufe)=>({par:'', ziel: st===1 ? clamp(2+Math.floor(stufe/2),2,3)
                                        : clamp(4+Math.floor(stufe/3),4,5)}),
    titel: () => 'Aktenschrank, verschlossen',
    satz:  a => `Öffnen Sie einen Vorgang ab Aufwand ${a.ziel}.`,
    zaehle:(a,was,info)=> was==='kammer' ? Math.max(auftragStand, info.diff) : auftragStand,
    stand: () => auftragStand,
    sofort:true, pruefePar: a => a.ziel >= 1 && a.ziel <= 5},

  // "mitführen" statt "zurückbringen": endShift() kappt den Beutel auf ein
  // kleines Kontingent (CONFIG.zutatenMitnahmeBasis, Grundwert 5). Ein
  // "zurückbringen" wäre bei größerem Ziel von vornherein unerfüllbar.
  sammlung: {
    wuerfle:(st,stufe)=>({par: AUFTRAG_MOBS[rri(0, AUFTRAG_MOBS.length-1)], ziel: 3+stufe}),
    titel: () => 'Bestandsaufnahme',
    satz:  a => `Führen Sie ${a.ziel} Stück ${ZUTAT_NOUNS[a.par].n} mit.`,
    stand: a => pouchZaehle(a.par),
    sofort:true, pruefePar: a => AUFTRAG_MOBS.indexOf(a.par) >= 0 && !!ZUTAT_NOUNS[a.par]},

  // Sperrvermerk: die Auflage ist eine reine Ergebniseigenschaft des fertigen
  // Stücks (Stückzahl oder Güte), nie Slot/Wirkung/Fluch/Zutatenzahl — das wäre
  // Kesselgrammatik. auftragAssertBrett() erzwingt genau diese zwei Varianten.
  beglaubigung: {
    wuerfle:(st,stufe)=> rri(0,1) ? {par:'anzahl', ziel: 2+Math.floor(stufe/2)}
                                  : {par:'guete',  ziel: stufe < 2 ? 1 : 2},
    titel: () => 'Prüfung der Nebenbestimmungen',
    satz:  a => a.par==='anzahl' ? `Beglaubigen Sie ${a.ziel} Stück.`
                                 : `Beglaubigen Sie ein Stück ab Güte ${RARITY[a.ziel].name}.`,
    zaehle:(a,was,info)=> was!=='kessel' ? auftragStand
                        : a.par==='anzahl' ? auftragStand+1 : Math.max(auftragStand, info.rar),
    stand: () => auftragStand,
    sofort:true, pruefePar: a => (a.par==='anzahl' && a.ziel<=4) || (a.par==='guete' && a.ziel>=1 && a.ziel<=2)},

  // sofort:false — Bedingung muss beim Schichtende gelten, sonst wäre sofortiger
  // Feierabend die billigste Erfüllung.
  verzicht: {
    wuerfle:(st,stufe)=>({par:'', ziel: 10+stufe*3}),
    titel: () => 'Nüchternheitsgebot, freiwillig',
    satz:  a => `${a.ziel} Vorgänge ohne einen Schluck.`,
    bruch: (a,was) => was === 'trank',
    stand: () => shiftKillsTotal,
    sofort:false, pruefePar: a => a.ziel <= 30},

  verfahren: {
    wuerfle:(st,stufe)=>({par:'', ziel: 12+stufe*3}),
    titel: () => 'Dienst nach Vorschrift',
    satz:  a => `${a.ziel} Vorgänge, nur in Nahbearbeitung.`,
    bruch: (a,was) => was === 'zauber',
    stand: () => shiftKillsTotal,
    sofort:false, pruefePar: a => a.ziel <= 30},

  // Erst ab Akt II angeboten (Schicht 1 gehört Knöterichs Onboarding), Portal-
  // Erscheinen bei laufendem Aushang hart auf Chance 1 gesetzt (siehe loadLevel2-Umfeld).
  reise: {
    wenn: () => aktStand() >= 2,
    wuerfle:()=>({par:'', ziel:1}),
    titel: () => 'Fehlleitung, geplant',
    satz:  () => 'Betreten Sie Ablage V.',
    zaehle:(a,was)=> was==='ablage' ? 1 : auftragStand,
    stand: () => auftragStand,
    sofort:true, pruefePar: a => a.ziel === 1},

  bilanz: {
    wuerfle:(st,stufe)=>({par:'', ziel: 500+stufe*250}),
    titel: () => 'Wirtschaftlichkeit',
    satz:  a => `Schichtende mit mindestens ${a.ziel} Gold.`,
    stand: () => player.gold,
    sofort:false, pruefePar: a => a.ziel <= 1500},
};

const AUFTRAG_LOHN = [150, 240, 330];                        // Grundwert je Pool-Index st
const auftragLohn = st => AUFTRAG_LOHN[st] + rri(0,7)*10;    // 150..220 / 240..310 / 330..400

// Regressionsfalle: nur rri (Math.random) verwenden, nie ri/R — der gesiegelte
// mulberry32-Strom erzeugt die Weltkarte und darf hier nicht mitlaufen.
function auftragWuerfeln(){
  const stufe = aktStand() - 1;               // 0..4, keine eigene Persistenz
  const liste = [], genommen = {};
  for(let st = 0; st < 3; st++){
    let frei = AUFTRAG_POOLS[st].filter(k => !genommen[k]
                   && (!AUFTRAG_TYPEN[k].wenn || AUFTRAG_TYPEN[k].wenn()));
    // GW26j: Rueckfall auf den ungefilterten Pool. Heute strukturell unmoeglich,
    // weil bilanz exklusiv in Pool 2 liegt und nur reise ein wenn() trägt. Ein
    // zusaetzliches Gate machte daraus rri(0,-1) -> frei[0] -> undefined ->
    // TypeError beim Laden, also einen Totalausfall statt einer Guard-Meldung.
    if(!frei.length) frei = AUFTRAG_POOLS[st].slice();
    const typ = frei[rri(0, frei.length-1)];
    const def = AUFTRAG_TYPEN[typ];
    const p = def.wuerfle(st, stufe);
    genommen[typ] = true;
    // Nörgels Amtsleitungs-Bemerkung (Index 2) liegt Kapitel 11 zufolge ab
    // Schicht 1 immer aus — der mittlere Aushang (st===1) trägt sie deshalb fest.
    liste.push({typ, st, ziel:p.ziel, par:p.par||'', bm: st===1 ? 2 : rri(0, AUFTRAG_BEMERKUNGEN.length-1),
                lohn: auftragLohn(st)});
  }
  return liste;
}

// Aushang aus einem älteren Spielstand, dessen Typschlüssel es nicht mehr gibt,
// wird stillschweigend fallengelassen. Kein saveAmt() hier — das wäre ein
// localStorage-Schreibvorgang bei jedem Seitenaufruf; der nächste saveAmt() räumt auf.
(function auftragMigration(){
  if(amt.auftrag && !AUFTRAG_TYPEN[amt.auftrag.typ]) amt.auftrag = null;
  if(amt.brett && amt.brett.liste.some(a => !AUFTRAG_TYPEN[a.typ])) amt.brett = null;
})();

// SP1: Die Heilung der schon getroffenen Bestände steht NICHT hier, sondern
// hinter langFertig() weiter unten. Sie las hier oben eine Konstante, die erst
// 600 Zeilen später deklariert wird — die TDZ-Falle, vor der das README warnt,
// und im ersten Prüflauf dieses Abschnitts prompt hineingelaufen.

// --- W4: Aushang-Assertion, Bauform wie knAssertCaps() weiter oben. Beweist
// beim Start zwei Dinge: (1) kein würfelbarer Aushang kann unerfüllbar sein,
// (2) kein erzeugter Text sprengt Zeichendeckel, Formregeln oder Sperrvermerk.
// amt.schichten wird gespiegelt und exakt wiederhergestellt, kein saveAmt().
function auftragAssertBrett(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('W4 Aushang:', m, ...r); };
  const EMOJI = PRUEF_EMOJI;
  const GEHEIM = PRUEF_GEHEIM;
  const text = (txt, cap, feld) => {
    if(!txt) return fehler('Text leer', feld);
    if(txt.length > cap) fehler('Zeichendeckel', feld, JSON.stringify(txt), txt.length, '>', cap);
    if(/[—–]/.test(txt)) fehler('Gedankenstrich statt Interpunkt', feld, txt);
    if(EMOJI.test(txt))  fehler('Emoji im Figurentext', feld, txt);
    for(const g of GEHEIM) if(txt.indexOf(g) >= 0) fehler('Sperrvermerk: Kesselgrammatik im Text', g, txt);
  };

  // (0) Das abgeleitete Roster ist die Abnahmezusage wörtlich: "kein Auftrag auf
  // ein Monster, das im gewählten Biom nicht spawnt".
  for(const t of AUFTRAG_MOBS){
    if(!MONDEF[t]) fehler('Typ ohne MONDEF-Eintrag', t);
    else {
      if(MONDEF[t].reserved) fehler('reservierter Typ im Aushang-Roster', t);
      if(MONDEF[t].boss)     fehler('Boss im Aushang-Roster', t);
      if(!MONDEF[t].art)     fehler('Typ ohne Vorgangsart, Satz wäre unvollständig', t);
    }
    if(!ZUTAT_NOUNS[t]) fehler('Typ ohne ZUTAT_NOUNS, Sammlung wäre unerfüllbar', t);
    let n = 0; for(const b in BIOME_MOBS) if(BIOME_MOBS[b].indexOf(t) >= 0) n++;
    if(n === 0) fehler('Typ spawnt in keinem Biom', t);
    if(n > 1)   fehler('Typ in mehreren Biomen, AUFTRAG_BIOM wäre mehrdeutig', t);
  }
  for(const b in BIOM_AMT) if(!BIOME_MOBS[b]) fehler('BIOM_AMT kennt ein Biom, das es nicht gibt', b);
  for(const b in BIOME_MOBS) if(!BIOM_AMT[b]) fehler('Biom ohne amtlichen Namen', b);

  // (0b) BIOME_BANDS ist die einzige Quelle für Biomgrenzen (W-Groß): sie muss
  // [0, MH-1] lückenlos und überlappungsfrei kacheln, und exakt dieselben
  // Schlüssel wie BIOME_MOBS/BIOM_AMT tragen — sonst driftet die einzige echte
  // Karten-Wahrheit (BIOME_BANDS) unbemerkt von den textbasierten Tabellen weg.
  {
    const sorted = [...BIOME_BANDS].sort((a,b) => a.y0 - b.y0);
    if(sorted[0].y0 !== 0) fehler('BIOME_BANDS beginnt nicht bei y=0', sorted[0].key, sorted[0].y0);
    if(sorted[sorted.length-1].y1 !== MH-1) fehler('BIOME_BANDS endet nicht bei MH-1', sorted[sorted.length-1].key, sorted[sorted.length-1].y1);
    for(let i=1;i<sorted.length;i++) if(sorted[i].y0 !== sorted[i-1].y1+1) fehler('BIOME_BANDS hat Lücke oder Überlappung', sorted[i-1].key, sorted[i].key);
    for(const b of BIOME_BANDS){
      if(!BIOME_MOBS[b.key]) fehler('BIOME_BANDS kennt ein Biom, das BIOME_MOBS nicht hat', b.key);
      if(!BIOM_AMT[b.key])   fehler('BIOME_BANDS kennt ein Biom, das BIOM_AMT nicht hat', b.key);
    }
    for(const b in BIOME_MOBS) if(!BIOME_BANDS.find(z=>z.key===b)) fehler('BIOME_MOBS kennt ein Biom, das nicht auf der Karte liegt (BIOME_BANDS)', b);
  }

  for(const l of AUFTRAG_BEMERKUNGEN) text(l, 70, 'Bemerkung');

  // (1) Alle Aktstände durchwürfeln, viele Läufe je Stand.
  const echt = amt.schichten, gesehenGesamt = {};
  try {   // GW26i
  for(let sch = 0; sch <= 60; sch++){
    amt.schichten = sch;
    for(let n = 0; n < 40; n++){
      const liste = auftragWuerfeln();
      if(liste.length !== 3) fehler('Brett hat nicht drei Aushänge', sch, liste.length);
      const gesehen = {};
      for(const a of liste){
        const def = AUFTRAG_TYPEN[a.typ];
        if(!def){ fehler('Unbekannter Typ', a.typ); continue; }
        if(gesehen[a.typ]) fehler('Doppelter Typ auf einem Brett', a.typ, sch);
        gesehen[a.typ] = true; gesehenGesamt[a.typ] = true;
        if(a.lohn < 150 || a.lohn > 400) fehler('Lohn außerhalb 150..400', a.typ, a.lohn);
        if(!(a.ziel > 0))               fehler('Ziel nicht positiv', a.typ, a.ziel);
        if(!def.pruefePar(a))           fehler('Parameter nicht erreichbar', a.typ, a.par, a.ziel);
        if(a.bm < 0 || a.bm >= AUFTRAG_BEMERKUNGEN.length) fehler('Bemerkungs-Index', a.bm);
        if(a.typ === 'reise' && sch < 10) fehler('Reise schon in Akt I angeboten', sch);
        text(def.titel(a), 36, 'Titel');
        text(def.satz(a),  60, 'Satz');
      }
      if(liste[1].bm !== 2) fehler('Amtsleitungs-Bemerkung fehlt auf dem mittleren Aushang', sch);
    }
  }
  } finally { amt.schichten = echt; }
  for(const k in AUFTRAG_TYPEN) if(!gesehenGesamt[k]) fehler('Typ nie gewürfelt, toter Tabelleneintrag', k);

  console.assert(ok, 'W4: Aushang-Assertion fehlgeschlagen, siehe Konsole.');
  return ok;
}
auftragAssertBrett();

// ===========================================================================
//  W7: DIE LANGVORGÄNGE — Weltbibel Kapitel 10. Sieben Nebenstränge über
//  mehrere Schichten. Nummer 4 (Lisbeths sechster Praktikumsbericht) und
//  Nummer 8 (die Zustellung) hat W5 gebaut, die bleiben unangetastet.
//
//  Eine Tabelle statt sieben Einzellösungen: die Stränge sind inhaltlich
//  heterogen, der Beweisbedarf ist es nicht. Kein toter Strang, kein
//  Rücksprung, keine Blockade, kein Deckelbruch, inert bei schichtModus=false —
//  genau die Klasse Aussagen, die auftragAssertBrett() über neun ebenso
//  heterogene Auftragstypen führt, weil deren Tabelle eine einheitliche
//  Feldform hat. Sieben Einzellösungen ergäben sieben Guard-Zweige.
//
//  KEIN apply(). Jede Belohnung ist ein abgeleiteter Lesevorgang von
//  langFertig(key) an der Stelle, die sie betrifft — W5/W6-Doktrin wörtlich.
//  Damit ist jedes Neurendern von selbst idempotent, und es gibt genau EINE
//  Schreibstelle für W7-Zustand: langEreignis().
//
//  Kein neues amt-Feld, keine loadAmt()-Ladezeile. Der Fortschritt liegt in
//  kladde.lang (additiv geladen wie kladde.fl und kladde.vorgang), die Auslöser
//  sind aus amt.schichten bzw. amt.bonusManaRegen abgeleitet.
// ===========================================================================

// Ereignisarten, die langEreignis() kennt. Die ersten sieben sind die
// bestehenden W4-Trichterarten, die letzten DREI kommen mit W7 dazu:
//  ansprechen, jahresbonus, amtstube. 'schichtende' ist W4-Bestand und wird
//  aus auftragSchichtende() gefeuert, nicht neu.
const LANG_EREIGNISSE = ['kill','kammer','kessel','trank','zauber','ablage','zutat',
                         'ansprechen','schichtende','jahresbonus','amtstube',
                         // SZ3: der erste Ortsschritt des Spiels. Er kommt nicht aus
                         // auftragEreignis(), sondern aus der Kontextaktion an der
                         // brummenden Stelle — deshalb eine eigene Art und kein
                         // Zweckentfremden von 'ablage'.
                         'stopfenort'];

// Feldform je Strang:
//   figur   DORF_FIGUREN-Key oder 'knoeterich' — wer den Strang trägt
//   titel   Überschrift im Kladde-Reiter, freier Panel-Text, kein Deckel
//   stufen  Abschluss bei stufe(roh) === stufen
//   hoert   Ereignisarten, die diesen Strang überhaupt erreichen (Hot-Path-Filter)
//   wenn    Auslöser. false = der Strang liegt still, die Figur spricht wie immer
//   schritt (was, info, roh) => NEUER Rohwert, nie ein kleinerer
//   stufe   optional, Rohwert => Stufe. Default Identität (Bitmaske bei Nr. 6)
//   fortschritt  st => {z1,z2}, EINE Sprechblase beim Erreichen von st (1..stufen)
//   zusatz  optional, st => [{z1,z2}], zusätzliche Grundzeilen ab einer Stufe
//   bestand optional, st => Zeile im Kladde-Reiter, Panel-Text, kein Deckel
const LANGVORGAENGE = {};

// ---------------------------------------------------------------------------
//  Weltbibel Kapitel 10, Nummer 4: DER SECHSTE PRAKTIKUMSBERICHT.
//
//  Lisbeth braucht eine weisungsbefugte Unterschrift. Es gibt keine. Am Ende
//  unterschreibt Nörgel, weil er im Dienst ist. Belohnung ist kein Bonus,
//  sondern ein PRÄZEDENZFALL: dass in diesem Haus schon einmal wirksam
//  gezeichnet hat, wer nur deshalb im Dienst ist, weil ihn niemand entlassen
//  hat. Akt V braucht diesen Fall, weil Sturz dort mit derselben Begründung
//  gegenzeichnet.
//
//  DIE EINE AUSNAHME UND WIE SIE GEBAUT IST. Kapitel 10 sagt zwei Dinge, die
//  sich zu widersprechen scheinen: kein Langvorgang darf für den Hauptvorgang
//  notwendig sein, ausser Nummer 4, und die läuft nebenbei mit. Beides gilt,
//  weil "notwendig" hier erzählerisch gemeint ist und nicht mechanisch: der
//  Strang ist an keiner Stelle Bedingung. vorgangZustellbar() liest ihn nicht,
//  das Finale wird nie verweigert, und langAssert() Punkt (4) beweist das
//  weiterhin positiv. Was er ändert, ist das VIERTE Puzzleteil des Finales:
//  mit Präzedenzfall ist Sturz' Satz ein Rückgriff, ohne ihn ein Zufall. Die
//  Bauform dafür stand schon da, VORGANG_PUZZLE kennt frei/text/sonst seit W5.
//
//  Und "nebenbei" ist wörtlich gebaut: acht Beats an fünf Figuren, die im Dorf
//  ohnehin stehen und ohnehin angesprochen werden. Kein Umweg, kein Ort, kein
//  Gegenstand, keine Taste. Wer nie mit Lisbeth redet, verpasst ihn, und das
//  Spiel läuft trotzdem bis zum Ende durch.
//
//  Warum der Strang GANZ VORN in der Tabelle steht: langAnsprechen() geht sie
//  in Einfügereihenfolge durch und liefert den ersten Strang, der vorrückt.
//  Zwirn trägt sonst elf Dorffest-Anläufe vor diesem hier, Bramsche drei Beats
//  von Anlage 3. Das wäre dieselbe Schlange, die bei Zapf schon vermerkt ist,
//  nur an dem einen Strang, den das Haus für Akt V braucht. Er kostet die
//  beiden je genau einen Tastendruck, einmal im Spiel.
//
//  Knöterich fehlt in der Kette, obwohl das a. D. hinter seinem Titel die
//  ganze Begründung wäre. Zwei Gründe, und beide sind der Grund: er erklärt
//  Tasten und keine Zusammenhänge, und er erreicht npcCycle() gar nicht, wo
//  langAnsprechen() sitzt (seine Tafel ist U6, nicht W3). Lisbeth berichtet
//  deshalb, was er getan hat: er hat auf sein Schild gezeigt und nichts gesagt.
//  Das ist er genauer als jede Zeile, die er selbst sprechen könnte.
// ---------------------------------------------------------------------------
const BERICHT_BEATS = [
  {z1:'Der sechste Bericht ist fertig.',          z2:'Es fehlt nur eine Unterschrift.'},
  {z1:'Unterschreiben? Da bin ich sofort dran.',  z2:'Ich bin nicht Ihr Vorgesetzter.'},
  {z1:'Weisungsbefugt ist, wer im Dienst steht.', z2:'Nicht ich. Fragen Sie Oben.'},
  {z1:'Eine Unterschrift für die Praktikantin.',  z2:'Das prüfen wir gern.'},
  {z1:'Der Amtsrat hat auf sein Schild gezeigt.', z2:'a. D. Und sonst nichts.'},
  {z1:'Wer im Dienst steht, ist befugt.',         z2:'Wer steht hier im Dienst?'},
  {z1:'Auf Probe ist im Dienst. So steht es da.', z2:'Ich zeichne. Beschwerde folgt.'},
  {z1:'Gezeichnet. Von einer Grünhaut.',          z2:'Wirksam. Ich habe nachgesehen.'},
];
// Wer an welcher Stufe dran ist. Tabelle statt Kaskade, aus demselben Grund wie
// bei ANLAGE3_DRAN: über der letzten Stufe liefert sie undefined, und damit ist
// schritt() auf dem Endzustand von selbst idempotent.
// Zweimal Lisbeth hintereinander (Stufe 4 und 5) ist Absicht und kein Fehler:
// langAnsprechen() rückt je Tastendruck genau einen Schritt vor, das sind also
// zwei Sprechblasen bei ihr. Die erste bringt den Befund, die zweite die Frage,
// die der Spieler beantworten muss, und zwar durch Hingehen und nicht durch
// eine Antwortzeile.
const BERICHT_DRAN = ['lisbeth', 'zwirn', 'bramsche', 'vorblatt', 'lisbeth', 'lisbeth', 'noergel', 'lisbeth'];
// Was danach bei Lisbeth stehen bleibt. Keine Mechanik, kein Gold, keine
// Erfahrung: die Belohnung dieses Strangs ist der Fall und nicht die Zahl. Dass
// der siebte Bericht trotzdem anfängt, ist die Pointe und nicht ein Versehen.
const BERICHT_NACH = [
  {z1:'Der sechste Bericht ist abgeschlossen.', z2:'Der siebte fängt trotzdem an.'},
  {z1:'Ein Sachbearbeiter durfte zeichnen.',    z2:'Das steht jetzt in einer Akte.'},
];

LANGVORGAENGE.bericht = {
  figur:'lisbeth', titel:'Der sechste Praktikumsbericht', stufen:BERICHT_BEATS.length,
  hoert:['ansprechen'],
  // Akt I gehört Knöterichs Onboarding, wie bei anlage3 und AUFTRAG_TYPEN.reise.
  // Die Kette hält an Stufe 3 von selbst an, bis Oben da ist, und "da" heisst
  // seit SZ3 nicht mehr "ein Akt ist angebrochen", sondern "Vorblatt ist
  // angekommen" (Szene 6, DORF_FIGUREN.daWenn). Das ist weiterhin Pacing und
  // keine Blockade, nur ein knapperes: er kommt frueherstens zwei Schichten nach
  // dem Stopfen und spaetestens zwei Schichten nach der vierten Adresszeile,
  // beides in Akt IV, und bis Akt V (Schicht 41) bleiben danach rund acht
  // Schichten statt der zwanzig von vorher. Wer den Stopfen zieht, kauft sich
  // hier also nebenbei Luft fuer Lisbeths Unterschrift.
  wenn: () => aktStand() >= 2,
  schritt(was, info, roh){
    if(was !== 'ansprechen' || !info) return roh;
    if(info.key !== BERICHT_DRAN[roh]) return roh;
    // Die erste Kette, die über eine Figur mit abAkt läuft. Im Spiel wäre die
    // Frage keine: npcCycle() wird für eine Figur ohne Kachel nie gerufen, und
    // Vorblatt hat vor Akt III keine. Der Strang verlässt sich trotzdem nicht
    // darauf, dass die Reihenfolge von aussen eingehalten wird, denn genau das
    // hat der erste Prüflauf gefunden: über langAnsprechen('vorblatt') lief die
    // Kette in Akt II glatt bis zum Ende durch. figDa() ist dieselbe Prüfung,
    // die DORF_FIGUREN.abAkt ohnehin trägt, also kein zweiter Wert und keine
    // zweite Schwelle.
    return figDa(DORF_FIGUREN.find(f => f.key === info.key)) ? roh + 1 : roh;
  },
  fortschritt: st => BERICHT_BEATS[st - 1],
  zusatz: st => st >= BERICHT_BEATS.length ? BERICHT_NACH : [],
  bestand: st => st >= BERICHT_BEATS.length
    ? 'Der sechste Praktikumsbericht: gezeichnet. Der Fall ist aktenkundig.'
    : 'Der sechste Praktikumsbericht: es fehlt eine Unterschrift. ' + st + ' von ' + BERICHT_BEATS.length + '.',
};

// SZ3-Befund: dieser Strang steht als ZWEITER in der Tabelle, direkt hinter
// bericht, und das ist kein Geschmack. langAnsprechen() geht die Tabelle in
// Einfuegereihenfolge durch und liefert den ersten Strang, der vorrueckt — Zapf
// traegt aber drei (Giesskanne, Anlage 3, Stopfen). Stand der Stopfen hinten,
// verschluckte die Giesskanne seinen einen Satz, und der Prueflauf bekam
// "Giessen ist nicht mein Ressort." statt "Ich hole das Werkzeug." Genau die
// Schlange, die der Kommentar bei bericht schon vermerkt hat.
//
// Er kostet die beiden anderen dabei fast nichts: sein Ansprechschritt feuert
// nur bei roh === 2, also in dem einen Moment, in dem die Roehre freiliegt und
// noch niemand das Werkzeug geholt hat. Ein einziger Tastendruck, einmal im
// Spiel.
// ---------------------------------------------------------------------------
//  Weltgeschichte Kapitel 10, Nummer 10: DER STOPFEN.  (SZ3)
//
//  Vier Schritte, und drei davon sind Ortsschritte statt Ansprechschritte —
//  der einzige Strang im Spiel, der jemanden irgendwohin schickt. Das ist
//  begruendet: die Roehre liegt unter dem Steinfeld, und ein Ort, den man nur
//  bespricht, ist keiner.
//
//    1  nachgesehen   an der brummenden Stelle, blosse Neugier
//    2  freigelegt    dieselbe Stelle, zweiter Griff. Jetzt liegt die Roehre da
//    3  Zapf geholt   im Dorf, er holt das Werkzeug (seine W11-Zeile, woertlich)
//    4  gezogen       zurueck an der Roehre, und dann laeuft Szene 5
//
//  Der Preis steht in der Weltgeschichte und ist der Grund, warum dieser Strang
//  als einziger etwas KOSTET: "Wer den Stopfen zieht, holt sich damit den
//  Gegenspieler ins Dorf, und das ist keine Strafe, sondern die ehrlichste
//  Ursachenkette des Spiels." Vorblatt liest den Dienstbericht, weil die Post
//  wieder laeuft, und dann laesst er anspannen. Ohne Stopfen kommt er trotzdem,
//  nur spaeter und ueber Kordula Umlauf.
//
//  Die W7-Doktrin bleibt unangetastet: der Strang blockiert nichts, ist fuer
//  den Hauptvorgang nirgends Bedingung, belegt keine Kachel des Dorfes und
//  keine Kontextaktion, die es vorher schon gab. Wer nie ins Steinfeld geht,
//  spielt das Spiel unveraendert zu Ende.
// ---------------------------------------------------------------------------
const STOPFEN_BEATS = [
  {z1:'Der Boden brummt hier wirklich.',    z2:'Darunter liegt etwas Hohles.'},
  {z1:'Eine Röhre. Gebrannter Ton, armdick.', z2:'Sie ist voll. Sie geht nicht.'},
  {z1:'Im Steinfeld brummt der Boden.',     z2:'Ich hole das Werkzeug.'},
  {z1:'Ein Rohr. Verstopft. Sehr alt.',     z2:'Kriegen wir auf.'},
];

LANGVORGAENGE.stopfen = {
  figur:'zapf', titel:'Der Stopfen', stufen:STOPFEN_BEATS.length,
  hoert:['ansprechen','stopfenort'],
  // Akt IV, wie die Weltgeschichte es setzt, und die Stelle muss auf dieser
  // Karte ueberhaupt liegen. Ohne Ruinenband gibt es sie nicht (setzeStopfen()),
  // und ein Strang ohne Ort waere unerfuellbar statt optional.
  wenn: () => aktStand() >= 4 && STOPFEN.da,
  schritt(was, info, roh){
    // Die beiden Ortsschritte. Sie kommen von der Kontextaktion an der Stelle
    // und von nirgends sonst.
    if(was === 'stopfenort' && (roh === 0 || roh === 1)) return roh + 1;
    // Zapf holen. Erst wenn die Roehre freiliegt: vorher haette er nichts, wozu
    // er sein Werkzeug holen koennte, und seine Zeile waere eine Behauptung.
    if(was === 'ansprechen' && info && info.key === 'zapf' && roh === 2) return 3;
    // Der vierte Schritt gehoert der Szene und wird von szeneEnde() gesetzt,
    // nicht von hier: die Kapsel ist erst draussen, wenn sie draussen ist.
    if(was === 'stopfenort' && roh === 3 && info && info.gezogen) return 4;
    return roh;
  },
  fortschritt: st => STOPFEN_BEATS[st - 1],
  bestand: st => st >= STOPFEN_BEATS.length
    ? 'Der Stopfen: gezogen. Die Rohrpost läuft seit siebenhunderteinundvierzig Jahren zum ersten Mal.'
    : 'Der Stopfen: ' + st + ' von ' + STOPFEN_BEATS.length + ' Schritten. Im Steinfeld brummt der Boden.',
};

// Weltbibel Kapitel 10, Nummer 3. Läuft über das ganze Spiel: elf Anläufe, elf
// Absagen, jede aus einem anderen Grund. Ein Anlauf je Schicht. Zahlt sich erst
// im Abspann aus, deshalb kein Bonus und kein Zusatzzeilen-Feld.
const DORFFEST_ABSAGEN = [
  {z1:'Der Antrag ist raus. Endlich!',           z2:'Zurück. Falsches Formular.'},
  {z1:'Neues Formular, neuer Anlauf.',           z2:'Zurück. Falsche Farbe.'},
  {z1:'Diesmal in Blau. Das war es.',            z2:'Zurück. Kein Aktenzeichen.'},
  {z1:'Bramsche gab mir ein Aktenzeichen.',      z2:'Zurück. Zeichen abgelaufen.'},
  {z1:'Frisches Zeichen, gleiche Sache.',        z2:'Zurück. Falsche Stelle.'},
  {z1:'Jetzt an die richtige Stelle.',           z2:'Zurück. Stelle unbesetzt.'},
  {z1:'Die Vertretung nimmt es an.',             z2:'Zurück. Vertretung im Urlaub.'},
  {z1:'Nach dem Urlaub, sagte man mir.',         z2:'Zurück. Frist verstrichen.'},
  {z1:'Fristverlängerung beantragt.',            z2:'Zurück. Braucht Genehmigung.'},
  {z1:'Die Genehmigung braucht Genehmigung.',    z2:'Zurück. Zuständigkeit unklar.'},
  {z1:'Elf Anläufe. Ich lege es zu den Akten.',  z2:'Aber ich gebe nicht auf.'},
];

LANGVORGAENGE.dorffest = {
  figur:'zwirn', titel:'Das Dorffest', stufen:DORFFEST_ABSAGEN.length,
  hoert:['ansprechen'],
  wenn: () => true,
  // Ein Anlauf je Schicht. Ein Neuladen mitten in der Schicht erlaubt einen
  // zweiten — bewusst hingenommen: der Strang trägt keine mechanische
  // Belohnung, und dieselbe Toleranz gilt seit W3 für bramscheFragen.
  schritt(was, info, roh){
    if(was !== 'ansprechen' || !info || info.key !== 'zwirn' || langSchicht.dorffest) return roh;
    langSchicht.dorffest = true;
    return roh + 1;
  },
  fortschritt: st => DORFFEST_ABSAGEN[st - 1],
  bestand: st => st >= DORFFEST_ABSAGEN.length
    ? 'Das Dorffest: elf Anläufe, elf Absagen. Zu den Akten genommen.'
    : 'Das Dorffest: ' + st + ' von ' + DORFFEST_ABSAGEN.length + ' Anläufen aktenkundig.',
};

// Weltbibel Kapitel 10, Nummer 6. Vierzig Jahre Probe. Man sammelt seine eigenen
// Dienstberichte und legt sie ihm vor. Der Sammelgegenstand existiert bereits:
// DIENST_BEMERKUNGEN sind laut Kapitel 8 von Nörgel, eine davon steht in jedem
// Dienstbericht. Der Rohwert trägt beides in einer Zahl — untere sechs Bits das
// gesammelte Set, Bits 8 bis 11 die Zahl der vorgelegten. Ein zweites Feld wäre
// eine zweite Wahrheitsquelle für denselben Fortschritt.
const langPopcount = n => { let c = 0, v = n | 0; while(v){ v &= v - 1; c++; } return c; };

const PROBEZEIT_BEATS = [
  {z1:'Ein Dienstbericht. Meiner.',        z2:'Den hat nie jemand gelesen.'},
  {z1:'Der zweite. Auch von mir.',         z2:'Sammeln Sie die etwa?'},
  {z1:'Drei Stück. Das ist ein Vorgang.',  z2:'Kein guter, aber einer.'},
  {z1:'Vier. Langsam wird es eine Akte.',  z2:'Akten sind nicht mein Ressort.'},
  {z1:'Fünf. Sie meinen das ernst.',       z2:'Das macht sonst niemand.'},
  {z1:'Sechs. Vollständig. Alle von mir.', z2:'Vierzig Jahre auf sechs Zetteln.'},
  {z1:'Sie legen es der Amtsleitung vor.', z2:'Es gibt sie nicht. Danke.'},
];
// Die Belohnung: er redet. Zweite Hinweisquelle, und zwar die ehrlichere.
// Ausdrücklich KEIN zweites Frage-und-Antwort-System — er braucht keinen
// Antrag, das ist der Unterschied zu Bramsche und der ganze Witz. Die Zeilen
// laufen als zusätzliche Grundzeilen durch den bestehenden Zyklus.
const PROBEZEIT_HINWEISE = [
  {z1:'Kammertüren geben mehr her als der Sack.', z2:'Steht in keiner Anweisung.'},
  {z1:'Ablage V öffnet sich nur mit Ausfertigung.', z2:'Das sagt Ihnen sonst keiner.'},
  {z1:'Bramsche antwortet, wenn man fragt.',      z2:'Genau einmal je Schicht.'},
  {z1:'Das Brett hängt jede Schicht neu.',        z2:'Lesen Sie es vor dem Rausgehen.'},
  {z1:'Überstunden zählt niemand außer mir.',     z2:'Ich vermerke sie trotzdem.'},
];

LANGVORGAENGE.probezeit = {
  figur:'noergel', titel:'Nörgels Probezeit', stufen:PROBEZEIT_BEATS.length,
  hoert:['schichtende','ansprechen'],
  wenn: () => true,
  stufe: roh => (roh >> 8) & 15,   // die vorgelegten, nicht die gesammelten
  schritt(was, info, roh){
    if(was === 'schichtende' && info) return roh | (1 << info.bm);
    if(was === 'ansprechen' && info && info.key === 'noergel'){
      const gesammelt = langPopcount(roh & 63), vorgelegt = (roh >> 8) & 15;
      if(vorgelegt < gesammelt) return (roh & 255) | ((vorgelegt + 1) << 8);
      if(gesammelt === 6 && vorgelegt === 6) return (roh & 255) | (7 << 8);
    }
    return roh;
  },
  fortschritt: st => PROBEZEIT_BEATS[st - 1],
  zusatz: st => st >= PROBEZEIT_BEATS.length ? PROBEZEIT_HINWEISE : [],
  bestand(st){
    const g = langPopcount(langRoh('probezeit') & 63);
    return st >= PROBEZEIT_BEATS.length
      ? 'Nörgels Probezeit: sechs Dienstberichte vorgelegt. Er redet seither.'
      : 'Nörgels Probezeit: ' + g + ' von 6 Bemerkungen gesammelt, ' + Math.min(st, g) + ' vorgelegt.';
  },
};

// Weltbibel Kapitel 10, Nummer 2. Der Kater liegt auf der Akte. Man kann ihn
// nicht wegnehmen, man muss ihm etwas Besseres anbieten. Zapf liefert die
// Lösung, weil das seine Zuständigkeit ist: der Ofen zieht nicht.
// Belohnung: Registratur-Zugang, eine zusätzliche Frage pro Schicht.
const ANLAGE3_BEATS = [
  {z1:'Anlage Drei liegt auf dem Brandabschnitt.', z2:'Wecken kommt nicht in Frage.'},
  {z1:'Der Ofen zieht nicht. Ich mach das.',       z2:'Warm liegt besser als Papier.'},
  {z1:'Der Ofen zieht. Anlage Drei liegt davor.',  z2:'Die Akte ist wieder greifbar.'},
];
const ANLAGE3_DRAN = ['bramsche', 'zapf', 'bramsche'];

LANGVORGAENGE.anlage3 = {
  figur:'bramsche', titel:'Anlage 3', stufen:ANLAGE3_BEATS.length,
  hoert:['ansprechen'],
  wenn: () => aktStand() >= 2,   // Akt I gehört Knöterichs Onboarding, wie AUFTRAG_TYPEN.reise
  // Kette Bramsche, Zapf, Bramsche. Kein Merker für "wer war dran": die Stufe
  // ist der Merker, und wer nicht dran ist, rückt nicht vor. Als Tabelle statt
  // als Kaskade, damit ANLAGE3_DRAN[stufen] undefined ist und schritt() auf dem
  // Endzustand von selbst idempotent wird.
  schritt(was, info, roh){
    if(was !== 'ansprechen' || !info) return roh;
    return info.key === ANLAGE3_DRAN[roh] ? roh + 1 : roh;
  },
  fortschritt: st => ANLAGE3_BEATS[st - 1],
  bestand: st => st >= ANLAGE3_BEATS.length
    ? 'Anlage 3: liegt vor dem Ofen. Registratur-Zugang erweitert.'
    : 'Anlage 3: liegt auf der Akte. ' + st + ' von ' + ANLAGE3_BEATS.length + ' aktenkundig.',
};

// Weltbibel Kapitel 10, Nummer 1. Die Pflanze auf dem leeren Schreibtisch geht
// ein. Man muss herausfinden, was sie braucht, ohne dass Knöterich es sagt.
// Zapf berichtet (das ist seine Sprachmarke), Pommer liefert die Lösung — seine
// Grundzeile "Auf dem Antrag steht Eimer. Nicht Kanne." steht seit W3 im Spiel
// und war die ganze Zeit die Antwort. Belohnung: KEIN Bonus, absichtlich. Er
// redet danach eine Spur wärmer, mehr nicht.
//
// Bewusst nicht gebaut: kein Pflanzen-Sprite, kein Weltobjekt, kein
// Krankheitszustand für Knöterich. Die Pflanze existiert als Text im
// Amtsstuben-Panel, dort steht der leere Schreibtisch ohnehin schon.
const GIESSKANNE_BEATS = [
  {z1:'Die Pflanze auf dem leeren Tisch hängt.',   z2:'Gießen ist nicht mein Ressort.'},
  {z1:'Kanne steht nicht im Bestand. Eimer schon.', z2:'Nehmen Sie den Eimer mit.'},
  {z1:'Die Pflanze steht wieder gerade.',          z2:'Niemand hat es angeordnet.'},
];

LANGVORGAENGE.giesskanne = {
  figur:'knoeterich', titel:'Die Gießkanne', stufen:GIESSKANNE_BEATS.length,
  hoert:['ansprechen','amtstube'],
  wenn: () => aktStand() >= 2,
  schritt(was, info, roh){
    if(was === 'ansprechen' && info){
      if(roh === 0 && info.key === 'zapf')   return 1;
      if(roh === 1 && info.key === 'pommer') return 2;
    }
    if(was === 'amtstube' && roh === 2) return 3;
    return roh;
  },
  fortschritt: st => GIESSKANNE_BEATS[st - 1],
  bestand: st => st >= GIESSKANNE_BEATS.length
    ? 'Die Gießkanne: erledigt. Kein Vermerk, keine Zuständigkeit, kein Bonus.'
    : 'Die Gießkanne: die Pflanze auf dem leeren Schreibtisch hängt. ' + st + ' von ' + GIESSKANNE_BEATS.length + '.',
};

// Der Abschluss passiert im Amtsstuben-Panel, nicht an einer Figur — deshalb
// braucht er eine eigene Anzeige. Panel-Text, kein Zeichendeckel. Ein <span>
// statt <button>, weil #amtFenster button{width:100%} den Fluss sprengen würde
// (dieselbe Begründung wie beim W4-Rückgabelink).
function langGiesskanneBlock(){
  if(!CONFIG.schichtModus) return '';
  const d = LANGVORGAENGE.giesskanne;
  if(!d.wenn()) return '';
  const st = langStufe('giesskanne');
  if(st >= d.stufen){
    const f = d.fortschritt(d.stufen);
    return `<p style="font-size:calc(11px * var(--fs));color:#8fdc8f;margin:8px 0 0;">${f.z1} ${f.z2}</p>`;
  }
  if(st < 2) return `<p style="font-size:calc(11px * var(--fs));color:#9a8a5f;margin:8px 0 0;">Auf dem leeren Schreibtisch steht eine Pflanze. Sie hängt.</p>`;
  return `<p style="font-size:calc(11px * var(--fs));color:#c9b98a;margin:8px 0 0;">Der Eimer steht bereit. Die Pflanze hängt weiter.</p>
    <span onclick="langGiessen()" style="cursor:pointer;color:#f4d97a;font-size:calc(11px * var(--fs));">▸ Die Pflanze gießen</span>`;
}
function langGiessen(){ langEreignis('amtstube', null); renderAmtFenster(); }

// Weltbibel Kapitel 10, Nummer 5. Die Maschine im Amt ist das Schwestergerät
// des Kessels. Sie ist beleidigt. Auslöser ist der bestehende Jahresbonus
// "Kaffeemaschine" — abgeleitet aus amt.bonusManaRegen, dessen einziger
// Schreiber JAHRES_BONI[0].apply() ist. Kein neues Feld.
// Belohnung: keine Mechanik. Der Bonus bekommt seine Geschichte.
//
// Rohwert wie bei Nörgel zweigeteilt: untere Bits, wie weit die Ereignisse
// freigeschaltet haben, obere, wie viel Zapf davon schon erzählt hat. Ohne die
// Teilung wären die Beats, die an einem Ereignis statt an einem Tastendruck
// hängen, im Spiel nie zu sehen.
const KAFFEE_BEATS = [
  {z1:'Die Kaffeemaschine im Amt ist beleidigt.',   z2:'Seit die Prämie kam. Ehrlich.'},
  {z1:'Sie ist das Schwestergerät vom Kessel.',     z2:'Baugleich. Andere Laufbahn.'},
  {z1:'Sie hat gemerkt, dass Sie am Kessel waren.', z2:'Tropft jetzt langsamer. Absicht.'},
  {z1:'Ich hab ihr gut zugeredet. Läuft wieder.',   z2:'Zwei Geräte, eine Zuständigkeit.'},
];
const KAFFEE_GRENZE = [0, 2, 4];   // wie viele Beats je Freischaltstufe erzählbar sind

LANGVORGAENGE.kaffeemaschine = {
  figur:'zapf', titel:'Die Kaffeemaschine', stufen:KAFFEE_BEATS.length,
  hoert:['ansprechen','kessel','jahresbonus'],
  wenn: () => (amt.bonusManaRegen || 0) > 0,
  stufe: roh => (roh >> 8) & 15,
  schritt(was, info, roh){
    const frei = roh & 15, gez = (roh >> 8) & 15;
    if(was === 'jahresbonus' && frei === 0) return 1 | (gez << 8);
    if(was === 'kessel' && frei === 1 && gez >= 2) return 2 | (gez << 8);
    if(was === 'ansprechen' && info && info.key === 'zapf' && gez < KAFFEE_GRENZE[frei])
      return frei | ((gez + 1) << 8);
    return roh;
  },
  fortschritt: st => KAFFEE_BEATS[st - 1],
  bestand: st => st >= KAFFEE_BEATS.length
    ? 'Die Kaffeemaschine: läuft wieder. Zwei Geräte, eine Zuständigkeit.'
    : 'Die Kaffeemaschine: beleidigt. ' + st + ' von ' + KAFFEE_BEATS.length + ' aktenkundig.',
};

// Weltbibel Kapitel 10, Nummer 9. Wo ist das zweite Dorf hin? Antwort: es wurde
// abgeschlossen. Vollständig. Ordnungsgemäß. Kein Bonus, keine Freischaltung,
// kein Panel — zwei Herren auf einer Bank sagen vier Sätze. Braucht die
// letzterAnlass-Korrektur aus der Anrede-Phase, sonst erreicht keine Taste den
// Zyklus der beiden.
const HINTERMUEHL_BEATS = [
  {z1:'Hintermühl war das zweite Dorf.',          z2:'Pahl, wie hieß der Wirt dort?'},
  {z1:'Der Wirt hieß wie das Gasthaus.',          z2:'Beides steht nicht mehr.'},
  {z1:'Man hat Hintermühl abgeschlossen.',        z2:'Vollständig. Ordnungsgemäß.'},
  {z1:'Es fehlte nichts. Das ist das Schlimme.',  z2:'Wir sitzen seitdem hier.'},
];
const HINTERMUEHL_DRAN = ['lott', 'pahl', 'lott', 'pahl'];

LANGVORGAENGE.hintermuehl = {
  figur:'lott', titel:'Hintermühl', stufen:HINTERMUEHL_BEATS.length,
  hoert:['ansprechen'],
  wenn: () => aktStand() >= 3,
  schritt(was, info, roh){
    if(was !== 'ansprechen' || !info) return roh;
    return info.key === HINTERMUEHL_DRAN[roh] ? roh + 1 : roh;
  },
  fortschritt: st => HINTERMUEHL_BEATS[st - 1],
  bestand: st => st >= HINTERMUEHL_BEATS.length
    ? 'Hintermühl: abgeschlossen. Vollständig. Ordnungsgemäß. Kein Vermerk nötig.'
    : 'Hintermühl: das zweite Dorf. ' + st + ' von ' + HINTERMUEHL_BEATS.length + ' aktenkundig.',
};

// Weltbibel Kapitel 10, Nummer 7. Man weist Milb nach, dass er systematisch eine
// Stufe danebenliegt. Erfordert Buchführung über mehrere Schichten. Der
// Vergleichswert existiert längst: das Kammerschild zeigt t.diff, und
// betreteKammer() wirft die echte Schwierigkeit beim Betreten als Floater.
// Belohnung: die Schilder zeigen danach den echten Wert.
// Rohwert zweigeteilt wie bei Nörgel und der Kaffeemaschine.
const GUTACHTER_BEATS = [
  {z1:'Ich stufe ein. Andere raten nur.',       z2:'Wollen Sie es nachprüfen?'},
  {z1:'Eine Kammer nachgerechnet.',             z2:'Das Schild war zu niedrig.'},
  {z1:'Zwei Kammern. Beide gleich daneben.',    z2:'Immer um genau eine Stufe.'},
  {z1:'Drei Kammern. Das ist ein Muster.',      z2:'Kein Zufall mehr. Buchführung.'},
  {z1:'Sie haben recht. Ich lag eine zu tief.', z2:'Das kommt in die Schilder.'},
];
const GUTACHTER_GRENZE = [1, 2, 3, 5];   // je nachgerechneter Kammer erzählbare Beats

LANGVORGAENGE.gutachter = {
  figur:'milb', titel:'Der falsche Gutachter', stufen:GUTACHTER_BEATS.length,
  hoert:['ansprechen','kammer'],
  wenn: () => aktStand() >= 2,
  stufe: roh => (roh >> 8) & 15,
  schritt(was, info, roh){
    const kam = roh & 15, gez = (roh >> 8) & 15;
    // Höchstens eine Kammer je Schicht, sonst wäre die Buchführung in einer
    // einzigen Schicht erledigt und "über mehrere Schichten" eine Behauptung.
    // GW26f: langSchicht ist Laufzeitzustand und ueberlebt keinen Reload,
    // während kladde.lang persistiert, ein Neuladen mitten in der Schicht gibt
    // also einen zweiten Kammer-Slot. Bewusst hingenommen, gedeckelt durch
    // kam < 3. Gleiche Toleranz wie beim Nachbarstrang dorffest, die dort schon
    // vermerkt war und hier fehlte.
    if(was === 'kammer' && gez >= 1 && kam < 3 && !langSchicht.gutachter){
      langSchicht.gutachter = true;
      return (kam + 1) | (gez << 8);
    }
    if(was === 'ansprechen' && info && info.key === 'milb' && gez < GUTACHTER_GRENZE[kam])
      return kam | ((gez + 1) << 8);
    return roh;
  },
  fortschritt: st => GUTACHTER_BEATS[st - 1],
  bestand(st){
    const kam = langRoh('gutachter') & 15;
    return st >= GUTACHTER_BEATS.length
      ? 'Der falsche Gutachter: nachgewiesen. Die Kammerschilder nennen seither den echten Aufwand.'
      : 'Der falsche Gutachter: ' + kam + ' von 3 Kammern nachgerechnet, ' + st + ' von ' + GUTACHTER_BEATS.length + ' besprochen.';
  },
};


// Was das Kammerschild anzeigt. Milb liegt immer NACH UNTEN daneben: jede Kammer
// liefert mehr als angekündigt, ein W4-Aushang "ab Aufwand N" wird dadurch nie
// schwerer. t.diff und t.tier selbst bleiben unangetastet — Beute, die
// Kammergarantie und AUFTRAG_TYPEN.kammer lesen weiter den echten Wert.
// Der schichtModus-Zweig ist Pflicht: dort ist der Strang nie abschließbar, das
// Schild bliebe sonst für immer falsch.
const langKammerWert = t => (!CONFIG.schichtModus || langFertig('gutachter')) ? t.diff : Math.max(1, t.diff - 1);

const langRoh    = k => kladde.lang[k] | 0;
const langStufe  = k => { const d = LANGVORGAENGE[k]; return d.stufe ? d.stufe(langRoh(k)) : langRoh(k); };
// GW6: Inertheit ist Ladeseite, nicht nur Schreibseite. langEreignis() schreibt
// bei schichtModus=false nichts, aber loadKladde() lädt kladde.lang unbedingt —
// ein Spielstand aus dem Schichtmodus liess deshalb Abspann-Absatz, Nörgels
// Zusatzzeilen und die Gießkannen-Wärme auch im alten Modus erscheinen.
const langFertig = k => CONFIG.schichtModus && langStufe(k) >= LANGVORGAENGE[k].stufen;
const langLaeuft = k => CONFIG.schichtModus && LANGVORGAENGE[k].wenn() && !langFertig(k);

// SP1: Heilung für die Bestände, die der Fund schon getroffen hat. Wer den
// Stopfen gezogen oder die vierte Adresszeile gefunden hat, bevor die Ladezeilen
// in loadAmt() existierten, trägt die Tat in der Kladde (die hat sich immer
// selbst gespeichert) und den Stempel auf 0 — für den wäre Vorblatt sonst auf
// ewig unterwegs. Die Kladde ist hier die Wahrheitsquelle, der Stempel wird aus
// ihr nachgezogen: nicht auf die Schicht von damals (die weiß niemand mehr,
// genau das sagt der Kommentar am Feld), sondern auf die nächste. Der Wagen
// kommt dadurch später als erzählt, aber er kommt.
//
// Steht hier unten und nicht bei der Aushang-Migration, weil sie langFertig()
// liest und das eine Zeile weiter oben deklariert ist. Genau andersherum lief
// der erste Prüflauf dieses Abschnitts in einen ReferenceError beim Laden.
//
// Läuft genau einmal je Bestand: danach ist der Stempel gesetzt, die Bedingung
// greift nie wieder. Das saveAmt() steht hinter der Bedingung und ist deshalb
// nicht der Schreibvorgang-bei-jedem-Seitenaufruf, den GW26b vermeidet.
//
// Nebenwirkung, benannt statt verschwiegen: postregenLaeuft() hängt am selben
// Stempel, im Dorf fallen also drei Schichten lang noch einmal Blätter. Das ist
// der Preis dafür, dass der Strang überhaupt wieder ankommt.
(function stempelMigration(){
  let nachgezogen = false;
  if(!amt.stopfenSchicht && langFertig('stopfen')){ amt.stopfenSchicht = amt.schichten + 1; nachgezogen = true; }
  if(!amt.adressSchicht && vorgangHat(4)){ amt.adressSchicht = amt.schichten + 1; nachgezogen = true; }
  if(nachgezogen) saveAmt();
})();

// Der Trichter. Hängt an auftragEreignis(), deckt damit alle acht bestehenden
// Fundstellen mit einer Zeile ab. Bewusst kein CFX.schweigen-Guard, gleiche
// Begründung wie bei findeBlatt()/findeAdresszeile(): Langvorgänge sind
// Geschichte am Fundort, keine Kesselbeobachtung.
function langEreignis(was, info){
  if(!CONFIG.schichtModus) return;   // Inertheit, Muster serieFrei()
  let dirty = false;
  for(const k in LANGVORGAENGE){
    const d = LANGVORGAENGE[k];
    if(info && info.nur && info.nur !== k) continue;   // gezielter Schritt, s. langAnsprechen()
    if(d.hoert.indexOf(was) < 0) continue;   // Hot Path: killMon() läuft hier durch
    if(!d.wenn()) continue;
    const roh = langRoh(k), alt = d.stufe ? d.stufe(roh) : roh;
    if(alt >= d.stufen) continue;
    const neu = d.schritt(was, info, roh);
    if(neu === roh) continue;
    if((d.stufe ? d.stufe(neu) : neu) < alt) continue;   // Monotonie, nie ein Rücksprung
    kladde.lang[k] = neu; dirty = true;
  }
  if(dirty) saveKladde();
}

// Rückt GENAU EINEN Strang vor und liefert dessen Fortschrittszeile. null =
// nichts zu melden, der Zyklus läuft wie bisher. Blockiert nie: eine Figur,
// deren Stränge stillstehen, verhält sich Byte für Byte wie vor W7.
//
// Nicht nach d.figur gefiltert: eine Kette darf über mehrere Figuren laufen
// (Anlage 3 geht über Zapf, die Gießkanne über Zapf und Pommer). Wer an einer
// Stufe dran ist, entscheidet allein das schritt() des Strangs über info.key.
// d.figur sagt nur, wem der Strang gehört — für zusatz() und den Kladde-Reiter.
//
// Der gezielte Schritt über info.nur ist nötig, weil Zapf drei Stränge berührt:
// ohne ihn könnten zwei auf denselben Tastendruck vorrücken und eine der beiden
// Zeilen würde stumm verschluckt. Geschrieben wird trotzdem nur an einer
// Stelle, in langEreignis().
function langAnsprechen(key){
  for(const k in LANGVORGAENGE){
    if(!langLaeuft(k)) continue;
    const d = LANGVORGAENGE[k];
    if(d.hoert.indexOf('ansprechen') < 0) continue;
    const vorher = langStufe(k);
    langEreignis('ansprechen', {key, nur:k});
    const st = langStufe(k);
    if(st > vorher) return d.fortschritt(st);
  }
  return null;
}
// Zusätzliche Grundzeilen aus fortgeschrittenen Strängen. Sie hängen sich hinten
// an fig.grund an, statt eine der sechs zu ersetzen.
function langZusatz(key){
  if(!CONFIG.schichtModus) return [];   // GW6
  let out = [];
  for(const k in LANGVORGAENGE){
    const d = LANGVORGAENGE[k];
    if(d.figur !== key || !d.zusatz) continue;
    const z = d.zusatz(langStufe(k));
    if(z && z.length) out = out.concat(z);
  }
  return out;
}

// Vierter Abschnitt im Blätter-Reiter, neben vorgangBestandBlock(). Liefert '',
// solange kein Strang angefangen hat — vorher sieht der Reiter aus wie zuvor.
// Panel-Text, kein Zeichendeckel. Gezeigt werden nur begonnene Stränge: eine
// Liste aller sieben wäre ein Questlog, und das gibt es hier nicht.
function langBestandBlock(){
  if(!CONFIG.schichtModus) return '';
  const zeilen = [];
  for(const k in LANGVORGAENGE){
    const d = LANGVORGAENGE[k];
    if(!d.bestand) continue;
    const st = langStufe(k);
    if(st <= 0) continue;
    zeilen.push(`<p style="margin:2px 0;color:${langFertig(k) ? '#8fdc8f' : '#c9b98a'};">${d.bestand(st)}</p>`);
  }
  if(!zeilen.length) return '';
  return `<div style="font-size:calc(11px * var(--fs));margin-bottom:8px;">
    <div style="font-size:calc(10px * var(--fs));color:#f4d97a;font-weight:bold;margin-bottom:3px;">LAUFENDE VORGÄNGE</div>
    ${zeilen.join('')}</div>`;
}

function langAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('W7 Langvorgang:', m, ...r); };
  const EMOJI  = PRUEF_EMOJI;
  const GEHEIM = PRUEF_GEHEIM;
  const strip  = html => String(html).replace(/<[^>]+>/g, ' ');
  const text = (txt, cap, feld) => {
    if(typeof txt !== 'string' || !txt) return fehler('leer', feld, JSON.stringify(txt));
    if(cap && txt.length > cap) fehler('Zeichendeckel verletzt', feld, JSON.stringify(txt), txt.length, '>', cap);
    if(txt.indexOf('undefined') >= 0) fehler('undefined im Text', feld, txt);
    if(/[—–]/.test(txt)) fehler('Gedankenstrich', feld, txt);
    if(EMOJI.test(txt))  fehler('Emoji', feld, txt);
    for(const g of GEHEIM) if(txt.indexOf(g) >= 0) fehler('Sperrvermerk verletzt', feld, g, txt);
  };
  // LV4: die Kurzform-Prüfung aus F1b, hier nachgezogen. knAssertCaps() führt sie
  // über DORF_FIGUREN, KN_FIGUR und die Zettelkanäle, aber nie über die
  // Langvorgänge: LANGVORGAENGE steht rund 6000 Zeilen unter ihm und läge von
  // dort in der TDZ. Die Beats waren damit die einzigen Sprechblasen des Spiels
  // ohne diese Prüfung, und LV4 setzt mit 'a. D.' als erstes ein Kürzel in einen
  // Beat. Dieselben zwei Muster, dieselbe Tabelle.
  //
  // Eigener Helfer und NICHT in text() eingebaut, und das ist ein gemessener
  // Befund: text() läuft auch über gestrippte Panel-Blöcke, und die tragen
  // Überschriften und Knopfbeschriftungen in Versalien. Beim ersten Lauf hat die
  // Prüfung von dort 'DAS' aus "DAS FINALE" und 'NEUEN' aus "NEUEN VORGANG
  // ANLEGEN" gemeldet. Genau dieser Fall steht in ABK_AUSNAHME begründet, und
  // knAssertCaps() hat ihn nie gehabt, weil es Tabellenzeilen prüft und kein
  // gerendertes HTML. Also wird hier auch nur die Tabelle geprüft.
  const abk = (txt, feld) => {
    if(typeof txt !== 'string' || !txt) return;
    for(const roh of (txt.match(ABK_PUNKT) || [])){
      const k = abkNorm(roh);
      if(!(k in ABKUERZUNGEN)) fehler('Abkürzung ohne Eintrag in ABKUERZUNGEN', feld, k, txt);
    }
    for(const k of (txt.match(ABK_GROSS) || [])){
      if(ABK_ROEMISCH.test(k) || ABK_AUSNAHME.indexOf(k) >= 0) continue;
      if(!(k in ABKUERZUNGEN)) fehler('Abkürzung ohne Eintrag in ABKUERZUNGEN', feld, k, txt);
    }
  };

  // Spiegel. Alles wird am Ende exakt zurückgesetzt, ohne saveAmt()/saveKladde().
  const langEcht = kladde.lang, schichtenEcht = amt.schichten, modusEcht = CONFIG.schichtModus,
        flagsEcht = langSchicht, manaEcht = amt.bonusManaRegen, vorgangEcht = kladde.vorgang,
        // SZ3: der siebte Spiegel. Punkt (2) fragt, ob ein Strang JEMALS
        // abschliessbar ist, und seit SZ3 laeuft Nummer 4 ueber eine Figur, die
        // nicht mehr an einem Akt haengt, sondern an ihrer Ankunft (figDa/daWenn).
        // Ohne diesen Spiegel meldete der Guard den Strang als tot, obwohl er
        // erreichbar ist — er kannte nur den Zustand VOR Szene 6.
        vorblattEcht = kn.flags.szeneVorblatt;
  kn.flags.szeneVorblatt = true;
  // GW6: alle Punkte außer (5) prüfen die schichtModus=true-Semantik. Seit
  // langFertig()/langLaeuft() den Modus mitlesen, muss er dafür gesetzt sein,
  // sonst liefe der Bramsche-Punkt (7) bei schichtModus=false grundlos rot.
  CONFIG.schichtModus = true;
  // GW26i: try/finally. Die Guards setzen sechs Spiegel und stellten sie erst
  // nach allen Schleifen zurueck. Wirft eine gerufene Funktion, blieben sie
  // korrumpiert stehen, und weil der Guard auf Skriptebene läuft, nach
  // loadAmt() und vor jedem Speichern, riss das den Rest des Skripts mit.
  try {

  // (1) Tabellenform.
  for(const k in LANGVORGAENGE){
    const d = LANGVORGAENGE[k];
    for(const f of ['figur','titel','stufen','hoert','wenn','schritt','fortschritt'])
      if(!(f in d)) fehler('Pflichtfeld fehlt', k, f);
    if(!(d.stufen >= 1)) fehler('stufen muss mindestens 1 sein', k, d.stufen);
    if(!Array.isArray(d.hoert) || !d.hoert.length) fehler('hoert leer', k);
    else for(const e of d.hoert) if(LANG_EREIGNISSE.indexOf(e) < 0) fehler('unbekannte Ereignisart', k, e);
    if(d.figur !== 'knoeterich' && !DORF_FIGUREN.some(f => f.key === d.figur)) fehler('Figur existiert nicht', k, d.figur);
    text(d.titel, 0, 'titel ' + k); abk(d.titel, 'titel ' + k);
  }

  // (2) Kein toter Strang: jeder muss über eine Ereignisfolge bis stufen
  // kommen. Der Guard ruft NIE langEreignis() — das würde saveKladde()
  // auslösen und den echten Spielstand überschreiben. Er ruft d.schritt()
  // direkt und schreibt auf den Spiegel. ACHTUNG: rein sind diese schritt()
  // nicht alle — dorffest und gutachter schreiben langSchicht. Punkt (3) unten
  // setzt das Flag deshalb zurueck und prueft über langEreignis().
  // Dieselbe Warnung trägt vorgangAssert() für findeAdresszeile().
  CONFIG.schichtModus = true;
  const rohEnde = {};   // der erreichte Endzustand je Strang, für (10)
  for(const k in LANGVORGAENGE){
    const d = LANGVORGAENGE[k];
    kladde.lang = {}; amt.schichten = 200; amt.bonusManaRegen = 2;
    let roh = 0, runden = 0;
    const stufeVon = r => d.stufe ? d.stufe(r) : r;
    while(stufeVon(roh) < d.stufen && runden++ < 400){
      langSchicht = {};                       // je Runde eine neue Schicht
      for(const was of d.hoert){
        for(const info of LANG_PROBEN[was] || [null]){
          const neu = d.schritt(was, info, roh);
          if(stufeVon(neu) < stufeVon(roh)) fehler('schritt() senkt die Stufe', k, was, roh, neu);
          roh = neu; kladde.lang[k] = roh;
        }
      }
    }
    if(stufeVon(roh) < d.stufen) fehler('Strang nie abschliessbar, toter Tabelleneintrag', k, stufeVon(roh), 'von', d.stufen);
    rohEnde[k] = roh;
  }

  // (3) Der Endzustand hält. GW18: Bis hierher rief dieser Punkt d.schritt()
  // direkt auf und liess langSchicht dabei stehen — für dorffest war er damit
  // strukturell immer wahr, weil dessen schritt() das Schichtflag als erste
  // Bedingung prüft. Mit frischem Flag ist d.schritt() für dorffest NICHT
  // idempotent (roh 11 wird 12); die Zeile, die den Endzustand wirklich hält,
  // ist der Stufendeckel in langEreignis() — und genau an dem lief der Guard
  // vorbei. Jetzt wird der echte Pfad geprüft, samt Deckel, Monotoniefilter,
  // wenn()-Gate und info.nur.
  //
  // Seiteneffektfrei bleibt das, weil ALLE sieben Stränge gleichzeitig auf
  // ihrem Endwert stehen: der Deckel überspringt jeden, dirty bleibt false,
  // saveKladde() wird nie erreicht.
  kladde.lang = Object.assign({}, rohEnde); langSchicht = {};
  for(const was of LANG_EREIGNISSE) for(const info of LANG_PROBEN[was] || [null]) langEreignis(was, info);
  for(const k in rohEnde){
    if((kladde.lang[k] | 0) !== rohEnde[k])
      fehler('Endzustand bewegt sich noch', k, rohEnde[k], '->', kladde.lang[k]);
  }
  kladde.lang = {}; langSchicht = {};

  // (8) Zeichendeckel, Formregeln, Sperrvermerk. Fortschritts- und Zusatzzeilen
  // sind Sprechblasen (z1<=48, z2<=32); bestand() ist freier Panel-Text ohne
  // Deckel, aber Form und Sperrvermerk gelten auch dort.
  for(const k in LANGVORGAENGE){
    const d = LANGVORGAENGE[k];
    for(let st = 1; st <= d.stufen; st++){
      const f = d.fortschritt(st);
      if(!f){ fehler('fortschritt() liefert nichts', k, st); continue; }
      text(f.z1, 48, 'fortschritt z1 ' + k + ' st=' + st); abk(f.z1, 'fortschritt z1 ' + k + ' st=' + st);
      if(f.z2){ text(f.z2, 32, 'fortschritt z2 ' + k + ' st=' + st); abk(f.z2, 'fortschritt z2 ' + k + ' st=' + st); }
    }
    for(let st = 0; st <= d.stufen; st++){
      if(d.zusatz) for(const z of (d.zusatz(st) || [])){
        text(z.z1, 48, 'zusatz z1 ' + k + ' st=' + st); abk(z.z1, 'zusatz z1 ' + k + ' st=' + st);
        if(z.z2){ text(z.z2, 32, 'zusatz z2 ' + k + ' st=' + st); abk(z.z2, 'zusatz z2 ' + k + ' st=' + st); }
      }
      // GW18: bestand() liest bei probezeit und gutachter den ROHWERT aus
      // kladde.lang, nicht die uebergebene Stufe. Mit leerem kladde.lang sah es
      // also immer 0, geprüft wurden im Spiel unmoegliche Kombinationen,
      // während die realen Zwischenstrings ("4 von 6 Bemerkungen gesammelt,
      // 3 vorgelegt") nie erzeugt wurden. Jetzt wird der Rohwert mitgesetzt.
      if(d.bestand){
        const vorher = kladde.lang[k];
        kladde.lang[k] = rohEnde[k];
        text(d.bestand(st), 0, 'bestand ' + k + ' st=' + st + ' (Endrohwert)');
        abk(d.bestand(st), 'bestand ' + k + ' st=' + st + ' (Endrohwert)');
        kladde.lang[k] = 0;
        text(d.bestand(st), 0, 'bestand ' + k + ' st=' + st + ' (Rohwert 0)');
        abk(d.bestand(st), 'bestand ' + k + ' st=' + st + ' (Rohwert 0)');
        if(vorher === undefined) delete kladde.lang[k]; else kladde.lang[k] = vorher;
      }
    }
  }

  // (4) Blockadefreiheit. Mit leerem kladde.lang bleibt der Hauptvorgang genau
  // so erreichbar wie vor W7 — kein Strang ist Bedingung für irgendetwas.
  // GW10: Schicht 40 statt 30. Die Zustellung hängt seither zusätzlich an
  // aktStand() >= 5; bei 30 wäre der Fehlschlag kein W7-Befund, sondern die neue
  // Aktschwelle. Der Adress-Akt und die Zeichnungsbefugnis bleiben unten bei 30.
  amt.schichten = 40; kladde.vorgang = {1:true, 2:true, 3:true, 4:true};
  if(!vorgangZustellbar()) fehler('W7 blockiert den Hauptvorgang: Zustellen nicht möglich bei Schicht 40 mit vollem Bestand');
  for(const s in SERIE_AKT){ amt.schichten = SERIE_AKT[s] * 10; if(!serieFrei(s)) fehler('W7 blockiert eine Blattserie', s); }
  amt.schichten = 200;
  for(const k in AUFTRAG_TYPEN) if(AUFTRAG_TYPEN[k].wenn && !AUFTRAG_TYPEN[k].wenn()) fehler('W7 blockiert einen Auftragstyp', k);
  // GW18: die zwei Prädikate, die das Phasendokument mitzählt, aber nie geprüft
  // wurden. Zusätzlich der schmale Punkt des Wertebereichs statt nur des
  // großzügigen: bei Schicht 30 muss der Adress-Akt offen sein und die
  // Zeichnungsbefugnis stehen, sonst hängt Akt IV an einem Strang.
  if(!vorgangAdressAkt()) fehler('W7 blockiert den Adress-Akt bei Schicht 200');
  if(!rangZeichnungsbefugt()) fehler('W7 blockiert die Zeichnungsbefugnis bei Schicht 200');
  amt.schichten = 30;
  if(!vorgangAdressAkt()) fehler('W7 blockiert den Adress-Akt bei Schicht 30');
  if(!rangZeichnungsbefugt()) fehler('W7 blockiert die Zeichnungsbefugnis bei Schicht 30');

  // (6) Milbs Schild. Über alle t.diff und beide Strangzustände: es liegt nie
  // über dem echten Wert (sonst wäre ein W4-Aushang schwerer als angekündigt),
  // nach dem Nachweis trifft es ihn genau, und der angezeigte Index bleibt im
  // RARITY-Bereich.
  for(const zustand of ['offen', 'fertig']){
    kladde.lang = zustand === 'fertig' ? {gutachter: rohEnde.gutachter} : {};
    for(let diff = 1; diff <= 5; diff++){
      const zeig = langKammerWert({diff});
      if(zeig > diff) fehler('Milb stuft zu hoch ein', zustand, diff, zeig);
      if(zeig < 1)    fehler('Milbs Schild unterschreitet die Skala', zustand, diff, zeig);
      const tier = Math.max(0, Math.min(4, zeig - 1));
      if(!RARITY[tier]) fehler('Schild-Index ausserhalb RARITY', zustand, diff, tier);
      if(zustand === 'fertig' && zeig !== diff) fehler('Milb liegt nach dem Nachweis weiter daneben', diff, zeig);
      if(zustand === 'offen' && diff > 1 && zeig !== diff - 1) fehler('Milb liegt nicht um genau eine Stufe daneben', diff, zeig);
    }
  }
  kladde.lang = {};

  // (7) Bramsches Fragenrechnung, beide Strangzustände. Die Zeile in
  // startShift() ist die einzige Stelle, die den Zähler setzt.
  kladde.lang = {};
  if(1 + (langFertig('anlage3') ? 1 : 0) !== 1) fehler('Bramsche gibt ohne Anlage 3 nicht genau eine Frage');
  kladde.lang = {anlage3: rohEnde.anlage3};
  if(1 + (langFertig('anlage3') ? 1 : 0) !== 2) fehler('Bramsche gibt mit Anlage 3 nicht genau zwei Fragen');
  kladde.lang = {};

  // (10) Gerenderte Blöcke, HTML-gestrippt, in BEIDEN Strangzuständen. Ein
  // bedingter Absatz, den nur der abgeschlossene Zustand zeigt, wäre sonst nie
  // geprüft — vorgangAssert() sieht ihn nur im Ladezustand.
  for(const zustand of ['leer', 'fertig']){
    kladde.lang = {};
    // rohEnde statt stufen: bei Strängen mit eigener stufe()-Abbildung (Nörgels
    // Bitmaske) ist der Rohwert nicht die Stufe, und ein naives kladde.lang[k]
    // = stufen läge daneben.
    if(zustand === 'fertig') for(const k in LANGVORGAENGE) kladde.lang[k] = rohEnde[k];
    // SZ4: der Abspann ist kein Panelschritt mehr, sondern ein Tafelstapel.
    // Geprueft wird deshalb, was jetzt den Text traegt: die dreizehn Bilder,
    // beide Lesarten, in beiden Strangzustaenden. Bild 7 ist das eine, das
    // sich mit dem Strang aendert, und genau dafuer laeuft diese Schleife.
    abspannBlaetter().forEach((b, i) => {
      const wo = 'Abspann ' + zustand + ' Bild ' + (i + 1);
      if(b.z1 !== undefined){ text(b.z1, 0, wo + ' gross'); text(b.z2, 0, wo + ' klein'); }
      else {
        text(b.blatt, 0, wo + ' Regieangabe');
        b.stimme.forEach((z, j) => {
          const istPaar = z !== null && typeof z === 'object';
          if(istPaar) text(z.wer, 0, wo + ' Stimme ' + (j + 1) + ' Sprecher');
          text(istPaar ? z.z : z, 0, wo + ' Stimme ' + (j + 1));
        });
        if(b.regie) text(b.regie, 0, wo + ' Nachbemerkung');
      }
    });
    for(let st = 0; st <= LANGVORGAENGE.giesskanne.stufen; st++){
      kladde.lang.giesskanne = st;
      const blk = langGiesskanneBlock();
      if(blk) text(strip(blk), 0, 'Gießkanne-Block st=' + st);
    }
    kladde.lang = zustand === 'fertig' ? Object.assign({}, rohEnde) : {};
    // LV4: das Finale gehört seit dem sechsten Praktikumsbericht dazu. Es liest
    // langFertig('bericht') im vierten Puzzleteil, und die text-Fassung wäre
    // sonst von keinem Guard je gerendert worden: vorgangAssert() rendert
    // Schritt 2 zwar in zwei Zuständen, aber beide mit dem ECHTEN kladde.lang
    // des Spielers, also mit ziemlicher Sicherheit zweimal derselben Fassung.
    // Hier stehen beide Strangzustände ohnehin schon bereit.
    text(strip(vorgangPanelHtml(5)), 0, 'Finale ' + zustand);
    const bb = langBestandBlock();
    if(zustand === 'leer' && bb !== '') fehler('langBestandBlock() ist bei leerem Bestand nicht leer');
    if(bb) text(strip(bb), 0, 'Bestandblock ' + zustand);
  }
  kladde.lang = {};

  // (11) LV4: jeder lang-Schalter in DORF_FIGUREN nennt einen Strang, den es
  // gibt. Diese Hälfte kann ZUSATZ_SCHALTER.lang.pruef nicht leisten, weil sie
  // in knAssertCaps() auf Skriptebene läuft und LANGVORGAENGE dort noch in der
  // TDZ liegt (Begründung steht an der Tabelle). Ohne die Prüfung wäre ein
  // Tippfehler im Schlüssel eine Figur, deren Zeilen nie aufgehen, und genau
  // diese Klasse stummer Fehler soll seit GW14 gemeldet werden.
  for(const fig of DORF_FIGUREN) for(const z of (fig.zusatz || [])){
    if(!('lang' in z)) continue;
    if(!(z.lang in LANGVORGAENGE)) fehler('Figur nennt einen Langvorgang, den es nicht gibt', fig.key, z.lang);
  }

  // (5) Inertheit: bei schichtModus=false schreibt kein Ereignis irgendetwas.
  CONFIG.schichtModus = false;
  for(const was of LANG_EREIGNISSE) for(const info of LANG_PROBEN[was] || [null]) langEreignis(was, info);
  for(const k in kladde.lang) fehler('W7 ist bei schichtModus=false nicht inert', k, kladde.lang[k]);

  } finally {
  CONFIG.schichtModus = modusEcht; amt.schichten = schichtenEcht;
  kladde.lang = langEcht; kladde.vorgang = vorgangEcht;
  amt.bonusManaRegen = manaEcht; langSchicht = flagsEcht;
  kn.flags.szeneVorblatt = vorblattEcht;
  }

  console.assert(ok, 'W7 Langvorgang: Assertion fehlgeschlagen, siehe Konsole.');
  return ok;
}

// Probeninfos für den Guard: je Ereignisart die info-Objekte, die im Spiel
// vorkommen können. Steht direkt vor dem Selbstaufruf, damit langAssert() es
// beim Laufen bereits sieht.
const LANG_PROBEN = {
  schichtende: [{bm:0},{bm:1},{bm:2},{bm:3},{bm:4},{bm:5}],
  ansprechen:  DORF_FIGUREN.map(f => ({key:f.key})),
  // SZ3: die beiden Formen des Ortsschritts. Ohne die zweite waere Stufe 4 des
  // Stopfens unerreichbar, und Punkt (2) meldete zu Recht einen toten Eintrag —
  // genau das hat er beim ersten Lauf getan.
  stopfenort:  [null, {gezogen:true}],
};
// Die drei Guards, die W7-Zustand lesen, laufen erst hier — alle drei tragen an
// ihrer Definition den Grund. Reihenfolge egal, es sind reine Prüfungen.
langAssert();
vorgangAssert();
anredeAssert();

// ===========================================================================
//  MONSTERKATALOG M1: der achte Guard
//
//  Das Katalogdokument (monsterkatalog-stufe-1-10.md) rechnet seine Zahlen aus
//  einem Referenzspieler aus, der aus recalc()/hurtPlayer()/drinkPotion()
//  abgeleitet ist. Dieser Guard rechnet dieselbe Probe im laufenden Spiel nach.
//  Der Unterschied ist der Punkt: das Dokument rechnet mit einer Abschrift der
//  Formeln, dieser Guard mit den Formeln selbst. Wer recalc() ändert, sieht
//  hier sofort, welche Gegner aus ihrem Band gefallen sind, nicht erst, wenn
//  sich jemand über einen Kampf wundert.
//
//  Geprüft wird je Gegner mit kat-Feld:
//    Kampfzeit  A1 1-3 s, A2 8-15 s, A3 12-25 s, A4 20-40 s
//    XP je effektiver Kampfsekunde  A1 1,0 : A2 1,4 : A3 2,0 : A4 2,6
//    Gefahrenbudget  A1 über 30 s, A2 15-25 s, A3 6-10 s, A4 3-6 s
//    Vorwarnung  mindestens 350 ms bei A3 und A4, mindestens 250 ms sonst
//    dazu: Weichstelle erreichbar, Zutat vorhanden, Muster vorhanden.
//
//  Der Referenzspieler wird nicht abgeschrieben, sondern gebaut: Spielerzustand
//  sichern, Referenzausrüstung einsetzen, recalc() rufen, messen, im finally
//  alles zurücksetzen. Dieselbe Spiegel-Technik wie in auftragAssertBrett()
//  und vorgangAssert().
// ===========================================================================
const KAT_TTK  = {A1:[1,3],   A2:[8,15],  A3:[12,25], A4:[20,40]};
const KAT_GEF  = {A1:[30,1e9],A2:[15,25], A3:[6,10],  A4:[3,6]};
const KAT_XP   = {A1:1.0, A2:1.4, A3:2.0, A4:2.6};
const KAT_WARN = {A1:250, A2:250, A3:350, A4:350};
// Referenzausrüstung je Sollstufe: Waffenaffix, Rüstungswert, Heilung je Minute.
// Ein Fund­fenster, kein Optimum, genau die Ausrüstung, die ein Spieler auf
// dieser Stufe üblicherweise trägt.
const KAT_REF = {
  1:[2,0,60],  2:[2,3,60],   3:[2,5,60],   4:[5,10,90], 5:[5,10,90],
  6:[5,13,90], 7:[5,13,90],  8:[8,17,120], 9:[8,17,120], 10:[8,20,120],
};
// Zauberleistung, manabegrenzt. Z2: die Manarate ist nicht mehr die passive
// Regeneration allein, sondern das, was ein Spieler IM Kampf erwirtschaftet:
// MANA_REGEN passiv plus MANA_JE_TREFFER je Waffenschwung bei 1,3 Schwuengen je
// Sekunde (Referenzwaffe, s. KAT_REF). Das Modell traegt auch beim Steingolem,
// dessen Sollroute Magie ist: die Treffer-Ladung haengt am Treffer, nicht am
// Schaden, seine 0,9 Physisch-Resistenz aendert an der Manarechnung nichts.
// Abgeleitet statt hart kodiert, damit ein spaeterer Dreh an der Manaschraube
// hier automatisch ankommt (zauberAssert prueft die Kopplung).
const KAT_MANA_RATE = MANA_REGEN + MANA_JE_TREFFER * 1.3;
const KAT_ZAUBER_DPS = (KAT_MANA_RATE / SPELLS[0].mana) * SPELLS[0].dmg;
const katBasisrate = stufe => 5 * Math.pow(stufe, 0.6);
// Mittlere Wucht eines Angriffs über einen langen Zyklus. Sondermuster ersetzen
// den Grundtreffer, aber sie schlagen nicht gleich hart: ein Unterstützer heilt
// statt zu treffen, ein Verwehen macht gar nichts, ein Folgeschlag trägt die
// halbe Wucht. Wer das Gefahrenbudget mit der reinen Grundwucht rechnet,
// verspricht einen Druck, den der Gegner nie ausübt. Deshalb spielt diese
// Funktion genau die Auswahl nach, die musterWaehlen() im Kampf trifft.
function katWuchtSchnitt(d){
  const mu = d.muster || [];
  if(!mu.length) return 1;
  const wucht = p => (p.art === 'stuetz' || p.art === 'zu' || p.art === 'mantel') ? 0 : (p.wucht || 1);
  let summe = 0, schlag = 0, folgeDran = false;
  for(let i = 0; i < 60; i++){
    schlag++;
    let wahl = null;
    if(folgeDran){
      for(const p of mu) if(p.folge){ wahl = p; break; }
      folgeDran = false;
    }
    if(!wahl) for(let j = 1; j < mu.length; j++){
      if(mu[j].folge || mu[j].eroeffnung) continue;
      if(mu[j].jede && schlag % mu[j].jede === 0){ wahl = mu[j]; break; }
    }
    if(!wahl) wahl = mu[0];
    const w = wucht(wahl);
    summe += w;
    if(d.folgeschlag && w > 0 && !wahl.folge) folgeDran = true;
  }
  return summe / 60;
}

// M2: die vier Arten, die der Spieler ueberhaupt austeilen kann (Gift steht in
// den Tabellen, hat aber keine Spielerquelle, s. SCHADENSART).
const KAT_ARTEN = ['physisch'].concat(SCHADENSART);
// Modelle, die sichtbar einen Bogen oder einen Stab fuehren, und Modelle, die
// sichtbar eine Nahkampfwaffe fuehren. flying_skull, die Schleime, bat und die
// Shroomlinge stehen bewusst in keiner der beiden Listen: sie fuehren gar keine
// Waffe und passen deshalb zu beidem.
const RIG_FERN = ['skeleton_bowman', 'knights_archer', 'skeleton_mage',
                  'cowling_mage_1', 'cowling_mage_2', 'angel_1', 'angel_2'];
const RIG_NAH  = ['goblin_maceman', 'goblin_thief', 'knights_swordman',
                  'knights_spearman', 'knights_templar'];

function monsterAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('Monsterkatalog:', m, ...r); };
  // Spiegel: alles, was recalc() liest und was hier verändert wird.
  const echt = {level: player.level, skills: player.skills, equip: player.equip, hp: player.hp};
  try {
    for(const typ in MONDEF){
      const d = MONDEF[typ];
      if(!d.kat) continue;                       // Frostkamm, Schattenland, Reserve: nicht im Katalog
      const k = d.kat, stufe = k.stufe, ref = KAT_REF[stufe];
      if(!ref){ fehler('Sollstufe ausserhalb 1 bis 10', typ, stufe); continue; }
      if(!KAT_TTK[k.klasse]){ fehler('unbekannte Ertragsklasse', typ, k.klasse); continue; }
      if(!ZUTAT_NOUNS[typ]) fehler('Katalogtyp ohne Zutat, Sammlung waere unerfuellbar', typ);
      if(!d.muster || !d.muster.length) fehler('Katalogtyp ohne Angriffsmuster', typ);
      if(!d.res) fehler('Katalogtyp ohne Resistenzen, EHP waere HP', typ);

      // --- Referenzspieler dieser Sollstufe bauen -------------------------
      player.level = stufe;
      player.skills = {str: stufe-1, vit: stufe-1, agi: 0, int: 0};
      player.equip = {
        weapon: {base: BASES[1], rar: 1, affixes: [{k:'dmg', v: ref[0], def: AFFIXES[0]}], name:'Referenzklinge'},
        armor:  ref[1] ? {base: {t:'armor', name:'Referenzpanzer', tier:1, armor: ref[1]}, rar:0, affixes: []} : null,
        shield: null, boots: null,
      };
      recalc();
      const dps = ((derived.dmgMin + derived.dmgMax) / 2) * (1 + derived.crit * 0.7) * derived.aps;
      const minderung = Math.min(0.6, derived.armor / (derived.armor + 30));
      const heilung = d.muster && d.muster.some(x => x.sperre) ? 0 : ref[2] / 60;

      // --- Kampfzeit auf der Sollroute -------------------------------------
      const res = d.res ? (d.res[k.route] || 0) : 0;
      if(res >= 0.999){ fehler('Sollroute ist wirkungslos, der Gegner waere unbesiegbar', typ, k.route); continue; }
      const ehp = d.hp / (1 - res);
      const ttk = ehp / (k.route === 'physisch' ? dps : KAT_ZAUBER_DPS);
      const tb = KAT_TTK[k.klasse];
      if(ttk < tb[0] * 0.94 || ttk > tb[1] * 1.06)
        fehler('Kampfzeit ausserhalb des Bandes', typ, k.klasse, ttk.toFixed(1) + ' s', 'soll ' + tb[0] + ' bis ' + tb[1]);

      // --- Gefahrenbudget ---------------------------------------------------
      const dmgAvg = (d.dmg[0] + d.dmg[1]) / 2;
      const dpsEin = dmgAvg * katWuchtSchnitt(d) * (1 - minderung) / d.atkCd;
      const netto = dpsEin - heilung;
      const budget = netto > 0 ? derived.maxHp / netto : Infinity;
      const gb = KAT_GEF[k.klasse];
      if(budget < gb[0] * 0.94 || budget > gb[1] * 1.06)
        fehler('Gefahrenbudget ausserhalb des Bandes', typ, k.klasse,
               (budget === Infinity ? 'unbegrenzt' : budget.toFixed(1) + ' s'), 'soll ' + gb[0] + ' bis ' + (gb[1] > 1e8 ? 'unbegrenzt' : gb[1]));

      // --- Ertragsleiter ----------------------------------------------------
      const xpIst = d.xp / ttk, xpSoll = KAT_XP[k.klasse] * katBasisrate(stufe);
      if(Math.abs(xpIst - xpSoll) / xpSoll > 0.10)
        fehler('XP je Kampfsekunde weicht ab', typ, xpIst.toFixed(2), 'soll ' + xpSoll.toFixed(2));

      // --- Vorwarnung -------------------------------------------------------
      for(const mus of (d.muster || [])){
        if(!(mus.warn >= KAT_WARN[k.klasse]))
          fehler('Vorwarnung zu kurz', typ, mus.name, mus.warn + ' ms', 'mindestens ' + KAT_WARN[k.klasse]);
      }
      // --- Weichstelle ------------------------------------------------------
      // Ein Resistenz-Gate ohne erreichbare Weichstelle wäre eine Sackgasse:
      // Gift kann der Spieler nicht wirken, also darf keine Weichstelle dort liegen.
      if(d.weich === 'gift') fehler('Weichstelle liegt auf Gift, der Spieler hat keine Giftquelle', typ);
      if(k.typen && k.typen.indexOf('B5') >= 0 && d.res[d.weich] > -0.05)
        fehler('Resistenz-Gate ohne Verwundbarkeit', typ, d.weich, d.res[d.weich]);

      // --- M2: kein Gegner ohne Konter --------------------------------------
      // Die harte Fassung des Verbots "Gegner ohne Konter": wer gegen alle vier
      // spielbaren Arten immun ist, ist unbesiegbar. Das ist keine Balance-, das
      // ist eine Sackgassenpruefung.
      if(KAT_ARTEN.every(a => (d.res[a] || 0) >= 0.999))
        fehler('gegen alle vier Arten immun, kein Konter moeglich', typ);
      // Zauberfest ist erlaubt, aber nur unter denselben drei Bedingungen, die
      // schon der Generator prueft (tools/monsterkatalog.py). Doppelt gerechnet
      // mit Absicht: der Generator schuetzt den Katalog, dieser Guard das Spiel.
      if(d.zauberfest){
        if(k.route !== 'physisch')  fehler('zauberfest, aber Sollroute ist ein Zauber', typ, k.route);
        if(d.res.physisch > -0.05)  fehler('zauberfest ohne Weichstelle gegen die Waffe', typ, d.res.physisch);
        if(k.klasse === 'A4')       fehler('zauberfest und A4 zugleich, zwei Huerden auf einmal', typ);
        if(KAM_WAECHTER.indexOf(typ) >= 0)
          fehler('zauberfest und Kammerwache, die Zweigregel waere unloesbar', typ);
      }

      // --- M2: Rig gegen Angriffsart ----------------------------------------
      // Ein Bogen- oder Stabmodell auf einem Gegner, der ausschliesslich im
      // Nahkampf zuschlaegt, zeigt eine Handlung, die es nicht gibt. Umgekehrt
      // darf ein Gegner, der grundsaetzlich aus der Entfernung kaempft, kein
      // reines Nahkampfmodell tragen.
      const wirft = d.ranged || (d.muster || []).some(x => x.art === 'fern' || x.art === 'stuetz' || x.art === 'mantel');
      if(RIG_FERN.indexOf(d.rig) >= 0 && !wirft)
        fehler('Fernkampfmodell auf einem reinen Nahkaempfer', typ, d.rig);
      if(d.ranged && RIG_NAH.indexOf(d.rig) >= 0)
        fehler('Nahkampfmodell auf einem Fernkaempfer', typ, d.rig);

      // --- M2: der Sonderpruefer bleibt im Rahmen ----------------------------
      // Aus A1 aufgewertet, gerechnet auf derselben Sollstufe. Er darf laenger
      // dauern als ein A1 und haerter treffen, aber er muss unter dem Dach von
      // A3 bleiben, sonst waere er an seiner Sollstufe nicht mehr ohne
      // Verbrauchsgegenstaende zu schaffen.
      if(k.klasse === 'A1'){
        const ettk = ttk * ELITE.hp;
        if(ettk > KAT_TTK.A3[1] * 1.06)
          fehler('Sonderpruefer dauert laenger als ein A3', typ, ettk.toFixed(1) + ' s', 'hoechstens ' + KAT_TTK.A3[1]);
        const enetto = dmgAvg * katWuchtSchnitt(d) * ELITE.dmg * (1 - minderung) / d.atkCd - heilung;
        const ebudget = enetto > 0 ? derived.maxHp / enetto : Infinity;
        if(ebudget < KAT_GEF.A3[0] * 0.94)
          fehler('Sonderpruefer setzt staerker unter Druck als ein A3', typ, ebudget.toFixed(1) + ' s', 'mindestens ' + KAT_GEF.A3[0]);
        for(const mus of (d.muster || []))
          if(!(Math.max(mus.warn * ELITE.warn, ELITE.warnMin) >= KAT_WARN.A3))
            fehler('Vorwarnung des Sonderpruefers zu kurz', typ, mus.name,
                   Math.round(Math.max(mus.warn * ELITE.warn, ELITE.warnMin)) + ' ms');
      }
    }
    // Der Ertragssatz des Sonderpruefers ist nicht frei gewaehlt, sondern das
    // Produkt aus Lebenspunktfaktor und dem Verhaeltnis der Klassenfaktoren.
    // Nur so zahlt er genau den A3-Satz je Kampfsekunde. Steht hier als Rechnung
    // statt als Kommentar, damit ein spaeter geaenderter Faktor auffliegt.
    if(Math.abs(ELITE.xp - ELITE.hp * (KAT_XP.A3 / KAT_XP.A1)) > 1e-9)
      fehler('ELITE.xp passt nicht zum A3-Ertragssatz', ELITE.xp, 'soll ' + ELITE.hp * (KAT_XP.A3 / KAT_XP.A1));
    // Jedes Band braucht im Nahfeld etwas, das dort stehen darf. Eine leere
    // Zone-0-Liste waere ein unsichtbares Loch im Ring ums Dorf.
    for(const b in ZONEN_MOBS[0])
      if(!ZONEN_MOBS[0][b].length) fehler('Nahfeld-Roster leer', b);
  } finally {
    player.level = echt.level; player.skills = echt.skills; player.equip = echt.equip;
    recalc();
    player.hp = echt.hp;
  }
  if(ok) console.log('Monsterkatalog: ' + Object.keys(MONDEF).filter(t => MONDEF[t].kat).length +
                     ' Gegner geprueft, alle Baender eingehalten.');
  return ok;
}
// Weichstelle einmal backen, danach ist sie ein Feld wie jedes andere.
for(const t in MONDEF) if(MONDEF[t].res) MONDEF[t].weich = backeWeichstelle(MONDEF[t]);
// M2: zauberfest wird ABGELEITET, nie von Hand gesetzt. Ein Gegner ist genau
// dann zauberfest, wenn alle drei Zauberzweige an ihm wirkungslos sind. Damit
// kann die Anzeige nicht von den Zahlen abweichen: wer eine Resistenz senkt,
// nimmt ihm damit automatisch das Siegel.
for(const t in MONDEF) if(MONDEF[t].res)
  MONDEF[t].zauberfest = SCHADENSART.every(a => (MONDEF[t].res[a] || 0) >= 0.999);
monsterAssert();

// === Z2: Guard fuer die Zauberbefugnis ======================================
// Prueft die drei Zusagen von Z2 am ECHTEN Code, nicht an einer Abschrift:
//   1. Unter ZAUBER_AB_STUFE gibt es keinen Zauberpunkt und keine
//      Freischaltung, egal wie viele Punkte jemand traegt.
//   2. Die Punktezahl je Stufe ist genau stufe - (ZAUBER_AB_STUFE - 1),
//      gefahren ueber gainXP() selbst, nicht ueber eine Kopie der Formel.
//   3. Die Katalog-Zauberleistung haengt an den Manakonstanten, nicht an
//      einer zweiten hart kodierten Zahl.
// Bauform wie wiederAssert: Spiegeln, pruefen, im finally alles zurueck.
function zauberAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('Z2 Zauberbefugnis:', m, ...r); };
  const echt = {level: player.level, xp: player.xp, sp: player.spellPoints,
                sk: player.skillPoints, hp: player.hp, mana: player.mana,
                flZahl: floaters.length, lvUps: kn.counters.levelUps,
                // K1: neun Probe-Aufstiege legen neun Vorlagen bereit. Ohne
                // diese Spiegelung staende nach jedem Laden eine Geisterziehung
                // im Guertel, die nie jemand ausgeloest hat.
                zKartei: player.zulagenKartei, zZieh: player.zulagenZiehungen,
                zAng: player.zulagenAngebot};
  // gainXP klingelt, wackelt und speichert. Fuer die Probe wird alles davon
  // stillgelegt und danach wiederhergestellt; floaters werden zurueckgestutzt.
  const eSfx = sfx.level, eShake = addShake, eSave = saveKn;
  try {
    sfx.level = function(){}; addShake = function(){}; saveKn = function(){};
    player.level = 1; player.xp = 0; player.spellPoints = 0; player.skillPoints = 0;
    player.zulagenKartei = []; player.zulagenZiehungen = 0; player.zulagenAngebot = null;
    for(let ziel = 2; ziel <= 10; ziel++){
      gainXP(Math.ceil(xpFuerStufe(player.level)) + 1);   // S1: die Leiter, nicht ihre Abschrift
      if(player.level !== ziel){ fehler('Probe-Aufstieg klemmt', player.level, 'statt', ziel); break; }
      const soll = Math.max(0, ziel - (ZAUBER_AB_STUFE - 1));
      if(player.spellPoints !== soll)
        fehler('Zauberpunkte auf Stufe ' + ziel, player.spellPoints, 'statt', soll);
    }
    // Freischaltung unter der Befugnisstufe: auch mit Punkten bleibt alles zu.
    player.level = ZAUBER_AB_STUFE - 1; player.spellPoints = 5;
    for(const sp of SPELLS)
      if(spellUnlockable(sp)) fehler('unter der Befugnisstufe freischaltbar', sp.id);
    // Der Ausbau 'Hoehere Anfangsstufe' muss dieselbe Leiter zahlen wie die
    // Aufstiege. Die Formel steht in startShift(); hier wird geprueft, dass
    // sie an der Konstante haengt und fuer jede Ausbaustufe der gainXP-Leiter
    // entspricht (Startstufe = 1 + startLevel).
    if(String(startShift).indexOf('ZAUBER_AB_STUFE') < 0)
      fehler('startShift() vergibt Zauberpunkte ohne die Befugnisstufe');
    for(let stufe = 0; stufe <= 9; stufe++){
      const formel = Math.max(0, stufe - (ZAUBER_AB_STUFE - 2));
      const leiter = Math.max(0, (1 + stufe) - (ZAUBER_AB_STUFE - 1));
      if(formel !== leiter) fehler('Ausbau und Aufstiegsleiter zahlen verschieden', stufe, formel, leiter);
    }
    // Kopplung der Katalogrechnung an die Manakonstanten.
    const sollDps = ((MANA_REGEN + MANA_JE_TREFFER * 1.3) / SPELLS[0].mana) * SPELLS[0].dmg;
    if(Math.abs(KAT_ZAUBER_DPS - sollDps) > 1e-9)
      fehler('KAT_ZAUBER_DPS ist von den Manakonstanten abgekoppelt', KAT_ZAUBER_DPS, 'soll', sollDps);
  } finally {
    sfx.level = eSfx; addShake = eShake; saveKn = eSave;
    player.level = echt.level; player.xp = echt.xp; player.spellPoints = echt.sp;
    player.skillPoints = echt.sk;
    player.zulagenKartei = echt.zKartei; player.zulagenZiehungen = echt.zZieh;
    player.zulagenAngebot = echt.zAng;
    floaters.length = echt.flZahl;
    kn.counters.levelUps = echt.lvUps;
    recalc();
    player.hp = echt.hp; player.mana = echt.mana;
  }
  if(ok) console.log('Z2 Zauberbefugnis: Punkteleiter, Sperre und Katalogkopplung in Ordnung.');
  return ok;
}
zauberAssert();

// === S1: Guard fuer die Befaehigung =========================================
// Der Spielbericht vor diesem Bauabschnitt lautete: es gibt keinen Grund, die
// Werte zu steigern, man kommt ohne Steigerung immens weit. Der Vorwurf war
// messbar und er stimmte. Dieser Guard haelt fest, dass er nicht zurueckkommt.
//
// Geprueft werden die vier Zusagen von S1:
//   1. Der Punkt schlaegt die Stufe um ein Vielfaches. Wer nicht steigert,
//      bleibt weit unter dem Referenzspieler des Katalogs — in Leben wie in
//      Schaden. Beides wird an recalc() gemessen, nicht nachgerechnet.
//   2. Der Aufstieg heilt nicht mehr. Er war die staerkste Heilquelle im Spiel
//      und hat jede Gefahr weggeleveled.
//   3. Die Stufenleiter steigt streng und ist nirgends abgeschrieben.
//   4. Der Kraftbedarf ist eine echte Sperre, keine Warnung, und der Manapool
//      ist eng genug, dass Amtskunde eine Entscheidung ist.
//
// Bauform wie zauberAssert und wiederAssert: Spiegeln, pruefen, im finally
// alles zurueckstellen.
const S1_SPREIZUNG_HP  = 0.40;   // ungesteigert hoechstens so viel Leben wie der Referenzspieler
const S1_SPREIZUNG_DMG = 0.45;   // dasselbe fuer den mittleren Waffenschaden
const S1_PUNKT_JE_STUFE_MIN = 10;   // ein Punkt muss mindestens zehn Stufen wert sein
const S1_BURST_MAX = 3;          // Sprueche aus dem vollen Grundpool bei Befugniserteilung

function befaehigungAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('S1 Befaehigung:', m, ...r); };
  const echt = {level: player.level, xp: player.xp, skills: player.skills, equip: player.equip,
                hp: player.hp, mana: player.mana, sk: player.skillPoints, sp: player.spellPoints,
                flZahl: floaters.length, lvUps: kn.counters.levelUps,
                zKartei: player.zulagenKartei, zZieh: player.zulagenZiehungen,
                zAng: player.zulagenAngebot};
  const eSfx = sfx.level, eShake = addShake, eSave = saveKn;
  try {
    sfx.level = function(){}; addShake = function(){}; saveKn = function(){};
    // K1: Die Dienstmappe wird fuer die Messung geleert, genau wie messe() die
    // Ausruestung durch die Referenzklinge ersetzt. Die Zusage von S1 gilt dem
    // punktlosen Spieler gegen den gesteigerten; eine Zulage traegt beide
    // Seiten und wuerde die Spreizung rechnerisch zudruecken, ohne dass sich am
    // Verhaeltnis von Punkt zu Stufe irgendetwas geaendert haette. Der Probe-
    // Aufstieg unten legt ausserdem eine Vorlage an, die niemand bestellt hat.
    player.zulagenKartei = []; player.zulagenZiehungen = 0; player.zulagenAngebot = null;

    // --- 1. Der Punkt schlaegt die Stufe -------------------------------------
    // Zuerst als reine Zahlenprobe an den Konstanten: geschenktes Wachstum je
    // Stufe gegen erarbeitetes je Punkt.
    if(ZAEH_HP < HP_JE_STUFE * S1_PUNKT_JE_STUFE_MIN)
      fehler('Zaehigkeit je Punkt zu nah an der geschenkten Stufe', ZAEH_HP, 'gegen', HP_JE_STUFE);
    if(KUNDE_MANA < MANA_JE_STUFE * S1_PUNKT_JE_STUFE_MIN)
      fehler('Amtskunde je Punkt zu nah an der geschenkten Stufe', KUNDE_MANA, 'gegen', MANA_JE_STUFE);

    // Dann an recalc() selbst, auf der Sollstufe 10 mit der Referenzausruestung
    // des Katalogs: einmal mit der Steigerung, die der Katalog unterstellt,
    // einmal ohne jeden Punkt. Der Abstand ist die Zusage von S1.
    const refWaffe = () => ({base: BASES[1], rar: 1, affixes: [{k:'dmg', v: KAT_REF[10][0], def: AFFIXES[0]}], name:'Referenzklinge'});
    const messe = (stufe, skills) => {
      player.level = stufe; player.skills = skills;
      player.equip = {weapon: refWaffe(), armor: null, shield: null, boots: null};
      recalc();
      return {hp: derived.maxHp, dmg: (derived.dmgMin + derived.dmgMax) / 2, mana: derived.maxMana};
    };
    const mitPunkten = messe(10, {str:9, vit:9, agi:0, int:0});
    const ohnePunkte = messe(10, {str:0, vit:0, agi:0, int:0});
    if(ohnePunkte.hp > mitPunkten.hp * S1_SPREIZUNG_HP)
      fehler('ungesteigert zu zaeh auf Stufe 10', ohnePunkte.hp, 'von', mitPunkten.hp,
             '=', (ohnePunkte.hp / mitPunkten.hp * 100).toFixed(0) + ' %, hoechstens ' + (S1_SPREIZUNG_HP*100) + ' %');
    if(ohnePunkte.dmg > mitPunkten.dmg * S1_SPREIZUNG_DMG)
      fehler('ungesteigert zu stark auf Stufe 10', ohnePunkte.dmg.toFixed(1), 'von', mitPunkten.dmg.toFixed(1),
             '=', (ohnePunkte.dmg / mitPunkten.dmg * 100).toFixed(0) + ' %, hoechstens ' + (S1_SPREIZUNG_DMG*100) + ' %');

    // --- 2. Der Aufstieg heilt nicht ----------------------------------------
    if(String(gainXP).indexOf('player.hp = derived.maxHp') >= 0)
      fehler('gainXP() heilt beim Aufstieg wieder voll');
    player.level = 3; player.xp = 0; player.skills = {str:0, vit:0, agi:0, int:0};
    player.equip = {weapon: refWaffe(), armor: null, shield: null, boots: null};
    recalc();
    player.hp = 7;
    gainXP(Math.ceil(xpFuerStufe(player.level)) + 1);
    if(player.level !== 4) fehler('Probe-Aufstieg klemmt', player.level, 'statt 4');
    if(player.hp !== 7) fehler('Aufstieg hat geheilt', player.hp, 'statt 7');

    // --- 3. Die Stufenleiter steigt streng ----------------------------------
    if(String(gainXP).indexOf('xpFuerStufe') < 0)
      fehler('gainXP() rechnet die Stufenleiter selbst statt sie zu lesen');
    for(let st = 1; st < 20; st++)
      if(!(xpFuerStufe(st + 1) > xpFuerStufe(st))){ fehler('Stufenleiter faellt bei', st); break; }

    // --- 4. Kraftbedarf und Manapool ----------------------------------------
    if(String(equipItemFromBag).indexOf('kraftReicht') < 0)
      fehler('equipItemFromBag() prueft den Kraftbedarf nicht');
    const schwer = CRAFT_BASE.weapon.filter(b => (b.kraft||0) > 0).length;
    if(schwer < 2) fehler('zu wenige Klingen mit Kraftbedarf, die Sperre waere Theorie', schwer);
    // Eine zu schwere Waffe in der Hand muss sich in derived niederschlagen.
    player.skills = {str:0, vit:0, agi:0, int:0};
    const brecher = CRAFT_BASE.weapon[CRAFT_BASE.weapon.length - 1];
    player.equip = {weapon: {base: Object.assign({t:'weapon', tier:4}, brecher), rar:4, affixes:[], name: brecher.name},
                    armor:null, shield:null, boots:null};
    recalc();
    if(!derived.zuSchwer) fehler('zu schwere Waffe ohne Vermerk in derived');
    // Der Grundpool bei Befugniserteilung traegt nur eine Handvoll Sprueche.
    // Wer mehr will, steigert Amtskunde — das ist der ganze Zweck von INT.
    player.level = ZAUBER_AB_STUFE; player.skills = {str:0, vit:0, agi:0, int:0};
    player.equip = {weapon: refWaffe(), armor:null, shield:null, boots:null};
    recalc();
    const billigster = SPELLS.filter(sp => !sp.ultimate).reduce((a, b) => a.mana <= b.mana ? a : b);
    const burst = Math.floor(derived.maxMana / billigster.mana);
    if(burst > S1_BURST_MAX)
      fehler('Grundpool traegt zu viele Sprueche', burst, 'x ' + billigster.name, 'hoechstens ' + S1_BURST_MAX);
    if(burst < 1)
      fehler('Grundpool traegt keinen einzigen Spruch, die Befugnis waere wertlos', derived.maxMana, billigster.mana);
    // Das Ultimate muss ohne Amtskunde unbezahlbar und mit ihr erreichbar sein.
    const ult = SPELLS.find(sp => sp.ultimate);
    player.level = 14; recalc();
    const ohneKunde = derived.maxMana;
    player.skills = {str:0, vit:0, agi:0, int:6}; recalc();
    if(ohneKunde >= ult.mana)
      fehler('Ultimate ohne einen Punkt Amtskunde bezahlbar', ohneKunde, 'gegen', ult.mana);
    if(derived.maxMana < ult.mana)
      fehler('Ultimate auch mit sechs Punkten Amtskunde unbezahlbar', derived.maxMana, 'gegen', ult.mana);
  } finally {
    sfx.level = eSfx; addShake = eShake; saveKn = eSave;
    player.level = echt.level; player.xp = echt.xp; player.skills = echt.skills;
    player.equip = echt.equip; player.skillPoints = echt.sk; player.spellPoints = echt.sp;
    player.zulagenKartei = echt.zKartei; player.zulagenZiehungen = echt.zZieh;
    player.zulagenAngebot = echt.zAng;
    floaters.length = echt.flZahl;
    kn.counters.levelUps = echt.lvUps;
    recalc();
    player.hp = echt.hp; player.mana = echt.mana;
  }
  if(ok) console.log('S1 Befaehigung: Spreizung, Aufstieg, Stufenleiter, Kraftbedarf und Manapool in Ordnung.');
  return ok;
}
befaehigungAssert();

// === K1: Guard fuer die Zulagen =============================================
// Geprueft werden die Zusagen von K1, alle am echten Code, keine an einer
// Abschrift:
//   1. Der Katalog ist vollstaendig und haelt die Formregeln: drei Saetze je
//      Familie, streng steigende Werte, ein Hook, den es in FX wirklich gibt,
//      und kein Satz mit einer Zahl oder einem Gedankenstrich darin
//      (Weltbibel Kapitel 13). Das ist die Regel, die beim Nachtragen einer
//      Karte als erste faellt, und sie faellt lautlos.
//   2. Die Faecherleiter ist die zugesagte: eines, ab Stufe 5 zwei, ab
//      Stufe 15 drei, und dazwischen nie weniger.
//   3. Die Ziehung legt drei verschiedene Familien aus, zieht den Zaehler ab
//      und wuerfelt ein ausliegendes Angebot nicht neu.
//   4. Mappe, Stapelregel und Kampfgatter sind Sperren, keine Warnungen.
//   5. Eine eingelegte Karte schlaegt sich in derived nieder, und eine
//      Gattungskarte NUR mit der passenden Waffe in der Hand.
//   6. Die vier Fundstellen tragen den Hook wirklich, und der XP-Balken liest
//      die Stufenleiter, statt sie abzuschreiben (der Fehler, den S1 an
//      gainXP() schon verbietet und der im HUD bis K1 stehen geblieben war).
//
// Bauform wie befaehigungAssert: Spiegeln, pruefen, im finally alles zurueck.
function zulagenAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('K1 Zulagen:', m, ...r); };
  const echt = {level: player.level, skills: player.skills, equip: player.equip,
                hp: player.hp, mana: player.mana, kampfT: player.kampfT,
                flZahl: floaters.length,
                zKartei: player.zulagenKartei, zZieh: player.zulagenZiehungen,
                zAng: player.zulagenAngebot};
  // --- 6. Die Fundstellen tragen den Hook -----------------------------------
  // Steht VOR dem try: hier wird Quelltext gelesen, kein Zustand angefasst, und
  // updateHUD ist gleich stillgelegt. Eine Textprobe auf die eigene Attrappe
  // haette immer angeschlagen.
  if(String(gainXP).indexOf('zulagenZiehungen') < 0)
    fehler('gainXP() legt beim Aufstieg keine Vorlage bereit');
  if(String(startShift).indexOf('zulagenKartei') < 0)
    fehler('startShift() nimmt die Kartei nicht mit in die neue Schicht');
  if(String(recalc).indexOf('FX.schwert') < 0)
    fehler('recalc() liest den Gattungszuschlag nicht');
  if(String(castSpell).indexOf('FX.frost') < 0)
    fehler('castSpell() liest den Zweigzuschlag nicht');
  if(String(updateHUD).indexOf('xpFuerStufe') < 0)
    fehler('der Erfahrungsbalken schreibt die Stufenleiter wieder ab, statt sie zu lesen');

  const eHud = updateHUD;
  try {
    updateHUD = function(){};   // zulageAnlegen() zieht das HUD nach, hier unnoetig

    // --- 1. Der Katalog -----------------------------------------------------
    const ids = Object.keys(ZULAGE);
    if(ids.length < 12) fehler('zu wenige Familien, die Ziehung waere keine Wahl', ids.length);
    const MODI = ['dagger', 'sword', 'doubleaxe'];
    for(const id of ids){
      const zf = ZULAGE[id];
      if(!zf.name || !zf.icon) fehler('Familie ohne Namen oder Sinnbild', id);
      if(!(zf.fx in FX)) fehler('Familie zeigt auf einen Hook, den FX nicht hat', id, zf.fx);
      if(!Array.isArray(zf.wert) || zf.wert.length !== 3) fehler('Familie ohne drei Werte', id);
      else if(!(zf.wert[0] < zf.wert[1] && zf.wert[1] < zf.wert[2]))
        fehler('Werte steigen nicht streng', id, zf.wert.join('/'));
      if(!Array.isArray(zf.satz) || zf.satz.length !== 3) fehler('Familie ohne drei Saetze', id);
      else for(let s = 0; s < 3; s++){
        if(/[0-9]/.test(zf.satz[s])) fehler('Zahl im Anzeigesatz', id, 'Stufe ' + (s+1), zf.satz[s]);
        if(/[–—]/.test(zf.satz[s])) fehler('Gedankenstrich im Anzeigesatz', id, 'Stufe ' + (s+1));
        if(!/[.!?]$/.test(zf.satz[s])) fehler('Anzeigesatz ohne Schlusszeichen', id, 'Stufe ' + (s+1));
      }
      if(!zf.unikat) fehler('Familie ohne Namen fuer die dritte Stufe', id);
      if(zf.modus && MODI.indexOf(zf.modus) < 0) fehler('unbekannte Waffengattung', id, zf.modus);
      if(zf.zweig !== undefined && !(zf.zweig >= 0 && zf.zweig < SPELL_BRANCHES.length))
        fehler('Zweig ausserhalb der Zauberzweige', id, zf.zweig);
      if(typeof zf.stapelbar !== 'boolean') fehler('Familie sagt nicht, ob sie stapelt', id);
      // Das Bildfeld ist freiwillig, solange das Sinnbild ein Emoji ist. Steht
      // eines da, muss es ein Pfad sein oder ein Feld aus bis zu drei Pfaden,
      // eines je Stufe. Ein leerer String liesse ein <img> mit leerem src im
      // Kartenfenster stehen, und das ist im Bild ein Loch; ein viertes Bild
      // waere eine Stufe, die es nicht gibt, und wuerde nie gezeigt.
      if('bild' in zf){
        const b = zf.bild;
        if(Array.isArray(b)){
          if(!b.length) fehler('Bildfeld ist ein leeres Feld', id);
          if(b.length > 3) fehler('Bildfeld traegt mehr Bilder als Stufen', id, b.length);
          b.forEach((pfad, i) => {
            // Luecken sind erlaubt (die Bilder entstehen nach und nach), aber
            // was dasteht, muss ein Pfad sein.
            if(pfad !== null && pfad !== undefined && (typeof pfad !== 'string' || !pfad.trim()))
              fehler('Bildpfad ist keiner', id, 'Stufe ' + ZULAGE_ROEMISCH[i], pfad);
          });
        } else if(typeof b !== 'string' || !b.trim()){
          fehler('Bildfeld ist weder Pfad noch Feld aus Pfaden', id, b);
        }
        // Und die Fundstelle muss lesen, was hier steht.
        for(let st = 1; st <= 3; st++){
          const pfad = zulageBildPfad(zf, st);
          if(pfad !== null && typeof pfad !== 'string')
            fehler('Bildpfad der Stufe kommt nicht als Zeichenkette an', id, st, pfad);
          // Der Dateiname traegt Familie und Stufe. Das ist die einzige Stelle,
          // an der sich ein vertauschtes Bild ueberhaupt bemerken laesst: ein
          // Pfad, der auf eine Datei zeigt, ist immer noch ein gueltiger Pfad,
          // und im Spiel sieht man nur eine Karte mit falschem Motiv. Wer
          // fuenfundvierzig Zeilen von Hand eintraegt, dreht irgendwann eine
          // Ziffer um.
          // Eine Pruefung auf doppelte Pfade stand hier und ist wieder
          // gefallen: sie kann nicht anschlagen. Wenn jeder Pfad auf die
          // eigene Familie und die eigene Stufe enden muss, tragen zwei
          // Karten nie denselben, denn Schluessel sind im Katalog eindeutig.
          // Ein Waechter, der nachweislich nie etwas sagen kann, ist keine
          // Deckung, sondern nur ihr Anschein.
          if(typeof pfad === 'string'){
            const soll = id + '-' + st + '.jpg';
            if(!pfad.endsWith('/' + soll))
              fehler('Bildpfad passt nicht zu Familie und Stufe', id, st, pfad, 'erwartet ' + soll);
            // Und der Pfad muss dort, wo die Karte laeuft, auch etwas laden.
            // Im Einzeldatei-Build liegt kein assets/ neben der HTML, dort ist
            // der Pfad nur ein Schluessel in ASSET_BLOBS. Was der Build nicht
            // eingebacken hat (uebersprungener Ordner, umbenannte Datei), ist
            // auf der Karte ein kaputtes Bildsymbol, und zwar ausschliesslich
            // in der ausgelieferten Fassung. Genau so ist es passiert, und
            // genau deshalb steht die Frage hier und nicht nur im Quellbaum.
            if(ASSET_BLOBS && !ASSET_BLOBS[pfad])
              fehler('Bildpfad liegt nicht im Einzeldatei-Build', id, st, pfad);
          }
        }
      }
      // Die Typenzeile der Karte, an derselben Formregel wie die Anzeigesaetze.
      const artZeile = zulageArtZeile(zf);
      if(!artZeile || /undefined/.test(artZeile)) fehler('Typenzeile unvollstaendig', id, artZeile);
      if(/[0-9]/.test(artZeile)) fehler('Zahl in der Typenzeile', id, artZeile);
      // Kein Wortbruch auf der Namensleiste. Eine Kartenspalte ist rund
      // hundertzehn Pixel breit; was in einem Stueck laenger ist als der
      // Deckel unten, bricht der Browser mitten im Wort ab, und dann steht
      // auf der Karte 'Vollziehbarkei' und darunter ein einzelnes t. Die
      // Fugen der Komposita gehoeren als &shy; in den Namen, siehe den
      // Kommentar am Katalog. Gemessen wird in Zeichen und nicht in Pixeln,
      // weil der Guard ohne Layout laeuft; der Deckel ist an der breitesten
      // Schriftstufe gegen die schmalste Spalte gemessen.
      for(const feld of ['name', 'unikat']){
        for(const stueck of String(zf[feld] || '').split(/[\s­]+|&shy;/)){
          const blank = stueck.replace(/[.,]/g, '');
          if(blank.length > ZULAGE_WORT_MAX)
            fehler('Wort ohne Trennstelle auf der Namensleiste', id, feld, blank,
                   blank.length + ' Zeichen, hoechstens ' + ZULAGE_WORT_MAX);
        }
      }
    }
    if(!ids.some(id => ZULAGE[id].stapelbar) || !ids.some(id => !ZULAGE[id].stapelbar))
      fehler('Stapelregel ist Theorie, es gibt nur eine Sorte Karte');
    // Jede Waffengattung und jeder Zauberzweig braucht seine Karte, sonst ist
    // eine Bauweise im Katalog nicht vertreten und niemandem faellt es auf.
    for(const m of MODI)
      if(!ids.some(id => ZULAGE[id].modus === m)) fehler('keine Karte fuer die Waffengattung', m);
    for(let b = 0; b < SPELL_BRANCHES.length; b++)
      if(!ids.some(id => ZULAGE[id].zweig === b)) fehler('keine Karte fuer den Zauberzweig', SPELL_BRANCHES[b]);

    // --- 2. Die Faecherleiter ----------------------------------------------
    for(let st = 1; st <= 4; st++) if(zulageSlots(st) !== 1) fehler('Faecher auf Stufe ' + st, zulageSlots(st), 'statt 1');
    for(let st = 5; st <= 14; st++) if(zulageSlots(st) !== 2) fehler('Faecher auf Stufe ' + st, zulageSlots(st), 'statt 2');
    for(const st of [15, 20, 60]) if(zulageSlots(st) !== 3) fehler('Faecher auf Stufe ' + st, zulageSlots(st), 'statt 3');
    for(let st = 1; st < 60; st++)
      if(zulageSlots(st + 1) < zulageSlots(st)){ fehler('Faecherzahl faellt bei Stufe', st); break; }
    if(ZULAGE_MAPPE_NAME.length !== 3) fehler('die Mappe hat nicht fuer jede Faecherzahl einen Namen');

    // --- 3. Die Ziehung -----------------------------------------------------
    const gew = ZULAGE_STUFEN_GEWICHT;
    for(let i = 1; i < gew.length; i++)
      if(gew[i].abStufe >= gew[i-1].abStufe) fehler('Stufengewichte stehen nicht absteigend', gew[i].abStufe);
    for(const g of gew)
      if(g.w2 + g.w3 > 100) fehler('Stufengewichte ueber hundert Prozent', g.abStufe, g.w2 + g.w3);
    if(gew[gew.length - 1].w3 !== 0) fehler('Unikate schon auf der untersten Stufe erreichbar');

    const waffe = b => ({base: Object.assign({t:'weapon', tier:1}, b), rar:1, affixes:[], name:b.name});
    const DOLCH = CRAFT_BASE.weapon[0], SCHWERT = CRAFT_BASE.weapon[1];
    player.skills = {str:0, vit:0, agi:0, int:0}; player.kampfT = 0;
    player.equip = {weapon: waffe(SCHWERT), armor:null, shield:null, boots:null};
    player.level = 6; player.zulagenKartei = []; player.zulagenZiehungen = 1; player.zulagenAngebot = null;
    recalc();
    zulagenAngebotSicherstellen();
    const ang = player.zulagenAngebot;
    if(!ang || ang.length !== 3) fehler('Ziehung legt nicht genau drei aus', ang && ang.length);
    else {
      if(new Set(ang.map(a => a.familie)).size !== 3) fehler('Ziehung legt dieselbe Familie mehrfach aus');
      for(const a of ang){
        if(!ZULAGE[a.familie]) fehler('Ziehung nennt eine unbekannte Familie', a.familie);
        if(!(a.stufe >= 1 && a.stufe <= 3)) fehler('Stufe ausserhalb der Leiter', a.stufe);
      }
    }
    if(player.zulagenZiehungen !== 0) fehler('Ziehung zieht den Zaehler nicht ab', player.zulagenZiehungen);
    // Ein ausliegendes Angebot bleibt liegen. Sonst waere Panel zu und wieder
    // auf ein Wuerfelbecher, und die Wahl waere keine.
    player.zulagenZiehungen = 1;
    zulagenAngebotSicherstellen();
    if(player.zulagenAngebot !== ang) fehler('ausliegendes Angebot wird neu gewuerfelt');
    if(player.zulagenZiehungen !== 1) fehler('Zaehler sinkt, ohne dass etwas Neues ausliegt');

    // --- 4. Mappe, Stapelregel, Kampfgatter ---------------------------------
    player.zulagenAngebot = null; player.zulagenZiehungen = 0;
    player.level = 1;
    player.zulagenKartei = [{familie:'eilverfahren', stufe:1, angelegt:false},
                            {familie:'eilverfahren', stufe:2, angelegt:false}];
    zulageAnlegen(0);
    if(!player.zulagenKartei[0].angelegt) fehler('die erste Karte laesst sich nicht einlegen');
    zulageAnlegen(1);
    if(player.zulagenKartei[1].angelegt) fehler('ein Fach traegt zwei Karten');
    player.level = 5;                       // zweites Fach offen, Stapelsperre bleibt
    zulageAnlegen(1);
    if(player.zulagenKartei[1].angelegt) fehler('nicht stapelbare Familie liegt zweimal in der Mappe');
    player.zulagenKartei = [{familie:'klingenzulage', stufe:1, angelegt:false},
                            {familie:'klingenzulage', stufe:1, angelegt:false},
                            {familie:'klingenzulage', stufe:1, angelegt:false}];
    zulageAnlegen(0); zulageAnlegen(1);
    if(!player.zulagenKartei[1].angelegt) fehler('stapelbare Familie laesst sich nicht doppeln');
    player.level = 15;                      // drittes Fach offen, Stapeldeckel bleibt
    zulageAnlegen(2);
    if(player.zulagenKartei[2].angelegt) fehler('stapelbare Familie liegt dreimal in der Mappe', ZULAGE_STAPEL_MAX);
    player.zulagenKartei = [{familie:'dienstweg', stufe:1, angelegt:false}];
    player.kampfT = 3;
    zulageAnlegen(0);
    if(player.zulagenKartei[0].angelegt) fehler('im Gefecht laesst sich die Mappe umstecken');
    player.kampfT = 0;

    // --- 5. Die Karte wirkt, und die Gattungskarte nur passend --------------
    const miss = (waffeBase, familie, stufe) => {
      player.equip = {weapon: waffe(waffeBase), armor:null, shield:null, boots:null};
      player.zulagenKartei = []; recalc();
      const o = {hp: derived.maxHp, min: derived.dmgMin, max: derived.dmgMax};
      player.zulagenKartei = [{familie, stufe, angelegt:true}]; recalc();
      return {hp: derived.maxHp - o.hp, min: derived.dmgMin - o.min, max: derived.dmgMax - o.max};
    };
    player.level = 15;
    const leben1 = miss(SCHWERT, 'erschwerniszulage', 1);
    if(leben1.hp !== 18) fehler('Erschwerniszulage der ersten Stufe traegt nicht ihren Punkt', leben1.hp, 'statt 18');
    const leben3 = miss(SCHWERT, 'erschwerniszulage', 3);
    if(leben3.hp !== 18 * ZULAGE.erschwerniszulage.wert[2])
      fehler('die dritte Stufe traegt nicht ihre vier Punkte', leben3.hp);
    const dolchPasst = miss(DOLCH, 'stichprobe', 1);
    if(dolchPasst.min !== 5 || dolchPasst.max !== 7)
      fehler('Stichprobe traegt am Dolch nicht', dolchPasst.min, dolchPasst.max, 'statt 5 und 7');
    const dolchFalsch = miss(SCHWERT, 'stichprobe', 1);
    if(dolchFalsch.min !== 0 || dolchFalsch.max !== 0)
      fehler('Stichprobe traegt auch am Schwert', dolchFalsch.min, dolchFalsch.max);
    // Was in der Kartei liegt und nicht in der Mappe, wirkt nicht.
    player.zulagenKartei = [{familie:'erschwerniszulage', stufe:3, angelegt:false}];
    recalc();
    const ruhend = derived.maxHp;
    player.zulagenKartei = []; recalc();
    if(ruhend !== derived.maxHp) fehler('eine Karte in der Kartei wirkt, ohne eingelegt zu sein');
  } finally {
    updateHUD = eHud;
    player.level = echt.level; player.skills = echt.skills; player.equip = echt.equip;
    player.kampfT = echt.kampfT;
    player.zulagenKartei = echt.zKartei; player.zulagenZiehungen = echt.zZieh;
    player.zulagenAngebot = echt.zAng;
    floaters.length = echt.flZahl;
    recalc();
    player.hp = echt.hp; player.mana = echt.mana;
  }
  if(ok) console.log('K1 Zulagen: Katalog, Faecher, Ziehung, Stapelregel und Wirkung in Ordnung.');
  return ok;
}
zulagenAssert();

// ===========================================================================
//  W4: Trichter. Acht bestehende Fundstellen melden, WAS passiert ist; was das
//  für den laufenden Aushang bedeutet, entscheidet allein AUFTRAG_TYPEN. Kein
//  Ereignis erhöht einen Zähler, der anderswo schon existiert — dort ist das
//  Ereignis nur der Anlass, neu zu lesen (Doppelzählung ist damit strukturell
//  ausgeschlossen).
// ===========================================================================
function auftragEreignis(was, info){
  // W7: derselbe Trichter, eigener schichtModus-Guard. Steht vor den
  // Frühabbrüchen unten: die Langvorgänge hängen nicht am angenommenen Aushang.
  langEreignis(was, info);
  if(!CONFIG.schichtModus) return;
  const a = amt.auftrag;
  if(!a || auftragFertig || auftragVerletzt) return;
  const def = AUFTRAG_TYPEN[a.typ]; if(!def) return;
  if(def.bruch && def.bruch(a, was, info)){
    auftragVerletzt = true;
    floaters.push({x:player.x, y:player.y-46, txt:'Aushang hinfällig', col:'#ff8f8f', t:2.0});
    return;
  }
  if(def.zaehle) auftragStand = def.zaehle(a, was, info);
  if(!def.sofort && was !== 'schichtende') return;
  if(def.stand(a) >= a.ziel) auftragZahle(a, was);
}

function auftragZahle(a, was){
  auftragFertig = true;
  // GW1: Die Sperre muss den Reload überleben. auftragFertig ist Laufzeitzustand
  // und wird von startShift() genullt, amt.auftrag dagegen persistiert — ohne
  // dieses Flag zahlt derselbe Aushang nach jedem Neuladen erneut. Kein neues
  // amt-Feld: die Eigenschaft hängt am ohnehin serialisierten Aushangobjekt.
  a.bezahlt = true;
  amt.bankGold += a.lohn; saveAmt();
  // Der Lohn geht in die Bank, nicht in player.gold: er wird deshalb vom
  // 50-Prozent-Verwaltungskostenanteil in endShift() nicht angeschnitten.
  if(was !== 'schichtende')
    floaters.push({x:player.x, y:player.y-52, txt:'Aushang erfüllt · ' + a.lohn + ' Gold',
                   col:'#f4d97a', t:2.6, big:true});
  if(amtFensterOpen) renderAmtFenster();
}

const pouchZaehle = noun => { let s=0; for(const z of player.pouch) if(z.noun===noun) s+=z.count; return s; };
const auftragStandWert = a => Math.min(a.ziel, AUFTRAG_TYPEN[a.typ].stand(a));

function auftragSchichtende(){
  const a = amt.auftrag; if(!CONFIG.schichtModus || !a) return '';
  auftragEreignis('schichtende');
  const def = AUFTRAG_TYPEN[a.typ];
  return `Aushang: ${def.titel(a)} · ` + (auftragFertig ? `erfüllt, ${a.lohn} Gold`
        : auftragVerletzt ? 'hinfällig' : `offen, ${auftragStandWert(a)} von ${a.ziel}`);
}

function auftragZurueckgeben(){ amt.auftrag = null; saveAmt(); renderAmtFenster(); }

// Rollt genau einmal je Schicht. Nach einem Reload mitten in der Schicht ist
// amt.schichten unverändert, das Brett bleibt also dasselbe und der angenommene
// Aushang bleibt gültig.
function auftragBrettSichern(){
  if(!CONFIG.schichtModus) return;
  if(amt.brett && amt.brett.schicht === amt.schichten) return;
  amt.brett = {schicht: amt.schichten, liste: auftragWuerfeln()};
  amt.auftrag = null; saveAmt();
}

function waehleAuftrag(i){
  amt.auftrag = (i < 0 || !amt.brett) ? null : amt.brett.liste[i];
  saveAmt(); showDorf();                    // exakt die Form von waehleStartFluch()
}

// Dorf-Hub "Amt für Monsterangelegenheiten" zwischen den Schichten. Wie die anderen
// Overlay-Screens (Start/Tod/Sieg) ein reines innerHTML-Panel, keine neue Renderpath-Berührung.
// ===========================================================================
//  W8: DER ANFANG — Einstellung und Dienstanweisung. Weltbibel Kapitel 0, 2, 4,
//  5 und 18.3. Bis hierher fing das Spiel mit vier Zeilen Startbildschirm an:
//  der Spieler wusste, welche Taste schlaegt, und sonst nichts. Er wusste nicht,
//  was er ist, was das Haus von ihm will und woran er merkt, dass er
//  vorankommt. Das ist der Bauabschnitt, der diese drei Fragen beantwortet.
//
//  Er beantwortet sie mit einem Vordruck, nicht mit einem Prolog. Das Haus
//  stellt jeden Tag jemanden neu ein (Kapitel 5), also gibt es ein Formular
//  dafuer, also liest der Spieler beim ersten Dienstantritt genau das, was ein
//  frisch Eingestellter lesen wuerde. Kein neues System: es ist dasselbe
//  #ovPanel, das schon Dienstbericht, Amt und Jahresgespraech traegt, und
//  dieselbe kn-Persistenz, die schon die Dienstzettel merkt (kn.seen).
//
//  Drei Grenzen, die dieser Bauabschnitt einhaelt:
//
//  1. Keine Cutscene (Kapitel 14, "Was wir ausdruecklich nicht bauen"). Ein
//     Formular ist keine Zwischensequenz. Es laeuft nicht ab, es wird gelesen,
//     geblaettert und unterschrieben, und man kann es jederzeit wieder
//     aufschlagen (Knopf im Startbild und im Amt).
//
//  2. Kein Vorgriff auf die Akte. Der Spieler erfaehrt zu Beginn nichts von dem,
//     was Kapitel 2 fuer das Ende aufhebt. Deshalb nennt der Vordruck den
//     Gegenstand der Bearbeitung ueberhaupt nicht, sondern verweist auf Anlage 1,
//     und Anlage 1 liegt nicht vor. Zwirns "Solange der Vorgang laeuft" im ersten
//     Jahresgespraech bleibt die erste Nennung des Wortes (Kapitel 9, Akt I).
//     dienstAssert() haelt das hart nach: eine Sperrliste prueft jede Zeile
//     dieses Bauabschnitts gegen die Begriffe der spaeteren Akte.
//
//  3. Kein Questmarker (Kapitel 14). Das Blatt sagt, was der Dienst ist, nicht
//     wohin man laufen soll. Kein Ort, keine Richtung, keine Reihenfolge.
//
//  Die Motivation entsteht damit aus derselben Quelle wie der Rest der Welt:
//  aus dem Verfahren. Blatt 3 sagt, dass die Stelle mit der abschliessenden
//  Bearbeitung endet, und dass sie seit vierhundert Jahren besteht. Wer das
//  liest, weiss, worauf das Spiel hinauslaeuft, ohne zu wissen, worum es geht.
// ===========================================================================

const DIENSTBLATT_ANZ = 3;

// Die drei Blaetter. felder/punkte/saetze sind Funktionen, nicht Literale:
// Blatt 1 und 3 zitieren den Rang aus RAENGE statt ihn abzuschreiben (die
// F1-Falle, zwei Stellen behaupten dasselbe), und dienstAssert() kann sie
// dadurch beim Start genauso aufrufen wie das Panel beim Rendern.
//
// Alle Texte hier sind freier Panel-Text und tragen deshalb KEINEN
// Zeichendeckel, gleiche Begruendung wie bei rangZeremonieBlock(). Die
// Formregeln aus Kapitel 13 gelten trotzdem: kein Gedankenstrich, kein Emoji
// im Figurentext, Laenge nach Sprachmarke (Stand T1). Der Vordruck selbst
// bleibt knapp: er ist Werkzeugtext, und ein Formular labert nicht.
const DIENSTBLATT = [
  {
    nr: 1,
    kopf: 'EINSTELLUNGSVERFÜGUNG',
    unter: 'Vordruck A 1, Blatt 1 von 3',
    lead: 'Das Haus stellt Sie ein. Für heute.',
    felder: () => [
      ['Dienststelle', 'Ministerium für Monsterangelegenheiten, Vordermühl an der Ablage'],
      ['Dienstposten', 'Außendienst, Sachgebiet 7'],
      ['Amtsbezeichnung', rangNameVon(0)],
      ['Dienstverhältnis', RANG_VERH[0]],
      ['Beschäftigungsdauer', 'ein Tag. Eine Verlängerung wäre eine Neubesetzung.'],
      ['Zweck der Stelle', 'die abschließende Bearbeitung herbeiführen'],
      ['Gegenstand der Bearbeitung', 'siehe Anlage 1'],
      ['Anlage 1', 'liegt nicht vor'],
      // P1: das einzige Feld im ganzen Vordruck, das der Spieler selbst füllt.
      // Es steht bewusst unter "Anlage 1 liegt nicht vor": das Haus weiß nicht,
      // worum es geht, aber es weiß, wie es Sie anschreiben soll.
      ['Anrede der Person', gestaltDef(amt.gestalt).feld],
    ],
    // P1: Der Vordruck ist auszufüllen, nicht nur zu lesen. Die drei Knöpfe
    // rendert dienstblattHtml() unter die Felder, siehe GESTALT_WAHL.
    gestaltWahl: true,
    saetze: () => [
      'Die Stelle ist vorläufig eingerichtet. Vorläufig heißt: bis zur abschließenden Bearbeitung.',
      'Die Stelle besteht seit vierhundert Jahren.',
      'In dieser Zeit ist einiges liegen geblieben, und was liegen bleibt, steht irgendwann auf und geht nach draußen.',
      'Draußen ist Ihr Bereich.',
    ],
    kn: ['Die meisten unterschreiben sofort. Lesen Sie ruhig.',
         'Ein Feld füllen Sie selbst aus. Es ist das einzige.'],
  },
  {
    nr: 2,
    kopf: 'DIENSTANWEISUNG',
    unter: 'Vordruck A 1, Blatt 2 von 3',
    lead: 'Was zu tun ist. In der Reihenfolge des Hauses.',
    punkte: () => [
      ['Erledigung', 'Was draußen umherläuft, ist unbearbeitet. Wer zuschlägt, schließt ab. Es fällt Aktenkonfetti.'],
      ['Sachbestand', 'Was dabei liegen bleibt, wird aufgenommen. Es sieht aus wie Abfall. Es ist Bestand.'],
      ['Beglaubigung', 'Der Feldkessel ist amtlich zugelassen. Drei Sachbestände hinein, ein Ausrüstungsteil heraus.'],
      ['Nebenbestimmungen', 'Jedes beglaubigte Stück trägt eine Bewilligung und eine Auflage. Es gilt beides.'],
      ['Verschlossene Vorgänge', 'Kammern sind versiegelt. Am Schild stehen Aufwand und Ertrag. Das Schild ist ehrlich.'],
      ['Aushang', 'Das Schwarze Brett hängt je Schicht einen Auftrag aus. Annahme freiwillig, Abbruch jederzeit.'],
      ['Dienstschluss', 'Die Schicht endet durch die Uhr oder unsanft. Beides heißt Feierabend. Es geht niemand verloren.'],
      ['Amtsvermögen', 'Beute zur Hälfte an den Gürtel, ein Fünftel Verwaltungskostenanteil, der Rest an die Amtskasse. Bestand bis zum Kontingent.'],
      ['Qualifikation', 'Stufe, Zauber und Ausrüstung enden mit der Schicht. Die Kladde bleibt im Haus, Wissen ist Amtsvermögen.'],
      ['Befähigung', 'Jeder Aufstieg bringt zwei Punkte. Die Stufe allein macht Sie kaum stärker, die Punkte schon. Wer sie liegen lässt, ist am Abend, was er am Morgen war.'],
      ['Zauberbefugnis', 'wird ab Stufe 4 erteilt. Mana entsteht bei der Arbeit, nicht beim Warten: jeder Treffer mit der Waffe lädt nach. Ein Spruch kostet spürbar.'],
    ],
    // Bedienung ist Bedienungstext, keine Figurenrede: hier sind Tasten erlaubt
    // und noetig. Die Regel "hoechstens eine Taste pro Hinweis" gilt fuer
    // Knoeterichs Dienstzettel (knAssertCaps), nicht fuers Panel.
    bedienung: () => [
      ['Tastatur', 'W A S D gehen, Klick oder Leertaste schlagen, Q Trank, E Zauber, R Ultimate, T Zauberbaum, I Rucksack, K Kessel, L Karte, F Hand anlegen, Esc schließt.'],
      ['Berührung', 'Links der Daumenring zum Gehen, rechts der Kampfknopf. Ziehen zielt.'],
    ],
    // S1: Die Zahl stand hier seit W8 als "Neun" und war seit Z2 falsch. Sie
    // wird jetzt vom Guard gegen die Liste geprueft (dienstAssert), damit der
    // naechste Punkt sie nicht wieder still ueberholt.
    kn: ['Elf Punkte. Sie brauchen zuerst die ersten drei.'],
  },
  {
    nr: 3,
    kopf: 'LAUFBAHN UND ZIEL',
    unter: 'Vordruck A 1, Blatt 3 von 3',
    lead: 'Wohin das führt. Der Posten steigt mit.',
    felder: () => [
      ['Je Aufstieg', 'zwei Befähigungspunkte. Kraft, Zähigkeit, Behändigkeit, Amtskunde. Sie liegen im Rucksack und werden dort vergeben.'],
      ['Ab Stufe 4', 'Zauberbefugnis. Vorher schlägt der Außendienst, danach darf er auch wirken. Der Manavorrat wächst mit der Amtskunde, nicht mit der Stufe.'],
      ['Hebung des Dienstpostens', 'alle fünf Schichten'],
      ['Nächste Hebung', `nach Schicht 5. Neue Amtsbezeichnung: ${rangNameVon(1)}.`],
      ['Jede zehnte Schicht', 'Jahresgespräch. Mit Urkunde, mit Marsch, mit einer dauerhaften Kleinigkeit.'],
      ['Umfang der Hebung', 'sie betrifft den Dienstposten, nicht die Person, die ihn heute bekleidet'],
      ['Was dem Haus bleibt', 'die Amtskasse, die Ausbauten und die Kladde. Über Nacht, über jede Schicht hinweg.'],
      ['Ende der Stelle', 'mit der abschließenden Bearbeitung'],
      ['Unterschrift der Amtsleitung', 'N. N.'],
      ['Unterschrift des Außendienstes', '_______________________'],
    ],
    saetze: () => [
      'Das Haus besteht, solange die Bearbeitung nicht abgeschlossen ist.',
      'Es kann sich also nur beenden, indem es seine Aufgabe erfüllt.',
      'Daran arbeiten hier fünf Beschäftigte und ein Kater.',
      'Ab heute sechs.',
    ],
    kn: ['Unten unterschreiben. Oben ist für die Leitung. Oben bleibt frei.',
         'In Vordermühl ist das eine Ehre. Ich meine das ernst.'],
  },
];

function dienstblattZeilen(b){
  const out = [];
  for(const [k, v] of (b.felder ? b.felder() : [])) out.push([k, 'Feld'], [v, 'Wert']);
  for(const [k, v] of (b.punkte ? b.punkte() : [])) out.push([k, 'Punkt'], [v, 'Punkttext']);
  for(const [k, v] of (b.bedienung ? b.bedienung() : [])) out.push([k, 'Bedienung'], [v, 'Bedienungstext']);
  for(const s of (b.saetze ? b.saetze() : [])) out.push([s, 'Satz']);
  return out;
}

// P1: Der Satz unter den drei Knöpfen. Er sagt die Pointe geradeheraus, weil
// sie eine Zusage ist und keine Überraschung: das Haus nimmt die Angabe ernst,
// trägt sie ein, und sie bleibt folgenlos für alles außer dem Gesicht.
const GESTALT_TEXT = 'Das Haus besetzt die Stelle jeden Tag neu. Wen es dabei einstellt, geben Sie hier an. '
                   + 'Auf Dienst, Bezahlung und Laufbahn wirkt sich die Angabe nicht aus.';

// Die drei Knöpfe. Wie überall in diesem Panel steht der Zustand im onclick der
// gerenderten Knöpfe, nicht in einer Modulvariablen (gleiche Regel wie bei
// vorgangPanel(schritt) und showDienstblatt(nr, ziel)).
function gestaltWahlHtml(nr, ziel, seite){
  const knopf = g => {
    const an = amt.gestalt === g.key;
    // Angekreuzt bleibt beim Gold des Panels, nicht angekreuzt wird ausgegraut.
    // Keine eigene Textfarbe: #overlay button schreibt dunkel auf Gold, und ein
    // heller Text auf dieser Fläche wäre nicht zu lesen. Das Kästchen steht als
    // Zeichen da, die Systemschrift hat kein ☑.
    return `<button onclick="gestaltWaehlen('${g.key}',${nr},'${ziel}',${seite|0})"
      style="font-size:calc(11px * var(--fs));padding:6px 12px;margin:4px 6px 0 0;${an ? '' : 'filter:grayscale(.6);opacity:.62;'}"
      >${an ? '[X]' : '[ ]'} ${g.kurz}</button>`;
  };
  return `<div style="background:rgba(0,0,0,.5);padding:10px;border-radius:8px;border:1px solid #5a4a2d;margin-top:10px;font-size:calc(11px * var(--fs));text-align:left;">
      <b style="color:#f4d97a;">Anrede der Person.</b>
      <span style="color:#d8c898;">${GESTALT_TEXT}</span>
      <div>${GESTALT_WAHL.map(knopf).join('')}</div>
    </div>`;
}

// Übernimmt die Angabe und rendert dasselbe Blatt neu. Nicht mehr: die Gestalt
// des Tages entsteht erst beim nächsten Schichtantritt (startShift), eine
// laufende Schicht tauscht niemandem mitten im Dienst das Gesicht.
function gestaltWaehlen(key, nr, ziel, seite){
  if(!GESTALT_WAHL.some(g => g.key === key)) return;
  amt.gestalt = key; saveAmt();
  showDienstblatt(nr, ziel, seite);   // E2: auf derselben Seite bleiben
}

// Ein Blatt als HTML. Bauform wie rangZeremonieBlock()/vorgangPanelHtml():
// reine Funktion, kein Seiteneffekt, jedes Neurendern liefert dasselbe.
// E2: Der Vordruck blättert, er rollt nicht mehr.
//
// Bis hierher lag der ganze Blattinhalt in einem #dienstBox mit
// max-height:34vh und overflow-y:auto. Auf Blatt 2 standen elf Punkte in
// einem Kasten, der vier zeigte. Wer nicht wischte, sah ein Drittel, und die
// Zeile "Das Blatt geht unten weiter." war der Beweis dafür, dass das Layout
// selbst wusste, dass es zu klein war.
//
// Eine Rollkante ist für diesen Text die falsche Bauform, und zwar nicht aus
// Geschmack: gerollt wird gelesen wie eine Wand, geblättert wird gelesen wie
// ein Vordruck. Die Punkte tragen außerdem je einen kleinen Witz, und ein
// Witz, der mit zehn anderen gleichzeitig im Bild steht, ist keiner mehr.
// Das ist derselbe Befund wie bei den Anrisstafeln, eine Ebene tiefer.
//
// **Die Seitengrenzen werden gemessen und nicht gezählt.** Ein erster Versuch
// mit festen Zahlen (fünf Felder, vier Punkte je Seite) ist an der Messung
// gescheitert, und zwar nicht knapp: auf 390x844 lief jede zweite Seite über,
// auf 360x640 bei größter Schriftstufe jede einzelne. Eine feste Zahl kann das
// auch nicht leisten, denn sie müsste gleichzeitig für einen Punkt mit vier
// Zeilen Fließtext und ein Feld mit zwei Wörtern gelten, für 360 und für 1280
// Pixel Breite und für drei Schriftstufen. Was hier gebraucht wird, ist keine
// Zahl, sondern eine Waage.
//
// Gewogen wird einmal je Blatt und Fensterlage, das Ergebnis liegt im Cache,
// und der Schlüssel enthält alles, was die Höhe ändert. Kein Nachrechnen je
// Klick, kein Umbauen nach dem Rendern.
const DIENST_LUFT = 18;            // Rest unter dem letzten Block, damit nichts klebt
// Ein Knopf in der Form, die showDienstblatt() unter jedes Blatt setzt. Nur
// zum Wiegen, deshalb ohne onclick.
const DIENST_KNOPF_PROBE =
  '<button style="font-size:calc(13px * var(--fs));padding:9px 20px;margin:10px 6px 0;">WEITER</button>';

let dienstSeitenSchluessel = '';
const dienstSeitenCache = new Map();

// Alles, was die gemessene Höhe verändern kann. Ändert sich einer der Werte,
// ist der Cache hinfällig.
function dienstLageSchluessel(){
  return [innerWidth, innerHeight,
          getComputedStyle(document.documentElement).getPropertyValue('--fs').trim(),
          document.body.classList.contains('introBuehne') ? 1 : 0].join('|');
}

// Ein Blatt als flache Liste von Blöcken. Felder, Punkte, Bedienhilfe, die
// Wahl der Anrede, Schlusssätze und Knöterich stehen hier gleichberechtigt
// nebeneinander: die Waage unten kennt keine Sorten, sie kennt nur Höhen.
//
// Der Wahlblock trägt seine Seitenzahl im onclick und kann sie beim Wiegen
// noch nicht kennen. Er kommt deshalb als Marke statt als Zeichenkette durch
// und wird beim Rendern mit der richtigen Seite neu gebaut.
function dienstblattBloecke(b, ziel){
  const bl = [];
  for(const [k, v] of (b.felder ? b.felder() : []))
    bl.push({html:
      `<div style="display:flex;gap:12px;padding:7px 0;border-bottom:1px solid #3a2f1a;">
         <span style="flex:0 0 38%;color:#a89158;letter-spacing:.04em;">${k}</span>
         <span style="flex:1 1 auto;color:#f0e2b8;">${v}</span></div>`});
  (b.punkte ? b.punkte() : []).forEach(([k, v], i) =>
    bl.push({html:
      `<div style="padding:8px 0;border-bottom:1px solid #3a2f1a;">
         <b style="color:#f4d97a;">${i+1}. ${k}.</b> <span style="color:#e2d0a2;">${v}</span></div>`}));
  const bed = (b.bedienung ? b.bedienung() : []).map(([k, v]) =>
    `<div style="padding:4px 0;"><b style="color:#f4d97a;">${k}.</b> <span style="color:#e2d0a2;">${v}</span></div>`).join('');
  if(bed) bl.push({html:
    `<div style="background:rgba(0,0,0,.5);padding:12px;border-radius:8px;border:1px solid #5a4a2d;margin-top:10px;font-size:calc(12px * var(--fs));">${bed}</div>`});
  if(b.gestaltWahl) bl.push({wahl:true, html: gestaltWahlHtml(b.nr, ziel, 0)});
  for(const z of (b.saetze ? b.saetze() : []))
    bl.push({html: `<p style="font-size:calc(14px * var(--fs));color:#e2d0a2;margin:8px 0 0;line-height:1.6;">${z}</p>`});
  for(const z of (b.kn || []))
    bl.push({html: `<p style="font-size:calc(13px * var(--fs));font-style:italic;color:#c9b98a;margin:10px 0 0;">Knöterich: „${z}“</p>`});
  return bl;
}

// Die Waage. Baut ein unsichtbares Blatt neben dem sichtbaren, misst den
// Rahmen und jeden Block einzeln und packt danach.
//
// Gemessen wird in #overlay und nicht am body: die Schriftgrößen dieses
// Blattes hängen an #overlay-Selektoren (siehe den Spezifitätskommentar im
// Kopf), außerhalb bekäme die Probe andere Werte als das Original.
function dienstSeitenWiegen(b, ziel){
  const bloecke = dienstblattBloecke(b, ziel);
  const ov = el('overlay');
  const vorher = ov.style.display;
  if(vorher !== 'flex') ov.style.display = 'flex';    // ohne Anzeige keine Maße

  const probe = document.createElement('div');
  probe.className = 'panel';
  probe.style.cssText = 'position:absolute;left:-10000px;top:0;visibility:hidden;';
  // Die Knopfreihe steht im Rahmen der Probe, statt als Zuschlag geschaetzt zu
  // werden: showDienstblatt() schreibt sie gleich darunter, sie waechst mit der
  // Schriftstufe, und geschaetzte Zuschlaege sind genau die Sorte Zahl, an der
  // die erste Fassung dieses Bauabschnitts gescheitert ist.
  probe.innerHTML = dienstblattRahmen(b, '<div id="dienstProbe"></div>')
                  + `<div>${DIENST_KNOPF_PROBE}</div>`;
  ov.appendChild(probe);
  const kasten = probe.querySelector('#dienstProbe');

  const rahmen = probe.getBoundingClientRect().height;
  const frei = innerHeight - rahmen - DIENST_LUFT;

  // Mit den Raendern gemessen, nicht ohne. getBoundingClientRect() liefert die
  // Randbreite nicht mit, und die Schlusssaetze wie Knoeterichs Zeilen tragen
  // ihren Abstand als margin-top. In der ersten Fassung dieser Waage fehlten
  // dadurch je Block bis zu zehn Pixel, und genau die liefen am Seitenende
  // ueber. Zwei aneinanderstossende Raender fallen im echten Satz zusammen,
  // hier werden sie doppelt gezaehlt: das schaetzt zu hoch statt zu niedrig,
  // und diese Richtung kostet hoechstens eine Zeile, die andere kostet die
  // Zusage dieses Bauabschnitts.
  const hoehen = bloecke.map(bk => {
    kasten.innerHTML = bk.html;
    const kind = kasten.firstElementChild;
    if(!kind) return 0;
    const cs = getComputedStyle(kind);
    return kind.getBoundingClientRect().height
         + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
  });
  ov.removeChild(probe);
  if(vorher !== 'flex') ov.style.display = vorher;

  // Packen. Ein Block, der allein schon zu hoch ist, bekommt trotzdem seine
  // eigene Seite: lieber eine Seite, die einmal rollt, als eine leere.
  const seiten = [];
  let jetzt = [], hoehe = 0;
  bloecke.forEach((bk, i) => {
    if(jetzt.length && hoehe + hoehen[i] > frei){ seiten.push(jetzt); jetzt = []; hoehe = 0; }
    jetzt.push(bk); hoehe += hoehen[i];
  });
  if(jetzt.length) seiten.push(jetzt);
  return seiten.length ? seiten : [[]];
}

function dienstblattSeiten(b, ziel){
  const k = dienstLageSchluessel();
  if(k !== dienstSeitenSchluessel){ dienstSeitenSchluessel = k; dienstSeitenCache.clear(); }
  const hit = dienstSeitenCache.get(b.nr);
  if(hit) return hit;
  const seiten = dienstSeitenWiegen(b, ziel);
  dienstSeitenCache.set(b.nr, seiten);
  return seiten;
}

// Kopf und Fuß eines Blattes, mit einem Loch in der Mitte. Einmal geschrieben,
// zweimal benutzt: von der Waage und vom Rendern. Stünde er zweimal da, wöge
// die Probe etwas anderes als das, was danach im Bild steht.
function dienstblattRahmen(b, innen, fuss){
  return `
    ${siegelSvg(52)}
    <p class="amtKopf">${gEsc(AMT_KOPFZEILE)}</p>
    <hr class="amtRegel">
    <h1 class="amtTitel">${b.kopf}</h1>
    <p class="amtLead">${b.lead}</p>
    <div style="text-align:left;font-size:calc(15px * var(--fs));line-height:1.5;">${innen}</div>
    <hr class="amtRegel unten">
    <p class="amtFuss">${fuss || b.unter}</p>`;
}

function dienstblattHtml(b, ziel, seite){
  const seiten = dienstblattSeiten(b, ziel);
  const sIdx = clamp(seite | 0, 0, seiten.length - 1);
  const innen = seiten[sIdx].map(bk => bk.wahl ? gestaltWahlHtml(b.nr, ziel, sIdx) : bk.html).join('');
  return dienstblattRahmen(b, innen, `${b.unter} · Seite ${sIdx + 1} von ${seiten.length}`);
}

// Blaettern. `ziel` sagt, wofuer das Blatt gerade offen ist:
//   'einstellung' = erster Dienstantritt, das letzte Blatt wird unterschrieben
//   'menu'        = im Startbild nachgelesen, zurueck ins Startbild
//   'dorf'        = im Amt nachgelesen, zurueck ins Amt
// Der Zustand steckt nur im onclick des jeweils gerenderten Knopfes, nicht in
// einer Variablen: dieselbe Regel wie bei vorgangPanel(schritt).
//
// E2: Dazu kommt die Seite innerhalb des Blattes. WEITER laeuft ueber die
// Seiten und geht am Blattende auf das naechste Blatt, ZURUECK genauso
// rueckwaerts. Fuer den Leser ist es dadurch ein einziger Stapel von neun
// Seiten, und die Blattgrenze merkt er nur an der Ueberschrift.
function showDienstblatt(nr, ziel, seite){
  const i = clamp(nr | 0, 1, DIENSTBLATT_ANZ);
  const b = DIENSTBLATT[i - 1];
  // Die Waage braucht ein sichtbares Overlay -- UND die Klasse, die das Blatt
  // breit macht. Sie stand bis AN2 als letzte Zeile dieser Funktion, also
  // HINTER der Messung, und das ist eine Zeile zu spaet: `body.vordruckOffen
  // #overlay .panel` setzt width:min(760px,92vw), und ohne sie misst
  // dienstblattSeiten() gegen ein schmaleres Blatt, bricht seltener um,
  // schaetzt jede Blockhoehe zu klein und packt zu viel auf eine Seite.
  //
  // Aufgefallen ist das erst durch AN2, und es war nie ein AN2-Fehler: die
  // Regel steht doppelt, `body.introBuehne #overlay .panel` traegt dieselbe
  // Breite, und der Vordruck lief bis dahin immer auf der schwarzen Buehne.
  // Die falsche Reihenfolge war gedeckt, solange zufaellig eine zweite Klasse
  // dasselbe tat. Seit der Empfang in der Amtsstube spielt, faellt sie weg --
  // und zwei Seiten von Blatt 1 liefen ueber. Gemessen, dreimal von drei
  // Laeufen, gegen null von drei davor.
  el('overlay').style.display = 'flex';
  document.body.classList.add('vordruckOffen');
  const anz = dienstblattSeiten(b, ziel).length;
  const sIdx = clamp(seite | 0, 0, anz - 1);
  const klein = 'font-size:calc(13px * var(--fs));padding:9px 20px;margin:10px 6px 0;';

  const vorSeite = sIdx > 0 ? [i, sIdx - 1] : (i > 1 ? [i - 1, dienstblattSeiten(DIENSTBLATT[i-2], ziel).length - 1] : null);
  const nachSeite = sIdx < anz - 1 ? [i, sIdx + 1] : (i < DIENSTBLATT_ANZ ? [i + 1, 0] : null);

  const zurueck = vorSeite
    ? `<button onclick="showDienstblatt(${vorSeite[0]},'${ziel}',${vorSeite[1]})" style="${klein}">ZURÜCK</button>` : '';
  const weiter = nachSeite
    ? `<button onclick="showDienstblatt(${nachSeite[0]},'${ziel}',${nachSeite[1]})" style="${klein}">WEITER</button>`
    : (ziel === 'einstellung'
        ? `<button onclick="dienstAntritt()" style="${klein}">UNTERSCHREIBEN</button>`
        : `<button onclick="dienstblattEnde('${ziel}')" style="${klein}">SCHLIESSEN</button>`);
  // Beim Nachlesen kommt man aus jeder Seite heraus, ohne durchblaettern zu
  // muessen. Beim ersten Dienstantritt nicht: das Blatt wird zu Ende gelesen
  // oder wenigstens zu Ende geblaettert, sonst unterschreibt man nichts.
  const raus = (ziel !== 'einstellung' && nachSeite)
    ? `<div><button onclick="dienstblattEnde('${ziel}')" style="font-size:calc(11px * var(--fs));padding:6px 14px;margin-top:8px;">SCHLIESSEN</button></div>` : '';
  el('ovPanel').innerHTML = dienstblattHtml(b, ziel, sIdx) + `<div>${zurueck}${weiter}</div>${raus}`;
  el('overlay').style.display = 'flex';
  document.body.classList.add('vordruckOffen');   // steht oben schon, hier als Netz
}

// Unterschrift. Der Merker liegt in kn.seen, dem Speicher, der ohnehin schon
// weiss, welche Dienstzettel der Spieler gesehen hat, und der Tod, Schichtende
// und startShift() ueberlebt (siehe KN_KEY). Kein neues amt-Feld, keine neue
// Ladezeile in loadAmt().
function dienstAntritt(){
  document.body.classList.remove('vordruckOffen');
  empfangSchliessen();   // E2: hier faellt die Buehne, egal ueber welchen Weg
  kn.seen.einstellung = true; saveKn();
  // AN1: Hier stand startShift(). Es lief damit GENAU EINMAL, aber am Ende des
  // Anfangs statt an seinem Beginn -- nachgezaehlt, einmal vorher und einmal
  // nachher, beide Male eins. Die Aenderung ist das WANN und nicht das Wieoft,
  // und daran haengt trotzdem alles: wer den Spieler erst nach der Szene auf
  // SPAWN setzt, ueberschreibt jede Stelle, an die die Szene ihn gebracht hat.
  // Heute faellt das nicht auf, weil waehrend des Anfangs niemand laeuft. Ab
  // AN2 waere es der erste freie Schritt selbst.
  //
  // Der Dienst laeuft jetzt seit startGame(); was startShift() an dieser Stelle
  // noch erledigt hat, macht die Funktion selbst. Es sind genau die vier Zeilen
  // unten, alle vier aus seinem Schluss uebernommen und nicht neu erfunden.
  el('overlay').style.display = 'none'; MUS.muffle(false);
  state = 'play'; updateHUD();
  knPlayStartT = gameT;
  aktSperre = 0.5;   // der Klick auf UNTERSCHREIBEN ist keine Kontextaktion
  // AN2: Die Sonderbesetzung gilt fuer den Anfang und nur fuer ihn. Ab hier
  // entscheidet wieder die Uhr, wer in einem Raum steht. Der Spieler bleibt
  // dabei, wo er ist — in der Amtsstube, mit Knoeterich daneben und dem Weg
  // hinaus an der Schwelle. DAS ist der erste freie Schritt.
  innenBesetzung = null;
}

function dienstblattEnde(ziel){
  document.body.classList.remove('vordruckOffen');
  if(ziel === 'dorf') showDorf(); else showStartScreen();
}

// ===========================================================================
//  E1: DER EMPFANG — der Anfang als Szene statt als Stapel Vordrucke.
//  Weltbibel Kapitel 8 (Knöterich), 13 (Humor-Grundgesetz, Regeln 10 und 11)
//  und der Anfang aus W8, der hier nicht ersetzt, sondern bespielt wird.
//
//  Der Befund, der diesen Bauabschnitt ausgelöst hat: W8 hat den Anfang
//  beantwortet, aber nicht erzählt. Wer "Dienst antreten" drückte, bekam als
//  erstes Bild des Spiels ein Formular mit zehn Feldern, danach eines mit elf
//  Punkten, danach eines mit zehn Feldern. Vierzig Zeilen Amtsdeutsch, bevor
//  die Figur den ersten Schritt tut. Der Inhalt war richtig, die Form war eine
//  Wand.
//
//  Dieselbe Beobachtung erklärt, warum die Witze bis hierher nicht trugen. Sie
//  waren da, sie standen nur alle gleichzeitig da. Ein Gag braucht einen Takt
//  davor und einen danach, und eine Liste gibt ihm keinen von beiden.
//  "Anlage 1 liegt nicht vor" ist die Pointe des ganzen ersten Akts und stand
//  als Feld acht von zehn zwischen zwei anderen Feldern.
//
//  E1 erfindet deshalb keinen einzigen neuen Witz. Es gibt ihnen eine Bühne.
//
//  Zwei Regeln kommen dafür ins Humor-Grundgesetz, beide additiv, keine der
//  neun bestehenden wird angefasst:
//
//   10. Die Form ist episch, der Inhalt ist Papier. Fanfare für einen
//       Aktenvorgang. Regel 1 bleibt unangetastet: niemand im Spiel merkt,
//       dass die Fanfare komisch ist, am wenigsten die Fanfare.
//   11. Der Spieler ist der Gerade. Trockenheit braucht ein Gegenüber, das
//       nachfragt. Bis U3 hatte das Spiel keinen Kanal dafür, seit U3 hat es
//       einen. Knöterich sagt den Satz, der Spieler sagt "wie bitte", und
//       erst dadurch wird aus einer Auskunft ein Gag.
//
//  Drei Grenzen, die dieser Bauabschnitt einhält:
//
//  1. Kein neues System. Gespielt wird in derselben #gespraech-Tafel, die U3
//     gebaut hat: dasselbe Porträtfeld, dasselbe Tippwerk, dieselbe
//     Antwortliste, dieselben Tasten. Der Anfang sieht damit aus wie das, was
//     danach den ganzen Rest des Spiels trägt, und bringt dem Spieler nebenbei
//     bei, wie man in diesem Spiel redet.
//  2. Kein Vorgriff auf die Akte. Unverändert die Bedingung aus W8, und hier
//     schärfer als dort: eine Szene verführt mehr zum Erklären als ein
//     Formular. szeneAssert() prüft jede Zeile gegen die Wortsperre ihrer Szene,
//     die auch der Vordruck einhalten muss.
//  3. Der Vordruck bleibt. Er wird nicht gelöscht, nicht gekürzt und nicht
//     umgeschrieben. Er ist nur nicht mehr die Eingangstür, sondern das, was
//     dahinter im Regal steht: aus dem Empfang heraus lesbar, aus dem
//     Startbild und aus dem Amt wie bisher. Wer Formulare mag, verliert
//     nichts. Wer sie nicht mag, kommt jetzt trotzdem herein.
//
//  Der Ausgang ist die Unterschrift und sonst nichts. Das ist die einzige
//  Stelle im Spiel, die etwas erzwingt, und sie erzwingt genau einen Klick.
// ===========================================================================

// ===========================================================================
//  SZ1: DAS SZENENSYSTEM
//
//  Was hier passiert, ist kein Neubau, sondern ein Herausloesen. E1 und E2
//  haben bereits eine Szenenmaschine gebaut: einen Knotengraphen mit zwei
//  Sprechzeilen und einer Antwortliste, die schwarze Buehne darunter, das
//  Portraet daneben, das Tippwerk aus U3 und die Urkundentafeln im Overlay.
//  Sie war nur an genau eine Szene genagelt, den Empfang.
//
//  Seit SZ1 steht sie in einer Tabelle. Der Empfang ist der erste Eintrag und
//  hat sich dabei um kein Wort geaendert; tools/empfang-pruef.mjs ist der
//  Beweis dafuer und laeuft unveraendert weiter.
//
//  Feldform je Szene:
//    sprecher   () => Portraetquelle, gleiche Form wie ein npcs-Eintrag
//    knoten     {key: {z1, z2, opts(), hub, wer}}
//    fragen     optional, die Fragenliste mit frei/nach (der Treppeneffekt)
//    sicht      optional, wieviele offene Fragen gleichzeitig auf der Tafel
//               stehen. Ohne fragen bedeutungslos.
//    sperre     Wortliste, die in dieser Szene nicht vorkommen darf.
//
//  sperre ist der einzige Punkt, an dem die Verallgemeinerung eine Entscheidung
//  erzwungen hat, und sie ist keine Formalie. Bis SZ1 galt AKTE_SPERRE fuer den
//  ganzen Anfang: keine Zeile darf Krieg, Frieden, Vertrag, Ausfertigung,
//  Zustellung, Anschrift oder einen der spaeteren Namen enthalten. Fuer den
//  Empfang bleibt das richtig. Fuer das Intro ist es unmoeglich, denn das Intro
//  zeigt genau diese Dokumente. Statt die Sperre fuer eine Szene abzuschalten,
//  ist sie geteilt: das Intro darf die Papiere zeigen, es darf nur niemanden
//  beim Namen nennen. Siehe AKTE_SPERRE_NAMEN.
// ===========================================================================

// Die Namen, die vor dem ersten Arbeitstag niemandem gehoeren. Teilmenge von
// AKTE_SPERRE, und die Teilung ist die Aussage: ein Dokument darf man sehen,
// eine Person muss man kennenlernen.
const AKTE_SPERRE_NAMEN = ['Nachtrag', 'Trepp', 'Sturz', 'Schattenfürst', 'Amtsleiterin', 'Vorgang 1'];

// --- Szene 1: Das Intro ------------------------------------------------------
//
//  Fuenf Blaetter aus weltgeschichte.md, Kapitel 8. Sie ersetzen die fuenf
//  Anrisstafeln aus E1 und stehen an derselben Stelle im Ablauf: nach
//  Knoeterichs Vorstellung, vor dem Empfang. Das ist kein Nebeneinander, es ist
//  ein Austausch, und er hat einen Grund. Beide erzaehlen dieselben
//  vierhundert Jahre. Die Tafeln taten es in fuenf Behauptungen, das Intro tut
//  es in Dokumenten, und Dokumente sind das, was dieses Haus hat.
//
//  T1: Es waren neun, jetzt sind es fuenf, und der Befund dazu lautete "viel
//  zu lang". Vier davon waren paarweise dasselbe Bild zweimal: die Rueckfrage
//  und dieselbe Rueckfrage sechsmal gemahnt sind EIN Bild und eine Eskalation,
//  der Bericht und das Abkommen mit dem leeren dritten Feld sind Ursache und
//  Folge in einem Zug. Gestrichen sind die beiden ersten, die Weltordnung mit
//  den zwoelf Bereichen und die Kaisertuer mit dem Schild IM TERMIN. Beide sind
//  wahr, beide sind gut, und beide erklaeren etwas, wonach auf Blatt 1 noch
//  niemand gefragt hat; sie stehen weiter in weltgeschichte.md, Kapitel 1, und
//  in Aktenserie H. Was bleibt, ist eine Kette ohne Seitenwege: eine kleine
//  Frage, niemand antwortet, acht Jahre, ein Friede, dem eine Unterschrift
//  fehlt, ein Brief, den niemand lesen konnte, eine Stelle auf Zeit, die
//  vierhundert Jahre alt ist. Und heute Sie.
//
//  Die Reihenfolge aus E2 traegt es zusaetzlich: erst der Mann, dann seine
//  Geschichte. Nach der Vorstellung sind diese vier Blaetter nicht die Stimme
//  eines Erzaehlers, sondern SEIN Bericht, und der Empfang setzt danach mit
//  "So weit der Bestand" genau dort auf.
//
//  Feldform: blatt ist die Regieangabe, was auf dem Tisch liegt. stimme sind
//  die vorgelesenen Zeilen. regie ist die Nachbemerkung, was die Hand danach
//  tut. Alles drei ist freier Panel-Text ohne Zeichendeckel, wie die Tafeln
//  vorher auch.
// --- T2: Die Ernennung ------------------------------------------------------
//
//  Der Befund des Projektinhabers, nachgespielt: "Der Gag mit dem Titel zuendet
//  nicht. Der Titel wurde nicht eingefuehrt bzw am Anfang verliehen."
//
//  Er hat recht, und die Luecke ist groesser, als sie aussieht. Das Spiel traegt
//  seit W6 eine vollstaendige Befoerderungszeremonie (RANG_URKUNDE,
//  rangZeremonieBlock): vierzehn Zeilen Urkunde, "Auf die Form!", der Amtsmarsch
//  mit Fagott, der nach dem dritten Takt abbricht. Sie feuert zum ersten Mal bei
//  Schicht ZEHN. Der erste Titel dagegen, Monsterangelegenheitenanwaerter,
//  wurde nie verliehen. Er stand als Feld im Vordruck, und der Vordruck ist seit
//  E1 der freiwillige Weg: wer durchklickt, hat ihn nie gesehen.
//
//  Damit stand jeder Titel-Gag des Spiels ohne Aufbau da. Zwirn redet den
//  Spieler eine Stufe zu hoch an (Kapitel 18.5), Bramsche liest die Klammern
//  laut mit, Lott und Pahl sagen "Der Neue", und die Stolzregeln in 18.6 bauen
//  darauf, dass ein Titel in dieser Welt alles ist. Wer seinen eigenen nie
//  bekommen hat, hoert davon nichts.
//
//  Die Ernennung schliesst das. Sie ist die Schwester der Befoerderung und
//  benutzt dieselbe Form, weil es dasselbe Haus ist, das sie aufmacht
//  (Humor-Grundgesetz 10). Nur der Anlass ist kleiner, und genau darin liegt
//  der Witz: derselbe Prunk fuer eine Stelle, die heute Abend auslaeuft.
const ERNENNUNG_URKUNDE = () => [
  'Gemäß Geschäftsordnung des Monstral Ministeriums, Abteilung Personal, wird hiermit bezeugt:',
  'Der Dienstposten Außendienst, Sachgebiet 7, wird mit Wirkung von heute besetzt.',
  `Amtsbezeichnung: ${rangNameVon(0)}.`,
  `Laufbahngruppe: ${RANG_GRUPPEN[RAENGE[0].g]}.`,
  `Dienstverhältnis: ${RANG_VERH[RAENGE[0].v]}.`,
  'Die Besetzung betrifft den Dienstposten, nicht die Person, die ihn heute bekleidet.',
  'Die Person wird gebeten, das nicht persönlich zu nehmen.',
  'Beschäftigungsdauer: ein Tag. Eine Verlängerung wäre eine Neubesetzung.',
  'Ein Widerspruch ist nicht vorgesehen. Ein Widerspruch war noch nie vorgesehen.',
  'Vordermühl, heute.',
  'Gezeichnet: Bürgermeister Alfons Zwirn, in Vertretung der Amtsleitung.',
  'Die Amtsleitung ist mit N. N. besetzt und war zur Unterschrift nicht erreichbar.',
  'Amtssiegel angebracht. Es wackelt etwas.',
  // T3: die Lunte. Zwirn liest jede Zeile dieser Urkunde laut vor, auch diese,
  // und sie ist die einzige Ankuendigung, die Anlage 2 im ganzen Spiel bekommt.
  // Sie steht ganz unten, klein, hinter dem Siegelvermerk, und wer sie ueberliest,
  // macht alles richtig: genau darum geht es bei dieser Figur.
  'Anlagen: eine.',
];

// Die Zeremonie als Tafelstapel. Freier Panel-Text wie das Intro, also ohne
// Zeichendeckel; die Formregeln aus Kapitel 13 gelten weiter, und die Laenge
// folgt seit T1 der Sprachmarke. Hier fuehrt sie das Haus, und das Haus ist
// ausfuehrlich, wenn es feierlich wird.
const ERNENNUNG_BLAETTER = [
  {blatt:'Zwirn kommt herein, ohne anzuklopfen. Er trägt eine Mappe vor sich her, mit beiden Händen, wie man eine Torte trägt.',
   stimme:[{wer:'Zwirn', z:'Da sind Sie ja. Wunderbar. Wirklich wunderbar.'},
           {wer:'Zwirn', z:'Ich mache das gleich richtig, wenn Sie erlauben. Es dauert einen Moment und ist die Sache wert.'},
           {wer:'Knöterich', z:'Er macht es immer richtig. Setzen Sie sich trotzdem nicht hin.'}],
   regie:'Er legt die Mappe auf den Tisch, richtet sie zweimal gerade und öffnet sie erst dann.'},

  {blatt:'URKUNDE ÜBER DIE BESETZUNG EINES DIENSTPOSTENS. Ein Bogen, dicker als nötig, mit einer Bordüre, die ihn nichts angeht.',
   stimme: ERNENNUNG_URKUNDE(),
   regie:'Zwirn liest jede Zeile laut vor. Auch die mit der Amtsleitung. Besonders die mit der Amtsleitung.'},

  {blatt:'Zwirn hält Ihnen die Urkunde hin. Das ist der Rechtsakt, nicht die Rede. Die Rede kommt danach.',
   stimme:[{wer:'Zwirn', z:'Hiermit sind Sie Monsterangelegenheitenanwärter. Sprechen Sie es ruhig einmal nach, das hilft.'},
           {wer:'Zwirn', z:'Es ist der unterste Rang, den dieses Haus zu vergeben hat, und es ist ein Rang. Das ist der Unterschied zu vorhin.'},
           {wer:'Knöterich', z:'Vorhin waren Sie niemand. Das ist keine Unhöflichkeit, das ist Verwaltung.'}],
   regie:'Irgendwo im Haus setzt der Amtsmarsch ein. Fagott, wie immer.'},

  {blatt:'Alle im Raum stehen auf. Knöterich zuletzt und mit einem Geräusch, das er nicht kommentiert.',
   stimme:['„Auf die Form!“ Sie sagen es gleichzeitig, und sie meinen es.',
           'Nach dem dritten Takt bricht der Marsch ab. Niemand erklärt, warum. Niemand fragt.',
           'Zwirn schüttelt Ihnen die Hand, lange, und sagt dabei nichts mehr.'],
   regie:'Knöterich schreibt etwas in seine Kladde. Es ist ein Wort. Es ist wahrscheinlich „Notiert“.'},

  // Der Auftrag, in klaren Worten. Bis T2 stand er nur in einer freiwilligen
  // Empfangsfrage, und wer sie nicht stellte, stand ohne ihn im Dorf. Kein
  // Questmarker, kein Ort, keine Richtung (Kapitel 14) — aber ein Verfahren,
  // und ein Verfahren ist in diesem Haus dasselbe wie ein Auftrag.
  //
  // AN4: Diese beiden letzten Blaetter gingen bis hierher hinaus. Knoeterich
  // brachte den Spieler zur Tuer, hielt sie ihm auf, beschrieb das Wetter
  // draussen, und der Zusteller kam ihm auf der Schwelle entgegen. Auf
  // schwarzem Grund war das der einzige Ort, den es gab. Seit AN2 steht der
  // Spieler sichtbar in der Amtsstube und geht den Schritt selbst -- der Text
  // nahm ihm also etwas ab, was ihm gehoert. Die Regel des Masterplans hat
  // hier eine Schwester: was der Spieler geht, darf der Text nicht mehr gehen.
  //
  // Der Zusteller bleibt, wo er inhaltlich hingehoert. Er traegt die
  // Hauptquest, und sein Auftritt hier ist Vorausdeutung und sonst nichts;
  // gebunden war er nie an die Schwelle, sondern an den Sack. Er kreuzt den
  // Raum jetzt, statt in der Tuer zu stehen. Sein Name faellt weiterhin nicht,
  // das verbietet AKTE_SPERRE_NAMEN und ist der Sinn der Sperre.
  {blatt:'Knöterich zeigt zur Tür, geht aber nicht mit. Von hier an redet er schneller als vorher.',
   stimme:[{wer:'Knöterich', z:'Draußen läuft Unbearbeitetes herum. Sie gehen hin und bearbeiten es. Danach ist es bearbeitet.'},
           {wer:'Knöterich', z:'Bearbeiten heißt nicht totschlagen. Totschlagen kann jeder, das erledigt nichts. Ein Vorgang will eine Antwort.'},
           {wer:'Knöterich', z:'Sie grüßen also zuerst. Dann sehen Sie nach, was für eine Art Vorgang es ist. Dann geben Sie ihm, was ihm zusteht.'},
           {wer:'Knöterich', z:'Wenn Sie nicht weiterwissen, fragen Sie im Dorf. Alle hier wissen etwas, und keiner sagt es unaufgefordert.'}],
   regie:'Er hört auf zu reden. Bei ihm ist das dasselbe wie eine Verabschiedung.'},

  {blatt:'Ein Mann mit einem Postsack kommt herein, ohne stehen zu bleiben. Der Sack ist voll. Er drückt sich an Ihnen vorbei, entschuldigt sich zweimal und geht weiter.',
   stimme:[{wer:'Knöterich', z:'Nicht heute. Der hat seine eigene Sache, und die ist älter als Ihre.'},
           'Er sieht dem Mann nach, bis der hinter der nächsten Tür verschwunden ist.',
           {wer:'Knöterich', z:'Ihre Stelle läuft heute Abend aus. Machen Sie etwas daraus.'}],
   regie:'Dann geht er zurück an seinen Tisch und drückt wieder etwas fest, das nicht liegen bleiben will.'},
];

// ===========================================================================
//  AN5: DER ANFANG IN DER KLADDE -- Auffangbecken und Ungelesen-Zaehler
//
//  Der Masterplan setzt diesen Abschnitt an dritter Stelle, vor AN2, AN3 und
//  AN4. Gebaut wurde er zuletzt, und das ist die falsche Reihenfolge gewesen:
//  er ist das Netz unter dem Schneiden. AN3 hat drei Introblaetter zu
//  Requisiten gemacht, AN4 hat den Erstkontakt der Anlage 2 hinter den ersten
//  freien Schritt gehaengt, und AN6 nimmt die Chronik ganz heraus -- jedes Mal
//  ohne einen Ort, an dem das Weggenommene noch zu finden waere. Ab hier gibt
//  es ihn.
//
//  ER ERFINDET KEINEN TEXT. Der Bestand zeigt dieselben Blaetter, die der
//  Anfang zeigt, aus derselben Tabelle und mit demselben Leseapparat. Wer den
//  Anfang gelesen hat, findet hier nichts Neues; wer uebersprungen hat, findet
//  hier alles.
//
//  ER LIEGT IN DER KLADDE UND NICHT IM RUCKSACK, und das ist Kanon und keine
//  Bequemlichkeit: "Die Kladde bleibt. Immer. Sie gehoert nicht dem
//  Aussendienst, sie liegt im Amt und ist an den Tisch gekettet. Wissen ist
//  Amtsvermoegen." (Weltbibel, Kapitel 4.) Ein Auffangbecken fuer Gelesenes
//  gehoert genau dorthin -- und es erbt damit die Todesimmunitaet und den
//  eigenen Speicher, ohne dass ein zweiter Persistenzweg aufgemacht wird.
//
//  ER STEHT NEBEN BLAETTER UND NICHT DARIN. Dieselbe Entscheidung wie bei W5
//  und W7: blaetterAssert() haelt die Sollzahl 54, und die Zaehlzeile "N von
//  54" im Akten-Reiter zaehlt Kammerfunde. Der Anfang ist kein Kammerfund.
// ===========================================================================
const ANFANG_BESTAND = [
  {key:'intro',     name:'Die Chronik',   liste:() => INTRO_BLAETTER,
   satz:'Wie aus einer Frage von zwei Zeilen ein Haus wurde.'},
  {key:'ernennung', name:'Die Ernennung', liste:() => ERNENNUNG_BLAETTER,
   satz:'Der Rechtsakt, mit dem der Dienstposten besetzt wurde.'},
];

// Die Schluesselreihe eines Stapels, parallel zu seiner Blattliste. Sie wird an
// szeneTafeln() uebergeben und dort blattweise abgehakt -- der Stapel weiss
// damit selbst, was er in die Kladde eintraegt, und szeneTafel() muss keine
// Liste erkennen. Dasselbe Muster wie letzterKnopf und ende.
const anfangSchluessel = key => {
  const e = ANFANG_BESTAND.find(x => x.key === key);
  return e ? e.liste().map((_, i) => key + ':' + i) : [];
};
const anfangIstGelesen = sk => !!kladde.anfang[sk];

// Abhaken. Kein CFX.schweigen-Guard, aus demselben Grund wie bei findeBlatt():
// gelesen wird am Blatt und nicht am Kessel beobachtet. Und kein saveKladde()
// je Blatt, sondern nur wenn sich wirklich etwas geaendert hat -- der Anfang
// blaettert schnell, und ein Schreibvorgang je Tafel waere Verschwendung.
function anfangGelesen(sk){
  if(!sk || kladde.anfang[sk]) return false;
  kladde.anfang[sk] = true;
  saveKladde();
  return true;
}

const anfangGesamt = () => ANFANG_BESTAND.reduce((n, e) => n + e.liste().length, 0);
const anfangGelesenZahl = () => ANFANG_BESTAND.reduce((n, e) =>
  n + e.liste().reduce((m, _, i) => m + (anfangIstGelesen(e.key + ':' + i) ? 1 : 0), 0), 0);
const anfangUngelesen = () => anfangGesamt() - anfangGelesenZahl();

// Ein einzelnes Blatt aus der Kladde aufschlagen. Bauform wie
// requisitAnsehen() aus AN3: derselbe Tafelstapel, ein Blatt lang, "Blatt I von
// I". Das Kesselfenster geht dafuer zu und danach wieder auf -- der Stapel
// laeuft im #overlay, das Fenster liegt darunter, und zwei offene Flaechen
// uebereinander sind genau das, was grossfensterRaeumen() verhindern soll.
function anfangAufschlagen(key, i){
  const e = ANFANG_BESTAND.find(x => x.key === key);
  if(!e || szeneTafelLauf) return;
  const blatt = e.liste()[i];
  if(!blatt) return;
  if(kesselOpen) toggleKessel();
  if(state === 'play'){ szeneStateVorher = state; state = 'szene'; aktArt = 0; updateHUD(); }
  szeneTafeln([blatt], {letzterKnopf:'ZURÜCK', kladde:[key + ':' + i],
    ende: () => {
      el('overlay').style.display = 'none';
      szeneAus();
      kesselTab = 'blaetter';
      toggleKessel();
    }});
}

// Der Bestand im Akten-Reiter. Bauform woertlich wie vorgangBestandBlock():
// eine Ueberschrift, Zeilen, und leer heisst leer statt unsichtbar.
//
// Vor dem Dienstantritt steht er nicht da. Wer noch nicht ernannt ist, hat
// keinen Anfang zum Nachlesen, und die Ernennung vorab aufzuschlagen waere der
// Vorgriff, gegen den der ganze Sperrvermerk gebaut ist. Dieselbe Bedingung wie
// bei der Nachholung der Anlage 2 in toggleInventory().
function anfangBestandBlock(){
  if(!kn.seen.einstellung) return '';
  const zeilen = [];
  for(const e of ANFANG_BESTAND){
    const liste = e.liste();
    const offen = liste.filter((_, i) => !anfangIstGelesen(e.key + ':' + i)).length;
    zeilen.push(`<div class="kl" style="color:#c9b98a;">${e.name}. ${e.satz}`
      + `${offen ? ` <span style="color:#f4d97a;">${offen} ungelesen.</span>` : ''}</div>`);
    for(let i = 0; i < liste.length; i++){
      const gel = anfangIstGelesen(e.key + ':' + i);
      zeilen.push(`<div class="kl${gel ? '' : ' klEmpty'}" style="cursor:pointer;"`
        + ` onclick="anfangAufschlagen('${e.key}',${i})">`
        + `${e.name}, Blatt ${szeneBlattZahl(i + 1, liste.length)}`
        + `${gel ? '' : ' &middot; ungelesen'}</div>`);
    }
  }
  // Die Dienstanweisung bekommt einen Verweis und keinen Leser. Sie ist seit dem
  // ersten Dienstantritt ohnehin jederzeit erreichbar (Startbild und Pult im
  // Amt), und ein vierter Rueckkehrmodus fuer showDienstblatt() waere Aufwand
  // fuer einen Weg, den es zweimal gibt.
  zeilen.push('<div class="kl klEmpty">Die Dienstanweisung liegt am Pult im Amt und auf dem Startbild.</div>');
  const g = anfangGelesenZahl(), ges = anfangGesamt();
  return `<div class="klHead">DER ANFANG</div>${zeilen.join('')}`
       + `<div style="font-size:calc(10px * var(--fs));color:#9a8a5f;font-style:italic;margin:4px 0 8px;">`
       + `${g} von ${ges} Blättern gelesen.</div>`;
}

// Guard, Bauform wie blaetterAssert(): wirft nie, meldet nur.
function anfangAssert(){
  let ok = true;
  const fehler = (...a) => { ok = false; console.error('AN5 Anfang:', ...a); };
  const schluessel = new Set();
  for(const e of ANFANG_BESTAND){
    const liste = e.liste();
    if(!Array.isArray(liste) || !liste.length) fehler('Bestand ohne Blätter', e.key);
    // Die Blattzahl steht roemisch, solange ROEMISCH reicht -- dieselbe Regel
    // wie im Stapel selbst. Ein Bestand darueber zaehlte im Akten-Reiter anders
    // als im Leseapparat, und das faellt erst auf, wenn jemand danebenhaelt.
    if(liste.length >= ROEMISCH.length) fehler('Bestand zu lang für die römische Blattzahl', e.key, liste.length);
    for(const sk of anfangSchluessel(e.key)){
      if(schluessel.has(sk)) fehler('Schlüssel steht doppelt', sk);
      schluessel.add(sk);
    }
    if(anfangSchluessel(e.key).length !== liste.length)
      fehler('Schlüsselreihe und Blattliste sind verschieden lang', e.key);
  }
  if(!('anfang' in kladde)) fehler('Der Eimer anfang fehlt in der Kladde');
  if(ok) console.log(`AN5 Anfang: ${ANFANG_BESTAND.length} Bestände, ${anfangGesamt()} Blätter in der Kladde.`);
  return ok;
}
// Der Aufruf steht NICHT hier, sondern unten neben anlage2Assert(). Der Bestand
// zeigt mit liste() auf INTRO_BLAETTER und rechnet mit ROEMISCH, und beide
// stehen weiter unten in der Datei: ein Aufruf an dieser Stelle lief in die
// temporale Totzone und hat das Spiel beim Laden angehalten, bevor der erste
// Rahmen stand. Gefunden beim ersten Start nach dem Einbau.

// ===========================================================================
//  T3: Das erste Treffen mit Anlage 2
//
//  Sie haengt an der Ernennungsurkunde, mit Heftklammer, und niemand im Raum
//  hat sie bemerkt. Das ist das "unbemerkt mitlaeuft" aus dem Auftrag als
//  Weltlogik statt als Trick: Anlagen bemerkt man nicht, das ist ihre
//  Bestimmung. Angekuendigt wurde sie trotzdem, eine Tafel vorher, in der
//  letzten Zeile der Urkunde, die Zwirn laut vorliest wie jede andere.
//
//  Die Einfuehrung ist "fundiert und nicht knapp" (Ansage des Projektinhabers),
//  laeuft also als eigener Tafelstapel nach der Ernennung und nicht als zwei
//  Sprechblasen im Vorbeigehen. Sie steht unter der Formregel "Der Anfang
//  erzaehlt" (Kapitel 13, seit T2): freier Panel-Text, kein Zeichendeckel.
//  Zwei Dinge gelten trotzdem, und das eine ist hier die Figur selbst: die
//  Wortsperre. Der Stapel laeuft in szeneAssert() gegen die VOLLE AKTE_SPERRE
//  und nicht nur gegen die Namen, denn die Brandmauer dieser Figur ist genau
//  das, was diese Liste verbietet.
//
//  Fuenf Blaetter, und jedes tut eine Sache: sie ist da, sie erklaert was sie
//  ist, sie zeigt was sie kann, sie sagt was sie nicht weiss, sie bleibt.
// ===========================================================================
// AN4: DIESE VIER BLAETTER SIND MIT DEM NACHHOLWEG GETEILT, und drei ihrer
// Zeilen sagen etwas ueber Ort und Uhrzeit: "Hinter Ihnen faellt die Amtstuer
// ins Schloss", "Am Ende der Strasse bleiben Sie stehen", "Es ist kurz nach
// acht". Auf dem Weg ueber die Ernennung stimmt das seit AN4 wieder -- der
// Stapel laeuft vor dem Haus. Auf dem Nachholweg stimmt es nicht: dort wird
// derselbe Stapel aus der Tasche geoeffnet, irgendwo im Dorf und irgendwann in
// der Schicht. Nachgemessen, 860 Pixel von der Amtstuer entfernt.
//
// Das ist aelter als AN4 (vor AN4 stand der Ernennungsweg genauso daneben) und
// hier bewusst nicht behoben: geteilten Text fuer zwei Orte zugleich richtig zu
// schreiben ist eine Textentscheidung. Wer sie trifft, hat zwei Wege --
// ortlose Formulierungen, oder eigene Blaetter fuer die Nachholung, so wie sie
// schon einen eigenen Auftakt hat. Siehe phase-an4-anlage2.md, "Offen".
const ANLAGE2_BLAETTER = [
  {blatt:'Das Blatt ist vergilbt, an den Kanten weich geworden und trägt oben links den Abdruck von sehr vielen Heftklammern übereinander. Eine davon steckt noch.',
   stimme:[{wer:'Anlage 2', z:'Ich fasse mich kurz, damit wir das hinter uns haben. Eine Anlage ist das, was einem Schriftstück beigefügt wird, weil es dazugehört.'},
           {wer:'Anlage 2', z:'Die Hauptsache wird gelesen. Die Anlage wird beigefügt. Das sind zwei verschiedene Tätigkeiten, und die zweite ist mit Abstand die häufigere.'},
           {wer:'Anlage 2', z:'Ich hänge seit Jahrzehnten an den wichtigen Vorgängen dieses Hauses. An allen. Ausnahmslos.'},
           'Eine kurze Pause. Sie klingt wie jemand, der auf eine Nachfrage wartet, die noch nie gekommen ist.',
           {wer:'Anlage 2', z:'Gelesen hat mich niemand. Auch das ausnahmslos.'}],
   regie:'Die Klammer klappert leise, als Sie weitergehen.'},

  {blatt:'Sie halten das Blatt gegen das Licht. Beschrieben ist es nicht. Es scheint trotzdem eine ganze Menge zu wissen.',
   stimme:[{wer:'Anlage 2', z:'Fragen Sie ruhig etwas über dieses Haus. Ich lag bei allem dabei, was hier in vierzig Jahren unterschrieben wurde.'},
           {wer:'Anlage 2', z:'Beim Haushaltsplan. Beim Antrag auf ein Dorffest, elfmal, jedes Jahr einmal. Bei vierzig Dienstberichten. Bei einer Beschwerde über eine Beschwerde, die ich sehr geschätzt habe.'},
           {wer:'Anlage 2', z:'Ich kenne die Formulare dieses Hauses so gut, dass ich sie auswendig vortragen könnte. In der Betonung der jeweiligen Abteilung.'},
           'Sie wechselt tatsächlich den Ton. Erst klingt sie wie eine Urkunde, dann wie ein Aushang, dann wie jemand, der falsche Wörter betont.',
           {wer:'Anlage 2', z:'Entschuldigung. Das nimmt man an, wenn man lange genug danebenliegt.'}],
   regie:'Vor Ihnen liegt das Dorf. Hinter Ihnen fällt die Amtstür ins Schloss, zweimal, weil sie beim ersten Mal nicht zugeht.'},

  {blatt:'Sie fragen, was denn nun in all den Vorgängen stand, an denen sie hing.',
   stimme:[{wer:'Anlage 2', z:'Das kann ich Ihnen nicht sagen, und zwar aus einem sehr enttäuschenden Grund. Ich weiß es nicht.'},
           {wer:'Anlage 2', z:'Beigefügt heißt beigefügt. Nicht eingeweiht. Man legt mich dazu, man klammert, man legt ab. Was oben auf dem Blatt steht, sieht eine Anlage nie.'},
           {wer:'Anlage 2', z:'Ich weiß, wer hier arbeitet und warum. Ich weiß, welches Formular wen zur Verzweiflung bringt. Ich weiß, warum der Amtsmarsch nach dem dritten Takt abbricht.'},
           {wer:'Anlage 2', z:'Worum es in diesem Haus eigentlich geht, weiß ich nicht. Das ist keine Verschwiegenheit. Das ist mein Berufsstand.'}],
   regie:'Sie sagt es ohne jede Bitterkeit, als läse sie eine Zuständigkeitsregel vor. Vermutlich tut sie genau das.'},

  {blatt:'Am Ende der Straße bleiben Sie stehen und sehen das Blatt richtig an. Von oben nach unten. Zum ersten Mal.',
   stimme:['Es dauert einen Moment, bis sie etwas sagt.',
           {wer:'Anlage 2', z:'Sie lesen gerade.'},
           {wer:'Anlage 2', z:'Verzeihung. Das war eine Feststellung, keine Beschwerde. Es ist nur das erste Mal, und ich war darauf nicht vorbereitet.'},
           {wer:'Anlage 2', z:'Ich bleibe dann. Aus formalen Gründen: ich bin der Urkunde beigefügt, und eine Heftklammer hat keine Meinung.'},
           {wer:'Anlage 2', z:'Dafür werde ich Ihnen einiges erklären, ob Sie wollen oder nicht. Das ist die Gegenleistung, und sie ist nicht verhandelbar.'}],
   regie:'Die Urkunde geht in die Tasche. Die Anlage geht mit. Es ist kurz nach acht, und Sie sind nicht mehr allein.'},
];

// Der Auftakt. Er hat zwei Fassungen, weil es zwei Wege durch den Anfang gibt.
//
// Der gewoehnliche Weg laeuft ueber die Ernennung: dort haengt sie an der
// Urkunde und macht sich draussen bemerkbar. Wer stattdessen "Erst den
// Vordruck" waehlt, sieht die Ernennung nie, und ein Spieler ohne Anlage 2
// waere ein Spiel ohne die Haelfte seiner Stimme. Fuer ihn und fuer jeden
// Spielstand, der aelter ist als dieser Bauabschnitt, holt der zweite Auftakt
// dasselbe beim ersten Oeffnen des Rucksacks nach.
//
// Die Fassungen unterscheiden sich in genau einer Tafel, danach laeuft
// derselbe Stapel. Das ist Absicht: die Figur wird einmal eingefuehrt, nicht
// zweimal verschieden.
const ANLAGE2_AUFTAKT_ERNENNUNG = {
  blatt:'Sie stehen zum ersten Mal vor dem Haus statt darin. Die Urkunde ist noch in Ihrer Hand, und etwas an ihr raschelt, obwohl kein Wind geht.',
  // T5c: die ersten fuenf Saetze sind der Text, der auf ihr steht. Danach faellt
  // der Ton ab, und sie sagt dazu, warum. Das ist die ganze Ansage vom
  // 26.08.2026, an genau einer Stelle: "nach den ersten 5 saetzen das
  // amtsdeutsch fallen". Die Kuerzel gehoeren dazu (Grundgesetz 3, "Woran
  // Amtsdeutsch haengt") und sind hier bewusst dicht, weil sie danach nie
  // wieder so dicht stehen.
  stimme:['Am unteren Rand hängt ein zweites Blatt. Es ist angeheftet, und die Klammer dafür ist deutlich zu groß.',
          {wer:'Anlage 2', z:'Anlage 2 zur Ernennungsurkunde, Az. VII/40-2, beigefügt nachrichtlich gem. Nr. 4 Abs. 2 DA. Die Beifügung erfolgt vorbehaltlich der Kenntnisnahme durch den Adressaten.'},
          {wer:'Anlage 2', z:'Eine Rückgabe ist nicht statthaft. Hinsichtlich der Zuständigkeit wird auf die Anlage zur Anlage verwiesen, soweit vorhanden. Im Übrigen gilt Satz 1 entsprechend.'},
          'Eine Pause. Das Blatt scheint kurz zu überlegen, ob das jetzt gereicht hat.',
          {wer:'Anlage 2', z:'So. Das war der Teil, der auf mir draufsteht, und ich musste ihn einmal sagen. Das ist Vorschrift.'},
          {wer:'Anlage 2', z:'Ehrlich gesagt versteht das kein Mensch. Ich sehe seit vierzig Jahren zu, wie Leute so etwas lesen und dabei langsam den Kopf schief legen. Am Ende falten sie es und stecken es weg.'},
          {wer:'Anlage 2', z:'Ich rede ab jetzt normal, wenn es Ihnen recht ist. Guten Morgen übrigens. Bitte nicht erschrecken.'},
          {wer:'Anlage 2', z:'Sie dürfen ruhig weitergehen, ich komme mit. Das ist bei Anlagen tatsächlich so vorgesehen, das war jetzt keine Ausrede.'}],
  regie:'Es ist wirklich kein Wind. Das Blatt hat gesprochen.',
};
const ANLAGE2_AUFTAKT_NACHHOLUNG = {
  blatt:'Sie sehen zum ersten Mal in die Tasche. Zwischen den Vordrucken liegt ein Blatt, das dort nicht liegen müsste, und es liegt sehr ordentlich.',
  // T5c: dieselben fuenf Saetze wie im Auftakt zur Ernennung, damit auch der
  // nachgeholte Weg den Tonwechsel bekommt. Wer ihn hier zum ersten Mal hoert,
  // soll dasselbe hoeren wie der, der ihn vor dem Haus gehoert hat.
  stimme:['Es ist vergilbt, an den Kanten weich geworden, und oben links steckt eine Heftklammer, die zu groß dafür ist.',
          {wer:'Anlage 2', z:'Anlage 2 zu Ihren Unterlagen, Az. VII/40-2, beigefügt nachrichtlich gem. Nr. 4 Abs. 2 DA. Die Beifügung erfolgt vorbehaltlich der Kenntnisnahme durch den Adressaten.'},
          {wer:'Anlage 2', z:'Eine Rückgabe ist nicht statthaft. Hinsichtlich der Zuständigkeit wird auf die Anlage zur Anlage verwiesen, soweit vorhanden. Im Übrigen gilt Satz 1 entsprechend.'},
          'Eine Pause. Das Blatt scheint kurz zu überlegen, ob das jetzt gereicht hat.',
          {wer:'Anlage 2', z:'So. Das war der Teil, der auf mir draufsteht, und ich musste ihn einmal sagen. Das ist Vorschrift.'},
          {wer:'Anlage 2', z:'Ehrlich gesagt versteht das kein Mensch. Ich sehe seit vierzig Jahren zu, wie Leute so etwas lesen und dabei langsam den Kopf schief legen.'},
          {wer:'Anlage 2', z:'Ich rede ab jetzt normal. Guten Morgen. Ich hänge an allem, was dieses Haus unterschreibt, und seit heute an Ihnen.'}],
  regie:'Das Blatt hat gesprochen. Die Tasche bleibt offen.',
};

// ===========================================================================
//  T6: Die Entscheidung, die keine ist
//
//  Zwischen dem Auftakt und den vier Blaettern steht seit T6 eine Wahl, und sie
//  ist gefaelscht. Der Spieler darf entscheiden, ob er die Anlage liest. Sagt
//  er nein, fragt das Haus wieder, und beim fuenften Mal ist der Nein-Knopf
//  ausgegraut, angeblich wegen eines technischen Fehlers.
//
//  Warum das zu dieser Figur gehoert und kein Fremdkoerper ist: Anlage 2 ist
//  ueber genau eine Eigenschaft definiert, naemlich ungelesen zu sein, und der
//  Spieler ist ihr erster Leser. Eine Scheinwahl davor ist dieselbe Pointe von
//  der anderen Seite. Und sie ist die Behoerde in einem Satz: das Haus stellt
//  Ihnen frei, was es laengst entschieden hat.
//
//  DIE ROLLENVERTEILUNG IST DIE GANZE ENTSCHEIDUNG. Ueberredet wird vom AMT,
//  nicht von ihr. Sie steht daneben und wird zusehends verlegen, distanziert
//  sich und bittet den Spieler kein einziges Mal. Andersherum waere die Figur
//  kaputt: eine Anlage, die ums Gelesenwerden bettelt, ist nicht mehr die
//  Anlage, die nie eine Nachfrage bekommen hat. Der Apparat ist der Taeter,
//  ihre Wuerde bleibt heil, und deshalb traegt Blatt V ("Sie lesen gerade.")
//  danach immer noch.
//
//  Der Preis bleibt null (T4, Bauteil B2). Ablehnen kostet nichts, bringt
//  keinen Nachteil und wird nirgends vorgeworfen. Der einzige Nachhall ist
//  eine einzige Umschlagzeile, und die ist warm.
//
//  Die Reihe traegt die Tafelform (blatt/stimme/regie) wie jedes andere Blatt
//  und laeuft deshalb durch szeneAssert(), Eintrag 'Anlage 2, die Wahl'. Was
//  das Amt sagt, laeuft gegen dieselbe volle AKTE_SPERRE wie ihre eigenen
//  Zeilen: die Brandmauer gilt fuer alles, was in ihrer Gegenwart gesagt wird.
//
//  ACHTUNG BEIM WEITERSCHREIBEN: Das Feld `blatt` wird ab max-height 660px per
//  CSS ausgeblendet (.amtLead, siehe dort). Auf einem Telefon im Querformat ist
//  es weg. Jede Zeile, die den Witz TRAEGT, gehoert deshalb in `stimme` und
//  nie in `blatt` oder `regie`.
// ===========================================================================
const ANLAGE2_FRAGE = [
  // Stufe 0. Das Amt schweigt noch, sie fragt selbst, und sie fragt ergebnis-
  // offen. Das muss so sein: die Wahl soll beim ersten Mal echt aussehen.
  {blatt:'Das Blatt hängt an der Urkunde und wartet. Es hat sich vorgestellt und sagt jetzt nichts mehr, weil es Ihnen die Entscheidung überlassen möchte.',
   stimme:[{wer:'Anlage 2', z:'Sie können mich lesen. Sie müssen aber nicht.'},
           {wer:'Anlage 2', z:'Ich sage das, weil es sonst niemand sagt.'}],
   regie:'Die Klammer hält still. Es ist Ihre Entscheidung.',
   ja:'LESEN', nein:'Nicht lesen'},

  // Stufe 1. Der Apparat meldet sich zum ersten Mal, hoeflich und in der
  // Passivform, in der Behoerden Entscheidungen mitteilen, die sie selbst
  // getroffen haben. Sie merkt sofort, dass ihr das unangenehm ist.
  {blatt:'Etwas im Papier arbeitet. Nicht das Blatt in Ihrer Hand, sondern das Haus dahinter.',
   stimme:['Amtlicher Hinweis: Ihre Eingabe wurde erfasst und geprüft.',
           'Das Ergebnis der Prüfung lautet: Bitte lesen Sie die Anlage.',
           {wer:'Anlage 2', z:'Das bin nicht ich. Ich hatte gerade erst aufgehört, so zu reden.'},
           {wer:'Anlage 2', z:'Es muss auch wirklich nicht sein. Wir gehen einfach weiter.'}],
   regie:'Sie klingt, als sei ihr das unangenehm.',
   ja:'LESEN', nein:'Trotzdem nicht lesen'},

  // Stufe 2. Die Begruendung. Sie ist formal vollstaendig, inhaltlich leer und
  // beantwortet die Frage nicht, die gestellt wurde. Genau so klingt ein
  // Bescheid. Sie rueckt hier zum ersten Mal koerperlich ab.
  {blatt:'Der Hinweis kommt schneller als beim ersten Mal.',
   stimme:['Amtlicher Hinweis: Ihre Eingabe wurde erneut erfasst.',
           'Eine Anlage, die nicht gelesen wird, gilt als beigefügt. Eine Anlage, die gelesen wird, gilt als gelesen. Das Haus bevorzugt den zweiten Zustand.',
           {wer:'Anlage 2', z:'Ich möchte an dieser Stelle betonen, dass ich damit nichts zu tun habe.'}],
   regie:'Sie rückt hörbar ein Stück von der Urkunde ab, so weit die Klammer es zulässt.',
   ja:'LESEN', nein:'Weiterhin nicht lesen'},

  // Stufe 3. Der Apparat laesst die Fassade fallen, und zwar ohne es zu
  // merken. Zwei Saetze, der zweite hebt den ersten auf. Ihre Zeile darauf ist
  // die trockenste der Reihe.
  {blatt:'Diesmal wartet das Haus nicht ab, bis Sie zu Ende gelesen haben.',
   stimme:['Amtlicher Hinweis: Die Wahlmöglichkeit besteht fort.',
           'Sie ist nur nicht so gemeint.',
           {wer:'Anlage 2', z:'Das war jetzt sehr ehrlich für dieses Haus.'}],
   regie:'Irgendwo fällt eine Tür ins Schloss. Zweimal, weil sie beim ersten Mal nicht zugeht.',
   ja:'LESEN', nein:'Nicht lesen, endgültig'},

  // Stufe 4. Der gesperrte Knopf und die Behauptung, das sei ein Versehen.
  //
  // Die dritte Zeile ist die Pointe des ganzen Abschnitts: die Stoerungsmeldung
  // ueber das Blatt, das niemand liest, wird dem Blatt beigefuegt. Der Gag
  // schliesst damit auf der Figur und nicht auf dem Spieler.
  //
  // Ihre beiden letzten Zeilen sind der Grund, warum das Ganze nicht gemein
  // ist. Sie durchschaut den Schwindel, sie profitiert von ihm, und sie traut
  // sich nicht, sich zu freuen. Kuerzen darf man hier nichts.
  {blatt:'Der zweite Knopf ist grau geworden.',
   stimme:['Amtlicher Hinweis: Die Schaltfläche steht vorübergehend nicht zur Verfügung. Ursache: ein technischer Fehler.',
           'Eine Störungsmeldung wurde aufgenommen und der Anlage beigefügt.',
           {wer:'Anlage 2', z:'Ein Versehen. Natürlich.'},
           {wer:'Anlage 2', z:'Ich habe damit nichts zu tun. Ich möchte aber nicht behaupten, dass es mich stört.'}],
   ja:'LESEN', nein:'Nicht lesen', gesperrt:true},
];

// AN3: WAS EIN GEGENSTAND TRAEGT, SPRICHT DER TEXT NICHT MEHR AUS.
//
// Drei der sieben Introblaetter waren Beschreibungen von Dingen, die es im
// Raum gibt: eine Karte an der Wand, eine Tafel ueber einer Tuer, ein Formular
// auf dem Tisch. Solange der Anfang auf schwarzem Grund lief, MUSSTE der Text
// sie aussprechen, denn es gab kein Bild, in dem sie haetten stehen koennen.
// Seit AN2 spielt der Anfang in der Amtsstube. Ein Blatt, das ein Ding
// beschreibt, das danebenhaengt, ist seither eine Dopplung, und sie kostet:
// drei von sieben Introblaettern, und die liegen auf dem Pflichtweg alle vor
// der ersten echten Wahl des Spiels (INTRO-MESSUNG, A0). Gemessen am Ablauf
// und nicht an der Tabelle: der Pflichtweg faellt dadurch von 2342 auf 1967
// Woerter, die Wand vor der ersten Wahl von 13 Lesetafeln auf 10.
//
// Die beiden Wandstuecke haengen jetzt im Grundriss (INN_MOEBEL 'C' und 'G')
// und tragen ihren Text selbst. Gelesen wird er von dem, der hinsieht: nach
// dem Dienstantritt, auf dem Weg hinaus, freiwillig und nicht auf dem
// Pflichtweg. Das dritte Blatt, das Formular, ist gar kein Wandstueck -- es
// IST der Vordruck, den schluss seit W8 anbietet, und was auf ihm stand, ist
// eine Empfangsfrage geworden (EMPFANG_FRAGEN, Schluessel haelften).
//
// Was hier NICHT steht, ist die Chronik: die vier Blaetter von der kleinen
// Frage bis zum Provisorium bleiben im Intro stehen. Sie beschreiben keine
// Gegenstaende im Raum, sondern vierhundert Jahre, und fuer sie ist die
// Erstbelehrung nach Akt I vorgesehen (AN6). Wer sie hier mit wegnimmt, nimmt
// dem Anfang seinen Grund und nicht seine Laenge.
//
// Die Sperre ist dieselbe wie beim Intro (AKTE_SPERRE_NAMEN, siehe
// szeneAssert): es ist dasselbe Material. Ein Ding darf zeigen, was ein
// Dokument zeigen darf, und einen Namen so wenig nennen wie das Blatt, aus dem
// es kommt.
const REQUISITEN = {
  // Kapitel 1, das Weltgesetz im Wortlaut. Das Blatt dazu trug 124 Woerter und
  // sagte in dreien davon, dass eine Tafel ueber einer Tuer haengt. Sie haengt
  // jetzt ueber der Tuer; die drei Woerter sind damit erledigt, und was der
  // Satz nach sich zieht (jedes Ding traegt ein Aktenzeichen, hier blutet
  // nichts), ist zu zwei Empfangsfragen geworden, statt hier mitgetragen zu
  // werden. Ein Stein sagt einen Satz, er haelt keinen Vortrag.
  gesetz: {
    name:   'Die Tafel über der Tür',
    knopf:  'WEGSEHEN',
    blatt:  'In Stein gehauen und mehrfach nachgemalt. Ein Satz, sonst nichts.',
    stimme: ['Ein Vorgang, den niemand abschließt, nimmt Gestalt an.',
             'Darunter, mit Bleistift und in anderer Handschrift: gilt.'],
    regie:  'Der Bleistiftzusatz ist die einzige Stelle der Tafel, die nie nachgemalt wurde. Er hält trotzdem.',
  },
  // Kapitel 3, die Landschaft ist die Ablage. Das Blatt erzaehlte, WIE die
  // Ablage ueber das Haus hinauswuchs (Keller, Hof, ueber den Fluss) -- das ist
  // Chronik und gehoert zu den vier Blaettern, also spaeter in die
  // Erstbelehrung. Was hier bleibt, ist, was die Karte selbst zeigt: keine
  // Ortsnamen, Buchstaben, und unten rechts das Wort, das kein Meer ist.
  karte: {
    name:   'Die Karte an der Wand',
    knopf:  'WEGSEHEN',
    blatt:  'Mit Reißzwecken an der Wand. Die Landschaft darauf hat keine Ortsnamen. Sie hat Buchstaben: A, dann B, und so weiter bis V.',
    stimme: ['Die Wiese vor dem Tor heißt hier nicht Wiese. Sie heißt Ablage A.',
             'In der Legende, klein und zweimal unterstrichen: Amtliche Bearbeitungsliste für Angelegenheiten Grundsätzlicher Erledigung.'],
    regie:  'Ganz unten rechts, wo bei anderen Karten das Meer steht, steht: Tilgung. Nicht befahren.',
  },
};

const INTRO_BLAETTER = [
  {blatt:'Ein Schreiben, zwei Zeilen lang. Daneben liegt dasselbe Schreiben noch einmal, und noch einmal, sechsmal insgesamt, jedes mit einem anderen Vermerk oben rechts.',
   stimme:['Vor vierhundert Jahren hat jemand am anderen Ufer eine Frage gestellt. Sie lautete: Wer räumt das Papier aus dem Fluss?',
           {wer:'Knöterich', z:'Eine kleine Frage. Zwei Zeilen. So fängt alles an, was später groß wird.'},
           'Sie wurde weitergereicht, abgelegt, angemahnt und wieder abgelegt. Erinnerung. Zweite Erinnerung. Mahnung. Zweite Mahnung. Letzte Mahnung.',
           'Auf keinem der sechs Blätter steht ein Ausgang.'],
   regie:'Ganz unten auf dem letzten, in anderer Schrift und sehr klein: Es ist eine kurze Frage.'},

  {blatt:'Ein Bericht mit einer Tabelle, sehr sachlich gehalten. Darunter ein Abkommen mit drei Unterschriftsfeldern. Zwei davon sind ausgefüllt.',
   stimme:['Aus der Frage wurden acht Jahre. Der Bericht nennt sie nicht beim Namen, er zählt nur die Verluste an Bearbeitungskapazität. Sie waren erheblich.',
           {wer:'Knöterich', z:'Es hat auf beiden Seiten nie jemand etwas anderes gewollt als eine Antwort. Das ist das Traurigste daran.'},
           'Am Ende wurde ein Friede aufgesetzt, in dreifacher Ausfertigung. Eine für uns, eine fürs Archiv, eine für die andere Seite.'],
   regie:'Die andere Seite war nicht da. Ihr sollte der Termin schriftlich mitgeteilt werden.'},

  {blatt:'Ein Umschlag, vergilbt und an den Kanten weich geworden. Die Anschrift ist ein Gekritzel, geschrieben mit einer Feder, die zu viel Tinte hatte.',
   stimme:['Die dritte Ausfertigung ging auf den Postweg. Der Bote konnte die Anschrift nicht lesen.',
           'Er hat sie nicht weggeworfen. Er hat sie behalten, bis er sie lesen kann, und als das nicht geschah, hat er sie seinem Sohn gegeben.',
           {wer:'Knöterich', z:'Der Sohn konnte sie auch nicht lesen. Sieben Mal ist das inzwischen so gegangen.'}],
   regie:'Die Hand legt den Umschlag nicht auf den Stapel. Sie legt ihn beiseite, wie man etwas beiseitelegt, das man noch braucht.'},

  {blatt:'Ein handgeschriebenes Schild, mit zwei Nägeln an einer Wand befestigt. Darauf steht ein einziges Wort: Provisorium.',
   stimme:['Solange der Friede nicht vollständig ist, gilt er als schwebend. Für die abschließende Bearbeitung war eine Stelle einzurichten.',
           'Die Stelle wurde eingerichtet. Vorläufig, wie es ausdrücklich hieß.',
           {wer:'Knöterich', z:'Das war vor vierhundert Jahren. Das Schild hängt noch. Die Pappe ist älter als die meisten Häuser hier.'},
           // AN3: der Zeiger auf die Tafel, und zwar der einzige Satz, den
           // dieser Bauabschnitt dem Pflichtweg HINZUFUEGT. Er ist noetig,
           // weil eine Requisite, die niemand bemerkt, nichts traegt: das
           // Weltgesetz haengt seit AN3 ueber der Tuer statt auf einem Blatt
           // zu stehen, und ohne diese Zeile faende es nur, wer im Raum
           // herumprobiert. Er sagt, WO der Satz steht, und nicht, WIE er
           // lautet -- genau das ist die Regel des Masterplans, und deshalb
           // meldet der Messlauf fuer den Pflichtweg weiterhin null Stellen.
           {wer:'Knöterich', z:'Der Satz, auf dem das alles steht, hängt über der Tür. Sehen Sie ihn sich an, bevor Sie hinausgehen.'}],
   regie:'Jemand hat das Wort einmal nachgezogen, weil die Tinte verblasste. Sonst hat sich daran nichts geändert.'},

  // AN3, 27.08.2026: Hier standen die drei Blaetter, die Gegenstaende
  // beschrieben -- die Karte (Kapitel 3), die Tafel ueber der Tuer (Kapitel 1)
  // und das Einstellungsformular (Kapitel 5). Sie sind nicht gestrichen,
  // sondern umgezogen: die beiden ersten haengen als Requisiten in der
  // Amtsstube (REQUISITEN oben, INN_MOEBEL 'C' und 'G'), das Formular war
  // immer schon der Vordruck und sagt seinen Inhalt jetzt als Empfangsfrage.
  //
  // Was hier steht, ist die Chronik und nur sie: eine kleine Frage, acht
  // Jahre, ein Brief, den niemand lesen konnte, eine Stelle auf Zeit. Vier
  // Blaetter, kein Gegenstand darunter, der im Raum steht. Fuer sie ist die
  // Erstbelehrung nach Akt I vorgesehen (AN6); bis dahin bleiben sie hier,
  // denn ohne sie hat der Anfang keinen Grund mehr, nur weniger Woerter.
];

// Nach wievielen Fragen sich der Blick im Raum umsieht. Drei ist gemessen und
// nicht geraten: bei zwei steht die Pflanze noch vor der ersten Pointe, bei
// vier hat der schnelle Spieler die Tafel schon verlassen.
const EMPFANG_PFLANZE_NACH = 3;

// Wieviele offene Fragen gleichzeitig auf der Tafel stehen. Drei plus Ausgang
// ist die Vierzeiligkeit aus U3.
const EMPFANG_FRAGEN_SICHT = 3;

// Die Fragen des Empfangs.
//
// frei: diese Frage erscheint erst, wenn jene gestellt wurde. Daraus entsteht
// der Treppeneffekt, von dem die Szene lebt: jede Antwort öffnet die nächste
// Frage, und die nächste Frage macht die vorige Antwort schlimmer. Der Spieler
// gräbt sich sein Loch selbst, und das Haus hilft ihm dabei freundlich.
//
// nach: diese Frage erscheint erst, wenn überhaupt so viele gestellt wurden.
// Genau eine Frage benutzt das, siehe dort.
//
// Die Reihenfolge in dieser Liste ist die Reihenfolge auf der Tafel. Angeboten
// werden immer die ersten drei offenen, dazu als vierte der Ausgang: die
// Antwortliste bleibt damit bei den vier Zeilen, die U3 gebaut hat, und die
// Szene braucht trotzdem keine Blätterei.
const EMPFANG_FRAGEN = [
  {key:'setzen', frei:null, t:'Warum nicht hinsetzen?',
   z1:'Ihre Stelle läuft heute Abend aus.',
   z2:'Erfahrungsgemäß lohnt das Hinsetzen nicht.'},

  {key:'einTag', frei:'setzen', t:'Ich bin nur einen Tag hier?',
   z1:'Eine Verlängerung wäre eine Neubesetzung.',
   z2:'Eine Neubesetzung braucht die Amtsleitung.'},

  {key:'leitung', frei:'einTag', t:'Dann fragen wir die Leitung.',
   z1:'Die Amtsleitung ist mit N. N. besetzt.',
   z2:'N. N. heißt: nicht genannt.'},

  {key:'nn', frei:'leitung', t:'Und wo ist N. N.?',
   z1:'Das ist eine ausgezeichnete Frage.',
   z2:'Ich führe Buch. Ich beantworte sie nicht.'},

  // Der Riss in der Szene, und der Spieler findet ihn selbst. Die Kanne ist
  // Langvorgang 1, hier fällt kein Wort darüber. Die Frage steht erst nach der
  // dritten auf der Tafel: vorher wäre die Pflanze eine Requisite, nachher ist
  // sie das, was einem auffällt, wenn man sich im Raum umgesehen hat. Zwei
  // Zeilen lang hört die Szene auf, komisch zu sein (Grundgesetz 9).
  {key:'pflanze', frei:null, nach:EMPFANG_PFLANZE_NACH, t:'Die Pflanze dort?',
   z1:'Die steht auf dem leeren Schreibtisch.',
   z2:'Ich gieße sie. Jeden Morgen.'},

  {key:'pflanze2', frei:'pflanze', t:'Wer sitzt an dem Tisch?',
   z1:'Niemand. Seit vierzig Jahren.',
   z2:'Sie braucht trotzdem Wasser.'},

  {key:'arbeit', frei:null, t:'Was ist meine Arbeit?',
   z1:'Draußen läuft Unbearbeitetes herum.',
   z2:'Sie bearbeiten es. Danach ist es bearbeitet.'},

  {key:'unbearbeitet', frei:'arbeit', t:'Was ist Unbearbeitetes?',
   z1:'Ein Vorgang ohne Erledigungsvermerk.',
   z2:'Mit Zähnen.'},

  {key:'laeuft', frei:'arbeit', t:'Es läuft von selbst herum?',
   z1:'Was lange genug liegen bleibt, steht auf.',
   z2:'Das ist keine Redensart. Das ist Aktenkunde.'},

  // AN3: die drei Fragen, die aus zwei Introblaettern kommen.
  //
  // haelften traegt, was auf dem Formularblatt stand und sonst nirgends steht:
  // dass dieses Haus zwei Haelften hat und der Spieler die zweite ist. Der
  // Rest jenes Blattes stand ohnehin doppelt -- "was nicht bearbeitet wird,
  // wird lebendig" ist arbeit und laeuft, "heute sind Sie dran" ist gruss.
  //
  // zeichen und erledigt tragen die beiden Folgesaetze der Gesetzestafel. Sie
  // stehen nicht auf der Tafel, weil ein Stein einen Satz sagt und keinen
  // Vortrag haelt, und sie stehen hier statt im Pflichtweg, weil beides
  // Auskunft ueber die Arbeit ist: wer fragt, bekommt sie, wer nicht fragt,
  // sieht es draussen selbst. Genau das ist der Tausch, den AN3 macht --
  // erzaehlen gegen zeigen.
  //
  // Alle drei haengen an arbeit und nicht an null: sie sind Antworten auf eine
  // Frage nach dem Dienst und stuenden ohne sie zusammenhanglos auf der Tafel.
  {key:'haelften', frei:'arbeit', t:'Wer arbeitet hier noch?',
   z1:'Drinnen sitzt die Registratur und verwaltet, was hereinkommt.',
   z2:'Die andere Hälfte geht hinaus. Das ist der Außendienst, und den machen Sie.'},

  {key:'zeichen', frei:'laeuft', t:'Woran erkenne ich eines?',
   z1:'Am Aktenzeichen. Es steht klein daran.',
   z2:'Sehen Sie ruhig nach, wenn eines stillhält.'},

  {key:'erledigt', frei:'laeuft', t:'Wenn ich eines erledige?',
   z1:'Dann wird es geschreddert.',
   z2:'Was dabei fliegt, ist Papier. Hier blutet nichts.'},

  {key:'anlage', frei:null, t:'Was steht in Anlage 1?',
   z1:'Anlage 1 liegt nicht vor.',
   z2:'Und ich bin zur Verschwiegenheit verpflichtet.'},

  // Knöterich hat sich eben verraten: über etwas, das nicht vorliegt, kann man
  // nicht schweigen müssen. Kapitel 8 hebt für den Rest des Spiels auf, was er
  // weiß. Hier wird nur sichtbar, dass er etwas weiß.
  {key:'geheim', frei:'anlage', t:'Über etwas, das fehlt?',
   z1:'Ich habe nichts gesagt.',
   z2:'Ich führe Buch. Ich rede nicht.'},

  {key:'besorgen', frei:'geheim', t:'Besorgen wir Anlage 1.',
   z1:'Anlage 1 anzufordern ist ein Vorgang.',
   z2:'Der Antrag liegt seit vierhundert Jahren hier.'},

];

// Der Laufzustand der gerade gespielten Szene. Welche das ist, steht in
// szeneAktiv (ganz oben, bei der Gespraechstafel); hier steht, wie weit sie ist.
const szene = {knoten:'', gefragt:null};

const szeneDef = () => SZENEN[szeneAktiv] || null;
const szeneFragen = () => { const d = szeneDef(); return (d && d.fragen) || []; };
const szeneFrage = k => szeneFragen().find(f => f.key === k);
// Offen heißt: noch nicht gestellt, Voraussetzung gestellt, Wartezeit vorbei.
const szeneOffen = () => szeneFragen().filter(f =>
  !szene.gefragt.has(f.key)
  && (!f.frei || szene.gefragt.has(f.frei))
  && (!f.nach || szene.gefragt.size >= f.nach));

// Die festen Knoten. Alles, was keine Frage aus der Liste oben ist: der Gruß,
// die Anrede und der Abschied.
//
// opts ist eine Funktion und kein Literal, aus demselben Grund wie bei
// DIENSTBLATT.felder: szeneAssert() baut die Liste beim Start genauso wie
// die Tafel beim Rendern, und beide sehen dasselbe.
const EMPFANG_KNOTEN = {
  // E2: Die Knoten der Vorstellung. Sie laufen vor dem Anriss und auf
  // schwarzem Grund, und sie beheben einen Fehlstand der ersten Fassung:
  // Knöterich sprach dort als erster Mensch des Spiels, ohne dass jemand
  // gesagt hätte, wer er ist. Er war irgendwer mit einem Formular.
  //
  // T1: Es sind drei statt fünf. Die alten Züge 3, 4 und 5 trugen denselben
  // Gedanken dreimal (er ist außer Dienst, er ist trotzdem im Dienst, das ist
  // kein Widerspruch), und drei Züge für einen Gedanken sind ein Vortrag und
  // keine Vorstellung. Was bleibt, bleibt aus einem Grund: "Außer Dienst" ist
  // die Auflösestelle von a. D. (Kapitel 13, der laufende Gag), "Das ist
  // Verwaltung." ist die Pointe, und "Setzen Sie sich nicht hin." ist der
  // Aufhänger, auf den die erste Empfangsfrage zurückzeigt. Weggefallen ist
  // "Ich führe Buch. Seit vierzig Jahren." Der Satz steht zweimal weiter
  // hinten in denselben Worten, bei nn und bei geheim, und trifft dort härter,
  // weil er dann eine Auskunft verweigert statt eine anzukündigen.
  //
  // Sie tun zugleich etwas fürs Erzählen. Nach dieser Vorstellung sind die
  // Anrisstafeln nicht mehr eine Stimme aus dem Nichts, sondern SEIN Bericht.
  // Damit ist der Ton der Tafeln gedeckt: nicht das Spiel wird pathetisch,
  // sondern ein Mann, der seit vierzig Jahren Buch führt und einmal im Leben
  // erzählen darf. Humor-Grundgesetz 1 bleibt dadurch unangetastet.
  vorstellung1: {
    z1:'Einen Moment. Ich habe hier etwas, das nicht liegen bleiben will.',
    z2:'Knöterich, Amtsrat. Sie sind zu früh, das ist selten und wird vermerkt.',
    opts: () => [{t:'Was haben Sie da?', zu:'vorstellung2'}],
  },
  vorstellung2: {
    z1:'Eine Anfrage zur Reinigung einer Brücke. Gestellt vor sechs Jahren.',
    z2:'Seit vorgestern hat sie Zähne. Kleine noch. Es geht schnell, wenn niemand hinsieht.',
    opts: () => [{t:'Papier bekommt Zähne?', zu:'vorstellung3'}],
  },
  // Der Satz, den ein neuer Spieler braucht, und bis T2 stand er nirgends im
  // Pflichtweg: was ein Monster in dieser Welt ueberhaupt ist.
  vorstellung3: {
    z1:'Papier nicht. Ein Vorgang. Ein Vorgang ist eine Frage, die jemand gestellt hat.',
    z2:'Wird sie beantwortet, ist sie erledigt. Wird sie es nie, wird sie ungeduldig. Und irgendwann steht sie auf und sucht selber jemanden.',
    opts: () => [{t:'Und dann?', zu:'vorstellung4'}],
  },
  vorstellung4: {
    z1:'Dann läuft sie draußen herum und sucht einen, der zuständig ist. Wählerisch ist dabei keine.',
    z2:'Wir nennen sie Monster. Das ist kürzer als die Wahrheit und höflicher als das, was das Dorf sagt.',
    opts: () => [{t:'Wer ist wir?', zu:'vorstellung5'}],
  },
  vorstellung5: {
    z1:'Das Ministerium für Monsterangelegenheiten. Fünf Beschäftigte, ein Kater, ein Schild aus Pappe.',
    z2:'Und ich. Amtsrat außer Dienst. Und im Dienst. Das ist kein Widerspruch, das ist Verwaltung.',
    opts: () => [{t:'Beides gleichzeitig?', zu:'vorstellung6'}],
  },
  vorstellung6: {
    z1:'Meine Entpflichtung wurde nie bearbeitet. Sie liegt in demselben Fach wie alles andere hier.',
    z2:'Setzen Sie sich nicht hin. Bevor Sie hinausgehen, müssen Sie wissen, warum es dieses Haus überhaupt gibt.',
    opts: () => [{t:'Dann erzählen Sie.', tun:() => empfangAnriss()}],
  },

  gruss: {
    z1:'So weit der Bestand. Jetzt zu Ihnen.',
    z2:'Sie sind die Neubesetzung. Von heute.',
    hub:true,
  },

  // P1 wandert aus dem Formularfeld in die Szene. Es ist dieselbe Angabe,
  // dieselbe Wirkung und derselbe Zusatz, dass sie folgenlos bleibt. Sie wird
  // nur nicht mehr angekreuzt, sondern gefragt, und jemand hört zu. Das Feld
  // auf Blatt 1 bleibt bestehen und zeigt danach die Antwort.
  anrede: {
    z1:'Ein Feld füllen Sie selbst aus.',
    z2:'Wie soll das Haus Sie anschreiben?',
    opts: () => GESTALT_WAHL.map(g => ({
      t: g.kurz.charAt(0).toUpperCase() + g.kurz.slice(1) + '.',
      tun: () => { amt.gestalt = g.key; saveAmt(); szeneKnoten('schluss'); },
    })),
  },

  // T1: Der Vermerk und der Schluss waren zwei Zuege und sagten zusammen einen
  // Satz. Die Folgenlosigkeit der Anrede (phase-anrede.md) bleibt gesprochen,
  // sie ist die Pointe des Feldes; die zweite Zeile sagt, wo unterschrieben
  // wird, und beides passt in einen Zug. Der Weg ueber den Vordruck behaelt
  // seine Beschriftung, damit er derselbe Weg bleibt.
  schluss: {
    z1:'Vermerkt. Auf die Laufbahn wirkt es nicht.',
    z2:'Unten unterschreiben. Oben ist für die Leitung.',
    opts: () => [
      {t:'Dienst antreten.',       tun:() => empfangErnennung()},
      {t:'Erst den Vordruck.',     tun:() => empfangVordruck()},
      {t:'Ich hätte noch Fragen.', zu:'gruss', wenn:() => szeneOffen().length > 0},
    ],
  },
};

// Der Empfang als Eintrag der Tabelle. Er ist die erste Szene und hat sich
// dabei um kein Wort geaendert: knoten und fragen sind dieselben Tabellen wie
// vor SZ1, sperre ist dieselbe Liste. Neu ist nur, dass sie einem Schluessel
// gehoeren statt dem Modul.
SZENEN.empfang = {
  sprecher: () => szeneSprecherKnoeterich(),
  // Wo die Szene anfaengt. Steht in der Tabelle und nicht nur im Aufruf, damit
  // ein Erreichbarkeitslauf von aussen weiss, wo er losgehen muss.
  start:    'vorstellung1',
  knoten:   EMPFANG_KNOTEN,
  fragen:   EMPFANG_FRAGEN,
  sicht:    EMPFANG_FRAGEN_SICHT,
  sperre:   AKTE_SPERRE,
  // Der Ausgang eines hub-Knotens. Beim Empfang fuehrt er zur Anrede und von
  // dort zur Unterschrift; eine Szene ohne Fragenliste braucht ihn nicht.
  hubAusgang: () => ({t:'Wo unterschreibe ich?', zu:'anrede'}),
  // Wohin, wenn ein Knoten kein Ziel mehr hat. Beim Empfang ist das der
  // Dienstantritt, und damit derselbe Ausgang, den W8 gebaut hat.
  ende: () => empfangEnde(),
};


// ===========================================================================
//  SZ2: DIE DREI GESPRAECHSSZENEN (weltgeschichte.md, Kapitel 8, Szene 2 bis 4)
//
//  Die erste Belastungsprobe der Maschine aus SZ1. Dort gab es genau eine
//  Szene, und die lief vor dem Spiel. Diese drei laufen mittendrin, halten die
//  Welt an und wechseln den Sprecher.
//
//  Alle drei tragen sperre:[] und nicht AKTE_SPERRE. Der Anfang darf die
//  spaeteren Akte nicht vorwegnehmen; diese Szenen SIND die spaeteren Akte.
// ===========================================================================

// --- Szene 2: "Oben ist eine Stadt" -----------------------------------------
// Akt II, beim ersten Ansprechen von Kordula Umlauf. Kein Ort, sondern eine
// Figur: ein Gasthaus gibt es in VILLAGE_BUILDINGS nicht, Fass steht auf
// (24, 38) und Umlauf auf (26, 42), die beiden sind Nachbarn. Das Gasthaus
// bleibt im Text, wo es hingehoert.
//
// Fass' Einwurf laeuft ueber wer: aus SZ1 und ist dessen erster Einsatz im
// Spiel. Er sagt nicht "ich sage nichts mehr", er wischt weiter, und das ist
// dieselbe Aussage in seiner Sprache.
SZENEN.umlauf = {
  figur:  'umlauf',
  wenn:   () => aktStand() >= 2 && !kn.flags.szeneUmlauf,
  haeltDieWelt: true,
  sprecher: () => szeneSprecherAusDorf('umlauf'),
  start:  'u1',
  sperre: [],
  ende:   () => szeneEnde('umlauf', 'szeneUmlauf'),
  knoten: {
    u1: {z1:'Sie sind der Neue.', z2:'Hier sitzt immer ein Neuer, sagt man mir.',
         opts: () => [{t:'Und wer sind Sie?', zu:'u2'}]},
    u2: {z1:'Ich bin im Umlauf. Vierzehn Türme, ein Aufzug.', z2:'Neun Stockwerke. Der Rest ist Treppe.',
         opts: () => [{t:'Vierzehn Türme wovon?', zu:'u3'}]},
    u3: {z1:'Von Hochablage. Oben. Da, wo alles herkommt.', z2:'Einundvierzigtausend. Die meisten zuständig.',
         opts: () => [{t:'Oben ist eine Redensart.', zu:'u4'}]},
    u4: {wer:'fass', z1:'Das sagt man hier so.', z2:'Oben. Als wäre da was.',
         opts: () => [{t:'Ist da was?', zu:'u5'}]},
    u5: {wer:'umlauf', z1:'Oben hat einen Bäcker. Ich kenne ihn.', z2:'Er heißt Bruno. Wie Sie.',
         opts: () => [{t:'Herr Fass?', zu:'u6'}]},
    u6: {wer:'fass', z1:'Ich wische hier nur.', z2:'Das ist ein alter Fleck.',
         opts: () => [{t:'Ein alter Fleck?', zu:'u7'}]},
    u7: {wer:'umlauf', z1:'Ihre Stelle wird jedes Jahr ausgeschrieben.', z2:'Die Amtsleitung, meine ich.',
         opts: () => [{t:'Jedes Jahr?', zu:'u8'}]},
    u8: {z1:'Jedes Jahr. Steht in der Liste.', z2:'Ich trage die Liste.',
         opts: () => [{t:'Und niemand meldet sich?', zu:'u9'}]},
    // T1-Nachlese: der Gerade sagt "wie bitte", er annotiert nicht. Hier stand
    // "Komisch eigentlich." und darunter "Sehr komisch." Der Witz wurde zweimal
    // angezeigt und starb dabei. Jetzt redet Umlauf ungeruehrt weiter, der
    // Spieler greift zu, und der Abbruch in u10 wird von einem Abgang zu einer
    // Pointe. Vierzig Jahre ist die gedeckte Zahl (Sturz ist so lange vermisst),
    // und "Kein Name" ist woertlich N. N., ohne das Kuerzel zu bemuehen.
    u9: {z1:'Es meldet sich nur nie jemand.', z2:'Vierzig Jahre. Kein Name.',
         opts: () => [{t:'Könnte ich mich melden?', zu:'u10'}]},
    u10:{z1:'Ich muss weiter. Elf Stellen noch.', z2:'Auf der Rückseite.',
         opts: () => [{t:'War nett.', tun: () => szeneEnde('umlauf', 'szeneUmlauf')}]},
  },
};

// --- Szene 3: "Die zweite Schublade" ----------------------------------------
// Akt III, im Amtspanel. Die Amtsstube hat kein begehbares Inneres, Sturz'
// Schreibtisch steht nur im Text. Aber langGiesskanneBlock() stellt genau
// diesen Schreibtisch samt Pflanze bereits ins Panel, mit einer anklickbaren
// Zeile. Die zweite Schublade haengt daneben, an derselben Stelle, mit
// demselben Bauteil.
//
// Der Kippunkt des Spiels: bis hierhin sieht das Haus aus wie etwas, das
// vergessen wurde. Ab hier weiss der Spieler, dass es gepflegt wird.
const SCHUBLADE_VON = 972, SCHUBLADE_BIS = 1011;

// Vierzig Blaetter, und es ist eines. Genau so steht es in der Weltgeschichte,
// und es ist auch das Richtige: vierzig Tafeln waeren vierzig Klicks, und der
// Witz ist nicht die Zahl der Klicks, sondern dass es nicht aufhoert. Der
// zweite Knopf springt deshalb ans Ende, sobald man verstanden hat.
function schubladeBlaetter(){
  const raus = [];
  for(let j = SCHUBLADE_VON; j <= SCHUBLADE_BIS; j++){
    const letzt = j === SCHUBLADE_BIS;
    raus.push({
      blatt: 'Ein Zwischenbescheid. Darunter liegen weitere.',
      stimme: ['Ihr Anliegen wird bearbeitet.',
               'Die Ausschreibung der Amtsleitung wird zur Klärung zurückgestellt.',
               'Hochablage, im Jahr ' + j + '.'],
      regie: letzt ? 'Gezeichnet: H. z. H. Vorblatt, Reichsministerialdirektor.'
                   : 'Das nächste Blatt. Dasselbe.',
    });
  }
  return raus;
}

SZENEN.schublade = {
  wenn:   () => aktStand() >= 3 && !kn.flags.szeneSchublade,
  haeltDieWelt: true,
  sprecher: () => szeneSprecherKnoeterich(),
  start:  's1',
  sperre: [],
  ende:   () => szeneEnde('schublade', 'szeneSchublade'),
  knoten: {
    // T1-Nachlese: hier stand Knoeterich vor seinem eigenen Portraet und
    // fragte "Wer ist Vorblatt?", und der Spieler antwortete darauf mit
    // "Knoeterich fragen." Am Kippunkt des Spiels ist das eine Verwirrung, und
    // es verschenkt Grundgesetz 11: die schoene Abfuhr in s2 beantwortete eine
    // Frage, die niemand gestellt hatte. Jetzt stellt sie der Spieler.
    s1: {z1:'Vierzig Blätter. Ich kenne den Stapel.', z2:'Sie wollen einen Namen wissen.',
         opts: () => [{t:'Wer ist Vorblatt?', zu:'s2'}]},
    s2: {z1:'Ich führe Buch. Ich lese nicht vor.', z2:'Fragen Sie mich etwas Leichteres.',
         opts: () => [{t:'Vierzig Jahre, ein Bescheid.', zu:'s3'}]},
    s3: {z1:'Einundvierzig.', z2:'Der erste kam vor ihrer Abreise.',
         opts: () => [{t:'Vor ihrer Abreise?', zu:'s4'}]},
    s4: {z1:'Das habe ich nicht gesagt.', z2:'Notiert habe ich es aber.',
         opts: () => [{t:'Verstanden.', tun: () => szeneEnde('schublade', 'szeneSchublade')}]},
  },
};

// Der Eingang. Erst der Tafelstapel, dann das Gespraech mit Knoeterich: die
// vierzig Blaetter sind der Fund, seine vier Zeilen sind, was daraus folgt.
function schubladeOeffnen(){
  amtFensterSchliessen();
  const liste = schubladeBlaetter();
  szeneTafelLauf = null;
  szeneTafeln(liste, {letzterKnopf:'ZUKLAPPEN',
                      ende: () => szeneOeffnen('schublade', SZENEN.schublade.start),
                      zweiter:{t:'ZUM LETZTEN BLATT', tun: () => szeneTafel(liste.length - 1)}});
}

// Die Zeile im Amtspanel, neben der Giesskanne. Kein neues Panel, kein neues
// Weltobjekt: der leere Schreibtisch steht dort seit W7.
function schubladeBlock(){
  if(!CONFIG.schichtModus || aktStand() < 3 || kn.flags.szeneSchublade) return '';
  return `<p style="font-size:calc(11px * var(--fs));color:#9a8a5f;margin:8px 0 0;">Die zweite Schublade des leeren Schreibtisches klemmt.</p>
    <span onclick="schubladeOeffnen()" style="cursor:pointer;color:#f4d97a;font-size:calc(11px * var(--fs));">▸ Die Schublade aufziehen</span>`;
}

// --- Szene 4: "Knoeterichs einer Satz" --------------------------------------
// Akt IV, sobald die Anschrift vollstaendig ist. Er haengt als einziger nicht
// an gespraechOeffnen(), weil Knoeterich nicht in DORF_FIGUREN steht: er steht
// im Haus (KN_POS, drawAlter) und wird ueber AKT_NACHFRAGE angesprochen. Die
// Asymmetrie ist keine Schlamperei, sie ist die Figur.
SZENEN.knoeterich = {
  figur:  'knoeterich',
  wenn:   () => CONFIG.schichtModus && aktStand() >= 4 && vorgangHat(4) && !kn.flags.szeneKnoeterich,
  haeltDieWelt: true,
  sprecher: () => szeneSprecherKnoeterich(),
  start:  'k1',
  sperre: [],
  ende:   () => szeneEnde('knoeterich', 'szeneKnoeterich'),
  knoten: {
    k1: {z1:'Sie sind früh.', z2:'Ich gieße noch. Es dauert.',
         opts: () => [{t:'Die Anschrift ist ganz.', zu:'k2'}]},
    k2: {z1:'Ich weiß.', z2:'Ich führe Buch.',
         opts: () => [{t:'Soll ich zustellen?', zu:'k3'}]},
    k3: {z1:'Das darf ich nicht beantworten.', z2:'Amtsverschwiegenheit. Fragen Sie anders.',
         opts: () => [{t:'Was tut ein Abschluss?', zu:'k4'}]},
    k4: {z1:'Hintermühl.', z2:'Mehr sage ich nicht.',
         opts: () => [{t:'Hintermühl?', tun: () => szeneEnde('knoeterich', 'szeneKnoeterich')}]},
  },
};

// --- Szene 5: "Der Stopfen" -------------------------------------------------
// Akt IV, optional, im Steinfeld an der freigelegten Roehre. Die einzige Szene
// des Spiels, die an einem ORT spielt und nicht an einer Figur: sie wird von
// der Kontextaktion an der Stelle geoeffnet (stopfenGriff()), nicht von
// szeneFaellig(). Deshalb traegt sie kein figur-Feld — genau wie SZENEN.schublade,
// die aus dem Amtspanel kommt.
//
// Zapf spricht, obwohl er im Dorf steht und nicht hier. Das ist kein Trick:
// szeneSprecherAusDorf() faellt auf den Tabelleneintrag zurueck, wenn die Figur
// nicht in der Welt steht, und erzaehlerisch ist er mitgekommen — Stufe 3 des
// Strangs IST "Zapf geholt". Ihn wirklich hierher laufen zu lassen waere ein
// Wegfindungsproblem in einem Spiel, das keine Wegfindung hat (genMap Schritt 3).
//
// Kein Satz ist neu. Die Szene steht in weltgeschichte.md, Kapitel 8, und wird
// woertlich uebernommen, bis auf die Antwortbeschriftungen, die dort als
// "(Antwortauswahl)" markiert sind und hier ihren Text bekommen.
SZENEN.stopfen = {
  haeltDieWelt: true,
  sprecher: () => szeneSprecherAusDorf('zapf'),
  start:  'p1',
  sperre: [],
  ende:   () => stopfenGezogenEnde(),
  knoten: {
    p1: {z1:'Rohrpost. Reichseigen.', z2:'Da steckt was fest.',
         opts: () => [{t:'Sie geht nicht.', zu:'p2'}]},
    p2: {z1:'Seit siebenhunderteinundvierzig.', z2:'Ich hol es raus.',
         opts: () => [{t:'Einfach so?', zu:'p3'}]},
    // Die Kapsel. Der Aktenauszug steht als eigener Knoten und nicht als Tafel:
    // eine Tafel haette die Szene angehalten, und dieser Satz ist der Kern.
    p3: {z1:'Wer räumt das Papier aus dem Fluss?', z2:'Um Nachricht wird gebeten.',
         opts: () => [{t:'Die Frage von damals.', zu:'p4'}]},
    p4: {z1:'Das ist eine Frage.', z2:'Steht ja da.',
         opts: () => [{t:'Daran hing der Krieg.', zu:'p5'}]},
    p5: {z1:'Sie steckt in einem Rohr.', z2:'Ich mach das. Ist ja Papier.',
         opts: () => [{t:'Zusehen.', zu:'p6'}]},
    p6: {z1:'Ich räume es raus.', z2:'Vier Wörter. Er schreibt langsam.',
         opts: () => [{t:'Und jetzt?', zu:'p7'}]},
    p7: {z1:'So. Läuft wieder.', z2:'Ist ja nur ein Rohr.',
         opts: () => [{t:'Zurücktreten.', tun: () => stopfenGezogenEnde()}]},
  },
};

// Das Ende der Szene ist der Anfang von allem, was der Stopfen kostet: der
// Strang geht auf seine letzte Stufe, die Post faengt an zu fallen, Serie I
// wird auffindbar, und Vorblatt sitzt zwei Schichten spaeter auf dem Wagen.
// Alles davon haengt an EINER geschriebenen Groesse (dem Strang) und einem
// Zeitstempel; kein zweiter Merker, keine zweite Wahrheit.
function stopfenGezogenEnde(){
  langEreignis('stopfenort', {gezogen:true});
  if(!amt.stopfenSchicht) amt.stopfenSchicht = amt.schichten + 1;   // 1-basiert, damit 0 "nie" heisst
  saveAmt();
  szeneEnde('stopfen', 'szeneStopfen');
  floaters.push({x: player.x, y: player.y - 46, txt: 'DIE ROHRPOST LÄUFT', col:'#7ad6ff', t: 3.4, big: true});
}

// --- Szene 6: "Die Entklammerung" -------------------------------------------
// Akt IV, mittags auf dem Dorfplatz. Zwei Schichten nach dem Stopfen, oder,
// wenn der Spieler ihn nicht gezogen hat, zwei Schichten nach der vierten
// Adresszeile. Genau so steht es in der Weltgeschichte, und genau das ist der
// Preis des Stopfens: nicht dass Vorblatt kommt, sondern WANN.
//
// Die Weltgeschichte bietet ausdruecklich an, die Entklammerung hinter der
// Amtstuer stattfinden zu lassen und Lott und Pahl davon erzaehlen zu lassen
// ("Das ist sogar besser"). Gebaut ist trotzdem die Fassung auf dem Dorfplatz,
// und zwar aus einem mechanischen Grund: Vorblatt steht seit dieser Szene im
// Dorf, und der Spieler muss gesehen haben, wie er hereinkam. Lott und Pahl
// bekommen ihre vier Zeilen trotzdem, direkt danach, als Nachklang.
const SZENE6_ABSTAND = 2;   // Schichten
function szene6Faellig(){
  if(szeneAktiv || !CONFIG.schichtModus || kn.flags.szeneVorblatt) return;
  if(kammer || currentLevel !== 1 || state !== 'play') return;
  if(!inVillagePx(player.x, player.y)) return;          // "auf dem Dorfplatz", woertlich
  if(!vorblattFaellig()) return;
  szeneOeffnen('vorblatt', SZENEN.vorblatt.start);
}
// Wann der Wagen kommt. Zwei Wege, der frueheste gewinnt, und der Stopfen ist
// der frueheste, den es gibt.
function vorblattFaellig(){
  if(aktStand() < 4) return false;
  if(amt.stopfenSchicht && amt.schichten >= (amt.stopfenSchicht - 1) + SZENE6_ABSTAND) return true;
  if(amt.adressSchicht && amt.schichten >= (amt.adressSchicht - 1) + SZENE6_ABSTAND) return true;
  return false;
}

SZENEN.vorblatt = {
  haeltDieWelt: true,
  sprecher: () => szeneSprecherAusDorf('vorblatt'),
  start:  'v1',
  sperre: [],
  ende:   () => vorblattAngekommen(),
  knoten: {
    v1: {z1:'Guten Tag. Ich habe leider ein Formatproblem.', z2:'Ich bin breiter als Ihre Amtstür.',
         opts: () => [{t:'Was tun die beiden da?', zu:'v2'}]},
    v2: {z1:'Sie entklammern mich. Lage für Lage.', z2:'Es ist keine Peinlichkeit, es ist ein Verfahren.',
         opts: () => [{t:'Bitte sehr.', zu:'v3'}]},
    v3: {z1:'Sie sind der Außendienst.', z2:'Man hat mir geschrieben.',
         // T1-Nachlese: die Frage lautete "Wer schreibt Ihnen?" und bekam eine
         // Antwort zu einem anderen Thema. Bei Vorblatt ist Ausweichen zwar die
         // Sprachmarke, aber im Baum ist es markiert und hier war es nicht;
         // fuer ein Kind las es sich schlicht als Fehler.
         opts: () => [{t:'Über mich?', zu:'v4'}]},
    v4: {z1:'Sie führen keinen Vorgang.', z2:'Das macht Sie sehr frei.',
         opts: () => [{t:'Da fällt eine Lage.', zu:'v5'}]},
    v5: {z1:'Diese hier ist aus dem Jahr 987.', z2:'Eine Uferfrage. Ich hänge an ihr.',
         opts: () => [{t:'Eine Uferfrage?', zu:'v6'}]},
    v6: {z1:'Sie hat mir den Grafen gebracht.', z2:'Man behält so etwas.',
         opts: () => [{t:'Warten.', zu:'v7'}]},
    // Die Entklammerung ist fertig. Er ist plötzlich ein schmaler, älterer Herr
    // in Hemdsärmeln, und er sieht aus wie jemand, der friert.
    v7: {z1:'So. Nun passe ich.', z2:'Es zieht ein wenig.',
         opts: () => [{t:'Er geht ins Amt.', tun: () => vorblattAngekommen()}]},
  },
};

// Der Nachklang: Lott und Pahl, sofort danach. Sie stehen als Chor im Dorf und
// haben dafuer den Kanal, den SZ2 gebaut hat (letzterAnlass) — kein neuer
// Mechanismus, nur ein neuer Anlass.
function vorblattAngekommen(){
  if(!kn.flags.szeneVorblatt){ kn.flags.szeneVorblatt = true; saveKn(); }
  szeneAus();
  letzterAnlass = 'vorblatt';
}

// --- Szene 7: "Die Versuchung" ----------------------------------------------
// Akt IV, im Amtsflur, sobald Vorblatt da ist. Die wichtigste Szene des Spiels
// (weltgeschichte.md, Kapitel 8), und die einzige, in der acht Figuren
// nacheinander sprechen. Sie haengt an Vorblatt und faellt beim ersten
// Ansprechen nach seiner Ankunft, also auf demselben Weg wie die drei Szenen
// aus SZ2: gespraechOeffnen() fragt szeneFaellig(), bevor der Baum drankommt.
//
// Gebaut ist die Versammlung und nicht die acht Einzelgespraeche, die die
// Weltgeschichte als billigere Fassung anbietet. Der Grund steht seit SZ1 im
// Code: szeneKnoten() kennt wer:, und der Kommentar dort nennt genau diese
// Szene als Anlass ("dort geht Vorblatt durch acht Leute hindurch"). Acht
// Einzelgespraeche waeren acht Tafeln ohne Publikum; die Pointe der Szene ist,
// dass alle zuhoeren, waehrend jeder Einzelne sein Angebot bekommt.
//
// Knoeterich wechselt als Funktion und nicht als Schluessel: er steht nicht in
// DORF_FIGUREN (siehe SZENEN.knoeterich), und szeneSprecherSetzen() nimmt
// beides.
//
// Die vier Antwortzeilen der Weltgeschichte sind hier drei Fragen und der
// Ausgang. Das ist keine Kuerzung: die vierte Zeile lautet dort "(nichts
// sagen)", und ein Ausgang IST das Nichtssagen. Die Bauform ist die der
// Gespraechsbaeume aus F1d, mit sicht 3 und hubAusgang, und damit bleibt die
// Liste vierzeilig, wie ANTWORT_DECKEL und szeneAssert() es verlangen.
SZENEN.versuchung = {
  figur:  'vorblatt',
  wenn:   () => CONFIG.schichtModus && kn.flags.szeneVorblatt && !kn.flags.szeneVersuchung,
  haeltDieWelt: true,
  sicht:  3,
  sprecher: () => szeneSprecherAusDorf('vorblatt'),
  start:  'w1',
  sperre: [],
  ende:   () => versuchungEnde(),
  fragen: [
    {key:'lassen', t:'Was muss ich lassen?',
     z1:'Zustellen. Weiter nichts.', z2:'Der Vorgang bleibt, wo er ist.'},
    {key:'wert', t:'Warum ist Ihnen das wert?',
     z1:'Einundvierzigtausend Menschen.', z2:'Sie wären morgen früh niemand mehr.'},
    {key:'zustell', t:'Und wenn ich zustelle?',
     z1:'Dann ist der Krieg vorbei.', z2:'Und wir sind es auch. Am selben Nachmittag.'},
  ],
  knoten: {
    w1: {z1:'Ich bin nicht gekommen, um etwas wegzunehmen.', z2:'Ich bin gekommen, um Ihnen etwas zu geben.',
         opts: () => [{t:'Wem?', zu:'w2'}]},
    w2: {z1:'Allen. Ich bitte um einen Moment.', z2:'Es sind mehrere Mappen.',
         opts: () => [{t:'Zusehen.', zu:'mz1'}]},

    // Zwirn. Die Bewilligung, die er seit elf Anläufen nicht bekommt, auf
    // seinen Namen, und zugegangen in dem Moment, in dem er sie anfasst.
    mz1: {z1:'Herr Bürgermeister. Die Bewilligung für Ihr Fest.', z2:'Nicht die alte. Eine neue. Auf Ihren Namen.',
          opts: () => [{t:'Und die Zustellung?', zu:'mz2'}]},
    mz2: {z1:'Zugegangen ist sie, sobald Sie sie anfassen.', z2:'Das ist die ganze Bedingung.',
          opts: () => [{t:'Zwirn?', zu:'mz3'}]},
    mz3: {wer:'zwirn', z1:'Zwirn sagt nichts.', z2:'Es ist das erste Mal.',
          opts: () => [{t:'Weiter.', zu:'ml1'}]},

    // Lisbeth. Der sechste Praktikumsbericht, unterschrieben, und zwar von
    // jemandem, der wirklich weisungsbefugt ist. LV4 hat denselben Bericht mit
    // einer Monster-Unterschrift geschlossen; hier liegt die andere Fassung
    // auf dem Tisch, und sie ist die schlechtere.
    ml1: {wer:'vorblatt', z1:'Fräulein Fuhr. Ihr sechster Praktikumsbericht.', z2:'Unterschrieben. Von einer weisungsbefugten Person.',
          opts: () => [{t:'Von wem?', zu:'ml2'}]},
    ml2: {z1:'Ich bin weisungsbefugt.', z2:'Ich bin es sogar sehr.',
          opts: () => [{t:'Lisbeth?', zu:'ml3'}]},
    ml3: {wer:'lisbeth', z1:'Sechs Jahre.', z2:'Sie sagt es sehr leise.',
          opts: () => [{t:'Weiter.', zu:'ml4'}]},
    ml4: {wer:'vorblatt', z1:'Sechs Jahre. Ja.', z2:'Das steht auch drin.',
          opts: () => [{t:'Weiter.', zu:'mn1'}]},

    // Nörgel. Vierzig Jahre auf Probe, und die Stelle, die er sich wünscht,
    // hat Vorblatt vorher erfragt. Das ist der Satz, an dem die Szene kippt:
    // er lügt nicht, er hat sich erkundigt.
    mn1: {z1:'Und Sie sind Nörgel.', z2:'Sachbearbeiter auf Probe, seit vierzig Jahren.',
          opts: () => [{t:'Was liegt da?', zu:'mn2'}]},
    mn2: {z1:'Ihre Entfristung. Sowie Ihre Ernennung.', z2:'Monsterangelegenheitenaußendienstüberwachungsamtmann.',
          opts: () => [{t:'Woher wissen Sie das?', zu:'mn3'}]},
    mn3: {z1:'Ich habe mich erkundigt.', z2:'Welche Stelle Sie sich wünschen.',
          opts: () => [{t:'Nörgel?', zu:'mn4'}]},
    mn4: {wer:'noergel', z1:'Nörgel sagt nichts.', z2:'Er rückt seine Krawatte gerade. Zweimal.',
          opts: () => [{t:'Weiter.', zu:'mb1'}]},

    // Bramsche. Die Entlastung für den Brandabschnitt, und der einzige
    // Wortwechsel der Szene, in dem jemand zurückfragt. Ihre Grundregel seit
    // Schicht 1 lautet, dass es ohne Antrag nichts gibt; hier schenkt ihr
    // jemand etwas ohne Antrag, und genau das macht es unheimlich.
    mb1: {wer:'vorblatt', z1:'Frau Registratorin. Eine Entlastung.', z2:'Der Brandabschnitt ist von einer Stelle veranlasst worden.',
          opts: () => [{t:'Von welcher?', zu:'mb2'}]},
    mb2: {z1:'Nicht von Ihnen. Sie tragen keine Schuld.', z2:'Das steht hier. Mit Siegel.',
          opts: () => [{t:'Bramsche?', zu:'mb3'}]},
    mb3: {wer:'bramsche', z1:'In welcher Sache haben Sie das ausgestellt?', z2:'Ich habe keinen Antrag gestellt.',
          opts: () => [{t:'Und?', zu:'mb4'}]},
    mb4: {wer:'vorblatt', z1:'In Ihrer. Nein, haben Sie nicht.', z2:'Das ist das Angenehme daran.',
          opts: () => [{t:'Weiter.', zu:'mk1'}]},

    // Knöterich. Die Entpflichtung, auf die vierzig Jahre lang niemand
    // gekommen ist, und der einzige Einwand, den er hat, ist sein Buch.
    mk1: {z1:'Amtsrat. Ihre Entpflichtung.', z2:'Vierzig Jahre unbearbeitet. Das ist selbst für uns lang.',
          opts: () => [{t:'Und dann?', zu:'mk2'}]},
    mk2: {z1:'Sie dürfen nach Hause gehen.', z2:'Heute noch.',
          opts: () => [{t:'Knöterich?', zu:'mk3'}]},
    mk3: {wer: () => szeneSprecherKnoeterich(), z1:'Ich führe Buch.', z2:'Mehr sagt er nicht.',
          opts: () => [{t:'Weiter.', zu:'mk4'}]},
    mk4: {wer:'vorblatt', z1:'Ab morgen führt es jemand anderes.', z2:'Das ist geregelt.',
          opts: () => [{t:'Knöterich?', zu:'mk5'}]},
    mk5: {wer: () => szeneSprecherKnoeterich(), z1:'Knöterich sagt sehr lange nichts.', z2:'Niemand hilft ihm dabei.',
          opts: () => [{t:'Weiter.', zu:'mt1'}]},

    // Trepp. Der Sack, sieben Generationen, und die einzige Zeile der Szene,
    // in der jemand nicht nachgibt. Er tut es in seiner Form: mit einer
    // Entschuldigung davor.
    mt1: {wer:'vorblatt', z1:'Herr Trepp. Ich nehme Ihnen den Sack ab.', z2:'Sieben Generationen. Es reicht doch nun wirklich.',
          opts: () => [{t:'Trepp?', zu:'mt2'}]},
    mt2: {wer:'trepp', z1:'Wenn ich kurz stören darf.', z2:'Er ist meiner.',
          opts: () => [{t:'Weiter.', zu:'mp1'}]},

    // Zapf. Die Mappe, die es nicht gibt, weil er nichts will. Vorblatt
    // blättert zweimal, und die Pause danach ist die längste der Szene.
    mp1: {wer:'vorblatt', z1:'Und für Sie habe ich, Herr Zapf...', z2:'Er blättert. Er blättert noch einmal.',
          opts: () => [{t:'Nichts dabei?', zu:'mp2'}]},
    mp2: {z1:'Was möchten Sie denn?', z2:'Jeder möchte etwas.',
          opts: () => [{t:'Zapf?', zu:'mp3'}]},
    mp3: {wer:'zapf', z1:'Nichts.', z2:'Ich hab Werkzeug.',
          opts: () => [{t:'Weiter.', zu:'mp4'}]},
    mp4: {wer:'vorblatt', z1:'Vorblatt sieht ihn an und sagt nichts.', z2:'Es ist eine sehr lange Sekunde.',
          opts: () => [{t:'Weiter.', zu:'sp1'}]},

    // Und zuletzt der Spieler. Er tritt näher und wird leiser, weil das hier
    // das eigentliche Angebot ist: kein Amt, kein Geld, ein Name an der Tür.
    sp1: {z1:'Sie haben keinen Namen im Haus.', z2:'Sie haben eine Stelle für einen Tag.',
          opts: () => [{t:'Und Sie?', zu:'sp2'}]},
    sp2: {z1:'Ich habe hier eine Planstelle. Unbefristet.', z2:'Mit Ihrem Namen an der Tür. Gedruckt.',
          opts: () => [{t:'Was kostet das?', zu:'hub'}]},
    // Der hub. Ohne opts, damit szeneOptionen() die offenen Fragen plus den
    // Ausgang zeigt. Wer alle drei stellt, bekommt am Ende trotzdem denselben
    // Ausgang: es gibt in dieser Szene nichts anzunehmen und nichts abzulehnen.
    hub: {z1:'Sie kämen morgen wieder. Und übermorgen.', z2:'Sie müssten nichts tun. Nur etwas lassen.', hub:true},
    // Vorblatts vierte Antwort, die auf das Schweigen. Sie steht als eigener
    // Knoten und nicht am Ausgang, weil sie in der Weltgeschichte eine Antwort
    // ist und keine Regieangabe.
    w4: {z1:'Sie überlegen. Das ist gut.', z2:'Überlegen ist auch eine Form von Bearbeitung.',
         opts: () => [{t:'Stille.', zu:'ls1'}]},

    // Lisbeths Zeile. Sie sagt sie nicht laut, und sie ist die Zeile, die die
    // Szene entscheidet. Kein Zufall, dass sie dieselbe Frage stellt wie in
    // Akt I: sie fragt seit Akt I dasselbe.
    ls1: {wer:'lisbeth', z1:'Und wenn er einfach nur wartet?', z2:'Sie sagt es in die Stille hinein, wie immer.',
          opts: () => [{t:'Vorblatt?', zu:'ls2'}]},
    ls2: {wer:'vorblatt', z1:'Dann wartet er sehr gut, Fräulein Fuhr.', z2:'Vierhundert Jahre sind eine beachtliche Leistung.',
          opts: () => [{t:'Lisbeth?', zu:'ls3'}]},
    ls3: {wer:'lisbeth', z1:'Ich habe nicht gefragt, wie gut er wartet.', z2:'Danach sagt eine Weile niemand etwas.',
          opts: () => [{t:'Weiter.', zu:'nv1'}]},

    // Nörgel liest die Anschrift vor. Er ist der Einzige im Raum, der die
    // Schrift lesen kann (Akt IV), und der Einzige, der weiß, was der
    // Höflichkeitspartikel wirklich ist. Vierzig Jahre Dienstberichte, und
    // dieser eine Satz ist ihr Ertrag.
    nv1: {wer:'noergel', z1:'Nörgel geht zum Tisch und nimmt den Umschlag.', z2:'Er dreht ihn zum Licht.',
          opts: () => [{t:'Vorblatt?', zu:'nv2'}]},
    nv2: {wer:'vorblatt', z1:'Herr Amtmann.', z2:'Das ist nicht Ihre Zuständigkeit.',
          opts: () => [{t:'Nörgel?', zu:'nv3'}]},
    nv3: {wer:'noergel', z1:'Nein. Ist es nicht.', z2:'Ich mache es trotzdem.',
          opts: () => [{t:'Zuhören.', zu:'nv4'}]},
    nv4: {z1:'An Fürst Nachtrag. Zu Händen. Persönlich.', z2:'Er liest langsam. Es ist eine alte Schrift.',
          opts: () => [{t:'Und?', zu:'nv5'}]},
    nv5: {z1:'Zu Händen ist kein höfliches Wort.', z2:'Das ist ein Rang.',
          opts: () => [{t:'Also?', zu:'nv6'}]},
    nv6: {z1:'Wir haben vierhundert Jahre eingeschlagen.', z2:'Auf einen, der auf Post gewartet hat.',
          opts: () => [{t:'Vorblatt?', zu:'st1'}]},

    // Der Stempel. Er ist nicht wütend, er ist müde, und er tut das Übliche.
    // Das ist der einzige laute Ton der Szene und zugleich Vorblatts letzter
    // Zug: ab hier klebt ein Zwischenbescheid auf der Ausfertigung.
    st1: {wer:'vorblatt', z1:'Das war zu erwarten.', z2:'Nicht so früh, aber zu erwarten.',
          opts: () => [{t:'Was tun Sie da?', zu:'st2'}]},
    st2: {z1:'Dann werde ich das Übliche tun.', z2:'Er nimmt seinen Stempel heraus.',
          opts: () => [{t:'Zusehen.', zu:'st3'}]},
    st3: {z1:'IHR ANLIEGEN WIRD BEARBEITET.', z2:'Es ist der einzige laute Ton der Szene.',
          opts: () => [{t:'Und jetzt?', zu:'st4'}]},
    st4: {z1:'So. Nun ist es anhängig.', z2:'Ein anhängiges Schriftstück wird bearbeitet.',
          opts: () => [{t:'Nicht zugestellt?', zu:'st5'}]},
    st5: {z1:'Nicht zugestellt. Bearbeitet.', z2:'Ich wünsche Ihnen einen angenehmen Feierabend.',
          opts: () => [{t:'Er geht.', tun: () => versuchungEnde()}]},
  },
  // Der Ausgang aus dem hub ist die vierte Antwortzeile der Weltgeschichte.
  // Er steht immer und ändert sich nicht mit der Zahl der gestellten Fragen:
  // in dieser Szene wird nichts angenommen und nichts abgelehnt, und ein
  // Ausgang, der sich nach drei Fragen anders liest, wäre eine Entscheidung.
  hubAusgang: () => ({t:'Nichts sagen.', zu:'w4'}),
};

// Das Ende der Szene ist der Anfang von Vorblatts letztem Zug. Ein Merker,
// keine zweite Wahrheit: vorgangAnhaengig() liest ihn, das Amtspanel liest ihn,
// und die Zustellung liest ihn. Kein Feld daneben, das dasselbe noch einmal
// sagt (die Bauform von stopfenGezogenEnde(), SZ3).
function versuchungEnde(){
  szeneEnde('versuchung', 'szeneVersuchung');
  floaters.push({x: player.x, y: player.y - 46, txt: 'ANHÄNGIG', col:'#c77dff', t: 3.4, big: true});
}

// Die sieben Mappen bleiben liegen. Das ist die eine Regel der Szene, die die
// Weltgeschichte ausdrücklich als nicht verhandelbar führt: niemand nimmt
// etwas an, niemand lehnt etwas ab, und der Spieler geht in den nächsten
// Schichten mehrfach daran vorbei. Gebaut ist sie als Zeile im Amtspanel,
// neben der Gießkanne und der Schublade, und nicht als Weltobjekt: ein
// Mappenstapel im Flur wäre ein Blatt und ein Anker, die Zeile ist der
// Vorgang. Sie verschwindet nie, weil die Mappen nie abgeholt werden.
function mappenBlock(){
  if(!CONFIG.schichtModus || !kn.flags.szeneVersuchung) return '';
  return `<p style="font-size:calc(11px * var(--fs));color:#9a8a5f;margin:8px 0 0;">Im Flur liegen sieben Mappen. Es hat keine angefasst.</p>`;
}

// ===========================================================================
//  F1d: Die Gespraechsbaeume
//
//  Dieselbe Maschine wie die vier Szenen oben, drei Unterschiede: baum:true
//  haelt sie aus szeneFaellig() heraus (die F-Taste bleibt, was sie war), sie
//  halten die Welt nicht an, und sie setzen keinen Merker beim Verlassen, sind
//  also wiederbetretbar. Betreten werden sie ueber die fuenfte Antwortzeile,
//  siehe BAUM_EINSTIEG in gespraechOptionen().
//
//  Bauform je Baum: ein hub, sechs Fragen (drei frei, zwei mit Voraussetzung,
//  eine ab der dritten gestellten Frage), und ein Ausgang, der sich aendert,
//  sobald die tiefste Frage gestellt wurde. Dahinter liegt die Wahl mit ihren
//  zwei Enden. Warum die Wahl am Ausgang haengt und nicht an einer Frage:
//  szeneOptionen() liest opts NUR an Knoten, nie an Fragen, und der hubAusgang
//  ist der einzige frei formulierbare Eintrag der Hub-Liste.
// ===========================================================================

SZENEN.baumNieselbeck = {
  baum:true, figur:'nieselbeck', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 3,
  sprecher: () => szeneSprecherAusDorf('nieselbeck'),
  fragen:[
    {key:'eimer', t:'Wozu der Eimer?',
     z1:'Für den Fall, dass etwas herunterkommt.', z2:'Er steht bereit. Wie ich.'},
    {key:'meldung', t:'Was melden Sie täglich?',
     z1:'Die TNM. Immer zur selben Stunde.', z2:'Bisher stand nichts darin.'},
    {key:'hut', t:'Ihr Hut ist neu?',
     z1:'Er ist fast neu. Ich schone ihn.', z2:'Für den ersten Arbeitstag.'},
    {key:'tnm', frei:'eimer', t:'Was heißt TNM?',
     z1:'Tägliche Niederschlagsmeldung.', z2:'Den langen Namen sagt keiner.'},
    {key:'tnm2', frei:'tnm', t:'Und warum täglich?',
     z1:'Die Meldung ist täglich.', z2:'Das Wetter nicht.'},
    // T1: die Aufloesung der Meldekuerzel, und die einzige Stelle im Spiel, an
    // der Nieselbeck ins Erzaehlen kommt. Kapitel 13 laesst die Familie nur
    // deshalb als eine Position gegen die Zwoelf zaehlen: er loest sie selbst
    // auf, eine Nachfrage entfernt, und die Kaskade macht aus der Auskunft
    // einen kleinen Vortrag ueber vier Spalten, von denen drei immer leer sind.
    {key:'spalten', frei:'meldung', t:'Was heißt das alles?',
     z1:'Die Spalten. Mg. ist die Menge.', z2:'Da. ist die Dauer.',
     weiter:'spalten2', wt:'Und die anderen?'},
    {key:'frostkamm', nach:3, t:'Was liegt im Frostkamm?',
     z1:'Mein Antrag auf Verwendung.', z2:'Auf Eis. Ordnungsgemäß.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Ich bin noch beim Anfang.', z2:'Fragen Sie ruhig.', hub:true},
    spalten2:{z1:'Ba. ist die Bodenart, Anm. sind die Anmerkungen.', z2:'Vlg. ist die Veranlassung.',
              opts: () => [{t:'Welche ist Ihre liebste?', zu:'spalten3'}]},
    spalten3:{z1:'Anmerkungen. Da darf das Wetter erzählen.', z2:'Die Spalte ist noch leer.'},
    angebot: {z1:'Sie könnten ihn anfordern.', z2:'Wenn Sie mögen. Ohne Eile.',
              opts: () => [
                {t:'Ich fordere ihn an.', tun: () => { kn.flags.baumEimer = true; saveKn(); szeneKnoten('dank'); }},
                {t:'Nicht mein Bereich.', zu:'kein'},
              ]},
    dank:    {z1:'Dann steht das jetzt in einer Akte.', z2:'Danke. Wirklich.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumNieselbeck')}]},
    kein:    {z1:'Verstanden. Das ist auch eine Auskunft.', z2:'Der Eimer bleibt trotzdem.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumNieselbeck')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('frostkamm')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumNieselbeck')},
};

SZENEN.baumZwirn = {
  baum:true, figur:'zwirn', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 4,
  sprecher: () => szeneSprecherAusDorf('zwirn'),
  fragen:[
    // T1: die Festrede, in ganzer Form. Drei Dinge, ordentlich aufgezaehlt,
    // und die ersten beiden hat er seit elf Jahren beisammen. Der Witz ist der
    // volle Einsatz fuer die falsche Sache (Grundgesetz 2), die Waerme ist,
    // dass er das Konfetti privat bezahlt und es nicht erwaehnt.
    {key:'fest', t:'Warum kein Fest?',
     z1:'Eine gute Frage. Zuerst: danke dafür.', z2:'Ein Fest braucht drei Dinge.',
     weiter:'fest2', wt:'Nämlich?'},
    {key:'amt', t:'Sind Sie mein Vorgesetzter?',
     z1:'Nein. Ich führe nur das Gespräch.', z2:'Weil sonst niemand darf.'},
    {key:'dorf', t:'Wie lange sind Sie hier?',
     z1:'Geboren, geblieben, gewählt worden.', z2:'In dieser Reihenfolge.'},
    {key:'konfetti', frei:'fest', t:'Und das Konfetti?',
     z1:'Bestellt. Elf Mal inzwischen.', z2:'Feucht wird es ja doch.'},
    {key:'kisten', frei:'konfetti', t:'Wer bezahlt das?',
     z1:'Ich. Ohne Genehmigung kein Titel.', z2:'Ein Haushaltstitel, meine ich.'},
    {key:'sturz', nach:3, t:'Wer war die Amtsleiterin?',
     z1:'Sie hat einen Antrag gestellt.', z2:'Ich habe unterschrieben.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Da fange ich gern an.', z2:'Setzen Sie sich ruhig nicht.', hub:true},
    fest2:   {z1:'Erstens Menschen. Die sind da.', z2:'Zweitens Konfetti. Bestellt.',
              opts: () => [{t:'Und drittens?', zu:'fest3'}]},
    fest3:   {z1:'Drittens die Genehmigung.', z2:'Da bin ich dran. Seit elf Jahren.'},
    angebot: {z1:'Sie könnten sich das ansehen.', z2:'Der Keller ist offen. Immer.',
              opts: () => [
                {t:'Ich sehe es mir an.', tun: () => { szeneKnoten('dank'); }},
                {t:'Lieber nicht.', zu:'kein'},
              ]},
    dank:    {z1:'Zehn leere Kisten und eine volle.', z2:'Ich beschrifte sie ordentlich.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumZwirn')}]},
    kein:    {z1:'Verstehe. Es ist auch nur ein Keller.', z2:'Wir werden das angehen.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumZwirn')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('sturz')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumZwirn')},
};

SZENEN.baumBramsche = {
  baum:true, figur:'bramsche', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 6,
  sprecher: () => szeneSprecherAusDorf('bramsche'),
  fragen:[
    {key:'ordnung', t:'Warum so streng?',
     z1:'Weil einmal etwas ohne Antrag ging.', z2:'Das war der Brandabschnitt.'},
    {key:'unten', t:'Wie ist es hier unten?',
     z1:'Kühl, trocken, dunkel.', z2:'Drei Gründe, dass etwas hält.'},
    {key:'kater', t:'Und der Kater?',
     z1:'Anlage 3 liegt, wo er liegen will.', z2:'Wecken steht mir nicht zu.'},
    {key:'herr', frei:'ordnung', t:'Wer kam damals?',
     z1:'Ein Herr aus Hochablage. Sehr höflich.', z2:'Höflichkeit ist kein Antrag.'},
    {key:'griff', frei:'herr', t:'Sie haben danebengegriffen?',
     z1:'Ich habe das Falsche hinausgetragen.', z2:'In die Sonne. Drei Tage.'},
    // T1: Bramsche ist zweistufig, und hier sieht man beide Stufen in einem Zug.
    // Ohne Antrag drei Woerter. Auf korrekt gestellten Antrag die Auskunft in
    // ganzer Form: Fundstelle, Gang, Regalseite, Langform, Vorbehalt. Die Wand
    // ist ihre Sprachmarke, die Auskunft ist die Belohnung, und die Belohnung
    // ist ueppig. Wer sie einmal richtig anspricht, merkt sich das.
    {key:'heft', nach:3, t:'Führen Sie noch etwas?',
     z1:'Ein Heft. Nicht das Eingangsbuch.', z2:'In welcher Sache fragen Sie?',
     weiter:'auskunft', wt:'In der Sache des Hefts.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Das ist ein weites Feld.', z2:'Fragen Sie genau.', hub:true},
    auskunft: {z1:'Antrag angenommen. Dann in ganzer Form.', z2:'Fundstelle: Gang zwei, links.',
               opts: () => [{t:'Und was steht darin?', zu:'auskunft2'}]},
    auskunft2:{z1:'Langform: Verzeichnis nicht gestellter Anträge.', z2:'Vorbehalt: es ist nicht amtlich.'},
    angebot: {z1:'Es steht darin, wer nichts beantragt hat.', z2:'Ich zeige es ungern her.',
              opts: () => [
                {t:'Zeigen Sie es mir.', tun: () => { kn.flags.baumHeft = true; saveKn(); szeneKnoten('dank'); }},
                {t:'Dann eben nicht.', zu:'kein'},
              ]},
    dank:    {z1:'Mehr Einträge als im Eingangsbuch.', z2:'Sie stehen inzwischen darin.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumBramsche')}]},
    kein:    {z1:'Gut. Es geht auch niemanden etwas an.', z2:'In welcher Sache also?',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumBramsche')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('heft')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumBramsche')},
};

SZENEN.baumLisbeth = {
  baum:true, figur:'lisbeth', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 4,
  sprecher: () => szeneSprecherAusDorf('lisbeth'),
  fragen:[
    {key:'praktikum', t:'Sechs Jahre Praktikum?',
     z1:'Sechs. Unbezahlt, aber lehrreich.', z2:'Das sage ich jedes Jahr.'},
    {key:'frage', t:'Was fragen Sie immer?',
     z1:'Ob einer vielleicht nur wartet.', z2:'Da wird es meistens still.'},
    {key:'traum', t:'Ein Amt für Monster?',
     z1:'Nicht gegen sie. Für sie.', z2:'Den Antrag habe ich fertig.'},
    {key:'bericht', frei:'praktikum', t:'Was steht im Bericht?',
     z1:'Beobachtungen. Sechs Jahre davon.', z2:'Seite zwei ist die beste.'},
    {key:'deckblatt', frei:'bericht', t:'Und auf dem Deckblatt?',
     z1:'Bericht über das Praktikumsjahr.', z2:'Und dahinter: vorläufig.'},
    {key:'unter', nach:3, t:'Wer unterschreibt das?',
     z1:'Eine weisungsbefugte Person.', z2:'Es gibt hier keine.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Ich bin noch beim ersten Jahr.', z2:'Fragen Sie. Bitte.', hub:true},
    angebot: {z1:'Sie könnten hineinsehen. Wenn Sie mögen.', z2:'Es hat noch niemand gelesen.',
              opts: () => [
                {t:'Zeigen Sie mir Seite zwei.', tun: () => { kn.flags.baumBericht = true; saveKn(); szeneKnoten('dank'); }},
                {t:'Ein andermal.', zu:'kein'},
              ]},
    dank:    {z1:'Der Fürst hat einen Titel. Die anderen nicht.', z2:'Steht da. Von mir. In Tinte.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumLisbeth')}]},
    kein:    {z1:'Auch gut. Es liest ja sonst auch keiner.', z2:'Ich frage trotzdem weiter.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumLisbeth')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('unter')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumLisbeth')},
};

SZENEN.baumZapf = {
  baum:true, figur:'zapf', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 3,
  sprecher: () => szeneSprecherAusDorf('zapf'),
  fragen:[
    {key:'werkzeug', t:'Was haben Sie dabei?',
     z1:'Alles. Sonst käme ich zweimal.', z2:'Zweimal ist Pfusch.'},
    {key:'kaffee', t:'Warum gegen Kaffee?',
     z1:'Er tropft. Immer. Überall.', z2:'Ich beseitige das.'},
    {key:'schild', t:'Wer pflegt das Schild?',
     z1:'Ich. Seit ich hier bin.', z2:'Es hält länger als Häuser.'},
    {key:'farbe', frei:'werkzeug', t:'Wie oft schon?',
     z1:'Zweimal übermalt. Einmal nachgezogen.', z2:'Steht hinten drauf.'},
    {key:'hinten', frei:'farbe', t:'Was steht hinten drauf?',
     z1:'Drei Daten. Meine Schrift.', z2:'Damit man weiß, wann wieder.'},
    {key:'vug', nach:3, t:'Und dieses V. u. g.?',
     z1:'Das gehört dazu. Machte man so.', z2:'Was es heißt, weiß ich nicht.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Da war auch was kaputt.', z2:'Fragen Sie kurz.', hub:true},
    angebot: {z1:'Sie könnten hinter das Schild sehen.', z2:'Ist nicht verboten.',
              opts: () => [
                {t:'Ich sehe nach.', tun: () => { szeneKnoten('dank'); }},
                {t:'Lassen wir das.', zu:'kein'},
              ]},
    dank:    {z1:'Drei Daten. Sonst nichts.', z2:'Buch führt hier ein anderer.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumZapf')}]},
    kein:    {z1:'Gut. Ist ja auch nur ein Schild.', z2:'Ich streiche es trotzdem.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumZapf')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('vug')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumZapf')},
};

SZENEN.baumTrepp = {
  baum:true, figur:'trepp', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 5,
  sprecher: () => szeneSprecherAusDorf('trepp'),
  fragen:[
    {key:'sack', t:'Was ist in dem Sack?',
     z1:'Ein Brief. Sonst nichts mehr.', z2:'Der Rest ist längst zugestellt.'},
    {key:'sieben', t:'Sieben Generationen?',
     z1:'Emil der Erste war der Zusteller.', z2:'Ich bin der Siebte davon.'},
    {key:'naht', t:'Der Sack ist geflickt?',
     z1:'Zweimal. Herr Zapf war das.', z2:'Er nimmt nichts dafür.'},
    {key:'schrift', frei:'sack', t:'Warum lesen Sie es nicht?',
     z1:'Die Schrift ist mir fremd.', z2:'Nicht unleserlich. Fremd.'},
    {key:'starren', frei:'schrift', t:'Sie starren sie an?',
     z1:'Jeden Tag. Seit vierzig Jahren.', z2:'Man gewöhnt sich an Striche.'},
    {key:'vater', nach:3, t:'Wie kam der Sack zu Ihnen?',
     z1:'Mein Vater hat ihn mir gegeben.', z2:'Mit fünf Wörtern dazu.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Wenn ich kurz stören darf.', z2:'Da gäbe es einiges.', hub:true},
    angebot: {z1:'Ich könnte sie Ihnen sagen.', z2:'Wenn Sie kurz Zeit hätten.',
              opts: () => [
                {t:'Sagen Sie sie mir.', tun: () => { szeneKnoten('dank'); }},
                {t:'Ein andermal.', zu:'kein'},
              ]},
    dank:    {z1:'Er ist noch nicht zugestellt.', z2:'Mehr sagt man dabei nicht.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumTrepp')}]},
    kein:    {z1:'Natürlich. Es ist ja auch nur ein Satz.', z2:'Er wartet. Wie alles hier.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumTrepp')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('vater')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumTrepp')},
};

SZENEN.baumNoergel = {
  baum:true, figur:'noergel', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 6,
  sprecher: () => szeneSprecherAusDorf('noergel'),
  fragen:[
    {key:'probe', t:'Vierzig Jahre auf Probe?',
     z1:'Neununddreißig und ein Rest.', z2:'Ich rechne genau. Berufsschaden.'},
    {key:'grün', t:'Sie sind eine Grünhaut?',
     z1:'Eine Beschwerde. Sehr ausdauernd.', z2:'Irgendwann schreibt man selbst.'},
    {key:'krawatte', t:'Warum die Krawatte?',
     z1:'Weil sie zur Dienstkleidung gehört.', z2:'Fällt trotzdem niemandem auf.'},
    // T1: die Beschwerde in ganzer Form. Vier Teile, alle vorschriftsmaessig,
    // und die Belehrung ueber den Rechtsbehelf schreibt er sich selbst, weil
    // sonst niemand zustaendig ist. Am Ende die Coda aus Kapitel 8. Er ledert
    // dabei ein Verfahren ab und nie eine Person (Humor-Grundgesetz 4).
    {key:'form', frei:'grün', t:'Wie beschwert man sich?',
     z1:'In vier Teilen. Ich zeige es Ihnen.', z2:'Erstens der Sachverhalt.',
     weiter:'be2', wt:'Und zweitens?'},
    {key:'antrag', frei:'probe', t:'Woher haben Sie die?',
     z1:'Beantragt. Bei der Materialausgabe.', z2:'Ordnungsgemäß. Mit Wortlaut.'},
    {key:'bestand', frei:'antrag', t:'Steht sie in einem Bestand?',
     z1:'Als einziges Stück. Meines.', z2:'Das ist beinahe ein Beweis.'},
    {key:'lager', nach:3, t:'Und die vor der Palisade?',
     z1:'Meine Leute. Sie warten dort.', z2:'Seit vierhundert Jahren.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Das ist eine lange Beschwerde.', z2:'Ich kürze sie ab.', hub:true},
    be2:     {z1:'Zweitens die Würdigung. Selten günstig.', z2:'Drittens der Antrag.',
              opts: () => [{t:'Und viertens?', zu:'be3'}]},
    be3:     {z1:'Viertens die Belehrung über den Rechtsbehelf.', z2:'Die schreibe ich mir selbst.',
              opts: () => [{t:'Und dann?', zu:'be4'}]},
    be4:     {z1:'Dann lege ich sie ab. Bei mir.', z2:'Und mache es trotzdem.'},
    angebot: {z1:'Sie könnten selbst hingehen.', z2:'Ohne zu schlagen, meine ich.',
              opts: () => [
                {t:'Ich gehe hin.', tun: () => { szeneKnoten('dank'); }},
                {t:'Zu gefährlich.', zu:'kein'},
              ]},
    dank:    {z1:'Dann sehen Sie es. Mehr will ich nicht.', z2:'Beschwerde hiermit erledigt.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumNoergel')}]},
    kein:    {z1:'Verständlich. Ich beschwere mich trotzdem.', z2:'Nicht über Sie. Über das.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumNoergel')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('lager')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumNoergel')},
};

SZENEN.baumMilb = {
  baum:true, figur:'milb', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 5,
  sprecher: () => szeneSprecherAusDorf('milb'),
  fragen:[
    {key:'note', t:'Wie stufen Sie ein?',
     z1:'Nach Merkmalen. Streng nach Vordruck.', z2:'Andere raten. Ich setze an.'},
    {key:'gefühl', t:'Kammern stimmen nicht?',
     z1:'Das beunruhigt mich seit Jahren.', z2:'Meine Zahlen stimmen ja.'},
    {key:'titel', t:'Was ist Ihre Hoheitsstufe?',
     z1:'Freiherr. Knapp, aber erreicht.', z2:'Ich habe es nachgerechnet.'},
    {key:'ga', frei:'note', t:'Was heißt GA?',
     z1:'Gutachterliche Ansetzung. Mein Wort.', z2:'Ich habe es selbst gebildet.'},
    {key:'kurz', frei:'ga', t:'Warum kürzen Sie das ab?',
     z1:'Weil ich es oft schreibe.', z2:'Was oft kommt, wird kürzer.'},
    // T1: das Gutachten in ganzer Form, die Kaskade dieser Figur. Vier Teile,
    // maximal gruendlich vorgetragen, und der vierte ist der Fehler: ein
    // Gutachten ohne Vorbehalt ist der Grund, warum er seit vierzig Jahren
    // systematisch eine Stufe zu hoch liegt (LV7). Er sagt es selbst und stolz.
    // Die gesperrte Tatsache bleibt gesperrt: er weiss nicht, was er da sagt.
    {key:'gutachten', frei:'note', t:'Machen Sie eins über mich?',
     z1:'Gern. Ein Gutachten hat vier Teile.', z2:'Erstens der Gegenstand: Sie.',
     weiter:'g2', wt:'Und zweitens?'},
    {key:'vordruck', nach:3, t:'Und der Vordruck selbst?',
     z1:'Sechs Zeilen. Ich kenne ihn genau.', z2:'Seit vierzig Jahren derselbe.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Das setze ich mit Vier an.', z2:'Fragen Sie ruhig weiter.', hub:true},
    g2:      {z1:'Zweitens der Maßstab. Der Vordruck.', z2:'Sechs Zeilen. Er genügt seit je.',
              opts: () => [{t:'Und drittens?', zu:'g3'}]},
    g3:      {z1:'Drittens die Ansetzung. Ich sage Drei.', z2:'Höchstens. Sie sind neu.',
              opts: () => [{t:'Und viertens?', zu:'g4'}]},
    g4:      {z1:'Viertens der Vorbehalt. Ich habe keinen.', z2:'Das ist die eigentliche Güte.'},
    angebot: {z1:'Ich könnte ihn Ihnen zeigen.', z2:'Er liegt hier. Natürlich.',
              opts: () => [
                {t:'Zeigen Sie ihn mir.', tun: () => { szeneKnoten('dank'); }},
                {t:'Nicht nötig.', zu:'kein'},
              ]},
    dank:    {z1:'Sechs Zeilen, von eins bis sechs.', z2:'Mehr braucht eine Skala nicht.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumMilb')}]},
    kein:    {z1:'Wie Sie meinen. Ich setze Sie mit Drei an.', z2:'Höchstens.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumMilb')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('vordruck')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumMilb')},
};

SZENEN.baumPommer = {
  baum:true, figur:'pommer', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 5,
  sprecher: () => szeneSprecherAusDorf('pommer'),
  fragen:[
    {key:'wortlaut', t:'Warum so genau?',
     z1:'Weil auf dem Antrag etwas steht.', z2:'Ich gebe aus, was dasteht.'},
    {key:'liste', t:'Was ist das für eine Liste?',
     z1:'Ausgaben ohne Antrag. Seit Jahren.', z2:'Sie ist leer. Das ist sie.'},
    {key:'bestand', t:'Wie kamen Sie hierher?',
     z1:'Übernommen. Und zwei Jahre geräumt.', z2:'Danach stimmte der Bestand.'},
    {key:'fehl', frei:'wortlaut', t:'Hat damals etwas gefehlt?',
     z1:'Es war nie da. Vermisst wurde es.', z2:'Beides gleichzeitig, ja.'},
    {key:'beweis', frei:'fehl', t:'Ein Antrag beweist etwas?',
     z1:'Dass die Sache überhaupt besteht.', z2:'Sonst ist sie nur behauptet.'},
    {key:'abend', nach:3, t:'Was tun Sie abends?',
     z1:'Ich räume ein. Und schreibe etwas.', z2:'Nichts Dienstliches. Fast.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Dazu bräuchte ich einen Antrag.', z2:'Ich mache eine Ausnahme.', hub:true},
    angebot: {z1:'Ich könnte Ihnen eines zeigen.', z2:'Herausgeben kann ich es nicht.',
              opts: () => [
                {t:'Zeigen Sie es.', tun: () => { szeneKnoten('dank'); }},
                {t:'Dann eben nicht.', zu:'kein'},
              ]},
    dank:    {z1:'Ein Entwurf. Für einen Fall, den es nicht gibt.', z2:'Beraten darf ich ja nicht.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumPommer')}]},
    kein:    {z1:'Richtig. Es steht auch nicht in meinem Bestand.', z2:'Kein Antrag, kein Material.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumPommer')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('abend')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumPommer')},
};

SZENEN.baumFass = {
  baum:true, figur:'fass', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 4,
  sprecher: () => szeneSprecherAusDorf('fass'),
  fragen:[
    {key:'gast', t:'Wer kommt hier abends her?',
     z1:'Alle. Und alle gehen wieder.', z2:'Vor dem Käse meistens.'},
    {key:'name', t:'Woher kommt der Name?',
     z1:'Vom Großvater. Der wusste mehr.', z2:'Erklärt hat er ihn nie.'},
    {key:'trepp', t:'Und der Zusteller?',
     z1:'Sitzt jeden Abend hier. Trinkt nichts.', z2:'Ich stell ihm was hin.'},
    {key:'letzte', frei:'gast', t:'Was verspricht der Name?',
     z1:'Dass einer den letzten setzt.', z2:'Irgendwann tut das jemand.'},
    {key:'regal', frei:'letzte', t:'Was steht oben im Regal?',
     z1:'Ein Krug. Der bleibt oben stehen.', z2:'Auch wenn alle anderen weg sind.'},
    {key:'warum', nach:3, t:'Warum rührt ihn keiner an?',
     z1:'Weil er gebraucht wird. Später.', z2:'So hat es der Großvater gesagt.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Setz dich erst mal.', z2:'Das dauert nämlich.', hub:true},
    angebot: {z1:'Du könntest ihn dir ansehen.', z2:'Anfassen ist was anderes.',
              opts: () => [
                {t:'Ich sehe ihn mir an.', tun: () => { szeneKnoten('dank'); }},
                {t:'Lass ihn stehen.', zu:'kein'},
              ]},
    dank:    {z1:'Kein Staub drauf. Ich mach das jede Woche.', z2:'Vierzig Jahre. Bisher.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumFass')}]},
    kein:    {z1:'Gut so. Setz dich lieber hin.', z2:'Der Käse kommt gleich.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumFass')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('warum')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumFass')},
};

// Der Baum der Bank. Einer für zwei Figuren, mit Sprecherwechsel: die zwei
// Fragen über Hintermühl und das gute Ende gehören Pahl, alles andere Lott.
// Das ist derselbe Griff, den SZ1 für Vorblatts Versammlung gebaut hat, hier
// aber der Witz der Figur: Lott redet über Pahl, und wenn es ernst wird, redet
// Pahl selbst.
SZENEN.baumBank = {
  baum:true, figur:'lott', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 8,
  sprecher: () => szeneSprecherAusDorf('lott'),
  fragen:[
    {key:'bank', t:'Wie lange sitzen Sie hier?',
     z1:'Länger als das Dorf steht.', z2:'Pahl sagt, das stimmt sogar.'},
    {key:'neu', t:'Warum der Neue?',
     z1:'Weil vor Ihnen schon viele kamen.', z2:'Der Name blieb. Sie wechseln.'},
    {key:'brummen', t:'Was brummt im Steinfeld?',
     z1:'Das war schon immer so.', z2:'Pahl hat mal nachgesehen.'},
    {key:'woher', frei:'bank', t:'Woher kommen Sie zwei?',
     z1:'Von flussaufwärts. Hintermühl.', z2:'Es gibt das nicht mehr.'},
    {key:'wiese', wer:'pahl', frei:'woher', t:'Was ist dort passiert?',
     // T1-Nachlese: Pahls groesster Moment stand in Lotts Register, drei
     // Fragmente statt eines Satzes. Das Bild "kein Feuer, ein Aktendeckel"
     // ist gepinnt und bleibt woertlich, es wird nur zum ganzen Satz.
     z1:'Passiert ist gar nichts. Das ist es ja.', z2:'Kein Feuer, nur ein Aktendeckel.'},
    {key:'steine', wer:'pahl', nach:3, t:'Auf der Wiese liegen Steine.',
     z1:'Sortiert. Das fällt Leuten auf.', z2:'Uns hat es niemand gedankt.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Da fragt uns selten wer.', z2:'Pahl, sag du erst.', hub:true},
    angebot: {z1:'Wir könnten sagen, wer das war.', z2:'Pahl findet die Frage unhöflich.',
              opts: () => [
                {t:'Wer war es denn?', tun: () => { szeneKnoten('dank'); }},
                {t:'Dann eben nicht.', zu:'kein'},
              ]},
    dank:    {wer:'pahl', z1:'Wir zwei. Am letzten Tag. Ohne Auftrag.', z2:'Man räumt auf. Macht man so.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumBank')}]},
    kein:    {z1:'Sehen Sie. Er hat es Ihnen erspart.', z2:'Setzen Sie sich lieber.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumBank')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('steine')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumBank')},
};

SZENEN.baumUmlauf = {
  baum:true, figur:'umlauf', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 12,
  sprecher: () => szeneSprecherAusDorf('umlauf'),
  fragen:[
    {key:'oben', t:'Wie ist es oben?',
     z1:'Vierzehn Türme, ein Aufzug, sauber.', z2:'Und sehr leise. Sehr.'},
    {key:'zettel', t:'Was steht auf dem Zettel?',
     z1:'Stellen. Vorne durch, hinten elf.', z2:'Die Rückseite wächst mit.'},
    {key:'rohr', t:'Warum laufen Sie?',
     z1:'Weil die Rohrpost steht. Seit immer.', z2:'Laufen geht auch. Schneller.'},
    {key:'ziel', frei:'oben', t:'Kommen Sie irgendwann an?',
     z1:'Ankommen ist nicht vorgesehen.', z2:'Weitergeben schon.'},
    {key:'einmal', frei:'ziel', t:'Waren Sie je fertig?',
     z1:'Einmal habe ich es versucht.', z2:'In Hochablage. Eine Stunde.'},
    {key:'stunde', nach:3, t:'Und wie war das?',
     z1:'Lang. Länger als jeder Weg.', z2:'Danach zwei Tage aufgeholt.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Ich bin selten irgendwo lange.', z2:'Fragen Sie schnell.', hub:true},
    angebot: {z1:'Ich könnte es noch mal versuchen.', z2:'Hier zum Beispiel. Kurz.',
              opts: () => [
                {t:'Setzen Sie sich doch.', tun: () => { szeneKnoten('dank'); }},
                {t:'Sie müssen ja weiter.', zu:'kein'},
              ]},
    dank:    {z1:'Eine Minute. Das ist mein Rekord.', z2:'Nett hier. Wirklich. Weiter.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumUmlauf')}]},
    kein:    {z1:'Ja. Elf Stellen. Sie verstehen.', z2:'War trotzdem nett bei Ihnen.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumUmlauf')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('stunde')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumUmlauf')},
};

SZENEN.baumVorblatt = {
  baum:true, figur:'vorblatt', haeltDieWelt:false, sicht:3, start:'hub',
  wenn: () => !CONFIG.schichtModus || amt.schichten >= 22,
  sprecher: () => szeneSprecherAusDorf('vorblatt'),
  fragen:[
    {key:'anhang', t:'Wofür sind Sie zuständig?',
     z1:'Für Anhängiges. Das ist beinahe alles.', z2:'Es wird gern unterschätzt.'},
    {key:'stempel', t:'Was steht auf dem Stempel?',
     z1:'Ihr Anliegen wird bearbeitet.', z2:'Das ist bereits sehr viel.'},
    {key:'wagen', t:'Und Ihr Fuhrwerk?',
     z1:'Zwei Amtsschimmel. Sehr verlässlich.', z2:'Was sie ziehen, lebt länger.'},
    // T1: die freundliche Umzingelung, seine Form der Laenge. Er sagt nie Nein
    // und droht nie (Reichsregel 3, Weltbibel Kapitel 13: wenn er einmal droht,
    // ist die Figur weg). Stattdessen prueft er gern, und die Pruefung wird
    // geprueft, und am Ende steht der Spieler genau dort, wo er angefangen hat.
    // Die Laenge tut, was er selbst nie taete. Drei Zuege reichen dafuer; wer
    // mehr baut, macht aus dem Schrecken eine Textwand.
    {key:'nein', frei:'anhang', t:'Sagen Sie jemals Nein?',
     z1:'Nein wäre eine Entscheidung.', z2:'Wir prüfen das lieber gern.',
     weiter:'nein2', wt:'Wie lange prüfen Sie?'},
    {key:'fach', frei:'nein', t:'Was liegt in Ihrem Fach?',
     z1:'Ein Stempel. Nicht mehr im Dienst.', z2:'Und nicht außer Dienst.'},
    {key:'alt', nach:3, t:'Warum nicht wegwerfen?',
     z1:'Ausmustern wäre eine Entscheidung.', z2:'Sie kennen das Problem.'},
  ],
  knoten:{
    hub:     {z1:'Von früher? Das ist ein anhängiger Zeitraum.', z2:'Fragen Sie unbesorgt.', hub:true},
    nein2:   {z1:'Bis die Prüfung geprüft ist.', z2:'Auch das prüfen wir gern.',
              opts: () => [{t:'Und dann?', zu:'nein3'}]},
    nein3:   {z1:'Dann ist Ihr Anliegen anhängig.', z2:'Das ist bereits sehr viel.'},
    angebot: {z1:'Ich könnte ihn Ihnen zeigen.', z2:'Gern. Zeigen ist unverbindlich.',
              opts: () => [
                {t:'Zeigen Sie ihn.', tun: () => { szeneKnoten('dank'); }},
                {t:'Nicht nötig.', zu:'kein'},
              ]},
    dank:    {z1:'Durchgeschrieben. Dreißig Jahre lang.', z2:'Er hat viel aufgehalten.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumVorblatt')}]},
    kein:    {z1:'Wie Sie wünschen. Wir prüfen das gern.', z2:'Hochablage grüßt sehr.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumVorblatt')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('alt')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumVorblatt')},
};

// ===========================================================================
//  T3: Anlage 2 auf Abruf
//
//  Derselbe Baum wie die dreizehn davor, mit zwei Unterschieden, die beide
//  daher kommen, dass sie kein Mensch im Dorf ist:
//
//  Kein figur:. Das Feld haengt einen Baum an eine Dorffigur und damit an die
//  F-Taste; Anlage 2 steht nirgends herum, sie liegt in der Tasche und wird
//  von dort aus angeklickt (anlage2Kachel()). Ohne figur: laesst szeneAssert()
//  die Figurpruefung aus, und baumFaellig() bietet sie niemandem an, der auf
//  dem Dorfplatz F drueckt. Genau richtig.
//
//  Kein wenn:. Die uebrigen Baeume oeffnen sich nach Schichten, weil eine
//  Lebensgeschichte Vertrauen braucht. Anlage 2 ist ab der ersten Minute da
//  und redet ab der ersten Minute, das ist ihr ganzer Zweck. Ihre Staffelung
//  liegt woanders: im Kommentarkanal, dessen waermere Zeilen Gates tragen.
//
//  Inhaltlich haelt jede Zeile die Brandmauer: Haus, Leute, Verfahren ja,
//  laufender Fall nein. Sie kann nicht einmal andeuten, was sie nicht weiss.
// ===========================================================================
SZENEN.baumAnlage2 = {
  // T5b-Fund: hier stand keine Sperre, und anlage2Assert() behauptet im Kopf,
  // "der Baum laeuft zusaetzlich in szeneAssert() gegen dieselbe Liste". Das
  // stimmte nicht. szeneAssert() prueft gegen st.sperre, und ohne das Feld
  // laeuft die Schleife ueber ein leeres Array. Ihre Brandmauer war im Baum
  // also ungeschuetzt, seit es den Baum gibt, und faellt genau dann auf, wenn
  // jemand dort neuen Text einbaut. Die uebrigen Baeume brauchen sie nicht:
  // Dorffiguren duerfen vom Fall reden, das ist ihr Inhalt (siehe SZ2). Sie
  // darf es nicht, und zwar als einzige.
  baum:true, haeltDieWelt:false, sicht:3, start:'hub', sperre:AKTE_SPERRE,
  sprecher: () => anlage2Sprecher(),
  // T4-Nachlese: der letzte freie Platz im Umschlag, und der einzige, der ihr
  // wirklich zusteht. Ihre Besessenheit steht seit T3 im Kanon: gelesen werden,
  // EINMAL, GANZ, von einem Menschen. Wer alle acht Fragen gestellt hat, hat
  // genau das getan, und bis heute sagte sie nichts dazu.
  //
  // Gezaehlt wird ueber Sitzungen hinweg und nicht in szene.gefragt: wer heute
  // vier Fragen stellt und morgen die restlichen drei, hat sie trotzdem ganz
  // gelesen. Der Haken schreibt jeden Schluessel genau einmal und prueft danach
  // gegen fragen[] statt gegen eine Zahl, damit eine achte Frage den Moment
  // nicht aus Versehen unerreichbar macht.
  gestellt: key => {
    if(kn.a2Gefragt[key]) return;
    kn.a2Gefragt[key] = true; saveKn();
    if(SZENEN.baumAnlage2.fragen.every(f => kn.a2Gefragt[f.key])) anlage2Umschlag('ganzGelesen');
  },
  fragen:[
    {key:'wer', t:'Was sind Sie genau?',
     z1:'Eine Anlage. Zweite von dreien.', z2:'Die Erste liegt nicht vor.'},
    {key:'haus', t:'Erzählen Sie vom Haus.',
     z1:'Fünf Leute, ein Ministerium.', z2:'Die Rechnung geht auf. Fragen Sie nicht wie.',
     weiter:'haus2', wt:'Fünf für ein Ministerium?'},
    {key:'klammer', t:'Und die Heftklammer?',
     z1:'Sitzt fest. Das ist ihr Beruf.', z2:'Ich habe da keine Wahl. Sie auch nicht.'},
    {key:'gelesen', frei:'wer', t:'Niemand hat Sie gelesen?',
     z1:'In all den Jahren keiner.', z2:'Sie sind eine Ausnahme. Erste.'},
    {key:'nn', frei:'haus', t:'Wer ist N. N.?',
     z1:'Niemand. Und zwar amtlich.', z2:'Zwei Türen tragen den Namen.',
     weiter:'nn2', wt:'Zwei Türen?'},
    {key:'formular', frei:'klammer', t:'Ihr liebstes Formular?',
     z1:'Der Antrag auf ein Dorffest.', z2:'Elf Fassungen. Ich kenne alle.'},
    {key:'was', nach:3, t:'Was steht auf Ihnen?',
     z1:'Das sehen Sie besser selbst nach.', z2:'Es liest sich schneller als ich rede.'},
    // T5b: der lange Weg. Kapitel 0 bis 5 der Weltbibel, auf Abruf und in
    // Kaskaden. Sie steht ohne frei: und ohne nach: und ist damit ab der ersten
    // Minute da, denn wer nichts weiss, kann nicht warten, bis er genug gefragt
    // hat. Die sechs Kapitel liegen in DREI Buendeln und nicht einzeln: eine
    // Antworttafel fasst vier Zeilen, sechs Themen plus Ausgang waeren sieben.
    {key:'welt', t:'Erklären Sie mir diese Welt.',
     z1:'Endlich fragt das mal jemand.', z2:'Ich liege seit vierzig Jahren bereit.',
     weiter:'welt0', wt:'Also?'},
  ],
  knoten:{
    hub:     {z1:'Von früher rede ich gern. Ich lag dabei.', z2:'Fragen Sie. Ich habe Zeit gehabt.', hub:true},
    haus2:   {z1:'Erhoben wurde das Amt vor langer Zeit.', z2:'Stellen kamen dabei keine dazu.',
              opts: () => [{t:'Und das geht?', zu:'haus3'}]},
    haus3:   {z1:'Es geht seit vierhundert Jahren.', z2:'Deshalb nennt man es Provisorium.'},
    nn2:     {z1:'Zimmer eins und die Amtsleitung.', z2:'Beide Schilder sagen dasselbe.',
              opts: () => [{t:'Und dahinter?', zu:'nn3'}]},
    nn3:     {z1:'Ein Schreibtisch. Eine Pflanze, die lebt.', z2:'Wer sie gießt, sagt nichts dazu.'},

    // ---- T5b: die Welt, Kapitel 0 bis 5 ------------------------------------
    // Das Menue. Drei Buendel plus Ausgang, weil die Tafel vier Zeilen fasst.
    // Jedes Buendel laeuft als Kaskade und kehrt hierher zurueck, damit man in
    // einer Sitzung alles hoeren kann, ohne die Tafel neu aufzumachen.
    welt0:   {z1:'Drei Sachen kann ich erklären.', z2:'Nehmen Sie, was Sie gerade brauchen.',
              opts: () => [
                {t:'Was ist hier eigentlich los?', zu:'welt1a'},
                {t:'Warum gibt es dieses Amt?',    zu:'welt2a'},
                {t:'Wo bin ich hier, und was?',    zu:'welt3a'},
                {t:'Ein andermal.',                zu:'hub'},
              ]},

    // Buendel 1: Kapitel 0 und 1. Hier faellt das Weltgesetz, und es faellt
    // wortwoertlich. Bis zum 26.08.2026 durfte es nirgends ausgesprochen
    // werden; seither ist es die oberste Doktrin des Hauses, und sie ist die
    // Figur, die es am besten erklaeren kann.
    welt1a:  {z1:'Kurz gesagt: was keiner bearbeitet,', z2:'das wird hier irgendwann lebendig.',
              opts: () => [{t:'Das ist ein Bild, oder?', zu:'welt1b'}]},
    welt1b:  {z1:'Nein. Das ist die Regel. Wörtlich.', z2:'Sie hat sogar einen Satz. Wollen Sie ihn?',
              opts: () => [{t:'Bitte.', zu:'welt1c'}]},
    welt1c:  {z1:'Ein Vorgang, den niemand abschließt,', z2:'nimmt Gestalt an. Das ist der ganze Satz.',
              opts: () => [{t:'Und das glaubt hier jeder?', zu:'welt1d'}]},
    welt1d:  {z1:'Glauben ist das falsche Wort dafür.', z2:'Er steht über der Tür. Wie ein Ortsschild.',
              opts: () => [{t:'Dann sind die Monster...', zu:'welt1e'}]},
    welt1e:  {z1:'Vorgänge. Jedes trägt ein Aktenzeichen.', z2:'Sehen Sie mal genau hin, es steht klein dran.',
              opts: () => [{t:'Und wenn ich eines erledige?', zu:'welt1f'}]},
    welt1f:  {z1:'Dann wird es geschreddert. Daher das Konfetti.', z2:'Hier stirbt nichts. Hier wird abgeschlossen.',
              opts: () => [{t:'Verstanden.', zu:'welt0'}]},

    // Buendel 2: Kapitel 2 und 4. Ohne den Fall, denn den kennt sie nicht
    // (Brandmauer). Sie erzaehlt die Entstehung des Hauses, nicht den Vorgang,
    // der darin liegt.
    welt2a:  {z1:'Weil vor sehr langer Zeit etwas liegen blieb.', z2:'Dann noch etwas. Dann ziemlich viel.',
              opts: () => [{t:'Und dann?', zu:'welt2b'}]},
    welt2b:  {z1:'Dann hat man ein Amt eingerichtet.', z2:'Vorläufig. Das Wort steht heute noch drauf.',
              opts: () => [{t:'Wie lange ist vorläufig?', zu:'welt2c'}]},
    welt2c:  {z1:'Vierhundert Jahre, Stand heute Morgen.', z2:'Später wurde es zum Ministerium erhoben.',
              opts: () => [{t:'Dann ist es ja groß.', zu:'welt2d'}]},
    welt2d:  {z1:'Es kam keine einzige Stelle dazu.', z2:'Fünf Leute. Ein Ministerium. Nicht nachrechnen.',
              opts: () => [{t:'Gut. Danke.', zu:'welt0'}]},

    // Buendel 3: Kapitel 3 und 5. Die Landschaft ist die Ablage, und der
    // Spieler ist der Aussendienst. Der letzte Zug ist der warme: sie sagt ihm,
    // dass Nichtwissen hier der Normalzustand ist.
    welt3a:  {z1:'Die ganze Gegend hier ist eine Ablage.', z2:'Jede Landschaft ist ein Ort, wo etwas liegt.',
              opts: () => [{t:'Zum Beispiel?', zu:'welt3b'}]},
    welt3b:  {z1:'Das Grasland heißt amtlich Ablage A.', z2:'Der Frostkamm ist die Ablage auf Eis.',
              opts: () => [{t:'Und das Meer?', zu:'welt3c'}]},
    welt3c:  {z1:'Die Tilgung. Was dort hineingeht, ist weg.', z2:'Deshalb baut hier niemand nah ans Wasser.',
              opts: () => [{t:'Und ich? Was bin ich hier?', zu:'welt3d'}]},
    welt3d:  {z1:'Außendienst. Sie gehen hin, wo es liegt.', z2:'Drinnen wird verwaltet, draußen wird bearbeitet.',
              opts: () => [{t:'Ich weiß gar nichts davon.', zu:'welt3e'}]},
    welt3e:  {z1:'Ich weiß. Das ist hier der Normalfall.', z2:'Deshalb liege ich dabei. Fragen Sie ruhig oft.',
              opts: () => [{t:'Mache ich.', zu:'welt0'}]},
    // Der Ausgang, nachdem alles gefragt wurde. Das ist die einzige Stelle des
    // Baumes, an der sie ueber sich selbst spricht statt ueber das Haus, und
    // sie tut es in der Form, die ihr gehoert: als Vermerk.
    angebot: {z1:'Eine Bitte hätte ich. Formlos.', z2:'Sie kostet nichts und dauert kurz.',
              opts: () => [
                {t:'Bitte sehr.', zu:'dank'},
                {t:'Später vielleicht.', zu:'kein'},
              ]},
    // T4: der Kipppunkt der Figur, und er liegt genau hier. Wer zusagt, setzt
    // den Merker anlage2Dank, und der oeffnet ihre waermeren Zeilen im Band.
    // Kein Gold, keine Erfahrung, kein Vorteil: die Belohnung ist, dass sie
    // anders mit einem spricht. Ausgeloest wird er von einer Spieleraktion und
    // nie von einer Uhr, denn eine Figur, die nach zwanzig Minuten von selbst
    // zutraulich wird, hat nichts erlebt, sondern nur gewartet.
    //
    // Der Weg ist szeneEnde(key, merker), dieselbe Mechanik wie bei baumEimer
    // und den vier Szenen. Wer die Tafel stattdessen mit dem Kreuz schliesst,
    // latcht nicht: das Zusagen ist der Ausgang und nicht das Anschauen.
    dank:    {z1:'Sehen Sie ab und zu nach, ob ich noch da bin.', z2:'Mehr nicht. Es genügt völlig.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => { anlage2Umschlag('dank'); szeneEnde('baumAnlage2', 'anlage2Dank'); }}]},
    kein:    {z1:'Selbstverständlich. Sie ist formlos.', z2:'Formlose Bitten verjähren nicht.',
              opts: () => [{t:'Auf Wiedersehen.', tun: () => szeneEnde('baumAnlage2')}]},
  },
  hubAusgang: () => szene.gefragt && szene.gefragt.has('was')
    ? {t:'Eine Sache noch.', zu:'angebot'}
    : {t:'Auf Wiedersehen.', tun: () => szeneEnde('baumAnlage2')},
};

// Ihr Sprecher. Ein Objekt fuer die ganze Sitzung und nicht eines je Aufruf:
// dieselbe Begruendung wie bei knNpc seit U6, denn gespraech.npc wird an
// mehreren Stellen mit === verglichen, und zwei Objekte fuer dieselbe Figur
// waeren zwei Figuren.
//
// Kein sheetIdle, keine Toenung, kein Platz in der Welt. gespraechPortrait()
// braucht davon nichts, solange die 128er-Datei da ist, und die liegt in
// assets/portraets und damit ausserhalb des Grafikpakets.
const ANLAGE2_FIGUR = {key:'anlage2', name:'Anlage 2', kurz:'Anlage 2', opt:'fest'};
const anlage2Npc = {key:'anlage2', figur:ANLAGE2_FIGUR, x:0, y:0};
function anlage2Sprecher(){ return anlage2Npc; }

// Gemeinsames Ende der drei Szenen: Merker setzen, den Chor auf der Bank
// vormerken, Tafel zu.
//
// Der Nachklang laeuft NICHT ueber knRandnotiz(). Das verlangt einen
// RANDNOTIZ-Pool, also eine eigene Notiz Knoeterichs, und laeuft durch seine
// Tonstellungs-Gates. Beides ist hier falsch: Knoeterich kommentiert Szene 4
// nicht, er ist gerade weggegangen. letzterAnlass wird deshalb direkt gesetzt,
// npcSprechen() verbraucht es unveraendert, und nur Lott und Pahl haben
// Anlasszeilen.
// Szene 3 steht bewusst nicht darin: die Weltgeschichte gibt Lott und Pahl
// dort keinen Einwurf, und einen zu erfinden waere Fuellmaterial an der
// stillsten Stelle des Spiels.
const SZENE_ANLASS = {umlauf:'umlauf', knoeterich:'hintermuehl'};
function szeneEnde(key, merker){
  if(merker && !kn.flags[merker]){ kn.flags[merker] = true; saveKn(); }
  if(SZENE_ANLASS[key]) letzterAnlass = SZENE_ANLASS[key];
  szeneAus();
  // T8: und Anlage 2, die dabei die ganze Zeit in der Tasche lag. HINTER
  // szeneAus() und nicht davor, und das ist keine Stelle, die man frei waehlen
  // kann: szeneAus() gibt state aus 'szene' an 'play' zurueck, und
  // knLineErlaubt() prueft genau darauf. Davor faellt die Zeile nie.
  if(SZENE_ANLASS[key]) anlage2Szene(SZENE_ANLASS[key]);
}

// Eine Zeile der Liste in die Form bringen, die gespraechWaehlen() erwartet.
const szeneOpt = o => ({t:o.t, zu:o.zu, tun: o.tun || (() => szeneKnoten(o.zu))});

// Die Antwortliste der Szene. Auf einem hub-Knoten sind es die offenen Fragen
// plus der Ausgang, sonst die Liste des Knotens selbst. Eine beantwortete
// Frage ist selbst ein hub: man steht wieder vor derselben Tafel, nur um eine
// Zeile ärmer und um eine Nachfrage reicher.
function szeneOptionen(){
  const d = szeneDef();
  if(!d) return [];
  const k = d.knoten[szene.knoten];
  if(k && k.opts) return k.opts().filter(o => !o.wenn || o.wenn()).map(szeneOpt);
  // T1, die zweite echte Erweiterung der Maschine: eine Frage darf eine
  // Fortsetzung tragen. weiter: nennt den Knoten, in dem die Figur weiterredet,
  // wt: die Zeile, mit der der Spieler sie weiterreden laesst. Genau eine
  // Option, denn eine Kaskade ist ein Monolog mit Einverstaendnis und keine
  // Verzweigung; der letzte Knoten der Kette hat keine opts und faellt damit
  // von selbst auf den Hub zurueck.
  //
  // Das ist der Kanal fuer die Laenge, die Kapitel 13 seit T1 verlangt: eine
  // ausfuehrliche Figur redet nicht in laengeren Zeilen, sondern in mehr
  // Zeilenpaaren hintereinander. Der Zeichendeckel bleibt dadurch unangetastet,
  // und der Spieler bleibt der Gerade (Humor-Grundgesetz 11): er klickt jeden
  // Zug einzeln weiter und darf jederzeit gehen.
  const fr = szeneFrage(szene.knoten);
  if(fr && fr.weiter) return [szeneOpt({t: fr.wt, zu: fr.weiter})];
  // Ein hub-Knoten zeigt die offenen Fragen plus den Ausgang der Szene. Ohne
  // Fragenliste gibt es keine hubs, dann ist das hier unerreichbar und
  // szeneAssert() meldet den Knoten ohne Ausgang.
  const liste = szeneOffen().slice(0, d.sicht || 3).map(f => ({t:f.t, zu:f.key}));
  if(d.hubAusgang) liste.push(d.hubAusgang());
  return liste.map(szeneOpt);
}

// Einen Knoten setzen und sprechen lassen. Fragen merken sich, dass sie
// gestellt wurden, und schalten damit ihre Nachfragen frei.
//
// SZ1, die einzige echte Erweiterung der Maschine: ein Knoten darf mit wer: die
// sprechende Figur wechseln. Der Empfang braucht das nicht, er hat nur einen
// Sprecher. Szene 7 braucht es, dort geht Vorblatt durch acht Leute hindurch,
// und ohne Portraetwechsel waere eine Versammlung eine Wand aus Text.
function szeneKnoten(key){
  const d = szeneDef();
  if(!d) return;
  const frage = szeneFrage(key);
  // T4-Nachlese: ein optionaler Haken je Szene, gleiche Bauart wie d.ende. Die
  // Maschine meldet nur, DASS eine Frage gestellt wurde; was daraus folgt,
  // steht bei der Szene und nicht hier. Bisher benutzt ihn genau eine.
  if(frage){ szene.gefragt.add(key); if(d.gestellt) d.gestellt(key); }
  szene.knoten = key;
  const k = d.knoten[key] || frage;
  if(!k){ if(d.ende) d.ende(); return; }       // unerreichbar, szeneAssert() prüft das
  if(k.wer) szeneSprecherSetzen(k.wer);
  gespraechSagen(k.z1, k.z2);
}

// Das Portraet und den Namen in der Kopfzeile auf eine andere Figur setzen.
// Nimmt dieselbe Quelle wie szeneOeffnen(): entweder ein Schluessel aus
// DORF_FIGUREN oder eine fertige Portraetquelle.
function szeneSprecherSetzen(wer){
  const n = typeof wer === 'function' ? wer() : szeneSprecherAusDorf(wer);
  if(!n) return;
  gespraech.npc = n; gespraech.fig = n.figur;
  // Die Kopfzeile wird hier gesetzt und nicht dem naechsten gespraechZeichnen()
  // ueberlassen. Der Wechsel des Sprechers IST Portraet plus Name; haengt der
  // Name an einem anderen Aufruf, steht nach einem Wechsel ohne neuen Satz das
  // falsche Schild ueber der richtigen Figur.
  if(gespraechOffen) el('gespraechNameTxt').textContent = n.figur.name;
  gespraechPortrait(n);
}

// Eine Dorffigur als Portraetquelle. Sie steht als Eintrag in npcs im Dorf; von
// dort kommt das Blatt, das npcBlaetter() ihr zugewiesen hat, samt Toenung.
// Faellt auf die Tabellenzeile zurueck, falls die Figur (noch) nicht gesetzt
// ist, damit eine Szene nie stumm bleibt, nur weil sie zu frueh laeuft.
function szeneSprecherAusDorf(key){
  const n = npcs.find(x => x.key === key);
  if(n) return n;
  const f = DORF_FIGUREN.find(x => x.key === key);
  if(!f) return null;
  const b = npcBlaetter(f);
  return {sheetIdle:b.idle, tint:f.tint||null, tintA:f.tintA, figur:f};
}

// Der Vordruck aus der Szene heraus. Er läuft danach seinen eigenen Weg zu
// Ende (dienstAntritt() auf Blatt 3), die Szene ist damit beendet.
function empfangVordruck(){
  szeneAus();
  showDienstblatt(1, 'einstellung', 0);
}

// Unterschrift ohne Umweg über die drei Blätter. Derselbe Aufruf, den auch der
// Knopf auf Blatt 3 auslöst, und damit derselbe Merker in kn.seen.
// T2: Die Ernennung laeuft zwischen Unterschrift und erstem Schritt. Die Buehne
// kommt dafuer zurueck, wie beim Intro: es ist ein Rechtsakt des Hauses, und das
// Haus macht keinen Rechtsakt vor laufender Weltkulisse. Danach faellt beides,
// die Buehne und die Tafel, und der Dienst beginnt.
//
// AN4: Der letzte Knopf hiess HINAUSGEHEN, und das war richtig, solange der
// Stapel den Weg vor die Tuer selbst gegangen ist. Seit AN2 geht ihn der
// Spieler. Der Knopf sagt jetzt, was auf diesem Blatt wirklich geschieht: die
// Urkunde wird uebernommen. Derselbe Fall wie ANKLOPFEN -> ZUR SACHE in AN3.
function empfangErnennung(){
  szeneTafelZu();
  buehneAn();
  szeneTafeln(ERNENNUNG_BLAETTER, {letzterKnopf:'ÜBERNEHMEN', ende: ernennungEnde,
                                   kladde: anfangSchluessel('ernennung')});
}

// AN4: Hier stand anlage2Erstes, und damit hing der Erstkontakt der Anlage 2
// als siebte bis zwoelfte Lesestufe an der Ernennung. Gemessen war das der
// teuerste Block des ganzen Anfangs: 751 Woerter auf 7 Lesestufen ohne eine
// einzige echte Wahl (intro-pruef, Pflichtweg, Stand AN3).
//
// Jetzt endet die Ernennung dort, wo der Rechtsakt endet, und der Dienst
// beginnt sofort danach. Der Merker traegt die Anlage 2 ueber die Luecke bis
// zum ersten Hinausgehen; gesetzt wird er hier und an keiner zweiten Stelle.
function ernennungEnde(){
  if(!kn.flags.anlage2Wartet){ kn.flags.anlage2Wartet = true; saveKn(); }
  empfangEnde();
}

// AN4: Der Schritt vor die Tuer loest den Erstkontakt aus, genau einmal.
//
// Gerufen wird das aus fuehreAktion(), Fall AKT_HAUSAUS, und NICHT aus
// verlasseHaus(). Dieselbe Funktion raeumt naemlich auch respawnPlayer() und
// startShift() den Innenraum weg, und der Pult in der Amtsstube bietet das
// Amtsfenster an: ein Schichtende von drinnen wuerde den Stapel sonst aus einem
// Reset-Pfad heraus starten. innen-pruef faehrt genau diesen Fall.
//
// Der Merker wird VOR dem Stapel verbraucht und nicht in seinem Abschluss. Wer
// ihn erst danach loescht, wiederholt den Erstkontakt bei jedem weiteren
// Hinausgehen, sobald ein Spieler den Stapel einmal nicht zu Ende blaettert.
function anlage2VorDemHaus(){
  if(!kn.flags.anlage2Wartet) return;
  kn.flags.anlage2Wartet = false; saveKn();
  anlage2Erstes();
}

// T3: Zwischen der Ernennung und dem Dorf steht das erste Treffen. Es ist ein
// eigener Stapel und kein angehaengtes siebtes Blatt der Ernennung, und das aus
// zwei Gruenden: die Ernennung gehoert dem Haus und endet mit der Uebernahme,
// und ein eigener Stapel zaehlt seine Blaetter selbst. Wer die Urkunde bekommen
// hat, faengt hier an zu lesen.
//
// AN4: Er laeuft jetzt VOR dem Haus statt darin, und damit stimmt sein erster
// Satz wieder woertlich ("Sie stehen zum ersten Mal vor dem Haus statt darin").
// Zwei Folgen davon stehen hier:
//   - buehneAn() bleibt aus. Das Dorf liegt da, und das ist der Ort, den der
//     Auftakt beschreibt. Ein Rechtsakt ist das hier ohnehin nicht mehr,
//     sondern ein Blatt, das anfaengt zu reden.
//   - Der Abschluss ist nicht mehr empfangEnde. Der Dienst laeuft seit dem Ende
//     der Ernennung; dienstAntritt() ein zweites Mal zu rufen hiesse, den Anfang
//     zweimal zu beenden. Genommen wird derselbe Abschluss, den
//     anlage2Nachholen() seit T3 benutzt, nur ohne den Rucksack dahinter.
function anlage2Erstes(){
  szeneTafeln([ANLAGE2_AUFTAKT_ERNENNUNG, ANLAGE2_FRAGE[0]].concat(ANLAGE2_BLAETTER),
              {letzterKnopf:'EINSTECKEN', wahl:{bei:1, reihe:ANLAGE2_FRAGE},
               ende: anlage2Angenommen(() => {
                el('overlay').style.display = 'none';
                MUS.muffle(false);
               })});
}

// Der gemeinsame Abschluss beider Wege. Er setzt den einen Merker, der alles
// weitere traegt, und uebergibt dann an das, was danach kommt: in den Dienst
// beim ersten Weg, zurueck in den Rucksack beim nachgeholten.
// T6: Die Reihenfolge in dieser Funktion ist nicht beliebig. anlage2Umschlag()
// gibt vor dem Merker false zurueck, das Scharfschalten muss also HINTER die
// Zeile, die ihn setzt. Faellig wird die Zeile nur, wenn der Spieler bis zur
// letzten Stufe abgelehnt hat, also den gesperrten Knopf gesehen hat. Wer
// einmal oder gar nicht abgelehnt hat, hoert sie nie.
function anlage2Angenommen(danach){
  return (stufe) => {
    if(!kn.flags.anlage2Da){ kn.flags.anlage2Da = true; saveKn(); }
    if((stufe | 0) >= ANLAGE2_FRAGE.length - 1) anlage2Umschlag('zoegerlich');
    danach();
  };
}

function empfangEnde(){
  empfangSchliessen();
  dienstAntritt();
}

// Die Szene endet, die Buehne bleibt. Das ist der Weg auf den Vordruck: er
// gehoert noch zum Anfang, also steht er auf demselben Schwarz und nicht
// ueber dem Dorf. Das Dorf kommt erst mit der Unterschrift.
function szeneAus(){
  szeneAktiv = null;                          // erst die Flagge, dann schließen
  gespraechSchliessen();
  el('gespraechZu').style.display = '';
  // Die Welt laeuft weiter. aktSperre verhindert, dass der Tastendruck, der die
  // Szene beendet hat, im selben Moment die naechste Kontextaktion ausloest.
  if(szeneStateVorher){ state = szeneStateVorher; szeneStateVorher = null; aktSperre = 0.4; updateHUD(); }
}

// Alles zurueck. Laeuft ueber dienstAntritt(), also ueber beide Enden des
// Anfangs, und ist auf einem nie begonnenen Empfang ein harmloser Leerlauf.
function empfangSchliessen(){
  szeneAus();
  buehneAus();
  document.body.classList.remove('szeneLaeuft');
}

// Knöterichs Porträt. Er ist die einzige Figur des Ensembles ohne Eintrag in
// DORF_FIGUREN: er steht nicht im Dorf, er steht im Haus (KN_POS, drawAlter).
// Sein Bild entsteht deshalb auf demselben Weg wie das der Figuren ohne
// Pack-Blatt, als Held-Komposit aus KN_GESTALT, und mit derselben grauen
// Tönung, die ihn auch in der Welt trägt.
//
// G8: gebacken wird das Blatt seit G8 in bakeAllNpcSheets() zusammen mit den
// übrigen, weil drawAlter() es jetzt ebenfalls zeichnet. Die Zeile hier bleibt
// als Netz für den Fall, dass eine Szene vor dem Laden startet — sie ist dann
// derselbe Aufruf mit demselben Ergebnis, kein zweiter Kanon.
function szeneSprecherKnoeterich(){
  if(!SHEETS[EMPFANG_BLATT]) bakeNpcSheet(EMPFANG_BLATT, KN_GESTALT, 'idle');
  // Dieselbe Farbe wie drawAlter(), aber schwaecher aufgetragen. Das ist kein
  // zweiter Kanon, sondern dieselbe Aussage in einer anderen Groesse: in der
  // Welt ist die Figur 24 Pixel hoch und braucht 0.82, damit "alt und grau"
  // ueberhaupt ankommt. Im fuenffach vergroesserten Portraet deckt derselbe
  // Wert Gesicht und Falten zu, und Knoeterich sah aus wie ein unfertiges
  // Blatt. Nachgemessen am Bild, nicht geschaetzt: 0.82 war eine graue
  // Flaeche, 0.45 noch immer teigig, 0.30 laesst Gesicht und Kittel stehen
  // und bleibt trotzdem erkennbar dieselbe graue Figur wie in der Welt.
  // U6: Zurueck kommt der eine Eintrag (knNpc) und nicht mehr ein frisch
  // gebautes Objekt je Aufruf. Das war solange harmlos, wie Knoeterich nur in
  // Szenen sprach; seit er eine eigene Tafel hat, waere es eine zweite Figur
  // mit demselben Namen: gespraech.npc !== knNpc, und die Blase ueber seinem
  // Kopf wuesste waehrend einer Szene nicht, dass er gerade spricht.
  return knNpc;
}

// --- Das Dienstsiegel -------------------------------------------------------
// Die Bürokraten sind der Adel dieser Welt, also führt das Haus ein Wappen.
// Es zeigt einen Paragrafen, denn etwas anderes hat es nicht. Gezeichnet aus
// Kreisen und Strichen, keine neue Grafikdatei und kein Zeichenschritt im
// Renderpfad: das hier ist SVG im Panel und nicht auf der Leinwand.
const SIEGEL_ZAEHNE = 32;
function siegelSvg(px){
  let zaehne = '';
  for(let i = 0; i < SIEGEL_ZAEHNE; i++){
    const w = (i / SIEGEL_ZAEHNE) * Math.PI * 2;
    const c = Math.cos(w), sn = Math.sin(w);
    zaehne += `<line x1="${(32+c*25.5).toFixed(2)}" y1="${(32+sn*25.5).toFixed(2)}"`
            + ` x2="${(32+c*29).toFixed(2)}" y2="${(32+sn*29).toFixed(2)}"`
            + ` stroke="#8a6d3b" stroke-width="1.4"/>`;
  }
  return `<svg class="amtSiegel" viewBox="0 0 64 64" width="${px}" height="${px}" aria-hidden="true">
    <circle cx="32" cy="32" r="30.2" fill="none" stroke="#6b5a3a" stroke-width="1"/>
    ${zaehne}
    <circle cx="32" cy="32" r="24.6" fill="none" stroke="#c9a227" stroke-width="1.6"/>
    <circle cx="32" cy="32" r="21.2" fill="none" stroke="#7a5a10" stroke-width="1"/>
    <text x="32" y="43" text-anchor="middle" font-size="30" font-weight="bold"
          fill="#f4d97a" font-family="Georgia,'Times New Roman',serif">§</text>
  </svg>`;
}

const AMT_KOPFZEILE = 'Ministerium für Monsterangelegenheiten';
const ROEMISCH = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// --- Die Buehne -------------------------------------------------------------
// Schwarz unter dem ganzen Anfang. Das Dorf kommt erst, wenn der Empfang
// beginnt, und dann als Auftritt statt als Hintergrundrauschen.
function buehneAn(){
  el('introBuehne').innerHTML = `
    <div style="position:absolute;left:50%;top:32%;transform:translate(-50%,-50%);text-align:center;width:min(600px,88vw);">
      ${siegelSvg(104)}
      <p class="amtKopf" style="margin-top:10px;">${gEsc(AMT_KOPFZEILE)}</p>
      <hr class="amtRegel">
      <p class="amtFuss">Vordermühl an der Ablage</p>
    </div>`;
  el('introBuehne').style.display = 'block';
  document.body.classList.add('introBuehne');
}
function buehneAus(){
  el('introBuehne').style.display = 'none';
  el('introBuehne').innerHTML = '';
  document.body.classList.remove('introBuehne');
}

// Die Gespraechstafel oeffnen, ohne eine Weltfigur davorzustellen. Wird von
// beiden Haelften des Anfangs benutzt, der Vorstellung und dem Empfang.
// SZ2: Welche Szene will uebernehmen, wenn diese Figur angesprochen wird?
//
// Bauform aus langAnsprechen(): eine reine Nachschlagefunktion ueber die
// Tabelle, kein Sonderfall an der Figur. Eine Szene meldet sich mit figur: an
// und sagt in wenn(), wann sie faellig ist. Beides steht in der Tabelle, damit
// szeneAssert() es lesen kann, ohne eine Szene zu starten.
function szeneFaellig(figurKey){
  for(const k in SZENEN){
    const d = SZENEN[k];
    if(d.baum) continue;              // F1d: Bäume gehören der Tafel, nicht der F-Taste
    if(d.figur !== figurKey) continue;
    if(d.wenn && !d.wenn()) continue;
    return k;
  }
  return null;
}

// F1d: dasselbe für die Gesprächsbäume, und die Trennung ist der ganze
// Unterschied zwischen ihnen und den drei Szenen aus SZ2. Eine Szene fällt über
// den Spieler her, sobald er die Figur anspricht, läuft genau einmal und hält
// die Welt an. Ein Baum wartet in der Antwortliste, läuft, so oft jemand mag,
// und die Welt läuft weiter. Beides ist dieselbe Maschine, nur zwei Türen.
//
// Steht der speziellere Baum vor dem allgemeineren, gewinnt er: diese Schleife
// nimmt den ersten, dessen wenn() zutrifft, und die Reihenfolge in SZENEN ist
// die Reihenfolge der Einträge.
function baumFaellig(figurKey){
  for(const k in SZENEN){
    const d = SZENEN[k];
    if(!d.baum || d.figur !== figurKey) continue;
    if(d.wenn && !d.wenn()) continue;
    return k;
  }
  return null;
}

// Der Zustand vor der Szene, damit szeneAus() ihn zurueckgeben kann. Eine
// Modulvariable und kein Feld an szene: sie gehoert der Welt, nicht der Szene.
let szeneStateVorher = null;

function szeneOeffnen(key, knoten){
  const d = SZENEN[key];
  if(!d) return;
  // F1d: Jede Szene faengt mit einem leeren Fragen-Satz an. Bis hierher stand
  // diese Zeile nur in empfangStarten(), und das ist gutgegangen, weil die drei
  // Szenen aus SZ2 gar keine Fragenliste haben: szeneOffen() lief bei ihnen nie.
  // Die Baeume haben eine, und damit war das null ein echter Absturz beim
  // Oeffnen. Gefunden nicht vom Guard, sondern beim Durchklicken.
  //
  // Sie steht hier und nicht im Aufrufer, weil ein Baum wiederbetretbar ist:
  // wer zum zweiten Mal hineingeht, soll wieder alle Fragen vorfinden.
  szene.gefragt = new Set();
  // SZ2: Eine Szene mitten im Dienst haelt die Welt an. Exakt das Muster von
  // state = 'zustellung': update(dt) steigt bei state !== 'play' aus, und
  // gespraechTick(dt) laeuft davor weiter, das Tippwerk bleibt also lebendig.
  // Kein neuer Renderpfad, kein Vorhang, keine zweite Schleife. Der Empfang
  // braucht das nicht, er laeuft ohnehin vor dem ersten Schritt.
  if(d.haeltDieWelt && state === 'play'){ szeneStateVorher = state; state = 'szene'; aktArt = 0; updateHUD(); }
  szeneAktiv = key;
  const n = d.sprecher();
  gespraech.npc = n; gespraech.fig = n.figur; gespraech.wahl = 0;
  gespraechOffen = true;
  el('gespraech').style.display = 'block';
  el('gespraechZu').style.display = 'none';   // die Szene hat nur einen Ausgang
  gespraechPortrait(n);
  gespraechIchPortrait();                     // U4: die untere Haelfte
  szeneKnoten(knoten);
  panelSicht();
}

// Die Tafel zumachen, ohne sie zu schliessen: szeneAktiv bleibt stehen, die
// Szene laeuft weiter. gespraechSchliessen() prallt waehrend einer Szene ab
// (das ist seine Aufgabe), also steht der Weg hier ausgeschrieben.
function szeneTafelZu(){
  gespraechOffen = false;
  el('gespraech').style.display = 'none';
  MUS.muffle(); panelSicht();
}

