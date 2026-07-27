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
* `superduper-gameplay-prompt.md`, Abschnitt „Regressionsschutz: das hier NICHT kaputtmachen"
* `superduper-grafik-prompt.md`, Abschnitt „Regressionsschutz: das hier NICHT kaputtmachen" (14 geerbte Punkte plus Punkt 15 zum Auslieferungsweg, in R4 ergänzt)
* `superduper-weltbibel.md`, Abschnitt 13 (Humor-Grundgesetz) und 19 (Prüfliste für Texte), zwingend bei R5

Achtung Namenskollision: **Phase 5** ist Knöterich (Gameplay), **Phase G5** ist Dorf und UI (Grafik). Im Bericht sauber getrennt, beim Lesen ebenso halten.

Zwei Zeilennummern-Warnungen: die Zeilenangaben im Bericht stammen vom Stand `d7a7c9f` und haben sich durch die F1-bis-F8-Reparatur um wenige Zeilen verschoben. **Immer über den Bezeichner suchen, nie über die Zeilennummer.** Die im Bericht genannten Commit-Hashes beziehen sich auf den Stand vor dem History-Rewrite und existieren nicht mehr.

---

## Die Bauabschnitte

### R1: Entscheidungen. Zuerst, blockiert anderes. — ERLEDIGT

Drei Punkte, die niemand nebenbei entscheiden kann. **Hier wird nichts umgesetzt, sondern vorgelegt.** Ergebnis ist eine Antwort im Chat, keine Codeänderung.

* **F19 Gold-Doppelbuchung. ENTSCHIEDEN, kein eigener Fund mehr, geht in F20 auf.** Der Befund ist widerlegt: `player.gold` hat im ganzen Spiel keine Ausgabestelle. Einnahmen kommen aus Loot und Drops (`index.html:3645`, `:4845`), abgezogen wird nur von den zwei Flüchen `Verwaltungsgebühr` (`:2898`) und `goldweg` (`:4778`). Kein Händler, kein Kauf. Kaufkraft ist allein `amt.bankGold` (`buyAusbau`, `buyVermutungen`, `unlockStartFluch`), und die bekommt plankonform 50 Prozent. Der Gürtelübertrag ist keine zweite Buchung von Vermögen, sondern Angriffsfläche für die zwei Flüche. Doppelt ist nur die Buchhaltung, nicht die Wirtschaft. Die vorgeschlagene Gegenvariante `amt.bankGold += player.gold - carryGold` wäre bei geradem Gold ein reiner No-Op und bei ungeradem 1 Gold Unterschied gewesen. Offen bleibt allein die Beschriftung: die Zeile "Beuteanteil nach Abzug" (`:5890`) liest sich als Verlust, und der Spieler erfährt nirgends, dass die Bank etwas bekommen hat. Diese eine Zeile wird zusammen mit F20 erledigt, nicht davor.
* **F20 Ausbau-Kosten.** Vollausbau 3850 Gold gegen etwa 1000 bis 1500 Bankzugang pro Schicht. Der Baum ist ab Schicht 3 bis 4 leer, das erste Jahresgespräch kommt bei Schicht 10. Braucht eine durchgespielte Schicht, nicht Kopfrechnen. **Hängt nicht mehr an F19, sondern umgekehrt: F19 ist hierher gewandert** und liefert die Berichtszeile nach, sobald die Zahl steht. **Altlast vorher lesen:** `CONFIG.goldUebertragAnteil` (`index.html:2967`) steuert mit einem einzigen Regler zwei unabhängige Dinge, den Gürtelübertrag und den Bankzufluss. Getunt werden muss aber nur der Bankzufluss, denn er allein bestimmt, wann der Baum leer ist. Wer den Regler anfasst, ohne ihn vorher zu entkoppeln, verschiebt ungewollt auch die Fluch-Angriffsfläche. Der Kommentar an der Konstante beschreibt bislang nur den Gürtelübertrag und verschweigt die Bank.
* **F25 Titel-Schreibweise. ENTSCHIEDEN, kein Codeeingriff.** Maßgeblich ist die Weltbibel, Kapitel 18, Abschnitt „Was mitwandert", weil sie den Startbildschirm namentlich nennt, während der Absatz „Schreibweise" desselben Kapitels allgemein von Fließtext und Spielstrings spricht. Der Startbildschirm behält also die getrennte Fassung `DAS MONSTRAL MINISTERIUM`, Ladebildschirm und Tab-Titel behalten `Das Monstralministerium`. Der Ist-Zustand im Code ist damit bereits richtig. Nachzuziehen ist nur die Doku, und zwar in R4: die Namenstabelle in `phase-w1-terminologie.md` zählt den Startbildschirm fälschlich zur zusammengeschriebenen Form, und der Absatz „Schreibweise" in Kapitel 18 der Weltbibel braucht den Hinweis, dass der Startbildschirm als gesetztes Logo zählt, obwohl er als Text gerendert wird. **Blockiert R5 nicht mehr.** Beides in R4 erledigt.

