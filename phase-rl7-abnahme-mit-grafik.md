# Bauabschnitt RL7: Die Abnahme mit Grafik — ERLEDIGT

Siebter Abschnitt der Release-Reihe und der erste, in dem jemand das Bild
gesehen hat. RL1 bis RL6 sind ohne die lizenzierte Grafik im Container
gebaut und geprüft worden; die CI hat mit Grafik geprüft („0 Warnungen,
Konsole still"), aber niemand hatte einen Abzug angesehen. Hier liegt das
Asset-Repo `wurstbrotdlx/superduper-adventure-assets` (Stand `9481c8d`,
27.08.2026) in der Sitzung, kopiert nach `assets/cf/` (204 Dateien,
gitignored), und alles unten ist damit gemessen.

Datum der Messungen: 04.10.2026, Chromium 1194 (Playwright 1.63.0), Stand
`8cc4b47` vor den Korrekturen und der Arbeitsstand danach.

---

## 1. Die achtzehn Prüfläufe

Alle `tools/*-pruef.mjs` am Stand `8cc4b47`, nacheinander, mit Grafik:
**18 von 18 grün.** Die fünf, die ohne Grafik seit der Baseline vor RL1 rot
waren (`ebene`, `gespraech`, `innen`, `langvorgang`, `reich`), sind mit
Grafik grün, mit genau den Zahlen, die ihre Köpfe nennen.

| Lauf | Ergebnis | | Lauf | Ergebnis |
|---|---|---|---|---|
| `anlage2` | 123 von 123 | | `menue` | 78 von 78 |
| `ebene` | 54 von 54 | | `mitteilung` | 32 von 32 |
| `empfang` | 150 von 150 | | `reich` | 59 von 59 |
| `gespraech` | 89 von 89 | | `schluss` | 36 von 36 |
| `innen` | 21 von 21 | | `speicher` | 38 von 38 |
| `intro` | Messlauf, ohne Abbruch | | `steuerung` | „Alles in Ordnung" |
| `ladelauf` | still, 12x „in Ordnung", **0 Warnungen** | | `stopfen` | 43 von 43 |
| `langvorgang` | 58 von 58 | | `szene` | 50 von 50 |
| | | | `versuchung` | 67 von 67 |
| | | | `zulagen` | 50 von 50 |

`ladelauf-pruef` zählt mit Grafik dieselben zwölf „in Ordnung"-Zeilen wie
ohne (RL5) und null Warnungen: keine einzige `Sprite fehlt`-Zeile, kein
„UI-Skin: frame_brown/round_brown fehlen". Die Guards, die erst nach dem Laden
dazukommen, melden: 16 gemalte Porträts geladen, 14 Dorffiguren mit Blatt im
Bild, 13 Garderobenformen ohne Ersatz, 15 Figuren eingekleidet.

**Ein Fund im Messlauf:** `intro-pruef` misst auf jeder Route zwei Wörter
weniger als die RL6-Tabelle (804 statt 806 auf dem Pflichtweg). Die Grafik ist
es nicht, beide Läufe sind zeichengleich; der Grund und die Berichtigung
stehen datiert unter `phase-rl6-anfang-in-raten.md`.

## 2. Die Abzüge

`tools/abzug-messlauf.mjs` (neu, siehe unten) zieht je Format 24 Bilder:
Startbild, Empfang, Ernennung (Blatt I und die Urkunde), Amtsstube nach der
Übernahme, Dorf, zehn Fenster (Charakter, Mappe, Rucksack, Kochen, Zauber,
Optionen, Ausweis, Karte, Gespräch, Amtsfenster), Kammer, Schattenland,
Dienstschluss, Jahresgespräch und vier Bilder des Abspanns (1, 4, 10, 13).
Formate 390×844, 844×390, 1280×720, Gerätefaktor 1. 72 Bilder, jedes
angesehen; die Konsole war in allen drei Läufen still (keine Fehler, keine
Warnungen).

## 3. Befunde, einzeln und gemessen

Maße aus `getBoundingClientRect()`, `scrollWidth`/`clientWidth` und
`measureText()` an der laufenden Seite, nicht aus dem Bild geschätzt.

| Nr. | Befund | Format | Maß | Stand |
|---|---|---|---|---|
| 1 | **Die Urkunden verlieren auf einem niedrigen Fenster ihre Szene.** `@media (max-height: 660px)` blendet `.amtLead` aus, geschrieben für den Vorspann des Vordrucks („Der Kopf einer Urkunde ist Schmuck"). Dieselbe Klasse trägt seit SZ1 das Feld `blatt` und die `regie` jeder Szenentafel. T6 hat daraus eine Schreibregel gemacht („jede Zeile, die den Witz trägt, gehört in `stimme`"); Ernennung (T2) und Abspann (SZ4) halten sich nicht daran. | 844×390 | Ernennung Blatt I: 36 Wörter weg (20 + 16). Abspann Blatt 10: 34 Wörter weg, sichtbar blieb „Nieselbeck: Gemeldet wird: Niederschlag." Blatt 13: 46 Wörter weg, sichtbar blieb „Auf dem Umschlag: Vorgang 2." | **behoben**: die Regel gilt nur noch unter `body.vordruckOffen`. Der T6-Kommentar in `skript/06` ist datiert nachgeführt. |
| 2 | **Der Textkörper der Szenentafel rollt, und nichts sagt es.** Seit SZ4 rollt der Inhalt im Rahmen (`max-height:56vh`), ohne Rollbalken im Bild. | 1280×720 | Ernennung Blatt I: 506 px Inhalt in 403 px Rahmen, 103 px verdeckt. 390×844: 551 in 473, 78 px. 844×390: 431 in 218, 213 px. | **behoben**: `.amtMehr` unter dem Rahmen, nach dem Rendern gemessen wie `berichtMehr` (RL4): „Der Text geht im Blatt weiter." Leer, wenn nichts rollt. |
| 3 | **Der Amtstitel läuft aus der Urkunde.** „Monsterangelegenheitenanwärter" in `.amtStimme` bricht nicht und wird abgeschnitten („…anwär"). | 390×844 | Wort 345 px, Spalte 307 px, 38 px über den Rand (`scrollWidth` 357 gegen `clientWidth` 307). | **behoben**: `overflow-wrap:anywhere` (dazu `hyphens:auto`, das im Container-Chromium nicht trennt und auf einem Gerät mit deutschem Wörterbuch [Vermutung] den Trennstrich setzt). Bricht ohne Trennstrich mitten im Wort, wie die Gesprächskopfzeile seit RL2. |
| 4 | **Derselbe Titel läuft aus dem Dienstausweis.** `#ausweisFelder` ist Flex-Kind und wird so breit wie sein längstes Wort. | 390×844 | Felder 259 px breit bei 234 px Platz (Ausweis 374, Lichtbild 96, Abstand 12, Innenabstand 16); 25 px hinaus, der Ausweis hat dort `overflow:auto`. | **behoben**: `min-width:0; overflow-wrap:anywhere`. Felder jetzt 228 px, erste Zeile dreizeilig. |
| 5 | **Im Zauberbaum stehen die Namen am Telefon in drei Zeilen** („Feue / rbal / l"). Das Raster `36px 1fr auto` gibt der dritten Spalte (`.sMana`, `white-space:nowrap`, „36 Mana · Pool 26, zu klein") ihre volle Breite, bevor der Name etwas bekommt. | 390×844 | Namensspalte 38 px; „Feuerball" 78 px (3 Zeilen), „Meteor" 52 (2), „Kettenblitz" 95 (3), „Arkankugel" 86 (3), sieben von elf Namen gebrochen. | **behoben**: unter 480 px drei Zeilen statt zweier Spalten (Name, Mana, Beschreibung), das Sinnbild über alle drei. Nachgemessen: kein Name bricht mehr, nur die Ultimate („Konfetti-Kataklysmus des jüngsten Gerichts", 363 px in 304) steht zweizeilig, am Wortzwischenraum. |
| 6 | **Die Münze hängt unter ihrer Zeile.** `body.cfuiIco .ico` ist ein `inline-block` mit `font-size:0`; die Grundlinie eines solchen Kastens ist die seiner (leeren) Inhaltszeile am oberen Rand, und `vertical-align:-3px` schiebt den ganzen Kasten unter die Schrift. | alle drei | Amtsfenster, „Bankguthaben: 💰 0": Absatz 31 px hoch statt 17, Münze 15 px unter der Zeilenoberkante. Dasselbe in der Statusspalte oben rechts und im Dienstbericht. | **behoben**: `overflow:hidden` am Sinnbild, damit ist die Grundlinie die Unterkante. Absatz 17 px, Münze auf der Zeile. Die Knöpfe mit Flex-Ausrichtung (Gürtel, Reiter) sind davon unberührt, gesehen im Abzug. |
| 7 | **Die Kammeransage läuft rechts hinaus.** Die großen Floater („KAMMER · SCHWIERIGKEIT 2", „MASSENVORGANG ERÖFFNET") werden mit `textAlign` `start` am Spieler gezeichnet; am Telefon steht der in der Bildmitte. | 390×844 | Zeile 259 px (Courier New 900 18px), Beginn bei x 195, Ende bei 454 in 390: 64 px hinaus. | **behoben**: große Floater mittig über dem Spieler und in den sichtbaren Ausschnitt geklemmt (6 px Rand). Die kleinen Zahlen bleiben, wie sie waren. |
| 8 | **Knöterichs Zettel liegt über der Ortszeile**, wenn die zwei Zeilen hat. `#knZettel` steht fest bei `top:46px`, die Ortszeile bei `--reiheY` (76 px) und bricht bei „Kammer · Schwierigkeit 2 · Raum 1/2" um. | 390×844 | Zettel 40 bis 92, Ortszeile 76 bis 115: 16 px Überlappung über 100 px Breite („Schwierigkeit" verdeckt). 844×390: 2 px Berührung, keine Überdeckung. | **offen**, Vorschlag: am schmalen Fenster den Zettel unter die Ortszeile (`top:calc(var(--reiheY) + 2 Zeilen)`) oder die Ortszeile einzeilig mit Auslassung. Beides ändert U7-Geometrie und gehört gemessen, nicht nebenbei. |
| 9 | **Der Innenraum sitzt am Telefon oben, darunter ist es schwarz.** Die Kamera hängt am Spieler; der Raum ist 544×352 px groß und kleiner als das Fenster. | 390×844 | Raum von y 110 bis 462, darunter 382 px Schwarz; seitlich von x −45 bis 499 (54 px je Seite abgeschnitten). 844×390: Raum von y −117 bis 235, der Schrank mit der Tafel oben aus dem Bild. 1280×720: 48 bis 400, mittig. | **offen**, Vorschlag: die Kammer klemmt ihre Kamera an den Raum (`skript/05`, Rechnung mit `rechts - links <= canvas.width`); derselbe Weg für `innen`. Ein eigener Schritt mit `innen-pruef`. |
| 10 | **Die Gesprächstafel öffnete im ersten Abzugslauf nicht.** Kein Spielfehler: `gespraechTick()` schließt sie wegen der Entfernung, der Lauf stand am falschen Ort. | alle drei | Nachgeholt mit dem Spieler neben der Figur: Tafel offen, Porträt, vier Antworten, auf allen drei Formaten im Bild. | kein Befund am Spiel; der Lauf stellt den Spieler jetzt daneben (steht so im Kopf des Werkzeugs). |
| 11 | **Startbild und Dienstschluss rollen auf dem liegenden Telefon**, der Knopf steht unter der Kante. | 844×390 | Startbild: Knopf ab y 375 in 390. Dienstschluss: WEITER von 340 bis 388. | bleibt, wie in RL2 und RL4 entschieden: `#overlay` rollt. |

