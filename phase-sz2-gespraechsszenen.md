# Bauabschnitt SZ2: Die drei Gesprächsszenen — ERLEDIGT

Szene 2, 3 und 4 aus `weltgeschichte.md`, Kapitel 8. Dazu drei Dinge an der Maschine, die es dafür braucht, und zwei Funde, die nur der Blick ins Bild geliefert hat.

Zweiter von vier Abschnitten. SZ1 hat die Maschine gebaut, SZ2 ist ihre erste Belastungsprobe: dort gab es genau eine Szene, und die lief vor dem Spiel. Diese drei laufen mittendrin.

---

## 1. Was die Maschine dazubekommt

### `szeneFaellig(figur)` — der Haken an der Figur

Gebaut nach dem Vorbild von `langAnsprechen(key)`: eine reine Nachschlagefunktion über die Tabelle, kein Sonderfall an der Figur.

```js
SZENEN.umlauf = {
  figur: 'umlauf',
  wenn:  () => aktStand() >= 2 && !kn.flags.szeneUmlauf,
  ...
};
```

`gespraechOeffnen(n)` fragt einmal, vor dem Normalweg. Ist eine Szene fällig, öffnet sie statt des Gesprächs. **Ein Einstiegspunkt für alle Figurenszenen**, und die Frage kostet eine Schleife über eine Handvoll Tabelleneinträge.

### `state = 'szene'` — der Weltstopp

Exakt das Muster von `state = 'zustellung'`, das W5 gebaut hat: `update(dt)` steigt bei `state !== 'play'` aus, und `gespraechTick(dt)` läuft **davor** weiter, das Tippwerk bleibt also lebendig. Kein neuer Renderpfad, kein modaler Vorhang, keine zweite Schleife.

`szeneOeffnen()` setzt ihn, wenn die Szene `haeltDieWelt` trägt und der Zustand `'play'` war. `szeneAus()` gibt ihn zurück und setzt dabei `aktSperre`, damit der Tastendruck, der die Szene beendet hat, nicht im selben Moment die nächste Kontextaktion auslöst.

Der Empfang trägt `haeltDieWelt` nicht: er läuft ohnehin, bevor der Spieler den ersten Schritt tut.

### Drei Merker in `kn.flags`

`szeneUmlauf`, `szeneSchublade`, `szeneKnoeterich`. Dieselbe Heimat wie `hatLagerGesehen`: persistiert in `KN_KEY`, übersteht Tod, Schichtende und `startShift()`, und `knAssertCaps()` prüft Merkernamen ohnehin gegen diese Tabelle. Eine Szene, die zweimal läuft, wäre schlimmer als eine, die fehlt.

### Nebenbei: der Tafelstapel wird fertig verallgemeinert

In SZ1 stand im zweiten Knopf fest `empfangUeberspringen()` — ein Rest des Empfangs in einer Funktion, die schon allgemein sein sollte. Er ist jetzt ein Parameter. Das Intro überspringt damit weiter, die vierzig Zwischenbescheide springen mit **demselben** Knopf ans Ende. Ein Knopf, zwei Bedeutungen, keine zweite Zeichenstelle.

Und er steht nur, solange er etwas zu tun hat: auf dem letzten Blatt gibt es nichts mehr zu überspringen, und ein Knopf, der nichts tut, ist schlechter als keiner.

---

## 2. Die drei Szenen

Alle drei tragen `sperre: []` und nicht `AKTE_SPERRE`. Der Anfang darf die späteren Akte nicht vorwegnehmen; **diese Szenen sind die späteren Akte.**

### Szene 2, "Oben ist eine Stadt" — Akt II, bei Kordula Umlauf

Zehn Knoten, gespielt beim ersten Ansprechen von Umlauf.

**Warum an der Figur und nicht am Ort.** Die Weltgeschichte setzt die Szene abends im Gasthaus an. Ein Gasthaus gibt es in `VILLAGE_BUILDINGS` nicht — die Tabelle kennt Amt, zwei Häuser, Markt und Scheune, und Fass steht als Figur auf (24, 38), Umlauf seit W11 auf (26, 42). Die beiden sind Nachbarn. Das Gasthaus bleibt da, wo es immer war: im Text.

**Fass' Einwurf ist der erste Einsatz des Sprecherwechsels aus SZ1.** Zwei Knoten tragen `wer:'fass'`, Porträt und Kopfzeile wechseln mit. Er sagt nicht "ich sage nichts mehr", er sagt *"Ich wische hier nur. Das ist ein alter Fleck."* — dieselbe Aussage in seiner Sprache. Ohne den Wechsel wäre die Szene eine Wand aus Text mit einem Gesicht daneben.

