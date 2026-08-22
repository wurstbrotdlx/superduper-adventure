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

`W A S D` Bewegung · `Leertaste` oder Klick Angriff · `Q` oder `1` Trank · `E` Zauber · `R` Ultimate · `T` Zauberbaum · `I` Inventar und Befähigung · `K` Kessel · `M` Musik · `F` Kontextaktion · `Esc` schließt Panels der Reihe nach. Ein Klick oder Tipp **neben** ein offenes Panel schließt es ebenfalls, ohne dabei anzugreifen (seit U1).

Der erste Dienstantritt läuft seit E1 als Szene und seit E2 auf schwarzem Grund: Knöterich stellt sich in fünf Zügen vor, dann erzählt er das Intro (seit SZ1 neun Blätter statt der fünf Anrisstafeln), dann öffnet sich das Dorf für den Empfang. Alles im selben Gesprächsfenster, das auch die Dorffiguren benutzen; Antworten wählen wie unten beschrieben. Der Einstellungsvordruck steckt dahinter, blättert seit E2 statt zu rollen und bleibt aus der Szene, aus dem Startbild und aus dem Amt lesbar; `ÜBERSPRINGEN` auf der ersten Tafel führt direkt zu ihm.

Im Gespräch mit einer Dorffigur (seit U3): `F` öffnet die Tafel, ein zweiter Druck redet darin weiter. Solange sie offen ist, wählen `1` bis `4`, Pfeil hoch/runter plus `Eingabe` oder die Maus eine Antwort — die Ziffernreihe gehört dann der Tafel und nicht dem Trank, `Q` bleibt er. Die Schriftgröße steht im Inventar unter **SCHRIFT** in drei Stufen und wird gemerkt.

Die Tafel ist seit U4 zweigeteilt: **oben** das Gegenüber mit Porträt, Namen und dem Satz, der einläuft, **unten** der Spieler mit seiner Amtsbezeichnung, den Antworten und seinem eigenen Bild. Auf dem Telefon fällt das zweite Bild weg, die Teilung bleibt.

Im Dorf stehen seit W11 vierzehn ansprechbare Figuren statt elf, und drei davon sind nicht von Anfang an da: der Wetterbeauftragte Nieselbeck steht ab der ersten Schicht, Reichsbotin Umlauf ab Akt II (Schicht 11) und Reichsministerialdirektor zu Händen Vorblatt ab Akt III (Schicht 21). Zehn der elf bisherigen Figuren bekommen im Lauf der Akte je zwei zusätzliche Sätze. Im freien Spiel ohne Schichten steht alles von Anfang an offen.

Touch: virtueller Joystick links, Kampf-Cluster rechts. Der Daumenfächer bleibt mit offenem Panel bedienbar.

## Entwickeln

Der gesamte Code liegt in `index.html`, rund 8500 Zeilen JavaScript in einem `<script>`-Block. Syntaxcheck vor jedem Commit:

```bash
python3 -c "import re;h=open('index.html').read();m=re.search(r'<script>(.*)</script>',h,re.DOTALL);open('/tmp/c.js','w').write(m.group(1))" && node --check /tmp/c.js
```

Das fängt Syntaxfehler, **nicht** die Temporal Dead Zone. Der häufigste echte Fehler in diesem Projekt ist ein `ReferenceError` beim Laden, weil eine Funktion, die schon auf Skriptebene läuft, eine erst später deklarierte Konstante liest. Den findet nur der Browser mit offener Konsole.

