# Cute Fantasy Sheet-Audit

Erzeugt von `tools/sheet-audit.mjs`. 978 Sheets ausgewertet, 0 Fehler, Laufzeit 32.4s.

## Nach Pack

- **Cute_Fantasy**: 717 Sheets (495 inferiert, 216 per Regel, 6 per Override)
- **Cute_Fantasy_Characters**: 14 Sheets (14 inferiert, 0 per Regel, 0 per Override)
- **Cute_Fantasy_Christmass**: 9 Sheets (9 inferiert, 0 per Regel, 0 per Override)
- **Cute_Fantasy_Desert**: 92 Sheets (77 inferiert, 15 per Regel, 0 per Override)
- **Cute_Fantasy_Dungeons**: 51 Sheets (11 inferiert, 34 per Regel, 6 per Override)
- **Cute_Fantasy_Halloween**: 15 Sheets (15 inferiert, 0 per Regel, 0 per Override)
- **Cute_Fantasy_MilitaryCamp**: 16 Sheets (16 inferiert, 0 per Regel, 0 per Override)
- **Cute_Fantasy_ShroomLands**: 33 Sheets (25 inferiert, 8 per Regel, 0 per Override)
- **Cute_Fantasy_UI**: 18 Sheets (18 inferiert, 0 per Regel, 0 per Override)
- **Cute_Fantasy_Volcano**: 13 Sheets (9 inferiert, 4 per Regel, 0 per Override)

## Niedrige Confidence (< 0.15, gridSource=inferred)

477 von 978 Sheets insgesamt unter der Schwelle (29 davon G1-G3-Prioritätsrigs, siehe Cast-Tabelle unten). Confidence misst nur den Abstand zur zweitbesten Alternative — bei Sheets mit vielen Teilerharmonien (z.B. 32/16/64) bleibt er auch bei korrektem Raster niedrig, siehe G0-Umsetzungsnotizen. Volle Liste in `assets/cf/manifest.json` (Feld `confidence`).

### Davon Prioritätsrigs (per Hand gegen das PNG geprüft, siehe Cast-Tabelle für Ergebnis)

