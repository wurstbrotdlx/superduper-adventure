# Bauabschnitt U3 — Namensschilder, Gesprächsfenster, Schriftstufe — ERLEDIGT

Drei Bitten, ein Bauabschnitt, weil sie dieselbe Stelle betreffen: **die NPCs
brauchen Namen über den Köpfen** (nicht dauerhaft, sondern wie im Genre üblich),
**echte Dialogfenster mit ein paar Optionen**, und **die Schrift darf größer
sein**. Als Vorbild ausdrücklich genannt: Stardew Valley.

## Was vorher da war

Das Dorf hatte seit W3 elf ansprechbare Figuren mit vollständigen Texten:
Anredezeile, sechs Grundzeilen, eine Aktzeile je Akt, dazu Bramsches Antworten,
der Anlass-Chor auf der Bank, die Zusatzzeilen aus Langvorgängen und aus einem
Merker (W-Nörgel). Der Weg zu alldem war ein Tastendruck auf `F`, der eine Zeile
in eine Sprechblase über dem Kopf schrieb. Vier Sekunden später war sie weg.

Drei Dinge fehlten, und alle drei am selben Ort:

1. **Wer ist das?** Über den Köpfen stand nichts. Die Monster tragen ihren
   Namen seit M2, die Nachbarn trugen keinen. Wer wissen wollte, wen er da
   anspricht, musste ihn ansprechen.
2. **Geht es weiter?** Nichts sagte, dass ein zweiter Druck auf `F` eine zweite
   Zeile bringt. Wer es nicht ausprobierte, hat von jeder Figur genau einen Satz
   gesehen, und der war die Anrede.
3. **Kann man etwas wählen?** Nein. Die Aktzeile und die Anredezeile lagen im
   Grundzeilen-Zyklus vergraben; man traf sie durch Zufall, nicht durch Absicht.

## Was jetzt da ist

### U3-1. Namensschilder über den Dorffiguren

Jede der elf Figuren bekommt ein `kurz:` in `DORF_FIGUREN`, den Namen fürs
Schild. Der volle `name:` bleibt, was er war — der Eintrag im
Personalverzeichnis, den das Gesprächsfenster in seiner Kopfzeile führt. Auf
einem Schild wäre `Wirt Bruno Fass, Gasthaus "Zum Letzten Stempel"` breiter als
das Haus dahinter.

| Figur | Schild |
|---|---|
| Bürgermeister Alfons Zwirn | Bürgermeister Zwirn |
| Registratorin Ottilie Bramsche | Registratorin Bramsche |
| Hausmeister Reinhold Zapf | Hausmeister Zapf |
| Praktikantin Lisbeth Fuhr | Praktikantin Fuhr |
| Zusteller Emil Trepp der Siebte | Zusteller Trepp |
| Nörgel, Sachbearbeiter auf Probe | Nörgel, auf Probe |
| Gutachter Dr. phil. Milb | Gutachter Milb |
| Materialausgabe Herr Pommer | Herr Pommer |
| Wirt Bruno Fass, Gasthaus … | Wirt Fass |
| Herr Lott, auf der Bank am Dorfplatz | Herr Lott |
| Herr Pahl, auf der Bank am Dorfplatz | Herr Pahl |

Knöterich bekommt eins dazu (`Amtsrat a. D. Knöterich`). Er nennt seinen Namen
ohnehin im ersten Satz des Spiels, und er ist die Figur, zu der man am
häufigsten zurückkommt.

**Nicht dauerhaft.** Das Schild blendet sich mit der Entfernung ein und aus:
bis 120 Pixel voll, zwischen 120 und 200 linear heruntergezogen, dahinter gar
nicht. Ein harter Umschlag ließe Schilder aufpoppen, sobald man einen Schritt
macht — das Dorf ist eng bebaut, und elf Schilder gleichzeitig wären ein
Kataster, kein Dorf.

