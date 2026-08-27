# Befund A0: was man liest, bevor man spielen darf

**Datum:** 27.08.2026
**Ausgangslage:** `main` stand auf `0c778c8`. Die Projektnotiz trägt seit demselben Tag den Abschnitt „Stand 27.08.2026 (3)" mit dem Intro-Masterplan Fassung 2. Er ist **Konzept, nicht Kanon**. Seine Ist-Spalte war eine Vermutung: *„1200 bis 2000 Wörter bis zum ersten freien Schritt"*, Zielwert unter 400.
**Auftrag:** Bauabschnitt A0, und nur A0. Einen Messlauf bauen, der am tatsächlichen Ablauf misst, und vier benannte Stellen ansehen. **Kein Eingriff in Spielcode, keine Textänderung.** `index.html` ist in dieser Sitzung nicht angefasst worden.

---

## 1. Der Messlauf

`tools/intro-pruef.mjs`, Bauform wie `tools/empfang-pruef.mjs`, Berichtston wie `tools/ton-messlauf.mjs`. Er klickt sich durch den echten Anfang und erntet nach jedem Schritt, was auf dem Schirm steht. Gezählt wird der Fließtext der Leseapparate plus die Antwortzeilen, die zur Auswahl stehen; Kopfzeile des Hauses, Blattzählung und Knopfbeschriftung sind Rahmen und Bedienung und zählen nicht mit.

Vier Routen, weil eine Zahl allein nichts sagt:

* **pflicht** — kürzester Weg. Am Hub sofort der Ausgang, keine optionale Frage, bei der Unterschrift der direkte Weg. **Die Hauptzahl.**
* **vordruck** — derselbe Weg, aber über „Erst den Vordruck".
* **vielleser** — alles mitnehmen, was angeboten wird. Die Obergrenze.
* **springer** — `ÜBERSPRINGEN` auf Intro-Blatt 1.

Er **misst und prüft nicht**: eine verfehlte Zielzahl macht ihn nicht rot. Exit-Code 1 gibt es nur für einen Weg, den er nicht gehen konnte, denn eine halbe Messung ist schlimmer als keine.

## 2. Die Zahlen

Alle vier Routen laufen durch, Exit-Code 0.

| | pflicht | vordruck | vielleser | springer |
|---|---:|---:|---:|---:|
| **Wörter bis zum ersten freien Schritt** | **2342** | 1651 | 2615 | 917 |
| davon Erzähltext | 2294 | 1603 | 2423 | 900 |
| davon Antwortzeilen zur Auswahl | 48 | 48 | 192 | 17 |
| Wörter Erzähltext vor der ersten Eingabe | 23 | 23 | 23 | 23 |
| Lesestufen (Tafeln, Knoten, Vordruckseiten) | 28 | 25 | 40 | 16 |
| **Erklärstücke, verschiedene Apparate** | **4** | 3 | 4 | 3 |
| Abschnitte am Stück | 5 | 4 | 5 | 3 |
| Echte Wahlen auf dem ganzen Weg | 4 | 4 | 15 | 1 |
| davon folgenlos | 1 | 1 | 1 | 1 |
| **Längster Leseblock ohne echte Wahl, Wörter** | **950** | 950 | 950 | 498 |
| … in Zeilen | 76 | 76 | 76 | 69 |
| **Lesetafeln hintereinander ohne echte Wahl** | **13** | 13 | 13 | 8 |
| Das Weltgesetz fällt auf diesem Weg | 1 | 2 | 1 | 1 |

**Der Zielwert wird um den Faktor 5,9 verfehlt**, und die Vermutung war zu niedrig: nicht 1200 bis 2000, sondern **2342**. Die Obergrenze für den, der jede Frage stellt, liegt bei 2615.

## 3. Wo die Wand steht

Der Pflichtweg zerfällt in drei Blöcke: **13 Lesestufen, dann 7, dann 4.** Der erste ist die Wand.

| Schritt | Apparat | Wörter |
|---|---|---:|
| 0–5 | Vorstellung, sechs Gesprächsknoten mit je **einer** Antwort | 189 |
| 6–12 | Intro, sieben Blätter, Knopf `WEITER` | 761 |
| **13** | `gruss`, der Hub — **die erste echte Wahl des Spiels** | 28 |
| 14 | `anrede`, drei Lesarten (folgenlos, P1) | 19 |
| 15 | `schluss`, drei Ausgänge | 23 |
| 16–21 | Ernennung, sechs Blätter | 535 |
| 22 | Anlage 2, Auftakt | 216 |
| 23 | Anlage 2, die Scheinwahl (folgenlos, T6) | 54 |
| 24–27 | Anlage 2, vier Blätter | 517 |

