# Bauabschnitt U4 — Die Gesprächstafel wird zweigeteilt — ERLEDIGT

Eine Bitte, ein Bauabschnitt: **das Dialogfenster soll zwei Teile haben. Oben
der laufende Dialog und das Porträt, unten die Antwort- und Frageoptionen. Oben
der NPC, unten der Spieler.**

Kein neuer Text, keine neue Verzweigung, keine neue Taste. U4 ist eine Frage der
Form, und zwar genau der einen: sieht man der Tafel an, welche Hälfte gesprochen
wird und welche man selbst bedient?

## Was vorher da war

Seit U3 steht unten am Bild eine Tafel im Pixelrahmen des Packs. Ihr Innenleben
war **eine** Zeile aus zwei Spalten:

```
┌──────────────────────────────────────────────┐
│ ┌──────┐  Bürgermeister Alfons Zwirn      ✖ │
│ │      │  ────────────────────────────────── │
│ │ Bild │  Herr oder Frau Monstralamts…!      │
│ │      │  Bald schon. Ganz sicher.           │
│ │      │                                     │
│ └──────┘  1. Und sonst?                      │
│           2. Wie steht es im Dorf?           │
│           3. Wie war noch mein Titel?        │
│           4. Auf Wiedersehen.                │
└──────────────────────────────────────────────┘
```

Links das Porträt der Figur, rechts eine einzige Spalte: Name, Satz, Antworten
— alles untereinander, alles in derselben Flucht, alles auf demselben Grund.

Das funktionierte, und es war trotzdem eine Verwechslung mit Ansage. Die vier
Antworten standen unter dem Satz der Figur wie ein Nachsatz **derselben**
Person, eingerückt unter deren Namen und neben deren Bild. Wer die Tafel zum
ersten Mal sah, musste aus dem Inhalt schließen, dass „Auf Wiedersehen." nicht
der Bürgermeister sagt, sondern er selbst. Das ist eine Zumutung, die sich mit
einer Kante beheben lässt.

## Was jetzt da ist

Zwei Felder, eine Kante dazwischen. Oben das Gegenüber, unten der Spieler.

```
┌──────────────────────────────────────────────┐
│ ┌──────┐  Bürgermeister Alfons Zwirn      ✖ │
│ │      │  ────────────────────────────────── │   ← oben: der NPC
│ │ Bild │  Herr oder Frau Monstralamts…!      │
│ │      │  Bald schon. Ganz sicher.           │
│ └──────┘                                     │
├══════════════════════════════════════════════┤   ← die Kante
│ MONSTERANGELEGENHEITENANWÄRTER      ┌──────┐ │
│ 1. Und sonst?                       │      │ │   ← unten: der Spieler
│ 2. Wie steht es im Dorf?            │ Bild │ │
│ 3. Wie war noch mein Titel?         │      │ │
│ 4. Auf Wiedersehen.                 └──────┘ │
└──────────────────────────────────────────────┘
```

### U4-1. Die zwei Hälften

`#gespraechInnen` heißt jetzt `#gespraechOben` und trägt, was das Gegenüber
ausmacht: Porträt, Name, laufender Satz. Neu daneben ist `#gespraechUnten` mit
Amtsbezeichnung, Antwortliste und dem Bild des Spielers.

Die Hülle `#gespraech` hat dafür ihr `padding:14px` abgegeben; jede Hälfte
bringt jetzt ihren eigenen Innenabstand mit. Das ist keine Kosmetik: mit dem
Polster an der Hülle hätte die Trennkante links und rechts in der Luft geendet
statt an der Rahmenkante. Dazu `overflow:hidden`, damit der dunklere Grund der
unteren Hälfte an der Rundung der Tafel abgeschnitten wird und nicht über sie
hinaussteht.

Die Kante selbst ist die Doppellinie des Hauses: 2px `#8a6d3b` oben, darunter
ein 1px `#6b5a3a` als `inset`-Schatten — dieselbe Bauweise wie `.amtRegel` unter
den Urkundenköpfen.

### U4-2. Die untere Hälfte ist erkennbar die des Spielers

Drei Dinge sagen das, und keines davon ist ein erklärender Satz:

**Ein eigener Grund.** `rgba(8,5,12,.55)` über der Tafelfüllung. Dunkler, nicht
heller: die obere Hälfte spricht, die untere wartet.

