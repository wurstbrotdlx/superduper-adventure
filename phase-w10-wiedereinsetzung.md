## W10: Die Wiedereinsetzung — ERLEDIGT

Bauabschnitt zu `superduper-weltbibel.md`, Kapitel 5 (der Außendienst, Dienstschluss, Amtsvermögen) und 18.2 (der Titel gehört nicht dir). Kapitel 14 kannte diesen Bauabschnitt nicht; er wird dort als W10 hinter W9 ergänzt.

Der Anlass ist eine Spielerwunsch-Idee: eine echte Roguelite-Option, die den Charakter gegen Bezahlung überleben lässt, ohne Inventar und Skills. Die Mechanik ist übernommen, die ursprünglich vorgeschlagene Rahmung („Bestechung") nicht. Warum, steht im nächsten Abschnitt, und es ist die einzige inhaltliche Abweichung von der Vorgabe.

Alle Bezeichner wurden gegen den Stand nach `23f9cd1` geprüft, plus die Änderungen dieser Phase.

### Grundsatz: eine Gebühr, keine Bestechung

Humor-Grundgesetz 2 und 4 sind an dieser Stelle unmissverständlich: *„Nicht 'Beamter ist faul', sondern 'Beamter ist mit vollem Einsatz für die falsche Sache zuständig'"* und *„Nie über Menschen lachen, immer über Zuständigkeit. Keine Figur ist dumm. Jede Figur ist gefangen."* Dazu Grundgesetz 8: kein Zynismus. Ein bestechlicher Beamter ist genau der eine Beamtenwitz, den dieses Projekt nicht macht. In dem Moment, in dem eine Figur Geld nimmt, ist sie eine Witzfigur statt ein gefangener Mensch, und der Ton des ganzen Hauses kippt mit ihr. Bei Zielgruppe ab 10 kommt hinzu, dass die Mechanik dann wörtlich lautet: zahl was, dann gelten die Regeln nicht.

Bezahlt wird deshalb eine **Gebühr an die Amtskasse**, nicht eine Person. Gebühren sind in dieser Welt längst etabliert, das Kammerschild heißt Gebührenbescheid. Niemand im Haus nimmt Geld, niemand drückt ein Auge zu, niemand findet den Vorgang bemerkenswert.

### Die Begründung stand schon in Kapitel 5

Warum der Dienstposten überhaupt täglich neu besetzt wird, steht dort wörtlich:

> Eine Verlängerung wäre eine Neubesetzung, eine Neubesetzung erfordert eine Ausschreibung, eine Ausschreibung erfordert die Amtsleitung.

Es gibt keine Amtsleitung. Genau das ist der stabilste Running Gag des Hauses (Kapitel 4), und bis hierher hat er ausschließlich gegen den Spieler gearbeitet.

Ein **Antrag auf Wiedereinsetzung in den vorigen Stand** ist keine Verlängerung und keine Neubesetzung, sondern eine Berichtigung. Anderer Paragraf, keine Ausschreibung, keine Leitung nötig. Das Haus kann ihn bewilligen, ohne eine einzige eigene Regel zu brechen. Der Vermerk im Panel sagt genau das und sonst nichts: *„Vermerk: Eine Ausschreibung wird nicht erforderlich."*

Der Begriff ist real (§ 32 VwVfG) und heißt wörtlich, was ein Roguelite-Continue tut: man wird in den Zustand von vorher zurückversetzt.

### Was der Stand umfasst, und warum so wenig

Das Haus legt „Stand" so eng aus, wie es darf: als **Dienststand**, nicht als Sachausstattung. Zurück kommen die Stufe (halbiert) und das Gesicht. Nicht zurück kommen Ausrüstung (ist Amtsvermögen und wird eingezogen wie immer, siehe die bestehende Dienstbemerkung „Ausrüstung verbleibt aktenkundig beim Amt"), Zauber und Skillpunkte (sind Beurteilung, keine Sache).

Das ist die Pointe auf beiden Ebenen: man bekommt genau den Teil zurück, der das Haus nichts kostet. Zehnjährige lesen „die haben mir nur das langweilige Zeug wiedergegeben", Erwachsene die enge Auslegung eines Rechtsbegriffs.

Mechanisch ist es trotzdem kein Nullkauf: `recalc()` rechnet `maxHp = 70 + (level-1)*12` und `maxMana = 40 + (level-1)*8`. Wer in Stufe 5 wiederkommt, startet mit 118 statt 70 Trefferpunkten. Zurück kommt **Zähigkeit, nicht Können** — genau die Größe, die zu „derselbe Mensch, schon einen Tag im Dienst" passt.

### Zwei Regeln, die unangetastet bleiben

