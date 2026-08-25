# Bauabschnitt K1: Die Zulagen

*Stand 24.08.2026. Karten nach dem Aufstieg, drei liegen aus, eine wird
bewilligt. Getragen wird in der Dienstmappe, und die fasst wenig.*

---

## K1-0. Der Wunsch

Der Projektinhaber wollte ein schlankes Kartensystem: nach jedem Aufstieg zieht
der Spieler eine Karte, Karten geben Boni auf Waffengattungen, auf die
Zauberelemente, auf Manaverbrauch, auf genommenen und ausgeteilten Schaden, in
verschiedenen Stärken von schwachem Boost bis richtigem Kracher, teils
stapelbar, teils nicht, mit passenden Namen und guter Erklärung. Die Zahl der
gleichzeitig tragbaren Karten sollte mit der Stufe wachsen: eine bis Stufe 4,
zwei bis Stufe 14, drei darüber. Ausdrücklich erwünscht war, sich bei
bestehenden Systemen zu bedienen.

Zwei Entscheidungen kamen auf Nachfrage dazu und stehen so im Bau: **die
Ziehung legt drei aus und der Spieler wählt eine** (das Muster aus Slay the
Spire, weil eine einzelne Zufallskarte eine Mitteilung ist und drei eine
Entscheidung), und **das Loadout bleibt tauschbar**, außerhalb des Gefechts,
jederzeit.

---

## K1-1. Der Befund: das Haus hatte den Bus schon

Der Grund, warum dieser Bauabschnitt klein ausfällt, steht seit Phase 3 im
Code. `recalc()` sammelt alles, was passiv wirkt, in ein einziges Objekt:

```js
const FX = {slow:0, crit:0, dmg:0, armor:0, speed:0, mana:0, regen:0, ...};
```

Vierundzwanzig Zähler, jeder mit genau einer Fundstelle, die ihn liest. Die
Kessel-Ausrüstung zahlt dort ein (`FX[WIRKUNG[k].fx] += item.effect.stufe`),
die Flüche haben ihr Gegenstück in `CFX`. Für dreizehn der fünfzehn gewünschten
Kartenwirkungen war der Hook damit schon da, samt Deckel: `sparsam` senkt die
Manakosten und ist bei fünfundfünfzig Prozent geklemmt, `bollwerk` senkt den
genommenen Schaden und ist bei vierzig geklemmt, `crit` ist bei
fünfundsiebzig geklemmt. **Es musste keine einzige Formel neu gebaut werden,
und kein Deckel.**

Gefehlt haben genau zwei Dinge, und beide sind der eigentliche Bau:

* **Die Waffengattung trug keine Zahl.** `w.base.mode` kennt seit jeher
  `dagger`, `sword` und `doubleaxe`, aber der Wert entschied nur, welche
  Schwunganimation läuft. Eine Karte "Boni auf Schwert oder Axt" hatte nichts,
  woran sie hängen konnte.
* **Der Zauberzweig trug keine Zahl.** `castSpell()` hatte einen einzigen
  Multiplikator, `FX.zauber`, und der galt für alle elf Sprüche gleich. Feuer,
  Frost und Arkan waren rechnerisch dasselbe.

Dazu ein Fund am Rand, siehe K1-6.

---

## K1-2. Die Fiktion: warum es Zulagen heißt

Ein Kartensystem ist eine Beigabe, wenn es keine Geschichte hat. Die stand
schon in Kapitel 5 der Weltbibel:

> Die Stufe erlaubt, sie leistet nicht. Ein Aufstieg bringt zwei Punkte und
> fast nichts sonst. Das Haus zahlt keine Erfahrung aus, es genehmigt sie nur.

Genau da setzt K1 an. **Mit jedem Aufstieg legt die Personalstelle drei
Zulagen vor, eine wird bewilligt, die anderen beiden gelten als nicht
beantragt.** Die Zulage ist echtes Beamtendeutsch für den Aufschlag aufs
Grundgehalt: Erschwerniszulage, Gefahrenzulage, Amtszulage. Sie kommt als
laminierte Karte, weil das Amt laminiert, was es ernst meint.

Getragen wird in der **Dienstmappe**, und deren Eskalation ist der Gag
(Humor-Grundgesetz Regel 10, die Form ist episch, der Inhalt ist Papier):

| Stufe | Fächer | Wie das Haus es nennt |
|---|---|---|
| 1 bis 4 | eines | Mappe |
| 5 bis 14 | zwei | Doppelmappe |
| ab 15 | drei | Ordner |

Was nicht eingelegt ist, liegt in der **Kartei** und lässt sich außerhalb des
Gefechts umstecken. Und weil auch das eine Personalakte ist, endet sie mit der
Schicht: persönliche Qualifikation ist nicht übertragbar, steht so im Vorgang.

