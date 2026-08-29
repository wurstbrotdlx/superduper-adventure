// skript/07-tafeln-und-start.js - Teil 7 von 7 des einen Spielskripts.
// Inhalt: Anrisstafeln, Dienstgestalt, Wiedereinsetzung, Steuerung, loop(), UI-Skin, Ladekette.
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
'use strict';
// --- Ab hier unveraendert aus index.html geschnitten (Teilung vom 29.08.2026). ---
// --- Die Anrisstafeln -------------------------------------------------------
// Sie laufen im #overlay auf der schwarzen Buehne. Weitergeblättert wird per
// Klick, nichts läuft von selbst ab. Das ist der Unterschied, auf dem
// Kapitel 14 besteht, und er ist keine Wortklauberei: wer nicht drückt, steht
// hier bis morgen.
//
// Die Optik ist die einer Urkunde und nicht die eines Hinweisfensters:
// Kopfzeile in gesperrten Versalien, Doppellinie, Siegel, römische Blattzahl.
// Das ist Humor-Grundgesetz 10 als Layout. Der Aufwand, mit dem dieses Haus
// eine Sache aufmacht, von der es selbst nicht weiß, worum es geht, IST die
// Pointe. Deshalb darf hier nichts bescheiden aussehen.
// SZ1: Der laufende Tafelstapel. Liste, Beschriftung des letzten Knopfes und
// was danach geschieht, stehen als Zustand daneben und nicht als Literal in der
// Zeichenfunktion. Damit blaettert dieselbe Optik das Intro (vier Blaetter) und
// spaeter den Abspann (dreizehn Bilder), ohne dass eine zweite Zeichenstelle
// entsteht. Der Aufsteller ist eine Modulvariable und kein Feld an szene: ein
// Tafelstapel kann auch ausserhalb einer Szene laufen, das Intro tut es.
let szeneTafelLauf = null;

// SZ2: Der zweite Knopf ist jetzt ein Parameter und kein Literal mehr. In SZ1
// stand dort fest empfangUeberspringen() — ein Rest des Empfangs in einer
// Funktion, die schon allgemein sein sollte. Das Intro benutzt ihn weiter zum
// Ueberspringen, die vierzig Zwischenbescheide benutzen denselben Knopf, um ans
// Ende zu springen. Ein Knopf, zwei Bedeutungen, keine zweite Zeichenstelle.
// T6: opt.wahl haengt eine Entscheidung an GENAU EIN Blatt des Stapels,
// {bei:<index>, reihe:[...]}. Das Blatt an diesem Index wird dann nicht aus
// liste gelesen, sondern aus reihe[stufe], und der Nein-Knopf zaehlt die Stufe
// hoch, ohne den Index zu bewegen.
//
// Warum die Wahl am LAUF haengt und nicht am Blatt: szeneAssert() verlangt von
// jedem Eintrag in liste genau eine der beiden Lesarten (z1/z2 oder
// blatt/stimme). Ein Platzhalter-Blatt, das nur auf eine Reihe zeigt, traegt
// keine davon und haette den Guard beim Laden ausgeloest. So steht in liste ein
// vollwertiges Blatt (reihe[0]), und der Guard sieht nur, was er kennt.
// AN5: opt.kladde ist eine Schluesselreihe PARALLEL zu liste, oder nichts.
// Traegt der Stapel sie, hakt szeneTafel() jedes gezeigte Blatt in der Kladde
// ab. Der Stapel weiss damit selbst, was er eintraegt, und szeneTafel() muss
// keine Blattliste wiedererkennen -- dieselbe Bauform wie letzterKnopf und
// ende. Stapel ohne die Reihe (Requisiten, Anlage 2, Abspann,
// Zwischenbescheide) tragen nichts ein, und das ist der Normalfall.
function szeneTafeln(liste, opt){
  szeneTafelLauf = {liste, letzterKnopf: opt.letzterKnopf, ende: opt.ende, zweiter: opt.zweiter || null,
                    wahl: opt.wahl || null, stufe: 0, kladde: opt.kladde || null};
  szeneTafel(0);
}

// Der Nein-Knopf einer Wahl. Eigene Funktion aus demselben Grund wie
// szeneTafelZweiter(): sie steht im onclick und muss szeneTafelLauf zur
// Klickzeit lesen, nicht zur Bauzeit.
//
// Die Stufe laeuft bis zur letzten und bleibt dort stehen. Die letzte traegt
// gesperrt:true, ihr Knopf ist also disabled und ruft das hier gar nicht mehr
// auf; der Deckel ist trotzdem da, damit ein spaeterer Umbau der Reihe nicht
// ueber ihr Ende hinauslaeuft und undefined zu zeichnen versucht.
function szeneTafelWahlNein(){
  const lauf = szeneTafelLauf;
  if(!lauf || !lauf.wahl) return;
  lauf.stufe = Math.min(lauf.stufe + 1, lauf.wahl.reihe.length - 1);
  szeneTafel(lauf.wahl.bei);
}

// Roemisch, solange die Zaehlung fuer den GANZEN Stapel reicht, sonst arabisch
// fuer den ganzen Stapel. Die Schreibweise gehoert dem Stapel und nicht der
// einzelnen Zahl: eine Zahl je Zeile entschieden ergab "Blatt I von 40", weil
// ROEMISCH bis zehn geht und vierzig darueber liegt. Kein Fehler im Sinn eines
// Absturzes, aber eine Fussnote, die aussieht wie einer. Gefunden im Bild, nicht
// im Guard.
//
// Das Intro ist zu viert und bleibt damit roemisch, die Anrisstafeln waren es zu
// fuenft, und die vierzig Zwischenbescheide aus Szene 3 zaehlen arabisch. Das
// ist auch inhaltlich richtig: eine Urkunde zaehlt roemisch, ein Stapel
// Zwischenbescheide ist eine Menge.
//
// AN3-Nachlese: hier stand "zu neunt", und die Neun gab es seit T1 nicht mehr.
// Sichtbar falsch wurde davon nichts (ROEMISCH reicht bis zehn, und sieben wie
// vier liegen darunter), aber eine Begruendung, die auf einer Zahl steht, die
// es nicht gibt, ist keine.
//
// Nachgezaehlt statt abgeschrieben: es waren NEUN Stellen, nicht sieben --
// sechs in index.html, eine im Kopf von empfang-pruef, zwei in der README. A0
// hatte sieben aufgelistet und die beiden Kommentare im Abspann und in
// szeneTafel() uebersehen. Acht davon stehen jetzt auf vier; die neunte ist
// der README-Eintrag zu SZ1, und die bleibt bei neun, weil sie beschreibt,
// was SZ1 damals gebaut hat, und nicht, was heute dasteht.
//
// Ein Requisit traegt seine Blattzahl uebrigens als "Blatt I von I". Die
// roemische Zaehlung gilt damit auch fuer den Einzelfall, und das ist die
// Pointe und nicht ihr Preis.
const szeneBlattZahl = (n, gesamt) => (gesamt < ROEMISCH.length ? ROEMISCH[n] : String(n));

// Der zweite Knopf des laufenden Stapels. Eigene Funktion, weil sie im onclick
// steht und szeneTafelLauf zur Klickzeit gelesen werden muss, nicht zur Bauzeit.
function szeneTafelZweiter(){
  const lauf = szeneTafelLauf;
  if(lauf && lauf.zweiter) lauf.zweiter.tun();
}

function szeneTafel(i){
  const lauf = szeneTafelLauf;
  if(!lauf) return;
  // T6: traegt dieses Blatt eine Wahl, kommt sein Inhalt aus der Reihe und
  // nicht aus liste. liste[i] bleibt trotzdem besetzt und gueltig, damit die
  // Blattzahl unten und szeneAssert() oben unveraendert rechnen koennen.
  const wahl = (lauf.wahl && lauf.wahl.bei === i) ? lauf.wahl.reihe[lauf.stufe | 0] : null;
  const t = wahl || lauf.liste[i];
  // T6: der Abschluss bekommt die erreichte Stufe mit. Fuer jeden Stapel ohne
  // Wahl ist sie null, und alle bestehenden ende()-Rueckrufe nehmen ohnehin
  // kein Argument. Der Anlage-2-Abschluss liest sie, weil szeneTafelLauf hier
  // eine Zeile spaeter nicht mehr steht.
  if(!t){ const stufe = lauf.stufe | 0; szeneTafelLauf = null; lauf.ende(stufe); return; }
  // AN5: gelesen heisst gezeigt. Abgehakt wird HIER und nicht beim Weiterklicken:
  // wer das letzte Blatt aufschlaegt und dann das Fenster schliesst, hat es
  // gesehen, und ein Auffangbecken, das ihm das letzte Blatt trotzdem als
  // ungelesen vorhaelt, zaehlt nicht mit, was passiert ist.
  if(lauf.kladde && lauf.kladde[i]) anfangGelesen(lauf.kladde[i]);
  const letzte = i === lauf.liste.length - 1;
  // Der zweite Knopf steht nur, solange er etwas zu tun hat: auf dem letzten
  // Blatt gibt es nichts mehr zu ueberspringen und nichts mehr abzukuerzen.
  //
  // T6: Die Wahl benutzt dieselbe Zeile fuer ihren Nein-Knopf. Beide koennen
  // sich nicht begegnen, denn zweiter gehoert dem ganzen Stapel und die Wahl
  // genau einem Blatt darin; der Anlage-2-Stapel hat keinen zweiten Knopf und
  // das Intro keine Wahl. Der gesperrte Knopf bleibt STEHEN und verschwindet
  // nicht: ausgegraut ist die Pointe, weg waere nur ein fehlender Knopf.
  const zweiter = wahl
    ? `<div><button ${wahl.gesperrt ? 'disabled' : `onclick="szeneTafelWahlNein()"`}
         style="font-size:calc(11px * var(--fs));padding:6px 14px;margin-top:6px;${wahl.gesperrt ? '' : 'opacity:.7;'}">${gEsc(wahl.nein)}</button></div>`
    : (lauf.zweiter && !letzte)
    ? `<div><button onclick="szeneTafelZweiter()"
         style="font-size:calc(11px * var(--fs));padding:6px 14px;margin-top:6px;opacity:.7;">${gEsc(lauf.zweiter.t)}</button></div>`
    : '';
  MUS.swell();
  // Zwei Lesarten desselben Stapels, und die Tabelle sagt welche. gross/klein
  // ist die Anrisstafel aus E1: eine Behauptung, gross gesetzt. blatt/stimme
  // ist das Dokument aus SZ1: eine Regieangabe, was auf dem Tisch liegt, und
  // darunter, was vorgelesen wird. Beide tragen dieselbe Urkundenoptik, weil es
  // dieselbe Behoerde ist, die sie aufmacht (Humor-Grundgesetz 10).
  //
  // SZ4: eine gesprochene Zeile darf sagen, wer sie sagt. Das Intro braucht es
  // nicht (eine Stimme, vier Blaetter), der Abspann schon: Bild 11 ist eine
  // Wechselrede, und ohne Namen davor gehoerten alle fuenf Zeilen derselben
  // Person. Der String bleibt die einfache Form, das Paar ist die Ausnahme.
  // SZ4: der Inhalt rollt, der Rahmen nicht. Bis hierher wuchs das Blatt mit
  // seinem Text, und ein zu langes Blatt schob seinen eigenen Knopf unter den
  // Fensterrand — auf 360x640 bei groesster Schrift war Bild 11 des Abspanns
  // nicht mehr zu Ende zu klicken. Gemessen, nicht vermutet: acht von dreizehn
  // Bildern lagen auf mindestens einer Fenstergroesse darueber, das Intro auf
  // keiner. E2 hat fuer den Vordruck "blaettern statt rollen" entschieden, und
  // das gilt weiter; ein Standbild laesst sich aber nicht blaettern. Also rollt
  // hier der Text INNERHALB der Urkunde, und Siegel, Kopfzeile, Blattzahl und
  // Knopf bleiben stehen, wo sie sind. Dieselbe Bauform benutzt das Finale seit
  // W5 (max-height 38vh am Puzzleteil-Kasten).
  //
  // T3, ein Fund aus dem Durchspielen: `justify-content:center` zentriert den
  // Text im Kasten, solange er hineinpasst, und schiebt ihn beim Ueberlaufen
  // nach BEIDEN Seiten hinaus. Der untere Ueberhang laesst sich errollen, der
  // obere nicht: Flexbox kennt dort keinen negativen Rollweg, scrollTop steht
  // auf null und die erste Zeile ist trotzdem weg. Betroffen war jedes lange
  // Blatt seit SZ4, sichtbar wurde es an der Einfuehrung der Anlage 2, weil
  // deren Blaetter die laengsten des Anfangs sind (Formregel "Der Anfang
  // erzaehlt", also kein Zeichendeckel). `safe center` zentriert weiterhin,
  // faellt aber beim Ueberlauf auf flex-start zurueck, und damit steht der
  // Anfang wieder oben. Gesehen auf dem Bildschirmabzug, nicht vermutet.
  const inhalt = t.stimme
    ? `<p class="amtLead" style="font-style:italic;">${gEsc(t.blatt)}</p>`
      + t.stimme.map(z => typeof z === 'string'
          ? `<p class="amtStimme">${gEsc(z)}</p>`
          : `<p class="amtStimme"><span class="amtWer">${gEsc(z.wer)}</span>${gEsc(z.z)}</p>`).join('')
      + (t.regie ? `<p class="amtLead" style="font-style:italic;margin-top:10px;">${gEsc(t.regie)}</p>` : '')
    : `<p class="amtGross">${gEsc(t.z1)}</p><p class="amtKlein">${gEsc(t.z2)}</p>`;
  el('ovPanel').innerHTML = `
    ${siegelSvg(66)}
    <p class="amtKopf">${gEsc(AMT_KOPFZEILE)}</p>
    <hr class="amtRegel">
    <div style="min-height:30vh;max-height:56vh;overflow-y:auto;display:flex;
                flex-direction:column;justify-content:safe center;">
      ${inhalt}
    </div>
    <hr class="amtRegel unten">
    <p class="amtFuss">Blatt ${szeneBlattZahl(i+1, lauf.liste.length)} von ${szeneBlattZahl(lauf.liste.length, lauf.liste.length)}</p>
    <button onclick="szeneTafel(${i+1})">${gEsc(wahl ? wahl.ja : letzte ? lauf.letzterKnopf : 'WEITER')}</button>
    ${zweiter}`;
  el('overlay').style.display = 'flex';
  MUS.muffle(true);
}

// AN3: Ein Wandstueck ansehen.
//
// Kein neuer Leseapparat, sondern der Tafelstapel aus SZ1 mit genau einem
// Blatt. Das ist Absicht und kein Sparzug: dieses Haus macht aus allem eine
// Urkunde (Humor-Grundgesetz 10), und "Blatt I von I" ueber einem Schild, das
// ueber einer Tuer haengt, ist die Pointe und nicht ihr Preis.
//
// Die Welt haelt an, solange das Blatt steht, und zwar ueber denselben
// szeneStateVorher, den haeltDieWelt-Szenen seit SZ2 benutzen -- nicht ueber
// ein zweites Merkfeld daneben. Sie laeuft ueber szeneAus() wieder an, und
// dessen aktSperre ist genau das, was hier gebraucht wird: ohne sie loeste der
// Tastendruck, der das Blatt schliesst, im selben Moment das naechste "Ansehen"
// aus, denn der Spieler steht ja noch davor.
//
// Waehrend des Anfangs ist das alles unerreichbar: scanAktion() steigt bei
// state !== 'play' aus (A0, Pruefung 1), es gibt also keine Kontextaktion,
// solange der Empfang laeuft. Ein Requisit ist damit gelesen ODER Anfang, nie
// beides -- und das ist der ganze Zweck von AN3.
function requisitAnsehen(key){
  const r = REQUISITEN[key];
  if(!r || szeneTafelLauf) return;
  if(state === 'play'){ szeneStateVorher = state; state = 'szene'; aktArt = 0; updateHUD(); }
  szeneTafeln([r], {letzterKnopf: r.knopf, ende: () => { el('overlay').style.display = 'none'; szeneAus(); }});
}

// Der Anfang benutzt den Stapel fuer das Intro. Vier Blaetter, danach der
// Empfang. Das ist derselbe Uebergang wie vorher, nur mit anderem Inhalt.
//
// AN3: Der Schlussknopf hiess ANKLOPFEN. Das war richtig, solange das Intro
// auf schwarzem Grund lief und das Dorf danach aufging -- man stand vor dem
// Haus und klopfte. Seit AN2 steht der Spieler waehrend des ganzen Anfangs IN
// der Amtsstube, und Knoeterich hat ihn sechs Knoten lang angesprochen;
// angeklopft hat er nie und kann es auch nicht mehr. Der Knopf sagt jetzt, was
// der naechste Knoten tut: gruss faengt mit "So weit der Bestand. Jetzt zu
// Ihnen." an, also ZUR SACHE.
//
// Dass diese Umbenennung gefahrlos ist, ist der Zweck von Riegel 3: bis AN3
// suchten empfang-pruef und menue-pruef ihren Weiterknopf am Wortlaut, und die
// Wortliste kannte ANKLOPFEN. Sie suchen ihn jetzt am onclick.
function empfangAnriss(){
  szeneTafelZu();
  szeneTafeln(INTRO_BLAETTER, {letzterKnopf:'ZUR SACHE', ende: empfangGespraech,
                               kladde: anfangSchluessel('intro'),
                               zweiter:{t:'ÜBERSPRINGEN', tun: () => empfangUeberspringen()}});
}

// Wer den Anfang kennt, will ihn beim zweiten Mal nicht wieder sehen. Der Weg
// führt auf den Vordruck und damit auf die Unterschrift, nicht am Kanon vorbei.
function empfangUeberspringen(){
  szeneTafelLauf = null;
  szeneAus();
  showDienstblatt(1, 'einstellung', 0);
}

// Der Empfang. Hier faellt die Buehne, und das Dorf steht da.
function empfangGespraech(){
  el('overlay').style.display = 'none';
  buehneAus();
  szene.knoten = 'gruss'; szene.gefragt = new Set();
  MUS.goto('office'); MUS.muffle(false);
  szeneOeffnen('empfang', 'gruss');
}

