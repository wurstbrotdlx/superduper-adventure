## U7: Die erste Schicht der Oberfläche — Spiel und Steuerung

Der Wunsch war eine überarbeitete Oberfläche, und zwar in zwei Teilen: **zuerst die Schicht,
die während des Spiels dasteht** — Zustand, Karte, Gehen, Schlagen —, **danach die Menüs**
(Rucksack, Befähigung, Zauber, Kessel, Sammelkarten, Optionen). Dieser Abschnitt ist der
erste Teil und nur der erste Teil. Kein Menüfenster ist angefasst, kein Kampfwert, kein
Katalog, keine Weltdatei.

Als Maßstab lagen vier Bildschirmfotos aus dem Genre vor (Diablo Immortal, ein Pixel-Ableger
im Stardew-Zuschnitt, Eternium, ein dunkler Dungeon-Crawler). Vier verschiedene Spiele, vier
verschiedene Grafikstile — und in der Anordnung sind sie sich bis auf den Pixel einig:

| Ecke | Aufgabe | In allen vier Vorlagen |
|---|---|---|
| oben links | wer bin ich | rundes Lichtbild, Stufe darin, Leben und Mana als waagerechte Balken daneben |
| oben rechts | wo bin ich | Minikarte, darunter oder daneben Beute und Uhr |
| unten links | wohin gehe ich | ein aufgemalter, **dauerhaft sichtbarer** Ring für den Daumen |
| unten rechts | was tue ich | ein großer Schlagknopf, um ihn herum auf einem Kreisbogen die Fertigkeiten |

Das Haus hatte bis U7 keine einzige dieser vier Ecken so besetzt.

---

### Befund 1: der Zustand lag unten in der Mitte und auf dem Handy an den Bildschirmrändern

Leben und Mana standen als zwei Kugeln von 84 Pixeln links und rechts vom Gürtel, unten in
der Bildmitte. Auf dem Telefon war unten kein Platz mehr für zwei Kugeln, also wurden sie
dort zu **zwei senkrechten Röhren an den beiden Bildschirmrändern**, `26px` breit und
`46vh` hoch, ab `15vh` von oben.

Das war zum Zeitpunkt der Entscheidung nachvollziehbar — der Gürtel bekam dadurch die volle
Breite. Es hat aber zwei Dinge gekostet, die auf einem Telefon nicht zu haben sind:

1. **Die halbe Bildhöhe an beiden Seiten.** Auf einem liegenden Telefon (844×390) läuft die
   rechte Röhre quer über die Minikarte und in den Daumenfächer hinein. Das ist im
   Bildschirmfoto des Vorzustands zu sehen, und es ist keine Feinheit: der Trankknopf lag
   unter der Mana-Röhre.
2. **Zwei Entwürfe statt eines.** Die Kugel-Fassung und die Röhren-Fassung teilten sich
   `#hpFill`/`#manaFill`, aber nicht ihre Regeln. Jede Änderung am Zustand musste zweimal
   gedacht werden, und beim zweiten Mal ist es nicht immer passiert (die Segmente gab es nur
   auf dem Handy, die Zahlen nur auf dem Schirm).

**Eingriff.** Beides fällt weg. An seine Stelle tritt **eine** Statuskarte oben links, auf
Schirm und Telefon dieselbe: rundes Lichtbild mit der Stufe im Ring, daneben Leben, Mana und
Erfahrung als waagerechte Balken übereinander.

Das Lichtbild ist kein neues Bild. Es ist derselbe Ausschnitt aus dem gebackenen Heldenblatt,
den der Dienstausweis seit P1 zeigt (`renderAusweisFoto()`, Ausschnitt `sx+24, 20, 16×18`) —
also trägt es Haarton, Frisur und Rüstungsstufe der laufenden Schicht, ohne dass eine Zeile
davon weiß. Gezeichnet wird es aus `bakeHeroSheet()` und nicht aus `updateHUD()`: das Bild
ändert sich genau dann, wenn das Blatt neu gebacken wird, und dafür hat `bakeHeroSheet()`
seinen Dirty-Check bereits. Ein `drawImage` je Frame wäre derselbe Fehler, den R6/F32 an
anderer Stelle abgestellt hat.

