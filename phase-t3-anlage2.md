# Bauabschnitt T3: Anlage 2, der Sidekick — OFFEN

Das erste Stück dieses Spiels, das mitläuft statt dazustehen.

T1 hat den Figuren ihre Länge gegeben, T2 dem Spieler seinen Titel. Beides waren
Korrekturen an dem, was schon da war. T3 legt zum ersten Mal seit W11 eine Figur
dazu, und es ist keine Person: ein Schriftstück, das seit Jahrzehnten jedem
wichtigen Vorgang dieses Hauses pflichtgemäß beigefügt wird und das noch nie
jemand gelesen hat.

---

## 1. Der Auftrag, wörtlich

Die Idee kam als Frage und ohne Antwort:

> „Könnten wir einen sidekick der immer dabei ist der die Welt erklärt
> (Beleidigungen und Gags) auch ingame? Mir fällt nur nichts ad hoc ein. Ein
> sprechendes Tier? Oder Gegenstand? Was passt da zu dieser Welt was sich
> richtig gut auskennt? Die Insider checkt? Und „unbemerkt" mir läuft? Wir
> können den Sidekick ja als erstes gescriptet dann über den Weg laufen lassen.
> Nur eben was? N Überbleibsel vom Vorgänger?"

Die Annahme des Vorschlags kam mit allen Festlegungen auf einmal:

> „Ja Anlage 2. super. Wir müssen sie fundiert und nicht knapp einführen. Es
> wird die sarkastische Version von Genie (aus Aladdin) und trotzdem nicht fies
> sondern schrullig liebenswürdig. Meinst wir könnten dann die Kommentare von
> Knöterich zurückfahren oder streichen und dafür Anlage 2 an den Platz treten
> lassen? Was definitiv passiert Anlage 2 ist ein festes nicht entfernbares item
> im Rucksack. Und wenn man es bewegen will gibt's n Spruch. Gern mehrere bei
> jedem neuen Versuch. Wenn du ein Icon und profilbild brauchst sag Bescheid.
> Evtl haben wir ja schon was. **Das ist das missing piece damit das Spiel
> liebenswürdig wird.**"

Der letzte Satz ist der Maßstab dieses Abschnitts, und er ist an keiner Stelle
eine Frage der Mechanik.

---

## 2. Warum die Zwei, und warum sie schon da war

Der Platz für diese Figur stand seit E1 leer, und niemand hatte ihn gesehen.

* **Anlage 1 liegt nicht vor.** Der Satz steht auf dem Einstellungsvordruck, seit
  W8, und ist seit E1 die Pointe des ganzen ersten Akts.
* **Anlage 3** ist der Kater der Registratorin. Er schläft auf genau der Akte,
  die man braucht. Immer.
* **Anlage 2 gab es im gesamten Kanon nicht.** Kein einziger Treffer, in keiner
  Datei, auf keinem Zweig.

Zwischen einer Pointe und einem Kater lag eine Lücke, die aussah wie ein
Versehen, und sie hatte genau die Form dieser Figur. Anlage 1 liegt nicht vor,
Anlage 3 schläft auf der Akte, und Anlage 2 läuft mit dem Spieler.

**Was sie ist.** Eine Beilage. Mit Heftklammer. Sie hing am Einstellungsvordruck,
am Haushaltsplan, an vierzig Dienstberichten, an elf Anträgen auf ein Dorffest
und zuletzt an der Ernennungsurkunde des Spielers. Gelesen hat sie in all den
Jahren niemand.

Daraus folgt jede Eigenschaft, die sie braucht, und keine davon musste erfunden
werden:

| Woraus | Folgt |
|---|---|
| Sie lag bei allem dabei | Sie kennt das Haus, die Leute, die Verfahren und jede Peinlichkeit der letzten vierzig Jahre |
| Sie wurde nie gelesen | Der Sarkasmus. Er trifft Verfahren und Zustände, nie einen Menschen |
| Sie war **beigefügt, nicht eingeweiht** | Die Brandmauer. Sie kann die Welt erklären und die Geschichte nicht verraten |
| Der Spieler liest sie als Erster | Der warme Kern. Deshalb bleibt sie, und deshalb ist ihre Dauerbelehrung Zuneigung |
| Was geklammert ist, ist geklammert | Sie ist nicht entfernbar, und zwar als Weltlogik statt als Sperre |

**Die Brandmauer ist die wichtigste Eigenschaft der Figur.** Ein Begleiter, der
alles weiß, nimmt fünf Akte vorweg; ein Begleiter, der nichts weiß, ist Deko.
„Beigefügt, nicht eingeweiht" löst beides auf einmal: sie war bei allem dabei
und in nichts drin. Der Unterschied zu Knöterich ist dabei genau eine Drehung:
**er darf nicht sagen, was er weiß, sie weiß nicht, was sie nicht gehört hat.**

**Und der stille Nachbar.** Sie steht in Weltbibel Kapitel 8 unmittelbar hinter
Fürst Nachtrag, und das ist kein Platzproblem. Er ist „der Teil, der angehängt
und nie gelesen wurde", und er schickt seit vierhundert Jahren Portale. Sie ist
dasselbe und geht mit. Das Spiel spricht es nirgends aus.

---

## 3. Drei Entscheidungen des Projektinhabers

Vorgelegt als Auswahl, hier mit dem Ergebnis.

**Die Basis.** T3 hängt hart an der Ernennungsurkunde aus T2, und T2 lag als
ungemergter Entwurf in PR #61. Auf Ansage („1a aber du mergest") ist #61 zuerst
als Merge-Commit nach `main` gegangen, und T3 baut darauf auf.

**Icon und Profilbild.** Im Grafikbestand liegt kein Blatt und keine Heftklammer.
Nachgesehen wurde nicht nur im kuratierten Bestand, sondern in allen 624 Zellen
von `UI_Icons.png`: der Umschlag ist als `ico_brief` vergeben, die vier Bücher
sind Amtskunde, Kladde, Personalakte und Akten. Also beides: ein Bildprompt als
Nummer 21 in `figuren-bildprompts.md`, und bis das Motiv daraus vorliegt ein
selbst gezeichneter Platzhalter aus `tools/anlage2-portraet.py`.

Das Porträt ist bei ihr keine Zierde. Die übrigen fünfzehn Figuren haben einen
Sprite in der Welt, auf den `gespraechPortrait()` zurückfällt, wenn die Datei
fehlt. Anlage 2 hat keinen: sie ist ein Schriftstück und läuft nicht im Dorf
herum. Ohne Datei bliebe ihr Porträtfeld schwarz.

**Die Knöterich-Frage**, und sie war die interessanteste. Der Auftrag fragte, ob
seine Kommentare zurückgefahren oder gestrichen werden. Beim Nachlesen stellte
sich heraus, dass die Frage anders gestellt werden musste:

> **Keine einzige der achtundzwanzig Randnotiz-Zeilen erklärt eine Taste.**

Sie kommentieren einen Treffer, einen Fund, einen Fluch, einen Stillstand. Das
ist Welt, nicht Gerät, und der Kanon sagt seit W11 einen harten Satz dazu:
*Knöterich erklärt Tasten, nie Zusammenhänge.* Sein Bedienungskanal ist ein
anderer und war nie betroffen. Die Empfehlung lautete deshalb: alle sieben
Anlässe wandern geschlossen, und Knöterich behält alles, was Bedienung ist. So
entschieden.

| Bleibt bei Knöterich | Wandert zu Anlage 2 |
|---|---|
| `HINWEISE`, zwölf Dienstzettel, jeder mit genau einer Taste | `crit`, `ultimate`, `levelup` |
| `ESCALATE_DEFS`, sechs zweite Stufen | `fluch`, `goldfund` |
| Die drei Beats, `knStuckCandidate()`, `knBegruessungLine()` | `kammerAbbruch`, `untaetigkeit` |
| `KN_TRAENKE_GAGS` | |

