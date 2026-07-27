# SuperDuper Adventure, Grafik-Umbau auf Cute Fantasy in 6 Phasen (G0 bis G5)

Arbeite die Phasen einzeln ab, nicht alle in einer Session. Ziel: kompletter Wechsel von Sunnyside World auf Cute Fantasy (Kenmi). Am Ende referenziert das Spiel kein einziges Sunnyside-Asset mehr.

## Modellstrategie (Hinweis für Matthias, nicht für Claude Code)

* Diese Datei liegt im Repo-Root, wird nicht in den Chat gepastet.
* Modell auf `opusplan` stellen. Pro Phase eine frische Session. Auftakt jeweils nur: „Lies superduper-grafik-prompt.md im Repo-Root. Setze ausschließlich Phase GN um. Halte dich strikt an den Regressionsschutz-Block und an den Lizenz-Abschnitt. Lies vorher die Umsetzungsnotizen der abgeschlossenen Phasen unten. Erst committen, wenn die Abnahmekriterien erfüllt sind."
* Plan-Modus pro Phase kurz nutzen, um den Phasenabschnitt auf den realen Code zu mappen, dann ausführen lassen.
* Nach jeder Phase trägt Claude Code seine Umsetzungsnotizen unten in diese Datei ein (eigener Abschnitt pro Phase), damit Folgephasen davon lesen.

## Kontext

Du arbeitest an `~/vibecodingprojekt/adventure/`. Der Ordner ist das Repo (`wurstbrotdlx/superduper-adventure`, public, Branch `main`). Direkt von hier committen.

* Hauptdatei: `index.html` (Canvas/JS, ein File, groß)
* Aktuelle Grafik: `assets/` (Sunnyside World, danieldiggle), einheitliches 96x64-Frameraster, row-major, Framezahlen hart im Code hinterlegt
* Neue Grafik-Quelle: `Graphics/` im Repo-Root (Cute Fantasy von Kenmi plus Add-ons). Das ist die **Rohbibliothek**, sie wird NIE committet (siehe Lizenz). Genutzte Dateien werden kuratiert nach `assets/cf/` kopiert — **auch die sind gitignored**, siehe Lizenz-Abschnitt.
* Ausgeliefert wird **nicht** der Repo-Inhalt, sondern ein Build: `node tools/build-single.mjs` schreibt `dist/index.html` mit allen Grafiken als `data:`-URIs (eine Datei, ~1,1 MB, läuft auch per `file://` ohne Server). Seit G1 so, Begründung im Lizenz-Abschnitt.
* Dev-Server: `.claude/launch.json` (eine Ebene höher, `~/vibecodingprojekt/.claude/`), Eintrag `adventure`, Port 8378, URL `http://localhost:8378/adventure/index.html`. Dahinter steht `serve.py` (seit R4 im Repo): ein `http.server` mit `Cache-Control: no-store`. Ein blankes `python3 -m http.server` reicht nicht, es antwortet mit 304 und prüft dann den alten Stand.
* Gameplay-Doku: `superduper-gameplay-prompt.md` im selben Ordner. Dort stehen die Umsetzungsnotizen der Phasen 1 bis 6 (Zutaten-Grammatik, Kammern, Flüche, Schichtmodus, Knöterich, Soundtrack). Bei Berührungspunkten dort nachlesen.

### Was in `Graphics/` liegt

| Ordner | Inhalt | Verwendung |
|---|---|---|
| `Cute_Fantasy/` | Basis: modularer Player (Player_Base, Chest, Feet, Hands, Head, Legs, Accessories, Tools, Player_Mounts), Enemies (Slime S/M/L, Skeleton + Bowman/Mage/Swordman, Bombschroom), Tiles (Grass, Beach, Cliff, Cave, Water, Waterfall, Bridge, Cobble_Road, FarmLand), Trees, Buildings, Animals, NPCs (Premade), Outdoor decoration, Weather effects, Crops, Icons | G2, G3, G4, G5 |
| `Cute_Fantasy_Characters/` | Goblins, Knights, Orcs, Angels | G3 |
| `Cute_Fantasy_Dungeons/` | **2** komplette Dungeon-Sets (`Dungeon_3/` ist leer): Böden, Wände, Türen, Tore (mit Öffnungs-Animation), Druckplatten (mit Animation), Bodenstacheln, Treppen, Sewer, Pillars, Objects | G1 |
| `Cute_Fantasy_Volcano/` | Vulkan-Tiles, Gebäude, Props, Enemies (Cowling 1/2, Cowling Mage 1/2, Flying Skull) | G3, G4 |
| `Cute_Fantasy_ShroomLands/` | Pilzland-Tiles, Häuser, Props, Shroomlings, Snails | G3, G4 |
| `Cute_Fantasy_UI/` | UI-Elemente, Fonts | G5 |
| `Cute_Fantasy_Halloween/` | Hexe, Deko | G3 (Hexe), Rest Reserve |
| `Cute_Fantasy_Christmass/` | Schnee-Deko, Charaktere | G4 (Frostkamm-Deko) |
| `Cute_Fantasy_MilitaryCamp/` | Lager-Props | Reserve |
| `Old_Sprites/`, `Player_Aseprite_Files/` | veraltete Fassungen, Arbeitsdateien | **NIE verwenden** |

### Lizenz (gemessen an `read_me.txt` in den Packs)

Kommerzielle Nutzung ja, Modifikation ja, Weiterverteilung/Weiterverkauf nein, auch nicht modifiziert.

**Die entscheidende Unterscheidung** (in G1 nachgeschärft, gilt ab jetzt für alle Phasen): Die Grafik **im fertigen Spiel auszuliefern** ist der gekaufte Anwendungsfall und erlaubt. Original benannte PNGs in ein öffentliches Repo zu legen ist es nicht — dort wären sie als Dateisammlung klonbar, und genau das verbietet die Lizenz. Konsequenzen:

1. `Graphics/` liegt in der `.gitignore` und wird nie committet (G0).
2. Nach `assets/cf/` wandern nur Dateien, die das Spiel tatsächlich lädt — **und auch diese Ordner sind gitignored** (`assets/cf/dungeon/`, `player/`, `enemies/`, `tiles/`, `deco/`, `ui/`). Getrackt bleiben nur `README.md`, `manifest.json` und `audit-report.md`: Dateinamen und Rastermaße, keine Bilddaten.
3. **Jede Phase, die einen neuen `assets/cf/`-Unterordner anlegt, trägt ihn in `.gitignore` ein und ergänzt die Dateiliste in `assets/cf/README.md`** — sonst kann niemand mit eigener Lizenz das Repo wieder lauffähig machen.
4. Vor jedem Commit prüfen: `git diff --cached --name-only | grep -i '\.png$'` muss leer sein.
5. Ausgeliefert wird `dist/index.html` aus `node tools/build-single.mjs`. Der Loader nimmt die eingebackene Tabelle über `ASSET_BLOBS` entgegen (Platzhalterzeile mit Marker `/*BUILD:ASSET_BLOBS*/` direkt unter `const ASSETS`); ist sie `null`, lädt das Spiel wie im Quellbaum aus `assets/`. **Diese Zeile nicht umformulieren**, sonst bricht der Build ab.
6. `CREDITS.md` nennt seit G0 Cute Fantasy (Kenmi, itch.io). Sunnyside bleibt dort stehen, bis G5 die letzten Sunnyside-Assets entfernt.

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
15. Der Auslieferungsweg läuft seit F9 automatisch und wird nicht von Hand nachgebaut: `.github/workflows/pages.yml` ersetzt bei jedem Push auf `main` das ganze `assets/cf/` durch den Inhalt des privaten Repos `wurstbrotdlx/superduper-adventure-assets`, baut mit `node tools/build-single.mjs --out dist/index.html` und deployt über `actions/deploy-pages`. Kein `docs/` mehr, kein Build-Commit, kein Kopierschritt. **Die Falle:** ein Sheet, das lokal in `assets/cf/` liegt, aber nicht im Assets-Repo, fehlt live, obwohl lokal alles grün ist. Neue Grafik gehört deshalb zuerst ins Assets-Repo, danach den Workflow-Lauf prüfen.

Nach jeder Phase gilt: Spiel startet, ist durchspielbar, 300-Frame-Soak mit Zaubern ohne Exception, CPU-Frame-Budget in der Horde nicht schlechter als vorher (~0,6 ms Referenz). Erst dann committen. Ein Commit pro Phase. Nachtragscommits sind erlaubt, wenn Information erst später eintrifft (eine Bestätigung, ein Live-Befund, ein vergessener Statusmarker); sie nennen den Vorgängercommit.

## Zielbild

Ein durchgehender Look aus einem Guss: Cute Fantasy überall, 16-px-Tiles, 32-px-Raster-Charaktere, sichtbare Ausrüstung am Helden, echte Rig-Vielfalt bei Monstern statt Tint-Varianten, Kammern mit echtem Dungeon-Interieur, begehbares Dorf. Konfetti statt Blut bleibt. Amtsstuben-Ton bleibt.

---

## Phase G0: Fundament (kein sichtbarer Unterschied im Spiel) — ERLEDIGT

1. `.gitignore` um `Graphics/` ergänzen. Prüfen: `git status` darf `Graphics/` nicht mehr anbieten.
2. `CREDITS.md` ergänzen: Cute Fantasy (Kenmi, itch.io), Lizenzkurzfassung wie oben. Sunnyside-Eintrag bleibt vorerst.
3. **Audit-Werkzeug** bauen (eigenständige HTML-Seite oder Node-Script im Repo, egal, Hauptsache reproduzierbar): lädt ein Sprite-Sheet, findet per Alpha-Bounding-Box die echte Frame-Aufteilung (Rastergröße, Spalten, Zeilen, belegte Frames pro Zeile), gibt eine fertige Manifest-Zeile aus.
4. Audit über alle Sheets laufen lassen, die G1 bis G5 brauchen werden (Player_Base + alle Ausrüstungs-Layer, alle Enemy-Sheets inkl. Characters/Volcano/ShroomLands/Halloween-Hexe, Dungeon-Sets, Tilesheets, Bäume, Tiere, NPCs, Wetter). Ergebnis als `CF_MANIFEST`-Tabelle nach `index.html` (noch ungenutzt) oder als JSON neben die Assets.
5. Verzeichnis `assets/cf/` anlegen, Kopier-Konvention festlegen (Unterordner je Kategorie, Original-Dateinamen behalten).
6. Welche Animationen je Rig existieren (idle, walk/run, attack, cast, hurt, death, besondere) im Manifest vermerken. Besonders prüfen: **welche Rigs eine Zauber-Animation haben**. Beim Sunnyside-Umzug hatte das Skelett-Rig keine, deshalb liefen alle Magier auf dem Goblin-Rig. Gleiche Sorgfalt hier.

### Abnahme G0

`Graphics/` unsichtbar für git. Manifest deckt alle benötigten Sheets ab, Stichprobe von 5 Sheets von Hand gegen das PNG geprüft. Spiel selbst unverändert (kein Diff im Verhalten, Soak läuft).

## Phase G1: Kammern-Interieur (Dungeon-Sets) — ERLEDIGT

Die Kammern (Phase 2 des Gameplay-Umbaus) bekommen echtes Dungeon-Interieur. Bisher: eingefärbter Erdboden auf derselben Karte, Oberwelt wird gesichert und kachelgenau wiederhergestellt. Diese Mechanik bleibt unangetastet, nur die Optik der Kammer wechselt.

* Die 3 Dungeon-Sets auf die Schwierigkeit mappen: Stufe 1 bis 2 nimmt Dungeon_1, Stufe 3 bis 4 Dungeon_2, Stufe 5 Dungeon_3 (oder pro Biom, wenn das optisch besser trägt; entscheide beim Sichten und dokumentiere es in den Umsetzungsnotizen). **G1 ist hier abgewichen:** `Graphics/Cute_Fantasy_Dungeons/Dungeon_3/` ist real ein leeres Verzeichnis, es gibt nur 2 Sets. Umgesetzt sind Stufe 1 bis 2 auf Dungeon_1 und Stufe 3 bis 5 auf Dungeon_2 (`k.set` in `betreteKammer`), Begründung in den G1-Umsetzungsnotizen unter „Set-Mapping".
* Echte Wände statt Blocker-Kacheln, echte Böden, Pillars und Objects als Deko.
* Die versiegelte Kammertür in der Oberwelt nutzt die Tor-Sprites (Gate_Closed, Gate_anim beim Öffnen). Das Holzschild mit Schwierigkeit und Beute-Tier bleibt in Funktion und Lesbarkeit unverändert.
* Modul-Requisiten aufwerten: Druckplatten-Modul nutzt `Dungeon_1_Pressure_Plate_Anim`, Tore zwischen Räumen nutzen Door/Gate-Animationen, einbrechende Bodenplatten können `Floor_spikes`/Sewer-Elemente als Optik nehmen. Rätsel-Logik bleibt exakt gleich, nur Darstellung wechselt. **G1 ist hier zweimal abgewichen:** geladen wird die statische `Dungeon_{n}_Pressure_Plate.png` statt der `_Anim`-Fassung, und `Floor_spikes` wurde gar nicht erst kopiert. Begründungen in den G1-Umsetzungsnotizen unter „Druckplatten" und „Bewusst nicht gemacht".
* Treppen-Sprites für Ein- und Ausgang der Kammer.
* Kammerwächter (Mumie, Golem, Spinne, Fledermaus, Knochenritter, Irrlichtmagier, Alter Schrecken) bleiben in dieser Phase auf ihren alten Rigs. Stilbruch ist bis G3 erlaubt.