Danach: **Fass bekommt zwei Sonderzeilen**, gehängt an den Merker der Szene und nicht an einen Akt. Sie handeln davon, dass sie da war, und das weiß nur, wer mit ihr geredet hat. Zweiter `zusatz`-Block an derselben Figur, dasselbe Muster wie bei Nörgel seit W-Nörgel.

### Szene 3, "Die zweite Schublade" — Akt III, im Amtspanel

Der Kippunkt des Spiels: bis hierhin sieht das Haus aus wie etwas, das vergessen wurde. Ab hier weiß der Spieler, dass es **gepflegt** wird.

**Warum im Amtspanel.** Die Amtsstube hat kein begehbares Inneres, `VILLAGE_BUILDINGS` kennt nur Fassaden, und Sturz' Schreibtisch existiert im ganzen Projekt ausschließlich als Text. Aber `langGiesskanneBlock()` stellt genau diesen Schreibtisch samt Pflanze bereits ins Panel, mit einer anklickbaren Zeile. Die Schublade hängt daneben, an derselben Stelle, mit demselben Bauteil. **Kein neues Weltobjekt, kein neues Panel.**

**Die vierzig Zwischenbescheide sind ein Blatt mit einem Jahreszähler**, von 972 bis 1011. So steht es in der Quelle, und es ist auch das Richtige: vierzig einzelne Tafeln wären vierzig Klicks, und der Witz ist nicht die Zahl der Klicks, sondern dass es nicht aufhört. Der zweite Knopf heißt hier `ZUM LETZTEN BLATT` und springt ans Ende, sobald man verstanden hat. Das letzte trägt den Namen darunter.

Danach vier Zeilen bei Knöterich, und in der dritten liegt die eigentliche Bombe: *"Einundvierzig. Der erste kam vor ihrer Abreise."*

### Szene 4, "Knöterichs einer Satz" — Akt IV, bei Knöterich

Fällig, sobald `aktStand() >= 4 && vorgangHat(4)`, die Anschrift also vollständig ist.

**Sie hängt als einzige nicht an `gespraechOeffnen()`.** Knöterich steht nicht in `DORF_FIGUREN`: er steht nicht im Dorf, sondern im Haus (`KN_POS`, `drawAlter`), und wird über die Kontextaktion `AKT_NACHFRAGE` angesprochen. Sein Haken sitzt deshalb dort. Die Asymmetrie ist keine Schlamperei, sie ist die Figur, und sie steht hier, damit sie beim nächsten Eingriff niemanden überrascht.

Vier Knoten, dann das Wort *Hintermühl*, dann geht er.

### Der Nachklang auf der Bank

Lott und Pahl bekommen zwei neue `anlass`-Einträge, `umlauf` und `hintermuehl`, mit den Zeilen aus der Quelle. Die vier Zeilen von Szene 4 sind zu zweit und zu zweit auf die beiden verteilt.

**Er läuft ausdrücklich nicht über `knRandnotiz()`.** Das verlangt einen `RANDNOTIZ`-Pool, also eine eigene Notiz Knöterichs, und läuft durch seine Tonstellungs-Gates. Beides ist hier falsch: Knöterich kommentiert Szene 4 nicht, er ist gerade weggegangen, und auf der Stellung "Schweigt" fiele der Nachklang ganz aus. `letzterAnlass` wird stattdessen direkt gesetzt, `npcSprechen()` verbraucht es unverändert, und weil nur Lott und Pahl `anlass`-Tabellen haben, erreicht es auch nur die beiden. Er fällt genau einmal.

**Szene 3 bekommt keinen Nachklang.** Die Weltgeschichte gibt Lott und Pahl dort keinen Einwurf, und einen zu erfinden wäre Füllmaterial an der stillsten Stelle des Spiels.

---

## 3. Zwei Funde, beide im Bild

Kein Guard hat sie gemeldet. Beide stammen aus dem Blick auf einen Bildschirmabzug, und beide sind genau die Klasse Fehler, die eine stille Konsole nicht ausschließt.

### Die Fußnote mischte Zahlsysteme

Auf dem ersten Schubladenblatt stand **"BLATT I VON 40"**.

`ROEMISCH` hat elf Einträge, und die Schreibweise wurde je Zahl entschieden: die 1 fand ihr `I`, die 40 fiel auf die arabische Rückfallregel. Kein Absturz, keine Meldung, und trotzdem eine Fußnote, die aussieht wie ein Fehler.

Die Schreibweise gehört dem **Stapel**, nicht der einzelnen Zahl. `szeneBlattZahl(n, gesamt)` entscheidet jetzt einmal für alle: das Intro ist zu neunt und bleibt römisch, die vierzig Zwischenbescheide zählen arabisch. Das ist auch inhaltlich richtig — eine Urkunde zählt römisch, ein Stapel Zwischenbescheide ist eine Menge.

