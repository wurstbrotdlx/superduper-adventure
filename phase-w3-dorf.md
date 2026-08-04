## W3: Das Dorf spricht — Zwölf Weltfiguren über die Kontextaktion F — ERLEDIGT

Umbau-Prompt zu Bauabschnitt W3 aus `superduper-weltbibel.md`, Kapitel 8 ("Das Ensemble"), Kapitel 9 ("Der Hauptvorgang, fünf Akte") und Kapitel 14. Inhaltslieferung ist bereits fertig: `figuren-dorf.md` enthält alle elf Figuren vollständig ausformuliert und dreistufig geprüft (Entwurf, Reparatur, unabhängige Kesselgrammatik-Prüfung). Diese Phase verdrahtet sie, erfindet keinen einzigen neuen Satz.

Alle unten genannten Bezeichner und Zeilennummern wurden gegen den Stand nach Commit `27b983b` geprüft (Arbeitsbaum: die fünf kopierten NPC-Sprites aus der Zusagen-Bilanz-Session sind zu diesem Zeitpunkt bereits in `assets/cf/deco/NPCs/`, aber noch nicht registriert). Zeilennummern verschieben sich beim Arbeiten, die Bezeichner nicht: such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.

### Grundsatz: was diese Phase nicht ist

Kein neues Panel, kein neuer `localStorage`-Schlüssel, kein Dialogbaum, keine Antwortauswahl, kein neuer Zeichenschritt. Eine Datentabelle, eine Kontextaktion nach dem Muster von Knöterichs „Nachfragen", eine Canvas-Blase nach dem Muster von `knBubble`, ein einzeiliger Hook in eine bestehende Funktion (`knRandnotiz`), zwei Sitzungsvariablen (nicht persistiert). Wer hier ein neues Overlay, einen neuen `localStorage`-Schlüssel oder ein Antwortmenü baut, hat die Weltbibel nicht gelesen: „Kein Dialogbaum. Keine Antwortauswahl. Kein Gesprächssystem." steht dort wörtlich in Kapitel 14, Abschnitt „Was wir ausdrücklich nicht bauen".

**Sperrvermerk, unverändert aus Kapitel 7:** keine Figur erklärt oder deutet an, wie die Beglaubigung im Kessel rechnet. Alle Zeilen in `figuren-dorf.md` sind bereits dreistufig dagegen geprüft (siehe deren Kopfzeile und die Prüfnotizen je Figur). Wer den Text beim Einbau umformuliert oder kürzt, muss die Prüfung wiederholen, nicht nur den Zeichendeckel.

### Fünf neue NPC-Sprites registrieren: `CF_NPCS` (`index.html:741`)

Die fünf zusätzlichen Dorfbewohner-PNGs liegen bereits in `assets/cf/deco/NPCs/` (kopiert aus der Rohbibliothek, gleicher Weg wie `README.md` ihn vorsieht), sind aber noch nicht registriert. Alle acht teilen dasselbe 64×64-Raster, Anker Fußmitte (`ax:32, ay:60`), idle=Zeile1/walk=Zeile4 — bestätigt gegen die echten IHDR-Maße der Dateien (Bruno/Chloe 384×448, Buba 384×832, Jack 384×640, Fin 576×832, letzteres mit 9 statt 6 Spalten, was `addSheet` automatisch aus der Bildbreite berechnet, kein Sonderfall nötig):

```js
const CF_NPCS = {
  bob:   {file:'NPCs/Farmer_Bob.png',      fw:64, fh:64, ax:32, ay:60},
  katy:  {file:'NPCs/Bartender_Katy.png',  fw:64, fh:64, ax:32, ay:60},
  mike:  {file:'NPCs/Miner_Mike.png',      fw:64, fh:64, ax:32, ay:60},
  bruno: {file:'NPCs/Bartender_Bruno.png', fw:64, fh:64, ax:32, ay:60},
  chloe: {file:'NPCs/Chef_Chloe.png',      fw:64, fh:64, ax:32, ay:60},
  buba:  {file:'NPCs/Farmer_Buba.png',     fw:64, fh:64, ax:32, ay:60},
  jack:  {file:'NPCs/Lumberjack_Jack.png', fw:64, fh:64, ax:32, ay:60},
  fin:   {file:'NPCs/Fisherman_Fin.png',   fw:64, fh:64, ax:32, ay:60},
};
```

Die bestehende Schleife direkt darunter (`for(const nkey in CF_NPCS){ addSheet(...idle...); addSheet(...walk...); }`) registriert die zehn neuen Sheet-Einträge automatisch mit, keine weitere Änderung an dieser Stelle nötig.

### `bakeNpcSheet()`: Komposit-Figuren aus dem Helden-Rig, direkt nach `bakeHeroSheet()` (`index.html:936`)

Drei Figuren (Bramsche, Lott, Pahl) sind keine Sprite-Datei, sondern ein Komposit aus dem Spieler-Baukasten, genau wie Knöterich (`drawAlter()`, `cfbody_idle` + festes Haar). Anders als beim Spieler ändert sich die Ausrüstung nie, deshalb backt diese Funktion **einmal** beim Laden, kein Dirty-Check nötig, und nur die Idle-Zeile (6 Frames), kein Lauf-, Kampf- oder Zauber-Frame:

