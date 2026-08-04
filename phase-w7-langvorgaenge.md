## W7: Die Langvorgänge — ERLEDIGT

Bauabschnitt zu `superduper-weltbibel.md` Kapitel 10, „Langvorgänge: neun Nebenstränge über mehrere Schichten". Kapitel 10 kannte keinen eigenen Bauabschnitt; diese Phase ergänzt ihn in Kapitel 14 als W7, hinter W6 und dem Anrede-Nachzug. Inhaltslieferung ist die Weltbibel selbst (Kapitel 10 Tabelle, Kapitel 8 für die Figurenstimmen), die Zeilen drumherum sind diese Phase, geprüft über `langAssert()`.

Zwei der neun Stränge sind nicht Teil dieser Phase: **Nummer 4** (Lisbeths sechster Praktikumsbericht) hat W5 rein textlich über drei Aktzeilen gelöst, **Nummer 8** (die Zustellung) ist der W5-Hauptstrang selbst. Beide bleiben unangetastet. Gebaut werden die restlichen sieben.

Alle Bezeichner wurden gegen den Stand nach Commit `6f77f68` plus die Änderungen dieser Phase geprüft. **Such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.**

### Grundsatz: was diese Phase nicht ist

Kein Questlog. `langBestandBlock()` zeigt nur begonnene Stränge; eine Liste aller sieben wäre eine Aufgabenverwaltung, und die gibt es hier nicht.

Kein Dialogbaum, keine Antwortauswahl, kein Gesprächssystem. Jeder Schritt einer Kette ist „nochmal F drücken". Keine Cutscene, auch nicht für Hintermühl — der stille Moment sind zwei Herren auf einer Bank, die vier Sätze sagen.

Keine neue `AKT_`-Konstante, keine neue Kachel, keine neue Tür, kein neuer Monster-Spawn. Damit ist die `aktBiete()`-Falle (Distanz 0 überstimmt jedes andere Angebot) per Konstruktion ausgeschlossen, sie kommt gar nicht in Reichweite.

Kein neues `amt`-Feld und keine `loadAmt()`-Ladezeile. Kein `apply()` an irgendeinem Strang.

Kein Pflanzen-Sprite, kein Krankheitszustand für Knöterich, kein zweites Frage-und-Antwort-System für Nörgel, keine Heraldik, keine zweite Währung.

### Sperrvermerk

Vier Stränge liegen in der Nähe der Kesselgrammatik und wurden entsprechend geführt. **Die Kaffeemaschine** ist der Risikofall: sie ist laut Kapitel 10 das Schwestergerät des Kessels. Ihre vier Zeilen sprechen ausschließlich über Baugleichheit, Laufbahn und Zuständigkeit, nie über Zutaten, Slots, Wirkungen, Seltenheit oder Stückzahl. Zapfs Kanonsatz „Der Kessel ist kein Kessel. Der Kessel ist ein Kopierer." wird bewusst nicht zitiert, obwohl er zulässig wäre. **Nörgels Hinweise** nennen Fundorte und Zusammenhänge, die im Spiel bereits offen ausgesprochen sind (Kammertüren, Ablage V braucht eine Ausfertigung, Bramsche antwortet einmal je Schicht, das Brett hängt neu). **Der falsche Gutachter** spricht über Einstufung und Schilder, also über den Gebührenbescheid, nicht über den Kessel. **Die Gießkanne** kommt der Sache gar nicht nahe.

`langAssert()` prüft jede Zeile maschinell gegen dieselbe `GEHEIM`-Teilstringliste, die `vorgangAssert()` und `auftragAssertBrett()` verwenden.

### Eine Tabelle, nicht sieben Einzellösungen

Die sieben Stränge sind inhaltlich heterogen: einer ist reine Textarbeit, einer ändert eine Zeichenroutine, einer einen Zähler in `startShift()`. Der **Beweisbedarf** ist bei allen identisch — kein toter Strang, kein Rücksprung, keine Blockade, kein Deckelbruch, inert bei `schichtModus=false`. Genau die Klasse Aussagen, die `auftragAssertBrett()` über neun ebenso heterogene Auftragstypen in rund sechzig Zeilen führt, weil deren Tabelle eine einheitliche Feldform hat. Sieben Einzellösungen ergäben sieben Guard-Zweige, die beim achten Strang verrotten.