**Sie verdecken sich nicht.** Der erste Anlauf zeichnete jedes Schild sofort in
der Zeichenschleife, und Lott, Pahl und Pommer sitzen nebeneinander auf der Bank
am Dorfplatz. Herausgekommen ist `Herr LotHerr PahHerr Pommer` — drei Namen,
kein lesbarer. Die Schilder werden deshalb gesammelt und erst nach der Schleife
ausgegeben: nach Deckkraft sortiert (der Nächste zuerst), und jedes landet auf
der ersten Zeile über dem Kopf, die waagerecht frei ist. Der Nächste bekommt die
unterste, wer weiter weg steht, weicht nach oben aus.

Der Umbau löst nebenbei ein zweites Problem: die Zeichenschleife sortiert nach
`y`, ein Schild aus einer früheren Zeile lag also unter dem nächsten Haus. Am
Ende gezeichnet liegen alle Schilder über allem.

### U3-2. Das Gesprächsfenster

Eine Tafel unten am Bild, im Pixelrahmen des Packs wie die übrigen Panels:
links das Bild der Figur, oben ihr voller Name, darunter der Satz (der einläuft
wie eine Schreibmaschine), darunter die Antworten als Liste. Wählbar mit der
Maus, mit den Zifferntasten und mit Pfeil hoch/runter plus Eingabe — die
Bedienung des Vorbilds.

Die Tafel liegt **unten** und nicht in der Mitte: der Gesprächspartner steht in
der Welt, und die Welt soll dabei sichtbar bleiben. Auf Mobil wandert sie nach
oben, aus demselben Grund wie alle anderen Panels — unten liegt der
Daumenfächer.

**Das Bild** ist kein neues Asset. Gezeigt wird der erste Ruheframe desselben
Blattes, das die Figur auch in der Welt trägt, fünffach vergrößert und nicht
geglättet. Der Ausschnitt ist gemessen, nicht geschätzt: die Figur steht im
64×64-Feld nicht formatfüllend, sondern klein in seiner Mitte (Farmer_Bob von
x 24 bis 39 und y 19 bis zur Fußlinie 40, das Held-Komposit von x 25 bis 37 und
y 21 bis 40). Ein erster Versuch mit dem halben Feld zeigte deshalb vor allem
leeren Rand — die Figur war vierfach vergrößert und trotzdem verloren. Genommen
wird jetzt x 21…43 und y 15…42, also 110×135 bei Faktor 5.

Nörgels grüne Tönung trägt das Bild mit, auf demselben Weg wie `drawSpriteAt()`.

**Die vier Antworten:**

| Antwort | Was sie tut | Nebenwirkung |
|---|---|---|
| „Und sonst?" | ruft `npcSprechen()` unverändert auf | ja, die bisherige |
| „Wie steht es im Dorf?" | die Aktzeile zum laufenden Akt | keine |
| „Wie war noch mein Titel?" | die Anredezeile | keine |
| „Auf Wiedersehen." | schließt | keine |

Die erste Antwort **beschriftet sich nach dem Zustand**, und zwar nach genau
denselben Bedingungen, die `npcSprechen()` gleich darauf auswertet: steht bei
Bramsche eine Frage offen, heißt sie „Ich hätte eine Frage."; hat der Chor auf
der Bank etwas gesehen, heißt sie „Wegen vorhin …". Was vorher ein
Tastendruck ins Ungewisse war, steht jetzt auf dem Knopf.

**Der Inhalt ist unverändert.** Kein Satz ist neu, keiner fällt weg, keine
Verzweigung ist dazugekommen. Was die vier Antworten tun, tat vorher der
wiederholte Tastendruck — nur dass zwei davon im Zyklus vergraben lagen. Neue
Dorftexte sind eine Inhaltslieferung (`figuren-dorf.md`) und keine UI-Frage.

**Genau ein Aufruf mit Nebenwirkung.** `npcSprechen()` rückt über
`langAnsprechen()` einen Langvorgang vor, verbraucht Bramsches Fragezähler und
setzt `letzterAnlass` zurück. Deshalb hängt es an genau einer Antwort und wird
je Klick genau einmal gerufen — wie vorher je Tastendruck genau einmal.

