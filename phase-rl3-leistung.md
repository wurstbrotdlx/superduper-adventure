# Bauabschnitt RL3: Die Leistung, gemessen — ERLEDIGT

Dritter Abschnitt der Release-Reihe. Vorgenommen war „optimieren". Die
Hausregel sagt: keine Zahl ohne Messung, und also auch kein Eingriff ohne
gemessenen Engpass. Gemessen wurde zuerst, und das Ergebnis dieses Abschnitts
ist, dass **kein Eingriff in den Code nötig war**. Das steht hier, damit es
niemand für ein Versäumnis hält und „optimiert", was nicht langsam ist.

Datum der Messungen: 03.10.2026, Chromium headless im Cloud-Container,
1280×720, ohne lizenzierte Grafik. Ohne Blätter zeichnet `render()` farbige
Platzhalter statt Sprites; die Zahlen zur Zeichenseite sind damit eine
Untergrenze, die zur Logikseite nicht.

---

## 1. Zeit je Rahmen

`update()` und `render()` wurden für den Zufallslauf aus RL2 eingepackt (9
Minuten, 10 239 Rahmen, Oberwelt mit 866 Monstern in der Welt, Kammer,
Schattenland mit 130 Monstern und Horde, drei Menüwechsel je Minute).

| | Mittel | p50 | p95 | p99 | Spitze |
|---|---|---|---|---|---|
| `update(dt)` | 0,10 ms | 0,0 ms | 0,4 ms | 0,8 ms | 5,0 ms |
| `render()` | 0,57 ms | 0,4 ms | 1,4 ms | 2,3 ms | 25,5 ms |

Ein Rahmen bei 60 Hz hat 16,7 ms. Die Logik braucht davon ein Hundertstel, die
Zeichenseite ein Dreißigstel. Die eine Spitze von 25,5 ms ist ein einzelner
Rahmen in zehntausend und fällt mit einem Levelwechsel zusammen (das Backen des
Bodens, gewollt einmalig seit der Messung in `Projekt_SuperDuper_Adventure.md`,
Abschnitt Performance). Die Zahlen decken sich mit der dort notierten Messung
vom Juli (0,6 ms je Rahmen bei voller Horde).

## 2. Laden

| | Quelle (`index.html` + 7 Dateien) | Build (`dist/index.html`) |
|---|---|---|
| Anfragen | 225 (davon 202 fehlgeschlagene Bildanfragen, ohne Grafik der Normalfall) | 1 |
| übertragen | 1,7 MB | 3,5 MB |
| `load` | 847 ms | 516 ms |
| erster Rahmen | 909 ms | 572 ms |
| JS-Heap nach dem Start | 11,5 MB | 17,5 MB |

Der Build ist 3,6 MB groß, davon 1,5 MB die fünfundvierzig Zulagenkarten
(`assets/zulagen/`, je rund 33 KB), 0,5 MB Skript (gzip: 0,5 MB → der Server
von GitHub Pages komprimiert, die Data-URIs der Bilder lassen sich nicht weiter
packen: 3,6 MB → 2,0 MB gzip). Mit der lizenzierten Grafik kommt der Anteil der
Blätter dazu; die Pages-Fassung liegt damit [Vermutung] zwischen 4 und 6 MB.
Das ist für ein Browserspiel, das einmal geladen und dann eine Schicht lang
gespielt wird, kein Engpass, und ein verlustbehaftetes Nachrechnen der
Kartenbilder wäre eine Entscheidung über die Bilder, keine Optimierung.

## 3. Was danach noch als Engpass in Frage käme, und warum es hier nicht steht

* **Die Zeichenseite mit echten Blättern.** Nicht messbar ohne die Grafik im
  Container (siehe `phase-rl1-schluss.md`, Prüfprotokoll). Die Messung dazu
  gehört in eine Sitzung mit dem privaten Asset-Repo; die Messvorrichtung
  (Einpacken von `update`/`render`, Quantile) steht im Soak-Skript und lässt
  sich dort in fünf Minuten wiederholen.
* **Die Monsterliste der Oberwelt** mit 866 Einträgen. `update()` bleibt bei
  0,1 ms, die Sortierung und das Cullen aus dem Juli tragen also weiter.
* **`localStorage`-Schreibvorgänge.** Seit SP beim Tabwechsel und am
  Schichtende, nicht je Treffer. Nichts zu tun.

## Abnahme

Keine Codeänderung, keine Prüfläufe zu wiederholen. Die beiden Messvorrichtungen
liegen als Skripte im Prüfprotokoll von RL2 beschrieben; sie sind absichtlich
nicht in `tools/` aufgenommen, weil sie Zufallseingaben fahren und damit kein
Soll-Ist-Vergleich sind, sondern eine Suche.
