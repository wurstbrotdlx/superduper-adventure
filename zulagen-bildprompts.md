# Zulagen-Bildprompts für Midjourney

Fünfundvierzig kopierfertige Prompts: **drei je Zulagenfamilie, eines je Stufe.**
Block kopieren, in Midjourney einfügen, fertig.

Grundlage ist der Katalog `ZULAGE` in `index.html`, der Baubericht
`phase-k1-zulagen.md` und das Bestiarium der Weltbibel, Kapitel 6.

## Wofür das ist

Das ist **die Kartenkunst im Bildfenster**. Jede Karte hat seit dem Kartenumbau
ein Bildfenster im Verhältnis vier zu drei, darüber die Namensleiste, darunter
Typenzeile und Text. Genau dieses Fenster wird gefüllt, deshalb `--ar 4:3`.

Der Katalog nimmt die drei Bilder bereits an: `bild` ist ein Feld mit einem
Pfad je Stufe, Lücken fallen aufs Sinnbild zurück. Der Einbau ist eine Zeile.

## Der Stil kommt aus den Referenzbildern, nicht aus der Vergangenheit

Die erste Fassung stand auf der Amiga-Formel der Figurenporträts: zweiunddreißig
Farben, gedeckt, entsättigt. Sie ist durchgefallen, und die Messung sagt, warum:

| | Farben | Sättigung (0 bis 255) |
|---|---|---|
| Referenzbilder | 10.000 bis 238.000 | 143 bis 200 |
| Figurenporträts des Spiels | 32 | 56 bis 63 |

**Die Referenzen sind drei- bis viermal so gesättigt.** Die alte Formel schrieb
das Gegenteil vor. Sie gilt für die Porträts weiter und für die Karten nicht
mehr.

Was aus den Referenzen abgelesen und in die Formel übernommen ist: modernes,
hoch aufgelöstes Pixel-Art mit harten Kanten; kräftige, gesättigte Farben;
Rim-Light und Innenglühen; Bloom um jede Lichtquelle; dunkle Silhouette gegen
brennenden Hintergrund; kräftige Konturen; Dithering in den Verläufen;
zentrierte, ikonische Komposition.

**Dass die Karten dadurch anders aussehen als das Spiel, ist kein Fehler.** Es
ist Humor-Grundgesetz Regel 10: die Form ist episch, der Inhalt ist Papier. Ein
Haus, das seine eigenen Zulagen laminiert und vergoldet, während draußen alles
grau ist, ist die Pointe und nicht ihr Bruch.

## Wirkung statt Gegenstand

Zehn Familien zeigen, **was die Karte tut**, an einem Opfer aus dem eigenen
Bestiarium. Fünf stille zeigen weiter den Gegenstand: Leben, Manakosten,
Lauftempo, Manaregeneration und Erfahrung haben kein Opfer.

**Der größte Hebel war ein Fehler in der ersten Fassung.** Dort stand in jedem
`--no` die Zeile `people, faces`. Damit war dem Modell verboten, ein Opfer ins
Bild zu setzen, also genau das, was eine Kartenwirkung ausmacht. Bei den zehn
Wirkungsszenen ist die Sperre gefallen; bei den fünf Gegenstandsszenen steht
sie weiter, dort stört Publikum nur.

**Konfetti statt Blut**, und das ist Kanon (Weltbibel Kapitel 1): wer ein
Monster erledigt, sieht Aktenkonfetti. Es stirbt nie jemand, es wird
abgeschlossen. Jede Wirkungsszene trägt das im Bild.

**Es sind die Monster dieses Spiels.** Grünhaut, Knochenritter, Mumie,
Waldschamane, Sandskorpion, Schattenling und der Wandelnde Ablagestapel stehen
alle im Bestiarium. Letzterer ist der Glücksfall für die Axt: ein Gegner, der
aus Akten besteht. Die Axt spaltet damit keinen Papierstapel, sondern jemanden,
der einer ist.

## Der Ton, und warum er die Bilder besser macht

Die erste Fassung dieser Prompts war zu brutal, und der schlimmste Ausrutscher
war die Stichprobe: aufgespießte Gestalten, Stufe III eine Wand voller
Schaukästen. **Zielgruppe ist neun bis neunundneunzig**, und das war für keine
der beiden Hälften richtig.

Der Kanon sagt es deutlicher, als eine Altersfreigabe es könnte. Regel 8:
**kein Blut, kein Sterben, kein Zynismus.** Und die Folge daraus, wörtlich:

