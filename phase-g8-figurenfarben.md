# Bauabschnitt G8 — Die Dorffiguren tragen die Farben ihrer Porträts — ERLEDIGT

Seit U5 zeigt die Gesprächstafel dreizehn gemalte Porträts. Zwei Sekunden später
steht dieselbe Figur wieder im Dorf und sieht aus wie jemand anders. Der
Bürgermeister ist auf seinem Bild ein feister Amtsträger mit Ordenskette und
schütterem Sandhaar; im Dorf ist er Farmer Bob. Herr Pommer ist auf seinem Bild
ein hagerer Mann mit Halbmondbrille; im Dorf ist er Bartender Katy.

G8 schließt diese Lücke, soweit ein 64er-Chibi-Rig sie schließen kann. Kein
neuer Text, keine neue Figur, keine neue Datei im Grafikpaket. G8 nimmt die
Farben aus den Bildern, die schon da sind, und legt sie auf die Sprites.

## Was vorher da war

Eine Dorffigur bekam ihr Aussehen auf einem von zwei Wegen.

**Der Weg über das Paket.** Acht Figuren hatten in `CF_NPCS` ein fertiges
NPC-Blatt zugewiesen — `Farmer_Bob.png`, `Bartender_Katy.png`,
`Miner_Mike.png` und fünf weitere. Fertige Zeichnungen, an denen sich nichts
einstellen lässt. Drei dieser acht liegen wirklich im Paket, die anderen fünf
nicht (G6-Befund).

**Der Weg über das Komposit.** Wer kein Blatt hatte, wurde aus den Ebenen des
Helden-Rigs zusammengesetzt: `bakeNpcSheet()` legt Hose, Schuhe, Körper, Hemd,
Frisur und Hände übereinander. Die Auswahl stand in `gestalt:{}` — und sie war
eine Auswahl aus dem, was das Paket geschnitten hat: sechs Frisuren in ihrer
Auslieferungsfarbe, fünf Hemden, fünf Hosen, fünf Paar Schuhe.

Das zweite ist die eigentliche Fessel gewesen, und man sieht sie an den alten
Zeilen. Bramsche trug Frisur `h3`, den Undercut — nicht weil ihr Porträt einen
Undercut zeigt (es zeigt einen Turmknoten), sondern weil Blatt 3 das schwarze
ist. Knöterich trug `h5`, langes offenes Haar, und der Kommentar dahinter sagte
es selbst: „Grauhaar passt zum a. D." Das war die Farbe von Blatt 5 und nicht
seine Form. Die Silhouette folgte der Farbe, weil sie musste.

Umfärben konnte das Spiel längst. `haarBlatt()` aus P1 rechnet ein beliebiges
Blatt auf eine beliebige Zielfarbe um und wurde für die acht Bürobedarfstöne des
Spielers gebaut. Sie stand den Dorffiguren nur nicht zur Verfügung: `bakeHeroSheet()`
rief sie auf, `bakeNpcSheet()` nicht.

## Was jetzt da ist

```
  Porträt (128², gemalt)          Sprite (64er-Komposit)

  ┌───────────────┐               Frisur   h6   Form aus dem Blatt
  │   ▓▓▓▓▓       │  Knoten   ──▶ haarFarbe #0d1b21   gemessen am Bild
  │   ▓▓▓▓▓       │
  │    ●  ●       │               Körper        unangetastet
  │   ────────    │
  │  ███████████  │  Kragen   ──▶ chest 2 / hemdFarbe #384b66
  └───────────────┘               legs  2 / Hose = Hemd mal 0,72
```

Fünfzehn Figuren — die vierzehn aus `DORF_FIGUREN` und Knöterich, der älter ist
als diese Tabelle — tragen im Dorf die Haar- und Kleiderfarbe ihres Porträts.
Die Werte sind gemessen und nicht ausgesucht; `python3 tools/portraet-farben.py
--pruef` hält sie gegen die Bilder und meldet jede Abweichung.