```js
// ===========================================================================
//  W3: NPC-Komposit aus dem Helden-Rig (Bramsche, Lott, Pahl), gleiches Prinzip
//  wie bakeHeroSheet(), aber nur Idle (6 Frames) und genau einmal gebacken —
//  diese Figuren wechseln nie die Kleidung, ein Dirty-Check wäre Ballast.
// ===========================================================================
function bakeNpcSheet(key, chest, legs, feet, hair){
  const canvas = document.createElement('canvas');
  canvas.width = 6 * 64; canvas.height = 64;
  const bctx = canvas.getContext('2d');
  for(let f = 0; f < 6; f++){
    const dx = f * 64;
    if(legs >= 0) blitLayerFrame(bctx, `cflegs_${legs}_idle`, f, dx, 0);
    if(feet >= 0) blitLayerFrame(bctx, `cffeet_${feet}_idle`, f, dx, 0);
    blitLayerFrame(bctx, 'cfbody_idle', f, dx, 0);
    if(chest >= 0) blitLayerFrame(bctx, `cfchest_${chest}_idle`, f, dx, 0);
    blitLayerFrame(bctx, `cfhair_${hair}_idle`, f, dx, 0);
    blitLayerFrame(bctx, 'cfhands_idle', f, dx, 0);
  }
  SHEETS[`npc_baked_${key}`] = {img:canvas, cols:6, n:6, fw:64, fh:64, ax:CF_ANCHOR.ax, ay:CF_ANCHOR.ay, rowStart:0};
}
function bakeAllNpcSheets(){
  for(const f of DORF_FIGUREN) if(f.opt === 'fest') bakeNpcSheet(f.key, f.chest ?? -1, f.legs ?? -1, f.feet ?? -1, f.hair);
}
```

Aufruf in der bestehenden `loadAssets().then(...)`-Kette (`index.html:6501`ff.), direkt nach `bakeUiSkin()` und vor `showStartScreen()` — an dieser Stelle sind alle `cfbody_idle`/`cfhair_*_idle`/`cfchest_*_idle`/`cflegs_*_idle` Sheets garantiert geladen:

```js
loadAssets().then(() => {
  clearInterval(loadTick);
  assetsReady = true;
  bakeHeroSheet();
  assertRigRegistrations();
  prewarmMonsterTints();
  bakeUiSkin();
  bakeAllNpcSheets();
  initFloorGraphics();
  showStartScreen();
```

**Warum das trotz `genMap()` (Zeile 1905, läuft vor `loadAssets()`) funktioniert:** `npcs.push()` legt nur den *Sheet-Schlüssel-String* (`npc_baked_bramsche`) im NPC-Objekt ab, nicht das Bild selbst. `SHEETS[...]` wird erst hier befüllt, aber gelesen wird der Schlüssel immer erst beim Zeichnen, also lange nach `assetsReady`. Gleiche Reihenfolge-Garantie wie bei jedem anderen Sheet im Spiel.

### Datentabelle `DORF_FIGUREN`, ersetzt `NPC_DEFS` (`index.html:1598` bis `1604`)

Direkt an der Stelle, an der bisher `NPC_DEFS` stand, vor `npcs.length` deklariert (TDZ-Regel wie bei jeder Datentabelle im Projekt). Text zeichengleich mit `figuren-dorf.md`. `opt:'wander'` nutzt ein Sprite aus `CF_NPCS` und wandert wie die bisherigen drei Staffage-NPCs; `opt:'fest'` ist ein Held-Komposit und steht fest wie Knöterich.

