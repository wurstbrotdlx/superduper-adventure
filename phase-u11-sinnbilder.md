## U11: Die Sinnbilder — ERLEDIGT

Bauabschnitt U11, 25.08.2026. Unmittelbare Folge von U10 und dessen offenem Punkt.

U10 hat die Knopfform in Ordnung gebracht und dabei ausdrücklich notiert, was danach
der größte verbliebene Stilbruch ist: die Sinnbilder waren System-Emoji. Sie zu
ersetzen war damals nicht möglich, weil die Rohbibliothek aus Lizenzgründen nicht im
Repo liegt und geraten wird hier nichts. Die Packs sind inzwischen da, also ist der
Punkt zu.

### Der Befund, den U10 schon aufgeschrieben hat

⚔️ 🧪 🎯 🎒 ✨ 🧍 🔒 🏳️ 🖐️ waren die einzige Grafik des ganzen Spiels, die nicht aus
dem Pack stammte. Am Schirm bei 13 Pixeln fällt das kaum auf; am Finger bei 22 bis 31
Pixeln ist es glänzende, runde, farbverlaufende Apple-Zeichnung auf Pixelkunst.

**U10 hat den Bruch verschärft, nicht gemildert.** Auf einem sauberen Achteck fällt ein
fremdes Sinnbild mehr auf als auf einem verkorksten — solange der Knopf selbst noch aus
drei einander widersprechenden Formen bestand, ging das Emoji im allgemeinen Rauschen
unter.

### Fund 1: die Icon-Quelle war als „liegt zurecht" abgehakt

`GRAFIK-BESTAND-2026-08-21.md` führt `Cute_Fantasy_UI` mit „18 Bestand, 0 geladen" und
sortiert den Rest unter **was zurecht liegen bleibt** ein:

> **`Cute_Fantasy_UI`.** […] Der Rest sind Rahmenvarianten, die der Skin nicht braucht.

Das gilt für `UI_Frames.png` und ist für `UI_Icons.png` falsch. Das Blatt misst 624×256
im 16er-Raster, also **624 Zellen**, und es ist nicht ungenutzt, sondern zu drei Zellen
genutzt: G5 hat daraus `glint_strip.png` geschnitten (Zeile 3, Spalten 9–11). Die
Bestandsaufnahme hat ein ganzes Blatt hinter einer Sammelaussage über ein anderes
verloren.

Wie jeder datierte Bericht in diesem Repo bleibt sie stehen, wie sie ist. Diese Notiz
ist die Berichtigung.

### Fund 2: das Knopfblatt trägt die falschen Icons

Naheliegend wäre, fertige Knöpfe mit eingelegtem Sinnbild zu nehmen — `UI_Buttons.png`
hat sie ab x=144 in jeder Tonstufe, und `UI_ALL.png` hat Hunderte davon. Sie sind
unbrauchbar, und zwar nicht wegen der Form, sondern wegen des Inhalts: die eingelegten
Zeichen sind **Steuersymbole** (Pause, Wiedergabe, Note, Ein/Aus, Lautstärke, Haus,
Ausrufezeichen, Fragezeichen, Pfeile, Buchstaben). Kein Schwert, kein Trank, kein
Rucksack.

Die Spiel-Sinnbilder liegen ausschließlich in `UI_Icons.png` und müssen auf das Achteck
**aufgelegt** werden. Das ist genau die Bauart, die U10 ohnehin gebaut hat: das Achteck
im `::before`, das Sinnbild im Inhalt darüber.

`UI_Button_Icons.png` (496×224) ist trotz des Namens ebenfalls nichts für uns — es sind
Gamepad- und Tastaturglyphen (A, B, X, Y, R1, L1, LT, RT) in vierzehn Farbfassungen.

### Die Auswahl

Neun Zellen. Gemessen wurde, wo es etwas zu messen gab, und sonst gesehen —
`tools/ui-icon-kontaktbogen.mjs` stellt jeden Kandidaten auf das **echte Achteck in der
echten Anzeigegröße auf dem echten Untergrund** (der Ton des Dorfwegs), und genau dort
sind zwei naheliegende Zellen durchgefallen.

| Knopf | war | ist | Blatt | Quelle |
|---|---|---|---|---|
| Schlagknopf | ⚔️ | gekreuzte Klingen | `UI_Icons` | 112,16 |
| Trank | 🧪 | Rundkolben mit Korken | `Food_Icons_NO_Outline` | 112,128 |
| Zauberbaum | ✨ | blauer Stern | `UI_Icons` | 144,48 |
| Rucksack | 🎒 | Rucksack | `UI_Icons` | 144,32 |
| Charakter | 🧍 | rotes Buch | `UI_Icons` | 192,16 |
| Zielwahl | 🎯 | Zielkreuz | `UI_Crosshairs` | 0,128 |
| gesperrt | 🔒 | Verbotsschild | `UI_Icons` | 208,80 |
| Kammer-Abbruch | 🏳️ | rotes Kreuz | `UI_Icons` | 176,80 |
| Kontextknopf | 🖐️ | Zeigehand | `UI_Icons` | 48,224 |

