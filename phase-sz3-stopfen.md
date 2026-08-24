## SZ3: Der Stopfen und die Entklammerung — ERLEDIGT

Szenen 5 und 6, der zweite Schritt aus `WELT-ERWEITERUNG-2026-08-24.md`. Beide
Szenen standen ausgeschrieben in `weltgeschichte.md`, Kapitel 8; kein Satz ist
hier erfunden worden. Was gebaut werden musste, war alles darum herum: ein Ort
im Steinfeld, ein Langvorgang, der dorthin führt, ein dritter Fundweg für
Aktenblätter, drei Schichten Papier im Dorf, und eine Entscheidung darüber, wann
der Gegenspieler ankommt.

Die letzte war die einzige, die nicht in der Weltgeschichte stand, und sie hat
zwei Prüfwerkzeuge und einen Langvorgang mitgenommen.

---

### 1. Die brummende Stelle, und warum sie schweigt statt zu leuchten

Die Weltgeschichte hat den Ort lange vor diesem Bauabschnitt gesät, und zwar als
Wahrnehmung und nicht als Ziel:

> Es gibt im Steinfeld eine Stelle, an der der Boden brummt. Wer dort stehen
> bleibt, hört es. Lott und Pahl sagen, das sei schon immer so gewesen.

Genau so ist sie gebaut. Kein Marker auf der Minimap, kein Pfeil, kein Eintrag
im Brett — die Weltbibel schließt Questmarker aus, und dieser Ort ist der erste
Fall, an dem das etwas kostet. Was es dafür gibt, ist ein Satz alle sechs
Sekunden, wenn man näher als 150 Pixel steht: **„Der Boden brummt."** Mehr nicht.

**Der Ort wird gesucht, nicht gewürfelt.** Dieselbe Regel wie bei der Koppel in
G11 und den Buchten in G12, und aus demselben Grund: `rng()` hätte den
Zufallsstrom für alles Folgende verschoben. `setzeStopfen()` scannt das
Ruinenband von seiner Unterkante nach oben und von der Kartenmitte nach außen
und nimmt die erste begehbare Kachel, die nicht auf einem Weg liegt und deren
acht Nachbarn frei sind. Auf der geprüften Karte ist das **(161, 61)**.

Er liegt einmal je Welt und bleibt liegen, wie `decos`. Die Kammertüren werden
je Schicht neu gewürfelt, dieser Ort nicht: eine Röhre, die jede Schicht
woanders liegt, wäre keine Röhre.

**Das Brummen hängt ausdrücklich nicht am Akt.** Der erste Prüflauf hat hier
eine Sperre vor Akt IV erwartet und keine gefunden — und die Sperre wäre der
Fehler gewesen, nicht ihr Fehlen. Der Boden brummt seit 741, also auch für
jemanden, der in Akt I hinaufsteigt und nichts damit anfangen kann. Das ist die
Saat. Das *Angebot* dagegen hängt am Akt, und zwar an demselben `wenn()` wie der
Langvorgang.

### 2. Langvorgang 10: der erste Strang, der jemanden irgendwohin schickt

Vier Schritte, drei davon an einem Ort statt an einer Figur:

| | wo | was |
|---|---|---|
| 1 | die Stelle | **Nachsehen.** „Der Boden brummt hier wirklich." |
| 2 | die Stelle | **Freilegen.** Jetzt liegt die Röhre da, gebrannter Ton, armdick |
| 3 | das Dorf | **Zapf.** „Im Steinfeld brummt der Boden. Ich hole das Werkzeug." |
| 4 | die Stelle | **Die Röhre öffnen.** Szene 5 |

Bei Stufe 2 bietet die Stelle **nichts** an. Das ist Absicht: dort fehlt Zapf,
und der steht im Dorf. Eine Kontextaktion, die anbietet, was sie nicht kann, ist
schlimmer als keine — und `stopfenAktionText()` ist deshalb die einzige Quelle
für Angebot **und** Ausführung, dieselbe Bauform wie `kannAbsteigen()` in M4.

