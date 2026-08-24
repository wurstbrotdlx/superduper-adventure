# F1-Nachtrag: Zwei Prüfwerkzeuge, die die Welt von gestern maßen — ERLEDIGT

Der Punkt, den F1 offen gelassen hat und den `phase-lv4-praktikumsbericht.md` als
Nachlauf vermerkt, ohne ihn anzufassen: `tools/szene-pruef.mjs` und
`tools/reich-pruef.mjs` waren rot, und zwar auf `dd209fc` genauso wie auf
`73fd7fd`. An `index.html` ist wieder keine Zeile geändert. Das ist kein
Zufall, sondern der Befund selbst.

## Der Befund

Beide Werkzeuge meldeten zusammen fünfundzwanzig Fehlschläge, und beide hatten
recht damit, dass sich etwas geändert hatte. Nur maßen sie das Falsche.

| Werkzeug | vorher | Fehlschläge | woran |
|---|---|---|---|
| `szene-pruef.mjs` | 32 von 45 | 13 | genau die dreizehn Gesprächsbäume aus F1 |
| `reich-pruef.mjs` | 23 von 35 | 12 | zehn Zuwachs-Figuren und Nörgels zwei Blöcke |

Dass die Zahl der Fehlschläge in beiden Fällen exakt der Zahl der neuen oder
betroffenen Einträge entspricht, war der erste Hinweis: das ist keine kaputte
Mechanik, das ist eine Zusage, die zu eng aufgeschrieben war.

Gegengeprobt wurde vor dem ersten Eingriff, indem `index.html` von `dd209fc`
eingespielt und beide Läufe wiederholt wurden: **dieselben Zahlen, 32 von 45 und
23 von 35.** Langvorgang 4 hat daran nichts verschlimmert, F1 hat nichts
zerbrochen. Die Werkzeuge sind stehengeblieben.

## Fund 1: Pflichtfelder, die nie welche waren

`szene-pruef.mjs` verlangte von jeder Szene vier Felder: `sprecher`, `knoten`,
`ende`, `sperre`. Der Guard im Spiel verlangt zwei. `szeneAssert()` schreibt es
hin:

```js
for(const f of ['sprecher','knoten']) if(typeof d[f] !== (f === 'knoten' ? 'object' : 'function'))
  fehler('Pflichtfeld fehlt oder hat die falsche Form', key, f);
```

`sperre` liest er überall als `(d.sperre || [])`, `ende` nur über den Ausgang
eines Knotens, der keinen mehr hat. Beide sind also optional, und zwar seit SZ1.

Aufgefallen ist das nie, weil bis F1 alle vier Szenen alle vier Felder trugen.
Die Zusage des Werkzeugs beschrieb damit nicht die Regel des Hauses, sondern
den zufälligen Zustand einer Tabelle mit vier Zeilen.

F1s dreizehn Bäume lassen beide Felder weg, und beide Male aus einem Grund, der
sich benennen lässt:

* **Kein `ende`.** Ein Baum endet an jedem seiner Blätter ausdrücklich über
  `szeneEnde(key)`, auch im `hubAusgang`. Er fällt nie durch. Ein `ende:` wäre
  unerreichbarer Code, und ein Werkzeug, das unerreichbaren Code einfordert,
  verlangt das Gegenteil von dem, was es soll.
* **Keine `sperre`.** Ein Baum läuft mitten im Spiel und darf die späteren Akte
  nennen. Denselben Satz schreibt der Kopf des SZ2-Blocks für dessen drei
  Szenen bereits auf: *„Alle drei tragen `sperre:[]` und nicht `AKTE_SPERRE`.
  Der Anfang darf die späteren Akte nicht vorwegnehmen; diese Szenen SIND die
  späteren Akte."*

Geprüft wird jetzt die Regel statt des Zufalls: die zwei Pflichtfelder bei jeder
Szene, die zwei anderen als Paar, das ein `baum:true` weglässt und jede andere
Szene trägt. Damit hat der Lauf mehr Zähne als vorher, nicht weniger: Er meldet
jetzt auch einen Baum, der sich ein `ende` zulegt, und eine gewöhnliche Szene,
der die Sperre abhandenkommt. Beides ist ausgelöst worden, siehe unten.

## Fund 2: Eine Summe, die immer mehr Bauabschnitte mitzählt

`reich-pruef.mjs` maß W11s Zusage — *„die zehn Zuwachs-Blöcke schalten genau in
ihrem Akt frei und keinen Akt früher"* — als Gesamtlänge von `figZusatz()`
gegen `[0, 2]`: vor dem Akt keine Zeile, ab dem Akt zwei.

Das ging so lange gut, wie `abAkt` der einzige Schalter im Spiel war. Heute
trägt jede dieser Figuren sechs bis neun Blöcke, an neun verschiedenen
Schaltern:

```
zwirn   abAkt=2  abSchicht=6  abStufe=6  skill=int  abRang=3  phase=antritt  abAkt=4
noergel merker=hatLagerGesehen  merker=baumBericht  lang=bericht  abAkt=4
        abSchicht=9  abStufe=5  skill=int  abRang=5  phase=antritt  abAkt=2
```

