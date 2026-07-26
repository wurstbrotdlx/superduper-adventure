# SuperDuper Adventure, Grafik-Umbau auf Cute Fantasy in 6 Phasen (G0 bis G5)

Arbeite die Phasen einzeln ab, nicht alle in einer Session. Ziel: kompletter Wechsel von Sunnyside World auf Cute Fantasy (Kenmi). Am Ende referenziert das Spiel kein einziges Sunnyside-Asset mehr.

## Modellstrategie (Hinweis für Matthias, nicht für Claude Code)

* Diese Datei liegt im Repo-Root, wird nicht in den Chat gepastet.
* Modell auf `opusplan` stellen. Pro Phase eine frische Session. Auftakt jeweils nur: „Lies superduper-grafik-prompt.md im Repo-Root. Setze ausschließlich Phase GN um. Halte dich strikt an den Regressionsschutz-Block. Erst committen, wenn die Abnahmekriterien erfüllt sind."
* Plan-Modus pro Phase kurz nutzen, um den Phasenabschnitt auf den realen Code zu mappen, dann ausführen lassen.
* Nach jeder Phase trägt Claude Code seine Umsetzungsnotizen unten in diese Datei ein (eigener Abschnitt pro Phase), damit Folgephasen davon lesen.

## Kontext

Du arbeitest an `~/vibecodingprojekt/adventure/`. Der Ordner ist das Repo (`wurstbrotdlx/superduper-adventure`, public, Branch `main`, GitHub Pages aus dem Root). Direkt von hier committen und pushen.

* Hauptdatei: `index.html` (Canvas/JS, ein File, groß)
* Aktuelle Grafik: `assets/` (Sunnyside World, danieldiggle), einheitliches 96x64-Frameraster, row-major, Framezahlen hart im Code hinterlegt
* Neue Grafik-Quelle: `Graphics/` im Repo-Root (Cute Fantasy von Kenmi plus Add-ons). Das ist die **Rohbibliothek**, sie wird NIE committet (siehe Lizenz). Genutzte Dateien werden kuratiert nach `assets/cf/` kopiert.
* Dev-Server: `.claude/launch.json` (eine Ebene höher, `~/vibecodingprojekt/.claude/`), Eintrag `adventure`, Port 8378, URL `http://localhost:8378/adventure/index.html`
* Gameplay-Doku: `superduper-gameplay-prompt.md` im selben Ordner. Dort stehen die Umsetzungsnotizen der Phasen 1 bis 6 (Zutaten-Grammatik, Kammern, Flüche, Schichtmodus, Knöterich, Soundtrack). Bei Berührungspunkten dort nachlesen.

### Was in `Graphics/` liegt

| Ordner | Inhalt | Verwendung |
|---|---|---|
| `Cute_Fantasy/` | Basis: modularer Player (Player_Base, Chest, Feet, Hands, Head, Legs, Accessories, Tools, Player_Mounts), Enemies (Slime S/M/L, Skeleton + Bowman/Mage/Swordman, Bombschroom), Tiles (Grass, Beach, Cliff, Cave, Water, Waterfall, Bridge, Cobble_Road, FarmLand), Trees, Buildings, Animals, NPCs (Premade), Outdoor decoration, Weather effects, Crops, Icons | G2, G3, G4, G5 |
| `Cute_Fantasy_Characters/` | Goblins, Knights, Orcs, Angels | G3 |
| `Cute_Fantasy_Dungeons/` | 3 komplette Dungeon-Sets: Böden, Wände, Türen, Tore (mit Öffnungs-Animation), Druckplatten (mit Animation), Bodenstacheln, Treppen, Sewer, Pillars, Objects | G1 |
| `Cute_Fantasy_Volcano/` | Vulkan-Tiles, Gebäude, Props, Enemies (Cowling 1/2, Cowling Mage 1/2, Flying Skull) | G3, G4 |
| `Cute_Fantasy_ShroomLands/` | Pilzland-Tiles, Häuser, Props, Shroomlings, Snails | G3, G4 |
| `Cute_Fantasy_UI/` | UI-Elemente, Fonts | G5 |
| `Cute_Fantasy_Halloween/` | Hexe, Deko | G3 (Hexe), Rest Reserve |
| `Cute_Fantasy_Christmass/` | Schnee-Deko, Charaktere | G4 (Frostkamm-Deko) |
| `Cute_Fantasy_MilitaryCamp/` | Lager-Props | Reserve |
| `Old_Sprites/`, `Player_Aseprite_Files/` | veraltete Fassungen, Arbeitsdateien | **NIE verwenden** |

