# assets/cf/ — kuratierte Cute-Fantasy-Assets

Dieser Ordner ist das Ziel für Dateien aus der Rohbibliothek `Graphics/` (nicht im
Repo, siehe `.gitignore` und `CREDITS.md`). Kopiert wird ausschließlich, was das
Spiel tatsächlich lädt (gleiches Prinzip wie bei `assets/` mit Sunnyside).

Stand nach U2 vom 21.08.2026 (122 Dateien): `dungeon/`, `player/`, `enemies/`, `tiles/` und
`deco/` (jetzt zusätzlich Dorf-Gebäude, NPC-Staffage, Wetter) sind gefüllt, `ui/`
ist mit G5 dazugekommen. Damit lädt das Spiel ausschließlich noch aus `assets/cf/`
— `assets/Characters/`, `assets/Elements/`, `assets/Tileset/`, `assets/UI/`
(Sunnyside) sind komplett aus dem Repo entfernt, siehe Abschnitt „Von G5 gebraucht"
unten und `CREDITS.md`.

## Diese Unterordner sind nicht im Repo

Kenmis Premium-Lizenz erlaubt kommerzielle Nutzung und Modifikation, untersagt aber
**Weiterverteilung der Dateien, auch modifiziert**. Ein Spiel auszuliefern, in dem die
Grafik steckt, ist der gekaufte Anwendungsfall; original benannte PNGs in einem
öffentlichen Repo abzulegen ist es nicht — dort wären sie als Dateisammlung klonbar.

Deshalb stehen `dungeon/`, `player/`, `enemies/`, `tiles/`, `deco/`, `ui/` in der
`.gitignore` (wie `Graphics/`), und ausgeliefert wird ein **Build**:

```
node tools/build-single.mjs
```

backt alle Grafiken als `data:`-URIs in eine einzige `dist/index.html` (~1,1 MB, ein
HTTP-Request statt ~96, läuft auch ohne Server). Nur diese Datei geht an Beta-Tester
oder auf einen Host. Diese README, `manifest.json` und `audit-report.md` bleiben im
Repo — das sind Beschreibungen (Dateinamen, Rastermaße), keine Bilddaten.

**Wer das Repo klont**, braucht eine eigene Lizenz für die Packs, legt `Graphics/` an
und kopiert daraus nach `assets/cf/`. Die in G1 gebrauchte Dateiliste steht unten.

### Von G1 gebraucht (`dungeon/`)

Aus `Graphics/Cute_Fantasy_Dungeons/`, Originalnamen behalten:

| Zielordner | Dateien |
|---|---|
| `dungeon/Dungeon_1/` | `Dungeon_1.png`, `Dungeon_1_Gate_Closed.png`, `Dungeon_1_Gate_anim.png`, `Dungeon_1_Pillars.png`, `Dungeon_1_Pressure_Plate.png`, `Stairs_Down_SingleFrame.png` |
| `dungeon/Dungeon_2/` | dieselben mit Präfix `Dungeon_2_`, dazu `Dungeon_2_Stairs_Down.png` |
| `dungeon/Objects/` | `Chest_anim.png` |

### Von G2 gebraucht (`player/`)

Aus `Graphics/Cute_Fantasy/Player/`, Originalnamen behalten. Alle Dateien teilen
sich ein 9×56-Raster à 64×64 (Player_Base und jeder Layer sind pixelidentisch
gerastert) — nur 6 Zeilen daraus werden genutzt (idle=1, walk=9, run=45,
attack=18, cast=24, hurt=15, siehe `CF_HERO_ANIMS` in `index.html` für die
Begründung, insbesondere die Ersatzregel für die fehlenden Kampfanimationen).

| Zielordner | Dateien |
|---|---|
| `player/Player_Base/` | `Player_Base_animations.png` |
| `player/Hands/` | `Hands_1_Bare.png` |
| `player/Head/Hair_1..6/` | je eine Farbe: `Hair_1_Brown`, `Hair_2_Blonde`, `Hair_3_Black`, `Hair_4_Ginger`, `Hair_5_Grey`, `Hair_6_Brown` |
| `player/Chest/OG_Shirt/` | `Shirt_1_Red.png` (Rüstungsstufe 0) |
| `player/Chest/Farmer_Shirt/` | `Farmer_Shirt_1_Green.png` (Stufe 1) |
| `player/Chest/Royal_Shirt/` | `Royal_Shirt_1_Blue.png` (Stufe 2) |
| `player/Chest/Plate_Chest/` | `Plate_Chest_Iron.png` (Stufe 3), `Plate_Chest_Gold.png` (Stufe 4) |
| `player/Legs/OG_Pants/` | `Pants_1_Red.png` (Stufe 0) |
| `player/Legs/Farmer_Pants/` | `Farmer_Pants_1_Green.png` (Stufe 1) |
| `player/Legs/Royal_Pants/` | `Royal_Pants_1_Blue.png` (Stufe 2) |
| `player/Legs/Plate_Legs/` | `Plate_Legs_Iron.png` (Stufe 3), `Plate_Legs_Gold.png` (Stufe 4) |
| `player/Feet/` | `Shoes_1_Orange/Black/Blue/Purple/Pink.png` (Stufe 0–4; Braun/Weiß fielen bei der Handprüfung gegen Hautton/Schatten zu schwach aus) |
| `player/Tools/Iron/` | `Iron_Sword.png` (schwebendes Waffen-Icon, ersetzt das alte Emoji) |

**Bewusst nicht kopiert:** `Accessories/Farmer_Hat_1.png` (nur eine einzige Datei,
keine sinnvolle Zufallsvielfalt) und alle weiteren Hair-Farben (6 Style-Slots
reichen für die Frisuren-Zufallsvielfalt, siehe `CF_HAIR` in `index.html`).
*(Der Hut ist seit G9 überholt: er ist dort Trepps und Nieselbecks Dienstmütze
und wird gebraucht. Siehe den G9-Abschnitt unten.)*

### Von G9 gebraucht (`player/`)

