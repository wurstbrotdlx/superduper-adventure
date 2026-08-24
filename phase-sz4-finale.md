## SZ4: Die Versuchung, die Zustellung und der Abspann — ERLEDIGT

Szenen 7, 8 und 9, der letzte offene Bauabschnitt der Szenenmaschine und das
Ende des Spiels. Alle drei standen ausgeschrieben in `weltgeschichte.md`,
Kapitel 8; kein Satz ist hier erfunden worden. Gebaut werden musste, was
dazwischen liegt: eine Versammlung, in der acht Leute nacheinander sprechen, drei
Panelschritte, die es nur gibt, wenn jemand vorher gestempelt hat, und dreizehn
Standbilder.

Zwei Funde stammen aus dem Bild und nicht aus einem Guard, und beide haben
Bauteile bewegt, die seit SZ1 unangetastet waren.

---

### 1. Szene 7 ist die Versammlung und nicht die acht Einzelgespräche

Die Weltgeschichte bietet beides an und nennt die billigere Fassung selbst:

> **Mit Bordmitteln:** Wer knapp bauen will, macht daraus acht kurze
> Einzelgespräche im Amtsflur statt einer Versammlung. Das ist billiger und fast
> so gut.

Gebaut ist die Versammlung, und der Grund stand seit SZ1 im Code, lange bevor es
die Szene gab. Im Kommentar an `szeneKnoten()`:

> SZ1, die einzige echte Erweiterung der Maschine: ein Knoten darf mit `wer:` die
> sprechende Figur wechseln. Der Empfang braucht das nicht, er hat nur einen
> Sprecher. **Szene 7 braucht es, dort geht Vorblatt durch acht Leute hindurch**,
> und ohne Porträtwechsel wäre eine Versammlung eine Wand aus Text.

Das Bauteil war also für genau diese Szene gebaut worden und bis heute nie
benutzt. Acht Einzelgespräche wären außerdem acht Tafeln ohne Publikum gewesen,
und die Pointe der Szene ist, dass alle zuhören, während jeder Einzelne sein
Angebot bekommt.

Gegengezählt, nicht geschätzt: **46 Knoten, 3 Fragen, 98 Zeilen, acht
Sprecher.** Damit ist sie die größte Szene des Spiels, und die Gesamtzahl der
Knoten über alle zwanzig Einträge in `SZENEN` steigt von 93 auf 139.

Knöterich wechselt als Funktion und nicht als Schlüssel, weil er als Einziger
nicht in `DORF_FIGUREN` steht. `szeneSprecherSetzen()` nahm beides schon vorher,
`szeneAssert()` lässt beides schon vorher durch. Es musste dafür nichts geändert
werden, was ein gutes Zeichen für die Maschine ist.

### 2. Die vier Antwortzeilen sind drei Fragen und ein Ausgang

Die Weltgeschichte gibt dem Spieler an einer Stelle das Wort:

> AUSSENDIENST: *(Antwortauswahl, vier Zeilen)*
> 1. Was muss ich lassen? 2. Warum ist Ihnen das so viel wert?
> 3. Was passiert, wenn ich zustelle? 4. *(nichts sagen)*

Vier Zeilen sind genau der Deckel aus U3 (`ANTWORT_DECKEL`, vier Antworten je
Tafel), und ein fünfter Eintrag wäre nicht darstellbar. Gebaut ist deshalb die
Bauform der Gesprächsbäume aus F1d: drei Fragen mit `sicht: 3` plus
`hubAusgang`. Das ist keine Kürzung, sondern die Übersetzung, die sich anbietet:
**die vierte Zeile lautet dort „nichts sagen", und ein Ausgang ist genau das.**

Zwei Dinge daran sind bewusst so und nicht anders:

