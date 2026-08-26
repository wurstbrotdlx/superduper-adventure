# Bauabschnitt T5: Der Ton — OFFEN

Amtsdeutsch hört auf, der Grundton zu sein, und wird die Würze. Anlage 2 hört
auf, ein Schriftstück zu klingen, und fängt an, ein Mensch zu klingen. Und der
Anfang erzählt nicht mehr nur die vierhundert Jahre, sondern die Welt.

**Stand: der Kanon steht, der Bau nicht.** Dieser Abschnitt hat entschieden und
gemessen, gebaut hat er noch nichts am Spiel. Deshalb OFFEN.

---

## 1. Der Auftrag, wörtlich

> und genau das was du hier aufgeschrieben hast, muss unsere anlage 2 uns
> erklären, stück für stück als popup text oder gwünscht im gesprächsbaum.
> 0 bis 5 muss ins intro und Amtsdeutsch trifft Alltag. Der Kontrast trägt
> alles. "Sie verlieren Konfetti. Das ist selten gut." das muss gelockert
> werden, das ist zu hart, 30% beamtendeutsch 70% normal in koversationen,
> außer bei einzelnen charakteren, in den Menüs und erklärtexten sowie
> geschichtstexten oder welterklärtexten normales deutsch, die anlage 2 lässt
> nach den ersten 5 sätzen das amtsdeutsch fallen und redet erstaunlich normal
> und lästert auch gern mal über dieses amtsdeutsch

Das „was du hier aufgeschrieben hast" bezieht sich auf ein Regelregister über
Kapitel 0 bis 19, das unmittelbar vorher entstanden war. Gemeint ist damit
nicht, dass Anlage 2 das Humor-Grundgesetz vorträgt — sie erklärt keine Regeln
über das Spiel, sie erklärt die Welt. Der Umfang ist deshalb auf **Kapitel 0
bis 5** festgelegt worden und steht so im Kanon.

## 2. Was der Kanon entschieden hat

Fünf Eingriffe in `superduper-weltbibel.md`, alle datiert und mit stehen
gebliebener Vorfassung, wie es die Änderungen an Regel 1 und Regel 7 vorgemacht
haben.

1. **Grundgesetz 3 neu gefasst.** Aus „Der Kontrast trägt alles" wird eine
   Mischung: rund drei von zehn Zeilen amtlich, sieben normal. Dazu die
   Begründung, die der Sache erst ihren Sinn gibt: **wo alles amtlich klingt,
   gibt es keinen Kontrast, sondern nur eine Tonlage.** Die harte Beispielzeile
   steht als Gegenbeispiel weiter da, weil sie genau zeigt, was nicht mehr geht.
2. **Grundgesetz 1 präzisiert, nicht aufgeweicht.** Neu ist die Unterscheidung
   zwischen **Zwinkern** (die Figur sieht aus der Welt heraus, gezählt, einmal
   je Figur) und **Meinung** (die Figur findet etwas in ihrer Welt lästig,
   unbegrenzt). Ohne diese Zeile hätte Anlage 2 ihr Kontingent mit dem zweiten
   Lästersatz verbraucht, und die Prüfliste hätte jede weitere Zeile
   herausgeworfen. Der Eingriff war nicht optional, sondern die Voraussetzung
   dafür, dass die Ansage überhaupt umsetzbar ist.
3. **Neue Formregel: „Das Register hängt am Ort, nicht am Haus."** Menüs,
   Erklärtexte, Geschichts- und Welterklärtexte reden normales Deutsch.
   Ausgenommen bleibt das **gezeigte Dokument**: ein Zwischenbescheid von 989
   klingt wie einer, denn dort ist der Amtston der Gegenstand.
4. **Anlage 2 bekommt ihren Ton-Abfall.** Fünf Blätter Urkundenton, danach
   normales Deutsch. Das Maskenset bleibt geschlossen und bleibt bei fünf, es
   wechselt nur den Status: **Kostüm statt Haut.**
5. **Die Prüfliste bekommt drei Fragen** (8, 9, 10) und eine Präzisierung an
   Frage 2. Die Nummern 1 bis 7 bleiben, wohin sie zeigten.

