## Anrede der Figuren (18.5) — ERLEDIGT

Nachzug zu Bauabschnitt W6. `superduper-weltbibel.md` 18.5 verlangt, dass der aktuelle Titel an die NPC-Zeilen durchgereicht wird, mit acht namentlich vorgeschriebenen Charakterisierungen. W6 hat das ausdrücklich offen gelassen (`phase-w6-rang.md`, „Grundsatz"), weil dort kein Titel eine Sprechblase erreichte. Diese Phase holt es nach. Kein eigener W-Abschnitt in Kapitel 14, sondern ein eigener Abschnitt hinter W6, mit eigenem Phasendokument und eigenem Guard.

Inhaltslieferung ist die Weltbibel selbst (18.5 Tabelle, 18.6 Stolzregeln, Kapitel 8 für die Sprachmarken der drei Figuren, die 18.5 nicht nennt). Alle unten genannten Bezeichner wurden gegen den Stand nach Commit `45912f6` plus die Änderungen dieser Phase geprüft. Zeilennummern verschieben sich beim Arbeiten, die Bezeichner nicht: **such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.**

### Grundsatz: was diese Phase nicht ist

Kein Umbau von `DORF_FIGUREN`. Die 66 Grundzeilen, 55 Aktzeilen, Bramsches Antworttabelle und der Lott/Pahl-Anlasschor bleiben Byte für Byte, wie W3 sie eingebaut hat; `figuren-dorf.md` bleibt als Textquelle gültig. Die Tabelle bleibt eine reine String-Tabelle, damit `knAssertCaps()` weiter generisch darüberlaufen kann.

Kein Dialogbaum, keine Antwortauswahl, kein Gesprächssystem. Die Anrede ist eine Sprechblase im bestehenden Zyklus, nicht mehr.

Kein Namensfeld für den Spieler. Lisbeth fragt nach dem Namen (18.5), und die Frage bleibt stehen. Kein Eingabefeld, kein `amt`-Feld, keine Auswahl — dass niemand antwortet, ist die Aussage.

Kein neues `amt`-Feld, keine `loadAmt()`-Ladezeile, kein persistenter Merker. Jede Anredezeile ist eine reine Funktion von `amt.schichten`, exakt wie `rangName()` und `aktStand()`. Auch Pommers „Titel vom Antrag" wird nicht gespeichert, sondern als `RAENGE[0]` gelesen.

### Sperrvermerk

Die Phase berührt die Kesselgrammatik an keiner Stelle. Keine der Zeilen nennt Zutat, Slot, Wirkung, Seltenheit, Zutatenzahl oder Auflage; es geht ausschließlich um Titel und Anrede. Der Sperrvermerk (weltbibel:214, :476) ist damit nicht in Reichweite, wird in `anredeAssert()` aber trotzdem nicht geprüft — dort steht nur die Formregel-Prüfung (Gedankenstrich, Emoji, `undefined`), weil eine `GEHEIM`-Liste über Rangtitel reine Zierde wäre.

### Zerlegung von `rangName()` in `rangNameVon(i)`

18.5 braucht die Nachbarstufen: Zwirn schmeichelt einen Rang zu hoch, Milb stuft einen zu niedrig ein. `rangName()` nahm keine Argumente. Statt einer zweiten Rechnung wird die bestehende parametriert und `rangName()` zum Aufruf mit der eigenen Stufe:

```js
function rangNameVon(i){
  const letzt = RAENGE.length - 1, s = Math.max(0, i | 0);
  return s <= letzt ? RAENGE[s].t : RAENGE[letzt].t + ' ' + roemisch(s - letzt + 1);
}
function rangName(){ return rangNameVon(rangStufe()); }
```

Die fünf bestehenden `rangName()`-Aufrufer (Amtsstuben-Fenster, `renderAusweis()`, Urkunde, Dienstbericht, `showDorf()`) bleiben unverändert. Eine Zeile im bestehenden 0..200-Sweep von `rangAssert()` beweist, dass die beiden nie auseinanderdriften:

```js
if(rangNameVon(rangStufe()) !== name) fehler('rangNameVon() driftet von rangName() ab', s, name);
```

### Die Sprossenleiter: `anredeFormen()`, `anredeVersuch()`

Das eigentliche Problem dieser Phase ist kein erzählerisches, sondern ein Zeichendeckel. Der längste benannte Titel ist `Monstralminister ohne Geschäftsbereich` mit 38 Zeichen, `z1` deckelt bei 48, und jenseits Rang 18 hängt `roemisch()` unbegrenzt weiter an. Ein fester Rahmen wie `'Verzeihung, ' + t + '.'` ist mit solchen Titeln nicht baubar.

Statt eines Rahmens gibt es fünf absteigende Fassungen und einen Versuch je Fassung. Das ist wörtlich das Muster des Rekord-Suffixes in `knBegruessungLine()`: bauen, Länge prüfen, sonst zurückfallen.

```js
const ANREDE_HERR = 'Herr oder Frau ';
function anredeFormen(i){
  const s = Math.max(0, i | 0), letzt = RAENGE.length - 1;
  const t = rangNameVon(s);
  const basis = RAENGE[Math.min(s, letzt)].t;
  const ohneKlammer = t.indexOf(' / ') >= 0 || s > letzt;
  const mitKlammer = ohneKlammer ? [] : [ANREDE_HERR + t + '(in)', t + '(in)'];
  return mitKlammer.concat([ANREDE_HERR + t, t, basis]);
}
function anredeVersuch(bau, i, cap){
  for(const f of anredeFormen(i)){ const z = bau(f); if(z.length <= cap) return z; }
  return null;
}
const anredePunkt = (i, cap) => anredeVersuch(t => t + '.', i, cap);
```

Zwei Fälle lassen das `(in)` weg. Der erste steht so in 18.5: die Klammer steht nur dort, wo der Dienstposten das Geschlecht nicht kennt — `Monstralamtmann / Monstralamtfrau` schreibt das Paar bereits aus. Der zweite kam beim Live-Prüfen heraus: jenseits der benannten Ränge hängt eine römische Ziffer hinten dran, und die erste Fassung lieferte `Monstralminister ohne Geschäftsbereich II(in)`. Das ist die Klammer am Zählwerk statt am Substantiv, also falsch. Ab Rang 19 entfällt sie.

`anredeVersuch()` liefert `null` statt einer zu langen Notlösung. Jeder Aufrufer hat seinen eigenen Rückfall, in der Regel `rangDef().t` — der Grundtitel ohne römische Fortsetzung. Er ist kein *falscher* Titel im Sinn von 18.6.2, sondern derselbe Titel ohne Zählziffer, und als einziger nach oben beschränkt.

Daraus folgt die Bauregel für alle Zeilen dieser Phase: **Titel in z1 (48), Sprachmarke in z2 (32).** Kein Titel teilt sich eine Zeile mit mehr als einem Satzzeichen.

### Die elf Formen: `ANREDE`, `anredeZeile()`

Acht stehen wörtlich in 18.5. Trepp, Milb und Fass kommen dort nicht vor, bekommen aber eine, weil Stolzregel 18.6.1 keine Ausnahme kennt („Niemand wird ohne Titel angesprochen"). Ihre z2 ist jeweils die bereits kanonische Sprachmarke aus Kapitel 8 und den W3-Grundzeilen — Trepp entschuldigt sich vorher, Milb schätzt statt zu raten, Fass duzt und schenkt ein. Ableitung, keine neue Charakterisierung. Keiner benutzt den Titel ironisch (18.6.7).

| Figur | z1 | z2 |
|---|---|---|
| Zwirn | Titel eine Stufe höher, mit `!` | „Bald schon. Ganz sicher." |
| Bramsche | Titel, Schriftform | Klammerform vorhanden: „Klammer auf in Klammer zu.", sonst „Genau so steht es geschrieben." |
| Zapf | „Chef." | „Sag Bescheid, wenn was klemmt." |
| Lisbeth | fünf Namensfragen, `amt.schichten % 5` | — |
| Trepp | Titel | „Wenn ich kurz stören darf." |
| Nörgel | Titel | „Ich habe keinen. Nur Krawatte." |
| Milb | Titel | „Geschätzt, nicht geraten." |
| Pommer | `RAENGE[0]`, der Titel vom Antrag | „So steht es auf dem Antrag." |
| Lott | „Der Neue." | „Vierhundert Jahre der Neue." |
| Pahl | „Der Neue." | „Der Name bleibt. Sie wechseln." |
| Fass | Titel | „Setz dich. Der Krug wartet." |

Drei Sonderfälle verdienen eine Begründung.

**Zwirn** liest `rangStufe() + 1`. Am oberen Ende geht die Schmeichelei nicht aus, weil `roemisch()` weiterzählt: aus `… II` wird `… III`. Erst wenn beide Fassungen auf die Grundtitel-Sprosse zurückfallen, legen sie sich zusammen; das passiert jenseits Schicht 200 und ist hingenommen, nicht behoben. `anredeAssert()` prüft die Schmeichelei deshalb nur, solange es über dem Spieler einen benannten Rang gibt.

**Bramsche** liest die Schriftform vor. Hat der Deckel oder die Paarform die Klammer weggenommen, sagt sie stattdessen, dass es genau so geschrieben steht. Sie liest immer, was dasteht, und das ist ebenfalls Charakter, kein Rückfall.

**Pommer** liest `anredeFormen(0)`. Der Antrag ist vom ersten Tag und wurde nie geändert. In den Schichten 0 bis 4 stimmt er zufällig, ab Schicht 5 driftet er und wird mit jeder Beförderung komischer. Kein Merker, keine Persistenz, keine Sonderregel.

### Der Eingriff: `npcCycle()`

Der Eingriff sitzt in `npcCycle()`, nicht in `npcSprechen()`. Damit bleiben die beiden Sonderpfade — Bramsches Frage/Antwort/Abweisung und der Lott/Pahl-Anlasschor — **per Konstruktion** unberührt: sie erreichen `npcCycle()` gar nicht erst, und es braucht keine einzige Abfrage, die sie ausnimmt.

```js
function npcCycle(n, fig){
  n.bubbleIdx = (n.bubbleIdx + 1) % (fig.grund.length + 2);   // +2: Anredezeile und Aktzeile
  if(n.bubbleIdx === 0){
    const a = anredeZeile(fig.key);
    n.bubbleText1 = a.z1; n.bubbleText2 = a.z2;
  } else if(n.bubbleIdx <= fig.grund.length){
    const p = fig.grund[n.bubbleIdx - 1];
    n.bubbleText1 = p.z1; n.bubbleText2 = p.z2;
  } else {
    n.bubbleText1 = fig.akt[aktStand() - 1]; n.bubbleText2 = '';
  }
}
```

`bubbleIdx` startet bei `-1` (Instanziierung in `genMap()`), der erste Tastendruck an einer Figur landet also auf der Anrede. Das ist die richtige Reihenfolge: man wird begrüßt, bevor geredet wird.

### Ein Befund vor dem Bau: `letzterAnlass` wurde nie zurückgesetzt

`knRandnotiz()` setzt `letzterAnlass`, `npcSprechen()` liest es für Lott und Pahl. Zurückgesetzt hat es niemand. Ab der ersten Randnotiz einer Sitzung nahmen die beiden dauerhaft den `fig.anlass`-Pfad; `npcCycle()` erreichte sie nie wieder, und ihre sechs Grundzeilen plus Aktzeile waren tot. Ohne Korrektur wäre auch die Anrede für beide unerreichbar gewesen.

`figuren-dorf.md` beschreibt die Grundzeilen ausdrücklich als das, was gesagt wird, „wenn seit Schichtbeginn nichts Nennenswertes passiert ist" — der Anlass ist als verbrauchbar gemeint. Eine Zeile:

```js
      letzterAnlass = null;   // Der Anlass ist verbraucht, der Chor kehrt in den Zyklus zurück
```

Das ist eine **Verhaltensänderung an W3**, nicht nur eine Vorbereitung: Lott und Pahl kommentieren ein Ereignis jetzt genau einmal und sprechen danach wieder zyklisch. Sie steht hier, weil sie ohne Anrede nie aufgefallen wäre.

### Knöterich: `knBegruessungLine()`

18.5 verlangt von ihm die vollständige, korrekte Anrede inklusive „Herr oder Frau", **jedes Mal**. Sein einziger Begrüßungskanal ist `knBegruessungLine()`, ein Einzeiler im Randnotiz-Band mit Deckel **44**, nicht 48/32. In `HINWEISE` oder `ESCALATE_DEFS` gehört sie nicht: das sind Tastenerklärungen, dort bräche eine Anrede die Regel „höchstens eine Taste, zwei kurze Sätze".

```js
function knBegruessungLine(){
  const n = amt.schichten + 1;
  const st = rangStufe();
  let line = anredeVersuch(t => t + '. ' + knOrdinal(n) + ' Schicht.', st, 44)
             || anredePunkt(st, 44)
             || (knOrdinal(n) + ' Schicht. Die Akte wird dick.');
  /* Rekord-Suffix unverändert */
}
```

Zwei Anläufe statt einem. Der erste nimmt Anrede plus Schichtzähler, der zweite die Anrede allein. Die längste Sprosse ohne Zähler ist 43 Zeichen lang, der zweite Anlauf gelingt also immer — die alte Grundzeile steht nur noch als dritter Boden da und wird nie erreicht. `anredeAssert()` beweist genau das.

### Der Guard: `anredeAssert()`

Selbstaufrufend, Bauform `rangAssert()`/`auftragAssertBrett()`: lokales `ok`, `fehler()`-Closure mit `console.error`, gemeinsamer `text()`-Prüfer, `console.assert()` am Ende, **nie throw**.

1. **Vollständigkeit in beide Richtungen.** Jede Figur aus `DORF_FIGUREN` hat eine Form, und keine Form ist verwaist. Eine neue Dorf-Figur ohne Anrede ist damit ein Konsolenfehler, kein stiller Rückfall.
2. **Deckelsweep** über alle elf Formen und `amt.schichten` 0 bis 5000 in Fünferschritten, also weit in die römische Fortsetzung hinein. Geprüft werden `z1 <= 48`, `z2 <= 32`, leer, `undefined` im Text, Gedankenstrich, Emoji.
3. **Zwirn schmeichelt wirklich** und **Pommer liest den Antrag**, an jeder Stufe des Sweeps.
4. **Knöterichs Begrüßung** gegen 44, über dieselbe Schichtreihe und beide Rekord-Zustände, mit der zusätzlichen Aussage, dass der dritte Boden nie greift.

`amt.schichten` und `kn.counters.maxKillsSchicht` werden gespiegelt und exakt zurückgesetzt, **ohne** `saveAmt()`/`saveKn()` — wörtlich das Idiom aus `rangAssert()`.

> **TDZ, die scharfe Kante dieser Phase.** Der Deckel-Guard des Projekts, `knAssertCaps()`, ruft sich weit oben im Skript selbst auf, lange bevor `RAENGE` und `rangStufe()` deklariert sind. Hätte die Anredeprüfung dort gestanden, wäre sie beim Laden ein `ReferenceError` gewesen, den `node --check` nicht findet. Sie steht deshalb in `anredeAssert()`, unmittelbar hinter dem Rangblock; an `knAssertCaps()` steht nur ein Zeigerkommentar, in der Form des bestehenden Kommentars über das Rekord-Suffix. `knBegruessungLine()` selbst ist unbedenklich: sie läuft ausschließlich aus `startShift()`, also zur Laufzeit.

### Was ausdrücklich nicht angefasst wird

`DORF_FIGUREN` (alle elf Einträge, alle Felder), `figuren-dorf.md`, `npcSprechen()` bis auf die eine Zeile aus Fund A, `HINWEISE`, `ESCALATE_DEFS`, `RANDNOTIZ`, `knAssertCaps()` bis auf den Zeigerkommentar, `drawBubble()`, `INSIGNIEN` und alle Rang-Prädikate, `RAENGE`, `roemisch()`, alle fünf bestehenden `rangName()`-Aufrufstellen, `#ovPanel` (bleibt bei acht Schreibstellen).

### Abnahme

* Alle elf Dorf-Figuren sprechen den Spieler mit Titel an, als erste Blase beim Ansprechen — live geprüft.
* Die sechs Grundzeilen und die Aktzeile jeder Figur kommen unverändert danach, in unveränderter Reihenfolge — live geprüft an Zwirn über einen vollen Zyklus.
* Bramsches Frage/Antwort/Abweisung läuft unverändert und geht danach in den Zyklus über — live geprüft.
* Lott und Pahl kommentieren einen Anlass genau einmal und sprechen danach wieder zyklisch — live geprüft.
* Knöterich grüßt amtlich, in jeder Schicht, auf jedem Rang — über den Guard geprüft.
* Kein Text bricht seinen Deckel, auf keiner Rangstufe bis 5000 — über den Guard geprüft.
* `rangAssert()` und `knAssertCaps()` bleiben grün.

### Bewusst offen für später

* Jenseits von Schicht 200 fallen Zwirns Schmeichelei und der echte Titel auf dieselbe Grundtitel-Sprosse zurück. Behebbar nur mit einer kürzeren Titelform, die es nicht gibt. Notiert, nicht gebaut.
* Auf sehr hohen Rängen verliert Knöterichs Begrüßung den Schichtzähler zugunsten der Anrede. Das ist die vorgeschriebene Reihenfolge (18.5 verlangt die Anrede, den Zähler verlangt niemand), aber es ist ein Verlust.
* Die Anrede reagiert auf keinen Langvorgang. Milbs systematische Fehleinstufung (Kapitel 10 Nr. 7) wäre der naheliegende erste Fall: er könnte eine Stufe zu niedrig ansprechen, bis man ihm den Fehler nachweist. Hier bewusst nicht vorweggenommen.

### Live geprüft

Server auf Port 8378 über das Browser-Pane, `index.html` im Wurzelverzeichnis, nicht `dist/`. Node-Syntaxcheck nach jedem Bauschritt, grün.

* `anredeAssert()`, `rangAssert()`, `knAssertCaps()` liefern in der Konsole alle drei `true`.
* Zwei Deckelbrüche wurden vom Guard gefunden und behoben, nicht vom Auge: Lotts z2 war 33 Zeichen lang (Deckel 32), und die erste Fassung der Sprossenleiter erzeugte jenseits Rang 18 die Klammer hinter der römischen Ziffer.
* Stichproben über `amt.schichten` 0, 30, 40, 90, 95, 200, 5000, jeweils alle elf Formen plus `knBegruessungLine()`, Spiegel danach exakt zurückgesetzt, kein `saveAmt()`. Schicht 40 belegt die Paarform ohne Klammer (`Monstralamtmann / Monstralamtfrau.`, Bramsche fällt korrekt auf „Genau so steht es geschrieben."), Schicht 90 die Klammerform am längsten Titel (43 Zeichen), Schicht 95 die erste römische Fortsetzung, Schicht 200 den Grundtitel-Rückfall bei Knöterich.
* Voller Sprechzyklus an Zwirn: Schritt 0 Anrede, Schritte 1 bis 6 die sechs Grundzeilen in Reihenfolge, Schritt 7 die Aktzeile zum aktuellen Aktstand, danach zurück auf 0.
* Bramsche mit gesetzter Frage: Antwort, dann Abweisung, dann Anrede, dann Grundzeile 1. Beide Sonderzweige unverändert.
* Fund A gegengeprüft: `knRandnotiz('crit')` gesetzt, Lott angesprochen — eine Anlasszeile, `letzterAnlass` danach `null`, die beiden folgenden Tastendrücke liefern Anrede und Grundzeile.
* Lisbeths fünf Varianten über die Schichten 1 bis 6 durchgezählt, sie wechseln je Schicht und wiederholen sich erst nach fünf.
* Sichtprüfung im Canvas: Bramsches Anredeblase steht vollständig im Kasten, kein Überlauf über den Rahmen. `drawBubble()` bricht nicht um, deshalb ist der Guard und nicht das Auge der Beweis — die Sichtprüfung bestätigt nur, dass die gemessene Länge auch der gezeichneten entspricht.
* Die Konsole blieb über alle Prüfungen hinweg leer.