// Der Eingang. Ersetzt in startGame() den Sprung auf Blatt 1.
//
// Die Reihenfolge ist der Kern von E2: erst der Mann, dann seine Geschichte,
// dann sein Schreibtisch. In der ersten Fassung kam die Geschichte zuerst und
// der Mann danach, und dadurch erzaehlte niemand die Geschichte.
function empfangStarten(){
  szene.gefragt = new Set();
  // AN1: Der Anfang haelt die Welt an, und zwar ausdruecklich hier statt ueber
  // haeltDieWelt an der Szene. Der Grund ist der Ausgang: der Empfang endet
  // nicht an einer Stelle, sondern an dreien (Unterschrift, Vordruck,
  // UEBERSPRINGEN), und szeneAus() laeuft auf zweien davon mitten durch, lange
  // bevor unterschrieben ist. Ein szeneStateVorher waere dort verbraucht und
  // die Welt liefe hinter dem Vordruck weiter. Ein state, den diese eine
  // Funktion setzt und dienstAntritt() als einzige zuruecknimmt, ist
  // nachlesbar.
  //
  // Was das anhaelt: update(dt) steigt bei state !== 'play' in Zeile zwei aus.
  // Damit stehen Schichtuhr, Monster, Wetter und Kontextaktion still, bis
  // unterschrieben ist -- das ist woertlich die Bedingung, die E2 an die Buehne
  // stellt, nur dass die Welt jetzt schon dahinter steht statt erst danach.
  state = 'szene';
  document.body.classList.add('szeneLaeuft');
  // AN2: Die Buehne ist der Raum. Hier stand buehneAn(), also Schwarz mit
  // Siegel; jetzt steht der Spieler in der Amtsstube, und Knoeterich steht
  // darin. E2 verlangt "die Tafel ist das Einzige im Bild", und die Bedingung
  // ist erfuellt, weil der Raum STILLSTEHT: state ist 'szene', update(dt)
  // steigt aus, niemand laeuft, die Uhr geht nicht. Ein Raum, in dem sich
  // nichts bewegt, ist kein Hintergrundrauschen, sondern ein Bild.
  //
  // Der harte Schnitt ist Absicht und kein Sparzug: kein Weg zur Tuer, kein
  // Suchspiel. betreteHaus() wird gerufen und nicht angeboten, das ginge auch
  // gar nicht — scanAktion() steht still, solange die Szene laeuft.
  //
  // Die Ernennung geht weiter auf Schwarz (empfangErnennung ruft buehneAn).
  // Das ist T2 und bleibt unangetastet: "es ist ein Rechtsakt des Hauses, und
  // das Haus macht keinen Rechtsakt vor laufender Weltkulisse."
  const amtHaus = INN_HAEUSER.find(h => h.raum.key === 'amt');
  if(amtHaus){
    // Genau einer steht da, und es ist der, der spricht. Noergel bleibt
    // draussen vor: zu Dienstbeginn sitzt er nicht auf Feierabend, und eine
    // zweite Gestalt im Bild waere das Rauschen, gegen das E2 gebaut wurde.
    // Wer das anders entscheidet, legt ihn hier dazu und sonst nirgends.
    innenBesetzung = [{npc: knNpc, tx: 8, ty: 6}];
    betreteHaus(amtHaus);
  }
  el('overlay').style.display = 'none';
  MUS.goto('office'); MUS.muffle(false);
  szeneOeffnen('empfang', SZENEN.empfang.start);
}

// --- Guard, Bauform wie dienstAssert()/gespraechAssert(). Wirft nie, meldet nur.
//
// Geprüft wird das, was beim nächsten Weiterschreiben leise kaputtgeht:
//   (1) Formregeln aus Kapitel 13 auf jeder Zeile, samt AKTE_SPERRE. Eine
//       Szene verführt stärker zum Erklären als ein Formular, also gilt hier
//       dieselbe Sperre und derselbe Sprechtest.
//   (2) Jede Frage ist erreichbar. Eine Frage, deren Voraussetzung hinter ihr
//       steht, erscheint nie, und eine Wartefrage, die auf mehr Fragen wartet,
//       als es gibt, ebenfalls nicht.
//   (3) Kein Knoten ohne Ausgang und kein Ziel, das es nicht gibt. Eine
//       Sackgasse im Empfang ist ein Spiel, das nicht startet.
//   (4) Die Antwortliste bleibt vierzeilig und im Zeichendeckel aus U3.
//   (5) Der Empfang endet dort, wo W8 endet: beide Ausgänge über
//       dienstAntritt(), sonst stünde kn.seen.einstellung an einem zweiten Ort.
// --- Guard, Bauform wie dienstAssert()/gespraechAssert(). Wirft nie, meldet nur.
//
// SZ1: Er prueft jetzt jede eingetragene Szene statt der einen, die es gab. Was
// er prueft, ist unveraendert das, was beim naechsten Weiterschreiben leise
// kaputtgeht:
//   (1) Formregeln aus Kapitel 13 auf jeder Zeile, samt der Wortsperre DIESER
//       Szene. Eine Szene verfuehrt staerker zum Erklaeren als ein Formular.
//   (2) Jede Frage ist erreichbar. Eine Frage, deren Voraussetzung hinter ihr
//       steht, erscheint nie, und eine Wartefrage, die auf mehr Fragen wartet,
//       als es gibt, ebenfalls nicht.
//   (3) Kein Knoten ohne Ausgang und kein Ziel, das es nicht gibt. Eine
//       Sackgasse im Empfang ist ein Spiel, das nicht startet.
//   (4) Die Antwortliste bleibt vierzeilig und im Zeichendeckel aus U3.
//   (5) Der Empfang endet dort, wo W8 endet: beide Ausgaenge ueber
//       dienstAntritt(), sonst stuende kn.seen.einstellung an einem zweiten Ort.
//   (6) Neu mit SZ1: jeder Tafelstapel traegt eine der beiden Lesarten
//       vollstaendig, und ein Knoten, der den Sprecher wechselt, nennt einen,
//       den es gibt.
function szeneAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('Szenen:', m, ...r); };
  // sperre ist ein Parameter und keine Konstante mehr: siehe den Kopf dieses
  // Blocks. Das Intro darf die Papiere zeigen, der Empfang nicht.
  const text = (txt, wo, sperre) => {
    if(!txt){ fehler('Text leer', wo); return; }
    if(txt.indexOf('undefined') >= 0) fehler('undefined im Text', wo, txt);
    if(/[\u2014\u2013]/.test(txt)) fehler('Gedankenstrich statt Interpunkt', wo, txt);
    if(PRUEF_EMOJI.test(txt)) fehler('Emoji im Figurentext', wo, txt);
    for(const g of PRUEF_GEHEIM) if(txt.indexOf(g) >= 0) fehler('Kesselgrammatik im Text', wo, g, txt);
    for(const sp of (sperre || [])) if(txt.indexOf(sp) >= 0) fehler('Vorgriff auf die Akte', wo, sp, txt);
    // T1-Nachlese: Reichsregel 1 sagt "von jeder Figur, in jedem Blatt, auf
    // jeder Urkunde", geprueft wurde sie aber nur in knAssertCaps(), also in
    // den Sprechblasen und auf Knoeterichs Zetteln. Sieben Story-Szenen,
    // dreizehn Baeume, das Intro und der Abspann liefen ungeprueft, und das war
    // eine Zusage ohne Deckung. Sie stand hier nur deshalb nie auf dem Spiel,
    // weil zufaellig niemand gegen sie verstossen hat; nachgemessen, null
    // Treffer. Dieser eine Aufruf deckt alle vier Bereiche ab, weil jede
    // Zeile jeder Szene durch text() laeuft.
    if(KAISER_PRAETERITUM.test(txt)) fehler('Der Kaiser steht in der Vergangenheit', wo, txt);
  };

  // (6) Die Tafelstapel. Jeder Eintrag traegt entweder gross/klein oder
  // blatt/stimme, nie beides und nie keins von beiden.
  // SZ4: der zweite Stapel. Er traegt keine Sperre, und das ist der ganze
  // Unterschied zum Intro: das Intro darf die Namen nicht nennen, der Abspann
  // besteht aus ihnen. Geprueft wird bei beiden dasselbe, naemlich dass jedes
  // Blatt genau eine der beiden Lesarten traegt und dass die Blattzahl
  // darstellbar bleibt (dreizehn liegt ueber ROEMISCH, zaehlt also arabisch).
  // T2: Die Ernennung ist der dritte Stapel. Sie traegt dieselbe Sperre wie das
  // Intro: sie darf das Haus feiern, aber keinen Namen nennen, den der Spieler
  // noch nicht kennen darf. Zwirn ist kein gesperrter Name, er steht im Dorf.
  // T3: Anlage 2 laeuft gegen die VOLLE AKTE_SPERRE und nicht gegen die
  // Namensliste wie Intro und Ernennung. Das ist kein Versehen und keine
  // Strenge um der Strenge willen: die Brandmauer dieser Figur verbietet genau
  // das, was diese zwoelf Woerter benennen. Beide Auftakte stehen einzeln in
  // der Liste, damit auch der nachgeholte Weg geprueft wird und nicht nur der
  // gewoehnliche.
  const stapel = [{name:'Intro', liste:INTRO_BLAETTER, sperre:AKTE_SPERRE_NAMEN},
                  {name:'Ernennung', liste:ERNENNUNG_BLAETTER, sperre:AKTE_SPERRE_NAMEN},
                  {name:'Anlage 2', liste:[ANLAGE2_AUFTAKT_ERNENNUNG].concat(ANLAGE2_BLAETTER), sperre:AKTE_SPERRE},
                  {name:'Anlage 2, nachgeholt', liste:[ANLAGE2_AUFTAKT_NACHHOLUNG], sperre:AKTE_SPERRE},
                  // T6: Die fuenf Stufen der Scheinwahl sind kein Stapel, den
                  // man durchblaettert, sondern fuenf Fassungen desselben
                  // Blattes. Geprueft werden muessen sie trotzdem, und zwar
                  // genau hier: das ist die einzige Stelle, an der die
                  // Formregeln aus Kapitel 13 und die Brandmauer auf
                  // Tafeltext treffen. Ohne diesen Eintrag liefen fuenf
                  // Tafeln ungeprueft. Die Sperre ist die volle, auch fuer
                  // die Zeilen des AMTES: wer in ihrer Gegenwart spricht,
                  // spricht unter ihrer Brandmauer.
                  {name:'Anlage 2, die Wahl', liste:ANLAGE2_FRAGE, sperre:AKTE_SPERRE},
                  // AN3: die beiden Requisiten. Sie laufen durch dieselbe
                  // Zeichenstelle wie jedes Blatt und muessen deshalb auch
                  // durch dieselbe Pruefung -- ein Wandstueck, das man ansehen
                  // kann, ist ein Blatt mit einem Ort davor. Sperre wie beim
                  // Intro, denn es IST das Material des Intros.
                  {name:'Requisiten', liste:Object.values(REQUISITEN), sperre:AKTE_SPERRE_NAMEN},
                  {name:'Abspann', liste:abspannBlaetter(), sperre:[]}];
  for(const st of stapel){
    if(!st.liste.length) fehler('Tafelstapel ohne Blätter', st.name);
    if(!szeneBlattZahl(st.liste.length, st.liste.length)) fehler('Tafelstapel ohne darstellbare Blattzahl', st.name, st.liste.length);
    st.liste.forEach((t, i) => {
      const wo = `${st.name} Blatt ${i+1}`;
      const alteForm = t.z1 !== undefined, neueForm = t.stimme !== undefined;
      if(alteForm === neueForm) return fehler('Blatt trägt keine oder zwei Lesarten', wo);
      if(alteForm){ text(t.z1, wo + ' Zeile 1', st.sperre); text(t.z2, wo + ' Zeile 2', st.sperre); }
      else {
        text(t.blatt, wo + ' Regieangabe', st.sperre);
        if(!t.stimme.length) fehler('Blatt ohne gesprochene Zeile', wo);
        // SZ4: eine gesprochene Zeile ist ein String oder ein Paar aus Sprecher
        // und Satz. Beides laeuft durch dieselben Formregeln, und ein Paar ohne
        // Namen waere ein Namensschild, das leer bleibt.
        t.stimme.forEach((z, j) => {
          const istPaar = z !== null && typeof z === 'object';
          if(istPaar && !z.wer) fehler('gesprochene Zeile mit leerem Sprecher', `${wo} Stimme ${j+1}`);
          if(istPaar) text(z.wer, `${wo} Stimme ${j+1} Sprecher`, st.sperre);
          text(istPaar ? z.z : z, `${wo} Stimme ${j+1}`, st.sperre);
        });
        if(t.regie) text(t.regie, wo + ' Nachbemerkung', st.sperre);
      }
    });
  }

  // AN3: ein Requisit ohne Knopfaufschrift stuende mit einem leeren Knopf da,
  // und der Stapel-Block oben prueft nur den Text der Blaetter. Dazu die
  // Gegenprobe von der anderen Seite: jedes Wandstueck mit akt:'requisit' muss
  // auf ein Blatt zeigen, das es gibt. Ein Tippfehler im Schluessel faellt
  // sonst erst auf, wenn ein Spieler davorsteht und nichts passiert.
  for(const k in REQUISITEN){
    if(!REQUISITEN[k].knopf) fehler('Requisit ohne Knopfaufschrift', k);
    if(!REQUISITEN[k].name)  fehler('Requisit ohne Namen', k);
  }
  for(const z in INN_MOEBEL){
    const m = INN_MOEBEL[z];
    if(m.akt !== 'requisit') continue;
    if(!m.requisit) fehler('Wandstück ohne Blatt', z);
    else if(!REQUISITEN[m.requisit]) fehler('Wandstück zeigt auf ein Blatt, das es nicht gibt', z, m.requisit);
  }

  // Ab hier je Szene. Der Laufzustand wird gespiegelt und exakt
  // wiederhergestellt: dieser Guard laeuft auf Skriptebene, lange bevor eine
  // Szene beginnt, und darf keine anfangen.
  const merkKey = szeneAktiv, merkKnoten = szene.knoten, merkGefragt = szene.gefragt;
  try {
  for(const key in SZENEN){
    const d = SZENEN[key];
    const wo = w => `${key}: ${w}`;
    for(const f of ['sprecher','knoten']) if(typeof d[f] !== (f === 'knoten' ? 'object' : 'function'))
      fehler('Pflichtfeld fehlt oder hat die falsche Form', key, f);

    // (7) SZ2: der Haken an der Figur. Er muss auf jemanden zeigen, den es
    // gibt, und er muss sagen, wann er zieht, sonst ist die Szene ab dem
    // ersten Ansprechen dauerhaft faellig. Knoeterich ist die Ausnahme: er
    // steht nicht in DORF_FIGUREN, seine Szene haengt an der Kontextaktion.
    if(d.figur){
      if(d.figur !== 'knoeterich' && !DORF_FIGUREN.some(f => f.key === d.figur))
        fehler('Szene hängt an einer Figur, die es nicht gibt', key, d.figur);
      if(typeof d.wenn !== 'function')
        fehler('Szene hängt an einer Figur, sagt aber nicht, wann sie fällig ist', key);
    }

    // (1) Zeilen
    const alleKnoten = {};
    for(const k in d.knoten) alleKnoten[k] = d.knoten[k];
    for(const f of (d.fragen || [])){
      if(alleKnoten[f.key]) fehler('Frage und Knoten heißen gleich', wo(f.key));
      alleKnoten[f.key] = f;
      text(f.t, wo(`Frage ${f.key} Beschriftung`), d.sperre);
      if(f.t.length > ANTWORT_DECKEL) fehler('Frage zu lang für die Zeile', wo(f.key), f.t.length);
    }
    for(const k in alleKnoten){
      text(alleKnoten[k].z1, wo(`Knoten ${k} Zeile 1`), d.sperre);
      text(alleKnoten[k].z2, wo(`Knoten ${k} Zeile 2`), d.sperre);
      // (6) Ein Sprecherwechsel muss auf jemanden zeigen, den es gibt.
      const wer = alleKnoten[k].wer;
      if(wer && typeof wer !== 'function' && !DORF_FIGUREN.some(f => f.key === wer))
        fehler('Knoten wechselt auf eine Figur, die es nicht gibt', wo(k), wer);
    }

    // (2) Erreichbarkeit
    const fragen = d.fragen || [];
    const pos = {};
    fragen.forEach((f, i) => { pos[f.key] = i; });
    for(const f of fragen){
      if(f.frei){
        if(pos[f.frei] === undefined) fehler('Voraussetzung gibt es nicht', wo(f.key), f.frei);
        else if(pos[f.frei] > pos[f.key]) fehler('Voraussetzung steht hinter ihrer Frage', wo(f.key), f.frei);
      }
      if(f.nach && f.nach > fragen.length - 1)
        fehler('Wartefrage wartet auf mehr Fragen, als es gibt', wo(f.key), f.nach);
      // (2b) T1: Fortsetzungen. Eine Kaskade braucht die Zeile, mit der der
      // Spieler sie weiterlaufen laesst, und ein Ziel, das es gibt. Als Ziel
      // ist nur ein Knoten zulaessig: eine Frage waere eine zweite Hub-Tuer
      // und wuerde sich selbst aus der Liste der offenen Fragen streichen.
      if(f.weiter){
        if(!f.wt) fehler('Fortsetzung ohne Spielerzeile', wo(f.key), f.weiter);
        else {
          text(f.wt, wo(`Frage ${f.key} Fortsetzung`), d.sperre);
          if(f.wt.length > ANTWORT_DECKEL)
            fehler('Fortsetzung zu lang für die Zeile', wo(f.key), f.wt.length);
        }
        if(!d.knoten[f.weiter])
          fehler('Fortsetzung zeigt auf einen Knoten, den es nicht gibt', wo(f.key), f.weiter);
      }
    }
    if(fragen.length){
      const sicht = d.sicht || 3;
      const einstieg = fragen.filter(f => !f.frei && !f.nach).length;
      if(einstieg < sicht) fehler('zu wenige Fragen ohne Voraussetzung', key, einstieg, 'von', sicht);
    }

    // (3)/(4) Antwortlisten aller Knoten, ohne die Szene zu oeffnen.
    szeneAktiv = key;
    for(const k in alleKnoten){
      szene.knoten = k; szene.gefragt = new Set();
      let opts;
      try { opts = szeneOptionen(); }
      catch(e){ fehler('Antwortliste wirft', wo(k), e.message); continue; }
      if(!opts.length) fehler('Knoten ohne Ausgang', wo(k));
      if(opts.length > 4) fehler('mehr als vier Antworten', wo(k), opts.length);
      for(const o of opts){
        if(!o.t) fehler('leere Antwort', wo(k));
        else if(o.t.length > ANTWORT_DECKEL) fehler('Antwort zu lang', wo(k), o.t, o.t.length);
        if(typeof o.tun !== 'function') fehler('Antwort ohne Wirkung', wo(k), o.t);
        text(o.t, wo(`Knoten ${k} Antwort`), d.sperre);
      }
    }
    // Jedes zu-Ziel muss es geben. An der Quelle geprueft und nicht am gebauten
    // Ergebnis, weil szeneOpt() das Ziel in eine Funktion einpackt.
    for(const k in d.knoten){
      if(!d.knoten[k].opts) continue;
      for(const o of d.knoten[k].opts()) if(o.zu && !alleKnoten[o.zu])
        fehler('Antwort zeigt auf einen Knoten, den es nicht gibt', wo(k), o.zu);
    }
  }
  } finally { szeneAktiv = merkKey; szene.knoten = merkKnoten; szene.gefragt = merkGefragt; }

  // (5) Der Ausgang bleibt der Ausgang aus W8.
  if(typeof dienstAntritt !== 'function') fehler('dienstAntritt() fehlt, der Empfang hätte kein Ende');

  // (8) SZ2: der Nachklang. Was eine Szene an letzterAnlass setzt, muss bei
  // Lott und bei Pahl Zeilen haben, sonst laeuft die Szene in eine leere Bank
  // und der Spieler merkt nichts davon. Beide Haelften werden geprueft, weil
  // die Quelle die vier Zeilen auf die zwei Figuren verteilt.
  for(const key in SZENE_ANLASS){
    if(!SZENEN[key]) fehler('Nachklang für eine Szene, die es nicht gibt', key);
    const anl = SZENE_ANLASS[key];
    for(const fk of ['lott','pahl']){
      const f = DORF_FIGUREN.find(x => x.key === fk);
      if(!f || !f.anlass || !(f.anlass[anl] || []).length)
        fehler('Nachklang ohne Zeilen', key, anl, fk);
    }
  }

  // (9) SZ2: jeder Merker, den eine Szene setzt, muss im Spielstand angelegt
  // sein. Sonst schreibt szeneEnde() ein Feld, das startShift() nicht kennt,
  // und die Szene liefe nach dem naechsten Laden noch einmal.
  //
  // T4: die Zeichenklasse hiess bis hierher [a-zA-Z] und war damit blind fuer
  // jeden Namen mit einer Ziffer darin. Aufgefallen ist es, als der erste
  // solche dazukam: szeneEnde('baumAnlage2', 'anlage2Dank') fiel aus dem
  // Filter, und der Guard meldete nichts, weil er nichts fand. Ein Guard, der
  // stumm ins Leere prueft, ist schlimmer als keiner, denn er beruhigt.
  // Die acht bestehenden Zwei-Argument-Aufrufe bleiben unberuehrt gruen.
  for(const key in SZENEN){
    const q = String(SZENEN[key].ende || '') + Object.keys(SZENEN[key].knoten)
      .map(k => String(SZENEN[key].knoten[k].opts || '')).join('');
    const m = q.match(/szeneEnde\('[a-zA-Z0-9]+',\s*'([a-zA-Z0-9]+)'\)/g) || [];
    for(const treffer of m){
      const merker = treffer.match(/'([a-zA-Z0-9]+)'\)$/)[1];
      if(!(merker in kn.flags)) fehler('Szene setzt einen Merker, den der Spielstand nicht kennt', key, merker);
    }
  }

  // (10) T1: Nieselbecks Meldekuerzel. Weltbibel Kapitel 13 laesst die Familie
  // Mg./Da./Ba./Anm./Vlg. nur unter einer Bedingung als EINE Position gegen die
  // Zwoelf zaehlen: er loest jede selbst auf, im eigenen Baum, eine Nachfrage
  // entfernt. Geprueft wird woertlich auf die Langform, denn genau die ist die
  // Zusage. Der allgemeine Abkuerzungs-Guard in knAssertCaps() sieht das nicht:
  // er prueft, DASS ein Kuerzel einen Eintrag hat, nicht, dass die Langform im
  // Spiel auch faellt.
  {
    const b = SZENEN.baumNieselbeck;
    if(!b) fehler('baumNieselbeck fehlt, die Meldekürzel hätten keine Auflösestelle');
    else {
      const korpus = [];
      for(const f of (b.fragen || [])) korpus.push(f.z1, f.z2);
      for(const k in b.knoten) korpus.push(b.knoten[k].z1, b.knoten[k].z2);
      const alles = korpus.filter(Boolean).join(' ');
      for(const k in ABKUERZUNGEN){
        if(ABKUERZUNGEN[k].wo !== 'nieselbeck') continue;
        if(alles.indexOf(ABKUERZUNGEN[k].lang) < 0)
          fehler('Meldekürzel ohne Auflösung im Baum', k, ABKUERZUNGEN[k].lang);
      }
    }
  }

  const knoten = Object.keys(SZENEN).reduce((n, k) => n + Object.keys(SZENEN[k].knoten).length, 0);
  const fragen = Object.keys(SZENEN).reduce((n, k) => n + ((SZENEN[k].fragen || []).length), 0);
  if(ok) console.log(`Szenen: ${Object.keys(SZENEN).length} eingetragen, ${INTRO_BLAETTER.length} Introblätter,`
    + ` ${fragen} Fragen, ${knoten} Knoten, Sperrvermerk und Antwortdeckel in Ordnung.`);
}
szeneAssert();