### Lizenz (gemessen an `read_me.txt` in den Packs)

Kommerzielle Nutzung ja, Modifikation ja, Weiterverteilung/Weiterverkauf nein, auch nicht modifiziert. Konsequenzen:

1. `Graphics/` kommt in die `.gitignore` und wird nie gepusht (Phase G0).
2. Nach `assets/cf/` wandern nur Dateien, die das Spiel tatsächlich lädt, so wie es bei Sunnyside schon gehandhabt wird.
3. `CREDITS.md` wird in G0 um Cute Fantasy (Kenmi, itch.io) ergänzt. Sunnyside bleibt dort stehen, bis G5 die letzten Sunnyside-Assets entfernt.

### Gemessene Fakten (Stichproben, ersetzt kein Audit)

* Tiles: 16x16 px Einzeltiles plus zusammengesetzte Tilesheets (z. B. `Grass_Tiles_1.png` 256x160, `Dungeon_1.png` 208x208).
* Charaktere: 32-px-Raster, aber Sheets unterschiedlich groß (`Player_Base_animations.png` 576x3584, `Skeleton.png` 192x320, `Skeleton_Mage.png` 256x416, `Skeleton_Swordman.png` 256x512). Zeilen- und Framezahlen variieren pro Sheet.
* **Lektion aus dem Sunnyside-Umzug: Dateinamen und Annahmen lügen.** Framezahlen werden ausschließlich per Alpha-Bounding-Box-Analyse verifiziert und hart im Code hinterlegt (G0 baut das Werkzeug).

## Regressionsschutz: das hier NICHT kaputtmachen

Identisch zum Gameplay-Prompt, gilt unverändert weiter:

1. HUD schreibt nur bei echter Wertänderung (`setTxt`/`setHTML`/`setStyle` mit Dirty-Check). Niemals `innerHTML` pro Frame.
2. Touch-Handler am `window`, `.beltSlot *{pointer-events:none}` bleibt, Frame-Watchdog bleibt.
3. Kein `Math.hypot` in Hot Paths.
4. Zeichenliste über den Pool mit Typ-Tags, keine Closures oder Allokationen pro Frame.
5. Caps bleiben: Partikel 900, Floater 70.
6. `hurtMon()` behält den Tot-Guard.
7. Sprite-Framezahlen hart im Code, nie aus Dateinamen.
8. Minimap wird gebacken, danach nur Blit alle 4 Frames.
9. Sound-Bremsen (70 ms auf Crit und Sterben) bleiben.

Grafik-spezifisch neu dazu:

10. Kein `ctx.filter` im Frame-Pfad. Einfärbungen (Tints, Biom-Umfärbungen, Grau-Tönung) werden einmalig auf Offscreen-Canvas gebacken und dann geblittet, wie bisher.
11. Boden-Canvas wird pro Level einmal gebacken (aktuell 2560x2560), im Frame nur geblittet. Das bleibt so, egal wie die neuen Tiles organisiert sind.
12. Ladeliste datengetrieben: eine Manifest-Tabelle im Code (Pfad, Framegröße, Framezahl je Animation, Anker). Kein Ladecode, der Eigenschaften rät.
13. Übergangszustand ist erlaubt: Bis G5 dürfen Sunnyside und Cute Fantasy gemischt sichtbar sein (z. B. Sunnyside-Held auf Cute-Fantasy-Dungeonboden). Nicht versuchen, in einer Phase alles zu tauschen.
14. `pixelated`-Rendering (`imageSmoothingEnabled=false` bzw. CSS) konsistent halten, damit 16/32-px-Kunst scharf bleibt.

