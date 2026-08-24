# Bekommt die Aschewüste ein eigenes Wüstenset? — 24.08.2026

`phase-g12-steinbruch-rest.md` hat die Frage gestellt und ausdrücklich nicht
beantwortet:

> **Die Wüste bleibt unangetastet.** `Cute_Fantasy_Desert` steht seit G11 im
> Manifest und ist weiter unbenutzt. Ob die Aschewüste ein eigenes Set bekommt,
> ist eine Frage an die Weltbibel und nicht an die Dateien.

`WELT-ERWEITERUNG-2026-08-24.md` hat sie in Abschnitt 5 aufgegriffen und die
billigste Verwendung vorgeschlagen:

> Die Aschewüste bezieht ihren Boden heute aus `Cute_Fantasy_Volcano`. Ein
> echtes Wüstenset wäre ein reiner Austausch ohne neue Mechanik — das ist die
> billigste Verwendung und die einzige, die keine Weltfrage stellt.

Hier ist die Antwort. Sie lautet **nein**, aus drei Gründen, die unabhängig
voneinander tragen. Der dritte hat die Frage nebenbei umgedreht: der
vorgeschlagene Austausch ist nicht die Verwendung ohne Weltfrage, sondern die
einzige, die gar nicht geht.

Wie jeder datierte Bericht in diesem Repo ist das ein **Stand, kein
Wegweiser**. Nichts davon ist gebaut, und der einzige Eingriff, den er empfiehlt,
ist keiner.

---

## Kurz vorweg

| Vorschlag | Befund |
|---|---|
| **Boden austauschen** | Geht nicht wie gedacht. Von den 15 Tile-Blättern des Packs ist keines eine Bodenfläche; die einzige flache Füllkachel im ganzen Satz trägt **exakt die Farbe des Dorfwegs**. |
| **Die Mumie als Witz, den die Welt trägt** | Der Witz ist seit Phase 2 erzählt, und zwar ein Band weiter oben. Die Mumie heißt **Die versiegelte Akte** und steht im Ruinenband. |
| **Skarabäen** | Stehen seit M1 in der Aschewüste, als häufigster Gegner ihres Bandes. |
| **Pharao, Kamele, Geier, Wüstenhäuser, Händler** | Setzen ein bewohntes Wüstenvolk voraus. Der Brandabschnitt ist eine Brandstelle in Bereich VII, kein Land mit Leuten. |
| **Die toten Requisiten** | Die naheliegendste Verwendung, und die einzige, die überhaupt zur Debatte steht — aber ihre Sprache ist *trocken*, nicht *verbrannt*. |

---

## 1. Die Weltbibel: die Aschewüste ist keine Wüste

Das ist der Grund, der alle anderen überflüssig macht. Was auf der Karte als
Wüste liegt, ist keine:

> | Aschewüste | Der Brandabschnitt | Hier hat es gebrannt. Amtlich:
> ordnungsgemäße Aktenvernichtung. Inoffiziell: es hat sehr genau das gebrannt,
> was jemand nicht mehr sehen wollte. |

`weltgeschichte.md` datiert es und macht daraus ein Ereignis mit Anfang und
Ende:

> **Jahr 985: Der Brandabschnitt.** Ein Sammelvorgang aus dem Jahr 612 verträgt
> keine Sonne. Was in der Aschewüste geschah, dauerte drei Tage, ist amtlich als
> **ordnungsgemäße Aktenvernichtung** erfasst und hat einem Landstrich seinen
> Namen gegeben.

Eine Wüste ist ein Klima. Ein Brandabschnitt ist ein **Vorgang**, der einen
Landstrich hinterlassen hat, und zwar vor einundvierzig Jahren. Der Boden dort
ist nicht sandig, weil es dort selten regnet — er ist schwarz, weil dort etwas
gebrannt hat.

Damit ist der heutige Zustand kein Notbehelf, für den man sich entschuldigt:
`Cute_Fantasy_Volcano` liefert verbrannten Fels, Risse und Glut. **Das ist das
richtige Material, und es liegt schon.** Goldene Dünen wären nicht eine
Verbesserung, sondern ein Widerspruch zum Namen des Ortes.

## 2. Der Witz ist schon erzählt, und er steht woanders

Die Welt-Erweiterung hat die Mumie als den einen Posten genannt, den die Welt
tragen würde:

> Der **Brandabschnitt** ist die Aktenvernichtung, und eine Mumie ist eine in
> Streifen gewickelte Akte, die nicht liegen bleiben wollte. Diesen Witz trägt
> die Welt.