Zapfs Zeile ist nicht neu erfunden: sie steht seit W11 wörtlich in seiner
`zusatz`-Tabelle und war bis heute eine Ankündigung ohne Mechanik dahinter.

### 3. Der Fund: Zapf trägt drei Stränge, und der Stopfen stand hinten

Der erste Prüflauf bekam auf `langAnsprechen('zapf')` die Antwort
**„Gießen ist nicht mein Ressort."** statt „Ich hole das Werkzeug."

`langAnsprechen()` geht `LANGVORGAENGE` in Einfügereihenfolge durch und liefert
den **ersten** Strang, der vorrückt. Zapf berührt drei (Gießkanne, Anlage 3,
Stopfen), und der neue stand am Ende der Tabelle. Die Gießkanne hat seinen einen
Satz verschluckt.

Das ist genau die Schlange, die der Kommentar bei `bericht` schon vermerkt hatte
(„Zwirn trägt sonst elf Dorffest-Anläufe vor diesem hier"), nur an einem Strang,
der sie noch nicht kannte. Berichtigt auf demselben Weg: der Stopfen steht jetzt
als **zweiter** in der Tabelle, direkt hinter `bericht`. Er kostet die beiden
anderen dabei fast nichts, denn sein Ansprechschritt feuert nur bei `roh === 2`
— in dem einen Moment, in dem die Röhre freiliegt und noch niemand das Werkzeug
geholt hat. Ein Tastendruck, einmal im Spiel.

### 4. Szene 5, und die erste Szene, die an einem Ort spielt

`SZENEN.stopfen` trägt kein `figur`-Feld. Sie wird von der Kontextaktion
geöffnet, nicht von `szeneFaellig()` — dieselbe Bauart wie `SZENEN.schublade`,
die aus dem Amtspanel kommt.

Zapf spricht, obwohl er im Dorf steht. Das ist kein Trick:
`szeneSprecherAusDorf()` fällt auf den Tabelleneintrag zurück, wenn die Figur
nicht in der Welt steht, und erzählerisch ist er mitgekommen — Stufe 3 des
Strangs **ist** „Zapf geholt". Ihn wirklich hierher laufen zu lassen wäre ein
Wegfindungsproblem in einem Spiel, das keine Wegfindung hat (`genMap()`
Schritt 3).

Am Ende der Szene passiert alles auf einmal, und alles hängt an **einer**
geschriebenen Größe plus einem Zeitstempel:

* der Strang geht auf Stufe 4,
* `amt.stopfenSchicht` wird gestempelt,
* Serie I wird auffindbar,
* der Postregen fängt an,
* und Vorblatt sitzt zwei Schichten später auf dem Wagen.

Kein zweiter Merker, keine zweite Wahrheit.

### 5. Serie I: der dritte Fundweg, und der erste, der an einem Ereignis hängt

Sechs Blätter, alle an jemanden gerichtet, den es im Haus gibt, und keines
beantwortet. Aus der Weltgeschichte übernommen, Wort für Wort.

`blaetterAssert()` kannte bisher zwei Fundwege: Kammertruhen (A/B/C/D, mit
`biome` bzw. `minDiff`) und Ablage V (E/F, ohne Ortsfeld). Serie I ist der
dritte, und sie ist die einzige, die **überall** fällt und erst **nach** einem
Ereignis. Der Guard hat dafür eine dritte Liste bekommen und eine neue
Zusicherung dazu: ein Blatt der Röhrenserie darf **kein** Ortsfeld tragen, denn
ein Ortsfeld wäre eine Behauptung, die kein Fundweg einlöst.

Die Chance liegt bei 0,02 je Kill, also zwischen E (0,04) und F (0,006). Die
Post ist nicht selten — sie war nur unzustellbar.

Der Bestand geht damit von 48 auf **54 Blätter in sieben Serien**. Die Zählzeile
im Kladde-Reiter rechnet aus `BLAETTER_KEYS.length` und zieht selbst nach.

### 6. Der Postregen, und was er ausdrücklich nicht ist

Drei Schichten lang fällt im Dorf Papier, aus dem Bauteil, das seit Phase 1 dafür
da ist: `splatConfetti()`. Kein neuer Partikel, keine neue Schleife — die
Weltgeschichte hat es selbst so vorgeschlagen („ein Partikeleffekt aus dem
vorhandenen Konfetti").

**Er ist nicht der Postregen des Finales.** Der gehört laut Weltgeschichte ins
Ende — vierhundert Jahre Post in einem Nachmittag, das Reich knietief in
Konfetti — und `WELT-ERWEITERUNG-2026-08-24.md` hat ausdrücklich davor gewarnt:
„Wer die Röhre im zweiten Akt öffnet, hat sein Ende ausgegeben." Drei Schichten
Papier im Dorf sind die Ankündigung, nicht die Einlösung.

Dazu drei Zeilen bei Zwirn und zwei bei Bramsche, beide über den
`{lang:'stopfen'}`-Schalter, also als abgeleiteter Lesevorgang von
`langFertig()` und nicht als zweiter Merker (W7-Doktrin). Zwirn bekommt die
Bewilligung, auf die er seit acht Jahren wartet, und sie ist an die Amtsleitung
gerichtet, und die Amtsleitung ist N. N.

> Sie ist da. Die Bewilligung. / Sie ist nur an niemanden. / Ich hebe sie auf.

### 7. Die Entscheidung: Vorblatt kommt an, statt dazustehen

Die einzige Frage dieses Abschnitts, die nicht in der Weltgeschichte stand.

`phase-sz2-gespraechsszenen.md` hatte für SZ3 notiert: *„Der Stopfen behält
seinen Preis: er zieht Vorblatts `abAkt` vor."* Nur stand Vorblatt seit W11
bereits ab **Akt III** im Dorf, und der Stopfen ist Akt IV — vorziehen ging so
nicht. W11 hat das selbst als offenen Punkt geführt:

> Vorblatt steht im Dorf und ist ansprechbar; sein Auftritt ist damit nicht
> erzählt. Das ist der Unterschied zwischen einer Figur und einer Szene.

**Entschieden: sein Auftritt wird erzählt.** `abAkt` geht von 3 auf 4, und dazu
kommt ein zweiter Schalter an derselben Figur:

```js
{key:'vorblatt', ..., abAkt:4, daWenn: () => kn.flags.szeneVorblatt, ...}
```

`figDa()` liest beides. Vorblatt steht im Dorf, wenn er **angekommen** ist, und
nicht, wenn eine Schichtzahl es erlaubt. Ein Gegenspieler, der schon dasteht,
wenn seine Ankunft erzählt wird, wäre derselbe Fehler wie eine Leiter ohne
zweite Ebene.

Die Ankunft selbst ist Szene 6, und sie fällt auf zwei Wegen, der frühere
gewinnt:

* **zwei Schichten nach dem Stopfen** — er liest den Dienstbericht, weil die Post
  wieder läuft, und lässt anspannen,
* **zwei Schichten nach der vierten Adresszeile** — Kordula Umlauf erzählt Oben,
  dass hier etwas in Bewegung kommt, ohne etwas Böses dabei zu denken.

Damit hat der Stopfen seinen Preis, und zwar den aus der Weltgeschichte: nicht
*dass* Vorblatt kommt, sondern *wann*.

Szene 6 kommt zum Spieler und nicht umgekehrt: `szene6Faellig()` hängt im
Update-Takt und öffnet die Szene, sobald der Spieler auf dem Dorfplatz steht.
Die Weltgeschichte bot an, die Entklammerung hinter die Amtstür zu verlegen und
Lott und Pahl davon erzählen zu lassen („Das ist sogar besser"). Gebaut ist
trotzdem die Fassung auf dem Platz, aus einem mechanischen Grund: seit dieser
Szene steht Vorblatt im Dorf, und der Spieler muss gesehen haben, wie er
hereinkam. Lott und Pahl bekommen ihre Zeilen trotzdem, direkt danach, über den
`letzterAnlass`-Kanal, den SZ2 gebaut hat.

### 8. Was die Entscheidung mitgenommen hat

Drei Stellen, alle drei von Guards gefunden und keine davon vorher bedacht.

**`langAssert()` brauchte einen siebten Spiegel.** Punkt (2) fragt, ob ein Strang
jemals abschließbar ist, und Langvorgang 4 (Lisbeths sechster Praktikumsbericht)
läuft über Vorblatt. Der Guard kannte nur den Zustand vor Szene 6 und meldete
den Strang als tot. Er setzt `kn.flags.szeneVorblatt` jetzt für die Dauer der
Prüfung und nimmt es im `finally` zurück, wie die sechs Spiegel davor.

**Langvorgang 4 hat weniger Luft als vorher.** Sein Kommentar sagte: „bis Akt V
(Schicht 41) bleiben zwanzig Schichten Luft." Das stimmt nicht mehr — Vorblatt
kommt frühestens zwei Schichten nach dem Stopfen und spätestens zwei nach der
vierten Adresszeile, beides in Akt IV, danach bleiben rund **acht** Schichten
statt zwanzig. Weiterhin Pacing und keine Blockade, aber ein knapperes, und der
Kommentar sagt es jetzt. Nebeneffekt, der zur Erzählung passt: **wer den Stopfen
zieht, kauft sich Luft für Lisbeths Unterschrift.**

**Zwei Prüfwerkzeuge trugen den alten Vertrag.** `reich-pruef.mjs` behauptete
„vorblatt steht in Akt 3 im Dorf", `langvorgang-pruef.mjs` ließ die Kette in
Akt III durchlaufen. Beide sind nachgezogen und prüfen jetzt beide Hälften
einzeln: der Akt allein reicht nicht, und die Ankunft allein auch nicht.

### 9. Berichtigt: eine Zeile in `ebene-pruef.mjs` hat geflackert

Nicht SZ3, aber im selben Lauf gefunden. Der M4-Prüflauf verglich die
Wächterdichte oben und unten an einer Stichprobe von **einer** Kammer. Zwei der
acht Rätselmodule setzen ihre Wächter selbst (`welle` erzeugt `3 + diff` und
trägt `keineWaechter`), und ob eines davon gezogen wird, entscheidet der Zufall
— der Vergleich maß also mal die Regel und mal die Modulwahl. In vierzehn Läufen
ist er einmal umgefallen.

Ersetzt durch die Regel selbst, die deterministisch ist. Die **Dichte** misst
`ebene-messlauf.mjs` über vierzig Kammern, und dort gehört sie hin: eine
Verteilung gehört in einen Messlauf und nicht in eine Zeile mit ist und soll.

---

### Prüfprotokoll

Live im Browser, nicht nachgerechnet. `python3 serve.py`, Chromium über Playwright.

| Prüfung | Ergebnis |
|---|---|
| `node tools/stopfen-pruef.mjs` | **43 von 43** |
| `stopfenAssert()` beim Start | „die Stelle liegt bei (161, 61) im Steinfeld, Serie I mit 6 Blättern hängt am Ereignis, Vorblatt an seiner Ankunft." |
| Guards beim Start | **20** (seit M4 neunzehn), Warnungen und Fehler in der Konsole **0** |
| `node tools/build-single.mjs` + `file://` | 0 „Sprite fehlt", 0 Fehler |
| `python3 tools/monsterkatalog.py` | 28 Gegner, 0 Verletzungen, Katalogdateien unverändert |

Regression, alle grün — die beiden mit Sternchen sind für den neuen Vertrag
nachgezogen worden, siehe Abschnitt 8:

| Werkzeug | |
|---|---|
| `menue-pruef` | 39 von 39 |
| `gespraech-pruef` | 89 von 89 |
| `empfang-pruef` | 59 von 59 |
| `szene-pruef` | 47 von 47 (vorher 45, die zwei neuen Szenen zählen mit) |
| `reich-pruef`\* | 59 von 59 (vorher 55) |
| `langvorgang-pruef`\* | 58 von 58 (vorher 57) |
| `ebene-pruef` | 54 von 54, sechs Läufe hintereinander grün |
| `ebene-fehlversuch` | 8 Eingriffe, alle gemeldet |
| `monster-fehlversuch` | alle Regeln greifen |
| `steinbruch-fehlversuch` | 8 Eingriffe, alle gemeldet |

**Sechs Funde stammen aus dem ersten Guard-Lauf** und nicht aus dem Nachdenken:
zwei fehlende Anlassquellen, eine tote Aktzeile bei Vorblatt, eine unbekannte
Ereignisart, ein toter Tabelleneintrag und zwei zu lange Antworten. Dazu die
Schlange bei Zapf aus dem Prüflauf. Das ist der Ertrag der Regel „live
verifizieren statt behaupten", einmal vollständig abgerechnet.

### Im Bild

Angesehen wurde die ganze Kette: die brummende Stelle vor dem ersten Griff, die
aufgegrabene Stelle, die freigelegte Röhre mit ihrem Ring, Szene 5 mit Zapfs
Porträt, der Postregen auf dem Dorfplatz und Szene 6.

**Ein Befund, den nur das Bild gezeigt hat:** Nachsehen und Freilegen sind zwei
Griffe an derselben Stelle, und wer sie hintereinander tut, hatte vier Zeilen
übereinanderstehen. Unlesbar. Die Zeilen des vorigen Schritts weichen jetzt,
sobald der nächste spricht.

### Bewusst offen

* **Vorblatt hat keine zweite Gestalt.** Die Weltgeschichte beschreibt ihn vor
  der Entklammerung als „breiter als die Amtstür" und danach als „schmaler,
  älterer Herr in Hemdsärmeln", und schlägt dafür zwei Sprite-Zustände vor.
  Gebaut ist einer. Der Unterschied steht im Text der Szene und nicht im Bild,
  und ein zweites Blatt für eine Figur, die nach der Szene nie wieder breit ist,
  wäre ein Blatt für sieben Sätze.
* **Die Kapsel ist kein Gegenstand.** Sie wird in der Szene beschrieben und
  wandert nicht in den Beutel. Ein Beutelgegenstand ohne Verwendung wäre eine
  Behauptung, und die Zutaten-Grammatik aus Phase 1 kennt keine Einzelstücke.
* **Der Postregen fällt nur im Dorf.** Wer die drei Schichten im Frostkamm
  verbringt, sieht ihn nicht. Das ist richtig so (die Kapseln kommen an den
  Stationen an, und die stehen im Dorf), heißt aber, dass der auffälligste Lohn
  des Strangs verpassbar ist.
* **Serie I hat keinen eigenen Reiter.** Sie steht in der Kladde zwischen den
  anderen sechs Serien. Ein eigener Abschnitt für die Röhrenpost wäre lesbarer,
  aber `renderBlaetter()` gruppiert nach Serie und nicht nach Fundweg, und das
  umzubauen ist eine UI-Runde und keine Zeile im Vorbeigehen.
* **Szene 7 bis 9 bleiben offen.** Die Versuchung im Amtsflur, die Zustellung
  als Ausbau von `vorgangPanel()` und der Abspann als Tafelstapel. Das ist SZ4,
  und Szene 8 und 9 existieren dort bereits in Kurzform.
