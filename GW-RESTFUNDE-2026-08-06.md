# Restfunde der Gegenprobe: GW10, GW26b, Bandflächen, F20

**Datum:** 06.08.2026
**Ausgangslage:** `main` stand auf `1c15895` (Weltausbau, Karte 320x320, 600 Monster).
**Auftrag:** die zwei bewusst liegengelassenen Codeschulden bauen, die Balancefrage F20 messen statt rechnen, den Nebenbefund zur Bandflächen-Asymmetrie klären.

Dieses Dokument ist der Beleg. Es nennt jede Änderung mit ihrem Grund, jede Messung mit ihren Rohwerten und jede Stelle, an der eine frühere Zusage dadurch falsch geworden ist.

---

## 1. GW10: Zustellen hängt jetzt an Akt V

**Der Fund** (`GEGENPROBE-W-2026-08-05.md`, Abschnitt GW10): `vorgangZustellbar()` war ab `amt.schichten >= 30` wahr, das Dienstsiegel (`JAHRES_BONI` Index 3) fällt aber erst bei `amt.schichten === 40`. Im gesamten Fenster 30 bis 39 zeigte Puzzleteil 1 des Schlusspanels die Trepp-Bleistift-Ersatzfassung. Auf dem schnellsten legalen Weg sah der Spieler den Kern-Callback aus Kapitel 9 nie.

**Die Entscheidung:** die zweite der beiden angebotenen Varianten, also der Codeeingriff, nicht die Textkorrektur.

```js
const vorgangZustellbar = () => vorgangAusfertigung() && rangZeichnungsbefugt() && aktStand() >= 5;
```

`aktStand() >= 5` bedeutet `amt.schichten >= 40`, also Schicht 41 aufwärts. Das ist exakt die Schwelle, bei der das Dienstsiegel fällt, und exakt der Akt, den die Weltbibel für die Zustellung vorsieht.

**Vier Stellen mussten mit, sonst wäre die Konsole beim Laden rot gewesen.**

1. **`vorgangAssert()`, Block 7.** Das alte Kreuzprodukt setzte `amt.schichten` auf 0 oder 30 und zählte, wie oft `vorgangZustellbar()` wahr wurde. Nach der Änderung wäre die Antwort null gewesen. Der Block prüft jetzt gegen einen ausgeschriebenen Sollwert über vier Schichtwerte (0, 30, 39, 40). Das behebt nebenbei **GW15**: bei zwei fixierten Faktoren ergibt ein Kreuzprodukt zwangsläufig genau eine wahre Kombination, egal was die Funktion tut. Die alte Prüfung konnte gar nicht fehlschlagen.

2. **`langAssert()`, Block 4.** Prüfte die Blockadefreiheit des Hauptvorgangs bei Schicht 30. Jetzt bei Schicht 40. Der Adress-Akt und die Zeichnungsbefugnis werden weiterhin bei 30 geprüft, beide Prädikate sind unverändert.

3. **`vorgangBestandBlock()`.** Das ist die wichtigste Mitnahme, und sie ist keine Formalie. Ohne sie hätte die Änderung eine **stumme Sperre** erzeugt: der Kessel-Reiter meldet in Goldschrift „Die Ausfertigung ist vollständig", am Fürsten wird im Fenster 30 bis 39 wortlos nichts angeboten, und keine Textstelle im Spiel nennt die Schwelle. Der Spieler hätte den Fürsten stattdessen erschlagen und über `winGame()` das falsche Ende bekommen — also genau den Ausgang, den GW10 verhindern wollte, nur mit umgekehrtem Vorzeichen. Die Zeile trägt jetzt einen Halbsatz, wenn `vorgangZustellbar()` falsch ist:

   > Die Ausfertigung ist vollständig. An Fürst Nachtrag, zu Händen, persönlich. Zugestellt wird im fünften Akt.

   Kein Erklärsystem (das verbietet der Kommentar an `VORGANG_PUZZLE` ausdrücklich), kein zweites Prädikat, kein neues Feld: der Halbsatz liest `vorgangZustellbar()` selbst.

4. **`vorgangAssert()`, Block 10.** Prüft die Vollständigkeitszeile jetzt in beiden Fassungen, bei Schicht 30 mit und bei Schicht 40 ohne den Halbsatz — statt nur der Fassung, die der echte Spielstand zufällig trifft.

