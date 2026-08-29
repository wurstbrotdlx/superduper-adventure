# Arbeitsanleitung für Claude

Das Monstralministerium, ein Browser-Action-RPG. Der Spieler ist nicht Held,
sondern Außendienstler einer Monsterbehörde; Monster werden nicht erledigt,
sondern bearbeitet. Zwei Humor-Ebenen: Kinder verstehen die Situation,
Erwachsene den Paragrafen.

Diese Datei sagt, wo etwas liegt und wie hier gearbeitet wird. Alles Weitere
steht im `README.md`. Die inhaltliche Autorität ist `superduper-weltbibel.md`:
**bei Konflikt zwischen Code und Weltbibel gewinnt die Weltbibel.**

## Wo der Code liegt

`index.html` trägt HTML und CSS (rund 2650 Zeilen) und lädt am Ende sieben
klassische Skriptdateien aus `skript/` (zusammen rund 25 000 Zeilen JavaScript):

| Datei | Inhalt |
|---|---|
| `skript/01-grafik-und-klang.js` | Maßstab, Sprite-Engine, Held und Garderobe, Rigs, Deko, Porträts, Audio, Welt-Startwert, `ASSET_BLOBS`-Marker |
| `skript/02-dorf-und-welt.js` | `DORF_FIGUREN`, Böden und Kacheln, Koppel, Steinbruch |
| `skript/03-akten-und-katalog.js` | Zutaten, `ZULAGE`, Aktenfunde, Befähigungszahlen, Monsterkatalog |
| `skript/04-magie-und-zulagen.js` | Zauberbefugnis, Zulagen-Maschine, Knöterich, Kammern |
| `skript/05-buehne-und-kammern.js` | Zweite Bühne, Türen, Innenräume, Rätselmodule, Aktionen |
| `skript/06-gespraech-dienst-und-szenen.js` | Gesprächsfenster, `update()`, `frameNo`, Dienst und Spielstand, Rang, Vorgang, Szenen, `NEUERUNGEN` |
| `skript/07-tafeln-und-start.js` | Anrisstafeln, Dienstgestalt, Steuerung, `loop()`, UI-Skin, Ladekette |

**Die Reihenfolge der Tags in `index.html` ist Programmtext.** Klassische
Skriptdateien teilen sich eine globale lexikalische Umgebung: `const` aus Datei
01 steht in Datei 07, aber nur, weil 01 vorher lief. Wer die Tags umsortiert
oder eine Datei dazwischenhängt, ändert das Programm. Kein `type="module"`
(eigene Scopes), kein `defer`. `'use strict'` gilt pro Datei und steht in jeder.

**Datei 6 ist viermal so groß wie die anderen, und das ist gemessen, nicht
liegengelassen:** `gespraechAssert()` ruft sich auf Skriptebene selbst auf und
liest dabei `baumFaellig()`, das zehntausend Zeilen weiter unten steht. Jeder
Schnitt dazwischen macht das Spiel kaputt. Wer sie teilen will, löst zuerst
diese Abhängigkeit auf und sucht dann die Kante. Hintergrund:
`phase-dt-dateiteilung.md`.

Zeilennummern sind kein Beleg. **Fundstellen werden über Bezeichner plus Datei
genannt**, nie über Zeilennummern; die verschieben sich.

## Starten und prüfen

```bash
python3 serve.py &                       # Port 8378, liefert das Arbeitsverzeichnis
# http://127.0.0.1:8378/index.html
for f in skript/*.js; do node --check "$f"; done   # Syntax, vor jedem Commit
node tools/ladelauf-pruef.mjs            # kommt die Seite hoch, ist die Konsole still
```

`node --check` findet Syntaxfehler und sonst nichts. Der häufigste echte Fehler
ist ein `ReferenceError` beim Laden, weil etwas auf Skriptebene eine später
deklarierte Konstante liest; dazu kommt die falsche Ladereihenfolge. Beides
sieht nur ein Browser, beides fällt leise aus. Dafür ist `ladelauf-pruef.mjs` da,
und `.github/workflows/pruef.yml` fährt ihn bei jedem Push gegen die Quelle und
gegen die gebaute `dist/index.html`.

**Auf `frameNo > 0` warten, nie auf `assetsReady`.** Die Flagge steht auch dann
auf `true`, wenn kein einziges Bild geladen wurde.

Rund vierzig weitere Werkzeuge liegen in `tools/`, je eines mit Zeile in der
Werkzeuge-Tabelle des README. Playwright wird über `PLAYWRIGHT_PFAD` und
`CHROMIUM` gefunden, wenn es nicht im Projekt liegt.

## Grafik

`assets/cf/` steht in der `.gitignore` — die Cute-Fantasy-Bibliothek darf nicht
weiterverteilt werden (`assets/cf/README.md`). **Ohne sie läuft das Spiel
trotzdem**, es fehlen nur die Blätter, und die Konsole ist voller
`Sprite fehlt`-Warnungen. Wer ohne Grafik prüft, prüft Skript und Ladekette,
nicht die Bilder; das ist der größere Teil und reicht für alles, was keine
Bilder anfasst.

Ausgeliefert wird eine einzige Datei: `tools/build-single.mjs` hängt die sieben
Skriptdateien in der Reihenfolge ihrer Tags wieder zu einem Block und backt die
Grafik als Data-URIs ein. `.github/workflows/pages.yml` tut das bei jedem Push
auf `main` und deployt.

## Hausregeln

- **Gemessen statt geschätzt.** Keine Zahl ohne Messung. Steht eine Zahl in
  einem Dokument, gehört das Datum der Zählung dazu.
- **Kommentare sagen das Warum**, nicht das Was, und sie sind deutsch. Eine
  gewachsene Entscheidung wird als solche benannt, damit niemand sie für einen
  Fehler hält und „aufräumt".
- **Guards werfen nie, sie melden.** Über zwanzig davon laufen beim Laden und
  belegen Zeichendeckel, Formregeln, Tabellenvollständigkeit, Erreichbarkeit.
  **Eine stille Konsole ist das Abnahmekriterium.** Eine Warnung, die immer da
  steht, ist keine Tapete, sondern ein Fund.
- **Ton:** Der Gag steht dort, wo eine Figur spricht. Menüs, Erklärtexte und
  Welterklärtexte reden normales Deutsch — „Das Register hängt am Ort, nicht am
  Haus".
- **Je Bauabschnitt ein `phase-*.md`** mit Abnahme und Prüfprotokoll.
  Historische Phasendokumente und Messberichte werden **nicht** umgeschrieben;
  sie sind Aufzeichnungen ihres Moments. Korrekturen werden datiert angehängt.
- **`NEUERUNGEN`** (in `skript/06`) bekommt einen Punkt, wenn eine Änderung für
  Spieler sichtbar ist. Sichtbar ist das Kriterium, nicht die Größe. Wer einen
  Bauabschnitt ändert, der dort genannt ist, ändert den Punkt mit.
- **Commits:** deutscher Aussagesatz im Präsens, der sagt, was die Sache jetzt
  tut, mit Phasenkürzel wenn es eine Phase ist. `AN5: die Kladde faengt den
  Anfang auf`, `Der Kammerausgang schneidet, statt quer über die Karte zu
  fliegen`. Kein „Add", kein „Fix", keine Conventional Commits.
