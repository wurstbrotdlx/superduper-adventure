# Bauabschnitt RL2: Die bekannten Fehler, nachgemessen — ERLEDIGT

Zweiter Abschnitt der Release-Reihe. Vorgenommen war eine Liste aus den
Phasendokumenten: alles, was dort als „offen", „Nebenbefund" oder „nicht
behoben" steht und ein Spieler sehen könnte. Die Liste ist zuerst nachgemessen
worden, und das war der eigentliche Ertrag: **von sechs gelisteten Fehlern
bestanden zwei.** Die anderen vier hatten spätere Bauabschnitte nebenbei
behoben, ohne dass ihr Eintrag nachgezogen wurde.

Datum der Messungen: 03.10.2026, ohne lizenzierte Grafik im Container.

---

## 1. Die Liste, Zeile für Zeile

| Eintrag | Quelle | Gemessen | Stand |
|---|---|---|---|
| Lange Amtsbezeichnungen werden in der Kopfzeile der Gesprächstafel am Telefon abgeschnitten | `phase-sz4-finale.md`, Nebenbefund | 390×844 bei Schrift 1,4: 357 Pixel Text in 250 Pixeln Kopf, das Schließkreuz mit hinausgeschoben | **behoben**, s. 2 |
| Das Bildfeld der Gesprächstafel ragt am liegenden Telefon durch die Trennlinie | neu, aus dem Bildschirmabzug | 844×390: Bild von 39 bis 171, Trennlinie bei etwa 145 | **behoben**, s. 2 |
| `WEITER` des Einstellungsvordrucks steht auf 390×844 unter dem Rand | `phase-u3-gespraech.md`, offen | alle Seiten auf 390×844 (Schrift 1 und 1,4), 360×640, 844×390 und 1280×720: der Knopf steht im Fenster, höchster Wert 821 von 844 | überholt, seit E2 wird geblättert statt gerollt |
| `mitteilung-pruef.mjs` steht auf 29 von 32 | `phase-t2-anfang.md` | 32 von 32 | überholt |
| Rangstufe 0 bekommt die Anrede-Vollform nicht (50 Zeichen, Deckel 48) | `phase-anrede.md` | unverändert, der Guard kennt es | bewusst so, kein Fehler: der Deckel ist die Sprechblase, und die Sprossenleiter liefert die nächstkürzere Form |
| Das Finale lässt sich beliebig oft wiederholen | `GEGENPROBE-W-2026-08-05.md` | war der Befund von RL1 | behoben in RL1 |

Dazu zwei Durchläufe, die keinen Fehler suchen, sondern einen finden sollten,
falls einer da ist:

* **Zufallseingaben, 9 Minuten:** Oberwelt (292 Eingaben), Kammer (148),
  Rückweg, Schattenland (117), dazu Menüs auf und zu, Tränke, Zauber,
  Kontextaktion. Tod im Schattenland, Wiederantritt, Feierabend. **Null
  Skriptfehler, null Guard-Meldungen.**
* **Neun Schichtenden am Stück**, 9 bis 89: Dienstschluss, Jahresgespräch bei
  jeder vollen Zehn, die Beförderung bei jeder Fünf bis zum Monstralminister
  ohne Geschäftsbereich (Schicht 90), jedes Mal zurück ins Dorf und die nächste
  Schicht angetreten. **Null Fehler.** Die Laufbahn aus Weltbibel 18.3 und 18.4
  läuft durch, Rang für Rang.

## 2. Was gebaut ist

Beides ist CSS in `index.html`, beides mit dem Grund daneben.

