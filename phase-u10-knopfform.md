## U10: Das Achteck ist der Knopf — ERLEDIGT

Bauabschnitt U10, 25.08.2026. Ausgelöst durch einen Bildschirmabzug vom Telefon und
eine Frage in vier Worten: warum die Knöpfe am Finger so hässlich sind und am Schirm
nicht.

Die Antwort ist keine Geschmacksfrage und auch keine über Skalierung, obwohl die
naheliegende Vermutung genau dorthin zeigt. Sie ist eine über **Formen, die einander
widersprechen** — vier davon auf einem Knopf von sechsundfünfzig Pixeln.

### Der Anlass: derselbe Skin, zwei völlig verschiedene Wege

Am Schirm gibt es überhaupt keinen Rundknopf. Der Gürtel ist dort eine Reihe
Rechtecke, und `bakeUiSkin()` legt darauf den 9-Slice-Rahmen aus `frame_brown.png`
(Schnitt `2 2 5 2`, Breite 4px). Ein 9-Slice dehnt nur die Kanten und lässt die vier
Ecken in Originalgröße — das bleibt scharf, egal wie breit der Knopf wird.

Die Rundknöpfe gibt es ausschließlich unter `body.touch`. Sie nehmen den anderen Weg:
`border-image-source:none !important`, dafür `background-image:var(--cfui-round)` mit
`background-size:100% 100%`. Deshalb war das ein reiner Mobilfehler, und deshalb hat
ihn seit U7 niemand gesehen — am Entwicklungsschirm steht kein einziger dieser Knöpfe.

### Fund 1: die Zelle ist ein Achteck, und das CSS macht einen Kreis daraus

`assets/cf/ui/round_brown.png` ist **14×14** und zeichnet ein Achteck: vier
Schrägen mit 2-Pixel-Stufen, vollständig durchsichtige Ecken, ein gezeichneter dunkler
Rand ringsum, helle Lichtkante oben, dunklere Standfläche unten. Die Alphakarte,
gemessen statt vermutet:

```
....######....
...########...
..##########..
.############.
##############
##############       ( sechs volle Zeilen )
.############.
..##########..
...########...
....######....
```

Darauf lagen bis U10 drei weitere Formen:

| Schicht | woher | Form |
|---|---|---|
| Grund | `background:rgba(23,19,13,.85)` bzw. `.beltSlot{background:#17130d}` | Kasten |
| Beschnitt | `border-radius:50%` | Kreis |
| Rand | `border:3px solid #6b5a3a` | Kreisring |
| Bild | `round_brown.png` | **Achteck** |

Der Kreis schnitt dem Achteck die vier Schrägen ab. Der Kasten schien in den
durchsichtigen Ecken durch, weil er größer war als der Kreis, der ihn beschneiden
sollte, aber kleiner als nichts — genauer: der Kreis beschnitt Grund und Bild
gemeinsam, also blieb zwischen Achteckkante und Kreisbogen ein dunkler Saum stehen.
Und der flache Rand lag als Kreisring auf dem gezeichneten Rand des Achtecks.

Das Ergebnis auf dem Gerät ist genau das, was der Bildschirmabzug zeigt: ein helles
Achteck in einem dunklen Kreis, mit angeknabberten Ecken.

### Fund 2: der Kommentar im Quelltext hat drei Bauabschnitte lang in die falsche Richtung gezeigt

Bei `#portraitRing` stand seit G5:

> `bakeUiSkin()` legt round_brown.png (16x16) als background-image mit
> background-size:100% 100% […], das ist 3,5- bis 5-fach hochskalierte Pixelkunst.

Beide Zahlen sind falsch. **16×16 ist die Zelle** in `UI_Buttons.png`; die **Datei**
ist auf ihre Bounding-Box beschnitten und misst 14×14. `assets/cf/README.md` sagt es
richtig (»Quelle 96,0 16×16 (Bounding-Box 1,1–15,15)«), der Kommentar im Code hat die
Quellzahl übernommen und die Dateizahl gemeint.

Der Unterschied ist nicht kosmetisch, er verlegt den ganzen Fehler:

| Element | Kante | Faktor bei 16 (falsch) | Faktor bei 14 (richtig) |
|---|---:|---:|---:|
| Daumenfächer | 56 | 3,5 ✗ | **4,0 ✓** |
| Menüspalte | 56 | 3,5 ✗ | **4,0 ✓** |
| Schlagknopf | 82 | 5,125 ✗ | 5,857 ✗ |
| Zielwahl | 44 | 2,75 ✗ | 3,143 ✗ |
| Schließknopf im Menü | 28 | 1,75 ✗ | **2,0 ✓** |

