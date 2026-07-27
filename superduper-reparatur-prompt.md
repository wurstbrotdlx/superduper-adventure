# SuperDuper Adventure, Reparatur der Restfunde R1 bis R9

Umbauauftrag, kein Prüfauftrag. Grundlage ist `ABGLEICH-2026-07-27.md`, Abschnitt "Funde". Die neun Brecher F1 bis F9 sind erledigt. Offen sind **F10 bis F83**, aufgeteilt in neun Bauabschnitte.

**Ein Bauabschnitt pro Session.** Nicht zwei, nicht alle. Wer mehr als einen Abschnitt in eine Session packt, verliert den Überblick über die Regressionsregeln und committet Vermischtes.

## Auftakt für eine frische Session

> Lies superduper-reparatur-prompt.md in `~/vibecodingprojekt/adventure/`. Führe Bauabschnitt **R<N>** aus, sonst nichts.

## Modellstrategie

| Abschnitt | Modell | Warum |
|---|---|---|
| R1 Entscheidungen | `opus` | Ökonomie und Namensfragen, keine mechanische Arbeit |
| R2 Querstand G5 | `opus` | echte Zustandsfehler in fremdem Code, Seiteneffekte |
| R3 Knöterich | `opus` | sieben verzahnte Fundstellen in einem Zustandsautomaten |
| R4 Doku | `sonnet` | Textnachzug an benannten Zeilen, kein Codeeingriff |
| R5 Amtsdeutsch | `opus` | Registerarbeit, Zeichendeckel, Tonfall |
| R6 Renderpfad | `opus` | Regressionsschutz, Frame-Budget, leicht zu brechen |
| R7 Audio | `opus` | Bus-Graph und Taktlogik, schlecht testbar |
| R8 Grafik | `opus` | Anker, Cull-Ränder, Bake-Pfade |
| R9 Aufräumen | `sonnet` | toter Code, jede Stelle einzeln belegt |

Ausdrücklich **nicht** `opusplan`. Bei `opusplan` denkt Opus nur im Plan-Modus, die Ausführung fällt auf Sonnet zurück. Bei einer Reparatur ist aber die Ausführung die eigentliche Denkarbeit: die richtige Zeile in 6300 Zeilen finden, den Seiteneffekt sehen, die Regressionsregel nicht brechen. Genau der Teil darf nicht auf dem schwächeren Modell landen.

Bei `sonnet`-Abschnitten gilt: wenn beim Arbeiten auffällt, dass ein Fund doch tiefer sitzt als im Bericht beschrieben, **abbrechen und melden** statt raten.

## Kontext

Repo: `~/vibecodingprojekt/adventure/`, `wurstbrotdlx/superduper-adventure`, Branch `main`. Ein Spielfile: `index.html`. GitHub Pages läuft seit F9 über `.github/workflows/pages.yml`, die Grafik kommt aus dem privaten Repo `wurstbrotdlx/superduper-adventure-assets`. `docs/` und `dist/` sind ignoriert, ein Build-Commit ist nicht mehr nötig.

Verbindlich mitzulesen, je nach Abschnitt:

* `ABGLEICH-2026-07-27.md` immer, mindestens die Funde des eigenen Abschnitts
* `superduper-gameplay-prompt.md`, Regressionsschutz Z.29 bis 44
* `superduper-grafik-prompt.md`, Regressionsschutz Z.57 bis 80
* `superduper-weltbibel.md`, Abschnitt 13 (Humor-Grundgesetz) und 19 (Prüfliste für Texte), zwingend bei R5

Achtung Namenskollision: **Phase 5** ist Knöterich (Gameplay), **Phase G5** ist Dorf und UI (Grafik). Im Bericht sauber getrennt, beim Lesen ebenso halten.

Zwei Zeilennummern-Warnungen: die Zeilenangaben im Bericht stammen vom Stand `d7a7c9f` und haben sich durch die F1-bis-F8-Reparatur um wenige Zeilen verschoben. **Immer über den Bezeichner suchen, nie über die Zeilennummer.** Die im Bericht genannten Commit-Hashes beziehen sich auf den Stand vor dem History-Rewrite und existieren nicht mehr.