Bauabschnitt G9 hat aus der Rüstungsstufe eine **Garderobe** gemacht
(`CF_GARDEROBE` in `index.html`) und dabei vier Dateien in Dienst genommen, die
diese Liste bis zum G9-Nachtrag nicht kannte. Sie lagen deshalb drei
Bauabschnitte lang nicht im Assets-Repo, und was das anrichtete, stand in jeder
Konsole: vier `Sprite fehlt`-Gruppen, und dahinter Wirt Fass und Herr Lott ohne
Hemd. Seit dem G9-Nachtrag sind sie da.

| Zielordner | Datei | Wofür |
|---|---|---|
| `player/Chest/Lumberjack_Shirt/` | `Lumberjack_Shirt_1_Green.png` | Garderobenform `hemd:'karo'`, das offene Arbeitshemd. Trägt Wirt Fass und Herr Lott |
| `player/Accessories/` | `Farmer_Hat_1.png` | Garderobenform `hut:'muetze'`. Die einzige echte Kopfbedeckung des Packs, und auf den Porträts die Dienstmütze von Zusteller Trepp und Herrn Nieselbeck |
| `player/Head/Plate_Helmet_1/` | `Plate_Helmet_1_Iron.png` | Garderobenform `hut:'helm'`. Trägt im Dorf niemand, steht der Vollständigkeit halber |
| `player/Head/Plate_Helmet_2/` | `Heavy_Plate_Helmet_1_Iron.png` | Garderobenform `hut:'helmSchwer'`, dito |

Alle vier liegen in der Rohbibliothek unter `Cute_Fantasy/Player/` und tragen
dasselbe 9x56-Raster à 64x64 wie `Player_Base` — Drop-ins für
`addCfHeroLayer()`, keine Codezeile nötig:

```
Cute_Fantasy/Player/Chest/Lumberjack_Shirt/Lumberjack_Shirt_1_Green.png
Cute_Fantasy/Player/Accessories/Farmer_Hat_1.png
Cute_Fantasy/Player/Head/Plate_Helmet_1/Plate_Helmet_1_Iron.png
Cute_Fantasy/Player/Head/Plate_Helmet_2/Heavy_Plate_Helmet_1_Iron.png
```

**Fehlen sie, läuft das Spiel trotzdem angezogen.** Der G9-Nachtrag hat dafür
`CF_GARDEROBE_ERSATZ` gebaut: das Karohemd fällt auf `hemd` zurück, die Mütze hat
keinen Ersatz (das Pack hat genau eine Kopfbedeckung, und ein Helm auf dem
Zusteller wäre eine andere Figur), die beiden Helme trägt ohnehin niemand. Der
Ersatzweg bleibt stehen, auch jetzt, wo die Dateien da sind — er ist für den
nächsten, der ohne vollständiges Paket klont, und er hat den Fund überhaupt erst
sichtbar gemacht. `garderobeAssert()` meldet beim Start in einer Zeile, was
ersetzt wurde und wer ohne Kopfbedeckung im Dorf steht; mit allen vier Dateien
lautet sie `13 Formen, keine ersetzt.`

**Zur Mütze**, damit es niemand noch einmal misst: `Farmer_Hat_1` ist über alle
zehn Packs hinweg die einzige Kopfbedeckung auf dem Heldenraster, die kein Helm
ist. Sie ist eine breitkrempige Krempe und nicht die flache Schirmmütze, die
Trepps und Nieselbecks Porträts zeigen. Das ist gesehen, verglichen und
entschieden: die Krempe bleibt. Eine Kopfbedeckung, die als solche erkennbar
ist, schlägt eine Mützenfarbe auf einer Frisur.

### Von G11 gebraucht (`deco/Outdoor/`)

Bauabschnitt G11 (Koppel, Schild, Boot). Sechs **handgeschnittene Zellen** aus
`Cute_Fantasy/Outdoor decoration/Fences.png`, ein Schild aus `Signs.png`, das
Boot als fertiges Anim-Blatt.

Geschnitten und nicht als Blatt registriert, weil ein Deko-Eintrag im Spiel
immer `animFrame(sheet, …)` zeichnet und bei `n:1` das Frame 0 seiner Zeile: die
**Spalte** ist so nicht adressierbar, und der Zaun braucht sechs Spalten aus zwei
Zeilen. Dieselbe Lage wie bei `crate`/`pot`/`cobweb` aus G1, derselbe Weg.

Welche Zelle was ist, steht nicht im Dateinamen, sondern in der Alpha-Bounding-Box
je Zelle, von Hand gemessen (der Pfosten sitzt in allen Zellen bei x5–10, sie
fluchten deshalb über Ecken und Kanten):

| Datei | Quelle | Zelle | Bounding-Box | Rolle |
|---|---|---|---|---|
| `deco/Outdoor/fence_h.png` | `Fences.png` | (2,0) | x0–15, y3–13 | Riegel durch die ganze Zelle, kein Pfosten |
| `deco/Outdoor/fence_v.png` | `Fences.png` | (0,1) | x5–10, y0–15 | Pfostenreihe durch die ganze Zelle |
| `deco/Outdoor/fence_tl.png` | `Fences.png` | (1,1) | x5–15, y3–15 | Ecke oben links |
| `deco/Outdoor/fence_tr.png` | `Fences.png` | (3,1) | x0–10, y3–15 | Ecke oben rechts |
| `deco/Outdoor/fence_bl.png` | `Fences.png` | (1,3) | x5–15, y0–13 | Ecke unten links |
| `deco/Outdoor/fence_br.png` | `Fences.png` | (3,3) | x0–10, y0–13 | Ecke unten rechts |
| `deco/Outdoor/sign_post.png` | `Signs.png` | x0,y16, 16x32 | — | Das Schild am Amt |
| `deco/Outdoor/Boat_Anim.png` | `Outdoor_Decor_Animations/Other_Animations/` | unverändert | — | Boot an der Tilgung, **vier Frames zu 48**, nicht 16 |

**Zum Boot:** das Manifest tippt hier wie bei jedem Flächenblatt auf 16x16. Die
wahre Frame-Breite ist über die leeren Spalten gemessen (2–41, 50–90, 98–138,
146–186) und beträgt 48. Der Anker liegt auf der Wasserlinie (y45), nicht an der
Blattunterkante.

