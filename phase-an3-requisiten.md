# Bauabschnitt AN3: die Kacheln werden Requisiten

Der erste Bauabschnitt des Intro-Umbaus, der die 2342 wirklich bewegt. AN1 hat
die Reihenfolge gedreht, AN2 den Ort gewechselt, und beide haben ausdrücklich
kein Wort gekürzt. AN3 kürzt, und zwar nach einer Regel des Masterplans:
**was ein Gegenstand trägt, darf der Text nicht mehr aussprechen.**

**Gemessen, vorher gegen nachher, mit `tools/intro-pruef.mjs`:**

| | vorher | nachher | |
|---|---:|---:|---|
| **Wörter bis zum ersten freien Schritt (pflicht)** | **2342** | **1967** | −375 |
| Wörter (vordruck) | 1651 | 1276 | −375 |
| Wörter (vielleser) | 2615 | 2332 | −283 |
| Wörter (springer) | 917 | 917 | ±0 |
| Lesestufen (pflicht) | 28 | 25 | −3 |
| **Die Wand: Lesetafeln vor der ersten Wahl** | **13** | **10** | −3 |
| … in Wörtern | 950 | 575 | −375 |
| Längster Leseblock ohne Wahl (pflicht) | 950 | 751 | −199 |
| Introblätter | 7 | 4 | −3 |
| Das Weltgesetz auf dem Pflichtweg | 1 | **0** | siehe unten |
| Das Weltgesetz, erreichbare Stellen | 3 | 3 | ±0 |

Der Zielwert des Masterplans (unter 400) wird weiter verfehlt, jetzt um den
Faktor 4,9 statt 5,9. Das ist Absicht: AN3 nimmt die drei Blätter, die
Gegenstände beschreiben, und sonst nichts. Die Chronik bleibt stehen (AN6), die
Anlage 2 bleibt in der Kette (AN4).

## Was umgezogen ist, und wohin

Drei der sieben Introblätter waren Beschreibungen von Dingen, die es im Raum
gibt. Solange der Anfang auf schwarzem Grund lief, **musste** der Text sie
aussprechen, denn es gab kein Bild, in dem sie hätten stehen können. Seit AN2
spielt der Anfang in der Amtsstube. Ein Blatt, das ein Ding beschreibt, das
danebenhängt, ist seither eine Dopplung.

| Blatt | Kapitel | wohin |
|---|---|---|
| Die Karte an der Wand | 3, die Landschaft ist die Ablage | Requisit `'C'` an der Nordwand |
| Die Tafel über einer Tür | 1, das Weltgesetz | Requisit `'G'` über dem Weg hinaus |
| Das Einstellungsformular | 5, die zwei Hälften des Hauses | Empfangsfrage `haelften` |

