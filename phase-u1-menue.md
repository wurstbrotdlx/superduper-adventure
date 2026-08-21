## U1: Neben das Menü klicken — ERLEDIGT

Zwei Wünsche in einem Satz: die Menüs sollen hübscher werden, und wer daneben klickt oder
tippt, soll sie los sein. Der zweite ist der wichtigere, weil dahinter ein Fehler steckte,
den man für eine Eigenart halten konnte.

Diese Phase fasst keine Kampfwerte an, keinen Katalog, keine Weltdaten. Sie fasst genau drei
Dinge an: die sieben Panel-Regeln im `<style>`, die sieben Panel-Schalter im Skript, und
einen neuen Lauscher am `window`.

---

### Befund 1: neben ein offenes Panel zu klicken war ein Schlag ins Leere, aber ein Schlag

Die sieben Panels sind HTML-Elemente über dem Canvas, nicht Bilder im Canvas:

| Panel | Element | z-index | öffnet über |
|---|---|---|---|
| Inventar & Befähigung | `#inv` | 20 | Gürtel, `I` |
| Zauberbaum | `#spellTree` | 20 | Gürtel, `T` |
| Kessel & Kladde | `#kessel` | 21 | Inventar, `K` |
| Dienstausweis | `#ausweis` | 21 | Inventar |
| Vollbildkarte | `#fullmap` | 21 | Minikarte, `L` |
| Symbolschloss | `#schloss` | 22 | Kammermodul |
| Amtsstube | `#amtFenster` | 22 | `F` am Amt |

Der Angriff hängt an `canvas.mousedown` und `canvas.touchstart`. Ein offenes Panel liegt nur
*darüber*: alles daneben ist weiterhin nacktes Canvas. Wer also mit offenem Inventar irgendwo
ins Bild klickte, um das Inventar loszuwerden, führte einen Angriff aus und hatte das
Inventar danach immer noch offen. Auf dem Handy dasselbe mit dem Daumen, dort startete der
Tipp zusätzlich den Joystick, wenn er in der linken Bildhälfte landete.

Der Weg hinaus war das ✖ oder `Esc` — beides vorhanden, beides dokumentiert, beides nicht
das, was man als erstes versucht.

**Eingriff.** Ein Lauscher am `window` in der **Einfangphase** (`capture:true`). Er läuft vor
den Canvas-Lauschern; `stopPropagation()` schneidet sie dann ab. Damit fallen beide Hälften
des Wunsches in einem Griff zusammen: das Panel geht zu, und der Griff, der es weggewischt
hat, wird nicht zusätzlich als Angriff gewertet.

```
window → (capture) unser Lauscher → … → canvas → (bubble) tryAttack
                   ↑ hier abgeschnitten
```

**Kein modaler Vorhang**, obwohl der billiger wäre. Die Mobile-Breakpoints verankern `#inv`
und `#spellTree` bewusst oben und lassen unten 349px frei, damit Angriff, Zauber, Trank und
Ultimate mit offenem Panel erreichbar bleiben (`max-height: max(240px, calc(100dvh - 349px))`,
seit dem mobilen Umbau kalibriert). Ein klickfangendes Element über dem ganzen Bild hätte
genau das kassiert. Entschieden wird deshalb am **Ziel** des Ereignisses, nicht an einer
Fläche:

```js
const UI_INSELN = '#hud, #touchCluster, #minimap, #overlay, #menuVeil, ' + …Panel-IDs
```

Alles, was nicht in einer dieser Inseln liegt, ist „daneben". `#zone`, `#knZettel`,
`#knRandnotiz` und `#tooltip` stehen ohnehin auf `pointer-events:none`, ihre Klicks landen von
selbst am Canvas. Abgeschnitten wird nur, was wirklich das Canvas trifft — nur dort gibt es
einen Angriff abzufangen.

**Es schließen alle offenen Panels, nicht nur das oberste.** `Esc` geht eine Ebene zurück,
das ist seine dokumentierte Aufgabe und bleibt unverändert. Ein Griff *neben* die Menüs ist
keine Ebene, sondern ein Wegwischen. `#inv` (rechts) und `#spellTree` (links) können
gleichzeitig offen stehen; ein Klick in die Mitte liegt dann neben beiden, und beide einzeln
wegklicken zu müssen wäre die Wiederholung desselben Missverständnisses.

