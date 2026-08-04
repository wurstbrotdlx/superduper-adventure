## W6: Rang und Laufbahn — ERLEDIGT

Umbau-Prompt zu Bauabschnitt W6 aus `superduper-weltbibel.md`, Kapitel 17 (dessen Unterabschnitte 18.1 bis 18.12 heißen — Vorsicht, danach folgt ein zweites, andersartiges Kapitel 18 „Der Spieltitel") und Kapitel 14. Kapitel 17 kannte keinen eigenen Bauabschnitt; diese Phase ergänzt ihn in Kapitel 14 als W6, hinter W5. Inhaltslieferung ist die Weltbibel selbst (Laufbahntabelle, Zeremonie-Beats, Insignien), die Formulierungen drumherum (Urkundentext, Knöterich-Sätze, Dienstausweis-Chrome) sind diese Phase, geprüft über `rangAssert()` (Abschnitt „Der Guard" unten), nicht in einer separaten Prüfsession.

Alle unten genannten Bezeichner und Zeilennummern wurden gegen den Stand nach Commit `68ac326` geprüft, plus die Änderungen dieser Phase. Zeilennummern verschieben sich beim Arbeiten, die Bezeichner nicht: such nach dem Bezeichner, nimm die Zeile nur als Wegweiser.

### Grundsatz: was diese Phase nicht ist

Kein neues `amt`-Feld, keine `loadAmt()`-Ladezeile, kein zweiter Zähler neben `amt.schichten`. Amtsbezeichnung, Laufbahngruppe und Dienstverhältnis sind **abgeleitet**, exakt wie der bestehende `aktStand()` — eine Beförderung ist kein Ereignis mit Nebenwirkung, sondern eine Eigenschaft der Zahl `amt.schichten`. Nichts wird angewendet, nichts gespeichert, jedes Neurendern ist von selbst idempotent. Das ist strikt anders als `showJahresgespraech()`, das mit `JAHRES_BONI[i].apply(); saveAmt();` einen echten Seiteneffekt hat.

Die Anrede der Figuren (18.5) wird **nicht** gebaut: kein Titel wird an `DORF_FIGUREN`-Zeilen durchgereicht, keine der sieben Charakterisierungen. Das bleibt ausdrücklich offen. Ebenso nicht gebaut: alles aus 18.9 bis 18.11 (Wappen, Ränge der Gegenseite, Titelmaschine) außer den zwei Wahlsprüchen als Zeilen in Urkunde/Ausweis — es entsteht keine Heraldik.

### Die Formel, die alles trägt: `rangStufe()` neben `aktStand()` (`index.html:6750`ff.)

```js
const rangStufe = () => Math.floor(amt.schichten / 5);
```

Da `10 | n ⟹ 5 | n`, ist jedes Jahresgespräch zwingend eine Beförderung — die bestehende Weiche `nachSchicht()` (`if(amt.schichten % 10 === 0)`) liefert die Zeremonie-Kopplung geschenkt, kein bedingter Zweig, kein zweiter Zähler. Bei `amt.schichten === 0` liefert `rangStufe()` 0, also Monsterangelegenheitenanwärter — kein Sonderfall, Stolzregel 18.6.1 verlangt das ausdrücklich (niemand ist je ohne Titel).

### Laufbahntabelle: `RAENGE`, `roemisch()`, Ableitungen (`index.html:6751`ff.)

19 Einträge, wörtlich aus 18.3, danach römische Ziffern im Kreis (18.4):

```js
const RAENGE = [
  {t:'Monsterangelegenheitenanwärter', g:0, v:0}, /* … 17 weitere … */
  {t:'Monstralminister ohne Geschäftsbereich', g:3, v:2, spitze:true},
];
function roemisch(n){ /* Greedy-Konverter, deckt jede Schichtzahl ab */ }
function rangName(){
  const i = rangStufe(), letzt = RAENGE.length - 1;
  return i <= letzt ? RAENGE[i].t : RAENGE[letzt].t + ' ' + roemisch(i - letzt + 1);
}
```

