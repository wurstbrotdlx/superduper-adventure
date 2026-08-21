## Z2: Die Zauberbefugnis — ERLEDIGT

Nachtrag zu Z1 (`phase-z1-zauberbalance.md`). Der Spielbericht danach: die Zauber sind
immer noch zu stark, das Muster ist Rennen und Spammen. Vor dem ersten Zauber sind die
Kämpfe taktisch, sobald Zauber dazukommen nicht mehr.

Der Bericht stimmt, und Z1 konnte ihn nicht beheben, weil Z1 am Preis geschraubt hat,
nicht an der Quelle. Die Z1-Bremsen machen das Spammen langsamer und riskanter, aber die
Ressource dahinter blieb geschenkt: **Mana regenerierte passiv mit 8 je Sekunde.** Wer
wegrennt, wurde dafür bezahlt. Solange das so ist, bleibt Abstand die beste Stellung, und
jede weitere Bremse macht das Spiel nur zäher, nicht taktischer.

### Die drei Eingriffe

**Z2-1: Zauber sind eine Befugnis, und das Amt erteilt sie ab Stufe 4.** Vorher gibt es
keinen Zauberpunkt und keine Freischaltung. Die Punkte der Stufen 2 und 3 entfallen
ersatzlos, es wird nichts aufgespart: der erste Punkt kommt mit dem Aufstieg auf Stufe 4,
danach einer je Stufe. Zauber sind dadurch insgesamt seltener und wertvoller, und das
Ultimate rückt von Stufe 11 auf Stufe 13. Der Ausbau "Höhere Anfangsstufe" zahlt nur noch
die Punkte aus, die ein normaler Aufstieg auch gezahlt hätte (Anfangsstufe 4 bringt einen,
Anfangsstufe 10 bringt sieben).

Die ersten drei Stufen gehören damit vollständig dem Nahkampf, und das sind genau die
Stufen, die im Nahfeld ums Dorf gespielt werden. Der Teil des Spiels, der im Bericht
"schön taktisch" heißt, ist jetzt der garantierte Anfang jeder Schicht.

**Z2-2: Mana entsteht bei der Arbeit, nicht beim Warten.** Die passive Regeneration fällt
von 8 auf 2 je Sekunde. Dafür lädt jeder Waffenschwung, der mindestens einen Gegner
trifft, 4 Mana. Einmal je Schwung, nicht je Getroffenem, sonst wäre ein Cleave durch fünf
Chuchus ein Manabrunnen.

Die Rechnung dahinter: 1,3 Schwünge je Sekunde ergeben rund 7,2 Mana je Sekunde **im**
Kampf, fast die alten 8. Auf der Flucht sind es 2. Wer im Kampf steht, kann also ungefähr
so viel zaubern wie vorher; wer auf Abstand spammt, verhungert an der Leiste. Das dreht
die Rollen um: der Zauber ist nicht mehr der Ersatz für den Nahkampf, er ist seine
Belohnung.

Zwei Nebenwirkungen sind gewollt. Der Affix Manafluss fällt von +4 auf +2 je Rang, denn
bei Basis 2 wären +4 eine Verdreifachung, gemeint war immer ein Anteil. Und die
Treffer-Ladung wirkt auch unter dem Fluch Manastopp: dessen Text sagt wörtlich, dass Mana
nicht mehr "von selbst" zurückkehrt, und erarbeitetes Mana kehrt nicht von selbst zurück.
Der bisher härteste Fluch hat damit zum ersten Mal einen Konter, der zu seiner eigenen
Formulierung passt.

**Z2-3: Die Freischaltung ist sichtbar.** Vor Stufe 4 zeigen Zauber- und Ultimate-Knopf
ein Schloss mit "ab St. 4", der Zauberbaum bleibt zum Stöbern offen und trägt die Zeile
"Zauberbefugnis wird ab Stufe 4 erteilt". Beim Aufstieg auf Stufe 4 erscheint groß
ZAUBERBEFUGNIS ERTEILT, Knöterich meldet sich mit "Befugnis erteilt. Der Punkt liegt
bereit." (sein alter Spruch feuerte bisher auf Stufe 2), und die Dienstanweisung nennt
die Befugnis auf Blatt 2 und Blatt 3. Der Stups "Sie schlagen nur. Es gibt auch Zauber."
kommt erst ab Stufe 4, vorher wäre er eine Falschauskunft.

### Was die Messung sagt

`tools/zauber-messlauf.mjs`, jetzt mit vier Routen je Gegnergruppe. Die neue vierte ist
die gewollte Spielweise: Nahkampf, und sobald das erarbeitete Mana reicht, den Funken
dazwischen.

| Gegner | Nahkampf | Funke aus Distanz | Nahkampf plus Funke |
|---|---|---|---|
| Chuchu x5 | 4,2 s / 2 | keine Befugnis (Stufe 1) | keine Befugnis |
| Waldschamane x2 | 28,6 s / 248 | keine Befugnis (Stufe 3) | keine Befugnis |
| Klippkrabbe x2 | 14,1 s / 91 | über 60 s / 557 | 12,5 s / 16 |
| Sandskorpion x2 | 18,3 s / 434 | über 60 s / **3699** | 12,5 s / 154 |
| Höhlenspinne x2 | 18,2 s / 289 | über 60 s / 1498 | 6,7 s / 0 |
| Mumie | 15,5 s / 80 | über 60 s / 910 | 16,3 s / 69 |
| Knochenritter | 19,6 s / 432 | über 60 s / 2466 | 9,0 s / 0 |