Die Summe misst damit lauter Bauabschnitte, die W11 nichts angehen. Sie ist
außerdem nicht stabil: `abStufe`, `abRang` und `skill` hängen am Spielerstand,
`phase` an der Tageszeit. Das Werkzeug meldete zehn gebrochene Zusagen, von
denen keine gebrochen war.

Gemessen wird jetzt am Schalter statt an der Summe. Für jeden `abAkt`-Block
jeder dieser Figuren gilt: einen Akt vor seinem Akt zu, in seinem Akt auf, und
zwei Zeilen lang. Das ist wörtlich die Zusage aus W11, und sie deckt seither
auch die zweiten `abAkt`-Stufen mit ab, die F1 dazugelegt hat. Der Lauf ist
dadurch von 35 auf 55 Prüfungen gewachsen.

## Fund 3: Nörgel, und warum eine Differenz hier nicht reicht

Nörgels zwei W11-Blöcke hängen am Merker und am Akt, und die Zusage lautet *„sie
stören sich nicht"*. Der erste Versuch, das als Differenz über den Aktwechsel zu
messen, schlug fehl: erwartet zwei Zeilen, gemessen vier.

Der Grund ist nachgemessen und nicht geraten. Zwischen Akt III und Akt IV gehen
bei ihm **zwei** Blöcke auf:

```
Akt3: ... abAkt=4:zu   ... abRang=5:zu  ...
Akt4: ... abAkt=4:AUF  ... abRang=5:AUF ...
```

`amt.schichten` treibt nicht nur den Akt, sondern über die Schichtabrechnung
auch den Rang. Wer den Akt hochdreht, dreht den Rang mit hoch. Eine Differenz
über `amt.schichten` kann deshalb grundsätzlich nicht einen einzelnen Block
isolieren, und das gilt für jede Figur, nicht nur für ihn.

Sein Aktblock steht jetzt in derselben Schalterschleife wie die der anderen. Als
Differenz gemessen wird nur noch der Merker, und der ist dafür sauber: er bewegt
nichts außer sich selbst, während Akt, Rang und Stufe stehenbleiben. Die Zusage
wird zweimal gestellt, in Akt III mit geschlossenem und in Akt IV mit offenem
Aktblock — genau das ist „sie stören sich nicht", und erst so ist es geprüft.

## Abnahme

Alle sieben Läufe grün, `index.html` unverändert:

| Lauf | vorher | nachher |
|---|---|---|
| `szene-pruef.mjs` | 32 von 45 | **45 von 45** |
| `reich-pruef.mjs` | 23 von 35 | **55 von 55** |
| `langvorgang-pruef.mjs` | 57 von 57 | 57 von 57 |
| `gespraech-pruef.mjs` | 89 von 89 | 89 von 89 |
| `menue-pruef.mjs` | 39 von 39 | 39 von 39 |
| `empfang-pruef.mjs` | 59 von 59 | 59 von 59 |
| `monsterkatalog.py` | 0 Verletzungen | 0 Verletzungen |

Live im Browser, beide Ladewege, unverändert zur Baseline: Quellbaum 39
Meldungen, davon 15 Guards, keine Fehler, `frameNo` 152. `dist/index.html` per
`file://` 35 Meldungen, davon 15 Guards, keine Fehler, `frameNo` 154. Die vier
`Sprite fehlt`-Gruppen sind der seit F1 vermerkte Bestand.

Dass sich an der Konsole nichts ändern konnte, ist hier kein Freibrief, sondern
der Punkt: Diese Phase fasst kein Spiel an. Sie repariert die Messgeräte.

## Jede neue Prüfung einmal ausgelöst

Vier Eingriffe, jeder einzeln gesetzt, geprüft und zurückgenommen:

| Eingriff | Erwartung | gemeldet |
|---|---|---|
| `baumPommer` ein `ende:` geben | Baum darf keins tragen | `FEHL baumPommer (Baum): ende ist=true soll=false` |
| `SZENEN.empfang` die `sperre` nehmen | Nicht-Baum muss eine tragen | `FEHL empfang: sperre ist=false soll=true` |
| Zwirns W11-Block auf `abAkt:1` | Block ab Akt 2 fehlt dann | `FEHL zwirn hat einen Zusatzblock ab Akt 2` |
| Nörgels Lagerblock auf drei Zeilen | vier sind zugesagt | `FEHL noergels Lagerblock ... ist=3 soll=4` |

Der dritte Eingriff hat nebenbei die Grenze der Schleife gezeigt: ein Block mit
`abAkt:1` hat kein Davor, und `aktStand()` deckelt bei 5. Beides steht jetzt als
Sonderfall im Code, mit Begründung.

## Was hier nicht gemacht wurde

Die Sollwerte der Werkzeuge sind nachgezogen worden, nicht das Spiel. Das war
die Entscheidung, und sie stützt sich auf drei Dinge: `szeneAssert()` nennt
seine Pflichtfelder selbst, die stille Konsole als Abnahmekriterium des Hauses
war die ganze Zeit still, und beide Werkzeuge meldeten auf `dd209fc` wortgleich
dasselbe. Ein Regress aus F1 hätte an mindestens einer dieser drei Stellen eine
Spur hinterlassen.
