## LV11-13: Der Eimer, der richtige Wortlaut, einundvierzig Blätter — ERLEDIGT

Die drei letzten Langvorgänge aus `weltgeschichte.md`, Kapitel 10. Nummer 9
(Hintermühl) steht seit W7 im Code, Nummer 10 (der Stopfen) seit SZ3; mit
diesen drei sind zwölf der dreizehn Stränge in `LANGVORGAENGE`, und der
dreizehnte, die Zustellung, ist der Hauptstrang selbst und kein
Tabelleneintrag. Kein Satz der Weltgeschichte ist hier erfunden worden; wo
einer gekürzt ist, steht warum.

Gebaut am 04.10.2026 auf Zuruf des Projektinhabers („Langvorgänge 9 bis 13
jetzt bauen"), nach W11-GH. Zugleich und auf Zuruf im selben Lauf: die
Hausmitteilung gekürzt (Abschnitt 7).

---

### 1. Nummer 11, der Eimer (Nieselbeck)

„Er darf die Veranlassung im Frostkamm nicht holen, weil er für Wetter
zuständig ist und nicht für Ablagen. Der Außendienst ist für Ablagen
zuständig." Also holt der Außendienst sie: aus einer Kammertruhe im Frostkamm
(`biome 'snow'`), über denselben `kammer`-Trichter, den der Gutachter seit W7
benutzt. `auftragEreignis('kammer', k)` reicht das Kammerobjekt durch, der
Strang liest `info.biome`. Kein neues Ereignis, kein Gegenstand im Rucksack:
die Veranlassung ist Bit 4 im Rohwert (`EIMER_VLG`), und `truheOeffnen()`
wirft dafür einen Floater („+ Veranlassung, auf Eis"), indem es den Rohwert
vor und nach dem Trichter vergleicht.

Vier Beats, alle bei Nieselbeck, in seinem Telegrammstil mit den Kürzeln aus
`ABKUERZUNGEN` (`Vlg.`, `TNM`). Stufe 2 setzt das Bit voraus: wer die
Veranlassung nicht hat, bekommt nach dem ersten Satz nichts weiter. Gatter Akt
II, weil die Veranlassung eine Ablage ist und Bramsche ab demselben Akt sagt,
dass im Frostkamm eine liegt.

**Belohnung, wörtlich „absichtlich kein Bonus":** im Abspann fällt der Regen
zwei Bilder früher (von Platz 10 auf Platz 8, vor Nörgels Entfristung) und
Nieselbeck hat den Hut auf. `abspannBlaetter()` baut die Liste und sortiert
das eine Blatt um; die Hymne bleibt an Index 11, weil nur umsortiert wird,
was vor ihr liegt (der Guard in `vorgangAssert()` prüft genau das). Die
Regieangabe sagt dazu: „Er hatte ihn seit dem Morgen auf." Dazu zwei
Zusatzzeilen bei ihm am Schalter `lang:'eimer'`.

### 2. Nummer 12, der richtige Wortlaut (Bramsche und Pommer)

Sieben Beats, abwechselnd, wie die Kette bei Hintermühl, nur dass hier jeder
Schritt den Antrag um ein Wort richtiger macht: von „In welcher Sache?" über
„Es wird beantragt" bis „Herausgabe der Archivausfertigung, Zimmer 4. So steht
es da." Pommers Hälfte ist die Tatsache aus `figuren-leben.md`, die bis zu
diesem Strang in keiner Sprechblase stehen durfte: er schreibt abends
Entwürfe, für Fälle, die nie eintreten. Sie fällt in Beat 6. Gatter Akt III.

**Die Schlange bei Bramsche ist Absicht.** Sie trägt jetzt drei Stränge
(Anlage 3, der Praktikumsbericht, der Wortlaut), und `langAnsprechen()` nimmt
je Tastendruck den ersten, der vorrückt. Der Wortlaut steht in der Tabelle
hinter `anlage3`, also geht Anlage 3 (Akt II) vor; `lv11-13-pruef` misst,
dass ihr erster Tastendruck mit offener Anlage 3 deren Beat bringt und der
Wortlaut bei 0 bleibt. Bei einer Frau, die „In welcher Sache?" sagt, ist das
kein Fehler.

**Belohnung:** die Archivausfertigung, „in Akt V das Blatt, das Sturz
gegenzeichnet". Das vierte Finale-Teil (`VORGANG_PUZZLE[3]`) trägt seit LV4
einen Zusatz für den Präzedenzfall; jetzt trägt es einen zweiten, und `text`
ist dafür eine Funktion geworden (`puzzleText()` liest Zeichenkette oder
Funktion). Vier Fassungen, und der Kanon aus Kapitel 9 (`PUZZLE4_KANON`) steht
in jeder davon vorn. `langAssert()` Punkt (10) rendert beide Strangzustände
wie bisher, `lv11-13-pruef` alle vier. Dazu je zwei Zusatzzeilen bei Bramsche
und Pommer.

### 3. Nummer 13, einundvierzig Blätter (Vorblatt)

„Vierzig liegen im Schreibtisch. Der einundvierzigste klebt in Akt V auf dem
Umschlag." Beides gibt es im Spiel seit SZ2 und SZ4: die zweite Schublade
(Szene 3, `schubladeBlaetter()`, vierzig Tafeln von 972 bis 1011) und der
Stempel am Ende der Versuchung (Szene 7). Der Strang zählt, was die beiden
Szenen tun, und hängt sich mit zwei Haken dran: `schubladeEnde()` und
`versuchungEnde()` feuern die neuen Ereignisarten `schublade` und `stempel`.
Der Rohwert ist die Zahl der Blätter (0, 40, 41), die Stufe daraus abgeleitet.
Kein neuer Ort, kein Gegenstand. Gatter Akt III, weil die Schublade ab Akt III
klemmt.

**Die eine Entscheidung dieses Strangs:** die fünfte Antwort in Szene 7 hängt
an den **vierzig**, nicht an einundvierzig. Der einundvierzigste ist der
Stempel, den Vorblatt in genau dieser Szene aufdrückt; wer ihn zur Bedingung
machte, machte die Antwort unerreichbar. Die Weltgeschichte sagt „wer alle
hat"; alle, die es vor dem Stempel gibt, sind vierzig.

**Die fünfte Antwort** steht als Frage `jahre` in `SZENEN.versuchung.fragen`
mit einer Bedingung `wenn: () => bescheideVierzig()`. Dafür kennt
`szeneOffen()` neben `frei` und `nach` jetzt ein drittes Tor, `wenn`: eine
Funktion und kein Schlüssel, weil die Szene nicht wissen soll, wie der Strang
zählt. Die Tafel bleibt bei vier Zeilen (`sicht 3` plus Ausgang), die Frage
rückt nach, sobald eine der drei anderen gestellt ist. Die Spielerzeile ist
auf den Antwortdeckel gekürzt: „Sie haben einundvierzig Jahre lang
gearbeitet." hat 46 Zeichen, der Deckel ist 28, also „Einundvierzig Jahre
Arbeit." (27). Dieselbe Kürzung haben die drei Fragen darüber seit SZ4.
Vorblatts drei Sätze stehen wörtlich; der dritte als Fortsetzung (`weiter`),
weil er der einzige wahre Satz seines Lebens ist und einen eigenen Zug
bekommt. Dazu zwei Zusatzzeilen bei ihm.

**Heilung für Altbestände:** wer die Schublade oder die Versuchung gespielt
hat, bevor es den Strang gab, trägt die Merker in `kn.flags` und den Rohwert
0. `bescheideMigration()` zieht beim Laden nach, Muster `stempelMigration()`
aus SP1. Nur im Schichtmodus, wie `langEreignis()` selbst.

### 4. Der Guard

`LANG_PROBEN` kennt drei neue Probenfamilien: `kammer` mit `[null,
{biome:'snow'}, {biome:'grass'}]`, `schublade` und `stempel` mit `[null]`.
Ohne die snow-Probe meldete Punkt (2) den Eimer als toten Eintrag, zu Recht.
Alle übrigen Prüfungen (Tabellenform, Deckel z1 48 / z2 32, Abkürzungen,
Sperrvermerk, Blockadefreiheit, Inertheit, Zusatzschalter in `DORF_FIGUREN`)
laufen unverändert über die drei neuen Stränge mit. Die Konsole ist still.

### 5. Der Fund: Bramsche trug zweimal `zusatz`

`lv11-13-pruef` meldete beim ersten Lauf, Bramsche habe keinen Block am
Schalter `wortlaut`, obwohl er im Quelltext stand. Ursache: ihr Eintrag in
`DORF_FIGUREN` hatte zwei Schlüssel `zusatz`, einen von SZ3 (vor den
Antworten) und einen von W11 (danach). In einem Objektliteral gewinnt der
letzte, ohne Fehler und ohne Warnung. **Bramsches zwei Stopfen-Zeilen aus SZ3
waren seit dem Einbau nie im Spiel**, und kein Guard konnte das sehen, weil
jeder die Tabelle nach dem Parsen liest. Alle vierzehn Figuren wurden auf
doppelte Schlüssel geprüft (Skript über den Quelltext, 04.10.2026): nur
Bramsche, nur `zusatz`. Jetzt steht alles in einem Block, und
`lv11-13-pruef` liest den Quelltext von `skript/02` und meldet einen zweiten
Schlüssel je Figur.

### 6. Was sichtbar ist

Ein Punkt in `NEUERUNGEN`, Stempel `2026-10-04-lv` (sechster desselben Tages).
Herr Nieselbeck, die Registratur, die Materialausgabe und Vorblatts
Versammlung; der Reiter LAUFENDE VORGÄNGE in der Kladde.

### 7. Die Hausmitteilung, gekürzt

Auf Zuruf mitten im Lauf („kürze mal die Hausmitteilung aufs Wesentliche, das
ist schon wieder ne Wall of Text"). Gemessen am 04.10.2026 vor dem Schnitt:
beim Start standen **24 Punkte mit 1486 Wörtern**, alle seit August, jedes
Mal. Zwei Änderungen:

* **Jeder Punkt trägt sein Datum** (`am`, ISO). `neuerungenNeu()` zeigt beim
  Start nur die Punkte ab dem Tag des zuletzt gestempelten Standes (der Stand
  beginnt mit dem Datum). Derselbe Tag zählt mit, weil an einem Tag mehrere
  Stände fallen und ein Punkt lieber zweimal steht als nie. Ohne Stempel, oder
  wenn der Filter leer wäre, alles. Der Knopf „Was ist neu" im Startbild zeigt
  weiter den ganzen Umlauf (`showNeuerungen(true)`), die Fußzeile sagt es.
* **Jeder Punkt ist gekürzt** auf das, was man sieht und wo: ein, zwei Sätze.
  Titel unverändert, die `wo`-Zeilen behalten die Wege, die
  `mitteilung-pruef` wirklich drückt (Taste C, Taste Z, der Angriffsfächer,
  der Knopf 🧍).

Nachher: 26 Punkte (zwei neue) mit **962 Wörtern** im ganzen Umlauf; beim
Start mit einem Stempel von heute **7 Punkte, 311 Wörter**, mit einem von
gestern 11 Punkte, 468 Wörter. `mitteilung-pruef` misst den Fall „Stempel von
gestern" und hält ihn unter 500 Wörtern.

---

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über
Playwright, ohne Grafikbibliothek. 04.10.2026.

| Prüfung | Ergebnis |
|---|---|
| `node tools/lv11-13-pruef.mjs` (neu) | **58 von 58** |
| `node tools/ladelauf-pruef.mjs` | 12 „in Ordnung", 0 Warnungen, Konsole still |
| `node tools/mitteilung-pruef.mjs` | 36 von 36 (vorher 33, drei Zeilen zur Kürzung dazu) |
| `node tools/szene-pruef.mjs` | 50 von 50 (Erreichbarkeit kennt jetzt Fragen mit `wenn`) |
| `node --check` über sieben Dateien | still |

Regression, alle `tools/*-pruef.mjs`:

| Werkzeug | |
|---|---|
| `anlage2-pruef` | 123 von 123 |
| `ebene-pruef` | 54 von 54 |
| `empfang-pruef` | 190 von 190 |
| `gespraech-pruef` | 89 von 89 (siehe Hinweis unter der Tabelle) |
| `innen-pruef` | 27 von 27 |
| `intro-pruef` | misst unverändert: 648 Wörter bis zum ersten freien Schritt, Nachlauf 82 |
| `langvorgang-pruef` | 58 von 58 |
| `menue-pruef` | 78 von 78 |
| `mitteilung-pruef` | 36 von 36 |
| `reich-pruef` | 59 von 59 |
| `schluss-pruef` | 36 von 36 |
| `serien-pruef` | 36 von 36 |
| `speicher-pruef` | 38 von 38 |
| `steuerung-pruef` | Alles in Ordnung |
| `stopfen-pruef` | 43 von 43 |
| `szene-pruef` | 50 von 50 |
| `versuchung-pruef` | 67 von 67 |
| `zulagen-pruef` | 50 von 50 |

**Hinweis zu `gespraech-pruef`:** im Sammellauf aller zwanzig Werkzeuge
hintereinander brach er einmal bei Zeile 36 ab („F oeffnet erneut", 120 ms
Wartezeit nach dem Tastendruck, die Tafel war noch nicht offen) und zählte
35 von 36. Drei Einzelläufe danach: 89 von 89, 89 von 89, 89 von 89. Das ist
kein Befund an LV11-13 (die Zeile berührt keinen Langvorgang und keine Szene),
sondern eine knappe Wartezeit im Werkzeug; sie steht hier, weil ein roter Lauf
nicht verschwiegen wird, und bleibt offen (siehe unten).

### Bewusst offen

* **`gespraech-pruef` wartet nach F nur 120 ms** (Zeile „F oeffnet erneut").
  Einmal in zwanzig Läufen hat das nicht gereicht. Nicht in diesem Abschnitt
  angefasst, weil das Werkzeug nichts von LV11-13 prüft; wer es anfasst,
  misst erst, wie lange die Tafel wirklich braucht.
* **Die Beats der Nummer 13 werden nie gesprochen.** Der Strang hat keinen
  Ansprechschritt; seine zwei Fortschrittszeilen stehen für den Guard und den
  Reiter. Vorblatt sagt dazu seine Zusatzzeilen, und das ist bei ihm die
  richtige Form: er kommentiert nicht, was man gefunden hat, er merkt es.
* **Vierzig statt einundvierzig** als Bedingung der fünften Antwort
  (Abschnitt 3). Entscheidung, keine Vorgabe.
* **Die Spielerzeile ist gekürzt** (Abschnitt 3). Wer den vollen Satz will,
  braucht einen breiteren Antwortdeckel, und der gilt für jede Tafel.
* **Der Eimer hat kein Zeitgatter je Schicht.** Wer die Veranlassung hat,
  kann Nieselbeck dreimal hintereinander ansprechen und ist durch. Beim
  Gutachter steht ein Schichtgatter, weil die Weltbibel „über mehrere
  Schichten" sagt; beim Eimer sagt sie das nicht, und der Weg in den
  Frostkamm ist der Aufwand.