---

## Die Bauabschnitte

### R1: Entscheidungen. Zuerst, blockiert anderes.

Drei Punkte, die niemand nebenbei entscheiden kann. **Hier wird nichts umgesetzt, sondern vorgelegt.** Ergebnis ist eine Antwort im Chat, keine Codeänderung.

* **F19 Gold-Doppelbuchung.** `carryGold` wird zweimal verbucht, als Startguthaben der Folgeschicht und als Bankguthaben. In Summe überleben 100 Prozent statt der geplanten 50. Rechne die Ökonomie beider Varianten durch und lege sie vor: Bank bekommt den einbehaltenen Rest, oder Doppelbuchung bleibt und der Bericht wird ehrlich beschriftet.
* **F20 Ausbau-Kosten.** Vollausbau 3850 Gold gegen etwa 1000 bis 1500 Bankzugang pro Schicht. Der Baum ist ab Schicht 3 bis 4 leer, das erste Jahresgespräch kommt bei Schicht 10. Braucht eine durchgespielte Schicht, nicht Kopfrechnen. Hängt an F19.
* **F25 Titel-Schreibweise.** `Das Monstralministerium` im Ladebildschirm gegen `DAS MONSTRAL MINISTERIUM` im Startbildschirm, zwei Bildschirme direkt nacheinander. Der Widerspruch steckt schon in den Quellen: `phase-w1-terminologie.md:17` gegen `:36`, `weltbibel:831` gegen `:863`. **Erst diesen Widerspruch auflösen, dann den Code.** Blockiert R5.

### R2: Querstand aus G5. Höchster Wert, echte Zustandsfehler.

* **F10** `amtFensterOpen` fehlt in drei Guard-Listen: `knSperrzone()`, `knNachfragen()`, Schichtuhr. Dazu `knIdleT = 0` beim Öffnen, wie es Inventar, Zauberbaum und Kessel schon tun.
* **F33** Amtsfenster zeigt `amt.schichten` roh, also während der laufenden Schicht die Nummer der vorigen. In der ersten Schicht steht dort "Schicht 0". Die richtige Umrechnung steht bereits zweimal im Code.
* **F36** Nur die `#ovPanel`-Screens dämpfen die Musik. Inventar, Zauberbaum, Kessel, Schloss und Amtsfenster nicht, obwohl `knSperrzone()` genau sie als Panel führt und `MUS.sting` seinen Guard damit begründet. **Vorsicht:** braucht einen gemeinsamen Zähler, sonst hebt das Schließen eines Panels den Muffle auf, während ein zweites noch offen ist.
* **F40** Zwei Wege ins Amt mit unterschiedlichem Funktionsumfang. Bewusste Entscheidung und technisch begründet, **kein Codeeingriff**. Nur die Abnahmezeile `grafik:166` so umformulieren, dass sie den gebauten Zustand beschreibt.

### R3: Knöterich-Nachzüge.