// ===========================================================================
//  T3: anlage2Assert()
//
//  Anlage 2 bringt vier neue Textquellen mit, und drei davon sieht kein
//  bestehender Guard vollstaendig: knAssertCaps() misst ihre Deckel und
//  Formregeln, szeneAssert() nimmt Baum und Tafelstapel, aber die Struktur
//  dahinter prueft niemand. Genau dort liegen die Fehler, die man beim
//  Weiterschreiben macht, ohne dass etwas kaputt aussieht.
//
//  Der wichtigste Punkt ist der erste: die BRANDMAUER. Anlage 2 war beigefuegt
//  und nicht eingeweiht, sie kennt das Haus und nicht den Fall. Das ist keine
//  Stilfrage, sondern die Bedingung, unter der diese Figur ueberhaupt existieren
//  darf: eine Beilage, die den laufenden Vorgang kommentiert, nimmt fuenf Akte
//  vorweg. Ein Guard kann Semantik nicht pruefen, aber er kann die zwoelf
//  Woerter pruefen, an denen man sie erkennt, und er tut es ueber JEDE ihrer
//  Zeilen, auch die im Rucksack und im Tooltip.
//
//  Wirft nie, meldet nur. Bauform wie zulagenAssert() und wiederAssert().
// ===========================================================================
function anlage2Assert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('T3 Anlage 2:', m, ...r); };

  // (1) Die Brandmauer, ueber jede Zeile, die Anlage 2 im Spiel sagt oder
  // traegt. Der Baum laeuft zusaetzlich in szeneAssert() gegen dieselbe Liste,
  // die Tafeln ebenso; hier kommen die beiden Quellen dazu, die dort nicht
  // vorkommen, weil sie keine Szene sind.
  const zeilen = [];
  for(const anlass in ANLAGE2_NOTIZ)
    for(const e of ANLAGE2_NOTIZ[anlass]) zeilen.push([typeof e === 'string' ? e : e.z, 'Notiz ' + anlass]);
  for(const l of ANLAGE2_BEWEGUNG) zeilen.push([l, 'Bewegungsspruch']);
  for(const u of ANLAGE2_UMSCHLAG) zeilen.push([u.z, 'Umschlag ' + u.id]);   // T4
  // T7: beide Haelften des Ausbruchs. Die Ruecknahme gehoert ausdruecklich
  // dazu, denn sie ist die Zeile, in der sie sich erklaert, und genau dort
  // waere ein gesperrtes Wort am naheliegendsten.
  for(const a in ANLAGE2_AUSBRUCH)
    for(const p of ANLAGE2_AUSBRUCH[a]) zeilen.push([p.auf, 'Ausbruch ' + a], [p.zurueck, 'Rücknahme ' + a]);
  // T8: und beide Haelften der Szenenzeilen. Sie stehen hier nicht der
  // Vollstaendigkeit halber, sondern weil sie die gefaehrlichsten Zeilen sind,
  // die diese Figur hat: sie fallen in dem Moment, in dem die Akte selbst
  // spricht, und der naechste, der eine dazuschreibt, hat die Szene frisch im
  // Kopf und ihre Unwissenheit nicht.
  for(const a in ANLAGE2_SZENE)
    zeilen.push([ANLAGE2_SZENE[a].z1, 'Szene ' + a], [ANLAGE2_SZENE[a].z2, 'Szene ' + a + ', zweite Hälfte']);
  zeilen.push([anlage2Tooltip().replace(/<[^>]*>/g, ' '), 'Tooltip']);
  // T7-Fund, aufgefallen beim Ausloesen der neuen Zweige: bis hierher lief
  // diese Schleife ungeprueft auf indexOf. Eine Quelle ohne Text hat den Guard
  // damit ABSTUERZEN lassen, statt ihn melden zu lassen, und weil er auf
  // Skriptebene laeuft, nahm er das halbe Spiel mit. Ein Guard, der an genau
  // dem Fehler zerbricht, den er finden soll, ist keiner, und das ist
  // derselbe Zirkelschluss, den T3 schon einmal am Ausgang des Baumes hatte.
  //
  // Latent war der Fall seit T4 da: eine Umschlagzeile ohne z traf ihn
  // ebenso, nur hat ihn niemand ausgeloest, weil (6b) danach kommt und die
  // Probe von damals die Meldung sah, die noch vor dem Absturz kam.
  for(const [t, wo] of zeilen){
    if(typeof t !== 'string'){ fehler('Eine Zeile hat gar keinen Text', wo); continue; }
    for(const w of AKTE_SPERRE)
      if(t.indexOf(w) >= 0) fehler('Brandmauer verletzt, sie weiß das nicht', wo, w);
  }

  // (2) Jeder Anlass braucht genug Zeilen OHNE Gate. Ein Pool, der nur aus
  // gegateten Zeilen bestuende, waere in der ersten Schicht leer, und ein
  // stummer Kanal sieht aus wie ein kaputter. Vier ist die Zahl, die
  // Knoeterichs Randnotiz bis T2 hatte, und sie hat sich bewaehrt.
  for(const anlass in ANLAGE2_NOTIZ){
    const roh = ANLAGE2_NOTIZ[anlass];
    const frei = roh.filter(e => typeof e === 'string').length;
    if(frei < 4) fehler('Anlass hat weniger als vier Zeilen ohne Gate', anlass, frei);
    // (3) Die Gates selbst: genau ein Schalter je Eintrag, und er muss in der
    // Tabelle stehen, aus der auch figZusatz() liest. Zwei Schalter saehen aus
    // wie eine Und-Bedingung und waeren keine.
    for(const e of roh){
      if(typeof e === 'string') continue;
      if(typeof e.z !== 'string' || !e.z) fehler('Gegatete Zeile ohne Text', anlass);
      const genannt = Object.keys(e).filter(k => k !== 'z');
      if(genannt.length !== 1){ fehler('Gegatete Zeile nennt nicht genau einen Schalter', anlass, genannt.join()); continue; }
      const s = genannt[0];
      if(!(s in ZUSATZ_SCHALTER)){ fehler('Gegatete Zeile nennt einen Schalter, den es nicht gibt', anlass, s); continue; }
      const m = ZUSATZ_SCHALTER[s].pruef(e[s], e);
      if(m) fehler('Gegatete Zeile ' + anlass, m);
    }
  }

  // (2b) T7: der Ausbruch-Kanal. Er wird ueber dieselbe Funktion ausgeliefert
  // wie der Kommentarkanal und haengt deshalb an denselben Schluesseln; ein
  // Ausbruch an einem Anlass, den es dort nicht gibt, wuerde nie gerufen und
  // waere derselbe stumme Fall, den (4) fuer die Pools nachhaelt.
  let rate = 0;
  for(const a in ANLAGE2_AUSBRUCH){
    // T8: die Meldung unterscheidet jetzt zwei Faelle, die bis hierher
    // denselben Satz bekamen. Ein Szenen-Anlass IST ein Anlass, den es gibt, er
    // wird nur nicht ueber anlage2Notiz() zugestellt, und wer hier "den es
    // nicht gibt" liest, sucht an der falschen Stelle.
    if(!(a in ANLAGE2_NOTIZ)) fehler(ANLASS_QUELLEN.indexOf(a) >= 0
      ? 'Ein Ausbruch steht auf einem Szenen-Anlass, dort liefert der stille Kanal'
      : 'Ein Ausbruch wartet auf einen Anlass, den es nicht gibt', a);
    // T4 hat entschieden, dass sie in ein Scheitern nicht hineinredet, sondern
    // beim Wiederantritt wartet. Fuer den lauten Kanal gilt das erst recht,
    // und weil eine Entscheidung, die nur in einem Dokument steht, beim
    // naechsten Bauabschnitt verloren geht, steht sie hier.
    if(a === 'niederlage') fehler('Ein Ausbruch steht auf der Niederlage, dort schweigt sie');
    const paare = ANLAGE2_AUSBRUCH[a];
    if(!Array.isArray(paare) || !paare.length){ fehler('Ein Ausbruch-Anlass hat keine Paare', a); continue; }
    const aufGesehen = new Set();
    for(const p of paare){
      if(typeof p.auf !== 'string' || !p.auf) fehler('Ein Ausbruch hat keinen Text', a);
      // Die Ruecknahme ist keine Zierde, sie ist die zweite Haelfte der Figur.
      // Ohne sie bliebe eine Anlage stehen, die hochgefahren und dabei
      // geblieben ist, und das ist eine andere Figur als diese.
      if(typeof p.zurueck !== 'string' || !p.zurueck) fehler('Ein Ausbruch hat keine Rücknahme', a, p.auf);
      if(aufGesehen.has(p.auf)) fehler('Zwei Ausbrüche desselben Anlasses beginnen gleich', a, p.auf);
      aufGesehen.add(p.auf);
      const extra = Object.keys(p).filter(k => k !== 'auf' && k !== 'zurueck' && k !== 'raten');
      if(extra.length) fehler('Ein Ausbruch trägt ein Feld, das es nicht gibt', a, extra.join());
      if('raten' in p){
        if(p.raten !== true) fehler('raten kennt nur true, nicht', a, p.raten);
        else rate++;
      }
      // (2c) Die Ton-Grenze, und sie ist der Grund, aus dem dieser Kanal
      // ueberhaupt gebaut werden durfte. "Vertrauter, nie schaerfer" war zu
      // weit gefasst und hat das Falsche verboten; praezise heisst es: sie
      // darf laut werden, nie gegen den, der zuhoert. Ein Ausrufezeichen
      // neben einer Anrede ist genau das, und es faellt hier auf und nicht
      // erst der Spielerin in der dritten Schicht.
      if(p.auf && p.auf.indexOf('!') >= 0 && /(^|[^A-Za-zÄÖÜäöüß])(Sie|Ihnen|Ihrer?|Ihre[nms]?)([^A-Za-zÄÖÜäöüß]|$)/.test(p.auf))
        fehler('Ein Ausbruch fährt den Spieler an', a, p.auf);
    }
  }
  // Und die Rate-Paare. Sie sind der Grund, warum eine harte Brandmauer und
  // ein lebendiger Kanal sich nicht widersprechen: wer vorprescht und
  // danebentippt, verraet nichts, weil er nichts weiss. Unter drei Stueck ist
  // die Bauart ein Einzelfall statt einer Eigenschaft, und dann kippt die
  // Figur beim naechsten Bauabschnitt still zurueck in die Haltung.
  if(rate < 3) fehler('Zu wenige Ausbrüche, in denen sie danebenliegt', rate);

  // (2d) T8: der Szenenkanal. Er ist der einzige der drei, dessen Zeilen GENAU
  // EINMAL pro Spielstand fallen, und daraus folgt alles, was hier geprueft
  // wird: was einmal faellt, kann man nicht spaeter beim Wiederhoeren bemerken.
  for(const a in ANLAGE2_SZENE){
    if(ANLASS_QUELLEN.indexOf(a) < 0) fehler('Eine Szenenzeile wartet auf einen Anlass, den keine Szene setzt', a);
    const p = ANLAGE2_SZENE[a];
    if(!p || typeof p !== 'object' || Array.isArray(p)){ fehler('Ein Szenen-Anlass trägt kein Paar', a); continue; }
    if(typeof p.z1 !== 'string' || !p.z1) fehler('Eine Szenenzeile hat keinen Text', a);
    // Die zweite Haelfte ist keine Zugabe. Der erste Satz stellt fest, der
    // zweite sagt, was er fuer sie bedeutet, und ohne ihn bliebe eine Figur
    // stehen, die etwas bemerkt und es nicht zu Ende sagt.
    if(typeof p.z2 !== 'string' || !p.z2) fehler('Eine Szenenzeile hat keine zweite Hälfte', a, p.z1);
    // Kein Gate, kein raten, kein Zusatzfeld. Der Kanal hat genau eine
    // Bedingung, und die heisst: die Szene ist zu Ende.
    const extra = Object.keys(p).filter(k => k !== 'z1' && k !== 'z2');
    if(extra.length) fehler('Eine Szenenzeile trägt ein Feld, das es nicht gibt', a, extra.join());
  }
  // Die Entscheidung dieses Abschnitts, und die einzige, die man beim
  // Weiterschreiben mit der besten Absicht kaputtmacht: bei der Entklammerung
  // schweigt sie. Ein Papier, dem die Klammer gezogen wird, waere die
  // naheliegendste Zeile des ganzen Spiels fuer ein Papier mit einer Klammer,
  // und genau deshalb steht sie hier und nicht nur im Phasendokument. Vorblatt
  // ist der Gegenspieler aus Akt IV; jeder Satz ueber ihn ist ein Satz ueber
  // den Fall, und den hat sie nicht. Dieselbe Bauart wie niederlage oben.
  if('vorblatt' in ANLAGE2_SZENE) fehler('Bei der Entklammerung schweigt sie, hier steht trotzdem eine Zeile');
  // Und die Gegenrichtung zum Schweigen: jede ANDERE Szene, die einen Anlass
  // setzt, muss ihre Zeile haben. Ohne diese Pruefung waere die Stille bei
  // Vorblatt nicht von der Stille zu unterscheiden, die entsteht, wenn jemand
  // eine Szene dazubaut und die Zeile vergisst, und dann bewiese der Zweig
  // darueber gar nichts mehr.
  for(const a of ANLASS_QUELLEN){
    if(a === 'vorblatt') continue;
    if(!(a in ANLAGE2_SZENE)) fehler('Eine Szene endet, und sie sagt nichts dazu', a);
  }
  // (2e) T8-Fund: ANLASS_QUELLEN behauptet seit SZ3 im Kommentar, die Werte von
  // SZENE_ANLASS zu fuehren, und dass sie "dort gegengeprueft" werden. Geprueft
  // wurde nichts, die Liste stand seither unbewacht da. Aufgefallen ist es
  // hier, weil (2d) sie als Quelle liest: ein Guard, der sich auf eine
  // handgepflegte Liste stuetzt, erbt deren Fehler und meldet sie als seine
  // eigene Wahrheit. vorblatt setzt seinen Anlass nicht ueber SZENE_ANLASS,
  // sondern direkt in vorblattAngekommen(); gelesen wird das aus dem
  // Quelltext, wie szeneAssert() es bei den Merkern seit SZ2 tut.
  const ausSzenen = new Set(Object.keys(SZENE_ANLASS).map(k => SZENE_ANLASS[k]));
  const direkt = (String(vorblattAngekommen).match(/letzterAnlass\s*=\s*'([a-zA-Z0-9]+)'/) || [])[1];
  if(direkt) ausSzenen.add(direkt);
  else fehler('Die Entklammerung setzt keinen Anlass mehr, der Chor auf der Bank verstummt');
  for(const a of ausSzenen)
    if(ANLASS_QUELLEN.indexOf(a) < 0) fehler('Eine Szene setzt einen Anlass, den ANLASS_QUELLEN nicht führt', a);
  for(const a of ANLASS_QUELLEN)
    if(!ausSzenen.has(a)) fehler('ANLASS_QUELLEN führt einen Anlass, den keine Szene setzt', a);

  // (4) Die Anlaesse muessen dieselben sein, die auch ausgeloest werden. Der
  // Kanal hat mit T3 den Sprecher gewechselt, nicht die Schluessel: die Bank
  // haengt mit ihren eigenen Pools an denselben, und ein umbenannter Schluessel
  // wuerde Lott und Pahl verstummen lassen, ohne dass etwas kaputt aussieht.
  // T4 hat drei Anlaesse dazugelegt. niederlage wird nicht dort gerufen, wo er
  // entsteht, sondern beim Wiederantritt aus kn.pending; fuer diese Pruefung
  // ist das derselbe Fall, denn gerufen wird er.
  const gerufen = ['crit','levelup','ultimate','fluch','goldfund','kammerAbbruch','untaetigkeit',
                   'niederlage','bosssieg','ebene'];
  for(const a of gerufen) if(!(a in ANLAGE2_NOTIZ)) fehler('Ein Anlass wird gerufen, hat aber keinen Pool', a);
  for(const a in ANLAGE2_NOTIZ) if(gerufen.indexOf(a) < 0) fehler('Ein Pool wartet auf einen Anlass, den nichts auslöst', a);

  // (5) Die Bewegungsreihe. Sie ist eine Reihe und keine Menge: der Ringschluss
  // am Ende greift auf die letzten drei zurueck, und das geht erst ab sechs
  // Eintraegen ohne Ueberschneidung mit dem Anfang. Doppelte Zeilen waeren ein
  // Copy-Fehler, keine Absicht.
  if(ANLAGE2_BEWEGUNG.length < 6) fehler('Zu wenige Bewegungssprüche für den Ringschluss', ANLAGE2_BEWEGUNG.length);
  if(new Set(ANLAGE2_BEWEGUNG).size !== ANLAGE2_BEWEGUNG.length) fehler('Ein Bewegungsspruch steht doppelt in der Reihe');

  // (6) Der Merker und der Zaehler. Beide sind additiv gemergt und damit
  // migrationsfrei, aber nur solange sie in der Vorgabe stehen: ein Feld, das
  // dort fehlt, ist nach dem ersten Laden weg.
  if(!('anlage2Da' in kn.flags)) fehler('Der Merker anlage2Da fehlt in kn.flags');
  // AN4: derselbe Grund wie eine Zeile hoeher. Fehlt er in der Vorgabe, steht er
  // nach dem ersten Laden auf undefined, die Ernennung setzt ihn trotzdem, und
  // beim Hinausgehen faellt der Erstkontakt aus -- ohne dass etwas kaputt
  // aussieht. Genau die Art Ausfall, die niemandem auffaellt.
  if(!('anlage2Wartet' in kn.flags)) fehler('Der Merker anlage2Wartet fehlt in kn.flags');
  if(!('anlage2Zug' in kn.counters)) fehler('Der Zähler anlage2Zug fehlt in kn.counters');
  // T7: ohne diesen Zaehler in der Vorgabe stuende er nach dem ersten Laden auf
  // undefined, (undefined|0) waere 0, und der Kanal liefe trotzdem. Er liefe
  // nur nie ueber drei hinaus, wenn ihn jemand spaeter nicht mehr schreibt,
  // und dann faellt nie wieder ein Ausbruch. Genau die Art Ausfall, die
  // niemandem auffaellt, weil nichts kaputt aussieht.
  if(!('anlage2Ruhig' in kn.counters)) fehler('Der Zähler anlage2Ruhig fehlt in kn.counters');
  // T4: dasselbe fuer den Kipppunkt und den Umschlagspeicher. Der Merker muss
  // ausserdem in kn.flags stehen, weil ZUSATZ_SCHALTER.merker.pruef jede Zeile
  // dagegen haelt, die ihn nennt.
  if(!('anlage2Dank' in kn.flags)) fehler('Der Merker anlage2Dank fehlt in kn.flags');
  if(!kn.umschlag || typeof kn.umschlag !== 'object') fehler('Das Feld kn.umschlag fehlt in der Vorgabe');
  if(!kn.a2Gefragt || typeof kn.a2Gefragt !== 'object') fehler('Das Feld kn.a2Gefragt fehlt in der Vorgabe');

  // (6b) Der Umschlag. Er ist die einzige Textquelle der Figur, die VERBRAUCHT
  // wird statt gezogen, und deshalb prueft sich hier anderes als bei den Pools:
  // nicht ob genug da ist, sondern ob jede Zeile genau einmal erreichbar ist.
  if(ANLAGE2_UMSCHLAG.length < 10 || ANLAGE2_UMSCHLAG.length > 14)
    fehler('Der Umschlag liegt außerhalb von zehn bis vierzehn Zeilen', ANLAGE2_UMSCHLAG.length);
  const gesehen = new Set();
  for(const u of ANLAGE2_UMSCHLAG){
    if(typeof u.id !== 'string' || !/^[a-zA-Z0-9]+$/.test(u.id)){ fehler('Eine Umschlagzeile trägt keine brauchbare id', u.id); continue; }
    if(gesehen.has(u.id)) fehler('Zwei Umschlagzeilen tragen dieselbe id', u.id);
    gesehen.add(u.id);
    if(typeof u.z !== 'string' || !u.z) fehler('Eine Umschlagzeile hat keinen Text', u.id);
    // Kein Gate am Umschlag. Er ist per Bauart einmalig und nur unter vier
    // Augen; ein Schalter daneben waere eine zweite Bedingung an derselben
    // Zeile und damit eine zweite Wahrheit darueber, wann sie faellt.
    const extra = Object.keys(u).filter(k => k !== 'id' && k !== 'z');
    if(extra.length) fehler('Eine Umschlagzeile trägt ein Gate, das ihr nicht zusteht', u.id, extra.join());
  }
  // Und dieselbe Symmetrie wie beim Kanal: eine Zeile, die nichts scharf
  // schaltet, hoert nie jemand. Sie faellt genau einmal im ganzen Spiel, wer
  // sie vergisst, merkt es also nie.
  const gearmt = ['ersterTod','ersterFeierabend','ersteKammer','ersterBosssieg','ersteEbene',
                  'ersteSperrablage','ersterRang','dank','ganzGelesen','zoegerlich','akt2','akt3','akt4','akt5'];
  for(const id of gearmt) if(!gesehen.has(id)) fehler('Etwas schaltet eine Umschlagzeile scharf, die es nicht gibt', id);
  for(const id of gesehen) if(gearmt.indexOf(id) < 0) fehler('Eine Umschlagzeile wartet auf ein Ereignis, das sie nie scharf schaltet', id);

  // (6c) Der Schalter fuer die zweite Buehne. Steht er nicht in der Tabelle,
  // faellt jede allein-gegatete Zeile stumm aus anlage2Zeilen() heraus, und
  // zwar ohne Fehler: die Schleife dort findet einfach keinen bekannten
  // Schalter und gibt false zurueck. Genau die Art Ausfall, die man erst ein
  // halbes Jahr spaeter bemerkt.
  if(!('allein' in ZUSATZ_SCHALTER)) fehler('Der Schalter allein fehlt in ZUSATZ_SCHALTER');

  // (7) Die Blaetter. Beide Auftakte fuehren in denselben Stapel, und beide
  // muessen die Tafelform tragen, die szeneTafel() liest.
  //
  // T6: die fuenf Stufen der Wahl liegen mitten in diesem Stapel und werden
  // von szeneTafel() aus derselben Hand gezeichnet. Sie muessen die Tafelform
  // deshalb genauso tragen, und zwar JEDE von ihnen: gezeigt wird immer nur
  // eine, ein Formfehler auf Stufe 3 faellt also erst dem Spieler auf, der
  // dreimal ablehnt.
  for(const [name, liste] of [['Ernennung', [ANLAGE2_AUFTAKT_ERNENNUNG].concat(ANLAGE2_FRAGE, ANLAGE2_BLAETTER)],
                              ['Nachholung', [ANLAGE2_AUFTAKT_NACHHOLUNG].concat(ANLAGE2_FRAGE, ANLAGE2_BLAETTER)]]){
    if(liste.length < 4) fehler('Die Einführung ist zu knapp geraten', name, liste.length);
    for(const b of liste){
      if(!b.blatt || !Array.isArray(b.stimme) || !b.stimme.length)
        fehler('Ein Blatt der Einführung trägt die Tafelform nicht', name);
    }
  }
  // Sie muss in ihrer eigenen Einfuehrung auch selbst zu Wort kommen, und zwar
  // unter ihrem Namen: der Sprechername steht in den Paaren und ist die einzige
  // Stelle, an der die Tafel sagt, wer da redet.
  const spricht = ANLAGE2_BLAETTER.some(b => b.stimme.some(z => z && z.wer === 'Anlage 2'));
  if(!spricht) fehler('In der Einführung spricht Anlage 2 nicht selbst');

  // (8) Der Baum. Vier Dinge, die die Gespraechsregeln des Hauses verlangen und
  // die szeneAssert() so nicht sieht, weil sie diesen einen Baum betreffen:
  // er haengt an keiner Dorffigur (sonst laege er auf der F-Taste statt im
  // Rucksack), sein Sprecher ist immer derselbe (sonst waeren es zwei Figuren),
  // sein Schild passt in den Deckel, und der Ausgang heisst woertlich so, wie
  // gespraechAssert() es von jeder Antwortliste verlangt.
  const b = SZENEN.baumAnlage2;
  if(!b) fehler('Der Gesprächsbaum fehlt');
  else {
    if(b.figur) fehler('Der Baum hängt an einer Dorffigur, dann läge er auf der F-Taste');
    if(b.sprecher() !== b.sprecher()) fehler('Der Sprecher ist bei jedem Aufruf ein anderer');
    if(ANLAGE2_FIGUR.kurz.length > SCHILD_DECKEL) fehler('Das Namensschild ist zu lang', ANLAGE2_FIGUR.kurz.length);

    // Der Ausgang. Gesucht wird nicht nach dem Wortlaut, sondern nach dem, was
    // die Option TUT: jede, die szeneEnde() ruft, verlaesst den Baum und muss
    // deshalb woertlich "Auf Wiedersehen." heissen, wie gespraechAssert() es
    // von jeder Antwortliste des Spiels verlangt. Am Wortlaut zu suchen waere
    // ein Zirkelschluss gewesen, und genau daran ist die erste Fassung dieses
    // Guards bei der Probe vorbeigelaufen: ein Ausgang, der "Auf Wiederhören."
    // hiess, fiel aus dem Filter und wurde nicht gemeldet.
    //
    // Der Quelltext der Funktion ist dabei die einzige Quelle, die es gibt,
    // und szeneAssert() liest ihn bei den Merkern seit SZ2 auf demselben Weg.
    const merkG = szene.gefragt;
    try {
      const opts = [];
      for(const k in b.knoten) if(b.knoten[k].opts) opts.push(...b.knoten[k].opts());
      // Beide Staende des Hub-Ausgangs, denn er wechselt mit der tiefsten Frage.
      for(const g of [new Set(), new Set(['was'])]){ szene.gefragt = g; opts.push(b.hubAusgang()); }
      const raus = opts.filter(o => o && typeof o.tun === 'function' && /szeneEnde/.test(o.tun.toString()));
      if(!raus.length) fehler('Kein Knoten führt aus dem Baum heraus');
      for(const o of raus)
        if(o.t !== 'Auf Wiedersehen.') fehler('Ein Ausgang lautet nicht wörtlich "Auf Wiedersehen."', o.t);

      // (8b) T4: der Kipppunkt haengt an genau einem Ausgang, dem des
      // dank-Knotens. Geprueft wird am Quelltext der Option und nicht am
      // Merkerstand, denn der Merker ist zur Startzeit natuerlich false. Faellt
      // die Verdrahtung heraus, verliert die Figur ihre Entwicklung, ohne dass
      // irgendetwas kaputt aussieht: die waermeren Zeilen gaebe es dann zwar,
      // aber nichts wuerde sie je oeffnen.
      const dankOpts = (b.knoten.dank && b.knoten.dank.opts) ? b.knoten.dank.opts() : [];
      const latcht = dankOpts.some(o => o && typeof o.tun === 'function' && /anlage2Dank/.test(o.tun.toString()));
      if(!latcht) fehler('Die angenommene Bitte setzt den Merker anlage2Dank nicht');
    } finally { szene.gefragt = merkG; }
  }

  // (9) T6: die Scheinwahl. Ihre Zeilen laufen durch szeneAssert() wie jedes
  // andere Tafelblatt; hier steht das, was nur DIESE Reihe betrifft und was
  // beim spaeteren Weiterschreiben lautlos kaputtginge.
  //
  // Der Bogen ist die Sache selbst: eine Reihe, die nicht eskaliert, ist keine
  // Ueberredung, sondern eine Wiederholung, und ein Nein-Knopf, der nie
  // gesperrt wird, macht aus der Scheinwahl eine echte.
  if(!Array.isArray(ANLAGE2_FRAGE) || ANLAGE2_FRAGE.length < 3)
    fehler('Die Wahl ist zu kurz für einen Bogen', ANLAGE2_FRAGE && ANLAGE2_FRAGE.length);
  else {
    // Genau die letzte Stufe sperrt. Sperrte eine fruehere mit, kaeme der
    // Spieler nicht mehr bis zum Schluss; sperrte keine, liefe die Reihe ins
    // Leere und der Nein-Knopf bliebe fuer immer anklickbar.
    ANLAGE2_FRAGE.forEach((s, i) => {
      const letzte = i === ANLAGE2_FRAGE.length - 1;
      if(!!s.gesperrt !== letzte)
        fehler(letzte ? 'Die letzte Stufe der Wahl sperrt den Nein-Knopf nicht'
                      : 'Eine Stufe vor der letzten sperrt den Nein-Knopf schon', i);
      if(!s.ja)   fehler('Eine Stufe der Wahl hat keine Beschriftung für Lesen', i);
      if(!s.nein) fehler('Eine Stufe der Wahl hat keine Beschriftung für Nicht lesen', i);
    });
    // Der Ja-Knopf heisst ueberall gleich. Er ist der Ausweg, und ein Ausweg,
    // der bei jedem Anlauf anders heisst, ist als Ausweg schlechter zu finden.
    if(new Set(ANLAGE2_FRAGE.map(s => s.ja)).size !== 1)
      fehler('Der Knopf zum Lesen heißt nicht auf jeder Stufe gleich');
    // Die anklickbaren Nein-Knoepfe tragen verschiedene Beschriftungen, sonst
    // steht der Bogen still. Die gesperrte Stufe ist ausgenommen: sie darf zur
    // ersten zurueckkehren, denn sie ist tot und wird nicht mehr gelesen,
    // sondern nur noch angesehen.
    const klickbar = ANLAGE2_FRAGE.filter(s => !s.gesperrt).map(s => s.nein);
    if(new Set(klickbar).size !== klickbar.length)
      fehler('Zwei anklickbare Stufen der Wahl tragen dieselbe Beschriftung');
    // Sie darf in ihrer eigenen Scheinwahl nicht der Antreiber sein. Auf jeder
    // Stufe ausser der ersten spricht das Amt, und das erkennt man daran, dass
    // mindestens eine Zeile KEIN Sprecherpaar ist. Faellt das weg, hat jemand
    // die Rollen vertauscht, und die Figur ist kaputt, ohne dass etwas bricht.
    for(let i = 1; i < ANLAGE2_FRAGE.length; i++)
      if(!ANLAGE2_FRAGE[i].stimme.some(z => typeof z === 'string'))
        fehler('Auf dieser Stufe überredet Anlage 2 selbst statt des Hauses', i);
  }
  // Die Wahl haengt an beiden Auftakten und an genau einem Blatt darin. Geprueft
  // wird am Quelltext der beiden Einstiege, wie szeneAssert() es bei den Merkern
  // seit SZ2 tut: der Aufruf ist die einzige Quelle, die es dafuer gibt.
  for(const [name, fn] of [['Ernennung', anlage2Erstes], ['Nachholung', anlage2Nachholen]]){
    const src = fn.toString();
    if(!/wahl:\s*\{\s*bei:\s*1,\s*reihe:\s*ANLAGE2_FRAGE\s*\}/.test(src))
      fehler('Dieser Weg in die Einführung trägt die Wahl nicht hinter dem Auftakt', name);
    if(!/ANLAGE2_FRAGE\[0\]/.test(src))
      fehler('Dieser Weg legt die erste Stufe nicht in die Blätterliste', name);
  }

  // T7 bringt die Ausbrueche in dieselbe Zeile, T6 die Stufen der Wahl. Die
  // Blattzahl steht auf +2 statt +1: hinter dem Auftakt liegt seit T6 die Wahl.
  const ausbrueche = Object.keys(ANLAGE2_AUSBRUCH).reduce((n, a) => n + ANLAGE2_AUSBRUCH[a].length, 0);
  // T8 nennt die Szenenzeilen mit ihrer Gegenzahl. "2 von 3" ist die Stelle,
  // an der das Schweigen bei Vorblatt in der Konsole steht: eine 3 dort waere
  // die Meldung, dass jemand die Entscheidung geraeuschlos zurueckgenommen hat.
  const szenenZeilen = Object.keys(ANLAGE2_SZENE).length;
  if(ok) console.log(`T3 Anlage 2: ${Object.keys(ANLAGE2_NOTIZ).length} Anlässe, `
    + `${ANLAGE2_BEWEGUNG.length} Sprüche in Reihe, ${ANLAGE2_BLAETTER.length + 2} Blätter, `
    + `${ANLAGE2_FRAGE.length} Stufen, `
    + `${ANLAGE2_UMSCHLAG.length} Umschläge, ${ausbrueche} Ausbrüche (${rate} geraten), `
    + `${szenenZeilen} von ${ANLASS_QUELLEN.length} Szenen-Anlässen, `
    + `Brandmauer in Ordnung.`);
}
anlage2Assert();
// AN5: hier und nicht bei seiner Definition, siehe den Kommentar dort.
anfangAssert();