**Was die Änderung ausdrücklich NICHT repariert.** Die Zusage „`CONFIG.schichtModus = false` bricht nichts, `vorgangZustellbar()` bleibt falsch" (`phase-w5-vorgang.md`) bleibt unbelegt. `vorgangZustellbar()` liest `CONFIG.schichtModus` nirgends; mit persistiertem vollem Bestand und `amt.schichten >= 40` ist sie auch im Nicht-Schichtmodus wahr. Wer das wörtlich wahr haben will, braucht ein eigenes Modus-Gate im Muster von `vorgangAdressAkt()`. Das ist eine zweite, separate Entscheidung und hier bewusst nicht mitgetroffen.

**Und Puzzleteil 1 ist trotzdem nicht garantiert gefüllt.** `showJahresgespraech()` läuft ausschließlich über den WEITER-Knopf des Dienstberichts, `amt.schichten` ist zu diesem Zeitpunkt aber bereits gespeichert. Wer bei `amt.schichten === 40` auf dem Berichts-Overlay neu lädt, bekommt `JAHRES_BONI[3]` nie: `aktStand()` ist dann 5, `rangDienstsiegel()` falsch. Die Sonst-Fassung bleibt deshalb stehen, und keine Doku darf wieder „nie leer" behaupten.

---

## 2. GW26b: `amt.auftraegeErfuellt` ist gestrichen

Drei Vorkommen, alle entfernt: das `amt`-Literal, die Ladezeile in `loadAmt()`, das Inkrement in `auftragZahle()`.

**Kein Migrationscode.** `loadAmt()` ist eine Feld-Whitelist, ein alter Stand mit dem Feld wird schlicht nicht mehr gelesen. `saveAmt()` schreibt `JSON.stringify(amt)` als Vollersatz des Schlüssels `sda_amt_v1` — das Feld verschwindet beim nächsten Speichern von selbst. Ausdrücklich **kein** `delete` und **kein** Aufräum-`saveAmt()` in `loadAmt()`: das wäre ein `localStorage`-Schreibvorgang bei jedem Seitenaufruf.

**Kein Guard betroffen.** Es gibt keine Feldzählung über `amt`, keinen `for..in`, keinen dynamischen `amt[...]`-Zugriff. Die acht `#ovPanel`-Schreibstellen bleiben acht.

**Zu GW1 unabhängig.** Die Doppelauszahlungs-Sperre hängt an `a.bezahlt` am Aushangobjekt, nicht am Zähler. Es entfällt nur eine Nebenbegründung von GW1.

**Die Tragweite ist nicht der Codeeingriff, sondern der Einwegverlust.** Nach dem ersten `saveAmt()` ist der historische Zählerstand aus jedem Spielstand verschwunden und aus keiner anderen gespeicherten Größe rekonstruierbar. Ein späterer Bauabschnitt, der das Erzählsignal doch will, fängt bei null an.

---

## 3. F20: die Balance ist gemessen, nicht gerechnet

**Die Frage:** Vollausbau kostet 3850 Gold (1800 Anfangsstufe + 1650 Kontingent + 240 Türen + 100 Vermutungen + 60 Startfluch). Trägt der Bankzufluss das?

**Wie gemessen wurde.** Fünf vollständige Schichten zu je 1500 Spielsekunden, gefahren von einem Skript im laufenden Spiel: der `requestAnimationFrame`-Loop wurde stillgelegt und `update(1/60)` selbst getaktet, gesteuert über die echten Eingabepfade (`keysDown`, `atkBtnHeld`), mit Wegfindung per Breitensuche über `reachbar()`, Trankgebrauch unter 60 Prozent, Rückzug unter 35 Prozent ohne Trank, und Skillpunkten auf vit/str/agi. Keine Schicht endete durch Tod, jede lief die volle Uhr aus. Fünf Schichten dauern real rund zehn Sekunden.

| Schicht | Kills | Gold am Schichtende | Abgabe | Aushanglohn | **Bankzufluss** |
|---|---|---|---|---|---|
| 1 (ohne Aushang) | 30 | 81 | 40 | 0 | **40** |
| 2 (Menge, erfüllt) | 63 | 334 | 167 | 150 | **317** |
| 3 (Menge, offen) | 39 | 328 | 164 | 0 | **164** |
| 4 (Menge, offen) | 19 | 236 | 118 | 0 | **118** |
| 5 (Ort, offen) | 62 | 443 | 221 | 0 | **221** |

Summe nach fünf Schichten: **860 Gold**, Mittel **172 je Schicht** — davon 30 aus dem einen erfüllten Aushang, ohne diesen **142 je Schicht**.

**Was diese Zahl ist und was nicht.** Sie ist eine **untere Schranke**. Der Bot hat ausschließlich Oberwelt-Monster erschlagen und Beute aufgesammelt. Er hat **keine einzige Kammer betreten** — und die Truhen sind der größte Einzelkanal (15 Türen im Grundausbau, Truhenformel `rri(40,80)*(1+diff)`). Er hat außerdem nur einen von vier Aushängen erfüllt, weil er nicht gezielt den geforderten Monstertyp jagt.

