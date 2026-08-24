# Mehr Welt: größere Karte, Portale, betretbare Höhlen — 24.08.2026

Entstanden aus einer Frage nach dem G11-Steinbruch: *„Sonst muss die Map einfach
größer werden oder Portale oder Höhlen bekommen, die man betreten kann."*

Die Frage ist richtig gestellt. 978 Blätter liegen im Manifest, das Spiel lädt
104 davon, und Deko allein wird den Rest nie aufbrauchen — ein Zaun mehr macht
die Welt nicht größer. Was hier steht, ist die Antwort der Weltbibel auf die drei
Vorschläge, mit gemessenen Zahlen statt Eindrücken.

Wie jeder datierte Bericht in diesem Repo ist das ein **Stand, kein Wegweiser**.
Nichts davon ist gebaut, nichts davon ist beschlossen.

---

## Kurz vorweg

| Vorschlag | Befund |
|---|---|
| **Höhlen, die man betreten kann** | Gibt es seit G1, drei Sätze seit M3. Was fehlt, ist nicht der Eingang, sondern die **zweite Ebene** — und dafür liegt das Material seit M3 ungenutzt da. |
| **Portale** | Sind in dieser Welt bereits erfunden, heißen **Rohrpost** und sind seit 741 verstopft. Ein Schnellreisenetz ist damit **eine Szene** von kanonisch entfernt: SZ3. |
| **Größere Karte** | Die Karte ist schon 320x320 und damit sechzehnmal so groß wie vor W-Groß. Gemessen ist sie **groß und dünn**. Mehr Fläche verdünnt weiter. |

Die Empfehlung steht unten, sie lautet: **nicht größer, sondern tiefer.**

---

## 1. Höhlen: der Eingang ist da, die Leiter führt nirgendwohin

Das Spiel hat betretbare Höhlen, seit es Kammern hat. Seit M3 sind es drei Sätze
(`Dungeon_1`, `Dungeon_2`, der Cave-Satz als Stollen), betreten wird über die
Kammertüren, und die Schwierigkeitszuordnung sitzt in einer Tabelle.

Was M3 ausdrücklich **nicht** gebaut hat, steht in seinem eigenen Abschnitt
„Bewusst offen":

> `Rails.png`, `Cave_Floor_Ladder` und die Cave-Wasseranimation liegen ungenutzt:
> Schienen ohne Lore und eine Leiter ohne zweite Ebene wären Behauptungen, keine
> Mechanik.

Das ist die ehrlichste Einstiegsstelle der ganzen Liste: **die Leiter bekommt
ihre zweite Ebene.** Eine Kammer, die nicht endet, sondern hinunterführt. Kein
neues Biom, kein neuer Ort auf der Karte, keine Weltfrage — der Kammerbau steht,
das Blattmaterial liegt seit M3 im Paket, und der offene Punkt ist von M3 selbst
formuliert.

Dazu käme `Cute_Fantasy/Other/Mine_Cart` und, wenn die zweite Ebene steht, sind
auch die Schienen keine Behauptung mehr.

**Aufwand: mittel. Eine Kammer mit zwei Ebenen ist ein Bauabschnitt mit
Messlauf** (die Kammerzeit steckt in der Schichtabrechnung, siehe
`KAMMER-MESSUNG-2026-08-20.md`: bei 180 s Rätselzeit fließen rund 1190 Gold je
Schicht in die Bank, bei 120 s rund 1690 — eine zweite Ebene verlängert die
Kammerzeit und verschiebt damit beide Zahlen).

## 2. Portale: sie heißen Rohrpost, und sie sind seit 741 verstopft

Das ist der Fund, der diese Notiz überhaupt lohnt. Die Welt hat ihr Portalsystem
längst, ausformuliert in `weltgeschichte.md`:

> Das Reich ist durch **Rohrpost** verbunden. Röhren aus gebranntem Ton,
> Druckluft, Kapseln, und in jedem Bereich eine Station. Von Hochablage nach
> Vordermühl braucht eine Kapsel achtzehn Minuten. Es ist das schnellste Ding
> dieser Welt und der ganze Stolz des Reiches.

