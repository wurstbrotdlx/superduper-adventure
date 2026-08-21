## G7: Ein Maßstab für die ganze Welt — ERLEDIGT

Häuser, Bäume, Deko, Hoftiere und Kammer-Requisiten standen in einem anderen Maßstab
als der Boden, auf dem sie stehen. Diese Runde bringt alles auf denselben Faktor und
räumt das Dorf entsprechend neu ein.

### Der Befund, und wer ihn geliefert hat

Der Auslöser war eine Beobachtung beim Spielen, wörtlich:

> Die Häuser im Dorf und Bäume etc sind nicht in scale zu den Charakteren. Das neue
> Lager der Grünhäute ist korrekt.

Der zweite Satz ist der wertvollere. Er nennt eine **Kontrollgruppe**: einen Ort im
selben Spiel, der richtig aussieht. Damit ist die Frage keine Geschmacksfrage mehr,
sondern eine Messfrage — was macht das Lager anders?

Es rechnet mit 2. `phase-w-lager.md` hat das seinerzeit sogar begründet:

> Skalierung 2: die MilitaryCamp-Blätter sind 16-Pixel-Kunst wie die Tiles-Sätze (der
> Palisadenring misst 3x5 Kacheln in 48x80 Pixeln), während die Gebäude aus G5 schon in
> 32 Pixeln je Kachel vorliegen und deshalb 1 bleiben.

Die erste Hälfte des Satzes ist richtig, die zweite ist falsch, und aus dieser falschen
Hälfte kommt der ganze Befund. **Cute Fantasy ist durchgehend 16-Pixel-Kunst**,
Gebäude eingeschlossen. `Grass_1_Middle.png` misst 16x16 und wird als eine Kachel
gelegt; `House_1_Wood_Base_Red.png` misst 96x128 und ist damit ein Haus von 6x8
Kacheln, nicht von 3x4. Mit Skalierung 1 gezeichnet war es halb so groß wie das
Grundstück, auf dem es steht.

Nachprüfbar an drei Stellen, die alle schon im Code standen:

| Stelle | rechnet | seit |
|---|---|---|
| `bakeTile()` / `bakeDunTile()` | 16 Quellpixel auf `TS` (also 2) | G4 / G1 |
| Kammertore, Druckplatten, Treppen | `drawSprite(…, 2)` | G1 |
| Lager-Requisiten | `scale: 2` | W-Lager |
| **Dorf-Gebäude, Bäume, Deko, Hoftiere** | **1 bis 2,2, je nach Aufruf** | **G4 / G5** |

Die letzte Zeile ist der Fehler. Er ist nie aufgefallen, weil bis W-Lager nichts
Richtiges danebenstand.

### Die Änderung in einer Zeile

```js
const WELT_SC = TS / 16;
```

Abgeleitet, nicht gewählt: `TS` ist die Kachelgröße auf dem Schirm, 16 ist die
Kachelgröße in der Bibliothek. Wer ein Objekt aus dieser Bibliothek in die Welt stellt,
nimmt `WELT_SC`. Elf Aufrufstellen tragen jetzt dieselbe Zahl statt sieben verschiedener.

### Was das für die Größen heißt

Gemessen an der Alpha-Bounding-Box des Blattes (nicht am Frame-Rechteck: die Blätter
haben teils breite leere Ränder). Bezugsgröße ist der Held mit 28 Blattpixeln bei
`PLAYER_SC` 1,8, also 1,57 Kacheln.

