## S1: Die Befähigung — ERLEDIGT

Nachtrag zu Z1 (`phase-z1-zauberbalance.md`) und Z2 (`phase-z2-zauberbefugnis.md`).
Der Spielbericht danach hatte drei Sätze, und alle drei stimmten:

> Magie ist ab Sekunde 1 zu mächtig. Mana Kosten müssen höher.
> Es gibt keinen Grund, die Stats zu leveln. Erstens fällt kaum auf, dass es das gibt.
> Zweitens komme ich immens weit ohne Stat-Steigerung. Mach den Charakter schwächer.
> Leveln und steigern muss Relevanz haben und muss sich dringend notwendig anfühlen.

Diese Phase misst beide Vorwürfe nach, findet für jeden eine Ursache im Code und
behebt sie. Der Monsterkatalog aus M1 wird dabei **nicht** aufgeweicht: seine
Bänder halten unverändert, `monsterAssert()` meldet weiter 22 Gegner im Band.

### Der Befund, gemessen

`tools/spaziergang-messlauf.mjs` setzt eine frische Stufe 1 an den echten
Startpunkt und lässt sie drei Minuten in der echten Welt losgehen. Vor dieser
Phase, ohne dass je ein Punkt vergeben wurde:

| Lauf | Ergebnis |
|---|---|
| 180 s | 67 Kills, Stufe 7, überlebt, tiefster Stand 31 % |
| 900 s | 94 Kills, Stufe 8, gestorben erst nach 294 s im Frostkamm |

Das ist der Vorwurf in Zahlen. Ein Spieler, der die vier Befähigungen nie
anfasst, räumt in drei Minuten 67 Vorgänge ab und steigt dabei sechsmal auf.
Die Punkte, die dabei anfallen, liegen unbenutzt im Rucksack, und nichts im
Spiel merkt das.

### Warum das so war

**Die Stufe hat fast alles geschenkt, der Punkt fast nichts.** Leben stand auf
`70 + 12 je Stufe + 20 je Punkt`. Bei einem Aufstieg alle zwanzig Sekunden ist
das ein stetiger Strom, für den man nichts entscheiden muss. Der Punkt war eine
Beigabe zu einem Wachstum, das ohnehin lief.

**Der Aufstieg war zugleich der stärkste Trank im Spiel.** `gainXP()` setzte
`player.hp = derived.maxHp`. Wer im Kampf steht und dabei aufsteigt, ist sofort
wieder voll. Bei sechs Aufstiegen in drei Minuten waren das sechs Gratistränke,
und sie kamen genau dann, wenn es eng wurde: im Kampf.

**Die Stufenleiter war zu flach.** `35 · Stufe^1,35`. Eine Stufe alle zwanzig
Sekunden ist kein Ereignis, und was kein Ereignis ist, wird nicht bedient.

**Die Anzeige hat den Ertrag verschwiegen.** Im Rucksack stand `SKILL PUNKTE`
und darunter `💪 Stärke (+Dmg)`. Was ein Punkt bringt, stand nirgends. Der
einzige Hinweis auf freie Punkte war ein Sternchen am Rucksacksymbol.

**Und der Zauber war weiterhin zu billig.** Z1 hat den Spam langsamer gemacht,
Z2 hat ihm die geschenkte Quelle genommen — aber beide Male blieb der Preis, wo
er war. Fünf Mana für sechzehn Schaden sind bei 7,2 im Nahkampf erarbeiteten
Mana je Sekunde eine zweite, kostenlose Waffe: 23,04 Schaden je Sekunde
zusätzlich, auf Sollstufe 5 rund 58 Prozent obendrauf.

### Der Eingriff: umschichten, nicht verschärfen

Der Monsterkatalog rechnet gegen einen **Referenzspieler**, und der steigert
je Stufe einen Punkt Kraft und einen Punkt Zähigkeit (`monsterAssert()`, seit
M1). Die Bänder aus M1 waren also schon immer die Bänder eines Spielers, der
steigert. Dass ein Spieler, der es nicht tut, trotzdem fast mitkam, war kein
Balance-Entwurf, sondern ein Leck.

