# Das Monstralministerium

Ministerium für Monsterangelegenheiten

Ein Browser-Action-RPG, in dem der Spieler nicht Held ist, sondern Außendienstler einer Monsterbehörde. Monster werden nicht erledigt, sie werden bearbeitet. Zielgruppe 10 bis 99, zwei Humor-Ebenen: Kinder verstehen die Situation, Erwachsene den Paragrafen.

Das Repo heißt aus historischen Gründen noch `superduper-adventure`.

## Starten

Eine einzige Datei, kein Build, kein Framework, kein npm. `index.html` im Browser zu öffnen reicht nicht ganz — die Grafik wird per `fetch` geladen, es braucht einen lokalen Server:

```bash
python3 serve.py
```

Dann `http://localhost:8378/adventure/` aufrufen.

**Nicht `dist/index.html` öffnen.** Die Datei entsteht nur im Pages-Build, liegt lokal oft veraltet herum und lässt funktionierende Features kaputt aussehen. Immer `index.html` im Wurzelverzeichnis.

## Steuerung

`W A S D` Bewegung · `Leertaste` oder Klick Angriff · `Q` oder `1` Trank · `E` Zauber · `R` Ultimate · `T` Zauberbaum · `I` Inventar und Befähigung · `Z` Zulagen · `K` Kessel · `M` Musik · `F` Kontextaktion · `Esc` schließt Panels der Reihe nach. Ein Klick oder Tipp **neben** ein offenes Panel schließt es ebenfalls, ohne dabei anzugreifen (seit U1).

Der erste Dienstantritt läuft seit E1 als Szene und seit E2 auf schwarzem Grund: Knöterich stellt sich in fünf Zügen vor, dann erzählt er das Intro (seit SZ1 neun Blätter statt der fünf Anrisstafeln), dann öffnet sich das Dorf für den Empfang. Alles im selben Gesprächsfenster, das auch die Dorffiguren benutzen; Antworten wählen wie unten beschrieben. Der Einstellungsvordruck steckt dahinter, blättert seit E2 statt zu rollen und bleibt aus der Szene, aus dem Startbild und aus dem Amt lesbar; `ÜBERSPRINGEN` auf der ersten Tafel führt direkt zu ihm.

Im Gespräch mit einer Dorffigur (seit U3): `F` öffnet die Tafel, ein zweiter Druck redet darin weiter. Seit F1 steht dort eine **fünfte Antwortzeile**, sobald die Figur einen Gesprächsbaum hat und er fällig ist: „Erzählen Sie von früher." führt hinein, der Abschied bleibt die letzte Zeile. Solange sie offen ist, wählen `1` bis `4`, Pfeil hoch/runter plus `Eingabe` oder die Maus eine Antwort — die Ziffernreihe gehört dann der Tafel und nicht dem Trank, `Q` bleibt er. Die Schriftgröße steht im Inventar unter **SCHRIFT** in drei Stufen und wird gemerkt.

Die Tafel ist seit U4 zweigeteilt: **oben** das Gegenüber mit Porträt, Namen und dem Satz, der einläuft, **unten** der Spieler mit seiner Amtsbezeichnung, den Antworten und seinem eigenen Bild. Auf dem Telefon fällt das zweite Bild weg, die Teilung bleibt. Reicht der Platz dort nicht, gibt seit U6 die **obere** Hälfte nach: die Antworten stehen immer vollständig da, der Satz des Gegenübers rollt und läuft dem Tippwerk hinterher. Bis U6 war es umgekehrt, und auf einem kurzen Schirm bei großer Schrift stand die Antwortliste vollständig außerhalb der Tafel.

Knöterich ist seit U6 ansprechbar wie jede Dorffigur: `F` an seiner Kachel heißt jetzt **Ansprechen** statt **Nachfragen** und öffnet seine Tafel mit gemaltem Porträt, sechs Grundzeilen, einer Aktzeile und einer Anredeform. Das Nachschlagen der letzten Dienstzettel ist dabei nicht weggefallen, sondern hineingewandert: es ist die fünfte Antwort „Was stand da eben?", sobald es etwas nachzuschlagen gibt. Dasselbe Porträt trägt seither auch der Dienstzettel im oberen Band.

Seit F1 hat jede Dorffigur einen **Gesprächsbaum** (dreizehn insgesamt, Lott und Pahl teilen sich einen mit Sprecherwechsel, Knöterich hat keinen): ein Hub, sechs Fragen, die sich staffeln, und am Ende eine Wahl mit zwei Ausgängen. Die Welt läuft dabei weiter, anders als in den Szenen aus SZ2. Dazu kommen rund 170 neue Zeilenpaare, die an Dienstalter, Stufe, Rang, Skillung, Schichtphase oder einem Merker hängen.

Seit Langvorgang 4 läuft im Dorf ein **Strang über mehrere Figuren**: Lisbeths sechster Praktikumsbericht braucht eine weisungsbefugte Unterschrift, und die Suche danach geht in acht Schritten über Lisbeth, Zwirn, Bramsche, Vorblatt und zuletzt Nörgel, der unterschreibt, weil er im Dienst ist. Er läuft im Grundzeilen-Kreislauf mit, ein Schritt je Ansprechen, ab Akt II, und braucht keinen Umweg: keine Taste, kein Ort, kein Gegenstand. Der Reiter `Akten` zählt ihn unter LAUFENDE VORGÄNGE mit. Wer ihn abschließt, hört danach zwei Zeilen mehr von Lisbeth und zwei von Nörgel und bekommt im Finale des fünften Aktes einen Absatz, den es sonst nicht gibt. Wer ihn nie anfängt, merkt nichts davon: er ist der einzige Langvorgang, den die Weltbibel für den Hauptvorgang notwendig nennt, und er ist trotzdem an keiner Stelle Bedingung.

Im Dorf stehen seit W11 vierzehn ansprechbare Figuren statt elf, und drei davon sind nicht von Anfang an da: der Wetterbeauftragte Nieselbeck steht ab der ersten Schicht, Reichsbotin Umlauf ab Akt II (Schicht 11) und Reichsministerialdirektor zu Händen Vorblatt ab Akt III (Schicht 21). Zehn der elf bisherigen Figuren bekommen im Lauf der Akte je zwei zusätzliche Sätze. Im freien Spiel ohne Schichten steht alles von Anfang an offen.

Seit SZ2 gibt es drei Stellen, an denen statt eines Gesprächs eine Szene beginnt. Während sie läuft, steht die Welt still: kein Monster bewegt sich, die Schichtuhr geht nicht weiter. Weiter geht es nur, wenn jemand drückt. Die drei sind: **Reichsbotin Umlauf ansprechen** ab Akt II, die Zeile **▸ Die zweite Schublade** im Amtspanel ab Akt III, und **Knöterich ansprechen** ab Akt IV, sobald die vollständige Anschrift vorliegt. Jede läuft genau einmal; danach reden die Figuren wieder normal. Wer anschließend zu Lott und Pahl auf der Bank geht, hört ihren Kommentar dazu, ebenfalls genau einmal.

Touch: virtueller Joystick links, Kampf-Cluster rechts. Der Daumenfächer bleibt mit offenem Panel bedienbar.

## Spielstand

