## G12: Der Rest des Steinbruchs — ERLEDIGT (24.08.2026)

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

## 7. Die Lieferung, und was am PNG anders aussah als im Manifest

Dreiundzwanzig Blätter liegen seit dem 24.08. im privaten Assets-Repo (Liste und
Begründungen in `assets/cf/README.md`, Abschnitt „Von G12 gebraucht"). Jedes
Raster ist mit `node tools/sheet-audit.mjs --rig` am PNG gemessen worden, keines
aus `manifest.json` übernommen. Das war kein Ritual:

| Blatt | Manifest | gemessen |
|---|---|---|
| `Frog_01.png` | `fw8 fh32`, also 40 Spalten | **10x4 zu 32x32** |
| `Mouse_01.png` | `fw8 fh32` | **10x4 zu 32x32** |
| `Duck_01.png` | 8x20 zu 32x32, Konfidenz 0,07 | stimmt, Konfidenz hin oder her |
| Wasserpflanzen | 8x1 zu 16x16, Konfidenz 1 | stimmt |

Vierzig Frames für einen Frosch, der hüpft, ist keine Frameanzahl, sondern eine
gescheiterte Messung — und sie hätte beim Einbau nicht gekracht, sondern nur ein
Achtel Frosch gezeigt.

**Zwei Funde stehen in gar keiner Zahl.** Sie kommen aus dem Kontaktbogen, also
daher, dass jemand die Blätter angesehen hat:

* **Ente und Schwan tragen ihre Wasserzeilen selbst.** Zeile 7 ist die Ruhe im
  Wasser, Zeile 8 das Schwimmen — beide mit gemalter Wasserlinie unter dem Tier,
  die Zeilen 0 und 1 sind dieselben Vögel an Land ohne Linie. Das Spiel lädt
  genau die zwei Wasserzeilen. Ohne diesen Blick wäre eine Ente auf dem Meer
  gestanden wie auf einer Wiese.
* **Die Gans hat keine.** Acht Zeilen je Blickrichtung, keine mit Wasserlinie.
  Im Pack ist sie ein Landvogel, also wird sie im Spiel einer und watet am
  Strand statt zu schwimmen.

Dazu zwei kleinere: `Butterfly.png` ist kein Rig mit acht Posen, sondern
**zwei Frames Flügelschlag in acht Farben**, eine je Zeile (drei sind verbaut).
Und `Frog_01.png` hat vier Zeilen, von denen keine läuft — Blinzeln, Quaken,
Zunge, Treffer. Deshalb sitzt der Frosch im Spiel und wandert nicht: ein
wandernder Frosch wäre dieselbe Behauptung wie ein Zaun ohne Leine in G11.

## 8. Das Kapybara bringt seinen eigenen Teich mit

Die zwölf Kapybara-Dateien sind die einzigen im ganzen Pack, bei denen jede
Zelle zu drei Vierteln ein **deckendes** Rechteck Wasser ist. Im Kontaktbogen
leuchten sie blau, wo jedes andere Blatt durchsichtig ist.

Gemessen: dieser Ton ist `rgb(0,149,233)` — und `Tiles/Water/Water_Middle.png`,
aus dem das Spiel seine See baut, ist ein 16x16-Feld in genau demselben Wert.
Der Zeichner hat das Tier auf seine eigene Wasserkachel gesetzt.

Das klingt nach Glück und ist keins: `computeTile()` backt den Ozean nicht roh,
sondern getönt (`TILE_TINT.tiefsee`, `#2f6ea8` zu 45 Prozent, seit W-Groß). Ein
ungetöntes Blatt darauf wäre ein zwei Kacheln breites, deutlich helleres
Rechteck — und im Schattenland (`shadowDeep`, `#1a0630` zu 72 Prozent) ein
Leuchtkasten.

Zwei Wege gab es. Das Blatt beim Zeichnen mitzutönen hätte dieselbe Tönung an
zwei Stellen gebraucht und im Schattenland eine dritte. Oder den Grund
wegzunehmen und das Tier über die wirkliche See zu zeichnen — dann stimmt es in
jedem Band und auf jeder Tönung, ohne dass es irgendwo nachgezogen werden muss.

`tools/kapybara-freistellen.mjs` geht den zweiten Weg. Es nimmt **genau diesen
einen Ton** bei voller Deckung weg und lässt die Wellenringe (`0,109,168`)
stehen: die sind Zeichnung, nicht Hintergrund. Auf der getönten See (rund
`21,131,204`) lesen sie sich weiter als das, was sie sind. Der Lauf bricht ab,
wenn kein Pixel im Grundton gefunden wird oder wenn weniger als 40 oder mehr als
95 Prozent wegfallen — eine stillschweigend wirkungslose Ersetzung wäre
schlimmer als keine. Gefallen sind 79 bis 88 Prozent je Blatt. `--pruef`
schneidet nichts und rechnet nur nach, wie bei `tools/ui-zellen.mjs`.

## 9. Was jetzt wo steht

**Die Buchten werden gesucht, nicht gesetzt** — dieselbe Bauart wie die Koppel
in G11, und aus demselben Grund: eine feste Kachel läge je nach Lauf im offenen
Meer. Gesucht wird die Wasserkachel mit der höchsten Geborgenheit, die
erreichbares Land in zwei Kacheln Umkreis hat; genommen werden sechs davon mit
mindestens vierzig Kacheln Abstand (dieselbe Zahl wie bei den Kammertüren, aus
demselben Grund: sonst liest man zwei Buchten als eine).

**Ohne `rng()`.** Jeder Griff in den Zufallsstrom verschöbe alles, was danach
kommt — die Wolken hängen daran — und machte aus derselben Startzahl eine andere
Welt. Die Streuung kommt deshalb aus `tileHash()`, wie die Kachelwahl in
`pickCfTile()`.

Je Bucht: Schilf und Wassergras an den Kanten, Seerosen im Freien (eine Seerose
am Strand sähe angeschwemmt aus), zwei bis drei Vögel mit Revier, ein Frosch auf
der nächsten erreichbaren Uferkachel, an jeder dritten Bucht zwei Gänse an Land,
und in den zwei geborgensten je ein Kapybara. Im Dorf zwölf Flieger und drei
Mäuse an drei Gebäuden — die einzigen dieser Runde, die ein Spieler in der ersten
Minute sieht, weil sie kein Wasser brauchen.

Gesetzt sind damit auf der Standardkarte: **6 Buchten, 10 Schilf, 45 Seerosen,
17 Tiere im Wasser, 6 am Ufer, 12 in der Luft**, dazu 7 neue an Land (4 Gänse,
3 Mäuse) neben den 18 aus W-Groß.

### `lebensraum`, das Feld, das vorher niemand brauchte

Bis hierher kannte die Sammlung `critters` genau **eine** Bauart: begehbarer
Grund, Abprallen an allem, zwei Zeilen `idle` und `walk`. Fünf Arten, fünfmal
dasselbe. Der Bestand schreibt deshalb, `decos` und `critters` nähmen neue Arten
„ohne Umbau" auf. Für Zaun, Schild und Boot stimmte das. Für alles, was schwimmt
oder fliegt, stimmt es nicht:

| `lebensraum` | Grundprüfung | wer |
|---|---|---|
| `land` | `walkPx()`, wie bisher | Huhn, Schaf, Kuh, Schwein, Gans, Maus |
| `wasser` | `wasserPx()`, das **Gegenteil** | Ente, Schwan, Kapybara |
| `ufer` | keine Bewegung | Frosch |
| `luft` | gar keine | Falter, Biene |

Dazu drei Kleinigkeiten, die daran hängen:

* **`G_ICE` zählt nicht als Gewässer.** Die Eisteiche im Frostkamm und die
  Tümpel der Nassablage sind begehbarer Boden. Eine Ente darauf wäre eine Ente
  auf dem Eis, und das ist ein anderer Witz.
* **Kein Bodenschatten für Wasser und Luft.** Eine Ente wirft keinen Schatten
  aufs Wasser, und ein Falter schon gar keinen in seiner eigenen Flughöhe.
* **Der Anker der Flieger liegt über der Zellmitte** (`ay` größer als `fh/2`).
  Er ist die Stelle im Blatt, die auf der Standposition landet, und was fliegt,
  steht nicht auf ihr. Zehn Blattpixel sind bei `WELT_SC` zwanzig Weltpixel
  Flughöhe. Denselben Kniff nutzt das Boot aus G11 für seine Wasserlinie, nur in
  die andere Richtung.

**Der Falter bleibt trotzdem winzig**, und das ist Absicht: seine Kunst ist 8x8
groß, bei `WELT_SC` also eine halbe Kachel. Ihn größer zu zeichnen hieße, den
Weltmaßstab aus G7 für ein Insekt zu brechen. Die Biene daneben füllt eine ganze
Kachel, weil ihr Blatt 16x16 misst — beide stehen im selben Maßstab, das Pack
hält sie nur für verschieden groß.

### Das Kapybara ist das einzige Tier mit einem Zustand

Vier Zustände, im Kreis: oben treiben, abtauchen, unten blubbern, auftauchen.
Die zwei Übergänge dauern genau so lange wie ihre Blätter (`animLen`), damit kein
halber Tauchgang abgeschnitten wird, und laufen **einmal** statt in Schleife
(`animFrame(..., loop=false)`) — sonst sähe man das Tier im Kreis tauchen, ohne
je unten anzukommen. Bei jedem Wechsel wird `phase` auf `-gameT` gesetzt, sonst
finge der Tauchgang bei einem beliebigen Frame an.

## 10. Ein Fehler, den nur das Bild gezeigt hat

Das erste gesetzte Kapybara saß **halb auf dem Strand**, mit seinen Wellenringen
über dem Sand. Der Guard schwieg dazu, und zwar zu Recht: die Kachel unter dem
Tier war Wasser. Sein Blatt ist aber 32 Pixel breit und deckt bei `WELT_SC` zwei
Kacheln, und der Buchtmittelpunkt ist per Definition die **geborgenste** Kachel,
also die mit dem meisten Land ringsum — fast immer eine Randkachel.

Gesucht wird seither die dem Mittelpunkt nächste Kachel, deren **acht** Nachbarn
alle Wasser sind. Und `steinbruchAssert()` prüft seither genau das, statt nur die
Kachel darunter.

Das ist dieselbe Sorte Fund wie die Koppel im Wald aus G11 und die fünf
unsichtbaren Dorffiguren aus G6: eine Zusage, die auf dem Papier gehalten war und
im Bild nicht.

## 11. `steinbruchAssert()`

Läuft wie `koppelAssert()` direkt hinter `genMap()` und aus demselben Grund: die
Buchten werden gesucht, ihre Lage steht in keiner Tabelle. Er misst die gesetzte
Welt. Was er zusagt:

* Jede Bucht liegt im Wasser, ist mindestens zur Hälfte geborgen, und keine zwei
  liegen näher als vierzig Kacheln beieinander.
* Jede Wasserpflanze steht im Wasser, jedes Schilf an einer Kante, jede Seerose
  frei.
* Jedes Tier steht auf dem Grund, den sein Lebensraum verlangt — das ist die
  Prüfung, die es vor G12 gar nicht geben konnte, weil es nur einen gab.
* Wer eine Grenze hat, steht darin; und wer schwimmt oder fliegt, hat eine.
  Ohne sie wäre eine Ente nach einer Viertelstunde auf offener See.
* Das Kapybara steht mit allen acht Nachbarn im Wasser (Abschnitt 10).

`tools/steinbruch-fehlversuch.mjs` prüft den Guard, wie `monster-fehlversuch.mjs`
den Monsterkatalog prüft: acht Eingriffe in die laufende Welt, jeder einzeln
gesetzt, gemeldet und zurückgenommen.

---

## Prüfprotokoll

Server auf Port 8378, `index.html` im Wurzelverzeichnis, Playwright-Chromium der
Umgebung, `node --check` nach jedem Bauschritt.

| Lauf | Ergebnis |
|---|---|
| `index.html` im Browser | **18** Guard-Zeilen, keine Warnung, keine Fehlermeldung, `frameNo` 154 |
| Startzeile G12 | `6 Buchten, 10 Schilf und 45 Seerosen, 17 im Wasser, 6 am Ufer, 12 in der Luft, 25 an Land.` |
| `node tools/build-single.mjs` | sauber, `dist/index.html` 2604 KB (vorher 2511) |
| `dist/index.html` per `file://` | 18 Guard-Zeilen, keine Warnung, `frameNo` 152 |
| `tools/wasser-messlauf.mjs`, drei Startwerte | läuft durch, Zahlen in Abschnitt 3 |
| `tools/kapybara-freistellen.mjs --pruef` | vier Blätter, alle unverändert zum Schnitt |
| `tools/steinbruch-fehlversuch.mjs` | acht Eingriffe, alle gemeldet, Welt danach grün |
| `tools/figurenfarben-messlauf.mjs` | keine Abweichung |
| `tools/spaziergang-messlauf.mjs` | läuft durch, Befund dazu unten |

**Im Bild angesehen**, mit laufender Welt und echter Kamera: die Entenbucht
nördlich der Aschewüste (Seerosen, Schilf am Saum, zwei Enten, eine Gans am
Strand, ein Frosch am Ufer, das Kapybara zwischen den Seerosen), die
Schwanenbucht am Nordrand, und der Dorfplatz mit Faltern, Biene und Mäusen. Das
erste Bild der Entenbucht ist der Grund, warum das Kapybara jetzt anders gesetzt
wird (Abschnitt 10).

**Die Lebensräume über Zeit gemessen**, weil eine Zusage zum Startzeitpunkt hier
nichts wert wäre — der Guard misst den Anfang, nicht den Verlauf. 300 Sekunden
Spielzeit, 17 942 Bilder, 60 Tiere:

| gemessen | Ergebnis |
|---|---|
| Wassertier auf Land | **0** |
| Landtier im Wasser | **0** |
| Ufertier gewandert | **0** |
| Tier außerhalb seines Reviers oder seiner Koppel | **0** |
| Zustände des Kapybaras | alle vier durchlaufen (oben, ab, unten, auf) |

## Jede neue Prüfung einmal ausgelöst

`node tools/steinbruch-fehlversuch.mjs`, acht Eingriffe in die laufende Welt:

| Eingriff | gemeldet |
|---|---|
| Wasservogel an Land gesetzt | `Wassertier sitzt nicht im Wasser` |
| Wasservogel ohne Revier | `wasser-Tier ohne Revier` |
| Ufertier vom Wasser weggesetzt | `Ufertier sitzt nicht am Wasser` |
| Kapybara an den Buchtrand gesetzt | `Kapybara sitzt am Rand statt im offenen Wasser` |
| Seerose ans Ufer gelegt | `Seerose klebt am Ufer statt frei zu liegen` |
| Schilf ins offene Wasser gestellt | `Schilf steht im offenen Wasser` |
| Wasserpflanze an Land gestellt | `Wasserpflanze steht nicht im Wasser` |
| zwei Buchten übereinandergeschoben | `zwei Buchten liegen näher als vierzig Kacheln beieinander` |

Danach ist die unveränderte Welt grün.

---

## Befund am Rande: der Spaziergang stirbt, und zwar auch ohne G12

`tools/spaziergang-messlauf.mjs` meldet in dieser Umgebung einen Tod nach 12 bis
108 Sekunden bei 0 bis 2 Kills. Das Prüfprotokoll von G11 nennt für denselben
Lauf „25 Kills, Stufe 5, überlebt".

Nachgemessen, bevor daraus ein Rückschritt wird: **derselbe Lauf auf dem Stand
vor G12** (`git stash` auf `index.html`) endet mit 74 und 23 Sekunden bei 1 und 0
Kills. Die Streuung mit G12 (12, 23, 49, 108 Sekunden) enthält beide Werte. Der
Lauf ist hier also nicht reproduzierbar, und der Unterschied kommt nicht aus
dieser Runde — die Monsterbevölkerung entsteht über `Math.random()` und ist bei
jedem Laden eine andere.

Das ist ein Befund und keine Aufgabe für G12. Wer ihn angeht, braucht zuerst
einen festen Startwert für die Bevölkerung, sonst misst das Werkzeug den Zufall.

## Bewusst offen

* **`House_Decor` bleibt liegen** (26 Dateien). Der Bestand hängt es selbst an
  „wenn Innenräume kommen", und die gibt es nicht.
* **Die Brücken bleiben gestrichen**, nicht vertagt. Die Zahlen stehen in
  Abschnitt 4.
* **Die Buchten haben keine Mechanik.** Man kann nichts angeln, nichts füttern,
  nichts einsammeln. Sie sind Ausstattung, und der Bestand hat sie ausdrücklich
  als solche vorgeschlagen. Wer daraus einen Vorgang machen will, baut einen
  Langvorgang und keine Deko.
* **Die zweite Entenfarbe, der zweite Frosch.** `Duck_02.png` und `Frog_02.png`
  liegen im Assets-Repo und werden noch nicht geladen — sie sind der billigste
  nächste Schritt, wenn die Buchten je bunter werden sollen.
* **Kein Tier reagiert auf den Spieler.** Eine Ente, die auffliegt, wenn jemand
  ans Ufer tritt, wäre die nächste Stufe. Sie wäre auch die erste, die eine
  Regel bräuchte statt nur ein Blatt.
* **Die Wüste bleibt unangetastet.** `Cute_Fantasy_Desert` steht seit G11 im
  Manifest und ist weiter unbenutzt. Ob die Aschewüste ein eigenes Set bekommt,
  ist eine Frage an die Weltbibel und nicht an die Dateien.