| Objekt | Blatt (px) | vorher (Kacheln) | nachher | vorher/Held | nachher/Held |
|---|---:|---:|---:|---:|---:|
| Wohnhaus 1/2/3 (opak) | 114 | 3,56 | 7,12 | 2,26 | 4,52 |
| Amt (Inn, opak) | 175 | 5,47 | 10,94 | 3,47 | 6,94 |
| Scheune (opak) | 117 | 3,66 | 7,31 | 2,32 | 4,64 |
| Marktstände (opak) | 38 | 1,19 | 2,38 | 0,75 | 1,51 |
| Windmühle | 111 | 3,47 | 6,94 | 2,20 | 4,40 |
| Eiche | 63 | 2,07 | 3,94 | 1,31 | 2,50 |
| Birke / Fichte | 69 | 2,26 | 4,31 | 1,44 | 2,74 |
| Felsen | 7 | 0,39 | 0,44 | 0,25 | 0,28 |
| Hohes Gras | 5 | 0,20 | 0,31 | 0,13 | 0,20 |
| Pilz | 8 | 0,35 | 0,50 | 0,22 | 0,32 |
| Kammerpfeiler | 43 | 1,34 | 2,69 | 0,85 | 1,71 |
| Kiste / Topf / Truhe | 26 / 16 / 21 | 1,22 / 0,80 / 0,85 | 1,62 / 1,00 / 1,31 | 0,77 / 0,51 / 0,54 | 1,03 / 0,63 / 0,83 |
| **Palisade (Lager)** | **32** | **2,00** | **2,00** | **1,27** | **1,27** |
| **Wachturm (Lager)** | **125** | **7,81** | **7,81** | **4,96** | **4,96** |

Die beiden fetten Zeilen sind die Kontrollgruppe: unverändert, weil schon richtig. Ein
Wachturm von fünf Heldenhöhen und ein Wohnhaus von 2,26 nebeneinander — das war der
sichtbare Widerspruch. Jetzt stehen 4,96 und 4,52 nebeneinander.

Hoftiere gehen denselben Weg (1,15 auf `WELT_SC`, Faktor 1,74). Absolutwerte stehen hier
bewusst nicht: die `unionBBox` im Manifest fasst alle Animationsreihen zusammen und
ist bei Tieren eine Obergrenze, kein Maß. Die Vulkanpflanze schrumpft leicht (2,2 auf 2),
sie war die einzige, die zu groß gezeichnet wurde.

### Warum das Dorf umgeräumt werden musste

Ein Haus zu verdoppeln heißt, seinen Fußabdruck zu verdoppeln, sonst läuft man durch die
Wand. Sechs verdoppelte Fußabdrücke passen nicht in ein Rechteck von 19x15 Kacheln:
allein das Amt braucht 15 Kacheln in der Breite, das ganze alte Dorf war 19 breit.

Das Dorf ist deshalb 38x35 Kacheln groß statt 19x15. **Es ist nicht größer geworden,
es ist genauer geworden** — dieselben sechs Häuser in der Größe, die ihre Blätter
meinen. Kessel (15/41), Spawn (12,5/40,5) und Knöterich (13/41) stehen unverändert, das
Dorf ist um sie herum gewachsen.

Die Anordnung aus G5 bleibt: Nordzeile (Wohnhaus, Amt, Marktstände) mit gemeinsamer
Fußlinie, Südzeile (zwei Wohnhäuser, Scheune), dazwischen der Anger.

| | vorher | nachher |
|---|---|---|
| `VILLAGE` | 19x15 Kacheln | 38x35 |
| Fußlinie Nordzeile | y=37 | y=34 |
| Fußlinie Südzeile | y=46 | y=52 |
| Amt | `x0:10, w:8, h:2` | `x0:5, w:15, h:4` |
| Wohnhaus 1 | `w:3, h:2` | `w:6, h:4` |
| Wohnhaus 2/3 | `w:5, h:2` | `w:9, h:4` |
| Marktstände | `w:6, h:1` | `w:12, h:2` |
| Scheune | `w:4, h:2` | `w:8, h:4` |
| Windmühle | (26, 38) | (38, 30) |
| Lager | `x0:34…x1:52` | `x0:44…x1:62` |