Und der Grund, warum es nicht läuft, ist genauso genau aufgeschrieben:

> Im Jahr 741 verstopfte die Röhre zwischen Bereich VII und Hochablage, in einer
> Biegung unter dem Steinfeld. […] eine einzelne, sehr fest gewordene Kapsel mit
> einer sehr alten Rückfrage darin. Sie ist nach dem ersten Weltgesetz so lange
> nicht bearbeitet worden, dass sie fest wurde, und sie ist genau so breit wie
> das Rohr.

**Und der Stopfen ist bereits eingeplant.** `phase-sz2-gespraechsszenen.md` führt
SZ3 als „der Stopfen im Steinfeld samt Blattserie I und Postregen"; die Weltbibel
nennt Langvorgang 10 und sagt, wer ihn löst: Zapf, mit sechs Wörtern und
Werkzeug.

Daraus folgt eine klare Reihenfolge und eine Warnung.

**Die Reihenfolge:** Erst SZ3, dann Rohrpost-Stationen. Ein Netz, das vor dem
Stopfen funktioniert, macht die zentrale Erzählung des Spiels zunichte — dass
seit vierhundert Jahren nichts durchkommt.

**Die Warnung:** Der Postregen gehört ins Finale, nicht in den Alltag.
`weltgeschichte.md` gibt ihn als viertes Puzzleteil des Endes aus, vierhundert
Jahre Post in einem Nachmittag, das Reich knietief in Konfetti. Wer die Röhre im
zweiten Akt öffnet, hat sein Ende ausgegeben.

Ein gangbarer Mittelweg wäre ein **Teilnetz**: die Röhre zwischen den Bereichen
bleibt zu (Hochablage antwortet weiter nicht), aber die Stationen **innerhalb**
von Bereich VII lassen sich in Betrieb nehmen — Vordermühl, Lager, Küste,
Frostkamm, Aschewüste. Das ist Schnellreise ohne Erzählschaden.

**Aufwand: groß, und es ist zuerst eine Balancefrage.** Die Schichtuhr ist das
Spannungsmittel dieses Spiels; Wege abzukürzen greift direkt in die
Schichtökonomie ein. Dasselbe Argument, mit dem `GRAFIK-BESTAND` das Reiten
gebremst hat, gilt hier eins zu eins — mit Messlauf, nicht nach Gefühl.

## 3. Größere Karte: gemessen ist sie groß und dünn

Die Karte ist seit W-Groß 320x320 Kacheln, Kante mal vier, Fläche mal sechzehn.
Die fünf Bänder haben zwischen 13.000 und 18.200 erreichbare Kacheln.

Wie voll das ist, hat der G11-Bau nebenbei gemessen — nicht geschätzt, gezählt,
und zwar im **dichtesten** Teil der Karte, dem Weidegürtel ums Dorf:

| Weidegürtel 82x67 | 5494 Kacheln |
|---|---|
| frei (begehbar, kein Weg, kein Dorf, kein Lager) | 3504 (64 %) |
| **größtes durchgehend freies Rechteck** | **28x2** |
| Weg | 1253 |
| Baum oder Fels | 700 |

Im belebtesten Landstrich des Spiels passt kein Rechteck von zehn mal sieben
Kacheln. Nicht weil es eng wäre, sondern weil Wege und Streudeko alles
durchschneiden. Mehr Fläche daneben zu legen macht die Welt nicht voller, sie
macht die Wege länger — und lange Wege sind bereits der Grund, warum das Reiten
in der Bestandsliste steht.

**Was das Material will, sind Orte, keine Kacheln.**

## 4. Die Orte, die es schon gibt und die niemand sieht

Alle vier stehen im Kanon, alle vier sind bis heute nur Text.

