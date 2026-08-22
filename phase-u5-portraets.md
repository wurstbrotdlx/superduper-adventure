# Bauabschnitt U5 — Die Figurenporträts kommen in die Tafel — ERLEDIGT

Seit dem Bilderlauf vom 22.08.2026 hat das Ensemble neunzehn gemalte Porträts.
Sie lagen in `assets/figuren/`, standen in keiner Ladeliste und wurden vom Build
ausdrücklich übersprungen. U5 holt dreizehn davon ins Spiel, dorthin, wo seit U4
ein Platz für sie frei ist: in die obere Hälfte der Gesprächstafel.

Kein neuer Text, keine neue Figur, keine neue Taste. U5 tauscht ein Bild aus und
lässt alles stehen, was daran hängt.

## Was vorher da war

Die Tafel schnitt ihr Porträt seit U4 aus dem laufenden Sprite: `PORTRAET_X/Y/B/H`,
ein 22x27-Ausschnitt aus dem 64er-Feld, fünffach vergrößert auf 110x135. Das war
kein Provisorium aus Bequemlichkeit, sondern die einzige Quelle, die es gab — das
Grafikpack hat keine Porträts, und die Notiz in `assets/figuren/README.md` sagte
dazu klar: „Ein gemaltes Bild passt dort nicht hinein."

Das stimmte, solange das Feld die Form des Sprite-Ausschnitts hatte.

## Was jetzt da ist

```
┌──────────────────────────────────────────────┐
│ ┌────────┐  Bürgermeister Alfons Zwirn    ✖ │
│ │        │  ──────────────────────────────── │
│ │ gemalt │  Herr oder Frau Monstralamts…!    │
│ │ 128²   │  Bald schon. Ganz sicher.         │
│ └────────┘                                   │
├══════════════════════════════════════════════┤
│ MONSTERANGELEGENHEITENANWÄRTER      ┌──────┐ │
│ 1. Und sonst?                       │Sprite│ │
│ …                                   └──────┘ │
└──────────────────────────────────────────────┘
```

Oben ein gemaltes Bild, unten weiter der Sprite-Ausschnitt. Dass das keine
Nachlässigkeit ist, steht unter „Entscheidungen".

### U5-1. Das Bildfeld wird quadratisch

`#gespraechBild` misst jetzt 128x128 statt 110x135 (mobil 72x72 statt 72x88), und
die Leinwand darin genauso. Der Grund ist Arithmetik: die Porträts sind 128x128,
und in einem 128er-Feld steht ein Bildpixel auf einem Gerätepixel. Jede andere
Feldgröße hätte den häufigen Fall krumm gerechnet.

Andersherum ginge es auch — Feld 135 hoch, Porträt auf 135 hochgezogen, dafür der
Sprite-Ausschnitt unverändert fünffach. Dann wäre der seltene Fall der saubere
gewesen und dreizehn Bilder hätten einen krummen Zwischenschritt bekommen. Also
so herum.

### U5-2. Der Sprite-Ausschnitt bleibt, als Rückfallweg

`gespraechPortrait()` sucht zuerst ein Blatt `portraet_<figur.key>`. Findet es
keins, zeichnet es weiter genau das, was es seit U4 gezeichnet hat. Zwei Zahlen
haben sich dabei geändert, beide folgen aus dem Quadrat: vierfach statt fünffach
(fünffach wären 135 Pixel Höhe und passten nicht in 128), und mittig statt
randfüllend. 88x108 in 128x128 lässt links und rechts je 20 Pixel und oben 20 —
ganze Zahlen, damit kein Pixel zwischen zwei Pixel fällt.

Der Rückfallweg ist nicht Beiwerk, sondern der Grund, warum der Eingriff klein
bleibt. Über ihn laufen: Lott und Pahl (siehe unten), jede Figur, die später
dazukommt, bevor ihr Bild da ist, und der frische Klon ohne Grafik.

### U5-3. Was geladen wird, und was nicht

Nicht die Dateien aus `assets/figuren/`. Die sind auf 1024 hochskaliert, damit man
sie ansehen kann, und wiegen als Satz 3.091 KB. Geladen wird die echte
128er-Rechnung aus `assets/portraets/`, erzeugt mit `python3 tools/figuren-px.py
--tafel`: derselbe Bildinhalt, dieselbe Palette, 65,4 KB für dreizehn Dateien.

Gemessen, nicht geschätzt:

| | roh | als data:-URI |
|---|---|---|
| alle 19 als 1024er + Originale (`assets/figuren/`) | 3.091 KB | 4.124 KB |
| alle 19 als echte 128er | 96,8 KB | 129,1 KB |
| **die 13, die geladen werden** | **65,4 KB** | **87,9 KB** |