| Pfad | Maße | bestes Raster | confidence | Alternativen |
|---|---|---|---|---|
| Cute_Fantasy_Characters/Angels/Angel_1.png | 512x832 | 64x64 (8x13) | 0.125 | 64x32 (5.47), 32x64 (5.45) |
| Cute_Fantasy_Characters/Angels/Angel_2.png | 512x832 | 64x64 (8x13) | 0.125 | 64x32 (5.47), 32x64 (5.45) |
| Cute_Fantasy_Characters/Goblins/Goblin_Archer.png | 288x624 | 48x48 (6x13) | 0.088 | 48x16 (5.702), 48x26 (5.668) |
| Cute_Fantasy_Characters/Goblins/Goblin_Maceman.png | 192x416 | 32x32 (6x13) | 0.121 | 16x32 (5.233), 32x16 (5.154) |
| Cute_Fantasy_Characters/Goblins/Goblin_Spearman.png | 288x624 | 48x48 (6x13) | 0.081 | 24x48 (4.931), 36x48 (4.877) |
| Cute_Fantasy_Characters/Goblins/Goblin_Thief.png | 192x416 | 32x32 (6x13) | 0.127 | 32x16 (5.454), 16x32 (5.416) |
| Cute_Fantasy_Characters/Knights/Archer.png | 288x624 | 48x48 (6x13) | 0.087 | 48x16 (5.706), 48x26 (5.366) |
| Cute_Fantasy_Characters/Knights/Spearman.png | 288x624 | 48x48 (6x13) | 0.145 | 48x24 (5.345), 24x48 (5.291) |
| Cute_Fantasy_Characters/Knights/Swordman.png | 288x624 | 48x48 (6x13) | 0.055 | 48x26 (5.408), 48x16 (5.069) |
| Cute_Fantasy_Characters/Knights/Templar.png | 288x624 | 48x48 (6x13) | 0.145 | 48x24 (5.345), 24x48 (5.291) |
| Cute_Fantasy_Characters/Orcs/Orc_Archer.png | 288x624 | 48x48 (6x13) | 0.147 | 48x24 (5.329), 24x48 (5.307) |
| Cute_Fantasy_Characters/Orcs/Orc_Chief.png | 512x512 | 64x32 (8x16) | 0.018 | 32x32 (4.358), 16x32 (4.294) |
| Cute_Fantasy_Characters/Orcs/Orc_Grunt.png | 512x512 | 64x32 (8x16) | 0.083 | 64x16 (5.141), 32x32 (4.864) |
| Cute_Fantasy_Characters/Orcs/Orc_Peon.png | 384x512 | 64x32 (6x16) | 0.066 | 32x32 (4.768), 64x16 (4.676) |
| Cute_Fantasy_Halloween/Witch/Witch.png | 192x288 | 32x32 (6x9) | 0.135 | 16x32 (5.244), 32x16 (5.182) |
| Cute_Fantasy_ShroomLands/Snails/Snail_1.png | 64x192 | 32x32 (2x6) | 0.131 | 32x16 (5.432), 16x32 (5.25) |
| Cute_Fantasy_Volcano/Enemies/Cowling_1.png | 288x624 | 48x48 (6x13) | 0.145 | 48x24 (5.345), 24x48 (5.307) |
| Cute_Fantasy_Volcano/Enemies/Cowling_2.png | 288x624 | 48x48 (6x13) | 0.145 | 48x24 (5.345), 24x48 (5.307) |
| Cute_Fantasy_Volcano/Enemies/Cowling_Mage_1.png | 288x624 | 48x48 (6x13) | 0.121 | 12x48 (4.717), 48x26 (4.66) |
| Cute_Fantasy_Volcano/Enemies/Cowling_Mage_2.png | 288x624 | 48x48 (6x13) | 0.121 | 12x48 (4.717), 48x26 (4.66) |
| Cute_Fantasy_Volcano/Enemies/Flying_Skull.png | 192x128 | 32x16 (6x8) | 0.082 | 8x16 (2.331), 16x16 (2.142) |
| Cute_Fantasy/Enemies/Bombschroom/Bombschroom.png | 176x336 | 16x16 (11x21) | 0.112 | 8x16 (4.263), 16x8 (3.729) |
| Cute_Fantasy/Enemies/Skeleton/Skeleton_Bowman/Merged/Skeleton_Bowman.png | 192x416 | 32x32 (6x13) | 0.129 | 32x16 (5.441), 16x32 (5.432) |
| Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png | 256x416 | 32x32 (8x13) | 0.125 | 32x16 (5.47), 16x32 (5.45) |
| Cute_Fantasy/Enemies/Skeleton/Skeleton_Swordman.png | 256x512 | 64x32 (4x16) | 0.101 | 64x16 (5.35), 32x32 (5.093) |
| Cute_Fantasy/Enemies/Skeleton/Skeleton.png | 192x320 | 32x32 (6x10) | 0.126 | 32x16 (5.461), 16x32 (5.432) |
| Cute_Fantasy/Enemies/Slime/Slime_Big/Slime_Big_Blue.png | 512x256 | 64x64 (8x4) | 0.128 | 32x64 (3.134), 64x32 (3.101) |
| Cute_Fantasy/Enemies/Slime/Slime_Medium/Slime_Medium_Blue.png | 256x128 | 32x32 (8x4) | 0.128 | 16x32 (5.45), 32x16 (5.393) |
| Cute_Fantasy/Enemies/Slime/Slime_Small/Slime_Small_Blue.png | 128x64 | 16x16 (8x4) | 0.148 | 8x16 (5.325), 16x8 (5.143) |

### Rest (448, nicht G1-G3-Priorität, ungeprüft)

- **Cute_Fantasy**: 372 Sheets
- **Cute_Fantasy_Christmass**: 6 Sheets
- **Cute_Fantasy_Desert**: 36 Sheets
- **Cute_Fantasy_Dungeons**: 3 Sheets
- **Cute_Fantasy_Halloween**: 9 Sheets
- **Cute_Fantasy_MilitaryCamp**: 5 Sheets
- **Cute_Fantasy_ShroomLands**: 5 Sheets
- **Cute_Fantasy_UI**: 9 Sheets
- **Cute_Fantasy_Volcano**: 3 Sheets

Diese werden erst geprüft, wenn eine spätere Phase sie tatsächlich braucht (nicht spekulativ in G0).

## Decode-Fehler

Keine.

## Rigs mit/ohne Cast-Animation

Per Hand am PNG geprüft (`checked: true`) oder von einem geometrisch identischen Geschwister-Sheet übertragen (`checked: false`). Lektion aus dem Sunnyside-Umzug: Magier-Typen müssen zwingend auf einem Rig mit Cast laufen, nie auf einem Fallback-Rig ohne.

