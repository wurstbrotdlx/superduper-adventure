## G12: Der Rest des Steinbruchs — die Vermessung und die Entscheidungen (24.08.2026)

G11 hat den ersten Griff in den Deko-Steinbruch getan (Koppel, Schild, Boot) und
am Ende aufgeschrieben, was liegen blieb: *„Punkt 7 des Bestands nennt außerdem
Brücken, Wasserpflanzen, Kapybaras und rund dreißig Ambiente-Tiere. Das ist eine
eigene Runde mit eigenem Messprotokoll."*

Das hier ist diese Runde, und sie fängt mit dem Messprotokoll an statt mit dem
ersten Setzer. Der Grund steht in G11: die Koppel stand im ersten Anlauf im Wald
neben einem Frostgeist, weil vorher niemand nachgesehen hatte, wie diese Karte
wirklich aussieht. Dreimal dieselbe Lehre reicht.

---

## 1. Der Fund vor der ersten Zeile Code: die Krähen gibt es nicht

Punkt 7 des Bestands nennt in einer Zeile „Krähen, Frösche, Gänse, Enten,
Schmetterlinge, Bienen, Mäuse, Schwäne, ~30". Im Manifest steht unter
`Cute_Fantasy/Animals/` kein einziger Krähenvogel. Das einzige Wort im ganzen
Manifest, das die Suche nach `crow` findet, ist **Scarecrow** — die
Vogelscheuche, also gerade das Gegenteil.

Was es wirklich gibt, gezählt statt geschätzt:

| Art | Dateien | Blattmaß | Rasterangabe des Manifests |
|---|---|---|---|
| Frosch | 6 (`Frog_01` bis `Frog_06`) | 320x128 | `fw8 fh32`, Konfidenz 0,13 — unglaubwürdig, s. unten |
| Gans | 6 (`Goose_01` bis `Goose_06`) | 384x512 | `fw32 fh32`, 12x16, Konfidenz 0,05 |
| Ente | 5 (4 Farben plus `Duck_in_a_hat`) | 256x640 | `fw32 fh32`, 8x20, Konfidenz 0,07 |
| Maus | 4 (`Mouse_01` bis `Mouse_04`) | 320x128 | `fw8 fh32`, Konfidenz 0,03 |
| Biene | 3 (Flug, Stock, Nest) | 64x32 | `fw16 fh16`, 4x2 |
| Schwan | 3 (`Swan_01` bis `Swan_03`) | 256x640 | `fw32 fh32`, 8x20 |
| Schmetterling | 1 | 16x64 | `fw8 fh8`, 2x8, Konfidenz 0,85 |
| **Summe** | **28** | | |

Also achtundzwanzig statt „rund dreißig", und keine davon fliegt als Krähe.
Die Bestandszeile ist im Bestand selbst berichtigt (dortige Fußnote vom
24.08.2026), nicht gelöscht: der Bestand ist ein datiertes Dokument und bleibt
lesbar, wie er war.

**Die Konfidenzwerte sind die eigentliche Warnung.** Bei `Frog_01` behauptet die
Heuristik 8 Pixel Bildbreite auf einem 320x128-Blatt — das wären 40 Spalten.
Vierzig Frames für einen Frosch, der hüpft, ist keine Frameanzahl, das ist eine
gescheiterte Messung. Wahrscheinlicher ist 32x32 in 10x4. Wahrscheinlich reicht
hier aber nicht: die Raster werden am PNG gemessen (leere Spalten, leere Zeilen,
Alpha-Bounding-Box je Zelle), so wie bei den G4-Böden, beim Boot aus G11 und bei
jedem Blatt davor. Regressionsregel 7/12 gilt weiter, und das Manifest ist bei
Requisiten- und Rigblättern kein Zeuge, sondern ein Verdächtiger.

## 2. Das Werkzeug: `tools/wasser-messlauf.mjs`

