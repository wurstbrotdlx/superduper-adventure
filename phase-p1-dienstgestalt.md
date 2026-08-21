## P1: Die Dienstgestalt — ERLEDIGT

Der Außendienst ist jeden Morgen ein anderer Mensch. Das ist seit Kapitel 5 der Weltbibel so
gemeint und seit W8 im Vordruck nachlesbar. Nur sah man es nicht: die Person des Tages wurde
aus sechs Frisuren gewürfelt, alle in ihrem Naturton, alle aus demselben Grafikpaket, aus dem
auch das halbe Dorf gebaut ist. Auf dem Dorfplatz zwischen elf Figuren und in einer Horde
zwischen dreißig Gegnern hat man sich schlicht nicht wiedergefunden.

Diese Phase gibt der Person des Tages eine Farbe und dem Spieler eine Angabe darüber, wen das
Haus überhaupt einstellen soll. Sie fasst weder Werte noch Kampf noch Anrede an.

### Eingriff 1: Haarfarben, die es in Vordermühl nicht gibt

`CF_HAARTON` hält acht Töne. Die Namen sind Bürobedarf, weil das Haus nichts nach dem benennt,
wonach es aussieht, sondern danach, wo es herkommt.

| Schlüssel | Name | Farbe |
|---|---|---|
| warn | Warnorange | `#ff7a18` |
| sirene | Sirenenrot | `#ff2d55` |
| durch | Durchschlagrosa | `#ff3ecb` |
| deckel | Aktendeckelviolett | `#a855f7` |
| stempel | Stempelblau | `#2f7bff` |
| kanzlei | Kanzleitürkis | `#16e0d8` |
| ablage | Ablagegrün | `#39e13a` |
| marker | Leuchtmarkergelb | `#d8ff1f` |

Leuchtmarkergelb ist bewusst ins Grüne gezogen. Ein reines Gelb kam Blond zu nahe, und damit
wäre die eine Frage, um die es hier geht, wieder offen: bin ich das oder ist das ein Bauer.

Das Grafikpaket hat diese Farben nicht, und weitere PNGs zu kopieren wäre der falsche Weg
gewesen (fünf Töne x sechs Frisuren, und Neonpink liegt ohnehin in keinem Ordner). Umgefärbt
wird deshalb im Browser, einmal je Blatt und Farbe, danach aus dem Cache.

**Warum nicht mit `tintedSheet()`.** Das legt mit `source-atop` eine halbdurchsichtige Fläche
auf und lässt die Grundfarbe durchscheinen. Aus dem schwarzen `Hair_3` und Grün wird
Dunkelgrün, aus dem orangen `Hair_4` und Blau ein Grau. Genau die Unterscheidbarkeit, um die
es geht, ginge verloren.

**Warum nicht mit den Blendmodi.** Das war der erste Bau und funktionierte für vier von sechs
Frisuren: `screen` hebt die Helligkeit, `color` setzt Farbton und Sättigung und lässt die
Helligkeit stehen. Nur sind die sechs Blätter eben nicht gleich hell. `Hair_3` ist schwarz,
`Hair_2` ist blond. Dasselbe Warnorange ergab auf dem einen ein dunkles Braun und auf dem
anderen ein blasses Pfirsich, und blass ist hier das Gegenteil des Ziels.

**Was es geworden ist.** `haarBlatt()` misst je Blatt einmal, wie dunkel sein dunkelster und
wie hell sein hellster undurchsichtiger Pixel ist, und legt diese Spanne auf ein festes Band
um die Helligkeit der Zielfarbe (Zielhelligkeit plus/minus 0,22). Die Abstufung des Blattes
bleibt erhalten, ein hellerer Pixel bleibt der hellere; Ausgangslage und Umfang sind für alle
sechs Frisuren dieselben. Ergebnis: dieselbe Farbe ist auf jedem Blatt dieselbe Farbe,
nachgesehen an allen 48 Kombinationen.

Gebacken werden nur die Zeilen, die der Key wirklich benutzt, gleiche Regel wie bei
`tintedSheet()`: 576x64 statt 576x3584. `getImageData` steht in `try`/`catch`, wie in
`npcAnkerAssert()`; wirft es, bleibt das Haar in seinem Naturton, statt dass ein Wurf auf
Skriptebene den Rest mitreißt.

Der Ton hängt am Dirty-Check von `bakeHeroSheet()` (`armorTier|bootsTier|hair|haarTon`), es
wird also weiterhin nur bei einer echten Änderung neu gebacken. Die Dorffiguren sind nicht
betroffen: `blitHaarFrame()` ohne Farbe ist `blitLayerFrame()`, und die Komposite aus G6
übergeben keine.

