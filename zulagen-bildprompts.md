# Zulagen-Bildprompts für Midjourney

Fünfzehn kopierfertige Prompts, einer je Zulagenfamilie, alle in derselben
Amiga-Fassung wie die Figurenporträts: grobe Pixel, 32 Farben, harte Kanten,
Dithering statt Verlauf, gedeckte Palette, dunkler Grund. Block kopieren, in
Midjourney einfügen, fertig.

Grundlage ist der Katalog `ZULAGE` in `index.html` und der Baubericht
`phase-k1-zulagen.md`. Die Stilformel ist aus `figuren-bildprompts.md`
übernommen und an einer Stelle geändert, siehe unten.

## Wofür das ist, und wofür nicht

Das sind **die Sinnbilder auf den Karten**, also der Ersatz für die Emoji, die
seit K1 in `ZULAGE[...].icon` stehen. Das Panel zeichnet sie im Kartenkopf, auf
dem Telefon links neben dem Text. Sie sind Spielgrafik, anders als die Porträts:
was hier herauskommt, geht in `assets/` und wird im Katalog eingetragen.

**Fünfzehn Bilder, nicht fünfundvierzig.** Die drei Stufen einer Familie teilen
sich ein Sinnbild. Die Stufe steht als römische Ziffer in der Ecke und im
Rahmen: Stufe II gold, Stufe III violett mit Schein. Wer für jede Stufe ein
eigenes Bild malt, verdoppelt die Arbeit und nimmt dem Rahmen seine Aufgabe.

## Was gegenüber den Porträts anders ist, und warum

Die Porträtformel steht auf `head and shoulders portrait, tight crop from the
top of the head to mid chest`. Eine Zulage ist keine Person, also trägt sie
diesen Satz nicht, genau wie die beiden Motive, die ihn schon vorher nicht
trugen (der Kater Anlage 3 und die Tür des Kaisers). An seine Stelle tritt
`single object centred and filling the frame, adventure game inventory icon,
three-quarter view from slightly above`. Das ist der Ausschnitt, den ein
Inventarbild in einem SCUMM-Spiel hat.

Drei weitere Zeilen sind gefallen, weil sie am Gesicht hängen:
`expressive comic face`, `oversized features` und `warm and sympathetic, never
grotesque`. Die letzte ist die Humor-Regel aus Kapitel 8 und gilt Personen; ein
Aktenordner kann nicht ausgelacht werden.

**Geblieben ist die Karikatur.** `Peter Chan caricature, exaggerated cartoon
proportions` steht in jedem Prompt, und wie bei den Figuren hat **jedes Motiv
seine eigene Übertreibung**: der Brieföffner ist zu groß für den Stapel, das
Siegel größer als der Schwertknauf, der Eisblock größer als der Stempel, der
Beleg absurd lang, das Dienstbuch absurd dick. Ohne diese Zeile liefert das
Modell Produktfotos von Büroartikeln.

**Der Witz ist derselbe wie im ganzen Haus:** Büroausstattung, die Gewalt
ausübt, und Gewalt, die aussieht wie Büroausstattung. Ein Stempel, der einen
Tisch zertrümmert. Eine Axt, die einen Aktenstapel abfertigt. Kein Motiv ist
eine Waffe mit Amtsdekor, jedes ist Verwaltung, die ernst macht.

## Die Sperrliste ist länger als bei den Porträts

Neun von fünfzehn Motiven sind Papier, und Midjourney schreibt auf Papier. Was
dabei herauskommt, ist Buchstabensuppe. Im `--no` stehen deshalb jetzt
`text, lettering, writing, letters, numbers` statt nur `text`, und wo ein
Stempelabdruck ins Bild gehört, ist er im Prompt ausdrücklich als leerer Umriss
bestellt (`empty outlined stamp band with no writing inside`).

Die Zeile mit den Zahlen ist kein Zufall: **auf einer Zulage steht nie eine
Zahl.** Das ist dieselbe Regel, die `zulagenAssert()` bei jedem Laden am Text
prüft, und sie gilt für das Bild genauso.

`hands, people, faces` steht ebenfalls im `--no`. Ohne diese drei stellt das
Modell zu jedem Werkzeug jemanden dazu, der es hält.

## Drei Hinweise

**Ein `--sref` für alle fünfzehn.** Die Palette im Text bringt die Farben
zusammen, nicht aber Pinselführung und Rasterhärte. Einen Lauf mit
`--sref random` starten, die gemeldete Nummer notieren und `--sref <NUMMER>` an
alle fünfzehn hängen. Wer die Sinnbilder neben die Porträts stellen will, nimmt
dieselbe Nummer wie dort.

**Kein Seed.** Wie bei den Figuren: der zwingt allen Motiven dieselbe Lage auf.

**Nachbearbeiten gehört dazu.** Ergebnis auf 64 bis 96 Pixel Kantenlänge
herunterrechnen, Nearest Neighbor, nicht bikubisch, dann wieder hoch. Die
Porträts liegen als 128x128 vor; für die Kartensinnbilder reichen 64x64, sie
stehen im Panel bei rund 26 Pixel.

