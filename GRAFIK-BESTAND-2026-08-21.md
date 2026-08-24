# Grafik-Bestandsaufnahme, 21.08.2026

Was in den lizenzierten Cute-Fantasy-Packs liegt, was das Spiel davon lädt, und was der Rest
wert wäre. Entstanden als Vorlage für einen Grafik-Durchgang, der die Packs zweitverwertet,
statt sie neu zu sichten.

Wie jeder datierte Bericht in diesem Repo ist das ein **Stand, kein Wegweiser**. Die Zahlen
altern mit dem nächsten Bauabschnitt, und der Inhalt wird nicht rückwirkend umgeschrieben.

## Methode

Zwei Listen gegeneinander gehalten:

- **Bestand:** `assets/cf/manifest.json`, die Ausgabe von `tools/sheet-audit.mjs` über die
  Rohbibliothek. 886 Einträge mit Pfad und Maßen.
- **Geladen:** `SHEET_LIST` aus dem laufenden Spiel, im Browser ausgelesen, nicht aus dem
  Quelltext geraten. 322 Registrierungen auf 104 eindeutige Dateien (mehrere Anim-Zeilen
  teilen sich eine Datei, siehe die G3-Notiz bei `loadAssets`).

Verglichen wird über den Dateinamen, nicht den Pfad: `assets/cf/` ist flacher sortiert als die
Rohbibliothek. 97 der 104 geladenen Dateien stehen im Manifest wieder. Die restlichen sieben
sind die von Hand geschnittenen Einzelzellen (`crate`, `pot`, `cobweb`, `frame_brown`,
`round_brown`, `glint_strip`, `alert`), dokumentiert in `assets/cf/README.md`. Ein früherer
Versuch, dasselbe per Regex über `index.html` zu zählen, unterschlug `Player_Base` und `Hands`,
weil `addCfHeroLayer()` seinen Pfad erst zur Laufzeit zusammensetzt. Deshalb der Weg über das
laufende Spiel.

## Die Lage in einer Tabelle

| Pack | Bestand | geladen | ungenutzt |
|---|---:|---:|---:|
| `Cute_Fantasy` | 717 | 65 | 652 |
| `Cute_Fantasy_Dungeons` | 51 | 13 | 38 |
| `Cute_Fantasy_ShroomLands` | 33 | 3 | 30 |
| `Cute_Fantasy_UI` | 18 | 0 | 18 |
| `Cute_Fantasy_MilitaryCamp` | 16 | 0 | 16 |
| `Cute_Fantasy_Halloween` | 15 | 1 | 14 |
| `Cute_Fantasy_Characters` | 14 | 8 | 6 |
| `Cute_Fantasy_Volcano` | 13 | 7 | 6 |
| `Cute_Fantasy_Christmass` | 9 | 0 | 9 |
| **Summe** | **886** | **97** | **789** |

789 klingt nach Verschwendung und ist zum großen Teil keine. Der nächste Abschnitt trennt das.

## Was zurecht liegen bleibt

Damit niemand es „repariert":

- **Farbvarianten.** Jedes Kleidungsstück liegt in acht bis neun Farben, jede Frisur in fünf.
  Genutzt wird je eine, und das ist eine Entscheidung aus G2: fünf Rüstungsstufen brauchen
  fünf unterscheidbare Farben, nicht vierzig. Allein das sind rund 90 Dateien.
- **Autotile-Sets.** `Tiles/Water` (21), `Tiles/Cliff` (9), `Tiles/Waterfall` (8),
  `Cobble_Road`, `FarmLand`: 47-Kachel-Blob-Sets. Das Spiel malt Flächen aus Einzelkacheln
  (`pickCfTile`), ein Autotiler wäre ein eigener Renderer. G4 hat das ausdrücklich verworfen.
- **Häuservarianten.** 96 Dateien unter `Buildings/Houses/{Wood,Stone,Limestone}`. Das Dorf
  hat sechs Gebäude und braucht keine sechsundneunzig.