**Was ohne Befund abgenommen ist:** der Rahmen-Skin aus `UI_Frames.png` sitzt
auf allen drei Formaten (Fensterköpfe, Reiterband, Knöpfe, Rundknopf des
Schließens), die Porträts stehen im Gespräch und am Ausweis, die Figuren
laufen auf ihren Blättern, Kammer (beide Dungeon-Sätze) und Schattenland
tragen ihre Böden, die Karte, die Mappe, der Rucksack, Kochen, die Optionen
und das Amtsfenster stehen auf allen drei Formaten im Fenster. Das sind die
Punkte, die RL4 unter „Nicht abgenommen" offen gelassen hatte.

## 4. Der Nebenbefund SZ4: Regen und Konfetti im Abspann

Gezählt am Ende jedes Abzugslaufs, auf Blatt 13: `particles.length` 0,
`decalN` (Bodenkonfetti) 0, `weatherSnow` 0, `weatherWind` 0, `weatherClouds`
20 (das Grasland-Wetter der angehaltenen Welt dahinter). Es gibt im Spiel
**kein Regensystem**: `skript/02` kennt Wolken, Schnee und Böen, sonst nichts.
Der Regen auf Blatt 10 ist ein Satz, das Konfetti auf Blatt 4 auch, und beides
steht so in `phase-sz4-finale.md` unter „Bewusst offen". Der Befund ist damit
kein Fehler, sondern eine Entscheidung, die weiter steht; wer sie ändern will,
baut einen Partikelregen auf einer angehaltenen Welt und einen Regen, den es
noch nicht gibt. Beides ist eine eigene Runde.

