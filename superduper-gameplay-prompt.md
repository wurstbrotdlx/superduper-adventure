# SuperDuper Adventure, Gameplay-Umbau in 4 Phasen

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
* Dev-Server: `.claude/launch.json` (liegt eine Ebene höher, in `~/vibecodingprojekt/.claude/`), Eintrag `adventure`, Port 8378, URL `http://localhost:8378/adventure/index.html`
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

Nach jeder Phase gilt: Spiel startet, ist durchspielbar, 300 Frames mit Zaubern ohne Exception. Erst dann committen. Ein Commit pro Phase, aussagekräftige Message.

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
* Der Kessel ist über `K` überall bedienbar, nicht nur im Dorf: ein Dorf existiert im Code noch nicht. Am Spawn steht ein Kessel-Prop als Landmarke (`KESSEL`, `KESSEL_T`, `drawKessel()`, Zeichentyp `DRAW_KESSEL`). Phase 4 kann die Bedienung dort verankern.
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

## Phase 3: Fluch-Ökonomie

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

## Phase 4: Dienst nach Vorschrift

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

## Reihenfolge und Disziplin

1, dann 2, dann 3, dann 4. Nach jeder Phase spielbar, getestet, committet, gepusht, live verifiziert. Wenn eine Phase größer wird als gedacht, sag es und liefere sie halb, statt sie ganz zu liefern und dabei den Renderpfad zu zerlegen.

Am Ende jeder Phase: kurzer Bericht, was gebaut wurde, was bewusst weggelassen wurde, was noch offen ist.