**Begrüßt wird ohne Nebenwirkung.** Das Öffnen zeigt die Anredezeile direkt und
ruft `npcSprechen()` *nicht*. Der erste Anlauf tat es doch, und das Ergebnis war
ein Fund: Bramsches Fragezähler wurde schon beim Aufschlagen der Tafel
aufgebraucht, die Antwortliste danach mit `bramscheFragen === 0` gebaut, und
„Ich hätte eine Frage." war eine Beschriftung, die nie erscheinen konnte.
Für alle übrigen Figuren ist die Anredezeile ohnehin derselbe Satz, den auch der
erste Druck auf `F` vorher gab (`bubbleIdx` startet bei −1, Schritt 0 ist die
Anrede). Wer die alte Reihenfolge will, drückt `F` zweimal — der zweite Druck
redet in der offenen Tafel weiter.

**Eingefügt, nicht danebengestellt.** Die Tafel steht als achter Eintrag im
`PANEL_REGISTER` aus U1, und zwar an erster Stelle, weil sie mit `z-index 21`
über den Panels liegt. Damit erbt sie ohne eine eigene Zeile: den Schleier, das
Dämpfen der Musik, `Esc` als oberste Ebene, und die U1-Regel „neben ein Menü
klicken schließt es, ohne dabei anzugreifen". Geschlossen wird sie außerdem in
`respawnPlayer()`, `startShift()` und `endShift()` — `npcs` wird dort geleert,
ein festgehaltener Eintrag wäre eine Leiche mit Sprechblase — und von selbst,
wenn der Spieler weiter als 96 Pixel weggeht.

**Die Tastatur teilt sich.** Solange die Tafel offen ist, gehören ihr die
Ziffern, Pfeil hoch/runter und die Eingabetaste. Ohne das wäre die `1`
gleichzeitig eine Antwort und ein Heiltrank. `Q` bleibt der Trank, `WASD` bleibt
das Gehen, die Leertaste bleibt der Schlag: ein offenes Panel nimmt in diesem
Spiel den Kampf nicht weg (U1).

### U3-3. Die Schriftstufe

Die 176 `font-size`-Angaben dieser Datei standen als feste Pixelzahlen da,
verteilt über den `<style>`-Block **und** über die Inline-Stile, die der
JavaScript-Teil in seine Panels schreibt. „Größer" war damit kein Handgriff,
sondern 176. Jede Angabe lautet jetzt `calc(Npx * var(--fs))` — die Zahl bleibt
die kalibrierte, der Faktor kommt von `:root`. Auch die Inline-Stile erben ihn,
weil eigene Eigenschaften vererbt werden und dort ganz normales CSS steht.

Drei Stufen (1 · 1,2 · 1,45), wählbar im Inventar unter **SCHRIFT**, gemerkt in
`localStorage` neben `sda_targetPriority`. Der Wert beschreibt den Bildschirm,
an dem gespielt wird, nicht die Laufbahn der Person des Tages — er gehört
deshalb nicht in den Spielstand, und ein neuer Dienstantritt ändert nichts
daran. Ausgeliefert wird **Stufe 1**, nicht 0: die Bitte lautete, die Schrift
dürfe größer sein, und eine Voreinstellung, die man erst suchen muss, wäre keine
Antwort darauf.

Nicht erfasst sind die Schriften im Canvas — sie sind Konstanten, weil sie sonst
pro Frame entstünden (R6/F73). Die drei, bei denen es ums Lesen geht, baut
`schriftAnwenden()` bei jedem Stufenwechsel einmal neu: Namensschild,
Monsterschild und Sprechblase. Ihre Grundzahlen sind dabei **einmalig um zwei
Pixel angehoben** (Namensschild 10 → 12, Vorgangsart 9 → 10, Blase 11 → 13);
das war die kleinste Schrift im ganzen Spiel, in der Welt gezeichnet und nicht
in einem Menü. Stufe „Normal" ist also für jede CSS-Angabe exakt der Stand vor
U3, für diese drei Canvas-Schriften nicht.

