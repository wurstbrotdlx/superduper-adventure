# Bauabschnitt AN5: die Kladde fängt den Anfang auf

Wer den Anfang überspringt, verliert ihn nicht mehr. Die zehn Blätter von
Chronik und Ernennung liegen im Akten-Reiter der Kladde, jedes einzeln
aufschlagbar, und der Reiter sagt, wie viele davon ungelesen sind.

## Er kommt zuletzt und hätte als Dritter kommen müssen

Der Masterplan setzt ihn an dritte Stelle: `A0 → AN1 → **AN5** → AN2 → AN3 →
AN4 → AN6 → AN7`. Gebaut wurde er als Letzter, und die Reihenfolge war kein
Zufall des Plans, sondern seine Begründung: **AN5 ist das Netz unter dem
Schneiden.** AN3 hat drei Introblätter zu Requisiten gemacht, AN4 hat den
Erstkontakt der Anlage 2 hinter den ersten freien Schritt gehängt, AN6 nimmt
die Chronik ganz heraus. Alle drei ohne einen Ort, an dem das Weggenommene noch
zu finden wäre.

Dass er ausgefallen ist, hat bis AN4 **niemand notiert**. Das steht hier, weil
es die eigentliche Lehre dieses Abschnitts ist: eine Reihe, die ihre eigene
Reihenfolge nicht prüft, überspringt ein Glied geräuschlos.

## Er ändert kein Wort und keine Zahl, und das ist Absicht

| Route | vor AN5 | nach AN5 |
|---|---:|---:|
| pflicht | 1174 | 1174 |
| vordruck | 1276 | 1276 |
| vielleser | 1539 | 1539 |
| springer | 917 | 917 |

Längster Leseblock unverändert 575 Wörter, Blöcke unverändert `10 6`. Wie AN1
und AN2 bewegt AN5 die Hauptzahl nicht. Er baut das Becken, in das AN6 schneiden
darf.

## Gemessen wird stattdessen das Becken

`intro-pruef` weist es seit AN5 im selben Abschnitt aus wie den Verlust:

```
DAS AUFFANGBECKEN (AN5)
  Vom Anfang gelesen: Pflicht 10 von 10, Springer 1 von 10.
  Die Chronik ................ Pflicht   4   Springer   1   in der Kladde 3
  Die Ernennung .............. Pflicht   6   Springer   0   in der Kladde 6
  Der Springer schlaegt 12 Lesestufen nicht auf. 9 davon liegen in der Kladde.
  Die uebrigen 3 sind Gespraechsknoten: die Kladde traegt
  Blaetter, und ein Knoten ist keines. Das ist die Luecke des Beckens.
```

**Neun von zwölf.** Die Zahl steht mit ihrer Lücke da, und die Lücke ist keine
Nachlässigkeit, sondern die Grenze der Bauform: die Kladde trägt Blätter. Die
drei übrigen sind Knoten aus der Vorstellung, ein Gespräch, das der Springer
abkürzt. Wer sie auffangen will, braucht ein zweites Becken für ein anderes
Material, und das ist kein Nachtrag zu AN5.

**Gemessen am Merker, nicht hochgerechnet.** Der Lauf liest nach jeder Route
`anfangGelesenZahl()` aus dem laufenden Spiel; was dort steht, hat der Weg
selbst aufgeschlagen. Und `frisch()` leert den Lesestand jetzt ausdrücklich,
aus demselben Grund, aus dem es schon `kn.seen.einstellung` nachsieht: ein
stehengebliebener Eintrag ergäbe keinen Absturz, sondern eine falsche Zahl, und
die sieht aus wie ein Ergebnis.

**Eine Rechnung war zuerst falsch und steht berichtigt.** Die erste Fassung
verglich die Lesestufen beider Routen (19 gegen 16) und meldete: *„Der Springer
liest 3 Lesestufen weniger. 9 davon liegen in der Kladde. Die übrigen -6 …"*
Netto stimmt die 3, aber der Springer **gewinnt** neun Vordruckseiten, während
er zwölf verliert. Gezählt wird jetzt je Apparat und nur nach unten, wie in der
Tabelle darüber.

## Warum die Kladde und nicht der Rucksack

Weltbibel, Kapitel 4:

> **Die Kladde bleibt. Immer.** Die Kladde gehört nicht dem Außendienst, sie
> liegt im Amt und ist an den Tisch gekettet. Wissen ist Amtsvermögen.