**Zwei Konflikte mussten dabei aufgelöst werden, statt sie stehen zu lassen:**

* **Der U9-Eintrag sagte: „Die SP-Ausnahme bleibt damit die einzige."** Die neue
  Formregel beantwortet dieselbe Frage für alle Fälle auf einmal und beantwortet
  sie andersherum. Der Satz ist jetzt durchgestrichen und mit Begründung
  überholt. Die alte Abwägung war richtig, solange jeder Fall einzeln entschieden
  wurde, und genau das war das Problem.
* **Kapitel 1 sagt, das Weltgesetz wird nie ausgesprochen.** Der Auftrag legt
  Kapitel 0 bis 5 ins Intro und in Anlage 2s Mund, und Kapitel 1 ist eins davon.
  Aufgelöst so: **die Folgen werden erzählt, der Satz fällt nie.** Das ist keine
  Ausweichbewegung, sondern die Wahrheit dieser Figur. Eine Beilage kennt jede
  Nebenbestimmung und nie die Hauptsache.

## 3. Der Fund: wie amtlich das Spiel heute wirklich ist

Der wichtigste Abschnitt dieses Dokuments, und er ist so entstanden, wie es
dieses Projekt verlangt: erst messen, dann behaupten.

**Erster Versuch, und er war falsch.** Die erste Fassung von
`tools/ton-messlauf.mjs` erkannte Amtsdeutsch an einer Wortliste: Vorgang,
Vermerk, Bescheid, zuständig, gemäß, vorbehaltlich. Ergebnis über die gesamte
Figurenrede: **6 Prozent amtlich.** Damit hätte das Spiel weit unter dem
Zielwert von 30 gelegen, und die Ansage des Projektinhabers hätte ins Leere
gezeigt.

**Die Gegenprobe hat das widerlegt.** 43 Zeilen aus dem Bestand, gezogen als
jede 23. aus `DORF_FIGUREN`, `ANLAGE2_NOTIZ` und `KN_FIGUR`, von Hand
eingestuft: **18 von 43 klingen nach Amt, also 42 Prozent.** Der Lauf lag um
den Faktor sieben daneben.

**Der Grund ist eine Erkenntnis über dieses Spiel.** Das Amtsdeutsch steckt
hier fast nie im Vokabular, sondern im **Satzbau**, und dafür gibt es einen
handfesten Grund: der Zeichendeckel von 44 lässt gar keine Behördenwörter zu.
Der Ton ist deshalb in die Form gewandert:

| Muster | Beispiel aus dem Bestand |
|---|---|
| Ellipse ohne Subjekt | „Antrag für heute erledigt." · „Steht in meinem Bericht." |
| Definitionssatz | „Ordnung ist, was man wiederfindet." · „Stehen ist keine Verzögerung." |
| Partizip trägt den Satz | „Berechtigt, wie meistens." · „Notiert." |
| Vorangestelltes Vorfeld | „Zum Rückblick: elf Jahre Dorffest." · „In welcher Sache?" |
| Wiederholung als Definition | „Zustellung bleibt Zustellung." |

Keines dieser Muster enthält ein einziges Amtswort. Eine Wortliste ist dagegen
blind, und **jeder Prüfer, der Ton an Vokabular misst, wird dieses Spiel
falsch einschätzen.**

**Die zweite Fassung misst Duktus mit und trifft 33 von 43** (77 Prozent), bei
einer aufschlussreichen Asymmetrie: zwei Fehlalarme, acht Übersehene. Der Lauf
ist damit **konservativ**. Was er meldet, ist fast immer amtlich; was er nicht
meldet, kann es trotzdem sein. Jede seiner Zahlen ist eine **Untergrenze**, und
er sagt das bei jedem Start selbst.

### Was dabei über das Spiel herauskam

Untergrenzen, mit dem Faktor 1,5 aus der Eichprobe grob hochzurechnen:

