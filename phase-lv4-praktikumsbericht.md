# Langvorgang 4: Der sechste Praktikumsbericht — ERLEDIGT

Bauabschnitt zu `superduper-weltbibel.md` Kapitel 10, Nummer 4. Der achte Strang in
`LANGVORGAENGE` und der erste, der nach W7 dazukommt. Inhaltslieferung sind Kapitel 8
(Lisbeth, Nörgel, Zwirn, Bramsche, Vorblatt) und Kapitel 9, Akt V, viertes Puzzleteil; die
Bauform ist unverändert die aus `phase-w7-langvorgaenge.md`.

Lisbeth braucht eine weisungsbefugte Unterschrift. Es gibt keine. Am Ende unterschreibt
Nörgel, weil er im Dienst ist.

**Was der Abschnitt gebracht hat, in Zahlen:** ein Strang mit acht Beats an fünf Figuren,
zwei Zusatzzeilen bei Lisbeth, zwei bei Nörgel, ein neunter Zusatzschalter, eine zweite
Fassung des vierten Finale-Puzzleteils, drei neue Prüfungen in `langAssert()` und ein neues
Prüfwerkzeug mit 57 Feststellungen. Kein neues System, kein `amt`-Feld, kein `apply()`,
keine neue Kachel, kein neuer Merker im Spielstand.

Alle Bezeichner sind gegen den Stand nach `dd209fc` plus die Änderungen dieser Phase
geprüft. **Such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.**

---

## Die eine Ausnahme, und wie sie gebaut ist

Kapitel 10 sagt über diesen Strang zwei Dinge, die sich auf den ersten Blick widersprechen:

> Schafft den **Präzedenzfall**, dass ein Monster wirksam unterschreiben kann. Ohne diesen
> Fall funktioniert Akt V nicht.

und, drei Absätze später:

> Kein Langvorgang darf für den Hauptvorgang notwendig sein, mit genau einer Ausnahme:
> Nummer 4, und die ist so gebaut, dass sie nebenbei mitläuft.

Beides gilt, und die Auflösung ist die Unterscheidung zwischen **erzählerisch notwendig**
und **mechanisch Bedingung**. Der Strang ist an keiner Stelle Bedingung:
`vorgangZustellbar()` liest ihn nicht, keine Blattserie und kein Auftragstyp hängt an ihm,
das Finale wird nie verweigert. `langAssert()` Punkt (4) beweist das weiterhin positiv, und
`tools/langvorgang-pruef.mjs` stellt es zusätzlich gezielt für diesen Strang fest. Wer nie
mit Lisbeth redet, spielt das Spiel bis zum Ende durch.

Was er ändert, ist **ein Absatz im Finale**. `VORGANG_PUZZLE` kennt seit W5 die Felder
`frei`, `text` und `sonst`, und das vierte Teil hatte bis hierher `frei: () => true` und
keine `sonst`-Fassung. Jetzt hat es beide:

* **ohne** Präzedenzfall genau den Wortlaut aus Kapitel 9, Wort für Wort wie seit W5,
* **mit** Präzedenzfall denselben Wortlaut plus zwei Sätze, die den Fall nennen.

Die Richtung ist Absicht und nicht Geschmack: der Kanon steht in der `sonst`-Fassung. Ein
fehlender Strang nimmt damit nichts weg, ein vorhandener gibt etwas dazu. Umgekehrt wäre der
Regelfall der ärmere Text gewesen, und das ist bei einem Strang, den ein Spieler verpassen
darf, die falsche Reihenfolge.

**Und „nebenbei" ist wörtlich gebaut.** Acht Beats an fünf Figuren, die im Dorf ohnehin
stehen und ohnehin angesprochen werden. Kein Ort, kein Gegenstand, keine Taste, kein Umweg,
kein Panel. Der Strang hat nicht einen einzigen Schritt, der etwas verlangt, was ein Spieler
nicht sowieso tut.

---

## Die Kette

`BERICHT_DRAN` ist eine Tabelle über dem Rohwert, dieselbe Bauform wie `ANLAGE3_DRAN` und
`HINTERMUEHL_DRAN`, und aus demselben Grund: über der letzten Stufe liefert sie `undefined`,
damit ist `schritt()` auf dem Endzustand von selbst idempotent.

