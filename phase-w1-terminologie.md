## W1: Terminologie — Amtsdeutsch für Bestandstexte — ERLEDIGT

Umbau-Prompt zu Bauabschnitt W1 aus `superduper-weltbibel.md`, Kapitel 14, ergänzt um die konkreten Entscheidungen aus Kapitel 18 ("Der Spieltitel") und Kapitel 6 ("Bestiarium: die 21 Vorgangsarten"). Reine Textarbeit an bestehenden Strings, kein Systemeingriff, keine neue Persistenz, kein neuer Zeichenschritt. Ziel: das Spiel heißt fortan **Das Monstralministerium**, spricht aber im Volksmund weiterhin von „dem Amt" wie seit Phase 4.

Alle unten genannten Bezeichner und Zeilennummern wurden gegen den Stand nach Commit `770b089` geprüft. Zeilennummern verschieben sich beim Arbeiten, die Bezeichner nicht: such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.

### Grundsatz: was auf keinen Fall passiert

**Nichts umbenennen, was `amt` heißt.** `amt`, `AMT_KEY` (`index.html:2717`), `showDorf()`, das Amt-Panel und jeder bestehende Spielstring mit „Amt" bleiben exakt so. Der Volksmund sagt seit dreihundert Jahren Amt, das ist ab sofort kanonisch korrekt und kein Grund für einen Refactor. Kein Migrationspfad, kein Risiko an `AMT_KEY`. Wer hier versehentlich `amt` in `ministerium` umbenennt, bricht `localStorage`-Kompatibilität mit bestehenden Spielständen ohne jeden erzählerischen Gewinn.

**Nachtrag zu F58 (R5): eine Ausnahme, und nur diese eine.** Der Satz „jeder bestehende Spielstring mit ‚Amt' bleibt exakt so" galt buchstäblich auch für Knöterichs Vorstellung `Knöterich. Amt für Monsterangelegenheiten.` (drei Fundstellen, davon eine Handkopie in `knAssertCaps()`). Diese Zeichenkette ist aber gar keine Volksmundform, sondern eine Mischung aus Volksmundkopf und dem Schwanz der Vollbezeichnung, also eine vierte Namensform, die die Namenstabelle in Kapitel 18 nicht kennt. Der Schutzsatz oben meint die echten Volksmundstellen und die Codebezeichner, nicht eine Zwitterform. Seit R5 steht dort `Knöterich. Monstralministerium.`, also Form 1, die laut Weltbibel das Haus über sich selbst „immer" benutzt. `amt`, `AMT_KEY`, `showDorf()` und jeder echte Volksmundstring sind weiterhin unangetastet.

### Die drei Namen des Hauses

Aus Kapitel 18: alle drei Formen sind wahr und bleiben nebeneinander bestehen, keine ersetzt die andere.

| Form | Wortlaut | Wo |
|---|---|---|
| Titel und Kurzname | **Das Monstralministerium** (ein Wort, deutsche Zusammenschreibung) | Browser-Tab, Ladebildschirm, `CREDITS.md` |
| Vollständige Bezeichnung | **Ministerium für Monsterangelegenheiten** | `CREDITS.md`-Zweitzeile |
| Volksmund | **das Amt** | jeder bestehende Spielstring, unverändert |

Der Zeilenumbruch der Logofassung (`DAS MONSTRAL` / `MINISTERIUM`) ist reines Grafik-/Titelbild-Thema aus Kapitel 18 und nicht Teil von W1. Im HTML steht der Startbildschirm-`<h1>` einzeilig, aber **getrennt**: `DAS MONSTRAL MINISTERIUM`. Er zählt als gesetztes Logo, auch wenn er als Text gerendert wird. Ladebildschirm und Browser-Tab tragen die zusammengeschriebene Form. So zu F25 entschieden, maßgeblich ist die Weltbibel, Kapitel 18, Abschnitt „Was mitwandert", weil sie den Startbildschirm namentlich nennt.

### Startbildschirm (`showStartScreen()`, `index.html:5254`)

Aktuell:

```
<h1>SuperDuper Adventure</h1>
<h3>✨ Looten, leveln und Monster wegschellen!</h3>
<p>Drei Biome, versiegelte Kammern, ein Kessel. ...</p>
<button onclick="startGame()">LOSLEGEN</button>
```