Mit der falschen Zahl sieht es aus, als sei jeder Knopf krumm skaliert und die
Skalierung das Hauptproblem. Mit der richtigen trifft der Fächer — der Knopf, über den
sich niemand beschwert hat und der trotzdem am schlechtesten aussah — das Vierfache
**exakt**. Damit war klar: die Skalierung ist der kleinere der beiden Fehler, die Form
ist der größere. Der Kommentar ist im Code berichtigt und trägt die Berichtigung
sichtbar.

### Die Regel dieses Abschnitts: die Grafik ist die Form

Kein Rand, keine Rundung, kein Grund. Was der Knopf ist, steht im Alphakanal.

Daraus folgt eine zweite Entscheidung, die nicht naheliegt: **alles Zierende, das
bisher der Form des Kastens folgte, muss der Form des Bildes folgen.** `box-shadow`
kennt nur den Kasten, `filter:drop-shadow()` liest den Alphakanal. Also ist der
Schlagschatten ein Filter, und die vier Zustände — gesperrter Schlagknopf, gezielter
Zauber, Abbruchzauber, Zielwahl auf »Schwach« — sind es auch. Sie setzten bis U10
`border-color`, und einen Rand gibt es hier nicht mehr. Der Schein um einen gesperrten
Schlagknopf ist damit achteckig wie der Knopf.

Aufgetragen wird er zweimal: eng und deckend für die Kante, weit und durchsichtig für
das Leuchten.

### Fund 3: die krummen Kanten dürfen nicht geradegerückt werden

Naheliegend wäre, Schlagknopf und Zielwahl auf ein Vielfaches von 14 zu setzen. Beide
dürfen das nicht:

- **44 ist das Daumenmaß.** `tools/steuerung-pruef.mjs` verlangt für jede Tippfläche
  mindestens 44×44 (Apple HIG 44, Material 48dp — 44 ist die verbindliche der beiden
  Zahlen). Die Zielwahl auf 42 zu setzen wäre ganzzahlig und würde den Lauf rot machen.
- **82 hält den Abstand zum Ultimate.** Bei 84 stoßen die beiden Kästen auf **null**
  Pixel zusammen: auf 390×844 endet der Ultimate bei y=665, der Schlagknopf begänne bei
  y=665. Nachgemessen, nicht geschätzt. Es ist derselbe Engpass, der den Ultimate schon
  in U7 von Radius 96 auf 99 geschoben hat (die Notiz dazu steht im CSS).

Also bleibt der Kasten stehen, und das Bild zieht in ein `::before` um, das mittig
darin sitzt und dessen Kante ein Vielfaches von 14 ist:

| Knopf | Tastfläche | Bild | Faktor |
|---|---:|---:|---:|
| Schlagknopf | 82 (unverändert) | **84** | 6× |
| Trank, Zauber, Ultimate | 56 (unverändert) | 56 | 4× |
| Menüspalte, Kammer-Abbruch | 56 (unverändert) | 56 | 4× |
| Zielwahl | 44 (unverändert) | **42** | 3× |

**Tastfläche und Sichtfläche sind damit zwei verschiedene Zahlen** — am Finger ohnehin
die bessere Bauart. Der Schlagknopf misst sichtbar 84 und fängt auf 82; die Zielwahl
sieht mit 42 kleiner aus als die drei Kampfknöpfe und bleibt mit 44 im Daumenmaß.
Genau das wollte U7 (»kleiner als die drei Kampfknoepfe, weil sie im Gefecht selten
angefasst wird — aber im Daumenmass, nicht darunter«), und jetzt stimmt es auch.

Das `::before` liegt auf `z-index:-1`, also hinter dem Inhalt des Knopfes (Sinnbild,
Trankzahl, Sternchen) und trotzdem im Stapel von `#beltRow` bzw. `#touchCluster` —
beide sind positioniert und tragen `z-index:11`, es fällt hier nichts hinter die
Weltkarte. Zentriert wird über `left/top:50%` plus negatives `margin`, unabhängig von
der Kastengröße; das ist der ganze Zweck der Übung.

### Fund 4: `grayscale(1)` entfärbt am Schirm einen Kasten und am Finger eine Zeichnung

`.beltSlot.disabled` setzt `opacity:.4` und `filter:grayscale(1)`. Am Schirm trifft das
einen einfarbigen Kasten. Am Finger trifft es das warme Achteck des Packs und macht
einen grauen Fleck daraus, der bei 40 Prozent Deckkraft kaum noch zu finden ist.

Am Finger stattdessen zurückgenommene Sättigung und Helligkeit
(`saturate(.3) brightness(.58)`) bei einer Deckkraft von 90 statt 40 Prozent: der Knopf
liest sich als aus und bleibt aus derselben Welt. Das Abdunkeln tut die Arbeit, die
vorher die Durchsichtigkeit tun sollte.

