## M2: Nahfeld, Namen und Siegel — ERLEDIGT

Nachtrag zu M1 (`phase-m1-monsterkatalog.md`) und Z1 (`phase-z1-zauberbalance.md`).
M1 hat die Gegner gerechnet, Z1 hat die Zauber wieder etwas kosten lassen. Beide haben
eine Frage nicht angefasst: **wo auf der Karte steht welcher Gegner.** Diese Phase
beantwortet sie, gibt allen Monstern einen sichtbaren Namen, gleicht die Modelle an die
Angriffsarten an und stellt zwei Gegner auf, gegen die kein Zauber hilft.

An den Bändern aus M1 ändert sich nichts. Kein Gegner wird stärker oder schwächer, weil
der Spieler eine Stufe steigt, und keine Zahl hängt an einem Level.

### Der Befund

Die Bevölkerung lag **gleichverteilt** über 320 mal 320 Kacheln. Der Katalog staffelt
die Gegner in vier Ertragsklassen von Fleiß bis Meisterschaft, die Karte tat das nicht:
direkt hinter dem monsterfreien Gürtel stand mit derselben Wahrscheinlichkeit ein
Formfehler (A1, zwei Sekunden Kampf) wie ein Zustellbote (A4, eine halbe Minute und ein
Abgabefenster, das man kennen muss). Der erste Kampf einer Schicht war ein Würfelwurf.

Dazu kam ein zweiter Fehler in dieselbe Richtung: der Gürtel war **40 Kacheln** breit.
Wer aus dem Dorf trat, lief rund zehn Sekunden durch leeres Land, um dann in einer
Lotterie zu landen.

`tools/spaziergang-messlauf.mjs` misst genau das. Der Lauf setzt eine frische Stufe 1 an
den echten Startpunkt und lässt sie in der echten Welt losgehen, immer auf den nächsten
sichtbaren Gegner zu, drei Minuten lang. Drei Läufe auf dem Stand vor dieser Phase:

| Lauf | erster Kill | Kills | Stufe am Ende | Ausgang |
|---|---|---|---|---|
| 1 | nach 16,9 s | 1 | 1 | tot nach 23 s |
| 2 | nie | 0 | 1 | tot nach 17 s |
| 3 | nach 17,8 s | 1 | 1 | tot nach 27 s |

Der Läufer ist ein einfacher Bot, er weicht nie aus und geht nie zurück. Genau deshalb
ist er ein gutes Maß: er zeigt, was die Karte einem Spieler anbietet, der die Gegner
noch nicht kennt. Angeboten wurde ihm dreimal der Tod in der ersten halben Minute.

### Fünf Eingriffe

**M2-1. Der Gürtel schrumpft von 40 auf 12 Kacheln.** Das Dorf bleibt als Fläche sicher,
aber der erste Kampf beginnt jetzt im Blickfeld des Dorfes. Zwölf Kacheln sind rund drei
Sekunden Fußweg, und wer sich sicher fühlen will, geht drei Sekunden zurück.

**M2-2. Die Schwierigkeit wächst mit der Entfernung.** Der Abstand zum Dorfrechteck ist
jetzt die Achse, nach der die Gegner verteilt werden. Drei Zonen:

| Zone | Entfernung | wer dort steht |
|---|---|---|
| Nahfeld | 12 bis 44 Kacheln | nur Fleiß (A1), in dreifacher Dichte |
| Übergang | bis 96 Kacheln | Fleiß und Geduld, kein Risiko, keine Meisterschaft |
| Ferne | darüber hinaus | der volle Roster wie bisher |

Die Klassen kommen aus `MONDEF[t].kat.klasse`, nicht aus einer zweiten Liste. Wer einen
Gegner umklassifiziert, verschiebt ihn damit automatisch mit. Das Nahfeld wird in einer
eigenen Schleife mit 260 Gegnern gefüllt, zusätzlich zu den 600 über der ganzen Karte:
der Ring ums Dorf ist nur ein Prozent der Kartenfläche und bekäme aus der großen
Streuung heraus rund sechs Gegner.

