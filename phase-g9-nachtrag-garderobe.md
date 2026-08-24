## G9-Nachtrag: Die vier Dateien der Garderobe — ERLEDIGT (24.08.2026)

G9 hat aus der Rüstungsstufe eine Garderobe gemacht und dabei vier Dateien in
Dienst genommen, die nie ins Grafikpaket kopiert wurden. Seither standen vier
`Sprite fehlt`-Gruppen in jeder Konsole, und dahinter steckte kein Rauschen:
**Wirt Fass und Herr Lott standen oben ohne im Dorf.**

Dieser Nachtrag fasst keine Garderobe an. Er baut den Ersatzweg, den G9
vorausgesetzt und nicht gebaut hat, zieht das Prüfwerkzeug nach und schreibt die
vier Dateien dorthin, wo sie jemand sucht.

---

## Der Befund

Die Konsole meldete beim Start vier Gruppen zu je fünf Zeilen (eine je
Anim-Reihe aus `CF_HERO_ANIMS`):

```
Sprite fehlt: assets/cf/player/Chest/Lumberjack_Shirt/Lumberjack_Shirt_1_Green.png
Sprite fehlt: assets/cf/player/Accessories/Farmer_Hat_1.png
Sprite fehlt: assets/cf/player/Head/Plate_Helmet_1/Plate_Helmet_1_Iron.png
Sprite fehlt: assets/cf/player/Head/Plate_Helmet_2/Heavy_Plate_Helmet_1_Iron.png
```

`phase-f1-nachtrag-pruefwerkzeuge.md` führt sie als „die vier bekannten
`Sprite fehlt`-Gruppen", der vermerkte Bestand. Genau davor warnt die README
zwei Absätze weiter oben: *Eine Warnung, die immer da steht, ist keine.* Es war
derselbe Fund wie in G6, nur eine Ebene tiefer.

**Was daraus im Bild wurde**, gemessen und nicht geschätzt: `blitFarbFrame()`
kehrt bei einem fehlenden Key still um. Fällt die Hemdebene aus, bleibt der
Körper aus `hautBlatt()` übrig, und der ist nackt. Betroffen waren:

| Figur | bestellt | stand da |
|---|---|---|
| Wirt Fass | `hemd:'karo'` | ohne Hemd |
| Herr Lott | `hemd:'karo'` | ohne Hemd |
| Zusteller Trepp | `hut:'muetze'` | ohne Mütze, mit der gemessenen Mützenfarbe im Haar |
| Herr Nieselbeck | `hut:'muetze'` | dito, sein Haar ist deshalb grün |

Die beiden Helme trägt niemand; sie stehen in der Garderobe, „damit sie niemand
noch einmal sucht" (G9). Ihre zehn Zeilen waren reines Rauschen.

**Und es war messbar.** `tools/figurenfarben-messlauf.mjs` prüft seit G9 „jede
bestellte Garderoben-Ebene hat ein Blatt" und meldete genau diese vier Einträge.
Das Werkzeug hat also seit G9 recht gehabt und ist nicht gehört worden.

---

## Warum G9 das nicht gemerkt hat

`figurenFarbenAssert()` misst die **Tabelle**: steht die Form in
`CF_GARDEROBE`, ist die Farbe ein Hexwert, trägt niemand mehr `chest`. Alle
Antworten waren richtig, und die Abnahmezeile „15 Figuren eingekleidet, 2 mit
Kopfbedeckung" war wahr. Sie sagt nur nichts darüber, ob es zu einer Form auch
ein **Blatt** gibt.

Das ist die Lehre dieses Nachtrags und der Grund für den neuen Guard: *Eine
Zusage über eine Tabelle ist keine Zusage über das Bild.*

---

## Die drei Eingriffe

### 1. `CF_GARDEROBE_ERSATZ` — was gezeichnet wird, wenn die Datei fehlt

```
hemd: {karo: 'hemd'}
```

Mehr steht nicht drin, und das ist eine Entscheidung und kein Anfang.

