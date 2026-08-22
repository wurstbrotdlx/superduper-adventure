# assets/figuren/ — Figurenporträts

Zwanzig Porträts des Ensembles, erzeugt mit Midjourney nach den Prompts in
`figuren-bildprompts.md` (Amiga-Fassung, LucasArts-Karikatur, Kopf bis Brust,
gedeckte Palette).

## Namensschema

Die Nummer ist die Prompt-Nummer aus `figuren-bildprompts.md`, damit Bild und
Prompt ohne Suchen zusammenfinden.

Jede Figur hat zwei Dateien. `NN-name.jpg` ist das Original, wie Midjourney es
ausgegeben hat, unangetastet. `NN-name-px.png` ist die nachbearbeitete Fassung:
auf 128x128 heruntergerechnet (BOX, mittelt den JPEG-Dreck weg), auf 32 Farben
quantisiert, ohne Dithering wieder hochskaliert (NEAREST). Das ist die Fassung,
die man ansieht; das Original ist der Beleg.

| Grundname | Figur | Stand |
|---|---|---|
| `01-knoeterich` | Amtsrat a. D. Knöterich | abgenommen |
| `02-zwirn` | Bürgermeister Alfons Zwirn | Nachlauf, Palette |
| `03-bramsche` | Registratorin Ottilie Bramsche | abgenommen |
| `04-zapf` | Hausmeister Reinhold Zapf | abgenommen |
| `05-lisbeth` | Praktikantin Lisbeth Fuhr | abgenommen |
| `06-trepp` | Zusteller Emil Trepp der Siebte | abgenommen |
| `07-noergel` | Sachbearbeiter auf Probe Nörgel | abgenommen |
| `08-milb` | Gutachter Dr. phil. Milb | abgenommen |
| `09-pommer` | Materialausgabe Herr Pommer | abgenommen |
| `10-fass` | Wirt Bruno Fass | abgenommen |
| `11-lott-pahl` | Herr Lott und Herr Pahl (Doppelporträt) | abgenommen, trotz drittem Kopf |
| `12-nieselbeck` | Wetterbeauftragter Ferdinand Nieselbeck | abgenommen |
| `13-umlauf` | Reichsbotin Kordula Umlauf | abgenommen |
| `14-vorblatt` | Reichsministerialdirektor zu Händen Vorblatt | abgenommen |
| `15-sturz` | Amtsleiterin Dr. Wilhelmine Sturz | abgenommen |
| `16-nachtrag` | Fürst Nachtrag, der Schattenfürst | abgenommen |
| `17-anlage3` | Anlage 3, Kater | abgenommen |
| `18-konrad` | Konrad zu Händen Aufschub | abgenommen |
| `19-aussendienst` | Der Außendienst (Spieler) | bewusst ausgelassen, braucht keins |
| `20-kaisertuer` | Die Tür des Kaisers | Nachlauf, Stapel zu klein |

## Abnahme (22.08.2026)

Matthias hat die Sammlung durchgesehen und **siebzehn der neunzehn Motive
abgenommen**. Neu laufen nur Zwirn (Palette) und die Kaisertür (Stapel zu klein).
Ihre Prompts in `figuren-bildprompts.md` sind dafür nachgeschärft.

Die Befunde unten bleiben stehen, weil sie stimmen, aber sie sind entschieden. Der
dritte Kopf bei Lott und Pahl, Pommers geronnene Brille, Milbs Halbprofil, Konrads
verzogenes Gesicht, Nörgels flacher Stil und Umlaufs gemalte Schattierung sind
gesehen und für gut befunden worden. Wer später über diese Zeilen stolpert, soll
nicht denken, sie wären übersehen worden.

## Befunde am ersten Paket (22.08.2026)

Nachgemessen, nicht geschätzt. Alle fünf Originale sind JPEG, 1024x1024.