> Ein erledigter Vorgang wird geschreddert. Wer ein Monster erledigt, sieht
> Aktenkonfetti. Das ist keine Weichzeichnung für Kinder, das ist die wörtliche
> Wahrheit dieser Welt. **Es stirbt nie jemand. Es wird abgeschlossen.**

Deshalb ist die Überarbeitung **keine Weichspülung, sondern eine Korrektur zum
Kanon hin**, und sie macht die Bilder eigenständiger. Monster werden nicht
getötet, sie werden **bearbeitet**:

| statt | jetzt |
|---|---|
| aufgespießt und aufgereiht | der Öffner schnippt ein Musterblatt heraus, der Rest platzt zu Konfetti |
| in zwei Hälften geschnitten | fällt zu einem ordentlichen Stapel zusammen, Aktendeckel obenauf |
| brennt bei lebendigem Leibe | ein heller Wusch, dann steht dort eine Säule aus Funken und Konfetti |
| eingefroren mitten im Schrei | eingefroren mitten im Widerspruch, Zeigefinger noch erhoben |
| zuckend vom Blitz getroffen | leuchtet einen Moment wie ein Röntgenbild und steht qualmend da |
| die Banderole brennt auf | das Siegel springt auf, die Mumie zerfällt erleichtert zu Konfetti |

Die Kaltverfügung ist das beste Beispiel dafür, dass der zahmere Einfall der
bessere ist: eine Gestalt, die **mitten im Widerspruch** eingefroren ist, den
Zeigefinger noch erhoben, ist komischer als eine, die schreit, und sie trifft
genau die Aktenbedeutung des Frostes. Eine Rückfrage hemmt die Frist.

Zwei Sperren stehen dafür in jedem der fünfundvierzig Prompts:

* **Der Ton im Prompt selbst:** `family friendly and warm in tone, comic rather
  than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops
  into a cheerful burst of paper confetti`.
* **Die Sperrliste:** `blood, gore, wounds, injury, impaled, skewered, pierced
  bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty`
  stehen vor allem anderen im `--no`.

## Die Eskalationsleiter

| Stufe | Was das Bild zeigt |
|---|---|
| **I** | Die Wirkung setzt ein. Ein Ziel, kleine Reichweite, erste Spur. |
| **II** | Volle Kraft. Das Ziel ist erledigt, die Umgebung merkt es. |
| **III** | Katastrophe. Ganze Kammer, absurdes Übermaß, der Kracher. |

Das ist der Sammelanreiz: die dritte Stufe ist ein eigener Fund, kein Rahmen um
dasselbe Bild.

## Der Axt-Fehler, und was daraus zu lernen ist

In der ersten Fassung stand `a titanic double headed axe caught mid swing`, und
Midjourney legte in jedem Lauf **den Stiel** durch den Aktenstapel statt des
Kopfes. Vier Ursachen, alle behoben:

1. **`double headed axe` ist zweideutig.** Der Fachbegriff für zwei Schneiden an
   einem Kopf ist *double bitted*. „Double headed" lädt zur Lesart „je ein Kopf
   an beiden Enden" ein, und dann liegt der Stiel zwangsläufig in der Mitte.
2. **`caught mid swing`** beschreibt einen Bogen, und das Modell legt die Axt
   diagonal durchs Bild.
3. **`as it cleaves`** hat die Axt als Ganzes zum Subjekt. Welcher Teil
   schneidet, stand nirgends.
4. **Der Verbleib des Stiels war nicht gesagt.**

Die Regel, die daraus folgt und für jedes Werkzeug gilt: **wo etwas trifft, muss
dastehen, welcher Teil trifft und wo der Rest bleibt.** Deshalb heißt es jetzt
`the broad curved cutting edge of a huge double bitted axe head` und
`the long haft sweeping up out of the top of the frame`. Aus demselben Grund
trägt der Stempel jetzt `with its broad inked face turned flat downward`.

## Vier Hinweise

**Deine Referenzbilder als `--sref`.** Das ist der stärkste Hebel überhaupt und
schlägt jede Textbeschreibung. Die Bilder irgendwo hochladen, die URL an jeden
Prompt hängen: `--sref <url1> <url2>`. Dann sitzt die Serie.

**Kein Rahmen im Bild.** Im `--no` stehen `frame, border, ui, hud`. Die Karte
bringt ihren Rahmen selbst mit, ein zweiter im Bild wäre ein Rahmen im Rahmen.