---

## 1. Stichprobe · Dolch

```
pixel art icon of an oversized tarnished brass letter opener driven straight down through a thick stack of official forms, the blade buried to the hilt, loose pages fanned out and pinned beneath it, a small torn paper tag knotted to the handle, the opener comically too large for the papers, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

## 2. Klingenzulage · Schwert

```
pixel art icon of a short notched official sword standing upright with its point sunk into a wooden desktop, an enormous dark red wax seal on a ribbon dangling from the pommel, a paper inventory tag tied to the crossguard, the seal almost as large as the hilt, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

## 3. Pauschalabfertigung · Axt

```
pixel art icon of a heavy double headed axe with an absurdly oversized head on a stubby short handle, embedded deep in a stack of bound ledgers, split covers and loose paper bursting outward around the blade, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

## 4. Brandschutzausnahme · Feuer

```
pixel art icon of an official certificate burning from the top edge downward, curling dull ember flame and drifting ash, a huge dark wax seal at the bottom completely untouched by the fire, the seal larger than the paper still left, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, dull ember orange, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, bright fire, neon orange
```

## 5. Kaltverfügung · Frost

```
pixel art icon of a wooden handled rubber stamp frozen solid inside a rough block of pale ice with only the handle knob sticking out, frost crystals spreading from the block, the ice far larger than the stamp inside it, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, pale frost blue, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, cyan, neon blue
```

## 6. Blitzbeschluss · Arkan

```
pixel art icon of a rolled official decree with a jagged bolt of pale violet lightning cracking straight through it, the bolt thicker than the scroll itself, a broken seal falling away, small arcs jumping at the torn edges, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, dusty violet, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, neon purple, magenta glow
```

## 7. Vollzugszulage · mehr Schaden

```
pixel art icon of an enormous wooden office stamp slammed down onto a tiny desk, the desktop splintering and cracking apart beneath it, ink spraying outward in blocky droplets, the stamp many times the size of the desk, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

## 8. Erschwerniszulage · mehr Leben

```
pixel art icon of a battered dented official issue helmet in faded olive, oversized and heavy looking, a small riveted ministry crest on the front, a frayed chin strap hanging down loose, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

## 9. Härtefallregelung · weniger Schaden nehmen

```
pixel art icon of a shield built from a heavy wooden clipboard, reinforced with iron bands and rivets, a large wax seal bolted to the centre as a shield boss, dents and arrow scars across its face, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

## 10. Gebührenbefreiung · weniger Manakosten

```
pixel art icon of an absurdly long paper receipt curling and coiling downward in loose loops, a huge empty outlined stamp band running diagonally across it with nothing written inside, a small open padlock hanging from the top edge, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

## 11. Prüfvermerk · kritische Treffer

```
pixel art icon of a brass magnifying glass with an enormous lens held over a single sheet of paper, one sharp faded red tick mark visible through the glass, the lens far bigger than the sheet beneath it, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

## 12. Eilverfahren · Angriffstempo

```
pixel art icon of a battered brass pocket stopwatch lying on an official form with its crown pressed all the way down, blocky motion lines radiating around it, the chain trailing off the edge, the watch oversized against the paper, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, clock face numerals
```

## 13. Dienstweg · Lauftempo

```
pixel art icon of a pair of worn faded olive courier boots, heavily oversized and caked with dried mud at the soles, one boot standing upright and the other fallen over beside it, an official paper tag tied to the laces, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

## 14. Laufender Bezug · Manaregeneration

```
pixel art icon of a chipped oversized enamel office mug standing on a small saucer, thick steam curling upward in blocky puffs, a small ministry crest on the side of the mug, a dark ring stain on the paper beneath the saucer, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

## 15. Dienstalterszulage · mehr Erfahrung

```
pixel art icon of an absurdly thick service record booklet lying open, both pages covered in overlapping empty circular stamp impressions with nothing written inside them, a faded ribbon bookmark hanging from the spine, the cover worn soft at the corners, single object centred and filling the frame, adventure game inventory icon, three-quarter view from slightly above, LucasArts SCUMM adventure game art, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure inventory item, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces
```

---

## Wenn die Bilder da sind

Die Sinnbilder ersetzen die Emoji in `ZULAGE`. Der Katalog trägt heute
`icon:'🔪'` und so weiter; ein Bild braucht dort einen Dateinamen statt eines
Zeichens, und `zulageKarteHTML()` schreibt dann ein `<img>` statt des Zeichens
in `.zIcon`. Zwei Stellen, sonst nichts: die Kartenoptik, die Tooltipzeile und
das gesamte Rechenwerk bleiben unberührt.

**`zulagenAssert()` prüft heute nur, dass ein Sinnbild da ist**
(`if(!zf.name || !zf.icon)`). Wer auf Dateien umstellt, sollte dort eine Zeile
ergänzen, die den Pfad gegen das Manifest hält, sonst wiederholt sich der Fund
aus dem G9-Nachtrag: zwei Dorffiguren standen drei Bauabschnitte lang ohne
Hemd im Dorf, weil hinter dem Eintrag keine Datei lag.
