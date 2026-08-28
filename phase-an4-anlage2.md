# Bauabschnitt AN4: Anlage 2 raus aus der Kette

Der Erstkontakt der Anlage 2 hängt nicht mehr an der Ernennung. Er läuft, wenn
der Spieler selbst vor die Tür tritt. Damit ist der teuerste Leseblock des
Anfangs durchtrennt, und ihr erster Satz stimmt wieder wörtlich.

## Gemessen, vorher gegen nachher

`node tools/intro-pruef.mjs`, alle vier Routen, Exit 0:

| Route | vorher | nachher | |
|---|---:|---:|---|
| **pflicht** | **1967** | **1174** | die Hauptzahl |
| vordruck | 1276 | 1276 | unberührt, siehe unten |
| vielleser | 2332 | 1539 | |
| springer | 917 | 917 | unberührt |

| | vorher | nachher |
|---|---|---|
| Längster Leseblock ohne echte Wahl | **751 Wörter**, 7 Lesestufen, Ernennung bis Anlage 2 | **575 Wörter**, 10 Lesestufen, Szene empfang bis Intro |
| Blöcke des Pflichtwegs, in Stufen | 10 – 7 – 4 | **10 – 6** |
| Lesestufen bis zum freien Schritt | 25 | 19 |
| Erklärstücke vor dem ersten Schritt | 4 | **3** |

Die Wand, die AN4 anfassen sollte, ist weg. Die Wand, die übrig bleibt, ist die
aus AN3 (Empfang plus Chronik), und sie gehört AN6.

## Verschoben ist nicht gekürzt, und der Messlauf sagt es jetzt selbst

**Von den 793 Wörtern, die der Pflichtweg verliert, sind 787 verschoben und 6
gekürzt.** Das ist keine Bescheidenheit, das ist die Zahl.

```
NACHLAUF, hinter dem ersten freien Schritt
    Der erste freie Schritt war        "Hinausgehen"   Aktion 16, im Raum "amt"
    Danach noch zu lesen, Woerter         787   (6 Lesestufen, Anlage 2, Erstkontakt)
    Anfang insgesamt, bis frei im Dorf   1961   VERSCHOBEN ist nicht GEKUERZT
```

`intro-pruef` hörte bisher beim ersten freien Schritt auf. Hätte er das
weiterhin getan, stünde dort eine Ersparnis von 787 Wörtern, die niemand
gespart hat. **Genau diese Falle hat AN3 beim Weltgesetz gestellt** — es war
umgezogen und nicht gelöscht, und der Lauf meldete zwei Orte statt drei. Der
Kommentar, den AN3 an die Stelle geschrieben hat, gilt hier wörtlich: *„Ein
Messlauf, der den Umzug nicht sieht, misst den alten Bauzustand."*

Der Lauf geht den ersten freien Schritt deshalb jetzt **wirklich** — über
`fuehreAktion()`, also über die Taste, die ein Spieler drückt, und nicht über
`verlasseHaus()`. Nebenbei prüft er damit zum ersten Mal am Gerät nach, was AN2
nur im Dokument behauptet hat: das Angebot am ersten freien Schritt ist
`Aktion 16`, „Hinausgehen".

Anlage 2 wird dabei **nicht gekürzt**, und das ist keine Nachlässigkeit. Im Code
steht seit T3: *„Die Einführung ist ‚fundiert und nicht knapp' (Ansage des
Projektinhabers)."* Eine stehende Ansage schneidet man nicht nebenbei weg.

## Der zweite Befund: der Text ging hinaus, der Spieler nicht

Seit AN2 lässt `dienstAntritt()` den Spieler in der Amtsstube stehen — *„Der
Spieler bleibt dabei, wo er ist. DAS ist der erste freie Schritt."* Acht Stellen
gingen diesen Schritt trotzdem vorweg:

| | |
|---|---|
| Ernennung Bl. 5 | „Knöterich bringt Sie zur Tür" |
| Ernennung Bl. 5 | „Er hält Ihnen die Tür auf. Draußen ist es hell …" |
| Ernennung Bl. 6 | „Auf der Schwelle kommt Ihnen ein Mann mit einem Postsack entgegen" |
| Ernennung Bl. 6 | „bis der um die Ecke ist" |
| Anlage 2, Auftakt | „**Sie stehen zum ersten Mal vor dem Haus statt darin.**" |
| Anlage 2, Bl. 2 | „Vor Ihnen liegt das Dorf. Hinter Ihnen fällt die Amtstür ins Schloss" |
| Anlage 2, Bl. 4 | „Am Ende der Straße bleiben Sie stehen" |
| Anlage 2, Bl. 4 | „Die Urkunde geht in die Tasche" |

