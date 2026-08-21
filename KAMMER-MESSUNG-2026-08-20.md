# Messung: der Kammerkanal, und was er an F20 umwirft

**Datum:** 20.08.2026
**Ausgangslage:** `main` stand auf `42991b6`. Die Messung vom 06.08. (`GW-RESTFUNDE-2026-08-06.md`, Abschnitt 3) beantwortete F20 mit 172 Gold Bankzufluss je Schicht und nannte selbst zwei Lücken: der Messbot hat **keine einzige Kammer betreten**, und er hat nur einen von vier Aushängen erfüllt.
**Auftrag:** die Kammerlücke schließen, bevor über die Ausbaukosten entschieden wird.

Dieses Dokument nennt die Methode samt ihrer Grenze, die Rohwerte, und die zwei Stellen, an denen die alte Antwort auf F20 dadurch falsch wird.

---

## 1. Warum hier kein Kampfbot gefahren ist

Der erste Versuch war der naheliegende: den Bot vom 06.08. nachbauen und ihn zusätzlich Kammern spielen lassen. Der Nachbau kam auf **3 bis 13 Kills je Schicht**, der Referenzlauf auf 19 bis 63. Ein Bot, der eine Kammer durchspielt, müsste außerdem Platten, Fackeln, Blöcke, Schalter, Wellen, das Symbolschloss und die Spiegel lösen.

Beides zusammen hätte die **Rätsel- und Kampffertigkeit des Bots** gemessen und nicht die Ökonomie des Spiels. Die Zahl wäre unbrauchbar gewesen, und zwar unbrauchbar in unbekannter Richtung.

Gemessen wurde deshalb nur, was exakt messbar ist:

* die **echte Weltgeneration** (`startShift()` würfelt die Türen aus dem gesiegelten Strom, sechs Welten),
* die **tatsächlichen Türstufen** aus `wuerfleTuer()`,
* die **wirklichen Laufwege** als Breitensuche über `reachbar()` auf der echten Karte, paarweise zwischen allen Türen und dem Dorf,
* das **Truhengold** aus der Formel in `truheOeffnen()`.

**Angenommen und nicht gemessen ist allein die Zeit im Rätsel.** Sie steht deshalb nicht als Zahl im Ergebnis, sondern als Spalte: die Tabelle wird für 60, 90, 120 und 180 Sekunden je Kammer gerechnet.

---

## 2. Die Karte, gemessen

| Größe | Wert |
|---|---|
| Kammertüren je Welt | 15 (5 je Biom), **alle erreichbar**, über sechs Welten kein einziger Ausreißer |
| Stufenverteilung 1 bis 5 | 12 / 22 / 21 / 15 / 20, Mittel **3,1** |
| Truhengold im Mittel je Kammer | **246** (`rri(40,80)*(1+diff)`, Erwartungswert 60 mal (1+3,1)) |
| Fußweg Dorf zur nächsten Tür | 14, 15, 15, 17, 19, 23 s |
| Fußweg Dorf zu einer Tür, Median | 34 s, längster 67 s |
| Neuversiegeln nach dem Plündern | 120 s, mit Dienstsiegel 40 s |

Die kurzen Wege sind kein Zufall: `setzeKammerTueren()` zwingt die **erste Tür jedes Bandes** in einen Umkreis von 70 Kacheln ums Dorf. Genau dafür wurde die Regel gebaut, sie wirkt.

Laufgeschwindigkeit 135 px/s, der Wert bei Schichtbeginn ohne `agi`-Punkte. Die Breitensuche zählt in Vierer-Nachbarschaft, die echte Bewegung darf diagonal und ist damit schneller: die Wegzeiten oben sind **obere Schranken**, die daraus gerechneten Kammerzahlen also untere.

---

## 3. Der Rundgang

Greedy über die 1500-Sekunden-Uhr: immer zur nächsten gerade offenen Tür, Rätselzeit absitzen, Truhe, weiter. Mittel über sechs Welten.

| Rätselzeit je Kammer | Kammern je Schicht | Beute je Schicht |
|---|---|---|
| 180 s | 7 (7 bis 7) | **1700** |
| 120 s | 10,5 (10 bis 11) | 2540 |
| 90 s | 13,7 (13 bis 14) | 3290 |
| 60 s | 18,2 (18 bis 19) | 4430 |

Zum Vergleich die Oberwelt aus der Messung vom 06.08.: Gold am Schichtende 81 / 334 / 328 / 236 / 443, **Mittel 284**.

**In der pessimistischsten Zeile trägt der Kammerkanal rund das Sechsfache des Oberweltkanals.**