**`watermark, logo, signature` stehen im `--no`**, weil zwei der Referenzbilder
Wasserzeichen tragen. Wer sie als `--sref` verwendet, bekommt sonst
wasserzeichenartige Flecken mitgeliefert.

**Der Regler ist `--s 250`.** Kommt es zu weich oder zu gemalt heraus, `--style
raw` anhängen und auf `--s 100` senken. Kommt es zu flach und leblos heraus,
`--s` weiter hoch. Bei der alten Amiga-Formel stand er auf 25, das war für
gedeckte Flachheit richtig und ist es hier nicht mehr.

---

## 1. Stichprobe · Dolchschaden
*Wirkungsszene.*

### 1.1 Stufe I

Der Öffner **schnippt einem Sandskorpion ein Blatt heraus**, mitten im Sprung. Der Skorpion löst sich schon in Konfetti auf, das Musterblatt segelt davon.

```
a big glowing brass letter opener flicking a single sheet of paper out of a startled sand scorpion in mid leap, the scorpion already dissolving into a bright puff of paper confetti, the sample sheet spinning away through the air, dark cave lit by the blade, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 1.2 Stufe II

**Drei Schattenlinge** verlieren im selben Wisch je ein Blatt und **platzen gleichzeitig zu Konfetti**. Drei Musterblätter steigen auf.

```
three shadow imps each losing one sheet of paper to the same sweep of a glowing brass letter opener, all three popping into bright bursts of paper confetti at once, the three sample sheets fluttering upward, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 1.3 Stufe III

Ein **Konfettisturm im ganzen Archiv**: Dutzende Gestalten lösen sich auf einmal auf, und aus dem Wirbel legt sich ein tadellos geordneter Musterstapel.

```
a whole archive room full of shadow creatures dissolving into a joyful blizzard of paper confetti at the same moment, a storm of sample sheets whirling up out of the cloud and settling into one immaculate neat stack, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 2. Klingenzulage · Schwertschaden
*Wirkungsszene.*

### 2.1 Stufe I

Einem **Knochenritter** schlägt die Klinge die Vorschriftenrolle aus der Hand. Erster Funke, er sieht ihr nach.

```
a glowing official sword striking a rulebook scroll out of a skeleton knight's gauntlet in a burst of sparks, the skeleton turning its skull to look after it, torchlit stone hall, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 2.2 Stufe II

Ein Hieb, und der Knochenritter **fällt zu einem ordentlichen Stapel zusammen**, obenauf ein Aktendeckel, dazu eine Konfettiwolke.

```
one stroke of the glowing sword and a skeleton knight folds neatly down into a tidy stack of bones with a file cover landing on top, a bright cloud of paper confetti puffing up around it, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 2.3 Stufe III

Eine **Reihe Knochenritter** klappt der Reihe nach zu sauberen Stapeln zusammen, eine Konfettiwelle rollt durch die ganze Halle.

```
a whole row of skeleton knights collapsing one after another into neat tidy stacks, a rolling wave of paper confetti sweeping down the entire hall, the blade still glowing at the end of its arc, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 3. Pauschalabfertigung · Axtschaden
*Wirkungsszene.*

### 3.1 Stufe I

Die Axt hackt einem **Wandelnden Ablagestapel** die oberste Lage ab. Blätter stieben, der Rest wankt weiter.

```
the broad curved cutting edge of a huge double bitted axe head shearing the top layer off a walking stack of files, loose sheets bursting upward, the paper creature wobbling comically onward, the long haft sweeping up out of the top of the frame, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 3.2 Stufe II

Derselbe Stapel mittig gespalten, beide Hälften kippen wie Klappstühle auseinander, ein Aktendeckel dreht sich in der Luft.

```
a walking stack of files split neatly down the middle by the axe blade, both halves flopping apart like folding chairs, a file cover spinning through the air, a puff of paper confetti rising from the split, the haft rising clear above, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 3.3 Stufe III

**Ein Dutzend Ablagestapel in einem Hieb**, eine Schneise quer durch die Registratur, Papierschnee bis unter die Decke.

```
a dozen walking file creatures toppling in one single sweep of a glowing double bitted axe blade, a cleared lane driven straight through a vast archive, cheerful paper snow filling the air to the ceiling, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 4. Brandschutzausnahme · Feuerzauber
*Wirkungsszene.*

### 4.1 Stufe I

Einem **Wandelnden Ablagestapel** glimmt die oberste Seite an. Er fächelt erschrocken mit einem Papierarm.

```
the topmost page of a walking stack of files glowing and curling with a small flame, the paper creature fanning at it in surprise with one paper arm, a thin spiral of embers rising, warm orange light, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 4.2 Stufe II