// --- Guard, Bauform wie rangAssert()/anredeAssert(). Prueft beim Laden drei
// Dinge, die man beim spaeteren Weiterschreiben genau so verliert:
//   (1) Formregeln aus Kapitel 13 auf jeder einzelnen Zeile.
//   (2) Den Sperrvermerk auf die spaeteren Akte. Das ist der eigentliche Grund
//       fuer diesen Guard: der Vordruck ist die verfuehrerischste Stelle im
//       ganzen Spiel, um "kurz zu erklaeren, worum es eigentlich geht", und
//       genau das darf er nicht (Kapitel 2, Kapitel 9 Akt I).
//   (3) Dass der Text nicht behauptet, was der Code nicht tut: Blatt 2 sagt
//       "zur Haelfte", Blatt 3 sagt "alle fuenf Schichten". Beides sind Zahlen,
//       die woanders im Code stehen und sich unabhaengig aendern lassen.
// Wirft nie, meldet nur. Eine stille Konsole ist das Abnahmekriterium.
function dienstAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('W8 Einstellung:', m, ...r); };
  // Begriffe, die im Vordruck nichts zu suchen haben: sie gehoeren den Akten II
  // bis V und werden dort einzeln verdient. Bewusst gross geschrieben geprueft,
  // die Kleinschreibung ("kriegen", "zufrieden") soll nicht anschlagen.
  const SPERRE = AKTE_SPERRE;   // E1: eine Liste fuer Vordruck und Empfang, siehe oben
  const text = (txt, feld, figur) => {
    if(!txt) return fehler('Text leer', feld);
    if(txt.indexOf('undefined') >= 0) fehler('undefined im Text', feld, txt);
    if(/[—–]/.test(txt)) fehler('Gedankenstrich statt Interpunkt', feld, txt);
    if(figur && PRUEF_EMOJI.test(txt)) fehler('Emoji im Figurentext', feld, txt);
    for(const g of PRUEF_GEHEIM) if(txt.indexOf(g) >= 0) fehler('Sperrvermerk: Kesselgrammatik im Text', feld, g, txt);
    for(const s of SPERRE) if(txt.indexOf(s) >= 0) fehler('Vorgriff auf die Akte', feld, s, txt);
  };

  // (1) Blattform und Zaehlung
  if(DIENSTBLATT.length !== DIENSTBLATT_ANZ) fehler('DIENSTBLATT hat', DIENSTBLATT.length, 'Blätter statt', DIENSTBLATT_ANZ);
  DIENSTBLATT.forEach((b, i) => {
    const wo = `Blatt ${i+1}`;
    if(b.nr !== i + 1) fehler('Blattnummer weicht von der Position ab', wo, b.nr);
    text(b.kopf, wo + ' Kopf'); text(b.unter, wo + ' Unterzeile'); text(b.lead, wo + ' Vorspann');
    if(b.unter.indexOf(`Blatt ${b.nr} von ${DIENSTBLATT_ANZ}`) < 0)
      fehler('Blattzählung in der Unterzeile stimmt nicht', wo, b.unter);
    for(const [t, art] of dienstblattZeilen(b)) text(t, `${wo} ${art}`);
    if(!b.kn || !b.kn.length) fehler('Blatt ohne Knöterich-Zeile', wo);
    for(const z of (b.kn || [])) text(z, wo + ' Knöterich', true);
  });

  // (2) Text gegen Code. Beide Zahlen stehen im Vordruck als Wort und im Code
  // als Zahl, und nur der Guard verbindet die beiden Orte.
  // Über goldAufteilung() gelesen, nicht über CONFIG: das ist der Weg, den die
  // Schichtabrechnung wirklich geht, und seit dem Verwaltungskostenanteil sind
  // es drei Empfänger statt zwei. Blatt 2 Punkt 8 nennt zwei davon als Zahl.
  const auf = goldAufteilung(100);
  if(auf.guertel !== 50)
    fehler('Blatt 2 Punkt 8 sagt "zur Hälfte an den Gürtel", goldAufteilung(100) liefert', auf.guertel);
  if(auf.verwaltung !== 20)
    fehler('Blatt 2 Punkt 8 sagt "ein Fünftel Verwaltungskostenanteil", goldAufteilung(100) liefert', auf.verwaltung);
  if(auf.kasse !== 100 - auf.guertel - auf.verwaltung)
    fehler('Blatt 2 Punkt 8 sagt "der Rest an die Amtskasse", die Kasse bekommt aber', auf.kasse);
  // S1: Knoeterichs Zaehlzeile auf Blatt 2 nennt die Zahl der Punkte. Sie stand
  // seit W8 auf "Neun" und war seit Z2 still falsch. Jetzt haengt sie am Code.
  const ZAHLWORT = ['null','Ein','Zwei','Drei','Vier','Fünf','Sechs','Sieben','Acht','Neun','Zehn','Elf','Zwölf','Dreizehn'];
  const blatt2 = DIENSTBLATT.find(b => b.punkte);
  if(blatt2){
    const anz = blatt2.punkte().length, wort = ZAHLWORT[anz];
    const zeile = (blatt2.kn || []).join(' ');
    if(!wort) fehler('Punktezahl ausserhalb der Zahlwortliste', anz);
    else if(zeile.indexOf(wort + ' Punkte') < 0)
      fehler('Blatt 2 hat', anz, 'Punkte, Knöterich sagt etwas anderes:', zeile);
  }
  // (2b) E2: Beim Blaettern geht keine Zeile verloren.
  //
  // Der Vordruck wird seit E2 nicht mehr am Stueck gerendert, sondern in
  // Bloecke zerlegt und nach gemessener Hoehe auf Seiten verteilt. Die
  // Verteilung haengt am Fenster und ist deshalb nicht pruefbar; die Zerlegung
  // ist es, und sie ist die Stelle, an der beim naechsten Nachtragen etwas
  // verschwindet: wer eine sechste Zeilenart ergaenzt und sie in
  // dienstblattBloecke() vergisst, sieht sie nirgends fehlen. Sie waere
  // einfach nicht mehr im Spiel.
  for(const b of DIENSTBLATT){
    const bloecke = dienstblattBloecke(b, 'einstellung');
    const soll = (b.felder ? b.felder().length : 0)
               + (b.punkte ? b.punkte().length : 0)
               + ((b.bedienung && b.bedienung().length) ? 1 : 0)
               + (b.gestaltWahl ? 1 : 0)
               + (b.saetze ? b.saetze().length : 0)
               + (b.kn || []).length;
    if(bloecke.length !== soll)
      fehler(`Blatt ${b.nr} zerfällt in`, bloecke.length, 'Blöcke statt', soll);
    const alles = bloecke.map(x => x.html).join('');
    for(const [k, v] of (b.felder ? b.felder() : []))
      if(alles.indexOf(v) < 0) fehler(`Blatt ${b.nr}: Feld fehlt beim Blättern`, k);
    for(const [k, v] of (b.punkte ? b.punkte() : []))
      if(alles.indexOf(v) < 0) fehler(`Blatt ${b.nr}: Punkt fehlt beim Blättern`, k);
    for(const z of (b.saetze ? b.saetze() : []))
      if(alles.indexOf(z) < 0) fehler(`Blatt ${b.nr}: Schlusssatz fehlt beim Blättern`, z);
    for(const z of (b.kn || []))
      if(alles.indexOf(z) < 0) fehler(`Blatt ${b.nr}: Knöterich fehlt beim Blättern`, z);
  }

  const s0 = rangStufe();   // rangStufe() liest amt.schichten, deshalb ueber die Differenz geprueft
  if(RAENGE.length < 2 || rangNameVon(1) === rangNameVon(0))
    fehler('Blatt 3 verspricht eine Hebung nach Schicht 5, RAENGE liefert dieselbe Bezeichnung');
  if(typeof s0 !== 'number' || s0 < 0) fehler('rangStufe() liefert keine brauchbare Stufe', s0);

  // (3) Erreichbarkeit. Die drei Einsprungpunkte haengen in onclick-Zeichenketten
  // (#ovPanel), also am globalen Namensraum. Ein Umbenennen faellt sonst erst
  // auf, wenn jemand den Knopf drueckt.
  for(const n of ['showDienstblatt', 'dienstAntritt', 'dienstblattEnde', 'gestaltWaehlen'])
    if(typeof window[n] !== 'function') fehler('Einsprungpunkt fehlt im globalen Namensraum', n);

  // (4) P1: Das Wahlfeld ist Vordrucktext und trägt dieselben Formregeln wie
  // jede andere Zeile hier. Es steht nicht in felder(), landet also nicht von
  // selbst in dienstblattZeilen() und braucht diese Zeilen.
  text(GESTALT_TEXT, 'Blatt 1 Wahlfeld');
  for(const g of GESTALT_WAHL){ text(g.kurz, 'Wahlknopf ' + g.key); text(g.feld, 'Wahlfeldwert ' + g.key); }
  const wahlBlatt = DIENSTBLATT.filter(b => b.gestaltWahl);
  if(wahlBlatt.length !== 1) fehler('Das Wahlfeld liegt auf', wahlBlatt.length, 'Blättern statt auf genau einem');
  else if(!wahlBlatt[0].felder().some(([k]) => k === 'Anrede der Person'))
    fehler('Blatt mit Wahlknöpfen hat kein Feld "Anrede der Person"');

  if(ok) console.log('W8 Einstellung: 3 Blätter, Formregeln und Sperrvermerk in Ordnung.');
}
dienstAssert();