Sie trägt ihn tatsächlich — sie trägt ihn seit Phase 2. Im Code steht:

```js
mummy: {name:'Mumie', art:'Die versiegelte Akte', ..., kat:{klasse:'A2', stufe:9, biom:'Ruine', ...}}
```

und dazu ihr Substantiv `Mumienbinde` im Rüstungs-Slot. Sie ist ein
ausgewachsener Katalogeintrag, kein Entwurf, und sie steht im **Ruinenband**,
nicht in der Wüste. Die Aktenbedeutung ist auch nicht „die Akte, die nicht
liegen bleiben wollte", sondern **Die versiegelte Akte** — enger, amtlicher und
besser.

Eine zweite Mumie im Sandband wäre keine Erweiterung, sondern eine Dopplung:
derselbe Witz, zweimal, in zwei Bändern, mit zwei Aktenbedeutungen. Die
M1-Kreuzungsregel („je Biom 3 bis 5 Gegner aus mindestens 3 Ertragsklassen")
stünde außerdem im Weg, und das Sandband ist mit vier Typen ohnehin voll.

Dasselbe gilt für den Skarabäus: `skarabaeus` mit dem `Panzerspan` ist seit M1
der **häufigste** Gegner der Aschewüste, mit Gewicht 5 von 11. Das Pack bringt
vier Skarabäenfarben mit, und im Spiel steht die Aktenbedeutung dazu bereits.
Ein Blattwechsel wäre ein Blattwechsel, kein Zuwachs.

## 3. Der Boden lässt sich gar nicht austauschen

Der Befund, der die Frage umdreht. Das Pack hat 92 Blätter, die sich so
aufteilen:

| Ordner | Blätter |
|---|---|
| `Props/` | 29 |
| `Houses/` | 17 |
| `Tiles/` | 15 |
| `Animals/` | 11 |
| `NPC/` | 9 |
| `Temple/` | 6 |
| `enemies/` | 5 |

Die fünfzehn unter `Tiles/` heißen: `Desert_Beach_Tiles_1` bis `_3`,
`Desert_Bridge`, `Desert_Cliff_Tiles_1` bis `_3`, `Desert_Cliff_Waterfall_1` bis
`_3`, `Desert_Grass`, `Desert_Water_Foam_Animation` und `Desert_Water_Tiles_1`
bis `_3`.

**Darunter ist keine Bodenfläche.** Es sind Übergänge: Sand an Wasser, Klippen,
Wasserfälle, Wasser, Gras. Genau das, was ein Wüstenset mitbringt, wenn es davon
ausgeht, dass die Fläche dazwischen anderswoher kommt.

Gezählt statt geschätzt: `Desert_Beach_Tiles_1` ist 80x48, also fünfzehn
Kacheln. Vierzehn davon tragen Wasser oder sind leer. **Genau eine** ist eine
flache Füllung. Ihre Farbe:

```
Desert_Beach_Tiles_1, Kachel (1,1)   rgb(228, 166, 114)
assets/cf/tiles/Path_Middle.png      rgb(228, 166, 114)
```

Dieselbe Farbe, Byte für Byte. Der einzige flächige Boden im ganzen Wüstenpack
ist der **Weg**, auf dem die Dorfbewohner laufen. Ein Austausch würde die
Aschewüste in der Farbe der Feldwege streichen — nicht ein neues Aussehen,
sondern eine Verwechslung. Die Wege sind auf dieser Karte 1253 Kacheln allein
im Weidegürtel (G11), sie sind das am häufigsten gesehene Element überhaupt.

Damit ist der „reine Austausch ohne neue Mechanik" nicht die billigste
Verwendung, sondern die einzige, die gar nicht zur Verfügung steht.

## 4. Die toten Requisiten: die naheliegende Verwendung, und warum sie auch nicht passt

Bleibt der Posten, der einer Brandstelle am nächsten kommt: `Dead_tree`,
`HalfDead_tree`, `Dead_bush`, `Desert_Fern_Dead`, `Desert_Bones`, `Fire_Pit`,
`Desert_Campfire`. Angesehen, nicht aus den Dateinamen geschlossen:

* **Die toten Bäume sind trocken, nicht verkohlt.** Braune, kahle Stämme mit
  hellem Holz. Ein Baum, der drei Tage lang gebrannt hat, ist schwarz. Das ließe
  sich einfärben — der Farbweg aus G8/G9 kann das —, aber dann ist es kein
  Blattwechsel mehr, sondern ein Bauabschnitt mit einer Farbentscheidung.
* **Die Knochen erzählen die falsche Geschichte.** `Desert_Bones` sind
  gebleichte Tierschädel und Hörner: das Vokabular einer Überlebenswüste, in der
  Vieh verdurstet. Im Brandabschnitt ist kein Vieh verdurstet, dort hat **Papier**
  gebrannt. Ein Ochsenschädel in der Aschewüste behauptet einen Tod, den diese
  Welt nicht kennt, und rührt außerdem an eine Frage, die die Weltbibel für
  Kinder ab 10 bewusst nicht stellt.
* **Die Feuerstellen brennen.** `Fire_Pit` und `Desert_Campfire` zeigen offene
  Flammen. Ein Lagerfeuer heißt: hier lagert jemand. In der Aschewüste lagert
  niemand, und das Feuer ist seit einundvierzig Jahren aus.

Es bleibt also nichts übrig, was ohne Farb- und Weltentscheidung hineinpasst.

## 5. Wovon die Weltbibel abrät, ohne dass man sie extra fragen muss

`Houses/` (17), `NPC/` (9, darunter `Pharaoh` und drei Händler), `Animals/` (11,
Kamele, Geier, Skarabäen), `Temple/` (6) und die fünf Wüstenkrieger setzen alle
dasselbe voraus: **ein bewohntes Land mit einer eigenen Kultur.**

Das Reich hat so etwas nicht. Der Brandabschnitt ist ein Landstrich **innerhalb
von Bereich VII**, vier Bänder vom Dorf entfernt, und was jenseits davon liegt,
regelt die Weltbibel abschließend:

> **Bereiche I bis VI.** Sie gelten als abgeschlossen. Mehr wird nicht gesagt.
> Das ist Material für ein zweites Spiel und wäre als Nebensatz verschenkt.

Ein Pharao mit Tempel und Händlern wäre genau der Nebensatz, vor dem dieser
Absatz warnt — ein zweites Volk mit eigener Bauweise, eingeführt als Deko am
Rand einer Karte, deren Erzählung von einer einzigen verstopften Röhre und einem
nie geschlossenen Vorgang handelt.

---

## Empfehlung

**`Cute_Fantasy_Desert` bleibt liegen, und zwar nicht vertagt, sondern
gestrichen** — wie die Brücken in G12 und aus derselben Art von Grund: nicht
weil die Zeit fehlt, sondern weil die Messung dagegen steht.

Der Bestand (`GRAFIK-BESTAND-2026-08-21.md`) bekommt damit eine Zeile weniger,
und `WELT-ERWEITERUNG-2026-08-24.md`, Abschnitt 5, ist beantwortet.

**Wenn die Aschewüste je mehr bekommen soll**, dann aus dem, was dort wirklich
gebrannt hat, und aus Packs, die schon geladen sind:

1. **Aktenkonfetti als Bodenstreu.** Das Wort steht im Namensregister
   („Aktenkonfetti | Konfetti | geschredderte Akte"), der Effekt ist seit
   `splatConfetti()` im Spiel, und verwehte Papierreste auf verbranntem Boden
   sind die Ausstattung, die dieser Ort von sich aus verlangt.
2. **Nicht am Text: den hat der Ort schon.** Blattserie C, „Der
   Brandabschnitt", steht mit acht Blättern im Spiel (`serie:'C'`, achtmal
   gezählt) und liegt in den Truhen der Aschewüste. Was dem Ort fehlt, ist kein
   Inhalt — es ist ein Boden, der aussieht wie das, was die Blätter erzählen.
   Das spricht dafür, an der Fläche zu arbeiten und nicht an der Ausstattung.
3. **Volcano weiter ausbauen.** Das Pack liefert Glut, Risse und Rauch im
   richtigen Ton und ist bereits verdrahtet.

Und die eine Zeile, die aus dieser Prüfung als Regel bleibt: **Der Name eines
Ortes in diesem Spiel ist eine Aktenauskunft, keine Landschaftsbeschreibung.**
Wer Material danach aussucht, wie der Ort heißt, sucht am Ort vorbei. Die
Aschewüste ist eine Aktenvernichtung, das Schattenland ein ungeleerter
Papierkorb, das Meer eine Tilgung und der Frostkamm eine Ablage auf Eis. Für
jeden dieser vier gilt dieselbe Prüfung, und für keinen entscheidet sie das
Dateiverzeichnis.