### Von G12 gebraucht (`deco/Animals/`, `deco/Outdoor/`)

Bauabschnitt G12 (der Rest des Deko-Steinbruchs): dreiundzwanzig Blätter, davon
neunzehn unverändert und vier geschnitten.

**Neunzehn im Original**, aus `Cute_Fantasy/`:

| Zielordner | Dateien | Quelle |
|---|---|---|
| `deco/Animals/` | `Duck_01.png`, `Duck_02.png` | `Animals/Duck/` |
| `deco/Animals/` | `Swan_01.png` | `Animals/Swan/` |
| `deco/Animals/` | `Goose_01.png` | `Animals/Goose/` |
| `deco/Animals/` | `Frog_01.png`, `Frog_02.png` | `Animals/Frog/` |
| `deco/Animals/` | `Mouse_01.png` | `Animals/Mouse/` |
| `deco/Animals/` | `Butterfly.png` | `Animals/Butterfly/` |
| `deco/Animals/` | `Bee_Flying_Animation.png` | `Animals/Bee/` |
| `deco/Outdoor/` | `Cattail_1..3_Anim.png`, `Lillypad_Green_1..3_Anim.png`, `Water_Grass_1..2_Anim.png` | `Outdoor decoration/Outdoor_Decor_Animations/Water_Decor_Animations/Water_Plants/` |

Alle Raster am PNG gemessen (`node tools/sheet-audit.mjs --rig`), nicht aus
`manifest.json` übernommen. Der Grund steht in der Zahl: für `Frog_01.png`
(320x128) tippt die Heuristik auf `fw8`, also 40 Spalten — vierzig Frames für
einen Frosch. Wahr sind **10x4 zu 32x32**. Dasselbe bei `Mouse_01.png`.

Zwei Funde, die man nur im Kontaktbogen sieht und in keiner Rasterzahl:

* **Ente und Schwan tragen Wasserzeilen.** Zeile 7 ist die Ruhe im Wasser,
  Zeile 8 das Schwimmen, beide mit gemalter Wasserlinie; die Zeilen 10 bis 19
  sind dieselben zehn spiegelverkehrt. Das Spiel lädt genau diese zwei Zeilen.
* **Die Gans hat keine.** Acht Zeilen je Blickrichtung, keine mit Wasserlinie.
  Sie ist im Pack ein Landvogel und wird im Spiel einer.

Dazu: `Butterfly.png` ist 16x64 und enthält zwei Frames Flügelschlag in **acht
Farben**, eine je Zeile (drei davon verbaut). `Frog_01.png` hat vier Zeilen und
keine davon läuft: Blinzeln (2), Quaken (8), Zunge (10), Treffer (4) — deshalb
sitzt der Frosch im Spiel und wandert nicht.

**Vier geschnitten**, erzeugt von `tools/kapybara-freistellen.mjs` (mit `--pruef`
nachrechenbar), klein geschrieben wie jede veränderte Datei hier:

| Datei | Quelle | Zellen |
|---|---|---|
| `deco/Animals/kapybara_idle.png` | `Animals/Kapybara/Static/Kapybara_Idle.png` | 9 |
| `deco/Animals/kapybara_dive.png` | `Animals/Kapybara/Static/Kapybara_Dive.png` | 9 |
| `deco/Animals/kapybara_bubbles.png` | `Animals/Kapybara/Static/Kapybara_Bubbles.png` | 25 |
| `deco/Animals/kapybara_emerge.png` | `Animals/Kapybara/Static/Kapybara_Emerge.png` | 10 |

**Warum geschnitten:** die Kapybara-Blätter sind die einzigen im Pack, die ihren
eigenen Teich mitbringen — drei Viertel jeder Zelle sind ein deckendes Rechteck
Wasser. Der Ton ist rgb(0,149,233) und damit Pixel für Pixel derselbe wie
`Tiles/Water/Water_Middle.png`. Trotzdem passt er nicht: `computeTile()` backt
den Ozean **getönt** (`TILE_TINT.tiefsee`), im Schattenland noch dunkler. Das
Werkzeug nimmt genau diesen einen Ton weg und lässt die Wellenringe (0,109,168)
stehen — die sind Zeichnung, kein Hintergrund. Das Tier liegt seither auf der
wirklichen See, in jedem Band und auf jeder Tönung.

Die zwei übrigen Kapybara-Blätter (`LookAround`, `LookAround_submerged`) und das
ganze Albino-Set bleiben draußen: das Spiel lädt sie nicht, und was das Spiel
nicht lädt, gehört nach der Kopierkonvention unten nicht hierher.

### Von G3 gebraucht (`enemies/`, `deco/`)

19 Monster-Rigs für alle 21 `MONDEF`-Typen (Templar/Swordman/Archer teilen sich je
zwei Typen, s. `CF_RIGS` in `index.html`), plus 4 Hoftiere und 1 Zauber-Projektil.
Zeilen/Anker sind mit `tools/sheet-audit.mjs --rig <Pfad>` gegen die echten Bilder
gemessen (nicht aus `manifest.json` — dessen `unionBBox`/`anchorSuggested` sind über
die Angriffszeile gebildet und bis zu 13px/88% daneben, s. Umsetzungsnotizen G3).

| Zielordner | Dateien | MONDEF-Typ(en) |
|---|---|---|
| `enemies/Goblins/` | `Goblin_Maceman.png`, `Goblin_Thief.png` | goblin, scorpion |
| `enemies/Skeleton/` | `Skeleton_Mage.png` | frostmage |
| `enemies/Skeleton_Bowman/` | `Skeleton_Bowman.png` (aus `.../Merged/`) | mummy |
| `enemies/Knights/` | `Swordman.png`, `Spearman.png`, `Templar.png`, `Archer.png` | frostgolem+stalfos, golem, boss, bossgeneric |
| `enemies/Volcano/` | `Cowling_1.png`, `Cowling_2.png`, `Cowling_Mage_1.png`, `Cowling_Mage_2.png`, `Flying_Skull.png` | demon, crab, sandmage, greenmage, ghost+shadowghost |
| `enemies/Angels/` | `Angel_1.png`, `Angel_2.png` | mage, shadowmage |
| `enemies/ShroomLands/` | `Blue_Shroomling.png` | spider (Ersatz-Rig) |
| `enemies/Slime/` | `Slime_Small_Green.png`, `Slime_Small_Blue.png` | slime, shadow |
| `enemies/Halloween/` | `Bat.png` | bat |
| `deco/Animals/` | `Chicken_01.png`, `Sheep_01.png`, `Cow_01.png`, `Pig_01.png` | Hoftiere (Ambiente, kein MONDEF) |
| `deco/Other/` | `Skeleton_Mage_Projectile.png` | enemyBolts-Sprite aller 5 Magier |

