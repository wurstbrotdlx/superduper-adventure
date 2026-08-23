# Bauabschnitt U6 — Knöterich bekommt eine Tafel, die Antworten bekommen Vorrang — ERLEDIGT

Drei Sachen, die nichts miteinander zu tun haben außer der Gesprächstafel, an
der sie alle drei hängen:

1. **Knöterich** ist die Figur, mit der das Spiel anfängt, und war die einzige
   des Ensembles, die man nicht ansprechen konnte. Er bekommt sein gemaltes
   Porträt, eine eigene Tafel, sechs Grundzeilen, fünf Aktzeilen und eine
   Anredeform. Dasselbe Porträt steht ab jetzt auch im Dienstzettel.
2. **Nörgel** trägt seit G10 ein Monsterrig, aber das falsche: das Ork-Blatt
   machte ihn so groß wie einen Menschen. Er bekommt das Blatt der Grünhaut,
   im Maßstab der Grünhaut.
3. **Die Tafel auf dem Telefon** hat bisher als Ganzes gerollt, und was dabei
   wegfiel, waren die Antworten. Ab jetzt stehen die Antworten fest und der
   Satz des Gegenübers rollt.

Kein neues Panel, keine neue Taste, keine neue Grafikdatei, keine Verzweigung
mit Folgen für den Spielstand.

---

## U6-1. Knöterich hat eine Tafel

### Was vorher da war

Knöterich sprach über drei Kanäle, alle drei von Phase 5: den Dienstzettel im
oberen Band, die Randnotiz daneben, und die Sprechblase über seinem Kopf beim
allerersten Zusammentreffen. Dazu seit E1 die Gesprächstafel, aber nur in
Szenen: im Empfang und in Szene 4.

Ansprechbar war er auch. Die Kontextaktion an seiner Kachel hieß `Nachfragen`,
gab es erst ab dem ersten gezeigten Dienstzettel, und sie zeigte einen alten
Zettel noch einmal im oberen Band. Das war kein Gespräch, das war ein
Nachschlagewerk mit einer Taste.

Was fehlte, ist leicht zu übersehen, weil er so viel redet: **er antwortet
nicht.** Vierzehn Dorffiguren haben seit U3 eine Tafel mit vier Antworten, und
ausgerechnet der Mann, mit dem der Spieler die ersten fünf Minuten verbracht
hat, hatte keine.

Der Grund war technisch und alt: Knöterich steht nicht in `DORF_FIGUREN`. Er
ist älter als die Tabelle, er wohnt im Haus statt im Dorf (`KN_POS`,
`drawAlter()`), und alles, was an der Tabelle hängt, ging deshalb an ihm
vorbei. Man sieht die Naht an drei Stellen im Bestand:

* `figurenFarbenAssert()` baute sich seinen Eintrag selbst zusammen
  (`{key:'knoeterich', opt:'fest', gestalt:KN_GESTALT}`), nur um ihn prüfen zu
  können.
* `szeneSprecherKnoeterich()` baute je Aufruf ein Wegwerf-Objekt mit
  `figur:{key, name}`.
* `SZENEN.knoeterich` hing als einzige Szene nicht an `gespraechOeffnen()`,
  sondern an `AKT_NACHFRAGE`, mit einem Kommentar, der die Asymmetrie zur
  Figureneigenschaft erklärte.

Drei Abzüge derselben fehlenden Zeile.

### Was jetzt da ist

`KN_FIGUR` — ein Figureneintrag mit genau den Feldern, die `npcCycle()` und
`gespraechOptionen()` lesen, plus `opt`/`gestalt` für die beiden Guards, die
über Figuren laufen. Dazu `knNpc`, ein einziges Tafel-Objekt für die ganze
Sitzung, mit `x`/`y` auf `KN_POS`.

**Nicht in `DORF_FIGUREN`.** Dort stehen die Figuren, die `genMap()` ins Dorf
setzt und `DRAW_NPC` zeichnet. Er steht fest im Haus und wird von `drawAlter()`
gezeichnet. Zwei Zeilen für dieselbe Figur wären zwei Wahrheiten, und die
zweite driftet.