```js
// ===========================================================================
//  DORF_FIGUREN (Bauabschnitt W3): elf ansprechbare Ensemble-Mitglieder aus
//  Kapitel 8 der Weltbibel. Text unverändert aus figuren-dorf.md übernommen,
//  dreistufig gegen Sperrvermerk/Humor-Grundgesetz/Formregeln/Zeichendeckel
//  geprüft. Knöterich (bereits im Code) und der Kater Anlage 3 (kein Sprite,
//  siehe drawAnlage3()) sind nicht Teil dieser Tabelle.
// ===========================================================================
const DORF_FIGUREN = [
  {key:'zwirn', name:'Bürgermeister Alfons Zwirn', tx:14, ty:34, opt:'wander', sheet:'bob',
   grund:[
     {z1:'Das Dorffest kommt. Seit elf Jahren.', z2:'Vordermühl hatte noch nie eins.'},
     {z1:'Eine Genehmigung fehlt uns noch.', z2:'Da bin ich dran.'},
     {z1:'Wir werden das angehen.', z2:'Noch dieses Jahr, vielleicht.'},
     {z1:'Schön, dass Sie da sind! Wirklich.', z2:'Ihr Jahresgespräch führe ich.'},
     {z1:'Zuständig wäre die Amtsleitung.', z2:'Nur weiß ich nicht, wer sie ist.'},
     {z1:'Konfetti habe ich schon bestellt.', z2:'Nur die Genehmigung fehlt noch.'},
   ],
   akt:[
     'Elf Jahre Vorfreude, noch mehr Händedruck.',
     'Wer zuständig ist? Klären wir noch.',
     'Der Schreibtisch ist leer. Ich weiß warum.',
     'Ich habe gestanden. Das Fest steht noch aus.',
     'Wir werden das Fest feiern. Irgendwann.',
   ]},

  {key:'bramsche', name:'Registratorin Ottilie Bramsche', tx:18, ty:37, opt:'fest', hair:'h3', chest:2, legs:2,
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
   antworten:[
     {frage:'Was war der Vorgang 1?', z1:'Vorgang 1 ist der Friedensvertrag.', z2:'Nie geschlossen, nur ausgesetzt.'},
     {frage:'Wo ist die Amtsleitung?', z1:'N.N. heißt nicht genannt.', z2:'Der Posten ist unbesetzt.'},
     {frage:'Was ist der Brandabschnitt?', z1:'Er liegt in Zuständigkeitsbereich VII.', z2:'Dort endete meine Ausnahme.'},
     {frage:'Was ist Ablage V?', z1:'Ablage V führt ins Schattenland.', z2:'Zugang nur mit Ausfertigung.'},
     {frage:'Wer ist Fürst Nachtrag?', z1:'Fürst Nachtrag ist Herr über Ablage V.', z2:'Er steht im Brief als Empfänger.'},
     {frage:'Wer ist zuständig für das Dorffest?', z1:'Zuständig wäre die Amtsleitung.', z2:'Diese Stelle ist unbesetzt.'},
     {frage:'Was liegt in Ablage auf Eis?', z1:'Ablage auf Eis führt nach Frostkamm.', z2:'Dort liegt seit Jahren Ruhe.'},
     {frage:'Was ist Ablage A?', z1:'Ablage A ist das Grasland.', z2:'Die harmloseste aller Ablagen.'},
   ],
   abweisung:[
     {z1:'Eine Frage pro Schicht.', z2:'Die Ihre ist verbraucht.'},
     {z1:'In welcher Sache?', z2:'Das hatten wir schon.'},
     {z1:'Antrag für heute erledigt.', z2:'Morgen wieder.'},
   ]},

  {key:'zapf', name:'Hausmeister Reinhold Zapf', tx:16, ty:46, opt:'wander', sheet:'jack',
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
   ]},

  {key:'lisbeth', name:'Praktikantin Lisbeth Fuhr', tx:10, ty:42, opt:'wander', sheet:'chloe',
   grund:[
     {z1:'Man erledigt Monster nicht.', z2:'Man beantwortet sie.'},
     {z1:'Und wenn er einfach nur wartet?', z2:'Das fragt hier keiner gern.'},
     {z1:'Sechstes Jahr Praktikum, immer noch unbezahlt.', z2:'Es fehlt nur eine Unterschrift.'},
     {z1:'Es fehlt eine weisungsbefugte Person.', z2:'Es gibt sie einfach nicht.'},
     {z1:'Mein Traum: ein Amt für Monster.', z2:'Nicht gegen sie, für sie.'},
     {z1:'Ich stelle nur die Fragen, die stören.', z2:'Antworten fehlen meistens.'},
   ],
   akt:[
     'Ich zähle mit, aber ich frage schon.',
     'Jetzt fragt endlich jemand mit mir.',
     'Ein leerer Stuhl. Genau mein Problem.',
     'Ich habe nur gefragt, wer lesen kann.',
     'Vielleicht braucht er nur eine Antwort.',
   ]},

  {key:'trepp', name:'Zusteller Emil Trepp der Siebte', tx:22, ty:41, opt:'wander', sheet:'fin',
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
   ]},

  {key:'noergel', name:'Nörgel, Sachbearbeiter auf Probe', tx:8, ty:38, opt:'wander', sheet:'mike', tint:'#7a9c5a', tintA:0.22,
   grund:[
     {z1:'Vierzig Jahre Probezeit.', z2:'Nächstes Jahr wird entfristet.'},
     {z1:'Die Entfristung macht die Amtsleitung.', z2:'Die sieht man nie.'},
     {z1:'Ich habe mich damals beschwert.', z2:'Dann hat man mich eingestellt.'},
     {z1:'Ich trage eine Krawatte.', z2:'Fällt niemandem auf.'},
     {z1:'Ich beschwere mich auch über mich.', z2:'Berechtigt, wie meistens.'},
     {z1:'Das ist nicht meine Zuständigkeit.', z2:'Ich mache es trotzdem.'},
   ],
   akt:[
     'Noch ein Formular, noch keine Antwort.',
     'Jetzt braucht auch Zwirn die Amtsleitung.',
     'Die Stelle ist leer, ich bin es nicht.',
     'Niemand fragt mich. Jetzt fragen alle.',
     'Auch jetzt ist es nicht meine Zuständigkeit.',
   ]},

  {key:'milb', name:'Gutachter Dr. phil. Milb', tx:11, ty:39, opt:'wander', sheet:'buba',
   grund:[
     {z1:'Das würde ich mit Drei ansetzen.', z2:'Höchstens.'},
     {z1:'Diese Kammer würde ich einstufen.', z2:'Ungefragt, versteht sich.'},
     {z1:'Manche Kammern fühlen sich falsch an.', z2:'Das beunruhigt mich.'},
     {z1:'Meine Zahlen stimmen immer. Fast.', z2:'Nur wo, weiß ich nicht.'},
     {z1:'Ein Gutachten ist nie fertig.', z2:'Nur eingestellt.'},
     {z1:'Andere raten. Ich stufe ein.', z2:'Das ist ein Unterschied.'},
   ],
   akt:[
     'Die neue Kraft schätze ich auf Zwei.',
     'Ohne Freigabe stufe ich das niedrig ein.',
     'Ein leerer Stuhl lässt sich nicht bewerten.',
     'Diese Schrift verweigert sich der Note.',
     'Diesmal setze ich keine Note mehr an.',
   ]},

  {key:'pommer', name:'Materialausgabe Herr Pommer', tx:13, ty:45, opt:'wander', sheet:'katy',
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
   ]},

  {key:'fass', name:'Wirt Bruno Fass, Gasthaus "Zum Letzten Stempel"', tx:20, ty:39, opt:'wander', sheet:'bruno',
   grund:[
     {z1:'Wie war der Tag da draußen?', z2:'Setz dich. Bleib ein bisschen.'},
     {z1:'Zum Letzten Stempel schließt nie zu früh.', z2:'Bleib, so lang du willst.'},
     {z1:'Alle hauen ab, bevor der Käse kommt.', z2:'Schade eigentlich.'},
     {z1:'Einmal bleibt wer bis zum Schluss.', z2:'Das wär mal was.'},
     {z1:'Hier redet sich manches leichter.', z2:'Bei Suppe und Bier.'},
     {z1:'Kaum eingekehrt, schon wieder Dienst.', z2:'So ein Jammer.'},
   ],
   akt:[
     'Ein neues Gesicht am Tresen heute.',
     'Die Gespräche werden länger, die Krüge auch.',
     'Der Stammtisch hat eine Lücke.',
     'Heute sitzen alle enger zusammen.',
     'Es fühlt sich an wie ein letzter Abend.',
   ]},

  {key:'lott', name:'Herr Lott, auf der Bank am Dorfplatz', tx:9, ty:47, opt:'fest', hair:'h1',
   grund:[
     {z1:'Der Neue. Schon wieder unterwegs.', z2:'Ich sitze. Zuständig für nichts.'},
     {z1:'Der Neue. Schlägt wieder alles kurz und klein.', z2:'Sauber. Nichts bleibt stehen.'},
     {z1:'Der Neue. Läuft, wo ich nur sitze.', z2:'Manche stehen auf. Ich nicht.'},
     {z1:'Der Neue. Mutig. Nicht mein Bereich.', z2:'Ich sag nur, was ich sehe.'},
     {z1:'Der Neue. Wieder klatschnass vom Kampf.', z2:'Ich bleibe trocken. Prinzip.'},
     {z1:'Der Neue. Frag lieber Herrn Pahl.', z2:'Der hat mehr Geduld als ich.'},
   ],
   akt:[
     'Der Neue zählt Konfetti. Süß.',
     'Krieg ausgesetzt. Ich sitze weiter.',
     'N.N. Wenigstens fragt niemand nach mir.',
     'Ich lese keine Adressen. Ich sitze.',
     'Der Neue zieht los. Kein Kommentar heut.',
   ],
   anlass:{
     crit:[
       {z1:'Direkt ins Aktenzeichen.', z2:'Pahl schweigt. Wie erwartet.'},
       {z1:'Das war kein Zufall. Glaub ich.', z2:'Pahl, klatsch doch mal mit.'},
       {z1:'Ein Treffer für die Geschichtsbücher.', z2:'Pahl nickt. Immerhin das.'},
     ],
     levelup:[
       {z1:'Der Neue wird befördert. Von wem?', z2:'Pahl weiß es auch nicht.'},
       {z1:'Höher, weiter, immer noch sitzend hier.', z2:'Pahl klatscht. Ich nicke.'},
       {z1:'Stufe hoch. Bank bleibt gleich.', z2:'Pahl, freu dich für ihn.'},
     ],
     ultimate:[
       {z1:'Na sowas. Ganz schön viel Zauber.', z2:'Pahl duckt sich schon mal.'},
       {z1:'Das hat sicher eine Genehmigung. Oder?', z2:'Pahl fragt nicht nach. Klug.'},
       {z1:'So viel Licht. Meine Augen, meine Akte.', z2:'Pahl blinzelt. Sonst nichts.'},
     ],
     fluch:[
       {z1:'Neuer Fluch. Kleingedrucktes, wie immer.', z2:'Pahl liest es. Ich nie.'},
       {z1:'Jede Gabe hat einen Haken. Amtlich.', z2:'Pahl nennt das gerecht.'},
       {z1:'Noch ein Fluch. Passt zur Sammlung.', z2:'Pahl seufzt fürs Protokoll.'},
     ],
     goldfund:[
       {z1:'So viel Gold. Ich brauch keins.', z2:'Pahl rechnet schon mit.'},
       {z1:'Klingt nach Feierabend. Für dich.', z2:'Pahl fragt: für wen sonst?'},
       {z1:'Viel Gold. Wenig Aussicht auf Rente.', z2:'Pahl lacht. Ich nicht.'},
     ],
     kammerAbbruch:[
       {z1:'Nichts gefunden. Passiert den Besten.', z2:'Pahl zählt trotzdem mit.'},
       {z1:'Leere Kammer. Voller Rückweg.', z2:'Pahl seufzt lauter als ich.'},
       {z1:'Manchmal ist leer auch eine Antwort.', z2:'Pahl widerspricht. Natürlich.'},
     ],
     untaetigkeit:[
       {z1:'Der Neue steht. Wie ich. Interessant.', z2:'Pahl findet das gruselig.'},
       {z1:'Willkommen im Klub. Bank ist frei.', z2:'Pahl rückt trotzdem nicht.'},
       {z1:'Steh nicht so rum. Das ist mein Job.', z2:'Pahl übernimmt notfalls.'},
     ],
   }},

  {key:'pahl', name:'Herr Pahl, auf der Bank am Dorfplatz', tx:11, ty:47, opt:'fest', hair:'h4',
   grund:[
     {z1:'Der Neue. Wieder unterwegs.', z2:'Ich sehe zu. Das reicht mir.'},
     {z1:'Sie kämpfen. Ich sehe nur zu.', z2:'Zwei Berufe. Meiner ist leicht.'},
     {z1:'Die Bank ist warm. Ich bleibe.', z2:'Kommentieren wärmt genauso gut.'},
     {z1:'So nannte ich schon viele Neue.', z2:'Der Name bleibt. Sie wechseln.'},
     {z1:'Ob ich ein Vorgang bin? Unhöflich.', z2:'Fragen Sie das nicht noch mal.'},
     {z1:'Die Sonne dreht sich. Ich nicht.', z2:'Kommentar ist auch ein Beruf.'},
   ],
   akt:[
     'Wieder einer, der alles ernst nimmt.',
     'Ein Fest ohne Erlaubnis. Wie hübsch.',
     'Ein Platz bleibt leer. Auffällig leer.',
     'Ein Brief, den keiner lesen will.',
     'Es wird still. Auffällig still hier.',
   ],
   anlass:{
     crit:[
       {z1:'Ein Treffer. Sauber getroffen.', z2:'Lott hat sowas noch nie gesehen.'},
       {z1:'Das saß. Sogar ich hab\'s gemerkt.', z2:'Lott schläft schon wieder.'},
       {z1:'Kritisch. Sehr kritisch sogar.', z2:'Notieren Sie das, Lott.'},
     ],
     levelup:[
       {z1:'Eine Stufe höher. Wie fein.', z2:'Lott zählt bestimmt falsch.'},
       {z1:'Sie wachsen. Ich sitze weiter.', z2:'Lott klatscht schon wieder.'},
       {z1:'Stufenaufstieg. Herzlichen Glückwunsch.', z2:'Lott, klatschen Sie leiser.'},
     ],
     ultimate:[
       {z1:'Das war groß. Richtig groß.', z2:'Lott hat die Augen zugemacht.'},
       {z1:'Ein großer Zauber. Beeindruckend.', z2:'Lott, aufwachen. Das war gut.'},
       {z1:'So viel Kraft für so wenig Feind.', z2:'Lott findet das übertrieben.'},
     ],
     fluch:[
       {z1:'Ein Fluch mehr. Passt zu Ihnen.', z2:'Lott nennt das nur konsequent.'},
       {z1:'Schon wieder ein Haken dabei.', z2:'Lott freut sich klammheimlich.'},
       {z1:'Ein Fluch. Man gewöhnt sich daran.', z2:'Lott gewöhnt sich nie.'},
     ],
     goldfund:[
       {z1:'So viel Gold. Alles echt?', z2:'Lott zählt es heimlich mit.'},
       {z1:'Ein Sack voll Glück. Kommt kaum vor.', z2:'Lott will die Hälfte haben.'},
       {z1:'Reich geworden. Vorübergehend.', z2:'Lott nennt das Statistik.'},
     ],
     kammerAbbruch:[
       {z1:'Nichts gefunden. Auch eine Leistung.', z2:'Lott sieht das anders.'},
       {z1:'Leer rausgekommen. Ehrlich immerhin.', z2:'Lott nennt das Verschwendung.'},
       {z1:'Keine Beute. Kommt öfter vor.', z2:'Lott führt da eine Liste.'},
     ],
     untaetigkeit:[
       {z1:'Der Neue steht. Ich sitze auch.', z2:'Lott findet das gemütlich.'},
       {z1:'Nichts passiert. Endlich Ruhe.', z2:'Lott redet trotzdem weiter.'},
       {z1:'Sie stehen nur. Ich auch.', z2:'Lott hält das für Faulheit.'},
     ],
   }},
];
```

