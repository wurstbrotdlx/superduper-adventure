# Bauabschnitt E2 — Staatsakt: Bühne, Vorstellung, Blätterwerk — ERLEDIGT

Nachzug zu E1 (`phase-e1-empfang.md`) aus fünf Rückmeldungen zum gespielten Anfang.
Weltbibel Kapitel 8 (Knöterich), Kapitel 13 (Humor-Grundgesetz 10 und 11), Kapitel 4.

E1 hat den Anfang von einer Wand in eine Szene verwandelt. E2 beantwortet, was danach
übrig blieb: die Szene lief über dem Dorf, ihr Erzähler war namenlos, ihre Schrift war zu
klein, und hinter ihr rollte immer noch ein Vordruck.

## Die fünf Befunde

| Befund | Antwort |
|---|---|
| Die Tafeln standen über dem laufenden Dorf | Eine schwarze Bühne unter dem ganzen Anfang |
| Knöterich war irgendwer mit einem Formular | Er stellt sich zuerst vor, dann erzählt er |
| Der Vordruck rollte, eine Wall of Text | Er blättert, nach gemessener Höhe |
| Die Schrift war zu klein und zu schwach | Größer und heller, im ganzen Anfang |
| Es sah nicht wichtig genug aus | Urkundenoptik: Siegel, Doppellinien, Versalien |

## E2-1. Die Bühne

`#introBuehne`, ein schwarzes Feld auf `z-index: 15`. Über HUD (10) und Dienstzetteln (12),
unter der Gesprächstafel (21) und dem Overlay (50). Beide liegen also darauf, ohne dass an
ihren Ebenen etwas geändert werden musste.

Sie steht vom ersten Bild bis zum Empfang. **Das Dorf kommt erst, wenn der Empfang
beginnt**, und dann als Auftritt statt als Hintergrundrauschen. Vorher sah man Marktstände
und Namensschilder hinter „VOR VIERHUNDERT JAHREN", und der Anfang wirkte dadurch wie ein
Menü über einem laufenden Spiel.

Der warme Fleck in der Mitte der Bühne ist kein Zierrat: auf reinem Schwarz steht
Goldschrift hart und billig, mit einem Hauch Wärme darunter sitzt sie in einem Raum.

Die Bühne trägt auch den Vordruck, wenn man ihn über `ÜBERSPRINGEN` erreicht, also **vor**
dem Empfang. Wer ihn dagegen aus dem Empfang heraus aufschlägt, liest ihn über dem Dorf,
denn dort steht er dann auch. Beides ist gewollt, und beides ist geprüft.

## E2-2. Knöterich stellt sich vor

Die Reihenfolge ist der Kern dieses Bauabschnitts: **erst der Mann, dann seine Geschichte,
dann sein Schreibtisch.** In E1 kam die Geschichte zuerst und der Mann danach, und dadurch
erzählte niemand die Geschichte.

Fünf Züge auf schwarzem Grund, bevor die erste Tafel kommt:

> **Sie sind zu früh. Das ist selten.** / **Mein Name ist Knöterich. Amtsrat.**
> „Guten Morgen."
> **Außer Dienst. Das gehört zum Namen.** / **Meine Entpflichtung wurde nie bearbeitet.**
> „Dann sind Sie im Dienst."
> **Ich bin beides. Das ist kein Widerspruch.** / **Das ist Verwaltung.**
> „Und was tun Sie hier?"
> **Ich führe Buch. Seit vierzig Jahren.** / **Jemand muss aufschreiben, was hier geschieht.**
> „Was geschieht hier denn?"
> **Setzen Sie sich nicht hin. Das dauert.** / **Ich sage es einmal. Hören Sie zu.**
> „Ich höre."