// ===========================================================================
//  P1: DIE DIENSTGESTALT — die Person des Tages.
//
//  Zwei Dinge, die vorher fehlten und die derselbe Bauabschnitt regelt:
//
//  1. Der Außendienst war jeden Morgen ein anderer Mensch, sah aber jeden Morgen
//     aus wie das Dorf: fünf Naturtöne aus demselben Paket, aus dem auch die
//     Staffage gebaut ist. Auf einem vollen Dorfplatz und in einer Horde fand
//     man sich nicht wieder. Die Haarfarbe kommt jetzt aus CF_HAARTON und ist
//     absichtlich keine, die es in Vordermühl sonst gibt.
//
//  2. Wer der Mensch des Tages ist, war reiner Zufall und blieb es. Blatt 1
//     nimmt dazu jetzt eine Angabe entgegen, und der Schichtantritt hält sich
//     daran. Mehr tut sie nicht: kein Wert, kein Bonus, keine andere Zeile im
//     Spiel liest amt.gestalt. Genau das ist der Witz an der Stelle, an der sie
//     steht, direkt unter "Anlage 1 liegt nicht vor".
//
//  Die Grenze dieses Abschnitts, damit sie nicht später erweitert wird: das
//  Haus kennt die Angabe, spricht sie aber nirgends aus. Die Anredeleiter aus
//  18.5 bleibt unangetastet, "Herr oder Frau" bleibt "Herr oder Frau". Der
//  Dienstposten kennt das Geschlecht der Person, die ihn heute bekleidet, immer
//  noch nicht: er kennt nur einen Vermerk in einem Vordruck, und Vordrucke
//  sprechen nicht.
// ===========================================================================
function gestaltAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('P1 Dienstgestalt:', m, ...r); };

  // (1) Jede Frisur trägt genau eine gültige Lesart, und beide sind besetzt.
  // Läuft eine leer, fällt haareNach() still auf alle zurück, und die Angabe auf
  // Blatt 1 wäre wirkungslos statt falsch. Das ist der Fall, der sich beim
  // Weiterschreiben von selbst einschleicht.
  for(const h of CF_HAIR) if(h.art !== 'm' && h.art !== 'w') fehler('Frisur ohne gültige Lesart', h.key, h.art);
  for(const art of ['m', 'w']){
    const l = CF_HAIR.filter(h => h.art === art);
    if(!l.length) fehler('Keine einzige Frisur mit der Lesart', art);
  }
  if(HAIRS.length !== CF_HAIR.length) fehler('HAIRS und CF_HAIR sind verschieden lang', HAIRS.length, CF_HAIR.length);

  // (2) Die Auswahl liefert, was sie verspricht: 'm' nur Männliches, 'w' nur
  // Weibliches, 'egal' alles, und nie eine leere Liste.
  for(const g of GESTALT_WAHL){
    const l = haareNach(g.key);
    if(!l.length) fehler('Leere Frisurenauswahl für', g.key);
    if(g.key === 'egal'){ if(l.length !== HAIRS.length) fehler('"Ohne Angabe" schränkt ein', l.length, 'von', HAIRS.length); }
    else for(const k of l){
      const h = CF_HAIR.find(x => x.key === k);
      if(!h || h.art !== g.key) fehler('Auswahl', g.key, 'enthält eine fremde Frisur', k);
    }
  }
  if(!GESTALT_WAHL.some(g => g.key === GESTALT_STD)) fehler('Der Auslieferungszustand steht nicht in der Tabelle', GESTALT_STD);
  if(gestaltDef('gibtesnicht').key !== GESTALT_STD) fehler('Ein unbekannter Wert fällt nicht auf den Auslieferungszustand zurück');

  // (3) Die Töne. Acht unterscheidbare Farben, alle als #rrggbb notiert, keine
  // zweimal, und keine, die sich mit einem Naturton des Pakets verwechseln
  // ließe: darum geht es bei dieser Änderung überhaupt.
  const gesehen = new Set();
  for(const t of CF_HAARTON){
    if(!/^#[0-9a-f]{6}$/i.test(t.hex)) fehler('Kein sechsstelliger Farbwert', t.key, t.hex);
    if(gesehen.has(t.hex)) fehler('Farbe doppelt vergeben', t.key, t.hex);
    gesehen.add(t.hex);
    if(!t.name) fehler('Ton ohne Namen', t.key);
    // Sättigung im HSV-Sinn. Alles unter der Hälfte wäre ein Naturton.
    const r = parseInt(t.hex.slice(1,3),16), g = parseInt(t.hex.slice(3,5),16), b = parseInt(t.hex.slice(5,7),16);
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    if(max === 0 || (max - min) / max < 0.5) fehler('Ton ist zu blass, um aufzufallen', t.key, t.hex);
  }
  if(CF_HAARTON.length < 4) fehler('Zu wenige Töne für eine erkennbare Abwechslung', CF_HAARTON.length);
  if(haarHex('gibtesnicht') !== CF_HAARTON[0].hex) fehler('Unbekannter Ton fällt nicht auf den ersten zurück');

  // (4) Der Loader nimmt nur an, was die Tabelle kennt. Gespiegelt geprüft,
  // gleiche Bauform wie in wiederAssert(): echten Wert weg, Prüfwerte rein, im
  // finally zurück. Kein saveAmt() in diesem Guard.
  const eGestalt = amt.gestalt;
  try {
    for(const [wert, soll] of [['m','m'], ['w','w'], ['egal','egal'], ['x', null], ['', null]]){
      amt.gestalt = GESTALT_STD;
      if(GESTALT_WAHL.some(g => g.key === wert)) amt.gestalt = wert;
      const erwartet = soll || GESTALT_STD;
      if(amt.gestalt !== erwartet) fehler('Gespeicherter Wert', JSON.stringify(wert), 'ergibt', amt.gestalt, 'statt', erwartet);
    }
  } finally { amt.gestalt = eGestalt; }

  if(ok) console.log('P1 Dienstgestalt: Lesarten, Auswahl und Haarfarben in Ordnung.');
}
gestaltAssert();

// ===========================================================================
//  W10: DIE WIEDEREINSETZUNG — Weltbibel Kapitel 5 und 18.2. Der eine Kauf,
//  den dieses Spiel anbietet, und die einzige Art, wie derselbe Mensch zweimal
//  antreten kann.
//
//  Die Ausgangslage steht wörtlich in Kapitel 5: der Dienstposten ist täglich
//  befristet, weil eine Verlängerung eine Neubesetzung wäre, eine Neubesetzung
//  eine Ausschreibung erfordert und eine Ausschreibung die Amtsleitung. Es gibt
//  keine Amtsleitung. Deshalb kommt jeden Tag jemand anderes.
//
//  Der Antrag auf Wiedereinsetzung in den vorigen Stand ist keine Verlängerung
//  und keine Neubesetzung, sondern eine Berichtigung. Anderer Paragraf, keine
//  Ausschreibung, keine Leitung nötig. Das Haus kann ihn also bewilligen, ohne
//  eine einzige Regel zu brechen, und der N.-N.-Gag arbeitet zum ersten Mal für
//  den Spieler statt gegen ihn.
//
//  Drei Grenzen, die dieser Bauabschnitt einhält:
//
//  1. Keine Bestechung, kein Zynismus (Humor-Grundgesetz 2, 4 und 8). Bezahlt
//     wird eine Gebühr an die Amtskasse, nicht eine Person. Niemand im Haus
//     nimmt Geld, niemand drückt ein Auge zu, niemand findet es bemerkenswert.
//
//  2. Der Rang bleibt unverkäuflich (18.2: "er kostet kein Gold, er lässt sich
//     nicht kaufen"). Der Antrag fasst amt.schichten nicht an, also auch
//     rangStufe() nicht. Gekauft wird der Dienststand der Person, nie die Stelle.
//
//  3. "Persönliche Qualifikation ist nicht übertragbar" (Kapitel 5) bleibt
//     wortwörtlich gültig. Es wird nichts übertragen, weil niemand wechselt.
//     Genau deshalb muss es derselbe Mensch sein und nicht ein Erbe.
//
//  Was der Stand umfasst, legt das Haus so eng aus, wie es darf: den Dienststand
//  und das Gesicht. Ausrüstung ist Amtsvermögen und wird eingezogen wie immer,
//  Zauber und Skillpunkte sind Beurteilung und keine Sache. Man bekommt also
//  Zähigkeit zurück (Stufe wirkt in recalc() auf maxHp und maxMana), aber weder
//  Ausstattung noch Können. Zehnjährige lesen "die haben mir nur das langweilige
//  Zeug wiedergegeben", Erwachsene die enge Auslegung eines Rechtsbegriffs.
// ===========================================================================

// Anfangsstufe einer Schicht. EINE Wahrheitsquelle, von startShift() und vom
// Antrag gelesen — vorher stand die Rechnung nur inline in startShift(), und
// der Antrag hätte sie abgeschrieben (die F1-Falle).
function wiederAnfangsstufe(){ return 1 + amt.ausbauten.startLevel; }

// Der vorige Stand: die halbe erreichte Stufe, abgerundet. Bewusst hart die
// Hälfte und nicht verhandelbar — eine Wiedereinsetzung setzt in einen Stand
// zurück, sie belohnt nicht.
function wiederStand(){ return Math.max(1, Math.floor(player.level / 2)); }

// Gebührenverzeichnis. Grundgebühr, Zuschlag je Stufe über der Anfangsstufe,
// Wiederholungszuschlag je bereits bewilligtem Antrag. Der dritte Posten ist
// der Grund, warum der Antrag kein Dauerabo wird.
const WIEDER_GRUND = 40, WIEDER_JE_STUFE = 30, WIEDER_WIEDERHOLUNG = 60;
function wiederGebuehr(){
  const ueber = Math.max(0, wiederStand() - wiederAnfangsstufe());
  return WIEDER_GRUND + WIEDER_JE_STUFE * ueber + WIEDER_WIEDERHOLUNG * Math.max(0, amt.wiederZahl | 0);
}

// "Ein Antrag ohne Beschwer ist unzulässig." Realer Verfahrensgrundsatz und
// zugleich das ganze Gatter: liegt der vorige Stand nicht über der Anfangsstufe,
// ändert die Bewilligung nichts, also nimmt das Haus den Antrag nicht an. Das
// skaliert von selbst mit dem Ausbau "Höhere Anfangsstufe" mit, ohne dass hier
// eine zweite Schwelle gepflegt werden müsste.
function wiederBeschwer(){ return wiederStand() > wiederAnfangsstufe(); }
function wiederZulaessig(){ return CONFIG.schichtModus && wiederBeschwer(); }
function wiederBezahlbar(){ return amt.bankGold >= wiederGebuehr(); }
// Sichtbar, sobald der Spieler überhaupt eine Stufe gestiegen ist. Vorher wäre
// die Zeile nur Rauschen im Bericht der ersten Minuten.
function wiederSichtbar(){ return CONFIG.schichtModus && player.level > wiederAnfangsstufe(); }

const WIEDER_ENG = 'Der Stand umfasst den Dienststand. Ausrüstung, Zauber und Beurteilung gehören nicht dazu.';
const WIEDER_KEIN_NEU = 'Eine Verlängerung ist ausgeschlossen, sie wäre eine Neubesetzung. Die Wiedereinsetzung ist keine Neubesetzung, sondern eine Berichtigung.';
const WIEDER_VERMERK = 'Vermerk: Eine Ausschreibung wird nicht erforderlich.';

// Der Block im Dienstbericht. Reine Funktion, Bauform wie rangBerichtBlock():
// kein Seiteneffekt, jedes Neurendern liefert dasselbe.
function wiederBlockHtml(){
  if(!wiederSichtbar()) return '';
  const rahmen = (inhalt) => `
    <div style="text-align:left;background:rgba(0,0,0,.5);padding:12px;border-radius:8px;font-size:calc(12px * var(--fs));margin:14px 0;border:1px solid #5a4a2d;">
      <b style="color:#f4d97a;">Antrag auf Wiedereinsetzung in den vorigen Stand</b><br>${inhalt}</div>`;

  // Bereits bewilligt: der Antrag liegt vor, der Knopf ist weg.
  if(amt.wiedereinsetzung){
    return rahmen(`
      <span style="color:#c9b98a;">Bewilligt. Sie treten morgen erneut an, in Stufe ${amt.wiedereinsetzung.stand}.</span><br>
      <span style="color:#9a8a5f;">Gebühr gebucht. Amtskasse: <i class="ico ico-gold">💰</i> ${amt.bankGold}.</span><br>
      <span style="color:#7a6a45;">${WIEDER_VERMERK}</span>`);
  }
  if(!wiederZulaessig()){
    return rahmen(`
      <span style="color:#9a8a5f;">Ein Antrag ohne Beschwer ist unzulässig. Ihr voriger Stand läge bei Stufe ${wiederStand()}, die Anfangsstufe bei ${wiederAnfangsstufe()}.</span>`);
  }
  const g = wiederGebuehr(), kann = wiederBezahlbar();
  return rahmen(`
    <span style="color:#c9b98a;">${WIEDER_KEIN_NEU}</span><br>
    <span>Wiedereinsetzung in Stufe ${wiederStand()}. Gebühr <i class="ico ico-gold">💰</i> ${g}, aus der Amtskasse. Bestand: <i class="ico ico-gold">💰</i> ${amt.bankGold}.</span><br>
    <span style="color:#9a8a5f;">${WIEDER_ENG}</span><br>
    <button ${kann ? '' : 'disabled'} onclick="wiederBeantragen()" style="font-size:calc(12px * var(--fs));padding:6px 12px;margin:8px 0 0;">${kann ? 'ANTRAG STELLEN' : 'Amtskasse trägt das nicht'}</button>`);
}

// Die einzige Schreibstelle. Prüft alle drei Bedingungen noch einmal selbst,
// statt sich auf den Zustand des Knopfes zu verlassen: der Knopf steht in einer
// Zeichenkette und ein zweiter Klick darf nicht zweimal buchen.
function wiederBeantragen(){
  if(!wiederZulaessig() || !wiederBezahlbar() || amt.wiedereinsetzung) return;
  const g = wiederGebuehr();
  amt.bankGold -= g;
  // P1: Das Gesicht ist seit der Dienstgestalt zwei Angaben, Frisur und Ton.
  // Beide gehoeren zur Person, beide kommen mit ihr zurueck.
  amt.wiedereinsetzung = {stand: wiederStand(), haar: player.hair, ton: player.haarTon};
  amt.wiederZahl = Math.max(0, amt.wiederZahl | 0) + 1;
  saveAmt();
  const box = document.getElementById('wiederBox');
  if(box) box.innerHTML = wiederBlockHtml();
}