### R2: Querstand aus G5. Höchster Wert, echte Zustandsfehler. — ERLEDIGT (Commit `9c96df2`)

* **F10** `amtFensterOpen` fehlt in drei Guard-Listen: `knSperrzone()`, `knNachfragen()`, Schichtuhr. Dazu `knIdleT = 0` beim Öffnen, wie es Inventar, Zauberbaum und Kessel schon tun. **Nur zwei der vier Punkte umgesetzt.** `knSperrzone()` und `knNachfragen()` haben den Term bekommen. Die Schichtuhr nicht: sie prüft `!kampfNah && !kammer && !schlossOpen`, nicht das Flag-Quartett, und Inventar, Zauberbaum und Kessel blocken das Schichtende bewusst nicht. `knIdleT = 0` ebenfalls nicht: die drei Vorbild-Panels lösen je eine Wissenslücke auf (zaubern, kochen, Gürtel), die Amtsstube keine, und mit dem neuen Guard kann während des Lesens ohnehin kein Zettel feuern. Ein Reset würde nur die 50-Sekunden-Uhr aus `knStuckCandidate()` neu starten und dem verlorenen Spieler ausgerechnet `stuck_kammer` vorenthalten, dessen z2 `Gebührenbescheid. F.` genau seinen Fastreffer beschreibt. Nebenbefund: die Schadensbehauptung "Dienstzettel knallt über das Panel" stimmt nicht, `#knZettel` liegt auf z-index 12 bei `top:46px`, `#amtFenster` auf 22 und zentriert, es gibt keine Überlappung. Der Fund trägt über den Verbrauch von `kn.seen`.
* **F33** Amtsfenster zeigt `amt.schichten` roh, also während der laufenden Schicht die Nummer der vorigen. In der ersten Schicht steht dort "Schicht 0". Die richtige Umrechnung steht bereits zweimal im Code.
* **F36** Nur die `#ovPanel`-Screens dämpfen die Musik. Inventar, Zauberbaum, Kessel, Schloss und Amtsfenster nicht, obwohl `knSperrzone()` genau sie als Panel führt und `MUS.sting` seinen Guard damit begründet. **Vorsicht:** braucht einen gemeinsamen Zähler, sonst hebt das Schließen eines Panels den Muffle auf, während ein zweites noch offen ist. **Umgesetzt ohne Zähler:** `MUS.muffle()` leitet den Sollzustand aus den vorhandenen Flags ab, statt ihn zu setzen. Mit Argument setzt ein Overlay-Screen seinen Wunsch in `ovMuffle`, ohne Argument wird nur neu abgeleitet. Doppeltes Öffnen und ein Schließweg auf ein längst geschlossenes Panel sind damit strukturell harmlos, ein Zähler könnte beides nicht. Bewusste Reichweite über den Fund hinaus: ab jetzt dämpft auch das Inventar mitten im Kampf. Kampf-SFX bleiben unberührt, `sfxBus` hängt direkt am Master und umgeht den Lowpass.
* **F40** Zwei Wege ins Amt mit unterschiedlichem Funktionsumfang. Bewusste Entscheidung und technisch begründet, **kein Codeeingriff**. Nur die Abnahmezeile in G5 so umformulieren, dass sie den gebauten Zustand beschreibt. Der erste Aufzählungspunkt von Phase G5 („Begehbares Dorf") ist umformuliert. Zur Genauigkeit: das ist nicht die Abnahmezeile, sondern der Plan-Fließtext von G5, und dort stand auch die falsche Zusicherung. Die echte Abnahme G5 („Amt über Gebäude erreichbar") ist am Code nicht falsch, nur unspezifisch, und blieb deshalb unberührt.