`dist/index.html` wächst dadurch von 2.127 KB auf 2.215 KB, also um 4,1 Prozent.
`assets/figuren` bleibt in `SKIP_DIRS`; `assets/portraets` steht nicht darin und
wird eingebacken, ohne dass jemand die Liste pflegen muss.

Die Blätter sind mit `optional:true` angemeldet. Eine fehlende Datei ist damit
keine Konsolenwarnung, sondern der Rückfallweg — dieselbe Regel wie bei den fünf
Pack-Blättern, die nie geliefert wurden.

### U5-4. Der Schlüssel ist der Figurenschlüssel

Die Datei heißt `zwirn.png` und nicht `02-zwirn.png`. Die Prompt-Nummer ordnet
Bild und Prompt einander zu und ist in `assets/figuren/` genau richtig; hier zählt
die Zuordnung zu `DORF_FIGUREN`, denn über `n.figur.key` wird gesucht. Eine
Zwischentabelle Nummer→Schlüssel wäre eine dritte Stelle, an der etwas
auseinanderlaufen kann.

Knöterich steht dabei, obwohl er nicht im Dorf steht: er führt den Empfang und
damit die Tafel (`szeneSprecherKnoeterich`).

## Entscheidungen, die anders hätten ausfallen können

**Der Spieler behält unten den Sprite-Ausschnitt.** Das ist der sichtbarste
Bruch: oben ein gemaltes Gesicht, unten eine 22x27-Figur in vierfachen Blöcken.
Es gibt trotzdem kein Bild, das dort hingehörte. Porträt 19 („Der Außendienst")
ist bewusst nie gelaufen, und es könnte auch nicht laufen: Frisur, Haarfarbe und
angelegte Rüstung wechseln mit der Schicht, und genau das zeigt das Sprite-Bild
von selbst (derselbe Weg wie das Lichtbild im Dienstausweis seit P1). Ein
gemaltes Standbild wäre falsch, sobald der Spieler etwas anlegt.

Am Bildschirm nachgesehen und für tragbar befunden: die beiden Bilder sind
verschieden groß, verschieden fein und stehen in verschiedenen Hälften. Sie lesen
sich als „wer redet" und „wer zuhört", nicht als zwei Versuche derselben Sache.

**Lott und Pahl bleiben auf dem Sprite-Ausschnitt.** Ihr Motiv (11) ist ein
Doppelporträt; jedes der beiden Gesichter füllt die halbe Breite bei voller Höhe.
Ein Zuschnitt auf 104x128 — das wäre das Verhältnis des alten Feldes — zöge dem
jeweils anderen die Haare mit ins Bild, und im Quadrat ginge es gar nicht. Sie
sind damit zugleich der laufende Beleg, dass der Rückfallweg trägt.

Wer das ändern will, lässt Prompt 11 als zwei Einzelporträts nachlaufen und trägt
sie in `TAFEL` in `tools/figuren-px.py` und in `PORTRAET_FIGUREN` ein. Zwei
Zeilen, zwei Dateien, kein Code.

**Keine Tönung auf dem gemalten Bild.** Nörgels grüner Anstrich (`tint`) färbt in
der Welt ein Pack-Blatt ein, das ihm nicht gehört. Sein Porträt ist von vornherein
er selbst; dieselbe Farbe ein zweites Mal darüberzulegen wäre kein Kanon, sondern
ein doppelter Auftrag. In der Welt bleibt er grün, das ist unverändert.

**Kein neuer Ordner unter `assets/cf/`.** Die Notiz in `assets/figuren/README.md`
schlug das als einen von zwei Wegen vor. Er funktioniert nicht: `pages.yml` macht
vor dem Build `rm -rf assets/cf` und ersetzt den Ordner vollständig durch den Klon
des privaten Assets-Repos. Was dort läge, wäre im ausgelieferten Spiel weg — und
committen ließe es sich ohnehin nicht, `assets/cf/*` steht in der `.gitignore`.
Ein eigener Ordner umgeht beides; die Porträts sind selbst erzeugt und haben mit
der Kenmi-Lizenz nichts zu tun.

**Die vier übrigen Motive bleiben draußen.** Sturz, Nachtrag, Konrad und Anlage 3
haben in der Tafel keinen Sprechplatz — `wer:` gibt es in `SZENEN` nur für `fass`
und `umlauf`, alles andere über ihnen ist Aktentext. Die Kaisertür ist kein
Gesicht. Sie kämen als Ballast in den Build und bleiben in `assets/figuren/`, bis
es eine Szene gibt, die sie sprechen lässt.

## Was ausdrücklich nicht geändert wurde

- **Kein Satz, keine Antwort, kein Knoten.** `DORF_FIGUREN`, `SZENEN` und der
  Empfang sind unberührt.
- **Keine Bedienung.** Maus, Ziffern, Pfeile, `F`, Esc, Klick daneben, Weggehen.
- **Die untere Hälfte.** `gespraechIchPortrait()` steht Zeichen für Zeichen wie
  nach U4, samt `ICH_PORTRAET_SC = 4` und dem Wegfall auf dem Telefon.
- **Die Welt.** `drawNpc`, `tintedSheet` und die Namensschilder lesen dieselben
  Blätter wie vorher; die Porträtblätter zeichnet nur die Tafel.

## Die Guards

`gespraechAssert()` bekommt die Namenshälfte: gehört jeder Schlüssel aus
`PORTRAET_FIGUREN` zu einer Figur, die auch spricht? Ein Tippfehler dort bliebe
sonst stumm — die Figur bekäme wortlos den Sprite-Ausschnitt, und die Datei läge
ungenutzt im Build. Er meldet zusätzlich, wer ohne gemaltes Bild bleibt.

`portraetAssert()` ist neu und läuft **nach** `loadAssets()`, neben
`dorfSichtAssert()` und aus demselben Grund: vorher gibt es keine Bilddatei zu
messen. Er prüft drei Dinge, und alle drei sind Fehler, die man im Bild nicht
sieht:

1. Jedes angemeldete Porträt ist wirklich geladen (sonst zeichnet die Tafel
   stillschweigend den Ausschnitt, und niemand merkt, dass ein Bild fehlt).
2. Es ist quadratisch (im quadratischen Feld würde es sonst verzerrt).
3. Es ist die 128er- und nicht die 1024er-Fassung. Die sähe identisch aus und
   wöge das Zwanzigfache.

## Abnahme

Im Browser mit offener Konsole, mit danebengelegter Grafik aus dem Assets-Repo.

```
U3 Gespräch: 14 Namensschilder, je vier Antworten und zwei Tafelhälften in Ordnung.
U5 Porträts: 13 gemalte Bilder zugeordnet, Sprite-Ausschnitt für lott und pahl.
…
G6 Dorfsicht: 14 Dorffiguren haben ein Blatt und stehen im Bild.
U5 Porträts: 13 gemalte Bilder geladen, quadratisch und im 128er-Raster.
```

Sonst steht nichts in der Konsole, kein `pageerror`, keine „Sprite fehlt"-Warnung.

Angesehen wurden vier Fälle: der Empfang (Knöterich, gemalt), eine Dorffigur
(Zwirn, gemalt), eine getönte (Nörgel, gemalt und ungetönt) und der Rückfallweg
(Lott, Ausschnitt). Dazu die Tafel auf 390px Breite: quadratisches Feld, Bild
drin, zweites Porträt weiterhin weg.

Die Prüfläufe, ohne Abweichung:

- `tools/gespraech-pruef.mjs` — **60 von 60** (54 vorher, sechs neu: Feld
  quadratisch, Leinwand 128x128, Zwirn zeigt sein gemaltes Bild, das Bild füllt
  das Feld, Lott bekommt den Ausschnitt, und der zeigt trotzdem etwas). Die
  neuen Zeilen unterscheiden die beiden Wege an der linken oberen Bildecke: das
  gemalte Bild deckt sie, der mittig stehende Ausschnitt lässt sie frei.
- `tools/empfang-pruef.mjs` — **59 von 59**
- `tools/menue-pruef.mjs` — **39 von 39**
- `tools/szene-pruef.mjs` — **32 von 32**
- `tools/reich-pruef.mjs` — **35 von 35**
- `node tools/build-single.mjs`, Ergebnis per `file://` geladen: dieselben
  Meldungen, keine zusätzlichen, das gemalte Bild steht auch dort.

## Was offen bleibt

- **Lott und Pahl.** Prompt 11 als zwei Einzelporträts. Danach zwei Zeilen.
- **Ein Ausdruck im Porträt.** Alle Bilder sind Standbilder. Ein zweites Motiv je
  Figur (reden, ärgern) wäre ein Bilderlauf und kein Bauabschnitt.
- **Sturz, Nachtrag, Konrad, Anlage 3.** Sie haben Bilder und keine Bühne. Wer
  ihnen eine Szene mit `wer:` gibt, holt ihr Porträt mit zwei Zeilen dazu.
- **Der Hintergrund streut.** Die Motive haben unterschiedlich dunkle Gründe
  (`assets/figuren/README.md`, „Der Hintergrund streut"). Im Feld nebeneinander
  fällt das kaum auf, weil man immer nur eines sieht; vereinheitlichen ließe es
  sich in `tools/figuren-px.py`, wenn es je stört.