```js
const LANGVORGAENGE = {};
LANGVORGAENGE.<key> = {
  figur:  'zapf',                 // DORF_FIGUREN-Key oder 'knoeterich', wem der Strang gehört
  titel:  'Die Kaffeemaschine',   // Kladde-Reiter, Panel-Text, kein Deckel
  stufen: 4,                      // Abschluss bei stufe(roh) === stufen
  hoert:  ['ansprechen','kessel','jahresbonus'],   // Hot-Path-Filter
  wenn:   () => (amt.bonusManaRegen || 0) > 0,     // Auslöser. false = Strang liegt still
  schritt:(was, info, roh) => roh,   // NEUER Rohwert, nie ein kleinerer
  stufe:  roh => roh,                // optional, Default Identität
  fortschritt: st => ({z1, z2}),     // EINE Sprechblase beim Erreichen von st
  zusatz:      st => [],             // optional, zusätzliche Grundzeilen
  bestand:     st => '…',            // optional, Zeile im Kladde-Reiter
};
```

**Kein `apply()`, keine Belohnung mit Nebenwirkung.** Das ist die W5/W6-Doktrin wörtlich: jede Belohnung ist ein abgeleiteter Lesevorgang von `langFertig(key)` an der Stelle, die sie betrifft. Damit ist jedes Neurendern von selbst idempotent, und es gibt genau **eine** Schreibstelle für W7-Zustand.

### `kladde.lang`: eine ganze Zahl je Strang

```js
const kladde = { /* … */ vorgang:{}, lang:{} };
      if(o.lang) kladde.lang = o.lang;   // in loadKladde(), additiv wie fl/vorgang
```

Eine Zeile im Literal, eine im Loader. Ein fehlender Schlüssel liest sich als `0`, alte Spielstände laden ohne Migration. Kein `amt`-Feld — die `loadAmt()`-Whitelist bleibt unberührt.

`kladde.lang[key]` ist der **Rohwert**, `d.stufe(roh)` übersetzt ihn in die Stufe. Das deckt drei Fälle mit einem Feld ab:

| Fall | Rohwert | `stufe()` | Stränge |
|---|---|---|---|
| Stufenzähler | 0..n | Identität | Dorffest, Anlage 3, Gießkanne, Hintermühl |
| Set plus Zähler | untere Bits Set, Bits 8-11 gezeigt | `(roh >> 8) & 15` | Nörgels Probezeit |
| Freischaltung plus Zähler | untere Bits frei, Bits 8-11 gezeigt | `(roh >> 8) & 15` | Kaffeemaschine, Gutachter |

Die Zweiteilung ist kein Selbstzweck. Sie löst ein Problem, das beim Bauen sichtbar wurde: **Beats, die an einem Ereignis statt an einem Tastendruck hängen, wären im Spiel nie zu sehen.** `langAnsprechen()` zeigt eine Zeile nur, wenn der Strang bei genau diesem Tastendruck vorrückt. Ein Schritt, der am Schichtende oder beim Kesselgebrauch passiert, hätte seine Zeile stumm verbraucht. Also trennt der Rohwert, wie weit die Ereignisse freigeschaltet haben, von dem, wie viel die Figur davon schon erzählt hat.

Ein zweites Feld je Strang wäre eine zweite Wahrheitsquelle für denselben Fortschritt gewesen, also die Falle aus Fund F1.

### Der Trichter

Eine Zeile in `auftragEreignis()` deckt alle acht bestehenden Fundstellen ab. Sie steht **vor** den Frühabbrüchen, weil die Langvorgänge nicht am angenommenen Aushang hängen — ein Befund vor dem Bau: `auftragEreignis('schichtende')` feuert nur, wenn ein Aushang läuft, deshalb hängt Nörgels Strang direkt in `endShift()`, nicht dort.

```js
function auftragEreignis(was, info){
  langEreignis(was, info);      // W7: derselbe Trichter, eigener schichtModus-Guard
  if(!CONFIG.schichtModus) return;
  /* … unverändert … */
```

```js
function langEreignis(was, info){
  if(!CONFIG.schichtModus) return;   // Inertheit, Muster serieFrei()
  let dirty = false;
  for(const k in LANGVORGAENGE){
    const d = LANGVORGAENGE[k];
    if(info && info.nur && info.nur !== k) continue;   // gezielter Schritt, s. langAnsprechen()
    if(d.hoert.indexOf(was) < 0) continue;   // Hot Path: killMon() läuft hier durch
    if(!d.wenn()) continue;
    const roh = langRoh(k), alt = d.stufe ? d.stufe(roh) : roh;
    if(alt >= d.stufen) continue;
    const neu = d.schritt(was, info, roh);
    if(neu === roh) continue;
    if((d.stufe ? d.stufe(neu) : neu) < alt) continue;   // Monotonie, nie ein Rücksprung
    kladde.lang[k] = neu; dirty = true;
  }
  if(dirty) saveKladde();
}
```