### R3: Knöterich-Nachzüge. — ERLEDIGT (Commit `ef89376`)

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

### R4: Doku. Bestes Verhältnis von Aufwand zu vermiedener Fehlarbeit. — ERLEDIGT

Kein Codeeingriff außer Kommentaren.

* **F22** W1 und W2 sind fertig, tragen aber nirgends einen Statusmarker. Kopfzeilen in `phase-w1-terminologie.md`, `phase-w2-aktenfunde.md` und an den Abschnitten W1 und W2 in Kapitel 14 der Weltbibel. **Geht in F78 auf, dort im selben Durchgang miterledigt.**
* **F23** Drei Planabschnitte beschreiben einen Zustand, den G5 überholt hat: `gameplay:244` (kein Dorf), `:540` (village unerreichbar), `:229` (endShift kennt zwei Anlässe). **Wichtigster Punkt des Abschnitts**, weil W3 direkt darauf aufsetzen würde. **Umgesetzt, aber an sechs statt drei Stellen:** dieselbe überholte Aussage stand außerdem in `gameplay:97`, `:258` und in der Zonentabelle `:518`, die `village` weiter als aufruferlos führte. Wer nur die drei benannten Absätze repariert hätte, hätte W3 über die anderen drei genauso in die Irre laufen lassen. Alle sechs Stellen sind jetzt als historisch markiert statt umgeschrieben, die Phasennotizen bleiben damit ein lesbares Protokoll.
* **F78** Drei unvereinbare Statusmarker-Konventionen. Eine wählen und 13 Kopfzeilen angleichen, oder eine Statustabelle anlegen, auf die alle Dokumente zeigen. **Gewählt: der Suffix `— ERLEDIGT` / `— OFFEN` an der Überschrift**, weil er im Repo schon achtmal steht (sechs Gameplay-Phasen, zwei Reparatur-Abschnitte) und keine neue Datei braucht. Festgehalten in `weltbibel`, Kapitel 14, direkt unter der Überschrift. Es waren nicht 13 Kopfzeilen, sondern 21: der Bericht kannte `superduper-reparatur-prompt.md` und `blaetter-serie-a-b.md` noch nicht. Die Konvention `(erledigt)` an den Grafik-Umsetzungsnotizen und die Statuszelle in der Bestandstabelle sind ersatzlos entfallen, den Stand trägt jetzt allein der Phasenkopf.
* **F42** G1-Abnahme verweist auf eine Zusicherungs-Suite, die es nicht gibt. Streichen oder auf "Handdurchlauf aller 8 Module" umformulieren.
* **F69, F70** G1-Abweichungen (Druckplatten-Datei, Set-Mapping wegen leerem `Dungeon_3`) gehören an die Planzeile selbst, nicht nur in die Notizen weit unten.
* **F44 Rest** `.gitignore`-Kommentar und den Punkt „GitHub-Pages-Umstellung" unter „Bewusst nicht gemacht" in den G5-Notizen gegen die Zeile „GitHub-Pages-Live-Check" der Verifikationstabelle darunter geraderücken. Der Build-Schritt läuft seit F9 automatisch, das gehört in den Regressionsschutz. **Der `.gitignore`-Teil ist widerlegt:** `efe5437` (F9) hat den Kommentar bereits ersetzt, er beschreibt den Actions-Weg korrekt, `docs/` ist weder vorhanden noch getrackt. Offen waren nur die beiden anderen Teile, beide erledigt: der Widerspruch in den G5-Notizen ist als Nachtrag aufgelöst statt gelöscht, und der Auslieferungsweg steht als Regressionsschutz-Punkt 15 im Grafik-Prompt, samt der eigentlichen Falle (ein Sheet, das lokal liegt, aber nicht im Assets-Repo, fehlt live).
* **F76** Weltbibel verbietet Minimap-Marker, die seit Phase 3 als gekaufter Effekt im Code stehen. Eine Klammer an der Zeile „Keine Questmarker auf der Minimap" in Kapitel 14, „Was wir ausdrücklich nicht bauen". **Der Fund trägt, seine Begründung nicht:** „Aktenlage" wird nicht gekauft, sondern gebraut (`gut_unterrichtet`, `fx:'karte'`), und sie ist über das Adjektiv „gut unterrichtet" mit dem Fluch „Aktenblindheit" bezahlt. Bezahlt also, nur nicht mit Gold. Die Klammer nennt das so.
* **F79** Regel "ein Commit pro Phase" um einen Halbsatz für Nachtragscommits ergänzen.
* **F81** `serve.py` ist ignoriert, obwohl die ganze Verifikations-Doku gegen seinen Port arbeitet. Committen oder begründen. Kein `README.md` im Root. **Entschieden: committen.** Der Ausschluss war der einzige in `.gitignore` ohne Begründung, und es gibt auch keine: 542 Byte eigener Code, keine Fremdlizenz wie bei `Graphics/` und `assets/cf/`, kein Build-Artefakt wie `dist/`. Gleichzeitig ist es das Werkzeug, das die gesamte dokumentierte Verifikation stillschweigend voraussetzt, weil ein cachender Server sie falsch positiv beantwortet. Der Hinweis steht jetzt in beiden Kontextblöcken (`gameplay`, `grafik`). Kein `README.md` angelegt, das wäre eine neue Datei über den Fund hinaus.
* **F83** W1-Abnahmeliste war orts- statt sichtbarkeitsbasiert und hat den Ladebildschirm übersehen. Künftige Abnahmen über sichtbare Bildschirme führen: Ladebildschirm, Startbildschirm, Todesbildschirm, Dienstbericht, Jahresgespräch, Dorf, Amtsstube. **Die Liste im Fund ist selbst unvollständig, es sind acht:** der Siegesbildschirm (`winGame()`) fehlte. Die vollständige Fassung mit Funktionsnamen steht jetzt in den W1-Umsetzungsnotizen, weil dort die falsche Abnahmeliste steht.
* **F63, F65, F77** Drei irreführende Codekommentare (Level-1-Zeichenblock nennt Wald statt Dorf, `KAM_WAECHTER` nennt sieben statt sechs, `zutatenMitnahmeBasis` nennt Stapel statt Stücke).