Seit SP speichert das Spiel **auf dem Gerät**, und zwar von selbst: sobald der Tab in den Hintergrund geht oder die Seite geschlossen wird, liegt die laufende Schicht in der Ablage, und das Startbild bietet beim nächsten Mal **Schicht fortsetzen** an. Zurück kommen Stufe, Erfahrung, Leben, Mana, Skillung, Zauber, Beutel, Tasche, Ausrüstung, Position, Schichtuhr und Auftragsstand. Der Anruf in Minute 20 kostet damit nichts mehr. Möglich ist das, weil die Welt über Sitzungen hinweg identisch ist: `genMap()` zieht aus einem festen Seed, zwei Ladevorgänge ergeben dieselbe Karte (gemessen, `tools/speicher-pruef.mjs`).

Nicht gespeichert werden Monster, Beute am Boden und Geschosse — die kommen beim Fortsetzen neu. Nicht gespeichert wird außerdem in einer Kammer, im Schattenland, im Tod und in den Überstunden; wer dort auf **Speichern** drückt, bekommt den Grund gesagt statt einer Fehlmeldung.

Im Inventar steht unter **💾 SPIELSTAND** dasselbe von Hand, plus **Export** und **Import**: Export legt eine Datei mit allen vier Schlüsseln ab (Amt, Kladde, Knöterich, laufende Schicht), Import liest sie ein und lädt die Seite neu — dadurch laufen die vorhandenen Loader mit ihren Whitelists und Klemmen darüber, statt dass ein zweiter Weg sie umgeht. Das ist der Weg für den Gerätewechsel, denn die Ablage hängt an der Origin: `localhost` und die ausgelieferte Seite sind zwei verschiedene Speicher.

Dieser eine Kasten redet **Technik statt Amtsdeutsch** — „Spielstand", „Speichern", „Export" heißen dort wörtlich so. Das ist die einzige bewusste Ausnahme vom Ton des Hauses und eine Entscheidung: eine Datensicherung, die sich „Antrag auf Beglaubigung einer Aktenabschrift" nennt, findet im Zweifel niemand, und wer sie nicht findet, verliert seinen Fortschritt an einen Witz. Der Gag steht überall sonst.

## Entwickeln

Der gesamte Code liegt in `index.html`, rund 8500 Zeilen JavaScript in einem `<script>`-Block. Syntaxcheck vor jedem Commit:

```bash
python3 -c "import re;h=open('index.html').read();m=re.search(r'<script>(.*)</script>',h,re.DOTALL);open('/tmp/c.js','w').write(m.group(1))" && node --check /tmp/c.js
```

Das fängt Syntaxfehler, **nicht** die Temporal Dead Zone. Der häufigste echte Fehler in diesem Projekt ist ein `ReferenceError` beim Laden, weil eine Funktion, die schon auf Skriptebene läuft, eine erst später deklarierte Konstante liest. Den findet nur der Browser mit offener Konsole.

Das Spiel prüft sich beim Laden selbst. Neunzehn selbstaufrufende Guards (`blaetterAssert`, `goldAssert`, `speicherAssert`, `knAssertCaps`, `rangAssert`, `auftragAssertBrett`, `langAssert`, `vorgangAssert`, `anredeAssert`, `monsterAssert`, `zauberAssert`, `befaehigungAssert`, `zulagenAssert`, `dienstAssert`, `wiederAssert`, `gestaltAssert`, `gespraechAssert`, `schriftAssert`, `szeneAssert`) belegen Zeichendeckel, Formregeln, Tabellenvollständigkeit, Erreichbarkeit, die Schichtabrechnung, seit M1 die Kampfwerte gegen den Referenzspieler, seit M2 zusätzlich die Modelle gegen die Angriffsart und die Grenzen des Sonderprüfers, seit Z2 die Zauberbefugnis samt Manakopplung, seit S1 die Spreizung zwischen gesteigertem und ungesteigertem Spieler samt Kraftbedarf und Manapool, seit K1 den Zulagen-Katalog samt Formregeln (keine Zahl, kein Gedankenstrich im Kartentext), die Fächerleiter, die Ziehung, Stapel- und Kampfsperre und die an `recalc()` gemessene Wirkung jeder Karte, seit W8 den Sperrvermerk auf die Akte im Einstellungsvordruck, seit W10 die beidseitige Klemme des gespeicherten Dienststandes, seit P1 die Lesarten der Frisuren samt Haarfarbenauswahl, seit U3 die Namensschilder samt Antwortlisten sowie die Schriftstufen, seit U4 zusätzlich, dass jedes Stück der Gesprächstafel in seiner Hälfte hängt, und seit E1 die Erreichbarkeit jeder Frage im Empfang (seit SZ1 als `szeneAssert` über jede eingetragene Szene, samt der Wortsperre, die jetzt an der Szene hängt statt am Modul), seit E2 zusätzlich, dass beim Blättern des Vordrucks keine Zeile verlorengeht, seit W11, dass jede Dorffigur für jeden Akt, in dem sie im Dorf steht, eine Aktzeile hat und für keinen anderen, dass jeder Zusatzblock genau einen Schalter trägt (Merker oder Akt), und dass in keinem Text des Spiels vom Kaiser in der Vergangenheitsform die Rede ist, und seit SZ2, dass jede Szene, die an einer Figur hängt, diese Figur auch kennt und sagt, wann sie fällig wird, dass jeder Merker, den eine Szene setzt, im Spielstand angelegt ist, und dass der Nachklang einer Szene bei Lott und bei Pahl Zeilen hat statt in eine leere Bank zu laufen, und seit Langvorgang 4, dass ein Zusatzblock am Schalter `lang` einen Strang nennt, den es gibt, dass die Sprechblasen der Langvorgänge ihre Abkürzungen auflösen (sie waren die einzigen des Spiels ohne diese Prüfung), und dass das Finale des fünften Aktes in beiden Strangzuständen gerendert wird, weil sein viertes Puzzleteil seither zwei Fassungen hat. Seit U6 lesen vier von ihnen eine Figur mehr: `knAssertCaps()` läuft über `DORF_FIGUREN.concat([KN_FIGUR])` und hält Knöterichs Tafelzeilen an dieselben Deckel und dieselbe Sperrliste wie die des Dorfes, `figurenFarbenAssert()` liest denselben Eintrag statt sich einen zu bauen, `gespraechAssert()` prüft seine Antwortliste in beiden Ständen (vier ohne Dienstzettel, fünf mit), und `anredeAssert()` verlangt auch für ihn eine Anredeform. Dazu kommen zwei, die nicht auf Skriptebene laufen, sondern erst hinter `loadAssets()`, weil sie die gebackenen Blätter lesen: `npcAnkerAssert()` misst die Fußlinie, und `dorfSichtAssert()` (seit G6) rechnet nach, ob jede Dorffigur ein Blatt hat und ob sie samt Wanderleine vor den Gebäudefassaden steht statt dahinter. Seit G11 kommt `koppelAssert()` dazu, der erste, der direkt hinter `genMap()` läuft statt hinter `loadAssets()`: er misst die gesetzte Welt (Zaunring, Tor, Leine der Weidetiere, Schild, Boot), und die entsteht früher als die Bilder. Seit G12 steht `steinbruchAssert()` daneben, der zweite dieser Art: er misst die gesuchten Buchten, ihre Pflanzen und die Lebensräume der Tiere — jedes Ding auf dem Grund, den es braucht, und jedes Tier, das schwimmt oder fliegt, an einer Leine. Seit dem G9-Nachtrag steht dort auch `garderobeAssert()`, und der misst das Einzige, was `figurenFarbenAssert()` nicht sehen kann: nicht ob die Kleidungsform in der Garderobe steht, sondern ob es dazu ein Blatt gibt. Er ist aus einem Fund entstanden, den die Tabellenprüfung drei Bauabschnitte lang nicht hatte — Wirt Fass und Herr Lott standen ohne Hemd im Dorf, weil hinter `hemd:'karo'` keine Datei lag. Seit SP kommt `speicherAssert()` dazu, und er ist der erste, der nicht das laufende Skript prüft, sondern den **Rundweg durch die Ablage**: schreiben, lesen, klemmen. Genau diesen Weg hat bis dahin kein Prüfer gemessen, und genau deshalb konnten zwei Felder jahrelang geschrieben und nie geladen werden (SP1). Ein Guard, der nur das laufende Skript ansieht, hätte den Fund nie gemacht. **Sie werfen nie, sie melden.** Eine stille Konsole ist das Abnahmekriterium. *(Diese Zeile nannte bis zum 20.08.2026 sieben und kannte weder `npcAnkerAssert` aus `9b553a8` noch die seither dazugekommenen.)*

