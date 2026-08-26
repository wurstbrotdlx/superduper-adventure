# Bauabschnitt T6: Der Ausbruch — ERLEDIGT

Anlage 2 hatte einen guten Käfig und keinen Puls.

T3 hat die Figur gebaut, T4 hat ihr die stillen Momente gegeben, T5 hat ihr das
Amtsdeutsch abgenommen. Alles drei steht. T6 fasst nichts davon an, sondern
behebt etwas, das durch alle drei Abschnitte mitgewachsen ist, ohne dass ein
Guard es je gemeldet hätte: sie war liebenswürdig, sie war komisch, sie redete
seit T5 sogar normal — und sie hatte über achtzig Zeilen lang denselben Puls.

**Zur Nummer.** Dieser Abschnitt entstand parallel zu T5 und hieß bis zum Merge
selbst T5. Da T5 (Der Ton) zuerst auf `main` war, ist er T6 geworden. Die
Arbeiten überschneiden sich nicht: **T5 hat das Register geändert, T6 den
Puls.** Abschnitt 3 zeigt, warum das zwei verschiedene Dinge sind.

---

## 1. Der Auftrag, wörtlich

Die Frage kam als Zweifel an der eigenen Auflage:

> „ich weiß nicht ist das gut? oder zu streng? anlage 2 soll lebedig sein und
> auch mal impulsiv sein"

Gemeint war die T3-Auflage, die seit drei Abschnitten über den drei
Szenen-Anlässen steht: *jede Zeile muss aus dem Haus kommen, nicht aus der
Akte.* Die Antwort lautet: die Auflage ist nicht zu streng, sie ist nur nicht
der Grund. Zwei andere Regeln waren es.

---

## 2. Der Befund, gemessen und nicht vermutet

Nachgezählt über den gesamten Bestand, **nach** T5 und seinen Ton-Eingriffen
(`ANLAGE2_NOTIZ`, `ANLAGE2_BEWEGUNG`, `ANLAGE2_UMSCHLAG`):

| | vor T5 | nach T5, vor T6 |
|---|---|---|
| Zeilen insgesamt | 77 | 83 |
| kürzeste / längste | 28 / 43 | 24 / 43 |
| Mittel | 36,3 | 34,9 |
| **Streuung** | **3,2** | **3,9** |
| Zeilen aus zwei oder mehr Sätzen | 68 Prozent | 69 Prozent |
| **Zeilen mit einem Ausrufezeichen** | **0** | **0** |

Die beiden fetten Zeilen sind der ganze Befund, und die zweite Spalte ist der
Beweis, dass er nicht T5s Sache war: **T5 hat jede dieser Zeilen im Ton
angefasst und keine davon im Puls.** Die Streuung bleibt im selben
Fingerbreit, zwei Drittel folgen weiter derselben Bauform (eine Feststellung,
dann ein kurzer zweiter Satz), und in dreiundachtzig Zeilen wird kein einziges
Mal jemand laut.

Das ist gut geschrieben und es ist eine Haltung. Aber eine Haltung ist kein
Temperament, und wer achtzigmal dieselbe Kadenz hört, hört eine Figur, die nie
überrascht wird.

### Die beiden Regeln, die dafür verantwortlich waren

**Der 44er-Deckel.** Er gilt für das ganze Band und war für Knöterichs
Randnotiz gedacht. Gleiche Obergrenze heißt in der Praxis gleiche Länge, und
gleiche Länge klingt nach gleichem Puls. Impulsivität lebt von
Unregelmäßigkeit: ein Dreiwortausbruch neben einem Satz, der sich Zeit nimmt.
Ein einziger Deckel verbietet beides.

**„Sie wird vertrauter, nie schärfer."** Der Satz steht seit T3 über der
Bewegungsreihe. Dort ist er richtig, denn wer zieht, ist immer der Spieler. Als
allgemeine Tonregel gelesen war er zu weit gefasst und hat das Falsche
verboten. Gemeint ist **nie schärfer gegen den Spieler**. Dastehen tat: nie
laut.