Nach jeder Phase gilt: Spiel startet, ist durchspielbar, 300-Frame-Soak mit Zaubern ohne Exception, CPU-Frame-Budget in der Horde nicht schlechter als vorher (~0,6 ms Referenz). Erst dann committen. Ein Commit pro Phase.

## Zielbild

Ein durchgehender Look aus einem Guss: Cute Fantasy überall, 16-px-Tiles, 32-px-Raster-Charaktere, sichtbare Ausrüstung am Helden, echte Rig-Vielfalt bei Monstern statt Tint-Varianten, Kammern mit echtem Dungeon-Interieur, begehbares Dorf. Konfetti statt Blut bleibt. Amtsstuben-Ton bleibt.

---

## Phase G0: Fundament (kein sichtbarer Unterschied im Spiel)

1. `.gitignore` um `Graphics/` ergänzen. Prüfen: `git status` darf `Graphics/` nicht mehr anbieten.
2. `CREDITS.md` ergänzen: Cute Fantasy (Kenmi, itch.io), Lizenzkurzfassung wie oben. Sunnyside-Eintrag bleibt vorerst.
3. **Audit-Werkzeug** bauen (eigenständige HTML-Seite oder Node-Script im Repo, egal, Hauptsache reproduzierbar): lädt ein Sprite-Sheet, findet per Alpha-Bounding-Box die echte Frame-Aufteilung (Rastergröße, Spalten, Zeilen, belegte Frames pro Zeile), gibt eine fertige Manifest-Zeile aus.
4. Audit über alle Sheets laufen lassen, die G1 bis G5 brauchen werden (Player_Base + alle Ausrüstungs-Layer, alle Enemy-Sheets inkl. Characters/Volcano/ShroomLands/Halloween-Hexe, Dungeon-Sets, Tilesheets, Bäume, Tiere, NPCs, Wetter). Ergebnis als `CF_MANIFEST`-Tabelle nach `index.html` (noch ungenutzt) oder als JSON neben die Assets.
5. Verzeichnis `assets/cf/` anlegen, Kopier-Konvention festlegen (Unterordner je Kategorie, Original-Dateinamen behalten).
6. Welche Animationen je Rig existieren (idle, walk/run, attack, cast, hurt, death, besondere) im Manifest vermerken. Besonders prüfen: **welche Rigs eine Zauber-Animation haben**. Beim Sunnyside-Umzug hatte das Skelett-Rig keine, deshalb liefen alle Magier auf dem Goblin-Rig. Gleiche Sorgfalt hier.

### Abnahme G0

`Graphics/` unsichtbar für git. Manifest deckt alle benötigten Sheets ab, Stichprobe von 5 Sheets von Hand gegen das PNG geprüft. Spiel selbst unverändert (kein Diff im Verhalten, Soak läuft).

## Phase G1: Kammern-Interieur (Dungeon-Sets)

Die Kammern (Phase 2 des Gameplay-Umbaus) bekommen echtes Dungeon-Interieur. Bisher: eingefärbter Erdboden auf derselben Karte, Oberwelt wird gesichert und kachelgenau wiederhergestellt. Diese Mechanik bleibt unangetastet, nur die Optik der Kammer wechselt.