Eine Warnung, die immer da steht, ist keine: fünf `Sprite fehlt`-Zeilen standen seit W3 in jeder Konsole, und dahinter steckten fünf unsichtbare Dorffiguren (G6). Wer hier eine Meldung sieht, die „schon immer" da war, hat einen Fund, keine Tapete.

### Eine frische Sitzung einrichten

**Im frischen Klon fehlt die Grafik, und das Spiel startet dann gar nicht.** `assets/cf/{player,deco,enemies,tiles,dungeon,ui}` steht in der `.gitignore` (Lizenzgrund siehe `assets/cf/README.md`). Woran es dann hängt, ist nachgemessen und nicht das, was naheliegt: `loadAssets()` läuft sauber durch (jedes fehlende Bild wird zu `null` aufgelöst) und setzt `assetsReady = true`. Es scheitert erst zwei Zeilen später an `bakeUiSkin()`, das `SHEETS['cfui_frame'].img.src` liest:

```
PAGEERROR: TypeError: Cannot read properties of undefined (reading 'img')
```

Damit reißt der ganze `.then()`-Block ab, `showStartScreen()` und `requestAnimationFrame(loop)` laufen nie, `frameNo` bleibt 0 und der Ladebildschirm steht bei „314 / 322". Alle vierzehn Guards auf Skriptebene haben vorher brav „in Ordnung" gemeldet, das Bild sieht also nach einem Rätsel aus und ist keins. *(Der Kopf von `tools/monster-messlauf.mjs` schreibt dasselbe Symptom einer Wartestellung auf `assetsReady` zu. Das stimmt nicht, die Flagge steht auf `true`.)*

Praktische Folge für jede Prüfschleife: **auf `frameNo > 0` warten, nicht auf `assetsReady`.** Die Flagge ist auch dann gesetzt, wenn kein einziges Bild geladen wurde.

Zuerst also die Grafik danebenlegen:

```bash
git clone --depth 1 git@github.com:wurstbrotdlx/superduper-adventure-assets.git /tmp/cf-assets
cp -r /tmp/cf-assets/{deco,dungeon,enemies,player,tiles,ui} assets/cf/
```

Dasselbe tut der CI-Build, nur per Deploy Key (siehe `.github/workflows/pages.yml`). In einer Claude-Code-Websitzung geht das Repo über `add_repo` dazu; wer PNGs **hineinschreiben** will, braucht dabei Schreibrechte, lesend reicht nur zum Prüfen.

**Verifiziert wird im Browser, nicht im Kopf.** Die dritte Mitarbeitsregel unten meint das wörtlich. Server starten, Seite laden, Konsole lesen:

```bash
python3 serve.py &
node - <<'EOF'
const { chromium } = (await import('playwright')).default;
const b = await chromium.launch({ executablePath: process.env.CHROMIUM });
const p = await b.newPage();
p.on('console', m => console.log(m.type() + ': ' + m.text()));
p.on('pageerror', e => console.log('PAGEERROR ' + e));
await p.goto('http://127.0.0.1:8378/index.html', { waitUntil: 'load' });
await p.waitForFunction(() => typeof frameNo !== 'undefined' && frameNo > 0, null, { timeout: 60000 });
await p.waitForTimeout(2500);
await b.close();
EOF
```

`CHROMIUM` zeigt auf den Playwright-Chromium der Umgebung (in der Websitzung unter `/opt/pw-browsers/chromium-*/chrome-linux/chrome`, `playwright install` ist dort weder nötig noch erlaubt). Die repo-eigenen Messläufe unter `tools/` lesen zusätzlich `PLAYWRIGHT_PFAD`, wenn das Paket nicht im Projekt liegt:

```bash
PLAYWRIGHT_PFAD=/pfad/zu/node_modules/playwright/index.js CHROMIUM=$CHROMIUM node tools/spaziergang-messlauf.mjs
```

Was die Sitzung dabei ausgibt, ist die Abnahme: jeder Guard meldet seine Zeile „in Ordnung", sonst steht dort nichts. (Seit U5 waren es vierzehn Zeilen — `gespraechAssert()` meldet zwei, und `portraetAssert()` kommt wie `dorfSichtAssert()` erst nach dem Laden dazu. Seit dem G9-Nachtrag sind es sechzehn: `garderobeAssert()` kommt dazu, und `portraetAssert()` meldet zweimal, vor und nach dem Laden. Seit G11 siebzehn, seit G12 achtzehn, seit M4 neunzehn und seit SZ3 zwanzig: `stollenAssert()` und `stopfenAssert()` kommen dazu. Seit K1 einundzwanzig und seit SP **zweiundzwanzig**, mit `zulagenAssert()` und `speicherAssert()` — am 24.08.2026 nachgezählt, nicht geschätzt.) Vor dem Ausliefern zusätzlich `node tools/build-single.mjs` und die entstandene `dist/index.html` per `file://` laden — der Build nimmt einen anderen Ladeweg (`ASSET_BLOBS` statt HTTP) und kann deshalb Fehler zeigen, die im Quellbaum keine sind, und umgekehrt.

## Dokumente

