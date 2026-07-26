# assets/cf/ — kuratierte Cute-Fantasy-Assets

Dieser Ordner ist das Ziel für Dateien aus der Rohbibliothek `Graphics/` (nicht im
Repo, siehe `.gitignore` und `CREDITS.md`). Kopiert wird ausschließlich, was das
Spiel tatsächlich lädt (gleiches Prinzip wie bei `assets/` mit Sunnyside).

Stand nach G1: nur `dungeon/` ist gefüllt (Kammer-Interieur). `player/`, `enemies/`,
`tiles/`, `deco/`, `ui/` folgen in G2–G5.

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

## Kopierkonvention

- Originaldateinamen aus `Graphics/` behalten.
- Unterordner je Kategorie, flacher als die Rohbibliothek:
  ```
  assets/cf/
    player/     Player_Base + Ausrüstungs-Layer
    enemies/    alle Gegner-Rigs (Skeleton, Slime, Goblins, Knights, Orcs, Angels,
                Cowlings, Flying_Skull, Shroomlings, Snails, Witch + Cauldron_Anim)
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
