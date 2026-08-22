# Figuren-Bildprompts für Midjourney

Zwanzig kopierfertige Prompts, einer je Figur, alle in derselben Amiga-Fassung:
grobe Pixel, 32 Farben, harte Kanten, Dithering statt Verlauf. Block kopieren,
in Midjourney einfügen, fertig.

Grundlage sind `superduper-weltbibel.md` Kapitel 8 (Das Ensemble), `weltgeschichte.md`
Kapitel 6 (Neue Figuren) und die Optik-Angaben aus `figuren-dorf.md`. Wo die Weltbibel
eine Farbe oder ein Kleidungsstück festlegt, steht sie hier auch so drin; Alter,
Statur und Haltung sind daraus abgeleitet und frei.

**Vorgeschichte.** Die erste Fassung dieser Datei war auf Nano Banana (Gemini Image)
ausgelegt, in ausformulierter Prosa und mit feinem 16-Bit-Look. Nano Banana liefert
dabei zuverlässig weichgezeichnete Illustration mit Pixeldekor statt Pixel-Art, und
die feine Fassung überlebt das Herunterrechnen nicht. Beides ist am 22.08.2026
verworfen worden. Wer sie braucht, findet sie im Commit `3f54fa2`.

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

Wichtig dabei: 80er-Optik entsteht durch Verzicht. Deshalb steht in keinem Prompt
mehr „highly detailed", keine Stoffnähte, keine Falten. Die Wirkung kommt daher,
dass wenige Pixel sitzen, nicht daher, dass es viele sind. Wer hier Detail
nachschiebt, bekommt den Look nicht schärfer, sondern kaputt.

`--s 25` hält Midjourneys Hausgeschmack kurz. Stilisierung heißt dort fast immer
hübscher, weicher, moderner, und genau das ist hier falsch.

## Drei Hinweise

**Kein Seed in den Prompts.** Der feste Seed war ein Werkzeug für den Epochentest.
Für den fertigen Cast ist er schädlich: er zwingt allen Figuren dieselbe Haltung auf.

**Einheitlicher Cast.** Sobald ein Bild sitzt, dessen Look stimmt, dieses als
Stilreferenz an die übrigen Prompts hängen (`--sref <URL>`). Bei v7 hält die
Omni-Referenz (`--oref` mit `--ow`) zusätzlich die Figur selbst konstant. Reine
Textwiederholung hält den Look nicht zusammen, eine Referenz schon.

**Nachbearbeiten gehört dazu.** Midjourney gibt ein hochauflösendes Bild aus, das
grobe Pixel nur imitiert; an schrägen Kanten sitzen dann Zwischenpixel. Ergebnis auf
64 bis 96 Pixel Kantenlänge herunterrechnen (Nearest Neighbor, nicht bikubisch),
dann wieder hoch. Bei einem 32-Farben-Blockbild ist das genau die Behandlung, die es
echt aussehen lässt. Wenn das Werkzeug es kann, danach auf eine feste Palette
quantisieren.

---

## 1. Knöterich, Amtsrat a. D.

```
pixel art portrait of an elderly male clerk in his late seventies, thin and stooped, combed grey hair, grey moustache, small round spectacles, worn brown three-piece suit, cardigan, pencil behind one ear, holding an open notebook and a pencil stub, polite and faintly sad, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 2. Alfons Zwirn, Bürgermeister

```
pixel art portrait of a portly middle-aged village mayor, ruddy cheeks, thinning sandy hair, wide practiced smile, tight festive waistcoat, mayoral chain of office, both hands spread mid-announcement, hearty and hollow, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 3. Ottilie Bramsche, Registratorin

```
pixel art portrait of a stern woman in her fifties, black hair in a severe bun, high-collared royal blue dress, white cuffs, ink-stained fingers, holding a closed file folder against her chest, a fat sleeping tabby cat draped over her forearm, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 4. Reinhold Zapf, Hausmeister

```
pixel art portrait of a broad silent caretaker in his sixties, short brown hair, grey stubble, faded green work overalls, heavy leather tool belt, an adjustable wrench in one fist, a chipped enamel mug in the other, entirely unbothered, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 5. Lisbeth Fuhr, Praktikantin

```
pixel art portrait of a young woman in her early twenties, dark hair in a loose bun with escaping strands, green blouse, red skirt, sleeves pushed up, a heavy canvas satchel of papers on one shoulder, earnest and tired, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 6. Emil Trepp der Siebte, Zusteller

```
pixel art portrait of a wiry postman in his forties, blond quiff, worn blue postal uniform gone shiny with age, peaked cap, enormous leather mail sack, holding one blank yellowed envelope carefully with both hands, apologetic stoop, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 7. Nörgel, Sachbearbeiter auf Probe