**„Persönliche Qualifikation ist nicht übertragbar" (Kapitel 5)** bleibt wortwörtlich gültig. Es wird nichts übertragen, weil niemand wechselt. Genau deshalb muss es derselbe Mensch sein und nicht ein Erbe, und genau deshalb ist der Antrag die einzig mögliche Bauform.

**Der Rang bleibt unverkäuflich (18.2: „er kostet kein Gold, er lässt sich nicht kaufen").** Der Antrag fasst `amt.schichten` nicht an, also auch `rangStufe()` nicht. Gekauft wird der Dienststand der Person, nie die Stelle. `wiederAssert()` Abschnitt (5) beweist das, indem es einen bewilligten Antrag setzt und `rangStufe()` davor und danach vergleicht.

### Die Rechnung: vier reine Funktionen (`index.html`, W10-Block)

```js
function wiederAnfangsstufe(){ return 1 + amt.ausbauten.startLevel; }
function wiederStand(){ return Math.max(1, Math.floor(player.level / 2)); }
function wiederBeschwer(){ return wiederStand() > wiederAnfangsstufe(); }
function wiederGebuehr(){ /* Grund + je Stufe über der Anfangsstufe + Wiederholungszuschlag */ }
```

`wiederAnfangsstufe()` ist neu die **eine** Wahrheitsquelle für die Anfangsstufe. Die Rechnung stand vorher nur inline in `startShift()`, und der Antrag hätte sie abgeschrieben (die F1-Falle); jetzt liest `startShift()` dieselbe Funktion.

**Das Gatter ist kein Schwellenwert, sondern ein Verfahrensgrundsatz.** „Ein Antrag ohne Beschwer ist unzulässig": liegt der vorige Stand nicht über der Anfangsstufe, ändert die Bewilligung nichts, also nimmt das Haus den Antrag nicht an. Das skaliert von selbst mit dem Ausbau „Höhere Anfangsstufe" mit, ohne dass hier eine zweite Zahl gepflegt werden müsste. Bei Anfangsstufe 5 ist Stufe 10 noch ohne Beschwer, Stufe 12 nicht mehr.

**Gebührenverzeichnis:** `WIEDER_GRUND = 40`, `WIEDER_JE_STUFE = 30` je Stufe über der Anfangsstufe, `WIEDER_WIEDERHOLUNG = 60` je bereits bewilligtem Antrag. Der dritte Posten ist der Grund, warum der Antrag kein Dauerabo wird: Stufe 10 kostet beim ersten Mal 160, beim zweiten 220. Zum Vergleich kosten die Dorf-Ausbauten 30 bis 240, der Antrag konkurriert also echt mit ihnen um dieselbe Amtskasse.

### Zustand: zwei Felder, beide nicht ableitbar

`amt.wiederZahl` (Zahl der bewilligten Anträge, treibt allein den Wiederholungszuschlag) und `amt.wiedereinsetzung` (der bewilligte, noch nicht eingelöste Antrag `{stand, haar}` oder `null`). Anders als Rang und Aktstand ist beides echter Zustand und nicht aus `amt.schichten` herleitbar, deshalb zwei Felder statt einer Ableitung. Bauform wie `amt.auftrag`/`amt.brett` aus W4, inklusive der strukturellen Prüfung in `loadAmt()`.

Persistiert wird bewusst, nicht als Laufzeitvariable wie `pendingCarryGold`: die Gebühr ist zum Zeitpunkt der Bewilligung schon gebucht, ein Neuladen zwischen Dienstbericht und nächster Schicht dürfte den bezahlten Antrag nicht verschlucken. Ein bewilligter Antrag ist ein Aktenvorgang, und Aktenvorgänge überleben die Nacht.

`startShift()` löst ihn ein und leert ihn im selben Zug, mit `saveAmt()` genau dann, wenn wirklich einer vorlag.

### Der Fund: die Klemme war einseitig

Der erste Prüflauf mit einem von Hand manipulierten Spielstand (`{stand: 999}`) ergab eine laufende Schicht auf **Stufe 999**. `loadAmt()` klemmte nur nach unten (`Math.max(1, …)`), `startShift()` ebenfalls nur nach unten (gegen die Anfangsstufe). Schlimmer als der Wert selbst war, dass der Kommentar an der Ladestelle behauptete, ein manipulierter Spielstand könne hier nichts erzwingen.

Behoben mit derselben Lehre wie GW3 bei `amt.schichten`: **beidseitig klemmen.** `wiederStandGeklemmt()` ist jetzt die eine Klemmstelle, gelesen von `loadAmt()` beim Laden und von `startShift()` beim Einlösen, damit auch ein zur Laufzeit gesetztes Feld nicht am Loader vorbeikommt. Die Funktion und ihre Deckel stehen bewusst oben bei `AMT_KEY` und nicht im W10-Block: `loadAmt()` läuft direkt darunter auf Skriptebene, ein `const` weiter unten liefe in die TDZ.

`WIEDER_STAND_DECKEL = 60` ist keine Balance-Zahl, sondern die Zusage, die der Kommentar macht. Er liegt weit über allem, was eine Schicht je erreicht.

### Der Guard: `wiederAssert()`, Bauform wie `rangAssert()`/`dienstAssert()`

Elfter selbstaufrufender Guard. Wirft nie, meldet nur. Spiegelt `player.level`, `player.hair`, `amt.wiederZahl`, `amt.wiedereinsetzung`, `amt.ausbauten.startLevel` und `amt.bankGold` und stellt alles im `finally` zurück, wie `goldAssert()` es vormacht. Acht Abschnitte:

1. Formregeln auf den drei festen Texten (Gedankenstrich, Emoji, Kesselgrammatik).
2. Beschwer: bei Gleichstand unzulässig, eine Stufe darüber zulässig.
3. Die Hälfte ist die Hälfte, abgerundet, nie über der erreichten Stufe, nie unter 1, über neun Stützstellen.
4. Gebühr steigt monoton mit dem Stand und um genau `WIEDER_WIEDERHOLUNG` je Antrag, nie unter die Grundgebühr.
5. Der Ausbau „Höhere Anfangsstufe" verschiebt die Schwelle mit, ohne zweite Zahl.
6. 18.2: der bewilligte Antrag bewegt `rangStufe()` nicht.
7. Die Klemme, beidseitig, über sieben Stützstellen inklusive `999`, `0`, `-7` und `NaN`. Das ist der Abschnitt, den der Fund oben erzwungen hat.
8. Erreichbarkeit des `onclick`-Einsprungpunkts im globalen Namensraum.

### Einbau: der Dienstbericht rollt jetzt

Der Block sitzt im bestehenden Dienstbericht (`endShift()`), kein neues Panel. Dabei ist ein Layoutproblem aufgefallen, das älter ist als dieser Bauabschnitt: der Bericht hatte **gar keine Überlaufbehandlung** und stand auf 390×664 im schlimmsten Fall (Schicht im Fünferschritt, also mit Hebungsblock) schon bei 654 von 664 Pixeln. Der Wiedereinsetzungsblock mit seinen 192 Pixeln hätte ihn dort auf 758 gedrückt und den WEITER-Knopf aus dem Bild geschoben.

Aufteilung jetzt, gleiche Regel wie beim Vordruck in W8: **was rollt, ist der Rückblick.** Dienstbericht und Hebungsblock liegen in `#berichtRoll` (`max-height:30vh`). Alles, was eine Handlung verlangt oder den Ton setzt, steht außerhalb und ist immer sichtbar: Titel, Anlass, der Antrag samt Knopf, Nörgels Bemerkung, WEITER. Der Antrag gehört ausdrücklich dazu, denn er kostet Geld und ist eine Entscheidung, und eine Entscheidung hinter einem Rollbalken ist keine. Bei echtem Überlauf schreibt `endShift()` einmal nach dem Rendern „Der Bericht geht im Kasten weiter." dazu, dieselbe Messung wie in `showDienstblatt()`.

### Lisbeth fragt weiter, und zwar mit Absicht

`ANREDE_LISBETH` zykelt über `amt.schichten % 5`, nicht über die Person. Sie fragt also auch dann nach dem Namen, wenn derselbe Mensch zum zweiten Mal antritt. Das ist eine bewusste Entscheidung des Auftraggebers gegen den ursprünglichen Vorschlag, sie beim Wiedersehen schweigen zu lassen, und sie ist die bessere: 18.5 nennt Lisbeths Frage den Grund, warum das Titelsystem trägt, und eine Frage, die auch beim Wiedersehen kommt, ist trauriger und komischer als eine, die ausbleibt. Sie kostet null Zeilen Code.

## Was in W10 ausdrücklich nicht angefasst wird

* **Der Rang.** Keine Zeile fasst `amt.schichten` an. Kein Kauf, keine Abkürzung, keine Herabstufung.
* **Die Kladde und die Aktenfunde.** Wissen ist Amtsvermögen und war nie an die Person gebunden.
* **Die Goldaufteilung.** `goldAufteilung()` bleibt unberührt; die Gebühr wird nach der Schichtabrechnung aus der Amtskasse gebucht, nicht vor ihr.
* **Der Tod als solcher.** `showDead()`, `respawnPlayer()` und die Nicht-Schicht-Weiche bleiben, wie sie sind.
* **Eine zweite Währung.** Es wird in Gold bezahlt (Kapitel 14 verbietet eine zweite ausdrücklich).

## Abnahme W10

* Angebot erscheint nur im Schichtmodus und nur, wenn der Spieler mindestens eine Stufe gestiegen ist (live geprüft an Stufe 1, 2, 10 und 12).
* Ohne Beschwer nennt das Panel den Grund und bietet keinen Knopf (live geprüft).
* Reicht die Amtskasse nicht, ist der Knopf gesperrt und sagt es (live geprüft bei Bestand 10 gegen Gebühr 220).
* Bewilligung bucht genau einmal: zweiter Aufruf von `wiederBeantragen()` ändert weder Gold noch Zähler (live geprüft).
* Einlösung gibt Stufe und Gesicht zurück und sonst nichts: Stufe 12 wird zu Stufe 5, Haar bleibt `h3`, Skillpunkte 0, Zauberpunkte 0, keine Zauber, nur die Startwaffe, leerer Rucksack, Rang unverändert (live geprüft).
* Kontrollschicht ohne Antrag im selben Lauf: Stufe 1, neu gewürfeltes Haar, 70 Trefferpunkte (live geprüft).
* Ein bewilligter Antrag überlebt das Neuladen und wird danach korrekt eingelöst (live geprüft).
* Ein manipulierter Spielstand kann nichts erzwingen: `{stand: 999}` ergibt Stufe 60, nicht 999 (live geprüft nach dem Fix, davor war es 999).
* Dienstbericht passt auf 1280×800 und 390×664 vollständig ins Fenster, in allen vier Kombinationen aus Hebungsschicht und Antragsblock, und der Antragsknopf ist auf beiden ohne Rollen sichtbar und anklickbar (gemessen, nicht geschätzt).
* `wiederAssert()` meldet beim Start eine einzige Erfolgszeile, keine Fehler. Die zehn bestehenden Guards melden unverändert nichts.

## Bewusst offen für spätere Bauabschnitte

* **Keine Figur kommentiert den Antrag.** Knöterich hat keine Zeile dazu, Nörgel keine Bemerkung, Bramsche keine Antwort. Das wäre der naheliegende nächste Schritt und gehört in einen eigenen Bauabschnitt, mit Zeichendeckel und `knAssertCaps()`.
* **Der zweite Antritt derselben Person ist im Dorf nicht sichtbar.** Niemand erkennt einen wieder. Ob überhaupt jemand soll, außer Lisbeth durch ihr Nichterkennen, ist eine Erzählentscheidung und keine Mechanikfrage.
* **Kein Rekordwert.** `amt.wiederZahl` zählt nur für die Gebühr. Weder Dienstausweis noch Jahresgespräch lesen ihn. Ein Feld, das nur sich selbst zählt, wäre die GW26b-Falle.

## Live geprüft

Node-Syntaxcheck nach jedem Bauschritt, danach live im Browser über `python3 serve.py 8378`, gesteuert per Playwright auf dem vorinstallierten Chromium, mit mitgeschriebener Konsole und Bildschirmfotos. Geprüft wurde gegen `console.error` und `pageerror`, beide blieben über alle Läufe leer.

* Volle Antragsstrecke: Angebot, Bewilligung, Doppelklick, Einlösung, Kontrollschicht, alles in einem Lauf, plus die beiden Sonderfälle unzulässig und zu teuer.
* Neuladen mit bewilligtem Antrag, danach Einlösung über den normalen Weg „Dienst fortsetzen".
* Manipulierter Spielstand mit `{stand: 999, haar: 'gibtsnicht'}`: Stufe geklemmt auf 60, Haar auf einen bekannten Wert zurückgefallen, Antrag danach geleert.
* Layoutmessung des Dienstberichts auf 1280×800 und 390×664, mit und ohne Hebungsblock, mit und ohne Antragsblock. Vorher-Werte dokumentiert im Abschnitt „Einbau".
* Klick auf den Antragsknopf auf einem echten Mobil-Kontext (`hasTouch`, `isMobile`, 390×664): Gebühr gebucht, Antrag bewilligt, WEITER weiterhin ohne Rollen erreichbar.
* W8 gegengeprüft (Vordruck, Blätter, Amtspanel auf beiden Formaten): unverändert, keine Konsolenfehler.

Wichtige Einschränkung, unverändert gegenüber W8: `assets/cf/` liegt lizenzbedingt nicht im Repo, der Live-Lauf nutzte Platzhalter-PNGs in den ignorierten Unterordnern. Sie haben die falschen Maße, deshalb melden `assertRigRegistrations()` und `npcAnkerAssert()` erwartungsgemäß Abweichungen. Diese Warnungen stammen aus den Platzhaltern, nicht aus dieser Phase; die Platzhalter sind über `.gitignore` von jedem Commit ausgeschlossen und nach dem letzten Prüflauf gelöscht. **Ein Lauf mit der echten Grafik steht aus** und ist Voraussetzung für die Abnahme mit der Hausregel „stille Konsole".