**Drei Wörter waren vergeben und wurden deshalb nicht genommen.** „Karte" ist
im Code die Weltkarte, und `FX.karte` ist seit Phase 3 die Wirkung
„Aktenlage" — jeder Bezeichner heißt deshalb `zulage*`, im Anzeigetext darf
„Karte" das Alltagswort bleiben. „Befugnis" ist seit Z2 die Zaubererlaubnis ab
Stufe 4 („Befugniserteilung"), und ein zweiter Sinn hätte die erste Bedeutung
mit verwaschen. „Vordruck" ist seit E1 das Antrittsformular.

---

## K1-3. Der Katalog: fünfzehn Familien, drei Stufen

Der Schnitt ist absichtlich derselbe wie bei `WIRKUNG`: ein Name, ein
Sinnbild, drei Sätze für die drei Stufen, ein eigener Name für die dritte.
Dazu `wert`, die Zählerpunkte je Stufe.

**Die Eichung der Stärke, in einem Satz:** Stufe I ist genau ein Wirkungsrang
der Kessel-Ausrüstung, Stufe II ein verstärkter, und **Stufe III liegt einen
Punkt über dem Unikat** — das ist der Kracher, und er braucht keine zweite
Formel, weil alle Deckel `Math.min` an ihrer Fundstelle sind und jede Summe
fangen.

| Familie | Sinnbild | Hook | stapelt | Werte |
|---|---|---|---|---|
| Stichprobe (Dolch) | 🔪 | `dolch` *(neu)* | ja | 1/2/4 |
| Klingenzulage (Schwert) | ⚔️ | `schwert` *(neu)* | ja | 1/2/4 |
| Pauschalabfertigung (Axt) | 🪓 | `axt` *(neu)* | ja | 1/2/4 |
| Brandschutzausnahme (Feuer) | 🔥 | `feuer` *(neu)* | ja | 1/2/4 |
| Kaltverfügung (Frost) | ❄️ | `frost` *(neu)* | ja | 1/2/4 |
| Blitzbeschluss (Arkan) | ⚡ | `arkan` *(neu)* | ja | 1/2/4 |
| Vollzugszulage | 🔨 | `dmg` | ja | 1/2/4 |
| Erschwerniszulage | ⛑️ | `leben` | ja | 1/2/4 |
| Härtefallregelung | 🛡️ | `bollwerk` | nein | 1/2/4 |
| Gebührenbefreiung | 🧾 | `sparsam` | nein | 1/2/4 |
| Prüfvermerk | 🔍 | `crit` | nein | 1/2/4 |
| Eilverfahren | ⏱️ | `tempo` | nein | 1/2/4 |
| Dienstweg | 🥾 | `speed` | nein | 1/2/4 |
| Laufender Bezug | ☕ | `mana` | nein | 1/2/**3** |
| Dienstalterszulage | 🗓️ | `xp` | nein | 1/2/**3** |

**Warum acht stapeln und sieben nicht.** Gestapelt wird, wo das Stapeln eine
Bauweise baut: zwei Klingenzulagen sind ein Schwertkämpfer, zwei
Brandschutzausnahmen ein Pyromant. Nicht gestapelt wird, wo es entweder nur
einen Deckel schneller erreicht (Bollwerk, Sparsamkeit, Prüfvermerk) oder eine
Ökonomie kippt. Das deutlichste Beispiel ist **Eilverfahren**: zwei mal Stufe
III wären achtzig Prozent mehr Schlagzahl, und weil jeder Treffer über
`MANA_JE_TREFFER` Mana einbringt, wäre das der Zauberspam aus der Zeit vor Z2
über die Hintertür.

**Und warum zwei Familien auf der dritten Stufe einen Punkt weniger tragen.**
`mana` und `xp` wirken dauernd und verstärken sich selbst. Voller Kracher
hieße bei `mana` acht Punkte Regeneration je Sekunde, also genau der Wert, den
Z2 abgeschafft hat; bei `xp` eine Stufenleiter, die sich selbst überholt. Beide
stehen deshalb auf 1/2/3, und der Guard prüft nur, dass die Werte *streng
steigen*, nicht dass sie gleich hoch enden.

**Die Textregel ist dieselbe wie überall im Haus:** ganze Sätze, keine Zahlen,
keine Gedankenstriche. Gerechnet wird intern. Der Guard prüft alle drei
Regeln bei jedem Laden, und die Zahlenprobe hat beim Schreiben dieses
Abschnitts schon einmal zugeschlagen.

---

## K1-4. Die Eingriffe

Zwanzig Stellen, alle in `index.html`.

**Der Katalog** steht hinter `WIRKUNG`, also vor `FX`, vor `player` und vor dem
`recalc()`-Aufruf auf Skriptebene. Das ist dieselbe TDZ-Disziplin, die über den
S1-Konstanten steht, und in diesem Projekt der häufigste echte Fehler.

**Drei Felder am Spieler**, alle je Schicht:

```js
zulagenKartei:[], zulagenZiehungen:0, zulagenAngebot:null,
```

Die Dienstmappe ist **kein zweites Array**, sondern die Sicht
`kartei.filter(k => k.angelegt)`. Ein Feld weniger, das die Guards spiegeln
müssen, und kein Zustand, der auseinanderlaufen kann.

**Sechs neue FX-Schlüssel** (`dolch`, `schwert`, `axt`, `feuer`, `frost`,
`arkan`) und die Kartenschleife in `recalc()`, direkt hinter der
Ausrüstungsschleife. Die Karten sind damit eine dritte Quelle neben Gerät und
Fluch, auf demselben Rechenweg.

**Die zwei neuen Hooks:**

```js
// recalc(): die Gattung bekommt zum ersten Mal eine Zahl
const gattung = {dagger:FX.dolch, sword:FX.schwert, doubleaxe:FX.axt}[player.attackMode] || 0;
let dmgMin = ... + FX.dmg*4 + gattung*5;
let dmgMax = ... + FX.dmg*6 + gattung*7;

// castSpell(): der Zweig auch
const zweigZu = sp.ultimate ? 0 : ([FX.feuer, FX.frost, FX.arkan][sp.branch] || 0);
const sd = Math.round(sp.dmg * (1 + FX.zauber*0.12 + zweigZu*0.15));
```

Fünf und sieben je Punkt für die Gattung, etwas mehr als die vier und sechs
des gattungsfreien `FX.dmg`, weil eine Gattungskarte mit der nächsten Klinge
aus dem Kessel wertlos werden kann. Fünfzehn Prozent je Punkt für den Zweig
gegen die zwölf des zweigfreien `FX.zauber`, aus demselben Grund. **Das
Ultimate bleibt außen vor:** es kostet den ganzen Pool und trägt seinen Wert
selbst (Z1), ein Zweigzuschlag darauf wäre wieder der Zauberspam.

**Die Ziehung** hängt in `gainXP()`, eine Zeile hinter den Befähigungspunkten.
Sie drängt nicht: das Panel öffnet sich nicht von selbst, weil Panels in diesem
Spiel das Geschehen nicht anhalten (U1) und ein Fenster mitten im Gefecht eine
Zumutung wäre. Gemeldet wird über einen Floater und ein Sternchen am Gürtel,
gewählt wird, wann es passt. Ein ausliegendes Angebot **bleibt liegen**, bis
gewählt wird; Panel zu und wieder auf ist kein Würfelbecher.

Die Stufengewichte stehen in einer Tabelle: unter Stufe 5 gibt es kein Unikat,
ab Stufe 15 kommt fast jede zweite Karte als Kracher. Familien, die im Moment
nichts täten (die Gattung liegt nicht in der Hand, der Zweig hat keinen
gelernten Spruch), ziehen mit **halbem Los**. Nie mit null: die Kartei behält
jede Karte bis Schichtende, und die nächste Klinge kann die tote Karte zur
besten machen. Abwerten, nicht sperren.

**Das Umstecken** ist an `player.kampfT` gegattert, dasselbe Fenster wie das
Nüchternheitsgebot. Eine Mappe im Gefecht neu zu sortieren wäre kein Spiel,
sondern eine Pause.

**Der Schichtantritt** leert Kartei und Angebot und zahlt
`amt.ausbauten.startLevel` Vorlagen aus — dieselbe Pauschale, mit der zwei
Zeilen höher `skillPoints = startLevel * 2` gezahlt wird, aus demselben Grund.
Die Wiedereinsetzung aus W10 zahlt hier wie dort nichts: sie gibt den
Dienststand zurück, keine Nachzahlung.

**Das Panel** ist das achte im Haus und erbt alles: Grund, Kopfband,
Schließknopf (über `.panelZu`), Rollbalken, Höhendeckel, den Pixelrahmen aus
`bakeUiSkin()`, den Schleier und das Wegklicken über `PANEL_REGISTER`. Neu ist
allein die Kartenoptik: Seitenverhältnis einer Karteikarte, römische Ziffer in
der Ecke, Stufe II gold, Stufe III violett mit Schein — dieselbe Lesart wie
`.rar2`/`.rar3`. Taste `Z`, die war frei.

---

## K1-5. Der Guard

`zulagenAssert()` läuft bei jedem Laden und prüft sechs Dinge. Er wirft nie, er
meldet.

1. **Den Katalog.** Drei Sätze je Familie, streng steigende Werte, ein Hook,
   den es in `FX` wirklich gibt, gültige Gattung, gültiger Zweig, ein Name für
   die dritte Stufe. Dazu die Formregeln: keine Zahl, kein Gedankenstrich, ein
   Schlusszeichen. Und dass jede Waffengattung und jeder Zauberzweig überhaupt
   eine Karte hat, damit keine Bauweise still fehlt.
2. **Die Fächerleiter**, an den Schwellen und auf Monotonie.
3. **Die Ziehung.** Drei verschiedene Familien, Zähler sinkt, ausliegendes
   Angebot wird nicht neu gewürfelt, kein Unikat auf der untersten Stufe.
4. **Mappe, Stapelregel, Kampfgatter** als echte Sperren, nicht als Warnungen.
5. **Die Wirkung an `recalc()` gemessen**, nicht nachgerechnet: eine
   Erschwerniszulage I trägt genau achtzehn Leben, eine Stichprobe I am Dolch
   fünf und sieben Schaden, dieselbe Karte am Schwert nichts, und was in der
   Kartei liegt, wirkt nicht.
6. **Vier Quelltext-Anker**, damit die Fundstellen den Hook wirklich tragen.

**Zwei bestehende Guards mussten mitgezogen werden**, und das war der
unangenehmste Fund dieses Bauabschnitts:

* `zauberAssert()` fährt bei **jedem Seitenladen neun echte Aufstiege** durch
  `gainXP()`. Ohne Spiegelung stünden nach jedem Laden neun Geistervorlagen im
  Gürtel, die nie jemand ausgelöst hat.
* `befaehigungAssert()` misst die S1-Spreizung zwischen gesteigertem und
  ungesteigertem Spieler. Eine Karte trägt beide Seiten, und **nachgerechnet
  hebt schon eine einzige Erschwerniszulage III die Lebensquote von
  fünfundzwanzig auf über vierzig Prozent** — der Deckel `S1_SPREIZUNG_HP`
  wäre gerissen. Die Dienstmappe wird für die Messung geleert, genauso wie
  `messe()` die Ausrüstung längst durch die Referenzklinge ersetzt. Die Zusage
  von S1 gilt dem punktlosen Spieler; sie wird nicht aufgeweicht, sondern von
  einer dritten Quelle freigehalten, die es beim Schreiben von S1 noch nicht
  gab.

---

## K1-6. Ein Fund am Rand: der Erfahrungsbalken

Der Balken im HUD rechnete seit S1 falsch. Er trug die alte Leiter als
Abschrift:

```js
Math.min(100, (player.xp / (35 * Math.pow(player.level, 1.35))) * 100)
```

S1 hat die Leiter auf `48 * Stufe^1,6` umgestellt und `gainXP()` umgebaut, aber
diese eine Zeile blieb stehen. Auf Stufe 10 stand der Balken voll, wenn erst
zwei Fünftel des Weges lagen. Es war der letzte abgeschriebene Wert dieser Art
im Haus, und `befaehigungAssert()` verbietet genau diesen Fehlertyp seit S1 für
`gainXP()`, hat ihn im HUD aber nie geprüft.

Repariert, weil K1 `updateHUD()` ohnehin anfasst, und mit einem Quelltext-Anker
in `zulagenAssert()` festgenagelt.

---

## K1-7. Was bewusst nicht gebaut wurde

* **Keine Heilungskarte.** S1 hat die Gratisheilung des Aufstiegs gerade erst
  abgeschafft, mit ausführlicher Begründung. Eine Karte auf `regen` arbeitete
  dagegen. Der Hook liegt bereit, die Entscheidung gehört dem Projektinhaber.
* **Keine Persistenz.** Zulagen fallen mit der Schicht wie Stufe, Zauber und
  Gerät. Kein neues Feld in `amt`, keine Zeile in `loadAmt()`.
* **Kein Knöterich-Zettel** zur ersten Ziehung. Das Panel erklärt sich über
  seine Leerzustände selbst („Noch keine Zulage bewilligt. Jeder Aufstieg legt
  drei vor."). Ein Zettel wäre ein guter Nachtrag, kein Teil des Kerns.
* **Keine Grafik.** Sinnbilder sind Emoji, wie überall im Haus. Der
  Kartenrahmen steht und wartet. *(Überholt durch K1-10, siehe unten.)*

---

## K1-8. Prüfprotokoll

**Syntax.** `node --check` über den extrahierten Skriptblock: sauber.

**Konsole beim Laden.** Neunzehn Guards melden, `K1 Zulagen: Katalog,
Faecher, Ziehung, Stapelregel und Wirkung in Ordnung.` steht dazwischen. Kein
Fehler, keine Ausnahme; die 404er des gitignorierten Grafikpakets bleiben, was
sie waren.

**`tools/zulagen-pruef.mjs`**, im echten Browser: **45 von 45 bestanden.**
Abgedeckt: Ziehung legt drei verschiedene aus und würfelt nicht nach · die
bewilligte Karte legt sich selbst ein · Fächerleiter an sechs Stufen · nicht
stapelbar bleibt einmal, stapelbar darf zweimal und nie dreimal · im Gefecht
wird weder eingelegt noch abgelegt · Klingenzulage III trägt am Schwert
zwanzig und achtundzwanzig und an der Axt nichts · Kaltverfügung III hebt die
Frostnova von dreiundvierzig auf neunundsechzig und lässt den Feuerball in
Ruhe · was in der Kartei liegt, wirkt nicht · Taste, Gürtelknopf, Esc-Reihen-
folge, Schleier, Sternchen · kein Kartentext trägt eine Zahl · die Schicht
leert die Kartei und zahlt dieselbe Pauschale wie die Befähigungspunkte.

Der Lauf startet **keine Schicht und wartet auf keinen Frame**: ohne das
lizenzierte Grafikpaket reißt `bakeUiSkin()` ab, und alles, was auf ein Bild
wartet, wartet vergebens. Die Zulagen-Maschine steht lange vorher, der Lauf
fährt sie unmittelbar an und läuft mit wie ohne Grafikpaket durch.

**Gegenprobe.** Sieben absichtliche Beschädigungen (Zahl im Satz,
Gedankenstrich, Hook ohne FX-Feld, fallende Werte, verbogene Fächerleiter,
Unikat auf Stufe 1, aufgehobener Stapeldeckel): jede wird gemeldet, danach ist
der Guard wieder still. Ein Guard, der immer schweigt, beweist nichts.

**Kein Rückschritt anderswo.** `tools/menue-pruef.mjs` läuft mit dem achten
Panel unverändert durch, 39 von 39.

**Die Sichtprobe.** Das Panel wurde auf 1280 und auf 390 Pixel Breite
angesehen, und sie hat zwei Dinge gefunden, die keine Prüfzeile gefunden
hätte, weil beide erst im Bild entstehen:

* **Auf dem Telefon lief die dritte Karte aus dem Panel heraus.**
  Rasterfelder stehen von Haus aus auf `min-width:auto`, und
  „Vollziehbarkeit" drückte seine Spalte breiter als ihren Anteil. `min-width:0`
  hielt sie im Rahmen, machte aber das Nächste sichtbar: bei rund hundert
  Pixel je Karte zerbricht jedes Wort dieses Hauses. `hyphens:auto` half nicht,
  der Prüf-Chromium bringt kein deutsches Trennwörterbuch mit, und darauf ist
  ohnehin kein Verlass. **Auf schmalen Geräten wird die Karte deshalb zur
  Zeile**: Sinnbild links, Name und Satz rechts, eine je Reihe. Drei Zeilen
  untereinander sind auf einem Telefon die Form, in der man wählt.
* **Die Kartei stand auf vier Spalten** und teilte
  „Großbrandverfügung" mitten im Wort. Jetzt drei, wie die Reihen darüber.

Beide Male war die Ursache dieselbe und sie ist Programm: Amtsdeutsch baut
lange Wörter, und die Spalte hat sich danach zu richten, nicht umgekehrt.

---

## K1-9. Was zu beobachten ist

* **Die dritte Fachschwelle.** Stufe 15 kostet kumuliert 19.295 Erfahrung. Das
  ist ohne den Ausbau „Höhere Anfangsstufe" ein seltener Spitzenlauf. Die
  Schwelle steht so, weil sie so gewünscht war, und sie steht an genau einer
  Stelle (`ZULAGE_FAECHER`). Wird das dritte Fach im Spielbericht nie gesehen,
  wäre zwölf die kleinste sinnvolle Absenkung.
* **Das Kampfgatter** hängt an `kampfT`, und der wird nur von einem Treffer
  gesetzt. Wer neben einem Gegner steht, ohne getroffen zu werden, darf
  umstecken. Eine Aggro-Prüfung wäre die härtere Fassung; sie wäre neuer Code
  für einen Fall, den es vielleicht nicht gibt.
* **Zwei gestapelte Kracher derselben Gattung** (vierzig und sechsundfünfzig
  Schaden obendrauf) sind erst ab Stufe 15 und nur mit zwei passenden
  Ziehungen erreichbar. Zum Vergleich: vier Ausrüstungsteile mit
  Rang-3-Wirkung tragen heute schon achtundvierzig und zweiundsiebzig.

---

## K1-10. Nachtrag: die Sammelkarte

*(24.08.2026, auf Ansage des Projektinhabers, am selben Tag wie der Kern.)*

Die Rückmeldung auf die erste Fassung lautete: die Prompts sind gut, **aber das
muss mehr nach Sammelkarte aussehen, a la Yu-Gi-Oh oder Magic, sehr episch,
sehr drüber, es soll Bock machen die zu sammeln.**

Der Befund dahinter stimmt und war hausgemacht. Die erste Fassung zeigte ein
Sinnbild von sechsundzwanzig Pixeln links neben einer Textzeile. Das ist kein
Sammelstück, das ist ein Listeneintrag. Und die Bildprompts standen passend
dazu auf Inventarsymbolen: einzelner Gegenstand, mittig, dunkler Grund. Beides
zusammen ergab eine korrekte, unbegehrliche Karte.

**Das Gegenteil steht seit jeher in der Weltbibel**, Humor-Grundgesetz Regel 10:
die Form ist episch, der Inhalt ist Papier, und nichts an diesem Haus darf
bescheiden aussehen. Der Wunsch war also kein Fremdkörper, sondern die Regel,
die dieser Bauabschnitt zuerst nicht eingelöst hat.

### Zwei Eingriffe

**Die Karte im Spiel ist jetzt eine Karte.** Aufbau wie bei Magic: Namensleiste
mit der Stufe in der Ecke, Bildfenster im Verhältnis vier zu drei, Typenzeile,
Textfeld. Die Namensleiste trägt dieselbe Rezeptur wie das Kopfband der Panels
aus U1, damit die Karte aus demselben Haus stammt wie das Fenster um sie herum.
Die Stufe trägt nicht mehr nur die Ziffer, sondern die ganze Karte: gedeckt,
dann Gold, dann Violett mit Schein und einem laufenden Glanz über dem
Bildfenster, der bei `prefers-reduced-motion` stillsteht. Das Panel ist von
560 auf 680 Pixel gewachsen, damit drei Karten nebeneinander Platz haben.

Neu ist die **Typenzeile**: wo die Karte hingehört (`Gattung Schwert`,
`Zweig Frost`, `Allgemein`) und ob sie stapelt. Das stand vorher nur im
Tooltip und ist genau die Angabe, nach der man eine Sammlung sortiert.

**Das Bildfenster nimmt schon ein Bild.** Trägt eine Familie im Katalog ein
Feld `bild`, schreibt `zulageKarteHTML()` ein `<img>` hinein statt des
Sinnbilds; `object-fit:cover` und `image-rendering:pixelated` stehen bereit.
Der Einbau der fünfzehn Bilder ist damit **eine Zeile je Karte** und keine
Codeänderung. Das Sinnbild bleibt als Ersatz stehen und im Tooltip.

**Die Prompts sind umgeschrieben** (`zulagen-bildprompts.md`). Aus fünfzehn
Inventarsymbolen sind fünfzehn epische Szenen geworden: der Brieföffner steckt
wie Excalibur im Berg aus Formularen, der Stempel fährt aus Gewitterwolken auf
einen winzigen Schreibtisch, der Kaffeebecher steht auf einem Altar am Ende
einer Halle. Der Gegenstand bleibt Büromaterial, die Inszenierung ist eine
Kathedrale.

Drei Änderungen an der Stilformel, jede begründet in der Prompt-Datei: der
Ausschnitt wird zur Kartenkunst-Einstellung (`--ar 4:3`), die Karikatur fällt
weg, weil der Anker vom Figurenporträt zum **Amiga-Titelbild** wandert, und die
Palette darf beleuchtet werden statt eingefärbt. `--s 25` bleibt: höhere
Stilisierung heißt bei Midjourney hübscher, weicher, moderner, und das ist der
Weg aus der Pixelkunst heraus. Die Dramatik kommt aus den Wörtern.

### Ein Fund, den erst das Layout hervorgeholt hat

Eine Kartenspalte ist rund hundertzehn Pixel breit, und in diese Breite passt
**kein einziges Kompositum dieses Hauses**. Der Browser bricht dann mitten im
Wort: auf der Karte stand `Vollziehbarkei` und darunter ein einzelnes `t`.
`hyphens:auto` half nicht, der Prüf-Chromium bringt kein deutsches
Trennwörterbuch mit, und darauf ist ohnehin kein Verlass.

Gemessen statt geraten: ein Lauf misst jeden der fünfzehn Namen auf Stufe III
gegen die verfügbare Zeilenbreite, auf beiden Fensterbreiten. Er fand zwei
harte Brüche, `Großbrandverfügung` und `Unerschöpflichkeitsklausel`, das
zweite mit hundertachtundsechzig Pixeln in hundertvierzehn.

Die Lösung sind **weiche Trennstellen an den Fugen der Komposita**, als `&shy;`
im Katalog, weil das durch `innerHTML` geht und im Quelltext sichtbar bleibt.
Neunzehn Namen haben sie bekommen. Danach: null harte Brüche auf beiden Breiten.

Und weil ein Fund, der nur behoben ist, wiederkommt, prüft `zulagenAssert()`
das jetzt mit: kein Stück eines Namens darf ohne Trennstelle länger sein als
`ZULAGE_WORT_MAX`. Der Deckel steht auf sechzehn Zeichen, gemessen an der
schmalsten Spalte bei der größten Schriftstufe; das längste im Katalog ist
`Unanfechtbarer` mit vierzehn.

### Prüfprotokoll des Nachtrags

`node --check` sauber. `tools/zulagen-pruef.mjs` **45 von 45**,
`tools/menue-pruef.mjs` unverändert **39 von 39**, beide ohne Anpassung, weil
die Klassennamen der Karte geblieben sind.

Gegenprobe der vier neuen Guard-Regeln, jede einzeln beschädigt: Name ohne
Trennstelle, leeres Bildfeld, Bildfeld als Zahl, Zahl in der Typenzeile. Alle
vier werden gemeldet, danach ist der Guard wieder still.

Sichtprobe auf 1280 und 390 Pixel. Dabei aufgefallen und behoben: die
Namensleiste stand je nach Namenslänge zwischen einer und drei Zeilen hoch und
schob das Bildfenster mit, sodass die Bilder einer Reihe auf verschiedenen
Höhen saßen. Ein Mindestmaß von zwei Zeilen (in em, damit es die Schriftstufen
mitgeht) richtet die Reihe aus. Die wenigen dreizeiligen Ausfertigungen brechen
die Linie weiterhin, und das ist der richtige Preis: der lange Name ist der
Witz, nicht der Fehler.

Auf dem Telefon stand die Karte vorher als Zeile, Sinnbild links, Text rechts.
Das ist zurückgebaut: **zwei Spalten, und die Karte bleibt eine Karte.** Eine
Sammelkarte, die zur Zeile flachgelegt wird, sammelt niemand. Die Ziehung liegt
dort zwei zu eins statt nebeneinander, das ist der Preis und er ist es wert.

---

## K1-11. Nachtrag: die Bildrichtung

*(24.08.2026, nach fünf Referenzbildern des Projektinhabers.)*

Der Nachtrag K1-10 hat die Karte gebaut, aber die Bilder darin waren weiter
falsch. Die Rückmeldung: **zu unepisch, es sieht nicht aus, als wollte man sie
alle haben, die Grafiken müssen mehr knallen**, gern Szenen, die die
Eigenschaften der Karte verdeutlichen.

### Die Messung sagt, warum

Die Prompts standen auf der Amiga-Formel der Figurenporträts. An den
Referenzbildern nachgemessen war das quantitativ das Gegenteil:

| | Farben | Sättigung (0 bis 255) |
|---|---|---|
| Referenzbilder | 10.000 bis 238.000 | 143 bis 200 |
| Figurenporträts des Spiels | 32 | 56 bis 63 |

**Drei- bis viermal so gesättigt.** Die Formel schrieb `32 colour palette, muted
desaturated colours` vor und war damit nicht knapp daneben, sondern am anderen
Ende. Sie gilt für die Porträts weiter und für die Karten nicht mehr.

Neu ist der Anker: modernes hoch aufgelöstes Pixel-Art mit harten Kanten,
kräftige gesättigte Farben, Rim-Light und Innenglühen, Bloom um jede
Lichtquelle, dunkle Silhouette gegen brennenden Grund. Der Regler steht auf
`--s 250` statt `--s 25`.

**Dass die Karten dadurch anders aussehen als das Spiel, ist kein Bruch,
sondern Regel 10.** Ein Haus, das seine eigenen Zulagen laminiert und
vergoldet, während draußen alles grau ist, ist die Pointe.

### Zwei Bildarten, aus den Referenzen abgelesen

Drei der fünf Referenzen zeigen gar keine Szene, sondern den Gegenstand
freigestellt auf reinem Verlauf mit Glühen und Funkeln. Nur zwei sind Szenen
mit Umgebung. Die Aufteilung folgt dem:

* **Zehn Wirkungsszenen** für die Karten, bei denen etwas passiert. Sie zeigen,
  was die Karte tut, an einem Opfer aus dem eigenen Bestiarium.
* **Fünf Item-Showcases** für die stillen. Helm, Beleg, Stiefel, Becher und
  Dienstbuch stehen isoliert auf einem Verlauf, und die Eskalation läuft über
  den Gegenstand selbst, der Stufe für Stufe prunkvoller wird.

**Der größte Hebel war ein Fehler in der ersten Fassung.** Dort stand in jedem
`--no` die Zeile `people, faces`. Damit war dem Modell verboten, ein Opfer ins
Bild zu setzen, also genau das, was eine Kartenwirkung ausmacht. Eine
Kaltverfügung, die jemanden einfriert, konnte gar nicht entstehen.

Die Opfer kommen aus dem Bestiarium, und **der Wandelnde Ablagestapel ist der
Glücksfall für die Axt**: ein Gegner, der aus Akten besteht. Die Axt spaltet
damit keinen Papierstapel, sondern jemanden, der einer ist.

### Der Ton, und warum die Korrektur die Bilder besser macht

Die erste Fassung der neuen Prompts war zu brutal. Der schlimmste Ausrutscher
war die Stichprobe: aufgespießte Gestalten, auf Stufe III eine Wand voller
Schaukästen. Der Befund des Projektinhabers lautete, die Zielgruppe sei neun bis
neunundneunzig, und das war für keine der beiden Hälften richtig.

Der Kanon sagt es schärfer als jede Altersfreigabe. Regel 8: kein Blut, kein
Sterben, kein Zynismus. Und die Folge daraus, wörtlich: **es stirbt nie jemand,
es wird abgeschlossen.**

Die Überarbeitung ist deshalb keine Weichspülung, sondern eine Korrektur zum
Kanon hin, und sie macht die Bilder eigenständiger. Monster werden bearbeitet
statt getötet:

| statt | jetzt |
|---|---|
| aufgespießt und aufgereiht | der Öffner schnippt ein Musterblatt heraus, der Rest platzt zu Konfetti |
| in zwei Hälften geschnitten | fällt zu einem ordentlichen Stapel zusammen, Aktendeckel obenauf |
| brennt bei lebendigem Leibe | ein heller Wusch, dann eine Säule aus Funken und Konfetti |
| eingefroren mitten im Schrei | eingefroren mitten im Widerspruch, den Zeigefinger noch erhoben |
| zuckend vom Blitz getroffen | leuchtet kurz wie ein Röntgenbild und steht qualmend da |

Die Kaltverfügung ist der Beleg, dass hier der zahmere Einfall der komischere
ist, und sie trifft die Aktenbedeutung des Frostes genau: eine Rückfrage hemmt
die Frist.

Zwei Sperren stehen dafür in jedem der fünfundvierzig Prompts, der Ton im Text
und die Gewaltwörter ganz vorn im `--no`.

### Was der Code dafür bekommen hat

`bild` im Katalog ist ein Feld aus bis zu drei Pfaden, eines je Stufe;
`zulageBildPfad()` löst auf. **Lücken sind ausdrücklich erlaubt** und fallen
aufs Sinnbild zurück, denn fünfundvierzig Bilder entstehen nicht an einem Tag
und ein halb gefüllter Katalog darf das Panel nicht mit leeren Rahmen
zupflastern. Der Einbau je Bild ist damit eine Zeile.

### Prüfprotokoll des Nachtrags

`node --check` sauber, `tools/zulagen-pruef.mjs` 45 von 45,
`tools/menue-pruef.mjs` 39 von 39.

Gegenprobe der neuen Bildfeld-Regel mit sechs kaputten Formen (vier Bilder,
leeres Feld, leerer Pfad, Zahl statt Pfad, weder Pfad noch Feld, leerer
Einzelpfad): alle gemeldet, danach Guard still. Dazu drei gültige Formen, die
nicht anschlagen dürfen, und eine Sichtprobe mit drei Platzhaltern, die zeigt,
dass jede Stufe ihr eigenes Bild zieht und Lücken auf das Sinnbild fallen.

Ein Skript sucht in allen fünfundvierzig Szenentexten in beiden Sprachen nach
Gewaltvokabular und findet keins. Prompt-Datei und Klickfassung stammen aus
einer Quelle und werden Zeichen für Zeichen gegeneinander geprüft.

**Was von hier aus nicht prüfbar ist:** Midjourney selbst. Ob ein Prompt
knallt, zeigt erst der Lauf.

## K1-12. Nachtrag: der Spielstand kam dazwischen

Während der Nachtrag lief, ist SP (`phase-sp-spielstand.md`) auf den Hauptzweig
gegangen und hat `index.html` an über sechshundert Zeilen angefasst. Der Zweig
hat die Basis geholt, bevor er selbst gemergt wurde. Textlich ging das ohne
Konflikt zusammen, was aber nichts über die Sache aussagt: zwei Bauabschnitte
können sauber ineinanderfallen und trotzdem einander widersprechen.

Die eine Stelle, an der sie sich berühren, ist die Dienstmappe. SP schreibt sie
ausdrücklich mit in den Spielstand, mit einer Begründung im Quelltext, die den
alten Satz „nichts davon geht nach localStorage" nicht bricht, sondern einordnet:
gespeichert wird die Schicht, nicht die Akte, und eine fortgesetzte Schicht ohne
Dienstmappe wäre keine Fortsetzung. Das war schon vorgesehen, bevor dieser
Nachtrag begann.

Geprüft wurde trotzdem, und zwar an der Naht, die dieser Nachtrag neu gemacht
hat: SP prüft, **dass** die Mappe mitfährt, über Anzahl und Fachbelegung. Was SP
nicht prüfen konnte, weil es die Kartenform noch nicht gab, ist ob eine
**wiederhergestellte** Karte sich auch zeichnen lässt. Ein eigener Lauf legt
dafür zwei Karten an, sichert, lädt die Seite neu, liest zurück und baut die
Karten aus dem gelesenen Stand statt aus der Prüfdatei: Namensleiste,
Bildfenster, Typenzeile und Textfeld stehen, die Stufe kommt als römische
Ziffer, die eingelegte Karte ist noch eingelegt. Dreizehn von dreizehn.

**Ein Fehler im eigenen Prüfskript, der erwähnt gehört**, weil er die Lehre des
Hauses noch einmal bestätigt: der erste Wurf baute die Karten mit dem Schlüssel
`art`, während das Feld `familie` heißt. Der Lauf meldete elf von elf. Er hatte
nur bewiesen, dass JSON durch JSON kommt, denn die Rundprobe vergleicht ein
Objekt mit sich selbst, und die Zeichenprüfung ging am Katalog vorbei statt an
der gelesenen Mappe. Ein grüner Haken ist kein Beweis, solange nicht feststeht,
woran er hängt. Die berichtigte Fassung zieht Familie und Stufe aus dem
gelesenen Stand und prüft zusätzlich, dass beide Familien überhaupt im Katalog
stehen.

Die drei Prüfläufe des Hauses auf dem zusammengeführten Stand:
`tools/zulagen-pruef.mjs` fünfundvierzig von fünfundvierzig,
`tools/menue-pruef.mjs` neununddreißig von neununddreißig,
`tools/speicher-pruef.mjs` vierunddreißig von vierunddreißig.