* **Die Inseln (Ausgelagerte Bestände).** *„Man sieht sie liegen. Es gibt keinen
  Weg hin. In den Unterlagen sind sie als erreichbar geführt, seit vierzig
  Jahren, und niemand hat das je nachgeprüft."* — Der billigste echte neue Ort
  des ganzen Spiels, und seit G11 liegt ein **Boot** am Strandsaum, das genau
  diesen Satz illustriert. Wer prüft, was seit vierzig Jahren als geprüft gilt,
  bearbeitet einen Vorgang. Das ist dieses Spiel in einem Satz.
* **Hochablage.** Eine Stadt aus vierzehn Türmen, vier Tagesreisen nordöstlich,
  mit dem Wahlspruch des Reiches in Stein über dem Nordtor. Die Weltbibel führt
  „alles, was Hochablage zeigt" unter dem, was offen ist, **weil es noch nicht
  gebaut wurde**. Das ist der größte Brocken und der mit dem meisten Stoff.
* **Hintermühl.** Ein Dorf, das abschließend bearbeitet wurde. Es gibt einen
  Langvorgang dazu, und der zahlt ausdrücklich nichts aus.
* **Das Steinfeld.** Liegt unter der Erde und ist der Ort des Stopfens. Es ist
  der einzige dieser vier, der ohne neue Karte auskommt: eine Kammer genügt.

Und die beiden, die **nicht** gebaut werden sollten, weil die Weltbibel es
ausdrücklich sagt:

* **Bereiche I bis VI** — *„Sie gelten als abgeschlossen. Mehr wird nicht gesagt.
  Das ist Material für ein zweites Spiel und wäre als Nebensatz verschenkt."*
* **Bereiche VIII bis XII** — auf den Karten des Reiches weiß, und wer dorthin
  geht, kommt nicht wieder, *„nicht, weil es dort gefährlich wäre, sondern weil
  für die Rückkehr aus einem nicht eingerichteten Bereich kein Verfahren
  vorgesehen ist."* Das ist die beste Begründung, die eine Spielwelt für ihren
  Rand haben kann. Sie zu übertreten würde sie wegwerfen.

## 5. Das Wüstenpack, weil es seit heute im Manifest steht

92 Blätter, mit dem Lauf vom 24.08. zum ersten Mal erfasst: Kamele, Geier,
Skarabäen, ein Pharao, Wüstenkrieger mit Bogen, eine Mumie, Wüstenhäuser und ein
eigenes Tileset.

Die Aschewüste bezieht ihren Boden heute aus `Cute_Fantasy_Volcano`. Ein echtes
Wüstenset wäre ein reiner Austausch ohne neue Mechanik — das ist die billigste
Verwendung und die einzige, die keine Weltfrage stellt.

Alles andere stellt eine: Der **Brandabschnitt** ist die Aktenvernichtung, und
eine Mumie ist eine in Streifen gewickelte Akte, die nicht liegen bleiben wollte.
Diesen Witz trägt die Welt. Einen Pharao und Kamele trägt sie nicht ohne
Weiteres, und das entscheidet die Weltbibel und nicht das Dateiverzeichnis.

---

## Empfehlung

**Nicht größer, sondern tiefer**, in dieser Reihenfolge:

1. **Die zweite Ebene im Stollen.** Klein, benutzt liegendes Material, schließt
   einen offenen Punkt, den M3 selbst notiert hat, und stellt keine einzige
   Weltfrage. Danach sind auch die Schienen keine Behauptung mehr.
2. **SZ3 bauen**, das steht ohnehin an. Erst danach über Rohrpost-Stationen
   reden — vorher ist die Frage nicht entscheidbar, und der Postregen darf nicht
   vor dem Finale fallen.
3. **Die Inseln.** Der kleinste echte neue Ort, kanonisch vorbereitet, und das
   Boot steht seit G11 schon am Strand.
4. **Hochablage** als eigenes großes Vorhaben, wenn überhaupt. Vierzehn Türme
   sind kein Bauabschnitt, das ist ein zweites Dorf mit eigenem Ensemble.

Und ausdrücklich **nicht**: die Karte vergrößern. Sie ist groß genug und an den
belebten Stellen bereits zerschnitten; die 28x2 aus Abschnitt 3 sind das
Gegenargument.
