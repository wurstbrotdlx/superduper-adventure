# SuperDuper Adventure, Gameplay-Umbau in 6 Phasen

Arbeite die Phasen einzeln ab, nicht alle in einer Session.

## Modellstrategie (Hinweis für Matthias, nicht für Claude Code)

* Diese Datei liegt im Repo-Root, wird nicht in den Chat gepastet.
* Modell auf `opusplan` stellen: `/model opusplan`. Damit läuft der Plan-Modus auf dem stärksten Reasoning-Modell und die Ausführung wechselt automatisch auf Sonnet. Kein manuelles Umschalten nötig.
* Pro Phase eine frische Session. Auftakt jeweils nur: „Lies superduper-gameplay-prompt.md im Repo-Root. Setze ausschließlich Phase N um. Halte dich strikt an den Regressionsschutz-Block. Erst committen, wenn die Abnahmekriterien erfüllt sind."
* Plan-Modus (Shift+Tab) pro Phase nur kurz nutzen, um den Phasenabschnitt auf den realen Code zu mappen. Dann Plan bestätigen und ausführen lassen. Das teure Modell brennt nur im Plan-Modus.

## Kontext

Du arbeitest an `~/vibecodingprojekt/adventure/`. Der Ordner ist das Repo (`wurstbrotdlx/superduper-adventure`, public, Branch `main`, GitHub Pages aus dem Root). Kein Kopierschritt, direkt von hier committen und pushen.

* Hauptdatei: `index.html` (Canvas/JS, ein File, groß)
* Grafik: `assets/`, Sunnyside World (danieldiggle), einheitliches 96x64-Frameraster, row-major
* Dev-Server: `.claude/launch.json` (liegt eine Ebene höher, in `~/vibecodingprojekt/.claude/`), Eintrag `adventure`, Port 8378, URL `http://localhost:8378/adventure/index.html`. Dahinter steht `serve.py` (seit R4 im Repo): ein `http.server` mit `Cache-Control: no-store`. Ein blankes `python3 -m http.server` reicht nicht, es antwortet mit 304 und prüft dann den alten Stand.
* Sprache im Spiel: Deutsch, Untertitel „Looten, leveln und Monster wegschellen!"

Bestehende Systeme, auf denen du aufbaust:

* 3 Biome (Grasland, Frostkamm, Aschewüste) plus Schattenland über ein Zufallsportal (Level 5 bis 11)
* 21 Monstertypen auf 2 Rigs (Goblin, Skelett) mit Farb-Tint und Skalierung. 14 sind aktiv, 7 sind fertig definiert, aber in keinem Biom-Roster verdrahtet (mummy, golem, spider, bat, stalfos, mage, zweiter Boss)
* Zauberbaum: 11 Sprüche, 3 Zweige (Feuer, Frost, Arkan), 1 Skillpunkt pro Level-Up, Ultimate auf `R`
* Steuerung: WASD, Space/Klick Angriff, Q Trank, E Zauber, R Ultimate, T Zauberbaum, I Inventar, K Kessel, M Musik, Esc schließt Menüs. Touch: virtueller Joystick links, Kampf-Cluster rechts
* Kein Blut, Treffer und Tode zerplatzen in Konfetti. Das bleibt so.

## Regressionsschutz: das hier NICHT kaputtmachen

Diese Punkte sind teuer erkämpft. Jede neue UI und jedes neue System muss sich daran halten:

1. HUD schreibt nur bei echter Wertänderung. Nutze die vorhandenen `setTxt` / `setHTML` / `setStyle` mit Dirty-Check. Niemals `innerHTML` pro Frame.
2. Touch-Handling: `touchmove` / `touchend` / `touchcancel` hängen am `window`, nicht an Buttons. `.beltSlot *{pointer-events:none}` bleibt. Der Frame-Watchdog, der Gesten ohne lebenden Finger aufräumt, bleibt und muss neue Drag-Ziele mit abdecken.
3. Kein `Math.hypot` in Hot Paths. Direkter `sqrt`, Separation über Achsenvergleiche.
4. Zeichenliste läuft über den Pool mit Typ-Tags. Keine Closures pro Frame, keine neuen Objekt-Allokationen im Renderpfad.
5. Caps bleiben: Partikel 900, Floater 70.
6. `hurtMon()` behält den Tot-Guard (kein doppeltes XP/Loot bei Cleave plus AoE im selben Frame).
7. Sprite-Framezahlen sind im Code hart hinterlegt, weil die `stripN`-Zahlen in den Sunnyside-Dateinamen teils falsch sind. Nicht aus Dateinamen ableiten.
8. Minimap wird bei Levelwechsel einmal gebacken, danach nur Blit, alle 4 Frames.
9. Sound: die 70ms-Bremse auf Crit- und Sterbe-Sound bleibt.

Nach jeder Phase gilt: Spiel startet, ist durchspielbar, 300 Frames mit Zaubern ohne Exception. Erst dann committen. Ein Commit pro Phase, aussagekräftige Message. Nachtragscommits sind erlaubt, wenn Information erst später eintrifft (eine Bestätigung, ein Live-Befund, ein vergessener Statusmarker); sie nennen den Vorgängercommit.

## Ziel des Umbaus

Das Spiel soll ein Zeitfresser werden, ohne Diablo-Statsuppe. Leitsatz für alles Folgende:

> Der Sog entsteht nicht daraus, dass das nächste Item besser ist, sondern dass es bestimmt und noch nicht da ist.

Also: Items tragen Verben, keine Zahlen. Im UI erscheinen ganze deutsche Sätze, keine Prozentwerte. Intern darf gerechnet werden, angezeigt wird es nicht.

Ton: trocken, leicht albern, deutsch. Behörden- und Alltagskomik statt Fantasy-Pathos. Keine Gedankenstriche in Spieltexten.

## Phase 1: Zutaten-Grammatik — ERLEDIGT

Monster droppen keine fertige Ausrüstung mehr, nur noch Zutaten. Ausrüstung entsteht ausschließlich am Kessel.

### Zutat

Eine Zutat ist `Adjektiv + Substantiv`.

* Substantiv kommt vom Monstertyp. Alle 21 Typen bekommen ein eigenes: „Goblin-Zeh", „Skelettknöchel", „Schneemagier-Auge", „Golem-Splitter", „Fledermausflügel" und so weiter. Ein Substantiv bestimmt den Slot.
* Adjektiv wird beim Drop gewürfelt, gewichtet nach Biom und Monster-Seltenheit: „klebrig", „empört", „durchgefroren", „übermütig", „amtlich beglaubigt", „leicht verkohlt", „unangenehm feucht", „pedantisch", „glühend", „murmelnd". Ein Adjektiv bestimmt den Effekt.

### Kessel (im Dorf, neue Taste `K`)

Drei Zutaten hinein, ein Ausrüstungsteil heraus.

* Slot = das Substantiv, das am häufigsten vorkommt. Bei Gleichstand entscheidet die seltenste Zutat.
* Effekt = das Adjektiv, das am häufigsten vorkommt. Zweimal gleich verstärkt die Stufe, dreimal gleich erzeugt ein Unikat mit eigenem Namen.
* Qualität = Summe der Seltenheiten der drei Zutaten.

Diese Regeln stehen nirgends im Spiel. Die Spieler müssen die Grammatik rückwärts erschließen. Kein Rezeptbuch, keine Vorschau.

### Kessel-Kladde (Taste `K`, zweiter Reiter)

Ein Notizbuch, das sich automatisch füllt, sobald etwas beobachtet wurde. Startet leer.

* „klebrig" hat schon zweimal Verlangsamung erzeugt.
* „Goblin-Zeh" landete bisher immer im Stiefel-Slot.
* Nur beobachtete Zusammenhänge, keine Regeln, die noch nie ausgelöst wurden.

Die Kladde ist der eigentliche Fortschritt des Spiels. Merk dir das für Phase 4.

### Abnahme Phase 1

Zutaten droppen, stapeln sich im Inventar, Kessel funktioniert, Kladde füllt sich, Altbestand an Items bleibt tragbar. Alle 21 Substantive und mindestens 12 Adjektive sind als Datentabelle angelegt, nicht hartcodiert im Ablauf.

### Umsetzungsnotizen aus Phase 1 (für die Folgephasen wichtig)

* Tabellen stehen in `index.html` als `ZUTAT_NOUNS` (21), `ZUTAT_ADJ` (16), `WIRKUNG` (14), `CRAFT_BASE` (4 Slots x 5 Qualitätsstufen). Sie müssen **vor** dem ersten `recalc()`-Aufruf stehen, sonst TDZ-Fehler.
* Vierter Ausrüstungs-Slot `boots` (Stiefel) kam dazu, weil die Kladde-Beispiele ihn nennen. `SLOT_DE` und `SLOT_FUGE` liefern die deutschen Formen.
* Zutaten liegen in `player.pouch` (eigener Beutel, gestapelt), nicht in den 24 Taschenplätzen. Phase 4 nimmt genau diesen Beutel für das Mitnahme-Kontingent.
* Wirkungen werden in `recalc()` zu `FX` aggregiert (Schlüssel = `WIRKUNG[k].fx`, Wert = Summe der Stufen). Die 14 Hooks lesen nur aus `FX`. Phase 3 hängt Flüche an dieselbe Stelle.
* Die Kladde liegt in `localStorage` unter `sda_kladde_v1` und überlebt jeden Neustart. Phase 4 darf sie unter keinen Umständen zurücksetzen.
* Der Kessel ist über `K` überall bedienbar, nicht nur im Dorf: ein Dorf existierte zu diesem Zeitpunkt im Code noch nicht (**seit G5 steht es, siehe die Notiz zu Phase 4**; die Bedienung über `K` blieb trotzdem ortsunabhängig). Am Spawn steht ein Kessel-Prop als Landmarke (`KESSEL`, `KESSEL_T`, `drawKessel()`, Zeichentyp `DRAW_KESSEL`). Phase 4 kann die Bedienung dort verankern.
* `rollItem()` ist entfallen. `BASES`/`AFFIXES` bleiben für den Altbestand (Startwaffe, alte Fundstücke) stehen.
* `drops` wird jetzt mit `while(drops.length > 90) drops.shift()` gedeckelt: ein Kill lässt bis zu fünf Sachen fallen, ein einzelnes `shift()` hielt die Liste nicht mehr.

## Phase 2: Kammern mit Preisschild — ERLEDIGT

Versiegelte Rätselräume im offenen Land. Vor der Tür hängt ein Schild mit Schwierigkeit 1 bis 5 und dem Zutaten-Tier dahinter. Die Spieler entscheiden also informiert, ob sich der Aufwand lohnt.

