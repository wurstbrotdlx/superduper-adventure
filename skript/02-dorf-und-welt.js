// skript/02-dorf-und-welt.js - Teil 2 von 7 des einen Spielskripts.
// Inhalt: Dorffiguren, Boeden und Kacheln, Chunk-Cache, Koppel und Steinbruch.
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
// ===========================================================================
//  G7: Steht das Dorf, oder steht es nur auf dem Papier? Vier Fragen, die man
//  ohne eine einzige Bilddatei beantworten kann, weil alle Maße aus CF_BLD und
//  VILLAGE_BUILDINGS kommen — deshalb läuft der Guard beim Skriptstart, nicht
//  erst nach loadAssets() wie dorfSichtAssert().
//
//  (1) Deckt der Fußabdruck die Fassade? w ist die Sprite-Breite in Kacheln, und
//      genau das war der Fehler vor G7: das Amt hatte w:8 bei einem Blatt, das
//      bei WELT_SC fünfzehn Kacheln bedeckt. Ein zu schmaler Fußabdruck heißt,
//      dass man durch die Hauswand läuft.
//  (2) Stehen zwei Häuser ineinander? Verglichen werden die Sprite-Rechtecke,
//      nicht die Fußabdrücke: zwei Dächer, die sich überschneiden, sind auch
//      dann falsch, wenn die Sockel Abstand halten.
//  (3) Liegt alles im Dorf-Rechteck? VILLAGE räumt den Boden frei und hält die
//      Streuung draußen. Was darüber hinausragt, bekommt Bäume in die Fassade.
//  (4) Berührt das Dorf das Lager? Beides räumt in genMap() denselben Boden
//      frei, in fester Reihenfolge — eine Überschneidung wäre eine stille
//      Palisade auf dem Dorfplatz.
//
//  Wirft nie, meldet nur (Bauform wie monsterAssert/knAssertCaps).
// ===========================================================================
function dorfMassstabAssert(){
  let ok = true;
  const warnen = (m, ...r) => { ok = false; console.warn('G7 Dorfmaßstab:', m, ...r); };
  const kacheln = px => px * WELT_SC / TS;

  const rechtecke = [];
  for(const b of VILLAGE_BUILDINGS){
    const g = CF_BLD[b.bld];
    const sollW = kacheln(g.fw), sollH = kacheln(g.fh);
    if(Math.abs(b.w - sollW) > 0.001)
      warnen(`${b.bld}: Fußabdruck ist ${b.w} Kacheln breit, das Blatt deckt ${sollW}`);
    if(b.h > sollH)
      warnen(`${b.bld}: Fußabdruck ist ${b.h} Kacheln hoch, das Blatt nur ${sollH}`);
    // Sprite-Rechteck: Fußanker ist die Mitte der Südkante, das Blatt steht darauf.
    const mitte = b.x0 + b.w/2, unten = b.y0 + b.h;
    const r = {bld:b.bld, x0: mitte - sollW/2, x1: mitte + sollW/2, y0: unten - sollH, y1: unten};
    for(const a of rechtecke)
      if(r.x0 < a.x1 && a.x0 < r.x1 && r.y0 < a.y1 && a.y0 < r.y1)
        warnen(`${a.bld} und ${r.bld} überschneiden sich als Sprite`);
    if(r.x0 < VILLAGE.x0 || r.x1 > VILLAGE.x1 + 1 || r.y0 < VILLAGE.y0 || r.y1 > VILLAGE.y1 + 1)
      warnen(`${b.bld} ragt aus dem Dorf-Rechteck heraus`,
             {x0:r.x0, x1:r.x1, y0:r.y0, y1:r.y1}, 'gegen', VILLAGE);
    rechtecke.push(r);
  }

  if(VILLAGE.x0 <= LAGER.x1 + 1 && LAGER.x0 - 1 <= VILLAGE.x1 &&
     VILLAGE.y0 <= LAGER.y1 + 1 && LAGER.y0 - 1 <= VILLAGE.y1)
    warnen('Dorf-Rechteck und Lager berühren sich', VILLAGE, LAGER);

  if(ok) console.log(`G7 Dorfmaßstab: ${VILLAGE_BUILDINGS.length} Gebäude decken ihren Fußabdruck, stehen frei und liegen im Dorf.`);
}
dorfMassstabAssert();