`rangGruppe()`/`rangGruppeName()`/`rangVerhaeltnis()` lesen denselben `rangDef()`-Eintrag. Live geprüft (Konsole): Schicht 95 liefert `Monstralminister ohne Geschäftsbereich II`, die erste Fortsetzung jenseits der Tabelle.

### Insignien: `INSIGNIEN`, zwei mit echter Wirkung (`index.html:6751`ff.)

Eine Wahrheitsquelle je Insignie, gleiches Prinzip wie beim Rang selbst — sonst die Falle aus Fund F1 (zwei Stellen behaupten dasselbe, driften auseinander). Sieben sind reine Deko-Namen, zwei wirken:

```js
{n:'Zeichnungsbefugnis', k:'zeichnung', wirkung:true, wenn:()=> rangGruppe() >= 2},   // ab Schicht 30
{n:'Zweiter Schlüssel zur Registratur', k:'schluessel', wirkung:true, wenn:()=> rangGruppe() >= 3},   // ab Schicht 55
```

Das Dienstsiegel hängt bewusst am bestehenden Jahresbonus `amt.bonusNachwachsen`, nicht am Rang, genau wie 18.7 es beschreibt. Zeichnungsbefugnis hat in W6 keinen mechanischen Verbraucher — ihr Verbraucher ist „Zustellen" in W5 — aber zwei echte Leser: die Insignienliste des Dienstausweises und der Guard, sonst wäre sie totes Prädikat.

### Beförderungszeremonie: `rangZeremonieBlock()`, Einbau in `showJahresgespraech()`

