## IN1: Drei Türen gehen auf — ERLEDIGT (26.08.2026)

Ausgelöst von einer Frage, die aus dem Bauch kam und trotzdem genau richtig
gezielt hat: *„Könnten wir mit dem was wir haben indoors bauen? Das Amt. Das
Wirtshaus? Nicht perfekt aber 2-3 Gebäude zum betreten wäre super für die Story
und Charaktere."*

Die Antwort steht schon zweimal im Kanon, beide Male als Notlösung, beide Male
mit demselben Grund. `weltgeschichte.md`, im Abschnitt über die Umsetzung der
Szenen:

> **Szene 2 hängt an Kordula Umlauf, nicht am Gasthaus.** Ein Gasthaus als
> betretbares Gebäude gibt es nicht.

> **Szene 3 hängt im Amtspanel**, neben der Gießkanne, weil die Amtsstube kein
> begehbares Inneres hat.

Beide Sätze sind seit heute falsch, und das ist der ganze Zweck dieses
Bauabschnitts. Er baut keine neue Mechanik, er nimmt zwei Entschuldigungen weg.

---

## 1. Welche drei, und warum nicht vier

Die Auswahl ist keine Geschmacksfrage. Die Weltgeschichte nennt vier Orte in
einem Satz, als im Finale der Postregen fällt:

> Sie kommen im Amt an, im Gasthaus, in der Registratur, auf dem Dorfplatz.

Der Dorfplatz war immer da. Die anderen drei waren bis hier Text. Sie liegen
jetzt hinter drei Türen:

| Gebäude in `VILLAGE_BUILDINGS` | Blatt | Raum |
|---|---|---|
| `amt` | `Inn_Blue.png` | **Amtsstube** |
| `haus2` | `House_2_Wood_Base_Blue.png` | **Registratur** |
| `haus3` | `House_3_Stone_Base_Blue.png` | **Zum Letzten Stempel** |

`haus1`, `markt` und `scheune` bleiben zu. Ein Dorf, in dem jede Tür aufgeht,
hat keine Häuser mehr, sondern einen Grundriss.

Dass ausgerechnet das **Amt** auf dem Inn-Blatt steht, ist eine Altlast aus G5
und bleibt stehen. Es ist das größte, offiziellste Blatt im Paket, es hat eine
mittige Tür unter einem Vordach, und das Gasthaus daran umzuhängen hieße, die
gesamte G7-Vermessung des Dorfes noch einmal zu machen — fünfzehn Kacheln
Fußabdruck, elf Figurenanker, `dorfSichtAssert()`. Der Preis wäre der ganze
Bauabschnitt für einen Tausch, den niemand sieht.

## 2. Die Tür sitzt da, wo sie gemalt ist

Der erste Fund, und er betraf eine Zahl, die seit G5 danebenstand.

`AMT_TUER` war die Mitte der Südkante des Fußabdrucks. Das Amt ist fünfzehn
Kacheln breit, seine gemalte Tür sitzt **zwei Kacheln links** davon. Aufgefallen
ist das nie, weil ein Panel keine Schwelle hat, durch die man danebengehen kann
— man drückte `F` irgendwo an der Fassade, und es ging auf.

Sobald man wirklich hineingeht, ist es sichtbar: die Figur verschwindet in der
Wand, während die gemalte Tür daneben zu bleibt.

`CF_BLD` trägt deshalb seit IN1 ein viertes gemessenes Feld, `tuerDx`, den
Versatz der Türmitte gegen den Fußanker in Blattpixeln:

| Blatt | ax | tuerDx | Spalte |
|---|---|---|---|
| `Inn_Blue.png` | 120 | **−16** | 104 |
| `House_2_Wood_Base_Blue.png` | 72 | **−33** | 39 |
| `House_3_Stone_Base_Blue.png` | 72 | **+17** | 89 |

Drei Blätter, drei verschiedene Stellen. Eine gemittelte Zahl hätte alle drei
verfehlt.

**Gemessen wurde am gerasterten Blatt, nicht automatisch gefunden.** Der erste
Anlauf suchte die dunkelste zusammenhängende Spaltengruppe im unteren Drittel
und fand bei allen sechs Dorfgebäuden dasselbe: den Schattenrand am rechten
Bildrand. Ein Automat, der eine Tür in einem Fachwerkhaus zuverlässig findet,
wäre ein größeres Werkzeug als dieser Bauabschnitt.

Also dasselbe Verfahren wie bei den `deck`-Werten aus G6: ablesen, eintragen,
und ein Werkzeug daneben stellen, das die eingetragene Zahl **prüft**.
`tools/innen-tuer-messlauf.mjs` stellt drei Fragen, die eine Tür ohne Ausnahme
erfüllt und eine Wand nicht — reicht das Blatt an dieser Spalte bis zur
Fußlinie, steht dort mehr Holz als im Blattdurchschnitt, und liegt die Spalte
innerhalb des Blattes statt auf seiner Umrisslinie. Es druckt außerdem das
Braunprofil des unteren Viertels mit der eingetragenen Spalte darunter, damit
beim vierten Haus jemand sieht, wo er hinschauen muss.

