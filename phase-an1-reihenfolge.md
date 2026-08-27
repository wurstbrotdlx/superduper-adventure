# Bauabschnitt AN1: der Empfang läuft hinter dem Dienstantritt

Der erste Bauabschnitt des Intro-Umbaus nach A0. Er ändert **keine Zeile Text und kein Blatt** — er dreht eine Reihenfolge um.

**Vorher:** `startGame()` sah, dass noch nicht eingestellt ist, startete den Empfang und kehrte zurück. Der ganze Anfang lief, dann rief `dienstAntritt()` am Ende `startShift()`.

**Nachher:** `startGame()` ruft `startShift()`, und der Empfang läuft darin. `dienstAntritt()` gibt am Ende nur noch die Welt frei.

## Warum, und es sind drei gemessene Gründe

A0 hat den Anfang vermessen (`INTRO-MESSUNG-2026-08-27.md`). Drei Befunde hängen alle an derselben Reihenfolge:

**`state` stand auf `'menu'`.** `scanAktion()` steigt in seiner ersten Zeile aus, wenn `state !== 'play'`. Während des ganzen Anfangs gab es damit **keine Kontextaktion, in keine Richtung** — kein Betreten, kein Hinausgehen, kein Ansprechen. Für AN2, das den Empfang in die Amtsstube stellen will, ist genau das der Blocker. Nicht der Einfriertrick von `betreteHaus()`, der trägt (A0, Prüfung 1).

**`shiftT` stand auf 0.** `innenZeit()` ist `!CONFIG.schichtModus || shiftT < 0.25 * CONFIG.schichtDauer`, und `shiftT` zählt herunter. Bei 0 ist rechnerisch Feierabend, also stand **Nörgel in der Amtsstube**, obwohl er zu Dienstbeginn nicht dort sein soll.

**`startShift()` lief am Ende statt am Anfang.** Es setzt `player.x = SPAWN.x; player.y = SPAWN.y; camSnap()`. Wer den Spieler erst *nach* der Szene auf SPAWN setzt, überschreibt jede Stelle, an die die Szene ihn gebracht hat. Heute fällt das nicht auf, weil während des Anfangs niemand läuft. Ab AN2 wäre es der erste freie Schritt selbst — 181 Pixel von der Amtstür entfernt.

## Die drei geänderten Stellen

**`startGame()`** ruft `startShift()` und danach `empfangStarten()`, statt den Empfang vor die Schicht zu setzen.

**`empfangStarten()`** setzt `state = 'szene'`. Das hält die Welt an: `update(dt)` steigt bei `state !== 'play'` in Zeile zwei aus, damit stehen Schichtuhr, Monster, Wetter und Kontextaktion still.

Ausdrücklich **nicht** über `haeltDieWelt` an der Szene, obwohl die Maschine das kann. Der Grund ist der Ausgang: der Empfang endet nicht an einer Stelle, sondern an dreien (Unterschrift, Vordruck, `ÜBERSPRINGEN`), und `szeneAus()` läuft auf zweien davon mitten durch, lange bevor unterschrieben ist. Ein `szeneStateVorher` wäre dort verbraucht, und die Welt liefe hinter dem Vordruck weiter. Ein `state`, den eine Funktion setzt und **eine** zurücknimmt, ist nachlesbar.

**`dienstAntritt()`** ruft kein `startShift()` mehr, sondern erledigt selbst, was dort noch an ihm hing: Overlay zu, `MUS.muffle(false)`, `state = 'play'`, `updateHUD()`, `knPlayStartT = gameT`, `aktSperre`. Alle aus dem Schluss von `startShift()` übernommen, keine davon neu erfunden.

## Eine Berichtigung, die aus der Messung kam

Der erste Kommentar an `dienstAntritt()` behauptete, `startShift()` sei bisher **zweimal** gelaufen. Nachgezählt (Zähler um die Funktion gelegt, einmal vor und einmal nach dem Umbau): **beide Male genau einmal.** Vorher am Ende, jetzt am Anfang. Die Änderung ist das *Wann* und nicht das *Wieoft*; der Kommentar steht berichtigt.

## Gemessen, vorher gegen nachher

Derselbe Lauf gegen beide Fassungen, die alte auf einem zweiten Port:

| | vor AN1 | nach AN1 |
|---|---|---|
| `state` während des Empfangs | `'menu'` | **`'szene'`** |
| `shiftT` während des Empfangs | 0 | **1500** |
| `innenZeit()` | wahr | **falsch** |
| wer stünde in der Amtsstube | **Nörgel** | **niemand** |
| Schichtuhr läuft während des Empfangs | nein | nein |
| Zustand am ersten freien Schritt | `'play'`, `shiftT` 1500 | `'play'`, `shiftT` 1500 |
| `startShift()`-Aufrufe bis dahin | 1 | 1 |

Der Endzustand ist **identisch**. AN1 verschiebt den Eingang und lässt den Ausgang, wie er war.

Die Zahlen aus `tools/intro-pruef.mjs` bewegen sich erwartungsgemäß **nicht**: 2342 Wörter, 28 Lesestufen, 13 Tafeln ohne Wahl. AN1 ändert keinen Text. Wer hier eine kleinere Zahl erwartet hat, verwechselt Reihenfolge mit Kürzung; das Kürzen ist AN3 und AN4.

## Was AN1 offen lässt, und zwar mit Absicht

**Die Amtsstube ist jetzt leer.** Vorher stand Nörgel dort (zur falschen Zeit), jetzt niemand (zur richtigen). Beides ist falsch für eine Szene, die dort spielen soll — das ist die zweite Hälfte von A0s Prüfung 2 und gehört nach AN2. Knöterich kann dort ohnehin nicht stehen: `betreteHaus()` besetzt den Raum aus `DORF_FIGUREN`, und er steht dort nicht.

**Die Bühne ist weiter schwarz.** AN1 hängt die Reihenfolge um, nicht den Ort. Der Empfang läuft nach wie vor auf `buehneAn()`. Die Amtsstube als Bühne ist AN2.

## Geprüft

* `empfang-pruef` **98/98** — jede Zusage aus E1, E2, T2, T3 und T6 überlebt den Umbau unverändert
* `anlage2-pruef` 123/123, `menue-pruef` 78/78, `szene-pruef` 49/49, `speicher-pruef` 38/38, `mitteilung-pruef` 32/32
* `intro-pruef` alle vier Routen, Exit 0, Zahlen unverändert
* Vorher-Nachher am laufenden Spiel gemessen, Tabelle oben, alte Fassung auf Port 8379