Weil `filter` eine einzige Eigenschaft ist und nicht mehrere, muss jede dieser Regeln
den Schlagschatten mitschreiben. Er steht deshalb als `--knopfSchatten` an
`body.cfuiRund` und wird überall über `var()` hereingezogen, statt fünfmal
abgeschrieben zu werden.

### Fund 5: »🔒 Ult (R)« passt nicht in einen Kreis von 56 Pixeln

Die zwei gesperrten Knöpfe trugen ihre Begründung als Text im Knopf: `🔒 Ult (R)` und
`🔒 ab St. 4`, in 11 bzw. 9 Pixeln, in einem Kasten mit `padding:0` und ohne
`overflow`. Der Text brach um und stand zur Hälfte außerhalb — im Bildschirmabzug zwei
blasse Klumpen mit Schrift daneben.

Repariert ohne eine einzige neue Regel: die Worte ziehen in eine `<span class="bl">`,
und `body.touch .beltSlot .bl{display:none}` gibt es seit U7. Am Finger bleibt das
Schloss, am Schirm bleibt der Text. Die Auskunft geht nicht verloren, sie steht im
`title` (`ZAUBER_SCHLOSS_TITEL`), der davon unberührt bleibt.

Betroffen waren vier Stellen: der Platzhalter im Markup, `ZAUBER_SCHLOSS`, und zwei
Zweige in `updateHUD()` (gesperrt und freigeschaltet).

### Fund 6: der Zähler der Hausmitteilung hätte »4 Stellen« geschrieben

Die Hausmitteilung schrieb ihre Zahl aus, aber nur eine: `punkte.length === 3 ? 'Drei
Stellen' : `${punkte.length} Stellen``. Mit dem vierten Punkt aus U10 hätte dort eine
Ziffer gestanden, in einem Haus, das Zahlen ausschreibt. Ersetzt durch
`neuerungenStellen()` mit einer Zahlwort-Tabelle bis acht und einem eigenen Zweig für
den Singular (»Eine Stelle«).

### Was ausdrücklich NICHT passiert ist

- **Das Lichtbild oben links** (`#portraitRing`) behält seinen krummen Faktor (52/14 =
  3,714) und seinen Kreis. Sein `border-radius` ist eine **Bildmaske** für
  `#hudPortrait` und keine Knopfform — er beschneidet das Porträt, nicht das Achteck.
  Was für einen Knopf falsch ist, ist für einen Rahmen richtig.
- **Der Kontextknopf** (»Ansprechen«) bleibt die dunkle Pille aus U7. Er ist kein
  Rundknopf, er trägt Text statt eines Sinnbilds, und `btn_pill.png` ist eine **helle**
  Pille, die eine dunkle Schrift verlangt — das wäre eine Entwurfsänderung und keine
  Reparatur. Er ist damit das auffälligste verbliebene Fremdstück in der unteren Ecke
  und ausdrücklich notiert.
- **Die Sinnbilder bleiben Emoji.** ⚔️ 🧪 🎯 🎒 ✨ 🧍 sind bei 22 bis 31 Pixeln
  glänzende System-Grafik auf Pixelkunst und der größte verbliebene Stilbruch — größer
  als alles, was U10 repariert hat. Sie zu ersetzen braucht Zellen aus
  `UI_Icons.png` (624×256, 16×16-Raster, **624 Zellen**), und die Rohbibliothek liegt
  aus Lizenzgründen nicht im Repo. Geraten wird hier nichts. Der Weg dorthin steht
  unten.
- **Keine Datei ist dazugekommen.** U10 kommt ohne eine einzige neue Grafik aus.

### Der offene Punkt: die Sinnbilder

`GRAFIK-BESTAND-2026-08-21.md` führt `Cute_Fantasy_UI` mit »18 Bestand, 0 geladen« und
sortiert den Rest unter »was zurecht liegen bleibt« ein, mit der Begründung, es seien
»Rahmenvarianten, die der Skin nicht braucht«. Das gilt für `UI_Frames.png` und ist für
`UI_Icons.png` nachweislich falsch: G5 hat daraus bereits `glint_strip.png` geschnitten
(Zeile 3, Spalten 9–11). Es ist die Icon-Quelle des Packs, und sie ist bis auf drei
Zellen unangetastet.

Der Weg ist gebahnt und braucht keinen neuen Mechanismus: `tools/ui-zellen.mjs` trägt
seine Zellentabelle im Quelltext und prüft sie mit `--pruef` nach. Sechs Zeilen mehr in
dieser Tabelle, sechs `addSheet()` daneben, und im Markup tritt ein `<i>` mit
`background-image` an die Stelle des Emoji — bei 16×16 nativ auf 32 (2×) oder 48 (3×)
gestochen scharf, und am Schirm bei 1× ohnehin.