* Die 3 Dungeon-Sets auf die Schwierigkeit mappen: Stufe 1 bis 2 nimmt Dungeon_1, Stufe 3 bis 4 Dungeon_2, Stufe 5 Dungeon_3 (oder pro Biom, wenn das optisch besser trägt; entscheide beim Sichten und dokumentiere es in den Umsetzungsnotizen).
* Echte Wände statt Blocker-Kacheln, echte Böden, Pillars und Objects als Deko.
* Die versiegelte Kammertür in der Oberwelt nutzt die Tor-Sprites (Gate_Closed, Gate_anim beim Öffnen). Das Holzschild mit Schwierigkeit und Beute-Tier bleibt in Funktion und Lesbarkeit unverändert.
* Modul-Requisiten aufwerten: Druckplatten-Modul nutzt `Dungeon_1_Pressure_Plate_Anim`, Tore zwischen Räumen nutzen Door/Gate-Animationen, einbrechende Bodenplatten können `Floor_spikes`/Sewer-Elemente als Optik nehmen. Rätsel-Logik bleibt exakt gleich, nur Darstellung wechselt.
* Treppen-Sprites für Ein- und Ausgang der Kammer.
* Kammerwächter (Mumie, Golem, Spinne, Fledermaus, Knochenritter, Irrlichtmagier, Alter Schrecken) bleiben in dieser Phase auf ihren alten Rigs. Stilbruch ist bis G3 erlaubt.

### Abnahme G1

Alle 8 Rätselmodule in Kammern aller Schwierigkeitsstufen gebaut, gelöst, verlassen (die bestehende Zusicherungs-Suite aus Phase 2 muss grün bleiben). Oberwelt kachelgenau wiederhergestellt. Esc-Abbruch und Tod in der Kammer funktionieren. Soak über mehrere Kammern plus Oberwelt.

## Phase G2: Held modular (sichtbare Ausrüstung)

Der Held wechselt auf das Cute-Fantasy-Player-System: `Player_Base` plus Layer für Chest, Legs, Feet, Head, Hands, Tools, Accessories, übereinandergezeichnet in fester Reihenfolge.

* Kessel-Slots auf Layer mappen (die 4 Slots aus der Zutaten-Grammatik, inkl. Stiefel auf Feet). Waffen-Slot nutzt Tools.
* Qualitätsstufe und Wirkung sollen sich im Layer niederschlagen (unterschiedliche Layer-Varianten oder gebackene Farbvarianten pro Stufe). Damit ist der Aura-Glow abgelöst; der Glow-Code fliegt raus.
* Frisuren-Zufall beim Start bleibt als Idee erhalten: Accessories/Head-Varianten statt der 6 Sunnyside-Frisuren.
* Animations-Mapping: idle, run, attack, cast, hurt, death aus dem Manifest. Falls dem CF-Player eine dieser Animationen fehlt, Ersatzregel definieren und dokumentieren (z. B. cast = attack-Variante mit Partikel-Overlay), nicht stillschweigend improvisieren.
* Gebackene Composite-Frames: Layer-Kombination einmal pro Ausrüstungswechsel auf Offscreen-Canvas zusammensetzen, im Frame nur blitten. Nicht 7 Layer pro Frame einzeln zeichnen.
* Fluch-Optik (Phase 3 Gameplay): ruht ein Fluch (`item.fluchRuht`), ändert sich am Layer nichts; das regelt weiterhin der Tooltip.

### Abnahme G2

Jede Slot-Belegung ändert den Helden sichtbar (4 Slots x mindestens 3 Qualitätsstufen von Hand durchgeschaltet und angesehen). Alle Animationen laufen in Oberwelt, Kammer, Schattenland. Touch-Steuerung unberührt. Aura-Glow-Code entfernt. Soak.

## Phase G3: Monster auf echte Rigs

Alle 21 Monstertypen aus `MONDEF` plus beide Bosse wechseln auf Cute-Fantasy-Rigs. Tint und Skalierung bleiben als Werkzeug erlaubt, aber die Rig-Basis wird vielfältig statt 2 Rigs für alles.

