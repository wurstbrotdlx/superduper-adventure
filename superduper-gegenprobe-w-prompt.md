# SuperDuper Adventure, Gegenprobe zu W3 bis W7 und der Anrede

Prüfauftrag, kein Umbauauftrag. **Du änderst in diesem Durchgang keine Zeile Code und keine Zeile Plan.** Am Ende steht ein Bericht, sonst nichts. Wenn du etwas reparieren willst, schreibst du es als Vorschlag in den Bericht und wartest auf Freigabe.

## Auftakt für eine frische Session

> Lies `superduper-gegenprobe-w-prompt.md` in `~/vibecodingprojekt/adventure/`. Führe die Gegenprobe vollständig aus. Nichts ändern, nur berichten.

Modell: `/model opus`, ausdrücklich **nicht** `opusplan`. Die Denkarbeit liegt in der Ausführung, nicht in der Planung: eine Zusage im Phasendokument finden, ihre Entsprechung im Code aufspüren, und entscheiden, ob eine Abweichung Absicht, Folgeänderung oder Selbsttäuschung ist. Plan-Modus ist überflüssig, weil die Session ohnehin nichts schreibt.

Dieser Auftrag ist ausdrücklich für **Multi-Agent-Ausführung** gebaut. Die sieben Pakete unten sind so geschnitten, dass sie sich nicht überlappen und parallel laufen können. Ein Fan-out über die Pakete, je Paket eine unabhängige Instanz, ist der vorgesehene Weg. Der Grund steht unter „Arbeitsweise".

## Warum es diesen Auftrag gibt

Sieben Bauabschnitte sind ohne unabhängige zweite Meinung ins Repo gegangen: **W3** (Dorf spricht), **W4** (Schwarzes Brett), **W5** (Der Vorgang), **W6** (Rang und Laufbahn), die **Anrede** (18.5) und **W7** (die sieben Langvorgänge). Jeder hat ein Phasendokument mit einem Abschnitt „Abnahme" und einem Abschnitt „Live geprüft". Beide wurden von derselben Session geschrieben, die auch gebaut hat.

Das ist der ganze Punkt. **Wer baut, nimmt nicht ab.**

Wie berechtigt der Verdacht ist, hat `GEGENPROBE-2026-08-04.md` gerade gezeigt. Dort wurden 74 Funde des Abgleichberichts von unabhängigen Instanzen nachgeprüft. Ergebnis: 57 waren längst überholt, ohne dass jemand sie abgehakt hätte — und in **neun von zwölf** „teilweise"-Fällen war nicht der Code falsch, sondern **der Bericht**. Ein Fund war schon am Tag seiner Meldung falsch. Falsche Quantifizierungen, ein Schadensfall, den die z-index-Ordnung ausschließt, ein Codepfad, der schon immer im richtigen Block stand.

Übertrage das auf die Phasendokumente: sie sind mit derselben Sorgfalt und demselben blinden Fleck geschrieben. Wenn dort steht „live geprüft, Konsole blieb leer", ist das eine **Behauptung**, keine Tatsache. Genau diese Behauptungen prüfst du.

## Kontext

Repo: `~/vibecodingprojekt/adventure/`, `wurstbrotdlx/superduper-adventure`, Branch `main`. Ein Spielfile: `index.html`, rund 8500 Zeilen. Stand bei Abfassung: `a048e5b`, alles gepusht, Arbeitsbaum sauber.

**`git log` ist die Statusquelle, nicht die Statusmarker.** Diese Falle hat schon zugeschlagen (R6/R7 standen als OFFEN da, obwohl gebaut und committet).

**Zeilennummern in allen Prüfberichten sind Stände, keine Wegweiser.** `ABGLEICH-2026-07-27.md` bezieht sich auf `073c127`, `ZUSAGEN-BILANZ-2026-08-04.md` ebenso. Die Datei ist seither um rund 2000 Zeilen gewachsen. **Immer über den Bezeichner suchen.** Die Phasendokumente sagen das selbst in ihrer Kopfzeile.

Dokumente, die als Soll gelten:

* `superduper-weltbibel.md` — die Autorität. Kapitel 8 (Ensemble), 9 (Der Vorgang), 10 (Langvorgänge), 13 (Humor-Grundgesetz), 14 (Bauabschnitte), 16 (bewusst offen), 17/18 (Rang, Anrede, Stolzregeln)
* `phase-w3-dorf.md`, `phase-w4-brett.md`, `phase-w5-vorgang.md`, `phase-w6-rang.md`, `phase-anrede.md`, `phase-w7-langvorgaenge.md` — die zu prüfenden Zusagen
* `figuren-dorf.md`, `blaetter-serie-a-b.md`, `phase-w-blaetter-cf.md` — Inhaltslieferungen
* `ABGLEICH-2026-07-27.md`, `ZUSAGEN-BILANZ-2026-08-04.md`, `GEGENPROBE-2026-08-04.md` — nicht Soll, aber **Vorgeschichte**. Dort steht, was schon einmal geprüft wurde und mit welchem Ergebnis. Prüfe nichts doppelt, was `GEGENPROBE-2026-08-04.md` bereits erledigt hat.

Server: `preview_start {name: "adventure"}`, dann `http://localhost:8378/adventure/`. **Niemals Bash für den Server.** Niemals `dist/index.html` öffnen, die ist veraltet.

Syntaxcheck (falls du ihn brauchst, du änderst aber nichts):

```bash
python3 -c "import re;h=open('index.html').read();m=re.search(r'<script>(.*)</script>',h,re.DOTALL);open('/tmp/c.js','w').write(m.group(1))" && node --check /tmp/c.js
```

## Zwei Fallen beim Prüfen selbst

**Der Konsolen-Puffer im Browser-Pane akkumuliert über Navigationen.** Alte Fehler bleiben stehen und sehen aus wie neue. Verlässlich ist nur, den Guard direkt aufzurufen und seinen Rückgabewert zu lesen (`langAssert() === true`), oder `console.error` temporär abzufangen und die Liste zu lesen.

**Prüfungen über `npcSprechen()` sind keine reinen Prüfungen.** Sie lösen `saveKladde()` aus und schreiben echten Fortschritt in Matthias' Spielstand. Das ist in der letzten Session tatsächlich passiert. Nimm einen `localStorage`-Snapshot (`sda_kladde_v1`, `sda_amt_v1`, `sda_knoeterich_v1`) und schreibe ihn exakt zurück. Dasselbe gilt für jede Spiegelung von `amt.schichten` — **nie `saveAmt()` währenddessen.**

**`requestAnimationFrame` läuft im Headless-Pane nicht von selbst weiter.** Zeit- und frameabhängiges per direktem Aufruf simulieren (`update(0.016); render();`), nicht per `wait`.

## Was eine Zusage ist

Alles, was ein Phasendokument als Tatsache über den Code behauptet. Vier Sorten, alle prüfbar:

1. **Mechanik-Zusagen** — „X passiert, wenn Y". Nachspielen oder am Codepfad belegen.
2. **Negativ-Zusagen** — „X wird ausdrücklich nicht angefasst", „kein neues `amt`-Feld", „genau eine Schreibstelle". Das sind die **wertvollsten** und die am seltensten geprüften: sie lassen sich per Grep hart widerlegen.
3. **Abnahme-Zusagen** — die Punkte unter „Abnahme" und „Live geprüft". Jeder einzelne ist eine Behauptung über eine durchgeführte Prüfung.
4. **Zahlen und Grenzen** — Zeichendeckel, Stufenzahlen, Schwellen, Anzahl von Tabelleneinträgen.

## Arbeitsweise

**Widerlegungsauftrag, nicht Nacherzählung.** Deine Aufgabe ist, jede Zusage zu **kippen**. Ein Verdikt „stimmt" musst du mit einer Codestelle belegen, die die Zusage trägt. Eine Vermutung ist kein Beleg. Im Zweifel eher „weicht ab" als „stimmt".

**Prüfe die Guards, nicht nur den Code.** Sieben selbstaufrufende Guards melden beim Laden alle grün: `knAssertCaps`, `blaetterAssert`, `rangAssert`, `anredeAssert`, `vorgangAssert`, `auftragAssertBrett`, `langAssert`. Ein grüner Guard, der das Falsche prüft, ist gefährlicher als gar keiner — er erzeugt Sicherheit ohne Deckung. Frage bei jedem: *Welche Aussage macht er wirklich? Und welche macht er nicht, obwohl das Phasendokument so klingt?* Konkret zu prüfen:

* Prüft er die **gerenderten** Blöcke oder nur die Rohtabellen?
* Deckt sein Sweep den ganzen Wertebereich ab oder nur den bequemen Teil?
* Setzt er alle Spiegel exakt zurück, oder bleibt ein Wert verändert stehen?
* Ruft er eine Funktion mit Seiteneffekt auf?
* Ist ein Prüfpunkt **strukturell immer wahr** und beweist damit nichts?

**Verdikte:** **stimmt** · **weicht ab** · **nicht auffindbar** · **überholt** (durch spätere Abschnitte erledigt) · **nicht prüfbar** (nur bei echter Laufzeit-/Optik-/Audiofrage, sparsam).

**Trenne „stimmte nie" von „stimmt nicht mehr".** Nutze `git show <commit>:index.html`, um gegen den Stand zum Zeitpunkt des Phasendokuments zu prüfen. Die Commit-Anker stehen in jedem Phasendokument. Ein Dokument, das schon bei Abfassung falsch war, ist ein anderer Befund als eines, das durch spätere Arbeit überholt wurde.

## Die Pakete

Sieben Pakete, überlappungsfrei, parallel ausführbar.

### G1: W3, das Dorf spricht

`phase-w3-dorf.md` gegen `DORF_FIGUREN`, `npcCycle()`, `npcSprechen()`, `drawBubble()`, `knAssertCaps()`. Elf Figuren, sechs Grundzeilen und fünf Aktzeilen je Figur, Bramsches Frage/Antwort/Abweisung, der Lott/Pahl-Anlasschor. Prüfe besonders: sind alle Zeilen aus `figuren-dorf.md` wörtlich übernommen, und stimmen die Zeichenzahl-Angaben in der Prüfnotiz dort? **Bekannter Drift:** die drei W5-Aktzeilen (Lisbeth IV/V, Nörgel IV) sind in `figuren-dorf.md` nicht nachgezogen. Gibt es weitere?

### G2: W4, Schwarzes Brett

`phase-w4-brett.md` gegen `AUFTRAG_TYPEN`, `AUFTRAG_POOLS`, `auftragEreignis()`, `auftragAssertBrett()`. Neun Typen, drei Aushänge je Schicht, Lohnspannen, die drei „Weltgarantien". Prüfe besonders: ist jeder Typ wirklich erreichbar, hält die Garantie „nie unerfüllbar" auch an den Rändern, und zählt wirklich kein Ereignis doppelt?

### G3: W5, Der Vorgang

`phase-w5-vorgang.md` gegen `kladde.vorgang`, `ADRESS_ZEILEN`, `setzeKammerTueren()`, `zustellen()`, `vorgangPanelHtml()`, `vorgangAssert()`. Vier Adresszeilen, drei Sonderkammern plus Ablage V, die Zustellbedingung, das dreiteilige Schlusspanel. Prüfe besonders: die Behauptung, `killMon()` und die alte Siegweiche seien **unberührt**.

### G4: W6, Rang und Laufbahn

`phase-w6-rang.md` gegen `RAENGE`, `rangStufe()`, `rangNameVon()`, `INSIGNIEN`, `rangAssert()`. 19 Ränge, Beförderung alle fünf Schichten, Zeremonie-Kopplung ans Jahresgespräch, zwei wirkende Insignien. Prüfe besonders: die Zusage „kein neues `amt`-Feld, keine zweite Wahrheitsquelle", und ob die Kopplung `10 | n ⟹ 5 | n` im Code wirklich so trägt wie behauptet.

### G5: Die Anrede (18.5)

`phase-anrede.md` gegen `ANREDE`, `anredeFormen()`, `anredeVersuch()`, `npcCycle()`, `knBegruessungLine()`, `anredeAssert()`. Elf Formen, die Sprossenleiter, die acht Vorschriften aus 18.5. Prüfe besonders: **hält die Leiter auf jedem Rang?** Und die Zusage, dass die beiden Sonderpfade (Bramsche, Lott/Pahl) „per Konstruktion unberührt" bleiben — stimmt das, oder gibt es einen Pfad, der doch durch `npcCycle()` läuft? Dazu die Behauptung aus Fund A, `letzterAnlass` sei jetzt verbrauchbar: gibt es einen Weg, auf dem er stehen bleibt?

### G6: W7, die Langvorgänge

`phase-w7-langvorgaenge.md` gegen `LANGVORGAENGE`, `kladde.lang`, `langEreignis()`, `langAnsprechen()`, `langKammerWert()`, `langAssert()`. Sieben Stränge, zweigeteilte Rohwerte, `info.nur`. Prüfe besonders diese vier Zusagen, jede einzeln:

* **„Genau eine Schreibstelle für W7-Zustand."** Grep nach jedem Schreibzugriff auf `kladde.lang`.
* **„Kein Strang blockiert."** Nicht dem Guard glauben — selbst nachrechnen.
* **„Zapf rückt nie zwei Stränge auf denselben Druck vor."** Konstruiere einen Gegenfall.
* **„`t.diff`/`t.tier` bleiben unangetastet."** Wer liest den echten Wert, wer den angezeigten? Gibt es eine Stelle, die den falschen erwischt?

### G7: Querschnitt

Über alle Abschnitte hinweg, nicht paketgebunden:

* **TDZ.** Alle sieben Guard-Selbstaufrufe und jede Funktion, die auf Skriptebene läuft. Liest eine von ihnen etwas, das später deklariert wird? Zwei solche Fälle sind in W7 aufgetreten; `node --check` findet sie nicht, nur ein Ladeversuch im Browser.
* **Persistenz.** `loadAmt()` ist eine Whitelist, `loadKladde()` additiv. Überlebt jedes Feld einen Reload? Gibt es ein Feld, das geschrieben, aber nie geladen wird?
* **`#ovPanel`.** Die Zusage lautet „acht Schreibstellen, nie eine `id` darin". Zähl nach.
* **Formregeln.** Gedankenstriche, Emojis und Zeichendeckel über **alle** Spieltexte, auch die, die kein Guard erfasst.
* **Sperrvermerk.** Verrät irgendein Text die Kesselgrammatik? Die `GEHEIM`-Listen der Guards sind nicht identisch — vergleiche sie und prüfe, ob eine Lücke lässt.

## Form des Berichts

Datei: `GEGENPROBE-W-<ISO-Datum>.md` im Repo-Wurzelverzeichnis.

* **Kopf** mit Prüfstand (HEAD-Hash, Arbeitsbaum, Zeilenzahl `index.html`, Datum) und der Zusicherung, dass nichts geändert wurde.
* **Ampel**, drei bis vier Absätze Fließtext: Gesamteindruck, wo es hält, wo nicht.
* **Zählung** als kleine Tabelle.
* **Ein Abschnitt je Paket** mit einer Tabelle *Zusage | Fundort im Dokument | Erwartet | Gefunden | Bezeichner im Code | Urteil*, darunter eine Zählzeile.
* **Ein eigener Abschnitt „Die Guards"** — was jeder wirklich beweist und was nicht. Das ist der Teil, den es noch nie gab.
* **Funde, nach Schwere**, nummeriert, je mit **Was.** / **Warum es zählt.** / **Korrekturkosten.** Nutze eine neue Nummernserie mit eigenem Präfix (etwa `GW1`, `GW2`), damit sie nie mit den `F`-Nummern des Abgleichs verwechselt werden.
* **Ungeprüft**, mit Grund je Zeile.
* **Vorschlagsliste**, getrennt nach „Code ändern" und „Dokument ändern", priorisiert.

Wenn ein Phasendokument eine Prüfung behauptet, die nachweislich nicht stattgefunden haben kann, sag das deutlich. Das ist der wertvollste Fundtyp dieses Auftrags.

## Was du nicht tust

Keine Codeänderung, kein Commit, kein Push, keine Änderung an einem Plandokument oder Phasendokument — auch nicht „nur den Statusmarker". Keine Reparatur, auch keine offensichtliche. Kein Anfassen von `Graphics/`, `assets/cf/`, `dist/`.

Nicht prüfen, weil bereits erledigt: F1 bis F83 aus `ABGLEICH-2026-07-27.md` (siehe `GEGENPROBE-2026-08-04.md`) und die 15 Funde aus `ZUSAGEN-BILANZ-2026-08-04.md`. Stolperst du unterwegs über einen davon, nimm ihn als Nebenbefund mit, aber such nicht danach.

Nicht bewerten: die vier offenen Entscheidungen (F19 Gold-Doppelbuchung, F20 Ausbaukosten, `LICENSE`, Kampf-Tod gegen Zustellen). Die liegen bei Matthias, nicht bei dir.

Kapitel 16 der Weltbibel, „Bewusst offen gelassen", sind **Bauverbote, keine Lücken**. Melde nicht, dass dort etwas fehlt.
