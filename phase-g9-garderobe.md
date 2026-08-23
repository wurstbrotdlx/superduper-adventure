# Bauabschnitt G9 — Die Garderobe, der Hut und Nörgels Haut — ERLEDIGT

> **Nachtrag G10.** Eine Stelle unten ist überholt: „Spitze Ohren. Das
> Helden-Rig hat keine." Das stimmt weiter, war aber die falsche Frage —
> Nörgel steht seit G10 auf `orc_chief`, dem Blatt des Empfangsbekenntnisses,
> und hat seine Ohren. Sein Komposit samt `hautFarbe` bleibt als Rückfallweg.
> Siehe `phase-g10-rig-und-doppelbild.md`.

G8 hat den Dorffiguren die Farben ihrer Porträts gegeben. G9 nimmt die
Beschränkungen weg, mit denen G8 gelebt hat: das Vokabular für Kleidung, die
fehlende Kopfbedeckung und die Haut, die keine war.

Auslöser war eine Frage, die genau die richtige war: *Können wir Nörgel nicht
einen Grünhaut-Skin geben? Und was spricht dagegen, die NPCs aus dem Player-Pack
zusammenzubauen?*

Die zweite Hälfte der Antwort lautet: nichts, das tun wir seit G8 für alle
fünfzehn. Die erste Hälfte lautet: doch, und zwar richtig. Und beim Nachsehen
kam heraus, dass wir das Pack bei weitem nicht ausschöpfen.

## Was das Pack hergibt, und was wir davon genutzt haben

Abgelesen an `assets/cf/manifest.json`, nicht geschätzt:

| Ebene | im Pack | vor G9 geladen |
|---|---|---|
| Hemden | 5 Formen, 41 Dateien (OG, Farmer, **Lumberjack**, Royal, Plate) | 5 Dateien |
| Hosen | 4 Formen, 31 Dateien | 5 Dateien |
| Schuhe | 9 Farben | 5 |
| Frisuren | 6 Formen à 5 Naturtöne = 30 | 6 |
| **Kopfbedeckung** | `Accessories/Farmer_Hat_1.png` + 16 Helme | **keine** |
| Handobjekte | Laterne, Fackel, Werkzeug, Angel, Schwert, Bogen | keine |

Alle liegen auf demselben 9x56-Raster à 64x64 wie `Player_Base` (im Manifest
nachgesehen, auch für Hut und Helme) und sind damit Drop-ins für
`addCfHeroLayer()`.

## G9-1. Kleidung heißt nicht mehr Rüstungsstufe

Bis G8 stand in `gestalt` ein `chest: 2`. Das waren die Keys `cfchest_0` bis
`cfchest_4` — die fünf **Qualitätsstufen des Spielers**, die an
`CRAFT_BASE.armor` hängen. Eine Registratorin in Stufe 2 zu kleiden sagt über
ihr Kleid nichts aus, und es hat sich gerächt: Vorblatt trug einen goldenen
Plattenpanzer, weil „Mantel" in diesem Vokabular nicht vorkam.

`CF_GARDEROBE` ersetzt die Stufe durch den Namen des Kleidungsstücks:

```
hemd:  hemd · kittel · karo · hof · panzer
hose:  hose · latz  · hof  · panzer
schuh: schuh
hut:   muetze · helm · helmSchwer
```

Der Spieler behält seine fünf Stufen unangetastet — das ist seine Ausrüstung und
keine Garderobe. `figurenFarbenAssert()` meldet ab jetzt, wenn jemand `chest`,
`legs` oder `feet` wieder einträgt: die Felder würden stillschweigend ignoriert
und die Figur stünde nackt im Dorf.

**Je Form steht genau eine Datei**, und das ist kein Sparen. `farbBlatt()`
normiert die Helligkeitsspanne des Blattes auf ein Band um die Zielfarbe und
legt deren Farbton und Sättigung auf jeden Pixel — der Farbton der Quelle
überlebt das nicht. Ob wir von `Lumberjack_Shirt_1_Green` oder `_Red` ausgehen,
ändert am Ergebnis nichts. Die 41 Hemddateien des Packs sind für uns fünf
Formen und 36 Dubletten.