## 3. Gebaut ist es wie eine Kammer, und sonst wie nichts

Der Trick steht seit G1 in `betreteKammer()`: Oberwelt einfrieren, Karte
überschreiben, beim Hinausgehen zurückholen. `betreteHaus()` macht dasselbe mit
einem eigenen `innenSave` und `currentLevel = 4`.

Was **nicht** von der Kammer kommt, ist der Rest. Kein Modul, kein Tor, kein
Wächter, keine Truhe, keine Schwierigkeit. Ein Innenraum ist ein gezeichneter
Grundriss mit Möbeln darin, und das ist absichtlich das ganze Verfahren: was man
betreten kann, muss nichts von einem wollen.

**Der Grundriss ist die Tabelle.** Jeder Raum ist ein Feld aus Zeichenketten:

```
    plan: [
      '###############',
      '#F..W......W.F#',
      '#.............#',
      '#.Xxxxx...Hh..#',
      '#.....Z.......#',
      '#..Tt....Tt...#',
      ...
      '######AA#######',
    ],
```

Großbuchstabe heißt *hier fängt ein Möbel an*, derselbe Kleinbuchstabe daneben
heißt *dasselbe Möbel geht weiter*. Eine Theke über fünf Felder ist `Xxxxx`, und
der Zeichner bekommt seine Breite mitgeteilt, statt sie zu raten. Zwei Möbel
können nicht auf demselben Feld stehen, weil ein Feld ein Zeichen trägt — das
ist keine Prüfung, das ist Bauart.

Die Kollision kostet keine Zeile: ein Möbelfeld wird auf `G_BLOCK` gesetzt, und
`G_BLOCK` steht nicht in der `WALKABLE`-Whitelist. `computeTile()` malt es
trotzdem als Boden, das Möbel liegt darüber und geht mit seiner Fußlinie in
dieselbe y-Sortierung wie Spieler und Figuren. Man läuft hinter einem Regal her
und wird davon verdeckt.

## 4. Das Material ist das, was da war

Das Grafikpaket hat einen vollständigen Innenraumsatz. `Houses_Interiors` mit
Dielenboden, Innenwänden und Treppen, `House_Decor` mit Betten, Regalen,
Tischen, Kaminen, Türen, Teppichen und einer 1040x384 großen Küche. Im Manifest
stehen sie alle.

Im Repo liegt davon **keine einzige Datei**. `assets/cf/` trägt seit G5
ausschließlich, was das Spiel wirklich lädt, und die Rohbibliothek ist aus
Lizenzgründen nirgends abgelegt (`assets/cf/README.md`). Wer `indoors` sagt und
den Innenraumsatz meint, braucht zuerst einen Zugriff, den diese Sitzung nicht
hat.

Der Bauabschnitt nimmt die Frage deshalb wörtlich: *mit dem was wir haben.*

* **Boden und Wand** kommen aus den Kammerblättern (`DUN_SET`), warm überfärbt.
  Ein eigener Bäcker (`bakeInnenTile`) statt eines Umbaus an `bakeDunTile` — der
  Kammerweg bleibt bitgleich, wie er war.
* **Kiste, Krug, Spinnwebe, Fackel** sind die vier Objekte aus G1/M3.
* **Das Herdfeuer** ist `camp_pot` aus W-Lager, das bisher nur im Lager der
  Beschwerden hing.
* **Alles andere ist gezeichnet.** Theke, Tische, Bänke, Regale, Pult,
  Schreibtische, der Aktenstapel, der Stuhl und die Pflanze entstehen aus
  ctx-Grundformen, in denselben Farben und derselben Bauart wie der Kessel und
  die Grube im Steinfeld.

Wer den Innenraumsatz eines Tages danebenlegt, tauscht `INN_SAETZE` und die
Möbelzeichner und lässt alles andere stehen. Bis dahin ist es nicht perfekt, und
begehbar war der Punkt.

*(Der Tag war derselbe. Was ab hier steht, beschreibt den Stand ohne die
Blätter — er ist seit der Nachlese der Ersatzweg und nicht mehr die einzige
Fassung. Siehe Abschnitt 9.)*

### Zwei Funde beim Hinsehen

**Erstens: eine Amtsstube voller Birken.** `trees` und `decos` werden von der
Zeichenliste ohne jede Levelprüfung gelesen — die Kammer räumt sie seit G1 an
derselben Stelle weg (`baueWandProps()` setzt `trees` auf die Wandfelsen um), und
das steht nirgends als Regel, sondern nur als Nebenwirkung im Code. Der erste
Lauf zeigte den Wald mitten im Amt.