Das Schneeband nördlich des Dorfes steht nicht im Katalog und hat deshalb keine
A1-Einträge. Statt dort ein Loch zu lassen, gilt der billigste Eintrag des Bandes als
Fleiß-Ersatz, also der Frostgeist mit 20 Lebenspunkten.

**M2-3. Der Sonderprüfer.** Ab und an steht zwischen den leichten Gegnern einer, den man
schon von weitem sieht: anderthalbfache Größe, ein magentafarbener Schein, den sonst kein
Gegner im Spiel trägt, ein pulsierender Bodenring und ein eigener Name über dem Kopf
("Ministerialrätin Klammer"). Er ist keine neue Vorgangsart und kein Katalogeintrag,
sondern die Aufwertung **einer Instanz** nach einer festen Regel:

| | Faktor | warum |
|---|---|---|
| Lebenspunkte | 4,0 | er soll ein Kampf sein, keine Begegnung |
| Schaden | 2,4 | er trifft wie ein Risiko-Gegner |
| Vorwarnung | 1,35, mindestens 350 ms | wer härter trifft, muss besser lesbar sein |
| Tempo | 0,9 | man kann ihm immer davonlaufen |
| XP | 8,0 | siehe unten, das ist keine freie Wahl |
| Gold | 6, Trank fast sicher | der lange Kampf zahlt sich aus |

Nur **A1-Gegner** werden aufgewertet. Ein aufgewerteter A4 wäre auf seiner Sollstufe
nicht mehr ohne Verbrauchsgegenstände zu schaffen, und genau das verbietet der Katalog.
Aus Fleiß aufgewertet spielt er sich wie ein Risiko-Gegner: er lebt lange, er trifft
hart, sein Gefahrenbudget bleibt aber über dem A3-Boden von sechs Sekunden.

Der Ertragsfaktor ist nicht gewählt, sondern gerechnet. Ein A1 zahlt 1,0 XP je
Kampfsekunde, ein A3 zahlt 2,0. Wer viermal so lange lebt und den A3-Satz zahlen soll,
muss achtmal so viel XP tragen: `4,0 * (2,0 / 1,0) = 8,0`. `monsterAssert()` rechnet
diese Beziehung beim Laden nach, damit ein später geänderter Faktor auffliegt.

**M2-4. Namen über den Köpfen.** Alle 22 Vorgangsarten trugen seit jeher ein `name`-Feld
in `MONDEF`, gezeichnet wurde davon nur der Boss, und der stand im HUD. Jetzt steht der
Name über dem Kopf, sobald der Gegner den Spieler bemerkt hat, ausholt oder näher als 210
Pixel steht. Der Sonderprüfer trägt seinen eigenen Namen und darunter die Vorgangsart,
denn erst beides zusammen sagt, was da steht und was es von einem will. 860 Gegner auf
der Karte, aber nie mehr als eine Handvoll Schilder gleichzeitig im Bild.

Die Namen der Sonderprüfer werden aus zehn Titeln und vierzehn Nachnamen gewürfelt, und
zwar mit `rng()`, dem gesetzten Weltzufall. Auf demselben Startwert steht derselbe
Sonderprüfer an derselben Stelle. Erst dadurch wird ein Satz wie "der Große bei den drei
Bäumen" überhaupt nachvollziehbar.

**M2-5. Die Modelle passen zur Angriffsart.** Vier Gegner trugen ein Modell, das eine
Handlung zeigt, die es bei ihnen nicht gibt:

| Gegner | vorher | jetzt | warum |
|---|---|---|---|
| Der Moorbescheid | `skeleton_bowman` | `cowling_1` | schlägt nur zu, spannte aber sichtbar einen Bogen |
| Die Sammelmahnung | `knights_archer` | `knights_spearman` | dasselbe, Reichweite 30 passt zum Speer |
| Mumie | `skeleton_bowman` | `cowling_2` | verschnürt und stäubt, schießt nie |
| Steingolem | `knights_spearman` | `knights_templar` | sein Angriff heißt Faustschlag |
| Alter Schrecken | `knights_archer` | `knights_swordman` | Reserve-Boss ohne jeden Fernangriff |