**Warum `opt:'wander'`/`'fest'` statt eines dritten NPC-Systems:** Beide Modi nutzen dieselbe `npcs[]`-Liste, denselben Update-Loop, denselben `DRAW_NPC`-Zeichenpfad. Der einzige Unterschied ist, ob die Wander-Uhr läuft (siehe unten) und woher das Sheet kommt (`CF_NPCS`-Datei oder Held-Komposit). Kein neues Array, kein neuer `DRAW_*`-Wert.

**Warum Zapfs Kessel-Pflichtsatz nicht in der Tabelle steht:** siehe Prüfnotiz zu Zapf in `figuren-dorf.md` — er ist als spätere, gezielte Ergänzung vorgemerkt, nicht Teil dieser Phase.

### NPC-Spawn erweitern: `genMap()` (`index.html:1881` bis `1894`)

Ersetzt den bisherigen Block (der auf `NPC_DEFS` und ein festes `cfnpc_${nd.key}`-Namensschema baute). Neu: Sheet-Schlüssel kommt aus `nd.sheet` (nicht mehr aus `nd.key`), Komposit-Figuren bekommen den gebackenen Schlüssel und einen `fest`-Marker, dazu die Blasenfelder, die bisher nur `knBubble` als Modulvariable kannte:

```js
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
  const idleKey = nd.opt === 'fest' ? `npc_baked_${nd.key}` : `cfnpc_${nd.sheet}_idle`;
  const walkKey = nd.opt === 'fest' ? idleKey : `cfnpc_${nd.sheet}_walk`;
  // sc (Skalierung) wird bewusst nicht hier berechnet: PLAYER_SC ist an dieser
  // Stelle (genMap() läuft beim Skriptstart, lange vor der PLAYER_SC-Deklaration
  // weiter unten) noch in der TDZ. DRAW_NPC berechnet sc pro Zeichenschritt,
  // genau wie drawAlter() es für Knöterich schon immer tut.
  npcs.push({key:nd.key, figur:nd, homeX, homeY, x:homeX, y:homeY, sheetIdle:idleKey, sheetWalk:walkKey,
             fest:nd.opt === 'fest', tint:nd.tint||null, tintA:nd.tintA,
             flip:false, vx:0, vy:0, restT:rr(0,3), phase:rr(0,10),
             bubbleIdx:-1, bubbleText1:'', bubbleText2:'', bubbleHideAt:0});
}
```