Die Zeilen sind neu geschrieben und nicht umgehängt. Dieselbe Lage, andere
Figur: wo Knöterich „Vermerkt." sagte, weil er Buch führt, sagt Anlage 2 etwas,
das auf sich selbst verweist, weil sie eine Beilage ist.

---

## 4. Was jetzt da ist

### T3-1. Die Lunte in der Urkunde

`ERNENNUNG_URKUNDE()` hat eine vierzehnte Zeile bekommen, ganz unten, hinter dem
Siegelvermerk:

> Anlagen: eine.

Zwirn liest jede Zeile dieser Urkunde laut vor, auch diese. Es ist die einzige
Ankündigung, die Anlage 2 im ganzen Spiel bekommt, und wer sie überliest, macht
alles richtig: genau darum geht es bei dieser Figur.

### T3-2. Das erste Treffen, fünf Blätter

Ein eigener Tafelstapel zwischen `HINAUSGEHEN` und dem ersten Schritt ins Dorf.
Kein angehängtes siebtes Blatt der Ernennung: die gehört dem Haus und endet mit
dem Hinausgehen.

Die Blätter tun je eine Sache, und die Reihenfolge ist der ganze Bogen:

1. **Sie ist da.** Draußen raschelt etwas an der Urkunde. „Guten Morgen. Bitte
   nicht erschrecken, ich bin ordnungsgemäß beigefügt."
2. **Was eine Anlage ist.** „Die Hauptsache wird gelesen. Die Anlage wird
   beigefügt. Das sind zwei verschiedene Tätigkeiten, und die zweite ist mit
   Abstand die häufigere." Und danach, ohne Pause: *Gelesen hat mich niemand.*
3. **Was sie kann.** Vierzig Jahre Haushaltspläne, Dienstberichte, elf Anträge
   auf ein Dorffest. Sie wechselt mitten im Absatz den Ton und entschuldigt sich
   dafür: „Das nimmt man an, wenn man lange genug danebenliegt."
4. **Was sie nicht weiß.** Die Brandmauer, als Figurenzug statt als Regel:
   „Beigefügt heißt beigefügt. Nicht eingeweiht. Worum es in diesem Haus
   eigentlich geht, weiß ich nicht. Das ist keine Verschwiegenheit. Das ist mein
   Berufsstand."
5. **Warum sie bleibt.** Der Spieler sieht das Blatt zum ersten Mal richtig an.

   > **Sie lesen gerade.**
   >
   > Verzeihung. Das war eine Feststellung, keine Beschwerde. Es ist nur das
   > erste Mal, und ich war darauf nicht vorbereitet.

   Danach begründet sie ihr Bleiben mit der Heftklammer, und das stimmt sogar.
   Der Knopf heißt `EINSTECKEN`.

Das läuft unter der Formregel **„Der Anfang erzählt"** (Kapitel 13, seit T2):
freier Panel-Text, kein Zeichendeckel. Zwei Dinge gelten dort unverändert
weiter, und das eine ist hier die Figur selbst: die Wortsperre. Der Stapel läuft
in `szeneAssert()` gegen die **volle** `AKTE_SPERRE` und nicht nur gegen die
Namensliste, denn die Brandmauer verbietet genau das, was diese zwölf Wörter
benennen.

### T3-3. Die Nachholung, und warum sie sein muss

`Erst den Vordruck` umgeht die Ernennung. Wer diesen Weg nimmt, hätte Anlage 2
nie getroffen, und ein Spieler ohne sie ist ein Spiel ohne die Hälfte seiner
Stimme. Dasselbe gilt für jeden Spielstand, der älter ist als dieser Abschnitt.