// ===========================================================================
//  DORF_FIGUREN (Bauabschnitt W3, seit W11 vierzehn Eintraege): ansprechbare
//  Ensemble-Mitglieder aus Kapitel 8 der Weltbibel. Elf davon stammen aus W3,
//  die drei letzten aus dem Reich (W11, siehe unten am Ende der Tabelle). Text unverändert aus figuren-dorf.md übernommen,
//  dreistufig gegen Sperrvermerk/Humor-Grundgesetz/Formregeln/Zeichendeckel
//  geprüft. Knöterich (bereits im Code) und der Kater Anlage 3 (kein Sprite,
//  siehe drawAnlage3()) sind nicht Teil dieser Tabelle. opt:'wander' nutzt ein
//  Sprite aus CF_NPCS und wandert wie die bisherige Dorf-Staffage; opt:'fest'
//  ist ein Held-Komposit (bakeNpcSheet()) und steht fest wie Knöterich.
//
//  U3, eine Ergänzung: kurz: ist der Name auf dem Schild über dem Kopf. Der
//  volle name: bleibt, was er war — der Eintrag im Personalverzeichnis, den
//  das Gesprächsfenster in seiner Kopfzeile führt. Ein Schild, auf dem
//  'Wirt Bruno Fass, Gasthaus "Zum Letzten Stempel"' stünde, wäre breiter als
//  das Haus dahinter. gespraechAssert() hält Deckel (24 Zeichen) und
//  Zusammengehörigkeit fest: das letzte Wort von kurz muss in name vorkommen.
//
//  G6, zwei Ergänzungen an derselben Tabelle:
//
//  gestalt:{} beschreibt jede Figur als Held-Komposit, also aus Frisur, Hemd,
//  Hose und Schuhen. Bei opt:'fest' ist das seit W3 ihr Aussehen (die Felder
//  hießen bis G6 hair/chest/legs und liegen jetzt nur eine Ebene tiefer). Bei
//  opt:'wander' ist es der Ersatz für den Fall, dass ihr CF_NPCS-Blatt nicht im
//  Grafikpaket liegt, siehe npcBlaetter(). Für fünf der acht ist das der
//  Regelfall und nicht die Ausnahme.
//
//  G8, drei Ergänzungen an derselben Tabelle:
//
//  gestalt:{} hat drei Felder dazubekommen: haarFarbe, hemdFarbe und das
//  selten gebrauchte hoseFarbe. Es sind freie Hexwerte, gemessen am gemalten
//  Porträt der Figur (`python3 tools/portraet-farben.py`), und bakeNpcSheet()
//  schickt die drei Ebenen damit durch farbBlatt(). Ohne die Felder bleibt eine
//  Ebene auf ihrer Paketfarbe; nichts hier ist Pflicht.
//
//  komposit:true heißt, dass diese Figur auch dann als Komposit gebacken wird,
//  wenn ihr CF_NPCS-Blatt im Paket liegt. Es steht bei allen acht Wandernden,
//  weil ein fertiges Paketblatt jemand anderen zeigt als das Porträt; die
//  Begründung je Figur steht in phase-g8-figurenfarben.md. Wer eine davon
//  zurückholen will, streicht dort ihr Flag.
//
//  Die Frisur ist seit G8 nach ihrer Form gewählt und nicht mehr nach der
//  Farbe, in der das Paket sie ausliefert. Fünf Zuordnungen sind dabei
//  gewandert (Knöterich, Bramsche, Pommer, Nieselbeck, Umlauf), und wo eine
//  gewandert ist, steht der Grund über der Zeile.
//
//  Fünf Heimatanker sind gewandert: Zwirn 14/34 -> 16/38, Zapf 16/46 -> 16/47,
//  Lisbeth 10/42 -> 8/40, Trepp 22/41 -> 22/40, Pommer 13/45 -> 13/47. Sie
//  standen auf begehbaren Kacheln, aber innerhalb der Deckfläche eines Gebäudes,
//  dessen Fußanker tiefer liegt als ihr eigener. Der Renderer sortiert nach y,
//  das Haus wurde also nach ihnen gezeichnet und deckte sie zu: Zwirn zu hundert
//  Prozent hinter dem Amt, Lisbeth zu 46 hinter dem Haus, die drei anderen erst,
//  sobald die Wanderleine sie unter eine Fassade zog. dorfSichtAssert() rechnet
//  das jetzt beim Laden nach, für jede Figur und die ganze Wanderleine.
//
//  W11: drei Figuren kommen dazu, und zwei von ihnen sind nicht von Anfang an
//  da. abAkt:N heißt, dass die Figur erst ab dem N-ten Akt im Dorf steht: davor
//  wird sie nicht gezeichnet, nicht angeboten und trägt kein Namensschild. Das
//  ist keine neue Mechanik, sondern dieselbe Regel, nach der serieFrei() die
//  Blattserien freigibt, und sie hat denselben Ausnahmefall: außerhalb des
//  Schichtmodus gibt es keine Akte, dort steht jeder von Anfang an da.
//
//  Folge für die Aktzeilen: eine Figur mit abAkt:3 hat für die Akte I und II
//  keinen Satz, weil sie in diesen Akten niemand ansprechen kann. Ihre beiden
//  ersten Aktzeilen sind deshalb der leere String, und knAssertCaps() prüft
//  genau das nach: leer unterhalb von abAkt, gefüllt ab abAkt. Ein versehentlich
//  leerer Satz weiter hinten in der Tabelle wäre sonst eine stumme Figur.
//
//  G7: alle elf Anker sind mitgewandert, weil die Fassaden doppelt so groß und
//  die Gebäudezeilen weiter auseinandergerückt sind. Die Regel dahinter ist die
//  aus G6, nur mit den neuen Zahlen: die Nordzeile hat ihren Fußanker auf y=34,
//  die Südzeile auf y=52, und die Wanderleine ist 40 Pixel (NPC_HOME_R) lang.
//  Wer unter einer Fassade steht, muss also entweder mit ty>=35 unter der
//  Nordzeile und mit ty<=42 über der Südzeile bleiben (der Anger), oder mit
//  ty>=53 südlich vor der Südzeile stehen — dort ist er wieder der Nähere zur
//  Kamera. Das ist die Aufteilung, die G5 schon hatte (Zapf, Pommer, Lott und
//  Pahl standen vor der Südzeile), nur an den neuen Fußlinien.
// ===========================================================================
const DORF_FIGUREN = [
  {key:'zwirn', name:'Bürgermeister Alfons Zwirn', kurz:'Bürgermeister Zwirn', tx:17, ty:37, opt:'wander', sheet:'bob', komposit:true,
   // schüttere sandige Haare über blanker Kopfhaut, ockerbraune Weste
   gestalt:{hair:'h1', haarFarbe:'#9f704b', hemd:'hof', hemdFarbe:'#765937', hose:'hof', schuh:'schuh'},
   // T1: Aus jeder Auskunft wird bei ihm eine kleine Festrede. Der Kreislauf
   // traegt sie in der Reihenfolge, in der eine Rede laeuft: Begruessung,
   // Rueckblick, Ausblick, Dank, und danach zweimal die Sache selbst. Er meint
   // jede Silbe, und deshalb hoert man ihm zu (Humor-Grundgesetz 12). Die beiden
   // Saetze aus seiner Sprachmarke in Kapitel 8 stehen woertlich drin.
   grund:[
     {z1:'Schön, dass Sie da sind! Wirklich schön.', z2:'Ihr Jahresgespräch führe ich.'},
     {z1:'Zum Rückblick: elf Jahre Dorffest.', z2:'Vordermühl hatte noch nie eins.'},
     {z1:'Zum Ausblick: wir werden das angehen.', z2:'Noch dieses Jahr, vielleicht.'},
     {z1:'Zum Dank: Konfetti ist längst bestellt.', z2:'Nur die Genehmigung fehlt noch.'},
     {z1:'Zuständig wäre die Amtsleitung.', z2:'Nur weiß ich nicht, wer sie ist.'},
     {z1:'Da bin ich dran. Seit elf Jahren dran.', z2:'Man darf nicht lockerlassen.'},
   ],
   akt:[
     'Elf Jahre Vorfreude, noch mehr Händedruck.',
     'Wer zuständig ist? Klären wir noch.',
     'Der Schreibtisch ist leer. Ich weiß warum.',
     'Ich habe gestanden. Das Fest steht noch aus.',
     'Wir werden das Fest feiern. Irgendwann.',
   ],
   // W11: Die Bewilligung des Dorffestes ist im Jahr 1004 erteilt worden und
   // steckt seither in der Röhre unter dem Steinfeld. Zwirn hat seit acht Jahren
   // recht und erfährt es hier nicht. Er sagt nur, was er getan hat.
   zusatz:[{abAkt:2, zeilen:[
     {z1:'Ich habe damals eine Anfrage geschickt.', z2:'Nach Oben. Vor acht Jahren.'},
     {z1:'Vielleicht ist die Antwort unterwegs.',   z2:'Post braucht eben ihre Zeit.'},
   ]},
   // SZ3: Die Bewilligung ist mit dem Postregen gekommen. Er hat seit acht
   // Jahren recht gehabt, und die Bewilligung ist an die Amtsleitung gerichtet,
   // und die Amtsleitung ist N. N. Ein Schriftstueck, das niemanden erreicht,
   // ist nicht zugegangen. Er beschwert sich nicht. Er hebt sie auf.
   {lang:'stopfen', zeilen:[
     {z1:'Sie ist da. Die Bewilligung.',        z2:'Aus dem Jahr tausendundvier.'},
     {z1:'Sie ist nur an niemanden.',           z2:'Zur Kenntnis: die Amtsleitung.'},
     {z1:'Ich hebe sie auf.',                   z2:'Ordentlich. Wie sich das gehört.'},
   ]},
   {abSchicht:6, zeilen:[
     {z1:'Sie sind noch da. Das ist ungewöhnlich.', z2:'Die meisten bleiben einen Tag.'},
     {z1:'Ich merke mir Gesichter. Ihres jetzt auch.', z2:'Bei mir ist das ein Verfahren.'},
   ]},
   {abStufe:6, zeilen:[
     {z1:'Sie treten fester auf als am Montag.', z2:'Das sage ich als Bürgermeister.'},
     {z1:'Sie könnten ein Fest eröffnen.', z2:'Wenn eines stattfände.'},
   ]},
   {skill:'int', ab:4, zeilen:[
     {z1:'Sie lesen Anträge. Man sieht das.', z2:'Woran? Am Blick.'},
     {z1:'Verstehen Sie etwas von Genehmigungen?', z2:'Ich frage rein dienstlich.'},
   ]},
   {abRang:3, zeilen:[
     {z1:'Man redet Sie jetzt anders an.', z2:'Das erleichtert die Einladung.'},
     {z1:'Ein Rang ist gut. Ein Fest wäre besser.', z2:'Beides ginge auch.'},
   ]},
   {phase:'antritt', zeilen:[
     {z1:'Guten Morgen! Heute wird ein guter Tag.', z2:'Wie jeder. Es ist ja schön.'},
     {z1:'Ich stehe hier und schüttele Hände.', z2:'Auch wenn keine da ist.'},
   ]},
   {abAkt:4, zeilen:[
     {z1:'Im Keller stehen elf Kisten.', z2:'Zehn davon sind leer.'},
     {z1:'Ich bestelle jedes Jahr neu.', z2:'Feuchtes Konfetti taugt nichts.'},
   ]}
   ],
   anlass:{
     levelup:[
       {z1:'Ein Aufstieg! Herzlichen Glückwunsch.', z2:'Ich sage das gern öffentlich.'},
       {z1:'Da wäre eine Feier angebracht.', z2:'Sobald das geklärt ist.'},
     ],
     goldfund:[
       {z1:'So viel Gold. Sehr erfreulich.', z2:'Ein Fest kostet auch etwas.'},
       {z1:'Legen Sie etwas zurück.', z2:'Für später. Für uns alle.'},
     ],
     untaetigkeit:[
       {z1:'Stehen Sie ruhig. Ich rede weiter.', z2:'Ich bin dran. Wie immer.'},
       {z1:'Eine Pause ist auch Planung.', z2:'So sehe ich das seit elf Jahren.'},
     ]
   }},

  {key:'bramsche', name:'Registratorin Ottilie Bramsche', kurz:'Registratorin Bramsche', tx:21, ty:36, opt:'fest',
   // schwarzer Turmknoten (h6 ist der hochgesteckte Knoten, h3 war der
   // Undercut und nur gewählt, weil Blatt 3 das schwarze ist), verblichenes
   // Königsblau mit weißem Kragen
   gestalt:{hair:'h6', haarFarbe:'#0d1b21', hemd:'hof', hemdFarbe:'#384b66', hose:'hof', schuh:'schuh'},
   grund:[
     {z1:'Ordnung ist, was man wiederfindet.', z2:'Alles andere ist Zufall.'},
     {z1:'In welcher Sache sprechen Sie mich an?', z2:'Ohne Antrag sage ich nichts.'},
     {z1:'Ein Antrag, korrekt gestellt, öffnet alles.', z2:'Fehlt er, bleibt alles zu.'},
     {z1:'Anlage Drei schläft auf der richtigen Akte.', z2:'Ich wecke sie nicht.'},
     {z1:'Einmal gab ich etwas ohne Antrag heraus.', z2:'Das war der Brandabschnitt.'},
     {z1:'Was nicht abgelegt ist, existiert nicht.', z2:'In welcher Sache also?'},
   ],
   akt:[
     'Ein ruhiger Tag. Die Akten liegen richtig.',
     'Neuerdings fragen alle nach der Amtsleitung.',
     'Der Schreibtisch bleibt leer. Merkwürdig.',
     'Ein Sack ohne lesbare Anschrift. Seltsam.',
     'Ablage V ist offen. Ich lege nichts mehr ab.',
   ],
   // SZ3: Bramsche sortiert, und man sieht sie zum einzigen Mal im Spiel
   // gluecklich. Sie sagt es nicht, sie sagt Saetze ueber Ablage — das ist bei
   // ihr dasselbe.
   zusatz:[{lang:'stopfen', zeilen:[
     {z1:'Zweihunderteinundsiebzig Jahre Post.', z2:'Ich sortiere seit gestern.'},
     {z1:'Alles hat eine Anschrift. Alles.',     z2:'Sie ahnen nicht, wie das ist.'},
   ]}],
   antworten:[
     {frage:'Was war der Vorgang 1?', z1:'Vorgang 1 ist der Friedensvertrag.', z2:'Nie geschlossen, nur ausgesetzt.'},
     {frage:'Wo ist die Amtsleitung?', z1:'N.N. heißt nicht genannt.', z2:'Der Posten ist unbesetzt.'},
     {frage:'Was ist der Brandabschnitt?', z1:'Er liegt in Zuständigkeitsbereich VII.', z2:'Dort endete meine Ausnahme.'},
     {frage:'Was ist Ablage V?', z1:'Ablage V führt ins Schattenland.', z2:'Zugang nur mit Ausfertigung.'},
     {frage:'Wer ist Fürst Nachtrag?', z1:'Fürst Nachtrag ist Herr über Ablage V.', z2:'Er steht im Brief als Empfänger.'},
     {frage:'Wer ist zuständig für das Dorffest?', z1:'Zuständig wäre die Amtsleitung.', z2:'Diese Stelle ist unbesetzt.'},
     {frage:'Was liegt in Ablage auf Eis?', z1:'Ablage auf Eis führt nach Frostkamm.', z2:'Dort liegt seit Jahren Ruhe.'},
     {frage:'Was ist Ablage A?', z1:'Ablage A ist das Grasland.', z2:'Die harmloseste aller Ablagen.'},
     // W11: sieben Antworten zum Reich. Bramsche ist der Hinweisgeber des Spiels,
     // und ab hier ist das Reich das, wonach zu fragen sich lohnt. Wie alle ihre
     // Antworten nennen sie Fundorte und Zusammenhänge, nie Mechanik, und keine
     // verrät, wie im Kessel gerechnet wird.
     {frage:'Was ist Hochablage?', z1:'Hochablage ist eine Stadt im Norden.', z2:'Vier Tagesreisen. Ohne Straße.'},
     // Der Wortlaut aus der Weltgeschichte lautet "nach dem Alter des ältesten
     // offenen Vorgangs". Das Wort Alter steht auf der Sperrliste (Seltenheit
     // gleich Alter des Aktenzeichens), und knAssertCaps() hat es hier gemeldet.
     // Die Auskunft ist dieselbe, sie kommt nur ohne das Wort aus.
     {frage:'Wie wird der Rang gerechnet?', z1:'Wie lange der älteste Vorgang offen ist.', z2:'Andere Maßstäbe gibt es nicht.'},
     {frage:'Was ist ein Aktenhaus?', z1:'Ein Aktenhaus ist eine Familie.', z2:'Benannt nach der Zuständigkeit.'},
     {frage:'Warum regnet es hier nie?', z1:'Der Niederschlag ist zurückgestellt.', z2:'Seit dem Jahr 897.'},
     {frage:'Was brummt im Steinfeld?', z1:'Unter dem Steinfeld liegt eine Röhre.', z2:'Die Rohrpost. Sie steht still.'},
     {frage:'Wer ist der Kaiser?', z1:'Ordinat der Vierte ist im Termin.', z2:'Seit dem Jahr 588.'},
     {frage:'Was heißt zu Händen?', z1:'Zu Händen schreibt man an Hohe.', z2:'Gewöhnliche bekommen nur Post.'},
     // F1c: acht Fragen zu Leuten und zur Kurzform. Bramsche ist die
     // Auflösestelle des Abkürzungs-Gags, hier geht der erste Teil davon auf.
     {frage:'Wer ist Herr Nieselbeck?', z1:'Er ist der Wetterbeauftragte.', z2:'Die Stelle war nie unbesetzt.'},
     {frage:'Was ist mit Hintermühl?', z1:'Hintermühl ist abgeschlossen.', z2:'Der Bestand wurde geschlossen.'},
     {frage:'Wer sind Lott und Pahl?', z1:'Zwei Leute von dort. Sie sitzen.', z2:'Mehr frage ich nicht nach.'},
     {frage:'Wer ist zu Händen Vorblatt?', z1:'Er ist für Anhängiges zuständig.', z2:'Das ist beinahe alles.'},
     {frage:'Was heißt AL?', z1:'AL heißt Amtsleitung.', z2:'Bei Hohen heißt es anders.'},
     {frage:'Was heißt n. O.?', z1:'Nach der Ordnung. So zählen wir.', z2:'Seit dem ersten Blatt.'},
     {frage:'Was heißt MfM?', z1:'Ministerium für Monsterangelegenheiten.', z2:'Im Dorf sagt man Amt.'},
     {frage:'Was heißt TNM?', z1:'Tägliche Niederschlagsmeldung.', z2:'Herr Nieselbeck führt sie.'},
   ],
   abweisung:[
     {z1:'Eine Frage pro Schicht.', z2:'Die Ihre ist verbraucht.'},
     {z1:'In welcher Sache?', z2:'Das hatten wir schon.'},
     {z1:'Antrag für heute erledigt.', z2:'Morgen wieder.'},
   ],
   // W11: der Herr aus Hochablage von 985. Sie hält sich für schuldig an einem
   // Landstrich, und der Griff daneben hat in Wahrheit das Beweisstück gerettet.
   // Sie erfährt das nie, deshalb sagt sie nur die Hälfte, die sie kennt.
   zusatz:[{abAkt:3, zeilen:[
     {z1:'Damals kam ein Herr aus Hochablage.',  z2:'Er war ausgesprochen höflich.'},
     {z1:'Seitdem gebe ich nichts ohne Antrag.', z2:'Höflichkeit ist kein Antrag.'},
   ]},
   {abSchicht:8, zeilen:[
     {z1:'Sie kommen wieder. Notiert.', z2:'Nicht jeder kommt wieder.'},
     {z1:'Ihr Name steht inzwischen zweimal.', z2:'Einmal richtig, einmal falsch.'},
   ]},
   {abStufe:9, zeilen:[
     {z1:'Sie tragen mehr als beim ersten Mal.', z2:'Ich führe darüber nichts.'},
     {z1:'Was Sie da draußen holen, kommt hier an.', z2:'Irgendwann. Alles kommt an.'},
   ]},
   {skill:'int', ab:6, zeilen:[
     {z1:'Sie stellen die Frage jetzt richtig.', z2:'Das ist selten und angenehm.'},
     {z1:'Ein Antrag beginnt im Kopf.', z2:'Bei Ihnen offenbar auch.'},
   ]},
   {abRang:5, zeilen:[
     {z1:'Höherer Dienst. Das ändert nichts.', z2:'Der Antrag bleibt ein Antrag.'},
     {z1:'Ihr Titel öffnet hier keine Tür.', z2:'Ein Wortlaut schon.'},
   ]},
   {phase:'feierabend', zeilen:[
     {z1:'Unten ist es kühl. Immer.', z2:'Kühl, trocken, dunkel.'},
     {z1:'Ich gehe später als alle anderen.', z2:'Es liegt ja auch mehr hier.'},
   ]},
   {merker:'hatKammerBetreten', zeilen:[
     {z1:'Sie waren in einer Kammer.', z2:'Ordnung gibt es dort keine.'},
     {z1:'Wer dort ablegt, findet nichts wieder.', z2:'Kein Vorwurf. Fast keiner.'},
   ]}
   ],
   anlass:{
     kammerAbbruch:[
       {z1:'Zurückgegangen. Auch das ist ein Vorgang.', z2:'Ich vermerke es kommentarlos.'},
       {z1:'Leer herausgekommen? In welcher Sache?', z2:'Nicht jede Frage hat eine Akte.'},
     ],
     fluch:[
       {z1:'Sie haben etwas unterschrieben.', z2:'Gelesen haben Sie es nicht.'},
       {z1:'Auflagen stehen immer unten.', z2:'Ich lese immer unten zuerst.'},
     ],
     goldfund:[
       {z1:'Ein Fund. Der gehört verzeichnet.', z2:'Von mir aus auch später.'},
       {z1:'Gold ist einfach. Es fragt nichts.', z2:'Akten fragen. Ständig.'},
     ]
   }},

  {key:'zapf', name:'Hausmeister Reinhold Zapf', kurz:'Hausmeister Zapf', tx:17, ty:54, opt:'wander', sheet:'jack', komposit:true,
   // kurzes braunes Haar, verblichen grüne Latzhose über dem Unterhemd
   gestalt:{hair:'h1', haarFarbe:'#24200c', hemd:'kittel', hemdFarbe:'#8c8959', hose:'latz', schuh:'schuh'},
   grund:[
     {z1:'Ich reparier das. Nicht fragen.', z2:'Weil sonst nichts läuft.'},
     {z1:'Das Regal wackelt. Ich keile es fest.', z2:'Sonst kippt hier alles um.'},
     {z1:'Ich habe Werkzeug dabei.', z2:'Immer. Für alle Fälle.'},
     {z1:'Kaffee tropft. Ich beseitige das.', z2:'Kaffee ist ein Betriebsrisiko.'},
     {z1:'Tür klemmt. Ich mach sie leise.', z2:'Damit niemand was merkt.'},
     {z1:'Registratur ruft schon wieder.', z2:'Ich hab aber nur zwei Hände.'},
   ],
   akt:[
     'Neuer Außendienstler. Tür schon kaputt?',
     'Fest oder nicht, Bühne muss stehen.',
     'Leerer Stuhl. Quietscht trotzdem.',
     'Sack ist eingerissen. Ich nähe das.',
     'Nichts kaputt. Komisches Gefühl.',
   ],
   // W11: der Stopfen unter dem Steinfeld. Er beendet den Krieg mit Werkzeug,
   // und kein Satz wird ihm dafür länger als sechs Wörter.
   zusatz:[{abAkt:4, zeilen:[
     {z1:'Im Steinfeld brummt der Boden.', z2:'Ich hole das Werkzeug.'},
     {z1:'Ein Rohr. Verstopft. Sehr alt.', z2:'Kriegen wir auf.'},
   ]},
   {abSchicht:4, zeilen:[
     {z1:'Sie sind noch hier. Gut.', z2:'Spart mir das Namenlernen.'},
     {z1:'Vierter Tag. Nichts kaputt.', z2:'Von Ihnen jedenfalls.'},
   ]},
   {abStufe:8, zeilen:[
     {z1:'Sie sind schwerer geworden.', z2:'Die Dielen sagen es mir.'},
     {z1:'Ich habe nachgeölt. Vorsorglich.', z2:'Man weiß ja nie.'},
   ]},
   {skill:'str', ab:6, zeilen:[
     {z1:'Sie tragen jetzt selber.', z2:'Gut. Ich habe zwei Hände.'},
     {z1:'Kraft ist praktisch. Werkzeug auch.', z2:'Werkzeug hält länger.'},
   ]},
   {abRang:6, zeilen:[
     {z1:'Sie haben jetzt einen Titel.', z2:'Türen klemmen trotzdem.'},
     {z1:'Titel repariert nichts.', z2:'Ich schon.'},
   ]},
   {phase:'antritt', zeilen:[
     {z1:'Ich bin vor Ihnen da. Immer.', z2:'Aufschließen dauert sonst.'},
     {z1:'Kaffee läuft. Tropft auch.', z2:'Ich stelle was drunter.'},
   ]},
   {abAkt:5, zeilen:[
     {z1:'Das Schild ist wieder trocken.', z2:'Hält noch zwanzig Jahre.'},
     {z1:'Hinten drauf steht, wann.', z2:'Zum dritten Mal inzwischen.'},
   ]}
   ],
   anlass:{
     crit:[
       {z1:'Sauber. Nichts nachzuarbeiten.', z2:'So mache ich das auch.'},
       {z1:'Einmal richtig. Reicht meistens.', z2:'Zweimal ist Pfusch.'},
     ],
     ultimate:[
       {z1:'Viel Licht. Wenig Nutzen.', z2:'Wer räumt das jetzt auf?'},
       {z1:'Das gibt Arbeit. Meine.', z2:'Ich sage nichts weiter.'},
     ],
     untaetigkeit:[
       {z1:'Stehen kostet nichts. Stimmt nicht.', z2:'Es kostet Zeit.'},
       {z1:'Wenn Sie schon dastehen.', z2:'Halten Sie mal kurz.'},
     ]
   }},

  {key:'lisbeth', name:'Praktikantin Lisbeth Fuhr', kurz:'Praktikantin Fuhr', tx:3, ty:40, opt:'wander', sheet:'chloe', komposit:true,
   // dunkles Haar aus einem lockeren Knoten, grüne Bluse
   gestalt:{hair:'h6', haarFarbe:'#362620', hemd:'kittel', hemdFarbe:'#656848', hose:'hose', schuh:'schuh'},
   grund:[
     {z1:'Man erledigt Monster nicht.', z2:'Man beantwortet sie.'},
     {z1:'Und wenn er einfach nur wartet?', z2:'Das fragt hier keiner gern.'},
     {z1:'Sechstes Jahr Praktikum, immer noch unbezahlt.', z2:'Es fehlt nur eine Unterschrift.'},
     {z1:'Es fehlt eine weisungsbefugte Person.', z2:'Es gibt sie einfach nicht.'},
     {z1:'Mein Traum: ein Amt für Monster.', z2:'Nicht gegen sie, für sie.'},
     {z1:'Ich stelle nur die Fragen, die stören.', z2:'Irgendwer muss ja fragen.'},
   ],
   akt:[
     'Ich zähle mit, aber ich frage schon.',
     'Jetzt fragt endlich jemand mit mir.',
     'Ein leerer Stuhl. Genau mein Problem.',
     'Fragen Sie Nörgel. Er kann das lesen.',
     'Ich komme mit. Ich habe ja gefragt.',
   ],
   // W11: Sie hat als Einzige gemerkt, dass Fürst Nachtrag einen Titel trägt und
   // die übrigen Vorgangsarten nicht. Es steht auf Seite zwei ihres sechsten
   // Praktikumsberichts, und den hat nie jemand gelesen.
   zusatz:[{abAkt:3, zeilen:[
     {z1:'Der Fürst hat einen Titel. Die anderen nicht.', z2:'Steht in meinem Bericht.'},
     {z1:'Seite zwei. Hat nie jemand gelesen.',           z2:'Ist vielleicht auch nichts.'},
   ]},
   {abSchicht:5, zeilen:[
     {z1:'Sie sind länger hier als die meisten.', z2:'Ich zähle mit. Berufskrankheit.'},
     {z1:'Fünf Tage. Bei mir sind es sechs Jahre.', z2:'Nicht als Vorwurf. Nur so.'},
   ]},
   {abStufe:7, zeilen:[
     {z1:'Sie werden besser. Merkt das jemand?', z2:'Ich meine: schriftlich.'},
     {z1:'Wer bescheinigt Ihnen das eigentlich?', z2:'Bei mir bescheinigt es keiner.'},
   ]},
   {zweig:1, zeilen:[
     {z1:'Sie frieren Dinge ein statt sie zu treffen.', z2:'Das ist fast schon höflich.'},
     {z1:'Ein Eingefrorener kann noch antworten.', z2:'Ein Erledigter nicht mehr.'},
   ]},
   {abRang:4, zeilen:[
     {z1:'Sie steigen auf. Ich freue mich wirklich.', z2:'Und frage trotzdem weiter.'},
     {z1:'Wer Sie befördert, könnte auch unterschreiben.', z2:'Nur so ein Gedanke.'},
   ]},
   {phase:'feierabend', zeilen:[
     {z1:'Ich bleibe noch. Der Bericht wächst.', z2:'Seite zwei ist die spannende.'},
     {z1:'Abends fragt niemand zurück.', z2:'Da schreibe ich am besten.'},
   ]},
   {abAkt:2, zeilen:[
     {z1:'Auf jedem Deckblatt steht: vorläufig.', z2:'Sechsmal. Von mir geschrieben.'},
     {z1:'Ich habe das Wort nie geändert.', z2:'Es stimmte ja jedes Jahr.'},
   ]}
   ],
   anlass:{
     crit:[
       {z1:'Das war laut. Hat er etwas gesagt?', z2:'Ich frage für das Protokoll.'},
       {z1:'Sie treffen gut. Ich frage trotzdem.', z2:'Beides geht gleichzeitig.'},
     ],
     levelup:[
       {z1:'Aufstieg. Und wer trägt das ein?', z2:'Bei Ihnen tut es jemand.'},
       {z1:'Herzlichen Glückwunsch. Ehrlich.', z2:'Ich meine das nicht spitz.'},
     ],
     untaetigkeit:[
       {z1:'Sie stehen. Denken Sie nach?', z2:'Das machen hier wenige.'},
       {z1:'Und wenn er einfach nur wartet?', z2:'Ich frage das öfter.'},
     ]
   }},

  {key:'trepp', name:'Zusteller Emil Trepp der Siebte', kurz:'Zusteller Trepp', tx:28, ty:40, opt:'wander', sheet:'fin', komposit:true,
   // G9: die Dienstmütze ist jetzt eine Mütze und keine blaugraue Frisur mehr.
   // Haar und Mütze teilen sich den einen gemessenen Ton: seine blonde Tolle
   // schaut auf dem Porträt so wenig hervor, dass sie sich im 128er-Raster
   // nicht verlässlich messen lässt (die Schläfenprobe trifft Haut).
   gestalt:{hair:'h2', haarFarbe:'#474c61', hut:'muetze',
            hemd:'hof', hemdFarbe:'#494f63', hose:'hose', schuh:'schuh'},
   grund:[
     {z1:'Wenn ich kurz stören darf.', z2:'Sieben Generationen Trepp.'},
     {z1:'Wenn ich kurz stören darf.', z2:'Der Brief ist immer im Sack.'},
     {z1:'Wenn ich kurz stören darf.', z2:'Die Adresse ist unleserlich.'},
     {z1:'Wenn ich kurz stören darf.', z2:'Ich starre sie schon ewig an.'},
     {z1:'Wenn ich kurz stören darf.', z2:'Vielleicht heute lesbar?'},
     {z1:'Wenn ich kurz stören darf.', z2:'Zustellung bleibt Zustellung.'},
   ],
   akt:[
     'Ein Brief im Sack, wie immer.',
     'Alle reden vom Amt, ich trage den Brief.',
     'Ein leerer Stuhl, ein Brief, der bleibt.',
     'Sieben Generationen, und es ist ein Name.',
     'Sieben Generationen, jetzt oder nie.',
   ],
   // W11: Seine Amtsbezeichnung ist ein Adelsamt. Ein Bevollmächtigter ist im
   // Reich jemand, der zeichnet. Trepp trägt Post aus, weil ihm das nie jemand
   // gesagt hat, und er sagt es hier auch nicht, er liest nur seinen Ausweis vor.
   zusatz:[{abAkt:3, zeilen:[
     {z1:'Wenn ich kurz stören darf.',               z2:'Meine Bezeichnung ist sehr lang.'},
     {z1:'Schattenlandzustellungsbevollmächtigter.', z2:'Steht so im Ausweis. Ehrlich.'},
   ]},
   {abSchicht:7, zeilen:[
     {z1:'Wenn ich kurz stören darf.', z2:'Sie sind länger da als üblich.'},
     {z1:'Wenn ich kurz stören darf.', z2:'Ich frage jeden. Wirklich jeden.'},
   ]},
   {abStufe:10, zeilen:[
     {z1:'Sie könnten weit gehen. Weiter als ich.', z2:'Ich gehe nur im Dorf.'},
     {z1:'Wenn ich kurz stören darf.', z2:'Tragen Sie eigentlich Post?'},
   ]},
   {skill:'agi', ab:6, zeilen:[
     {z1:'Sie sind schnell. Das wäre nützlich.', z2:'Für Zustellungen, meine ich.'},
     {z1:'Wenn ich kurz stören darf.', z2:'Schnell hilft nicht bei weit.'},
   ]},
   {abRang:7, zeilen:[
     {z1:'Sie haben jetzt eine Bezeichnung.', z2:'Meine ist länger. Leider.'},
     {z1:'Wenn ich kurz stören darf.', z2:'Bezeichnungen sagen wenig.'},
   ]},
   {phase:'feierabend', zeilen:[
     {z1:'Wenn ich kurz stören darf.', z2:'Ich gehe gleich zum Gasthaus.'},
     {z1:'Der Sack kommt mit. Immer.', z2:'Auch abends. Auch sonntags.'},
   ]},
   {abAkt:3, zeilen:[
     {z1:'Mein Vater hat mir fünf Wörter gesagt.', z2:'Bei der Übergabe. Nur die.'},
     {z1:'Er ist noch nicht zugestellt.', z2:'So geht der Satz. Sechsmal.'},
   ]}
   ],
   anlass:{
     untaetigkeit:[
       {z1:'Wenn ich kurz stören darf.', z2:'Sie stehen. Ich auch. Anders.'},
       {z1:'Warten kann ich gut.', z2:'Sieben Generationen Übung.'},
     ],
     goldfund:[
       {z1:'Wenn ich kurz stören darf.', z2:'Gold wiegt. Post auch.'},
       {z1:'Das trage ich nicht mit.', z2:'Ich habe schon etwas dabei.'},
     ],
     crit:[
       {z1:'Entschuldigung. Das war laut.', z2:'Ich bin nur vorbeigekommen.'},
       {z1:'Wenn ich kurz stören darf.', z2:'Nein? Dann später.'},
     ]
   }},

  {key:'noergel', name:'Nörgel, Sachbearbeiter auf Probe', kurz:'Nörgel, auf Probe', tx:1, ty:36, opt:'wander', sheet:'mike', komposit:true,
   // G10: Nörgel bekommt ein Monsterrig. Sein Porträt zeigt einen Kobold mit
   // gewaltigen spitzen Ohren, und das Helden-Rig hat keine — G9 konnte ihm die
   // Haut grün färben, aber keine Ohren anwachsen lassen.
   //
   // U6: aber nicht mehr das Ork-Blatt. G10 hatte orc_chief genommen, weil es
   // ohnehin geladen wird (das Empfangsbekenntnis am Lagertor steht darauf),
   // und die Größe nachgerechnet statt nachgemessen: "Körper 20 bis 24 Pixel"
   // stand als Schätzung im Kommentar. Gemessen sind es 28 (Idle-Seitenzeile,
   // Frame 0, Deckfläche y 2..30), mal rigSc 1.9 also 53 Pixel — exakt die
   // Höhe der Menschen um ihn herum. Der kleine Sachbearbeiter war so groß wie
   // ein Häuptling, weil er einer war.
   //
   // Jetzt trägt er das Blatt der Grünhaut, also genau das, was im Wald als
   // Grünhaut herumläuft (MONDEF.goblin: rig goblin_maceman, sc 1.5, psc 1.2).
   // Das ist kein zweites Aussehen für dasselbe Volk, sondern dasselbe: er
   // sagt "Grünhaut. Wie ich." über seine Leute hinter der Palisade, und ab
   // hier stimmt das auch im Bild. rigSc 1.8 ist deshalb keine freie Zahl,
   // sondern sc mal psc aus MONDEF — drawMon() multipliziert beide, DRAW_NPC
   // kennt nur einen Faktor. Gemessen: Deckfläche 16 Pixel hoch, mal 1,8 sind
   // 29 im Bild, gut die Hälfte der Menschen.
   //
   // gestalt bleibt stehen und ist ab hier der Rückfallweg: ohne Grafikpaket
   // gibt es kein Rigblatt, dann steht wieder das grünhäutige Komposit da.
   rig:'goblin_maceman', rigSc:1.8,
   // G9: der einzige mit hautFarbe. Er ist ein Kobold, und bis G8 war das eine
   // schwache Tönung über die ganze Figur — grün lag dann auch auf seinem Hemd,
   // und weil es das Bild sonst zugekleistert hätte, blieb sie bei 0.22. Das
   // Ergebnis war ein Mensch mit Grünstich. Jetzt färbt hautBlatt() Gesicht und
   // Hände und lässt Augen, Konturen und Kleidung stehen; tint/tintA sind
   // ersatzlos weg. #949341 ist sein gemessener Gesichtston.
   // Das Hemd ist sandfarben und nicht grau — so steht es auf dem Bild, und das
   // Bild gilt (assets/figuren/README.md, Befunde am zweiten Paket).
   gestalt:{hair:'h1', haarFarbe:'#455033', hautFarbe:'#949341',
            hemd:'hemd', hemdFarbe:'#b49354', hose:'hose', schuh:'schuh'},
   // T1: Eine Beschwerde ohne Begruendung ist keine, und er ist eine. Jede
   // Zeile traegt jetzt ihren Grund mit, und die Coda aus Kapitel 8 steht am
   // Ende, wo sie hingehoert. Die ganze Form steht in seinem Baum.
   grund:[
     {z1:'Vierzig Jahre Probezeit. Mit Begründung.', z2:'Nächstes Jahr wird entfristet.'},
     {z1:'Die Entfristung macht die Amtsleitung.', z2:'Die sieht man nie. Aktenkundig.'},
     {z1:'Ich habe mich damals beschwert.', z2:'Dann hat man mich eingestellt.'},
     {z1:'Ich trage eine Krawatte. Vorschrift.', z2:'Fällt niemandem auf. Trotzdem.'},
     {z1:'Ich beschwere mich auch über mich.', z2:'Berechtigt, wie meistens.'},
     {z1:'Das ist nicht meine Zuständigkeit.', z2:'Ich mache es trotzdem.'},
   ],
   akt:[
     'Noch ein Formular, noch keine Antwort.',
     'Jetzt braucht auch Zwirn die Amtsleitung.',
     'Die Stelle ist leer, ich bin es nicht.',
     'Gelesen und gezeichnet. Ich bin im Dienst.',
     'Auch jetzt ist es nicht meine Zuständigkeit.',
   ],
   // W-Nörgel: seine Leute stehen zwölf Kacheln östlich hinter einer Palisade,
   // und bis hierher verband die beiden im Spiel nichts. Diese vier Zeilen
   // kommen erst, wenn der Spieler selbst am Lager war (kn.flags.hatLagerGesehen)
   // — er antwortet auf etwas, das der Spieler mitbringt, statt von einem Ort zu
   // erzählen, den niemand gesehen hat. Sie stellen die Frage aus Kapitel 2 und
   // lösen sie NICHT: die Zustellung bleibt Trepps Sack, Fürst Nachtrag und
   // Akt V. Am Lager selbst ändert sich nichts, es gibt nichts zu übergeben.
   zusatz:[
     {merker:'hatLagerGesehen', zeilen:[
       {z1:'Hinter der Palisade stehen meine Leute.', z2:'Grünhaut. Wie ich.'},
       {z1:'Die belagern nichts. Die warten.', z2:'Seit vierhundert Jahren.'},
       {z1:'Die schreiben. Nur liest es hier keiner.', z2:'Ich könnte. Fragt ja niemand.'},
       {z1:'Gehen Sie wieder hin. Ohne zu schlagen.', z2:'Dann sehen Sie es selbst.'},
     ]},
     // W11: Vorblatt bietet ihm die Entfristung an, damit er die Anschrift auf
     // dem Umschlag nicht liest. Vierzig Jahre Probezeit gegen ein Unterlassen.
     // Nörgel sagt nicht, wie er sich entscheidet.
     // F1d: die Belohnung aus Lisbeths Baum. Wer Seite zwei gelesen hat, hört
     // von Nörgel, dass er sie auch kennt. Der Zusammenhang wird nicht erklärt.
     {merker:'baumBericht', zeilen:[
       {z1:'Die Praktikantin schreibt etwas auf.', z2:'Seite zwei. Sehr genau.'},
       {z1:'Ich habe es gelesen. Als Einziger.', z2:'Bisher jedenfalls.'},
     ]},
     // LV4: was nach der Unterschrift von ihm stehen bleibt. Der Schalter liest
     // den Langvorgang, nicht einen Merker (siehe ZUSATZ_SCHALTER.lang). Er
     // erklärt den Präzedenzfall nicht und feiert ihn nicht, er stellt die
     // Zuständigkeit fest. Das ist seine Sprachmarke und Regel 6 des
     // Erledigens: es wird zugeklappt, nicht triumphiert.
     {lang:'bericht', zeilen:[
       {z1:'Ich habe für die Praktikantin gezeichnet.', z2:'Das war zulässig. Geprüft.'},
       {z1:'Zeichnen darf, wer im Dienst ist.',         z2:'Auf Probe ist im Dienst.'},
     ]},
     {abAkt:4, zeilen:[
       {z1:'Der Herr aus Oben hat mich angesprochen.', z2:'Er bietet mir die Entfristung.'},
       {z1:'Ich soll dafür etwas nicht tun.',          z2:'Vierzig Jahre. Und jetzt das.'},
     ]},
   {abSchicht:9, zeilen:[
     {z1:'Sie sind neun Tage hier.', z2:'Ich bin vierzig Jahre auf Probe.'},
     {z1:'Das ist kein Vorwurf an Sie.', z2:'Es ist einer. Nur nicht an Sie.'},
   ]},
   {abStufe:5, zeilen:[
     {z1:'Sie steigen auf. Zulässig.', z2:'Bei mir ist das anders geregelt.'},
     {z1:'Aufstieg ohne Antrag. Interessant.', z2:'Ich habe damals einen gestellt.'},
   ]},
   {skill:'int', ab:5, zeilen:[
     {z1:'Sie lesen. Das fällt hier auf.', z2:'Lesen können wenige. Ich schon.'},
     {z1:'Schrift ist Schrift. Man muss sie kennen.', z2:'Man muss wissen, woher sie ist.'},
   ]},
   {abRang:5, zeilen:[
     {z1:'Sie werden befördert. Ich gratuliere.', z2:'Beschwerde folgt trotzdem.'},
     {z1:'Ihr Verhältnis ist jetzt anders.', z2:'Meines heißt weiter: auf Probe.'},
   ]},
   {phase:'antritt', zeilen:[
     {z1:'Ich bin schon da. Wie immer.', z2:'Unbefristet wäre ich auch da.'},
     {z1:'Krawatte sitzt. Habe ich geprüft.', z2:'Fällt trotzdem niemandem auf.'},
   ]},
   {abAkt:2, zeilen:[
     {z1:'Die Krawatte ist beantragt worden.', z2:'Mit Antrag. Ordnungsgemäß.'},
     {z1:'Sie steht in einem Bestand.', z2:'Als einziges Stück. Meines.'},
   ]}
   ],
   anlass:{
     fluch:[
       {z1:'Kleingedrucktes. Sie lesen nicht.', z2:'Ich lese immer. Berufsschaden.'},
       {z1:'Eine Auflage mehr. Zulässig.', z2:'Beschwerde wäre möglich.'},
     ],
     untaetigkeit:[
       {z1:'Sie stehen herum. Verständlich.', z2:'Ich stehe seit vierzig Jahren.'},
       {z1:'Nicht meine Zuständigkeit.', z2:'Ich sage es trotzdem.'},
     ],
     kammerAbbruch:[
       {z1:'Abgebrochen. Das ist ein Recht.', z2:'Steht sogar irgendwo.'},
       {z1:'Zurückgehen ist kein Fehler.', z2:'Fehler sehen anders aus.'},
     ]
   }},

  {key:'milb', name:'Gutachter Dr. phil. Milb', kurz:'Gutachter Milb', tx:8, ty:39, opt:'wander', sheet:'buba', komposit:true,
   // langes graues Haar bis zum Kragen, blauer Gelehrtenmantel. G10: das
   // komposit:true fehlte hier seit G8 — Milb lief die ganze Zeit als
   // Farmer_Buba durchs Dorf, mit dessen Strohhut. Ein Gutachter mit Strohhut.
   gestalt:{hair:'h5', haarFarbe:'#68624d', hemd:'hof', hemdFarbe:'#314f62', hose:'hof', schuh:'schuh'},
   // T1: Er ist der Ausfuehrlichste im Haus, und seine Form ist das Gutachten in
   // vier Teilen: Gegenstand, Massstab, Ansetzung, Vorbehalt. Der Kreislauf der
   // Grundzeilen traegt sie in dieser Reihenfolge, wer ihn also zweimal
   // anspricht, hoert ein vollstaendiges Gutachten und merkt es nicht. Die
   // Signatur aus Kapitel 8 bleibt woertlich stehen, sie ist Teil drei.
   // Der vierte Teil ist die gesperrte Tatsache aus LV7 von innen: er hat
   // keinen Vorbehalt, und genau deshalb liegt er immer eine Stufe daneben.
   grund:[
     {z1:'Erstens der Gegenstand. Diese Kammer.', z2:'Ungefragt, versteht sich.'},
     {z1:'Zweitens der Maßstab. Der Vordruck.', z2:'Sechs Zeilen. Genügt seit je.'},
     {z1:'Das würde ich mit Drei ansetzen.', z2:'Höchstens. Das ist drittens.'},
     {z1:'Viertens der Vorbehalt. Meine Zahlen stimmen.', z2:'Nur wo, weiß ich nicht.'},
     {z1:'Ein Gutachten ist nie fertig.', z2:'Nur eingestellt.'},
     {z1:'Andere raten. Ich stufe ein.', z2:'Das ist ein Unterschied.'},
   ],
   akt:[
     'Die neue Kraft schätze ich auf Zwei.',
     'Ohne Freigabe stufe ich das niedrig ein.',
     'Ein leerer Stuhl lässt sich nicht bewerten.',
     'Diese Schrift verweigert sich der Note.',
     'Diesmal setze ich keine Note mehr an.',
   ],
   // W11: Er liegt auch bei der Hoheitsstufe des eigenen Hauses eine Stufe
   // daneben, nach oben. Ein Jahr reicht für Ritter der Vorlage, nicht für
   // Freiherr. Er merkt es nicht, wie immer.
   zusatz:[{abAkt:2, zeilen:[
     {z1:'Unser ältester Vorgang wird ein Jahr.', z2:'Das reicht für Freiherr. Knapp.'},
     {z1:'Ich stelle mich als Freiherr vor.',     z2:'Geschätzt, nicht geraten.'},
   ]},
   {abSchicht:6, zeilen:[
     {z1:'Ihre Verweildauer setze ich mit Vier an.', z2:'Das ist gut. Für hier.'},
     {z1:'Neue Kräfte halten selten.', z2:'Sie halten. Bemerkenswert.'},
   ]},
   {abStufe:6, zeilen:[
     {z1:'Ihre Entwicklung: Stufe Drei.', z2:'Ich habe das angesetzt.'},
     {z1:'Ich weiß, dass ich nichts weiß.', z2:'Das setze ich mit Zwei an.'},
   ]},
   {skill:'int', ab:7, zeilen:[
     {z1:'Sie denken. Das ist selten messbar.', z2:'Ich versuche es trotzdem.'},
     {z1:'Eine GA über Sie wäre reizvoll.', z2:'Ungefragt, versteht sich.'},
   ]},
   {abRang:6, zeilen:[
     {z1:'Ihr Rang entspricht etwa Ritter.', z2:'Meiner ist Freiherr. Knapp.'},
     {z1:'Wir sind fast auf einer Höhe.', z2:'Fast. Ich bin eine höher.'},
   ]},
   {phase:'antritt', zeilen:[
     {z1:'Morgens sind meine Zahlen genauer.', z2:'Nachmittags auch. Anders.'},
     {z1:'Ich habe zwei Kammern angesetzt.', z2:'Vor dem Frühstück.'},
   ]},
   {merker:'hatGesteigert', zeilen:[
     {z1:'Sie haben Punkte vergeben.', z2:'Nach welchem Maßstab?'},
     {z1:'Es gibt einen Vordruck dafür.', z2:'Sechs Zeilen. Ich kenne ihn.'},
   ]}
   ],
   anlass:{
     crit:[
       {z1:'Diesen Schlag setze ich mit Fünf an.', z2:'Höchstens.'},
       {z1:'Sauber getroffen. Notenwert hoch.', z2:'Ich korrigiere das später.'},
     ],
     ultimate:[
       {z1:'Das war überdimensioniert.', z2:'Ich setze es trotzdem hoch an.'},
       {z1:'Beeindruckend. Eine Stufe zu viel.', z2:'Wie meistens bei so etwas.'},
     ],
     kammerAbbruch:[
       {z1:'Diese Kammer war falsch eingestuft.', z2:'Von mir. Vermutlich.'},
       {z1:'Abbruch ist eine Bewertung.', z2:'Eine schlechte, aber eine.'},
     ]
   }},

  {key:'pommer', name:'Materialausgabe Herr Pommer', kurz:'Herr Pommer', tx:11, ty:54, opt:'wander', sheet:'katy', komposit:true,
   // kurzes blondes Haar (h1 statt der Tolle h2), Khakikittel. G10: #e1ac62
   // statt #b48651. Die Standardzone reichte bis auf seine hohe Stirn, und
   // Blond und Haut sind derselbe Farbton — der Familientest konnte sie nicht
   // trennen, das Mittel wog den Schatten unter dem Pony mit, und heraus kam
   // ein Braun. Gemessen wird jetzt das oberste Sechzehntel und dort der
   // Lichtton: auf 64 Pixeln liest sich Haar an seinem Licht, nicht an seinem
   // Flächenmittel.
   gestalt:{hair:'h1', haarFarbe:'#e1ac62', hemd:'kittel', hemdFarbe:'#9d8e63', hose:'hose', schuh:'schuh'},
   grund:[
     {z1:'Auf dem Antrag steht Eimer. Nicht Kanne.', z2:'Eimer ist Eimer. Fertig.'},
     {z1:'Auf dem Antrag steht Montag. Nicht heute.', z2:'Kommen Sie am Montag wieder.'},
     {z1:'Wortlaut ist Wortlaut. Sonst nichts.', z2:'Ich lese nur vor.'},
     {z1:'Steht da leicht, geht leicht heraus.', z2:'Nicht schwer. Leicht.'},
     {z1:'Ich betone nur, was dasteht.', z2:'Manchmal falsch betont.'},
     {z1:'Kein Antrag, kein Material. So steht es.', z2:'So steht es.'},
   ],
   akt:[
     'Antrag korrekt, Ausgabe korrekt. Nächster.',
     'Zwirns Antrag fehlt. Kein Fest ohne Antrag.',
     'Wer unterschreibt jetzt meine Freigaben?',
     'Ein Sack, kein Antrag dazu. Unglaublich.',
     'Zustellen steht nicht in meinem Bestand.',
   ],
   // W11: Er führt eine Liste der Dinge, die er ohne Antrag ausgegeben hat. Die
   // Liste ist leer. Er ist sehr stolz auf die Liste.
   zusatz:[{abAkt:2, zeilen:[
     {z1:'Ich führe eine Liste. Seit Jahren.',  z2:'Sie ist leer. Das ist die Liste.'},
     {z1:'Nichts ohne Antrag ausgegeben. Nie.', z2:'Steht alles nicht darin.'},
   ]},
   {abSchicht:7, zeilen:[
     {z1:'Sie stehen in meiner Liste. Zweimal.', z2:'Beide Male mit Antrag.'},
     {z1:'Sie holen ordentlich ab.', z2:'Das sage ich nicht oft.'},
   ]},
   {abStufe:9, zeilen:[
     {z1:'Sie tragen mehr. Steht das im Antrag?', z2:'Ich frage das jeden.'},
     {z1:'Größere Ausrüstung, größerer Antrag.', z2:'So ist die Reihenfolge.'},
   ]},
   {skill:'str', ab:8, zeilen:[
     {z1:'Sie tragen jetzt schwer.', z2:'Auf dem Antrag stand leicht.'},
     {z1:'Schwer ist nicht leicht.', z2:'Ich lese nur vor.'},
   ]},
   {abRang:8, zeilen:[
     {z1:'Höherer Dienst. Bitte den Antrag.', z2:'Auch dann. Gerade dann.'},
     {z1:'Ihr Titel steht jetzt oben drauf.', z2:'Der Wortlaut bleibt gleich.'},
   ]},
   {phase:'feierabend', zeilen:[
     {z1:'Ausgabe schließt. Der Antrag nicht.', z2:'Den können Sie immer stellen.'},
     {z1:'Ich räume ein. Sie räumen ab.', z2:'So war das nicht gemeint.'},
   ]},
   {merker:'hatGekocht', zeilen:[
     {z1:'Was Sie da mischen, war einmal Bestand.', z2:'Irgendwo steht es noch drin.'},
     {z1:'Bei mir kam nie etwas ohne Antrag heraus.', z2:'Bei Ihnen offenbar schon.'},
   ]}
   ],
   anlass:{
     goldfund:[
       {z1:'Ein Fund. Steht der im Antrag?', z2:'Nein. Also nicht meiner.'},
       {z1:'Gold gebe ich nicht aus.', z2:'Ich gebe aus, was dasteht.'},
     ],
     fluch:[
       {z1:'Sie haben unterschrieben. Wo genau?', z2:'Das würde mich interessieren.'},
       {z1:'Kleingedrucktes ist auch Wortlaut.', z2:'Sogar besonders.'},
     ],
     untaetigkeit:[
       {z1:'Sie stehen vor der Ausgabe.', z2:'Ohne Antrag bleibt sie zu.'},
       {z1:'Ich warte gern. Beruflich.', z2:'Sie offenbar auch.'},
     ]
   }},

  // G10: fass ist der einzige der drei, bei dem das Paketblatt konzeptionell
  // passt — Bartender_Bruno ist ein Wirt und Fass ist einer. Trotzdem
  // komposit:true, weil G8 das für alle acht Wandernden entschieden hat und ein
  // halber Stand schlimmer ist als beide Antworten. Wer das Blatt für die
  // bessere Zeichnung hält, streicht hier ein Wort.
  {key:'fass', name:'Wirt Bruno Fass, Gasthaus "Zum Letzten Stempel"', kurz:'Wirt Fass', tx:24, ty:38, opt:'wander', sheet:'bruno',
   // Der Einzige des Ensembles ohne komposit:true, und das ist eine
   // Entscheidung, keine Lücke. Das Pack hat einen fertigen Wirt, und er heißt
   // Bartender_Bruno — der Wirt dieses Dorfes heißt Bruno Fass. Der Name stand
   // seit W3 in der Tabelle, das Blatt lag seit dem Nachreichen des Pakets im
   // Ordner, und dass beides dasselbe ist, hat drei Bauabschnitte lang niemand
   // nachgesehen.
   //
   // Der Preis ist benannt und bezahlt: G8 hat komposit:true eingeführt, damit
   // Porträt und Weltfigur nicht auseinanderlaufen, und hier tun sie es. Das
   // Porträt zeigt einen schwergewichtigen Mann mit vollem dunklem Haar, das
   // Blatt einen mit Halbglatze und Schnauzbart. Beides ist derselbe Wirt in
   // Lederschürze, beides ist unverwechselbar er, und beides ist gemalt worden,
   // ohne vom anderen zu wissen. Wer das nicht will, schreibt komposit:true
   // wieder in diese Zeile und hat das Komposit zurück.
   //
   // gestalt bleibt stehen und ist kein Rest: ohne Grafikpaket gibt es das
   // Packblatt nicht, und dann läuft er wieder als Komposit. Kurzes schwarzes
   // Haar, offenes stumpfrotes Hemd; das Karohemd (Lumberjack) ist die Form mit
   // offenem Kragen und passt zum Wirt mit Lederschürze besser als das
   // schlichte.
   gestalt:{hair:'h3', haarFarbe:'#2d1b0e', hemd:'karo', hemdFarbe:'#793530', hose:'hof', schuh:'schuh'},
   grund:[
     {z1:'Wie war der Tag da draußen?', z2:'Setz dich. Bleib ein bisschen.'},
     {z1:'Zum Letzten Stempel schließt nie zu früh.', z2:'Bleib, so lang du willst.'},
     // T1: waermer, nicht laenger. Er ueberredet nie, er haelt einen Platz frei.
     {z1:'Alle hauen ab, bevor der Käse kommt.', z2:'Und der Käse ist gut.'},
     {z1:'Einmal bleibt wer bis zum Schluss.', z2:'Ich halte einen Platz frei.'},
     {z1:'Hier redet sich manches leichter.', z2:'Bei Suppe und Bier.'},
     {z1:'Kaum eingekehrt, schon wieder Dienst.', z2:'So ein Jammer.'},
   ],
   akt:[
     'Ein neues Gesicht am Tresen heute.',
     'Die Gespräche werden länger, die Krüge auch.',
     'Der Stammtisch hat eine Lücke.',
     'Heute sitzen alle enger zusammen.',
     'Es fühlt sich an wie ein letzter Abend.',
   ],
   // W11: Das Gasthaus heißt "Zum Letzten Stempel". Der Wirt weiß, was der Name
   // verspricht. Er hat ihn vom Großvater, und der hatte ihn von jemandem, der es
   // wusste. Er erklärt ihn nicht, er sagt nur, woher er kommt.
   zusatz:[{abAkt:4, zeilen:[
     {z1:'Der Name kommt vom Großvater.',       z2:'Der wusste, was er verspricht.'},
     {z1:'Irgendwann setzt einer den letzten.', z2:'Dann trink noch einen.'},
   ]},
   // SZ2: seine zwei Zeilen nach Kordula Umlaufs Besuch. Sie haengen am Merker
   // der Szene und nicht an einem Akt: sie handeln davon, dass sie da war, und
   // das weiss nur, wer mit ihr geredet hat. Zweiter Block an derselben Figur,
   // dasselbe Muster wie bei Noergel seit W-Noergel.
   {merker:'szeneUmlauf', zeilen:[
     {z1:'Die Botin war da. Hat viel geredet.',    z2:'Und schnell gegessen.'},
     {z1:'Sie kennt einen Bäcker. Bruno heißt er.', z2:'Wie ich. Merkwürdig.'},
   ]},
   {abSchicht:10, zeilen:[
     {z1:'Zehn Tage. Du hältst durch.', z2:'Setz dich mal richtig hin.'},
     {z1:'Du warst schon öfter hier.', z2:'Merke ich mir. Berufssache.'},
   ]},
   {abStufe:7, zeilen:[
     {z1:'Du siehst kräftiger aus.', z2:'Iss trotzdem was.'},
     {z1:'Wer viel trägt, sitzt gern.', z2:'Der Stuhl steht schon da.'},
   ]},
   {skill:'vit', ab:6, zeilen:[
     {z1:'Du steckst mehr weg als früher.', z2:'Das sieht man am Abend.'},
     {z1:'Zäh ist gut. Zäh bleibt sitzen.', z2:'Hoffe ich jedenfalls.'},
   ]},
   {abRang:5, zeilen:[
     {z1:'Jetzt hast du einen Titel.', z2:'Hier heißt du trotzdem du.'},
     {z1:'Titel zahlen nicht mit.', z2:'Du zahlst mit. Danke.'},
   ]},
   {phase:'feierabend', zeilen:[
     {z1:'Feierabend. Bleib noch etwas.', z2:'Der Käse kommt gleich.'},
     {z1:'Alle stehen auf. Immer alle.', z2:'Einer bleibt bestimmt mal.'},
   ]},
   {abAkt:4, zeilen:[
     {z1:'Oben steht ein Krug. Der bleibt oben.', z2:'Großvater hat das gesagt.'},
     {z1:'Einer wird gebraucht. Irgendwann.', z2:'Ich staube ihn ab. Das reicht.'},
   ]}
   ],
   anlass:{
     goldfund:[
       {z1:'Gold! Dann bleibst du heute länger.', z2:'Sag ich mal so.'},
       {z1:'Der Erste heute geht aufs Haus.', z2:'Der zweite auch. Bleib nur.'},
     ],
     levelup:[
       {z1:'Aufgestiegen? Setz dich drauf.', z2:'Ich hol was Ordentliches.'},
       {z1:'Das feiert man. Kurz wenigstens.', z2:'Kurz reicht mir schon.'},
     ],
     crit:[
       {z1:'Hab ich bis hierher gehört.', z2:'Klang teuer für den anderen.'},
       {z1:'Du haust ordentlich hin.', z2:'Trink was. Auf mich.'},
     ]
   }},

  {key:'lott', name:'Herr Lott, auf der Bank am Dorfplatz', kurz:'Herr Lott', tx:5, ty:54, opt:'fest',
   // Haarreste und geflickter brauner Mantel, gemessen an der linken Hälfte des
   // Doppelporträts (Motiv 11). Bis G8 trug er gar keine Kleiderebene. G10: die
   // Werte kommen jetzt aus der 128er-Tafelfassung, die das Spiel wirklich lädt,
   // statt aus der hochskalierten Ansichtsfassung — daher die Verschiebung um
   // ein bis zwei Zahlenschritte.
   gestalt:{hair:'h1', haarFarbe:'#a77256', hemd:'karo', hemdFarbe:'#855944', hose:'hose', schuh:'schuh'},
   // T1: Lott ist der Kuerzere, im Satzbau und in der Geduld. Das steht seit F1
   // in figuren-leben.md und war im Spiel nicht zu hoeren: seine Zeilen waren so
   // lang wie Pahls, stellenweise laenger. Jetzt nicht mehr. Gemessen liegt sein
   // Schnitt in z1 bei knapp siebenundzwanzig Zeichen, Pahls bei einundvierzig,
   // und weil der Chor jede Spielhandlung kommentiert, sieht der Spieler den
   // Unterschied hundertmal, ohne dass ihn je jemand erklaert. Das ist die
   // billigste Dauervorfuehrung der neuen Formregel, die dieses Spiel hat.
   grund:[
     {z1:'Der Neue. Wieder unterwegs.', z2:'Ich sitze. Zuständig für nichts.'},
     {z1:'Der Neue. Schlägt was kurz und klein.', z2:'Sauber. Nichts bleibt stehen.'},
     {z1:'Der Neue läuft. Ich sitze.', z2:'Manche stehen auf. Ich nicht.'},
     {z1:'Der Neue. Mutig.', z2:'Nicht mein Bereich.'},
     {z1:'Der Neue. Klatschnass.', z2:'Ich bleibe trocken. Prinzip.'},
     {z1:'Der Neue. Fragen Sie Herrn Pahl.', z2:'Der hat mehr Worte als ich.'},
   ],
   akt:[
     'Der Neue zählt Konfetti. Süß.',
     'Krieg ausgesetzt. Ich sitze weiter.',
     'N.N. Fragt ja auch keiner nach mir.',
     'Ich lese keine Adressen. Ich sitze.',
     'Der Neue zieht los. Kein Kommentar.',
   ],
   // W11: Vordermühl steht in keinem Bestand. Wer nie geführt wurde, kann auch
   // nicht abgeschlossen werden, und das ist der Grund, aus dem die beiden noch
   // da sind. Ob sie Vorgänge sind, bleibt offen (Weltbibel Kapitel 16).
   zusatz:[{abAkt:3, zeilen:[
     {z1:'Wir standen nie in einem Bestand.', z2:'Pahl sagt, das sei ein Glück.'},
     {z1:'Nicht geführt, also noch da.',     z2:'Pahl nickt. Ausnahmsweise.'},
   ]},
   {abSchicht:12, zeilen:[
     {z1:'Sie fragen zum zweiten Mal.', z2:'Wir sitzen hier. Wir merken das.'},
     {z1:'Der Neue ist keiner mehr.', z2:'Pahl sagt, das dauert immer.'},
   ]},
   {abStufe:8, zeilen:[
     {z1:'Der Neue wird groß.', z2:'Ich sitze. Das reicht mir.'},
     {z1:'Sie wachsen. Die Bank nicht.', z2:'Pahl hat nachgemessen.'},
   ]},
   {skill:'str', ab:7, zeilen:[
     {z1:'Der Neue trägt was weg.', z2:'Ich trage nichts. Nie.'},
     {z1:'Kraft ist was für draußen.', z2:'Hier drin reicht Sitzen.'},
   ]},
   {abRang:6, zeilen:[
     {z1:'Jetzt was Amtliches.', z2:'Wir zwei haben gar nichts.'},
     {z1:'Ein Titel. Sehr fein.', z2:'Pahl gratuliert. Ich nicke.'},
   ]},
   {phase:'antritt', zeilen:[
     {z1:'Früh unterwegs. Wie immer.', z2:'Wir sitzen schon länger da.'},
     {z1:'Morgen. Von uns beiden.', z2:'Pahl sagt es selten selbst.'},
   ]},
   {abAkt:5, zeilen:[
     {z1:'Wir haben aufgeräumt.', z2:'Steine sortiert. Das war es.'},
     {z1:'Man macht das so am Ende.', z2:'Pahl hat rechts gemacht.'},
   ]}
   ],
   anlass:{
     crit:[
       {z1:'Direkt ins Aktenzeichen.', z2:'Pahl schweigt. Wie erwartet.'},
       {z1:'Kein Zufall. Glaub ich.', z2:'Pahl, klatsch doch mal mit.'},
       {z1:'Ein Treffer fürs Buch.', z2:'Pahl nickt. Immerhin das.'},
     ],
     levelup:[
       {z1:'Befördert. Von wem?', z2:'Pahl weiß es auch nicht.'},
       {z1:'Höher, weiter. Ich sitze.', z2:'Pahl klatscht. Ich nicke.'},
       {z1:'Stufe hoch. Bank bleibt.', z2:'Pahl, freu dich für ihn.'},
     ],
     ultimate:[
       {z1:'Viel Zauber. Na sowas.', z2:'Pahl duckt sich schon mal.'},
       {z1:'Genehmigt? Bestimmt. Oder?', z2:'Pahl fragt nicht nach. Klug.'},
       {z1:'So viel Licht. Meine Augen.', z2:'Pahl blinzelt. Sonst nichts.'},
     ],
     fluch:[
       {z1:'Neuer Fluch. Kleingedrucktes.', z2:'Pahl liest es. Ich nie.'},
       {z1:'Jede Gabe hat einen Haken.', z2:'Pahl nennt das gerecht.'},
       {z1:'Noch einer. Für die Sammlung.', z2:'Pahl seufzt fürs Protokoll.'},
     ],
     goldfund:[
       {z1:'So viel Gold. Brauch keins.', z2:'Pahl rechnet schon mit.'},
       {z1:'Klingt nach Feierabend.', z2:'Pahl fragt: für wen sonst?'},
       {z1:'Viel Gold. Keine Rente.', z2:'Pahl lacht. Ich nicht.'},
     ],
     kammerAbbruch:[
       {z1:'Nichts gefunden. Passiert.', z2:'Pahl zählt trotzdem mit.'},
       {z1:'Leere Kammer. Voller Rückweg.', z2:'Pahl seufzt lauter als ich.'},
       {z1:'Leer ist auch eine Antwort.', z2:'Pahl widerspricht. Natürlich.'},
     ],
     untaetigkeit:[
       {z1:'Der Neue steht. Wie ich.', z2:'Pahl findet das gruselig.'},
       {z1:'Bank ist frei. Willkommen.', z2:'Pahl rückt trotzdem nicht.'},
       {z1:'Rumstehen ist mein Job.', z2:'Pahl übernimmt notfalls.'},
     ],
     // SZ2: der Nachklang der Szenen 2 und 4. Er faellt genau einmal, weil
     // npcSprechen() letzterAnlass beim Lesen verbraucht.
     umlauf:[
       {z1:'Die kommt alle achtzig Jahre.', z2:'Pahl merkt sich so etwas.'},
       {z1:'Eine Botin. Die hat es eilig.', z2:'Pahl hätte gern die Liste.'},
     ],
     hintermuehl:[
       {z1:'Er hat es gesagt.', z2:'Nach vierzig Jahren.'},
       {z1:'Ein Wort. Ein einziges.', z2:'Pahl hat es auch gehört.'},
     ],
     // SZ3: der Nachklang der Entklammerung. Vier Zeilen der Weltgeschichte,
     // aufgeteilt auf die beiden, die sie dort sprechen. Lott stellt fest, was
     // er sieht, Pahl das, was daruntersteckt — dieselbe Rollenteilung wie
     // ueberall bei den beiden.
     vorblatt:[
       {z1:'Der hat ganz schön was an.', z2:'Pahl sagt: was auf.'},
       {z1:'Ist das ein Unterschied?', z2:'Bei dem schon, sagt Pahl.'},
     ],
   }},

  {key:'pahl', name:'Herr Pahl, auf der Bank am Dorfplatz', kurz:'Herr Pahl', tx:8, ty:54, opt:'fest',
   // rotblond ins Weiße, grauer Mantel mit falschen Knöpfen, gemessen an der
   // rechten Hälfte desselben Doppelporträts. Die beiden unterscheiden sich im
   // Dorf am Mantel, nicht am Haar — auf dem Bild sind beide fast kahl.
   gestalt:{hair:'h4', haarFarbe:'#b77451', hemd:'hemd', hemdFarbe:'#7d6a63', hose:'hose', schuh:'schuh'},
   // T1: Pahl ist der Ausfuehrlichere. Er antwortet in ganzen Saetzen, gern
   // einen Halbsatz mehr als noetig, und in seiner Antwort kommt Lott vor. Die
   // andere Haelfte der Bank, siehe den Kommentar dort.
   grund:[
     {z1:'Da ist er wieder, unser Neuer. Unterwegs.', z2:'Ich sehe gern zu. Beruflich.'},
     {z1:'Sie kämpfen, und ich sehe dabei zu.', z2:'Zwei Berufe. Meiner ist leicht.'},
     {z1:'Die Bank hält warm, wenn man ihr Zeit gibt.', z2:'Ich gebe ihr sehr viel Zeit.'},
     {z1:'So habe ich schon viele genannt, wissen Sie.', z2:'Der Name bleibt. Sie wechseln.'},
     {z1:'Ob ich ein Vorgang bin? Das ist unhöflich.', z2:'Fragen Sie das nicht noch mal.'},
     {z1:'Die Sonne dreht sich weiter, ich nicht.', z2:'Kommentar ist auch ein Beruf.'},
   ],
   akt:[
     'Wieder einer, der alles ernst nimmt. Schön.',
     'Ein Fest ohne Erlaubnis. Wie hübsch.',
     'Ein Platz bleibt leer, und das fällt auf.',
     'Ein Brief, den keiner lesen will. Schade.',
     'Es wird still hier. Auffällig still.',
   ],
   // W11: dieselbe Sache von der anderen Seite der Bank. Hintermühl ist nicht
   // niedergebrannt worden, es ist zugeklappt worden, und das ist das Stillste,
   // was in dieser Welt passieren kann.
   zusatz:[{abAkt:3, zeilen:[
     {z1:'Man hat unser Dorf zugeklappt, einfach so.', z2:'Lott spricht nicht darüber.'},
     {z1:'Kein Feuer. Ein Aktendeckel.',   z2:'Lott war auch dabei.'},
   ]},
   {abSchicht:12, zeilen:[
     {z1:'Sie gehen nie richtig weg, ist Ihnen das klar?', z2:'Sie kommen immer wieder her.'},
     {z1:'Wir kennen Ihren Gang inzwischen.', z2:'Lott hört ihn zuerst.'},
   ]},
   {abStufe:8, zeilen:[
     {z1:'Sie sind gewachsen, und zwar sauber.', z2:'Lott hat es auch bemerkt.'},
     {z1:'Wachsen ist ein guter Beruf, sagt man.', z2:'Ich habe einen anderen.'},
   ]},
   {zweig:0, zeilen:[
     {z1:'Sie machen Licht da draußen, hört man.', z2:'Lott mag das nicht.'},
     {z1:'Feuer ist warm, und hier ist es das auch.', z2:'Die Bank steht in der Sonne.'},
   ]},
   {abRang:6, zeilen:[
     {z1:'Man redet Sie jetzt mit Titel an.', z2:'Uns redet gar niemand an.'},
     {z1:'Sehr schön für Sie, und das ehrlich.', z2:'Lott meint das auch so.'},
   ]},
   {phase:'feierabend', zeilen:[
     {z1:'Die Sonne geht, und wir bleiben sitzen.', z2:'Lott zuerst. Er sitzt näher.'},
     {z1:'Abends redet es sich einfach besser.', z2:'Da fragt niemand mehr nach.'},
   ]},
   {abAkt:5, zeilen:[
     {z1:'Wir haben damals die Steine gelegt.', z2:'Ordentlich. Wie es sich gehört.'},
     {z1:'Danach sind wir losgegangen, wir beide.', z2:'Und dann haben wir uns gesetzt.'},
   ]}
   ],
   anlass:{
     crit:[
       {z1:'Ein Treffer, und sauber getroffen dazu.', z2:'Lott hat sowas noch nie gesehen.'},
       {z1:'Das saß, und sogar ich habe es gemerkt.', z2:'Lott schläft schon wieder.'},
       {z1:'Kritisch, und zwar sehr kritisch sogar.', z2:'Notieren Sie das, Lott.'},
     ],
     levelup:[
       {z1:'Eine Stufe höher, und das ist zu Recht.', z2:'Lott zählt bestimmt falsch.'},
       {z1:'Sie wachsen, und ich sitze weiter hier.', z2:'Lott klatscht schon wieder.'},
       {z1:'Stufenaufstieg. Herzlichen Glückwunsch.', z2:'Lott, klatschen Sie leiser.'},
     ],
     ultimate:[
       {z1:'Das war groß, und ich sage das selten.', z2:'Lott hat die Augen zugemacht.'},
       {z1:'Ein großer Zauber, wirklich beeindruckend.', z2:'Lott, aufwachen. Das war gut.'},
       {z1:'So viel Kraft für so wenig Feind, finde ich.', z2:'Lott findet das übertrieben.'},
     ],
     fluch:[
       {z1:'Ein Fluch mehr, und er passt zu Ihnen.', z2:'Lott nennt das nur konsequent.'},
       {z1:'Schon wieder ein Haken, und keiner liest ihn.', z2:'Lott freut sich klammheimlich.'},
       {z1:'Ein Fluch, an den man sich gewöhnen kann.', z2:'Lott gewöhnt sich nie.'},
     ],
     goldfund:[
       {z1:'So viel Gold, und alles davon echt?', z2:'Lott zählt es heimlich mit.'},
       {z1:'Ein Sack voll Glück, das kommt kaum vor.', z2:'Lott will die Hälfte haben.'},
       {z1:'Reich geworden, wenn auch vorübergehend.', z2:'Lott nennt das Statistik.'},
     ],
     kammerAbbruch:[
       {z1:'Nichts gefunden, und auch das ist etwas.', z2:'Lott sieht das anders.'},
       {z1:'Leer herausgekommen, aber ehrlich immerhin.', z2:'Lott nennt das Verschwendung.'},
       {z1:'Keine Beute, und das kommt öfter vor.', z2:'Lott führt da eine Liste.'},
     ],
     untaetigkeit:[
       {z1:'Der Neue steht, und ich sitze dabei.', z2:'Lott findet das gemütlich.'},
       {z1:'Nichts passiert, und das ist endlich Ruhe.', z2:'Lott redet trotzdem weiter.'},
       {z1:'Sie stehen einfach nur da, und ich sitze.', z2:'Lott hält das für Faulheit.'},
     ],
     // SZ2, die andere Seite der Bank. Vier Zeilen der Quelle, zwei hier,
     // zwei bei Lott.
     umlauf:[
       {z1:'Sie sagt jedes Mal, es war nett hier.', z2:'Lott glaubt ihr das sogar.'},
       {z1:'Vierzehn Türme, und sie läuft sie alle.', z2:'Lott würde den Aufzug nehmen.'},
     ],
     hintermuehl:[
       {z1:'Wir haben ja gewartet, all die Jahre.', z2:'Wir warten gut.'},
       {z1:'Vierzig Jahre für ein einziges Wort.', z2:'Lott sagt gar nichts mehr.'},
     ],
     // SZ3: dieselbe Szene von der anderen Seite der Bank aus.
     vorblatt:[
       {z1:'Der hat ganz schön was auf.', z2:'Lott sieht nur den Mantel.'},
       {z1:'Sie haben ihn tatsächlich aufgemacht.', z2:'Darunter war ein Herr.'},
     ],
   }},

  // --- W11: drei Figuren aus der Weltgeschichte -----------------------------
  // Nieselbeck steht von Anfang an da, Umlauf ab Akt II, Vorblatt seit SZ3 erst,
  // wenn er wirklich angekommen ist (Szene 6, daWenn).
  // Alle drei sind opt:'fest', also Held-Komposite: die acht Blaetter aus
  // CF_NPCS sind an die elf Figuren von W3 vergeben, und zwei Figuren mit
  // demselben Gesicht war schon in G6 der Fehler, den wir nicht wollten.
  // Frisur und Oberteil bilden wie dort ein ueber alle Figuren eindeutiges Paar.

  // Er wartet seit dreiundvierzig Jahren auf seinen ersten Arbeitstag. Er steht
  // deshalb, statt zu wandern. Anker im Anger, oestlich unter den Marktstaenden.
  // Nicht auf (12, 41), wo er zuerst stand: das ist eine Kachel neben Knoeterich,
  // und die beiden Namensschilder lagen im Bild uebereinander. Der Ausweichsatz
  // in npcSchildFlush() faengt gleiche Zeilen ab, nicht zwei Figuren, die
  // praktisch am selben Punkt stehen.
  {key:'nieselbeck', name:'Wetterbeauftragter Ferdinand Nieselbeck', kurz:'Herr Nieselbeck', tx:21, ty:42, opt:'fest',
   // G9: die grüne Wetterdienstmütze ist jetzt eine Mütze und deckt sein Haar
   // zu, wie auf dem Bild. Wie bei Trepp teilen sich Haar und Mütze den einen
   // gemessenen Ton — sein graues Haar schaut zu wenig hervor, die
   // Schläfenprobe trifft Mützenschatten. Jacke bis oben zugeknöpft, dasselbe Grün.
   gestalt:{hair:'h1', haarFarbe:'#71825f', hut:'muetze',
            hemd:'kittel', hemdFarbe:'#586833', hose:'latz', schuh:'schuh'},
   // T1: Er meldet in Spalten. Seine Tabelle hat vier davon (Menge, Dauer,
   // Bodenart, Anmerkungen, siehe figuren-leben.md), dazu die Veranlassung, auf
   // die er wartet, und er kuerzt sie alle ab. Das ist der Telegrammstil, den
   // Kapitel 13 seit T1 als seine Sprachmarke fuehrt: er ist der kuerzeste
   // Sprecher des Spiels, und der einzige, der auf Nachfrage ausfuehrlich wird.
   // Die Aufloesung steht in seinem Baum, Spalte fuer Spalte, eine Frage
   // entfernt; szeneAssert() rechnet nach, dass jede Langform dort woertlich
   // faellt. Die Meldekuerzel selbst laufen an ABK_GROSS und ABK_PUNKT vorbei
   // (zwei Buchstaben vor dem Punkt, kein Versalienlauf) und erzeugen deshalb
   // keine Fehlmeldung im alten Abkuerzungs-Guard.
   grund:[
     {z1:'Gemeldet wird: TNM negativ.', z2:'Wie gestern. Wie immer.'},
     {z1:'Mg. null. Da. entfällt. Ba. trocken.', z2:'Anm.: keine. Alles bereit.'},
     {z1:'Eimer: vorhanden. Messstab: vorhanden.', z2:'Für den Fall. Seit immer.'},
     {z1:'Stelle: nie unbesetzt. Dreiundvierzig Jahre.', z2:'Das sagt sonst niemand.'},
     {z1:'Wolken: vorhanden. Vlg.: fehlt.', z2:'Deshalb dürfen sie nicht.'},
     {z1:'Sie waren im Frostkamm? Dort liegt etwas.', z2:'Von mir. Auf Eis.'},
   ],
   akt:[
     'Willkommen. Wetterlage: unverändert schön.',
     'Man fragt nach der Leitung. Ich melde nur.',
     'Dreiundvierzig Jahre. Der Eimer hält.',
     'Wenn Sie hinauf müssen: bleibt schön.',
     'Bereitschaft: hergestellt. Man weiß nie.',
   ],
   zusatz:[
   {abSchicht:11, zeilen:[
     {z1:'Gemeldet wird: Sie sind noch hier.', z2:'Das ist bemerkenswert.'},
     {z1:'Elf Tage. Ich zähle mit.', z2:'Zählen gehört zur Stelle.'},
   ]},
   {abStufe:9, zeilen:[
     {z1:'Gemeldet wird: Sie sind gewachsen.', z2:'Wetter: unverändert.'},
     {z1:'Sie ändern sich. Das Wetter nicht.', z2:'Einer von uns beiden reicht.'},
   ]},
   {zweig:1, zeilen:[
     {z1:'Sie machen Eis. Das ist Niederschlag.', z2:'Fast. Nicht ganz. Leider.'},
     {z1:'Gemeldet wird: örtliches Eis. Mg.: gering.', z2:'Nicht amtlich. Aber schön.'},
   ]},
   {abRang:4, zeilen:[
     {z1:'Sie steigen. Meine Stelle bleibt.', z2:'Sie war nie unbesetzt.'},
     {z1:'Gemeldet wird: ein Aufstieg im Haus.', z2:'Das melde ich gern mit.'},
   ]},
   {phase:'antritt', zeilen:[
     {z1:'Gemeldet wird: TNM negativ.', z2:'Vorbereitungen: abgeschlossen.'},
     {z1:'Guten Morgen. Der Eimer steht.', z2:'Wie gestern. Wie immer.'},
   ]},
   {abAkt:3, zeilen:[
     {z1:'Ich führe zwei Tabellen. Eine ist leer.', z2:'Die leere ist die wichtige.'},
     {z1:'Die Kopfzeile ziehe ich nach.', z2:'Jedes Jahr. Tinte verblasst.'},
   ]}
   ],
   anlass:{
     untaetigkeit:[
       {z1:'Gemeldet wird: Stillstand.', z2:'Ich kenne das gut.'},
       {z1:'Stehen ist keine Verzögerung.', z2:'Es ist Bereitschaft.'},
     ],
     levelup:[
       {z1:'Gemeldet wird: ein Aufstieg.', z2:'Vorbereitungen: unverändert.'},
       {z1:'Sie kommen voran. Schön.', z2:'Ich stehe weiter bereit.'},
     ],
     kammerAbbruch:[
       {z1:'Zurückgekommen. Auch gut.', z2:'Man kann nicht immer los.'},
       {z1:'Gemeldet wird: eine Rückkehr.', z2:'Ba.: trocken. Wie immer.'},
     ]
   }},

  // Sie bringt die Welt ins Dorf: ueber sie erfaehrt der Spieler zum ersten Mal,
  // dass Oben ein Ort ist. Deshalb abAkt:2 und keine Aktzeile fuer Akt I.
  {key:'umlauf', name:'Reichsbotin Kordula Umlauf', kurz:'Reichsbotin Umlauf', tx:26, ty:42, opt:'fest', abAkt:2,
   // rotes Haar, aus dem Band geflogen (h5, langes offenes Haar, statt des
   // Seitenscheitels h4 — der war die rothaarige Vorlage und nicht die Form).
   // Am Kragen liegt der graue Reiseumhang, nicht die blaue Uniform darunter:
   // gemessen wird, was man sieht.
   gestalt:{hair:'h5', haarFarbe:'#711d0d', hemd:'hof', hemdFarbe:'#524b54', hose:'hof', schuh:'schuh'},
   grund:[
     {z1:'Vierzehn Türme, ein Aufzug, neun Stockwerke.', z2:'Der Rest ist Treppe.'},
     {z1:'Ich bin im Umlauf. Seit einer Weile.', z2:'Man gewöhnt sich daran.'},
     // T1: Ihr Gag ist der Abbruch mitten im Satz, und bis hierher brach kein
     // Satz wirklich ab. Jetzt zwei. Sie werden dadurch nicht laenger, nur
     // ungeduldiger, und das ist bei ihr dasselbe wie eine Sprachmarke.
     {z1:'Oben ist sauber, leise, hell, und dann,', z2:'Verzeihung. Ich muss weiter.'},
     {z1:'Elf Stellen noch, zwölf mit dem Tor, und', z2:'Nein, dreizehn. Muss los.'},
     {z1:'Die Rohrpost geht nicht. Seit immer.', z2:'Ich laufe. Geht auch.'},
     {z1:'Ich muss weiter. War nett bei Ihnen.', z2:'Wirklich. Sehr nett.'},
   ],
   akt:[
     '',
     'Sie fragen nach Oben? Oben ist eine Stadt.',
     'Ihre Stelle ist ausgeschrieben. Jedes Jahr.',
     'Ich habe erzählt, dass es hier vorangeht.',
     'Diesmal komme ich mit. Nur bis zum Tor.',
   ],
   zusatz:[
   {abSchicht:14, zeilen:[
     {z1:'Sie schon wieder. Schön.', z2:'Ich bin nur kurz da. Wie immer.'},
     {z1:'Vierzehn Tage, elf Stellen, ein Weg.', z2:'Ihrer ist kürzer. Beneidenswert.'},
   ]},
   {abStufe:10, zeilen:[
     {z1:'Sie sind gewachsen, würde ich sagen.', z2:'Ich sehe viele. Ich vergleiche.'},
     {z1:'Weiterkommen können Sie gut.', z2:'Ankommen ist etwas anderes.'},
   ]},
   {skill:'agi', ab:7, zeilen:[
     {z1:'Sie sind schnell. Wir zwei also.', z2:'Schnell und trotzdem nie fertig.'},
     {z1:'Laufen ist kein Beruf, sagt man.', z2:'Doch. Ist es. Meiner.'},
   ]},
   {abRang:6, zeilen:[
     {z1:'Ihr Titel wird oben eingetragen.', z2:'Von jemandem. Irgendwann.'},
     {z1:'Ich melde so etwas gern weiter.', z2:'Erzählen ist mein Beruf.'},
   ]},
   {phase:'feierabend', zeilen:[
     {z1:'Ich muss weiter. War nett bei Ihnen.', z2:'Ich bin dann mal weg.'},
     {z1:'Abends laufe ich am besten.', z2:'Da hält mich niemand auf.'},
   ]},
   {abAkt:4, zeilen:[
     {z1:'Ich habe mich einmal hingesetzt.', z2:'Eine Stunde. In Hochablage.'},
     {z1:'Es war die längste meines Lebens.', z2:'Danach zwei Tage aufgeholt.'},
   ]}
   ],
   anlass:{
     levelup:[
       {z1:'Aufstieg! Das erzähle ich weiter.', z2:'Nicht böse gemeint. Nur so.'},
       {z1:'Sie kommen voran. Wirklich.', z2:'Ich komme auch voran. Anders.'},
     ],
     goldfund:[
       {z1:'Gold! Das trage ich nicht.', z2:'Ich trage nur Papier.'},
       {z1:'Schwer wird man langsam.', z2:'Ich bleibe leicht. Beruflich.'},
     ],
     untaetigkeit:[
       {z1:'Sie stehen. Wie halten Sie das aus?', z2:'Ich frage aus Neugier.'},
       {z1:'Stillstehen habe ich mal probiert.', z2:'Nicht mein Fach. Weiter.'},
     ]
   }},

  // Der Gegenspieler. Er taucht auf, sobald der Spieler anfaengt, gefaehrlich zu
  // werden, also ab Akt III. Anker vor der Amtstuer, weil er nicht hindurchpasst;
  // zwei Kacheln suedlich davon, damit er die Kontextaktion der Tuer nicht
  // ueberstimmt (derselbe Grund, aus dem Zwirn in G6 gewandert ist).
  // SZ3: abAkt 3 -> 4, und dazu daWenn. W11 hat ihn auf Akt III gesetzt, weil die
  // Weltgeschichte ihm ab dort Aktzeilen gibt; seine ANKUNFT war damals nicht
  // gebaut und stand in W11 selbst als offener Punkt ("sein Auftritt ist damit
  // nicht erzaehlt"). Seit SZ3 ist sie gebaut, also gilt sie: er steht im Dorf,
  // wenn er angekommen ist, und nicht, wenn eine Schichtzahl es erlaubt.
  {key:'vorblatt', name:'Reichsministerialdirektor zu Händen Vorblatt', kurz:'zu Händen Vorblatt', tx:11, ty:37, opt:'fest', abAkt:4,
   daWenn: () => kn.flags.szeneVorblatt,
   // glattes schwarzes Haar, dunkler Mantel mit stumpfer Goldbordüre. Das
   // Hofhemd ist die Form mit hohem Kragen und Borte; G8 hatte hier noch einen
   // goldenen Plattenpanzer, weil das Vokabular nur Rüstungsstufen kannte, und
   // ein Reichsministerialdirektor trägt keine Rüstung. Mantel und Haar sind
   // beide praktisch Schwarz, #171717 ist der angehobene Messwert — siehe
   // brauchbar() in tools/portraet-farben.py.
   gestalt:{hair:'h3', haarFarbe:'#171717', hemd:'hof', hemdFarbe:'#171717', hose:'hof', schuh:'schuh'},
   grund:[
     {z1:'Ihr Anliegen wird bearbeitet.', z2:'Das ist bereits sehr viel.'},
     {z1:'Nein sage ich grundsätzlich nicht.', z2:'Nein wäre eine Entscheidung.'},
     {z1:'Ich bin für Anhängiges zuständig.', z2:'Anhängig ist beinahe alles.'},
     {z1:'Hochablage grüßt Vordermühl.', z2:'Hochablage grüßt sehr gern.'},
     {z1:'Sie führen keinen Vorgang.', z2:'Das macht Sie sehr frei.'},
     {z1:'Ich habe Ihnen etwas mitgebracht.', z2:'Alle bekommen etwas.'},
   ],
   // SZ3: die Akt-III-Zeile ist weg, weil er in Akt III nicht mehr im Dorf steht.
   // Eine Aktzeile fuer einen Akt, in dem die Figur nicht ansprechbar ist, ist
   // tote Tabelle — knAssertCaps() meldet sie, und er hat recht.
   akt:[
     '',
     '',
     '',
     'Ein Umschlag. Reizend. Geben Sie ihn mir.',
     'Ich war zuständig. Nun bin ich hier.',
   ],
   zusatz:[
   {abSchicht:24, zeilen:[
     {z1:'Sie sind noch im Dienst. Bemerkenswert.', z2:'Wir prüfen das gern.'},
     {z1:'Ihre Stelle ist täglich befristet.', z2:'Das schafft eine gewisse Ruhe.'},
   ]},
   {abStufe:12, zeilen:[
     {z1:'Sie sind gestiegen. Ich gratuliere.', z2:'Ihr Anliegen wird bearbeitet.'},
     {z1:'Wachstum ist ein Vorgang.', z2:'Auch dieser ist anhängig.'},
   ]},
   {skill:'int', ab:8, zeilen:[
     {z1:'Sie lesen viel. Das prüfen wir gern.', z2:'Nicht Sie. Wir.'},
     {z1:'Ein lesender Außendienst. Reizend.', z2:'Selten. Sehr selten.'},
   ]},
   {abRang:8, zeilen:[
     {z1:'Höherer Dienst. Fast einer von uns.', z2:'Fast. Sie verstehen.'},
     {z1:'Ihr Titel ist ordentlich erworben.', z2:'Ordentlich ist das Wichtigste.'},
   ]},
   {phase:'antritt', zeilen:[
     {z1:'Sie fangen früh an. Löblich.', z2:'Früh ist beinahe eine Haltung.'},
     {z1:'Hochablage grüßt. Auch morgens.', z2:'Hochablage grüßt sehr gern.'},
   ]},
   {abAkt:4, zeilen:[
     {z1:'In meinem Fach liegt ein Stempel.', z2:'Er ist durchgeschrieben.'},
     {z1:'Ausmustern wäre eine Entscheidung.', z2:'Sie verstehen das Problem.'},
   ]}
   ],
   anlass:{
     ultimate:[
       {z1:'Sehr aufwendig. Wir prüfen das gern.', z2:'Nicht heute. Aber gern.'},
       {z1:'Das war groß. Und anhängig.', z2:'Beides zugleich. Bemerkenswert.'},
     ],
     fluch:[
       {z1:'Sie haben gezeichnet. Sehr korrekt.', z2:'Gezeichnet wird zu selten.'},
       {z1:'Eine Auflage. Wie schön.', z2:'Auflagen halten Dinge offen.'},
     ],
     untaetigkeit:[
       {z1:'Sie stehen. Das ist völlig zulässig.', z2:'Stehen ist auch bearbeiten.'},
       {z1:'Nehmen Sie sich Zeit. Viel Zeit.', z2:'Zeit haben wir reichlich.'},
     ]
   }},
];
// Literale oben bewusst im alten 80er-Raster (vgl. figuren-dorf.md) — einmalig
// um DORF_DX/DORF_DY verschoben, bevor genMap() die Anker liest (:2443 unten).
for(const f of DORF_FIGUREN){ f.tx += DORF_DX; f.ty += DORF_DY; }
let trees = [];
const decos = [];      // Pilze, Windmühle, Dorf-Gebäude (big:true) — reine Optik, keine Kollision
const critters = [];   // Hühner/Schafe/Kühe, wandern im Grasland
let KOPPEL = null;     // G11: die eingezäunte Weide, in Kacheln {x0,y0,x1,y1,torX} — null, solange genMap() nicht lief
const BUCHTEN = [];    // G12: die gesuchten Wasserstellen {tx,ty,g} — Mittelpunkt in Kacheln, g = Geborgenheit
const npcs = [];        // G5: Dorf-Staffage, Wanderradius um einen Heimatanker (kein freies Abprallen wie critters)