**Nachtrag beim Einbau:** Die ursprüngliche Fassung dieses Blocks berechnete `sc` direkt hier über `PLAYER_SC*0.92`. `PLAYER_SC` wird aber erst deutlich weiter unten deklariert (`const PLAYER_SC = 1.8`), `genMap()` läuft dagegen synchron beim Skriptstart, lange davor — das wäre ein `ReferenceError` durch die Temporal Dead Zone gewesen, direkt beim Laden, in jedem Browser. Gefangen durch den Syntax-/Live-Check vor dem Commit, korrigiert wie oben: `sc` wandert in den Zeichenschritt (`DRAW_NPC`, siehe unten), wo `PLAYER_SC` längst initialisiert ist.

### Wander-Update aussetzen für `fest`-Figuren: `index.html:5217` bis `5218`

Eine Zeile am Kopf der bestehenden Schleife, sonst bliebe der Guard wirkungslos:

```js
const NPC_HOME_R = 40, NPC_HOME_R2 = NPC_HOME_R * NPC_HOME_R;
for(const n of npcs){
  if(n.fest) continue;   // W3: Held-Komposit-Figuren stehen fest wie Knöterich, keine Wanderung
  n.restT -= dt;
  ...
```

### Blase zeichnen: `drawBubble()` aus `drawAlter()` herausgelöst (`index.html:5522` bis `5553`)

`drawAlter()` behält sein Verhalten unverändert (Knöterich zeichnet exakt wie vorher), ruft die Blase nur noch über die neue, wiederverwendbare Funktion:

```js
function drawBubble(x, y, text1, text2){
  if(!text1) return;
  ctx.save();
  ctx.textAlign = 'center'; ctx.font = 'bold 11px Courier New';
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
  const key = 'cfbody_idle', hairKey = `cfhair_${KN_HAAR}_idle`;
  const f = animFrame(key, gameT, 7);
  ctx.save();
  ctx.translate(x, y + 9);
  ctx.scale(PLAYER_SC * 0.92, PLAYER_SC * 0.92);
  drawSpriteAt(key, f, '#8a8a8a', 0.82);
  drawSpriteAt(hairKey, f, '#8a8a8a', 0.82);
  ctx.restore();

  if(knBubble.visible) drawBubble(x, y, knBubble.text1, knBubble.text2);
}

function drawAnlage3(x, y){
  ctx.save();
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath(); ctx.ellipse(x, y, 7, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x-6, y-3, 3, 3, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}
```