* **Fürs Karohemd ist `hemd` der richtige Ersatz** (schlicht, offener Kragen):
  dieselbe Silhouette, dieselbe Ebene, und die Farbe kommt ohnehin aus
  `farbBlatt()` und nicht aus der Datei. Fass behält sein Weinrot, Lott sein
  Braun. Der Unterschied zum Original ist das Karomuster, und das überlebt
  `farbBlatt()` ohnehin nur als Helligkeitsverteilung.
* **Für die Mütze gibt es keinen.** Das Pack hat genau eine Kopfbedeckung, und
  die beiden anderen Formen sind Helme. Ein Helm auf dem Zusteller wäre keine
  Ersatzmütze, sondern eine andere Figur. Wem die Mütze fehlt, der steht mit
  Haar da — also so wie vor G9, und keinen Schritt schlechter.
* **Die Helme bekommen keinen**, weil sie niemand trägt.

`garderobeBlatt(slot, form, anim)` löst auf: eigenes Blatt, sonst das des
Ersatzes, sonst keins. Rein und ohne Nebenwirkung, damit ein zweiter Backlauf
den Bericht nicht vervielfacht. `bakeNpcSheet()` geht für alle vier Slots durch
diesen Trichter, einmal je Blatt statt einmal je Frame.

### 2. Die Garderobe wird `optional`

Der Ladeweg kennt seit G6 `opt.optional` für Blätter, die fehlen dürfen, weil
der Aufrufer einen Ersatzweg hat. Genau das ist jetzt der Fall, also tragen alle
dreizehn Garderobenformen die Marke. Zwanzig Warnungen werden dadurch **eine
Zeile**, und die sagt, was Sache ist — derselbe Weg, den `bakeAllNpcSheets()`
für die fünf fehlenden NPC-Blätter schon geht.

Die Marke schluckt nichts: was fehlt, meldet der Guard, und zwar mit Namen.

### 3. `garderobeAssert()` — der Guard, der den Fund gefunden hätte

Läuft nicht auf Skriptebene, sondern hinter `loadAssets()` wie `dorfSichtAssert()`
und `portraetAssert()`, weil er Blätter misst und keine Tabellen. Drei Aussagen:

* Welche Form hat kein Blatt, und ist sie durch einen Ersatz gedeckt?
* Trägt jemand ein Kleidungsstück (`hemd`, `hose`, `schuh`), für das es weder
  Blatt noch Ersatz gibt? **Das ist ein Fehler**, denn dort bleibt Haut übrig.
* Wer steht ohne Kopfbedeckung da, obwohl er eine bestellt hat? Das ist keiner,
  sondern der Stand vor G9 — gemeldet wird er trotzdem, mit Namen.

Ohne Grafikpaket kehrt er still um (`SHEETS['cfbody_idle']` fehlt dann), sonst
wäre seine Meldung eine Dateiliste statt eines Befundes.

Die Startzeile lautet heute:

```
G9 Garderobe: 13 Formen, 1 durch Ersatz gedeckt (hemd:karo→hemd),
3 ohne Blatt und ohne Ersatz (hut:muetze, hut:helm, hut:helmSchwer),
deshalb ohne Kopfbedeckung im Dorf: trepp, nieselbeck.
```

Sie ist absichtlich unbequem: sie verschwindet erst, wenn die vier Dateien im
Paket liegen.

---

## Das Werkzeug nachgezogen

`tools/figurenfarben-messlauf.mjs` meldete zwei Abweichungen, keine davon war
ein gebrochenes Versprechen des Codes.

* **„jede bestellte Garderoben-Ebene hat ein Blatt"** kannte zwei Antworten und
  braucht drei. Getrennt wird jetzt danach, was das Fehlen anrichtet: kein Blatt
  und kein Ersatz bei einem Kleidungsstück ist ein Fehler, ein gedeckter Ersatz
  ist eine Notiz, eine fehlende Kopfbedeckung ebenfalls. Die Notizen stehen
  ohne `pruef()` da — sie sind Lücken im Grafikpaket und keine Zusagen des
  Codes, und sie sollen sichtbar bleiben, statt still zu werden.
* **„komposit:true schlägt ein vorhandenes Paketblatt"** meldete Nörgel, seit
  G10 ihm ein Monsterrig gegeben hat. `npcBlaetter()` sagt im ersten Zweig, dass
  ein Rig alles schlägt; der Sollwert stammte aus G9 und kannte nur die beiden
  älteren Wege. Dieselbe Sorte Nachzug wie im F1-Nachtrag: gemessen wurde die
  Welt von vorgestern.

