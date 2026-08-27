# Bauabschnitt T8: Die Szenen-Anlässe — ERLEDIGT

An den drei größten Stellen der Weltgeschichte lag Anlage 2 in der Tasche und
sagte nichts.

Seit SZ2 setzt eine Szene, wenn sie zu Ende ist, einen Anlass, und Lott und
Pahl kommentieren ihn von der Bank aus. Kordula Umlauf zieht weiter, Knöterich
sagt nach vierzig Jahren ein einziges Wort, Vorblatt wird auf dem Dorfplatz
Lage für Lage entklammert — und die einzige Figur, die dem Spieler dabei die
ganze Zeit beiliegt, war an allen dreien stumm. T7 hat das ausdrücklich offen
gelassen und angekündigt, es sei „der nächste Abschnitt und nicht dieser". Das
hier ist der nächste Abschnitt.

---

## 1. Der Auftrag, wörtlich

> „die drei Szenen-Anlässe, Bau die stell mir Optionen zur Auswahl. Dann
> bauen."

Also zwei Schritte, und der erste ist keine Höflichkeitsschleife: bei diesen
drei Zeilen ist die *Haltung* die Entscheidung, nicht die Formulierung, und
eine Haltung, die der Bauende allein wählt, steht am Ende als Behauptung im
Code. Vor den Optionen wurden deshalb die drei Szenen gelesen (siehe Abschnitt
2), damit die Auswahl aus dem Material kommt und nicht aus der Fantasie.

---

## 2. Was in den drei Szenen tatsächlich passiert

| Anlass | Szene | Akt | Weg |
|---|---|---|---|
| `umlauf` | Szene 2, „Oben ist eine Stadt" | II | `SZENE_ANLASS` |
| `hintermuehl` | Szene 4, „Knöterichs einer Satz" | IV | `SZENE_ANLASS` |
| `vorblatt` | Szene 6, „Die Entklammerung" | IV | direkt in `vorblattAngekommen()` |

Alle drei fallen **genau einmal pro Spielstand**. Das ist die eine Eigenschaft,
aus der in Abschnitt 3 alles Weitere folgt.

**`umlauf`.** Kordula Umlauf ist die Botin. Vierzehn Türme, ein Aufzug, neun
Stockwerke, der Rest ist Treppe. Sie trägt die Liste, in der steht, dass die
Stelle der Amtsleitung jedes Jahr ausgeschrieben wird und sich seit vierzig
Jahren niemand meldet. Dann muss sie weiter, elf Stellen noch.

**`hintermuehl`.** Knöterich, der Buch führt und nicht vorliest, sagt am Ende
der Szene ein Wort: *Hintermühl.* „Mehr sage ich nicht." Lott auf der Bank:
„Er hat es gesagt." Pahl: „Vierzig Jahre für ein einziges Wort."

**`vorblatt`.** Vorblatt ist zu breit für die Amtstür und wird auf dem
Dorfplatz entklammert, Lage für Lage. Am Ende steht ein schmaler älterer Herr
in Hemdsärmeln, dem es zieht. Er ist der Gegenspieler des vierten Akts.

---

## 3. Die Optionen, und was gewählt wurde

Vorgelegt wurden zwei Fragen: **wie** die Zeilen eintreffen, und **was sie bei
Vorblatt tut**, weil dort die Brandmauer am dünnsten ist.

Gewählt wurde:

* **Zustellung: „Drei geschriebene Paare".** Kein Pool, kein Würfel, je ein
  festes Paar, garantiert zugestellt. Begründung der Option: ein Pool
  existiert, damit Wiederholung nicht auffällt, und hier gibt es keine
  Wiederholung.
* **Vorblatt: „Sie schweigt".** Mit einem eigenen Guard-Zweig, damit die Stille
  eine geprüfte Zusage ist und kein Vergessen.

**Aus beidem zusammen werden zwei Paare, nicht drei.** Die Form ist gewählt,
die Zahl folgt aus der zweiten Antwort. Der Name der ersten Option steht hier
so, wie er vorgelegt wurde; gebaut ist, was beide Antworten zusammen ergeben.

### Was das gegen T7 verschiebt, und warum das in Ordnung ist