Neu:

* `<h1>` wird zu `DAS MONSTRAL MINISTERIUM` (24 Zeichen, reiner Anzeigetext, kein Zeilenumbruch nötig).
* `<h3>` wird zu Untertitel 1 aus Kapitel 18: `Erledigen. Beglaubigen. Feierabend.` (35 Zeichen). Der bisherige Satz mit dem Glitzer-Emoji war laut Weltbibel „ein guter Platzhalter" und ist danach der letzte Text im Spiel, der zwinkert. Er entfällt komplett, nicht nur das Emoji.
* Der `<p>`-Anreißersatz bleibt **wortgleich**. Er nennt bereits die Angriffseingabe und ist laut Weltbibel „gut". Nicht anfassen.
* Der Button-Text wird von `LOSLEGEN` zu `Dienst antreten`. `onclick="startGame()"` bleibt unverändert, das ist reine Textarbeit.

### Browser-Tab und Dateien

* `<title>` in `index.html:6`: `SuperDuper Adventure` → `Das Monstralministerium`.
* `CREDITS.md`: aktueller Titel `# Grafik-Credits` bleibt (Datei behält ihren Zweck), aber direkt darunter eine neue Zeile `Ministerium für Monsterangelegenheiten` als Zweitzeile ergänzen, wie in Kapitel 18 gefordert.
* Kein `README.md` vorhanden (nur `CREDITS.md`, `superduper-*.md` im Projektwurzelverzeichnis). Die Weltbibel-Anweisung „CREDITS.md und README bekommen ... Zweitzeile" betrifft also faktisch nur `CREDITS.md`. Keine neue README anlegen, das wäre Scope-Erweiterung über W1 hinaus.
* Repo-, Ordner- und Dateinamen (`adventure/`, `index.html`, `superduper-*.md`) bleiben ausdrücklich, wie sie sind. Der Titel ist eine Anzeigezeile, kein Umbenennungsauftrag.
* Favicon (Wappen aus Kapitel 17.9) ist ein Grafik-Asset, keine Textarbeit, und damit nicht Teil von W1.

### Zonen-HUD: amtliche Biom-Namen (`index.html:4465` bis `4468`)

Aktuell:

```js
setTxt('zone', (ty < 26 ? '📍 Frostkamm (Stufe ' + player.level + ')'
             : ty > 54 ? '📍 Aschewüste (Stufe ' + player.level + ')'
                       : '📍 Grasland (Stufe ' + player.level + ')') + schichtHudSuffix());
```

Jede Zeile bekommt zusätzlich die amtliche Bezeichnung aus Kapitel 12, in der Klammer neben der Stufe, mit `·` getrennt (Projektkonvention, keine Gedankenstriche in Spieltexten):