---

## Prüfprotokoll

Server auf Port 8378, `index.html` im Wurzelverzeichnis, Playwright-Chromium der
Umgebung. Nach jedem Bauschritt `node --check` über den Skriptblock.

| Lauf | Ergebnis |
|---|---|
| `index.html` im Browser | 16 Guard-Zeilen, **keine** `Sprite fehlt`-Warnung mehr, keine Fehlermeldung, `frameNo` 153 |
| `node tools/build-single.mjs` | sauber, 104 Dateien, `dist/index.html` 2345 KB |
| `dist/index.html` per `file://` | 16 Guard-Zeilen, keine Warnung, keine 404, `frameNo` 156 |
| `tools/figurenfarben-messlauf.mjs` | **keine Abweichung** (vorher zwei), beide Notizzeilen stehen |

**Die Gegenprobe im Bild.** Dieselbe Zelle vor und nach dem Eingriff, viermal
vergrößert aus `npc_baked_lott` und `npc_baked_fass` gezogen: vorher nackter
Oberkörper, nachher Hemd. Zusätzlich pixelgenau nachgerechnet, weil Lotts
Hemdfarbe (`#855944`) dicht am Hautton liegt und der Augenschein dort trügt —
`bakeNpcSheet()` einmal mit und einmal ohne Hemdebene gebacken und die Blätter
verglichen: **60 Pixel Unterschied je Figur**, beide auf `cfhemd_hemd_idle`
aufgelöst. Die Ebene ist da.

## Jede neue Prüfung einmal ausgelöst

Zwei Eingriffe, beide gesetzt, gemeldet und zurückgenommen:

| Eingriff | Erwartung | gemeldet |
|---|---|---|
| `CF_GARDEROBE_ERSATZ.hemd.karo` streichen | Fass und Lott stehen ohne | `FEHL fass traegt hemd:'karo' … die Figur steht ohne hemd` (und Lott) |
| zusätzlich `cfhemd_hemd_idle` entfernen | auch der Ersatz ist weg | dieselben zwei, dazu `pahl` (trägt `hemd:'hemd'`) |

Nach der Rücknahme meldet der Guard wieder seine eine Zeile.

---

## Was hier ausdrücklich nicht gemacht wurde

* **Die vier Dateien sind nicht dazugekommen.** Sie liegen in der lizenzierten
  Rohbibliothek, die aus Lizenzgründen weder im Repo noch im Assets-Repo steht.
  Ihre Pfade stehen jetzt in `assets/cf/README.md`; wer sie hat, kopiert sie in
  einem Rutsch, und es ist **keine Codezeile** nötig.
* **Keine Garderobenform ist umgeschrieben worden.** Fass und Lott tragen in
  `DORF_FIGUREN` weiter `hemd:'karo'`. Die Tabelle sagt, was gemeint ist; der
  Ersatz sagt, was daraus wird, solange die Datei fehlt. Legt jemand sie ins
  Paket, greift die Auflösung von selbst wieder aufs Karohemd zu.
* **`phase-g9-garderobe.md` bleibt, wie es ist.** Datierter Bericht, Stand statt
  Wegweiser, nicht rückwirkend umgeschrieben. Was daran überholt ist, steht hier.

## Nachtrag zum Nachtrag: die Dateien sind da (24.08.2026, derselbe Tag)

Der Abschnitt darüber sagt, die vier Dateien seien nicht dazugekommen. Wenige
Stunden später sind sie es. Die zehn lizenzierten Packs lagen daneben, die vier
Dateien sind nach `assets/cf/player/` kopiert und im Assets-Repo gelandet
(`wurstbrotdlx/superduper-adventure-assets#4`), nachgemessen mit 576x3584 und
damit auf dem 9x56-Raster à 64x64 wie `Player_Base` — Drop-ins, keine Codezeile.

Die Startzeile lautet seither:

```
G9 Garderobe: 13 Formen, keine ersetzt.
```

Fass und Lott tragen wieder ihr Karohemd statt des Ersatzhemds, Trepp und
Nieselbeck eine Kopfbedeckung.