### R5: Amtsdeutsch. Nicht mehr blockiert, F25 ist entschieden. — ERLEDIGT

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

**Umsetzungsnotizen R5.** Alle neun Funde am Code nachgeprüft, keiner widerlegt, sieben tragen unverändert, zwei mit Korrektur:

* **F58, Zeichenzahl im Bericht falsch.** `ABGLEICH-2026-07-27.md:351` nennt für „Knöterich. Ministerium für Monsterangelegenheiten." 49 Zeichen, es sind **50** (nachgezählt mit `[...s].length`, Umlaute als ein Zeichen). Am Ergebnis ändert das nichts, der z1-Deckel von 48 reißt so oder so. Gewählt wurde die kanonische Form 1 aus Kapitel 18: `Knöterich. Monstralministerium.` (31 Zeichen, 17 Zeichen Luft). Das Haus nennt sich selbst laut Namenstabelle „immer" so, ein Bediensteter, der sich vorstellt, ist genau dieser Fall. Damit **mitgenommen statt nach W3 vertagt**, weil die Mischform sonst bis W3 als vierter Name im Spiel steht und R5 der Abschnitt ist, der Kapitel 18 durchsetzt.
* **F61, Prämisse geprüft.** Der Fund trägt, seine Herleitung ist aber ungenau: die Nachbarzweige folgen dem Muster *Ort, amtliche Kurzform* (`Die Eisablage`, `Ablage A`), nicht dem Weltbibel-Vollnamen. Für das Dorf gibt es keine Kurzform, wohl aber einen amtlichen Ortsnamen: `Vordermühl an der Ablage` (`weltbibel:90`, Namensregister `:581`). Der Zweig lautet jetzt `📍 Vordermühl an der Ablage (Stufe N)`, 36 Zeichen und damit kürzer als der bereits vorhandene Aschewüste-Zweig.