Das tut zweierlei. Es gibt der Figur eine Besessenheit, ein Hindernis und eine Sprachmarke
in vier Zeilen (Kapitel 8, Bauprinzip). Und es **deckt den Ton der Tafeln**: was danach
kommt, ist nicht mehr eine Stimme aus dem Nichts, sondern SEIN Bericht. Nicht das Spiel
wird pathetisch, sondern ein Mann, der seit vierzig Jahren Buch führt und einmal im Leben
erzählen darf. Humor-Grundgesetz 1 bleibt dadurch unangetastet.

Zwei Fragen des Empfangs sind dafür entfallen, `wer` und `ruhestand`: sie sagten genau
das, was die Vorstellung jetzt sagt. Der Empfang hat seither zwölf Fragen statt vierzehn,
und sein Einstieg ist die Brücke zurück: *So weit der Bestand. Jetzt zu Ihnen.*

## E2-3. Die Optik: die Bürokraten sind der Adel

Das Papier dieses Hauses sieht ab jetzt aus wie eine Urkunde und nicht wie ein
Hinweisfenster. Kopfzeile in gesperrten Versalien, Doppellinie oben und unten, Siegel,
römische Blattzahl, Fußzeile mit Aktenzeichen.

**Das Wappen zeigt einen Paragrafen**, denn etwas anderes hat das Haus nicht. Gezeichnet
aus Kreisen und Strichen als SVG im Panel, keine neue Grafikdatei und kein Zeichenschritt
im Renderpfad.

Das ist Humor-Grundgesetz 10 als Layout: der Aufwand, mit dem dieses Haus eine Sache
aufmacht, von der es selbst nicht weiß, worum es geht, **ist** die Pointe. Deshalb darf
hier nichts bescheiden aussehen. Die große Zeile steht in bis zu 46 Pixeln mal
Schriftfaktor, hell, mit Schlagschatten und einem Hauch Schein. Darunter, in einem Fünftel
der Größe: *Anlage 1 liegt nicht vor.*

**Eine Falle, die Zeit gekostet hat und deshalb im Code kommentiert steht:** `#overlay p`
setzt eine Schriftgröße mit Id-Spezifität. Eine bloße Klasse verliert dagegen. Die vier
Urkundenklassen stehen deshalb doppelt, einmal blank und einmal unter `#overlay` — ohne
den zweiten Selektor standen die Anrisstafeln in 14 Pixeln, also genau so klein wie der
Fließtext, den sie überschreien sollen.

## E2-4. Der Vordruck blättert

Bis hierher lag der ganze Blattinhalt in einem `#dienstBox` mit `max-height:34vh` und
`overflow-y:auto`. Auf Blatt 2 standen elf Punkte in einem Kasten, der vier zeigte. Die
Zeile „Das Blatt geht unten weiter." war der Beweis dafür, dass das Layout selbst wusste,
dass es zu klein war.

Gerollt wird gelesen wie eine Wand, geblättert wird gelesen wie ein Vordruck. Die Punkte
tragen außerdem je einen kleinen Witz, und ein Witz, der mit zehn anderen gleichzeitig im
Bild steht, ist keiner mehr. Derselbe Befund wie bei den Anrisstafeln, eine Ebene tiefer.

**Die Seitengrenzen werden gemessen, nicht gezählt.** Ein erster Versuch mit festen Zahlen
(fünf Felder, vier Punkte je Seite) ist an der Messung gescheitert, und zwar nicht knapp:

```
Telefon 390x844 Schrift 0   Blatt 1 S3, Blatt 2 S1-3, Blatt 3 S1-2 laufen über
Telefon 390x844 Schrift 2   acht von zwölf Seiten laufen über
Telefon 360x640 Schrift 2   zehn von zehn laufen über
```

Eine feste Zahl kann das auch nicht leisten: sie müsste gleichzeitig für einen Punkt mit
vier Zeilen Fließtext und ein Feld mit zwei Wörtern gelten, für 360 und für 1280 Pixel
Breite und für drei Schriftstufen. Was hier gebraucht wird, ist keine Zahl, sondern eine
Waage.