* **F11** Randnotiz-Anlass `untaetigkeit` wird nie ausgelöst, der Pool ist tot. Die 25-Sekunden-Regel aus `gameplay:374` fehlt komplett, ebenso ihr Verhältnis zum Steckenbleib-Schubs aus `:380`.
* **F12** Zweiter Steckenbleib-Schubs kommt nach 25 Sekunden ohne Spieleraktion, weil `knIdleT` nicht zurückgesetzt wird. Wer 100 Sekunden stillsteht, bekommt drei Schubse.
* **F13** `unequipItem()` ruft `knCheckFluchEquipped()` nicht, der Flankendetektor bleibt blind und verschluckt spätere Fluch-Anlagen.
* **F14** Knöterichs Kopf steht im Jahresgespräch, obwohl die Abnahme das ausschließt. Ein Zeichen.
* **F53** Kammer-Abbruch über die Kontextaktion "Verlassen" zählt nicht als Abbruch. Buchstabengetreu zum Plan, aber gegen dessen Absicht. **Vor der Umsetzung mit Matthias klären.**
* **F54** `knRandnotiz()` zieht den Textpool vor dem Zeitvergleich, obwohl `gameplay:376` die Reihenfolge als Pflicht formuliert. Hot Path ist `hurtMon`.
* **F55** `knAssertCaps()` dupliziert Beat- und Steckenbleib-Literale statt sie aus einer Tabelle zu lesen. Zwei Texte sind gar nicht erfasst.
* **F56** Der Regler stummt zusätzlich den Dienstzettel-Sting. Sinnvoll, aber nirgends dokumentiert. **Nur eine Zeile Notiz**, kein Codeeingriff.
* **F57** Kopf ist ein Emoji statt der geplanten Sprite-Briefmarke, der Stempel fehlt in beiden Kanälen. Umfang je nach Anspruch, im Zweifel Textstempel.

Nach diesem Abschnitt `knAssertCaps()` im Browser laufen lassen. Muss `true` liefern und darf nichts in die Konsole schreiben.

### R4: Doku. Bestes Verhältnis von Aufwand zu vermiedener Fehlarbeit.

Kein Codeeingriff außer Kommentaren.

* **F22** W1 und W2 sind fertig, tragen aber nirgends einen Statusmarker. Kopfzeilen in `phase-w1-terminologie.md`, `phase-w2-aktenfunde.md` und `weltbibel:508/522`.
* **F23** Drei Planabschnitte beschreiben einen Zustand, den G5 überholt hat: `gameplay:244` (kein Dorf), `:540` (village unerreichbar), `:229` (endShift kennt zwei Anlässe). **Wichtigster Punkt des Abschnitts**, weil W3 direkt darauf aufsetzen würde.
* **F78** Drei unvereinbare Statusmarker-Konventionen. Eine wählen und 13 Kopfzeilen angleichen, oder eine Statustabelle anlegen, auf die alle Dokumente zeigen.
* **F42** G1-Abnahme verweist auf eine Zusicherungs-Suite, die es nicht gibt. Streichen oder auf "Handdurchlauf aller 8 Module" umformulieren.
* **F69, F70** G1-Abweichungen (Druckplatten-Datei, Set-Mapping wegen leerem `Dungeon_3`) gehören an die Planzeile selbst, nicht nur in die Notizen weit unten.
* **F44 Rest** `.gitignore`-Kommentar und `grafik:874-877` gegen `:899` geraderücken. Der Build-Schritt läuft seit F9 automatisch, das gehört in den Regressionsschutz.
* **F76** Weltbibel verbietet Minimap-Marker, die seit Phase 3 als gekaufter Effekt im Code stehen. Eine Klammer in `weltbibel:562`.
* **F79** Regel "ein Commit pro Phase" um einen Halbsatz für Nachtragscommits ergänzen.
* **F81** `serve.py` ist ignoriert, obwohl die ganze Verifikations-Doku gegen seinen Port arbeitet. Committen oder begründen. Kein `README.md` im Root.
* **F83** W1-Abnahmeliste war orts- statt sichtbarkeitsbasiert und hat den Ladebildschirm übersehen. Künftige Abnahmen über sichtbare Bildschirme führen: Ladebildschirm, Startbildschirm, Todesbildschirm, Dienstbericht, Jahresgespräch, Dorf, Amtsstube.
* **F63, F65, F77** Drei irreführende Codekommentare (Level-1-Zeichenblock nennt Wald statt Dorf, `KAM_WAECHTER` nennt sieben statt sechs, `zutatenMitnahmeBasis` nennt Stapel statt Stücke).

### R5: Amtsdeutsch. Erst nach R1/F25.

Registerarbeit. `weltbibel` Abschnitt 13 und 19 sind hier verbindlich, nicht optional.

