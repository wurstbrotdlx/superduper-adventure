## KA1: Der Druck aus Hochablage, und auf ihm Konrad zu Händen Aufschub — ERLEDIGT

Die vierte Figur aus `weltgeschichte.md`, Kapitel 6, und die letzte, die nicht
im Spiel stand. Gebaut am 04.10.2026 auf Zuruf des Projektinhabers, nach einer
Kanon-Entscheidung, die vorgelegt wurde und nicht getroffen (Entscheidung A von
drei, Abschnitt 1).

---

### 1. Der Widerspruch, und wie er aufgelöst ist

Die Weltgeschichte sagt über ihn: „Erscheint nur, wenn das Spiel Hochablage
zeigt, also im Intro, in Serie H und im Abspann." Die Weltbibel (Kapitel 8)
dazu: „Vordermühl zeigt Hochablage nie." Und `figuren-dorf.md`: „Ihn ins Dorf
zu stellen, hieße, ihn aus der Schlange zu holen, in der er seit
siebenundsechzig Jahren steht, und das ist die Figur."

Im Spiel stand er bis KA1 nur im Abspann, Bild 3, mit den zwei Zeilen aus
Szene 9. Das Intro-Blatt mit der Kaisertür war in T1 gestrichen worden, Serie
H enthält ihn nicht, und seine sechs Grundzeilen (Kreislauf) hatten keinen
Ort. Ein Kreislauf braucht ein Wiedersehen.

Drei Wege wurden dem Projektinhaber vorgelegt: **A** ein Druck an der Wand der
Amtsstube, auf dem er in der Schlange sitzt; **B** Hochablage als Ort; **C**
nicht bauen. Entscheidung: **A.** Der Kanonsatz wird dafür präzisiert, nicht
gestrichen: *Vordermühl zeigt Hochablage nur auf Papier.* Datiert in der
Weltbibel, Kapitel 8, mit Rückverweis hierher. Er bleibt in der Schlange; er
hängt nur.

### 2. Was gebaut ist

**Das Wandstück.** `INN_MOEBEL['J']`, zwei Kacheln breit, an der Nordwand der
Amtsstube rechts der Karte (`INN_RAEUME.amt.plan`, Zeile 1: `Jj`), `frei:true`,
`wand:true`, `akt:'requisit'`, `requisit:'kaisertuer'`. Gezeichnet in
`drawInnenMoebelGezeichnet()` wie die Karte: dunkler Rahmen, helles Papier,
links die Tür als dunkler Block mit winzigem Schild, davor der Poststapel als
helle Streifen, rechts die Bank mit vier Punkten. Was auf dem Schild steht,
steht beim Ansehen da.

**Das Requisit.** `REQUISITEN.kaisertuer` ist das erste Requisit mit
**Zügen**: `zuege` trägt sechs Blätter, je Ansehen eines, nach dem sechsten
wieder das erste. `requisitBlatt()` in `skript/07` zählt (`requisitZug`,
Laufzeitzustand wie der Grundzeilen-Kreislauf der Dorffiguren; ein Neuladen
fängt vorn an), `requisitAnsehen()` legt das Blatt in den Tafelstapel, „Blatt I
von I", Knopf WEGSEHEN, die Welt steht. Requisiten ohne `zuege` laufen wie
bisher.

**Die Zeilen.** Die sechs Grundzeilen aus Kapitel 6 stehen wörtlich, Sprecher
„Aufschub". Was sie trägt, ist eine Karte in einem Schlitz unter dem Bild: „Die
Karte wechselt. Niemand im Haus hat je gesehen, wer sie wechselt." Das ist der
Kreislauf, und das Haus erklärt ihn nicht. Jede Regieangabe nennt ein Detail
des Drucks, das die Weltgeschichte nennt: das Rücksichtsschild seit
dreihundert Jahren, die Bank, das Blatt in seiner Hand, der Wasserspender, das
Ende der Bank. Der Kaiser kommt nur im Präsens vor und nur als Tür.