// --- Guard, Bauform wie rangAssert()/dienstAssert(). Wirft nie, meldet nur.
function wiederAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('W10 Wiedereinsetzung:', m, ...r); };
  for(const [t, feld] of [[WIEDER_ENG,'enge Auslegung'], [WIEDER_KEIN_NEU,'Abgrenzung'], [WIEDER_VERMERK,'Vermerk']]){
    if(!t) fehler('Text leer', feld);
    else {
      if(/[—–]/.test(t)) fehler('Gedankenstrich statt Interpunkt', feld, t);
      if(PRUEF_EMOJI.test(t)) fehler('Emoji im Figurentext', feld, t);
      for(const g of PRUEF_GEHEIM) if(t.indexOf(g) >= 0) fehler('Sperrvermerk: Kesselgrammatik im Text', feld, g);
    }
  }

  // Gespiegelt geprüft, wie goldAssert() es vormacht: echte Werte weg, Sollwerte
  // rein, im finally alles zurück. Kein saveAmt() in diesem Guard.
  const eLevel = player.level, eHaar = player.hair, eZahl = amt.wiederZahl,
        eWieder = amt.wiedereinsetzung, eStart = amt.ausbauten.startLevel, eGold = amt.bankGold;
  try {
    amt.wiedereinsetzung = null;

    // (1) Beschwer: bei Gleichstand unzulässig, eine Stufe darüber zulässig.
    // Anfangsstufe 1 => Stufe 2 gibt Stand 1 (gleich, unzulässig),
    //                   Stufe 4 gibt Stand 2 (darüber, zulässig).
    amt.ausbauten.startLevel = 0; amt.wiederZahl = 0;
    player.level = 2;
    if(wiederStand() !== 1) fehler('Stand bei Stufe 2 ist', wiederStand(), 'statt 1');
    if(wiederBeschwer()) fehler('Antrag ohne Beschwer gilt als zulässig, Stufe 2');
    player.level = 4;
    if(wiederStand() !== 2) fehler('Stand bei Stufe 4 ist', wiederStand(), 'statt 2');
    if(!wiederBeschwer()) fehler('Antrag mit Beschwer gilt als unzulässig, Stufe 4');

    // (2) Die Hälfte ist die Hälfte, abgerundet, und nie über der erreichten Stufe.
    for(const lvl of [1, 2, 3, 5, 7, 10, 11, 20, 41]){
      player.level = lvl;
      const s = wiederStand();
      if(s !== Math.max(1, Math.floor(lvl / 2))) fehler('Stand weicht von der halben Stufe ab', lvl, s);
      if(s > lvl) fehler('Stand liegt über der erreichten Stufe', lvl, s);
      if(s < 1) fehler('Stand unter Stufe 1', lvl, s);
    }

    // (3) Gebühr steigt monoton mit dem Stand und mit der Zahl der Anträge.
    player.level = 10; amt.wiederZahl = 0;
    const g10 = wiederGebuehr();
    player.level = 20;
    if(!(wiederGebuehr() > g10)) fehler('Gebühr steigt nicht mit dem Stand', g10, wiederGebuehr());
    player.level = 10; amt.wiederZahl = 1;
    if(wiederGebuehr() !== g10 + WIEDER_WIEDERHOLUNG) fehler('Wiederholungszuschlag fehlt', g10, wiederGebuehr());
    amt.wiederZahl = 0;
    if(wiederGebuehr() < WIEDER_GRUND) fehler('Gebühr unter der Grundgebühr', wiederGebuehr());

    // (4) Der Ausbau "Höhere Anfangsstufe" verschiebt die Schwelle mit, ohne dass
    // hier eine zweite Zahl gepflegt wird. Bei Anfangsstufe 5 ist Stufe 10 noch
    // ohne Beschwer (Stand 5), Stufe 12 nicht mehr (Stand 6).
    amt.ausbauten.startLevel = 4;
    if(wiederAnfangsstufe() !== 5) fehler('Anfangsstufe weicht von startShift() ab', wiederAnfangsstufe());
    player.level = 10;
    if(wiederBeschwer()) fehler('Beschwer bei Anfangsstufe 5 und Stufe 10 fälschlich bejaht');
    player.level = 12;
    if(!wiederBeschwer()) fehler('Beschwer bei Anfangsstufe 5 und Stufe 12 fälschlich verneint');

    // (5) 18.2: der Rang ist nicht Teil des Geschäfts. Weder Stand noch Gebühr
    // noch der bewilligte Antrag dürfen rangStufe() bewegen.
    const rangVorher = rangStufe();
    amt.wiedereinsetzung = {stand: 9, haar: eHaar, ton: player.haarTon};
    if(rangStufe() !== rangVorher) fehler('Der bewilligte Antrag hat den Rang verschoben', rangVorher, rangStufe());
    amt.wiedereinsetzung = null;

    // (6) Sichtbarkeit hängt an einer echten Stufe, nicht am Zufall.
    amt.ausbauten.startLevel = 0; player.level = 1;
    if(wiederSichtbar()) fehler('Block ist auf der Anfangsstufe sichtbar');
    player.level = 2;
    if(!wiederSichtbar()) fehler('Block bleibt nach dem ersten Aufstieg unsichtbar');
  } finally {
    player.level = eLevel; player.hair = eHaar; amt.wiederZahl = eZahl;
    amt.wiedereinsetzung = eWieder; amt.ausbauten.startLevel = eStart; amt.bankGold = eGold;
  }

  // (7) Die Klemme, beidseitig. Der Fund, der diesen Abschnitt erzwungen hat:
  // ein von Hand gesetztes {stand: 999} lief durch Loader und Einlösung glatt
  // durch und ergab eine Schicht auf Stufe 999.
  for(const [roh, soll] of [[999, WIEDER_STAND_DECKEL], [WIEDER_STAND_DECKEL + 1, WIEDER_STAND_DECKEL],
                            [0, 1], [-7, 1], [NaN, 1], [7, 7], [WIEDER_STAND_DECKEL, WIEDER_STAND_DECKEL]]){
    const ist = wiederStandGeklemmt(roh);
    if(ist !== soll) fehler('Stand nicht geklemmt', roh, 'ergibt', ist, 'statt', soll);
  }
  // Was der Antrag selbst vergibt, liegt immer innerhalb der Klemme — sonst
  // würde der Deckel im normalen Spiel greifen und stillschweigend kürzen.
  if(wiederStandGeklemmt(WIEDER_STAND_DECKEL) !== WIEDER_STAND_DECKEL)
    fehler('Deckel klemmt sich selbst weg');

  // (8) Erreichbarkeit: der Knopf steht in einer onclick-Zeichenkette im
  // #ovPanel, hängt also am globalen Namensraum.
  if(typeof window.wiederBeantragen !== 'function') fehler('Einsprungpunkt fehlt im globalen Namensraum');

  if(ok) console.log('W10 Wiedereinsetzung: Beschwer, Gebührenstaffel und Rangfreiheit in Ordnung.');
}
wiederAssert();

function showDorf(){
  auftragBrettSichern();   // W4: würfelt nur, wenn noch kein Brett für diese Schicht hängt
  MUS.goto('office'); MUS.muffle(false);   // ggf. noch vom Dienstbericht gedämpft — der Marsch soll klar klingen
  const rows = AUSBAU_DEFS.map(d => {
    const lvl = amt.ausbauten[d.key], maxed = lvl >= d.max, cost = maxed ? 0 : d.cost(lvl);
    return `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #3a2f1a;">
      <div><b>${d.name}</b><br><span style="font-size:calc(11px * var(--fs));color:#9a8a5f;">${d.desc} Jetzt: ${d.unit(lvl)}</span></div>
      <button ${maxed||amt.bankGold<cost?'disabled':''} onclick="buyAusbau('${d.key}')" style="font-size:calc(12px * var(--fs));padding:6px 10px;margin:0;">${maxed?'MAX':'💰'+cost}</button>
    </div>`;
  }).join('');

  const vermRow = `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #3a2f1a;">
    <div><b>Vermutungen in der Kladde</b><br><span style="font-size:calc(11px * var(--fs));color:#9a8a5f;">Die Kladde zeigt zusätzlich unbestätigte Vermutungen.</span></div>
    <button ${amt.ausbauten.vermutungen||amt.bankGold<100?'disabled':''} onclick="buyVermutungen()" style="font-size:calc(12px * var(--fs));padding:6px 10px;margin:0;">${amt.ausbauten.vermutungen?'AKTIV':'💰100'}</button>
  </div>`;

  const fluchChoices = amt.ausbauten.startFluchUnlocked
    ? STARTFLUCH_WAHL.map(k => `<button onclick="waehleStartFluch('${k}')" style="font-size:calc(10px * var(--fs));margin:2px;padding:4px 7px;${amt.ausbauten.startFluch===k?'background:#7a5a10;':''}">${FLUCH[k].kurz}</button>`).join('')
    : `<button ${amt.bankGold<60?'disabled':''} onclick="unlockStartFluch()" style="font-size:calc(12px * var(--fs));padding:6px 10px;margin:0;">💰60 freischalten</button>`;
  const fluchRow = `<div style="padding:6px 0;border-bottom:1px solid #3a2f1a;">
    <div><b>Startausrüstung mit festem Fluch</b><br><span style="font-size:calc(11px * var(--fs));color:#9a8a5f;">Wähle den milden Fluch, der die Startwaffe jeder Schicht begleitet.</span></div>
    <div style="margin-top:6px;">${fluchChoices}</div>
  </div>`;

  // W4: Schwarzes Brett, vierte und letzte Sektion. auftragBrettSichern() oben
  // garantiert amt.brett für die kommende Schicht (amt.schichten, noch nicht erhöht).
  const brettRow = !CONFIG.schichtModus ? '' : `
    <div style="padding:10px 0 4px;border-top:1px solid #5a4a2d;margin-top:8px;">
      <b>Schwarzes Brett</b>
      <span style="font-size:calc(11px * var(--fs));color:#9a8a5f;">· ein Aushang je Schicht, Abbruch jederzeit</span>
    </div>` + amt.brett.liste.map((a, i) => {
      const def = AUFTRAG_TYPEN[a.typ], gew = !!amt.auftrag && amt.auftrag.typ === a.typ;
      return `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #3a2f1a;${gew?'background:rgba(122,90,16,.30);':''}">
        <div><b>${def.titel(a)}</b>
          <br><span style="font-size:calc(11px * var(--fs));color:#9a8a5f;">${def.satz(a)}</span>
          <br><span style="font-size:calc(10px * var(--fs));color:#7a6a45;font-style:italic;">${AUFTRAG_BEMERKUNGEN[a.bm]}</span></div>
        <button onclick="waehleAuftrag(${i})" style="font-size:calc(12px * var(--fs));padding:6px 10px;margin:0;${gew?'background:#7a5a10;':''}">${gew?'ANGENOMMEN':'💰'+a.lohn}</button>
      </div>`;
    }).join('') + `
    <div style="padding:6px 0;text-align:right;">
      <button onclick="waehleAuftrag(-1)" style="font-size:calc(10px * var(--fs));margin:2px;padding:4px 7px;${amt.auftrag?'':'background:#7a5a10;'}">Kein Aushang</button>
    </div>`;

  document.getElementById('ovPanel').innerHTML = `
    <h1>AMT FÜR MONSTERANGELEGENHEITEN</h1>
    <p style="font-size:calc(12px * var(--fs));color:#9a8a5f;">Schicht ${amt.schichten} abgeschlossen · Bankguthaben: <i class="ico ico-gold">💰</i> ${amt.bankGold}${amt.auftrag ? ' · Aushang angenommen' : ''}</p>
    <p style="font-size:calc(12px * var(--fs));color:#c9b98a;">${rangName()} · ${rangGruppeName()} · ${rangVerhaeltnis()}</p>
    <p style="font-size:calc(11px * var(--fs));color:#9a8a5f;">Nächste Hebung nach Schicht ${(rangStufe()+1)*5}: ${rangNameVon(rangStufe()+1)}</p>
    <div style="max-height:44vh;overflow-y:auto;text-align:left;">${rows}${vermRow}${fluchRow}${brettRow}</div>
    <button onclick="startShift()">NÄCHSTE SCHICHT ANTRETEN</button>
    <div><button onclick="showDienstblatt(2,'dorf')" style="font-size:calc(12px * var(--fs));padding:7px 16px;margin-top:10px;">Dienstanweisung</button></div>
  `;
  document.getElementById('overlay').style.display = 'flex';
  state = 'feierabend';
}

// ===========================================================================
//  U1: Ein Verzeichnis der Panels, und was daneben zu klicken heisst
//
//  Bis hierher wussten nur die Esc-Kette (unten) und drei ueber die Datei
//  verstreute Aufraeum-Listen (respawnPlayer, startShift, endShift), welche
//  Panels es ueberhaupt gibt — jede als unvollstaendige Kopie derselben
//  Zeilen: respawnPlayer raeumt drei der sieben, endShift vier, startShift
//  sechs (das Symbolschloss fehlt in allen dreien, weil es die Kammer
//  ohnehin mitnimmt).
//  Das hier ist dieselbe Liste einmal, benannt, und mit dem Schliesser dabei.
//  Die Zustaende werden ueber Funktionen gelesen, nicht kopiert: `invOpen` &Co.
//  sind Bindungen, die die Toggles umsetzen, kein Wert, den man einsammeln kann.
//
//  Reihenfolge = Esc-Reihenfolge, damit beide Wege dieselbe Vorstellung davon
//  haben, was "oben" liegt.
const PANEL_REGISTER = [
  // U3: zuerst, weil das Gespraechsfenster mit z-index 21 ueber den Panels
  // liegt. Damit erbt es UI_INSELN (Klick hinein ist kein Klick daneben),
  // den Schleier und das Wegwischen, ohne eine eigene Zeile dafuer.
  {id:'gespraech',  offen:() => gespraechOffen, zu:() => gespraechSchliessen()},
  {id:'inv',        offen:() => invOpen,        zu:() => toggleInventory()},
  {id:'spellTree',  offen:() => spellTreeOpen,  zu:() => toggleSpellTree()},
  // U8: Aus dem Zulagenfenster ist das Charakterfenster geworden; die Mappe
  // ist eines seiner Blaetter. Ein Eintrag, wie vorher, nur mit dem Fenster,
  // das es jetzt gibt.
  {id:'charakter',  offen:() => charakterOpen,  zu:() => toggleCharakter()},
  {id:'kessel',     offen:() => kesselOpen,     zu:() => toggleKessel()},
  {id:'optionen',   offen:() => optionenOpen,   zu:() => toggleOptionen()},
  {id:'ausweis',    offen:() => ausweisOpen,    zu:() => toggleAusweis()},
  {id:'fullmap',    offen:() => fullmapOpen,    zu:() => toggleFullmap()},
  {id:'schloss',    offen:() => schlossOpen,    zu:() => schlossZu()},
  {id:'amtFenster', offen:() => amtFensterOpen, zu:() => amtFensterSchliessen()},
];

function panelOffenIrgendwo(){ return PANEL_REGISTER.some(p => p.offen()); }

// Setzt den Schleier. Wird am Ende jedes Oeffners und Schliessers gerufen —
// eine Zeile je Toggle statt einer Abfrage pro Frame im Renderpfad.
function panelSicht(){
  document.body.classList.toggle('panelOffen', panelOffenIrgendwo());
}

// Die Inseln, die NICHT "daneben" sind. Alles andere im Bild ist Welt: das
// Canvas selbst, und die durchklickbaren Einblendungen darueber (#zone,
// #knZettel, #knRandnotiz, #tooltip stehen alle auf pointer-events:none, ihre
// Klicks landen ohnehin am Canvas).
const UI_INSELN = '#hud, #touchCluster, #minimap, #overlay, #menuVeil, '
                + PANEL_REGISTER.map(p => '#' + p.id).join(', ');

function istDanebenZiel(t){
  return !(t instanceof Element) || !t.closest(UI_INSELN);
}

// Schliesst alle offenen Panels und meldet, ob es etwas zu schliessen gab.
// Alle, nicht nur das oberste: Esc geht eine Ebene zurueck, das ist seine
// Aufgabe. Ein Griff NEBEN die Menues ist keine Ebene, sondern ein Wegwischen —
// und #inv (rechts) und #spellTree (links) koennen gleichzeitig offen stehen,
// ein Klick in die Mitte liegt dann neben beiden.
function panelsWegklicken(){
  const offen = PANEL_REGISTER.filter(p => p.offen());
  if(!offen.length) return false;
  for(const p of offen) p.zu();
  return true;
}

// Der eigentliche Wunsch: neben ein Menue klicken oder tippen schliesst es.
// Zwei Dinge muessen dabei zusammenkommen.
//
// 1. Das Panel geht zu. 2. Der Druck, der es weggewischt hat, darf nicht auch
//    noch ein Angriff sein. Die Angriffe haengen an canvas.mousedown und
//    canvas.touchstart; ein Lauscher in der EINFANGPHASE am window laeuft vor
//    ihnen, stopPropagation() schneidet sie dann ab. Deshalb capture:true.
//
// Kein modaler Vorhang, obwohl der einfacher waere: die Mobile-Breakpoints
// verankern die Panels oben und lassen unten ~349px frei, damit Angriff,
// Zauber, Trank und Ult mit offenem Panel erreichbar bleiben. Ein Element ueber
// dem ganzen Bild kassierte genau das. Entschieden wird deshalb am Ziel des
// Ereignisses (UI_INSELN), nicht an einer Flaeche.
//
// Gestoppt wird nur, was das Canvas trifft. Ein Klick daneben auf etwas
// anderes (spaetere Einblendung mit eigenem Klickziel) schliesst zwar auch,
// behaelt aber seine eigene Wirkung — dort gibt es keinen Angriff abzufangen.
window.addEventListener('mousedown', e => {
  if(e.button !== 0 || !istDanebenZiel(e.target)) return;
  if(!panelsWegklicken()) return;
  if(e.target === canvas){ e.stopPropagation(); e.preventDefault(); }
}, true);

window.addEventListener('touchstart', e => {
  if(!istDanebenZiel(e.target) || !panelOffenIrgendwo()) return;
  // initAudio()/enterTouchMode() haengen am document- bzw. canvas-Lauscher,
  // die gleich abgeschnitten werden. Der erste Tipp ins Bild darf den
  // Ton-Freigabeklick nicht verlieren, nur weil ein Panel offen stand.
  initAudio(); enterTouchMode();
  panelsWegklicken();
  // e.cancelable pruefen: laeuft gerade ein Scroll, liefert der Browser ein
  // nicht stornierbares touchstart, und preventDefault() darauf ist kein
  // Fehler mit Folgen, aber eine Zeile in der Konsole. Eine Konsole, in der
  // dauerhaft etwas steht, ist keine Konsole mehr (s. README).
  // stopPropagation() greift auch dort und haelt den Angriff zurueck.
  if(e.target === canvas){ e.stopPropagation(); if(e.cancelable) e.preventDefault(); }
}, {capture:true, passive:false});

