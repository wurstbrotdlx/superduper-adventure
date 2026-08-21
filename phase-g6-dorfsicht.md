## G6: Die Dorfsicht — ERLEDIGT

Sechs der elf Dorffiguren waren nicht zu sehen. Nicht schlecht platziert, nicht schwer zu
finden: nicht zu sehen. Fünf hatten überhaupt kein Sprite, eine stand hinter dem Amt.
Ansprechbar waren alle sechs die ganze Zeit über.

Diese Phase behebt beide Ursachen und stellt einen Guard daneben, der sie beim nächsten Mal
meldet, statt sie durchgehen zu lassen. An den Figurentexten aus `figuren-dorf.md` ändert
sie nichts, an der Anrede aus `phase-anrede.md` nichts, an der Kampfseite nichts.

### Befund 1: fünf Blätter liegen nicht im Grafikpaket

`CF_NPCS` trägt seit W3 acht Einträge. Im Assets-Repo liegen drei Dateien.

| Schlüssel | Datei | im Paket | Figur |
|---|---|---|---|
| bob | `NPCs/Farmer_Bob.png` | ja | Zwirn |
| katy | `NPCs/Bartender_Katy.png` | ja | Pommer |
| mike | `NPCs/Miner_Mike.png` | ja | Nörgel |
| jack | `NPCs/Lumberjack_Jack.png` | **nein** | Zapf |
| chloe | `NPCs/Chef_Chloe.png` | **nein** | Lisbeth |
| fin | `NPCs/Fisherman_Fin.png` | **nein** | Trepp |
| buba | `NPCs/Farmer_Buba.png` | **nein** | Milb |
| bruno | `NPCs/Bartender_Bruno.png` | **nein** | Fass |

`loadAssets()` meldete das brav mit fünf `Sprite fehlt`-Zeilen, `SHEETS` blieb für diese
Keys leer, und `drawSprite()` kehrt bei einem fehlenden Key still um. Zapf, Lisbeth, Trepp,
Milb und Fass standen also mit Namensschild, Sprechblase und Kontextaktion im Dorf, nur ohne
Körper. Die Warnung stand seit W3 in jeder Konsole und war zur Tapete geworden. Genau das
meint die Abnahmeregel „eine stille Konsole": eine Warnung, die immer da ist, ist keine.

Die Blätter liegen auch in der Rohbibliothek und dürften kopiert werden, `assets/cf/README.md`
listet sie in der G5-Tabelle aber gar nicht auf. Drei wurden kopiert, für fünf wurde nur der
Code geschrieben. Nachträglich lässt sich nicht mehr feststellen, ob das ein vergessener
Kopierschritt war oder eine Absicht, die niemand aufgeschrieben hat.

**Eingriff.** Kein Blatt wird umgehängt (dann liefen zwei Figuren mit demselben Gesicht durchs
Dorf). Jede Dorffigur trägt jetzt in `gestalt:{}` ein eigenes Aussehen aus dem Helden-Rig,
also Frisur, Hemd, Hose und Schuhe. Für Bramsche, Lott und Pahl ist das seit W3 ihr Aussehen
und nur eine Ebene tiefer gerutscht; für die acht wandernden Figuren ist es der Ersatz, wenn
ihr eigenes Blatt fehlt. `bakeNpcSheet()` backt dafür nicht mehr nur die Idle-Reihe, sondern
auch die Laufreihe des Rigs, sonst schlitterte eine Ersatzfigur im Standbild über den Platz.

**Die acht Gestalten sind gegeneinander gesetzt.** Beim ersten Durchgang waren sie einzeln
vergeben und zwei Paare fielen zusammen: Trepp und Fass trugen dieselbe Frisur *und* dasselbe
Oberteil (nur die Hose unterschied sie), Zapf und Lisbeth beide Grün. Auf einem Dorfplatz, auf
dem fünf von elf Figuren Komposite sind, ist das ein Rückschritt gegenüber acht eigenen Rigs.
Frisur und Oberteil bilden deshalb jetzt über **alle elf** Figuren ein eindeutiges Paar, die
drei mit echtem Blatt eingerechnet, damit ihr Ersatz nicht auf einen Nachbarn fällt, falls
auch ihre Datei einmal verschwindet:

| Figur | Frisur | Oberteil | Hose | Schuhe |
|---|---|---|---|---|
| Zwirn | h1 kurz braun | Stufe 2 blau | 2 | 2 |
| Bramsche | h3 kurz schwarz | Stufe 2 blau | 2 | – |
| Zapf | h1 kurz braun | Stufe 1 grün | 1 | 0 |
| Lisbeth | h6 Knoten | Stufe 1 grün | 0 rot | 3 |
| Trepp | h2 blonde Tolle | Stufe 2 blau | 0 rot | 1 |
| Nörgel | h1 kurz braun | Stufe 0 rot | 0 | 3 |
| Milb | h5 lang grau | Stufe 2 blau | 2 | 1 |
| Pommer | h2 blonde Tolle | Stufe 1 grün | 0 | 4 |
| Fass | h3 kurz schwarz | Stufe 0 rot | 2 | 2 |
| Lott | h1 kurz braun | bloß | – | – |
| Pahl | h4 ingwer | bloß | – | – |

Die Rüstungsstufen 3 und 4 (Eisen- und Goldplatte) bleiben ungenutzt: ein Hausmeister in
Goldharnisch ist kein Dorf, sondern ein Witz auf Kosten der Figur. Damit stehen vier
Oberteile zur Verfügung (bloß, rot, grün, blau) und sechs Frisuren, also 24 Paare für elf
Figuren. Genug Luft, aber nicht so viel, dass man sie ungeprüft vergeben dürfte.

Die Entscheidung fällt in `npcBlaetter()`, einer reinen Funktion, die drei Stellen lesen: der
Kartenbau, `npcAnkerAssert()` und `dorfSichtAssert()`. Sie fragt `SHEETS` und nicht eine
Liste im Code. **Wer die fünf Dateien lizenziert und nach `assets/cf/deco/NPCs/` legt, bekommt
die Originalsprites beim nächsten Laden automatisch zurück**, ohne dass eine Zeile zurückgebaut
werden muss.

Zwei Folgeänderungen, damit die Lücke ein vorgesehener Zustand wird statt eines stillen Fehlers:

- Die acht `CF_NPCS`-Blätter sind mit `optional:true` registriert. `loadAssets()` warnt für
  sie nicht mehr einzeln; `bakeAllNpcSheets()` meldet stattdessen eine gesammelte Zeile, die
  sagt, welche Figuren als Komposit laufen. Verschwindet von selbst, sobald die Dateien da sind.
- Im Einzeldatei-Build ist `ASSET_BLOBS` die vollständige Liste dessen, was eingebacken wurde.
  Was dort fehlt, gibt es nicht, und der Ladeversuch wäre ein sicherer 404 in der Konsole des
  Spielers. `loadAssets()` fragt jetzt die Tabelle, statt es auszuprobieren. Im Quellbaum
  (`ASSET_BLOBS` null) bleibt der Ladeweg unverändert, dort sind die fünf 404 der ehrliche
  Hinweis darauf, dass drei Dateien fehlen.

### Befund 2: der Bürgermeister stand hinter dem Amt

Gebäude sind `big`-Decos mit Fußanker an der Südkante ihres Footprints. Gezeichnet wird nach
y sortiert. Eine Figur, die **nördlich** dieser Ankerlinie steht, wird also vor dem Haus
gezeichnet und vom Haus zugedeckt, obwohl sie auf einer freien, begehbaren Kachel steht. Der
Footprint blockiert die Kachel, die Fassade darüber blockiert nichts, und niemand rechnete
nach, was sie verdeckt.

Gemessen an der undurchsichtigen Fläche der Blätter (Alpha-Bounding-Box, nicht am
Frame-Rechteck: die Blätter haben bis zu 13 Pixel leeren Rand, und mit dem vollen Rechteck
gerechnet meldet man Verdeckungen, die es auf dem Schirm nicht gibt):

| Figur | Anker alt | am Anker verdeckt | auf der Wanderleine bis | Anker neu | jetzt |
|---|---|---|---|---|---|
| Zwirn | 14/34 | **100 %** (Amt) | 100 % | 16/38 | 0 % |
| Lisbeth | 10/42 | **46 %** (Haus 2) | 100 % | 8/40 | 0 % |
| Zapf | 16/46 | 0 % | **100 %** (Haus 3) | 16/47 | 0 % |
| Pommer | 13/45 | 0 % | **69 %** (Haus 3) | 13/47 | 0 % |
| Trepp | 22/41 | 0 % | **68 %** (Scheune) | 22/40 | 0 % |

Zwirn war der eigentliche Fall: er stand mit 14/34 zwei Kacheln **über** dem Amt, also im
Rücken einer 240x192 grossen Fassade, und wanderte in einem Radius von 40 Pixeln, kam also
nie darunter hervor. Vier Kacheln nach Süden stellen ihn vor sein Rathaus, wo ein
Bürgermeister ohnehin hingehört.