| Stufe | Figur | Was passiert |
|---|---|---|
| 1 | Lisbeth | Der sechste Bericht ist fertig. Es fehlt eine Unterschrift. |
| 2 | Zwirn | Er will sofort. Er ist gar nicht ihr Vorgesetzter, und diesmal zählt das. |
| 3 | Bramsche | Sie gibt die Regel heraus und wendet sie nicht an: weisungsbefugt ist, wer im Dienst steht. |
| 4 | Vorblatt | „Das prüfen wir gern." Die Sackgasse, und sie ist höflich. |
| 5 | Lisbeth | Der Amtsrat hat auf sein Schild gezeigt. `a. D.` Und sonst nichts. |
| 6 | Lisbeth | Wer im Dienst steht, ist befugt. Wer steht hier im Dienst? |
| 7 | Nörgel | Auf Probe ist im Dienst. Er zeichnet. Beschwerde folgt. |
| 8 | Lisbeth | Gezeichnet. Von einer Grünhaut. Wirksam. |

Jeder Beat nennt oder zeigt, wer als Nächster dran ist, weil es kein Questlog gibt und die
`bestand()`-Zeile im Reiter nur zählt. Nur Vorblatt zeigt auf niemanden, und das ist seine
Rolle: er ist die Stelle, an der die Suche nach oben aufhört.

**Zwei Beats bei derselben Figur hintereinander** (Stufe 5 und 6) sind Absicht.
`langAnsprechen()` rückt je Tastendruck genau einen Schritt vor, das sind also zwei
Sprechblasen bei Lisbeth: die erste bringt den Befund, die zweite die Frage. Die Frage wird
nicht durch eine Antwortzeile beantwortet, sondern durch Hingehen.

---

## Die vier Entscheidungen

### 1. Knöterich ist nicht in der Kette, obwohl er die Begründung wäre

Hinter seinem Titel steht `a. D.`, seine Entpflichtung ist nie bearbeitet worden, er ist
also im Dienst. Das ist wörtlich dieselbe Begründung, mit der Nörgel zeichnet und mit der
Sturz in Akt V gegenzeichnet. Er steht trotzdem nicht in `BERICHT_DRAN`, aus zwei Gründen,
und beide sind derselbe Grund:

* **Er erklärt Tasten, nie Zusammenhänge.** Ein Beat, in dem er diesen Zusammenhang
  ausspricht, wäre die Regel gebrochen, die laut Kapitel 8 seine tiefste Eigenschaft ist.
* **Er erreicht `npcCycle()` gar nicht.** Dort sitzt `langAnsprechen()`. Seine Tafel ist
  U6 und läuft über einen eigenen Pfad, `LANG_PROBEN.ansprechen` kennt ihn deshalb auch
  nicht. Das ist kein Versehen von W7, sondern derselbe Befund: der Strang „Die Gießkanne"
  gehört ihm und läuft über Zapf und Pommer, weil er selbst keinen Schritt auslösen kann.

**Stattdessen berichtet Lisbeth**, was er getan hat: er hat auf sein Schild gezeigt und
nichts weiter gesagt. Das ist nicht der Notausgang, das ist die bessere Zeile. Sie ist die
Figur, die Dinge bemerkt, die niemand bemerkt (Kapitel 8, Zuwachs W11: sie hat als Einzige
gemerkt, dass Fürst Nachtrag einen Titel hat), und er ist in einer Geste genauer
beschrieben als in jedem Satz, den er selbst sprechen dürfte.

Wer den Bogen sehen will, sieht ihn dreimal mit derselben Begründung: Knöterich lehnt sie ab,
Nörgel benutzt sie, Sturz schließt mit ihr den Vorgang 1. Ausgesprochen wird sie von keinem
der beiden, die sie am eigenen Titel tragen.

### 2. Der Strang steht ganz vorn in der Tabelle

`langAnsprechen()` geht `LANGVORGAENGE` in Einfügereihenfolge durch und liefert den ersten
Strang, der bei diesem Tastendruck vorrückt. Zwirn trägt sonst elf Dorffest-Anläufe vor
diesem hier, Bramsche drei Beats von Anlage 3. Das wäre dieselbe Schlange, die W7 für Zapf
schon offen vermerkt hat, nur an dem einen Strang, den das Haus für Akt V braucht.

Der Preis ist gemessen und klein: je genau ein zusätzlicher Tastendruck bei Zwirn und bei
Bramsche, einmal im Spiel. Der Gewinn ist, dass der Strang, der nebenbei mitlaufen soll,
nicht hinter zwei anderen wartet.

### 3. Nörgels Zeilen hängen am Strang, nicht an einem Merker

