## Z1: Die Zauberbalance — ERLEDIGT

Nachtrag zu M1 (`phase-m1-monsterkatalog.md`). Der Katalog hat den Nahkampf auf feste
Bänder gerechnet und dabei angenommen, Zauber seien die langsamere, dafür flexible Route.
Beim Spielen zeigte sich das Gegenteil: sobald der erste Spruch da ist, gewinnt man aus
der Distanz, ohne getroffen zu werden.

Diese Phase misst das nach, findet vier Ursachen und behebt sie. Am Nahkampf ändert sie
nichts, die Bänder aus M1 stehen unverändert.

### Der Befund

`tools/zauber-messlauf.mjs` stellt Gegnergruppen auf, lässt den Spieler einmal hinlaufen
und zuschlagen und einmal auf Abstand bleiben und zaubern. Gemessen wird am echten
`update()`. Stand vor dieser Phase:

| Gegner | Nahkampf | Funke aus Distanz | Kettenblitz |
|---|---|---|---|
| Chuchu x5 | 5,0 s / 3 Schaden | 1,9 s / **0** | 0,5 s / **0** |
| Grünhaut x4 | 4,2 s / 25 | 2,3 s / **0** | 0,0 s / **0** |
| Ablagestapel x2 | 13,3 s / 19 | 2,4 s / **0** | 0,3 s / **0** |
| Waldschamane x2 | 29,3 s / 147 | 12,1 s / **0** | 20,5 s / 65 |
| Klippkrabbe x2 | 14,9 s / 112 | 12,6 s / **0** | 4,8 s / **0** |
| Sandskorpion x2 | 18,3 s / 260 | 33,8 s / 219 | 14,8 s / **0** |
| Höhlenspinne x2 | 22,2 s / 457 | 7,7 s / **0** | 13,8 s / **0** |
| Mumie | 17,1 s / 66 | 4,7 s / **0** | 14,5 s / **0** |
| Knochenritter | 20,4 s / 401 | 11,1 s / **0** | 31,0 s / **0** |

Die Spalte, auf die es ankommt, ist nicht die Zeit, sondern die Null. In neun von neun
Fällen kostet der Fernkampf **gar nichts**, und in sieben von neun ist er auch noch
schneller. Das ist keine Route neben dem Nahkampf, das ist ein Ersatz für ihn.

### Die vier Ursachen

**1. Jeder Zaubertreffer war ein Crit.** An allen Zauber-Aufrufen von `hurtMon()` stand ein
festes `true`. Gemeint war der Effekt, gewirkt hat aber auch der Schadensfaktor 1,7. Im
Nahkampf ergeben 25 Prozent Crit-Chance im Schnitt 1,175. Ein Zauber traf damit dauerhaft
1,45 mal härter als dieselbe Zahl aus der Waffe, unsichtbar und nirgends dokumentiert.

**2. Die Geschosse flogen doppelt so weit wie angezeigt.** `spellReach()` malt die
Zielvorschau bei `speed * 0.9`, das Projektil bekam aber `t: 2.0`, also `speed * 2.0`. Aus
den versprochenen 396 Pixeln des Funkens wurden 880. Kein Gegner im Spiel reagiert vor 200
Pixeln, und kein Fernkämpfer schießt weiter als 180.

**3. Meteor und Blizzard hatten mit der Maus gar keine Grenze.** Der Deckel von 320 Pixeln
in `spellReach()` galt nur der Touch-Zielhilfe. Am Schreibtisch ließ sich der Einschlag an
jede Stelle des Bildschirms setzen.

**4. Und der eigentliche Grund: Abstand war gratis.** Der Spieler ist mit 135 schneller als
**jedes** Monster im Spiel, das schnellste ist die Fledermaus mit 134. Solange Zaubern nichts
an der Bewegung ändert, ist Weglaufen und Feuern eine Strategie ohne Gegenspiel. Reichweite
und Schaden zu senken half dagegen nichts: die Messung zeigte danach immer noch überall
eine Null.

### Die vier Eingriffe

| Kürzel | Eingriff | Wirkung |
|---|---|---|
| Z1 | Zauber würfeln ihren Crit wie Waffentreffer. Das Ultimate behält seinen festen Crit, es kostet den ganzen Pool. | nimmt die versteckte Anderthalb heraus |
| Z2 | Flugzeit aus `spellReach()` statt fester 2,0 | Reichweite ist wieder das, was die Vorschau malt |
| Z3 | Zielpunkt auch mit der Maus auf die angezeigte Reichweite geklemmt | Meteor ist Zielen, keine Fernwirkung |
| Z4 | Wer zaubert, bewegt sich mit 15 Prozent Tempo | Spam kostet Boden |
| Z5 | Mana ruht 0,8 s nach jedem Zauber | Dauerfeuer wird zum Rhythmus aus Pool leeren und nachladen |

Z4 und Z5 sind die beiden, die den Befund wirklich drehen. Die Zauberanimation läuft 0,42 s,
die Abklingzeit 0,28 s: wer ununterbrochen spammt, steht dabei praktisch. Wer Boden halten
will, muss Pausen lassen. Und der Manapool ist gross genug, dass er in einem Kampf unter zehn
Sekunden vorher nie bremste, gemessen 22 Funken in 6,3 s gegen eine Mumie, ohne je leer zu
laufen. Mit der Ruhepause ist der Pool eine Burst-Ressource: er trägt einen Angriff, danach
steht man 12 Sekunden ohne Mana da, und das Monster steht vor einem.

