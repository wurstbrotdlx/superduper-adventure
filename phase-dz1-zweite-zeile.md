## DZ1: Der Deckel der zweiten Zeile — ERLEDIGT

Auf Zuruf des Projektinhabers am 05.10.2026 („Deckel der zweiten Zeile los"),
nachdem T5e in drei Tranchen gemessen hatte, dass die Knappheit der
Dorffiguren sich durch Textarbeit allein nicht rührt.

---

### 1. Was gemessen war, und eine Korrektur dazu

Gezählt am 05.10.2026 über alle Zeilen in `DORF_FIGUREN` (Grundzeilen,
Zusätze, Anlässe, Aktzeilen), knapp heißt wie im Messlauf: höchstens sechs
Wörter und kein Satz über fünf:

| Zeilenart | Deckel | Zeilen | knapp |
|---|---|---|---|
| erste Zeile | 48 | 429 | 65 % |
| zweite Zeile | 32 | 429 | **94 %** |
| Aktzeile | 44 | 67 | 37 % |

Median der zweiten Zeilen 26 Zeichen, 155 von 429 mit 28 oder mehr, also am
Deckel. Der Deckel drückt.

**Korrektur einer eigenen Aussage.** `phase-t5-ton.md`, Abschnitt 5h, sagt:
„Wer sie senken will, baut die Gesprächstafel um, nicht die Texte." Das ist
zur Hälfte falsch. Der Deckel ist die Voraussetzung, nicht die Ursache: ein
Deckel von 48 macht keine einzige Zeile länger, die vorher 26 Zeichen hatte.
Die Knappheit sinkt erst, wenn Texte den Platz nutzen. DZ1 schafft den Platz;
die Zahl 77 Prozent steht nach DZ1 unverändert, und das ist richtig so. Die
Korrektur steht datiert auch in `phase-t5-ton.md`.

### 2. Warum nicht einfach 32 durch 48 ersetzen

Die zweite Zeile wird an zwei Stellen gezeichnet, und beide wurden gemessen
(`tools/deckel-messlauf.mjs`, drei Formate wie RL7, drei Schriftstufen,
längste echte erste Zeile, zweite Zeile 32 bis 52 Zeichen):

* **Die Gesprächstafel** (DOM, `#gespraechText`) bricht um. Eine zweite
  Zeile von 48 Zeichen kostet höchstens eine Satzzeile mehr und rollt bei
  Stufe Normal und Mittel in keinem Format. Im Querformat rollt Stufe Groß
  schon heute bei 32 (drei Satzzeilen auf 390 Pixel Höhe); das bleibt so.
* **Die Sprechblase** (Canvas, `drawBubble()`) brach nicht um. Sie war so
  breit wie ihre längere Zeile und stand mittig über der Figur, ohne Blick auf
  den Rand. **Fund, älter als DZ1:** auf 390x844 bei der voreingestellten
  Schriftstufe war eine erste Zeile mit 48 Zeichen 462 Pixel breit, auf 390
  Pixel Leinwand. Der Abzug zeigte „rhanden. Messstab: vorhanden. Vermerkt."
  am linken Rand abgeschnitten. Das traf bisher nur die längsten ersten
  Zeilen. Mit 48 Zeichen in der zweiten hätte es jede zweite Blase getroffen.

Deshalb zuerst die Blase, dann der Deckel.

### 3. Was gebaut ist

**Die Blase bricht um und bleibt im Bild.** `blasenZeilen()`, `blasenMass()`
und `drawBubble()` in `skript/06`: umbrochen wird an Wortgrenzen und nur, wenn
die Zeile nicht in die Leinwand passt (am Schirm ändert sich nichts), erste und
zweite Zeile getrennt, damit der Satzwechsel ein Zeilenwechsel bleibt. Die
Blase rückt seitlich und nach unten in die Leinwand (`BLASE_RAND`, 6 Pixel),
die Figur nicht. Der Zeilenabstand folgt der Schriftgröße (1,15fach); vorher
stand er fest auf 14 Pixel, und bei der größten Stufe mit 19 Pixel Schrift
lagen die Zeilen damit fast übereinander.

**Die Blase liegt über den Schildern.** Zweiter Fund aus demselben Abzug: die
Namensschilder wurden seit U3 nach der Zeichenschleife ausgegeben und lagen
damit über jeder Blase („Wirt Fass" quer durch Zwirns Satz). Blasen werden
jetzt wie die Schilder gesammelt (`blasenMerken()`) und nach ihnen gezeichnet
(`blasenFlush()`). Ein Satz ist die Auskunft des Moments, ein Schild steht
immer da.

**Das Schild der sprechenden Figur rückt über ihre Blase.** Eine umbrochene
Blase kann drei, vier Zeilen hoch werden und reichte sonst über das eigene
Schild. `npcSchildMerken()` bekommt die Blasenhöhe mit; wer spricht, steht
weiter darüber.

**Der Deckel.** `BLASE_Z2 = 48` in `skript/04`, vor `knAssertCaps()`, mit
Begründung. Er gilt für die zweite Zeile aller Figuren-Sprechblasen:
Grundzeilen, Zusätze, Anlässe, Antworten, Abweisungen (`knAssertCaps()`), die
Anrede (`anredeAssert()`) und die Fortschritts- und Zusatzzeilen der
Langvorgänge (`szeneAssert()`). **Nicht** für Knöterichs Tastenhinweise
(`HINWEISE`, `ESCALATE_DEFS`): das ist eine Erklärung mit Touch-Fassung, dort
ist knapp richtig, und sie bleiben bei 32. Breiter als die erste Zeile wird
die Blase damit nie.

### 4. Was sichtbar ist

Ein Punkt in `NEUERUNGEN`, Stempel `2026-10-05-dz1`: am Telefon brechen
Blasen um, statt am Rand abzureißen. Drei ältere Punkte gekürzt, damit die
Startmitteilung mit dem Stempel des Laufs (03.10.) unter 500 Wörtern bleibt.

### 5. Was ausdrücklich nicht gebaut ist

* **Kein Text ist länger geworden.** Der Platz ist da; ihn zu nutzen ist
  Textarbeit, Figur für Figur, mit der Prüfliste (Frage 10: „Wenn nicht
  Zapf: einen Satz mehr, der den Zusammenhang herstellt") und mit den Marken
  aus Kapitel 8 (Lott, Pommer, Nieselbeck, Umlauf und Zapf bleiben kurz).
* **Der Bereich unter der Statusanzeige.** Im Querformat (844x390) deckt die
  Statusanzeige mit der Ortszeile das obere Viertel der Leinwand. Steht eine
  Figur dort, liegt ihre Blase darunter, mit oder ohne DZ1 an derselben
  Stelle; gemessen am Abzug, nicht verursacht durch DZ1. Die Blase an die
  DOM-Kante zu binden hieße, je Frame eine Layoutabfrage zu machen. Offen.
* **Szenen** tragen seit T1 keinen Deckel auf `z1`/`z2`, sie sind Tafelzüge
  und keine Blasen. Daran ändert DZ1 nichts.

---

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über
Playwright, mit Grafikbibliothek. 05.10.2026.

| Prüfung | Ergebnis |
|---|---|
| `node tools/blase-pruef.mjs` (neu) | **28 von 28** |
| Gegenprobe: Blase vorübergehend ohne Umbruch und ohne Rand | 23 von 28, die fünf Prüfungen auf 390x844 werden rot; danach wiederhergestellt |
| `node tools/deckel-messlauf.mjs` (neu) | Messung oben, Abschnitt 2 |
| Abzüge 390x844 Stufe 1 und 2, 844x390 Stufe 1, 1280x720 Stufe 2 | hochkant vier Zeilen ganz im Bild, Zwirns Schild darüber, fremde Schilder dahinter; am Schirm zwei Zeilen wie vorher |
| `node tools/ladelauf-pruef.mjs` | 12 „in Ordnung", 0 Warnungen, Konsole still |
| `node --check` über sieben Dateien | still |

Regression, alle `tools/*-pruef.mjs`:

| Werkzeug | |
|---|---|
| `anlage2-pruef` | 123 von 123 |
| `aufschub-pruef` | 24 von 24 |
| `blase-pruef` | 28 von 28 (neu) |
| `ebene-pruef` | 54 von 54 |
| `empfang-pruef` | 190 von 190 |
| `gespraech-pruef` | 89 von 89 |
| `hochablage-pruef` | 29 von 29 |
| `innen-pruef` | 27 von 27 |
| `intro-pruef` | misst unverändert: 648 Wörter bis zum ersten freien Schritt |
| `langvorgang-pruef` | 58 von 58 |
| `lv11-13-pruef` | 58 von 58 |
| `menue-pruef` | 78 von 78 |
| `mitteilung-pruef` | 36 von 36 (493 Wörter ab dem 03.10., gezählt am 05.10.2026) |
| `reich-pruef` | 59 von 59 |
| `schluss-pruef` | 36 von 36 |
| `serien-pruef` | 36 von 36 |
| `speicher-pruef` | 38 von 38 |
| `steuerung-pruef` | Alles in Ordnung |
| `stopfen-pruef` | 43 von 43 |
| `szene-pruef` | 50 von 50 |
| `versuchung-pruef` | 67 von 67 |
| `zulagen-pruef` | 50 von 50 |