Das Spiel prüft sich beim Laden selbst. Siebzehn selbstaufrufende Guards (`blaetterAssert`, `goldAssert`, `knAssertCaps`, `rangAssert`, `auftragAssertBrett`, `langAssert`, `vorgangAssert`, `anredeAssert`, `monsterAssert`, `zauberAssert`, `befaehigungAssert`, `dienstAssert`, `wiederAssert`, `gestaltAssert`, `gespraechAssert`, `schriftAssert`, `szeneAssert`) belegen Zeichendeckel, Formregeln, Tabellenvollständigkeit, Erreichbarkeit, die Schichtabrechnung, seit M1 die Kampfwerte gegen den Referenzspieler, seit M2 zusätzlich die Modelle gegen die Angriffsart und die Grenzen des Sonderprüfers, seit Z2 die Zauberbefugnis samt Manakopplung, seit S1 die Spreizung zwischen gesteigertem und ungesteigertem Spieler samt Kraftbedarf und Manapool, seit W8 den Sperrvermerk auf die Akte im Einstellungsvordruck, seit W10 die beidseitige Klemme des gespeicherten Dienststandes, seit P1 die Lesarten der Frisuren samt Haarfarbenauswahl, seit U3 die Namensschilder samt Antwortlisten sowie die Schriftstufen, seit U4 zusätzlich, dass jedes Stück der Gesprächstafel in seiner Hälfte hängt, und seit E1 die Erreichbarkeit jeder Frage im Empfang (seit SZ1 als `szeneAssert` über jede eingetragene Szene, samt der Wortsperre, die jetzt an der Szene hängt statt am Modul), seit E2 zusätzlich, dass beim Blättern des Vordrucks keine Zeile verlorengeht, und seit W11, dass jede Dorffigur für jeden Akt, in dem sie im Dorf steht, eine Aktzeile hat und für keinen anderen, dass jeder Zusatzblock genau einen Schalter trägt (Merker oder Akt), und dass in keinem Text des Spiels vom Kaiser in der Vergangenheitsform die Rede ist. Dazu kommen zwei, die nicht auf Skriptebene laufen, sondern erst hinter `loadAssets()`, weil sie die gebackenen Blätter lesen: `npcAnkerAssert()` misst die Fußlinie, und `dorfSichtAssert()` (seit G6) rechnet nach, ob jede Dorffigur ein Blatt hat und ob sie samt Wanderleine vor den Gebäudefassaden steht statt dahinter. **Sie werfen nie, sie melden.** Eine stille Konsole ist das Abnahmekriterium. *(Diese Zeile nannte bis zum 20.08.2026 sieben und kannte weder `npcAnkerAssert` aus `9b553a8` noch die seither dazugekommenen.)*

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

Was die Sitzung dabei ausgibt, ist die Abnahme: die vierzehn Guards melden je eine Zeile „in Ordnung", sonst steht dort nichts. Vor dem Ausliefern zusätzlich `node tools/build-single.mjs` und die entstandene `dist/index.html` per `file://` laden — der Build nimmt einen anderen Ladeweg (`ASSET_BLOBS` statt HTTP) und kann deshalb Fehler zeigen, die im Quellbaum keine sind, und umgekehrt.

## Dokumente