`dienstSeitenWiegen()` baut ein unsichtbares Blatt neben dem sichtbaren, misst den Rahmen
samt Knopfreihe und jeden Block einzeln und packt danach. Gewogen wird einmal je Blatt und
Fensterlage, das Ergebnis liegt im Cache, der Schlüssel enthält Breite, Höhe, Schriftstufe
und Bühnenstand. Kein Nachrechnen je Klick, kein Umbauen nach dem Rendern.

**Drei Fehler in der Waage, alle drei erst durch Messung sichtbar geworden:**

1. *Die Knopfreihe war ein geschätzter Zuschlag.* Jetzt steht ein echter Knopf in der
   Probe. Geschätzte Zuschläge sind genau die Sorte Zahl, an der die feste Aufteilung
   gescheitert war.
2. *Die Ränder fehlten.* `getBoundingClientRect()` liefert `margin` nicht mit, und die
   Schlusssätze wie Knöterichs Zeilen tragen ihren Abstand als `margin-top`. Bis zu zehn
   Pixel je Block, und genau die liefen am Seitenende über.
3. *Die Probe war einundzwanzig Pixel zu breit.* Ohne `box-sizing:border-box` ist `width`
   die Breite ohne Polster: das echte Blatt wird vom Overlay auf die Fensterbreite
   gestaucht, die absolut gesetzte Probe aber nicht. Der Text umbrach in der Probe
   seltener, jede gemessene Höhe fiel zu klein aus, und die Seite lief über. Das war der
   hartnäckigste der drei und von außen als „passt fast" zu sehen.

Dazu zwei Mediaregeln: unter 720 Pixel Fensterhöhe schrumpfen Siegel und Kopfzeile, unter
660 fallen Siegel und Vorspann ganz weg. Der Kopf einer Urkunde ist Schmuck, die elf
Punkte darunter sind der Dienst. Wenn eines von beidem weichen muss, weicht der Schmuck.

Ergebnis, gemessen über sechs Fensterlagen:

```
Desktop 1100x760 Schrift 0   Seiten je Blatt [3,3,3]   alles passt ohne Rollen
Desktop 1100x760 Schrift 2   Seiten je Blatt [4,5,5]   alles passt ohne Rollen
Laptop  1280x620 Schrift 2   Seiten je Blatt [3,4,4]   alles passt ohne Rollen
Telefon  390x844 Schrift 0   Seiten je Blatt [4,6,5]   alles passt ohne Rollen
Telefon  390x844 Schrift 2   Seiten je Blatt [6,12,8]  alles passt ohne Rollen
Telefon  360x640 Schrift 2   Seiten je Blatt [7,11,9]  alles passt ohne Rollen
```

## E2-5. Die Schrift

Im ganzen Anfang größer und heller. Die Gesprächstafel steht in 19 statt 16 Pixeln mal
Schriftfaktor, ihr Name in 17 statt 15, die Antwortzeilen in 16 statt 14, und sie ist 780
statt 720 Pixel breit. **Nur im Anfang**: im Empfang ist die Tafel das einzige im Bild, im
Dorf steht sie über einer laufenden Welt und darf sie nicht zudecken.

Knöterichs Porträt trägt jetzt `tintA 0.30` statt 0.45. In der Welt ist die Figur 24 Pixel
hoch und braucht 0.82, damit „alt und grau" ankommt; im fünffach vergrößerten Porträt war
0.82 eine graue Fläche, 0.45 noch immer teigig. Dieselbe Aussage in einer anderen Größe,
kein zweiter Kanon.

## Guards

`empfangAssert()` unverändert in seiner Bauform, jetzt über neun Knoten statt vier und
zwölf Fragen statt vierzehn:

```
E1 Empfang: 5 Tafeln, 12 Fragen, 9 Knoten, Sperrvermerk und Antwortdeckel in Ordnung.
```