* Grasland → **Ablage A** (Wortlaut aus Kapitel 14, Beispiel „Grasland, Ablage A").
* Frostkamm → **Die Eisablage** (Titel aus der Serien-Tabelle in Kapitel 12).
* Aschewüste → **Der Brandabschnitt** (Titel aus der Serien-Tabelle in Kapitel 12, deckt sich mit dem bereits bestehenden Dienstauftrags-Beispiel „Rundgang Brandabschnitt" aus Kapitel 11).

Neu, als Muster für eine Zeile: `'📍 Grasland, Ablage A (Stufe ' + player.level + ')'`. Zeichendeckel gilt hier nicht (kein Dienstzettel-Kanal), trotzdem kurz halten, das HUD-Feld ist schmal.

### `#zone`-Initialtext (`index.html:329`)

`<div id="zone">📍 Grasland (Level 1)</div>` ist der Ladezustand vor dem ersten `updateHUD()`. Selbe Umbenennung hier nachziehen, sonst zeigt der allererste Frame vor dem ersten HUD-Update die alte Form. Kleinigkeit, aber sichtbar bei jedem Kaltstart.

### MONDEF: Vorgangsart-Feld (`index.html:2166`, `const MONDEF = {`)

Jeder der 21 bestehenden Einträge bekommt ein neues Feld `art`, wörtlich aus der Tabelle in Kapitel 6 der Weltbibel übernommen, **ohne** die Spielnamen (`name:`) anzufassen:

| MONDEF-Key | `art` |
|---|---|
| `slime` | Der Formfehler |
| `goblin` | Die Beschwerde |
| `greenmage` | Der Widerspruch |
| `crab` | Die Aktenklammer |
| `scorpion` | Die Nachforderung |
| `sandmage` | Die Verfügung |
| `ghost` | Der ruhende Antrag |
| `frostgolem` | Die Sammelakte auf Eis |
| `frostmage` | Die Rückfrage |
| `spider` | Der Querverweis |
| `bat` | Der Umlauf |
| `mage` | Die Fußnote |
| `shadow` | Der gelöschte Eintrag |
| `demon` | Die Mahnung |
| `shadowghost` | Das Erinnerungsschreiben |
| `shadowmage` | Die Vorladung |
| `mummy` | Die versiegelte Akte |
| `golem` | Die Bestandskraft |
| `stalfos` | Die Dienstvorschrift |
| `bossgeneric` | Der Sammelvorgang |
| `boss` | Fürst Nachtrag |

**Wo `art` laut W1 sichtbar wird, und wo ausdrücklich nicht:** nur Bossleiste und Dienstbericht. Registratur, Kammerschilder und Knöterichs Wortwahl (die anderen drei Orte aus Kapitel 6) sind spätere Bauabschnitte, hier nicht anfassen.

* **Bossleiste** (`index.html:4585`, `setTxt('bossname', boss.def.name);`): wird zu `setTxt('bossname', boss.def.name + ' · ' + boss.def.art);`. Ergibt zum Beispiel „Schattenfürst · Fürst Nachtrag". Kein Gedankenstrich, Interpunkt wie im Dienstbericht.
* **Dienstbericht-Killliste** (`index.html:5434`): aktuell `${MONDEF[t] ? MONDEF[t].name : t}: ${shiftKillsByType[t]}`. Wird zu `${MONDEF[t] ? MONDEF[t].name + ' (' + MONDEF[t].art + ')' : t}: ${shiftKillsByType[t]}`. Bleibt eine reine Textänderung, die bestehende `killLines.join(' · ')`-Verkettung eine Zeile darunter bleibt unverändert.
* Nirgends sonst lesen. `MONDEF[t].art` an weiteren Stellen zu referenzieren wäre eine Vorwegnahme von W2/W3 und nicht Teil dieses Umbaus.

### Kammertür-Hinweise: Schild wird Gebührenbescheid

Drei Fundstellen, alle drei betreffen dieselben zwei Hinweise und müssen **zusammen** geändert werden, sonst laufen Objekt und Selbsttest auseinander:

1. `HINWEISE`-Tabelle, Eintrag `tuer1` (`index.html:2782`): `z1:'Schild lesen. Steht alles dran.'` → `z1:'Gebührenbescheid lesen. Steht alles drauf.'` (42 Zeichen, Zeichendeckel 48 eingehalten). `z2` und `z2t` bleiben unverändert.
2. `knStuckCandidate()`, Zweig `stuck_kammer` (`index.html:2918`): `z2` von `'Schild lesen. F.'` (Desktop) zu `'Gebührenbescheid. F.'` (20 Zeichen, Deckel 32). `z1` und die Touch-Fassung `z2t:'Die Hand im Gürtel.'` bleiben unverändert, sie enthalten das Wort „Schild" nicht.
3. **Die parallele Zeichendeckel-Prüfliste** (`index.html:2866`, der `rows.push`-Block für `stuck_kammer`): `rows.push(['Da draußen stehen verschlossene Türen.',48],['Schild lesen. F.',32],['Die Hand im Gürtel.',32]);`. Diese Zeile ist eine **von Hand gepflegte Kopie**, kein Verweis auf das Objekt aus Punkt 2. Wird sie nicht mitgeändert, prüft die Startup-Assertion (`console.assert(ok, 'Knöterich: Zeichendeckel-Assertion ...')`, siehe Kommentar direkt darüber) weiterhin die alte Zeile und deckt eine künftige Längenüberschreitung der neuen Zeile nicht auf. Sie prüft dann etwas, das im Spiel gar nicht mehr vorkommt. Zweite Zeile also auf `['Gebührenbescheid. F.',32]` ändern.

### Dienstbericht-Bemerkungen auf Nörgels Stimme (`DIENST_BEMERKUNGEN`, `index.html:5329`)

Aktueller Stand:

```
'Akte geschlossen. Nächste bitte.',
'Der Vorgang wurde ordnungsgemäß beendet.',
'Überstunden werden nicht vergütet, nur vermerkt.',
'Die Ausrüstung bleibt Eigentum des Amtes.',
'Wiedervorlage: nächste Schicht.',
'Kein Kommentar. Nur Zahlen.',
```

Diese sechs Zeilen sind bereits nah an Nörgels Ton (trocken, Verfahren statt Pointe, Humor-Grundgesetz 2 und 3 aus Kapitel 13). Für W1 genügt Vereinheitlichung, keine Neuerfindung:

* Zeile 4 („Die Ausrüstung bleibt Eigentum des Amtes.") ist die einzige, die eine Tatsachenbehauptung ohne Verfahrensbezug macht. Umformulieren zu `'Ausrüstung verbleibt aktenkundig beim Amt.'`, das hält den Amtsdeutsch-Ton der übrigen fünf Zeilen durch.
* Die übrigen fünf Zeilen unverändert übernehmen, sie brauchen keine Überarbeitung.
* Keine Zeile ergänzen oder streichen. Die Liste wird zufällig gezogen (`index.html:5435`), ihre Länge ist an keiner Stelle vorausgesetzt.

### Was in W1 ausdrücklich nicht angefasst wird

* Der Bürgermeister-Text in `showJahresgespraech()` (`index.html:5470`ff.) und alle Figurennamen aus Kapitel 8/9 der Weltbibel (Zwirn, Bramsche, Nörgel, Trepp, Sturz, Lisbeth, Zapf, Lott, Pahl). Das ist Bauabschnitt **W3**, nicht W1.
* ~~Kammerschild als sichtbares HUD-Element mit Stufenanzeige an der Tür selbst gibt es im Code nicht, nur die beiden Hinweistexte oben. W1 rührt nur an diesen Texten, baut kein neues Anzeigeelement.~~ **Falsche Prämisse, korrigiert zu F24 in R5.** Der Satz bleibt als Protokoll stehen, gilt aber nicht. Das Kammerschild gibt es sehr wohl: `drawKammerTuer()` (`index.html`, such nach `function drawKammerTuer`) malt vor jeder Tür eine 68 mal 34 Pixel große Holztafel mit der Kopfzeile `'KAMMER'`, darunter die Balkenanzeige der Stufe und den `RARITY`-Namen, im geleerten Zustand stattdessen `geleert` und die Restzeit. Der Auftrag „Kammerschild heißt Gebührenbescheid" aus Kapitel 14 der Weltbibel war also erfüllbar und wurde nicht mangels Anzeigeelement gestrichen, sondern weil beim Schreiben dieser Zeile nur nach Hinweistexten gesucht wurde und nicht im Zeichenpfad. Folge: der Spieler las nach W1 zwei Namen für dasselbe Ding im selben Moment, Knöterichs „Gebührenbescheid lesen." neben der Tafel mit der Aufschrift KAMMER. Die Tafel trägt seit R5 zweizeilig `GEBÜHREN-` / `BESCHEID`, der Kasten ist dafür von 34 auf 45 Pixel nach oben gewachsen (einzeilig wäre das Wort bei 9px Courier New 86px breit und damit 20px zu breit für die 66px Innenbreite). Der Rest des Absatzes (kein neues Anzeigeelement bauen) bleibt richtig.
* `Registratur`, Aktenfunde und alles aus W2 (Kapitel 12, siehe `blaetter-serie-a-b.md`).
* Favicon, Logo-Bild, Titelbild-Typografie mit Zeilenumbruch: Grafikarbeit, nicht Teil dieses Textumbaus.

### Abnahme W1

* `<title>`, Ladebildschirm-`<h1>` (`showLoading()`), Startbildschirm-`<h1>`, Startbildschirm-`<h3>` und Startknopf zeigen die neuen Texte, der Anreißersatz ist wortgleich zum Bestand.
* `#zone`-Initialtext und alle drei `updateHUD()`-Zweige zeigen die amtliche Zusatzbezeichnung, Stufenanzeige funktioniert unverändert.
* Jeder der 21 `MONDEF`-Einträge trägt ein `art`-Feld, Wortlaut deckungsgleich mit Kapitel 6. Kein `name`-Feld wurde verändert.
* Bossleiste zeigt Name und Vorgangsart getrennt durch `·`, kein Gedankenstrich.
* Dienstbericht-Killliste zeigt Vorgangsart in Klammern, `killLines.join(' · ')` weiterhin unverändert und ohne Zeilenumbruchfehler.
* Beide Kammertür-Hinweise sagen Gebührenbescheid statt Schild, an allen drei Fundstellen synchron, inklusive der handgepflegten Zeichendeckel-Prüfliste. Zeichendeckel-Assertion läuft beim Start grün.
* `DIENST_BEMERKUNGEN` hat weiterhin sechs Einträge, alle im selben Amtsdeutsch-Register.
* `amt`, `AMT_KEY`, `showDorf()` und jeder bestehende „Amt"-String sind unverändert. Ein bestehender Spielstand lädt nach dem Umbau ohne Fehler oder Datenverlust.
* `CREDITS.md` trägt die neue Zweitzeile, keine neue README wurde angelegt, keine Datei umbenannt.

### Umsetzungsnotizen aus W1

Gebaut: `<title>`, Startbildschirm (`<h1>`, `<h3>`, Button), `#zone`-Initialtext und alle drei `updateHUD()`-Zweige, alle 21 `MONDEF.art`-Felder, Bossleiste, Dienstbericht-Killliste, beide Kammertür-Hinweise inkl. der handgepflegten Zeichendeckel-Prüfliste, eine `DIENST_BEMERKUNGEN`-Zeile, `CREDITS.md`-Zweitzeile.

Bewusst weggelassen: der statische Platzhaltertext `Schattenfürst Abaddon` im `#bossname`-Span (`index.html:328`, im HTML-Grundgerüst vor dem ersten `updateHUD()`-Lauf). W1 nennt nur die drei `#zone`-Stellen als Ladezustand-Fall, dieser Span steht nicht in der Abnahme-Liste und wird ohnehin sofort von `setTxt('bossname', ...)` überschrieben, sobald ein Boss aggro wird — kein sichtbarer Kaltstart-Fehler wie bei `#zone`, da `#bossbar` bis dahin `display:none` ist.

Falle für spätere Arbeiten: `art` ist jetzt ein Feldname in zwei völlig verschiedenen Strukturen — `MONDEF[type].art` (Vorgangsart, neu aus W1) und `HINWEISE[i].art` (Hinweis-Kategorie `'zustand'`/`'ereignis'`, bestand schon vorher). Beim Grep nach `art:` beide Treffergruppen auseinanderhalten, sonst verwechselt man Klasse mit Ministerialbegriff.

Alle Abnahme-Punkte geprüft: `node -e "new Function(...)"` auf den `<script>`-Inhalt lief fehlerfrei, Zeichendeckel für die beiden neuen Hinweistexte manuell nachgezählt (42/48, 20/32), `amt`/`AMT_KEY`/`showDorf()` nicht angefasst.

**Nachtrag zur Abnahme (F83).** Die Liste oben war nach Fundstellen im Code sortiert, nicht danach, was der Spieler sieht. `showLoading()` stand in keiner der aufgezählten Fundstellen und zeigte deshalb nach `a67c9c3` weiter „SuperDuper Adventure", aufgefallen erst auf der Pages-Seite und nachgezogen mit `5d7c0b4`. Der Satz „Alle Abnahme-Punkte geprüft" war also wahr und trotzdem unvollständig, weil die Liste selbst eine Lücke hatte. **Künftige Textabnahmen laufen deshalb über die sichtbaren Bildschirme, nicht über Codestellen.** Es sind acht: Ladebildschirm (`showLoading()`), Startbildschirm (`showStartScreen()`), Todesbildschirm (`showDead()`), Siegesbildschirm (`winGame()`), Dienstbericht (das `#overlay` aus `endShift()`), Jahresgespräch (`showJahresgespraech()`), Dorf (`showDorf()`) und Amtsstube (`renderAmtFenster()`). Derselbe Mechanismus hat F24 durchrutschen lassen.