**Bewusst nicht verwendet:** `Skeleton.png` (hat keine Angriffszeile, s.
`_castTable`-Korrektur), `Witch.png`/`Witch_Cauldron_Anim.png` (Cast liegt in einer
separaten Datei mit anderem Frameraster — ein Kessel ist keine Zauber-Animation),
`Orc_Chief/Grunt/Peon.png` (Raster-Konfidenz zu niedrig, ungeprüft), alle übrigen
Skeleton_Swordman-Verwendungen (kein sauberes 32px-Raster, Ersatz s. oben).

### Von W-Lager gebraucht (`enemies/`, `deco/Camp/`)

Das Lager der Beschwerden. Alle Raster mit `tools/sheet-audit.mjs --rig` gegen die PNGs
gemessen, die Deko-Raster zusätzlich an den leeren Spalten und Zeilen der Blätter —
die Heuristik taugt bei Requisitenblättern so wenig wie bei Flächen-Tiles.

| Zielordner | Dateien | Verwendung |
|---|---|---|
| `enemies/Goblins/` | `Goblin_Spearman.png`, `Goblin_Archer.png` | Der Vorbehalt und Die Zwischennachricht. **48×48 im 6×13-Raster**, nicht 32×32 wie das Manifest führte — 624 ist durch 32 nicht teilbar. Damit zeilengleich mit dem verbauten `Goblin_Maceman` |
| `enemies/Orcs/` | `Orc_Chief.png` | Das Empfangsbekenntnis. Das Blatt **mischt drei Raster**: 32×32 für Idle und Lauf, 64×64 für die Angriffszeilen, wieder 32×32 für Sturz und Trefferblitz. Daran ist die G0-Heuristik gescheitert, siehe die G3-Notiz |
| `deco/Camp/` | `palisade_run.png`, `Palisade_Gate_Anim.png`, `Military_Tents.png`, `Lookout_Towers.png`, `Banners_Anim.png`, `Campfire_Pot_Anim.png` | Palisade, Tor, Zelte, Wachtürme, Banner, Kessel. **16-Pixel-Kunst**, im Spiel mit Skalierung 2 gezeichnet — die Dorf-Gebäude aus G5 liegen dagegen schon in 32 Pixeln je Kachel vor |

`palisade_run.png` ist eine handgeschnittene Einzelzelle (Quelle 32,48 16×32), weil
`addSheet`s `'grid'`-Modus keinen Spaltenversatz kennt. Gleiche Ausnahme wie
`crate`/`pot`/`cobweb` aus G1 und die vier UI-Zellen aus G5.

**Bewusst nicht kopiert:** `Catapult.png` und `Cannon.png` (Belagerungsgerät behauptet,
dass etwas passiert — der Witz ist, dass seit vierhundert Jahren nichts passiert),
`Target_Dummys`/`Archery_Target`/`Weapon_Stands` (ein Lager, das seit vierhundert Jahren
wartet, übt nicht), `Palisade.png` als Ganzes (nur die eine Zelle ist geschnitten),
`Mantlet`/`Spiked_Barriers`/`Wood_Spikes`/`Split_Log_Benches`/`Flags_Anim` (Requisiten
ohne Aufgabe), `Orc_Grunt`/`Orc_Archer`/`Orc_Peon` (Raster jetzt geklärt, aber ohne
Vorgangsart gibt es kein Monster).

### Von M3 gebraucht (`enemies/`, `dungeon/Dungeon_3/`)

Bauabschnitt M3, das sechste Katalogbiom (Stollen / Die Sperrablage). Raster und
Anker mit `tools/sheet-audit.mjs --rig` gegen die PNGs gemessen, Boden-UVs wie in G4
per Deckungs- und Mittelfarbscan je Zelle — `sheet-audit.mjs` taugt bei Flächen-Tiles
nichts, das bleibt die G4-Lektion.

| Zielordner | Dateien | Verwendung |
|---|---|---|
| `enemies/Slime/` | `Slime_Big_Blue.png`, `Slime_Medium_Blue.png` (aus `Cute_Fantasy/Enemies/Slime/`) | Die Teilabhilfe und Der Teilbescheid. Beide teilen das 8×4-Raster des schon verbauten `Slime_Small`, nur fw/fh und Fußlinie wachsen mit |
| `enemies/Snails/` | `Snail_1.png` (aus `Cute_Fantasy_ShroomLands/Snails/`) | Der Dienstweg. Bricht das Down/Side/Up-Schema: Zeile 0 ist die Seitenansicht (21px), die Zeilen 1/2 sind Front und Rück (10px) |
| `dungeon/Dungeon_3/` | `Cave_Walls.png`, `Cave_Floor_1.png` (aus `Cute_Fantasy/Tiles/Cave/`) | Boden und sichtbarer Wandring des dritten Kammersatzes |
| `dungeon/Dungeon_3/` | `Cave_Floor_Ladder.png` (dieselbe Quelle, **seit M4**) | der Abstieg in die zweite Ebene und der Einstieg unten. Keine Requisite, sondern eine volle Bodenkachel: Loch samt Sprossen im Braunton von `Cave_Floor_1`, Mittelanker, Faktor 2, deckt genau ihre Kachel |

**Warum Dungeon_3 ein Hybrid ist:** `Cute_Fantasy_Dungeons/Dungeon_3/` ist im Pack ein
**leerer Ordner** — Kenmi liefert kein drittes Set aus. Der Cave-Satz hat Boden, Wände,
Stützen, Leiter, Wasser und Schienen, aber weder Tor noch Säule, Druckplatte oder
Treppe. Der Stollen nimmt deshalb Boden und Wandring aus Cave und behält die Möbel von
Dungeon_2. Der dunkle Ring in `Cave_Walls` bei (64,0) hat exakt dasselbe 3×3-Layout wie
die beiden Dungeon-Blätter, die UV-Tabelle konnte unverändert übernommen werden.