Beide holen es beim ersten Griff zur Tasche nach, mit einem anderen ersten Blatt
und danach demselben Stapel. Das ist keine Notlösung: **eine Anlage, die man
beim Aufräumen findet, ist genau die Art, wie man eine Anlage findet.**

### T3-4. Das feste Item

Sie liegt als Kachel im Rucksack, vor den vierundzwanzig Fächern, und gehört zu
keinem. Der Zähler sagt weiter „0 von 24 Fächern belegt", und das ist wahr: sie
liegt nicht in der Tasche, sie hängt an der Urkunde, die darin liegt.

Technisch ist das die billigste Fassung und zugleich die richtige. Ein echtes
`player.bag`-Item hätte fünf Entscheidungen gekostet (Klemmung in
`itemGeklemmt()`, ein Fach weniger, `unequipItem()`s Suche nach dem ersten
freien Platz, der Fall beim Tod, die Spielstand-Migration) und keinen einzigen
Gewinn gebracht. Die Wahrheit steht in einem Merker, `kn.flags.anlage2Da`, und
der ist additiv gemergt und damit migrationsfrei.

### T3-5. Die Sprüche, der Reihe nach

Zehn Stück, und sie sind eine **Reihe** und kein Pool. Der Auftrag sagt „Gern
mehrere bei jedem neuen Versuch", der Kanon sagt „die Reihe darf vertrauter
werden, nicht schärfer", und beides zusammen heißt: die Liste ist ein Bogen.

> 1. Das ist eine Heftklammer. Kein Vorschlag.
> 2. Ich bin beigefügt. Das ist ein Zustand.
> 3. Ausheften wäre ein Antrag. An wen denn?
> […]
> 8. Das ist jetzt schon fast ein Ritual.
> 9. Ich weiß. Ich wäre auch neugierig.
> 10. **Sie sind der Erste, der es versucht.**

Wer sie durchhat, bekommt die letzten drei im Kreis. Auch das ist Absicht: der
amtliche Anfang wäre beim zweiten Durchlauf ein Rückschritt in der Vertrautheit,
und vertrauter heißt nicht wieder fremder. Der Zähler steht persistiert in
`kn.counters`, damit die Reihe nicht jeden Morgen von vorne anfängt.

Der Spruch erscheint **in der Kachel** und nicht im Randband. Das Band liegt
hinter dem offenen Rucksack; wer zieht, soll dort lesen, wo er gezogen hat.

### T3-6. Der Kommentarkanal, und ein Band mit zwei Stimmen

`ANLAGE2_NOTIZ` steht, wo bis T2 `RANDNOTIZ` stand, mit denselben sieben
Anlass-Schlüsseln. Das ist wichtiger, als es aussieht: die Bank hängt mit ihren
eigenen Pools an genau diesen Schlüsseln, und `letzterAnlass` wird weiter
gesetzt. Der Kanal hat den Sprecher gewechselt, nicht die Verdrahtung. Ohne
diese Zeile wäre der Chor auf der Bank verstummt und der Langvorgang Hintermühl
hängengeblieben (GW4).

Neu ist, dass ein Eintrag ein **Gate** tragen darf, aus derselben Tabelle, die
schon die Zusatzblöcke der Dorffiguren öffnet:

```js
levelup: ['Eine Stufe. Kein Titel. Siehe Laufbahn.',
          …
          {z:'Jetzt haben Sie sogar einen Titel dafür.', abRang:1}],
```

Die gegateten Zeilen sind durchweg die wärmeren. Das ist der Bogen der Figur
über das ganze Spiel, ohne ein zweites System dafür.

**Ein Band, zwei Stimmen.** `#knRandnotiz` bleibt, was es war, und trägt seit T3
eine Klasse mehr. Es ist eine Fläche und keine Liste: zwei Zeilen gleichzeitig
gibt es nicht, und zwei übereinandergestapelte Bänder wären ein zweites System
für dieselbe Sache. Unterschieden wird am Zeichen davor und an der Farbe.