`w` ist ab jetzt keine Schätzung mehr, sondern `CF_BLD.fw / 16`, und `dorfMassstabAssert()`
rechnet das beim Start nach (siehe unten). `h` verdoppelt sich mit dem Sprite, damit der
Anteil aus G5 erhalten bleibt: gesperrt ist das untere Drittel der Fassade, der Rest ragt
begehbar darüber.

Zwei Verschiebungen sind Folgekosten, keine Absicht:

* **Die Windmühle** stand bei (26, 38) und wäre ab jetzt in den Marktständen gestanden
  (die reichen bis x=33). Sie steht weiter „ostwärts neben dem Dorf", nur ist das jetzt
  zwölf Kacheln weiter draußen, zwischen Dorfkante (34) und Lagerpalisade (44).
* **Das Lager** ist um zehn Kacheln nach Osten gerückt. Nicht weil an ihm etwas falsch
  wäre — es war der einzige Ort, der richtig gerechnet hat —, sondern weil das Dorf
  jetzt bis x=34 reicht und dort seine Palisade stand. Der Abstand zwischen Dorfkante
  und Palisade ist exakt der alte: zehn Kacheln, weiterhin innerhalb von `DORF_BANN`,
  also weiterhin ohne Streumonster zwischen den Zelten.

Alle elf Heimatanker der Dorffiguren sind mitgewandert. Die Regel ist die aus G6, nur mit
neuen Zahlen: auf dem Anger zwischen ty 35 und 42 bleiben, oder ab ty 53 südlich vor der
Südzeile stehen — dort ist die Figur wieder die Nähere zur Kamera. Werte und Begründung
je Figur in `figuren-dorf.md`.

### Was ausdrücklich NICHT angefasst wurde

* **Die Figuren.** `PLAYER_SC` (1,8), `NPC_SC` und die `sc`/`psc`-Werte in `MONDEF` sind
  in G2/G3 und im Monsterkatalog M1 gegeneinander geeicht und tragen die
  Kampfwahrnehmung. Sie liegen dicht an `WELT_SC` — der Held ist mit 1,8 rund zehn
  Prozent unter der Bibliotheksgröße. Diese zehn Prozent sind eine gewachsene
  Entscheidung, kein Fehler, und der Auslöser dieser Runde hat die Figuren ausdrücklich
  als richtig bezeichnet.
* **Wolkenschatten (2,2), Zauberprojektil (1), Fundmarke, Aufmerksamkeitsmarke,
  Flammeneffekte.** Nichts davon steht in der Welt: Wolken liegen darüber, die anderen
  sind Marken und Effekte mit von Hand gesetzten Versätzen. Sie stehen namentlich in der
  Ausnahmeliste von `tools/massstab-messlauf.mjs`, damit die Entscheidung sichtbar
  bleibt statt vergessen zu werden.
* **Die Kampfwerte.** Kein `MONDEF`-Feld, kein Radius, kein Balancewert wurde berührt.

### Zwei Dinge, die beim Vergrößern kaputtgegangen wären

Beides gefunden, bevor es im Bild stand, weil die Rechnung dieselbe ist:

1. **Bäume schwebten.** Die Baumblätter sind 80 Pixel hoch, die Stammunterkante liegt 8
   Pixel über dem Blattrand. Bei Skalierung 1,05 fing der Versatz `+4` das fast auf; bei
   `WELT_SC` sind es 16 Pixel Luft, der Baum hätte eine halbe Kachel über seiner eigenen
   Kachel gehangen. Der Versatz heißt jetzt `BAUM_DY` und ist 14 (8·2 − 14 = 2 Pixel über
   der Kachelunterkante, also wie vorher knapp in die Kachel hinein).
2. **Große Props wären am Bildrand verschwunden.** `BIG_PAD` (190) hing an der höchsten
   `big`-Deko, dem Amt mit 192 Pixeln. Bei `WELT_SC` sind es 384 Pixel Höhe und 240 zur
   Seite — das halbe Amt wäre am Rand weggeschnitten worden. `BIG_PAD` ist jetzt 400.
   Bäume hatten gar keinen Rand (84 Pixel hoch, der 80er-Kamerarand reichte zufällig);
   bei 160 Pixeln reicht er nicht mehr, dafür gibt es `BAUM_PAD` (170).

