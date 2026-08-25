# SuperDuper Adventure, Zusagen-Bilanz

Prüfauftrag, kein Umbauauftrag. **Du änderst in diesem Durchgang keine Zeile Code und keine Zeile Plan.** Am Ende steht ein Bericht, sonst nichts. Wenn du etwas reparieren willst, schreibst du es als Vorschlag in den Bericht und wartest auf Freigabe.

## Auftakt für eine frische Session

> Lies superduper-zusagen-bilanz-prompt.md in `~/vibecodingprojekt/adventure/`. Führe die Zusagen-Bilanz vollständig aus. Nichts ändern, nur berichten.

Modell: `/model opus`, ausdrücklich **nicht** `opusplan`. Bei `opusplan` läuft Opus nur im Plan-Modus und die Ausführung fällt auf Sonnet zurück. Hier ist aber die Ausführung die eigentliche Denkarbeit: eine Zahl im Plan finden, ihre echte Entsprechung im Code aufspüren, und entscheiden, ob eine Abweichung Absicht, Folgeänderung oder Fehler ist. Genau dieser Teil darf nicht auf dem schwächeren Modell landen. Plan-Modus ist überflüssig, weil die Session ohnehin nichts schreibt.

## Warum es diesen Auftrag gibt

`superduper-reparatur-prompt.md` nennt am Ende zwei offene Lücken. Die zweite lautet wörtlich:

> Die systematische Zusagen-Bilanz fehlt. Abschnitt 5 des Abgleichauftrags verlangte, alle konkreten Zusagen der Plandokumente einzeln nachzurechnen: Zahlen, Bezeichner, Tastenbelegungen, Schwellenwerte, Wahrscheinlichkeiten, Cooldowns. Was an stillschweigenden Abweichungen im Bericht steht, ist Beifang der Phasenprüfung. **Das ist der lohnendste eigene Prüfauftrag nach dieser Reparatur.**

Der Abgleich vom 27.07.2026 hat die Phasen **erzählend** geprüft: ist gebaut, was beschrieben ist. Er hat nicht **rechnend** geprüft: stimmt jede einzelne Zahl. Deshalb sind seine Zahlfunde Zufallstreffer. Diese Session macht daraus eine Bilanz.