Drei der offenen Posten liegen im Wasser (Pflanzen, Wasservögel, Brücken), und
über das Wasser dieser Welt wusste bisher kein Dokument etwas. Der neue Messlauf
liest die wirklich erzeugte Karte nach `genMap()` und beantwortet vier Fragen:

1. **Wie viel Uferwasser gibt es, und wie viel davon sieht überhaupt jemand?**
   Sichtbar heißt: an die Wasserkachel grenzt Land, das `reachbar()` zulässt.
   Der Saum einer Deko-Insel zählt nicht — dort kommt niemand hin.
2. **Wie geborgen liegt das Uferwasser?** Landanteil im Umkreis von vier
   Kacheln. Eine Seerose gehört in eine Bucht, nicht in die offene Tilgung.
3. **Wie weit ist das Wasser von dem entfernt, wohin der Spieler wirklich
   läuft?** Einmal gegen die Wege gemessen, einmal gegen die Kammertüren.
4. **Lohnt eine Brücke?** Gesucht sind Engen bis sechs Kacheln Wasser zwischen
   zwei erreichbaren Landkacheln, und zu jeder Enge der Umweg, den eine Brücke
   dort spart — Fußweg über Land per Flutfüllung von der einen Seite zur
   anderen.

**Über drei Startwerte statt über einen.** Die Karte ist prozedural, ein Befund
über eine einzige Welt wäre geraten. Der Startwert steht als Literal in
`index.html` (`mulberry32(20260805)`), also schreibt der Lauf ihn beim Ausliefern
der Seite um (`page.route`) und misst drei Welten. Kommt das Literal nicht genau
einmal vor, bricht er ab — eine stillschweigend wirkungslose Ersetzung wäre
schlimmer als gar keine. Denselben Weg gingen die Bandgrenzen in W-Groß über
sechs Startwerte, nur von Hand; jetzt ist er ein Werkzeug.

## 3. Die Messung

```
PLAYWRIGHT_PFAD=… CHROMIUM=… node tools/wasser-messlauf.mjs
```

| Startwert | Meer | Land | Strand | Inselkacheln | Uferwasser | davon sichtbar | Bucht | offen | Median Geborgenheit |
|---|---|---|---|---|---|---|---|---|---|
| 20260805 | 16576 | 85824 | 2348 | 295 | 1544 | 1373 | 583 | 790 | 0,48 |
| 20260806 | 17644 | 84756 | 2402 | 361 | 1603 | 1433 | 523 | 910 | 0,47 |
| 20260807 | 14936 | 87464 | 2265 | 360 | 1489 | 1328 | 581 | 747 | 0,48 |

Rund 89 Prozent des Uferwassers grenzt an begehbares Land. Etwa vier von zehn
Uferkacheln liegen geborgen genug für eine Bucht.

**Und jetzt die Zahl, die alles andere entscheidet:**

| Startwert | Uferwasser im Umkreis 60 ums Dorf | nächstes Uferwasser | nächstes am Weg | Boot aus G11 vom Dorf |
|---|---|---|---|---|
| 20260805 | **0** | 120 Kacheln | 89 | 118 |
| 20260806 | **0** | 105 Kacheln | 96 | 103 |
| 20260807 | **0** | 126 Kacheln | 88 | 126 |

Im ganzen Umkreis von sechzig Kacheln um das Dorf gibt es **keine einzige
Wasserkachel**. Das Dorf liegt in der Mitte einer 320x320-Karte, das Meer am
Rand; dazwischen liegen rund hundert Kacheln Land. Und die Wege helfen nicht: die
laufen ums Dorf, das nächste Uferwasser an einem Weg liegt achtundachtzig
Kacheln weit weg.

Ein Entenpaar im Dorfteich ist damit keine Bauentscheidung, sondern eine
Unmöglichkeit. Es gibt keinen Dorfteich.

**Die Küste ist trotzdem kein toter Winkel — sie ist Vorgangsgebiet:**

