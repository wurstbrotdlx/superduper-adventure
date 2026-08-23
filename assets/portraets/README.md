# assets/portraets/ — Die Spielfassung der Figurenporträts

Dreizehn Bilder, 128x128, 32 Farben. Das sind die Dateien, die `index.html`
tatsächlich lädt und die `tools/build-single.mjs` in `dist/index.html` einbackt.

Sie sind **erzeugt, nicht gepflegt**. Quelle sind die Originale in
`assets/figuren/`, Werkzeug ist:

```bash
python3 tools/figuren-px.py --tafel
```

Wer hier von Hand etwas ändert, verliert es beim nächsten Lauf. Änderungen
gehören in `tools/figuren-px.py` (Rechnung, Auswahl) oder in
`figuren-bildprompts.md` und einen neuen Bilderlauf (Motiv).

## Warum das nicht dieselben Dateien wie in assets/figuren/ sind

Die `-px`-Fassungen dort sind nach der Quantisierung wieder auf 1024
hochskaliert, damit man sie ansehen kann. Bildinhalt und Palette sind identisch,
das Gewicht nicht: 19 Motive wiegen als 1024er 3.091 KB und als echte 128er
96,8 KB. Die dreizehn hier wiegen zusammen 65,4 KB und 87,9 KB als data:-URI.

`assets/figuren` steht deshalb in `SKIP_DIRS` von `build-single.mjs`, dieser
Ordner nicht.

## Der Dateiname ist der Figurenschlüssel

`zwirn.png`, nicht `02-zwirn.png`. Die Prompt-Nummer verbindet Bild und Prompt
und ist in `assets/figuren/` richtig; hier zählt die Zuordnung zu `DORF_FIGUREN`
in `index.html`, denn dort wird über `n.figur.key` gesucht.

## Seit G8 hängt noch etwas daran

Diese dreizehn Bilder sind nicht mehr nur das, was die Gesprächstafel zeigt. Seit
G8 sind sie auch die Quelle für die Haar- und Kleiderfarben der Figuren im Dorf:
`python3 tools/portraet-farben.py` misst sie hier heraus, und die Hexwerte stehen
als `haarFarbe` und `hemdFarbe` in `DORF_FIGUREN`.

Wer ein Motiv neu laufen lässt, ändert damit auch das Sprite. Der Abgleich
zwischen beiden ist eine Zeile:

```bash
python3 tools/portraet-farben.py --pruef
```

Einzelheiten in `phase-g8-figurenfarben.md`.

## Wer fehlt

**Lott und Pahl** teilen sich ein Doppelporträt (Motiv 11), das sich nicht in
zwei Gesichter schneiden lässt. Sie bekommen in der Tafel weiter den
Sprite-Ausschnitt aus U4. Das ist kein Mangel, sondern der dokumentierte
Rückfallweg — siehe `phase-u5-portraets.md`.

**Sturz, Nachtrag, Konrad, Anlage 3 und die Kaisertür** haben Bilder, aber
keinen Sprechplatz in der Tafel. Sie bleiben in `assets/figuren/`, bis es eine
Szene gibt, die sie sprechen lässt.

**Der Außendienst** (der Spieler) hat kein Porträt und bekommt keins: seine
Frisur, Haarfarbe und Rüstung wechseln mit der Schicht, und das zeigt nur das
Sprite-Komposit.

## Lizenz

Selbst erzeugt (Midjourney nach eigenen Prompts), gehören dem Projekt. Die
Kenmi-Premium-Lizenz, die `assets/cf/` aus dem Repo hält, betrifft diese Dateien
nicht.