## 5. Entscheidungen

* **Die Lead-Regel wird eingeschränkt, nicht die Texte umgeschrieben.**
  Die Alternative wäre gewesen, die Szene jedes Abspannblatts in `stimme` zu
  verlegen. Das ist Kanonarbeit an SZ4 und T2, und sie hätte am 1280er
  Fenster nichts verbessert. Die CSS-Regel traf ein Feld, das es bei ihrer
  Entstehung noch nicht gab.
* **Die Tafel sagt, dass sie rollt, statt kleiner zu werden.** Blättern statt
  Rollen gilt für den Vordruck (E2); ein Standbild blättert nicht (SZ4). Was
  fehlte, war die Zeile aus RL4.
* **Der Amtstitel bricht mitten im Wort.** Dieselbe Entscheidung wie RL2 für
  die Gesprächskopfzeile. Ein weicher Trennstrich in `RAENGE` würde in jedem
  Guard, jeder Zählung und jedem Vergleich mitlaufen; `hyphens:auto` steht
  daneben und greift, wo ein Wörterbuch da ist.
* **Die Münze wird am Sinnbild behoben und nicht an der Fundstelle.** 53
  Fundstellen tragen `.ico` (gezählt am 04.10.2026 über `index.html` und
  `skript/`); die Grundlinie war an allen falsch,
  sichtbar wurde es an der Münze, weil sie neben einer Zahl steht.