* **Der Ausgang beendet die Szene nicht.** Er führt auf Vorblatts vierte
  Antwort („Sie überlegen. Das ist gut.") und von dort in die zweite Hälfte der
  Szene. Wer sofort schweigt, sieht alles, was danach kommt. Geprüft wird das
  eigens, weil ein Ausgang, der aussteigt, hier die halbe Szene verschluckt
  hätte.
* **Der Ausgang ändert sich nicht mit der Zahl der gestellten Fragen.** Die
  Bäume aus F1d tun das (dort schaltet die tiefste Frage einen anderen Ausgang
  frei), hier wäre es falsch: in dieser Szene wird nichts angenommen und nichts
  abgelehnt, und ein Ausgang, der sich nach drei Fragen anders liest, wäre eine
  Entscheidung.

### 3. Ein Merker, eine Wahrheit: der Zwischenbescheid

Die Weltgeschichte nennt den Stempel am Ende von Szene 7 und macht ihn in Akt V
zur Sperre:

> Auf der Ausfertigung klebt ein Zwischenbescheid des Reiches. Ein zugestelltes
> Schriftstück mit anhängigem Zwischenbescheid ist nicht zustellbar, es ist in
> Bearbeitung. Die Taste liegt da und tut nichts.

Gebaut ist das ohne ein einziges neues Feld. `vorgangAnhaengig()` liest
`kn.flags.szeneVersuchung`, also den Merker, den die Szene ohnehin setzt. Das ist
dieselbe Bauform, mit der SZ3 den Stopfen an genau eine geschriebene Größe
gehängt hat, und sie hat hier denselben Ertrag: es gibt keinen Zustand, in dem
ein Bescheid klebt, den niemand aufgedrückt hat.

Daraus folgt die Regel für den ganzen Strang, und sie ist die von LV4:

> **Ein fehlender Strang nimmt nichts weg, ein vorhandener gibt etwas dazu.**

Wer die Versuchung nie spielt, stellt zu wie vor SZ4, bei Schritt 4, ohne einen
Satz weniger zu sehen. Wer sie spielt, bekommt drei Schritte davor und die Figur,
die vierzig Jahre zu spät kommt. Nichts wird verweigert, nichts wird erklärt.

### 4. Aus drei Panelschritten sind sechs geworden, und die Nummern sind gewandert

Die Zustellung war seit W5 eine Schreibstelle mit drei Schritten. Die drei neuen
(der Gruß des Fürsten, die Taste, die nichts tut, die Frau mit der Teetasse)
gehören **vor** die alten, und damit stand eine Wahl an: die neuen Schritte hinten
als 7 bis 9 anhängen und die Guards in Ruhe lassen, oder umnummerieren.

Umnummeriert. Die Schrittnummer ist die Reihenfolge, in der der Spieler das Panel
sieht, und eine Kette, die bei 7 anfängt und bei 4 weitergeht, wäre beim nächsten
Weiterschreiben eine Falle. Mitgezogen sind `vorgangAssert()`, der
Langvorgang-Guard und `tools/langvorgang-pruef.mjs` (sechs Stellen). Das ist die
ehrlichere Seite der Rechnung und hat vier Zeilen im Langvorgang-Lauf rot
gemacht, bis sie nachgezogen waren.

Dazu ein sechster Spiegel in `vorgangAssert()`: `amt.stopfenSchicht` steht jetzt
mit im `finally`, weil das Finale die Kapsel aus dem Rohr in beiden Zuständen
rendert.

### 5. Die Kapsel: der einzige Lohn des Stopfens, der im Finale ankommt

Die Weltgeschichte legt am Ende von Szene 8 ein Blatt auf den Tisch: die Kapsel
aus dem Rohr, die Frage von 596, und darunter Zapfs vier Wörter. Der Fürst
verbeugt sich vor dem Hausmeister.

Das steht im Finale nur, wenn `amt.stopfenSchicht` gesetzt ist, also wenn SZ3
wirklich gespielt wurde. Es ist der einzige Ort, an dem der Stopfen im Ende
ankommt, und er ist es wert: wer die Röhre nie geöffnet hat, hat auch keine
Kapsel, und der Fürst verbeugt sich vor niemandem.

### 6. Der Abspann ist der zweite Tafelstapel, und SZ1 hat ihn vorhergesagt

Auch hier stand das Bauteil vor der Sache. Im Kommentar an `szeneTafelLauf`:

> SZ1: Der laufende Tafelstapel. Liste, Beschriftung des letzten Knopfes und was
> danach geschieht, stehen als Zustand daneben. Damit blättert dieselbe Optik das
> Intro (neun Blätter) und **später den Abspann (dreizehn Bilder)**, ohne dass
> eine zweite Zeichenstelle entsteht.

Neun Blätter am Anfang, dreizehn am Ende, dazwischen liegt das ganze Spiel. Die
Blattzahl zählt arabisch, weil dreizehn über `ROEMISCH` liegt und die
Schreibweise dem Stapel gehört und nicht der einzelnen Zahl (die Regel stammt aus
SZ2, von den vierzig Zwischenbescheiden).

`abspannBlaetter()` ist eine Funktion und keine Tabelle, weil Bild 7 den
Strangzustand liest, genau wie der alte Abspanntext es seit W5 tat.

### 7. Der erste Fund im Bild: der Stapel wusste nicht, wer spricht

Bild 11 ist eine Wechselrede zwischen Vorblatt und Sturz. Im Bild sah sie so aus:

```
Ich habe einundvierzig Jahre lang nichts entschieden.
Ich würde gern einmal etwas entscheiden. Etwas Kleines.
Setzen Sie sich. Nehmen Sie einen Teller.
Welchen?
Das entscheiden Sie.
```

Fünf Zeilen, ein Sprecher, gelesen als Selbstgespräch. Der Witz daran ist, dass
es zwei sind, und der Witz war nicht zu sehen. Kein Guard konnte das melden: die
Blattform war gültig, die Formregeln hielten, die Zeilen standen wörtlich in der
Weltgeschichte.

Das Intro brauchte den Sprecher nie, es hat eine Stimme. Der Abspann hat fünf
Bilder mit Rede und eines davon ist ein Dialog. Gebaut ist deshalb die kleinste
Erweiterung, die reicht: **eine gesprochene Zeile darf statt eines Strings ein
Paar aus Sprecher und Satz sein.** Der String bleibt die einfache Form.
`szeneTafel()` setzt den Namen als Schild darüber, in der Form der Kopfzeile
(gesperrte Versalien, gedämpft) und nicht in der eines Drehbuchs: dieses Haus
schreibt Namen so.

`szeneAssert()` prüft beide Formen durch dieselben Formregeln und meldet
zusätzlich ein Paar mit leerem Sprecher, weil das ein Namensschild wäre, das
leer bleibt.

### 8. Der zweite Fund im Bild: acht von dreizehn Bildern passten nicht ins Fenster

Gemessen, nicht vermutet. Auf fünf Fenstergrößen, alle dreizehn Bilder, geprüft
wurde die Unterkante des untersten Knopfes gegen die Fensterhöhe:

| Fenster | Schrift | Bilder, deren Knopf unter dem Fensterrand lag |
|---|---|---|
| 1280x800 | 1,0 | Bild 11 |
| 1280x720 | 1,0 | Bild 11 |
| 1280x660 | 1,0 | keins |
| 360x640 | 1,0 | keins |
| 360x640 | 1,4 | Bild 1, 4, 9, 11 |

Das Intro und die vierzig Zwischenbescheide passen auf allen fünf. Der Fehler war
also gebaut und nicht geerbt, und er hat eine klare Ursache: **die
`gross/klein`-Lesart trägt keine Absätze.** Sie stammt aus E1, wo fünf
Anrisstafeln je eine Behauptung und eine Fußnote trugen; seit SZ1 das Intro an
ihre Stelle gesetzt hat, war der Abspann der erste Stapel, der sie überhaupt
wieder benutzt. Acht meiner Bilder hatten dort 250 bis 320 Zeichen stehen, wo
eine Fußnote hingehört.

Zwei Eingriffe, in dieser Reihenfolge:

1. **Die Bilder auf Blattform gekürzt.** Vierzehn Stellen. Das kostet ein paar
   Sätze, die gut waren („Der Adel des Reiches verliert seinen Rang in der Zeit,
   die man braucht, um eine Treppe hinunterzugehen"), und der Verlust ist echt.
   Die Weltgeschichte verlangt an dieser Stelle aber ausdrücklich „elf
   Standbilder im Blattstil, **zwei Zeilen darunter**", und ein Absatz unter
   einem Standbild ist kein Standbild, sondern eine Textseite.
2. **Der Rahmen bekommt eine gemessene Höhe.** Danach lag noch ein Bild daneben,
   auf dem kleinsten Telefon bei größter Schrift. Statt weiter zu kürzen rollt
   jetzt der Text *innerhalb* der Urkunde (`max-height: 56vh`), und Siegel,
   Kopfzeile, Blattzahl und Knopf bleiben stehen, wo sie sind.

Der zweite Eingriff widerspricht E2 nicht. Dort wurde für den Vordruck
„blättern statt rollen" entschieden, und das gilt weiter; ein Standbild lässt
sich aber nicht blättern. Dieselbe Bauform benutzt das Finale seit W5, mit
`max-height: 38vh` am Puzzleteil-Kasten.

Die Messung ist danach nicht weggeworfen worden, sondern in
`tools/versuchung-pruef.mjs` gewandert: fünf Fenster, dreizehn Bilder, fünf
Prüfzeilen. Ein Abspann, der beim nächsten Weiterschreiben wieder aus dem Fenster
wächst, meldet sich von selbst.

### 9. Die Mappen bleiben liegen

Die eine Regel der Szene, die die Weltgeschichte als nicht verhandelbar führt:

> Niemand nimmt etwas an, und niemand lehnt etwas ab. Alle Mappen bleiben liegen.
> Sie liegen bis zum Abspann dort. Das ist wirksamer als jede Entscheidung, weil
> jeder im Haus damit weiterlebt, dass es das gegeben hätte.

Gebaut als eine Zeile im Amtspanel, neben der Gießkanne und der Schublade, und
nicht als Weltobjekt. Ein Mappenstapel im Flur wäre ein Blatt und ein Anker
gewesen; die Zeile ist der Vorgang. Sie verschwindet nie, weil die Mappen nie
abgeholt werden.

### Prüfprotokoll

Neu: **`tools/versuchung-pruef.mjs`, 67 Prüfungen**, Exit-Code 1 bei der ersten
Abweichung. Was `szeneAssert()` und `vorgangAssert()` ohne Spielzug prüfen (Form,
Erreichbarkeit, Formregeln, Blattform), steht dort nicht noch einmal. Geprüft
wird, was sich erst im Spielen zeigt: die Fälligkeit an Vorblatt über fünf
Zustände, der Vorrang vor seinem Gesprächsbaum, der Weltstopp, die acht
Sprecher, die Vierzeiligkeit der Antwortliste an jedem einzelnen Knoten, der
Ausgang, der nichts abkürzt, die Mappen, der Einstiegsschritt der Zustellung mit
und ohne Bescheid, die Kapsel in beiden Zuständen, die dreizehn Bilder samt
Kanon von Bild 10, 12 und 13, der laufende Stapel im DOM, und die Höhenmessung
aus Abschnitt 8.

Dazu die **Gegenprobe**: vier Fehler werden im laufenden Spiel in die Tabellen
gesetzt (leerer Sprecher, zwei Lesarten auf einem Blatt, ein Gedankenstrich, eine
zu lange Frage), jeder muss gemeldet werden, und danach muss der Guard wieder
schweigen. Ein Guard, der immer schweigt, beweist nichts.

Zwei Zeilen sind während des Baus rot geworden und haben etwas berichtigt:

* **„sechs Bilder haben einen Satz, sieben nicht"** stand als Zahl im Kommentar
  und war falsch, es sind fünf und acht. Der Prüflauf hat es gemeldet, bevor es
  jemand gelesen hat.
* **„Der Rang eines Hauses ergibt sich aus dem Alter…"**, ein Zitat aus Serie G,
  stand im Schlusspanel und schlug sofort zweimal an: `ergibt` und `Alter` stehen
  beide auf der Kesselgrammatik-Sperrliste. Der Satz ist ersetzt.

| Lauf | Ergebnis |
|---|---|
| `tools/versuchung-pruef.mjs` | 67 von 67 |
| `tools/szene-pruef.mjs` | 48 von 48 |
| `tools/stopfen-pruef.mjs` | 43 von 43 |
| `tools/langvorgang-pruef.mjs` | 58 von 58 (nach dem Nachziehen der Schrittnummern) |
| `tools/reich-pruef.mjs` | 59 von 59 |
| `tools/empfang-pruef.mjs` | 59 von 59 |
| `tools/menue-pruef.mjs` | 39 von 39 |
| `tools/ebene-fehlversuch.mjs` | 17 von 17 |
| `tools/steinbruch-fehlversuch.mjs` | 8 von 8 |
| `tools/gespraech-pruef.mjs` | 87 von 89 |
| `tools/ebene-pruef.mjs` | 52 von 54 |

Die drei offenen Zeilen in den letzten beiden Läufen hängen am Grafikpaket, das
in diesem Repo nicht liegt („die Leiter ist geladen", „das zweite Porträt ist
gezeichnet", „Nörgel steht auf dem Blatt der Grünhaut"). Gegengeprüft am Stand
vor SZ4: dieselben Zeilen, dieselben Werte. Sie gehören nicht zu diesem
Bauabschnitt.

Dazu `node tools/build-single.mjs` und `dist/index.html` per `file://`: Konsole
still, dreizehn Abspannbilder im Build.

### Im Bild

Alles Gebaute angesehen, auf 1280x800 und auf 360x640 bei größter Schrift. Beide
Funde oben stammen daraus. Nebenbefund, nicht behoben: Vorblatts Name
(„Reichsministerialdirektor zu Händen Vorblatt") wird in der Kopfzeile der
Gesprächstafel auf dem Telefon abgeschnitten. Das ist seit SZ3 so und gilt für
jede lange Amtsbezeichnung, nicht nur für seine; die Kopfzeile zeigt `name` und
nicht `kurz`. Es hier zu ändern hieße, es für alle vierzehn Figuren zu ändern,
und das ist eine UI-Runde und keine Zeile im Vorbeigehen.

### Bewusst offen

* **Die einundvierzig Blätter bleiben ein Osterei ohne Schale.** Die
  Weltgeschichte gibt dem, der alle Zwischenbescheide gesammelt hat, in Szene 7
  eine fünfte Antwort („Sie haben einundvierzig Jahre lang gearbeitet"). Es gibt
  keinen Merker dafür, dass jemand sie alle hat, und `szeneOptionen()` kennt an
  einer Frage kein freies Prädikat, nur `frei` (eine andere Frage) und `nach`
  (eine Anzahl). Beides wäre zu bauen, und der Antwortdeckel läge bei fünf
  Zeilen ohnehin im Weg. Die Frage ist nicht entschieden, sie ist nur nicht
  gestellt worden.
* **Es fällt kein Konfetti.** Die Weltgeschichte lässt am Ende von Szene 8
  überall gleichzeitig Papier fallen, und `splatConfetti()` gibt es seit Phase 1.
  Gebaut ist es nicht: die Zustellung läuft im Panel, die Welt dahinter steht
  still, und ein Partikelregen auf einer angehaltenen Welt wäre eine eigene
  Runde. Der Abspann erzählt es in Bild 4 und 9.
* **Der Regen ist ein Satz und kein Effekt.** Bild 10 ist nach der
  Weltgeschichte nicht verhandelbar und steht wörtlich da; „ein Partikeleffekt in
  umgekehrter Richtung des Konfettis" ist er nicht geworden, aus demselben Grund.
* **Vorblatt hat weiter keine zweite Gestalt.** SZ3 hat das schon notiert. Im
  Abspann steht er „in Hemdsärmeln, ohne Rang" im Text und trägt im Bild
  dasselbe Blatt wie vorher. Ein Standbild im Tafelstapel zeigt ohnehin kein
  Sprite, insofern kostet es hier nichts.
* **Der Abspann kennt keine Musik.** Bild 12 sagt, dass der vierte Takt einmal
  durchläuft, und es ist der einzige Moment im Spiel, in dem etwas zu Ende
  gespielt wird. Gehört wird er nicht. Der Klangvorrat ist der aus Phase 6 und
  bekommt keinen Zuwachs im Vorbeigehen, und eine Amtshymne, die drei Takte lang
  richtig sein muss, um im vierten zu stimmen, ist kein Nachtrag.