Ein Auffangbecken für Gelesenes gehört genau dorthin. Es erbt damit die
Todesimmunität und den eigenen Speicher (`sda_kladde_v1`), **ohne dass ein
zweiter Persistenzweg aufgemacht wird** — der Eimer `kladde.anfang` wird additiv
geladen wie `fl`, `vorgang` und `lang`, ein alter Spielstand liest sich als
„nichts gelesen".

`weltgeschichte.md` hat die Idee im Kern schon gehabt: *„Wer noch weiter sparen
will, baut das Intro als Blattserie 0 in der Kladde."* AN5 baut nicht das Intro
dorthin, sondern seinen Nachlass; der Gedanke ist derselbe.

**Neben `BLAETTER` und nicht darin.** Dieselbe Entscheidung wie bei W5 und W7,
und aus demselben Grund: `blaetterAssert()` hält die Sollzahl 54, und die
Zählzeile „N von 54" im Akten-Reiter zählt Kammerfunde. Der Anfang ist kein
Kammerfund.

## Drei Entscheidungen, die man auch anders treffen könnte

**Der Eimer trägt das Gelesene, nicht das Ungelesene.** Der Bestand steht fest
(`ANFANG_BESTAND`), gezählt wird die Gegenprobe. Ein Eimer, der das Ungelesene
trägt, müsste beim Kürzen eines Stapels aufgeräumt werden — dieser nicht, und
genau das braucht AN6.

**Der Zähler steht am Reiter, nicht im Bestand darunter.** Ein Zähler, den man
erst sieht, wenn man schon dort ist, zählt niemanden zurück. Er steht als Zahl
und nicht als Punkt, weil ein Punkt nur „etwas" sagt: „3" nach dem Überspringen
ist eine andere Auskunft als „10". Ist alles gelesen, steht dort nichts — ein
Zähler, der auf null stehen bleibt, ist eine Mahnung ohne Anlass.

