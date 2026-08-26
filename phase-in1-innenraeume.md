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

`tools/innen-pruef.mjs` misst siebzehn Dinge am laufenden Spiel:

```
17 von 17 Pruefungen bestanden.
```

Darunter der Rundweg aus Abschnitt 7, die Sperrung jedes einzelnen Möbelfeldes
gegen den Grundriss, der Tagesablauf in beiden Richtungen (zum Feierabend
drinnen und nicht draußen, davor umgekehrt), die vier Kontextangebote, die
Schublade in Akt I und in Akt III, das Gespräch im Haus, die Speichersperre und
`startShift()`, das den Spieler aus dem Haus holt.

`tools/innen-tuer-messlauf.mjs` misst neun Dinge an den drei Blättern (siehe
Abschnitt 2).

## 9. Bewusst offen

* **Der Innenraumsatz.** `Houses_Interiors` und `House_Decor` liegen im
  Manifest und nicht im Repo. Sobald sie danebenliegen, werden aus dem
  überfärbten Kammerboden Dielen, und aus den gezeichneten Möbeln Blätter. Der
  Grundriss und alles andere bleibt.
* **Ein zweites Stockwerk.** `Wood_Stairs` steht im Manifest. Eine Treppe ohne
  oberes Geschoss wäre dieselbe Behauptung, die M3 bei der Leiter abgelehnt hat.
* **Fenster.** Von innen sieht kein Raum nach draußen. Das Paket hat ein
  `windows`-Blatt, im Repo liegt es nicht, und gezeichnete Fenster ohne Aussicht
  wären Deko ohne Aussage.
* **Ein Tagesablauf, der diesen Namen verdient.** Was hier steht, ist ein
  Schalter mit zwei Stellungen. Wer den Figuren wirklich einen Tag geben will,
  braucht mehr als das letzte Viertel der Schicht — und dann ist es ein eigener
  Bauabschnitt und keine Zeile.
* **Der Postregen.** Er kommt laut Weltgeschichte im Amt an, im Gasthaus und in
  der Registratur. Alle drei sind seit heute Orte. Wer SZ3 zu Ende baut, hat
  jetzt, wohin damit.