Daraus ist eine Regel geworden, die `monsterAssert()` prüft: ein Modell mit sichtbarem
Bogen oder Stab darf nur tragen, wer wirklich schießt, wirkt oder stützt, und ein Gegner,
der grundsätzlich auf Abstand kämpft, darf kein reines Nahkampfmodell tragen. Modelle
ohne Waffe (Schleime, Fledermaus, fliegender Schädel, Shroomlinge) stehen in keiner der
beiden Listen und passen zu beidem.

### Zwei versiegelte Gegner

"Es kann auch magieimmune Monster geben, nicht zu viele aber welche." Zwei von 22 sind es
geworden, beide gegen alle drei Zauberzweige immun und beide gegen die Waffe ausdrücklich
verwundbar:

| Gegner | Biom | Sollstufe | Klasse | Weichstelle | Nahkampf | Zauber |
|---|---|---|---|---|---|---|
| Klippkrabbe | Wüste | 5 | A2 | physisch -0,20 | 12,0 s | wirkungslos |
| Mumie | Ruine | 9 | A2 | physisch -0,25 | 14,0 s | wirkungslos |

Die Mumie ist der Gegner, bei dem das ohnehin die richtige Erklärung war: eine versiegelte
Akte ist genau das Ding, in das von außen niemand hineinwirkt. Vorher war sie
feueranfällig, was das Siegel eher widerlegte.

Drei Bedingungen prüfen der Generator und `monsterAssert()` unabhängig voneinander nach:
die Sollroute ist physisch, die Waffe ist Weichstelle, und die Klasse ist nicht A4. Beide
sind langsam (Tempo 36 und 26 gegen 135 beim Spieler), man kann also jederzeit wieder
weggehen. Die Sperre kostet Zeit und Aufmerksamkeit, nie das Leben. Beide stehen weit vom
Dorf entfernt, also dort, wo ein Spieler seine Zauber längst kennt. Sichtbar sind sie an
einem gestrichelten weißen Siegelring am Boden, der dauerhaft leuchtet und nicht erst
nach dem ersten verlorenen Zauber, und der erste abprallende Zauber sagt dazu, was zu tun
ist: "versiegelt, nimm die Waffe".

Dazu kommt eine Regel, die für alle Gegner gilt und die die harte Fassung des verbotenen
"Gegner ohne Konter" ist: **kein Gegner darf gegen alle vier spielbaren Arten zugleich
immun sein.** Das ist keine Balanceprüfung, sondern eine Sackgassenprüfung.

### Hausrecht im Dorf

Der schmalere Gürtel hat eine Folge, die im alten Kommentar zur Verfolgungsleine schon
stand: die Leine reicht 620 Pixel, das sind 19 Kacheln, und bei zwölf Kacheln Gürtel
reicht sie mitten ins Dorf. Deshalb gilt die Dorffläche jetzt ausdrücklich. Wer sie
betritt, verliert die Aggro auf der Stelle und geht sichtbar auf seinen Heimatpunkt
zurück, und aus dem Dorf heraus schreckt niemand mehr auf. Das Dorf ist der einzige Ort
im Spiel, an dem man ohne Aufmerksamkeit stehen darf.

### Was dabei herauskommt

`tools/nahfeld-messlauf.mjs`, gemessen an der wirklich gesetzten Bevölkerung:

| Zone | Gegner | begehbare Kacheln | je 100 Kacheln | Sonderprüfer | Ertragsklassen |
|---|---|---|---|---|---|
| Nahfeld | 342 | 8230 | 4,16 | 10 | A1 262, Schneeband 80 |
| Übergang | 221 | 29574 | 0,75 | 1 | A1 94, A2 43, Schneeband 84 |
| Ferne | 297 | 38192 | 0,78 | 3 | A1 125, A2 69, A3 31, A4 31, Schneeband 41 |