Beides ist auch in der Welt begründbar. Eine Amtshandlung unterschreibt man nicht im Laufen,
und nach jedem Vorgang ruht die Akte kurz.

### Was daraus wurde

| Gegner | Nahkampf | Funke aus Distanz | Kettenblitz |
|---|---|---|---|
| Chuchu x5 | 4,2 s / 0 | 3,8 s / 0 | 1,3 s / 0 |
| Grünhaut x4 | 4,2 s / 14 | 3,6 s / 0 | 0,3 s / 0 |
| Ablagestapel x2 | 10,8 s / 26 | 3,7 s / 0 | 3,3 s / 0 |
| Waldschamane x2 | 29,3 s / 113 | über 60 s / 0 | über 60 s / **261** |
| Klippkrabbe x2 | 14,9 s / 118 | 55,6 s / **290** | 17,5 s / 0 |
| Sandskorpion x2 | 18,3 s / 272 | über 60 s / **2660** | über 60 s / 0 |
| Höhlenspinne x2 | 24,6 s / 571 | 34,1 s / 0 | 32,7 s / 0 |
| Mumie | 13,8 s / 39 | 6,0 s / 0 | 34,2 s / 0 |
| Knochenritter | 18,8 s / 433 | 57,1 s / **1736** | über 60 s / 0 |

Aus zwei Zahlen wird eine Entscheidung. Gegen schnelle und gegen fernkämpfende Gegner ist
Abstandhalten jetzt der teuerste Weg, den es gibt: der Skorpion holt sich 2660 Schaden, wo er
vorher 219 bekam. Gegen die langsamen Schwämme dauert der Fernkampf drei- bis viermal so
lange wie der Nahkampf, und Zeit ist in einer Schicht von 25 Minuten die eigentliche Währung.

### Was bewusst so bleibt

**Langsame Nahkämpfer kann man weiter gefahrlos abtropfen.** Eine Mumie mit 26 Pixeln pro
Sekunde hat gegen einen Feuerbolzen auf 396 Pixel keine Antwort, und das ist in Ordnung: sie
kostet dafür Zeit und den ganzen Manavorrat. Wer das auch noch schliessen will, braucht
keinen weiteren Spielernerf, sondern Gegner mit einem Sprung oder einem Wurf. Das wäre eine
eigene Phase.

**Der richtige Zauber schlägt sein Band weiterhin.** Der Moorbescheid ist auf 8 bis 15
Sekunden gerechnet und fällt mit fünf Feuerbällen in 3,4 s. Das ist der volle Manapool für
einen einzigen Gegner, danach ist man leer. Der Katalog rechnet mit Dauerleistung, ein voller
Pool ist Burst. Wer ihn dafür ausgibt, hat ihn danach nicht mehr.

**Die Sollrouten des Katalogs halten.** Nachgemessen mit dem Spruch, den der jeweilige Konter
nennt:

| Gegner | Spruch | Band | gemessen |
|---|---|---|---|
| Steingolem | Arkankugel | 20 bis 40 s | 21,8 s |
| Steingolem | Blitzfunke (der falsche) | | 44,2 s und 748 Schaden |
| Sammelverfügung | Meteor | 20 bis 40 s | 25,5 s |

### Nebenbefund: der Messlauf aus M1 hat gelogen

Beim Bauen der Zauberprobe fiel auf, warum `tools/monster-messlauf.mjs` in M1 vereinzelt
Läufe in die Obergrenze laufen liess. `startGame()` setzt `shiftT` nicht, die Schichtuhr ist
also sofort abgelaufen, und `update()` kehrt danach in jeder Frame früh zurück, sobald kein
Gegner mehr im 220-Pixel-Kreis steht. Für Nahkampfläufe fällt das nicht auf, der Spieler steht
ja im Kreis. Jeder Abstandslauf friert dagegen komplett ein: Abklingzeit, Mana, Geschosse.

Beide Messläufe halten die Schichtuhr jetzt an und ziehen die Kamera mit, weil `nahAmBild()`
sie liest und die Trefferprüfung der Geschosse über `nahListe` läuft. Der M1-Lauf liefert
seither 3 von 3 gültigen Durchgängen je Gegner statt gelegentlich 3 von 2.

### Prüfprotokoll

| Prüfung | Ergebnis |
|---|---|
| Syntax | ohne Befund |
| Die elf Guards plus `npcAnkerAssert` | still, nur die vier Nachweiszeilen |
| `monsterAssert()` | 22 Gegner, alle Bänder eingehalten |
| `tools/monster-messlauf.mjs` | 19 Gegner, alle im Band, 3 von 3 Läufen gültig |
| `tools/zauber-messlauf.mjs` | Vorher und Nachher mit demselben Werkzeug gemessen, Tabellen oben |
| Sollrouten der Resistenz-Gates | Steingolem und Sammelverfügung im A4-Band |