**Zweitens: eine Wand, die keine war.** Der erste Anlauf gab Boden und Wand
dieselbe Farbe und der Wand ein paar Prozent mehr Deckung. Im laufenden Bild las
sich der Raum dann als Lichtung mit Möbeln darauf. `INN_SAETZE` trägt seither
zwei getrennte Töne, und die Wand ist in jedem Raum die deutlich dunklere —
derselbe Befund wie bei `DUN_SET` Satz 2, wo die Helligkeit die Bedeutung trägt
und nicht die Textur.

**Und einer beim Zeichnen:** von oben sieht ein Tisch aus wie eine Bank. Was die
beiden unterscheidet, ist nicht die Breite, sondern die **Höhe** — eine hohe
Platte auf vier sichtbaren Beinen gegen ein niedriges Brett auf zweien. Im
Wirtshaus steht außerdem auf zwei von drei Tischen ein Krug, und das sagt in
einem Blick, was für ein Raum das ist.

## 5. Wer drinsteht

Ein leerer Raum ist eine Kulisse. Der Auftrag sagte ausdrücklich *für die Story
und Charaktere*, also gehen drei Figuren hinein — aber keine steht zweimal
irgendwo.

Der Schalter ist nicht neu erfunden. Es ist derselbe, den die Gesprächsbäume seit
F1 als `phase:'feierabend'` benutzen: letztes Viertel der Schicht.

| Raum | Wer | Warum genau der |
|---|---|---|
| **Zum Letzten Stempel** | Wirt Fass, hinter der Theke | Ein Wirt gehört in sein Gasthaus. `figuren-leben.md`: *„Er hält sein Gasthaus für den Ort, an dem der Tag aufhört."* Und ab Akt II sitzt Kordula Umlauf an einem Tisch, weil die Weltgeschichte sie genau dorthin setzt: *„Einmal in diesem Akt sitzt eine fremde Frau im Letzten Stempel."* |
| **Registratur** | Registratorin Bramsche | Ordnung ist, was man wiederfindet, und wiederfinden kann man es nur dort, wo es liegt. |
| **Amtsstube** | Nörgel, an seinem Schreibtisch | Der Letzte im Haus. Seit einundvierzig Jahren auf Probe, und er unterschreibt Lisbeths Bericht, weil er im Dienst ist. Dass er der Einzige ist, der abends noch da sitzt, muss niemand sagen. |

**Ohne Schichtuhr ist immer Feierabend.** Im freien Spiel stehen die drei
dauerhaft in ihren Häusern. Das ist keine Ausrede, sondern die Wahrheit über das
freie Spiel: dort hört kein Tag auf, also geht auch niemand mehr heim.

Die Figuren kommen aus `DORF_FIGUREN`, nicht aus einer zweiten Liste. Dieselbe
Figur, dieselben Zeilen, derselbe Gesprächsbaum, dieselben Aktzeilen, derselbe
Langvorgang — nur an einem anderen Ort. `figHier()` entscheidet, wo sie gerade
steht, und liegt neben `figDa()` aus W11, weil es dieselbe Art Frage ist.

Knöterich bleibt draußen. Er steht nicht in `DORF_FIGUREN`, er steht im Haus
(`KN_POS`, `drawAlter`), und ihn hineinzuziehen hieße, den Dienstzettel, die
Empfangsszene und vier Guards anzufassen. Dass ausgerechnet der Amtsrat vor
seinem Amt steht statt darin, ist außerdem keine Lücke, sondern die Figur.

## 6. Was in der Amtsstube steht

Die leere Stelle, jetzt mit Fußboden.

