# Zulagen-Bildprompts für Midjourney

Fünfzehn kopierfertige Prompts, einer je Zulagenfamilie. **Kartenkunst, keine
Inventarsymbole:** jedes Motiv ist eine epische Szene im Bildfenster einer
Sammelkarte, gerendert in derselben Amiga-Fassung wie die Figurenporträts.
Block kopieren, in Midjourney einfügen, fertig.

Grundlage ist der Katalog `ZULAGE` in `index.html` und der Baubericht
`phase-k1-zulagen.md`. Die Stilformel stammt aus `figuren-bildprompts.md`.

## Wofür das ist, und wofür nicht

Das ist **die Kartenkunst im Bildfenster**, also der Ersatz für die Emoji, die
in `ZULAGE[...].icon` stehen. Seit dem Kartenumbau hat jede Zulage ein
Bildfenster im Seitenverhältnis vier zu drei, darüber die Namensleiste, darunter
Typenzeile und Text. Genau dieses Fenster wird hier gefüllt, deshalb `--ar 4:3`.

**Fünfzehn Bilder, nicht fünfundvierzig.** Die drei Stufen einer Familie teilen
sich ein Bild. Die Stufe trägt der Rahmen: Stufe I gedeckt, Stufe II Gold,
Stufe III Violett mit Schein und laufendem Glanz. Wer für jede Stufe malt,
verdreifacht die Arbeit und nimmt dem Rahmen seine Aufgabe.

## Warum episch, und warum das kein Bruch ist

Der Wunsch lautete: das muss nach Sammelkarte aussehen, nach Magic oder
Yu-Gi-Oh, sehr episch, sehr drüber, es soll Bock machen die zu sammeln.

Das ist kein Fremdkörper in dieser Welt, das ist **Humor-Grundgesetz Regel 10**,
wörtlich:

> Die Form ist episch, der Inhalt ist Papier. Fanfare für einen Aktenvorgang.
> Episch wird die **Form**, nie der Gegenstand. Nichts an diesem Haus darf
> bescheiden aussehen.

Also: **ein Stempel, ausgeleuchtet wie Excalibur.** Ein Kaffeebecher auf einem
Altar. Kurierstiefel, die über ein Gebirge steigen. Der Gegenstand bleibt
Büromaterial, die Inszenierung ist eine Kathedrale. Das ist der Witz, und er
funktioniert nur, solange beide Hälften stehen. Die Gegenprobe steht in derselben
Regel:

> Der ganze Prunk hängt an einer Sache, die seit vierhundert Jahren nicht
> erledigt ist. Die Form ist maximal, der Ertrag ist null. Wo das eine ohne das
> andere steht, ist es kein Gag mehr, sondern nur noch Dekoration.

Deshalb ist **kein Motiv eine Waffe mit Amtsdekor**. Jedes ist Verwaltung, die
ernst macht: eine Axt, die einen Aktenstapel abfertigt. Ein Stempel, der aus
Gewitterwolken auf einen Schreibtisch fährt. Ein Beleg, der als Wasserfall vom
Himmel kommt.

## Was gegenüber der Porträtformel anders ist

Drei Eingriffe, jeder mit Grund.

**Der Ausschnitt.** Die Porträts stehen auf `head and shoulders portrait, tight
crop`. Eine Zulage ist keine Person, also trägt sie diesen Satz nicht, genau wie
die beiden Motive, die ihn schon vorher nicht trugen: der Kater Anlage 3 und die
Tür des Kaisers. An seine Stelle tritt die Kartenkunst-Einstellung:
`epic fantasy trading card illustration, dramatic low angle hero shot,
monumental scale, shafts of light, atmospheric depth with a distant background`.

**Die Karikatur fällt weg.** In den Porträts steht `Peter Chan caricature,
exaggerated cartoon proportions, oversized features, expressive comic face`. Das
gehört zum Gesicht und zum Register des Figurenporträts. Kartenkunst ist ein
anderes Register, und der Amiga hatte es auch: die gemalten Titelbilder und
Packungsvorderseiten waren episch, nicht komisch, und stets eine Nummer größer
als das Spiel dahinter. Genau da liegt der Anker jetzt:
`1991 Amiga game box art rendered in chunky pixels, painted title screen
grandeur`. **Der Witz kommt nicht mehr aus der Zeichnung, sondern aus dem
Missverhältnis** zwischen Inszenierung und Gegenstand.