T7 hat für diesen Abschnitt eine Vorhersage hinterlassen: die drei Anlässe
seien mit **Rate-Paaren** zu füllen, weil eine Zeile, die vorprescht und
danebentippt, über den Fall gar keine Aussage macht und die T3-Auflage damit
leicht statt schwer zu erfüllen sei.

Gebaut ist das nicht. Die Vorhersage war richtig über das Werkzeug und falsch
über den Ton. Ein Rate-Paar ist die *bequeme* Lösung an dieser Stelle: es
erfüllt die Auflage, indem die Figur nichts sagt und dabei redet. An einem
Goldfund ist das warm. An dem Abend, an dem Knöterich nach vierzig Jahren ein
Wort sagt, wäre es Geschwätz über einer Stille, die das Spiel sich lange
verdient hat. Die gewählte Bauart erfüllt dieselbe Auflage schwerer und
besser: sie sagt etwas Wahres über das **Haus** in dem Moment, in dem die
**Akte** spricht.

Die Rate-Bauart bleibt unangetastet, wo sie hingehört — drei Paare im
Ausbruch-Kanal, unverändert.

---

## 4. Was jetzt da ist

### T8-1. `ANLAGE2_SZENE`, und warum die Tabelle keine Listen enthält

```js
const ANLAGE2_SZENE = {
  umlauf:      {z1:'Umlauf. So heißt auch mein Weg hierher.',
                z2:'Sie läuft ihn. Mich hat man getragen.'},
  hintermuehl: {z1:'Er sagt sonst nur, was er aufschreibt.',
                z2:'Das eben hat er nicht aufgeschrieben.'},
};
```

Ein Anlass bildet auf **ein Objekt** ab und nicht auf eine Liste. Damit ist
„genau ein Paar" strukturell wahr und keine Guard-Regel: ein zweites lässt sich
gar nicht erst hinschreiben. In diesem Kanal steht an keiner Stelle ein
`Math.random()`.

Kein Ruhezähler. Der Zähler aus T7 macht den Ausbruch selten; was einmal im
ganzen Spiel fällt, *ist* selten, und ein Zähler daneben wäre eine zweite
Wahrheit über dieselbe Frage. Er wird von diesem Kanal auch nicht
hochgezählt — er misst, wie lange sie in dem Kanal gefasst war, der ausbrechen
*kann*, und dieser kann es nicht. Der Prüflauf hält das fest.

### T8-2. `z1`/`z2` und nicht `auf`/`zurueck`

Die Form ist dieselbe wie beim Ausbruch: erste Hälfte, zwei Sekunden Pause,
zweite Hälfte an dieselbe Stelle im Band (`a2Nachklapp`, aus T7 unverändert
übernommen). Die *Stimme* ist es nicht — hier fährt niemand hoch und nimmt
nichts zurück. `z1`/`z2` ist die Hausform für ein zweiteiliges Wort und steht
so an jeder Dorffigur. Wer die Felder `auf`/`zurueck` sieht, soll den lauten
Kanal vor sich haben und sonst nichts.

Aus demselben Grund liegt der Zeichendeckel bei **44 auf beiden Hälften**, wie
im Kommentarkanal, und nicht bei 30/40 wie im Ausbruch. Der enge Deckel ist in
T7 eine Zusage über einen Ton gewesen; diese Zeilen haben ihn nicht.

Und aus demselben Grund trägt das Band die Klasse `a2` und **nicht**
`ausbruch`. Vier Kleidungen im Band bleiben vier.

### T8-3. Die Brandmauer an der dünnsten Stelle

Die T3-Auflage steht unverändert: *jede Zeile muss aus dem Haus kommen, nicht
aus der Akte.* Sie ist hier schwerer zu erfüllen als überall sonst, weil diese
vier Zeilen in dem Moment fallen, in dem die Akte selbst spricht.

* **`umlauf`** redet über ihren eigenen Weg durch das Haus, nicht über
  Hochablage, das sie nie gesehen hat. Der Witz trägt sich selbst: *Umlauf* ist
  der Name der Botin und zugleich das Amtswort für das, was eine Anlage tut.
  „Mich hat man getragen" ist Passiv, und das ist ihr grammatischer Zustand.