- **`Cute_Fantasy_UI`.** Steht mit 0 in der Tabelle, ist aber genutzt: die vier verwendeten
  Zellen wurden ausgeschnitten und umbenannt, der Namensvergleich findet sie deshalb nicht.
  Der Rest sind Rahmenvarianten, die der Skin nicht braucht.

Bleiben grob 350 Dateien, die tatsächlich Inhalt sind, den es im Spiel nicht gibt.

## Die Kandidaten, nach Verhältnis von Ertrag zu Aufwand

Reihenfolge ist eine Empfehlung, keine Reihenfolgevorschrift. Jeder Punkt nennt, was im Weg
steht, damit die Schätzung nachprüfbar ist statt geraten.

### 1. Die fünf fehlenden Dorf-Blätter (offen aus G6)

`Lumberjack_Jack`, `Chef_Chloe`, `Fisherman_Fin`, `Farmer_Buba`, `Bartender_Bruno` aus
`Cute_Fantasy/NPCs (Premade)/`. Fünf Dateien nach `assets/cf/deco/NPCs/`, **keine Codezeile**:
`npcBlaetter()` fragt zur Laufzeit `SHEETS`. Zapf, Lisbeth, Trepp, Milb und Fass bekommen ihre
eigenen Rigs statt der Held-Komposite aus G6.

Im Weg: nichts außer den Dateien. Erkennbar erledigt, wenn die Startmeldung
`G6 Dorfsicht: 5 von 8 NPC-Blättern liegen nicht im Grafikpaket …` verschwindet.

**Aufwand: Minuten.** Und `Fisherman_Fin` ist danach zu prüfen: das Manifest tippt bei ihm auf
`fw:32` und 18 Spalten, `CF_NPCS` steht auf `fw:64` und 9 Spalten. Eine von beiden Zahlen ist
falsch, und die Manifest-Heuristik ist bei Anim-Blättern erwiesenermaßen unzuverlässig (siehe
G3). Mit `tools/sheet-audit.mjs --rig` messbar, sobald die Datei da ist.

### 2. Helme für die Rüstungsstufen 3 und 4

`Player/Head/Plate_Helmet_1` und `Plate_Helmet_2`, je acht Farben, gleiches 9x56-Raster wie
alle Held-Layer. Eisen und Gold sind vorhanden.

Heute trägt der Außendienst in Vollplatte einen unbedeckten Kopf. Der Helm wäre ein weiterer
`blitLayerFrame()`-Aufruf in `bakeHeroSheet()`, an derselben Stelle wie das Haar, und die
Frage, ob er das Haar ersetzt oder überdeckt (er sollte es ersetzen, sonst quillt die Frisur
unter dem Visier hervor).

Im Weg: das beißt sich mit P1. Ein Helm verdeckt genau das Erkennungsmerkmal, das P1 gerade
eingeführt hat. Vorschlag: Helm nur ab Stufe 3, und die Haarfarbe wandert dann in einen
Federbusch oder an den Umhang. Das ist eine Designfrage, keine Technikfrage.

**Aufwand: klein, Entscheidung nötig.**

### 3. Ein zweiter Angriffsweg: Bogen

`Player/Tools/Bow/Wooden_Bow.png`. Der Außendienst hat seit jeher genau eine Angriffsart, und
Z1/Z2 haben viel Mühe darauf verwendet, den Fernkampf per Zauber teuer zu machen. Ein Bogen
wäre der ehrliche Fernkampf: kostet Munition oder Ausdauer statt Mana, trifft schwächer.

Im Weg: das ist Balance, nicht Grafik. M1, Z1, Z2 und S1 haben die Kampfwerte gegen einen
Referenzspieler geeicht, `monsterAssert` hält sie fest, und `tools/zauber-messlauf.mjs`
misst genau die Frage, die ein Bogen neu aufwirft. Ohne Messlauf nicht anfassen.

