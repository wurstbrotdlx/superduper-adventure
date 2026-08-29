# Arbeitsauftrag: Das Porträt von Anlage 2 und die Doku-Schuld — ERLEDIGT (26.08.2026)

**Ausgeführt und ausgeliefert** mit der T4-Nachlese (#67), in drei Commits: das gemalte
Porträt (`1112c50`), der Nachzug des Gameplay-Prompts (`3470b7b`) und der dreizehnte
Umschlag (`22f7b43`). Dieser Auftrag bleibt unverändert stehen, wie jedes datierte Dokument
des Hauses: er beschreibt den Stand vor dem Bauabschnitt, nicht danach.

**Vier Stellen, an denen die Ausführung vom Auftrag abweicht:**

* **Aufgabe 3 ist zur Hälfte erledigt.** Von den zwei freien Umschlagplätzen ist einer
  gefüllt: der dreizehnte gehört ihr selbst und wird scharf, wenn ihr jemand alle sieben
  Fragen gestellt hat, gezählt über Sitzungen hinweg in `kn.a2Gefragt`. Der vierzehnte Platz
  steht weiter leer, und der Guard lässt ihn weiter zu.
* **Es gibt kein Phasendokument.** Abschnitt 10 verlangt eines; protokolliert wurde
  stattdessen in den Commit-Nachrichten, so wie bei der T3-Nachlese davor (#63, #64). Dort
  stehen Befund, Abnahme und die absichtlich ausgelöste Guard-Meldung im Wortlaut: *„T3
  Anlage 2: Das Feld kn.a2Gefragt fehlt in der Vorgabe."*
* **Der Vorspann für `superduper-figurenleben-prompt.md` kam später.** Abschnitt 7 hat ihn
  für den Fall vorgesehen, dass die veraltete Stelle in die Irre führt; die Nachlese hat das
  Dokument unangetastet gelassen und allein `superduper-gameplay-prompt.md` nachgezogen, wie
  beauftragt. Der Vorspann steht seit dem Aufräumen danach, mit demselben Datum.
* **Das Motiv ist beschnitten worden.** Die Generierung setzte das Blatt auf 62 zu 78 Prozent
  in den Rahmen statt „filling most of the frame"; bei 128 Pixeln zerfiel dadurch die
  Heftklammer zu einem Krakel, und die Klammer ist laut Kanon die Figur. Beschnitten wurde
  die Datei (885 im Quadrat, nur Hintergrund) und nicht die Pipeline: ein Ausschnitt-Feld in
  `figuren-px.py` hätte für einen einzigen Sonderfall ein System gebaut.

---

**An die nächste Session im Repo `wurstbrotdlx/superduper-adventure`.** Dieser Text ist dein
vollständiger Auftrag. Er wurde am Ende von Bauabschnitt T4 geschrieben, unmittelbar nachdem
PR #65 gemergt war. Alles, was vom Projektinhaber wörtlich zitiert ist, steht in
Anführungszeichen und ist bindend. Der Projektinhaber schreibt Deutsch, du antwortest Deutsch.

## 1. Was das hier ist

DAS MONSTRAL MINISTERIUM ist ein Browser-Adventure in `index.html` (HTML und CSS) plus sieben Skriptdateien in `skript/01..07` (rund 25 000 Zeilen JavaScript, geladen in der Reihenfolge ihrer Tags),
rund 25.000 Zeilen, alle Texte als JS-Literale, kein Build-Schritt für Texte. Eine
Behördenwelt, strange aber liebenswert, Humor in der Verwandtschaft von Monkey Island, Day of
the Tentacle und Theme Hospital, Zielgruppe 9 bis 99 mit Betonung ab 9.

Die Rangfolge der Wahrheit: `superduper-weltbibel.md` ist die Autorität über allem. Danach
`weltgeschichte.md`, dann `figuren-dorf.md` und `figuren-leben.md`, dann die datierten
`phase-*.md` (Protokolle, sie werden nie rückwirkend geändert), zuletzt der Code. Was du neu
kanonisierst, wandert zuerst in die Weltbibel.

## 2. Bevor du irgendetwas baust

**Setup.** Ohne Grafiken startet das Spiel nicht (`bakeUiSkin` wirft beim Laden). Die
Rohdateien liegen im privaten Repo `wurstbrotdlx/superduper-adventure-assets`: per `add_repo`
anbinden, klonen, den Inhalt nach `assets/cf/` kopieren (die Ordner `deco`, `dungeon`,
`enemies`, `player`, `tiles`, `ui` sind gitignored). Kenmi-Lizenz: Rohdateien niemals ins
öffentliche Repo committen. Lokal läuft das Spiel über `python3 serve.py` auf Port 8378.

**Pflichtlektüre, in dieser Reihenfolge:**

1. `phase-t4-charakter.md`. Der jüngste Bauabschnitt und der Grund, warum es diesen Auftrag
   gibt. Besonders Abschnitt 9, „Was offen bleibt": daraus sind die drei Aufgaben unten.
2. `superduper-weltbibel.md`, Kapitel 8 (das Ensemble, darin „Anlage 2" samt Zuwachs T3 und
   T4), Kapitel 13 (Humor-Grundgesetz samt Formregeln), 18.5 und 18.6 (Anrede, Stolzregeln).
3. `phase-t3-anlage2.md` und `figuren-leben.md` ab „Anlage 2 — Beilage". Zusammen sind das
   Herkunft, Riss, blinder Fleck und die vier Punkte unter „Was sie nie sagen wird".
4. `figuren-bildprompts.md`, besonders Prompt Nr. 21 und den Abschnitt „Was die Prompts
   absichtlich nicht tun".
5. `README.md`, Arbeitsweise und Prüfläufe.

Die zwei Designstudien (`robin-williams-charakterdesign.md`,
`robin-williams-designstudie-rollen.md`) liegen seit T4 im Repo. Sie sind die Grundlage des
Charakters und stehen laut Auftrag des Projektinhabers über Weltbibel und Regeln. Für diesen
Abschnitt brauchst du sie nur, wenn du an ihren Zeilen arbeitest; die Grenze aus Teil 1,
Abschnitt 9 gilt unverändert: **nur die Technik, keine Person.** Keine Zitate, keine
Rollenanspielungen, keine Popkultur.

**Wo du anfängst.** Bauabschnitt T4 ist gemergt (PR #65, Merge-Commit `52bdd7b`). Starte
deinen Arbeitszweig von `origin/main`. Miss dich immer an `origin/main`, nie an einem lokalen
`main`.

## 3. Der Auftrag im Originalton

Zu diesem Abschnitt liegt **keine neue Ansage** des Projektinhabers vor. Der Umfang unten
kommt aus dem, was T4 selbst offen gelassen und protokolliert hat. Sag das dem Projektinhaber
zu Beginn und lass dir die Reihenfolge bestätigen, statt sie zu behaupten.

Bindend ist weiterhin ein Satz aus T3, und er betrifft genau die erste Aufgabe:

> „Wenn du ein Icon und profilbild brauchst sag Bescheid. Evtl haben wir ja schon was."

Und der Maßstab der ganzen Figur, ebenfalls aus T3:

> „Das ist das missing piece damit das Spiel liebenswürdig wird."

## 4. Die Lage nach T4

Anlage 2 ist fertig gebaut und kanonisiert. Sie ist ein Schriftstück, das seit Jahrzehnten
jedem Vorgang des Hauses beigefügt und nie gelesen wurde, sie hängt mit einer Heftklammer an
der Ernennungsurkunde des Spielers, und sie läuft mit. Was heute steht:

* **Zehn Anlässe** im Kommentarkanal `ANLAGE2_NOTIZ` (`crit`, `ultimate`, `levelup`,
  `kammerAbbruch`, `fluch`, `goldfund`, `untaetigkeit` seit T3, dazu `niederlage`,
  `bosssieg`, `ebene` seit T4), gefiltert über elf Gate-Schalter in `ZUSATZ_SCHALTER`.
* **Zwölf Umschlag-Zeilen** (`ANLAGE2_UMSCHLAG`), jede genau einmal im ganzen Spiel, kurz,
  ohne Pointe, ohne Maske, und nur, wenn der Spieler mit ihr allein ist.
* **Zehn Bewegungssprüche** als Reihe mit Ringschluss, **fünf Einführungsblätter**, ein
  **Gesprächsbaum** mit sieben Fragen und der formlosen Bitte am Ende, deren Annahme den
  Merker `anlage2Dank` setzt.
* **Ein Band, drei Kleidungen:** Knöterich `§` amtsgold schräg, Anlage 2 `*` papierfarben
  gerade, der Umschlag ohne Marke, gedämpft, fünf Sekunden statt drei.
* Guard `anlage2Assert()` meldet beim Start: `T3 Anlage 2: 10 Anlässe, 10 Sprüche in Reihe,
  5 Blätter, 12 Umschläge, Brandmauer in Ordnung.`

## 5. Was fest entschieden ist und nicht aufgemacht wird

Diese Punkte sind Kanon. Wer sie ändern will, braucht eine Ansage des Projektinhabers, nicht
ein gutes Argument.

1. **Die Brandmauer.** Beigefügt, nicht eingeweiht. Sie kennt Haus, Leute und Verfahren, den
   laufenden Fall kennt sie nicht. Die Grenze gilt für jede Zeile, auch für Tooltips.
2. **Der blinde Fleck bleibt.** Sie bemerkt nie, dass ihr jemand zuhört. Deshalb ist von der
   vierstufigen Publikums-Mechanik der Studie bewusst nur Stufe eins gebaut.
3. **Kein Preis pro Pointe für sie.** Bei einer Figur, deren ganzes Elend das Ungelesensein
   ist, würde ein Verdachtsbalken das Zuhören zur Ressource machen. Für eine *andere* Figur
   bleibt der Fund offen, siehe Aufgabe 3 und Teil 2, Abschnitt 5 der Studie.
4. **Kein eigenes Amtskürzel.** Die Abkürzungstabelle steht auf zwölf, mehr nicht. Wer
   möchte, dass man ihn liest, kürzt nichts ab.
5. **Sie erklärt keine Taste.** Das tut Knöterich. Der Amtston von oben erklärt das Gerät,
   die Beilage von innen erklärt die Welt.
6. **Die Reichspapier-Pointe wird nie aufgelöst.** Sie nennt den Kater genau einmal „den
   Dritten" und erklärt es nicht.

## 6. Aufgabe 1: Das Porträt

**Anlage 2 ist die einzige Figur des Spiels ohne gemaltes Bild.** In
`assets/portraets/anlage2.png` steht ein selbst gezeichneter Platzhalter aus
`tools/anlage2-portraet.py`: dasselbe Motiv in derselben Palette, geometrisch statt gemalt.

Sie ist zugleich die einzige Figur **ohne Sprite**. `gespraechPortrait()` fällt bei allen
anderen auf einen gemessenen Sprite-Ausschnitt zurück; bei ihr gibt es nichts, worauf man
zurückfällt. Ohne Datei bliebe ihr Porträtfeld dunkel. Der Platzhalter ist deshalb keine
Bequemlichkeit, sondern eine Stütze, und er wird erst entfernt, wenn das gemalte Bild liegt.

**Der Prompt steht fertig** als Nr. 21 in `figuren-bildprompts.md`, mit Begründung: das Blatt
bleibt ausdrücklich `blank`, weil ein Schriftstück mit erfundener Aufschrift eine erfundene
Aussage wäre und diese Figur ihre Aussage im Spiel selbst macht. Die Heftklammer ist die
Figur, nicht das Papier.

**Der Weg ist der übliche und in `figuren-bildprompts.md` beschrieben:** Original nach
`assets/figuren/21-anlage2.jpg`, Eintrag in `TAFEL` in `tools/figuren-px.py`, dann
`python3 tools/figuren-px.py --tafel` (rechnet auf 128×128 und 32 Farben herunter, wie bei
den vierzehn anderen, die dort stehen).

Zwei Dinge, die man sonst zweimal misst:

* `tools/portraet-farben.py` fasst sie **nicht** an. Sie hat keine Haare und steht nicht in
  `DORF_FIGUREN`; der Farbabgleich, der für die Dorffiguren läuft, hat bei ihr kein Ziel.
* Der Einzeldatei-Build backt `assets/portraets/` mit ein, `assets/figuren/` nicht. Prüfe
  nach dem Tausch beide Ladewege, den Server und `dist/index.html` über `file://`.

## 7. Aufgabe 2: Die Doku-Schuld seit T3

T3 hat den Kommentarkanal von Knöterich an Anlage 2 übergeben: aus `RANDNOTIZ` wurde
`ANLAGE2_NOTIZ`, aus `knRandnotiz()` wurde `anlage2Notiz()`. T4 hat drei Anlässe, den
Schalter `allein` und den Umschlag dazugelegt. **Zwei Dokumente sind dabei
stehengeblieben und beschreiben heute einen Stand, den es nicht mehr gibt. Nachgezogen
wird nur eines davon, und der Unterschied ist der Kopf:**

* `superduper-gameplay-prompt.md`, Abschnitt „Randnotizen" und die Kanal-Tabelle darüber.
  Dort ist die Randnotiz noch Knöterichs Kanal, drei Sekunden lang, mit sieben Anlässen.
  **Dieses Dokument wird nachgezogen.** Es ist keine Protokoll-Datei, sondern eine
  Beschreibung des Ist-Zustands, und es ist genau dafür schon einmal nachgezogen worden:
  „docs: Weltbibel und Gameplay-Prompt auf den Stand nach U8 ziehen" (#49).
* `superduper-figurenleben-prompt.md` nennt `RANDNOTIZ` ebenfalls, samt einer Zeilennummer,
  die seit vielen Bauabschnitten nicht mehr stimmt. **Dieses Dokument wird nicht
  umgeschrieben.** Es trägt einen datierten Auftragskopf (`— ERLEDIGT (23.08.2026)`) und ist
  damit ein Protokoll: es beschreibt den Stand vor Bauabschnitt F1, nicht den von heute. Wenn
  die veraltete Stelle jemanden in die Irre führen könnte, ist der Weg ein **Vorspann
  darüber**, mit Datum und Verweis, so wie ihn `superduper-anlage2-prompt.md` nach T3
  bekommen hat. Der Unterschied zu den beiden Dokumenten darüber ist genau dieser Kopf, und
  er ist das Kriterium, an dem du auch bei jedem weiteren Dokument entscheidest.

**Nicht anfassen:** `superduper-reparatur-prompt.md`. Seine Befunde F11 und F54 nennen
`knRandnotiz()`, aber das ist ein datierter Befundbericht. Ein Bericht, der nachträglich recht
bekommt, ist kein Bericht mehr.

## 8. Aufgabe 3: Zwei freie Plätze im Umschlag

Der Umschlag trägt zwölf Zeilen, der Guard lässt bis vierzehn zu. Zwei Plätze stehen bewusst
leer, für zwei Momente, die es noch nicht gibt.

**Wer einen füllt, braucht drei Eintragungen:** die Zeile in `ANLAGE2_UMSCHLAG`, eine Stelle
im Code, die sie scharf schaltet, und den Schlüssel in der Liste `gearmt` im Guard. Wer eine
davon vergisst, erfährt es beim nächsten Start.

Kandidaten, die T4 gesehen und nicht genommen hat: der erste Abstieg in die Sperrablage
(`steigeAb()`), ein Schicht-Meilenstein in `endShift()`, die eingelöste Wiedereinsetzung.
Ungeeignet bleibt alles am Spielende: nach `winGame()` und in der Zustellung kommt das Band
nie wieder, und der Wortstamm „Zustell" liegt ohnehin in der Wortsperre.

**Die Bauform ist vorgegeben** und steht seit T3 auf dem fünften Blatt ihrer Einführung: eine
Feststellung, dann eine höfliche Einordnung. Kurz, ohne Pointe, ohne Maske, nur unter vier
Augen. **Kein Wort darüber, was sie dabei empfindet** — das ist Punkt 2 unter „Was sie nie
sagen wird" und der Unterschied zwischen dieser Figur und einer rührseligen.

Diese Aufgabe ist die kleinste der drei und darf entfallen, wenn der Projektinhaber die
beiden Plätze lieber für später aufhebt. Frag ihn.

## 9. Deckel, Sperren, Guards

Die Laufzeit-Guards melden in die Konsole und werfen nie. Beim Start zeigt die Konsole **23
Zeilen** Grundrauschen; jede Zeile darüber hinaus ist ein Befund. **Stille Konsole ist die
Abnahme.**

* `knAssertCaps`: Sprechblasen-Deckel `z1` bis 48, `z2` bis 32, Einzeiler bis 44 Zeichen.
  Zieht seit T4 auch `ANLAGE2_UMSCHLAG` ein, samt Gedankenstrich-, Emoji-, Kesselgrammatik-
  und Kaiser-Prüfung.
* `anlage2Assert`: Brandmauer über jede Zeile inklusive Tooltip, mindestens vier ungegatete
  Zeilen je Anlass, genau ein Gate-Schalter je Eintrag, Symmetrie Pool zu Auslöser, die
  Umschlag-Tabelle samt Einmaligkeits-Feldern, der Schalter `allein`, der Kipppunkt.
* `szeneAssert`: Erreichbarkeit aller Knoten, die Wortsperren, die `weiter:`/`wt:`-Verdrahtung,
  und seit T4 auch Merkernamen mit Ziffern (die Zeichenklasse war bis dahin `[a-zA-Z]` und
  damit blind dafür).
* `portraetAssert`: meldet zweimal, vor und nach dem Laden. **Der Guard, der bei Aufgabe 1
  zuerst laut wird.**
* `KAISER_PRAETERITUM`, `PRUEF_GEHEIM` (darunter das Wort „Alter"), `PRUEF_EMOJI`.

Dazu die Regeln, die kein Guard prüft und die trotzdem gelten: keine Gedankenstriche in
Spieltexten; die Wörter „ausschweifend", „weitschweifig" und „geschwätzig" sind gesperrt
(Zutaten-Kollision im Kessel); die Zeichendeckel gelten für Sprechblasen, nicht für Tafelzüge
der Szenenmaschine, dort gilt die Erzählform aus „Der Anfang erzählt".

**Jede neue Textquelle bekommt eine Prüfung.** Jeden neuen Guard-Zweig löst du einmal
absichtlich aus und protokollierst die Meldung wörtlich im Phasendokument. Ein Guard, den man
nie hat melden sehen, ist eine Behauptung.

## 10. Arbeitsweise des Hauses

* **Phasendokument.** Leg eines an, Überschrift mit `— OFFEN`, am Ende `— ERLEDIGT`,
  nachgezogen im selben Commit. Hinein gehören Befund, Entscheidungen, Guard-Protokolle und
  die Abnahme. Datierte Phasendokumente anderer Abschnitte bleiben unangetastet.
* **Kanon zuerst.** Was neu gilt, steht erst in der Weltbibel und dann im Code. Bei diesem
  Abschnitt ist der Kanon-Anteil klein: das Porträt ändert nichts an der Figur.
* **Prüfläufe** (Playwright, manuell, nicht CI). Stand nach T4, gemessen und nicht geschätzt:

  | Lauf | Stand |
  |---|---|
  | `tools/anlage2-pruef.mjs` | 69 von 69 |
  | `tools/gespraech-pruef.mjs` | 89 von 89 |
  | `tools/menue-pruef.mjs` | 78 von 78 |
  | `tools/empfang-pruef.mjs` | 76 von 76 |
  | `tools/szene-pruef.mjs` | 49 von 49 |
  | `tools/speicher-pruef.mjs` | 38 von 38 |

  Es gibt derzeit **keinen bekannten Rotstand**; der letzte (`mitteilung-pruef`) ist in der
  T3-Nachlese behoben worden. Wenn bei dir etwas rot ist, gehört es dir.
  In der Cloud-Umgebung: `CHROMIUM=/opt/pw-browsers/chromium-*/chrome-linux/chrome` und
  `PLAYWRIGHT_PFAD=/opt/node22/lib/node_modules/playwright/index.js`, auf `frameNo>0` warten,
  **nicht** auf `assetsReady`.
* **Syntaxprüfung reicht nicht.** `node --check` findet den häufigsten Fehler dieses Projekts
  nicht: eine `const` auf Skriptebene, die ein Guard weiter oben schon liest. Nach jedem
  Codeschritt einmal im Browser laden.
* **Abnahme ehrlich.** Live verifizieren statt behaupten. Für Aufgabe 1 gehört dazu, die
  Gesprächstafel von Anlage 2 mit dem neuen Bild einmal wirklich zu öffnen, in beiden
  Ladewegen.
* **Git.** Arbeit auf deinem designierten Zweig, Commit-Titel deutsch mit Präfix, keine
  Modellnamen in Commits, PRs oder Code. Push und Draft-PR; gemergt wird vom Projektinhaber
  als Merge-Commit `<Titel> (#N)`, kein Squash. Deploy läuft bei Push auf `main` automatisch
  über GitHub Pages; `github.io` ist aus der Cloud-Umgebung nicht abrufbar (Proxy),
  verifiziert wird über den Deployment-Status der API plus einen lokalen Bau mit
  `tools/build-single.mjs`.
* **Auslieferung.** Wie bei T1 bis T4 am Ende eine gebaute Einzeldatei an den Projektinhaber
  schicken.
* **Entscheidungen.** Was dem Projektinhaber gehört, legst du ihm früh als kurze
  Auswahlfragen vor, nicht spät als vollendete Tatsache.

## 11. Frag den Projektinhaber früh

1. **Das Bild selbst.** Prompt Nr. 21 steht, aber das Motiv muss jemand erzeugen. Fragen:
   Erzeugt er es selbst und legt die Datei ab, oder soll der Prompt vorher noch geschärft
   werden? Das ist die eine Abhängigkeit, an der dieser Abschnitt sonst stehenbleibt.
2. **Die Reihenfolge.** Drei Aufgaben, und nur die erste hängt an einer Lieferung von außen.
   Frag, ob du mit Aufgabe 2 anfangen sollst, während das Bild entsteht.
3. **Das Kürzel.** Dieser Abschnitt ist Grafik (Familie `G`) und Dokumentation zugleich.
   Lass dir sagen, ob er `G13` heißt oder in der `T`-Reihe weiterläuft, bevor du das
   Phasendokument benennst.
4. **Die zwei Umschlag-Plätze.** Füllen oder aufheben. Siehe Aufgabe 3.

## 12. Fertig ist es, wenn

* das gemalte Porträt liegt, in der Gesprächstafel erscheint und der Platzhalter erst danach
  seinen Dienst quittiert hat,
* `figuren-bildprompts.md` und die README-Zeile zu `tools/anlage2-portraet.py` den neuen
  Stand nennen,
* die stehengebliebenen Beschreibungsdokumente den Kanal beschreiben, den es wirklich gibt,
  und für jedes Dokument im Phasendokument steht, ob es nachgezogen oder als datiert
  stehengelassen wurde,
* alle Guards still sind, alle Prüfläufe grün, das Phasendokument auf `— ERLEDIGT` steht,
* und Anlage 2 einen sieht, wenn man mit ihr spricht. Sie hat vierzig Jahre darauf gewartet,
  dass jemand hinsieht. Es wäre schade, wenn ausgerechnet das Spiel es nicht täte.