| | Knöterich | Anlage 2 |
|---|---|---|
| Marke | `§`, Amtsgold, schräg gestellt | `*`, Papierfarbe, gerade |
| Rand | Amtsgold | Papierfarbe |
| Spricht über | das Gerät | die Welt |

**Der Tonregler heißt jetzt nach dem Haus** statt nach Knöterich, weil er beide
Stimmen steuert. Die drei Stellungen bedeuten unverändert dasselbe, nur genauer:
Gesprächig ist alles, Dienstlich ist nur das Dienstliche, Schweigt ist nichts.
Anlage 2 kommentiert die Welt und ist damit nie dienstlich.

### T3-7. Ansprechbar in der Tasche

Ein Klick auf die Kachel schließt den Rucksack und öffnet `SZENEN.baumAnlage2`.
Derselbe Baum wie die dreizehn aus F1, mit zwei Unterschieden, die beide daher
kommen, dass sie kein Mensch im Dorf ist:

* **Kein `figur:`.** Das Feld hängt einen Baum an eine Dorffigur und damit an die
  F-Taste. Anlage 2 steht nirgends herum.
* **Kein `wenn:`.** Die übrigen Bäume öffnen sich nach Schichten, weil eine
  Lebensgeschichte Vertrauen braucht. Anlage 2 redet ab der ersten Minute, das
  ist ihr Zweck. Ihre Staffelung liegt im Kommentarkanal.

Sieben Fragen, zwei Kaskaden, und alles darin ist Haus, Leute und Verfahren.
Der Ausgang nach der tiefsten Frage ist die einzige Stelle, an der sie über sich
selbst spricht, und sie tut es in der Form, die ihr gehört, als formlose Bitte:

> Sehen Sie ab und zu nach, ob ich noch da bin. Mehr nicht. Es genügt völlig.

### T3-8. Kein eigenes Kürzel, und warum das die bessere Pointe ist

Der Auftrag ließ offen, ob Anlage 2 Amtskürzel benutzt. Die Abkürzungstabelle in
`figuren-leben.md` steht auf **zwölf, mehr nicht**, und ein dreizehntes hätte
diese Zusage gebrochen.

Der Verzicht ist der bessere Gag und passt zur Figur: abgekürzt wird nach
Kapitel 13, was nicht wichtig genug ist, um ausgeschrieben zu werden. **Wer
möchte, dass man ihn liest, kürzt nichts ab.** Anlage 2 schreibt deshalb alles
aus, auch „siehe oben".

---

## 5. Die Reichspapier-Pointe, gehoben und nicht ausgesprochen

Der W11-Zuwachs sagt: **Anlage** ist im Reich ein Aktenhausname, und eine Nummer
dahinter ist in Hochablage die Schreibweise für ein nachgeordnetes
Familienmitglied. Auf Reichspapier gelesen ist der Kater der dritte Sohn eines
Adelshauses.

Dieselbe Lesart macht Anlage 2 zum zweiten Kind desselben Hauses und damit zur
älteren Schwester des Katers. Der Zuwachs steht in der Weltbibel und in
`figuren-leben.md`.

**Im Spiel wird er nie aufgelöst**, und das ist keine Vorsicht, sondern eine
bestehende Zusage: „Aufgelöst wird das nie" steht seit F1 beim Kater. Sichtbar
wird höchstens das Verhalten. Sie nennt ihn einmal „den Dritten" und erklärt es
nicht.

---

## 6. Guards

`anlage2Assert()`, Bauform wie `zulagenAssert()` und `wiederAssert()`. Wirft nie,
meldet nur. Er prüft acht Dinge, und das erste ist das wichtigste.