* **Die Farbzahl stimmt nirgends.** Gezählt wurden 19.092 (Knöterich), 84.778
  (Zwirn), 34.453 (Bramsche), 62.667 (Zapf) und 30.786 (Lisbeth) Farben. Der Prompt
  verlangt 32. Ein Teil davon geht auf JPEG, der Rest darauf, dass Midjourney die
  Palettenangabe als Stimmung liest und nicht als Grenze. Die `-px`-Fassung setzt
  sie hart durch.
* **Das Pixelraster ist uneinheitlich.** Zwirn und Lisbeth liegen sauber auf einem
  128er-Raster (Abweichung bei Faktor 8 nur 2,2 bzw. 0,9, bei Faktor 12 dagegen 12,5
  bzw. 5,7). Knöterich, Bramsche und Zapf haben kein erkennbares Raster, ihre
  Abweichung wächst gleichmäßig mit jedem Faktor. Das ist der sichtbare Grund, warum
  die Bilder nebeneinander nicht wie eine Serie wirken, und genau das, was `--sref`
  beheben soll.
* **Zwirn bricht die Palette.** Gesättigtes Orange, Türkis und glänzendes Gold statt
  gedecktem Ocker. Er ist zugleich der mit Abstand farbreichste (84.778). Wenn ein
  Bild neu laufen sollte, dann dieses.

Die `-px`-Fassung vereinheitlicht alle auf dasselbe 128er-Raster und dieselben
32 Farben. Zapfs Bart-Dithering wird dabei zu einer gröberen Sprenkelung, bleibt
aber lesbar.

## Befunde am zweiten Paket (22.08.2026)

* **Pommer, Brille kaputt.** Die Halbmondbrille ist zu zwei grauen Platten
  geronnen, die linke schwebt neben dem Gesicht in der Luft. Sachlicher Fehler,
  nicht Geschmack. Sein Motiv sitzt zudem als einziges deutlich rechts der Mitte
  (Schwerpunkt bei 60 Prozent Bildbreite).
* **Milb und Trepp schauen weg.** Beide stehen im Halbprofil statt frontal, obwohl
  `facing the viewer` im Prompt steht. Bei Milb kommt ein sehr enger Kopfausschnitt
  dazu, bei Trepp das Gegenteil: sein Kopf ist kleiner als bei allen anderen, weil
  mehr Rumpf im Bild ist.
* **Nörgel fällt stilistisch heraus.** Flach, symmetrisch, ohne Schattenbänder, eher
  8-Bit-Sprite als LucasArts-Porträt. Messbar an der Farbzahl: 17.921 gegen 30.000
  bis 85.000 bei allen anderen. Er füllt außerdem als Einziger das Bild nicht aus
  (78 Prozent Höhe, 16 Prozent Luft oben). Das Hemd ist sandfarben statt grau.
* **Fass ist sehr eng geschnitten**, die Schultern laufen an beiden Rändern aus dem
  Bild, und die Schattierung ist weicher als bei den übrigen.

## Befunde am dritten Paket (22.08.2026)

* **Lott und Pahl sind zu dritt.** Hinter dem rechten der beiden steht ein dritter,
  weißhaariger Kopf mit eigenem Ohr und eigener Wange, am rechten Bildrand
  angeschnitten. Der Prompt verlangt ausdrücklich `exactly two characters`. Dazu ist
  der Ausschnitt viel zu nah, beide Gesichter füllen das Bild bis an die Kanten, und
  mit 100.634 Farben ist es das bunteste Bild der Sammlung. Muss neu.
* **Umlauf fällt stilistisch heraus.** Weiche, gemalte Schattierung mit feinem
  Raster, eher Comic-Illustration als Pixelkunst; neben Knöterich oder Vorblatt
  gehängt wirkt sie aus einem anderen Spiel. Inhaltlich stimmt alles, Haar, Uniform,
  Umhang, Riemen, offener Mund im Satz.