Kein `CFX.schweigen`-Guard, gleiche Begründung wie bei `findeBlatt()` und `findeAdresszeile()`: Langvorgänge sind Geschichte am Fundort, keine Kesselbeobachtung.

Drei zusätzliche Aufrufstellen, je eine Zeile: `endShift()` (Nörgel), `showJahresgespraech()` hinter `b.apply()` (Kaffeemaschine), `langGiessen()` im Amtsfenster (Gießkanne).

### `langAnsprechen()`: genau ein Schritt je Tastendruck

Der Eingriff sitzt in `npcCycle()`, damit die beiden Sonderpfade aus W3 und W6 — Bramsches Frage/Antwort/Abweisung und der Lott/Pahl-Anlasschor — per Konstruktion unberührt bleiben.

```js
function npcCycle(n, fig){
  const lv = langAnsprechen(fig.key);
  if(lv){ n.bubbleText1 = lv.z1; n.bubbleText2 = lv.z2; return; }   // bubbleIdx bleibt stehen
  const zus   = langZusatz(fig.key);
  const grund = zus.length ? fig.grund.concat(zus) : fig.grund;
  n.bubbleIdx = (n.bubbleIdx + 1) % (grund.length + 2);
  /* … Anrede, Grundzeilen, Aktzeile wie in phase-anrede.md … */
}
```

Der Zeiger bleibt stehen, während ein Strang spricht: die Grundzeilen gehen nicht verloren, sie kommen später. Das Modulo hält ihn auch dann im Bereich, wenn `zus` mitten im Zyklus wächst.

**`langAnsprechen()` filtert bewusst nicht nach `d.figur`.** Eine Kette darf über mehrere Figuren laufen — Anlage 3 geht über Zapf, die Gießkanne über Zapf und Pommer. Wer an einer Stufe dran ist, entscheidet allein das `schritt()` des Strangs über `info.key`. `d.figur` sagt nur, wem der Strang gehört, für `zusatz()` und den Kladde-Reiter.

**Warum `info.nur` existiert.** Zapf berührt drei Stränge (Anlage 3, Gießkanne, Kaffeemaschine). Ohne gezielten Schritt könnten zwei davon auf denselben Tastendruck vorrücken, und eine der beiden Zeilen würde stumm verschluckt. `langAnsprechen()` wählt deshalb einen Strang aus und schickt ihn gezielt durch — geschrieben wird trotzdem nur an einer Stelle. Die Auswahl folgt der Einfügereihenfolge der Tabelle, ist also deterministisch: Zapfs Stränge stehen bei ihm in einer Schlange, sie überholen sich nicht.

### Die sieben Stränge

| Nr. | Strang | Figur | Stufen | Kette | Belohnung |
|---|---|---|---|---|---|
| 3 | Das Dorffest | Zwirn | 11 | ein Anlauf je Schicht | eine Zeile im Abspann |
| 6 | Nörgels Probezeit | Nörgel | 7 | 6 Dienstbemerkungen sammeln, dann vorlegen | fünf Hinweiszeilen |
| 2 | Anlage 3 | Bramsche | 3 | Bramsche, Zapf, Bramsche | zweite Registraturfrage je Schicht |
| 1 | Die Gießkanne | Knöterich | 3 | Zapf, Pommer, Amtsstube | kein Bonus, wärmere Begrüßung |
| 5 | Die Kaffeemaschine | Zapf | 4 | Jahresbonus, Zapf, Kessel, Zapf | Geschichte zum bestehenden Bonus |
| 9 | Hintermühl | Lott und Pahl | 4 | Lott, Pahl, Lott, Pahl | keine |
| 7 | Der falsche Gutachter | Dr. Milb | 5 | Milb, drei Kammern in drei Schichten, Milb | echte Kammerschilder |

Vier Stränge verdienen eine Begründung.

**Nummer 6, der Sammelgegenstand existierte bereits.** `DIENST_BEMERKUNGEN` sind laut Kapitel 8 von Nörgel, eine davon steht in jedem Dienstbericht. Ein neuer Sammelgegenstand wäre überflüssig gewesen. In `endShift()` wird aus einer Zeile eine dreizeilige: der Index wandert in den Trichter, der Text nicht. Die Belohnung ist ausdrücklich **kein** zweites Frage-und-Antwort-System — er braucht keinen Antrag, das ist der Unterschied zu Bramsche und der ganze Witz. Seine fünf Hinweiszeilen laufen als zusätzliche Grundzeilen durch den bestehenden Zyklus.