| Rig | Sheet | Cast? | Geprüft | Notiz |
|---|---|---|---|---|
| Skeleton | `Cute_Fantasy/Enemies/Skeleton/Skeleton.png` | nein | ja | KORRIGIERT in G3: hat GAR KEINE Angriffszeile, nicht 'reiner Nahkampf'. Per-Zeilen-BBox (10 Zeilen) zeigt Zeilen 7-9 pixelidentisch zu Zeilen 0-2 (idle) - das sind idle-artige hurt-Posen, keine Attacke. Zeile 6 (Kollaps, breiter/y-versetzt) ist death. Reihenfolge: idle(0-2)/walk(3-5)/death(6)/hurt(7-9). Ohne Angriffszeile in G3 nicht verwendet, siehe assets/cf/manifest.json rowFrames [6,6,6,6,6,6,4,4,4,4]. |
| Skeleton_Mage | `Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png` | **ja** | ja | Lila Glutball-Effekt sichtbar in Zeilen 6-8 von 13. Cast-faehig. G3-Praezisierung: die tatsaechlich nutzbare Seiten-Cast-Zeile ist Zeile 7 (nicht 8) - Bildvergleich zeigt Zeile 8 ist die Ruecken-Ansicht (kein Gesicht sichtbar, wie Zeile 2 der Idle-Ansicht), Zeile 7 ist die Seiten-Ansicht mit sichtbarem Zauberstab-Funken, exakt das Gegenstueck zur schmaleren Seiten-Zeile 1/4/11 bei idle/walk/hurt. |
| Skeleton_Swordman | `Cute_Fantasy/Enemies/Skeleton/Skeleton_Swordman.png` | nein | ja | Klingen-Slash sichtbar, kein Magie-Effekt. |
| Skeleton_Bowman | `Cute_Fantasy/Enemies/Skeleton/Skeleton_Bowman/Merged/Skeleton_Bowman.png` | nein | ja | Pfeil/Bogen sichtbar, physischer Fernkampf, kein Magie-Glow. Fernkampf ungleich Cast. |
| Slime_Small | `Cute_Fantasy/Enemies/Slime/Slime_Small/Slime_Small_Blue.png` | nein | ja | Einfache Blob-Bewegung. |
| Slime_Medium | `Cute_Fantasy/Enemies/Slime/Slime_Medium/Slime_Medium_Blue.png` | nein | ja | Wie Slime_Small. |
| Slime_Big | `Cute_Fantasy/Enemies/Slime/Slime_Big/Slime_Big_Blue.png` | nein | nein (Geschwister übertragen) | Ungeprueft, identisches Muster zu Small/Medium erwartet. |
| Bombschroom | `Cute_Fantasy/Enemies/Bombschroom/Bombschroom.png` | nein | ja | Selbstzerstoerung/Explosion als Angriff (breiteste Zeile vermutlich Burst-Frame), kein Zauber-Glow. |
| Goblin_Archer | `Cute_Fantasy_Characters/Goblins/Goblin_Archer.png` | nein | ja | Bogen, physischer Fernkampf. |
| Goblin_Maceman | `Cute_Fantasy_Characters/Goblins/Goblin_Maceman.png` | nein | ja | Nahkampf mit Keule. |
| Goblin_Spearman | `Cute_Fantasy_Characters/Goblins/Goblin_Spearman.png` | nein | nein (Geschwister übertragen) | Ungeprueft, identisches 13-Zeilen-Raster (288x624, 48x48) wie Goblin_Archer, gleiche Faktenlage erwartet. |
| Goblin_Thief | `Cute_Fantasy_Characters/Goblins/Goblin_Thief.png` | nein | nein (Geschwister übertragen) | Ungeprueft, physischer Dieb-Typ erwartet. |
| Knights_Archer | `Cute_Fantasy_Characters/Knights/Archer.png` | nein | nein (Geschwister übertragen) | Identisches Raster/Optik-Familie zu Templar (stichprobengeprueft), physisch erwartet. |
| Knights_Spearman | `Cute_Fantasy_Characters/Knights/Spearman.png` | nein | nein (Geschwister übertragen) | Wie Knights_Archer. |
| Knights_Swordman | `Cute_Fantasy_Characters/Knights/Swordman.png` | nein | nein (Geschwister übertragen) | Wie Knights_Archer. |
| Knights_Templar | `Cute_Fantasy_Characters/Knights/Templar.png` | nein | ja | Stichprobe: kein Glow, rein physisch (Schwert/Schild). |
| Orc_Chief | `Cute_Fantasy_Characters/Orcs/Orc_Chief.png` | nein | ja | Zeilen 7-12 zeigen Posen mit wechselnden Gegenstaenden (evtl. Carry-Animationen), kein Magie-Glow. |
| Orc_Grunt | `Cute_Fantasy_Characters/Orcs/Orc_Grunt.png` | nein | nein (Geschwister übertragen) | Ungeprueft, identisches 16-Zeilen-Raster (512x512) wie Orc_Chief. |
| Orc_Peon | `Cute_Fantasy_Characters/Orcs/Orc_Peon.png` | nein | nein (Geschwister übertragen) | Ungeprueft, aehnliches 16-Zeilen-Raster (384x512, 6 statt 8 Spalten). |
| Orc_Archer | `Cute_Fantasy_Characters/Orcs/Orc_Archer.png` | nein | ja | Bogen sichtbar, physischer Fernkampf, kein Glow. |
| Angel_1 | `Cute_Fantasy_Characters/Angels/Angel_1.png` | **ja** | ja | G3 final am realen Bild bestaetigt (nicht mehr nur Kandidat): Zeile 6 = Frontal-Cast (Stab schwingt nach unten, weisser Schweif), Zeile 7 = Seiten-Cast (gleicher Schwung seitlich, das ist die genutzte Zeile), Zeile 8 = Ruecken-Cast (Stab ueber Kopf). Echter Zauber-Trail sichtbar, kein blosses Idle-Item-Halten (das zeigen bereits die Idle-Zeilen 0-2 mit dem rotierenden Kreuz). |
| Angel_2 | `Cute_Fantasy_Characters/Angels/Angel_2.png` | **ja** | ja | G3: Raster gegen Angel_1 gegengeprueft (512x832, identische rowFrames), gleiche Rollenverteilung uebernommen: Cast-Seitenzeile 7. |
| Cowling_1 | `Cute_Fantasy_Volcano/Enemies/Cowling_1.png` | nein | ja | Physischer Nahkampf, kleine Slash-Striche, kein Glow. |
| Cowling_2 | `Cute_Fantasy_Volcano/Enemies/Cowling_2.png` | nein | nein (Geschwister übertragen) | Ungeprueft, identisches Raster zu Cowling_1. |
| Cowling_Mage_1 | `Cute_Fantasy_Volcano/Enemies/Cowling_Mage_1.png` | **ja** | ja | Orangenes Feuer-Glimmen deutlich sichtbar in Zeilen 6-8 von 13. Cast-faehig. G3: Seiten-Cast-Zeile ist 7 (schmalste der drei, konsistent mit dem generellen Seiten-Muster tripletStart+1). |
| Cowling_Mage_2 | `Cute_Fantasy_Volcano/Enemies/Cowling_Mage_2.png` | **ja** | nein (Geschwister übertragen) | Ungeprueft, identisches Raster zu Cowling_Mage_1, gleiche Zeile 7 uebernommen. |
| Flying_Skull | `Cute_Fantasy_Volcano/Enemies/Flying_Skull.png` | nein | ja | Reiner Flug-/Sturzangriff, kein Magie-Effekt. |
| Shroomling_Blue | `Cute_Fantasy_ShroomLands/Shroomlings/Blue_Shroomling.png` | nein | ja | Einfache Huepf-/Laufbewegung, kein Glow. Gilt vermutlich fuer alle 4 Farbvarianten. |
| Snail | `Cute_Fantasy_ShroomLands/Snails/Snail_1.png` | nein | ja | Keine Angriffsanimation ueberhaupt erkennbar (nur Ein-/Ausfahren aus dem Haus), harmlose Deko-Kreatur. |
| Witch | `Cute_Fantasy_Halloween/Witch/Witch.png` | **ja** | ja | WICHTIG: Cast-Animation liegt NICHT in Witch.png (9 Zeilen dort sind reine Bewegungsposen ohne Magie-Effekt), sondern in der separaten Datei Cute_Fantasy_Halloween/Witch/Witch_Cauldron_Anim.png (gruen glimmender Kessel, 10 vs. laut Manifest 12 Frames - Widerspruch ungeloest). G3-ENTSCHEIDUNG: Witch wird NICHT als Magier-Rig verwendet - ein Monster, das beim Zaubern zu einem Kessel-Sprite wechselt (anderes Frameraster, keine Koerper-Silhouette mehr), ist keine Zauber-Animation im Sinne der Abnahme. Witch.png hat zudem weder death noch hurt (nur 9 reine Bewegungs-Zeilen). G3 nutzt Witch nicht. |

**Cast-fähige Rigs für G3 (Magier-Typen ausschließlich hierauf mappen):** Skeleton_Mage, Angel_1, Angel_2, Cowling_Mage_1, Cowling_Mage_2, Witch.