* **Die Hinweiszeile zählt im Messlauf nicht mit.** `intro-pruef` erntet
  den Panelinhalt ohne Kopfzeile, Blattzahl und Knöpfe; `.amtMehr` steht
  seither auf derselben Liste. Ohne das hätte der Pflichtweg 840 statt 804
  gemessen (sechs Blätter Ernennung mal sechs Wörter), und niemand hätte ein
  Wort mehr gelesen. Nachgemessen: 804, 906, 1169, 662, wie vor der Zeile.
* **Die Kamera im Innenraum und der Zettel bleiben offen.** Beides ist
  Geometrie aus IN1 und U7 mit eigenen Prüfläufen, und beides verträgt keine
  Zeile im Vorbeigehen.

## 6. Abnahme

| Prüfung | Ergebnis |
|---|---|
| `node --check` über sieben Dateien und das neue Werkzeug | still |
| alle 18 Prüfläufe nach den Korrekturen, mit Grafik | siehe Prüfprotokoll unten |
| Nachkontrolle der Befunde 1 bis 7 auf drei Formaten | Lead sichtbar (`display:block`) auf 844×390; Hinweiszeile steht, wo gerollt wird, und fehlt, wo nicht; kein `.amtStimme` mit Überlauf; Ausweisfelder 228 von 228; kein Zaubername gebrochen; Münze auf Zeilenhöhe (Absatz 17 px); Konsole still |

## 7. Prüfprotokoll

Alle 18 Prüfläufe nach den Korrekturen, 04.10.2026, mit Grafik, nacheinander gegen `serve.py`:

| Lauf | Ergebnis |
|---|---|
| `anlage2` | 123 von 123 |
| `ebene` | 54 von 54 |
| `empfang` | 150 von 150 |
| `gespraech` | 89 von 89 |
| `innen` | 21 von 21 |
| `intro` | Messlauf ohne Abbruch, Pflichtweg 804 |
| `ladelauf` | still, 12x „in Ordnung", 0 Warnungen |
| `langvorgang` | 58 von 58 |
| `menue` | 78 von 78 |
| `mitteilung` | 32 von 32 |
| `reich` | 59 von 59 |
| `schluss` | 36 von 36 |
| `speicher` | 38 von 38 |
| `steuerung` | „Alles in Ordnung" |
| `stopfen` | 43 von 43 |
| `szene` | 50 von 50 |
| `versuchung` | 67 von 67 |
| `zulagen` | 50 von 50 |

Dieselben Zahlen wie vor den Korrekturen (Abschnitt 1); kein Lauf hat eine Zeile verloren oder gewonnen, und `ladelauf` ist mit Grafik weiter still.

## Offen

* Befund 8 (Zettel über der Ortszeile) und Befund 9 (Kamera im Innenraum),
  je mit Vorschlag oben.
* Der Trennstrich im Amtstitel auf einem echten Gerät: hier eine Vermutung,
  dort ein Blick.
* Das Bild ist auf drei Fenstergrößen gesehen, nicht auf einem Telefon in der
  Hand. Was `deviceScaleFactor` 3, ein Daumen und ein echter Lautsprecher
  anders machen, steht weiter auf der Liste des Projektinhabers.

---

## Nachtrag, 04.10.2026: Befund 8 und 9 gebaut

Auf Zuruf des Projektinhabers, nach dem Merge von RL7 (`4b4fb66`).

**Befund 8, der Zettel über der Ortszeile.** Kein Breakpoint, sondern ein
Maß beim Zeigen: `knBandLage()` (in `skript/04`, vor `knDisplayZettel()`) liest
die Lage von `#zone` und rückt Zettel oder Randnotiz unter die Zeile, wenn
sich beide in der Breite überschneiden; sonst bleibt das Band bei seinen
46 px. Der Übergang auf `top` ist aus dem CSS genommen, sonst fuhr das Band
eine Fünftelsekunde über die Zeile, bevor es darunter stand. Zwölf statt sechs
Pixel Abstand, weil das Band beim Einblenden sechs Pixel von oben
herunterfährt; mit sechs stand es in dieser Viertelsekunde 0,3 px in der
Zeile (gemessen auf 360×640, dort ist die Ortszeile der Kammer dreizeilig).
`steuerung-pruef` misst seither auf allen vier Formaten, dass weder Zettel
noch Randnotiz die Ortszeile berühren und der Zettel im Fenster steht.

**Befund 9, die Kamera im Innenraum.** `innenKamera()` (in `skript/05`, neben
`kammerKamera()`, gleiche Rechnung, gleicher Rand von 24 px): passt der Raum
ins Fenster, steht er mittig, ist er breiter, hält die Klemme die Wand im
Bild. Gerufen in `update()` hinter der Kamerafahrt und in `betreteHaus()`
sofort nach `camSnap()`, weil der Empfang die Welt anhält und `update()` dort
nicht läuft. Gemessen danach: 390×844 Raum von y 246 bis 598 statt 110 bis
462, mittig; 844×390 Raum von y 0 bis 352 mit Oberkante im Bild statt −117;
1280×720 unverändert mittig. `innen-pruef` prüft es in drei Fenstern, sofort
nach dem Betreten und nach dreißig Rahmen (27 von 27, war 21).

Beides für Spieler sichtbar, deshalb ein Punkt in der Hausmitteilung
(Stempel `2026-10-04-rl7b`).

Prüfprotokoll des Nachtrags: alle 18 Läufe am 04.10.2026 mit Grafik grün,
darunter `innen` 27 von 27, `steuerung` „Alles in Ordnung" auf vier Formaten,
`empfang` 190 von 190, `gespraech` 89 von 89, `mitteilung` 32 von 32,
`ladelauf` still mit null Warnungen.
