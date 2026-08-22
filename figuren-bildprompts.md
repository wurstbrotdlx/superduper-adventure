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
Halbfigur und ohne festgelegte Palette, das steht im Commit `2266e57`.

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

80er-Optik entsteht durch Verzicht. Deshalb steht in keinem Prompt „highly detailed",
keine Stoffnähte, keine Falten. Die Wirkung kommt daher, dass wenige Pixel sitzen,
nicht daher, dass es viele sind. Wer hier Detail nachschiebt, bekommt den Look nicht
schärfer, sondern kaputt. `--s 25` hält aus demselben Grund Midjourneys Hausgeschmack
kurz: Stilisierung heißt dort hübscher, weicher, moderner.

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
(Nahaufnahme) und die Tür des Kaisers (ganze Tür im Bild, keine Figur).

## Die Palette ist festgenagelt

„32 colour palette" nennt nur die Anzahl, nicht die Stimmung, und Midjourney legt
dann pro Lauf irgendetwas zwischen knallbunt und gedeckt vor. Deshalb steht die
Palette jetzt in jedem Prompt ausgeschrieben: `muted desaturated colours, dusty
ochre, faded olive, slate blue, warm grey, no bright saturated colours`.

Die Kleidungsfarben aus der Weltbibel sind entsprechend auf gedeckte Varianten
gezogen: verblasstes Königsblau bei Bramsche und Umlauf, stumpfes Gold bei Vorblatt,
mattes Grün bei Nörgels Haut, gedecktes Rot bei Fass. Wer eine davon wieder auf
Vollton stellt, holt sich die Streuung zurück.

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
pixel art portrait of an elderly male clerk in his late seventies, gaunt lined face, combed grey hair, grey moustache, small round spectacles, worn brown three-piece suit, faded tie, a pencil behind one ear, polite and faintly sad, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 2. Alfons Zwirn, Bürgermeister

```
pixel art portrait of a portly middle-aged village mayor, ruddy cheeks, thinning sandy hair, wide practiced smile, tight festive waistcoat, a tarnished mayoral chain of office at the collar, hearty and hollow, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 3. Ottilie Bramsche, Registratorin

```
pixel art portrait of a stern woman in her fifties, black hair in a severe bun, high-collared faded royal blue dress with a white collar, a fat tabby cat asleep with its head resting on her shoulder, closed unreadable expression, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 4. Reinhold Zapf, Hausmeister

```
pixel art portrait of a broad silent caretaker in his sixties, weathered face, short brown hair, grey stubble, faded green work overall straps over a worn undershirt, a pencil stub behind one ear, entirely unbothered, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 5. Lisbeth Fuhr, Praktikantin

```
pixel art portrait of a young woman in her early twenties, dark hair in a loose bun with escaping strands, green blouse collar, a heavy satchel strap across her chest, earnest and tired, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 6. Emil Trepp der Siebte, Zusteller

```
pixel art portrait of a wiry postman in his forties, blond quiff under a peaked cap, worn faded blue postal uniform collar with brass buttons, a mail sack strap across his chest, apologetic tired eyes, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 7. Nörgel, Sachbearbeiter auf Probe

```
pixel art portrait of a small goblin office clerk, dull green skin, pointed ears, heavy brow, ill-fitting grey office shirt collar, a carefully knotted dark red necktie, grumbling, short and dignified, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 8. Dr. phil. Milb, Gutachter

```
pixel art portrait of a portly appraiser in his sixties, long grey hair to the collar, faded blue academic coat, a pince-nez pushed up on his forehead, chin raised, absolutely certain, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 9. Herr Pommer, Materialausgabe

```
pixel art portrait of a dry-faced storekeeper in his fifties, short blond hair, khaki work smock over shirt and tie, half-moon glasses low on the nose, one eyebrow raised, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 10. Bruno Fass, Wirt

```
pixel art portrait of a broad-shouldered innkeeper in his forties, short black hair, open dull red shirt collar, a leather apron strap over one shoulder, warm and unhurried, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 11. Herr Lott und Herr Pahl, auf der Bank

```
pixel art portrait of two very old men side by side, heads and shoulders, the left one with thin brown hair and a patched brown coat collar, the right one ginger going white in a grey coat with mismatched buttons, both amused, commenting on something off frame, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 12. Ferdinand Nieselbeck, Wetterbeauftragter

```
pixel art portrait of a thin man in his sixties, grey hair under a peaked weather service cap, green work jacket buttoned to the top collar, looking hopefully upward, never disappointed, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 13. Kordula Umlauf, Reichsbotin

```
pixel art portrait of an athletic woman in her thirties, red hair tied back, faded royal blue courier uniform collar with brass buttons, a short travelling cape over the shoulders, a dispatch satchel strap across her chest, head half turned away, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 14. Reichsministerialdirektor zu Händen Vorblatt

```
pixel art portrait of a tall immaculate senior official in his fifties, slicked black hair, dark formal coat with dull gold trim and a high collar, bundles of bound files strapped over both shoulders, a small courteous smile that does not reach the eyes, polite and never threatening, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 15. Dr. Wilhelmine Sturz, Amtsleiterin

```
pixel art portrait of a determined woman in her sixties, iron grey hair pinned back, travel-worn dark official coat collar, a faded service insignia at the lapel, jaw set, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 16. Fürst Nachtrag, der Schattenfürst

```
pixel art portrait of a regal shadow figure, dark formal court dress with a high collar, a cloak over the shoulders, smooth featureless darkness where the face should be, two pale glowing eyes, courteous bearing, sad rather than menacing, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 17. Anlage 3, Kater

```
pixel art portrait of a fat contented tabby cat asleep, head resting on a stack of dusty file folders, one ear folded, whiskers, close crop, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 18. Konrad zu Händen Aufschub, Vierter Wartender

```
pixel art portrait of an old nobleman with thin white hair, faded courtly finery two centuries out of fashion, worn velvet coat collar, a limp lace collar, serene, upright, mildly proud, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 19. Der Außendienst (Spieler)

```
pixel art portrait of an ordinary field officer of a small ministry in their twenties, unremarkable face, plain grey service coat collar, a satchel strap across the chest, neutral and competent, head and shoulders portrait, tight crop from the top of the head to mid chest, centred, facing the viewer, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, full body, hands
```

## 20. Die Tür des Kaisers

```
pixel art of a tall closed double door of dark polished wood with heavy brass fittings and a small blank brass plaque, an enormous neatly piled stack of unopened blank letters in front of it, almost as tall as the door, no people, straight-on view, the whole door inside the frame, chunky pixels, low resolution, 32 colour palette, muted desaturated colours, dusty ochre, faded olive, slate blue, warm grey, no bright saturated colours, dark outlines, blocky shapes, flat colour fills, ordered dither pattern shading, no smooth edges, Amiga 500 pixel art, 1989 demoscene portrait, plain dark background --ar 1:1 --style raw --s 25 --no gradients, smooth shading, fine detail, texture, realism, blur, text, watermark, people
```

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