Die vier Entscheidungen, die keine Geschmacksfragen sind:

- **Der Trank ist die einzige Zelle außerhalb des UI-Packs.** `UI_Icons.png` hat Herz,
  Münze, Blitz, Schild, Schlüssel und Truhe, aber keine Flasche. Der Rundkolben kommt
  aus den Speise-Icons des Hauptpacks — und ausdrücklich aus dem Ordner **„No
  Outline"**, obwohl der Name das Gegenteil verspricht. Genau die Fassung trägt nämlich
  denselben **dunklen** Rand wie alle `UI_Icons`; die Fassung im Ordner „Outline" legt
  einen zusätzlichen **cremefarbenen** Rand darum. Auf dem hellen Achteck verschwände
  der, und im selben Fenster stünden zwei verschiedene Randfarben nebeneinander.
- **Der Zauberstern ist blau, nicht golden.** Der goldene Stern bei (48,0) wäre der
  naheliegende und ist verworfen: genau dieses Zeichen brennt als Sternchen **am**
  Knopf, sobald es freie Befähigungspunkte oder eine offene Vorlage gibt (`#spBadge`,
  `#skillBadge`, `#zulBadge`). Ein goldener Stern im Knopf und ein goldener am Knopf
  sind zwei Auskünfte in einem Zeichen.
- **Der Charakter ist ein Buch, keine Figur.** Das Pack hat überhaupt keine
  Personen-Zelle — und in diesem Haus wäre sie auch die falsche. Hinter dem Knopf
  stehen Lichtbild, Amtsbezeichnung, Befähigung und Ausrüstung: das ist die
  Personalakte. Rot, weil das der höchste Kontrast gegen das Achteck ist; die blaue
  Fassung bei (160,16) liest sich daneben als Zauberbuch.
- **Gesperrt ist ein Verbotsschild, kein Schloss.** Das Pack hat kein Schloss, und das
  Schild ist hier ohnehin das richtigere Zeichen: gesperrt ist der Zauber nicht durch
  ein Schloss, sondern durch die fehlende Zauberbefugnis (Z2).

Zwei Kandidaten sind am Bogen gescheitert, und beide wären ohne ihn eingebaut worden:

- **Die Zielkreuze aus den ersten Zeilen von `UI_Crosshairs`.** Sie bestehen aus
  einzelnen weißen Punkten, und auf dem hellen Achteck zerfallen die zu Streuseln statt
  zu einem Fadenkreuz. Zeile 8 ist die einzige mit geschlossenen Flächen — vier
  Dreiecke, die nach innen auf eine Mitte zeigen.
- **Die zweite Rucksack-Fassung bei (160,32).** Flacher gezeichnet und auf dem Achteck
  noch schwächer als die erste. Der Rucksack ist ohnehin der schwächste Kontrast des
  ganzen Satzes — braun auf hellbraun —, und er trägt trotzdem, weil der dunkle Rand
  die Form hält und ein Rucksack nun einmal braun ist.

### Alles oder nichts, und das Emoji ist der Ersatzwert

Das Emoji bleibt als **Text im Element** stehen:

```html
<i class="ico ico-rucksack">🎒</i>
```

Liegt der ganze Satz vor, setzt `bakeUiSkin()` die Klasse `body.cfuiIco`, und dann fällt
die Schrift auf 0 und das Bild tritt an ihre Stelle. Das ist dieselbe Bauart wie
`body.cfuiX` beim Schließknopf (U2) und hat denselben Grund: ohne Grafiklizenz soll dort
ein Zeichen stehen und kein leeres Feld.

**Alles oder nichts** ist dabei die eigentliche Entscheidung: neun Knöpfe, von denen
fünf ein gezeichnetes Bild trügen und vier ein Emoji, sähen schlechter aus als neun
Emoji. Fehlt eine einzige Zelle, wird keine einzige Variable geschrieben, die Klasse
bleibt weg, und eine Warnung nennt die fehlende beim Namen. Nachgemessen, indem eine
Zelle beiseitegelegt wurde:

```
warning: UI-Sinnbilder: zauber fehlen, die Knoepfe bleiben bei den Emoji.
```

Kein `PAGEERROR`, alle neun Emoji stehen wieder da.

### Die Größen

Wieder ganzzahlige Vielfache, diesmal von 16:

| wo | Kante | Faktor |
|---|---:|---:|
| Schirm, im Gürtel neben der Beschriftung | 16 | 1× |
| Finger, im Rundknopf von 56 | 32 | 2× |
| Finger, auf dem Schlagknopf (Bild 84) | 48 | 3× |
| Kontextknopf, Pille mit Text | 16 | 1× |

