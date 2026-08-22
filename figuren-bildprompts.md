# Figuren-Bildprompts für Nano Banana

Zwanzig fertig zusammengesetzte Prompts, einer je Figur. Nichts zusammenstückeln,
nichts einsetzen: Block kopieren, in Nano Banana (Gemini Image) einfügen, fertig.

Grundlage sind `superduper-weltbibel.md` Kapitel 8 (Das Ensemble), `weltgeschichte.md`
Kapitel 6 (Neue Figuren) und die Optik-Angaben aus `figuren-dorf.md`. Wo die Weltbibel
eine Farbe oder ein Kleidungsstück festlegt, steht sie hier auch so drin; Alter,
Statur und Haltung sind daraus abgeleitet und frei.

## Wofür das ist, und wofür nicht

Das sind **Porträts für Doku, Kladde und Konzeptarbeit**, keine Spielgrafik. Die
Gesprächstafel schneidet ihr Porträt seit U4 aus dem laufenden Sprite
(`PORTRAET_X/Y/B/H`), erwartet also das 64x64-Held-Komposit. Laufsheets aus einem
Bildmodell zu holen funktioniert nicht, dafür fehlt die Frame-Konsistenz über die
Animationszeilen.

## Drei Hinweise vorweg

**Englisch, nicht Deutsch.** Gemini hält Stilanweisungen auf Englisch merklich
zuverlässiger ein. Die Prompts stehen deshalb auf Englisch da.

**Einheitlicher Cast.** Die erste Figur generieren, das Ergebnis als Referenzbild in
den nächsten Prompt mitgeben und dazuschreiben: *same palette, same pixel scale, same
rendering style as the reference image, different character.* Reine Textwiederholung
hält den Look nicht zusammen, ein Referenzbild schon.

**Nachbearbeiten.** Nano Banana liefert oft weichgezeichnete Illustration mit
Pixel-Dekor statt echter Pixel-Art. Das Ergebnis hart auf 128 bis 192 Pixel
Kantenlänge herunterrechnen (Nearest Neighbor, kein bikubisch) und wieder
hochskalieren. Was dabei zerfällt, war nie Pixel-Art.

---

## 1. Knöterich, Amtsrat a. D.

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: an elderly male clerk, late seventies, thin and slightly stooped, neatly
combed grey hair and a trimmed grey moustache, small round spectacles. Worn brown
three-piece suit with shiny elbows, a cardigan underneath, a pencil behind one ear.
He holds a small ruled notebook open in one hand and a stub of pencil in the other,
mid-note. His expression is polite, attentive and faintly sad, like a man who knows
something he is not allowed to say.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

## 2. Alfons Zwirn, Bürgermeister

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a portly middle-aged village mayor, ruddy cheeks, thinning sandy hair, a
wide practiced smile. Too-tight festive waistcoat over a rumpled shirt, a mayoral
chain of office, a small wilted flower in the buttonhole. Both hands spread open in
the middle of an announcement. Hearty, hollow, and somewhere underneath it decent.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

## 3. Ottilie Bramsche, Registratorin

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a stern woman in her fifties, black hair in a severe bun, a high-collared
royal blue dress with white cuffs, ink-stained fingers, a small key ring at her
belt. She holds a closed file folder flat against her chest and gives away nothing.
A fat sleeping tabby cat is draped over her forearm, entirely at ease.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character and the cat only. Square image, 1:1.
```

## 4. Reinhold Zapf, Hausmeister

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a broad, silent caretaker in his sixties, short brown hair, grey stubble,
faded green work overalls over a worn undershirt, a heavy leather tool belt. An
adjustable wrench in one fist, a chipped enamel coffee mug in the other. Calm,
capable, entirely unbothered by anything that has ever happened in this building.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

## 5. Lisbeth Fuhr, Praktikantin

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a young woman in her early twenties, dark hair in a loose bun with strands
escaping, a green blouse and a red skirt, sleeves pushed up. A canvas satchel
overflowing with papers hangs from one shoulder, clearly too heavy. She holds a
half-written report against her hip. Earnest, tired, and about to ask a question
nobody wants to answer.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

## 6. Emil Trepp der Siebte, Zusteller

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a wiry postman in his forties, blond quiff, a blue postal uniform gone
shiny with age, a peaked cap, an enormous worn leather mail sack across his body.
He holds one single yellowed envelope with both hands, as carefully as if it were
glass, and looks at it rather than at the viewer. Apologetic stoop, decades of it.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. The
envelope must be blank and unwritten. One character only. Square image, 1:1.
```