Deshalb wird hier nichts erschwert, sondern **umgeschichtet**: was die Stufe
geschenkt hat, kommt jetzt aus dem Punkt. Für den Referenzspieler bleibt das
Ergebnis fast gleich, für jeden anderen bricht es ein.

| Größe | vor S1 | seit S1 |
|---|---|---|
| Leben | 70 + 12 je Stufe + 20 je Punkt Zähigkeit | **63 + 2 je Stufe + 27 je Punkt** |
| Mana | 40 + 8 je Stufe + 15 je Punkt Intelligenz | **26 + 2 je Stufe + 22 je Punkt Amtskunde** |
| Schaden je Punkt Kraft | +3 / +4 | **+3 / +5** |
| Kurzschwert (Referenzklinge) | 5 bis 9 | **3 bis 6** |
| Grundtempo | 135, +5 je Punkt | **126, +8 je Punkt** |
| Stufenleiter | 35 · Stufe^1,35 | **48 · Stufe^1,6** |
| Vollheilung beim Aufstieg | ja | **nein** |
| Funke | 5 Mana, 16 Schaden | **12 Mana, 20 Schaden** |
| Zauber-Dauerleistung | 23,04 je Sekunde | **12,0 je Sekunde** |

Ein Punkt Zähigkeit wiegt jetzt gut dreizehn Aufstiege, ein Punkt Amtskunde elf.
Das ist die ganze Idee in einem Satz.

### Was das für den Referenzspieler bedeutet: fast nichts

| Sollstufe | Leben vorher | jetzt | Anteil | DPS vorher | jetzt | Anteil |
|---|---|---|---|---|---|---|
| 1 | 70 | 63 | 0,90 | 13,7 | 9,9 | 0,72 |
| 2 | 102 | 92 | 0,90 | 19,1 | 16,0 | 0,84 |
| 3 | 134 | 121 | 0,90 | 24,4 | 22,1 | 0,91 |
| 4 | 166 | 150 | 0,90 | 34,4 | 32,8 | 0,96 |
| 5 | 198 | 179 | 0,90 | 39,7 | 39,0 | 0,98 |
| 6 | 230 | 208 | 0,90 | 45,1 | 45,1 | 1,00 |
| 7 | 262 | 237 | 0,90 | 50,4 | 51,2 | 1,02 |
| 8 | 294 | 266 | 0,90 | 60,3 | 61,9 | 1,03 |
| 9 | 326 | 295 | 0,90 | 65,7 | 68,0 | 1,03 |
| 10 | 358 | 324 | 0,91 | 71,0 | 74,1 | 1,04 |

Zehn Prozent weniger Leben durchgehend, und beim Schaden eine Rampe: auf Stufe 1
knapp drei Viertel, ab Stufe 6 wieder darüber. Das ist die gewollte Form. Der
Anfang ist spürbar zäher, das Wachstum spürbar steiler, und in der Summe bleiben
alle 19 physischen Sollrouten in ihren Bändern (nachgemessen, s. Prüfprotokoll).

### Was das für alle anderen bedeutet: alles

| Sollstufe | Leben ohne Steigerung, Anteil am Referenzspieler | Schaden, Anteil |
|---|---|---|
| 1 | vorher 100 %, jetzt 100 % | vorher 100 %, jetzt 100 % |
| 5 | vorher 60 %, **jetzt 40 %** | vorher 46 %, **jetzt 37 %** |
| 10 | vorher 50 %, **jetzt 25 %** | vorher 32 %, **jetzt 26 %** |

Auf Stufe 10 hat ein Spieler ohne Steigerung noch ein Viertel der Lebensleiste,
mit der der Katalog rechnet. Vorher war es die Hälfte.

### Und im echten Spiel

Derselbe Spaziergang, jetzt zweimal je Lauf: einmal ohne Steigerung, einmal mit
dem Referenzbuild. Der Abstand zwischen den beiden Zeilen ist der Messwert.