Der Kontextknopf ist die eine Ausnahme, und sie ist begründet: er ist keine Runde,
sondern eine Pille mit Text daneben. Ein Sinnbild von 32 neben einer Schrift von 13
würde die Zeile sprengen, und 24 ist kein Vielfaches von 16.

### Was NICHT ersetzt ist

**Das Sinnbild des aktiven Zaubers und das des Ultimates.** Sie stehen in
`SPELLS[].icon` und wechseln mit der Skillung: 🔥 🔥 ☄️ ❄️ ❄️ 🌨️ ⚡ ⚡ 🔮 🕳️ 🎉. Feuer,
Eis, Blitz, Arkan, Zeit und Konfetti haben im Pack keine Entsprechung — `UI_Icons` hat
einen Blitz und sonst nichts davon. Sie sind **Inhalt und nicht Knopfmöbel**: sie
gehören zum Zauber, nicht zum Knopf, und stehen im Zauberbaum ohnehin neben ihrem Namen.
Solange die Zauber gesperrt sind, trägt auch dort das Verbotsschild.

### Das Werkzeug hat sich geändert

`tools/ui-zellen.mjs` las bis U11 aus genau einem Ordner
(`Graphics/Cute_Fantasy_UI/UI`). Der Trank kommt aus einem zweiten Pack, also ist
`QUELLE` jetzt die Wurzel `Graphics/` und jede Zeile trägt ihren Pfad selbst. Die vier
Zellen aus U2 sind dabei mitgezogen, und der Beweis, dass der Umbau nichts verschoben
hat, steht im Lauf: alle vier melden **`gleich`**, sind also byteweise dieselben Dateien
wie vorher.

Neu ist `tools/ui-icon-kontaktbogen.mjs`. Es stellt Kandidaten auf das echte Achteck in
der echten Anzeigegröße auf dem Ton des Dorfwegs. Ein Icon-Blatt anzusehen sagt nämlich
nichts darüber, wie die Zelle auf **diesem** Knopf steht — die weißen Zielkreuze sehen
auf dem dunklen Kontaktbogen des Blattes vollkommen brauchbar aus und zerfallen erst auf
dem hellen Achteck.

### Abnahme

- Neun Knöpfe tragen gezeichnete Sinnbilder statt System-Emoji, am Schirm wie am
  Finger. ✓
- Jedes Bild ist ein ganzzahliges Vielfaches von 16. ✓
- Fehlt eine Zelle, bleiben alle neun Emoji stehen, mit benannter Warnung und ohne
  Fehler. ✓
- Die vier Zellen aus U2 sind byteweise unverändert. ✓
- Keine Tastfläche und keine Geometrie hat sich geändert. ✓

### Prüfprotokoll

Alle Läufe am 25.08.2026, Chromium aus der Umgebung, `python3 serve.py` auf 8378.

| Lauf | Ergebnis |
|---|---|
| `node --check` über den Skriptblock | Syntax ok |
| Konsole beim Laden | **22 Meldungen, keine Warnung, kein PAGEERROR**; `body.cfuiIco` und `body.cfuiRund` gesetzt |
| Konsole mit einer beiseitegelegten Zelle | genau eine Warnung, die die fehlende benennt; kein Fehler; Emoji stehen |
| `tools/ui-zellen.mjs` | 13 Zellen geschnitten, die vier aus U2 melden `gleich` |
| `tools/ui-zellen.mjs --pruef` | 13 Zellen geprüft, keine Abweichung |
| `tools/steuerung-pruef.mjs` | vier Formate, **Alles in Ordnung** |
| `tools/menue-pruef.mjs` | **78 von 78** |
| `tools/steuerung-kontaktbogen.mjs` | drei Formate, Gerätepixel 1:1, vorher/nachher verglichen |
| `tools/build-single.mjs` + `dist/index.html` per `file://` | **224 Dateien** statt 215, `body.cfuiIco` gesetzt, Konsole ohne Auffälligkeit |
| Gürtel am Schirm, 1440×810 | Sinnbild 16×16, Schrift 0, Bild gesetzt |

### Der Nachtrag, der noch aussteht

Die neun geschnittenen Zellen liegen in `assets/cf/ui/` und damit in der `.gitignore`.
Ausgeliefert werden sie über das private Grafik-Repo
`wurstbrotdlx/superduper-adventure-assets`, das `.github/workflows/pages.yml` per Deploy
Key klont. **Solange sie dort nicht liegen, baut die CI ohne sie** — und das ist kein
Ausfall, sondern genau der Ersatzweg von oben: die ausgelieferte Fassung zeigt dann die
Emoji weiter, mit der benannten Warnung in der Konsole. Der Code ist in beiden Fällen
richtig; die Sinnbilder erscheinen, sobald die Zellen im Grafik-Repo liegen.
