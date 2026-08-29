# Arbeitsauftrag T3: Anlage 2, der Sidekick — ERLEDIGT (26.08.2026)

**Ausgeführt und ausgeliefert.** Was daraus geworden ist, steht in
`phase-t3-anlage2.md`; der Kanon der Figur in Weltbibel Kapitel 8 und 18.5 sowie in
`figuren-leben.md`. Dieser Auftrag bleibt unverändert stehen, wie jedes datierte Dokument
des Hauses: er beschreibt den Stand vor dem Bauabschnitt, nicht danach.

**Drei Stellen, an denen die Ausführung vom Auftrag abweicht**, jede mit Grund im
Phasendokument:

* **Abschnitt 2 beschreibt einen Vor-U2-Stand.** „Ohne Grafiken startet das Spiel nicht,
  `bakeUiSkin` wirft beim Laden" stimmt seit U2 nicht mehr: es wird gefragt statt
  zugegriffen, und ohne Grafikpaket startet das Spiel mit CSS-Ersatzwerten. Für die
  Abnahme braucht man das Paket trotzdem, sonst melden zwei Guards und die Konsole ist
  nicht still.
* **Anlage 2 hat kein eigenes Amtskürzel bekommen.** Abschnitt 4 ließ das offen; die
  Abkürzungstabelle in `figuren-leben.md` steht auf zwölf, „mehr nicht", und der Verzicht
  ist die bessere Pointe: wer gelesen werden will, kürzt nichts ab.
* **Der bekannte Rotstand ist doch behoben worden.** Abschnitt 9 hielt fest, dass
  `mitteilung-pruef` (29 von 32) nicht Sache dieses Abschnitts ist. Der Pflichteintrag in
  `NEUERUNGEN` hätte ihn auf 27 gedrückt, also wurde der seit T1 fertige Fixvorschlag
  umgesetzt. Steht auf 32 von 32.

---

**An die nächste Session im Repo `wurstbrotdlx/superduper-adventure`.** Dieser Text ist dein vollständiger Auftrag. Er wurde am Ende von Bauabschnitt T2 geschrieben, unmittelbar nachdem der Projektinhaber das Konzept „Anlage 2" angenommen hat. Alles, was von ihm wörtlich zitiert ist, steht in Anführungszeichen und ist bindend. Der Projektinhaber schreibt Deutsch, du antwortest Deutsch.

## 1. Was das hier ist

DAS MONSTRAL MINISTERIUM ist ein Browser-Adventure in `index.html` (HTML und CSS) plus sieben Skriptdateien in `skript/01..07` (rund 25 000 Zeilen JavaScript, geladen in der Reihenfolge ihrer Tags), alle Texte als JS-Literale, kein Build-Schritt für Texte. Eine Behördenwelt, strange aber liebenswert, Humor in der Verwandtschaft von Monkey Island, Day of the Tentacle und Theme Hospital, Zielgruppe 9 bis 99 mit Betonung ab 9.

Die Rangfolge der Wahrheit: `superduper-weltbibel.md` ist die Autorität über allem. Danach `weltgeschichte.md`, dann `figuren-dorf.md` und `figuren-leben.md`, dann die datierten `phase-*.md` (Protokolle, sie werden nie rückwirkend geändert), zuletzt der Code. Was du neu kanonisierst, wandert zuerst in die Weltbibel.

## 2. Bevor du irgendetwas baust

**Setup.** Ohne Grafiken startet das Spiel nicht (`bakeUiSkin` wirft beim Laden). Die Rohdateien liegen im privaten Repo `wurstbrotdlx/superduper-adventure-assets`: per `add_repo` anbinden, klonen, den Inhalt nach `assets/cf/` kopieren (die Ordner `deco`, `dungeon`, `enemies`, `player`, `tiles`, `ui` sind gitignored). Kenmi-Lizenz: Rohdateien niemals ins öffentliche Repo committen. Lokal läuft das Spiel über `python3 serve.py` auf Port 8378.

**Pflichtlektüre, in dieser Reihenfolge:**

1. `superduper-weltbibel.md`. Besonders: Kapitel 8 (das Ensemble und seine Sprachmarken), Kapitel 13 (Humor-Grundgesetz samt der Formregeln „Die Länge ist eine Sprachmarke" und „Der Anfang erzählt"), Kapitel 17 mit den Abschnitten 18.1 bis 18.12 (Titel, Anrede, Stolzregeln, Titelmaschine, Beförderungszeremonie).
2. `phase-t1-tonlage.md` und `phase-t2-anfang.md`, die beiden letzten Bauabschnitte. T3 setzt beide fort.
3. `figuren-leben.md` und `figuren-dorf.md`.
4. `README.md`, Arbeitsweise und Prüfläufe.