| Nr | Was er nachhält |
|---|---|
| 1 | **Die Brandmauer.** Jede Zeile, die Anlage 2 sagt oder trägt, gegen die volle `AKTE_SPERRE`. Auch die Bewegungssprüche und der Tooltip, die in keiner Szene stehen |
| 2 | Jeder Anlass hat mindestens vier Zeilen **ohne** Gate, sonst wäre der Pool in der ersten Schicht leer |
| 3 | Jede gegatete Zeile nennt genau einen Schalter, den es in `ZUSATZ_SCHALTER` gibt, mit einem Wert, den dessen eigene Prüfung durchlässt |
| 4 | Die Anlass-Schlüssel sind dieselben, die auch gerufen werden, in beide Richtungen |
| 5 | Die Bewegungsreihe trägt genug Einträge für den Ringschluss und keinen doppelt |
| 6 | Merker und Zähler stehen in der Vorgabe, sonst wären sie nach dem ersten Laden weg |
| 7 | Beide Auftakte führen in einen Stapel mit Tafelform, und Anlage 2 spricht darin selbst |
| 8 | Der Baum hängt an keiner Dorffigur, sein Sprecher ist immer derselbe, sein Schild passt in den Deckel, und **jede Option, die `szeneEnde()` ruft, heißt wörtlich `Auf Wiedersehen.`** |

Dazu ohne eigenen Guard: die Pools und Sprüche laufen durch `knAssertCaps()` und
damit durch Deckel 44, Gedankenstrich-, Emoji-, Kesselgrammatik- und
Kaiser-Prüfung. Baum und Tafelstapel laufen durch `szeneAssert()`.

Meldung im Normalfall, dreiundzwanzigste Zeile der Konsole:

```
T3 Anlage 2: 7 Anlässe, 10 Sprüche in Reihe, 5 Blätter, Brandmauer in Ordnung.
```

### Das Protokoll: jeder Zweig einmal ausgelöst

Hausbrauch seit T1: *ein Guard, den man nie hat melden sehen, ist eine
Behauptung.* Alle zehn Zweige an einer Probefassung ausgelöst, Meldung wörtlich:

| Probe | Meldung |
|---|---|
| „Vertrag" in eine Zeile geschrieben | `Brandmauer verletzt, sie weiß das nicht Notiz crit Vertrag` |
| Eine freie Zeile gestrichen | `Anlass hat weniger als vier Zeilen ohne Gate crit 3` |
| Gate auf `abGefuehl` | `Gegatete Zeile nennt einen Schalter, den es nicht gibt crit abGefuehl` |
| Gate auf `abStufe:99` | `Gegatete Zeile crit nennt eine Stufe, die niemand erreicht: 99` |
| Pool `regenschauer` erfunden | `Ein Pool wartet auf einen Anlass, den nichts auslöst regenschauer` |
| Einen Spruch doppelt | `Ein Bewegungsspruch steht doppelt in der Reihe` |
| Merker gestrichen | `Der Merker anlage2Da fehlt in kn.flags` |
| Stapel auf ein Blatt gekürzt | `Die Einführung ist zu knapp geraten Ernennung 2` und `In der Einführung spricht Anlage 2 nicht selbst` |
| Blatt ohne `stimme` | `Ein Blatt der Einführung trägt die Tafelform nicht Ernennung` |
| Ausgang auf „Auf Wiederhören." | `Ein Ausgang lautet nicht wörtlich "Auf Wiedersehen." Auf Wiederhören.` |

**Und ein Fund an der Probe selbst.** Die erste Fassung von Zweig 8 suchte den
Ausgang am Wortlaut (`/Wiedersehen/`) und prüfte dann, ob er stimmt. Bei der
Probe schwieg er: ein Ausgang, der „Auf Wiederhören." hieß, fiel aus dem Filter
und wurde nicht gefunden. Ein Zirkelschluss, und er wäre ohne die Probe nie
aufgefallen. Er sucht jetzt nach dem, was die Option **tut** (`szeneEnde` im
Quelltext), und der Wortlaut ist das Geprüfte statt des Suchkriteriums.

---

