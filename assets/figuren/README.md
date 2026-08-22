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
| `01-knoeterich` | Amtsrat a. D. Knöterich | da |
| `02-zwirn` | Bürgermeister Alfons Zwirn | da, Palette weicht ab (siehe unten) |
| `03-bramsche` | Registratorin Ottilie Bramsche | da |
| `04-zapf` | Hausmeister Reinhold Zapf | da |
| `05-lisbeth` | Praktikantin Lisbeth Fuhr | da |
| `06-trepp` | Zusteller Emil Trepp der Siebte | offen |
| `07-noergel` | Sachbearbeiter auf Probe Nörgel | offen |
| `08-milb` | Gutachter Dr. phil. Milb | offen |
| `09-pommer` | Materialausgabe Herr Pommer | offen |
| `10-fass` | Wirt Bruno Fass | offen |
| `11-lott-pahl` | Herr Lott und Herr Pahl (Doppelporträt) | offen |
| `12-nieselbeck` | Wetterbeauftragter Ferdinand Nieselbeck | offen |
| `13-umlauf` | Reichsbotin Kordula Umlauf | offen |
| `14-vorblatt` | Reichsministerialdirektor zu Händen Vorblatt | offen |
| `15-sturz` | Amtsleiterin Dr. Wilhelmine Sturz | offen |
| `16-nachtrag` | Fürst Nachtrag, der Schattenfürst | offen |
| `17-anlage3` | Anlage 3, Kater | offen |
| `18-konrad` | Konrad zu Händen Aufschub | offen |
| `19-aussendienst` | Der Außendienst (Spieler) | offen |
| `20-kaisertuer` | Die Tür des Kaisers | offen |

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

Die `-px`-Fassung vereinheitlicht alle fünf auf dasselbe 128er-Raster und dieselben
32 Farben. Zapfs Bart-Dithering wird dabei zu einer gröberen Sprenkelung, bleibt
aber lesbar.

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