## G9-2. Der Hut

`Accessories/Farmer_Hat_1.png` ist die einzige echte Kopfbedeckung des Packs und
war nie geladen. Sie wird nach dem Haar gezeichnet und deckt es zu.

Trepp und Nieselbeck tragen auf ihren Porträts eine Dienstmütze. G8 hat deren
Farbe gemessen und auf eine **Frisur** gelegt — die offene Frage aus der G8-
Abnahme lautete wörtlich, „ob Trepps und Nieselbecks Mützenfarbe auf einer
Frisur als Mütze durchgeht oder nur als merkwürdiges Haar". Sie geht jetzt gar
nicht mehr durch, sie ist eine Mütze.

Haar und Mütze teilen sich weiter den einen gemessenen Ton. Das ist gemessen und
nicht bequem: Trepps blonde Tolle und Nieselbecks graues Haar schauen auf den
Porträts so wenig hervor, dass die Schläfenprobe bei ihm Haut trifft und bei ihm
Mützenschatten. Wer beides trennen will, braucht ein engeres Messfenster und
einen Blick aufs Bild — `hutFarbe` steht dafür bereit und fällt auf `haarFarbe`
zurück, solange niemand sie setzt.

## G9-3. Nörgel ist ein Kobold, kein Mensch mit Grünstich

Seit W3 bekam Nörgel eine Tönung über die **ganze** Figur. Grün lag damit auch
auf seinem Hemd, seiner Hose und seinen Schuhen, und damit das Bild nicht
zukleisterte, musste die Tönung schwach bleiben (0,22). Das Ergebnis war ein
Mensch mit einem Grünstich.

`farbBlatt()` taugt für Haut nicht. Sie legt die Helligkeitsspanne des ganzen
Blattes auf ein Band und färbt jeden Pixel — auf dem Körperblatt sitzen aber
Gesicht, Augen und Kontur. Aus zwei Augen und einem Mund würde eine grüne
Fläche. Genau deshalb hat G8 den Körper ausgespart.

`hautBlatt()` geht andersherum vor: **sie sucht die Haut und lässt alles andere
in Ruhe.**

* Ein Pixel gilt als Haut, wenn sein Farbton im warmen Fenster liegt
  (`HAUT_VON` 0.94 bis `HAUT_BIS` 0.14, über den Rot-Nullpunkt hinweg) und er
  bunt genug ist (`HAUT_SAT` 0.12). Augen, Zähne, Weißes und die dunklen
  Konturen sind unbunt oder liegen außerhalb.
* Ein Hautpixel behält **seine eigene Helligkeit**. Nur Farbton und Sättigung
  kommen von der Zielfarbe. Damit bleibt die Schattierung des Gesichts erhalten
  — die Figur wird grün, nicht flach.

Körper **und Hände** bekommen denselben Ton; ein Kobold mit grünem Gesicht und
rosa Händen wäre ein neuer Fehler. `tint`/`tintA` sind bei Nörgel ersatzlos
entfallen, sein Hemd trägt jetzt wieder das gemessene Sandfarben statt Sand mit
Grünschleier.

## G9-4. Wer was anzieht

| Figur | Frisur | Hemd | Hose | dazu |
|---|---|---|---|---|
| Knöterich | h1 | hof | hof | |
| Zwirn | h1 | hof | hof | Weste mit Borte |
| Bramsche | h6 | hof | hof | hochgeschlossenes Kleid |
| Zapf | h1 | kittel | latz | Latzträger über Unterhemd |
| Lisbeth | h6 | kittel | hose | |
| Trepp | h2 | hof | hose | **hut: muetze** |
| Nörgel | h1 | hemd | hose | **hautFarbe** |
| Milb | h5 | hof | hof | Gelehrtenmantel |
| Pommer | h1 | kittel | hose | Khakikittel |
| Fass | h3 | **karo** | hof | offener Kragen, Wirt |
| Lott | h1 | **karo** | hose | geflickter Mantel |
| Pahl | h4 | hemd | hose | |
| Nieselbeck | h1 | kittel | latz | **hut: muetze** |
| Umlauf | h5 | hof | hof | Kurieruniform |
| Vorblatt | h3 | hof | hof | statt Goldpanzer |