## 7. Drei Funde aus dem Durchspielen

Alle drei im Browser gesehen, keiner in einem Guard, und der erste ist älter als
dieser Bauabschnitt.

### Der Anfang jedes langen Blattes war unsichtbar

Der Textkörper einer Szenentafel ist seit SZ4 ein Flex-Kasten mit
`justify-content:center`. Das zentriert, solange der Text hineinpasst, und
schiebt ihn beim Überlaufen nach **beiden** Seiten hinaus. Der untere Überhang
lässt sich errollen, der obere nicht: Flexbox kennt dort keinen negativen
Rollweg. `scrollTop` steht auf null, und die erste Zeile ist trotzdem weg.

Gemessen statt vermutet: der Kasten begann bei y=178, sein erstes Kind bei y=94.

Betroffen war jedes lange Blatt seit SZ4, auch die Ernennung aus T2. Aufgefallen
ist es an Anlage 2, weil ihre Blätter die längsten des Anfangs sind. Behoben mit
`justify-content:safe center`: zentriert weiterhin, fällt beim Überlauf auf
`flex-start` zurück.

### Die Sprechblase fiel aus dem Fenster

Die Kachel steht immer als erste im Raster und damit an der linken Kante. Die
Blase war über ihr zentriert und hing zur Hälfte im Nichts; vom Spruch war der
Anfang abgeschnitten. Jetzt linksbündig an der Kachel.

### Die Nachholung ließ das Overlay stehen

Gefunden nicht vom Guard, sondern von `tools/empfang-pruef.mjs` beim **zweiten**
Griff zur Tasche. Auf dem Weg über die Ernennung räumt `dienstAntritt()`
hinterher; bei der Nachholung räumt niemand, weil der Dienst längst läuft. Ohne
die eine Zeile blieb das schwarze Feld über dem Dorf stehen und der Rucksack
ging dahinter auf. Genau dafür klickt sich ein Prüflauf durch das echte Spiel.

---

## 8. Der bekannte Rotstand ist nebenbei gefallen

`tools/mitteilung-pruef.mjs` stand seit U10 bis U12 auf **29 von 32**, und der
Auftrag hielt ausdrücklich fest, dass das nicht Sache dieses Abschnitts ist.

Er ist es trotzdem geworden, und zwar durch die eigene Arbeit: der README
verlangt bei jedem Bauabschnitt einen Punkt in `NEUERUNGEN`, und der Lauf zählte
die Punkte gegen eine abgeschriebene Drei. Zwei neue Punkte hätten den Stand auf
**27 von 32** gedrückt.

Der Fixvorschlag lag seit T1 fertig in `phase-t1-tonlage.md`, Abschnitt 9. Er ist
umgesetzt, und die dritte Zeile gleich mit: sie zählte die Reiter im
Charakterfenster gegen eine Vier, seit U8 vier Großfenster gebaut hatte, und die
Optionen sind später als fünftes dazugekommen. Alle drei Zeilen lesen jetzt aus
der Quelle statt abzuschreiben. **32 von 32.**

---

## 9. Abnahme

### Beim Laden

Konsole still, dreiundzwanzig Guard-Zeilen, keine Meldung. Dieselben
dreiundzwanzig in der gebauten Einzeldatei über `file://`.

### Die Prüfläufe

| Lauf | Ergebnis |
|---|---|
| `tools/anlage2-pruef.mjs` (neu) | 49 von 49 |
| `tools/empfang-pruef.mjs` | 76 von 76 |
| `tools/szene-pruef.mjs` | 49 von 49 |
| `tools/gespraech-pruef.mjs` | 89 von 89 |
| `tools/menue-pruef.mjs` | 78 von 78 |
| `tools/reich-pruef.mjs` | 59 von 59 |
| `tools/stopfen-pruef.mjs` | 43 von 43 |
| `tools/versuchung-pruef.mjs` | 67 von 67 |
| `tools/langvorgang-pruef.mjs` | 58 von 58 |
| `tools/speicher-pruef.mjs` | 34 von 34 |
| `tools/zulagen-pruef.mjs` | 50 von 50 |
| `tools/ebene-pruef.mjs` | 54 von 54, siehe unten |
| `tools/mitteilung-pruef.mjs` | **32 von 32** (war 29 von 32) |

