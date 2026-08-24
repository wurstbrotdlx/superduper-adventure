## M4: Die zweite Ebene — ERLEDIGT

Die Leiter bekommt ihr Untergeschoss. M3 hatte sie ausdrücklich liegen gelassen,
mit einer Begründung, die auch die Bauanleitung war:

> `Rails.png`, `Cave_Floor_Ladder` und die Cave-Wasseranimation liegen ungenutzt:
> Schienen ohne Lore und eine Leiter ohne zweite Ebene wären Behauptungen, keine
> Mechanik.

`WELT-ERWEITERUNG-2026-08-24.md` hat daraus den ersten von vier Schritten
gemacht: nicht größer, sondern tiefer, und dieser Schritt zuerst, weil er
liegendes Material benutzt, einen selbst notierten offenen Punkt schließt und
keine einzige Weltfrage stellt.

Er stellt trotzdem drei Entscheidungen, und eine davon hat einen Fehler ans
Licht gebracht, der seit M3 im Spiel steht.

---

### 1. Wo es hinuntergeht, und warum nur dort

Die zweite Ebene hängt am **Kammersatz**, nicht am Gebührenbescheid:

```js
const KAM_EBENEN = [1, 1, 2];          // Dungeon_1, Dungeon_2, Stollen
```

Das ist keine Baulaune, sondern die Signatur der Sperrablage aus M1, wörtlich
gelesen: *„Eine Ebene unter der Registratur liegt, was niemand mehr anfassen
sollte, und zahlt es in Rüstung und Waffe."* Die Untere Registratur hat
kanonisch nichts unter sich — sie **ist** das Untergeschoss des Hauses. Ein
Stockwerk unter Gebührenbescheid 2 wäre ein Stockwerk ohne Weltgrund.

Die Zahl steht deshalb am Satz und nicht am Bescheid, und `stollenAssert()`
rechnet beide Stellen gegeneinander: für jeden Bescheid von 1 bis 5 muss
`KAM_EBENEN[satzVon(diff)] > 1` genau dann gelten, wenn der Bescheid die 5 ist.
Die Schwierigkeitszuordnung steht in `betreteKammer()`, die Ebenenzahl in der
Tabelle, und wer eine von beiden ändert, hört es beim nächsten Start.

### 2. Der Korridorbau musste erst zweimal aufrufbar werden

`betreteKammer()` baute den Korridor als geraden Block: Karte fluten, Räume
setzen, Tore hängen, Module bauen, Wächter streuen, Schatzkammer, Ausgangsrune,
Wandfelsen, Spieler setzen. Das war genau einmal aufrufbar.

Herausgelöst als `baueEbene(k, kinds)`. Die Trennlinie ist die interessante
Arbeit an diesem Umbau, und sie verläuft entlang einer einzigen Frage: **was ist
die Kammer, und was ist nur die Ebene?**

| Bleibt (die Kammer) | Wird neu gebaut (die Ebene) |
|---|---|
| Tür, Schwierigkeit, Tier, Biom, Satz | Räume, Tore, Module, Wächter |
| die Blattschlüssel (`dkGate`, `dkStairs`, …) | Truhe, Ausgangsrune, Startpunkt |
| `ebene`, `ebenen` | `idx`, `geleert`, `abstieg`, Wandfelsen |

`betreteKammer()` tut danach nur noch drei Dinge: die Oberwelt in `owSave`
sichern, das Kammerobjekt bauen, `baueEbene()` rufen. `steigeAb()` ruft dieselbe
Funktion mit einem anderen Modulbudget und sichert nichts — die Oberwelt liegt
schon seit dem Betreten in `owSave` und wird vom Abstieg nicht angefasst. Genau
deshalb trägt die Ausgangsrune unten auch in die Oberwelt zurück und nicht eine
Ebene höher.

### 3. Erst der Vorgang, dann die Neugier

Das Loch im Boden liegt in der Schatzkammer, drei Kacheln neben der Truhe, und
es ist **von Anfang an sichtbar**. Ein Loch im Boden versteckt sich nicht.

Aufnehmen tut es niemanden, solange die Truhe zu ist:

```js
function kannAbsteigen(){
  const k = kammer;
  return !!k && !!k.abstieg && !!k.truhe && k.truhe.auf && k.ebene + 1 < k.ebenen;
}
```

Drei Kacheln neben der Truhe und nicht auf ihr, weil `aktBiete()` den nächsten
Kandidaten nimmt: auf der Truhe hätte das Loch den Ausgang verschluckt, den die
geöffnete Truhe selbst anbietet (das ist seit Phase 2 der bequeme Rückweg aus
der Schatzkammer).