Die beiden neuen Möglichkeiten landen dort, wo die Porträts sie verlangen: das
Karohemd beim Wirt mit offenem Kragen und beim geflickten Mantel, die Mütze bei
den beiden Dienstmützenträgern.

## Der Kontaktbogen

`tools/figuren-kontaktbogen.mjs` stellt jede Figur neben ihr eigenes Porträt und
schreibt einen einzigen PNG.

```
┌──────────┬──────────┐
│ Portraet │  Sprite  │   je Figur eine Zelle,
│  128²    │ 64er ×4  │   darunter Schluessel und Garderobe
└──────────┴──────────┘
```

Der Grund: G8 und G9 können alles nachmessen außer dem einen, worauf es ankommt
— wie es aussieht. Das ist keine Zahl, das ist ein Blick, und bis hierher war
der Blick teuer (Spiel starten, hinlaufen, Figur suchen, fünfzehnmal). Jetzt ist
er ein Aufruf. Beides steht ungetönt und ohne Weltlicht nebeneinander, also
strenger als im Spiel: was hier nicht zusammenpasst, passt im Dorf erst recht
nicht.

Ohne Grafikpaket zeigt der Bogen die Porträts und leere Sprite-Felder und sagt
das in der letzten Zeile.

## Entscheidungen, die anders hätten ausfallen können

**Warum nicht alle 41 Hemddateien laden.** Siehe G9-1: der Quellfarbton
überlebt `farbBlatt()` nicht, die Farbvarianten sind Dubletten. Sie zu laden
hätte die Ladezeit vervielfacht und nichts gewonnen. Das ist der einzige Grund;
gäbe es einen Weg, bei dem die Quellfarbe zählt, wäre die Antwort eine andere.

**Warum die Helme trotzdem in der Garderobe stehen.** Sie sind Rüstung und
werden im Dorf niemandem passen. Aber sie sind Kopfebenen auf demselben Raster,
und der nächste, der eine Kopfbedeckung sucht, soll sie nicht noch einmal im
Manifest suchen müssen. Dasselbe gilt für `panzer`.

**Warum das Hautfenster weit ist.** `HAUT_VON`/`HAUT_BIS`/`HAUT_SAT` sind am
warmen Cute-Fantasy-Hautton angesetzt und bewusst großzügig: lieber ein
Schattenrand zu viel mitgefärbt als eine Wange zu wenig. Ein zu enges Fenster
ließe Flecken stehen, und Flecken fallen mehr auf als ein grüner Rand.

**Warum die Handobjekte nicht kommen.** Laterne, Werkzeug, Angel und Schwert
liegen im Pack und wären reizvoll (Zapf mit Werkzeug, Trepp mit Sack). Aber
`Hands_Bare_Lantern_Torch_Idle_Running.png` deckt nur Idle und Running, nicht
die fünf Reihen, die `CF_HERO_ANIMS` führt — das ist ein eigener Bauabschnitt
mit eigener Ersatzregel und keine Zeile nebenbei.

## Was ausdrücklich nicht geändert wurde

* **Der Spieler.** `CF_ARMOR_FILES`, `CF_BOOT_FILES` und `bakeHeroSheet()` sind
  unberührt. Seine fünf Stufen sind Ausrüstung und bleiben es.
* **Die gemessenen Farben.** Kein Hexwert aus G8 hat sich geändert;
  `python3 tools/portraet-farben.py --pruef` steht weiter auf 30 von 30.
* **Anker, Wanderleinen, Standorte, Texte.** Nichts davon angefasst.
* **Knöterichs graue Tönung** (0,82 in der Welt, 0,30 im Porträt). „Alt und
  grau" ist eine Entscheidung aus E1 und keine Notlösung.

## Die Guards