## 7. Nörgel, Sachbearbeiter auf Probe

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a small green-skinned goblin clerk with pointed ears and a heavy brow,
dressed in an ill-fitting grey office shirt and a very carefully knotted necktie.
Arms folded, shoulders up, grumbling about something. Short, unheroic, and entirely
dignified. He is an office worker who happens to be a goblin, not a monster in
costume.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

## 8. Dr. phil. Milb, Gutachter

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a portly appraiser in his sixties, long grey hair to the collar, a blue
academic coat with worn cuffs, a pince-nez pushed up onto his forehead. A folding
measuring rule in one hand, an assessment form in the other, held up as he delivers
a verdict. Absolutely certain, and wrong by exactly one grade.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

## 9. Herr Pommer, Materialausgabe

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a dry-faced storekeeper in his fifties, short blond hair, a khaki work
smock over a shirt and tie, half-moon glasses low on the nose. He reads aloud from
a requisition slip held at arm's length, one eyebrow raised, the other hand resting
on a small stack of boxed supplies. Pedantic, unhurried, quietly pleased with
himself.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. The
slip must be blank and unwritten. One character only. Square image, 1:1.
```

## 10. Bruno Fass, Wirt

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a broad-shouldered innkeeper in his forties, short black hair, a red shirt
with rolled sleeves, blue trousers, a scuffed leather apron. He polishes a pewter
tankard with a cloth without looking at it. Warm, unhurried, the kind of host who
waits for people to finish their sentence.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

## 11. Herr Lott und Herr Pahl, auf der Bank

Der einzige Doppelprompt. Die beiden sind der Chor und gehören ins selbe Bild.

```
Highly detailed pixel art character portrait, two subjects side by side, seated,
three-quarter view, facing slightly left.

SUBJECT: two very old men sitting side by side on a worn wooden bench. The left one
has thin brown hair and a patched brown coat, the right one has ginger hair going
white and a grey coat with mismatched buttons. Both rest their hands on walking
sticks. They are commenting on something just outside the frame and finding it
funny. They have sat here longer than anyone can remember, and it shows in the
bench.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The characters are people, not jokes.