* **Der Schreibtisch der Amtsleitung**, rechts, unberührt. Auf ihm die Pflanze,
  die lebt (Weltbibel: *„Auf dem Schreibtisch steht eine Pflanze. Sie lebt."*).
  In ihm zwei Schubladen, und die untere steht einen Strich vor: sie klemmt.
* **Die zweite Schublade** ist seit IN1 eine Kontextaktion an diesem
  Schreibtisch. Die Zeile im Amtspanel bleibt daneben stehen und ruft dieselbe
  Funktion — die Szene läuft ohnehin genau einmal, und ein zweiter Weg zu einer
  Einmalszene ist kein zweiter Kanon, sondern eine zweite Tür.
* **Das Dienstpult**, links. Hier nimmt man Feierabend.
* **Eine Regalwand**, zwei Kisten, ein Krug, zwei Fackeln, und dazwischen sehr
  viel Platz. Der Raum ist zu groß für die zwei Leute, die noch da sind, und das
  ist die einzige Aussage, die er über sich macht.

**Der Feierabend ist um drei Schritte länger geworden.** Bis IN1 bot die Fassade
direkt das Amtspanel an; jetzt bietet sie *Betreten* an, und das Panel hängt
drinnen am Pult. Das ist der einzige Preis dieses Bauabschnitts am laufenden
Spiel, er ist bewusst bezahlt, und er ist rücknehmbar: eine Zeile in
`scanAktion()` gibt der Fassade ihr Panel zurück.

## 7. Der Preis: die Karte ist eine

Ein Innenraum überschreibt `map` komplett, genau wie eine Kammer. Alles, was
daran hängt, muss beim Hinausgehen bitgleich zurückkommen: Karte, Bäume, Deko,
Viecher, Figuren, Monster, Beute, Geschosse.

Das ist die teuerste Zusage des Abschnitts, und deshalb ist sie die erste, die
`tools/innen-pruef.mjs` misst — drei Besuche, danach derselbe FNV-Hash über
`map` und dieselben sechs Listenlängen wie vorher.

Zwei Stellen mussten dafür aufgemacht werden, und beide sind Funde:

* **`gespraechAktualisieren()` bestand auf `currentLevel === 1`.** Eine Tafel,
  die drinnen aufgeht, wäre im selben Bild wieder zugefallen. Die Frage, die
  diese Zeile stellt, ist nicht *welche Ebene*, sondern *steht die Figur noch
  neben mir* — und `npcs.indexOf()` beantwortet sie in beiden Welten.
* **`anlage2Allein()` hätte drinnen immer „allein" gesagt.** Sie prüft, ob eine
  Dorffigur in Hörweite steht, und gab für alles außer der Oberwelt sofort
  `true` zurück. Anlage 2 hätte also mitten im vollen Wirtshaus ihre leisen,
  echten Zeilen gebracht — genau die, die niemand hören soll.

Nicht gespeichert wird im Haus, aus demselben Grund wie in der Kammer: der
Spielstand kennt die Oberwelt, und ein halb gesicherter Ort ist schlimmer als
keiner. Wer drinnen auf Speichern drückt, bekommt den Grund gesagt.

## 8. Geprüft

`innenAssert()` läuft auf Skriptebene wie `dorfMassstabAssert()` und misst neun
Dinge an den Tabellen, ohne ein einziges Bild: rechteckige Grundrisse,
geschlossene Wände, genau ein zusammenhängender Ausgang und der in der Südwand,
nur bekannte Zeichen, keine Fortsetzung ohne Anfang, Bewohner auf begehbarem
Boden und in `DORF_FIGUREN`, ein gemessenes `tuerDx` je betretbarem Haus, die
Schwelle innerhalb des Fußabdrucks, und Grundrisse, die auf die Karte passen.

`tools/innen-pruef.mjs` misst neunzehn Dinge am laufenden Spiel:

```
19 von 19 Pruefungen bestanden.
```

Darunter der Rundweg aus Abschnitt 7, die Sperrung jedes einzelnen Möbelfeldes
gegen den Grundriss, der Tagesablauf in beiden Richtungen (zum Feierabend
drinnen und nicht draußen, davor umgekehrt), die vier Kontextangebote, die
Schublade in Akt I und in Akt III, das Gespräch im Haus, die Speichersperre,
`startShift()`, das den Spieler aus dem Haus holt, und seit der Nachlese der
Ersatzweg ohne die Innenraumblätter.

`tools/innen-tuer-messlauf.mjs` misst neun Dinge an den drei Blättern (siehe
Abschnitt 2).

## 9. Nachlese am selben Tag: die Blätter kamen doch (27.08.2026)

Abschnitt 4 endet mit dem Satz, wer den Innenraumsatz eines Tages danebenlege,
tausche `INN_SAETZE` und die Möbelzeichner und lasse alles andere stehen. Der Tag
war derselbe. Der Projektinhaber hat das Pack nachgereicht, mit dem Satz *„Etwas
spät ich weiß aber guck mal trotzdem drüber ob du noch was brauchen kannst."*

Gebraucht wurden zwölf Dateien, zusammen 7 KB, und **alles andere ist stehen
geblieben** — Grundriss, Möbeltabelle, Kollision, Tagesablauf, Guard, Prüflauf.
Der Satz stimmte.

### Was das Pack zeichnet, und was das Haus behält

`tools/innen-zellen.mjs` legt die zwölf nach `assets/cf/innen/`: sechs ganze
Blätter (Boden, drei Wandfüller, Regale, Kamin) und sechs geschnittene Zellen
(Tisch, Stuhl, Dienstpult, zwei Schreibtische, Pflanze). Die Koordinatentabelle
steht im Quelltext, `--pruef` rechnet sie nach — dieselbe Haltung wie bei
`tools/ui-zellen.mjs`, und aus demselben Grund: von Hand geschnitten heißt nicht
nachprüfbar.

Geschnitten wird, wo aus einem großen Blatt eine einzige Zelle gebraucht wird.
Aus `Tables.png` (14 KB) genau ein Tisch, aus `House_Plants.png` (15 KB) genau
eine Pflanze; ganz eingebacken wären das 29 KB für zwei Möbel.

Sieben Buchstaben des Grundrisses zeichnen seither aus dem Pack: `R` Regal,
`T` Tisch, `Z` Stuhl, `D` Dienstpult, `S` Schreibtisch, `E` Kommode, `H` Kamin.

**Vier bleiben gezeichnet, und das ist kein Rest, sondern ein Befund.** Die
**Theke** hat im Pack kein Gegenstück: `Kitchen.png` ist eine Frontansicht, also
Hängeschränke von vorn gesehen, und ein Küchenschrank ist ohnehin keine
Schankstube. Die **Bank** auch nicht: `Chairs.png` hat Sofas, und ein Sofa ist
keine Wirtshausbank. *(Berichtigt am 27.08.2026, Abschnitt 11: die Bank stand in
`Outdoor decoration/`, und dort war nicht gesucht worden. Sie kommt seither aus
dem Pack.)* Dazu der **Aktenstapel** und die **Spinnwebe**. Sie haben
mit der Nachlese trotzdem etwas bekommen — das Gewicht der Packmöbel: dicke
Platte, geschlossener Unterbau, dunkle Kontur. Die dünne Fassung las sich neben
einem echten Tisch als schwebendes Brett.

### Der Ersatzweg bleibt, und er wird ausgelöst

Alle zwölf Blätter sind mit `optional:true` registriert. Das ist keine Vorsicht,
sondern eine Reihenfolgefrage: die lizenzierte Grafik kommt im Pages-Build aus
einem zweiten Repo, und bis die zwölf dort liegen, gibt es sie im ausgelieferten
Spiel nicht. Fehlen sie, fällt `drawInnenMoebel()` auf
`drawInnenMoebelGezeichnet()` zurück und `innenTile()` auf die überfärbten
Kammerblätter — also auf genau die Fassung, die auf den Bildern in diesem
Dokument steht.

`tools/innen-pruef.mjs` löst den Weg aus: es nimmt die zwölf Blätter zur Laufzeit
aus `SHEETS`, backt jede Kachel jedes Raumes neu und zeichnet jedes Möbel. Ein
Ersatzweg, den niemand auslöst, ist eine Behauptung.

### Drei Funde aus dem Bild

**Erstens: eine Ziegelwand bis zum Bildrand ist kein Raum.** Die Fülltexturen
sind nahtlos, und der erste Lauf hat sie über die ganze Karte gekachelt. Das Bild
war ein Muster, keine Stube. Mauerwerk bekommt seither genau der Rand, den der
Grundriss selbst zeichnet; außerhalb seines Rechtecks bleibt es dunkel. Denselben
Satz hat die Kammer seit G1 im Kommentar stehen — *„Der Rest der Karte bleibt
gebackene Dunkelheit"* —, nur stand dort nicht, warum.

**Zweitens: ein Boden wird nicht gestreut.** `Wood_Floor_Tiles.png` legt vier
16er-Zellen zu einem 32er-Muster zusammen. Per `tileHash` gestreut wie das Gras
draußen, zerfällt der Verband. Drinnen liegt ein Boden, also wird er an der
Weltposition festgemacht (`x & 1`, `y & 1`). Dasselbe gilt für die Wandfüller,
nur modulo ihrer Zellenzahl.

**Drittens: die erste Pflanze war ein Kaktus.** Die linke Spalte von
`House_Plants.png` ist eine Kakteenspalte, und ein Kaktus ist die Pflanze, die
man gerade **nicht** gießt. Das ist ein anderer Witz als der, um den es hier
geht. Genommen wurde die dritte Spalte, eine buschige Blattpflanze im Tontopf.

### Was die Räume seither unterscheidet

| Raum | Wand | Boden |
|---|---|---|
| **Amtsstube** | grauer Bruchstein, wie der Sockel des Inn-Blattes | warmer Ziegel |
| **Zum Letzten Stempel** | Ziegelbraun | dunkle Dielen |
| **Registratur** | roter Ziegel | kalter Stein |

Kalt an den Wänden und warm unter den Füßen im Amt, rundum Holz im Wirtshaus,
kalter Stein zwischen roten Ziegeln in der Registratur. Man erkennt den Raum
beim Betreten, ohne die Ortszeile zu lesen — und dazu kommt ein weicher dunkler
Saum auf jeder Bodenkachel, über der eine Wand steht. Das ist der billigste
Trick, mit dem eine Wand von oben Höhe bekommt.

## 10. Bewusst offen

* **Ein zweites Stockwerk.** `Wood_Stairs` steht im Manifest. Eine Treppe ohne
  oberes Geschoss wäre dieselbe Behauptung, die M3 bei der Leiter abgelehnt hat.
* ~~**Fenster.** Von innen sieht kein Raum nach draußen. Das Paket hat ein
  `windows`-Blatt, im Repo liegt es nicht, und gezeichnete Fenster ohne Aussicht
  wären Deko ohne Aussage.~~ **Erledigt am 27.08.2026, Abschnitt 11.** Das Blatt
  liegt seit der zweiten Nachlese im Repo, und die Aussage war die ganze Zeit da:
  hinter der Scheibe steht Abend, weil man zum Feierabend hineingeht. Bisher nur
  im Wirtshaus — in den beiden anderen Räumen ist die Nordwand voller Regale.
* **Ein Tagesablauf, der diesen Namen verdient.** Was hier steht, ist ein
  Schalter mit zwei Stellungen. Wer den Figuren wirklich einen Tag geben will,
  braucht mehr als das letzte Viertel der Schicht — und dann ist es ein eigener
  Bauabschnitt und keine Zeile.
* **Der Postregen.** Er kommt laut Weltgeschichte im Amt an, im Gasthaus und in
  der Registratur. Alle drei sind seit heute Orte. Wer SZ3 zu Ende baut, hat
  jetzt, wohin damit.

## 11. Zweite Nachlese: mehr für den Letzten Stempel (27.08.2026)

Auf die Frage *„Gibt's noch mehr Deko für den letzten Stempel?"* — ja, sieben
Blätter mehr, und zwei davon hätten schon beim ersten Durchgang dabei sein
müssen.

### Was dazugekommen ist

| Blatt | Quelle | im Raum |
|---|---|---|
| `fass.png` | `Outdoor decoration/barrels.png` 49,13 15×19 | `V` — zwei hinter der Theke, eins bei den Kisten |
| `bank.png` | `Outdoor decoration/Benches.png` 33,6 31×21 | `B` — die Wirtshausbank, die IN1 gezeichnet hat |
| `hocker.png` | `House_Decor/Indoor_Decor.png` 83,50 9×13 | `U` — drei an der Theke |
| `kerze.png` | `House_Decor/Placeable_Decoration.png` 5,132 6×11 | Auflage auf dem Tisch |
| `flasche.png` | `House_Decor/Placeable_Decoration.png` 4,3 7×11 | Auflage auf der Theke |
| `fenster.png` | `House_Decor/windows.png` 1,7 14×21 | `N` — zwei in der Nordwand |
| `standuhr.png` | `House_Decor/Clocks.png` 17,1 14×30 | `P` — an der Ostwand |
| `scheit.png` | `Outdoor decoration/Outdoor_Decor.png` 68,115 25×11 | `L` — Holz neben dem Kamin |

Der Grundriss trägt jetzt vier neue Möbelzeichen (`V` Fass, `P` Pendeluhr,
`L` Holzscheite, `U` Hocker) und zwei neue Wandzeichen (`N` Fenster,
`Q` Flaschenbord) — und `B` greift ins Pack statt in
`drawInnenMoebelGezeichnet()`. Alles andere ist wieder stehen geblieben.

So sieht die Schankstube am Ende aus. Die zwei `#` in Zeile 1 sind kein
Tippfehler, sondern die Kaminwange — dazu unten mehr:

```
'###############',
'#FN.Qqq.W.##NF#',      Fenster, Flaschenbord, Kaminwange, Fackeln
'#VV.......HhLl#',      Fässer hinter der Theke, Kamin und Holz an der Wand
'#.Xxxxx.......#',      die Theke
'#..UUUZ......P#',      drei Hocker, der freigehaltene Platz, die Standuhr
'#.............#',      die leere Reihe, damit man an die Theke treten kann
'#..Tt....Tt...#',
'#..Bb....Bb...#',
'#.K.......V.K.#',
'#.............#',
'######AA#######',
```

### Der Fund, der weh tut: „das Pack hat kein X"

Abschnitt 9 schreibt, die Bank bleibe gezeichnet, weil `Chairs.png` nur Sofas
habe. Das stimmte. Die Bank lag in `Outdoor decoration/Benches.png` — eine Bank
ist eine Bank, drinnen wie draußen, und gesucht worden war in genau einem
Ordner. Dasselbe beim Fass: `barrels.png` liegt im Außenordner und war das Blatt,
das ein Wirtshaus am dringendsten braucht. Der Wirt heißt **Fass**.

Die Lehre steht jetzt als Kommentar über `INN_SPRITE`: wer eine Zeile schreibt,
die sagt „das Pack hat kein X", hat in genau einem Ordner nachgesehen.

### Drei Funde aus dem Bild, wieder

**Erstens: ein Möbel wird über seiner Fußlinie nach oben gezeichnet.** Die erste
Fassung setzte die drei Hocker in Zeile 4, direkt unter die Theke — und die
Tische in Zeile 5 haben sie vollständig verdeckt, weil ein Tisch zwei Kacheln
hoch ist. Der dritte Tisch ist dafür gegangen, und zwischen Theke und Tischen
liegt jetzt eine leere Reihe. Das ist keine Geschmacksfrage, sondern die Luft,
die eine Schankstube ohnehin braucht: man tritt an die Theke, ohne über eine Bank
zu steigen.

**Zweitens: ein `tileHash` über ein einziges Feld ist kein Zufall.** Die Flaschen
auf der Theke waren erst hash-gesetzt wie die Krüge auf den Tischen. Es gibt aber
genau eine Theke im Spiel — die Münze wird einmal geworfen und bleibt dann für
immer liegen. Sie fiel auf „keine Flasche", und die Schankstube hatte keine
einzige. Zwei Flaschen stehen jetzt fest da. Die Krüge und die Kerze auf den
Tischen bleiben gewürfelt: davon gibt es zwei, und nicht jeder Tisch ist gedeckt.

**Drittens: der freigehaltene Platz braucht Nachbarn.** Er war der einzige Sitz
im Raum und stand da wie ein Denkmal. In einer Reihe von drei Hockern fällt erst
auf, dass auf ihm niemand sitzt. `tools/innen-pruef.mjs` misst das seither als
Kachelabstand zum nächsten Hocker — ein Denkmal steht allein, ein Stuhl in einer
Reihe hat einen Nachbarn.

### Geprüft

`tools/innen-pruef.mjs` steht bei 21 Prüfungen (vorher 19). Neu sind die
Einrichtung der Schankstube — Theke, drei Hocker, drei Fässer, eine Uhr, zwei
Fenster, zwei Bänke, zwei Tische, Flaschenbord, Holzscheite, der Abstand des
freigehaltenen Platzes zur Hockerreihe und die zwei Wandreihen über dem Kamin —
und die Prüfung der zwei ausgebesserten G1-Schnitte. Der Ersatzweg nimmt jetzt
zwanzig Blätter zur Laufzeit aus `SHEETS` statt zwölf, und dreizehn
Möbelzeichen zeichnen aus dem Pack statt sieben. Die fünfzehn anderen Prüfläufe
sind unverändert grün.

### Die Feuerstelle gehört in die Wand

Der Projektinhaber, nach dem ersten Bild: *„Die Feuerstelle / Kamin kann ganz
nach hinten an die Wand."* Er hatte recht, und der Grund steht im Blatt.
`Fireplaces.png` ist 48 Pixel hoch, also **drei Kacheln**: unten die Feuerstelle,
darüber der Mantel, oben der **Rauchfang**. Ein Rauchfang, der mitten im Raum
endet, ist ein Ofenrohr. Er muss ins Mauerwerk.

Die Lösung braucht keine neue Zeichenebene, nur zwei Zeilen Grundriss. Der Kamin
steht jetzt in **Zeile 2**, und die Nordwand **springt in Zeile 1 um zwei Felder
vor** (`##` mitten in der Zeile). Weil ein Möbel über seiner Fußlinie nach oben
gezeichnet wird, deckt das drei Kacheln hohe Blatt genau diese zwei Wandfelder
plus die Wandreihe darüber ab: der Rauchfang steckt im Mauerwerk, die
Feuerstelle steht auf dem Boden davor. Die vorgezogene Wand ist außerdem das,
was sie im Bild sein soll — eine Kaminwange, hinter der man nicht durchlaufen
kann. `innen-pruef.mjs` misst seither nach, dass über dem Kamin zwei Wandreihen
liegen.

Dazu ein Feuerschein auf dem Boden davor (`innenFeuerschein()`): ein flacher
Radialverlauf, der zwischen 0,86 und 1,00 atmet. Flacher als eine Kerze — sonst
flackert der halbe Raum im Takt eines Teelichts.

### Recherche: woran man eine gemalte Schankstube erkennt

Auf die Aufforderung, bei anderen Retro-Spielen nachzusehen, was so ein Raum
braucht. Der Befund aus dem Stardrop Saloon (*Stardew Valley*) und den
einschlägigen Pixel-Tavernen-Paketen ist erstaunlich einheitlich, und das Spiel
hatte zwei der vier Dinge noch nicht:

| Zeichen einer Schänke | vorher | jetzt |
|---|---|---|
| Kamin **in** der Rückwand | davor | in der Wand |
| **Flaschenbord** hinter dem Wirt | fehlte | `Q`, drei Felder, Zeile 1 |
| Tresen mit geschlossenem Unterbau | dünnes Brett | Bretter, Sockelleiste, Glanzkante |
| Hocker am Tresen | fehlte | drei, seit dem ersten Nachtrag |

Das Flaschenbord bleibt **gezeichnet**, und diesmal ist die Begründung geprüft:
das Pack hat Regale mit Buchrücken, und ein Bücherregal hinter einer Theke ist
eine Bibliothek. Die Flaschen darauf kommen aus dem Pack.

### Die Farbleiter ist gemessen, nicht erfunden

Die erste Theke war gelblich (`#c08a45`) und stach neben dem Packtisch heraus
wie ein Fremdkörper. Ein Histogrammlauf über `tisch.png`, `bank.png`,
`fass.png` und `standuhr.png` zeigte, dass alle vier **dieselben sechs Werte**
benutzen:

```
#3f2832  Kontur      #743f39  tiefster Schatten   #8a4836  Schatten
#91533b  Mittelton   #b86f50  hell                #bf6f4a  Deckfläche
#c78160  Glanzkante  #e69c69  Lichtkante
```

`INN_HOLZ`, `INN_HOLZ_HELL` und `INN_HOLZ_DUNKEL` stehen seither auf diesen
Werten, dazu drei neue. Wer daneben in einem anderen Braun malt, malt in einem
anderen Spiel.

### Drei Fehler, die keine Zeichenfehler waren

**Erstens: der Halter unter der Fackel.** IN1 hat unter jede Wandfackel einen
Riegel gemalt. Das `fire1`-Blatt bringt seinen eigenen Halter mit und hat
darunter durchsichtigen Rand — der gemalte Riegel hing deshalb einen halben
Kachelabstand unter der Fackel in der Luft. Ersatzlos weg.

**Zweitens: der Anker der Spinnwebe.** Das G1-Blatt trägt `ay:0`, seine
Bezugslinie ist die **Ober**kante. IN1 hat sie wie eine Fußlinie behandelt, und
die Webe hing eine ganze Kachel zu tief — auf den Dielen, wo eine Spinnwebe wie
ein Fleck aussieht.

**Drittens, und das ist der eigentliche Fund: zwei Schnittfehler aus G1.** Neben
jeder Kiste und jeder Spinnwebe stand ein dunkler Strich. Er sah aus wie ein
Zeichenfehler dieses Bauabschnitts, lag aber in der Datei. Die drei Requisiten
(`crate`, `pot`, `cobweb`) sind in G1 von Hand aus `Dungeon_Objects.png`
geschnitten worden, und zwei der drei Schnitte haben am Rand ein paar Pixel des
Nachbarobjekts mitgenommen:

```
crate.png   Spalte 19, Zeilen 0..5    sechs Pixel
cobweb.png  Spalte 0,  Zeilen 11..15  fünf Pixel
```

Gemessen an der Alphamaske der beiden Dateien. Sie standen dort seit G1 — im
Verlies genauso wie in den Innenräumen. `schnittSaeubern()` nimmt sie beim Laden
heraus, in vier Zahlen, die man nachrechnen kann; die Dateien selbst bleiben
unangetastet, denn ein von Hand nachgemaltes PNG in einem zweiten Repo wäre
genau die Sorte Änderung, die später niemand mehr prüft. `innen-pruef.mjs` misst
beides: die Stelle ist durchsichtig, und vom Objekt fehlt nichts.

### Was weiter offen ist

* ~~**`NPCs (Premade)/Bartender_Bruno.png`.** Das Pack hat einen fertigen Wirt,
  und der Wirt in diesem Dorf heißt Bruno Fass. Ein Figurensprite zu tauschen ist
  aber kein Dekopunkt, sondern ein Eingriff in die Figurentabelle — das ist eine
  eigene Entscheidung und kein Nebenbei.~~ **Entschieden am 27.08.2026:** „Ja
  nimm Bruno." Ein gestrichenes `komposit:true` in seiner Zeile, sonst nichts —
  das Blatt lag seit dem Nachreichen des Pakets im Ordner. Einzelheiten und der
  Preis in `phase-g8-figurenfarben.md`, G8-4.
* **`Carpets.png`.** Teppiche bräuchten eine flache Ebene unter den Möbeln. Ein
  Feld trägt ein Zeichen, und ein Teppich unter einem Tisch wären zwei.
* **Fenster in Amt und Registratur.** Beide haben die Nordwand voller Regale.
  Wer dort ein Fenster will, nimmt ein Regal weg — und das Amt ist zu leer, nicht
  zu voll.
* **Der Schnitt selbst.** `schnittSaeubern()` ist ein Verband, keine Heilung. Wer
  `Dungeon_Objects.png` einmal danebenlegt, schneidet die drei Requisiten neu und
  wirft die Flickentabelle weg.