Nach der Unterschrift stehen zwei Zeilen bei Nörgel. Der naheliegende Weg wäre ein
`kn.flags`-Merker gewesen, wie ihn W-Nörgel und die drei Gesprächsbäume aus F1 benutzen.
Das wäre falsch: W7 hat **genau eine Schreibstelle** für Strangzustand, `langEreignis()`,
und jede Belohnung ist ein abgeleiteter Lesevorgang von `langFertig(key)`. Ein Merker daneben
wäre eine zweite Wahrheitsquelle für denselben Fortschritt, also genau die Falle, die W7 als
Fund F1 notiert hat.

Also der **neunte Zusatzschalter**, `ZUSATZ_SCHALTER.lang`, in der Bauform aus F1b:

```js
lang: {frei: w => langFertig(w),
       pruef: w => (typeof w === 'string' && w) ? null : 'nennt keinen Langvorgang: ' + w},
```

Er ist nicht für diesen Abschnitt gebaut, sondern von jetzt an für jeden: ein Strang kann
Zeilen bei jeder Figur öffnen, ohne dass jemand einen Merker anlegt.

**`pruef` prüft dabei nur die Form, und das ist eine Auflage und keine Nachlässigkeit.**
`LANGVORGAENGE` steht rund 6000 Zeilen weiter unten, `knAssertCaps()` läuft auf
Skriptebene, ein Zugriff von dort liefe in die Temporal Dead Zone. Genau dieser Fehler ist
F1-Fund 2, und genau dafür sind in W7 zwei Guard-Selbstaufrufe nach unten gewandert. Die
andere Hälfte der Prüfung, dass der Schlüssel wirklich einen Strang trifft, ist deshalb
`langAssert()` Punkt (11) geworden. Der läuft hinter der Tabelle, und beide Hälften melden
einzeln (siehe Prüfprotokoll).

### 4. Kein Bonus, und diesmal sagt Kapitel 10 es nicht ausdrücklich

Bei der Gießkanne steht „absichtlich kein Bonus" zweimal im Text. Hier steht es nicht, und
der Strang hat trotzdem keinen: die Belohnung ist der Fall. Kein Gold, keine Erfahrung, kein
Ausbau, keine zusätzliche Frage, kein Zähler. Was dazukommt, sind vier Zeilen und ein Absatz
im Finale.

Der siebte Bericht fängt am Ende trotzdem an. Das ist die Pointe und nicht ein Versehen: sie
hat eine Unterschrift bekommen und keine Stelle. Ihr Recht bekommt sie in Akt V.

---

## Zwei Funde, die nur das Laufenlassen gefunden hat

### Fund 1: `langAnsprechen()` fragt nicht, ob die Figur überhaupt im Dorf steht

Der erste Prüflauf meldete: **in Akt II lief die Kette glatt bis Stufe 8 durch.** Sie sollte
an Stufe 3 anhalten, weil Vorblatt erst ab Akt III im Dorf steht (`DORF_FIGUREN`, `abAkt:3`).

Der Grund ist eine Zuständigkeitslücke und kein Tippfehler. `langAnsprechen()` prüft
`langLaeuft()` und übergibt `info.key` an `schritt()`; ob es diese Figur gerade gibt, prüft
niemand. Im laufenden Spiel fällt das nicht auf, weil `npcCycle()` für eine Figur ohne
Kachel nie gerufen wird, die Welt hält die Reihenfolge also von selbst ein. Bis W7 war das
auch folgenlos: **keiner der sieben bestehenden Stränge läuft über eine Figur mit `abAkt`.**
Dieser ist der erste.

Der Strang verlässt sich jetzt nicht mehr darauf. `schritt()` liest `figDa()`, dieselbe
Prüfung, die `DORF_FIGUREN.abAkt` ohnehin trägt, also kein zweiter Wert und keine zweite
Schwelle. Danach hält die Kette in Akt II an Stufe 3 und läuft ab Akt III durch, beides
gemessen.

Wer hier weiterbaut: `langAnsprechen()` selbst ist unangetastet geblieben. Ein Gate dort
wäre die allgemeinere Lösung und hätte alle sieben bestehenden Stränge angefasst, um an
keinem von ihnen etwas zu ändern. Es steht als offener Punkt unten.

### Fund 2: Die Abkürzungsprüfung hat die Langvorgänge nie gesehen

