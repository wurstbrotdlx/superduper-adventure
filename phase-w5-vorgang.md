## W5: Der Vorgang — ERLEDIGT

Umbau-Prompt zu Bauabschnitt W5 aus `superduper-weltbibel.md`, Kapitel 9 (Der Hauptvorgang, fünf Akte) und Kapitel 14. W5 war der letzte offene Bauabschnitt nach W1-W4 und W6 — Kapitel 14 nannte ihn zwischen W4 und W6, W6 wurde vorgezogen (siehe `phase-w6-rang.md`), weil `rangZeichnungsbefugt()` als reines Prädikat ohne Verbraucher gebaut werden konnte. W5 gibt ihm jetzt seinen Verbraucher.

Alle unten genannten Bezeichner und Zeilennummern wurden gegen den Stand nach Commit `ad72e37` geprüft, plus die Änderungen dieser Phase. Zeilennummern verschieben sich beim Arbeiten, die Bezeichner nicht: such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.

### Grundsatz: was diese Phase nicht ist

Kein neues `amt`-Feld, keine `loadAmt()`-Ladezeile. Der Aktstand bleibt **abgeleitet** über das bestehende `aktStand()` — dieselbe Doktrin wie beim Rang in W6. `phase-w3-dorf.md:652` hielt die Frage ausdrücklich für W5 offen; die Entscheidung fällt hier zugunsten der Ableitung, siehe „Korrektur zur Weltbibel" unten.

Kein Dialogbaum, keine Antwortauswahl, kein Gesprächssystem, keine Cutscene, keine Vertonung, keine Questmarker, keine zweite Währung. Der Kampf gegen den Schattenfürsten bleibt Zeile für Zeile unverändert — Zustellen ist ein Ausweg, keine Umschreibung. Die Anrede der Figuren (18.5) und die neun Langvorgänge aus Kapitel 10 bleiben bis auf den Mini-Strang zu Langvorgang 4 (siehe unten) ungebaut.

### Korrektur zur Weltbibel: der Aktstand bleibt abgeleitet

Weltbibel:554 verlangt „Aktstand als Zahl 1 bis 5 in `sda_amt_v1`, hochgezählt im bestehenden Jahresgespräch". Das bestehende `aktStand()` (siehe unten) leistet das bereits vollständig abgeleitet aus `amt.schichten`, exakt am Zehnerschritt. Ein zusätzliches `amt.akt`-Feld wäre eine zweite Wahrheitsquelle für denselben Wert — die Falle aus Fund F1, nur einen Bauabschnitt später wiederholt. Korrigiert wie die gleichlautende W6-Korrektur bei Weltbibel:563.

### Voraussetzung: `aktStand()` wandert nach oben (`index.html`, direkt unter dem `amt`-Literal)

```js
let amt = {bankGold:0, schichten:0, /* … */};
const aktStand = () => Math.min(5, Math.floor(amt.schichten / 10) + 1);
```

`aktStand()` stand bisher weit unten (Zeile ~6844 vor dieser Phase), `setzeKammerTueren()` läuft aber auf Skriptebene direkt nach seiner Deklaration (`setzeKammerTueren();` als Top-Level-Aufruf). Die W5-Adresskammer-Markierung braucht `aktStand()` genau dort — ein Zugriff am alten Ort wäre ein TDZ-`ReferenceError` gewesen, die teuerste Falle dieses Projekts. `aktStand()` liest ausschließlich `amt` und hat drei Leser (`npcCycle`, `AUFTRAG_TYPEN.reise.wenn`, `auftragWuerfeln`) — alle unterhalb der neuen Position, keiner beschattet sie. Am alten Ort steht ein Zeigerkommentar.

### Der Vorgangs-Bestand: `kladde.vorgang`, `ADRESS_ZEILEN`, `findeAdresszeile()` (direkt hinter `findeBlatt()`)

Bewusst getrennt von `BLAETTER`: `blaetterAssert()`s harter `!== 48`-Check und die Zählzeile „N von 48" (`renderBlaetter()`) bleiben dadurch unberührt.

```js
const ADRESS_ZEILEN = {
  1: {biome:'snow',  lines:[/* … */]},
  2: {biome:'grass', lines:[/* … */]},
  3: {biome:'sand',  lines:[/* … */]},
  4: {biome:null,    lines:[/* … */]},   // Ablage V, keine Kammer
};
const VORGANG_ANSCHRIFT = 'An Fürst Nachtrag, zu Händen, persönlich.';
function findeAdresszeile(id){ /* spiegelt findeBlatt() exakt */ }
const vorgangHat = id => !!kladde.vorgang[id];
const vorgangDreiZeilen = () => vorgangHat(1) && vorgangHat(2) && vorgangHat(3);
const vorgangAusfertigung = () => vorgangDreiZeilen() && vorgangHat(4);
```

Vier Bereiche (Kapitel 9, Akt IV) statt vier Kammer-Biomen: der Code hat nur drei Kammer-Biome (`snow`/`grass`/`sand`), Ablage V hat keine Kammern. Zeilen 1-3 liegen deshalb in je einer Sonderkammer, Zeile 4 fällt über den bestehenden Schattenland-Kill-Kanal — vier Bereiche bleiben real, kein neuer Mechanismus.

**Sperrvermerk-Falle beim Formulieren:** die naheliegende Wendung „Zusammengesetzt *ergibt* sie keinen Ort" enthält `ergibt`, ein Wort aus jeder GEHEIM-Liste des Projekts. Alle W5-Texte vermeiden es.