**Ein heller Wusch**, und der Stapel ist weg: eine Säule aus Funken und Konfetti steht, wo er stand.

```
one bright whoosh of flame and the walking file creature is gone, a tall column of sparks and paper confetti standing where it stood, embers streaming upward into the dark, the whole frame lit orange and gold, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 4.3 Stufe III

Die **ganze Registratur geht hoch**, überall Funkensäulen und Konfettiwirbel, und mittendrin ein Siegel, das nicht brennt.

```
an entire archive hall going up at once in a joyful roar of burning paper, columns of sparks and swirling confetti down both aisles, and one dark wax seal in the centre foreground that will not burn, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 5. Kaltverfügung · Frostzauber
*Wirkungsszene.*

### 5.1 Stufe I

Einer **Grünhaut** kriecht der Frost vom gestempelten Blatt aus das Bein hoch. Sie sieht empört hinunter.

```
frost creeping up a green skinned goblin's leg from a glowing stamped document at its feet, the goblin looking down at its own freezing shin with an indignant expression, pale blue light in a dark chamber, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 5.2 Stufe II

Dieselbe steht im **Eisblock, mitten im Widerspruch**, der Zeigefinger noch erhoben.

```
the same green skinned goblin standing frozen inside a block of clear blue ice, caught mid objection with one index finger still raised, cracks of light running through the ice, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 5.3 Stufe III

Eine **ganze Kammer eingefroren**, ein Dutzend Gestalten mitten in der Geste, wie eine Registratur, die man beim Satz unterbrochen hat.

```
an entire vaulted chamber frozen over, a dozen figures held mid gesture inside the ice like a filing room interrupted in mid sentence, a glacier bursting down through the ceiling, shafts of cold blue light, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 6. Blitzbeschluss · Arkanzauber
*Wirkungsszene.*

### 6.1 Stufe I

Ein Blitz trifft einen **Knochenritter**, für einen Moment leuchtet er wie ein Röntgenbild und steht qualmend da.

```
a bolt of violet lightning striking a skeleton knight, its bones lighting up bright white like a comic x ray flash for one instant, the figure standing there politely smoking, first flakes of paper confetti appearing, arcs crawling across the flagstones, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 6.2 Stufe II

Der Blitz **springt weiter**, drei Skelette leuchten wie Lampen, Konfetti beginnt zu rieseln.

```
the violet bolt leaping onward through three skeletons in a chain, all three glowing from inside like lamps, white arcs jumping between them, paper confetti beginning to drift down, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 6.3 Stufe III

Die Kette springt durch die **ganze Halle**, ein Dutzend Gestalten leuchtet gleichzeitig auf, dann steht der Raum voll Konfetti.

```
the lightning chain leaping through an entire hall, a dozen figures lighting up from within at the same instant, the whole vault caught in one violet flash and filling with drifting paper confetti, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 7. Vollzugszulage · mehr Schaden
*Wirkungsszene.*

### 7.1 Stufe I

Der Stempel kommt herunter, eine **Grünhaut** sieht mit mildem Interesse hoch, der Schatten liegt schon auf ihr.

```
a titanic wooden office stamp plunging down with its broad inked face turned flat downward, a green skinned goblin below looking up at the descending shadow with mild interest, dust racing outward, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 7.2 Stufe II

Ein Abdruck im Boden, die Grünhaut ist **abgestempelt und erledigt**, aus dem Abdruck quillt Konfetti.

```
a deep stamped impression pressed into the stone floor where the goblin stood, a bright column of paper confetti welling up out of the imprint, the giant stamp lifting away above, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 7.3 Stufe III

Ein **Feld aus Abdrücken** quer durch die Kammer, aus jedem steigt eine Konfettiwolke.

```
a field of stamped impressions punched across an entire chamber, a cloud of glowing paper confetti rising from every single one, the giant stamp already lifting for the next, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 8. Härtefallregelung · weniger Schaden nehmen
*Wirkungsszene.*

### 8.1 Stufe I

Ein **Waldschamane** schleudert eine Verfügung, sie zerschellt am Klemmbrett-Schild.

```
a forest shaman hurling a glowing green decree that shatters into harmless sparks against a huge iron bound clipboard shield planted in the earth, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 8.2 Stufe II

