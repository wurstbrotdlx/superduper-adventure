# Gegenprobe zu W3 bis W7 und der Anrede

## Prüfstand

| | |
|---|---|
| Repo | `~/vibecodingprojekt/adventure/`, `wurstbrotdlx/superduper-adventure` |
| Branch | `main` |
| HEAD bei Prüfung | `c4a9d25` („docs: Pruefauftrag fuer die Gegenprobe zu W3 bis W7 und der Anrede") |
| Arbeitsbaum | sauber, nichts ungestaged, nichts ungetrackt |
| `index.html` | 9102 Zeilen, ein `<script>`-Block, `node --check` grün |
| Datum | 2026-08-05 |
| Prüfmodus | sieben unabhängige Instanzen, überlappungsfrei, parallel; Live-Teil zentral |

Der Auftrag nennt als Stand `a048e5b`. Seither sind zwei Commits dazugekommen: `06ad456` („fix: Vermutungen nennen den Zweitfluch, fluchRuht beim Rechtsklick-Ablegen", behebt F75 und F52) und `c4a9d25` (der Prüfauftrag selbst). `06ad456` berührt weder W7 noch die Anrede — beide Pakete haben das einzeln nachgeprüft.

**Zusicherung: In diesem Durchgang wurde nichts geändert.** Keine Codezeile, kein Plandokument, kein Phasendokument, kein Statusmarker, kein Commit, kein Push. `Graphics/`, `assets/cf/` und `dist/` wurden nicht angefasst. `.claude/launch.json` wurde nicht angefasst (Port 8378 war von einer fremden Sitzung belegt; der Live-Teil hat sich per URL an den laufenden Server gehängt, statt die Konfiguration zu ändern). Die einzige geschriebene Datei ist dieser Bericht.

**Zusicherung zum Spielstand.** Vor jeder anderen Handlung wurde ein Snapshot von `sda_kladde_v1`, `sda_amt_v1` und `sda_knoeterich_v1` genommen. Nach allen Prüfungen sind alle drei **byte-identisch**: `schichten` 30, `bankGold` 960, `kladde.lang` `{}`, `kladde.vorgang` `{1,2,3}`. Kein `saveAmt()`, kein `saveKladde()`, kein `saveKn()` wurde ausgelöst; jeder gespiegelte Wert (`amt.schichten`, `amt.bonusNachwachsen`, `kladde.lang`, `kladde.vorgang`) wurde nach jedem Sweep geprüft zurückgesetzt. Die Doppelauszahlung aus **GW1** wurde bewusst **nicht** nachgespielt — sie hätte echtes Gold gebucht; der Beleg ist statisch geführt und lückenlos.

## Ampel

Der Code ist in deutlich besserem Zustand als die Dokumente, die ihn beschreiben. Von 415 einzeln adjudizierten Zusagen halten 315. Die sieben Bauabschnitte tun im Wesentlichen, was sie versprechen: die Laufbahntabelle stimmt Zeile für Zeile mit 18.3/18.4 überein, die Sprossenleiter der Anrede hält über 81 durchgerechnete Rangstufen ohne einen einzigen Deckelbruch, die sieben Langvorgänge haben in einer erschöpfenden Erreichbarkeitsanalyse **keine einzige** Sackgasse, `t.diff` und `t.tier` sind sauber von ihrem Anzeigewert getrennt, und die Zustellung friert den Kampf tatsächlich vollständig ein. Die zwei TDZ-Fälle, an denen W7 sich die Finger verbrannt hat, sind korrekt behoben — eine AST-Analyse über alle Top-Level-Selbstaufrufe findet null Kandidaten, und der Prüfer wurde validiert, indem beide bekannten Regressionen künstlich wieder eingebaut und zuverlässig gemeldet wurden.

Die Schwachstelle liegt woanders, und sie ist systematisch: **die Guards prüfen weniger, als die Phasendokumente ihnen zuschreiben, und die Abnahmelisten behaupten Prüfungen, die so nicht stattgefunden haben können.** Das ist kein Einzelfall, sondern ein Muster über alle sieben Pakete. Mindestens acht Prüfpunkte in vier Guards sind **strukturell immer wahr** und können niemals auslösen — darunter ausgerechnet der „Zeremonie-Kopplungsbeweis" (`s % 10 === 0 && s % 5 !== 0` ist für ganze Zahlen leer), der Insignien-Schwellentest (er vergleicht eine Funktion mit ihrem eigenen Rumpf; eine Sabotage beider Schwellen lässt den Guard grün) und der `rangNameVon()`-Drift-Test (`rangName()` **ist** definiert als `rangNameVon(rangStufe())`). Alle neun `pruefePar` in W4 sind Tautologien gegenüber ihrem eigenen `wuerfle`. Wo ein Dokument schreibt „vom Guard bewiesen", steht in der Mehrzahl der Fälle eine Zeile, die nichts beweisen kann.

Dazu kommt eine zweite, gefährlichere Klasse: **Negativ-Zusagen, die per Grep in einer Zeile widerlegbar sind.** Das war die Erwartung des Auftrags, und sie hat sich bestätigt. `killMon()` sei „Zeile für Zeile unverändert" — der W5-Commit ändert zwei Zeilen und fügt vier hinzu, und dasselbe Dokument beschreibt den Einbau neunzig Zeilen weiter oben selbst. Die Anrede-Sonderpfade seien „per Konstruktion unberührt, sie erreichen `npcCycle()` gar nicht erst" — der Bramsche-Zweig ruft `npcCycle()` direkt auf, seit W6, im selben File. W4 sei bei `schichtModus=false` „vollständig inert" — drei Welteingriffe tragen keinen Wächter und lenken weiterhin Monstertyp, Monsterband und Kammertür-Schwierigkeit. W7 sei inert — `langFertig()` und `langZusatz()` haben keinen Wächter, und der Loader lädt `kladde.lang` unbedingt. `npcSprechen()` schreibe „ausschließlich in die Blasenfelder" — seit W7 hängt `saveKladde()` daran.

Drei Funde betreffen den Code, nicht die Dokumentation, und zwei davon sind spielbar. Ein angenommener Aushang zahlt seinen Lohn nach einem Seiten-Reload **erneut**, beliebig oft, 150 bis 400 Gold pro Durchlauf an der 50-Prozent-Verwaltungskostenabgabe vorbei — zwei Instanzen haben das unabhängig voneinander gefunden. Die teuersten Mengen-Aushänge verlangen ab Akt IV mehr Monster eines Typs, als das Biom überhaupt hergibt; die Weltgarantie ersetzt den *Typ* eines Spawns, erhöht aber nie deren *Zahl*. Und ein negativer `amt.schichten` in einem manipulierten Spielstand zerreißt beim Laden das gesamte Inline-Skript, weil `rangDef()` nur nach oben klemmt und `rangAssert()` auf Skriptebene läuft.

Am aufschlussreichsten ist, was die Gegenprobe **nicht** gefunden hat. Der Auftrag vermutete, die `GEHEIM`-Listen der Guards seien nicht identisch und ließen eine Lücke. Sie sind es doch: fünf Listen, elf Einträge, nach Whitespace-Normalisierung byte-gleich. Die Vermutung des Auftrags war die Sorte Behauptung, die dieser Bericht sonst widerlegt — hier war sie selbst der Fehlbefund. Die echte Lücke sitzt eine Ebene höher, in der Abdeckung: `knAssertCaps()` prüft mit `DORF_FIGUREN` den mit Abstand größten Sprechblasenkorpus des Spiels, 346 Strings, **nur auf Länge** — kein Gedankenstrich, kein Emoji, kein Sperrvermerk. Der Bestand ist sauber (unabhängig nachgerechnet), aber nichts hält ihn sauber.

## Zählung

Ausgezählt aus den Tabellen dieses Berichts, ein Verdikt je Zeile.

| Paket | Zusagen | stimmt | weicht ab | überholt | nicht auffindbar | nicht prüfbar |
|---|---|---|---|---|---|---|
| G1 · W3 Dorf | 74 | 52 | 8 | 11 | 0 | 3 |
| G2 · W4 Brett | 80 | 63 | 14 | 2 | 0 | 1 |
| G3 · W5 Vorgang | 60 | 49 | 6 | 2 | 0 | 3 |
| G4 · W6 Rang | 61 | 51 | 5 | 2 | 1 | 2 |
| G5 · Anrede | 64 | 40 | 17 | 6 | 0 | 1 |
| G6 · W7 Langvorgänge | 64 | 43 | 12 | 0 | 0 | 2 |
| G7 · Querschnitt | 20 | 17 | 2 | 0 | 0 | 0 |
| **Summe** | **415** | **315** | **64** | **23** | **1** | **12** |

G7 ist überwiegend Fließtext-Analyse (TDZ-Sweep, Persistenz-Matrix, Formregel-Sweep über 4437 String-Literale); die Tabelle verdichtet nur dessen Kernaussagen. Die Zeile „überholt" bedeutet durchweg: bei Abfassung des Phasendokuments richtig, durch einen späteren Bauabschnitt überholt, ohne Nachtrag.

**Verteilung der 64 Abweichungen:** 51 sind Dokumentfehler (das Dokument beschreibt den Code falsch), 10 sind Guard-Schwächen (der Guard prüft nicht, was ihm zugeschrieben wird), 3 sind Codefehler mit Spielwirkung.

## Der Live-Teil

Der Live-Teil lief zentral in einer einzigen Browser-Sitzung, weil es genau ein Browser-Pane gibt und weil jede Prüfung über `npcSprechen()` echten Fortschritt in den Spielstand schreiben würde. Die sieben Paketinstanzen liefen ausdrücklich **ohne** Browser und ohne Vorschauserver, rein statisch.

| Prüfung | Ergebnis |
|---|---|
| Ladevorgang | Skript läuft bis zur letzten Top-Level-Deklaration durch (`bakeUiSkin`, `assertRigRegistrations`, `prewarmMonsterTints`, `loop`, `refreshPrioBtn` alle definiert) → **kein TDZ-Abbruch** |
| Konsole nach erzwungenem Reload | **leer**, keine Meldung, kein Fehler |
| `knAssertCaps()` | `true` |
| `rangAssert()` | `true` |
| `anredeAssert()` | `true` |
| `vorgangAssert()` | `true` |
| `auftragAssertBrett()` | `true` |
| `langAssert()` | `true` |
| `blaetterAssert()` | **nicht aufrufbar** — `index.html:2798` ist `(function blaetterAssert(){…})()`, ein benannter Funktionsausdruck. Kein globaler Bezeichner, nur einmal beim Laden prüfbar, nicht wiederholbar (siehe GW24) |
| Seiteneffekt der Guards | **keiner** — `localStorage` vor und nach allen sechs Aufrufen byte-identisch |
| Tabellengrößen | `DORF_FIGUREN` 11, `RAENGE` 19, `ANREDE` 11, `LANGVORGAENGE` 7, `AUFTRAG_TYPEN` 9, `ADRESS_ZEILEN` 4, `INSIGNIEN` 9 — alle wie zugesagt |

Vier Behauptungen wurden zentral live durchgerechnet, weil sie statisch nur schwer zu entscheiden sind:

**Die Sprossenleiter hält.** Sweep von `knBegruessungLine()` über die Rangstufen 0 bis 80 (`amt.schichten` gespiegelt, nie `saveAmt()`): maximale Länge **44**, kein einziger Überlauf, nie `null`, der vierte Boden („Die Akte wird dick.") wird nie erreicht. Die Zusage stimmt. Bemerkenswert: `basis` ist auf allen 19 benannten Rängen eine **Dublette** von `t` — erst ab Rang 19 wird die Sprosse distinkt, und dort ist sie die tragende, weil die römische Ziffer `t` über den Deckel schiebt.

**„Herr oder Frau" erscheint auf einem von 81 Rängen.** Der Codekommentar `index.html:4036` behauptet, Knöterich spreche „immer vollständig, immer korrekt, immer inklusive ‚Herr oder Frau' an. Jedes Mal." Gemessen über die Rangstufen 0 bis 80: **genau eine** Stufe (Rang 11, `Monstralrat`, exakt 44 Zeichen) erzeugt diese Form. 80 Ränge ohne. Zusätzlich fällt ab Rang 18 der Schichtzähler dauerhaft aus der Begrüßung (65 von 81 Rängen landen auf `anredePunkt`).

**Die Gießkannen-Wärme ist auf 12 von 19 Rängen unsichtbar.** `kladde.lang` gespiegelt auf einen abgeschlossenen Strang, dann Sweep: sichtbar auf den Rängen **3, 6, 9, 11, 12, 13, 15** (sieben), unsichtbar auf **0, 1, 2, 4, 5, 7, 8, 10, 14, 16, 17, 18** (zwölf) und auf **keinem** Rang oberhalb 18. Das Phasendokument nennt „Rang 0 und ab Rang 18". Spiegel danach geprüft zurückgesetzt, `kladde.lang` wieder `{}`.

**Zwei Fehlerzustände reproduziert.** Bei `amt.schichten = 0` rendert `rangZeremonieBlock()` wörtlich `Knöterich: „undefined"`. Bei `amt.schichten = -5` liefert `rangDef()` `undefined` und `rangGruppe()` wirft `TypeError: Cannot read properties of undefined (reading 'g')`.

## Die Pakete

Sieben überlappungsfreie Prüfpakete, je eine unabhängige Instanz. Zeilennummern im Code sind der Stand `c4a9d25`; gefunden wurde durchweg über Bezeichner, nicht über Zeilennummern aus älteren Berichten.

## G1: W3, Das Dorf spricht

Anker: `3af7099`. Alle Zeilennummern heutiger Stand, über Bezeichner gefunden.

| Zusage | Fundort im Dokument | Erwartet | Gefunden | Bezeichner im Code | Urteil |
|---|---|---|---|---|---|
| „verdrahtet sie, erfindet keinen einzigen neuen Satz" | Z. 3 | Text 1:1 aus `figuren-dorf.md` | Bei `3af7099` alle 301 Strings wörtlich nachweisbar (maschinell abgeglichen) | `DORF_FIGUREN` 1680 | **stimmt** |
| „Text zeichengleich mit `figuren-dorf.md`" | Z. 81 | 301 von 301 | 298 von 301; 3 Aktzeilen weichen ab | `DORF_FIGUREN` 1747/1781 | **überholt** |
| Codeblock der Tabelle im Prüfdokument | Z. 158-207 | = Code | zeigt die *alten* Lisbeth-IV/V- und Nörgel-IV-Zeilen | 1760, 1761, 1794 | **überholt** |
| Kein neues Panel, kein `localStorage`-Schlüssel, kein Dialogbaum, kein Zeichenschritt | Z. 9 | 0 Treffer im W3-Diff | `git show 3af7099`: keine `localStorage`-Zeile, kein Panel, kein Menü | — | **stimmt** |
| „zwei Sitzungsvariablen (nicht persistiert)" | Z. 9, 566 | genau 2 | drei: `letzterAnlass`, `bramscheFragen`, `bramscheLastAntwort` | 3930, 3931 | **überholt** |
| Fünf neue NPC-Sprites in `CF_NPCS` | Z. 13-28 | 8 Einträge, 5 neu | 8 Einträge, alle `fw/fh:64, ax:32, ay:60` | `CF_NPCS` 786-795 | **stimmt** |
| IHDR-Maße Bruno/Chloe 384×448, Buba 384×832, Jack 384×640, Fin 576×832 | Z. 15 | exakt | exakt bestätigt (PNG-Header gelesen) | `assets/cf/deco/NPCs/` | **stimmt** |
| „Fin 9 statt 6 Spalten, `addSheet` berechnet das aus der Bildbreite" | Z. 15 | cols aus Breite | `cols = Math.max(1, Math.round(img.width/fw))` | `loadAssets` 863 | **stimmt** |
| „registriert die zehn neuen Sheet-Einträge automatisch mit" | Z. 30 | 5 Dateien × 2 | Schleife erzeugt `cfnpc_*_idle`/`_walk` | 796-800 | **stimmt** |
| `bakeNpcSheet()` Codeblock | Z. 42-56 | wörtlich | wörtlich identisch | `bakeNpcSheet` 992-1006 | **stimmt** |
| `bakeAllNpcSheets()` nur für `opt==='fest'` | Z. 57-59 | 3 Figuren | 3 (bramsche/lott/pahl) | 1007-1009 | **stimmt** |
| Aufrufkette nach `bakeUiSkin()`, vor `showStartScreen()` | Z. 65-75 | exakte Reihenfolge | exakt so | 9089-9098 | **stimmt** |
| „`npcs.push()` legt nur den Sheet-Schlüssel-String ab" | Z. 77 | kein Bildobjekt | `sheetIdle`/`sheetWalk` sind Strings | `genMap` 2253 | **stimmt** |
| `DORF_FIGUREN` ersetzt `NPC_DEFS` | Z. 79 | `NPC_DEFS` weg | kein Treffer mehr im File | 1680 | **stimmt** |
| „vor `npcs.length` deklariert (TDZ-Regel)" | Z. 81 | Tabelle vor `npcs` | 1680 vs. 1960 | 1680 / 1960 | **stimmt** |
| Elf Figuren, 8 `wander` / 3 `fest` | Z. 81, 637 | 11 / 8 / 3 | 11 / 8 / 3 | `DORF_FIGUREN` | **stimmt** |
| Sechs Grundzeilenpaare und fünf Aktzeilen je Figur | Z. 91ff. | 11×6 / 11×5 | 66 Paare, 55 Aktzeilen | 1680-1956 | **stimmt** |
| Bramsche: 8 Antworten, 3 Abweisungen | Z. 125-139 | 8 / 3 | 8 / 3 | 1714-1728 | **stimmt** |
| Lott/Pahl: je 7 Anlässe × 3 Paare | Z. 276-366 | 21 Paare je Figur | 21 / 21, Schlüssel deckungsgleich mit `RANDNOTIZ` | 1865-1955 | **stimmt** |
| Sprite/Anker/Haar/Rüstung je Figur wie in `figuren-dorf.md` | Z. 91-366 | 11 Zuordnungen | alle 11 exakt | `CF_HAIR` 533, `CF_ARMOR_FILES` 601 | **stimmt** |
| Zapfs Kessel-Pflichtsatz **nicht** eingebaut | Z. 372, 633, 653 | String fehlt | „Der Kessel ist ein Kopierer." kommt nicht vor | — | **stimmt** |
| Spawn-Block in `genMap()` | Z. 379-403 | wörtlich | wörtlich identisch | `genMap` 2233-2255 | **stimmt** |
| TDZ-Nachtrag: `sc` wandert nach `DRAW_NPC` | Z. 406, 665 | `PLAYER_SC` erst später deklariert | `genMap()` 2268, `const PLAYER_SC` 2908 → TDZ real | 2268 / 2908 | **stimmt** |
| `if(n.fest) continue;` am Kopf der Wanderschleife | Z. 415 | erste Zeile | erste Zeile | 6115-6116 | **stimmt** |
| `drawBubble()` reine Extraktion, `drawAlter()` unverändert | Z. 425-455, 466 | wörtlich | wörtlich identisch | `drawBubble` 6428 | **stimmt** |
| `drawAnlage3()` stumm, keine Kontextaktion | Z. 457-463, 483 | kein `aktBiete` | nur Zeichenaufruf aus `DRAW_NPC` | `drawAnlage3` 6462 | **stimmt** |
| `DRAW_NPC`-Case | Z. 471-478 | wörtlich | wörtlich identisch | 6315-6322 | **stimmt** |
| Blase im bestehenden Pool-Eintrag, kein zweiter `pushDraw` | Z. 481 | ein Eintrag je NPC | `pushDraw(n.y, DRAW_NPC, n)`, Blase im selben Case | 6280 / 6321 | **stimmt** |
| `AKT_NPC=11` in der bestehenden Konstantenzeile | Z. 490 | eine Konstante mehr | `AKT_NPC=11` (W5 hängte `AKT_ZUSTELLEN=12` an) | 4854 | **stimmt** |
| `aktBiete` mit eigener Weltposition je Figur | Z. 497 | `n.x, n.y` | `for(const n of npcs) aktBiete(n.x, n.y, …)` | `scanAktion` 4889 | **stimmt** |
| Grußpflicht gewinnt gegen jede Figur (Distanz 0) | Z. 501, 643 | strikt `<` in `aktBiete` | `if(d < aktD2)`, Gruß vor der NPC-Schleife | `aktBiete` 4856 | **stimmt** |
| `fuehreAktion()`-Cases `AKT_NACHFRAGE`/`AKT_NPC`/`AKT_AMT` | Z. 506-508 | 3 Cases | alle drei vorhanden | 4921-4923 | **stimmt** |
| `npcCycle()`-Codeblock: `% (grund.length + 1)`, Grundzeile bei idx 0 | Z. 518-526 | so | `% (grund.length + 2)`, idx 0 = **Anredezeile**, plus `langAnsprechen`/`langZusatz` | `npcCycle` 4932-4954 | **überholt** |
| `npcSprechen()`-Codeblock, `bramscheFragePending` Boolean | Z. 529-540 | Boolean | Zähler `bramscheFragen`, Wiederholungssperre, `rangSchluessel()`-Wiederscharfstellung | `npcSprechen` 4957-4975 | **überholt** |
| „Erstes Ansprechen beantwortet, zweites weist ab, jedes weitere Kreislauf" | Z. 556, 641 | genau so | ab `rangSchluessel()` entfällt die Abweisung, die Frage stellt sich neu scharf | 4966-4968 | **überholt** |
| „Lott/Pahl reagieren **dauerhaft** auf `letzterAnlass`" | Z. 558, 640 | kein Verbrauch | `letzterAnlass = null;` direkt nach der Ausgabe | `npcSprechen` 4981 | **weicht ab** |
| `n.bubbleHideAt = gameT + 4;` | Z. 552 | 4 Sekunden | identisch | 4988 | **stimmt** |
| Ein-Zeilen-Hook `letzterAnlass = anlass;` vor den Gates | Z. 575 | erste Zeile von `knRandnotiz` | erste Zeile, vor Lookup und `knLineErlaubt` | `knRandnotiz` 4026-4029 | **stimmt** |
| „Fängt alle sieben Anlässe ab, ohne einen neuen Aufrufort" | Z. 571 | 7 Anlässe, 0 neue Aufrufe | `RANDNOTIZ` hat genau 7 Schlüssel, deckungsgleich mit `lott.anlass`/`pahl.anlass`; alle 10 Aufrufstellen Bestandscode | 3854 | **stimmt** |
| `aktStand()`-Formel | Z. 587 | `Math.min(5, Math.floor(amt.schichten/10)+1)` | identisch | `aktStand` 2941 | **stimmt** |
| „`aktStand()` neben `nachSchicht()` (`:6060`)" | Z. 581 | dortige Lage | von W5 vor das `amt`-Literal gezogen | 2941 | **überholt** |
| Aktstand-Abbildung Kapitel 9 | Z. 586, 639 | 0-9→1, 40+→5 | korrekt | 2941 / 6969 | **stimmt** |
| `bramscheFragePending = true;` in `startShift()` | Z. 596 | Boolean | `bramscheFragen = 1 + (langFertig('anlage3') ? 1 : 0);` | `startShift` 6942 | **überholt** |
| `knAssertCaps()`-Erweiterung, Codeblock | Z. 605-615 | wörtlich | wörtlich identisch | `knAssertCaps` 3885-3893 | **stimmt** |
| Deckel z1≤48, z2≤32, Aktzeile ≤44 eingehalten | Z. 607, 644 | 0 Verletzungen | 0 Verletzungen; Maxima 46 / 32 / 44 | 3887-3893 | **stimmt** |
| `placeMonsters()`: zitierte Zeile mit Zusatz „— deckt auch W3-Figuren ab" | Z. 623 | Zeile so im Code | Zusatz existiert nicht, auch nicht bei `3af7099` | `placeMonsters` 3212 | **weicht ab** |
| „alle elf Heimatanker liegen innerhalb von `VILLAGE`" | Z. 620, 642 | 11/11 | alle 11 innerhalb, keiner auf einem Gebäude-Footprint | `VILLAGE` 1649 | **stimmt** |
| „`npcSprechen()` schreibt ausschließlich in die vorhandenen Blasenfelder" | Z. 628 | keine weitere Schreibstelle | `npcCycle` 4935 → `langAnsprechen` 8382 → `langEreignis` → `saveKladde()` 8367 | 4935 / 8367 | **weicht ab** |
| „Kein neuer `localStorage`-Schlüssel" | Z. 629 | 0 | W3-Diff enthält keine `localStorage`-Zeile | — | **stimmt** |
| „Kein Eingriff in Knöterichs Logik, einzige Zeile ist `letzterAnlass = anlass;`" | Z. 630 | 1 Zeile | genau 1 Zeile im W3-Diff in dieser Region | 4027 | **stimmt** |
| „Kein neuer Sound, `sfx.*` unverändert" | Z. 631 | 0 | W3-Diff enthält keine `sfx.`-Zeile | — | **stimmt** |
| „Keine Kollisionsprüfung gegen `npcs[]`" | Z. 642 | 0 | `npcs` nur gelesen für Spawn, Wander, Zeichnen, `aktBiete`, Save | 6 Fundstellen | **stimmt** |
| „`knAssertCaps()` meldet keine Verletzung für `DORF_FIGUREN`" | Z. 644 | still | statisch nachgerechnet: 0 Verletzungen über 293 Strings | 3887-3893 | **stimmt** |
| „keine inhaltliche Neuprüfung nötig, solange kein Text umformuliert wird" | Z. 645 | Bedingung hält | W5 hat 3 Zeilen umformuliert; keine dokumentierte Neuprüfung | 1760, 1761, 1794 | **weicht ab** |
| „`npcSprechen()`/`npcCycle()` laufen nur bei Tastendruck, nicht im Renderpfad" | Z. 646 | kein Renderaufruf | nur aus `fuehreAktion` | 4922 | **stimmt** |
| „`drawBubble()` alloziert nichts pro Frame" | Z. 646 | 0 Allokation | 2× `ctx.measureText()` je sichtbarer Blase je Frame; bis zu 12 Blasen gleichzeitig | `drawBubble` 6433 | **weicht ab** |
| „kein `Math.hypot`" | Z. 646 | 0 im W3-Pfad | Wanderschleife und `aktBiete` nutzen `sqDist` | 6122, 4856 | **stimmt** |
| „300 Frames ohne Exception, lokal und live" | Z. 647 | Laufzeitnachweis | nicht statisch entscheidbar; in Spannung zum Eingeständnis Z. 666 (`document.hidden`, rAF tickte kaum) | — | **nicht prüfbar** |
| „Node-Syntaxcheck über den extrahierten Skriptblock" | Z. 657 | parst | heute reproduziert: `node --check` → OK | — | **stimmt** |
| „Alle elf `DORF_FIGUREN`-Sheets in `SHEETS`" | Z. 660 | keins fehlt | 8 `cfnpc_*` via `SHEET_LIST`, 3 `npc_baked_*` via `bakeAllNpcSheets` | 796-800, 1007 | **stimmt** |
| „`assertRigRegistrations()` meldet nichts" (deckt auch die neuen Sheets) | Z. 659 | Prüfung deckt sie ab | deckt `cfnpc_*` ab, **nicht** `npc_baked_*` — die entstehen erst danach in der Kette | 9092 vs. 9096 | **weicht ab** |
| „Milb: sechsmaliges `F` → sechs Grundzeilen, das siebte zeigt die Aktzeile" | Z. 661 | 7. Druck = Aktzeile | heute: 1. Druck = Anredezeile, 8. Druck = Aktzeile | `npcCycle` 4944-4952 | **überholt** |
| „Bramsche … setzt `bramscheFragePending=false`" | Z. 662 | Variable existiert | existiert nicht mehr | 3930 | **überholt** |
| „Lott und Pahl lesen danach korrekt aus `fig.anlass[letzterAnlass]`" | Z. 663 | beide | nur der zuerst Angesprochene; der zweite fällt in den Zyklus | 4977-4983 | **überholt** |
| „`aktStand()` 0/9/10/19/20/39/40/49/60 → 1/1/2/2/3/4/5/5/5" | Z. 664 | exakt | nachgerechnet, exakt | 2941 | **stimmt** |
| `figuren-dorf.md`: „Alle Werte gegengezählt, nicht geschätzt" | fig. Z. 9 | 209 Klammerzahlen korrekt | alle 209 stimmen auf das Zeichen | fig. 24-231 | **stimmt** |
| `figuren-dorf.md`: „Die Werte stehen in Klammern hinter jeder Zeile" | fig. Z. 346 | 293 von 293 | 209 von 293; alle 84 Lott/Pahl-Anlasszeilen ohne | fig. 285-297, 326-338 | **weicht ab** |
| `figuren-dorf.md`: „Lotts und Pahls je 21 Anlass-Zeilen" | fig. Z. 346 | 21 Zeilen | 21 *Paare* = 42 Zeilen je Figur, 84 gesamt | 1865-1955 | **weicht ab** |
| `figuren-dorf.md`: „Alle elf Figuren am Ende mit `ok:true`" | fig. Z. 5 | Prozessbehauptung | kein Artefakt im Repo | — | **nicht prüfbar** |
| Weltbibel W3: „keine bekommt Monster auf die Kachel" | wb. Z. 541 | Dorf monsterfrei | `if(inVillageT(tx,ty)) continue;` | `placeMonsters` 3212 | **stimmt** |
| Weltbibel W3: „`AKT_`-Konstanten kollidieren nicht mit der Grußpflicht" | wb. Z. 541 | keine Kollision | 12 disjunkte Werte, Grußpflicht gewinnt per Distanz 0 | 4854, 4884 | **stimmt** |
| Formregeln Kapitel 13: keine Gedankenstriche, keine Emojis | fig. Z. 9 | 0 | 0 über alle 301 Strings | — | **stimmt** |
| Sperrvermerk Kapitel 7 auf allen Zeilen | Z. 11 | keine Mechanik | Abgleich gegen die `GEHEIM`-Liste aus `langAssert()`: 0 Treffer | 8431 | **stimmt** |
| „alle optisch unterscheidbar" | Z. 637 | sichtbar verschieden | 8 verschiedene Sheets; Lott/Pahl unterscheiden sich nur durch Haarfarbe bei sonst identischem Komposit | 1849, 1903 | **nicht prüfbar** |

**68 Zusagen geprüft: 44 stimmt, 9 weicht ab, 11 überholt, 4 nicht prüfbar, 0 nicht auffindbar.**

## G2: W4, Schwarzes Brett

Vergleichsanker: **`06c3456`** (nicht `3af7099`, wie das Dokument behauptet — siehe GW-Fund). Alle Zeilennummern HEAD, über Bezeichner gefunden.

| Zusage | Fundort im Dokument | Erwartet | Gefunden | Bezeichner im Code | Urteil |
|---|---|---|---|---|---|
| Zeilennummern gegen Stand nach `3af7099` geprüft | Z. 5 | W4-Bezeichner in `3af7099` auffindbar | `3af7099` enthält **0** Treffer für `AUFTRAG_MOBS`, `06c3456` sieben; alle Doc-Zeilen treffen exakt `06c3456` | — | **weicht ab** |
| Kein neues Panel / kein neuer Reiter | Z. 9, 147 | keine neue Fläche | vierte Sektion in `showDorf()`, Block in `renderAmtFenster()` | `showDorf` 8658 | **stimmt** |
| Kein neuer `localStorage`-Schlüssel | Z. 9, 147 | nur `sda_amt_v1` | Diff enthält keine `_KEY`-Zeile | `AMT_KEY` 3716 | **stimmt** |
| **Drei** neue `amt`-Felder | Z. 9 (Fix `cfd62a4`) | genau 3 | `brett`, `auftrag`, `auftraegeErfuellt` — Literal 2934, Ladezeilen 3732-3735 | `amt` 2928 | **stimmt** |
| Keine zweite Währung, kein Questmarker | Z. 9, 148 | — | Lohn geht in `amt.bankGold` | `auftragZahle` 8619 | **stimmt** |
| Nur Verdrahtung auf Bestehendes | Z. 9 | keine neuen Systeme | 5 neue Modulvariablen, sonst bestehende Zähler | 2948 | **stimmt** |
| Sperrvermerk strukturell: nur zwei Beglaubigungs-Auflagen | Z. 11 | `anzahl`/`guete` erzwungen | `pruefePar` erzwingt genau das (tautologisch) | `AUFTRAG_TYPEN.beglaubigung` 7880 | **stimmt** |
| Sperrvermerk textuell: Begriffsliste | Z. 11 | Kesselgrammatik gesperrt | 11er-Liste `GEHEIM` auf Titel/Satz/Bemerkung | `auftragAssertBrett` 7958 | **stimmt** |
| „geprüft gegen … **Humor-Grundgesetz** … über `auftragAssertBrett()`" | Z. 3 | Guard prüft Kap. 13 | Guard prüft nur Zeichendeckel, `/[—–]/`, Emoji, `GEHEIM`. Kein Prüfpunkt zu den neun Regeln | 7957-7966 | **weicht ab** |
| `placeMonsters()` läuft genau einmal je Schicht | Z. 15 | 3 Aufrufer | 3221, 6803 (im Schichtmodus unerreichbar), 6928 | `placeMonsters` 3204 | **stimmt** |
| `crab`/`sandmage` ≈ 3,5 Exemplare je Schicht | Z. 15 | Rechnung tragfähig | 55 Würfe, Sandband 21/72 = 29,2 % → ~14,6 ÷ 4 Rosterplätze = 3,6 | 3207-3217 | **stimmt** |
| P(keine Tür ≥ 5) = 26 % bei sechs Türen | Z. 15, 52 | (4/5)^6 | = 0,2621; 6 Türen = `CONFIG.kammerTueren`(2) × 3 Bänder | `setzeKammerTueren` 4227 | **stimmt** |
| Portal sonst erst ab Stufe 11 sicher | Z. 15, 81 | Chance 1 ab Lvl 11 | `player.level >= 11 ? 1 : 0.05+(lvl-5)*0.03` | 3424 | **stimmt** |
| `AUFTRAG_MOBS` aus `BIOME_MOBS` abgeleitet, nie von Hand | Z. 31 | Schleife | `for(const b in BIOME_MOBS)` … Dedup | 3173-3176 | **stimmt** |
| Ergebnis sind genau die neun genannten Typen | Z. 31 | 9 Namen | exakt diese, in dieser Reihenfolge | `BIOME_MOBS` 3163 | **stimmt** |
| `BIOM_AMT` übernimmt W1-Namen wörtlich | Z. 31 | 3 Biome | Eisablage / Ablage A / Brandabschnitt, Nom+Dat | `BIOM_AMT` 3178 | **stimmt** |
| `auftragTypBevorzugen`/`auftragOrtBand` TDZ-sicher | Z. 50 | nur `amt.auftrag`, `BIOME_MOBS` | bestätigt (+ `MH`) | 3191, 3198 | **stimmt** |
| `auftragSoll`/`auftragOrtSoll` in `startShift()` vor `placeMonsters()` | Z. 50 | Reihenfolge | 6922-6924 vor 6928 | `startShift` 6886 | **stimmt** |
| Kontingente `ziel+2` / `ziel*3` / `ziel+3` | Z. 50 | Menge/Sammlung/Ort | wortgleich | 6922-6924 | **stimmt** |
| **Weltgarantie 1: Menge nie unerfüllbar** | Z. 50, 158 | genug Ziele | Substitution ändert nur den **Typ**, nicht die **Zahl** der Biom-Spawns. Deckel ≈ 15 (Sand) / 16 (Schnee) / 18 (Gras); `menge` erreicht `ziel` 15 und 17 | `AUFTRAG_TYPEN.menge` 7833-7839 | **weicht ab** |
| Ort-Garantie | Z. 50, 181 | Band erzwungen | `auftragOrtBand()` lenkt `ty`, `soll=ziel+3` (max 19) ≫ `ziel` (max 16) | 3198-3202 | **stimmt** |
| Dekrement erst bei wirklich gesetztem Monster | Z. 50 | nach `makeMon` | `if(band) auftragOrtSoll--;` hinter allen `continue` | 3217 | **stimmt** |
| Weltgarantie 2: Kammer, höchste Tür auf `ziel` | Z. 52-71 | erzwungen | `if(best.diff < auftragK.ziel) wuerfleTuer(best, auftragK.ziel)` | 4252-4257 | **stimmt** |
| 20 Läufe Ziel 5 → 20-mal `diff===5` | Z. 71, 179 | deterministisch | Code erzwingt es unbedingt | 4256 | **stimmt** |
| Weltgarantie 3: Reise, Portal ab Stufe 5 garantiert | Z. 73-81 | Chance 1 | nur innerhalb `killMon()` und nur bei `player.level >= 5`; Stufe 5 ist nicht garantiert | 3422-3426 | **weicht ab** |
| Reise erst ab Akt II (`wenn: aktStand() >= 2`) | Z. 81 | Gate | vorhanden; entspricht `amt.schichten >= 10`, also ganz Akt I | `AUFTRAG_TYPEN.reise` 7903 | **stimmt** (Formulierung ungenau) |
| Drei Pools, drei verschiedene Typen per Konstruktion | Z. 85 | `genommen`-Filter | `genommen[typ]=true`, Filter über alle Pools | `auftragWuerfeln` 7926-7933 | **stimmt** |
| `AUFTRAG_POOLS` wörtlich wie zitiert | Z. 88-92 | Identität | zeichengleich | 7811-7815 | **stimmt** |
| Alle neun Typen erreichbar | Z. 95 | kein toter Eintrag | jeder Typ in ≥1 Pool; `bilanz` exklusiv in Pool 2; Guard prüft `gesehenGesamt` | 7811-7815, 8012 | **stimmt** |
| Nur vier Typen mit `zaehle`, fünf ohne | Z. 95 | 4 / 5 | mit: ort, kammer, beglaubigung, reise | 7845/7854/7877/7907 | **stimmt** |
| `bruch` nur Verzicht/Verfahren | Z. 95 | 2 | 7888, 7896 | — | **stimmt** |
| Sammlung „Führen Sie mit", Begründung Beutel-Kappung | Z. 97 | `zutatenMitnahmeBasis` 5 | 3712, Kappung in `endShift` 6958-6967 | — | **stimmt** |
| Verzicht/Verfahren prüfen `shiftKillsTotal` bei `sofort:false` | Z. 98 | Mindestleistung | 7889-7890, 7897-7898 | — | **stimmt** |
| Amtsleitungs-Bemerkung fest auf mittlerem Aushang | Z. 100 | `bm: st===1 ? 2 : rri(...)` | zeichengleich | 7936, 7820 | **stimmt** |
| Lohn 150–400, gestaffelt nach Pool-Index | Z. 100 | 3 Stufen | `[150,240,330] + rri(0,7)*10` | `AUFTRAG_LOHN` 7919 | **stimmt** |
| Nur `rri` (Math.random), nie `ri`/`R` | Z. 100 | gesiegelter Strom unberührt | W4-Block enthält kein `ri(`/`R(` | 1044-1045 | **stimmt** |
| `auftragMigration()` verwirft unbekannte Typen ohne zu speichern | Z. 100 | kein `saveAmt` | IIFE ohne `saveAmt()` | 7945-7948 | **stimmt** |
| Guard muss nach `aktStand()` stehen | Z. 104 | TDZ | `aktStand` 2941, Guard 7954/Aufruf 8017 | — | **stimmt** |
| Guard prüft Roster: MONDEF/.art/!reserved/!boss/ZUTAT_NOUNS/genau ein Biom | Z. 106 | 6 Prüfungen | alle sechs vorhanden | 7970-7981 | **stimmt** |
| Guard: 61 Schichtstände × 40 Bretter = 2440 | Z. 107 | Zahlen | `sch <= 60` × `n < 40` = 2440 | 7989-7991 | **stimmt** |
| Guard: sechs weitere Prüfpunkte je Brett | Z. 107 | 6 | alle vorhanden — aber fünf konstruktionsbedingt immer wahr | 7993-8012 | **stimmt** (Aussagekraft s. Guard-Abschnitt) |
| Zeichendeckel 36/60/70 aus `max-width:580px` | Z. 107 | CSS-Beleg | CSS 219; `text(...,36/60/70,...)` 7985, 8005-8006 | — | **stimmt** |
| Guard prüft Formregeln **auf jedem erzeugten Text** | Z. 107, 160 | alle W4-Strings | nur `titel`, `satz`, `AUFTRAG_BEMERKUNGEN`; zehn weitere Textquellen ungeprüft | 5029-5037, 8609, 8623, 8635, 8686-8698 | **weicht ab** |
| „kein würfelbarer Aushang kann unerfüllbar sein" | Code 7951 | Beweis | alle neun `pruefePar` sind Tautologien; Guard ruft `stand`/`zaehle`/`bruch` nie auf | 7839-7916 | **weicht ab** |
| `amt.schichten` gespiegelt und exakt wiederhergestellt, kein `saveAmt()` | Z. 109 | Spiegel | 7988 → 8011; kein `saveAmt`/`saveKladde` | — | **stimmt** |
| Trichter-Codeblock wie zitiert | Z. 113-124 | Identität | erste Zeile im Code ist heute `langEreignis(was, info);` (W7) — im Zitat nicht enthalten | `auftragEreignis` 8599-8615 | **überholt** |
| „acht bestehende Fundstellen" | Z. 111, 128-137 | 8 | 8 Ereignisarten, aber **9** Aufrufstellen (`addZutat` 2547 und 2548) | — | **weicht ab** |
| `kill` nach `shiftKillsByType`-Inkrement | Z. 130 | Reihenfolge | 3361 → 3362 | `killMon` 3359 | **stimmt** |
| `kammer` nach `k.geleert = true`, vor Auszahlung | Z. 131 | Reihenfolge | 4486 → 4487, Gold ab 4489 | `truheOeffnen` | **stimmt** |
| `zutat` in `addZutat()`, beide Return-Pfade | Z. 132 | 2 Stellen | 2547, 2548 | — | **stimmt** |
| `kessel` nach `kladde.crafts++`, `rar` final | Z. 133 | Reihenfolge | 5491/5492, 5507, 5508 | `brew` | **stimmt** |
| `trank` nach `saveKn()`, alle Frühabbrüche davor | Z. 134 | Reihenfolge | 3486-3492, 3501 | `drinkPotion` | **stimmt** |
| `zauber` nach `player.spellCd = …` | Z. 135 | Reihenfolge | 3610-3620, 3624 | `castSpell` | **stimmt** |
| `ablage` letzte Zeile von `loadLevel2()` | Z. 136 | Reihenfolge | 3230 | — | **stimmt** |
| `schichtende` **ganz am Anfang** von `endShift()` | Z. 137 | erste Anweisung | drei UI-Schließungen davor (6950-6952); `toggleKessel()` schiebt Topfzutaten zurück | `endShift` 6949 | **weicht ab** (klein) |
| `player.gold` beim `schichtende` noch voller Stand | Z. 137 | vor Abzug | `carryGold` erst 6957 | — | **stimmt** |
| Doppelzählung strukturell ausgeschlossen | Z. 126 | kein Pfad | innerhalb einer Schicht bestätigt; **über einen Reload hinweg zahlt derselbe Aushang erneut** | 8605, 8617-8619, 6989 | **weicht ab** |
| `auftragZahle()` zahlt in `amt.bankGold`, nicht `player.gold` | Z. 141 | Bank | 8619 | — | **stimmt** |
| `auftragBrettSichern()` ganz am Anfang von `showDorf()` | Z. 141 | erste Zeile | 8659 | — | **stimmt** |
| `waehleAuftrag(i)` in der Form von `waehleStartFluch()` | Z. 141 | Formgleichheit | 8651-8654 vs. 7797 | — | **stimmt** |
| Rückgabe-Link als `<span>`, wegen `#amtFenster button{width:100%}` | Z. 141 | CSS-Beleg | CSS 215; 5037 | — | **stimmt** |
| `endShift()` setzt `amt.auftrag = null` unmittelbar vor `saveAmt()` | Z. 141 | Reihenfolge | 6989 → 6990 | — | **stimmt** |
| Abbruch ohne Strafe, dreifach | Z. 143, 157 | 3 Wege, kein Abzug | 8698, 8639, Nichterfüllen; kein Abzug irgendwo | — | **stimmt** |
| Kein neuer Sound, `sfx.*` unverändert | Z. 150 | Diff-Beleg | keine `sfx.`-Zeile | — | **stimmt** |
| Keine Figurenrede über `npcSprechen()` | Z. 151 | nur Aushangtext | `AUFTRAG_BEMERKUNGEN` nur in `showDorf` 8693 und im Guard | — | **stimmt** |
| Ein Auftrag pro Schicht | Z. 155 | Invariante | drei Mechanismen vorhanden — Invariante bricht über Reload | 8646, 8652, 6989 | **weicht ab** |
| Erfüllung: genau ein `stand(a)` gegen genau ein `a.ziel` | Z. 156 | 9 × 1 | alle neun haben `stand` | 8614, 8629 | **stimmt** |
| **Nie unerfüllbar** (Abnahme) | Z. 158 | alle 9 Typen | Menge bricht; Reise hängt an Stufe 5; Beglaubigung und Bilanz haben gar keine Garantie | — | **weicht ab** |
| `CONFIG.schichtModus=false` macht W4 **vollständig inert**, drei Wächter | Z. 161 | keine Wirkung | fünf Wächter statt drei; `auftragTypBevorzugen`, `auftragOrtBand` und der Kammer-Garantieblock haben **keinen** und lenken Welt und Türen weiter | 3191-3202, 4252-4257 | **weicht ab** |
| Trichterpfad ohne Allokation | Z. 162 | Hot Path | erste Zeile ist `langEreignis()` mit `for…in` und möglichem `saveKladde()` | 8602 | **überholt** |
| `saveAmt()` nur bei Auszahlung/Auswahl/Rückgabe | Z. 162 | 3 Stellen | 4 Stellen: 8619, 8639, 8648, 8653 | — | **weicht ab** (klein) |
| Persistenz: Reload hält Brett/Aushang, Fortschritt bei null | Z. 163, 186 | Verhalten | trifft zu — und ist genau der Pfad der Doppelauszahlung | 3732-3735, 6932 | **stimmt** |
| „Erste Schicht: `amt.brett`/`amt.auftrag` bleiben `null`" | Z. 176 | frischer Stand | `showDorf()` wird vor Schicht 1 nie erreicht | 6831-6833 | **stimmt** |
| Floater „Aushang erfüllt · 300 Gold" | Z. 182 | Lohn plausibel | 300 liegt in 240-310 (Pool 1) | 7919, 8623 | **stimmt** |
| Dienstbericht-Zeile vor der Beuteanteil-Zeile | Z. 184 | Position | 7004 vor 7005 | — | **stimmt** |
| Beispielzeile „Vorgangslage Ablage A · offen, 3 von 6" | Z. 184 | erzeugbar | `menge`, `st=0`, `stufe=2` → `ziel` 6 | 7835-7836 | **stimmt** |
| Guard: 2440 Läufe „unter einer Millisekunde" | Z. 107 | Laufzeit | ≈7320 `text()`-Aufrufe × 13 Scans + 2440 `auftragWuerfeln()`; Größenordnung spricht dagegen | 7960-7966 | **nicht prüfbar** |
| Guard „keine DOM-Berührung" | Z. 107 | kein DOM | bestätigt | 7954-8016 | **stimmt** |
| Weltbibel Kap. 14: neun Typen, drei je Schicht, Gold in die Ausbau-Ökonomie | wb. 517-531 | Deckung | alle drei erfüllt | — | **stimmt** |
| Weltbibel Kap. 11: Satz „wird ab Akt III unerträglich" | wb. 438 | Eskalation | feste Platzierung umgesetzt, **keine Eskalation ab Akt III** | 7936 | **weicht ab** (klein) |

**73 Zusagen geprüft: 55 stimmt, 16 weicht ab, 1 überholt, 1 nicht prüfbar, 0 nicht auffindbar.**

## G3: W5, Der Vorgang

Anker: `45912f6` (W5), Vorgänger `ad72e37`. Zeilennummern heutiger Stand.

| Zusage | Fundort im Dokument | Erwartet | Gefunden | Bezeichner im Code | Urteil |
|---|---|---|---|---|---|
| `killMon()` bleibt „Zeile für Zeile unverändert" | Z. 200 | keine Änderung in W5 | `git show 45912f6` Hunk `@@ function killMon(m)`: 2 Zeilen geändert (`kandF`/`kandE`), 4 Zeilen + Kommentar neu. Z. 110 desselben Dokuments sagt „Vierte Zeile in `killMon()`" | `killMon` 3359, 3375-3376, 3385-3387 | **weicht ab** |
| Die alte Siegweiche bleibt unverändert | Z. 200, 174 | byte-gleich | `ad72e37:3392` und `HEAD:3448` byte-identisch (nachgeprüft) | 3448 | **stimmt** |
| Kein neues `amt`-Feld, keine `loadAmt()`-Ladezeile | Z. 9, 15 | `amt`-Literal unverändert | W5-Hunk fügt nur `aktStand()` ein, kein Feld; Bestand in `kladde.vorgang` | `amt` 2926 | **stimmt** |
| `kladde.vorgang` additiv geladen wie `fl` | Z. 26 | additive Ladezeile | `if(o.vorgang) kladde.vorgang = o.vorgang;` | `loadKladde` 2849 | **stimmt** |
| `aktStand()` wandert unter das `amt`-Literal, TDZ-Fix | Z. 17-24 | Deklaration oberhalb `setzeKammerTueren()` | Deklaration 2941, Top-Level-Aufruf 5264, Zeigerkommentar am alten Ort 7018 | `aktStand` 2941 | **stimmt** |
| `aktStand()` liest ausschließlich `amt` | Z. 24 | keine weiteren Quellen | `Math.min(5, Math.floor(amt.schichten/10)+1)` | 2941 | **stimmt** |
| „drei Leser, alle unterhalb der neuen Position" | Z. 24 | 3 Leser | heute 9 Leser (3745, 3746, 4952, 7903, 7925, 8161, 8195, 8282, 8311); tiefste Position 3745 > 2941, Eigenschaft hält | `serieFrei`, `npcCycle`, `LANGVORGAENGE` | **überholt** |
| Vier Adresszeilen, 1-3 mit Biom, 4 ohne | Z. 31-36, 44 | 4 Einträge | exakt so | `ADRESS_ZEILEN` 2879-2892 | **stimmt** |
| Zusammensetzung ergibt `VORGANG_ANSCHRIFT` | Z. 37 | drei Fragmente | Zeilen 1/2/3 tragen genau diese | 2880-2893 | **stimmt** |
| `findeAdresszeile()` spiegelt `findeBlatt()` exakt | Z. 38 | gleiche Bauform | identisch bis auf den Bucket | 2894 / 2865 | **stimmt** |
| `BLAETTER`/`blaetterAssert`/„N von 48" unberührt | Z. 28, 202 | unverändert | `!== 48` 2832 unverändert; Zählzeile 5626 unverändert | `blaetterAssert` | **stimmt** |
| Kein Wort aus der GEHEIM-Liste in W5-Texten | Z. 46 | 0 Treffer | 0 Treffer über alle Tabellen **und** die drei gerenderten Panels | `vorgangAssert` 7614 | **stimmt** |
| `SERIE_AKT` = eine Wahrheitsquelle für beide Fundwege + Guard | Z. 48-56 | drei Verbraucher | `truheOeffnen` 4506, `killMon` 3375-3376, `vorgangAssert` 7644 | `SERIE_AKT` 3744 | **stimmt** |
| `!CONFIG.schichtModus`-Kurzschluss hält alle Serien frei | Z. 56, 210 | strukturell | `serieFrei = s => !CONFIG.schichtModus \|\| …` | 3745 | **stimmt** |
| Serien C-F schalten bei Schicht 10/20/30/40 frei | Z. 210 | Schwellen exakt | `SERIE_AKT {A:1,B:1,C:2,D:3,E:4,F:5}`; Serie↔Biom korrekt | 3744, 7662-7667 | **stimmt** |
| Wurfchancen/Reihenfolge F-vor-E unverändert | Z. 73 | 0.006 / 0.04 | unverändert im Diff | 3378-3379 | **stimmt** |
| Markierung am Ende von `setzeKammerTueren()`, nach der W4-Garantie | Z. 77-88 | Position | Markierung 4265-4272, W4-Garantie 4251-4256 davor | 4227 | **stimmt** |
| Nichts wird persistiert, `t.adr` entsteht je Schichtstart neu | Z. 90 | `kammerTueren` geleert | `kammerTueren.length = 0;` 4228 | 4228 | **stimmt** |
| `Math.random()`, nicht `ri()`/`R()` | Z. 90 | Weltstrom bleibt draußen | `kand[Math.floor(Math.random()*kand.length)]` | 4271 | **stimmt** |
| Genau eine Tür je Biom trägt `t.adr` | Z. 90, 233 | eine je Biom | eine Markierung je unerledigter Zeile, Biome paarweise disjunkt | 4266-4271 | **stimmt** |
| Sonderschild: nur zwei Textzeilen verzweigen, Kasten pixelgleich | Z. 92-98 | `fillRect`/`strokeRect` unverändert | Diff ändert genau zwei `fillText`-Zeilen + `fillStyle` | `drawKammerTuer` 5241-5245 | **stimmt** |
| Schild selbstheilend, kein zweiter Floater | Z. 100 | `!vorgangHat(t.adr)` | `const adrK = t.adr && !vorgangHat(t.adr);` | 5241, 2895 | **stimmt** |
| Garantierter Drop in `truheOeffnen()`, unabhängig vom Aktenfund-Wurf | Z. 102-108 | eigener Block | eigener `if`-Block nach dem Wurf | 4519 | **stimmt** |
| Vierte Zeile in `killMon()`, kein eigener Wurf | Z. 110-114 | reiner Boolean | `if(vorgangAdressAkt() && vorgangDreiZeilen() && findeAdresszeile(4))` | 3385 | **stimmt** |
| `renderBlaetter()` stellt `vorgangBestandBlock()` voran, liefert `''` vor Akt IV | Z. 118 | leerer String | `if(!vorgangHat(1)&&…) return '';` | 7527-7528 | **stimmt** |
| `#blaetterBox` bekam **zwei** CSS-Regeln | Z. 118 | genau 2 | Diff fügt genau 2 Zeilen ein (heute 130, 131) | CSS 130-131 | **stimmt** |
| `vorgangJahresBlock()` ohne `apply()`/`saveAmt()`, idempotent | Z. 122 | reine Funktion | reiner Stringbauer über `amt.schichten` | 7512 | **stimmt** |
| Einbau zwischen Bonuskasten und `rangZeremonieBlock()` | Z. 122 | Position | 7775 direkt vor 7776 | `showJahresgespraech` | **stimmt** |
| Nicht zyklisch indiziert (`% Länge`) | Z. 124 | kein Modulo | `idx >= 0 && idx < VORGANG_JAHRES.length ? … : null` | 7513-7515 | **stimmt** |
| 5 Absätze, `hinweis` nur bei 30, ab 60 die Weiter-Zeile | Z. 124, 232 | idx 0-4 | 5 Einträge, `hinweis` nur an Index 2 | 7503-7511 | **stimmt** |
| Gleichlauf: `rangGruppe()` erstmals 2 bei Schicht 30 | Z. 124 | Schwelle 30 | `rangStufe(30)=6`, `RAENGE[6].g = 2`; bei 25 → `g=1` | `RAENGE` 7048 | **stimmt** |
| Drei Aktzeilen über bestehendes `fig.akt[]`, elf Figuren | Z. 126-135 | kein neuer Mechanismus | `n.bubbleText1 = fig.akt[aktStand()-1]` 4952 | `DORF_FIGUREN` | **stimmt** |
| Zeilen 37/35/42 Zeichen unter 44er-Deckel | Z. 136 | exakt diese Längen | nachgezählt: 37 / 35 / 42 | `knAssertCaps` 3890 | **stimmt** |
| „Zustellen" nur mit Ausfertigung, Zeichnungsbefugnis, lebendem Boss, Ablage V | Z. 147-148, 213 | vier Bedingungen | `currentLevel === 2 && boss && !boss.dead && vorgangZustellbar()` | `scanAktion` 4875 | **stimmt** |
| `boss.x`/`boss.y`, nie `player.x`/`player.y` | Z. 151 | Weltkoordinaten | `aktBiete(boss.x, boss.y, …)` | 4876 | **stimmt** |
| Grußpflicht-Fix: `aktArt !== AKT_ZUSTELLEN` | Z. 153-159 | eine Bedingung | `if(near && aktArt !== AKT_ZUSTELLEN)` | 4884 | **stimmt** |
| `zustellen()` friert alles per `state`-Wechsel ein | Z. 161-174, 214, 239 | `update()` inert | `update(dt)` beginnt `if(state !== 'play') return;` (5751); Horde-Spawn, Boss-KI, Bossleiste liegen alle darin | `zustellen` 7598 | **stimmt** |
| Bossleiste verschwindet und bleibt weg | Z. 168, 238 | keine Rückkehr | `updateHUD()` vor `display='none'` (7601-7602); einziger Wiederanschalter 5999 liegt in `update()` | 7601-7602 | **stimmt** |
| Kein Schadenspfad während `'zustellung'` | Z. 174 | alle Eingänge gegatet | `tryAttack`-Aufrufer 8716/8756/8788, `attackBtnFire` 5815/8914, `castSpell` 3610 alle hinter `state==='play'` | 3266, 3308, 3610 | **stimmt** |
| `#ovPanel`-Schreibstellen 7 → 8 | Z. 180 | 7 vorher, 8 nachher | `ad72e37` = 7, `45912f6` = 8, HEAD = 8 | — | **stimmt** |
| Schlusspanel drei Schritte, Schritt 3 `location.reload()` | Z. 180-184 | drei Zweige | 7558/7564/7572; `NEUEN VORGANG ANLEGEN` → `location.reload()` 7585 | `vorgangPanelHtml` | **stimmt** |
| Fehlende Puzzleteile blockieren nie | Z. 186 | kein Puzzleteil in der Bedingung | `vorgangAusfertigung() && rangZeichnungsbefugt()` | `vorgangZustellbar` 7554 | **stimmt** |
| Codezitat `p.frei() ? p.text : p.sonst` | Z. 186 | wörtlich | Code: `p.frei() ? p.text : (p.sonst \|\| p.text)` | 7565 | **weicht ab** (kosmetisch) |
| „Teil 1 ist faktisch nie leer" (Siegel bei Schicht 40) | Z. 186 | Siegel liegt bei Zustellung vor | `JAHRES_BONI[3]` fällt nur bei `amt.schichten === 40` (7761-7762); Zustellen ist ab 30 möglich → im gesamten Akt IV (30-39) ist Teil 1 leer. **Live bestätigt** | `JAHRES_BONI` 6879, `vorgangZustellbar` 7554 | **weicht ab** |
| `k:'siegel'` ohne `wirkung:true`, `rangAssert()` zählt hart zwei | Z. 188 | `wirkende.length === 2` | bestätigt | `INSIGNIEN` 7091, `rangAssert` 7275 | **stimmt** |
| `rangDienstsiegel()` = einzige Leserstelle von `INSIGNIE.siegel` | Z. 188 | ein Leser | nur an 7106 | 7106 | **stimmt** |
| Vierter Takt bleibt Text, kein Audioeingriff außer `MUS.goto('office')` | Z. 190 | keine Takt-API | `vorgangPanel` ruft nur `MUS.goto`/`muffle`, `zustellen()` nur `MUS.swell()` | 7587-7592 | **stimmt** |
| Abspann-Reihenfolge nach Weltbibel | Z. 184, wb. 380-387 | „Ganz zuletzt" = Vorgang 2 | die Amtsmarsch-Zeile steht **nach** der Vorgang-2-Zeile | 7580-7581 | **weicht ab** |
| Guard: zehn Prüfblöcke | Z. 192-194 | 10 | (1)-(10) vorhanden | `vorgangAssert` 7610-7750 | **stimmt** |
| Guard sitzt „direkt hinter `rangAssert();`" | Z. 192 | Aufrufort | bei `45912f6` korrekt; heute Selbstaufruf an 8589 hinter `langAssert();` | 8589 | **überholt** |
| Guard ruft `findeAdresszeile()` nie auf | Z. 194, 196 | kein `saveKladde()` | Block (5) schreibt direkt auf den Spiegel | 7675-7686 | **stimmt** |
| Kein `saveAmt()`/`saveKladde()` während der Prüfung | Z. 196 | keine Persistenz | keine Save-Aufrufe; alle gerufenen Funktionen schreibfrei | 7610-7750 | **stimmt** |
| Alle fünf Spiegel exakt zurückgesetzt | Z. 196 | kein Rest | `amt.schichten`, `CONFIG.schichtModus`, `kladde.vorgang`, `amt.bonusNachwachsen`, `kladde.crafts` — alle zurück | 7622-7623 | **stimmt** |
| Guard belegt „Aktstand abgeleitet, keine zweite Wahrheitsquelle" | Z. 209 | Beweis im Sweep | Block (3) übt nur `serieFrei()`; liefe unverändert durch, wenn ein `amt.akt` daneben existierte | 7651-7668 | **weicht ab** |
| `schichtModus=false`: `vorgangZustellbar()` bleibt falsch | Z. 211, 231 | Code-Eigenschaft | `vorgangZustellbar` liest `CONFIG.schichtModus` nirgends; Guard-Block (4) prüft es nicht | 7554, 7669-7673 | **weicht ab** |
| Wer nie zustellt, spielt unendlich weiter | Z. 216 | Schichtlauf unberührt | `zustellen()` einziger Einstieg, `AKT_ZUSTELLEN` einziges neues Angebot | 4875, 4924 | **stimmt** |
| Verbotsliste unberührt (Dialogbaum, Cutscene, zweite Währung …) | Z. 205 | nichts davon | W5-Diff enthält nur Tabellen, Prädikate, zwei Panels, vier Einzeilen-Einhängungen | — | **stimmt** |
| „Node-Syntaxcheck nach jedem Bauschritt" | Z. 227 | Prüfung fand statt | nicht rekonstruierbar | — | **nicht prüfbar** |
| Live-Prüfung im Browser auf Port 8378 | Z. 227 | Prüfung war möglich | `.claude/launch.json` entstand erst mit `a048e5b`, **nach** W5; `serve.py` nimmt den Port als Argument, Ad-hoc-Start also möglich | — | **nicht prüfbar** |
| Boss per `makeMon('boss', …)` gesetzt, Spawn-Loop lief nicht | Z. 236 | plausibel | `makeMon` 3148 existiert; regulärer Spawn erst bei `shadowKills >= 500` | 3148, 5854 | **nicht prüfbar** |

**56 Zusagen geprüft: 45 stimmt, 6 weicht ab, 2 überholt, 3 nicht prüfbar, 0 nicht auffindbar.**

### Sonderfrage: kollidieren `zustellen()` und die alte Siegweiche?

**Nein, kein heutiger Aufrufpfad.** Vier Belege:

* Die Siegweiche (3448) armiert `setTimeout(…, 2000)` mit dem Wächter `if(state==='play')`. `zustellen()` (7600) setzt `state = 'zustellung'`; ein während der Zustellung fälliger Timer läuft ins Leere.
* Die Gegenrichtung ist ausgeschlossen: `zustellen()` (7599) und das Angebot in `scanAktion()` (4875) verlangen beide `!boss.dead`. Nach dem Kampf-Tod wird „Zustellen" nie angeboten, auch nicht im Zwei-Sekunden-Fenster.
* Während `state === 'zustellung'` existiert kein Schadenspfad: `update(dt)` steigt an 5751 aus (damit auch Horde-Spawner, Boss-KI, Projektilschleife, Dauerfeuer, Schichtuhr); die verbleibenden `tryAttack`-Eingänge und `castSpell` sind einzeln hinter `state === 'play'`. `hurtMon()` ist nicht erreichbar, `killMon()` folglich auch nicht.
* `Escape` (8730) greift in Ablage V ins Leere (`kammer` ist `null`).

Randnotiz ohne Zusagenbezug: `state = 'zustellung'` ist terminal, einziger Ausgang ist `location.reload()` (7585). Nach dem Reload bleibt `kladde.vorgang` voll, `vorgangZustellbar()` also wahr — das Ende ist beliebig oft wiederholbar, ohne dass „NEUEN VORGANG ANLEGEN" etwas zurücksetzt. Dasselbe gilt seit jeher für `winGame()` (6819).

## G4: W6, Rang und Laufbahn

Anker: `ad72e37` (W6), Vorgänger `68ac326`. Rechnungen aus dem extrahierten Block `index.html:7035-7317` in Node nachgefahren.

| Zusage | Fundort im Dokument | Erwartet | Gefunden | Bezeichner im Code | Urteil |
|---|---|---|---|---|---|
| Kein neues `amt`-Feld, keine zweite Wahrheitsquelle | Z. 9, 100 | nichts Rang-Abgeleitetes in `amt`/`kladde` | `amt`-Literal 2928-2934 ohne Rangfeld; W6-Diff fügt keine `loadAmt()`-Zeile hinzu | `amt`, `loadAmt()` | **stimmt** |
| Rang ist abgeleitet, Neurendern idempotent | Z. 9 | reine Funktionen von `amt.schichten` | `rangStufe/rangDef/rangName/rangGruppe/rangVerhaeltnis` zustandslos | 7069-7081 | **stimmt** |
| `rangStufe = () => Math.floor(amt.schichten / 5)` | Z. 16 | wörtlich | wörtlich | `rangStufe` 7069 | **stimmt** |
| `10 \| n ⟹ 5 \| n`, jedes Jahresgespräch ist zwingend Beförderung | Z. 19, 117 | Kopplung trägt an jeder Kante | Sequenz 1..40 nachgerechnet: Hebung 5,10,…,40; Zeremonie 10,20,30,40. Über 0..500: 50 Zeremonien, 100 Beförderungen, 0 Verletzungen. `endShift()` inkrementiert (6969) vor `rangBerichtBlock()` (7007); `nachSchicht()` (7015) liest denselben Wert | `nachSchicht`, `endShift` | **stimmt** |
| `amt.schichten === 0` → Anwärter, kein Sonderfall | Z. 19 | Stufe 0 | verifiziert | `rangStufe` 7069 | **stimmt** |
| 19 Einträge, wörtlich aus 18.3/18.4 | Z. 23, 116 | 19, Titel/Gruppe/Verhältnis exakt | 19 Einträge (7041-7059); alle 11 Zeilen aus 18.3 und alle 8 Namen aus 18.4 Wort für Wort; `spitze` an 2/5/10/18; Verhältniswechsel bei Stufe 2 und 6 | `RAENGE` 7040 | **stimmt** |
| `roemisch()` deckt jede Schichtzahl ab, nie leer | Z. 30 | Greedy, total | 1..2000: 0 Duplikate, nie leer, nie Ziffer; `roemisch(0)`/`(-3)` klemmen auf `'I'` | `roemisch` 7067 | **stimmt** |
| Schicht 95 → „…Geschäftsbereich II" | Z. 37 | erste Fortsetzung = II | verifiziert; 100→III, 105→IV | `rangNameVon` 7074 | **stimmt** |
| Oberes Ende klemmt nicht / läuft nicht über | implizit Z. 33 | definiert bis beliebig | `rangDef()` klemmt per `Math.min`, `rangNameVon()` zählt römisch weiter; s=100000 gültig | `rangDef` 7070 | **stimmt** |
| Sieben Insignien reine Deko, zwei wirken | Z. 41, 109 | 7 ohne Wirkung | 7 ohne `wirkung:true`, aber „Das Dienstsiegel" hat seit W5 `k:'siegel'` und einen mechanischen Leser (`rangDienstsiegel()` → 7543). Weltbibel 18.7 markiert **drei** als echt | `INSIGNIEN` 7088, `rangDienstsiegel` 7106 | **überholt** |
| Zeichnungsbefugnis ab Schicht 30, Schlüssel ab 55 | Z. 44-45, 119 | 30 / 55 | 29→`[false,false]`, 30→`[true,false]`, 54→`[true,false]`, 55→`[true,true]` | `INSIGNIEN` 7094/7096 | **stimmt** |
| Alle neun Insignienschwellen decken 18.7 | Tabellenübernahme | 1:1 | alle neun Prädikate treffen 18.7 exakt | `INSIGNIEN` 7088-7098 | **stimmt** |
| Zeichnungsbefugnis hat „zwei echte Leser" | Z. 48 | zwei wirksame Leser | Ausweisliste (5699) ruft `i.wenn()` aus `INSIGNIEN`, **nicht** `rangZeichnungsbefugt()`; der Guard-Leser (7280) ist tautologisch → bei W6 null wirksame Leser | `renderAusweis` 5699, `rangAssert` 7280 | **weicht ab** |
| Dienstsiegel hängt am Jahresbonus, nicht am Rang | Z. 48 | `amt.bonusNachwachsen` | wörtlich | 7095 | **stimmt** |
| Urkunde 14 Zeilen, Scrollkasten `max-height:38vh` | Z. 52 | 14 / 38vh | 14 Einträge (7112-7125), `max-height:38vh` (7159) | `RANG_URKUNDE` | **stimmt** |
| Vier Zeremonie-Fixzeilen, alle 5 Beats aus 18.12 | Z. 52 | 4 Fixzeilen | 4 (7128-7133); mit Urkunde und Knöterich-Satz alle fünf Beats belegt | `RANG_ZEREMONIE_FIX` | **stimmt** |
| 9 Knöterich-Sätze Schicht 10-90, danach Wiederholungszeile | Z. 52 | 9 + 1 | 9 (7139-7149) + `RANG_KNOETERICH_WEITER`; Zuordnung inhaltlich korrekt | `RANG_KNOETERICH` | **stimmt** |
| Eingebaut nach Jahresbonus-Kasten, vor WEITER | Z. 52 | Reihenfolge | 7770 → 7775 `vorgangJahresBlock()` → 7776 `rangZeremonieBlock()` → 7777 WEITER | `showJahresgespraech` | **stimmt** |
| Hymnenabbruch ist Text, nicht Audio | Z. 54 | keine Audio-Zeile | `rangZeremonieBlock()` ohne `MUS`-Aufruf; 7760 wörtlich | 7131-7132, 7760 | **stimmt** |
| Audiokern Zeile für Zeile unverändert | Z. 104 | keine Änderung an `MUS`/`ZONES`/Scheduler | W6-Diff berührt nur einen `MUS.muffle()`-Aufrufer in `toggleAusweis()` | 5672 | **stimmt** |
| Dienstbericht: zwei sich ausschließende Zeilen | Z. 58, 138 | exklusiv | 24/25/29/30/44/45/50 nachgerechnet: leer außerhalb 5er, Hebungszeile 25/35/45, „Urkunde liegt bereit" 10/20/30/40/50 | `rangBerichtBlock` 7186 | **stimmt** |
| Beat 25 (vier ernste Sätze), Beat 45 („Kollege.") | Z. 58, 138 | 4 Sätze / 1 Wort + 2 Zeilen | 4 (7174-7179); 1 Wort + 2 Zeilen (7180-7184); Rangbezüge korrekt | `RANG_BEAT25`, `RANG_BEAT45_*` | **stimmt** |
| Kein neuer Merker, `amt.schichten` passiert 25/45 genau einmal | Z. 58 | einmalig | genau eine produktive Schreibstelle (`++` bei 6969), monoton | `endShift` | **stimmt** |
| Je eine Rangzeile in `showDorf()` und `renderAmtFenster()` | Z. 62, 115, 120 | eine je Panel | 8704 und 5014, beide reine Interpolation | `showDorf`, `renderAmtFenster` | **stimmt** |
| Dienstausweis, sieben Eingriffe | Z. 64-66, 118 | sieben | alle sieben belegt: 484-491, 200-209 + 338-341, 5432, 419 + 148-151, 8734, 9064, 6799/6892/6951 | `#ausweis`, `toggleAusweis` | **stimmt** |
| 44-Pixel-Tap-Target | Z. 66 | 44px | `#closeAusweisBtn` in der 44px-Regel | 355-360 | **stimmt** |
| Lichtbild liest bestehenden Bake, kein neues Sheet | Z. 68-75, 105 | kein neues Bake | `SHEETS['hero_baked']`, Snippet wörtlich; `player.hair` bei 6906 in `startShift()` | `renderAusweisFoto` 5681 | **stimmt** |
| Renderloop unangetastet, keine Prädikatabfrage pro Frame | Z. 106 | keine | `renderAusweisFoto()` nur aus `renderAusweis()` beim Öffnen | 5692 | **stimmt** |
| Bramsche-Snippet `bramscheFragePending = true;` | Z. 83 | Bezeichner existiert | existiert nicht mehr; heute `bramscheFragen = 1;`. Bei `ad72e37` korrekt | `bramscheFragen` 4967 | **überholt** |
| Ohne Schlüssel byteidentisch zum Bestand | Z. 90 | keine Verhaltensänderung | Wiederholungssperre (4960-4961) wirkt auch ohne Schlüssel und unterdrückt seit W6 die Sofortwiederholung | `bramscheLastAntwort` 3931 | **weicht ab** |
| Wiederholungssperre nach Vorbild `knRandnotiz()` | Z. 90 | vorhanden | 3931, 4960-4961, gleiches Guard-Idiom | `bramscheLastAntwort` | **stimmt** |
| Null neue Bramsche-Texte | Z. 90 | keine | keine neue Zeile in `DORF_FIGUREN` | — | **stimmt** |
| Mit Schlüssel bleiben alle Kanäle erreichbar | Z. 90, 140 | Wechsel, keine Abweisung | Codepfad belegt, Abweisung unerreichbar | `npcSprechen` 4955-4975 | **stimmt** |
| Guard TDZ-sicher, liest nur `amt` und eigene Tabellen | Z. 94 | keine Fremdtabelle | referenziert nur `amt`, `RAENGE`, `RANG_*`, `INSIGNIEN`, `AUSWEIS_TEXTE` | `rangAssert` 7213 | **stimmt** |
| Neun Prüfungen | Z. 94 | 9 | 9 nummerierte Blöcke | 7226-7312 | **stimmt** |
| Ankerprüfung gegen vier Sollstrings | Z. 94 | 4 | 4 (Index 0, 6, 10, 18) | `ANKER` 7241 | **stimmt** |
| Sweep über 0..200, kein `saveAmt()` | Z. 94, 133 | kein Seiteneffekt | `for(let s=0; s<=200; s++)` 7250; kein `saveAmt()`; `amt.schichten` vor/nach identisch | 7248-7261, 7313 | **stimmt** |
| „Zeremonie-Kopplungsbeweis" als eine der neun Prüfungen | Z. 94, 117 | beweist die Kopplung | `if(s % 10 === 0 && s % 5 !== 0)` ist arithmetisch unmöglich; 0 Treffer über 0..100000. Berührt weder `nachSchicht()` noch `rangZeremonieBlock()` | `rangAssert` 7258 | **weicht ab** |
| Römische Fortsetzung 2..500, nie leer, nie Ziffer | Z. 94 | wörtlich | wörtlich vorhanden — prüft aber weder Wert noch Monotonie | 7264-7268 | **stimmt** (schwach) |
| „Insignien-Prädikate gegen ihre Tabelleneinträge" | Z. 94 | fängt Schwellenfehler | `rangZeichnungsbefugt = () => INSIGNIE.zeichnung.wenn()` — definitorisch wahr. Sabotage (30→15, Schlüssel→`true`): Guard bleibt grün | 7280-7281 | **weicht ab** |
| Formregeln/Sperrvermerk über neue Texte **plus** gerenderte Blöcke | Z. 94, 121 | vollständig | 7286-7312, inkl. HTML-Strip von `rangBerichtBlock()` (0..100) und `rangZeremonieBlock()` (10..100) | `strip`, `text` | **stimmt** |
| Guard beweist Monotonie über 19 Ränge **plus** römische Fortsetzung | Z. 116 | beides bewiesen | Check (2) prüft nur `g`/`v` in der Tabelle; für die römische Fortsetzung keine Monotonie-/Eindeutigkeitsprüfung | 7234-7237, 7256-7257 | **weicht ab** |
| Kein Zeichendeckel nötig, nichts in `knAssertCaps()` | Z. 96 | keine Deckelzeile | keine neue Bramsche-Zeile; Kommentar 3894-3902 deckt das ab | `knAssertCaps` | **stimmt** |
| `amt.schichten` weiter genau eine Schreibstelle | Z. 101 | eine | genau eine produktive (6969); dazu `loadAmt()` 3722 und gespiegelte Guard-Schreibstellen | `endShift` | **stimmt** |
| `nachSchicht()`/`aktStand()` gelesen, nicht umgebaut | Z. 102 | unverändert | W6-Diff berührt beide nicht | 7014-7016, 2941 | **stimmt** |
| `#ovPanel`: keine `id` im Inneren, Schreibstellen bleiben sieben | Z. 107 | 7 vor und nach W6 | `68ac326`: 7, `ad72e37`: 7 → W6 fügt keine hinzu (heute 8 durch W5). Neue Blöcke ohne `id` | `getElementById('ovPanel')` | **stimmt** (für W6) |
| `RANDNOTIZ.levelup` hängt am Charakter-Stufenaufstieg | Z. 108 | `gainXP()`, nicht `amt.schichten` | `knRandnotiz('levelup')` in `gainXP()` (3451/3461) | `gainXP` | **stimmt** |
| W5 gab dem Dienstsiegel `k:'siegel'` bewusst ohne `wirkung:true` | Z. 110 | Kommentar + Code | 7095 + Begründungskommentar 7102-7105 | `INSIGNIE.siegel` | **stimmt** |
| Rang kostet kein Gold (18.2) | Z. 111 | kein Goldpfad | kein Rangbezug in `buyAusbau()`/Shop | 7782 | **stimmt** |
| Urkundenvorlage variiert nicht je Rang | Z. 128 | ein Template | ein Template, drei interpolierte Felder | `RANG_URKUNDE` 7111 | **stimmt** |
| „außer den zwei Wahlsprüchen als Zeilen in Urkunde/Ausweis" | Z. 11 | Wahlsprüche im Code | `grep` über `index.html`: **null Treffer**, auch nicht in `ad72e37`. Widerspricht Z. 129 desselben Dokuments | `RANG_URKUNDE`, `AUSWEIS_TEXTE` | **nicht auffindbar** |
| Heraldik (18.9), Titelmaschine (18.11), Gegenseite (18.10) ungebaut | Z. 129 | ungebaut | ungebaut | — | **stimmt** |
| „Zwei Insignien wirken echt" | Z. 119 | zwei mechanische Wirkungen | heute ja: `rangSchluessel()` 4966, `rangZeichnungsbefugt()` über `vorgangZustellbar()` 7554 → 4875/7599. Bei W6 hatte nur der Schlüssel einen Verbraucher | 4966, 7554 | **stimmt** (heute) |
| `CONFIG.schichtModus = false` bricht nichts | Z. 122, 143 | funktioniert unverändert | wirft nicht — aber `endShift()` ist unerreichbar (3480, 4891 gegattert), `amt.schichten` steigt nie, keine Beförderung. Wörtlich wahr, W6 ist inert | `CONFIG.schichtModus` | **stimmt** (eingeschränkt) |
| Start: `rangAssert()` liefert `true`, keine Konsolenmeldung | Z. 135 | grün | reproduziert; zentral im Browser ebenfalls `true` | 7318 | **stimmt** |
| Laufbahn-Sweep gegen 18.3/18.4 exakt | Z. 136 | 19/19 exakt | 19/19 exakt — aber **Handlesung**, nicht Guard-Leistung (siehe GW-Fund) | `RAENGE` | **stimmt** |
| Zeremonie bei 10 = „Notiert.", bei 90 wärmerer Satz | Z. 137 | Index 0 / 8 | reproduziert | `rangZeremonieBlock` 7153 | **stimmt** |
| Weiche echt ausgelöst: 9→Urkunde+Jahresgespräch; 14→Hebung+Dorf | Z. 142 | so | reproduziert | 6969/7007/7015 | **stimmt** |
| `amt.schichten=0`: Anwärter + leerer `rangBerichtBlock()` | Z. 143 | leer | reproduziert (`s===0` → `''`) | 7188 | **stimmt** |
| Node-Syntaxcheck nach jedem Bauschritt | Z. 133 | parst | Datei parst heute; ob nach *jedem* Schritt geprüft wurde, ist nicht rekonstruierbar | — | **nicht prüfbar** |
| Sechs Frisuren live durchgebacken, mobile 375×812, Konsole leer | Z. 137, 141, 144 | Live-Befund | `CF_HAIR` hat sechs Einträge inkl. `h5` (533-540); visueller Teil nicht statisch entscheidbar | `CF_HAIR` | **nicht prüfbar** |

**57 Zusagen geprüft: 44 stimmt, 6 weicht ab, 2 überholt, 1 nicht auffindbar, 2 nicht prüfbar.** Zwei „stimmt" tragen eine ausdrückliche Einschränkung.

## G5: Die Anrede (18.5)

Anker `6f77f68`. `06ad456` berührt **keinen** Anrede-Bezeichner (Diff-Hunks nur `renderInventory()`/`renderKladde()`). Alle Zahlen aus lückenlosem Sweep `amt.schichten` 0..5000, nicht in Fünferschritten.

| Zusage | Fundort | Erwartet | Gefunden | Bezeichner im Code | Urteil |
|---|---|---|---|---|---|
| 66 Grundzeilen, 55 Aktzeilen, Antworttabelle, Anlasschor „Byte für Byte" | Z. 9 | unverändert | `DORF_FIGUREN` byte-identisch zu `45912f6`; 11×6=66, 11×5=55 | `DORF_FIGUREN` | **stimmt** |
| `figuren-dorf.md` bleibt gültig | Z. 9 | Datei unangetastet | `git log 45912f6..HEAD -- figuren-dorf.md` leer | — | **stimmt** |
| Reine String-Tabelle, `knAssertCaps()` läuft weiter generisch drüber | Z. 9 | generischer Sweep | 3887-3893 unverändert | `knAssertCaps` | **stimmt** |
| Kein Dialogbaum, keine Antwortauswahl | Z. 11 | nichts dergleichen | ein Tastendruck = eine Zeile | `npcCycle` 4932 | **stimmt** |
| Kein Namensfeld, kein Eingabefeld | Z. 13 | keins | `ANREDE_LISBETH` ist reine Textliste | 7367 | **stimmt** |
| Kein neues `amt`-Feld, keine `loadAmt()`-Zeile, kein Merker | Z. 15 | `amt` unverändert | `amt`-Literal 2928-2934 identisch zu `45912f6` | `amt` | **stimmt** |
| Pommers Titel wird nicht gespeichert, sondern `RAENGE[0]` gelesen | Z. 15 | konstante 0 | `anredePunkt(0, 48)` | `ANREDE.pommer` 7405 | **stimmt** |
| `anredeAssert()` prüft nur Formregeln, kein `GEHEIM` | Z. 19 | drei Formregeln | 7421-7427 genau diese drei plus leer/Deckel | `anredeAssert` | **stimmt** |
| `rangNameVon(i)`-Zerlegung wörtlich wie im Dokument | Z. 26-31 | Codeblock | 7074-7078 zeichengleich | `rangNameVon` | **stimmt** |
| Die fünf bestehenden `rangName()`-Aufrufer bleiben unverändert | Z. 33 | 5 Stellen | 5014, 5695, 7115, 7190, 8704 | `rangName` | **stimmt** |
| „Eine Zeile im 0..200-Sweep **beweist**, dass die beiden nie auseinanderdriften" | Z. 33-37 | echter Beweis | `rangName()` **ist definiert als** `rangNameVon(rangStufe())` — Tautologie | `rangAssert` 7254 vs. 7078 | **weicht ab** |
| Längster benannter Titel 38 Zeichen, `z1` deckelt bei 48 | Z. 41 | 38 / 48 | `RAENGE[18].t`.length = 38; `text(a.z1, 48, …)` | 7059, 7444 | **stimmt** |
| „**fünf** absteigende Fassungen" | Z. 42 | 5 unterscheidbare Sprossen | Auf allen 19 Stufen sind Sprosse 4 (`t`) und 5 (`basis`) **derselbe String**. Sprosse 3 (`ANREDE_HERR + t`) ist nie wählbar, weil Sprosse 2 (`t + '(in)'`) immer kürzer ist → 0 Treffer in 9608 Ziehungen. Rang 8: 3 Einträge, 2 unterschiedlich. **Zentral live bestätigt** | `anredeFormen` 7343-7352 | **weicht ab** |
| Codeblock `anredeFormen`/`anredeVersuch`/`anredePunkt` wie zitiert | Z. 45-60 | identisch | 7343-7361 zeichengleich | — | **stimmt** |
| Zwei Fälle lassen `(in)` weg (Paarform, jenseits Rang 18) | Z. 62 | zwei Bedingungen | `t.indexOf(' / ') >= 0 \|\| s > letzt` | 7350 | **stimmt** |
| „Jeder Aufrufer hat seinen eigenen Rückfall" | Z. 64 | erreichbare Rückfälle | `basis + '.'` = 39 ≤ 48 und ≤ 44 ⇒ `anredeVersuch` liefert nie `null`. Lückenlos 0..5000: **0** Rückfälle greifen. Alle acht `\|\| rangDef().t + …` sind toter Code | `ANREDE` 7384-7410 | **weicht ab** |
| Bauregel Titel in z1 (48), Sprachmarke in z2 (32) | Z. 66 | eingehalten | max z1 = 48, max z2 = 30 über 0..5000 | `ANREDE` | **stimmt** |
| Elf Formen, acht mit 18.5-Grundlage | Z. 68/70 | 11 / 8 | `ANREDE` hat 11 Schlüssel, `DORF_FIGUREN` 11; 18.5 nennt 8 Zeilen | 7380 | **stimmt** |
| Die 11-Zeilen-Tabelle (z1/z2 je Figur) | Z. 72-84 | wörtlich | alle 11 z2-Strings wörtlich identisch | 7385-7410 | **stimmt** |
| Zwirn/echter Titel legen sich „jenseits Schicht 200" zusammen | Z. 88, 173 | ab ~200 | Erste Kollision bei `rangStufe` 304 = **Schicht 1520**. Guard-Kommentar 7451 („ab Schicht 90+") ist ebenfalls falsch | `ANREDE.zwirn` 7384 | **weicht ab** |
| Guard prüft die Schmeichelei nur, solange es einen benannten Rang darüber gibt | Z. 88 | Bereichsgrenze | `if(rangStufe() < RAENGE.length - 1)` | 7452 | **stimmt** |
| Bramsche fällt auf „Genau so steht es geschrieben." zurück, wenn `(in)` fehlt | Z. 90 | Fallunterscheidung | 7390-7391; `(in)` fehlt auf Stufe 8 und ab Stufe 19 | `ANREDE.bramsche` | **stimmt** |
| Sonderpfade „**per Konstruktion** unberührt — sie erreichen `npcCycle()` gar nicht erst" | Z. 96 | kein Pfad | `npcSprechen()` ruft `npcCycle(n, fig)` **im Bramsche-Sonderpfad** (Zweig `rangSchluessel()`, ab Schicht 55). Zweig existierte schon bei `45912f6` | `npcSprechen` 4966-4968 | **weicht ab** |
| Codeblock `npcCycle()` wie zitiert | Z. 98-110 | identisch | zusätzlich `langAnsprechen()`-Vorlauf mit früher Rückkehr (4935) und `langZusatz()` im Modulo (4942) | `npcCycle` | **überholt** |
| `bubbleIdx` startet bei −1, Instanziierung in `genMap()` | Z. 113 | −1 | `bubbleIdx:-1` | 2256 | **stimmt** |
| Vorzustand: `letzterAnlass` wurde nie zurückgesetzt | Z. 117 | so war es | `git show 45912f6` bestätigt | — | **stimmt** |
| „Lott und Pahl kommentieren ein Ereignis jetzt **genau einmal**" | Z. 119-125, 166, 186 | einmalig | Widerlegt: `knTick()` 4185 ruft `knRandnotiz('untaetigkeit')` **jeden Frame**, `knRandnotiz()` schreibt `letzterAnlass` 4027 **vor** allen Gates | 3930/4027/4977/4981 | **weicht ab** |
| Knöterich: Anrede inkl. „Herr oder Frau", **jedes Mal** | Z. 129 | immer | 1 von 19 benannten Rängen (nur Stufe 11). **Zentral live bestätigt: 1 von 81** | `knBegruessungLine` 4042 | **weicht ab** |
| Knöterichs Kanal ist `knBegruessungLine()`, Deckel 44 | Z. 129 | ein Kanal, 44 | 4042, Deckel 44 in 4049-4051 | — | **stimmt** |
| Codeblock `knBegruessungLine()`, „**zwei** Anläufe statt einem" | Z. 131-142 | zwei | **drei** Anläufe: Gießkannen-Sprosse 4049, Zähler 4050, `anredePunkt` 4051. Kommentar 4037 sagt weiterhin „zwei" | — | **überholt** |
| „Die längste Sprosse ohne Zähler ist 43 Zeichen lang" | Z. 142 | 43 | Längste tatsächlich gewählte `anredePunkt(st,44)` ist **44** (Stufe 16 und 25). Schlussfolgerung hält trotzdem, weil `basis + '.'` = 39 | `anredePunkt` 7361 | **weicht ab** |
| Der dritte Boden wird nie erreicht; `anredeAssert()` beweist das | Z. 142 | nie | Lückenlos 0..5000 × 2 Gießkannen × 4 Rekordwerte: **0** Treffer. **Zentral live bestätigt über Rang 0..80** | 7474 | **stimmt** |
| „Rekord-Suffix unverändert" | Z. 138 | unverändert | Code unverändert, **Wirkung** eingebrochen: in Schichten 0..200 vorher 193×, jetzt 30× (einstellig) bzw. 10× (zweistellig). Kein Guard-Punkt dafür | 4053-4056 | **weicht ab** |
| Guard selbstaufrufend, `console.assert()` am Ende, nie `throw` | Z. 146 | Selbstaufruf hinter dem Rangblock | `console.assert` 7484, kein `throw`; Selbstaufruf steht bei 8590 | — | **überholt** |
| Guard (1) Vollständigkeit in beide Richtungen | Z. 148 | zwei Schleifen | 7431 und 7432 | — | **stimmt** |
| Guard (2) Deckelsweep „über alle elf Formen", 0..5000 in Fünferschritten | Z. 149 | alle elf | `s += 5` ⇒ `amt.schichten % 5 === 0` immer ⇒ `ANREDE_LISBETH[1..4]` werden **nie** geprüft. `knAssertCaps()` kennt die Tabelle auch nicht → 8 von 55 Anrede-Strings prüft niemand | 7439-7446, 7393 | **weicht ab** |
| Guard (3) „Zwirn schmeichelt wirklich an jeder Stufe des Sweeps" | Z. 150 | jede Stufe | nur `rangStufe() < 18`, also 18 von 1001 Sweep-Punkten | 7452 | **weicht ab** |
| Guard (3) „Pommer liest den Antrag, an jeder Stufe" | Z. 150 | Prüfung existiert | 7457 greift an jeder Stufe — aber `anredePunkt(0,…)` hat konstante Eingabe; 1001 identische Auswertungen | 7457 | **stimmt** |
| Guard (4) „beide Rekord-Zustände" | Z. 151 | 2 Zustände | 2 × 2 (Rekord × Gießkanne) | 7466 | **überholt** (strenger) |
| Spiegel exakt zurückgesetzt, kein `saveAmt()`/`saveKn()` | Z. 153 | zwei Spiegel | beide korrekt, kein Save. **Dritter** Spiegel `kladde.lang` ungenannt; kein `try/finally` | 7438/7459/7464/7481 | **überholt** |
| „`knBegruessungLine()` läuft **ausschließlich** aus `startShift()`" | Z. 155 | ein Aufrufer | Zwei Aufrufer: 6939 und 7471 (`anredeAssert`, auf Skriptebene). Genau dieser zweite zwang W7, den Selbstaufruf zu verschieben | — | **weicht ab** |
| Zeigerkommentar an `knAssertCaps()` statt Prüfung | Z. 155 | Kommentar | 3894-3901 | — | **stimmt** |
| `npcSprechen()` nur um die eine Fund-A-Zeile geändert | Z. 159 | eine Zeile | Diff-Hunk = genau +1 Zeile (4981) | — | **stimmt** |
| `#ovPanel` bleibt bei acht Schreibstellen | Z. 159 | 8 | 8 | — | **stimmt** |
| Abnahme: „Alle elf Figuren sprechen den Spieler **mit Titel** an, als **erste** Blase" | Z. 163 | 11 mit Titel, immer erste | 4 von 11 nennen keinen Titel (Zapf, Lott, Pahl, Lisbeth) — von 18.5 gewollt, von der Abnahmezeile falsch behauptet. „Erste Blase" gilt nicht bei laufendem Langvorgang (4935) und nicht bei gesetztem `letzterAnlass` (4977) | — | **weicht ab** |
| Abnahme: sechs Grundzeilen + Aktzeile „unverändert danach, in unveränderter Reihenfolge" | Z. 164 | unverändert | `langZusatz()` hängt bei Nörgel Zeilen zwischen Grund- und Aktzeile; `langAnsprechen()` verdrängt die Blase bei 6 der 11 Figuren | 4935/4942 | **überholt** |
| Abnahme: „Bramsches Frage/Antwort/**Abweisung** läuft unverändert — live geprüft" | Z. 165, 185 | live belegt | Im Schlüssel-Zweig (ab Schicht 55) gibt es **keine** Abweisung. Dass Z. 185 eine sah, beweist Schicht < 55 ⇒ dieser Zweig kann nicht live geprüft worden sein | 4966 | **weicht ab** |
| Abnahme: „Knöterich grüßt **amtlich** … über den Guard geprüft" | Z. 167 | Guard belegt es | Guard prüft Deckel 44 und „dritter Boden greift nicht" — **nicht** „Herr oder Frau", nicht „vollständig" | 7461-7477 | **weicht ab** |
| Abnahme: „Kein Text bricht seinen Deckel, auf keiner Rangstufe bis 5000" | Z. 168 | keine Brüche | Lückenlos nachgerechnet: **0** Brüche. Aussage wahr; der Guard belegt sie wegen der Fünferschritte nur teilweise | — | **stimmt** |
| Live: `node --check` grün | Z. 179 | grün | reproduziert | — | **stimmt** |
| Live: Schicht 40 = Paarform ohne Klammer | Z. 183 | so | Stufe 8 → `Monstralamtmann / Monstralamtfrau.` | — | **stimmt** |
| Live: Schicht 90 = Klammerform am längsten Titel, 43 Zeichen | Z. 183 | 43 | = 43. **Zentral live bestätigt** | — | **stimmt** |
| Live: Schicht 95 = erste römische Fortsetzung | Z. 183 | `… II` | Stufe 19 → `… Geschäftsbereich II.` | — | **stimmt** |
| Live: Schicht 200 = Grundtitel-Rückfall bei Knöterich | Z. 183 | Rückfall | Stufe 40, `t+'.'` = 45 > 44 ⇒ `basis+'.'` = 39 | — | **stimmt** |
| Live: Lisbeths fünf Varianten wechseln je Schicht | Z. 187 | Periode 5 | `amt.schichten % ANREDE_LISBETH.length`, `.length` = 5 | 7393 | **stimmt** |
| Live: Sichtprüfung Canvas, Konsole leer, zwei Deckelbrüche vom Guard gefunden | Z. 182, 188, 189 | — | historisch/visuell, statisch nicht rekonstruierbar | — | **nicht prüfbar** |

**52 Zusagen geprüft: 30 stimmt, 15 weicht ab, 6 überholt, 1 nicht prüfbar, 0 nicht auffindbar.**

### Die acht Vorschriften aus 18.5, einzeln

| # | Vorschrift (Weltbibel 725-732) | Umsetzung | Urteil |
|---|---|---|---|
| 1 | **Knöterich:** immer vollständig, immer korrekt, **immer inkl. „Herr oder Frau", jedes Mal** | `knBegruessungLine()` 4042-4052. „Herr oder Frau" auf **genau einer** von 19 benannten Rangstufen (Stufe 11); auf Stufe 0 fehlt zusätzlich der Schichtzähler. Ursache: `ANREDE_HERR + t` ist gegenüber `t + '(in)'` (15 vs. 4 Zusatzzeichen) strukturell zweitrangig, und der 44er-Deckel schlägt fast überall zu | **weicht ab** |
| 2 | **Bramsche:** liest die Schriftform vor, Klammern eingeschlossen | `ANREDE.bramsche` 7389-7391. `(in)` auf 17 von 19 Stufen im z1, z2 liest die Klammer vor | **stimmt** |
| 3 | **Zwirn:** immer einen Rang zu hoch, aus Schmeichelei | `ANREDE.zwirn` 7384, `rangStufe() + 1`. Trägt bis Stufe 303 | **stimmt** |
| 4 | **Zapf:** „Chef." | `ANREDE.zapf` 7392, wörtlich | **stimmt** |
| 5 | **Nörgel:** vollständig und korrekt, mit hörbarem Neid | `ANREDE.noergel` 7397-7398. z2 „Ich habe keinen. Nur Krawatte." ✓. Vollform auf 16 von 19 Stufen; Stufe 0 fällt um **ein** Zeichen aus dem 48er-Deckel (50 statt 48) | **stimmt** (Randfall Stufe 0) |
| 6 | **Pommer:** den Titel vom Antrag, nicht den aktuellen | `ANREDE.pommer` 7405, konstant `RAENGE[0]` | **stimmt** |
| 7 | **Lott und Pahl:** „Der Neue.", seit vierhundert Jahren | 7407-7408, wörtlich. **Aber** über den Anlasspfad praktisch unerreichbar (siehe GW4) | **weicht ab** (Erreichbarkeit) |
| 8 | **Lisbeth:** fragt nach dem Namen, als Einzige, jede Schicht neu | 7393, `ANREDE_LISBETH` 7367-7373, fünf Varianten, Periode 5 | **stimmt** |

**Acht Vorschriften: 6 stimmt, 2 weicht ab.**

*Randnotiz: 18.5 trägt die Überschrift „sieben Charakterisierungen", die Tabelle hat acht Zeilen — Inkonsistenz der Weltbibel, nicht des Phasendokuments.*

## G6: W7, Die Langvorgänge

W7-Delta ist `6f77f68..95ea5ee` (656+/24−). **`06ad456` berührt W7 nicht** — alle Befunde sind „stimmte nie", keiner „stimmt nicht mehr".

| Zusage | Fundort | Erwartet | Gefunden | Bezeichner im Code | Urteil |
|---|---|---|---|---|---|
| Sieben Stränge gebaut (9 minus Nr. 4 und 8) | Z. 5, 126-136 | 7 Einträge | 7: `dorffest, probezeit, anlage3, giesskanne, kaffeemaschine, hintermuehl, gutachter` | `LANGVORGAENGE` 8057-8332 | **stimmt** |
| Stufenzahlen 11/7/3/3/4/4/5 | Z. 130-136 | = Länge der Beat-Tabellen | alle nachgezählt, exakt | 8062, 8102, 8151, 8186, 8239, 8271, 8299 | **stimmt** |
| **Genau eine Schreibstelle für W7-Zustand** | Z. 47 | 1 | 1 Spielpfad + Literal + Loader + 16 Guard-Spiegel; keine Alias-Schreibstelle | `langEreignis` 8364 | **stimmt** |
| **Kein Strang blockiert** | Z. 156-163, 200 | keine erreichbare Sackgasse | erschöpfende BFS über alle erreichbaren Rohwerte je Strang: 0 Sackgassen | s. u. | **stimmt** |
| **Zapf rückt nie zwei Stränge auf denselben Druck vor** | Z. 124, 209 | ≤1 je Druck | kein Gegenfall konstruierbar; `'ansprechen'` wird ausschließlich mit `nur` gefeuert | `langAnsprechen` 8382-8393 | **stimmt** (fragil) |
| **`t.diff`/`t.tier` bleiben unangetastet** | Z. 152, 195 | Rohwert nur in Rechnungen | 1 Anzeige-Lesestelle, 18 Roh-Lesestellen, keine Kreuzung | `langKammerWert` 8340 | **stimmt** |
| `info.nur` = gezielter Schritt, nur zwei Stellen | Z. 87, 124 | Filter + Setzer | genau 2 Vorkommen, kein Fremdobjekt trägt `.nur` | 8356, 8388 | **stimmt** |
| Kein `apply()` an einem Strang | Z. 17, 47 | keins | keins | 8057-8332 | **stimmt** |
| Kein neues `amt`-Feld, keine `loadAmt()`-Zeile | Z. 17, 56 | 0 | Diff fügt keins hinzu | — | **stimmt** |
| Keine neue `AKT_`-Konstante/Kachel/Tür/Spawn | Z. 15 | 0 | `scanAktion()` unverändert | — | **stimmt** |
| `#ovPanel` bleibt bei acht Schreibstellen | Z. 195 | 8 | 8 | — | **stimmt** |
| `DORF_FIGUREN`/`BLAETTER`/`AUFTRAG_TYPEN`/`RAENGE` unangetastet | Z. 195 | keine Hunks dort | keine | — | **stimmt** |
| Trichter deckt alle acht bestehenden Fundstellen ab | Z. 72 | 8 Ereignisarten | 8, Zählweise identisch zu `phase-w4-brett.md:111` | `langEreignis` 8602 | **stimmt** |
| Trichteraufruf steht **vor** den Frühabbrüchen | Z. 76-78 | erste Zeile | 8602 vor `if(!CONFIG.schichtModus) return;` 8603 | — | **stimmt** |
| `auftragEreignis('schichtende')` feuert nur bei laufendem Aushang | Z. 72 | ja | Wächter davor | 8631-8633 | **stimmt** |
| Drei zusätzliche Aufrufstellen | Z. 103 | 3 | 3: 6985, 7765 (hinter `b.apply()`), 8227 | — | **stimmt** |
| Eingriff sitzt in `npcCycle()`, Sonderpfade unberührt | Z. 107, 142 | Bramsche/Lott-Pahl vor dem Hook | `langAnsprechen()` erste Zeile in `npcCycle`, `npcSprechen` verzweigt davor | 4935, 4957-4987 | **stimmt** |
| Zeiger bleibt stehen, Modulo hält den Bereich | Z. 112, 120 | `return` vor `bubbleIdx++` | ja | 4936, 4942-4944 | **stimmt** |
| `bramscheFragen = 1 + langFertig('anlage3')` in `startShift()` | Z. 142 | eine Stelle | 6942 | — | **stimmt** |
| „vier Fundstellen" beim Umbau `bramscheFragePending` → `bramscheFragen` | Z. 142 | 4 | **5** (3930, 4958, 4963, 4967, 6942); Vorgänger hatte ebenfalls 5 | — | **weicht ab** |
| Nr. 6: Sammelgegenstand `DIENST_BEMERKUNGEN`, sechs Stück | Z. 140 | 6 Bits | Array hat exakt 6, `bm ∈ 0..5`, Bitmaske `roh & 63` passt | 6853-6860, 8129 | **stimmt** |
| Nr. 6 Belohnung: fünf Hinweiszeilen als Grundzeilen | Z. 131, 140 | 5 | 5, über `zusatz()` in den Zyklus | 8115-8121, 8396 | **stimmt** |
| Nr. 1 hat keinen Bonus, nur wärmere Begrüßung, eigene Sprosse ganz oben | Z. 133, 144 | erste Sprosse | erste Sprosse in `knBegruessungLine()` | 4049 | **stimmt** |
| „`langAssert()` prüft, dass die Wärme auf mindestens einem Rang sichtbar ist" | Z. 144 | in `langAssert()` | steht in **`anredeAssert()`**; `langAssert()` enthält keine solche Prüfung | `warmGesehen` 7465/7475/7480 | **weicht ab** |
| Wärme fehlt nur auf „Rang 0 und ab Rang 18" | Z. 210 | 2 Rangbereiche | fehlt auf **12 der 19** benannten Ränge (0,1,2,4,5,7,8,10,14,16,17,18) + allen darüber. **Zentral live bestätigt, Rang für Rang** | `anredeFormen` 7343 | **weicht ab** |
| Spot-Check Ränge 0/30/45/90: warm auf 30 und 45 | Z. 224 | so | Werte stimmen — aber es sind **Schichten**, keine Ränge (`RAENGE` hat 19 Einträge) | `rangStufe` 7069 | **weicht ab** |
| Nr. 7: `t.diff`/`t.tier` unberührt, Milb liegt nur nach unten daneben | Z. 152 | Anzeige verzweigt allein | `zeig`/`zeigTier` sind lokale Ableitungen; `t.tier` fließt weiter in die Beute | 5253-5259, 4497 | **stimmt** |
| „jede Kammer liefert **mehr** als angekündigt" | Z. 152 | echt > angezeigt | bei `t.diff = 1` ist angezeigt = echt (`Math.max(1, 0)`) | 8340 | **weicht ab** |
| `!CONFIG.schichtModus`-Zweig in `langKammerWert()` ist Pflicht | Z. 152 | vorhanden | vorhanden | 8340 | **stimmt** |
| Vergleichswert existierte schon (Floater beim Betreten) | Z. 154 | echter Wert | ja, zusätzlich HUD-Zonenzeile | 4382, 5820 | **stimmt** |
| Kein Strang ist Bedingung in fünf genannten Prädikaten — „`langAssert()` beweist das positiv" | Z. 161 | 5 Prädikate geprüft | Sachaussage stimmt, **Guard prüft nur 3 von 5**; `vorgangAdressAkt()` und `rangZeichnungsbefugt()` fehlen | 8513-8516 | **weicht ab** |
| Kein Strang schreibt außerhalb `kladde.lang` | Z. 160 | 0 | 0 | 8364/8366 | **stimmt** |
| `langAnsprechen()` liefert `null`, sobald nichts vorrückt | Z. 162 | `return null` | 8392 | — | **stimmt** |
| Inertheit bei `schichtModus=false`: kein Rohwert, kein `saveKladde()` | Z. 165 | Frühabbruch | 8352 | — | **stimmt** |
| Inertheit: `langFertig()` überall falsch, `langZusatz()` leeres Array | Z. 165 | inert | **beide ohne `schichtModus`-Wächter**; `loadKladde()` lädt `lang` unbedingt | 8344, 8396, 2850 | **weicht ab** |
| Inertheit: `langBestandBlock()`/`langGiesskanneBlock()` liefern `''` | Z. 165 | Wächter | vorhanden | 8412, 8215 | **stimmt** |
| Guard ruft niemals `langEreignis()` mit `schichtModus=true` | Z. 169 | kein Aufruf | einziger Aufruf 8568 steht hinter `CONFIG.schichtModus=false` 8567 | — | **stimmt** |
| Guard ruft `d.schritt()` direkt, „das ist eine reine Funktion" | Z. 169, Code 8461 | rein | **`dorffest.schritt` und `gutachter.schritt` schreiben `langSchicht`** | 8085, 8318 | **weicht ab** |
| Guard Punkt 2: jeder Strang bis `stufen`, Rundendeckel | Z. 172 | ja | ja, Deckel 400; alle 7 erreichen ihr Ziel in 1-11 Runden | 8466-8482 | **stimmt** |
| Guard Punkt 3: Idempotenz auf dem Endzustand | Z. 173 | echte Prüfung | für `dorffest` **strukturell immer wahr** (Restflag), 6 von 7 echt | 8484-8486 | **weicht ab** |
| Guard Punkt 6: Schild über `t.diff` 1..5, beide Zustände, `RARITY`-Bereich | Z. 176 | ja | ja | 8522-8533 | **stimmt** |
| Guard Punkt 7: Bramsches Fragenrechnung, beide Zustände | Z. 177 | ja | ja | 8538-8541 | **stimmt** |
| Guard Punkt 8: Deckel/Form/Sperrvermerk über alle Stufen | Z. 178 | ja | ja — unabhängig nachgerechnet: kein Deckelbruch, kein Gedankenstrich, kein Emoji, kein `undefined` | 8493-8508 | **stimmt** |
| Guard Punkt 10: gerenderte Blöcke, HTML-gestrippt, beide Zustände | Z. 180 | ja | ja, inkl. bedingtem Abspann-Absatz | 8547-8563 | **stimmt** |
| „Alle Spiegel exakt zurückgesetzt, ohne `saveAmt()`/`saveKladde()`" | Z. 182 | 6 Spiegel | alle 6 gesichert und restauriert; kein Speicheraufruf im Guard-Pfad | 8444-8445 / 8571-8573 | **stimmt** |
| Sperrvermerk: dieselbe `GEHEIM`-Liste wie die anderen Guards | Z. 25 | identisch | identisch, 11 Einträge, in allen 5 Guards. **Zentral verifiziert** | 2804, 7217, 7614, 7958, 8431 | **stimmt** |
| Kaffeemaschinen-Zeilen nennen nie Zutaten/Slots/Wirkungen | Z. 23 | sauber | sauber | 8239-8244 | **stimmt** |
| Zwei Guard-Selbstaufrufe sind nach unten gewandert | Z. 184-191 | unten | genau dort, Begründung an beiden Definitionen | 8588-8590 | **stimmt** |
| `LANG_PROBEN` steht vor dem Selbstaufruf | Code 8579 | TDZ-frei | `const` 8582, Aufruf 8588 | — | **stimmt** |
| Alte Spielstände ohne `kladde.lang` laden fehlerfrei | Z. 203 | additiv | `if(o.lang)` + Literal `lang:{}` + `\|0` in `langRoh` | 2837, 2850, 8342 | **stimmt** |
| „Alle sechs Guards liefern `true`" | Z. 218 | 6 | **7** selbstaufrufende Guards | 2798, 3910, 7318, 8017, 8588, 8589, 8590 | **weicht ab** |
| Kladde-Reiter zeigt „LAUFENDE VORGÄNGE" zwischen Anschriftenblock und Zählzeile | Z. 225 | Kladde-Reiter | Position stimmt, **Reiter falsch benannt**: es ist der Akten-/Blätter-Reiter | `renderBlaetter` 5621, `tabBlaetter` 462 | **weicht ab** |
| Kein Questlog: nur begonnene Stränge | Z. 11 | `st <= 0` überspringen | 8418 | — | **stimmt** |
| „Die letzten vier Ereignisarten kommen mit W7 dazu" | Code 8041 | 4 neue | **3 neue**; `schichtende` ist W4-Trichterart | `LANG_EREIGNISSE` 8043 | **weicht ab** |
| Kapitel-10-Belohnungen wörtlich umgesetzt | wb. 393-411 | 7 Belohnungen | alle 7 vorhanden und passend | — | **stimmt** |
| „Live geprüft": Port 8378, jeder Strang einzeln, Konsole leer | Z. 214-227 | Laufzeitbefund | nicht statisch entscheidbar | — | **nicht prüfbar** |
| „Fünf Fehler hat der Guard gefunden" | Z. 219 | Bauhistorie | 3 der 5 Endzustände im Code belegt; die 33-Zeichen-Zeile ist ohne Zwischencommit nicht rekonstruierbar | — | **nicht prüfbar** |

**51 Zusagen geprüft: 39 stimmt, 10 weicht ab, 2 nicht prüfbar, 0 überholt, 0 nicht auffindbar.**

### Die vier Kern-Zusagen im Detail

**„Genau eine Schreibstelle" — stimmt.** Vollständige Liste der 19 Zugriffe auf `kladde.lang`: Literal 2837, Loader 2850, **Spielpfad 8364 (`langEreignis`)**, Spiegel 7468/7481 (`anredeAssert`), Spiegel 8468/8477/8488/8523/8534/8538/8540/8542/8548/8552/8555/8559/8564/8572 (`langAssert`). Aliase `const langEcht = kladde.lang` an 7464 und 8444 sind reine Referenzsicherungen — kein `langEcht[…] =` im File. Kein `+=`, kein `delete`, kein Spread-Merge. `Object.assign` an 8559 erzeugt eine Kopie und ersetzt den Zeiger. Einziger Persistenzaufruf `saveKladde()` 8366, gebunden an `dirty`; `langAnsprechen()` ruft `langEreignis()` bis zu 7× je Tastendruck, aber höchstens einer setzt `dirty`.

**„Kein Strang blockiert" — stimmt, selbst nachgerechnet.** Vollständige Erreichbarkeitsmenge ab Rohwert 0 unter `langEreignis()`-Semantik, mit adversarialem Zeitplan (jede Ereignisart, jedes `LANG_PROBEN`-Info, `langSchicht` in beiden Belegungen).

| Strang | erreichbare Rohwerte | Sackgassen | kritischer Pfad |
|---|---|---|---|
| `dorffest` | 12 | **0** | 11 Schichten × 1 Zwirn-Druck; Flag-Reset in `startShift()` 6933 |
| `probezeit` | 257 | **0** | 6 Bits über `schichtende`, `bm ∈ 0..5` deckt `roh & 63` exakt |
| `anlage3` | 4 | **0** | `ANLAGE3_DRAN[3] === undefined` schließt den Endzustand |
| `giesskanne` | 4 | **0** | Amtsstuben-Link erscheint bei `st === 2` |
| `kaffeemaschine` | 7 | **0** | `showJahresgespraech()` läuft alle 10 Schichten unbegrenzt, Auslöser nachholbar |
| `hintermuehl` | 5 | **0** | Anlasschor verbraucht höchstens **einen** Druck (`letzterAnlass = null`) |
| `gutachter` | 12 | **0** | Flag wird nur im Erfolgsfall gesetzt, verfrühter Truhenfund verbrennt die Schicht nicht |

Weltseitige Voraussetzungen: alle elf Figuren werden in jeder Schicht gespawnt (2238); Bramsches `bramscheJustAsked` löst sich nach genau einem Druck auf → `npcCycle()` ist spätestens im dritten Druck erreichbar; `wenn()`-Gates sind monoton; `'kammer'` feuert in `truheOeffnen()`, nicht beim Betreten.

**Zapf-Gegenfall — keiner konstruierbar.** Fünf Angriffspunkte geprüft: (1) `'ansprechen'` wird an genau einer Stelle gefeuert (8388), immer mit `nur:k`. (2) `langAnsprechen()` `return`t beim ersten Stufenanstieg. (3) Alle Nicht-`ansprechen`-Ereignisse sind exklusiv einem Strang zugeordnet. (4) Kein Fremdobjekt trägt `.nur`. (5) **Fragil:** ein künftiger Strang, dessen `'ansprechen'`-Schritt nur die unteren Bits bewegte, würde `st > vorher` nicht auslösen — dann liefe die Schleife weiter und ein zweiter Strang könnte im selben Druck vorrücken. Heute tut das kein Strang; die Zusage hält per Tabelleninhalt, nicht per Konstruktion, und kein Guard sichert sie ab.

**`t.diff`/`t.tier` — keine Kreuzung gefunden.** 18 Lesestellen des Rohwerts (Grafik-Set 4223, W4-Kammergarantie 4255-4256, Rätselbau/Beute-Tier 4320-4322, Wächter/Boss/Schaden 4354-4779, Floater 4382, Gold/Zutaten 4489-4495, Beutequalität 4497, Aktenfunde 4507-4511, HUD 5820, `AUFTRAG_TYPEN.kammer.zaehle` 7854) gegen **eine** Anzeige-Lesestelle (5253-5259, Schild). Kein Anzeigewert landet in einer Rechnung, kein Rohwert im Schild. Die Aushang-Logik bleibt asymmetrisch in die günstige Richtung: da `zeig ≤ diff`, qualifiziert eine Tür, die nach „ab Aufwand N" aussieht, immer mindestens für N.

## G7: Querschnitt über alle Abschnitte

Skript extrahiert (8594 Zeilen, `node --check` sauber), Zeilenoffset +506, verifiziert an zwei Ankern. Alle Zeilennummern unten sind **index.html**-Zeilen.

### 7.1 TDZ

**Methode.** AST-Analyse mit `acorn`: für jede Top-Level-Anweisung die *eager* gelesenen freien Bezeichner, transitive Hülle über tatsächlich aufgerufene Funktionen inkl. Objektliteral-Methoden, dann Deklarationszeile gegen Aufrufzeile.

**Validierung des Prüfers.** In einer Scratch-Kopie wurden die beiden von W7 im Code selbst beschriebenen Regressionen wieder eingebaut (`anredeAssert()`/`vorgangAssert()` zurück auf 7487/7488). Der Prüfer meldet beide exakt: `anredeAssert()@7487 -> langFertig (const @8346) via knBegruessungLine` und `vorgangAssert()@7488 -> langFertig via vorgangPanelHtml`. Das Negativergebnis ist damit belastbar, nicht bloß leer.

| Top-Level-Selbstaufruf | Zeile | spätest deklarierter gelesener Bezeichner | Urteil |
|---|---|---|---|
| `blaetterAssert()` (IIFE) | 2798 | `BLAETTER_KEYS` const @2788 | **stimmt** |
| `knAssertCaps()` | 3910 | `KN_TRAENKE_GAGS` const @3868 | **stimmt** |
| `rangAssert()` | 7318 | `AUSWEIS_TEXTE` const @7198 | **stimmt** |
| `auftragAssertBrett()` | 8017 | `auftragLohn` const @7920 | **stimmt** |
| `langAssert()` | 8588 | `LANG_PROBEN` const @8582 | **stimmt** |
| `vorgangAssert()` | 8589 | `langFertig` const @8344 | **stimmt** |
| `anredeAssert()` | 8590 | `langFertig` const @8344 | **stimmt** |
| alle übrigen ~110 Top-Level-Anweisungen | — | keiner nach dem Aufruf deklariert | **stimmt** |

**0 TDZ-Kandidaten.** Die vier im Code dokumentierten Umzüge sind vollständig und korrekt vollzogen. Zentral live bestätigt: das Skript läuft bis zur letzten Deklaration durch, Konsole leer.

### 7.2 Persistenz

Storage-Keys: **vier**, nicht drei. Der vierte (`sda_targetPriority`, Schreibstelle 8977, Lesestelle 3049) wird geladen — es gibt keinen ungeladenen Key.

`amt` hat elf Felder, alle geschrieben → gespeichert → geladen. Eine Ausnahme: **`amt.auftraegeErfuellt` wird geschrieben, gespeichert, geladen und nirgends gelesen** (nur drei Vorkommen: 2934 / 3735 / 8619).

`kladde` hat acht Felder, alle geladen. `noteKladde()` (2855) speichert nicht selbst, aber alle drei Aufrufe (5503-5505) laufen in dieselbe `saveKladde()`-Zeile 5507 — kein Leck. `kn` hat zehn Felder, alle in `loadKn()` geladen.

Whitelist vollständig: kein `amt.*`-Schreibzugriff auf ein Feld außerhalb der elf, kein dynamischer `amt[…]`-Schreibzugriff.

**Kein Feld in `amt`/`kladde`/`kn` wird geschrieben und nicht geladen.** Der stille Verlust sitzt nicht in der Whitelist, sondern in den Laufzeitfeldern neben `amt.auftrag` (siehe GW3).

### 7.3 `#ovPanel`

Zusage: „acht Schreibstellen, nie eine `id` darin".

| # | Zeile | Funktion | `id="…"` darin |
|---|---|---|---|
| 1 | 6767 | Startbildschirm | nein |
| 2 | 6779 | Todes-/Overlay-Panel | nein |
| 3 | 6821 | Sieg/Abspann | nein |
| 4 | 6997 | `endShift()` Dienstbericht | nein |
| 5 | 7589 | `vorgangPanel()` | nein |
| 6 | 7766 | `showJahresgespraech()` | nein |
| 7 | 8701 | Schichtabschluss/Amt | nein |
| 8 | **8990** | **`showLoading()`** | **ja: `<p id="loadTxt" …>` in 8993** |

Keine weiteren Schreibarten (`insertAdjacentHTML`, `textContent`, `append`, `innerText`).

**Zahl acht: stimmt. „nie eine `id` darin": weicht ab.**

### 7.4 Formregeln

| Prüfpunkt | Methode | Ergebnis | Urteil |
|---|---|---|---|
| Gedankenstriche in Spieltexten | AST-Sweep über **alle 4437** String-Literale und Template-Quasis | **0 Treffer.** Die 184 Vorkommen in `index.html` liegen ausnahmslos in Kommentaren | **stimmt** |
| Emojis in Figurentexten | derselbe Sweep | 93 Treffer, **alle** HUD-/Icon-/Panel-Chrome. `DORF_FIGUREN`, `BLAETTER`, `HINWEISE`, `ESCALATE_DEFS`, `RANDNOTIZ`, `ANREDE`, `ADRESS_ZEILEN`, `VORGANG_*`, `RANG_*`, `AUFTRAG_BEMERKUNGEN`, `AUSWEIS_TEXTE`, `INSIGNIEN` — alle sauber | **stimmt** |
| Deckel eingehalten | Längen statisch nachgerechnet über alles, was `knAssertCaps()` prüft | **0 Verletzungen** | **stimmt** |
| Deckel-**Abdeckung** jeder Sprechblasenquelle | `npcCycle` 4932-4954 und `npcSprechen` 4955-4989 | `fig.*` → `knAssertCaps`; `anredeZeile` → `anredeAssert` und `knBegruessungLine`; `langAnsprechen`/`langZusatz` → `langAssert`. **Lückenlos** | **stimmt** |

Deckelzuordnung: 48/32/44 (Canvas-Sprechblasen) bei `knAssertCaps`, `anredeAssert`, `langAssert`. 36/60/70 (Panel-Text) bei `auftragAssertBrett`. Bewusst ohne Deckel, jeweils mit Begründung im Code: Rang-/Ausweis-Texte, `VORGANG_*`, `langBestandBlock`, `BLAETTER`, `DIENST_BEMERKUNGEN`. Konsistent — keine dieser Tabellen erreicht eine Sprechblase.

### 7.5 Sperrvermerk / Kesselgrammatik

**Die Prämisse des Auftrags trifft am HEAD nicht zu.** Es gibt **fünf** `GEHEIM`-Listen (2804, 7217, 7614, 7958, 8431), und sie sind nach Whitespace-Normalisierung **Wort für Wort identisch** — 11 Einträge, gleiche Reihenfolge. Zentral nachgeprüft, alle fünf Zeilen normalisiert verglichen: byte-gleich.

Es gibt also keine Differenz und damit **keine differenzielle Lücke**. Die Lücke sitzt eine Ebene höher, in der *Abdeckung*:

| Guard | Zeile | Korpus | Deckel | `—/–` | Emoji | `GEHEIM` | Urteil |
|---|---|---|---|---|---|---|---|
| `blaetterAssert` | 2798 | `BLAETTER` (48 Blätter, 275 Strings) | Zeilenzahl | ja | ja | **ja** | **stimmt** |
| `knAssertCaps` | 3873 | `HINWEISE`, `ESCALATE_DEFS`, `RANDNOTIZ`, `KN_TRAENKE_GAGS`, **`DORF_FIGUREN`** (346 Strings, größter Sprechblasenkorpus) | ja | **nein** | **nein** | **nein** | **weicht ab** |
| `rangAssert` | 7213 | `RAENGE`, `INSIGNIEN`, `RANG_*`, `AUSWEIS_TEXTE` | nein (dokumentiert) | ja | ja | **ja** | **stimmt** |
| `anredeAssert` | 7418 | `ANREDE`, `knBegruessungLine` | ja | ja | ja | **nein** | **weicht ab** |
| `vorgangAssert` | 7610 | `ADRESS_ZEILEN`, `VORGANG_*`, gerenderte Panels | nein | ja | ja | **ja** | **stimmt** |
| `auftragAssertBrett` | 7954 | `AUFTRAG_*`, 2440 gewürfelte Bretter | ja 36/60/70 | ja | ja | **ja** | **stimmt** |
| `langAssert` | 8427 | 7 Stränge, gerenderte Blöcke | ja 48/32 | ja | ja | **ja** | **stimmt** |

**Verrät ein Spieltext die Kesselgrammatik?** Globaler AST-Sweep der 11 Begriffe über alle 4437 Strings. Treffer außerhalb der Listen selbst: `MAL[3]='dreimal'` 2904 (Kladde-Zählwort), `'Alter Schrecken'` 3132 (Bossname), `'eqSlot/bagSlot/potSlot'` (CSS-Klassen), `'-Slot'`/`'SUBSTANTIVE'` 5579-5588 (Kladde-Beobachtungen), `.beltSlot` 9072 (CSS). **Kein Verrat** — Kladde-Beobachtungen sind durch Weltbibel 212 ausdrücklich erlaubt, der Rest ist kein Spieltext.

**50 Prüfpunkte: 43 stimmt, 6 weicht ab, 1 überholt, 0 nicht auffindbar, 0 nicht prüfbar.**

## Die Guards

Acht selbstaufrufende Prüffunktionen melden beim Laden alle grün. Dieser Abschnitt sagt für jede, welche Aussage sie **wirklich** trägt und welche ihr nur zugeschrieben wird. Das ist der Teil, den es bisher nicht gab, und er ist der Kern dieses Berichts: ein grüner Guard, der das Falsche prüft, ist gefährlicher als gar keiner.

Vorab zwei Befunde, die alle betreffen:

**Es sind sieben Selbstaufrufe, nicht sechs.** `phase-w7-langvorgaenge.md:218` zählt sechs. Tatsächlich: `blaetterAssert` (IIFE 2798), `knAssertCaps` (3910), `rangAssert` (7318), `auftragAssertBrett` (8017), `langAssert` (8588), `vorgangAssert` (8589), `anredeAssert` (8590).

**Kein Guard hat einen Seiteneffekt auf den Spielstand.** Zentral live gemessen: `localStorage` vor und nach allen sechs aufrufbaren Guards byte-identisch. Kein `saveAmt()`, kein `saveKladde()`, kein `saveKn()`, weder direkt noch über einen gerufenen Pfad. Alle Spiegel werden zurückgesetzt. **Diese Zusage hält durchgehend.** Die eine Einschränkung: kein Guard verwendet `try/finally`. Wirft eine gerufene Funktion, bleiben die Spiegel korrumpiert stehen — und weil alle sieben auf Skriptebene laufen, reißt das den Rest des Skripts mit.

### `blaetterAssert()` · 2798

**Beweist:** Sollzahl 48, Zeilenzahl je Blatt ≤ 6, Gedankenstrich, Emoji **und** Sperrvermerk über alle 275 Strings von `BLAETTER`. Von der Prüfdimension her der vollständigste der acht.

**Beweist nicht — und das ist strukturell:** Er ist als IIFE gebaut, ein benannter Funktionsausdruck ohne globalen Bezeichner. Er läuft genau einmal beim Laden und lässt sich **nie wieder aufrufen**. Jede spätere Prüfung, jede Konsolensitzung, jeder Regressionstest kann seinen Rückgabewert nicht lesen. Die anderen sechs sind Funktionsdeklarationen und beliebig oft aufrufbar. Das ist keine Aussagelücke, sondern eine Werkzeuglücke — und sie hat diesen Bericht daran gehindert, den achten Guard live zu bestätigen.

### `knAssertCaps()` · 3873

**Beweist:** Genau eine Aussage über genau eine Datenquelle — keiner der 293 Strings in `DORF_FIGUREN` überschreitet 48 / 32 / 44 Zeichen. Er liest die echte Tabelle, kein Duplikat, deckt für die Aktzeilen den gesamten Indexbereich ab, den `aktStand()` erzeugen kann, und ist seiteneffektfrei. Nachgerechnet: 0 Verletzungen, Maxima 46 / 32 / 44.

**Beweist nicht:**

* **Er prüft nur Länge.** Kein Gedankenstrich, kein Emoji, kein `undefined`, kein Sperrvermerk — als einziger der fünf Text-Guards. `DORF_FIGUREN` ist mit 346 Strings der größte Sprechblasenkorpus des Spiels, und die Weltbibel nennt ihn zweimal namentlich als Sperrvermerk-relevant. Der Bestand ist sauber (unabhängig nachgerechnet: 0 Treffer), aber nichts hält ihn sauber. Das ist **GW14**.
* **Er sieht die häufigste Blase nicht mehr.** Schritt 0 jedes Sprechzyklus ist seit der Anrede-Phase `anredeZeile(fig.key)` — eine zur Laufzeit gebaute Zeile, geprüft von `anredeAssert()`. Die W7-Fortschritts- und Zusatzzeilen hängen an `langAssert()`. Wer `phase-w3-dorf.md:644` liest („meldet keine Verletzung für `DORF_FIGUREN`"), hält ihn leicht für die Deckelgarantie der Dorf-Blasen. Das ist er nur noch für zwei Drittel davon.
* **Er prüft Daten, nicht Zugriffsbereiche.** Er iteriert `fig.akt`, nicht den Index `aktStand()-1`. Hätte eine Figur nur vier Aktzeilen, wäre `fig.akt[4] === undefined`, `drawBubble()` würde wegen `if(!text1) return;` schweigend nichts zeichnen — und der Guard bliebe still. Es gibt nirgends eine Zusicherung `grund.length === 6` oder `akt.length === 5`.
* **Sechs Prüfzeilen sind hartkodierte Literalkopien** (3877-3882) statt Lesezugriffe auf ihre Quelle. `Knöterich. Monstralministerium.` steht deshalb dreimal im File. Ändert jemand das Original, prüft der Guard weiter die Kopie. Der W3-Block macht diesen Fehler ausdrücklich nicht — wer den Guard als Vorbild nimmt, sollte wissen, welches der beiden Muster gemeint ist.
* **Fehlschlag ist folgenlos.** `console.assert` wirft nicht.

### `rangAssert()` · 7213

**Beweist:** `RAENGE` hat 19 Einträge, `g ∈ 0..3`, `v ∈ 0..2`, `spitze` nur `true` oder fehlend; `g` und `v` sinken innerhalb der Tabelle nie; vier von 19 Titeln stehen an der richtigen Stelle. Über `s = 0..200`: `rangName()` ist nie leer, deckt sich mit `rangNameVon(rangStufe())`, und **der Name wechselt genau an den Fünferschritten und nirgends sonst** — das ist die stärkste Prüfung im ganzen Guard, ein Takt von 4 oder 6 statt 5 würde hier auffallen. Dazu: `roemisch(n)` liefert für 2..500 nie leer und nie eine Ziffer; genau zwei Einträge tragen `wirkung:true`; Formregeln und Sperrvermerk über Tabellen **und** die HTML-gestrippten Ausgaben von `rangBerichtBlock()` und `rangZeremonieBlock()`.

**Beweist nicht:**

* **Der „Zeremonie-Kopplungsbeweis" kann nie feuern.** `if(s % 10 === 0 && s % 5 !== 0)` ist für ganze Zahlen die leere Menge — 0 Treffer über 0..100000. Der Guard fasst weder `nachSchicht()` noch `showJahresgespraech()` noch `rangZeremonieBlock()` an. Die Kopplung *gilt* (unabhängig über 0..500 nachgerechnet: 50 Zeremonien, 100 Beförderungen, 0 Verletzungen) — aber nicht, weil der Guard sie prüft. Ein Umbau von `nachSchicht()` auf `%12` bliebe grün.
* **Der Insignien-Prüfpunkt ist definitorisch wahr.** `rangZeichnungsbefugt()` **ist** `INSIGNIE.zeichnung.wenn()`. Sabotagetest: Schwelle 30 → 15 und Schlüssel → `true` gesetzt, `rangAssert()` bleibt **grün**. Die einzige echte Schwellenprüfung (`>= 30`) steht in `vorgangAssert()` und wurde erst in W5 nachgereicht; für die Schlüsselschwelle 55 prüft nirgends etwas.
* **Der Drift-Test ist eine Tautologie.** `if(rangNameVon(rangStufe()) !== rangName())` — `rangName()` ist definiert als `return rangNameVon(rangStufe());`. `phase-anrede.md:36` nennt diese Zeile ausdrücklich einen Beweis.
* **15 von 19 Rangzeilen sind ungeprüft.** Die Ankerprüfung deckt Index 0, 6, 10, 18. Sabotagetests, alle grün: Titel 13↔14 vertauscht; `RAENGE[3].g` 1→0; `RAENGE[6].v` 2→1; `RAENGE[7].t` frei erfunden. Die Tabelle ist korrekt (von Hand gegen 18.3/18.4 gelesen) — der Punkt ist, dass der Guard das nicht garantiert. Er schützt vor Verschiebung, nicht vor Verfälschung.
* **Keine Monotonie über die römische Fortsetzung**, entgegen `phase-w6-rang.md:116`. Nur „nicht leer, keine Ziffer".
* **Der Sweep deckt nur den bequemen Teil.** 0..200 nach oben, **nichts unterhalb 0** — und der Zeremonie-Sweep beginnt bei `s = 10`, lässt also genau den Wert `s = 0` aus, an dem `rangZeremonieBlock()` `Knöterich: „undefined"` rendert.

### `anredeAssert()` · 7418

**Beweist:** Bijektion `DORF_FIGUREN` ↔ `ANREDE` in beide Richtungen — echter Zukunftsschutz, eine neue Dorf-Figur ohne Anredeform wird zum Konsolenfehler. Für `amt.schichten ∈ {0, 5, …, 5000}`: kein z1 > 48, kein z2 > 32, kein leerer String, kein `undefined`, kein Gedankenstrich, kein Emoji. Die Rangstufen 0..18 sind dabei vollständig getroffen. Für dieselbe Reihe × 2 Rekordzustände × 2 Gießkannenzustände: `knBegruessungLine()` ≤ 44 und der dritte Boden greift nie.

**Beweist nicht:**

* **Nichts über vier von fünf Lisbeth-Varianten.** `s += 5` erzwingt `amt.schichten % 5 === 0`; `ANREDE.lisbeth` indiziert mit `% 5`. Der Index ist damit **immer 0**. Acht Strings sieht weder dieser Guard noch `knAssertCaps()`. Schrittweite und Modulo müssten teilerfremd sein und sind es nicht — derselbe Fehlertyp, den der Guard laut Phasendokument bei Lott einmal gefunden hat.
* **Nichts über die 18.5-Vorschrift selbst.** Er misst Zeichenlängen, nicht Inhalt. „Herr oder Frau" wird nirgends geprüft. `phase-anrede.md:167` („Knöterich grüßt amtlich … über den Guard geprüft") ruht auf einer Prüfung, die das Wort „amtlich" nicht kennt — und die Vorschrift ist auf 80 von 81 Rängen nicht erfüllt.
* **Der Pommer-Prüfpunkt ist strukturell immer wahr**, solange `pommer` mit konstanter 0 rechnet: jede Sprosse von `anredeFormen(0)` enthält `RAENGE[0].t` als Teilstring. 1001 identische Auswertungen.
* **Der Zwirn-Prüfpunkt läuft auf 18 von 1001 Sweep-Punkten** und kann mit den heutigen `RAENGE` nie auslösen. Sein Kommentar („ab Schicht 90+ hingenommen") ist um Faktor ~17 falsch — die echte Kollision liegt bei Schicht 1520.
* **Nichts über das Rekord-Suffix.** Er sweept `rek = 99`, prüft aber nie, ob das Suffix je sichtbar wird — anders als bei der Gießkanne, für die W7 genau so einen Sichtbarkeits-Check nachgezogen hat. Genau darum ist der Einbruch von 193 auf 10 sichtbare Schichten unbemerkt geblieben.
* **Kein Sperrvermerk.** Als einziger Guard mit eigenem `text()`-Helfer lässt er die `GEHEIM`-Schleife weg. Risiko gering (Rangtitel und Höflichkeitsformeln), aber er ist die teuerste Textprüfung im Projekt und lässt die billigste Zeile aus.

### `vorgangAssert()` · 7610, Selbstaufruf 8589

**Beweist:** Tabellenform von `ADRESS_ZEILEN` inkl. Anker auf den `VORGANG_ANSCHRIFT`-Wortlaut; `SERIE_AKT` ist deckungsgleich mit den in `BLAETTER` vorkommenden Serien; `serieFrei()` springt nie zurück und schaltet exakt bei 10/20/30/40 (Vollsweep 0-60 über alle Ganzzahlen); `vorgangDreiZeilen()`/`vorgangAusfertigung()` über **alle 16 Teilmengen**; `rangZeichnungsbefugt()` kippt bei Schicht 30; Formregeln und Sperrvermerk über die HTML-gestrippte Ausgabe von `vorgangJahresBlock()`, `vorgangPanelHtml(1|2|3)` inklusive beider Puzzleteil-Fassungen und `vorgangBestandBlock()` leer und voll. Alle fünf Spiegel exakt zurückgesetzt.

**Beweist nicht:**

* **Nichts über die Mechanik.** Kein Block berührt die `t.adr`-Markierung in `setzeKammerTueren()`, `findeAdresszeile()`, das Sonderschild in `drawKammerTuer()`, den garantierten Drop in `truheOeffnen()`, den `killMon()`-Kanal, das `AKT_ZUSTELLEN`-Angebot, den Grußpflicht-Fix oder das Einfrieren in `zustellen()`. **Die gesamte W5-Verdrahtung hängt allein an einer einmaligen Browsersitzung** — und W7 hat `drawKammerTuer` und `renderBlaetter` seither schon wieder angefasst, ohne dass sich etwas gemeldet hätte.
* **Nichts über „keine zweite Wahrheitsquelle"**, entgegen `phase-w5-vorgang.md:209`. Der Gatter-Sweep prüft `serieFrei()`; er liefe unverändert durch, wenn daneben ein `amt.akt` gepflegt würde.
* **Keinen positiven Prüfpunkt für `vorgangAdressAkt()`.** Nur die Negativaussage bei `schichtModus=false`. Ein Vorzeichenfehler dort macht Akt IV unspielbar oder öffnet ihn ab Schicht 0 — nichts würde anschlagen.
* **Nichts über `vorgangZustellbar()` unter `schichtModus=false`** — die Abnahmezeile hat im Guard keinen Gegenpart.
* **Zwei Punkte sind strukturell immer wahr, ein dritter kann nie feuern.** Der Rücksprung-Check (`aktStand()` ist monoton, ein Rücksprung ist arithmetisch unmöglich); das Kreuzprodukt (`A && B` mit bereits fixierten A und B ergibt zwangsläufig genau eine wahre Kombination); und der `if(!txt)`-Zweig für gestrippte Blöcke, weil `strip()` Tags durch Leerzeichen ersetzt.

### `auftragAssertBrett()` · 7954

**Beweist:** Roster-Konsistenz — jeder der neun Typen hat einen `MONDEF`-Eintrag mit `.art`, ist weder `reserved` noch `boss`, hat einen `ZUTAT_NOUNS`-Eintrag und spawnt in genau einem Biom; `BIOM_AMT` und `BIOME_MOBS` decken sich beidseitig. Das ist der einzige Teil, der bei einer Änderung an `BIOME_MOBS`/`MONDEF`/`ZUTAT_NOUNS` anschlagen würde. Dazu Texthygiene (36/60/70 Zeichen, Gedankenstrich, Emoji, Sperrvermerk) auf `titel`, `satz` und `AUFTRAG_BEMERKUNGEN`, und über 2440 gewürfelte Bretter: kein toter Tabelleneintrag.

**Beweist nicht:**

* **Alle neun `pruefePar` sind Tautologien.** Jedes prüft genau die Schranke, die das zugehörige `wuerfle` per Konstruktion einhält: `menge` zieht `par` aus `AUFTRAG_MOBS` und prüft `indexOf(par) >= 0`; `kammer` erzeugt `clamp(…,2,3)`/`clamp(…,4,5)` und prüft `1..5`; `verzicht` erzeugt max 22 und prüft `<= 30`; `bilanz` erzeugt max 1500 und prüft `<= 1500`. Ebenso tautologisch: `liste.length !== 3` (die Schleife pusht immer 3), `gesehen[a.typ]` (der `genommen`-Filter verhindert Dubletten), `lohn < 150 || > 400` (400 ist das konstruktive Maximum), `liste[1].bm !== 2` (`bm` ist für `st===1` literal 2), `reise && sch < 10` (identisch mit dem `wenn()`). **Von neun Prüfpunkten pro Brett kann beim heutigen Code keiner jemals feuern.** Der Code-Kommentar 7951 („Beweist beim Start: kein würfelbarer Aushang kann unerfüllbar sein") ist von diesem Guard nicht gedeckt — und genau dort ist mit GW2 ein Fehler durchgerutscht.
* **Die Erfüllungshälfte von W4 wird nie ausgeführt.** `stand`, `zaehle`, `bruch`, `sofort`, `auftragEreignis`, `auftragZahle`, `auftragStandWert` kommen im Guard nicht vor. Ein Typ mit vertipptem `stand` bestünde den Guard und würfe erst im Spiel.
* **Der Sweep variiert genau eine Größe.** `amt.schichten` 0..60. Nicht variiert: `player.level`, `player.gold`, `amt.ausbauten` (und damit `CONFIG.kammerTueren`), die Karte, `CONFIG.schichtModus` — genau die Achsen, an denen die drei Weltgarantien hängen.
* **Formregeln nur auf drei von zehn Textquellen.** Ungeprüft: „Stand: X von Y", „Erfüllt. N Gold verbucht.", „Hinfällig. Ohne Folgen.", „Aushang zurückgeben", „Aushang hinfällig", „Aushang erfüllt · N Gold", die Dienstbericht-Zeile, „Schwarzes Brett", „Kein Aushang", „ANGENOMMEN".
* **Kein Prüfpunkt zum Humor-Grundgesetz**, entgegen `phase-w4-brett.md:3`. Kapitel 13 ist maschinell nicht prüfbar; die Zusage suggeriert eine Prüfung, die niemand durchgeführt haben kann.

### `langAssert()` · 8427

**Beweist:** Tabellenform aller sieben Stränge, `stufen >= 1`, `hoert` nur aus `LANG_EREIGNISSE`, `figur` existiert. Erreichbarkeit jedes Strangs bis `stufen` unter einem kooperativen Zeitplan (Deckel 400 Runden; tatsächlich 1-11). Monotonie entlang dieser Bahn. Deckel, Gedankenstrich, Emoji, `undefined` und Sperrvermerk über `fortschritt`, `zusatz`, `bestand`, `titel` aller Stufen. Milbs Schild über `diff 1..5` × beide Strangzustände inkl. `RARITY`-Index. Bramsches Fragenrechnung in beiden Zuständen. Gerenderte Blöcke HTML-gestrippt in **beiden** Zuständen inklusive des bedingten Abspann-Absatzes — das ist sein stärkster Punkt, weil er den einzigen Text abdeckt, den `vorgangAssert()` nie sieht. Alle sechs Spiegel exakt zurückgesetzt.

**Beweist nicht:**

* **Blockadefreiheit.** Punkt 2 ist eine Erreichbarkeitsaussage unter einem *freundlichen* Zeitplan, keine Sackgassen-Aussage. Ein `schritt()`, das nach einer ungünstigen Ereignisreihenfolge tot läge, käme durch. (Die fehlende Aussage wurde in G6 unabhängig erbracht — erschöpfende BFS, Ergebnis grün. Aber der Guard ist nicht der Grund dafür.)
* **Die eigentliche Laufzeit-Semantik.** Punkt 2 und 3 rufen `d.schritt()` **direkt**, an `langEreignis()` vorbei. Der Stufendeckel, der Monotoniefilter, der `wenn()`-Gate und `info.nur` werden nie ausgeführt. Wer diese vier Zeilen entfernte, hätte einen grünen Guard.
* **Punkt 3 ist für `dorffest` strukturell immer wahr.** Nach der Sweep-Schleife steht `langSchicht.dorffest === true`, weil die letzte Runde es gesetzt hat und der Idempotenz-Check es nicht zurücksetzt. `dorffest.schritt` liefert deshalb zwangsläufig `roh`. Mit frischem Schichtflag liefert dieselbe Funktion auf `roh = 11` den Wert `12`. Der einzige reale Schutz vor `DORFFEST_ABSAGEN[11] === undefined` ist `if(alt >= d.stufen) continue;` — genau die Zeile, die der Guard nie ausführt.
* **„Reine Funktion" ist falsch.** Der Kommentar 8461 begründet die Sicherheit des Guards damit, dass `d.schritt()` rein sei. `dorffest.schritt` und `gutachter.schritt` schreiben `langSchicht`.
* **Nur drei von fünf versprochenen Prädikaten.** `vorgangAdressAkt()` und `rangZeichnungsbefugt()` kommen nicht vor. Und Punkt 4 prüft nur den großzügigsten Punkt des Wertebereichs.
* **Inertheit nur für `langEreignis()`.** Punkt 5 läuft mit leerem `kladde.lang` und ist damit gegen die behauptete Inertheit von `langFertig()`, `langZusatz()` und `langAnsprechen()` blind — siehe GW6.
* **`bestand()` nur im unmöglichen Fall.** Punkt 8 läuft mit `kladde.lang = {}`; `probezeit.bestand` und `gutachter.bestand` sehen deshalb immer `0`. Die realen Zwischenstrings („4 von 6 Bemerkungen gesammelt, 3 vorgelegt") werden nie erzeugt, geprüft werden im Spiel unmögliche Kombinationen.
* **Die „ein Strang je Tastendruck"-Invariante ist ungeschützt.** `langAnsprechen()` erkennt Fortschritt über `langStufe()`. Ein künftiger Strang, dessen `'ansprechen'`-Schritt nur die unteren Bits bewegte, ließe die Schleife weiterlaufen. Für ein Dokument, das Blockadefreiheit ausdrücklich „strukturell, nicht geprüft-und-gehofft" reklamiert, ist das ein Bruch der eigenen Doktrin.

### Zusammenfassung der Guard-Lage

| Guard | trägt seine Kernaussage | strukturell immer wahre Punkte | Sperrvermerk geprüft | wiederholt aufrufbar |
|---|---|---|---|---|
| `blaetterAssert` | ja | 0 | ja | **nein** (IIFE) |
| `knAssertCaps` | nur Länge | 0 (im W3-Block) | **nein** | ja |
| `rangAssert` | teilweise | **3** | ja | ja |
| `anredeAssert` | teilweise | **2** | **nein** | ja |
| `vorgangAssert` | nein (Mechanik fehlt ganz) | **3** | ja | ja |
| `auftragAssertBrett` | nein (Erfüllbarkeit fehlt) | **9** (alle `pruefePar`) | ja | ja |
| `langAssert` | teilweise | **1** | ja | ja |

## Funde, nach Schwere

Eigene Nummernserie `GW`, damit sie nie mit den `F`-Nummern des Abgleichs oder den `Z`-Nummern der Zusagen-Bilanz verwechselt werden. In Klammern die Paketherkunft.

---

### GW1 · Ein Aushang zahlt seinen Lohn nach jedem Reload erneut (G2, G7 — unabhängig doppelt gefunden)

**Was.** `auftragZahle()` (`index.html:8617`) bucht `amt.bankGold += a.lohn`, erhöht `amt.auftraegeErfuellt` und ruft `saveAmt()` — löscht `amt.auftrag` aber **nicht**. Die Zahlungssperre ist die reine Laufzeitvariable `auftragFertig` (`index.html:2948`), die `startShift()` (`index.html:6932`) auf `false` zurücksetzt. `amt.auftrag` ist persistent und wird von `loadAmt()` (`index.html:3734`) unverändert zurückgeholt. Es gibt kein persistiertes Bezahlt-Flag.

Ablauf: Aushang annehmen → erfüllen (Lohn 1) → Seite neu laden → „Dienst antreten" → erneut erfüllen (Lohn 2) → beliebig oft. Der Kommentar bei `index.html:8641` beschreibt die erste Hälfte der Folge ausdrücklich als gewollt („der angenommene Aushang bleibt gültig"); dass damit auch die Zahlungssperre fällt, steht nirgends. `phase-w4-brett.md:182` behauptet sogar „zweites Ereignis zahlt nicht erneut" — das gilt nur innerhalb einer Sitzung.

**Warum es zählt.** 150 bis 400 Gold je Durchlauf, laut Codekommentar `index.html:8620` bewusst am 50-Prozent-Verwaltungskostenanteil vorbei in die Bank. Der Vollausbau kostet 3850 Gold. Für den Typ `kammer` ist per W4-Weltgarantie immer eine passende Tür vorhanden — das sind Minuten. Es kippt die Abnahmezusage „Ein Auftrag pro Schicht" (`phase-w4-brett.md:155`) auf der Persistenzebene und inflationiert `amt.auftraegeErfuellt`, das laut `phase-w4-brett.md:167` als Erzählsignal für spätere Abschnitte gedacht war. Zwei Instanzen haben das unabhängig voneinander gefunden; die Live-Prüfung des Phasendokuments hat den Reload gesehen und die Folge nicht gezogen. **Dieser Fund wurde bewusst nicht nachgespielt** — er hätte echtes Gold in den Spielstand gebucht. Der Beleg ist rein statisch und lückenlos.

**Korrekturkosten.** Eine Zeile plus eine Bedingung: in `auftragZahle()` `a.bezahlt = true` setzen (das Objekt liegt in `amt.auftrag` und wird ohnehin mitserialisiert), in `startShift()` `auftragFertig = !!(amt.auftrag && amt.auftrag.bezahlt)`. Kein neues `amt`-Feld, die Feldzahl aus `cfd62a4` bleibt gültig.

**Stimmte nie** — seit W4 so gebaut.

---

### GW2 · Mengen-Aushänge sind ab Akt IV rechnerisch unerfüllbar (G2)

**Was.** `AUFTRAG_TYPEN.menge.wuerfle` (`index.html:7834`) liefert für Pool-Index 2 `ziel = 9 + stufe*2`, also 9/11/13/**15**/**17** über die Akte I bis V. Die Weltgarantie `auftragTypBevorzugen()` (`index.html:3191`) ersetzt in `placeMonsters()` nur den **Typ** eines ohnehin gesetzten Monsters — sie erhöht die Zahl der Monster im Biom nicht. Obergrenze pro Schicht: 55 Würfe, `ty = ri(4,75)`, Bandanteile Schnee 30,6 %, Gras 40,3 %, Sand 29,2 %; nach den `continue`-Ablehnungen bleiben ≈16 Schnee, ≈15 Sand, ≈18 Gras, Gras zusätzlich um `VILLAGE` und den Spawnradius beschnitten. `auftragSoll = ziel+2` ist nie die bindende Schranke.

Damit ist `ziel 17` in **allen drei** Biomen unerreichbar und `ziel 15` in Sand unerreichbar sowie in Schnee grenzwertig. Das Phasendokument belegt es selbst: `phase-w4-brett.md:180` misst „15 erzwungene Läufe mit Ziel 8 auf `crab` … 10 bis 14 Treffer" — die Decke liegt bei 14.

**Warum es zählt.** Kippt die Abnahmezusage „Nie unerfüllbar" (`phase-w4-brett.md:158`) für den mit 330 bis 400 Gold teuersten Aushang, und zwar genau in der Spielphase, in der Aushänge am wichtigsten sind. Der Guard kann es nicht sehen, weil `pruefePar` nur `ziel > 0` fordert. Die engere Weltbibel-Zusage („kein Auftrag auf ein Monster, das im gewählten Biom nicht spawnt") bleibt erfüllt; gebrochen ist die schärfere Zusage des Phasendokuments.

**Korrekturkosten.** Eine Zeile: `ziel: st===0 ? 4+stufe : Math.min(11, 9+stufe*2)`. Optional ein echter Guard-Prüfpunkt gegen eine Kapazitätskonstante je Biom.

**Stimmte nie** — `AUFTRAG_TYPEN.menge` ist seit `06c3456` unverändert.

---

### GW3 · Ein negativer Schichtstand zerreißt beim Laden das gesamte Inline-Skript (G4)

**Was.** `rangDef()` (`index.html:7070`) klemmt nur nach oben: `RAENGE[Math.min(rangStufe(), RAENGE.length - 1)]`. `rangNameVon()` (`index.html:7075`) klemmt nur nach unten (`Math.max(0, i|0)`). `loadAmt()` (`index.html:3722`) übernimmt `o.schichten` ungeprüft, auch negativ. **Live reproduziert:** bei `amt.schichten = -5` liefert `rangStufe()` `-1`, `rangDef()` liefert `undefined`, `rangGruppe()` wirft `TypeError: Cannot read properties of undefined (reading 'g')`. Da `rangAssert()` auf Skriptebene läuft (`index.html:7318`) und dort `RANG_URKUNDE()` auf dem **echten** `amt.schichten` rendert, bricht das gesamte Inline-Skript ab — das Spiel lädt nicht mehr.

**Warum es zählt.** Zwei Wahrheitsquellen für denselben Wertebereich mit unterschiedlicher Definitionsmenge — genau die Falle, gegen die Kapitel 18 argumentiert. Der Guard-Sweep geht 0..200 und **nie unter 0**, kann den Fall also nicht finden. Kein normaler Spielverlauf erzeugt einen negativen Wert (`amt.schichten` hat genau eine produktive Schreibstelle, ein `++`), aber `localStorage` ist editierbar und die Whitelist prüft nur den Typ.

**Korrekturkosten.** Sehr klein, zwei Zeilen: `Math.max(0, …)` in `rangDef()` und `Math.max(0, o.schichten|0)` in `loadAmt()`.

**Stimmte nie.**

---

### GW4 · `letzterAnlass` wird jeden Frame neu gesetzt; Fund A ist auf zwei Tonstellungen dauerhaft ausgehebelt (G5)

**Was.** `knRandnotiz()` (`index.html:4027`) schreibt `letzterAnlass = anlass;` als **erste** Anweisung, vor dem `RANDNOTIZ`-Lookup und vor `knLineErlaubt()` (`index.html:4029`) — der Kommentar nennt das ausdrücklich Absicht. `knTick()` (`index.html:4185`) ruft `knRandnotiz('untaetigkeit')` in **jedem Frame**, sobald `knIdleT >= 25` und `knIdleNotizDone` noch `false` ist. Ist `knLineErlaubt()` falsch, gibt `knRandnotiz()` `false` zurück, der Merker bleibt `false` — und die Zeile feuert im nächsten Frame erneut.

Repro: Tonregler auf **„Dienstlich"** oder **„Schweigt"** (`knLineErlaubt()` lehnt dann jeden Anlass außer `begruessung` permanent ab) → 25 Sekunden keine der sieben `knIdleT`-nullenden Aktionen → Lott oder Pahl ansprechen. `npcSprechen()` setzt `letzterAnlass = null`, ein Frame später steht wieder `'untaetigkeit'` drin. Auf „Gesprächig" gibt es dasselbe Fenster transient, solange der 40-Sekunden-Cooldown läuft.

**Warum es zählt.** Genau der Zustand, den Fund A der Anrede-Phase behoben haben will. `npcCycle()` wird für Lott und Pahl nie erreicht — keine Anrede, keine sechs Grundzeilen, keine Aktzeile. Zusätzlich fällt der W7-Langvorgang **Hintermühl** komplett aus, weil `langAnsprechen()` ausschließlich aus `npcCycle()` gerufen wird; der Codekommentar bei `index.html:8266` nennt die `letzterAnlass`-Korrektur selbst als Voraussetzung dafür. Widerlegt die Abnahmezeilen `phase-anrede.md:166` und `:186`.

**Korrekturkosten.** Klein: `letzterAnlass = anlass;` hinter den `knLineErlaubt()`-Gate ziehen (eine Zeile verschieben) oder in `knTick()` den Merker unabhängig vom Rückgabewert setzen. Sauberer zusätzlich ein Reset in `startShift()`.

**Stimmte nie** — beide Stellen existierten unverändert schon bei `45912f6`, also als das Phasendokument geschrieben wurde.

---

### GW5 · W4 ist bei `CONFIG.schichtModus = false` nicht inert (G2)

**Was.** `phase-w4-brett.md:161`: „drei Wächter machen W4 vollständig inert." Es sind fünf Wächter, und drei Welteingriffe tragen **keinen**: `auftragTypBevorzugen()` (`index.html:3191`) und `auftragOrtBand()` (`index.html:3198`), beide aus `placeMonsters()` gerufen, sowie der Kammer-Garantieblock in `setzeKammerTueren()` (`index.html:4252`). Alle drei lesen `amt.auftrag` roh, und `loadAmt()` lädt das Feld unabhängig vom Modus. Ein Spielstand aus dem Schichtmodus lenkt damit bei `schichtModus=false` weiterhin Monstertyp, Monsterband und eine Kammertür-Schwierigkeit.

**Warum es zählt.** Harte Negativ-Zusage, per Grep widerlegt. Die Gefahrenlage ist im Code selbst benannt — Kommentar `index.html:5023` warnt, „ein Spielstand aus dem Schichtmodus kann einen veralteten `amt.auftrag` tragen" — nur eben nur für `auftragFensterBlock()` gezogen.

**Korrekturkosten.** Zwei bis drei Zeilen: `const a = CONFIG.schichtModus ? amt.auftrag : null;` in beiden Funktionen und im Kammerblock. TDZ-neutral, `CONFIG` steht vor allen dreien.

**Stimmte nie.**

---

### GW6 · W7 ist bei `CONFIG.schichtModus = false` nicht inert (G6)

**Was.** `phase-w7-langvorgaenge.md:165` zählt auf: „`langFertig()` ist überall falsch, `langAnsprechen()` liefert `null`, `langZusatz()` ein leeres Array". `langFertig()` (`index.html:8344`) und `langZusatz()` (`index.html:8396`) tragen **keinen** `schichtModus`-Wächter, und `loadKladde()` (`index.html:2850`) lädt `o.lang` unbedingt. Mit einem Spielstand aus dem Schichtmodus liefert `langFertig('dorffest')` bei `schichtModus=false` `true` → der Abspann-Absatz erscheint; `langZusatz('noergel')` liefert die fünf Hinweiszeilen → Nörgels Zyklus wächst; `knBegruessungLine()` zeigt die Gießkannen-Wärme. Nur `langKammerWert()`, `langBestandBlock()` und `langGiesskanneBlock()` sind echt gewächtert.

**Warum es zählt.** `phase-w7-langvorgaenge.md:162` verspricht „Byte für Byte wie vor W7". Das ist im Nicht-Schichtmodus mit vorhandenem Spielstand nachweislich nicht der Fall. Die Herleitung im Dokument („kein Rohwert wird geschrieben → `langFertig()` ist überall falsch") ist ein Fehlschluss: nicht geschrieben ist nicht gleich nicht geladen.

**Korrekturkosten.** Zwei Wächterzeilen, plus Guard-Punkt 5 mit **befülltem** `kladde.lang`.

**Stimmte nie.**

---

### GW7 · Knöterich sagt „Herr oder Frau" auf einem von 81 Rängen; 18.5 Vorschrift 1 ist nicht erfüllt (G5, live bestätigt)

**Was.** Weltbibel 18.5, erste Zeile, absolut formuliert: Knöterich spricht „immer vollständig, immer korrekt, immer inklusive ‚Herr oder Frau' an. Jedes Mal." Der Codekommentar `index.html:4036` zitiert das wörtlich. `knBegruessungLine()` arbeitet mit Deckel 44; die Sprossenleiter `anredeFormen()` (`index.html:7343`) ordnet `t + '(in)'` (Titel + 4 Zeichen) **vor** `ANREDE_HERR + t` (Titel + 15), und `anredeVersuch()` nimmt die erste passende. **Zentral live gemessen über die Rangstufen 0 bis 80: genau eine** Stufe (Rang 11, `Monstralrat`, exakt 44 Zeichen) erzeugt die Form. 80 Ränge ohne. Auf Rang 0 — den Schichten 1 bis 5, dem Spielanfang — fehlen sogar Vollform *und* Schichtzähler.

**Warum es zählt.** Es ist die einzige Vorschrift, die 18.5 für Knöterich aufstellt, und `phase-anrede.md:167` behauptet, der Guard habe die Einhaltung geprüft — der Guard misst aber nur Länge und dritten Boden und kennt das Wort „amtlich" nicht. Zusätzlich ist die Sprosse `ANREDE_HERR + t` **strukturell unwählbar**, solange die Klammerform davorsteht: null Treffer in 9608 Ziehungen.

**Korrekturkosten.** Mittel, aber lokal: Reihenfolge in `anredeFormen()` auf `[HERR+t+'(in)', HERR+t, t+'(in)', t]` umstellen — dann trägt „Herr oder Frau" auf dem 44er-Kanal bis zu 29 Titelzeichen (Ränge 3, 6, 9, 11, 12, 13, 15 statt nur 11) und auf dem 48er-Kanal wie bisher. Alternative ohne Codeänderung: die Vorschrift in 18.5 und im Dokument auf „so vollständig, wie der Kanal trägt" abschwächen — dann muss die Abnahmezeile mit.

**Stimmte nie** — bei `6f77f68` ist das Rangprofil identisch, W7 hat es nicht verursacht.

---

### GW8 · Die einzige Belohnung der Gießkanne ist auf 12 von 19 Rängen unsichtbar (G6, live bestätigt)

**Was.** `phase-w7-langvorgaenge.md:210` behauptet, die Wärme verschwinde „auf sehr langen Titeln (Rang 0 und ab Rang 18)". Das Suffix „. Schön, dass Sie da sind." ist 26 Zeichen, der Deckel 44 — es bleiben 18 Zeichen für den Titel. **Zentral live gemessen**, mit gespiegeltem abgeschlossenem Strang: sichtbar auf den Rängen **3, 6, 9, 11, 12, 13, 15** (sieben), unsichtbar auf **0, 1, 2, 4, 5, 7, 8, 10, 14, 16, 17, 18** (zwölf) und auf **keinem** Rang oberhalb 18. Die Liste des Pakets und die unabhängige Live-Messung stimmen Rang für Rang überein.

**Warum es zählt.** Der Strang hat laut Kapitel 10 und Phasendokument **ausschließlich** diese Belohnung, keinen Bonus, keinen Vermerk. Die Ränge 0 bis 2 sind die Schichten 0 bis 14, in denen der Strang typischerweise abgeschlossen wird — der Spieler schließt ihn also meist ab, ohne je etwas zu bemerken. Das Dokument stellt das als Randfall dar; es ist der Normalfall. Der Guard-Punkt `warmGesehen` beweist nur „irgendwo sichtbar".

**Korrekturkosten.** Dokument: eine Zeile. Code (optional): Suffix kürzen (z. B. „. Schön, Sie zu sehen." = 22 Zeichen, deckt zusätzlich die Ränge 1, 2, 4, 10) oder eine zweite, kürzere Sprosse als Rückfall. Guard: `warmGesehen` zu einer Quote härten.

**Stimmte nie.**

---

### GW9 · `killMon()` wurde in W5 angefasst — die prominenteste Negativ-Zusage ist widerlegt (G3)

**Was.** `phase-w5-vorgang.md:200` unter „Was in W5 ausdrücklich nicht angefasst wird": „`killMon()` und die bestehende Siegweiche … bleiben Zeile für Zeile unverändert." `git show 45912f6 -- index.html` enthält den Hunk `@@ function killMon(m){`: **zwei geänderte Zeilen** (`kandF`/`kandE` bekommen den `serieFrei()`-Kurzschluss, heute `index.html:3375`) und **vier neue Zeilen plus Kommentar** (`index.html:3385`). Dieselbe Falschaussage steht in der Commit-Message von `45912f6` und im Codekommentar `index.html:7595`. Das Dokument widerspricht sich selbst: `phase-w5-vorgang.md:110` überschreibt den Einbau mit „Vierte Zeile in `killMon()`".

**Warum es zählt.** Es ist die prominenteste Negativ-Zusage des Dokuments und die einzige, die den Ausgang des Spiels betrifft. Wer sie liest, prüft `killMon()` nicht nach. Die belastbare Teilaussage — die Siegweiche selbst ist gegenüber `ad72e37` byte-identisch (nachgeprüft) — ist wahr und wird durch die Übertreibung entwertet.

**Korrekturkosten.** Zwei Wörter: „`killMon()` und die bestehende Siegweiche" → „Die bestehende Siegweiche in `killMon()`". Zusätzlich der Codekommentar. Kein Codeeingriff.

**Stimmte nie.**

---

### GW10 · „Teil 1 ist faktisch nie leer" ist im gesamten Akt IV falsch (G3, live bestätigt)

**Was.** `phase-w5-vorgang.md:186` und der gleichlautende Codekommentar `index.html:7539`: Teil 1 des Schlusspanels sei nie leer, weil das Dienstsiegel deterministisch bei Schicht 40 falle. `VORGANG_PUZZLE[0].frei` ist `rangDienstsiegel()` = `amt.bonusNachwachsen > 0`. `showJahresgespraech()` (`index.html:7761`) vergibt `JAHRES_BONI[3]` ausschließlich bei `amt.schichten === 40`. `vorgangZustellbar()` wird dagegen schon bei `amt.schichten >= 30` wahr. **Live nachgestellt** (Schichten 29/30/35/39/40/41, `amt.bonusNachwachsen` gespiegelt auf 0): ab Schicht 30 ist `zustellbar` wahr, `siegel` aber falsch — im gesamten Fenster 30 bis 39 zeigt Panel 2 die Trepp-Bleistift-Ersatzfassung.

**Warum es zählt.** Die Weltbibel hängt an Puzzleteil 1 den Kern-Callback des Finales („hat es nie benutzt"). Auf dem schnellsten legalen Weg sieht der Spieler diesen Callback nie. Die Aussage im Dokument verhindert, dass jemand die Lücke bemerkt.

**Korrekturkosten.** Entweder Text (Dokument und Kommentar) auf „kann im Akt IV leer sein, deshalb die Sonst-Fassung" ändern — null Codezeilen. Oder eine Zeile: `vorgangZustellbar` zusätzlich an `aktStand() >= 5` binden; das ändert dann die Abnahme „ab Schicht 30" und braucht eine Entscheidung.

**Stimmte nie.**

---

### GW11 · „Per Konstruktion unberührt" ist für Bramsche falsch (G5)

**Was.** `phase-anrede.md:96` begründet den Verzicht auf jede Ausnahmeabfrage damit, dass die beiden Sonderpfade `npcCycle()` „gar nicht erst erreichen". `npcSprechen()` (`index.html:4966`) enthält im Bramsche-Zweig: `if(rangSchluessel()){ bramscheFragen = 1; npcCycle(n, fig); }`. `rangSchluessel()` ist `rangGruppe() >= 3`, also ab Rang 11 = Schicht 55. Auf diesem Pfad ersetzt die Anredezeile die frühere Grundzeile — die Anrede greift also mitten im Sonderpfad. Zweitens beweist die Live-Zusage `phase-anrede.md:185` („Antwort, dann Abweisung, dann Anrede"), dass der Test unter Schicht 55 lief: im Schlüssel-Zweig gibt es **keine** Abweisung. Drittens ist auch der Lott/Pahl-Sonderpfad nicht unberührt — Fund A ändert ihn direkt, und das Dokument sagt das zwei Absätze vorher selbst.

**Warum es zählt.** Es ist die tragende Negativ-Zusage der Phase, per Grep in einer Zeile widerlegt, und sie widerspricht dem eigenen Dokument.

**Korrekturkosten.** Null für den Code — das Verhalten ist vertretbar. Nur die Begründung auf `phase-anrede.md:96` und im Codekommentar `index.html:7326` muss von „per Konstruktion" auf „bis auf den `rangSchluessel()`-Zweig" korrigiert werden.

**Stimmte nie** — `45912f6` zeigt denselben Zweig mit demselben Aufruf.

---

### GW12 · Eine Dorf-Figur anzusprechen schreibt in den Spielstand (G1)

**Was.** `phase-w3-dorf.md:628`: „`npcSprechen()` schreibt ausschließlich in die vorhandenen Blasenfelder des jeweiligen NPC-Objekts." Heute ruft `npcCycle()` als erste Anweisung `langAnsprechen(fig.key)` (`index.html:4935`), das über `langEreignis()` zu `saveKladde()` (`index.html:8366`) führt. Jeder `F`-Druck an einer Dorf-Figur kann seither persistenten Zustand schreiben. Der Kettenbeleg wurde zentral nachgeprüft.

**Warum es zählt.** Die wertvollste Negativ-Zusage der Phase, per Grep hart widerlegt. Wer W3 als reine Anzeigefunktion im Kopf hat, unterschätzt das Regressionsrisiko jeder Änderung an `npcCycle()` — dort hängt jetzt der Fortschritt von sieben Langvorgängen. Es ist zugleich der Grund, warum dieser Bericht keine Prüfung über `npcSprechen()` gefahren hat.

**Korrekturkosten.** Dokument, zwei Sätze. Kein Codeeingriff.

**Stimmt nicht mehr** — bei `3af7099` traf die Zusage exakt zu, W7 hat sie überholt.

---

### GW13 · `rangZeremonieBlock()` rendert bei Schicht 0 wörtlich `Knöterich: „undefined"` (G4, live bestätigt)

**Was.** `index.html:7153`: `const idx = Math.floor(amt.schichten/10) - 1;`, gefolgt von `idx < RANG_KNOETERICH.length ? RANG_KNOETERICH[idx] : …`. Bei `amt.schichten = 0` ist `idx = -1`, die Wächterbedingung ist erfüllt, `RANG_KNOETERICH[-1]` ist `undefined`. **Live reproduziert.** Heute im normalen Spiel unerreichbar, weil `nachSchicht()` erst nach dem `++` läuft — aber der Guard-Sweep beginnt bei `s = 10` und lässt genau diesen Wert aus, und der `text()`-Helfer prüft nicht auf `'undefined'`, obwohl `rangName()` an anderer Stelle genau diesen Schutz genießt.

**Warum es zählt.** Der einzige Ort im Paket, an dem eine Ausgabe strukturell kaputt sein kann, ist genau der, den der Guard auslässt.

**Korrekturkosten.** Eine Zeile: `idx >= 0 && idx < …`, oder den Sweep bei `s = 0` beginnen lassen.

**Stimmte nie.**

---

### GW14 · `knAssertCaps()` prüft den größten Sprechblasenkorpus des Spiels nur auf Länge (G7)

**Was.** `knAssertCaps()` (`index.html:3873`) wertet in seiner Schleife ausschließlich `txt.length > cap` aus. Kein Gedankenstrich-Regex, kein Emoji-Regex, keine `GEHEIM`-Liste. Damit ungeprüft: `HINWEISE`, `ESCALATE_DEFS`, `RANDNOTIZ`, `KN_TRAENKE_GAGS` und vor allem `DORF_FIGUREN` mit 346 Strings. Alle fünf anderen Text-Guards tragen alle drei Prüfungen.

**Warum es zählt.** Die Weltbibel nennt genau diesen Korpus zweimal namentlich als sperrvermerkrelevant, und `phase-w3-dorf.md:11` behauptet, die Zeilen seien „dreistufig gegen Sperrvermerk, Humor-Grundgesetz, Formregeln und Zeichendeckel geprüft". Maschinell abgesichert ist nur das letzte Viertel; die anderen drei Stufen hängen an einer einmaligen manuellen Prüfsession. Der Bestand ist sauber — unabhängig nachgerechnet: 0 `GEHEIM`-Treffer, 0 Gedankenstriche, 0 Emojis über alle 4437 String-Literale des Skripts. Es ist eine Guard-Lücke, kein aktueller Verstoß. Verschärft wird sie durch GW22: W5 hat drei dieser Zeilen umformuliert, und die Bedingung „solange kein Text umformuliert wird" ist damit gebrochen.

**Korrekturkosten.** Fünf Zeilen, wenn zugleich eine einzige Top-Level-`GEHEIM`-Konstante eingezogen wird (siehe GW20).

**Stimmte nie.**

---

### GW15 · Acht Guard-Prüfpunkte sind strukturell immer wahr (G2, G3, G4, G5)

**Was.** Zusammengefasst, weil es ein Muster ist und kein Einzelfall:

| Prüfpunkt | Ort | warum er nie feuern kann |
|---|---|---|
| „Zeremonie-Kopplung verletzt" | `rangAssert` 7258 | `s % 10 === 0 && s % 5 !== 0` ist für ganze Zahlen leer |
| Insignien-Schwellentest | `rangAssert` 7280 | vergleicht `rangZeichnungsbefugt()` mit seinem eigenen Rumpf; Sabotage beider Schwellen bleibt grün |
| `rangNameVon()`-Drift | `rangAssert` 7254 | `rangName()` **ist** definiert als `rangNameVon(rangStufe())` |
| Pommer liest den Antrag | `anredeAssert` 7457 | konstante Eingabe; jede Sprosse enthält `RAENGE[0].t` als Teilstring |
| Serien-Rücksprung | `vorgangAssert` 7657 | `aktStand()` ist monoton, ein Rücksprung ist arithmetisch unmöglich |
| Zustell-Kreuzprodukt | `vorgangAssert` 7705 | `A && B` mit bereits fixierten A und B ergibt zwangsläufig genau eine wahre Kombination |
| `if(!txt)` für gestrippte Blöcke | `vorgangAssert` 7617 | `strip()` ersetzt Tags durch Leerzeichen, die Literale sind nichtleer |
| alle neun `pruefePar` | `auftragAssertBrett` 7839-7916 | jedes prüft genau die Schranke, die sein eigenes `wuerfle` konstruktiv einhält |
| Idempotenz `dorffest` | `langAssert` 8484 | `langSchicht.dorffest` bleibt nach der Sweep-Schleife gesetzt |

**Warum es zählt.** Jeder dieser Punkte wird in einem Phasendokument als Beleg für eine Abnahmezusage geführt. Die Codebasis kennt das Problem und markiert es an einer Stelle sogar ausdrücklich („strukturell nie wahr, Beweis reicht") — an den übrigen nicht. Wo ein Dokument „vom Guard bewiesen" schreibt, steht in der Mehrzahl der Fälle eine Zeile, die nichts beweisen kann.

**Korrekturkosten.** Je Punkt drei bis fünf Zeilen, wenn echte Prüfungen gewünscht sind (konkrete Vorschläge unten). Null, wenn nur die Dokumente ehrlich werden.

**Stimmte nie**, durchgehend.

---

### GW16 · Die gesamte W5-Verdrahtung ist von keinem Guard erfasst (G3)

**Was.** `setzeKammerTueren()`s `t.adr`-Markierung, `findeAdresszeile()`, das Sonderschild in `drawKammerTuer()`, der garantierte Drop in `truheOeffnen()`, der `killMon()`-Kanal, das `AKT_ZUSTELLEN`-Angebot, der Grußpflicht-Fix und das Einfrieren in `zustellen()` — **kein einziger dieser Bezeichner kommt in `vorgangAssert()` vor.**

**Warum es zählt.** Die Abnahmezeilen `phase-w5-vorgang.md:212-215` (garantierter Drop, selbstheilendes Schild, vier Randbedingungen von „Zustellen", eingefrorener Kampf) stützen sich ausschließlich auf eine einmalige Konsolensitzung. Nach jedem späteren Umbau meldet sich nichts — und W7 hat `drawKammerTuer` und `renderBlaetter` seither bereits wieder angefasst.

**Korrekturkosten.** Ein neuer Guard-Block mit einer Attrappen-`kammerTueren`-Liste, der `t.adr` markiert und die Sonderschild-Bedingung durchrechnet: rund 20 Zeilen. Für `zustellen()` genügt eine Aussage über `state`.

**Stimmte nie.**

---

### GW17 · Der Anrede-Deckelsweep sieht vier von fünf Lisbeth-Varianten nie (G5)

**Was.** `anredeAssert()` (`index.html:7439`) läuft `for(let s = 0; s <= 5000; s += 5)`. `ANREDE.lisbeth` indiziert mit `amt.schichten % ANREDE_LISBETH.length`, Länge 5. `s % 5 === 0` ist immer wahr, der Index also **immer 0**. Acht Strings (`ANREDE_LISBETH[1..4]`, je z1 und z2) prüft weder dieser Guard noch `knAssertCaps()`, das die Tabelle gar nicht kennt. Nachgerechnet halten sie den Deckel (max 38/26), aber unbewacht.

**Warum es zählt.** `phase-anrede.md:149` verspricht einen „Deckelsweep über alle elf Formen". Schrittweite und Modulo müssten teilerfremd sein und sind es nicht.

**Korrekturkosten.** Winzig: `s += 1` für den Formen-Sweep, oder Lisbeth separat durchzählen.

**Stimmte nie.**

---

### GW18 · Die Sprossenleiter hat zwei tote Sprossen (G5, live bestätigt)

**Was.** `anredeFormen()` (`index.html:7343`) liefert nominell fünf Fassungen. Für `s <= 18` gilt `rangNameVon(s) === RAENGE[s].t === basis` — Sprosse 4 und 5 sind **derselbe String**, auf allen 19 benannten Rängen (live bestätigt: n=5, uniq=4; auf Rang 8 n=3, uniq=2). Sprosse 3 (`ANREDE_HERR + t`) ist unwählbar, solange Sprosse 2 (`t + '(in)'`) davorsteht. Effektiv drei wählbare Fassungen. Dazu sind alle acht `|| rangDef().t + …`-Rückfälle in `ANREDE` toter Code, weil `basis + '.'` mit 39 Zeichen unter jedem Deckel bleibt — lückenlos 0..5000: null Auslösungen.

**Warum es zählt.** Zahlenzusage plus Mechanikzusage. Der tote Zwirn-Rückfall ist zusätzlich semantisch falsch bestückt: `rangDef()` liefert den *eigenen* Rang, nicht `rangStufe()+1` — würde er je greifen, hörte die Schmeichelei stillschweigend auf. **Wichtige Einschränkung:** `basis` ist kein toter Code, sondern ab Rang 19 die **tragende** Sprosse — dort schiebt die römische Ziffer `t` über den Deckel, und `basis` rettet die Kette. Genau deshalb hält die Leiter über alle 81 gemessenen Ränge.

**Korrekturkosten.** Klein: `basis` nur für `s > letzt` in die Liste aufnehmen, Sprossenreihenfolge nach GW7 umstellen, im Dokument „fünf" auf die tatsächliche Zahl korrigieren.

**Stimmte nie.**

---

### GW19 · Das Rekord-Suffix ist als Nebenwirkung fast verschwunden, ungenannt und ungeprüft (G5)

**Was.** `index.html:4053`, im Phasendokument als „Rekord-Suffix unverändert" abgehakt. Die Grundzeile ist durch die Anrede länger geworden, ` Rekord N.` passt kaum noch unter 44. Nachgerechnet über die Schichten 0 bis 200: vorher sichtbar in **193** von 201 Schichten, jetzt in **30** (einstelliger Rekord) bzw. **10** (zweistellig).

**Warum es zählt.** Negativ-Zusage, die auf Codeebene stimmt und auf Wirkungsebene bricht. Sie steht weder unter „Bewusst offen für später" noch im Guard — obwohl W7 für die strukturgleiche Gießkannen-Zeile genau so einen Sichtbarkeits-Check nachgezogen hat.

**Korrekturkosten.** Klein: ein `rekordGesehen`-Prüfpunkt analog `warmGesehen`, plus eine Zeile unter „Bewusst offen".

**Stimmte nie** — der Einbruch entstand mit `6f77f68` selbst.

---

### GW20 · Fünf identische `GEHEIM`-Kopien statt einer Konstante (G7)

**Was.** Der Auftrag vermutete, die Listen seien nicht identisch und ließen eine Lücke. **Diese Vermutung trifft nicht zu.** Fünf Listen (`index.html:2804, 7217, 7614, 7958, 8431`), elf Einträge, gleiche Reihenfolge, nach Whitespace-Normalisierung byte-gleich — zentral nachgeprüft, alle fünf Zeilen normalisiert verglichen. Es gibt keine Differenz und damit keine differenzielle Lücke.

**Warum es zählt.** Der Befund ist ein Negativergebnis und gehört genau deshalb in den Bericht: eine Prüfannahme, die sich nicht bestätigt hat. Was bleibt, ist die Klasse: fünf Kopien sind fünf Gelegenheiten zu driften, und zwei Guards (`knAssertCaps`, `anredeAssert`) haben gar keine.

**Korrekturkosten.** Eine Top-Level-`const GEHEIM` vor `blaetterAssert()` einziehen, die fünf Kopien darauf umstellen. Danach kosten GW14 und der `anredeAssert`-Nachzug je eine Zeile.

**Überholt** — die Annahme war zu irgendeinem Zeitpunkt vielleicht richtig, am heutigen HEAD ist sie es nicht.

---

### GW21 · `#ovPanel`: „nie eine `id` darin" ist widerlegt (G7)

**Was.** `showLoading()` (`index.html:8989`) schreibt nach `#ovPanel` und setzt dabei `<p id="loadTxt" …>` (`index.html:8993`). Gelesen wird die id in `loadTick`. Das ist die achte und letzte Schreibstelle. Die Zahl acht stimmt; die Negativ-Zusage nicht. Zusätzlich nennt `phase-w6-rang.md:107` sieben Schreibstellen, obwohl `phase-w5-vorgang.md:180` die Erhöhung auf acht bereits dokumentiert hatte — W5 liegt vor W6.

**Warum es zählt.** Funktional harmlos (`loadTick` prüft `if(el)` und wird per `clearInterval` beendet, bevor das Panel neu geschrieben wird). Aber die Zusage ist absolut formuliert und wird von drei späteren Dokumenten zitiert; wer sich auf sie verlässt, prüft die falsche Menge.

**Korrekturkosten.** Ein Satz im Dokument. Ein Umbau der id wäre reines Risiko ohne Ertrag.

**Stimmte nie.**

---

### GW22 · Der W3-Textdrift steht in **zwei** Dokumenten, nicht in einem (G1)

**Was.** Der bekannte Drift ist verifiziert und exakt drei Zeilen, alle aus `45912f6`:

| | `figuren-dorf.md` | `index.html` |
|---|---|---|
| Lisbeth Akt IV | `Ich habe nur gefragt, wer lesen kann.` | `Fragen Sie Nörgel. Er kann das lesen.` (1760) |
| Lisbeth Akt V | `Vielleicht braucht er nur eine Antwort.` | `Ich komme mit. Ich habe ja gefragt.` (1761) |
| Nörgel Akt IV | `Niemand fragt mich. Jetzt fragen alle.` | `Gelesen und gezeichnet. Ich bin im Dienst.` (1794) |

Der Rest des Literals ist byteweise identisch mit dem W3-Stand; **weitere Textdrifts gibt es nicht** (maschinell in beide Richtungen gegengeprüft, alle 301 Strings). Neu ist: dieselben veralteten Zeilen stehen auch im Prüfdokument `phase-w3-dorf.md:171-172` und `:205`, das der Auftrag nicht als bekannt markiert hatte. `vorgangAssert()` verankert die drei neuen Zeilen — die Dokumente wissen davon nichts.

Damit gebrochen ist zugleich die Bedingung aus `phase-w3-dorf.md:645`: „keine inhaltliche Neuprüfung nötig, **solange kein Text umformuliert wird**". W5 hat umformuliert; eine Wiederholung der dreistufigen Prüfung ist nirgends dokumentiert. Die drei Zeilen wurden hier gegen `GEHEIM` und die Formregeln geprüft: sauber.

**Warum es zählt.** Wer den Drift nur in `figuren-dorf.md` nachzieht, lässt die zweite Kopie stehen und erzeugt in einem Jahr denselben Fund noch einmal.

**Korrekturkosten.** Sechs Zeilen in zwei Dateien plus je ein Verweis auf `phase-w5-vorgang.md`, plus ein Satz zur Neuprüfung.

**Stimmt nicht mehr** — `45912f6`.

---

### GW23 · Der Zeichendeckel-Nachweis in `figuren-dorf.md` deckt 84 Zeilen nicht ab (G1)

**Was.** `figuren-dorf.md:346`: „Die Werte stehen in Klammern hinter jeder Zeile oben, zur Kontrolle beim Einbau." Gezählt: 209 Zeilen tragen eine Klammerzahl (alle korrekt), **84 nicht** — sämtliche Lott/Pahl-Anlasszeilen sind als Fließtext ohne Zahl notiert. Derselbe Satz zählt zusätzlich falsch: „Lotts und Pahls je 21 Anlass-Zeilen" sind 21 *Paare*, also 42 Zeilen je Figur, 84 gesamt.

**Warum es zählt.** Es ist eine Abnahme-Zusage über eine durchgeführte Zählung, und die Zählung **kann** für 84 Zeilen nicht in der beschriebenen Form stattgefunden haben, weil das Ergebnis nicht notiert ist. Sachlich halten die Zeilen den Deckel (alle 84 nachgerechnet, Maxima 40/32) — die Behauptung über den Prüfvorgang hält nicht.

**Korrekturkosten.** 84 Klammerzahlen nachtragen (mechanisch, ein Skript) oder den Satz auf das ehrliche Maß korrigieren.

**Stimmte nie.**

---

### GW24 · `blaetterAssert()` ist als IIFE nicht nachprüfbar (zentral, live)

**Was.** `index.html:2798` ist `(function blaetterAssert(){…})()` — ein benannter Funktionsausdruck. Der Name existiert nur innerhalb des eigenen Rumpfs; es gibt keinen globalen Bezeichner. Die anderen sechs Guards sind Funktionsdeklarationen und beliebig oft aufrufbar; dieser läuft genau einmal beim Laden und lässt sich danach **nie wieder** aufrufen. Live bestätigt: `typeof window.blaetterAssert === 'undefined'`, während alle sechs anderen `'function'` liefern.

**Warum es zählt.** Der Auftrag verlangt ausdrücklich, den Rückgabewert der Guards direkt zu lesen, statt dem Konsolenpuffer zu trauen. Für sieben von acht ging das; für diesen nicht. Jede künftige Gegenprobe hat dasselbe Problem, und der Guard mit der **vollständigsten** Prüfdimension (Deckel, Gedankenstrich, Emoji, Sperrvermerk über 275 Strings) ist ausgerechnet der, den man nicht befragen kann.

**Korrekturkosten.** Winzig: `function blaetterAssert(){…}` deklarieren und darunter `blaetterAssert();` aufrufen — dasselbe Muster wie bei den übrigen sechs. Verhalten identisch.

**Stimmte nie.**

---

### GW25 · Zahlen- und Ankerdrifts über alle Dokumente (alle Pakete)

**Was.** Gesammelt, weil einzeln jeweils trivial, zusammen aber ein Vertrauensproblem:

| Behauptung | Fundort | tatsächlich |
|---|---|---|
| Anker „geprüft gegen Stand nach `3af7099`" | `phase-w4-brett.md:5` | `3af7099` enthält **0** W4-Bezeichner; alle Zeilenangaben treffen `06c3456` |
| „acht bestehende Fundstellen" | `phase-w4-brett.md:111` | 8 Ereignis*arten*, 9 Aufruf*stellen* |
| „drei Wächter" | `phase-w4-brett.md:161` | fünf |
| „`saveAmt()` nur an drei Stellen" | `phase-w4-brett.md:162` | vier |
| „drei Leser von `aktStand()`" | `phase-w5-vorgang.md:24` | heute neun (Eigenschaft hält weiter) |
| „sieben `#ovPanel`-Schreibstellen" | `phase-w6-rang.md:107` | acht, bereits vor W6 |
| „zwei Sitzungsvariablen" | `phase-w3-dorf.md:9` | drei |
| „vier Fundstellen `bramscheFragen`" | `phase-w7-langvorgaenge.md:142` | fünf |
| „alle sechs Guards" | `phase-w7-langvorgaenge.md:218` | sieben |
| „die letzten vier Ereignisarten kommen mit W7 dazu" | `index.html:8041` | drei; `schichtende` ist W4-Bestand |
| „Ränge 0/30/45/90" | `phase-w7-langvorgaenge.md:224` | das sind Schichten, nicht Ränge |
| „Kladde-Reiter" (4×) | `phase-w7-langvorgaenge.md:35,43,122,225` | Akten-/Blätter-Reiter |
| „jenseits Schicht 200" | `phase-anrede.md:88,173` | Schicht 1520 |
| „ab Schicht 90+ hingenommen" | `index.html:7451` | ebenfalls Schicht 1520 |
| „zwei Anläufe statt einem" | `index.html:4037` | drei, seit W7 |
| „längste Sprosse ohne Zähler ist 43" | `phase-anrede.md:142` | 44 (Stufen 16 und 25); Schluss hält trotzdem |
| „`schichtende` ganz am Anfang von `endShift()`" | `phase-w4-brett.md:137` | nach drei UI-Schließungen |
| „Schild und Beute lesen dasselbe Feld" | `index.html:4219` | seit W7 nicht mehr |

**Warum es zählt.** Nachzählbare Zahlen sind der billigste Vertrauensanker eines Phasendokuments. Der falsche Commit-Anker ist der schwerwiegendste Einzelpunkt: er ist die einzige Handhabe, mit der eine spätere Session „stimmte nie" von „stimmt nicht mehr" trennen kann.

**Korrekturkosten.** Je ein Wort oder eine Ziffer.

---

### GW26 · Kleinere Einzelbefunde

**GW26a · Die zwei Wahlsprüche aus 18.9 existieren nicht** (G4). `phase-w6-rang.md:11` nennt sie als eingebaut; `grep` über `index.html` liefert null Treffer, auch in `ad72e37`. `phase-w6-rang.md:129` behauptet das Gegenteil und deckt sich mit dem Code. Einzige Zusage im Paket, deren Gegenstand komplett fehlt. **Stimmte nie.**

**GW26b · `amt.auftraegeErfuellt` wird geschrieben, gespeichert, geladen und nie gelesen** (G7). Drei Vorkommen im ganzen File. Als Vorleistung für W5 gedacht, von W5, W6 und W7 nicht aufgegriffen. Durch GW1 zusätzlich inflationierbar. **Stimmt nicht mehr.**

**GW26c · `assertRigRegistrations()` sieht die drei gebackenen NPC-Sheets nicht** (G1). Der Guard läuft an Position 2 der Ladekette, `bakeAllNpcSheets()` erst an Position 5. `phase-w3-dorf.md:660` führt ihn als Beleg für genau diese drei Sheets an. Der Nachweis kann nur eine manuelle Konsolenabfrage gewesen sein. Behebbar mit einer Zeile: den Guard ein zweites Mal aufrufen, er ist idempotent und seiteneffektfrei. **Stimmte nie.**

**GW26d · Der Abspann bricht die Weltbibel-Reihenfolge** (G3). Weltbibel 387: „**Ganz zuletzt:** Trepps Nachfolgerin bringt einen Umschlag ins leere Amt." In `vorgangPanelHtml(3)` steht die Amtsmarsch-Zeile (`index.html:7581`) **nach** der Vorgang-2-Zeile (`index.html:7580`) und nimmt dem New-Game-Plus-Haken die Schlussposition. Zwei Zeilen tauschen. **Stimmte nie.**

**GW26e · Weltbibel-Änderungen ohne Deklaration** (G3). `45912f6` änderte `superduper-weltbibel.md` an drei Stellen; der Abschnitt „Korrektur zur Weltbibel" des Phasendokuments deklariert nur eine. Wo die Soll-Autorität im selben Commit an den Bau angepasst wird, kann sie den Bau nicht mehr widerlegen — genau dafür existiert der Abschnitt, und er muss vollständig sein. **Stimmte nie.**

**GW26f · `langSchicht.gutachter` hält seinen eigenen Kommentar nicht** (G7). Der Kommentar bei `index.html:8315` begründet den Merker damit, dass sonst „‚über mehrere Schichten' eine Behauptung" wäre. `langSchicht` ist Laufzeitzustand und überlebt keinen Reload, während `kladde.lang` persistiert — ein Reload gibt einen frischen Kammer-Slot. Der Nachbarstrang `dorffest` trägt für dieselbe Konstruktion einen Toleranzvermerk, `gutachter` nicht. `kam < 3` deckelt den Missbrauch auf drei Reloads. **Stimmte nie.**

**GW26g · `drawBubble()` alloziert doch pro Frame** (G1). Zwei `ctx.measureText()`-Aufrufe je sichtbarer Blase je Frame, jeder liefert ein frisches `TextMetrics`-Objekt. Vor W3 gab es eine Blase, seither bis zu zwölf gleichzeitig — also bis zu 24 Aufrufe je Frame statt 2. `phase-w3-dorf.md:646` nennt genau diesen Punkt als „alloziert nichts pro Frame". **Stimmte nie**, die Formulierung war schon bei `3af7099` unzutreffend.

**GW26h · Acht Bramsche-Fragetexte sind toter Datenbestand** (G1). `DORF_FIGUREN[bramsche].antworten[].frage` (`index.html:1715`) wird nirgends gelesen — weder gerendert noch capgeprüft. Der Spieler sieht die Antwort ohne die Frage, obwohl die Weltbibel Bramsche als Hinweisgeber mit „einer präzisen Frage pro Schicht" beschreibt. Entweder Kommentar („reine Herkunftsdokumentation") oder eine Ausgabe; die längste Frage hat 35 Zeichen und passte. **Stimmte nie.**

**GW26i · Kein Guard verwendet `try/finally`** (G5, projektweit). `anredeAssert()`, `rangAssert()`, `auftragAssertBrett()`, `langAssert()` und `vorgangAssert()` setzen Spiegel und stellen sie erst nach den Schleifen zurück. Wirft eine gerufene Funktion, bleiben die Spiegel korrumpiert — und weil alle auf Skriptebene laufen, nach `loadAmt()` und vor jedem Speichern, reißt das den Rest des Skripts mit. Eher Projektmuster als Phasenfehler. **Stimmte nie.**

**GW26j · Kein Fallback bei leerem Pool** (G2). `auftragWuerfeln()` (`index.html:7928`): bei `frei.length === 0` ergibt `rri(0,-1)` den Wert 0, `frei[0]` ist `undefined`, `def.wuerfle(…)` wirft beim Laden. Heute strukturell unmöglich, weil `bilanz` exklusiv in Pool 2 liegt. Ein `wenn`-Gate an `bilanz` machte daraus einen Ladefehler des ganzen Spiels. Eine Zeile. **Stimmte nie.**

**GW26k · Drei Aushangtypen haben keine harte Garantie** (G2). Die Portal-Garantie für `reise` greift nur bei `player.level >= 5`, was Spielergebnis und nicht Zusicherung ist; `beglaubigung/guete` verlangt einen Braugang mit `rar >= 2` ohne Reservierung; `bilanz` verlangt bis 1500 Gold ohne Garantie. `phase-w4-brett.md:158` formuliert „Nie unerfüllbar" pauschal — für drei von neun Typen ist es eine Wahrscheinlichkeitsaussage. **Stimmte nie.**

## Ungeprüft

| Punkt | Grund |
|---|---|
| Alles Optische: Sonderschild-Lesbarkeit bei 9px, Cull-Reserve, Fins Laufreihe bei 9 Spalten, sechs Frisuren im Ausweis-Lichtbild, Unterscheidbarkeit von Lott (h1) und Pahl (h4) | Rendering. Strukturell belegt ist jeweils, dass die Daten stimmen (`CF_HAIR` hat sechs Einträge inkl. `h5`, `cols` kommt aus der Bildbreite, acht verschiedene Sheets); ob es im Bild trägt, entscheidet nur der Blick. |
| Mobile Layouts (375×812), Scrollkasten `max-height:38vh`, 44-Pixel-Tap-Targets in Wirkung | Layout. Die CSS-Quellen sind belegt, die Wirkung ist nicht messbar ohne Gerät. |
| Audio: `MUS.swell()`/`MUS.muffle()` während der Zustellung, Regler-Stummschaltung | Nicht statisch prüfbar. Belegt ist nur, dass keine Takt-API angefasst wird. |
| Ob die in den Phasendokumenten behaupteten Live-Sitzungen stattgefunden haben | Keine Artefakte im Repo, keine Logs. Prüfbar war nur, ob die *Aussagen* mit dem Code vereinbar sind — dort, wo sie es nicht sind, steht ein Fund (GW7, GW8, GW10, GW11, GW13, GW23). Nebenbefund: `.claude/launch.json` mit Port 8378 entstand erst mit `a048e5b`, also **nach** W5, W6, Anrede und W7; alle vier berufen sich auf „Port 8378". `serve.py` nimmt den Port als Argument, ein Ad-hoc-Start war also möglich — die Angabe ist plausibel, aber nicht belegt. |
| „Node-Syntaxcheck nach jedem Bauschritt" | Nicht rekonstruierbar ohne Zwischencommits. Der heutige Stand parst (`node --check` über den extrahierten Skriptblock: grün). |
| Guard-Laufzeit „unter einer Millisekunde" (`phase-w4-brett.md:107`) | Nicht gemessen. Die Größenordnung (≈7300 `text()`-Aufrufe × 13 Scans plus 2440 `auftragWuerfeln()`) spricht dagegen, aber das ist Schätzung, kein Beleg. |
| Balance: ob 1500 Gold (`bilanz`, Akt V) oder `sammlung` mit `ziel 7` in einer Schicht realistisch erreichbar sind; wie viel Gold pro Minute GW1 real trägt | Erfordert Spielläufe. Das Phasendokument erklärt die Lohn-/Zielstaffel selbst als ungeprüfte Setzung. |
| Sprachliche Qualität gegen Kapitel 13 (Humor-Grundgesetz) | Maschinell nicht prüfbar — genau darum ist GW-Fund zu `phase-w4-brett.md:3` vermerkt: der Guard kann es nicht, die Zusage behauptet es. |
| `blaetterAssert()` live | Nicht aufrufbar, siehe GW24. Statisch geprüft und grün. |
| Emojis außerhalb von Figurentexten (93 Treffer) | Weltbibel 497 beschränkt die Regel auf Figurentexte; alle 93 sind HUD-/Item-/Panel-Chrome. Bewusst nicht bewertet. |
| F1 bis F83 (`ABGLEICH-2026-07-27.md`), die 15 Funde aus `ZUSAGEN-BILANZ-2026-08-04.md` | Auftragsgemäß ausgenommen. `GEGENPROBE-2026-08-04.md:293` bestätigt, dass W3 bis W7 bisher keine unabhängige Gegenprobe hatten — die Funde oben überschneiden sich mit keinem. F75 (Vermutungen) und F52 wurden durch `06ad456` behoben und im Vorbeigehen berührt. |
| F19 Gold-Doppelbuchung, F20 Ausbaukosten, `LICENSE`, Kampf-Tod gegen Zustellen | Offene Entscheidungen, liegen bei Matthias. **Hinweis:** GW1 berührt dieselbe Ökonomie wie F19 und sollte zusammen mit ihr entschieden werden. |
| Kapitel 16 der Weltbibel | Bauverbote, keine Lücken. Nichts gemeldet. |

## Vorschlagsliste

Nichts davon wurde umgesetzt. Alles wartet auf Freigabe.

### Code ändern

**Zuerst — spielbare Wirkung**

1. **GW1, Doppelauszahlung sperren.** In `auftragZahle()` `a.bezahlt = true` setzen, in `startShift()` `auftragFertig = !!(amt.auftrag && amt.auftrag.bezahlt)`. Eine Zeile plus eine Bedingung, kein neues `amt`-Feld. Der einzige Fund mit direkter ökonomischer Wirkung.
2. **GW2, Mengen-Ziel deckeln.** `ziel: st===0 ? 4+stufe : Math.min(11, 9+stufe*2)`. Eine Zeile, keine Folgeänderung.
3. **GW3, `rangDef()` nach unten klemmen** und `loadAmt()` auf `Math.max(0, o.schichten|0)` festziehen. Zwei Zeilen. Verhindert, dass ein manipulierter Spielstand das gesamte Inline-Skript beim Laden zerreißt.
4. **GW4, `letzterAnlass` hinter den Gate ziehen.** Eine Zeile verschieben. Behebt den Lott/Pahl-Zyklus **und** den blockierten Hintermühl-Strang auf zwei Tonstellungen.
5. **GW5, drei `schichtModus`-Wächter in W4 nachziehen** (`auftragTypBevorzugen`, `auftragOrtBand`, Kammer-Garantieblock). Drei Zeilen, TDZ-neutral.
6. **GW6, zwei `schichtModus`-Wächter in W7 nachziehen** (`langFertig`, `langZusatz`). Zwei Zeilen.

**Danach — Guards, die tragen sollen, was ihnen zugeschrieben wird**

7. **GW20, eine einzige Top-Level-`const GEHEIM`** vor `blaetterAssert()`, die fünf Kopien darauf umstellen. Voraussetzung für 8 und 9, und beseitigt die Driftklasse dauerhaft.
8. **GW14, `knAssertCaps()` um Gedankenstrich, Emoji und Sperrvermerk erweitern.** Fünf Zeilen. Danach ist der größte Sprechblasenkorpus des Spiels maschinell abgesichert statt nur einmal manuell.
9. **`anredeAssert()` um die `GEHEIM`-Schleife ergänzen.** Eine Zeile, sobald 7 steht.
10. **GW15, echte Schwellenprüfung statt Tautologie** in `rangAssert()`: `if(rangZeichnungsbefugt() !== (s >= 30))` und `if(rangSchluessel() !== (s >= 55))`. Zwei Zeilen; macht die Abnahme belegt und zieht die W5-Nachreichung an ihren richtigen Ort.
11. **GW15, Kopplungsprüfung ersetzen:** statt der Teilbarkeits-Tautologie den tatsächlichen Übergang prüfen — `rangStufe(s) > rangStufe(s-1)` genau dann, wenn `s % 5 === 0`. Vier Zeilen.
12. **GW15/GW17, Sweeps härten:** `anredeAssert()` auf `s += 1` (behebt die Lisbeth-Lücke), `rangAssert()`-Zeremonie-Sweep bei `s = 0` beginnen (findet GW13), `langAssert()` mit `langSchicht = {}` vor dem Idempotenz-Check (macht Punkt 3 für `dorffest` erst zu einer Aussage).
13. **GW13, `idx`-Wächter in `rangZeremonieBlock()`.** Eine Zeile.
14. **GW16, Guard-Block für die W5-Verdrahtung:** Attrappen-`kammerTueren`, `t.adr` markieren, Sonderschild-Bedingung durchrechnen. Rund 20 Zeilen — der einzige Weg, die W5-Mechanik dauerhaft abzusichern.
15. **Vollständige Sollkonstante statt vier Ankern** in `rangAssert()`: 19 Tripel `[titel, g, v]`. Macht die Abnahme wiederholbar statt einmalig.
16. **GW24, `blaetterAssert()` als Funktionsdeklaration** statt IIFE. Verhalten identisch, aber der Guard wird nachprüfbar.
17. **GW26i, `try/finally` um alle Guard-Sweeps.** Projektweit, fünf Guards.
18. **Kleinteiliges:** `rekordGesehen`-Prüfpunkt analog `warmGesehen` (GW19); Fallback bei leerem Pool in `auftragWuerfeln()` (GW26j); `assertRigRegistrations()` ein zweites Mal nach `bakeAllNpcSheets()` (GW26c); `vorgangAdressAkt()` und `rangZeichnungsbefugt()` in `langAssert()` Punkt 4 ergänzen; `bestand()` in `langAssert()` mit realen Rohwerten speisen; Abspann-Zeilen tauschen (GW26d).

**Zur Entscheidung, nicht zur Reparatur**

19. **GW7, Sprossenreihenfolge umstellen** auf `[HERR+t+'(in)', HERR+t, t+'(in)', t]`. Bringt „Herr oder Frau" von 1 auf 7 Ränge im 44er-Kanal. Ändert den Klang des Spiels — das ist eine Entscheidung, keine Korrektur.
20. **GW8, Gießkannen-Suffix kürzen.** Nur wenn die einzige Belohnung des Strangs wirken soll.
21. **GW10, `vorgangZustellbar` an `aktStand() >= 5` binden.** Füllt Puzzleteil 1 im Regelfall, ändert aber die Abnahme „ab Schicht 30".
22. **GW26b, `amt.auftraegeErfuellt` streichen** — nur wenn entschieden ist, dass kein Bauabschnitt es mehr liest.

### Dokument ändern

**Zuerst — was spätere Prüfungen in die Irre führt**

1. **`phase-w4-brett.md:5`: Commit-Anker `3af7099` → `06c3456`.** Höchste Priorität: davon hängt jede weitere Nachprüfung des Pakets ab.
2. **`phase-w3-dorf.md:171-172, 205` und `figuren-dorf.md:130-131, 180`:** die drei W5-Aktzeilen nachziehen, mit Verweis auf `phase-w5-vorgang.md` und den Anker in `vorgangAssert()`, plus den Neuprüfungsvermerk (GW22).
3. **`phase-w6-rang.md:107`:** „sieben" → „acht", und die id-Zusage auf „keine `id` in den sieben Erzähl-Schreibstellen; `showLoading()` trägt `#loadTxt`" präzisieren. Die Zeile trägt zwei Fehler und wird von drei späteren Dokumenten zitiert (GW21, GW25).
4. **`phase-w5-vorgang.md:200`:** „`killMon()` und die bestehende Siegweiche" → „Die bestehende Siegweiche in `killMon()`"; gleichlautend der Codekommentar (GW9).
5. **`phase-anrede.md:96`** und Codekommentar: „per Konstruktion unberührt" durch die tatsächliche Lage ersetzen — Bramsche läuft ab Schicht 55 durch `npcCycle()` (GW11).

**Danach — Guard-Zuschreibungen ehrlich machen**

6. Überall dort, wo „vom Guard bewiesen" steht und GW15 gilt, das Wort streichen oder den Prüfpunkt als Anker statt als Beweis kennzeichnen: `phase-w6-rang.md:94,116,117`, `phase-w5-vorgang.md:194,209`, `phase-w4-brett.md:3,107,158,160`, `phase-anrede.md:36,149,150,167`, `phase-w7-langvorgaenge.md:161,169`. Dazu der Codekommentar `index.html:7951`.
7. **`phase-w7-langvorgaenge.md:144`:** `langAssert()` → `anredeAssert()`; **`:210`:** die tatsächliche Rangliste (sichtbar auf 3, 6, 9, 11, 12, 13, 15) statt „Rang 0 und ab Rang 18"; **`:165`:** die zwei ungewächterten Funktionen ausweisen (GW6, GW8).
8. **`phase-w4-brett.md:158,161`:** „Nie unerfüllbar" auf die Weltbibel-Formulierung zurückführen und die drei Typen ohne harte Garantie benennen; „drei Wächter" auf fünf und die drei ungeschützten Welteingriffe (GW2, GW5, GW26k).
9. **`phase-w5-vorgang.md:186`** und Codekommentar `index.html:7539`: „faktisch nie leer" durch die tatsächliche Lage ersetzen — im Fenster Schicht 30 bis 39 greift die Sonst-Fassung (GW10).
10. **`phase-w3-dorf.md`:** ein Absatz „Was seit W3 nachgezogen wurde" am Dokumentende — `npcCycle()`-Vorlauf, Anrede als Schritt 0, `bramscheFragen` als Zähler, `letzterAnlass`-Verbrauch, dritte Sitzungsvariable, `saveKladde()`-Nebeneffekt. Billiger und ehrlicher als das Umschreiben der Blöcke (GW12 und die elf „überholt"-Verdikte des Pakets).
11. **`phase-anrede.md`:** analoger Nachtragsabsatz „Was W7 verändert hat" — dritter Anlauf in `knBegruessungLine()`, verschobener Selbstaufruf, dritter Spiegel `kladde.lang`, `langZusatz()` bei Nörgel.
12. **`figuren-dorf.md:346`:** 209 von 293 Zeilen tragen Klammerwerte; „je 21 Anlass-Zeilen" → „je 21 Zeilenpaare (42 Zeilen)" (GW23). **`:9`:** Kapitel-13-Zitat vervollständigen und Lotts zwei Dreisatz-Zeilen als bewusste Sprachmarke notieren.
13. **`phase-w6-rang.md:11`:** die Wahlspruch-Zusage streichen (oder die zwei Zeilen einbauen — dann wandert der Punkt zu „Code ändern"); beseitigt zugleich den Widerspruch zu `:129` (GW26a).
14. **`phase-w5-vorgang.md`, Abschnitt „Korrektur zur Weltbibel":** um die beiden undeklarierten Weltbibel-Umschriften erweitern (GW26e).
15. **Restliche Zahlen aus GW25** einzeln nachziehen. Je ein Wort.
16. **Unter „Bewusst offen für später" ergänzen:** Rekord-Suffix-Sichtbarkeit (GW19), Rangstufe 0 bei der Anrede-Vollform, die fehlende Akt-III-Eskalation der Nörgel-Bemerkung, `langSchicht.gutachter` über Reload (GW26f).
17. **`superduper-weltbibel.md:590`:** die drei neuen Ereignisarten korrekt benennen (`Ansprechen`, `Jahresbonus`, `Amtstube`).
18. **Codekommentare:** `index.html:4219` („Schild und Beute lesen dasselbe Feld") entkoppeln, `:8461` („reine Funktion") korrigieren, `:8041` auf drei neue Ereignisarten, `:4037` auf drei Anläufe, `:8315` mit Toleranzvermerk analog `dorffest`, `:1715` mit einem Wort zu den ungelesenen Fragetexten.

---

*Erstellt am 2026-08-05 gegen `c4a9d25`. Sieben unabhängige Prüfinstanzen, überlappungsfrei; Live-Teil zentral in einer Sitzung. Spielstand vor und nach der Prüfung byte-identisch. An Code, Plandokumenten und Phasendokumenten wurde nichts geändert.*