**Der Ersatzweg bleibt trotzdem stehen.** Er ist nicht das Pflaster für diese
vier Dateien, sondern die Antwort auf die Bauart: `blitFarbFrame()` kehrt bei
einem fehlenden Key still um, und wer ohne vollständiges Paket klont, soll
angezogene Figuren sehen und eine Zeile lesen, die sagt warum. Ohne ihn wäre
derselbe Fund beim nächsten Mal wieder unsichtbar.

### Die Mütze, angesehen statt vermutet

`Farmer_Hat_1` ist im Bild **eine breitkrempige Krempe** und nicht die flache
Schirmmütze, die Trepps und Nieselbecks Porträts zeigen. G9 hat sie „die einzige
echte Kopfbedeckung des Packs" genannt und damit recht behalten, auch nach der
Gegenprobe über alle zehn Packs: 129 Dateien liegen auf dem Heldenraster, davon
sind alle Kopf-Ebenen entweder Frisuren, Plattenhelme oder eben diese eine
Krempe. Eine Dienstmütze gibt es nicht.

**Entscheidung: die Krempe bleibt.** Eine Kopfbedeckung, die als solche
erkennbar ist, schlägt eine Mützenfarbe auf einer Frisur — Nieselbeck hatte
sonst weiterhin grünes Haar, und genau das sollte G9 abstellen. Der Preis steht
im Bild: Trepp sieht damit nach Postkutscher aus und nicht nach Zusteller. Das
ist eine Weltfrage und keine Technikfrage, sie ist gestellt und beantwortet
worden, und sie wird hier festgehalten, damit niemand die Messung wiederholt.

Die Alternativen, die dabei verworfen wurden: `hut:'muetze'` bei beiden
streichen (ehrlicher, aber grünes Haar), die Krempe im Blatt über alle Frames zu
einer flachen Mütze schneiden (die Lizenz erlaubte es, das Repo hat Präzedenz
für handgeschnittene Zellen, aber es ist Pixelarbeit mit ungewissem Ausgang),
und die beiden Fälle zu trennen.

### Zweites Prüfprotokoll, mit den Dateien

| Lauf | Ergebnis |
|---|---|
| `index.html` im Browser | 16 Guard-Zeilen, keine Warnung, **keine 404 mehr**, `G9 Garderobe: 13 Formen, keine ersetzt.`, `frameNo` 153 |
| `node tools/build-single.mjs` | sauber, 140 eingebettete Dateien (vier mehr), `dist/index.html` 2495 KB |
| `dist/index.html` per `file://` | 16 Guard-Zeilen, keine Warnung, keine Fehlermeldung, `frameNo` 154 |
| `tools/figurenfarben-messlauf.mjs` | keine Abweichung, und diesmal auch **keine Notizzeile** — nichts ersetzt, niemand ohne Kopfbedeckung |

Die Rastermessung der vier Dateien vor dem Kopieren: alle vier 576x3584, also
9x56 Zellen à 64x64. Genau das, was `manifest.json` und der G9-Kommentar über
`CF_GARDEROBE` vorhergesagt hatten.

---

## Bewusst offen

* **Die vier 404-Zeilen im Quellbaum bleiben.** Der Browser fragt die vier
  Dateien an, bekommt sie nicht, und das steht als Netzwerkfehler in der Konsole,
  nicht als Warnung des Spiels. Im Einzeldatei-Build sind sie weg, weil
  `ASSET_BLOBS` gar nicht erst danach fragt. Sie zu unterdrücken hieße, eine
  Ladeliste zu pflegen, die es nur für diesen Fall gäbe. *(Mit den Dateien im
  Paket sind auch sie weg. Sie kommen wieder, sobald jemand ohne vollständiges
  Paket klont, und das ist richtig so.)*
* **`CF_GARDEROBE_ERSATZ` deckt nur die Garderobe, nicht die Ausrüstung des
  Spielers.** `CF_ARMOR_FILES` liegt daneben und hat denselben Ausfall nicht,
  weil alle fünf Stufen im Paket liegen. Käme dort eine Datei dazu, die fehlt,
  fiele es wieder niemandem auf — der Guard misst sie nicht.