**Wo du anfängst.** Bauabschnitt T2 (die Ernennung am Anfang, „Der Anfang erzählt") lag bei Abfassung dieses Auftrags als ungemergter Entwurf in PR #61, auf dem Zweig `claude/story-text-revision-nr932k`. T3 baut hart auf T2 auf, denn das erste Treffen mit Anlage 2 hängt an der Ernennungsurkunde. Also zuerst nachsehen:

* Ist #61 gemerged: starte deinen Arbeitszweig von `origin/main` und leg los.
* Ist #61 noch offen: sag dem Projektinhaber, dass T3 die Ernennung aus T2 braucht, und empfiehl, #61 zuerst zu mergen. Sollst du trotzdem vorher bauen, dann auf dem Stand von `origin/claude/story-text-revision-nr932k`.

Miss dich immer an `origin/main`, nie an einem lokalen `main`.

## 3. Der Auftrag im Originalton

Die Idee des Projektinhabers:

> „Könnten wir einen sidekick der immer dabei ist der die Welt erklärt (Beleidigungen und Gags) auch ingame? Mir fällt nur nichts ad hoc ein. Ein sprechendes Tier? Oder Gegenstand? Was passt da zu dieser Welt was sich richtig gut auskennt? Die Insider checkt? Und „unbemerkt" mir läuft? Wir können den Sidekick ja als erstes gescriptet dann über den Weg laufen lassen. Nur eben was? N Überbleibsel vom Vorgänger?"

Die Annahme des Vorschlags „Anlage 2", mit allen Festlegungen:

> „Ja Anlage 2. super. Wir müssen sie fundiert und nicht knapp einführen. Es wird die sarkastische Version von Genie (aus Aladdin) und trotzdem nicht fies sondern schrullig liebenswürdig. Meinst wir könnten dann die Kommentare von Knöterich zurückfahren oder streichen und dafür Anlage 2 an den Platz treten lassen? Was definitiv passiert Anlage 2 ist ein festes nicht entfernbares item im Rucksack. Und wenn man es bewegen will gibt's n Spruch. Gern mehrere bei jedem neuen Versuch. Wenn du ein Icon und profilbild brauchst sag Bescheid. Evtl haben wir ja schon was. Das ist das missing piece damit das Spiel liebenswürdig wird."

Der letzte Satz ist der Maßstab des ganzen Bauabschnitts.

## 4. Das angenommene Konzept

**Die Kanon-Geometrie.** In `phase-e2-staatsakt.md` steht auf dem Staatsakt-Papier der Satz „Anlage 1 liegt nicht vor." Anlage 3 ist der Kater der Registratorin Bramsche, der immer genau auf der Akte schläft, die man braucht. Anlage 2 existiert im gesamten Kanon nicht, null Treffer. Diese Lücke ist der Platz des Sidekicks: Anlage 1 liegt nicht vor, Anlage 3 schläft auf der Akte, und Anlage 2 läuft mit dem Spieler.

**Was sie ist.** Ein Schriftstück. Eine Beilage, die seit Jahrzehnten jedem wichtigen Vorgang des Hauses pflichtgemäß beigefügt wurde, mit Heftklammer, und die in all den Jahren kein einziger Mensch gelesen hat. **Beigefügt, nicht eingeweiht.** Daraus folgt alles, was der Sidekick braucht:

* **Die Brandmauer gegen Spoiler.** Anlage 2 lag bei allem dabei und kennt deshalb das Haus, die Leute, die Insider, die Beleidigungen und die Gags aus nächster Nähe. Den laufenden Fall kennt sie nicht: eingeweiht wurde sie nie, und seit sie beim Spieler hängt, ist sie aus dem Umlauf. Sie kann die Welt erklären und die Geschichte nicht verraten. Diese Grenze ist hart. Jede Zeile, die sie spricht, muss sie einhalten.
* **Der Humor-Motor.** Jahrzehnte des Ungelesen-Seins. Daraus speist sich der Sarkasmus, und er richtet sich gegen Verfahren, Formulare und Zustände, nie von oben herab gegen Menschen.
* **Der warme Kern.** Anlage 2 will ein einziges Mal gelesen werden. Der Spieler ist die erste Person, die es tut. Deshalb bleibt sie, und deshalb ist ihre Dauerbelehrung in Wahrheit Zuneigung. Grundgesetz 12 der Weltbibel („Belehrung ist eine Liebeserklärung") ist ihr Lebensprinzip.

**Die Reichspapier-Pointe.** Der Zuwachs W11 zu Anlage 3 in der Weltbibel sagt: „Anlage" ist im Reich ein Aktenhausname, und eine Nummer hinter einem Hausnamen ist in Hochablage die Schreibweise für ein nachgeordnetes Familienmitglied. Auf Reichspapier gelesen ist der Kater der dritte Sohn eines Adelshauses. Dieselbe Lesart macht Anlage 2 zum zweiten Kind desselben Hauses, also zum älteren Geschwister des Katers. Ob und wie du diese Pointe hebst, entscheidest du beim Schreiben; sie muss mit dem W11-Zuwachs vereinbar bleiben, und die Weltbibel bekommt den Eintrag zuerst.

**Die Stimme.** Die sarkastische Version von Genie aus Aladdin, ins Behördendeutsch übersetzt: schnell, viele Register, Rollen- und Tonwechsel, Fußnoten zu allem, und trotzdem schrullig liebenswürdig, nie fies. Sie siezt, denn nur Fass duzt. Sie redet den Spieler mit dem verliehenen Titel an (`RAENGE[0]` ist der `Monsterangelegenheitenanwärter` aus der T2-Ernennung); die Anrede-Tabelle in 18.5 bekommt eine eigene Zeile für sie, und die Stolzregeln in 18.6 sind bindend: Anlage 2 spottet über vieles, aber nie über einen Titel. Sie braucht eine eigene Sprachmarke in Kapitel 8, die du definierst. Ein möglicher Anker, kein Befehl: sie spricht in Beifügungen und Verweisen („siehe oben", „wie bereits erwähnt, von niemandem", „Einzelheiten in der Anlage, also in mir"). Verwendet sie Amtskürzel, müssen die im `ABKUERZUNGEN`-Register stehen, `szeneAssert` prüft die Auflösung.

**Das erste Treffen.** Gescriptet, und zwar an der Ernennungsurkunde aus T2: Bürgermeister Zwirn verleiht am Ende des Empfangs den ersten Titel (`ERNENNUNG_BLAETTER`, `ERNENNUNG_URKUNDE()`, `empfangErnennung()` mit `letzterKnopf:'HINAUSGEHEN'`). An dieser Urkunde hängt Anlage 2, pflichtgemäß beigefügt und von niemandem bemerkt, denn Anlagen bemerkt man nicht. Genau das ist das „unbemerkt mitläuft" aus dem Auftrag, als Weltlogik statt als Trick. Die Einführung ist „fundiert und nicht knapp": eine eigene erzählte Szene nach der Formregel „Der Anfang erzählt", nicht zwei Sprechblasen. Der genaue Moment (beim Einstecken der Urkunde, beim ersten Öffnen des Rucksacks, direkt nach dem Hinausgehen) ist deine Designentscheidung.

## 5. Was fest entschieden ist

1. **Festes Item im Rucksack.** Anlage 2 liegt dauerhaft in der Tasche (Rucksack-Fenster, `invBtn`, Taste I) und ist nicht entfernbar.
2. **Sprüche beim Bewegungsversuch.** Wer sie verschieben, ablegen oder loswerden will, bekommt einen Spruch. Ein Pool aus mehreren, bei jedem neuen Versuch ein anderer; der Reihe nach statt zufällig, damit sich vor Erschöpfung des Pools nichts wiederholt. Die Reihe darf vertrauter werden, nicht schärfer.
3. **Anlage 2 übernimmt den Welt- und Ereigniskommentar.** Siehe Abschnitt 6.
4. **Die Brandmauer gilt.** Haus und Leute ja, laufender Fall nein.

## 6. Die Arbeitsteilung mit Knöterich

Der Projektinhaber hat gefragt, ob Knöterichs Kommentare zurückgefahren oder gestrichen werden, damit Anlage 2 an den Platz tritt. Die Empfehlung, mit der du startest und die du dir früh bestätigen lässt: **zurückfahren, nicht streichen.** Der Kanon-Anker steht in der Weltbibel: „Knöterich erklärt Tasten, nie Zusammenhänge." Also:

* Knöterich behält das Tutorial und die Bedienung: `HINWEISE`, `ESCALATE_DEFS`, alles, was Tasten und Gerät erklärt.
* Anlage 2 übernimmt Welt, Ereignis und Insider. Die `RANDNOTIZ`-Einträge, die in Wahrheit Welterklärung sind, wandern sinngemäß zu ihr oder fallen weg.
* Ergebnis sind zwei Stimmen mit klarer Zuständigkeit: der Amtston von oben erklärt das Gerät, die Beilage von innen erklärt die Welt.

Leg dem Projektinhaber früh eine konkrete Liste vor: welche Randnotiz-Anlässe wandern, welche bleiben.

## 7. Die Mechanik, die du wiederverwendest

Nichts davon musst du erfinden, alles liegt in den `skript/`-Dateien:

* **Anlass-Kanäle.** Knöterichs `RANDNOTIZ` ist ein Pool je Auslöser; bekannte Auslöser sind `crit`, `levelup`, `ultimate`, `fluch`, `goldfund`, `kammerAbbruch`, `untaetigkeit`, dazu die Szenen-Anlässe in `ANLASS_QUELLEN` (`umlauf`, `hintermuehl`, `vorblatt`). Die `anlass`-Pools der Dorffiguren hängen an denselben Schlüsseln, und `knAssertCaps` meldet jeden Schlüssel, den es nicht kennt. Anlage 2 bekommt ihren eigenen Kanal nach diesem Muster.
* **Zusatz-Gates.** Zeilen, die erst später dazukommen, laufen über `zusatz`-Blöcke mit `abSchicht`, `abStufe`, `abAkt`, `abRang`, `skill`, `merker`, `phase`, `lang`. So wächst Anlage 2 mit dem Spielstand.
* **Die Szenenmaschine.** `SZENEN`-Tabelle, Knoten `{z1,z2,wer?,hub?,opts}`, Fragen `{key,t,frei,nach,weiter,wt}`, `szeneTafeln(liste,{letzterKnopf,ende,zweiter})`. Eine Kaskade ist eine Frage mit `weiter:'knoten'` und `wt:'Spielerzeile'`: genau eine Weiter-Option, Endknoten ohne `opts` fällt in den Hub. So reden Figuren lang, ohne dass ein Deckel reißt.
* **Gespräche.** Wenn Anlage 2 im Rucksack ansprechbar wird (Insider-Erklärungen auf Abruf), gelten die Gesprächsregeln: 4 bis 5 Antworten, die letzte ist wörtlich `Auf Wiedersehen.`, Deckel `ANTWORT_DECKEL=28` und `SCHILD_DECKEL=24`, `gespraechAssert` wacht darüber.
* **Rang-Material.** `RAENGE`, `rangNameVon(i)`, `RANG_URKUNDE()` und `rangZeremonieBlock()` (Beförderung ab Schicht 10) sowie die T2-Ernennung als Vorlage für Zeremonielles.

## 8. Deckel, Sperren, Guards

Die Laufzeit-Guards melden in die Konsole und werfen nie. Beim Start zeigt die Konsole 22 Zeilen Grundrauschen; jede Zeile darüber hinaus ist ein Befund. **Stille Konsole ist die Abnahme.**

* `knAssertCaps`: Sprechblasen-Deckel `z1` bis 48, `z2` bis 32, Einzeiler bis 44 Zeichen; genau 6 `grund`- und 5 `akt`-Paare je Dorffigur; unbekannte Anlass-Schlüssel.
* `gespraechAssert`: die Gesprächsregeln aus Abschnitt 7.
* `szeneAssert`: Erreichbarkeit aller Knoten, die Wortsperren `AKTE_SPERRE` und `AKTE_SPERRE_NAMEN`, die `weiter:`/`wt:`-Verdrahtung, die Auflösbarkeit aller Meldekürzel, den Kaiser in allen `text()`-Quellen.
* `KAISER_PRAETERITUM`: der Kaiser steht nie in der Vergangenheit. Er ist im Termin, seit dem Jahr 588.
* `PRUEF_GEHEIM`: Sperrwörter der Kesselgrammatik in Spieltexten, darunter das Wort „Alter".
* `PRUEF_EMOJI`: keine Emojis in Spieltexten.

Dazu die Regeln, die kein Guard prüft und die trotzdem gelten: keine Gedankenstriche in Spieltexten; die Wörter „ausschweifend", „weitschweifig" und „geschwätzig" sind in Spieltexten gesperrt (Zutaten-Kollision); die Zeichendeckel gelten für Sprechblasen, nicht für Tafelzüge der Szenenmaschine, dort gilt die Erzählform aus „Der Anfang erzählt".

**Jede neue Textquelle bekommt eine Prüfung.** Häng die Pools von Anlage 2 an die bestehenden Asserts an oder gib ihnen einen eigenen. Jeden neuen Guard löst du einmal absichtlich aus und protokollierst die Meldung im Phasendokument.

## 9. Arbeitsweise des Hauses

* **Phasendokument.** Leg `phase-t3-anlage2.md` an, Überschrift mit `— OFFEN`, am Ende `— ERLEDIGT`. Hinein gehören Befund, Entscheidungen, Guard-Protokolle und die Abnahme. Datierte Phasendokumente anderer Abschnitte bleiben unangetastet.
* **Kanon zuerst.** Weltbibel-Eintrag in Kapitel 8 samt Sprachmarke, die Anrede-Zeile in 18.5, dann `figuren-leben.md` (Hintergrundgeschichte nach dem Muster der Datei), Bildprompt in `figuren-bildprompts.md` falls neu gemalt wird, README-Tabelle ergänzen.
* **Prüfläufe.** `tools/{empfang,szene,gespraech,reich,stopfen,versuchung,langvorgang,mitteilung}-pruef.mjs` (Playwright, manuell, nicht CI). In der Cloud-Umgebung: `CHROMIUM=/opt/pw-browsers/chromium-*/chrome-linux/chrome` und `PLAYWRIGHT_PFAD=/opt/node22/lib/node_modules/playwright/index.js`, auf `frameNo>0` warten, nicht auf `assetsReady`. Bekannter Rotstand: `mitteilung-pruef` steht vorbestehend auf 29 von 32, der Fixvorschlag liegt in `phase-t1-tonlage.md`, das ist nicht dein Auftrag.
* **Abnahme ehrlich.** Live verifizieren statt behaupten. Das Durchspielen vom Spielstart bis nach dem ersten Treffen mit Anlage 2 gehört dazu, ebenso ein Bewegungsversuch im Rucksack mit mindestens zwei verschiedenen Sprüchen.
* **Git.** Arbeit auf deinem designierten Zweig, Commit-Titel deutsch mit Präfix `T3:`, keine Modellnamen in Commits, PRs oder Code. Push und Draft-PR; gemergt wird vom Projektinhaber als Merge-Commit `<Titel> (#N)`, kein Squash. Deploy läuft bei Push auf `main` automatisch über GitHub Pages; `github.io` ist aus der Cloud-Umgebung nicht abrufbar (Proxy), verifiziert wird über den Deployment-Status der API plus einen lokalen Bau mit `tools/build-single.mjs`.
* **Auslieferung.** Wie bei T1 und T2 am Ende eine gebaute Einzeldatei an den Projektinhaber schicken (`monstral-ministerium-T3.html`).
* **Entscheidungen.** Was dem Projektinhaber gehört, legst du ihm früh als kurze Auswahlfragen vor, nicht spät als vollendete Tatsache.

## 10. Frag den Projektinhaber früh

1. **Icon und Profilbild.** Er hat gesagt: „Wenn du ein Icon und profilbild brauchst sag Bescheid. Evtl haben wir ja schon was." Sieh zuerst im Assets-Repo nach (`ui`, `deco`), dann frag, ob es schon etwas gibt oder ob ein Bildprompt in `figuren-bildprompts.md` entstehen soll.
2. **Die Knöterich-Liste.** Bestätigung der Arbeitsteilung aus Abschnitt 6, mit konkreter Aufstellung, welche Randnotiz-Anlässe zu Anlage 2 wandern und welche bei Knöterich bleiben.

## 11. Fertig ist es, wenn

* Anlage 2 kanonisiert ist (Weltbibel, Anrede-Tabelle, figuren-Dateien, README) und die Brandmauer in jedem ihrer Texte hält,
* das erste Treffen an der Ernennungsurkunde als erzählte Szene läuft,
* sie als festes, nicht entfernbares Item mit rotierendem Sprüche-Pool im Rucksack liegt,
* ihr Kommentarkanal mit Anlass-Auslösern und Zusatz-Gates spielt und die Knöterich-Arbeitsteilung umgesetzt ist,
* alle Guards still sind, die Prüfläufe bis auf den bekannten Rotstand grün, das Phasendokument auf `— ERLEDIGT` steht,
* und der Anfang sich beim Durchspielen so anfühlt, wie der Projektinhaber es bestellt hat: „Das ist das missing piece damit das Spiel liebenswürdig wird."
