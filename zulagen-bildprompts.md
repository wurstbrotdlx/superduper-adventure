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

Ein **Sandskorpion** mitten im Zustoßen, im Flug an ein Blatt geheftet wie ein Insekt in einer Sammlung.

```
a giant glowing brass letter opener pinning a leaping sand scorpion in mid air against a sheet of parchment like a specimen in a collection, the blade driven clean through, paper confetti beginning to burst from the wound, dark cave wall behind lit only by the blade, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 1.2 Stufe II

**Drei Schattenlinge** an dieselbe Wand geheftet, jeder mit eigenem Blatt und eigenem Öffner.

```
three shadow imps pinned side by side to a stone wall, each impaled on its own glowing brass letter opener through its own sheet of parchment, a neat row, paper confetti drifting from the oldest one, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 1.3 Stufe III

Eine **Wand wie ein Insektenkasten**: Dutzende aufgespießte Gestalten in Reih und Glied, Konfetti rieselt aus den älteren Fächern.

```
a towering wall of specimen cases filled with dozens of impaled shadow creatures in neat rows, each pinned by a glowing brass letter opener through a document, paper confetti raining from the upper rows, an archive turned into an insect collection, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 2. Klingenzulage · Schwertschaden
*Wirkungsszene.*

### 2.1 Stufe I

Einem **Knochenritter** schlägt die Klinge die Vorschriftenrolle aus der Hand. Erster Funke, er sieht ihr nach.

```
a glowing official sword striking a rulebook scroll out of a skeleton knight's gauntlet in a burst of sparks, the skeleton turning its skull to look after it, torchlit stone hall, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 2.2 Stufe II

Derselbe fällt in zwei saubere Hälften, dazwischen der Schnitt und ein Aktendeckel. Konfetti quillt aus der Naht.

```
a skeleton knight falling apart in two clean halves along one diagonal cut, a file folder split with him, paper confetti bursting from the seam, the blade still glowing at the end of its arc, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 2.3 Stufe III

Eine **Reihe Knochenritter**, alle im selben Hieb zerteilt, der Schnitt läuft durch die Halle und teilt hinten eine Säule.

```
a row of skeleton knights all cut through by one single sweeping stroke, the cut carrying on across the whole hall and splitting a stone pillar at the back, a curtain of paper confetti falling through the light, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 3. Pauschalabfertigung · Axtschaden
*Wirkungsszene.*

### 3.1 Stufe I

Die Axt hackt einem **Wandelnden Ablagestapel** die oberste Lage ab. Blätter stieben, der Rest wankt weiter.

```
the broad curved cutting edge of a huge double bitted axe head shearing the top layer off a walking stack of files, loose sheets bursting upward, the creature staggering on, the long haft sweeping up out of the top of the frame, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 3.2 Stufe II

Derselbe Stapel mittig gespalten, beide Hälften kippen auseinander, ein Aktendeckel dreht sich in der Luft.

```
a walking stack of files split down the middle by the axe blade, both halves toppling apart, a file cover spinning through the air, paper confetti pouring from the split, the haft rising clear above the wreckage, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 3.3 Stufe III

**Ein Dutzend Ablagestapel in einem Hieb**, eine Schneise quer durch die Registratur, Papierschnee bis unter die Decke.

```
a dozen walking file creatures cut down by one single sweep of a glowing double bitted axe blade, a cleared lane driven straight through a vast archive, paper snow filling the air to the ceiling, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 4. Brandschutzausnahme · Feuerzauber
*Wirkungsszene.*

### 4.1 Stufe I

Ein **Wandelnder Ablagestapel** fängt an einer Ecke Feuer und versucht, es auszuschlagen.

```
a walking stack of files catching fire at one corner, beating at the flames with a paper arm, orange firelight throwing its shadow across the archive floor, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 4.2 Stufe II

Derselbe in Vollbrand, die Gestalt noch erkennbar, Funken steigen in die Dunkelheit.

```
the same walking file creature fully ablaze, its shape still readable inside the roaring fire, embers streaming up into the dark, the whole frame lit orange and gold, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 4.3 Stufe III

Die **ganze Registratur brennt**, ein Dutzend Aktengestalten als Fackeln, und mittendrin ein Siegel, das nicht brennt.

```
an entire archive hall burning, a dozen file creatures standing as living torches down both aisles, and in the centre foreground one dark wax seal that will not burn, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 5. Kaltverfügung · Frostzauber
*Wirkungsszene.*

### 5.1 Stufe I

Einer **Grünhaut** kriecht der Frost vom gestempelten Blatt aus das Bein hoch. Sie sieht hinunter.

```
frost creeping up a green skinned goblin's leg from a glowing stamped document lying at its feet, the goblin looking down at its own freezing shin, pale blue light against a dark chamber, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 5.2 Stufe II

Dieselbe steht als **Eisblock**, mitten im Schrei, die Faust noch erhoben.

```
the same green skinned goblin frozen solid inside a block of clear blue ice, caught mid scream with one fist still raised, cracks of light running through the ice, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 5.3 Stufe III