| Quelle | gemessen | Soll | Befund |
|---|---|---|---|
| Vorgangspuzzle | 57 % | 0 % | **Spielstimme, redet Amt.** Höchster Wert im ganzen Spiel |
| Dorffest-Absagen | 68 % | 30 % | Figurenrede, deutlich zu hoch |
| Knöterich | 56 % | 30 % | nur 16 Zeilen in `KN_FIGUR`, Menge zu klein für ein Urteil |
| Langvorgänge | 55 % | 30 % | 29 Zeilen |
| Ausweis | 33 % | 0 % | Spielstimme, 3 Zeilen |
| Probezeit-Hinweise | 30 % | 0 % | Spielstimme |
| Hinweise | 19 % | 0 % | Spielstimme, 27 Zeilen |
| Dorffiguren | 17 % | 30 % | die große Masse, 941 Zeilen |
| Szenen | 15 % | 30 % | 719 Zeilen |
| **Figurenrede gesamt** | **19 %** | **30 %** | 2001 Zeilen |

**Der Befund in einem Satz: der Durchschnitt ist nicht das Problem, die Spitzen
sind es.** Die Masse der Figurenrede liegt eher unter dem Zielwert als darüber.
Was hart wirkt, sind einzelne sehr amtliche Nester und vor allem die Stellen,
an denen **das Spiel selbst** spricht: Vorgangspuzzle, Hinweise, Ausweis,
Probezeit-Hinweise. Genau dort tut es am meisten weh, weil dort niemand eine
Figur ist, deren Sprachmarke das entschuldigt.

Damit ist die Ansage des Projektinhabers bestätigt und zugleich geschärft: Es
geht nicht darum, überall Amtsdeutsch abzuziehen. Es geht darum, es aus den
Erklärtexten herauszunehmen und in den Gesprächen dort zu lassen, wo es hin
gehört.

## 4. Das Werkzeug und seine Grenze

`tools/ton-messlauf.mjs`, neu. Braucht Playwright, **keine Grafik**: er liest
Tabellen auf Skriptebene und wartet weder auf `frameNo` noch auf `assetsReady`,
läuft also im frischen Klon ohne `assets/cf/` durch.

```bash
python3 serve.py &
node tools/ton-messlauf.mjs             # je Quelle und je Figur
node tools/ton-messlauf.mjs --eichung   # die zehn Fehleinstufungen im Klartext
node tools/ton-messlauf.mjs --treffer   # die eingestuften Zeilen selbst
```

Drei Eigenschaften, die ihn von den übrigen Läufen unterscheiden:

* **Er trägt seine Eichprobe im Quelltext.** 43 Zeilen mit Handurteil, die
  Zweifelsfälle als solche vermerkt. Ohne sie hätte niemand gemerkt, dass die
  erste Fassung um den Faktor sieben danebenlag. Wer die Muster ändert, lässt
  `--eichung` mitlaufen: eine Verbesserung, die dort schlechter wird, ist keine.
* **Er weist Wort und Duktus getrennt aus.** Bei den Dorffiguren stehen 4
  Prozent Wort gegen 13 Prozent Duktus, und dieses Verhältnis ist die eigentliche
  Aussage über das Spiel.
* **Er behauptet nichts, was er nicht kann.** Bei konservativer Fehlerlage sagt
  er „UNTERGRENZE" und nennt den Hochrechnungsfaktor. Bei Fehlern in beide
  Richtungen sagt er, dass seine Zahlen keine Messung sind. Eine stille Zahl
  ohne diese Zeile wäre schlimmer als kein Werkzeug.

**Was er nicht kann und auch nicht können wird:** ein Urteil über eine einzelne
Zeile fällen. Dafür ist die Trefferquote zu niedrig. Er taugt für Quellen und
Figuren, also für die Frage „wo muss ich hinsehen", nicht für „ist diese Zeile
in Ordnung". Die beantwortet die Prüfliste in Kapitel 19.

**Ein Fund am Rande, und er gehört nicht T5.** Beim Zusammenstellen der Quellen
fiel auf, dass `KN_FIGUR` nur 16 sprechende Zeilen trägt. Knöterichs eigentlicher
Text steht in `DIENSTBLATT` und den Dienstzetteln. Wer künftig „Knöterichs Ton"
messen will, misst mit `KN_FIGUR` allein den falschen Ausschnitt.