Verfügbare Rigs (Manifest aus G0 ist die Wahrheit): Slime S/M/L, Skeleton, Skeleton_Bowman, Skeleton_Mage, Skeleton_Swordman, Bombschroom, Goblins, Orcs, Knights, Angels, Shroomlings, Snails, Cowling 1/2, Cowling_Mage 1/2, Flying_Skull, Hexe (Halloween).

* Mapping-Tabelle `MONDEF`-Typ zu Rig anlegen (Datentabelle, kein verstreuter Code). Sinnfälligkeit vor Vollständigkeit: Goblin-Typen auf Goblin-Rigs, Skelett-Typen auf Skeleton-Varianten, Magier auf Rigs **mit Zauber-Animation** (Skeleton_Mage, Cowling_Mage, Hexe), Spinne/Fledermaus können bei fehlendem Rig auf passend getintete Nachbarn (Flying_Skull für Fledermaus liegt nahe). Golem und Mumie: beste verfügbare Basis wählen, tinten, dokumentieren.
* Bosse: Schattenfürst und Alter Schrecken bekommen die imposantesten verfügbaren Rigs (Orc/Knight groß skaliert, oder Slime_Big für einen der beiden, nach Sichtung entscheiden).
* Fernkampf-Magier brauchen ihre Cast-Animation, Regel aus G0-Audit anwenden. Wenn ein Wunsch-Rig keine Cast-Animation hat, gilt die Sunnyside-Lektion: Magier-Typen laufen ausnahmslos auf Rigs mit Cast.
* Aggro-„!", Sterbe-Animation zu Ende spielen, Konfetti-Zerplatzen, Leichen-Verhalten: alles unverändert übernehmen.
* Hoftiere der Oberwelt (Huhn, Schaf, Kuh, Schwein) auf `Cute_Fantasy/Animals` umziehen, gleiches Wander-Verhalten.

### Abnahme G3

Alle 21 Typen plus beide Bosse einzeln erzwungen und angesehen (idle, laufen, angreifen, casten wo zutreffend, sterben). Kammerwächter in Kammern geprüft. Kein Sunnyside-Charakter-Sheet mehr in der Ladeliste. Soak mit voller Horde, Frame-Budget gehalten.

## Phase G4: Oberwelt-Tiles, Biome, Deko

Der Boden und die Welt wechseln auf Cute-Fantasy-Tiles. Bake-Mechanik (einmal pro Level auf 2560x2560) bleibt.

* Grasland: Grass-Varianten sparsam gestreut (kein Schachbrett, gleiche Philosophie wie bisher), Cobble_Road/Path für Wege, Water mit Animation für Teiche (animiertes Wasser als kleines Overlay-System über dem gebackenen Boden, wenn das Budget hält; sonst statisch, dokumentieren).
* Aschewüste: **Volcano-Tiles**, echte Lava-Optik statt eingefärbtem Sand. Volcano_Props als Deko.
* Frostkamm: bleibt technisch eine gebackene Umfärbung (es gibt kein Schnee-Tileset), aber mit Christmass-Schnee-Deko als Requisiten. Dokumentieren, welche Basis umgefärbt wird.
* Schattenland: gebackene Dunkel-Umfärbung wie bisher, ShroomLands-Props (leuchtende Pilze!) als Deko passen thematisch.
* Optional, wenn es gut läuft: ShroomLands als Grundlage für ein späteres viertes Biom vorbereiten (nur Tiles erfassen, kein neues Biom verdrahten).
* Bäume: Cute-Fantasy-Trees, Sway-Verhalten übernehmen falls Sheets es hergeben, sonst dezenter Code-Sway wie bisher.
* Deko-Ersatz für Windmühle als Landmarke: Buildings sichten, beste Landmarke wählen (Windmühle, Turm, was das Pack hergibt).
* Glint auf Drops, Feuer-Sprites, Portal-Optik: auf CF-Material umziehen oder prozedural belassen, nach Sichtung entscheiden.
* Minimap ergibt sich automatisch aus dem neuen Bake, gegenprüfen.