### Das Aktgatter: `SERIE_AKT`, `serieFrei()`, `vorgangAdressAkt()` (direkt hinter `saveAmt()`)

```js
const SERIE_AKT = {A:1, B:1, C:2, D:3, E:4, F:5};
const serieFrei = s => !CONFIG.schichtModus || aktStand() >= SERIE_AKT[s];
const vorgangAdressAkt = () => CONFIG.schichtModus && aktStand() >= 4;
```

Eine Wahrheitsquelle für beide Aktenfund-Fundwege und für den Guard. Der `!CONFIG.schichtModus`-Kurzschluss ist die wörtliche Abnahme: bei `schichtModus=false` steigt `amt.schichten` nie, ein Gatter wäre dort ein Dauerschloss. Live geprüft: alle sechs Serien bleiben unter `schichtModus=false` frei, unabhängig von `amt.schichten`.

### Die zwei Fundwege: `truheOeffnen()` und `killMon()`

Truhenpfad, eine Zeile im bestehenden Filterrumpf:

```js
if(!serieFrei(BLAETTER[id].serie)) return false;
```

Schattenlandpfad, die Kandidatenlisten kurzgeschlossen statt das Prädikat zu ändern:

```js
const kandF = serieFrei('F') ? BLAETTER_KEYS.filter(/* … */) : [];
const kandE = serieFrei('E') ? BLAETTER_KEYS.filter(/* … */) : [];
```

Wurfchancen und Reihenfolge (F vor E, eigene Chance) bleiben unverändert.

### Adresskammern: Markierung, Sonderschild, garantierter Drop, Wiederbetreten

Markierung am Ende von `setzeKammerTueren()`, nach der bestehenden W4-Kammergarantie:

```js
if(vorgangAdressAkt()){
  for(const id in ADRESS_ZEILEN){
    const z = ADRESS_ZEILEN[id];
    if(!z.biome || vorgangHat(id)) continue;
    const kand = kammerTueren.filter(t => t.biome === z.biome);
    if(kand.length) kand[Math.floor(Math.random() * kand.length)].adr = id;
  }
}
```

Nichts wird persistiert: `kammerTueren` wird bei jedem Aufruf geleert, `t.adr` entsteht bei jedem Schichtstart neu aus `kladde.vorgang`. `Math.random()`, nicht `ri()`/`R()` — der gesiegelte Weltgenerator-Strom darf hier nicht mitlaufen. Live geprüft (Schicht 30, drei Türpaare): genau eine Tür je Biom trägt `t.adr`, die zweite bleibt eine normale Kammer.

Sonderschild in `drawKammerTuer()`, nur die zwei Textzeilen verzweigen:

```js
const adrK = t.adr && !vorgangHat(t.adr);
if(adrK){ ctx.fillText('AKTEN-', t.x, t.y-79); ctx.fillText('ZEICHEN', t.x, t.y-70); }
else    { ctx.fillText('GEBÜHREN-', t.x, t.y-79); ctx.fillText('BESCHEID', t.x, t.y-70); }
```

Kasten, Cull-Reserve und Fallback-Zweig bleiben pixelgleich. `!vorgangHat(t.adr)` beantwortet das Wiederbetreten-Problem von selbst: nach dem Fund zeigt das Schild wieder `GEBÜHREN-/BESCHEID`, `findeAdresszeile()` liefert `false`, kein zweiter Floater. Selbstheilend, ohne Buchführung — live bestätigt (Tür nach Fund und Ablauf des Cooldowns erneut betreten).

Garantierter Drop in `truheOeffnen()`, unabhängig vom Aktenfund-Zufallswurf:

```js
if(k.tuer.adr && findeAdresszeile(k.tuer.adr)){
  floaters.push({txt:'+ Adresszeile', /* … */});
}
```

Vierte Zeile in `killMon()`, kein eigener Wurf, reiner Boolean-Kurzschluss sobald die drei Kammerzeilen im Bestand sind:

```js
if(vorgangAdressAkt() && vorgangDreiZeilen() && findeAdresszeile(4)){ /* Floater */ }
```

### Anzeige: `#blaetterPane`, `vorgangBestandBlock()`

`renderBlaetter()` stellt `vorgangBestandBlock()` voran; die Funktion liefert `''`, solange keine Zeile gefunden ist — vor Akt IV bleibt der Reiter unverändert. `#blaetterBox` bekam zwei CSS-Regeln (`.klHead`, `.kl`) analog zu `#kladdeBox`, da diese Klassen dort bisher nicht scoped waren. Die Zählzeile „N von 48" bleibt wörtlich unberührt, weil der Block getrennt von `BLAETTER_KEYS` läuft. Warum nicht `#amtFenster`: das ist nur über `AKT_AMT` erreichbar, und der wird bei `CONFIG.schichtModus=false` gar nicht angeboten.

### Der Absatz im Jahresgespräch: `vorgangJahresBlock()`, Einbau in `showJahresgespraech()`

Bauform exakt wie `rangZeremonieBlock()`: reine Funktion von `amt.schichten`, kein `apply()`, kein `saveAmt()`, von selbst idempotent. Eingebaut zwischen dem Bonuskasten und `${rangZeremonieBlock()}` — erst spricht Zwirn, dann kommt die Urkunde.