* **F28** Vier Gedankenstriche in dauerhaft sichtbaren HUD-Zeichenketten. Der Platzhalter im Gürtel steht bei jedem neuen Spieler von der ersten Sekunde an. **Vorsicht:** die beiden Platzhalter-Stellen müssen dieselbe Ersatzform bekommen, sonst springt der Text beim ersten `updateHUD()`.
* **F26** `ABADDON ERWACHT!` als roter Einblender, fünf Sekunden, während die Bossleiste daneben den neuen Namen zeigt. Dazu der Platzhalter im Markup.
* **F24** Kammerschild sagt `KAMMER`, während Knöterich auf einen Gebührenbescheid zeigt. **Erst die falsche Prämisse in `phase-w1-terminologie.md:135` korrigieren**, dann die Zeichenkette. Schildbreite 68px, längeres Wort braucht zwei Zeilen oder eine Abkürzung.
* **F27** Der Siegesbildschirm ist komplett im vor-W1-Register geblieben, samt drei weiterer Einblender im selben Ton.
* **F59** Zwei sichtbare Zeichenketten mit Blut- und Sterbe-Vokabular. **Nur die Anzeigefelder `kurz` und `satz` ändern**, der interne Schlüssel `blutmagie` und `cfx:'blut'` hängen an `CFX.blut` und dürfen nicht mitwandern.
* **F60** Totenkopf-Emoji und senkrechter Strich im Schattenland-HUD, während alle anderen Zeilen den Interpunkt nutzen.
* **F61** Der Dorf-Zweig im Zonen-HUD folgt der W1-Konvention nicht. Die Weltbibel hält "Vordermühl an der Ablage" bereit.
* **F62** "Level" und "Stufe" nebeneinander, an einer Stelle im selben Satz. **Der Schlüssel `startLevel` ist Persistenz und bleibt.**
* **F58** Knöterich nennt das Haus mit einer vierten Namensform, die die Weltbibel nicht kennt. **Zeichendeckel beachten:** die Vollbezeichnung reißt `z1` um genau ein Zeichen. Gehört eigentlich zu W3, hier nur entscheiden ob mitnehmen.

Nach jeder Textänderung `knAssertCaps()` prüfen und den Gedankenstrich-Scan wiederholen.

### R6: Renderpfad und Regressionsschutz.

Der Regressionsblock ist hier Prüfmaßstab, nicht Hintergrundlektüre.

* **F30** `tintedSheet()` baut pro getöntem Sprite pro Frame einen Cache-Key-String. **Einzige Allokation, die mit der Hordengröße skaliert**, also der Punkt mit messbarem Effekt.
* **F31** Dungeon-Sheet-Keys werden pro Frame per Template-Literal zusammengebaut. Nachweislich in G1 entstanden, der Regressionsschutz hat nicht gegriffen.
* **F32** Zwei Closures pro Frame, eine davon plus linearem Array-Scan für einen Wert, der sich nur bei Nutzeraktion ändert.
* **F29** Zwei `title`-Attribute pro Frame ohne Dirty-Check, direkt neben der korrekten Lösung. Einziger ungeschützter HUD-Schreibpfad.
* **F41** `Math.hypot` an sechs Stellen im Frame-Pfad, drei davon neu aus G5. Zwei brauchen die Wurzel gar nicht.
* **F34** UI-Skin skaliert 16-px-Kunst ohne `image-rendering:pixelated`. Verstoß gegen Regressionsregel 14.
* **F73** Weitere Allokationen im Renderpfad, konstant wenige pro Frame. Viele kleine Stellen, geringster Nutzen des Abschnitts.

Abnahme: nach dem Umbau 300 Frames mit Zaubern ohne Exception, und das Frame-Budget in der Horde nicht schlechter als vorher (Referenz etwa 0,6 ms).

### R7: Audio-Feinschliff.