Was daraus von selbst folgt, ohne eine Zeile Sonderbehandlung:

| Weg | vorher | jetzt |
|---|---|---|
| Kontextaktion | `Nachfragen`, erst ab dem ersten Zettel | `Ansprechen`, immer |
| Griff | `AKT_NACHFRAGE`, eigener Fall | `AKT_NPC`, derselbe wie im Dorf |
| Szene 4 | Sonderhaken in `fuehreAktion()` | der Haken in `gespraechOeffnen()` |
| Porträt | Sprite-Ausschnitt, grau getönt | das gemalte Bild aus U5 |
| Namensschild | nie hervorgehoben | hell, solange man mit ihm redet |
| Sprechblase | stand auch bei offener Tafel | verschwindet, wie bei den anderen |
| Weggehen | (kein Gespräch) | beendet das Gespräch, wie im Dorf |

`AKT_NACHFRAGE` ist ersatzlos weg, `knNachfragen()` ist zu `knNachfragenZeile()`
geworden und liefert die Zeilen, statt sie anzuzeigen.

### Das Porträt war schon da

Es musste nichts gemalt und nichts geladen werden. `PORTRAET_FIGUREN` führt
`knoeterich` seit U5 (er führt den Empfang und damit die Tafel), die Datei liegt
in `assets/portraets/`, und `gespraechPortrait()` findet sie über
`n.figur.key`. Was fehlte, war der Weg, der ihn außerhalb einer Szene auf die
Tafel bringt.

### Mehr Gesprächsstoff, und wo die Grenze liegt