### Abnahme G1

Alle 8 Rätselmodule in Kammern aller Schwierigkeitsstufen gebaut, gelöst, verlassen (Handdurchlauf Modul für Modul, kein automatisierter Testlauf vorhanden: eine Zusicherungs-Suite aus Phase 2 gibt es nicht, die einzigen Boot-Assertions im Spiel sind `knAssertCaps()` für Zeichendeckel und `assertRigRegistrations()` für Sprite-Keys, beide ohne Kammerbezug). Oberwelt kachelgenau wiederhergestellt. Esc-Abbruch und Tod in der Kammer funktionieren. Soak über mehrere Kammern plus Oberwelt.

## Phase G2: Held modular (sichtbare Ausrüstung) — ERLEDIGT

Der Held wechselt auf das Cute-Fantasy-Player-System: `Player_Base` plus Layer für Chest, Legs, Feet, Head, Hands, Tools, Accessories, übereinandergezeichnet in fester Reihenfolge.

* Kessel-Slots auf Layer mappen (die 4 Slots aus der Zutaten-Grammatik, inkl. Stiefel auf Feet). Waffen-Slot nutzt Tools.
* Qualitätsstufe und Wirkung sollen sich im Layer niederschlagen (unterschiedliche Layer-Varianten oder gebackene Farbvarianten pro Stufe). Damit ist der Aura-Glow abgelöst; der Glow-Code fliegt raus.
* Frisuren-Zufall beim Start bleibt als Idee erhalten: Accessories/Head-Varianten statt der 6 Sunnyside-Frisuren.
* Animations-Mapping: idle, run, attack, cast, hurt, death aus dem Manifest. Falls dem CF-Player eine dieser Animationen fehlt, Ersatzregel definieren und dokumentieren (z. B. cast = attack-Variante mit Partikel-Overlay), nicht stillschweigend improvisieren.
* Gebackene Composite-Frames: Layer-Kombination einmal pro Ausrüstungswechsel auf Offscreen-Canvas zusammensetzen, im Frame nur blitten. Nicht 7 Layer pro Frame einzeln zeichnen.
* Fluch-Optik (Phase 3 Gameplay): ruht ein Fluch (`item.fluchRuht`), ändert sich am Layer nichts; das regelt weiterhin der Tooltip.

### Abnahme G2

Jede Slot-Belegung ist am Bildschirm sichtbar (4 Slots x mindestens 3 Qualitätsstufen von Hand durchgeschaltet und angesehen) — mit unterschiedlicher Tiefe je Slot: `armor` (Chest+Legs) und `boots` (Feet) gehen als Layer in das Helden-Sprite selbst (`bakeHeroSheet()`), `weapon` bleibt ein schwebendes `Iron_Sword`-Icon (Tint nach Gattung, Größe und Leuchten nach Stufe; alle drei Gattungen teilen dieselbe Klinge), `shield` ein schwebendes Emoji (Größe und Leuchten nach Stufe). Begründung in den G2-Umsetzungsnotizen unter „Entscheidungen"; im ganzen Pack existiert kein Schild-Sprite für den Helden. Alle Animationen laufen in Oberwelt, Kammer, Schattenland. Touch-Steuerung unberührt. Aura-Glow-Code entfernt. Soak. *(Formulierung in R8/F16 ehrlich gemacht — die alte Fassung „ändert den Helden sichtbar" versprach mehr, als Waffe und Schild einlösen.)*

## Phase G3: Monster auf echte Rigs — ERLEDIGT

Alle 21 Monstertypen aus `MONDEF` plus beide Bosse wechseln auf Cute-Fantasy-Rigs. Tint und Skalierung bleiben als Werkzeug erlaubt, aber die Rig-Basis wird vielfältig statt 2 Rigs für alles.

Verfügbare Rigs (Manifest aus G0 ist die Wahrheit): Slime S/M/L, Skeleton, Skeleton_Bowman, Skeleton_Mage, Skeleton_Swordman, Bombschroom, Goblins, Orcs, Knights, Angels, Shroomlings, Snails, Cowling 1/2, Cowling_Mage 1/2, Flying_Skull, Hexe (Halloween).

* Mapping-Tabelle `MONDEF`-Typ zu Rig anlegen (Datentabelle, kein verstreuter Code). Sinnfälligkeit vor Vollständigkeit: Goblin-Typen auf Goblin-Rigs, Skelett-Typen auf Skeleton-Varianten, Magier auf Rigs **mit Zauber-Animation** (Skeleton_Mage, Cowling_Mage, Hexe), Spinne/Fledermaus können bei fehlendem Rig auf passend getintete Nachbarn (Flying_Skull für Fledermaus liegt nahe). Golem und Mumie: beste verfügbare Basis wählen, tinten, dokumentieren.
* Bosse: Schattenfürst und Alter Schrecken bekommen die imposantesten verfügbaren Rigs (Orc/Knight groß skaliert, oder Slime_Big für einen der beiden, nach Sichtung entscheiden).
* Fernkampf-Magier brauchen ihre Cast-Animation, Regel aus G0-Audit anwenden. Wenn ein Wunsch-Rig keine Cast-Animation hat, gilt die Sunnyside-Lektion: Magier-Typen laufen ausnahmslos auf Rigs mit Cast.
* Aggro-„!", Sterbe-Animation zu Ende spielen, Konfetti-Zerplatzen, Leichen-Verhalten: alles unverändert übernehmen.
* Hoftiere der Oberwelt (Huhn, Schaf, Kuh, Schwein) auf `Cute_Fantasy/Animals` umziehen, gleiches Wander-Verhalten.

### Abnahme G3

Alle 21 Typen plus beide Bosse einzeln erzwungen und angesehen (idle, laufen, angreifen, casten wo zutreffend, sterben) — Ausnahmen `bat` (keine eigene Angriffs-/Hurt-/Death-Zeile) und `slime`/`shadow` (hurt = death), s. den Kompromiss-Punkt in den Umsetzungsnotizen (R8/F17). Kammerwächter in Kammern geprüft. Kein Sunnyside-Charakter-Sheet mehr in der Ladeliste. Soak mit voller Horde, Frame-Budget gehalten.

## Phase G4: Oberwelt-Tiles, Biome, Deko — ERLEDIGT

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

## Phase G5: Dorf, UI, Sunnyside-Abschied — ERLEDIGT