**Warum eine reine Extraktion und kein Verhaltenswechsel:** `knBubble.visible` bleibt exakt die bisherige Sichtbarkeitslogik aus `knUpdateBubble()`, unverändert. Nur die Zeichenroutine selbst wandert in eine Funktion, damit `DRAW_NPC` sie mitnutzen kann, ohne den Blasencode zu duplizieren.

### `DRAW_NPC`-Case erweitern (`index.html:5417` bis `5420`)

```js
case DRAW_NPC: { drawShadowEllipse(o.x, o.y+4, 9);   // G5: Dorf-Staffage, gleiches Muster wie DRAW_CRITTER
                const nmoving = !!(o.vx||o.vy);
                const nkey = nmoving ? o.sheetWalk : o.sheetIdle;
                const nsc = o.fest ? PLAYER_SC * 0.92 : 1;   // W3: Komposit-Figuren im Held-Maßstab
                drawSprite(nkey, animFrame(nkey, gameT + o.phase, nmoving ? 6 : 3), o.x, o.y, nsc, o.flip, o.tint, o.tintA);
                if(o.key === 'bramsche') drawAnlage3(o.x + 14, o.y + 6);
                if(o.bubbleText1 && gameT < o.bubbleHideAt) drawBubble(o.x, o.y, o.bubbleText1, o.bubbleText2);
                break; }
```

**Warum die Blase hier statt in einem eigenen `pushDraw`-Eintrag:** Sie gehört zur y-Position der Figur, die bereits sortiert im Pool liegt (Regressionsregel 4 — kein zweiter Eintrag, keine zweite Allokation).

**Warum Anlage 3 keine eigene Blase/Kontextaktion bekommt:** laut Kapitel 8 stumm, „sie weckt ihn nicht". Er ist reine Anwesenheit neben Bramsche, kein Interaktionsziel.

### Kontextaktion: neue Konstante, `scanAktion()`, `fuehreAktion()` (`index.html:4117` bis `4178`)

Eine Konstante mehr in der bestehenden Zeile:

```js
const AKT_TUER=1, AKT_SPIEGEL=2, AKT_HEBEL=3, AKT_SCHLOSS=4, AKT_TRUHE=5, AKT_AUSGANG=6, AKT_RESET=7, AKT_GRUSS=8, AKT_NACHFRAGE=9, AKT_AMT=10, AKT_NPC=11;
```

In `scanAktion()`, direkt neben Knöterichs Angebot (`index.html:4144`), **mit der eigenen Weltposition jeder Figur** (nicht `player.x, player.y` — sonst würde jede Figur, sobald sie in Reichweite ist, mit Distanz 0 alles überstimmen, dieselbe Falle wie beim Grußpflicht-Kommentar direkt darüber):

```js
    if(kn.history.length) aktBiete(KN_POS.x, KN_POS.y, AKT_NACHFRAGE, null, 'Nachfragen');
    for(const n of npcs) aktBiete(n.x, n.y, AKT_NPC, n, 'Ansprechen');
    for(const t of kammerTueren) if(t.cd <= 0) aktBiete(t.x, t.y, AKT_TUER, t, 'Betreten');
```

**Warum das die Grußpflicht-Abnahme automatisch erfüllt:** `AKT_GRUSS` bietet weiterhin mit `player.x, player.y` an (Distanz 0), das gewinnt gegen jede Figur, die ihre eigene, von Null verschiedene Distanz einbringt. Ist kein Fluch aktiv, entscheidet allein die Nähe — welche Figur oder Tür am nächsten ist, gewinnt, wie es `aktBiete()` schon immer gemacht hat.

In `fuehreAktion()` (`index.html:4165`ff.):

```js
    case AKT_NACHFRAGE: knNachfragen(); break;
    case AKT_NPC:       npcSprechen(aktObj); break;
    case AKT_AMT:       amtFensterOeffnen(); break;
```

### `npcSprechen()`, direkt unter `fuehreAktion()` (`index.html:4179`ff.)

```js
// W3: Dorf-Figuren ansprechen. Kein Dialogbaum, kein Menü — ein Tastendruck
// schaltet die Figur eine Zeile weiter (Grundzeilen-Kreislauf, zuletzt die
// Aktzeile, die sich mit aktStand() automatisch ändert), Bramsche und der
// Lott/Pahl-Chor weichen davon situativ ab, siehe unten.
function npcCycle(n, fig){
  n.bubbleIdx = (n.bubbleIdx + 1) % (fig.grund.length + 1);
  if(n.bubbleIdx < fig.grund.length){
    const p = fig.grund[n.bubbleIdx];
    n.bubbleText1 = p.z1; n.bubbleText2 = p.z2;
  } else {
    n.bubbleText1 = fig.akt[aktStand() - 1]; n.bubbleText2 = '';
  }
}
function npcSprechen(n){
  const fig = n.figur;
  if(fig.key === 'bramsche'){
    if(bramscheFragePending){
      const qa = fig.antworten[Math.floor(Math.random() * fig.antworten.length)];
      n.bubbleText1 = qa.z1; n.bubbleText2 = qa.z2;
      bramscheFragePending = false; n.bramscheJustAsked = true;
    } else if(n.bramscheJustAsked){
      const ab = fig.abweisung[Math.floor(Math.random() * fig.abweisung.length)];
      n.bubbleText1 = ab.z1; n.bubbleText2 = ab.z2;
      n.bramscheJustAsked = false;
    } else {
      npcCycle(n, fig);
    }
  } else if(fig.anlass){
    const pool = letzterAnlass ? fig.anlass[letzterAnlass] : null;
    if(pool && pool.length){
      const line = pool[Math.floor(Math.random() * pool.length)];
      n.bubbleText1 = line.z1; n.bubbleText2 = line.z2;
    } else {
      npcCycle(n, fig);
    }
  } else {
    npcCycle(n, fig);
  }
  n.bubbleHideAt = gameT + 4;
}
```