`knAssertCaps()` prüft seit F1b jede Sprechblase gegen `ABKUERZUNGEN`: ein Kürzel im Text
muss dort einen Eintrag mit Langform und Auflösestelle haben. Es läuft über `DORF_FIGUREN`,
`KN_FIGUR`, die Zettelkanäle und die Anlässe. **Die Langvorgang-Beats waren die einzigen
Sprechblasen des Spiels ohne diese Prüfung**, und dieser Abschnitt setzt mit `a. D.` in
Stufe 5 als erster ein Kürzel in einen Beat. Aufgefallen ist es beim Gegenzählen von Hand,
nicht durch eine Meldung, und das ist genau die Klasse Loch, die keiner meldet.

`langAssert()` hat jetzt einen `abk()`-Helfer mit denselben zwei Mustern und derselben
Tabelle, gefahren über `titel`, `fortschritt`, `zusatz` und `bestand` aller Stränge.

**Und beim ersten Lauf hat er zweimal gemeldet, wo nichts war:** `DAS` aus „DAS FINALE" und
`NEUEN` aus „NEUEN VORGANG ANLEGEN". Der Grund war die Einbaustelle. `text()` in
`langAssert()` läuft auch über **gestrippte Panel-Blöcke**, und die tragen Überschriften und
Knopfbeschriftungen in Versalien. Genau dieser Fall steht in `ABK_AUSNAHME` begründet, und
`knAssertCaps()` hatte ihn nie, weil es Tabellenzeilen prüft und kein gerendertes HTML. Die
Prüfung ist deshalb ein eigener Helfer und steht nicht in `text()`: geprüft wird die Tabelle,
nicht die Anzeige.

---

## Der Guard: drei Punkte mehr

`langAssert()` behält seine Bauform und bekommt drei Zusätze. Die bestehenden zehn Punkte
sind unverändert und decken den neuen Strang von selbst mit ab, weil sie über die Tabelle
laufen und nicht über Namen: Tabellenform, kein toter Strang, Monotonie und Idempotenz,
Blockadefreiheit, Inertheit, Zeichendeckel, Formregeln, Sperrvermerk.

* **`abk()` über die Tabelle**, siehe Fund 2.
* **Punkt (10) rendert jetzt auch `vorgangPanelHtml(2)`**, das Finale, in beiden
  Strangzuständen. Das ist die Stelle, für die Punkt (10) da ist: „ein bedingter Absatz, den
  nur der abgeschlossene Zustand zeigt, wäre sonst nie geprüft", und das vierte Puzzleteil
  ist seit diesem Abschnitt ein solcher Absatz. `vorgangAssert()` rendert Schritt 2 zwar
  ebenfalls zweimal, aber beide Male mit dem **echten** `kladde.lang` des Spielers, also mit
  ziemlicher Sicherheit zweimal derselben Fassung.
* **Punkt (11)**: jeder `lang`-Schalter in `DORF_FIGUREN` nennt einen Strang, den es gibt.
  Die Hälfte, die `ZUSATZ_SCHALTER.lang.pruef` nicht leisten kann, siehe Entscheidung 3.

Die Zahl der selbstaufrufenden Guards bleibt bei siebzehn. Es ist kein Guard dazugekommen,
sondern drei Prüfungen in einem bestehenden.

---

## Was ausdrücklich nicht angefasst wird

`langEreignis()`, `langAnsprechen()`, `langZusatz()`, `langBestandBlock()`, `langKammerWert()`
und die sieben Stränge aus W7 (alle Felder, alle Zeilen). `kladde.lang` bleibt eine ganze
Zahl je Strang, `loadKladde()` bleibt unverändert, alte Spielstände laden ohne Migration.
`kn.flags` bekommt keinen Eintrag. `DORF_FIGUREN` bekommt genau einen Zusatzblock bei Nörgel
und keine geänderte Zeile. `VORGANG_PUZZLE` behält vier Teile, `vorgangZustellbar()`,
`vorgangVertagt()`, `vorgangAdressAkt()` und `rangZeichnungsbefugt()` bleiben Wort für Wort
stehen. Der Abspann bleibt unberührt.

---

## Prüfprotokoll

**Baseline vor dem ersten Eingriff**, gegen `dd209fc` mit danebengelegtem Grafikpaket:
15 Konsolenmeldungen, alle „in Ordnung", `frameNo` 154. Dazu vier `Sprite fehlt`-Gruppen
(`Lumberjack_Shirt_1_Green`, `Farmer_Hat_1`, die zwei Plate-Helme), die seit F1 als Bestand
vermerkt sind: die Dateien liegen nicht im Paket. Gewartet wird auf `frameNo > 0`, nicht auf
`assetsReady`.