**Aufwand: groß. Eigener Bauabschnitt mit Vorher-Nachher-Messung.**

### 4. Höhlen-Tiles: ein Biom, das es noch nicht gibt

`Tiles/Cave`, 13 Dateien inklusive Wänden, Böden, Stützbalken, Wasser mit Animation, Leiter
und **Schienen**. Dazu passend `Cute_Fantasy/Other/Mine_Cart` und die 38 ungenutzten
Dungeon-Dateien.

Die Kammern (Phase G1/W5) nutzen heute zwei Dungeon-Sets. Ein drittes Set „Stollen" wäre eine
Kammervariante ohne neue Mechanik: `dun3_*` registrieren, `kammer.set` auf drei Werte
erweitern. Die Schwierigkeitszuordnung sitzt bereits in einer Tabelle.

Im Weg: die Anker und Raster müssen gemessen werden, `sheet-audit.mjs` taugt bei Flächen-Tiles
nichts (G4-Lektion), also von Hand wie bei den G4-Böden.

**Aufwand: mittel. Bestes Verhältnis von Ertrag zu Risiko in dieser Liste.**

### 5. Sechs Gegner-Rigs, die schon im Repo liegen könnten

Aus `Cute_Fantasy_Characters`: `Goblin_Archer`, `Goblin_Spearman`, `Orc_Archer`, `Orc_Chief`,
`Orc_Grunt`, `Orc_Peon`. Acht der vierzehn Dateien dieses Packs sind bereits im Assets-Repo,
diese sechs nicht.

`assets/cf/README.md` nennt den Grund für die Orks: „Raster-Konfidenz zu niedrig, ungeprüft".
Das ist kein Urteil über die Grafik, sondern über die Messung. Mit
`tools/sheet-audit.mjs --rig` nachmessbar.

Im Weg: der Monsterkatalog. 22 Gegner sind auf fünf Bänder gerechnet, `monsterkatalog.py`
prüft die Invarianten und `tools/monster-messlauf.mjs` misst sie im laufenden Spiel. Neue
Modelle an vorhandene `MONDEF`-Typen zu hängen ist billig; neue Gegnertypen sind M3.

**Aufwand: klein, wenn nur Modelle getauscht werden. Groß, wenn es neue Gegner werden.**

### 6. Reiten

`Player/Player_Mounts/Horse`, fünf Farben, 384x384. Die Karte ist seit W-Groß sechzehnmal so
groß, und der Weg vom Dorf zum Rand ist zu Fuß lang.

Im Weg: mehr, als es aussieht. Ein Reittier braucht einen zweiten Bewegungszustand, eine
eigene Kollision, eine Regel fürs Absitzen im Kampf, und es kollidiert mit der Schichtuhr als
Spannungsmittel. Dazu die Frage, was ein Amt für ein Dienstpferd verlangt.

**Aufwand: groß, und es ist eine Weltfrage vor einer Grafikfrage.**

### 7. Ausstattung, die die Welt bewohnter macht

Ohne neue Mechanik, reine Deko-Setzer wie schon bei Bäumen und Felsen:

| Was | Dateien | Wo es hingehört |
|---|---|---|
| `House_Decor` | 26 | Amboss mit Animation, Werkbänke, Kisten. Wenn Innenräume kommen. |
| Zäune | 8 | Der Weidegürtel ums Dorf hat 18 Tiere und keine Umzäunung. |
| Brücken | 6 | Die Küste aus W-Groß hat keine einzige. |
| Schilder | 2 | `Sign_1_Anim`, `Sign_2_Anim`. Ein Amt ohne Beschilderung ist eine verpasste Gelegenheit. |
| Boot | 2 | Am Meer, als Landmarke. |
| Wasserpflanzen | 31 | Teiche und Küstensaum. |
| Krähen, Frösche, Gänse, Enten, Schmetterlinge, Bienen, Mäuse, Schwäne | ~30 | Ambiente neben den fünf vorhandenen Hoftieren. |
| Kapybaras | 12 | Zwölf Dateien für ein Tier, das taucht und Blasen macht. |