### Neu: ein Guard und ein Messlauf

**`dorfMassstabAssert()`** läuft beim Skriptstart, ohne eine einzige Bilddatei — alle Maße
kommen aus `CF_BLD` und `VILLAGE_BUILDINGS`. Vier Fragen: Deckt der Fußabdruck die
Fassade (`w === fw/16`)? Stehen zwei Häuser ineinander (Sprite-Rechtecke, nicht
Fußabdrücke)? Liegt alles im Dorf-Rechteck? Berührt das Dorf das Lager? Wirft nie,
meldet nur, Bauform wie `monsterAssert()`.

**`tools/massstab-messlauf.mjs`** beantwortet die Ausgangsfrage als Zahl. Er hängt sich
in `drawSpriteAt()` — den Flaschenhals, durch den jedes Sprite geht — und liest die
Skalierung aus der Transformationsmatrix, egal ob der Aufrufer `drawSprite()` benutzt
oder selbst skaliert (Held, Monster, Leichen). Dadurch steht im Messlauf **keine zweite
Skalentabelle**, die neben der im Spiel veralten könnte. Ausgegeben wird je Blatt: Höhe
in Kacheln und Höhe im Verhältnis zum Helden. Am Ende die eine Zusicherung: läuft alle
Weltkunst auf `WELT_SC`?

### Prüfprotokoll

Live im Browser, `python3 serve.py` und Chromium über Playwright, gegen den Stand vor
dieser Runde (`8561ceb`) auf einem zweiten Port gegengemessen.

| Prüfung | vorher | nachher |
|---|---|---|
| Seitenfehler beim Start | 0 | **0** |
| `Sprite fehlt`-Warnungen | 0 | **0** |
| `dorfMassstabAssert()` | — | **„6 Gebäude decken ihren Fußabdruck, stehen frei und liegen im Dorf"** |
| `dorfSichtAssert()` (G6) | 11 Figuren im Bild | **11 Figuren im Bild** |
| `npcAnkerAssert()` | 5 Warnungen | **dieselben 5, wortgleich** |
| `monsterAssert()` | 28 Gegner, alle Bänder | **28 Gegner, alle Bänder** |
| Weltblätter mit eigener Skalierung (Messlauf) | **16** | **0** |
| Soak: 4 Richtungen, 48 Zauber-/Schlagbefehle | 0 Ausnahmen | **0 Ausnahmen** |
| Kammer betreten, Requisiten, wieder verlassen | 0 Ausnahmen, Oberwelt bitgleich zurück | **0 Ausnahmen, Oberwelt bitgleich zurück** |
| `node tools/build-single.mjs` | 118 Dateien | **118 Dateien, Build läuft** |
| Weltform, erreichbare Kacheln je Band | alle fünf Bänder über Sollwert | **alle fünf, Grasland 15486 → 15438** |

Die fünf `npcAnkerAssert()`-Warnungen stehen wortgleich auch im Stand vor dieser Runde.
Sie sind ein Artefakt der Platzhalter (die Ersatzblätter füllen die `unionBBox` des
Manifests und haben deshalb eine andere Fußlinie als die echten), kein Befund. Genau
dafür wurde jede Zahl in dieser Tabelle gegen beide Stände gemessen und nicht nur gegen
einen.

Der Messlauf listet vorher sechzehn Blätter mit eigener Skalierung: drei Baumarten,
Felsen, hohes Gras, zwei Pilze, drei Hoftiere, sechs Gebäude und die Windmühle. Die
Kammer-Requisiten (Pfeiler, Topf, Spinnwebe, Kiste, Truhe) stehen nicht in dieser
Sechzehn, weil der Spaziergang des Messlaufs über der Erde bleibt — sie sind trotzdem
Teil derselben Änderung, siehe Größentabelle oben.

