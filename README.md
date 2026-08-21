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

`W A S D` Bewegung · `Leertaste` oder Klick Angriff · `Q` oder `1` Trank · `E` Zauber · `R` Ultimate · `T` Zauberbaum · `I` Inventar und Befähigung · `K` Kessel · `M` Musik · `F` Kontextaktion · `Esc` schließt Panels der Reihe nach.

Touch: virtueller Joystick links, Kampf-Cluster rechts.

## Entwickeln

Der gesamte Code liegt in `index.html`, rund 8500 Zeilen JavaScript in einem `<script>`-Block. Syntaxcheck vor jedem Commit:

```bash
python3 -c "import re;h=open('index.html').read();m=re.search(r'<script>(.*)</script>',h,re.DOTALL);open('/tmp/c.js','w').write(m.group(1))" && node --check /tmp/c.js
```

Das fängt Syntaxfehler, **nicht** die Temporal Dead Zone. Der häufigste echte Fehler in diesem Projekt ist ein `ReferenceError` beim Laden, weil eine Funktion, die schon auf Skriptebene läuft, eine erst später deklarierte Konstante liest. Den findet nur der Browser mit offener Konsole.

Das Spiel prüft sich beim Laden selbst. Dreizehn selbstaufrufende Guards (`blaetterAssert`, `goldAssert`, `knAssertCaps`, `rangAssert`, `auftragAssertBrett`, `langAssert`, `vorgangAssert`, `anredeAssert`, `monsterAssert`, `zauberAssert`, `befaehigungAssert`, `dienstAssert`, `wiederAssert`) belegen Zeichendeckel, Formregeln, Tabellenvollständigkeit, Erreichbarkeit, die Schichtabrechnung, seit M1 die Kampfwerte gegen den Referenzspieler, seit M2 zusätzlich die Modelle gegen die Angriffsart und die Grenzen des Sonderprüfers, seit Z2 die Zauberbefugnis samt Manakopplung, seit S1 die Spreizung zwischen gesteigertem und ungesteigertem Spieler samt Kraftbedarf und Manapool, seit W8 den Sperrvermerk auf die Akte im Einstellungsvordruck und seit W10 die beidseitige Klemme des gespeicherten Dienststandes. Dazu kommt `npcAnkerAssert()`, der als einziger nicht auf Skriptebene läuft, sondern erst hinter `loadAssets()`, weil er die gebackenen Blätter liest. **Sie werfen nie, sie melden.** Eine stille Konsole ist das Abnahmekriterium. *(Diese Zeile nannte bis zum 20.08.2026 sieben und kannte weder `npcAnkerAssert` aus `9b553a8` noch die seither dazugekommenen.)*

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
| `phase-z1-zauberbalance.md` | Bauabschnitt Z1: warum Zauberspam jeden Nahkampf schlug, vier Eingriffe, Vorher-Nachher-Messung |
| `phase-m2-nahfeld-und-namen.md` | Bauabschnitt M2: Schwierigkeit nach Entfernung vom Dorf, der Sonderprüfer, Namen über den Köpfen, zwei versiegelte Gegner |
| `phase-z2-zauberbefugnis.md` | Bauabschnitt Z2: Zauber ab Stufe 4, Mana wird im Nahkampf erarbeitet, Spammen verhungert an der Leiste |
| `phase-s1-befaehigung.md` | Bauabschnitt S1: warum Steigern folgenlos war, die Umschichtung von der Stufe in den Punkt, höhere Zauberpreise, der Kraftbedarf, Vorher-Nachher-Messung mit zwei Bauweisen |
| `phase-w8-anfang.md` | Bauabschnitt W8: Einstellungsvordruck, Dienstanweisung, Laufbahnziel, und warum der Anfang kein Prolog ist |
| `phase-w10-wiedereinsetzung.md` | Bauabschnitt W10: der Antrag auf Wiedereinsetzung, die einzige Art, zweimal derselbe Mensch zu sein |
| `monsterkatalog-stufe-1-10.md` | Die Lieferung: 22 Gegner, 5 Biome, Rechenbasis und Selbstprüfung. Erzeugt von `tools/monsterkatalog.py`, nicht von Hand pflegen. |
| `monsterkatalog.json` | Derselbe Katalog als reine Daten, gleiche Quelle |
| `ABGLEICH-2026-07-27.md`, `ZUSAGEN-BILANZ-2026-08-04.md`, `GEGENPROBE-2026-08-04.md`, `GEGENPROBE-W-2026-08-05.md`, `GW-RESTFUNDE-2026-08-06.md`, `KAMMER-MESSUNG-2026-08-20.md` | Datierte Prüf- und Messberichte. Ihre Zeilennummern sind Stände, keine Wegweiser, und ihr Inhalt wird nicht rückwirkend umgeschrieben. Was sie überholt, steht im jeweils neueren Bericht oder im Phasendokument. |
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
| `tools/zauber-messlauf.mjs` | misst, was Abstandhalten kostet: Nahkampf gegen Zauberspam, je Gegnergruppe in Zeit und genommenem Schaden |
| `tools/nahfeld-messlauf.mjs` | zählt an der wirklich gesetzten Bevölkerung ab, was in welcher Entfernung vom Dorf steht |
| `tools/spaziergang-messlauf.mjs` | schickt eine frische Stufe 1 in die echte Welt und misst den Verlauf: erster Kill, Kills, Stufe, Ausgang. Seit S1 zweimal je Aufruf, einmal ohne und einmal mit Steigerung — der Abstand zwischen beiden Zeilen ist der Messwert |
| `tools/monster-fehlversuch.mjs` | setzt absichtlich Fehler in den Katalog und prüft, ob `monsterAssert()` sie meldet. Ein Guard, der immer schweigt, beweist nichts. |

```bash
python3 tools/monsterkatalog.py
python3 serve.py &                       # der Messlauf braucht das Spiel im Browser
node tools/monster-messlauf.mjs
node tools/zauber-messlauf.mjs
node tools/nahfeld-messlauf.mjs
node tools/spaziergang-messlauf.mjs
node tools/monster-fehlversuch.mjs
```

## Grafik

Pixel-Art aus **Cute Fantasy** von Kenmi, Premium-Lizenz. Die Rohbibliothek darf nicht weiterverteilt werden und liegt deshalb nicht in diesem Repo; genutzte Dateien werden kuratiert nach `assets/cf/` kopiert und im Pages-Build von `tools/build-single.mjs` als Data-URIs in eine einzelne HTML-Datei gebacken. Details in `CREDITS.md`.