**Bewusst nicht verwendet:** `Cave_Water`/`Cave_Water_Animation`, `Rails.png`,
`Cave_Support_1/2`, `Cave_Floor_2` (ein zweiter Bodenton bringt bei fünf
gestreuten UVs nichts).

`Cave_Floor_Ladder` stand bis M3 aus demselben Grund in dieser Zeile wie die
Schienen: eine Leiter ohne zweite Ebene wäre eine Behauptung. **Seit M4 gibt es
die zweite Ebene**, und damit ist die Leiter keine Behauptung mehr, sondern ihr
Eingang (`phase-m4-zweite-ebene.md`). Für `Rails.png` und `Mine_Cart` gilt der
Satz unverändert weiter: eine Lore ist eine Bewegung mit einem Weg, und die ist
noch nicht gebaut.

### Von G4 gebraucht (`tiles/`, `deco/`)

Boden-UVs per Pixel-Varianzscan gemessen (niedrigste RGB-Varianz unter den voll
opaken 16×16-Zellen = nahtlos wiederholbare Fläche), nicht mit `sheet-audit.mjs`
selbst — das taugt bei flächigen Tiles nichts (jede Zelle ist voll opak). Details
und exakte UVs in `tools/sheet-audit.overrides.json` unter `_g4Tiles`.

| Zielordner | Dateien | Verwendung |
|---|---|---|
| `tiles/` | `Grass_1..4_Middle.png`, `Path_Middle.png`, `Water_Middle.png` (aus `Cute_Fantasy/Tiles/Grass/`, `.../Water/`) | Grasland-Boden (4 Töne statt 2, kein Blüten-Einzeltile im Pack), Weg, Teich/Eis |
| `tiles/` | `Volcano_Tiles.png` (aus `Cute_Fantasy_Volcano/Tiles/`) | Aschewüste-Basalt (2 UVs) + Lava (1 UV), ganzes Blatt geladen, nur 3 Zellen gecroppt |
| `tiles/` | `ShroomLands_Grass_Purple_Tiles.png` (aus `Cute_Fantasy_ShroomLands/Tiles/`) | Schattenland-Boden (2 UVs) — Nutzerentscheidung: echtes Set statt Dunkel-Umfärbung |
| `deco/Trees/` | `Big_Oak_Tree.png`, `Big_Birch_Tree.png`, `Big_Spruce_tree.png` (aus `Cute_Fantasy/Trees/`) | G_TREE (Oak/Birch), G_ICE_TREE (Spruce). Spalte 0 je Datei ist ein Baumstumpf, nicht kopiert relevant, aber im Blatt belassen und beim Zeichnen übersprungen |
| `deco/` | `Volcano_Plants.png` (aus `Cute_Fantasy_Volcano/Volcano_Props/`) | G_CACTUS-Ersatz — kein Kaktus im Pack (Nutzerentscheidung) |
| `deco/` | `Rock_1_Anim.png` (aus `.../Rock_Animations/`) | ersetzt das alte einzelne Sunnyside-`rock`-Sheet 1:1, inkl. bestehender Biom-Tint-Logik |
| `deco/` | `Grass_1_Anim.png` (aus `.../Grass_Animations/`) | Neu: G_TALL bekommt erstmals ein Sprite (Nutzerentscheidung) |
| `deco/` | `muschroom_1_Anim.png`, `muschroom_2_Anim.png` (aus `.../Muschroom_Animations/`) | Pilz-Deko Grasland/Frostkamm |
| `deco/` | `Mushrooms_Purple.png` (aus `Cute_Fantasy_ShroomLands/Props/`) | leuchtende Pilz-Deko Schattenland (Prompt-Wunsch) |
| `deco/` | `Windmill.png` (aus `.../Unique_Buildings/Windmill/`) | Landmarke, nur Rumpf — kein Sail-Overlay (separates Layer, für eine Deko-Landmarke nicht gerechtfertigt) |
| `deco/` | `Torch_Anim.png`, `Campfire_Anim.png` (aus `.../Other_Animations/`) | ersetzen `fire1`/`fire2` (Kessel, Kammer-Fackeln, Magie-Effekt, Boss-Aura) |

**Bewusst nicht verwendet:** `Volcano_Rocks.png`/`Volcano_lava_buble.png` (ein
einzelnes Rock-Sheet für alle Biome reicht, geringeres Risiko als ein zweites
Requisiten-Set), `Cobble_Road`/`Water_Tile_1`/`Volcano_lava_buble` als große
Blob-Tilesets (0/47-Autotile-Aufwand für ein Deko-Feature nicht gerechtfertigt —
flache Einzelkachel wie beim bisherigen `G_ICE` reicht), `Windmill_Sail_Anim.png`
(s. oben), `Cute_Fantasy_Christmass`-Requisiten für Frostkamm-Pilze (Scope-Trim:
Frostkamm nutzt dieselben Grasland-Pilze, s. Umsetzungsnotizen G4).

### Von G5 gebraucht (`ui/`, `deco/Buildings`, `deco/NPCs`, `deco/Weather`)

Letzte Phase: begehbares Dorf, UI-Skin, Sunnyside-Abschied (glint/alert waren die
letzten zwei geladenen Sunnyside-Sheets).

