# Bauabschnitt U2: Die Menüs bekommen Pack-Grafik — ERLEDIGT

U1 hat die Menüs aufgeräumt und ihnen ein Gesicht gegeben, aber mit CSS: Verläufe, die
Wölbung andeuten, ein Kopfband aus `linear-gradient`, ein Schließknopf aus einem
Satzzeichen auf einer runden Fläche. Das Phasendokument von U1 endete mit einem
Offenposten, und zwar mit einem, der nicht an Arbeit hing, sondern an Dateien:

> Die Rohdateien des `Cute_Fantasy_UI`-Packs liegen weder in diesem Repo noch im
> Assets-Repo. `UI_Ribbons.png`, `UI_Bars.png`, `UI_Selectors.png` & Co. stehen im Manifest
> mit Maßen, aber ohne Bilddaten. Aus Maßen allein lässt sich keine Zelle schneiden.

Das Pack liegt jetzt vor. U2 löst den Offenposten ein.

## Was U2 nicht ist

Kein Neuanstrich. Die Menüs sehen nach U2 aus wie nach U1, nur sind vier Stellen keine
CSS-Nachahmung von Pixelkunst mehr, sondern Pixelkunst. Wer die beiden Stände
nebeneinander legt, sieht einen Unterschied in den Feldern, im Schließknopf und in den
breiten Knöpfen — und sonst denselben Aufbau.

Das ist Absicht und der Kern der einzigen wirklichen Designentscheidung dieser Phase.

## Die Entscheidung: das Ministerium bleibt dunkel

`Cute_Fantasy_UI` ist für helle Oberflächen gezeichnet. `UI_Premade.png` enthält eine
fertige Beuteltafel: Ausrüstungsfelder, ein 5×5-Raster, eine Gürtelleiste, alles auf
sandfarbenem Grund mit dunkel abgesetzten Feldern. Es wäre naheliegend gewesen, das
Inventar darauf umzustellen. Es hätte gut ausgesehen — für ein anderes Spiel.

Das Monstralministerium ist dunkel. Der Gürtel ist dunkel, die Welt ist dunkel, die Panels
sind seit jeher `rgba(20,14,24,.96)` mit goldenem Text. Eine sandfarbene Beuteltafel
mitten darin wäre ein Fremdkörper, und die Weltbibel gewinnt bei solchen Konflikten
(README, Dokumententabelle).

**Regel für U2 und alles, was folgt:** aus dem Pack werden die *Formen* genommen, nicht die
*Flächen*. Wo eine Zelle einen hellen Grund mitbringt, fällt der Grund weg
(`border-image` ohne `fill`) und der dunkle Grund des Panels bleibt Kontrastgrund für den
hellen Text. Wo eine Zelle für sich steht — ein Knopf, ein Auswahlrahmen — darf sie hell
sein, denn das war der Gürtel schon immer.

Das ist dieselbe Entscheidung, die G5 beim Panelrahmen getroffen hat, nur ausgesprochen.

## Befund 1: eine gemessene Koordinate ist noch keine passende Zelle

Der erste Einbau nahm das Feld aus `UI_Premade.png` bei (113,33), 18×18. Die Koordinate
war richtig gemessen — Pixelsonde entlang einer Zeile und einer Spalte, Rahmenfarbe
(63,40,50) gegen Füllung (184,111,80) gegen Tafelgrund (228,166,114), Rahmen bei x=113 und
x=130, nächstes Feld bei x=136. Alles nachprüfbar, alles korrekt.

Im Spiel leuchteten daraufhin an jedem Beutelfeld vier lachsfarbene Eckpunkte.

Der Grund steht in der Messung selbst und wurde beim Messen übersehen: das Feld ist
abgerundet, und **in seinen vier Ecken steht der Grund der Tafel**, auf der es im Pack
liegt. Auf sandfarbenem Grund sieht man das nicht. Auf einem dunklen Panel sind es vier
helle Punkte.