* **`hintermuehl`** redet über Knöterichs *Gewohnheit*, nicht über das Wort.
  Was Hintermühl ist, weiß sie nicht, und sie tut auch nicht so. Der Satz trägt
  die Szene trotzdem: wer den Mann kennt, versteht, was gerade geschehen ist.

### T8-4. Vorblatt schweigt, und der Guard hält es fest

Bei der Entklammerung wird einem Papier die Klammer gezogen, und Anlage 2 ist
ein Papier mit einer Klammer. Es wäre die naheliegendste Zeile des ganzen
Spiels. Sie fällt trotzdem weg.

Vorblatt ist der Gegenspieler aus Akt IV. Jeder Satz, den sie über ihn sagt,
ist ein Satz über den Fall, und den hat sie nicht. Ihr Schweigen ist an dieser
Stelle die stärkere Aussage: ein Blatt sagt nichts, wenn ein Blatt aufgemacht
wird.

Damit das keine Absichtserklärung in einem Dokument bleibt, steht es als
eigener Zweig in `anlage2Assert()`, in derselben Bauart wie `niederlage` im
Ausbruch:

```
Bei der Entklammerung schweigt sie, hier steht trotzdem eine Zeile
```

Und die Gegenrichtung dazu, denn ohne sie bewiese der Zweig nichts: **jede
andere** Szene, die einen Anlass setzt, muss ihre Zeile haben. Sonst wäre die
Stille bei Vorblatt nicht von der Stille zu unterscheiden, die entsteht, wenn
jemand eine Szene dazubaut und die Zeile vergisst.

Die Konsolenzeile nennt beides in einer Zahl:

```
T3 Anlage 2: … 11 Ausbrüche (3 geraten), 2 von 3 Szenen-Anlässen, Brandmauer in Ordnung.
```

Eine 3 an dieser Stelle wäre die Meldung, dass die Entscheidung geräuschlos
zurückgenommen wurde.

### T8-5. Der Chor auf der Bank bleibt unberührt

`szeneEnde()` setzt `letzterAnlass`, **bevor** es Anlage 2 fragt. Damit ist ihr
Schweigen ihres: Lott und Pahl bekommen ihren Anlass auch dann, wenn der Regler
auf „Schweigt" steht, wenn Anlage 2 gar nicht in der Tasche liegt, und
natürlich bei Vorblatt. Drei Zusagen im Prüflauf halten das fest.

`anlage2Szene()` setzt `letzterAnlass` deshalb **nicht** — ein zweiter Setzer
wäre eine zweite Wahrheit über dieselbe Größe.

---

## 5. Zwei Funde

### Fund 1: Die Sperre hätte die Zeilen verschluckt

`knLineErlaubt()` verlangt seit jeher vierzig Sekunden Abstand zur letzten
Bandzeile. Das ist für einen Weltkommentar richtig und für diese vier Zeilen
tödlich, und zwar aus einem Grund, den man beim Bauen nicht sieht:

**`gameT` steht während einer Szene still.** `update()` kehrt bei
`state !== 'play'` um, und zwar in der Zeile *vor* `gameT += dt`. Der Abstand
trägt also über die gesamte Szene hinweg. Wer kurz vor dem Gespräch eine
Bandzeile hatte — und wer eine Figur anspricht, hat vorher gespielt —, verlöre
die einmalige Szenenzeile lautlos. Kein Fehler, keine Meldung, die Zeile fällt
einfach nie.

Behoben mit einem zweiten Parameter, der **genau eine** der Bedingungen aufhebt
und keine der übrigen:

```js
function knLineErlaubt(anlass, ohneSperre){
  …
  if(!ohneSperre && gameT - knLastRandnotizT < 40) return false;
```

Der Regler bleibt ausdrücklich in Kraft. Eine Zeile, die sich über die
Einstellung hinwegsetzt, weil sie sich selbst für wichtig hält, ist genau die
Sorte, die man abstellen wollte. Der Prüflauf fährt beide Seiten: die
Szenenzeile fällt bei scharfer Sperre, und der Kommentarkanal bleibt derweil
gesperrt. Der zweite Weg ist einer, kein Loch.

### Fund 2: `ANLASS_QUELLEN` stand seit SZ3 unbewacht