**Nach jedem Block** gelaufen: Skript aus `index.html` schneiden, `node --check`, Server,
Browser, Konsole lesen.

| Messung | Ergebnis |
|---|---|
| `node --check` | fehlerfrei nach jedem Block |
| Konsole am Ende | 15 Meldungen, dieselben wie in der Baseline, keine zusätzliche |
| `frameNo` | 152 bis 154 in jedem Lauf |
| `tools/langvorgang-pruef.mjs` | 57 von 57 |
| `tools/gespraech-pruef.mjs` | grün |
| `tools/empfang-pruef.mjs` | grün |
| `tools/menue-pruef.mjs` | grün |
| `dist/index.html` per `file://` | 15 Meldungen, keine Fehler, `frameNo` 154 |

**Zwei Werkzeuge sind rot, und zwar auch ohne diese Phase.** `tools/szene-pruef.mjs`
(`baumNieselbeck: ende` und `sperre` falsch) und `tools/reich-pruef.mjs` (`zwirn
Zusatzzeilen erst ab Akt 2`, ist `[0,4]` statt `[0,2]`) melden auf `dd209fc` **wortgleich
dasselbe**, mit gestashter `index.html` gegengeprüft. Das ist F1-Nachlauf: F1 hat den Bäumen
eine andere Tabellenform gegeben und Zwirn weitere Zusatzblöcke, die beiden Werkzeuge sind
darauf nicht nachgezogen worden. Kein Befund dieser Phase und hier nicht behoben, weil das
Nachziehen eine Entscheidung über F1s Sollwerte verlangt und nicht über diesen Strang.

**Die drei neuen Prüfungen sind einzeln ausgelöst worden**, jede mit einer Verletzung, die
danach zurückgenommen wurde. Wortlaut aus der Konsole:

```
W7 Langvorgang: Abkürzung ohne Eintrag in ABKUERZUNGEN fortschritt z1 bericht st=1 PRB Der PRB ist fertig.
W7 Langvorgang: Figur nennt einen Langvorgang, den es nicht gibt noergel berichtt
Knöterich: Figur noergel nennt keinen Langvorgang: 7
W7 Langvorgang: Gedankenstrich Finale fertig
```

Die dritte Zeile ist die Formhälfte aus `knAssertCaps()`, die zweite die Existenzhälfte aus
`langAssert()`; beide sind mit demselben Eingriff (`lang:7`) gefallen und melden getrennt,
also ist die Aufteilung aus Entscheidung 3 belegt und nicht nur behauptet.

**Die vierte Zeile hat einen Fehler im Guard selbst gefunden.** Sie hieß beim ersten Lauf
`Gedankenstrich undefined`: die neue Zeile in Punkt (10) hatte das Feldetikett in den
`cap`-Parameter von `text(txt, cap, feld)` bekommen, drei Argumente sind zwei gewesen. Ein
Zeichendeckel-Fehler wäre dadurch nicht falsch gemeldet worden (`txt.length > 'Finale leer'`
ist `false`), aber der Fund hätte nicht gesagt, wo er liegt. Behoben, und die Meldung nennt
jetzt `Finale fertig`, also ausgerechnet den Zustand, den nur der abgeschlossene Strang
zeigt. Danach Konsole wieder still.

**Der Strang ist in der Welt durchgespielt**, mit der Taste und nicht über die Konsole:
Kontextaktion `Ansprechen`, `F` öffnet die Tafel, Antwort 1 redet weiter, und das achtmal
in der Reihenfolge der Kette.

```
Beat  1 @lisbeth   stufe=1  "Der sechste Bericht ist fertig. Es fehlt nur eine Unterschrift."
Beat  2 @zwirn     stufe=2  "Unterschreiben? Da bin ich sofort dran. Ich bin nicht Ihr Vorgesetzter."
Beat  3 @bramsche  stufe=3  "Weisungsbefugt ist, wer im Dienst steht. Nicht ich. Fragen Sie Oben."
Beat  4 @vorblatt  stufe=4  "Eine Unterschrift für die Praktikantin. Das prüfen wir gern."
Beat  5 @lisbeth   stufe=5  "Der Amtsrat hat auf sein Schild gezeigt. a. D. Und sonst nichts."
Beat  6 @lisbeth   stufe=6  "Wer im Dienst steht, ist befugt. Wer steht hier im Dienst?"
Beat  7 @noergel   stufe=7  "Auf Probe ist im Dienst. So steht es da. Ich zeichne. Beschwerde folgt."
Beat  8 @lisbeth   stufe=8  "Gezeichnet. Von einer Grünhaut. Wirksam. Ich habe nachgesehen."
```