**Drei Waldschamanen**, ein Sperrfeuer, alles prallt ab, der Schild steht unbewegt.

```
three forest shamans laying down a barrage of glowing decrees, every one of them shattering harmlessly against the unmoved clipboard shield, sparks filling the air, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 8.3 Stufe III

Eine **Belagerung**: Geschosse aus allen Richtungen, der Schild in der Mitte, ein Ring zerbrochener Federn am Boden.

```
a full siege, glowing projectiles converging from every direction onto a single clipboard shield at the centre of the frame, a thick ring of broken quills piled at its foot, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 9. Prüfvermerk · kritische Treffer
*Wirkungsszene.*

### 9.1 Stufe I

Die Lupe findet an einer **Mumie** das Siegel der Banderole. Ein heller Punkt, sonst nichts.

```
a brass magnifying glass focusing one bright pinpoint of light onto the wax seal on a mummy's wrapping, the seal beginning to glow at that single spot, dark tomb behind, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 9.2 Stufe II

Das **Siegel springt auf**, die Banderole rollt sich als langes Schriftband ab, die Mumie zerfällt erleichtert zu Konfetti.

```
the wax seal popping open with a bright flash, the wrapping unrolling into one long ribbon of paperwork, the mummy dissolving into paper confetti with an air of relief, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 9.3 Stufe III

Ein **Dutzend Mumien**, alle Siegel springen im selben Moment auf, überall entrollen sich Schriftbänder.

```
a dozen mummies standing in a tomb, every wax seal popping open in the same instant, long ribbons of paperwork unrolling everywhere, clouds of confetti rising between them, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 10. Eilverfahren · Angriffstempo
*Wirkungsszene.*

### 10.1 Stufe I

Eine **Grünhaut** holt aus, ist aber schon von Nachbildern umgeben. Der Schlag war vorher da.

```
a green skinned goblin winding up to strike but already ringed by glowing after images of a blow that landed before it began, motion streaks curving through the air, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 10.2 Stufe II

Drei Gegner, alle mitten in der Bewegung angehalten, eine **Spur von Nachbildern** zieht durch sie hindurch, Konfetti setzt ein.

```
three enemies held frozen mid motion while a blazing streak of after images tears straight through all of them, bright paper confetti already bursting from each one, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 10.3 Stufe III

Eine **ganze Kammer steht still**, Staub hängt in der Luft, eine einzige Spur hat alles erledigt, überall fällt Konfetti.

```
an entire chamber standing still with dust hanging in the air, one single blazing motion trail having finished every enemy in it, paper confetti caught falling everywhere, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 11. Erschwerniszulage · mehr Leben
*Gegenstandsszene.*

### 11.1 Stufe I

Der Helm freigestellt, eine Delle glüht noch, ein Pfeil prallt in Funken ab.

```
a battered official issue steel helmet, one fresh dent still glowing hot, a single arrow ricocheting off it in a spray of sparks, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

### 11.2 Stufe II

Derselbe zernarbt, ein **Funkensturm** aus einem Dutzend Treffern, die Dellen glühen weiß.

```
the same helmet heavily scarred and ringed by a storm of sparks from a dozen simultaneous impacts, dents glowing white, bolts shattering against it, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

### 11.3 Stufe III

Derselbe **massiv und vergoldet**, Panzerplatten und Nieten, ein Hof aus zersplitterten Pfeilspitzen kreist um ihn.

```
the same helmet grown massive and gilded with reinforcement plates and rivets, blazing with rim light, a slow halo of shattered arrowheads orbiting it, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

## 12. Gebührenbefreiung · weniger Manakosten
*Gegenstandsszene.*

### 12.1 Stufe I

Ein Beleg mit gesprungenem Schloss, ein **Rinnsal Gold** läuft heraus.

```
a rolled paper receipt with a cracked iron padlock hanging from it, a thin trickle of golden light escaping through the crack, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

### 12.2 Stufe II

Der Beleg entrollt, aus dem Rinnsal wird ein **Strom**, das Schloss zerplatzt in der Luft.

```
the receipt unrolled and streaming, the trickle swollen into a bright torrent of golden light, the padlock bursting apart mid air, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

### 12.3 Stufe III

Ein **riesiger Beleg in Blattgold**, ein Geysir aus Licht bricht heraus, das Schloss zerfliegt in glühenden Splittern.

```
a colossal ornate receipt bound in gold leaf and wax seals, a blazing geyser of golden light erupting from it, the shattered padlock exploding outward in glowing fragments, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