| Lauf | ohne Steigerung | mit Steigerung |
|---|---|---|
| A | **tot nach 49 s**, Stufe 3, 11 Kills | 180 s, Stufe 6, 109 Kills, 208 Leben |
| B | 180 s, Stufe 5, 63 Kills, 71 Leben | 180 s, Stufe 7, 104 Kills, 237 Leben |
| C | 180 s, Stufe 5, 65 Kills, 71 Leben | 180 s, Stufe 6, 103 Kills, 208 Leben |
| D | **tot nach 61 s**, Stufe 3, 14 Kills | tot nach 142 s, Stufe 5, 49 Kills |

Zwei von vier Spaziergängen ohne Steigerung enden innerhalb einer Minute tot.
Kein einziger davor tat das. Wer steigert, überlebt drei von vier Läufen ganz
und kommt im vierten mehr als doppelt so weit. Die Kills stehen je nach Lauf
zwischen dem Anderthalb- und dem Zehnfachen.

Der Rest der Spreizung steht in der Zeile darunter: **71 Leben gegen 237.** Das
ist derselbe Mensch nach denselben drei Minuten, einmal mit und einmal ohne acht
vergebene Punkte.

### Die fünf Eingriffe im Einzelnen

| Kürzel | Eingriff | Wirkung |
|---|---|---|
| S1-1 | Leben, Mana, Schaden und Tempo aus der Stufe in den Punkt umgeschichtet | der Referenzspieler bleibt, wo er war, alle anderen fallen heraus |
| S1-2 | Der Aufstieg heilt nicht mehr | die stärkste Heilquelle im Spiel war ein Nebeneffekt, jetzt heilt das Fläschchen |
| S1-3 | Stufenleiter von 35·St^1,35 auf 48·St^1,6 | halbe Geschwindigkeit, der Aufstieg wird wieder ein Ereignis |
| S1-4 | Zauberpreise auf das Zweieinhalbfache, Schaden auf ein Viertel mehr | Dauerzauber leistet knapp die Hälfte, der einzelne Spruch wiegt schwerer |
| S1-5 | Die Befähigung wird sichtbar und der Kraftbedarf sperrt | man sieht, dass es sie gibt, was sie bringt, und wofür man sie braucht |

#### S1-4, ausgeführt: warum der Preis und nicht die Quelle

Z2 hat die Manaquelle in den Nahkampf verlegt und sie dort gelassen: 2 je Sekunde
passiv, 4 je Waffenschwung, zusammen 7,2 je Kampfsekunde. Daran ändert S1 nichts,
das ist der Vertrag von Z2 und er funktioniert. Was fehlte, war der Preis.

Alle zehn Sprüche kosten jetzt das Zweieinhalbfache und tragen ein Viertel mehr.
Das Ultimate ist der Sonderfall: es kostet nur ein Fünftel mehr, trägt aber
ebenfalls ein Viertel mehr. Es soll ein Schlussstrich bleiben, kein Dauerwerkzeug,
und es zahlt seinen Preis seit S1 ohnehin an anderer Stelle (s. unten).

| Spruch | vorher | jetzt |
|---|---|---|
| Funke | 5 Mana / 16 | 12 / 20 |
| Feuerball | 15 / 44 | 36 / 55 |
| Meteor | 35 / 95 | 84 / 120 |
| Eissplitter | 6 / 14 | 14 / 18 |
| Frostnova | 20 / 34 | 48 / 43 |
| Blizzard | 40 / 72 | 96 / 90 |
| Blitzfunke | 6 / 18 | 14 / 23 |
| Kettenblitz | 22 / 38 | 53 / 48 |
| Arkankugel | 30 / 78 | 72 / 98 |
| Zeitriss | 25 / 22 | 60 / 28 |
| Konfetti-Kataklysmus | 100 / 450 | 120 / 560 |

Zusammen mit dem kleineren Grundpool ergibt das die Zahl, auf die es ankommt:
**auf Stufe 4, im Moment der Befugniserteilung, trägt der volle Manavorrat genau
zwei Funken** (32 Mana, 12 je Spruch). Wer mehr zaubern will, hat zwei Wege, und
beide sind Entscheidungen: in den Nahkampf gehen und das Mana erarbeiten, oder
Amtskunde steigern. Vier Punkte Amtskunde machen aus zwei Funken zehn.