// G5: Wetter, rein optisch. Eigene Sub-Caps (keine particles[]-Producer, s. MAX_PARTICLES-
// Kommentar weiter unten) — Wolken sind ohnehin kein particles-Fall, Schnee/Wind bekommen
// je einen eigenen kleinen Deckel, damit ein zweiter Producer den 900er-Deckel nicht umgeht.
const weatherClouds = [];   // Grasland, driften über die ganze Karte, persistent wie trees/decos
const weatherSnow = [];     // Frostkamm, kontinuierlich nachgespeist
const weatherWind = [];     // Aschewüste, gelegentliche Böen
const WEATHER_SNOW_CAP = 40, WEATHER_WIND_CAP = 6;
let windGustT = rr(3, 8);

function makeCanvas(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }

// --- Boden aus Cute-Fantasy-Tiles (Phase G4) --------------------------------
// Jeder Eintrag ist [sheetKey, [x,y]] — UV nur bei aus einem Großbild
// gecroppten Sheets (Volcano/ShroomLands), bei eigenständigen Einzeltile-PNGs
// (Grass/Path/Water) ist es [0,0], das ganze Bild ist die Kachel. Werte per
// Pixel-Varianzscan gemessen, Details in tools/sheet-audit.overrides.json
// unter _g4Tiles. Frostkamm hat weiterhin kein eigenes Schnee-Tileset im Pack
// und bleibt eine gebackene Umfärbung (TILE_TINT.snow).
const CF_TILE = {
  // 4 statt 2 Grundtöne (kein Blüten-Einzeltile im Pack, s. Umsetzungsnotizen G4).
  // Erster Anlauf hatte Grass_3/4 als seltene 1-von-6-Sonderkachel wie einst die
  // Sunnyside-Blüten — sichtbares Schachbrett am laufenden Spiel, weil die beiden
  // Töne deutlich kontrastreicher sind als 1/2. Korrigiert: alle 4 gleichberechtigt
  // im selben Pool, dadurch feinere, natürlichere Streuung statt harter Flecken.
  grass:     [['cfgrass1',[0,0]], ['cfgrass2',[0,0]], ['cfgrass3',[0,0]], ['cfgrass4',[0,0]]],
  path:      [['cfpath',[0,0]]],
  water:     [['cfwater',[0,0]]],
  volcano:   [['cfvolcano_tiles',[16,0]], ['cfvolcano_tiles',[16,32]]],
  lava:      [['cfvolcano_tiles',[128,112]]],
  shroom:    [['cfshroom_tiles',[16,16]], ['cfshroom_tiles',[16,64]]],
};
// Biome ohne eigene Tiles entstehen als eingefärbte Kopien (einmal gebacken).
const TILE_TINT = {
  snow:       ['#eaf6ff', 0.82],
  // Monsterkatalog M1: Sumpf und Altbestand haben wie der Frostkamm kein eigenes
  // Tileset im Pack und entstehen deshalb als eingefärbte Kopien. Sumpf ist
  // abgestandenes Grün auf Gras, der Altbestand grauer Stein auf dem Pfadtile,
  // das Moorwasser eine dunklere Fassung der Eisteiche.
  sumpf:      ['#4a6b3a', 0.62],
  moor:       ['#3d5a3a', 0.66],
  ruine:      ['#8f8a86', 0.62],
  ice:        ['#f2fbff', 0.74],
  shadowDirt: ['#2e0f42', 0.74],
  shadowDeep: ['#1a0630', 0.72],   // W-Groß: die Tilgung im Schattenland
  tiefsee:    ['#2f6ea8', 0.45],   // W-Groß: offenes Meer, dunkler als die Eisteiche
  strand:     ['#e8d59a', 0.55],   // W-Groß: Strandsaum, heller als der Dorfpfad
};

