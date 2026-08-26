# Figuren-Bildprompts für Midjourney

Zwanzig kopierfertige Prompts, einer je Figur, alle in derselben Amiga-Fassung:
grobe Pixel, 32 Farben, harte Kanten, Dithering statt Verlauf, Ausschnitt Kopf bis
Brust. Block kopieren, in Midjourney einfügen, fertig.

Grundlage sind `superduper-weltbibel.md` Kapitel 8 (Das Ensemble), `weltgeschichte.md`
Kapitel 6 (Neue Figuren) und die Optik-Angaben aus `figuren-dorf.md`. Wo die Weltbibel
eine Farbe oder ein Kleidungsstück festlegt, steht sie hier auch so drin; Alter,
Statur und Haltung sind daraus abgeleitet und frei.

**Vorgeschichte.** Die erste Fassung war auf Nano Banana (Gemini Image) ausgelegt, in
ausformulierter Prosa und mit feinem 16-Bit-Look. Das Modell liefert dabei
zuverlässig weichgezeichnete Illustration mit Pixeldekor statt Pixel-Art. Verworfen
am 22.08.2026, sie liegt im Commit `3f54fa2`. Die erste Midjourney-Fassung stand auf
Halbfigur und ohne festgelegte Palette, das steht im Commit `2266e57`; die Fassung
mit Demoscene-Anker und ohne Karikatur im Commit `b42413e`.

## Wofür das ist, und wofür nicht

Das sind **Porträts für Doku, Kladde und Konzeptarbeit**, keine Spielgrafik. Die
Gesprächstafel schneidet ihr Porträt seit U4 aus dem laufenden Sprite
(`PORTRAET_X/Y/B/H`), erwartet also das 64x64-Held-Komposit. Laufsheets aus einem
Bildmodell zu holen funktioniert nicht, dafür fehlt die Frame-Konsistenz über die
Animationszeilen.

## Warum Amiga und warum grob

Getestet wurden vier Epochen an Nörgel, mit festem Seed, damit der Vergleich am
Prompt hängt und nicht am Glück: C64 (1982), NES (1985), EGA-DOS (1986) und
Amiga 500 (1987). Der Amiga hat gewonnen.

Der Stilanker hat danach noch einmal gewechselt, siehe den nächsten Abschnitt.
Geblieben ist der Amiga, gegangen ist die Demoscene.

80er-Optik entsteht durch Verzicht. Deshalb steht in keinem Prompt „highly detailed",
keine Stoffnähte, keine Falten. Die Wirkung kommt daher, dass wenige Pixel sitzen,
nicht daher, dass es viele sind. Wer hier Detail nachschiebt, bekommt den Look nicht
schärfer, sondern kaputt. `--s 25` hält aus demselben Grund Midjourneys Hausgeschmack
kurz: Stilisierung heißt dort hübscher, weicher, moderner.

## Der Humor kommt von LucasArts

Die erste Amiga-Fassung war technisch richtig und trotzdem falsch: `1989 demoscene
portrait` zieht Midjourney zu ernster, malerischer Pixelkunst. Demoscene-Porträts
waren Kunstwerke, keine Comicfiguren. Der Anker heißt deshalb jetzt `1991 point and
click adventure portrait`, dazu kommt in jedem Prompt der Karikaturblock:
`LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle
style, Peter Chan caricature, exaggerated cartoon proportions, oversized features`.

**Jede Figur hat außerdem ihre eigene körperliche Übertreibung**, weil „cartoon
proportions" allein nur generische Comicköpfe erzeugt. Knöterichs Schnauzer verdeckt
den ganzen Mund, Bramsches Dutt ist doppelt so hoch wie ihr Kopf, Zapf hat einen
winzigen Kopf auf Riesenschultern, Vorblatts Gesicht ist unmöglich lang, Pommers
Brille rutscht, der Spieler hat ein perfekt rundes Allerweltsgesicht.

**Zwei Grenzen.** Erstens bleibt die Palette gedeckt. Day of the Tentacle ist
knallbunt, und mit dieser Farbigkeit wäre die Streuung von vorhin sofort zurück; der
Humor läuft deshalb über Formen und Gesichter, nicht über Farben. Das liegt näher an
Monkey Island, das auf dem Amiga ohnehin erdiger war.

Zweitens steht in jedem Prompt `warm and sympathetic, never grotesque`. Das ist keine
Zierde, sondern das Bauprinzip aus Kapitel 8 der Weltbibel: **niemand ist ein Witz,
jeder ist jemand, der etwas versucht.** Karikatur ja, Auslachen nein. Bei Vorblatt
kommt `never threatening` dazu, bei Nachtrag `melancholy rather than menacing`.

## Kopf bis Brust, und was das kostet