**Die Dienstanweisung bekommt einen Verweis und keinen Leser.** Der Masterplan
schreibt sie in die Kladde („liegt am Pult, plus Kladde"). Sie ist seit dem
ersten Dienstantritt ohnehin jederzeit erreichbar, über das Startbild und den
Pult im Amt — das hat die AN3-Nachlese berichtigt. `showDienstblatt()` kennt
drei Rückkehrmodi (`einstellung`, `menu`, `dorf`); ein vierter für einen Weg,
den es zweimal gibt, wäre Aufwand ohne Ertrag. Der Bestand nennt die zwei Orte,
und das ist die Auskunft, die fehlte.

## Gebaut mit dem, was dasteht

* **Der Leseapparat ist der aus SZ1**, ein Blatt lang, „Blatt I von I" — genau
  wie ein Requisit seit AN3. Das Kesselfenster geht dafür zu und danach wieder
  auf, auf demselben Reiter: der Stapel läuft im `#overlay`, das Fenster liegt
  darunter, und zwei offene Flächen übereinander sind das, was
  `grossfensterRaeumen()` verhindern soll.
* **Der Bestand im Reiter** hat die Bauform von `vorgangBestandBlock()`:
  Überschrift, Zeilen, und leer heißt leer statt unsichtbar.
* **Abgehakt wird im Stapel selbst.** `szeneTafeln()` nimmt mit `opt.kladde`
  eine Schlüsselreihe **parallel zur Blattliste** entgegen; `szeneTafel()` hakt
  das gezeigte Blatt ab. Der Stapel weiß damit selbst, was er einträgt, und
  `szeneTafel()` muss keine Blattliste wiedererkennen — dieselbe Bauform wie
  `letzterKnopf` und `ende`. Stapel ohne die Reihe (Requisiten, Anlage 2,
  Abspann, Zwischenbescheide) tragen nichts ein, und das ist der Normalfall.
* **Gelesen heißt gezeigt**, nicht weggeklickt. Wer das letzte Blatt aufschlägt
  und dann das Fenster schließt, hat es gesehen.
* **Kein `CFX.schweigen`-Guard**, aus demselben Grund wie bei `findeBlatt()`:
  gelesen wird am Blatt und nicht am Kessel beobachtet.
* **Vor dem Dienstantritt steht der Bestand nicht da.** Wer noch nicht ernannt
  ist, hat keinen Anfang zum Nachlesen, und die Ernennung vorab aufzuschlagen
  wäre der Vorgriff, gegen den der Sperrvermerk gebaut ist. Dieselbe Bedingung
  wie bei der Nachholung der Anlage 2.

## Ein Fehler beim ersten Start, und er ist lehrreich

`anfangAssert()` stand bei seiner Definition, direkt hinter
`ERNENNUNG_BLAETTER`. Der Bestand zeigt aber mit `liste()` auf
`INTRO_BLAETTER` (460 Zeilen weiter unten) und rechnet mit `ROEMISCH` (2000
Zeilen weiter unten). Der Aufruf lief damit in die temporale Totzone und hat das
Spiel beim Laden angehalten, **bevor der erste Rahmen stand** — kein Panel, kein
Fehlerbild, nur ein schwarzes Feld.

Gefunden beim ersten Start nach dem Einbau, nicht von einem Guard: ein Guard,
der selbst nicht läuft, meldet nichts. Der Aufruf steht jetzt unten neben
`anlage2Assert()`, mit einem Kommentar an der Definitionsstelle, warum er nicht
dort steht.

## Geprüft

| Lauf | |
|---|---|
| `empfang-pruef` | **131/131** (war 115; sechzehn neue Zusagen) |
| `speicher-pruef` | 38/38, drei Zusagen sind strenger geworden |
| `intro-pruef` | alle vier Routen Exit 0, Zahlen unverändert, plus das Auffangbecken |
| `anlage2-pruef` | 123/123 |
| `szene-pruef` | 50/50 |
| `menue-pruef` | 78/78 |
| `stopfen-pruef` | 43/43 |
| `zulagen-pruef` | 50/50 |
| `versuchung-pruef` | 67/67 |
| `mitteilung-pruef` | 32/32 |
| beide `fehlversuch` | grün |
| `tools/build-single.mjs` | läuft durch, 3497 KB |

Weiterhin nicht grün, unverändert und in allen Fällen die fehlende Grafik:
`gespraech-pruef` 87/89 (dreimal von drei dieselben zwei Fehleridentitäten),
`ebene-pruef` 53/54, `innen-pruef` 16/18 mit Abbruch. `szene-pruef` endet auf
Exit 1, auch auf `main` (siehe AN4).

**Die sechzehn neuen Zusagen** in `empfang-pruef` hängen am Springerweg, denn
der ist der Grund für das Becken: vor dem Dienst steht der Bestand nicht da,
nach dem Überspringen ist genau `intro:0` aufgeschlagen, der Reiter führt
„DER ANFANG" und zählt `1 von 10`, der Zähler steht auf `9`, alle zehn Blätter
sind von dort aufschlagbar, das Aufschlagen macht das Kesselfenster frei und
zeigt „Blatt I von I", `ZURÜCK` führt in den Akten-Reiter zurück und der Zähler
steht eins tiefer, und ist alles gelesen, steht am Reiter nichts.

`speicher-pruef` führt den Lesestand jetzt durch Export, Löschen und Import
mit — das ist die Zusage „todesimmun wie die Kladde", geprüft statt behauptet.

## Was AN5 nicht kann

* **Er fängt keine Gesprächsknoten auf.** Drei von zwölf, gemessen und oben
  benannt.
* **Er fängt die Anlage 2 nicht auf**, und das ist richtig: sie hat seit T3 ihr
  eigenes Becken, die Nachholung beim ersten Griff zur Tasche. Zwei Becken für
  eine Figur wären zwei Wahrheiten.
* **Er misst nicht, ob jemand hineinsieht.** Dass der Zähler dasteht, dass er
  stimmt und dass jedes Blatt von dort erreichbar ist, ist gemessen. Ob ein
  Spieler nach dem Überspringen zurückkommt, ist es nicht. **Das ist die Frage
  für die nächste Rückmeldung**, und sie ist die Zwillingsfrage zu der aus AN4.

## Offen

* **AN6** holt die vier Chronikblätter in die Erstbelehrung nach Akt I. Der
  längste Block gehört ihm: 575 Wörter auf 10 Lesetafeln. **Ab jetzt darf er
  schneiden**, ohne dass etwas verschwindet — der Bestand zeigt auf
  `INTRO_BLAETTER`, und was dort steht, steht in der Kladde.
* Die drei Vorstellungsknoten des Springerwegs fängt niemand auf.
* Die Dienstanweisung hat einen Verweis, keinen Leser. Ein vierter
  Rückkehrmodus für `showDienstblatt()` wäre der Weg, wenn das jemand will.
* Kaltstart und Titelkarte (Schritte 1 und 2 des Masterplans) sind unverändert
  nicht gebaut, und **AN7** wartet auf die Hausmitteilung als Tagesträger.
