## W11-GH: Serie G und H, vierzehn Blätter an zwei Orten — ERLEDIGT

Der dritte und letzte Teil der drei Blattserien aus `weltgeschichte.md`,
Kapitel 9. Serie I kam mit SZ3; G und H standen seither ausgeschrieben da,
und die Weltbibel (Kapitel 12) führte sie als „noch nicht eingebaut". Kein
Satz ist hier erfunden worden; zwei Zeilen sind umformuliert, und warum,
steht in Abschnitt 3.

Gebaut am 04.10.2026 auf Zuruf des Projektinhabers, nach RL7, AN7 und der
Umhängung der Ernennung.

---

### 1. Wo die Blätter liegen, und warum H zwei Orte hat

Die Weltbibel legt die Serien an einen Ort, nicht an einen Mechanismus:
**G ins Steinfeld**, weil der Altbestand die Ablage aus der Zeit ist, als das
Haus noch anders hieß, und Reichsschriftgut genau das ist. **H ins Lager der
Beschwerden und in den Moorbruch**, weil die Gegenseite die sechs Schreiben
verfasst hat und sie der Beweis sind, dass dort nie jemand angreifen wollte.

Das Steinfeld ist das Biom `ruine`, der Moorbruch das Biom `sumpf`, und
beide haben Kammertüren (`tuerBandRange()` in `skript/01` kennt alle fünf
Bänder). Also laufen G und H über denselben Weg wie B, C und D: ein
`biome`-Feld am Blatt, der Filter in `truheOeffnen()` (`skript/05`) vergleicht
es mit `kammer.biome`. Bis heute gaben die Truhen im Steinfeld und im
Moorbruch nur Serie A her, weil kein Blatt dort lag; jetzt liegen vierzehn
dort.

Das Lager hat keine Kammer. Es ist ein Rechteck im Grasland (`LAGER`,
`imLager()` in `skript/01`) mit sechs Wachen, die nie zuerst angreifen
(`lagerwache:true` in `MONDEF`). Ohne einen zweiten Weg läge H dort, wo sie
hingehört, aber nicht dort, wo man sie finden kann. Der zweite Weg steht in
`killMon()` (`skript/03`), direkt vor dem Röhrenweg der Serie I: fällt eine
Lagerwache und ist H frei, fällt mit Wahrscheinlichkeit 0,25 eines der noch
fehlenden Schreiben. **Der Preis ist Absicht:** wer hier ein Blatt findet, hat
sich entschieden, jemanden zu erschlagen, der nur gewartet hat. Der Moorbruch
ist der Weg für alle, die das nicht wollen.

Warum 0,25 und nicht 0,04 wie Serie E: das Lager gibt je Schicht genau sechs
Würfe her (`setzeLager()` läuft in `placeMonsters()` bei jedem
`startShift()`), Ablage V gibt hunderte. Erwartungswert anderthalb Blätter je
geräumtem Lager, die Serie in rund vier Schichten, wenn man sonst nirgends
sucht. Gemessen: drei Läufe über je 4000 Kills ergaben 0,2362, 0,2592 und
0,2575 (04.10.2026, `serien-pruef.mjs`, Abschnitt 4).

### 2. Das Aktgatter