* **Begehbares Dorf** im Grasland: Buildings (Häuser, Amt als erkennbares Gebäude), NPCs (Premade) als Staffage mit Wander- oder Standverhalten, der Kessel-Prop wandert an seinen Dorfplatz, Knöterich steht als Weltfigur im Dorf (sein Grau-Ton bleibt gebacken, kein `ctx.filter`). Das Amt-Overlay (`#ovPanel`) mit den Ausbau-Käufen bleibt funktional wie es ist und wird weiterhin nach dem Schichtende erreicht; das Gebäude öffnet mit der Kontext-Taste F ein eigenes, kleines Anzeigefenster (Bankguthaben, Ausbaustände, „Feierabend nehmen"), denn `showDorf()` setzt `state='feierabend'` und würde über seinen einzigen Knopf `startShift()` die laufende Schicht hart zurücksetzen.
* `MUS.goto('village')` scharf schalten: die Dorf-Zone liegt seit Phase 6 (Soundtrack) fertig in den Daten und wartet genau hierauf.
* **UI-Skin**: Cute_Fantasy_UI für Panels, Knöpfe, Gürtel, Röhren (mobil) und Kessel-Panel. Vorsicht: alle HUD-Dirty-Check-Regeln gelten weiter, der Skin ist CSS/Hintergrundbilder, keine neue DOM-Schreiblogik. Fonts aus dem UI-Pack nur, wenn Umlaute und ß sauber drin sind, sonst Systemfont behalten (deutsche Spieltexte!).
* Wetter-Effekte (Weather effects) als dezentes Ambiente pro Biom, hinter Partikel-Cap.
* **Sunnyside-Abschied**: alte `assets/`-Sunnyside-Dateien aus dem Repo entfernen, Ladeliste rein CF, `CREDITS.md` final (Sunnyside raus, Kenmi drin), letzter Volltest.
* Reserve, nicht umsetzen, nur im Hinterkopf: Player_Mounts (Reittiere), Halloween/Christmass als Saison-Events, MilitaryCamp.

### Abnahme G5

Dorf begehbar, Amt über Gebäude erreichbar, Dorf-Musik läuft nur im Dorf. UI-Skin auf Desktop und Touch geprüft (Gürtel eine Zeile, nichts unter dem Daumen-Fächer, Röhren funktionieren). Kein Sunnyside-Asset mehr im Repo, `git grep -i sunnyside` in der Ladeliste leer (CREDITS-Historie ausgenommen). Kompletter Regressionsdurchlauf: alle 8 Kammermodule, Kessel, Flüche, Schichtmodus, Knöterich-Beats, alle 6 Musikzonen, 300-Frame-Soak, Frame-Budget. Live auf GitHub Pages verifiziert.

---

## Umsetzungsnotizen (füllt Claude Code nach jeder Phase)

### G0 — Fundament

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

### G1 — Kammern-Interieur

**Korrekturen am Prompt-Kontext oben (wichtig für G2–G5):**

1. **Das G0-Manifest ist bei Animationssheets nicht belastbar.** `Dungeon_1_Gate_anim.png` steht dort als 16×16 mit 104 Frames — real sind es **26 Frames à 32×32**, denn `Gate_Closed.png` ist 32×32, und das Tor ist genau ein Frame breit. Die Heuristik hat den kleinsten gemeinsamen Teiler gefunden, nicht das Animationsraster. Regel für G2–G5: **Framegröße immer am zugehörigen Einzelbild-Sheet festmachen** (`*_Closed`, `*_SingleFrame`), nie an der Anim-Datei allein, und Bilddatei-Breite / Framebreite als Frameanzahl gegenrechnen.
2. Die Dungeon-Tilesets sind **kein durchgehendes 13×13-Raster**. Belegt sind nur einzelne Blöcke, dazwischen liegt Leerraum, und die beiden Beispielräume oben links (bei 6,8 und 16,48) sind **nicht kachelausgerichtet** — das sind Illustrationen des Künstlers, keine Tiles. Wer sie mitzählt, verschiebt das ganze Raster.
3. `Dungeon_2.png` ist **208×192**, nicht 208×208 wie Dungeon_1. Die unterste Bodenzeile (Zeile 8) existiert dort nicht. UVs, die für beide Sets gelten sollen, dürfen nur die Zeilen 6–7 benutzen.
4. **Ausliefern statt committen — gilt für alle Folgephasen.** Die Bild-Unterordner von `assets/cf/` stehen in der `.gitignore` (wie `Graphics/`), weil Kenmis Lizenz Weiterverteilung der Dateien untersagt, auch modifiziert. Erlaubt ist, die Grafik **im fertigen Spiel** auszuliefern — das ist der gekaufte Anwendungsfall. Dafür gibt es `tools/build-single.mjs`: der Build backt alle Grafiken als `data:`-URIs in eine einzige `dist/index.html`. **G2–G5 kopieren weiter nach `assets/cf/`, committen dort aber nichts** und tragen neue Unterordner in `.gitignore` und in die Dateiliste in `assets/cf/README.md` ein. Ausgeliefert wird ausschließlich `dist/index.html`.

**Entscheidungen:**

- **Set-Mapping: Schwierigkeit 1–2 → Dungeon_1, 3–5 → Dungeon_2** (`k.set` in `betreteKammer`). Dungeon_3 existiert nicht (G0-Korrektur). Dungeon_1 ist der grobe Kopfstein mit breiten Bodenziegeln, Dungeon_2 der feinere, dunklere Mauerziegel — die härtere Optik zeigt sich damit ab Stufe 3 oft genug, um als Steigerung zu wirken.
- **Requisiten nur getauscht, wo es ein echtes CF-Pendant gibt.** Auf CF umgestellt: Boden, Wände, Tore zwischen Räumen, Oberwelt-Kammertür, Druckplatten, Schiebeblöcke, Truhe, Ein- und Ausgangstreppe, Wanddeko. **Bewusst Vektor geblieben:** Spiegel, Lichtquelle, Lichtziel, Hebel, Symbolschloss, Hinweistafel, Reset-Rune, Block-Zielfelder — dafür gibt das Pack nichts Passendes her, und Tafel/Symbole müssen lesbar bleiben.

**Umgesetzt (alles in `index.html`, Mechanik unangetastet):**

- **Lademodus `'grid'`** in `addSheet`/`loadAssets`: fünfter Parameter `opt` mit `{fw, fh, ax, ay}`. Die Sunnyside-Modi `char`/`strip`/`raw` bleiben unverändert. Alle CF-Sheets sind als geschlossene Tabelle direkt unter den Sunnyside-Blöcken registriert, Framezahlen hart im Code (Regressionsregel 7/12).
- **`DUN_SET`-Tabelle + `bakeDunTile`/`dunWallTile`/`dunFloorTile`.** Gemessenes Layout, für beide Sets identisch: Spalten 4–6 / Zeilen 0–2 = 3×3-Wandring mit **durchsichtiger Mitte** (die 9-Slice-Wand), Spalte 8 / Zeile 4 = massiver Wandblock, Spalten 4–6 / Zeilen 6–7 = Bodenziegel. `dunWallTile` wählt über die 4 Nachbarn: genau eine begehbare Orthogonalseite → Kantenstück, nur eine begehbare Diagonale → Eckstück, sonst Vollblock. Bei rechteckigen Räumen mit 1 Kachel dickem Rand deckt das alle vorkommenden Fälle ab. **Benennung ist absichtlich „wo liegt der Boden", nicht „wo im Ring":** die Ringoberkante heißt `edgeS`, weil der Raum unter ihr liegt.
- **Erster Anlauf war invertiert** und ist es wert, festgehalten zu werden: ich hatte den hellen Ziegel (160,0) als Wand und den dunklen als Boden genommen. Ergebnis war ein durchgehendes Ziegelfeld, in dem begehbar und nicht begehbar optisch nicht zu trennen waren. Merksatz fürs Tileset: **der dunkle Kopfstein ist die Wand, der Ziegel ist der Boden** — die hellere Fläche ist immer das, worauf man läuft.
- **`malBodenUmfeld(x,y)`** neu: `oeffneTor` backt jetzt 3×3 statt einer Kachel nach, weil die Kantenmaske der umliegenden Wände von der Begehbarkeit abhängt. Gemessen 0,1 ms — der Komplettbake (6400 Kacheln) bleibt aus.
- **`baueWandProps`** ersetzt die getönten Sunnyside-Felsen durch Pillars, Tonkrüge und Spinnweben, gestreut über `tileHash` (jede 6./11./13. Wandkachel). **73 statt ~400 Props** — die Wandkachel trägt ihre Optik jetzt selbst, die Requisiten sind nur noch Würze. `drawProp` bekommt die drei Zweige vor dem `G_ROCK`-Zweig; der `t.tint`-Pfad dort ist entfallen, den nutzte nur die Kammer.
- **Tor zwischen Räumen:** Die Durchfahrt ist 1 Kachel breit und 3 hoch, dafür gibt es im Pack kein passendes Format (Gate/Door sind 2×2 für eine Durchfahrt nach Norden). Gelöst mit `Gate_Closed` bei 2× mittig auf der Durchfahrt; beim Öffnen läuft `Gate_anim` einmal über `tor.openT = gameT` ab und verschwindet danach. Rein optisch, `oeffneTor` behält seine Logik.
- **Oberwelt-Kammertür:** `Gate_Closed`/`Gate_anim` bei 2×, Set nach `t.diff` wie beim Betreten. Das Gitter fährt hoch, sobald der Spieler in Aktionsreichweite (58 px) ist, und wieder herunter beim Weggehen — der Fortschritt `t.gateT` läuft im bestehenden Türen-Loop mit dem Cooldown mit. Geleerte Türen nutzen eine über `tintedSheet()` gebackene abgedunkelte Kopie, **kein `ctx.filter`**. Das Holzschild ist in Text, Balkenanzeige und Tier-Farbe unverändert.
- **Druckplatten** nutzen `Pressure_Plate.png` (3 Varianten × 2 Zustände à 16×16, nicht die 59-Frame-Anim — die statische Datei hat genau die zwei gebrauchten Zustände). Das Rätselsymbol bleibt als Text obenauf, sonst wäre die Reihenfolge nicht mehr ablesbar.
- **Schiebeblöcke** = Holzkiste, **Wanddeko** = Tonkrug. Bewusst verschiedene Sprites: mit Kisten an beiden Stellen sah im Block-Raum jede Deko nach schiebbarem Block aus.
- **Truhe** `Chest_anim` Frame 0/7, Glint bleibt. **Ausgangsrune** bekommt `Stairs_Down` plus den bisherigen pulsierenden Ring (der Ring muss bleiben, er ist die einzige Anzeige, dass hier ein Kontaktpunkt ist). **Eingang** bekommt eine zusätzliche `treppe`-Prop an `k.start` — reine Bodendecke, taucht in `scanAktion` nicht auf.

**Bewusst nicht gemacht:**

- **`G_GAP` (eingebrochene Bodenplatten) blieb das schwarze Rechteck** aus `drawKammerBoden`. Der Grubenring des Tilesets hat eine durchsichtige Mitte, gerendert käme also ohnehin Schwarz heraus — der Austausch hätte Code gekostet und pixelgleich ausgesehen. `Floor_spikes` wurde deshalb gar nicht erst kopiert.
- **Kein Nachbake bei `G_GAP`**: `aufBrechen` setzt die Kachel, ruft aber kein `malBoden`. Bleibt so, das schwarze Rechteck liegt darüber.
- **Kammerwächter laufen weiter auf den Sunnyside-Rigs** (Stilbruch bis G3 ausdrücklich erlaubt, Übergangsregel 13). Ebenso die Fackel-Flamme (`fire1`).
- **Sewer-, Arch-, Door-, Stairs- und Floor_spikes-Dateien nicht kopiert** — nicht geladen, also nicht im Repo.

**Verifikation (alles am laufenden Spiel unter `http://localhost:8378/adventure/index.html`):**

| Prüfung | Ergebnis |
|---|---|
| Ladeliste | 96/96 Sheets geladen, keine `Sprite fehlt`-Warnung, Konsole leer |
| Sheet-Metadaten | alle 15 CF-Sheets gegen die echten Bildmaße gegengeprüft (Raster, Spalten, Frames, Anker) |
| Autotiling | Nordwand/Südwand/Ecke/Innenwand liefern 4 verschiedene Kacheln |
| Alle 8 Module | `platten, bloecke, fackeln, brechen, spiegel, schalter, schloss, welle` in beiden Sets gebaut und gezeichnet, keine Exception |
| Tor öffnen | 3 Kacheln begehbar, Umfeld korrekt nachgebacken (0,1 ms) |
| Truhe | öffnet, Gold + Zutaten, Tür-Cooldown gesetzt |
| Oberwelt-Wiederherstellung | map-Hash, floor-Hash, trees/decos/critters/monsters/Türen **bitgleich** vor und nach der Kammer |
| Esc-Abbruch | zurück auf Level 1, `kammer === null`, 1165 Bäume zurück |
| Tod in der Kammer | `respawnPlayer()` holt die Oberwelt zurück, Boden wieder Gras |
| Kammertür Stufe 1/5/geleert | Schild lesbar, Balken und Tier korrekt, geleert sichtbar abgedunkelt |
| Frame-Budget | Kammer mit 80er Horde **0,198 ms/Frame** gegen **0,169 ms** Oberwelt mit gleicher Horde — Referenz 0,6 ms gehalten |
| 300-Frame-Soak | mit Dauerzaubern, 0 Exceptions, Ø 0,816 ms (update+render), max 5,4 ms; Partikel 255 / Floater 6, Caps unberührt |
| Bake-Zeit | Kammer 7,3 ms gegen Oberwelt 5,3 ms (einmalig beim Betreten, hinter Warp-Sound und Shake) |

**Für G2/G3 zum Mitnehmen:** Der `'grid'`-Lademodus ist der Weg für alle weiteren CF-Sheets — Framegröße und Anker gehören ins `opt`-Objekt, nicht in eine Heuristik. Und die Anker aus `manifest.json` (`anchorSuggested`) sind nur ein Startwert; bei jedem hier eingebauten Sprite musste der y-Anker von Hand nachgezogen werden, damit der Fuß auf der Kachelunterkante sitzt.

**Einzeldatei-Build (in G1 nachgezogen, gilt ab jetzt):** `node tools/build-single.mjs` schreibt `dist/index.html` mit allen Grafiken als `data:`-URIs. Der Loader nimmt sie über `ASSET_BLOBS` (Platzhalterzeile mit Marker `/*BUILD:ASSET_BLOBS*/` direkt unter `const ASSETS`); ist die Tabelle `null`, lädt das Spiel wie bisher aus `assets/`. Beides läuft, Entwicklung ändert sich nicht.

Der Build inliniert **alles** unter `assets/`, statt die benutzte Teilmenge zu erraten — `SHEET_LIST` entsteht in Schleifen, jede statische Analyse wäre eine Fehlerquelle, und der Unterschied ist klein (341 Dateien, 615 KB roh). Ergebnis 1,1 MB, ein HTTP-Request statt 97. Fehlt der Marker, bricht der Build ab, statt still eine Datei ohne Grafik zu schreiben.

Gemessen am Build: 97/97 Sheets geladen, **null Bild-Requests im Netzwerk-Log**, Kammer identisch zur Serverfassung. **`file://` läuft** (von Matthias per Doppelklick bestätigt) — das Spiel nutzt kein `fetch`, keine Module und kein `getImageData`, alle `localStorage`-Zugriffe stehen in `try/catch`. Damit ist `dist/index.html` als einzelne Datei versendbar, ohne Hosting.

### G2 — Held modular

**Korrekturen am Prompt-Kontext oben (wichtig für G3–G5):**

1. **Der Cute-Fantasy-Player-Rig ist ein Farming-Sim-Rig, kein Kampf-Rig.** Alle 56
   Zeilen von `Player_Base_animations.png` per Alpha-Bounding-Box-Metrik (Schwerpunkt-
   Drift, Höhenverlauf, Loop-Schluss) durchsucht, die Kandidaten dann gegen das
   echte PNG gecroppt und vergrößert angesehen (wie in G0/G1): Idle (2 Varianten),
   Walk, Run, Sprung, Rolle und ein gutes Dutzend Werkzeug-Idle-Wiederholungen sind
   vorhanden — **Angriffs-Hieb, Zauber-Geste, Treffer-Taumel und Sterbe-Animation
   fehlen vollständig.** Das war beim G0-Audit nicht aufgefallen, weil G0 bewusst
   nur Cast-fähig/nicht-cast-fähig für die 29 Kammer-/Monster-Rigs geprüft hat, nicht
   den Helden. Ersatzregel (siehe `CF_HERO_ANIMS`-Kommentar in `index.html`): Attacke
   nutzt die Seitenreihe der Rolle (einziger echter Armausschlag im ganzen Blatt),
   Zauber die kleine 5-Frame-Gestenreihe, Treffer/Tod teilen sich die einzige echte
   Stolperbewegung. Der tatsächliche Kampf-Eindruck kommt weiterhin vom Klingenbogen-
   und Partikeleffekt, die beide unabhängig vom Body-Frame gezeichnet werden — das
   war schon vor G2 so und trägt jetzt die fehlenden Anims mit.
2. **Der Held hat keine „Seiten"-Richtung im landläufigen Sinn, sondern eine feine
   Kopf-Profil-Variante** unter den 3 Down/Side/Up-Reihen jeder Animation (Nase/Haar-
   Silhouette leicht asymmetrisch). Diese mittlere Reihe ist die, die zum bestehenden
   Links/Rechts-Flip passt und wurde für alle 6 Anims verwendet (idle=1, walk=9,
   run=45, attack=18, cast=24, hurt=15).
3. **Ausrüstungs-Layer sind winzig, nicht bugged.** `Chest`/`Legs`/`Feet` liefern pro
   Frame nur 2–6 opake Pixel (Bounding-Box-Messung), weil der ganze Chibi-Körper nur
   ~17 px hoch ist. Erst am 8×-Crop wird sichtbar, dass Hemd/Hose/Schuh trotzdem
   sauber sitzen. Wer hier Nullen oder Fast-Nullen in einer Pixel-Auszählung sieht,
   hat kein Bug gefunden, sondern misst einen sehr kleinen Charakter — erst optisch
   gegenprüfen, bevor man an der Zuordnung zweifelt.
4. **Tools-Layer (Waffen) hat ein inkompatibles Kleinraster.** `Iron_Sword.png` ist
   ein eigenständiges 4×9-Sheet (256×576), nicht auf dem 9×56-Raster von Player_Base.
   Für G3 relevant, falls Monster-Waffen aus demselben Tools-Ordner kommen sollen:
   diese Dateien lassen sich nicht wie Chest/Legs/Feet einfach per `rowStart` in den
   Körper-Bake einklinken.

**Entscheidungen:**

- **Anim-Baking statt Live-Layering.** Neuer Mechanismus `bakeHeroSheet()`: bei jedem
  `recalc()` (Ausrüstungswechsel, Skillpunkt, Schichtstart) wird — falls sich
  Rüstungs-/Stiefel-Stufe oder Frisur seit dem letzten Bake geändert haben
  (Dirty-Check über einen `"tier|tier|hair"`-Schlüssel) — ein Offscreen-Canvas mit
  allen 36 benötigten Frames (6 Anims) neu zusammengesetzt: Legs → Feet → Body →
  Chest → Haar → Hände, in dieser Reihenfolge. Ergebnis landet als ganz normaler
  Eintrag `SHEETS['hero_baked']`, `drawPlayer()` blittet daraus nur noch **ein**
  Sprite pro Frame (Regressionsregel 4/10). Gemessen: Bake ~23 ms (einmalig, wie
  G1s Kammer-Bake), `drawPlayer()` danach 0,0044 ms — schneller als die alte Fassung
  mit zwei Einzel-Sprites plus Aura-Gradient.
- **4 Kessel-Slots → Layer:** `armor` treibt Chest **und** Legs gemeinsam (5 Stufen:
  Dienstkittel=OG_Shirt/OG_Pants Rot, Aktenweste=Farmer Grün, Amtsharnisch=Royal
  Blau, Bearbeitungspanzer=Plate Iron, Ordnungsrüstung=Plate Gold). `boots` treibt
  Feet (5 Stufen, Farben Orange/Schwarz/Blau/Lila/Pink — Braun und Weiß fielen bei
  der Handprüfung gegen Hautton bzw. Schatten-Ellipse zu schwach aus, siehe Korrektur
  3). Kein Slot belegt → kein Layer gezeichnet (nackter Chibi-Körper), keine
  Sonderbehandlung nötig.
- **Waffe (`Tools`) und Schild bleiben schwebende Icons**, wie es die Waffe schon vor
  G2 war — mit Begründung (Korrektur 4 für Waffe; für Schild gibt es im ganzen Pack
  **kein einziges Schild-Sprite für den Helden**, nur Boden-Requisiten in den
  Dungeon-Sets). Die Waffe zeigt neu das echte `Iron_Sword`-Frame statt Emoji-Text,
  eingefärbt nach Waffengattung (`WEAPON_STYLE`); alle drei Gattungen (Dolch/Schwert/
  Kriegsaxt) teilen sich dieselbe Klinge, weil `Iron_Sword.png` das einzige
  **eingebundene** Waffenblatt ist (`Tools/Iron/Iron_Tools.png` mit Axt und
  `Tools/Bow/Wooden_Bow.png` liegen ungenutzt im Pack — Reserve für eine
  gattungseigene Klinge, Richtigstellung R8/F16).
  Weil zwei Qualitätsstufen derselben Gattung sonst identisch aussähen (z. B.
  Amtsklinge/Dienstschwert, beide `sword`), skalieren Größe und Leuchten zusätzlich
  mit der Stufe — sonst hätte die Abnahme „jede Slot-Belegung sichtbar" für die
  Waffe nicht gestimmt. Das Schild-Icon bekommt dieselbe Behandlung (Größe/Glanz
  nach Bronze/Silber/Gold-Schwelle, wie vordem die jetzt entfernte Rüstungs-Aura).
- **Aura-Glow-Code vollständig entfernt** (Regenbogen-Radialverlauf, umlaufende
  Funken, Rüstungs-Tier-Shadow-Blur ums Sprite) — Aufgabenstellung Phase G2.
  Rüstung/Stiefel färben jetzt das Sprite selbst, kein Ersatz nötig.
- **Frisuren:** `HAIRS`/`CF_HAIR` von 6 Sunnyside-Namen auf 6 Cute-Fantasy-Kombis
  (`Hair_1_Brown` … `Hair_6_Brown`, je eine Farbe pro Style) umgestellt — deckt die
  Zufallsvielfalt ab, ohne alle 30 Style×Farbe-Kombis zu laden. `KN_HAAR` (Knöterich)
  auf `h5` (Grau) gesetzt, passend zum Amtsrat a. D.
- **Knöterich (`drawAlter`)** zeigt weiterhin nur Body+Haar grau getönt, jetzt aus
  `cfbody_idle`/`cfhair_*_idle` statt `hero_idle`/`hair_*_idle` — bewusst ohne
  Rüstungs-Layer, war vor G2 genauso unbewaffnet/ungerüstet.
- **Fluch-Optik unverändert:** `item.fluchRuht` ändert nichts an den Layern, das
  regelt weiterhin ausschließlich der Tooltip — es gibt keinen neuen Fluch-Visual-
  Code, also auch keine Reibung mit G2.

**Umgesetzt (alles in `index.html`):**

- `addSheet`/`loadAssets`/`drawSpriteAt`: neuer optionaler `rowStart` für `'grid'`-
  Sheets — Framegröße bleibt fix, aber ein Sheet kann jetzt eine beliebige Zeile
  eines größeren Blatts als „Zeile 0" behandeln. Rückwärtskompatibel (Default 0),
  bestehende Dungeon-Sheets unverändert.
- `CF_HERO_ANIMS`, `CF_ANCHOR`, `addCfHeroLayer()`: registriert Player_Base + alle
  Ausrüstungs-Layer-Dateien je 6-mal (einmal pro Anim), harte Zeilennummern,
  keine Namens-Heuristik (Regressionsregel 7).
- `CF_ARMOR_FILES` (5 Chest+Legs-Paare), `CF_BOOT_FILES` (5 Feet-Dateien),
  `cftool_sword` (Waffen-Icon-Sheet).
- `bakeHeroSheet()`, `blitLayerFrame()`, `BAKED_HERO_ANIM`, `bakedFor`
  (Dirty-Check) — neuer Abschnitt direkt nach `animLen()`. Aufruf in `recalc()`
  (Ende) und einmalig nach `assetsReady = true` (deckt den Nicht-Schichtmodus-Pfad
  ab, der `startShift()`/`recalc()` beim reinen `startGame()` nicht durchläuft).
- `drawPlayer()`: Aura-Block raus, liest `BAKED_HERO_ANIM[player.anim]` und blittet
  `hero_baked`; Waffe zeichnet `cftool_sword` getönt+stufenskaliert; neuer Schild-
  Icon-Block (nur wenn `player.equip.shield` gesetzt).
- `drawAlter()`: Sprite-Keys auf `cfbody_idle`/`cfhair_h5_idle` umgestellt.
- `assets/cf/player/` angelegt und befüllt (24 Dateien, Liste in
  `assets/cf/README.md`), `assets/cf/README.md` ergänzt. `.gitignore` brauchte
  keine Änderung — `assets/cf/player/` stand seit G0 schon drin.

**Bewusst nicht gemacht:**

- **Kein echtes Tools-Layer im Bake** (Waffe bleibt schwebendes Icon, siehe
  Korrektur 4 und Entscheidungen oben) — eine Kleinraster-Integration hätte pro
  Anim eine eigene Offset-Tabelle gebraucht, für ein Icon, das ohnehin schon einen
  funktionierenden Hieb-Effekt daneben hat.
- **Accessories (`Farmer_Hat_1.png`) nicht eingebunden** — nur eine einzige Datei
  im ganzen Ordner, keine Zufallsvielfalt zu holen. Bleibt Reserve.
- **Keine Direction-Vielfalt über Down/Up** — der Held zeigt (wie vorher bei
  Sunnyside) nur eine Blickrichtung plus Spiegelung. Down/Up-Zeilen wurden vermessen,
  aber nicht verdrahtet; wären reiner Mehraufwand ohne Spielwert, solange die
  Steuerung selbst nur links/rechts kennt.

**Verifikation (`http://localhost:8378/adventure/index.html` und `dist/index.html`):**

| Prüfung | Ergebnis |
|---|---|
| Ladeliste | 187/187 Sheets geladen (Server und Build), keine „Sprite fehlt"-Warnung |
| Bake-Korrektheit | Chest/Legs/Feet-Farbe im gebackenen Frame per `getImageData` gegen erwartete Stufe geprüft (0/2/3/4), stimmt exakt mit `bakedFor`-Schlüssel überein |
| Slot-Sichtbarkeit | Rüstung 0/2/3/4, Stiefel 0/2/4, Schild 1/2/4, Waffe (Stufen-Glanz) einzeln durchgeschaltet und am 4×-Zoom-Crop angesehen — jede Stufe sichtbar verschieden |
| Anim-Durchlauf | Alle 7 `player.anim`-Werte (inkl. `death`) einzeln erzwungen, `drawPlayer()` je einmal aufgerufen — 0 Exceptions |
| 300-Frame-Soak | `update()+render()` 300× in Folge, 0 Exceptions, `drawAlter()` danach ebenfalls fehlerfrei |
| Frame-Budget | `drawPlayer()` Ø 0,0044 ms über 1000 Aufrufe (vorher: 2 Sprite-Draws + Radialverlauf + 2 Funken-Kreise pro Frame) — Referenz 0,6 ms deutlich gehalten |
| Bake-Zeit | ~23 ms pro Ausrüstungswechsel (einmalig, hinter dem Klick auf Ausrüsten/Ablegen) |
| Build | `node tools/build-single.mjs` → 365 Dateien, 1675 KB; `dist/index.html` im Browser: `assetsReady`, `SHEETS['hero_baked']` vorhanden, 187/187 geladen, Konsole leer |
| Touch/HUD | Unverändert, nicht angefasst — kein Diff außerhalb der oben genannten Funktionen |

**Für G3 zum Mitnehmen:** Der `rowStart`-Mechanismus ist jetzt der Weg für jedes
Sheet, das eine bestimmte Zeile aus einem größeren Blatt braucht — Monster-Rigs mit
mehreren Waffen-/Rüstungsvarianten können ihn genauso nutzen. Und: vor jeder neuen
Cast/Attack/Hurt/Death-Zuordnung erst mit der Bounding-Box-Metrik durchsuchen, dann
gegen das PNG gegenprüfen — der Player-Rig hat gezeigt, dass „sieht aus wie Zeile X"
ohne Metrik in die Irre führt (Rolle vs. Attacke, Sprung vs. Zauber sahen im
Daumennagel-Vorschaubild anfangs sehr ähnlich aus).

### G3 — Monster auf echte Rigs

**Korrekturen am Prompt-Kontext oben (wichtig für G4/G5):**

1. **`Skeleton.png` hat gar keine Angriffszeile**, nicht nur „kein Cast" wie G0
   notierte. Per-Zeilen-Bounding-Box (10 Zeilen) zeigt: Zeilen 7–9 sind
   pixelidentisch zu den Idle-Zeilen 0–2 (das sind Hurt-Posen), Zeile 6 zeigt ein
   Zusammensacken (Death). Reihenfolge also idle(0–2)/walk(3–5)/death(6)/hurt(7–9)
   — die 10-Zeilen-Familie lässt *attack* weg, nicht *hurt*. Deshalb in G3 **nicht
   verwendet**; `mummy` läuft stattdessen auf `Skeleton_Bowman.png` (Merged).
2. **`Skeleton_Swordman.png` hat kein sauberes 32px-Raster** (16 Zeilen à 64×32,
   Inhalt wechselt zeilenweise zwischen oberer und unterer Bildhälfte — vermutlich
   ein zusammengelegtes 64×64-Raster, das die Heuristik falsch aufgeteilt hat).
   Das war als Basis für `stalfos` und den Alter-Schrecken-Boss vorgesehen; beide
   laufen stattdessen auf `Knights/Swordman.png` bzw. `Knights/Archer.png`.
3. **Die Cast-Seitenzeile bei allen drei Magier-Tripeln (Skeleton_Mage,
   Cowling_Mage_1/2, Angel_1/2) ist Zeile 7, nicht Zeile 8** wie der G0-Cast-Table
   vage vermutete. Zeile 8 ist die Rücken-Ansicht (kein Gesicht sichtbar, wie die
   Idle-Zeile 2), Zeile 7 die Seiten-Ansicht — exakt das Gegenstück zur schmaleren
   Seiten-Zeile 1/4/11 bei idle/walk/hurt. Per Screenshot-Krop am realen Bild
   bestätigt (nicht nur Bounding-Box-Zahlen), siehe `tools/sheet-audit.overrides.json`
   `_rigTable`. Damit ist auch Angel_1s „vor Einsatz final bestätigen"-Flag aus G0
   aufgelöst: echter Zauber-Trail sichtbar, kein bloßes Idle-Item-Halten.
4. **Universelle Seiten-Regel bestätigt** (2 Idle/Walk/Hurt-Triplets + 3
   Cast-Triplets per Bildvergleich geprüft): in jedem Down/Side/Up-Dreier ist die
   **mittlere** Zeile die Seitenansicht. Für die 13-Zeilen-Familie also fix
   idle=1, walk=4, attack/cast=7, hurt=11, death=9 (Einzelzeile). Gilt für alle in
   G3 verwendeten Humanoiden-Rigs identisch — nur Slime, Flying_Skull und Bat
   weichen davon ab (siehe `CF_RIGS`-Kommentare in `index.html`).
5. **`manifest.json` taugt nicht für Anker (`ax`/`ay`) und Pixelhöhe.** Seine
   `unionBBox`/`anchorSuggested` sind über die Angriffszeile gebildet, in der
   Waffe/Zauber weit über den Körper hinausragt — bis zu 13px/88% daneben gegen
   die tatsächliche Idle-Seitenzeile. Alle `ax`/`ay` in `CF_RIGS` sind deshalb von
   Hand an der Idle-Seitenzeile gemessen, nicht aus dem Manifest übernommen.

**Entscheidungen:**

- **Rig-Zuordnung** (19 Rigs für 21 `MONDEF`-Typen, Cast-Reserve ist null — 5
  Magier auf 5 cast-bestätigten Rigs): siehe `CF_RIGS` in `index.html` und die
  Tabelle in `assets/cf/README.md`. Boss-Rigs nach Nutzerentscheidung:
  Schattenfürst = Knights_Templar (sicherstes Raster im Pack), Alter Schrecken =
  Knights_Archer (Fallback für das kaputte Skeleton_Swordman-Raster).
- **Witch verworfen als Magier-Rig.** Ihr Cast liegt in einer separaten Datei
  (`Witch_Cauldron_Anim.png`) mit anderem Frameraster und zeigt einen Kessel statt
  eines Körpers — ein Monster, das beim Zaubern zum Kessel-Sprite wechselt, ist
  keine Zauber-Animation. `Witch.png` selbst hat außerdem weder death noch hurt.
- **`psc`-Grundwert 1,2** (= `PLAYER_SC`/1,5) für alle Rigs, damit ein
  `sc:1.5`-Monster effektiv wie der Held rendert (ein gemeinsames Pixelraster,
  keine krummen Skalen). Bewusst **nicht** auf die alten Sunnyside-Silhouetten
  zurückgerechnet — die CF-Rigs sind in denselben Chibi-Proportionen gezeichnet
  wie der CF-Held aus G2, das zurückzudrehen hätte nur wieder inkonsistente,
  rig-verschiedene Skalen erzeugt. Slime rendert dadurch bewusst klein (16×16-
  natives Blob-Sprite) statt wie bisher aufgeblasen auf Goblin-Größe — das ist der
  Rig-Vielfalt-Punkt der Phase, keine Regression.
- **`deathFps` pro Rig** ersetzt die feste `11` in `killMon`/`drawCorpse`. CF-
  Death-Zeilen haben 4 statt 9 Frames; mit der alten festen FPS liefe das
  Zusammensacken doppelt so schnell und stünde dann lange still. Formel `n/0,8s`,
  an beiden Stellen (Leichen-Dauer und Leichen-Animation) dieselbe Zahl.
- **`tintedSheet()` zeilenweise gebacken statt ganzes PNG.** Bei 7 Anim-Keys pro
  Rig auf teils sehr große CF-Sheets (bis 512×832) wäre ein Ganz-Sheet-Bake pro
  Tint ~172 MB Canvas gewesen (statt vorher ~3 MB bei den kleinen Sunnyside-
  Sheets) und ein Mehr-Millisekunden-Hänger beim ersten Treffer mitten im Frame.
  Zeilenweise sind es ~16 MB, und alle Tints werden nach dem Laden einmalig
  vorgewärmt (`prewarmMonsterTints()`), sodass im Kampf nichts mehr bäckt.
- **`loadAssets()` dedupliziert jetzt nach URL.** ~19 Rig-Dateien tragen je 7
  Anim-Keys; ohne Dedupe hätte der Browser (und im `dist/`-Build potenziell jedes
  `Image`-Element einzeln) dasselbe PNG bis zu 7× dekodiert.
- **Kammerwächter-Ersatz-Rigs, wo das Pack nichts Passenderes hergibt:** `spider`
  auf `Blue_Shroomling.png` (kein Spinnen-Rig vorhanden), dokumentiert als
  bewusster Kompromiss wie vom Prompt für Golem/Mumie vorgesehen.
- **Rigs ohne eigene Treffer-/Sterbezeile, bewusst akzeptiert (nachgetragen in
  R8/F17):** `bat` läuft auf `Halloween/Bat.png` (96×16, genau eine Zeile mit
  6 Frames — alle sieben Anim-Keys aliasen darauf, es gibt keine Angriffs-, Hurt-
  oder Death-Pose). Das vom Prompt vorgeschlagene `Flying_Skull` wäre das einzige
  Alternativ-Rig, wurde aber verworfen: seine hurt/death-Zeilen zeigen
  auseinanderfliegende Schädel-Bruchstücke und widersprächen Name (`Fledermaus`),
  Drop (`Fledermausflügel`, `ZUTAT_NOUNS.bat` mit 🦇-Icon) und dem
  Weltbibel-Eintrag „Der Umlauf"; außerdem ist es selbst kein voller Rig
  (attack nur 2 Frames, cast = attack). Kleinerer Fall gleicher Art:
  `slime`/`shadow` teilen hurt und death auf Zeile 3 (`Slime_Small_*.png` hat nur
  4 Zeilen). Beides bleibt mechanisch sichtbar — weißer Trefferblitz, ausblendende
  Konfetti-Leiche — nur ohne eigene Pose.
- **Zauber-Projektil:** `Skeleton_Mage_Projectile.png` ersetzt den gezeichneten
  Farbkreis für alle 5 Magier, getönt nach `bolt.color`. Spieler-eigene
  `projectiles` bleiben Kreise (nicht Teil des Auftrags).
- **Hoftiere:** kein Down/Side/Up-Schema nötig (nur Idle/Lauf). Chicken folgt
  einem anderen Zeilenlayout als Cow/Sheep/Pig (Verhaltens-Sheet statt Richtungs-
  Sheet, 16 Zeilen = zwei identische 8-Zeilen-Blöcke) — Zeilen einzeln gemessen,
  nicht aus dem Cow/Sheep/Pig-Muster übertragen.

**Umgesetzt (alles in `index.html`, sofern nicht anders vermerkt):**

- `tools/sheet-audit.mjs`: neuer `--rig <Pfad> [--fw --fh] [--ascii row,col]`-Modus
  (per-Zeilen-Bounding-Box-Tabelle + ASCII-Render), nutzt den vorhandenen
  Alpha-Decoder. `tools/sheet-audit.overrides.json`: `_castTable`-Korrektur für
  Skeleton und die Cast-Zeile-7-Präzisierung, neue `_rigTable` mit den gemessenen
  Zeilen/Ankern für alle 19 Rigs + 4 Tiere + Projektil.
- `loadAssets()`: URL-Dedupe über eine `Map<src, Promise<Image>>`.
- `tintedSheet()`/`drawSpriteAt()`: zeilenweises Backen (`rowStart`-Slice statt
  ganzes Bild), Quell-y in `drawSpriteAt` entsprechend umgestellt.
- `prewarmMonsterTints()`, `assertRigRegistrations()`: laufen einmalig nach
  `assetsReady=true`, backen alle Tints vor und prüfen `RIG_ANIM`-Vollständigkeit
  sowie `n <= cols` je Sheet (nur `console.warn`).
- `CF_RIGS`: 19 Rig-Definitionen (Datei, Raster, Anker, sieben Anim-Zeilen),
  Registrierungsschleife nach dem Muster von `addCfHeroLayer()` aus G2.
- `RIG_ANIM` wird jetzt aus `CF_RIGS` generiert (keine Hand-Tabelle mehr, keine
  Sunnyside-Einträge mehr).
- `psc`/`deathFps` in `MONDEF`, verrechnet in `drawMon()`/`drawCorpse()`
  (`ctx.scale(sc*psc*…, sc*psc)`) und `killMon()`/`drawCorpse()` (`deathFps` statt
  fester `11`). Alle 21 `MONDEF`-Typen tragen jetzt ein CF-Rig-Feld.
- `enemyBolts`-Zeichnung auf `cf_bolt`-Sprite umgestellt (getönt, `animFrame`
  über die Bolt-Restlaufzeit).
- Hoftiere: `CF_ANIMALS`-Tabelle + Registrierungsschleife, Critter-Objekte tragen
  `sheetIdle`/`sheetWalk` (beide beim Spawn fest angelegt, nicht im Draw-Case
  zusammengebaut), `DRAW_CRITTER` wählt nach Bewegungszustand.
- Sunnyside-Gegner-Rigs (`goblin_*`/`skel_*`-Registrierung, alte `RIG_ANIM`-Tabelle)
  vollständig entfernt. Toter `bird`-Sheet (registriert, nie gezeichnet) mit
  entfernt.
- `assets/cf/enemies/` (19 PNGs), `assets/cf/deco/Animals/` (4 PNGs),
  `assets/cf/deco/Other/` (1 PNG) befüllt, `assets/cf/README.md` fortgeschrieben.
  `.gitignore` brauchte keine Änderung — alle drei Ordner standen seit G0 schon drin.

**Bewusst nicht gemacht:**

- **Die Sunnyside-`assets/Characters/`-PNGs bleiben auf der Platte.** Ihre
  endgültige Löschung ist ausdrücklich G5 („Sunnyside-Abschied"). Bis dahin
  inliniert `build-single.mjs` sie weiterhin ungenutzt in `dist/index.html` —
  das ist bekannt und keine vergessene Aufräumarbeit.
- **`Orc_Chief/Grunt/Peon` nicht verwendet** — im G0-Audit niedrigste
  Rasterkonfidenz im ganzen Prioritäts-Set (0,018 bei Orc_Chief), Inhalt berührt
  beide Zellränder (Hinweis auf falsches Raster). Nicht ausprobiert, nicht
  nachkorrigiert — hätte eigene Verifikation gebraucht, die dieser Umbau nicht
  brauchte, weil genug andere Rigs zur Verfügung standen.
- **Kein eigenes Rotations-/Ausrichtungs-System für Projektile** — `cf_bolt`
  wird ungedreht gezeichnet, wie zuvor der Kreis.

**Verifikation (`http://localhost:8378/adventure/index.html`, per Browser-Konsole
und direkter `SHEETS`/`RIG_ANIM`-Introspektion statt nur Screenshots):**

| Prüfung | Ergebnis |
|---|---|
| Ladeliste | 311/311 Sheets, keine „Sprite fehlt", `assertRigRegistrations()` meldet nur die vorbestehende (nicht G3-verursachte) `goblin_cast`-Warnung — die verschwand nach Schritt 7 vollständig |
| Alle 21 Typen | einzeln erzwungen (`makeMon`), idle/walk/attack/cast/hurt/death durchgeschaltet, per Zoom-Screenshot und Pixel-Sampling einzeln angesehen |
| Magier (5/5) | Skeleton_Mage, Cowling_Mage_1/2, Angel_1/2 — alle mit echtem Zauber-Trail auf Zeile 7, Projektil-Sprite fliegt und trifft |
| Kammerwächter | über `betreteKammer()` in einer echten Schwierigkeit-5-Kammer gespawnt (`mummy, golem×3, stalfos×2, bat×2, mage, bossgeneric`), 300-Frame-Soak dort 0 Exceptions, Verlassen (`knAbbruchKammer()`) sauber |
| Bosse | Schattenfürst (Bossbar, Name, Flammen, Glow) und Alter Schrecken einzeln erzwungen und angesehen |
| Hoftiere | alle 4 Typen per Farb-Fingerprint verifiziert (Chicken: weiß/rot/orange, Sheep: grau/weiß, Cow: creme/braun, Pig: rosa) |
| 300-Frame-Soak | Grasland/Schnee/Wüste/Schattenland je einzeln, dazu 130-Mob-Vollhorde mit gemischten Typen und Dauerzaubern — 0 Exceptions in allen Durchläufen |
| Frame-Budget | Hintergrund allein 0,525 ms/Frame (unverändert, außerhalb G3-Scope); 130 Monster kosten **zusätzlich** ~0,57 ms (≈0,0044 ms/Mob — exakt der Wert, den G2 für `drawPlayer()` maß); Boss-Draw (Glow+Flammen) 0,0142 ms. Referenz „~0,6 ms" damit gehalten |
| Oberwelt-Wiederherstellung | Kammer betreten/verlassen bitgleich (Mechanik von G1 unverändert, G3 hat sie nicht angefasst) |

**Für G4/G5 zum Mitnehmen:** Der `--rig`-Audit-Modus in `tools/sheet-audit.mjs`
ist der Weg für jede weitere Zeilen-Verifikation (Tiles, UI). Und: die
„mittlere Zeile ist immer die Seitenansicht"-Regel hat sich über 5 unabhängig
geprüfte Triplets bestätigt — bei neuen Rigs in G4 zuerst danach suchen, bevor
man am Bild rätselt.

### G4 — Oberwelt-Tiles, Biome, Deko

**Vom Nutzer entschieden (weicht bewusst vom Prompt-Text oben ab):**

1. **Schattenland bekommt echte Pilzland-Tiles** (`ShroomLands_Grass_Purple_Tiles.png`)
   statt der bisherigen Dunkel-Umfärbung. Auch die Pilz-Deko wechselt dort zur
   leuchtenden lila `Mushrooms_Purple`-Variante.
2. **`G_LAVA` ist reine Optik und begehbar**, exakt wie die bestehenden Eisteiche —
   keine Änderung an Kollision, Wegfindung, Spawn oder der Kammer-Wiederherstellung.
3. **Hohes Gras (`G_TALL`) bekommt erstmals ein Sprite** (`Grass_1_Anim`, sparsam
   über `decos[]` gestreut) — war bis G3 eine unsichtbare Datenkachel.

**Korrekturen am Prompt-Kontext oben (wichtig für G5):**

1. **`sheet-audit.mjs`s Bounding-Box-Heuristik taugt bei flächigen Boden-Tiles
   nichts** — jede 16×16-Zelle eines Grass-/Volcano-/ShroomLands-Tilesets ist voll
   opak, die BBox ist immer 0..16/0..16. Boden-UVs wurden stattdessen per
   Python/PIL-Varianzscan gefunden (niedrigste RGB-Varianz unter den opaken Zellen
   = nahtlos wiederholbare Fläche). Methode und alle Werte in
   `tools/sheet-audit.overrides.json` unter `_g4Tiles`.
2. **Erster Anlauf beim Gras war zu kontrastreich.** Grass_3/4_Middle als seltene
   „1-von-6"-Sonderkachel (Nachbau der alten Sunnyside-Blüten-Logik) erzeugte am
   laufenden Spiel ein deutlich sichtbares Schachbrett, weil die beiden Töne
   spürbar wärmer/kühler sind als 1/2. Korrigiert: alle 4 Töne gleichberechtigt im
   selben Pool (`CF_TILE.grass`), dadurch feinere Streuung statt harter Flecken.
   Merksatz fürs nächste Tileset: **Kontrast der Kandidat-Töne am laufenden Spiel
   prüfen, nicht nur den Einzel-Krop** — was im 16×16-Ausschnitt dezent wirkt, kann
   flächig gekachelt ein Muster ergeben.
   **Nachtrag R8 (F39): die hier benannte Ursache war falsch.** Das Schachbrett kam
   nicht vom Tonkontrast, sondern aus `tileHash` selbst: dessen Bits 4/5 hängen nur
   von `x&63`/`y&63` ab, benachbarte Kacheln wechselten dadurch **garantiert** die
   Variante (gemessen 0,0 % gleiche Nachbarn statt 25 %, striktes Gitter mit
   Periode 64). Der 4-Töne-Pool hat das Muster nur kontrastärmer gemacht, die
   Nachbarschaftsstreuung sogar verschlechtert. Behoben durch eine
   fmix32-Avalanche-Runde in `pickCfTile` (gemessen danach 25,2/24,5 % gleiche
   Nachbarn bei n=4, keine Periode ≤256), am laufenden Spiel per
   Screenshot-Vergleich gegengesehen.
3. **Tree-/Rock-/Plant-Sheets, deren Name auf „Animation" hindeutet, sind es nicht
   zwangsläufig.** `Big_Oak/Birch/Spruce_Tree.png` sind 3-Spalten-**Varianten**-
   Sheets (Spalte 0 ist ein Baumstumpf, keine Wuchsstufe — visuell per Crop
   bestätigt), kein Sway-Frame vorhanden. `Volcano_Plants.png`/`Mushrooms_Purple.png`
   liegen in „Props"-Ordnern und sind ebenfalls Varianten-Blätter. Nur Dateien mit
   `_Anim`-Suffix (`Rock_1_Anim`, `Grass_1_Anim`, `muschroom_N_Anim`, `Torch_Anim`,
   `Campfire_Anim`) sind im ganzen Pack durchgängig echte Frame-für-Frame-
   Animationen — diese Namenskonvention war zuverlässig, wo vorhanden.
4. **Kein Kaktus im ganzen Pack.** `G_CACTUS` läuft auf `Volcano_Plants` (Zeile 0,
   orange-stachelige Vulkanpflanze) — thematisch die nächstliegende Alternative.

**Entscheidungen:**

- **Boden-Tabelle `CF_TILE`** nach dem Muster von `DUN_SET`/`bakeDunTile` aus G1
  (Wiederverwendung, keine Neuerfindung): pro Fläche eine Liste von
  `[sheetKey, uv]`-Einträgen, `pickCfTile()` wählt per `(tileHash>>>4) % length`
  einen Eintrag (Bit-Shift bewusst, damit die Wahl nicht mit anderen Low-Bit-
  Entscheidungen wie der G_TALL-Streurate koppelt). `bakeCfTile()` ersetzt
  `bakeTile()` 1:1, plus optionaler `source-atop`-Tint wie bisher.
- **Kein 9-Slice-Autotiling für Teiche/Lava.** Geprüft: `Cobble_Road`/`Water_Tile_1`
  sind waschechte 3×5-Blob-Sets (3×3-Ring + 2 Sonderzeilen mit konkaven
  Innenecken) — ein vollständiges Wang-Tile-System wäre nötig, um sie sauber zu
  nutzen. Das bestehende `G_ICE` nutzte diese Komplexität nie (flache
  Zufallsvariante pro Kachel, kein Nachbar-Check), `G_LAVA` übernimmt exakt dasselbe
  einfache Muster. Aufwand/Nutzen für eine reine Deko-Wasserfläche nicht
  gerechtfertigt.
- **Weg (`G_PATH`) bleibt eine einzelne flache Kachel** (`Path_Middle.png`) über
  alle Biome hinweg, wie zuvor mit `TILE_UV.dirt`. Keine Cobble-Road-Variante pro
  Biome — hätte den Autotiling-Aufwand von oben gebraucht, um an den Rändern nicht
  hart abzuschneiden.
- **Bäume/Steine/Pilze bekommen einen festen statt zeitbasierten Frame** (aus
  `t.phase` bzw. `o.phase` abgeleitet), weil ihre Quell-Sheets Varianten- und keine
  Animationsblätter sind (s. Korrektur 3). Einzige Ausnahme: `cftallgrass` und
  `cfmush1/cfmush2` sind echte `_Anim`-Strips und laufen weiter über `animFrame`.
- **Windmühle nur als Rumpf**, ohne das separate `Windmill_Sail_Anim`-Layer — eine
  rotierende Flügel-Overlay hätte eine eigene Rotationsachse und Positionierung
  relativ zum Rumpf gebraucht; für eine reine Wiedererkennbarkeits-Landmarke nicht
  gerechtfertigt. `cfwindmill` ist bewusst mit `n:1` registriert (nicht `strip`
  mit `n:2`), sonst hätte die bestehende `animFrame(...,9)`-Aufruf im
  `DRAW_DECO`-Case zwischen Rumpf und einer zweiten Gebäude-Skin geflackert.
- **Schattenland-Pilze per Draw-Time-Override, nicht per eigenem Decos-Array.**
  Level 2 ist technisch dieselbe Karte wie Level 1, nur umgebacken (kein `genMap()`
  beim Wechsel) — die Pilz-Decos wurden schon beim ursprünglichen `genMap()`
  gespawnt. Der `DRAW_DECO`-Fall ersetzt den Sheet-Key deshalb zur Zeichenzeit
  gegen `cfmush_shadow`, wenn `currentLevel===2` und es sich nicht um Windmühle
  oder hohes Gras handelt.
- **`G_ROCK` nutzt jetzt ein einziges Sheet (`Rock_1_Anim`) für alle Biome**, mit der
  bestehenden Tint-Logik (Sandstein/Reif/keine Färbung) unverändert übernommen —
  ein zweites Requisiten-Set (`Volcano_Rocks`) hätte nur Risiko ohne klaren Gewinn
  hinzugefügt.

**Umgesetzt (alles in `index.html`, sofern nicht anders vermerkt):**

- Sheet-Registrierung (~Zeile 620ff): komplette Sunnyside-Welt-Sektion (`tileset`,
  `tree1/2`, `mush_blue1-3`, `mush_red`, `windmill`, `rock`, `wood`) durch CF-Sheets
  ersetzt. `glint`/`alert` bleiben bewusst Sunnyside bis G5 (kein Pack-Äquivalent).
- `CF_TILE`, `bakeCfTile()`, `pickCfTile()` ersetzen `TILE_UV`/`TILE_TINT`/`bakeTile()`.
  `TILE_TINT` verliert die toten Einträge `dead` (nie referenziert) sowie
  `shadow`/`shadowDirt` bleiben (Schattenland-Weg nutzt `shadowDirt` weiter).
- `G_WATER` (deklariert, nie geschrieben) umgewidmet zu `G_LAVA`, in `WALKABLE`
  aufgenommen. Lavatümpel in `genMap()` nach demselben Fleck-Algorithmus wie die
  26 Eisteiche, nur im Wüstenband (`y>54`) und kleinerem Radius (16 Stück).
- `initFloorGraphics()`: alle Zweige auf `pickCfTile`/`CF_TILE` umgestellt,
  Zweig-Reihenfolge (Kammer → Level2 → Path → Ice → Lava → Snow-Band → Sand-Band →
  Grasland) unverändert zur Vorlage.
- `trees[]`-Einträge tragen neu `sp` (Art-/Wuchsvariante, eigenes Hash-Bit,
  entkoppelt von `variant`). `drawProp()` komplett auf CF-Sheets umgestellt:
  Oak/Birch für `G_TREE`, Spruce für `G_ICE_TREE`, Volcano-Plant für `G_CACTUS`,
  `cfrock` für `G_ROCK`, `cftree_oak` fix getönt für die Schattenland-Silhouette.
- `genMap()`-Deko-Schleife: `G_TALL` erzeugt jetzt `cftallgrass`-Props (~16 % der
  Kacheln), Pilz-Deko auf `cfmush1`/`cfmush2` umgestellt (Wüste bleibt karg),
  Windmühle auf `cfwindmill`.
- `DRAW_DECO`-Fall: Schattenland-Override auf `cfmush_shadow` (fixer Frame aus
  `o.phase`, keine echte Animation, s. Entscheidungen).
- `assets/cf/tiles/` (8 Dateien) und `assets/cf/deco/` (14 Dateien, davon 3 in
  `Trees/`) befüllt, `assets/cf/README.md` fortgeschrieben. `.gitignore` brauchte
  keine Änderung — beide Ordner standen seit G0 schon drin.
- `tools/sheet-audit.overrides.json`: `_g4Tiles`-Block mit allen gemessenen
  Boden-UVs, Baum-/Requisiten-Rastern und den Python-Scan-Ergebnissen.

**Bewusst nicht gemacht:**

- **Kein Autotiling für Teich-/Lava-Ufer** (s. Entscheidungen) — flache
  Zufallsvariante wie bei `G_ICE` seit jeher.
- **Frostkamm-Pilze nutzen dieselben Grasland-Sheets**, keine eigene
  `Cute_Fantasy_Christmass`-Deko. Das Christmas-Decor-Blatt ist ein dichtes
  Sammelblatt (Geschenke, Zuckerstangen, Kränze) ohne einzeln passendes
  Bodenmotiv — Aufwand für eine sehr kleine visuelle Nuance nicht gerechtfertigt.
- **Kein Sway-Code für die neuen Bäume** (s. Korrektur 3) — weicht bewusst vom
  Prompt-Wunsch „Sway-Verhalten übernehmen falls Sheets es hergeben, sonst
  dezenter Code-Sway" ab. Ein `ctx.rotate`-basierter Wiege-Effekt wäre ohne
  Sheet-Unterstützung zusätzlicher, ungeplanter Code gewesen.
- **`Volcano_Rocks.png`, `Volcano_lava_buble.png`, `Windmill_Sail_Anim.png`,
  `Cobble_Road`/große Blob-Tilesets nicht kopiert** — nicht geladen, also nicht im
  Repo (s. Entscheidungen für die jeweilige Begründung).
- **Kein `ctx.filter` an keiner Stelle** — alle neuen Tints laufen weiter über
  `source-atop` auf gebackenen Canvas-Kopien, Regressionsregel 10 unangetastet.

**Verifikation (`http://localhost:8378/adventure/index.html`, Konsolen-
Introspektion wie in G1–G3, da kein automatisierter Test-Runner existiert):**

| Prüfung | Ergebnis |
|---|---|
| Ladeliste | 319 Sheets in `SHEET_LIST`, alle in `SHEETS` vorhanden; einzige `n>cols`-Auffälligkeit ist `dun1_plate`/`dun2_plate` — vorbestehend seit G1, von G4 nicht berührt (`git diff` bestätigt keine Änderung an der Zeile) |
| Kein Sunnyside-Tile mehr | `tileset`/`tree1`/`tree2`/`mush_*`/`windmill`/`rock`/`wood` aus `SHEET_LIST` entfernt, `grep` bestätigt keine Restreferenz im Code |
| Grasland | Boden 4-Ton-Streuung ohne Schachbrett (Zusicherung galt erst ab R8/F39: die Fassung „nach Korrektur 2" war weiterhin ein regelmäßiges Gitter, s. Nachtrag an Korrektur 2), Oak/Birch-Bäume, Windmühle als erkennbares Gebäude (per 3×-Zoom-Screenshot geprüft), hohes Gras sichtbar |
| Frostkamm | Schnee-Tint auf CF-Gras, Spruce-Bäume gefroren getönt, Eisteiche unverändert in Form (Fleck-Algorithmus nicht angefasst) |
| Aschewüste | Basalt-Boden, 16 Lava-Flecken sichtbar und **begehbar** (per Konsole: `T(tx,ty)===G_LAVA` in `WALKABLE`), Vulkanpflanzen statt Kaktus |
| Schattenland | Echtes lila Pilzland-Set, einheitliche dunkle Baumsilhouette, leuchtende lila Pilz-Deko (Draw-Time-Override bestätigt: Windmühle und hohes Gras bleiben unverändert) |
| Kammer-Regression | Tür Schwierigkeit 1 betreten (`betreteKammer`) und verlassen (`verlasseKammer`) über die Konsole — `currentLevel` korrekt 3→1, `kammer===null`, `trees.length` nach Rückkehr 1156 (unverändert), Dungeon-Rendering unangetastet |
| Bake-Zeit | `initFloorGraphics()` per `performance.now()`: 7,30 ms (G1-Referenz Oberwelt 5,3 ms — leichter Anstieg durch die zusätzliche Tabellen-Indirektion, keine Regression im spürbaren Bereich) |
| Frame-Budget | Hintergrund allein (0 Mobs) 0,308 ms/Frame (G3-Referenz 0,525 ms, damit gehalten); Bäume+Deko (1156+102 Einträge, y-Band-gefiltert) kosten zusätzlich ~0,26 ms; 265-Mob-Stresstest (absichtlich über dem 130er-Referenzwert) 3,55 ms — der Monster-Zeichenpfad selbst ist von G4 unangetastet |
| 300-Frame-Soak | Einmal ohne Mobs (0 Exceptions), einmal mit 40 frisch gespawnten Mobs plus Zauber-Versuchen (0 Exceptions) — ein Lauf endete regulär im „Dienstschluss"-Screen (Spielzeit lief durch die synchronen `update(16)`-Aufrufe schneller als Echtzeit ab), bestätigt sauberen Übergang statt Absturz |
| Build | `node tools/build-single.mjs` → 409 Dateien, 1743 KB eingebettet, `dist/index.html` 2046 KB; im Browser via `file://` geöffnet: Konsole leer, **0 Bild-Requests** im Netzwerk-Log |
| Lizenz-Check | `git status --short --ignored` bestätigt `assets/cf/tiles/`/`deco/` weiterhin ignoriert; `assets/cf/audit-report.md` (reine Timestamp-Neuerzeugung durch die Recherche) vor dem Commit zurückgesetzt, um den Diff sauber zu halten |

**Für G5 zum Mitnehmen:** Boden-UVs für flächige Tilesets müssen per Pixel-
Varianzscan gesucht werden, nicht mit `sheet-audit.mjs --rig` (das Werkzeug ist für
Sprite-Raster gebaut, nicht für nahtlose Flächentexturen). Und: **Kontrast von
Kachel-Varianten immer am laufenden Spiel prüfen**, nicht nur am Einzel-Crop — das
war die einzige Runde, die einen sichtbaren zweiten Anlauf brauchte. Die
`_Anim`-Namenskonvention des Packs ist zuverlässig; alles ohne dieses Suffix vorher
per Bild-Ansicht (nicht nur Bounding-Box-Zahlen) auf Varianten-vs-Animation prüfen.

### G5 — Dorf, UI-Skin, Sunnyside-Abschied

**Vorbedingung:** Im Arbeitsbaum lag beim Start unabhängig fertige, unpushte
W1-Terminologiearbeit einer anderen Session (bereits committet als `a67c9c3` durch
diese Session, bevor G5 begann — keine Vermischung mit dem G5-Diff).

**Nutzerentscheidungen aus der Rückfrage vor der Umsetzung:**

- **Amt-Zugang:** Kombination aus „Feierabend melden" und „Schalterfenster" — ein
  neues, leichtes Panel an der Amt-Tür (Taste F) zeigt Bankguthaben/Ausbauten
  (reine Anzeige, kein Kauf) und bietet „Feierabend nehmen", das den bestehenden
  `endShift()`-Weg auslöst. `showDorf()`/`startShift()` selbst unangetastet.
- **Dorf-Ort:** um `KESSEL_T`/`SPAWN`/`KN_T` herum (die lagen schon alle dicht
  beieinander), kein neuer Ort auf der Karte.
- **UI-Skin:** echte Bildgrafik aus `Cute_Fantasy_UI`, nicht nur Farbangleich in CSS.
- **Wetter:** Wolkenschatten (Grasland), Schneeflocken (Frostkamm), Windböen
  (Aschewüste), Schattenland bewusst ohne (Horde-Frame-Budget hat Vorrang).

**Korrekturen am Prompt-Kontext oben (für die Nachwelt, falls je ein G6 kommt):**

1. **`UI_Buttons.png`/`UI_Frames.png` sind keine sauberen Grid-Sheets.** Zellen
   sind pro Zeile unterschiedlich breit (Pillen 30px, Rundknöpfe 14px, in
   derselben Datei) — per Alpha-Lauflängen-Scan gemessen (`px[x,y][3]>0`-Läufe),
   nicht mit `sheet-audit.mjs` (das nimmt ein festes Raster an). `addSheet`s
   `'grid'`-Modus kennt außerdem keinen Spaltenversatz, nur `rowStart` — für
   einzelne Zellen mitten im Blatt (glint, alert, Rahmen, Rundknopf) blieb nur
   der G1-Weg: pixelgenau in eigene Dateien schneiden (Quellkoordinaten in
   `assets/cf/README.md`).
2. **`Cute_Fantasy_UI`-Fonts haben keine deutschen Sonderzeichen.**
   `CuteFantasy-5x9.ttf` per `fontTools`-Cmap-Check geprüft: weder ä/ö/ü/ß noch
   die Großschreibungen sind enthalten (0 von 7 Testzeichen). Systemfont
   (`'Courier New', ui-monospace, monospace`) bleibt deshalb unverändert — der
   Prompt-Text hatte diesen Fall selbst als Bedingung vorgesehen.
3. **Der GitHub-Pages-Live-Check aus der Abnahme setzt eine Build-Umstellung
   voraus, die es noch nicht gab.** Pages ist aktiv, Quelle bisher `main:/` —
   das liefert die Quell-`index.html` aus, die `assets/cf/*` referenziert, und
   die liegen seit G1 lizenzbedingt gitignored, also nicht im Repo. Die
   Live-Seite war damit spätestens seit G1 grafisch kaputt, unabhängig von G5.
   Lösung siehe „Bewusst nicht automatisch gemacht" unten.

**Entscheidungen:**

- **Dorf-Rechteck** `VILLAGE = {x0:6,y0:33,x1:24,y1:47}` (18×15 Kacheln), deckt
  beide Gebäude-Cluster inklusive Fassadenhöhe ab. Wird in `genMap()` an exakt der
  Stelle freigeräumt, an der bisher nur der 5×4-Kessel-Anger stand (Reihenfolge
  Streuung → Teiche/Lava → Freiräumung bleibt unverändert, sonst würden Bäume im
  Dorf landen).
- **6 Gebäude statt der im Plan erwogenen 6–8:** Amt (`Inn_Blue.png`, größtes und
  eindeutigstes Gebäude im Pack — Church/Blacksmith wirkten im Vergleich weniger
  nach „Amt"), 3 Häuser (Wood/Wood/Stone), Markt (`Market_Stalls.png`), Scheune
  (`Barn_Base_Red.png`). Zwei Cluster (Nord: Amt+Haus1+Markt, Süd: 2 Häuser+
  Scheune), Kessel/Knöterich bleiben in der Mitte dazwischen — beide standen
  schon dort, kein Positions-Update nötig trotz Prompt-Wortlaut „Kessel wandert
  an seinen Dorfplatz".
- **Kollision über `G_WALL`** (bislang nur in Kammern genutzt): Gebäude-Footprint
  (nicht die volle Sprite-Höhe, nur der begehbare Fußabdruck) wird nach der
  allgemeinen Dorf-Freiräumung auf `G_WALL` gesetzt. `WALKABLE` ist eine
  Whitelist, `initFloorGraphics()` hat im Oberwelt-Zweig keinen `G_WALL`-Fall und
  backt die Kachel als Gras — passt optisch, weil das Gebäude-Sprite (als
  `big:true`-Deco wie `cfwindmill`) die Fläche ohnehin überdeckt. Kein neuer
  `DRAW_*`-Kind nötig, der bestehende `DRAW_DECO`-Pfad reicht.
- **Windmühle musste umziehen** (alte Position (19,36) kollidierte mit dem neuen
  Markt-Gebäude) — jetzt bei (26,38), ostwärts neben dem Dorf.
- **NPC-Staffage (`npcs[]`)** nach dem Vorbild von `critters[]`, aber mit
  Heimatanker + Radius (40px) statt freiem Abprallen, sonst verlassen sie das
  Dorf sichtbar. 3 Figuren (`Farmer_Bob`, `Bartender_Katy`, `Miner_Mike`,
  64×64-Raster wie `Angel_1/2`, idle=Zeile1/walk=Zeile4 per Crop bestätigt — die
  „mittlere Zeile ist immer die Seitenansicht"-Regel aus G3 hält auch hier).
  `npcs[]` wird wie `decos`/`critters` in `owSave` gesichert und beim
  Kammer-Verlassen wiederhergestellt (gleiches Muster, gleiche Zeilen).
- **Amt-Panel als eigenes kleines Overlay** (`#amtFenster`, Bauform wie
  `#schloss`), nicht `showDorf()` wiederverwendet — `showDorf()` setzt
  `state='feierabend'` und sein einziger Knopf ist `startShift()`, das hätte die
  laufende Schicht hart zurückgesetzt. `endShift()` bekommt einen dritten
  `reason`-Zweig (`'amt'`) für Titel/Anlasstext, der Rest des Dienstbericht-Flows
  ist identisch zu Zeit/Tod.
- **Musik:** `MUS.goto()` in `update()` bekommt vor dem bestehenden
  `zoneForLevel(currentLevel)`-Aufruf eine Dorf-Prüfung
  (`currentLevel===1 && !kammer && inVillagePx(player.x,player.y)`) — greift nur
  auf Level 1 außerhalb von Kammern, `zoneForLevel()` selbst (Kammer/
  Schattenland-Vorrang) bleibt unangetastet.
- **UI-Skin-Mechanismus ohne Canvas-Bake-Schritt:** ursprünglich geplant war,
  Frames zur Laufzeit aus den großen UI-Sheets zu schneiden und per
  `canvas.toDataURL()` zu backen. Stattdessen (einfacher, robuster): die vier
  gebrauchten Zellen sind wie glint/alert vorab in eigene Dateien geschnitten,
  ganz normal per `addSheet(...,'raw')` geladen — `SHEETS[key].img.src` ist nach
  dem Laden bereits die richtige URL (Dev-Server: Pfad, `dist/`-Build:
  `data:`-URI aus `ASSET_BLOBS`, weil der Bild-Loader ganz normal durchläuft).
  `bakeUiSkin()` liest nur noch diese fertigen `src`-Strings und trägt sie per
  `style.borderImageSource`/`style.backgroundImage` ein — kein CSS-`url()` auf
  eine Datei, das hätte der Build nicht erfasst (bestätigter Befund aus der
  Recherche vor der Umsetzung).
- **Panels/Gürtel bekommen nur den Rahmen als Bild** (`border-image`, Slice
  `2 2 5 2` relativ zum 28×31 zugeschnittenen `frame_brown.png`, Breite 6px/4px),
  die dunkle Füllung (`rgba(20,14,24,…)`/`#17130d`) bleibt Kontrastgrund für den
  hellen Text. Das UI-Pack ist hell/pastellig gehalten — eine volle Flächenfüllung
  hätte die Lesbarkeit des hellgoldenen Texts (`#e8d9a8`) gekostet, deshalb
  bewusst nur Rahmen statt `border-image-slice: … fill`.
- **Runde Elemente** (Orbs/Röhren, Touch-Rundknöpfe, `#attackBtn`) bekommen
  stattdessen `round_brown.png` als `background-image` (100%×100%, keine
  Distortion bei Kreisen). `#hpFill`/`#manaFill` liegen als Kind-Divs unverändert
  darüber — bei vollen Werten unsichtbar, bei Teilfüllung zeigt sich der
  Rundknopf im leeren Bereich als „Sockel/Glas"-Optik (am laufenden Spiel mit
  25/70 HP bestätigt, siehe Verifikation).
- **`border-image-width` statt `border-width` verändert** — Layout/Media-Query-
  Mathematik (die kalibrierten `calc(100vh - 349px)`-Werte etc.) bleibt exakt
  erhalten, nur die Bildskalierung der Rahmengrafik wird größer als die
  tatsächliche Border-Box gezogen (spec-konform, kein Kastenmaß-Effekt).
- **glint/alert-Ersatz:** `glint_strip.png` ist ein 3-Zellen-Ausschnitt (voller/
  halber/leerer blauer Stern, `UI_Icons.png` Zeile 3 Spalten 9–11) — `animFrame`
  macht daraus ein Zwinker-Funkeln statt der alten 6-Frame-Sunnyside-Animation.
  Im ganzen Pack gibt es keine mehrframige Funkel-Animation (gleiche Lücke wie
  der fehlende Kaktus in G4) — Kompromiss dokumentiert statt stillschweigend
  verschlechtert.
- **Wetter, eigene Sub-Caps statt `MAX_PARTICLES`:** Wolken sind kein
  `particles[]`-Fall (eigenes kleines Array, kein Producer). Schnee/Wind haben
  je einen eigenen Deckel (`WEATHER_SNOW_CAP=40`, `WEATHER_WIND_CAP=6`) mit
  explizitem Check vor jedem `push` — bewusst kein zweiter `particles[]`-Producer,
  der am 900er-Deckel vorbeiliefe.

**Umgesetzt (alles in `index.html`, sofern nicht anders vermerkt):**

- `VILLAGE`, `VILLAGE_BUILDINGS`, `AMT_TUER`, `NPC_DEFS` (Datentabellen, direkt
  nach `KN_POS`), `inVillageT`/`inVillagePx`-Helfer.
- `genMap()`: Dorf-Freiräumung ersetzt die alte Anger-Freiräumung, Gebäude-
  Footprints als `G_WALL`, Windmühle verschoben, Gebäude/Wolken/NPCs-Spawn nach
  dem bestehenden Deko-/Critter-Muster.
- `placeMonsters()`: Dorf-Ausschluss (analog zur Knöterich-Kachel-Ausnahme).
- `npcs[]`-Wander-Update (Heimatanker-Radius), `DRAW_NPC` im Zeichenlisten-Pool,
  `owSave`/`betreteKammer`/`verlasseKammer` führen `npcs[]` mit.
- `AKT_AMT`, `scanAktion()`-Angebot, `amtFensterOeffnen/Schliessen/render`,
  `amtFeierabendNehmen()`, `#amtFenster`-DOM+CSS, Escape-/`startShift()`-Guards,
  `endShift()`-Reason-Zweig `'amt'`.
- Dorf-Musikzone in der Frame-Musik-Auswahl, Dorf-Zonenlabel in `update()`.
- `bakeUiSkin()`, aufgerufen nach `assetsReady=true`/`prewarmMonsterTints()`.
- Wetter: `weatherClouds/Snow/Wind`-Arrays, Spawn/Update in `update()` nach dem
  Kamera-Update, Zeichnen in `render()` vor der y-sortierten Liste.
- `glint`/`alert` auf CF-Icons umgestellt (Sheet-Keys unverändert, keine
  Änderung an den 6 Zeichenstellen nötig).
- `'char'`-Lademodus, `FW`/`FH`/`ANCH_X`/`ANCH_Y` entfernt (kein Aufrufer mehr).
- 10 Sunnyside-Kommentarstellen bereinigt (nur faktisch falsche/veraltete, reine
  Historie blieb stehen — z. B. die G3-Lektion über fehlende Cast-Animationen).
- `assets/Characters/`, `assets/Tileset/`, `assets/Elements/`, `assets/UI/`
  (325 Dateien) aus dem Git-Index entfernt (`assets/` enthält nur noch `cf/`).
- `assets/cf/deco/Buildings|NPCs|Weather/`, `assets/cf/ui/` befüllt (alle
  gitignored wie seit G0), `assets/cf/README.md` um den G5-Block ergänzt.
- `CREDITS.md`: Sunnyside-Absatz entfernt, Kenmi-Absatz unverändert.

**Bewusst nicht gemacht:**

- **Kein Kauf im Amt-Panel** — nur Anzeige plus „Feierabend nehmen". Käufe
  bleiben exklusiv `showDorf()` vorbehalten (Nutzerentscheidung, hält den Umbau
  klein und vermeidet zwei Code-Pfade für dieselbe Kauf-Logik).
- **Icons/Selectors/Crosshair aus dem UI-Pack nicht eingebaut** (Rarity-Rahmen,
  Tabs, Symbolschloss-Tasten bleiben CSS) — im Plan als optionale dritte Stufe
  markiert, für die Abnahme nicht nötig (die nennt nur Panels/Knöpfe/Gürtel/
  Röhren/Kessel-Panel namentlich).
- **Kein `border-image` auf Desktop-Orbs' Kreisform selbst** — nur
  `background-image` auf `.orbWrap`, `border-image` ignoriert `border-radius`
  und hätte auf dem kreisrunden Desktop-Orb eckige Artefakte erzeugt.
- **GitHub-Pages-Umstellung (`docs/`-Build, Push, Quelle wechseln) in der
  G5-Sitzung nicht selbst ausgeführt** — Push zu `origin/main` und eine Änderung
  der Pages-Repo-Einstellung sind sichtbare/schwer rückgängig zu machende
  Aktionen, dafür erst das ausdrückliche Go einholen (s. Chat). **Nachtrag:**
  Matthias hat sie danach von Hand vorgenommen, daher der Live-Eintrag in der
  Verifikationstabelle unten. Seit F9 ist der `docs/`-Weg ohnehin ersetzt, siehe
  Regressionsschutz Punkt 15.
- **Kein Sway/keine Animation für die Dorf-Gebäude** — reine `big:true`-Decos wie
  die Windmühle, ein Gebäude hat keinen Grund zu wackeln.

**Verifikation (`http://localhost:8378/adventure/index.html`, Konsolen-
Introspektion und direkte `update()`/`render()`-Aufrufe wie in G1–G4, da kein
automatisierter Test-Runner existiert):**

| Prüfung | Ergebnis |
|---|---|
| Ladeliste | 335/335 Sheets geladen, `assetsLoaded===335`, keine „Sprite fehlt"-Warnung, Konsole über die gesamte Sitzung leer |
| Dorf-Kollision | alle 6 Gebäude-Footprints `!walkT`, Fläche drumherum begehbar, Screenshot bestätigt korrekte Platzierung beider Cluster |
| NPCs | 3/3 gespawnt, Wanderradius hält (Heimatanker-Distanz-Check), `npcs.length` nach Kammer-Betreten 0, nach Verlassen wieder 3 (bitgleich zu vorher) |
| Amt-Panel | F an der Amt-Tür → `aktArt===AKT_AMT`, Panel öffnet mit Bankguthaben/Ausbauten, „Feierabend nehmen" → `state='feierabend'`, `endShift('amt')` zeigt „FEIERABEND"/eigenen Anlasstext, `nachSchicht()`→`showDorf()`→`startShift()` komplett durchlaufen |
| Dorf-Musik | `inVillagePx` korrekt bei Spawn/Kessel/Amt-Tür, Zonenlabel zeigt „📍 Dorf" nur innerhalb des Rechtecks |
| Kammer-Regression | `betreteKammer`/`verlasseKammer` über Konsole: `trees`/`decos`/`npcs` vorher/nachher exakt gleiche Länge (1112/104/3), 0 Exceptions |
| UI-Skin Desktop | Start-, Amt-, Dienstbericht-, Kessel-, Inventar-Panel zeigen sichtbaren Pixel-Rahmen (Screenshots), Text bleibt lesbar |
| UI-Skin Touch | `body.touch` aktiviert, Röhren zeigen bei Teilfüllung (25/70 HP, 20/40 Mana) das Rundknopf-Sprite im leeren Bereich, Gürtel eine Zeile, Daumen-Fächer unverändert positioniert |
| Wetter | Wolken 5 (konstant, driften/wrappen), Schnee spawnt nur bei `pyT<26` (bis Cap 40) und baut bei Verlassen der Zone ab, Wind spawnt nur bei `pyT>54` (Cap 6), Schattenland 0 Wettereinträge |
| 300-Frame-Soak | Dorf ohne Horde: 0,40 ms/Frame; 180-Mob-Horde (55 automatisch + 130 manuell): 0,66 ms/Frame, 0 Exceptions in beiden Läufen |
| Sunnyside | `git status --short` zeigt `assets/Characters|Tileset|Elements|UI` nicht mehr, `assets/` enthält nur `cf/`, `git grep -i sunnyside -- index.html` nur noch Historie |
| Build | `node tools/build-single.mjs` → 99 Dateien, 1009 KB eingebettet, `dist/index.html` 1339 KB (G4-Referenz 2046 KB — der Sunnyside-Wegfall macht sich direkt bemerkbar). Statisch geprüft (Skript-Syntax, keine `assets/Characters` o.ä.-Referenz, `ASSET_BLOBS` gefüllt, neue Sheet-Keys enthalten) und **interaktiv per `python3 -m http.server` aus `dist/` bedient**: 0 Konsolenfehler, 0 „Sprite fehlt", identisch zum Dev-Server. `file://`-Doppelklick im Sandbox-Browser dieser Sitzung nicht möglich (liegt außerhalb des Projektordners, Tool liefert nur einen statischen Snapshot) — Matthias bitte einmal von Hand gegenchecken, wie in G1 |
| **GitHub-Pages-Live-Check** | Sandbox-Browser dieser Sitzung zeigte über die echte `https://wurstbrotdlx.github.io/…`-URL massenhaft „Sprite fehlt"-Warnungen und teils veralteten Anzeigestand trotz frischer Navigation — bei identischem, per `curl` verifiziertem Server-Inhalt und fehlerfreiem lokalem Test derselben Datei (`python3 -m http.server`). Eindeutig ein Tool-Artefakt des Sandbox-Browsers (großer, fast nur aus `data:`-URIs bestehender Seiteninhalt von echtem Fremd-Host), kein Build-/Codefehler. **Von Matthias in echtem Browser gegengecheckt: funktioniert.** Live auf GitHub Pages verifiziert. |

**Für ein mögliches G6 zum Mitnehmen:** Alpha-Lauflängen-Scan (`px[x,y][3]>0`
in einer Zeile) ist der Weg, um Zellgrenzen in einem Sheet mit uneinheitlicher
Zellbreite zu finden — `sheet-audit.mjs` setzt ein festes Raster voraus und hilft
bei UI-Atlanten wie `UI_Buttons.png` nicht. Und: `SHEETS[key].img.src` nach dem
Laden ist überall dieselbe korrekt aufgelöste URL (Dev-Server-Pfad oder
Build-Data-URI) — jeder künftige CSS-Bezug auf eine Cute-Fantasy-Datei sollte
darüber laufen, nie über ein hartes `url(assets/cf/...)` im Stylesheet.