**Der Guard.** `szeneAssert()` prüft jeden Zug als eigenes Blatt (Sperre
`AKTE_SPERRE_NAMEN`, Gedankenstrich, Emoji) und je Requisit, dass es entweder
ein Blatt oder eine Zugfolge trägt, nie beides und nie keins.

### 3. Was sichtbar ist

Ein Punkt in `NEUERUNGEN`, Stempel `2026-10-04-ka` (siebter desselben Tages).
Amtsstube, Nordwand, Ansehen.

### 4. Was ausdrücklich nicht gebaut ist

* Kein Eintrag in `DORF_FIGUREN`, keine Figur im Dorf, kein Gesprächsbaum.
  `aufschub-pruef` prüft das positiv.
* Keine Zeile im Intro. Der Pflichtweg bleibt bei 648 Wörtern (RL6/RL7).
* Hochablage als Ort (Weg B) bleibt offen, mit seinem Kanonproblem: vor dem
  Abspann fährt niemand aus Vordermühl hin.

---

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über
Playwright, mit Grafikbibliothek (für den Abzug). 04.10.2026.

| Prüfung | Ergebnis |
|---|---|
| `node tools/aufschub-pruef.mjs` (neu) | **25 von 25** |
| Abzug 1280x800, Amtsstube | der Druck hängt rechts der Karte und liest sich als Bild mit Tür und Stapel |
| `node tools/ladelauf-pruef.mjs` | 12 „in Ordnung", 0 Warnungen, Konsole still |
| `node --check` über sieben Dateien | still |

Regression, alle `tools/*-pruef.mjs`:

| Werkzeug | |
|---|---|
| `anlage2-pruef` | 123 von 123 |
| `ebene-pruef` | 54 von 54 |
| `empfang-pruef` | 190 von 190 |
| `gespraech-pruef` | 89 von 89 |
| `innen-pruef` | 27 von 27 |
| `intro-pruef` | misst unverändert: 648 Wörter bis zum ersten freien Schritt, Nachlauf 82 |
| `langvorgang-pruef` | 58 von 58 |
| `lv11-13-pruef` | 58 von 58 |
| `menue-pruef` | 78 von 78 |
| `mitteilung-pruef` | 36 von 36 (siehe Hinweis) |
| `reich-pruef` | 59 von 59 |
| `schluss-pruef` | 36 von 36 |
| `serien-pruef` | 36 von 36 |
| `speicher-pruef` | 38 von 38 |
| `steuerung-pruef` | Alles in Ordnung |
| `stopfen-pruef` | 43 von 43 |
| `szene-pruef` | 50 von 50 |
| `versuchung-pruef` | 67 von 67 |
| `zulagen-pruef` | 50 von 50 |

**Hinweis zu `mitteilung-pruef`:** im ersten Sammellauf rot (35 von 36), weil
der neue Punkt die Startmitteilung mit einem Stempel von gestern auf 526
Wörter brachte und die Zeile aus LV11-13 unter 500 verlangt. Sieben Punkte
gekürzt (KA1, LV11-13, W11-GH, Räume, Urkunden, Ernennung, Anfang in Raten):
27 Punkte, 983 Wörter im ganzen Umlauf, 336 beim Start mit Stempel von heute,
489 mit Stempel von gestern (gezählt am 04.10.2026). Danach 36 von 36. Die Zeile tut, wofür sie da ist: sie meldet, wenn
die Wand zurückkommt.

### Bewusst offen

* **Der Zugzähler ist Laufzeitzustand.** Wer das Spiel neu lädt, sieht wieder
  die erste Karte. Bei sechs Karten ist das kein Verlust; wer es persistent
  will, hängt den Zähler an `kn`.
* **Hochablage als Ort** (Weg B), siehe Abschnitt 4.