| Zielordner | Dateien | Verwendung |
|---|---|---|
| `deco/Buildings/` | `Inn_Blue.png`, `House_1_Wood_Base_Red.png`, `House_2_Wood_Base_Blue.png`, `House_3_Stone_Base_Blue.png`, `Market_Stalls.png`, `Barn_Base_Red.png` (aus `Cute_Fantasy/Buildings/Buildings/…`) | Dorf-Gebäude als `big:true`-Decos, Amt = Inn (größtes, eindeutigstes Gebäude im Pack) |
| `deco/NPCs/` | `Farmer_Bob.png`, `Bartender_Katy.png`, `Miner_Mike.png` (aus `Cute_Fantasy/NPCs (Premade)/`) | Dorf-Staffage, 64×64-Raster wie Angel_1/2, idle=Zeile1/walk=Zeile4 per Crop bestätigt |
| `deco/NPCs/` | `Lumberjack_Jack.png`, `Chef_Chloe.png`, `Fisherman_Fin.png`, `Farmer_Buba.png`, `Bartender_Bruno.png` (dieselbe Quelle) | Die fünf restlichen `CF_NPCS`-Blätter, nachgelegt am 21.08.2026 (G6-Nachtrag). Damit trägt jede der acht wandernden Dorffiguren ihr eigenes Rig |
| `deco/Weather/` | `Clouds.png`, `Wind_Anim.png` (aus `Cute_Fantasy/Weather effects/`) | Grasland-Wolkenschatten, Aschewüste-Windböen. Schnee (Frostkamm) braucht kein Sprite, reine Canvas-Punkte |
| `ui/` | `frame_brown.png`, `round_brown.png`, `glint_strip.png`, `alert.png` | UI-Skin-Rahmen/Rundknöpfe, glint-/alert-Ersatz — alle vier sind Einzelzell-Ausschnitte, siehe Ausnahme unten |

**Zu den acht NPC-Blättern.** `CF_NPCS` in `index.html` trägt acht Einträge. Von G5 bis zum
20.08.2026 lagen nur die drei ersten hier, und Zapf, Lisbeth, Trepp, Milb und Fass standen
unsichtbar im Dorf; seit G6 fällt jede Figur ohne Blatt auf ein Held-Komposit zurück
(Frisur/Kleidung je Figur in `DORF_FIGUREN.gestalt`), das Spiel ist also auch ohne sie
vollständig. Seit dem 21.08.2026 liegen alle acht hier — `npcBlaetter()` fragt `SHEETS` und
nicht eine Liste im Code, es war deshalb keine Codeänderung nötig. Der Start meldet in einer
Zeile, welche Figuren gerade als Komposit laufen; steht sie nicht da, laufen alle mit
eigenem Rig. Zum Raster von `Fisherman_Fin` (9 Spalten à 64, nicht 18 à 32 wie das Manifest
bis dahin führte) siehe `phase-g6-nachtrag-dorfblaetter.md`.

**Bewusst nicht verwendet:** `Church`/`Blacksmith_House` als Amt-Alternativen (Inn
wirkte im Vergleich am ehesten nach „Amt", reine Optik-Entscheidung), `Tent_*`
(passt nicht zum Steinhaus-Look der übrigen Gebäude), `Cute_Fantasy_UI/Fonts/*`
(keine ä/ö/ü/ß-Glyphen im TTF, per `fontTools`-Cmap-Check bestätigt — Systemfont
bleibt, s. Umsetzungsnotizen G5), `Loading_Icon.png` als Glint-Ersatz (Kreis-
Spinner, keine Funkel-Optik), restliche `UI_Icons.png`/`UI_Buttons.png`/
`UI_Frames.png`-Zellen (nur die vier unten dokumentierten Einzelzellen sind
kopiert, das große Sheet selbst bleibt in `Graphics/`).

**Zusätzliche Ausnahme von „Originaldateinamen"** (wie schon `crate.png`/`pot.png`/
`cobweb.png` aus G1): vier pixelgenau geschnittene Einzelzellen, weil `addSheet`s
`'grid'`-Modus keinen Spaltenversatz kennt (nur `rowStart`) — ein Ausschnitt aus
der Mitte eines Sheets braucht also eine eigene Datei, kein Referenzieren einer
Zelle im großen Blatt:

- `ui/frame_brown.png` — `UI_Frames.png`, Zelle (0,0), Quelle 0,0 48×48, auf die
  sichtbare Form zugeschnitten (Bounding-Box 10,10–38,41 im Original).
- `ui/round_brown.png` — `UI_Buttons.png`, Quelle 96,0 16×16 (Bounding-Box 1,1–15,15).
- `ui/glint_strip.png` — `UI_Icons.png`, Zeile 3 Spalten 9–11, Quelle 144,48 48×16
  (voller/halber/leerer blauer Stern als 3-Frame-Zwinker-Ersatz für die alte
  6-Frame-Sunnyside-Animation — im Pack keine mehrframige Funkel-Animation).
- `ui/alert.png` — `UI_Icons.png`, Zeile 2 Spalte 12, Quelle 192,32 16×16.

### Von U2 gebraucht (`ui/`)

Vier weitere Einzelzellen, damit die Menues Pack-Grafik tragen statt CSS, das Pixelkunst
nachahmt. Anders als die vier aus G5 sind sie **nicht von Hand geschnitten**: die
Koordinaten stehen als Tabelle in `tools/ui-zellen.mjs`, das Werkzeug schneidet sie aus
`Graphics/` und rechnet mit `--pruef` nach, ob die Dateien hier noch dem Schnitt
entsprechen. Zusammen 1098 Byte.

| Datei | Quelle | Rect | Verwendung |
|---|---|---|---|
| `ui/slot_dark.png` | `UI_Buttons.png` | (129,17) 14x14 | Beutel-, Ausruestungs-, Zutaten- und Symbolfelder |
| `ui/btn_close.png` | `UI_Buttons.png` | (737,33) 14x14 | Schliessknopf aller acht Panels mit Kopfband |
| `ui/btn_pill.png` | `UI_Buttons.png` | (1,17) 30x14 | Kochknopf, Overlay-Knoepfe, Amtsstuben-Knopf |
| `ui/sel_white.png` | `UI_Selectors.png` | (11,10) 26x28 | Auswahlrahmen: Feld unter dem Zeiger, aktiver Zauber |