Eine **ganze Kammer erstarrt**, ein Dutzend Gestalten mitten in der Bewegung, ein Gletscher bricht durch die Decke.

```
an entire vaulted chamber frozen over, a dozen figures locked mid motion inside the ice, a glacier bursting down through the ceiling, shafts of cold blue light, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 6. Blitzbeschluss · Arkanzauber
*Wirkungsszene.*

### 6.1 Stufe I

Ein **Knochenritter** zuckt, der Blitz fährt ihm durch den Helm, der Rippenbogen leuchtet von innen durch.

```
a bolt of violet lightning punching down through a skeleton knight's helmet, its ribcage lit blazing white from within, the figure convulsing, arcs crawling across the flagstones, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 6.2 Stufe II

Der Blitz **springt weiter**, drei Skelette in der Kette, alle drei durchleuchtet.

```
the violet bolt leaping onward through three skeletons in a chain, all three lit from inside at once, white arcs jumping between their bones, the hall strobing, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 6.3 Stufe III

Die Kette springt durch die **ganze Halle**, ein Dutzend Gestalten gleichzeitig durchleuchtet, das Gewölbe steht im Blitzlicht.

```
the lightning chain leaping through an entire hall, a dozen figures lit from within simultaneously, the whole vault caught in one violent violet flash, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 7. Vollzugszulage · mehr Schaden
*Wirkungsszene.*

### 7.1 Stufe I

Der Stempel kommt herunter, eine **Grünhaut** sieht hoch, der Schatten liegt schon auf ihr.

```
a titanic wooden office stamp plunging down with its broad inked face turned flat downward, a green skinned goblin below looking up as the shadow already covers it, dust racing outward, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 7.2 Stufe II

Der Abdruck im Boden, die Grünhaut ist weg, aus dem Abdruck **quillt Konfetti**.

```
a deep stamped impression pressed into the stone floor where the goblin stood, paper confetti welling up out of the imprint in a bright column, the stamp lifting away above, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 7.3 Stufe III

Ein **Feld aus Abdrücken** quer durch die Kammer, aus jedem steigt eine Konfettiwolke.

```
a field of stamped impressions punched across an entire chamber, a cloud of glowing confetti rising from every one of them, the giant stamp already lifting for the next, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 8. Härtefallregelung · weniger Schaden nehmen
*Wirkungsszene.*

### 8.1 Stufe I

Ein **Waldschamane** schleudert eine Verfügung, sie zerschellt am Klemmbrett-Schild.

```
a forest shaman hurling a glowing green decree that shatters into sparks against a huge iron bound clipboard shield planted in the earth, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 8.2 Stufe II

**Drei Waldschamanen**, ein Sperrfeuer, alles prallt ab, der Schild steht unbewegt.

```
three forest shamans laying down a barrage of glowing decrees, every one of them shattering against the unmoved clipboard shield, sparks filling the air, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 8.3 Stufe III

Eine **Belagerung**: Geschosse aus allen Richtungen, der Schild in der Mitte, ein Ring zerbrochener Federn am Boden.

```
a full siege, glowing projectiles converging from every direction onto a single clipboard shield at the centre of the frame, a thick ring of broken quills piled at its foot, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 9. Prüfvermerk · kritische Treffer
*Wirkungsszene.*

### 9.1 Stufe I

Die Lupe findet an einer **Mumie** die Naht der Banderole. Ein heller Punkt, sonst nichts.

```
a brass magnifying glass focusing one blinding pinpoint of light onto the seam of a mummy's wrapping, the linen beginning to smoke at that single spot, dark tomb behind, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 9.2 Stufe II

Der Brennpunkt zündet die Naht, das **Siegel platzt**, die Banderole löst sich in Konfetti auf.

```
the focused pinpoint igniting the seam, the wax seal bursting apart, the wrapping unravelling into a spray of paper confetti, the mummy staggering, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 9.3 Stufe III

Ein **Dutzend Mumien**, jede mit einem glühenden Punkt an derselben Stelle, alle Siegel platzen gleichzeitig.

```
a dozen mummies standing in a tomb, each with a glowing pinpoint burning at exactly the same spot on its wrapping, every wax seal bursting in the same instant, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 10. Eilverfahren · Angriffstempo
*Wirkungsszene.*

### 10.1 Stufe I

Eine **Grünhaut** holt aus, ist aber schon von Nachbildern umgeben. Der Schlag war vorher da.

```
a green skinned goblin winding up to strike but already ringed by glowing after images of a blow that landed before it began, motion streaks curving through the air, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 10.2 Stufe II

Drei Gegner, alle mitten in der Bewegung angehalten, eine **Spur von Nachbildern** zieht durch sie hindurch.

```
three enemies held frozen mid motion while a blazing streak of after images tears straight through all of them, confetti starting to burst from each, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

### 10.3 Stufe III

Eine **ganze Kammer steht still**, Staub hängt in der Luft, eine einzige Spur hat alle erledigt, überall fällt Konfetti.

```
an entire chamber standing still with dust hanging in the air, one single blazing motion trail having finished every enemy in it, confetti caught falling everywhere, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render
```

## 11. Erschwerniszulage · mehr Leben
*Gegenstandsszene.*

### 11.1 Stufe I

Der Helm auf einem Pfosten, eine Delle frisch, ein Pfeil prallt gerade ab.

```
a battered official issue helmet set on a wooden post, one fresh dent glowing hot, an arrow glancing off it in a spray of sparks, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