**Die Palette darf Licht bekommen.** In den Porträts steht sie flach gedeckt,
sonst streut Midjourney ins Bunte. Für Kartenkunst wäre flach gedeckt tot. Der
Grundton bleibt deshalb derselbe (`earthy base of dusty ochre, faded olive,
slate blue and warm grey`), aber er wird **beleuchtet** statt eingefärbt:
`lifted by dramatic rim light and glowing highlights against deep shadow`. Die
vier Motive mit eigenem Element (Feuer, Frost, Arkan, und der Beleg mit seinem
warmen Gegenlicht) tragen zusätzlich genau einen gedämpften Farbakzent und im
`--no` ausdrücklich das Verbot der Neonfassung davon.

`--s 25` bleibt unverändert. Die Versuchung war groß, für „episch" höher zu
gehen; höhere Stilisierung heißt bei Midjourney aber hübscher, weicher, moderner,
und das ist genau der Weg zurück aus der Pixelkunst heraus. **Die Dramatik kommt
aus den Wörtern, nicht aus dem Regler.**

## Die Sperrliste ist länger als bei den Porträts

Neun der fünfzehn Motive sind Papier, und Midjourney schreibt auf Papier. Was
dabei herauskommt, ist Buchstabensuppe. Im `--no` stehen deshalb
`text, lettering, writing, letters, numbers` statt nur `text`.

Die Zeile mit den Zahlen ist kein Zufall: **auf einer Zulage steht nie eine
Zahl.** Das ist dieselbe Regel, die `zulagenAssert()` bei jedem Laden an den
Anzeigesätzen, am Namen und an der Typenzeile prüft, und sie gilt für das Bild
genauso.

`hands, people, faces` steht ebenfalls im `--no`. Ohne diese drei stellt das
Modell zu jedem monumentalen Gegenstand jemanden davor, der ihn bestaunt, und
der Maßstab lebt hier von Architektur und Landschaft, nicht von Publikum.

## Drei Hinweise

**Ein `--sref` für alle fünfzehn.** Die Palette im Text bringt die Farben
zusammen, nicht aber Pinselführung und Rasterhärte. Einen Lauf mit
`--sref random` starten, die gemeldete Nummer notieren und `--sref <NUMMER>` an
alle fünfzehn hängen. Bei Kartenkunst wiegt das schwerer als bei den Porträts:
eine Serie, deren Bilder verschieden aussehen, sammelt niemand.

**Kein Seed.** Wie bei den Figuren: der zwingt allen Motiven dieselbe Lage auf.

**Nachbearbeiten gehört dazu.** Midjourney gibt ein hochauflösendes Bild aus,
das grobe Pixel nur imitiert. Auf 128 mal 96 herunterrechnen (Nearest Neighbor,
nicht bikubisch), dann wieder hoch. Für das Kartenfenster reicht das reichlich,
es steht je nach Fenster bei 150 bis 210 Pixel Breite.

---

## 1. Stichprobe · Dolch

```
epic pixel art scene of a colossal tarnished brass letter opener driven like a sword into the summit of a mountain of official forms, loose pages drifting through the air like snow, a windswept plateau at dawn, the blade catching the first light, a tiny torn paper tag snapping in the wind on its handle, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render
```

## 2. Klingenzulage · Schwert

```
epic pixel art scene of an official sword rising point upward out of a still black lake of ink, dark liquid streaming from the blade, an enormous dark red wax seal swinging from its pommel on a ribbon, dawn light bursting behind it over drowned filing cabinets at the shoreline, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render
```

## 3. Pauschalabfertigung · Axt

```
epic pixel art scene of a titanic double headed axe caught mid swing as it cleaves a mountain of bound ledgers clean in half, paper and splintered covers exploding outward in a shockwave, a storm sky churning behind, ruined archive shelves toppling in the distance, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render
```

## 4. Brandschutzausnahme · Feuer

```
epic pixel art scene of a single official certificate standing upright and towering like a monument in the middle of a burning archive hall, its upper half consumed by rolling flame, embers streaming upward into the dark, an enormous dark wax seal at its base glowing white hot and completely untouched, collapsed burning shelves receding into the distance, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, one accent of dull ember orange, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render, neon orange, bright saturated fire
```

## 5. Kaltverfügung · Frost

```
epic pixel art scene of a monumental wooden handled rubber stamp entombed upright inside a towering glacier of clear pale ice, only its handle knob breaking the surface, the ice standing in the nave of a frozen archive hall with frost creeping across the shelves, cold light falling through the ice in long shafts, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, one accent of pale frost blue, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render, cyan, neon blue
```

## 6. Blitzbeschluss · Arkan

```
epic pixel art scene of a rolled official decree hanging suspended in the eye of a storm, a colossal jagged bolt of pale violet lightning striking straight down through it, arcs of energy crawling outward across the roofs of a ruined ministry tower far below, torn seals falling through the air, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, one accent of dusty violet, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render, neon purple, magenta glow
```

## 7. Vollzugszulage · mehr Schaden