Damit hängt zum ersten Mal ein Zauber an einer Befähigung. Das **Ultimate kostet
120 Mana** und ist ohne einen einzigen Punkt Amtskunde unbezahlbar, auf jeder
Stufe. Der Zauberbaum sagt das an, bevor der Punkt weg ist: ein Spruch, der
teurer ist als der ganze Pool, trägt die Zeile „Pool 52, zu klein".

#### S1-5, ausgeführt: sichtbar und sperrend

Der erste Teil des Vorwurfs lautete, dass kaum auffällt, dass es die Befähigungen
gibt. Fünf Stellen antworten darauf:

* **Der Aufstieg sagt, was er bringt.** Neben `STUFENAUFSTIEG` steht jetzt
  `+2 Befähigungspunkte · [I]`.
* **Freie Punkte stehen dauerhaft im Bild**, unter Stufe und Gold, pulsierend:
  `✚ 4 Punkte [I]`. Im Berührungsmodus, wo diese Spalte ausgeblendet ist, trägt
  das Sternchen am Rucksack die Meldung weiter.
* **Der Rucksack heißt jetzt Befähigung** und nennt den Ertrag je Punkt, aus den
  Konstanten gerechnet statt abgeschrieben: `💪 Kraft +3–5 Schaden`,
  `❤️ Zähigkeit +27 Leben`, `⚡ Behändigkeit +8 Tempo`, `🧠 Amtskunde +22 Mana`.
  Darunter eine Zeile, die sagt, warum das jetzt wichtig ist — und wenn Gerät in
  der Tasche liegt, für das die Kraft nicht reicht, sagt sie das stattdessen.
* **Knöterich stupst einmal**, wenn zwei Aufstiege lang nichts vergeben wurde:
  „Sie sammeln Punkte und vergeben keine." Danach nie wieder, wie bei allen
  Wissenslücken.
