# SuperDuper Adventure, Soll-Ist-Abgleich

Prüfauftrag, kein Umbauauftrag. **Du änderst in diesem Durchgang keine Zeile Code und keine Zeile Plan.** Am Ende steht ein Bericht, sonst nichts. Wenn du etwas reparieren willst, schreibst du es als Vorschlag in den Bericht und wartest auf Freigabe.

## Auftakt für eine frische Session

> Lies superduper-abgleich-prompt.md in `~/vibecodingprojekt/adventure/`. Führe den Abgleich vollständig aus. Nichts ändern, nur berichten.

Modell: `/model opus`, ausdrücklich **nicht** `opusplan`. Bei `opusplan` läuft Opus nur im Plan-Modus und die Ausführung fällt auf Sonnet zurück. Beim Abgleich ist aber die Ausführung die eigentliche Denkarbeit: Code lesen, gegen den Plan halten, stillschweigende Abweichungen finden. Genau dieser Teil darf nicht auf dem schwächeren Modell landen. Plan-Modus ist überflüssig, weil die Session ohnehin nichts schreibt.

## Kontext

Repo: `~/vibecodingprojekt/adventure/`, `wurstbrotdlx/superduper-adventure`, Branch `main`, GitHub Pages über die Actions-Pipeline (seit F9, s. `.github/workflows/pages.yml`). Der Code liegt in `index.html` (HTML und CSS) plus sieben Skriptdateien in `skript/01..07` (rund 25 000 Zeilen JavaScript, geladen in der Reihenfolge ihrer Tags). Build-Ausgabe in `dist/`, Werkzeuge in `tools/`, Bildmaterial in `assets/` und `Graphics/`.

Plandokumente, die als Soll gelten:

* `superduper-gameplay-prompt.md` — Phasen 1 bis 6, jeweils mit Abnahmekriterien und Umsetzungsnotizen
* `superduper-grafik-prompt.md` — Phasen G0 bis G5, gleiche Struktur
* `superduper-weltbibel.md` — Fiktion, Ensemble, Rangsystem, Humor-Grundgesetz, Prüfliste für neue Texte
* `phase-w1-terminologie.md`, `phase-w2-aktenfunde.md`, `blaetter-serie-a-b.md` — die Welt-Phasen W1 folgende
* `~/vibecodingprojekt/knoeterich-phase5.md` — liegt eine Ebene höher, ältere Fassung, kann vom Repo-Stand abweichen

Achtung Namenskollision: **Phase 5 (Gameplay, Knöterich)** und **Phase G5 (Grafik, Dorf/UI)** sind zwei verschiedene Dinge. Halte sie im Bericht sauber auseinander.

## Was du prüfst

### 1. Git-Hygiene

* Gibt es uncommittete Änderungen? Wenn ja: welche Datei, welcher Umfang, zu welcher Phase gehören sie erkennbar, sind sie ein halbfertiger Stand oder etwas Fertiges, das nur nicht committet wurde?
* Ist `main` mit `origin/main` synchron, oder liegen lokale Commits ungepusht herum?
* Gibt es untracked Dateien, die eigentlich ins Repo gehören (oder umgekehrt: Müll, der versehentlich drin liegt)?
* Passt jede Commit-Message zu dem, was der Commit tatsächlich enthält? Stichprobe über die letzten 15 Commits genügt, aber nenne Ausreißer namentlich.
* Ein Commit pro Phase war die Regel. Wo wurde davon abgewichen und warum erkennbar?

### 2. Phasenstand: Plan gegen Code

Für **jede** Phase aus allen drei Plandokumenten:

* Ist sie im Plan als ERLEDIGT markiert?
* Existiert der zugehörige Code wirklich in den `skript/`-Dateien? Beleg über Bezeichner, nicht über Zeilennummern (die verschieben sich, und seit der Teilung erst recht).
* Stimmen Kopfzeilen-Marker und Realität überein? Sowohl „steht ERLEDIGT, ist aber nicht drin" als auch „ist längst drin, steht aber nicht dran" sind Funde.

Ergebnis als Tabelle: Phase, Marker im Plan, Code vorhanden ja/nein, Commit, Urteil.

### 3. Abnahmekriterien einzeln

Jede Phase hat einen Abschnitt „Abnahme Phase N". Geh die Punkte **einzeln** durch und belege am Code, ob sie erfüllt sind. Nicht überfliegen, nicht bündeln, nicht auf die Umsetzungsnotizen vertrauen: die sind Selbstauskunft, du prüfst die Sache selbst.

Wo ein Kriterium nur im laufenden Spiel prüfbar ist (Timing, Sichtbarkeit, Hörbarkeit), sag das ausdrücklich und markiere es als **ungeprüft, laufzeitgebunden** statt es stillschweigend als erfüllt zu zählen.

### 4. Regressionsschutz

Der Block „Regressionsschutz: das hier NICHT kaputtmachen" steht in beiden großen Plandateien. Prüfe jeden Punkt gegen den aktuellen Code:

* HUD-Schreibungen nur über `setTxt`/`setHTML`/`setStyle` mit Dirty-Check, kein `innerHTML` pro Frame
* Touch-Handler am `window`, `.beltSlot`-Regel, Frame-Watchdog deckt alle Drag-Ziele ab
* kein `Math.hypot` in Hot Paths
* Zeichenliste über den Pool mit Typ-Tags, keine Closures und keine Allokationen im Renderpfad
* Caps 900 Partikel, 70 Floater
* Tot-Guard in `hurtMon()`
* Sprite-Framezahlen hart im Code, nicht aus Dateinamen abgeleitet
* Minimap einmal gebacken, Blit alle 4 Frames
* 70ms-Bremse auf Crit- und Sterbe-Sound
* kein `ctx.filter`, Tönung ausschließlich über `tintedSheet()`