**`e.cancelable` wird geprüft.** Läuft gerade ein Scroll, liefert der Browser ein nicht
stornierbares `touchstart`, und `preventDefault()` darauf schreibt eine Zeile in die Konsole.
Eine Konsole, in der dauerhaft etwas steht, ist keine Konsole mehr — dieselbe Regel, an der
G6 hing. `stopPropagation()` greift auch dort und hält den Angriff zurück.

### Befund 2: dieselbe Panel-Liste stand viermal in der Datei

`Esc`, `respawnPlayer()`, `startShift()` und `endShift()` trugen jede ihre eigene, dazu
unterschiedlich vollständige Kopie derselben Zeilen: `respawnPlayer()` räumt drei der sieben
Panels, `endShift()` vier, `startShift()` sechs. U1 legt das Verzeichnis einmal an:

```js
const PANEL_REGISTER = [
  {id:'inv', offen:() => invOpen, zu:() => toggleInventory()},
  …
];
```

Die Zustände werden über Funktionen gelesen, nicht eingesammelt: `invOpen` & Co. sind
Bindungen, die die Schalter umsetzen, kein Wert, den man festhalten könnte. Die vier
bestehenden Kopien sind **absichtlich stehen geblieben** — sie in einen Durchlauf umzubauen
wäre ein Eingriff in den Schichtwechsel, und der ist nicht das Thema dieser Phase. Wer sie
später zusammenlegt, hat jetzt die Liste dafür.

---

### Befund 3: die Menüs waren fertig, aber nackt

Die sieben Panels tragen seit jeher dieselbe Rezeptur in sieben Kopien
(`rgba(20,14,24,.96)`, `3px #8a6d3b`, `radius 10`, `padding 14`), darüber legt `bakeUiSkin()`
seit G5 den Pixelrahmen aus `UI_Frames.png`. Zwischen Rahmen und Inhalt lag nichts.

**Was dazugekommen ist, ohne eine einzige neue Grafikdatei:**

| | Vorher | Jetzt |
|---|---|---|
| Kopfband | `h2` im Fluss, scrollte mit dem Inhalt aus dem Bild | eigenes Band über die volle Panelbreite, `position:sticky` |
| Schließknopf | 20px-Satzzeichen | 28px-Rundknopf aus `round_brown.png` (44px auf Touch) |
| Grund | ein Flachton | zwei Verläufe, oben wärmer |
| Hintergrund | die Karte in voller Helligkeit | Schleier, `pointer-events:none` |
| Felder | flaches `#141009` | gemeinsame Wölbung, Licht oben |
| Abschnitte | vier gleich aussehende Kästen | Goldlinie unter jeder Abschnittsüberschrift |
| Rollbalken | hellgrauer Systembalken | Messing auf Schwarz |
| Einblenden | hart | 160 ms Deckkraft |

Der **Schließknopf** ist die einzige Stelle, an der U1 neue Grafik ins Menü holt, und auch
das ist keine neue Datei: `round_brown.png` ist der Rundknopf, den G5 aus `UI_Buttons.png`
geschnitten hat. Er sitzt bisher unter den Kugeln und im Daumenfächer; jetzt auch im Menü.
Die CSS-Variable ist dieselbe (`--cfui-round`, gesetzt von `bakeUiSkin()`), mit einem
Verlauf als Rückfallwert im `var()` — fehlt die lizenzierte Grafik, steht dort ein Knopf und
kein leerer Kasten.

Der **Schleier** (`#menuVeil`) liegt auf z-index 9: unter HUD (10), Dienstzettel (12) und
Panels (20+), über dem Canvas. Er verdunkelt also die Welt und nichts von der Bedienung. Er
ist ausdrücklich `pointer-events:none` — die Klick-daneben-Logik hängt am Zeigerziel, nicht an
diesem Element, und ein Klickfänger wäre wieder der Vorhang, der oben verworfen wurde.

Das **Kopfband** ist `position:sticky; top:-14px` (das negative Panel-Padding). Vier der
sieben Panels sind `overflow-y:auto`; bisher scrollte die Überschrift samt ✖ nach oben aus
dem Bild, und der Weg zurück war `Esc` oder Hochscrollen.

### Zwei Kleinigkeiten, die dabei auffielen und mitgehen

