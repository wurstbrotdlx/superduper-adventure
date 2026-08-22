# assets/figuren/ — Figurenporträts

Zwanzig Porträts des Ensembles, erzeugt mit Midjourney nach den Prompts in
`figuren-bildprompts.md` (Amiga-Fassung, LucasArts-Karikatur, Kopf bis Brust,
gedeckte Palette).

## Namensschema

Die Nummer ist die Prompt-Nummer aus `figuren-bildprompts.md`, damit Bild und
Prompt ohne Suchen zusammenfinden.

| Datei | Figur |
|---|---|
| `01-knoeterich.png` | Amtsrat a. D. Knöterich |
| `02-zwirn.png` | Bürgermeister Alfons Zwirn |
| `03-bramsche.png` | Registratorin Ottilie Bramsche |
| `04-zapf.png` | Hausmeister Reinhold Zapf |
| `05-lisbeth.png` | Praktikantin Lisbeth Fuhr |
| `06-trepp.png` | Zusteller Emil Trepp der Siebte |
| `07-noergel.png` | Sachbearbeiter auf Probe Nörgel |
| `08-milb.png` | Gutachter Dr. phil. Milb |
| `09-pommer.png` | Materialausgabe Herr Pommer |
| `10-fass.png` | Wirt Bruno Fass |
| `11-lott-pahl.png` | Herr Lott und Herr Pahl (Doppelporträt) |
| `12-nieselbeck.png` | Wetterbeauftragter Ferdinand Nieselbeck |
| `13-umlauf.png` | Reichsbotin Kordula Umlauf |
| `14-vorblatt.png` | Reichsministerialdirektor zu Händen Vorblatt |
| `15-sturz.png` | Amtsleiterin Dr. Wilhelmine Sturz |
| `16-nachtrag.png` | Fürst Nachtrag, der Schattenfürst |
| `17-anlage3.png` | Anlage 3, Kater |
| `18-konrad.png` | Konrad zu Händen Aufschub |
| `19-aussendienst.png` | Der Außendienst (Spieler) |
| `20-kaisertuer.png` | Die Tür des Kaisers |

Eine Datei mit dem Zusatz `-px` ist die nachbearbeitete Fassung derselben Vorlage
(auf kleine Kantenlänge heruntergerechnet mit Nearest Neighbor, dann wieder hoch,
damit das Pixelraster echt wird). Sie steht nur dort, wo das Original weiche Kanten
hatte.

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