Der Ausschnitt steht ausgeschrieben in jedem Prompt: `head and shoulders portrait,
tight crop from the top of the head to mid chest`. Ohne diesen Satz liefert
Midjourney unter „portrait" eine Halbfigur bis zur Taille.

**Die Folge ist, dass keine Hände mehr im Bild sind, und damit kein Handrequisit.**
Zapfs Schraubenschlüssel, Nieselbecks Eimer, Trepps Umschlag, Milbs Zollstock,
Pommers Zettel, Umlaufs Laufzettel, Fass' Krug: alle draußen. Die Figuren sind
deshalb umgebaut worden, sodass ihr Kennzeichen oberhalb der Brust sitzt. Kappe,
Kragen, Krawatte, Brille, Ordenskette, Trageriemen, Lesart des Gesichts. Bramsches
Kater schläft jetzt auf ihrer Schulter statt auf ihrem Arm, und Nachtrags Brief ist
ersatzlos weg, weil ein Brief ohne Hand keinen Sinn ergibt.

Zwei Motive folgen dem Rahmen nicht und behalten ihren eigenen: der Kater Anlage 3
(Nahaufnahme, er füllt das Bild) und die Tür des Kaisers (ganze Tür im Bild, keine
Figur). Beide tragen die Porträtformel deshalb ausdrücklich nicht.

## Die Palette ist festgenagelt

„32 colour palette" nennt nur die Anzahl, nicht die Stimmung, und Midjourney legt
dann pro Lauf irgendetwas zwischen knallbunt und gedeckt vor. Deshalb steht die
Palette jetzt in jedem Prompt ausgeschrieben: `muted desaturated colours, dusty
ochre, faded olive, slate blue, warm grey, no bright saturated colours`.

Die Kleidungsfarben aus der Weltbibel sind entsprechend auf gedeckte Varianten
gezogen: verblasstes Königsblau bei Bramsche und Umlauf, stumpfes Gold bei Vorblatt,
mattes Grün bei Nörgels Haut, gedecktes Rot bei Fass. Wer eine davon wieder auf
Vollton stellt, holt sich die Streuung zurück.

## Zwei Prompts sind nachgeschärft (22.08.2026)

Nach dem ersten Durchlauf sind alle neunzehn Motive abgenommen worden bis auf zwei.
Deren Prompts stehen oben bereits in der geschärften Fassung.

**Zwirn** kam in gesättigtem Orange und Türkis zurück, mit 84.778 Farben das bunteste
Bild der Sammlung. Neu sind `washed out and dull throughout` in der Palette, die
Kleidung ausdrücklich als `faded dusty ochre` und `tarnished dull brass`, und im
`--no` stehen jetzt `saturated colours, teal, turquoise, bright orange, shiny gold,
neon`. Die Karikatur bleibt unangetastet, die saß.

**Die Kaisertür** hatte ihren Größenwitz verloren: der Stapel reichte über zwei
Drittel der Türhöhe statt über sie hinaus, und die Tür stand in einem Raum. Neu sind
`taller than the door itself and reaches the top edge of the image, towering over the
door frame` sowie `the door floating on a flat background`, dazu im `--no` die Zeile
`room, wall, floor, ceiling, interior, perspective`.

## Drei Hinweise

**Kein Seed in den Prompts.** Der feste Seed war Werkzeug für den Epochentest. Für
den fertigen Cast ist er schädlich, er zwingt allen Figuren dieselbe Haltung auf.

**Stilreferenz für den letzten Rest Streuung.** Palette im Text bringt die Farben
zusammen, nicht aber Pinselführung und Rasterhärte. Dafür einen Lauf mit
`--sref random` starten, die Nummer notieren, die Midjourney dazu meldet, und
`--sref <NUMMER>` an alle zwanzig hängen. Bei v7 hält die Omni-Referenz (`--oref`
mit `--ow`) zusätzlich die Figur selbst konstant.

**Nachbearbeiten gehört dazu.** Midjourney gibt ein hochauflösendes Bild aus, das
grobe Pixel nur imitiert; an schrägen Kanten sitzen Zwischenpixel. Ergebnis auf 64
bis 96 Pixel Kantenlänge herunterrechnen (Nearest Neighbor, nicht bikubisch), dann
wieder hoch. Bei einem 32-Farben-Blockbild ist das genau die Behandlung, die es echt
aussehen lässt.

---

## 1. Knöterich, Amtsrat a. D.