**Warum 16/38 und nicht 14/38.** 14/38 wäre die Mitte vor der Tür. `AMT_TUER` liegt bei
14/36,9, und `aktBiete()` nimmt das nächstgelegene Angebot innerhalb von 58 Pixeln: Zwirn
läge 50 Pixel vor der Tür und würde „Amtsstube" dauerhaft mit „Ansprechen" überstimmen. Zwei
Kacheln nach Osten lassen den Eingang frei.

**Warum die Anker verschoben und nicht automatisch nachgezogen werden.** Ein stiller Nachzug
wäre möglich (`genMap()` macht das bereits für Anker auf nicht begehbaren Kacheln), verschiebt
aber eine Platzierung, die jemand absichtlich gesetzt hat, und tut es unsichtbar. Die fünf
Zahlen stehen deshalb in der Tabelle, wo alle anderen auch stehen, und der Guard meldet,
wenn sie nicht mehr stimmen.

### Der Guard

`dorfSichtAssert()` läuft einmal nach `loadAssets()`, hinter `npcBlaetterNachziehen()`, weil
er die wirklich zugewiesenen Blätter misst. Er prüft je Figur zweierlei:

1. **Hat sie ein lesbares Blatt.** Egal auf welchem Weg sie dazu gekommen ist.
2. **Steht sie im Bild.** Die undurchsichtige Fläche der Figur gegen die undurchsichtige
   Fläche jedes Gebäudes, dessen Fußanker tiefer liegt als ihrer. Am Heimatanker sind bis zu
   15 Prozent geduldet, auf der Wanderleine bis zu 40. Die Leine wird in sechzehn Richtungen
   abgetastet, nicht nur am Anker: vier der fünf Funde oben waren erst unterwegs zu sehen.

Er wirft nie, er meldet. Die Zahlen für die Gebäude kommen aus `CF_BLD`, wo seit dieser Phase
Maße, Anker und Deckfläche zusammen an einer Stelle stehen und von `addSheet()`,
`VILLAGE_BUILDINGS` und dem Guard gemeinsam gelesen werden. Vorher standen die Maße nur in
sechs `addSheet()`-Aufrufen; eine zweite Tabelle daneben wäre die F1-Falle gewesen.

Ein weiterer Guard hat bei der Umstellung angeschlagen und wurde mitgezogen: die
Strukturzusicherung in `knAssertCaps()` prüfte `fig.hair` beziehungsweise `fig.sheet` und
kannte `gestalt:{}` nicht. Sie prüft jetzt beides, und zwar für jede Figur: ein fehlendes
Blatt **und** eine fehlende Ersatzgestalt sind ab jetzt beide ein gemeldeter Fehler. Genau
diese Prüfung hätte den Befund 1 fünf Bauabschnitte früher gefunden.

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. Server `python3 serve.py`, Chromium über Playwright,
Grafik aus dem Assets-Repo nach `assets/cf/` kopiert.

| Prüfung | vorher | nachher |
|---|---|---|
| Figuren mit Blatt in `SHEETS` | 6 von 11 | **11 von 11** |
| Am Anker sichtbar (unter 15 % verdeckt) | 9 von 11 | **11 von 11** |
| Auf der Wanderleine sichtbar (unter 40 %) | 4 von 8 wandernden | **8 von 8** |
| Eindeutige Paare aus Frisur und Oberteil | 9 von 11 | **11 von 11** |
| `Sprite fehlt`-Warnungen beim Start | 5 | 0 (eine gesammelte Meldezeile) |
| `npcAnkerAssert`-Meldungen | 5 | 0 |
| Fehler in der Konsole | keine | keine |

Zusätzlich abgelaufen, weil diese Phase den Kartenbau und den Ladeweg anfasst:
`tools/nahfeld-messlauf.mjs` und `tools/spaziergang-messlauf.mjs`, beide ohne Auffälligkeit.

### Bewusst offen

- **Die fünf Blätter bleiben Ersatz.** Solange die PNGs nicht im Assets-Repo liegen, laufen
  fünf Figuren als Held-Komposit. Das ist keine Notlösung, die man wegwerfen muss: Bramsche,
  Lott und Pahl sehen seit W3 so aus. Es ist aber weniger Abwechslung als acht eigene Rigs,
  und der Weg zurück steht offen und kostet keinen Code.
- **Im Quellbaum bleiben fünf 404 in der Netzwerkkonsole.** Die kommen vom Browser, nicht vom
  Spiel, und sie sind der ehrliche Hinweis. Im ausgelieferten Einzeldatei-Build entstehen sie
  nicht mehr.
- **Nicht angefasst: Bramsches Frisur.** `h3` ist der Undercut, und eine Registratorin Ottilie
  mit ausrasierten Seiten ist eine Designentscheidung aus W3, kein Fehler. Wer sie anders
  haben will, ändert einen Buchstaben in `DORF_FIGUREN`.