Das **Kammerschild** bleibt bewusst außen vor: seine 9px sind gegen eine 68px
breite Holztafel gerechnet (`drawKammerTuer`), größere Schrift liefe dort über
den Rand.

## Nebenbefund: der Vordruck ließ sich auf dem Telefon nicht wegklicken

`tools/menue-pruef.mjs` fiel nach der Schriftänderung mit *„Element is outside of
the viewport"* aus — am `WEITER`-Knopf des Einstellungsvordrucks, auf 390×844.

Nachgemessen: der Vordruck ist auf dieser Bildgröße **868 Pixel hoch und war es
schon vorher**, bei einem Bild von 844. `#overlay` zentrierte ihn mit
`align-items:center` und rollte nicht. Ein Flex-Kind, das höher ist als sein
zentrierender Behälter, wächst nach **beiden** Seiten aus ihm heraus, und der
Überhang ist dann nicht erreichbar — auch nicht per Rollbalken. Die größere
Schrift hat den Fehlstand nicht erzeugt, sie hat ihn von 24 auf 169 Pixel
vergrößert und damit sichtbar gemacht.

Behoben mit `overflow-y:auto` und `margin:auto` am Panel statt `align-items`:
zentriert genauso, lässt den Überhang aber rollen. `touch-action` steht auf
`pan-y` statt `manipulation`, damit der Daumen ihn auch bewegt. Geprüft wird das
mit einem echten Wisch (`Input.dispatchTouchEvent`), nicht mit einem gesetzten
`scrollTop`, und auf der höchsten Schriftstufe, weil dort am meisten überhängt.

## Guards

Zwei neue, beide melden und werfen nicht:

- **`gespraechAssert()`** — jede Dorffigur hat ein Schild, es liegt unter 24
  Zeichen, und sein letztes Wort kommt im vollen Namen vor (die Falle beim
  Nachtragen einer zwölften Zeile per Kopie). Jede Figur bekommt genau vier
  Antworten, keine leer, keine über 28 Zeichen, jede mit einer Wirkung. Der
  Porträtausschnitt liegt im 64er-Raster.
- **`schriftAssert()`** — Stufe 0 ist 1,0, die Stufen steigen, die gewählte
  liegt im Bereich, und `--fs` steht wirklich auf ihr.

Sie stehen an **zwei** Stellen und nicht an einer: `SCHRIFT_STUFEN` ist weiter
unten deklariert als `gespraechAssert()`, ein Zugriff von dort wäre ein
`ReferenceError` durch Temporal Dead Zone — genau der Fehler, den `node --check`
nicht findet (README). Aus demselben Grund ist der Zeichendeckel in
`gespraechAssert()` eine eigene Zahl und kein Verweis auf die Konstanten aus
`drawNpcName()`.

Damit sind es sechzehn selbstaufrufende Guards.

## Prüfprotokoll

`tools/gespraech-pruef.mjs`, im echten Browser, 44 Soll-Ist-Vergleiche,
Exit-Code 1 bei der ersten Abweichung:

```
python3 serve.py &
PLAYWRIGHT_PFAD=… CHROMIUM=… node tools/gespraech-pruef.mjs
```