COMPOSITION: both figures fully inside the frame with a small margin, the bench
included, flat single-colour background (#1b1a24), no further scenery, no ground
shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo.
Exactly two characters. Square image, 1:1.
```

## 12. Ferdinand Nieselbeck, Wetterbeauftragter

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a thin man in his sixties, grey hair under a peaked weather-service cap, a
green work jacket buttoned to the top. A galvanised metal bucket in one hand, a
wooden measuring rod in the other, both spotless from never having been used. He is
looking hopefully upward. Never disappointed, always ready.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

## 13. Kordula Umlauf, Reichsbotin

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, caught mid-stride.

SUBJECT: an athletic woman in her thirties, red hair tied back, a royal blue
courier's uniform with brass buttons and a short travelling cape, sturdy boots, a
leather dispatch satchel on her hip. A long paper list unrolls from one hand and
reaches out of frame. She is already half turned away, listening but leaving.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. The
list must be blank and unwritten. One character only. Square image, 1:1.
```

## 14. Reichsministerialdirektor zu Händen Vorblatt

Der Gegenspieler. Wichtig: er droht nie. Wenn das Bild bedrohlich wirkt, ist es
falsch. Die Bedrohung liegt in der Höflichkeit.

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, neutral standing pose.

SUBJECT: a tall, immaculate senior official in his fifties, slicked black hair, a
dark formal coat with gold trim and a high collar, white gloves. Thick bundles of
bound files are strapped across his body like decorations, and they are the reason
he no longer fits through ordinary doors. Hands folded in front of him. A small
courteous smile that does not reach the eyes. Perfectly polite, never threatening.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent, gold used sparingly
as the only bright note. Shading in clean flat bands with sparse, purposeful
dithering only in the transition zones. Crisp dark outline around the silhouette,
lighter interior lines. Rich detail in fabric folds, buttons, stitching, paper and
wear marks, but every detail resolved as actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. This character is the antagonist, and
his menace is entirely politeness. No sneer, no shadow over the eyes, no villain
posing.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

## 15. Dr. Wilhelmine Sturz, Amtsleiterin (vermisst)

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, standing very straight.

SUBJECT: a determined woman in her sixties, iron-grey hair pinned back, a
travel-worn dark official coat with a faded service insignia, a battered leather
satchel over one shoulder, road dust on the hem. Her posture is upright and her jaw
is set. Forty years of unanswered letters have hardened into something patient and
very angry.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

## 16. Fürst Nachtrag, der Schattenfürst

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, formal upright bearing.

SUBJECT: a tall, regal shadow-being in dark formal court dress with a high collar
and a long cloak. His form is the silhouette of a nobleman rather than a beast:
smooth darkness where the face should be, two faintly glowing pale eyes, long
slender hands. A quill in one hand, an endlessly unfurling written letter in the
other, spilling past the frame. His bearing is impeccably courteous. He is
frightening only because of his scale, never because of his posture.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, deep violet-black for the figure, a single cold pale
accent for the eyes. Shading in clean flat bands with sparse, purposeful dithering
only in the transition zones. Crisp outline around the silhouette. Rich detail in
cloth folds, quill and paper, but every detail resolved as actual pixels, never as
painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim. This is a nobleman waiting for a reply, not a demon. Sad and
courtly, not menacing.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. The
letter must show handwriting-like strokes but no readable words. One character
only. Square image, 1:1.
```

## 17. Anlage 3, Kater

Kein Porträtaufbau, deshalb weichen die erste Zeile und die Komposition ab.

```
Highly detailed pixel art object study, single subject, side view, at rest.

SUBJECT: a fat, contented tabby cat asleep on top of a tall stack of dusty file
folders and tied paper bundles. Tail hanging over the edge, one ear folded, paws
tucked in. The stack leans very slightly. Nobody is going to move this cat.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fur,
paper edges, string and dust, but every detail resolved as actual pixels, never as
painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny.

COMPOSITION: centred, cat and stack fully inside frame with a small margin, flat
single-colour background (#1b1a24), no further scenery, no ground shadow, no frame
or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
cat only. Square image, 1:1.
```

## 18. Konrad zu Händen Aufschub, Vierter Wartender

Nur nötig, wenn Hochablage bebildert wird: Intro, Serie H, Abspann.

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly left, standing patiently in a queue.

SUBJECT: an old nobleman with thin white hair, dressed in faded courtly finery two
centuries out of fashion, a worn velvet coat and a limp lace collar. Hands folded
over a rolled petition he has carried for a very long time. Serene, upright, mildly
proud. He has spent his whole life in a corridor and considers it a career.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded court reds and golds, a single warm lamp-light accent. Shading in clean flat
bands with sparse, purposeful dithering only in the transition zones. Crisp dark
outline around the silhouette, lighter interior lines. Rich detail in fabric folds,
buttons, stitching, paper and wear marks, but every detail resolved as actual
pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

---

## Zugabe

Zwei Motive, die keine Figur der Liste sind, aber ohne die zwei Stellen der
Geschichte kein Bild haben.

### 19. Die Tür des Kaisers

Kaiser Ordinat der Vierte hat keinen Auftritt, nie. Es gibt eine Tür, ein Schild und
einen Stapel. Das Schild bleibt hier absichtlich leer, Bildmodelle schreiben
zuverlässig Unsinn darauf; die Aufschrift kommt später von Hand dazu.

```
Highly detailed pixel art environment study, single subject, straight-on view.

SUBJECT: a tall closed double door of dark polished wood with heavy brass fittings
and a small blank brass plaque at eye height. In front of it, a stack of unopened
letters and parcels almost as tall as the door, piled with obsessive neatness, not
one envelope out of line. Nothing else. Nobody has knocked in a very long time.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
dark wood, tarnished brass, a single warm lamp-light accent from above. Shading in
clean flat bands with sparse, purposeful dithering only in the transition zones.
Crisp dark outlines. Rich detail in wood grain, envelope edges and dust, but every
detail resolved as actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny. Reverent, almost solemn.

COMPOSITION: door centred, the whole stack inside frame with a small margin, flat
single-colour background (#1b1a24) around the door, no room, no ceiling, no ground
shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. The
plaque and every envelope must be completely blank. Square image, 1:1.
```

### 20. Der Außendienst (Spieler)

Der Spieler hat keinen Namen und jede Schicht ein anderes Gesicht. Für die
Gesprächstafel unten rechts. Diesen Prompt mehrfach laufen lassen und Haar, Alter
und Statur variieren, dann hat man eine Reihe statt einer Person.

```
Highly detailed pixel art character portrait, single subject, bust to mid-thigh,
three-quarter view, facing slightly right, neutral standing pose.

SUBJECT: an ordinary field officer of a small ministry, mid twenties, unremarkable
in the best way. A plain grey service coat with a cloth armband, a satchel, a
ledger tucked under one arm, a rubber stamp hanging from a lanyard. Sturdy boots.
Hired this morning, employed until this evening, and taking it seriously.

STYLE: hand-crafted 16-bit era pixel art in the spirit of Owlboy and Eastward.
Chunky, deliberately placed pixels with visible square pixel clusters, hard aliased
edges, absolutely no anti-aliasing, no smoothing, no blur, no gradients. Limited
palette of roughly 32 colours, warm and slightly desaturated, dusty paper tones,
faded office greens and blues, a single warm lamp-light accent. Shading in clean
flat bands with sparse, purposeful dithering only in the transition zones. Crisp
dark outline around the silhouette, lighter interior lines. Rich detail in fabric
folds, buttons, stitching, paper and wear marks, but every detail resolved as
actual pixels, never as painted texture.

MOOD: a shabby, endlessly patient civil-service world. Bureaucratic fantasy, warm
rather than grim, quietly funny, dignified. The character is a person, not a joke.

COMPOSITION: centred, full subject inside frame with a small margin, flat
single-colour background (#1b1a24), no scenery, no props floating in the air, no
ground shadow, no frame or border.

STRICT: no text, no letters, no numbers, no watermark, no signature, no logo. One
character only. Square image, 1:1.
```

---

## Was die Prompts absichtlich nicht tun

**Keine Schrift.** Jeder Block verbietet Buchstaben und Zahlen, und wo Papier im
Bild ist (Trepps Umschlag, Pommers Zettel, Umlaufs Liste, Nachtrags Brief, das
Türschild), steht das Verbot ein zweites Mal. Bildmodelle schreiben Kauderwelsch,
und ein Umschlag mit erfundener Aufschrift wäre bei Trepp sogar inhaltlich falsch:
die Adresse ist der Kern der Figur.

**Keine Mechanik im Bild.** Kein Kessel, keine Zutaten, keine Aktenzeichen. Der
Sperrvermerk aus Kapitel 7 der Weltbibel gilt für Bilder genauso wie für Zeilen.

**Kein Boss-Posing bei Vorblatt und Nachtrag.** Beide sind höflich. Ein finsterer
Blick oder eine drohende Geste macht aus der Pointe eine Fantasy-Schablone.