const TILE_CACHE = {};
function bakeCfTile(sheetKey, uv, tintName){
  const ck = sheetKey + ',' + uv[0] + ',' + uv[1] + ',' + (tintName || '-');
  if(TILE_CACHE[ck]) return TILE_CACHE[ck];
  const sheet = SHEETS[sheetKey]; if(!sheet) return null;
  const c = makeCanvas(TS, TS), cc = c.getContext('2d');
  cc.imageSmoothingEnabled = false;
  cc.drawImage(sheet.img, uv[0], uv[1], 16, 16, 0, 0, TS, TS);
  const t = tintName && TILE_TINT[tintName];
  if(t){
    cc.globalCompositeOperation = 'source-atop';
    cc.globalAlpha = t[1]; cc.fillStyle = t[0];
    cc.fillRect(0, 0, TS, TS);
  }
  TILE_CACHE[ck] = c;
  return c;
}
// Wählt per Zellhash einen Eintrag aus einer CF_TILE-Liste und backt ihn.
// fmix32 ist Pflicht: die Bits 4/5 von tileHash hängen nur von x&63/y&63 ab
// (Multiplikator-Übertrag läuft nur nach oben), benachbarte Kacheln wechselten
// dadurch garantiert die Variante — regelmäßiges Schachbrett statt Streuung (F39).
function pickCfTile(list, x, y, tintName){
  const e = list[(fmix32(tileHash(x,y)) >>> 4) % list.length];
  return bakeCfTile(e[0], e[1], tintName);
}