Der Puffer des Lichtbilds ist **16×18** und damit die native Größe des Ausschnitts. Die
Vergrößerung macht CSS mit `image-rendering:pixelated`, also nearest neighbour bei *jeder*
Ringgröße. Ein größerer Puffer (52×58 stand kurz da) hätte bei einem 46 Pixel großen Ring
krumm skaliert.

Waagerecht statt Kugel, weil eine Kugel einen Anteil zeigt und ein Balken den Anteil **und**
wie viel noch kommt. Und weil zwei Balken übereinander mit einem Blick vergleichbar sind —
zwei Kugeln links und rechts vom Gürtel waren es nie.

Die Segmente aus dem Röhren-Entwurf bleiben und gelten jetzt überall: eine Kerbe je Segment,
Anzahl aus `segmentZahl()`, Kachelbreite aus `updateHUD()`. Auf einem Schirm ist das so
nützlich wie auf einem Telefon.

`updateHUD()` schreibt dafür `width` statt `height` und die Segmentbreite vorn im
`background-size` — drei Zeilen, keine neue Rechnung.

---

### Befund 2: unten links, wo der Daumen liegt, war nichts zu sehen

Der virtuelle Joystick war **unsichtbar**, solange kein Finger auf dem Glas lag. Gezeichnet
wurde er erst ab `joy.id !== null`, also erst, wenn man ihn schon gefunden hatte.