Urkunde (14 Zeilen, absichtlich zu lang, in einem Scrollkasten `max-height:38vh` — dasselbe Idiom wie `showDorf()` schon nutzt), vier Zeremonie-Fixzeilen (Aushändigung · „Auf die Form!" · Hymne setzt ein · Hymne bricht ab), ein Knöterich-Satz, der von Beförderung zu Beförderung wärmer wird (9 Sätze für Schicht 10 bis 90, danach eine Wiederholungszeile). Eingebaut nach dem Jahresbonus-Kasten, vor dem WEITER-Knopf — der Bonus ist das Geschenk, die Ernennung der Rechtsakt.

**Hymnenabbruch ist Text, nicht Audio.** `MUS` hat keine Takt-API und keinen Stop, der Scheduler loopt endlos an der Taktgrenze. Ein echter Abbruch nach Takt 3 bräuchte einen neuen Pfad im Audiokern — das wäre „Vertonung" aus der Verbotsliste. `showJahresgespraech()` ruft aber ohnehin `MUS.goto('office'); MUS.muffle(false);` in seiner ersten Zeile, der Marsch setzt beim Öffnen also tatsächlich hörbar ein. Zwei Panelzeilen protokollieren Einsatz und Abbruch, während der Marsch darunter unverändert weiterläuft — die Diskrepanz zwischen Protokoll und Klang ist die beste Fassung des Gags, ohne eine Zeile Audiocode. Der vierte Takt bleibt für den Abspann reserviert, also für W5.

### Dienstbericht und zwei Beats: `rangBerichtBlock()`, Einbau in `endShift()`

Rechtsakt vs. abgeleiteter Wert (18.1): bei einem Zehnerschritt liegt die Urkunde erst im Jahresgespräch bereit, bei den Fünferschritten dazwischen wird die Hebung direkt gemeldet. Zwei sich ausschließende Zeilen, beide abgeleitet, beide idempotent. Die zwei geplanten Beats (Schicht 25: Knöterich erklärt in vier vollkommen ernsten Sätzen, warum Monstralamtsinspektor niedriger ist als Monstralinspektor; Schicht 45: Knöterich, Amtsrat a. D. im gleichen Rang, steht auf, sagt „Kollege.", setzt sich wieder) laufen hier statt im Jahresgespräch, weil dort keine Zeremonie stattfindet. Kein neuer Merker nötig — `amt.schichten` passiert beide Werte strukturell genau einmal.

### Sichtbarkeit ohne neue Panels: `showDorf()` und `renderAmtFenster()`

Je eine zusätzliche Zeile mit Amtsbezeichnung/Gruppe/Verhältnis. Sofort mit dem Auge prüfbar bei Schicht 0.

### Dienstausweis: `#ausweis`, `toggleAusweis()`, `renderAusweis()` (sieben Eingriffe)

Bauform Punkt für Punkt vom `#kessel`/`#schloss`-Panel abgeschaut: HTML-Gerüst mit festen Kind-IDs, CSS inklusive Media Query und 44-Pixel-Tap-Target, `ausweisOpen`-Zustand, Inventar-Knopf `#ausweisBtn` (keine eigene Taste — `K/I/T/M/F/E/R/Q` sind belegt, das Inventar genügt), Escape-Zweig, `bakeUiSkin()`-Ergänzung, Aufräumung in `startShift()`/`respawnPlayer()`/`endShift()`.

**Das Lichtbild braucht kein neues Grafiksystem.** `player.hair` wird in `startShift()` ohnehin pro Schicht neu gewürfelt, die Kleidung folgt der getragenen Rüstung über das bestehende `bakeHeroSheet()`. Der Weltbibel-Gedanke „jeden Tag ein anderes Gesicht" war also schon vorhanden, ohne dass ihn je jemand gezeigt hat. `renderAusweisFoto()` schneidet einen 16×18-Ausschnitt aus dem bestehenden `SHEETS['hero_baked']`-Bake, Idle-Frame 0:

```js
const sx = BAKED_HERO_ANIM.idle.offset * 64 + 24;
c.drawImage(s.img, sx, 20, 16, 18, 0, 0, cv.width, cv.height);
```

Kein neues Sheet, kein zweites Bake. Live geprüft mit allen sechs Frisuren einzeln (siehe unten), Ausschnitt `sy:20, sh:18` hat sich als ausreichend erwiesen, keine Frisur stößt oben an.

### Zweiter Registraturschlüssel: Eingriff in `npcSprechen()`, Bramsche-Zweig

Minimaler Eingriff, nur im mittleren Zweig (`n.bramscheJustAsked`):

```js
if(rangSchluessel()){
  bramscheFragePending = true;   // die Frage ist nie verbraucht, es gibt nichts abzuweisen
  npcCycle(n, fig);
} else {
  /* unverändert: Abweisung */
}
```

Ohne Schlüssel byteidentisch zum Bestand. Mit Schlüssel bleiben alle Kanäle erreichbar (F liefert abwechselnd Antwort und Grundzeile, die Aktzeile bleibt es auch) — eine naheliegendere „immer antworten"-Variante hätte Grundzeilen und Aktzeile stillgelegt. Null neue Bramsche-Texte, die Wirkung ist die Abwesenheit einer Zeile. Dazu eine Wiederholungssperre für `fig.antworten` (`bramscheLastAntwort`), Vorbild `knRandnotiz()`/`knRandLastLine` — nötig, weil unbegrenztes Nachfragen sonst die Zufallsziehung sichtbar macht.

### Der Guard: `rangAssert()` (`index.html`, direkt hinter den Ausweis-Texten), Bauform wie `auftragAssertBrett()`

TDZ-sicher: liest nur `amt` (weit oberhalb deklariert und geladen) und die Tabellen aus diesem eigenen Block, nichts aus `AUFTRAG_TYPEN`/`BIOME_MOBS`/`DORF_FIGUREN`. Neun Prüfungen: Tabellenform, Monotonie (eine gehobene Stelle sinkt nie, 18.2), Ankerprüfung gegen vier Sollstrings, Abbildung mit gespiegeltem `amt.schichten` über 0..200 (kein `saveAmt()` währenddessen, wörtlich das Idiom aus `auftragAssertBrett()`), Wechselpunkte, Zeremonie-Kopplungsbeweis, römische Fortsetzung (2..500, nie leer, nie eine Ziffer), Insignien-Prädikate gegen ihre Tabelleneinträge, und Formregeln/Sperrvermerk über alle neuen Texte — nicht nur die Rohtabellen, sondern zusätzlich die tatsächlich gerenderten `rangBerichtBlock()`/`rangZeremonieBlock()`-Ausgaben über HTML-Strip, exakt wie `auftragAssertBrett()` `def.titel(a)`/`def.satz(a)` prüft statt nur die Tabelle dahinter.

**Kein Zeichendeckel.** Alle neuen Texte sind freier Panel-Text (`#ovPanel`, `#ausweis`) — der Kommentar bei `knAssertCaps()` stellt fest, dass Panel-Text keinem Deckel unterliegt. Bramsche bekommt keine neue Zeile, also wandert nichts in `knAssertCaps()`.

## Was in W6 ausdrücklich nicht angefasst wird

* `loadAmt()`/`saveAmt()`/`AMT_KEY` — keine Ladezeile, kein `amt`-Feld, keine Migration.
* `amt.schichten` selbst — weiter genau eine Schreibstelle in `endShift()`.
* `nachSchicht()` und `aktStand()` — die Zehnerweiche wird gelesen, nicht umgebaut.
* `JAHRES_BONI` und `showJahresgespraech()`s Bonuslogik — die Zeremonie ist Zusatztext im selben Panel.
* Der Audiokern — `ZONES.office`, Scheduler, `MUS` bleiben Zeile für Zeile unverändert.
* `bakeHeroSheet()`, `SHEETS`, `loadAssets()` — das Lichtbild liest den vorhandenen Bake.
* Der Renderloop — keine neue Zeichenstelle, keine Prädikatabfrage pro Frame.
* `#ovPanel` — keine `id` im Inneren, weiter nur über `document.getElementById`. Die Zahl der Schreibstellen bleibt sieben, W6 erweitert zwei bestehende Templates.
* `RANDNOTIZ.levelup` und Lotts `anlass.levelup` — geprüft: beide hängen am Charakter-Stufenaufstieg (`gainXP()` → `knRandnotiz('levelup')`), nicht an `amt.schichten`. Sie werden durch W6 richtiger, nicht falscher, und bleiben deshalb unverändert.
* Die sieben wirkungslosen Insignien existieren nur als Namen — kein Sprite, kein Dorfobjekt, das ist Grafikarbeit.
* Akt V, Zustellen, Ausfertigung — bleiben W5. Zeichnungsbefugnis ist in W6 nur ein Prädikat mit zwei Lesern (Ausweis, Guard).
* Verbotsliste unberührt: kein Dialogbaum, keine Antwortauswahl, kein Gesprächssystem, keine Cutscene, keine Vertonung, keine Questmarker, keine zweite Währung. Der Rang kostet kein Gold und lässt sich nicht kaufen (18.2).

## Abnahme W6

* Amtsbezeichnung ab der ersten Sekunde: Schicht 0 zeigt „Monsterangelegenheitenanwärter" in Dorf, Amtsstube und Dienstausweis (live geprüft).
* Beförderung alle 5 Schichten, nie zurückgesetzt, nie herabgestuft: `rangAssert()` beweist Monotonie über alle 19 Ränge plus die römische Fortsetzung.
* Jede zweite Beförderung als Zeremonie im bestehenden Jahresgespräch, ohne bedingten Zweig — strukturell garantiert durch `10 | n ⟹ 5 | n`, vom Guard bewiesen und live an Schicht 10 bestätigt (Bonus und Zeremonie im selben Panel).
* Dienstausweis aus dem Inventar erreichbar, schließt beim Öffnen das Inventar, Escape schließt ihn korrekt, Lichtbild wechselt mit Frisur/Rüstung, kein Text im Spiel kommentiert das.
* Zwei Insignien wirken echt: Zeichnungsbefugnis ab Schicht 30, zweiter Registraturschlüssel ab Schicht 55 (Bramsches Abweisung entfällt, alle Kanäle bleiben erreichbar) — beide Schwellen live an den Randwerten 29/30 und 54/55 bestätigt.
* Idempotenz: `showDorf()` rendert bei jedem Kauf neu, die Rangzeile bleibt jedes Mal identisch, keine Meldung erscheint zweimal (live geprüft).
* Sperrvermerk und Formregeln: Guard prüft Gedankenstrich, Emoji, Kesselgrammatik-Begriffe über jede Tabelle und jeden gerenderten Block.
* `CONFIG.schichtModus = false` bricht nichts: Dienstausweis und `rangBerichtBlock()` funktionieren unverändert (live geprüft).

## Bewusst offen für spätere Bauabschnitte

* Die Anrede der Figuren (18.5) — kein Titel-Durchreichen an `DORF_FIGUREN`, keine der sieben Charakterisierungen.
* W5 (Der Vorgang) liest `rangZeichnungsbefugt()` für die Kontextaktion „Zustellen" — hier nur das Prädikat, kein Verbraucher.
* Die Urkundenvorlage variiert nicht je Rang (ein Template mit interpolierten Feldern statt 19 Einzeltexten) — eine Setzung dieser Phase, keine aus der Weltbibel abgeleitete Zahl.
* Heraldik (18.9), Titelmaschine (18.11), Ränge der Gegenseite (18.10) bleiben ungebaut.

## Live geprüft

Node-Syntaxcheck nach jedem Bauschritt, danach live im Browser (`preview_start` auf Port 8378), Prüfungen per Konsole statt Durchspielen (`amt.schichten`-Manipulation, gespiegelt und zurückgesetzt, kein `saveAmt()` außer bei den zwei echten Weichen-Tests):

* Start: keine Konsolenmeldung, `rangAssert()` manuell aufgerufen liefert `true`.
* Ganze Laufbahn per Sweep (`s = 0..200`, Schritt 5) gegen 18.3/18.4 gelesen: alle 19 Bezeichnungen, Gruppen und Verhältnisse exakt, römische Fortsetzung ab Schicht 95 korrekt bei „… II".
* Zeremonie isoliert gerendert für Schicht 10 und 90: Urkunde im Scrollkasten, alle vier Fixzeilen, Knöterich-Satz „Notiert." bei der ersten, wärmerer Satz bei der letzten benannten Zeremonie. Auf `mobile` (375×812) greift der Scrollkasten sauber, der Rest des Panels bleibt lesbar.
* `rangBerichtBlock()` für 24/25/29/30/44/45/50: leer außerhalb der Fünferschritte, Hebungszeile plus vier Beat-Sätze bei 25, Hebungszeile plus „Kollege." plus zwei Berichtzeilen bei 45, Urkunde-bereitliegend-Zeile ohne Beat bei 30/50.
* Insignien-Schwellen bei 29/30/54/55: `[false,false]`, `[true,false]`, `[true,false]`, `[true,true]` — exakt wie erwartet.
* Bramsche live über `npcSprechen()`: bei Schicht 55 acht Aufrufe ohne eine einzige Abweisung, sauberer Wechsel Antwort/Grundzeile, keine Antwort zweimal hintereinander, Aktzeile im erweiterten Lauf erreicht. Bei Schicht 54 dieselbe Prozedur: zweiter Aufruf weist korrekt ab.
* Dienstausweis über echte UI-Interaktion (Spiel gestartet, Inventar geöffnet, Knopf geklickt): Inventar schließt sich beim Öffnen, Rahmenoptik gleicht `#kessel`, alle Felder und die Insignienliste korrekt für Schicht 0, Escape schließt den Ausweis. Lichtbild mit allen sechs Frisuren durchgebacken, keine wirft, Frisur `h5` (potenzieller Grenzfall) visuell sauber im Ausschnitt.
* Die Weiche echt ausgelöst: `amt.schichten=9` → `endShift('amt')` meldet „Urkunde liegt bereit", WEITER führt ins Jahresgespräch mit Zeremonie (Bonus und Beförderung im selben Panel). `amt.schichten=14` → meldet die Hebung direkt, WEITER führt ins Dorf, dort steht der neue Rang; drei Käufe danach lassen die Rangzeile unverändert.
* Randfälle: `CONFIG.schichtModus=false` bricht Dienstausweis und Dienstbericht nicht, `amt.schichten=0` zeigt den Anwärter und einen leeren `rangBerichtBlock()`.
* Konsole blieb über alle Prüfungen leer, keine einzige Exception.