Über die Fundliste hinaus geändert, jeweils weil ein Fund die Stelle mitzieht:

* `showDead()`: `Monster getötet` → `Monster erledigt` (F59, „kein Sterben", und deckungsgleich mit der Dienstbericht-Zeile) und `Level, Ausrüstung und Beute` → `Stufe, …` (F62). **Ungeprüft, laufzeitgebunden:** der Bildschirm ist bei `CONFIG.schichtModus = true` nicht erreichbar, `endShift('tod')` läuft stattdessen. Die Strings wurden im Browser durch direkten Aufruf abgenommen, nicht im Spielverlauf.
* Zwei Einblender aus F27: `LEVEL UP!` → `STUFENAUFSTIEG` (F62, letzter sichtbarer „Level"-Rest) und `HORDEN DES SCHATTENS!` → `MASSENVORGANG ERÖFFNET`.
* `AUSBAU_DEFS[0].name` `Höheres Anfangslevel` → `Höhere Anfangsstufe`. F62 nennt nur `desc`, aber Name und Beschreibung stehen im Dorf und in der Amtsstube untereinander, eine Hälfte umzustellen hätte den Widerspruch nur verschoben. Schlüssel `startLevel` unverändert.

Bewusst **nicht** angefasst, mit Begründung:

* **Der Einblender `KONFETTI-KATAKLYSMUS!`** (dritter der von F27 genannten). Er ist die Großschreibfassung des Zaubernamens `Konfetti-Kataklysmus des jüngsten Gerichts`. Nur den Einblender umzustellen, hätte genau den Fehler erzeugt, den F26 meldet: zwei Namen für dieselbe Sache. Den Zauber selbst umzubenennen ist Inhaltsarbeit an einem Phase-3-Gegenstand und liegt außerhalb von R5. `Konfetti` ist außerdem das Wort, mit dem Grundgesetz 8 selbst arbeitet.
* **Die beiden `|`-Trenner im Statistikkasten** (`index.html:387`, `:388`). F60 begründet sich damit, dass „alle anderen Zeilen den Interpunkt nutzen" — das stimmt nicht, diese zwei nicht. Sie trennen aber Spalten in einer Tabelle, nicht Satzteile in einer Zeile, und das ist eine andere Funktion. Auffälligkeit, kein Registerfehler.
* **Der Einblender `SCHATTEN-PORTAL ERSCHIENEN`.** Steht in keinem Fund und ist bereits amtsdeutschfähig („erschienen").
* **`kn.history`** (`sda_knoeterich_v1`) speichert die letzten drei Zettel im **gerenderten** Wortlaut und spielt sie über `knNachfragen()` wieder ab. Bestehende Spielstände zeigen also bis zu drei Zeilen im alten Register weiter, unter anderem die alte Knöterich-Vorstellung. Eine Migration wäre ein Systemeingriff und gehört nicht in eine Registerarbeit. **Laufzeitgebunden offen.**

Abnahme gelaufen, über die acht sichtbaren Bildschirme statt über Codestellen (Regel aus F83): Syntaxcheck `new Function()` auf den Skriptinhalt fehlerfrei; im Browser 300 Frames mit 25 Zaubern ohne Exception bei 0,34 ms/Frame (Referenz 0,6); `knAssertCaps()` liefert `true` und schreibt nichts; vollständiger Kanal-Scan über die Datei findet **null** sichtbare Gedankenstriche (die verbleibenden 94 stehen in Kommentaren), null Totenköpfe, null sichtbare Vorkommen von `Abaddon`, `Blutmagie`, `Sterbende`, `getötet`, `Level`, `HORDE`, `METZELN`; Schildbreiten mit `ctx.measureText` gegenmessen (`GEBÜHREN-` 48,6px, `BESCHEID` 43,2px gegen 66px Innenbreite, einzeilig wären es 86,4px).

### R6: Renderpfad und Regressionsschutz. — OFFEN

Der Regressionsblock ist hier Prüfmaßstab, nicht Hintergrundlektüre.

* **F30** `tintedSheet()` baut pro getöntem Sprite pro Frame einen Cache-Key-String. **Einzige Allokation, die mit der Hordengröße skaliert**, also der Punkt mit messbarem Effekt.
* **F31** Dungeon-Sheet-Keys werden pro Frame per Template-Literal zusammengebaut. Nachweislich in G1 entstanden, der Regressionsschutz hat nicht gegriffen.
* **F32** Zwei Closures pro Frame, eine davon plus linearem Array-Scan für einen Wert, der sich nur bei Nutzeraktion ändert.
* **F29** Zwei `title`-Attribute pro Frame ohne Dirty-Check, direkt neben der korrekten Lösung. Einziger ungeschützter HUD-Schreibpfad.
* **F41** `Math.hypot` an sechs Stellen im Frame-Pfad, drei davon neu aus G5. Zwei brauchen die Wurzel gar nicht.
* **F34** UI-Skin skaliert 16-px-Kunst ohne `image-rendering:pixelated`. Verstoß gegen Regressionsregel 14.
* **F73** Weitere Allokationen im Renderpfad, konstant wenige pro Frame. Viele kleine Stellen, geringster Nutzen des Abschnitts.

Abnahme: nach dem Umbau 300 Frames mit Zaubern ohne Exception, und das Frame-Budget in der Horde nicht schlechter als vorher (Referenz etwa 0,6 ms).

### R7: Audio-Feinschliff. — OFFEN

* **F21** `MUS.duck(ms)` steht in der Schnittstellenliste, existiert aber nicht. Der erste Aufrufer bekommt einen TypeError, und zwar spät.
* **F35** Zonenwechsel wartet bis zu vier Takte statt bis zur nächsten Taktgrenze, im Extremfall 12,6 Sekunden. Entweder Mechanik angleichen oder Planzeile `gameplay:508` ehrlich machen. **Achtung**, keine reine Kosmetik: `stepIdx` wird beim Wechsel auf 0 gesetzt.
* **F49** Der Wechsel duckt und startet die Phrase neu, auch wenn sich die Zone gar nicht ändert. Wird durch normales Gehen über die Dorfgrenze ausgelöst.
* **F50** `initAudio()` überträgt einen bereits gesetzten Muffle-Zustand nicht in den Lowpass. Betrifft genau das Fenster, in dem der Spieler die Musik zum ersten Mal hört.
* **F51** `shadowland.scale` ist äolisch, obwohl die Zone als phrygisch geführt wird. Derzeit stumm, weil keine Stinger-Variante die Stufe 1 anfasst, aber scharf. Ein Zeichen, danach gegenhören.
* **F48** `MUS.swell()` hat keinen Aufrufer. Anschließen (Stufenaufstieg, Truhe, Bosssieg) oder streichen.

Das meiste hier ist nur im Hören zu beurteilen. Was nicht am Code entschieden werden kann, **als laufzeitgebunden melden statt als erledigt zählen**.

### R8: Grafik-Restposten. — OFFEN

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

### R9: Aufräumen. — OFFEN

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
7. Ein Commit pro Abschnitt, Betreff `fix(r<N>): …` oder `docs(r<N>): …`, Body nennt die behandelten Fundnummern. Nachtragscommits sind erlaubt, wenn Information erst später eintrifft; sie nennen den Vorgängercommit.
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