* **F21** `MUS.duck(ms)` steht in der Schnittstellenliste, existiert aber nicht. Der erste Aufrufer bekommt einen TypeError, und zwar spät.
* **F35** Zonenwechsel wartet bis zu vier Takte statt bis zur nächsten Taktgrenze, im Extremfall 12,6 Sekunden. Entweder Mechanik angleichen oder Planzeile `gameplay:508` ehrlich machen. **Achtung**, keine reine Kosmetik: `stepIdx` wird beim Wechsel auf 0 gesetzt.
* **F49** Der Wechsel duckt und startet die Phrase neu, auch wenn sich die Zone gar nicht ändert. Wird durch normales Gehen über die Dorfgrenze ausgelöst.
* **F50** `initAudio()` überträgt einen bereits gesetzten Muffle-Zustand nicht in den Lowpass. Betrifft genau das Fenster, in dem der Spieler die Musik zum ersten Mal hört.
* **F51** `shadowland.scale` ist äolisch, obwohl die Zone als phrygisch geführt wird. Derzeit stumm, weil keine Stinger-Variante die Stufe 1 anfasst, aber scharf. Ein Zeichen, danach gegenhören.
* **F48** `MUS.swell()` hat keinen Aufrufer. Anschließen (Stufenaufstieg, Truhe, Bosssieg) oder streichen.

Das meiste hier ist nur im Hören zu beurteilen. Was nicht am Code entschieden werden kann, **als laufzeitgebunden melden statt als erledigt zählen**.

### R8: Grafik-Restposten.

* **F18** UI-Skin macht die runden Touch-Menüknöpfe wieder eckig, weil `border-image` den `border-radius` ignoriert. **Echte Regression** gegen eigene Vorarbeit, das Vorbild für die Lösung steht drei Zeilen weiter.
* **F37** Dorf-Gebäude überragen die Cull-Ränder, die für kleine Props kalibriert wurden. Beim Amt verschwinden bis zu 110px Dach in einem Frame.
* **F38** Gebäude-Fußabdrücke ragen als andersfarbige Rechtecke hervor, bei fünf von sechs Gebäuden. Der Codekommentar behauptet das Gegenteil.
* **F39** Der gebackene Boden ist ein regelmäßiges Schachbrett. Die Umsetzungsnotiz behandelt das Problem, benennt aber die falsche Ursache. Braucht Gegensehen am laufenden Spiel.
* **F64** Das Dorf steht im Schattenland in Tagfarben, samt wandernder NPCs. Knöterich wird korrekt ausgeblendet, die Gebäude nicht.
* **F15** G0-Manifest hat bei drei Animations-Sheets falsche Raster. Overrides eintragen und `node tools/sheet-audit.mjs` einmal laufen lassen.
* **F43** 885 von 886 Manifest-Einträgen haben keine Anim-Zuordnung. Auf die verbauten Rigs beschränken, die stehen als `_rigTable` bereits in den Overrides.
* **F17** Fledermaus läuft auf einem Ein-Zeilen-Sheet, kein Angriff, kein Treffer, kein Sterben. Auf `flying_skull` umhängen oder den Kompromiss nachtragen.
* **F16** Waffe und Schild erreichen den Helden gar nicht. Für den Schild gibt das Pack nichts her, hier ist nur eine ehrliche Umformulierung der Abnahme möglich.
* **F71** `CREDITS.md` nennt zwei Packs, aus denen nichts verwendet wird, und einen dritten Projektnamen, den es nicht gibt.

### R9: Aufräumen.

Toter und irreführender Code. Jede Stelle ist im Bericht einzeln belegt.

* **F45** `stats.goldTotal` deklariert, nirgends erhöht.
* **F46** `shiftElapsedT` jeden Frame hochgezählt, nie gelesen.
* **F47** `stats.kills` nie zurückgesetzt, nie gespeichert.
* **F52** `item.fluchRuht` bleibt an abgelegten Stücken stehen, der Tooltip behauptet dann einen ruhenden Fluch.
* **F66** `AFFIXES.fmt` ist seit der Tooltip-Umstellung toter Zahlformatierer, also genau das, was Phase 3 aus dem UI entfernen sollte.
* **F67** Lokale Konstante `kn` in `hurtMon` beschattet das globale Knöterich-Objekt. Heute harmlos, aber `hurtMon` wird als nächstes wieder angefasst.
* **F68** Die `walk`-Animation des Helden wird gebacken, aber nie gezeigt. `death` ist korrekt aufgelöst, nicht verwechseln.