### Aufbau

Eine Kammer ist ein Korridor aus 1 bis 4 Rätselmodulen, zusammengesetzt nach einem Schwierigkeitsbudget. Bau acht Module, nicht mehr:

1. Druckplatten in der richtigen Reihenfolge (Symbole, Hinweis liegt im Raum)
2. Schiebeblöcke auf Zielfelder (reine Rasterlogik, keine Physik)
3. Fackeln: mit Feuerzauber anzünden, mit Frost löschen, richtige Kombination gesucht
4. Lichtstrahl über drehbare Spiegel ins Ziel lenken (Rasterlogik)
5. Gegnerwelle mit Sonderregel: nur mit einem Zweig schadbar, oder nur von hinten
6. Symbolschloss: Hinweis irgendwo im Raum, Code am Ausgang
7. Bodenplatten, die einbrechen, sicherer Pfad muss gemerkt werden
8. Schalterpaar mit Zeitfenster

Keine Physikrätsel. Explizite Vorgabe.

### Wächter

Nutze die 7 bisher unverdrahteten Monstertypen als Kammerwächter. Keine neue Kunst nötig, nur Rosterpflege. Das ist billiger Content, hol ihn ab. (Ihre Zutaten-Substantive sind in Phase 1 bereits angelegt.)

### Belohnung

Loot-Tier folgt der Kammerschwierigkeit, nicht dem Monsterlevel. Schwere Kammern sind der einzige verlässliche Weg zu seltenen Zutaten.

### Abnahme Phase 2

Kammern erscheinen in allen 3 Biomen, Schild ist korrekt, jedes Modul einzeln lösbar und in Kombination stabil, Abbruch per Esc möglich ohne Softlock, Wächter aus dem 7er-Pool tauchen auf.

### Umsetzungsnotizen aus Phase 2 (für die Folgephasen wichtig)

* Die Kammer läuft auf **derselben** Karte wie die Oberwelt. `betreteKammer()` sichert `map`, `trees`, `decos`, `critters`, `monsters`, `drops`, `boss`, `portal` und die Spielerposition in `owSave` und überschreibt danach `map`. `verlasseKammer()` spielt alles kachelgenau zurück. Es gibt bewusst keine zweite Karte und kein zweites Boden-Canvas.
* `let kammer` und `let owSave` stehen **ganz oben** bei den Kachel-Konstanten, nicht im Kammerblock: `initFloorGraphics()` läuft schon beim Kartenbau und fragt `kammer` ab. Weiter unten deklariert wäre es ein TDZ-Fehler, genau wie bei den Tabellen aus Phase 1.
* `currentLevel === 3` bedeutet Kammer (1 = Oberwelt, 2 = Schattenland). Alle bestehenden `currentLevel`-Abfragen wurden daraufhin durchgesehen.
* Neue Kacheltypen `G_WALL`, `G_BLOCK`, `G_GAP`. `WALKABLE` ist eine Whitelist, sie stehen einfach nicht drin.
* Geometrie: `KAM_W`/`KAM_H` (13 x 15 Kacheln je Raum, Wände eingerechnet), Korridor ab `KAM_X0`/`KAM_Y0`, alle Tore in Zeile `KAM_TY` (Raummitte). Maximal 6 Räume, das passt in `MW = 80`. **Modul-Layouts rechnen relativ zu `r.y0`** — wer `KAM_H` ändert, muss die Offsets in den `bau*`-Funktionen mitziehen.
* `kammerKamera()` hält den Korridor mittig, sonst zeigt die Kamera an den Rändern nur gebackenes Schwarz.
* Tore backen beim Öffnen **nur ihre drei Kacheln** nach (`malBoden`), nie das ganze Boden-Canvas. Ein Komplettbake wären 6400 `drawImage` mitten im Spiel.
* Module sind eine Tabelle `KAM_MOD[kind] = {kosten, bau, auf, moeglich}`. `moeglich()` gatet Module, die Voraussetzungen brauchen (Fackeln verlangen einen Feuer- und einen Frostzauber). Die Modulwahl passiert erst beim **Betreten**, nicht beim Türsetzen — sonst wüsste sie nichts vom Zauberbaum. Schwierigkeit und Tier stehen dagegen schon an der Tür fest, das ist das Preisschild.
* `hurtMon()` hat einen fünften Parameter `quelle` (`'nah'`, Zweig 0..2 oder `'ult'`). Er wird nur von Kammerwachen mit `m.regel` ausgewertet, die Prüfung sitzt direkt **hinter** dem Tot-Guard. Phase 3 kann denselben Parameter für Flüche nutzen, die die Schadensquelle betreffen.
* Kontextaktionen (`F`, Button `#aktionBtn`) laufen über drei feste Modulvariablen statt über Closures pro Frame: `aktArt` / `aktObj` / `aktTxt`, gefüllt von `aktBiete()`. `aktSperre` verhindert, dass Tastenwiederholung sofort wieder ein- oder austritt.
* `CONFIG` existiert jetzt (`kammerTueren`, `kammerNachwachsen`). Phase 4 hängt `schichtModus` und die Dorf-Ausbauten dort ein; „mehr Kammertüren pro Biom" ist bereits `CONFIG.kammerTueren`.
* `rollKammerZutat(tier, biome)` hat einen Notnagel-Zweig, damit das Schild nie mehr verspricht als die Truhe hergibt. Gegen 45.000 Stichproben geprüft: kein Wert unter dem angeschriebenen Tier.
* Der Alte Schrecken (`bossgeneric`) setzt wie jeder Boss `boss`. In `killMon()` löst nur ein Boss **außerhalb** einer Kammer `winGame()` aus, sonst würde eine Schatzkammer das Spiel gewinnen. Die Bossleiste erscheint erst bei `boss.aggro` und liest den Namen aus `MONDEF`.
* Musik-Button und Lautstärkeregler sind aus dem Gürtel ins Inventar gewandert (`#musikBox`, ganz unten). Der Gürtel hatte sonst auf dem Handy drei Zeilen und lief unter den Daumen-Fächer.

## Phase 3: Fluch-Ökonomie — ERLEDIGT

Jedes am Kessel erzeugte Ausrüstungsteil hat genau einen Vorteil und genau einen Fluch, beides als deutscher Satz. Der Fluch leitet sich aus dem Adjektiv ab, hängt also an der Grammatik aus Phase 1.

Lege je 24 Vorteile und 24 Flüche als Datentabelle an, jeder mit einem Code-Hook. Nicht mehr, die Hooks kosten echte Arbeit.

Flüche müssen mechanisch echt und untereinander kombinierbar sein. Beispiele für den Ton und die Machbarkeit:

* „Doppelte Angriffsgeschwindigkeit. Du kannst nicht mehr stehenbleiben."
* „Mehr Rüstung. Gegner müssen erst gegrüßt werden." (Taste in Reichweite, sonst kein Schaden)
* „Deine Zauber sind stärker. Sie kosten Leben statt Mana."
* „Gold fließt doppelt. Es verfällt langsam in deiner Tasche."
* „Du triffst doppelt so hart. Jeder dritte Schlag geht daneben."
* „Du siehst jede Truhe auf der Karte. Du siehst keine Lebensbalken mehr."
* „Deine Waffe ist geschwätzig. Gegner aggroen auf doppelte Entfernung."
* „Tränke wirken sofort. Sie schmecken nach Konfetti und machen kurz hektisch."

Das eigentliche Spiel entsteht daraus, dass sich Flüche gegenseitig aufheben oder verstärken. Wer nicht stehenbleiben kann, hat mit dem Grüß-Fluch ein echtes Problem. Baue mindestens 6 solcher Wechselwirkungen bewusst ein und dokumentiere sie in einem Kommentar über der Tabelle.

### Abnahme Phase 3

Keine Zahl mehr im Item-Tooltip, nur Sätze. Alle 48 Hooks greifen. Kein Fluch kann das Spiel in einen unspielbaren Zustand bringen (harter Test: alle Slots mit den fiesesten Flüchen gleichzeitig).

### Umsetzungsnotizen aus Phase 3 (für die Folgephasen wichtig)

* Die Tabellen aus Phase 1 sind gewachsen: `WIRKUNG` von 14 auf **24**, `ZUTAT_ADJ` von 16 auf **26**, dazu neu `FLUCH` mit **24** Einträgen. Jedes Adjektiv trägt jetzt beides, `wirk` für den Vorteil und `fl` für den Fluch. Die Grammatik aus Phase 1 bestimmt also weiterhin alles; der Fluch hängt am selben Adjektiv wie die Wirkung und ist keine zweite Würfelquelle.
* `CFX` ist das Gegenstück zu `FX`: aggregierte Flüche, aber nur **0 oder 1**. Derselbe Fluch auf zwei Slots wirkt nicht doppelt. Alle Fluch-Hooks lesen ausschließlich aus `CFX`, so wie die Wirkungs-Hooks nur aus `FX` lesen. Berechnet wird beides in derselben Schleife in `recalc()`.
* **Fluchbudget:** höchstens **zwei harte Flüche** gleichzeitig wirksam, der Rest ruht als `item.fluchRuht` und zeigt im Tooltip „Dieser Fluch ruht. Zwei sind genug." Hart sind sechs: Grußpflicht, Zappeln, Standpflicht, Blutmagie, Manastopp, Nüchternheitsgebot. Das Budget verhindert gezielt die Kombination aus Stumpfheit, Nüchternheitsgebot, Blutmagie und Manastopp, die keine Nachfüllquelle mehr übrig ließe. Wer einen neuen harten Fluch ergänzt, muss das Budget mitdenken.
* `item.fluchRuht` wird in `recalc()` bei **jedem** Aufruf neu gesetzt. Nicht anderswo zwischenspeichern, sonst hängt ein ruhender Fluch fest.
* Derselbe Fluch auf zwei Slots belastet das Budget nur einmal (`schonAktiv`-Prüfung). Sonst hätte zweimal dieselbe Standpflicht einen Platz verschenkt.
* Die **sechs bewussten Wechselwirkungen** stehen als Kommentarblock direkt über `FLUCH`. Wer die Tabelle anfasst, hält den Block aktuell, er ist die einzige Dokumentation dieser Absicht.
* `hurtMon(m, d, crit, hitAngle, quelle)`: der `quelle`-Parameter aus Phase 2 wird jetzt zweifach ausgewertet, von den Kammerwachen mit `m.regel` und von der Grußpflicht. `CFX.gruss` greift nur bei `quelle === 'nah'`, Kammerwachen mit Sonderregel sind davon ausgenommen.
* **Falle Grußpflicht:** `AKT_GRUSS` wird in `scanAktion()` auf der **Spielerposition** angeboten und gewinnt damit jeden Distanzvergleich in `aktBiete()` (Distanz 0). Deshalb steht dort ein Guard, der nur anbietet, wenn wirklich ein ungegrüßtes Ziel in der Nähe ist. Ohne ihn überstimmt der Fluch dauerhaft jede Tür- und Truheninteraktion. Nicht wegoptimieren.
* Die Unterscheidung `hart:true` benutzt Phase 4 weiter: `STARTFLUCH_WAHL` im Amt bietet ausschließlich milde Flüche an, damit eine Schicht nicht schon beim Antritt unspielbar startet.
* Einzelne Flüche greifen bewusst nur unter Bedingungen, damit sie nicht in Sackgassen führen: das Nüchternheitsgebot sperrt den Trank nur im Kampf und nur oberhalb 30 Prozent Leben, die Standpflicht setzt die Rüstung nur während der Bewegung auf 0.
* `CFX.schweigen` (Amtsschweigen) sperrt das Lernen der Kladde, solange das Stück getragen wird. Das ist der einzige Fluch, der den Fortschritt selbst betrifft, und er ist absichtlich nur ein Pausenknopf, kein Löschen. Er darf nie dazu führen, dass bereits Notiertes verschwindet.
* Altbestand bleibt tragbar: Items ohne `fluch` laufen unverändert weiter.