`figurenFarbenAssert()` ist von sechs auf sieben Prüfungen gewachsen und prüft
jetzt Garderobennamen statt Stufenzahlen. Neu darin: **jedes Kleidungsstück gibt
es** (ein `hemd:'frack'` zöge die Figur stillschweigend aus) und **keine
Rüstungsstufe mehr** (wer `chest` wieder einträgt, bekommt nicht Kleidung,
sondern nichts).

`tools/figurenfarben-messlauf.mjs` hat einen Teil 1b bekommen: ein eigenes Blatt
aus vier Sorten Pixel nebeneinander — Haut (warmes Orange mit Helligkeitsrampe),
ein Auge (dunkles Grau), eine Kontur (fast Schwarz) und ein Hemd (Blau). Geprüft
wird, dass `hautBlatt()` genau die erste Sorte anfasst, dass sie deren
Schattierung erhält und dass die anderen drei Byte für Byte gleich bleiben.

## Abnahme

Im Browser mit offener Konsole, ohne danebengelegtes Grafikpaket.

```
G9 Figurenfarben: 15 Figuren eingekleidet, 2 mit Kopfbedeckung, 1 mit eigenem Hautton.
```

| Lauf | Ergebnis |
|---|---|
| `node tools/figurenfarben-messlauf.mjs` Teil 1 | 6 von 6 |
| dito Teil 1b (Haut) | **3 von 3** — Hautpixel nehmen den Zielton an, Auge/Kontur/Hemd unangetastet, Schattierung erhalten |
| `python3 tools/portraet-farben.py --pruef` | 30 von 30 |
| `node tools/gespraech-pruef.mjs` | 58 von 60 (dieselben zwei wie auf `main` ohne Grafikpaket) |
| `node tools/szene-pruef.mjs` | 32 von 32 |
| `node tools/empfang-pruef.mjs` | 59 von 59 |
| `node tools/menue-pruef.mjs` | 39 von 39 |
| `node tools/reich-pruef.mjs` | 35 von 35 |
| `node tools/build-single.mjs` | läuft, 1023 KB (vorher 1011) |
| `node tools/figuren-kontaktbogen.mjs` | schreibt den Bogen, 15 Figuren, 13 Porträts |

**Am Bild geprüft, zum ersten Mal.** Der Kontaktbogen hat die Porträtseite
sichtbar gemacht, und die Zuordnungen aus G9-4 halten stand: Trepp trägt
tatsächlich eine Schirmmütze, Nieselbeck eine flache grüne Mütze, Zapf
Latzträger über dem Unterhemd, Bramsche den Turmknoten über hochgeschlossenem
Blau, und Nörgel ist unübersehbar ein grünhäutiger Kobold mit spitzen Ohren und
sandfarbenem Hemd.

**Was diese Abnahme weiter nicht belegt:** die Sprite-Seite. Das lizenzierte
Cute-Fantasy-Paket liegt in dieser Umgebung nicht, die Sprite-Felder des Bogens
sind hier leer. Die Rechnung ist nachgemessen, die Formwahl an den Porträts
geprüft — wie das Komposit auf dem echten Rig aussieht, hat niemand gesehen.

## Was offen bleibt

- **Ein Lauf mit Grafikpaket.** `node tools/figuren-kontaktbogen.mjs` neben dem
  Assets-Repo, und der Bogen ist vollständig. Drei Punkte gehören dabei
  angesehen: ob die Mütze auf dem Chibi-Kopf sitzt oder schwebt, ob Vorblatts
  fast schwarzer Mantel (`#171717`) noch Zeichnung hat, und ob Nörgels
  Hautfenster jeden Pixel erwischt.
- **Trepps Tolle und Nieselbecks graues Haar.** `hutFarbe` steht bereit, sobald
  jemand die beiden Töne getrennt misst.
- **Die Handobjekte.** Siehe oben, eigener Bauabschnitt.
- **Spitze Ohren.** Das Helden-Rig hat keine. Nörgels Haut ist alles, was ohne
  neue Grafik geht.
- **Riemen und Taschen.** Lisbeth, Trepp, Umlauf und Zapf tragen auf ihren
  Porträts einen Gurt über der Brust. Das Pack hat dafür keine Ebene.