**Warum Bramsches Grundzeilen-Kreislauf nicht bei jedem Ansprechen zusätzlich zur Frage läuft:** die Abnahme verlangt „eine Frage pro Schicht, Antworten aus einer Tabelle" als ihre Hauptfunktion. Erstes Ansprechen in einer Schicht beantwortet die Frage, das zweite weist ab (ihre Sprachmarke: „fragt zurück, statt zu antworten"), jedes weitere fällt in denselben Grundzeilen-Kreislauf wie bei jeder anderen Figur zurück — sie bleibt ansprechbar, wird aber nicht zur Dauerschleife aus Abweisungen.

**Warum Lott/Pahl dauerhaft auf `letzterAnlass` reagieren, nicht nur kurz danach:** kein neues Zeitfenster, keine zweite Uhr neben den bestehenden Knöterich-Bremsen. „Kommentieren die letzte Aktion des Spielers" wird wörtlich genommen — die letzte, nicht nur die jüngste. Erst wenn ein neuer Anlass eintritt, wechselt der Kommentar.

### `letzterAnlass` und `bramscheFragePending`, neben den bestehenden Sitzungsvariablen (`index.html:3248`)

```js
const knRand = {active:false};
// W3: Sitzungszustand für Dorf-Figuren, nicht persistiert, wie kn.history schon
// nicht die Anlässe selbst speichert, sondern nur gezeigte Zettel.
let letzterAnlass = null, bramscheFragePending = false;
```

### Ein-Zeilen-Hook in `knRandnotiz()` (`index.html:3338`)

Fängt alle sieben bestehenden Anlässe ab, ohne einen einzigen neuen Aufrufort. **Vor** den Gates, weil das Ereignis auch dann stattgefunden hat, wenn Knöterich gerade schweigt oder sein 40-Sekunden-Fenster noch läuft — Lott und Pahl teilen sich dieses Fenster nicht:

```js
function knRandnotiz(anlass){
  letzterAnlass = anlass;   // W3: Lott/Pahl kommentieren das, unabhängig von Knöterichs eigenen Gates
  const pool = RANDNOTIZ[anlass]; if(!pool || !pool.length) return false;
  if(!knLineErlaubt(anlass)) return false;
  ...
```

### `aktStand()`, neben `nachSchicht()` (`index.html:6060`)

```js
// W3: Aktstand aus der bestehenden Schichtzahl abgeleitet, nichts Neues
// gespeichert. Deckt sich mit Kapitel 9: Akt I = Schicht 1-10 (amt.schichten
// 0-9), ... Akt V ab Schicht 41 (amt.schichten >= 40), gedeckelt bei 5.
const aktStand = () => Math.min(5, Math.floor(amt.schichten / 10) + 1);
```

### `bramscheFragePending` in `startShift()` scharfstellen (`index.html:5999`)

Gleiches Muster wie `knBegruessungPending` direkt darüber — ein Flag pro Schicht, kein Persistenzbedarf:

```js
  if(amt.schichten >= 1) knBegruessungPending = knBegruessungLine();
  bramscheFragePending = true;   // W3: eine Frage pro Schicht, neu scharf ab der nächsten
}
```

### Zeichendeckel-Assertion erweitern: `knAssertCaps()` (`index.html:3210`ff.)

Eine zusätzliche Schleife über `DORF_FIGUREN`, gleiches Prüfmuster wie die bestehenden Tabellen:

```js
  for(const anlass in RANDNOTIZ) for(const l of RANDNOTIZ[anlass]) rows.push([l,44]);
  for(const s in KN_TRAENKE_GAGS) rows.push([KN_TRAENKE_GAGS[s],44]);
  // W3: Dorf-Figuren, gleicher Deckel wie Knöterichs Kanäle (z1<=48, z2<=32,
  // Einzeiler<=44). antworten/abweisung/anlass sind optionale Felder.
  for(const fig of DORF_FIGUREN){
    for(const p of fig.grund) rows.push([p.z1,48],[p.z2,32]);
    for(const a of fig.akt) rows.push([a,44]);
    if(fig.antworten) for(const qa of fig.antworten) rows.push([qa.z1,48],[qa.z2,32]);
    if(fig.abweisung) for(const ab of fig.abweisung) rows.push([ab.z1,48],[ab.z2,32]);
    if(fig.anlass) for(const key in fig.anlass) for(const p of fig.anlass[key]) rows.push([p.z1,48],[p.z2,32]);
  }
```

### `placeMonsters()`: Dorf-Figuren-Kacheln aussparen (`index.html:2593` bis `2594`)

Das Dorf ist bereits monsterfrei (`inVillageT`-Guard direkt darunter), alle elf Heimatanker liegen innerhalb von `VILLAGE`. Keine Codeänderung nötig — die bestehende Zeile deckt den Fall vollständig ab:

```js
      if(inVillageT(tx,ty)) continue;            // G5: das Dorf bleibt monsterfrei — deckt auch W3-Figuren ab
```

## Was in W3 ausdrücklich nicht angefasst wird

* Kein neues Panel, kein Dialogbaum, keine Antwortauswahl. `npcSprechen()` schreibt ausschließlich in die vorhandenen Blasenfelder des jeweiligen NPC-Objekts.
* Kein neuer `localStorage`-Schlüssel. `letzterAnlass` und `bramscheFragePending` sind Sitzungsvariablen wie `knBegruessungPending`, nicht persistiert.
* Kein Eingriff in Knöterichs Zettel-, Randnotiz- oder Eskalationslogik. Die einzige Zeile in seinem Bereich ist `letzterAnlass = anlass;`, vor seinen eigenen Gates.
* Kein neuer Sound. Die Audio-Phase gilt als abgeschlossen, `sfx.*` bleibt unverändert.
* Keine Langvorgänge aus Kapitel 10, kein Rang-/Anredesystem aus Kapitel 17/18.5, kein `amt.akt`-Feld, keine Ausfertigung, keine Kontextaktion „Zustellen" — das ist W4/W5.
* Zapfs Kessel-Pflichtsatz aus Kapitel 8 wird nicht spekulativ eingebaut, siehe Prüfnotiz in `figuren-dorf.md`.

