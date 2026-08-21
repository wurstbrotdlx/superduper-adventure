## M3: Der Stollen — ERLEDIGT

Das sechste Katalogbiom. Drei neue Vorgangsarten, die nur hinter dem teuersten
Gebührenbescheid stehen, ein dritter Kammersatz, und eine Vorgangsart, die sich beim
Erledigen teilt.

Ausgelöst durch den Wunsch nach mehr Gegnertypen, gern kammerexklusiv. Der Weg dahin
war nicht der erwartete, und der Umweg ist der interessantere Teil dieses Dokuments.

### Warum kein Gegner in die Untere Registratur passte

Der erste Entwurf hängte die drei Typen an die bestehende Kammerstaffel. Der Generator
hat das abgelehnt:

```
25 Gegner, 1 Verletzung(en).
  VERSTOSS Kreuzungsregel Biom Höhle hat 8 Gegner
```

M1 hat sich die Regel „je Biom 3 bis 5 Gegner aus mindestens 3 Ertragsklassen" selbst
gegeben, und zwar aus einer offen gelassenen Vorgabe heraus: „N = 22 Gegner war im
Auftrag offen und ist hier gesetzt." Die Untere Registratur stand bereits bei 5. Damit
gab es für **keinen einzigen** kammerexklusiven Gegner einen zulässigen Platz — die
drei freien Plätze im ganzen Katalog lagen in Sumpf, Wüste und Ruine, und die liegen
auf der Karte, nicht hinter einer Tür.

Drei Auswege standen zur Wahl. Die Regel für das Türbiom zu lockern wäre der kleinste
Eingriff gewesen. Gewählt wurde der additive: **ein sechstes Biom**, das keine
bestehende Regel anfasst. Die Untere Registratur behält ihre fünf Gegner, die
Sperrablage bekommt drei, und beide bleiben im Band.

### Die Sperrablage

| | |
|---|---|
| Katalogschlüssel | `Stollen` |
| Amtlicher Name | Die Sperrablage |
| Wo | hinter der teuersten Kammertür, kein Band auf der Karte |
| Sollstufen | 9 bis 10 |
| Signatur | Eine Ebene unter der Registratur liegt, was niemand mehr anfassen sollte, und zahlt es in Rüstung und Waffe. |

Die Untere Registratur und die Sperrablage **teilen sich die Staffel, statt sich zu
überlagern**: Gebührenbescheid 1 bis 4 ist die Registratur, Bescheid 5 ist die
Sperrablage. Beide Roster stehen nie gleichzeitig in einer Kammer, und genau deshalb
bleibt jedes Biom im Band.

