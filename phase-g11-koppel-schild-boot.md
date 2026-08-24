## G11: Die Koppel, das Schild und das Boot — ERLEDIGT (24.08.2026)

Der erste Griff in den Deko-Steinbruch, den `GRAFIK-BESTAND-2026-08-21.md` unter
Punkt 7 vorgeschlagen hat. Drei Setzer, keine neue Mechanik — bis auf eine, und
die war nicht vorgesehen.

Vorlage war die Zeile aus dem Bestand: *„Der Weidegürtel ums Dorf hat 18 Tiere
und keine Umzäunung."* Sie stimmt, und sie führt in die Irre, sobald man den Zaun
hinstellt.

---

## 1. Der Zaun war nicht das Problem, die Tiere waren es

Ambiente-Tiere kollidieren mit nichts. Ein Zaun um sie herum wäre eine
**Behauptung** gewesen — dieselbe Sorte, die M3 bei Schienen ohne Lore und einer
Leiter ohne zweite Ebene ausdrücklich abgelehnt hat. Das erste Schaf wäre binnen
einer Minute hindurchspaziert.

Deshalb kommt der Zaun nicht allein, sondern mit der Leine. Die sechs Tiere in
der Koppel tragen ein Feld `koppel` mit ihren Grenzen in Weltpixeln, und die
Critter-Schleife prallt an ihnen ab wie an einer Wand:

```
const drin = (x, y) => !k || (x >= k.x0 && x <= k.x1 && y >= k.y0 && y <= k.y1);
if(walkPx(nx, c.y) && drin(nx, c.y)) c.x = nx; else c.vx = -c.vx;
```

Zwei Zeilen, dieselbe Abpraller-Regel wie an einem Felsen. Wer keine Koppel hat,
merkt nichts davon.

**Die Zahl bleibt achtzehn.** Sechs stehen in der Koppel, zwölf im Gürtel. Die
Dichte war eine Entscheidung aus W-Groß (vierzig Tiere ergaben einen
Streichelzoo), und ein Zaun ist kein Grund, mehr Tiere aufzustellen.

## 2. Der Platz wird gesucht, nicht gesetzt

Die Karte entsteht prozedural. Eine feste Kachel läge je nach Lauf im Wasser oder
im Wald, also sucht `genMap()` das Rechteck selbst — ohne `rng()`, damit zwei
Läufe dieselbe Koppel bauen.

**Der erste Anlauf fand nichts.** Die Messung dazu, weil sie die eigentliche
Lehre dieses Abschnitts ist:

| Weidegürtel | 82x67 Kacheln, 5494 gesamt |
|---|---|
| frei (begehbar, kein Weg, kein Dorf, kein Lager) | 3504, also 64 Prozent |
| **größtes durchgehend freies Rechteck** | **28x2** |
| belegt durch Weg | 1253 |
| belegt durch Baum oder Fels | 700 |

Eine Koppel, die überall frei sein muss, gibt es auf dieser Karte nicht. Und es
war auch die falsche Forderung. Getrennt wird jetzt nach dem, was das Hindernis
anrichtet:

* **Der Rand muss frei sein.** Ein Zaunpfahl im Baum sieht aus wie ein Fehler,
  ein Zaun über einem Weg sperrt eine Straße, die niemand gesperrt hat.
* **Die Fläche darf tragen, was auf einer Weide steht.** Ein Baum in der Koppel
  ist ein Schattenspender, und die Tiere prallen an ihm ab wie an jedem anderen
  Hindernis — dafür sorgt `walkPx()` ohnehin schon. Nur Wasser ist
  ausgeschlossen: ein eingezäunter Teich ist kein Gehege. Mindestens die Hälfte
  der Innenfläche muss begehbar sein, sonst ist es ein eingezäuntes Wäldchen.

Damit findet die Suche sofort etwas.

**Der zweite Anlauf fand das Falsche.** Zeilenweise von oben links genommen
stand die Koppel sechzehn Reihen nördlich des Dorfes, zwischen Frostgeistern und
einer Kammertür: im Gürtel, gewiss, aber keine Weide, sondern Wildnis mit Zaun.
Gesucht wird jetzt das **dorfnächste** passende Rechteck, mit dem billigen
Abstandstest vor dem teuren Flächentest. Es liegt seither direkt nördlich des
Amts.

## 3. Das Schild und das Boot

Zwei Setzer ohne jede Mechanik.

* **Das Schild** steht neben der Amtstür. Ein Amt ohne Beschilderung ist eine
  verpasste Gelegenheit, und die Pseudoschrift auf dem Brett sagt genau so viel,
  wie ein Aushang dieses Hauses sagen würde.
* **Das Boot** liegt an der dem Dorf nächsten Strandkachel mit offenem Wasser
  daneben. Es ist reine Landmarke und ausdrücklich ohne Funktion: die
  ausgelagerten Bestände gelten laut Namensregister als „angeblich erreichbar,
  nie geprüft". Genau so sieht ein Boot aus, das niemand benutzt.

## 4. Warum sechs Zellen geschnitten wurden

Ein Deko-Eintrag zeichnet immer `animFrame(sheet, …)`, bei `n:1` also Frame 0
seiner Zeile. Die **Spalte** ist damit nicht adressierbar — der Zaun braucht aber
sechs Spalten aus zwei Zeilen. Dieselbe Lage wie bei `crate`, `pot` und `cobweb`
aus G1, also derselbe Weg: je Zelle eine Datei, dokumentiert in
`assets/cf/README.md`.