| Datei | Was |
|---|---|
| `superduper-weltbibel.md` | Die Autorität: Welt, Figuren, Humor, Formregeln, Bauabschnitte. Bei Konflikt zwischen Code und Weltbibel gewinnt die Weltbibel. |
| `weltgeschichte.md` | Der Erzählstoff: die Chronik von Jahr 0 bis heute, das Reich und sein Adel, vier neue Figuren, drei Blattserien, vier Langvorgänge und neun ausgeschriebene Szenen samt Intro und Abspann. Zuwachs zur Weltbibel, nicht Ersatz: bei Konflikt gewinnt die Weltbibel. |
| `superduper-gameplay-prompt.md` | Gameplay-Phasen 1 bis 6, Zählertabellen |
| `superduper-grafik-prompt.md` | Grafik-Phasen G0 bis G5 |
| `superduper-reparatur-prompt.md` | Reparaturrunden R1 bis R9 |
| `superduper-figurenleben-prompt.md` | Der Prompt zu Bauabschnitt F1: Hintergrundgeschichten für alle Figuren, die Dialoge, die daraus abgeleitet werden, je Figur ein Gesprächsbaum auf der Szenenmaschine, und der laufende Gag über Abkürzungen. Enthält die Auslöser-Tabelle (Dienstzeit, Schichtphase, Stufe, Rang, Skillung, Ereignis), die Bauarten der erzählerischen Sackgasse, die gezählten Dosen für Popkultur und vierte Wand und die Abnahme dazu. Ausgeführt, siehe `phase-f1-figurenleben.md`. |
| `phase-*.md` | Eine Bauanleitung je Bauabschnitt, mit Abnahme und Prüfprotokoll |
| `figuren-dorf.md`, `blaetter-serie-a-b.md` | Inhaltslieferungen (Figurentexte, Aktenfunde) |
| `figuren-leben.md` | Inhaltslieferung F1: die Hintergrundgeschichten des ganzen Ensembles (18 Figuren, je zwölf Felder samt der einen neuen Tatsache), die Abkürzungstabelle und alle Dialogzeilen aus F1c mit gegengezählten Längen. |
| `phase-f1-figurenleben.md` | Bauabschnitt F1: vier Entscheidungen, fünf Funde (darunter, dass `\b` in JavaScript ASCII-basiert ist und zwischen T und ü eine Wortgrenze liegt), das Prüfprotokoll und die Berichtigung der Baumzahl |
| `WELT-ERWEITERUNG-2026-08-24.md` | Was aus „größere Karte, Portale, betretbare Höhlen" wird, wenn man die Weltbibel dazu befragt: Höhlen gibt es seit G1 (offen ist die zweite Ebene), Portale heißen Rohrpost und sind seit 741 verstopft (SZ3), und die Karte ist gemessen groß und dünn. Stand, kein Wegweiser |
| `WUESTENFRAGE-2026-08-24.md` | Ob die Aschewüste ein eigenes Wüstenset bekommt — die Frage, die G12 an die Weltbibel weitergereicht hat. Antwort: nein, aus drei unabhängigen Gründen. Die Aschewüste ist keine Wüste, sondern der Brandabschnitt von 985; der Mumienwitz ist seit Phase 2 erzählt und steht im Ruinenband; und der vorgeschlagene Bodenaustausch geht gar nicht, weil das Pack keine Bodenfläche hat und seine einzige flache Füllkachel exakt die Farbe des Dorfwegs trägt. Stand, kein Wegweiser |
| `SPEICHERFRAGE-2026-08-24.md` | Was aus „gezielte Speicherung" wird, wenn man erst die Ablage vermisst: drei Akten, zwei Bildschirmwerte, eine bewusst flüchtige Schicht — und zwei Funde vor allen Möglichkeiten. `amt.stopfenSchicht`/`amt.adressSchicht` werden gespeichert und nie geladen (browser-gemessen; im Fenster vor Szene 6 nimmt ein Neuladen dem Spielstand Vorblatts Ankunft für immer), und der Übertrag überlebt die Nacht nicht, obwohl der Dienstbericht „mitgenommen" druckt. Empfehlung danach: die beglaubigte Abschrift (Export/Import über die vorhandenen Loader), Aktenvernichtung, Ablage-Meldung; Wiedervorlage nur in der Dorf-Fassung. Stand, kein Wegweiser |
| `phase-sp-spielstand.md` | Bauabschnitt SP: gerätebezogenes Speichern und Export/Import. Warum dieser eine Kasten Technik statt Amtsdeutsch redet, der Fund, der alles trägt (die Welt ist über Sitzungen hinweg identisch — `genMap()` zieht aus einem festen Seed, gemessen über zwei Ladevorgänge, und damit wurde aus dem angekündigten Systembau ein Anbau), die zwei reparierten Funde SP1 und SP2 samt der Heilung für getroffene Bestände, das enge Tor des Spielstands mit einem Grund je Bedingung, die Frischeprüfung gegen die zweite Abrechnung derselben Schicht, Klemmen, die aus den Tabellen gerechnet statt gesetzt werden, und warum der Import die Inhalte ausdrücklich nicht prüft, sondern die Seite neu lädt. Mit dem, was offen bleibt: Kammer, `persist()`, Privatmodus-Meldung, Löschknopf |
| `phase-sz4-finale.md` | Bauabschnitt SZ4, Szenen 7, 8 und 9: die Versuchung im Amtsflur, die Zustellung, der Abspann. Warum die Versammlung gebaut ist und nicht die acht Einzelgespräche, die die Weltgeschichte als billigere Fassung anbietet (der Sprecherwechsel kann es seit SZ1 und nennt genau diese Szene als Anlass), warum die vier Antwortzeilen drei Fragen und ein Ausgang sind, warum der Zwischenbescheid auf der Ausfertigung an genau einem Merker hängt, und warum aus drei Panelschritten sechs geworden sind statt neun. Dazu zwei Funde aus dem Bild: der Tafelstapel wusste nicht, wer spricht (Bild 11 ist eine Wechselrede und las sich als Selbstgespräch), und acht von dreizehn Bildern schoben ihren eigenen Knopf unter den Fensterrand |
| `phase-sz3-stopfen.md` | Bauabschnitt SZ3, Szenen 5 und 6: der Stopfen im Steinfeld und Vorblatts Entklammerung. Warum die brummende Stelle keinen Marker bekommt und schon vor Akt IV brummt, warum der Strang als zweiter in `LANGVORGAENGE` steht (Zapf trägt drei, und die Gießkanne hat seinen einen Satz verschluckt), warum Serie I der erste Fundweg ist, der an einem Ereignis hängt statt an einem Ort, warum der Postregen ausdrücklich nicht der des Finales ist, und die eine Entscheidung, die nicht in der Weltgeschichte stand: Vorblatt kommt an, statt dazustehen. Mit dem, was das an Langvorgang 4 und zwei Prüfwerkzeugen gekostet hat |
| `phase-m4-zweite-ebene.md` | Bauabschnitt M4, der erste Schritt aus der Welt-Erweiterung: die Leiter, die M3 liegen ließ, bekommt ihr Untergeschoss. Warum nur die Sperrablage eine zweite Ebene hat und die Zahl am Kammersatz hängt statt am Gebührenbescheid, warum das Loch im Boden von Anfang an sichtbar ist und trotzdem erst nach der Truhe aufnimmt, warum unten kein Gold liegt (die Kammern sind laut `KAMMER-MESSUNG` ohnehin der schnelle Geldkanal, und die Signatur nennt Rüstung und Waffe), und der Fund aus dem Bau: die Stollen-Truhe zahlte seit M3 aus dem Roster der Unteren Registratur |
| `phase-g11-koppel-schild-boot.md` | Bauabschnitt G11, der erste Griff in den Deko-Steinbruch: die eingezäunte Koppel mit sechs Tieren an der Leine, das Schild am Amt, das Boot an der Tilgung. Warum ein Zaun ohne Leine eine Behauptung wäre, warum das größte freie Rechteck im Weidegürtel 28x2 misst, und warum sechs Zaunzellen von Hand geschnitten sind |
| `phase-g12-steinbruch-rest.md` | Bauabschnitt G12, der Rest des Deko-Steinbruchs: erst die Vermessung, dann die Entscheidungen, dann sechs Buchten. Warum es auf dieser Karte keinen Teich gibt (im Umkreis 60 ums Dorf keine einzige Wasserkachel), warum die Küste trotzdem besucht wird (über die Kammertüren, nicht über die Wege), warum die Brücken gestrichen sind (größter gesparter Umweg: siebzehn Kacheln), warum es die Krähen aus der Bestandsliste im Pack gar nicht gibt — und dann das Gebaute: `lebensraum` als vierte Bauart neben `land`, die Wasserzeilen, die Ente und Schwan selbst mitbringen und die Gans nicht hat, das Kapybara mit seinem eigenen Teich im richtigen Ton am falschen Ort, und der Fehler, den nur das Bild gezeigt hat. Im Nachtrag der Stein, der seit G4 acht Pixel über seinem eigenen Schatten schwebte: `'strip'` setzt den Anker auf die Zellunterkante, und `Rock_1_Anim.png` hat vier leere Zeilen darunter |
| `phase-g9-nachtrag-garderobe.md` | G9-Nachtrag: die vier Dateien, an die G9 die Garderobe gehängt hat, ohne dass sie je ins Grafikpaket kamen. Warum vier `Sprite fehlt`-Gruppen zwei Dorffiguren ohne Hemd bedeuteten, der Ersatzweg `CF_GARDEROBE_ERSATZ`, der neue Guard `garderobeAssert()` und zwei nachgezogene Sollwerte im Figurenfarben-Messlauf |
| `phase-f1-nachtrag-pruefwerkzeuge.md` | F1-Nachtrag: warum `szene-pruef.mjs` und `reich-pruef.mjs` fünfundzwanzig Fehlschläge meldeten, ohne dass eine Zusage gebrochen war. Pflichtfelder, die der Guard nie verlangt hat, eine Summe, die immer mehr Bauabschnitte mitzählt, und der Grund, warum sich ein einzelner Zusatzblock nicht als Differenz über `amt.schichten` messen lässt (mit den Schichten steigt der Rang) |
| `phase-lv4-praktikumsbericht.md` | Langvorgang 4: Lisbeths sechster Praktikumsbericht, der achte Strang in `LANGVORGAENGE`. Wie die eine Ausnahme aus Kapitel 10 gebaut ist (erzählerisch notwendig, mechanisch nirgends Bedingung), warum Knöterich nicht in der Kette steht, obwohl das `a. D.` hinter seinem Titel die ganze Begründung wäre, und zwei Funde: ein Strangschritt an einer Figur, die noch gar nicht im Dorf steht, und die Abkürzungsprüfung, die die Langvorgänge nie gesehen hat |
| `phase-m1-monsterkatalog.md` | Bauabschnitt M1: der Katalog im Code, Entscheidungen und Prüfprotokoll |
| `phase-z1-zauberbalance.md` | Bauabschnitt Z1: warum Zauberspam jeden Nahkampf schlug, vier Eingriffe, Vorher-Nachher-Messung |
| `phase-m2-nahfeld-und-namen.md` | Bauabschnitt M2: Schwierigkeit nach Entfernung vom Dorf, der Sonderprüfer, Namen über den Köpfen, zwei versiegelte Gegner |
| `phase-z2-zauberbefugnis.md` | Bauabschnitt Z2: Zauber ab Stufe 4, Mana wird im Nahkampf erarbeitet, Spammen verhungert an der Leiste |
| `phase-s1-befaehigung.md` | Bauabschnitt S1: warum Steigern folgenlos war, die Umschichtung von der Stufe in den Punkt, höhere Zauberpreise, der Kraftbedarf, Vorher-Nachher-Messung mit zwei Bauweisen |
| `phase-k1-zulagen.md` | Bauabschnitt K1: das Kartensystem. Warum es Zulagen heißt und nicht Karten oder Befugnisse (beide Wörter waren vergeben), warum dreizehn der fünfzehn Familien ohne eine einzige neue Formel auskamen und welche zwei Hooks wirklich neu sind, die Eichung der drei Stufen gegen die Kesselwirkungen, warum acht Familien stapeln und sieben nicht, und der Fund am Rand: der Erfahrungsbalken im HUD rechnete seit S1 nach der alten Stufenleiter |
| `phase-w8-anfang.md` | Bauabschnitt W8: Einstellungsvordruck, Dienstanweisung, Laufbahnziel, und warum der Anfang kein Prolog ist |
| `phase-w10-wiedereinsetzung.md` | Bauabschnitt W10: der Antrag auf Wiedereinsetzung, die einzige Art, zweimal derselbe Mensch zu sein |
| `phase-g6-dorfsicht.md` | Bauabschnitt G6: sechs von elf Dorffiguren waren nicht zu sehen. Fünf fehlende Sprite-Blätter, ein Bürgermeister hinter der Amtsfassade, und der Guard, der beides künftig meldet |
| `phase-w-lager.md` | Bauabschnitt W-Lager: das Lager der Beschwerden. Warum ein Militärlager doch in diese Welt passt, die Figur am Tor ohne Titel, der erste Gegner, der nie zuerst angreift, und ein Sprite-Blatt mit drei Rastern übereinander |
| `phase-w-noergel.md` | Bauabschnitt W-Nörgel: Nörgel und das Lager. Vier Zusatzzeilen, die erst kommen, wenn der Spieler selbst dort war, der Merker dafür, und warum es kein achter Langvorgang geworden ist |
| `phase-m3-stollen.md` | Bauabschnitt M3: das sechste Katalogbiom. Warum kein einziger kammerexklusiver Gegner in die Untere Registratur passte, ein dritter Kammersatz aus einem leeren Ordner, und eine Vorgangsart, die beim Erledigen in zwei kleinere zerfällt |
| `phase-g6-nachtrag-dorfblaetter.md` | Die fünf offenen Dorf-Blätter aus G6, nachgelegt. Kein Code, aber die Entscheidung, wie `Fisherman_Fin` gerastert ist: 9 Spalten à 64, nicht 18 à 32 wie das Manifest führte |
| `phase-u2-menuegrafik.md` | Bauabschnitt U2: die Menüs bekommen Pack-Grafik statt CSS, das Pixelkunst nachahmt. Vier Zellen, die Regel „Formen aus dem Pack, Flächen bleiben dunkel", und warum eine richtig gemessene Koordinate noch keine passende Zelle ist |
| `phase-u3-gespraech.md` | Bauabschnitt U3: Namen über den Köpfen, das Gesprächsfenster mit vier Antworten, ein Regler für alle 176 Schriftgrößen. Dazu der Nebenbefund, warum sich der Einstellungsvordruck auf einem Telefon nicht wegklicken ließ |
| `phase-u5-portraets.md` | Bauabschnitt U5: die gemalten Figurenporträts kommen in die obere Tafelhälfte. Warum das Bildfeld dafür quadratisch wird, warum der Sprite-Ausschnitt als Rückfallweg stehen bleibt (Lott und Pahl teilen sich ein Bild) und warum 65 KB statt 3,0 MB in den Build gehen |
| `phase-u4-dialogtafel.md` | Bauabschnitt U4: die Gesprächstafel zerfällt in zwei Hälften. Oben der NPC mit Porträt und laufendem Satz, unten der Spieler mit Amtsbezeichnung, Antworten und eigenem Bild — und warum die Antworten vorher wie ein Nachsatz derselben Person aussahen |
| `phase-u6-knoeterich-tafel.md` | Bauabschnitt U6: Knöterich bekommt eine Gesprächstafel, sein gemaltes Porträt auch im Dienstzettel, und einen Figureneintrag statt dreier Abzüge davon. Dazu Nörgel auf dem Blatt der Grünhaut statt auf dem zu großen Ork-Rig, und die Umkehr der Rangfolge auf dem Telefon: die Antworten stehen fest, der Satz rollt |
| `phase-e2-staatsakt.md` | Bauabschnitt E2: schwarze Bühne, Knöterich stellt sich zuerst vor, Urkundenoptik mit Dienstsiegel, und ein Vordruck, der nach gemessener Höhe blättert statt zu rollen. Mit den drei Fehlern der Waage, die erst die Messung sichtbar gemacht hat |
| `phase-e1-empfang.md` | Bauabschnitt E1: der Anfang als Szene statt als Stapel Vordrucke. Warum dieselbe Form, die das Intro herb machte, auch die Witze erstickt hat, zwei neue Regeln im Humor-Grundgesetz, und kein einziger neuer Witz |
| `phase-u1-menue.md` | Bauabschnitt U1: neben ein Menü zu klicken war ein Angriff, das Menü blieb offen. Der Lauscher in der Einfangphase, warum es kein modaler Vorhang wurde, und ein Menü-Anstrich ohne neue Grafikdatei |
| `phase-sz1-szenensystem.md` | Bauabschnitt SZ1: die Szenenmaschine, die E1 und E2 gebaut hatten, ohne sie so zu nennen, wird vom Empfang gelöst. Dazu das Intro aus der Weltgeschichte, neun Blätter, das die fünf Anrisstafeln ersetzt, und die geteilte Wortsperre: das Intro darf die Papiere zeigen, es darf niemanden beim Namen nennen |
| `phase-sz2-gespraechsszenen.md` | Bauabschnitt SZ2: die Szenen 2, 3 und 4, die ersten, die im laufenden Dienst spielen. Wie die Maschine dabei die Welt anhalten gelernt hat, warum die vierzig Zwischenbescheide ein Blatt mit einem Zähler sind, und zwei Befunde, die kein Guard gefunden hat, sondern erst der Blick aufs Bild |
| `phase-w11-reich-im-dorf.md` | Bauabschnitt W11: das Reich kommt im Dorf an. Drei neue Figuren aus der Weltgeschichte, davon zwei erst ab einem späteren Akt, zehn Zuwächse bei den bestehenden Figuren, und der Guard, der von jetzt an darauf achtet, dass niemand vom Kaiser in der Vergangenheitsform spricht |
| `phase-g10-rig-und-doppelbild.md` | Bauabschnitt G10: Nörgel steht auf einem Monsterrig statt auf dem Helden-Rig (die spitzen Ohren waren zwei Tabellen weiter schon da), Lott und Pahl teilen sich ihr Doppelporträt als Gag, Pommer wird blond, und warum die Messung ihn vorher braun gemacht hat |
| `phase-g9-garderobe.md` | Bauabschnitt G9: die Figuren bekommen eine eigene Garderobe statt Rüstungsstufen, eine Kopfbedeckung, und Nörgel eine Haut, die nur Haut umfärbt statt der ganzen Figur. Dazu, was das Player-Pack wirklich hergibt und warum davon nur die Formen zählen |
| `phase-g8-figurenfarben.md` | Bauabschnitt G8: die Dorffiguren tragen im Dorf die Haar- und Kleiderfarben ihres gemalten Porträts. Warum die Frisur bis dahin der Farbe folgte statt umgekehrt, warum acht fertige Paketfiguren dafür weichen, und die Messung, die die Hexwerte im Code an die Bilder bindet |
| `phase-p1-dienstgestalt.md` | Bauabschnitt P1: die Person des Tages bekommt eine Haarfarbe, die es im Dorf nicht gibt, und der Einstellungsvordruck nimmt zum ersten Mal eine Angabe des Spielers entgegen |
| `monsterkatalog-stufe-1-10.md` | Die Lieferung: 28 Gegner, 7 Biome, Rechenbasis und Selbstprüfung. Erzeugt von `tools/monsterkatalog.py`, nicht von Hand pflegen. |
| `monsterkatalog.json` | Derselbe Katalog als reine Daten, gleiche Quelle |
| `GRAFIK-BESTAND-2026-08-21.md` | Was in den lizenzierten Packs liegt, was das Spiel davon lädt (97 von 886 Dateien), und was der Rest wert wäre. Vorlage für einen Grafik-Durchgang, mit Aufwandsschätzung je Kandidat |
| `ABGLEICH-2026-07-27.md`, `ZUSAGEN-BILANZ-2026-08-04.md`, `GEGENPROBE-2026-08-04.md`, `GEGENPROBE-W-2026-08-05.md`, `GW-RESTFUNDE-2026-08-06.md`, `KAMMER-MESSUNG-2026-08-20.md` | Datierte Prüf- und Messberichte. Ihre Zeilennummern sind Stände, keine Wegweiser, und ihr Inhalt wird nicht rückwirkend umgeschrieben. Was sie überholt, steht im jeweils neueren Bericht oder im Phasendokument. |
| `CREDITS.md` | Grafik-Lizenzen |
| `LICENSE` | Code MIT, Grafik nicht gedeckt, Spielinhalte vorbehalten |

