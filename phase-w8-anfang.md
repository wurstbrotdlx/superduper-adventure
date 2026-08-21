## W8: Der Anfang, Einstellung und Dienstanweisung — ERLEDIGT

Bauabschnitt zu `superduper-weltbibel.md`, Kapitel 0 (die Welt in fünf Sätzen), Kapitel 2 (Vorgeschichte und was der Spieler davon zu Beginn wissen darf), Kapitel 4 (das Ministerium), Kapitel 5 (der Außendienst) und 18.3 (die Laufbahn). Kapitel 14 kannte diesen Bauabschnitt nicht; er wird dort als W8 hinter W7 ergänzt.

Der Anlass ist eine Lücke, die keiner der bisherigen Bauabschnitte hatte schließen können, weil jeder von ihnen mitten im laufenden Dienst ansetzt: Bis hierher fing das Spiel mit vier Zeilen Startbildschirm an. Der Spieler wusste, welche Taste schlägt. Er wusste nicht, was er ist, was das Haus von ihm will, und woran er merkt, dass er vorankommt. Knöterichs Dienstzettel (Phase 5) fangen das im Kleinen auf, aber sie erklären eine Taste nach der anderen und beantworten die Frage „wozu das alles" nie, weil sie sie gar nicht stellen können: ein Zettel hat zwei Zeilen.

Alle unten genannten Bezeichner wurden gegen den Stand nach Commit `42991b6` geprüft, plus die Änderungen dieser Phase. Zeilennummern verschieben sich beim Arbeiten, die Bezeichner nicht: such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.

### Grundsatz: der Anfang ist ein Vordruck, kein Prolog

Kapitel 14 verbietet ausdrücklich Cutscene, Kamerafahrt und Standbild-Interlude. Das Verbot ist kein Sparzwang, es ist Weltlogik: dieses Spiel erzählt nichts, es legt vor. Also erzählt auch der Anfang nicht, sondern legt vor.

Das Haus stellt jeden Tag jemand Neues ein (Kapitel 5). Für einen täglich wiederkehrenden Verwaltungsakt gibt es einen Vordruck. Der Spieler liest beim ersten Dienstantritt genau das, was ein frisch Eingestellter liest, in genau der Form, in der er es bekäme: **Vordruck A 1, drei Blätter.** Er blättert, er liest, er unterschreibt. Es läuft nichts ab, nichts wird gesperrt, und er kann jederzeit zurückblättern.

Damit sind alle drei Verbote aus Kapitel 14 eingehalten:

1. **Keine Cutscene.** Ein Formular ist keine Zwischensequenz. Es hat keine Dauer, keine Tonspur und keinen Abspann, und man kann es später wieder aufschlagen.
2. **Kein Vorgriff auf die Akte.** Siehe eigener Abschnitt unten, das ist die eigentliche Entwurfsentscheidung dieser Phase.
3. **Kein Questmarker.** Das Blatt sagt, was der Dienst ist, nicht wohin man laufen soll. Kein Ort, keine Richtung, keine Reihenfolge, keine Karte.

Kein neues System: es ist dasselbe `#ovPanel`, das schon Dienstbericht, Amt und Jahresgespräch trägt. Kein neuer Speicherschlüssel und kein neues `amt`-Feld: der Merker liegt in `kn.seen.einstellung`, also in dem Speicher, der ohnehin schon weiß, welche Dienstzettel der Spieler gesehen hat, und der Tod, Schichtende und `startShift()` überlebt (`KN_KEY`). `knAllDone()` zählt weiterhin nur über `HINWEISE`, der zusätzliche Schlüssel stört dort nichts.

### Die eigentliche Entscheidung: Anlage 1 liegt nicht vor

Kapitel 2 sagt in einem Satz, was der Anfang nicht darf: *„Der Spieler erfährt davon zu Beginn nichts und am Ende alles."* Kapitel 9 setzt die erste Nennung des Wortes „Vorgang" auf Zwirns Satz im ersten Jahresgespräch, Schicht 10.

Ein Einstellungsformular, das den Auftrag des Hauses benennt, würde beides in der ersten Spielminute verbrennen. Ein Einstellungsformular, das den Auftrag verschweigt, wäre kein Formular.