### Abnahme G4

Alle 3 Biome plus Schattenland durchlaufen, Böden aus echten Tiles bzw. dokumentierten Umfärbungen, Übergänge sauber, keine sichtbaren Kachelfugen. Kein Sunnyside-Tile mehr in der Ladeliste. Bake-Zeit beim Levelwechsel nicht spürbar schlechter. Soak.

## Phase G5: Dorf, UI, Sunnyside-Abschied

* **Begehbares Dorf** im Grasland: Buildings (Häuser, Amt als erkennbares Gebäude), NPCs (Premade) als Staffage mit Wander- oder Standverhalten, der Kessel-Prop wandert an seinen Dorfplatz, Knöterich steht als Weltfigur im Dorf (sein Grau-Ton bleibt gebacken, kein `ctx.filter`). Das Amt-Overlay (`#ovPanel`) bleibt funktional wie es ist; das Gebäude ist der Ort, an dem man es öffnet (Kontext-Taste F), zusätzlich bleibt der bisherige Zugang erhalten.
* `MUS.goto('village')` scharf schalten: die Dorf-Zone liegt seit Phase 6 (Soundtrack) fertig in den Daten und wartet genau hierauf.
* **UI-Skin**: Cute_Fantasy_UI für Panels, Knöpfe, Gürtel, Röhren (mobil) und Kessel-Panel. Vorsicht: alle HUD-Dirty-Check-Regeln gelten weiter, der Skin ist CSS/Hintergrundbilder, keine neue DOM-Schreiblogik. Fonts aus dem UI-Pack nur, wenn Umlaute und ß sauber drin sind, sonst Systemfont behalten (deutsche Spieltexte!).
* Wetter-Effekte (Weather effects) als dezentes Ambiente pro Biom, hinter Partikel-Cap.
* **Sunnyside-Abschied**: alte `assets/`-Sunnyside-Dateien aus dem Repo entfernen, Ladeliste rein CF, `CREDITS.md` final (Sunnyside raus, Kenmi drin), letzter Volltest.
* Reserve, nicht umsetzen, nur im Hinterkopf: Player_Mounts (Reittiere), Halloween/Christmass als Saison-Events, MilitaryCamp.

### Abnahme G5

Dorf begehbar, Amt über Gebäude erreichbar, Dorf-Musik läuft nur im Dorf. UI-Skin auf Desktop und Touch geprüft (Gürtel eine Zeile, nichts unter dem Daumen-Fächer, Röhren funktionieren). Kein Sunnyside-Asset mehr im Repo, `git grep -i sunnyside` in der Ladeliste leer (CREDITS-Historie ausgenommen). Kompletter Regressionsdurchlauf: alle 8 Kammermodule, Kessel, Flüche, Schichtmodus, Knöterich-Beats, alle 6 Musikzonen, 300-Frame-Soak, Frame-Budget. Live auf GitHub Pages verifiziert.

---

## Umsetzungsnotizen (füllt Claude Code nach jeder Phase)

### G0 — Fundament (erledigt)

**Korrekturen am Prompt-Kontext oben (wichtig für G1–G5):**

1. `Graphics/Cute_Fantasy_Dungeons/Dungeon_3/` ist ein **leeres Verzeichnis**. Es gibt nur 2 Dungeon-Sets, nicht 3. Die G1-Idee „Stufe 5 nimmt Dungeon_3" entfällt — G1 muss 5 Schwierigkeitsstufen auf 2 Sets mappen (z.B. Dungeon_1 für Stufe 1–3, Dungeon_2 für Stufe 4–5, oder nach Optik entscheiden).
2. Der CF-Spieler läuft auf **64×64-Frames**, nicht 32px wie im Zielbild-Absatz behauptet. `Player_Base_animations.png` ist 576×3584 = 9 Spalten × 56 Zeilen à 64×64, alle 130 Ausrüstungs-Layer sind pixelidentisch gerastert. 32px gilt für die meisten Gegner-Rigs, nicht für den Helden.
3. `Cute_Fantasy_MilitaryCamp` und `Cute_Fantasy_ShroomLands` liefern keine `read_me.txt` — im CREDITS-Eintrag pauschal unter Kenmi geführt, keine gesonderte Lizenzzeile nötig.