### G8-1. `haarBlatt()` heißt jetzt `farbBlatt()`

Die Rechnung konnte immer schon mehr, als ihr Name zugab: sie kennt keine
Frisur, sie kennt ein Blatt und eine Zielfarbe. Umbenannt, nicht umgebaut —
`FARB_CACHE`, `FARB_BAND`, `blitFarbFrame()`, und Zeile für Zeile dieselbe
Rechnung wie vorher.

Dazu ein dritter Parameter, `merken`. Der Spieler wechselt Haar und Rüstung im
laufenden Spiel und backt immer wieder dieselben Kombinationen; für ihn ist der
Cache der ganze Sinn. Die Dorffiguren werden genau einmal beim Laden gebacken.
Ihre umgefärbten Blätter blieben danach für immer im Speicher liegen, ohne je
wieder gelesen zu werden — nachgezählt sind es 69 zu je 576x64, zusammen 9,7 MB.
`bakeNpcSheet()` übergibt deshalb `false`.

### G8-2. Das Komposit trägt Farbe

`bakeNpcSheet()` schickt drei der sechs Ebenen durch `farbBlatt()`:

| Ebene | Farbe | Woher |
|---|---|---|
| Frisur | `gestalt.haarFarbe` | am Porträt gemessen |
| Hemd | `gestalt.hemdFarbe` | am Porträt gemessen |
| Hose | `gestalt.hoseFarbe`, sonst Hemd mal `HOSE_DUNKLER` (0,72) | abgeleitet |
| Körper, Hände, Schuhe | — | unverändert |

Der Körper bleibt bewusst außen vor: dort sitzen Gesicht und Augen, und ein
Helligkeitsband darüber machte aus beidem eine Fläche. Nörgels Grün kommt
deshalb weiter als Tönung über die ganze Figur, wie seit W3. Die Schuhe sind
sechs Pixel am Boden; die fünf Paketfarben reichen dafür.

Die Hose ist der einzige abgeleitete Wert im ganzen Bauabschnitt, und der Grund
steht im Bild: die Porträts enden an der Brust. Statt fünfzehn Hosenfarben zu
erfinden, wird die Hose als dasselbe Hemd um gut ein Viertel abgedunkelt
gerechnet. Das ist die Beobachtung an den Porträts selbst — Zapfs Latzhose ist
dunkler als sein Hemd, Vorblatts Mantel dunkler als sein Kragen — und es hält
die Figur in einer Farbfamilie, statt sie zweifarbig auseinanderfallen zu lassen.

### G8-3. Die Frisur wird nach ihrer Form gewählt

Sobald Grau kein Grund mehr ist, eine Form zu wählen, waren fünf Zuordnungen
falsch. Sie sind nachgezogen:

| Figur | vorher | jetzt | warum |
|---|---|---|---|
| Knöterich | `h5` langes offenes Haar | `h1` Kurzhaarschnitt | „combed grey hair", Prompt 1 |
| Bramsche | `h3` Undercut | `h6` hochgesteckter Knoten | „a towering vertical black bun" |
| Pommer | `h2` kurze Tolle | `h1` Kurzhaarschnitt | „short blond hair" |
| Nieselbeck | `h5` langes offenes Haar | `h1` Kurzhaarschnitt | grau, und darüber die Dienstmütze |
| Umlauf | `h4` langer Seitenscheitel | `h5` langes offenes Haar | „red hair flying loose from its tie" |

Vorblatt verliert außerdem seinen goldenen Plattenpanzer (Stufe 4) und bekommt
das Hofhemd mit Borte (Stufe 2). Ein Reichsministerialdirektor trägt keine
Rüstung; sein Porträt zeigt einen dunklen Mantel mit stumpfer Goldbordüre und
sehr hohem Kragen.

Lott und Pahl bekommen überhaupt zum ersten Mal eine Kleiderebene. Sie standen
seit W3 als bloßes Grundblatt im Dorf, weil ihre `gestalt` nur aus einer Frisur
bestand.