* **Nieselbeck trägt eine Schiebermütze statt der Dienstmütze**, was ihm sogar
  steht, und schaut wie gewünscht nach oben. Er ist etwas klein im Bild (85 Prozent
  Höhe, 9 Prozent Luft oben), aber im Rahmen.
* **Vorblatt und Sturz sitzen.** Bei Vorblatt fehlen die über die Schultern
  geschnallten Aktenbündel, dort sitzen jetzt Epauletten. Das ist ein Verlust an
  Erzählung, aber kein Fehler: die Figur trägt auch so.

## Das sind keine Spielgrafiken

Sie werden von `index.html` **nicht geladen** und gehören in keine Ladeliste. Ihr
Zweck ist Doku, Kladde und Konzeptarbeit. Die Gesprächstafel schneidet ihr Porträt
seit U4 aus dem laufenden Sprite (`PORTRAET_X/Y/B/H`) und erwartet das
64x64-Held-Komposit; ein gemaltes Bild passt dort nicht hinein.

## Warum diese Bilder im Repo liegen dürfen

Die `.gitignore` hält fest, dass kein PNG-Byte als Git-Objekt ins öffentliche Repo
gehört. Der Grund dort ist die Kenmi-Premium-Lizenz, die die Weitergabe der
Cute-Fantasy-Dateien untersagt, auch modifiziert. Für diese Porträts gilt das nicht:
sie sind selbst erzeugt und gehören dem Projekt. Sie sind klein, sie gehören
inhaltlich neben die Prompts, und sie landen in keinem Build.

## Befunde am vierten Paket (22.08.2026)

* **Konrads Gesicht ist entgleist.** Das linke Auge fehlt, an seiner Stelle sitzt
  eine Falte, und der Kopf ist so weit verzogen, dass er die Grenze `never
  grotesque` aus dem Prompt reißt. Die Figur soll die freundlichste Illustration des
  zweiten Weltgesetzes sein, ein Mann, der sein Leben in einem Flur verbracht hat
  und es für eine Karriere hält. Das hier ist ein Zerrbild. Muss neu.
* **Die Kaisertür stimmt nicht in den Größenverhältnissen.** Der Stapel reicht knapp
  über zwei Drittel der Türhöhe, der Prompt verlangt `taller than the door itself`.
  Genau diese Übertreibung ist der Witz des Motivs. Dazu steht die Tür in einem Raum
  mit Wand und Boden, obwohl `plain dark background` verlangt war. Beides zusammen
  nimmt dem Bild die Wucht.
* **Nachtrag ist eine Kapuzengestalt geworden**, nicht der Hochadelige in Hofkleidung
  mit hohem Kragen. Stimmung, Traurigkeit und die zwei blassen Augen sitzen dagegen
  genau. Geschmacksfrage, kein Fehler.
* **Der Kater ist rot statt getigert** und etwas wärmer als die Palette, liegt aber
  richtig und schläft überzeugend.

## Der Hintergrund streut

Gemessen an den Bildecken, dort wo die Figur sie nicht berührt: die meisten liegen
zwischen `#232e2a` und `#2e3c3f`, also dunkles Schiefergrün mit Helligkeit 40 bis
56. Zwei fallen heraus: Nachtrag mit `#010e0d` (Helligkeit 9, praktisch schwarz) und
Vorblatt mit `#102424` (29). Die Kaisertür hat als einzige gar keinen flachen Grund,
sondern eine Wand in `#44404a`.

Bei Zapf, Fass und Lott/Pahl ist der Eckwert **kein** Hintergrund, sondern die Figur
selbst, weil sie bis in die Ecken reicht. Für diese drei sagt die Messung nichts.

`plain dark background` ist Midjourney offenbar zu unbestimmt. Für Nachläufe wäre
`flat dark slate green background` genauer. Alternativ lässt sich der Grund
nachträglich vereinheitlichen, das wäre eine Erweiterung von `tools/figuren-px.py`.
