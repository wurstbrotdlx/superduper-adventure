# assets/zulagen/ — Die Kartenkunst der Zulagen

Fünfundvierzig Bilder, drei je Zulagenfamilie, eines je Stufe. Das sind die
Dateien, die `index.html` über das `bild`-Feld in `ZULAGE` lädt und die
`tools/build-single.mjs` in `dist/index.html` einbackt.

Sie sind **erzeugt, nicht gepflegt**. Quelle sind die Midjourney-Ausgaben,
Werkzeug ist:

```bash
python3 tools/zulagen-bild.py
```

Das Skript liest aus `assets/eingang/` und schreibt hierher. Wer hier von Hand
etwas ändert, verliert es beim nächsten Lauf. Änderungen gehören in
`tools/zulagen-bild.py` (Rechnung) oder in `zulagen-bildprompts.md` und einen
neuen Bilderlauf (Motiv).

## Der Dateiname ist die einzige Verbindung zur Karte

`stichprobe-3.jpg`, also Familienschlüssel aus `ZULAGE` plus Stufe.
`zulagenAssert()` rechnet den erwarteten Namen aus dem Katalog nach und meldet
jede Abweichung. Das ist die einzige Stelle, an der sich ein vertauschtes Bild
überhaupt bemerken lässt: ein Pfad, der auf eine Datei zeigt, ist immer noch
ein gültiger Pfad, und im Spiel sähe man nur eine Karte mit falschem Motiv.

## Warum vierhundert mal dreihundert

Gemessen, nicht gewählt. Das Bildfenster der Karte ist 149 mal 112 Punkte breit
und hoch, auf einem Schirm mit doppelter Punktdichte also 299 mal 225 echte
Pixel (am Telefon 304 mal 229). Vierhundert deckt das vollständig und lässt
Luft für dreifache Punktdichte.

Zusammen wiegen die fünfundvierzig **1364 KB**, im Schnitt 30,3 KB. Das ist der
Grund, warum die Originale nicht hier liegen: die wiegen das Zwölffache und
kein Frame zeichnet sie je.

## Warum JPEG und nicht WebP

Die Zuordnung von Endung zu Dateityp in `tools/build-single.mjs` kennt nur
`.png`, `.gif`, `.jpg` und `.jpeg`, und unbekannte Endungen werden dort
**stillschweigend übersprungen**. Eine `.webp` fiele lautlos aus dem Build und
die Karte bliebe im ausgelieferten Spiel leer.

## Der Eingang

`assets/eingang/` ist der Durchlauferhitzer und steht in der `.gitignore` und
in den `SKIP_DIRS` des Builds. Beides zusammen: das eine schützt gegen das
Repo, das andere gegen die Auslieferung. Ein Lauf ohne die zweite Sperre hat
die Originale mit eingebacken und `dist/index.html` auf 24 MB gebracht.