### G8-4. `komposit:true` entscheidet gegen das Paketblatt

Ein Paketblatt lässt sich nicht anpassen. Wo das Porträt und die fertige
Zeichnung auseinanderlaufen, muss also eines von beiden weichen, und G8
entscheidet für das Porträt: alle acht wandernden Figuren tragen jetzt
`komposit:true` und werden als Komposit gebacken, auch wenn ihr Blatt im Paket
liegt.

Das ist eine Zeile in `DORF_FIGUREN` und keine Weiche im Code. Wer bei einer
Figur das Paketblatt für die bessere Zeichnung hält, streicht dort das Flag und
bekommt es zurück; `CF_NPCS` steht unverändert und die acht Blätter bleiben
geladen.

### G8-5. Knöterich hat nur noch ein Aussehen

Er stand doppelt im Code: `drawAlter()` blittete Körper und Haar einzeln in die
Welt, der Empfang buk daneben dasselbe Gesicht als Komposit. Zwei Wege zu einer
Figur, und nur einer davon konnte einen Anzug tragen.

Jetzt gibt es `KN_GESTALT`, eine Zeile neben `KN_KEY`, und beide Wege lesen sie.
`drawAlter()` zeichnet ein Sprite statt zwei Ebenen. Die graue Tönung bleibt,
wie sie war (0,82 in der Welt, 0,30 im Porträt): „alt und grau" ist eine
Entscheidung aus E1 und keine Notlösung. Der Dreiteiler kommt darunter zum
Vorschein, statt dass die Figur unbekleidet unter der Tönung steht.

## Die Messung

`tools/portraet-farben.py` misst je Bild drei Zonen und gibt nicht die häufigste
Einzelfarbe aus, sondern den Mittelton ihrer Farbfamilie: alle Pixel der Zone,
deren Farbton höchstens 0,055 von der häufigsten abweicht, gemittelt. Der Grund
liegt in `farbBlatt()` selbst — sie legt ein Helligkeitsband um die Zielfarbe,
und die Zielfarbe ist dessen Mitte. Ein Glanzlicht oder ein Schattenrand als Ziel
zöge das ganze Blatt mit sich.

```
Figur        Grund     haarFarbe Gesicht   hemdFarbe
bramsche     #242e2b   #0d1b21   #b69a7d   #384b66
fass         #232c2d   #2d1b0e   #da804f   #793530
knoeterich*  #2a3435   #746a5a   #867a6a   #706150
lisbeth      #2e3c3f   #362620   #c78560   #656848
lott         #353423   #aa7357   #b97958   #875b46
milb*        #27322c   #68624d   #9d664c   #314f62
nieselbeck   #2d3e38   #71825f   #b4866b   #586833
noergel      #29372a   #455033   #949341   #b49354
pahl         #353423   #b87653   #e9aa81   #7e6b65
pommer       #2e393b   #b48651   #cd9f73   #9d8e63
trepp        #2c2f26   #474c61   #d5a77b   #494f63
umlauf       #2b322b   #711d0d   #925933   #524b54
vorblatt*    #112526   #171717   #d6a67d   #171717
zapf         #2d3930   #24200c   #ac815a   #8c8959
zwirn        #455148   #9f704b   #d4a370   #765937
```

Vier Zonen brauchen ein eigenes Messfenster, und jede davon ist ein Befund am
Bild und keine Geschmacksentscheidung:

* **Knöterich und Milb haben eine Hochstirn.** Die Standardzone im obersten
  Fünftel misst bei ihnen Haut. Knöterichs Grau steht über den Schläfen, Milbs
  langes Haar fällt seitlich zum Kragen — und nur links, er steht im Halbprofil.
* **Vorblatts Haar und Mantel sind dunkler als die Umrissgrenze.** Mit ihr fällt
  seine Haarzone leer aus und die Messung rutscht auf die Stirn; beim Mantel
  bliebe allein die Goldbordüre stehen, und die ist nicht der Mantel.