Die Diagnose war beim ersten Blick trotzdem falsch. Der Verdacht fiel auf Weichzeichnung
— Regressionsregel 14, hochskalierte Pixelkunst braucht `image-rendering:pixelated`, und
die fehlte tatsächlich. Sie wurde ergänzt, und der Lachston blieb. Erst die Zelle selbst,
zwölffach vergrößert auf dunklem Grund neben ihre Geschwister gestellt, hat es gezeigt.

**Der Ersatz** ist die dunkle Tonstufe der Knopffamilie, `UI_Buttons.png` bei (129,17),
14×14: dunkler Kern, heller Rand, freistehend und damit ohne fremden Grund in den Ecken.
Ohne `fill` bleibt der helle Rand, und die Felder werden zu Fächern statt zu Kacheln.

Die Lektion ist allgemeiner als der Fall: `sheet-audit.mjs` und jede Pixelsonde messen, wo
etwas *ist*. Ob es dorthin *gehört*, wohin man es setzen will, misst nichts. Dafür gibt es
den Einbau, und deshalb steht in `tools/ui-zellen.mjs` bei dieser Zelle nicht nur die
Koordinate, sondern auch der verworfene Kandidat mit Begründung.

## Befund 2: das X war da, aber nicht zu sehen

Der Schließknopf sollte den Kreis mit dem eingeprägten X aus `UI_Buttons.png` bekommen.
Die Gruppe hat drei Tonstufen (721 hell, 737 mittel, 753 dunkel) bei identischem Kreuz.
Genommen wurde zuerst die helle.

Auf 28px heruntergerechnet las sich die helle Stufe als Scheibe ohne Zeichen: das Kreuz
liegt dort fast tongleich auf der Kreisfläche. Bei 753 liegt es dunkel auf dunkel. Nur bei
**737** steht es braun auf einer breiten cremefarbenen Fläche und ist auf Knopfgröße als
Kreuz zu erkennen.

Eine Kontrastentscheidung, keine Geschmacksfrage — und eine, die nur am eingebauten Knopf
zu treffen war, nicht am vergrößerten Blatt.

## Befund 3: `bakeUiSkin()` hätte an einem fehlenden Blatt einen schwarzen Bildschirm erzeugt

Beim Erweitern fiel eine alte Stelle auf:

```js
const frameUrl = SHEETS['cfui_frame'].img.src;
```

`SHEETS[key]` ist `undefined`, wenn das Blatt nicht geladen wurde — `loadAssets()` legt den
Eintrag dann gar nicht erst an. Wer das Repo ohne Grafiklizenz klont, bekam an dieser Zeile
einen `TypeError` **mitten in der Ladekette**, nach `bakeHeroSheet()` und vor
`bakeAllNpcSheets()`, `refreshFloor()` und `showStartScreen()`. Also keinen Skin-Verlust,
sondern einen schwarzen Bildschirm.

Aufgefallen ist das nicht im Betrieb — hier liegt die Grafik ja — sondern beim Nachdenken
darüber, was die vier neuen Zellen tun sollen, wenn sie fehlen. Seit U2 wird gefragt statt
zugegriffen, und der Rückfall ist geprüft (Prüfprotokoll unten, zwei Stufen).

## Die vier Zellen

Geschnitten von `tools/ui-zellen.mjs`, das die Koordinaten als Tabelle im Quelltext führt
und mit `--pruef` nachrechnet, ob die Dateien in `assets/cf/ui/` noch dem Schnitt
entsprechen. Zusammen **1098 Byte**.

| Datei | Quelle | Rect | Wofür |
|---|---|---|---|
| `slot_dark.png` | `UI_Buttons.png` | (129,17) 14×14 | Beutel-, Ausrüstungs-, Zutaten- und Symbolfelder |
| `btn_close.png` | `UI_Buttons.png` | (737,33) 14×14 | Schließknopf aller sieben Panels |
| `btn_pill.png` | `UI_Buttons.png` | (1,17) 30×14 | Kochknopf, Overlay-Knöpfe, Amtsstuben-Knopf |
| `sel_white.png` | `UI_Selectors.png` | (11,10) 26×28 | Auswahlrahmen: Feld unter dem Zeiger, aktiver Zauber |