Über der Liste steht seit SZ3 dieser Kommentar:

> `SZENE_ANLASS` die aus den Szenen; weil letzteres erst weit unten steht,
> stehen seine Werte hier als Liste und werden **dort gegengeprüft**.

Gegengeprüft wurde nichts. Es gab keinen einzigen Vergleich zwischen
`ANLASS_QUELLEN` und dem, was die Szenen wirklich setzen — die Liste stand seit
zwei Bauabschnitten handgepflegt da, mit einem Kommentar, der eine Prüfung
behauptet hat.

Aufgefallen ist es hier, weil T8-4 die Liste als **Quelle** liest: ein Guard,
der sich auf eine handgepflegte Liste stützt, erbt deren Fehler und meldet sie
als seine eigene Wahrheit. Der Zweig „eine Szene endet, und sie sagt nichts
dazu" wäre für einen Anlass, der versehentlich aus `ANLASS_QUELLEN` gefallen
ist, stumm geblieben.

Beide Richtungen laufen jetzt (`anlage2Assert()`, Block 2e). Der Sonderfall
`vorblatt` setzt seinen Anlass nicht über `SZENE_ANLASS`, sondern direkt in
`vorblattAngekommen()`; gelesen wird das aus dem Quelltext, wie `szeneAssert()`
es bei den Merkern seit SZ2 tut.

---

## 6. Guards

Neu in `anlage2Assert()`:

| Block | Zusage |
|---|---|
| (1) | Die Brandmauer läuft über **beide Hälften** beider Szenenzeilen |
| (2b) | Ein Ausbruch auf einem Szenen-Anlass wird als solcher gemeldet, nicht mehr als „Anlass, den es nicht gibt" |
| (2d) | Szenenzeile nur an Szenen-Anlässen; Paar statt Liste; `z1` und `z2` vorhanden; kein Zusatzfeld |
| (2d) | **Bei der Entklammerung schweigt sie** |
| (2d) | Jede andere Szene mit Anlass hat ihre Zeile |
| (2e) | `ANLASS_QUELLEN` gegen die Szenen, in beide Richtungen |

In `knAssertCaps()`: Deckel 44 auf beiden Hälften, danach die sechs
Textprüfungen (kein `undefined`, kein Gedankenstrich, kein Emoji, keine
Kesselgrammatik, kein Kaiser im Präteritum, keine Abkürzung ohne Eintrag).

### Das Protokoll: dreizehn neue Zweige, einmal ausgelöst und wieder still

Hausbrauch seit T1: ein Guard, den man nie hat melden sehen, ist eine
Behauptung. `tools/anlage2-fehlversuch.mjs` wächst von zwölf auf **25 Zweige**,
und jeder wird zweimal gemessen — dass er meldet, und dass er nach dem
Zurücksetzen wieder schweigt. Das zweite ist das wichtigere: ein Guard, der
nach einer Probe weiter meldet, hält einen Zustand fest, den es nicht mehr
gibt, und färbt jede spätere Probe ein.

```
ok  Szenenzeile an einem fremden Anlass          Eine Szenenzeile wartet auf einen Anlass, den keine Szene setzt
ok  Eine Zeile bei der Entklammerung             Bei der Entklammerung schweigt sie, hier steht trotzdem eine Zeile
ok  Ein Ausbruch auf einem Szenen-Anlass         Ein Ausbruch steht auf einem Szenen-Anlass, dort liefert der stille Kanal
ok  Eine Szene ohne ihre Zeile                   Eine Szene endet, und sie sagt nichts dazu
ok  Ein Szenen-Anlass mit einer Liste            Eine Zeile hat gar keinen Text
ok  Szenenzeile ohne Text                        Eine Szenenzeile hat keinen Text
ok  Szenenzeile ohne zweite Hälfte               Eine Zeile hat gar keinen Text
ok  Szenenzeile mit einem Feld, das es nicht gibt  Eine Szenenzeile trägt ein Feld, das es nicht gibt
ok  Szenenzeile mit einem Wort aus der Akte      Brandmauer verletzt, sie weiß das nicht
ok  Szenenzeile über dem Deckel                  Zeichendeckel verletzt: … 50 > 44
ok  ANLASS_QUELLEN führt einen Anlass zu viel    ANLASS_QUELLEN führt einen Anlass, den keine Szene setzt
ok  Eine Szene setzt einen unbekannten Anlass    Eine Szene setzt einen Anlass, den ANLASS_QUELLEN nicht führt
ok  Die Entklammerung setzt keinen Anlass mehr   … der Chor auf der Bank verstummt

25 von 25 Zweigen melden und schweigen danach wieder.
```

