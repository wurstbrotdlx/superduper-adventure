## G6-Nachtrag: Die fünf Dorf-Blätter — ERLEDIGT

Der eine Punkt, den G6 offen gelassen hat, weil er nicht am Code hing, sondern an fünf
Dateien: `Lumberjack_Jack`, `Chef_Chloe`, `Fisherman_Fin`, `Farmer_Buba` und
`Bartender_Bruno` aus `Cute_Fantasy/NPCs (Premade)/` liegen jetzt im Assets-Repo. Zapf,
Lisbeth, Trepp, Milb und Fass laufen damit mit ihrem eigenen Rig statt mit dem
Held-Komposit, das G6 als Ersatz eingezogen hat.

Vorlage war Punkt 1 aus `GRAFIK-BESTAND-2026-08-21.md`. Dessen Schätzung — „keine Codezeile",
„Aufwand: Minuten" — hat gehalten: an `index.html` ist keine Zeile geändert. `npcBlaetter()`
fragt zur Laufzeit `SHEETS`, und genau dafür war die Funktion in G6 so gebaut worden.

Was diese Runde zusätzlich erledigt, ist die Nachprüfung, die derselbe Punkt verlangt hat:
das Manifest und der Code widersprachen sich beim Raster von `Fisherman_Fin`. Sie ist
entschieden, und zwar am Pixel.

### Der Widerspruch bei Fisherman_Fin

`manifest.json` führte das Blatt mit `fw:32` und 18 Spalten, `CF_NPCS` in `index.html` steht
auf `fw:64`, also 9 Spalten bei 576px Breite. Eine der beiden Zahlen musste falsch sein.

Gemessen mit `tools/sheet-audit.mjs --rig`, einmal unter jeder Annahme. Die Zeilen-Bounding-Box
entscheidet die Frage allein:

| Annahme | Bounding-Box der Idle-Zeile | Lesart |
|---|---|---|
| `fw:32` (Manifest) | `x 0..32`, volle Zellbreite, in **jeder** der 13 Zeilen | Raster schneidet die Figur mittendurch |
| `fw:64` (`CF_NPCS`) | `x 25..38`, 13px breit, mittig | Figur sitzt sauber in der Zelle |

Zum Vergleich dieselbe Messung an den sieben Geschwisterblättern: Bruno `25..38`, Chloe
`25..38`, Jack `25..38`, Buba `23..40`, und die drei seit G5 verbauten liegen genauso. Eine
Figur, die als einzige die volle Zellbreite ausfüllt, ist keine breitere Figur, sondern ein
falsches Raster. **`CF_NPCS` hat recht, das Manifest hatte unrecht.**

Das ist kein Zufallsfund, sondern die G3-Lektion ein zweites Mal: die Heuristik in
`sheet-audit.mjs` tippt bei Animationsblättern daneben, weil 32 und 64 bei einem 576px-Blatt
beide aufgehen und der Score sich kaum unterscheidet (3,663 gegen 3,529 — Confidence 0,03).
Deshalb steht in der Werkzeugkette der Override.