Eine Folge davon ist eine Verschiebung im Bestand: **der Steingolem rückt von
Gebührenbescheid 5 auf 4.** Bliebe er auf 5, wäre er unerreichbar, weil Bescheid 5
jetzt der Sperrablage gehört. Bescheid 4 verspricht auf dem Schild ohnehin eine schwere
Kammer, und die Staffelregel aus Phase 2 („ohne diese Staffel stünde ein Steingolem mit
1220 Leben in einer Stufe-1-Kammer und das Schild vor der Tür wäre gelogen") bleibt
damit gewahrt.

### Die drei Vorgangsarten

Die Weltbibel schreibt vor: erst die Vorgangsart, dann das Monster, nie umgekehrt. Wer
eine Vorgangsart nicht in einem Satz erklären kann, hat kein Monster.

| Monster | Vorgangsart | Warum es sich so verhält |
|---|---|---|
| Der Teilbescheid | Der Teilbescheid | Was nach der Teilabhilfe übrig bleibt. Einzeln kaum der Rede wert, und genau deshalb kommen sie zu viert. |
| Der Dienstweg | Der Dienstweg | Nimmt den längstmöglichen Weg, kommt an, ist nicht zu beschleunigen. Wer ihn abkürzen will, fängt von vorne an. |
| Die Teilabhilfe | Die Teilabhilfe | Man hilft ihr teilweise ab, und was übrig bleibt, läuft als eigener Vorgang weiter. Zweimal. |

**Teilabhilfe** und **Teilbescheid** sind echte Begriffe des Verwaltungsverfahrens: man
gibt einem Widerspruch teilweise statt, der Rest läuft weiter. Ein Schleim, der beim
Sterben in zwei kleinere zerfällt, tut genau das. Die Mechanik musste nicht an die
Vorgangsart angepasst werden, sie war schon dieselbe Sache.

Der Zerfall hängt an einer Tabellenzeile, nicht am Typnamen:

```js
zerfaellt:{typ:'teilbescheid', n:2},
```

`killMon()` liest sie. Eine zweite zerfallende Vorgangsart braucht deshalb keine zweite
Codestelle. Der Zerfall terminiert von selbst, weil der Teilbescheid kein `zerfaellt`
trägt. Die Kinder erben die Elite-Eigenschaft **nicht**: ein Sonderprüfer ist namentlich
gezeichnet, und eine Unterschrift teilt sich nicht.

### Der dritte Kammersatz

`Cute_Fantasy_Dungeons/Dungeon_3/` ist im Pack ein **leerer Ordner**. Kenmi liefert kein
drittes Set aus, und die G0-Korrektur im Code („Dungeon_3 existiert nicht") stimmt
weiterhin. Der Stollen ist deshalb ein Hybrid:

- **Boden und sichtbarer Wandring** aus `Cute_Fantasy/Tiles/Cave`
- **Tor, Säule, Druckplatte und Treppe** bleiben die von Dungeon_2

Der Cave-Satz hat solche Objekte nicht, und ein Stollen ohne Tor wäre kein Korridor.

Zwei Messungen haben das billig gemacht. Erstens: der dunkle Ring in `Cave_Walls` bei
(64,0) hat **exakt dasselbe 3×3-Layout** wie die beiden Dungeon-Blätter — die UV-Tabelle
konnte unverändert übernommen werden. Zweitens: die Deckung je Zelle wurde gescannt
statt geschätzt, weil `sheet-audit.mjs` bei Flächen-Tiles nichts taugt (G4-Lektion).

`DUN_SET` las bisher genau ein Blatt je Satz. Der Cave-Satz verteilt sich auf zwei
Dateien, deshalb trägt jeder UV-Eintrag jetzt optional seinen Blattschlüssel als drittes
Feld. Zwei Zeilen in `bakeDunTile()`, und die beiden alten Sätze bleiben unberührt.

**Eine bewusste Abweichung.** Die Dungeon-Sätze beschreiben ihren Füllblock als
„deutlich dunkler als der Boden". Der Cave-Satz hat keine flache dunkle Kachel. Die
dunklen Ringecken wären dunkel genug — gegengeprüft und verworfen, weil sie sichtbar zu
einem Bogenmuster kacheln, das sich als Tapete liest statt als Fels. Genommen wurde die
Steinquaderzeile bei y=112: heller als der Boden, aber eindeutig als Wand lesbar, weil
sie Mauerwerk zeigt statt Fläche. **Im Stollen trägt also die Textur, was sonst die
Helligkeit trägt.**

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über Playwright.

| Prüfung | Ergebnis |
|---|---|
| `python3 tools/monsterkatalog.py` | **25 Gegner, 0 Verletzungen** (vorher 22, 0) |
| `monsterAssert()` beim Start | „25 Gegner geprueft, alle Baender eingehalten" |
| `node tools/monster-fehlversuch.mjs` | alle 18 Regeln greifen, unveränderter Katalog bleibt grün |
| Warnungen und Fehler in der Konsole | **0** |
| Fehlende Grafikdateien | **0** von 109 |
| Kammersatz bei Bescheid 5 | `set 2`, Wandblatt `dun3_walls`, Möbel `dun2_gate` / `dun2_stairsDown` |
| Roster bei Bescheid 5 | `teilbescheid, dienstweg, teilabhilfe` |
| Roster bei Bescheid 4 | `bat, spider, sammelmahnung, mage, golem` |
| Zerfall der Teilabhilfe | 2 Kinder, beide `zerfallen`, beide aggro, Versatz 20 und 25 px |

Messlauf `node tools/monster-messlauf.mjs`, drei Läufe je Gegner und Richtung:

| Typ | Klasse | Sollstufe | TTK ist/soll | Überleben ist/soll |
|---|---|---|---|---|
| Der Teilbescheid | A1 | 9 | 2,5 / 2,4 s | 32,6 / 31,6 s |
| Die Teilabhilfe | A3 | 10 | 17,2 / 16,0 s | 8,3 / 8,1 s |

Beide innerhalb ihres Bandes (A1: 1 bis 3 s und ab 30 s, A3: 12 bis 25 s und 6 bis 10 s).
Die einundzwanzig bereits vermessenen Gegner sind unverändert geblieben.

**Der Dienstweg fehlt in dieser Tabelle, und das ist kein Versäumnis.** Der Messlauf
überspringt Gegner, deren Sollroute `magie` ist — Steingolem und Moorbescheid fehlen aus
demselben Grund seit M1. Seine Bandtreue belegt `monsterAssert()` im laufenden Spiel,
das ihn mitzählt und für die Route rechnet, mit der er gemeint ist. Ein Messlauf, der
Zauberrouten mitmisst, wäre eine eigene Runde am Werkzeug, nicht am Katalog.

### Nebenbei erledigt

Die Rostergröße stand siebenmal als Literal `22` im Berichtsgenerator. Sie wird jetzt
aus `len(R)` gerechnet. Ein Zahlenpaar, das bei jedem Zuwachs von Hand nachgezogen
werden muss, veraltet beim ersten Mal, an dem jemand es vergisst — und dieser Zuwachs
wäre das erste Mal gewesen.

### Bewusst offen

- **Die Anlage (Bombschroom) ist entworfen, aber nicht gebaut.** `Cute_Fantasy/Enemies/
  Bombschroom/` liegt mit eigenem `Toxic_Gas_Cloud_VFX.png` im Pack und wird in keinem
  Dokument dieses Repos erwähnt. Die Vorgangsart steht: **Die Anlage** — hängt am
  Vorgang, kommt ungefragt mit, und wer sie öffnet, riecht sie den ganzen Tag. Das Wort
  trägt beide Bedeutungen, die Beilage zum Schriftstück und das Gewächs.
  Gemessen ist das Blatt auch schon: 176×336, Raster 16×16, 11×21. Die Zeilen 0 bis 8
  sind Idle, Lauf und Angriff in je drei Richtungen (2, 5 und 6 Frames), die Zeilen 10,
  12 und 14 füllen die ganze Zelle — das ist die Gaswolke. Die weißen Bilder in den
  unteren Zeilen sind **kein zweiter Pilz, sondern das Blinksignal vor der Detonation.**
  Damit ist es ein Drei-Zustands-Gegner: laufen, blinken, detonieren, plus eine
  Gaswolke, die liegen bleibt und über Zeit Schaden macht. Das ist ein eigenes
  Verhalten mit eigener Entität, kein Statblock, und gehört deshalb in eine eigene Runde.
- **Die Sperrablage teilt sich den Adjektivpool der Unteren Registratur.**
  `zutatBiome()` gibt in jeder Kammer `hoehle` zurück. Das ist Absicht: es ist derselbe
  Untergrund ein Stockwerk tiefer, und eine siebte Gewichtsspalte über zwanzig Adjektive
  wären zwanzig Zahlen ohne Grundlage. Ihr eigener Ertrag steckt in der
  Grundseltenheit und im Slot-Mix, nicht in einem neuen Adjektivpool.
- **Die Orks bleiben draußen.** `Orc_Grunt`, `Orc_Chief`, `Orc_Archer` und `Orc_Peon`
  messen in den Zeilen 0 bis 5 sauber (32×32, sechs Frames, enge Bounding-Box), aber
  ihre Zeilen 6 bis 11 spannen in **jedem** Frame die volle Zellbreite. Das ist exakt
  die Signatur, an der das falsche Raster von `Fisherman_Fin` aufgefallen ist. Die
  G3-Notiz „Raster-Konfidenz zu niedrig, ungeprüft" war berechtigt und bleibt stehen,
  bis die Angriffszeile dieselbe Zwei-Hypothesen-Messung bekommen hat.
- **Der Stollen bringt keine neue Kammermechanik mit.** Er ist ein dritter Satz mit
  eigenem Roster, keine neue Rätselart. `Rails.png`, `Cave_Floor_Ladder` und die
  Cave-Wasseranimation liegen ungenutzt: Schienen ohne Lore und eine Leiter ohne zweite
  Ebene wären Behauptungen, keine Mechanik.