**Die Antwort auf F20: 3850 ist keine Wand.**
- Nur mit Oberwelt-Kills: 3850 / 172 ≈ **23 Schichten**.
- Mit zuverlässig erfülltem Aushang (der Lohn geht ungeschmälert in die Bank, gemessen in Schicht 2): 142 + rund 270 ≈ 410 je Schicht, also **rund 9 Schichten**. Der Aushanglohn darf nicht auf die 172 addiert werden, die enthalten ihn anteilig schon.
- Mit Kammern deutlich darunter.

Akt V beginnt bei Schicht 41. Der Vollausbau liegt damit in jedem der drei Fälle **komfortabel innerhalb des Bogens**, im realistischen Fall sogar weit davor. Die bindende Grenze einer Schicht ist die Uhr und das Überleben, nicht der Preis. Wenn hier irgendwann etwas nachjustiert wird, dann nach oben (Ausbau zu billig), nicht nach unten.

**Nebenbeobachtung aus derselben Messung:** die Kills je Schicht streuen von 19 bis 63 bei identischer Strategie. Auf einer 320x320-Karte mit 40 Kacheln monsterfreiem Dorfgürtel dominiert der Laufweg zwischen zwei Zielen alles andere.

---

## 4. Bandflächen-Asymmetrie: kein Fairnessproblem, aber ein zu laxer Wächter

**Der Nebenbefund lautete:** Schnee und Sand liegen an der Ober- und Unterkante und verlieren proportional mehr Land ans Meer als Gras. „Wenn der `ort`-Aushang je unfair wirkt, ist das die Stelle."

**Gemessen (begehbare Kacheln je Band, aus dem laufenden Spiel):**

| Startwert | Schnee | Gras | Sand |
|---|---|---|---|
| 20260805 (aktuell) | 24592 (73,9 %) | 30024 (80,9 %) | 20760 (64,9 %) |
| 20260721 (alt) | 22432 (67,4 %) | 31324 (84,4 %) | 21317 (66,6 %) |
| 1 | 25245 (75,9 %) | 28475 (76,7 %) | 24300 (75,9 %) |
| 424242 | 24869 (74,7 %) | 29079 (78,3 %) | 23378 (73,1 %) |
| 11111111 | 23938 (71,9 %) | 29591 (79,7 %) | 22820 (71,3 %) |
| 987654321 | 23611 (70,9 %) | 30514 (82,2 %) | 22775 (71,2 %) |

Die Beobachtung stimmt in der Richtung. Sie trägt aber nicht bis zum Aushang durch, aus vier Gründen, von denen drei sie umkehren:

1. **Die Verwerfungsstichprobe normiert die Dichte.** `placeMonsters()` zählt Treffer, nicht Versuche. Weniger Land heißt proportional weniger Monster bei gleicher Dichte je begehbarer Kachel — also weniger Laufweg je Kill, nicht mehr.
2. **Der Dorfbann frisst ausgerechnet Gras.** `DORF_BANN` sperrt genau 9021 Kacheln (97 x 93, aus den vier strikten Vergleichen in `nahDorf`), alle im Grasband, davon rund 7200 begehbar. Gemessene Monsterverteilung bei 600 Stück: **Schnee 235, Sand 187, Gras 178**. Das kleinste Band ist Gras, nicht Schnee.
3. **Die Kapazität bindet nie.** Ein `ort`-Aushang verlangt 6 bis 10 Kills in seinem Band, dazu reserviert die Weltgarantie das Dreifache. Dem stehen 178 bis 235 Monster je Band gegenüber.
4. **Die Uhr bindet nicht.** Vom Dorf zur Schneebandmitte und zurück sind rund 50 Sekunden auf 1500 Sekunden Schicht, also 3,4 Prozent — weniger als das Zeitbudget eines einzigen Kills (83 Sekunden, `MENGE_UHR` ist 18, also 1500/18).

**Deshalb: keine Balanceänderung.** Das Würfeln des Bandes bleibt uniform, das Ziel bleibt für alle Bänder gleich, die Dorfscheibe bleibt wie sie ist.

**Geändert wurde stattdessen der Wächter**, der diese Fairnessrechnung überhaupt absichert. `genMap()` meldete bisher einen Fehler, wenn ein Band weniger als **500** begehbare Kacheln trägt. Die 500 stammen aus MH=80, wo ein Band 2000 bis 2320 Kacheln hatte — also rund ein Viertel. Bei MH=320 sind 500 noch **1,5 Prozent** eines Bandes: der Wächter hätte 98 Prozent Landverlust verschwiegen. Die Schwelle hängt jetzt an der Bandhöhe:

```js
const soll = Math.round((b.y1 - b.y0 + 1) * MW * 0.25);
```

Ergibt 8320 / 9280 / 8000. Der kleinste über sechs Startwerte gemessene Istwert ist 20760 — Sicherheitsabstand Faktor 2,6. Der Wächter feuert also nur bei einer wirklich entarteten Welt, meldet aber wieder das, wofür er gebaut wurde.

---

## 5. Nebenbefund, der beim Messen aufgefallen ist: die Welt war nicht reproduzierbar

Beim Vermessen der Bänder über mehrere Startwerte fiel auf, dass **zwei Läufe mit demselben Startwert verschiedene Karten ergaben** (begehbare Schneekacheln 24592 gegen 24189).

**Ursache.** `genMap()` würfelte die Radien der Eisteiche und Lavatümpel mit `rr()`, und `rr` hängt an `Math.random`, nicht am gesiegelten `mulberry32`-Strom. Der Radius entscheidet mit, wie viele `G_ICE_TREE`- und `G_CACTUS`-Kacheln zu begehbarem Eis bzw. Lava werden — also über die Begehbarkeit, nicht nur über die Optik. Zwei Zeilen, beide jetzt auf `R()` umgestellt.

Das ist die Umkehrung der Regel, die im Code schon an `auftragLohn()` steht („nur `rri` verwenden, nie `ri`/`R` — der gesiegelte Strom erzeugt die Weltkarte und darf hier nicht mitlaufen"): **Welt = `ri`/`R`, Laufzeit = `rr`/`rri`.** In `genMap()` war sie verletzt.

**Warum das zählt.** Der Vermerk der letzten Runde lautete: „Der Zufallsstartwert wurde bewusst gebumpt, die alte Welt ist unwiederbringlich, alte Fehlerberichte zur Karte reproduzieren nicht mehr." Das stimmte — aber aus dem falschen Grund und viel weitreichender: **keine** Karte war reproduzierbar, auch die neue nicht. Ein Kartenfehlerbericht ließ sich grundsätzlich nicht nachstellen.

**Nachgewiesen:** drei aufeinanderfolgende Ladevorgänge liefern jetzt dieselbe Kachel-Prüfsumme (`-1431673253`), dieselben Bandwerte (Schnee 22113, Gras 30785, Sand 22750), dieselbe Baum- und Dekozahl (7701 / 1870).

**Preis:** die Umstellung verschiebt den gesiegelten Strom, die Welt zu `20260805` sieht also ein letztes Mal anders aus als vorher. Ab jetzt bleibt sie stehen.

---

## Prüfungen

* `node --check` über den extrahierten Skriptblock: fehlerfrei.
* Alle sieben Guards direkt aufgerufen und ihr Rückgabewert gelesen, nicht dem Konsolenpuffer vertraut (der akkumuliert über Navigationen): `vorgangAssert`, `langAssert`, `rangAssert`, `anredeAssert`, `auftragAssertBrett`, `blaetterAssert`, `knAssertCaps` — alle `true`, `console.error` abgefangen und leer.
* Fünf vollständige Schichten durchgespielt, keine Exception, kein Tod, jede Schicht lief die Uhr aus.
* Weltdeterminismus über drei Ladevorgänge per Kachel-Prüfsumme belegt.
* Bandflächen über sechs Startwerte gemessen, Startwert danach auf `20260805` zurückgesetzt.
* `localStorage` nach den Messungen geleert, Spiel neu geladen, Dorf und HUD gerendert.

## Offen geblieben

* **Kampf-Tod gegen Zustellen.** Unverändert offen. Durch GW10 sogar dringlicher: das Fenster, in dem der Spieler den Fürsten erschlägt, statt zuzustellen, ist um zehn Schichten länger geworden. Der Halbsatz im Kessel-Reiter mildert das, ersetzt die Entscheidung aber nicht.
* **Die `schichtModus=false`-Zusage zu `vorgangZustellbar()`** (siehe Abschnitt 1).
* **Kammern in der Messung.** Der Bot betritt keine. Die untere Schranke von 172 Gold je Schicht steht, der Referenzfall mit Kammern ist weiter ungemessen.
* **`auftragOrtSoll` kann still offen bleiben.** `placeMonsters()` warnt nur über die Gesamtzahl gesetzter Monster, nicht über ein unerfülltes Ortsoll. Heute unerheblich, aber unsichtbar.