Das Nahfeld ist fünfeinhalb Mal so dicht wie der Rest der Karte und enthält kein einziges
Risiko- und kein einziges Meisterschaftsmonster. Die acht Gegner, die dem Startpunkt am
nächsten stehen, sind alle A1 und alle 20 bis 22 Kacheln entfernt.

Derselbe Spaziergang wie oben, jetzt auf dem neuen Stand:

| Lauf | erster Kill | Kills | Stufe am Ende | Ausgang |
|---|---|---|---|---|
| 1 | nach 6,4 s | 76 (davon 2 Sonderprüfer) | 7 | überlebt, nie unter 60 Prozent Leben |
| 2 | nach 6,4 s | 29 (davon 1 Sonderprüfer) | 5 | tot nach 148 s, 44 Kacheln draußen |
| 3 | nach 8,0 s | 65 (davon 2 Sonderprüfer) | 7 | überlebt, tiefster Stand 29 Prozent |

Lauf 2 ist kein Rückschlag, sondern die Staffel bei der Arbeit: der Bot war nach zweieinhalb
Minuten auf Stufe 5 und 44 Kacheln weit draußen, also gerade im Übergang, und ist dort an
etwas gestorben, dem er nicht ausgewichen ist. Genau dafür ist der Übergang da.

### Was bewusst so bleibt

**Die Sonderprüfer sind im Nahfeld häufiger als draußen** (zehn gegen vier). Das ist kein
Versehen: sie entstehen nur aus A1-Gegnern, und A1 steht nun einmal überwiegend im
Nahfeld. Der Effekt ist auch der gewünschte, denn der Ring ums Dorf ist der Ort, an dem
ein Spieler die meiste Zeit verbringt.

**Der Übergang ist nicht dichter als die Ferne.** Er ist eine Klassenschranke, keine
Dichteschranke. Wer dort sucht, findet dieselbe Menge Gegner wie draußen, nur keine, die
ihn in sechs Sekunden umbringen.

**Die Zonen hängen am Dorf, nicht am Spieler.** Es gibt keine mitwandernde Blase um den
Helden und keine Skalierung nach Stufe. Die Karte steht fest, wie alles andere in M1 auch.

### Prüfprotokoll

| Prüfung | Ergebnis |
|---|---|
| Syntax | ohne Befund |
| Die elf Guards plus `npcAnkerAssert` | still, nur die Nachweiszeilen |
| `monsterAssert()` | 22 Gegner geprüft, alle Bänder eingehalten |
| `tools/monster-fehlversuch.mjs` | zehn absichtliche Fehler, zehn gemeldet, unveränderter Katalog grün |
| `tools/monsterkatalog.py` | 22 Gegner, 0 Verletzungen |
| `tools/monster-messlauf.mjs` | 19 Gegner im Band, 3 von 3 Läufen gültig, Klippkrabbe 11,2 s, Mumie 14,4 s |
| `tools/zauber-messlauf.mjs` | Klippkrabbe und Mumie über beide Zauberwege nicht besiegbar, Nahkampf 14,1 s und 17,1 s |
| `tools/nahfeld-messlauf.mjs` | Nahfeld ohne A3 und A4, Dichte 4,16 gegen 0,78 |
| `tools/spaziergang-messlauf.mjs` | drei Läufe vorher und drei nachher, Tabellen oben |
| Zeichenpfad | `drawMon()` einmal je Zustand aufgerufen (gewöhnlich, Sonderprüfer, versiegelt, verletzt, im Ausholen), kein Fehler |

Der eine Befund, den `monsterAssert()` selbst gefunden hat: die Fledermaus warnt 250 ms
vor, mal 1,35 sind 338 ms, und der Katalog verlangt ab A3 mindestens 350. Deshalb hat der
Sonderprüfer nicht nur einen Faktor, sondern zusätzlich einen harten Boden von 350 ms. Das
stand nicht im Plan, das hat der Guard gemeldet.