**Nummer 2 kollidiert nicht mit Bramsches Frage.** Der Strangschritt sitzt in `npcCycle()`, die Frage in `npcSprechen()` davor. Ein Strangschritt verbraucht einen Zyklus-Tastendruck, nie einen Frage-Tastendruck. Aus dem Boolean `bramscheFragePending` ist der Zähler `bramscheFragen` geworden, vier Fundstellen; `startShift()` setzt ihn auf `1 + (langFertig('anlage3') ? 1 : 0)`, also abgeleitet, kein `amt`-Feld. `rangSchluessel()` aus W6 bleibt unverändert die unendliche Ausnahme.

**Nummer 1 hat absichtlich keinen Bonus.** Kapitel 10 sagt das ausdrücklich zweimal. Die einzige Wirkung ist eine wärmere Begrüßung. Sie steht als **eigene Sprosse ganz oben** in `knBegruessungLine()` und wird nicht angehängt — angehängt hätte sie auf keinem einzigen Rang unter den 44er-Deckel gepasst, die Belohnung wäre gebaut und unerreichbar gewesen. `langAssert()` prüft deshalb ausdrücklich, dass sie auf mindestens einem Rang sichtbar ist.

**Nummer 7 ändert als einziger bestehendes Verhalten.** Das Kammerschild ist der Gebührenbescheid, also Milbs Gutachten:

```js
const langKammerWert = t => (!CONFIG.schichtModus || langFertig('gutachter')) ? t.diff : Math.max(1, t.diff - 1);
```

`t.diff` und `t.tier` bleiben unangetastet: Beute, die W4-Kammergarantie und `AUFTRAG_TYPEN.kammer.zaehle()` (die `info.diff` liest) sehen weiter den echten Wert. Milb liegt immer **nach unten** daneben, jede Kammer liefert also mehr als angekündigt und ein Aushang „ab Aufwand N" wird nie schwerer, nur leichter. Der `!CONFIG.schichtModus`-Zweig ist Pflicht: dort ist der Strang nie abschließbar, und das Schild bliebe für immer falsch.

Der Vergleichswert, den die Buchführung braucht, existierte ebenfalls schon: `betreteKammer()` wirft die echte Schwierigkeit beim Betreten als Floater. Der Spieler kann Schild und Floater seit W4 vergleichen, es braucht kein neues UI.

### Blockadefreiheit und Inertheit

Strukturell, nicht geprüft-und-gehofft:

1. Kein Strang schreibt außerhalb von `kladde.lang`. Kein `amt`-Feld, kein `apply()`, kein `saveAmt()`.
2. Kein Strang ist Bedingung in `vorgangZustellbar()`, `serieFrei()`, `vorgangAdressAkt()`, `AUFTRAG_TYPEN[*].wenn` oder `rangZeichnungsbefugt()`. `langAssert()` beweist das positiv.
3. `langAnsprechen()` liefert `null`, sobald kein Strang vorrückt. Eine Figur, deren Stränge stillstehen, verhält sich Byte für Byte wie vor W7.
4. Der einzige Strang mit Außenwirkung (Nummer 7) wirkt auf eine Anzeige und nur in die für den Spieler günstige Richtung.

Bei `CONFIG.schichtModus = false` kehrt `langEreignis()` in Zeile 1 zurück: kein Rohwert wird geschrieben, kein `saveKladde()` läuft, `langFertig()` ist überall falsch, `langAnsprechen()` liefert `null`, `langZusatz()` ein leeres Array, `langBestandBlock()` und `langGiesskanneBlock()` liefern `''`, und `langKammerWert()` gibt den echten Wert zurück.

### Der Guard: `langAssert()`

Selbstaufrufend, Bauform `auftragAssertBrett()`/`vorgangAssert()`. **Ruft niemals `langEreignis()` mit `schichtModus=true` auf** — das würde `saveKladde()` auslösen und den echten Spielstand überschreiben, dieselbe Warnung, die `vorgangAssert()` für `findeAdresszeile()` trägt. Er ruft ausschließlich `d.schritt()` direkt, das ist eine reine Funktion, und schreibt auf einen Spiegel.

