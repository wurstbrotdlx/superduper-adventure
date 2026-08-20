# Das Monstralministerium

Ministerium für Monsterangelegenheiten

Ein Browser-Action-RPG, in dem der Spieler nicht Held ist, sondern Außendienstler einer Monsterbehörde. Monster werden nicht erledigt, sie werden bearbeitet. Zielgruppe 10 bis 99, zwei Humor-Ebenen: Kinder verstehen die Situation, Erwachsene den Paragrafen.

Das Repo heißt aus historischen Gründen noch `superduper-adventure`.

## Starten

Eine einzige Datei, kein Build, kein Framework, kein npm. `index.html` im Browser zu öffnen reicht nicht ganz — die Grafik wird per `fetch` geladen, es braucht einen lokalen Server:

```bash
python3 serve.py
```

Dann `http://localhost:8378/adventure/` aufrufen.

**Nicht `dist/index.html` öffnen.** Die Datei entsteht nur im Pages-Build, liegt lokal oft veraltet herum und lässt funktionierende Features kaputt aussehen. Immer `index.html` im Wurzelverzeichnis.

## Steuerung

`W A S D` Bewegung · `Leertaste` oder Klick Angriff · `Q` oder `1` Trank · `E` Zauber · `R` Ultimate · `T` Zauberbaum · `I` Inventar · `K` Kessel · `M` Musik · `F` Kontextaktion · `Esc` schließt Panels der Reihe nach.

Touch: virtueller Joystick links, Kampf-Cluster rechts.

## Entwickeln

Der gesamte Code liegt in `index.html`, rund 8500 Zeilen JavaScript in einem `<script>`-Block. Syntaxcheck vor jedem Commit:

```bash
python3 -c "import re;h=open('index.html').read();m=re.search(r'<script>(.*)</script>',h,re.DOTALL);open('/tmp/c.js','w').write(m.group(1))" && node --check /tmp/c.js
```

Das fängt Syntaxfehler, **nicht** die Temporal Dead Zone. Der häufigste echte Fehler in diesem Projekt ist ein `ReferenceError` beim Laden, weil eine Funktion, die schon auf Skriptebene läuft, eine erst später deklarierte Konstante liest. Den findet nur der Browser mit offener Konsole.

Das Spiel prüft sich beim Laden selbst. Acht selbstaufrufende Guards (`knAssertCaps`, `blaetterAssert`, `rangAssert`, `anredeAssert`, `vorgangAssert`, `auftragAssertBrett`, `langAssert`, `monsterAssert`) belegen Zeichendeckel, Formregeln, Tabellenvollständigkeit, Erreichbarkeit und seit M1 auch die Kampfwerte gegen den Referenzspieler. **Sie werfen nie, sie melden.** Eine stille Konsole ist das Abnahmekriterium.

## Dokumente

| Datei | Was |
|---|---|
| `superduper-weltbibel.md` | Die Autorität: Welt, Figuren, Humor, Formregeln, Bauabschnitte. Bei Konflikt zwischen Code und Weltbibel gewinnt die Weltbibel. |
| `superduper-gameplay-prompt.md` | Gameplay-Phasen 1 bis 6, Zählertabellen |
| `superduper-grafik-prompt.md` | Grafik-Phasen G0 bis G5 |
| `superduper-reparatur-prompt.md` | Reparaturrunden R1 bis R9 |
| `phase-*.md` | Eine Bauanleitung je Bauabschnitt, mit Abnahme und Prüfprotokoll |
| `figuren-dorf.md`, `blaetter-serie-a-b.md` | Inhaltslieferungen (Figurentexte, Aktenfunde) |
| `phase-m1-monsterkatalog.md` | Bauabschnitt M1: der Katalog im Code, Entscheidungen und Prüfprotokoll |
| `monsterkatalog-stufe-1-10.md` | Die Lieferung: 22 Gegner, 5 Biome, Rechenbasis und Selbstprüfung. Erzeugt von `tools/monsterkatalog.py`, nicht von Hand pflegen. |
| `monsterkatalog.json` | Derselbe Katalog als reine Daten, gleiche Quelle |
| `ABGLEICH-2026-07-27.md`, `ZUSAGEN-BILANZ-2026-08-04.md` | Datierte Prüfberichte. Ihre Zeilennummern sind Stände, keine Wegweiser. |
| `CREDITS.md` | Grafik-Lizenzen |
| `LICENSE` | Code MIT, Grafik nicht gedeckt, Spielinhalte vorbehalten |

Drei Regeln, die beim Mitarbeiten nicht optional sind: Jede Phasenüberschrift trägt `— ERLEDIGT` oder `— OFFEN`, nachgezogen im selben Commit. Jede Bauphase bekommt ein Phasendokument. Und es wird live verifiziert statt behauptet — kein „sollte funktionieren".

## Werkzeuge

| Datei | Was |
|---|---|
| `tools/build-single.mjs` | Pages-Build: backt Grafik als Data-URIs in eine einzelne `dist/index.html` |
| `tools/sheet-audit.mjs` | misst Raster und Anker der Sprite-Blätter, schreibt `assets/cf/manifest.json` |
| `tools/monsterkatalog.py` | rechnet den Monsterkatalog und schreibt `monsterkatalog-stufe-1-10.md` und `monsterkatalog.json`. Prüft dabei alle harten Invarianten und meldet jede Verletzung. |
| `tools/monster-messlauf.mjs` | misst Kampfzeit und Gefahrenbudget im laufenden Spiel statt sie nachzurechnen. Braucht Playwright und einen lokalen Server. |

```bash
python3 tools/monsterkatalog.py
python3 serve.py &                       # der Messlauf braucht das Spiel im Browser
node tools/monster-messlauf.mjs
```

## Grafik

Pixel-Art aus **Cute Fantasy** von Kenmi, Premium-Lizenz. Die Rohbibliothek darf nicht weiterverteilt werden und liegt deshalb nicht in diesem Repo; genutzte Dateien werden kuratiert nach `assets/cf/` kopiert und im Pages-Build von `tools/build-single.mjs` als Data-URIs in eine einzelne HTML-Datei gebacken. Details in `CREDITS.md`.