**950 Wörter und 13 Tafeln, bevor der Spieler zum ersten Mal etwas entscheidet.** Die sechs Züge der Vorstellung fühlen sich an wie ein Gespräch und sind keins: jeder Knoten bietet genau eine Antwort an. Nach der Zählregel des Masterplans — *eine Eingabe zählt nur, wenn sie eine Wahl ist* — sind das dreizehn Umblätterhilfen hintereinander. Der Spieler tippt dreizehnmal und wählt nullmal.

Das ist die Bestätigung der Diagnose, und zwar an der Stelle, an der der Masterplan sie vermutet hat: **die Zählung ist der Hebel, nicht die Länge.** Kein einzelnes Stück ist übertrieben; das Intro hat 761 Wörter auf sieben Blättern, das ist ein Blatt von gut hundert Wörtern. Die Wand entsteht daraus, dass nichts dazwischen liegt.

## 4. Zwei Zahlen, die der Plan nicht erwartet hat

**Der Vordruck ist auf dem direkten Weg gar nicht dabei.** `schluss` bietet drei Ausgänge an; „Dienst antreten." führt an der Dienstanweisung vorbei. Wer sie liest, wählt „Erst den Vordruck" — und liest damit **weniger**, nämlich 1651 statt 2342 Wörter. Der Grund: dieser Weg führt über `empfangVordruck()` auf `dienstAntritt()`, und damit an **Ernennung und Anlage-2-Erstkontakt vollständig vorbei**. Der Umweg ist die Abkürzung.

Der Masterplan zählt die Dienstanweisung als eines der vier Erklärstücke. Gemessen sind es auf keinem einzelnen Weg vier: pflicht hat vier (Empfang, Intro, Ernennung, Anlage 2), vordruck hat drei (Empfang, Intro, Vordruck). **Die vier Stücke existieren, aber kein Spieler bekommt alle vier.** Wer das umbaut, sollte wissen, welchen der beiden Wege die Tester gegangen sind.