## Ausdrücklich nicht anfassen

Diese Funde stehen im Bericht, sind aber geprüft und richtig so. Wer sie "repariert", macht das Spiel schlechter:

* **F72** Minimap-Glättung beim Backen. Ein 20:1-Downscale mit Nearest-Neighbour wäre Rauschen. Höchstens ein Halbsatz Kommentar.
* **F74** Zahl im Zutaten-Tooltip. Die Abnahme spricht vom Item-Tooltip. Bestandsmengen bleiben Zahlen.
* **F75** Der Ausbau "Vermutungen" gibt die Kesselgrammatik preis. Das ist eine bezahlte Kaufentscheidung, kein Textleck.
* **F82** Fehlender `Co-Authored-By`-Trailer in vier alten Commits. Kein History-Rewrite dafür.

## Arbeitsweise je Abschnitt

1. Bericht lesen, die Funde des Abschnitts und den passenden Regressionsblock.
2. Jede Fundstelle **über den Bezeichner** aufsuchen und selbst nachprüfen, ob der Befund noch stimmt. Der Bericht ist eine Meldung, kein Beweis, und seine Gegenprobe ist ausgefallen (siehe unten). Stimmt ein Fund nicht, **nicht reparieren**, sondern im Abschlussbericht widerlegen.
3. Reparieren. Kleinstmöglicher Eingriff, Stil der Umgebung, Kommentardichte der Umgebung.
4. Syntaxcheck über den Skriptinhalt (`new Function(...)`).
5. Spiel starten, 300 Frames mit Zaubern, Konsole muss leer bleiben.
6. Was nur im Spielen prüfbar ist, ausdrücklich als **ungeprüft, laufzeitgebunden** melden statt als erledigt zählen.
7. Ein Commit pro Abschnitt, Betreff `fix(r<N>): …` oder `docs(r<N>): …`, Body nennt die behandelten Fundnummern. Nachtragscommits sind erlaubt, wenn Information erst später eintrifft.
8. Kurzer Abschlussbericht im Chat: was repariert, was widerlegt, was laufzeitgebunden offen.

## Zwei offene Lücken aus dem Abgleich

Beide sind nicht Teil dieser Abschnitte, sollten aber nicht vergessen werden:

* **Die adversariale Gegenprobe ist ausgefallen.** Die Funde F10 bis F83 sind Einzelmeldung ohne zweite Meinung. Nur die neun Brecher und ein Teil der übrigen wurden am Code gegengeprüft. Deshalb Schritt 2 oben.
* **Die systematische Zusagen-Bilanz fehlt.** Abschnitt 5 des Abgleichauftrags verlangte, alle konkreten Zusagen der Plandokumente einzeln nachzurechnen: Zahlen, Bezeichner, Tastenbelegungen, Schwellenwerte, Wahrscheinlichkeiten, Cooldowns. Was an stillschweigenden Abweichungen im Bericht steht, ist Beifang der Phasenprüfung. **Das ist der lohnendste eigene Prüfauftrag nach dieser Reparatur**, und er gehört auf `opus` mit ausreichend Zeit.

## Was du nicht tust

* Keine zwei Bauabschnitte in einer Session.
* Keine Gelegenheitsreparatur außerhalb des Abschnitts, auch nicht "schnell nebenbei". Auffälligkeiten kommen in den Abschlussbericht.
* Keine neue Funktion, kein Refactoring über den Fund hinaus.
* Nichts aus der Liste "Ausdrücklich nicht anfassen".
* Keine Gedankenstriche in Texten, die im Spiel landen können.
* Nichts als erledigt melden, was nur im Bericht steht und nicht am Code nachgeprüft wurde.