* **Lott und Pahl haben kein eigenes Porträt.** Motiv 11 ist ein Doppelporträt
  und lässt sich nicht in zwei Gesichter schneiden. Für die Farbe reicht es
  trotzdem: jeder füllt seine Bildhälfte, und gemessen wird nur Haar und Mantel.
  Beide Köpfe setzen erst bei knapp einem Siebtel Bildhöhe an, der Zuschnitt ist
  enger als bei den Einzelporträts — dafür ein eigenes Haarfenster.

Zwei Messwerte werden vor der Ausgabe brauchbar gemacht, beide an Bramsches
Knoten und Vorblatts Mantel aufgefallen. Ein Ziel bei Helligkeit 0,01 fiele
fast ganz auf die untere Klemme des Bandes, das Blatt verlöre seine Schattierung
und würde eine Fläche; solche Töne werden auf 0,09 angehoben und bleiben schwarz
mit Zeichnung. Und bei `#010204` liegen zwei Zahlenschritte zwischen den
Kanälen — die HSL-Rechnung liest daraus eine Sättigung von 0,6 und färbte das
halbe Blatt blau; unterhalb von acht Schritten Spanne wird der Mittelton grau
genommen. Beides steht als `brauchbar()` im Werkzeug und ist dort begründet.

## Entscheidungen, die anders hätten ausfallen können

**Warum nicht neue Sprite-Blätter malen statt umzufärben.** Weil das ein
Bilderlauf wäre und kein Bauabschnitt. Fünfzehn Figuren mal fünf
Animationsreihen mal neun Frames, in einem Stil, der zum gekauften Paket passen
muss — das ist eine andere Größenordnung als eine Farbrechnung, die es schon
gibt. Was G8 kann, ist die Farbe. Die Form bleibt Chibi.

**Warum die Paketblätter verlieren.** Sie sind besser gezeichnet als jedes
Komposit, und das bleibt wahr. Aber sie zeigen andere Menschen. Ein Spieler, der
gerade Zwirns Porträt gesehen hat und danach Farmer Bob über den Anger laufen
sieht, sieht keinen Bauern mit Bürgermeisterhut, sondern einen Fehler. Der
Widerspruch ist auffälliger als der Qualitätsunterschied, und das Porträt ist
die Figur — es ist das Bild, das im Gespräch groß und lange dasteht.
Rückgängig gemacht ist das je Figur mit einem gestrichenen `komposit:true`.

**Warum Umlauf ihren Reiseumhang trägt und nicht ihre Uniform.** Ihr Porträt
zeigt beides: eine verblichen königsblaue Kurieruniform mit Messingknöpfen und
darüber einen kurzen grauen Reiseumhang. Auf Schulterhöhe, wo gemessen wird,
liegt der Umhang. Königsblau wäre im Dorf das auffälligere Kleid, aber es wäre
nicht das, was man auf dem Bild sieht — und die Regel dieses Bauabschnitts ist,
dass das Bild gilt.

**Warum Nörgels Hemd sandfarben ist und nicht grau.** Sein Prompt verlangt
„ill-fitting grey office shirt collar", sein Bild zeigt Sand. Der Befund steht
seit dem Bilderlauf in `assets/figuren/README.md` und ist dort ausdrücklich
abgenommen worden. Dieselbe Regel: das Bild gilt, nicht der Prompt.

**Warum Lott und Pahl im Dorf fast dasselbe Haar tragen.** Weil sie es auf dem
Bild tun. Beide sind nahezu kahl, gemessen wird bei beiden überwiegend
Kopfhaut, und die Farben liegen entsprechend eng beieinander (`#aa7357` und
`#b87653`). Unterscheidbar sind sie am Mantel — braun geflickt gegen grau —,
und genau das ist auch auf dem Porträt ihr Unterschied.

**Warum die Schuhe nicht mitgefärbt werden.** Es gibt für sie keine Messung, sie
sind auf keinem Porträt zu sehen, und sie sind im Bild sechs Pixel hoch. Eine
abgeleitete Schuhfarbe wäre eine erfundene Zahl mehr, ohne dass jemand sie
sieht.