Bei 180 s bindet das Neuversiegeln nicht: wer nach 180 Sekunden Rätsel plus Fußweg zurückkommt, findet die Tür längst wieder versiegelt. Der Wert steht damit unabhängig vom Dienstsiegel-Bonus. Nur die 60-Sekunden-Zeile hängt am Nachwachsen, und dort ist zusätzlich zu beachten, dass `tuer.cd` **nicht** herunterzählt, solange der Spieler in einer Kammer steht (die Schleife über `kammerTueren` liegt im `else`-Zweig von `if(kammer)`). Diese eine Zeile ist deshalb leicht zu optimistisch. Die 180er nicht.

---

## 4. Erster Befund: die 172 waren zu niedrig, und zwar systematisch

Der Bericht vom 06.08. nennt 172 Gold Bankzufluss je Schicht. Das ist der **Anlaufwert über fünf Schichten aus dem Stand**, nicht der eingeschwungene.

`endShift()` rechnet seit F19:

```js
const carryGold = Math.round(player.gold * CONFIG.goldUebertragAnteil);  // 0.5
const abgabe    = player.gold - carryGold;
amt.bankGold += abgabe;
```

Der Gürtelübertrag geht als `pendingCarryGold` in die nächste Schicht und wird dort erneut geteilt. Im eingeschwungenen Zustand gilt `carry = 0,5 · (carry + beute)`, also **`carry = beute`**, und damit

> **Bankzufluss je Schicht = volle Schichtbeute.**

Nicht die Hälfte. Die Hälfte ist nur der Anlauf. Wer die 172 als Dauerwert liest, rechnet den Ausbau doppelt so teuer, wie er ist.

---

## 5. Zweiter Befund: F20, neu gerechnet

Vollausbau 3850 Gold (1800 Anfangsstufe + 1650 Kontingent + 240 Türen + 100 Vermutungen + 60 Startfluch, nachgerechnet gegen `AUSBAU_DEFS`).

| Spielweise | Bankzufluss je Schicht | Schichten bis Vollausbau |
|---|---|---|
| nur Oberwelt, eingeschwungen | 284 | **14** |
| Oberwelt plus Kammern bei 180 s Rätselzeit | rund 1980 | **2** |
| Oberwelt plus Kammern bei 120 s | rund 2820 | **1 bis 2** |

Akt V beginnt bei Schicht 41.

**Die Antwort auf F20 lautet damit nicht mehr „3850 ist keine Wand", sondern: 3850 ist kaum eine Schwelle.** Wer Kammern spielt, hat den kompletten Ausbau vor dem zweiten Jahresgespräch. Der Bericht vom 06.08. kam auf 9 bis 23 Schichten; beide Zahlen waren zu hoch, aus zwei unabhängigen Gründen (fehlender Kammerkanal, Anlaufwert statt Dauerwert).

---

## 6. Was daraus **nicht** folgt

**Die Preise anzuheben wäre der falsche Hebel.** Ein Faktor auf `AUSBAU_DEFS` trifft den Oberweltspieler, der ohnehin der langsame ist, und ist für den Kammerspieler eine Rundungsstelle. Das Missverhältnis liegt nicht zwischen Preis und Einkommen, sondern zwischen den beiden Einkommenskanälen.

**Und der Abstand der Kanäle ist vermutlich gewollt.** Weltbibel Kapitel 3: „Schwere Kammern sind der einzige verlässliche Weg zu seltenen Zutaten." Die Kammer ist der belohnte Pfad. Neu ist nicht die Richtung, sondern die Größe, und dass die F20-Notiz von einem viel kleineren Verhältnis ausging.

**Der Ausbau ist außerdem keine Sperre.** Er beschleunigt eine Schicht, er schaltet nichts frei. Die Meta-Progression des Spiels ist laut 18.2 der Rang, und der lässt sich ausdrücklich nicht kaufen. Ein zu billiger Ausbau ist damit eine Randnotiz, kein Designfehler.

---

## 7. Was die Messung nicht kann

* **Die Rätselzeit ist gesetzt, nicht gemessen.** Vier Werte statt einer Zahl, aus genau diesem Grund.
* **Kampfzeit auf dem Weg ist nicht modelliert.** Dafür fehlt umgekehrt das Gold der Kammermonster und der Zutaten. Die beiden Fehler zeigen in verschiedene Richtungen und heben sich nicht nachweislich auf.
* **Kein Fluch ist mitgerechnet.** Mit `Fundsteuer` fällt das Truhengold um 40 Prozent.
* **Optisch ist nichts geprüft.** Im Messcontainer fehlt `assets/cf`, die Grafik lädt nicht. Der Rendering-Fehler in der Konsole steht identisch auf unverändertem `HEAD` und gehört nicht zu dieser Messung.

---

## 8. Offen geblieben, und zwar neu

Beim Nachlesen für diese Messung ist ein Widerspruch aufgefallen, der älter ist als F19 und in keinem Bericht steht.