```
pixel art portrait of an elderly male clerk in his late seventies, an enormous drooping grey moustache that hides his mouth entirely, tiny dot eyes behind huge round spectacles, a long thin neck, combed grey hair, worn brown three-piece suit, faded tie, a pencil behind one ear, polite and faintly sad, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 2. Alfons Zwirn, Bürgermeister

```
pixel art portrait of a portly village mayor, a gigantic beaming grin filling half his face, tiny squeezed eyes, heavy jowls, thinning sandy hair combed over a shiny head, a threadbare waistcoat in faded dusty ochre, a tarnished dull brass chain of office at the collar, hearty and hollow, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, washed out and dull throughout, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain flat dark slate green background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands, saturated colours, teal, turquoise, bright orange, shiny gold, neon
```

## 3. Ottilie Bramsche, Registratorin

```
pixel art portrait of a stern woman in her fifties, a towering vertical black bun twice as tall as her head, a sharp pointed nose, eyes narrowed to slits, high-collared faded royal blue dress with a white collar, a fat tabby cat asleep with its head on her shoulder, unreadable, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 4. Reinhold Zapf, Hausmeister

```
pixel art portrait of a caretaker in his sixties, an enormous square jaw and a tiny head on gigantic shoulders, permanent squint, short brown hair, grey stubble, faded green work overall straps over a worn undershirt, a pencil stub behind one ear, entirely unbothered, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 5. Lisbeth Fuhr, Praktikantin

```
pixel art portrait of a young woman in her early twenties, huge round hopeful eyes and a tiny nose, dark hair exploding out of a loose bun, green blouse collar, a heavy satchel strap across her chest, earnest and exhausted, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 6. Emil Trepp der Siebte, Zusteller

```
pixel art portrait of a wiry postman in his forties, an enormous drooping nose, heavy sagging eyelids, a blond quiff escaping under an oversized peaked cap, worn faded blue postal uniform collar with brass buttons, a mail sack strap across his chest, apologetic, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 7. Nörgel, Sachbearbeiter auf Probe

```
pixel art portrait of a small goblin office clerk, dull green skin, gigantic pointed ears, an enormous scowling brow over tiny furious eyes, a wide downturned mouth, ill-fitting grey office shirt collar, a carefully knotted dark red necktie, grumbling and dignified, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 8. Dr. phil. Milb, Gutachter

```
pixel art portrait of a portly appraiser in his sixties, a towering domed forehead, a tiny pince-nez perched far too high, chin tilted up in absolute certainty, long grey hair to the collar, faded blue academic coat, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 9. Herr Pommer, Materialausgabe

```
pixel art portrait of a storekeeper in his fifties, an extremely long narrow face, enormous half-moon glasses sliding off a thin nose, a tiny pursed mouth, one eyebrow raised very high, short blond hair, khaki work smock over shirt and tie, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 10. Bruno Fass, Wirt

```
pixel art portrait of an innkeeper in his forties, a huge round head on a thick neck, an enormous warm grin, tiny cheerful eyes, short black hair, open dull red shirt collar, a leather apron strap over one shoulder, unhurried, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 11. Herr Lott und Herr Pahl, auf der Bank

```
pixel art portrait of two ancient men side by side, both with enormous bulbous noses and sunken toothless cheeks, the left one with wisps of brown hair and a patched brown coat collar, the right one ginger going white in a grey coat with mismatched buttons, both grinning at something off frame, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 12. Ferdinand Nieselbeck, Wetterbeauftragter

```
pixel art portrait of a thin man in his sixties, a very long drooping face and a large hopeful nose, wide eager eyes, grey hair under an oversized peaked weather service cap, green work jacket buttoned to the very top, looking hopefully upward, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 13. Kordula Umlauf, Reichsbotin

```
pixel art portrait of an athletic woman in her thirties, a sharp angular face mid-sentence, mouth open in fast speech, eyebrows high, red hair flying loose from its tie, faded royal blue courier uniform collar with brass buttons, a short travelling cape, a dispatch satchel strap across her chest, head already turning away, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 14. Reichsministerialdirektor zu Händen Vorblatt

```
pixel art portrait of a tall senior official in his fifties, an impossibly long narrow face, heavy hooded eyelids, an extremely small polite smile, slicked black hair, dark formal coat with dull gold trim and a very high collar, bundles of bound files strapped over both shoulders, courteous and never threatening, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 15. Dr. Wilhelmine Sturz, Amtsleiterin

```
pixel art portrait of a determined woman in her sixties, a heavy square jaw and deep carved frown lines, hard steady eyes, iron grey hair pinned back severely, travel-worn dark official coat collar, a faded service insignia at the lapel, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 16. Fürst Nachtrag, der Schattenfürst