**Eine Zeile, die sagt, wer antwortet.** Sie steht über der Antwortliste an
derselben Stelle, an der oben der Name der Figur steht — und sie trägt die
Amtsbezeichnung aus `rangName()`, nicht einen Namen. Einen Namen hat der Spieler
in diesem Haus nicht; die Anrede läuft über den Titel (Weltbibel 18.5), und
Lisbeth Fuhr fragt bekanntlich weiter nach ihm. Klein und gesperrt gesetzt wie
`.amtFuss`, damit die Zeile ein Schild bleibt und nicht als fünfte Antwort
gelesen wird.

Gelesen wird sie bei **jedem** Zeichnen neu und nicht einmal beim Öffnen. Der
Grund ist der Empfang: er läuft über dieselbe Tafel, und dort wechselt der Titel
mit der Unterschrift. Eine Zuweisung je Antwort ist billiger als ein Sonderfall.

**Ein zweites Porträt, unten rechts.** Gegenüber dem der Figur, wie zwei Leute,
die sich ansehen. Vierfach vergrößert statt fünffach: oben steht, wer redet,
unten nur, wer zuhört.

### U4-3. Woher das Spielerbild kommt

Aus `SHEETS['hero_baked']` — genau dem Blatt, das der Spieler auch in der Welt
trägt. Damit stehen die Frisur der Schicht, die Haarfarbe der Schicht und die
angelegte Rüstung von selbst auf dem Bild, ohne dass eine einzige Zeile davon
weiß. Derselbe Weg, den das Lichtbild im Dienstausweis seit P1 geht
(`renderAusweisFoto()`), und aus demselben Grund.

Zwei Unterschiede zum Lichtbild, beide gewollt:

- **Der Ausschnitt.** Das Passbild zeigt Kopf und Schultern. Hier steht die
  ganze Figur, im selben Ausschnitt wie das Porträt oben (`PORTRAET_X/Y/B/H`).
  Sonst wäre das Gegenüber oben eine Person und der Spieler unten ein Passfoto.
- **Die Frame-Adresse.** Die Pack-Blätter liegen in Zeilen, das Held-Komposit
  liegt in **einer** Reihe (`bakeHeroSheet()` legt alle Anim-Reihen
  nebeneinander, `rowStart:0`). Der Ruheframe steht deshalb bei
  `BAKED_HERO_ANIM.idle.offset * 64`, nicht in Zeile 0. Frame 0 und nicht der
  laufende Takt — ein Porträt zappelt nicht.

Fehlt das Blatt (vor `loadAssets()`, oder im Klon ohne Grafik), bleibt das Feld
dunkel. Kein Fehler, dieselbe Regel wie beim Porträt oben.

### U4-4. Auf dem Telefon fällt ein Bild weg, nicht die Teilung

Unter 480px Breite kostet das zweite Porträt ein Viertel der Zeile, und was es
sagt — „hier antworten Sie" — sagt die Zeile darüber auch. Also `display:none`
für `#gespraechIchBild`, während Kante, Grund und Amtsbezeichnung bleiben. Das
erste Porträt bleibt ebenfalls: es zeigt, wer da steht, und das steht sonst
nirgends.

Der Innenabstand beider Hälften geht auf dem Telefon von 14px auf 10px zurück,
wie schon vorher der Abstand zwischen Bild und Text.

## Entscheidungen, die anders hätten ausfallen können

**Die untere Hälfte ist mittig ausgerichtet, nicht unten bündig.** Das Bildfeld
hält die untere Hälfte auf 108px, und im Empfang steht dort oft nur eine
einzige Antwort. Bündig unten stünde sie dann unter einem Streifen Nichts.
`align-items:center` setzt sie neben das Bild; bei vier Antworten ist die Liste
ohnehin höher, und dann setzt `align-self:flex-end` das Bild auf die Unterkante
— die Figur steht auf dem Boden der Tafel, wie sie in der Welt auf dem Boden
steht.

**Keine Beschriftung auf der Kante.** Ein „IHRE ANTWORT" quer über die
Trennlinie war der erste Gedanke und wäre Doppelung: die Amtsbezeichnung
darunter sagt dasselbe, und sie sagt es nebenbei auch noch, wer man ist.

**Die Tafel ist gewachsen, und das bleibt so.** 165px oben plus 196px unten
statt vorher rund 230px insgesamt. Auf 1280×800 reicht sie damit bis 479px über
die Bildunterkante — die Welt bleibt sichtbar, und die Tafel steht weiter unten
statt in der Mitte, aus demselben Grund wie seit U3. Wer die Tafel kleiner
haben will, hat den Schriftregler.