Welche Zelle was ist, steht nicht im Dateinamen, sondern in der
Alpha-Bounding-Box je Zelle, von Hand gemessen wie die G4-Böden. Der Pfosten
sitzt in allen sechs Zellen bei x5–10; sie fluchten deshalb über Ecken und
Kanten hinweg. `ay:16` legt die Zellunterkante auf die Kachelunterkante, bei
`WELT_SC` deckt eine Zelle damit genau eine Kachel.

Beim Boot hat das Manifest wie bei jedem Flächenblatt auf 16x16 getippt. Die
wahre Frame-Breite ist über die leeren Spalten gemessen (2–41, 50–90, 98–138,
146–186) und beträgt **48**. Der Anker liegt auf der Wasserlinie (y45), nicht an
der Blattunterkante.

## 5. `koppelAssert()`

Läuft direkt hinter `genMap()` und misst die gesetzte Welt, nicht eine Tabelle —
die Koppel wird ja gesucht, ihre Lage ist vorher nicht bekannt. Fünf Aussagen:

* Der Ring ist zu, bis auf das Tor: `2*(KW+KH) - 4 - 2` Kacheln.
* Jede Zaunkachel steht auf begehbarem Grund und auf dem Rand. Ein Zaun im
  Wasser wäre ein Fund wie die fünf unsichtbaren Dorffiguren aus G6.
* Das Tor ist genau zwei Kacheln breit.
* Jedes Koppeltier steht in seiner Koppel, und die Leine reicht nicht über den
  Zaun hinaus.
* Schild und Boot gibt es je einmal, und das Boot liegt am Strandsaum.

Findet die Suche kein Rechteck, meldet er das als Befund und nicht als Fehler:
dann steht kein Zaun und keine Kuh darin, und das ist eine Eigenschaft der
Karte.

---

## Prüfprotokoll

Server auf Port 8378, `index.html` im Wurzelverzeichnis, Playwright-Chromium der
Umgebung, `node --check` nach jedem Bauschritt.

| Lauf | Ergebnis |
|---|---|
| `index.html` im Browser | **17** Guard-Zeilen, keine Warnung, keine Fehlermeldung, `frameNo` 154 |
| Startzeile G11 | `10x7 Kacheln bei (150,134), 28 Zaunkacheln mit Tor, 6 Tiere an der Leine, 1 Schild, 1 Boot.` |
| `node tools/build-single.mjs` | sauber, 148 eingebettete Dateien, `dist/index.html` 2511 KB |
| `dist/index.html` per `file://` | 17 Guard-Zeilen, keine Warnung, `frameNo` 154 |
| `tools/figurenfarben-messlauf.mjs` | keine Abweichung |
| `tools/spaziergang-messlauf.mjs` | läuft durch, 25 Kills, Stufe 5, überlebt — unverändert zum Stand davor |

**Im Bild angesehen**, an allen drei Orten, mit laufendem Spiel und echter
Kamera: die Koppel nördlich des Amts mit Huhn, Schaf, Schwein und Kuh darin und
dem Tor zur Dorfseite; das Schild neben der Amtstür; das Boot am Strandsaum der
Tilgung. Das erste Bild der Koppel ist der Grund, warum die Suche umgeschrieben
wurde — man sah einen Zaun im Wald neben einem Frostgeist.

**Die Leine über Zeit gemessen**, weil eine Zusage zum Startzeitpunkt hier
nichts wert wäre: 221 Sekunden Spielzeit, 13172 Bilder. Ausgebrochen 0,
hineingelaufen 0.

## Jede neue Prüfung einmal ausgelöst

Vier Eingriffe, alle gesetzt, gemeldet und zurückgenommen:

| Eingriff | gemeldet |
|---|---|
| eine Zaunkachel entfernt | `Ring ist 27 Kacheln lang, zugesagt sind 28` |
| ein Tier nach draußen gesetzt | `Tier steht außerhalb seiner Koppel 144 135` |
| ein zweites Schild aufgestellt | `2 Schilder statt eins` |
| das Boot ins Grasland gelegt | `das Boot liegt nicht am Strandsaum 147 136` |

---

## Bewusst offen

* **Der Rest des Steinbruchs.** Punkt 7 des Bestands nennt außerdem Brücken,
  Wasserpflanzen, Kapybaras und rund dreißig Ambiente-Tiere (Krähen, Frösche,
  Gänse, Enten, Schmetterlinge, Bienen, Mäuse, Schwäne). Die Tiere sind kein
  Setzer, sondern je ein Rig: Zeilen und Anker müssen wie in G3 gegen das PNG
  gemessen werden, und `CRITTERS` trägt heute fünf Arten mit je zwei Zeilen. Das
  ist eine eigene Runde mit eigenem Messprotokoll.
* **Das Tor ist eine Lücke, kein Tor.** Ein eigenes Torblatt hat das Pack nur
  für den großen Zaun (`Fence_Big_Gate`), und der ist eine andere Bauart — ein
  Tor aus dem einen Satz im Zaun des anderen wäre sichtbar geflickt.
* **Die Koppel hat keine Mechanik.** Man kann nicht hinein, nichts füttern,
  nichts einsammeln. Sie ist Ausstattung, und der Bestand hat sie ausdrücklich
  als solche vorgeschlagen. Wer daraus einen Vorgang machen will, baut einen
  Langvorgang und keine Deko.
* **Das Boot liegt halb auf Sand.** Es steht auf einer Strandkachel mit Wasser
  daneben, nicht auf dem Wasser. Ein Boot ganz im Wasser bräuchte eine
  Ankerregel für die Wasserlinie, die kein anderes Prop hier hat.
* **`Cute_Fantasy_Desert`** ist mit diesem Lauf zum ersten Mal im Manifest (92
  Blätter), aber unangetastet. Ob die Aschewüste ein echtes Wüstenset bekommt,
  ist eine Frage an die Weltbibel und nicht an die Dateien.