Die Lösung ist die Form selbst. Der Vordruck benennt den **Zweck der Stelle** („die abschließende Bearbeitung herbeiführen") und verweist für den **Gegenstand der Bearbeitung** auf die Anlage. Darunter steht:

```
Anlage 1        liegt nicht vor
```

Der Spieler weiß danach: es gibt einen Auftrag, er ist der Grund für seine Stelle, und niemand hier kann sagen, was drinsteht. Das ist mehr Motivation als jede Vorgeschichte und null Vorgriff. Zwirns „Solange der Vorgang läuft, brauchen wir Sie ja" bleibt die erste Nennung.

`dienstAssert()` hält das hart nach: eine Sperrliste prüft jede Zeile dieses Bauabschnitts gegen die Begriffe der Akte (`Nachtrag`, `Ausfertigung`, `Zustell`, `Krieg`, `Frieden`, `Vertrag`, `Trepp`, `Sturz`, `Schattenfürst`, `Anschrift`, `Vorgang 1`, `Amtsleiterin`). Der Vordruck ist die verführerischste Stelle im ganzen Spiel, um „kurz zu erklären, worum es eigentlich geht"; der Guard ist die Bremse, die auch in zwei Jahren noch da ist.

Ausdrücklich **nicht** gesperrt und bewusst gesetzt: „Unterschrift der Amtsleitung: N. N." auf Blatt 3. Kapitel 4 verlangt für diesen Running Gag, dass er *unauffällig anfängt*. Früher als in der ersten Spielminute geht nicht.

### Die drei Blätter: `DIENSTBLATT` (`index.html:9773`ff.)

Ein Literal, drei Einträge, jeder mit `kopf`, `unter`, `lead`, optional `felder`/`punkte`/`bedienung`/`saetze` und einer Pflichtzeile `kn`. `felder`, `punkte`, `bedienung` und `saetze` sind **Funktionen, keine Literale**: Blatt 1 und 3 zitieren den Rang aus `RAENGE` (`rangNameVon(0)`, `rangNameVon(1)`, `RANG_VERH[0]`) statt ihn abzuschreiben, und `dienstAssert()` kann sie beim Start genauso aufrufen wie das Panel beim Rendern. Zwei Stellen, die dasselbe behaupten, sind die F1-Falle; hier gibt es nur eine.

| Blatt | Kopf | Beantwortet |
|---|---|---|
| 1 | Einstellungsverfügung | Was bin ich hier, für wie lange, und warum gibt es diese Stelle |
| 2 | Dienstanweisung | Was ist zu tun, in neun Punkten, plus die Bedienung |
| 3 | Laufbahn und Ziel | Woran merke ich, dass ich vorankomme, und worauf läuft das hinaus |

Blatt 2 ist die Antwort auf „was zu tun ist": Erledigung, Sachbestand, Beglaubigung, Nebenbestimmungen, verschlossene Vorgänge, Aushang, Dienstschluss, Amtsvermögen, Qualifikation. Neun Punkte in Amtsdeutsch, jeder zwei bis drei kurze Sätze, jeder eine Mechanik. Punkt 7 und 9 sagen ohne Umschweife, was ein Roguelite-Neuling sonst erst durch einen Schreck lernt: die Schicht endet auch unsanft, es geht dabei niemand verloren, und Stufe, Zauber und Ausrüstung enden mit ihr. Punkt 8 sagt im selben Atemzug, was bleibt.

Die **Bedienung** steht als eigener Kasten unter den neun Punkten, mit allen Tasten und beiden Eingabearten. Das ist Bedienungstext, keine Figurenrede: die Regel „höchstens eine Taste pro Hinweis" gilt für Knöterichs Dienstzettel (`knAssertCaps()`), nicht fürs Panel, genau wie die Zeichendeckel dort und hier nicht gelten (gleiche Begründung wie bei `rangZeremonieBlock()`).

Blatt 3 ist die Antwort auf „wie erreicht man das Ziel": Hebung alle fünf Schichten, die nächste namentlich („nach Schicht 5. Neue Amtsbezeichnung: Monstralamtsgehilfe."), jede zehnte Schicht Jahresgespräch, und was dem Haus über die Schicht hinaus bleibt. Darunter die vier Sätze, die die Motivation tragen, ohne die Akte anzufassen:

> Das Haus besteht, solange die Bearbeitung nicht abgeschlossen ist.
> Es kann sich also nur beenden, indem es seine Aufgabe erfüllt.
> Daran arbeiten hier fünf Beschäftigte und ein Kater.
> Ab heute sechs.

Kapitel 4 sagt denselben Gedanken in einem Absatz und nennt ihn den Grund, warum das Haus nicht zumacht. Hier steht er als das, was er für den Spieler ist: die Aufgabenbeschreibung. Der letzte Satz zählt ihn dazu, und weil die Stelle täglich befristet ist, gilt er nur heute. Das ist der Wärmepunkt des Anfangs, Humor-Grundgesetz 9.