```
pixel art portrait of a small green-skinned goblin office clerk, pointed ears, heavy brow, ill-fitting grey office shirt, carefully knotted red necktie, arms folded, grumbling, short and dignified, an office worker who happens to be a goblin, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 8. Dr. phil. Milb, Gutachter

```
pixel art portrait of a portly appraiser in his sixties, long grey hair to the collar, blue academic coat with worn cuffs, pince-nez pushed up on his forehead, a folding measuring rule in one hand, a blank assessment form in the other, absolutely certain, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 9. Herr Pommer, Materialausgabe

```
pixel art portrait of a dry-faced storekeeper in his fifties, short blond hair, khaki work smock over shirt and tie, half-moon glasses low on the nose, reading a blank slip held at arm's length, one eyebrow raised, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 10. Bruno Fass, Wirt

```
pixel art portrait of a broad-shouldered innkeeper in his forties, short black hair, red shirt with rolled sleeves, blue trousers, scuffed leather apron, polishing a pewter tankard with a cloth, warm and unhurried, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 11. Herr Lott und Herr Pahl, auf der Bank

```
pixel art double portrait of two very old men sitting side by side on a worn wooden bench, the left one with thin brown hair and a patched brown coat, the right one ginger going white in a grey coat with mismatched buttons, both hands resting on walking sticks, amused, commenting on something off frame, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 12. Ferdinand Nieselbeck, Wetterbeauftragter

```
pixel art portrait of a thin man in his sixties, grey hair under a peaked weather service cap, green work jacket buttoned to the top, a galvanised metal bucket in one hand, a wooden measuring rod in the other, looking hopefully upward, always ready, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 13. Kordula Umlauf, Reichsbotin

```
pixel art portrait of an athletic woman in her thirties, red hair tied back, royal blue courier uniform with brass buttons, short travelling cape, sturdy boots, leather dispatch satchel, a long blank paper list unrolling from one hand, half turned away mid-stride, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 14. Reichsministerialdirektor zu Händen Vorblatt

```
pixel art portrait of a tall immaculate senior official in his fifties, slicked black hair, dark formal coat with gold trim and a high collar, white gloves, thick bundles of bound files strapped across his body, hands folded, a small courteous smile that does not reach the eyes, polite and never threatening, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 15. Dr. Wilhelmine Sturz, Amtsleiterin

```
pixel art portrait of a determined woman in her sixties, iron grey hair pinned back, travel-worn dark official coat with a faded service insignia, battered leather satchel, road dust on the hem, standing very straight, jaw set, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 16. Fürst Nachtrag, der Schattenfürst

```
pixel art portrait of a tall regal shadow figure in dark formal court dress with a high collar and long cloak, smooth featureless darkness where the face should be, two pale glowing eyes, long slender hands, a quill in one hand and a long blank unfurling letter in the other, courteous bearing, sad rather than menacing, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 17. Anlage 3, Kater

```
pixel art of a fat contented tabby cat asleep on top of a tall stack of dusty file folders and tied paper bundles, tail hanging over the edge, one ear folded, paws tucked in, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 18. Konrad zu Händen Aufschub, Vierter Wartender

```
pixel art portrait of an old nobleman with thin white hair, faded courtly finery two centuries out of fashion, worn velvet coat, limp lace collar, hands folded over a rolled blank petition, serene, upright, mildly proud, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 19. Die Tür des Kaisers

```
pixel art of a tall closed double door of dark polished wood with heavy brass fittings and a small blank brass plaque, an enormous neatly piled stack of unopened blank letters and parcels in front of it, almost as tall as the door, no people, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

## 20. Der Außendienst (Spieler)

```
pixel art portrait of an ordinary field officer of a small ministry in their twenties, unremarkable, plain grey service coat with a cloth armband, satchel, a ledger under one arm, a rubber stamp on a lanyard, sturdy boots, neutral and competent, chunky pixels, low resolution, 32 colour palette, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, black background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark
```

---

## Was die Prompts absichtlich nicht tun

**Keine Schrift.** Jeder Prompt hat `text` und `watermark` im `--no`, und wo Papier
im Bild ist (Trepps Umschlag, Pommers Zettel, Umlaufs Liste, Nachtrags Brief, das
Türschild), steht das Papier ausdrücklich als `blank` im Motiv. Bildmodelle schreiben
Kauderwelsch, und ein Umschlag mit erfundener Aufschrift wäre bei Trepp sogar
inhaltlich falsch: die Adresse ist der Kern der Figur. Midjourneys `--no` ist
schwächer als das Negativ anderer Modelle, deshalb die doppelte Absicherung.

**Keine Mechanik im Bild.** Kein Kessel, keine Zutaten, keine Aktenzeichen. Der
Sperrvermerk aus Kapitel 7 der Weltbibel gilt für Bilder genauso wie für Zeilen.

**Kein Boss-Posing bei Vorblatt und Nachtrag.** Beide sind höflich. Bei Vorblatt
steht „polite and never threatening" im Prompt, bei Nachtrag „sad rather than
menacing". Ein finsterer Blick macht aus der Pointe eine Fantasy-Schablone.