`SERIE_AKT` (`skript/04`) bekommt `G:3, H:2`. **H ab Akt II**, Schicht 10,
wenn laut Weltbibel Kapitel 9 die Aktenfunde beginnen: sechsmal dieselbe
Rückfrage verrät nichts, sie ist ein Witz mit langem Atem. **G ab Akt III**,
Schicht 20: Blatt 2 nennt in der Rangliste das Haus mit Vorgang 1, Blatt 8
stellt die Ausschreibung der Amtsleitung zurück, und die Amtsleitung ist die
Frage des dritten Akts („N. N."), nicht die des zweiten. Das ist eine
Entscheidung, keine Vorgabe; die Weltgeschichte nennt keinen Akt. Wer G
früher will, ändert eine Zahl und die Schwellentabelle in `vorgangAssert()`.

`vorgangAssert()` (`skript/06`) prüft die Schwellen exakt: G gesperrt bei 19,
frei bei 20; H gesperrt bei 9, frei bei 10. Serie I stand bis heute nicht in
der Schwellentabelle, obwohl sie seit SZ3 ein Gatter hat; nachgetragen
(`I:30`).

### 3. Zwei Zeilen sind umformuliert, und das steht hier, weil es Kanon berührt

Der Sperrvermerk der Weltbibel („kein Blatt darf Kesselgrammatik enthalten")
ist als Guard gebaut: `blaetterAssert()` liest jede Zeile gegen `PRUEF_GEHEIM`,
eine Liste von Wörtern, die im Spiel die Rezeptsprache des Kessels tragen.
Zwei Zeilen der Weltgeschichte treffen diese Liste, ohne Kesselgrammatik zu
sein:

| Blatt | Weltgeschichte | im Spiel | Treffer |
|---|---|---|---|
| G 1, Zeile 2 | „Der Rang eines Hauses ergibt sich aus dem Alter seines ältesten offenen Vorgangs." | „Der Rang eines Hauses bemisst sich danach, wie lange sein ältester Vorgang offen ist." | `ergibt`, `Alter` |
| G 6, Zeile 3 | „Eine Aufnahme wurde dreimal angeregt und dreimal zurückgestellt." | „Eine Aufnahme wurde drei Mal angeregt und drei Mal zurückgestellt." | `dreimal` |

Die Alternative wäre gewesen, den Guard zu lockern: eine Ausnahmeliste je
Blatt, oder `Alter` und `dreimal` aus der Sperrliste zu nehmen. Beides schwächt
den Sperrvermerk, und der ist Kanon mit demselben Rang wie der Wortlaut der
Blätter. Umformuliert wurde deshalb der Text, und zwar so, dass Sinn und
Pointe stehen: der Randvermerk „Also ist Nichtstun eine Leistung?" braucht
nur, dass der Satz davor Nichtstun belohnt, und das tut er weiter; „drei Mal"
ist dasselbe Wort, anders geschrieben. Die zweite Fassung von G 1 entspricht
außerdem dem Glossar der Weltbibel („wie lange der älteste offene Vorgang
eines Hauses schon offen ist") und Bramsches Zusatzzeile aus W11.

Beides steht datiert in der Weltbibel (Kapitel 12) und als Hinweis in der
Weltgeschichte (Kapitel 9). **Wer den Wortlaut zurück will, entscheidet
zugleich über den Guard.** Das ist die offene Frage an den Projektinhaber,
siehe „Bewusst offen".

### 4. Die siebte Zeile

„Wer alle sechs hat, bekommt in der Kladde eine siebte Zeile, und sie ist die
einzige Wertung im ganzen Bestand": `renderBlaetter()` (`skript/06`) hängt
unter das letzte gefundene H-Blatt ein `div.akWertung` mit dem Wortlaut aus
`SERIE_H_WERTUNG`, sobald `serieVollstaendig('H')` wahr ist. Sie ist kein
Blatt: nicht in `BLAETTER`, nicht in der Zählzeile, nicht aufschlagbar, und
sie hängt nicht am sechsten Blatt, sondern an allen sechs; wer h6 zuerst
findet, bekommt sie nicht. CSS in `index.html` (`#blaetterBox .akWertung`):
kein linker Rand, kein Zeiger, kursiv wie die Zählzeile, damit sie wie ein
Vermerk unter dem Stapel steht und nicht wie ein siebtes Blatt.

### 5. Der Guard

`blaetterAssert()` (`skript/03`): `TRUHE_SERIEN` um G und H, `SOLL` um
`G:8, H:6`, Gesamtzahl 54 → 68. Dazu zwei neue Zusicherungen, die den Kanon
festhalten und nicht nur die Form: G liegt im Steinfeld (`biome === 'ruine'`),
H im Moorbruch (`biome === 'sumpf'`). Ein anderes Biom wäre kein Fehler im
Code, aber ein Widerspruch zur Weltbibel, und den soll die Konsole melden.

Den Lagerweg kann der Guard nicht prüfen: `MONDEF` liegt tausend Zeilen
weiter unten, ein Zugriff liefe in die temporale Totzone (die Falle, vor der
der Kommentar über dem Guard seit W2 warnt). Dafür ist Abschnitt 4 von
`serien-pruef.mjs` da.

### 6. Was sichtbar ist

Ein Punkt in `NEUERUNGEN`, Stempel `2026-10-04-gh` (fünfter desselben Tages).
Die Zählzeile unter Akten liest „N von 68". Kein Text außerhalb der Blätter
hat sich geändert.

---

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über
Playwright, ohne Grafikbibliothek (prüft Skript und Ladekette, nicht Bilder).
04.10.2026.

| Prüfung | Ergebnis |
|---|---|
| `node tools/serien-pruef.mjs` | **36 von 36**, drei Läufe hintereinander |
| davon Lagerwurf, je 4000 Kills | 0,2362 / 0,2592 / 0,2575, Soll 0,25 |
| `node tools/ladelauf-pruef.mjs` | 12 „in Ordnung", 0 Warnungen, Konsole still |
| `node --check` über sieben Dateien | still |
| `node tools/build-single.mjs` | gebaut |
| Sperrvermerk-Vorprobe der 14 neuen Blätter (Skriptebene, ohne Browser) | 0 Treffer nach der Umformulierung; vorher 3 (siehe Abschnitt 3) |

Regression, alle `tools/*-pruef.mjs`:

| Werkzeug | |
|---|---|
| `anlage2-pruef` | 123 von 123 |
| `ebene-pruef` | 54 von 54 |
| `empfang-pruef` | 190 von 190 |
| `gespraech-pruef` | 89 von 89 |
| `innen-pruef` | 27 von 27 |
| `intro-pruef` | misst unverändert: 648 Wörter bis zum ersten freien Schritt (Pflicht), 906 (Vielleser), Nachlauf 82 |
| `langvorgang-pruef` | 58 von 58 |
| `menue-pruef` | 78 von 78 |
| `mitteilung-pruef` | 32 von 32 |
| `reich-pruef` | 59 von 59 |
| `schluss-pruef` | 36 von 36 |
| `speicher-pruef` | 38 von 38 |
| `steuerung-pruef` | Alles in Ordnung |
| `stopfen-pruef` | 43 von 43 |
| `szene-pruef` | 50 von 50 |
| `versuchung-pruef` | 67 von 67 |
| `zulagen-pruef` | 50 von 50 |

Kein Prüfwerkzeug außer dem neuen musste angefasst werden: keines zählt die
Blätter mit, und `vorgangAssert()` liest `SERIE_AKT` und `BLAETTER` selbst.

### Bewusst offen

* **Der Wortlaut von G 1 und G 6** (Abschnitt 3). Zurück zum Original heißt:
  Guard lockern. Entscheidung des Projektinhabers.
* **Der Akt für G** (Abschnitt 2) ist gesetzt, nicht vorgegeben.
* **Die drei Lagerwachen hinterlassen eine Spur im Dorf?** Nein, bewusst
  nicht. Das Lager reagiert nicht darauf, dass seine Wachen fallen; das wäre
  ein eigener Bauabschnitt und steht in keiner Vorlage.
* **Serie H als Dublettenfehler.** Die Weltgeschichte will, dass man die
  Blätter einzeln für einen Fehler hält. Der Reiter zeigt sie als „Serie H,
  Blatt 1" bis „Blatt 6" mit Nummer, das schwächt den Effekt ein wenig. Die
  Nummer bleibt, weil jede andere Serie sie trägt und eine Ausnahme im Reiter
  mehr erklären würde als sie versteckt.