**Eingriff.** `_rigTable` in `tools/sheet-audit.overrides.json` trug drei der acht
`CF_NPCS`-Einträge; sie trägt jetzt alle acht. Damit spiegelt sie wieder, was der Code sagt —
was ihr eigener Kommentar seit F43 von ihr behauptet („der Code bleibt die Quelle,
Regressionsregel 7"). Nach dem Neulauf steht Fin im Manifest auf `fw:64`, 9 Spalten,
`gridSource: override`, Confidence 1, und die fünf Blätter haben ihre `anims`-Zuordnung.

Bei der Gelegenheit korrigiert: die drei Alteinträge standen auf `ay:60`. Die Fußlinie dieser
Blätter ist 40 (`CF_ANCHOR.ay`), und dass 60 falsch ist, war der zweite Befund aus G6 — mit
`ay:60` hing die Figur zwanzig Pixel über ihrem eigenen Schatten. `applyOverride()` liest
`ax`/`ay` nicht, der Wert ist an dieser Stelle also reine Dokumentation und ändert an der
Ausgabe nichts. Eine Tabelle, die den Code zu spiegeln behauptet und einen Wert führt, den
derselbe Code als Fehler abgelegt hat, ist trotzdem eine Falle für den Nächsten.

### Wo die Dateien liegen

Nicht in diesem Repo. `assets/cf/deco/` steht in der `.gitignore`, weil Kenmis Premium-Lizenz
die Weiterverteilung der Dateien untersagt, auch modifiziert — der gekaufte Anwendungsfall ist
das ausgelieferte Spiel, nicht eine klonbare Dateisammlung im öffentlichen Repo. Die kuratierte
Grafik liegt im privaten `wurstbrotdlx/superduper-adventure-assets`, das
`.github/workflows/pages.yml` per Deploy Key klont.

Die fünf PNGs gehen deshalb dorthin, nicht hierher. Dieser Bauabschnitt ändert im Spiel-Repo
nur Text und die Werkzeugtabelle. Der Bestand des Assets-Repos wächst von 99 auf 104 Dateien —
dieselbe 104, die das Spiel beim Start anfragt.

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über Playwright, die
Rohbibliothek nach `assets/cf/` kopiert. Vorher-Messung durch Beiseitelegen der fünf Dateien
in derselben Sitzung, damit beide Zeilen dieselbe Welt meinen.

| Prüfung | vorher | nachher |
|---|---|---|
| Angefragte Grafikdateien / davon fehlend | 104 / 5 | 104 / **0** |
| Figuren mit eigenem Blatt (`komposit=nein`) | 6 von 11 | **8 von 11** + 3 feste Komposite |
| `G6 Dorfsicht: … liegen nicht im Grafikpaket` | steht da | **weg** |
| `G6 Dorfsicht: 11 Dorffiguren haben ein Blatt` | steht da | steht da |
| Warnungen und Fehler in der Konsole | 5 `Sprite fehlt` | **0** |
| `dist/index.html` eingebettet | 99 Dateien | **104 Dateien**, 1817 KB |
| Konsole des Einzeldatei-Builds über `file://` | — | **0 Warnungen, 0 Fehler** |

Die drei verbleibenden Komposite sind Bramsche, Lott und Pahl. Sie sind `opt:'fest'` und seit
W3 so gemeint, kein Ersatz für etwas Fehlendes.

Raster und Anker der acht Blätter im laufenden Spiel gegengelesen, aus `SHEETS`, nicht aus
einer Tabelle:

| Blatt | Bild | Raster | Spalten | Frames | Anker |
|---|---|---|---|---|---|
| bob, buba | 384x832 | 64x64 | 6 | 6 | 32,40 |
| katy, bruno, chloe | 384x448 | 64x64 | 6 | 6 | 32,40 |
| mike, jack | 384x640 | 64x64 | 6 | 6 | 32,40 |
| **fin** | 576x832 | 64x64 | **9** | 6 | 32,40 |

Fin liest also 6 Frames aus einer 9 Spalten breiten Zeile — die Spaltenzahl kommt aus der
Bildbreite, die Frameszahl aus `addSheet`. Beides trifft zu, und genau das hatte der
Kommentar über `CF_NPCS` seit G6 vorhergesagt.

Zusätzlich abgelaufen, weil der Ladeweg berührt ist: `node tools/build-single.mjs` (sauber,
104 Dateien) und `node tools/sheet-audit.mjs` (886 Sheets, 0 Fehler).

### Bewusst offen

- **Das Manifest kennt `Cute_Fantasy_Desert` nicht.** Mit der Rohbibliothek kam ein zehntes
  Pack, das weder in `manifest.json` (886 Einträge) noch in der Tabelle von
  `GRAFIK-BESTAND-2026-08-21.md` (neun Packs) vorkommt: 92 PNGs, darunter Kamele, Geier,
  Skarabäen, ein Pharao, Wüstenkrieger mit Bogen, eine Mumie, Wüstenhäuser und ein eigenes
  Tileset. Der Neulauf des Audits ist hier **absichtlich ohne dieses Pack** gefahren, damit
  der Diff die eine Rasterkorrektur zeigt und nicht 92 neue Zeilen. Das Pack zu sichten ist
  eine eigene Runde mit eigenem Ertrag-Aufwand-Urteil, kein Nebenprodukt dieses Nachtrags.
  Die Aschewüste des Spiels bezieht ihren Boden heute aus `Cute_Fantasy_Volcano`; ob ein
  echtes Wüstenset das verbessert, ist eine Frage an die Weltbibel, nicht an die Dateien.
- **`GRAFIK-BESTAND-2026-08-21.md` bleibt, wie es ist.** Es ist ein datierter Bericht, und
  die Regel für datierte Berichte in diesem Repo lautet: Stand, kein Wegweiser, nicht
  rückwirkend umgeschrieben. Was daran überholt ist — Punkt 1 erledigt, die Fin-Frage
  entschieden, ein zehntes Pack dazugekommen — steht hier.
- **Die Kandidaten 2 bis 8 sind unangetastet.** Deko-Steinbruch, Stollen-Biom, Helme, Bogen,
  Reiten: alles unverändert offen, in der Reihenfolge, die der Bestand vorschlägt.