- **`#closeFullmapBtn` und das Amtsstuben-✖ fehlten in der 44px-Regel.** Vier Panels hatten
  auf Touch seit dem mobilen Umbau ein Tap-Ziel von 44px, die Vollbildkarte und die Amtsstube
  hatten 20px. `#closeSchlossBtn` stand in einer eigenen, wortgleichen Regel daneben. Alle
  drei sind jetzt in derselben Liste.
- **Die Panels lagen über dem Gürtel.** `max-height:85vh` mittig verankert reicht auf einem
  800px hohen Fenster bis y=744, der Gürtel beginnt bei 704. Bei z-index 20 gegen 10 war das
  kein Abschneiden, sondern ein Verdecken: Manakugel und Stufenanzeige lagen unter dem
  Inventar. Jetzt `max(260px, calc(100dvh - 200px))`.

### Was ausdrücklich NICHT passiert ist

Der Wunsch nannte die hochgeladenen Grafiken. **Die Rohdateien des `Cute_Fantasy_UI`-Packs
liegen weder in diesem Repo noch im Assets-Repo** — `assets/cf/ui/` enthält genau die vier
Einzelzellen, die G5 von Hand geschnitten hat (`frame_brown`, `round_brown`, `glint_strip`,
`alert`). `UI_Frames.png`, `UI_Buttons.png`, `UI_Ribbons.png`, `UI_Bars.png`, `UI_Selectors.png`
und der Rest stehen im Manifest mit Maßen, aber ohne Bilddaten.

Aus Maßen allein lassen sich keine Zellen schneiden. Welche Zelle in `UI_Ribbons.png` (304×64)
ein Kopfband ist und welche eine Schleife, steht in keiner Zahl, und dieses Repo hat seit G3
die Regel, dass Raster und Anker **gemessen** werden und nicht aus Dateinamen oder Heuristiken
geraten. U1 rät deshalb nichts und tut so, als wäre der Skin aus G5 alles, was es gibt.

**Was möglich wäre, sobald die Dateien in `assets/cf/ui/` liegen** (Aufwand je Punkt klein,
alle brauchen einen Messschritt mit `tools/sheet-audit.mjs`):

| Datei | Maße | wofür |
|---|---|---|
| `UI_Ribbons.png` | 304×64 | echtes Schriftband über dem Kopfband statt CSS-Verlauf |
| `UI_Frames.png` | 1296×336 | mehr als eine Rahmenvariante — Panels, Felder und Kammer könnten sich unterscheiden |
| `UI_Buttons.png` | 1776×528 | Gürtel- und Kesselknöpfe als echte Pixelknöpfe mit Druckzustand |
| `UI_Bars.png` | 304×128 | Leben, Mana und Erfahrung als Pack-Leisten statt CSS-Verläufe |
| `UI_Selectors.png` | 192×960 | Auswahlrahmen für den belegten Ausrüstungsplatz |
| `UI_Icons.png` | 624×256 | Sinnbilder statt Emoji in den Feldern |

Ein Hindernis steht dabei im Weg und ist in `assets/cf/README.md` schon benannt: `addSheet`s
`'grid'`-Modus kennt keinen Spaltenversatz, nur `rowStart`. Ein Ausschnitt aus der Mitte eines
Sammelblatts braucht deshalb bis heute eine eigene Datei. Die vier G5-Zellen sind genau
deshalb von Hand geschnitten. Wer den Rest des Packs erschließen will, legt sinnvollerweise
zuerst einen Zuschnitt-Modus in `addSheet` an — dann kostet jede weitere Zelle keine Datei
mehr, sondern vier Zahlen. Das ist ein eigener Bauabschnitt, kein Nebensatz in diesem.

`GRAFIK-BESTAND-2026-08-21.md` zählt das UI-Pack mit 18 Dateien und „0 geladen" und erklärt
in derselben Zeile, warum die Null falsch ist (die vier Zellen sind umbenannt, der
Namensvergleich findet sie nicht). Das bleibt der Stand.

---

## Abnahme

- Ein Klick oder Tipp neben ein offenes Panel schließt es — bei allen sieben.
- Derselbe Griff führt keinen Angriff aus und startet keinen Joystick.
- Ein Klick **in** ein Panel schließt es nicht.
- HUD, Gürtel, Minikarte und Daumenfächer behalten mit offenem Panel ihre Wirkung.
- `Esc` schließt weiterhin eine Ebene je Druck.
- Der Schließknopf bleibt beim Scrollen im Bild.
- Die Konsole ist beim Start still (die fünf `404` der fehlenden NPC-Blätter sind der
  bekannte Fehlstand aus G6, kein Fund dieser Phase).