## 5. Was gebaut wurde

Am Spiel: nichts. Das ist Absicht und steht so im Kanon-Eintrag. Geändert wurden
`superduper-weltbibel.md` (fünf Eingriffe, Abschnitt 2), `README.md` und dieses
Dokument, dazu `tools/ton-messlauf.mjs` als neues Werkzeug.

Der Grund für den Zuschnitt ist die Zahl aus Abschnitt 3: **2001 Zeilen
Figurenrede.** Ein Bauabschnitt, der Kanon ändert und im selben Zug tausend
Zeilen umschreibt, ist nicht prüfbar. Und ohne den Messlauf hätte er sie in die
falsche Richtung umgeschrieben, nämlich nach Vokabular statt nach Duktus.

## 6. Was offen bleibt

Fünf Stücke, Reihenfolge und Begründung stehen im Kanon-Eintrag (Kapitel 14).

* **T5a, das Register.** Vorgangspuzzle, Hinweise, Ausweis, Probezeit-Hinweise
  und Hausmitteilung auf normales Deutsch. Der kleinste und sicherste Teil, und
  nach Abschnitt 3 der mit dem größten Effekt. Zuerst.
* **T5c, Anlage 2s Ton-Abfall.** Vor T5b, damit ihre neuen Erklärzeilen nicht im
  alten Ton entstehen und zweimal geschrieben werden müssen. Ihr Umschlag bleibt
  unangetastet: er war nie amtlich (15 Prozent, und das sind die
  Fundstellenvermerke).
* **T5b, Anlage 2 als Erklärerin.** Kapitel 0 bis 5 als Randnotizen im Band und
  als Kaskade auf Abruf. Neue Einträge in `ANLAGE2_NOTIZ` und in
  `SZENEN.baumAnlage2`, keine neue Maschine.
* **T5d, das Intro trägt Kapitel 0 bis 5.** Nach T5b, weil beide denselben Stoff
  tragen und sich sonst doppeln.
* **T5e, die Mischung im Bestand.** Zuletzt, und gezielt: die Nester aus der
  Tabelle in Abschnitt 3, nicht der Durchschnitt. Die Dorffiguren und die Szenen
  liegen bereits **unter** dem Zielwert; wer dort Amtsdeutsch abzieht, macht es
  schlechter statt besser.

**Eine Frage bleibt offen und gehört dem Projektinhaber.** Der Zielwert von 30
Prozent stammt aus der Ansage, die Messung sagt 19 Prozent als Untergrenze und
42 Prozent nach Handprobe. Beides zusammen heißt: das Spiel liegt heute
ungefähr dort, wo es hin soll, und der Eindruck „zu hart" kommt woanders her,
nämlich aus den Erklärtexten und aus einzelnen Nestern. Ob T5e danach überhaupt
noch gebraucht wird, entscheidet sich am besten **nach** T5a, wenn die
Spielstimme normal redet und man den Rest zum ersten Mal ohne dieses Rauschen
hört.

## 7. Abnahme

Was dieser Abschnitt liefert, ist nachprüfbar:

* `node tools/ton-messlauf.mjs --eichung` meldet 33 von 43 richtig, 2 Fehlalarme,
  8 Übersehene, und die zehn Fehleinstufungen im Klartext.
* Der Lauf durchquert 31 Textquellen und nennt die nicht gefundenen beim Namen,
  statt sie stillschweigend zu überspringen. Eine umbenannte Tabelle fällt damit
  nicht lautlos heraus.
* Die Weltbibel widerspricht sich an keiner Stelle mehr selbst: die U9-Zeile ist
  überholt statt stehen gelassen, Grundgesetz 1 deckt Anlage 2s Lästern ab, und
  Kapitel 1 bleibt trotz Kapitel 0 bis 5 im Intro unausgesprochen.
* `index.html` ist unverändert. Kein Guard kann durch diesen Abschnitt anders
  melden als vorher.