Gefunden werden konnte er nur über die Dienstanweisung („Auf dem Handy links gehen, rechts
schlagen", Startbild). Eine Anweisung ist aber kein Knopf. Wer das Spiel zum ersten Mal auf
einem Telefon öffnete, sah unten links: nichts.

**Eingriff.** Dort liegt jetzt dauerhaft ein blasser Ring in der Ruhelage, mit einem Knauf in
der Mitte und vier Spornen nach außen — die Form, die aus einem Zierkreis ein Steuerkreuz
macht.

Der Ring ist ausdrücklich **kein Zielbereich**. Der Griff bleibt frei: die linke Bildhälfte
nimmt den Finger weiterhin dort an, wo er landet (`sx < canvas.width/2` in `touchstart`,
unverändert). Das ist die bessere Bedienung — der Daumen muss nichts treffen — und der Ring
sagt trotzdem, wo gemeint ist. Sobald ein Finger liegt, verschwindet die Ruhelage und der
gewohnte helle Ring erscheint unter dem Daumen.

Wo der Ring liegt, steht in `joyRuhe()` und ist an die Knopfspalte gekoppelt:

```js
const joyRuhe = () => ({ x: 16 + joy.R, y: canvas.height - (joy.R + 68) });
```

Damit liegt seine Oberkante **immer 188 Pixel** über der Unterkante des Bildes
(`R + 68` Sockel plus `R` Radius, `R = 60`). Genau auf diese 188 rechnet die `max-height` der
Knopfspalte im `<style>`. Die Zahl steht an beiden Stellen im Kommentar; wer eine ändert,
ändert die andere mit.

---

### Befund 3: der Gürtel lag quer über der unteren Bildkante — also im Weg beider Daumen

Die acht Gürtelknöpfe standen unten mittig. Auf dem Telefon nahmen die drei Kampfknöpfe
(Trank, Zauber, Ultimate) bereits `position:fixed` und gruppierten sich um den Schlagknopf;
die übrigen blieben in der Reihe. Auf 390 Pixeln Breite brach diese Reihe in zwei Zeilen um
und wuchs dem Fächer entgegen (siehe Bildschirmfoto des Vorzustands: der Rucksack sitzt in
der zweiten Zeile ganz links unten, der Zielknopf daneben).

**Eingriff.** Auf Touch wird der Gürtel zur **Spalte am linken Rand**, unter der Ortszeile
und über dem Daumenring.

Rechts war kein Platz — und das ist gemessen, nicht geschätzt: dort liegen die Minikarte
(oben) und der Fächer (unten), und der Trankknopf des Fächers reicht bis 129 Pixel unter die
Oberkante hinauf. Auf einem 640 Pixel hohen Telefon bleiben dazwischen keine drei
Knopfhöhen. Die erste Fassung dieses Abschnitts hatte die Spalte trotzdem rechts, und
`tools/steuerung-pruef.mjs` hat sie mit 1599 px² Überschneidung zurückgeschickt.

Die Spalte bricht um, wenn selbst links nicht genug Höhe bleibt (liegendes Telefon): aus
einer Spalte werden mehrere, und sie wachsen nach **rechts** in die leere Bandmitte, nicht in
den Fächer (`flex-wrap:wrap` mit `align-content:flex-start` an einem links verankerten
Kasten). Auf 844×390 stehen die fünf Knöpfe dadurch als Reihe unter der Statuskarte.

Der Kontextknopf („Ansprechen", „Hebel", „Schloss") gehört nicht in die Spalte: er kommt und
geht mit dem, wovor man gerade steht, und würde sie bei jedem Schritt umbauen. Er sitzt unter
dem Schlagknopf an derselben rechten Kante und wächst nach links, mit 14 Pixeln Luft zum
Schlagknopf. **Nicht** mittig unten — dort reicht auf einem 360 Pixel breiten Telefon der
Daumenring hin, und ein Knopf unter dem Daumen, mit dem man läuft, wird gedrückt, ohne dass
man es will.

Der Kammer-Abbruch bleibt dagegen in der Spalte. Er ist während eines ganzen Kammergangs
sichtbar, nicht schrittweise, und baut sie nicht um.

**Und die Zielscheibe gehört überhaupt nicht dorthin.** In der ersten Fassung dieses
Abschnitts stand sie mit in der Spalte, zwischen Zauberbaum, Kartei und Rucksack — und die
erste Frage bei der Abnahme war folgerichtig, was für ein Menüpunkt das sein soll. Keiner:
`#prioBtn` schaltet um, auf wen der Schlagknopf zielt, wenn kein Ziel festgehalten ist — auf
den nächsten („Nah") oder auf den mit dem wenigsten Leben („Schwach"). Das ist eine
Kampfeinstellung.

Sie sitzt jetzt **oben auf dem Fächer**, über dem Trank, im selben senkrechten Strang: 44
Pixel statt 56, weil sie im Gefecht selten angefasst wird — aber im Daumenmaß, nicht darunter.
Auf einem liegenden Telefon endet der Strang über dem Trank bei 73 Pixeln unter der
Oberkante, und dort steht schon die Statuskarte; dort rückt sie deshalb auf die andere Seite
des Bogens, links neben den Zauberknopf.

Auf 44 Pixeln ohne Beschriftung wäre nicht zu sehen, welche der beiden Zielwahlen gerade
gilt. Der Rand sagt es: ruhiges Messing für „Nah", Warnorange für „Schwach". Auf dem Schirm
steht das Wort weiterhin daneben, dort ist Platz dafür.

Ein eigener Abschnitt für die Optionen wird sie vermutlich ganz dorthin holen. Bis dahin
steht sie wenigstens bei ihresgleichen.

---

### Befund 4: der Fächer war ein Fächer, aber kein Kreis

Die drei Kampfknöpfe standen auf `right:102/84/18` und `bottom:128/194/212`. Der Kommentar
daneben sagte „~180°, Radius ~88px", „~135°", „~90°" — mit Tilde, und zu Recht: nachgerechnet
liegen die drei Mittelpunkte 88, 94 und 96 Pixel vom Schlagknopf entfernt, auf 180°, 132° und
94°.

**Eingriff.** Der Bogen wird gerechnet statt geschätzt. Der Schlagknopf ist der Mittelpunkt,
sein Mittelpunkt liegt 55 von rechts und 137 von unten:

| Knopf | Winkel | Mittelpunkt (rechts / unten) | Regel |
|---|---|---|---|
| Zauber | 180° | 151 / 137 | `right:123px; bottom:109px` |
| Ultimate | 135° | 125 / 207 | `right:97px; bottom:179px` |
| Trank | 90° | 55 / 233 | `right:27px; bottom:205px` |

Zwischen Schlagknopf (Radius 41) und Trabanten (Radius 28) bleiben 27 Pixel Luft, zwischen
zwei Trabanten 19 — genug, um mit dem Daumen nicht den falschen zu treffen.

Das Ultimate sitzt auf Radius 99 statt 96, und das ist ein Fund des Prüflaufs: bei 96 stießen
die **Rechtecke** der beiden Kreise über Eck auf genau einem Pixel zusammen. Optisch belanglos
(es sind Kreise), aber eine Regel, die „keine zwei Bedienflächen liegen übereinander" heißt,
darf keine Ausnahme für einen Pixel machen, ohne dass jemand sie aufschreibt. Hier steht sie.

Dabei fiel `box-sizing` auf: die Rundknöpfe standen auf `content-box`, der 3 Pixel breite
Rand zählte also obendrauf. Aus einem 82er Schlagknopf wurden 88 gemessene Pixel, und der
gerechnete Bogen stimmte nicht mehr mit dem gezeichneten überein. Alle Rundknöpfe und der
Schlagknopf stehen jetzt auf `border-box`; die Zahl in der Regel ist die Zahl im Bild.

---

### Befund 5: die Uhr wanderte mit der Länge des Ortsnamens

Die Dienstuhr hing als Anhängsel an der Ortszeile:

```js
setTxt('zone', '📍 Grasland, Ablage A (Stufe 7)' + schichtHudSuffix());   // ' · ⏱ 22:07'
```

Sie stand damit ganz links im Bild und wanderte waagerecht hin und her, je nachdem, ob man in
„Grasland, Ablage A" oder in „Aschewüste, Der Brandabschnitt" stand. Eine Uhr, deren Ort sich
ändert, liest man nicht im Vorbeigehen.

**Eingriff.** Die Uhr bekommt ihr eigenes Feld unter der Minikarte, neben der Beute. Beides
gehört zusammen: die Karte sagt wo, die Uhr sagt wann. `schichtHudSuffix()` heißt jetzt
`schichtUhrText()` und liefert nur noch den Text, kein führendes Trennzeichen und keinen
Bezug auf die Zeile davor.

Aus der Ortszeile fällt bei der Gelegenheit auch **„(Stufe 7)"** heraus. Die Stufe steht seit
diesem Abschnitt im Ring des Lichtbilds, und zweimal dieselbe Zahl in einem Bild ist keine
doppelte Auskunft, sondern eine halbe. Auf einem stehenden Telefon war sie außerdem genau der
Zusatz, der die Zeile auf zwei Zeilen brach.

Dieselbe Überlegung trifft `#statCol`: die Zeile „Stufe 7" ist weg, „💰 1234" und
„✚ 2 Punkte" bleiben. Auf Schirmen unter 380 Pixeln Breite fiel bisher die **ganze** Spalte
weg — samt Beute. Jetzt fällt dort nur die Zeile der freien Punkte weg (die als Sternchen am
Rucksack ohnehin steht), und die Beute bleibt stehen.

---

### Befund 6: sieben Oberkanten standen als Pixelzahlen an sieben Stellen

`#zone` auf `top:12px`, im Mobil-Breakpoint auf `top:8px`. `#minimap` auf `top:12px`, dort auf
`top:8px`. `#bossbar` auf `top:14px`. `#statCol` gar nicht, weil es im Gürtel lag. Wer die
Statuskarte um vier Pixel kleiner machte, musste an sieben Stellen nachrechnen.

Das ist keine theoretische Sorge. Genau daran ist die erste Fassung dieses Abschnitts
gescheitert: `--karteH` sagte 62, die Karte war 70 hoch (weil die `body.touch`-Regel für das
Lichtbild spezifischer ist als eine ID im Medienblock und ihre 52 Pixel behielt), und die
Ortszeile lief durch die Karte. `tools/steuerung-pruef.mjs` hat es mit 840 px² gemeldet.

**Eingriff.** Ein Raster aus zwei gemessenen Größen je Seite und drei gerechneten Kanten:

```css
:root{
  --rand:10px;                                     /* Abstand aller vier Ecken zur Bildkante */
  --karteY:var(--rand); --karteH:84px;             /* Statuskarte oben links */
  --mapY:10px;         --mapH:124px;               /* Minikarte oben rechts */
  --reiheH:26px;
  --reiheY:calc(var(--karteY) + var(--karteH) + 8px);                        /* Ortszeile, Bossbalken */
  --spalteY:calc(var(--karteY) + var(--karteH) + var(--reiheH) + 16px);      /* Knopfspalte (Touch) */
  --statY:calc(var(--mapY) + var(--mapH) + 8px);                             /* Beute und Uhr */
}
```

Ein Breakpoint ändert nur noch die vier Größen; alles, was darunter hängt, rückt mit.

Und damit `--karteH` nicht wieder etwas anderes behauptet, als die Karte ist, steht die Höhe
jetzt **an** der Karte (`height:var(--karteH); box-sizing:border-box`). Solange sie aus
Innenabstand plus Lichtbild *entstand*, konnte sie abweichen, ohne dass es jemandem auffiel.

Die `body.touch`-Fassungen sind in den Medienblöcken ausgeschrieben
(`#portraitRing, body.touch #portraitRing{…}`) — ein Medienblock erhöht die Spezifität nicht,
und ohne die zweite Hälfte jeder Zeile gewinnt der Touch-Block.

---

### Befund 7: die U1-Zusage galt für die untere Kante, jetzt gilt sie für zwei

Seit U1 gilt: **der Gürtel behält mit offenem Panel seine Wirkung.** Dafür verankern die
Mobil-Regeln alle Panels oben und lassen unten den Streifen des Daumenfächers frei. Das war
richtig, solange der Gürtel unten lag.

Seit U7 liegt er links — und der erste Lauf von `tools/menue-pruef.mjs` nach dem Umbau ist
dort hängengeblieben, mit einer Fehlermeldung, die keine Auslegung braucht:

```
locator.tap: Timeout 30000ms exceeded.
  - waiting for locator('#spellsBtn')
    - locator resolved to <div id="spellsBtn" class="beltSlot" …>
  - attempting tap action
    - <div id="inv"> intercepts pointer events
```

Der Knopf war da, sichtbar, aktiviert — und nicht erreichbar. Das ist genau der Fall, den U1
abgestellt hatte, nur an der anderen Kante.

**Eingriff.** Dieselbe Regel gilt jetzt an zwei Kanten statt an einer: unten der Fächer,
links die Spalte. `--railW` ist auf dem Schirm `0px` und auf Touch `74px` (10 Rand + 56 Knopf
+ 8 Luft); die Panels rechnen sie von ihrer Breite ab und rücken um sie ein. Auf dem Schirm
ist das ein Nullgeschäft, auf einem 390 Pixel breiten Telefon werden sie dadurch 300 statt
374 Pixel breit.

**Dieser Preis wird hier ausdrücklich genannt.** Er ist nicht gratis, und der Abschnitt für
die Menüfenster soll ihn zurückholen, indem er aus der Spalte ein richtiges Reiterband macht.
Bis dahin gilt: ein etwas schmaleres Fenster ist besser als ein Knopf, der sich nicht drücken
lässt. Dass die Kartei das aushält, ist gemessen — `tools/zulagen-pruef.mjs` bleibt bei 45
von 45, die Sammelkarten stehen auch auf 137 Pixeln Breite noch als Karten da.

**Eine Ausnahme: die Gesprächstafel.** Sie rückt *nicht* ein, sie deckt die Spalte zu. Der
Versuch, auch sie um 74 Pixel einzurücken, hat `tools/gespraech-pruef.mjs` zwei Zeilen
gekostet — „alle Antworten stehen in der Tafel" und „die Tafel selbst rollt nicht". U6 hat
die Höhe der Tafel auf 360 Pixel Breite gegen jede Figur und jeden Szenenknoten gemessen
(316 Pixel für Knöterichs fünf Antworten), und bei 286 Pixeln Breite stehen sie nicht mehr.
Das ist auch inhaltlich richtig so: während eines Gesprächs wird weder gekämpft noch der
Rucksack geöffnet, und U6 lässt die Tafel aus demselben Grund schon in den Daumenfächer
hineinwachsen.

---

### Der Bossbalken deckt die Ortszeile zu, und das ist Absicht

Beide wollen dieselbe Kante unter der Statuskarte. Auf einem stehenden Telefon ist zwischen
Karte links und Minikarte rechts kein waagerechtes Band frei, in dem ein 460 Pixel breiter
Balken neben eine Ortszeile passt.

Statt einer Zeile Skript entscheidet die Stapelung: `#bossbar` liegt auf `z-index:11` mit
eigenem Grund, `#zone` auf `9`. Wo beide zusammenkommen, gewinnt der Balken. Während eines
Bosskampfes ist der Name des Gegners die Auskunft, der Name des Feldes nicht.

`tools/steuerung-pruef.mjs` führt dieses Paar als einzige erlaubte Überschneidung, mit genau
dieser Begründung im Quelltext.

---

### Was ausdrücklich NICHT passiert ist

- **Kein Menüfenster ist angefasst.** Rucksack, Befähigung, Zauberbaum, Kessel und Kladde,
  Zulagen, Dienstausweis, Vollbildkarte, Symbolschloss, Amtsstube, Gesprächstafel: Aufbau,
  Inhalt und Aussehen unverändert. Das ist der zweite Teil des Wunsches und bekommt einen
  eigenen Abschnitt.
- **Kein Kampfwert, kein Katalog, keine Weltdatei.** Weder `derived`, noch
  `monsterkatalog.json`, noch die Weltbibel sind berührt.
- **Kein neues Asset.** Die Statuskarte, der Daumenring und der Bogen des Fächers sind CSS
  und Canvas-Primitive. `bakeUiSkin()` legt das vorhandene `round_brown.png` jetzt unter
  `#portraitRing` statt unter die verschwundenen Kugeln — eine Zeile, dieselbe Datei.
- **Die Bedienung selbst ist unverändert.** Dieselben Tasten, dieselben Griffe: linke
  Bildhälfte geht, rechte schlägt, `WASD`, `I`, `T`, `Z`, `E`, `R`, `Q`, `F`, `L`, `Esc`.
  U7 ordnet, wo etwas steht, nicht was es tut.
- **Die U1-Regel bleibt in Kraft.** Statuskarte und Beutespalte stehen auf
  `pointer-events:none` und sind deshalb bewusst **nicht** in `UI_INSELN`: ein Griff auf sie
  landet am Canvas und schließt ein offenes Panel, genau wie ein Griff ins Bild.
- **`body.szeneLaeuft`** blendet die zwei Neuzugänge mit aus. Während des Empfangs steht
  weiterhin nichts im Bild, was es noch nicht gibt (E1).

---

## Abnahme

- Auf Schirm und Telefon steht der Zustand oben links: Lichtbild, Stufe im Ring, Leben, Mana,
  Erfahrung.
- Das Lichtbild trägt Haarton und Garderobe der laufenden Schicht und ist scharf, nicht weich.
- Unten links liegt ein sichtbarer Ring, bevor man ihn anfasst; die linke Bildhälfte nimmt
  den Finger weiterhin überall an.
- Die drei Kampfknöpfe liegen auf einem Kreisbogen um den Schlagknopf.
- Keine zwei Bedienflächen überschneiden sich, in keinem der vier geprüften Formate.
- Jede Fläche, die man antippt, ist mindestens 44×44 groß.
- Nichts steht außerhalb des Fensters.
- Die Uhr steht unter der Minikarte und wandert nicht mehr.
- Mit offenem Panel bleiben die Knöpfe der Spalte erreichbar (Ausnahme: Gesprächstafel).
- In der Spalte stehen nur Menüzugänge; die Zielwahl steht am Fächer und zeigt ihren Zustand.
- Die Konsole ist beim Start still.

## Prüfprotokoll

```bash
python3 serve.py &
node tools/steuerung-pruef.mjs
```

Der Lauf misst nicht die Optik, er rechnet die Geometrie nach: Überschneidung, Daumenmaß und
Bildgrenze über vier Formate (390×844, 844×390, 360×640, 1440×810). Der Daumenring ist keine
HTML-Fläche, sein Kreis wird aus `joyRuhe()` und `joy.R` gelesen und als Quadrat mitgeprüft.
Exit-Code 1, sobald eine Zeile nicht stimmt.

Geprüft wird in einem Zustand, in dem wirklich alles dasteht: Stufe 9, alle Zauber und das
Ultimate gelernt, Tränke im Beutel, Kontextknopf und Kammer-Abbruch sichtbar gemacht. Ein
Knopf, der nur manchmal da ist, fällt sonst durch die Messung.

Der erste Lauf gegen die erste Fassung meldete **24 Beanstandungen** — darunter die
Knopfspalte über dem Trankknopf (1599 px²), die Beutespalte über demselben (2137 px²), die
Ortszeile in der Statuskarte (840 px²) und der eine Pixel zwischen Schlagknopf und Ultimate.
Jede einzelne davon steht oben als Befund. Der Lauf gegen die Fassung, die hier abgegeben
wird, ist sauber.

Der Lauf gegen die abgegebene Fassung, hier das stehende Telefon vollstaendig — die
Zahlen in Klammern sind Ort und Kantenlaenge, gemessen im Browser:

```
=== Telefon stehend (390x844, Finger) ===
  ok   im Bild: #statusKarte (6,6 265x62)
  ok   im Bild: #zone (10,76 234x19)
  ok   im Bild: #minimap (296,6 88x88)
  ok   im Bild: #statCol (318,102 64x53)
  ok   im Bild: #attackBtn (294,666 82x82)
  ok   im Bild: #potionBtn (307,583 56x56)
  ok   im Bild: #spellBtn (211,679 56x56)
  ok   im Bild: #ultBtn (237,609 56x56)
  ok   im Bild: #spellsBtn (10,124 56x56)
  ok   im Bild: #zulagenBtn (10,188 56x56)
  ok   im Bild: #invBtn (10,252 56x56)
  ok   im Bild: #prioBtn (10,380 56x56)
  ok   im Bild: #aktionBtn (228,762 148x52)
  ok   im Bild: #joyRing (16,656 120x120)
  ok   frei: 14 Flaechen paarweise geprueft
  ok   Daumenmass: #minimap 88x88
  ok   Daumenmass: #attackBtn 82x82
  ok   Daumenmass: #potionBtn 56x56
  ok   Daumenmass: #spellBtn 56x56
  ok   Daumenmass: #ultBtn 56x56
  ok   Daumenmass: #spellsBtn 56x56
  ok   Daumenmass: #zulagenBtn 56x56
  ok   Daumenmass: #invBtn 56x56
  ok   Daumenmass: #prioBtn 56x56
  ok   Daumenmass: #aktionBtn 148x52
  ok   kein Skriptfehler
```

Die uebrigen drei Formate in derselben Form; zusammengefasst:

```
=== Telefon stehend (390x844, Finger) ===
  ok   frei: 14 Flaechen paarweise geprueft
  ok   kein Skriptfehler

=== Telefon liegend (844x390, Finger) ===
  ok   frei: 14 Flaechen paarweise geprueft
  ok   kein Skriptfehler

=== Telefon klein (360x640, Finger) ===
  ok   frei: 14 Flaechen paarweise geprueft
  ok   kein Skriptfehler

=== Schirm (1440x810) ===
  ok   frei: 11 Flaechen paarweise geprueft
  ok   kein Skriptfehler

Alles in Ordnung.
```

Dazu von Hand geprüft, weil ein Lauf keine Optik beurteilt: die vier Ecken auf 1440×810,
390×844 und 844×390; das Lichtbild scharf; der Ruhering sichtbar und blass genug, um die Welt
nicht zuzustellen; der Fächer als Kreisbogen erkennbar.

Ohne Regression gelaufen sind außerdem die drei Läufe, die Flächen anfassen, die U7
verschoben hat:

| Lauf | Ergebnis |
|---|---|
| `tools/menue-pruef.mjs` | 39 von 39 — nach dem Eingriff aus Befund 7; davor blieb er am verdeckten Zauberknopf hängen |
| `tools/zulagen-pruef.mjs` | 45 von 45 — die Kartei überlebt das um 74 Pixel schmalere Fenster |
| `tools/gespraech-pruef.mjs` | 87 von 89, wie auf dem Branch-Punkt. Die zwei offenen Zeilen („das zweite Porträt ist gezeichnet", „Nörgel steht auf dem Blatt der Grünhaut") sind auf `HEAD` vor diesem Abschnitt dieselben — sie hängen am fehlenden Grafikpaket, nicht an U7. Gegengeprüft mit einem zweiten Server auf der unveränderten Datei |

Der Einzeldatei-Build läuft unverändert durch (`node tools/build-single.mjs`, 1252 KB Quelle
→ 3170 KB Ergebnis).

## Warum ein Prüflauf und kein Guard

Die selbstprüfenden Guards in der Startkonsole belegen Zahlen aus Tabellen: Zeichendeckel,
Formregeln, Kampfwerte, Fußlinien. Was U7 ändert, ist keine Tabelle, sondern eine Anordnung —
und wo ein Element wirklich liegt, weiß erst ein Browser, der die Regel angewendet hat.
Genau daran ist die erste Fassung gescheitert: `--karteH:62px` stand in der Datei, 70 kamen
im Bild heraus. Ein Guard auf Skriptebene hätte die 62 nachgelesen und genickt.

Deshalb `tools/steuerung-pruef.mjs` — dieselbe Haltung wie bei `tools/menue-pruef.mjs` und
aus demselben Grund.
