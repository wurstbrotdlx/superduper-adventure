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

## Bewusst offen

* **Trepp und Nieselbeck tragen ihre Mützenfarbe weiter im Haar.** G9 hat die
  Mütze eingeführt, damit genau das aufhört, und ohne die Datei hört es nicht
  auf. Nieselbeck hat deshalb grünes Haar. Der Guard nennt beide beim Namen, bis
  `Farmer_Hat_1.png` im Paket liegt.
* **Die vier 404-Zeilen im Quellbaum bleiben.** Der Browser fragt die vier
  Dateien an, bekommt sie nicht, und das steht als Netzwerkfehler in der Konsole,
  nicht als Warnung des Spiels. Im Einzeldatei-Build sind sie weg, weil
  `ASSET_BLOBS` gar nicht erst danach fragt. Sie zu unterdrücken hieße, eine
  Ladeliste zu pflegen, die es nur für diesen Fall gäbe.
* **`CF_GARDEROBE_ERSATZ` deckt nur die Garderobe, nicht die Ausrüstung des
  Spielers.** `CF_ARMOR_FILES` liegt daneben und hat denselben Ausfall nicht,
  weil alle fünf Stufen im Paket liegen. Käme dort eine Datei dazu, die fehlt,
  fiele es wieder niemandem auf — der Guard misst sie nicht.