**Bewusst nicht verwendet:** `UI_Premade.png` (113,33) — das Feld aus der fertigen
Beuteltafel des Packs, der naheliegende Kandidat fuer `slot_dark`. Es ist fuer eine HELLE
Tafel gezeichnet: seine vier abgerundeten Ecken zeigen deren Grund (228,166,114), und auf
dem dunklen Panel des Ministeriums leuchten daraus vier lachsfarbene Eckpunkte. Dieselbe
Falle steckt in allen `UI_Frames`-Zellen. Ausserdem liegen gesichtet, aber unverbaut:
`UI_Ribbons` (Spruchbaender, Mitte hoeher als die Enden, geht nicht als border-image),
`Book_UI` (Buchgruende und Lesebaendchen, beides hell), `UI_Bars` (gehoert ins HUD),
`UI_ALL` (Sammelblatt, 181 KB). *(Bis U11 stand hier auch `UI_Icons`/`UI_Button_Icons` mit der Begruendung "der Guertel traegt Emoji". Genau das ist seit U11/U12 nicht mehr wahr, siehe den Abschnitt darunter.)*
Begruendung je Posten in `phase-u2-menuegrafik.md`.

### Von U11 und U12 gebraucht (`ui/ico_*.png`)

Achtundzwanzig Sinnbilder aus **vier** Blaettern (`UI_Icons`, `UI_Crosshairs`, `UI_Button_Icons`, `UI_Bars` und den Speise-Icons des Hauptpacks), geschnitten aus derselben Tabelle in `tools/ui-zellen.mjs`
und mit `--pruef` nachrechenbar. Sie ersetzen die System-Emoji der Bedienoberflaeche:
U11 die neun Bedienknoepfe, U12 Kopfband, Reiterband, Panelkoepfe, Befaehigung und die
vier Dinge, die als Emoji ins Bild gemalt wurden. Zusammen rund 8,7 KB.

| Datei | Quelle | Rect | Verwendung |
|---|---|---|---|
| `ico_schlag.png` | `UI_Icons.png` | (112,16) | Schlagknopf |
| `ico_trank.png` | `Food_Icons_NO_Outline.png` | (112,128) | Trankknopf, Trank im Feld |
| `ico_zauber.png` | `UI_Icons.png` | (144,48) | Zauberbaum, Reiter |
| `ico_rucksack.png` | `UI_Icons.png` | (144,32) | Rucksack, Reiter, Tasche |
| `ico_charakter.png` | `UI_Icons.png` | (192,16) | Charakterfenster, Reiter |
| `ico_ziel.png` | `UI_Crosshairs.png` | (0,128) | Zielwahl am Faecher |
| `ico_sperre.png` | `UI_Icons.png` | (208,80) | gesperrter Zauber, gesperrtes Ultimate |
| `ico_abbruch.png` | `UI_Icons.png` | (176,80) | Kammer verlassen |
| `ico_hand.png` | `UI_Icons.png` | (48,224) | Kontextknopf |
| `ico_gold.png` | `UI_Icons.png` | (96,0) | Beute, Amtskasse, Muenzen im Feld |
| `ico_zahnrad.png` | `UI_Icons.png` | (32,16) | Optionen, Reiter |
| `ico_ton.png` | `UI_Icons.png` | (160,64) | Ton-Abschnitt, Musikknopf an |
| `ico_ton_aus.png` | `UI_Icons.png` | (176,64) | Musikknopf aus |
| `ico_schrift.png` | `UI_Button_Icons.png` | (160,32) | Schrift-Abschnitt |
| `ico_speicher.png` | `UI_Icons.png` | (144,16) | Spielstand-Abschnitt |
| `ico_kladde.png` | `UI_Icons.png` | (176,16) | Kladde, Reiter |
| `ico_akten.png` | `UI_Icons.png` | (208,16) | Akten, Reiter |
| `ico_amtskunde.png` | `UI_Icons.png` | (160,16) | Befaehigung: Amtskunde |
| `ico_ruestung.png` | `UI_Icons.png` | (192,0) | Ausruestungs-Abschnitt |
| `ico_schluessel.png` | `UI_Icons.png` | (208,48) | Symbolschloss, Panel und Feld |
| `ico_brief.png` | `UI_Icons.png` | (224,16) | Aktentafel im Feld |
| `ico_kraft.png` | `UI_Icons.png` | (16,16) | Befaehigung: Kraft |
| `ico_herz.png` | `UI_Icons.png` | (0,0) | Befaehigung: Zaehigkeit |
| `ico_blitz.png` | `UI_Icons.png` | (144,0) | Befaehigung: Behaendigkeit |
| `ico_werte.png` | `UI_Bars.png` | (0,0) | Werte-Abschnitt (Balkenstapel) |
| `ico_dienst.png` | `UI_Icons.png` | (64,16) | Im Dienst, Dienstausweis |
| `ico_zettel.png` | `UI_Icons.png` | (0,16) | Dienstzettel, Dienstbericht |
| `ico_kessel.png` | `Food_Icons_NO_Outline.png` | (16,64) | Kessel, Kochen, Verarbeitung, Reiter |

**Bewusst nicht verwendet:** die fertigen Knoepfe MIT eingelegtem Zeichen aus
`UI_Buttons.png` (ab x=144) und `UI_ALL.png`. Sie waeren die Abkuerzung und tragen die
falschen Sinnbilder: Pause, Wiedergabe, Note, Ein/Aus, Lautstaerke, Haus, Pfeile,
Buchstaben. Kein Schwert, kein Trank, kein Rucksack. `UI_Button_Icons.png` traegt trotz
seines Namens Gamepad- und Tastaturglyphen; genau eine Zelle daraus ist gebraucht, das
grosse A.

**Der Trank und das Einmachglas kommen ausdruecklich aus dem Ordner `No Outline`** des
Hauptpacks, obwohl der Name das Gegenteil verspricht: genau diese Fassung traegt
denselben DUNKLEN Rand wie alle `UI_Icons`, waehrend die im Ordner `Outline` einen
zusaetzlichen cremefarbenen darum legt. Auf dem hellen Achteck verschwaende der, und im
selben Fenster stuenden zwei verschiedene Randfarben nebeneinander.

**Diese achtundzwanzig duerfen fehlen, aber nur gemeinsam.** Sie sind mit
`optional:true` registriert, und `bakeUiSkin()` setzt die Klasse `body.cfuiIco` nur,
wenn ALLE da sind — fehlt eine, bleibt jedes Sinnbild ein Emoji und die Konsole nennt
die fehlende beim Namen. Vier gezeichnete und vier fremde Zeichen nebeneinander waeren
schlechter als acht fremde. Begruendung je Posten in `phase-u11-sinnbilder.md` und
`phase-u12-sinnbilder-rest.md`.