**Wo die Namen auftauchen.** Auf dem Dienstausweis, als Feld `Haarfarbe`. Das Lichtbild dort
ist ein Ausschnitt aus demselben Bake wie der Held (18.8: „Es ist das Gesicht der heutigen
Schicht"), trägt die Farbe also von selbst; das Haus schreibt nur dazu, wie es sie nennt. Eine
Farbtabelle, deren Namen nirgends stehen, wäre ein Kommentar und kein Spielinhalt. Kommentiert
wird das wechselnde Lichtbild weiterhin von niemandem, wie 18.8 es verlangt.

### Eingriff 2: die eine Frage des Vordrucks

Blatt 1 der Einstellungsverfügung hat ein neues Feld, **Anrede der Person**, und es ist das
einzige im ganzen Spiel, das der Spieler selbst ausfüllt. Drei Antworten: männlich, weiblich,
darauf lege ich keinen Wert. Der Auslieferungszustand ist die dritte, und sie steht zuletzt,
weil wer nichts angibt nichts abgewählt hat.

Das Feld steht direkt unter „Anlage 1: liegt nicht vor". Das ist die Pointe der Stelle: das
Haus weiß nicht, worum es überhaupt geht, aber es weiß, wen es einstellen soll, und es trägt
es ordentlich ein. Der Erläuterungssatz sagt es geradeheraus, weil es eine Zusage ist und
keine Überraschung: *„Auf Dienst, Bezahlung und Laufbahn wirkt sich die Angabe nicht aus."*

Die drei Knöpfe stehen **unter** der Rollkante des Vordrucks, nicht darin. Sie sind das
einzige Bedienelement auf dem Blatt, und ein Knopf, den man erst herunterrollen muss, ist ein
Knopf, den man nicht sieht. Nachgeholt werden kann die Angabe jederzeit: Blatt 1 ist aus dem
Startbild und aus dem Amt über die Dienstanweisung erreichbar.

Gespeichert wird sie in `amt.gestalt` und damit im selben Speicher wie Amtskasse und Ausbauten.
`loadAmt()` prüft sie gegen die Tabelle und nicht nur auf den Typ: ein unbekannter Wert würde
`haareNach()` sonst stumm auf „alle" zurückfallen lassen, die Angabe wäre dann wirkungslos
statt falsch, und das fällt niemandem auf.

### Eingriff 3: Spawn und Respawn halten sich daran

`startShift()` ist die eine Stelle, an der die Gestalt des Tages entsteht. Sie ist zugleich
der Weg für den ersten Dienstantritt und für jeden Wiederantritt nach einem Dienstende, es
gibt also keinen zweiten Pfad, der die Angabe übergehen könnte. Gezogen wird die Frisur aus
`haareNach(amt.gestalt)` und der Ton aus `CF_HAARTON`.

Welche Frisur zu welcher Lesart zählt, steht in `CF_HAIR` als ein Buchstabe je Zeile. Vergeben
ist er an der Silhouette der sechs Blätter, gegen die echten PNGs angesehen:

| Blatt | Silhouette | Lesart |
|---|---|---|
| h1 `Hair_1` | kurzer Schnitt, Ohren frei | m |
| h2 `Hair_2` | kurze Tolle, nach hinten gelegt | m |
| h3 `Hair_3` | Undercut, Seiten ausrasiert | m |
| h4 `Hair_4` | langer Seitenscheitel über eine Gesichtshälfte | w |
| h5 `Hair_5` | langes offenes Haar bis auf die Schultern | w |
| h6 `Hair_6` | hochgesteckter Knoten mit Strähnen | w |

Drei und drei, das ist kein Zufall, sondern die Bedingung dafür, dass beide Angaben gleich
viel Abwechslung bekommen. Wer eine Zuordnung anders liest, ändert genau einen Buchstaben;
der Guard hält nur fest, dass beide Lesarten besetzt bleiben.

Zwei Stellen halten sich absichtlich **nicht** an die Angabe:

- **Die laufende Schicht.** Wer die Angabe im Amt ändert, tauscht niemandem mitten im Dienst
  das Gesicht. Sie greift beim nächsten Antritt.
- **Die Wiedereinsetzung (W10).** Ein bewilligter Antrag gibt Frisur **und** Ton zurück, auch
  wenn die Angabe seither eine andere ist. Eine Wiedereinsetzung setzt dieselbe Person wieder
  ein, das ist ihr ganzer Zweck (18.2). Sie an eine später geänderte Vorliebe anzupassen hieße,
  jemand anderen einzusetzen und es Berichtigung zu nennen. `amt.wiedereinsetzung` trägt dafür
  ein Feld mehr (`ton`), `loadAmt()` prüft es wie das Haar.

`respawnPlayer()` (der Weg ohne Schichtmodus) würfelt nichts und wurde nicht angefasst: dort
wacht derselbe Mensch am Waldrand wieder auf.

### Die Grenze dieser Phase

Damit sie nicht später stillschweigend überschritten wird: **das Haus kennt die Angabe,
spricht sie aber nirgends aus.** Die Anredeleiter aus 18.5 bleibt unangetastet, „Herr oder
Frau" bleibt „Herr oder Frau", das `(in)` bleibt am Titel. Der Dienstposten kennt das
Geschlecht der Person, die ihn heute bekleidet, immer noch nicht. Er kennt einen Vermerk in
einem Vordruck, und Vordrucke sprechen nicht.

Lisbeth fragt weiter jede Schicht nach dem Namen und bekommt weiter keinen. Der Spieler hat
keinen Namen und bekommt keinen (Kapitel 16). Ein Aussehen ist kein Name.

### Der Guard

`gestaltAssert()`, Bauform wie `rangAssert()`/`dienstAssert()`, läuft beim Laden auf
Skriptebene, wirft nie, meldet nur. Vier Prüfungen:

1. Jede Frisur trägt genau eine gültige Lesart, und beide Lesarten sind besetzt. Läuft eine
   leer, fällt `haareNach()` still auf alle zurück, und die Angabe wäre wirkungslos.
2. Die Auswahl liefert, was sie verspricht: `m` nur Männliches, `w` nur Weibliches, `egal`
   alles, nie eine leere Liste. Ein unbekannter Wert fällt auf den Auslieferungszustand.
3. Die acht Töne sind als `#rrggbb` notiert, keiner doppelt, jeder benannt, und keiner unter
   50 Prozent Sättigung. Ein blasser Ton wäre ein Naturton, und darum geht es hier nicht.
4. Der Loader nimmt nur an, was die Tabelle kennt. Gespiegelt geprüft wie in `wiederAssert()`:
   echten Wert weg, Prüfwerte rein, im `finally` zurück, kein `saveAmt()` im Guard.

`dienstAssert()` prüft die neuen Texte zusätzlich gegen dieselben Formregeln wie jede andere
Zeile des Vordrucks (kein Gedankenstrich, kein Sperrvermerk, kein Vorgriff auf die Akte) und
`gestaltWaehlen()` gegen den globalen Namensraum, weil der Knopf in einer onclick-Zeichenkette
hängt.

### Prüfprotokoll

Live im Browser, nicht nachgerechnet.

| Prüfung | Ergebnis |
|---|---|
| Alle 48 Kombinationen aus Frisur und Ton gerendert | jede Farbe auf jedem Blatt als dieselbe erkennbar |
| Knopf „weiblich" geklickt | Feld zeigt „weiblich gelesen", `amt.gestalt='w'`, in `localStorage` angekommen |
| 300 Schichtantritte bei „männlich" | 0 Frisuren aus der anderen Lesart |
| 12 Schichtantritte bei „weiblich" | nur h4/h5/h6, Töne durchmischt |
| Angabe während der Schicht geändert | laufendes Gesicht unverändert, nächster Antritt folgt der neuen Angabe |
| Wiedereinsetzung eingelöst | Frisur und Ton identisch zur Vorschicht |
| `respawnPlayer()` | Gesicht unverändert |
| Tonwechsel und `bakeHeroSheet()` | neu gebacken, Dirty-Check greift |
| Dienstausweis geöffnet | Lichtbild in der Schichtfarbe, Feld „Haarfarbe: Kanzleitürkis" |
| Konsole beim Start | `P1 Dienstgestalt: Lesarten, Auswahl und Haarfarben in Ordnung.`, sonst keine Meldung |

### Bewusst offen

- **Die Lesart hängt an der Frisur, sonst an nichts.** Das Grafikpaket hat genau einen
  `Player_Base`, es gibt also keinen zweiten Körperbau und keine zweite Kleidungsschnittform,
  auf die man ausweichen könnte. Sechs Frisuren sind der einzige Hebel, den die Grafik hergibt.
- **`Hair_2` bleibt eine Spur heller als die anderen fünf.** Seine eigene Schattierung liegt
  am hellen Ende, das Band verschiebt sie, staucht sie aber nicht. In der Sache fällt es nicht
  auf, in der Matrix schon.
- **Kein Farbwunsch.** Der Ton wird gewürfelt und nicht gewählt. Wer ihn wählen dürfte, würde
  ihn einmal wählen und behalten, und dann wäre die Person des Tages wieder jeden Tag dieselbe.