**Weltbibel Kapitel 5:** „Gold zur Hälfte. Der Rest ist **Verwaltungskostenanteil**. Das ist eine Frechheit."
**Weltbibel, Namensregister:** `| Verwaltungskostenanteil | das verlorene Gold | eine Frechheit |` — und die mittlere Spalte dieser Tabelle nennt durchgehend den **Spielbegriff** (der Tod, das Kammerschild, die Zutat, der Kessel).

Der Code kennt seit F19 keinen Verlust: Gürtel und Amtskasse sind zwei Hälften desselben Topfes, die Summe beider Buchungen ist exakt `player.gold`, es überleben 100 Prozent.

Zwei Lesarten, beide vertretbar:

1. **Der Anteil ist verloren.** Dann fehlt dem Spiel eine Verlustquote, die Amtskasse dürfte aus der Schichtbeute gar nichts bekommen, und der Ausbau wäre allein über den Aushanglohn zu finanzieren. Das wäre ein sehr großer Eingriff.
2. **Der Anteil ist das, was das Amt einbehält.** Verloren ist er dann aus Sicht des Außendienstlers, der ihn nicht mit nach Hause nimmt, und die Amtskasse ist genau dieser Anteil. Dann beschreibt der heutige Code die Weltbibel korrekt und nur die mittlere Registerspalte ist unglücklich formuliert.

Welche gilt, ist eine Frage an den Autor der Weltbibel und keine, die eine Messung beantwortet. Sie ist hier festgehalten, damit sie nicht wieder verschwindet.

---

## 9. Nachtrag vom selben Tag: entschieden, und was das an den Zahlen oben ändert

**Entscheidung:** ein dritter Empfänger. Der Verwaltungskostenanteil verlässt das Spiel, `CONFIG.verwaltungskosten = 0.2`. Aufteilung damit **50 Prozent Gürtel, 30 Prozent Amtskasse, 20 Prozent weg**, beide Anteile auf den Bruttowert gerechnet, die Kasse bekommt den Rest und kann deshalb nie negativ werden.

Der Gürtelanteil bleibt bewusst der **Brutto**anteil: Weltbibel Kapitel 5 sagt „Gold zur Hälfte" und nicht „die Hälfte von dem, was übrig ist". Damit ist der Satz jetzt wörtlich wahr, und der Verwaltungskostenanteil ist das, wonach er im Namensregister heißt.

Die Rechnung ist als eigene Funktion `goldAufteilung()` aus `endShift()` herausgezogen, weil `endShift()` mit DOM, Zutatenkontingent und Speicherpfad verwoben und für einen Guard nicht erreichbar ist. `goldAssert()` prüft die Erhaltungsgröße statt der Formel: die drei Empfänger ergeben zusammen exakt die Beute, keiner wird negativ, alle drei sind ganzzahlig, die beiden Anteile sind Bruttoanteile, und bei gesetztem Regler ist Gürtel plus Kasse **echt kleiner** als die Beute. Ohne diesen letzten Punkt liefe der Guard auch dann grün, wenn der Verlust nur umgebucht würde.

**Was das an Abschnitt 4 und 5 ändert.** Im eingeschwungenen Zustand gilt weiterhin `carry = beute`, die Kasse bekommt aber nicht mehr die volle Beute, sondern **60 Prozent** davon (`0,3 · (carry + beute)`).

| Spielweise | Bankzufluss je Schicht | Schichten bis Vollausbau |
|---|---|---|
| nur Oberwelt, eingeschwungen | 170 | **23** |
| Oberwelt plus Kammern bei 180 s Rätselzeit | rund 1190 | **3** |
| Oberwelt plus Kammern bei 120 s | rund 1690 | **2 bis 3** |

Die Oberweltzeile landet damit zufällig wieder bei den 23 Schichten, die der Bericht vom 06.08. nannte — aus einer anderen Rechnung und mit einer anderen Begründung.

**Die Preise sind unverändert geblieben**, wie in Abschnitt 6 empfohlen. Der Verwaltungskostenanteil bremst beide Kanäle proportional statt nur den langsamen, und er gibt den beiden Gold-Flüchen ihre Angriffsfläche zurück: `Verwaltungsgebühr` und `Goldschwund` zehren am Gürtelgold, und das ist seit heute wieder ein Betrag, der verloren gehen kann.

**Gemessen nach der Änderung**, echter Schichtabschluss mit 443 Gold: 222 mitgenommen, 132 an die Amtskasse, 89 Verwaltungskostenanteil, Summe exakt 443. Alle neun Guards true, `console.error` abgefangen und leer. Zwei Sabotagen gefahren, beide gemeldet: der Verlust nur umgebucht (18 Meldungen, Erhaltungsgröße) und der Gürtelanteil vom Rest statt vom Bruttowert gerechnet (3 Meldungen, Bruttoanteil).