### Das Panel: `dienstblattHtml()`, `showDienstblatt()` (`index.html:9859`ff.)

`dienstblattHtml(b)` ist eine reine Funktion ohne Seiteneffekt, Bauform wie `rangZeremonieBlock()` und `vorgangPanelHtml()`: jedes Neurendern liefert dasselbe.

**Nur der Vordruckteil rollt.** Der Kasten (`#dienstBox`, `max-height:34vh`) nimmt Felder, Punkte und Bedienung. Die Schlusssätze und Knöterich stehen darunter, außerhalb des Kastens, und sind immer sichtbar. Grund: auf Blatt 3 hängt genau dort der Grund, warum man das hier überhaupt tut. Er darf auf keinem Gerät unter der Kante liegen. Die erste Fassung hatte alles in einem Kasten, und auf 390×664 endete Blatt 3 sichtbar bei „Daran arbeiten hier fünf Beschäftigte und ein Kater." Der beste Satz des Blattes lag unter dem Falz.

**Ein abgeschnittener Vordruck sieht aus wie ein Fehler, nicht wie eine Fortsetzung.** Deshalb misst `showDienstblatt()` nach dem Rendern einmal `scrollHeight` gegen `clientHeight` und schreibt bei echtem Überlauf „Das Blatt geht unten weiter." in `#dienstMehr`. Kein Timer, kein Listener, keine Messung pro Frame: ein Vergleich beim Blättern.

`showDienstblatt(nr, ziel)` trägt seinen Zustand ausschließlich im `onclick` des gerade gerenderten Knopfes, nicht in einer Variablen, dieselbe Regel wie bei `vorgangPanel(schritt)`. `ziel` sagt, wofür das Blatt gerade offen ist:

| `ziel` | Wann | Letzter Knopf |
|---|---|---|
| `einstellung` | allererster Dienstantritt | UNTERSCHREIBEN, ruft `dienstAntritt()` |
| `menu` | im Startbild nachgelesen | SCHLIESSEN, zurück ins Startbild |
| `dorf` | im Amt nachgelesen | SCHLIESSEN, zurück ins Amt |

Beim Nachlesen kommt man aus jedem Blatt heraus, ohne durchblättern zu müssen (zusätzlicher kleiner SCHLIESSEN-Knopf). Beim ersten Dienstantritt nicht: dort wird das Blatt zu Ende geblättert, sonst unterschreibt man nichts. Das sind zwei Klicks, keine Sperre.

`dienstAntritt()` setzt `kn.seen.einstellung`, speichert über `saveKn()` und ruft `startShift()`. `dienstblattEnde(ziel)` verzweigt nach `showDorf()` oder `showStartScreen()`.

### Einbau: drei bestehende Stellen

**`startGame()`.** Beim allerersten Dienstantritt wird erst eingestellt, dann gearbeitet:

```js
if(!kn.seen.einstellung){ MUS.goto('office'); MUS.muffle(false); showDienstblatt(1, 'einstellung'); return; }
startShift();
```

Der Amtsmarsch läuft dabei, gleiche Behandlung wie in `showDorf()` und `showJahresgespraech()`. Danach nie wieder, nachlesbar bleibt es überall. Bei `CONFIG.schichtModus = false` (Entwicklerweiche, alte Todesregel) bleibt der Weg unverändert: dort gibt es keine Schichten, über die das Blatt reden könnte.

**`showStartScreen()`.** Das Startbild sagt jetzt, in welcher Welt man landet, bevor es fragt, ob man hinein will. Der Aufhänger ist der erste Satz der Weltbibel, Kapitel 0:

> Was nicht bearbeitet wird, wird lebendig.

Darunter drei Sätze, die die Ausgangslage benennen, ohne die Akte zu berühren, und die Steuerungszeile in Kurzform. Wer schon im Dienst war, sieht statt des Aufhängers zusätzlich seinen Stand (Amtsbezeichnung, Schichten, Amtskasse), der Knopf heißt dann „Dienst fortsetzen", und daneben steht „Dienstanweisung": Blatt 2 aufschlagen, ohne eine Schicht zu starten.

**`showDorf()`.** Zwei Zeilen mehr, beide aus vorhandenen Ableitungen, kein neuer Zustand:

* `Nächste Hebung nach Schicht ${(rangStufe()+1)*5}: ${rangNameVon(rangStufe()+1)}` unter der bestehenden Rangzeile. Die Laufbahn war bis hierher nur rückblickend sichtbar (was man ist), jetzt auch vorausschauend (was als Nächstes kommt und wann).
* Ein „Dienstanweisung"-Knopf unter „Nächste Schicht antreten", der Blatt 2 mit `ziel='dorf'` aufschlägt.