## Abnahme W3

* Elf Figuren stehen im Dorf, acht davon sichtbar wandernd (eigenes Sprite), drei fest (Held-Komposit), alle mit `F` ansprechbar, alle optisch unterscheidbar.
* Wiederholtes Ansprechen schaltet die Grundzeilen im Kreis, die letzte Station ist die aktuelle Aktzeile. Kein Dialogbaum, keine Auswahl.
* `aktStand()` liefert 1 bei `amt.schichten` 0 bis 9, steigt alle zehn Schichten, deckelt bei 5 ab Schicht 40.
* Lott und Pahl kommentieren `letzterAnlass`, sobald einer eingetreten ist; ohne Anlass laufen sie im normalen Grundzeilen/Aktzeilen-Kreislauf.
* Bramsche beantwortet die erste Frage jeder Schicht aus `antworten`, weist beim nächsten Ansprechen einmal ab, fällt danach in den normalen Kreislauf zurück. Nach `startShift()` steht wieder eine Frage bereit.
* Keine Figur blockiert einen Weg (keine Kollisionsprüfung gegen `npcs[]` existiert im Spiel, wie schon bei Knöterich). `placeMonsters()` setzt kein Monster ins Dorf, `DORF_FIGUREN` liegt vollständig innerhalb von `VILLAGE`.
* Bei aktivem Fluch Grußpflicht und einem ungegrüßten Monster in Reichweite gewinnt **Grüßen** gegen jede Figur (Distanz 0 vs. echte Distanz). Ohne den Fluch gewinnt, wer am nächsten steht.
* `knAssertCaps()` meldet keine Verletzung für `DORF_FIGUREN` in der Konsole.
* Kein Text verrät Kesselgrammatik — bereits dreistufig gegen `figuren-dorf.md` geprüft, beim Einbau nur auf Zeichengleichheit zu kontrollieren, keine inhaltliche Neuprüfung nötig, solange kein Text umformuliert wird.
* Regressionsschutz unverletzt: `npcSprechen()`/`npcCycle()` laufen nur bei Tastendruck, nicht im Renderpfad; `drawBubble()` alloziert nichts pro Frame; `DRAW_NPC` bleibt im bestehenden Pool-Zeichenpfad; kein `Math.hypot`; HUD-Wege unangetastet.
* 300 Frames mit Zaubern, mehreren angesprochenen Figuren (darunter Bramsche zweimal hintereinander und danach ein drittes Mal) und offenem Kessel-Panel ohne Exception, lokal und live.

## Bewusst offen für spätere Bauabschnitte

* **W4** (Schwarzes Brett) kann Pommer oder Nörgel später als Kommentarstimme für Dienstaufträge nutzen, das ist hier nicht vorweggenommen.
* **W5** (Der Vorgang) hat entschieden: `aktStand()` bleibt unverändert übernommen, kein gespeichertes Feld. Siehe `phase-w5-vorgang.md`, Abschnitt „Korrektur zur Weltbibel".
* Zapfs Kessel-Pflichtsatz („Der Kessel ist kein Kessel. Der Kessel ist ein Kopierer.") wartet auf einen gezielten Einbauort, z. B. eine sechste Aktzeile oder einen einmaligen Bonus-Satz nach einer bestimmten Anzahl Ansprachen. Nicht spekulativ vorgebaut.

## Live geprüft

Node-Syntaxcheck (`node --check`) über den extrahierten Skriptblock, danach live im Browser (`python3 serve.py 8378`):

* Start, Dienst antreten, Konsole leer (Zeichendeckel-Assertion und `assertRigRegistrations()` melden nichts).
* Alle elf `DORF_FIGUREN`-Sheets in `SHEETS` vorhanden, keins fehlt (`npc_baked_bramsche`/`_lott`/`_pahl` korrekt gebacken, acht `cfnpc_*`-Paare korrekt registriert, auch Fins 9-spaltiges Sheet).
* Milb angesprochen: sechsmaliges `F` schaltet die sechs Grundzeilenpaare durch, das siebte zeigt die Aktzeile („Die neue Kraft schätze ich auf Zwei.“, Akt I bei `amt.schichten=0`).
* Bramsche: erstes Ansprechen beantwortet eine zufällige Frage und setzt `bramscheFragePending=false`, zweites Ansprechen weist ab, drittes fällt in den normalen Grundzeilen-Kreislauf zurück.
* `knRandnotiz()` real aufgerufen (nicht nur `letzterAnlass` manuell gesetzt): der Ein-Zeilen-Hook greift, Lott und Pahl lesen danach korrekt aus `fig.anlass[letzterAnlass]`, ohne Anlass korrekt aus dem Grundzeilen/Aktzeilen-Kreislauf.
* `aktStand()` gegen `amt.schichten` 0/9/10/19/20/39/40/49/60 geprüft: liefert 1/1/2/2/3/4/5/5/5, exakt wie in Kapitel 9 vorgegeben.
* **Ein Fund beim Einbau, sofort korrigiert:** `sc:PLAYER_SC*0.92` im ursprünglichen Spawn-Block hätte einen `ReferenceError` durch die Temporal Dead Zone ausgelöst (`genMap()` läuft vor der `PLAYER_SC`-Deklaration). Verschoben in `DRAW_NPC`, siehe Nachtrag oben. Alle anderen Blöcke liefen im ersten Anlauf fehlerfrei.
* Bei der Live-Prüfung fiel auf, dass das automatisierte Browser-Tab als `document.hidden` läuft und `requestAnimationFrame` dadurch kaum tickt — reines Artefakt der Testumgebung, kein Spielfehler. Umgangen durch direkte Aufrufe von `scanAktion()`/`update()`/`render()` über die Konsole.