// --- Kammerboden aus Cute-Fantasy-Dungeon-Sets (Phase G1) -------------------
// UVs per Rasteranalyse am PNG gemessen. Beide Sets teilen dasselbe Layout:
// Spalten 4-6 / Zeilen 0-2 sind ein 3x3-Wandring aus dunklem Kopfstein mit
// durchsichtiger Mitte (das ist die 9-Slice-Wand), Spalte 8 / Zeile 4 ist der
// freistehende Wandblock, Spalten 4-6 / Zeilen 6-7 sind Ziegelboden. Nur die
// Zeilen 6-7 nehmen, nicht 6-8: Dungeon_2 ist 208x192 und hat Zeile 8 nicht.
//
// edgeN/E/S/W und die Ecken benennen, wo der begehbare Boden liegt, nicht die
// Position im Ring — die Ringoberkante ist edgeS, weil unter ihr der Raum liegt.
const DUN_SET = [1, 2].map(n => ({
  key: `dun${n}_tiles`,
  floor: [[64,96], [80,112], [96,96], [80,96], [64,112]],
  wall:  [[128,64]],                                    // massiver Block, deutlich dunkler als der Boden
  edgeS: [80,0],  edgeN: [80,32], edgeE: [64,16], edgeW: [96,16],
  eckSE: [64,0],  eckSW: [96,0],  eckNE: [64,32], eckNW: [96,32],
}));

// M3, Satz 2 (Stollen). Anders als die beiden Dungeon-Blaetter verteilt sich der
// Cave-Satz auf zwei Dateien, deshalb traegt hier jeder UV-Eintrag optional seinen
// Blattschluessel als drittes Feld; bakeDunTile() liest ihn. Der dunkle Ring in
// Cave_Walls bei (64,0) hat exakt dasselbe 3x3-Layout wie die Dungeon-Blaetter —
// am Pixel nachgemessen (Deckung und Mittelfarbe je Zelle), nicht angenommen.
// Der Fuellblock kommt aus der Steinquaderzeile bei y=112.
DUN_SET.push({
  key: 'dun3_walls',
  floor: [[0,0,'dun3_floor'], [16,0,'dun3_floor'], [0,16,'dun3_floor'], [16,16,'dun3_floor'], [0,32,'dun3_floor']],
  // Abweichung von der Dungeon-Regel "Fuellblock deutlich dunkler als der Boden":
  // der Cave-Satz hat keine flache dunkle Kachel. Die dunklen Ringecken waeren
  // dunkel genug, kacheln aber sichtbar zu einem Bogenmuster (gegengeprueft, s.
  // Phasendokument). Die Steinquaderzeile bei y=112 ist heller als der Boden und
  // wird trotzdem eindeutig als Wand gelesen, weil sie Mauerwerk zeigt statt
  // Flaeche. Im Stollen traegt also die Textur, was sonst die Helligkeit traegt.
  wall:  [[0,112], [16,112], [32,112]],
  edgeS: [80,0],  edgeN: [80,32], edgeE: [64,16], edgeW: [96,16],
  eckSE: [64,0],  eckSW: [96,0],  eckNE: [64,32], eckNW: [96,32],
});

const DUN_CACHE = {};
function bakeDunTile(set, uv){
  const ck = 'd' + set + ',' + uv[0] + ',' + uv[1] + ',' + (uv[2] || '');
  if(DUN_CACHE[ck]) return DUN_CACHE[ck];
  const sheet = SHEETS[uv[2] || DUN_SET[set].key]; if(!sheet) return null;
  const c = makeCanvas(TS, TS), cc = c.getContext('2d');
  cc.imageSmoothingEnabled = false;
  cc.drawImage(sheet.img, uv[0], uv[1], 16, 16, 0, 0, TS, TS);
  DUN_CACHE[ck] = c;
  return c;
}

// Wandkachel: Ringstück je nach Seite mit begehbarem Boden. Die Räume sind
// Rechtecke mit 1 Kachel dickem Rand, deshalb hat eine Wandkachel entweder
// genau eine begehbare Orthogonalseite (Kante) oder nur eine begehbare
// Diagonale (Ecke). Alles andere ist Innenwand und bekommt den Vollblock.
function dunWallTile(set, x, y){
  const ds = DUN_SET[set];
  const n = walkT(x,y-1), e = walkT(x+1,y), s = walkT(x,y+1), w = walkT(x-1,y);
  if(s && !n && !e && !w) return bakeDunTile(set, ds.edgeS);
  if(n && !s && !e && !w) return bakeDunTile(set, ds.edgeN);
  if(e && !n && !s && !w) return bakeDunTile(set, ds.edgeE);
  if(w && !n && !s && !e) return bakeDunTile(set, ds.edgeW);
  if(!n && !e && !s && !w){
    if(walkT(x+1,y+1)) return bakeDunTile(set, ds.eckSE);
    if(walkT(x-1,y+1)) return bakeDunTile(set, ds.eckSW);
    if(walkT(x+1,y-1)) return bakeDunTile(set, ds.eckNE);
    if(walkT(x-1,y-1)) return bakeDunTile(set, ds.eckNW);
  }
  return bakeDunTile(set, ds.wall[tileHash(x,y) % ds.wall.length]);
}
function dunFloorTile(set, x, y){
  const ds = DUN_SET[set];
  return bakeDunTile(set, ds.floor[tileHash(x,y) % ds.floor.length]);
}

// Stabiler Pseudo-Zufall pro Zelle: Neubacken (Levelwechsel) ergibt dasselbe Bild.
const tileHash = (x,y)=> (Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) >>> 0;
// Avalanche-Runde (murmur3-Finalizer). Nur im Boden-Bake (pickCfTile) verbaut —
// die rohen tileHash-Verbraucher (Baumart, Kammer-Wandprops) bleiben unverändert,
// damit deren Streuung nicht mitwandert.
const fmix32 = h => { h^=h>>>16; h=Math.imul(h,0x85ebca6b); h^=h>>>13; h=Math.imul(h,0xc2b2ae35); h^=h>>>16; return h>>>0; };

// Bodenkachel für (x,y): reine Funktion von Map-Inhalt, Kammer- und Levelstatus.
// Herausgelöst aus initFloorGraphics(), damit ein späterer Cache (Chunk- statt
// Vollkarten-Bake) denselben Rumpf pro Zelle statt pro Vollbake aufrufen kann.
function computeTile(x, y){
  const t = T(x,y);
  if(kammer){                                    // Kammer: nur Boden und Wand, kein Biom
    return t === G_WALL ? dunWallTile(kammer.set, x, y) : dunFloorTile(kammer.set, x, y);
  } else if(innen){                              // IN1: Innenraum, warm überfärbtes Kammerblatt
    return innenTile(x, y);
  } else if(currentLevel === 2){                 // Schattenland: echtes Pilzland-Lila statt Umfärbung
    // Der Ozean braucht hier einen EIGENEN Zweig: dieser Ast wird vor jedem
    // Kacheltyp-Test erreicht, sonst würde die Tilgung im Schattenland als
    // begehbar aussehendes Pilzland gemalt (Level 2 teilt sich dieselbe Karte).
    if(t === G_OCEAN) return pickCfTile(CF_TILE.water, x, y, 'shadowDeep');
    return (t===G_PATH || t===G_WALL) ? pickCfTile(CF_TILE.path, x, y, 'shadowDirt') : pickCfTile(CF_TILE.shroom, x, y);
  } else if(t === G_OCEAN){                        // Die Tilgung: offenes Meer, nicht begehbar
    return pickCfTile(CF_TILE.water, x, y, 'tiefsee');
  } else if(t === G_BEACH){                        // Strandsaum, unabhängig vom Band
    return pickCfTile(CF_TILE.path, x, y, 'strand');
  } else if(t === G_PATH || t === G_WALL){         // G_WALL = Dorf-Footprints, backen wie Pfad (F38)
    return pickCfTile(CF_TILE.path, x, y);
  } else if(t === G_ICE){
    // Dieselbe Kachel trägt zwei Bedeutungen: gefrorener Teich im Frostkamm,
    // Tümpel in der Nassablage. Das Band entscheidet, nicht der Kacheltyp.
    return pickCfTile(CF_TILE.water, x, y, biomeAtT(y) === 'sumpf' ? 'moor' : 'ice');
  } else if(t === G_LAVA){                        // reine Optik, begehbar wie Eisteiche
    return pickCfTile(CF_TILE.lava, x, y);
  }
  const b = biomeAtT(y);
  if(b === 'snow')  return pickCfTile(CF_TILE.grass, x, y, 'snow');   // Schneeband: eingefärbtes Gras (kein Schnee-Tileset im Pack)
  if(b === 'sand')  return pickCfTile(CF_TILE.volcano, x, y);
  if(b === 'sumpf') return pickCfTile(CF_TILE.grass, x, y, 'sumpf');
  if(b === 'ruine') return pickCfTile(CF_TILE.path, x, y, 'ruine');
  return pickCfTile(CF_TILE.grass, x, y);
}

// --- Boden-Chunk-Cache (W-Groß) ---------------------------------------------
// Ersetzt das frühere Vollkarten-Canvas (floorCanvas, MW*TS im Quadrat). Statt
// einmalig 6400 (heute) bzw. 102400 (bei MW=320) Kacheln vorzubacken, backt
// dieser Cache nur 8x8-Kachel-Blöcke (256x256px) und immer erst dann, wenn ein
// Block tatsächlich sichtbar wird. Jeder Block bleibt danach exakt wie früher
// das ganze floorCanvas: opak, schwarz grundiert, Kacheln bitgleich darüber —
// Kompositing bleibt identisch, nur der Ausschnitt ist kleiner.
const CH = 8, CHPX = CH * TS;
const CHUNKS_X = Math.ceil(MW / CH), CHUNKS_Y = Math.ceil(MH / CH);
const CHUNK_CAP = 96;                          // ~25MB bei 256x256x4 Byte, weniger als das alte floorCanvas
const chunks = new Map();                      // Schlüssel 'cx,cy' -> Canvas. Map-Reihenfolge = Einfüge-/LRU-Alter.

function bakeChunk(cx, cy){
  const c = makeCanvas(CHPX, CHPX), cc = c.getContext('2d', {alpha: false});
  cc.imageSmoothingEnabled = false;
  cc.fillStyle = '#000'; cc.fillRect(0, 0, CHPX, CHPX);   // gleicher schwarzer Grund wie {alpha:false} vorher
  const x0 = cx * CH, y0 = cy * CH;
  for(let y = y0; y < y0 + CH && y < MH; y++){
    for(let x = x0; x < x0 + CH && x < MW; x++){
      const tile = computeTile(x, y);
      if(tile) cc.drawImage(tile, (x - x0) * TS, (y - y0) * TS);
    }
  }
  return c;
}
function getChunk(cx, cy){
  const key = cx + ',' + cy;
  let c = chunks.get(key);
  if(c !== undefined){ chunks.delete(key); chunks.set(key, c); return c; }   // LRU: ans Ende
  if(!assetsReady) return null;                  // erst backen, wenn Sheets da sind (refreshFloor() holt das nach)
  c = bakeChunk(cx, cy);
  chunks.set(key, c);
  if(chunks.size > CHUNK_CAP) chunks.delete(chunks.keys().next().value);   // älteste (am längsten ungenutzte) raus
  return c;
}
// Ein geänderter Tile kann in dunWallTile()'s 9-Slice-Test (der testet auch die
// Diagonalen, s. dunWallTile oben) das Aussehen ALLER 8 Nachbarn ändern, nicht
// nur der orthogonalen — deshalb wird hier immer die volle Moore-Nachbarschaft
// ungültig gemacht, nicht nur die geänderte Zelle. Nachbarn können in einem
// anderen Chunk liegen als die Zelle selbst; invalidateTile trifft dann genau
// diesen anderen Chunk.
function invalidateTile(x, y){ chunks.delete(Math.floor(x/CH) + ',' + Math.floor(y/CH)); }
function invalidateMoore(x, y){
  for(let dy = -1; dy <= 1; dy++) for(let dx = -1; dx <= 1; dx++) invalidateTile(x+dx, y+dy);
}

// --- Konfetti-Dekale (W-Groß) ------------------------------------------------
// splatConfetti() malte bisher dauerhaft in floorCanvas. Ohne Vollkarten-Canvas
// gibt es dafür keinen Platz mehr — Ringpuffer statt Bodenfarbe, pro Frame
// gegen das Sichtfenster gekappt gezeichnet, alte Krümel fallen beim Nachrücken
// einfach hinten raus. Reset in refreshFloor() entspricht dem alten Verhalten:
// jeder Neubau (Levelwechsel, Kammer, Schicht, Respawn) löschte die Krümel auch
// bisher schon, weil er das ganze Canvas überschrieb.
const DECAL_MAX = 1200;                        // ~150-400 Kills Vorgeschichte je nach Konfettimenge/Kill
const decalX = new Float32Array(DECAL_MAX), decalY = new Float32Array(DECAL_MAX);
const decalW = new Float32Array(DECAL_MAX), decalH = new Float32Array(DECAL_MAX);
const decalCol = new Uint8Array(DECAL_MAX);
let decalN = 0, decalHead = 0;

function refreshFloor(){
  chunks.clear();
  decalN = 0; decalHead = 0;
  bakeMinimap();
}