Drei Dinge stehen in dieser Tabelle. Erstens: **reines Spammen tötet nichts mehr.** Kein
einziger Gegner fällt binnen sechzig Sekunden, und der Versuch kostet ein Mehrfaches der
Lebensleiste (der Skorpion holt sich das Sechzehnfache). Zweitens: **die Hybridroute ist
die schnellste im Spiel.** Wer in den Kampf geht und die Sprüche aus dem erarbeiteten Mana
zahlt, schlägt den reinen Nahkampf deutlich. Die Belohnung fürs Reingehen ist echt.
Drittens: bei Klippkrabbe und Mumie bringt der Funke fast nichts dazu, das sind die
versiegelten Gegner aus M2, ihr Konter bleibt die Waffe.

Reine Zauberrouten gegen einzelne schwere Ziele bleiben möglich, aber als Burst plus
erarbeitetes Mana, nicht als Dauerstrom: der Pool trägt den Anfang, der Nahkampf
finanziert den Rest.

### Katalog-Kopplung

Die Zauberleistung des Katalogs (`KAT_ZAUBER_DPS`, vorher hart kodierte 8 Mana je
Sekunde) ist jetzt aus den Manakonstanten abgeleitet: 7,2 Mana je Sekunde im Kampf ergeben
23,04 Schaden je Sekunde statt 25,6. Die drei Gegner mit Zauber-Sollroute wurden vom
Generator neu gerechnet, ihre Sollzeiten sind unverändert:

| Gegner | HP vorher | HP jetzt |
|---|---|---|
| Der Moorbescheid | 385 | 345 |
| Steingolem | 1220 | 1100 |
| Die Sammelverfügung | 1240 | 1120 |

Details in `monsterkatalog-stufe-1-10.md`, Abschnitt 3.10.

### Der zwölfte Guard

`zauberAssert()` prüft beim Laden, nach dem Spiegeln-und-Zurückstellen-Muster von
`wiederAssert`: die Punkteleiter wird über das echte `gainXP()` gefahren (unter Stufe 4
nie ein Punkt, ab Stufe 4 genau Stufe minus 3), `spellUnlockable()` bleibt unter der
Befugnisstufe auch mit künstlich gesetzten Punkten zu, die Ausbau-Formel in `startShift()`
zahlt dieselbe Leiter wie die Aufstiege, und `KAT_ZAUBER_DPS` hängt an den Manakonstanten
statt an einer zweiten hart kodierten Zahl. `tools/monster-fehlversuch.mjs` beweist mit
zwei neuen Proben, dass der Guard fallen kann: zwölf absichtliche Fehler, zwölf gemeldet,
der unveränderte Stand bleibt grün.

### Nebenbefund: die Messläufe standen seit M2 im Dorf

Beim Nachmessen fiel auf, dass `tools/monster-messlauf.mjs` und `tools/zauber-messlauf.mjs`
ihre Arena am Spieler-Startpunkt aufbauten, und der liegt mitten im Dorf. Seit dem
Hausrecht aus M2 verlieren Monster dort sofort die Aggro: die Läufe maßen Gegner, die gar
nicht kämpfen durften. Beide Werkzeuge suchen sich jetzt eine freie Lichtung von 12 mal 5
Kacheln hinter dem Bannring (eine größere existiert auf der erzeugten Karte nirgends,
nachgemessen) und halten Gegner wie Spieler darin fest, denn ohne Wegfindung misst ein
Lauf sonst die erstbeste Baumkante statt des Gegners. Die M2-Prüfzeilen dieser beiden
Werkzeuge stammten aus Läufen vor dem Hausrecht und waren davon nicht betroffen.

### Was bewusst so bleibt

**Der Nahkampf ist unangetastet.** Alle 19 physischen Sollrouten liegen weiter in ihren
Bändern, 3 von 3 Läufen gültig.

**Die Hybridroute darf schneller sein als die Sollzeit.** Die Bänder des Katalogs gelten
für die Sollroute. Wer beide Systeme beherrscht und im Nahkampf steht, um seine Sprüche zu
bezahlen, trägt das volle Risiko der Nähe und wird mit Tempo bezahlt. Das ist kein Leck,
das ist der Vertrag.

**INT bleibt ein reiner Poolwert.** Mehr maximales Mana heißt mehr Burst am Kampfanfang.
Eine INT-Skalierung der Treffer-Ladung wäre die nächste Spam-Schraube, genau das nicht.

### Prüfprotokoll

| Prüfung | Ergebnis |
|---|---|
| Syntax | ohne Befund |
| Die zwölf Guards plus `npcAnkerAssert` | still, nur die Nachweiszeilen |
| `zauberAssert()` | Punkteleiter, Sperre und Katalogkopplung in Ordnung |
| `monsterAssert()` | 22 Gegner geprüft, alle Bänder eingehalten |
| `tools/monsterkatalog.py` | 22 Gegner, 0 Verletzungen |
| `tools/monster-fehlversuch.mjs` | zwölf absichtliche Fehler, zwölf gemeldet, unverändert grün |
| `tools/monster-messlauf.mjs` | 19 Gegner im Band, 3 von 3 Läufen gültig, neue Arena |
| `tools/zauber-messlauf.mjs` | Tabelle oben, vier Routen |
| `tools/spaziergang-messlauf.mjs` | erster Kill nach 6,4 s, 68 Kills, Stufe 7, überlebt |
| Stufensperre headless | Stufe 1 bis 3 gesperrt (auch mit künstlichen Punkten und Sprüchen), Stufe 4 schaltet frei, Floater erscheint, Ausbau zahlt 0/0/1/7 Punkte bei Anfangsstufe 1/3/4/10 |
| Manaraten headless | passiv 2,0 je Sekunde, Treffer-Ladung 4 je Schwung, unter Manastopp passiv 0 und Ladung 4 |