Zur ersten Lücke, der adversarialen Gegenprobe: die ist **weitgehend abgegolten** und nicht Gegenstand dieses Auftrags. Jeder Bauabschnitt R1 bis R9 war verpflichtet, seine Funde vor der Reparatur selbst am Code nachzuprüfen, und das hat getragen: R9 widerlegte F47 vollständig, R8 drei Teilbehauptungen (F64-NPCs, F71-Zeile-3, F17), R7 zwei (F49 „startet die Phrase neu", F48 `swellGain`), R2 die Schadensbehauptung zu F10. Was bleibt, ist der Rest aus der Liste „Ausdrücklich nicht anfassen" und die Funde, die kein Abschnitt angefasst hat. Nimm das als Nebenbefund mit, wenn es dir unterwegs auffällt, aber such nicht danach.

## Kontext

Repo: `~/vibecodingprojekt/adventure/`, `wurstbrotdlx/superduper-adventure`, Branch `main`. Ein Spielfile: `index.html`, rund 6400 Zeilen. Stand bei Abfassung: `2e066d1`.

**Statusmarker sind keine Quelle, `git log` ist die Quelle.** Diese Falle hat schon zugeschlagen: R6 und R7 standen monatelang als OFFEN in `superduper-reparatur-prompt.md`, obwohl beide gebaut, abgenommen und committet waren (`81ef6d9`, `f2f9928`). Wer den Stand aus den Markern liest, liest falsch. Inzwischen nachgezogen, aber die Regel bleibt.

Plandokumente, die als Soll gelten:

* `superduper-gameplay-prompt.md` — Phasen 1 bis 6, mit Abnahmekriterien und Umsetzungsnotizen
* `superduper-grafik-prompt.md` — Phasen G0 bis G5, gleiche Struktur
* `superduper-weltbibel.md` — Fiktion, Ensemble, Rangsystem, Humor-Grundgesetz, Prüfliste für Texte
* `phase-w1-terminologie.md`, `phase-w2-aktenfunde.md`, `blaetter-serie-a-b.md` — die Welt-Phasen
* `ABGLEICH-2026-07-27.md` und `superduper-reparatur-prompt.md` — nicht Soll, aber **Vorgeschichte**: dort steht, welche Zahlen schon einmal angefasst wurden

Zwei Warnungen zu Zeilennummern: die Angaben in `ABGLEICH-2026-07-27.md` stammen vom Stand `d7a7c9f` und haben sich seither um dutzende Zeilen verschoben. **Immer über den Bezeichner suchen, nie über die Zeilennummer.** Die im Bericht genannten Commit-Hashes beziehen sich teilweise auf den Stand vor einem History-Rewrite und existieren nicht mehr.

Achtung Namenskollision: **Phase 5 (Gameplay, Knöterich)** und **Phase G5 (Grafik, Dorf/UI)** sind zwei verschiedene Dinge. Halte sie im Bericht sauber auseinander.

`~/vibecodingprojekt/knoeterich-phase5.md` liegt eine Ebene höher, ist ein **überholter Einzelentwurf** mit leerem Notizteil. Die kanonische Fassung ist Phase 5 in `superduper-gameplay-prompt.md`. Nimm den Einzelentwurf höchstens als Zweitzeugen, nie als Soll.

## Was eine Zusage ist

Eine Zusage ist jede Stelle im Plan, die eine **nachrechenbare Behauptung** über den Code aufstellt. Fünf Sorten:

1. **Zahl.** Tabellenlänge, Schwellenwert, Cooldown, Radius, Preis, Cap, Wahrscheinlichkeit, Zeichendeckel, Framezahl, Ankerwert.
2. **Bezeichner.** Ein Name, den der Plan wörtlich nennt: Variable, Funktion, Konstante, `localStorage`-Schlüssel, CSS-Klasse, Zeichentyp-Tag.
3. **Eingabe.** Tastenbelegung, Maustaste, Touch-Geste, und ihre Entsprechung im jeweils anderen Eingabemodus.
4. **Beziehung.** „A ist größer als B", „X kommt vor Y", „P ist die Summe von Q". Diese sind die wertvollsten, weil sie auch dann brechen, wenn beide Einzelwerte für sich plausibel aussehen. Beispiel aus Phase 5: der Blasenradius **muss** größer sein als der Abstand Spawn zu Kessel, sonst kommt Beat 1 nie.
5. **Vollständigkeit.** „alle N Einträge haben Feld X", „jeder tastenbehaftete Hinweis hat eine Touch-Fassung".

Keine Zusage sind: Zeilennummern in Plantexten, Zeitschätzungen („etwa 30 Minuten"), Commit-Hashes, Beispieltexte, Begründungsprosa.

## Arbeitsweise

Das Material ist groß: rund 2900 Zeilen Plan über sechs Dateien, mit über tausend Zahlvorkommen, von denen ein gutes Drittel echte Zusagen sind. Das schafft kein Fließtext-Durchgang. Geh in Paketen vor.

1. **Extrahieren, bevor du prüfst.** Erst je Paket alle Zusagen aus dem Plan ziehen und als Zeile notieren (Fundort, Wortlaut, erwarteter Wert). Erst danach in den Code. Wer beides mischt, prüft nur, was er zufällig noch im Kopf hat, und bekommt genau den Beifang, den dieser Auftrag ersetzen soll.
2. **Jede Zusage bekommt ein Urteil**, auch die langweiligen. Eine Bilanz, die nur Treffer nennt, ist keine Bilanz. Fünf Urteile: **stimmt**, **weicht ab**, **nicht auffindbar**, **überholt** (spätere Phase hat sie bewusst ersetzt, Notiz vorhanden), **nicht prüfbar** (mit Grund).
3. **Bei Abweichung: Ursache suchen, nicht nur Differenz melden.** Drei Sorten, wie im Abgleich: bewusst geändert mit Notiz, stillschweigend geändert, schlicht falsch. Die mittlere ist die teure.
4. **Beleg über den Bezeichner**, mit heutiger Zeilennummer, die du selbst gelesen hast. Nicht aus dem Abgleichbericht abschreiben.
5. **Rechne wirklich nach.** Wo der Plan eine Tabellenlänge behauptet, zähl die Einträge. Wo er eine Summe behauptet, bilde sie. Wo er eine Wahrscheinlichkeit behauptet, lies den Ziehungscode und rechne sie aus. „Sieht plausibel aus" ist kein Urteil.

Zusammengesetzte und abgeleitete Werte sind die ergiebigste Stelle: ein Wert, der im Plan als feste Zahl steht, im Code aber aus einer Funktion fällt (`cost: l => 30*(l+1)`), stimmt fast nie über alle Stufen.

## Die Pakete

Acht Pakete. Sie sind unabhängig und können parallel bearbeitet werden. Jedes liefert dieselbe Tabellenform.

### Z1: Kessel-Grammatik, Gameplay Phasen 1 bis 3

Tabellenlängen und Ableitungsregeln. Der Abgleich nennt als Soll 21 Substantive, 26 Adjektive, 24 Wirkungen, 24 Flüche und hat sie **nicht einzeln nachgezählt**. Dazu: Seltenheitsstufen und ihre Farben, Qualität als Summe der Seltenheiten, „dreimal gleich ergibt ein Unikat", Slot-Ableitung über das häufigste Substantiv, Wirkungs-Ableitung über das häufigste Adjektiv, Zahl der Taschenplätze (24), Drop-Wahrscheinlichkeiten, Affix-Sätze. Prüfe auch die **Vollständigkeit**: hat jedes Substantiv ein Icon, jedes Adjektiv eine Wirkung, jeder Fluch eine Rückseite.

### Z2: Amt und Wirtschaft, Gameplay Phase 4

`AUSBAU_DEFS` mit Kosten je Stufe und `max`, die beiden Sonderposten (Vermutungen 100, Startfluch 60), Bankanteil (`CONFIG.goldUebertragAnteil`), Jahresgespräch alle 10 Schichten, Schichtlänge, Dienstsiegel-Bonus. **Achtung Vorgeschichte:** F20 (Vollausbau 3850 gegen 1000 bis 1500 Bankzugang pro Schicht) wurde in R1 als „braucht eine durchgespielte Schicht" vertagt und nie entschieden. Rechne die Zahl aus, entscheide sie nicht.

### Z3: Knöterich, Gameplay Phase 5

Das dichteste Paket. Zeichendeckel 48 und 32 für Zettel und Blase, 44 für Randnotizen; globaler Cooldown 25 Sekunden; Budget 3 Zettel in 2 Minuten; Blasenradius 150 Pixel gegen 97 Pixel Spawn-Abstand; Sperrzone 220 Pixel für aggro-Monster; Steckenbleib nach 50 Sekunden; Randnotiz-Taktung 40 Sekunden; Untätigkeit nach 25 Sekunden; Trank-Schwellen 3, 7, 12, 20; alle Prio-Werte der Hinweistabelle (100, 90, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20); Prüfung alle 15 Frames; Auto-Ausblenden nach 6 Sekunden; `top: 46px` und `78px` bei sichtbarer Bossbar, `z-index: 12`, `max-width: min(420px, calc(100vw - 200px))`; `AKT_NACHFRAGE = 9`; Wiederholtiefe 3 Zettel; Schlüssel `sda_knoeterich_v1`.

Zusätzlich die **Beziehungen**: Blasenradius größer als Spawn-Abstand, Randnotiz-Taktung kleiner als Steckenbleib-Schwelle, Zeichendeckel gelten auch für zusammengesetzte Zeilen mit ihrem längstmöglichen Wert. Und die **Vollständigkeit**: hat jeder tastenbehaftete Hinweis eine Touch-Fassung, deckt `knAssertCaps()` wirklich alle Tabellen ab.

### Z4: Audio, Gameplay Phase 6

Zonenzahl, `bars` je Zone, Schritte pro Takt, BPM, die Skalentabellen und ihre Modusnamen (F51 hat `shadowland` auf phrygisch gezogen, Kammer und Boss bleiben äolisch), Wechselwartezeit an der Taktgrenze, die sechs Methoden von `MUS` (F21 hat festgehalten, dass `duck(ms)` nie existierte und die Planzeile korrigiert wurde), Duck-Tiefen, die 70ms-Bremse.

### Z5: Grafik, G0 bis G5

Das zahlenreichste Paket. Framegrößen und Framezahlen im Manifest, Anker `ax`/`ay`, Rasterangaben, Kachelgröße 16, Boden-Canvas 2560x2560, Cull-Ränder (nach R8: `BIG_PAD = 190`), Minimap 128px und mobil 88px, Tönungswerte und Alphas (Schattenland 0.72), `_rigTable`-Länge und die Zahl der Manifest-Einträge mit Anim-Zuordnung (R8 nennt 52 von 886). **Vorgeschichte beachten:** F15 und F43 haben hier bereits Werte korrigiert, R8 hat `tools/sheet-audit.mjs` neu laufen lassen. Prüfe, ob Plan, Manifest und `sheet-audit.overrides.json` heute dasselbe sagen.

### Z6: Welt und Terminologie, Weltbibel plus W1, W2, Blätter

Rangsystem und seine Stufen, Ensemble-Umfang, die Namenstabelle aus `phase-w1-terminologie.md` (R4 hat dort den Startbildschirm-Eintrag korrigiert, siehe F25), Zahl und Verteilung der Aktenfunde aus W2, Serien A und B aus `blaetter-serie-a-b.md`. Dazu die Formregeln als Vollständigkeitszusage: keine Gedankenstriche in sichtbaren Zeichenketten, keine Emojis in Knöterich-Texten, kein Blut, keine Preisgabe der Kesselgrammatik, und seit T1 die Länge nach Sprachmarke. Den Kanal-Scan aus R5 kannst du wiederholen, er ist billig.

### Z7: Regressionsschutz als Zahlenwerk

Die 15 Punkte enthalten selbst Zusagen: Caps 900 Partikel und 70 Floater, 70ms Sound-Bremse, Minimap-Blit alle 4 Frames, Frame-Budget-Referenz 0,6 ms, Boden-Canvas einmal pro Level. Prüfe die Zahlen, nicht die Prinzipien. Die Prinzipien hat R6 zuletzt geprüft und repariert; Doppelarbeit ist hier unnötig.

### Z8: Eingaben

Alle Tastenbelegungen aus allen Plandateien gegen den `keydown`-Handler: WASD, Angriff über Klick und Leertaste, K Kessel, T Zauberbaum, I Inventar, E Zauber, Q Trank, F Kontextaktion, R Ultimate, Esc mit seiner Schließreihenfolge. Für jede: steht sie so im Plan, liegt sie so im Code, und hat sie die im Plan zugesagte Touch-Entsprechung.

Dieses Paket geht in **beide** Richtungen, und die Gegenrichtung ist die ergiebigere: der Handler kennt mindestens zwei Tasten, die in keiner Abnahmeliste auftauchen, nämlich `1` als Zweitbelegung für den Trank und `m` für `toggleMusic()`. Solche undokumentierten Belegungen sind Funde. Ebenso die Esc-Reihenfolge: sie ist im Code eine feste Kette (Inventar, Zauberbaum, Kessel, Schloss, Amtsfenster, Kammerabbruch), und Phase 5 verlässt sich ausdrücklich darauf, dass Esc außerhalb der Kammer nur Panels schließt.

Widersprüche zwischen zwei Plandateien sind ein eigener Fund, auch wenn der Code einer von beiden folgt.

## Form des Berichts

Schreib die Datei `ZUSAGEN-BILANZ-<JJJJ-MM-TT>.md` ins Repo-Root. Nur diese eine Datei entsteht, sonst nichts.

Aufbau:

1. **Ampel in drei Zeilen.** Wie viele Zusagen geprüft, wie viele weichen ab, ein Satz Gesamturteil. Kein Vorgeplänkel.
2. **Bilanztabelle je Paket.** Spalten: Zusage, Fundort im Plan, erwarteter Wert, gefundener Wert, `index.html:Zeile`, Urteil. **Auch die Treffer stehen drin**, sonst ist es keine Bilanz. Wenn ein Paket zu lang wird, fasse ununterbrochene Trefferstrecken zu einer Zeile zusammen („Prio-Werte aller 11 Katalogeinträge: stimmen"), aber nur echte Trefferstrecken.
3. **Funde**, sortiert nach Schwere, nicht nach Fundort. Je Fund: was, wo, warum es zählt, was eine Korrektur kosten würde, und ob Plan oder Code der Fehler ist. Das ist die wichtigste Unterscheidung des ganzen Auftrags: **eine Abweichung heißt nicht automatisch, dass der Code falsch liegt.** Oft ist der Plan veraltet und die Korrektur gehört in die Plandatei.
4. **Ungeprüft**, als eigener Abschnitt, mit Grund je Zeile. Lieber ehrlich lückenhaft als gefällig vollständig.
5. **Vorschlagsliste**, priorisiert, mit Aufwandsschätzung, getrennt nach „Code ändern" und „Plan ändern". Keine Umsetzung.

Ton wie im Projekt: trocken, deutsch, knapp. Keine Gedankenstriche in Texten, die im Spiel landen könnten. Im Bericht selbst darfst du normal schreiben.

## Was du nicht tust

* Kein Code ändern, auch nicht „schnell nebenbei".
* Keine Plandatei anfassen, auch keine Statusmarker, auch keine offensichtlich falsche Zahl.
* Keinen Commit, keinen Push.
* Nichts als geprüft melden, was du aus `ABGLEICH-2026-07-27.md` oder aus den Umsetzungsnotizen abgeschrieben hast. Beide sind Behauptung, Code ist Beleg.
* Keine Zusage stillschweigend überspringen, weil sie langweilig aussieht. Genau dort sitzt der Rest.
* Keine Entscheidungen treffen, die eine durchgespielte Schicht brauchen (siehe F20). Zahl ausrechnen, Entscheidung vorlegen.