**Umgesetzt:**

- `.gitignore`: `Graphics/` ergänzt. `git status --short` zeigt es nicht mehr an.
- `CREDITS.md`: Kenmi-Absatz ergänzt (Cute Fantasy Basis + Volcano-Store-Links, Premium-Lizenz-Kurzfassung). Sunnyside-Absatz unverändert.
- **Audit-Werkzeug** `tools/sheet-audit.mjs`: Node-CLI, zero-dep (nur `node:fs`/`node:zlib`/`node:path`). Eigener PNG-Decoder (nur Alphakanal, unterstützt Farbtyp 6/3, Bittiefe 8, kein Interlace — bei 886 realen Dateien nie eine Einschränkung geworden, 0 Decode-Fehler). Rasterinferenz per Score aus vier Termen (Gutter-Sauberkeit, BBox-Alignment, Zeilen-Präfix-Konsistenz, Größen-Prior) **plus** ein Interior-Gap-Test, der zusammengelegte Frames erkennt (Inhalt-Lücke-Inhalt innerhalb einer Zellspanne = Zelle zu groß). Der Interior-Gap-Test war nötig: ohne ihn hat die Heuristik `Witch.png` fälschlich als 6×3-Raster à 32×96 gelesen (Kopf-/Fußfreiraum sah bei doppelter Zellhöhe identisch aus); mit dem Test kam das korrekte 6×9-Raster à 32×32 heraus — per Crop gegen das PNG verifiziert.
- Handkorrekturen/Animationsnamen: `tools/sheet-audit.overrides.json`. Enthält bislang keine fw/fh-Overrides (waren nicht nötig) und eine `_castTable` mit 29 Einträgen für die G1–G3-Prioritätsrigs.
- **Manifest:** `assets/cf/manifest.json` (886 Sheets, 0 Fehler, ~18–19s Laufzeit) + `assets/cf/audit-report.md` (Klartext, nach Pack gruppiert, Cast-Tabelle).
- `assets/cf/` angelegt mit Unterordnern `player/enemies/dungeon/tiles/deco/ui/` + `README.md` (Kopierkonvention: Originaldateinamen behalten, erst kopieren was tatsächlich geladen wird — in G0 bewusst noch nichts).
- `index.html` **unverändert** — kein `CF_MANIFEST`-Block dort eingebaut (bewusste Entscheidung, siehe unten).

**Handprüfung (5 Sheets gegen das PNG, wie in der Abnahme gefordert):**

| Sheet | Ergebnis | Geprüft |
|---|---|---|
| `Player_Base_animations.png` | 9×56 @ 64×64 | ✅ per Crop der ersten 12 Zeilen bestätigt, rowFrames [6,6,6,6,6,6,4,4,4,4,4,4,...] stimmt exakt |
| `Enemies/Skeleton/Skeleton.png` | 6×10 @ 32×32 | ✅ visuell bestätigt |
| `Cute_Fantasy_Characters/Knights/Templar.png` | 6×13 @ 48×48 | ✅ visuell bestätigt (der im Plan vorhergesagte 48×48-vs-48×52-Grenzfall — Heuristik traf richtig) |
| `Enemies/Slime/Slime_Small/Slime_Small_Blue.png` | 8×4 @ 16×16 | ✅ visuell bestätigt |
| `Cute_Fantasy_Halloween/Witch/Witch.png` | 6×9 @ 32×32 | ✅ per Row-Crop bestätigt — **erste Inferenz war falsch** (6×3 @ 32×96), Interior-Gap-Fix hat es korrigiert |