**Aufwand: je Posten klein.** Der Setzer steht, `decos` und `critters` nehmen neue Arten ohne
Umbau auf. Das ist der Steinbruch für Abende, an denen kein Bauabschnitt ansteht.

*(Berichtigt am 24.08.2026, nachgemessen in G12, s. `phase-g12-steinbruch-rest.md`. Drei Zeilen
dieser Tabelle stimmen nicht. **Erstens: Krähen gibt es im Pack nicht.** Unter
`Cute_Fantasy/Animals/` steht kein einziger Krähenvogel, das einzige Wort im ganzen Manifest, das
auf `crow` passt, ist Scarecrow. Echt sind achtundzwanzig Dateien statt „~30": Frosch 6, Gans 6,
Ente 5, Maus 4, Biene 3, Schwan 3, Schmetterling 1. **Zweitens: Teiche gibt es auch nicht.** Der
Wasser-Messlauf über drei Startwerte findet im Umkreis von sechzig Kacheln um das Dorf keine
einzige Wasserkachel; das nächste Uferwasser liegt 105 bis 126 Kacheln entfernt, und an einem Weg
liegt gar keins. Wasserpflanzen gehören an den Küstensaum, und sonst nirgendwohin. **Drittens
nehmen `critters` neue Arten sehr wohl nur mit Umbau auf.** Die Sammlung kennt genau eine Bauart:
begehbarer Grund, Abprallen an allem, zwei Zeilen `idle`/`walk`. Eine Ente braucht das Gegenteil
von `walkPx()`, ein Schmetterling gar keine Bodenprüfung, ein Kapybara einen Zustandswechsel. Der
Satz gilt für Zäune, Schilder und Boot — für alles, was schwimmt oder fliegt, gilt er nicht.
**Die Brücken sind seit G12 gestrichen**, nicht vertagt: der größte Umweg, den eine Brücke auf
dieser Karte sparen würde, beträgt siebzehn Kacheln, und eine Brücke zur Deko-Insel wäre der
Korridor, den `genMap()` Schritt 3 ausdrücklich verbietet.)*

### 8. Was liegen bleiben sollte

- **`Cute_Fantasy_MilitaryCamp`** (16, komplett ungenutzt): Katapult, Kanone, Palisaden,
  Wachtürme. Grafisch reizvoll, aber das Monstralministerium führt keinen Krieg, es bearbeitet
  Vorgänge. Die Weltbibel würde das kassieren, bevor es gebaut ist.
- **`Cute_Fantasy_Christmass`** (9, komplett ungenutzt): Weihnachtsmann, Rentier,
  Lebkuchenhaus. Ein Saisonwitz in einer Welt, deren Kalender aus Schichten besteht.
- **`Cute_Fantasy_UI` Fonts:** kein ä, ö, ü, ß im TTF, per `fontTools`-Cmap-Check in G5
  bestätigt. Das ist erledigt und bleibt erledigt.

## Vorschlag für die Reihenfolge

1. Die fünf NPC-Blätter nachlegen (Minuten, schließt G6 ab).
2. Deko-Steinbruch aus Punkt 7, so viel wie Lust besteht (klein, risikoarm, sofort sichtbar).
3. Stollen-Biom aus Punkt 4 (mittel, echter Zugewinn, keine Balance-Frage).
4. Helme aus Punkt 2, nachdem die Designfrage gegen P1 entschieden ist.
5. Alles andere als eigener Bauabschnitt mit Messlauf.

Punkt 1 bis 3 sind Grafik. Ab Punkt 4 wird es Gameplay, das zufällig eine Grafik mitbringt,
und dann gelten die Regeln aus `superduper-gameplay-prompt.md`: Phasendokument, Abnahme,
Prüfprotokoll, live verifiziert statt behauptet.
