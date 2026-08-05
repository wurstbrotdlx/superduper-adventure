## W4: Schwarzes Brett — Dienstaufträge, drei je Schicht, einer wählbar — ERLEDIGT

Umbau-Prompt zu Bauabschnitt W4 aus `superduper-weltbibel.md`, Kapitel 11 ("Dienstaufträge: der Schichtinhalt") und Kapitel 14. Anders als bei W2/W3 gab es keine fertige Inhaltslieferung: Kapitel 11 liefert einen Baukasten aus neun Auftragstypen mit Musterformulierungen, keine ausformulierten Sätze. Die Texte in `AUFTRAG_TYPEN` unten sind diese Phase selbst, gegen Sperrvermerk, Formregeln und Zeichendeckel geprüft über `auftragAssertBrett()` (Abschnitt „Der Guard" unten), nicht in einer separaten Prüfsession. *(Korrektur GW: das Humor-Grundgesetz aus Kapitel 13 prüft der Guard **nicht** — es ist maschinell nicht prüfbar. Diese Stufe ist Handlesung geblieben.)*

Alle unten genannten Bezeichner und Zeilennummern wurden gegen den Stand nach Commit `06c3456` geprüft. Zeilennummern verschieben sich beim Arbeiten, die Bezeichner nicht: such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.

### Grundsatz: was diese Phase nicht ist

Kein neues Panel, kein neuer `localStorage`-Schlüssel, kein neuer Reitermechanismus, keine zweite Währung, kein Questmarker auf der Minimap. Die Weltbibel schreibt „Vierter Reiter im Amt-Panel", aber ein Reiter existiert im ganzen Projekt nur am Kessel (`switchKesselTab()`, W2). Das Amt hat zwei reiterlose Flächen: `showDorf()` (zwischen den Schichten) und `#amtFenster`/`renderAmtFenster()` (in der Welt, F-Taste). Entscheidung dieser Phase (mit Matthias abgestimmt): Auswahl als vierte gestapelte Sektion in `showDorf()`, laufender Auftrag und Fortschritt in `renderAmtFenster()`. Drei Pools mit neun Typen, ein Trichter statt neun verstreuter Zähler, drei neue `amt`-Felder — mehr Systemeingriff als W2/W3, aber ausschließlich Verdrahtung auf Bestehendes (`shiftKillsByType`, `player.pouch`, `player.gold`, `placeMonsters()`, `setzeKammerTueren()`).

**Sperrvermerk, unverändert aus Kapitel 7 und 12:** kein Aushangtext erklärt oder deutet an, wie die Beglaubigung im Kessel rechnet. Zwei der neun Typen liegen nah an der Linie: „Sammlung" nennt eine Zutatenart (Substantiv=Slot-Nähe), „Beglaubigung" nennt eine Auflage (Fluch=Auflage-Nähe). Beide Texte stellen nur die Aufgabe, nie die Begründung. `auftragAssertBrett()` prüft das strukturell (nur zwei zulässige Beglaubigungs-Auflagen, `anzahl`/`guete`, beides reine Ergebniseigenschaften) und textuell (Begriffsliste gegen Kesselgrammatik-Wörter).

### Ein Befund vor dem Bau: die Oberwelt wächst nicht nach

`placeMonsters()` läuft genau einmal je Schicht (Aufrufer bei Skriptstart, in `respawnPlayer()` und in `startShift()`), der einzige laufende Spawner ist auf das Schattenland beschränkt. Bei rund 50 gesetzten Monstern und Dubletten im `BIOME_MOBS`-Roster ergeben sich für `crab`/`sandmage` nur etwa 3,5 Exemplare je Schicht. Ein Aushang „Erledigen Sie 8 Klippkrabben" wäre unerfüllbar gewesen, unbemerkt von jedem reinen Typfilter. Gleiches gilt für Kammertüren (P(keine Tür ≥ 5) = 26 % bei sechs Türen) und das Schattenportal (sicher erst ab Spielerstufe 11). Die Abnahmezusage „nie unerfüllbar" verlangt deshalb echte Reservierung in den bestehenden Setzschleifen, nicht nur einen Filter — siehe die drei Weltgarantien unten.

### Roster-Ableitung: `AUFTRAG_MOBS`/`AUFTRAG_BIOM`/`BIOM_AMT`, direkt hinter `BIOME_MOBS` (`index.html:2918`)

```js
const AUFTRAG_MOBS = [], AUFTRAG_BIOM = {};
for(const b in BIOME_MOBS) for(const t of BIOME_MOBS[b]){
  if(AUFTRAG_MOBS.indexOf(t) < 0){ AUFTRAG_MOBS.push(t); AUFTRAG_BIOM[t] = b; }
}
const BIOM_AMT = {
  snow:  {nom:'Die Eisablage',      dat:'in der Eisablage'},
  grass: {nom:'Ablage A',           dat:'in Ablage A'},
  sand:  {nom:'Der Brandabschnitt', dat:'im Brandabschnitt'},
};
```

Nie von Hand gepflegt: wer `BIOME_MOBS` ändert, ändert automatisch das Aushang-Roster mit. Ergebnis sind die neun überweltlichen Typen (`ghost, frostgolem, frostmage, slime, goblin, greenmage, crab, scorpion, sandmage`), live gegen `auftragAssertBrett()` bestätigt. Alle anderen `MONDEF`-Typen tragen `reserved:true` oder sind Kammer-/Schattenland-exklusiv und damit strukturell ausgeschlossen. `BIOM_AMT` übernimmt die W1-Namen wörtlich.

### Weltgarantie 1/3, Menge und Sammlung: `auftragTypBevorzugen()` in `placeMonsters()` (`index.html:2936`)

```js
function auftragTypBevorzugen(typ, biome){
  const a = amt.auftrag;
  if(!a || auftragSoll <= 0) return typ;
  if(a.typ !== 'menge' && a.typ !== 'sammlung') return typ;
  if(!BIOME_MOBS[biome] || BIOME_MOBS[biome].indexOf(a.par) < 0) return typ;
  auftragSoll--; return a.par;
}
function auftragOrtBand(){
  const a = amt.auftrag;
  if(!a || a.typ !== 'ort' || auftragOrtSoll <= 0) return null;
  return a.par === 'snow' ? [4,25] : a.par === 'sand' ? [55, MH-5] : [26,54];
}
```

Beide Funktionen TDZ-sicher: lesen nur `amt.auftrag` und `BIOME_MOBS`, nie `AUFTRAG_TYPEN` — `placeMonsters()` läuft schon beim Skriptstart, lange vor der Tabelle weiter unten im Skript. In der Setzschleife selbst (`placeMonsters()`) ersetzt `auftragOrtBand()` die freie `ty`-Wahl durch eine Bandwahl, sobald ein Ort-Aushang läuft, und `auftragTypBevorzugen()` lenkt die Typwahl an derselben Stelle, an der bisher zufällig aus dem Biom-Roster gezogen wurde. `auftragSoll`/`auftragOrtSoll` werden in `startShift()` vor `placeMonsters()` gesetzt (`ziel+2` für Menge, `ziel*3` für Sammlung — `dropZutat()` fällt nur bei einem Teil der Kills —, `ziel+3` für Ort), dort auch getestet: 15 erzwungene Läufe auf `crab` (natürlich ~3,5/Schicht) lieferten 10 bis 14 Treffer, jedes Mal über dem geforderten Ziel.

### Weltgarantie 2/3, Kammer: `wuerfleTuer(t, festDiff)` und Block am Ende von `setzeKammerTueren()`

```js
function wuerfleTuer(t, festDiff){
  t.diff = festDiff || rri(1, 5);
  ...
}
```

```js
  // am Ende von setzeKammerTueren()
  const auftragK = amt.auftrag;
  if(auftragK && auftragK.typ === 'kammer' && kammerTueren.length){
    let best = kammerTueren[0];
    for(const d of kammerTueren) if(d.diff > best.diff) best = d;
    if(best.diff < auftragK.ziel) wuerfleTuer(best, auftragK.ziel);
  }
```

`setzeKammerTueren()` läuft ebenfalls schon beim Skriptstart, deshalb auch hier nur `amt.auftrag` gelesen, keine Tabelle. 20 erzwungene Läufe mit Ziel 5 (natürlich nur 74 % Trefferchance über sechs Türen) lieferten 20-mal eine Tür mit `diff===5`.

### Weltgarantie 3/3, Reise: Portalchance

```js
    // W4: mit laufendem Reise-Aushang ist das Portal ab Stufe 5 garantiert.
    const chance = (player.level >= 11 || (amt.auftrag && amt.auftrag.typ === 'reise')) ? 1
                 : 0.05 + (player.level-5)*0.03;
```

Ohne diese Zeile wäre Reise der einzige Typ ohne harte Garantie (Portal sonst erst ab Stufe 11 sicher). Zusätzlich `wenn: () => aktStand() >= 2` in der Typtabelle: Reise wird erst ab Akt II angeboten, Schicht 1 bleibt Knöterichs Onboarding vorbehalten.

### Die Typtabelle: `AUFTRAG_TYPEN`, `AUFTRAG_POOLS`, `AUFTRAG_BEMERKUNGEN`, `auftragWuerfeln()` (`index.html:6614`–`6755`)

Drei Pools (billig/mittel/teuer), ein Aushang je Pool, drei verschiedene Typen und ein billig/mittel/teuer-Spektrum sind damit per Konstruktion garantiert:

```js
const AUFTRAG_POOLS = [
  ['menge','sammlung','verzicht'],
  ['ort','kammer','beglaubigung','verfahren'],
  ['bilanz','kammer','menge','reise'],
];
```

Neun Typen (`menge, ort, kammer, sammlung, beglaubigung, verzicht, verfahren, reise, bilanz`), jeder mit `wuerfle/titel/satz/stand`, optional `zaehle` (nur vier Typen brauchen einen eigenen Fortschrittswert, die übrigen fünf lesen `shiftKillsByType`, `player.pouch`, `player.gold` oder `shiftKillsTotal` direkt) und optional `bruch` (Verzicht/Verfahren). Zwei bewusste Abweichungen vom wörtlichen Weltbibel-Text:

* **Sammlung heißt „Führen Sie mit", nicht „Bringen Sie zurück".** `endShift()` kappt den Beutel auf ein kleines Kontingent (Grundwert 5). Ein „zurückbringen" mit größerem Ziel wäre von vornherein unerfüllbar gewesen.
* **Verzicht/Verfahren prüfen `shiftKillsTotal` bei `sofort:false`.** Ohne Mindestleistung wäre „Ohne Trank" durch sofortigen Feierabend erfüllbar gewesen, Lohn für null Arbeit.

Nörgels Amtsleitungs-Bemerkung (Kapitel 11: „Der letzte Satz erscheint absichtlich ab Schicht 1") liegt fest auf dem mittleren Aushang jedes Bretts (`bm: st===1 ? 2 : rri(...)` in `auftragWuerfeln()`). Lohn 150 bis 400 Gold, gestaffelt nach Pool-Index, `rri`-basiert (Regressionsfalle beachtet: nie `ri`/`R`, die aus dem gesiegelten Kartenstrom ziehen). `auftragMigration()` direkt hinter der Tabelle verwirft einen gespeicherten Aushang mit unbekanntem Typschlüssel, ohne selbst zu speichern.

### Der Guard: `auftragAssertBrett()` (`index.html:6757`), Bauform wie `knAssertCaps()`

Muss nach `aktStand()` stehen (weiter oben im Skript): der Guard ruft sich beim Laden sofort auf und würfelt dabei über alle Aktstände, ein `AUFTRAG_TYPEN`/`aktStand()`-Zugriff davor wäre ein TDZ-`ReferenceError`. Prüft in zwei Teilen:

* **Roster** — jeder der neun Typen hat einen `MONDEF`-Eintrag mit `.art`, ist nicht `reserved`/`boss`, hat einen `ZUTAT_NOUNS`-Eintrag, und spawnt in **genau einem** Biom (sonst wäre `AUFTRAG_BIOM` mehrdeutig).
* **61 Schichtstände × 40 Bretter** (2440 Läufe, `Math.random()`, keine DOM-Berührung, unter einer Millisekunde) — jedes Brett hat drei verschiedene Typen, Lohn in 150..400, `pruefePar()` erfüllt, Reise nicht vor Schicht 10, Amtsleitungs-Bemerkung auf dem mittleren Aushang, jeder Tabelleneintrag mindestens einmal gewürfelt (findet tote Einträge). Jeder erzeugte Titel/Satz/Bemerkung gegen Zeichendeckel 36/60/70 (aus `#overlay .panel{max-width:580px}`, **nicht** zu verwechseln mit Knöterichs 48/32/44 für Canvas-Sprechblasen), gegen `/[—–]/` (Gedankenstrich) und eine Emoji-Range, plus eine Begriffsliste gegen Kesselgrammatik-Wörter.

`amt.schichten` wird für die Simulation gespiegelt und danach exakt wiederhergestellt, kein `saveAmt()` währenddessen.

### Der Trichter: `auftragEreignis()` und acht bestehende Fundstellen (`index.html:6829`)

*(Korrektur GW: acht **Ereignisarten** an **neun** Aufrufstellen — `addZutat()` feuert auf beiden Return-Pfaden.)*

```js
function auftragEreignis(was, info){
  if(!CONFIG.schichtModus) return;
  const a = amt.auftrag;
  if(!a || auftragFertig || auftragVerletzt) return;
  const def = AUFTRAG_TYPEN[a.typ]; if(!def) return;
  if(def.bruch && def.bruch(a, was, info)){ auftragVerletzt = true; /* Floater */ return; }
  if(def.zaehle) auftragStand = def.zaehle(a, was, info);
  if(!def.sofort && was !== 'schichtende') return;
  if(def.stand(a) >= a.ziel) auftragZahle(a, was);
}
```

Kein Ereignis erhöht einen Zähler, der anderswo schon existiert — dort ist das Ereignis nur der Anlass, neu zu lesen. Damit ist Doppelzählung strukturell ausgeschlossen (`addZutat()` wird auch beim Zurücklegen aus dem Kessel gerufen; da Sammlung `player.pouch` direkt liest statt zu zählen, ist die Mehrfachauslösung folgenlos).

| `was` | Fundstelle | Warum genau dort |
|---|---|---|
| `kill` | `killMon()`, nach dem `shiftKillsByType`-Inkrement | davor würde Menge einen Kill zu spät zählen |
| `kammer` | `truheOeffnen()`, nach `k.geleert = true` | `k.diff` steht, Belohnung noch nicht ausgezahlt |
| `zutat` | `addZutat()`, beide Return-Pfade | für die sofortige Erfüllungs-Rückmeldung bei Sammlung |
| `kessel` | `brew()`, nach `kladde.crafts++` | `rar` ist zu diesem Zeitpunkt final berechnet |
| `trank` | `drinkPotion()`, nach `saveKn()` | alle Frühabbrüche (kein Trank, Fluch Nüchternheitsgebot) liegen davor |
| `zauber` | `castSpell()`, nach `player.spellCd = ...` | davor liegen Mana-/Leben-Frühabbrüche; ein gescheiterter Zauber darf Verfahren nicht brechen |
| `ablage` | `loadLevel2()`, letzte Zeile | Schattenland-Eintritt ist zu diesem Zeitpunkt vollzogen |
| `schichtende` | `endShift()`, ganz am Anfang über `auftragSchichtende()` | `player.gold` ist dort noch der volle Schichtstand, den Bilanz-Aufträge lesen |

### Auszahlung, Lebenszyklus, Oberfläche

`auftragZahle()` zahlt in `amt.bankGold`, nicht in `player.gold` — der Lohn wird dadurch vom 50-Prozent-Verwaltungskostenanteil in `endShift()` nicht angeschnitten. `auftragBrettSichern()` (Aufruf ganz am Anfang von `showDorf()`) würfelt nur, wenn noch kein Brett für die kommende Schicht hängt. Die vierte Sektion in `showDorf()` folgt dem `STARTFLUCH_WAHL`-Auswahlmuster (aktive Zeile über Inline-`background`, Knopf zeigt Lohn oder „ANGENOMMEN"), `waehleAuftrag(i)` folgt exakt der Form von `waehleStartFluch()`. `auftragFensterBlock()` in `renderAmtFenster()` zeigt Titel/Satz/Stand des laufenden Aushangs und einen Rückgabe-Link (`<span>`, kein `<button>`, weil `#amtFenster button{width:100%}` jeden Knopf sprengen würde). `endShift()` schreibt `amt.auftrag = null` unmittelbar vor dem bestehenden `saveAmt()`.

**Abbruch ohne Strafe**, dreifach: „Kein Aushang" im Dorf, „Aushang zurückgeben" in der Amtsstube, schlichtes Nichterfüllen. Kein Abzug, kein Fehlschlagzähler, keine Sperrschicht.

## Was in W4 ausdrücklich nicht angefasst wird

* Kein neues Panel, kein neuer Reitermechanismus, kein `localStorage`-Schlüssel außer den drei neuen `amt`-Feldern (die im bestehenden `sda_amt_v1` mitlaufen).
* Kein Dialogbaum, keine Antwortauswahl, kein Questmarker auf der Minimap, keine zweite Währung — die Verbotsliste aus Kapitel 14 gilt unverändert.
* Kein `amt.akt`-Feld, keine Ausfertigung, keine Kontextaktion „Zustellen", kein Rangsystem — das ist W5.
* Kein neuer Sound. `sfx.*` bleibt unverändert.
* Zapfs Kessel-Pflichtsatz bleibt weiterhin unverbaut (siehe W3), Pommer/Nörgel bekommen keine neue Dialogzeile über das Brett hinaus — die Bemerkungen sind reiner Aushangtext, keine Figurenrede über `npcSprechen()`.

## Abnahme W4

* Ein Auftrag pro Schicht: `auftragBrettSichern()` würfelt nur bei `brett.schicht !== amt.schichten`, `waehleAuftrag()` überschreibt statt anzuhängen, `endShift()` setzt `amt.auftrag = null`.
* Erfüllung eindeutig prüfbar: jeder Typ hat genau ein `stand(a)` gegen genau ein `a.ziel`, live in der Amtsstube sichtbar.
* Abbruch ohne Strafe: drei Wege, kein Abzug, kein Zähler, kein Sperrfenster (live geprüft).
* Nie unerfüllbar **im Sinne der Weltbibel** (kein Auftrag auf ein Monster, das im gewählten Biom nicht spawnt): die drei Weltgarantien sind live erzwungen, Roster- und Textprüfung laufen über `auftragAssertBrett()` bei jedem Laden. *(Korrektur GW2: die schärfere Lesart hielt nicht. `menge` verlangte ab Akt IV bis zu 17 Exemplare eines Typs, ein Biom trägt rund 15 bis 18 Spawns, und `auftragTypBevorzugen()` ersetzt nur den Typ, nie die Zahl. Das Ziel ist auf 11 gedeckelt. Drei Typen — `reise`, `beglaubigung`, `bilanz` — haben ohnehin keine harte Garantie, sondern eine Wahrscheinlichkeitsaussage.)*
* Sperrvermerk: Guard sperrt Kesselgrammatik-Begriffe strukturell und textuell, Beglaubigung kennt nur zwei zulässige Auflagen.
* Formregeln: Guard prüft Zeichendeckel, Gedankenstrich, Emoji auf jedem erzeugten Text.
* `CONFIG.schichtModus = false` bricht nichts: fünf Wächter (`auftragEreignis`, `auftragBrettSichern`, `auftragFensterBlock`, `auftragSchichtende`, `waehleAuftrag`) machen W4 inert. *(Korrektur GW5: es waren drei genannte, und drei Welteingriffe trugen gar keinen — `auftragTypBevorzugen()`, `auftragOrtBand()` und der Kammer-Garantieblock lasen `amt.auftrag` roh und lenkten Monstertyp, Monsterband und Türschwierigkeit auch im alten Modus. Nachgezogen.)*
* Regressionsschutz unverletzt: keine Allokation je Frame im Trichterpfad (`auftragEreignis` ist ein Tabellen-Lookup plus höchstens ein Feld-Update), `saveAmt()` nur bei Auszahlung/Auswahl/Rückgabe/Brettsicherung, nie im laufenden Trichter selbst. *(Korrektur GW: vier Stellen, nicht drei. Und seit W7 steht `langEreignis()` als erste Zeile in `auftragEreignis()` — die Allokationsaussage gilt nur noch für den W4-Anteil, `langEreignis()` iteriert die Strangtabelle und kann `saveKladde()` auslösen.)*
* Persistenz: Reload im Dorf hält Brett und Auswahl, Reload in der Schicht hält den Aushang, Fortschritt beginnt bei null (live geprüft, Abschnitt „Live geprüft").

## Bewusst offen für spätere Bauabschnitte

* **W5** (Der Vorgang) kann `amt.auftraegeErfuellt` als Erzählsignal lesen (z. B. für einen Absatz im Jahresgespräch), das ist hier nicht vorweggenommen.
* Die Balance der Lohnstaffel (150 bis 400 Gold) ist eine Setzung dieser Phase, keine aus dem Spiel abgeleitete Zahl — siehe „Ungeprüft" in `ZUSAGEN-BILANZ-2026-08-04.md` zur Bank-Balance insgesamt.
* Pommer/Nörgel könnten künftig auf einen erfüllten oder hinfälligen Aushang reagieren (über `letzterAnlass` wie in W3), hier nicht gebaut, um keinen achten Anlass in `knRandnotiz()` vorwegzunehmen.

## Live geprüft

Node-Syntaxcheck (`node --check`) über den extrahierten Skriptblock nach jedem Bauschritt, danach live im Browser (`python3 serve.py 8378`), Prüfungen per Konsole statt Durchspielen (`amt`/`auftrag*`-Manipulation), wie schon in der Zusagen-Bilanz-Session:

* Start, `auftragAssertBrett()` läuft beim Laden ohne Konsolenmeldung, manueller Aufruf liefert `true`. Neun Typschlüssel, neun `AUFTRAG_MOBS`-Einträge exakt wie erwartet.
* Erste Schicht: `amt.brett`/`amt.auftrag` bleiben `null`, kein Aushangblock — Schicht 1 bleibt Knöterichs Onboarding vorbehalten, wie geplant.
* Nach `endShift('amt')` → `nachSchicht()` → `showDorf()`: drei Aushänge, drei verschiedene Typen, mittlerer trägt „Bei Rückfragen wenden Sie sich an die Amtsleitung.", Lohnwerte innerhalb der Stufengrenzen.
* `waehleAuftrag(1)` markiert die Zeile (`ANGENOMMEN`, Zeilenhintergrund), Kopfzeile ergänzt „· Aushang angenommen".
* Kammergarantie: 20 erzwungene Läufe mit Ziel 5 (natürliche Trefferchance 74 %) liefern 20-mal eine Tür mit `diff===5`.
* Menge-Garantie: 15 erzwungene Läufe mit Ziel 8 auf `crab` (natürlich ~3,5/Schicht) liefern 10 bis 14 Treffer.
* Ort-Garantie: 10 erzwungene Läufe mit Ziel 8 auf `sand` liefern 19 bis 26 Treffer.
* Trichter, alle neun Typen einzeln durchgespielt: Kammer (Zahlung exakt `+lohn` auf `amt.bankGold`, `auftraegeErfuellt+1`, Floater „Aushang erfüllt · 300 Gold", zweites Ereignis zahlt nicht erneut), Verfahren (Zauber löst `auftragVerletzt` aus, Floater „Aushang hinfällig", kein Abzug, kein weiterer Fortschritt danach), Sammlung/Reise/Beglaubigung-Güte (je ein Ereignis genügt), Beglaubigung-Anzahl (zwei Ereignisse nötig, nach dem ersten korrekt noch nicht fertig), Menge/Ort/Verzicht/Bilanz über direkte Zustandsprüfung (`stand()` liest `shiftKillsByType`/`shiftKillsTotal`/`player.gold` korrekt).
* Amtsstube (`amtFensterOeffnen()`): zeigt Titel, Satz, „Stand: 3 von 6", Rückgabe-Link; `auftragZurueckgeben()` löscht den Aushang ohne Folgen.
* Dienstbericht: „Aushang: Vorgangslage Ablage A · offen, 3 von 6" erscheint korrekt vor der Beuteanteil-Zeile, keine leere Zeile, wenn kein Aushang lief.
* `CONFIG.schichtModus = false`: `auftragFensterBlock()` liefert `''` trotz gesetztem `amt.auftrag`, `auftragBrettSichern()`/`auftragEreignis()` greifen nicht.
* Persistenz: `saveAmt()` mit gesetztem Brett/Auftrag/Zähler, Seiten-Reload, alle Werte identisch wiederhergestellt.
* Konsole blieb über alle Prüfungen leer, keine einzige Exception.

---

## Nachtrag: bewusst offen gelassen

* **Die Akt-III-Eskalation der Amtsleitungs-Bemerkung fehlt.** Kapitel 11 der Weltbibel sagt: „Der letzte Satz erscheint absichtlich ab Schicht 1 und **wird ab Akt III unerträglich**." Gebaut ist nur die feste Platzierung auf dem mittleren Aushang; die Eskalation gibt es nicht. Das ist eine Lücke gegenüber Kapitel 11, keine übersehene Zusage dieses Dokuments — hier festgehalten, damit sie nicht ein zweites Mal als Fund auftaucht.
* **`amt.auftraegeErfuellt` ist unbenutzt geblieben.** Das Feld war als Erzählsignal für W5 gedacht. W5, W6 und W7 haben es nicht aufgegriffen; es wird geschrieben, gespeichert, geladen und nirgends gelesen. Entweder ein späterer Abschnitt greift es auf, oder es fällt weg — das ist eine offene Entscheidung, kein Fehler.

