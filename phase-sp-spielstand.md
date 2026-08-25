## SP: Der Spielstand — ERLEDIGT

Bauabschnitt zu `SPEICHERFRAGE-2026-08-24.md`. Er beantwortet zwei Wünsche in einem Zug: **gerätebezogenes Speichern, wie es Spiele tun**, und **Export/Import für den Gerätewechsel**. Dazu räumt er die zwei Funde ab, die der Bericht vor allen Möglichkeiten gefunden hatte.

Kapitel 14 der Weltbibel kannte diesen Bauabschnitt nicht; er ist dort als SP hinter SZ4 ergänzt. Alle Bezeichner sind gegen den Stand nach `c4030bc` geprüft.

### Grundsatz: dieser eine Kasten redet Technik

Die Vorgabe war ausdrücklich: *„Das muss von der Sprache auch nicht in die Weltbibel passen. Das ist Technik. Die darf reale Wörter und Namen haben. Sonst geht das noch unter."*

Sie ist übernommen, und sie ist richtig. „Spielstand", „Speichern", „Export", „Import" heißen im Code wie auf den Knöpfen wörtlich so. Das ist die **einzige** bewusste Ausnahme vom Ton des Hauses, und sie ist eine Entscheidung und keine Nachlässigkeit: eine Datensicherung, die sich „Antrag auf Beglaubigung einer Aktenabschrift" nennt, findet im Zweifel niemand, und wer sie nicht findet, verliert seinen Fortschritt an einen Witz. Kapitel 1 verlangt Amtsdeutsch für die Welt; die Speicherverwaltung ist nicht die Welt, sie ist das Gerät, auf dem die Welt läuft. Der Gag steht überall sonst.

Praktische Folge: Wer künftig hier etwas ergänzt, hält sich an dieselbe Regel. Ein Witz in dieser Ecke ist ein Fehler, kein Zuwachs.

### Der Fund, der alles Weitere trägt: die Welt ist dieselbe

`SPEICHERFRAGE-2026-08-24.md` behauptete in zwei Abschnitten, die Welt werde je Sitzung neu gewürfelt, und leitete daraus ab, eine Schichtkonserve sei ein Systembau. **Das war falsch, und der Bericht ist an dieser Stelle berichtigt.**

`genMap()` zieht nicht aus `Math.random()`, sondern aus `rng = mulberry32(20260805)` — einem festen Seed — und läuft genau einmal beim Skriptstart. Gemessen über zwei Ladevorgänge:

| Größe | Lauf 1 | Lauf 2 |
|---|---|---|
| Kartenhash (FNV über `map`) | `cc065f3` | `cc065f3` |
| Bäume | 8019 | 8019 |
| Deko | 2006 | 2006 |
| Koppel | 150,134,159,140 | 150,134,159,140 |

Damit ist der teuerste Posten der Wiedervorlage ersatzlos entfallen: **eine gespeicherte Position zeigt beim nächsten Start auf dieselbe Kachel.** Kein Seed muss eingebaut, keine Karte mitkonserviert werden. Aus dem angekündigten Systembau wurde ein Anbau.

Die Lehre ist die dritte Mitarbeitsregel, angewandt auf einen eigenen Bericht: verifiziert wird im Browser, nicht im Kopf. Der Bericht war acht Stunden alt und an dieser Stelle trotzdem falsch, weil niemand `rng()` nachgeschlagen hatte.

### SP1: zwei Stempel, geschrieben und nie geladen