**Diese vier duerfen fehlen.** Sie sind mit `optional:true` registriert; `bakeUiSkin()`
setzt die zugehoerigen CSS-Variablen dann nicht, und die Menues fallen auf den
CSS-Anstrich aus U1 zurueck. Geprueft, siehe Pruefprotokoll dort.

### Von der IN1-Nachlese gebraucht (`innen/`)

Zwölf Dateien, zusammen 7 KB. Sie entstehen nicht von Hand, sondern mit
`node tools/innen-zellen.mjs`; die Koordinatentabelle steht dort im Quelltext und
`--pruef` rechnet sie nach. Dieselbe Haltung wie bei `tools/ui-zellen.mjs`:
gemessen, nicht geraten.

Aus `Cute_Fantasy/Buildings/Houses_Interiors/`, ganze Blätter:

| Ziel | Quelle | Maße | wofür |
|---|---|---|---|
| `innen/boden.png` | `Wood_Floor_Tiles.png` | 128×128 | Böden aller drei Räume, als 2×2-Muster gelesen |
| `innen/wand_holz.png` | `Wood_Wall_Fillers.png` | 64×32 | Wand im Wirtshaus |
| `innen/wand_stein.png` | `Stone_Wall_Fillers.png` | 32×32 | Wand im Amt |
| `innen/wand_ziegel.png` | `Brick_Wall_Fillers.png` | 32×32 | Wand in der Registratur |

Aus `Cute_Fantasy/Buildings/House_Decor/`, ganze Blätter:

| Ziel | Quelle | Maße | wofür |
|---|---|---|---|
| `innen/regale.png` | `BookShelves.png` | 192×112 | Aktenregale, schmal (14×30) und breit (30×30) |
| `innen/kamin.png` | `Fireplaces.png` | 96×48 | Herdfeuer, der mittlere der drei |

Und geschnitten, weil aus einem großen Blatt je eine einzige Zelle gebraucht wird
(aus `Tables.png` genau ein Tisch, aus `House_Plants.png` genau eine Pflanze —
ganz eingebacken wären das 29 KB für zwei Möbel):

| Ziel | Quelle | Ausschnitt | wofür |
|---|---|---|---|
| `innen/tisch.png` | `Tables.png` | 72,88 34×33 | Wirtshaustisch, zwei Kacheln breit |
| `innen/stuhl.png` | `Chairs.png` | 18,40 12×23 | Der freigehaltene Platz |
| `innen/pult.png` | `Furniture_Other.png` | 0,283 32×21 | Dienstpult im Amt |
| `innen/schreibtisch.png` | `Furniture_Other.png` | 128,283 32×21 | Der Schreibtisch der Amtsleitung |
| `innen/kommode.png` | `Furniture_Other.png` | 32,283 32×21 | Nörgels Schreibtisch, Bramsches Pult |
| `innen/pflanze.png` | `House_Plants.png` | 32,2 16×30 | Die Pflanze auf dem Schreibtisch |

**Alle zwölf sind im Spiel als `optional` registriert.** Das ist kein
Sicherheitsnetz aus Vorsicht, sondern eine Reihenfolgefrage: die lizenzierte
Grafik kommt im Pages-Build aus `wurstbrotdlx/superduper-adventure-assets`, und
bis die zwölf dort liegen, gibt es sie im ausgelieferten Spiel nicht. Fehlen sie,
fällt IN1 auf seine gezeichnete Fassung zurück (überfärbte Kammerblätter, Möbel
aus ctx-Grundformen) statt leere Räume zu zeigen. `tools/innen-pruef.mjs` löst
diesen Weg ausdrücklich aus, damit er keine Behauptung bleibt.

Was **nicht** aus dem Pack kommt, obwohl es Innenraumblätter gibt: die Theke im
Wirtshaus, die Bank, der Aktenstapel. `Kitchen.png` ist eine Frontansicht
(Hängeschränke von vorn), `Chairs.png` hat Sofas statt Wirtshausbänke, und ein
Küchenschrank ist ohnehin keine Schankstube. Die drei bleiben gezeichnet.

## Kopierkonvention

- Originaldateinamen aus `Graphics/` behalten.
- Unterordner je Kategorie, flacher als die Rohbibliothek:
  ```
  assets/cf/
    player/     Player_Base + Ausrüstungs-Layer
    enemies/    alle Gegner-Rigs (Skeleton, Skeleton_Bowman, Slime, Goblins, Knights,
                Angels, Volcano/Cowlings+Flying_Skull, ShroomLands, Halloween/Bat)
    dungeon/    Dungeon_1/Dungeon_2-Sets, Objects
    tiles/      Grass/Cliff/Water/Beach/Cobble_Road/FarmLand etc.
    deco/       Bäume, Tiere, Outdoor decoration, Buildings, NPCs, Weather
    ui/         Cute_Fantasy_UI
  ```
- Ausnahme von „Originaldateinamen": aus `Objects/Dungeon_Objects.png` (Sammelblatt
  mit 29 losen Requisiten ohne Raster) sind in G1 drei Einzelobjekte pixelgenau
  ausgeschnitten worden — `Objects/crate.png` (Holzkiste, Quelle 0,8 20×26),
  `Objects/pot.png` (Tonkrug, Quelle 81,14 14×16), `Objects/cobweb.png`
  (Spinnwebe, Quelle 110,0 18×16). Das spart das 144×96-Blatt im Repo und macht
  die Anker eindeutig.

## Woher kommen die Zahlen

`manifest.json` und `audit-report.md` sind Ausgaben von `tools/sheet-audit.mjs`
(siehe dort für die Methode: Alpha-Bounding-Box-Analyse, nicht Dateiname-Raten).
Handkorrekturen und Animations-Zuordnungen stehen in
`tools/sheet-audit.overrides.json` — bei jeder Korrektur dort das Script neu laufen
lassen, damit `manifest.json`/`audit-report.md` aktuell bleiben.