## Was ausdrücklich nicht geändert wurde

* **Die Tönung über der ganzen Figur.** Nörgel bleibt der Kobold mit grüner
  Haut, Knöterich bleibt alt und grau. Nörgels Ton wechselt von `#7a9c5a` auf
  `#949341`, weil das der gemessene Gesichtston seines Porträts ist statt eines
  geschätzten — die Stärke (0,22) bleibt.
* **Anker, Wanderleinen, Standorte.** Kein `tx`/`ty` ist angefasst worden. Die
  Rechnung aus G6 und G7, wer unter welcher Fassade steht, gilt unverändert.
* **Der Außendienst.** Er hat kein Porträt und bekommt keins; seine Frisur, seine
  Haarfarbe und seine Rüstung wechseln mit der Schicht. `bakeHeroSheet()` ist
  bis auf den umbenannten Aufruf unberührt.
* **Der Rückfallweg der Tafel.** Lott und Pahl zeigen im Gespräch weiterhin den
  Sprite-Ausschnitt aus U4. Er sieht ihnen jetzt nur ähnlicher.
* **`CF_NPCS` und die acht Paketblätter.** Sie stehen und werden geladen. Der
  Build wiegt keinen Deut mehr oder weniger: `build-single.mjs` backt ohnehin
  alles unter `assets/` ein und nicht die benutzte Teilmenge.

## Die Guards

**`figurenFarbenAssert()`**, auf Skriptebene wie `gespraechAssert()` und aus
demselben Grund: was er prüft, steht in einer Tabelle und nicht in einer
Bilddatei. Der Fehler, gegen den er steht, ist stumm — ein Tippfehler in einem
Hexwert, eine Frisur, die es nicht gibt, eine Stufe über dem Rand von
`CF_ARMOR_FILES`: nichts davon wirft. Die Figur stünde im Dorf, hätte Namen,
Schild und Gespräch, und nur ihre Farbe wäre wieder die aus dem Grafikpaket.
Genau der Ausgangszustand von G8, und er soll nicht durch die Hintertür
zurückkommen.

Sechs Prüfungen: die Frisur gibt es; jeder Farbwert ist ein Hexwert; die Stufen
liegen im Bereich der geladenen Blätter; keine Farbe ohne die Ebene, die sie
trüge; `komposit` steht nur bei Wandernden; und keine zwei Figuren sehen gleich
aus — Frisur, Haarfarbe, Hemdstufe und Hemdfarbe zusammen sind das, was man auf
24 Pixeln unterscheidet, und zwei gleiche Vierlinge im selben Dorf sind kein
Stil, sondern ein Kopierfehler.

**`tools/portraet-farben.py --pruef`** liest die Hexwerte aus `index.html`
zurück und hält sie gegen die Messung an den Bildern. Damit ist die Zusage von
G8 prüfbar und nicht bloß behauptet.

**`tools/figurenfarben-messlauf.mjs`** misst im echten Browser. Teil 1 schickt
einen selbstgebauten Graukeil durch `farbBlatt()` und rechnet nach, was
herauskommt; er braucht kein Grafikpaket. Teil 2 misst an den wirklich
gebackenen Blättern und braucht es — ohne Paket entfällt er mit einer Zeile
statt mit einem Fehlurteil, denn ein Lauf ohne Grafik kann darüber nichts sagen.

## Abnahme

Im Browser mit offener Konsole, ohne danebengelegtes Grafikpaket (Einschränkung
siehe unten).

```
U3 Gespräch: 14 Namensschilder, je vier Antworten und zwei Tafelhälften in Ordnung.
U5 Porträts: 13 gemalte Bilder zugeordnet, Sprite-Ausschnitt für lott und pahl.
G8 Figurenfarben: 15 von 15 Figuren tragen die Farben ihres Porträts.
```

Die Prüfläufe:

- `python3 tools/portraet-farben.py --pruef` — **30 von 30** Werten deckungsgleich
  (Haar und Hemd für fünfzehn Figuren), kein Unterschied zwischen Messung und
  Tabelle.
- `node tools/figurenfarben-messlauf.mjs`, Teil 1 — **6 von 6**: der Farbton der
  Zielfarbe kommt an, das Helligkeitsband beginnt und endet, wo `FARB_BAND` es
  hinlegt, die Abstufung bleibt monoton, die Hose ist das abgedunkelte Hemd, und
  ein Figurenblatt füllt den Cache nicht.
- `node tools/gespraech-pruef.mjs` — **58 von 60**, unverändert gegen den Stand
  vor G8. Die beiden offenen betreffen das zweite Bildfeld und den
  Sprite-Rückfallweg und schlagen ohne Grafikpaket auch auf `main` fehl.
- `node tools/szene-pruef.mjs` **32/32**, `tools/empfang-pruef.mjs` **59/59**,
  `tools/menue-pruef.mjs` **39/39**, `tools/reich-pruef.mjs` **35/35**.
- `dorfSichtAssert()` meldet vierzehn unsichtbare Figuren — dieselben vierzehn
  wie vor G8, gezählt in beiden Ständen. Ohne Grafikpaket hat kein Komposit
  Pixel; das ist der bekannte Zustand aus G6 und keine Folge dieses Abschnitts.

**Die Backstrecke ist mit Ersatzblättern durchgemessen worden**, weil das
lizenzierte Paket in dieser Umgebung nicht liegt: sechs geschichtete Graukeile
an der Stelle von Körper, Händen, Frisur, Hemd, Hose und Schuhen, dann
`bakeAllNpcSheets()`, dann dieselbe Messung wie Teil 2. Ergebnis: fünfzehn von
fünfzehn Figuren haben ein gebackenes Blatt, in jedem kommt sowohl die
Haarfarbe als auch die Hemdfarbe des Porträts an, und `komposit:true` schlägt
ein untergeschobenes Paketblatt bei allen acht Wandernden.

**Was diese Abnahme nicht belegt.** Wie es aussieht. Der Weg vom gemessenen
Hexwert bis in den Sprite ist nachgerechnet, das Ergebnis auf dem echten
Cute-Fantasy-Rig hat niemand gesehen. Zwei Punkte gehören deshalb an ein Bild,
bevor G8 wirklich abgenommen ist: ob Vorblatts fast schwarzer Mantel auf dem
Hofhemd noch Zeichnung hat, und ob Trepps und Nieselbecks Mützenfarbe auf einer
Frisur als Mütze durchgeht oder nur als merkwürdiges Haar.

## Was offen bleibt

- **Der Blick aufs Bild.** Siehe oben. Ein Lauf mit
  `node tools/figurenfarben-messlauf.mjs` neben dem Assets-Repo schließt Teil 2
  mit ab.
- **Die Mütze ist keine Mütze.** Trepp und Nieselbeck tragen im Porträt eine
  Dienstmütze, im Dorf eine Frisur in Mützenfarbe. Ein eigener Mützen-Layer wäre
  eine neue Grafik und damit ein Bilderlauf.
- **Nörgel ist kein Kobold.** Spitze Ohren hat das Helden-Rig nicht. Die grüne
  Tönung ist alles, was ohne neue Grafik geht.
- **Der Hautton.** Der Körper bleibt ungefärbt (siehe G8-2). Wer ihn einmal
  differenzieren will, braucht eine Rechnung, die Gesicht und Fläche
  auseinanderhält — nicht das Helligkeitsband, das hier läuft.
- **Sturz, Nachtrag, Konrad und Anlage 3** haben Porträts und keinen
  Sprechplatz. Wer ihnen eine Szene gibt, misst ihre Farben mit demselben
  Werkzeug nach; sie stehen nur deshalb nicht in der Tabelle, weil sie nicht im
  Dorf stehen.