`amt.stopfenSchicht` und `amt.adressSchicht` (SZ3) standen in `saveAmt()` und in **keiner** Ladezeile. Nach jedem Neuladen 0 — und der nächste `saveAmt()` schrieb die 0 in die Ablage zurück. Der Wert war damit zerstört, nicht bloß ignoriert. Derselbe Mechanismus, den GW26b als Aufräumhilfe beschreibt („ein alter Stand mit dem Feld wird schlicht nicht mehr gelesen; saveAmt() schreibt amt komplett neu"), fraß hier zwei Felder, die leben sollten.

Die Folge war der Gegenspieler des Hauptvorgangs. Beide Wege in `vorblattFaellig()` lesen genau diese Stempel, und beide Setzer sind **verbrauchte Einmalpfade**: `stopfenGezogenEnde()` läuft nach dem fertigen Strang nie wieder, `findeAdresszeile(4)` gibt nach dem Fund nie wieder `true`. Wer im Fenster zwischen Stopfen (bzw. vierter Adresszeile) und Szene 6 den Browser schloss — mindestens zwei Schichten zu je 25 Minuten —, bekam Szene 6 nie, damit `kn.flags.szeneVorblatt` nie, damit Vorblatt nie im Dorf (`daWenn`) und die Versuchung aus SZ4 nie.

Behoben mit zwei Ladezeilen und `stempelGeklemmt()`, beidseitig nach der GW3/W10-Lehre. `STEMPEL_DECKEL = 9999` ist wie `WIEDER_STAND_DECKEL` keine Balance-Zahl, sondern die Zusage des Kommentars: 0 heißt „nie", alles darüber ist eine Schichtnummer.

**Warum es nie aufgefallen ist,** ist der eigentliche Fund: kein Prüfer des Hauses sieht diesen Weg. Jeder Guard vor diesem prüft Zusagen im laufenden Skript, und jede Prüfschleife lädt die Seite **einmal**. Ein Feld, das geschrieben und nie geladen wird, sieht in einem einzigen Lauf vollkommen gesund aus. Dieser Fehler braucht zwei Ladevorgänge, um sichtbar zu werden — deshalb ist `tools/speicher-pruef.mjs` das erste Werkzeug des Hauses, das neu lädt.

#### Die Heilung der Bestände

`stempelMigration()` zieht den Stempel aus der Kladde nach, wenn die Tat dort steht und der Stempel 0 ist. Die Kladde ist die Wahrheitsquelle, weil sie sich immer selbst gespeichert hat. Gesetzt wird **nicht** die Schicht von damals (die weiß niemand mehr, genau das sagt der Kommentar am Feld), sondern die nächste: der Wagen kommt später als erzählt, aber er kommt. Ohne sie bliebe jeder Bestand, der im Fenster geschlossen wurde, dauerhaft ohne Gegenspieler.

Die Nebenwirkung ist benannt statt verschwiegen: `postregenLaeuft()` hängt am selben Stempel, im Dorf fallen also drei Schichten lang noch einmal Blätter. Das ist der Preis dafür, dass der Strang überhaupt wieder ankommt.

**Fund beim Bau:** Die Migration stand zuerst bei `auftragMigration()` und lief prompt in die TDZ-Falle, vor der das README warnt — sie liest `langFertig()`, und das ist 600 Zeilen weiter unten deklariert. Jetzt steht sie direkt hinter `langLaeuft()`. Der Kommentar sagt, warum, damit sie niemand „aufräumt".

### SP2: der Übertrag war keine Akte

`pendingCarryGold` und `pendingCarryPouch` waren Laufzeitvariablen, und `startGame()` nullte sie bei **jedem** Seitenaufruf — also auch bei dem, der die Nacht beendete. Der Weg vom Feierabend zum nächsten Antritt führt über Dienstbericht, Jahresgespräch und Dorf mit seinen Ausbauten; das ist genau der Bildschirm, auf dem ein Abend endet.

Die Größenordnung ist keine Fußnote: der Gürtel trägt die halbe Bruttobeute, und im eingeschwungenen Zustand gilt `carry = beute` (`KAMMER-MESSUNG-2026-08-20.md`, Abschnitt 4) — also eine **volle Schichtbeute**, dazu das nach Seltenheit absteigend gefüllte Zutatenkontingent. Der Dienstbericht druckte derweil „X mitgenommen".

Der Widerspruch stand im Haus selbst: W10 hat den bewilligten Antrag im **selben Panel** genau deshalb persistiert — *„ein Neuladen zwischen Dienstbericht und nächster Schicht dürfte den bezahlten Antrag nicht verschlucken. Ein bewilligter Antrag ist ein Aktenvorgang, und Aktenvorgänge überleben die Nacht."* Abgerechnetes Gold ist einer.

Ersetzt durch `amt.uebertrag` — **eine** Wahrheit statt zweier, keine Laufzeitvariable daneben. `endShift()` schreibt den schon gekappten Übertrag (nicht die Bruttobeute: was dort steht, ist genau das, was der Bericht als „mitgenommen" druckt), `startShift()` löst ein und leert im selben Zug, `saveAmt()` genau dann, wenn wirklich einer vorlag. Bauform wie `amt.wiedereinsetzung`. Die Nullung in `startGame()` ist ersatzlos entfallen — sie war der Verlust.

### SP3: der Spielstand

Neuer Schlüssel `sda_spielstand_v1`, der vierte des Spiels.

**Was drinsteht:** Stufe, Erfahrung, Leben, Mana, Gold, Tränke, Skillung, Skill- und Zauberpunkte, gelernte Zauber, Frisur und Haarton, Position, Beutel, Tasche, Ausrüstung — dazu die Schicht: Uhr, Überstunden, Kills nach Typ, Auftragsstand samt seinen zwei Merkern und `langSchicht`.

**Und die Zulagen aus K1.** Der Bauabschnitt ist während dieser Arbeit auf `main` gelandet und hängt drei Felder an die Schicht (`zulagenKartei`, `zulagenZiehungen`, `zulagenAngebot`). Sein Kommentar sagt „nichts davon geht nach localStorage", und das stimmte, bis es diesen Schlüssel gab — der Spielstand bricht die Zusage nicht, er speichert die **Schicht** und nicht die Akte, und für die gilt Kapitel 5 unverändert: mit dem Dienstschluss ist die Mappe weg. Ein Fortsetzen ohne Dienstmappe wäre kein Fortsetzen.

Eingelegt wird beim Einlösen über **`zulageAnlegen()`** und nicht über ein gesetztes `angelegt:true`. Fachzahl (`zulageSlots`), Stapelgrenze (`ZULAGE_STAPEL_MAX`) und die Regel „eine je Sache" stehen dort, und sie hier abzuschreiben wäre die F1-Falle. Der Nebeneffekt ist die beste Klemme, die dieser Abschnitt hat, weil sie nichts kostet: ein manipulierter Stand mit zehn eingelegten Karten bekommt genau so viele, wie die Mappe auf dieser Stufe fasst — gemessen bei Stufe 3 genau eine. Ebenso zieht `zulagenAngebotSicherstellen()` eine Vorlage nach, falls ein Stand offene Ziehungen ohne Angebot trägt; im regulären Spiel gibt es diesen Zustand nicht, ein von Hand gesetzter Stand könnte ihn tragen, und er verschluckte sonst die Aufstiege.

**Was ausdrücklich nicht drinsteht:** Monster, Beute am Boden, Geschosse, Leichen, Partikel. Die kommen bei `placeMonsters()` ohnehin neu, und sie einzufrieren hieße, den Kampfzustand zu konservieren — dann wäre Speichern vor einer Truhe ein Werkzeug statt einer Unterbrechung. Der Spielstand hält den Menschen, die Uhr und den Auftrag fest, nicht die Sekunde.

**Wann geschrieben wird:** bei `visibilitychange` auf `hidden` und bei `pagehide` — ausdrücklich **nicht** bei `beforeunload`, der auf dem Telefon praktisch wertlos ist. Genau diese beiden feuern dort zuverlässig, und sie sind der Moment, den ein Anruf auslöst. Dazu der Knopf **Speichern** im Inventar.

**Das Tor** (`spielstandErlaubt()`) ist bewusst eng, und jede Bedingung hat einen Grund: nur im Dienst, nur im laufenden Spiel (das schließt Szenen aus, die setzen `state='szene'`), nicht in einer Kammer und nicht im Schattenland (beide werden eigens erzeugt und stehen nicht im Spielstand), nicht tot, und nicht in den Überstunden — dort läuft die Schicht schon aus, und ein Spielstand mit abgelaufener Uhr wäre ein Fortsetzen in den sofortigen Feierabend. Wer trotzdem drückt, bekommt über `speicherGrund()` den Grund gesagt, der auf ihn zutrifft. Eine Meldung „ging nicht" ohne Grund wäre die Tapete, vor der G6 warnt.

**Die Frischeprüfung** ist der Kern der Richtigkeit: der Spielstand trägt `amt.schichten` von seiner Entstehung. Stimmt die Zahl nicht mehr, ist die Schicht inzwischen abgerechnet worden, und Fortsetzen wäre eine **zweite Abrechnung derselben Schicht**. `spielstandLesen()` verwirft ihn dann. Zusätzlich löschen `startShift()` und `endShift()` ihn, damit in der Ablage nichts steht, was nicht mehr gilt.

**Eingelöst wird über `startShift()`**, nicht daran vorbei. Der Gameplay-Prompt nennt ihn den einzigen Reset-Pfad, „ein getesteter Pfad statt zweier": erst die Schicht regulär aufbauen (Welt, Monster, Weltgarantie-Kontingente, Aushang), dann den Menschen und die Uhr darüberlegen. Deshalb liest `spielstandEinloesen()` den Stand, **bevor** es `startShift()` ruft — das löscht ihn mit.

**Die Klemmen** folgen der P1-Lehre („gegen die Tabelle geprüft, nicht nur auf Typ"). `itemGeklemmt()` baut jedes Ausrüstungsstück neu auf, statt das gelesene Objekt durchzureichen, prüft Wirkung und Fluch gegen `WIRKUNG` und `FLUCH`, verwirft unbekannte Affixe und klemmt jede Zahl gegen `SPIEL_DECKEL`. Und `SPIEL_DECKEL` wird aus `BASES`, `CRAFT_BASE` und `AFFIXES` **gerechnet**, nicht gesetzt: was das Spiel selbst erzeugen kann, ist die Obergrenze. Wächst eine Tabelle, wächst der Deckel mit — die F1-Falle ist hier vermieden statt beschrieben. Gelernte Zauber werden gegen `SPELLS` gefiltert, ein Schild im Stiefelfach fällt raus, und eine Position, deren Kachel `walkT()` nicht kennt, fällt auf `SPAWN` zurück, statt den Spieler festzusetzen.

Was die Klemmen **nicht** leisten, steht am Deckel: sie klemmen die Zahl, sie beweisen nicht ihre Herkunft. Wer den Stand von Hand schreibt, darf sich bis an den Deckel beschenken. Das ist derselbe Stand wie bei `amt.bankGold` und hier zum ersten Mal aufgeschrieben statt stillschweigend angenommen — die W10-Lehre lautet, keine Sicherheit zu behaupten, die man nicht hat.

### Export und Import

Die Ablage ist kündbar: Browserdaten löschen nimmt alles mit, ein Gerätewechsel nimmt nichts mit, und der Speicher hängt an der **Origin** — `localhost:8378` und die ausgelieferte Seite sind zwei verschiedene Ablagen. Dagegen hilft nur, dass der Spieler seinen Stand in die Hand bekommt.

**Export** legt alle vier Schlüssel in eine JSON-Datei mit sprechendem Namen (`monstralministerium-2026-08-24-schicht5.json`), über Blob und `<a download>` — das läuft auch im `file://`-Build. Eine laufende Schicht wird vorher gesichert und kommt mit.

**Import** prüft ausdrücklich **nicht** die Inhalte. Er prüft die Hülle (Kennung, Datenfach, jeder Wert für sich gültiges JSON), schreibt die bekannten Schlüssel, entfernt die, die in der Datei fehlten (sonst mischte sich der alte Stand unter den neuen), und lädt die Seite neu. Erst dadurch laufen `loadAmt()`, `loadKladde()`, `loadKn()` und `spielstandLesen()` mit ihren Whitelists und Klemmen darüber. **Eine zweite Prüfung hier wäre eine zweite Wahrheit** — das ist derselbe Grundsatz, aus dem `wiederStandGeklemmt()` eine einzige Klemmstelle ist.

Der Rückgabewert von `importText()` ist eine Meldung und kein Wahrheitswert: der Import ist die eine Stelle, an der jemand wissen muss, **warum** es nicht ging.

### Der Guard: `speicherAssert()`, einundzwanzigster

Bauform wie `goldAssert()`: spiegelt alles, was er anfasst (den rohen Ablagewert, `state`, `amt.schichten`, `player.dead`, `kammer`, `currentLevel`, `shiftEndPending`, `szeneAktiv`), stellt es im `finally` zurück, wirft nie, meldet nur. Sechs Abschnitte:

1. **Das Tor**, jede Bedingung einzeln gesetzt und einzeln wieder gelöst — ein Tor, das immer offen ist, ist keins.
2. **Der Rundweg** durch die Ablage: ein von Hand gebauter Stand muss unverändert zurückkommen.
3. **Die Frische**: derselbe Stand eine Schicht weiter muss weg sein, ebenso einer mit fremder Versionsnummer.
4. **Die Klemmen**: ein aufgeblasenes Stück fällt auf das zurück, was das Spiel selbst erzeugen könnte; Unsinn wird gar nicht erst zu einem Gegenstand.
5. **Export und Import**: die Hülle hält, und Fremdes prallt ab.
6. **Die Schlüsselliste**: jeder Schlüssel, den das Spiel beschreibt, steht im Export — sonst wandert beim Gerätewechsel ein Teil nicht mit, und das merkt niemand, bis es zu spät ist.

Er ist der erste Guard des Hauses, der nicht das laufende Skript prüft, sondern den Weg durch die Ablage. Hätte es ihn gegeben, wäre SP1 nie entstanden.

### Prüfprotokoll

`tools/speicher-pruef.mjs`, **34 Prüfungen, alle bestanden**, und als einziges Werkzeug des Hauses über zwei Ladevorgänge — genau daran war SP1 unsichtbar.

Gemessen: Karte über Sitzungen identisch · beide Stempel überleben Neustart und den nächsten `saveAmt()` · `vorblattFaellig()` in Akt IV wieder `true` · Stempel klemmen beidseitig (999999 → 9999, −5 → 0) · Übertrag steht nach dem Dienstschluss in der Akte, überlebt das Schließen und wird genau einmal eingelöst · eine unterbrochene Schicht kommt vollständig zurück (Stufe 9, XP 55, Gold 777, Skillung, Beutel, Tasche samt Affix-Tabellenbezug, Position auf den Pixel, HP 42, Mana 11, Uhr 813 s, Kills 6, Auftragsstand 3) · unbekannte Zauber fallen raus · Tor in Kammer und Tod zu · Dienstschluss verbraucht den Stand · Export trägt die Kennung und alle vier Schlüssel · nach `localStorage.clear()` holt der Import alles zurück, inklusive der fortsetzbaren Schicht · Import lehnt drei Sorten Fremdes ab · Konsole still.

Dazu die Zulagen-Verzahnung: die Dienstmappe fährt mit (Kartei, eingelegte Karte, ausliegendes Angebot), und zehn eingelegte Karten auf Stufe 3 ergeben genau ein belegtes Fach, während Stufe 9 auf 3 klemmt und eine unbekannte Familie ganz herausfällt.

Nach dem Merge von `main` (K1) noch einmal vollständig gefahren, mit ausgewerteten Exit-Codes: `speicher-pruef` 34, `zulagen-pruef` 45, `stopfen-pruef` 43, `langvorgang-pruef` 58, `szene-pruef` 48, `versuchung-pruef` 67, `reich-pruef` 59, `ebene-pruef` 54, `menue-pruef` 39, `gespraech-pruef` 89, `empfang-pruef` 59 — **595 Prüfungen, alle Exit-Codes 0**. Zweiundzwanzig Guard-Zeilen in der Konsole (nachgezählt, nicht geschätzt: K1 und SP bringen je eine dazu), keine Pageerrors. Einzeldatei-Build gebaut und per `file://` geladen: still, und `localStorage` ist dort nutzbar.

*Notiert, weil es sonst als Tapete durchginge:* Im ersten Sammellauf meldete `ebene-pruef` 53 von 54. Fünf Einzelläufe danach ergaben 54 von 54, und SP fasst nichts an, was M4 prüft — der Fehlschlag kam aus der Ressourcenkonkurrenz von elf Browserstarts in Folge, nicht aus dem Code. Er steht hier statt zu verschwinden, weil die nächste Person ihn sonst für neu hält.

### Bewusst offen

* **Die Kammer speichert nicht.** Wer in einem Rätselraum unterbrochen wird, verliert die Schicht wie bisher — kein Rückschritt, aber auch kein Fortschritt. Eine Kammerkonserve wäre ein eigener Bauabschnitt (Raum, Uhr, Schloss, zweite Ebene aus M4), und sie berührt die Schichtabrechnung aus `KAMMER-MESSUNG`.
* **Kein `navigator.storage.persist()`.** Eine Zeile, die den Browser bittet, den Speicher nicht bei Platzdruck wegzuräumen. Sie gehört in dieselbe Ecke, ist aber eine eigene Entscheidung: Firefox fragt den Nutzer, und ein Berechtigungsdialog beim Spielstart ist nichts, was nebenbei eingebaut wird.
* **Keine Ablage-Meldung im Privatmodus.** Alle Zugriffe schlucken ihr Scheitern weiterhin. Die Meldezeile im Inventar sagt es beim Speichern, aber nicht ungefragt beim Start. Vorschlag 4.3 des Berichts bleibt offen.
* **Kein Löschknopf.** Wer neu anfangen will, importiert einen alten Stand oder löscht die Browserdaten. Ein „Alles löschen" im Inventar wäre klein, aber es ist nicht gefragt worden, und ein Knopf, der alles vernichtet, wird nicht nebenbei eingebaut.
* **Mehrere Spielstände** (Vorschlag 4.4) bleiben unangetastet.