Drei Regeln, die beim Mitarbeiten nicht optional sind: Jede Phasenüberschrift trägt `— ERLEDIGT` oder `— OFFEN`, nachgezogen im selben Commit. Jede Bauphase bekommt ein Phasendokument. Und es wird live verifiziert statt behauptet — kein „sollte funktionieren".

## Werkzeuge

| Datei | Was |
|---|---|
| `tools/build-single.mjs` | Pages-Build: backt Grafik als Data-URIs in eine einzelne `dist/index.html` |
| `tools/sheet-audit.mjs` | misst Raster und Anker der Sprite-Blätter, schreibt `assets/cf/manifest.json` |
| `tools/ui-zellen.mjs` | schneidet die UI-Einzelzellen aus den `Cute_Fantasy_UI`-Blättern nach `assets/cf/ui/`. Die Koordinaten stehen als Tabelle im Quelltext; `--pruef` schneidet nichts, sondern rechnet nach, ob die Dateien noch dem Schnitt entsprechen. Braucht `Graphics/`. |
| `tools/monsterkatalog.py` | rechnet den Monsterkatalog und schreibt `monsterkatalog-stufe-1-10.md` und `monsterkatalog.json`. Prüft dabei alle harten Invarianten und meldet jede Verletzung. |
| `tools/monster-messlauf.mjs` | misst Kampfzeit und Gefahrenbudget im laufenden Spiel statt sie nachzurechnen. Braucht Playwright und einen lokalen Server. |
| `tools/zauber-messlauf.mjs` | misst, was Abstandhalten kostet: Nahkampf gegen Zauberspam, je Gegnergruppe in Zeit und genommenem Schaden |
| `tools/nahfeld-messlauf.mjs` | zählt an der wirklich gesetzten Bevölkerung ab, was in welcher Entfernung vom Dorf steht |
| `tools/spaziergang-messlauf.mjs` | schickt eine frische Stufe 1 in die echte Welt und misst den Verlauf: erster Kill, Kills, Stufe, Ausgang. Seit S1 zweimal je Aufruf, einmal ohne und einmal mit Steigerung — der Abstand zwischen beiden Zeilen ist der Messwert |
| `tools/monster-fehlversuch.mjs` | setzt absichtlich Fehler in den Katalog und prüft, ob `monsterAssert()` sie meldet. Ein Guard, der immer schweigt, beweist nichts. |
| `tools/gespraech-pruef.mjs` | prüft U3 im echten Browser: Namensschild blendet mit der Entfernung ein und aus und verdeckt kein zweites, die Gesprächstafel öffnet, tippt, wählt und schließt auf allen Wegen, der Schriftregler wirkt und wird gemerkt. Seit U6 zusätzlich Knöterichs Tafel (Kontextaktion, Porträt, Kreislauf, fünfte Antwort, Weggehen), das Porträt im Dienstzettel, Nörgels Blatt und Maßstab gegen die Grünhaut, und auf 360x640 bei größter Schrift, dass alle Antworten stehen und der Satz rollt. 89 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/empfang-pruef.mjs` | prüft E1 und E2 im echten Browser: die Vorstellung läuft vor den Tafeln, die schwarze Bühne verdeckt das Dorf und fällt erst mit dem Empfang, der Anriss blättert einzeln, die Szene öffnet mit Porträt und vier Antworten, Esc und Kreuz und Klick daneben prallen ab, der Treppeneffekt schaltet Nachfragen frei, der Vordruck blättert ohne überzulaufen, beide Ausgänge starten den Dienst. 59 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/szene-pruef.mjs` | prüft SZ1 und SZ2 im echten Browser: jede eingetragene Szene hat Sprecher und Knoten (und, wenn sie kein Gesprächsbaum aus F1 ist, zusätzlich Ende und Sperre), jeder Knoten ist vom Start aus erreichbar (Fixpunktlauf über den Graphen, weil der Treppeneffekt sich nicht ablesen lässt), die Wortsperre hängt an der Szene, der Sprecherwechsel tauscht Porträt und Kopfzeile, jedes Introblatt steht auf 390x844 im Bild, und seit SZ2 wird Szene 2 in der laufenden Schicht wirklich gespielt: sie wird fällig, sie hält die Welt an, sie gibt sie wieder frei, sie setzt ihren Merker, sie fällt kein zweites Mal, und während sie läuft steht keine Sprechblase im Dorf. 48 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/reich-pruef.mjs` | prüft W11 im echten Browser: die drei neuen Figuren erscheinen zum richtigen Akt und vorher nicht, jeder `abAkt`-Block der elf betroffenen Figuren schaltet genau in seinem Akt frei und keinen Akt früher (am Schalter gemessen, nicht an der Summe von `figZusatz()`, die seit F1 acht weitere Schalter mitzählt), Nörgels Lagerblock legt vier Zeilen dazu, ohne seinen Aktblock zu stören, kein Grundzeilen-Kreislauf läuft in eine leere Sprechblase, Bramsches Tabelle ist doppelfrei, und kein neuer Name sprengt die Kopfzeile. 59 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/portraet-farben.py` | misst die Haar- und Kleiderfarben der Figurenporträts aus `assets/portraets/` und gibt die Hexwerte aus, die in `DORF_FIGUREN` stehen. `--breit` zeigt die häufigsten Einzelfarben dazu, `--pruef` liest die Werte aus `index.html` zurück und hält sie gegen die Messung. Braucht Pillow, keinen Server |
| `tools/kapybara-freistellen.mjs` | stellt die vier Kapybara-Blätter frei: nimmt den deckenden Wasserhintergrund (rgb 0,149,233, derselbe Ton wie `Water_Middle.png`) weg und lässt die Wellenringe stehen. Bricht ab, wenn kein Pixel im Grundton liegt oder mehr als 95 Prozent wegfielen; `--pruef` schneidet nichts und rechnet nur nach. Braucht `Graphics/` |
| `tools/stopfen-pruef.mjs` | prüft SZ3 im echten Browser: die Stelle liegt begehbar im Steinfeld und nicht auf dem Weg, der Boden brummt nur aus der Nähe und nur bis zum ersten Nachsehen, die Kette läuft in ihrer Reihenfolge und bietet bei Stufe 2 nichts an, Szene 5 öffnet an der Röhre mit Zapf als Sprecher, danach fällt Serie I und regnet drei Schichten Post im Dorf, Vorblatt steht vorher nicht im Dorf und kommt zwei Schichten nach dem Stopfen (ohne Stopfen zwei nach der vierten Adresszeile), Szene 6 fällt genau einmal, und der Hauptvorgang braucht von alldem nichts. 43 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/ebene-pruef.mjs` | prüft M4 im echten Browser: Bescheid 1 bis 4 hat kein Untergeschoss, im Stollen ist das Loch im Boden von Anfang an sichtbar und nimmt erst nach der Truhe auf (geprüft am Angebot, nicht nur an der Bedingung dahinter), der Abstieg baut die Ebene neu samt eigener Truhe und Ausgangsrune, unten stehen nur die Wächter der Sperrablage, die zweite Truhe zählt den Auftrag nicht doppelt und zahlt kein Gold, und der Rückweg trägt in die Oberwelt. 54 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/ebene-fehlversuch.mjs` | setzt acht Fehler in die Tabellen, die `stollenAssert()` bewacht, und prüft, ob er sie meldet und danach wieder schweigt. Der letzte Eingriff stellt `rollKammerZutat()` auf den Stand vor M4 zurück — also auf genau den Fehler, den M4 gefunden hat |
| `tools/ebene-messlauf.mjs` | misst an vierzig wirklich gebauten Stollen-Kammern, was die zweite Ebene kostet und einbringt: Räume, Rätselräume, Wächter, deren Lebenssumme, Gold und Zutaten, je Ebene. Endet mit Exit-Code 1, sobald die untere Truhe Gold auszahlt — die Entscheidung soll nicht still verlorengehen |
| `tools/versuchung-pruef.mjs` | prüft SZ4 im echten Browser: die Versuchung fällt an Vorblatt und erst nach seiner Ankunft, sie geht seinem Gesprächsbaum vor, sie hält die Welt an, acht Figuren sprechen nacheinander in derselben Tafel, die Antwortliste bleibt an jedem Knoten vierzeilig, der Ausgang aus dem hub kürzt nichts ab, die Mappen liegen danach im Amtsflur; die Zustellung fängt mit Zwischenbescheid drei Schritte früher an und ohne ihn da, wo sie seit W5 anfing; die Kapsel steht im Finale nur mit gezogenem Stopfen; der Abspann hat dreizehn Bilder, Bild 7 hängt am Dorffest-Strang, Bild 10, 12 und 13 tragen ihren Kanon, und jedes der dreizehn passt auf fünf Fenstergrößen ins Bild, ohne seinen eigenen Knopf hinauszuschieben. Mit Gegenprobe: vier Fehler in die Tabellen gesetzt, jeder muss gemeldet werden, danach muss der Guard wieder schweigen. 67 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/steinbruch-fehlversuch.mjs` | setzt acht Fehler in die laufende Welt (Ente an Land, Seerose ans Ufer, Kapybara an den Buchtrand) und prüft, ob `steinbruchAssert()` sie meldet. Ein Guard, der immer schweigt, beweist nichts |
| `tools/wasser-messlauf.mjs` | misst das Wasser der Oberwelt an der wirklich erzeugten Karte: Uferwasser und wie viel davon an begehbarem Land liegt, Geborgenheit als Landanteil im Umkreis, Abstand zum Dorf, zu den Wegen und zu den Kammertüren, dazu jede Enge bis sechs Kacheln Wasser samt dem Umweg, den eine Brücke dort spart. Schreibt den Startwert beim Ausliefern der Seite um und misst deshalb mehrere Welten statt einer; trifft das Literal nicht genau einmal, bricht er ab |
| `tools/figuren-kontaktbogen.mjs` | stellt jede Dorffigur neben ihr gemaltes Porträt und schreibt einen einzigen PNG. Das Werkzeug für die eine Frage, die sich nicht messen lässt: wie es aussieht. Ohne `assets/cf/` bleiben die Sprite-Felder leer, die Porträts kommen trotzdem |
| `tools/figurenfarben-messlauf.mjs` | prüft G8 und G9 im echten Browser. Teil 1 schickt einen selbstgebauten Graukeil durch `farbBlatt()` und misst nach, wo das Helligkeitsband liegt, ob der Farbton ankommt und ob die Figurenblätter den Cache in Ruhe lassen; Teil 1b prüft an einem Blatt aus Haut, Auge, Kontur und Hemd, dass `hautBlatt()` nur die Haut anfasst und ihre Schattierung erhält — beides ohne Grafikpaket. Teil 2 misst an den wirklich gebackenen Blättern, ob die Porträtfarben im Sprite ankommen, und entfällt mit einer Zeile, wenn `assets/cf/` nicht danebenliegt |
| `tools/zulagen-pruef.mjs` | prüft K1 im echten Browser: der Aufstieg legt drei verschiedene Karten aus und würfelt ein ausliegendes Angebot nicht neu, die bewilligte legt sich selbst ein, die Fächerleiter stimmt an sechs Stufen, nicht stapelbare Familien bleiben einmal und stapelbare nie dreimal, im Gefecht wird weder eingelegt noch abgelegt, die Gattungskarte trägt nur mit der passenden Waffe und die Zweigkarte nur im eigenen Zweig, was in der Kartei liegt wirkt nicht, Taste und Gürtelknopf und Esc-Reihenfolge und Schleier und Sternchen sitzen, kein Kartentext trägt eine Zahl, und die Schicht leert die Kartei und zahlt dieselbe Pauschale an Vorlagen wie an Befähigungspunkten. Startet **keine** Schicht und wartet auf keinen Frame, läuft deshalb mit wie ohne Grafikpaket. 45 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/menue-pruef.mjs` | prüft sieben der neun Panels im echten Browser: Klick daneben schließt, ohne anzugreifen; HUD und Daumenfächer behalten ihre Wirkung; `Esc` bleibt eine Ebene je Druck. Stellt fest statt zu messen, Exit-Code 1 bei der ersten Abweichung. Die beiden übrigen Registereinträge stehen in ihrem eigenen Lauf: das Gesprächsfenster in `gespraech-pruef.mjs`, die Zulagen in `zulagen-pruef.mjs` |
| `tools/speicher-pruef.mjs` | prüft SP im echten Browser, und als einziges Werkzeug des Hauses über **zwei Ladevorgänge**: genau daran war der Fund SP1 jahrelang unsichtbar, denn ein Feld, das geschrieben und nie geladen wird, sieht in einem einzigen Lauf gesund aus. Gemessen werden: die Karte ist über Sitzungen hinweg identisch (Kartenhash, Baumzahl, Koppel — ohne diese Zusage wäre eine gespeicherte Position wertlos), beide Schichtstempel überleben Neustart und den nächsten `saveAmt()` und klemmen beidseitig, der Übertrag steht nach dem Dienstschluss in der Akte und wird beim Antritt genau einmal eingelöst, eine unterbrochene Schicht kommt vollständig zurück (Stufe, Beutel, Ausrüstung samt Affix-Tabellenbezug, Position auf den Pixel, Uhr, Auftrag), unbekannte Zauber fallen dabei raus, das Tor steht in Kammer und Tod zu, der Dienstschluss verbraucht den Spielstand, und ein Export überlebt ein per `localStorage.clear()` geleertes Gerät. Seit K1 zusätzlich, dass die Dienstmappe mitfährt und dass ein manipulierter Stand mit zehn eingelegten Karten trotzdem nur so viele bekommt, wie das Fach auf dieser Stufe hergibt. 34 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/langvorgang-pruef.mjs` | prüft Langvorgang 4 im echten Browser: die achtgliedrige Kette läuft in ihrer Reihenfolge, wer nicht dran ist rückt nichts vor, die Kette hält an Vorblatt bis Akt III, der Endzustand bewegt sich nicht mehr, die vier Zusatzzeilen erscheinen und verschwinden mit dem Strang, das Finale nennt den Präzedenzfall nur mit ihm, und der Strang sperrt nichts. Sichert `localStorage` und stellt es wieder her, weil `langEreignis()` speichert. 58 Prüfungen, Exit-Code 1 bei der ersten Abweichung |

```bash
python3 tools/monsterkatalog.py
python3 tools/portraet-farben.py --pruef # braucht keinen Server, aber Pillow
python3 serve.py &                       # der Messlauf braucht das Spiel im Browser
node tools/monster-messlauf.mjs
node tools/zauber-messlauf.mjs
node tools/nahfeld-messlauf.mjs
node tools/spaziergang-messlauf.mjs
node tools/monster-fehlversuch.mjs
node tools/menue-pruef.mjs
node tools/gespraech-pruef.mjs
node tools/empfang-pruef.mjs
node tools/reich-pruef.mjs
node tools/szene-pruef.mjs
node tools/langvorgang-pruef.mjs
node tools/stopfen-pruef.mjs
node tools/ebene-pruef.mjs
node tools/ebene-fehlversuch.mjs
node tools/versuchung-pruef.mjs
node tools/zulagen-pruef.mjs
node tools/speicher-pruef.mjs
node tools/ebene-messlauf.mjs 40
node tools/figurenfarben-messlauf.mjs    # Teil 2 braucht assets/cf/
node tools/figuren-kontaktbogen.mjs      # Sprite-Felder brauchen assets/cf/
node tools/ui-zellen.mjs --pruef         # braucht keinen Server, aber Graphics/
```

## Grafik

Pixel-Art aus **Cute Fantasy** von Kenmi, Premium-Lizenz. Die Rohbibliothek darf nicht weiterverteilt werden und liegt deshalb nicht in diesem Repo; genutzte Dateien werden kuratiert nach `assets/cf/` kopiert und im Pages-Build von `tools/build-single.mjs` als Data-URIs in eine einzelne HTML-Datei gebacken. Details in `CREDITS.md`.