## 13. Dienstweg · Lauftempo
*Gegenstandsszene.*

### 13.1 Stufe I

Ein Stiefelpaar freigestellt, Staub kringelt an den Sohlen, feine Tempolinien.

```
a pair of worn leather courier boots, dust curling from the soles, faint speed lines trailing behind them, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

### 13.2 Stufe II

Dieselben mit **leuchtenden Schlieren**, Bewegungslinien peitschen vorbei, das Leder raucht.

```
the same boots trailing bright glowing streaks, motion lines whipping past, the leather scuffed and steaming, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

### 13.3 Stufe III

Dieselben **mit Messingflügeln und Runen**, in Tempolicht gehüllt, Funken sprühen aus den Absätzen.

```
the same boots grown ornate with winged brass fittings and glowing runes, wreathed in blazing streaks of speed light, sparks pouring from the heels, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

## 14. Laufender Bezug · Manaregeneration
*Gegenstandsszene.*

### 14.1 Stufe I

Der Becher freigestellt, Dampf, ein einzelner blauer Lichtfaden steigt auf.

```
a chipped enamel office mug, steam rising from it, a single thread of glowing blue light climbing out of the steam, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

### 14.2 Stufe II

Derselbe mit **Dampfsäulen**, blaue Helligkeit läuft über den Rand.

```
the same mug with thick columns of glowing steam pouring upward, blue radiance spilling over its rim, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

### 14.3 Stufe III

Derselbe **mit Goldrand und Edelsteinen**, ein blauer Dampfgeysir bricht heraus, ein Lichthof um die Tasse.

```
the same mug grown ornate with a gold rim and inlaid gems, a blazing blue geyser of steam erupting from it, a halo of light around the cup, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

## 15. Dienstalterszulage · mehr Erfahrung
*Gegenstandsszene.*

### 15.1 Stufe I

Das Dienstbuch aufgeschlagen, wenige Stempel glimmen auf der Seite.

```
a service record book lying open, a few round stamp impressions glowing faintly on the page, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

### 15.2 Stufe II

Dasselbe deutlich dicker, die Seiten **blättern von selbst**, Gold bricht dazwischen hervor.

```
the same book much thicker, its pages turning by themselves, bright golden light breaking out from between the leaves, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

### 15.3 Stufe III

Dasselbe **riesig in vergoldetem Leder**, Seiten reißen sich los, die Stempel **glühen wie Sternbilder**.

```
the same book grown colossal and bound in gilded leather, pages tearing loose in a storm of light, the round stamp impressions blazing like constellations, family friendly and warm in tone, comic rather than cruel, nobody is hurt and nothing bleeds, a defeated creature simply pops into a cheerful burst of paper confetti, the object floating centred and isolated on a deep smooth vignette gradient background, nothing else in frame, hero item showcase, glinting sparkles in the air around it, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, bold dark outlines, clean readable shapes, dithering in the gradients, epic fantasy trading card item art, perfectly centred iconic composition --ar 4:3 --s 250 --no blood, gore, wounds, injury, impaled, skewered, pierced bodies, corpses, death, suffering, pain, fear, horror, grimdark, cruelty, text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters, landscape, scenery, room, interior, architecture, horizon
```

---

## Wenn die Bilder da sind

Der Katalog trägt heute `icon:'🔪'`. Dazu kommt ein Feld mit einem Pfad je
Stufe:

```js
bild:['assets/zulagen/stichprobe-1.png',
      'assets/zulagen/stichprobe-2.png',
      'assets/zulagen/stichprobe-3.png'],
```

Mehr ist nicht zu tun. `zulageKarteHTML()` liest von dort, das Fenster steht auf
`object-fit:cover` und `image-rendering:pixelated`, ein Bild im Verhältnis vier
zu drei sitzt passgenau. Lücken sind erlaubt und fallen aufs Sinnbild zurück,
die fünfundvierzig müssen also nicht auf einmal fertig sein.

**Vorschlag zur Reihenfolge: erst die fünfzehn Stufe-III-Bilder.** Die verkaufen
die Sammlung, und an ihnen zeigt sich am schnellsten, ob Stil und Wucht sitzen.

`zulagenAssert()` prüft die Form des Feldes, nicht die Existenz der Dateien. Wer
die fünfundvierzig einträgt, sollte einmal mit offener Konsole durch die Kartei
blättern.
