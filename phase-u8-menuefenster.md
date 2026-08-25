## U8: Die zweite Schicht der Oberfläche — die Menüfenster

U7 hat die Oberfläche in zwei Teile geteilt und den ersten gebaut: **die Schicht, die während des
Spiels dasteht** — Zustand oben links, Karte oben rechts, Daumenring unten links, Fächer unten
rechts. Der letzte Absatz dort nannte den zweiten Teil beim Namen: „danach die Menüs (Rucksack,
Befähigung, Zauber, Kessel, Sammelkarten, Optionen)". Das ist dieser Abschnitt.

Der Wunsch dazu war wörtlich:

> Können wir die Menüs ebenfalls überarbeiten? Sie dürfen gerne nahezu oder Bildschirmfüllend sein.
> Am liebsten hätte ich ein Charakterfenster für stats und Ausrüstung und dort findet man auch die
> spielKarten Mappe. Zauber bleiben extra. Kochen bleibt im Rucksack bekommt aber ein größeres
> Fenster mit mehr Übersicht.

Vier Aufträge, und alle vier sind hier ausgeführt. Was **nicht** angefasst ist: kein Kampfwert, kein
Katalog, keine Weltdatei, kein Rezept, keine Zulagentabelle. U8 ändert, **wo** etwas steht und **wie
groß** es ist. Der Inhalt des Kochens und des Rucksacks wird ausdrücklich später überarbeitet
(„Das kochen wird nachher noch überarbeitet. Der Rucksackmenü ebenso.").

---

### Der Vorzustand: acht Kästen neben dem Spiel

Vor U8 gab es acht Panels, und sie hatten dieselbe Rezeptur in acht Kopien —
`rgba(20,14,24,.96)`, `3px #8a6d3b`, Radius 10, Polsterung 14 — aber jedes seine eigene Ecke und
seine eigene Breite:

| Panel | Lage | Breite |
|---|---|---|
| `#inv` Inventar und Befähigung | rechts, mittig | 360 |
| `#spellTree` Zauberbaum | links, mittig | 420 |
| `#zulagen` Zulagen | mittig | 680 |
| `#kessel` Kessel und Kladde | mittig | 420 |
| `#fullmap` Karte | mittig | 560 |
| `#ausweis` Dienstausweis | mittig | 340 |
| `#schloss` Symbolschloss | mittig | 320 |
| `#amtFenster` Amtsstube | mittig | 320 |

Das war für einen Rucksack mit vierundzwanzig Fächern, einen Zauberbaum mit drei Zweigen und eine
Sammlung von fünfundvierzig Karten zu wenig. Auf dem Telefon kam die Knopfspalte aus U7 dazu und
nahm noch einmal 74 Pixel: auf einem 390 Pixel breiten Gerät blieben dem Inventar **300**.

Dazu kam ein Ordnungsproblem, das keine Größenfrage ist: **die Befähigung stand im Rucksack**.
Kraft, Zähigkeit, Behändigkeit und Amtskunde sind keine Gegenstände, die man mitnimmt, und die
Ausrüstungsplätze auch nicht. Der Dienstausweis stand ebenfalls dort, und die Sammelkarten in einem
eigenen Fenster, das mit keinem anderen etwas zu tun hatte.

---

### Befund 1: „nahezu oder bildschirmfüllend" ist eine Frage an U1, nicht an das Layout

Der Wunsch erlaubte ausdrücklich beides. Es ist trotzdem keine Geschmacksfrage, welches davon geht,
denn U1 hat drei Zusagen gemacht, die schriftlich im Quelltext stehen:

1. **Ein offenes Menü nimmt den Kampf nicht weg.** „Q bleibt der Trank, WASD bleibt das Gehen,
   Leertaste bleibt der Schlag."
2. **Der Gürtel behält seine Wirkung.** Deshalb ist der Schleier `pointer-events:none` und
   deshalb wurde ein modaler Vorhang damals ausdrücklich verworfen.
3. **Ein Griff neben das Fenster wischt es weg**, ohne einen Schlag auszulösen.

Ein wirklich bildschirmfüllendes Fenster kassiert alle drei auf einmal: es deckt den Gürtel zu, es
deckt den Daumenfächer zu, und ein „daneben" gibt es dann nicht mehr.

**Eingriff.** Bildschirmfüllend bis auf genau die Streifen, in denen die Bedienschicht liegt, und
keinen Pixel weiter. Die vier Kanten stehen als CSS-Variablen bei `.grossFenster` und sind aus dem
U7-Raster **gerechnet**, nicht geschätzt:

| | oben | unten | links | rechts |
|---|---|---|---|---|
| Schirm | `--spalteY` (136) | 78 | ≥ Rand + `--mapH` + 10 | dito |
| Finger, stehend | `--karteY + --karteH + 8` (86) | 285 | `--railW + 8` (82) | 8 |
| Finger, liegend | 78 | 10 | 280 | 246 |

Auf 1280×800 sind das **992 × 586** statt 360 × 680; auf einem stehenden Telefon **300 × 483**
statt derselben 300 mit weniger Höhe. Und weil die Zahlen aus dem Raster kommen, wandern die
Fensterkanten mit, sobald eine Bruchstelle die Statuskarte oder die Knopfspalte ändert.

Die 285 unten am Finger sind keine neue Zahl: die Mobil-Regeln rechneten seit U1 mit `100dvh - 349`
ab einer Oberkante von 64. 349 − 64 = 285. Der Fächer bekommt exakt denselben Streifen wie vorher.

Die Oberkante auf dem Schirm war im ersten Wurf `--karteY + --karteH + 8` = 102 und lag damit
**mitten in der Ortszeile** („Vordermühl an der Ablage", `--reiheY` = 102). Ein Fenster, das einer
Zeile das letzte Drittel abschneidet, sieht nach Unfall aus. `--spalteY` kostet 34 Pixel Höhe und
ist es wert. Am Finger darf sie zugedeckt werden — dort war sie es vor U8 auch, die Panels
begannen bei 64.

---

### Befund 2: der Weg von einem Menü zum anderen war „zumachen, aufmachen"

Jedes Fenster war eine Insel: eigener Gürtelknopf, eigene Taste, eigene Ecke. Wer im Rucksack stand
und in den Zauberbaum wollte, musste das eine schließen und den zweiten Knopf suchen. U7 hat das
gesehen und in Aussicht gestellt: „der Abschnitt für die Menüfenster wird die Spalte in ein
richtiges Reiterband verwandeln".

**Eingriff.** Ein **Reiterband** im Kopf jedes Großfensters, vier Reiter, ein Griff wechselt:

```
🧍 Charakter   🎒 Rucksack   🍲 Kochen   ✨ Zauber
```

Der Kessel steht **neben** dem Rucksack, weil er zum Rucksack gehört und aus ihm aufgemacht wird —
sein Knopf bleibt dort, wo er war. Die Reihenfolge ist die des Gürtels und umgekehrt.

Das Band steht nicht viermal im HTML, sondern einmal als Tabelle im Skript (`GROSSFENSTER`);
`gfBandZeichnen()` schreibt es, `grossfensterRaeumen()` liest dieselbe Tabelle. Das ist dasselbe
Verfahren wie `PANEL_REGISTER` in U1 und aus demselben Grund: dieselbe Liste dreimal von Hand ist
zweimal falsch.

Die Sternchen wandern mit ins Band. Sie saßen am Gürtelknopf und sagten dort „hier wartet etwas";
im Band sagen sie dasselbe an der Stelle, an der man ohnehin hinsieht, wenn ein Fenster offen ist.

**Was das kostet, und es wird hier ausdrücklich genannt: zwei Großfenster können nicht mehr
gleichzeitig offen stehen.** Vor U8 konnten Inventar (rechts) und Zauberbaum (links) nebeneinander
stehen, und `panelsWegklicken()` räumte beide. Seit U8 liegen sie an derselben Stelle; übereinander
wären sie kein Stapel, sondern ein Fenster, das aussieht wie ein anderes. Der Gürtelknopf
**wechselt** deshalb, statt ein zweites danebenzustellen — und `tools/menue-pruef.mjs` prüft das
jetzt mit derselben Strenge, mit der es vorher das Nebeneinander geprüft hat. Ein Großfenster und
ein kleines Panel (Symbolschloss, Ausweis, Karte, Amtsstube) gehen weiter übereinander, und dafür
gilt die Esc-Regel unverändert: eine Ebene je Druck, in der Reihenfolge des Registers.

---

### Befund 3: die Befähigung lag im Rucksack

Was am Träger hängt, stand im Beutel: Kraft, Zähigkeit, Behändigkeit, Amtskunde, die abgeleiteten
Werte, die vier Ausrüstungsplätze und der Dienstausweis. Die Sammelkarten hatten dagegen ein
eigenes Fenster, das mit nichts zusammenhing.

**Eingriff.** Ein **Charakterfenster** (Taste `C`, Gürtelknopf 🧍) mit zwei Blättern:

| Blatt | Inhalt |
|---|---|
| **Werte & Ausrüstung** | Lichtbild, Amtsbezeichnung, Dienstverhältnis, Stufe, Schicht, Knopf zum Dienstausweis · Befähigung mit den vier Punkten · abgeleitete Werte · die vier Ausrüstungsplätze |
| **Kartenmappe** | Ziehung, belegte Fächer, Kartei — die drei Kästen aus `#zulagen`, Wort für Wort |

Zwei Blätter und nicht eine lange Seite, weil die Mappe die ganze Breite braucht: die Ziehung legt
drei Karten nebeneinander aus, und die Kartei wächst über die Schicht auf bis zu fünfundvierzig.
In einer Spalte von 264 Pixeln wären beide Listen.

Das Lichtbild ist **kein neues Bild**: es ist derselbe Ausschnitt aus dem gebackenen Heldenblatt,
den der Dienstausweis seit P1 zeigt. `renderAusweisFoto()` hat dafür ein Argument bekommen (den
Feldnamen) statt einer zweiten Kopie seiner sechs Zeilen — es trägt Haarton, Frisur und
Rüstungsstufe der laufenden Schicht damit von selbst.

Die Kartenmappe hat **keine Zeile Renderlogik verloren**. `renderZulagen()` schreibt weiter in
`#zulZiehung`, `#zulMappe` und `#zulKartei`; die liegen nur nicht mehr in einem eigenen Fenster,
sondern auf dem zweiten Blatt. Was weggefallen ist, ist der zweite Zustand: `zulagenOpen` gibt es
nicht mehr, `zulagenOffen()` beantwortet dieselbe Frage aus `charakterOpen` und `charBlatt`. Zwei
Zustände nebeneinander sind genau der Kopierfehler, den U1 an den drei Aufräum-Listen aufgeräumt
hat.

`toggleZulagen()` bleibt stehen und heißt weiter so — die Taste `Z`, das Sternchen und die
Prüfläufe kennen sie. Sie schlägt nur ein Blatt auf statt ein Fenster.

Der **Gürtelknopf merkt sich das Blatt**: wer seine Sammlung durchsieht, macht das nicht in einem
Zug, und ein Fenster, das bei jedem Öffnen auf Seite eins zurückspringt, lässt ihn jedes Mal neu
blättern. `Z` führt ohnehin immer direkt auf die Mappe.

Aus `#zulagenBtn` wird `#charBtn`. Ein eigener Knopf für **eines von zwei Blättern** wäre ein
vierter Knopf für dasselbe Fenster gewesen; die Zahl der Menüzugänge in der Spalte bleibt
dieselbe (drei), und beide Sternchen — freie Punkte (gold), offene Vorlage (blau) — sitzen jetzt
dort, weil beide im Charakterfenster warten.

---

### Befund 4: der Rucksack war ein Stapel aus fünf Dingen

Kesselknopf, Ausweisknopf, Befähigung, Werte, Ausrüstung, Tasche, Zutaten, Ton, Schrift,
Spielstand — untereinander, in 360 Pixeln.

**Eingriff.** Der Rucksack trägt nur noch, was in ihm liegt, und zwar in Kacheln nebeneinander:

- **🎒 Tasche** — vierundzwanzig Fächer als **acht mal drei**. Das geht ohne Rest auf, und eine
  Tasche muss wie eine Tasche aussehen und nicht wie eine Zeile; ohne Deckel wären es in einem
  tausend Pixel breiten Fenster siebzehn Felder in einer Reihe. Darüber die Zahl der belegten
  Fächer, die vorher nirgends stand.
- **🧺 Zutaten** — größere Kacheln, gleiches Verhalten (antippen legt in den Kessel).
- **🍲 Verarbeitung** — der Kesselknopf, mit dem Satz, der sagt, wofür er da ist.
- **🎵 Ton / 🔠 Schrift / 💾 Spielstand** — unverändert, aber als eigene Kachel statt als Anhängsel
  unter dem Beutel. Sie bleiben ausdrücklich im Rucksack: der Wunsch hat sie nicht genannt, und ein
  eigener Abschnitt für die Optionen wird sie vermutlich ganz herausholen.

Der Ausweisknopf ist ins Charakterfenster gezogen, wo der Ausweis hingehört.

---

### Befund 5: der Zutatenbeutel stand unter dem Kessel

Wer eine Zutat suchte, rollte an den drei Plätzen vorbei, die er gerade füllen wollte. Das war der
ganze Inhalt des Wunsches „mehr Übersicht".

**Eingriff.** Der Kessel bekommt den Kasten der anderen und zwei Spalten statt einer: links der
Kessel (drei Plätze, jetzt 96 statt 64 Pixel hoch, mit Zutatennamen, die lesbar sind), rechts der
Beutel samt Stückzahl. Beides zugleich im Bild. Die drei Reiter (Kochen, Kladde, Akten) sind
`.gfBlatt` geworden — dieselbe Form wie die zwei Blätter des Charakterfensters, weil es dasselbe
ist: Seiten in einem Fenster. Die eigene `.kTab`-Rezeptur fällt damit weg; sie war das Vorbild für
`.gfBlatt`.

Der Kessel bleibt ausdrücklich **sein eigenes Fenster** mit eigener Taste (`K`), eigenem Zustand
und eigenem Platz im Register. „Kochen bleibt im Rucksack" heißt: er wird von dort aufgemacht, und
das tut er weiterhin.

---

### Befund 6: eine Medienregel weiß nichts über die Breite eines Fensters

Beim ersten Durchgang lief auf einem **liegenden** Telefon (844×390) der Zutatenbeutel halb neben
dem Fenster. Der Grund ist lehrreich genug für eine eigene Zeile: `#kesselPane` stand auf
`grid-template-columns: minmax(280px,400px) minmax(280px,1fr)` mit einer Rückfallregel unter
`@media (max-width: 780px)`. Der **Schirm** ist dort 844 Pixel breit, die Regel greift also nicht —
das **Fenster** ist 318 Pixel breit, und zwei Spalten zu mindestens 280 passen darin nicht.

Dasselbe passierte an zweiter Stelle: `.gfSpalten` hatte eine Kachel mit `grid-column: span 2`
für Tasche und Beutel. Fällt das Raster auf **eine** Spalte zusammen, legt `span 2` eine zweite
an, die es nicht gibt, und die Kachel läuft seitlich aus dem Fenster.

**Eingriff.** Zwei Regeln, die beide nicht auf die Schirmbreite hören:

- `minmax(min(100%, X), 1fr)` statt `minmax(X, 1fr)`. Ist der **Behälter** schmaler als X, wird die
  Spalte so breit wie der Behälter, und es bleibt bei einer.
- `grid-column: 1 / -1` statt `span 2`. „Bis zur letzten Linie" ist auch bei einer einzigen Spalte
  richtig.

Die Medienregeln bleiben daneben stehen, aber nur noch für das, was wirklich am Schirm hängt: die
Reiter geben ihr Wort ab und tragen nur das Sinnbild, sobald es schmal (`max-width: 620px`) **oder
flach** (`max-height: 560px`) wird. Die zweite Bedingung ist die für das liegende Telefon: dort ist
nicht die Breite knapp, sondern die Höhe, und ein Kopf aus zwei Reiterzeilen und zwei Blattzeilen
fräße das ganze Fenster.

Für das liegende Telefon steht die Rechnung ausgeschrieben im Quelltext: links die umbrechende
Knopfspalte (bis zu vier kurze Spalten, 256) und darunter der Daumenring (bis 136) — 280 lässt
beide frei; rechts der Fächer (230) plus Luft — 246. Bleiben rund **318 × 300**. Das ist wenig und
es ist ehrlich: mehr gibt ein liegendes Telefon nicht her, ohne eine der drei Zusagen aus U1 zu
brechen.

---

### Keine neue Grafikdatei

Der Pixelrahmen ist der aus G5, die Zellen sind die vier aus U2, der Schließknopf trägt `.panelZu`
und erbt Rundknopf, Hover und die `cfuiX`-Zelle. `bakeUiSkin()` hat genau eine Zeile geändert:
`'#zulagen'` heißt jetzt `'#charakter'`. Was hier neu gezeichnet wird, zeichnet CSS.

---

### Was gemessen wurde

Alle Läufe gegen `python3 serve.py` auf `index.html`, Chromium über Playwright.

| Lauf | vorher | nachher |
|---|---|---|
| `tools/menue-pruef.mjs` | 39 von 39 | **68 von 68** (neunundzwanzig Prüfungen dazu, s. u.) |
| `tools/zulagen-pruef.mjs` | 45 von 45 | **50 von 50** (fünf dazu) |
| `tools/steuerung-pruef.mjs` | alles in Ordnung | **alles in Ordnung** (`#zulagenBtn` → `#charBtn`) |
| `tools/gespraech-pruef.mjs` | 87 von 89 | **87 von 89** — dieselben zwei offenen Zeilen wie auf dem Branch-Punkt, sie hängen am fehlenden Grafikpaket |
| `tools/speicher-pruef.mjs` | 34 von 34 | **34 von 34** |

`tools/menue-pruef.mjs` musste dabei selbst nachgezogen werden, und zwar an drei Stellen — jede
davon steht als Absatz im Kopf des Laufs:

1. **„daneben" liegt woanders.** Die alten Klickpunkte (300/400, 660/400, 160/300) liegen seit U8
   mitten im Fenster. Der neue Punkt wird nicht geraten, sondern aus der linken Fensterkante
   gelesen — sonst wandert er beim nächsten Maß mit und niemand merkt es.
2. **Zwei Großfenster gehen nicht mehr übereinander.** Aus „Gürtelknopf lässt das Inventar offen"
   wird „und räumt dabei den Rucksack weg", aus „Klick zwischen zwei Panels räumt beide" wird der
   Klick daneben auf das gewechselte Fenster. Die Esc-Kette wird mit Rucksack **plus Symbolschloss**
   geprüft statt mit zwei Großfenstern.
3. **Gerollt wird das Rollfeld.** Aus „Inventar ist überhaupt scrollbar" werden vier Zeilen: das
   Rollfeld rollt, das Fenster selbst rollt nicht, der Schließknopf bleibt im Bild, und das
   Reiterband bleibt beim Scrollen stehen.

Neu geprüft wird außerdem: vier Reiter im Band, der Reiter führt ins Charakterfenster, von dort in
den Kessel, immer nur ein Großfenster, der Wechsel löst keinen Schlag aus, und am Finger liegt die
Knopfspalte nachweislich neben dem Fenster (`spellsBtn.right <= fenster.left`).

Und ein ganzer neuer Abschnitt: **kein Querlauf**. Zwanzig Prüfungen über vier Formate
(390×844, 360×640, 844×390, 1440×900) mal vier Fenster plus das zweite Blatt, jedes mit
**gefüllten** Rastern — ein leeres Raster läuft nirgends über. Gemessen wird viererlei: das
Rollfeld rollt nicht seitlich, kein Kind steht rechts über der Fensterkante, das Fenster selbst
steht im Bild, und die Seite bekommt keinen waagerechten Balken. Genau diese zwanzig Zeilen haben
die beiden Befunde aus dem vorigen Abschnitt gefunden, nachdem das Auge auf dem Entwicklungsschirm
sie durchgewinkt hatte.

`tools/zulagen-pruef.mjs` prüft jetzt die Mappe als Blatt: Taste `Z` öffnet sie **im
Charakterfenster**, der Gürtelknopf schlägt das zuletzt benutzte Blatt auf, das erste Blatt zeigt
die Mappe nicht und dafür die vier Ausrüstungsplätze, das zweite führt zurück.

Von Hand geprüft, weil ein Lauf keine Optik beurteilt: die vier Fenster auf 1440×900, 390×844 und
844×390; das Reiterband einzeilig in jedem Format; die Ortszeile auf dem Schirm unangeschnitten;
kein waagerechter Überlauf in irgendeinem der drei Formate.

Der Einzeldatei-Build läuft unverändert durch (`node tools/build-single.mjs`, 1285 KB Quelle →
3203 KB Ergebnis, 59 eingebettete Dateien).

---

### Was ausdrücklich offen bleibt

- **Der Inhalt des Kochens.** Der Wunsch sagt es selbst: „Das kochen wird nachher noch
  überarbeitet." U8 gibt ihm den Kasten und die zweite Spalte, sonst nichts.
- **Der Inhalt des Rucksacks.** Dito. Die Kacheln stehen, was in ihnen steht, ist der alte Bestand.
- **Ein eigener Abschnitt für die Optionen.** Ton, Schrift, Spielstand und die Zielwahl aus U7
  gehören dorthin. Solange es ihn nicht gibt, stehen sie da, wo sie schon standen.
- **Das Charakterfenster füllt seine Höhe nicht.** Vier Kacheln auf einem 586 Pixel hohen Blatt
  lassen unten Luft. Das ist der ehrliche Zustand: mehr Werte hat die Figur nicht, und ein
  Fenster, das je Blatt seine Größe ändert, wäre schlechter als eines mit Luft.