```
ok    Schild in Rufnaehe voll sichtbar                         ist=1 soll=1
ok    Schild dazwischen halb durchsichtig                      ist=true soll=true
ok    Schild ausser Reichweite gar nicht                       ist=0 soll=0
ok    alle elf Kurznamen unter dem Deckel                      ist=true soll=true
ok    alle drei Bankschilder gezeichnet                        ist=3 soll=3
ok    kein Bankschild verdeckt ein anderes                     ist=0 soll=0
ok    Kontextaktion bietet Ansprechen an                       ist="Ansprechen" soll="Ansprechen"
ok    F oeffnet die Tafel                                      ist=[true,true] soll=[true,true]
ok    Tafel nennt den vollen Namen                             ist="Bürgermeister Alfons Zwirn" …
ok    Tafel bietet vier Antworten                              ist=4 soll=4
ok    letzte Antwort ist der Abschied                          ist="4. Auf Wiedersehen." …
ok    offene Tafel setzt den Schleier                          ist=true soll=true
ok    Satz laeuft ein (erst kuerzer)                           ist=true soll=true
ok    Satz steht danach vollstaendig                           ist=… soll=…
ok    Ziffer waehlt eine Antwort                               ist=… soll=…
ok    die '1'-Reihe gibt dabei keinen Trank aus                ist=2 soll=2
ok    Tafel bleibt dabei offen                                 ist=true soll=true
ok    Pfeil bewegt die Auswahl                                 ist=1 soll=1
ok    Pfeil laeuft am Anfang um                                ist=3 soll=3
ok    und am Ende wieder zurueck                               ist=0 soll=0
ok    Klick neben die Tafel schliesst sie                      ist=false soll=false
ok    und fuehrt dabei keinen Angriff                          ist=0 soll=0
ok    Schleier wieder aus                                      ist=false soll=false
ok    F oeffnet erneut                                         ist=true soll=true
ok    Esc schliesst die Tafel                                  ist=false soll=false
ok    "Auf Wiedersehen" schliesst                              ist=false soll=false
ok    wer weggeht, beendet das Gespraech                       ist=false soll=false
ok    Stufe "Normal" setzt --fs auf 1                          ist=1 soll=1
ok    Stufe "Groesser" setzt --fs hoeher                       ist=true soll=true
ok    eine gemessene Schriftgroesse waechst mit                ist=true soll=true
ok    die Weltschrift waechst mit                              ist=true soll=true
ok    die Stellung wird gemerkt                                ist="2" soll="2"
ok    genau ein Knopf steht auf an                             ist=1 soll=1
ok    Konsole still (Desktop)                                  ist=[] soll=[]
ok    Tafel haengt auf Mobil oben                              ist=true soll=true
ok    Tafel laesst den Daumenfaecher frei                      ist=true soll=true
ok    Tafel steht waagerecht im Bild                           ist=true soll=true
ok    kein Wort laeuft ueber den Rand                          ist=true soll=true
ok    Tipp auf den Abschied schliesst                          ist=false soll=false
ok    Konsole still (Touch)                                    ist=[] soll=[]
ok    Vordruck ist hoeher als das Bild                         ist=true soll=true
ok    der Knopf steht anfangs unter dem Rand                   ist=false soll=false
ok    ein Wisch rollt den Vordruck                             ist=true soll=true
ok    der WEITER-Knopf ist danach erreichbar                   ist=true soll=true

44 von 44 Pruefungen bestanden.
```

Dazu, ohne Abweichung:

- `tools/menue-pruef.mjs` — **39 von 39**, die sieben Panels aus U1 verhalten
  sich unverändert.
- Ladelauf im Browser: alle Guards melden „in Ordnung", die Konsole ist sonst
  still. Die zwei neuen Zeilen lauten
  `U3 Gespräch: 11 Namensschilder und je vier Antworten in Ordnung.` und
  `U3 Schrift: 3 Stufen, gewaehlt 1 (Faktor 1.2), in Ordnung.`
- `node tools/build-single.mjs` und die entstandene `dist/index.html` per
  `file://` geladen: gleiche Meldungen, keine zusätzlichen.

## Was offen bleibt

- **Neue Dorftexte.** Die Tafel hat jetzt Platz für mehr als drei Antworten je
  Figur. Was dort stünde, ist eine Inhaltsfrage und gehört in `figuren-dorf.md`
  und an der Weltbibel vorbei, nicht in einen UI-Bauabschnitt.
- **Der Einstellungsvordruck auf kleinen Bildern.** Er rollt jetzt, aber der
  `WEITER`-Knopf steht auf 390×844 in jeder Schriftstufe unter dem Rand. Ihn
  am unteren Rand festzuheften, während der Vordruck darüber rollt, wäre der
  nächste Schritt; das ist ein Umbau am Overlay und nicht an U3.
- **Knöterich** hat ein Schild, aber kein Gesprächsfenster: seine Zettel-
  Maschinerie ist eine eigene und bleibt es.
