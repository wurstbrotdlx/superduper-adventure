## EF1: Die Entscheidungen zur Endfassung — ERLEDIGT

Auf Zuruf des Projektinhabers am 06.10.2026 („ich will das projekt zeitnah
final haben"; dann „Liste unter 3 streichen, 1 bis 4 nach deinem Vorschlag").
Vorher stand eine Bestandsaufnahme: `main` auf `b33f59a`, Prüfung und Deploy
grün, keine offenen PRs und Issues. Gebaut werden musste nichts mehr. Offen
waren Entscheidungen, die in den Phasendokumenten seit T5e, W11-GH und
LV11-13 als „Entscheidung des Projektinhabers" lagen, und eine Reihe von
„Bewusst offen", die bei jeder Sitzung mitwanderten.

Dieser Abschnitt ändert **keinen Spielcode**. Er ändert Kanon (datiert in der
Weltbibel), zwei Prüfläufe und einen Messlauf. Für Spieler ist nichts
sichtbar, deshalb gibt es keinen Punkt in `NEUERUNGEN`.

---

### 1. Die vier Entscheidungen

Der Projektinhaber hat „nach deinem Vorschlag" entschieden. In der
Bestandsaufnahme stand der Vorschlag nur als „kleine Ja/Nein-Fragen", ohne
Richtung je Frage. Die Richtung ist deshalb hier festgelegt und begründet,
damit niemand eine Zustimmung zu etwas liest, das nicht vorlag. Leitlinie war
für alle vier dieselbe: **kein neuer Umfang, und kein Kanon wird gelockert,
um einen anderen zu bedienen.**