| Datei | Was |
|---|---|
| `superduper-weltbibel.md` | Die Autorität: Welt, Figuren, Humor, Formregeln, Bauabschnitte. Bei Konflikt zwischen Code und Weltbibel gewinnt die Weltbibel. |
| `weltgeschichte.md` | Der Erzählstoff: die Chronik von Jahr 0 bis heute, das Reich und sein Adel, vier neue Figuren, drei Blattserien, vier Langvorgänge und neun ausgeschriebene Szenen samt Intro und Abspann. Zuwachs zur Weltbibel, nicht Ersatz: bei Konflikt gewinnt die Weltbibel. |
| `superduper-gameplay-prompt.md` | Gameplay-Phasen 1 bis 6, Zählertabellen |
| `superduper-grafik-prompt.md` | Grafik-Phasen G0 bis G5 |
| `superduper-reparatur-prompt.md` | Reparaturrunden R1 bis R9 |
| `phase-*.md` | Eine Bauanleitung je Bauabschnitt, mit Abnahme und Prüfprotokoll |
| `figuren-dorf.md`, `blaetter-serie-a-b.md` | Inhaltslieferungen (Figurentexte, Aktenfunde) |
| `phase-m1-monsterkatalog.md` | Bauabschnitt M1: der Katalog im Code, Entscheidungen und Prüfprotokoll |
| `phase-z1-zauberbalance.md` | Bauabschnitt Z1: warum Zauberspam jeden Nahkampf schlug, vier Eingriffe, Vorher-Nachher-Messung |
| `phase-m2-nahfeld-und-namen.md` | Bauabschnitt M2: Schwierigkeit nach Entfernung vom Dorf, der Sonderprüfer, Namen über den Köpfen, zwei versiegelte Gegner |
| `phase-z2-zauberbefugnis.md` | Bauabschnitt Z2: Zauber ab Stufe 4, Mana wird im Nahkampf erarbeitet, Spammen verhungert an der Leiste |
| `phase-s1-befaehigung.md` | Bauabschnitt S1: warum Steigern folgenlos war, die Umschichtung von der Stufe in den Punkt, höhere Zauberpreise, der Kraftbedarf, Vorher-Nachher-Messung mit zwei Bauweisen |
| `phase-w8-anfang.md` | Bauabschnitt W8: Einstellungsvordruck, Dienstanweisung, Laufbahnziel, und warum der Anfang kein Prolog ist |
| `phase-w10-wiedereinsetzung.md` | Bauabschnitt W10: der Antrag auf Wiedereinsetzung, die einzige Art, zweimal derselbe Mensch zu sein |
| `phase-g6-dorfsicht.md` | Bauabschnitt G6: sechs von elf Dorffiguren waren nicht zu sehen. Fünf fehlende Sprite-Blätter, ein Bürgermeister hinter der Amtsfassade, und der Guard, der beides künftig meldet |
| `phase-w-lager.md` | Bauabschnitt W-Lager: das Lager der Beschwerden. Warum ein Militärlager doch in diese Welt passt, die Figur am Tor ohne Titel, der erste Gegner, der nie zuerst angreift, und ein Sprite-Blatt mit drei Rastern übereinander |
| `phase-w-noergel.md` | Bauabschnitt W-Nörgel: Nörgel und das Lager. Vier Zusatzzeilen, die erst kommen, wenn der Spieler selbst dort war, der Merker dafür, und warum es kein achter Langvorgang geworden ist |
| `phase-m3-stollen.md` | Bauabschnitt M3: das sechste Katalogbiom. Warum kein einziger kammerexklusiver Gegner in die Untere Registratur passte, ein dritter Kammersatz aus einem leeren Ordner, und eine Vorgangsart, die beim Erledigen in zwei kleinere zerfällt |
| `phase-g6-nachtrag-dorfblaetter.md` | Die fünf offenen Dorf-Blätter aus G6, nachgelegt. Kein Code, aber die Entscheidung, wie `Fisherman_Fin` gerastert ist: 9 Spalten à 64, nicht 18 à 32 wie das Manifest führte |
| `phase-u2-menuegrafik.md` | Bauabschnitt U2: die Menüs bekommen Pack-Grafik statt CSS, das Pixelkunst nachahmt. Vier Zellen, die Regel „Formen aus dem Pack, Flächen bleiben dunkel", und warum eine richtig gemessene Koordinate noch keine passende Zelle ist |
| `phase-u3-gespraech.md` | Bauabschnitt U3: Namen über den Köpfen, das Gesprächsfenster mit vier Antworten, ein Regler für alle 176 Schriftgrößen. Dazu der Nebenbefund, warum sich der Einstellungsvordruck auf einem Telefon nicht wegklicken ließ |
| `phase-u4-dialogtafel.md` | Bauabschnitt U4: die Gesprächstafel zerfällt in zwei Hälften. Oben der NPC mit Porträt und laufendem Satz, unten der Spieler mit Amtsbezeichnung, Antworten und eigenem Bild — und warum die Antworten vorher wie ein Nachsatz derselben Person aussahen |
| `phase-e2-staatsakt.md` | Bauabschnitt E2: schwarze Bühne, Knöterich stellt sich zuerst vor, Urkundenoptik mit Dienstsiegel, und ein Vordruck, der nach gemessener Höhe blättert statt zu rollen. Mit den drei Fehlern der Waage, die erst die Messung sichtbar gemacht hat |
| `phase-e1-empfang.md` | Bauabschnitt E1: der Anfang als Szene statt als Stapel Vordrucke. Warum dieselbe Form, die das Intro herb machte, auch die Witze erstickt hat, zwei neue Regeln im Humor-Grundgesetz, und kein einziger neuer Witz |
| `phase-u1-menue.md` | Bauabschnitt U1: neben ein Menü zu klicken war ein Angriff, das Menü blieb offen. Der Lauscher in der Einfangphase, warum es kein modaler Vorhang wurde, und ein Menü-Anstrich ohne neue Grafikdatei |
| `phase-sz1-szenensystem.md` | Bauabschnitt SZ1: die Szenenmaschine, die E1 und E2 gebaut hatten, ohne sie so zu nennen, wird vom Empfang gelöst. Dazu das Intro aus der Weltgeschichte, neun Blätter, das die fünf Anrisstafeln ersetzt, und die geteilte Wortsperre: das Intro darf die Papiere zeigen, es darf niemanden beim Namen nennen |
| `phase-w11-reich-im-dorf.md` | Bauabschnitt W11: das Reich kommt im Dorf an. Drei neue Figuren aus der Weltgeschichte, davon zwei erst ab einem späteren Akt, zehn Zuwächse bei den bestehenden Figuren, und der Guard, der von jetzt an darauf achtet, dass niemand vom Kaiser in der Vergangenheitsform spricht |
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
| `tools/gespraech-pruef.mjs` | prüft U3 im echten Browser: Namensschild blendet mit der Entfernung ein und aus und verdeckt kein zweites, die Gesprächstafel öffnet, tippt, wählt und schließt auf allen Wegen, der Schriftregler wirkt und wird gemerkt. Stellt fest statt zu messen, Exit-Code 1 bei der ersten Abweichung |
| `tools/empfang-pruef.mjs` | prüft E1 und E2 im echten Browser: die Vorstellung läuft vor den Tafeln, die schwarze Bühne verdeckt das Dorf und fällt erst mit dem Empfang, der Anriss blättert einzeln, die Szene öffnet mit Porträt und vier Antworten, Esc und Kreuz und Klick daneben prallen ab, der Treppeneffekt schaltet Nachfragen frei, der Vordruck blättert ohne überzulaufen, beide Ausgänge starten den Dienst. 59 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/szene-pruef.mjs` | prüft SZ1 im echten Browser: jede eingetragene Szene hat Sprecher, Knoten und ein Ende, jeder Knoten ist vom Start aus erreichbar (Fixpunktlauf über den Graphen, weil der Treppeneffekt sich nicht ablesen lässt), die Wortsperre hängt an der Szene, der Sprecherwechsel tauscht Porträt und Kopfzeile, und jedes Introblatt steht auf 390x844 im Bild. 11 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/reich-pruef.mjs` | prüft W11 im echten Browser: die drei neuen Figuren erscheinen zum richtigen Akt und vorher nicht, die zehn Zuwachs-Blöcke schalten im richtigen Akt frei, kein Grundzeilen-Kreislauf läuft in eine leere Sprechblase, Bramsches Tabelle ist doppelfrei, und kein neuer Name sprengt die Kopfzeile. 35 Prüfungen, Exit-Code 1 bei der ersten Abweichung |
| `tools/menue-pruef.mjs` | prüft die sieben Panels im echten Browser: Klick daneben schließt, ohne anzugreifen; HUD und Daumenfächer behalten ihre Wirkung; `Esc` bleibt eine Ebene je Druck. Stellt fest statt zu messen, Exit-Code 1 bei der ersten Abweichung. |

```bash
python3 tools/monsterkatalog.py
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
node tools/ui-zellen.mjs --pruef         # braucht keinen Server, aber Graphics/
```

## Grafik

Pixel-Art aus **Cute Fantasy** von Kenmi, Premium-Lizenz. Die Rohbibliothek darf nicht weiterverteilt werden und liegt deshalb nicht in diesem Repo; genutzte Dateien werden kuratiert nach `assets/cf/` kopiert und im Pages-Build von `tools/build-single.mjs` als Data-URIs in eine einzelne HTML-Datei gebacken. Details in `CREDITS.md`.