```
epic pixel art scene of a titanic wooden office stamp descending out of black storm clouds toward a single tiny desk on an empty plain, the moment before impact, a shockwave ring of dust already racing outward across the ground, the stamp filling the upper half of the frame, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render
```

## 8. Erschwerniszulage · mehr Leben

```
epic pixel art scene of a battered dented official issue helmet resting on a broken standard planted in the ground, standing alone on a vast battlefield of drifted paperwork stretching to the horizon, low sun behind it throwing a long shadow, torn forms turning in the wind, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render
```

## 9. Härtefallregelung · weniger Schaden nehmen

```
epic pixel art scene of a colossal shield built from a heavy wooden clipboard bound in iron, planted immovably in the earth with a great wax seal bolted to its centre as a boss, a dense storm of arrows and steel nibs shattering against it in a spray of sparks, a besieged ministry gate looming behind, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render
```

## 10. Gebührenbefreiung · weniger Manakosten

```
epic pixel art scene of an endless paper receipt unfurling out of a break in the clouds and pouring down like a waterfall into the open floor of a vast treasury vault, a shattered padlock tumbling through the air beside it, warm light glowing through the falling paper, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, one accent of warm amber backlight, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render, gold, bright yellow
```

## 11. Prüfvermerk · kritische Treffer

```
epic pixel art scene of a colossal brass magnifying glass hanging in the sky above a vast plain of scattered documents, focusing a single narrow blazing beam of sunlight down onto one sheet far below, the paper beginning to scorch at that one point, long shadows stretching across the plain, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render
```

## 12. Eilverfahren · Angriffstempo

```
epic pixel art scene of a giant brass pocket stopwatch bursting apart at the seam, its casing splitting open as gears and springs and a burst of white light erupt outward, the chain whipping behind it, streaks of motion cutting across a churning sky, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render, clock face numerals
```

## 13. Dienstweg · Lauftempo

```
epic pixel art scene of a pair of colossal worn courier boots striding across a mountain range at dawn, each boot larger than the peaks it steps between, trailing plumes of dust, a ribbon of unspooling paper unwinding behind them across the valleys like a road, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render, legs, boots being worn
```

## 14. Laufender Bezug · Manaregeneration

```
epic pixel art scene of an enormous chipped enamel office mug enshrined on a stone altar at the end of a vast vaulted hall, thick steam rising from it in great columns into shafts of light falling from high windows, drifts of offered paperwork heaped at the foot of the altar, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render
```

## 15. Dienstalterszulage · mehr Erfahrung

```
epic pixel art scene of a colossal service record book lying open on a stone pedestal, its pages turning by themselves in a rising wind, brilliant light pouring upward from between the leaves into a dark vaulted chamber, round stamp impressions on the open pages glowing faintly like constellations, epic fantasy trading card illustration, dramatic low angle hero shot, monumental scale, shafts of light breaking through, atmospheric depth with a distant background, awe and grandeur, chunky pixels, low resolution, 32 colour palette, earthy base of dusty ochre faded olive slate blue and warm grey, lifted by dramatic rim light and glowing highlights against deep shadow, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 Amiga game box art rendered in chunky pixels, painted title screen grandeur --ar 4:3 --style raw --s 25 --no gradients, smooth shading, fine detail, photorealism, blur, text, lettering, writing, letters, numbers, watermark, hands, people, faces, modern 3d render
```

---

## Wenn die Bilder da sind

**Der Einbau ist eine Zeile je Karte.** Der Katalog trägt heute `icon:'🔪'`; wer
zusätzlich `bild:'assets/zulagen/stichprobe.png'` einträgt, bekommt automatisch
ein `<img>` im Kartenfenster statt des Sinnbilds. `zulageKarteHTML()` kann das
seit dem Kartenumbau, es muss nichts angefasst werden.

Das Fenster steht auf `object-fit:cover` und `image-rendering:pixelated`, ein
Bild im Verhältnis vier zu drei sitzt also passgenau und bleibt hart in den
Kanten. Das Sinnbild bleibt trotzdem im Katalog stehen: es ist der Ersatz, wenn
eine Datei fehlt, und es steht im Tooltip.

**`zulagenAssert()` prüft das Bildfeld auf seine Form**, also darauf, dass dort
ein Pfad steht und keine leere Zeichenkette. Was es nicht prüfen kann, ist ob
die Datei existiert; wer die fünfzehn einträgt, sollte deshalb einmal mit
offener Konsole durch die Kartei blättern. Der Fund aus dem G9-Nachtrag hing an
genau dieser Lücke: zwei Dorffiguren standen drei Bauabschnitte lang ohne Hemd
im Dorf, weil hinter dem Eintrag keine Datei lag.