| Startwert | Kammertüren | Uferwasser ≤20 von einer Tür | ≤40 | nächste Tür am Uferwasser |
|---|---|---|---|---|
| 20260805 | 25 | 207 (15 %) | 759 (55 %) | 4 Kacheln |
| 20260806 | 25 | 313 (22 %) | 902 (63 %) | 2 Kacheln |
| 20260807 | 25 | 349 (26 %) | 897 (68 %) | 1 Kachel |

Was den Spieler aus dem Dorf hinausführt, sind nicht die Wege, sondern die
Kammertüren — und die stehen bis auf eine Kachel an den Strandsaum. Je Schicht
liegt über die Hälfte des sichtbaren Uferwassers innerhalb von vierzig Kacheln um
eine Tür. Wer Kammern arbeitet, kommt ans Wasser, nur eben nicht auf dem Weg
dorthin, sondern am Ziel.

## 4. Die Brücken sind gestorben, und zwar an Zahlen

| Startwert | Engen ≤6 Kacheln | ohne Landweg | Umweg ≥30 | Median Umweg | größter Umweg | beste Enge |
|---|---|---|---|---|---|---|
| 20260805 | 42 | 0 | 0 | 7 | 17 | spart 12 Kacheln, 186 vom Dorf |
| 20260806 | 43 | 0 | 0 | 8 | 15 | spart 8 Kacheln, 182 vom Dorf |
| 20260807 | 50 | 0 | 0 | 8 | 13 | spart 6 Kacheln, 175 vom Dorf |

Es gibt also durchaus vierzig bis fünfzig Stellen, an denen eine Brücke stehen
*könnte*. An keiner einzigen davon würde sie etwas verkürzen: der größte Umweg
über die ganze Karte und über drei Startwerte beträgt siebzehn Kacheln, im Mittel
sieben. Eine Brücke, die zwölf Kacheln Fußweg spart, an einer Stelle
hundertsechsundachtzig Kacheln vom Dorf, ist Ausstattung, die so tut, als wäre
sie Infrastruktur. Genau das hat M3 bei Schienen ohne Lore und einer Leiter ohne
zweite Ebene abgelehnt, und es gilt hier unverändert.

Bleibt die Brücke zur Insel. Die ist nicht nur nutzlos, sie ist verboten:

| Startwert | kürzester Abstand Deko-Insel zu erreichbarem Land |
|---|---|
| 20260805 | 8,1 Kacheln |
| 20260806 | 7,0 Kacheln |
| 20260807 | 8,9 Kacheln |

Sieben bis neun Kacheln Brücke wären ein Korridor, und Korridore sind in dieser
Welt ausdrücklich untersagt — `genMap()` Schritt 3 schreibt es hin: *„Der Spieler
kann nicht schwimmen, eine erreichbare Insel bräuchte eine Landbrücke — und eine
Landbrücke ist ein Korridor, also genau die Geometrie, die ohne Wegfindung
gefährlich ist."* Das Spiel hat keine Wegfindung, Monster steuern per `atan2`.
Eine Inselbrücke wäre die klassische Falle, in der ein Verfolger hängen bleibt.

**Entscheidung: keine Brücken.** Nicht „später", sondern begründet nicht. Wer sie
doch will, braucht vorher einen Grund auf der Karte — einen See, der die Welt
teilt, oder eine Wegfindung. Beides ist ein Bauabschnitt und keine Deko.

## 5. Warum das Boot bleibt, wo es steht

Der Messlauf hat nebenbei nachgerechnet, was G11 nie gemessen hat: das Boot liegt
auf der dem Dorf nächsten Strandkachel, und die ist **103 bis 126 Kacheln
entfernt**. Das Boot sieht also fast niemand.

Der naheliegende Schluss wäre, es an eine Kammertür zu setzen, wo Leute
hinkommen. Der ist falsch, und der Grund ist eine Lebensdauer:

* `decos` entstehen **einmal** in `genMap()` beim Skriptstart und bleiben die
  ganze Partie stehen — sie sind persistent wie `trees` und die Wolken.