**Der Guard prüft die Aufhängung, nicht das Aussehen.** `gespraechAssert()`
bekommt vier Zeilen dazu, und alle vier fragen dasselbe: hängt dieses Stück in
der Hälfte, in der es hängen soll? Das ist das, was ein verrutschtes `</div>`
beim nächsten Eingriff kaputtmacht — und es macht es leise: das Fenster sähe
wieder aus wie vor U4, ohne dass ein einziger Fehler in der Konsole stünde.

## Was ausdrücklich nicht geändert wurde

- **Kein Satz.** Nicht einer. Die Antwortlisten sind dieselben vier, der
  Empfang hat dieselben Knoten, `npcSprechen()` hat dieselben Nebenwirkungen an
  denselben Stellen.
- **Keine Bedienung.** Maus, Ziffern, Pfeil hoch/runter plus Eingabe, `F` zum
  Öffnen und Weiterreden, Esc, Klick daneben, Weggehen — alles unverändert, und
  alles nachgeprüft (unten).
- **Keine Weltbibel-Regel.** U4 fasst keine Form- oder Humorregel an. Was die
  Tafel sagt und wer wie angeredet wird, steht dort und ist geblieben.
- **Knöterichs Zettel** bleiben, was sie sind. Seine Randnotiz-Maschinerie
  (`#knZettel`) ist eine eigene und hat mit der Tafel nichts zu tun — außer im
  Empfang, und dort führt er die Tafel selbst.

## Abnahme

`tools/gespraech-pruef.mjs` hat zehn Zeilen dazubekommen, sieben am Desktop und
drei auf dem Telefon. Geprüft wird nicht, wie es aussieht, sondern was die
Teilung ausmacht: dass es zwei Hälften gibt, dass jedes Stück in seiner steht,
dass die Kante wirklich eine Kante ist (kein Spalt, keine Überlappung) und dass
das zweite Bildfeld etwas zeigt statt schwarz zu bleiben.

```
$ node tools/gespraech-pruef.mjs
…
ok    die Tafel hat zwei Haelften mit Hoehe                    ist=true soll=true
ok    der Satz steht in der oberen Haelfte                     ist=true soll=true
ok    die Antworten stehen in der unteren                      ist=true soll=true
ok    die untere Haelfte schliesst an die obere an             ist=true soll=true
ok    zwischen beiden steht eine Kante                         ist=true soll=true
ok    unten steht die Amtsbezeichnung                          ist="Monsterangelegenheitenanwärter" soll=…
ok    das zweite Portraet ist gezeichnet                       ist=true soll=true
…
ok    kein zweites Portraet auf Mobil                          ist="none" soll="none"
ok    das erste Portraet bleibt                                ist=true soll=true
ok    die Antworten stehen auch dort unten                     ist=true soll=true
…
54 von 54 Pruefungen bestanden.
```

Dazu, ohne Abweichung:

- `tools/empfang-pruef.mjs` — **59 von 59**. Der Anfang läuft über dieselbe
  Tafel, und er läuft unverändert: fünf Vorstellungstafeln, zwölf Fragen, neun
  Knoten, beide Wege zur Unterschrift.
- `tools/menue-pruef.mjs` — **39 von 39**. Die sieben Panels aus U1 sind von
  der neuen Hülle nicht berührt.
- Ladelauf im Browser: alle Guards melden „in Ordnung", die Konsole ist sonst
  still. Die U3-Zeile lautet jetzt
  `U3 Gespräch: 14 Namensschilder, je vier Antworten und zwei Tafelhälften in Ordnung.`
- `node tools/build-single.mjs` und die entstandene `dist/index.html` per
  `file://` geladen: gleiche Meldungen, keine zusätzlichen, beide Hälften
  stehen.

## Was offen bleibt

- **Mehr als vier Antworten.** Die untere Hälfte hat jetzt die ganze Tafelbreite
  und trüge ohne Weiteres sechs. Was dort stünde, ist eine Inhaltsfrage und
  gehört nach `figuren-dorf.md`, nicht in einen UI-Bauabschnitt.
- **Ein Ausdruck im Porträt.** Beide Bilder zeigen den Ruheframe. Ein zweites
  Blatt je Figur (reden, ärgern, freuen) wäre Grafik und keine Form; das Pack
  hat keins.
- **Der Empfang mit einer einzigen Antwort** lässt die untere Hälfte luftig
  wirken. Mittig statt bündig hat das entschärft; ganz weg ist es nicht, und
  ein Sonderfall für „nur eine Antwort" wäre teurer als der Anblick.