### Der Guard: `dienstAssert()` (`index.html:9943`ff.), Bauform wie `rangAssert()`

Achter selbstaufrufender Guard neben `knAssertCaps`, `blaetterAssert`, `rangAssert`, `anredeAssert`, `vorgangAssert`, `auftragAssertBrett`, `langAssert`. Wirft nie, meldet nur, gibt bei Erfolg eine Zeile aus. Er prüft drei Dinge, die man beim späteren Weiterschreiben genau so verliert:

1. **Formregeln aus Kapitel 13 auf jeder einzelnen Zeile**, über `dienstblattZeilen(b)` plus Kopf, Unterzeile, Vorspann und Knöterich: leerer Text, das Wort `undefined` im Text, Gedankenstrich statt Interpunkt, Emoji im Figurentext, Kesselgrammatik über die bestehende `PRUEF_GEHEIM`-Liste. Zusätzlich die Blattzählung: die Unterzeile muss „Blatt n von 3" tragen und `nr` muss der Position im Literal entsprechen, und jedes Blatt braucht mindestens eine Knöterich-Zeile.
2. **Den Sperrvermerk auf die Akte** (Abschnitt oben). Bewusst großgeschrieben geprüft, damit „kriegen" und „zufrieden" nicht anschlagen.
3. **Text gegen Code.** Blatt 2 Punkt 8 sagt „zur Hälfte", also prüft der Guard `CONFIG.goldUebertragAnteil === 0.5`. Blatt 3 verspricht eine Hebung mit neuer Bezeichnung, also prüft er, dass `rangNameVon(1)` sich von `rangNameVon(0)` unterscheidet. Das sind Zahlen, die woanders im Code stehen und sich unabhängig ändern lassen; nur der Guard verbindet die beiden Orte.

Dazu eine Erreichbarkeitsprüfung: die drei Einsprungpunkte hängen in `onclick`-Zeichenketten im `#ovPanel`, also am globalen Namensraum. Ein Umbenennen fiele sonst erst auf, wenn jemand den Knopf drückt.

## Was in W8 ausdrücklich nicht angefasst wird

* **Kein Wort der Akte wandert nach vorn.** Kapitel 2 bleibt für Kapitel 9 reserviert, Zwirns Satz bei Schicht 10 bleibt die erste Nennung.
* **Knöterichs Dienstzettel bleiben unverändert.** Kein Katalogeintrag, kein Beat, keine Eskalationsstufe, keine Zeile in `HINWEISE`. Der Vordruck sagt, was der Dienst ist; die Zettel sagen weiterhin, was jetzt gerade dran ist. Zwei Aufgaben, zwei Kanäle.
* **Keine Tooltipps, kein Tutorial.** Ausdrücklich der nächste Bauabschnitt, siehe unten. Diese Phase erklärt keine einzige Mechanik am Objekt.
* **Kein Eingriff in `startShift()`, `endShift()`, `nachSchicht()`.** Der Schichtzyklus ist unberührt.
* **Kein neues `amt`-Feld, keine `loadAmt()`-Ladezeile, kein neuer Speicherschlüssel.**

## Abnahme W8

* Erster Start: Titelbild mit Aufhänger, „Dienst antreten" führt auf Blatt 1, nicht in die Schicht (live geprüft).
* Drei Blätter vor und zurück blätterbar, UNTERSCHREIBEN nur auf Blatt 3, danach Schicht 1 mit `state === 'play'` und geschlossenem Overlay (live geprüft).
* `kn.seen.einstellung` überlebt den Neuladen: zweiter Besuch zeigt „Dienst fortsetzen" und den Dienstanweisungsknopf, das Blatt kommt nicht wieder (live geprüft).
* Nachlesen aus dem Startbild und aus dem Amt, jeweils mit korrekter Rückkehr an den Ausgangsort (live geprüft, beide Wege).
* Die Motivationssätze und Knöterich stehen auf jedem geprüften Format außerhalb des Rollkastens und sind immer sichtbar; das Panel passt auf 1280×800 und auf 390×664 vollständig ins Fenster (gemessen, nicht geschätzt).
* Amt zeigt „Nächste Hebung nach Schicht N: Titel" korrekt für einen Zwischenstand (Schicht 7 liefert Schicht 10, Monstralamtsmeister; live geprüft).
* Sperrvermerk und Formregeln: `dienstAssert()` prüft jede Zeile, meldet beim Start eine einzige Erfolgszeile, keine Fehler.
* Keine `pageerror`, keine Konsolenfehler auf dem gesamten Weg vom Laden bis in die laufende Schicht.