**Verifizierter Gleichlauf:** bei `amt.schichten === 30` ist `rangGruppe()` erstmals 2 — die Zeichnungsbefugnis wird in **demselben Panel** verliehen, in dem Akt IV eröffnet wird (der Trepp-Hinweis auf die unleserliche Anschrift), ohne dass eine Zahl dafür eigens gesetzt werden musste. Live geprüft für Schicht 10/20/30/40/50/60: fünf verschiedene Absätze, `hinweis` nur bei 30, ab 60 die Weiter-Zeile `VORGANG_JAHRES_WEITER`. Bewusst **nicht** zyklisch indiziert (`% Länge`) wie `JAHRES_BONI` — die Boni kreisen, die Geschichte nicht.

### Drei Aktzeilen: Langvorgang 4 über das bestehende `fig.akt[]`

Kein neuer Mechanismus: `npcCycle()` rendert `fig.akt[aktStand()-1]` längst für alle elf Figuren.

| Figur | Slot | Zeile |
|---|---|---|
| `lisbeth` | `akt[3]` (Akt IV) | „Fragen Sie Nörgel. Er kann das lesen." |
| `lisbeth` | `akt[4]` (Akt V) | „Ich komme mit. Ich habe ja gefragt." |
| `noergel` | `akt[3]` (Akt IV) | „Gelesen und gezeichnet. Ich bin im Dienst." |

Nörgels Zeile trägt beide Beats zugleich: er liest die Anschrift **und** setzt den Präzedenzfall aus Langvorgang 4 (Kapitel 10, Nr. 4) — ein Monster zeichnet wirksam, weil es im Dienst ist. „Ohne diesen Fall funktioniert Akt V nicht", und dieser eine Satz ist die gesamte Kopplung: kein Zähler, kein Fortschritt, reine Textarbeit auf bestehender W3-Mechanik. Alle drei Zeilen bleiben unter dem 44-Zeichen-Deckel (37/35/42 Zeichen), `knAssertCaps()` prüft das automatisch mit.

### Zustellen: `AKT_ZUSTELLEN`, das Grußpflicht-Problem, wie der Kampf stehen bleibt

```js
const AKT_TUER=1, /* … */ AKT_NPC=11, AKT_ZUSTELLEN=12;
```

Angebot am Anfang des `!kammer`-Zweigs in `scanAktion()`, vor dem Grußpflicht-Block:

```js
if(currentLevel === 2 && boss && !boss.dead && vorgangZustellbar())
  aktBiete(boss.x, boss.y, AKT_ZUSTELLEN, null, 'Zustellen');
```

`boss.x`/`boss.y` sind echte Weltkoordinaten — nie `player.x`/`player.y` (Distanz 0 schlägt sonst jedes andere Angebot).

**Gefundener Konflikt, mitgebaut:** der bestehende Grußpflicht-Block läuft in Ablage V ebenfalls (er steht vor dem `if(currentLevel !== 1) return;`) und bietet bei bis zu 130 ungegrüßten Monstern mit Distanz 0 an — das hätte „Zustellen" mit aktivem Fluch dauerhaft überstimmt. Fix, eine Bedingung an der bestehenden Zeile:

```js
if(near && aktArt !== AKT_ZUSTELLEN) aktBiete(player.x, player.y, AKT_GRUSS, null, 'Grüßen');
```

Weil `aktBiete()` nur innerhalb von 58px zuschlägt, heißt `aktArt === AKT_ZUSTELLEN` genau „der Spieler steht wirklich am Fürsten". Live geprüft: mit `CFX.gruss` gesetzt bleibt das Angebot „Zustellen".

`zustellen()` friert den Kampf ein, ohne ihn anzufassen:

```js
function zustellen(){
  if(state !== 'play' || currentLevel !== 2 || !boss || boss.dead || !vorgangZustellbar()) return;
  state = 'zustellung';
  aktArt = 0; aktSperre = 1; updateHUD();
  el('bossbar').style.display = 'none';
  MUS.swell();
  vorgangPanel(1);
}
```

`update(dt)` beginnt mit `if(state !== 'play') return;` — ein einziger Zustandswechsel friert Horde-Spawner, Boss-KI und Schichtuhr gleichzeitig ein. `killMon()` und die bestehende Siegweiche (`if(m.def.boss && !kammer){ … winGame(); }`) bleiben unberührt: der Boss stirbt während der Zustellung nie, `winGame()` läuft nicht. Live geprüft: `update(0.5)` während `state==='zustellung'` verändert weder `monsters.length` noch `boss.hp`.