Auf schwarzem Grund war das harmlos: die Erzählung war der einzige Ort, den es
gab. Seit AN2 steht der Spieler sichtbar im Raum, und der Text nahm ihm etwas
ab, das ihm gehört. **Nachgesucht in `phase-an1`, `phase-an2`, `phase-an3`,
`INTRO-MESSUNG`, `phase-t2`, `phase-t3` und `phase-e2`: der Widerspruch war
nirgends notiert.** AN2 hat ihn in seiner eigenen Ablauftabelle übersprungen.

Die Regel des Masterplans hat hier eine Schwester, und AN3 hat sie an einem
kleineren Fall bereits angewandt (`ANKLOPFEN` → `ZUR SACHE`: *„Angeklopft hat er
nie und kann es auch nicht mehr"*):

> Trägt ein Gegenstand eine Tatsache, darf der Text sie nicht mehr aussprechen.
> — **und: was der Spieler geht, darf der Text nicht mehr gehen.**

**Vier der acht Stellen sind behoben, und zwar durch den Umbau selbst.** Die
Ernennung bleibt jetzt im Raum, also gehen ihre beiden letzten Blätter nicht
mehr hinaus. Die vier Stellen der Anlage 2 mussten dagegen **gar nicht
angefasst werden**: sie standen nur falsch, weil der Stapel am falschen Ort
lief. Seit AN4 läuft er vor dem Haus, und dort sind sie richtig.

**Auf dem Türweg.** Diese Einschränkung gehört dazu, und sie war in der ersten
Fassung dieses Absatzes nicht drin. `ANLAGE2_BLAETTER` ist mit dem Nachholweg
**geteilt**, und dort wird derselbe Stapel aus der Tasche geöffnet, irgendwo im
Dorf und zu irgendeiner Uhrzeit. Nachgemessen statt vermutet, Vordruckweg,
Tasche 860 Pixel von der Amtstür entfernt geöffnet:

| Blatt | sagt | Türweg | Nachholweg |
|---|---|---|---|
| 4 | „Vor Ihnen liegt das Dorf. Hinter Ihnen fällt die Amtstür ins Schloss" | stimmt | **860 px entfernt** |
| 6 | „Am Ende der Straße bleiben Sie stehen" | stimmt | irgendwo |
| 6 | „Es ist kurz nach acht" | stimmt | irgendwann in der Schicht |

**Das ist ein Altbefund aus T3 und keiner von AN4**, und AN4 macht ihn nicht
schlimmer, sondern auf der einen Hälfte besser: vor AN4 stand der Türweg
genauso daneben wie der Nachholweg, seither steht nur noch einer daneben.
Behoben ist er nicht. Er hier zu beheben hieße, geteilten Text für zwei Orte
zugleich richtig zu schreiben, und das ist eine Textentscheidung und kein
Nahtstück. Er steht deshalb unten unter „Offen" und im Code neben den
Blättern.

**Sechs Blätter bleiben sechs Blätter.** Zwei `pruef()`-Zeilen und drei
Dokumente hängen an dieser Zahl; geändert sind vier Zeilen Text, kein Blatt.

**Der Mann mit dem Postsack ist Zusteller Trepp**, und er trägt die Hauptquest
(Weltbibel: *„Er hat den Brief im Sack. Er hatte ihn immer."*). Sein Auftritt
hier ist Vorausdeutung, gebunden war er nie an die Schwelle, sondern an den
Sack; er kreuzt den Raum jetzt, statt in der Tür zu stehen. Sein Name fällt
weiterhin nicht — `AKTE_SPERRE_NAMEN` verbietet ihn für diesen Stapel, und das
ist der Sinn der Sperre und kein Versehen.

## Der Auslöser, und die drei Stellen, an denen er falsch gesessen hätte

Der Erstkontakt hängt an `fuehreAktion()`, Fall `AKT_HAUSAUS` — **nicht** im
Rumpf von `verlasseHaus()`. Das ist keine Geschmacksfrage. Dieselbe Funktion
räumt auch `respawnPlayer()` und `startShift()` den Innenraum weg, und der Pult
in der Amtsstube bietet `AKT_AMT` an: ein Schichtende von drinnen hätte den
Stapel aus einem Reset-Pfad heraus gestartet, ein Tod im Haus ebenso.
`innen-pruef` fährt genau diesen Fall seit IN1.

Getragen wird die Lücke von `kn.flags.anlage2Wartet`, gesetzt am Ende der
Ernennung, **verbraucht vor dem Stapel und nicht in seinem Abschluss**. Wer ihn
erst danach löscht, wiederholt den Erstkontakt bei jedem weiteren Hinausgehen,
sobald ein Spieler den Stapel einmal nicht zu Ende blättert. Der Merker steht im
Spielstand und nicht in einer Modulvariablen, weil zwischen Ernennung und Tür
gespeichert und geladen werden darf.

**Der Vordruckweg ist unberührt**, und die Zahl belegt es: 1276 vorher wie
nachher, Nachlauf 0. Wer „Erst den Vordruck" wählt, sieht die Ernennung nie,
bekommt den Merker also nie, und die Tür bleibt für ihn stumm. Die Nachholung
beim ersten Griff zur Tasche (T3) holt bei ihm alles nach wie bisher.

## Die offene Testerfrage löst sich auf, statt beantwortet zu werden

Seit A0 stand offen, welchen der beiden Wege die Tester gegangen sind. AN3 hat
sie ausdrücklich an AN4 weitergereicht: *„Für AN4 bleibt die Frage offen und
wird dort scharf: Anlage 2 liegt nur auf dem Pflichtweg, die Dienstanweisung nur
auf dem Vordruckweg."*

**Nach AN4 liegt Anlage 2 auf keinem der beiden Wege mehr vor dem ersten freien
Schritt.** Die Asymmetrie, die die Frage scharf gemacht hat, ist weg. Damit ist
die Frage für den Zuschnitt der folgenden Bauabschnitte gegenstandslos — nicht
beantwortet, sondern aufgelöst.

## Was der Masterplan an dieser Stelle anders sagt

Der Masterplan liegt seit diesem Bauabschnitt im Repo (`intro-masterplan.md`).
Er ist damit zum ersten Mal prüfbar, und die Probe fördert eine **Abweichung**
zutage, die hier offen stehen bleibt statt geglättet zu werden:

> | Anlage 2 Erstkontakt | Station im Ablauf | **frühestens Schicht 2, an Bedarf gehängt** |

Gebaut ist stattdessen: **Schicht 1, beim Schritt vor die Tür** (Entscheidung
des Projektinhabers, in der Sitzung zu AN4 getroffen). Was dafür und dagegen
spricht, steht hier, damit die Entscheidung revidierbar bleibt:

* **Dafür:** Ihr erster Satz („Sie stehen zum ersten Mal vor dem Haus statt
  darin") und die Heftklammer an der Urkunde binden sie an genau diesen Moment.
  Sie ist „die halbe Stimme des Spiels" (T3); ein Auslöser an einem Bedarf kann
  lange nicht fallen. Und der gemessene Block ist so oder so durchtrennt.
* **Dagegen:** Der Plan will vier Erklärstücke auf eins reduzieren. AN4 macht
  aus vieren drei, nicht eins.
* **Gemessen, und es schwächt die Begründung des Plans:** Der Plan schiebt sie
  wegen des dreifachen Weltgesetzes nach hinten. Ihr Erstkontakt-Stapel trägt
  das Weltgesetz aber **null Mal** — `intro-pruef` zählt die erreichbaren
  Stellen einzeln, und die dritte ist ihr *Gesprächsbaum* (`baumAnlage2`), nicht
  ihre Einführung. Der Grund, aus dem sie warten sollte, betrifft eine andere
  Stelle als die, die verschoben wurde.

**Der Umbau steht dem späteren Auslöser nicht im Weg.** Alles, was „frühestens
Schicht 2" bräuchte, ist gebaut: die Kette ist getrennt, der Stapel läuft
losgelöst vom Dienstantritt, und der Merker ist da. Zu ändern wäre **eine
Zeile** — wo `anlage2VorDemHaus()` gerufen wird.

## Was die Prüfläufe gelernt haben

`empfang-pruef` ist der einzige Lauf, der die Ernennung wirklich spielt, und er
wäre gestorben: der Klick auf die Wahl der Anlage 2 hätte in ein leeres Panel
gegriffen, `TypeError`, und die zwanzig Prüfungen der Blöcke danach wären nie
gelaufen. Er geht jetzt an beiden Stellen erst vor die Tür, und zwar über
`fuehreAktion()` wie ein Spieler — die übrigen Läufe rufen `verlasseHaus()`
direkt, weil sie nur schnell ins Dorf wollen; dieser hier prüft den Weg selbst
und darf ihn deshalb nicht abkürzen.

**Aus einer Zusage werden dreizehn.** Wo „vor dem Dienst steht noch ein Stapel"
stand, eine einzige `'flex'`-Abfrage, stehen jetzt der Dienstzustand, der Ort,
beide Merker, die Aufschrift und die Art des ersten freien Schritts, und dazu
drei Zusagen, die es vorher nicht geben konnte:

* ein zweiter Gang durch dieselbe Tür wiederholt nichts,
* ein Schichtende aus der Amtsstube heraus löst den Stapel nicht aus (mit
  gesetztem Merker geprüft, sonst wäre die Zusage wertlos),
* auf dem Vordruckweg bleibt die Tür stumm.

`empfang-pruef` steht damit auf **115/115** (war 102).

## Geprüft

| Lauf | |
|---|---|
| `empfang-pruef` | **115/115** (war 102; dreizehn neue Zusagen) |
| `intro-pruef` | alle vier Routen, Exit 0, mit Nachlauf |
| `anlage2-pruef` | 123/123 |
| `szene-pruef` | 50/50 |
| `menue-pruef` | 78/78 |
| `stopfen-pruef` | 43/43 |
| `zulagen-pruef` | 50/50 |
| `versuchung-pruef` | 67/67 |
| `speicher-pruef` | 38/38 |
| `mitteilung-pruef` | 32/32 |
| beide `fehlversuch` | grün |
| `tools/build-single.mjs` | läuft durch, 3486 KB |

Weiterhin nicht grün, unverändert gegenüber dem Stand vor AN4, in allen Fällen
die fehlende Grafik (`assets/cf/` liegt in diesem Klon nicht vor):
`gespraech-pruef` 87/89 (**dreimal von drei dieselben zwei Fehleridentitäten**),
`ebene-pruef` 53/54, `innen-pruef` 16/18 mit Abbruch.

**Berichtigung zur Übergabe:** `szene-pruef` ist mit 50/50 zwar vollständig
bestanden, endet aber auf **Exit 1**, und zwar auch auf `origin/main` — in einem
frischen Arbeitsbaum auf `40ba02a` nachgemessen. Die Ursache sind dieselben
Grafikwarnungen. „Grün" gilt für die Zählung, nicht für den Exit-Code.

**Am Gerät durchgespielt**, Quellbaum und gebaute Einzeldatei, je dreimal:
Ernennung → frei in der Amtsstube (`Aktion 16 „Hinausgehen"`, Merker steht) →
hinaus → Anlage 2 mit sechs Blättern → `anlage2Da` gesetzt, Merker verbraucht →
zweiter Gang durch dieselbe Tür öffnet nichts. **Sechs von sechs identisch, kein
`pageerror`.** Der Build nimmt mit `ASSET_BLOBS` einen anderen Ladeweg als der
Quellbaum, und an dieser Stelle verhält er sich gleich.

## Was AN4 nicht kann

* **Es kürzt nicht.** 787 Wörter sind umgezogen, 6 sind weg. Wer weniger lesen
  will, muss auf AN6 warten oder Anlage 2 anfassen, und Letzteres verbietet eine
  stehende Ansage.
* **Es misst nicht, ob der Schritt vor die Tür als Zäsur wirkt.** Dass er
  angeboten wird, dass er der erste ist und dass der Stapel erst dahinter
  kommt, ist gemessen. Ob ein Spieler dadurch anders liest, ist es nicht. **Das
  ist die Frage für die nächste Rückmeldung.**
* **Das Aussehen ist in diesem Klon nur zur Hälfte beurteilbar**, `assets/cf/`
  fehlt.

## Offen

* **AN5 ist ausgefallen, ohne dass es jemand notiert hat.** Die Reihe lautet
  `A0 → AN1 → AN5 → AN2 → AN3 → AN4 → AN6 → AN7`; gebaut sind AN1, AN2, AN3,
  AN4. Was AN5 ist, steht seit der Ablage des Masterplans im Repo: **die Kladde,
  mit Ungelesen-Zähler und Auffangbecken fürs Überspringen.** Er steht damit
  weiter vor AN6 und ist nicht erledigt.
* **Der Auslöser der Anlage 2** weicht vom Masterplan ab (siehe oben). Eine
  Zeile, wenn er zurück soll.
* **Der Nachholweg sagt drei Dinge, die dort nicht stimmen** (Ort, Ort, Uhrzeit
  — siehe oben, gemessen). Altbefund aus T3, unabhängig von AN4, und die
  Behebung ist eine Textentscheidung: entweder werden die drei Zeilen ortlos
  und zeitlos formuliert, oder der Nachholweg bekommt eigene, so wie er schon
  einen eigenen Auftakt hat.
* **AN6** holt die vier Chronikblätter in die Erstbelehrung nach Akt I. Der
  längste Block gehört jetzt ihm: 575 Wörter auf 10 Lesetafeln, Empfang plus
  Chronik.
* Kaltstart und Titelkarte aus dem Masterplan (Schritte 1 und 2) sind
  unverändert nicht gebaut.
* Die drei Kanon-Entscheidungen des Masterplans stehen weiter offen; AN3s
  vierte (das Weltgesetz hängt an der Wand) ist entschieden und bleibt.
* Ob Nörgel im Anfang dastehen soll, ist weiter eine Zeile in `innenBesetzung`.