// bakeMinimap() buk bisher floorCanvas auf 128px herunter — bei MW=320 wäre das
// eine 320:1-Verkleinerung (unlesbar) UND floorCanvas gibt es nicht mehr. Neu:
// ein eigener Farb-Bake über den ganzen MW*MH-Kachelraum (miniFull), unabhängig
// von geladenen Sheets (reine Tile-Farbe, kein Sprite) — deshalb entfällt auch
// der alte "Assets noch nicht da"-Sonderfall. renderMinimap() blittet daraus ein
// spielerzentriertes Fenster (MINI_SPAN Kacheln) statt der ganzen Karte.
// Bewusst hier oben (vor genMap()): refreshFloor() ruft bakeMinimap() bereits
// beim Kartenbau (genMap() läuft synchron beim Skriptstart) — eine spätere
// const-Deklaration von miniFullCtx wäre ein TDZ-Fehler, exakt wie beim
// Kammer-Zustand oben (:1659).
// Monsterkatalog M1: Felsen nehmen die Farbe ihres Bandes an. Sandstein in der
// Wüste, Reif im Frostkamm, moosig im Sumpf, verrußt im Altbestand.
const FELS_TINT = {sand:'#d9b070', snow:'#dfeeff', sumpf:'#7a8f5a', ruine:'#b0a89e', grass:null};
const MINI_COL = {
  schnee: [214,232,246], eis: [176,214,238], gras: [62,124,72], sand: [206,178,116],
  sumpf: [58,84,52], moor: [42,62,48], ruine: [126,120,114],
  vulkan: [176,92,46], lava: [168,64,32], pfad: [150,132,104], wand: [90,80,70],
  pilz: [90,50,110], schattenpfad: [58,30,74],
  meer: [26,44,86], schattenmeer: [16,6,34], strand: [222,204,150],
};
function miniColorFor(x, y){
  const t = T(x,y);
  if(kammer) return t === G_WALL ? MINI_COL.wand : MINI_COL.pfad;
  // IN1: Möbel (G_BLOCK) zählen auf der Karte als Wand. Ein Regal, durch das
  // die Karte einen Weg zeigt, wäre eine falsche Auskunft.
  if(innen) return (t === G_WALL || t === G_BLOCK) ? MINI_COL.wand : MINI_COL.pfad;
  if(currentLevel === 2){
    if(t === G_OCEAN) return MINI_COL.schattenmeer;
    return (t===G_PATH || t===G_WALL) ? MINI_COL.schattenpfad : MINI_COL.pilz;
  }
  if(t === G_OCEAN) return MINI_COL.meer;
  if(t === G_BEACH) return MINI_COL.strand;
  if(t === G_PATH || t === G_WALL) return MINI_COL.pfad;
  const b = biomeAtT(y);
  if(t === G_ICE) return b === 'sumpf' ? MINI_COL.moor : MINI_COL.eis;
  if(t === G_LAVA) return MINI_COL.lava;
  if(b === 'snow')  return MINI_COL.schnee;
  if(b === 'sand')  return MINI_COL.vulkan;
  if(b === 'sumpf') return MINI_COL.sumpf;
  if(b === 'ruine') return MINI_COL.ruine;
  return MINI_COL.gras;
}
const miniFull = document.createElement('canvas');
miniFull.width = MW; miniFull.height = MH;
const miniFullCtx = miniFull.getContext('2d');

function bakeMinimap(){
  const id = miniFullCtx.createImageData(MW, MH), data = id.data;
  for(let y = 0; y < MH; y++){
    for(let x = 0; x < MW; x++){
      const col = miniColorFor(x, y), i = (x + y*MW) * 4;
      data[i] = col[0]; data[i+1] = col[1]; data[i+2] = col[2]; data[i+3] = 255;
    }
  }
  miniFullCtx.putImageData(id, 0, 0);
}

// Kacheln im 128px-Fenster. 96 in 128px ≈ dieselbe Informationsdichte wie
// früher (80 Kacheln in 128px) — bei MW=MH=80 (heute) klemmt span unten auf
// die Kartengröße, das Fenster zeigt dann die ganze Karte wie bisher.
const MINI_SPAN = 96;
let miniCtx = null;
function renderMinimap(){
  if(!miniCtx){ miniCtx = el('minimap').getContext('2d'); miniCtx.imageSmoothingEnabled = false; }
  const mctx = miniCtx;
  const span = Math.min(MINI_SPAN, MW, MH);
  const sx0 = clamp(Math.floor(player.x/TS) - Math.floor(span/2), 0, Math.max(0, MW - span));
  const sy0 = clamp(Math.floor(player.y/TS) - Math.floor(span/2), 0, Math.max(0, MH - span));
  const scale = 128 / span;
  mctx.clearRect(0, 0, 128, 128);
  mctx.drawImage(miniFull, sx0, sy0, span, span, 0, 0, 128, 128);
  // Marker in Fensterkoordinaten. clampToEdge=true zeigt bei Zielen außerhalb des
  // Fensters (Kessel, Portal, Truhe) eine Richtung am Rand, statt sie einfach
  // verschwinden zu lassen — sonst wäre der Kessel auf großer Karte unauffindbar.
  const mark = (wx, wy, size, fill, clampToEdge) => {
    let px = (wx/TS - sx0) * scale, py = (wy/TS - sy0) * scale;
    const out = px < 0 || px > 128 || py < 0 || py > 128;
    if(out){ if(!clampToEdge) return; px = clamp(px, 3, 125); py = clamp(py, 3, 125); }
    mctx.fillStyle = fill; mctx.fillRect(px - size/2, py - size/2, size, size);
  };
  for(const m of monsters) if(!m.dead) mark(m.x, m.y, 2, 'rgba(255,80,80,.85)', false);
  if(currentLevel === 1){
    mark((VILLAGE.x0+VILLAGE.x1)/2*TS, (VILLAGE.y0+VILLAGE.y1)/2*TS, 4, '#ffd76a', true);   // Dorf-Marker (neu, W-Groß)
    mark(KESSEL.x, KESSEL.y, 3, '#6aff8f', true);
  }
  mark(player.x, player.y, 3, '#5c86ff', false);   // Spieler ist per Definition immer im Fenster
  if(portal) mark(portal.x, portal.y, 4, '#ff00ff', true);
  // Wirkung 'Aktenlage': ungeöffnete Truhe bzw. Kammertüren auf der Karte
  if(FX.karte){
    if(kammer && kammer.truhe && !kammer.truhe.auf) mark(kammer.truhe.x, kammer.truhe.y, 4, '#f4d97a', true);
    else if(currentLevel === 1) for(const t of kammerTueren) if(t.cd <= 0) mark(t.x, t.y, 3, '#f4d97a', false);
  }
}