### Und warum die Brandmauer nicht schuld ist

Die Brandmauer regelt **Wissen**, nicht **Temperament**. Sie sagt, dass Anlage 2
den laufenden Fall nicht kennt. Sie sagt nichts darüber, wie heftig die Figur
auf das reagieren darf, was sie sehr wohl kennt.

Der Hebel, der beides auf einmal löst, steht unter T6-2 und lautet: **sie darf
falsch liegen.**

---

## 3. Register und Puls sind zwei verschiedene Dinge

Der Satz, um den es beim Zusammenlegen mit T5 ging, und er ist an der Messung
oben ablesbar.

**Das Register** ist die Frage, aus welchem Wortschatz eine Figur schöpft. T5
hat es abgesenkt: aus „Ein Treffer. Anlage dazu: ich." wurde „Getroffen. Ich
habe zugesehen." Das ist eine echte und große Änderung, und sie steht.

**Der Puls** ist die Frage, wie gleichmäßig sie spricht. Er hat sich dabei um
0,7 Zeichen Streuung bewegt, und die Zahl der Ausrufezeichen ist von null auf
null gegangen. Ein Register lässt sich absenken, ohne einen Takt zu ändern, und
genau das ist passiert.

Beide Abschnitte zielen auf dasselbe Wort („lebendiger"), greifen aber an
verschiedenen Stellen an. Deshalb ist am Merge auch nichts weggefallen: T6
übernimmt T5s Wortlaut überall dort, wo beide dieselbe Zeile angefasst haben,
und legt nur seinen eigenen Kanal daneben.

---

## 4. Was jetzt da ist

### T6-1. Der Ausbruch, und warum er zweiteilig ist

`ANLAGE2_AUSBRUCH`, elf Paare über neun Anlässe. Ein Eintrag ist kein Satz,
sondern ein Paar:

```js
crit: [
  {auf:'Ja! Genau da hin.', zurueck:'Verzeihung. Das war unsachlich.'},
  …
],
```

Das Paar ist die ganze Figur: **sie fährt hoch und fängt sich sofort wieder,
weil sie eine Anlage ist.** Ein Ausbruch, der stehen bliebe, wäre eine andere
Figur; eine Anlage, die nie hochfährt, war die alte.

Zwei Bänder übereinander gibt es nicht, das steht seit T3-6 fest (das Band ist
eine Fläche und keine Liste). Also löst der Takt sie ab: erst der Ausbruch,
2,2 Sekunden später fällt die Rücknahme an dieselbe Stelle. Wer wegsieht,
liest nur den zweiten Satz, und auch der stimmt dann.

**Eigene Deckel, und das ist der Punkt des Abschnitts.** Der Ausbruch bekommt
30, die Rücknahme 40, statt einheitlich 44:

| | Bestand nach T5 | neu in T6 |
|---|---|---|
| Länge | 24 bis 43 | 17 bis 37 |
| Mittel | 34,9 | 28,4 |
| Streuung | 3,9 | **6,1** |

Die Streuung ist das Ergebnis, nicht die Länge. Sie hat sich mehr als
anderthalbfacht, und genau das hört man.

### T6-2. Sie darf falsch liegen

`raten:true` kennzeichnet die zweite Bauart, und sie ist der eigentliche Fund
dieses Abschnitts:

> Das ist der Haushaltsrest. — *Oder auch nicht. Ich rate nur.*
> Ich tippe auf Formfehler. — *Vermutlich falsch. Ich lag nur dabei.*
> Da war bestimmt nichts drin. — *Ich weiß es nicht. Ich rate.*

Eine Figur, die vorprescht und danebentippt, **verrät nichts, weil sie nichts
weiß.** Das ist keine Umgehung der Brandmauer, das ist ihr stärkster Beweis:
bis T5 wurde die Brandmauer durch Schweigen belegt, ab T6 durch Reden.

Und es ist die wärmste Stelle, die diese Figur haben kann. Der Spieler weiß es
besser, hört sie raten und korrigiert sie nicht.

Die Rücknahme eines Rate-Paars nimmt die Vermutung ausdrücklich zurück. Ein
Tipp, der stehen bliebe, wäre eine Behauptung über den Fall, und genau die darf
sie nicht haben. Der Guard zählt die Rate-Paare und verlangt mindestens drei:
unter drei ist die Bauart ein Einzelfall statt einer Eigenschaft, und dann
kippt die Figur beim nächsten Bauabschnitt still zurück in die Haltung.

### T6-3. Wie selten, und warum ein Zähler und kein Würfel

`kn.counters.anlage2Ruhig` zählt die gefassten Zeilen. Drei davon, dann darf
sie einmal, danach steht er wieder auf null.

Ein Würfel wäre kürzer gewesen und falsch. Eine Figur, die alle paar Minuten
hochfährt, hat keinen Ausbruch mehr, sondern ein Temperament, und das ist eine
andere Figur. Was selten ist, wiegt — derselbe Satz steht seit T4 über dem
Umschlag.

Der Zähler steht persistiert bei den übrigen, aus demselben Grund wie
`anlage2Zug`: wer morgen weiterspielt, soll nicht jeden Morgen erst drei ruhige
Zeilen lang auf den ersten Ausbruch warten. Additiv gemergt, damit
migrationsfrei.

**Ein Anlass ohne Paare verbraucht den Stand nicht.** Wer auf einem stillen
Anlass steht, bekommt die Pool-Zeile und behält seinen Stand für den nächsten
lauten Moment.

### T6-4. Die Niederlage bleibt still, und der Guard hält es fest

T4 hat entschieden, dass Anlage 2 im Moment des Scheiterns nichts sagt,
sondern beim Wiederantritt wartet: *wer jemandem in sein Scheitern
hineinredet, ist ein Kommentator, wer wartet, ist ein Begleiter.*

Für den lauten Kanal gilt das erst recht. Weil eine Entscheidung, die nur in
einem Dokument steht, beim übernächsten Bauabschnitt verloren geht, steht sie
jetzt als Prüfung im Code: ein Ausbruch auf `niederlage` ist ein Fehler.

### T6-5. Die Ton-Regel, präzisiert und geprüft

Der Satz über der Bewegungsreihe gilt dort wörtlich weiter. Für die Anlässe
gilt ab T6 nur noch die erste Hälfte: **sie darf laut werden, gegen ein
Verfahren, gegen ein Formular, gegen sich selbst. Nie gegen den, der zuhört.**

Das verträgt sich mit T5s Kanon-Ansage („Grundgesetz 1 gilt für Anlage 2
nicht", sie darf zwinkern und den Spieler ansprechen) und schärft sie an genau
einer Stelle: **ansprechen ja, anfahren nein.**

Und die Grenze steht nicht nur im Kommentar. `anlage2Assert()` (2c) meldet
jeden Ausbruch, der ein Ausrufezeichen neben einer Anrede trägt:

```
T3 Anlage 2: Ein Ausbruch fährt den Spieler an goldfund Nehmen Sie das mit!
```

Die Prüfung hat sich beim ersten Lauf sofort bezahlt gemacht: genau diese Zeile
stand im Entwurf. Sie heißt jetzt „Das nehmen wir mit!", und das ist die
bessere Zeile, weil das *wir* ohnehin die Figur ist.

### T6-6. Ein Band, drei Stimmen, jetzt vier Kleidungen

`#knRandnotiz` bleibt, was es war. Der Ausbruch trägt **beide** Klassen, `a2`
und `ausbruch`: sie fällt aus der Haltung, nicht aus der Figur.

| | Marke | Schrift | Rand |
|---|---|---|---|
| Knöterich | `§`, Amtsgold, schräg | kursiv | Amtsgold |
| Anlage 2 | `*`, Papierfarbe, gerade | kursiv | Papierfarbe |
| **Anlage 2, laut** | `*`, eine Spur heller | **gerade** | heller |
| Anlage 2, Umschlag | keine | gerade, gedämpft | dunkel |

Weg fällt beim Ausbruch die Kursive. Kursiv liest sich wie ein Randvermerk,
und ein Ausbruch ist keiner. Die Rücknahme nimmt beides zurück, den Satz und
die Farbe.

### T6-7. Die wärmsten Zeilen lagen zu weit hinten

Zwei gegatete Zeilen sind nach vorn gerückt: `abStufe:5` auf 3 und
`abSchicht:5` auf 3. Eine Zuneigung, die erst nach Stunden anfängt, ist im
Zweifel gar keine. Der **Wortlaut** dieser Zeilen ist der aus T5, T6 verschiebt
nur das Gate. `abRang:1` und `abAkt:3` bleiben, wo sie sind, die hängen an der
Handlung.

### T6-8. Kein Punkt in der Hausmitteilung, und das ist Absicht

`NEUERUNGEN` bekommt keinen Eintrag und der Stempel `2026-08-26-t5` aus der
T5-Nachlese bleibt stehen. Ein Punkt namens „sie wird jetzt manchmal laut" wäre
die Ankündigung genau der Sache, die überraschen soll, und das Haus hat dazu
seit T3 einen Satz: die einzige Ankündigung, die Anlage 2 im ganzen Spiel
bekommt, ist die vierzehnte Zeile der Ernennungsurkunde, und wer sie überliest,
macht alles richtig.

Der T5-Punkt „Anlage 2 legt den Amtston ab" beschreibt den Kanal weiterhin
zutreffend. `tools/mitteilung-pruef.mjs` liest Stand und Punktzahl seit T3 aus
der Quelle und bleibt deshalb unberührt bei 32 von 32.

---

## 5. Drei Funde, und keiner stand in einem Guard

### Die Brandmauer stürzte an ihrem eigenen Fehler ab

Aufgefallen beim Auslösen der neuen Guard-Zweige, nicht beim Schreiben.

Die Brandmauer-Schleife in `anlage2Assert()` (1) lief ungeprüft auf
`t.indexOf(w)`. Eine Quelle ohne Text hat den Guard **abstürzen** lassen, statt
ihn melden zu lassen, und weil er auf Skriptebene läuft, nahm er das halbe
Spiel mit: die Probe „Ausbruch ohne Rücknahme" ließ das Spiel gar nicht mehr
anlaufen.

Ein Guard, der an genau dem Fehler zerbricht, den er finden soll, ist keiner.
Das ist derselbe Zirkelschluss, den T3 schon einmal am Ausgang des
Gesprächsbaums hatte, und wieder hat ihn nur die Probe gefunden.

**Latent war der Fall seit T4 da.** Eine Umschlagzeile ohne `z` trifft ihn
ebenso. Das Protokoll von damals zeigt die Meldung `Eine Umschlagzeile hat
keinen Text akt5` und sieht deshalb sauber aus — die Meldung kam vor dem
Absturz, und niemand hat danach nachgesehen, ob das Spiel noch läuft.

Behoben mit einer Zeile: ein fehlender Text ist jetzt ein eigener Befund
(`Eine Zeile hat gar keinen Text Rücknahme ultimate`) und kein Absturz.

### Der Ausbruch-Kanal war im Ton-Messlauf unsichtbar

`tools/ton-messlauf.mjs` aus T5 führt jede Textquelle einzeln auf.
`ANLAGE2_AUSBRUCH` stand nicht darin, und zweiundzwanzig neue Zeilen wären
ungemessen geblieben — **derselbe Fall, den der Lauf vier Zeilen weiter unten
im eigenen Kommentar für den Auftakt beschreibt** („Bis T5c fehlte er hier, und
damit fehlte ausgerechnet die Stelle, an der ihre fünf amtlichen Sätze
stehen"). Eine Textquelle, die kein Lauf erfasst, driftet still, und der
Bericht behauptet dabei eine Vollständigkeit, die er nicht hat.

Der Kanal steht jetzt als **eigene** Quelle und nicht im Band. Nicht aus
Ordnungsliebe: ein Ausbruch ist die Stelle, an der sie den Amtston am weitesten
hinter sich lässt, und im Band verrechnet wäre genau das unsichtbar. Getrennt
gemessen sagt die Zeile etwas:

```
Anlage 2, Ausbruch       22 Zeilen    0% amtlich   (Abk 0%, Wort 0%)  knapp 82%
```

**Was das für T5e heißt, offen gesagt:** die zweiundzwanzig Zeilen senken die
Gesamtquote der Figurenrede von 13 auf 12 Prozent, der Abstand zum Zielwert
wächst um einen Punkt. Das ist keine Verschlechterung, die T6 versehentlich
verursacht, sondern die korrekte Buchung von Zeilen, die es jetzt gibt. Ihre
Kürze ist dabei ausdrücklich unbedenklich, denn der T5-Kanon sagt es selbst:
**kurze Sätze sind kein Amtsdeutsch.**

### Der Prüflauf zählte eine Zahl, die T5b verändert hat

`tools/anlage2-pruef.mjs` prüfte dreimal gegen eine abgeschriebene Sieben („sie
hat sieben Fragen"). T5b hat dem Gesprächsbaum eine achte gegeben („Erklären
Sie mir diese Welt.") und diesen Lauf nicht mitgezogen, worauf zwei Zeilen rot
standen, ohne dass etwas kaputt war.

Nachgemessen statt vermutet: **auf unverändertem `origin/main` steht derselbe
Lauf bei 74 von 76**, mit genau diesen zwei Zeilen. Der Fehlschlag ist von T5
geerbt und nicht von T6 verursacht.

Repariert im Muster, das dieses Projekt schon zweimal angewandt hat (T1,
Abschnitt 9 für `mitteilung-pruef.mjs`, umgesetzt in T3, Abschnitt 8): die
Mechanik darunter war immer schon generisch (`keys.slice(0, -1)`), nur die
Erwartung nicht. Sie liest jetzt aus der Quelle, die untere Schranke von sieben
bleibt hart, und wer die neunte Frage anhängt, ändert an diesem Lauf nichts
mehr.

---

## 6. Guards

`anlage2Assert()` prüft seit T6 drei Dinge mehr, alle im Block (2b) und (2c),
plus den Zähler in (6) und die neuen Deckel in `knAssertCaps()`.

Meldung im Normalfall:

```
T3 Anlage 2: 10 Anlässe, 10 Sprüche in Reihe, 5 Blätter, 13 Umschläge,
11 Ausbrüche (3 geraten), Brandmauer in Ordnung.
```

### Das Protokoll: jeder neue Zweig einmal ausgelöst, und ab jetzt wieder

Hausbrauch seit T1. Alle zwölf ausgelöst, Meldung wörtlich:

| Probe | Meldung |
|---|---|
| Ausbruch an einem Anlass ohne Pool | `Ein Ausbruch wartet auf einen Anlass, den es nicht gibt regenschauer` |
| Ausbruch auf der Niederlage | `Ein Ausbruch steht auf der Niederlage, dort schweigt sie` |
| Anlass mit leerer Paarliste | `Ein Ausbruch-Anlass hat keine Paare ebene` |
| Ausbruch ohne Text | `Ein Ausbruch hat keinen Text bosssieg` |
| Ausbruch ohne Rücknahme | `Eine Zeile hat gar keinen Text Rücknahme ultimate` (+1) |
| Zwei Ausbrüche mit demselben Anfang | `Zwei Ausbrüche desselben Anlasses beginnen gleich crit Ja! Genau da hin.` |
| Ausbruch mit einem Feld, das es nicht gibt | `Ein Ausbruch trägt ein Feld, das es nicht gibt levelup abAkt` |
| `raten` mit einem anderen Wert als `true` | `raten kennt nur true, nicht goldfund ja` (+1) |
| Ausbruch, der den Spieler anfährt | `Ein Ausbruch fährt den Spieler an goldfund Nehmen Sie das mit!` |
| Ein Rate-Paar zu wenig | `Zu wenige Ausbrüche, in denen sie danebenliegt 2` |
| Der Ruhezähler fehlt in der Vorgabe | `Der Zähler anlage2Ruhig fehlt in kn.counters` |
| Ausbruch über dem eigenen Deckel | `Zeichendeckel verletzt: "Ja! Und zwar genau da hin, ganz sicher!" 39 > 30` |

**Und das Protokoll ist keine Behauptung mehr.** Bis T5 stand diese Tabelle
nur im jeweiligen Phasendokument, also als Bericht über einen einmaligen
Nachmittag. Sie läuft jetzt als `tools/anlage2-fehlversuch.mjs`, nach dem
Vorbild der drei bestehenden `*-fehlversuch.mjs`, und prüft je Zweig **beides**:
dass der Guard meldet, und dass er nach dem Zurücksetzen wieder still ist. Der
zweite Teil ist der wichtigere — ein Guard, der nach einer Probe weiter meldet,
hält einen Zustand fest, den es nicht mehr gibt, und färbt jede spätere Probe
ein.

```
12 von 12 Zweigen melden und schweigen danach wieder.
```

**Zwei Funde an der ersten Probenfassung.** Sie hantierte mit Probefassungen
als Datei und horchte nur auf `console.error`. Ein nicht abgefangener
`TypeError` kommt als `pageerror` und wäre nie sichtbar geworden; die Probe
meldete bloß „startet nicht", ohne zu sagen, woran — genau am Absturz oben.
Und ein Anker traf doppelt (`bosssieg:` steht in beiden Tabellen) und
verstellte die falsche Stelle, was wie ein kaputter Guard aussah und keiner
war. Die Fassung im Repo verstellt deshalb **zur Laufzeit** statt am Dateitext,
wie es `ebene-fehlversuch.mjs` vormacht: keine Anker, keine Mehrdeutigkeit.

---

## 7. Abnahme

Alle Läufe mit Playwright gegen `python3 serve.py` auf Port 8378, **nach** dem
Merge von `origin/main` (Stand `ea17d85`, T5-Nachlese). Nichts behauptet, alles
gefahren.

| Lauf | Nachher |
|---|---|
| `tools/anlage2-pruef.mjs` | **92 von 92** (16 neue Zusagen, plus die drei aus T5b nachgezogenen) |
| `tools/anlage2-fehlversuch.mjs` (neu) | **12 von 12** Zweigen melden und schweigen danach wieder |
| `tools/empfang-pruef.mjs` | 76 von 76 |
| `tools/szene-pruef.mjs` | 49 von 49 |
| `tools/menue-pruef.mjs` | 78 von 78 |
| `tools/speicher-pruef.mjs` | 38 von 38 |
| `tools/reich-pruef.mjs` | 59 von 59 |
| `tools/stopfen-pruef.mjs` | 43 von 43 |
| `tools/versuchung-pruef.mjs` | 67 von 67 |
| `tools/langvorgang-pruef.mjs` | 58 von 58 |
| `tools/zulagen-pruef.mjs` | 50 von 50 |
| `tools/mitteilung-pruef.mjs` | 32 von 32 |
| `tools/ton-messlauf.mjs` | läuft, Ausbruch-Kanal neu erfasst (siehe Abschnitt 5) |
| `tools/gespraech-pruef.mjs` | 87 von 89, siehe unten |
| `tools/ebene-pruef.mjs` | 53 von 54, siehe unten |

Konsole beim Laden: einundzwanzig Guard-Zeilen, keine Meldung, kein
`pageerror`.

**Zwei Rotstände, und beide gehören nicht hierher.** Nachgemessen statt
vermutet, mit einem zweiten Server auf einem `git worktree` von `origin/main`
ohne diesen Bauabschnitt:

* `gespraech-pruef.mjs` meldet `das zweite Portraet ist gezeichnet` und
  `Noergel steht auf dem Blatt der Gruenhaut`. **Beide stehen auf
  unverändertem `origin/main` identisch.** Es sind Bildstände, keine Funde
  dieses Abschnitts.
* `ebene-pruef.mjs` steht auf 53 von 54, dreimal gegen `origin/main`
  gefahren: 53, 53, 53. Der bekannte Wackler aus T3, Abschnitt 9, unverändert.

### Die neuen Zusagen im Einzelnen

Unter drei ruhigen Zeilen bleibt sie gefasst, und der Zähler steigt dabei; ab
drei bricht sie aus, mit einem Text aus ihrer Tabelle, in lauter Kleidung, und
sie trägt dabei weiter ihre eigene Marke. Die Bank bekommt auch den lauten
Anlass (ohne diese Zeile verstummt der Chor auf genau den Anlässen, auf denen
am meisten passiert, und der Langvorgang Hintermühl hängt, siehe GW4). Der
Zähler fällt danach zurück, eine Rücknahme steht offen, sie fällt zwei
Sekunden später von selbst nach, sie gehört zu genau diesem Ausbruch, sie legt
die laute Kleidung wieder ab, und danach steht nichts mehr offen. Wer während
des Ausbruchs auf „Schweigt" stellt, verliert die Rücknahme, statt sie später
aus dem Zusammenhang zu bekommen. Und die Niederlage bleibt gefasst, auch bei
vollem Stand, und verbraucht ihn nicht.

---

## 8. Was offen bleibt

**Die drei Szenen bleiben stumm.** `umlauf`, `hintermuehl` und `vorblatt`
haben weiterhin keine Zeilen von ihr. T6 hat sie bewusst nicht angefasst,
**aber die Auflage aus T3 ist damit erfüllbar geworden**: die Rate-Bauart ist
genau das Werkzeug, das dort gefehlt hat. Eine Zeile, die vorprescht und
danebentippt, kommt nachweislich aus dem Haus und nicht aus der Akte, weil sie
über den Fall gar keine Aussage macht. Wer die drei Anlässe füllt, füllt sie
mit Rate-Paaren, und der Nachweis je Zeile fällt dann leicht statt schwer.

Das ist der nächste Abschnitt und nicht dieser: die drei Anlässe hängen am
laufenden Fall, und dort will jede einzelne Zeile einzeln angesehen werden.

**T5e bleibt offen und wird von T6 nicht angefasst.** Der Ausbruch-Kanal ist
dort ab jetzt mitgezählt, siehe Abschnitt 5.

**Der Umschlag ist voll.** Dreizehn Zeilen, der Guard lässt bis vierzehn zu;
den letzten freien Platz hat die T4-Nachlese vergeben.

**Der Preis pro Pointe bleibt, wo er lag.** Für Anlage 2 abgelehnt und aus
gutem Grund: ein Verdachtsbalken an einer Figur, deren ganzes Elend darin
besteht, ungelesen zu sein, würde das Zuhören zur Ressource machen. T6 ändert
daran nichts und schärft die Begründung sogar. Der Ausbruch kostet den Spieler
nichts, und das ist der Unterschied zur Zöllnerin am Schichttor, deren Entwurf
weiterhin fertig in `robin-williams-designstudie-rollen.md`, Teil 2, Abschnitt
5 liegt. Das Haus hat Wachen, es hat Vorgesetzte, und es hat ein Tor.