Dieselbe Funktion beantwortet die Frage für das Angebot **und** für die
Ausführung. Eine Kontextaktion, die etwas anderes prüft als das, was sie
auslöst, ist ein Fehler, der sich erst im Spiel zeigt — `ebene-pruef.mjs` prüft
deshalb beides getrennt: dass `kannAbsteigen()` falsch ist, und dass der Spieler,
der leibhaftig auf dem Loch steht, kein „Hinabsteigen" angeboten bekommt.

### 4. Der Lohn unten ist kein Gold, und das ist eine Entscheidung über die Schichtuhr

Die untere Truhe zahlt **null Gold**. Zwei Zutaten mehr als die obere, und eine
Seltenheitsstufe höher.

`KAMMER-MESSUNG-2026-08-20` hat die Kammern als den schnellen Geldkanal
ausgewiesen: rund 1190 Gold je Schicht in die Bank gegen 170 aus der reinen
Oberwelt, Vollausbau in drei statt dreiundzwanzig Schichten. Eine zweite Truhe
mit Goldwurf hätte diese Zahl noch einmal gedrückt, ohne dass jemand das
beschlossen hätte. Der Weg dahin wäre gewesen, an den Preisen zu drehen — also
eine gewachsene Balance für einen neuen Raum umzubauen.

Der Verzicht ist billiger und ehrlicher, und er steht wörtlich in der Signatur:
Rüstung und Waffe, kein Wort von Gold. Wer hinabsteigt, holt Material.

**Und Material heißt in diesem Spiel Zutaten, nicht Ausrüstung.** Phase 1 hat
festgeschrieben: *„Monster droppen keine fertige Ausrüstung mehr, nur noch
Zutaten."* Der Kessel bleibt der einzige Ort, an dem ein Ausrüstungsteil
entsteht. Die Sperrablage zahlt in Rüstung und Waffe, indem ihre Substantive in
den Rüstungs- und Waffen-Slot fallen — nicht, indem unten ein Harnisch in der
Truhe liegt.

Genau das ist jetzt eine Zusicherung statt eines Satzes im Klappentext:
`stollenAssert()` prüft, dass jedes Substantiv der Sperrablage im Slot `armor`
oder `weapon` sitzt und dass **beide** vorkommen. Wer ein viertes Substantiv
dazuhängt und ihm Stiefel gibt, hört es beim nächsten Start.

### 5. Der Fund: die Sperrablage zahlte aus der falschen Kammer

Beim Bau von Abschnitt 4 fiel auf, dass `rollKammerZutat()` den dritten
Parameter gar nicht hatte:

```js
const pool = BIOME_MOBS[biome].concat(KAM_WAECHTER);   // Band plus Untere Registratur
```

`KAM_WAECHTER` ist das Roster der **Unteren Registratur**. Seit M3 teilen sich
die beiden Roster die Staffel, statt sich zu überlagern — Bescheid 1 bis 4 ist
die Registratur, Bescheid 5 ist die Sperrablage —, und M3 hat dafür die Funktion
`kamWaechter(diff)` angelegt. Die Truhe hat diese Teilung nie mitbekommen.

Die Folge, seit M3 und in keinem Bericht:

* In einer Stollen-Kammer fielen **Fledermausflügel** und **Golem-Splitter** aus
  der Truhe — von Gegnern, die in dieser Kammer nicht vorkommen.
* Die drei Substantive der Sperrablage konnten aus ihrer **eigenen** Truhe
  überhaupt nicht fallen.

Berichtigt durch den Parameter, den M3 schon vorbereitet hatte:

```js
function rollKammerZutat(tier, biome, diff){
  const pool = BIOME_MOBS[biome].concat(kamWaechter(diff));   // Band plus das Roster DIESER Kammer
```

Der letzte Eingriff in `ebene-fehlversuch.mjs` stellt genau diesen Stand wieder
her und prüft, dass der Guard ihn meldet. Der Fehler kann nicht zurückkommen,
ohne dass es jemand hört.

### 6. Was unten steht

| | oben | unten |
|---|---|---|
| Räume | Vorraum + 4 Module + Schatzkammer | Vorraum + 1 Modul + Schatzkammer |
| Modulbudget | 8 (aus der Schwierigkeit) | 3, fest |
| Wächter je Rätselraum | `1 + diff>>1` = 3 | `1 + diff>>1 + 2` = 5 |
| Roster | die drei der Sperrablage | dieselben drei |
| Schatzkammer | Alter Schrecken ab Bescheid 5 | Alter Schrecken, aus derselben Regel |