`dienstAssert()` bekommt eine Prüfung dazu. Die Seitenverteilung hängt am Fenster und ist
deshalb nicht prüfbar; die **Zerlegung in Blöcke** ist es, und sie ist die Stelle, an der
beim nächsten Nachtragen etwas verschwindet: wer eine sechste Zeilenart ergänzt und sie in
`dienstblattBloecke()` vergisst, sieht sie nirgends fehlen. Sie wäre einfach nicht mehr im
Spiel. Geprüft wird, dass jedes Feld, jeder Punkt, jeder Schlusssatz und jede
Knöterich-Zeile in genau einem Block landet.

## Prüfprotokoll

`tools/empfang-pruef.mjs`, von 43 auf **59 Prüfungen** erweitert, alle bestanden, zweimal
hintereinander gefahren.

Neu darin: der Anfang beginnt in der Tafel und nicht im Overlay · die Bühne steht und
verdeckt das Dorf · Knöterich nennt zuerst seinen Namen · die Vorstellung hat fünf Züge ·
die Bühne trägt auch die Tafeln und fällt erst mit dem Empfang · sie trägt auch den
übersprungenen Vordruck, aber nicht den aus dem Empfang heraus · der Vordruck blättert
statt zu rollen · UNTERSCHREIBEN steht auf der letzten Seite, WEITER eine davor · die
Vorstellung steht auf dem Telefon im Bild.

**Regressionslauf, beide bestanden:**

```
node tools/gespraech-pruef.mjs    44 von 44
node tools/menue-pruef.mjs        39 von 39
```

Beide brauchten dieselben zwei Zeilen, und beide Male war der Grund derselbe: ihr
`spiel()`-Helfer startete das Spiel und wartete danach auf ein sichtbares Overlay. Seit E2
öffnet `startGame()` kein Overlay mehr, sondern die Vorstellung auf schwarzem Grund. Die
Schleife stieg sofort aus, mitten im Anfang, und **vierzehn von 44 Prüfungen fielen aus,
ohne dass am geprüften Verhalten irgendetwas kaputt war.** Dazu: der Durchklick-Zähler
stand auf zwölf und reichte bei bis zu fünfzehn Vordruckseiten nicht mehr bis zur
Unterschrift.

Der Telefon-Abschnitt von `gespraech-pruef.mjs` prüft außerdem seit E2 eine andere und
stärkere Zusage. Die alte („der Vordruck ist höher als das Bild, aber ein Wisch holt den
Knopf herunter") war die beste Antwort, solange gerollt wurde. Jetzt gilt: **keine Seite
läuft über**, geprüft auf jeder Seite jedes Blattes statt nur auf der ersten. Der
Fehlstand, den E2 behoben hat, saß auf Blatt 2 und 3 und wäre an Blatt 1 vorbeigelaufen.

Dazu der Pages-Build, weil er einen anderen Ladeweg nimmt:

```
node tools/build-single.mjs
```

`dist/index.html` per `file://`: Vorstellung offen, Bühne steht, Porträt gemalt, Siegel im
Aushang, Seiten je Blatt [3,3,3], Konsole still.

## Was offen bleibt

Unverändert der Befund aus E1, und er ist nach E2 der größte verbliebene: **die 66
Grundzeilen der elf Dorffiguren** aus W3 stehen weiter als Zufallszyklus. `Der Kessel ist
kein Kessel. Der Kessel ist ein Kopierer.` liegt als Nummer drei von sechs an einer
Stelle, die man durch Zufall trifft statt durch Absicht. Die Treppe aus E1 ist die
Behandlung dafür, und sie ist eine Inhaltslieferung, keine UI-Frage.

Ebenso weiter offen: **der Dienstbericht am Schichtende**, zweitmeistgesehener Text des
Spiels und immer noch eine Tabelle. Er hätte von der Urkundenoptik aus E2 unmittelbar
etwas, denn er ist der Ort, an dem das Haus dem Spieler jeden Abend eine Abrechnung
ausstellt.
