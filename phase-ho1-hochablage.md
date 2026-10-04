## HO1: Hochablage als Ort, nach dem Schluss — ERLEDIGT

Der Ort, den Vordermühl nie zeigt, einmal gezeigt: nach der Zustellung von
Vorgang 1, vier Tagesreisen weit, ein einziger Raum. Gebaut am 04.10.2026 auf
Zuruf des Projektinhabers („Hochablage als Ort und T5e"), nach einer
Kanon-Entscheidung, die vorgelegt wurde und nicht getroffen (Entscheidung A von
drei, Abschnitt 1). T5e ist nicht Teil dieses Abschnitts und wartet auf
eigenen Zuruf.

---

### 1. Das Kanonproblem, und wie es aufgelöst ist

Die Weltgeschichte, Kapitel 3: „Es fährt keine Kutsche hin, weil es keine
Straße gibt. Es gab eine. Sie wurde zur Klärung zurückgestellt." Die Weltbibel
(Kapitel 8, seit KA1): „Vordermühl zeigt Hochablage nur auf Papier." Und
Kapitel 16 hielt fest: „Offen bleibt Hochablage als Ort."

Der Satz über die Straße trägt die Lösung schon in sich. Szene 9, Bild 10:
am Nachmittag der Zustellung werden alle zurückgestellten Vorgänge
geschlossen. Die Straße ist ein zurückgestellter Vorgang. Also ist sie seit
jenem Nachmittag frei, und zwar nur seither.

Drei Wege wurden vorgelegt: **A** Hochablage nach dem Schluss, als Innenraum
hinter einer Kutsche, die erst dann dasteht; **B** Hochablage im Abspann
begehbar, vor dem letzten Bild; **C** nicht bauen, Kapitel 16 bleibt offen.
Entscheidung: **A.** Der Kanonsatz aus KA1 wird dafür erweitert, nicht
gestrichen: *Vordermühl zeigt Hochablage nur auf Papier, bis der Vorgang
zugestellt ist.* Vor dem Schluss ändert sich nichts. Wer den Abspann nie
sieht, sieht Hochablage nie, und das ist richtig so.

### 2. Was gebaut ist

**Die Kutsche.** `KUTSCHE` und `setzeKutsche()` in `skript/05`, gebaut wie der
Stopfen: der Platz wird gesucht, nicht gesetzt. Anker ist Kachel
(DORF_DX + 23, DORF_DY + 27), nordöstlich des Amtes, oberhalb des Marktes;
von dort spiralförmig das nächste freie Dreierfeld (`reachbar` auf allen neun
Kacheln), gedeckelt auf Zeile 28 und Spalte 21, damit der Spieler beim
Aussteigen auf Zeile 29 im Bild bleibt. Eine Karte ohne freies Dreierfeld
hat keine Kutsche und meldet das in der Konsole; ein Befund, kein Fehler.
`kutscheDa()` ist der Schalter: nur im Schichtmodus, nur nach
`vorgangGeschlossen()`, nur draußen auf Ebene 1. `drawKutsche()` zeichnet sie
nach `drawStopfen()`, `scanAktion()` bietet davor „Nach Hochablage" an
(`AKT_KUTSCHE`), `kutscheFahren()` legt `KUTSCHE_BLATT` in den Tafelstapel
(MITFAHREN) und betritt dann den Raum über `betreteHaus(INN_FERN[0])`.

**Der Raum.** `INN_RAEUME.hochablage`, „Hochablage, Turm I", fünfzehn Kacheln
breit, neun hoch, Kachelsatz `INN_SAETZE.hochablage` (Steinwand, heller
Boden, Ersatzfarben ohne Grafikpaket). Darin die Tür mit dem Schild
(`INN_MOEBEL['I']`, zwei Kacheln, Nordwand, Mitte), zwei Turmfenster
(`'1'`, Nordwand, je eines links und rechts), der Wasserspender (`'M'`),
zwei Bänke (`'B'`, bestehend). Die „Tür" des Raums ist die Kutsche:
`INN_FERN` trägt den einen Eintrag, der kein Haus im Dorf ist, mit
`tuer` auf der Kutschenkachel, und `betreteHaus()`/`verlasseHaus()` lesen
nichts anderes. Hinausgehen stellt den Spieler vor die Kutsche. Derselbe
Mechanismus wie jedes Haus, kein zweiter.

**Die Figur.** Fünfzehnter Eintrag in `DORF_FIGUREN`: der **Erzhalter des
Hauses Randbemerkung**, aus der Weltgeschichte, Kapitel 3 (die Aktenhäuser)
und Szene 9, Bild 2 (die Lagen fallen ab). Sechs Grundzeilenpaare, eine Aktzeile
in Akt V, alle unter den Deckeln. Er steht am Fenster, nur im Raum
(`nurInnen:true`, neue Flagge: `figDrinnen()` lässt ihn auch dann drinnen,
wenn kein Innenbetrieb läuft), nur nach dem Schluss (`daWenn`). Draußen
kommt er nie vor, `hochablage-pruef` prüft das positiv. Seine Anrede steht
in `ANREDE`, Zeile zwei „Ich habe mich umgedreht.", weil das die Figur ist:
vierhundert Jahre gedreht worden, seit heute Nachmittag dreht er sich selbst.

**Drei Requisiten.** `REQUISITEN.kabinett` (die Tür mit dem Schild: IM
TERMIN, darunter mit Bleistift „und ein Zweiter"), `REQUISITEN.wasserspender`
(die leere Bank, das Schild, das um Rücksicht bittet, die helle Stelle im
Holz nach siebenundsechzig Jahren) und `REQUISITEN.turmfenster` (dreizehn
Türme, Konfetti bis zu den Knien, und vier Tagesreisen südwestlich
Vordermühl). Alle drei mit WEGSEHEN, alle drei im Stapel-Guard. Der Kaiser
kommt nur im Präsens vor und nur als Schild.

**Das Fahrt-Blatt.** `KUTSCHE_BLATT` in `skript/06` ist kein Requisit, denn
es hängt an keiner Wand; `szeneAssert()` prüft es als eigenen Stapel mit
derselben Sperre.

### 3. Was sichtbar ist

Ein Punkt in `NEUERUNGEN`, Stempel `2026-10-04-ho` (achter desselben Tages,
28 Punkte im Umlauf, gezählt am 04.10.2026). Dorfplatz, oberhalb des
Marktes, nach dem Abspann.

### 4. Was ausdrücklich nicht gebaut ist

* Kein Weg nach Hochablage vor dem Schluss. Bramsches Antwort „Vier Tagesreisen.
  Ohne Straße." bleibt stehen; sie ist vor dem Nachmittag richtig.
* Konrad zu Händen Aufschub steht nicht im Raum. Seine Bank ist leer, und
  das ist der Inhalt des Raums: „Nach mir kommt niemand mehr." Er hängt
  weiter in der Amtsstube (KA1).
* Nur Turm I, nur das oberste Geschoss. Keine Stadt, keine Brücken, kein
  zweiter Raum. Das Fenster erzählt, was draußen ist.
* Kein Spielstand-Feld. Die Kutsche hängt an `vorgangGeschlossen()`, das
  schon gespeichert wird.

### 5. Funde beim Bau

* **`innenAssert()` riss Datei 05 ab.** Die Prüfungen (6) und (7) lesen
  `CF_BLD[h.b.bld].tuerDx` und den Fußabdruck des Hauses; die Kutsche hat
  kein Blatt und keinen Fußabdruck. Der TypeError auf Skriptebene ließ alles
  nach dem Guard undefiniert, der sichtbare Fehler hieß „aktArt is not
  defined" und stand zwei Dateien weiter. Die Schleife läuft jetzt über
  `INN_HAEUSER.concat(INN_FERN)` und überspringt (6) und (7) für Einträge ohne
  `x0`. Guards werfen nie, sie melden; dieser hat geworfen, weil er einen
  Eintrag bekam, den es vorher nicht gab.
* **Die Kutsche stand hinter der Amtsfassade.** Zwei Abzüge nördlich des
  Amtes (Anker Zeile 26, dann 23) zeigten keine Kutsche. Das Amtsblatt
  `Inn_Blue.png` ist 192 Pixel hoch, bei Maßstab 2 also 384, und deckt von
  Zeile 34 zwölf Zeilen hinauf; alles auf den Kacheln 5 bis 19 darüber ist
  verdeckt. Rechts davon ist frei: ab Kachel 21 steht nichts davor, der
  Markt deckt erst ab Zeile 30. Der Anker ist deshalb (23, 27), und alle
  Texte sagen „Dorfplatz, oberhalb des Marktes" statt „Nordrand".
* **`aufschub-pruef` zählte alle Requisiten.** Die Prüfung „drei Requisiten
  in der Amtsstube" las `Object.keys(REQUISITEN).length` und wurde mit den
  drei neuen aus Turm I rot (6 statt 3). Sie zählt jetzt die Requisiten, die
  im Plan der Amtsstube stehen; das ist, was die Zeile behauptet.
* **`anredeAssert` meldete die Figur.** Jede Figur braucht eine Anredeform;
  die erste Fassung der zweiten Zeile hatte 33 Zeichen bei Deckel 32.

---

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über
Playwright, mit Grafikbibliothek (für die Abzüge). 04.10.2026.

| Prüfung | Ergebnis |
|---|---|
| `node tools/hochablage-pruef.mjs` (neu) | **31 von 31** mit `ABZUG`, 29 ohne (die zwei Abzüge zählen mit) |
| Abzug 1280x800, Dorf nach dem Schluss | die Kutsche steht sichtbar nordöstlich des Amtes über den vier Marktständen, der Knopf „Nach Hochablage" liegt an |
| Abzug 1280x800, Turm I | Steinwand, zwei Fenster, die Tür mit dem Schild, der Wasserspender, zwei Bänke, der Erzhalter am Fenster |
| `node tools/ladelauf-pruef.mjs` | 12 „in Ordnung", 0 Warnungen, Konsole still |
| `node --check` über sieben Dateien | still |

Regression, alle `tools/*-pruef.mjs`:

| Werkzeug | |
|---|---|
| `anlage2-pruef` | 123 von 123 |
| `aufschub-pruef` | 24 von 24 (25 mit Abzug), nach der Korrektur aus Abschnitt 5 |
| `ebene-pruef` | 54 von 54 |
| `empfang-pruef` | 190 von 190 |
| `gespraech-pruef` | 89 von 89 |
| `innen-pruef` | 27 von 27 |
| `intro-pruef` | misst unverändert: 648 Wörter bis zum ersten freien Schritt |
| `langvorgang-pruef` | 58 von 58 |
| `lv11-13-pruef` | 58 von 58 (Figurenzählung 14 → 15) |
| `menue-pruef` | 78 von 78 |
| `mitteilung-pruef` | 36 von 36 (siehe Hinweis) |
| `reich-pruef` | 59 von 59 |
| `schluss-pruef` | 36 von 36 |
| `serien-pruef` | 36 von 36 |
| `speicher-pruef` | 38 von 38 |
| `steuerung-pruef` | Alles in Ordnung |
| `stopfen-pruef` | 43 von 43 |
| `szene-pruef` | 50 von 50 |
| `versuchung-pruef` | 67 von 67 |
| `zulagen-pruef` | 50 von 50 |

**Hinweis zu `mitteilung-pruef`:** im Sammellauf rot (35 von 36), derselbe
Fall wie bei KA1: der neue Punkt brachte die Startmitteilung mit Stempel von
gestern auf 516 Wörter, die Zeile verlangt unter 500. Vier Punkte gekürzt
(Kutsche, Druck aus Hochablage, „Diese Mitteilung ist kürzer", Urkunden):
28 Punkte, 982 Wörter im Umlauf, 335 beim Start mit Stempel von heute, 488
mit Stempel von gestern (gezählt am 04.10.2026). Danach 36 von 36.

**Nachlauf:** der Erzhalter hat nach dem Sammellauf eine andere Frisur
bekommen (h2 statt h3, siehe `figuren-dorf.md`); `hochablage-pruef` und
`ladelauf-pruef` danach erneut, beide wie oben.

### Bewusst offen

* **Die Kutsche fährt sofort.** Vier Tagesreisen sind ein Blatt und ein
  Schnitt. Wer die Fahrt erzählen will, hängt Blätter an `KUTSCHE_BLATT`.
* **Der Erzhalter hat keinen Baum**, nur Grundzeilen und eine Aktzeile. Er
  hat nichts zu fragen und nichts zu beantworten; wer ihm Fragen gibt, gibt
  ihm einen Vorgang, und er hat gerade keinen mehr.