function genMap(){
  trees = []; map.fill(G_GRASS);
  for(let y=0;y<MH;y++){
    for(let x=0;x<MW;x++){
      const b0 = biomeAtT(y);
      setT(x, y, b0 === 'snow' ? G_SNOW : (b0 === 'sand' ? G_SAND : G_GRASS));
    }
  }
  // (W-Groß entfernt: ein SPAWN->ARENA-Pfadlauf stand hier, war aber seit jeher
  // wirkungslos — SPAWN.x/TS = 12.5 blieb durch ri(-1,1)/Math.sign()/clamp() für
  // immer gebrochen, setT() auf einem Uint8Array verpuffte an jeder Bruchzahl
  // still, und die Abbruchbedingung px===ARENA.x griff nie. 5000 Leerläufe,
  // keine einzige geschriebene Kachel — das Dorf-Rechteck weiter unten ist und
  // war der einzige echte G_PATH-Ursprung der Oberwelt.)
  for(let y=2;y<MH-2;y++){
    for(let x=2;x<MW-2;x++){
      const t = T(x,y); if(t===G_PATH) continue;
      const r = rng();
      const b1 = biomeAtT(y);
      if(b1 === 'snow'){ if(r < 0.08) setT(x,y,G_ICE_TREE); }
      else if(b1 === 'sand'){ if(r < 0.06) setT(x,y,G_CACTUS); else if(r < 0.10) setT(x,y,G_ROCK); }
      // Nassablage: viel Schilf, wenige Bäume. Das hohe Gras ist hier kein
      // Beiwerk, sondern Deckung, die Blubberakte lauert darin.
      else if(b1 === 'sumpf'){ if(r < 0.04) setT(x,y,G_TREE); else if(r < 0.34) setT(x,y,G_TALL); else if(r < 0.37) setT(x,y,G_ROCK); }
      // Altbestand: Trümmer statt Bewuchs. Fast nur Fels, ein paar tote Bäume.
      else if(b1 === 'ruine'){ if(r < 0.02) setT(x,y,G_TREE); else if(r < 0.06) setT(x,y,G_TALL); else if(r < 0.20) setT(x,y,G_ROCK); }
      else { if(r < 0.08) setT(x,y,G_TREE); else if(r < 0.22) setT(x,y,G_TALL); else if(r < 0.25) setT(x,y,G_ROCK); }
    }
  }
  // Gefrorene Teiche: zusammenhängende Flecken statt einzelner Kacheln (nur Optik,
  // begehbar). Zahl W-Groß 26 -> 300 (~x12, bewusst etwas unter den x16 der Fläche,
  // sonst wirkt die Karte schachbrettartig statt organisch — GEGENPROBE-W).
  const EIS_TEICHE_N = 300, [EIS_CY0, EIS_CY1] = bandRange('snow', 4);
  for(let n=0;n<EIS_TEICHE_N;n++){
    // R statt rr: rr hängt an Math.random und lief damit AUSSERHALB des gesiegelten
    // Stroms. Der Radius entschied aber mit, wie viele G_ICE_TREE-Kacheln zu
    // begehbarem Eis werden — die Karte war deshalb bei gleichem Startwert von
    // Laden zu Laden verschieden (gemessen: begehbare Schneekacheln 24592 gegen
    // 24189 bei zwei Läufen mit 20260805). Ein Kartenfehlerbericht war so nie
    // nachstellbar. Gleiche Regel wie umgekehrt bei auftragLohn(), nur in die
    // andere Richtung: Welt = ri/R, Laufzeit = rr/rri.
    const cx = ri(5, MW-6), cy = ri(EIS_CY0, EIS_CY1), rad = R(1.6, 3.2);
    for(let y=Math.floor(cy-rad); y<=Math.ceil(cy+rad); y++){
      for(let x=Math.floor(cx-rad); x<=Math.ceil(cx+rad); x++){
        if(!inB(x,y) || biomeAtT(y) !== 'snow') continue;
        if(T(x,y) !== G_SNOW && T(x,y) !== G_ICE_TREE) continue;   // Bäume weichen dem Teich
        if(Math.hypot(x-cx, y-cy) > rad - rng()*0.7) continue;
        setT(x,y,G_ICE);
      }
    }
  }
  // Lavatümpel im Wüstenband: reine Optik, begehbar (Nutzerentscheidung), gleiches
  // Fleck-statt-Einzelkachel-Muster wie die Eisteiche oben, kleinerer Radius.
  // Zahl W-Groß 16 -> 180 (gleiches ~x12-Verhältnis wie bei den Eisteichen).
  const LAVA_TUEMPEL_N = 180, [LAVA_CY0, LAVA_CY1] = bandRange('sand', 1);
  for(let n=0;n<LAVA_TUEMPEL_N;n++){
    const cx = ri(5, MW-6), cy = ri(LAVA_CY0, LAVA_CY1), rad = R(1.0, 2.0);   // R statt rr, siehe Eisteiche
    for(let y=Math.floor(cy-rad); y<=Math.ceil(cy+rad); y++){
      for(let x=Math.floor(cx-rad); x<=Math.ceil(cx+rad); x++){
        if(!inB(x,y) || biomeAtT(y) !== 'sand') continue;
        if(T(x,y) !== G_SAND && T(x,y) !== G_CACTUS) continue;   // Felsen bleiben stehen
        if(Math.hypot(x-cx, y-cy) > rad - rng()*0.7) continue;
        setT(x,y,G_LAVA);
      }
    }
  }
  // Tümpel in der Nassablage: dasselbe Fleck-Muster wie Eisteiche und Lava, nur
  // im Sumpfband und mit G_ICE als Kacheltyp, computeTile färbt ihn dort als
  // Moorwasser statt als Eis (s. dort). Begehbar, wie die anderen beiden auch.
  const TUEMPEL_N = 240, [TUE_CY0, TUE_CY1] = bandRange('sumpf', 1);
  for(let n=0;n<TUEMPEL_N;n++){
    const cx = ri(5, MW-6), cy = ri(TUE_CY0, TUE_CY1), rad = R(1.2, 2.6);   // R statt rr, siehe Eisteiche
    for(let y=Math.floor(cy-rad); y<=Math.ceil(cy+rad); y++){
      for(let x=Math.floor(cx-rad); x<=Math.ceil(cx+rad); x++){
        if(!inB(x,y) || biomeAtT(y) !== 'sumpf') continue;
        if(T(x,y) !== G_GRASS && T(x,y) !== G_TALL) continue;   // Bäume und Fels bleiben stehen
        if(Math.hypot(x-cx, y-cy) > rad - rng()*0.7) continue;
        setT(x,y,G_ICE);
      }
    }
  }
  // Dorf-Rechteck komplett freiräumen (vorher nur der 5x4-Kessel-Anger), sonst
  // wächst der Streuung von oben ein Baum ins Gebäude. Muss vor dem Baum-Sammel-
  // Loop und dem Deko-Streu-Loop unten passieren (Regressionsordnung wie bisher).
  for(let y=VILLAGE.y0; y<=VILLAGE.y1; y++)
    for(let x=VILLAGE.x0; x<=VILLAGE.x1; x++) setT(x,y,G_PATH);
  // Gebäude-Footprints blockieren (G_WALL, s. VILLAGE_BUILDINGS oben). WALKABLE ist
  // eine Whitelist, G_WALL steht nicht drin — bereits ausreichend für Kollision.
  // computeTile() backt G_WALL in der Oberwelt wie G_PATH: die Sprites sind
  // schmaler als ihr Footprint (das Amt lässt 18px links frei, F38), das Gebäude
  // deckt die Kachel also NICHT vollständig ab.
  for(const b of VILLAGE_BUILDINGS)
    for(let y=b.y0; y<b.y0+b.h; y++)
      for(let x=b.x0; x<b.x0+b.w; x++) setT(x,y,G_WALL);
  // W-Lager: gleiche Reihenfolge und derselbe Grund wie beim Dorf-Rechteck oben —
  // erst freiraeumen, dann blockieren, beides vor dem Baum- und Deko-Streuloop.
  for(let y=LAGER.y0; y<=LAGER.y1; y++)
    for(let x=LAGER.x0; x<=LAGER.x1; x++) setT(x,y,G_PATH);
  for(let x=LAGER.x0; x<=LAGER.x1; x++){
    setT(x, LAGER.y0, G_WALL);
    if(x < LAGER_TOR_X || x > LAGER_TOR_X+2) setT(x, LAGER.y1, G_WALL);
  }
  for(let y=LAGER.y0; y<=LAGER.y1; y++){ setT(LAGER.x0, y, G_WALL); setT(LAGER.x1, y, G_WALL); }
  // === W-Groß: Küste statt Rechteckrahmen ===================================
  // Hier stand bis W-Groß ein 2 Kacheln dicker Baumrahmen um die ganze Welt.
  // Der Platz im Ablauf ist bewusst genau dieser: NACH der Vegetationsstreuung
  // (die schützt nur G_PATH — liefe die Küste vorher, stünden Bäume, Felsen und
  // Kakteen im offenen Meer) und VOR der trees/decos/critters/npcs-Sammlung
  // unten (sonst schwebten Sprites auf neuem Wasser und Viecher könnten in einer
  // Tasche eingeschlossen werden, die danach geflutet wird).

  // (1) Form der Küste: je Kante EINE Einrückungsfunktion über die Längskoordinate,
  // als Summe dreier Sinus. Bewusst kein 2D-Rauschen: weil die Einrückung nur von
  // einer Koordinate abhängt, ist jede Spalte ein einziger zusammenhängender
  // senkrechter Landlauf und jede Zeile ein waagerechter. Die Landmasse kann sich
  // damit konstruktionsbedingt nicht abschnüren, und die drei Biombänder bleiben
  // als breite Zonen lesbar. Maximale Einrückung 10+14+7+3 = 34 Kacheln.
  const K_BASIS = 10, K_AMP = [14, 7, 3], K_PER = [MW/1.5, MW/5, MW/16];
  const kPhase = ()=> [R(0, Math.PI*2), R(0, Math.PI*2), R(0, Math.PI*2)];
  const phNord = kPhase(), phSued = kPhase(), phWest = kPhase(), phOst = kPhase();
  const einrueckung = (u, ph)=> Math.max(2, K_BASIS
    + K_AMP[0]*Math.sin(2*Math.PI*u/K_PER[0] + ph[0])
    + K_AMP[1]*Math.sin(2*Math.PI*u/K_PER[1] + ph[1])
    + K_AMP[2]*Math.sin(2*Math.PI*u/K_PER[2] + ph[2]));
  for(let y=0;y<MH;y++){
    const west = einrueckung(y, phWest), ost = einrueckung(y, phOst);
    for(let x=0;x<MW;x++){
      const nord = einrueckung(x, phNord), sued = einrueckung(x, phSued);
      if(x < west || x > MW-1-ost || y < nord || y > MH-1-sued) setT(x, y, G_OCEAN);
    }
  }

  // (2) Buchten: ausschliesslich KONVEXE Ellipsen, aus dem Land geschnitten. Eine
  // konvexe Form kann die Landmasse nicht trennen und kein Monster einklemmen —
  // aus einer konvexen Bucht läuft man geradeaus wieder heraus. L-Formen, Haken
  // und schmale Fjorde sind hier verboten: das Spiel hat keinerlei Wegfindung
  // (Monster steuern per atan2 auf den Spieler zu), solche Geometrie wäre die
  // klassische Falle, in der ein Verfolger endgültig hängen bliebe.
  for(let n=0; n<ri(6,10); n++){
    const kante = ri(0,3);                       // 0 Nord, 1 Süd, 2 West, 3 Ost
    const laengs = ri(20, (kante<2 ? MW : MH)-21);
    const halbLaengs = R(8,18), halbTief = R(12,30);
    let cx, cy, ax, ay;
    if(kante === 0){ cx=laengs; cy=einrueckung(laengs,phNord);      ax=halbLaengs; ay=halbTief; }
    else if(kante === 1){ cx=laengs; cy=MH-1-einrueckung(laengs,phSued); ax=halbLaengs; ay=halbTief; }
    else if(kante === 2){ cy=laengs; cx=einrueckung(laengs,phWest);      ax=halbTief;   ay=halbLaengs; }
    else { cy=laengs; cx=MW-1-einrueckung(laengs,phOst);                 ax=halbTief;   ay=halbLaengs; }
    for(let y=Math.floor(cy-ay); y<=Math.ceil(cy+ay); y++){
      for(let x=Math.floor(cx-ax); x<=Math.ceil(cx+ax); x++){
        if(!inB(x,y) || inVillageT(x,y)) continue;
        const dx=(x-cx)/ax, dy=(y-cy)/ay;
        if(dx*dx + dy*dy <= 1) setT(x, y, G_OCEAN);
      }
    }
  }

  // (3) Inseln vor der Küste: reine Optik. Der Spieler kann nicht schwimmen, eine
  // erreichbare Insel bräuchte eine Landbrücke — und eine Landbrücke ist ein
  // Korridor, also genau die Geometrie, die ohne Wegfindung gefährlich ist.
  // Deshalb: sichtbar, aber von JEDEM Setzer ausgespart (s. reachbar()).
  inselMaske.fill(0);
  for(let n=0; n<ri(4,8); n++){
    for(let versuch=0; versuch<200; versuch++){
      const cx = ri(6, MW-7), cy = ri(6, MH-7), rad = R(3, 8);
      if(T(cx,cy) !== G_OCEAN) continue;
      // Nur im offenen Meer, mindestens 4 Kacheln von jedem Land entfernt.
      let freiRundum = true;
      for(let y=Math.floor(cy-rad-4); y<=Math.ceil(cy+rad+4) && freiRundum; y++)
        for(let x=Math.floor(cx-rad-4); x<=Math.ceil(cx+rad+4); x++)
          if(inB(x,y) && T(x,y) !== G_OCEAN){ freiRundum = false; break; }
      if(!freiRundum) continue;
      const bandTyp = biomeAtT(cy) === 'snow' ? G_SNOW : (biomeAtT(cy) === 'sand' ? G_SAND : G_GRASS);
      for(let y=Math.floor(cy-rad); y<=Math.ceil(cy+rad); y++){
        for(let x=Math.floor(cx-rad); x<=Math.ceil(cx+rad); x++){
          if(!inB(x,y)) continue;
          if(Math.hypot(x-cx, y-cy) > rad - rng()*0.8) continue;
          setT(x, y, bandTyp); inselMaske[x+y*MW] = 1;
        }
      }
      break;
    }
  }

  // (4) Harter Kartenrand: die äußersten 2 Kacheln sind immer Meer. Die Kamera ist
  // in der Oberwelt nicht geklemmt, man sieht also über die Kante hinaus — deshalb
  // färbt render() den Hintergrund dort ebenfalls tiefseeblau statt schwarz.
  for(let i=0;i<Math.max(MW,MH);i++) for(let b=0;b<2;b++){
    if(i<MW){ setT(i,b,G_OCEAN); setT(i,MH-1-b,G_OCEAN); }
    if(i<MH){ setT(b,i,G_OCEAN); setT(MW-1-b,i,G_OCEAN); }
  }

  // (5) Strand: Land bis 2 Kacheln ans Meer wird Sand, im Schneeband Eis. Das ist
  // der Schritt, der die Küste absichtsvoll aussehen lässt statt abgeschnitten.
  {
    const strand = [];
    for(let y=0;y<MH;y++) for(let x=0;x<MW;x++){
      if(T(x,y) === G_OCEAN) continue;
      let nahMeer = false;
      for(let dy=-2; dy<=2 && !nahMeer; dy++) for(let dx=-2; dx<=2; dx++)
        if(inB(x+dx,y+dy) && T(x+dx,y+dy) === G_OCEAN){ nahMeer = true; break; }
      if(nahMeer) strand.push(x, y);
    }
    for(let i=0;i<strand.length;i+=2){
      const x = strand[i], y = strand[i+1];
      if(inVillageT(x,y)) continue;
      // Im Schnee gefrorenes Ufer, sonst Sandsaum. Das Sandband bekommt keinen
      // eigenen Saum: dort trifft ohnehin Wüste aufs Meer, ein zweiter Sandton
      // wäre nur ein Streifen ohne Aussage.
      if(biomeAtT(y) === 'snow') setT(x, y, G_ICE);
      else if(biomeAtT(y) !== 'sand') setT(x, y, G_BEACH);
    }
  }

  // (6) Zusammenhang beweisen, nicht hoffen. Flutfüllung ab SPAWN über alles, was
  // NICHT Meer ist — bewusst topologisch und nicht über WALKABLE: die 8-25%
  // Vegetationsstreuung zählt sonst als Wand, und ein einziger Baum, der eine
  // Landenge verstopft, würde die ganze Halbinsel dahinter löschen (still, und bei
  // jedem Startwert anders). Alles, was die Flut nicht erreicht und keine Deko-Insel
  // ist, wird Meer — das räumt zugleich versehentliche Lagunen weg.
  // Datenstrukturen bewusst festgenagelt: bei 102400 Zellen wäre eine Warteschlange
  // mit .shift() quadratisch (Sekunden eingefrorener Tab), ein Set von Schlüsseln
  // kostete Megabyte. Uint8Array-Maske + Int32Array-Ring mit Kopfindex: ~0,4 MB.
  {
    landmasse.fill(0);
    const schlange = new Int32Array(MW*MH);
    let kopf = 0, ende = 0;
    const start = Math.floor(SPAWN.x/TS) + Math.floor(SPAWN.y/TS)*MW;
    landmasse[start] = 1; schlange[ende++] = start;
    while(kopf < ende){
      const i = schlange[kopf++], x = i % MW, y = (i / MW) | 0;
      if(x > 0      && !landmasse[i-1]  && T(x-1,y) !== G_OCEAN){ landmasse[i-1]  = 1; schlange[ende++] = i-1; }
      if(x < MW-1   && !landmasse[i+1]  && T(x+1,y) !== G_OCEAN){ landmasse[i+1]  = 1; schlange[ende++] = i+1; }
      if(y > 0      && !landmasse[i-MW] && T(x,y-1) !== G_OCEAN){ landmasse[i-MW] = 1; schlange[ende++] = i-MW; }
      if(y < MH-1   && !landmasse[i+MW] && T(x,y+1) !== G_OCEAN){ landmasse[i+MW] = 1; schlange[ende++] = i+MW; }
    }
    let geflutet = 0;
    for(let y=0;y<MH;y++) for(let x=0;x<MW;x++){
      const i = x+y*MW;
      if(landmasse[i] || inselMaske[i] || T(x,y) === G_OCEAN) continue;
      setT(x, y, G_OCEAN); geflutet++;
    }
    // Nachweis in die Konsole: wie viel begehbares Land trägt jedes Band? Ein Band
    // mit 0 wäre sofort ein Fehler (kein Aushang, keine Kammertür dort erfüllbar).
    const proBand = {};
    for(const b of BIOME_BANDS) proBand[b.key] = 0;
    for(let y=0;y<MH;y++) for(let x=0;x<MW;x++) if(reachbar(x,y)) proBand[biomeAtT(y)]++;
    console.log('Weltform: erreichbare Kacheln je Band', proBand, '| abgeschnittenes Land geflutet:', geflutet);
    // Schwelle bandproportional statt Handzahl. Die alten 500 stammen aus MH=80,
    // wo ein Band 2000 bis 2320 Kacheln hatte — also rund ein Viertel. Bei MH=320
    // sind 500 noch 1,5 Prozent eines Bandes: der Wächter hätte 98 Prozent
    // Landverlust verschwiegen. Ein Viertel hält die alte Absicht und hängt an MH,
    // wie SNOW_Y1/SAND_Y0 weiter oben. Gemessen über sechs Startwerte (20260805,
    // 20260721, 1, 424242, 11111111, 987654321): der kleinste Istwert war 20760
    // (Sand, 64,9 Prozent), der strengste Sollwert ist 8000 — Abstand Faktor 2,6.
    for(const b of BIOME_BANDS){
      const soll = Math.round((b.y1 - b.y0 + 1) * MW * 0.25);
      if(proBand[b.key] < soll)
        console.error('Weltform: Band zu klein, Aufträge dort unerfüllbar',
                      b.key, proBand[b.key], 'von mindestens', soll);
    }
  }
  for(let y=0;y<MH;y++) for(let x=0;x<MW;x++) {
    const t = T(x,y);
    if(t===G_TREE || t===G_ICE_TREE || t===G_CACTUS || t===G_ROCK)
      // sp wählt bei G_TREE die Art (Eiche/Birke) und bei G_CACTUS die
      // Wuchsvariante der Vulkanpflanze — eigenes Hash-Bit, damit es nicht mit
      // variant (Frame innerhalb der Art) koppelt.
      trees.push({x:x*TS+TS/2, y:y*TS+TS-2, type:t, phase:rng()*10, variant:(x+y)&1, sp:(tileHash(x,y)>>>2)&1});
  }

  // --- Deko: Pilze und hohes Gras auf begehbarem Grund, rein optisch ---------
  decos.length = 0;
  for(let y=3;y<MH-3;y++) for(let x=3;x<MW-3;x++){
    if(!reachbar(x,y) || T(x,y)===G_PATH) continue;   // W-Groß: keine Deko auf Deko-Inseln
    const t = T(x,y);
    // Neu in G4: hohes Gras bekommt erstmals ein Sprite (Nutzerentscheidung) —
    // sparsam gestreut (~1/6 der G_TALL-Kacheln), nicht jede einzelne.
    if(t === G_TALL){
      if(rng() > 0.16) continue;
      decos.push({x:x*TS+TS/2, y:y*TS+TS-2, sheet:'cftallgrass', phase:rng()*10, scale:WELT_SC});
      continue;
    }
    if(rng() > 0.022) continue;
    const bd = biomeAtT(y);
    if(bd === 'sand' || bd === 'ruine') continue;          // Wüste und Altbestand bleiben karg
    decos.push({x:x*TS+TS/2, y:y*TS+TS-4, sheet:rng()<0.5?'cfmush1':'cfmush2',
                phase:rng()*10, scale:WELT_SC});
  }
  // Windmühle als Landmarke, ostwärts neben dem Dorf (G5 hat das alte (19,36)
  // ans neue Markt-Gebäude verloren — s. VILLAGE_BUILDINGS, Umsetzungsnotizen G5).
  // G7: von (26,38) nach (38,30). Bei 26 stand sie ab jetzt mitten in den
  // Marktständen (die reichen bis x=33) — sie steht weiter ostwärts neben dem
  // Dorf, nur ist "neben dem Dorf" zwölf Kacheln weiter draußen als vorher.
  // Zwischen Dorfkante (34) und Lagerpalisade (44) bleibt sie frei stehen.
  decos.push({x:(38+DORF_DX)*TS, y:(30+DORF_DY)*TS, sheet:'cfwindmill', phase:0, scale:WELT_SC, big:true});
  // G5: Dorf-Gebäude als 'big'-Decos, Fußanker Mitte der Südkante des Footprints
  // (gleiche Konvention wie jede andere Fußpunkt-Prop hier).
  for(const b of VILLAGE_BUILDINGS){
    decos.push({x:(b.x0 + b.w/2)*TS, y:(b.y0 + b.h)*TS - 2, sheet:b.sheet, phase:0, scale:WELT_SC, big:true});
  }
  // W-Lager: Palisade rundum, Tor in der Luecke, Ausstattung innen. Fussanker ist
  // die Kachelunterkante, gleiche Konvention wie bei jeder anderen Fusspunkt-Prop.
  {
    // Skalierung WELT_SC: die MilitaryCamp-Blaetter sind 16-Pixel-Kunst wie die
    // Tiles-Saetze (der Palisadenring misst 3x5 Kacheln in 48x80 Pixeln). Ohne die
    // 2 steht die Palisade mit einer halben Kachel Luecke je Pfahl.
    // G7-Nachtrag: hier stand, die G5-Gebaeude laegen "schon in 32 Pixeln je
    // Kachel vor und bleiben deshalb 1". Das war die falsche Annahme, die G7
    // ausgeloest hat — auch die Haeuser sind 16-Pixel-Kunst. Das Lager war der
    // einzige Ort, der von Anfang an richtig gerechnet hat, und ist der Grund,
    // warum der Groessenunterschied ueberhaupt aufgefallen ist.
    const lp = (tx, ty, sheet, ph) => decos.push({x:tx*TS + TS/2, y:(ty+1)*TS, sheet, phase:ph||0, scale:WELT_SC, big:true});
    for(let x=LAGER.x0; x<=LAGER.x1; x++){
      lp(x, LAGER.y0, 'camp_palisade');
      if(x < LAGER_TOR_X || x > LAGER_TOR_X+2) lp(x, LAGER.y1, 'camp_palisade');
    }
    for(let y=LAGER.y0+1; y<LAGER.y1; y++){ lp(LAGER.x0, y, 'camp_palisade'); lp(LAGER.x1, y, 'camp_palisade'); }
    lp(LAGER_TOR_X + 1, LAGER.y1, 'camp_gate');
    // Zwei Wachtuerme an den Nordecken, drei Zelte in der Nordhaelfte, Banner
    // links und rechts vom Tor, der Kessel in der Mitte. Katapult und Kanone
    // bleiben draussen: Belagerungsgeraet behauptet, dass etwas passiert.
    lp(LAGER.x0 + 2, LAGER.y0 + 3, 'camp_tower');
    lp(LAGER.x1 - 2, LAGER.y0 + 3, 'camp_tower');
    for(const tx of [LAGER.x0 + 6, LAGER.x0 + 11, LAGER.x0 + 15]) lp(tx, LAGER.y0 + 6, 'camp_tent');
    lp(LAGER_TOR_X - 2, LAGER.y1 - 1, 'camp_banner', 0.4);
    lp(LAGER_TOR_X + 4, LAGER.y1 - 1, 'camp_banner', 1.7);
    lp(Math.round((LAGER.x0+LAGER.x1)/2), LAGER.y0 + 8, 'camp_pot', 0.9);
  }
  // --- G11: Die Koppel ------------------------------------------------------
  //
  // Der Weidegürtel hatte achtzehn Tiere und keine Umzäunung. Ein Zaun allein
  // wäre allerdings eine Behauptung gewesen: Ambiente-Tiere kollidieren mit
  // nichts und wären mitten hindurchspaziert. Deshalb kommt der Zaun nicht
  // allein, sondern mit der Leine — die Tiere in der Koppel bekommen sie als
  // Grenze (s. die Critter-Schleife in update()).
  //
  // Der Platz wird gesucht und nicht gesetzt. Die Karte entsteht prozedural,
  // eine feste Kachel läge je nach Lauf im Wasser oder im Wald. Gesucht wird
  // zeilenweise über den Weidegürtel, das erste passende Rechteck gewinnt —
  // deterministisch, ohne rng(), damit zwei Läufe dieselbe Koppel bauen.
  KOPPEL = null;
  {
    const KW = 10, KH = 7;                     // Kacheln, innen 8x5
    // Zwei Anforderungen statt einer, und der Unterschied ist gemessen: über den
    // Weidegürtel (82x67) sind 64 Prozent der Kacheln frei, aber das größte
    // durchgehend freie Rechteck misst **28x2**. 1253 Kachelen sind Weg, 700
    // Baum oder Fels. Eine Koppel, die überall frei sein muss, gibt es auf
    // dieser Karte nicht — und es wäre auch die falsche Forderung.
    //
    //   Der Rand muss frei sein. Ein Zaunpfahl im Baum sieht aus wie ein Fehler,
    //   ein Zaun über einem Weg sperrt eine Straße, die keiner gesperrt hat.
    //   Die Fläche darf tragen, was auf einer Weide steht. Ein Baum in der
    //   Koppel ist ein Schattenspender; die Tiere prallen an ihm ab wie an
    //   jedem anderen Hindernis, dafür sorgt walkPx() in der Critter-Schleife.
    //   Nur Wasser ist ausgeschlossen: ein eingezäunter Teich ist kein Gehege.
    const ausserhalb = (tx, ty) => !inVillageT(tx, ty)
                       && !(tx >= LAGER.x0-1 && tx <= LAGER.x1+1 && ty >= LAGER.y0-1 && ty <= LAGER.y1+1);
    const randFrei  = (tx, ty) => walkT(tx, ty) && reachbar(tx, ty) && T(tx, ty) !== G_PATH && ausserhalb(tx, ty);
    const innenFrei = (tx, ty) => inB(tx, ty) && T(tx, ty) !== G_PATH && T(tx, ty) !== G_OCEAN && ausserhalb(tx, ty);
    const passt = (tx, ty) => {
      for(let y = ty; y < ty+KH; y++) for(let x = tx; x < tx+KW; x++){
        const rand = (y === ty || y === ty+KH-1 || x === tx || x === tx+KW-1);
        if(!(rand ? randFrei(x, y) : innenFrei(x, y))) return false;
      }
      // Mindestens die Hälfte der Fläche muss begehbar sein, sonst ist es keine
      // Weide, sondern ein eingezäuntes Wäldchen.
      let begehbar = 0, ges = 0;
      for(let y = ty+1; y < ty+KH-1; y++) for(let x = tx+1; x < tx+KW-1; x++){ ges++; if(walkT(x, y)) begehbar++; }
      return begehbar * 2 >= ges;
    };
    // Nicht das erste passende Rechteck, sondern das dorfnächste. Der erste
    // Lauf nahm zeilenweise von oben links und stellte die Koppel sechzehn
    // Reihen nördlich des Dorfes zwischen Frostgeister und eine Kammertür —
    // im Gürtel, gewiss, aber keine Weide, sondern Wildnis mit Zaun.
    const mx = (VILLAGE.x0 + VILLAGE.x1) / 2, my = (VILLAGE.y0 + VILLAGE.y1) / 2;
    let bestD = Infinity;
    for(let ty = VILLAGE.y0-16; ty <= VILLAGE.y1+16-KH; ty++)
      for(let tx = VILLAGE.x0-22; tx <= VILLAGE.x1+22-KW; tx++){
        const cx = tx + KW/2 - mx, cy = ty + KH/2 - my;
        const d = cx*cx + cy*cy;
        if(d >= bestD) continue;                 // spart den teuren Flächentest
        if(!passt(tx, ty)) continue;
        bestD = d;
        KOPPEL = {x0:tx, y0:ty, x1:tx+KW-1, y1:ty+KH-1, torX:tx + (KW>>1) - 1};
      }
  }
  if(KOPPEL){
    const K = KOPPEL;
    const kp = (tx, ty, sheet) => decos.push({x:tx*TS + TS/2, y:(ty+1)*TS, sheet, phase:0, scale:WELT_SC, big:true});
    kp(K.x0, K.y0, 'cffence_tl'); kp(K.x1, K.y0, 'cffence_tr');
    kp(K.x0, K.y1, 'cffence_bl'); kp(K.x1, K.y1, 'cffence_br');
    for(let x = K.x0+1; x < K.x1; x++){
      kp(x, K.y0, 'cffence_h');
      // Das Tor ist eine Lücke von zwei Kacheln in der Südkante, dem Dorf
      // zugewandt. Ein eigenes Torblatt gibt es im Pack nur für den grossen
      // Zaun (Fence_Big_Gate), und der ist eine andere Bauart.
      if(x !== K.torX && x !== K.torX+1) kp(x, K.y1, 'cffence_h');
    }
    for(let y = K.y0+1; y < K.y1; y++){ kp(K.x0, y, 'cffence_v'); kp(K.x1, y, 'cffence_v'); }
  }

  // --- G11: Das Schild am Amt -----------------------------------------------
  // Ein Amt ohne Beschilderung ist eine verpasste Gelegenheit. Es steht neben
  // der Tür, auf der begehbaren Kachel links davon, und verdeckt nichts: 16x32
  // Blattpixel, also eine Kachel breit und zwei hoch.
  {
    const b = VILLAGE_BUILDINGS.find(b => b.amt);
    const stx = b.x0 + 2, sty = b.y0 + b.h;
    if(walkT(stx, sty)) decos.push({x:stx*TS + TS/2, y:(sty+1)*TS - 2, sheet:'cfsign', phase:0, scale:WELT_SC, big:true});
  }

  // --- G11: Das Boot an der Tilgung -----------------------------------------
  // Die Küste aus W-Groß hatte kein einziges Fahrzeug. Das Boot liegt am
  // Strandsaum und ist reine Landmarke: die ausgelagerten Bestände gelten als
  // "angeblich erreichbar, nie geprüft" (Namensregister), und genau so sieht
  // ein Boot aus, das niemand benutzt. Gesucht wird die dem Dorf nächste
  // Strandkachel mit offenem Wasser daneben, wieder zeilenweise und ohne rng().
  {
    let best = null, bestD = Infinity;
    const mx = (VILLAGE.x0 + VILLAGE.x1) / 2, my = (VILLAGE.y0 + VILLAGE.y1) / 2;
    for(let ty = 2; ty < MH-2; ty++) for(let tx = 2; tx < MW-2; tx++){
      if(T(tx, ty) !== G_BEACH) continue;
      if(T(tx+1, ty) !== G_OCEAN && T(tx-1, ty) !== G_OCEAN
         && T(tx, ty+1) !== G_OCEAN && T(tx, ty-1) !== G_OCEAN) continue;
      const d = (tx-mx)*(tx-mx) + (ty-my)*(ty-my);
      if(d < bestD){ bestD = d; best = {tx, ty}; }
    }
    if(best) decos.push({x:best.tx*TS + TS/2, y:(best.ty+1)*TS, sheet:'cfboat', phase:0, scale:WELT_SC, big:true});
  }

  // --- G12: Die Buchten und ihre Pflanzen -----------------------------------
  // Der Wasser-Messlauf (tools/wasser-messlauf.mjs) hat die Setzregel geliefert.
  // Ans Dorf binden ginge gar nicht: im Umkreis von sechzig Kacheln liegt auf
  // keiner Karte eine einzige Wasserkachel, das nächste Uferwasser ist 105 bis
  // 126 Kacheln entfernt. Über die ganze Küste streuen ginge, sähe aber nach
  // nichts aus — 1300 Uferkacheln, ein Vogel alle fünfzig, und jeder wirkt wie
  // ein Versehen. Also Gruppen an gesuchten Stellen, wie die Koppel in G11.
  //
  // Gesucht wird **ohne `rng()`**. Jeder Griff in den Strom verschöbe alles, was
  // danach kommt (Viecher, Wolken), und machte aus derselben Startzahl eine
  // andere Welt. Die Streuung kommt deshalb aus `tileHash()`, wie die Kachelwahl
  // in `pickCfTile()`.
  BUCHTEN.length = 0;
  {
    const meerT = (tx, ty) => inB(tx, ty) && T(tx, ty) === G_OCEAN;
    // Geborgenheit: Landanteil im Quadrat mit Radius 4, dieselbe Rechnung wie im
    // Messlauf. Eine Seerose gehört in eine Bucht und nicht in die offene Tilgung.
    const geborgen = (tx, ty) => {
      let land = 0, ges = 0;
      for(let j=-4; j<=4; j++) for(let i=-4; i<=4; i++){
        if(!inB(tx+i, ty+j)) continue;
        ges++; if(T(tx+i, ty+j) !== G_OCEAN) land++;
      }
      return ges ? land/ges : 0;
    };
    const kand = [];
    for(let ty=6; ty<MH-6; ty++) for(let tx=6; tx<MW-6; tx++){
      if(T(tx, ty) !== G_OCEAN) continue;
      // Von Land aus sichtbar, sonst ist es Deko für niemanden: mindestens eine
      // ERREICHBARE Landkachel im Umkreis von zwei. Der Saum einer Deko-Insel
      // zählt damit nicht mit — dorthin kommt niemand (s. genMap Schritt 3).
      let nah = false;
      for(let j=-2; j<=2 && !nah; j++) for(let i=-2; i<=2; i++) if(reachbar(tx+i, ty+j)){ nah = true; break; }
      if(!nah) continue;
      const g = geborgen(tx, ty);
      if(g < 0.5) continue;
      kand.push({tx, ty, g});
    }
    // Die geborgensten zuerst, bei Gleichstand die zeilenweise frühere — ein
    // stabiles Kriterium, damit zwei Läufe dieselben Buchten finden.
    kand.sort((a, b) => b.g - a.g || (a.tx + a.ty*MW) - (b.tx + b.ty*MW));
    for(const k of kand){
      if(BUCHTEN.length >= 6) break;
      let zuNah = false;
      for(const b of BUCHTEN) if(sqDist(k.tx, k.ty, b.tx, b.ty) < 1600) { zuNah = true; break; }   // 40 Kacheln, wie bei den Kammertüren
      if(!zuNah) BUCHTEN.push(k);
    }
    // Pflanzen um jede Bucht. Schilf und Wassergras stehen am Ufer (Land als
    // Nachbar), Seerosen liegen frei — eine Seerose am Strand sähe angeschwemmt
    // aus. Die Kachel der Bucht selbst bleibt frei, dort sitzt das Kapybara.
    const UFERART = ['schilf1', 'schilf2', 'schilf3', 'wgras1', 'wgras2'];
    const FREIART = ['rose1', 'rose2', 'rose3'];
    for(const b of BUCHTEN){
      for(let j=-4; j<=4; j++) for(let i=-4; i<=4; i++){
        const tx = b.tx+i, ty = b.ty+j;
        if(!meerT(tx, ty) || (i === 0 && j === 0)) continue;
        const h = fmix32(tileHash(tx, ty));
        if((h & 255) > 88) continue;                       // gut ein Drittel der Kacheln, sparsam wie überall
        const ufer = !meerT(tx+1, ty) || !meerT(tx-1, ty) || !meerT(tx, ty+1) || !meerT(tx, ty-1);
        const liste = ufer ? UFERART : FREIART;
        decos.push({x:tx*TS + TS/2, y:(ty+1)*TS, sheet:`cfwp_${liste[(h>>>8) % liste.length]}`,
                    phase:(h>>>16) % 10, scale:WELT_SC});
      }
    }
  }

  // Nach y sortiert halten — der Renderer sucht das sichtbare Band binär statt linear.
  trees.sort((a,b)=>a.y-b.y); decos.sort((a,b)=>a.y-b.y);

  // --- Ambiente-Tiere im Grasland (nur Optik, kollidieren mit nichts) ---
  // W-Groß: 5 -> 18 Tiere. Der alte Bereich ri(8,MW-9)/ri(30,50) meinte "Weideland
  // rund ums Dorf" und war an die alte Dorflage gepinnt — jetzt relativ zu VILLAGE,
  // sonst stünden die Hühner 145 Kacheln vom Dorf entfernt in der Wildnis.
  // Zahl bewusst NICHT mit der Fläche skaliert: der Weidegürtel wächst ja nicht mit,
  // 40 Tiere darin ergaben einen Streichelzoo (~29 gleichzeitig im Bild).
  critters.length = 0;
  const CRITTERS = ['chicken','sheep','cow','pig','chicken'];
  // G11: Sechs der achtzehn stehen in der Koppel, zwölf wie bisher im Gürtel.
  // Die Zahl bleibt achtzehn — die Dichte war eine Entscheidung (s. oben), und
  // ein Zaun ist kein Grund, mehr Tiere aufzustellen. Die Sechs bekommen ihre
  // Grenze mit auf den Weg; ohne sie liefe die Koppel binnen einer Minute leer,
  // weil Ambiente-Tiere mit nichts kollidieren.
  for(let i=0;i<18;i++){
    if(KOPPEL && i < 6){
      const K = KOPPEL;
      let tx = 0, ty = 0, ok = false;
      // Auf eine begehbare Innenkachel, nicht auf den Baum, der dort stehen darf.
      for(let tries = 0; tries < 40 && !ok; tries++){
        tx = ri(K.x0+1, K.x1-1); ty = ri(K.y0+1, K.y1-1); ok = walkT(tx, ty);
      }
      if(ok){
        const art = CRITTERS[i % CRITTERS.length];
        critters.push({x:tx*TS+16, y:ty*TS+16, sheetIdle:`cf${art}_idle`, sheetWalk:`cf${art}_walk`, flip:false,
                       vx:0, vy:0, restT:rr(0,3), phase:rr(0,10),
                       koppel:{x0:(K.x0+1)*TS, y0:(K.y0+1)*TS, x1:(K.x1)*TS, y1:(K.y1)*TS}});
      }
      continue;
    }
    for(let tries=0; tries<40; tries++){
      const tx = ri(VILLAGE.x0-22, VILLAGE.x1+22), ty = ri(VILLAGE.y0-16, VILLAGE.y1+16);
      if(!reachbar(tx,ty) || inVillageT(tx,ty)) continue;   // G5: Dorfplatz bleibt den NPCs vorbehalten
      if(KOPPEL && tx >= KOPPEL.x0 && tx <= KOPPEL.x1 && ty >= KOPPEL.y0 && ty <= KOPPEL.y1) continue;   // G11: nicht ungefragt in die Koppel
      // Beide Sheet-Keys beim Spawn fest anlegen (nicht im Draw-Case zusammenbauen,
      // Regressionsregel 4 — 130-Mob-Horde-Lektion gilt auch für Ambiente-Tiere).
      const art = CRITTERS[i % CRITTERS.length];   // W-Groß: 40 Tiere aus 5 Arten, reihum
      critters.push({x:tx*TS+16, y:ty*TS+16, sheetIdle:`cf${art}_idle`, sheetWalk:`cf${art}_walk`, flip:false,
                     vx:0, vy:0, restT:rr(0,3), phase:rr(0,10)});
      break;
    }
  }

  // --- G12: Die Küstenbevölkerung, und was um das Dorf fliegt ---------------
  // Auch hier kein `rng()`: die Plätze werden gesucht und per `tileHash()`
  // gestreut, damit der Zufallsstrom für alles danach unverändert bleibt (die
  // Wolken hängen daran). `rr()` für Ruhezeit und Phase ist etwas anderes — das
  // ist `Math.random()` und stand schon vorher in jedem Ambiente-Tier.
  {
    const meerT = (tx, ty) => inB(tx, ty) && T(tx, ty) === G_OCEAN;
    const amWasser = (tx, ty) => meerT(tx+1, ty) || meerT(tx-1, ty) || meerT(tx, ty+1) || meerT(tx, ty-1);
    const setz = (art, tx, ty, revier) => {
      const ad = CF_ANIMALS[art];
      critters.push({x:tx*TS+16, y:ty*TS+16, sheetIdle:`cf${art}_idle`, sheetWalk:`cf${art}_walk`,
                     lebensraum:ad.lebensraum, revier:revier || null, flip:false,
                     vx:0, vy:0, restT:rr(0,3), phase:rr(0,10)});
    };
    for(let bi = 0; bi < BUCHTEN.length; bi++){
      const b = BUCHTEN[bi];
      // Revier: vier Kacheln um die Bucht. Ohne Leine schwimmt eine Ente in
      // einer Viertelstunde aufs offene Meer und ist weg — dieselbe Lehre wie
      // bei den sechs Tieren in der Koppel, nur ist diese Grenze unsichtbar:
      // die Koppel muss zum Zaun passen, das Revier zu gar nichts.
      const revier = {x0:(b.tx-4)*TS, y0:(b.ty-4)*TS, x1:(b.tx+5)*TS, y1:(b.ty+5)*TS};
      const plaetze = [];
      for(let j=-3; j<=3; j++) for(let i=-3; i<=3; i++)
        if(meerT(b.tx+i, b.ty+j) && !(i === 0 && j === 0)) plaetze.push([b.tx+i, b.ty+j]);
      // Zwei bis drei Vögel je Bucht, gleichmäßig aus der Liste gegriffen.
      // Enten und Schwäne wechseln sich ab: zwei Arten nebeneinander in einer
      // Bucht sähen nach Zoo aus, und der Bestand nennt sie einzeln.
      const art = (bi % 2) ? 'swan' : 'duck';
      const zahl = Math.min(plaetze.length, 2 + (bi % 2));
      for(let n = 0; n < zahl; n++){
        const [tx, ty] = plaetze[Math.floor(n * plaetze.length / zahl)];
        setz(art, tx, ty, revier);
      }
      // Das Kapybara, nur in die zwei geborgensten Buchten: zwölf Dateien für
      // ein Tier, das taucht, und trotzdem sparsam — das ist die Regel der
      // Weltbibel und sie gilt auch für Viecher.
      //
      // NICHT auf die Buchtkachel selbst. Der Mittelpunkt ist die GEBORGENSTE
      // Kachel, also die mit dem meisten Land ringsum, und damit fast immer eine
      // Randkachel. Das erste Bild zeigte das Tier halb auf dem Strand, mit
      // seinen Wellenringen über dem Sand — dieselbe Sorte Fehler wie die Koppel
      // im Wald aus G11, und wieder nur im Bild zu sehen. Gesucht wird deshalb
      // die dem Mittelpunkt nächste Kachel, deren ACHT Nachbarn alle Wasser
      // sind: das Blatt ist 32 Pixel breit und deckt bei WELT_SC zwei Kacheln.
      if(bi < 2){
        let platz = null, pd = Infinity;
        for(let j=-4; j<=4; j++) for(let i=-4; i<=4; i++){
          const tx = b.tx+i, ty = b.ty+j;
          if(!meerT(tx, ty)) continue;
          let frei = true;
          for(let dj=-1; dj<=1 && frei; dj++) for(let di=-1; di<=1; di++) if(!meerT(tx+di, ty+dj)){ frei = false; break; }
          if(!frei) continue;
          const d = i*i + j*j;
          if(d < pd){ pd = d; platz = [tx, ty]; }
        }
        if(platz) critters.push({x:platz[0]*TS+16, y:platz[1]*TS+16, sheetIdle:'cfkapy_idle', sheetWalk:'cfkapy_idle',
                                 lebensraum:'wasser', kapy:{zustand:'oben', t:rr(5,14)}, revier,
                                 flip:false, vx:0, vy:0, restT:0, phase:rr(0,10)});
      }
      // Ein Frosch je Bucht, auf der nächstgelegenen erreichbaren Landkachel mit
      // Wasser daneben. Er bewegt sich nie — sein Blatt hat gar keine Laufzeile.
      let frosch = null, fd = Infinity;
      for(let j=-6; j<=6; j++) for(let i=-6; i<=6; i++){
        const tx = b.tx+i, ty = b.ty+j;
        if(!reachbar(tx, ty) || !amWasser(tx, ty)) continue;
        const d = i*i + j*j;
        if(d < fd){ fd = d; frosch = [tx, ty]; }
      }
      if(frosch) setz('frog', frosch[0], frosch[1], null);
      // Zwei Gänse an jeder dritten Bucht, an Land. Die Gans hat im Pack keine
      // Wasserzeile, also watet sie hier auch nicht.
      if(bi % 3 === 0){
        let gesetzt = 0;
        for(let j=-5; j<=5 && gesetzt < 2; j++) for(let i=-5; i<=5; i++){
          const tx = b.tx+i, ty = b.ty+j;
          if(!reachbar(tx, ty) || !amWasser(tx, ty)) continue;
          if(frosch && tx === frosch[0] && ty === frosch[1]) continue;
          if((fmix32(tileHash(tx, ty)) & 3) !== 0) continue;      // nicht die erstbeste, sonst stehen sie im Gänsemarsch
          setz('goose', tx, ty, {x0:(tx-4)*TS, y0:(ty-4)*TS, x1:(tx+5)*TS, y1:(ty+5)*TS});
          if(++gesetzt >= 2) break;
        }
      }
    }
    // Falter und Bienen brauchen kein Wasser und sind damit das Einzige aus
    // dieser Runde, das ein Spieler in der ersten Minute sieht.
    {
      const kand = [];
      for(let ty = VILLAGE.y0-8; ty <= VILLAGE.y1+8; ty++) for(let tx = VILLAGE.x0-8; tx <= VILLAGE.x1+8; tx++)
        if(reachbar(tx, ty) && (fmix32(tileHash(tx, ty)) & 15) === 0) kand.push([tx, ty]);
      const FALTER = ['falter1', 'falter2', 'falter3'];
      for(let i = 0; i < 12 && kand.length; i++){
        const [tx, ty] = kand[Math.floor(i * kand.length / 12)];
        // Luft prallt an nichts ab, deshalb ist das Revier hier die einzige
        // Grenze überhaupt — ohne sie wäre der Falter nach zehn Minuten im Meer.
        setz(i < 9 ? FALTER[i % 3] : 'biene', tx, ty,
             {x0:(tx-5)*TS, y0:(ty-5)*TS, x1:(tx+6)*TS, y1:(ty+6)*TS});
      }
    }
    // Drei Mäuse an drei Gebäuden. Eine Maus an der Amtsfassade ist die
    // billigste Pointe des ganzen Pakets, und sie kostet keine Zeile Text.
    {
      let gesetzt = 0;
      for(const geb of VILLAGE_BUILDINGS){
        if(gesetzt >= 3) break;
        const tx = geb.x0 + 1, ty = geb.y0 + geb.h;
        if(!reachbar(tx, ty)) continue;
        setz('mouse', tx, ty, {x0:(tx-3)*TS, y0:(ty-3)*TS, x1:(tx+4)*TS, y1:(ty+4)*TS});
        gesetzt++;
      }
    }
  }

  // --- G5/W3: Dorf-Figuren — Staffage mit kleinem Wanderradius um einen Heimat-
  // anker, drei sind stattdessen Held-Komposite und stehen fest (siehe opt:'fest'
  // oben). Blasenfelder liegen im Objekt selbst (keine Modulvariable wie knBubble),
  // weil es jetzt elf statt eine Figur mit eigenem Sprechzustand sind.
  npcs.length = 0;
  for(const nd of DORF_FIGUREN){
    let tx = nd.tx, ty = nd.ty;
    if(!walkT(tx,ty)){                       // Heimatanker landete auf einer nicht-begehbaren Kachel
      for(let tries=0; tries<20 && !walkT(tx,ty); tries++){
        tx = clamp(nd.tx + ri(-2,2), VILLAGE.x0+1, VILLAGE.x1-1);
        ty = clamp(nd.ty + ri(-2,2), VILLAGE.y0+1, VILLAGE.y1-1);
      }
    }
    const homeX = tx*TS+16, homeY = ty*TS+16;
    // G6: Die Blattwahl steht in npcBlaetter(), einer reinen Funktion, die auch
    // npcAnkerAssert() und dorfSichtAssert() lesen. Hier läuft sie noch vor dem
    // Laden, liefert also erst einmal die CF_NPCS-Keys; npcBlaetterNachziehen()
    // korrigiert sie hinter loadAssets() für die Blätter, die nicht da sind.
    const {idle: idleKey, walk: walkKey} = npcBlaetter(nd);
    // sc (Skalierung) wird bewusst nicht hier berechnet: PLAYER_SC ist an dieser
    // Stelle (genMap() läuft beim Skriptstart, lange vor der PLAYER_SC-Deklaration
    // weiter unten) noch in der TDZ. DRAW_NPC berechnet sc pro Zeichenschritt,
    // genau wie drawAlter() es für Knöterich schon immer tut.
    npcs.push({key:nd.key, figur:nd, homeX, homeY, x:homeX, y:homeY, sheetIdle:idleKey, sheetWalk:walkKey,
               fest:nd.opt === 'fest', tint:nd.tint||null, tintA:nd.tintA,
               flip:false, vx:0, vy:0, restT:rr(0,3), phase:rr(0,10),
               bubbleIdx:-1, bubbleText1:'', bubbleText2:'', bubbleHideAt:0});
  }

  // G5: Wolkenschatten übers Grasland, driften über die ganze Kartenbreite (nicht
  // nur übers Dorf), persistent wie trees/decos (kein Neubacken bei startShift()).
  // W-Groß: 5 -> 20 Wolken, und das Band folgt jetzt dem Grasband statt den alten
  // Literalen 28/52 (die waren an die alte Bandlage gepinnt).
  weatherClouds.length = 0;
  const [WOLK_Y0, WOLK_Y1] = bandRange('grass', 2);
  for(let i=0;i<20;i++){
    weatherClouds.push({x: rr(0, MW*TS), y: rr(WOLK_Y0*TS, WOLK_Y1*TS), vx: rr(6,14)*(Math.random()<0.5?1:-1), variant: ri(0,3)});
  }

  refreshFloor();
}
genMap();