Bei jedem Punkt: eingehalten, verletzt, oder aufgeweicht. Bei „verletzt" die Fundstelle als Bezeichner plus Datei nennen (`DORF_FIGUREN` in `skript/02-dorf-und-welt.js`), nicht als Zeilennummer.

### 5. Abweichungen zwischen Plan und Umsetzung

Das ist der eigentliche Kern. Drei Sorten, und sie gehören getrennt berichtet:

* **Bewusst anders gemacht.** Steht als solches in den Umsetzungsnotizen. Prüfe: ist die Begründung tragfähig, und stimmt sie noch nach den Folgephasen?
* **Stillschweigend anders gemacht.** Code weicht vom Plan ab, ohne dass eine Notiz das erwähnt. Das sind die teuren Funde, such gezielt danach.
* **Übergangen.** Im Plan gefordert, im Code nicht auffindbar, in keiner Notiz erwähnt.

### 6. Bekannte offene Punkte einsammeln

Die Plandateien nennen selbst mehrere Stellen als offen oder fehlerhaft. Prüfe, ob sie noch offen sind, und liste sie zentral. Mindestens diese, ohne dich darauf zu beschränken:

* Phase 4: der Jahresbonus „Dienstsiegel" schreibt in `CONFIG.kammerNachwachsen`, aber `saveAmt()` serialisiert nur `amt`. Überlebt den Reload nicht.
* Phase 4: `stats.goldTotal` ist deklariert, wird aber nirgends erhöht.
* Phase 4: die Ausbau-Kosten in `AUSBAU_DEFS` sind eine Schätzung, keine durchgespielte Zahl.
* Phase 6: `ZONES.village` ist fertig komponiert, wird aber von nirgends aufgerufen. Prüfe, ob das nach G5 (Dorf) noch stimmt.
* Phase 5: `knAssertCaps()` deckt nur Literale im Skript. Prüfe, ob seither Texte dazugekommen sind, die dort fehlen.

Prüfe außerdem die Weltbibel-Prüfliste für Texte gegen alle im Spiel sichtbaren Zeichenketten: keine Gedankenstriche, keine Emojis in Knöterich-Texten, kein Blut, keine Preisgabe der Kesselgrammatik.

### 7. Querstand der Phasen untereinander

Spätere Phasen haben frühere Annahmen überholt. Prüfe gezielt:

* Phase 5 und Phase 6 setzen beide voraus, dass es **kein begehbares Dorf** gibt. G5 baut eines. Was daran hängt jetzt schief: `DRAW_ALTER` zeichnet nur bei `currentLevel === 1` im selben Block wie `DRAW_KESSEL`, `MUS.goto('village')` existiert ohne Aufrufer, das Amt ist als Overlay gebaut und bekommt in G5 ein Gebäude.
* Phase 1 bis 3 nennen Zahlen (21 Substantive, 26 Adjektive, 24 Wirkungen, 24 Flüche). Stimmen die Tabellenlängen im Code noch?
* W1 hat Terminologie umbenannt. Sind alle Stellen mitgezogen, oder stehen alte und neue Begriffe nebeneinander?
* Die Reihenfolge-Regel aus Phase 1 (Tabellen vor erster Verwendung, sonst TDZ) gilt weiter. Wurde bei späteren Einfügungen dagegen verstoßen?

### 8. Läuft es überhaupt

* Syntaxcheck über die ganze Datei, so wie in Phase 6 gemacht (`new Function(...)` über den Skriptinhalt).
* Kurzer Live-Lauf über den Dev-Server-Eintrag `adventure` aus `~/vibecodingprojekt/.claude/launch.json`, Port 8378: startet das Spiel, kommt eine Exception in der Konsole, sind Netzwerkfehler auf fehlende Assets dabei?
* Der Live-Stand auf GitHub Pages: entspricht er dem, was in `main` liegt, oder hinkt er hinterher?

## Form des Berichts

Schreib die Datei `ABGLEICH-<JJJJ-MM-TT>.md` ins Repo-Root. Nur diese eine Datei entsteht, sonst nichts.

Aufbau:

1. **Ampel in drei Zeilen.** Ein Satz Git-Stand, ein Satz Phasenstand, ein Satz Gesamturteil. Kein Vorgeplänkel.
2. **Phasentabelle** nach Abschnitt 2.
3. **Funde**, sortiert nach Schwere, nicht nach Fundort. Je Fund: was, wo (Bezeichner plus `skript/`-Datei, oder Plandatei plus Abschnitt), warum es zählt, was es kosten würde. Schwere in drei Stufen: bricht etwas, weicht vom Plan ab, kosmetisch.
4. **Ungeprüft**, ausdrücklich als eigener Abschnitt. Alles, was du nicht belegen konntest, mit Grund. Lieber ehrlich lückenhaft als gefällig vollständig.
5. **Vorschlagsliste**, priorisiert, jeweils mit Aufwandsschätzung. Keine Umsetzung.

Ton wie im Projekt: trocken, deutsch, knapp. Keine Gedankenstriche in Texten, die im Spiel landen könnten. Im Bericht selbst darfst du normal schreiben.

## Was du nicht tust

* Kein Code ändern, auch nicht „schnell nebenbei".
* Keine Plandatei anfassen, auch keine Statusmarker.
* Keinen Commit, keinen Push.
* Nichts als erfüllt melden, was du nur aus den Umsetzungsnotizen abgeschrieben hast. Notizen sind Behauptung, Code ist Beleg.