**Der Alte Schrecken steht auch unten**, und das ist keine Nachlässigkeit. Die
Regel lautet „ab Schwierigkeit 5 bewacht er die Schatzkammer", unten steht eine
Schatzkammer, also steht er darin. Er ist ein Sammelvorgang und keine Person;
zwei davon in einer Kammer sind kein Widerspruch, sondern zwei Stapel
Kleinigkeiten. Der Prüflauf prüft deshalb nicht seine Abwesenheit, sondern dass
außer ihm nichts Fremdes dazukommt.

Der Einstieg unten zeigt die **Leiter** statt der Treppe des Satzes: man steht
auf dem, womit man hereingekommen ist. Das ist dieselbe reine Bodendecke, die
der Vorraum oben seit G1 trägt, nur mit einem anderen Blatt.

`Cave_Floor_Ladder.png` ist kein Sprite mit Rand, sondern eine volle
16x16-Bodenkachel: ein Loch im Höhlenboden samt Sprossen, im Braunton von
`Cave_Floor_1`. Deshalb Mittelanker wie die Treppen und Zeichnung mit Faktor 2 —
sie deckt genau ihre Kachel und keinen Pixel mehr. Nachgemessen: die Kachel
liegt bei `TS = 32` auf 32 Bildschirmpixeln, das dunkle Loch nimmt davon rund 25
ein, der Rest ist Boden und verschwindet im Boden.

### 7. Was einmal je Kammer gilt, darf nicht einmal je Ebene laufen

Der Fund, den kein Bild zeigt und jede Auftragszählung merkt. Drei Zeilen in
`truheOeffnen()` gelten der **Kammer** und nicht der Truhe:

```js
if(k.ebene === 0){
  auftragEreignis('kammer', k);   // W4
  k.tuer.cd = Math.max(40, CONFIG.kammerNachwachsen - amt.bonusNachwachsen);
}
```

Dazu Knöterichs erste Truhe (`kn.pending.kammer1`). Ohne diese Klammer wäre aus
jedem Abstieg ein zweiter Kammerabschluss geworden: ein Auftrag „drei Kammern"
hätte sich nach anderthalb Kammern erfüllt, und die Tür wäre zweimal
nachgewachsen. `ebene-pruef.mjs` hängt sich dafür vor `auftragEreignis()` und
zählt die Aufrufe — welches Feld ein Kammerabschluss am Ende hochzählt, hängt am
laufenden Auftrag, der Aufruf selbst ist die Tatsache.

### 8. Kein Zwang

Die zweite Ebene ist ein Angebot und nirgends Bedingung.

* Wer die obere Truhe nimmt und geht, hat die Kammer abgeschlossen (`geleert`),
  gezählt und die Tür nachwachsen lassen — alles genau wie vor M4.
* Der Abstieg ist erst nach der Truhe offen, kann also nichts abkürzen.
* Kein Auftrag, kein Langvorgang, kein Aktenfund und keine Adresszeile hängt an
  der unteren Ebene.
* Der Rückweg ist die Ausgangsrune, die unten genauso im Vorraum steht wie oben.
  Sie trägt in die Oberwelt zurück, nicht eine Ebene höher: ein Stollen hat
  einen Ausgang, und das ist die Tür, durch die man gekommen ist.

---

### Messlauf

`node tools/ebene-messlauf.mjs 40`, vierzig gebaute Kammern bei
Gebührenbescheid 5, beide Ebenen je Kammer gemessen:

| | oben | unten | unten/oben |
|---|---|---|---|
| Räume | 6,0 | 3,0 | 50 % |
| Rätselräume | 4,0 | 1,0 | 25 % |
| Wächter (mit Altem Schrecken) | 14,0 | 6,3 | 45 % |
| Wächter (ohne) | 13,0 | 5,3 | 41 % |
| Lebenssumme der Wächter | 5655 | 2948 | 52 % |
| **Gold aus der Truhe** | **343,4** | **0,0** | **0 %** |
| Zutaten aus der Truhe | 7,0 | 9,0 | 129 % |

**Was das für die Schichtuhr heißt.** Eine Stollen-Kammer mit Abstieg kostet
rund die anderthalbfache Zeit einer ohne (die Lebenssumme der Wächter ist der
ehrlichste Anteil, den man ohne einen spielenden Menschen messen kann; die
Rätselzeit hängt am Menschen und wird hier so wenig behauptet wie in
`KAMMER-MESSUNG`, sie steht als ein Rätselraum in der Tabelle).

Die Türen werden mit `rri(1, 5)` gewürfelt, jede fünfte ist also ein Stollen.
Wer **immer** hinabsteigt, verliert damit rund zehn Prozent seines
Kammerdurchsatzes je Schicht — und weil unten kein Gold liegt, sinkt der
Bankzufluss um denselben Anteil. Die zweite Ebene ist damit ein Tausch, der in
der richtigen Richtung zeigt: mehr Material, weniger Geld, mehr Zeit. Wer
schnell ausbauen will, steigt nicht hinab.