```
pixel art portrait of a regal shadow figure with absurdly broad shoulders and an elegant elongated silhouette, smooth featureless darkness where the face should be, two tiny pale glowing eyes, a very high collar and a cloak, courteous posture, melancholy rather than menacing, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 17. Anlage 3, Kater

```
pixel art of an absurdly fat contented tabby cat asleep on a tall stack of dusty file folders, comically round, cheeks spread flat, tail hanging over the edge, one ear folded, close crop, the cat filling most of the frame, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 18. Konrad zu Händen Aufschub, Vierter Wartender

```
pixel art portrait of a very old nobleman, everything about him drooping, an enormous dignified nose, half-closed patient eyes, thin white hair, faded courtly finery two centuries out of fashion, worn velvet coat collar, a limp lace collar, serene and mildly proud, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 19. Der Außendienst (Spieler)

```
pixel art portrait of an ordinary field officer of a small ministry in their twenties, a perfectly round forgettable face, exaggeratedly average features, blank willing expression, plain grey service coat collar, a satchel strap across the chest, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, LucasArts SCUMM adventure game portrait, Monkey Island and Day of the Tentacle style, Peter Chan caricature, exaggerated cartoon proportions, oversized features, expressive comic face, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, hands
```

## 20. Die Tür des Kaisers

```
pixel art of a tall closed double door of dark polished wood with heavy brass fittings and a small blank brass plaque, in front of it a colossal stack of unopened blank letters that is taller than the door itself and reaches the top edge of the image, towering over the door frame, comically precise stacking, no people, straight-on view, the whole door inside the frame, LucasArts SCUMM adventure game background, Monkey Island and Day of the Tentacle style, exaggerated cartoon proportions, warm and sympathetic, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain flat dark slate green background, the door floating on a flat background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, watermark, full body, people, room, wall, floor, ceiling, interior, perspective
```

## 21. Anlage 2, die Beilage

*(Nachgetragen mit T3. Der dritte Prompt ohne Gesicht, nach dem Kater und der Kaisertür,
und er folgt deren eigenem Rahmen statt dem Kopf-bis-Brust-Rahmen. Wichtig ist die
Heftklammer: sie ist die Figur. Das Blatt bleibt ausdrücklich `blank`, weil ein
Schriftstück mit erfundener Aufschrift eine erfundene Aussage wäre und diese Figur ihre
Aussage im Spiel selbst macht.)*

```
pixel art of a single sheet of aged yellowed paper seen straight on, dog eared and soft at the corners, completely blank with no writing of any kind, one bold oversized brass staple punched through the top left corner, a torn scrap of a second sheet still caught under the staple, the paper filling most of the frame and floating on a flat background, gently curled as if it has been carried in a bag for a long time, comically dignified, no people, no hands, LucasArts SCUMM adventure game background, Monkey Island and Day of the Tentacle style, exaggerated cartoon proportions, warm and sympathetic, never grotesque, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1991 point and click adventure portrait, plain flat dark slate green background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, photorealism, blur, text, writing, letters, handwriting, print, watermark, full body, people, hands, faces, room, wall, floor, desk, table, interior, perspective
```

**Bis das Bild da ist**, steht in `assets/portraets/anlage2.png` ein selbst gezeichneter
Platzhalter aus `tools/anlage2-portraet.py`: dasselbe Motiv in derselben Palette, geometrisch
statt gemalt. Er wird ersetzt, sobald ein Motiv aus dem Prompt oben vorliegt; der Weg dahin
ist der übliche (Original nach `assets/figuren/21-anlage2.jpg`, Eintrag in `TAFEL` in
`tools/figuren-px.py`, dann `python3 tools/figuren-px.py --tafel`).

---

## Was die Prompts absichtlich nicht tun

**Keine Schrift.** Jeder Prompt hat `text` und `watermark` im `--no`. Papier, das
noch im Bild ist, steht ausdrücklich als `blank` im Motiv (das Schild an der
Kaisertür, die Akten unter dem Kater). Bildmodelle schreiben Kauderwelsch, und
Midjourneys `--no` ist schwächer als das Negativ anderer Modelle, deshalb die
doppelte Absicherung. Trepps Umschlag ist mit dem engeren Ausschnitt ohnehin aus dem
Bild, und das ist kein Verlust: eine erfundene Aufschrift wäre bei ihm inhaltlich
falsch, die Unlesbarkeit der Adresse ist der Kern der Figur.

**Keine Mechanik im Bild.** Kein Kessel, keine Zutaten, keine Aktenzeichen. Der
Sperrvermerk aus Kapitel 7 der Weltbibel gilt für Bilder genauso wie für Zeilen.

**Kein Boss-Posing bei Vorblatt und Nachtrag.** Beide sind höflich. Bei Vorblatt
steht „polite and never threatening" im Prompt, bei Nachtrag „sad rather than
menacing". Ein finsterer Blick macht aus der Pointe eine Fantasy-Schablone.
