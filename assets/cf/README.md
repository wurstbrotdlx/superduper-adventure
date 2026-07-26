# assets/cf/ — kuratierte Cute-Fantasy-Assets

Dieser Ordner ist das Ziel für Dateien aus der Rohbibliothek `Graphics/` (nicht im
Repo, siehe `.gitignore` und `CREDITS.md`). In G0 ist er noch **leer** (nur diese
README und die Audit-Ausgabe) — kopiert wird erst in G1–G5, und zwar ausschließlich,
was das Spiel tatsächlich lädt (gleiches Prinzip wie bei `assets/` mit Sunnyside).

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
- Beim Kopieren bekommt der Manifest-Eintrag (`assets/cf/manifest.json`) ein
  zusätzliches Feld `assetPath`, damit nachvollziehbar bleibt, woher eine Datei
  stammt (`path` bleibt der `Graphics/`-relative Originalpfad).

## Woher kommen die Zahlen

`manifest.json` und `audit-report.md` sind Ausgaben von `tools/sheet-audit.mjs`
(siehe dort für die Methode: Alpha-Bounding-Box-Analyse, nicht Dateiname-Raten).
Handkorrekturen und Animations-Zuordnungen stehen in
`tools/sheet-audit.overrides.json` — bei jeder Korrektur dort das Script neu laufen
lassen, damit `manifest.json`/`audit-report.md` aktuell bleiben.