window.addEventListener('keydown', e => {
  initAudio();
  // U3: Solange die Tafel offen ist, gehoeren ihr die Ziffern, die Pfeile
  // hoch/runter und die Eingabetaste. Sonst waere die '1' gleichzeitig eine
  // Antwort und ein Heiltrank. Q bleibt der Trank, WASD bleibt das Gehen,
  // Leertaste bleibt der Schlag — ein offenes Panel nimmt in diesem Spiel
  // den Kampf nicht weg (s. U1).
  if(gespraechTaste(e)) return;
  const k = e.key.toLowerCase();
  if(k === 'w') keysDown.w = true; if(k === 'a') keysDown.a = true;
  if(k === 's') keysDown.s = true; if(k === 'd') keysDown.d = true;
  if(e.code === 'Space'){ e.preventDefault(); if(state==='play') tryAttack(aimAngle()); }
  // Vollständige Belegung, damit sie nicht wieder nur in einer Plandatei steht
  // (ZUSAGEN-BILANZ-2026-08-04.md, Fund 14): w a s d Bewegung, Space Angriff,
  // q und 1 Trank, e Zauber, r Ultimate, i Inventar, t Zauberbaum, m Musik,
  // k Kessel, l Vollbildkarte, c Charakter (U8), o Optionen (U8-Nachtrag 3),
  // z Kartenmappe (K1, seit U8 das zweite Blatt des Charakterfensters),
  // f Kontextaktion, Esc schließt Panels der Reihe nach.
  // '1' ist die Zweitbelegung für den Trank. Sie ist bewusst dokumentiert: die
  // Ziffernreihe ist genau der Bereich, in den eine spätere Schnellwahl greifen
  // würde, und dann kollidiert sie stumm. 'l' (Landkarte) statt 'm': m ist schon
  // die Musik-Taste, W-Groß durfte sie nicht verdrängen.
  if(k === 'q' || k === '1') drinkPotion();
  if(k === 'e') castActiveSpell();
  if(k === 'r') castUltimate();
  if(k === 'i') toggleInventory(); if(k === 't') toggleSpellTree(); if(k === 'm') toggleMusic();
  if(k === 'c') toggleCharakter();   // U8
  if(k === 'o') toggleOptionen();    // U8-Nachtrag 3
  if(k === 'z') toggleZulagen();     // K1, seit U8 der kurze Weg auf die Mappe
  if(k === 'k') toggleKessel();
  if(k === 'l') toggleFullmap();
  if(k === 'f') fuehreAktion();
  if(k === 'escape'){                          // Panels schließen ohne Tastenraten
    if(gespraechOffen) gespraechSchliessen();   // U3: liegt oben, geht zuerst
    else if(invOpen) toggleInventory();
    else if(spellTreeOpen) toggleSpellTree();
    else if(charakterOpen) toggleCharakter();
    else if(kesselOpen) toggleKessel();
    else if(optionenOpen) toggleOptionen();
    else if(ausweisOpen) toggleAusweis();
    else if(fullmapOpen) toggleFullmap();
    else if(schlossOpen) schlossZu();
    else if(amtFensterOpen) amtFensterSchliessen();
    else if(kammer) knAbbruchKammer();          // Abbruch der Kammer, ohne Beute, ohne Softlock
  }
});

window.addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  if(k === 'w') keysDown.w = false; if(k === 'a') keysDown.a = false;
  if(k === 's') keysDown.s = false; if(k === 'd') keysDown.d = false;
});

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  mouse.wx = mouse.x + cam.x; mouse.wy = mouse.y + cam.y;
  mouse.moved = true;
});

canvas.addEventListener('mousedown', e => {
  initAudio(); if(state !== 'play' || e.button !== 0) return;
  tryAttack(aimAngle());
});

// --- TOUCH-STEUERUNG (mobil) ---
document.addEventListener('touchstart', () => { initAudio(); enterTouchMode(); }, {passive:true}); // Audio-Unlock

function updateJoyVec(){
  const dx = joy.curX - joy.baseX, dy = joy.curY - joy.baseY, len = Math.hypot(dx, dy);
  if(len < joy.DEAD){ touchMove.x = 0; touchMove.y = 0; return; }
  const m = Math.min(1, len / joy.R);
  touchMove.x = (dx/len)*m; touchMove.y = (dy/len)*m;
}

function setAimFromScreen(sx, sy){                 // spiegelt den mousemove-Handler
  mouse.x = sx; mouse.y = sy;
  mouse.wx = sx + cam.x; mouse.wy = sy + cam.y;
  mouse.moved = true;
}

function touchAttack(sx, sy){
  setAimFromScreen(sx, sy);
  let tx = mouse.wx, ty = mouse.wy;
  // Auto-Aim: Tap nahe Monster (<=90px) snappt aufs Monster
  let best = null, bd = 90;
  for(const m of monsters){ if(m.dead) continue; const d = dist(tx, ty, m.x, m.y); if(d < bd){ bd = d; best = m; } }
  if(!best) best = pickTarget(targetPriority, 200);   // kein Snap-Kandidat am Tap-Punkt -> Priority-Ziel um den Spieler
  if(best){ tx = best.x; ty = best.y; }
  tryAttack(Math.atan2(ty - player.y, tx - player.x));
}

canvas.addEventListener('touchstart', e => {
  e.preventDefault();                              // blockt Scroll/Zoom UND emulierten mousedown (kein Doppel-Angriff)
  initAudio(); touchMode = true;
  if(state !== 'play') return;
  const rect = canvas.getBoundingClientRect();
  for(const t of e.changedTouches){
    const sx = t.clientX - rect.left, sy = t.clientY - rect.top;
    if(joy.id === null && sx < canvas.width/2){    // linke Hälfte beansprucht Joystick
      joy.id = t.identifier;
      joy.baseX = joy.curX = sx; joy.baseY = joy.curY = sy;
      touchMove.active = true; updateJoyVec();
    } else if(attackTouch === null){               // jeder weitere Finger greift an
      attackTouch = {id:t.identifier, sx, sy};
      touchAttack(sx, sy);
    }
  }
}, {passive:false});

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  for(const t of e.changedTouches){
    const sx = t.clientX - rect.left, sy = t.clientY - rect.top;
    if(t.identifier === joy.id){ joy.curX = sx; joy.curY = sy; updateJoyVec(); }
    else if(attackTouch && t.identifier === attackTouch.id){ attackTouch.sx = sx; attackTouch.sy = sy; setAimFromScreen(sx, sy); }
  }
}, {passive:false});

function endTouch(e){
  e.preventDefault();
  for(const t of e.changedTouches){
    if(t.identifier === joy.id){ joy.id = null; touchMove.active = false; touchMove.x = 0; touchMove.y = 0; }
    if(attackTouch && t.identifier === attackTouch.id) attackTouch = null;
  }
}
canvas.addEventListener('touchend', endTouch, {passive:false});
canvas.addEventListener('touchcancel', endTouch, {passive:false});
canvas.addEventListener('contextmenu', e => e.preventDefault());   // Long-Press-Menü nur auf Canvas unterdrücken

// ===== Touch: Spell-Drag-Aim (#spellBtn) =====
const spellBtnEl = document.getElementById('spellBtn');
const sDrag = {id:null, sx:0, sy:0, cx:0, cy:0, t0:0, maxD:0};
const TAP_PX = 12, TAP_MS = 250, CANCEL_R = 52, DRAG_MAX = 110;

spellBtnEl.addEventListener('touchstart', e => {
  enterTouchMode();
  const sp = SPELLS.find(s => s.id === activeSpellId);
  if(state !== 'play' || player.dead || !sp || !spellKnown(sp.id)) return;  // disabled/kein Spruch: kein preventDefault, nichts passiert
  e.preventDefault();                       // unterdrückt emulierten click -> onclick feuert auf Touch nie doppelt
  if(sDrag.id !== null) return;             // nur ein Finger zaubert
  const t = e.changedTouches[0], r = spellBtnEl.getBoundingClientRect();
  sDrag.id = t.identifier; sDrag.sx = t.clientX; sDrag.sy = t.clientY;
  sDrag.cx = r.left + r.width/2; sDrag.cy = r.top + r.height/2;
  sDrag.t0 = performance.now(); sDrag.maxD = 0;
  spellAim.active = true; spellAim.sp = sp; spellAim.cancel = false;
  applySpellAim(t.clientX, t.clientY);
  spellBtnEl.classList.add('aiming');
}, {passive:false});

function applySpellAim(cx, cy){
  const dx = cx - sDrag.sx, dy = cy - sDrag.sy, len = Math.hypot(dx, dy);
  sDrag.maxD = Math.max(sDrag.maxD, len);
  const sp = spellAim.sp, reach = spellReach(sp);
  if(len < 8){ spellAim.nx = Math.cos(player.dir); spellAim.ny = Math.sin(player.dir); spellAim.d = reach*0.5; }
  else {
    spellAim.nx = dx/len; spellAim.ny = dy/len;
    spellAim.d  = (sp.type === 'aoe_target') ? Math.min(1, len/DRAG_MAX) * reach : reach;
  }
  // Cancel-Zone = zurück über den Button, aber erst nachdem wirklich gezogen wurde
  spellAim.cancel = sDrag.maxD > 30 && Math.hypot(cx - sDrag.cx, cy - sDrag.cy) < CANCEL_R;
  spellBtnEl.classList.toggle('cancelHot', spellAim.cancel);
}

// Bewegung/Ende hängen bewusst am window, nicht am Button: wird das Touch-Target
// mitten in der Geste aus dem DOM genommen, bubbeln die Folge-Events nicht mehr zum
// Button — der Drag bliebe für immer offen (Fadenkreuz klebt, Zaubern tot).
window.addEventListener('touchmove', e => {
  if(sDrag.id === null) return;
  for(const t of e.changedTouches) if(t.identifier === sDrag.id){ e.preventDefault(); applySpellAim(t.clientX, t.clientY); }
}, {passive:false});

function resetSpellDrag(){
  sDrag.id = null; spellAim.active = false; spellAim.sp = null; spellAim.cancel = false;
  spellBtnEl.classList.remove('aiming','cancelHot');
}

function spellDragEnd(e){
  if(sDrag.id === null) return;
  let ended = null;
  for(const t of e.changedTouches) if(t.identifier === sDrag.id) ended = t;
  if(!ended) return;
  e.preventDefault();
  const sp = spellAim.sp;
  const isTap = sDrag.maxD < TAP_PX && (performance.now() - sDrag.t0) < TAP_MS;
  let cast = null;
  if(e.type !== 'touchcancel' && sp){
    if(isTap){                                       // Quick-Cast: Priority-Autoaim statt Zielpunkt vom Vorframe
      const tgt = pickTarget(targetPriority, 300);
      if(tgt) cast = {wx:tgt.x, wy:tgt.y};
      else { const rc = Math.min(200, spellReach(sp));
             cast = {wx: player.x + Math.cos(player.dir)*rc, wy: player.y + Math.sin(player.dir)*rc}; }
    } else if(!spellAim.cancel){                     // Drag-Release = Cast auf Zielpunkt
      const w = spellAimWorld(); cast = {wx:w.x, wy:w.y};
    }                                                // Cancel: cast bleibt null -> kein Mana, kein CD
  }
  resetSpellDrag();                                  // ZUERST aufräumen: wirft castSpell, bleibt der Drag sonst offen
  if(cast) castSpell(sp, cast);
}
window.addEventListener('touchend', spellDragEnd, {passive:false});
window.addEventListener('touchcancel', spellDragEnd, {passive:false});

// ===== Touch: Attack-Button (Tap/Hold = Angriff, Drag = Target-Lock) =====
const attackBtnEl = document.getElementById('attackBtn');
const aDrag = {id:null, sx:0, sy:0, maxD:0};

function attackBtnFire(){
  const tgt = validateLock() || pickTarget(targetPriority, 200);  // Lock schlägt Priority
  tryAttack(tgt ? Math.atan2(tgt.y - player.y, tgt.x - player.x) : player.dir);
}

attackBtnEl.addEventListener('touchstart', e => {
  enterTouchMode();
  if(state !== 'play' || player.dead) return;
  e.preventDefault();
  if(aDrag.id !== null) return;
  const t = e.changedTouches[0];
  aDrag.id = t.identifier; aDrag.sx = t.clientX; aDrag.sy = t.clientY; aDrag.maxD = 0;
  atkBtnHeld = true;
  attackBtnFire();                                   // erster Schlag sofort (tryAttack ist CD-gated)
}, {passive:false});

window.addEventListener('touchmove', e => {
  if(aDrag.id === null) return;
  const rect = canvas.getBoundingClientRect();
  for(const t of e.changedTouches){
    if(t.identifier !== aDrag.id) continue;
    e.preventDefault();
    aDrag.maxD = Math.max(aDrag.maxD, Math.hypot(t.clientX - aDrag.sx, t.clientY - aDrag.sy));
    if(aDrag.maxD > TAP_PX){                         // Drag -> Fadenkreuz, Dauerfeuer pausiert
      atkBtnHeld = false;
      lockAim.active = true;
      lockAim.wx = (t.clientX - rect.left) + cam.x;  // Finger zeigt direkt in die Welt
      lockAim.wy = (t.clientY - rect.top) + cam.y;
    }
  }
}, {passive:false});

function attackDragEnd(e){
  if(aDrag.id === null) return;
  let ended = null;
  for(const t of e.changedTouches) if(t.identifier === aDrag.id) ended = t;
  if(!ended) return;
  e.preventDefault();
  if(lockAim.active && e.type !== 'touchcancel'){
    let best = null, bd = Infinity;
    for(const m of monsters){                        // Snap: nächstes lebendes Monster nahe Fadenkreuz
      if(m.dead) continue;
      const d = dist(lockAim.wx, lockAim.wy, m.x, m.y);
      if(d < m.r + 60 && d < bd){ bd = d; best = m; }
    }
    lockedTarget = best;                             // Release über leerem Boden = Lock lösen
  }
  aDrag.id = null; atkBtnHeld = false; lockAim.active = false;
}
window.addEventListener('touchend', attackDragEnd, {passive:false});
window.addEventListener('touchcancel', attackDragEnd, {passive:false});

// Watchdog: sollte trotz allem ein Finger "verloren" gehen (iOS-Gestenübernahme,
// Tab-Wechsel, entferntes Target), räumen wir auf, sobald die ID nicht mehr lebt.
const liveTouches = new Set();
function trackTouches(e){
  if(e.type === 'touchstart'){ for(const t of e.changedTouches) liveTouches.add(t.identifier); }
  else { for(const t of e.changedTouches) liveTouches.delete(t.identifier); }
}
for(const ev of ['touchstart','touchend','touchcancel'])
  window.addEventListener(ev, trackTouches, {passive:true, capture:true});

function touchWatchdog(){
  if(sDrag.id !== null && !liveTouches.has(sDrag.id)) resetSpellDrag();
  if(aDrag.id !== null && !liveTouches.has(aDrag.id)){ aDrag.id = null; atkBtnHeld = false; lockAim.active = false; }
  if(attackTouch && !liveTouches.has(attackTouch.id)) attackTouch = null;
  if(joy.id !== null && !liveTouches.has(joy.id)){ joy.id = null; touchMove.active = false; touchMove.x = 0; touchMove.y = 0; }
}
document.addEventListener('visibilitychange', () => { if(document.hidden){ liveTouches.clear(); touchWatchdog(); } });

// ===== Priority-Toggle =====
function refreshPrioBtn(){
  document.getElementById('prioTxt').innerText = targetPriority === 'closest' ? 'Nah' : 'Schwach';
  // U7: Auf dem Telefon traegt der Knopf keine Beschriftung (44 Pixel), also
  // traegt sie der Rand. Die Zeile darueber bleibt: auf dem Schirm steht das
  // Wort weiterhin daneben.
  document.getElementById('prioBtn').classList.toggle('schwach', targetPriority === 'lowhp');
}
document.getElementById('prioBtn').onclick = () => {   // simpler onclick reicht: kein Drag-Semantik, emulierter Click ok
  targetPriority = targetPriority === 'closest' ? 'lowhp' : 'closest';
  try{ localStorage.setItem('sda_targetPriority', targetPriority); }catch(_){}
  refreshPrioBtn();
};
refreshPrioBtn();

let lastT = performance.now();
function loop(now){
  const dt = Math.min(0.1, (now - lastT) / 1000);
  lastT = now; touchWatchdog(); update(dt); render(); requestAnimationFrame(loop);
}

// Ladebildschirm, bis alle Sprite-Sheets da sind — erst dann Boden backen und starten.
function showLoading(){
  document.getElementById('ovPanel').innerHTML = `
    <h1>Das Monstralministerium</h1>
    <h3>Lade Grafiken…</h3>
    <p id="loadTxt" style="font-size:calc(13px * var(--fs));color:#9a8a5f;">0 / ${SHEET_LIST.length}</p>`;
  document.getElementById('overlay').style.display = 'flex'; MUS.muffle(true);
}
showLoading();
const loadTick = setInterval(() => {
  const el = document.getElementById('loadTxt');
  if(el) el.innerText = `${assetsLoaded} / ${SHEET_LIST.length}`;
}, 60);

// G3: alle Monster-Tints einmal vorwärmen, statt sie beim ersten Treffer im
// Kampf zu backen (tintedSheet() ist zeilenweise, aber ein Bake mitten im Frame
// wäre trotzdem ein Regressionsregel-10-Verstoß). Läuft über ALLE MONDEF-Typen,
// nicht nur das aktuelle Level-Roster — die Liste ist klein und fix, und so bäckt
// auch nichts nach, wenn Schattenland oder eine Kammer später einen anderen Typ
// zum ersten Mal zeigt.
function prewarmMonsterTints(){
  for(const type in MONDEF){
    const d = MONDEF[type];
    for(const anim in RIG_ANIM[d.rig || 'goblin']){
      const key = RIG_ANIM[d.rig || 'goblin'][anim];
      if(d.tint) tintedSheet(key, d.tint, d.tintA == null ? 0.55 : d.tintA);
      tintedSheet(key, '#ffffff', 0.72); // Trefferblitz, s. drawMon/drawCorpse
    }
  }
}

// Boot-Assertion: jeder RIG_ANIM-Key muss in SHEETS existieren (sonst unsichtbare
// Leichen/Mobs, s. G3-Notizen), und jedes Sheet in SHEETS muss genug Zeilen für
// seine n Frames haben (sonst liest drawSpriteAt über das Blatt hinaus). Nur
// console.warn, kein throw.
// Zusagen-Bilanz 2026-08-04 (C3): die zweite Prüfung lief vorher nur über
// RIG_ANIM und feuerte schon bei n>cols. Das war ein Fehlalarm bei jedem
// mehrzeiligen Sheet (dun1_plate, dun2_plate, cfcloud — alle drei n>cols per
// Design, drawSpriteAt() bricht über cols korrekt in die nächste Zeile um).
// Jetzt läuft sie über ganz SHEETS und prüft echten Überlauf: die letzte
// gebrauchte Zeile (rowStart + Zeilen für n Frames) gegen die im Bild
// tatsächlich vorhandenen Zeilen.
function assertRigRegistrations(){
  for(const rig in RIG_ANIM){
    for(const anim in RIG_ANIM[rig]){
      const key = RIG_ANIM[rig][anim];
      if(!SHEETS[key]) console.warn(`RIG_ANIM['${rig}']['${anim}'] = '${key}' fehlt in SHEETS`);
    }
  }
  for(const key in SHEETS){
    const s = SHEETS[key];
    const rowsInSheet = Math.floor(s.img.height / s.fh);
    const lastRowUsed = (s.rowStart||0) + Math.floor((s.n - 1) / s.cols);
    if(lastRowUsed >= rowsInSheet) console.warn(`SHEETS['${key}']: n=${s.n} Frames zu ${s.cols} je Zeile ab rowStart=${s.rowStart||0} lesen Zeile ${lastRowUsed}, Blatt hat nur ${rowsInSheet}`);
  }
}