1. **Tabellenform.** Pflichtfelder, `stufen >= 1`, `hoert` nicht leer und nur bekannte Ereignisarten, `figur` existiert.
2. **Kein toter Strang.** Jeder wird über eine Ereignisfolge bis `stufen` durchgespielt, mit Schichtwechsel-Simulation je Runde und Rundendeckel. Erreicht einer sein Ziel nicht: „Strang nie abschliessbar, toter Tabelleneintrag" — die Entsprechung zu `auftragAssertBrett()`s totem Typ. Der dabei erreichte Endzustand wird für Punkt 10 gemerkt.
3. **Monotonie und Idempotenz.** Kein `schritt()` senkt die Stufe, und auf dem Endzustand bewegt kein Ereignis den Rohwert mehr.
4. **Blockadefreiheit**, positiv formuliert (siehe oben).
5. **Inertheit** bei `schichtModus=false`.
6. **Milbs Schild** über alle `t.diff` 1 bis 5 und beide Strangzustände: nie über dem echten Wert, nach dem Nachweis genau darauf, Index immer im `RARITY`-Bereich.
7. **Bramsches Fragenrechnung**, beide Strangzustände.
8. **Zeichendeckel, Formregeln, Sperrvermerk** über `fortschritt(st)`, `zusatz(st)` und `bestand(st)` aller Stufen.
9. (in `anredeAssert()`, siehe `phase-anrede.md`) Knöterichs Begrüßung inklusive der Gießkannen-Wärme.
10. **Gerenderte Blöcke**, HTML-gestrippt, in **beiden** Strangzuständen: Abspann, Gießkannen-Block über alle Stufen, Kladde-Bestandsblock. Ein bedingter Absatz, den nur der abgeschlossene Zustand zeigt, wäre sonst nie geprüft.

Alle Spiegel (`kladde.lang`, `kladde.vorgang`, `amt.schichten`, `amt.bonusManaRegen`, `langSchicht`, `CONFIG.schichtModus`) werden exakt zurückgesetzt, **ohne** `saveAmt()`/`saveKladde()`.

### TDZ: zwei Guard-Aufrufe sind gewandert

Der W7-Block steht hinter `auftragAssertBrett()`, weil `langAssert()` Punkt 4 `AUFTRAG_TYPEN` liest. Damit stehen zwei bestehende Guards zu weit oben:

* `vorgangAssert()` rendert `vorgangPanelHtml(3)`, und dessen Abspann liest seit W7 `langFertig('dorffest')`.
* `anredeAssert()` ruft `knBegruessungLine()`, und die liest seit dem Gießkannen-Strang `langFertig('giesskanne')`.

Beide Selbstaufrufe stehen jetzt unten hinter `langAssert();`, die Funktionen selbst sind geblieben; an der Definition steht jeweils der Grund. Gleiche Bauform wie der Umzug von `aktStand()` in W5. **Diesen Fehler hat `node --check` nicht gefunden** — er kam als `ReferenceError` beim Laden, und zwar erst, nachdem die Gießkanne den zweiten Guard mit hineingezogen hatte.

### Was ausdrücklich nicht angefasst wird

`DORF_FIGUREN` (alle elf Einträge, alle Felder), `figuren-dorf.md`, `BLAETTER` und `blaetterAssert()`, `ADRESS_ZEILEN` und der gesamte W5-Vorgangsbestand, `AUFTRAG_TYPEN` und `AUFTRAG_POOLS`, `RAENGE` und die Rang-Prädikate, `wuerfleTuer()` (`t.diff`/`t.tier` bleiben die echten Werte), `betreteKammer()`, `killMon()`, `winGame()`, `loadAmt()` und das `amt`-Literal, `#ovPanel` (bleibt bei acht Schreibstellen).

### Abnahme

* Alle sieben Stränge sind von Anfang bis Ende durchspielbar — live geprüft, jeder einzeln.
* Kein Strang blockiert den Hauptvorgang, keine Blattserie, keinen Auftragstyp — über den Guard geprüft.
* `CONFIG.schichtModus = false` macht W7 vollständig inert, inklusive Kammerschild — über den Guard geprüft.
* Kein Text bricht seinen Deckel, keiner verletzt den Sperrvermerk, keiner enthält Gedankenstrich oder Emoji — über den Guard geprüft.
* Alte Spielstände ohne `kladde.lang` laden fehlerfrei.
* `vorgangAssert()`, `auftragAssertBrett()`, `rangAssert()`, `knAssertCaps()`, `anredeAssert()` bleiben grün.

### Bewusst offen für spätere Bauabschnitte