Das dritte ist der Sonderfall und der klarste: **das Formular war nie ein
Gegenstand im Raum, es war der Vordruck.** Den bietet `schluss` seit W8 an. Das
Blatt beschrieb also ein Dokument, das drei Klicks weiter aufgeschlagen werden
kann. Was auf ihm stand und sonst nirgends steht, ist ein Satz: dass dieses Haus
zwei Hälften hat und der Spieler die zweite ist. Der Rest stand doppelt
(„was nicht bearbeitet wird, wird lebendig" ist `arbeit` und `laeuft`, „heute
sind Sie dran" ist `gruss`).

Dazu zwei Fragen, die die Folgesätze der Gesetzestafel tragen: `zeichen`
(„Am Aktenzeichen. Es steht klein daran.") und `erledigt` („Was dabei fliegt,
ist Papier. Hier blutet nichts."). Sie stehen nicht auf der Tafel, weil ein
Stein einen Satz sagt und keinen Vortrag hält.

## Wie ein Requisit funktioniert

Zwei Einträge in `INN_MOEBEL`, beide `frei:true` (die Wand sperrt ohnehin, und
die Tafel hängt über dem Weg, unter dem man durchgeht) und beide mit
`akt:'requisit'`. **Was** sie tragen, steht in `REQUISITEN` und wird über einen
Schlüssel nachgeschlagen; eine Zeichenkette an zwei Orten wäre die F1-Falle.

Gelesen wird mit dem Tafelstapel aus SZ1, mit genau einem Blatt. Kein neuer
Leseapparat: dieses Haus macht aus allem eine Urkunde, und **„Blatt I von I"
über einem Schild, das über einer Tür hängt, ist die Pointe und nicht ihr
Preis.** Die Welt hält an, solange das Blatt steht, über denselben
`szeneStateVorher`, den `haeltDieWelt`-Szenen seit SZ2 benutzen.

Während des Anfangs ist das alles unerreichbar, und das ist der ganze Zweck:
`scanAktion()` steigt bei `state !== 'play'` aus (A0, Prüfung 1). Ein Requisit
ist damit **gelesen ODER Anfang, nie beides**.

## Die aktBiete-Falle, und diesmal gemessen, bevor sie zuschlug

Die Tafel hängt über der Tür. Der Spieler steht nach dem Dienstantritt vor der
Tür. Beides zusammen ist die Falle, die W5 am Schattenfürsten schon einmal
gestellt hat: **näher gewinnt, und näher ist hier das Falsche.**

| | Abstand vom Empfangsplatz (368, 1400) |
|---|---:|
| die Schwelle (368, 1440) | 40,0 px |
| die Tafel (384, 1408) | **17,9 px** |

Ohne Gegenmaßnahme wäre „Ansehen" die **erste Bedienmöglichkeit des ganzen
Dienstes** gewesen, und der erste freie Schritt aus AN2 wäre keiner mehr. Die
Regel steht in einer Zeile und heißt: ein Wandstück über der Schwelle
überbietet die Schwelle nicht (`aktArt !== AKT_HAUSAUS`). Wer die Tafel lesen
will, tritt einen Schritt von der Tür zurück, und das ist genau das, was man vor
einem Schild über einer Tür ohnehin tut.

**Nachgemessen am laufenden Spiel:**

| Standort | Angebot |
|---|---|
| Empfangsplatz (368, 1400) | `16 Hinausgehen` |
| auf der Schwelle (368, 1440) | `16 Hinausgehen` |
| einen Schritt zurück (384, 1376) | `18 Ansehen` |
| vor der Karte (384, 1184) | `18 Ansehen` |
| Raummitte (400, 1300) | nichts |

## Das Weltgesetz fällt auf dem Pflichtweg nicht mehr, und das ist eine Entscheidung

**Vorher 1, nachher 0.** Das ist die eine Zahl dieses Bauabschnitts, die kein
reiner Gewinn ist, und sie steht hier statt in einer Fußnote.

Die Zahl der **erreichbaren** Stellen bleibt bei drei (Tafel, Vordruck A 1,
Szene `baumAnlage2`) — der Satz ist nicht gelöscht, er ist umgezogen. Aber auf
dem Weg, den ein Spieler geht, der nirgends stehenbleibt, fällt er nicht mehr.

Drei Gründe, warum das trotzdem richtig ist, und einer, warum es trotzdem etwas
gekostet hat:

**Der Mechanismus steht weiter im Pflichtweg.** `vorstellung3` hat keine
Alternative, jeder liest ihn: *„Ein Vorgang ist eine Frage, die jemand gestellt
hat. Wird sie beantwortet, ist sie erledigt. Wird sie es nie, wird sie
ungeduldig. Und irgendwann steht sie auf und sucht selber jemanden."* Das ist
das Weltgesetz, ausführlicher als der Merksatz. Was fehlt, ist der **Wortlaut**,
also das Motto, nicht die Regel.

**Der Wortlaut steht jetzt da, wo er laut eigener Aussage steht.** Bis AN3
erzählte ein Blatt, dass über der Tür des Hauses ein Satz steht. Seit AN3 steht
über der Tür des Hauses ein Satz.

**Es ist eine Kachel und kein Gang.** Die Tafel hängt über der einen Tür, die
jeder Spieler benutzt, und ein Tastendruck davor genügt.

**Was es gekostet hat:** eine Requisite, die niemand bemerkt, trägt nichts.
Deshalb hat das letzte Introblatt **eine** Zeile bekommen, und sie ist der
einzige Satz, den AN3 dem Pflichtweg hinzufügt: *„Der Satz, auf dem das alles
steht, hängt über der Tür. Sehen Sie ihn sich an, bevor Sie hinausgehen."* Sie
sagt, **wo** der Satz steht, und nicht, **wie** er lautet — genau die Regel des
Masterplans. Sie kostet 20 Wörter (1947 → 1967) und ist der Grund, warum der
Messlauf für den Pflichtweg weiterhin null Stellen meldet: ein Zeiger ist keine
Fundstelle.

Wer das anders entscheidet, hat zwei Zeilen zu ändern: den Zeiger auf Blatt 4
und den Eintrag `gesetz` in `REQUISITEN`.

## Riegel 3, und warum er vor dem Schnitt stehen musste

A0 hat drei Riegel benannt; Riegel 1 und 2 stehen seither, Riegel 3 war offen:
**den Weiterknopf am `onclick` suchen statt am Wortlaut.** Er gehörte vor AN3,
weil AN3 genau diesen Knopf umbenennt, und er ist gebaut worden, **bevor** eine
Zeile Spieltext angefasst wurde. Beide Läufe waren danach grün (102/102 und
78/78) und damit war bewiesen, dass der Umbau der Werkzeuge für sich trägt.

Woran der Knopf erkennbar ist: an dem, was er tut. `WEITER`, `LESEN` und der
Schlussknopf tragen alle dasselbe `onclick="szeneTafel(n)"`; der zweite Knopf
ruft `szeneTafelZweiter()` oder `szeneTafelWahlNein()` und **fällt damit von
selbst heraus**, ohne dass eine Liste ihn ausschließen muss. Genau daran war die
alte Fassung zweimal fast gescheitert (das unverankerte `/LESEN/i`, das
„Nicht lesen" mittraf; die Frage, ob `ÜBERSPRINGEN` der letzte Knopf im Panel
ist).

Wo ein Stapel aufhört, sagt die Maschine selbst: `szeneTafel(i)` wird auf Blatt
`i-1` gezeichnet, das letzte Blatt trägt also `n === liste.length`. Der
Parameter `ende` trägt für die Navigation nichts mehr — er steht in der
Fehlermeldung und wird an der Aufrufstelle mit einem **eigenen `pruef()`**
belegt. Das ist der Unterschied, um den es geht: eine Umbenennung macht ab jetzt
**eine Prüfung rot, statt den Lauf zu töten.**

Dazu die zweite Hälfte, die A0 verlangt hat: nach jedem Klick wird nachgesehen,
dass sich die Blattzahl wirklich bewegt hat. Ein Knopf, der da ist und nichts
tut, sah bisher aus wie einer, der weiterblättert.

Angefasst: `durchDenStapel()` und drei weitere Klickstellen in
`empfang-pruef.mjs`, `stapelWegklicken()` in `menue-pruef.mjs`. Die Stellen, die
eine **Aufschrift prüfen** statt zu navigieren, bleiben am Wortlaut — das ist
ihre Aufgabe.

## Ein Fund, den AN2 hinterlassen hat

Der Schlussknopf des Intros hieß `ANKLOPFEN`. Das war richtig, solange der
Anfang auf schwarzem Grund lief und das Dorf danach aufging: man stand vor dem
Haus und klopfte. **Seit AN2 steht der Spieler während des ganzen Anfangs in der
Amtsstube**, und Knöterich hat ihn sechs Knoten lang angesprochen. Angeklopft
hat er nie und kann es auch nicht mehr.

Der Knopf sagt jetzt, was der nächste Knoten tut: `gruss` fängt mit „So weit der
Bestand. Jetzt zu Ihnen." an, also **`ZUR SACHE`**. Kein Fehler von AN2 im Sinne
eines Absturzes, aber eine Beschriftung, die etwas beschreibt, das es nicht mehr
gibt.

## Doku-Nachlese: es waren neun Stellen, nicht sieben

A0 hat gemeldet, dass fünf bzw. sieben Stellen weiter neun Introblätter
behaupten. **Nachgezählt statt abgeschrieben: es sind neun** — sechs in
`index.html`, eine im Kopf von `empfang-pruef.mjs`, zwei in der `README.md`. A0
hatte die beiden Kommentare im Abspann (`abspannBlaetter()`) und in
`szeneTafel()` übersehen.

Acht davon stehen jetzt auf vier. Die neunte ist der README-Eintrag zu
`phase-sz1-szenensystem.md`, und die bleibt bei neun: sie beschreibt, was SZ1
**damals** gebaut hat, und ist an dieser Stelle richtig. Ergänzt ist nur der
heutige Stand.

Die Begründung bei `szeneBlattZahl()` („Das Intro ist zu neunt und bleibt damit
römisch") steht damit wieder auf einer Zahl, die es gibt. Sichtbar falsch wurde
davon nie etwas — `ROEMISCH` reicht bis zehn, und sieben wie vier liegen
darunter.

## Warum die offene Testerfrage AN3 nicht aufgehalten hat

Die Übergabe nennt eine offene Frage: *welchen der beiden Wege sind die Tester
gegangen?* Die Rückmeldung nannte die Dienstanweisung, und die liegt nur auf dem
Vordruckweg. Der Merkposten sagt: *„Das ändert den Zuschnitt von AN3 und AN4.
Erst klären, dann schneiden."*

**Für AN3 ändert sie nichts, und das ist gemessen und nicht angenommen.** Die
Verzweigung liegt in `schluss`, also **hinter** dem Intro. Beide Routen lesen
denselben Kachelstapel, und der Messlauf weist das für beide getrennt aus:

| | vorher | nachher |
|---|---:|---:|
| pflicht | 2342 | 1967 |
| vordruck | 1651 | 1276 |

**Beide fallen um exakt dieselben 375 Wörter.** Ein Schnitt vor der
Verzweigung kann nicht davon abhängen, welchen Ast der Spieler danach nimmt.

Für **AN4** bleibt die Frage offen und wird dort scharf: Anlage 2 liegt nur auf
dem Pflichtweg, die Dienstanweisung nur auf dem Vordruckweg.

## Was der Messlauf gelernt hat

`intro-pruef.mjs` liest die Requisiten jetzt mit, wenn es die erreichbaren
Stellen des Weltgesetzes zählt. Ohne diese Zeile hätte er nach AN3 zwei Orte
statt drei gemeldet, und das läse sich wie *„das Weltgesetz ist gelöscht
worden"*. Es ist umgezogen, und ein Messlauf, der den Umzug nicht sieht, misst
den alten Bauzustand.

Dazu prüft `szeneAssert()` die Requisiten von zwei Seiten: jedes Blatt läuft
durch dieselben Formregeln und dieselbe Wortsperre wie das Intro
(`AKTE_SPERRE_NAMEN` — es ist dasselbe Material), und jedes Wandstück mit
`akt:'requisit'` muss auf ein Blatt zeigen, das es gibt. Ein Tippfehler im
Schlüssel fiele sonst erst auf, wenn ein Spieler davorsteht und nichts passiert.

## Der Durchlauf am Stück, gemessen

Ein Lauf wie ein Mensch ihn geht, mit Tastatur und abgewartetem Tippwerk:

| | |
|---|---|
| Vorstellung | 6 Züge |
| Intro | **4 Blätter**, Schlussknopf `ZUR SACHE` |
| erster freier Schritt | `state 'play'`, in der Amtsstube, erste Aktion **`16 Hinausgehen`** |
| einen Schritt zurück | `Ansehen` → „Blatt I von I", trägt den Satz |
| hinaus | `innen` weg, `currentLevel 1`, (5008, 4958), 8019 Bäume, 14 Dorffiguren |

Kein `pageerror`. Die Zusage aus AN2 („der erste freie Schritt ist der Schritt
hinaus") steht unverändert.

## Geprüft

| Lauf | |
|---|---|
| `empfang-pruef` | **102/102** (war 100; zwei Aufschriften werden jetzt geprüft statt gesucht) |
| `anlage2-pruef` | 123/123 |
| `szene-pruef` | 50/50 |
| `menue-pruef` | 78/78 |
| `stopfen-pruef` | 43/43 |
| `zulagen-pruef` | 50/50 |
| `versuchung-pruef` | 67/67 |
| `speicher-pruef` | 38/38 |
| `mitteilung-pruef` | 32/32 |
| beide `fehlversuch` | grün |
| `intro-pruef` | alle vier Routen, Exit 0 |

Weiterhin nicht grün, unverändert gegenüber dem Stand vor AN3, in allen Fällen
die fehlende Grafik (`assets/cf/` liegt in diesem Klon nicht vor):
`gespraech-pruef` 87/89 (**dreimal von drei Läufen dieselben zwei
Fehleridentitäten**, nach Falle 4 der Übergabe), `ebene-pruef` 53/54,
`innen-pruef` 16/18 mit Abbruch. `innen-pruef` prüft die Amtsstube und ist
deshalb einzeln nachgesehen worden: seine beiden Abweichungen nennen die
fehlenden Innenraumblätter und die dreizehn Pack-Möbel, keine davon die zwei
neuen Wandstücke — die sind gezeichnet und stehen zu Recht nicht in jener Liste.

## Was diese Messung nicht kann

* **Sie misst Wörter, keine Zeit.** Wie lange jemand an 575 Wörtern sitzt, sagt
  sie so wenig wie vorher bei 950.
* **Sie misst nicht, ob jemand die Tafel bemerkt.** Dass sie über der Tür hängt,
  dass ein Zeiger auf sie zeigt und dass ein Schritt zurück genügt, ist gemessen.
  Ob ein Spieler den Schritt tut, ist es nicht. **Das ist die Frage, die die
  nächste Rückmeldung beantworten muss**, und sie ist neu: vor AN3 gab es sie
  nicht, weil es keine Wahl gab.
* **Das Aussehen ist in diesem Klon nur zur Hälfte beurteilbar.** `assets/cf/`
  fehlt, Boden und Wand der Amtsstube bleiben schwarz. Die beiden Wandstücke
  sind gezeichnet und deshalb sichtbar; wie sie neben echten Möbelblättern
  wirken, hat hier niemand gesehen.

## Offen

* **AN4** nimmt die Anlage 2 aus der Kette. Der Messlauf zeigt, wohin die Wand
  gewandert ist: der längste Leseblock des Pflichtwegs ist seit AN3 **nicht mehr
  das Intro**, sondern `Ernennung bis Anlage 2, Erstkontakt` mit 751 Wörtern auf
  7 Lesestufen. Die 10 Tafeln am Stück sind zwar weiter die längste Kette, aber
  nur noch 575 Wörter.
* **AN6** holt die vier Chronikblätter in die Erstbelehrung nach Akt I. Zwei
  Stücke aus den gekürzten Blättern gehören dorthin und stehen nirgends mehr:
  wie die Ablage über das Haus hinauswuchs (Keller, Hof, über den Fluss) und
  dass der Fluss inzwischen genauso heißt.
* **Die Testerfrage** (welchen Weg sind sie gegangen) bleibt offen und wird für
  AN4 gebraucht, nicht für AN3.
* **Die drei Kanon-Entscheidungen** aus dem Masterplan stehen unverändert offen.
  AN3 legt eine vierte daneben: das Weltgesetz fällt auf dem Pflichtweg nicht
  mehr, sondern hängt an der Wand.
* Ob Nörgel im Anfang dastehen soll, ist weiter eine Zeile in `innenBesetzung`.