Was fehlt, ist die **Auswahl**, und die ist ein Blick und keine Zahl. Sie braucht die
Blätter, und die liegen nur dort, wo eine Lizenz liegt.

### Abnahme

- Der Fächer und die Knopfspalte zeigen das Achteck, das gezeichnet ist: kein
  Kreisbeschnitt, kein zweiter Rand, kein durchscheinender Grund. ✓
- Jedes Bild ist ein ganzzahliges Vielfaches von 14. ✓
- Keine Tastfläche hat sich geändert; `steuerung-pruef.mjs` misst dieselben Kästen. ✓
- Die vier Zustände leuchten in der Form des Knopfes statt in der eines Kreises. ✓
- Ein gesperrter Knopf zeigt sein Schloss und keinen Text, der herausläuft. ✓
- Ohne Grafikpaket bleibt der Kreis aus U7 stehen (`body.cfuiRund` wird dann nicht
  gesetzt). ✓
- Am Schirm ändert sich nichts. ✓

### Prüfprotokoll

Alle Läufe am 25.08.2026, Chromium aus der Umgebung, `python3 serve.py` auf 8378.

| Lauf | Ergebnis |
|---|---|
| `node --check` über den Skriptblock | Syntax ok |
| Konsole beim Laden | **22 Meldungen, keine Warnung, kein PAGEERROR** (10 »in Ordnung«, 12 Zählzeilen) — die Zahl, die der README für den Stand vom 24.08. nennt |
| `tools/steuerung-pruef.mjs` | vier Formate, **Alles in Ordnung** — Überschneidung, Daumenmaß und »im Bild« unverändert |
| `tools/menue-pruef.mjs` | **78 von 78** |
| `getComputedStyle` über acht Knöpfe und vier Zustände | Kasten 82/56/44 unverändert, `::before` 84/56/42, kein Rand, keine Rundung, Grund durchsichtig, `box-shadow:none`, alle vier Zustandsfilter wie geschrieben |
| `tools/steuerung-kontaktbogen.mjs` | drei Formate, Ausschnitte in Gerätepixeln, vorher/nachher verglichen |
| `tools/build-single.mjs` + `dist/index.html` per `file://` | 215 Dateien eingebettet; `--cfui-round` löst auf die data:-URI auf, `::before` 84×84, `body.cfuiRund` gesetzt, Konsole ohne Auffälligkeit |
| Hausmitteilung | »Vier Stellen«, kein Skriptfehler |

### Ein neues Werkzeug: `tools/steuerung-kontaktbogen.mjs`

`steuerung-pruef.mjs` misst die Bedienschicht vollständig und hat trotzdem nie
gemeldet, was an ihr falsch war. Es kann das auch nicht: es rechnet mit
`getBoundingClientRect`, und **jeder Fund von U10 saß innerhalb eines Kastens, dessen
Maße stimmten**. Ein Achteck, das ein `border-radius` zum Kreis beschneidet, ist
geometrisch dieselbe Fläche wie ein Achteck, das man in Ruhe lässt. Der Unterschied ist
nur zu sehen.

Der Bogen macht das Sehen billig, wie `tools/figuren-kontaktbogen.mjs` es für die
Dorffiguren tut: ein PNG je Format, darunter je ein Ausschnitt des Fächers und der
Knopfspalte in **Gerätepixeln 1:1**. `deviceScaleFactor:3`, nicht 1 — ein Telefon
rechnet die Bedienschicht auf das Dreifache hoch, und genau dort fällt hochskalierte
Pixelkunst auseinander. Auf einem 1:1-Schirm sieht derselbe Knopf ordentlich aus, und
das war der Grund, warum die Sache am Entwicklungsschirm nie auffiel.

Er hat sich im Bau zweimal bezahlt gemacht: einmal beim Befund selbst, einmal bei einem
eigenen Fehler — `#attackBtn::before` blieb im ersten Anlauf bei 56 statt 84, weil
`body.cfuiRund #touchCluster .tBtn::before` eine Klasse mehr wiegt als
`body.cfuiRund #attackBtn::before` und die allgemeine Regel die Ausnahme schlug. Der
Bogen und ein `getComputedStyle`-Lauf haben es gezeigt; die Ausnahme trägt jetzt
`#touchCluster` mit und im CSS steht, warum.

### Warum ein Bogen und kein Guard

Aus demselben Grund, den U7 für seinen Prüflauf genannt hat: ein Guard läuft in jeder
Sitzung mit und muss deshalb billig und eindeutig sein. »Sieht dieses Achteck richtig
aus« ist beides nicht. Was **messbar** war, misst `steuerung-pruef.mjs` bereits, und es
hat U10 nicht gefunden — der Rest ist ein Blick, und dafür gibt es jetzt ein Werkzeug,
das man ruft, wenn man ihn braucht.