## Phase 4: Dienst nach Vorschrift — ERLEDIGT

Achtung, das ist ein struktureller Umbau, kein Anbau. Er ersetzt die bisherige Todesregel („Rückkehr in den Wald mit halbem HP, kein Reset").

### Neuer Rahmen

Ein Durchgang ist eine Schicht von grob 15 Minuten. Tod bedeutet Feierabend, nicht Rückschlag.

Setzt sich beim Tod zurück: Level, Skillpunkte, Zauberbaum, getragene Ausrüstung.

Bleibt dauerhaft:

* Die Kessel-Kladde. Immer. Ohne Ausnahme. Wissen ist der eigentliche Fortschritt und darf nie verloren gehen. Das ist der Punkt, an dem Phase 4 mit Phase 1 verträglich wird.
* Gold zu einem Anteil (Startwert 50 Prozent, konfigurierbar)
* Eine begrenzte Zahl mitgenommener Zutaten, Rest wird „eingezogen"
* Gekaufte Dorf-Ausbauten

### Dorf: Amt für Monsterangelegenheiten

Hub zwischen den Schichten, Ausbauten gegen Gold:

* höheres Anfangslevel
* größeres Zutaten-Kontingent für die Mitnahme
* Startausrüstung mit einem festen Fluch deiner Wahl
* mehr Kammertüren pro Biom
* Kladde zeigt zusätzlich Vermutungen statt nur Beobachtungen

### Feierabend-Bildschirm

Als Dienstbericht gestaltet: Monster nach Art aufgeschlüsselt, Zutatenaufkommen, Überstunden, Beuteanteil nach Abzug, eine trockene Bemerkung der Sachbearbeitung. Alle 10 Schichten ein Jahresgespräch mit dem Bürgermeister, das eine dauerhafte Kleinigkeit freischaltet.

### Pflicht

Setze ein Flag `CONFIG.schichtModus = true`. Auf `false` gilt wieder die alte Todesregel. Wir wollen zurückschalten können, wenn sich der Umbau im Spiel schlechter anfühlt als auf dem Papier.

### Abnahme Phase 4

Schicht startet, endet, Übertrag stimmt, Kladde überlebt garantiert jeden Tod, Dorf-Ausbauten wirken, Flag schaltet sauber zurück auf das alte Verhalten.

### Umsetzungsnotizen aus Phase 4 (für die Folgephasen wichtig)

* `startShift()` ist der **einzige** Reset-Pfad, sowohl für die allererste Schicht (aus `startGame()`) als auch für jede folgende (aus dem Amt-Panel). Das ist Absicht, ein getesteter Pfad statt zweier. Wer etwas ausschließlich beim allerersten Spielstart braucht, darf es deshalb **nicht** dort einhängen, sondern in `startGame()`. Bei `CONFIG.schichtModus = false` läuft `startShift()` nie.
* `endShift(reason)` kannte in dieser Phase `'tod'` und `'zeit'`. **Seit Grafik-Phase G5 kommt `'amt'` dazu**, der freiwillige Feierabend aus dem Amtsfenster. Vollständige Aufruferliste heute: `'tod'` im Sterbepfad, `'zeit'` in der Schichtuhr, `'amt'` im Amtsfenster. Der Anlass steuert nur Titel und Anlasstext, der übrige Dienstbericht ist identisch. Es erhöht `amt.schichten` selbst, bevor das Panel steht. Der Wert zählt also **abgeschlossene** Schichten, die laufende Nummer ist `amt.schichten + 1`. `showDorf()` liest ihn entsprechend als „Schicht N abgeschlossen".
* Neuer `state`-Wert `'feierabend'` neben `'menu'`, `'play'` und `'win'`, gesetzt an drei Stellen (Tod, Zeitablauf, `showDorf()`). Jede neue Abfrage auf `state !== 'play'` muss ihn mitdenken.
* Die Kladde wird in `endShift()` bewusst **nicht** angefasst. Sie speichert sich schon beim Kochen über `saveKladde()` und ist dadurch strukturell unabhängig vom Reset. Das ist die Garantie aus Phase 1, kein Sonderfall im Schichtcode. So muss es bleiben.
* `AMT_KEY = 'sda_amt_v1'` wird ganz oben geladen, bevor Kammertüren oder HUD danach fragen. Gleiche Reihenfolge-Regel wie die Tabellen aus Phase 1.
* Übergabe zwischen zwei Schichten läuft über `pendingCarryGold` und `pendingCarryPouch`. `startGame()` leert beide für die allererste Schicht.
* Überstunden: bei Zeitablauf setzt `shiftEndPending`, danach läuft `overtimeT` weiter, bis kein Gegner nah ist und weder Kammer noch Symbolschloss offen sind, spätestens aber 60 Sekunden. Kein Abbruch mitten im Kampf.
* Zutaten-Übertrag sortiert nach `zutatRar()` absteigend und kappt auf `CONFIG.zutatenMitnahmeBasis + amt.ausbauten.kontingent*2`. Stapel werden dabei geteilt, der Rest gilt als eingezogen.
* `shiftKillsByType` und `shiftKillsTotal` werden **nur** bei `CONFIG.schichtModus === true` gefüllt. Außerhalb des Schichtmodus liest man dort 0.
* `stats.goldTotal` ist deklariert, aber tot: es wird nirgends erhöht. Gold läuft direkt über zwei `player.gold +=`-Stellen (Truhe und Drop-Aufnahme). Nicht darauf aufbauen, ohne es vorher zu verdrahten.
* Jahresgespräch bei `amt.schichten % 10 === 0`, Bonus über `(Math.floor(amt.schichten/10) - 1) % JAHRES_BONI.length`. Läuft im Kreis, geht also nie aus.
* **Falle:** Der Jahresbonus „Dienstsiegel" schreibt in `CONFIG.kammerNachwachsen`, aber `saveAmt()` serialisiert nur `amt`, nicht `CONFIG`. Der Bonus überlebt den Reload nicht und wird bei jedem fünften Jahresgespräch erneut vergeben. Die vier anderen Boni liegen als `amt.bonus*` richtig. Wer das repariert, muss den Wert nach `amt` ziehen.
* `CONFIG.kammerTueren` wird an zwei Stellen gesetzt: einmal beim Laden des Amt-Stands (`+=`, damit der Ausbau schon in der allerersten Schicht wirkt) und einmal pro Schicht in `startShift()` als Zuweisung `2 + amt.ausbauten.tueren`. Die Zuweisung verhindert, dass sich der Ausbau über die Schichten aufaddiert. Nicht in ein `+=` ändern.
* `STARTFLUCH_WAHL` enthält bewusst nur milde Flüche. Ein harter Fluch könnte eine Schicht schon beim Antritt unspielbar machen.
* Die Startwaffe steht hart in `startShift()` (`BASES[1]` plus `AFFIXES[0]`), der gekaufte Startfluch hängt sich als `player.equip.weapon.fluch` daran.
* `player.hair` wird pro Schicht neu gewürfelt: jede Schicht ein anderer Sachbearbeiter.
* Das Amt dieser Phase ist ein `#ovPanel`-Screen wie Start, Tod und Sieg, **kein begehbarer Ort**. Ein Dorf existierte zum Abschluss von Phase 4 nicht, die einzige Landmarke war der Kessel-Prop am Spawn. **Seit Grafik-Phase G5 überholt:** um den Spawn steht ein begehbares Dorf (`VILLAGE`, sechs Gebäude in `VILLAGE_BUILDINGS`, drei NPCs aus `NPC_DEFS` als reine Staffage ohne Dialog und ohne Kontextaktion). Das Amt ist zusätzlich als Gebäude erreichbar: `AMT_TUER` bietet `AKT_AMT` an und öffnet ein eigenes Amtsfenster. Das `#ovPanel` aus Phase 4 bleibt daneben bestehen, beide Wege haben bewusst unterschiedlichen Umfang.
* Die Schichtuhr hängt über `schichtHudSuffix()` im Zonen-HUD.
* Bewusst offen gelassen: die Ausbau-Kosten in `AUSBAU_DEFS` sind eine erste vernünftige Schätzung, keine durchgespielte Zahl.

## Phase 5: Amtsrat a. D. Knöterich — Onboarding ohne Tutorial — ERLEDIGT

Ersetzt den Erklärtext im Startbildschirm durch eine Figur, die ereignisgesteuert kurze Hinweise gibt. Kein Tutorial-Modus, keine Hinweisketten, keine Wall of Text.

Alle unten genannten Bezeichner und Zeilennummern wurden gegen den Stand nach Commit `55236b8` geprüft. Zeilennummern verschieben sich beim Arbeiten, die Bezeichner nicht: such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.

### Die Figur

Amtsrat a. D. Knöterich vom Amt für Monsterangelegenheiten. Er siezt den Spieler. Ton: trocken, Behördenkomik, kurz. Keine Emojis in seinen Texten, keine Gedankenstriche in Spieltexten (gilt im ganzen Projekt).

**Wo er steht.** Zum Zeitpunkt dieser Phase gab es kein begehbares Dorf: das Amt aus Phase 4 war ein Overlay-Panel, kein Ort. Knöterich steht deshalb als **Außenstelle neben dem Kessel-Prop** (**seit G5 liegt das Dorf um genau diese Stelle herum, sein Standort ist damit mitten im Dorf und bleibt unverändert**) (`KESSEL_T = {x:15, y:41}`, `KESSEL` in Pixeln, gezeichnet über `DRAW_KESSEL` / `drawKessel()`). Setz ihn auf eine begehbare Nachbarkachel, nicht auf den Kessel. Er hat keine KI, keine Kollision, keine Trefferbox und läuft nie mit. `placeMonsters()` darf nicht auf seine Kachel spawnen.

`SPAWN` liegt bei `{x:12.5*TS, y:40.5*TS}`, der Kessel bei Kachel 15/41, das sind rund **97 Pixel** Abstand. Der Spieler steht beim Start also außerhalb des 58-Pixel-Radius der Kontextaktion. Das ist für die Blase relevant, siehe unten.

**Sprite aus Bestand, keine neue Kunst.** `hero_idle` plus ein **fest gewähltes** Element aus `HAIRS` (nicht zufällig, er ist immer derselbe), beides grau getönt über den vorhandenen Cache `tintedSheet(key, color, alpha)` und etwas kleiner skaliert, gezeichnet mit `drawSpriteAt()` wie in `drawPlayer()`. **Kein `ctx.filter`**: das ist keine Nummer aus dem Regressionsschutz-Block, sondern eine Code-Regel, siehe die Kommentare bei `index.html:3722` und `index.html:3837`. Getönt wird ausschließlich über `tintedSheet()`.

Neues Zeichentyp-Tag `DRAW_ALTER` in der Konstantenzeile neben `DRAW_KESSEL` (~3437), Einreihung über `pushDraw(y, DRAW_ALTER, null)` hinter einem `vis()`-Test, genau wie der Kessel. Nur zeichnen, wenn `currentLevel === 1` und `!kammer`.

**Im Dienstbericht-Panel** taucht er zusätzlich als kleiner Kopf auf: nur im Bericht aus `endShift()` (~4118), **nicht** in `showDorf()` und **nicht** im Jahresgespräch. `#ovPanel` wird von sieben Stellen komplett per `innerHTML` überschrieben (Start, Tod, Sieg, Dienstbericht, Jahresgespräch, Amt, Ladebildschirm). Deshalb: **keine `id` innerhalb von `#ovPanel` vergeben und niemals `setTxt`/`setHTML`/`setStyle` darauf anwenden.** Der `el`-Cache (`~547`) und der `LAST`-Cache (`~551`) würden auf abgehängte Knoten zeigen. Der Kopf entsteht ausschließlich als Teil des Template-Strings.

### Drei Kanäle

| Kanal | Technik | Form | Dauer |
|---|---|---|---|
| Weltfigur-Blase | **Canvas**, im selben Zeichenschritt wie `DRAW_ALTER` | Blase über dem Kopf, 2 Zeilen | solange der Spieler in Reichweite ist |
| Dienstzettel | DOM-Knoten | Zettel oben im Bild, Stempel plus Kopf als Briefmarke, 2 Zeilen | 6 Sekunden |
| Randnotiz | DOM-Knoten | eine Zeile, nur Stempel, kein Kopf | 3 Sekunden |

**Die Blase ist ausdrücklich Canvas, nicht DOM.** Sie hängt an einer Weltposition auf einer scrollenden Karte; ein DOM-Knoten müsste der Kamera pro Frame folgen, und der vorgeschriebene Dirty-Check würde nie greifen. Vorbild ist der vorhandene `floaters`-Zeichner (~3624), der ebenfalls in Weltkoordinaten innerhalb des Kamera-Transforms zeichnet. Textzeilen kommen aus Modulvariablen, keine Closure und keine Allokation pro Frame.

**Blasen-Reichweite: 150 Pixel** (`sqDist < 22500`, kein `Math.hypot`). Muss größer sein als die 97 Pixel vom Spawn zum Kessel, sonst kommt Beat 1 nie. Blase erscheint beim Eintritt in den Radius, verschwindet beim Austritt. Steht kein Beat und keine Wiederholung an, zeigt die Blase nichts.

Fiktion für die anderen beiden Kanäle: das ist Post, kein Gespräch. Der Zettel begründet seine eigene Kürze, ein Formular labert nicht. Halte dich daran, das ist die Bremse gegen wachsende Texte.

### Grundgesetz, gilt für jeden Text

1. **Knöterich erklärt Tasten und Absichten, nie Zusammenhänge.** Er darf sagen „Drei Zutaten, ein Ding, Taste K". Er darf niemals Kesselgrammatik (Slot = häufigstes Substantiv, Wirkung = häufigstes Adjektiv, dreimal gleich = Unikat, Qualität = Summe der Seltenheiten), eine Adjektiv-Wirkungs-Zuordnung oder eine Fluch-Ableitung verraten, auch nicht andeutungsweise. Die Kladde ist der eigentliche Fortschritt des Spiels und Knöterich ihr größtes Leck-Risiko. Jeder Text ist einzeln gegen diese Regel zu prüfen, das Ergebnis kommt in den Abschlussbericht.
2. **Ein Hinweis nennt höchstens eine Taste.**
3. **Zeichendeckel:** Dienstzettel und Blase Zeile 1 maximal 48 Zeichen, Zeile 2 maximal 32. Randnotiz maximal 44. Das gilt auch für die Touch-Fassungen und die Auftakt-Beats. Zusammengesetzte Zeilen (Schichtnummer, Zählerstände) werden mit ihrem **längstmöglichen** Wert geprüft. Beim Start als Assertion über alle Tabellen laufen lassen, nicht als guten Vorsatz behandeln.
4. **Keine Ketten.** Ein Hinweis endet. Der nächste kommt vom nächsten Ereignis, nie vom vorherigen Hinweis.
5. **Kein Blut.** Projektregel seit jeher: Treffer und Tode zerplatzen in Konfetti. Auch Knöterich redet nicht von Blut.

### Startbildschirm

`showStartScreen()` (~3930) wird zusammengestrichen auf Überschrift, Untertitel, **einen** Anreißersatz und den Knopf. Der lange `<p>`-Block und der komplette Steuerungs-`<div>` darunter (~3936 bis 3944) entfallen ersatzlos.

Der Anreißersatz muss die **Angriffseingabe** mitnehmen, weil sie sonst nirgends mehr steht und Beat 2 sie bereits voraussetzt. Vorschlag:

> Drei Biome, versiegelte Kammern, ein Kessel. Draufhauen mit Klick oder Leertaste, auf dem Handy rechte Bildschirmhälfte. Den Rest erklärt das Amt.

### Auftakt: drei Beats

| Beat | Auslöser | Zeile 1 | Zeile 2 | Zeile 2 auf Touch |
|---|---|---|---|---|
| `beat1` | direkt nach `startGame()`, als Blase | Knöterich. Amt für Monsterangelegenheiten. | Sie sind Außendienst. WASD. | Außendienst. Daumen links. |
| `beat2` | nach dem ersten Kill, als Zettel | Geht doch. Schellen zählt als Sachbearbeitung. | Aufheben, was liegt. | Aufheben, was liegt. |
| `beat3` | sobald `player.spellPoints > 0`, als Zettel | Punkt gutgeschrieben. Hilft keinem im Sack. | T. Aussuchen. | Der Stern im Gürtel. |

**Beat 1 hängt an `startGame()` (~3991), nicht an `startShift()`.** Bei `CONFIG.schichtModus = false` läuft `startShift()` nie, dort fiele der komplette Ersatz für den gestrichenen Erklärtext sonst weg. `startShift()` bleibt ausdrücklich stumm, es bedient auch jede Folgeschicht.

**Alle drei Beats sind über die Lebenszeit des Speicherstands einmalig**, Kriterium ist ein Flag in `sda_knoeterich_v1`, ausdrücklich **nicht** `amt.schichten === 0`. `startShift()` setzt Level, Skill- und Zauberpunkte zurück, ihre Auslöser treten also in jeder Schicht erneut ein.

**Die Beats sind Startsequenz, kein normaler Zettel:** sie zählen nicht gegen das Drei-Zettel-Budget, unterliegen nicht dem 25-Sekunden-Cooldown und haben Vorrang vor jedem Katalogzettel (Prio 100). Sonst verdrängt sie in den ersten zwei Minuten der Katalog, und die Einführung fällt aus.

Wird Beat 1 als Blase nicht zugestellt, weil der Spieler sofort wegläuft, gilt er nach 2 Sekunden sichtbarer Blase als zugestellt, sonst wandert er als Zettel hinterher.

**Beat 3 achtet auf `player.spellPoints`, nicht auf `player.skillPoints`.** Ein Level-Up vergibt beides (`player.skillPoints += 2; player.spellPoints += 1;`, ~1644). `T` öffnet den Zauberbaum, der die Zauberpunkte verbraucht; die Skillpunkte sitzen im Inventar.

### Dienstzettel-Katalog

Alle einmalig über die Lebenszeit. `art` unterscheidet, wie die Bedingung ausgewertet wird (siehe Technik). Prio löst Konflikte: höher gewinnt, bei Gleichstand die frühere Tabellenzeile.

| id | prio | art | Auslöser | Zeile 1 | Zeile 2 | Zeile 2 auf Touch |
|---|---|---|---|---|---|---|
| `hp30` | 90 | zustand | HP erstmals unter 30 Prozent | Sie verlieren Konfetti. Das ist selten gut. | Trank. Q. | Das Fläschchen. |
| `tuer1` | 70 | zustand | erste Kammertür in Sichtweite | Schild lesen. Steht alles dran. | F, wenn Sie sich trauen. | Die Hand im Gürtel. |
| `zutat3` | 65 | zustand | drei Zutaten-Stapel im `player.pouch` | Drei Stück. Das gilt als Antrag. | Zum Kessel. K. | Rucksack, dann Kessel. |
| `zutat1` | 60 | ereignis | erste Zutat aufgenommen | Das ist kein Müll. Das ist Sachbestand. | Sammeln. Fragen später. | Sammeln. Fragen später. |
| `craft1` | 55 | ereignis | erstes Kessel-Item erzeugt | Notiert. Ich notiere alles. | Zweiter Reiter im Kessel. | Zweiter Reiter im Kessel. |
| `fluch1` | 50 | ereignis | erstes Fluch-Item angelegt | Jeder Vorteil hat eine Rückseite. | Nachlesen. I. | Im Rucksack nachlesen. |
| `kammer1` | 45 | ereignis | erste Kammer geplündert | Kammer erledigt. Kommt in die Akte. | Weiter im Dienst. | Weiter im Dienst. |
| `ult1` | 40 | zustand | Ultimate erstmals freigeschaltet | Alles gelernt. Jetzt wird es albern. | R. Einmal reicht. | Der Ult-Knopf. Einmal reicht. |
| `portal1` | 35 | ereignis | Schattenportal erscheint erstmals | Das Portal ist nicht mein Ressort. | Viel Glück. | Viel Glück. |
| `feierabend1` | 30 | gelatcht | erstes Schichtende | Erste Schicht überstanden. | Der Bericht liegt beim Amt. | Der Bericht liegt beim Amt. |
| `amt1` | 25 | zustand | Guthaben reicht erstmals für einen Ausbau | Sie sind flüssig. Das Amt hätte da was. | Nach Feierabend. | Nach Feierabend. |

**`fluch1` sagt nicht „Beutel".** Das Wort ist im Projekt für `player.pouch` (die Zutaten) reserviert, Ausrüstung liegt in den 24 Taschenplätzen.

**`amt1` wörtlich:** `amt.bankGold >= Math.min(...AUSBAU_DEFS.filter(d => amt.ausbauten[d.key] < d.max).map(d => d.cost(amt.ausbauten[d.key])))`. Die Kosten sind Funktionen der aktuellen Stufe (`cost: l => 30*(l+1)` und so weiter), nicht feste Beträge. Die beiden Sonderposten im Amt (Vermutungen 100, Startfluch 60) stehen **nicht** in `AUSBAU_DEFS` und zählen hier bewusst nicht mit.

**`feierabend1` und `amt1` werden gelatcht.** Ihr Auslöser fällt mit dem Öffnen von `#overlay` zusammen, also mit ihrer eigenen Sperrzone. Sie erscheinen als erster Zettel der Folgeschicht, frühestens 5 Sekunden nach `state === 'play'`. Deshalb steht in `feierabend1` „liegt beim Amt" und nicht „liegt vor".

**Steckenbleib-Schubs.** 50 Sekunden ohne Kill, ohne Loot-Aufnahme und ohne geöffnetes Panel lösen genau einen Schubs aus. Reihenfolge nach dem, was der Spieler noch nie getan hat:

1. nie gezaubert: „Sie schlagen nur. Es gibt auch Zauber." / „E." — Touch: „Der Zauberknopf."
2. nie gekocht: „Zutaten allein werden nichts." / „Zum Kessel. K." — Touch: „Rucksack, dann Kessel."
3. nie eine Kammer betreten: „Da draußen stehen verschlossene Türen." / „Schild lesen. F." — Touch: „Die Hand im Gürtel."

Prio 20, einmal **pro Wissenslücke** über die Lebenszeit (nicht pro Sitzung, nicht pro Schicht). Kein zweiter Schubs vor der nächsten echten Aktion; „echte Aktion" sind genau die drei Ereignisse, die den Timer zurücksetzen.

**Eskalation.** Gilt nur für Hinweise der Art `zustand`, weil nur dort die Bedingung nachprüfbar bestehen bleibt. Ist sie nach Ablauf des Zettels immer noch erfüllt, kommt genau einmal eine spitzere Variante B, zum Beispiel zu `beat3`: „Der Punkt liegt immer noch da." / „T." Danach zu diesem Thema nie wieder. Mehr als zwei Stufen gibt es nicht. Trag `varB` für `beat3`, `zutat3`, `hp30`, `tuer1`, `ult1` und `amt1` ein.

### Anti-Nerv-Regeln

* Globaler Cooldown 25 Sekunden zwischen zwei Dienstzetteln. Beats ausgenommen.
* Prio entscheidet Konflikte. Der Verlierer wird **verworfen**, nicht in eine Warteschlange gelegt: er feuert später von selbst neu, falls seine Bedingung dann noch gilt (bei `art: ereignis` bleibt sein Pending-Flag ja stehen).
* **Nachprüfung vor Anzeige:** bei `art: zustand` wird `wenn()` unmittelbar vor dem Einblenden erneut ausgewertet. Wer den Zauberpunkt während des Cooldowns schon ausgegeben hat, sieht den Hinweis nie. Bei `art: ereignis` und `gelatcht` entfällt die Nachprüfung, sonst gingen punktuelle Ereignisse verloren.
* **Sperrzonen für Dienstzettel:** ein Monster mit `m.aggro === true` näher als 220 Pixel (`sqDist < 48400`, kein `Math.hypot`); offenes Panel (Inventar, Zauberbaum, Kessel, Symbolschloss, `#overlay`); laufendes Rätselmodul; `boss && boss.aggro`.
* Budget: höchstens 3 Dienstzettel in den ersten 2 Minuten einer Sitzung. Beats zählen nicht mit.
* Auto-Ausblenden nach 6 Sekunden. Nie modal, das Spiel läuft immer weiter.
* **Verstummen:** sind alle einmaligen Hinweise inklusive ihrer Variante B durch und hat der Spieler gezaubert, gekocht und eine Kammer betreten, verstummt der Zettelkanal vollständig. Schweigen ist verdient.

**Wo gilt das alles.** Oberwelt (`currentLevel === 1`): alle Kanäle. Schattenland (`currentLevel === 2`): Zettelkanal schweigt ganz, Randnotizen laufen weiter, kein Nachschlagen. Kammer (`currentLevel === 3`): Zettel nur außerhalb eines laufenden Moduls, Randnotizen laufen, kein Nachschlagen. Die Weltfigur wird außerhalb der Oberwelt gar nicht gezeichnet.

### Randnotizen

Reine Charakterzeilen ohne Information. Pro Anlass mindestens 4 Zeilen, nie zweimal dieselbe hintereinander. Jede neu erfundene Zeile ist vor dem Einbau gegen Grundgesetz Regel 1 und den Zeichendeckel zu prüfen.

| Anlass | Hook | Zeilen |
|---|---|---|
| Crit | `hurtMon()`, an der vorhandenen 70ms-Bremse (~1555) | Vermerkt. · Das war unnötig laut. · Aktenzeichen folgt. · Ich habe nichts gesehen. |
| Ultimate | Ult-Auslösung | Konfetti. Die Reinigung kostet extra. · Das war Ihr Budget. · Ich war das nicht. · Bitte nicht nachmachen. |
| Level-Up | `levelUp` (~1644) | Aufstieg. Gehalt bleibt. · Gratuliere. Formlos. · Eine Stufe. Kein Titel. · Notiert, ohne Beförderung. |
| Kammer-Abbruch | siehe unten | Abbruch ohne Beute. Auch eine Entscheidung. · Rückzug ist zulässig. · Die Tür bleibt da. · Vermerkt als Rückzug. |
| Fluch angelegt | `recalc()`-Nachlauf | Kleingedrucktes gelesen? Nein. Nie. · Sie unterschreiben viel. · Steht alles drin. · Mutig. |
| Großer Goldfund | `player.gold +=` an ~2134 und ~3221 | Die Hälfte davon ist später meine. · Buchen Sie das ordentlich. · Kassenzeichen folgt. · Schöner Posten. |
| Untätigkeit | 25 Sekunden ohne echte Aktion | Sie stehen. Ich auch. Ich werde bezahlt. · Pause ist nicht beantragt. · Die Monster warten nicht ewig. · Ich notiere Stillstand. |

**Reihenfolge im Hook ist Pflicht:** zuerst der billige Zeitvergleich für Taktung und Cooldown, **erst danach** Pool-Auswahl und Textaufbau. `hurtMon()` ist ein echter Hot Path, in dem Flächenzauber jeden Treffer als Crit markieren; genau dafür gibt es dort schon die 70ms-Bremse. Keine zweite Zufallsziehung pro Treffer.

**Doppelung vermeiden:** Anlässe, für die es einen einmaligen Dienstzettel gibt (Level-Up, Fluch angelegt, Ultimate), lösen ihre Randnotiz erst **ab dem zweiten** Vorkommen aus.

**Untätigkeit und Steckenbleib schließen sich aus:** Randnotiz frühestens nach 25 Sekunden, Steckenbleib-Zettel nach 50. Läuft der Zettel, entfällt die Randnotiz.

**Kammer-Abbruch richtig einhängen.** `verlasseKammer()` ist **kein** Abbruch-Hook, sondern der einzige Ausstiegspfad überhaupt: er läuft auch beim regulären Ausgang nach geplünderter Truhe, beim Tod in der Kammer (`respawnPlayer()`) und bei `startShift()`. Häng den Zähler stattdessen an die beiden echten Abbruchpfade (Esc-Zweig ~4219 und `el('kamExitBtn').onclick` ~3111) und prüfe dort zusätzlich `!kammer.geleert` (das Feld existiert: Init `false` ~1993, gesetzt in `truheOeffnen()` ~2131). `respawnPlayer()` und `startShift()` bleiben ausdrücklich stumm.

### Zähler

Knöterichs Running Gag ist „Ich führe Buch". Schwellenzeilen statt Zufallszeilen, Tränke zum Beispiel bei 3, 7, 12, 20: „Ihr dritter Trank." · „Ihr siebter Trank. Ich führe Buch." · „Zwölf Tränke. Das ist ein Muster." · „Zwanzig. Ich habe eine Spalte angelegt."

**Alle Schwellen-Gags laufen ausschließlich über eigene, persistente Zähler in `sda_knoeterich_v1`**, sonst hält „feuert genau einmal" den nächsten Reload nicht aus. Bestandsaufnahme:

| Wert | Zustand | Verwendung |
|---|---|---|
| `stats.kills` (~1225, erhöht ~1577) | Sitzungszähler, kein Reset bei `startShift()`, **nicht** persistiert | nur für Sitzungs-Gags, nicht für Lebenszeit-Schwellen |
| `stats.goldTotal` (~1225) | **tot**, wird nirgends erhöht | nicht benutzen. Goldfund-Randnotiz hängt am Einzelbetrag in den beiden `player.gold +=`-Stellen |
| `shiftKillsByType`, `shiftKillsTotal` | pro Schicht, und nur befüllt bei `CONFIG.schichtModus === true` (~1578) | nur für schichtgebundene Zeilen |
| `amt.schichten` | persistent, wird **erst am Schichtende** erhöht (~4104) | laufende Schichtnummer ist `amt.schichten + 1` |

Neu anzulegen in `sda_knoeterich_v1`, alle über die Lebenszeit: `traenke`, `kammerAbbrueche`, `maxKillsSchicht` (beim Schichtende aus `shiftKillsTotal` fortgeschrieben), sowie die drei Wissenslücken-Flags `hatGezaubert`, `hatGekocht`, `hatKammerBetreten`. Hooks dafür: `drinkPotion()` (~1671), die beiden Kammer-Abbruchpfade, `endShift()`, der Zauber-Auslösepfad, der Braue-Pfad im Kessel, `betreteKammer()` (~1985).

**Schichtbegrüßung.** Zu Schichtbeginn eine Zeile mit der laufenden Nummer `amt.schichten + 1`, zum Beispiel „Dritte Schicht. Die Akte wird dick." Ein Rekordwert ist nur zulässig, wenn er aus `maxKillsSchicht` kommt; `amt` hat kein Rekordfeld. In der allerersten Schicht läuft Beat 1 statt einer Begrüßung. Diese Zeilen dürfen als einzige wiederholt feuern, einmal pro Schicht.

**Jahresgespräch** (Phase 4, alle 10 Schichten): Knöterich sagt genau einen Satz, „Ich habe alles mitgeschrieben." Der steht als statischer Text im Panel-HTML des Jahresgesprächs, hängt also nicht am Regler und nicht am Randnotiz-Kanal. Mehr als diesen Satz bekommt er dort nicht, sonst klaut er dem Bürgermeister die Szene.

**Taktung:** höchstens eine Randnotiz pro 40 Sekunden, nie gleichzeitig mit einem Dienstzettel, nie im Rätselmodul. Im Kampf und im Bosskampf ausdrücklich erlaubt, dort sind sie am komischsten.

**Regler.** Im Inventar unter „Ton" (dort stehen seit Phase 2 schon Musik und Lautstärke) ein Dreifach-Schalter **Knöterich: Gesprächig / Dienstlich / Schweigt**, Standard Gesprächig, Stellung überlebt den Reload.

* Gesprächig: alles.
* Dienstlich: alle Randnotizen aus, **außer** der Schichtbegrüßung.
* Schweigt: auch die Schichtbegrüßung aus.

**Dienstzettel laufen in jeder Stellung**, sonst kippt die Einführung weg. Weltfigur-Blase und die F-Wiederholung sind vom Regler ebenfalls unberührt.

### Nachschlagen

Neue Kontextaktion an der Weltfigur: `AKT_NACHFRAGE = 9` in der Konstantenzeile (`AKT_TUER` bis `AKT_GRUSS`, ~2475), Angebot in `scanAktion()` im `!kammer`-Zweig hinter dem `currentLevel !== 1`-Guard neben der `kammerTueren`-Schleife, Ausführung in `fuehreAktion()`. Text „Nachfragen".

Verhalten: zeigt den zuletzt gezeigten Dienstzettel, beim nächsten Druck den zweitletzten, dann den drittletzten, dann wieder von vorn. Wurde noch nie ein Zettel gezeigt, wird die Aktion gar nicht angeboten. Die Wiederholung ist spielerausgelöst und deshalb von Cooldown, Budget, Verstummen und Prio ausgenommen; sie startet den Cooldown auch nicht neu und respektiert nur die Sperrzone „offenes Panel". Angezeigt wird sie im Zettel-Layout.

Beachte den vorhandenen Kommentar über `CFX.gruss`: der Fluch Grußpflicht bietet `AKT_GRUSS` auf der Spielerposition an und gewinnt damit jeden Distanzvergleich. Steht ein ungegrüßtes Monster neben der Außenstelle, ist Knöterich kurz nicht ansprechbar. Das ist hinnehmbar und löst sich von selbst. **Bau die Grußpflicht dafür nicht um.**

### Technik

* Zwei Datentabellen, keine verstreuten `if`-Blöcke: `HINWEISE[]` mit `{id, prio, art, wenn(), z1, z2, z2t, varB}` und `RANDNOTIZ[anlass]` mit den Pools. Wie in Phase 1 gilt: Tabellen müssen vor ihrer ersten Verwendung stehen, sonst TDZ-Fehler.
* **Drei Auswertungsarten**, das ist der Kern der Zustandsmaschine:
  * `zustand` — `wenn()` ist ein Prädikat, wird geprüft und vor der Anzeige nachgeprüft. Kann eskalieren.
  * `ereignis` — der Auslöser ist punktuell. Er setzt am Ereignisort ein persistentes Pending-Flag; `wenn()` liest nur dieses Flag. Keine Nachprüfung, keine Eskalation.
  * `gelatcht` — wie `ereignis`, erscheint aber bewusst erst in der Folgeschicht, frühestens 5 Sekunden nach `state === 'play'`.
* Die `wenn()`-Closures entstehen einmal beim Tabellenbau, nie pro Frame (Regressionsschutz Punkt 4: Zeichenliste über den Pool, keine Closures pro Frame). Geprüft wird alle 15 Frames, nicht jeden Frame; Vorbild ist Punkt 8, die Minimap alle 4 Frames.
* **Ein DOM-Knoten je Bildschirmkanal** (Dienstzettel, Randnotiz). Die Blase ist Canvas, siehe oben. Text ausschließlich über die vorhandenen `setTxt` / `setHTML` / `setStyle` mit Dirty-Check. Niemals `innerHTML` pro Frame (Regressionsschutz Punkt 1). Ein- und Ausblenden per CSS-Transition, nicht per JS-Frame.
* **Geometrie hart vorgeben, das obere Band ist bereits belegt:** `#zone` oben links, `#minimap` oben rechts (128 px, mobil 88 px), `#bossbar` oben mittig (mobil bis `min(480px,86vw)`, `z-index:11`). Also: Zettel und Randnotiz zentriert, `top: 46px`, `max-width: min(420px, calc(100vw - 200px))`, `z-index: 12`. Ist `#bossbar` sichtbar, rutscht das Band auf `top: 78px`. Die Minimap bleibt in jedem Fall frei. Randnotizen sind im Bosskampf erlaubt, dieser Fall tritt also wirklich ein.
* `pointer-events:none` auf Zettel und Randnotiz.
* **Kein manuelles Wegdrücken per Esc.** In der Kammer bricht Esc den Besuch ab, außerhalb schließt es Panels. Der Konflikt darf nicht entstehen, das Auto-Ausblenden genügt.
* Persistenz in `localStorage` unter `sda_knoeterich_v1`: gesehene Hinweis-IDs, Pending-Flags, Eskalationsstände, die Lebenszeit-Zähler, die drei Wissenslücken-Flags, Reglerstellung. Wie die Kladde (`sda_kladde_v1`) **absolut todesimmun**: kein Schichtende, kein `startShift()`, kein `respawnPlayer()` und nichts aus Phase 4 darf sie anfassen. Einzige Ausnahme sind die Schichtbegrüßungen, die pro Schicht neu feuern. Laden wie bei `AMT_KEY` (~1888): vor der ersten Verwendung, in `try`/`catch`, defensiv gegen fehlende Felder.
* Die Zettel sind nicht anfassbar, der Touch-Watchdog braucht keine Erweiterung. Trotzdem gegenprüfen, dass kein neues Element ein Touch-Ziel verdeckt.

### Abnahme Phase 5

**Startbildschirm und Auftakt**
* Startbildschirm zeigt nur noch Titel, Untertitel, einen Satz mit Angriffseingabe und den Knopf.
* Alle drei Beats feuern in richtiger Reihenfolge, auch wenn der Spieler sofort wegläuft, und auf Touch mit der Touch-Fassung.
* Beats feuern je genau einmal über die Lebenszeit: Beat 3 auslösen, sterben, zweite Schicht starten, neu laden — er kommt nicht wieder.
* Beat 1 erscheint auch bei `CONFIG.schichtModus = false`.

**Hinweise**
* Jeder einmalige Hinweis feuert genau einmal und übersteht Reload, Tod, Schichtende und Amt-Besuch.
* `feierabend1` und `amt1` erscheinen tatsächlich, nämlich in der Folgeschicht, und nicht gar nicht.
* Cooldown, Budget (3 in 2 Minuten, Beats zählen nicht), Prioritäten, Nachprüfung vor Anzeige und alle vier Sperrzonen sind nachweisbar wirksam. Testszenario: Zauberpunkt im Zauberbaum während des Cooldowns ausgeben, der Hinweis erscheint nie.
* Steckenbleib-Schubs kommt nach 50 Sekunden genau einmal, in der Reihenfolge nie gezaubert vor nie gekocht vor nie Kammer, und pro Wissenslücke nur einmal.
* Eskalation zu Variante B kommt genau einmal und nur bei `art: zustand`.
* Zettelkanal verstummt nachweislich, wenn alles durch ist.

**Texte**
* Kein Text verrät Kesselgrammatik oder Fluch-Ableitung. Die komplette Tabelle wurde einzeln dagegen geprüft, das Ergebnis steht im Abschlussbericht.
* Zeichendeckel-Assertion läuft beim Start über alle Tabellen inklusive Touch-Fassungen, Beats und Templates mit ihrem längstmöglichen Wert, und ist grün.
* Kein Text enthält Gedankenstriche, Emojis oder Blut.
* Jeder tastenbehaftete Hinweis hat eine Touch-Fassung.

**Figur und Kanäle**
* Figur steht sichtbar neben dem Kessel, grau getönt, kein `ctx.filter`, verschwindet in Kammer und Schattenland, blockiert keinen Weg und bekommt keine Monster auf die Kachel.
* Blase erscheint am Spawn (97 Pixel Abstand liegen im 150-Pixel-Radius) und verschwindet beim Weggehen.
* Randnotizen halten 40 Sekunden Abstand, wiederholen keine Zeile direkt und laufen nie gleichzeitig mit einem Zettel.
* Zähler-Gags feuern an ihren Schwellen und überleben den Reload. Der Kammer-Abbruch-Zähler zählt **nicht** hoch, wenn die Truhe geplündert wurde, wenn der Spieler in der Kammer stirbt oder wenn eine Schicht startet.
* Kopf erscheint im Dienstbericht, nicht in Amt und Jahresgespräch. Im Jahresgespräch steht genau ein Satz.
* Regler wirkt in allen drei Stellungen unterschiedlich, Dienstzettel bleiben überall an, Stellung überlebt den Reload.
* `F` an der Außenstelle liefert die letzten 3 Zettel neuester zuerst, läuft danach um, wird ohne gezeigten Zettel nicht angeboten und kollidiert nicht mit `AKT_TUER` oder `AKT_GRUSS`.

**Regression**
* `CONFIG.schichtModus = false` bricht nichts: Knöterich läuft in beiden Modi, nur `feierabend1`, `amt1`, die Schichtbegrüßungen und die schichtgebundenen Zähler-Gags hängen am Schichtmodus.
* HUD ohne Leerschreibungen, keine Closures oder neuen Allokationen im Renderpfad, Caps unverändert, Tot-Guard und Sound-Bremsen unverändert, 300 Frames mit Zaubern und eingeblendeten Zetteln ohne Exception, lokal und live.

### Umsetzungsnotizen aus Phase 5

* Alles sitzt in einem Block ab `const KN_KEY = 'sda_knoeterich_v1'` (gleich nach `loadAmt()`/`saveAmt()`, vor `KAM_W`). Einzige Ausnahme: `KN_T`/`KN_POS` mussten vor `placeMonsters()` (das schon beim Laden einmal synchron läuft) direkt neben `KESSEL_T`/`KESSEL` stehen, sonst TDZ-Absturz beim ersten Aufruf. Wer die Figur verschiebt, muss `KN_T`/`KN_POS` dort anfassen, nicht im großen Block.
* Persistenz in `sda_knoeterich_v1`, geladen/gespeichert wie `sda_kladde_v1`/`sda_amt_v1`: `seen`, `pending`, `varB`, `escReady`, `counters`, `flags`, `wissensluecke`, `beats`, `regler`, `history`. Nichts davon wird von `startShift()`, `respawnPlayer()` oder `endShift()` zurückgesetzt. Einzige Ausnahme ist die Schichtbegrüßung, die als Laufzeitvariable (`knBegruessungPending`, nicht persistiert) pro `startShift()`-Aufruf neu gesetzt wird.
* **Geklärte Spec-Widersprüche:**
  * `amt1` steht in der Tabelle als `art: zustand`, der Fließtext nennt es aber im selben Atemzug mit `feierabend1` als "gelatcht". Umgesetzt als `zustand` (bleibt nachprüfbar und eskalierbar, siehe `ESCALATE_DEFS.amt1`), zusätzlich mit derselben 5-Sekunden-Sperre nach `state==='play'` wie `feierabend1` (`knPlayStartT`). Ohne diese Sperre könnte `amt1` schon in Frame 1 der Folgeschicht feuern, was dem Text "erscheint... frühestens 5 Sekunden nach state==='play'" widerspräche.
  * Die "Weltfigur-Blase" zeigt in dieser Umsetzung **ausschließlich Beat 1**, nie die Schichtbegrüßung. Der Satz "Steht kein Beat und keine Wiederholung an, zeigt die Blase nichts" ließ offen, ob die Schichtbegrüßung über Blase oder Randnotiz läuft. Entschieden für Randnotiz, weil der Regler-Absatz sie explizit als Ausnahme *unter den Randnotizen* nennt ("Dienstlich: alle Randnotizen aus, außer der Schichtbegrüßung"), und weil eine Randnotiz ohnehin schon "eine Zeile, kein Kopf" ist, was besser zu "Dritte Schicht. Die Akte wird dick." passt als eine ortsgebundene Sprechblase.
  * `beat3` ist kein Katalogeintrag, muss laut Text aber trotzdem eskalieren können. Eigene Tabelle `ESCALATE_DEFS` (statt zweiter Zeile in `HINWEISE`) deckt `beat3` zusätzlich zu den fünf genannten Katalog-IDs ab. Die Eskalations-Priorität von `beat3` ist eine Ermessensentscheidung (40, wie `ult1`), weil die Spec dafür keinen Wert nennt — nur die drei Auftakt-Beats selbst haben die feste Prio 100.
  * Varianten-B-Texte für `zutat3`, `hp30`, `tuer1`, `ult1`, `amt1` und `beat3` sind selbst formuliert (die Spec gibt nur `beat3`s Text als Beispiel vor: "Der Punkt liegt immer noch da." / "T."). Alle gegen Grundgesetz Regel 1 (keine Kesselgrammatik) und den Zeichendeckel geprüft, siehe `knAssertCaps()`.
  * "Ab dem zweiten Vorkommen" für die Randnotizen Level-Up/Fluch/Ultimate braucht eigene Lebenszeit-Zähler, die die Spec nicht explizit unter "Neu anzulegen" auflistet. Ergänzt: `kn.counters.levelUps`, `kn.counters.ultimates`, `kn.counters.fluchAngelegt`, zusätzlich zu den geforderten `traenke`, `kammerAbbrueche`, `maxKillsSchicht`.
  * "Großer Goldfund" hat keinen Schwellenwert in der Spec. Gesetzt auf `>= 60` Gold (roher Betrag vor Fluch/Wirkung-Multiplikatoren) an beiden `player.gold +=`-Stellen.
  * "Sichtweite" für `tuer1` ist als feste Distanz umgesetzt (`dist2 < 202500`, also 450 Pixel), nicht als echter Frustum-Test gegen `cam`. Grobe Näherung, spart eine zweite Sichtbarkeitsfunktion für einen einzigen Hinweis.
* **Nachschlagen (`AKT_NACHFRAGE=9`)** zeigt die letzten bis zu drei Dienstzettel aus `kn.history` (Cap 3, FIFO), neuester zuerst, zyklisch. Bypass von Cooldown/Budget/Prio/Verstummen, prüft nur die "offenes Panel"-Sperrzone, genau wie gefordert. Steht hinter dem `currentLevel !== 1`-Guard in `scanAktion()`, kollidiert nicht mit `AKT_TUER` (andere Position) oder `AKT_GRUSS` (Fluch Grußpflicht gewinnt bei Gleichstand ohnehin, siehe vorhandener Kommentar dort — bewusst nicht angefasst).
* **Sperrzonen/Cooldown/Budget** sitzen in `knSperrzone()`/`knEvaluateZettel()`. Die Kandidatenliste wird jeden 15. Frame neu gebaut (Vorbild: Minimap alle 4 Frames), die Blase und das Aus-/Einblenden selbst laufen jeden Frame, weil der 150-Pixel-Radius sofort reagieren muss.
* **Verstummen** (`knAllDone()`) prüft alle elf `HINWEISE`-IDs plus alle drei Beats plus die drei Wissenslücken-Flags. Eskalationsstände (`varB`/`escReady`) fließen nicht separat ein: ist ein Hinweis einmal `seen`, zählt er als erledigt, unabhängig davon, ob seine Variante B je fällig wurde (das kann bei `zustand`-Hinweisen ausbleiben, wenn die Bedingung nach Zettelende schon wieder falsch war — das ist beabsichtigtes, kein Bug).
* **Fluch-Erkennung** (`knCheckFluchEquipped()`) hängt an zwei Stellen: `equipItemFromBag()` (normaler Ausrüstungsweg) und `startShift()` (der Startfluch-Ausbau setzt `player.equip.weapon.fluch` direkt, ohne `equipItemFromBag()` zu durchlaufen). `unequipItem()` wurde bewusst **nicht** verdrahtet, weil Ausziehen keinen neuen Fluch anlegen kann.
* **Kammer-Abbruch-Zähler** hängt an einem neuen Wrapper `knAbbruchKammer()`, der vor `verlasseKammer()` läuft und nur bei `kammer && !kammer.geleert` zählt. `verlasseKammer()` selbst blieb unangetastet (läuft weiterhin auch bei Truhe, Tod und Schichtstart, dort absichtlich stumm).
* **Bewusst weggelassen:**
  * Kein eigener DOM-Knoten für die Schichtbegrüßung: sie läuft komplett über den vorhandenen `#knRandnotiz`-Kanal.
  * Keine Persistenz des `Nachfragen`-Zyklus-Zeigers (`knNfIdx`): startet bei jedem Neuladen wieder bei "neuester Zettel". Die Spec verlangt nur, dass `history` selbst über die Lebenszeit gilt (das tut sie), nicht der Lesekopf.
  * Kein Sonderfall für Touch beim Steckenbleib-Schub und den Wissenslücken-Texten über die normale `touchMode`-Verzweigung hinaus (gleiche Technik wie überall sonst im Katalog).
* **Fallen für spätere Arbeiten:**
  * `knTick(dt)` hängt in `update(dt)` direkt hinter `scanAktion(dt)`. Wer `update(dt)` früh verlässt (z. B. neue `state`-Werte), muss prüfen, ob `knTick` trotzdem noch laufen soll — aktuell läuft es nur, wenn `update(dt)` den `state !== 'play'`-Guard passiert.
  * `DRAW_ALTER` zeichnet nur, wenn `currentLevel === 1` (die Push-Stelle sitzt im selben `if(currentLevel === 1)`-Block wie `DRAW_KESSEL`). Ein künftiges "Dorf" oder ein zweiter Ort mit Kessel bräuchte eine explizite Sichtbarkeitsprüfung statt sich auf diese Verschachtelung zu verlassen.
  * `knAssertCaps()` deckt nur Texte, die im Skript selbst als Literal stehen. Wer neue Randnotiz- oder Hinweiszeilen ergänzt, muss sie in `knAssertCaps()` nachtragen, sonst prüft die Assertion sie nicht mit.

## Phase 6: Soundtrack — ERLEDIGT

Ersetzt die zwei prozeduralen Platzhaltertracks (ein Oberwelt-Loop, ein Metal-Loop für alles andere, per `setTimeout` getaktet) durch ein adaptives System nach Monkey-Island-Vorbild: **ein Motiv, sechs Arrangements.** Dieselbe Melodie wandert durch Modus, Tempo, Taktart und Instrumentierung und bleibt trotzdem als ein Thema erkennbar. Alles weiterhin zur Laufzeit synthetisiert, **0 Byte neue Assets.**

### Aufbau

Fünf Schichten, in dieser Reihenfolge im Code:

* **Bus-Graph** (`AC`, `master`, `compressor`, `toFx`, `lowpass`, `dry`/`reverbSend`/`delaySend`). Quellen laufen in `toFx`, von dort durch einen `lowpass` (das ist der Muffle-Regler für Panels), dann parallel in trocken/Hall/Delay. Hall ist ein `ConvolverNode` mit **im Code erzeugter** Impulsantwort (`makeImpulse()`, Rauschen mit Exponentialabfall), kein Sample. Neu gegenüber vorher: ein `DynamicsCompressorNode` zwischen `master` und `AC.destination`, fängt Übersteuerung ab, wenn in der Kammer Chor, Timpani, Lead und Bass gleichzeitig stehen.
* **Instrumente** (`pluck`, `harp`, `marimba`, `flute`, `bassoon`, `brass`, `choir`, `timpani`, `bassPatch`, plus die unbestimmten `noiseHit`/`shakerHit`/`snareHit`/`stampHit`). Jede Funktion synthetisiert einen einzelnen Ton zur Aufrufzeit, keine vorgebackenen Buffer.
* **Song-Daten** (`ZONES`). Pro Zone: `bpm`, `meter`, `lead`/`bass` als `[startStep, note, oct, lengthSteps]`-Listen auf einem 16tel-Raster (`STEPS_PER_BEAT = 4`), `chords` (eine Akkordfolge pro Takt), `perc`-Flags (`shakerEvery`, `snareOffbeat`, `timpaniDownbeat`, `choirPad`, `harpArpeggio`, `bassOstinatoEvery`, `stampAt`), `reverbSend`/`delaySend`/`droneLevel` pro Zone. `prepareZone()` baut daraus einmalig Lookup-Tabellen (`_leadByStep` etc.), läuft beim Laden über `Object.keys(ZONES).forEach`.
* **Scheduler**. Lookahead-Muster (25 ms Tick, 120 ms Horizont), plant über `AC.currentTime`, nicht über `setTimeout`-Wartezeiten. Das ersetzt den alten Takt, der über die Zeit hörbar driftete. Zonenwechsel werden nur an Taktgrenzen angewendet (`stepIdx % totalSteps === 0`), nie mitten im Takt.
* **`MUS`**, die einzige nach außen sichtbare Schnittstelle: `goto(zone)`, `layer(name, on)`, `sting(name)`, `swell()`, `duck(ms)`, `muffle(on)`, `setOvertime(f)`.

### Die sechs Zonen

| Zone | Takt/Modus | Tempo | Lead-Instrument | Auslöser |
|---|---|---|---|---|
| `overworld` | 4/4, A-dorisch | 112 | Pluck | `currentLevel === 1`, Standardfall |
| `shadowland` | 4/4, A-phrygisch (B→Bb) | 100 | Pluck | `currentLevel === 2` |
| `chamber` | 4/4, A-äolisch, Oktave tiefer | 76 | Marimba | `currentLevel === 3` |
| `village` | 3/4, F-Dur | 92 | Flöte | seit G5: `inVillage` im Musikblock (siehe unten) |
| `office` | 2/4, F-Dur-Marsch | 104 | Fagott | `showDorf()`, `showJahresgespraech()` |
| `boss` | 4/4, wie Kammer, Oktave tiefer | 140 | Blech | echter Schattenfürst-Kampf |

### Zonenwahl: kein Hook pro Übergangsstelle

`MUS.goto()` und `MUS.layer()` sind **idempotent**: `goto()` vergleicht gegen ein gemerktes `requestedZone`, `layer()` gegen `layerState[name]`, und brechen bei Gleichstand sofort ab, ohne die Audioparameter neu anzufassen. Deshalb genügt ein einziger Block in `update(dt)`, direkt hinter dem Schichtuhr-Block:

```js
const bossFight = !!(boss && !boss.dead && boss.aggro);
MUS.layer('kampf', bossFight);
MUS.goto(bossFight && currentLevel === 2 ? 'boss' : zoneForLevel(currentLevel));
MUS.layer('gefahr', !player.dead && player.hp < derived.maxHp*0.3);
MUS.setOvertime(...);
```

Läuft jeden Frame, kostet im Regelfall nur einen Stringvergleich. **`loadLevel2()`, `betreteKammer()`, `verlasseKammer()`, `respawnPlayer()`, `startShift()` mussten für die Zonenwahl selbst nicht angefasst werden** (sie ändern nur `currentLevel`, der Rest folgt automatisch). `zoneForLevel(level)`: 1 → `overworld`, 2 → `shadowland`, 3 → `chamber`.

**Boss-Bedingung bewusst nicht einfach `boss.aggro`:** der Alte Schrecken in einer Schatzkammer (Phase 2, `bossgeneric` ab Kammerschwierigkeit 5) setzt ebenfalls `boss`. Ohne das `currentLevel === 2` in der Bedingung würde ein Kammer-Wächter fälschlich den Boss-Track auslösen. Kammer-Bosse bleiben auf dem Kammer-Track, bekommen aber denselben `kampf`-Layer wie der echte Schattenfürst.

`update(dt)` läuft nur bei `state === 'play'`. Für Zonen außerhalb dieser Bedingung (Amt, Jahresgespräch) braucht es einen expliziten Aufruf, siehe unten.

### `village` ist fertig, seit G5 auch erreichbar

Die Zone liegt vollständig in `ZONES.village` und war zum Abschluss dieser Phase **von nirgends aufgerufen**, weil es kein begehbares Dorf gab, nur das Amt-Overlay (Phase 4/5). **Grafik-Phase G5 hat genau den einen vorgesehenen Aufruf nachgeliefert, ohne eine Note zu ändern:** der Musikblock in `update(dt)` bildet vor `zoneForLevel(currentLevel)` ein `inVillage` aus `currentLevel === 1 && !kammer && inVillagePx(player.x, player.y)` und wählt damit `'village'`. `zoneForLevel()` selbst blieb unangetastet, Kammer- und Schattenland-Vorrang laufen weiter über sie, der Boss-Zweig steht wie zuvor davor. Der Restposten aus dieser Phase ist damit erledigt.

### Panels: Muffle oder eigene Zone

An allen sieben `#ovPanel`-Stellen (siehe Phase 5) hängt jetzt `MUS.muffle(true)` beim Öffnen (`display = 'flex'`) und `MUS.muffle(false)` beim Schließen (`display = 'none'`): Lowpass auf 600 Hz, Hall-Send hochskaliert, klingt wie "von nebenan". **Ausnahme Amt und Jahresgespräch:** die bekommen statt Muffle den eigenen `office`-Track, klar und ungedämpft.

**Falle, die live auffiel:** `showDorf()` und `showJahresgespraech()` müssen `MUS.goto('office')` **und** `MUS.muffle(false)` aufrufen, in dieser Kombination. Kommt der Aufruf direkt nach einem gedämpften Dienstbericht (`endShift()` hatte `muffle(true)` gesetzt), bliebe der Muffle-Zustand sonst hängen und der Amtsmarsch klänge selbst gedämpft, obwohl er die aktuelle Szene ist, nicht der Nachhall einer vorherigen.

### Knöterich-Stinger

Drei Fagott-Töne über den laufenden Track, tonartgleich zur aktiven Zone (`MUS.sting()` transponiert über `z.tonic`/`z.scale`, nie hartcodierte Frequenzen). Varianten: `gespraechig` (fallend, an `knDisplayZettel()`), `dienstlich` (zwei gleiche Töne, ebenfalls `knDisplayZettel()`, abhängig von `kn.regler`), `spitz` (steigend, ausschließlich am echten Kammer-Abbruch in `knAbbruchKammer()`). Sting prüft selbst `muffled` (kein Sting bei offenem Panel) und `kn.regler !== 'schweigt'`. **Der Randnotiz-Kanal (`knShowRandLine()`) bekommt bewusst keinen Sting:** der feuert bis alle 40 Sekunden, ein Musik-Stinger dabei würde nach kurzer Zeit nerven. Nur die selteneren Dienstzettel und der Kammer-Abbruch bekommen ihn.

### Abnahme Phase 6

Alle sechs Zonen hörbar unterscheidbar und trotzdem als ein Thema erkennbar. Zonenwechsel folgt `currentLevel` ohne Schnitt mitten im Takt. Boss-Track läuft nur beim echten Schattenfürst, Kammer-Wächter bleiben auf dem Kammer-Track mit verstärkter Perkussion. Alle Panels dämpfen die laufende Musik, Amt und Jahresgespräch bekommen stattdessen den eigenen Marsch, klar und ungedämpft. Knöterich-Stinger transponiert korrekt in die jeweilige Zonentonart und schweigt bei Reglerstellung "Schweigt". `sfx.*` unverändert, kein bestehender Aufrufer angefasst. 300 Frames mit Zaubern und laufender Musik ohne Exception, lokal und live, alle sechs Zonen einzeln durchgehört.

### Umsetzungsnotizen aus Phase 6

* Ersetzt komplett den alten `// --- AUDIO SYSTEM ---`-Block. `sfx.*`-API zu 100 % unverändert (dieselben 13 Methoden, dieselben Parameter), kein einziger der 13 Aufrufer im Rest der Datei musste angefasst werden. `playTone()`s erster Parameter heißt jetzt `hz` statt `freq`, reine Namenskollision mit der neuen `freq(note, oct)`-Funktion, keine Verhaltensänderung.
* Die 70ms-Bremse auf Crit- und Sterbe-Sound (Regressionsschutz Punkt 9) sitzt in `hurtMon()`/`killMon()`, also außerhalb des Audio-Blocks, und blieb unangetastet.
* Notenraster ist `[startStep, note, oct, lengthSteps]` auf 16tel-Basis, kein Notenereignis für Pausen (die entstehen einfach als Lücke zwischen zwei Einträgen). Akkorde/Perkussion sind reine Flags in `perc`, `prepareZone()` expandiert sie einmalig zu absoluten Step-Listen (`everyN()`, `perBar()`), keine Berechnung pro Tick.
* Gain-Stellschrauben, falls Balance nicht passt: `musicVolTarget` (Default 0.45, deckt sich mit dem HTML-Slider), `sfxBus.gain` (0.22), `master.gain` (0.85, vor dem Compressor). Musik- und SFX-Pfad sind seit dieser Phase unabhängige Busse, vorher liefen beide durch dieselbe `masterGain`.
* `MUS.setOvertime(f)` koppelt an die Schichtuhr (`shiftEndPending`, `overtimeT`, `shiftT`): Tempo sinkt bis 14 % in der Überstunde, Lowpass-Cutoff sinkt parallel. Quantisiert auf 50 Stufen (`Math.round(f*50)/50`) gegen unnötige Automation-Events, da `update(dt)` das jeden Frame mit einem kontinuierlich wandernden Wert aufruft.
* Musik-Button und -Regler bleiben an denselben DOM-Ids (`#musicBtn`, `#musicVol`) im Inventar unter "Ton" (siehe Phase 2). Verhalten unverändert erhalten: Regler ziehen entmutet automatisch.
* Getestet live über `.claude/launch.json`-Testeintrag (temporär, wieder entfernt): alle sechs Zonen einzeln erzwungen (jedes Instrument dabei mindestens einmal ausgelöst), Boss-Auto-Wahl über Fake-Aggro bestätigt, alle drei Stinger, `swell()`, `muffle()` an/aus, Mute-Toggle, Lautstärkeregler, jeweils ohne Konsolenfehler. Zusätzlich der komplette Skriptinhalt einmal über `new Function(...)` geprüft (Syntaxcheck über die ganze Datei).

## Reihenfolge und Disziplin

1 bis 6, in dieser Reihenfolge. Nach jeder Phase spielbar, getestet, committet, gepusht, live verifiziert. Wenn eine Phase größer wird als gedacht, sag es und liefere sie halb, statt sie ganz zu liefern und dabei den Renderpfad zu zerlegen.

Am Ende jeder Phase: kurzer Bericht, was gebaut wurde, was bewusst weggelassen wurde, was noch offen ist.