// Ankerprüfung für alles, was auf zwei Beinen auf dem Boden steht: Held, die drei
// Komposit-Figuren und die acht CF_NPCS-Blätter. Der Anker ay ist die Fußlinie — die
// unterste undurchsichtige Pixelzeile des Frames muss dort liegen, sonst hängt die
// Figur über ihrem Schatten oder steckt im Boden. Genau das war acht Blätter lang
// falsch (ay:60 statt 40) und fiel keinem Guard auf, weil bis hierher nur Zeilenzahl
// und Registrierung geprüft wurden, nie Bildinhalt.
//
// Läuft einmal nach dem Laden, liest 17 Frames à 64x64. getImageData kann bei einem
// fremdorigin geladenen Blatt werfen (getönte Canvas-Kopien sind unkritisch, die
// entstehen hier lokal) — deshalb in try/catch: ein Wurf auf Skriptebene würde den
// gesamten Rest des Inline-Skripts mitreißen.
function npcAnkerAssert(){
  const keys = ['hero_baked'];
  for(const f of DORF_FIGUREN) keys.push(npcBlaetter(f).idle);   // G6: dieselbe Blattwahl wie im Spiel
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const x = c.getContext('2d', {willReadFrequently:true});
  for(const key of [...new Set(keys)]){
    const s = SHEETS[key];
    if(!s || !s.img){ console.warn(`npcAnkerAssert: SHEETS['${key}'] fehlt`); continue; }
    let botY = -1;
    try {
      x.clearRect(0, 0, 64, 64);
      x.drawImage(s.img, 0, (s.rowStart||0)*s.fh, s.fw, s.fh, 0, 0, s.fw, s.fh);
      const d = x.getImageData(0, 0, s.fw, s.fh).data;
      for(let py = s.fh - 1; py >= 0 && botY < 0; py--)
        for(let px = 0; px < s.fw; px++) if(d[(py*s.fw+px)*4+3] > 8){ botY = py; break; }
    } catch(e){ console.warn(`npcAnkerAssert: ${key} nicht lesbar (${e.name}) — Ankerprüfung übersprungen`); continue; }
    if(botY < 0){ console.warn(`npcAnkerAssert: ${key} Frame 0 ist leer`); continue; }
    if(Math.abs(botY - s.ay) > 2) console.warn(`npcAnkerAssert: ${key} Fußlinie bei y=${botY}, Anker ay=${s.ay} — Figur ${botY < s.ay ? 'schwebt' : 'steckt im Boden'} um ${Math.abs(botY - s.ay)} Pixel`);
  }
}

// ===========================================================================
//  G6: Steht die Belegschaft im Bild? Zwei Arten, unsichtbar zu sein, und beide
//  waren im Dorf zu besichtigen, ohne dass ein Guard etwas gesagt hätte.
//
//  (1) Kein Blatt. Fünf der acht CF_NPCS-Dateien liegen nicht im Grafikpaket,
//      drawSprite() kehrt bei einem fehlenden Key still um. npcBlaetter() gibt
//      diesen Figuren jetzt ein Held-Komposit; hier wird nachgesehen, dass am
//      Ende wirklich jede Figur ein Blatt hat, ganz gleich welchen Weg sie ging.
//
//  (2) Hinter der Fassade. Die Gebäude sind 'big'-Decos mit Fußanker an der
//      Südkante ihres Footprints, gezeichnet wird nach y sortiert. Eine Figur,
//      die NÖRDLICH dieser Ankerlinie steht, wird also vor dem Haus gezeichnet
//      und vom Haus zugedeckt, obwohl sie auf einer freien Kachel steht. Beim
//      Bürgermeister deckte das Amt hundert Prozent.
//
//  Gemessen wird an der undurchsichtigen Fläche (CF_BLD.deck und die Alphabox
//  der Figur), nicht am Frame-Rechteck: die Blätter haben breite leere Ränder,
//  und mit dem vollen Rechteck meldete der Guard Verdeckungen, die auf dem
//  Schirm keine sind. Bei wandernden Figuren zählt nicht nur der Heimatanker,
//  sondern die ganze Wanderleine: der Rundgang wird in sechzehn Richtungen
//  abgetastet. Wirft nie, meldet nur.
// ===========================================================================
const DORF_SICHT_RUHE = 0.15;    // am Heimatanker praktisch frei stehen
const DORF_SICHT_LEINE = 0.40;   // unterwegs darf eine Ecke hinter der Fassade verschwinden
function dorfSichtAssert(){
  let ok = true;
  const warnen = (m, ...r) => { ok = false; console.warn('G6 Dorfsicht:', m, ...r); };

  // Die undurchsichtige Fläche der Figur, relativ zum Fußanker. Aus dem Blatt
  // gemessen statt angenommen, dieselbe Methode wie npcAnkerAssert (dessen
  // Ergebnis hier nicht wiederverwendet wird: der misst nur die Fußlinie).
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const cx = c.getContext('2d', {willReadFrequently:true});
  function figurBox(key){
    const s = SHEETS[key]; if(!s || !s.img) return null;
    try {
      cx.clearRect(0, 0, 64, 64);
      cx.drawImage(s.img, 0, (s.rowStart||0)*s.fh, s.fw, s.fh, 0, 0, s.fw, s.fh);
      const d = cx.getImageData(0, 0, s.fw, s.fh).data;
      let l = s.fw, r = -1, o = s.fh, u = -1;
      for(let py = 0; py < s.fh; py++) for(let px = 0; px < s.fw; px++)
        if(d[(py*s.fw+px)*4+3] > 8){
          if(px < l) l = px; if(px > r) r = px;
          if(py < o) o = py; if(py > u) u = py;
        }
      if(r < 0) return null;
      return {l:(l - s.ax)*NPC_SC, r:(r + 1 - s.ax)*NPC_SC, o:(o - s.ay)*NPC_SC, u:(u + 1 - s.ay)*NPC_SC};
    } catch(e){ return null; }   // fremdorigin geladenes Blatt, s. npcAnkerAssert
  }

  const haeuser = VILLAGE_BUILDINGS.map(bldDeckung);
  const anteil = (box, x, y) => {
    const l = x + box.l, r = x + box.r, o = y + box.o, u = y + box.u;
    const flaeche = Math.max(1, (r - l) * (u - o));
    let max = 0, wer = null;
    for(const h of haeuser){
      if(h.anker <= y) continue;                       // sortiert vor der Figur, deckt nichts zu
      const bx = Math.min(r, h.r) - Math.max(l, h.l);
      const by = Math.min(u, h.u) - Math.max(o, h.o);
      if(bx <= 0 || by <= 0) continue;
      const q = bx * by / flaeche;
      if(q > max){ max = q; wer = h; }
    }
    return {q: max, wer};
  };

  for(const n of npcs){
    const box = figurBox(n.sheetIdle);
    if(!box){ warnen(`${n.key} hat kein lesbares Blatt (${n.sheetIdle}) und steht unsichtbar im Dorf`); continue; }
    const ruhe = anteil(box, n.homeX, n.homeY);
    if(ruhe.q > DORF_SICHT_RUHE)
      warnen(`${n.key} steht am Heimatanker zu ${Math.round(ruhe.q*100)}% hinter einer Fassade`);
    if(n.fest) continue;                               // ohne Wanderleine ist der Anker die ganze Wahrheit
    let max = ruhe.q;
    for(let i = 0; i < 16; i++){
      const a = i * Math.PI / 8;
      const q = anteil(box, n.homeX + Math.cos(a)*NPC_HOME_R, n.homeY + Math.sin(a)*NPC_HOME_R).q;
      if(q > max) max = q;
    }
    if(max > DORF_SICHT_LEINE)
      warnen(`${n.key} verschwindet auf seiner Wanderleine zu ${Math.round(max*100)}% hinter einer Fassade`);
  }

  if(ok) console.log(`G6 Dorfsicht: ${npcs.length} Dorffiguren haben ein Blatt und stehen im Bild.`);
}

// U5-Guard. Läuft nach loadAssets(), weil es vorher keine Bilddatei gibt —
// gespraechAssert() steht auf Skriptebene und kann nur die Namen prüfen.
//
// Geprüft wird, was zwischen Bilderlauf und Build verrutschen kann:
//
//   1. Jedes angemeldete Porträt ist wirklich geladen. Fehlt eines, zeichnet
//      die Tafel stillschweigend den Sprite-Ausschnitt — kein Absturz, aber
//      auch keine Meldung, und niemand merkt, dass ein Bild fehlt.
//   2. Es ist quadratisch. Das Feld ist seit U5 ein Quadrat; ein Bild mit
//      anderem Verhältnis würde verzerrt statt beschnitten.
//   3. Es ist die 128er-Fassung und nicht die 1024er aus assets/figuren/.
//      Die sähe identisch aus und wöge das Zwanzigfache — genau der Fehler,
//      den man im Bild nicht sieht und erst im fertigen Build bemerkt.
const PORTRAET_PX = 128;
function portraetAssert(){
  let ok = true, da = 0;
  const warnen = (m, ...r) => { ok = false; console.warn('U5 Porträts:', m, ...r); };
  for(const k of PORTRAET_FIGUREN){
    const s = SHEETS[portraetBlatt(k)];
    if(!s || !s.img){ warnen(`${k} hat kein Bild geladen, die Tafel nimmt den Sprite-Ausschnitt`); continue; }
    da++;
    if(s.fw !== s.fh) warnen(`${k} ist nicht quadratisch (${s.fw}x${s.fh}) und wird im Feld verzerrt`);
    else if(s.fw !== PORTRAET_PX) warnen(`${k} ist ${s.fw}px statt ${PORTRAET_PX}px — die Ansichtsfassung aus assets/figuren/?`);
  }
  if(ok) console.log(`U5 Porträts: ${da} gemalte Bilder geladen, quadratisch und im 128er-Raster.`);
}

// U6: Das Portraet in den Dienstzettel. Einmal nach dem Laden gezeichnet und
// danach nie wieder: der Zettel wechselt seinen Text, nicht seinen Absender.
// Ein Canvas und kein <img src>, aus demselben Grund wie ueberall sonst in
// diesem Projekt — SHEETS[].img traegt im Quellbaum einen Pfad und im
// Einzeldatei-Build eine data:-URI, und wer hier ein CSS-url() oder ein festes
// src schriebe, haette eine zweite Ladestelle, die der Build nicht kennt.
//
// Kehrt still um, wenn das Bild fehlt (addSheet fuehrt es als optional). Dann
// bleibt die Klasse 'mitBild' aus und im Kopf steht das Sinnbild wie bisher.
function knZettelPortrait(){
  const c = el('knZettelBild'), s = SHEETS[portraetBlatt('knoeterich')];
  if(!c || !s || !s.img) return;
  const cc = c.getContext('2d');
  cc.imageSmoothingEnabled = false;
  cc.clearRect(0, 0, c.width, c.height);
  cc.drawImage(s.img, 0, 0, c.width, c.height);
  el('knZettel').classList.add('mitBild');
}

// G5: UI-Skin. SHEETS[key].img.src ist bereits die richtige URL für den jeweiligen
// Kontext (Dev-Server: relativer Pfad, dist/index.html-Build: data:-URI aus
// ASSET_BLOBS) — kein CSS-url() auf eine Datei nötig, das würde der Build nicht
// erfassen (s. Kommentar bei den addSheet-Aufrufen oben). border-image nutzt die
// bestehende border-width jedes Elements fürs Layout (border-image-width betrifft
// nur die Bildskalierung, keine Kastenmaße — die kalibrierten Mobile-Breakpoints
// aus den Media Queries bleiben unangetastet). Touch-Contract unberührt: es werden
// ausschließlich background-image/border-image-* gesetzt, keine pointer-events/
// touch-action/IDs/DOM-Struktur angefasst.
function bakeUiSkin(){
  // U2: Ein fehlendes Blatt war hier bisher ein TypeError mitten in der Ladekette
  // — und damit ein schwarzer Bildschirm statt eines Spiels ohne Skin. Seit U2
  // haengen vier weitere Zellen daran, also wird gefragt statt zugegriffen.
  const url = key => (SHEETS[key] ? SHEETS[key].img.src : null);
  const frameUrl = url('cfui_frame');
  const roundUrl = url('cfui_round');
  if(!frameUrl || !roundUrl){
    console.warn('UI-Skin: frame_brown/round_brown fehlen, das Menue bleibt bei den CSS-Ersatzwerten.');
    return;
  }

  // Die vier U2-Zellen als CSS-Variablen. Gesetzt wird nur, was wirklich geladen
  // ist; jede Regel im <style> nennt ihren Ersatzwert selbst (var(--x, ...)).
  // Der Weg ueber SHEETS[].img.src statt ueber ein CSS-url() ist derselbe wie in
  // G5 und aus demselben Grund: im Einzeldatei-Build steht dort die data:-URI,
  // die build-single.mjs eingebacken hat, im Quellbaum der relative Pfad.
  const zellen = [
    ['--cfui-slot', 'cfui_slot'],   // Feldrahmen: Beutel, Ausruestung, Zutaten, Symbolschloss
    ['--cfui-x',    'cfui_x'],      // Schliessknopf mit eingepraegtem X
    ['--cfui-pill', 'cfui_pill'],   // breite Knoepfe
    ['--cfui-sel',  'cfui_sel'],    // gestrichelter Auswahlrahmen
  ];
  for(const [vari, key] of zellen){
    const u = url(key);
    if(u) document.documentElement.style.setProperty(vari, `url("${u}")`);
  }
  // Das X steckt seit U2 in der Grafik. Solange sie da ist, muss das ✖-Zeichen
  // im HTML verschwinden, sonst stehen zwei Kreuze uebereinander. Als Klasse und
  // nicht als feste CSS-Regel, damit ohne die Datei das Zeichen bleibt — ein
  // leerer runder Knopf waere schlechter als ein Knopf ohne Grafik.
  document.body.classList.toggle('cfuiX', !!url('cfui_x'));
  // Touch-Rundknöpfe bekommen das Rundsprite über die body.touch-Regeln im <style>:
  // beim Backen (einmalig, nach dem Laden) ist body.touch noch gar nicht gesetzt
  // (enterTouchMode() kommt erst beim ersten Touch), deshalb nur die Variable (F18).
  document.documentElement.style.setProperty('--cfui-round', `url("${roundUrl}")`);
  // U10: dieselbe Bauart wie body.cfuiX eine Zeile weiter oben, und aus demselben
  // Grund. Der U10-Abschnitt im <style> nimmt den Rundknöpfen Rand, Rundung und
  // Grund und überlässt die Form dem Alphakanal des Achtecks — das darf nur
  // gelten, wenn das Achteck auch wirklich da ist. Ohne Zelle bleibt der Kreis
  // aus U7 stehen.
  document.body.classList.add('cfuiRund');

  // U11: die acht Sinnbilder. Anders als bei den Zellen oben ist hier ALLES
  // oder NICHTS die richtige Bauart: acht Knoepfe, von denen die Haelfte ein
  // gezeichnetes Bild traegt und die andere ein Emoji, saehen schlechter aus
  // als acht Emoji. Deshalb eine Klasse fuer den ganzen Satz, gesetzt nur wenn
  // jede der acht Zellen wirklich da ist — und die Variablen werden gar nicht
  // erst geschrieben, wenn eine fehlt.
  const ICONS = ['schlag', 'trank', 'zauber', 'rucksack', 'charakter', 'ziel', 'sperre', 'abbruch', 'hand',
                 'gold', 'zahnrad', 'ton', 'ton_aus', 'schrift', 'speicher', 'kladde', 'akten', 'ruestung', 'schluessel', 'brief', 'kraft', 'herz', 'blitz', 'amtskunde', 'werte', 'dienst', 'zettel', 'kessel'];
  const iconUrls = ICONS.map(n => [n, url(`ico_${n}`)]);
  const vollstaendig = iconUrls.every(([, u]) => !!u);
  if(vollstaendig){
    for(const [n, u] of iconUrls){
      document.documentElement.style.setProperty(`--ico-${n}`, `url("${u}")`);
    }
  } else {
    const fehlend = iconUrls.filter(([, u]) => !u).map(([n]) => n);
    console.warn(`UI-Sinnbilder: ${fehlend.join(', ')} fehlen, die Knoepfe bleiben bei den Emoji.`);
  }
  document.body.classList.toggle('cfuiIco', vollstaendig);

  // Panels: nur der Rahmen wird zu Pixelkunst, die dunkle Füllung (rgba(20,14,24,…))
  // bleibt Kontrastgrund für den hellen Text — deshalb kein 'fill' im Slice-Wert.
  for(const sel of ['#inv', '#charakter', '#spellTree', '#kessel', '#optionen', '#schloss', '#amtFenster', '#ovPanel', '#ausweis', '#fullmap', '#gespraech']){
    const el = document.querySelector(sel); if(!el) continue;
    el.style.borderImageSource = `url("${frameUrl}")`;
    el.style.borderImageSlice = '2 2 5 2';
    el.style.borderImageWidth = '6px';
    el.style.borderImageRepeat = 'stretch';
  }
  // Gürtel/Knöpfe: gleiche Rahmengrafik, dünner aufgetragen (kleinere Elemente).
  document.querySelectorAll('.beltSlot').forEach(el => {
    el.style.borderImageSource = `url("${frameUrl}")`;
    el.style.borderImageSlice = '2 2 5 2';
    el.style.borderImageWidth = '4px';
    el.style.borderImageRepeat = 'stretch';
  });
  // Runde Elemente (Orbs/Röhren, Touch-Rundknöpfe): passendes rundes Button-Sprite
  // als Hintergrund. #hpFill/#manaFill liegen als Kind-Divs darüber und bleiben
  // unverändert — das Rundknopf-Sprite scheint nur im ungefüllten Teil durch,
  // was optisch wie ein leeres Glas/Sockel wirkt (kein neuer Schreibpfad pro Frame,
  // updateHUD() ändert weiterhin nur height/background-size der Kinder).
  // U10: .tBtn und #attackBtn stehen hier nicht mehr. Sie zeichnen ihr Achteck
  // seither in einem ::before, dessen Kante ein Vielfaches von 14 ist (Begründung
  // im U10-Abschnitt des <style>), und eine zusätzlich INLINE auf den Kasten
  // gebackene, auf 82 gedehnte Fassung läge unverrückbar darunter: Inline schlägt
  // jede Regel im Stylesheet, background-image:none könnte sie nicht abräumen.
  // Das Lichtbild bleibt, sein Kreis ist eine Bildmaske und keine Knopfform.
  document.querySelectorAll('#portraitRing').forEach(el => {
    el.style.backgroundImage = `url("${roundUrl}")`;
    el.style.backgroundSize = '100% 100%';
  });
}

loadAssets().then(() => {
  clearInterval(loadTick);
  assetsReady = true;
  bakeHeroSheet();
  assertRigRegistrations();
  // GW26c: zweiter Lauf weiter unten, nach bakeAllNpcSheets(). Der Guard hier
  // sieht die drei gebackenen NPC-Sheets noch nicht — sie entstehen erst
  // danach in dieser Kette. Er ist idempotent und seiteneffektfrei.
  prewarmMonsterTints();
  bakeUiSkin();
  bakeAllNpcSheets();
  // G6: erst backen, dann den npcs die Blätter zuweisen. genMap() lief beim
  // Skriptstart und hat allen Wandernden ihren CF_NPCS-Key gegeben, auch denen,
  // deren Datei gar nicht im Paket liegt. Jetzt ist bekannt, was wirklich da ist.
  npcBlaetterNachziehen();
  schnittSaeubern();          // IN1-Nachlese: die zwei G1-Schnittfehler, vor jeder Messung
  assertRigRegistrations();   // GW26c: jetzt sind npc_baked_bramsche/_lott/_pahl da
  npcAnkerAssert();           // braucht dieselbe Reihenfolge: liest die drei Komposite mit
  dorfSichtAssert();          // G6: und danach, weil er die zugewiesenen Blätter misst
  portraetAssert();           // U5: erst hier, vorher gibt es die Bilddateien nicht
  garderobeAssert();          // G9-Nachtrag: misst die Blätter der Garderobe, nicht ihre Tabelle
  stollenAssert();            // M4: die zweite Ebene, ihr Roster und ihre Signatur
  stopfenAssert();            // SZ3: die Stelle im Steinfeld, Serie I und Vorblatts Ankunft
  knZettelPortrait();         // U6: und aus demselben Grund einen Schritt danach
  refreshFloor();
  // U9: Die Hausmitteilung steht VOR dem Startbild, nicht darin. Faellig ist sie
  // nur fuer ein Geraet, das ein Vorher hat und diesen Stand noch nicht gesehen
  // hat (s. neuerungenFaellig); ihr Knopf fuehrt auf showStartScreen().
  if(neuerungenFaellig()) showNeuerungen(); else showStartScreen();
  requestAnimationFrame(loop);
});