### 11.2 Stufe II

Derselbe unter einem **Hagel von Geschossen**, Funken überall, vollkommen unbewegt.

```
the same helmet under a hail of arrows and bolts, sparks bursting all over it, completely unmoved, the light of the impacts filling the frame, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

### 11.3 Stufe III

Der Helm in einem **Trümmerfeld**, ein Ring zerbrochener Waffen um ihn, und nur Kratzer.

```
the helmet standing alone in a field of rubble, a wide ring of shattered weapons heaped around it, dawn light behind, and only scratches on the steel, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

## 12. Gebührenbefreiung · weniger Manakosten
*Gegenstandsszene.*

### 12.1 Stufe I

Ein Beleg mit gesprungenem Vorhängeschloss, ein **Rinnsal Licht** läuft daraus hervor.

```
a paper receipt with a cracked padlock hanging from it, a thin trickle of golden light running out through the crack, dark vault behind, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

### 12.2 Stufe II

Der Beleg rollt sich aus, aus dem Rinnsal wird ein **Strom**, das Schloss fällt.

```
the receipt unrolling downward, the trickle swelling into a bright stream of golden light, the broken padlock falling away through the air, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

### 12.3 Stufe III

Ein **Wasserfall aus Belegen** stürzt in ein Tresorgewölbe, Licht durch das fallende Papier.

```
a waterfall of receipts pouring down out of the darkness into a vast treasury vault, blazing golden light shining through the falling paper, the burst padlock suspended in the spray, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

## 13. Dienstweg · Lauftempo
*Gegenstandsszene.*

### 13.1 Stufe I

Ein Stiefelpaar auf einem Feldweg, Staubfahne, das Dorf klein dahinter.

```
a pair of worn courier boots striding along a country path, a plume of dust kicked up behind them, a small village far back in the evening light, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

### 13.2 Stufe II

Dieselben **über einem Tal**, die Straße als Papierband darunter.

```
the same boots striding over an entire valley, each boot larger than the hills, a ribbon of paper running beneath them as a road, dust trailing, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

### 13.3 Stufe III

Die Stiefel **schreiten über ein Gebirge**, die Papierstraße spannt sich von Horizont zu Horizont.

```
colossal courier boots striding across a mountain range at dawn, the paper road stretching from horizon to horizon below them, clouds around their ankles, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

## 14. Laufender Bezug · Manaregeneration
*Gegenstandsszene.*

### 14.1 Stufe I

Der Becher auf einem Schreibtisch, Dampf, ein einzelner Lichtfaden steigt auf.

```
a chipped enamel office mug standing on a dark desk, steam rising from it, a single thread of glowing blue light climbing out of the steam, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

### 14.2 Stufe II

Der Becher auf einem **Sockel**, Dampfsäulen, Lichtschächte von oben.

```
the same mug raised on a stone plinth, thick columns of steam rising into shafts of light falling from above, blue glow pooling around its base, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

### 14.3 Stufe III

Der Becher auf einem **Altar am Ende einer Kathedrale**, Dampf füllt das Gewölbe, Papieropfer am Fuß.

```
the mug enshrined on an altar at the end of a vast cathedral, steam filling the whole vault, blazing blue light pouring from the cup, drifts of offered paperwork heaped at the foot of the altar, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

## 15. Dienstalterszulage · mehr Erfahrung
*Gegenstandsszene.*

### 15.1 Stufe I

Das Dienstbuch aufgeschlagen, wenige Stempel, ein Schimmer zwischen den Seiten.

```
a service record book lying open on a desk, a few round stamp impressions on the page, a faint golden shimmer between the leaves, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

### 15.2 Stufe II

Das Buch dicker, die Seiten **blättern von selbst**, Licht bricht hervor.

```
the same book much thicker, its pages turning by themselves in a rising wind, bright golden light breaking out from between them, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
```

### 15.3 Stufe III

Das Buch riesig auf einem Sockel, Seiten fliegen, die Stempel **glühen wie Sternbilder**.

```
a colossal service record book open on a stone plinth, pages flying loose in a storm of light, the round stamp impressions glowing like constellations, the radiance filling an entire hall, detailed modern pixel art, high resolution sprite work with crisp hard pixels, vibrant saturated colours, strong rim light and inner glow, bloom around every light source, deep contrast between dark silhouettes and a blazing background, bold dark outlines, clean readable shapes, dithering in the gradients, dramatic cinematic lighting, epic fantasy trading card illustration, centred iconic composition, awe and grandeur --ar 4:3 --s 250 --no text, lettering, writing, letters, numbers, watermark, logo, signature, frame, border, ui, hud, blur, smooth airbrush, painterly brushwork, photorealism, 3d render, people, faces, characters
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