* `kammerTueren` werden in `setzeKammerTueren()` **je Schicht neu gewürfelt**.

Ein Boot, das zur Tür gesetzt würde, stünde ab der zweiten Schicht wieder im
Nirgendwo, nur diesmal mit einer Begründung, die nicht mehr stimmt. Also bleibt
es liegen, und die Zahl steht ab jetzt geschrieben: es ist eine Landmarke für
den, der an diesen Strand kommt, und für sonst niemanden. Das passt zu dem, was
es darstellt — ausgelagerte Bestände gelten laut Namensregister als „angeblich
erreichbar, nie geprüft".

Für die Wasserdeko folgt daraus die Setzregel: **nicht ans Dorf binden** (dort
ist kein Wasser), sondern über die ganze Küste streuen. Über eine Partie hinweg
wandern die Türen durch alle fünf Bänder, und damit kommt jeder Küstenabschnitt
einmal dran.

## 6. Was gebaut wird, was liegen bleibt

| Posten | Entscheidung | Begründung |
|---|---|---|
| **Brücken** (6 Dateien) | **abgelehnt** | Größter Umweg 17 Kacheln, Insel wäre Korridor. Abschnitt 4. |
| **Wasserpflanzen** (Schilf, Seerosen, Wassergras) | **gebaut**, über die Küste gestreut | 1328 bis 1433 sichtbare Uferkacheln, über die Hälfte je Schicht türnah. Seerosen nur in Buchten (Geborgenheit ≥ 0,5), Schilf und Wassergras auch an offener Küste. |
| **Wasservögel** (Ente, Gans, Schwan) | **gebaut**, an Buchten | Dieselbe Fläche, aber als Rig statt als Setzer. Schwimmen heißt: begehbar ist für sie genau das Gegenteil von `walkPx()`. |
| **Frösche** | **gebaut**, am Übergang Ufer/Land | Die einzige Art, die beide Seiten braucht. |
| **Kapybaras** (12 Dateien) | **gebaut**, in Buchten, sparsam | Sechs Blätter reichen (Idle, Dive, Emerge, Bubbles, LookAround, LookAround_submerged); das Albino-Set bleibt liegen. Ein Tier, das taucht, ist die einzige Ambiente-Art mit einem Zustandswechsel. |
| **Schmetterlinge, Bienen** | **gebaut**, im Dorf und am Weidegürtel | Die einzigen der Liste, die kein Wasser brauchen — und damit die einzigen, die dort auftauchen, wo der Spieler ohnehin steht. |
| **Mäuse** | **gebaut**, an Gebäuden und am Lager | Kein Wasser nötig, und eine Maus an der Amtsfassade ist die billigste Pointe des ganzen Pakets. |
| **Krähen** | **gestrichen** | Gibt es im Pack nicht. Abschnitt 1. |
| **`House_Decor`** (26 Dateien) | **bleibt liegen** | Der Bestand hängt es selbst an „wenn Innenräume kommen". Es gibt keine Innenräume. |

## 7. Die Lieferliste

Die Rohbibliothek `Graphics/` liegt aus Lizenzgründen in keinem Repo (siehe
`assets/cf/README.md`), und in einer frischen Websitzung ist sie nicht da. Der
Bauteil dieser Runde braucht deshalb **dreiundzwanzig Dateien im privaten
Assets-Repo**, Originalnamen behalten wie bei allen bisherigen (fünfzehn Rigs,
acht Pflanzenblätter):

**Nach `deco/Animals/`**, aus `Graphics/Cute_Fantasy/Animals/`:

| Quelle | Datei | Manifest-Raster | am PNG nachzumessen |
|---|---|---|---|
| `Duck/` | `Duck_01.png`, `Duck_02.png` | 256x640, 32x32, 8x20 | Zeilenzuordnung (20 Zeilen, davon die Hälfte gespiegelt), Fußlinie |
| `Swan/` | `Swan_01.png` | 256x640, 32x32, 8x20 | dito |
| `Goose/` | `Goose_01.png` | 384x512, 32x32, 12x16 | dito, andere Spaltenzahl |
| `Frog/` | `Frog_01.png`, `Frog_02.png` | 320x128, angeblich 8x32 | **Raster zuerst**, 40 Spalten sind gescheiterte Heuristik |
| `Mouse/` | `Mouse_01.png` | 320x128, angeblich 8x32 | dito |
| `Butterfly/` | `Butterfly.png` | 16x64, 8x8, 2x8 | Anker (fliegt, kein Fußpunkt) |
| `Bee/` | `Bee_Flying_Animation.png` | 64x32, 16x16, 4x2 | dito |
| `Kapybara/` | `Kapybara_Idle.png`, `_Dive.png`, `_Emerge.png`, `_Bubbles.png`, `_LookAround.png`, `_LookAround_submerged.png` | je einzeln | Wasserlinie als Anker, wie beim Boot (y45 statt Blattunterkante) |

**Nach `deco/Outdoor/`**, aus
`Graphics/Cute_Fantasy/Outdoor decoration/Outdoor_Decor_Animations/Water_Decor_Animations/Water_Plants/`:
`Cattail_1_Anim.png`, `Cattail_2_Anim.png`, `Cattail_3_Anim.png`,
`Lillypad_Green_1_Anim.png`, `Lillypad_Green_2_Anim.png`,
`Lillypad_Green_3_Anim.png`, `Water_Grass_1_Anim.png`, `Water_Grass_2_Anim.png`
— alle 128x16, acht Frames à 16x16, Konfidenz 1. Das sind die einzigen Blätter
dieser Runde, deren Raster das Manifest glaubwürdig kennt.

`Bridge_Wood.png` steht **nicht** auf der Liste. Siehe Abschnitt 4.

---

## Prüfprotokoll dieser Runde

Server auf Port 8378, `index.html` im Wurzelverzeichnis, Playwright-Chromium der
Umgebung.

| Lauf | Ergebnis |
|---|---|
| `index.html` im Browser | **17** Guard-Zeilen, keine Warnung, keine Fehlermeldung, `frameNo` 154 |
| `node --check` auf den neuen Messlauf | sauber |
| `tools/wasser-messlauf.mjs`, drei Startwerte | läuft durch, Zahlen oben |
| Startwert-Umschreibung gegengeprüft | Literal genau einmal getroffen; die drei Läufe liefern drei verschiedene Küsten (Meerkacheln 16576 / 17644 / 14936) |

`index.html` ist in diesem Schritt **unverändert**. Diese Runde misst und
entscheidet; gesetzt wird, sobald die dreiundzwanzig Blätter im Assets-Repo
liegen.

## Bewusst offen

* **Der Bauteil selbst.** Setzer, Rigs, Guard und Abnahme im Bild stehen aus und
  hängen an der Lieferliste aus Abschnitt 7.
* **`CRITTERS` kennt bis heute nur eine Bauart.** Fünf Arten, je zwei Zeilen
  (`idle`, `walk`), alle laufen auf begehbarem Grund und prallen an allem ab.
  Eine Ente braucht das Gegenteil von `walkPx()`, ein Schmetterling gar keine
  Bodenprüfung, ein Kapybara einen Zustandswechsel. Die Tabelle, die das trägt,
  entsteht mit dem Bauteil und nicht vorher — eine Tabelle ohne Einträge wäre
  dieselbe Behauptung, die dieser Runde die Brücken gekostet hat.
* **Die Wüste bleibt unangetastet.** `Cute_Fantasy_Desert` steht seit G11 im
  Manifest und ist weiter unbenutzt. Ob die Aschewüste ein eigenes Set bekommt,
  ist eine Frage an die Weltbibel.
* **Die Schmetterlinge sind der einzige Posten, der ins Dorf reicht**, und damit
  der einzige, den ein Spieler in der ersten Minute sieht. Wenn von dieser Runde
  nur ein Stück gebaut würde, dann dieses.