`sel_white` ersetzt zwei Rahmen, die aus keiner Grafik stammten, sondern aus CSS-Farbwerten:
den blauen um das ausgerüstete Teil und den goldenen Schein um den aktiven Zauber.

### Warum ein Werkzeug und nicht vier Handschnitte

G5 hat vier Zellen von Hand geschnitten und die Koordinaten in `assets/cf/README.md`
notiert. Bei vier Zellen geht das. Der Grund fürs Schneiden überhaupt steht dort auch:
`addSheet`s `'grid'`-Modus kennt nur `rowStart`, keinen Spaltenversatz, und CSS kann
ohnehin keinen Ausschnitt adressieren — `border-image` und `background-image` nehmen immer
die ganze Datei.

Von Hand geschnitten heißt aber: nicht nachprüfbar. Wer wissen will, ob `btn_pill.png`
wirklich aus `UI_Buttons.png` bei (1,17) stammt, muss es glauben. `node tools/ui-zellen.mjs
--pruef` rechnet es nach.

Die Alternative wäre gewesen, die ganzen Blätter auszuliefern und zur Laufzeit zu
schneiden. Dagegen sprach die Rechnung: `UI_Buttons.png` ist 81 KB für zwei gebrauchte
Zellen, als `data:`-URI im Einzeldatei-Build 108 KB — ein Zehntel des ganzen Builds für
1098 Byte Inhalt.

## Was ausdrücklich liegen bleibt

Gesichtet, vermessen, nicht verbaut:

- **`UI_Ribbons.png`** (sechs Spruchbänder). Reizvoll als Kopfband, aber die Mitte des
  Bandes ist höher als seine Enden. `border-image` schneidet rechteckig, und die obere
  Kantenscheibe würde die Mitte über die Zipfel schmieren — aus dem Band wird ein Kasten.
  Machbar wäre es mit drei Zellen und drei Hintergründen (links/rechts fest, Mitte
  gekachelt). Das ist ein eigener Posten, kein Beiwerk.
- **`Book_UI.png`** (aufgeschlagene Bücher, Lesebändchen). Das Buch wäre ein Grund für
  Kladde und Akten, die Bändchen wären Reiter. Beides hell, beides also erst nach einer
  Antwort auf die Frage, ob diese zwei Reiter aus der Dunkelheit ausscheren dürfen.
- **`UI_Bars.png`** (Leisten mit Rahmen, Porträtfassung). Gehört ins HUD, nicht ins Menü.
  Die Kugeln und Röhren sind kalibriert (G5, Mobile-Breakpoints), das ist ein Bauabschnitt
  für sich.
- **`UI_Icons.png`**, **`UI_Button_Icons.png`**. Der Gürtel trägt Emoji. Sie durch
  Pack-Symbole zu ersetzen ist verlockend und betrifft jede Beschriftung im Spiel.
- **Die Schriften.** Bleiben erledigt: kein ä, ö, ü, ß im TTF, in G5 per
  `fontTools`-Cmap-Check bestätigt.
- **`UI_ALL.png`** (181 KB). Sammelblatt aller anderen, wird nie gebraucht.

Ein Reiter-Versuch ist im Bau entstanden und wieder verworfen: `sel_white` auf `.kTab.on`
gelegt. Der gestrichelte Rahmen ist für ein Feld von 46px gezeichnet; auf einem Reiter von
140×40 wird daraus ein weißer Kasten, der lauter ist als der Reiter. Die Reiter behalten
die Goldkante aus U1. Die Notiz steht im CSS an der Stelle, damit es niemand nochmal
probiert.

## Abnahme