Zwei davon sind Nachlese zu T7 und verdienen eine Zeile: **„Szenenzeile ohne
zweite Hälfte" und „Ein Szenen-Anlass mit einer Liste" melden beide zuerst
`Eine Zeile hat gar keinen Text`.** Das ist der Typcheck, den T7 in die
Brandmauer-Schleife eingezogen hat, nachdem sie dort abgestürzt war statt zu
melden. Er trägt jetzt auf einer Quelle, die es damals noch nicht gab.

---

## 7. Abnahme

Alle Läufe mit Playwright gegen `python3 serve.py` auf Port 8378. Nichts
behauptet, alles gefahren.

| Lauf | Vorher | Nachher |
|---|---|---|
| `tools/anlage2-pruef.mjs` | 92 von 92 | **123 von 123** (31 neue Zusagen) |
| `tools/anlage2-fehlversuch.mjs` | 12 von 12 | **25 von 25** Zweigen |
| `tools/ton-messlauf.mjs` | 2091 Zeilen Figurenrede | 2095 Zeilen, Szenenkanal neu erfasst |
| `tools/szene-pruef.mjs` | 49 von 49 | 49 von 49 |
| `tools/empfang-pruef.mjs` | 96 von 96 | 96 von 96 |
| `tools/menue-pruef.mjs` | 78 von 78 | 78 von 78 |
| `tools/speicher-pruef.mjs` | 38 von 38 | 38 von 38 |
| `tools/mitteilung-pruef.mjs` | 32 von 32 | 32 von 32 |
| `tools/gespraech-pruef.mjs` | 87 von 89 | 87 von 89, siehe unten |
| `tools/innen-pruef.mjs` | bricht ab | bricht ab, siehe unten |

Konsole beim Start still.