Dabei nachgemessen: der Zeiger auf die Grundzeilen bleibt stehen, während ein Beat spricht
(`bubbleIdx` unverändert), der nächste Druck fällt in den Kreislauf zurück, und bei Bramsche
verbraucht der Strang keinen Frage-Tastendruck, sondern kommt nach ihrer Frage der Schicht
(drei Antworten statt einer, wie W7 es für Anlage 3 zugesagt hat).

**Sichtprüfung** an vier Bildern: Lisbeths erster Beat und Nörgels Unterschrift in der
Gesprächstafel mit Porträt und Amtsbezeichnung, der Reiter `Akten` im laufenden und im
abgeschlossenen Zustand, das Finale in beiden Fassungen.

```
laufend: LAUFENDE VORGÄNGE | Der sechste Praktikumsbericht: es fehlt eine Unterschrift. 4 von 8.
fertig:  LAUFENDE VORGÄNGE | Der sechste Praktikumsbericht: gezeichnet. Der Fall ist aktenkundig.
```

**Ein Umweg beim Prüfen, für das Protokoll.** Die erste Fassung des Weltlaufs drückte `F`
und dann sofort `1` und bekam achtmal die Anredezeile. Der Strang war nicht schuld: die
Tafel tippt ihren Satz, und ein Tastendruck während des Tippens ist verbraucht. Der Lauf
wartet jetzt auf `!gespraech.rollt` und auf `gespraech.tippGezeigt`. Wer hier weiterbaut:
ein Tastendruck ohne Wartebedingung beweist nichts, auch wenn danach etwas dasteht.

**Der Spielstand bleibt unberührt.** `langEreignis()` ruft `saveKladde()`, jeder Lauf über
`langAnsprechen()` schreibt also in den echten Stand. Genau dieser Testfehler steht offen in
`phase-w7-langvorgaenge.md`. `tools/langvorgang-pruef.mjs` sichert `localStorage` vorher und
stellt es im `finally` wieder her, und die letzte seiner 57 Feststellungen ist, dass der
Stand danach Zeichen für Zeichen derselbe ist.

---

## Bewusst offen für spätere Bauabschnitte

* **Das `figDa()`-Gate sitzt im Strang und nicht in `langAnsprechen()`.** Die allgemeine
  Lösung wäre, den Trichter selbst fragen zu lassen, ob die Figur im Dorf steht. Sie hätte
  alle sieben bestehenden Stränge angefasst, um an keinem von ihnen etwas zu ändern, denn
  keiner läuft über eine Figur mit `abAkt`. Beim zweiten Strang, der es tut, ist der Umzug
  fällig.
* **Ein Neuladen mitten in der Schicht** schadet hier nichts: der Strang kennt kein
  `langSchicht`-Flag, jeder Schritt hängt an einer Figur und nicht an einer Schicht. Er ist
  damit der erste, für den die Toleranz aus W7 gar nicht gilt.
* **Wer in Akt II anfängt, steht ab Stufe 3 zwanzig Schichten lang still**, bis Vorblatt
  kommt. Das ist beabsichtigtes Pacing und in `bestand()` sichtbar („3 von 8."), aber die
  Zeile sagt nicht, auf wen gewartet wird. Ein Hinweis darauf wäre ein Questlog, und das
  gibt es hier nicht.
* **Der Präzedenzfall wird im Finale genannt und nirgends sonst.** Sturz sagt ihren Satz
  unverändert; sie bezieht sich nicht auf Nörgel, und Nörgel erfährt nie, dass seine
  Unterschrift den Vorgang 1 möglich gemacht hat. Wenn die Szene aus `weltgeschichte.md`
  gebaut wird, in der die Zustellung als Szene läuft, ist das die Stelle, an der sich das
  ändern darf.
* **Lisbeths Traum bleibt offen.** Das Amt für Monsterbelange steht in Kapitel 8 und nicht
  in diesem Strang. Sie bekommt hier eine Unterschrift, keine Stelle.

---

## Live geprüft

Server auf Port 8378, `index.html` im Wurzelverzeichnis, nie `dist/` zum Entwickeln.
Playwright-Chromium der Umgebung, Node-Syntaxcheck nach jedem Bauschritt, durchgehend grün.
Die Konsole war am Ende jeder Messung still bis auf die fünfzehn „in Ordnung"-Zeilen und die
vier bekannten `Sprite fehlt`-Gruppen.