// G11-Guard. Läuft direkt hinter genMap(), weil er die gesetzte Welt misst und
// nicht die Tabelle — die Koppel wird gesucht und nicht gesetzt, ihre Lage ist
// also erst nach dem Lauf bekannt. Er wirft nie, er meldet.
function koppelAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('G11 Koppel:', m, ...r); };
  if(!KOPPEL){
    // Kein Fehler, sondern ein Befund: der Weidegürtel hat auf dieser Karte
    // kein freies Rechteck hergegeben. Dann steht kein Zaun und keine Kuh darin.
    console.log('G11 Koppel: kein freies Rechteck im Weidegürtel, es steht kein Zaun.');
    return;
  }
  const K = KOPPEL;
  const KW = K.x1 - K.x0 + 1, KH = K.y1 - K.y0 + 1;
  const zaun = decos.filter(d => d.sheet && d.sheet.startsWith('cffence_'));
  // Die Zusage: der Ring ist zu, bis auf das Tor. Das sind 2*(KW+KH) - 4 Kacheln
  // Rand minus die zwei Torkacheln.
  const soll = 2*(KW + KH) - 4 - 2;
  if(zaun.length !== soll) fehler(`Ring ist ${zaun.length} Kacheln lang, zugesagt sind ${soll}`);
  // Jede Zaunkachel steht auf begehbarem Grund. Ein Zaun im Wasser wäre keine
  // Umzäunung, sondern ein Fund wie die fünf unsichtbaren Dorffiguren aus G6.
  for(const d of zaun){
    const tx = Math.floor(d.x / TS), ty = Math.floor((d.y - 1) / TS);
    if(!walkT(tx, ty)) fehler('Zaunkachel steht nicht auf begehbarem Grund', tx, ty);
    if(tx !== K.x0 && tx !== K.x1 && ty !== K.y0 && ty !== K.y1)
      fehler('Zaunkachel steht nicht auf dem Rand', tx, ty);
  }
  // Das Tor ist offen, und zwar genau zwei Kacheln breit.
  const suedRand = zaun.filter(d => Math.floor((d.y - 1) / TS) === K.y1).length;
  if(suedRand !== KW - 2) fehler(`Südkante hat ${suedRand} Kacheln, mit Tor sind es ${KW - 2}`);
  // Jedes Koppeltier steht in seiner Koppel, und die Grenze liegt innerhalb des
  // Zauns. Ohne diese Prüfung wäre die Leine eine Zusage ohne Beleg.
  const drin = critters.filter(c => c.koppel);
  for(const c of drin){
    if(c.x < c.koppel.x0 || c.x > c.koppel.x1 || c.y < c.koppel.y0 || c.y > c.koppel.y1)
      fehler('Tier steht außerhalb seiner Koppel', Math.floor(c.x/TS), Math.floor(c.y/TS));
    if(c.koppel.x0 <= K.x0*TS || c.koppel.x1 >= (K.x1+1)*TS)
      fehler('die Leine reicht über den Zaun hinaus');
  }
  // Schild und Boot: je eins, und beide dort, wo sie hingehören.
  const schild = decos.filter(d => d.sheet === 'cfsign');
  const boot = decos.filter(d => d.sheet === 'cfboat');
  if(schild.length > 1) fehler(`${schild.length} Schilder statt eins`);
  if(boot.length > 1) fehler(`${boot.length} Boote statt eins`);
  for(const b of boot){
    const tx = Math.floor(b.x / TS), ty = Math.floor((b.y - 1) / TS);
    if(T(tx, ty) !== G_BEACH) fehler('das Boot liegt nicht am Strandsaum', tx, ty);
  }
  if(ok) console.log(`G11 Koppel: ${KW}x${KH} Kacheln bei (${K.x0},${K.y0}), ${zaun.length} Zaunkacheln mit Tor, `
    + `${drin.length} Tiere an der Leine, ${schild.length} Schild, ${boot.length} Boot.`);
}
koppelAssert();

// G12-Guard. Läuft wie koppelAssert() direkt hinter genMap() und aus demselben
// Grund: die Buchten werden gesucht, ihre Lage steht in keiner Tabelle. Er misst
// die gesetzte Welt und prüft die eine Zusage, die diese Runde überhaupt macht —
// jedes Ding steht in seinem Lebensraum. Er wirft nie, er meldet.
function steinbruchAssert(){
  let ok = true;
  const fehler = (m, ...r) => { ok = false; console.error('G12 Steinbruch:', m, ...r); };
  const tvon = (px, py) => [Math.floor(px / TS), Math.floor((py - 1) / TS)];

  if(!BUCHTEN.length){
    // Befund, kein Fehler — wie bei der Koppel: diese Karte hat keine Bucht
    // hergegeben, dann steht dort auch nichts. Auf 320x320 mit Meer ringsum ist
    // das unwahrscheinlich, ausgeschlossen ist es nicht.
    console.log('G12 Steinbruch: keine Bucht gefunden, es steht keine Wasserdeko.');
    return true;
  }
  // Die Buchten selbst: Wasser, geborgen, und weit genug auseinander, dass sie
  // nicht als eine Gruppe gelesen werden.
  for(const b of BUCHTEN){
    if(T(b.tx, b.ty) !== G_OCEAN) fehler('Bucht liegt nicht im Wasser', b.tx, b.ty);
    if(b.g < 0.5) fehler(`Bucht ist nur zu ${(b.g*100)|0}% geborgen`, b.tx, b.ty);
    for(const a of BUCHTEN) if(a !== b && sqDist(a.tx, a.ty, b.tx, b.ty) < 1600)
      fehler('zwei Buchten liegen näher als vierzig Kacheln beieinander', b.tx, b.ty);
  }

  // Die Pflanzen: jede im Wasser, und die Sorte passt zum Platz. Schilf und
  // Wassergras brauchen eine Kante, Seerosen brauchen keine.
  const pflanzen = decos.filter(d => d.sheet && d.sheet.startsWith('cfwp_'));
  let rosen = 0, ufer = 0;
  for(const p of pflanzen){
    const [tx, ty] = tvon(p.x, p.y);
    if(T(tx, ty) !== G_OCEAN){ fehler('Wasserpflanze steht nicht im Wasser', tx, ty); continue; }
    const amRand = !wasserT(tx+1, ty) || !wasserT(tx-1, ty) || !wasserT(tx, ty+1) || !wasserT(tx, ty-1);
    if(p.sheet.startsWith('cfwp_rose')){
      rosen++;
      if(amRand) fehler('Seerose klebt am Ufer statt frei zu liegen', tx, ty);
    } else {
      ufer++;
      if(!amRand) fehler('Schilf steht im offenen Wasser', tx, ty);
    }
  }

  // Die Tiere: jedes auf dem Grund, den sein Lebensraum verlangt. Das ist die
  // Prüfung, die es vor G12 nicht geben konnte — bis dahin gab es nur einen.
  const zaehl = {land:0, wasser:0, ufer:0, luft:0};
  for(const c of critters){
    const lr = c.lebensraum || 'land';
    zaehl[lr]++;
    const tx = Math.floor(c.x / TS), ty = Math.floor(c.y / TS);
    if(lr === 'wasser' && T(tx, ty) !== G_OCEAN) fehler('Wassertier sitzt nicht im Wasser', tx, ty);
    if(lr === 'land' && !walkT(tx, ty)) fehler('Landtier steht nicht auf begehbarem Grund', tx, ty);
    if(lr === 'ufer'){
      if(!walkT(tx, ty)) fehler('Ufertier steht nicht auf begehbarem Grund', tx, ty);
      else if(!wasserT(tx+1, ty) && !wasserT(tx-1, ty) && !wasserT(tx, ty+1) && !wasserT(tx, ty-1))
        fehler('Ufertier sitzt nicht am Wasser', tx, ty);
    }
    // Ein Revier, das seinen Bewohner nicht enthält, wäre eine Leine ohne Tier.
    const k = c.koppel || c.revier;
    if(k && !imRahmen(k, c.x, c.y)) fehler(`${lr}-Tier steht außerhalb seines Reviers`, tx, ty);
    // Fliegen und Schwimmen ohne Grenze hieße: in zehn Minuten weg. Die
    // Landtiere im Weidegürtel dürfen ohne, die prallen an der Küste ab.
    if((lr === 'luft' || lr === 'wasser') && !k && !c.kapy) fehler(`${lr}-Tier ohne Revier`, tx, ty);
  }
  // Das Kapybara: höchstens eins je Bucht, und es steht mit ALLEN acht Nachbarn
  // im Wasser. Sein Blatt ist zwei Kacheln breit und bringt gemalte Wellenringe
  // mit; auf einer Randkachel lägen die über dem Strand. Genau so stand es im
  // ersten Bild dieser Runde.
  const kapys = critters.filter(c => c.kapy);
  if(kapys.length > BUCHTEN.length) fehler(`${kapys.length} Kapybaras auf ${BUCHTEN.length} Buchten`);
  for(const c of kapys){
    const tx = Math.floor(c.x / TS), ty = Math.floor(c.y / TS);
    for(let j=-1; j<=1; j++) for(let i=-1; i<=1; i++)
      if(!wasserT(tx+i, ty+j)){ fehler('Kapybara sitzt am Rand statt im offenen Wasser', tx, ty); j = 2; break; }
  }

  if(ok) console.log(`G12 Steinbruch: ${BUCHTEN.length} Buchten, ${ufer} Schilf und ${rosen} Seerosen, `
    + `${zaehl.wasser} im Wasser, ${zaehl.ufer} am Ufer, ${zaehl.luft} in der Luft, ${zaehl.land} an Land.`);
  // Rueckgabewert, damit tools/steinbruch-fehlversuch.mjs den Guard pruefen
  // kann: ein Guard, der immer schweigt, beweist nichts (M2-Lehre).
  return ok;
}
steinbruchAssert();

// W-Groß: ARENA ist das Sprungziel von loadLevel2() und wird dort UNGEPRÜFT
// gesetzt (player.x = ARENA.x*TS). moveEnt() bewegt nur, wenn circleWalkable()
// besteht — landete der Sprung auf einer nicht begehbaren Kachel, säße der
// Spieler im Schattenland unbeweglich fest, könnte shadowKills nie erreichen und
// käme nicht mehr heraus. Seit dem Wegfall des toten Pfadlaufs ist loadLevel2()
// zudem der EINZIGE Leser von ARENA, es würde also nirgends sonst auffallen.
// Deshalb: einmal nach dem Kartenbau auf die nächste begehbare Kachel nachziehen.
(function arenaAufBegehbaresZiehen(){
  if(walkT(ARENA.x, ARENA.y)) return;
  for(let r = 1; r < Math.max(MW, MH); r++){
    for(let dy = -r; dy <= r; dy++) for(let dx = -r; dx <= r; dx++){
      if(Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;   // nur der Ring, nicht die Fläche
      const nx = ARENA.x + dx, ny = ARENA.y + dy;
      if(!walkT(nx, ny)) continue;
      console.warn('Weltform: ARENA lag auf', T(ARENA.x, ARENA.y), '- verschoben nach', nx, ny);
      ARENA.x = nx; ARENA.y = ny; return;
    }
  }
  console.error('Weltform: keine begehbare Kachel für ARENA gefunden');
})();

const RARITY = [
  {key:0, name:'Gewöhnlich',  col:'#e8e8e0'},
  {key:1, name:'Magisch',     col:'#5c86ff'},
  {key:2, name:'Selten',      col:'#f2c94c'},
  {key:3, name:'Episch',      col:'#c77dff'},
  {key:4, name:'Einzigartig', col:'#ff9f4a'},
];
// Altbestand: Ausrüstung, die es vor der Kessel-Umstellung gab. Fällt nicht mehr
// als Beute an, bleibt aber tragbar (Startwaffe, alte Fundstücke).
// S1: Die Grundklingen tragen weniger, damit die Kraft mehr traegt. Das
// Kurzschwert ist die Referenzwaffe des Monsterkatalogs (monsterAssert baut
// den Referenzspieler damit), seine Zahlen sind deshalb keine Geschmacksfrage:
// [5,9] mit +3/+4 je Punkt Kraft ergab auf Stufe 1 dieselbe Wucht wie auf
// Stufe 4 mit halber Steigerung. [3,6] mit +3/+5 dreht das um.
// kraft = Kraftbedarf. Wer ihn nicht hat, legt die Waffe nicht an.
const BASES = [
  {t:'weapon', mode:'dagger',    name:'Dolch',          tier:1, dmg:[2,4],   aps:1.8,  kraft:0,  icon:'🗡️', iconFrame:'dagger'},
  {t:'weapon', mode:'sword',     name:'Kurzschwert',    tier:1, dmg:[3,6],   aps:1.3,  kraft:0,  icon:'🗡️', iconFrame:'sword'},
  {t:'weapon', mode:'doubleaxe', name:'Schattenspalter', tier:3, dmg:[22,40], aps:0.7, kraft:10, icon:'🪓', iconFrame:'doubleaxe'},
  {t:'armor',  name:'Lederharnisch', tier:1, armor:3,  icon:'👕', iconFrame:'armor'},
  {t:'armor',  name:'Kettenpanzer',  tier:2, armor:8,  icon:'🧥', iconFrame:'armor'},
  {t:'armor',  name:'Dunkler Panzer', tier:3, armor:15, icon:'👕', iconFrame:'armor'},
  {t:'shield', name:'Holzschild',    tier:1, armor:2,  icon:'🛡️', iconFrame:'shield'},
];
const AFFIXES = [
  {k:'dmg',   min:3,  max:8,  satz:'Verbessert geschliffen.'},
  {k:'armor', min:4,  max:12, satz:'Zusätzlich verstärkt.'},
  {k:'hp',    min:20, max:50, satz:'Angenehm zu tragen.'},
];