Alle Zahlen sind **nach dem Rebase auf IN1** gefahren (`d3fae73`, „drei Türen
gehen auf", rund 2600 neue Zeilen in derselben Datei). `index.html` hat sich
dabei ohne Konflikt zusammengefügt, und das ist noch keine Aussage darüber, ob
es läuft — deshalb ist die ganze Abnahme danach ein zweites Mal gelaufen.

Dasselbe noch einmal beim Nachziehen des Kammerausgangs (`dcd98d1` und
`430b7cb`): `index.html` automatisch zusammengefügt, README von Hand, danach
alles wieder gefahren. Zusätzlich der Messlauf aus dem neuen Abschnitt
(`kammerausgang-messlauf.mjs`, „Alles in Ordnung") und `ebene-pruef.mjs`, weil
beide an der Kammer hängen. Letzterer steht bei 53 von 54 mit `die Leiter ist
geladen` — derselbe fehlende Blattstand aus `assets/cf/` wie unten, bekannt
seit T3, Abschnitt 9.

**Zwei Rotstände, und beide gehören der Umgebung und nicht dem Code.**
Gemessen statt vermutet, jeweils mit weggelegter Änderung im selben
Verzeichnis:

* `gespraech-pruef.mjs` meldet `das zweite Portraet ist gezeichnet` und
  `Noergel steht auf dem Blatt der Gruenhaut`. Beide stehen ohne diesen
  Abschnitt identisch da.
* `innen-pruef.mjs` bricht mit `Cannot read properties of undefined (reading
  'img')` ab — auf `d3fae73` ohne diesen Abschnitt mit demselben Fehler an
  derselben Stelle.

Ursache ist in beiden Fällen dieselbe: `assets/cf/` liegt per `.gitignore`
außerhalb des Repos, weil die Cute-Fantasy-Lizenz die Weitergabe verbietet.
`assets/cf/enemies/` und `assets/cf/innen/` fehlen in dieser Arbeitskopie
schlicht. Wer die Blätter hat, fährt beide Läufe grün.

### Der Ende-zu-Ende-Beleg

Der Prüflauf ruft `szeneEnde()` nicht nur direkt auf (das ist wörtlich, was die
letzte Antwort der Szene tut), sondern **spielt Szene 2 einmal ganz**: Akt II
erzwingen, Umlauf über `gespraechOeffnen()` wirklich ansprechen, die Tafel
wirklich durchklicken. Das ist nicht dieselbe Zusage, und der Unterschied ist
genau die Stelle, an der dieser Abschnitt hätte schiefgehen können.

`szeneAus()` gibt `state` von `'szene'` an `'play'` zurück, und
`knLineErlaubt()` prüft darauf. Wer den Aufruf in `szeneEnde()` **eine Zeile zu
früh** setzt, bekommt einen Kanal, der beim direkten Aufruf tadellos
funktioniert und im Spiel nie etwas sagt. Der Gegenbeweis steht daneben:
während die Szene läuft, schweigt der Kanal. Ohne diese Zeile bewiese der
Durchlauf nur, dass es irgendwann funktioniert, und nicht, dass die
Reihenfolge stimmt.

### Der Ton, gemessen

`ton-messlauf.mjs` führt den Kanal seit T8 als eigene Quelle. Er ist die
einzige der fünf Quellen dieser Figur, die im Zielband liegt statt darunter:

| Quelle | Zeilen | amtlich | knapp am Deckel |
|---|---|---|---|
| Anlage 2, Band | 60 | 10 % (TIEF) | 62 % |
| Anlage 2, Ausbruch | 22 | 0 % (TIEF) | 82 % |
| **Anlage 2, Szenen** | **4** | **25 % (ok)** | **0 %** |
| Anlage 2, Umschlag | 14 | 14 % (TIEF) | 43 % |
| Anlage 2, Bewegung | 10 | 20 % (TIEF) | 40 % |

Beide Zahlen sagen etwas, und beide sind so gewollt.

Die **25 Prozent** sind eine einzige Zeile, und das Amtswort darin ist
*Umlauf* — also genau das Wortspiel, auf dem die Zeile steht. Der Amtston
kehrt an dieser Stelle zurück, weil der Moment amtlich ist, und nicht, weil die
Figur zurückgekippt wäre.

Die **0 Prozent am Deckel** sind der Gegensatz zum Ausbruch, der mit 82 Prozent
hart an seinen 30 Zeichen liegt. Keine der vier Szenenzeilen ist gequetscht.
Die Länge ist gewählt, nicht übrig geblieben.

An der Gesamtquote ändert der Kanal nichts: 2091 auf 2095 Zeilen, 12 Prozent
vorher wie nachher.

---

## 8. Was offen bleibt

**Vorblatt bleibt stumm, und das bleibt so.** Nicht als Rest, sondern als
Zusage mit einem Guard darunter. Wer sie zurücknehmen will, nimmt sie an einer
Stelle zurück, an der die Konsole widerspricht.

**Die Zöllnerin am Schichttor** liegt weiter fertig in
`robin-williams-designstudie-rollen.md`, Teil 2, Abschnitt 5. Der Preis pro
Pointe bleibt für Anlage 2 abgelehnt, aus dem Grund, den T7 geschärft hat: ein
Verdachtsbalken an einer Figur, deren ganzes Elend darin besteht, ungelesen zu
sein, würde das Zuhören zur Ressource machen.

**Der Umschlag ist voll.** Vierzehn Zeilen, und der Guard lässt genau bis
vierzehn zu. T7 hat ihn noch mit „dreizehn Zeilen, der Guard lässt bis
vierzehn zu" als offenen Platz geführt; das stimmt nicht mehr. Wer eine
fünfzehnte will, hebt zuerst die Grenze und begründet sie.

**Szene 3 hat weiterhin keinen Nachklang**, und das ist die Entscheidung aus
SZ2, unverändert: die Weltgeschichte gibt Lott und Pahl dort keinen Einwurf,
und einen zu erfinden wäre Füllmaterial an der stillsten Stelle des Spiels. Was
für den Chor gilt, gilt für Anlage 2 erst recht.
