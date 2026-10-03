# Bauabschnitt RL4: Die Oberfläche auf drei Formaten — ERLEDIGT

Vierter Abschnitt der Release-Reihe. Vorgenommen war „durchstylen". Gemacht
wurde, was sich ohne die lizenzierte Grafik im Container abnehmen lässt: jedes
Fenster und jede Tafel auf 1280×720, 390×844 und 844×390 abgezogen, gegen den
Fensterrand gemessen und angesehen. Was ohne Blätter nicht beurteilbar ist
(der Rahmen-Skin aus `UI_Frames.png`, die Sinnbilder, die Figuren), steht unten
unter „Nicht abgenommen".

Datum: 03.10.2026. Grundlage sind 60 Bildschirmabzüge (Startbild, Anfang
Blatt für Blatt, Dorf, acht Fenster, Dienstschluss, Jahresgespräch, Amt) und
die Messungen dazu.

---

## 1. Befunde und was daraus wurde

| Befund | Format | Maß | Stand |
|---|---|---|---|
| Die Karte (`#fullmap`) stand bis Pixel 391 in 390 Pixeln Breite, rechter Rand weg | 390×844 | Breite aus `100vw` gerechnet, Rand und Innenabstand (34 px) kamen obendrauf | **behoben**: `box-sizing:border-box` |
| Die Karte war 564 Pixel hoch in 390 Pixeln Fensterhöhe (oben −138) | 844×390 | quadratisches Blatt, nur die Breite war gedeckelt | **behoben**: dritte Größe im `min()`, `calc(100vh - 150px)`; jetzt 21 bis 369 |
| Das Schwarze Brett hängt im Amt ganz unten in einem rollenden Kasten, und der Kasten endet am Telefon sauber hinter dem fünften Ausbau | 390×844 | 371 von 730 Pixeln sichtbar, kein Hinweis | **behoben**: „Der Kasten geht weiter. Ganz unten hängt das Schwarze Brett." nach dem Rendern gemessen, Bauform wie `berichtMehr` |
| Das Startbild ist 450 Pixel hoch in 390 | 844×390 | `#overlay` rollt | bleibt, s. RL2 |
| Dienstschluss, Jahresgespräch und Amt rollen am Telefon | 390×844, 844×390 | 1145/844 beim Jahresgespräch | bleibt: der Inhalt ist eine Urkunde und wird gelesen, nicht gescannt |

Was ohne Befund abgenommen wurde: der Einstellungsvordruck Blatt für Blatt
(alle Knöpfe im Fenster, siehe RL2), Charakter mit beiden Blättern, Rucksack,
Kochen mit Kessel und Beutel, Zauber, Optionen, Dienstausweis, die Karte nach
der Korrektur, die Gesprächstafel mit dem längsten Titel des Spiels (RL2).

## 2. Was nicht abgenommen ist

* **Der Rahmen-Skin.** `bakeUiSkin()` legt die Neun-Felder-Rahmen aus
  `UI_Frames.png` erst an, wenn die Datei da ist; ohne sie zeigen die Fenster
  den CSS-Rahmen. Ob der Skin auf den drei Formaten sitzt, kann nur eine
  Sitzung mit der Grafik sagen. Die Messungen oben gelten für beide Fälle,
  denn sie messen Kästen und nicht Bilder.
* **Farben und Schrift** sind nicht angefasst. Die Palette steht als feste
  Hexwerte im CSS (#f4d97a, #c9a227, #05030a), nicht als Variablen. Eine
  Umstellung auf Variablen hätte 525 Regeln berührt und nichts Sichtbares
  verändert; der Gewinn wäre ein künftiger, der Preis ein heutiger.
* **Das Startbild auf dem liegenden Telefon** wäre mit einem kürzeren Anreißer
  besser. Das ist eine Textentscheidung des Projektinhabers.

## 3. Abnahme

| Prüfung | Ergebnis |
|---|---|
| `tools/menue-pruef.mjs` | 78 von 78 |
| `tools/zulagen-pruef.mjs` | 50 von 50 (der Lauf schließt seit RL2 das Startbild, bevor er `Z` drückt; mit der Fenstersperre ging die Mappe darunter sonst nicht mehr auf, und das hat der Lauf vorher für „offen" gezählt) |
| `tools/langvorgang-pruef.mjs` | 58 von 58 |
| `tools/ladelauf-pruef.mjs` | still |
| Karte auf 390×844, 360×640, 844×390, 1280×720, 1280×660 | im Fenster, alle fünf |
| Ausweis auf denselben fünf | im Fenster, alle fünf |