Sechs Grundzeilenpaare und fünf Aktzeilen, derselbe Umfang wie bei jeder
Dorffigur (Weltbibel, Kapitel 14: „Pro Figur vier bis sechs Zeilen plus eine
Zeile, die sich mit dem Aktstand ändert"). Der Wortlaut steht in
`figuren-dorf.md`, Serie 3.

Die Grenze ist Kapitel 8: **er erklärt Tasten, nie Zusammenhänge.** Das ist
keine Designregel, die man umgehen könnte, sondern die tiefste Eigenschaft der
Figur — er erklärt nicht, weil er nicht darf (Amtsverschwiegenheit, und die
endet nicht mit der Pensionierung). Keine der neuen Zeilen sagt, was er weiß.
Sie sagen, dass er es nicht sagen darf, und eine davon sagt es, indem sie das
Thema wechselt.

Sein W11-Zuwachs (die Rangfolge des Reiches) bleibt aus demselben Grund
draußen, aus dem die Weltbibel ihn ausdrücklich draußen lässt.

### Die Anredeform, die fehlte

Kapitel 18.5 verlangt von Knöterich die Vollform, „jedes Mal", inklusive „Herr
oder Frau". `ANREDE` hatte für ihn keinen Eintrag — nicht aus Nachlässigkeit,
sondern weil die Tabelle an `DORF_FIGUREN` hängt und er dort nicht steht.
Solange ihn niemand nach dem Titel fragen konnte, fiel es nicht auf. Mit der
Tafel kann man, und `anredeZeile()` hätte auf den nackten Rangnamen
zurückgegriffen: `{z1: rangName() + '.', z2:''}`.

Jetzt steht er als zwölfte Form drin, gebaut wie die übrigen elf
(`anredePunkt(rangStufe(), 48)`), mit seiner Regel als zweiter Zeile:
„Vollständig. Immer." `anredeAssert()` führt ihn als benannte Ausnahme, wie
`gespraechAssert()` und `szeneAssert()` es schon tun.

### Die fünfte Antwort

Als einzige Figur im Spiel hat Knöterich eine Antwortliste, deren Länge sich
ändert. Liegt ein Dienstzettel vor, kommt **„Was stand da eben?"** dazu und
spielt ihn in der Tafel ab, bei jedem Griff einen weiter zurück, höchstens drei
(der Cap in `kn.history`). Das ist die alte Kontextaktion, nur an ihrem
richtigen Ort.

Steht noch kein Zettel, steht die Antwort nicht da. Das war schon die Regel der
Kontextaktion, und eine Antwort, die „nichts" sagt, wäre eine Zeile weniger für
die vier, die etwas sagen.

Die zweite Antwort heißt bei ihm **„Wie steht es im Haus?"** statt „Wie steht es
im Dorf?". Dieselbe Quelle (`fig.akt`), nur nach dem gefragt, wo er sitzt.

---

## U6-2. Das Porträt im Dienstzettel

Der Kopf am Dienstzettel war seit Phase 5 ein Sinnbild aus der Zeichentabelle
(🧑‍💼). Das war richtig, solange es kein Bild von Knöterich gab. Seit U5 gibt es
eins, und wer den Zettel liest, soll denselben Mann sehen wie im Gespräch: ein
Kanal, ein Gesicht.

Ein `<canvas>` und kein `<img src>`, aus demselben Grund wie überall in diesem
Projekt: `SHEETS[].img` trägt im Quellbaum einen Pfad und im Einzeldatei-Build
eine `data:`-URI. Ein CSS-`url()` oder ein festes `src` wäre eine zweite
Ladestelle, die `build-single.mjs` nicht kennt.

Gezeichnet wird **einmal** nach `loadAssets()`, neben `portraetAssert()` und aus
demselben Grund. Der Zettel wechselt seinen Text, nicht seinen Absender.

**32 Pixel und nicht `calc(32px * var(--fs))`.** Das Bild ist 128 breit, 32 ist
exakt ein Viertel, und ein Viertel ist der einzige Faktor in diesem Band, bei
dem kein Bildpixel zwischen zwei Gerätepixel fällt (Regressionsregel 14). Die
Höhe des Bandes bestimmen ohnehin die beiden Textzeilen, und die wachsen weiter
mit der Schriftstufe.

**Nur der Dienstzettel, nicht die Randnotiz.** Die Randnotiz ist im
Gameplay-Prompt (Zeile 274) als „eine Zeile, nur Stempel, **kein Kopf**"
festgelegt, und der Kopf ist genau das, was die beiden Kanäle unterscheidet.
Ein Porträt auf beiden hätte diesen Unterschied eingezogen.

Das Sinnbild bleibt als Rückfall stehen und ist sichtbar, bis das Bild wirklich
gezeichnet ist. Ohne Bilddatei sieht der Zettel aus wie vorher.

---

## U6-3. Nörgel trägt das Blatt der Grünhaut

G10 hat Nörgel auf ein Monsterrig gestellt, und die Begründung stimmt weiter:
sein Porträt zeigt einen Kobold mit gewaltigen spitzen Ohren, das Helden-Rig hat
keine, und G9 konnte ihm die Haut grün färben, aber keine Ohren anwachsen
lassen.

Genommen hat G10 `orc_chief`, weil das Blatt ohnehin geladen wird (das
Empfangsbekenntnis am Lagertor steht darauf), und die Größe **gerechnet statt
gemessen**. Der Kommentar sagte es selbst: „rigSc 1.9 ist gerechnet und nicht
geraten, aber ungeprüft", und „der Körper des Orks misst 20 bis 24 Pixel".

Gemessen sind es 28 (Idle-Seitenzeile, Frame 0, Deckfläche y 2..30). Mal 1,9
sind das 53 Pixel im Bild — genau die Höhe der Menschen um ihn herum
(Held-Komposit rund 32 bei `NPC_SC` 1,656). Der kleine Sachbearbeiter war so
groß wie ein Häuptling, weil er einer war. G10 hat das unter „Was weiter nicht
belegt ist" selbst als offenen Punkt notiert: „ob Nörgel neben Lisbeth stimmig
steht oder zu klein wirkt, entscheidet der erste Blick." Der erste Blick sagt:
zu groß.

Er trägt jetzt `goblin_maceman` mit `rigSc: 1.8`, also **exakt das, was im Wald
als Grünhaut herumläuft** — `MONDEF.goblin` hat `rig:'goblin_maceman'`,
`sc:1.5`, `psc:1.2`. Beides ist Absicht:

* **Dasselbe Blatt.** Nörgel sagt über seine Leute hinter der Palisade
  „Grünhaut. Wie ich." Ab hier stimmt das auch im Bild. Kein zweites Aussehen
  für dasselbe Volk.
* **Derselbe Maßstab.** 1,8 ist keine freie Zahl, sondern `sc` mal `psc`.
  `drawMon()` multipliziert beide, `DRAW_NPC` kennt nur einen Faktor. Gemessen:
  Deckfläche 16 Pixel hoch, mal 1,8 sind 29 im Bild, gut die Hälfte der
  Menschen.

Die Fußlinie stimmt mit: `goblin_maceman` hat `ay:25`, die gemessene Fußlinie
liegt bei y=23. `npcAnkerAssert()` erlaubt zwei Pixel und schweigt.

`gestalt` bleibt stehen und ist weiter der Rückfallweg: ohne Grafikpaket gibt es
kein Rigblatt, dann steht wieder das grünhäutige Komposit da.

---

## U6-4. Die Antworten stehen, der Satz rollt

### Was vorher da war

Die Tafel bekam auf Mobil eine Höchsthöhe und ein `overflow-y:auto`. Was nicht
mehr hineinpasste, war weggerollt — und weggerollt war immer dasselbe, nämlich
das Ende, und das Ende ist seit U4 die untere Hälfte mit den Antworten.

Gemessen auf **360x640 bei der größten Schriftstufe**: die Tafel war 299 Pixel
hoch, ihr Inhalt 515, und die untere Hälfte begann bei 306 und endete bei 574.
Sie stand also **vollständig außerhalb** der Tafel. Der Spieler sah einen Satz
und keine einzige Wahl und musste wischen, um überhaupt zu erfahren, dass es
eine gibt.

Das ist genau die falsche Reihenfolge. Der Satz des Gegenübers ist Text und darf
rollen. Die Wahl ist Bedienung und muss stehen.

### Was jetzt da ist

Eine Hülle (`#gespraechInnen`) um die beiden Hälften, als Spalte mit einer
Höchsthöhe. Darin gibt die obere Hälfte nach (`flex:1 1 auto; min-height:0`),
die untere nicht (`flex:0 0 auto`), und gerollt wird im Satzfeld selbst.

**Warum eine Hülle und nicht die Tafel selbst.** Höchsthöhe und Nachgeben müssen
an einem Kasten hängen, und die Tafel kann es nicht sein: `gespraechOeffnen()`
schreibt ihr `display:block` als Inline-Stil, ein `display:flex` aus dem
Stylesheet käme dagegen nicht an, und ein `!important` dagegen würde auch das
`display:none` beim Schließen überstimmen — die Tafel ginge nie mehr zu. Eine
Zeile HTML ist billiger als ein Fenster, das offen bleibt.

**Der Boden ist von 240 auf 440 gestiegen.** Das ist der eigentliche Eingriff.
Ein Boden sagt: so viel Platz nimmt sich die Tafel notfalls, auch wenn das
Fenster kleiner rechnet. 240 war weniger, als die untere Hälfte allein braucht.
Gemessen auf 360 Breite bei größter Schriftstufe, über jede Figur und jeden
Szenenknoten des Spiels:

| Fall | Antworten | Höhe der unteren Hälfte |
|---|---|---|
| Knöterich mit Dienstzettel | 5 | **316** |
| jede Dorffigur | 4 | 268 |
| längste Szenenliste (`empfang/anrede`) | 3 | 220 |

Unterhalb der 316 **können** die Antworten nicht vollständig dastehen, gleich
welche Hälfte nachgibt. 440 trägt sie samt der 90 des Bildfeldes und lässt noch
Luft für zwei Satzzeilen.

Die Rechnung `100dvh - 341px` bleibt, wie sie war: 56 oben plus der
Daumenfächer unten (230x250, der oberste Knopf reicht bis 268 hinauf) plus
Luft. Auf einem hohen Schirm gewinnt sie weiter, dort ändert sich nichts und
der Fächer bleibt frei. Auf einem kurzen wächst die Tafel in den Fächer hinein,
und das ist die Entscheidung, die der Auftrag ausdrücklich freigegeben hat
(„darf in mobil ruhig höher sein"): während eines Gesprächs wird nicht
gekämpft, und wer weggehen will, hat das Kreuz, die Antwort „Auf Wiedersehen."
und den freien Streifen unter der Tafel.

Dazu zwei Untergrenzen, damit das Nachgeben nicht in ein Zerquetschen umschlägt:
`#gespraechOben` bleibt mindestens 90 Pixel hoch (72 Porträt plus Innenabstand),
und `#gespraechText` behält seine zwei Zeilen `min-height` aus U3.

Die Tafel behält ein `overflow-y:auto` als Notbremse und eine Höchsthöhe von
`100dvh - 64px`. Beides greift nur auf einem liegenden Telefon, wo auch ein
einziges Feld nicht mehr hinpasst. Ohne die Notbremse wäre dieser Fall nicht
gerollt, sondern abgeschnitten: die Tafel trägt seit U4 `overflow:hidden` für
ihre Trennkante.

### Ein Rollfeld muss man erkennen

Zwei Zeilen, die aus dem Bild kommen und nicht aus der Anforderung:

* **Es rollt dem Tippwerk hinterher.** Sonst läuft der Satz außerhalb des
  Bildes weiter, der Blinker steht unter der Kante, und wer nicht von selbst
  wischt, liest die halbe Zeile. Ein Lesevorgang auf `scrollHeight` je
  Buchstabe, nicht je Frame — dieselbe Größenordnung wie das `innerHTML`, das
  seit U3 an derselben Stelle steht.
* **Ein Verlauf über der Unterkante**, sobald dort etwas liegt, was nicht mehr
  im Bild ist. Die Klasse wird nur bei einem Wechsel gesetzt, nicht je
  Buchstabe.

---

## Was die Guards jetzt mitprüfen

Keine neuen Guards. Die bestehenden lesen ab jetzt eine Figur mehr:

* **`knAssertCaps()`** läuft über `DORF_FIGUREN.concat([KN_FIGUR])`. Damit
  gelten für Knöterichs Zeilen dieselben Zeichendeckel (48/32/44), dieselbe
  Sperrvermerkliste, dieselbe Kaiser-Präteritum-Regel und dieselbe
  Strukturzusicherung wie im Dorf: sechs Grundzeilenpaare, fünf Aktzeilen,
  keine leer. Eine fehlende Aktzeile wäre bei ihm ebenso eine stumme Figur.
* **`figurenFarbenAssert()`** liest `KN_FIGUR` statt sich seinen Eintrag selbst
  zu bauen.
* **`gespraechAssert()`** prüft seine Antwortliste in **beiden** Ständen (vier
  ohne Dienstzettel, fünf mit), spiegelt `kn.history` dafür und setzt sie exakt
  zurück. Idiom aus `anredeAssert()`.
* **`anredeAssert()`** verlangt eine Form für ihn und führt ihn als benannte
  Ausnahme in der Gegenrichtung („Anredeform ohne Figur").

## Abnahme

Im Browser mit offener Konsole, mit danebengelegter Grafik aus dem Assets-Repo.

```
U3 Gespräch: 14 Namensschilder, je vier Antworten und zwei Tafelhälften in Ordnung.
U5 Porträts: 15 gemalte Bilder zugeordnet, Sprite-Ausschnitt für niemanden.
G10 Figurenfarben: 15 Figuren eingekleidet, 2 mit Kopfbedeckung, 1 mit eigenem Hautton, 1 auf einem Monsterrig.
…
G6 Dorfsicht: 14 Dorffiguren haben ein Blatt und stehen im Bild.
U5 Porträts: 15 gemalte Bilder geladen, quadratisch und im 128er-Raster.
```

Sonst steht nichts in der Konsole, kein `pageerror`. Die vier
„Sprite fehlt"-Warnungen (Lumberjack_Shirt, Farmer_Hat_1, zwei Plate_Helmets)
stehen unverändert auch auf `main` und sind ein Stand des Assets-Repos, kein
Fund dieses Abschnitts.

| Lauf | Ergebnis |
|---|---|
| `node tools/gespraech-pruef.mjs` | **89 von 89** (60 vorher, davon eine korrigiert, 29 neu) |
| `node tools/empfang-pruef.mjs` | 59 von 59 |
| `node tools/szene-pruef.mjs` | 32 von 32 |
| `node tools/reich-pruef.mjs` | 35 von 35 |
| `node tools/menue-pruef.mjs` | 39 von 39 |
| `python3 tools/portraet-farben.py --pruef` | kein Unterschied |
| `python3 tools/monsterkatalog.py` | 28 Gegner, 0 Verletzungen |
| `node tools/build-single.mjs` | läuft, 2264 KB; per `file://` geladen: dieselben Meldungen, Porträt im Zettel steht, Nörgel auf `goblin_maceman_idle` |

**Am Bild geprüft**, weil es Fragen sind, die kein Guard beantwortet:

* Nörgel zwischen Zwirn und einer echten Grünhaut nebeneinandergestellt: gleiche
  Figur, gleiche Höhe wie die Grünhaut, gut halb so hoch wie Zwirn.
* Knöterichs Tafel auf dem Desktop: gemaltes Porträt, voller Name, fünf
  Antworten, darüber der Dienstzettel mit demselben Gesicht neben dem
  Paragrafenstempel.
* Die Tafel auf 360x640 bei größter Schrift: alle fünf Antworten stehen, der
  Satz ist angeschnitten und trägt den Verlauf.

**Der eine Fund, der nicht aus diesem Abschnitt stammt:** `gespraech-pruef.mjs`
prüfte in zwei Zeilen, dass Lott den Sprite-Ausschnitt bekommt. G10 hat ihm und
Pahl das geteilte Doppelporträt gegeben und die Prüfung nicht nachgezogen; sie
lief seither rot mit. Sie prüft jetzt, was G10 zugesagt hat: beide sehen
dasselbe Bild, und es ist ein gemaltes. Damit hat keine Figur mehr den
Ausschnitt; dass ihn niemand geht, meldet `gespraechAssert()` beim Start.

## Was offen bleibt

* **Die Randnotiz bleibt kopflos.** Richtig so, siehe U6-2. Wenn sich das je
  ändern soll, ändert sich zuerst der Gameplay-Prompt.
* **Knöterichs Zuwachs aus W11** steht weiter nicht im Spiel, und das ist keine
  Lücke, sondern Kapitel 8.
* **Kein Anlass-Kanal für ihn.** Lott und Pahl kommentieren, was gerade
  passiert ist (`fig.anlass`). Knöterich hat dafür seine eigenen Kanäle
  (Randnotiz, Dienstzettel) und braucht keinen zweiten Weg in dieselbe Rolle.
* **Seine Sprechblase bleibt bei Beat 1.** Was er in der Tafel sagt, steht
  danach nicht als Blase über seinem Kopf, anders als bei den Dorffiguren. Das
  ist kein Versehen: die Weltfigur-Blase zeigt laut Gameplay-Prompt
  „ausschließlich Beat 1", sie hat eine eigene Variable (`knBubble`) und läuft
  nicht über `n.bubbleText1`. Wer das ändern will, ändert zuerst dort etwas.
* **Die Tafel im Querformat.** Auf einem liegenden Telefon rollt sie weiter als
  Ganzes. Der Fall ist nicht gelöst, sondern abgefangen: keine Anordnung der
  beiden Hälften bringt Bild, Satz und fünf Antworten in 390 Pixel Höhe. Eine
  Lösung wäre eine dritte Anordnung (Bild und Antworten nebeneinander), und die
  wäre ein eigener Abschnitt.
* **Das Bildfeld auf dem engen Schirm.** Es bleibt bei 72x72 und gibt als
  einziges Stück nichts ab. Wenn die 440 je zu wenig werden, ist es der nächste
  Kandidat.