| | Frage | Entschieden | Warum |
|---|---|---|---|
| 1 | Bekommt die vierte Wurzel (das Kürzel, das ein Wort ist) Plätze über die Zwölf hinaus? FEST, PROBE, STUFE lagen als Entwurf vor (`phase-t5-ton.md`, 5f). | **Die Zwölf bleibt.** | Die Zwölf ist eine Zusage („mehr nicht"), die vierte Wurzel eine Bauregel. Eine Bauregel hebt keine Zusage auf. Drei neue Kürzel wären neue Kaskaden in drei Figuren, also neuer Umfang. |
| 2 | Wer steht in den Sprachmarken-Listen des Ton-Messlaufs? Umlauf stand unter „amtlich", Wirt und Chor hatten kein Gegenstück (`phase-t5-ton.md`, 5g und 5h). | **Amtlich: Bramsche, Milb, Vorblatt. Nicht amtlich: Fass, Lott, Pahl, Zapf.** Umlauf und Nieselbeck in keiner Liste. | Grundgesetz 3 nennt genau die drei. Kapitel 8 gibt Umlauf Aufzählung und Abbruch, Nieselbeck das Melden, beides kein Amtston als Marke. Fass, Lott und Pahl sind seit T5e-2 ausdrücklich „aus der Figur heraus" unter dem Zielwert, Zapf seit T5e-2 ausgenommen. |
| 3 | G 1 und G 6 zurück zum Wortlaut der Weltgeschichte, dafür den Sperrvermerk-Guard lockern? (`phase-w11-serien-g-h.md`, 3) | **Umformulierung bleibt, Guard bleibt.** | Der Sperrvermerk ist Kanon mit demselben Rang, die neue Fassung von G 1 deckt sich mit dem Glossar, und eine Ausnahmeliste je Blatt wäre die erste Lücke im Guard. |
| 4 | Fünfte Antwort in Szene 7 an vierzig oder einundvierzig Blättern? (`phase-lv11-13-langvorgaenge.md`, 3) | **Vierzig bleibt.** | Das einundvierzigste Blatt entsteht erst in derselben Szene. An einundvierzig wäre die Antwort unerreichbar. |

Eingetragen, je datiert und mit Rückverweis hierher:

* Weltbibel, Kapitel 13, nach der vierten Wurzel (1).
* Weltbibel, Kapitel 13, Grundgesetz 3, Punkt 2 (2), und `tools/ton-messlauf.mjs`.
* Weltbibel, Kapitel 12, nach dem W11-GH-Nachtrag (3); `phase-w11-serien-g-h.md`, Nachtrag.
* Weltbibel, Kapitel 10, nach dem LV11-13-Nachtrag (4); `phase-lv11-13-langvorgaenge.md`, Nachtrag.

### 2. Was für die Endfassung gestrichen ist

Fünf Punkte aus „Bewusst offen", auf Entscheidung des Projektinhabers. Keiner
ist ein Fehler, jeder wäre neuer Umfang. Sie stehen jetzt in der Weltbibel
unter „Was wir ausdrücklich nicht bauen" und in ihren Phasendokumenten als
datierter Nachtrag. Die Begründungen unter „Bewusst offen" bleiben stehen.

* Konfetti und Partikelregen im Abspann (SZ4)
* Musik im Abspann (SZ4)
* eine zweite Gestalt für Vorblatt (SZ3, SZ4)
* die erzählte Kutschfahrt nach Hochablage (HO1)
* der Zugzähler für Konrads Karten im Spielstand (KA1)

### 3. T5 ist abgeschlossen

Mit 1 und 2 sind die letzten Fragen aus T5e entschieden. Die Knappheit der
Dorffiguren bleibt bei 77 Prozent: Texte, die den Platz der zweiten Zeile aus
DZ1 nutzen, wären eine eigene Tranche und gehören nicht zu T5. Überschrift
und Stand in `phase-t5-ton.md` und Weltbibel Kapitel 14 stehen auf ERLEDIGT,
Abschnitt 8 dort hält den Abschluss fest.

**Berichtigung am Messlauf.** Der Kopf von `tools/ton-messlauf.mjs` sagte,
die ausgenommenen Figuren würden „statt in den Schnitt gerechnet" getrennt
ausgewiesen. Der Code hat sie nie herausgerechnet. Berichtigt ist der
Kommentar, nicht die Rechnung: sonst wären die Zahlen aus T5 bis DZ1 mit
allen späteren nicht mehr vergleichbar.

### 4. Der Mitteilungslauf hängt nicht mehr an einem festen Tag

`tools/mitteilung-pruef.mjs` prüft, dass die Hausmitteilung für jemanden, der
gestern gespielt hat, unter 500 Wörtern bleibt. „Gestern" stand dort fest auf
dem 03.10.2026. Jeder Punkt nach dem 03.10. lief damit in dieselbe Zählung,
und die Grenze maß keinen Morgen mehr, sondern alles seit einem festen Tag. Die
Hausmitteilung wurde deshalb am 04. und 05.10. dreimal gekürzt, ohne dass ein
einzelner Morgen zu lang war (Merkposten der Obsidian-Notiz vom 05.10.).

Jetzt ist „gestern" der Tag vor dem jüngsten Punkt in `NEUERUNGEN`. Nicht die
Uhr des Rechners, denn dann hinge das Ergebnis am Tag des Laufs und an einem
Tag ohne neuen Punkt wäre die Prüfung leer.

Gemessen am 06.10.2026 gegen dieselbe `NEUERUNGEN`:

| Stempel | Punkte | Wörter |
|---|---|---|
| fest 2026-10-03 (bisher) | 17 | 493 |
| Tag vor dem jüngsten Punkt, 2026-10-04 (jetzt) | 13 | 350 |

Die 493 lagen sieben Wörter unter der Grenze, und jeder weitere Punkt hätte
den Lauf rot gemacht.

### 5. Der Gesprächslauf: F greift manchmal nicht, und das ist keine Wartezeit

`phase-lv11-13-langvorgaenge.md` führt unter „Bewusst offen", dass
`gespraech-pruef` nach F nur 120 ms wartet und das einmal in zwanzig Läufen
nicht reichte. Die Vorgabe dort: erst messen, wie lange die Tafel wirklich
braucht.

**Gemessen** (06.10.2026, ohne Grafik, zwei Läufe parallel auf demselben
Rechner): vom Tastendruck bis `gespraechOffen` 7 bis 132 ms, meist unter 30.
In einem von fünf Läufen ging die Tafel beim zweiten F („F oeffnet erneut")
**auch nach 2 Sekunden nicht auf**. Die Wartezeit war also nicht die Ursache:
an dieser Stelle wird F manchmal gar nicht angenommen. Die Ursache ist zum
Zeitpunkt dieses Eintrags noch nicht gefunden.

**Gebaut ist bis hier:** der Lauf wartet auf die Tafel (`fDruecken()`,
höchstens zwei Sekunden) statt auf die Uhr, und vor dem Weggehen prüft eine
neue Zeile, dass die Tafel wirklich offen war. Vorher bestand „wer weggeht,
beendet das Gespraech" auch dann, wenn F nie gegriffen hatte.

### 6. Was bis zur Endfassung bleibt

* **Abnahme auf einem echten Telefon** (EF2). Bisher drei Fenstergrößen im
  Container, Gerätefaktor 1. Dazu der Trennstrich im Amtstitel
  (`hyphens:auto` trennt im Container-Chromium nicht, RL7 Befund 3).
* **W9, Tooltipps und Mechanikhilfe**, steht in der Weltbibel seit W8 auf
  OFFEN. In der Bestandsaufnahme vom 06.10.2026 übersehen, beim Nachziehen
  der Weltbibel gefunden. Bauen oder streichen ist eine Entscheidung des
  Projektinhabers und nicht Teil dieses Zurufs.
* **Texte, die den Platz der zweiten Zeile nutzen**, und **die Sprechblase
  unter der Statusanzeige im Querformat** (DZ1, „Entscheidungen"): beide
  vorgelegt, keine entschieden. Vorschlag: das erste ist für die Endfassung
  nicht nötig, das zweite eine bekannte Einschränkung.

### 7. Prüfprotokoll

06.10.2026, Container ohne Grafik:

| Lauf | Ergebnis |
|---|---|
| `node --check` über sieben Dateien und drei geänderte Werkzeuge | still |
| `node tools/ton-messlauf.mjs` | Figurenrede 2244 Zeilen, 17 Prozent, Dorffiguren 19, unverändert; neue Kennzeichnung wie in Abschnitt 1 |
| `node tools/ton-messlauf.mjs --eichung` | 42 von 43, 0 Fehlalarme, unverändert |
| `node tools/mitteilung-pruef.mjs` | 36 von 36 |
| `node tools/gespraech-pruef.mjs` | 88 von 90; die zwei roten Zeilen (zweites Porträt, Nörgels Blatt) brauchen die Grafik |