## Der nächste Bauabschnitt: W9, Tooltipps am Objekt

Diese Phase beantwortet „was ist das hier und warum". Sie beantwortet **nicht** „was macht dieser Knopf, während ich davorstehe". Das ist der ausdrückliche Auftrag für W9 und bewusst getrennt gehalten, weil es ein anderer Kanal mit anderen Regeln ist:

* Der Vordruck erklärt einmal, vorab, vollständig, auf Papier. Ein Tooltipp erklärt wiederholt, im Moment, punktuell, am Objekt.
* Das `#tooltip`-Element existiert bereits im Markup und wird bisher nur für Gegenstände benutzt. Der Ausbau auf Gürtelknöpfe, Kesselreiter, Skillzeilen, Zauberknoten, Ausrüstungsplätze und Kammerschilder braucht kein neues System.
* Knöterichs Wissenslücken-Schübe (`kn.wissensluecke`) sind der bestehende Steckenbleib-Kanal. W9 muss sich mit ihm abstimmen, nicht neben ihm herlaufen.
* Zu prüfen bleibt, ob eine wiederholbare Übersicht der Mechaniken (Kessel, Nebenbestimmungen, Kammern, Aushang) besser als vierter Reiter im Kessel liegt, bei Kladde und Akten, als in einem eigenen Panel. Die Kladde ist bereits das Gedächtnis des Hauses, und Wissen ist Amtsvermögen.

## Live geprüft

Node-Syntaxcheck nach jedem Bauschritt, danach live im Browser über `python3 serve.py 8378`, gesteuert per Playwright auf dem vorinstallierten Chromium, mit mitgeschriebener Konsole und Bildschirmfotos.

Wichtige Einschränkung, damit niemand die Konsolenausgabe falsch liest: `assets/cf/` liegt lizenzbedingt nicht im Repo. Für den Live-Lauf wurden Platzhalter-PNGs in den ignorierten Unterordnern erzeugt, damit `loadAssets()` durchläuft und `bakeUiSkin()` nicht auf ein fehlendes `SHEETS['cfui_frame']` trifft. Sie haben die falschen Maße, deshalb meldet `assertRigRegistrations()` erwartungsgemäß Zeilenüberläufe und `npcAnkerAssert()` Ankerabweichungen. Diese Warnungen stammen aus den Platzhaltern, nicht aus dieser Phase; die Platzhalter wurden nach dem Prüflauf wieder entfernt. Geprüft wurde gegen `console.error` und `pageerror`, und beide blieben über alle Läufe leer.

* Vollständiger Weg auf 1280×800: Titelbild, Blatt 1, Blatt 2, Blatt 3, einmal zurück auf Blatt 2 und wieder vor, UNTERSCHREIBEN. Danach `overlay.style.display === 'none'`, `state === 'play'`, Zonenzeile „Vordermühl an der Ablage (Stufe 1) · 25:00", `localStorage`-Merker gesetzt.
* Derselbe Weg auf 390×664. Panelunterkante gemessen: Blatt 1 bei 640, Blatt 2 bei 561, Blatt 3 bei 663 von 664 Pixeln Fensterhöhe, also überall vollständig im Bild. Auf 1280×800 entsprechend 699, 667, 729 von 800.
* Überlaufhinweis: erscheint auf 1280×800 nur auf Blatt 2 und 3, auf 390×664 auf allen drei Blättern, und bleibt aus, wo nichts überläuft.
* Neuladen nach der Unterschrift: Titelbild mit „Dienst fortsetzen", Blatt kommt nicht wieder, Dienstanweisung über den Knopf erreichbar, SCHLIESSEN führt zurück ins Titelbild.
* Nachlesen aus dem Amt mit gesetztem Zwischenstand (`amt.schichten = 7`): Rangzeile, Hebungszeile und Dienstanweisungsknopf korrekt, SCHLIESSEN führt zurück ins Amt, nicht ins Titelbild.
* Gestandener Spieler simuliert (`amt.schichten = 23`): Standzeile „Monstralobersekretär · 23 Schichten im Dienst · Amtskasse 910", Blättern und Rückkehr unverändert.
* `dienstAssert()` meldet beim Start „3 Blätter, Formregeln und Sperrvermerk in Ordnung." und sonst nichts. Die sieben bestehenden Guards melden unverändert nichts.