**Gefundene, bewusst nicht angefasste Randbedingung:** ein Sieg per reinem Kampf-Tod des Bosses (`killMon()` → `winGame()`, Text „VORGANG ABGESCHLOSSEN") existierte bereits vor W5 und bleibt als eigenständiger, einfacherer Ausgang bestehen. Zustellen ist ein zusätzlicher, erzählerisch reicherer Weg zum Ende, keine Ersetzung — beide Pfade sind mit der Abnahme „wer nie zustellt, spielt weiter" vereinbar, solange der Spieler den Boss auch nicht im reinen Kampf besiegt. *(Überholt am 20.08.2026, siehe „Die Vertagung" direkt unten: im Fenster vor Akt V ist der Kampf-Tod kein Ausgang mehr.)*

### Die Vertagung (Entscheidung vom 20.08.2026)

**Der Anlass.** GW10 hat die Zustellung an Akt V gebunden (`aktStand() >= 5`, ab Schicht 41). Seither liegen bis zu zehn Schichten zwischen dem Moment, in dem die Ausfertigung vollständig im Bestand liegt, und dem Moment, in dem am Fürsten „Zustellen" angeboten wird. Wer den Fürsten in diesem Fenster erlegt, bekam zwingend den kleineren Ausgang: „SACHVERHALT ERLEDIGT", ein Bildschirm, dessen einziger Ausgang `location.reload()` ist, während er die Ausfertigung in der Kladde trägt. Vor GW10 war dieses Fenster leer, der Fund hat es aufgemacht.

**Was hier ausdrücklich nicht das Problem war.** Es ist keine Sackgasse. `winGame()` setzt nichts zurück, Amt und Kladde überleben den Reload, der Spieler kann später zustellen und das Finale trotzdem sehen. Verloren sind die laufende Schicht und der Moment, nicht der Vorgang. Der Fehler ist tonal: das Haus meldet einen erledigten Sachverhalt, während Vorgang 1 offen in der Kladde liegt.

**Die Entscheidung.** Solange die Ausfertigung im Bestand liegt und noch nicht zugestellt werden darf, endet der Kampf-Tod das Spiel nicht mehr. Der Fürst ist der Nachtrag zu Vorgang 1, und ein offener Vorgang lässt sich nicht erschlagen. Ab Akt V ist der Kampf-Tod wieder ein gültiges Ende: dort ist er eine Entscheidung des Spielers und nicht die Folge einer Schwelle, die ihm niemand genannt hat.

```js
const vorgangVertagt = () => vorgangAusfertigung() && !vorgangZustellbar();
```

**Der Kampf bleibt unverändert**, und diesmal wörtlich: der Boss stirbt, die Beute fällt, `killMon()` läuft bis zur Siegweiche durch, `MUS.swell()` und das Ausblenden der Bossleiste bleiben an ihrem Platz. Es entfällt allein der `setTimeout`-Sprung nach `winGame()`, an seiner Stelle stehen drei Zeilen aus `VERTAGT_ZEILEN`:

> VERTAGT · Der Sachverhalt ist erledigt. · Der Vorgang nicht.

Sie nennen den Zustand, nicht den Weg dorthin. Ein Hinweis auf die Zustellung wäre ein Questmarker und ist aus demselben Grund verboten wie am Kommentar zu `winGame()` und an `VORGANG_PUZZLE`.

**Warum drei Konstanten statt drei Literale in `killMon()`:** so laufen die Zeilen durch die Formregeln in `vorgangAssert()` Block 9 wie jeder andere Text dieser Phase (Gedankenstrich, Emoji, `undefined`, Sperrvermerk). Bauform wie `markiereAdressTueren()` aus GW16: der Guard prüft den Term, der im Spiel läuft, nicht seine Abschrift.

**Kein neues Feld, kein neues Prädikat.** `vorgangVertagt()` liest ausschließlich `vorgangAusfertigung()` und `vorgangZustellbar()`. Der Fürst kehrt nicht in derselben Schicht zurück (`shadowKills >= 500 && !boss`, und `boss` bleibt als toter Verweis gesetzt); er steht beim nächsten Massenvorgang wieder da, nach den nächsten 500 Kills in Ablage V.

**Gemessen am laufenden Spiel** (`killMon()` am echten Fürsten, `state`, Floater und `#ovPanel` nach 2,6 Sekunden gelesen, also nach dem 2000er-Fenster von `winGame()`):

| Ausgangslage | direkt nach dem Kill | nach 2,6 s |
|---|---|---|
| Schicht 35, Ausfertigung vollständig | VERTAGT, Bossleiste aus | `state` bleibt `play`, kein Panel |
| Schicht 12, Ausfertigung, ohne Zeichnungsbefugnis | VERTAGT | `state` bleibt `play`, kein Panel |
| Schicht 45, Ausfertigung vollständig | keine Vertagung | `state` = `win`, „SACHVERHALT ERLEDIGT" |
| Schicht 35, ohne Ausfertigung | keine Vertagung | `state` = `win`, „SACHVERHALT ERLEDIGT" |

### Das Modus-Gate (Entscheidung vom 20.08.2026)

**Die Zusage.** Die Abnahme unten sagt seit W5: „`CONFIG.schichtModus = false` bricht nichts, `vorgangZustellbar()` bleibt falsch." Die Funktion las `CONFIG` nirgends. Das stand seit dem 06.08.2026 als unbelegte Zusage in `GW-RESTFUNDE-2026-08-06.md`.

**Was beim Nachlesen herauskam:** materiell stimmte sie. `setzeKammerTueren()` markiert die drei Adresskammern nur unter `if(vorgangAdressAkt())`, und die vierte Zeile in `killMon()` hängt an derselben Bedingung. `vorgangAdressAkt() = CONFIG.schichtModus && aktStand() >= 4`. Ein Spielstand, der nur im Nicht-Schichtmodus gelaufen ist, kommt also nie an eine Ausfertigung, und ohne Ausfertigung ist `vorgangZustellbar()` falsch.

**Falsch war sie nur für den Mischfall:** ein im Schichtmodus gespielter Stand, dessen `kladde.vorgang` und `amt.schichten` persistiert danebenliegen, danach `CONFIG` umgelegt. Dort war Zustellen möglich.

**Die Entscheidung:** das Gate nachziehen, im Muster von `vorgangAdressAkt()`. Damit ist es dieselbe Klasse, die GW5 für W4 und GW6 für W7 geschlossen hat, und W5 war der letzte Rest davon.

```js
const vorgangZustellbar = () => CONFIG.schichtModus && vorgangAusfertigung() && rangZeichnungsbefugt() && aktStand() >= 5;
const vorgangVertagt    = () => CONFIG.schichtModus && vorgangAusfertigung() && !vorgangZustellbar();
```

**Das zweite Gate ist keine Formalie.** Ohne es wäre die Vertagung im Nicht-Schichtmodus mit mitgebrachtem Vollbestand dauerhaft wahr, weil `vorgangZustellbar()` dort jetzt immer falsch ist. Ein solcher Stand hätte gar kein Ende mehr, weder Zustellung noch Kampf-Tod. Im Nicht-Schichtmodus läuft der Vorgang nicht, also wird dort auch nichts vertagt.

**Was dabei stehen bleibt:** trägt ein Nicht-Schichtmodus-Stand den Vollbestand mit, zeigt der Kessel-Reiter weiter „Die Ausfertigung ist vollständig. … Zugestellt wird im fünften Akt." Einen fünften Akt gibt es dort nicht, weil es keine Schichten gibt. Das ist hingenommen: die Zeile beschreibt den Bestand richtig, und ein modusabhängiger zweiter Wortlaut wäre ein Erklärsystem für einen Zustand, den nur eine Quellcodeänderung herstellen kann.

**Gemessen, Vollbestand in beiden Modi:**

| `schichtModus` | Schicht | `vorgangZustellbar()` | `vorgangVertagt()` | `vorgangAdressAkt()` |
|---|---|---|---|---|
| true | 12 | false | true | false |
| true | 39 | false | true | true |
| true | 40 | **true** | false | true |
| true | 60 | **true** | false | true |
| false | 12 / 39 / 40 / 60 | false | false | false |

Dazu `killMon()` am Fürsten im Nicht-Schichtmodus, mit und ohne mitgebrachten Vollbestand: beide Male `winGame()` wie vor W5, keine Vertagung.

**Der Guard beißt.** Block 4, der Abnahmesatz, prüft die Zusage jetzt wörtlich: mit `schichtModus=false`, vollem Bestand und Schicht 40 und 60 müssen beide Prädikate falsch sein. Zwei Sabotagen live gefahren, beide gemeldet — Gate an `vorgangZustellbar()` entfernt (Meldung bei 40 und 60), Gate an `vorgangVertagt()` entfernt (dieselben zwei Meldungen für die Vertagung). Block 7 erzwingt für seinen Sollwert-Sweep zusätzlich `schichtModus = true`, Muster `langAssert()`/GW6: sonst hinge der ganze Block am echten `CONFIG`-Wert und liefe bei `false` ins Leere, statt zu fallen.

### Die Vertagung, Nachweise

**Der Guard beißt.** Block 7 trägt den Sollwert der Vertagung mit, ausgeschrieben in einer anderen Größe als ihre Definition: die Funktion liest `rangZeichnungsbefugt()` und `aktStand()`, der Sollwert nur den Schichtwert. Zwei Sabotagen live gefahren, beide gemeldet — die Negation entfernt (`vorgangVertagt() weicht vom Sollwert ab, schichten=40`, plus die Zählzeile) und die Aktschwelle von 5 auf 4 verschoben (Meldung bei 30 und 39). Ohne Sabotage `vorgangAssert() === true`, alle sieben Guards true, `console.error` abgefangen und leer.

### Schlusspanel und Abspann: eine Schreibstelle, drei Schritte

`vorgangPanelHtml(schritt)` (reiner Stringbauer) und `vorgangPanel(schritt)` (schreibt `#ovPanel`, zeigt `#overlay`). Die Zahl der `#ovPanel`-Schreibstellen steigt dadurch von sieben auf acht.

1. Die Zustellung — „Vierhundert Jahre. Und Sie kommen einfach vorbei."
2. Die vier Puzzleteile (`VORGANG_PUZZLE`) plus „Der Vorgang 1 wird geschlossen."
3. Abspann als Scrollblock, `location.reload()`.

**Fehlende Puzzleteile blockieren nie**, der Text passt sich an (`p.frei() ? p.text : p.sonst`). Teil 1 (Der Stift) ist **im Regelfall gefüllt**: `JAHRES_BONI[3]` (Dienstsiegel) fällt bei Schicht 40, und „Zustellen" verlangt seit GW10 dieselbe Schwelle (`aktStand() >= 5`). Die Sonst-Fassung bleibt trotzdem stehen, denn garantiert ist das Siegel nicht: `showJahresgespraech()` hängt am WEITER-Knopf des Dienstberichts, `amt.schichten` ist zu diesem Zeitpunkt aber schon gespeichert. Wer auf dem Bericht neu lädt, bekommt `JAHRES_BONI[3]` nie und steht mit `aktStand() === 5` und falschem `rangDienstsiegel()` da. *(Korrektur GW10, zweite Fassung: hier stand zuerst „faktisch nie leer", danach „kann im gesamten Akt IV leer sein". Die erste Fassung war falsch, die zweite beschrieb den Zustand vor der Codeänderung vom 06.08.2026. „Nie leer" bleibt in beiden Welten falsch.)* Teil 3 (dreifache Ausfertigung) liest `kladde.crafts > 0`. Teile 2 und 4 (Zeuge, Gegenzeichnung) sind reiner Text ohne Bedingung — die eigene Zeichnungsbefugnis reicht für die Gegenzeichnung ausdrücklich nicht, das übernimmt Sturz.

Für Teil 1 eine Wahrheitsquelle: `INSIGNIEN` bekam `k:'siegel'` am bestehenden Dienstsiegel-Eintrag, bewusst **ohne** `wirkung:true` — `rangAssert()` zählt hart genau zwei wirkende Insignien (Zeichnungsbefugnis, Registraturschlüssel), das bleibt W6. `rangDienstsiegel()` ist die neue, einzige Leserstelle.

Der vierte Takt der Amtshymne bleibt Text, aus demselben Grund wie in W6: `MUS` hat keine Takt-/Stop-API. Der Abspann trägt die Zeile „Der Amtsmarsch läuft heute einmal ganz durch. Niemand ruft dazwischen." als Callback zur W6-Zeremonie, ohne Audioeingriff außer dem bestehenden `MUS.goto('office')`.

### Der Guard: `vorgangAssert()` (Selbstaufruf hinter `langAssert();`)

*(Korrektur GW: bei `45912f6` stand er direkt hinter `rangAssert();`. W7 hat ihn nach unten verschoben, weil `vorgangPanelHtml()` seither `langFertig()` liest — von der alten Stelle aus ein TDZ-ReferenceError. Der Grund steht im Code an der Definition.)*

Bauform wörtlich wie `rangAssert()`. Zehn Prüfblöcke: Tabellenform der vier Adresszeilen (Biom-Zuordnung, Ankerprüfung auf `VORGANG_ANSCHRIFT`), Vollständigkeit von `SERIE_AKT` gegen die tatsächlich in `BLAETTER` vorkommenden Serien, Gatter-Sweep über `amt.schichten` 0-60 (nie ein Rücksprung, Schwellen exakt bei 10/20/30/40), der Abnahmesatz mit gespiegeltem `schichtModus=false` *(seit 20.08.2026 zusätzlich mit vollem Bestand bei Schicht 40 und 60, siehe „Das Modus-Gate")*, Bestandsprädikate über alle 16 Teilmengen von `kladde.vorgang` (ohne `findeAdresszeile()` aufzurufen — die schriebe `saveKladde()` und überschriebe den echten Stand), W6-Kopplung (`INSIGNIE.siegel`, `rangDienstsiegel()`, `rangZeichnungsbefugt()` exakt ab Schicht 30), der Sollwert-Sweep Ausfertigung × Schichtschwelle über 0/30/39/40 *(Korrektur GW10: bis 06.08.2026 ein Kreuzprodukt „genau eine von vier Kombinationen". Das konnte gar nicht anders als aufgehen — bei zwei fixierten Faktoren ist immer genau eine Kombination wahr, unabhängig davon, was die Funktion tut. Jetzt wird gegen einen ausgeschriebenen Sollwert geprüft, und 39/40 ist der Randwert der neuen Aktschwelle. Seit dem 20.08.2026 trägt derselbe Sweep den Sollwert von `vorgangVertagt()` mit, samt Zählzeile „genau dreimal wahr".)*, die drei Aktzeilen-Anker, Formregeln/Sperrvermerk über jede neue Tabelle, und zuletzt die tatsächlich gerenderten Blöcke HTML-gestrippt (`vorgangJahresBlock()` für zehn Schichtwerte, alle drei Schlusspanel-Schritte inklusive beider Fassungen der bedingten Puzzleteile, `vorgangBestandBlock()` leer und voll).

Alle Spiegel (`amt.schichten`, `CONFIG.schichtModus`, `kladde.vorgang`, `amt.bonusNachwachsen`, `kladde.crafts`) werden exakt zurückgesetzt, kein `saveAmt()`, kein `saveKladde()` während der Prüfung.

## Was in W5 ausdrücklich nicht angefasst wird

* Die bestehende **Siegweiche** in `killMon()` (`m.def.boss && !kammer` → `winGame()`) — blieb in W5 Zeile für Zeile unverändert (byte-identisch gegen `ad72e37` geprüft), *(Korrektur GW9: hier stand „`killMon()` und die Siegweiche". `killMon()` selbst wurde in W5 sehr wohl angefasst — zwei Zeilen geändert, vier plus Kommentar hinzugefügt; dieses Dokument beschreibt den Einbau neunzig Zeilen weiter oben selbst.)* der Kampf-Tod-Ausgang existierte weiter parallel zu Zustellen. *(Überholt am 20.08.2026: die Vertagung hängt sich in genau diese Weiche, siehe oben. Unverändert bleiben `MUS.swell()`, das Ausblenden der Bossleiste und der Kampf selbst; entfallen ist der Sprung nach `winGame()`, solange `vorgangVertagt()` wahr ist.)*
* Die Horde-Spawner-Logik selbst (`monsters.length < 130 && (!boss || boss.dead)`) — pausiert bereits, solange der Boss lebt, `zustellen()` nutzt nur den `state`-Wechsel.
* `blaetterAssert()`, `BLAETTER`, `BLAETTER_KEYS`, die Zählzeile „N von 48" — die vier Adresszeilen laufen über einen eigenen Bestand.
* Die Anrede der Figuren (18.5) — bleibt offen, wie in W6 vermerkt.
* Kapitel 10, Langvorgänge 1, 2, 3, 5-9 — bleiben ungebaut, sie dürfen den Hauptvorgang laut Weltbibel ohnehin nie blockieren.
* Verbotsliste unberührt: kein Dialogbaum, keine Antwortauswahl, kein Gesprächssystem, keine Cutscene, keine Vertonung, keine Questmarker, keine zweite Währung.

## Abnahme W5

* Aktstand bleibt abgeleitet über `aktStand()`, keine zweite Wahrheitsquelle. *(Korrektur GW: der Gatter-Sweep prüft `serieFrei()` und beweist das **nicht** — er liefe unverändert durch, wenn daneben ein `amt.akt` gepflegt würde. Die Aussage stimmt, der Beleg trug nicht.)*
* Serien C-F schalten in Biom-Reihenfolge über Akt 2-5 frei, A/B bleiben ungegated — live am Sweep 0/9/10/19/20/29/30/39/40/50 bestätigt.
* `CONFIG.schichtModus = false` bricht nichts: alle Serien bleiben offen, Adresskammern werden nicht markiert, `vorgangZustellbar()` bleibt falsch — live geprüft. *(Nachtrag 20.08.2026: bis dahin galt der letzte Halbsatz nur mittelbar, über `vorgangAdressAkt()`, und für einen aus dem Schichtmodus mitgebrachten Stand gar nicht. Seit dem Modus-Gate steht er direkt in der Funktion und wird von Block 4 geprüft, siehe „Das Modus-Gate" oben.)*
* Vier Adresszeilen aus drei Sonderkammern (je ein Biom) plus Ablage-V-Drop, garantiert statt gewürfelt, Sonderschild selbstheilend nach dem Fund.
* „Zustellen" erscheint ausschließlich mit vollständiger Ausfertigung, Zeichnungsbefugnis (Schicht ≥30), Akt V (`aktStand() >= 5`, also Schicht ≥40) und lebendem Boss in Ablage V — live an allen Randbedingungen einzeln widerlegt (fehlende Zeile, zu früh, Grußpflicht-Fluch, außerhalb Ablage V). *(Korrektur GW10: bis 06.08.2026 vier Randbedingungen und Schwelle 30. Die Aktbedingung kam hinzu, damit Puzzleteil 1 nicht im ganzen Akt IV leer bleibt.)*
* Der Kampf bleibt unverändert: `zustellen()` friert nur `state`, `update(dt)` tut während der Zustellung nachweislich nichts.
* Schlusspanel in drei Schritten, alle Puzzleteil-Texte passen sich an, kein Puzzleteil blockiert Zustellen.
* Wer nie zustellt, spielt unendlich weiter. *(Präzisiert am 20.08.2026: der Kampf-Tod-Ausgang bleibt parallel bestehen, aber erst ab Akt V und für jeden, der die Ausfertigung nie eingesammelt hat. Wer sie trägt und noch nicht zustellen darf, bekommt die Vertagung und spielt die Schicht weiter — live an allen vier Randfällen belegt, siehe die Tabelle oben.)*

## Bewusst offen für spätere Bauabschnitte

* Die Anrede der Figuren (18.5).
* Kapitel 10, Langvorgänge 1, 2, 3, 5-9.
* ~~Ob der reine Kampf-Tod-Ausgang (`winGame()` über `killMon()`) narrativ an Zustellen angeglichen werden soll.~~ **Entschieden am 20.08.2026**, siehe „Die Vertagung" oben: nicht angeglichen, sondern eingegrenzt. Der Text von `winGame()` bleibt, wie er ist; er wird nur nicht mehr gezeigt, solange ein offener Vorgang in der Kladde liegt.
* Die Urkundenvorlage/Puzzleteil-Texte variieren nicht je nach vorherigem Spielverlauf jenseits der beiden Fassungen (frei/sonst) — eine Setzung dieser Phase.

## Live geprüft

Node-Syntaxcheck nach jedem Bauschritt, danach live im Browser (`preview_start` auf Port 8378), Prüfungen per Konsole (Spiegel gesetzt und exakt zurückgesetzt, kein `saveAmt()`/`saveKladde()` außer bei den echten Fundtests):

* Start: keine Konsolenmeldung, `vorgangAssert()` liefert `true`, alle vier bestehenden Guards (`blaetterAssert`, `knAssertCaps`, `rangAssert`, `auftragAssertBrett`) weiterhin still.
* Gatter-Sweep für Schicht 0/9/10/19/20/29/30/39/40/50: exakte Matrix, C/D/E/F schalten genau bei 10/20/30/40 frei, A/B immer frei.
* `schichtModus=false` bei Schicht 0: alle sechs Serien frei, `vorgangAdressAkt()` und `vorgangZustellbar()` falsch.
* `vorgangJahresBlock()` für Schicht 10/20/30/40/50/60: fünf unterschiedliche Absätze, `hinweis` nur bei 30, ab 60 die Weiter-Zeile.
* Echte Schicht (Schicht 30 gespeichert, neu geladen, Dienst angetreten): `setzeKammerTueren()` markiert genau eine Tür je Biom mit `t.adr`, die zweite Tür im selben Biom bleibt unmarkiert.
* Adresskammer live betreten (Grasland, `t.adr='2'`): Schild zeigt `AKTEN-/ZEICHEN` statt `GEBÜHREN-/BESCHEID`. `truheOeffnen()` liefert garantiert die Adresszeile plus Floater, unabhängig vom regulären Aktenfund-Wurf. Kessel-Reiter zeigt „DIE ANSCHRIFT" mit der gefundenen Zeile, die drei übrigen als „noch nicht gefunden", Zählzeile „N von 48" unverändert korrekt für die separat gefundenen Blätter.
* Wiederbetreten nach `verlasseKammer()`: `t.adr && !vorgangHat(t.adr)` liefert `false`, Schild fällt zurück auf `GEBÜHREN-/BESCHEID`.
* Ablage V, `shadowKills=500`, Boss per `makeMon('boss', …)` gesetzt (Spawn-Loop lief im Headless-Pane nicht von selbst, direkter Aufruf ist die dokumentierte Konsolen-Verifikation für nicht direkt spielbare Mechaniken): mit Zeilen 1-3 im Bestand liefert ein `findeAdresszeile(4)`-Test die vierte Zeile.
* `scanAktion()` mit Boss auf Spielerposition: Angebot „Zustellen" erscheint nur bei vollständiger Ausfertigung **und** Schicht ≥30. Gegenproben je einzeln widerlegt: Zeile 4 fehlt → kein Angebot; Schicht 29 → kein Angebot; `CFX.gruss` aktiv → Angebot bleibt „Zustellen", nicht „Grüßen". *(Korrektur GW10: die Randwerte lauten seit 06.08.2026 Schicht 39 → kein Angebot, Schicht 40 → Angebot. Der damalige Test bei 29/30 ist damit überholt, nicht widerlegt.)*
* `fuehreAktion()` → `zustellen()`: `state` wechselt zu `'zustellung'`, Bossleiste verschwindet, Panel 1 zeigt den korrekten Text. `vorgangPanel(2)`/`vorgangPanel(3)` durchgeklickt: Puzzleteile mit `bonusNachwachsen=0/kladde.crafts=0` zeigen die Sonst-Texte, mit `bonusNachwachsen=20/kladde.crafts=1` die Haupttexte. Abspann korrekt, `boss.dead` bleibt `false` während der gesamten Zustellung.
* `update(0.5)` während `state==='zustellung'`: `monsters.length` und `boss.hp` unverändert — der Kampf ist nachweislich eingefroren, nicht nur pausiert per Konvention.
* Abnahme-Gegenprobe `schichtModus=false`: alle Serien frei, `vorgangAdressAkt()` falsch, unabhängig von `amt.schichten`.
* Konsole blieb über alle Prüfungen leer, keine einzige Exception.

---

## Nachtrag: Korrektur zur Weltbibel, vollständig

*(GW26e. Der Abschnitt oben deklarierte nur eine der drei Änderungen, die `45912f6` an `superduper-weltbibel.md` vorgenommen hat. Wo die Soll-Autorität im selben Commit an den Bau angepasst wird, kann sie den Bau nicht mehr widerlegen — deshalb muss die Liste vollständig sein.)*

* **Kapitel 9** („Vier Kammern, vier Bereiche, ein Blatt pro Kammer") wurde auf drei Sonderkammern plus Ablage V umgeschrieben. Im Fließtext oben begründet, im Korrekturabschnitt nicht deklariert.
* **Kapitel 3, „Kammer-Sonderfall"** wurde neu gefasst („es gibt genau eine je Biom, und nur in Akt IV"). Nirgends deklariert.
* **Kapitel 14**, Statusmarker — erwartbar und unstrittig.

## Nachtrag: was der Guard nicht deckt

*(GW16. Die Abnahmezeilen zu garantiertem Drop, selbstheilendem Schild, den vier Randbedingungen von „Zustellen" und dem eingefrorenen Kampf stützen sich weiterhin auf eine einmalige Konsolensitzung.)*

Die Adresskammer-Markierung **ist inzwischen abgedeckt**. Sie ist dafür aus `setzeKammerTueren()` in die eigene Funktion `markiereAdressTueren(tueren)` gezogen worden — der Guard prüft damit genau den Code, der auch im Spiel läuft, nicht eine Abschrift davon. Die Funktion schreibt nur `t.adr` auf die übergebene Liste, liest `ADRESS_ZEILEN` und `vorgangHat()` und rührt weder `saveKladde()` noch den gesiegelten Weltstrom an; sie ist deshalb aus einem Guard heraus aufrufbar, der beim Laden läuft.

Prüfpunkt (11) fährt sie über alle 16 Bestandsmasken auf einer Attrappenliste aus sechs Türen und prüft die Invarianten, die unabhängig davon gelten, welche Tür der Zufall trifft: je unerledigter Zeile mit Biom genau **eine** Markierung, jede Markierung auf einer Tür des **richtigen** Bioms, keine Markierung auf einer bereits gefundenen Zeile oder auf Zeile 4 (die kein Biom hat), und das Sonderschild sondert genau dann, wenn die Zeile noch fehlt. Drei Sabotagen — falsches Biom, erneutes Markieren einer gefundenen Zeile, gar keine Markierung — werden gemeldet.

**Weiterhin nicht abgedeckt** und weiterhin nur durch eine einmalige Konsolensitzung belegt: der garantierte Drop in `truheOeffnen()`, der `killMon()`-Kanal für die vierte Adresszeile, das `AKT_ZUSTELLEN`-Angebot in `scanAktion()`, der Grußpflicht-Fix und das Einfrieren in `zustellen()`. Für sie gilt der Grund unverändert: `findeAdresszeile()` ruft `saveKladde()`, und eine Prüfung, die nur die reinen Prädikate nachrechnet, sähe nach Abdeckung aus und wäre keine.