- Die vier Zellen stammen nachweislich aus den genannten Koordinaten (`--pruef`).
- Felder, Schließknöpfe und breite Knöpfe tragen Pack-Grafik, nicht CSS-Verläufe.
- Kein Panel wird heller: der Text steht überall weiter auf dunklem Grund.
- Ohne die vier Zellen läuft das Spiel und die Menüs sehen aus wie nach U1.
- Ohne **jede** UI-Zelle läuft das Spiel ebenfalls — vorher war das ein schwarzer Bildschirm.
- U1 bleibt unberührt: Klick daneben schließt weiter, `Esc` weiter eine Ebene je Druck.
- Die Konsole ist beim Start still.

## Prüfprotokoll

Lauf vom 21.08.2026, Chromium, Desktop 1280×800 und Touch 390×844, auf dem Stand nach
`W-Lager` (`54906e4`).

```bash
python3 serve.py &
node tools/ui-zellen.mjs --pruef     # 4 von 4
node tools/menue-pruef.mjs           # 39 von 39
```

**Zellen-Gegenprobe: 4 von 4.** Jede Datei in `assets/cf/ui/` ist byteweise der Schnitt,
den die Tabelle beschreibt. Das Werkzeug meldet zusätzlich den Deckungsgrad je Zelle
(80 / 68 / 97 / 54 %) und bricht unter 10 % ab — eine danebenliegende Koordinate liefert
sonst eine fast leere Zelle, und die fällt erst im Spiel auf, dort aber als „die Grafik ist
irgendwie weg".

**U1-Prüflauf: 39 von 39.** Unverändert bestanden, auf demselben Stand. U2 fasst weder
Ereigniswege noch Panel-Zustände an, aber das ist eine Behauptung, bis der Lauf sie stützt.

**Rückfall, zwei Stufen, beide von Hand gefahren und am Rechenstand abgelesen:**

| Weggenommen | `--cfui-slot` | `body.cfuiX` | Feldrand | Schließknopf | Fehler | Spiel |
|---|---|---|---|---|---|---|
| die vier U2-Zellen | leer | `false` | `#4c4030` (U1) | `round_brown` + ✖ | keine | läuft |
| zusätzlich `frame_brown`, `round_brown` | leer | `false` | `#4c4030` (U1) | CSS-Verlauf + ✖ | keine | läuft |

Die zweite Zeile ist der Pfad, der vor U2 ein `TypeError` war. Das ✖-Zeichen kommt in
beiden Fällen zurück, weil `body.cfuiX` es nur dann versteckt, wenn die Grafik wirklich
geladen ist — ein leerer runder Knopf wäre schlechter als ein Knopf ohne Grafik.

**Von Hand**, weil kein Lauf Optik beurteilt: alle sieben Panels auf beiden Auflösungen im
Bild geprüft, dazu der Kessel mit gefülltem Beutel, der Einstellungsvordruck (Overlay-
Knöpfe samt ausgegrauter Wahlknöpfe) und das Symbolschloss.

**Startkonsole still.** Acht Guard-Meldungen, keine Warnung, kein 404.

**Einzeldatei-Build:** `node tools/build-single.mjs` läuft durch, 122 Dateien, 1211 KB als
data:-URI. Die vier Zellen machen davon 1098 Byte.

## Was das für den nächsten Grafik-Durchgang heißt

`GRAFIK-BESTAND-2026-08-21.md` führt `Cute_Fantasy_UI` mit „18 Dateien, 0 geladen" und
merkt an, dass die vier G5-Zellen der Namensvergleich nicht findet. Der Stand gilt weiter
als Stand — datierte Berichte werden hier nicht rückwirkend umgeschrieben. Wer ihn liest,
soll nur wissen: seit U2 sind es acht Zellen aus fünf Blättern, und die Liste der
Kandidaten steht oben unter „Was ausdrücklich liegen bleibt", mit dem Hindernis je Posten.