`render()` direkt gemessen, drei Läufe je Stand, 240 Proben je Ort:

| Ort | vorher Median | nachher Median | vorher p95 | nachher p95 |
|---|---:|---:|---:|---:|
| Dorf | 0,70–0,80 ms | **0,50 ms** | 1,10–1,30 ms | 0,70–1,50 ms |
| Wald | 1,00–1,10 ms | **0,90–1,00 ms** | 1,60–1,80 ms | 1,70–2,40 ms |
| Sumpf | 0,70–1,00 ms | **0,80 ms** | 1,00–1,40 ms | 1,20–1,30 ms |

Der Median ist nirgends schlechter (im Dorf besser: sechs große Gebäude ersetzen viele
kleine Zeichenaufrufe). Der p95 im Wald liegt am oberen Rand höher, das sind die fünf
zusätzlichen Baumreihen aus `BAUM_PAD`. Referenz aus dem Regressionsschutz sind ~0,6 ms
in der Horde, das Budget ist eingehalten.

### Die Einschränkung dieser Messung

**Das lizenzierte Grafikpaket lag in dieser Session nicht vor.** Ohne Bilder startet das
Spiel gar nicht (`bakeUiSkin()` greift auf ein Blatt zu), es gäbe also überhaupt keine
Messung. Gemessen wurde deshalb gegen **maßhaltige Platzhalter**: für alle 118 Dateien
ein PNG in der echten Größe aus `assets/cf/manifest.json`, gefüllt in der Fläche der
dort vermerkten `unionBBox`. Erzeugt außerhalb des Repos, geschrieben nach `assets/cf/`
(gitignored), kein Byte davon ist committet.

Was das trägt und was nicht:

* **Getragen:** jede Geometrie. Blattmaße, Anker, Skalierungen, Fußabdrücke,
  Überschneidungen, Sichtbarkeit der Figuren, Randbeschneidung, Zeichenreihenfolge,
  Zeichenkosten, Startmeldungen. Das sind genau die Größen, um die es in G7 geht.
* **Nicht getragen:** der Bildeindruck. Ob eine Eiche von 2,5 Heldenhöhen *schön*
  aussieht, entscheidet sich am echten Blatt, nicht am Rechteck.

Ein Durchgang mit dem echten Paket steht deshalb aus. Die Zahlen oben ändern sich
dadurch nicht, die drei Punkte unten könnten es.

### Bewusst offen

* **Walddichte.** Die Streuung liegt unverändert bei 8 Prozent Baumkacheln im Grasland,
  und Bäume sind jetzt rund doppelt so breit. Rechnerisch deckt das Kronendach im
  Sichtfeld deutlich mehr Fläche als vorher. Ob das ein Wald ist oder eine Wand, ist
  eine Sichtfrage am echten Blatt (die Kronen sind unregelmäßig und halbtransparent, das
  Platzhalterrechteck ist es nicht) — deshalb hier **nicht** mitgeändert. Wenn es zu
  dicht wirkt, ist die Stellschraube die Streuung in `genMap()`, nicht die Skalierung;
  die Erreichbarkeit garantiert ohnehin die Flutfüllung, nicht die Dichte.
* **Die zehn Prozent zwischen Held und Welt.** `PLAYER_SC` 1,8 gegen `WELT_SC` 2. Sie
  aufzulösen hieße, an der Figurengröße zu drehen, die in dieser Runde ausdrücklich als
  richtig benannt wurde. Bleibt stehen, ist aber notiert.
* **Flammeneffekte.** `fire1`/`fire2` werden mit 1,2 bis 1,5 und von Hand gesetzten
  Versätzen gezeichnet. Sie auf `WELT_SC` zu ziehen hieße, jeden Versatz neu zu setzen,
  und ein Flammeneffekt ist kein Gegenstand mit einer richtigen Größe. Steht in der
  Ausnahmeliste des Messlaufs.