**Der Name wickelt um.** `#gespraechNameTxt` ist ein Flex-Kind, und ein
Flex-Kind schrumpft nicht unter seine min-content-Breite, solange `min-width`
auf `auto` steht. Das `overflow-wrap:break-word` am Elternteil `#gespraechName`
hat deshalb seit U3 nie gegriffen. Jetzt: `flex:1 1 auto; min-width:0;
overflow-wrap:anywhere`, und das Schließkreuz `#gespraechZu` auf `flex:0 0
auto`, damit es nicht mitschrumpft. `anywhere` statt `break-word`, weil das
längste Wort des Hauses („Reichsministerialdirektor") allein breiter ist als die
halbe Tafel. Nachgemessen: Text 250 in Kopf 250 (war 357 in 250), drei Zeilen
bei Schrift 1,4, Kreuz im Bild.

**Das Bildfeld am liegenden Telefon.** Unter `@media (max-height: 460px)` hat
`#gespraechInnen` 250 Pixel, die obere Hälfte schrumpft, das Bildfeld mit seinen
festen 128 Pixeln nicht. Dasselbe Maß wie auf 480 Pixeln Breite (72×72), aus
demselben Grund. Nachgemessen: Bild von 39 bis 115, Trennlinie darunter.

**Das Schild unter dem Satz** (`#gespraechIchName`, die Amtsbezeichnung des
Spielers) brach auf 390 Pixeln bei größter Schrift mit dem letzten Buchstaben
allein in eine zweite Zeile („MONSTERANGELEGENHEITENANWÄRTE / R"). Unter 480
Pixeln Breite jetzt `letter-spacing:.1em` statt `.22em`. Weniger Sperrung statt
weniger Schrift: ein Schild bleibt ein Schild.

**Die Fenster bleiben zu, solange eine Szene die Welt hält.** Ein dritter Fund
aus dem Bildschirmabzug: mitten im Empfang ließ sich mit `C` das
Charakterfenster öffnen, und die Gesprächstafel lag dann quer über dem Fenster
(390×844 und 1280×720, beide gesehen). `fensterGesperrt()` liest `state ===
'szene'`, also genau den Zustand, den `szeneOeffnen()` für eine Szene mit
`haeltDieWelt` setzt, und die sieben Öffner (Rucksack, Charakter, Zauber,
Optionen, Kessel, Ausweis, Karte) steigen damit beim Öffnen aus, nicht beim
Schließen. Ein gewöhnliches Gespräch im Dorf hält die Welt nicht und sperrt
nichts: wer Zwirn zuhört, darf nebenbei in den Rucksack sehen. Die Belegung in
`PANEL_REGISTER` und die Gürtelknöpfe laufen über dieselben Öffner, die Sperre
gilt also für Taste und Finger gleichermaßen.

## 3. Was nicht angefasst wurde, und warum

* **Das Startbild auf 844×390** ist 450 Pixel hoch in einem Fenster von 390.
  `#overlay` rollt (`overflow-y:auto`), der Knopf ist erreichbar. Ein kürzerer
  Anreißer für das liegende Telefon wäre eine Textentscheidung und keine
  Korrektur.
* **Die Kopfzeile des Amt-Panels** heißt „AMT FÜR MONSTERANGELEGENHEITEN". Das
  ist keiner der drei Namen des Hauses aus Weltbibel Kapitel 18, aber die
  Weltbibel schreibt dort ausdrücklich: „Nicht umbenannt werden: ... das
  Amt-Panel und jeder bestehende String mit Amt." Es bleibt.

## 4. Abnahme

| Prüfung | Ergebnis |
|---|---|
| `tools/gespraech-pruef.mjs` | 87 von 89, die zwei fehlenden sind die zwei Blätter ohne Grafik (wie in der Baseline) |
| `tools/menue-pruef.mjs` | 78 von 78 |
| `tools/steuerung-pruef.mjs` | alles in Ordnung |
| `tools/szene-pruef.mjs`, `empfang-pruef.mjs`, `anlage2-pruef.mjs`, `stopfen-pruef.mjs` (nach der Fenstersperre) | 50/50, 131/131, 123/123, 43/43 |
| Zufallseingaben, 9 Minuten | 0 Fehler |
| neun Schichtenden 9 bis 89 | 0 Fehler |
| Zeit je Rahmen (ohne Blätter, 1280×720, 10 239 Rahmen) | `update()` Mittel 0,10 ms, p99 0,8 ms, Spitze 5 ms; `render()` Mittel 0,57 ms, p99 2,3 ms, Spitze 25,5 ms |

Die Rahmenzeiten gehören eigentlich RL3 und stehen hier, weil der Soak sie
nebenbei gemessen hat. Ohne Blätter zeichnet `render()` Platzhalter, die Zahl
ist also eine Untergrenze; was sie belegt, ist, dass die Logikseite (`update`)
weit unter einem Rahmen bleibt, auch mit 866 Monstern in der Welt und 130 im
Schattenland.

## Offen

* Die beiden Einträge in `phase-u3-gespraech.md` und `phase-t2-anfang.md`
  bleiben, wie sie sind; historische Phasendokumente werden nicht
  umgeschrieben. Ihre Berichtigung steht hier.