Der Messlauf endet mit Exit-Code 1, sobald die untere Truhe in irgendeinem Lauf
Gold auszahlt. Diese Entscheidung soll nicht still verlorengehen.

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über Playwright.

| Prüfung | Ergebnis |
|---|---|
| `node tools/ebene-pruef.mjs` | **53 von 53** |
| `node tools/ebene-fehlversuch.mjs` | 8 Eingriffe, alle gemeldet, danach jedes Mal wieder grün (17 von 17) |
| `node tools/ebene-messlauf.mjs 40` | Tabelle oben, Goldkanal unverändert |
| `stollenAssert()` beim Start | „eine zweite Ebene an Satz 2, 3 eigene Waechter, Signatur Rüstung und Waffe, Truhe zahlt aus dem eigenen Roster." |
| Guards beim Start | **19** (seit G12 achtzehn), Warnungen und Fehler in der Konsole **0** |
| `python3 tools/monsterkatalog.py` | 28 Gegner, 0 Verletzungen, Katalogdateien unverändert |
| `node tools/build-single.mjs` + `file://` | 170 Dateien eingebettet, 0 „Sprite fehlt", 0 Fehler, Leiter als data:-URI drin |

Regression, alle unverändert grün:

| Werkzeug | |
|---|---|
| `menue-pruef` | 39 von 39 |
| `gespraech-pruef` | 89 von 89 |
| `empfang-pruef` | 59 von 59 |
| `szene-pruef` | 45 von 45 |
| `reich-pruef` | 55 von 55 |
| `langvorgang-pruef` | 57 von 57 |
| `monster-fehlversuch` | alle Regeln greifen |
| `steinbruch-fehlversuch` | 8 Eingriffe, alle gemeldet |

Angesehen wurde es auch, und zwar an der Stelle, die kein Guard beantwortet:
das Loch im Boden der oberen Schatzkammer (mit und ohne Ring), der Einstieg
unten, und der Rätselraum unten mit seinen fünf Wächtern. Die Namen über den
Köpfen lesen sich dort ausschließlich „Der Dienstweg" und „Der Teilbescheid",
und das ist der sichtbare Beleg dafür, dass Abschnitt 5 wirkt.

### Bewusst offen

* **Die Schienen bleiben liegen.** `Rails.png` und `Mine_Cart` sind seit M4
  keine Behauptung mehr — es gibt jetzt eine zweite Ebene, in die eine Lore
  fahren könnte. Gebaut ist sie nicht: eine Lore ist eine Bewegung mit einem
  Weg, und das ist eine eigene Mechanik, kein Blatt. Wer sie baut, baut sie als
  eigenen Bauabschnitt, nicht als Deko im Nachtrag.
* **Die Cave-Wasseranimation liegt weiter ungenutzt.** Wasser im Stollen wäre
  ein Hindernis oder eine Zierde; als Hindernis bräuchte es eine Regel, als
  Zierde wäre es dasselbe Argument wie bei den Buchten in G12 — und dort war die
  Antwort „Ausstattung, kein Vorgang". Die Frage ist nicht entschieden, sie ist
  nur nicht gestellt worden.
* **Es gibt keine dritte Ebene, und die Tabelle lässt auch keine zu.**
  `KAM_EBENEN` ist eine Zahl je Satz; drei Ebenen wären eine 3 an derselben
  Stelle und würden ohne weitere Arbeit funktionieren. Sie stehen nicht im
  Kanon, und `stollenAssert()` würde eine dritte Ebene nicht bemängeln — die
  Prüfung hängt an der Zuordnung Satz/Bescheid, nicht an der Höhe der Zahl. Wer
  sie hochsetzt, hat den Weltgrund zu liefern.
* **Der Abstieg hat keinen eigenen Ton.** `sfx.warp()` ist derselbe Klang wie
  beim Betreten der Kammer. Eine Leiter klingt anders als ein Sprung, aber der
  Klangvorrat ist der aus Phase 6 und bekommt keinen Zuwachs im Vorbeigehen.
* **Die untere Ebene hat keinen eigenen Adjektivpool.** `zutatBiome()` gibt
  weiter `hoehle` zurück, aus demselben Grund, den M3 dafür genannt hat: es ist
  derselbe Untergrund ein Stockwerk tiefer, und eine siebte Gewichtsspalte über
  zwanzig Adjektive wären zwanzig Zahlen ohne Grundlage.