**Ein Befund am Rand, und er gehört nicht hierher.** `ebene-pruef.mjs` meldet
nicht bei jedem Lauf dasselbe: die Zeile „und unten steht wirklich jemand" fällt
gelegentlich aus, weil die zweite Ebene der Sperrablage samt ihren Wächtern
gewürfelt wird. Nachgemessen statt vermutet, viermal gegen `origin/main` ohne
diesen Bauabschnitt: **52, 53, 52, 53 von 54.** Dreimal auf diesem Zweig: **54,
53, 54.** Der Lauf schwankt also vorher wie nachher und auf dem Stand von T2
eher schlechter. Das ist ein Prüflauf, der einen Zufall gegen eine feste
Erwartung hält, und die Behebung gehört zu M4 und nicht zu Anlage 2.

Drei bestehende Läufe sind nachgezogen, und alle drei beschreiben Verhalten, das
absichtlich ausgetauscht wurde:

* **`empfang-pruef.mjs`** zählt die Ernennung jetzt bis `HINAUSGEHEN` und die
  Einführung bis `EINSTECKEN` statt beide in einer Zahl. Dazu neun neue Zusagen
  über Anlage 2, den Nachholweg und die Blätter auf dem Telefon.
* **`menue-pruef.mjs`** klickt die Einführung einmal vorweg durch. Er geht über
  den Vordruck und greift danach mehrfach zur Tasche, um das Menü zu prüfen.
* **`mitteilung-pruef.mjs`**, siehe Abschnitt 8.

### Im Bild

Durchgespielt vom Spielstart bis nach dem ersten Treffen, mit Abzügen bei jedem
Schritt: Vorstellung, Intro, Empfang, Ernennung über sechs Blätter, Einführung
über fünf, `EINSTECKEN`, Dorf, Rucksack, drei Bewegungsversuche mit drei
verschiedenen Sprüchen in der richtigen Reihenfolge, Gespräch mit Porträt und
Kaskade, und beide Stimmen im Band nebeneinander.

---

## 10. Was offen bleibt

**Das gemalte Porträt.** Der Prompt steht als Nummer 21, der Platzhalter tut
seinen Dienst. Sobald ein Motiv vorliegt, ersetzt der übliche Weg die Datei
(`assets/figuren/21-anlage2.jpg`, Eintrag in `TAFEL`, `figuren-px.py --tafel`).
Eine Anmerkung dazu: `portraet-farben.py` leitet aus Porträts Haar- und
Hemdfarben ab. Anlage 2 hat keine Haare und steht nicht in `DORF_FIGUREN`, der
Lauf fasst sie also nicht an.

**Ihre Zeilen wachsen mit.** Der Kommentarkanal hat heute zwei gegatete Zeilen.
Die Mechanik trägt beliebig viele, und jeder spätere Bauabschnitt kann seine
eigene dazulegen, ohne etwas zu bauen: ein Eintrag mit `abAkt`, `merker` oder
`lang` genügt.

**Sie sagt nichts zu den Szenen.** `ANLASS_QUELLEN` kennt `umlauf`,
`hintermuehl` und `vorblatt`, und die Bank kommentiert sie seit SZ2. Anlage 2
schweigt dort. Das ist kein Versehen und auch keine Entscheidung für immer,
sondern die Brandmauer an ihrer engsten Stelle: die drei Anlässe hängen alle am
laufenden Fall. Wer sie ihr geben will, muss für jede einzelne Zeile
nachweisen, dass sie aus dem Haus kommt und nicht aus der Akte.