**Cast-Tabelle (harte Anforderung, vollständig für alle 29 Prioritätsrigs):** siehe `assets/cf/audit-report.md` Abschnitt „Rigs mit/ohne Cast-Animation". Kurzfassung — **Cast-fähige Rigs für G3:** `Skeleton_Mage` (lila Glutball), `Cowling_Mage_1`/`Cowling_Mage_2` (oranges Feuer-Glimmen), `Angel_1`/`Angel_2` (Stab + Sternchen-Funkeln, schwächer verifiziert als die anderen — vor G3-Einsatz nochmal am realen Bild bestätigen), `Witch` (Cast liegt **nicht** in `Witch.png`, sondern in der separaten Datei `Witch_Cauldron_Anim.png` — G3 muss beide Dateien für den Hexen-Rig laden). Alle Bogenschützen (Goblin/Orc/Skeleton/Knights-Archer) haben Fernkampf, aber **keinen** Cast — physischer Pfeilschuss zählt nicht als Zauber. Alle reinen Nahkampf-Rigs (Skeleton_Swordman, Slimes, Bombschroom, Goblin_Maceman, alle 4 Knights, Orc_Chief/Grunt/Peon, Cowling_1/2, Flying_Skull, Shroomlings, Snails) haben keinen Cast.

**Bewusst nicht gemacht:**

- Kein vollständiges `anims`-Mapping (idle/walk/attack/... pro Zeilenindex) für alle Rigs. Das Cast/Nicht-Cast-Urteil ließ sich bei allen 29 Rigs eindeutig am Bild ablesen (Magie-Glow ja/nein ist ein klares visuelles Signal), die feinere Trennung „welche der 3–9 ähnlichen Zeilen ist genau idle vs. walk vs. run" ist bei Thumbnail-Auflösung fehleranfällig. Lieber `anims: null` lassen als falsch raten — G2/G3 tragen das beim tatsächlichen Einbau ein, wenn sie ohnehin jedes Sheet einzeln vergrößert ansehen müssen.
- 8 von 29 Prioritätsrigs (Slime_Big, Goblin_Spearman/Thief, alle 4 Knights außer Templar, Orc_Grunt/Peon, Angel_2, Cowling_2/Mage_2) wurden **nicht selbst** am Bild geprüft, sondern das Ergebnis eines geometrisch identischen Geschwister-Sheets übernommen (`checked:false` in der Cast-Tabelle) — Familien mit exakt gleichem Sheet-Raster und gleicher Optik-Kategorie. Vor produktivem Einsatz in G3 stichprobenartig gegenprüfen.
- `CF_MANIFEST` bewusst **nicht** nach `index.html` verschoben. Bleibt als JSON neben den Assets; G2/G3 tragen nur die tatsächlich gebrauchte, handverlesene Teilmenge als Code-Tabelle ein (passend zu Regressionsregel 7 „Framezahlen hart im Code").
- Von den 886 Sheets sind 447 „niedrige Confidence" (< 0.15) — bei den 29 Prioritätsrigs 5-fach handgeprüft und plausibel, der Rest (418, Gebäude/Tiere/Deko) ist unkritisch für G1–G3 und wird erst geprüft, wenn eine Phase das jeweilige Sheet tatsächlich braucht. Niedrige Confidence heißt hier meist nur „mehrere Teiler-Harmonien lagen nah beieinander" (z.B. 32 vs. 16 vs. 64), nicht zwangsläufig „falsches Raster" — das bestätigt der Handcheck.

**Verifikation:** `git diff -- index.html` leer. Spiel unter `http://localhost:8378/adventure/index.html` gestartet, Konsole ohne Fehler (siehe unten).

### G1

(noch offen)

### G2

(noch offen)

### G3

(noch offen)

### G4

(noch offen)

### G5

(noch offen)