* **Die Dienstanweisung nennt sie** (Blatt 2, neuer Punkt „Befähigung", und
  Blatt 3 unter „Je Aufstieg"). Der Anfang ist ein Vordruck, also steht es im
  Vordruck.

Der zweite Teil lautete, dass sich das Steigern dringend notwendig anfühlen muss.
Dafür steht der **Kraftbedarf**: die drei schweren Klingen aus dem Kessel tragen
eine Zahl, und wer sie nicht hat, legt die Waffe nicht an.

| Klinge | Schaden | Kraftbedarf |
|---|---|---|
| Behelfsklinge | 4 bis 7 | — |
| Amtsklinge | 8 bis 13 | — |
| Dienstschwert | 15 bis 23 | 4 |
| Vorschriftsspalter | 28 bis 46 | 8 |
| Siegelbrecher | 42 bis 66 | 12 |

Kein Malus, kein Kompromiss: die Klinge bleibt in der Tasche und wartet. Das ist
die einzige Stelle im Spiel, an der eine Befähigung etwas **aufschließt** statt
es nur zu verbessern, und sie ist mit Absicht die härteste. Ein erbrauter
Siegelbrecher, den man nicht heben kann, erklärt die Kraftleiste besser als jeder
Text es könnte.

### Die Kopplung an den Monsterkatalog

Die Zauberleistung des Katalogs (`KAT_ZAUBER_DPS`) hängt seit Z2 an den
Manakonstanten und ist mit den neuen Preisen von 23,04 auf 12,0 gefallen.
Die drei Gegner mit Zauber-Sollroute verlieren im selben Verhältnis Leben,
sonst wäre ihre eigene Route aus dem Band gefallen. Damit ihre Weichstelle eine
Weichstelle bleibt, steigt zugleich die Papierdicke gegen die Waffe: der Abstand
zwischen Sollroute und Waffenroute ist danach derselbe wie vorher.

| Gegner | HP vorher | HP jetzt | Physisch vorher | jetzt | Abstand Waffe zu Sollroute |
|---|---|---|---|---|---|
| Der Moorbescheid | 345 | 180 | 0,50 | 0,73 | 2,0-fach, unverändert |
| Steingolem | 1100 | 570 | 0,90 | 0,95 | 4,9-fach, unverändert |
| Die Sammelverfügung | 1120 | 580 | 0,70 | 0,85 | 1,45-fach, unverändert |

Der übrige Katalog wurde vom Generator (`tools/monsterkatalog.py`) mit dem neuen
Referenzspieler neu gerechnet und in `MONDEF` nachgezogen. Die Verschiebungen
gehen in beide Richtungen und sind auf den hohen Sollstufen klein: Lebenspunkte
zwischen minus 26 Prozent (Chuchu, Sollstufe 1) und plus 4 Prozent (Mumie,
Sollstufe 9), Schaden je Treffer null bis zehn Prozent herunter. Beides folgt aus
derselben Rampe wie oben: auf den niedrigen Stufen ist der Spieler jetzt deutlich
schwächer, also braucht ein Gegner dort weniger Leben für dieselbe Kampfzeit, und
weil der Referenzspieler durchgehend zehn Prozent weniger zäh ist, darf ihn
dasselbe Gefahrenbudget nicht mehr so hart treffen. Die Bänder selbst sind
unangetastet.

### Der dreizehnte Guard

`befaehigungAssert()` prüft beim Laden, nach dem Spiegeln-und-Zurückstellen-Muster
von `zauberAssert` und `wiederAssert`, die vier Zusagen dieser Phase:

1. **Der Punkt schlägt die Stufe.** Erst an den Konstanten (ein Punkt muss
   mindestens zehn Stufen wert sein), dann an `recalc()` selbst: auf Sollstufe 10
   darf ein Spieler ohne Steigerung höchstens 40 Prozent der Lebensleiste und
   45 Prozent des Schadens des Referenzspielers haben.
2. **Der Aufstieg heilt nicht.** Gefahren über das echte `gainXP()` mit sieben
   Lebenspunkten im Rücken, und zusätzlich gegen den Quelltext geprüft.
3. **Die Stufenleiter steigt streng** und wird von `gainXP()` gelesen statt
   nachgerechnet.
4. **Der Kraftbedarf ist eine Sperre** (`equipItemFromBag` prüft ihn, mindestens
   zwei Klingen tragen einen, eine zu schwere Waffe schlägt sich in `derived`
   nieder), **und der Manapool ist eng**: auf der Befugnisstufe höchstens drei
   Sprüche aus dem vollen Pool, mindestens einer, und das Ultimate ohne Amtskunde
   unbezahlbar, mit sechs Punkten erreichbar.

`tools/monster-fehlversuch.mjs` beweist mit vier neuen Proben, dass der Guard
fallen kann: achtzehn absichtliche Fehler, achtzehn gemeldet, der unveränderte
Stand bleibt grün.

### Nebenbefund: zwei Abschriften und eine falsche Zahl

Beim Umstellen der Stufenleiter fiel auf, dass `zauberAssert()` und
`tools/monster-fehlversuch.mjs` die alte Formel `35 · Stufe^1,35` **abgeschrieben**
trugen, statt sie zu lesen. Beide hätten eine geänderte Leiter nicht gemeldet,
sondern wären an ihr zerbrochen. Sie lesen jetzt `xpFuerStufe()`.

Und Knöterichs Zeile auf Blatt 2 der Dienstanweisung sagte „Neun Punkte", während
dort seit Z2 zehn standen. Sie sagt jetzt „Elf Punkte", und `dienstAssert()`
zählt die Liste nach, damit der nächste Punkt sie nicht wieder still überholt.

### Was bewusst so bleibt

**Die Bänder aus M1 sind unangetastet.** Der Vorwurf lautete nicht, dass Kämpfe
zu kurz sind, sondern dass Steigern folgenlos ist. Wer die Bänder verschiebt,
beantwortet eine Frage, die niemand gestellt hat, und verliert dabei die einzige
belastbare Rechenbasis, die dieses Projekt hat.

**Die Hybridroute darf weiter die schnellste sein.** Wer im Nahkampf steht, um
seine Sprüche zu bezahlen, trägt das volle Risiko der Nähe. Das ist seit Z2 der
Vertrag, und er gilt weiter, nur mit kleinerem Aufschlag: der Zauber legt jetzt
rund ein Drittel auf den Nahkampf drauf statt knapp sechzig Prozent.

**Kesselklingen bleiben stark.** Der Siegelbrecher trägt weiter 42 bis 66 Schaden.
Wäre er nebenbei auch noch schwächer geworden, hätte der Kraftbedarf nichts mehr
aufgeschlossen, für das es sich zu steigern lohnt. Die Belohnung soll groß sein,
sie soll nur nicht umsonst sein.

**Behändigkeit und Amtskunde bleiben Nebenwege.** Der Referenzspieler des Katalogs
steigert Kraft und Zähigkeit, und dabei bleibt es. Behändigkeit trägt jetzt acht
Tempo je Punkt statt fünf, weil das Grundtempo von 135 auf 126 gefallen ist und
damit zum ersten Mal ein Monster im Spiel schneller ist als der Außendienst (die
Fledermaus mit 134). Amtskunde trägt den Pool und damit das Ultimate. Beides sind
Angebote, keine Pflicht.

**Der Tod bleibt Dienstschluss.** An der Schichtregel ändert diese Phase nichts.
Wer stirbt, geht nach Hause, und morgen kommt jemand anderes. Dass das jetzt
häufiger passiert, wenn man die Punkte liegen lässt, ist die ganze Absicht.

### Prüfprotokoll

| Prüfung | Ergebnis |
|---|---|
| Syntax (`node --check`) | ohne Befund |
| Die dreizehn Guards plus `npcAnkerAssert`, im Browser | still, nur die Nachweiszeilen |
| `befaehigungAssert()` | Spreizung, Aufstieg, Stufenleiter, Kraftbedarf und Manapool in Ordnung |
| `monsterAssert()` | 22 Gegner geprüft, alle Bänder eingehalten |
| `zauberAssert()` | Punkteleiter, Sperre und Katalogkopplung in Ordnung |
| `dienstAssert()` | 3 Blätter, Formregeln, Sperrvermerk und Punktezahl in Ordnung |
| `tools/monsterkatalog.py` | 22 Gegner, 0 Verletzungen |
| `tools/monster-fehlversuch.mjs` | 18 absichtliche Fehler, 18 gemeldet, unverändert grün |
| `tools/monster-messlauf.mjs` | 19 Gegner im Band, 3 von 3 Läufen gültig |
| `tools/zauber-messlauf.mjs` | reines Spammen tötet in 60 s keinen einzigen Gegner, Tabelle unten |
| `tools/spaziergang-messlauf.mjs` | vier Läufe je zwei Bauweisen, Tabelle oben |
| Befähigungspanel und Kraftbedarf live im Browser | Punkte vergeben, Siegelbrecher bei Kraft 0 abgewiesen, bei Kraft 12 angelegt (82 bis 132 Schaden) |

Der Zaubermesslauf nach S1, dieselben vier Routen wie in Z2:

| Gegner | Nahkampf | Funke aus Distanz | Nahkampf plus Funke |
|---|---|---|---|
| Chuchu x5 | 5,9 s / 7 | keine Befugnis (Stufe 1) | keine Befugnis |
| Grünhaut x4 | 4,2 s / 28 | keine Befugnis (Stufe 2) | keine Befugnis |
| Waldschamane x2 | 27 s / 206 | keine Befugnis (Stufe 3) | keine Befugnis |
| Klippkrabbe x2 | 14,1 s / 125 | über 60 s / 422 | 14,9 s / 128 |
| Sandskorpion x2 | 17,5 s / 299 | über 60 s / **3499** | 15,8 s / 0 |
| Höhlenspinne x2 | 27 s / 630 | über 60 s / 705 | 13 s / 108 |
| Mumie | 16,3 s / 75 | über 60 s / 778 | 16,3 s / 76 |
| Knochenritter | 20,4 s / 365 | über 60 s / 2453 | 15,5 s / 348 |

Die Aussage von Z2 gilt unverändert und schärfer: reines Spammen tötet nichts,
und der Versuch kostet ein Vielfaches der Lebensleiste. Neu ist die dritte Spalte
gegen die erste: die Hybridroute schlägt den reinen Nahkampf noch, aber nicht mehr
überall und nicht mehr so deutlich. Gegen die beiden versiegelten Gegner aus M2
(Klippkrabbe, Mumie) bringt der Funke weiterhin nichts, dort bleibt die Waffe der
Konter.