### Knöterichs Blase blieb während der Szene stehen

Auf dem Abzug der Szene 2 stand an Knöterichs Platz **"KnötAmfsketMansDraKnöterichium"**: zwei Texte an derselben Stelle, keiner davon lesbar.

Die Diagnose lief über eine Messung und nicht über eine Vermutung. Erst der Verdacht, die Schilderliste `npcSchilder` laufe über, weil `update()` steht — nachgemessen: sie ist in jedem Frame leer, sie wird im Zeichenpfad geleert. Dann die richtige Spur:

```
Knoeterich-Blase sichtbar: true | Text: Knöterich. Monstralministerium.
gameT laeuft: 0.7165    gameT danach: 0.7165
```

Der Weltstopp friert `gameT` ein. Eine Sprechblase, die beim Beginn der Szene gerade stand, wäre damit **nie** von selbst ausgegangen — sie lag die ganze Szene lang über Knöterichs Namensschild.

Während einer Szene redet jetzt niemand dazwischen, weder Knöterich noch eine Dorffigur. Eine Bedingung an zwei Zeichenstellen. Nach der Szene läuft die Uhr weiter und die Blase geht von selbst aus, ihre Restzeit ist unberührt.

---

## 4. Abnahme

### Die Guards beim Laden

Konsole still. Die Zeile zählt jetzt vier Szenen:

```
Szenen: 4 eingetragen, 9 Introblätter, 12 Fragen, 27 Knoten, Sperrvermerk und Antwortdeckel in Ordnung.
```

### Der Prüflauf

`tools/szene-pruef.mjs` wächst von 11 auf **32 Prüfungen**. Neu darin, und alles davon im laufenden Dienst gespielt statt auf der Tabelle gerechnet:

* **Fälligkeit** über alle fünf Akte, mit und ohne vollständige Anschrift, mit und ohne gesetzten Merker.
* **Die Schubladenzeile** steht ab Akt III und nur, solange ungespielt.
* **Die vierzig Blätter**: Zahl, Jahreslauf 972 bis 1011, der Name auf dem letzten, und dass die Fußnote in **einem** Zahlsystem zählt.
* **Der Weltstopp**: `state` wird `'szene'` und danach wieder `'play'`.
* **Der Sprecherwechsel** kommt in Szene 2 wirklich vor, gemessen an den Namen in der Kopfzeile.
* **Keine Weltblase während der Szene**, gemessen mitten in der laufenden Szene und nicht danach (der erste Anlauf maß hinterher und war deshalb strukturell immer grün).
* **Der Nachklang** fällt bei Lott, verbraucht sich, und ein zweites Ansprechen von Umlauf ist wieder ein normales Gespräch.

### Die übrigen Läufe

| Lauf | Ergebnis |
|---|---|
| `tools/szene-pruef.mjs` | 32 von 32 |
| `tools/empfang-pruef.mjs` | 59 von 59 |
| `tools/gespraech-pruef.mjs` | 54 von 54 |
| `tools/menue-pruef.mjs` | 39 von 39 |
| `tools/reich-pruef.mjs` | 35 von 35 |

Dazu `node tools/build-single.mjs` und `dist/index.html` per `file://`: Konsole still, alle Guards grün.

### Im Bild

Alle drei Szenen im laufenden Dienst gespielt und angesehen. Beide Funde oben stammen daraus.

---

## 5. Was offen bleibt

* **Das Dorf steht während einer Szene sichtbar hinter der Tafel.** Der Empfang hat dafür die schwarze Bühne; eine Szene mitten im Dienst hat keine, und das ist richtig so — sie findet in der Welt statt und nicht auf einer Bühne. Lesbar ist es, der Overlay dämpft. Wer es dunkler will, hat mit `buehneAn()` das Bauteil schon da.
* **Szene 3 endet im Gespräch mit Knöterich, ohne dass er dafür angesprochen werden muss.** Das ist gewollt (der Fund und seine Folge gehören zusammen), heißt aber, dass er in dieser einen Szene spricht, ohne dass jemand zu ihm gegangen ist.

---

## 6. Was als Nächstes kommt

| Abschnitt | Inhalt |
|---|---|
| **SZ3** | Szenen 5 und 6: der Stopfen im Steinfeld samt Blattserie I und Postregen, Vorblatts Ankunft hinter der Amtstür. Der Stopfen behält seinen Preis: er zieht Vorblatts `abAkt` vor. |
| **SZ4** | Szenen 7, 8 und 9: die Versuchung als Versammlung im Amtsflur, die Zustellung als Ausbau von `vorgangPanel()`, der Abspann als Tafelstapel. Szene 8 und 9 existieren dort bereits in Kurzform. |