* **Ein Neuladen mitten in der Schicht** erlaubt bei Dorffest und Gutachter einen zweiten Anlauf, weil `langSchicht` nicht persistiert. Bewusst hingenommen: beide tragen keine mechanische Belohnung, und dieselbe Toleranz gilt seit W3 für Bramsches Frage.
* **Zapfs Stränge stehen in einer Schlange.** Wer die Kaffeemaschine hören will, muss die Gießkanne erst weiterbringen. Das ist deterministisch und nachvollziehbar, aber es ist eine Reihenfolge, die niemand entschieden hat außer der Einfügereihenfolge der Tabelle.
* **Die Gießkannen-Wärme verschwindet auf sehr langen Titeln** (Rang 0 und ab Rang 18), weil sie dort nicht unter den 44er-Deckel passt. Der Guard beweist nur, dass sie irgendwo sichtbar ist.
* **`bestand()` ist ohne Anzeige, solange ein Strang bei Stufe 0 steht.** Wer nie mit Milb spricht, erfährt nie, dass es etwas nachzurechnen gäbe. Das ist gewollt (kein Questlog), aber es ist ein Entdeckungsrisiko.
* **Zapfs Kessel-Pflichtsatz** bleibt weiterhin ungebaut, auch wenn der Kaffeemaschinen-Strang in seine Nähe kommt.

### Live geprüft

Server auf Port 8378 über das Browser-Pane, `index.html` im Wurzelverzeichnis, nie `dist/`. Node-Syntaxcheck nach jedem Bauschritt, durchgehend grün.

* Alle sechs Guards liefern `true`, die abgefangene `console.error`-Liste ist leer.
* **Fünf Fehler hat der Guard gefunden, nicht das Auge:** eine Zusatzzeile mit 33 Zeichen (Deckel 32), ein `schritt()`, das auf dem Endzustand von Anlage 3 nicht idempotent war (behoben, indem die Kaskade eine Tabelle wurde, deren Index über der letzten Stufe `undefined` liefert), ein Guard-Punkt 10, der Strängen mit eigener `stufe()`-Abbildung einen falschen Rohwert unterschob, sowie die beiden TDZ-Umzüge oben.
* **Ein Fehler kam aus dem Durchspielen:** die Gießkannen-Wärme passte als Suffix auf keinem Rang unter den Deckel. Sie ist jetzt eine eigene Sprosse, und der Guard prüft ihre Sichtbarkeit.
* Jeder Strang einzeln durchgespielt, mit `localStorage`-Snapshot vor und exakter Wiederherstellung danach: Dorffest elf Anläufe über elf Schichten (der zweite Druck in derselben Schicht fällt korrekt in den Zyklus zurück, der zwölfte liefert wieder eine Grundzeile), Probezeit sechs Bemerkungen und sieben Vorlagen, Anlage 3 die Dreierkette über zwei Figuren, Gießkanne über Zapf, Pommer und den Amtsfenster-Link, Kaffeemaschine über Jahresbonus, zwei Zapf-Beats, Kesselgebrauch und zwei weitere Beats, Hintermühl die Viererkette über Lott und Pahl, Gutachter über fünf Beats und drei Kammern in drei getrennten Schichten.
* Kammerschild gegengeprüft: bei `t.diff = 4` zeigt es offen `3`, nach dem Nachweis `4`.
* Bramsches Fragenzahl: 1 ohne, 2 mit abgeschlossener Anlage 3.
* Knöterichs Begrüßung mit und ohne Gießkanne über die Ränge 0, 30, 45, 90 verglichen — die Wärme erscheint auf 30 und 45, auf 0 und 90 ist der Titel zu lang.
* Sichtprüfung: der Kladde-Reiter zeigt „LAUFENDE VORGÄNGE" zwischen dem W5-Anschriftenblock und der Blätter-Zählzeile, mit abgeschlossenen Strängen in Grün und laufenden in Sandfarbe.
* **Ein Testfehler, offen dokumentiert:** ein früher Durchlauf hat über `npcSprechen()` echten Fortschritt in den laufenden Spielstand geschrieben (`{"anlage3":3}`), weil `langEreignis()` dabei `saveKladde()` auslöst. Der Eintrag wurde entfernt und alle folgenden Prüfungen liefen mit `localStorage`-Snapshot. Wer hier weiterarbeitet: Funktionen, die über `npcSprechen()` laufen, sind keine reinen Prüfungen.
* Die Konsole blieb über alle Prüfungen hinweg leer.
