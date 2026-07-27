# assets/cf/ — kuratierte Cute-Fantasy-Assets

Dieser Ordner ist das Ziel für Dateien aus der Rohbibliothek `Graphics/` (nicht im
Repo, siehe `.gitignore` und `CREDITS.md`). Kopiert wird ausschließlich, was das
Spiel tatsächlich lädt (gleiches Prinzip wie bei `assets/` mit Sunnyside).

Stand nach G4: `dungeon/` (Kammer-Interieur), `player/` (Held), `enemies/` (alle 21
Monster-Rigs), `deco/` (Hoftiere, Zauber-Projektil, Bäume, Requisiten, Landmarke,
Feuer) und `tiles/` (Boden aller 3 Biome plus Schattenland) sind gefüllt. `ui/`
folgt in G5.

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
    deco/       Bäume, Tiere, Outdoor decoration, Weather effects
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