**Die zweite folgenlose Wahl.** Der Plan nennt die T6-Scheinwahl. Gemessen sind es zwei: die Scheinwahl und die Anrede auf Blatt 1 (P1, „Auf die Laufbahn wirkt es nicht"). Beide bieten mehrere Knöpfe an und zählen nach der Regel als Wahl. Der Lauf weist sie getrennt aus, statt still zu werten. Auf dem Pflichtweg heißt das: von vier echten Wahlen ist eine folgenlos, und auf der Springer-Route ist **die einzige Wahl des ganzen Anfangs** die folgenlose Anrede.

## 5. Blätter, die beim Überspringen verloren gehen

`ÜBERSPRINGEN` auf Intro-Blatt 1 führt auf `showDienstblatt(1, 'einstellung', 0)`.

| Apparat | Pflicht | Springer | |
|---|---:|---:|---|
| Szene Empfang | 9 | 6 | **3 verloren** |
| Intro | 7 | 1 | **6 verloren** |
| Ernennung | 6 | 0 | **6 verloren** |
| Anlage 2, Erstkontakt | 6 | 0 | **6 verloren** |
| Vordruck A 1 | 0 | 9 | 9 dazu |
| **Wörter** | 2342 | 917 | Ersparnis 1425 |

**21 Lesestufen fallen weg, neun kommen dazu.** Wer überspringt, sieht die Ernennungsurkunde nie — das ist bekannt und in `phase-t3-anlage2.md` als Nachholung geregelt, aber die Urkunde selbst wird nicht nachgeholt. Er bekommt dafür neun Vordruckseiten, die der direkte Weg nicht kennt. Der Knopf heißt `ÜBERSPRINGEN` und tauscht in Wahrheit ein Erzählstück gegen ein Formular.

## 6. Das Weltgesetz

Erwartet waren drei Stellen vor Schicht 5. **Gemessen sind es drei**, und die Erwartung stimmt genau:

| Ort | Gestalt | Wortlaut |
|---|---|---|
| Intro-Blätter (T5d) | wörtlich | „Ein Vorgang, den niemand abschließt, nimmt Gestalt an." |
| Vordruck A 1 (W8) | sinngemäß | „…was liegen bleibt, steht irgendwann auf und geht nach draußen." |
| Szene `baumAnlage2` (T5b) | wörtlich | „Ein Vorgang, den niemand abschließt," |

Zwei Dinge dazu, und beide ändern die Lesart:

**Die drei Stellen sehen nicht gleich aus.** Zwei sagen den Satz, eine umschreibt ihn. Ein Lauf, der nur wörtlich sucht, findet zwei und meldet einen Fehlstand, den es nicht gibt. Der Messlauf sucht deshalb beides und weist die Gestalt aus.

**Auf dem Pflichtweg fällt es nur EINMAL.** Der Vordruck ist optional (Abschnitt 4), und der Gesprächsbaum der Anlage 2 ist es auch. Die Drei ist die Zahl der *erreichbaren* Stellen, nicht der gelesenen. Auf der Vordruck-Route sind es zwei, auf jeder anderen eine.

Das schwächt den Befund „teuerster Einzelposten" nicht, es verschiebt ihn: die Dreifachnennung ist **kein Pflichtweg-Problem**, sondern eines für den, der gründlich ist. Wer alles liest, hört dasselbe Gesetz dreimal in derselben halben Stunde; wer durchklickt, hört es einmal. Die Ansage vom 26.08.2026, dass die Doppelung gewollt ist, trägt damit auf dem Pflichtweg **heute schon**.

---

# Die vier Prüfungen

## Prüfung 1: der Rückweg von `betreteKammer()`

**Die Annahme des Masterplans trägt nicht, und zwar zugunsten des Plans.**

Der Plan schreibt: *„Im Intro gäbe es beim Betreten nichts einzufrieren und beim Hinausgehen nichts zurückzuholen. [Wahrscheinlich] der einzige echte Neubau des Umbaus."*

Gemessen ist das Gegenteil. **`genMap()` läuft synchron beim Skriptstart** (`index.html:7382`; der Kommentar bei `:6600` sagt es selbst). Beim Seitenaufruf, vor `startGame()`, steht die Oberwelt vollständig da:

| | beim Skriptstart |
|---|---:|
| begehbare Kacheln | 102 131 |
| Bäume | 8 019 |
| Dekos | 2 006 |
| Dorffiguren | 14 |
| Monster | 866 |
| `currentLevel` | 1 |

Zuständig wäre ohnehin nicht `betreteKammer()`, sondern **`betreteHaus()` / `verlasseHaus()`** aus IN1 (`index.html:13124` / `:13188`) — dieselbe Bauform, aber ohne Module, Tore und Wächter. Der Rundlauf ist an drei Stellen nachgespielt worden und trägt an allen dreien: **vor `startGame()`**, **mitten im Intro** und **nach `startShift()`**. Karte, Bäume, Dekos, Figuren und Monster kommen vollzählig zurück, `pageerror` bleibt leer.

**Der Bruch liegt eine Stelle weiter, und er ist real.** `startShift()` (`index.html:18378`) setzt:

```js
player.x = SPAWN.x; player.y = SPAWN.y; camSnap();
```

`verlasseHaus()` setzt den Spieler auf **(5008, 4958)**, vor die Amtstür. `SPAWN` liegt auf **(5040, 5136)**. Wer nach der Ernennung aus der Amtsstube tritt, wird **181 Pixel versetzt**, und die Kamera schneidet mit. Der geplante *„erste freie Schritt ist der Schritt aus der Amtsstube hinaus"* fällt damit dem Schichtreset zum Opfer, nicht dem Einfriertrick.

**Der zweite Fund ist der teurere.** Während des Intros steht `state` auf `'menu'` — die Empfangsszene trägt kein `haeltDieWelt` und setzt ihn nicht. `scanAktion()` steigt aber in der ersten Zeile aus:

```js
if(state !== 'play' || player.dead || aktSperre > 0) return;
```

**Es gibt während des Intros keine Kontextaktion.** Kein „Betreten", kein „Hinausgehen", kein „Ansprechen". Der Rundlauf funktioniert nur, weil ich `betreteHaus()` direkt gerufen habe; ein Spieler käme dort weder hinein noch heraus. Wer die Amtsstube zur Bühne macht, braucht also nicht den Neubau, den der Plan fürchtet, sondern **einen Zustand, in dem der Raum bedienbar ist** — `state === 'play'` mit angehaltener Uhr, oder einen eigenen Szenenzustand, der `scanAktion()` durchlässt.

**Einschätzung.** Das Risiko, das den ganzen Ablauf tragen sollte, existiert nicht. Der Ersatzweg („Oberwelt still im Hintergrund aufbauen") wird nicht gebraucht — sie ist schon da. Dafür stehen zwei kleinere, konkrete Aufgaben da, die der Plan nicht kennt.
**Aufwand:** Reihenfolge und Zustand: **mittel** (ein halber Tag). Die 181 Pixel: **klein**, sobald entschieden ist, ob `startShift()` eine Startposition annehmen darf oder ob die Szene hinter den Schichtantritt wandert. Diese Entscheidung gehört nach A1 und ist keine Zeile Code.

## Prüfung 2: `phase:'feierabend'` als Anwesenheitsschalter

**Beide Hälften der Sorge treten ein, und welche, hängt allein an einer Zeile Reihenfolge.**

```js
function innenZeit(){ return !CONFIG.schichtModus || shiftT < 0.25 * CONFIG.schichtDauer; }
```

`shiftT` zählt **herunter**. `CONFIG.schichtDauer` ist 1500, die Schwelle also 375. Gemessen über neun Stützstellen:

| `shiftT` | `innenZeit()` | wer steht in der Amtsstube |
|---:|---|---|
| 0 (**vor `startShift()`**) | wahr | Nörgel |
| 1 / 200 / 374 | wahr | Nörgel |
| **375** | falsch | *niemand* |
| 750 / 1499 / **1500** (**Schichtbeginn**) | falsch | *niemand* |

* Läuft die Szene **vor** `startShift()` — also dort, wo das Intro heute liegt —, steht `shiftT` auf 0. Es ist rechnerisch Feierabend, und **Nörgel steht da, obwohl er nicht soll.**
* Läuft sie **zu Schichtbeginn**, steht `shiftT` auf 1500, und **die Amtsstube ist leer.**

**Knöterich steht in keinem der beiden Fälle dort, und der Grund ist grundsätzlicher als eine fehlende Zeile:** `INN_RAEUME.amt.leute` führt nur `noergel`, und `betreteHaus()` besetzt den Raum ausschließlich aus `DORF_FIGUREN`. **Knöterich steht nicht in `DORF_FIGUREN`** — er ist `KN_FIGUR`, eine eigene Größe mit eigenem Gesprächsbaum. Er kann mit dem heutigen Mechanismus überhaupt nicht in einem Innenraum stehen, unabhängig von jeder Uhrzeit.

Zur Einordnung: `phase:` steht auf 14 Zeilen der Dorffiguren, sieben `antritt` und sieben `feierabend`. Der Schalter ist eine Sprechzeitangabe, die IN1 als Anwesenheitsangabe zweitverwendet hat; der Kommentar bei `:13103` sagt das offen (*„Ohne Schichtuhr ist immer Feierabend, und das ist keine Ausrede, sondern die Wahrheit über das freie Spiel"*).

**Einschätzung.** Genau so, wie der Plan es befürchtet, und einmal schlimmer: die Ausnahme muss nicht nur die Uhr überschreiben, sondern eine **Figur aus einer anderen Tabelle** in den Raum stellen. Zwei saubere Wege: Knöterich als Sondereintrag in `betreteHaus()`, oder ein Feld `leuteJetzt` am Raum, das die Szene setzt. Der zweite ist der ehrlichere — er macht die Anwesenheit zu einer Angabe statt zu einem Nebeneffekt der Uhr.
**Aufwand:** **klein bis mittel**, ein bis drei Stunden. Kein Neubau, aber auch keine Zeile.

## Prüfung 3: `AMT_TUER` und `tuerDx` für den Weg nach draußen

**`AMT_TUER` gibt es nicht mehr.** IN1 hat ihn gestrichen, der Kommentar bei `index.html:4958` nennt beide Gründe: die Tür ist keine Sonderregel des Amts mehr, und die Mitte der Südkante war ohnehin daneben. Zuständig ist `bldTuer()` (`:4954`).

**Die Schwelle trägt in beide Richtungen, weil beide Richtungen denselben Punkt lesen.** `tuerDx` ist in Blattpixeln gemessen und wird mit `WELT_SC` = 2 skaliert:

| Haus | Raum | `tuerDx` | in Weltpixeln | Tür außen | Landung nach `verlasseHaus()` | begehbar |
|---|---|---:|---:|---|---|---|
| `amt` | Amtsstube | −16 | −32 | (5008, 4926) | (5008, **4958**) | ja |
| `haus2` | Registratur | −33 | −66 | (4750, 5502) | (4750, **5534**) | ja |
| `haus3` | Zum Letzten Stempel | +17 | +34 | (5202, 5502) | (5202, **5534**) | ja |

Alle drei Landepunkte liegen **eine Kachel (32 px) unter der Tür** und sind begehbar. Der Weg hinein bietet an `bldTuer()` an, der Weg hinaus setzt auf `bldTuer() + TS` — dieselbe Rechnung, derselbe Versatz, kein zweiter Zahlenort.

**Was dabei auffällt, und es ist klein, aber es gehört in den Bericht:** der Landepunkt liegt in **allen drei Fällen innerhalb des Anbieteradius** des „Betreten", das man gerade verlassen hat (32 px bei einem Radius von 58). Drinnen dasselbe: nach `betreteHaus()` steht der Spieler 40 px von der Innenschwelle entfernt, also ebenfalls im Radius des „Hinausgehen". Zwischen Hinausgehen und sofortigem Wiederhineingehen steht nichts als `aktSperre = 0.5`, die beide Funktionen setzen. Das ist heute richtig und fällt nicht auf, weil beide Wege eine bewusste Handlung sind.

Es fällt in dem Moment auf, in dem der Schritt aus der Amtsstube **der erste freie Schritt des Spiels** ist. Dann steht der Spieler eine halbe Sekunde nach der Kontrollübergabe auf einem Feld, das ihm anbietet, wieder hineinzugehen — als erste Bedienmöglichkeit, die er je sieht. Das ist keine Fehlfunktion, aber es ist die falsche erste Einladung.

**Einschätzung.** Die Schwelle trägt. Der Weg von innen nach draußen benutzt sie richtig. Zu entscheiden ist nur, ob der Landepunkt für den Intro-Ausgang eine Kachel weiter nach Süden soll.
**Aufwand:** **klein**, unter einer Stunde, und ausschließlich in A2. Es ist keine Zahl, die irgendwo doppelt steht.

## Prüfung 4: `durchDenStapel` sucht den Weiterknopf am Wortlaut

**Es bricht. Nur nicht so, wie der Plan es beschreibt — und die Wahrheit ist nicht besser, sondern anders schlecht.**

Nachgestellt statt behauptet: zwei Kopien der Prüfläufe im Scratchpad, jeweils nur die Wortliste geändert, `index.html` unberührt. Zuerst die Grundwerte: `empfang-pruef.mjs` **96 von 96**, `menue-pruef.mjs` **78 von 78**, beide Exit 0.

**Variante A — `'LESEN'` fällt weg** (genau der T6-Fall, den der Kopf des Werkzeugs selbst als bekannte Falle nennt):

> 84 von 96 bestanden, Exit 1. Zwölf Abweichungen.

Es wird also rot. Aber **keine der zwölf Meldungen nennt die Ursache**:

```
FEHL  das erste Treffen hat sechs Blaetter    ist=1      soll=6
FEHL  das Spiel laeuft                        ist="menu" soll="play"
FEHL  die Einstellung ist vermerkt            ist=undefined soll=true
FEHL  das HUD ist wieder da                   ist=false  soll=true
```

Das liest sich wie ein kaputtes `ANLAGE2_BLAETTER` und wie eine kaputte Schichtmaschine. Es ist eine Wortliste in einem Helfer, achtzig Zeilen weiter oben. Dazu die 84 grünen Zeilen: sie sind echt grün, aber sie stehen unter einer Schlussmeldung, die *„84 von 96"* sagt — das liest sich wie zwölf Kleinigkeiten und ist in Wahrheit ein Lauf, dessen ganzer hinterer Teil nichts mehr gemessen hat.

**Variante B — der Weiterknopf heißt anders** (der A3-Fall: Kachel wird Requisit oder Antwort):

> `empfang-pruef.mjs`: **Absturz**. `Error: Antwort "Warum nicht hinsetzen" steht nicht auf der Tafel: ["Dann erzählen Sie."]`
> `menue-pruef.mjs`: **Absturz**. `locator.click: Element is not visible … #bagGrid`
> Beide Male: **0 ok, 0 FEHL, kein Protokoll.**

Das ist der eigentliche Fund. Beide Läufe sammeln ihre Zeilen in einem Feld und geben sie **erst ganz am Ende** aus:

```js
console.log(zeilen.join('\n'));
console.log(`\n${zeilen.length - fehl} von ${zeilen.length} Pruefungen bestanden.`);
```

Eine ungefangene Ausnahme mittendrin — ein `waehle()`, das seine Antwort nicht findet, oder ein Playwright-Klick, der in den Zeitablauf läuft — beendet den Lauf, **bevor eine einzige Zeile gedruckt ist**. Exit-Code 1, ein Stapelabzug, und keine Aussage darüber, was geprüft wurde und was nicht.

**Wie viel daran hängt, ausgezählt:**

| Lauf | `pruef()`-Aufrufstellen | davon hinter dem Stapelhelfer |
|---|---:|---:|
| `empfang-pruef.mjs` | 96 | **96** (erste Aufrufstelle: Zeile 177) |
| `menue-pruef.mjs` | 39 Stellen, 78 Prüfungen zur Laufzeit | **alle** |

**Beide Läufe haben null Prüfungen vor ihrem ersten Stapeldurchlauf.** In `menue-pruef.mjs` steht die Schleife sogar in der Aufbaufunktion, die `{ page, ctx, laut }` zurückgibt — sie ist Voraussetzung für alles, was danach kommt. Zusammen hängen **174 Prüfungen zur Laufzeit an zwei Wortlisten.**

**Und eine Stelle ist wirklich still.** `menue-pruef.mjs` hat keinen Helfer mit Rückgabewert, sondern eine namenlose Schleife:

```js
for(let i = 0; i < 8; i++){
  const weiter = await page.evaluate(...);
  if(!weiter) break;
}
```

Kein `pruef()`, keine Zählung, kein Vergleich. Findet sie den Knopf nicht, bricht sie bei `i = 0` ab, der Tafelstapel bleibt offen, und der Lauf prüft das Menü **durch ein Modalfenster hindurch**. Ob das auffällt, hängt davon ab, was die nächste Prüfung zufällig anfasst. In meiner Variante war es `#bagGrid`, und das war sichtbar verdeckt. Eine Prüfung, die etwas noch Gültiges liest, wäre grün geworden.

Dazu zwei Aufrufstellen in `empfang-pruef.mjs`, die den Rückgabewert **wegwerfen** (`:441` und `:492`): dort gibt es die Blattzahlprüfung gar nicht, die die anderen vier rot werden lässt.

**Einschätzung.** Der Plan hat recht, dass die Falle scharf ist, und unterschätzt sie in einem Punkt: nicht die Stille ist das Problem, sondern dass **kein einziger Fehlerpfad die Ursache benennt** und einer von ihnen das Protokoll ganz verschluckt. Wer nach dem A3-Umbau ein rotes CI sieht, sucht in `ANLAGE2_BLAETTER`.

Drei Riegel, unabhängig voneinander, aufsteigend nach Aufwand:

1. **Das Protokoll vor dem Absturz drucken.** `try/finally` um den Rumpf, `zeilen` in jedem Fall ausgeben. **Aufwand: klein**, unter einer Stunde, und es hilft sofort bei jedem künftigen Absturz.
2. **Den Helfer laut werden lassen.** Findet `durchDenStapel()` keinen Knopf, während das Overlay steht, ist das eine Ausnahme mit Klartext und kein `break`. Dasselbe für die Schleife in `menue-pruef.mjs`, die dabei einen Namen und einen Rückgabewert bekommt. **Aufwand: klein bis mittel**, zwei bis drei Stunden für beide Läufe.
3. **Den Knopf nicht mehr am Wortlaut suchen.** Er ist am `onclick` erkennbar — `szeneTafel(n)`, `showDienstblatt(...)`, `dienstAntritt()` —, also an dem, was er tut. `tools/intro-pruef.mjs` macht es bereits so und prüft nach jedem Klick zusätzlich, dass sich die Lage wirklich bewegt hat. **Aufwand: mittel**, ein halber Tag, und danach überlebt der Lauf jede Umbenennung.

Punkt 1 und 2 sind billig genug, um vor A3 zu stehen. Punkt 3 ist die eigentliche Antwort.

---

## Nebenbefund: das Intro hat sieben Blätter, nicht neun

`INTRO_BLAETTER.length` ist heute **7**. SZ1 hatte neun, T1 hat auf fünf gekürzt, T5d hat zwei zurückgebracht. Fünf Stellen behaupten weiter neun:

* `index.html:22763`, `:24878`, `:24927`, `:24977` (Kommentare)
* `tools/empfang-pruef.mjs:17` (Kopfzeile)
* `README.md:37` und `:194`

Sichtbar falsch wird davon nichts: `szeneBlattZahl()` zählt römisch, solange der Stapel unter zehn bleibt, und sieben bleibt darunter. Aber die Begründung bei `:24927` (*„Das Intro ist zu neunt und bleibt damit römisch"*) steht auf einer Zahl, die es nicht mehr gibt. Die Prüfläufe selbst sind in Ordnung — `empfang-pruef.mjs` prüft gegen sieben und ist grün. **Nicht angefasst**, A0 ändert nichts; gehört in die Doku-Nachlese von A1.

## Nachgemessen gegen T8

Während dieser Sitzung ist **T8 auf `main` gelandet** (`4c50fd1`, „Anlage 2 bekommt die drei Szenen-Anlässe", PR #79) und hat `index.html` um 180 Zeilen erweitert. Die Zahlen oben waren damit gegen `0c778c8` gemessen und einen Commit alt. Ein Messlauf, der gegen einen überholten Stand misst, ist genau das, wogegen A0 gebaut ist, also ist `main` in den Branch gemergt und **nachgemessen** worden.

**Keine einzige Kennzahl bewegt sich.** Alle vier Routen liefern dieselben Wörter, Lesestufen, Erklärstücke, Wahlen, Blöcke und Weltgesetz-Stellen wie vorher.

Das ist auch die Erklärung wert, denn es hätte anders sein können: T8 fasst `ANLAGE2_AUSBRUCH`, `knShowRandLine()`, `anlage2Notiz()`, `anlage2Assert()` und `szeneEnde()` an — also den **Band- und Kommentarkanal** der Anlage 2, nicht ihren Erstkontakt. Die eine Zeile in `szeneEnde()`

```js
if(SZENE_ANLASS[key]) anlage2Szene(SZENE_ANLASS[key]);
```

hängt an `SZENE_ANLASS`, und der Empfang steht dort nicht: er endet über `empfangEnde()` → `dienstAntritt()` und läuft gar nicht durch `szeneEnde()`. Keine der gemessenen Tabellen — `INTRO_BLAETTER`, `ERNENNUNG_BLAETTER`, `ANLAGE2_BLAETTER`, `ANLAGE2_FRAGE`, `EMPFANG_KNOTEN`, `DIENSTBLATT` — steht im Diff.

**Der Befund gilt also für `main` in seinem heutigen Stand**, nicht nur für den, gegen den er entstanden ist.

## Was diese Messung nicht kann

* **Sie misst Wörter, keine Zeit.** Wie lange jemand an 950 Wörtern sitzt, hängt vom Leser ab. Die Zahl ist als Vergleichsmaß gebaut, nicht als Sekundenangabe.
* **Sie misst den Pflichtweg und drei Varianten, nicht jeden möglichen Weg.** Der Vielleser stellt jede Frage einmal; wer im Empfang herumklickt, kommt höher.
* **Sie wertet nicht.** Ob 2342 Wörter zu viel sind, sagt die Rückmeldung der Tester und nicht der Lauf. Der Lauf sagt nur, dass es 2342 sind und wo sie liegen.
* **Prüfung 1 bis 3 sind an der laufenden Maschine gemessen, aber mit direkten Aufrufen.** Dass `betreteHaus()` im Intro trägt, ist gemessen; dass ein Spieler dort hineinkäme, ist ausdrücklich **widerlegt** (`scanAktion()` läuft nicht bei `state === 'menu'`).
* **Prüfung 4 ist an Kopien nachgestellt**, nicht an einem echten A3-Umbau. Welche Knopfbeschriftung dort wirklich entsteht, ist noch nicht entschieden. Die beiden nachgestellten Fälle sind die zwei plausiblen Enden.

## Nachtrag am selben Tag: Riegel 1 und 2 gebaut

Entschieden und gebaut, bevor A1 den Anfang umhängt — denn genau das wird diese Läufe brechen.

**Riegel 1, das Protokoll überlebt den Absturz.** Beim Bauen stellte sich heraus, dass das Problem breiter ist als die zwei Läufe aus Prüfung 4: **15 Werkzeuge** sammeln ihre Zeilen in einem Feld und drucken erst ganz unten, zusammen **699 `pruef()`-Aufrufstellen**. Alle 15 haben jetzt ein `bericht()` an `process.on('exit')`.

Dabei fiel ein zweiter Fehlstand auf, der schlimmer ist als der erste: ein abgebrochener Lauf hätte jetzt **„40 von 40 Prüfungen bestanden"** gemeldet — die Schlusszeile zählt ja nur, was gelaufen ist. Das liest sich wie ein sauberer Durchlauf. Deshalb trägt `bericht()` einen ABBRUCH-Hinweis, der ausspricht, dass alles danach **ungeprüft und nicht etwa in Ordnung** ist.

Zwei Sonderfälle mussten von Hand nach: in `szene-pruef.mjs` liest `bericht()` die Konsolenkiste `laut`, die erst später angelegt wurde — ein Absturz beim Browserstart hätte den Bericht selbst werfen lassen und die Ursache verdeckt, die er zeigen soll (`laut` steht jetzt davor). Und `innen-tuer-messlauf.mjs` hat mit `--profil` einen Ausgang, der absichtlich nur das Braunprofil druckt; ohne ein `berichtet = true` hätte er ab jetzt einen Abbruch gemeldet, den es nicht gibt.

**Riegel 2, der Stapelhelfer wird laut.** `durchDenStapel()` faltete zwei Lagen in dasselbe `'weg'`: „Overlay zu, Stapel durch" (richtig) und „Overlay steht, kein Knopf passt" (ein Fund, der wie ein Schleifenende aussah). Getrennt, und die zweite wirft jetzt. Dazu die zwei Aufrufstellen, die den Rückgabewert wegwarfen, mit ihrer Blattzahlprüfung: **96 → 98 Prüfungen.** Die zwei Zahlen (6 und 4) stehen nicht als Behauptung da, der Lauf hat sie bestätigt.

In `menue-pruef.mjs` heißt die namenlose Schleife jetzt `stapelWegklicken()`, gibt ihre Blattzahl zurück, und **danach steht die eine Zeile, die den ganzen Fall gefangen hätte**: dass das Overlay hinterher wirklich zu ist. Das war der Zweck der Schleife und war nie geprüft.

**Nachgestellt, dieselben drei Varianten wie in Prüfung 4:**

| Variante | vorher | nachher |
|---|---|---|
| `LESEN` fällt weg (T6-Fall) | 84 ok / 12 FEHL, keine nennt den Knopf | 34 Protokollzeilen + ABBRUCH + `durchDenStapel: die Tafel steht, aber kein Weiterknopf passt` |
| `WEITER` heißt anders (A3-Fall) | **0 ok, 0 FEHL, kein Protokoll** | 7 Protokollzeilen + ABBRUCH + benannte Ursache |
| `menue-pruef` dasselbe | 0/0, Zeitablauf auf `#bagGrid` | ABBRUCH + `stapelWegklicken: …` an der richtigen Stelle |

Die Meldung nennt inzwischen sogar die Beschriftungen, die wirklich dastehen — im T6-Fall `["LESEN","Nicht lesen"]`, womit der Leser die Wortliste als Ursache sofort sieht, statt bei `ist=1 soll=6` in `ANLAGE2_BLAETTER` zu suchen.

**Was Riegel 1 nebenbei sichtbar gemacht hat.** Vier Läufe sind in diesem Klon nicht grün, und zwar **schon vor dieser Änderung** — an den unveränderten Fassungen von `HEAD` mit identischen Zahlen und Exit-Codes nachgeprüft, es ist keine Regression:

| Lauf | | Ursache |
|---|---|---|
| `ebene-pruef` | 53/54 | `die Leiter ist geladen ist=false` |
| `gespraech-pruef` | 87/89 | zwei Porträt-/Blattzeilen fallen auf Ersatz zurück |
| `szene-pruef` | 49/49, Exit 1 | Konsole meldet `Sprite fehlt: assets/cf/player/…` |
| `innen-pruef` | 16/18, **Absturz** | `TypeError: Cannot read properties of undefined (reading 'img')` |

Alle vier sind dieselbe Lage: **`assets/cf/` liegt in diesem Klon nicht vor** (Lizenz, siehe `.gitignore`), es enthält nur `manifest.json` und zwei Textdateien. Der Fall bei `innen-pruef` ist dabei der, für den Riegel 1 gebaut ist: vorher gab er nur einen Stapelabzug und **keine einzige Protokollzeile** her, jetzt stehen 16 geprüfte Zeilen, der ABBRUCH-Hinweis und die Ursache da. Angefasst wurde keiner der vier — das ist eine Grafiklage und kein Fund dieser Sitzung.

## Offen

- [ ] A1 entscheiden: wandert die Amtsstuben-Szene vor oder hinter `startShift()`? Davon hängen Prüfung 1 (181 Pixel) und Prüfung 2 (Nörgel oder niemand) gemeinsam ab.
- [ ] Entscheiden, welchen der beiden Wege die Tester gegangen sind (Abschnitt 4). Die Rückmeldung nennt die Dienstanweisung, und die liegt nur auf einem davon.
- [x] **Riegel 1 und 2 aus Prüfung 4 gesetzt** (27.08.2026, siehe unten).
- [ ] Kürzel-Kollision `A1` ff. gegenprüfen — steht weiter offen, A0 hat nur `A0` vergeben.
- [ ] Doku-Nachlese: die sieben Blätter (Nebenbefund).