## Prüfprotokoll

```bash
python3 serve.py &
node tools/menue-pruef.mjs
```

Der Lauf stellt fest statt zu messen: jede Zeile ist ein Soll-Ist-Vergleich, der Exit-Code
ist 1, sobald eine nicht stimmt. Angriffe werden nicht geraten, sondern gezählt — der Lauf
legt sich vor `tryAttack()`, den einzigen Weg zu einem Schlag.

Lauf vom 21.08.2026, Chromium, Desktop 1280×800 und Touch 390×844:

```
ok    Inventar offen -> Schleier an                            ist=true soll=true
ok    Klick auf die Welt schliesst das Inventar                ist=false soll=false
ok    und fuehrt dabei keinen Angriff                          ist=0 soll=0
ok    Schleier wieder aus                                      ist=false soll=false
ok    Klick ohne offenes Panel schlaegt weiter zu              ist=1 soll=1
ok    Klick INS Panel laesst es offen                          ist=true soll=true
ok    Klick ins Panel schlaegt nicht zu                        ist=0 soll=0
ok    Guertelknopf oeffnet den Zauberbaum                      ist=true soll=true
ok    Guertelknopf laesst das Inventar offen                   ist=true soll=true
ok    Klick zwischen zwei Panels raeumt beide                  ist=[false,false] soll=[false,false]
ok    und schlaegt dabei nicht zu                              ist=0 soll=0
ok    Kessel offen / Klick daneben schliesst / ohne Angriff
ok    Ausweis offen / Klick daneben schliesst / ohne Angriff
ok    Karte offen / Klick daneben schliesst / ohne Angriff
ok    Amtsstube offen / Klick daneben schliesst / ohne Angriff
ok    Symbolschloss offen / Klick daneben schliesst / ohne Angriff
ok    Esc schliesst weiterhin nur eine Ebene                   ist=[false,true] soll=[false,true]
ok    Esc schliesst dann die zweite                            ist=false soll=false
ok    Inventar ist ueberhaupt scrollbar                        ist=true soll=true
ok    Schliessknopf bleibt beim Scrollen im Bild               ist=true soll=true
ok    Konsole still (Desktop)                                  ist=[] soll=[]
ok    Tipp auf die Welt schliesst das Inventar                 ist=false soll=false
ok    und fuehrt dabei keinen Angriff                          ist=0 soll=0
ok    und startet keinen Joystick                              ist=null soll=null
ok    Angriffsknopf wirkt trotz offenem Panel                  ist=true soll=true
ok    Angriffsknopf schliesst das Panel nicht                  ist=true soll=true
ok    Guertelknopf oeffnet den Zauberbaum                      ist=true soll=true
ok    Tipp daneben raeumt beide                                ist=[false,false] soll=[false,false]
ok    Konsole still (Touch)                                    ist=[] soll=[]

39 von 39 Pruefungen bestanden.
```

(Die fünf Panel-Blöcke stehen im Lauf als je drei einzelne Zeilen; hier zusammengefasst,
damit die Tabelle lesbar bleibt.)

Dazu von Hand geprüft, weil ein Lauf keine Optik beurteilt: alle sieben Panels auf
1280×800 und 390×844 im Bild, Kopfband, Rundknopf, Schleier und Rollbalken auf beiden.
Der Einzeldatei-Build läuft unverändert durch (`node tools/build-single.mjs`, 99 Dateien,
1747 KB).

## Vierzehn Guards, und warum hier keiner dazukommt

Die selbstprüfenden Guards belegen Zahlen: Zeichendeckel, Formregeln, Kampfwerte,
Fußlinien. Was U1 ändert, ist kein Wert, sondern ein Ereignisweg — ob `stopPropagation()`
den Canvas-Lauscher wirklich abschneidet, weiß nur ein Browser mit einem echten Klick. Ein
Guard auf Skriptebene könnte hier nur behaupten. Deshalb `tools/menue-pruef.mjs` statt einer
fünfzehnten Zeile in der Startkonsole.
